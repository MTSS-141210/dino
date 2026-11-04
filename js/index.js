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
    if (!p || p.hp <= 0) return;
    p.hp = Math.min(5, p.hp + amount);
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
      else {
        const reach = 200, area = { x: p.face > 0 ? p.x : p.x - reach, y: GY - 90, w: reach, h: 100 };
        let destroyed = 0;
        obs = obs.filter(o => { if (ov(area, o)) { destroyed++; puff(o.x + o.w / 2, o.y + o.h / 2, 8, '#facc15', { s: 1.5 }); return false; } return true; });
        bonus += destroyed * 10;
      }
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
          recoverLife(p, 1);
          puff(o.x + o.w / 2, o.y + o.h / 2, 10, '#fde047');
          say('+1 coração');
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
        let struck = false;
        obs = obs.filter(o => { if (ov(p, o)) { struck = true; bonus += 10; puff(o.x + o.w / 2, o.y + o.h / 2, 8, p.c); return false; } return true; });
        return !struck;
      }
      for (const j of alive) {
        if (sb(j) && ov(sb(j), p)) { bonus += 5; puff(p.x + p.w / 2, p.y + p.h / 2, 6, p.c || '#fff', { s: 1.2 }); return false; }
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
    if (p.sw > 0) {
      const a = -1.3 + (12 - p.sw) / 12 * 2.6;
      const sword = swordOf(p), reach = sword?.id === 'wind' ? 100 : 55;
      X.strokeStyle = sword?.color || '#e5e7eb'; X.lineWidth = 5; X.beginPath();
      X.moveTo(12, -24); X.lineTo(12 + Math.cos(a) * reach, -24 + Math.sin(a) * reach); X.stroke();
      // rastro do golpe
      X.save(); X.globalAlpha *= .35; X.lineWidth = 12; X.beginPath(); X.arc(12, -24, reach * .9, -1.3, a); X.stroke(); X.restore();
    }
    if (p.sh) { X.strokeStyle = '#42a5f5'; X.lineWidth = 4; X.beginPath(); X.arc(16, -26, 24, -1.2, 1.2); X.stroke(); }
    X.restore();
  }

  function drawSwordSprite(sword) {
    const shapes = {
      flame: [[-3, 8], [-2, 0], [-4, -5], [1, -10], [0, -17], [6, -8], [3, 1], [4, 8]],
      frost: [[-3, 8], [-7, -2], [0, -18], [7, -2], [3, 8]],
      thunder: [[-3, 8], [-1, 0], [-5, -4], [1, -9], [-1, -17], [7, -7], [2, -3], [4, 8]],
      venom: [[-3, 8], [-5, 1], [-1, -4], [-4, -9], [1, -17], [5, -8], [2, -1], [4, 8]],
      wind: [[-3, 8], [-5, -1], [-2, -8], [0, -17], [4, -7], [3, 1], [4, 8]],
      crystal: [[-3, 8], [-6, 1], [0, -5], [-4, -10], [0, -18], [6, -10], [1, -5], [6, 1], [3, 8]],
    };
    polygon(shapes[sword.id] || shapes.flame, sword.color);
    X.strokeStyle = '#d6d3d1'; X.lineWidth = 3; X.beginPath(); X.moveTo(-6, 7); X.lineTo(6, 7); X.stroke();
    X.strokeStyle = '#78350f'; X.lineWidth = 4; X.beginPath(); X.moveTo(0, 8); X.lineTo(0, 14); X.stroke();
  }

  function drawPowerEffect(p) {
    if (!p.powerFx) return;
    const { id, tm } = p.powerFx;
    X.save(); X.globalAlpha = Math.min(1, tm / 12); X.translate(p.x, p.y - 30);
    if (id === 'flame') {
      polygon([[-18, 8], [-13, -5], [-6, 2], [0, -22], [8, 1], [15, -8], [20, 9]], '#f97316');
      polygon([[-9, 8], [-4, -3], [1, 2], [6, -11], [11, 8]], '#fde047');
    } else if (id === 'frost') {
      X.strokeStyle = '#7dd3fc'; X.lineWidth = 3;
      for (let i = 0; i < 6; i++) { const a = i * Math.PI / 3; X.beginPath(); X.moveTo(Math.cos(a) * 5, Math.sin(a) * 5); X.lineTo(Math.cos(a) * 26, Math.sin(a) * 26); X.stroke(); }
      polygon([[-5, 0], [0, -9], [5, 0], [0, 9]], '#e0f2fe');
    } else if (id === 'thunder') {
      polygon([[-3, -25], [8, -8], [2, -8], [8, 8], [-12, -9], [-5, -9]], '#facc15');
      X.strokeStyle = '#fef08a'; X.lineWidth = 2; X.strokeRect(-20, -28, 40, 40);
    } else if (id === 'venom') {
      X.fillStyle = '#a3e635';
      [[-15, 2, 6], [-5, -12, 8], [10, 4, 7], [15, -16, 5]].forEach(([x, y, r]) => { X.beginPath(); X.arc(x, y, r, 0, Math.PI * 2); X.fill(); });
      X.strokeStyle = '#4d7c0f'; X.lineWidth = 3; X.beginPath(); X.arc(0, 0, 24, .2, Math.PI * 1.7); X.stroke();
    } else if (id === 'wind') {
      X.strokeStyle = '#5eead4'; X.lineWidth = 3;
      for (let i = 0; i < 3; i++) { X.beginPath(); X.arc(0, 0, 12 + i * 7, -.8 + i * .3, 1.3 + i * .3); X.stroke(); }
    } else if (id === 'crystal') {
      X.strokeStyle = '#c4b5fd'; X.lineWidth = 3; X.beginPath(); X.arc(0, 0, 26, 0, Math.PI * 2); X.stroke();
      polygon([[-7, 0], [0, -12], [7, 0], [0, 12]], '#ede9fe');
      polygon([[-20, -15], [-15, -22], [-10, -15], [-15, -8]], '#a78bfa');
      polygon([[10, 15], [15, 8], [20, 15], [15, 22]], '#a78bfa');
    }
    X.restore();
  }

  function drawBoss() {
    const biomeIndex = biome % BIOMES.length;
    const b = BIOMES[biomeIndex], r = bb(), x = r.x, y = r.y, w = r.w, h = r.h;
    const base = boss.flash ? '#fff' : boss.s === 'stun' ? '#9e9e9e' : b.bc;
    // sombra do chefe
    X.fillStyle = 'rgba(0,0,0,.28)'; X.beginPath(); X.ellipse(x + w / 2, GY + 3, w * .6, 6, 0, 0, 7); X.fill();
    X.fillStyle = base;
    if (biomeIndex === 0) {
      X.fillRect(x + 12, y + 24, w - 24, h - 24);
      for (let i = 0; i < 4; i++) { X.beginPath(); X.arc(x + 12 + i * 22, y + 22, 21, 0, Math.PI * 2); X.fill(); }
      X.fillStyle = '#254d20'; X.fillRect(x + 25, y + 58, 8, 24); X.fillRect(x + 55, y + 58, 8, 24);
    } else if (biomeIndex === 1) {
      polygon([[x + 8, y + 30], [x + w / 2, y + 4], [x + w - 8, y + 30], [x + w - 4, y + h], [x + 4, y + h]], base);
      X.fillStyle = '#f2c46d'; X.fillRect(x + 7, y + 58, w - 14, 10);
      polygon([[x + 8, y + 68], [x - 6, y + 80], [x + 8, y + 78]], '#f2c46d');
    } else if (biomeIndex === 2) {
      polygon([[x + 12, y + 22], [x + 28, y + 5], [x + 42, y + 20], [x + 62, y + 2], [x + 78, y + 25], [x + w, y + h], [x, y + h]], base);
      polygon([[x + 4, y + 42], [x - 9, y + 22], [x + 20, y + 37]], '#c4b5fd');
      polygon([[x + w - 4, y + 42], [x + w + 9, y + 22], [x + w - 20, y + 37]], '#c4b5fd');
    } else if (biomeIndex === 3) {
      polygon([[x + 8, y + h], [x + 14, y + 30], [x + 28, y + 42], [x + 45, y + 4], [x + 59, y + 40], [x + 76, y + 20], [x + w - 6, y + h]], base);
      X.fillStyle = '#e0f2fe'; X.fillRect(x + 12, y + 76, w - 24, 9);
    } else if (biomeIndex === 4) {
      X.fillRect(x + 10, y + 24, w - 20, h - 24);
      polygon([[x + 12, y + 28], [x + 5, y + 2], [x + 31, y + 25]], '#7f1d1d');
      polygon([[x + w - 12, y + 28], [x + w - 5, y + 2], [x + w - 31, y + 25]], '#7f1d1d');
      polygon([[x + 30, y + 63], [x + 40, y + 70], [x + 31, y + 86]], '#fb923c');
      polygon([[x + 60, y + 50], [x + 67, y + 57], [x + 58, y + 74]], '#fb923c');
    } else if (biomeIndex === 5) {
      polygon([[x + 10, y + 10], [x + w * 0.5, y + 2], [x + w - 10, y + 18], [x + w - 4, y + h], [x + 4, y + h]], base);
      X.fillStyle = '#a3e635'; X.fillRect(x + 18, y + 62, w - 36, 12);
      X.fillStyle = '#14532d'; X.fillRect(x + 24, y + 58, 8, 18); X.fillRect(x + 58, y + 58, 8, 18);
    } else if (biomeIndex === 6) {
      polygon([[x + 8, y + 32], [x + w * 0.5, y + 4], [x + w - 10, y + 34], [x + w - 8, y + h], [x + 8, y + h]], base);
      X.fillStyle = '#dbeafe'; X.fillRect(x + 13, y + 56, w - 26, 10); X.fillRect(x + 22, y + 70, w - 44, 8);
    } else {
      polygon([[x + 10, y + 30], [x + w * 0.5, y + 6], [x + w - 10, y + 30], [x + w - 8, y + h], [x + 8, y + h]], base);
      X.fillStyle = '#bae6fd'; X.fillRect(x + 16, y + 68, w - 32, 8);
      X.fillStyle = '#f0f9ff'; X.fillRect(x + 24, y + 56, 12, 22); X.fillRect(x + 54, y + 56, 12, 22);
    }
    X.fillStyle = '#fff'; X.fillRect(x + 19, y + 34, 15, 12); X.fillRect(x + 56, y + 34, 15, 12);
    X.fillStyle = biomeIndex === 4 ? '#7f1d1d' : '#000';
    X.fillRect(x + 24, y + 37, 6, 6); X.fillRect(x + 61, y + 37, 6, 6);
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

  function drawProjectileRaw(p) {
    if (p.kind === 'root') {
      X.fillStyle = p.c; X.fillRect(p.x, p.y + 10, p.w, p.h - 10);
      for (let i = 0; i < 4; i++) polygon([[p.x + i * 17, p.y + 12], [p.x + i * 17 + 8, p.y], [p.x + i * 17 + 15, p.y + 12]], '#a16207');
    } else if (p.kind === 'vine') {
      X.strokeStyle = p.c; X.lineWidth = 7; X.beginPath(); X.moveTo(p.x, p.y + p.h / 2);
      for (let i = 1; i <= 5; i++) X.lineTo(p.x + p.w * i / 5, p.y + (i % 2 ? 0 : p.h)); X.stroke();
    } else if (p.kind === 'seed') {
      X.fillStyle = p.c; X.beginPath(); X.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, -.5, 0, Math.PI * 2); X.fill();
      X.fillStyle = '#365314'; X.fillRect(p.x + p.w / 2, p.y + 3, 2, p.h - 6);
    } else if (p.kind === 'thorn') {
      polygon([[p.x + p.w / 2, p.y], [p.x + p.w, p.y + p.h], [p.x, p.y + p.h]], p.c);
    } else if (p.kind === 'sand' || p.kind === 'magma' || p.kind === 'iceSlide') {
      X.fillStyle = p.c; X.beginPath(); X.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, Math.PI, Math.PI * 2); X.fill();
      X.fillRect(p.x, p.y + p.h / 2, p.w, p.h / 2);
      if (p.kind === 'magma') { X.fillStyle = '#fef08a'; X.fillRect(p.x + 8, p.y + p.h / 2, p.w - 16, 4); }
      if (p.kind === 'iceSlide') { X.fillStyle = '#e0f2fe'; X.fillRect(p.x + 10, p.y + p.h / 2, p.w - 20, 3); }
    } else if (['crystal', 'ice', 'crystalLance', 'shard', 'icicle'].includes(p.kind)) {
      polygon([[p.x + p.w / 2, p.y], [p.x + p.w, p.y + p.h * .35], [p.x + p.w * .72, p.y + p.h], [p.x + p.w * .25, p.y + p.h * .82], [p.x, p.y + p.h * .3]], p.c);
      X.fillStyle = 'rgba(255,255,255,.55)'; X.fillRect(p.x + p.w * .45, p.y + p.h * .25, 2, p.h * .5);
    } else if (p.kind === 'sun') {
      X.fillStyle = p.c; X.beginPath(); X.moveTo(p.x, p.y); X.lineTo(p.x + p.w - 8, p.y + p.h / 2); X.lineTo(p.x, p.y + p.h); X.lineTo(p.x + 8, p.y + p.h / 2); X.closePath(); X.fill();
    } else if (p.kind === 'sandShard' || p.kind === 'rock') {
      polygon([[p.x + p.w * .25, p.y], [p.x + p.w, p.y + p.h * .2], [p.x + p.w * .8, p.y + p.h], [p.x, p.y + p.h * .7], [p.x + p.w * .1, p.y + p.h * .3]], p.c);
    } else if (p.kind === 'echo') {
      X.strokeStyle = p.c; X.lineWidth = 5; X.beginPath(); X.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2 - 3, 0, Math.PI * 2); X.stroke();
      X.beginPath(); X.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 4, 0, Math.PI * 2); X.stroke();
    } else if (p.kind === 'snow') {
      X.fillStyle = p.c; X.beginPath(); X.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2); X.fill();
      X.strokeStyle = '#bae6fd'; X.lineWidth = 2; X.beginPath(); X.moveTo(p.x + 4, p.y + p.h / 2); X.lineTo(p.x + p.w - 4, p.y + p.h / 2); X.stroke();
    } else if (p.kind === 'venomOrb') {
      X.fillStyle = '#365314'; X.beginPath(); X.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2); X.fill();
      X.fillStyle = p.c; X.beginPath(); X.arc(p.x + p.w / 2 - 3, p.y + p.h / 2 - 3, p.w / 3, 0, Math.PI * 2); X.fill();
    } else if (p.kind === 'fireball' || p.kind === 'lava') {
      X.fillStyle = p.kind === 'lava' ? '#b91c1c' : '#f97316'; X.beginPath(); X.ellipse(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, p.h / 2, 0, 0, Math.PI * 2); X.fill();
      X.fillStyle = p.kind === 'lava' ? '#f97316' : '#fef08a'; X.fillRect(p.x + p.w * .3, p.y + p.h * .3, p.w * .4, p.h * .25);
    } else if (p.kind === 'eruption') {
      X.fillStyle = 'rgba(239,68,68,.4)'; X.fillRect(p.x - 6, GY - 4, p.w + 12, 4);
      polygon([[p.x + 4, GY], [p.x + p.w * .25, p.y + 18], [p.x + p.w * .45, p.y], [p.x + p.w * .7, p.y + 20], [p.x + p.w - 4, GY]], p.c);
    } else {
      X.fillStyle = p.c; X.fillRect(p.x, p.y, p.w, p.h);
    }
  }

  // Projétil com brilho na própria cor
  function drawProjectile(p) {
    X.save();
    X.shadowColor = p.c || '#fff'; X.shadowBlur = 12;
    drawProjectileRaw(p);
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

    obs.forEach(o => {
      const flap = Math.sin(t * .4) * 8;
      if (o.k === 'bird') {
        X.fillStyle = '#334155'; X.beginPath(); X.ellipse(o.x + 17, o.y + 13, 12, 8, 0, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 23, o.y + 11], [o.x + 34, o.y + 14], [o.x + 23, o.y + 16]], '#f59e0b');
        polygon([[o.x + 12, o.y + 12], [o.x + 3, o.y + flap], [o.x + 19, o.y + 10]], '#64748b');
        X.fillStyle = '#fff'; X.fillRect(o.x + 21, o.y + 9, 3, 3);
      } else if (o.k === 'forestWisp') {
        X.fillStyle = 'rgba(74,222,128,.25)'; X.beginPath(); X.arc(o.x + 15, o.y + 14, 14, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#86efac'; X.beginPath(); X.ellipse(o.x + 15, o.y + 14, 8, 11, 0, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 8, o.y + 14], [o.x, o.y + 3 + flap / 2], [o.x + 13, o.y + 10]], '#22c55e');
        polygon([[o.x + 22, o.y + 14], [o.x + 30, o.y + 3 - flap / 2], [o.x + 17, o.y + 10]], '#4ade80');
        X.fillStyle = '#14532d'; X.fillRect(o.x + 12, o.y + 12, 2, 2); X.fillRect(o.x + 17, o.y + 12, 2, 2);
      } else if (o.k === 'forestMoth') {
        polygon([[o.x + 18, o.y + 14], [o.x + 2, o.y + 2 + flap], [o.x + 15, o.y + 20]], '#f0abfc');
        polygon([[o.x + 20, o.y + 14], [o.x + 36, o.y + 2 - flap], [o.x + 23, o.y + 20]], '#c084fc');
        X.fillStyle = '#7e22ce'; X.beginPath(); X.ellipse(o.x + 19, o.y + 14, 4, 12, 0, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#fef08a'; X.beginPath(); X.arc(o.x + 18, o.y + 10, 2, 0, Math.PI * 2); X.arc(o.x + 20, o.y + 16, 2, 0, Math.PI * 2); X.fill();
      } else if (o.k === 'bat' || o.k === 'caveBat' || o.k === 'emberBat') {
        const wing = o.k === 'emberBat' ? '#f97316' : '#7c3aed';
        const body = o.k === 'emberBat' ? '#7f1d1d' : '#312e81';
        polygon([[o.x + 19, o.y + 11], [o.x + 2, o.y + flap], [o.x + 7, o.y + 19], [o.x + 15, o.y + 16]], wing);
        polygon([[o.x + 19, o.y + 11], [o.x + 36, o.y + flap], [o.x + 31, o.y + 19], [o.x + 23, o.y + 16]], wing);
        X.fillStyle = body; X.beginPath(); X.ellipse(o.x + 19, o.y + 13, 8, 11, 0, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 13, o.y + 7], [o.x + 10, o.y], [o.x + 17, o.y + 6]], body);
        polygon([[o.x + 21, o.y + 6], [o.x + 28, o.y], [o.x + 25, o.y + 8]], body);
        X.fillStyle = o.k === 'emberBat' ? '#fef08a' : '#fda4af'; X.fillRect(o.x + 16, o.y + 12, 2, 3); X.fillRect(o.x + 21, o.y + 12, 2, 3);
      } else if (o.k === 'vulture') {
        X.fillStyle = '#78350f'; X.beginPath(); X.ellipse(o.x + 19, o.y + 17, 15, 8, -.2, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 17, o.y + 14], [o.x + 1, o.y + flap], [o.x + 20, o.y + 10]], '#a16207');
        X.fillStyle = '#fca5a5'; X.beginPath(); X.arc(o.x + 32, o.y + 11, 6, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 35, o.y + 11], [o.x + 42, o.y + 14], [o.x + 34, o.y + 16]], '#facc15');
        X.fillStyle = '#111827'; X.fillRect(o.x + 33, o.y + 9, 2, 2);
      } else if (o.k === 'snowOwl') {
        polygon([[o.x + 18, o.y + 12], [o.x + 2, o.y + flap], [o.x + 11, o.y + 22]], '#bae6fd');
        polygon([[o.x + 20, o.y + 12], [o.x + 36, o.y + flap], [o.x + 27, o.y + 22]], '#7dd3fc');
        X.fillStyle = '#f8fafc'; X.beginPath(); X.ellipse(o.x + 19, o.y + 15, 12, 13, 0, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#facc15'; X.beginPath(); X.arc(o.x + 15, o.y + 13, 4, 0, Math.PI * 2); X.arc(o.x + 23, o.y + 13, 4, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#0f172a'; X.fillRect(o.x + 14, o.y + 12, 2, 3); X.fillRect(o.x + 22, o.y + 12, 2, 3);
        polygon([[o.x + 17, o.y + 18], [o.x + 21, o.y + 18], [o.x + 19, o.y + 22]], '#f97316');
      } else if (o.k === 'scorpion') {
        X.strokeStyle = '#78350f'; X.lineWidth = 3;
        for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(o.x + 14 + i * 7, o.y + 16); X.lineTo(o.x + 8 + i * 12, o.y + 24); X.stroke(); }
        X.fillStyle = '#b45309'; X.beginPath(); X.ellipse(o.x + 22, o.y + 16, 13, 8, 0, 0, Math.PI * 2); X.fill();
        X.strokeStyle = '#f59e0b'; X.lineWidth = 4; X.beginPath(); X.moveTo(o.x + 30, o.y + 13); X.quadraticCurveTo(o.x + 43, o.y + 7, o.x + 38, o.y); X.stroke();
        polygon([[o.x + 34, o.y + 2], [o.x + 42, o.y], [o.x + 39, o.y + 7]], '#ef4444');
        X.strokeStyle = '#fbbf24'; X.lineWidth = 3; X.beginPath(); X.moveTo(o.x + 10, o.y + 14); X.lineTo(o.x + 3, o.y + 8); X.moveTo(o.x + 3, o.y + 8); X.lineTo(o.x, o.y + 12); X.stroke();
      } else if (o.k === 'sandSnake') {
        X.strokeStyle = '#d97706'; X.lineWidth = 9; X.beginPath(); X.moveTo(o.x, o.y + 20);
        X.quadraticCurveTo(o.x + 10, o.y, o.x + 20, o.y + 18); X.quadraticCurveTo(o.x + 32, o.y + 30, o.x + 43, o.y + 8); X.stroke();
        X.fillStyle = '#fbbf24'; X.beginPath(); X.arc(o.x + 43, o.y + 8, 6, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#111827'; X.fillRect(o.x + 45, o.y + 6, 2, 2);
      } else if (o.k === 'mossBeetle' || o.k === 'beetle' || o.k === 'caveBeetle') {
        X.strokeStyle = '#292524'; X.lineWidth = 2;
        for (let i = 0; i < 3; i++) { X.beginPath(); X.moveTo(o.x + 9 + i * 8, o.y + 18); X.lineTo(o.x + 5 + i * 10, o.y + 26); X.stroke(); }
        const shell = o.k === 'caveBeetle' ? '#7c3aed' : '#15803d';
        X.fillStyle = shell; X.beginPath(); X.ellipse(o.x + 18, o.y + 15, 15, 11, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = o.k === 'caveBeetle' ? '#c4b5fd' : '#22c55e'; X.beginPath(); X.ellipse(o.x + 18, o.y + 17, 15, 9, 0, 0, Math.PI); X.fill();
        X.strokeStyle = '#14532d'; X.beginPath(); X.moveTo(o.x + 18, o.y + 7); X.lineTo(o.x + 18, o.y + 24); X.stroke();
        X.fillStyle = '#292524'; X.beginPath(); X.arc(o.x + 33, o.y + 16, 6, 0, Math.PI * 2); X.fill();
      } else if (o.k === 'caveSlime') {
        X.fillStyle = 'rgba(167,139,250,.25)'; X.beginPath(); X.ellipse(o.x + 18, o.y + 17, 18, 12, 0, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#8b5cf6'; X.beginPath(); X.ellipse(o.x + 18, o.y + 18, 15, 9, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = '#ede9fe'; X.fillRect(o.x + 11, o.y + 15, 3, 4); X.fillRect(o.x + 22, o.y + 15, 3, 4);
      } else if (o.k === 'iceFox' || o.k === 'snowHare') {
        X.fillStyle = o.k === 'iceFox' ? '#e0f2fe' : '#f8fafc';
        X.beginPath(); X.ellipse(o.x + 20, o.y + 16, 14, 8, 0, 0, Math.PI * 2); X.fill();
        X.beginPath(); X.arc(o.x + 32, o.y + 12, 7, 0, Math.PI * 2); X.fill();
        if (o.k === 'snowHare') {
          polygon([[o.x + 29, o.y + 8], [o.x + 27, o.y - 5], [o.x + 33, o.y + 7]], '#f8fafc');
          polygon([[o.x + 34, o.y + 8], [o.x + 39, o.y - 3], [o.x + 37, o.y + 11]], '#f8fafc');
        } else polygon([[o.x + 28, o.y + 8], [o.x + 35, o.y + 1], [o.x + 36, o.y + 12]], '#bae6fd');
        X.fillStyle = '#0f172a'; X.fillRect(o.x + 34, o.y + 10, 2, 2);
      } else if (o.k === 'lavaSlug' || o.k === 'ashRunner') {
        X.fillStyle = o.k === 'lavaSlug' ? '#b91c1c' : '#57534e';
        X.beginPath(); X.ellipse(o.x + 21, o.y + 17, 19, 8, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = o.k === 'lavaSlug' ? '#fb923c' : '#a8a29e';
        X.beginPath(); X.ellipse(o.x + 21, o.y + 18, 19, 6, 0, 0, Math.PI); X.fill();
        if (o.k === 'lavaSlug') { X.fillStyle = '#fde047'; X.fillRect(o.x + 12, o.y + 13, 5, 3); X.fillRect(o.x + 25, o.y + 16, 6, 2); }
        else { X.fillStyle = '#fca5a5'; X.fillRect(o.x + 34, o.y + 11, 3, 3); }
        X.fillStyle = '#fef08a'; X.beginPath(); X.arc(o.x + 32, o.y + 9, 2, 0, Math.PI * 2); X.arc(o.x + 38, o.y + 9, 2, 0, Math.PI * 2); X.fill();
      } else if (o.k === 'lizard') {
        X.fillStyle = '#16a34a'; X.beginPath(); X.ellipse(o.x + 22, o.y + 13, 15, 8, 0, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 9, o.y + 13], [o.x - 2, o.y + 7], [o.x + 7, o.y + 17]], '#15803d');
        X.fillStyle = '#4ade80'; X.beginPath(); X.ellipse(o.x + 34, o.y + 10, 8, 6, 0, 0, Math.PI * 2); X.fill();
        X.fillStyle = '#fef08a'; X.fillRect(o.x + 36, o.y + 8, 3, 3);
        X.strokeStyle = '#166534'; X.lineWidth = 3;
        [[12, 17, 8, 23], [28, 17, 32, 23]].forEach(([x1, y1, x2, y2]) => { X.beginPath(); X.moveTo(o.x + x1, o.y + y1); X.lineTo(o.x + x2, o.y + y2); X.stroke(); });
      } else if (o.k === 'cactus') {
        X.fillStyle = '#15803d'; X.fillRect(o.x + 10, o.y + 7, 13, o.h - 7);
        X.fillRect(o.x + 2, o.y + 22, 9, 7); X.fillRect(o.x + 2, o.y + 14, 7, 15);
        X.fillRect(o.x + 22, o.y + 28, 9, 7); X.fillRect(o.x + 24, o.y + 20, 7, 15);
        X.fillStyle = '#bbf7d0';
        for (let i = 0; i < 4; i++) X.fillRect(o.x + 13, o.y + 12 + i * 9, 2, 3);
      } else if (o.k === 'rootArch') {
        X.strokeStyle = '#854d0e'; X.lineWidth = 10; X.beginPath(); X.moveTo(o.x + 2, GY); X.quadraticCurveTo(o.x + 18, o.y - 8, o.x + 26, o.y + 14); X.quadraticCurveTo(o.x + 34, o.y - 8, o.x + o.w - 2, GY); X.stroke();
        X.strokeStyle = '#a3e635'; X.lineWidth = 3; X.beginPath(); X.moveTo(o.x + 18, o.y + 10); X.lineTo(o.x + 11, o.y + 3); X.moveTo(o.x + 30, o.y + 9); X.lineTo(o.x + 37, o.y + 2); X.stroke();
      } else if (o.k === 'thornBush') {
        X.fillStyle = '#166534'; X.beginPath(); X.ellipse(o.x + 22, o.y + 23, 22, 12, 0, Math.PI, Math.PI * 2); X.fill();
        for (let i = 0; i < 5; i++) polygon([[o.x + i * 10, o.y + 22], [o.x + i * 10 + 5, o.y + 7 + (i % 2) * 5], [o.x + i * 10 + 10, o.y + 22]], '#bef264');
      } else if (o.k === 'mushroom') {
        X.fillStyle = '#fef3c7'; X.fillRect(o.x + 13, o.y + 16, 13, 22);
        X.fillStyle = '#dc2626'; X.beginPath(); X.ellipse(o.x + 19, o.y + 17, 19, 13, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = '#fff';
        [[11, 12], [22, 8], [28, 14]].forEach(([x, y]) => { X.beginPath(); X.arc(o.x + x, o.y + y, 2, 0, Math.PI * 2); X.fill(); });
      } else if (o.k === 'sandstone' || o.k === 'caveBoulder' || o.k === 'iceBoulder' || o.k === 'charRock') {
        const stone = o.k === 'sandstone' ? '#b45309' : o.k === 'caveBoulder' ? '#64748b' : o.k === 'iceBoulder' ? '#7dd3fc' : '#292524';
        polygon([[o.x + 2, GY], [o.x + 4, o.y + 14], [o.x + 14, o.y + 2], [o.x + o.w - 5, o.y + 9], [o.x + o.w, GY]], stone);
        polygon([[o.x + 8, o.y + 16], [o.x + 15, o.y + 5], [o.x + 20, o.y + 17]], o.k === 'sandstone' ? '#fcd34d' : '#e2e8f0');
        if (o.k === 'charRock') { X.strokeStyle = '#f97316'; X.lineWidth = 3; X.beginPath(); X.moveTo(o.x + 15, o.y + 12); X.lineTo(o.x + 19, o.y + 23); X.lineTo(o.x + 16, GY); X.stroke(); }
      } else if (o.k === 'bonePile') {
        X.strokeStyle = '#fef3c7'; X.lineWidth = 7; X.beginPath(); X.moveTo(o.x + 5, o.y + 20); X.lineTo(o.x + 39, o.y + 9); X.moveTo(o.x + 9, o.y + 7); X.lineTo(o.x + 36, o.y + 20); X.stroke();
        X.fillStyle = '#fffbeb'; [[5, 20], [39, 9], [9, 7], [36, 20]].forEach(([x, y]) => { X.beginPath(); X.arc(o.x + x, o.y + y, 4, 0, Math.PI * 2); X.fill(); });
      } else if (o.k === 'stalagmite' || o.k === 'icicle' || o.k === 'obsidianSpike') {
        const spike = o.k === 'stalagmite' ? '#8b5cf6' : o.k === 'icicle' ? '#e0f2fe' : '#7f1d1d';
        if (o.k === 'icicle') polygon([[o.x, o.y], [o.x + o.w / 2, o.y + o.h], [o.x + o.w, o.y]], spike);
        else polygon([[o.x, GY], [o.x + o.w * .2, o.y + o.h * .45], [o.x + o.w * .48, o.y], [o.x + o.w * .72, o.y + o.h * .4], [o.x + o.w, GY]], spike);
        if (o.k !== 'obsidianSpike') polygon([[o.x + o.w * .45, o.y + 8], [o.x + o.w * .55, o.y + 12], [o.x + o.w * .48, o.y + o.h * .65]], '#f8fafc');
      } else if (o.k === 'crystalCluster') {
        polygon([[o.x, GY], [o.x + 3, o.y + 24], [o.x + 13, o.y + 8], [o.x + 21, GY]], '#8b5cf6');
        polygon([[o.x + 10, GY], [o.x + 17, o.y + 12], [o.x + 25, o.y], [o.x + 32, o.y + 18], [o.x + 40, GY]], '#c4b5fd');
        X.strokeStyle = '#ede9fe'; X.lineWidth = 2; X.beginPath(); X.moveTo(o.x + 25, o.y + 5); X.lineTo(o.x + 27, o.y + 28); X.stroke();
      } else if (o.k === 'snowDrift') {
        X.fillStyle = '#e0f2fe'; X.beginPath(); X.ellipse(o.x + o.w / 2, GY - 5, o.w / 2, o.h / 2, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = '#fff'; X.beginPath(); X.ellipse(o.x + o.w * .35, GY - 8, o.w * .25, o.h * .35, 0, Math.PI, Math.PI * 2); X.fill();
      } else if (o.k === 'lavaVent') {
        X.fillStyle = '#292524'; X.beginPath(); X.ellipse(o.x + o.w / 2, GY - 5, o.w / 2, 9, 0, Math.PI, Math.PI * 2); X.fill();
        X.fillStyle = '#f97316'; X.beginPath(); X.ellipse(o.x + o.w / 2, GY - 7, o.w / 3, 5, 0, 0, Math.PI * 2); X.fill();
        polygon([[o.x + 13, o.y + 20], [o.x + 21, o.y], [o.x + 27, o.y + 20]], '#fb923c');
      } else if (o.k === 'stump') {
        X.fillStyle = '#78350f'; X.fillRect(o.x + 4, o.y + 10, o.w - 8, o.h - 10);
        X.fillStyle = '#b45309'; X.beginPath(); X.ellipse(o.x + o.w / 2, o.y + 11, o.w / 2 - 2, 9, 0, 0, Math.PI * 2); X.fill();
        X.strokeStyle = '#fcd34d'; X.lineWidth = 2; X.beginPath(); X.ellipse(o.x + o.w / 2, o.y + 11, 8, 4, 0, 0, Math.PI * 2); X.stroke();
        X.fillStyle = '#16a34a'; X.fillRect(o.x + 2, o.y + 5, 12, 5); X.fillRect(o.x + 26, o.y + 3, 12, 5);
      } else if (o.k === 'rock') {
        polygon([[o.x + 2, GY], [o.x + 4, o.y + 14], [o.x + 14, o.y + 2], [o.x + o.w - 5, o.y + 9], [o.x + o.w, GY]], '#64748b');
        polygon([[o.x + 8, o.y + 16], [o.x + 15, o.y + 5], [o.x + 20, o.y + 17]], '#cbd5e1');
      } else if (o.k === 'spikes') {
        X.fillStyle = '#475569';
        for (let i = 0; i < 4; i++) polygon([[o.x + i * 10, GY], [o.x + i * 10 + 5, o.y], [o.x + i * 10 + 10, GY]], '#94a3b8');
      } else {
        X.fillStyle = '#5d4037'; X.fillRect(o.x, o.y, o.w, o.h);
        X.fillStyle = '#8d6e63'; X.fillRect(o.x + 3, o.y + 3, o.w - 6, 5);
      }
    });
    items.forEach(i => {
      if (i.k === 'sword') {
        const sword = SWORDS[i.weapon];
        X.save(); X.translate(i.x, i.y + Math.sin(t * .08 + i.x * .02) * 3); X.rotate(-.65);
        X.shadowColor = sword.color; X.shadowBlur = 10;
        drawSwordSprite(sword);
        X.shadowBlur = 0;
        X.restore();
      } else if (i.k === 'resurrection') {
        X.save();
        X.globalAlpha = .35;
        X.fillStyle = '#c4b5fd'; X.beginPath(); X.arc(i.x, i.y, 19 + Math.sin(t * .12) * 3, 0, Math.PI * 2); X.fill();
        X.globalAlpha = 1;
        X.strokeStyle = '#ede9fe'; X.lineWidth = 2; X.beginPath(); X.arc(i.x, i.y, 12, 0, Math.PI * 2); X.stroke();
        X.fillStyle = '#fff'; X.fillRect(i.x - 2, i.y - 7, 4, 14); X.fillRect(i.x - 7, i.y - 2, 14, 4);
        X.restore();
      } else {
        X.save();
        X.shadowColor = i.k === 'heart' ? '#ff4081' : '#40c4ff'; X.shadowBlur = 10;
        X.fillStyle = i.k === 'heart' ? '#ff4081' : '#40c4ff'; X.beginPath(); X.arc(i.x, i.y, 11, 0, 7); X.fill();
        X.restore();
        X.fillStyle = '#fff'; X.font = '12px sans-serif'; X.textAlign = 'center'; X.fillText(i.k === 'heart' ? '♥' : '◆', i.x, i.y + 4);
      }
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
      for (let i = 0; i < 5; i++) { X.fillStyle = i < p.hp ? color : 'rgba(255,255,255,.25)'; otext('♥', x + i * 22, 28); }
      X.fillStyle = 'rgba(0,0,0,.4)'; X.fillRect(x, 38, 110, 9);
      X.fillStyle = '#40c4ff'; X.fillRect(x, 38, 110 * p.en / 100, 9);
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