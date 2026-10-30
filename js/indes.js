
(() => {
  const C = document.getElementById('game-canvas'), X = C.getContext('2d');
  const W = 800, H = 400, GY = 340;
  const $ = id => document.getElementById(id);
  const R = (a, b) => a + Math.random() * (b - a);
  const ov = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  const BIOMES = [
    { n: 'Floresta', sky: ['#7ccf5a', '#d6f5b0'], gr: '#2f6b24', bc: '#4d7f3a' },
    { n: 'Deserto',  sky: ['#f2a65a', '#fbe3a8'], gr: '#c28b43', bc: '#8a4b1f' },
    { n: 'Caverna',  sky: ['#2b2440', '#4a3f6b'], gr: '#3a3350', bc: '#7b4fc9' },
    { n: 'Gelo',     sky: ['#8fd3f4', '#e6f7ff'], gr: '#cfe9f5', bc: '#6fa8c9' },
    { n: 'Vulcão',   sky: ['#5a1a12', '#c2441f'], gr: '#2b1511', bc: '#e0451f' },
  ];

  const K = {
    jump: ['Space', 'ArrowUp', 'KeyW'], crouch: ['ArrowDown', 'KeyS'],
    left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'],
    sword: ['KeyX', 'KeyJ', 'KeyK'], shield: ['KeyC', 'KeyL'],
    dash: ['ShiftLeft', 'ShiftRight', 'KeyZ'],
  };
  const K2 = {
    jump: ['KeyI'], crouch: ['KeyM'],
    left: ['KeyJ'], right: ['KeyL'],
    sword: ['KeyU'], shield: ['KeyO'],
    dash: ['KeyH'],
  };

  const down = new Set();
  const act = (n, keys = K) => keys[n].some(c => down.has(c));

  let S = {};
  try { S = JSON.parse(localStorage.getItem('dino-stats') || '{}'); } catch (e) {}
  S.games |= 0; S.best |= 0; S.bosses |= 0;
  const save = () => { try { localStorage.setItem('dino-stats', JSON.stringify(S)); } catch (e) {} };

  let st = 'ready', paused = false, twoPlayer = false;
  let P, P2, obs, items, proj, boss, dist, biome, bossAt, t, scr, kills, bk, bonus, habit, nextSp, hit, toast = 0, toastT = '';

  const say = s => { toastT = s; toast = 150; };
  const createPlayer = (x = 120) => ({ x, y: GY, vy: 0, face: 1, hp: 5, en: 100, sw: 0, swc: 0, dash: 0, dcd: 0, inv: 0, duck: false, sh: false, step: 0 });
  const playerList = () => (twoPlayer && P2) ? [P, P2] : [P];
  const pb = (p = P) => ({ x: p.x - 14, y: p.y - (p.duck ? 26 : 44), w: 28, h: p.duck ? 26 : 44 });
  const sb = (p = P) => p.sw > 0 ? { x: p.face > 0 ? p.x + 10 : p.x - 70, y: p.y - 46, w: 60, h: 46 } : null;
  const bb = () => ({ x: boss.x, y: GY - boss.h, w: boss.w, h: boss.h });
  const score = () => Math.floor(dist / 10) + bonus;

  function reset() {
    P = createPlayer(120);
    P2 = twoPlayer ? createPlayer(160) : null;
    obs = []; items = []; proj = []; boss = null;
    dist = 0; biome = 0; bossAt = 5000; t = 0; scr = 0; kills = 0; bk = 0; bonus = 0;
    habit = { j: 0, d: 0 }; nextSp = 60; hit = new Set();
    say(twoPlayer ? '2 Jogadores' : BIOMES[0].n);
  }

  const show = id => $(id).classList.add('active');
  const hide = id => $(id).classList.remove('active');
  const modalOpen = () => document.querySelector('#help-modal.active,#stats-modal.active');

  function start() {
    reset(); st = 'run'; paused = false;
    hide('game-modal'); $('dino-hint').classList.add('hide');
  }

  function over() {
    st = 'over'; S.games++;
    const s = score(); if (s > S.best) S.best = s;
    save();
    $('res-score').textContent = s; $('res-best').textContent = S.best;
    $('res-biome').textContent = BIOMES[biome % 5].n; $('res-bosses').textContent = bk;
    show('game-modal');
  }

  function hurt(blockable, p = P) {
    if (p.hp <= 0 || p.inv > 0 || p.dash > 0) return;
    if (blockable && p.sh && p.face === 1) { p.en = Math.max(0, p.en - 10); p.inv = 10; return; }
    p.hp--; p.inv = 70;
    if (!twoPlayer && p.hp <= 0) over();
    if (twoPlayer && playerList().every(j => j.hp <= 0)) over();
  }

  function swingSword(p) {
    if (p.swc <= 0) { p.sw = 12; p.swc = 22; hit.clear(); }
  }

  function updatePlayer(p, keys) {
    if (p.hp <= 0) return;
    if (act('left', keys)) { p.x -= 3; p.face = -1; }
    if (act('right', keys)) { p.x += 3; p.face = 1; }
    const cr = act('crouch', keys);
    p.duck = cr && p.y >= GY;
    p.vy += .7 + (cr && p.y < GY ? .9 : 0); p.y += p.vy;
    if (p.y >= GY) { p.y = GY; p.vy = 0; }
    if (act('jump', keys) && p.y >= GY) { p.vy = -14; habit.j++; }
    if (p.dash > 0) { p.dash--; p.x += p.face * 8; }
    p.x = Math.max(50, Math.min(boss ? W - 200 : 420, p.x));
    p.sh = act('shield', keys) && p.en > 0 && !p.dash;
    p.en = p.sh ? Math.max(0, p.en - .45) : Math.min(100, p.en + .12);
    if (act('sword', keys)) swingSword(p);
    if (act('dash', keys) && p.dcd <= 0 && p.en >= 20 && !p.dash) { p.dash = 14; p.dcd = 70; p.en -= 20; }
    ['sw', 'swc', 'dcd', 'inv'].forEach(k => { if (p[k] > 0) p[k]--; });
    p.step += .25;
  }

  // ---------- Entrada ----------
  addEventListener('keydown', e => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    const rep = e.repeat; down.add(e.code);
    if (rep) return;
    if (e.code === 'Digit2') {
      twoPlayer = !twoPlayer;
      reset();
      st = 'ready';
      say(twoPlayer ? '2 Jogadores' : BIOMES[0].n);
      return;
    }
    if (st !== 'run') { if (e.code === 'Space' && !modalOpen()) start(); return; }
    if (paused) return;
    if (K.jump.includes(e.code) && P.y >= GY) { P.vy = -14; habit.j++; }
    if (K.crouch.includes(e.code)) habit.d++;
    if (K.sword.includes(e.code) && P.swc <= 0) swingSword(P);
    if (K.dash.includes(e.code) && P.dcd <= 0 && P.en >= 20 && !P.dash) { P.dash = 14; P.dcd = 70; P.en -= 20; }
    if (twoPlayer) {
      if (K2.jump.includes(e.code) && P2.y >= GY) { P2.vy = -14; habit.j++; }
      if (K2.crouch.includes(e.code)) habit.d++;
      if (K2.sword.includes(e.code) && P2.swc <= 0) swingSword(P2);
      if (K2.dash.includes(e.code) && P2.dcd <= 0 && P2.en >= 20 && !P2.dash) { P2.dash = 14; P2.dcd = 70; P2.en -= 20; }
    }
  });
  addEventListener('keyup', e => down.delete(e.code));
  addEventListener('blur', () => down.clear());

  // ---------- Spawns ----------
  function spawn() {
    const r = Math.random();
    if (r < .12) items.push({ k: Math.random() < .5 ? 'heart' : 'crystal', x: W + 20, y: GY - R(24, 70) });
    else if (r < .45) obs.push({ k: 'bird', x: W + 20, y: GY - 58, w: 30, h: 22 });
    else { const h = R(26, 46); obs.push({ k: 'low', x: W + 20, y: GY - h, w: R(22, 36), h }); }
  }
  function spawnBoss() {
    const hp = 8 + 3 * Math.min(biome, 10);
    boss = { x: W - 170, w: 90, h: 100, hp, max: hp, s: 'idle', tm: 90, atk: null, n: 0, flash: 0 };
  }
  function killBoss() {
    bk++; S.bosses++; bonus += 100; boss = null; proj = [];
    playerList().forEach(p => { if (p.hp > 0) p.hp = Math.min(5, p.hp + 1); });
    biome++; bossAt = dist + 5000; nextSp = 90;
    say(BIOMES[biome % 5].n); save();
  }

  // O chefe aprende: quem pula muito leva golpe alto, quem agacha muito leva finta.
  function pick() {
    boss.n++;
    if (boss.n % 4 === 0) return 'slam';
    const w = [['high', 1 + habit.j], ['finta', 1 + habit.d], ['low', 2]];
    let r = R(0, w.reduce((s, x) => s + x[1], 0));
    for (const [k, v] of w) if ((r -= v) <= 0) return k;
    return 'low';
  }

  function fire() {
    const a = boss.atk, vx = -6.5 - Math.min(biome, 6) * .3;
    const mk = (y, dx = 0) => proj.push({ x: boss.x - 20 + dx, y, w: 26, h: 20, vx, c: '#ff5252' });
    if (a === 'low') mk(GY - 20);
    else if (a === 'high') mk(GY - 54);
    else if (a === 'finta') { mk(GY - 20); mk(GY - 54, 110); }
    else {
      playerList().forEach(p => { if (p.hp > 0) hurt(false, p); });
      boss.s = 'stun'; boss.tm = 150; return;
    }
    boss.s = 'rec'; boss.tm = 40;
  }

  // ---------- Atualização ----------
  function step() {
    t++;
    const wsp = 4.5 + Math.min(biome, 8) * .5 + Math.min(dist / 30000, 1.5);
    scr += wsp;

    updatePlayer(P, K);
    if (twoPlayer && P2) updatePlayer(P2, K2);
    if (toast > 0) toast--;

    if (!boss) {
      dist += wsp;
      if (dist < bossAt) { if (--nextSp <= 0) { spawn(); nextSp = R(50, 110) - Math.min(biome * 4, 25); } }
      else if (!obs.length) spawnBoss();
    }

    const alive = playerList().filter(p => p.hp > 0);
    obs = obs.filter(o => {
      o.x -= wsp + (o.k === 'bird' ? 1.5 : 0);
      if (o.x + o.w < -10) return false;
      for (const p of alive) {
        const box = pb(p);
        if (sb(p) && ov(sb(p), o)) { kills++; bonus += 10; return false; }
        if (ov(box, o)) { hurt(true, p); return false; }
      }
      return true;
    });

    items = items.filter(i => {
      i.x -= wsp; if (i.x < -20) return false;
      for (const p of alive) {
        const box = { x: i.x - 11, y: i.y - 11, w: 22, h: 22 };
        if (ov(pb(p), box)) {
          if (i.k === 'heart') p.hp = Math.min(5, p.hp + 1); else p.en = Math.min(100, p.en + 40);
          return false;
        }
      }
      return true;
    });

    proj = proj.filter(p => {
      p.x += p.vx; if (p.x < -40) return false;
      for (const j of alive) {
        if (sb(j) && ov(sb(j), p)) { bonus += 5; return false; }
        if (ov(pb(j), p)) { hurt(true, j); return false; }
      }
      return true;
    });

    if (boss) {
      boss.tm--; if (boss.flash > 0) boss.flash--;
      if (boss.tm <= 0) {
        if (boss.s === 'idle') { boss.atk = pick(); boss.s = 'tel'; boss.tm = 45; }
        else if (boss.s === 'tel') fire();
        else { boss.s = 'idle'; boss.tm = R(60, 110); }
      }
      const playerBoxes = alive.map(p => ({ p, s: sb(p) }));
      for (const { p, s } of playerBoxes) {
        if (!hit.has('b') && s && ov(s, bb())) {
          hit.add('b'); boss.hp -= boss.s === 'stun' ? 2 : 1; boss.flash = 6;
          if (boss.hp <= 0) killBoss();
          break;
        }
      }
    }

    $('game-score').textContent = score();
  }

  // ---------- Desenho ----------
  function drawDino(p, color = '#2e7d32') {
    X.save(); X.translate(p.x, p.y); X.scale(p.face, 1);
    if (p.inv > 0 && (t >> 2) & 1) X.globalAlpha = .4;
    const d = p.duck, lg = p.y >= GY ? Math.sin(p.step) * 4 : 0;
    X.fillStyle = color; X.fillRect(-9, -10, 7, 10 + lg); X.fillRect(2, -10, 7, 10 - lg);
    X.fillStyle = color === '#2e7d32' ? '#43a047' : '#60a5fa';
    if (d) { X.fillRect(-20, -24, 36, 16); X.fillRect(8, -32, 18, 14); }
    else { X.fillRect(-14, -36, 26, 26); X.fillRect(-22, -30, 9, 8); X.fillRect(4, -48, 22, 16); }
    X.fillStyle = '#fff'; X.fillRect(18, d ? -28 : -44, 4, 4);
    if (p.sw > 0) {
      const a = -1.3 + (12 - p.sw) / 12 * 2.6;
      X.strokeStyle = '#e5e7eb'; X.lineWidth = 5; X.beginPath();
      X.moveTo(12, -24); X.lineTo(12 + Math.cos(a) * 55, -24 + Math.sin(a) * 55); X.stroke();
    }
    if (p.sh) { X.strokeStyle = '#42a5f5'; X.lineWidth = 4; X.beginPath(); X.arc(16, -26, 24, -1.2, 1.2); X.stroke(); }
    X.restore();
  }

  function drawBoss() {
    const b = BIOMES[biome % 5], r = bb();
    X.fillStyle = boss.flash ? '#fff' : boss.s === 'stun' ? '#9e9e9e' : b.bc;
    X.fillRect(r.x, r.y, r.w, r.h);
    X.fillStyle = '#fff'; X.fillRect(r.x + 14, r.y + 20, 14, 12); X.fillRect(r.x + 42, r.y + 20, 14, 12);
    X.fillStyle = '#000'; X.fillRect(r.x + 18, r.y + 24, 6, 6); X.fillRect(r.x + 46, r.y + 24, 6, 6);
    X.textAlign = 'center'; X.font = 'bold 22px sans-serif';
    if (boss.s === 'tel') {
      const slam = boss.atk === 'slam';
      X.strokeStyle = slam ? '#e040fb' : '#ffeb3b'; X.lineWidth = 4; X.strokeRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6);
      X.fillStyle = X.strokeStyle;
      X.fillText({ low: '⬇', high: '⬆', finta: '?', slam: '!!' }[boss.atk], r.x + r.w / 2, r.y - 12);
    }
    if (boss.s === 'stun') { X.fillStyle = '#ffeb3b'; X.fillText('★ ★', r.x + r.w / 2, r.y - 8); }
    X.fillStyle = '#000'; X.fillRect(W / 2 - 150, 14, 300, 10);
    X.fillStyle = '#ef4444'; X.fillRect(W / 2 - 150, 14, 300 * Math.max(0, boss.hp) / boss.max, 10);
  }

  function draw() {
    const b = BIOMES[biome % 5], g = X.createLinearGradient(0, 0, 0, GY);
    g.addColorStop(0, b.sky[0]); g.addColorStop(1, b.sky[1]);
    X.fillStyle = g; X.fillRect(0, 0, W, H);
    X.fillStyle = 'rgba(0,0,0,.12)';
    for (let i = -1; i < 6; i++) { const x = i * 180 - (scr * .2 % 180); X.beginPath(); X.moveTo(x, GY); X.lineTo(x + 90, GY - 110); X.lineTo(x + 180, GY); X.fill(); }
    X.fillStyle = b.gr; X.fillRect(0, GY, W, H - GY);
    X.fillStyle = 'rgba(0,0,0,.18)';
    for (let i = 0; i < 20; i++) X.fillRect(i * 60 - (scr % 60), GY + 12 + (i % 3) * 14, 20, 3);

    obs.forEach(o => {
      if (o.k === 'bird') { X.fillStyle = '#37474f'; X.fillRect(o.x, o.y, o.w, o.h); X.fillRect(o.x + 6, (t >> 3) & 1 ? o.y - 10 : o.y + o.h, 16, 10); }
      else { X.fillStyle = '#5d4037'; X.fillRect(o.x, o.y, o.w, o.h); X.fillStyle = '#8d6e63'; X.fillRect(o.x + 3, o.y + 3, o.w - 6, 5); }
    });
    items.forEach(i => {
      X.fillStyle = i.k === 'heart' ? '#ff4081' : '#40c4ff'; X.beginPath(); X.arc(i.x, i.y, 11, 0, 7); X.fill();
      X.fillStyle = '#fff'; X.font = '12px sans-serif'; X.textAlign = 'center'; X.fillText(i.k === 'heart' ? '♥' : '◆', i.x, i.y + 4);
    });
    proj.forEach(p => { X.fillStyle = p.c; X.fillRect(p.x, p.y, p.w, p.h); });
    if (boss) drawBoss();
    drawDino(P, '#2e7d32');
    if (twoPlayer && P2) drawDino(P2, '#2563eb');

    X.fillStyle = `rgba(5,10,40,${(1 - Math.cos(t / 900)) / 2 * .5})`; X.fillRect(0, 0, W, H);

    X.textAlign = 'left'; X.font = '20px sans-serif';
    const renderHP = (p, x, color = '#ef4444') => {
      for (let i = 0; i < 5; i++) { X.fillStyle = i < p.hp ? color : 'rgba(255,255,255,.25)'; X.fillText('♥', x + i * 22, 28); }
      X.fillStyle = 'rgba(0,0,0,.4)'; X.fillRect(x, 38, 110, 9);
      X.fillStyle = '#40c4ff'; X.fillRect(x, 38, 110 * p.en / 100, 9);
    };
    renderHP(P, 10, '#ef4444');
    if (twoPlayer && P2) renderHP(P2, 560, '#60a5fa');

    if (toast > 0) { X.globalAlpha = Math.min(1, toast / 40); X.textAlign = 'center'; X.font = 'bold 28px sans-serif'; X.fillStyle = '#fff'; X.fillText(toastT, W / 2, 80); X.globalAlpha = 1; }
  }

  let last = 0, acc = 0;
  function loop(ts) {
    acc += Math.min(ts - last, 100); last = ts;
    while (acc >= 16.67) { acc -= 16.67; if (st === 'run' && !paused) step(); }
    draw(); requestAnimationFrame(loop);
  }

  // ---------- Modais ----------
  const openM = id => { if (st === 'run') paused = true; show(id); };
  const closeM = () => { ['help-modal', 'stats-modal'].forEach(hide); paused = false; };
  $('btn-help-trigger').onclick = () => openM('help-modal');
  $('btn-stats-trigger').onclick = () => {
    $('stat-played').textContent = S.games; $('stat-best').textContent = S.best; $('stat-bosses').textContent = S.bosses;
    openM('stats-modal');
  };
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = closeM);
  $('btn-new-game-modal').onclick = start;

  reset(); requestAnimationFrame(loop);
})();