(() => {
  const C = document.getElementById('game-canvas'), X = C.getContext('2d');
  const W = 800, H = 400, GY = 340;
  const RENDER_SCALE = 1.5;
  C.width = W * RENDER_SCALE; C.height = H * RENDER_SCALE;
  X.scale(RENDER_SCALE, RENDER_SCALE);
  const $ = id => document.getElementById(id);
  const R = (a, b) => a + Math.random() * (b - a);
  const ov = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

  const BIOMES = [
    {
      n: 'Floresta', sky: ['#7ccf5a', '#d6f5b0'], gr: '#2f6b24', bc: '#4d7f3a', attacks: ['rootSweep', 'vineLash', 'seedBurst', 'thornRain'],
      encounters: {
        creatures: [{ k: 'forestWisp', w: 30, h: 26, flight: 76 }, { k: 'forestMoth', w: 38, h: 26, flight: 92 }, { k: 'mossBeetle', w: 36, h: 26 }],
        obstacles: [{ k: 'mushroom', w: 38, h: 38 }, { k: 'rootArch', w: 48, h: 44 }, { k: 'thornBush', w: 44, h: 32 }],
      },
    },
    {
      n: 'Deserto', sky: ['#f2a65a', '#fbe3a8'], gr: '#c28b43', bc: '#8a4b1f', attacks: ['sandWave', 'sunSpear', 'sandBurst', 'rockFall'],
      encounters: {
        creatures: [{ k: 'vulture', w: 42, h: 28, flight: 82 }, { k: 'scorpion', w: 44, h: 26 }, { k: 'sandSnake', w: 48, h: 24 }],
        obstacles: [{ k: 'cactus', w: 32, h: 52 }, { k: 'sandstone', w: 48, h: 38 }, { k: 'bonePile', w: 48, h: 26 }],
      },
    },
    {
      n: 'Caverna', sky: ['#2b2440', '#4a3f6b'], gr: '#3a3350', bc: '#7b4fc9', attacks: ['echoBolt', 'crystalLance', 'crystalRain', 'shardFan'],
      encounters: {
        creatures: [{ k: 'caveBat', w: 38, h: 26, flight: 108 }, { k: 'caveSlime', w: 36, h: 25 }, { k: 'caveBeetle', w: 38, h: 28 }],
        obstacles: [{ k: 'stalagmite', w: 32, h: 54 }, { k: 'crystalCluster', w: 42, h: 46 }, { k: 'caveBoulder', w: 50, h: 34 }],
      },
    },
    {
      n: 'Gelo', sky: ['#8fd3f4', '#e6f7ff'], gr: '#cfe9f5', bc: '#6fa8c9', attacks: ['iceSlide', 'iceFan', 'icicleRain', 'blizzard'],
      encounters: {
        creatures: [{ k: 'snowOwl', w: 38, h: 28, flight: 84 }, { k: 'iceFox', w: 42, h: 26 }, { k: 'snowHare', w: 36, h: 24 }],
        obstacles: [{ k: 'icicle', w: 30, h: 50 }, { k: 'iceBoulder', w: 46, h: 38 }, { k: 'snowDrift', w: 50, h: 28 }],
      },
    },
    {
      n: 'Vulcão', sky: ['#5a1a12', '#c2441f'], gr: '#2b1511', bc: '#e0451f', attacks: ['magmaWave', 'fireball', 'lavaBurst', 'eruption'],
      encounters: {
        creatures: [{ k: 'emberBat', w: 40, h: 27, flight: 96 }, { k: 'lavaSlug', w: 42, h: 24 }, { k: 'ashRunner', w: 42, h: 26 }],
        obstacles: [{ k: 'lavaVent', w: 42, h: 42 }, { k: 'charRock', w: 46, h: 36 }, { k: 'obsidianSpike', w: 40, h: 44 }],
      },
    },
    {
      n: 'Pântano', sky: ['#143d2c', '#7ad7a2'], gr: '#214e35', bc: '#2b7a5b', attacks: ['bogPulse', 'mireSnare', 'reedBurst', 'swampRain'],
      encounters: {
        creatures: [{ k: 'forestWisp', w: 30, h: 26, flight: 78 }, { k: 'forestMoth', w: 38, h: 26, flight: 90 }, { k: 'mossBeetle', w: 36, h: 26 }],
        obstacles: [{ k: 'mushroom', w: 38, h: 38 }, { k: 'stump', w: 42, h: 30 }, { k: 'thornBush', w: 44, h: 32 }],
      },
    },
    {
      n: 'Montanha', sky: ['#94a3b8', '#eef2ff'], gr: '#475569', bc: '#7c8ea2', attacks: ['stoneThrow', 'avalanche', 'ridgeStrike', 'windSlam'],
      encounters: {
        creatures: [{ k: 'snowOwl', w: 38, h: 28, flight: 84 }, { k: 'vulture', w: 42, h: 28, flight: 82 }, { k: 'mossBeetle', w: 36, h: 26 }],
        obstacles: [{ k: 'rock', w: 42, h: 28 }, { k: 'spikes', w: 40, h: 20 }, { k: 'iceBoulder', w: 46, h: 38 }],
      },
    },
    {
      n: 'Mar', sky: ['#0f3d63', '#7bd9ff'], gr: '#1d4f73', bc: '#4fc3f7', attacks: ['waveCrash', 'tideBolt', 'reefBurst', 'mistBurst'],
      encounters: {
        creatures: [{ k: 'caveBat', w: 38, h: 26, flight: 106 }, { k: 'snowOwl', w: 38, h: 28, flight: 84 }, { k: 'forestMoth', w: 38, h: 26, flight: 94 }],
        obstacles: [{ k: 'spikes', w: 40, h: 20 }, { k: 'sandstone', w: 48, h: 38 }, { k: 'rock', w: 42, h: 28 }],
      },
    },
  ];
  const BOSS_NAMES = ['Guardião da Floresta', 'Rei das Areias', 'Senhor da Caverna', 'Gigante de Gelo', 'Titã de Magma', 'Fera do Pântano', 'Colosso da Montanha', 'Leviatã do Mar'];
  // Partículas ambientes por bioma (índice do bioma -> tipo)
  const AMB = {
    0: { c: '#d9f99d', kind: 'fly' }, 2: { c: '#c4b5fd', kind: 'fly' }, 3: { c: '#ffffff', kind: 'snow' },
    4: { c: '#fb923c', kind: 'ember' }, 5: { c: '#bef264', kind: 'fly' }, 6: { c: '#ffffff', kind: 'snow' },
  };
  const SWORDS = [
    { id: 'flame', name: 'Fogo', color: '#fb5b36', ability: 'fere e incendeia o chefe' },
    { id: 'frost', name: 'Gelo', color: '#7dd3fc', ability: 'congela o chefe' },
    { id: 'thunder', name: 'Raio', color: '#facc15', ability: 'causa dano extra e dissipa projeteis' },
    { id: 'venom', name: 'Veneno', color: '#a3e635', ability: 'envenena o chefe' },
    { id: 'wind', name: 'Vento', color: '#5eead4', ability: 'acelera seus movimentos' },
    { id: 'crystal', name: 'Cristal', color: '#c4b5fd', ability: 'cura e protege' },
  ];

  const K = {
    jump: ['KeyW'], crouch: ['KeyS'],
    left: ['KeyA'], right: ['KeyD'],
    sword: ['KeyX'], shield: ['KeyC'],
    dash: ['KeyZ', 'ShiftLeft'], power: ['KeyV'],
  };
  const K2 = {
    jump: ['ArrowUp'], crouch: ['ArrowDown'],
    left: ['ArrowLeft'], right: ['ArrowRight'],
    sword: ['KeyK'], shield: ['KeyL'],
    dash: ['KeyJ', 'ShiftRight'], power: ['KeyP'],
  };

  const down = new Set();
  const act = (n, keys = K) => keys[n].some(c => down.has(c));

  let S = {};
  try { S = JSON.parse(localStorage.getItem('dino-stats') || '{}'); } catch (e) {}
  S.games |= 0; S.best |= 0; S.bosses |= 0;
  const save = () => { try { localStorage.setItem('dino-stats', JSON.stringify(S)); } catch (e) {} };

  let st = 'ready', paused = false, twoPlayer = false;
  let P, P2, obs, items, proj, boss, dist, biome, bossAt, t, scr, kills, bk, bonus, habit, nextSp, hit, toast = 0, toastT = '';
  // Efeitos visuais
  let parts = [], amb = [], shake = 0, fade = 0, lastBi = -1;

  const puff = (x, y, n, c, o = {}) => {
    const s = o.s || 1;
    for (let i = 0; i < n; i++) parts.push({ x, y, vx: R(-1.5, 1.5) * s, vy: R(-2.5, -.3) * s, g: o.g ?? .08, life: R(20, 40), max: 40, r: R(2, 5), c });
  };

  // ---------- Efeitos de espada (partículas) ----------
  const swordTip = p => {
    const swing = p.sw > 0, a = swing ? -1.3 + (12 - p.sw) / 12 * 2.6 : -1.15;
    const reach = (swing ? (swordOf(p)?.id === 'wind' ? 100 : 55) : 34) * (swing ? R(.45, 1) : 1);
    return { x: p.x + p.face * (12 + Math.cos(a) * reach), y: p.y - 24 + Math.sin(a) * reach };
  };
  const swordFx = p => {
    const s = swordOf(p); if (!s) return;
    const q = swordTip(p), n = p.sw > 0 ? 2 : 1;
    switch (s.id) {
      case 'flame': puff(q.x, q.y, n, Math.random() < .5 ? '#fb923c' : '#fde047', { s: .5, g: -.05 }); break;
      case 'frost': puff(q.x, q.y, n, '#e0f2fe', { s: .4, g: .02 }); break;
      case 'thunder': puff(q.x, q.y, n, '#fef08a', { s: 1.5, g: 0 }); break;
      case 'venom': puff(q.x, q.y, n, '#a3e635', { s: .3, g: .12 }); break;
      case 'wind': puff(q.x, q.y, n, '#99f6e4', { s: 1, g: 0 }); break;
      default: puff(q.x, q.y, n, Math.random() < .5 ? '#c4b5fd' : '#ffffff', { s: .5, g: -.02 });
    }
  };

  const refreshStartHint = () => $('p2-hint-keys').classList.toggle('active', twoPlayer);
  const say = s => { toastT = s; toast = 150; };
  const swordOf = p => p.weapon === null ? null : SWORDS[p.weapon];
  const createPlayer = (x = 120) => ({ x, y: GY, vy: 0, face: 1, hp: 5, en: 100, sw: 0, swc: 0, dash: 0, dcd: 0, inv: 0, duck: false, sh: false, step: 0, weapon: null, weaponTimer: 0, powerCd: 0, powerFx: null, windBoost: 0 });
  const canDash = p => st === 'run' && !paused && p.hp > 0 && p.dcd <= 0 && p.en >= 20 && !p.dash;
  const playerList = () => (twoPlayer && P2) ? [P, P2] : [P];
  const pb = (p = P) => ({ x: p.x - 14, y: p.y - (p.duck ? 26 : 44), w: 28, h: p.duck ? 26 : 44 });
  const sb = (p = P) => {
    if (p.sw <= 0) return null;
    const range = swordOf(p)?.id === 'wind' ? 110 : 60;
    return { x: p.face > 0 ? p.x + 10 : p.x - range - 10, y: p.y - 46, w: range, h: 46 };
  };
  const bb = () => ({ x: boss.x, y: GY - boss.h, w: boss.w, h: boss.h });
  const score = () => Math.floor(dist / 10) + bonus;
  const recoverLife = (p, amount = 1) => {
    if (!p || p.hp <= 0) return 0;
    const previousHP = p.hp;
    p.hp = Math.min(5, p.hp + amount);
    return p.hp - previousHP;
  };

  function reset() {
    P = createPlayer(120);
    P2 = twoPlayer ? createPlayer(160) : null;
    refreshStartHint();
    obs = []; items = []; proj = []; boss = null;
    parts = []; amb = []; shake = 0; fade = 0;
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
    $('res-biome').textContent = BIOMES[biome % BIOMES.length].n; $('res-bosses').textContent = bk;
    show('game-modal');
  }

  function hurt(blockable, p = P) {
    if (p.hp <= 0 || p.inv > 0 || p.dash > 0) return;
    if (blockable && p.sh && p.face === 1) {
      p.en = Math.max(0, p.en - 10); p.inv = 10;
      puff(p.x + 22, p.y - 26, 6, '#93c5fd', { s: 1.5 });
      return;
    }
    p.hp--; p.inv = 70;
    shake = 12; puff(p.x, p.y - 24, 14, '#ef4444', { s: 2 });
    if (!twoPlayer && p.hp <= 0) over();
    if (twoPlayer && playerList().every(j => j.hp <= 0)) over();
  }

  function swingSword(p) {
    if (p.swc <= 0) { p.sw = 12; p.swc = swordOf(p)?.id === 'thunder' ? 12 : 22; hit.clear(); }
  }

  function updatePlayer(p, keys) {
    if (p.hp <= 0) return;
    const speed = p.windBoost > 0 ? 6 : 3;
    if (act('left', keys)) { p.x -= speed; p.face = -1; }
    if (act('right', keys)) { p.x += speed; p.face = 1; }
    const cr = act('crouch', keys);
    p.duck = cr && p.y >= GY;
    const wasAir = p.y < GY;
    p.vy += .7 + (cr && p.y < GY ? .9 : 0); p.y += p.vy;
    if (p.y >= GY) {
      p.y = GY; p.vy = 0;
      if (wasAir) puff(p.x, GY, 8, 'rgba(255,255,255,.5)');
    }
    if (act('jump', keys) && p.y >= GY) { p.vy = -14; habit.j++; }
    if (p.dash > 0) { p.dash--; p.x += p.face * 8; if (t % 2 === 0) puff(p.x - p.face * 14, p.y - 20, 1, 'rgba(190,242,100,.6)', { s: .4 }); }
    p.x = Math.max(50, Math.min(boss ? W - 200 : 420, p.x));
    p.sh = act('shield', keys) && p.en > 0 && !p.dash;
    p.en = p.sh ? Math.max(0, p.en - .45) : Math.min(100, p.en + .12);
    if (act('sword', keys)) swingSword(p);
    if (act('dash', keys) && canDash(p)) { p.dash = 14; p.dcd = 70; p.en -= 20; }
    ['sw', 'swc', 'dcd', 'inv', 'powerCd', 'windBoost'].forEach(k => { if (p[k] > 0) p[k]--; });
    if (p.powerFx && --p.powerFx.tm <= 0) p.powerFx = null;
    if (p.weapon !== null && --p.weaponTimer <= 0) {
      const broken = swordOf(p).name;
      p.weapon = null; p.weaponTimer = 0; p.powerCd = 0;
      say(`A espada ${broken} quebrou!`);
    }
    if (p.weapon !== null && (p.sw > 0 || t % 5 === 0)) swordFx(p);
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
      $('dino-hint').classList.remove('hide');
      hide('game-modal');
      say(twoPlayer ? '2 Jogadores' : BIOMES[0].n);
      return;
    }
    if (st !== 'run') { if (e.code === 'Space' && !modalOpen()) start(); return; }
    if (paused) return;
    if (K.jump.includes(e.code) && P.y >= GY) { P.vy = -14; habit.j++; }
    if (K.crouch.includes(e.code)) habit.d++;
    if (K.sword.includes(e.code) && P.swc <= 0) swingSword(P);
    if (K.dash.includes(e.code) && canDash(P)) { P.dash = 14; P.dcd = 70; P.en -= 20; }
    if (K.power.includes(e.code)) activatePower(P);
    if (twoPlayer) {
      if (K2.jump.includes(e.code) && P2.y >= GY) { P2.vy = -14; habit.j++; }
      if (K2.crouch.includes(e.code)) habit.d++;
      if (K2.sword.includes(e.code) && P2.swc <= 0) swingSword(P2);
      if (K2.dash.includes(e.code) && canDash(P2)) { P2.dash = 14; P2.dcd = 70; P2.en -= 20; }
      if (K2.power.includes(e.code)) activatePower(P2);
    }
  });
  addEventListener('keyup', e => down.delete(e.code));
  addEventListener('blur', () => down.clear());

  // ---------- Spawns ----------
  function spawn() {
    const r = Math.random();
    const obstacleBias = Math.min(0.78, 0.5 + biome * 0.06);
    if (r < .09) items.push({ k: Math.random() < .5 ? 'heart' : 'crystal', x: W + 20, y: GY - R(24, 70) });
    else if (r < .2) items.push({ k: 'sword', weapon: Math.floor(Math.random() * SWORDS.length), x: W + 20, y: GY - R(28, 64) });
    else {
      const isCreature = Math.random() > obstacleBias;
      const pool = BIOMES[biome % BIOMES.length].encounters[isCreature ? 'creatures' : 'obstacles'];
      const encounter = pool[Math.floor(Math.random() * pool.length)];
      const y = GY - encounter.h - (encounter.flight || 0);
      obs.push({ ...encounter, creature: isCreature, airborne: !!encounter.flight, x: W + 20, y, baseY: y, phase: R(0, 7) });
    }
  }
  function spawnBoss() {
    const hp = 22 + biome * 18 + Math.max(0, biome - 1) * 12;
    boss = { x: W - 170, w: 90, h: 100, vx: -1.8, moving: true, moveTimer: R(80, 130), pauseTimer: 0, hp, max: hp, s: 'idle', tm: 90, atk: null, n: 0, flash: 0, burn: 0, burnTick: 0, poison: 0, poisonTick: 0, freeze: 0, stunClock: 1200, stunTimer: 0 };
  }
  function killBoss() {
    puff(boss.x + boss.w / 2, GY - 50, 70, BIOMES[biome % BIOMES.length].bc, { s: 3 });
    puff(boss.x + boss.w / 2, GY - 50, 30, '#fde047', { s: 2.5 });
    shake = 25; fade = 1;
    bk++; S.bosses++; bonus += 100; boss = null; proj = [];
    items.push(
      { k: 'heart', x: W + 80, y: GY - 22 },
      { k: 'heart', x: W + 150, y: GY - 22 },
      { k: 'crystal', x: W + 220, y: GY - 42 },
    );
    biome++;
    const survivor = playerList().find(p => p.hp > 0);
    if (twoPlayer && survivor && playerList().some(p => p.hp <= 0)) {
      items.push({ k: 'resurrection', x: Math.min(W - 30, survivor.x + 130), y: GY - 48 });
    }
    bossAt = dist + 5000; nextSp = 90;
    say(BIOMES[biome % BIOMES.length].n); save();
  }

  function damageBoss(amount) {
    if (boss) boss.hp -= amount * (boss.stunTimer > 0 ? 1.5 : 1);
  }

  function applySwordHit(p) {
    damageBoss(p.weapon === null ? 1 : 1.6);
  }

  function applyPowerHit(power) {
    if (!boss) return;
    boss.hp -= power.damage;
    if (power.effect === 'burn') { boss.burn = 180; boss.burnTick = 0; }
    if (power.effect === 'freeze') { boss.freeze = 180; boss.s = 'idle'; boss.atk = null; boss.tm = 70; }
    if (power.effect === 'poison') { boss.poison = 270; boss.poisonTick = 0; }
    boss.flash = 6;
    if (boss.hp <= 0) killBoss();
  }

  function activatePower(p) {
    const sword = swordOf(p);
    if (!sword || p.powerCd > 0) return;
    p.powerCd = 300; p.powerFx = { id: sword.id, tm: 60 };
    if (sword.id === 'flame') {
      const power = { damage: 4, effect: 'burn' };
      if (boss) applyPowerHit(power);
      else proj.push({ x: p.x + p.face * 18, y: p.y - 42, w: 30, h: 26, vx: p.face * 9, vy: 0, c: '#f97316', kind: 'fireball', life: 120, friendly: true, power });
    }
    if (sword.id === 'frost') {
      const power = { damage: 2, effect: 'freeze' };
      if (boss) applyPowerHit(power);
      else proj.push({ x: p.x + p.face * 18, y: p.y - 44, w: 24, h: 32, vx: p.face * 8, vy: 0, c: '#7dd3fc', kind: 'ice', life: 120, friendly: true, power });
    }
    if (sword.id === 'thunder') {
      proj = proj.filter(shot => shot.friendly);
      if (boss) applyPowerHit({ damage: 10 });
      shake = Math.max(shake, 8);
    }
    if (sword.id === 'venom') {
      const power = { damage: 2, effect: 'poison' };
      if (boss) applyPowerHit(power);
      else proj.push({ x: p.x + p.face * 18, y: p.y - 42, w: 24, h: 24, vx: p.face * 7, vy: 0, c: '#a3e635', kind: 'venomOrb', life: 150, friendly: true, power });
    }
    if (sword.id === 'wind') p.windBoost = 240;
    if (sword.id === 'crystal') { p.hp = Math.min(5, p.hp + 2); p.en = 100; p.inv = Math.max(p.inv, 120); }
    puff(p.x, p.y - 30, 14, sword.color, { s: 2 });
    say(`${sword.name}: ${sword.ability}!`);
  }

  function tickBossEffects() {
    if (!boss) return;
    if (boss.stunClock > 0) boss.stunClock--;
    if (boss.stunTimer > 0) boss.stunTimer--;
    else if (boss.stunClock <= 0) {
      boss.stunTimer = 156;
      boss.stunClock = 1200;
      boss.s = 'stun'; boss.atk = null; boss.tm = 0;
      proj = proj.filter(p => p.friendly);
    }
    if (boss.stunTimer === 0 && boss.s === 'stun') { boss.s = 'idle'; boss.tm = 60; }
    if (boss.burn > 0) {
      boss.burn--;
      if (++boss.burnTick >= 30) { boss.burnTick = 0; damageBoss(1); }
    }
    if (boss.poison > 0) {
      boss.poison--;
      if (++boss.poisonTick >= 45) { boss.poisonTick = 0; damageBoss(1); }
    }
    if (boss.hp <= 0) killBoss();
  }

  // Cada chefe percorre seus quatro ataques em ordem.
  function pick() {
    boss.n++;
    const attacks = BIOMES[biome % BIOMES.length].attacks;
    const choices = attacks.filter(attack => attack !== boss.atk);
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function fire() {
    const a = boss.atk, vx = -6.5 - Math.min(biome, 6) * .3;
    const shot = (x, y, w, h, kind, color, speed = vx, vy = 0, life = 180) => {
      const projectile = { x, y, w, h, kind, c: color, vx: speed, vy, life };
      proj.push(projectile);
      const nearCenter = boss.x > W * .22 && boss.x + boss.w < W * .78;
      if (nearCenter && speed !== 0) {
        const xFromOppositeSide = speed < 0 ? boss.x + boss.w - w : boss.x;
        proj.push({ ...projectile, x: xFromOppositeSide, vx: -speed });
      }
      else if (nearCenter && speed === 0) proj.push({ ...projectile, x: boss.x + boss.w - w });
    };
    const launch = (y, w, h, kind, color, speed = vx) => shot(boss.x + (boss.w - w) / 2, y, w, h, kind, color, speed);
    const rain = (kind, color, w, h, count = 2) => playerList().filter(p => p.hp > 0).forEach(p => {
      for (let i = 0; i < count; i++) {
        const targetX = p.x + (i - (count - 1) / 2) * 42;
        proj.push({ x: targetX - w / 2, y: GY - 190 - (i % 2) * 28, w, h, kind, c: color, vx: 0, vy: 7, life: 180 });
      }
    });
    const spread = (kind, color, y, w, h, count = 3) => {
      for (let i = 0; i < count; i++) launch(y - i * 28, w, h, kind, color, vx - i * .7);
    };

    switch (a) {
      case 'rootSweep': launch(GY - 38, 58, 38, 'root', '#795548', -4.5); break;
      case 'vineLash': launch(GY - 105, 78, 16, 'vine', '#4d7c0f', -8.5); break;
      case 'seedBurst': spread('seed', '#84cc16', GY - 18, 18, 16); break;
      case 'thornRain': rain('thorn', '#365314', 14, 34, 3); break;
      case 'sandWave': launch(GY - 30, 60, 30, 'sand', '#d6a64f', -4); break;
      case 'sunSpear': launch(GY - 72, 54, 14, 'sun', '#fbbf24', -10); break;
      case 'sandBurst': spread('sandShard', '#c2410c', GY - 24, 22, 18); break;
      case 'rockFall': rain('rock', '#78716c', 26, 30, 2); break;
      case 'echoBolt': launch(GY - 64, 30, 30, 'echo', '#c4b5fd', -6.5); break;
      case 'crystalLance': launch(GY - 72, 62, 14, 'crystalLance', '#a78bfa', -10); break;
      case 'crystalRain': rain('crystal', '#c4b5fd', 20, 32, 3); break;
      case 'shardFan': spread('shard', '#8b5cf6', GY - 20, 18, 24); break;
      case 'iceSlide': launch(GY - 32, 58, 32, 'iceSlide', '#38bdf8', -5); break;
      case 'iceFan': spread('ice', '#7dd3fc', GY - 18, 18, 28); break;
      case 'icicleRain': rain('icicle', '#e0f2fe', 12, 42, 3); break;
      case 'blizzard': spread('snow', '#f8fafc', GY - 28, 16, 16, 5); break;
      case 'magmaWave': launch(GY - 32, 60, 32, 'magma', '#f97316', -4.5); break;
      case 'fireball': launch(GY - 86, 34, 34, 'fireball', '#ef4444', -6); break;
      case 'lavaBurst': spread('lava', '#f97316', GY - 24, 30, 22); break;
      case 'eruption': shot(boss.x + (boss.w - 36) / 2, GY - boss.h, 36, boss.h, 'eruption', '#fb923c', 0, 0, 42); break;
      case 'bogPulse': launch(GY - 32, 64, 32, 'bog', '#65a30d', -4.5); break;
      case 'mireSnare': launch(GY - 88, 24, 88, 'mire', '#166534', -8); break;
      case 'reedBurst': spread('reed', '#84cc16', GY - 22, 20, 20, 4); break;
      case 'swampRain': rain('swamp', '#4d7c0f', 18, 30, 3); break;
      case 'stoneThrow': launch(GY - 54, 38, 34, 'stone', '#94a3b8', -5.5); break;
      case 'avalanche': rain('snowRock', '#cbd5e1', 28, 30, 3); break;
      case 'ridgeStrike': launch(GY - 92, 72, 18, 'ridge', '#64748b', -9); break;
      case 'windSlam': spread('gust', '#bae6fd', GY - 34, 28, 30, 4); break;
      case 'waveCrash': launch(GY - 42, 74, 42, 'wave', '#38bdf8', -4.5); break;
      case 'tideBolt': launch(GY - 82, 32, 32, 'tide', '#0ea5e9', -8); break;
      case 'reefBurst': spread('reef', '#2dd4bf', GY - 24, 24, 22, 4); break;
      case 'mistBurst': rain('mist', '#bae6fd', 20, 34, 3); break;
      default:
        launch(GY - 34, 52, 34, 'impact', BIOMES[biome % BIOMES.length].bc, vx);
        break;
    }
    boss.s = 'rec'; boss.tm = 48;
  }

  // ---------- Atualização ----------
  function step() {
    t++;
    const wsp = 4.5 + Math.min(biome, 8) * .5 + Math.min(dist / 30000, 1.5);
    scr += wsp;

    // Efeitos visuais
    if (shake > 0) shake--;
    if (fade > 0) fade = Math.max(0, fade - .02);
    parts = parts.filter(p => { p.x += p.vx - wsp * .3; p.y += p.vy; p.vy += p.g; return --p.life > 0; });
    if (t % 6 === 0 && P.y >= GY && P.hp > 0 && P.dash <= 0) puff(P.x - 10, GY, 1, 'rgba(255,255,255,.35)', { s: .5 });
    const am = AMB[biome % BIOMES.length];
    if (am && t % 6 === 0 && amb.length < 40) {
      if (am.kind === 'fly') amb.push({ x: W + 10, y: R(120, GY - 20), vx: R(-.6, -.1), vy: 0, ph: R(0, 7), life: 400, r: 2, c: am.c, kind: 'fly' });
      else if (am.kind === 'snow') amb.push({ x: R(0, W + 60), y: -6, vx: R(-1.4, -.4), vy: R(.6, 1.6), ph: 0, life: 300, r: R(1.2, 2.6), c: am.c, kind: 'snow' });
      else amb.push({ x: R(0, W), y: GY, vx: R(-1, 0), vy: R(-1.8, -.6), ph: 0, life: 120, r: R(1.5, 3), c: am.c, kind: 'ember' });
    }
    amb = amb.filter(a => {
      a.x += a.vx - wsp * .25; a.y += a.vy + (a.kind === 'fly' ? Math.sin(t * .05 + a.ph) * .4 : 0);
      return --a.life > 0 && a.x > -10 && a.y < GY && a.y > -12;
    });

    updatePlayer(P, K);
    if (twoPlayer && P2) updatePlayer(P2, K2);
    if (toast > 0) toast--;

    if (!boss) {
      dist += wsp;
      if (dist < bossAt) { if (--nextSp <= 0) { spawn(); nextSp = R(50, 110) - Math.min(biome * 4, 25); } }
      else if (!obs.length) spawnBoss();
    }
    tickBossEffects();

    const alive = playerList().filter(p => p.hp > 0);
    obs = obs.filter(o => {
      o.x -= wsp + (o.creature ? 1.5 : 0);
      if (o.airborne) o.y = o.baseY + Math.sin(t * .09 + o.phase) * 7;
      if (o.x + o.w < -10) return false;
      for (const p of alive) {
        const box = pb(p);
        if (o.creature && sb(p) && ov(sb(p), o)) {
          kills++; bonus += 10;
          if (recoverLife(p, .25) > 0) say('+1/4 coração');
          puff(o.x + o.w / 2, o.y + o.h / 2, 10, '#fde047');
          return false;
        }
        if (ov(box, o)) { hurt(true, p); return false; }
      }
      return true;
    });

    items = items.filter(i => {
      i.x -= wsp; if (i.x < -20) return false;
      for (const p of alive) {
        const box = { x: i.x - 14, y: i.y - 14, w: 28, h: 28 };
        if (ov(pb(p), box)) {
          if (i.k === 'heart') { p.hp = Math.min(5, p.hp + 1); puff(i.x, i.y, 8, '#ff4081'); }
          else if (i.k === 'crystal') { p.en = Math.min(100, p.en + 40); puff(i.x, i.y, 8, '#40c4ff'); }
          else if (i.k === 'resurrection') {
            const fallen = playerList().find(candidate => candidate.hp <= 0);
            if (fallen) {
              fallen.hp = 3; fallen.en = 100; fallen.x = Math.max(50, Math.min(420, p.x - p.face * 40));
              fallen.y = GY; fallen.vy = 0; fallen.duck = false; fallen.sh = false; fallen.dash = 0; fallen.inv = 180;
              puff(fallen.x, fallen.y - 30, 20, '#c4b5fd', { s: 2 });
              say(`${fallen === P ? 'Jogador 1' : 'Jogador 2'} ressuscitado!`);
            }
          }
          else { p.weapon = i.weapon; p.weaponTimer = 30 * 60; p.powerCd = 0; puff(i.x, i.y, 10, SWORDS[i.weapon].color, { s: 1.5 }); say(`Espada ${SWORDS[i.weapon].name}: poder na tecla ${p === P ? 'V' : 'P'}`); }
          return false;
        }
      }
      return true;
    });

    proj = proj.filter(p => {
      p.x += p.vx || 0; p.y += p.vy || 0;
      if (p.life !== undefined) p.life--;
      if (p.x + p.w < -40 || p.x > W + 40 || p.y >= GY || p.y + p.h < -30 || p.life <= 0) return false;
      if (p.friendly) {
        if (boss && ov(p, bb())) { applyPowerHit(p.power); return false; }
        return true;
      }
      for (const j of alive) {
        if (ov(pb(j), p)) { hurt(true, j); return false; }
      }
      return true;
    });

    if (boss) {
      if (boss.stunTimer <= 0 && boss.freeze <= 0) {
        if (boss.s !== 'tel') {
          if (boss.moving) {
            boss.x += boss.vx;
            if (boss.x <= 180) { boss.x = 180; boss.vx = Math.abs(boss.vx); boss.moving = false; boss.pauseTimer = R(35, 65); }
            else if (boss.x >= W - boss.w - 24) { boss.x = W - boss.w - 24; boss.vx = -Math.abs(boss.vx); boss.moving = false; boss.pauseTimer = R(35, 65); }
            else if (--boss.moveTimer <= 0) { boss.vx *= -1; boss.moving = false; boss.pauseTimer = R(35, 65); }
          } else if (--boss.pauseTimer <= 0) {
            boss.moving = true; boss.moveTimer = R(80, 130);
          }
        }
      }
      if (boss.freeze > 0) boss.freeze--; else boss.tm--;
      if (boss.flash > 0) boss.flash--;
      if (boss.tm <= 0 && boss.freeze <= 0 && boss.stunTimer <= 0 && boss.s !== 'stun') {
        if (boss.s === 'idle') { boss.atk = pick(); boss.s = 'tel'; boss.tm = 45; }
        else if (boss.s === 'tel') fire();
        else { boss.s = 'idle'; boss.tm = R(60, 110); }
      }
      const playerBoxes = alive.map(p => ({ p, s: sb(p) }));
      for (const { p, s } of playerBoxes) {
        if (!hit.has('b') && s && ov(s, bb())) {
          hit.add('b'); applySwordHit(p); boss.flash = 6;
          puff(boss.x + (p.face > 0 ? 0 : boss.w), p.y - 30, 8, '#fff', { s: 1.5 });
          if (boss.hp <= 0) killBoss();
          break;
        }
      }
    }

    $('game-score').textContent = score();
  }

  // ---------- Desenho ----------
  function polygon(points, color) {
    X.fillStyle = color; X.beginPath(); X.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => X.lineTo(x, y));
    X.closePath(); X.fill();
  }

  const rr = (x, y, w, h, r, c) => {
    X.fillStyle = c; X.beginPath();
    if (X.roundRect) X.roundRect(x, y, w, h, r); else X.rect(x, y, w, h);
    X.fill();
  };

  // Texto com contorno para legibilidade
  const otext = (s, x, y) => {
    X.lineJoin = 'round'; X.lineWidth = 3; X.strokeStyle = 'rgba(0,0,0,.55)';
    X.strokeText(s, x, y); X.fillText(s, x, y);
  };

  function drawDino(p, color = '#2e7d32') {
    // Sombra no chão (diminui conforme o dino sobe)
    const k = 1 - Math.min(1, (GY - p.y) / 150);
    X.fillStyle = 'rgba(0,0,0,.25)'; X.beginPath(); X.ellipse(p.x, GY + 3, 20 * k + 6, 4 * k + 1.5, 0, 0, 7); X.fill();

    X.save(); X.translate(p.x, p.y); X.scale(p.face, 1);
    if (p.inv > 0 && (t >> 2) & 1) X.globalAlpha = .4;
    const d = p.duck, lg = p.y >= GY ? Math.sin(p.step) * 4 : 0;
    const green = color === '#2e7d32';
    const c2 = green ? '#43a047' : '#60a5fa', belly = green ? '#c8e6c9' : '#dbeafe';
    X.fillStyle = color; X.fillRect(-9, -10, 7, 10 + lg); X.fillRect(2, -10, 7, 10 - lg);
    if (d) {
      rr(-22, -26, 38, 18, 7, c2); rr(8, -34, 20, 16, 6, c2);
    } else {
      polygon([[-12, -30], [-32, -18 + Math.sin(t * .2) * 3], [-12, -16]], c2); // rabo balançando
      rr(-14, -38, 28, 28, 8, c2);                                              // corpo
      rr(-4, -26, 16, 14, 6, belly);                                            // barriga
      rr(2, -54, 26, 18, 7, c2);                                                // cabeça
      for (let i = 0; i < 3; i++) polygon([[-10 + i * 8, -38], [-6 + i * 8, -46], [-2 + i * 8, -38]], color); // espinhos
    }
    const ey = d ? -30 : -48;
    X.fillStyle = '#fff'; X.fillRect(18, ey, 5, 5);
    X.fillStyle = '#111'; X.fillRect(20, ey + 1, 3, 3);
    const swd = swordOf(p), swing = p.sw > 0;
    if (swing || swd) {
      const a = swing ? -1.3 + (12 - p.sw) / 12 * 2.6 : -1.15 + Math.sin(t * .1) * .05;
      const reach = swing ? (swd?.id === 'wind' ? 100 : 55) : 34;
      if (swing) { X.save(); X.globalAlpha *= .4; X.strokeStyle = swd?.color || '#e5e7eb'; X.lineWidth = 12; X.beginPath(); X.arc(12, -24, reach * .9, -1.3, a); X.stroke(); X.restore(); }
      X.save(); X.translate(12, -24); X.rotate(a + Math.PI / 2);
      if (swd) { X.shadowColor = swd.color; X.shadowBlur = swing ? 16 : 8; }
      drawBlade(swd, reach, swing ? 1.3 : 1.1);
      X.restore();
    }
    if (p.sh) { X.strokeStyle = '#42a5f5'; X.lineWidth = 4; X.beginPath(); X.arc(16, -26, 24, -1.2, 1.2); X.stroke(); }
    X.restore();
  }

  const rgbOf = h => {
    if (typeof h !== 'string' || h[0] !== '#') return '255,255,255';
    let s = h.slice(1); if (s.length === 3) s = s.split('').map(ch => ch + ch).join('');
    const n = parseInt(s, 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
  };

  // Lâminas (apontam para -y; base em y=8, ponta em y≈-18)
  const BLADES = {
    steel: [[-3, 8], [-3, -14], [0, -18], [3, -14], [3, 8]],
    flame: [[-3, 8], [-4, 2], [-2, -3], [-5, -8], [0, -18], [5, -8], [2, -3], [4, 2], [3, 8]],
    frost: [[-3, 8], [-6, -2], [-2, -6], [0, -18], [2, -6], [6, -2], [3, 8]],
    thunder: [[-3, 8], [-1, 0], [-5, -4], [1, -9], [-1, -17], [7, -7], [2, -3], [4, 8]],
    venom: [[-3, 8], [-6, 1], [-2, -4], [-5, -9], [1, -18], [5, -8], [2, -1], [4, 8]],
    wind: [[-3, 8], [-5, -1], [-2, -8], [0, -18], [4, -7], [3, 1], [4, 8]],
    crystal: [[-3, 8], [-6, 1], [-2, -6], [0, -18], [2, -6], [6, 1], [3, 8]],
  };

  // Desenha a espada com a base na origem, apontando para -y (len = comprimento, wid = largura)
  function drawBlade(sword, len, wid) {
    const col = sword ? sword.color : '#cbd5e1';
    X.save(); X.scale(wid, len / 26); X.translate(0, -8);
    polygon(BLADES[sword ? sword.id : 'steel'], lg(0, 8, 0, -18, col, '#ffffff'));
    X.strokeStyle = 'rgba(0,0,0,.45)'; X.lineWidth = 1; X.lineJoin = 'round'; X.stroke();
    X.strokeStyle = 'rgba(255,255,255,.75)'; X.lineWidth = 1; X.beginPath(); X.moveTo(0, 5); X.lineTo(0, -13); X.stroke();
    X.restore();
    X.lineCap = 'round';
    X.strokeStyle = '#fbbf24'; X.lineWidth = 3.5; X.beginPath(); X.moveTo(-6, 0); X.lineTo(6, 0); X.stroke();
    X.strokeStyle = '#78350f'; X.lineWidth = 4; X.beginPath(); X.moveTo(0, 1); X.lineTo(0, 7); X.stroke();
    ell(0, 9, 2.6, 2.6, col);
  }

  // Espada no chão (item coletável)
  function drawSwordSprite(sword) {
    const rgb = rgbOf(sword.color);
    glow(0, 0, 30 + Math.sin(t * .1) * 3, rgb, .5);
    X.save(); X.setLineDash([3, 4]); X.lineDashOffset = -t * .3; X.strokeStyle = `rgba(${rgb},.55)`; X.lineWidth = 1.5;
    X.beginPath(); X.arc(0, -2, 17, 0, 7); X.stroke(); X.restore();
    X.save(); X.translate(0, 10); X.shadowColor = sword.color; X.shadowBlur = 12; drawBlade(sword, 28, 1.2); X.restore();
    for (let i = 0; i < 3; i++) { const a = t * .06 + i * 2.094; star(Math.cos(a) * 17, -2 + Math.sin(a) * 17, 2.4, '#fff'); }
  }

  // Poder da espada (efeito ao redor do jogador)
  function drawPowerEffect(p) {
    if (!p.powerFx) return;
    const { id, tm } = p.powerFx, k = 1 - tm / 60, sw = SWORDS.find(s => s.id === id);
    X.save(); X.translate(p.x, p.y - 30); X.globalAlpha = Math.min(1, tm / 14); X.lineCap = 'round'; X.lineJoin = 'round';
    glow(0, 0, 30 + k * 46, rgbOf(sw.color), .5 * (1 - k * .6));
    if (id === 'flame') {
      X.strokeStyle = '#fb923c'; X.lineWidth = 5 * (1 - k) + 1; X.beginPath(); X.arc(0, 0, 14 + k * 46, 0, 7); X.stroke();
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2 + k * 2, r = 14 + k * 40, fx = Math.cos(a) * r, fy = Math.sin(a) * r * .75, fh = 12 + Math.sin(t * .5 + i) * 4;
        pgo([[fx - 5, fy + 6], [fx, fy - fh], [fx + 5, fy + 6]], '#f97316', 'rgba(0,0,0,0)');
        polygon([[fx - 2.5, fy + 6], [fx, fy - fh * .5], [fx + 2.5, fy + 6]], '#fde047');
      }
    } else if (id === 'frost') {
      const L = 12 + k * 34; X.strokeStyle = '#e0f2fe'; X.lineWidth = 2.5;
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + k * .6, ca = Math.cos(a), sa = Math.sin(a);
        X.beginPath(); X.moveTo(0, 0); X.lineTo(ca * L, sa * L);
        for (const s of [-1, 1]) { const bx = ca * L * .6, by = sa * L * .6, b = a + s * .8; X.moveTo(bx, by); X.lineTo(bx + Math.cos(b) * L * .3, by + Math.sin(b) * L * .3); }
        X.stroke();
      }
      X.strokeStyle = 'rgba(125,211,252,.7)'; X.lineWidth = 2; X.setLineDash([4, 5]); X.beginPath(); X.arc(0, 0, L + 8, 0, 7); X.stroke(); X.setLineDash([]);
      polygon([[-6, 0], [0, -10], [6, 0], [0, 10]], '#f0f9ff');
    } else if (id === 'thunder') {
      const seed = Math.floor(t / 2);
      for (const bx of [-34, 0, 34]) {
        X.beginPath(); X.moveTo(bx, -110);
        for (let j = 1; j <= 6; j++) X.lineTo(bx + Math.sin(j * 12.9 + bx + seed) * 9, -110 + j * 22);
        X.save(); X.shadowColor = '#facc15'; X.shadowBlur = 14; X.strokeStyle = '#fde047'; X.lineWidth = 4; X.stroke(); X.strokeStyle = '#fff'; X.lineWidth = 1.6; X.stroke(); X.restore();
      }
      X.strokeStyle = 'rgba(254,240,138,.8)'; X.lineWidth = 2; X.beginPath(); X.ellipse(0, 30, 10 + k * 70, 4 + k * 8, 0, 0, 7); X.stroke();
    } else if (id === 'venom') {
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4 + t * .04, r = 10 + k * 38 + Math.sin(i * 3) * 6, bx = Math.cos(a) * r, by = Math.sin(a) * r * .8 - k * 14, br = 3 + (i % 3) * 1.6;
        X.fillStyle = 'rgba(163,230,53,.55)'; X.beginPath(); X.arc(bx, by, br, 0, 7); X.fill();
        X.strokeStyle = '#4d7c0f'; X.lineWidth = 1.2; X.stroke(); ell(bx - br * .3, by - br * .3, br * .25, br * .25, 'rgba(255,255,255,.7)');
      }
      X.strokeStyle = 'rgba(132,204,22,.8)'; X.lineWidth = 3; X.beginPath(); X.arc(0, 0, 16 + k * 30, .3, Math.PI * 1.7); X.stroke();
    } else if (id === 'wind') {
      for (let i = 0; i < 3; i++) {
        const sp = t * .25 * (i % 2 ? -1 : 1) + i;
        X.strokeStyle = `rgba(94,234,212,${.9 - i * .2})`; X.lineWidth = 3 - i * .6; X.beginPath(); X.arc(0, 0, 12 + i * 9 + k * 24, sp, sp + 3.6); X.stroke();
      }
      X.strokeStyle = 'rgba(204,251,241,.7)'; X.lineWidth = 1.8;
      for (let i = 0; i < 4; i++) { const ly = -18 + i * 12; X.beginPath(); X.moveTo(-70 + k * 30 - i * 6, ly); X.lineTo(-30 + k * 30 - i * 6, ly); X.stroke(); }
    } else if (id === 'crystal') {
      const rr2 = 28 + Math.sin(t * .2) * 2, hex = [];
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3 + k; hex.push([Math.cos(a) * rr2, Math.sin(a) * rr2]); }
      polygon(hex, 'rgba(196,181,253,.2)'); X.strokeStyle = '#ddd6fe'; X.lineWidth = 2.5; X.stroke();
      for (let i = 0; i < 4; i++) {
        const a = t * .08 + i * Math.PI / 2, d = 36 + k * 6, sx = Math.cos(a) * d, sy = Math.sin(a) * d;
        pgo([[sx, sy - 7], [sx + 4, sy], [sx, sy + 7], [sx - 4, sy]], '#a78bfa', 'rgba(255,255,255,.6)');
      }
      for (let i = 0; i < 3; i++) { const ry = -((t * .8 + i * 14) % 40); star(Math.sin(i * 2.7) * 14, ry + 10, 3, '#fff'); }
    }
    X.restore();
  }

  // ---------- Helpers de desenho ----------
  const pgo = (pts, c, ol = 'rgba(0,0,0,.35)') => {
    polygon(pts, c); X.strokeStyle = ol; X.lineWidth = 1.4; X.lineJoin = 'round'; X.stroke();
  };
  const ell = (cx, cy, rx, ry, c, a0 = 0, a1 = Math.PI * 2) => {
    X.fillStyle = c; X.beginPath(); X.ellipse(cx, cy, rx, ry, 0, a0, a1); X.fill();
  };
  const lg = (x0, y0, x1, y1, c0, c1) => {
    const g = X.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g;
  };
  const rg = (x, y, r0, r1, stops) => {
    const g = X.createRadialGradient(x, y, r0, x, y, r1); stops.forEach(([o, c]) => g.addColorStop(o, c)); return g;
  };
  // brilho suave: rgb = 'r,g,b'
  const glow = (x, y, r, rgb, a = .5) => {
    X.fillStyle = rg(x, y, 0, r, [[0, `rgba(${rgb},${a})`], [1, `rgba(${rgb},0)`]]);
    X.beginPath(); X.arc(x, y, r, 0, 7); X.fill();
  };
  const star = (x, y, r, c) => polygon([[x, y - r], [x + r * .3, y - r * .3], [x + r, y], [x + r * .3, y + r * .3], [x, y + r], [x - r * .3, y + r * .3], [x - r, y], [x - r * .3, y - r * .3]], c);
  const grayOf = c => {
    if (!/^#[0-9a-f]{6}$/i.test(c)) return c;
    const n = parseInt(c.slice(1), 16), l = Math.round(((n >> 16) & 255) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11 * 1) * .9 | 0;
    return `rgb(${l},${l},${l})`;
  };

  const BOSS_ART = [
    // 0 — Guardião da Floresta (ent)
    (P, E, eye, T) => {
      P([[2, 100], [10, 84], [24, 90], [32, 100]], '#4a2f17'); P([[58, 100], [66, 90], [80, 84], [88, 100]], '#4a2f17');
      P([[20, 52], [2, 46], [-10, 30], [-3, 28], [3, 36], [8, 22], [14, 26], [14, 40], [24, 44]], '#6b4423');
      P([[70, 52], [88, 46], [100, 30], [93, 28], [87, 36], [82, 22], [76, 26], [76, 40], [66, 44]], '#6b4423');
      P([[16, 100], [22, 40], [68, 40], [74, 100]], '#7a4f2a');
      P([[46, 40], [68, 40], [74, 100], [52, 100]], '#5e3b1e');
      X.strokeStyle = T('#3e2610'); X.lineWidth = 1.5; X.beginPath();
      X.moveTo(30, 52); X.lineTo(28, 92); X.moveTo(58, 50); X.lineTo(62, 96); X.moveTo(44, 86); X.lineTo(46, 100); X.stroke();
      [[20, 32, 19, '#2f7d32'], [70, 32, 19, '#2f7d32'], [45, 24, 24, '#3f9a3d'], [30, 12, 15, '#58b84b'], [60, 12, 15, '#58b84b'], [45, 6, 12, '#7ad05f']]
        .forEach(([cx, cy, rr, c]) => { X.fillStyle = T(c); X.beginPath(); X.arc(cx, cy, rr, 0, 7); X.fill(); });
      X.strokeStyle = T('#1f2a10'); X.lineWidth = 3; X.beginPath(); X.moveTo(26, 46); X.lineTo(40, 51); X.moveTo(64, 46); X.lineTo(50, 51); X.stroke();
      P([[30, 66], [60, 66], [55, 80], [35, 80]], '#1c0f05');
      polygon([[34, 66], [39, 66], [36.5, 72]], T('#e5e7eb')); polygon([[43, 66], [48, 66], [45.5, 73]], T('#e5e7eb')); polygon([[52, 66], [57, 66], [54.5, 72]], T('#e5e7eb'));
      eye(34, 56, '#d9f99d', 5); eye(56, 56, '#d9f99d', 5);
    },
    // 1 — Rei das Areias (faraó de arenito)
    (P, E, eye, T) => {
      P([[14, 100], [8, 52], [82, 52], [76, 100]], '#c8963e');
      X.strokeStyle = T('#8a5a1a'); X.lineWidth = 1.2; X.beginPath();
      for (let i = 0; i < 4; i++) { X.moveTo(11, 64 + i * 10); X.lineTo(79, 64 + i * 10); } X.stroke();
      P([[24, 52], [66, 52], [58, 74], [45, 82], [32, 74]], '#f2c46d'); E(45, 66, 3.5, 3.5, '#22d3ee');
      E(4, 80, 10, 10, '#b8802e'); E(86, 80, 10, 10, '#b8802e');
      P([[20, 50], [10, 84], [26, 84], [30, 50]], '#2563eb'); P([[70, 50], [80, 84], [64, 84], [60, 50]], '#2563eb');
      P([[22, 48], [24, 8], [66, 8], [68, 48]], '#f2c46d');
      X.strokeStyle = T('#2563eb'); X.lineWidth = 3; X.beginPath();
      for (let i = 0; i < 5; i++) { X.moveTo(27 + i * 9, 10); X.lineTo(26 + i * 9, 46); } X.stroke();
      P([[32, 24], [58, 24], [56, 52], [34, 52]], '#d9a54e');
      X.strokeStyle = T('#111'); X.lineWidth = 2; X.beginPath(); X.moveTo(33, 37); X.lineTo(28, 39); X.moveTo(57, 37); X.lineTo(62, 39); X.moveTo(45, 38); X.lineTo(43, 46); X.lineTo(47, 46); X.moveTo(39, 49); X.lineTo(51, 49); X.stroke();
      eye(39, 36, '#fde047', 3.5); eye(51, 36, '#fde047', 3.5);
      P([[45, 9], [50, 15], [45, 21], [40, 15]], '#22d3ee');
      P([[42, 52], [48, 52], [47, 64], [43, 64]], '#2563eb');
    },
    // 2 — Senhor da Caverna (golem de cristal)
    (P, E, eye, T) => {
      const pl = .6 + .4 * Math.sin(t * .1);
      P([[10, 100], [8, 60], [26, 36], [64, 36], [82, 60], [80, 100]], '#6d3fc0');
      P([[26, 36], [45, 48], [26, 72], [8, 60]], '#8b5cf6'); P([[64, 36], [45, 48], [64, 72], [82, 60]], '#5b2fa8');
      P([[26, 72], [45, 48], [64, 72], [45, 100]], '#7b4fc9');
      P([[8, 60], [-4, 32], [20, 46]], '#c4b5fd'); P([[82, 60], [94, 32], [70, 46]], '#c4b5fd');
      P([[32, 38], [36, 6], [46, 34]], '#c4b5fd'); P([[44, 34], [54, 0], [60, 36]], '#a78bfa'); P([[58, 36], [68, 12], [66, 40]], '#ddd6fe');
      if (!boss.flash && boss.s !== 'stun') glow(45, 76, 22, '237,233,254', .5 * pl);
      P([[45, 62], [53, 76], [45, 90], [37, 76]], '#ede9fe');
      eye(36, 54, '#f0abfc', 4); eye(54, 54, '#f0abfc', 4);
    },
    // 3 — Gigante de Gelo (yeti)
    (P, E, eye, T) => {
      P([[12, 100], [8, 56], [26, 38], [64, 38], [82, 56], [78, 100]], '#8fd0ee');
      P([[28, 100], [30, 62], [60, 62], [62, 100]], '#d6f0fb');
      P([[26, 38], [45, 48], [26, 72], [8, 56]], '#a9ddf3');
      [[14, 54], [76, 54]].forEach(([cx, cy]) => {
        E(cx, cy, 14, 11, '#f8fafc');
        P([[cx - 12, cy + 6], [cx - 8, cy + 16], [cx - 3, cy + 8], [cx + 2, cy + 17], [cx + 7, cy + 8], [cx + 12, cy + 15], [cx + 13, cy + 6]], '#f8fafc');
      });
      P([[26, 40], [28, 10], [37, 34]], '#e0f7ff'); P([[37, 38], [45, 0], [53, 38]], '#f0fbff'); P([[53, 34], [62, 10], [64, 40]], '#e0f7ff');
      E(45, 52, 18, 14, '#b8e4f7');
      X.strokeStyle = T('#0c4a6e'); X.lineWidth = 3; X.beginPath(); X.moveTo(30, 44); X.lineTo(41, 49); X.moveTo(60, 44); X.lineTo(49, 49); X.stroke();
      eye(37, 52, '#38bdf8', 4); eye(53, 52, '#38bdf8', 4);
      P([[28, 60], [62, 60], [54, 86], [45, 74], [36, 86]], '#f8fafc');
      P([[-2, 84], [8, 72], [16, 86], [8, 98]], '#c7ecfb'); P([[92, 84], [82, 72], [74, 86], [82, 98]], '#c7ecfb');
      if (!boss.flash && boss.s !== 'stun') { star(76, 40 + Math.sin(t * .1) * 3, 4, '#fff'); star(14, 30 + Math.cos(t * .09) * 3, 3, '#e0f7ff'); }
    },
    // 4 — Titã de Magma
    (P, E, eye, T) => {
      const pl = .6 + .4 * Math.sin(t * .12), live = !boss.flash && boss.s !== 'stun';
      P([[10, 100], [6, 54], [24, 34], [66, 34], [84, 54], [80, 100]], '#3b1d17');
      P([[24, 34], [45, 44], [24, 72], [6, 54]], '#4b2820');
      X.save(); X.strokeStyle = T('#fb923c'); X.lineWidth = 2.5; if (live) { X.shadowColor = '#f97316'; X.shadowBlur = 8 * pl; }
      X.beginPath(); X.moveTo(20, 60); X.lineTo(32, 72); X.lineTo(26, 92); X.moveTo(70, 56); X.lineTo(60, 70); X.lineTo(68, 90); X.moveTo(46, 78); X.lineTo(50, 90); X.lineTo(44, 100); X.stroke(); X.restore();
      if (live) glow(45, 72, 22, '253,224,71', .55 * pl);
      E(45, 72, 7, 7, '#fde047'); E(45, 72, 4, 4, '#fff7ae');
      E(8, 56, 12, 11, '#2a120e'); E(82, 56, 12, 11, '#2a120e');
      P([[24, 40], [8, 8], [34, 32]], '#7f1d1d'); P([[66, 40], [82, 8], [56, 32]], '#7f1d1d');
      const fl = Math.sin(t * .3) * 3;
      P([[34, 36], [38, 14 + fl], [45, 26], [50, 4 - fl], [56, 26], [60, 16 + fl], [58, 36]], '#f97316');
      P([[42, 36], [46, 20], [50, 36]], '#fde047');
      eye(36, 50, '#fef08a', 4); eye(54, 50, '#fef08a', 4);
      P([[32, 62], [58, 62], [54, 72], [50, 66], [45, 74], [40, 66], [36, 72]], '#f97316');
      E(2, 86, 11, 11, '#2a120e'); E(88, 86, 11, 11, '#2a120e'); E(2, 90, 6, 4, '#f97316'); E(88, 90, 6, 4, '#f97316');
    },
    // 5 — Fera do Pântano (sapo-gigante)
    (P, E, eye, T) => {
      E(14, 92, 15, 9, '#256b45'); E(76, 92, 15, 9, '#256b45');
      E(45, 70, 40, 30, '#2f7a4f'); E(45, 84, 28, 16, '#a3d977');
      [[22, 60], [68, 56], [30, 50], [60, 48], [12, 76]].forEach(([cx, cy]) => E(cx, cy, 3, 3, '#3d9060'));
      X.strokeStyle = T('#84cc16'); X.lineWidth = 2; X.beginPath();
      X.moveTo(18, 48); X.lineTo(12, 22); X.moveTo(26, 44); X.lineTo(26, 14); X.moveTo(66, 44); X.lineTo(72, 16); X.moveTo(74, 50); X.lineTo(82, 28); X.stroke();
      E(26, 14, 2, 4, '#78350f'); E(72, 16, 2, 4, '#78350f'); E(12, 22, 2, 4, '#78350f'); E(82, 28, 2, 4, '#78350f');
      E(45, 32, 12, 4, '#16a34a'); E(45, 29, 3.5, 3, '#f9a8d4'); E(45, 29, 1.6, 1.6, '#fde047');
      X.strokeStyle = T('#14301f'); X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(12, 68); X.quadraticCurveTo(45, 86, 78, 68); X.stroke();
      [[26, 42], [64, 42]].forEach(([cx, cy]) => { E(cx, cy, 13, 12, '#3d9060'); E(cx, cy, 10, 9, '#d9f99d'); eye(cx - 1, cy, '#fde047', 7); });
      const d = (t * .5) % 12; E(20, 88 + d, 2, 3, '#4d7c0f'); E(70, 92 + ((d + 6) % 8), 2, 3, '#4d7c0f');
    },
    // 6 — Colosso da Montanha
    (P, E, eye, T) => {
      P([[8, 100], [4, 58], [20, 30], [70, 30], [86, 58], [82, 100]], '#6b7a8c');
      P([[20, 30], [45, 42], [22, 72], [4, 58]], '#8795a6'); P([[70, 30], [45, 42], [68, 72], [86, 58]], '#556070'); P([[22, 72], [45, 42], [68, 72], [45, 100]], '#76869a');
      X.strokeStyle = T('#3b4655'); X.lineWidth = 1.5; X.beginPath(); X.moveTo(30, 74); X.lineTo(38, 86); X.lineTo(34, 100); X.moveTo(62, 66); X.lineTo(56, 80); X.lineTo(64, 96); X.stroke();
      [[16, 84, 6], [74, 92, 7], [30, 64, 4]].forEach(([cx, cy, rr]) => E(cx, cy, rr, rr * .7, '#4d7c0f'));
      P([[20, 30], [28, 20], [40, 26], [50, 16], [62, 26], [72, 22], [70, 30], [60, 36], [46, 32], [32, 36]], '#f1f5f9');
      E(0, 82, 13, 13, '#7c8ea2'); E(90, 82, 13, 13, '#7c8ea2'); E(-3, 78, 5, 4, '#9aa9bb'); E(87, 78, 5, 4, '#9aa9bb');
      P([[24, 42], [44, 48], [44, 54], [24, 49]], '#2b3440'); P([[66, 42], [46, 48], [46, 54], [66, 49]], '#2b3440');
      eye(35, 58, '#fbbf24', 4); eye(55, 58, '#fbbf24', 4);
      X.strokeStyle = T('#1f2833'); X.lineWidth = 3; X.beginPath(); X.moveTo(34, 76); X.lineTo(56, 76); X.stroke();
    },
    // 7 — Leviatã do Mar
    (P, E, eye, T) => {
      X.lineCap = 'round'; X.strokeStyle = T('#0e7490'); X.lineWidth = 8;
      [[16, 0], [34, 1.5], [56, 3], [74, 4.5]].forEach(([bx, ph]) => { const sw = Math.sin(t * .12 + ph) * 6; X.beginPath(); X.moveTo(bx, 82); X.quadraticCurveTo(bx + sw, 92, bx - sw * .5, 100); X.stroke(); });
      P([[34, 22], [45, -2], [56, 22]], '#0ea5e9'); P([[10, 48], [-6, 36], [-4, 64], [12, 68]], '#0ea5e9'); P([[80, 48], [96, 36], [94, 64], [78, 68]], '#0ea5e9');
      E(45, 56, 36, 38, '#1c8aa8'); E(45, 68, 24, 26, '#7bd9ff');
      X.strokeStyle = T('rgba(255,255,255,.25)'); X.lineWidth = 1.5; X.beginPath();
      for (let i = 0; i < 3; i++) { X.arc(20 + i * 12, 30 + (i % 2) * 6, 5, 0, Math.PI); X.moveTo(58 + i * 6, 30); } X.stroke();
      E(31, 44, 10, 10, '#ecfeff'); E(59, 44, 10, 10, '#ecfeff'); eye(31, 44, '#22d3ee', 6); eye(59, 44, '#22d3ee', 6);
      P([[26, 66], [64, 66], [60, 80], [45, 74], [30, 80]], '#0f172a');
      for (let i = 0; i < 4; i++) polygon([[31 + i * 8, 66], [35 + i * 8, 66], [33 + i * 8, 72]], T('#fff'));
      if (!boss.flash) for (let i = 0; i < 3; i++) {
        const bt = (t * .5 + i * 20) % 60;
        X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 1.2; X.beginPath(); X.arc(18 + i * 26 + Math.sin(bt * .2) * 3, 16 - bt * .4, 3 + i, 0, 7); X.stroke();
      }
    },
  ];

  function drawBoss() {
    const biomeIndex = biome % BIOMES.length;
    const b = BIOMES[biomeIndex], r = bb(), x = r.x, y = r.y, w = r.w, h = r.h;
    const stun = boss.s === 'stun', tel = boss.s === 'tel';
    const T = c => boss.flash ? '#fff' : stun ? grayOf(c) : c;
    const P = (pts, c) => { polygon(pts, T(c)); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.6; X.lineJoin = 'round'; X.stroke(); };
    const E = (cx, cy, rx, ry, c) => ell(cx, cy, rx, ry, T(c));
    const eye = (cx, cy, c, rr = 4) => {
      if (stun) {
        X.strokeStyle = '#222'; X.lineWidth = 2; X.beginPath();
        X.moveTo(cx - rr * .8, cy - rr * .8); X.lineTo(cx + rr * .8, cy + rr * .8); X.moveTo(cx + rr * .8, cy - rr * .8); X.lineTo(cx - rr * .8, cy + rr * .8); X.stroke(); return;
      }
      const col = boss.flash ? '#fff' : c;
      X.save(); X.shadowColor = col; X.shadowBlur = 10; X.fillStyle = col; X.beginPath(); X.ellipse(cx, cy, rr, rr * .85, 0, 0, 7); X.fill(); X.restore();
      if (!boss.flash) { X.fillStyle = 'rgba(0,0,0,.75)'; X.beginPath(); X.ellipse(cx - 1, cy, rr * .3, rr * .75, 0, 0, 7); X.fill(); }
    };
    const bob = stun ? 0 : Math.sin(t * .08) * 2 - (boss.moving ? Math.abs(Math.sin(t * .2)) * 2 : 0);

    // sombra e aura de ataque
    X.fillStyle = 'rgba(0,0,0,.3)'; X.beginPath(); X.ellipse(x + w / 2, GY + 3, w * .62, 6, 0, 0, 7); X.fill();
    if (tel) glow(x + w / 2, y + 52, 78, '255,235,59', .22 + .12 * Math.sin(t * .4));

    X.save(); X.translate(x + (tel ? R(-1.2, 1.2) : 0), y + bob);
    BOSS_ART[biomeIndex](P, E, eye, T);
    if (boss.freeze > 0) {
      X.fillStyle = 'rgba(186,230,253,.4)'; X.fillRect(-4, -4, w + 8, h + 8);
      X.strokeStyle = 'rgba(255,255,255,.8)'; X.lineWidth = 1.5; X.strokeRect(-4, -4, w + 8, h + 8);
      polygon([[0, h], [6, h - 16], [12, h]], 'rgba(224,247,255,.85)'); polygon([[w - 14, h], [w - 6, h - 20], [w + 2, h]], 'rgba(224,247,255,.85)');
    }
    X.restore();

    if (stun) for (let i = 0; i < 3; i++) {
      const a = t * .08 + i * 2.094;
      star(x + w / 2 + Math.cos(a) * 34, y + 2 + Math.sin(a) * 8, 5, '#fde047');
    }
    if (boss.burn > 0 && !boss.flash) for (let i = 0; i < 3; i++) {
      const fy = (t * 1.2 + i * 14) % 36;
      X.fillStyle = `rgba(251,146,60,${1 - fy / 36})`; X.beginPath(); X.arc(x + 20 + i * 25, y + 30 - fy, 4 - fy / 14, 0, 7); X.fill();
    }
    if (boss.poison > 0 && !boss.flash) for (let i = 0; i < 3; i++) {
      const fy = (t * .8 + i * 12) % 30;
      X.strokeStyle = `rgba(163,230,53,${1 - fy / 30})`; X.lineWidth = 1.5; X.beginPath(); X.arc(x + 18 + i * 26, y + 40 - fy, 3, 0, 7); X.stroke();
    }

    X.textAlign = 'center'; X.font = 'bold 12px sans-serif';
    if (boss.s === 'tel') {
      const colors = { rootSweep: '#795548', vineLash: '#65a30d', seedBurst: '#84cc16', thornRain: '#365314', sandWave: '#d6a64f', sunSpear: '#fbbf24', sandBurst: '#c2410c', rockFall: '#78716c', echoBolt: '#c4b5fd', crystalLance: '#a78bfa', crystalRain: '#a78bfa', shardFan: '#8b5cf6', iceSlide: '#38bdf8', iceFan: '#7dd3fc', icicleRain: '#e0f2fe', blizzard: '#f8fafc', magmaWave: '#f97316', fireball: '#ef4444', lavaBurst: '#f97316', eruption: '#fb923c', bogPulse: '#65a30d', mireSnare: '#166534', reedBurst: '#84cc16', swampRain: '#4d7c0f', stoneThrow: '#94a3b8', avalanche: '#cbd5e1', ridgeStrike: '#64748b', windSlam: '#bae6fd', waveCrash: '#38bdf8', tideBolt: '#0ea5e9', reefBurst: '#2dd4bf', mistBurst: '#bae6fd' };
      const labels = { rootSweep: 'RAIZES', vineLash: 'CHICOTE', seedBurst: 'SEMENTES', thornRain: 'ESPINHOS', sandWave: 'ONDA DE AREIA', sunSpear: 'LANCE SOLAR', sandBurst: 'ESTILHACOS', rockFall: 'QUEDA DE ROCHAS', echoBolt: 'ECO', crystalLance: 'LANCE CRISTALINO', crystalRain: 'CHUVA DE CRISTAIS', shardFan: 'LEQUE DE ESTILHACOS', iceSlide: 'DESLIZE DE GELO', iceFan: 'LEQUE DE GELO', icicleRain: 'CHUVA DE GELO', blizzard: 'NEVASCA', magmaWave: 'ONDA DE MAGMA', fireball: 'BOLA DE FOGO', lavaBurst: 'RAJADA DE LAVA', eruption: 'ERUPCAO', bogPulse: 'PULSO DO PANTANO', mireSnare: 'LACO DO BREJO', reedBurst: 'RAJADA DE JUNCO', swampRain: 'CHUVA DO PANTANO', stoneThrow: 'PEDRA', avalanche: 'AVALANCHE', ridgeStrike: 'GOLPE DA SERRA', windSlam: 'RAJADA DE VENTO', waveCrash: 'ONDA DO MAR', tideBolt: 'RAIO DA MARE', reefBurst: 'RAJADA DE RECIFE', mistBurst: 'EXPLOSAO DE NEVOA' };
      X.strokeStyle = colors[boss.atk] || '#ffeb3b'; X.lineWidth = 4; X.strokeRect(x - 3, y - 3, w + 6, h + 6);
      X.fillStyle = X.strokeStyle; otext(labels[boss.atk] || '', x + w / 2, y - 12);
    }
    if (boss.freeze > 0) { X.fillStyle = '#bae6fd'; X.font = 'bold 13px sans-serif'; otext('CONGELADO', x + w / 2, y - 24); }
    if (boss.burn > 0 || boss.poison > 0) {
      X.fillStyle = boss.burn > 0 ? '#fb923c' : '#a3e635';
      X.beginPath(); X.arc(x + w / 2, y - 5, 5, 0, Math.PI * 2); X.fill();
    }
    X.font = 'bold 22px sans-serif';
    if (boss.s === 'stun') {
      X.fillStyle = '#ffeb3b'; otext(`ATORDOADO ${Math.ceil(boss.stunTimer / 60)}s`, r.x + r.w / 2, r.y - 8);
    }
    // Nome e barra de vida
    const bx = W / 2 - 150;
    X.font = 'bold 11px sans-serif'; X.textAlign = 'center'; X.fillStyle = '#fff';
    otext(BOSS_NAMES[biomeIndex], W / 2, 14);
    X.fillStyle = 'rgba(0,0,0,.6)'; X.fillRect(bx - 2, 18, 304, 14);
    X.fillStyle = boss.s === 'stun' ? '#facc15' : '#ef4444'; X.fillRect(bx, 20, 300 * Math.max(0, boss.hp) / boss.max, 10);
    X.fillStyle = 'rgba(255,255,255,.25)'; X.fillRect(bx, 20, 300 * Math.max(0, boss.hp) / boss.max, 3);
    X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 1; X.strokeRect(bx - 2, 18, 304, 14);
  }

  // ---------- Projéteis (desenhados apontando para a ESQUERDA; espelhados se vx > 0) ----------
  const FLIP_V = ['crystal', 'icicle', 'thorn']; // desenhados com a ponta para cima; viram ao cair
  const WAVES = { sand: ['#f4d58d', '#b5833a'], magma: ['#fb923c', '#991b1b'], iceSlide: ['#e0f2fe', '#38bdf8'], bog: ['#bef264', '#3f6212'], wave: ['#7dd3fc', '#0369a1'] };

  function drawProjectileRaw(p) {
    const { x, y, w, h } = p, c = p.c || '#ffffff', k = p.kind, cx = x + w / 2, cy = y + h / 2;
    if (WAVES[k]) {
      const [c1, c2] = WAVES[k];
      X.fillStyle = lg(0, y, 0, y + h, c1, c2); X.beginPath(); X.moveTo(x, y + h);
      X.bezierCurveTo(x, y + h * .2, x + w * .3, y, x + w * .5, y + h * .1); X.bezierCurveTo(x + w * .8, y + h * .2, x + w, y + h * .5, x + w, y + h);
      X.closePath(); X.fill(); X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1.4; X.stroke();
      X.strokeStyle = 'rgba(255,255,255,.5)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(x + w * .15, y + h * .6); X.quadraticCurveTo(x + w * .4, y + h * .2, x + w * .65, y + h * .45); X.stroke();
      if (k === 'sand') for (let i = 0; i < 4; i++) ell(x + w + 2 + i * 3, y + h * .4 + Math.sin(t * .3 + i) * 4, 1.3, 1.3, c1);
      else for (let i = 0; i < 3; i++) ell(x + w * (.3 + i * .2), y + h * (.65 + Math.sin(t * .2 + i) * .1), 2.2 - i * .4, 2.2 - i * .4, k === 'magma' ? '#fde047' : 'rgba(255,255,255,.55)');
      return;
    }
    switch (k) {
      case 'root': {
        X.fillStyle = lg(0, y, 0, y + h, '#8d6e63', '#4e342e'); X.beginPath(); X.moveTo(x, y + h);
        X.quadraticCurveTo(x + w * .15, y + 12, x + w * .5, y + 14); X.quadraticCurveTo(x + w * .85, y + 10, x + w, y + h); X.closePath(); X.fill();
        X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.4; X.stroke();
        for (let i = 0; i < 4; i++) pgo([[x + 4 + i * 12.5, y + 16], [x + 10 + i * 12.5, y + 2 + (i % 2) * 4], [x + 16 + i * 12.5, y + 16]], '#d6a15b');
        break;
      }
      case 'vine': {
        const pt = i => [x + w - i / 18 * w, cy + Math.sin(i * .8 + t * .3) * h * .55];
        X.lineCap = 'round'; X.lineJoin = 'round';
        X.beginPath(); for (let i = 0; i <= 18; i++) { const [px, py] = pt(i); i ? X.lineTo(px, py) : X.moveTo(px, py); }
        X.strokeStyle = '#1a2e05'; X.lineWidth = 9; X.stroke(); X.strokeStyle = '#65a30d'; X.lineWidth = 6; X.stroke();
        for (let i = 3; i < 18; i += 5) { const [px, py] = pt(i); pgo([[px, py], [px - 4, py - 9], [px + 4, py - 6]], '#a3e635'); }
        const [hx, hy] = pt(18); pgo([[hx - 7, hy], [hx + 3, hy - 5], [hx + 3, hy + 5]], '#bef264');
        break;
      }
      case 'seed':
        X.fillStyle = lg(x, y, x + w, y + h, '#d9f99d', '#4d7c0f'); X.beginPath(); X.ellipse(cx, cy, w / 2, h / 2, -.5, 0, 7); X.fill();
        X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.2; X.stroke(); ell(cx - 2, cy - 2, 2, 1.2, 'rgba(255,255,255,.6)');
        X.strokeStyle = '#365314'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(cx + w * .2, cy - h * .3); X.quadraticCurveTo(cx + w * .4, cy - h * .9, cx + w * .1, cy - h * .9); X.stroke();
        break;
      case 'thorn':
        pgo([[cx, y], [x + w, y + h], [x, y + h]], lg(0, y, 0, y + h, '#d9f99d', '#365314'));
        polygon([[cx, y + 3], [cx - 1, y + h * .7], [cx - w * .25, y + h * .75]], 'rgba(255,255,255,.35)');
        break;
      case 'sun':
        glow(cx, cy, w * .7, '251,191,36', .5);
        pgo([[x, cy], [x + 16, y], [x + 18, cy - 2.5], [x + w, cy - 2.5], [x + w, cy + 2.5], [x + 18, cy + 2.5], [x + 16, y + h]], lg(x, 0, x + w, 0, '#fff7c2', '#f59e0b'));
        ell(x + w - 3, cy, 4, 3, '#fff');
        break;
      case 'crystalLance':
        glow(cx, cy, w * .7, '167,139,250', .45);
        pgo([[x, cy], [x + 18, y], [x + 22, cy - 3], [x + w, cy - 3], [x + w, cy + 3], [x + 22, cy + 3], [x + 18, y + h]], lg(x, 0, x + w, 0, '#f5f3ff', '#7c3aed'));
        X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 1; X.beginPath(); X.moveTo(x + 4, cy); X.lineTo(x + w - 6, cy); X.stroke();
        break;
      case 'ridge':
        glow(cx, cy, w * .55, '148,163,184', .3);
        X.fillStyle = lg(x, 0, x + w, 0, '#e2e8f0', '#475569'); X.beginPath(); X.moveTo(x + w, y);
        X.quadraticCurveTo(x + w * .3, y - 2, x, cy + 4); X.quadraticCurveTo(x + w * .45, y + h * .55, x + w, y + h); X.closePath(); X.fill();
        X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.2; X.stroke();
        break;
      case 'gust':
        X.lineCap = 'round';
        for (let i = 0; i < 3; i++) { X.strokeStyle = `rgba(224,242,254,${.9 - i * .2})`; X.lineWidth = 3 - i * .6; X.beginPath(); X.arc(cx, cy, w * .18 + i * 4.5, t * .35 + i * 1.2, t * .35 + i * 1.2 + 4.2); X.stroke(); }
        ell(cx, cy, 2.5, 2.5, '#fff');
        break;
      case 'crystal': case 'ice': case 'shard': case 'icicle':
        glow(cx, cy, Math.max(w, h) * .8, rgbOf(c), .4);
        pgo([[cx, y], [x + w, y + h * .32], [x + w * .74, y + h], [x + w * .26, y + h * .86], [x, y + h * .3]], lg(x, y, x + w, y + h, '#ffffff', c));
        polygon([[cx, y], [x + w, y + h * .32], [x + w * .74, y + h], [cx, y + h * .55]], 'rgba(0,0,0,.18)');
        polygon([[cx, y + 2], [x + w * .25, y + h * .35], [x + w * .3, y + h * .75]], 'rgba(255,255,255,.5)');
        break;
      case 'sandShard': case 'rock': case 'stone': case 'snowRock':
        X.save(); X.translate(cx, cy); X.rotate(t * (k === 'sandShard' ? .18 : .12)); X.translate(-cx, -cy);
        pgo([[x + w * .25, y], [x + w, y + h * .2], [x + w * .85, y + h], [x + w * .1, y + h * .9], [x, y + h * .3]], c);
        polygon([[x + w * .25, y], [x + w, y + h * .2], [cx, cy]], 'rgba(255,255,255,.28)');
        polygon([[x + w * .85, y + h], [x + w * .1, y + h * .9], [cx, cy]], 'rgba(0,0,0,.28)');
        if (k === 'snowRock') polygon([[x + w * .2, y + h * .25], [x + w * .25, y], [x + w, y + h * .2], [x + w * .7, y + h * .32], [x + w * .45, y + h * .24]], '#ffffff');
        X.restore();
        break;
      case 'echo':
        for (let i = 0; i < 3; i++) { X.strokeStyle = `rgba(196,181,253,${.95 - i * .28})`; X.lineWidth = 3.2 - i * .7; X.beginPath(); X.arc(cx, cy, w * .16 + i * w * .14 + (t * .4) % 3, 0, 7); X.stroke(); }
        ell(cx, cy, 3, 3, '#fff');
        break;
      case 'snow':
        glow(cx, cy, w, '248,250,252', .35); X.strokeStyle = '#f8fafc'; X.lineWidth = 1.6; X.lineCap = 'round'; X.beginPath();
        for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + t * .1; X.moveTo(cx + Math.cos(a) * w * .5, cy + Math.sin(a) * w * .5); X.lineTo(cx - Math.cos(a) * w * .5, cy - Math.sin(a) * w * .5); }
        X.stroke(); ell(cx, cy, 2.2, 2.2, '#e0f2fe');
        break;
      case 'venomOrb':
        glow(cx, cy, w * 1.1, '163,230,53', .5); ell(cx, cy, w / 2, w / 2, '#365314');
        X.fillStyle = rg(cx - 3, cy - 3, 1, w * .5, [[0, '#ecfccb'], [.6, '#a3e635'], [1, '#4d7c0f']]); X.beginPath(); X.arc(cx, cy, w / 2 - 1, 0, 7); X.fill();
        for (let i = 0; i < 3; i++) ell(cx + Math.sin(t * .2 + i * 2) * w * .2, cy + Math.cos(t * .25 + i * 2) * w * .2, 2, 2, 'rgba(255,255,255,.6)');
        ell(x + w + 2, cy + Math.sin(t * .3) * 3, 2, 3, '#a3e635');
        break;
      case 'fireball': case 'lava': {
        const hot = k === 'lava' ? ['#fde047', '#f97316', '#7f1d1d'] : ['#fff7ae', '#f97316', '#b91c1c'];
        glow(cx, cy, w * .9, '249,115,22', .45);
        for (let i = 0; i < 3; i++) { const fl = Math.sin(t * .6 + i * 2) * h * .12; pgo([[cx, cy - h * .35 + i * h * .12], [x + w + 12 + i * 3, cy - h * .12 + fl + (i - 1) * 3], [cx, cy + h * .15 + i * h * .08]], i === 1 ? '#fde047' : '#fb923c', 'rgba(0,0,0,0)'); }
        X.fillStyle = rg(cx - 2, cy - 2, 1, w * .6, [[0, hot[0]], [.5, hot[1]], [1, hot[2]]]); X.beginPath(); X.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); X.fill();
        break;
      }
      case 'eruption': {
        glow(cx, GY - 4, w * 1.6, '239,68,68', .5);
        X.fillStyle = 'rgba(239,68,68,.45)'; X.fillRect(x - 8, GY - 4, w + 16, 4);
        const jag = Math.sin(t * .8) * 3;
        pgo([[x + 2, GY], [x + w * .2, y + 22 + jag], [x + w * .4, y + 4], [x + w * .5, y - 4 - jag], [x + w * .7, y + 14], [x + w * .85, y + 26], [x + w - 2, GY]], lg(0, y, 0, GY, '#fde047', '#dc2626'));
        pgo([[x + w * .3, GY], [x + w * .45, y + 24], [x + w * .65, GY]], '#fff7ae', 'rgba(0,0,0,0)');
        break;
      }
      case 'mire':
        X.lineCap = 'round';
        for (let i = 0; i < 3; i++) {
          X.strokeStyle = i === 1 ? '#4ade80' : '#166534'; X.lineWidth = i === 1 ? 5 : 6; X.beginPath();
          for (let j = 0; j <= 10; j++) { const px = x + 4 + i * 8 + Math.sin(j * .9 + t * .25 + i) * 3, py = y + h - j / 10 * h; j ? X.lineTo(px, py) : X.moveTo(px, py); }
          X.stroke(); pgo([[x + 1 + i * 8, y + 4], [x + 4 + i * 8, y - 3], [x + 7 + i * 8, y + 4]], '#bef264');
        }
        break;
      case 'reed':
        X.lineCap = 'round'; X.strokeStyle = '#4d7c0f'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(x + 4, cy); X.lineTo(x + w, cy); X.stroke();
        pgo([[x - 2, cy], [x + 8, cy - 4.5], [x + 8, cy + 4.5]], '#d9f99d');
        pgo([[x + w - 2, cy], [x + w + 4, cy - 5], [x + w - 6, cy - 1]], '#65a30d'); pgo([[x + w - 2, cy], [x + w + 4, cy + 5], [x + w - 6, cy + 1]], '#84cc16');
        break;
      case 'swamp': case 'mist': {
        const pal = k === 'mist' ? ['#f0f9ff', '#7dd3fc'] : ['#bef264', '#3f6212'];
        glow(cx, cy, Math.max(w, h) * .8, rgbOf(c), .3);
        X.fillStyle = lg(x, y, x + w, y + h, pal[0], pal[1]); X.beginPath(); X.moveTo(cx, y);
        X.bezierCurveTo(x + w * 1.05, y + h * .55, x + w * .9, y + h, cx, y + h); X.bezierCurveTo(x + w * .1, y + h, x - w * .05, y + h * .55, cx, y); X.fill();
        X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.2; X.stroke(); ell(cx - w * .15, cy + h * .1, w * .12, h * .1, 'rgba(255,255,255,.6)');
        break;
      }
      case 'tide':
        glow(cx, cy, w, '14,165,233', .5);
        X.fillStyle = rg(cx - 2, cy - 2, 1, w * .6, [[0, '#e0f7ff'], [.5, '#0ea5e9'], [1, '#075985']]); X.beginPath(); X.arc(cx, cy, w / 2, 0, 7); X.fill();
        X.strokeStyle = 'rgba(224,247,255,.7)'; X.lineWidth = 1.5; X.beginPath(); X.arc(cx, cy, w / 2 + 3 + (t * .3) % 5, 0, 7); X.stroke();
        ell(cx - 4, cy - 4, 3.5, 2, 'rgba(255,255,255,.7)');
        break;
      case 'reef': {
        const pts = []; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 + t * .1, r = i % 2 ? w * .28 : w * .55; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
        glow(cx, cy, w * .9, '45,212,191', .4); pgo(pts, lg(x, y, x + w, y + h, '#99f6e4', '#0d9488')); ell(cx, cy, 3, 3, '#fda4af');
        break;
      }
      default:
        glow(cx, cy, Math.max(w, h) * .8, rgbOf(c), .35); rr(x, y, w, h, 5, c); X.fillStyle = 'rgba(255,255,255,.3)'; X.fillRect(x + 3, y + 2, w - 6, 3);
    }
  }

  function orient(p) {
    if ((p.vx || 0) > 0) { const cx = p.x + p.w / 2; X.translate(cx, 0); X.scale(-1, 1); X.translate(-cx, 0); }
    if ((p.vy || 0) > 1 && FLIP_V.includes(p.kind)) { const cy = p.y + p.h / 2; X.translate(0, cy); X.scale(1, -1); X.translate(0, -cy); }
  }

  // Projétil com rastro de movimento e brilho na própria cor
  function drawProjectile(p) {
    const vx = p.vx || 0, vy = p.vy || 0;
    if (Math.hypot(vx, vy) > 3 && p.kind !== 'eruption') {
      for (let k = 2; k >= 1; k--) { X.save(); X.globalAlpha = .13 * (3 - k); X.translate(-vx * k * 2.6, -vy * k * 2.6); orient(p); drawProjectileRaw(p); X.restore(); }
    }
    X.save(); X.shadowColor = p.c || '#fff'; X.shadowBlur = 14; orient(p); drawProjectileRaw(p); X.restore();
  }

  // ---------- Inimigos e obstáculos ----------
  const beetle = (w, h, c1, c2, spot, crystal) => {
    X.strokeStyle = '#1c1917'; X.lineWidth = 2; X.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const lx = 12 + i * 8, sw = Math.sin(t * .45 + i * 2.1) * 3; X.beginPath(); X.moveTo(lx, h - 9); X.lineTo(lx - 4 + sw, h - 1); X.stroke(); }
    X.fillStyle = lg(0, 4, 0, h - 4, c1, c2); X.beginPath(); X.ellipse(21, h - 9, 15, 12, 0, Math.PI, Math.PI * 2); X.fill();
    X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.4; X.stroke();
    ell(21, h - 8, 15, 3, 'rgba(0,0,0,.35)');
    X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(21, h - 21); X.lineTo(21, h - 8); X.stroke();
    [[14, h - 15, 2.4], [28, h - 14, 2.8], [21, h - 19, 1.8]].forEach(([cx, cy, rr]) => ell(cx, cy, rr, rr, spot));
    ell(15, h - 18, 5, 2.2, 'rgba(255,255,255,.3)');
    if (crystal) { pgo([[14, h - 20], [16, h - 28], [19, h - 20]], '#c4b5fd'); pgo([[22, h - 21], [25, h - 30], [28, h - 21]], '#ddd6fe'); }
    ell(5, h - 9, 6, 5, '#1c1917'); ell(4, h - 11, 1.6, 1.6, '#ef4444');
    pgo([[0, h - 7], [-3, h - 3], [3, h - 5]], '#44403c');
    X.strokeStyle = '#1c1917'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(5, h - 14); X.quadraticCurveTo(2, h - 20, -1, h - 19); X.stroke();
  };

  const bat = (w, h, f, wing, edge, body, eye) => {
    const L = [[18, 12], [11, 3 + f], [3, 2 + f], [5, 8 + f * .7], [1, 13 + f * .5], [8, 14 + f * .3], [10, 19], [16, 17]];
    pgo(L, wing, edge); pgo(L.map(([x, y]) => [w - x, y]), wing, edge);
    X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1; X.beginPath();
    X.moveTo(18, 12); X.lineTo(3, 2 + f); X.moveTo(18, 12); X.lineTo(1, 13 + f * .5); X.moveTo(w - 18, 12); X.lineTo(w - 3, 2 + f); X.moveTo(w - 18, 12); X.lineTo(w - 1, 13 + f * .5); X.stroke();
    pgo([[w / 2 - 6, 8], [w / 2 - 9, 0], [w / 2 - 2, 6]], body); pgo([[w / 2 + 6, 8], [w / 2 + 9, 0], [w / 2 + 2, 6]], body);
    ell(w / 2, 13, 7, 10, body); ell(w / 2, 11, 5, 6, 'rgba(255,255,255,.12)');
    X.save(); X.shadowColor = eye; X.shadowBlur = 6; ell(w / 2 - 3, 11, 1.8, 1.8, eye); ell(w / 2 + 3, 11, 1.8, 1.8, eye); X.restore();
    polygon([[w / 2 - 3, 18], [w / 2 - 2, 22], [w / 2 - 1, 18]], '#fff'); polygon([[w / 2 + 1, 18], [w / 2 + 2, 22], [w / 2 + 3, 18]], '#fff');
  };

  const SPR = {
    // ===== Criaturas =====
    forestWisp(w, h, f) {
      glow(15, 14, 24, '134,239,172', .55 + Math.sin(t * .1) * .1);
      pgo([[9, 14], [0, 4 + f / 2], [2, 17], [11, 16]], 'rgba(187,247,208,.8)', 'rgba(21,128,61,.4)');
      pgo([[21, 14], [30, 4 - f / 2], [28, 17], [19, 16]], 'rgba(187,247,208,.8)', 'rgba(21,128,61,.4)');
      X.fillStyle = rg(15, 12, 1, 12, [[0, '#f0fff4'], [1, '#4ade80']]); X.beginPath(); X.ellipse(15, 14, 7, 10, 0, 0, 7); X.fill();
      X.fillStyle = '#14532d'; X.fillRect(12, 11, 2, 3); X.fillRect(17, 11, 2, 3);
      X.fillStyle = 'rgba(187,247,208,.85)'; [[25, 19], [29, 23], [22, 24]].forEach(([cx, cy]) => { X.beginPath(); X.arc(cx, cy + Math.sin(t * .2 + cx) * 1.5, 1.4, 0, 7); X.fill(); });
    },
    forestMoth(w, h, f) {
      const wl = [[18, 13], [1, 1 + f], [0, 13], [8, 22], [16, 19]];
      pgo(wl, '#f0abfc', 'rgba(88,28,135,.5)'); pgo(wl.map(([x, y]) => [w - x, y]), '#c084fc', 'rgba(88,28,135,.5)');
      [8, w - 8].forEach(cx => { ell(cx, 10 + f / 3, 3.2, 3.2, '#7e22ce'); ell(cx, 10 + f / 3, 1.3, 1.3, '#fde047'); });
      ell(19, 14, 3.5, 10, '#4c1d95'); ell(19, 13, 1.8, 7, '#7c3aed');
      X.strokeStyle = '#4c1d95'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(18, 5); X.quadraticCurveTo(14, 0, 10, 1); X.moveTo(20, 5); X.quadraticCurveTo(24, 0, 28, 1); X.stroke();
      X.fillStyle = '#fde047'; X.fillRect(17, 7, 2, 2); X.fillRect(20, 7, 2, 2);
    },
    mossBeetle(w, h) { beetle(w, h, '#4ade80', '#14532d', '#65a30d', false); },
    caveBeetle(w, h) { beetle(w, h, '#a78bfa', '#4c1d95', '#ddd6fe', true); },
    caveBat(w, h, f) { bat(w, h, f, '#6d28d9', 'rgba(30,10,70,.6)', '#312e81', '#fda4af'); },
    emberBat(w, h, f) {
      glow(19, 13, 26, '249,115,22', .25);
      bat(w, h, f, '#ea580c', 'rgba(127,29,29,.7)', '#7f1d1d', '#fef08a');
    },
    vulture(w, h, f) {
      pgo([[24, 15], [36, 4 + f], [42, 8 + f], [40, 13 + f * .6], [36, 15], [30, 18]], '#7c4a14');
      pgo([[34, 17], [42, 14], [42, 23], [34, 21]], '#3f2508');
      X.fillStyle = lg(0, 10, 0, 24, '#8a5516', '#5b3510'); X.beginPath(); X.ellipse(22, 17, 14, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[22, 14], [10, 2 + f], [3, 6 + f], [5, 11 + f * .6], [9, 14], [16, 18]], '#a16207');
      X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1; X.beginPath(); X.moveTo(20, 14); X.lineTo(5, 7 + f); X.moveTo(20, 15); X.lineTo(7, 12 + f * .6); X.stroke();
      ell(12, 15, 5, 3, '#f5f5f4'); ell(8, 12, 5, 5, '#fca5a5');
      pgo([[4, 11], [-1, 14], [5, 15]], '#facc15'); ell(8, 11, 1.2, 1.2, '#111');
    },
    snowOwl(w, h, f) {
      pgo([[11, 14], [0, 9 + f], [3, 22], [12, 22]], '#bfe6fa'); pgo([[27, 14], [38, 9 + f], [35, 22], [26, 22]], '#bfe6fa');
      X.fillStyle = rg(19, 12, 2, 15, [[0, '#ffffff'], [1, '#d5ecf8']]); X.beginPath(); X.ellipse(19, 15, 12, 13, 0, 0, 7); X.fill();
      X.strokeStyle = 'rgba(40,90,140,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[10, 7], [9, 0], [15, 4]], '#e0f2fe'); pgo([[28, 7], [29, 0], [23, 4]], '#e0f2fe');
      ell(14.5, 12, 5, 5, '#fde047'); ell(23.5, 12, 5, 5, '#fde047'); ell(14, 12, 2.2, 2.6, '#111'); ell(23, 12, 2.2, 2.6, '#111');
      ell(13, 10.5, .9, .9, '#fff'); ell(22, 10.5, .9, .9, '#fff');
      pgo([[17, 16], [21, 16], [19, 21]], '#fb923c');
      X.strokeStyle = 'rgba(100,150,190,.5)'; X.lineWidth = 1; X.beginPath(); X.arc(14, 23, 3, 0, Math.PI); X.arc(20, 24, 3, 0, Math.PI); X.arc(25, 23, 3, 0, Math.PI); X.stroke();
    },
    scorpion(w, h) {
      X.strokeStyle = '#78350f'; X.lineWidth = 2.5; X.lineCap = 'round'; X.lineJoin = 'round';
      for (let i = 0; i < 4; i++) { const lx = 14 + i * 5, sw = Math.sin(t * .4 + i * 1.7) * 3; X.beginPath(); X.moveTo(lx, 17); X.lineTo(lx - 3 + sw, 22); X.lineTo(lx - 5 + sw, h); X.stroke(); }
      X.strokeStyle = '#78350f'; X.lineWidth = 6; X.beginPath(); X.moveTo(30, 16); X.bezierCurveTo(43, 17, 45, 5, 35, 4); X.stroke();
      X.strokeStyle = '#d97706'; X.lineWidth = 3; X.beginPath(); X.moveTo(30, 16); X.bezierCurveTo(43, 17, 45, 5, 35, 4); X.stroke();
      pgo([[36, 0], [30, 5], [36, 7]], '#ef4444');
      X.fillStyle = lg(0, 10, 0, 24, '#d97706', '#78350f'); X.beginPath(); X.ellipse(22, 17, 11, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.3; X.stroke();
      X.strokeStyle = 'rgba(69,26,3,.5)'; X.lineWidth = 1; X.beginPath(); X.moveTo(19, 11); X.lineTo(19, 23); X.moveTo(23, 10.5); X.lineTo(23, 23.5); X.moveTo(27, 11.5); X.lineTo(27, 22.5); X.stroke();
      X.strokeStyle = '#b45309'; X.lineWidth = 3; X.beginPath(); X.moveTo(13, 14); X.lineTo(7, 12); X.stroke();
      pgo([[9, 12], [0, 8], [3, 13], [0, 17], [8, 16]], '#d97706');
      ell(13, 14, 1.3, 1.3, '#111'); ell(15, 13, 1.2, 1.2, '#111');
    },
    sandSnake(w, h) {
      const pts = []; for (let i = 0; i < 15; i++) pts.push([7 + i * 2.8, 14 + Math.sin(t * .2 - i * .5) * 5, 5 - i * .15]);
      for (let i = pts.length - 1; i >= 0; i--) { const [px, py, pr] = pts[i]; ell(px, py, pr, pr, i % 2 ? '#d97706' : '#fbbf24'); if (i % 3 === 0) ell(px, py - pr * .3, pr * .5, pr * .35, 'rgba(120,53,15,.5)'); }
      ell(6, pts[0][1], 6, 5, '#f59e0b'); ell(5, pts[0][1] - 2, 2.4, 1.6, 'rgba(255,255,255,.3)');
      ell(4, pts[0][1] - 1.5, 1.3, 1.7, '#111'); ell(8, pts[0][1] - 1.5, 1.3, 1.7, '#111');
      X.strokeStyle = '#ef4444'; X.lineWidth = 1.3; const tl = Math.sin(t * .5) * 2; X.beginPath(); X.moveTo(1, pts[0][1] + 1); X.lineTo(-3, pts[0][1] + 1 + tl); X.moveTo(-1, pts[0][1] + 1 + tl * .5); X.lineTo(-3, pts[0][1] - 1 + tl); X.stroke();
    },
    iceFox(w, h) {
      X.strokeStyle = '#bae6fd'; X.lineWidth = 3; X.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const lx = 12 + i * 6, sw = Math.sin(t * .4 + i * 1.6) * 3; X.beginPath(); X.moveTo(lx, 18); X.lineTo(lx - 2 + sw, h); X.stroke(); }
      pgo([[33, 14], [42, 5], [42, 19], [34, 19]], '#e8f6ff'); ell(40, 12, 3.2, 6, '#7dd3fc');
      X.fillStyle = lg(0, 8, 0, 22, '#f4fbff', '#cbe9f9'); X.beginPath(); X.ellipse(22, 15, 13, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(40,100,150,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[6, 8], [7, 0], [12, 7]], '#bae6fd'); pgo([[11, 7], [14, 0], [16, 8]], '#bae6fd');
      ell(9, 12, 6, 5.5, '#f4fbff'); pgo([[4, 10], [-1, 14], [5, 15]], '#f4fbff'); ell(0, 14, 1.3, 1.3, '#0f172a'); ell(7, 10.5, 1.2, 1.2, '#0f172a');
    },
    snowHare(w, h, f, wk, o) {
      const hop = -Math.abs(Math.sin(t * .22 + o.phase)) * 3; X.translate(0, hop);
      X.strokeStyle = '#dbeafe'; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(14, 18); X.lineTo(11, h - hop); X.moveTo(26, 19); X.lineTo(29, h - hop); X.stroke();
      ell(20, 15, 12, 7, '#f8fafc'); ell(26, 19, 5, 4, '#e2e8f0'); ell(33, 14, 3.8, 3.8, '#fff');
      pgo([[7, 9], [4, -1], [10, 8]], '#f8fafc'); pgo([[10, 9], [10, -2], [14, 9]], '#f8fafc'); pgo([[8, 7], [6, 1], [9, 7]], '#fbcfe8', 'rgba(0,0,0,0)');
      ell(8, 13, 6, 5.5, '#f8fafc'); ell(5, 12, 1.2, 1.2, '#0f172a'); ell(2, 14, 1.2, 1, '#f9a8d4');
    },
    caveSlime(w, h, f, wk) {
      const top = 6 - wk * 2;
      X.fillStyle = lg(0, top, 0, h, 'rgba(196,181,253,.95)', 'rgba(109,40,217,.92)');
      X.beginPath(); X.moveTo(1, h); X.bezierCurveTo(-1, top + 5, 10, top - 3, 18, top - 3); X.bezierCurveTo(28, top - 3, 37, top + 5, 35, h); X.closePath(); X.fill();
      X.strokeStyle = 'rgba(76,29,149,.6)'; X.lineWidth = 1.5; X.stroke();
      ell(11, top + 4, 4, 2, 'rgba(255,255,255,.45)'); ell(26, h - 7, 2.5, 2.5, 'rgba(255,255,255,.25)'); ell(8, h - 6, 1.8, 1.8, 'rgba(255,255,255,.25)');
      ell(13, h - 11, 3.6, 4, '#fff'); ell(23, h - 11, 3.6, 4, '#fff'); ell(12, h - 10, 1.6, 2.2, '#2e1065'); ell(22, h - 10, 1.6, 2.2, '#2e1065');
      X.strokeStyle = '#2e1065'; X.lineWidth = 1.3; X.beginPath(); X.arc(18, h - 7, 3, .2, Math.PI - .2); X.stroke();
    },
    lavaSlug(w, h) {
      glow(21, 17, 28, '249,115,22', .22);
      ell(21, h - 3, 20, 4, '#f97316');
      X.fillStyle = lg(0, 6, 0, h, '#b91c1c', '#7f1d1d'); X.beginPath(); X.ellipse(21, h - 3, 19, 13, 0, Math.PI, Math.PI * 2); X.fill(); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.3; X.stroke();
      X.strokeStyle = '#fb923c'; X.lineWidth = 2; X.beginPath(); X.moveTo(14, h - 9); X.lineTo(19, h - 14); X.lineTo(23, h - 8); X.lineTo(29, h - 13); X.stroke();
      ell(33, h - 11, 2.4, 2.4, '#fde047'); ell(14, h - 7, 2, 2, '#fde047');
      X.strokeStyle = '#7f1d1d'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(5, h - 8); X.lineTo(2, h - 17); X.moveTo(9, h - 10); X.lineTo(9, h - 19); X.stroke();
      ell(2, h - 18, 2.4, 2.4, '#fef08a'); ell(9, h - 20, 2.4, 2.4, '#fef08a'); ell(2, h - 18, 1, 1, '#111'); ell(9, h - 20, 1, 1, '#111');
    },
    ashRunner(w, h) {
      X.strokeStyle = '#292524'; X.lineWidth = 3; X.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const lx = 12 + i * 6, sw = Math.sin(t * .5 + i * 1.6) * 4; X.beginPath(); X.moveTo(lx, 16); X.lineTo(lx - 3 + sw, h); X.stroke(); }
      const fl = Math.sin(t * .4) * 2;
      pgo([[34, 13], [42, 6 + fl], [38, 13], [43, 16], [34, 18]], '#f97316'); polygon([[35, 14], [40, 10 + fl], [38, 15]], '#fde047');
      X.fillStyle = lg(0, 8, 0, 22, '#57534e', '#292524'); X.beginPath(); X.ellipse(22, 14, 14, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.45)'; X.lineWidth = 1.3; X.stroke();
      X.strokeStyle = '#fb923c'; X.lineWidth = 1.3; X.beginPath(); X.moveTo(16, 11); X.lineTo(20, 15); X.lineTo(25, 11); X.lineTo(29, 15); X.stroke();
      ell(8, 12, 7, 6, '#44403c'); pgo([[3, 10], [-1, 14], [5, 15]], '#44403c'); pgo([[8, 7], [10, 1], [13, 7]], '#292524');
      X.save(); X.shadowColor = '#fde047'; X.shadowBlur = 6; ell(7, 10, 1.7, 1.7, '#fde047'); X.restore();
    },

    // ===== Obstáculos =====
    mushroom(w, h) {
      pgo([[13, h], [15, 16], [25, 16], [27, h]], lg(13, 0, 27, 0, '#fff7e0', '#dcc89a'));
      X.fillStyle = '#4d7c0f'; polygon([[7, h], [10, h - 8], [14, h]], '#4d7c0f'); polygon([[25, h], [29, h - 7], [32, h]], '#65a30d');
      X.fillStyle = lg(0, 4, 0, 20, '#ef4444', '#b91c1c'); X.beginPath(); X.ellipse(19, 19, 19, 15, 0, Math.PI, Math.PI * 2); X.fill();
      X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.4; X.stroke();
      ell(19, 19, 17, 3, '#fcd9a0');
      [[10, 11, 3], [21, 7, 3.5], [29, 13, 2.5], [16, 15, 2]].forEach(([cx, cy, rr]) => ell(cx, cy, rr, rr, '#fff'));
      ell(11, 8, 5, 2, 'rgba(255,255,255,.3)');
    },
    rootArch(w, h) {
      X.lineCap = 'round'; X.lineJoin = 'round';
      const arch = () => { X.beginPath(); X.moveTo(5, h); X.quadraticCurveTo(8, 4, 24, 16); X.quadraticCurveTo(40, 4, 43, h); };
      X.strokeStyle = '#4a2f17'; X.lineWidth = 12; arch(); X.stroke();
      X.strokeStyle = '#8a5a2b'; X.lineWidth = 8; arch(); X.stroke();
      X.strokeStyle = '#b07a3f'; X.lineWidth = 2; X.beginPath(); X.moveTo(8, h - 6); X.quadraticCurveTo(10, 8, 22, 15); X.stroke();
      X.strokeStyle = '#65a30d'; X.lineWidth = 3; X.beginPath(); X.moveTo(10, 14); X.quadraticCurveTo(18, 8, 24, 13); X.stroke();
      pgo([[12, 11], [10, 4], [17, 9]], '#84cc16'); pgo([[34, 9], [38, 2], [40, 10]], '#84cc16'); pgo([[22, 12], [24, 5], [28, 11]], '#65a30d');
      pgo([[0, h], [6, h - 8], [12, h]], '#4a2f17'); pgo([[36, h], [42, h - 8], [48, h]], '#4a2f17');
    },
    thornBush(w, h) {
      X.fillStyle = lg(0, 6, 0, h, '#22c55e', '#14532d'); X.beginPath(); X.ellipse(22, h - 8, 22, 14, 0, Math.PI, Math.PI * 2); X.fill(); X.fillRect(0, h - 9, 44, 9);
      X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.3; X.stroke();
      ell(14, h - 14, 8, 5, 'rgba(255,255,255,.12)');
      for (let i = 0; i < 6; i++) { const bx = 4 + i * 7.2, by = h - 12 - Math.sin(i * 1.3 + 1) * 3; pgo([[bx - 3, by + 3], [bx + 1, by - 10], [bx + 4, by + 3]], '#ecfccb'); }
      [[12, h - 10], [30, h - 12], [22, h - 7]].forEach(([cx, cy]) => { ell(cx, cy, 2.2, 2.2, '#dc2626'); ell(cx - .6, cy - .7, .7, .7, '#fecaca'); });
    },
    cactus(w, h) {
      const g = lg(10, 0, 23, 0, '#2fb765', '#166534');
      rr(10, 4, 13, h - 4, 6, g); rr(1, 20, 9, 7, 3, g); rr(1, 12, 7, 15, 3, g); rr(23, 28, 9, 7, 3, g); rr(25, 18, 7, 17, 3, g);
      X.strokeStyle = 'rgba(0,0,0,.2)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(14.5, 8); X.lineTo(14.5, h - 2); X.moveTo(18.5, 8); X.lineTo(18.5, h - 2); X.stroke();
      X.fillStyle = '#ecfccb'; for (let i = 0; i < 5; i++) { X.fillRect(11, 12 + i * 8, 2, 1.5); X.fillRect(21, 15 + i * 8, 2, 1.5); }
      ell(16.5, 4, 4.5, 3, '#f472b6'); ell(16.5, 4, 1.7, 1.7, '#fde047');
    },
    sandstone(w, h) {
      pgo([[1, h], [3, 16], [13, 3], [w - 6, 9], [w - 1, h]], lg(0, 0, 0, h, '#d9a04e', '#9a5f1f'));
      X.strokeStyle = 'rgba(120,53,15,.4)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(3, h - 9); X.lineTo(w - 3, h - 11); X.moveTo(4, h - 19); X.lineTo(w - 6, h - 20); X.stroke();
      polygon([[8, 17], [14, 6], [22, 9], [14, 19]], 'rgba(254,243,199,.55)');
      X.strokeStyle = '#78350f'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(34, 10); X.lineTo(31, 20); X.lineTo(36, 26); X.stroke();
    },
    bonePile(w, h) {
      X.lineCap = 'round';
      X.strokeStyle = '#cdbf94'; X.lineWidth = 6; X.beginPath(); X.moveTo(5, 22); X.lineTo(43, 12); X.moveTo(6, 10); X.lineTo(42, 23); X.stroke();
      X.strokeStyle = '#fff7dc'; X.lineWidth = 3; X.stroke();
      [[5, 22], [43, 12], [6, 10], [42, 23]].forEach(([cx, cy]) => ell(cx, cy, 3.5, 3.5, '#fff7dc'));
      ell(24, 17, 6, 4, '#eadfbd'); ell(24, 11, 9, 8, '#f5ecd0'); X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1; X.beginPath(); X.ellipse(24, 11, 9, 8, 0, 0, 7); X.stroke();
      ell(20.5, 11, 2.4, 2.8, '#2a1f10'); ell(27.5, 11, 2.4, 2.8, '#2a1f10'); polygon([[23, 14], [25, 14], [24, 17]], '#2a1f10');
      X.strokeStyle = '#2a1f10'; X.lineWidth = 1; X.beginPath(); X.moveTo(20, 19); X.lineTo(28, 19); X.moveTo(22, 17.5); X.lineTo(22, 20.5); X.moveTo(24, 17.5); X.lineTo(24, 20.5); X.moveTo(26, 17.5); X.lineTo(26, 20.5); X.stroke();
    },
    stalagmite(w, h) {
      glow(16, h - 12, 24, '167,139,250', .28 + Math.sin(t * .1) * .06);
      pgo([[1, h], [8, 30], [15, 0], [24, 24], [31, h]], lg(0, 0, 0, h, '#b59cfb', '#5b21b6'));
      polygon([[15, 0], [24, 24], [31, h], [18, h]], 'rgba(0,0,0,.22)');
      polygon([[15, 4], [12, 22], [9, 34]], 'rgba(255,255,255,.35)');
      pgo([[0, h], [2, 42], [8, h]], '#7c3aed');
    },
    crystalCluster(w, h) {
      glow(21, h - 14, 28, '196,181,253', .3 + Math.sin(t * .12) * .08);
      const crys = (x, bw, tip, c1, c2) => {
        pgo([[x, h], [x, tip + 10], [x + bw / 2, tip], [x + bw, tip + 10], [x + bw, h]], lg(x, tip, x + bw, h, c1, c2));
        polygon([[x + bw / 2, tip], [x + bw, tip + 10], [x + bw, h], [x + bw / 2, h]], 'rgba(0,0,0,.2)');
        polygon([[x + 2, tip + 12], [x + bw / 2 - 1, tip + 3], [x + bw / 2 - 1, tip + 16]], 'rgba(255,255,255,.4)');
      };
      crys(2, 12, 20, '#a78bfa', '#5b21b6'); crys(26, 13, 12, '#a78bfa', '#5b21b6'); crys(12, 16, 0, '#ddd6fe', '#7c3aed');
      star(30, 8 + Math.sin(t * .1) * 2, 3, '#fff');
    },
    caveBoulder(w, h) {
      pgo([[1, h], [3, 16], [12, 3], [30, 0], [w - 6, 10], [w - 1, h]], lg(0, 0, 0, h, '#8190a5', '#475569'));
      polygon([[8, 17], [14, 6], [26, 4], [18, 18]], 'rgba(255,255,255,.28)');
      X.strokeStyle = 'rgba(15,23,42,.45)'; X.lineWidth = 1.4; X.beginPath(); X.moveTo(34, 8); X.lineTo(30, 18); X.lineTo(36, 26); X.stroke();
      ell(38, h - 5, 6, 3, '#4d7c0f'); ell(10, h - 4, 4, 2.4, '#65a30d');
    },
    icicle(w, h) {
      glow(15, h - 12, 22, '186,230,253', .25);
      pgo([[0, h], [5, 26], [10, h]], '#bfe9fb'); pgo([[20, h], [25, 22], [30, h]], '#bfe9fb');
      pgo([[8, h], [15, 0], [22, h]], lg(8, 0, 22, h, '#f0fbff', '#7cc9ef'));
      polygon([[15, 0], [22, h], [16, h]], 'rgba(40,120,180,.25)'); polygon([[14, 6], [12, 28], [11, 40]], 'rgba(255,255,255,.7)');
      star(23, 12 + Math.sin(t * .1) * 2, 3, '#fff');
    },
    iceBoulder(w, h) {
      pgo([[1, h], [3, 16], [12, 3], [w - 8, 8], [w - 1, h]], lg(0, 0, 0, h, 'rgba(214,242,253,.98)', 'rgba(77,170,222,.98)'));
      polygon([[8, 18], [14, 6], [24, 9], [18, 20]], 'rgba(255,255,255,.6)'); polygon([[28, 10], [w - 8, 8], [w - 2, h], [32, h]], 'rgba(30,110,170,.2)');
      X.strokeStyle = 'rgba(255,255,255,.55)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(26, 14); X.lineTo(22, 26); X.lineTo(30, h); X.stroke();
      star(36, 14 + Math.sin(t * .1) * 2, 3, '#fff');
    },
    snowDrift(w, h) {
      X.fillStyle = lg(0, 0, 0, h, '#ffffff', '#c7e6f7'); X.beginPath(); X.ellipse(25, h, 25, h - 2, 0, Math.PI, Math.PI * 2); X.fill();
      X.strokeStyle = 'rgba(80,140,190,.35)'; X.lineWidth = 1.2; X.stroke();
      ell(14, h, 12, h * .6, '#fff', Math.PI, Math.PI * 2); ell(37, h, 11, h * .5, '#eef8ff', Math.PI, Math.PI * 2);
      star(20, 8 + Math.sin(t * .1) * 1.5, 2.5, '#bae6fd'); star(38, 12, 2, '#bae6fd');
    },
    lavaVent(w, h) {
      glow(21, 16, 30, '249,115,22', .3 + Math.sin(t * .15) * .08);
      pgo([[0, h], [10, 18], [32, 18], [42, h]], lg(0, 16, 0, h, '#4a3631', '#1f1512'));
      polygon([[10, 18], [4, h - 10], [0, h]], 'rgba(255,255,255,.08)');
      ell(21, 18, 11, 4, '#7f1d1d'); ell(21, 18, 9, 3, '#f97316'); ell(21, 18, 5, 1.8, '#fde047');
      const fl = Math.sin(t * .3) * 2;
      pgo([[12, 18], [16, 7 + fl], [21, 14], [26, 1 + fl * .5], [30, 18]], '#f97316', 'rgba(0,0,0,0)'); polygon([[17, 18], [21, 9], [25, 18]], '#fde047');
      for (let i = 0; i < 3; i++) { const sy = (t * .8 + i * 9) % 20; X.fillStyle = `rgba(253,224,71,${1 - sy / 20})`; X.beginPath(); X.arc(14 + i * 7, 14 - sy * .6, 1.4, 0, 7); X.fill(); }
    },
    charRock(w, h) {
      const pl = .6 + .4 * Math.sin(t * .12);
      pgo([[1, h], [3, 14], [12, 2], [w - 6, 9], [w - 1, h]], lg(0, 0, 0, h, '#4a403c', '#1c1917'));
      polygon([[8, 16], [14, 5], [22, 8], [16, 18]], 'rgba(255,255,255,.12)');
      X.save(); X.strokeStyle = '#f97316'; X.lineWidth = 2.5; X.shadowColor = '#f97316'; X.shadowBlur = 8 * pl;
      X.beginPath(); X.moveTo(15, 12); X.lineTo(19, 23); X.lineTo(15, h); X.moveTo(30, 14); X.lineTo(26, 22); X.lineTo(33, 30); X.stroke(); X.restore();
    },
    obsidianSpike(w, h) {
      const spike = (pts, c) => { pgo(pts, c); };
      spike([[0, h], [6, 28], [12, h]], lg(0, 28, 12, h, '#2e1f2f', '#0b0610'));
      spike([[28, h], [34, 22], [40, h]], lg(28, 22, 40, h, '#2e1f2f', '#0b0610'));
      spike([[8, h], [18, 0], [32, h]], lg(8, 0, 32, h, '#3b2a40', '#0b0610'));
      polygon([[18, 0], [32, h], [22, h]], 'rgba(0,0,0,.35)');
      X.strokeStyle = 'rgba(255,255,255,.45)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(17, 8); X.lineTo(13, 30); X.stroke();
      X.strokeStyle = 'rgba(239,68,68,.7)'; X.lineWidth = 1; X.beginPath(); X.moveTo(20, 10); X.lineTo(22, 30); X.stroke();
    },
    stump(w, h) {
      pgo([[5, h], [4, 12], [38, 12], [37, h]], lg(4, 0, 38, 0, '#a0652c', '#5b3414'));
      pgo([[0, h], [6, h - 8], [10, h]], '#5b3414'); pgo([[32, h], [37, h - 8], [42, h]], '#5b3414');
      ell(21, 12, 18, 7, '#d29a5c'); X.strokeStyle = '#8a5a2b'; X.lineWidth = 1.4;
      X.beginPath(); X.ellipse(21, 12, 12, 4.5, 0, 0, 7); X.stroke(); X.beginPath(); X.ellipse(21, 12, 6, 2.2, 0, 0, 7); X.stroke();
      ell(8, 10, 6, 3, '#4d7c0f'); ell(33, 11, 5, 2.5, '#65a30d');
      ell(35, 7, 3, 2, '#dc2626', Math.PI, Math.PI * 2); X.fillStyle = '#fef3c7'; X.fillRect(34, 7, 2, 4);
    },
    rock(w, h) {
      pgo([[1, h], [3, 14], [12, 2], [w - 6, 9], [w - 1, h]], lg(0, 0, 0, h, '#8392a6', '#4b5668'));
      polygon([[8, 16], [14, 5], [22, 8], [16, 18]], 'rgba(255,255,255,.3)');
      X.strokeStyle = 'rgba(15,23,42,.4)'; X.lineWidth = 1.3; X.beginPath(); X.moveTo(30, 9); X.lineTo(27, 17); X.lineTo(32, 22); X.stroke();
    },
    spikes(w, h) {
      rr(0, h - 4, 40, 4, 2, '#334155');
      for (let i = 0; i < 4; i++) {
        pgo([[i * 10, h - 3], [i * 10 + 5, 0], [i * 10 + 10, h - 3]], lg(i * 10, 0, i * 10 + 10, 0, '#e2e8f0', '#64748b'));
        X.strokeStyle = 'rgba(255,255,255,.7)'; X.lineWidth = 1; X.beginPath(); X.moveTo(i * 10 + 4, 4); X.lineTo(i * 10 + 3, h - 6); X.stroke();
      }
    },
  };
  SPR.bat = SPR.caveBat;

  function drawObstacle(o) {
    const w = o.w, h = o.h, f = Math.sin(t * .4 + o.phase) * 8, wk = Math.sin(t * .3 + o.phase);
    const k = 1 - Math.min(1, Math.max(0, GY - o.y - h) / 160);
    X.fillStyle = `rgba(0,0,0,${.1 + .18 * k})`; X.beginPath(); X.ellipse(o.x + w / 2, GY + 3, w * (.28 + .26 * k), 2 + 2.5 * k, 0, 0, 7); X.fill();
    X.save(); X.translate(o.x, o.y);
    const art = SPR[o.k];
    if (art) art(w, h, f, wk, o);
    else { X.fillStyle = '#5d4037'; X.fillRect(0, 0, w, h); X.fillStyle = '#8d6e63'; X.fillRect(3, 3, w - 6, 5); }
    X.restore();
  }

  // ---------- Orbes (vida, energia, ressurreição) ----------
  function drawOrb(i) {
    const kind = i.k, ph = i.x * .03;
    const pulse = 1 + Math.sin(t * .12 + ph) * .08, bob = Math.sin(t * .07 + ph) * 3;
    const pal = kind === 'heart' ? { rgb: '255,64,129', a: '#ffc2d9', b: '#ff4081', c: '#9d174d' }
      : kind === 'crystal' ? { rgb: '64,196,255', a: '#c4f0ff', b: '#40c4ff', c: '#0369a1' }
        : { rgb: '196,181,253', a: '#faf8ff', b: '#c4b5fd', c: '#6d28d9' };
    X.save(); X.translate(i.x, i.y + bob);
    glow(0, 0, (kind === 'resurrection' ? 36 : 27) * pulse, pal.rgb, .55);
    if (kind === 'resurrection') {
      const fl = Math.sin(t * .15) * 4;
      [-1, 1].forEach(s => {
        X.save(); X.scale(s, 1);
        pgo([[10, -2], [26, -12 + fl], [31, -4 + fl], [23, 0], [29, 6 + fl * .5], [18, 6], [10, 6]], 'rgba(250,248,255,.92)', 'rgba(109,40,217,.5)');
        X.restore();
      });
      X.strokeStyle = 'rgba(237,233,254,.85)'; X.lineWidth = 1.5;
      X.beginPath(); X.ellipse(0, 0, 19, 6, t * .04, 0, 7); X.stroke(); X.beginPath(); X.ellipse(0, 0, 19, 6, -t * .04 + 1.6, 0, 7); X.stroke();
    }
    X.fillStyle = rg(-3, -4, 1, 14 * pulse, [[0, pal.a], [.55, pal.b], [1, pal.c]]);
    X.beginPath(); X.arc(0, 0, 12.5 * pulse, 0, 7); X.fill();
    X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 1.2; X.stroke();
    X.fillStyle = 'rgba(255,255,255,.8)'; X.beginPath(); X.ellipse(-4.5, -5.5, 3.6, 2, -.6, 0, 7); X.fill();
    X.fillStyle = '#fff'; X.strokeStyle = '#fff';
    if (kind === 'heart') {
      X.beginPath(); X.moveTo(0, 5.5); X.bezierCurveTo(-9, -1, -6, -8, 0, -3); X.bezierCurveTo(6, -8, 9, -1, 0, 5.5); X.fill();
    } else if (kind === 'crystal') {
      polygon([[2.5, -8], [-4, 1], [0, 1], [-2.5, 8], [5, -2], [1, -2]], '#fff');
    } else {
      X.lineWidth = 2.2; X.lineCap = 'round';
      X.beginPath(); X.ellipse(0, -3.5, 3, 3.6, 0, 0, 7); X.stroke(); X.beginPath(); X.moveTo(0, .2); X.lineTo(0, 8); X.moveTo(-4, 3.5); X.lineTo(4, 3.5); X.stroke();
      for (let k = 0; k < 4; k++) { const ry = ((t * .5 + k * 12) % 44); X.fillStyle = `rgba(237,233,254,${1 - ry / 44})`; X.beginPath(); X.arc(Math.sin(k * 2.3 + ry * .1) * 12, 12 - ry, 1.6, 0, 7); X.fill(); }
    }
    for (let k = 0; k < 3; k++) { const a = t * .05 + k * 2.094; star(Math.cos(a) * 19, Math.sin(a) * 8 - 2, 2.6, 'rgba(255,255,255,.95)'); }
    X.restore();
  }

  // Colinas com paralaxe
  function ridge(speed, base, amp, color, seed) {
    X.fillStyle = color; X.beginPath(); X.moveTo(0, GY);
    for (let x = 0; x <= W; x += 10) {
      const wx = x + scr * speed;
      X.lineTo(x, GY - base - Math.sin(wx * .01 + seed) * amp - Math.sin(wx * .023 + seed * 2) * amp * .5);
    }
    X.lineTo(W, GY); X.closePath(); X.fill();
  }

  function draw() {
    const bi = biome % BIOMES.length, b = BIOMES[bi], g = X.createLinearGradient(0, 0, 0, GY);
    if (bi !== lastBi) { lastBi = bi; document.documentElement.style.setProperty('--biome', b.bc); }

    X.save();
    if (shake > 0) X.translate(R(-1, 1) * shake * .5, R(-1, 1) * shake * .5);

    g.addColorStop(0, b.sky[0]); g.addColorStop(1, b.sky[1]);
    X.fillStyle = g; X.fillRect(-12, -12, W + 24, H + 24);
    ridge(.08, 110, 34, 'rgba(0,0,0,.10)', 1);
    ridge(.2, 60, 22, 'rgba(0,0,0,.18)', 4);
    ridge(.4, 25, 12, 'rgba(0,0,0,.25)', 9);

    X.fillStyle = b.gr; X.fillRect(-12, GY, W + 24, H - GY + 12);
    const gg = X.createLinearGradient(0, GY, 0, H);
    gg.addColorStop(0, 'rgba(255,255,255,.12)'); gg.addColorStop(1, 'rgba(0,0,0,.45)');
    X.fillStyle = gg; X.fillRect(-12, GY, W + 24, H - GY + 12);
    X.fillStyle = 'rgba(255,255,255,.25)'; X.fillRect(-12, GY, W + 24, 2);
    X.fillStyle = 'rgba(0,0,0,.18)';
    for (let i = 0; i < 20; i++) X.fillRect(i * 60 - (scr % 60), GY + 12 + (i % 3) * 14, 20, 3);

    // Partículas ambientes do bioma
    amb.forEach(a => {
      X.globalAlpha = Math.min(1, a.life / 40) * (a.kind === 'snow' ? .85 : .9);
      X.fillStyle = a.c;
      if (a.kind !== 'snow') { X.shadowColor = a.c; X.shadowBlur = 8; }
      X.beginPath(); X.arc(a.x, a.y, a.r, 0, 7); X.fill();
      X.shadowBlur = 0;
    });
    X.globalAlpha = 1;

    obs.forEach(drawObstacle);
    items.forEach(i => {
      if (i.k === 'sword') {
        const sword = SWORDS[i.weapon];
        X.save(); X.translate(i.x, i.y + Math.sin(t * .08 + i.x * .02) * 3);
        glow(0, 0, 26, '255,255,255', .18);
        X.rotate(-.65);
        X.shadowColor = sword.color; X.shadowBlur = 12;
        drawSwordSprite(sword);
        X.shadowBlur = 0;
        X.restore();
      } else drawOrb(i);
    });
    proj.forEach(drawProjectile);

    // Partículas de impacto
    parts.forEach(p => { X.globalAlpha = Math.max(0, p.life / p.max); X.fillStyle = p.c; X.beginPath(); X.arc(p.x, p.y, p.r, 0, 7); X.fill(); });
    X.globalAlpha = 1;

    if (boss) drawBoss();
    drawDino(P, '#2e7d32');
    drawPowerEffect(P);
    if (twoPlayer && P2) drawDino(P2, '#2563eb');
    if (twoPlayer && P2) drawPowerEffect(P2);

    X.restore(); // fim do tremor: o HUD fica parado

    X.fillStyle = `rgba(5,10,40,${(1 - Math.cos(t / 900)) / 2 * .5})`; X.fillRect(0, 0, W, H);
    if (fade > 0) { X.fillStyle = `rgba(255,255,255,${fade * .6})`; X.fillRect(0, 0, W, H); }

    X.textAlign = 'left'; X.font = '20px sans-serif';
    const renderHP = (p, x, color = '#ef4444') => {
      X.font = '20px sans-serif';
      for (let i = 0; i < 5; i++) {
        const hx = x + 9 + i * 22, hy = 20, hs = 8.5;
        const heartPath = () => {
          X.beginPath(); X.moveTo(hx, hy + hs * .9); X.bezierCurveTo(hx - hs * 1.6, hy - hs * .2, hx - hs * .8, hy - hs * 1.3, hx, hy - hs * .45);
          X.bezierCurveTo(hx + hs * .8, hy - hs * 1.3, hx + hs * 1.6, hy - hs * .2, hx, hy + hs * .9); X.closePath();
        };
        const fill = Math.max(0, Math.min(1, p.hp - i));
        heartPath(); X.fillStyle = 'rgba(255,255,255,.16)'; X.fill();
        if (fill > 0) {
          X.save(); heartPath(); X.clip();
          const gradient = X.createLinearGradient(0, hy - hs, 0, hy + hs);
          gradient.addColorStop(0, '#fff'); gradient.addColorStop(.22, color); gradient.addColorStop(1, color);
          X.fillStyle = gradient; X.fillRect(hx - hs * 1.7, hy - hs * 1.5, hs * 3.4 * fill, hs * 3);
          ell(hx - 3.5, hy - 3.5, 2.4, 1.4, 'rgba(255,255,255,.65)');
          X.restore();
        }
        heartPath(); X.strokeStyle = 'rgba(0,0,0,.6)'; X.lineWidth = 1.5; X.stroke();
      }
      X.fillStyle = 'rgba(0,0,0,.4)'; X.fillRect(x, 38, 110, 9);
      X.fillStyle = lg(x, 0, x + 110, 0, '#0284c7', '#67e8f9'); X.fillRect(x, 38, 110 * p.en / 100, 9);
      X.strokeStyle = 'rgba(255,255,255,.35)'; X.lineWidth = 1; X.strokeRect(x, 38, 110, 9);
      if (canDash(p)) {
        X.fillStyle = '#86efac'; X.fillRect(x, 52, 110, 4);
        X.fillStyle = '#fff'; X.font = 'bold 9px sans-serif'; otext('INVESTIDA PRONTA', x, 67);
      }
      const sword = swordOf(p);
      if (sword) {
        X.fillStyle = sword.color; X.font = 'bold 10px sans-serif';
        otext(`ESPADA ${sword.name.toUpperCase()} ${Math.ceil(p.weaponTimer / 60)}s`, x, 83);
        X.fillStyle = p.powerCd <= 0 ? '#fff' : '#9ca3af'; X.font = 'bold 9px sans-serif';
        otext(`${p.powerCd <= 0 ? 'PODER PRONTO' : `PODER ${Math.ceil(p.powerCd / 60)}s`} (${p === P ? 'V' : 'P'})`, x, 96);
      }
    };
    renderHP(P, 10, '#ef4444');
    if (twoPlayer && P2) renderHP(P2, 560, '#60a5fa');

    if (toast > 0) { X.globalAlpha = Math.min(1, toast / 40); X.textAlign = 'center'; X.font = 'bold 28px sans-serif'; X.fillStyle = '#fff'; X.lineWidth = 5; otext(toastT, W / 2, 80); X.globalAlpha = 1; }
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