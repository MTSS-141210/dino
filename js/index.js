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
    {
      n: 'Céu Celeste', sky: ['#29245f', '#b69be8'], gr: '#e8d9ba', bc: '#f5cb6b', attacks: ['skyLance', 'starRain', 'radiantFan', 'sunRay'],
      encounters: {
        creatures: [{ k: 'cloudManta', w: 46, h: 30, flight: 82 }, { k: 'sunWisp', w: 32, h: 32, flight: 108 }, { k: 'skySentinel', w: 40, h: 34, flight: 72 }],
        obstacles: [{ k: 'lightSpire', w: 34, h: 48 }, { k: 'stormCloud', w: 48, h: 32, flight: 34 }, { k: 'cloudMine', w: 30, h: 30, flight: 70 }],
      },
    },
  ];
  const BOSS_NAMES = ['Triceratops da Floresta', 'Espinossauro das Areias', 'Anquilossauro da Caverna', 'Estegossauro de Gelo', 'Rex de Magma', 'Braquiossauro do Pântano', 'Paquicefalossauro da Montanha', 'Pliossauro do Mar', 'Pterodáctilo Radiante'];
  const AIR_BIOME = 8;
  // Partículas ambientes por bioma (índice do bioma -> tipo)
  const AMB = {
    0: { c: '#d9f99d', kind: 'fly' }, 2: { c: '#c4b5fd', kind: 'fly' }, 3: { c: '#ffffff', kind: 'snow' },
    4: { c: '#fb923c', kind: 'ember' }, 5: { c: '#bef264', kind: 'fly' }, 6: { c: '#ffffff', kind: 'snow' },
    8: { c: '#fff1a8', kind: 'star' },
  };
  const SWORDS = [
    { id: 'flame', name: 'Fogo', color: '#fb5b36', ability: 'fere e incendeia o chefe' },
    { id: 'frost', name: 'Gelo', color: '#7dd3fc', ability: 'congela o chefe' },
    { id: 'thunder', name: 'Raio', color: '#facc15', ability: 'causa dano extra e dissipa projeteis' },
    { id: 'venom', name: 'Veneno', color: '#a3e635', ability: 'envenena o chefe' },
    { id: 'wind', name: 'Vento', color: '#5eead4', ability: 'acelera seus movimentos' },
    { id: 'blood', name: 'Sangue', color: '#dc2626', ability: 'rouba vida ao ferir o chefe' },
    { id: 'crystal', name: 'Cristal', color: '#c4b5fd', ability: 'cura e protege' },
  ];

  const K = {
    jump: ['KeyW'], crouch: ['KeyS'],
    left: ['KeyA'], right: ['KeyD'],
    sword: ['KeyK'], shield: ['KeyL'],
    dash: ['KeyJ'], power: ['KeyP'],
  };
  const K2 = {
    jump: ['ArrowUp'], crouch: ['ArrowDown'],
    left: ['ArrowLeft'], right: ['ArrowRight'],
    sword: ['Numpad5'], shield: ['Numpad6'],
    dash: ['Numpad4'], power: ['Numpad9'],
  };

  const down = new Set();
  const act = (n, keys = K) => keys[n].some(c => down.has(c));

  let S = {};
  try { S = JSON.parse(localStorage.getItem('dino-stats') || '{}'); } catch (e) {}
  S.games |= 0; S.best |= 0; S.bosses |= 0;
  const save = () => { try { localStorage.setItem('dino-stats', JSON.stringify(S)); } catch (e) {} };

  const DEV_PASSWORD = '141210';
  let st = 'ready', paused = false, twoPlayer = false, devMode = false, developerModalWasPaused = false;
  let P, P2, obs, items, proj, boss, dist, biome, bossAt, t, scr, kills, bk, bonus, habit, nextSp, hit, platforms = [], toast = 0, toastT = '';
  // Efeitos visuais
  let parts = [], amb = [], shake = 0, fade = 0, lastBi = -1, dirty = true, shownScore = -1;

  const puff = (x, y, n, c, o = {}) => {
    const s = o.s || 1;
    if (parts.length > 400) return;
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
      case 'blood': puff(q.x, q.y, n, '#ef4444', { s: .5, g: .08 }); break;
      default: puff(q.x, q.y, n, Math.random() < .5 ? '#c4b5fd' : '#ffffff', { s: .5, g: -.02 });
    }
  };

  const refreshStartHint = () => $('p2-hint-keys').classList.toggle('active', twoPlayer);
  const say = s => { toastT = s; toast = 150; };
  const swordOf = p => p.weapon === null ? null : SWORDS[p.weapon];
  const createPlayer = (x = 120) => ({ x, y: GY, vy: 0, grounded: true, face: 1, hp: 5, en: 100, sw: 0, swc: 0, dash: 0, dcd: 0, inv: 0, duck: false, sh: false, step: 0, weapon: null, weaponTimer: 0, powerCd: 0, powerFx: null, windBoost: 0 });
  const canDash = p => st === 'run' && !paused && p.hp > 0 && p.dcd <= 0 && p.en >= 20 && !p.dash;
  const playerList = () => (twoPlayer && P2) ? [P, P2] : [P];
  const onFloor = p => p.grounded;
  const resetAirPlatforms = () => {
    platforms = [
      { x: -24, w: 190, y: 278 }, { x: 202, w: 154, y: 230 },
      { x: 390, w: 176, y: 270 }, { x: 600, w: 184, y: 218 },
      { x: 818, w: 180, y: 262 },
    ];
  };
  const placeOnAirPlatform = (p, index = 0) => {
    const platform = platforms[0];
    p.x = Math.max(50, Math.min(420, platform.x + platform.w * (.55 + index * .18)));
    p.y = platform.y; p.vy = 0; p.grounded = true; p.duck = false;
  };
  const pb = (p = P) => ({ x: p.x - 14, y: p.y - (p.duck ? 26 : 44), w: 28, h: p.duck ? 26 : 44 });
  const sb = (p = P) => {
    if (p.sw <= 0) return null;
    const range = swordOf(p)?.id === 'wind' ? 110 : 60;
    return { x: p.face > 0 ? p.x + 10 : p.x - range - 10, y: p.y - 46, w: range, h: 46 };
  };
  const bb = () => ({ x: boss.x, y: boss.y ?? GY - boss.h, w: boss.w, h: boss.h });
  const score = () => Math.floor(dist / 10) + bonus;
  const recoverLife = (p, amount = 1) => {
    if (!p || p.hp <= 0) return 0;
    const previousHP = p.hp;
    p.hp = Math.min(5, p.hp + amount);
    return p.hp - previousHP;
  };

  function reset() {
    dirty = true; shownScore = -1;
    P = createPlayer(120);
    P2 = twoPlayer ? createPlayer(160) : null;
    refreshStartHint();
    obs = []; items = []; proj = []; boss = null; platforms = [];
    parts = []; amb = []; shake = 0; fade = 0;
    dist = 0; biome = 0; bossAt = 5000; t = 0; scr = 0; kills = 0; bk = 0; bonus = 0;
    habit = { j: 0, d: 0 }; nextSp = 60; hit = new Set();
    say(twoPlayer ? '2 Jogadores' : BIOMES[0].n);
  }

  const show = id => $(id).classList.add('active');
  const hide = id => $(id).classList.remove('active');
  const modalOpen = () => document.querySelector('#help-modal.active,#stats-modal.active,#developer-modal.active');
  function openDeveloperModal() {
    developerModalWasPaused = paused;
    if (st === 'run') paused = true;
    $('developer-password').value = '';
    $('developer-error').textContent = '';
    $('developer-modal').setAttribute('aria-hidden', 'false');
    show('developer-modal');
    $('developer-password').focus();
    dirty = true;
  }

  function closeDeveloperModal() {
    hide('developer-modal');
    $('developer-modal').setAttribute('aria-hidden', 'true');
    paused = developerModalWasPaused;
    dirty = true;
  }

  function start() {
    reset(); st = 'run'; paused = false;
    hide('game-modal'); $('dino-hint').classList.add('hide');
  }

  function over() {
    dirty = true; st = 'over'; S.games++;
    const s = score(); if (s > S.best) S.best = s;
    save();
    $('res-score').textContent = s; $('res-best').textContent = S.best;
    $('res-biome').textContent = BIOMES[biome % BIOMES.length].n; $('res-bosses').textContent = bk;
    show('game-modal');
  }

  function hurt(blockable, p = P, amount = 1) {
    if (devMode) return;
    if (p.hp <= 0 || p.inv > 0 || p.dash > 0) return;
    if (blockable && p.sh && p.face === 1) {
      p.en = Math.max(0, p.en - 10); p.inv = 10;
      puff(p.x + 22, p.y - 26, 6, '#93c5fd', { s: 1.5 });
      return;
    }
    p.hp = Math.max(0, p.hp - amount); p.inv = 70;
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
    p.duck = cr && p.grounded;
    const wasAir = !p.grounded;
    const previousY = p.y;
    p.grounded = false;
    p.vy += .7 + (cr && p.y < GY ? .9 : 0); p.y += p.vy;
    let landingY = biome % BIOMES.length !== AIR_BIOME && p.y >= GY ? GY : null;
    if (biome % BIOMES.length === AIR_BIOME && p.vy >= 0) {
      for (const platform of platforms) {
        const overlapsPlatform = p.x + 14 > platform.x && p.x - 14 < platform.x + platform.w;
        if (overlapsPlatform && previousY <= platform.y && p.y >= platform.y && (landingY === null || platform.y < landingY)) landingY = platform.y;
      }
    }
    if (landingY !== null) {
      p.y = landingY; p.vy = 0; p.grounded = true;
      if (wasAir) puff(p.x, GY, 8, 'rgba(255,255,255,.5)');
    }
    if (act('jump', keys) && p.grounded) { p.vy = -14; p.grounded = false; habit.j++; }
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
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'F3'].includes(e.code)) e.preventDefault();
    const rep = e.repeat; down.add(e.code);
    if (rep) return;
    if (e.code === 'F3') {
      if ($('developer-modal').classList.contains('active')) closeDeveloperModal();
      else openDeveloperModal();
      return;
    }
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
    if (K.jump.includes(e.code) && onFloor(P)) { P.vy = -14; P.grounded = false; habit.j++; }
    if (K.crouch.includes(e.code)) habit.d++;
    if (K.sword.includes(e.code) && P.swc <= 0) swingSword(P);
    if (K.dash.includes(e.code) && canDash(P)) { P.dash = 14; P.dcd = 70; P.en -= 20; }
    if (K.power.includes(e.code)) activatePower(P);
    if (twoPlayer) {
      if (K2.jump.includes(e.code) && onFloor(P2)) { P2.vy = -14; P2.grounded = false; habit.j++; }
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
      const surface = biome % BIOMES.length === AIR_BIOME && platforms.length
        ? platforms[Math.floor(Math.random() * platforms.length)].y : GY;
      const y = surface - encounter.h - (encounter.flight || 0);
      obs.push({ ...encounter, creature: isCreature, airborne: !!encounter.flight, x: W + 20, y, baseY: y, surfaceY: surface, phase: R(0, 7) });
    }
  }
  function spawnBoss() {
    const hp = 22 + biome * 18 + Math.max(0, biome - 1) * 12;
    const airborne = biome % BIOMES.length === AIR_BIOME;
    boss = { x: W - 170, y: airborne ? GY - 155 : undefined, airborne, w: 90, h: 100, vx: -1.8, moving: true, moveTimer: R(80, 130), pauseTimer: 0, hp, max: hp, s: 'idle', tm: 90, atk: null, n: 0, flash: 0, burn: 0, burnTick: 0, poison: 0, poisonTick: 0, freeze: 0, stunClock: 1200, stunTimer: 0 };
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
    if (biome % BIOMES.length === AIR_BIOME) {
      resetAirPlatforms();
      playerList().forEach((p, index) => placeOnAirPlatform(p, index));
    }
    else platforms = [];
  }

  function damageBoss(amount) {
    if (!boss) return 0;
    if (devMode) amount = boss.hp;
    const damage = Math.min(boss.hp, amount * (boss.stunTimer > 0 ? 1.5 : 1));
    boss.hp -= damage;
    return damage;
  }

  function applySwordHit(p) {
    const damage = damageBoss(p.weapon === null ? 1 : 1.6);
    if (swordOf(p)?.id === 'blood') recoverLife(p, damage);
  }

  function applyPowerHit(power) {
    if (!boss) return;
    damageBoss(power.damage);
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
    if (sword.id === 'blood' && boss) {
      recoverLife(p, damageBoss(4));
      boss.flash = 6;
      if (boss.hp <= 0) killBoss();
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
      case 'skyLance': launch(GY - 128, 58, 18, 'sun', '#fff1a8', -10); break;
      case 'starRain': rain('sunShard', '#fff1a8', 18, 26, 3); break;
      case 'radiantFan': spread('sunShard', '#facc15', GY - 30, 22, 22, 5); break;
      case 'sunRay':
        playerList().filter(p => p.hp > 0).forEach(p => proj.push({
          x: Math.max(28, Math.min(W - 48, p.x - 10)), y: 28, w: 20, h: GY - 28,
          kind: 'sunRay', c: '#fff7b2', vx: 0, vy: 0, life: 75, warmup: 34,
        }));
        break;
      default:
        launch(GY - 34, 52, 34, 'impact', BIOMES[biome % BIOMES.length].bc, vx);
        break;
    }
    boss.s = 'rec'; boss.tm = 48;
  }

  // ---------- Atualização ----------
  function step() {
    t++;
    const inAirBiome = biome % BIOMES.length === AIR_BIOME;
    const wsp = inAirBiome ? 2.8 + Math.min(dist / 60000, .7) : 4.5 + Math.min(biome, 8) * .5 + Math.min(dist / 30000, 1.5);
    scr += wsp;
    if (biome % BIOMES.length === AIR_BIOME) {
      if (!platforms.length) resetAirPlatforms();
      if (!boss) {
        platforms.forEach(platform => { platform.x -= wsp * .7; });
        while (platforms[platforms.length - 1].x < W) {
          const previous = platforms[platforms.length - 1];
          platforms.push({ x: previous.x + previous.w + R(36, 76), w: R(145, 190), y: R(214, 284) });
        }
        platforms = platforms.filter(platform => platform.x + platform.w > -30);
      }
    }

    // Efeitos visuais
    if (shake > 0) shake--;
    if (fade > 0) fade = Math.max(0, fade - .02);
    parts = parts.filter(p => { p.x += p.vx - wsp * .3; p.y += p.vy; p.vy += p.g; return --p.life > 0; });
    if (t % 6 === 0 && P.grounded && P.hp > 0 && P.dash <= 0) puff(P.x - 10, P.y, 1, 'rgba(255,255,255,.35)', { s: .5 });
    const am = AMB[biome % BIOMES.length];
    if (am && t % 6 === 0 && amb.length < 40) {
      if (am.kind === 'fly') amb.push({ x: W + 10, y: R(120, GY - 20), vx: R(-.6, -.1), vy: 0, ph: R(0, 7), life: 400, r: 2, c: am.c, kind: 'fly' });
      else if (am.kind === 'snow') amb.push({ x: R(0, W + 60), y: -6, vx: R(-1.4, -.4), vy: R(.6, 1.6), ph: 0, life: 300, r: R(1.2, 2.6), c: am.c, kind: 'snow' });
      else if (am.kind === 'star') amb.push({ x: R(0, W), y: R(30, GY - 20), vx: R(-.2, .2), vy: 0, ph: R(0, 7), life: 180, r: R(1.2, 2.4), c: am.c, kind: 'star' });
      else amb.push({ x: R(0, W), y: GY, vx: R(-1, 0), vy: R(-1.8, -.6), ph: 0, life: 120, r: R(1.5, 3), c: am.c, kind: 'ember' });
    }
    amb = amb.filter(a => {
      a.x += a.vx - wsp * .25; a.y += a.vy + (a.kind === 'fly' ? Math.sin(t * .05 + a.ph) * .4 : 0);
      return --a.life > 0 && a.x > -10 && a.y < GY && a.y > -12;
    });

    updatePlayer(P, K);
    if (twoPlayer && P2) updatePlayer(P2, K2);
    if (inAirBiome) {
      for (const [index, p] of playerList().entries()) {
        if (p.y > H && p.hp > 0) {
          if (devMode) placeOnAirPlatform(p, index);
          else {
            p.inv = 0; p.dash = 0;
            hurt(false, p, p.hp);
          }
        }
      }
    }
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
        const swb = o.creature ? sb(p) : null;
        if (swb && ov(swb, o)) {
          kills++; bonus += 10;
          if (recoverLife(p, .25) > 0) say('+1/4 coração');
          puff(o.x + o.w / 2, o.y + o.h / 2, 10, '#fde047');
          return false;
        }
        if (ov(box, o)) { hurt(true, p, o.creature ? (Math.random() < .5 ? 1 : 2) : 1); return false; }
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
      if (p.warmup > 0) { p.warmup--; return true; }
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
      if (boss.airborne) boss.y = GY - boss.h - 55 + Math.sin(t * .045) * 22;
      if (boss.stunTimer <= 0 && boss.freeze <= 0) {
        if (boss.s !== 'rec') {
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
        if (boss.s === 'idle') { boss.atk = pick(); fire(); }
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

    const sc = score(); if (sc !== shownScore) { shownScore = sc; $('game-score').textContent = sc; }
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
    if (p.grounded) {
      X.fillStyle = 'rgba(0,0,0,.25)'; X.beginPath(); X.ellipse(p.x, p.y + 3, 20 * k + 6, 4 * k + 1.5, 0, 0, 7); X.fill();
    }

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
    blood: [[-3, 8], [-5, 1], [-2, -5], [-5, -11], [0, -18], [5, -11], [2, -5], [5, 1], [3, 8]],
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
  const glowCache = new Map();
  const glow = (x, y, r, rgb, a = .5) => {
    if (!(r > .5) || !(a > 0)) return;
    const rq = Math.max(4, Math.round(r / 4) * 4), key = rgb + '|' + rq;
    let sp = glowCache.get(key);
    if (!sp) {
      if (glowCache.size > 150) glowCache.clear();
      sp = document.createElement('canvas'); sp.width = sp.height = Math.ceil(rq * 2 * RENDER_SCALE);
      const g = sp.getContext('2d'); g.scale(RENDER_SCALE, RENDER_SCALE);
      const gr = g.createRadialGradient(rq, rq, 0, rq, rq, rq);
      gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr; g.beginPath(); g.arc(rq, rq, rq, 0, 7); g.fill();
      glowCache.set(key, sp);
    }
    const ga = X.globalAlpha; X.globalAlpha = ga * Math.min(1, a);
    X.drawImage(sp, x - r, y - r, r * 2, r * 2);
    X.globalAlpha = ga;
  };
  // Ponto brilhante (partículas ambientes) pré-renderizado com o mesmo shadowBlur
  const dotCache = new Map();
  const glowDot = (x, y, r, c) => {
    const rq = Math.max(.5, Math.round(r * 2) / 2), key = c + '|' + rq, pad = 14;
    let sp = dotCache.get(key);
    if (!sp) {
      if (dotCache.size > 120) dotCache.clear();
      sp = document.createElement('canvas'); sp.width = sp.height = Math.ceil((rq + pad) * 2 * RENDER_SCALE);
      const g = sp.getContext('2d'); g.scale(RENDER_SCALE, RENDER_SCALE);
      g.shadowColor = c; g.shadowBlur = 8; g.fillStyle = c; g.beginPath(); g.arc(rq + pad, rq + pad, rq, 0, 7); g.fill();
      dotCache.set(key, sp);
    }
    const d = rq + pad; X.drawImage(sp, x - d, y - d, d * 2, d * 2);
  };
  const star = (x, y, r, c) => polygon([[x, y - r], [x + r * .3, y - r * .3], [x + r, y], [x + r * .3, y + r * .3], [x, y + r], [x - r * .3, y + r * .3], [x - r, y], [x - r * .3, y - r * .3]], c);
  const grayOf = c => {
    if (!/^#[0-9a-f]{6}$/i.test(c)) return c;
    const n = parseInt(c.slice(1), 16), l = Math.round(((n >> 16) & 255) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11 * 1) * .9 | 0;
    return `rgb(${l},${l},${l})`;
  };

  // ---------- Chefes: 8 dinossauros diferentes, todos virados para a esquerda (caixa 90x100) ----------
  const dtooth = (T, x, y, s = 1) => polygon([[x, y], [x + 3 * s, y], [x + 1.5 * s, y + 5 * s]], T('#f8fafc'));
  const dtoothUp = (T, x, y, s = 1) => polygon([[x, y], [x + 3 * s, y], [x + 1.5 * s, y - 5 * s]], T('#f8fafc'));
  const dclaw = (T, x, y) => polygon([[x, y], [x + 4, y], [x + 1, y + 5]], T('#f5efd9'));
  const wlk = () => (boss && boss.moving && boss.s !== 'stun' && boss.freeze <= 0) ? Math.sin(t * .28) * 4 : 0;

  const BOSS_ART = [
    // 0 — Triceratops da Floresta
    (P, E, eye, T) => {
      const k = wlk();
      P([[56 - k, 100], [58, 72], [72, 72], [76 - k, 100]], '#356a27');
      P([[74, 56], [100, 74], [96, 78], [72, 76]], '#4f8f3a');
      E(52, 66, 34, 24, '#58a041'); E(50, 78, 26, 11, '#b5dc8a');
      for (let i = 0; i < 4; i++) E(46 + i * 9, 44 + (i % 2) * 2, 3.2, 2.6, '#3f7a2e');
      P([[8 + k, 100], [12, 72], [28, 72], [30 + k, 100]], '#4f8f3a');
      dclaw(T, 8 + k, 96); dclaw(T, 14 + k, 96);
      // gola com espinhos
      E(30, 46, 22, 28, '#8a5a2b'); E(30, 46, 17, 23, '#d9a441');
      for (let i = 0; i < 9; i++) {
        const a = Math.PI + i * Math.PI / 8, bx = 30 + Math.cos(a) * 22, by = 46 + Math.sin(a) * 28, tx = 30 + Math.cos(a) * 30, ty = 46 + Math.sin(a) * 37;
        P([[bx - 3, by + 1], [tx, ty], [bx + 3, by + 1]], '#e8c36a');
      }
      P([[22, 24], [18, 14], [28, 20]], '#4ade80'); P([[34, 22], [38, 12], [40, 24]], '#22c55e');
      // cabeça
      P([[0, 72], [4, 56], [26, 50], [40, 62], [34, 82], [10, 82]], '#58a041');
      P([[2, 68], [-10, 66], [4, 76]], '#f5efd9');
      P([[14, 56], [-2, 34], [20, 50]], '#f5efd9'); P([[26, 52], [14, 28], [32, 48]], '#f5efd9');
      P([[0, 74], [-5, 80], [9, 82]], '#c9a227');
      X.strokeStyle = T('#1f2a10'); X.lineWidth = 2.5; X.lineCap = 'round'; X.beginPath(); X.moveTo(12, 59); X.lineTo(30, 56); X.stroke();
      eye(21, 63, '#fde68a', 4);
      X.strokeStyle = T('#1f2a10'); X.lineWidth = 1.5; X.beginPath(); X.moveTo(6, 80); X.quadraticCurveTo(18, 84, 32, 76); X.stroke();
    },
    // 1 — Espinossauro das Areias
    (P, E, eye, T) => {
      const k = wlk();
      P([[52 + k, 100], [50, 70], [66, 70], [70 + k, 100]], '#a8702d');
      P([[72, 56], [100, 62], [98, 68], [74, 72]], '#c9893f');
      E(54, 60, 28, 20, '#cf8f40'); E(50, 69, 22, 9, '#f0d49a');
      P([[28, 48], [32, 14], [40, 32], [48, 6], [56, 30], [66, 12], [72, 38], [76, 52], [32, 56]], '#d9572b');
      X.strokeStyle = T('#7f1d1d'); X.lineWidth = 1.4; X.beginPath();
      for (let i = 0; i < 6; i++) { X.moveTo(34 + i * 7, 52); X.lineTo(34 + i * 7 + (i - 2.5) * 1.5, 20 + Math.abs(i - 2.5) * 7); }
      X.stroke();
      P([[62 - k, 100], [60, 74], [76, 72], [80 - k, 100]], '#b97a35');
      dclaw(T, 62 - k, 96); dclaw(T, 68 - k, 96);
      P([[34, 62], [22, 70], [18, 66], [30, 56]], '#cf8f40'); dclaw(T, 16, 66);
      P([[38, 48], [28, 34], [8, 36], [-6, 44], [-4, 52], [10, 54], [30, 62]], '#cf8f40');
      P([[-4, 52], [10, 54], [26, 58], [20, 64], [0, 58]], '#e3b564');
      for (let i = 0; i < 4; i++) dtooth(T, -2 + i * 6, 52, .9);
      P([[8, 36], [12, 30], [18, 36]], '#d9572b');
      X.strokeStyle = T('#5b3510'); X.lineWidth = 2.2; X.beginPath(); X.moveTo(10, 38); X.lineTo(26, 36); X.stroke();
      eye(18, 43, '#fde047', 3.5);
    },
    // 2 — Anquilossauro da Caverna
    (P, E, eye, T) => {
      const k = wlk();
      P([[12 + k, 100], [14, 80], [26, 80], [28 + k, 100]], '#4a3580'); P([[58 - k, 100], [60, 80], [74, 80], [76 - k, 100]], '#4a3580');
      P([[80, 66], [94, 70], [94, 82], [80, 84]], '#6d4fa8');
      E(46, 72, 38, 22, '#6d4fa8'); E(46, 85, 28, 8, '#a995d8');
      X.strokeStyle = T('#4a3580'); X.lineWidth = 1.6; X.beginPath(); for (let i = 0; i < 6; i++) { X.moveTo(22 + i * 10, 52); X.lineTo(22 + i * 10, 74); } X.stroke();
      for (let i = 0; i < 5; i++) { const x = 22 + i * 12; P([[x - 5, 56], [x + 1, 26 - (i % 2) * 8 + (i === 2 ? -4 : 0)], [x + 7, 56]], i % 2 ? '#ddd6fe' : '#c4b5fd'); }
      E(96, 76, 11, 11, '#8b73c9'); P([[96, 62], [101, 54], [102, 66]], '#ddd6fe'); P([[96, 90], [101, 98], [102, 86]], '#ddd6fe');
      P([[-2, 86], [4, 70], [24, 66], [30, 84], [12, 94]], '#7b5fc0');
      P([[22, 68], [16, 54], [28, 66]], '#ddd6fe'); P([[4, 78], [-6, 72], [6, 84]], '#ddd6fe');
      X.strokeStyle = T('#2e1065'); X.lineWidth = 2.2; X.lineCap = 'round'; X.beginPath(); X.moveTo(8, 74); X.lineTo(22, 78); X.stroke();
      eye(14, 80, '#f0abfc', 3.4);
    },
    // 3 — Estegossauro de Gelo
    (P, E, eye, T) => {
      const k = wlk();
      P([[16 + k, 100], [18, 80], [32, 80], [34 + k, 100]], '#5fa8cc'); P([[62 - k, 100], [64, 78], [80, 78], [82 - k, 100]], '#5fa8cc');
      P([[82, 68], [102, 64], [98, 76], [82, 80]], '#8fd0ee');
      P([[90, 66], [100, 46], [97, 68]], '#e0f7ff'); P([[94, 72], [110, 64], [98, 78]], '#e0f7ff');
      E(52, 70, 34, 22, '#8fd0ee'); E(50, 82, 24, 9, '#d6f0fb');
      for (let i = 0; i < 6; i++) {
        const x = 26 + i * 10, by = 70 - 22 * Math.sqrt(Math.max(0, 1 - ((x - 52) / 34) ** 2)), h = 14 + Math.sin(i / 5 * Math.PI) * 16;
        P([[x - 7, by + 2], [x, by - h], [x + 7, by + 2]], '#e0f7ff');
        polygon([[x - 2, by], [x, by - h * .7], [x + 1, by]], T('#9ad8f5'));
      }
      P([[-2, 80], [8, 66], [24, 64], [30, 80], [10, 88]], '#8fd0ee');
      X.strokeStyle = T('#0c4a6e'); X.lineWidth = 2.2; X.lineCap = 'round'; X.beginPath(); X.moveTo(8, 69); X.lineTo(22, 72); X.moveTo(2, 82); X.quadraticCurveTo(12, 86, 24, 80); X.stroke();
      eye(15, 74, '#38bdf8', 3.4);
      if (!boss.flash && boss.s !== 'stun') { star(80, 40 + Math.sin(t * .1) * 3, 4, '#fff'); star(8, 56 + Math.cos(t * .09) * 3, 3, '#e0f7ff'); }
    },
    // 4 — Rex de Magma
    (P, E, eye, T) => {
      const k = wlk(), live = !boss.flash && boss.s !== 'stun', pl = .6 + .4 * Math.sin(t * .12);
      P([[50 - k, 100], [46, 70], [66, 68], [70 - k, 100]], '#2d1712');
      P([[72, 52], [100, 72], [96, 76], [70, 72]], '#4b2820');
      E(58, 58, 26, 24, '#4b2820'); E(52, 70, 18, 10, '#7a3b2a');
      for (let i = 0; i < 4; i++) { const x = 52 + i * 9, fl = Math.sin(t * .3 + i) * 3; P([[x - 4, 38 + i * 1.5], [x, 24 - fl], [x + 4, 38 + i * 1.5]], '#f97316'); }
      P([[36 + k, 100], [38, 70], [58, 68], [60 + k, 100]], '#5c2f24');
      dclaw(T, 36 + k, 96); dclaw(T, 43 + k, 96); dclaw(T, 50 + k, 96);
      P([[38, 62], [26, 68], [24, 64], [34, 56]], '#4b2820'); dclaw(T, 21, 64);
      X.save(); X.strokeStyle = T('#fb923c'); X.lineWidth = 2.2; if (live) { X.shadowColor = '#f97316'; X.shadowBlur = 8 * pl; }
      X.beginPath(); X.moveTo(62, 46); X.lineTo(58, 58); X.lineTo(66, 66); X.moveTo(76, 56); X.lineTo(70, 66); X.stroke(); X.restore();
      P([[44, 44], [38, 22], [10, 14], [-2, 24], [0, 38], [30, 46]], '#5c2f24');
      P([[0, 38], [30, 46], [34, 52], [10, 56], [-2, 46]], '#3b1d17');
      for (let i = 0; i < 5; i++) dtooth(T, 2 + i * 6, 38 + i * 1.5, 1);
      for (let i = 0; i < 4; i++) dtoothUp(T, 6 + i * 6, 51 - i * .5, .9);
      if (live) glow(22, 30, 14, '253,224,71', .35 * pl);
      X.strokeStyle = T('#1c0f0c'); X.lineWidth = 2.6; X.lineCap = 'round'; X.beginPath(); X.moveTo(14, 24); X.lineTo(30, 30); X.stroke();
      eye(22, 31, '#fef08a', 4);
    },
    // 5 — Braquiossauro do Pântano
    (P, E, eye, T) => {
      const k = wlk();
      P([[34 + k, 100], [36, 74], [50, 74], [52 + k, 100]], '#2a6b49'); P([[68 - k, 100], [70, 74], [84, 74], [86 - k, 100]], '#2a6b49');
      P([[84, 70], [102, 82], [92, 86], [80, 78]], '#3d8a5f');
      E(60, 72, 30, 18, '#3d8a5f'); E(58, 82, 22, 7, '#a3d977');
      P([[26 - k, 100], [28, 76], [44, 76], [46 - k, 100]], '#348055'); P([[60 + k, 100], [62, 76], [76, 76], [78 + k, 100]], '#348055');
      X.lineCap = 'round'; X.lineJoin = 'round';
      const neck = () => { X.beginPath(); X.moveTo(44, 70); X.bezierCurveTo(26, 64, 34, 40, 16, 26); };
      X.strokeStyle = T('#1e4d35'); X.lineWidth = 16; neck(); X.stroke();
      X.strokeStyle = T('#3d8a5f'); X.lineWidth = 12.5; neck(); X.stroke();
      X.strokeStyle = T('#8fcf7a'); X.lineWidth = 3; X.beginPath(); X.moveTo(40, 72); X.bezierCurveTo(26, 68, 36, 44, 20, 32); X.stroke();
      E(50, 56, 5, 3, '#4d7c0f'); E(70, 60, 4, 2.5, '#65a30d'); E(62, 54, 3, 3, '#f9a8d4'); E(62, 54, 1.2, 1.2, '#fde047');
      P([[4, 14], [18, 8], [26, 16], [22, 28], [6, 26]], '#3d8a5f');
      E(7, 21, 1.4, 1.4, '#14532d');
      X.strokeStyle = T('#14301f'); X.lineWidth = 2.2; X.beginPath(); X.moveTo(8, 24); X.quadraticCurveTo(15, 28, 22, 24); X.moveTo(10, 14); X.lineTo(21, 17); X.stroke();
      eye(15, 19, '#fde047', 3.4);
      const d = (t * .5) % 14; E(30, 90 + d * .3, 2, 3, '#4d7c0f');
    },
    // 6 — Paquicefalossauro da Montanha
    (P, E, eye, T) => {
      const k = wlk();
      P([[50 - k, 100], [48, 70], [64, 68], [68 - k, 100]], '#5b6b7e');
      P([[70, 56], [100, 64], [98, 70], [72, 72]], '#7c8ea2');
      E(56, 62, 24, 22, '#8a9bb0'); E(52, 72, 16, 9, '#cbd5e1');
      P([[38 + k, 100], [40, 70], [58, 68], [60 + k, 100]], '#7c8ea2');
      dclaw(T, 38 + k, 96); dclaw(T, 45 + k, 96); dclaw(T, 52 + k, 96);
      P([[38, 62], [28, 68], [26, 64], [34, 56]], '#7c8ea2'); dclaw(T, 23, 64);
      X.strokeStyle = T('#3b4655'); X.lineWidth = 1.5; X.beginPath(); X.moveTo(60, 50); X.lineTo(54, 60); X.lineTo(62, 70); X.moveTo(70, 58); X.lineTo(66, 68); X.stroke();
      P([[36, 52], [26, 42], [34, 34], [50, 50]], '#7c8ea2');
      for (let i = 0; i < 4; i++) P([[30, 24 + i * 7], [40, 27 + i * 7], [30, 30 + i * 7]], '#cbd5e1');
      E(22, 34, 16, 14, '#8a9bb0');
      P([[8, 36], [-4, 42], [6, 50], [22, 48]], '#8a9bb0');
      dtooth(T, 0, 45, .7); dtooth(T, 6, 47, .7); dtooth(T, 12, 48, .7);
      E(20, 24, 14, 12, '#b6c3d1'); E(20, 19, 11, 5, '#f1f5f9');
      X.strokeStyle = T('#1f2833'); X.lineWidth = 2.6; X.lineCap = 'round'; X.beginPath(); X.moveTo(7, 33); X.lineTo(24, 28); X.stroke();
      eye(16, 35, '#fbbf24', 3.6);
    },
    // 7 — Pliossauro do Mar
    (P, E, eye, T) => {
      const sw = Math.sin(t * .12) * 4;
      P([[86, 72], [100, 60], [104, 58], [101, 78], [88, 84]], '#1c8aa8');
      P([[94, 66], [106, 48], [102, 70]], '#0ea5e9');
      E(60, 76, 32, 18, '#1c8aa8'); E(58, 85, 24, 7, '#7bd9ff');
      P([[54, 60], [60, 40], [70, 62]], '#0ea5e9');
      P([[44, 84], [28, 98 + sw], [52, 92]], '#0e7490'); P([[72, 86], [62, 100 - sw], [84, 92]], '#0e7490');
      X.lineCap = 'round'; X.lineJoin = 'round';
      const neck = () => { X.beginPath(); X.moveTo(42, 72); X.bezierCurveTo(30, 66, 36, 50, 24, 40); };
      X.strokeStyle = T('#0c5a73'); X.lineWidth = 18; neck(); X.stroke();
      X.strokeStyle = T('#1c8aa8'); X.lineWidth = 14.5; neck(); X.stroke();
      P([[-4, 30], [14, 22], [36, 26], [36, 40], [8, 40]], '#1c8aa8');
      P([[-2, 38], [36, 38], [34, 43], [14, 45], [-2, 42]], '#3b0a0a');
      P([[-2, 42], [14, 45], [34, 43], [28, 54], [6, 50]], '#0e7490');
      for (let i = 0; i < 5; i++) dtooth(T, 0 + i * 6.5, 39, .9);
      for (let i = 0; i < 4; i++) dtoothUp(T, 4 + i * 6.5, 46, .8);
      X.strokeStyle = T('#082f49'); X.lineWidth = 2.4; X.lineCap = 'round'; X.beginPath(); X.moveTo(14, 25); X.lineTo(30, 30); X.stroke();
      eye(23, 32, '#22d3ee', 3.6);
      ell(18, 99, 22, 5, 'rgba(186,230,253,.55)'); ell(78, 100, 24, 5, 'rgba(186,230,253,.5)');
      if (!boss.flash) for (let i = 0; i < 3; i++) {
        const bt = (t * .5 + i * 20) % 60;
        X.strokeStyle = 'rgba(255,255,255,.6)'; X.lineWidth = 1.2; X.beginPath(); X.arc(40 + i * 18 + Math.sin(bt * .2) * 3, 84 - bt * .5, 2.5 + i * .6, 0, 7); X.stroke();
      }
    },
    // 8 — Pterodáctilo Radiante
    (P, E, eye, T) => {
      const flap = Math.sin(t * .22) * 13, leg = Math.sin(t * .16) * 3;
      P([[56, 54], [88, 34 - flap], [78, 64 - flap], [61, 75]], '#a66bda');
      P([[52, 53], [22, 31 + flap], [34, 63 + flap], [60, 75]], '#7c4dcc');
      X.strokeStyle = T('#f4d8ff'); X.lineWidth = 2; X.beginPath();
      X.moveTo(55, 55); X.lineTo(79, 39 - flap); X.moveTo(52, 58); X.lineTo(31, 39 + flap); X.stroke();
      E(56, 67, 25, 16, '#8b5ac7'); E(47, 74, 15, 6, '#d8b4fe');
      P([[70, 68], [96, 78], [103, 74], [91, 83], [73, 78]], '#7240ad');
      P([[42, 75], [36, 98 + leg], [47, 98 + leg], [54, 77]], '#6d3ca8');
      P([[65, 75], [63, 98 - leg], [74, 98 - leg], [77, 73]], '#6d3ca8');
      P([[38, 48], [31, 36], [16, 29], [4, 33], [0, 40], [16, 46], [34, 57]], '#ad76dc');
      P([[2, 39], [-12, 42], [2, 46]], '#fff0b2');
      P([[21, 33], [16, 22], [28, 31]], '#f6d365');
      P([[30, 34], [34, 21], [38, 36]], '#f6d365');
      X.strokeStyle = T('#522c7e'); X.lineWidth = 2.4; X.lineCap = 'round'; X.beginPath(); X.moveTo(11, 34); X.lineTo(27, 35); X.stroke();
      eye(18, 38, '#fff3a6', 4);
      for (let i = 0; i < 3; i++) star(35 + i * 19, 53 + Math.sin(t * .12 + i) * 3, 2.5, '#fff0a8');
    },
  ];

  function drawBoss() {
    const biomeIndex = biome % BIOMES.length;
    const b = BIOMES[biomeIndex], r = bb(), x = r.x, y = r.y, w = r.w, h = r.h;
    const stun = boss.s === 'stun';
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
    if (!boss.airborne) {
      X.fillStyle = 'rgba(0,0,0,.3)'; X.beginPath(); X.ellipse(x + w / 2, GY + 3, w * .62, 6, 0, 0, 7); X.fill();
    }
    X.save(); X.translate(x, y + bob);
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
      case 'sunShard':
        glow(cx, cy, Math.max(w, h) * .8, '255,241,168', .55);
        star(cx, cy, Math.min(w, h) * (.55 + Math.sin(t * .2) * .04), '#fff4bd');
        ell(cx, cy, 3, 3, '#ffffff');
        break;
      case 'sunRay':
        if (p.warmup > 0) {
          X.fillStyle = `rgba(255,241,168,${.12 + Math.sin(t * .5) * .06})`; X.fillRect(x - 7, y, w + 14, h);
          X.setLineDash([6, 8]); X.strokeStyle = 'rgba(255,248,200,.8)'; X.lineWidth = 2;
          X.beginPath(); X.moveTo(cx, y); X.lineTo(cx, y + h); X.stroke(); X.setLineDash([]);
        } else {
          glow(cx, y + h / 2, 24, '255,240,168', .55);
          X.fillStyle = lg(0, y, 0, y + h, 'rgba(255,255,255,.9)', 'rgba(255,202,74,.72)');
          X.fillRect(x, y, w, h);
          X.fillStyle = 'rgba(255,255,255,.8)'; X.fillRect(x + w * .38, y, w * .24, h);
          X.fillStyle = 'rgba(255,248,200,.28)'; X.fillRect(x - 8, y, w + 16, h);
        }
        break;
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
  // Olho bravo (sobrancelha inclinada) e presa. dir=1: criatura de lado; dir=-1: olho direito de frente
  const eyeA = (cx, cy, r, iris = '#facc15', dir = 1) => {
    ell(cx, cy, r, r * 1.05, '#fff'); ell(cx - r * .25 * dir, cy + r * .1, r * .62, r * .78, iris); ell(cx - r * .32 * dir, cy + r * .1, r * .27, r * .5, '#111');
    X.strokeStyle = '#111'; X.lineWidth = 1.7; X.lineCap = 'round'; X.beginPath();
    X.moveTo(cx - dir * r * 1.3, cy - r * .5); X.lineTo(cx + dir * r * 1.2, cy - r * 1.5); X.stroke();
  };
  const fang = (x, y, s = 3) => polygon([[x, y], [x + s * .7, y], [x + s * .35, y + s]], '#fff');

  const beetle = (w, h, c1, c2, spot, crystal) => {
    const g = h - 9;
    X.strokeStyle = '#1c1917'; X.lineWidth = 2.2; X.lineCap = 'round'; X.lineJoin = 'round';
    for (let i = 0; i < 3; i++) { const lx = 12 + i * 8, sw = Math.sin(t * .45 + i * 2.1) * 3; X.beginPath(); X.moveTo(lx, g); X.lineTo(lx - 3 + sw, g + 4); X.lineTo(lx - 5 + sw, h); X.stroke(); }
    X.fillStyle = lg(0, g - 14, 0, g, c1, c2); X.beginPath(); X.ellipse(21, g, 14, 14, 0, Math.PI, Math.PI * 2); X.fill();
    X.strokeStyle = 'rgba(0,0,0,.45)'; X.lineWidth = 1.5; X.stroke();
    ell(21, g, 14, 3, 'rgba(0,0,0,.4)');
    X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1.2; X.beginPath(); X.moveTo(21, g - 14); X.lineTo(21, g); X.stroke();
    [[14, g - 6, 2.4], [28, g - 5, 2.8], [21, g - 11, 1.8], [30, g - 11, 1.6]].forEach(([cx, cy, r]) => ell(cx, cy, r, r, spot));
    ell(14, g - 10, 5, 2.2, 'rgba(255,255,255,.3)');
    if (crystal) { pgo([[12, g - 11], [14, g - 21], [18, g - 12]], '#c4b5fd'); pgo([[21, g - 13], [24, g - 24], [28, g - 12]], '#ddd6fe'); }
    ell(7, g, 7, 6, '#292524');
    pgo([[4, g - 4], [-5, g - 15], [9, g - 6]], '#57534e');
    pgo([[2, g + 2], [-6, g + 4], [-1, g + 8]], '#78716c'); pgo([[5, g + 4], [-2, g + 9], [1, g + 11]], '#78716c');
    X.save(); X.shadowColor = '#ef4444'; X.shadowBlur = 5; eyeA(8, g - 1, 2.2, '#ef4444'); X.restore();
  };

  const bat = (w, h, f, wing, edge, body, eye) => {
    const L = [[18, 12], [11, 3 + f], [3, 2 + f], [5, 8 + f * .7], [1, 13 + f * .5], [8, 14 + f * .3], [10, 19], [16, 17]];
    pgo(L, wing, edge); pgo(L.map(([x, y]) => [w - x, y]), wing, edge);
    X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1; X.beginPath();
    X.moveTo(18, 12); X.lineTo(3, 2 + f); X.moveTo(18, 12); X.lineTo(1, 13 + f * .5); X.moveTo(w - 18, 12); X.lineTo(w - 3, 2 + f); X.moveTo(w - 18, 12); X.lineTo(w - 1, 13 + f * .5); X.stroke();
    pgo([[w / 2 - 7, 8], [w / 2 - 10, -1], [w / 2 - 2, 6]], body); pgo([[w / 2 + 7, 8], [w / 2 + 10, -1], [w / 2 + 2, 6]], body);
    ell(w / 2, 13, 7.5, 10, body); ell(w / 2, 16, 4, 5, 'rgba(255,255,255,.14)');
    X.save(); X.shadowColor = eye; X.shadowBlur = 7; ell(w / 2 - 3.2, 11, 2, 2, eye); ell(w / 2 + 3.2, 11, 2, 2, eye); X.restore();
    X.strokeStyle = '#000'; X.lineWidth = 1.7; X.lineCap = 'round'; X.beginPath();
    X.moveTo(w / 2 - 6, 8); X.lineTo(w / 2 - 1.5, 11); X.moveTo(w / 2 + 6, 8); X.lineTo(w / 2 + 1.5, 11); X.stroke();
    X.fillStyle = '#1a0a1f'; X.beginPath(); X.ellipse(w / 2, 17.5, 3.4, 2, 0, 0, 7); X.fill();
    fang(w / 2 - 3, 16.5, 4.5); fang(w / 2 + 1.5, 16.5, 4.5);
  };

  const SPR = {
    // ===== Criaturas =====
    cloudManta(w, h, f) {
      const flap = Math.sin(t * .22) * 7;
      pgo([[22, 16], [1, 2 + flap], [8, 24], [18, 19]], '#b6a1e8', '#6b5ba3');
      pgo([[24, 16], [w - 1, 2 - flap], [w - 8, 24], [28, 19]], '#d8ccff', '#6b5ba3');
      X.fillStyle = lg(0, 7, 0, h, '#fff8dc', '#a88ed6'); X.beginPath(); X.ellipse(w / 2, 18, 13, 9, 0, 0, 7); X.fill();
      ell(w / 2, 18, 9, 3, 'rgba(255,255,255,.55)'); eyeA(w / 2 - 3, 17, 2.2, '#7c3aed');
      pgo([[w / 2 + 5, 18], [w / 2 + 11, 20], [w / 2 + 5, 21]], '#f5cb6b');
      for (let i = 0; i < 3; i++) star(8 + i * 15, 5 + Math.sin(t * .1 + i) * 2, 1.8, '#fff1a8');
    },
    sunWisp(w, h) {
      const pulse = 1 + Math.sin(t * .16) * .12;
      glow(w / 2, h / 2, 26 * pulse, '255,224,130', .55);
      for (let i = 0; i < 8; i++) {
        const a = i * Math.PI / 4 + t * .025, r = 11 * pulse;
        star(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 3.5, '#fff1a8');
      }
      ell(w / 2, h / 2, 9 * pulse, 11 * pulse, '#fff8dc');
      eyeA(w / 2 - 3, h / 2, 2, '#eab308'); eyeA(w / 2 + 4, h / 2, 2, '#eab308', -1);
    },
    skySentinel(w, h, f) {
      const hover = Math.sin(t * .16) * 2;
      X.save(); X.translate(0, hover);
      pgo([[20, 1], [29, 13], [22, 19], [11, 12]], '#f5cb6b', '#a16207');
      pgo([[20, 3], [24, 12], [20, 17], [16, 12]], '#fff7c2', '#d4a72c');
      pgo([[8, 12], [15, 15], [12, 31], [4, 25]], '#9b7acb', '#59418a');
      pgo([[28, 12], [21, 15], [25, 31], [33, 25]], '#b9a2e8', '#59418a');
      ell(19, 17, 6, 8, '#f4eaff'); eyeA(19, 16, 2.2, '#facc15');
      polygon([[14, 23], [20, 20 + f * .03], [26, 23], [20, 28]], '#f5cb6b');
      X.restore();
    },
    forestWisp(w, h, f) {
      glow(15, 13, 26, '134,239,172', .55 + Math.sin(t * .1) * .1);
      for (let i = 0; i < 4; i++) ell(24 + i * 3 + Math.sin(t * .2 + i) * 1.5, 17 + i * 2.2, 4 - i * .8, 3 - i * .5, `rgba(134,239,172,${.5 - i * .12})`);
      pgo([[10, 12], [0, 2 + f / 2], [3, 17], [12, 16]], 'rgba(187,247,208,.85)', 'rgba(21,128,61,.5)');
      pgo([[20, 12], [29, 2 - f / 2], [27, 17], [18, 16]], 'rgba(187,247,208,.85)', 'rgba(21,128,61,.5)');
      X.fillStyle = rg(14, 11, 1, 12, [[0, '#f0fff4'], [1, '#22c55e']]); X.beginPath(); X.ellipse(14, 13, 8, 10, 0, 0, 7); X.fill();
      X.strokeStyle = 'rgba(20,83,45,.6)'; X.lineWidth = 1.3; X.stroke();
      pgo([[8, 5], [7, -2], [12, 3]], '#4ade80'); pgo([[12, 3], [14, -4], [17, 3]], '#86efac'); pgo([[16, 4], [21, -1], [19, 7]], '#4ade80');
      eyeA(10.5, 11.5, 2.4, '#16a34a', 1); eyeA(18, 11.5, 2.4, '#16a34a', -1);
      X.fillStyle = '#14532d'; X.beginPath(); X.ellipse(14, 17.5, 3.2, 2, 0, 0, 7); X.fill();
      fang(11.5, 16.6, 3); fang(15.5, 16.6, 3);
    },
    forestMoth(w, h, f) {
      const wl = [[18, 13], [1, 1 + f], [-1, 13], [8, 22], [16, 19]];
      pgo(wl, '#f0abfc', 'rgba(88,28,135,.55)'); pgo(wl.map(([x, y]) => [w - x, y]), '#c084fc', 'rgba(88,28,135,.55)');
      X.strokeStyle = 'rgba(126,34,206,.35)'; X.lineWidth = 1; X.beginPath(); X.moveTo(18, 13); X.lineTo(3, 6 + f * .6); X.moveTo(18, 13); X.lineTo(6, 20); X.moveTo(w - 18, 13); X.lineTo(w - 3, 6 + f * .6); X.moveTo(w - 18, 13); X.lineTo(w - 6, 20); X.stroke();
      [8, w - 8].forEach(cx => { ell(cx, 11 + f / 3, 4.6, 4.6, '#fde047'); ell(cx, 11 + f / 3, 3, 3, '#7e22ce'); ell(cx, 11 + f / 3, 1, 2.2, '#111'); });
      ell(19, 14, 4, 10, '#4c1d95'); ell(19, 10, 5, 5, '#a78bfa'); ell(19, 17, 2.6, 5, '#7c3aed');
      X.strokeStyle = '#4c1d95'; X.lineWidth = 1.5; X.lineCap = 'round'; X.beginPath(); X.moveTo(17, 5); X.quadraticCurveTo(13, -1, 8, 0); X.moveTo(21, 5); X.quadraticCurveTo(25, -1, 30, 0); X.stroke();
      pgo([[8, 0], [5, -3], [11, -2]], '#e9d5ff', 'rgba(0,0,0,0)'); pgo([[30, 0], [33, -3], [27, -2]], '#e9d5ff', 'rgba(0,0,0,0)');
      ell(17.2, 8, 1.7, 1.7, '#ef4444'); ell(21, 8, 1.7, 1.7, '#ef4444');
      X.strokeStyle = '#111'; X.lineWidth = 1.4; X.beginPath(); X.moveTo(15, 5.6); X.lineTo(18.5, 7.6); X.moveTo(23, 5.6); X.lineTo(19.7, 7.6); X.stroke();
      fang(17.5, 11, 3); fang(19.5, 11, 3);
    },
    mossBeetle(w, h) { beetle(w, h, '#4ade80', '#14532d', '#65a30d', false); },
    caveBeetle(w, h) { beetle(w, h, '#a78bfa', '#4c1d95', '#ddd6fe', true); },
    caveBat(w, h, f) { bat(w, h, f, '#6d28d9', 'rgba(30,10,70,.6)', '#312e81', '#fda4af'); },
    emberBat(w, h, f) {
      glow(20, 13, 28, '249,115,22', .28 + Math.sin(t * .2) * .06);
      bat(w, h, f, '#ea580c', 'rgba(127,29,29,.7)', '#7f1d1d', '#fef08a');
      for (let i = 0; i < 3; i++) { const sy = (t * .8 + i * 9) % 18; X.fillStyle = `rgba(253,186,116,${1 - sy / 18})`; X.beginPath(); X.arc(8 + i * 12, 20 + sy * .5, 1.3, 0, 7); X.fill(); }
    },
    vulture(w, h, f) {
      pgo([[24, 15], [36, 4 + f], [42, 8 + f], [40, 13 + f * .6], [36, 15], [30, 18]], '#7c4a14');
      pgo([[34, 17], [44, 14], [42, 24], [34, 21]], '#3f2508');
      X.fillStyle = lg(0, 10, 0, 24, '#8a5516', '#5b3510'); X.beginPath(); X.ellipse(22, 17, 14, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[22, 14], [10, 2 + f], [3, 6 + f], [5, 11 + f * .6], [9, 14], [16, 18]], '#a16207');
      X.strokeStyle = 'rgba(0,0,0,.3)'; X.lineWidth = 1; X.beginPath(); X.moveTo(20, 14); X.lineTo(5, 7 + f); X.moveTo(20, 15); X.lineTo(7, 12 + f * .6); X.stroke();
      pgo([[18, 15], [20, 20], [16, 18], [14, 22], [11, 18], [8, 21], [6, 15]], '#f5f5f4');
      pgo([[15, 22], [14, 27], [19, 24]], '#facc15'); pgo([[22, 22], [21, 27], [26, 24]], '#facc15');
      ell(8, 12, 5.2, 5, '#fca5a5');
      pgo([[4, 10], [-3, 12], [-2, 17], [3, 14]], '#facc15'); fang(-1, 16, 2);
      eyeA(7, 10.5, 2, '#fde047');
    },
    snowOwl(w, h, f) {
      pgo([[11, 14], [0, 9 + f], [3, 22], [12, 22]], '#bfe6fa'); pgo([[27, 14], [38, 9 + f], [35, 22], [26, 22]], '#bfe6fa');
      X.fillStyle = rg(19, 12, 2, 15, [[0, '#ffffff'], [1, '#d5ecf8']]); X.beginPath(); X.ellipse(19, 15, 12, 13, 0, 0, 7); X.fill();
      X.strokeStyle = 'rgba(40,90,140,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[9, 7], [7, -2], [15, 4]], '#e0f2fe'); pgo([[29, 7], [31, -2], [23, 4]], '#e0f2fe');
      ell(14.5, 12, 5, 5, '#fde047'); ell(23.5, 12, 5, 5, '#fde047'); ell(14, 12, 2.2, 2.6, '#111'); ell(23, 12, 2.2, 2.6, '#111');
      ell(13, 10.5, .9, .9, '#fff'); ell(22, 10.5, .9, .9, '#fff');
      polygon([[8, 6.5], [19.5, 13], [19.5, 9.5], [10, 4]], '#1e3a5f'); polygon([[30, 6.5], [18.5, 13], [18.5, 9.5], [28, 4]], '#1e3a5f');
      pgo([[17, 16], [21, 16], [19, 22]], '#fb923c'); fang(17.5, 20, 3); fang(19.8, 20, 3);
      X.strokeStyle = 'rgba(100,150,190,.5)'; X.lineWidth = 1; X.beginPath(); X.arc(14, 23, 3, 0, Math.PI); X.arc(20, 24, 3, 0, Math.PI); X.arc(25, 23, 3, 0, Math.PI); X.stroke();
      pgo([[12, 25], [10, 28], [15, 27]], '#fbbf24'); pgo([[25, 25], [23, 28], [28, 27]], '#fbbf24');
    },
    scorpion(w, h) {
      X.strokeStyle = '#78350f'; X.lineWidth = 2.5; X.lineCap = 'round'; X.lineJoin = 'round';
      for (let i = 0; i < 4; i++) { const lx = 14 + i * 5, sw = Math.sin(t * .4 + i * 1.7) * 3; X.beginPath(); X.moveTo(lx, 17); X.lineTo(lx - 3 + sw, 22); X.lineTo(lx - 5 + sw, h); X.stroke(); }
      const tail = () => { X.beginPath(); X.moveTo(30, 16); X.bezierCurveTo(43, 17, 46, 5, 35, 4); };
      X.strokeStyle = '#78350f'; X.lineWidth = 7; tail(); X.stroke(); X.strokeStyle = '#d97706'; X.lineWidth = 4; tail(); X.stroke();
      for (const [sx, sy] of [[39, 14], [42, 9], [40, 5]]) ell(sx, sy, 1.4, 1.4, '#78350f');
      pgo([[37, -1], [29, 5], [37, 8]], '#ef4444'); ell(36, 5, 1.3, 1.3, '#fecaca');
      X.fillStyle = lg(0, 10, 0, 24, '#d97706', '#78350f'); X.beginPath(); X.ellipse(22, 17, 11, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.3; X.stroke();
      X.strokeStyle = 'rgba(69,26,3,.5)'; X.lineWidth = 1; X.beginPath(); X.moveTo(19, 11); X.lineTo(19, 23); X.moveTo(23, 10.5); X.lineTo(23, 23.5); X.moveTo(27, 11.5); X.lineTo(27, 22.5); X.stroke();
      X.strokeStyle = '#b45309'; X.lineWidth = 3.4; X.beginPath(); X.moveTo(13, 14); X.lineTo(7, 11); X.stroke();
      pgo([[9, 11], [-1, 6], [2, 12], [-1, 18], [8, 16]], '#d97706'); pgo([[1, 11], [-4, 12], [1, 14]], '#92400e');
      eyeA(14.5, 13, 1.8, '#facc15');
    },
    sandSnake(w, h) {
      const pts = []; for (let i = 0; i < 15; i++) pts.push([9 + i * 2.7, 14 + Math.sin(t * .2 - i * .5) * 5, 5 - i * .15]);
      for (let i = pts.length - 1; i >= 0; i--) { const [px, py, pr] = pts[i]; ell(px, py, pr, pr, i % 2 ? '#d97706' : '#fbbf24'); if (i % 3 === 0) ell(px, py - pr * .3, pr * .5, pr * .35, 'rgba(120,53,15,.55)'); }
      const hy = pts[0][1];
      pgo([[10, hy - 9], [18, hy - 3], [18, hy + 3], [10, hy + 9], [7, hy]], '#d97706');
      ell(13, hy, 2.4, 5, '#fde68a'); ell(13, hy, 1, 3, '#78350f');
      ell(7, hy, 6.5, 5, '#f59e0b'); ell(6, hy - 2.5, 3, 1.6, 'rgba(255,255,255,.3)');
      eyeA(5, hy - 1.5, 1.8, '#fde047');
      X.fillStyle = '#450a0a'; X.beginPath(); X.ellipse(4, hy + 3, 3.2, 1.6, 0, 0, 7); X.fill(); fang(2.3, hy + 2.5, 3.6); fang(5.5, hy + 2.5, 3.6);
      X.strokeStyle = '#ef4444'; X.lineWidth = 1.3; const tl = Math.sin(t * .5) * 2; X.beginPath(); X.moveTo(1, hy + 4); X.lineTo(-3, hy + 5 + tl); X.moveTo(-1, hy + 4.7 + tl * .5); X.lineTo(-3, hy + 3 + tl); X.stroke();
    },
    iceFox(w, h) {
      X.strokeStyle = '#bae6fd'; X.lineWidth = 3; X.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const lx = 12 + i * 6, sw = Math.sin(t * .4 + i * 1.6) * 3; X.beginPath(); X.moveTo(lx, 18); X.lineTo(lx - 2 + sw, h); X.stroke(); }
      const sway = Math.sin(t * .2) * 2;
      pgo([[32, 14], [40, 5 + sway], [45, 11 + sway], [42, 20], [33, 19]], '#f4fbff'); ell(42, 12 + sway, 3, 6, '#7dd3fc');
      X.fillStyle = lg(0, 8, 0, 22, '#f4fbff', '#cbe9f9'); X.beginPath(); X.ellipse(22, 15, 13, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(40,100,150,.35)'; X.lineWidth = 1.2; X.stroke();
      pgo([[26, 9], [28, 5], [30, 10]], '#e0f2fe'); pgo([[31, 10], [34, 7], [34, 12]], '#e0f2fe');
      pgo([[5, 8], [6, -1], [12, 6]], '#f4fbff'); pgo([[11, 7], [14, -1], [16, 8]], '#f4fbff'); pgo([[6.5, 7], [7, 2], [10, 6]], '#7dd3fc', 'rgba(0,0,0,0)');
      pgo([[9, 6], [11, -1], [13, 6]], '#bae6fd');
      ell(9, 12, 6.5, 5.5, '#f4fbff'); pgo([[4, 10], [-2, 14], [5, 15.5]], '#f4fbff'); ell(-1, 14, 1.4, 1.4, '#0f172a');
      fang(3.2, 14.6, 3.4); eyeA(8, 10.5, 1.9, '#38bdf8');
    },
    snowHare(w, h, f, wk, o) {
      const hop = -Math.abs(Math.sin(t * .22 + o.phase)) * 3; X.translate(0, hop);
      X.strokeStyle = '#dbeafe'; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); X.moveTo(14, 18); X.lineTo(11, h - hop); X.moveTo(26, 19); X.lineTo(29, h - hop); X.stroke();
      ell(20, 15, 12, 7, '#f8fafc'); ell(26, 19, 5.5, 4.5, '#e2e8f0'); ell(33, 14, 4, 4, '#fff');
      pgo([[21, 9], [23, 1], [26, 8]], '#bae6fd'); pgo([[26, 9], [30, 3], [30, 10]], '#bae6fd');
      pgo([[6, 9], [2, -2], [10, 8]], '#f8fafc'); pgo([[10, 9], [10, -3], [14, 9]], '#f8fafc'); pgo([[7, 7], [5, 0], [9, 7]], '#fbcfe8', 'rgba(0,0,0,0)');
      ell(8, 13, 6.5, 5.8, '#f8fafc'); ell(2, 14, 1.4, 1.1, '#f472b6');
      X.fillStyle = '#fff'; X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1; X.fillRect(3, 16, 2.4, 4); X.strokeRect(3, 16, 2.4, 4); X.fillRect(5.8, 16.4, 2.2, 3.6); X.strokeRect(5.8, 16.4, 2.2, 3.6);
      eyeA(7, 11.5, 1.9, '#ef4444');
    },
    caveSlime(w, h, f, wk) {
      const top = 6 - wk * 2;
      X.fillStyle = lg(0, top, 0, h, 'rgba(196,181,253,.95)', 'rgba(109,40,217,.92)');
      X.beginPath(); X.moveTo(1, h); X.bezierCurveTo(-1, top + 5, 10, top - 3, 18, top - 3); X.bezierCurveTo(28, top - 3, 37, top + 5, 35, h); X.closePath(); X.fill();
      X.strokeStyle = 'rgba(76,29,149,.6)'; X.lineWidth = 1.5; X.stroke();
      ell(11, top + 4, 4, 2, 'rgba(255,255,255,.45)'); ell(28, h - 8, 2.5, 2.5, 'rgba(255,255,255,.25)'); ell(6, h - 6, 1.8, 1.8, 'rgba(255,255,255,.25)'); ell(31, h - 14, 1.6, 1.6, 'rgba(255,255,255,.3)');
      eyeA(12, h - 13, 3.2, '#f0abfc', -1); eyeA(24, h - 13, 3.2, '#f0abfc', 1);
      X.fillStyle = '#2e1065'; X.beginPath(); X.moveTo(9, h - 8); X.quadraticCurveTo(18, h - 2, 27, h - 8); X.quadraticCurveTo(18, h - 6, 9, h - 8); X.fill();
      for (let i = 0; i < 4; i++) polygon([[11 + i * 4.2, h - 7.4], [13 + i * 4.2, h - 4.2], [15 + i * 4.2, h - 7.4]], '#fff');
      const dr = (t * .3) % 8; ell(33, h - 2 + dr * .3, 1.4, 2, 'rgba(196,181,253,.7)');
    },
    lavaSlug(w, h) {
      glow(21, 17, 28, '249,115,22', .22);
      ell(21, h - 3, 20, 4, '#f97316');
      X.fillStyle = lg(0, 6, 0, h, '#b91c1c', '#7f1d1d'); X.beginPath(); X.ellipse(21, h - 3, 19, 13, 0, Math.PI, Math.PI * 2); X.fill(); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.3; X.stroke();
      for (let i = 0; i < 4; i++) pgo([[14 + i * 6, h - 12 - Math.sin(i * 1.4) * 2], [17 + i * 6, h - 20 - Math.sin(i * 1.4) * 2 + Math.sin(t * .3 + i) * 1.5], [20 + i * 6, h - 12 - Math.sin(i * 1.4) * 2]], '#450a0a');
      X.strokeStyle = '#fb923c'; X.lineWidth = 2; X.beginPath(); X.moveTo(14, h - 9); X.lineTo(19, h - 14); X.lineTo(23, h - 8); X.lineTo(29, h - 13); X.stroke();
      ell(33, h - 9, 2.4, 2.4, '#fde047'); ell(16, h - 6, 2, 2, '#fde047');
      X.strokeStyle = '#7f1d1d'; X.lineWidth = 1.6; X.lineCap = 'round'; X.beginPath(); X.moveTo(6, h - 9); X.lineTo(3, h - 17); X.moveTo(10, h - 11); X.lineTo(10, h - 19); X.stroke();
      eyeA(3, h - 18, 2.3, '#fef08a'); eyeA(10, h - 20, 2.3, '#fef08a');
      X.fillStyle = '#450a0a'; X.beginPath(); X.ellipse(3, h - 5, 3.6, 2.4, 0, 0, 7); X.fill(); fang(1.2, h - 6.4, 3.4); fang(4, h - 6.4, 3.4);
      const dr = (t * .4) % 6; ell(38, h - 1 + dr * .2, 1.4, 1.8, 'rgba(249,115,22,.8)');
    },
    ashRunner(w, h) {
      X.strokeStyle = '#292524'; X.lineWidth = 3; X.lineCap = 'round';
      for (let i = 0; i < 4; i++) { const lx = 12 + i * 6, sw = Math.sin(t * .5 + i * 1.6) * 4; X.beginPath(); X.moveTo(lx, 16); X.lineTo(lx - 3 + sw, h); X.stroke(); }
      const fl = Math.sin(t * .4) * 2;
      pgo([[34, 13], [42, 6 + fl], [38, 13], [43, 16], [34, 18]], '#f97316'); polygon([[35, 14], [40, 10 + fl], [38, 15]], '#fde047');
      X.fillStyle = lg(0, 8, 0, 22, '#57534e', '#292524'); X.beginPath(); X.ellipse(22, 14, 14, 7, 0, 0, 7); X.fill(); X.strokeStyle = 'rgba(0,0,0,.45)'; X.lineWidth = 1.3; X.stroke();
      X.strokeStyle = '#fb923c'; X.lineWidth = 1.3; X.beginPath(); X.moveTo(16, 11); X.lineTo(20, 15); X.lineTo(25, 11); X.lineTo(29, 15); X.stroke();
      for (let i = 0; i < 4; i++) pgo([[13 + i * 4, 9], [15 + i * 4, 1 + Math.sin(t * .4 + i) * 2], [18 + i * 4, 9]], '#f97316', 'rgba(0,0,0,0)');
      ell(8, 12, 7, 6, '#44403c'); pgo([[3, 10], [-2, 14], [5, 15.5]], '#44403c'); pgo([[0, 14], [-1, 18], [8, 18], [7, 14]], '#292524');
      pgo([[8, 7], [10, -1], [13, 7]], '#292524');
      fang(0, 14.6, 3.8); fang(4, 15.4, 3.4);
      X.save(); X.shadowColor = '#fde047'; X.shadowBlur = 6; eyeA(7, 10, 2, '#fde047'); X.restore();
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
    lightSpire(w, h) {
      glow(w / 2, h / 3, 28, '255,229,153', .3 + Math.sin(t * .12) * .08);
      pgo([[2, h], [10, h * .38], [16, h * .32], [w / 2, 0], [w - 16, h * .32], [w - 10, h * .38], [w - 2, h]], lg(0, 0, w, h, '#fff7d1', '#b69be8'), '#8065ad');
      polygon([[w / 2, 5], [w / 2 - 4, h * .44], [w / 2 + 2, h * .7], [w / 2 + 1, h]], 'rgba(255,255,255,.55)');
    },
    stormCloud(w, h, f) {
      glow(w / 2, h / 2, w * .55, '180,191,255', .22);
      X.fillStyle = lg(0, 2, 0, h, '#e4e1fa', '#7776a8'); X.beginPath();
      X.ellipse(w * .3, h * .62, w * .24, h * .25, 0, 0, 7); X.ellipse(w * .53, h * .43, w * .27, h * .4, 0, 0, 7); X.ellipse(w * .76, h * .62, w * .22, h * .26, 0, 0, 7); X.fill();
      for (let i = 0; i < 2; i++) {
        const bx = w * (.35 + i * .32), by = h * .45 + Math.sin(t * .08 + i) * 3;
        pgo([[bx, by], [bx - 4, by + 10], [bx + 1, by + 10], [bx - 2, by + 19], [bx + 7, by + 7], [bx + 3, by + 7]], '#fff1a8', 'rgba(255,255,255,.2)');
      }
    },
    cloudMine(w, h) {
      const pulse = 1 + Math.sin(t * .16) * .12;
      glow(w / 2, h / 2, 25 * pulse, '255,239,177', .35);
      ell(w / 2, h / 2, 12 * pulse, 12 * pulse, '#f5d477');
      X.strokeStyle = '#fff8dc'; X.lineWidth = 2;
      X.beginPath(); X.arc(w / 2, h / 2, 18 * pulse, 0, 7); X.stroke();
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + t * .03, x = w / 2 + Math.cos(a) * 19, y = h / 2 + Math.sin(a) * 19;
        star(x, y, 3, '#fff4bd');
      }
      ell(w / 2 - 3, h / 2 - 2, 3, 2, '#fff');
    },
  };
  SPR.bat = SPR.caveBat;

  function drawObstacle(o) {
    const w = o.w, h = o.h, f = Math.sin(t * .4 + o.phase) * 8, wk = Math.sin(t * .3 + o.phase);
    const k = 1 - Math.min(1, Math.max(0, GY - o.y - h) / 160);
    X.fillStyle = `rgba(0,0,0,${.1 + .18 * k})`; X.beginPath(); X.ellipse(o.x + w / 2, (o.surfaceY ?? GY) + 3, w * (.28 + .26 * k), 2 + 2.5 * k, 0, 0, 7); X.fill();
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

  function drawAirPlatforms() {
    platforms.forEach(platform => {
      const { x, y, w } = platform;
      glow(x + w / 2, y + 10, w * .55, '255,239,177', .16);
      X.fillStyle = 'rgba(24,22,63,.18)'; X.beginPath(); X.ellipse(x + w / 2, y + 13, w * .48, 8, 0, 0, 7); X.fill();
      X.fillStyle = lg(0, y, 0, y + 28, '#fff0bd', '#8d79be');
      X.beginPath(); X.moveTo(x, y + 6); X.quadraticCurveTo(x + w * .15, y - 2, x + w * .3, y + 4);
      X.quadraticCurveTo(x + w * .55, y - 3, x + w * .72, y + 3); X.quadraticCurveTo(x + w * .9, y - 1, x + w, y + 5);
      X.lineTo(x + w - 12, y + 24); X.lineTo(x + w * .76, y + 30); X.lineTo(x + w * .3, y + 25); X.lineTo(x + 10, y + 21); X.closePath(); X.fill();
      X.strokeStyle = '#fff6d8'; X.lineWidth = 2; X.beginPath(); X.moveTo(x + 3, y + 5); X.quadraticCurveTo(x + w * .2, y - 1, x + w * .38, y + 4); X.quadraticCurveTo(x + w * .65, y - 2, x + w - 3, y + 4); X.stroke();
      for (let i = 0; i < Math.floor(w / 38); i++) {
        const px = x + 17 + i * 36;
        if (px < x + w - 10) rr(px, y + 13 + (i % 2) * 4, 12, 3, 2, 'rgba(92,71,134,.35)');
      }
    });
  }

  const bgCache = [], heartGrad = {};
  function draw() {
    const bi = biome % BIOMES.length, b = BIOMES[bi];
    const bg = bgCache[bi] || (bgCache[bi] = { sky: X.createLinearGradient(0, 0, 0, GY), gnd: X.createLinearGradient(0, GY, 0, H) });
    const g = bg.sky;
    if (bi !== lastBi) { lastBi = bi; document.documentElement.style.setProperty('--biome', b.bc); }

    X.save();
    if (shake > 0) X.translate(R(-1, 1) * shake * .5, R(-1, 1) * shake * .5);

    if (!bg.ok) { g.addColorStop(0, b.sky[0]); g.addColorStop(1, b.sky[1]); bg.gnd.addColorStop(0, 'rgba(255,255,255,.12)'); bg.gnd.addColorStop(1, 'rgba(0,0,0,.45)'); bg.ok = true; }
    X.fillStyle = g; X.fillRect(-12, -12, W + 24, H + 24);
    if (bi !== AIR_BIOME) {
      ridge(.08, 110, 34, 'rgba(0,0,0,.10)', 1);
      ridge(.2, 60, 22, 'rgba(0,0,0,.18)', 4);
      ridge(.4, 25, 12, 'rgba(0,0,0,.25)', 9);
    }

    if (bi === AIR_BIOME) drawAirPlatforms();
    else {
      X.fillStyle = b.gr; X.fillRect(-12, GY, W + 24, H - GY + 12);
      X.fillStyle = bg.gnd; X.fillRect(-12, GY, W + 24, H - GY + 12);
      X.fillStyle = 'rgba(255,255,255,.25)'; X.fillRect(-12, GY, W + 24, 2);
      X.fillStyle = 'rgba(0,0,0,.18)';
      for (let i = 0; i < 20; i++) X.fillRect(i * 60 - (scr % 60), GY + 12 + (i % 3) * 14, 20, 3);
    }

    // Partículas ambientes do bioma
    amb.forEach(a => {
      X.globalAlpha = Math.min(1, a.life / 40) * (a.kind === 'snow' ? .85 : .9);
      if (a.kind === 'snow') { X.fillStyle = a.c; X.beginPath(); X.arc(a.x, a.y, a.r, 0, 7); X.fill(); }
      else glowDot(a.x, a.y, a.r, a.c);
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
          let gradient = heartGrad[color];
          if (!gradient) { gradient = heartGrad[color] = X.createLinearGradient(0, hy - hs, 0, hy + hs); gradient.addColorStop(0, '#fff'); gradient.addColorStop(.22, color); gradient.addColorStop(1, color); }
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

    if (devMode) {
      X.textAlign = 'right'; X.font = 'bold 10px sans-serif'; X.fillStyle = '#fff1a8';
      otext('DEV: IMORTAL + DANO INFINITO', W - 12, H - 12);
    }

    if (toast > 0) { X.globalAlpha = Math.min(1, toast / 40); X.textAlign = 'center'; X.font = 'bold 28px sans-serif'; X.fillStyle = '#fff'; X.lineWidth = 5; otext(toastT, W / 2, 80); X.globalAlpha = 1; }
  }

  let last = 0, acc = 0;
  function loop(ts) {
    acc += Math.min(ts - last, 100); last = ts;
    while (acc >= 16.67) { acc -= 16.67; if (st === 'run' && !paused) { step(); dirty = true; } }
    if (dirty) { dirty = false; draw(); }
    requestAnimationFrame(loop);
  }

  // ---------- Modais ----------
  const openM = id => { if (st === 'run') paused = true; show(id); dirty = true; };
  const closeM = () => { ['help-modal', 'stats-modal'].forEach(hide); paused = false; dirty = true; };
  $('btn-help-trigger').onclick = () => openM('help-modal');
  $('btn-stats-trigger').onclick = () => {
    $('stat-played').textContent = S.games; $('stat-best').textContent = S.best; $('stat-bosses').textContent = S.bosses;
    openM('stats-modal');
  };
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = closeM);
  $('btn-new-game-modal').onclick = start;
  $('developer-form').addEventListener('submit', e => {
    e.preventDefault();
    if ($('developer-password').value !== DEV_PASSWORD) {
      $('developer-error').textContent = 'Senha incorreta. Tente novamente.';
      $('developer-password').select();
      return;
    }
    devMode = true;
    playerList().forEach(p => { p.hp = 5; p.inv = 0; });
    say('Modo desenvolvedor ativado!');
    closeDeveloperModal();
  });
  $('developer-cancel').onclick = closeDeveloperModal;

  reset(); requestAnimationFrame(loop);
})();