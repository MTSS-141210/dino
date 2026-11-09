(() => {
  const SCRIPT_SRC =
    Array.from(document.scripts).find((s) => /game\.js(?:[?#]|$)/.test(s.src))?.src ||
    new URL("js/game.js", location.href).href;
  const BASE = new URL("index.js", SCRIPT_SRC).href;

  const HTML_AFTER_RESULT =
    '\n      <div id="secret-msg" class="secret-box" hidden><\/div>';
  const HTML_BEFORE_MODAL =
    '<div id="select-modal" class="modal-overlay active">\n    <div class="modal select-box">\n      <h2 id="select-title">Escolha seu dino<\/h2>\n      <div id="select-grid" class="select-grid"><\/div>\n      <p id="select-info"><\/p>\n      <label class="developer-label" for="select-code">Código secreto<\/label>\n      <input id="select-code" type="text" inputmode="numeric" maxlength="6" autocomplete="off">\n      <p id="select-msg" class="developer-error" aria-live="polite"><\/p>\n      <button class="btn" id="select-ok" type="button">Próximo<\/button>\n      <p class="modal-hint">Habilidade: <kbd>O<\/kbd> (J1) · <kbd>8<\/kbd> (J2) · Teclas <kbd>1<\/kbd>/<kbd>2<\/kbd> reabrem esta tela<\/p>\n    <\/div>\n  <\/div>\n\n  ';
  const CSS =
    "\n/* ---- Seleção de dino (estilo tela de lutadores) ---- */\n.select-box{width:min(100%,760px);background:radial-gradient(ellipse at 50% 0,#4a3220,#140d08 80%);border:3px solid #6b4423;border-radius:6px}\n.select-box h2{color:#f59e0b;text-shadow:2px 2px 0 #7f1d1d}\n.select-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(104px,1fr));gap:8px;margin:12px 0}\n.select-card{padding:3px;border:3px solid #3b2a1a;border-radius:2px;background:#0d0906;color:#fde68a;cursor:pointer;font:400 .5rem var(--pixel);display:grid;gap:5px;text-align:center}\n.select-card svg,.sc-face{display:block;width:100%;height:84px;background:radial-gradient(circle at 50% 35%,color-mix(in srgb,currentColor 45%,#000),#050302)}\n.select-card:hover{border-color:#a16207}\n.select-card.sel{border-color:#f59e0b;box-shadow:0 0 14px #f59e0b}\n#select-info{min-height:2.6em;text-align:center;color:#fde68a}\n#select-code{width:100%;padding:10px 12px;border:1px solid rgba(177,205,184,.3);border-radius:10px;background:rgba(7,17,14,.8);color:var(--txt);font:700 1rem ui-monospace,monospace;letter-spacing:.2em}\n.secret-box{margin:10px 0}\n.secret-box .secret{padding:8px 12px;margin:6px 0;border:1px solid #f59e0b;border-radius:10px;background:rgba(245,158,11,.14);color:#fde68a;font-weight:800;text-align:center}\n\n.select-card canvas{display:block;width:100%;height:84px;object-fit:contain;background:radial-gradient(circle at 50% 35%,#5a3d22,#050302)}\n";
  const JS_PATCH = [
    [
      "{ k: 'forestWisp', w: 30, h: 26, flight: 78 }, { k: 'forestMoth', w: 38, h: 26, flight: 90 }, { k: 'mossBeetle', w: 36, h: 26 }",
      "{ k: 'frog', w: 36, h: 24 }, { k: 'dragonfly', w: 40, h: 24, flight: 88 }",
    ],
    [
      "{ k: 'mushroom', w: 38, h: 38 }, { k: 'stump', w: 42, h: 30 }, { k: 'thornBush', w: 44, h: 32 }",
      "{ k: 'lilyLog', w: 46, h: 24 }, { k: 'cattail', w: 30, h: 50 }",
    ],
    [
      "{ k: 'snowOwl', w: 38, h: 28, flight: 84 }, { k: 'vulture', w: 42, h: 28, flight: 82 }, { k: 'mossBeetle', w: 36, h: 26 }",
      "{ k: 'goat', w: 40, h: 30 }, { k: 'eagle', w: 46, h: 28, flight: 90 }",
    ],
    [
      "{ k: 'rock', w: 42, h: 28 }, { k: 'spikes', w: 40, h: 20 }, { k: 'iceBoulder', w: 46, h: 38 }",
      "{ k: 'pine', w: 34, h: 52 }, { k: 'boulderPile', w: 50, h: 34 }",
    ],
    [
      "{ k: 'caveBat', w: 38, h: 26, flight: 106 }, { k: 'snowOwl', w: 38, h: 28, flight: 84 }, { k: 'forestMoth', w: 38, h: 26, flight: 94 }",
      "{ k: 'crab', w: 40, h: 24 }, { k: 'jelly', w: 30, h: 32, flight: 90 }",
    ],
    [
      "{ k: 'spikes', w: 40, h: 20 }, { k: 'sandstone', w: 48, h: 38 }, { k: 'rock', w: 42, h: 28 }",
      "{ k: 'coral', w: 36, h: 46 }, { k: 'anchor', w: 34, h: 44 }",
    ],
    [
      "S.games |= 0; S.best |= 0; S.bosses |= 0;",
      "S.games |= 0; S.best |= 0; S.bosses |= 0; S.won |= 0; S.spino |= 0;",
    ],
    [
      "const DEV_PASSWORD = '141210';",
      "const DEV_PASSWORD = '101214', UNLOCK_CODE = '141210';\n  let choice = ['rex', 'rex'], startBiome = 0, tookDmg = false, spawnedCr = 0, lastHit = null;",
    ],
    [
      "dash: ['KeyJ'], power: ['KeyP'],",
      "dash: ['KeyJ'], power: ['KeyP'], ab: ['KeyO'],",
    ],
    [
      "dash: ['Numpad4'], power: ['Numpad9'],",
      "dash: ['Numpad4'], power: ['Numpad9'], ab: ['Numpad8', 'Digit8'],",
    ],
    [
      "const createPlayer = (x = 120) => ({ ",
      "const createPlayer = (x = 120, type = 'rex') => ({ type, jumps: 0, abCd: 0, pts: 0, ",
    ],
    ["P = createPlayer(120);", "P = createPlayer(120, choice[0]);"],
    [
      "P2 = twoPlayer ? createPlayer(160) : null;",
      "P2 = twoPlayer ? createPlayer(160, choice[1]) : null;",
    ],
    [
      "dist = 0; biome = 0; bossAt = 5000;",
      "dist = 0; biome = startBiome; bossAt = 5000;",
    ],
    [
      "habit = { j: 0, d: 0 }; nextSp = 60; hit = new Set();",
      "habit = { j: 0, d: 0 }; nextSp = 60; hit = new Set(); tookDmg = false; spawnedCr = 0; lastHit = null;\n    if (biome % BIOMES.length === AIR_BIOME) { resetAirPlatforms(); playerList().forEach((p, i) => placeOnAirPlatform(p, i)); }",
    ],
    [
      "'#help-modal.active,#stats-modal.active,#developer-modal.active'",
      "'#help-modal.active,#stats-modal.active,#developer-modal.active,#select-modal.active'",
    ],
    [
      "p.hp = Math.max(0, p.hp - amount); p.inv = 70;",
      "tookDmg = true; p.hp = Math.max(0, p.hp - amount * (blockable && has(p, 'anky') ? .75 : 1)); p.inv = 70;",
    ],
    [
      "const speed = p.windBoost > 0 ? 6 : 3;",
      "const speed = (p.windBoost > 0 ? 6 : 3) + (has(p, 'raptor') ? 1.5 : 0);",
    ],
    [
      "p.y = landingY; p.vy = 0; p.grounded = true;",
      "p.y = landingY; p.vy = 0; p.grounded = true; p.jumps = 0;",
    ],
    [
      "if (act('jump', keys) && p.grounded) { p.vy = -14; p.grounded = false; habit.j++; }",
      "if (act('jump', keys) && p.grounded) tryJump(p);",
    ],
    [
      "['sw', 'swc', 'dcd', 'inv', 'powerCd', 'windBoost'].forEach",
      "['sw', 'swc', 'dcd', 'inv', 'powerCd', 'windBoost', 'abCd'].forEach",
    ],
    [
      "addEventListener('keydown', e => {",
      "addEventListener('keydown', e => {\n    if (e.target && e.target.tagName === 'INPUT' && e.code !== 'F3') return;",
    ],
    [
      "if (e.code === 'Digit2') {",
      "if (e.code === 'Digit2' || e.code === 'Digit1') {",
    ],
    [
      "twoPlayer = !twoPlayer;",
      "twoPlayer = e.code === 'Digit1' ? false : !twoPlayer;",
    ],
    [
      "$('dino-hint').classList.remove('hide');",
      "$('dino-hint').classList.remove('hide'); openSelect();",
    ],
    [
      "if (K.jump.includes(e.code) && onFloor(P)) { P.vy = -14; P.grounded = false; habit.j++; }",
      "if (K.jump.includes(e.code)) tryJump(P);",
    ],
    [
      "if (K2.jump.includes(e.code) && onFloor(P2)) { P2.vy = -14; P2.grounded = false; habit.j++; }",
      "if (K2.jump.includes(e.code)) tryJump(P2);",
    ],
    [
      "if (K.power.includes(e.code)) activatePower(P);",
      "if (K.power.includes(e.code)) activatePower(P);\n    if (K.ab.includes(e.code)) dinoAbility(P);",
    ],
    [
      "if (K2.power.includes(e.code)) activatePower(P2);",
      "if (K2.power.includes(e.code)) activatePower(P2);\n      if (K2.ab.includes(e.code)) dinoAbility(P2);",
    ],
    [
      "const isCreature = Math.random() > obstacleBias;",
      "const isCreature = Math.random() > obstacleBias; if (isCreature) spawnedCr++;",
    ],
    [
      "o.x -= wsp + (o.creature ? 1.5 : 0);",
      "if (o.para > 0) o.para--; else o.x -= wsp + (o.creature ? 1.5 : 0);",
    ],
    ["kills++; bonus += 10;", "kills++; bonus += 10; p.pts += 10;"],
    [
      "bk++; S.bosses++; bonus += 100; boss = null; proj = [];",
      "bk++; S.bosses++; bonus += 100; if (lastHit) lastHit.pts += 100; boss = null; proj = [];",
    ],
    [
      "const damage = damageBoss(p.weapon === null ? 1 : 1.6);",
      "lastHit = p; const damage = damageBoss(p.weapon === null ? 1 : 1.6); p.pts += Math.ceil(damage * 2);",
    ],
    [
      "if (!sword || p.powerCd > 0) return;",
      "if (!sword || p.powerCd > 0) return; lastHit = p;",
    ],
    [
      "if (boss && ov(p, bb())) { applyPowerHit(p.power); return false; }",
      "if (p.shock) obs = obs.filter(o => { if (o.creature && ov(p, o)) { kills++; bonus += 10; if (p.owner) p.owner.pts += 10; puff(o.x + o.w / 2, o.y + o.h / 2, 10, '#fde047'); return false; } return true; });\n        if (boss && ov(p, bb())) { applyPowerHit(p.power); return false; }",
    ],
    [
      "const sc = score(); if (sc !== shownScore) { shownScore = sc; $('game-score').textContent = sc; }",
      "const sc = twoPlayer && P2 ? `J1 ${pScore(P)} · J2 ${pScore(P2)}` : score(); if (sc !== shownScore) { shownScore = sc; $('game-score').textContent = sc; }",
    ],
    [
      "$('res-score').textContent = s;",
      "$('res-score').textContent = twoPlayer && P2 ? `J1 ${pScore(P)} · J2 ${pScore(P2)}` : s; secretMissions(victory);",
    ],
    [
      "const c2 = green ? '#43a047' : '#60a5fa', belly = green ? '#c8e6c9' : '#dbeafe';",
      "const c2 = mixc(color, '#ffffff', .22), belly = mixc(color, '#ffffff', .72);",
    ],
    ["drawDino(P, '#2e7d32');", "drawDino(P, colorOf(P));"],
    [
      "if (twoPlayer && P2) drawDino(P2, '#2563eb');",
      "if (twoPlayer && P2) drawDino(P2, colorOf(P2));",
    ],
    [
      "if (twoPlayer && P2) drawPowerEffect(P2);",
      "if (twoPlayer && P2) { drawPowerEffect(P2); X.font = 'bold 10px sans-serif'; X.textAlign = 'center'; X.fillStyle = '#fff'; otext('J1', P.x, P.y - 62); otext('J2', P2.x, P2.y - 62); }",
    ],
    [
      "if (canDash(p)) {",
      "if (has(p, 'rex') || has(p, 'para')) { X.fillStyle = p.abCd <= 0 ? '#fde047' : '#9ca3af'; X.font = 'bold 9px sans-serif'; otext(p.abCd <= 0 ? `HABILIDADE PRONTA (${p === P ? 'O' : '8'})` : `HABILIDADE ${Math.ceil(p.abCd / 60)}s`, x, 109); }\n      if (canDash(p)) {",
    ],
    [
      "SPR.bat = SPR.caveBat;",
      "SPR.bat = SPR.caveBat;\n  SPR.frog = (w, h, f, wk) => { const j = Math.max(0, wk) * 3; ell(18, h - 9 - j, 13, 8, '#65a30d'); ell(18, h - 6 - j, 8, 4, '#d9f99d'); pgo([[26, h - 4 - j], [36, h], [22, h]], '#4d7c0f'); ell(8, h - 14 - j, 5, 5, '#fde047'); ell(8, h - 14 - j, 2, 3, '#111'); ell(26, h - 15 - j, 4, 4, '#fde047'); fang(3, h - 6 - j, 3); };\n  SPR.dragonfly = (w, h) => { const a = Math.sin(t * .7) * 5; ell(20, 12, 16, 3, '#0e7490'); ell(5, 12, 5, 4, '#14b8a6'); pgo([[18, 11], [10, 2 + a], [26, 5 + a], [28, 11]], 'rgba(186,230,253,.7)', '#0e7490'); pgo([[22, 12], [16, 22 - a], [34, 19 - a], [32, 12]], 'rgba(186,230,253,.7)', '#0e7490'); ell(4, 11, 2, 2, '#ef4444'); };\n  SPR.lilyLog = (w, h) => { rr(2, 6, 42, h - 6, 9, '#6b4a2b'); ell(10, h / 2 + 3, 4, 6, '#c9a06a'); rr(8, 5, 30, 3, 2, '#4d7c0f'); ell(34, 7, 9, 3, '#16a34a'); ell(34, 6, 3, 1.5, '#f9a8d4'); };\n  SPR.cattail = (w, h) => { X.strokeStyle = '#4d7c0f'; X.lineWidth = 3; X.lineCap = 'round'; X.beginPath(); [6, 15, 24].forEach(x => { X.moveTo(x, h); X.lineTo(x + (x - 15) * .3, 8); }); X.stroke(); [6, 15, 24].forEach(x => rr(x - 3 + (x - 15) * .3, 0, 6, 16, 3, '#7c2d12')); };\n  SPR.goat = (w, h) => { X.strokeStyle = '#e5e7eb'; X.lineWidth = 3; X.lineCap = 'round'; for (let i = 0; i < 4; i++) { const lx = 12 + i * 8, s = Math.sin(t * .4 + i * 1.6) * 3; X.beginPath(); X.moveTo(lx, 18); X.lineTo(lx + s, h); X.stroke(); } rr(8, 10, 28, 12, 6, '#f3f4f6'); rr(0, 4, 14, 12, 5, '#e5e7eb'); pgo([[4, 4], [0, -4], [9, 2]], '#a3a3a3'); pgo([[9, 4], [10, -5], [14, 3]], '#a3a3a3'); pgo([[2, 16], [5, 24], [8, 16]], '#e5e7eb'); eyeA(6, 9, 1.8, '#fde047'); };\n  SPR.eagle = (w, h, f) => { pgo([[20, 16], [4, 2 + f], [0, 14], [12, 18]], '#78350f'); pgo([[26, 16], [42, 2 + f], [46, 14], [34, 18]], '#78350f'); ell(23, 17, 12, 6, '#92400e'); ell(23, 19, 8, 3, '#fef3c7'); ell(11, 13, 5, 5, '#fff'); pgo([[6, 13], [0, 16], [6, 18]], '#facc15'); eyeA(10, 12, 1.8, '#fde047'); pgo([[34, 16], [46, 22], [34, 20]], '#fff'); };\n  SPR.pine = (w, h) => { rr(14, h - 12, 6, 12, 2, '#5b3414'); for (let i = 0; i < 3; i++) pgo([[2 + i * 3, h - 10 - i * 13], [17, h - 26 - i * 13], [32 - i * 3, h - 10 - i * 13]], ['#14532d', '#166534', '#15803d'][i]); polygon([[17, 0], [12, 9], [22, 9]], '#fff'); };\n  SPR.boulderPile = (w, h) => { pgo([[0, h], [2, 18], [14, 12], [24, h]], '#64748b'); pgo([[18, h], [22, 8], [36, 2], [48, 16], [50, h]], lg(0, 0, 0, h, '#94a3b8', '#475569')); pgo([[10, 14], [18, 2], [28, 10]], '#cbd5e1'); polygon([[36, 2], [48, 16], [40, 14]], 'rgba(255,255,255,.4)'); };\n  SPR.crab = (w, h) => { X.strokeStyle = '#b91c1c'; X.lineWidth = 2; for (let i = 0; i < 3; i++) { const s = Math.sin(t * .5 + i * 2) * 3; [-1, 1].forEach(d => { X.beginPath(); X.moveTo(20 + d * 8, 16); X.lineTo(20 + d * (14 + i * 2) + s, h); X.stroke(); }); } ell(20, 15, 14, 8, '#ef4444'); ell(20, 18, 9, 3, '#fca5a5'); pgo([[4, 12], [-2, 4], [8, 6]], '#dc2626'); pgo([[36, 12], [42, 4], [32, 6]], '#dc2626'); ell(14, 7, 2.2, 2.2, '#fff'); ell(26, 7, 2.2, 2.2, '#fff'); ell(14, 7, 1, 1, '#111'); ell(26, 7, 1, 1, '#111'); };\n  SPR.jelly = (w, h) => { X.fillStyle = 'rgba(244,114,182,.85)'; X.beginPath(); X.ellipse(15, 14, 14, 12, 0, Math.PI, Math.PI * 2); X.closePath(); X.fill(); X.fillRect(1, 14, 28, 3); X.strokeStyle = '#f9a8d4'; X.lineWidth = 2; for (let i = 0; i < 4; i++) { X.beginPath(); X.moveTo(5 + i * 6, 17); X.quadraticCurveTo(5 + i * 6 + Math.sin(t * .2 + i) * 4, 24, 5 + i * 6, 31); X.stroke(); } eyeA(10, 10, 2, '#7e22ce'); eyeA(21, 10, 2, '#7e22ce', -1); };\n  SPR.coral = (w, h) => { X.lineCap = 'round'; X.lineWidth = 6; X.strokeStyle = '#f43f5e'; X.beginPath(); X.moveTo(18, h); X.lineTo(18, 10); X.moveTo(18, 30); X.lineTo(6, 16); X.lineTo(6, 6); X.moveTo(18, 24); X.lineTo(30, 12); X.lineTo(30, 2); X.stroke(); X.lineWidth = 2; X.strokeStyle = '#fda4af'; X.stroke(); [[18, 8], [6, 5], [30, 1]].forEach(([x, y]) => ell(x, y, 4, 4, '#fb7185')); ell(18, h - 2, 16, 3, '#fcd34d'); };\n  SPR.anchor = (w, h) => { X.strokeStyle = '#475569'; X.lineWidth = 4; X.lineCap = 'round'; X.beginPath(); X.moveTo(17, 6); X.lineTo(17, h - 4); X.moveTo(8, 14); X.lineTo(26, 14); X.moveTo(4, h - 14); X.quadraticCurveTo(17, h + 4, 30, h - 14); X.stroke(); ell(17, 5, 4, 4, '#94a3b8'); ell(17, 5, 1.6, 1.6, '#1e293b'); ell(12, h - 5, 3, 2, '#16a34a'); };",
    ],
    [
      "reset(); requestAnimationFrame(loop);",
      "const DINOS = [\n    { id: 'rex', n: 'Tiranossauro', c: '#2f9e44', d: 'Onda de choque no chão (O / 8). Recarga 50s.' },\n    { id: 'ptero', n: 'Pterodáctilo', c: '#9a6fd1', d: 'Pulo duplo (passiva).' },\n    { id: 'raptor', n: 'Velociraptor', c: '#6b93b1', d: 'Velocidade extra (passiva).' },\n    { id: 'anky', n: 'Anquilossauro', c: '#3f72c9', d: 'Defesa extra: -25% de dano (passiva).' },\n    { id: 'para', n: 'Parassauro', c: '#f2c230', d: 'Eco que paralisa por 1s (O / 8). Recarga 15s.' },\n  ];\n  const SPINO = { id: 'spino', n: 'Espinossauro', c: '#6b7280', d: 'Secreto: todas as habilidades!' };\n  const has = (p, k) => p.type === k || p.type === 'spino';\n  const colorOf = p => (p.type === 'spino' ? SPINO : (DINOS.find(d => d.id === p.type) || DINOS[0])).c;\n  const pScore = p => Math.floor(dist / 10) + p.pts;\n  const mixc = (a, b, k) => { const q = hx => [1, 3, 5].map(i => parseInt(hx.slice(i, i + 2), 16)); const A = q(a), B = q(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };\n\n  const tryJump = p => {\n    if (p.hp <= 0) return;\n    if (p.grounded) { p.vy = -14; p.grounded = false; p.jumps = 1; habit.j++; }\n    else if (has(p, 'ptero') && p.jumps < 2) { p.vy = -13; p.jumps = 2; habit.j++; puff(p.x, p.y - 10, 6, '#e9d5ff'); }\n  };\n\n  function dinoAbility(p) {\n    const sh = has(p, 'rex'), ec = has(p, 'para');\n    if (p.hp <= 0 || p.abCd > 0 || !(sh || ec)) return;\n    p.abCd = sh ? 3000 : 900; lastHit = p;\n    if (sh) {\n      [-1, 1].forEach(d => proj.push({ x: p.x - 22, y: GY - 22, w: 44, h: 22, vx: d * 7, vy: 0, c: '#fbbf24', kind: 'shock', life: 110, friendly: true, shock: true, owner: p, power: { damage: 3 } }));\n      shake = Math.max(shake, 10);\n    }\n    if (ec) {\n      if (boss) { boss.freeze = Math.max(boss.freeze, 60); boss.s = 'idle'; boss.atk = null; boss.tm = 70; }\n      obs.forEach(o => { if (o.creature) o.para = 60; });\n      puff(p.x, p.y - 30, 24, '#22d3ee', { s: 2.5, g: 0 });\n    }\n    say(sh && ec ? 'Onda de choque + Eco!' : sh ? 'Onda de choque!' : 'Eco paralisante!');\n  }\n\n  function secretMissions(victory) {\n    const el = $('secret-msg'), out = [];\n    if (victory) {\n      S.won = 1; save();\n      if (startBiome === 0 && !devMode) {\n        if (spawnedCr > 0 && kills >= spawnedCr && bk >= 9) out.push('Alanzoka é você ❓');\n        if (kills === 0 && !tookDmg) out.push('Conquista pacifista ☮️');\n        if (t < 54000) out.push('SpeedRunners ⚡');\n      }\n    }\n    el.innerHTML = out.map(x => `<div class=\"secret\">${x}<\/div>`).join('');\n    el.hidden = !out.length;\n  }\n\n  // ---------- Tela de seleção ----------\n  const EX = {\n    rex: '<path d=\"M34 38l8 10M46 34l8 10\" stroke=\"#0008\" stroke-width=\"5\"/>',\n    ptero: '<path d=\"M40 34L6 6 28 42z\" fill=\"currentColor\" stroke=\"#000\" stroke-width=\"3\"/><path d=\"M72 40L98 12 94 54z\" fill=\"currentColor\" stroke=\"#000\" stroke-width=\"3\"/>',\n    raptor: '<path d=\"M30 40l24 8M34 54l24 8\" stroke=\"#0009\" stroke-width=\"4\"/>',\n    anky: '<circle cx=\"34\" cy=\"38\" r=\"6\" fill=\"#d7ccc8\" stroke=\"#000\"/><circle cx=\"52\" cy=\"34\" r=\"6\" fill=\"#d7ccc8\" stroke=\"#000\"/><circle cx=\"70\" cy=\"38\" r=\"5\" fill=\"#d7ccc8\" stroke=\"#000\"/>',\n    para: '<path d=\"M42 34Q0 18 4 58L26 46z\" fill=\"currentColor\" stroke=\"#000\" stroke-width=\"3\"/>',\n    spino: '<path d=\"M22 42L28 6 42 30 54 2 66 28 80 8 78 42z\" fill=\"#d9572b\" stroke=\"#000\" stroke-width=\"3\"/>',\n  };\n  const portrait = d => `<svg viewBox=\"0 0 100 100\" style=\"color:${d.c}\">${EX[d.id] || ''}<path d=\"M10 72Q8 40 40 32Q76 24 92 54L88 80Q50 90 10 72Z\" fill=\"currentColor\" stroke=\"#000\" stroke-width=\"3\"/><path d=\"M26 76l4-9 4 9M42 80l4-9 4 9M58 79l4-9 4 9\" fill=\"#fff\"/><circle cx=\"64\" cy=\"48\" r=\"7\" fill=\"#fde047\" stroke=\"#000\"/><circle cx=\"66\" cy=\"48\" r=\"3\"/><\/svg>`;\n\n  let steps = [], si = 0;\n  const curId = () => steps[si] === 'p1' ? choice[0] : steps[si] === 'p2' ? choice[1] : startBiome;\n  function renderSelect() {\n    const k = steps[si], g = $('select-grid'); g.innerHTML = '';\n    $('select-info').textContent = '';\n    $('select-title').textContent = k === 'map' ? 'Escolha o mapa' : `Escolha seu dino · Jogador ${k === 'p1' ? 1 : 2}`;\n    const items = k === 'map' ? BIOMES.map((b, i) => ({ id: i, n: b.n, sky: b.sky, d: 'Mapa: ' + b.n })) : [...DINOS, ...(S.spino ? [SPINO] : [])];\n    items.forEach(d => {\n      const b = document.createElement('button'); b.type = 'button';\n      b.className = 'select-card' + (d.id === curId() ? ' sel' : '');\n      b.innerHTML = (d.sky ? `<span class=\"sc-face\" style=\"background:linear-gradient(${d.sky[0]},${d.sky[1]})\"><\/span>` : '<canvas width=\"120\" height=\"100\"><\/canvas>') + `<b>${d.n}<\/b>`;\n      b.onclick = () => { if (k === 'p1') choice[0] = d.id; else if (k === 'p2') choice[1] = d.id; else startBiome = d.id; renderSelect(); $('select-info').textContent = d.d; };\n      const cv = b.querySelector('canvas'); if (cv) { const c2d = cv.getContext('2d'); c2d.translate(60, 92); c2d.scale(1.25, 1.25); drawDinoShape(c2d, d.id, d.c, 0, 0, false); } g.appendChild(b);\n    });\n    $('select-ok').textContent = si < steps.length - 1 ? 'Próximo' : 'Jogar';\n  }\n  function openSelect() {\n    steps = ['p1', ...(twoPlayer ? ['p2'] : []), ...(S.won ? ['map'] : [])]; si = 0; startBiome = 0;\n    $('select-msg').textContent = ''; renderSelect(); show('select-modal'); dirty = true;\n  }\n  $('select-ok').onclick = () => {\n    if (si < steps.length - 1) { si++; renderSelect(); return; }\n    hide('select-modal'); reset(); st = 'ready'; $('dino-hint').classList.remove('hide');\n  };\n  $('select-code').addEventListener('input', e => {\n    const v = e.target.value.trim(), m = $('select-msg');\n    if (v === UNLOCK_CODE) { S.spino = 1; save(); m.textContent = 'Espinossauro desbloqueado!'; e.target.value = ''; renderSelect(); }\n    else if (v === DEV_PASSWORD) { devMode = true; m.textContent = 'Vida e dano infinitos ativados!'; e.target.value = ''; }\n    else if (v.length >= 6) m.textContent = 'Código inválido.';\n  });\n\n  reset(); openSelect(); requestAnimationFrame(loop);",
    ],
    [
      "function drawDino(p, color = '#2e7d32') {",
      "function drawDinoShape(g, type, color, t, L, duck) {\n    const dk = mixc(color, '#000000', .35), lt = mixc(color, '#ffffff', .5), sw = Math.sin(t * .2) * 3, fl = Math.sin(t * .25) * 10;\n    const poly = (pts, c) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = c; g.fill(); g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 1.3; g.lineJoin = 'round'; g.stroke(); };\n    const el = (x, y, rx, ry, c) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, 7); g.fillStyle = c; g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 1.2; g.stroke(); };\n    const eye = (x, y, r) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = '#fff'; g.fill(); g.beginPath(); g.arc(x + r * .35, y, r * .5, 0, 7); g.fillStyle = '#111'; g.fill(); };\n    const line = (pts, c, w) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round'; g.stroke(); };\n    const teeth = (x, y, n, s) => { for (let i = 0; i < n; i++) poly([[x + i * s, y], [x + i * s + s * .7, y], [x + i * s + s * .35, y + s]], '#fff'); };\n    // cauda mais baixa ao agachar\n    const lowTail = fn => { g.save(); if (duck) g.translate(0, 7); fn(); g.restore(); };\n    // tronco + cabeça: ao agachar inclinam para a frente a partir do quadril\n    const pose = (fn, s = 1) => { g.save(); if (duck) { g.translate(6, 8); g.translate(0, -12); g.rotate(.5); g.scale(s, s); g.translate(0, 12); } fn(); g.restore(); };\n    // pernas dobradas (agachado)\n    const bent = (cd, cl) => {\n      poly([[-9, -18], [1, -18], [13, -10], [9, -5], [-3, -11]], cd); poly([[7, -8], [13, -7], [16, 0], [2, 0], [4, -3]], cd);\n      poly([[-3, -18], [7, -18], [19, -10], [15, -5], [3, -11]], cl); poly([[13, -8], [19, -7], [22, 0], [8, 0], [10, -3]], cl);\n    };\n    const legs2 = (cd, cl, k) => {\n      if (duck) return bent(cd, cl);\n      poly([[-10, -20], [2, -20], [4 + L * k, -4], [10 + L * k, 0], [-6 + L * k, 0], [-8 + L * k, -5]], cd);\n      poly([[-3, -20], [9, -20], [11 - L * k, -4], [17 - L * k, 0], [-1 - L * k, 0], [-3 - L * k, -5]], cl);\n    };\n    g.save();\n    switch (type) {\n      case 'ptero':\n        if (duck) {\n          poly([[-2, -24], [-30, -17], [-30, -9], [-4, -12]], dk);\n          line([[-2, -9], [-3, 0]], dk, 4); line([[7, -9], [8, 0]], dk, 4);\n          el(2, -16, 12, 10, color); el(5, -13, 7, 6, lt);\n          poly([[0, -24], [-34, -17], [-32, -10], [4, -13]], color);\n          poly([[8, -20], [15, -27], [23, -25], [15, -16]], color);\n          poly([[16, -29], [46, -21], [16, -20]], color);\n          poly([[15, -29], [-4, -36], [18, -24]], dk); eye(21, -26, 2.4);\n          break;\n        }\n        poly([[-2, -36], [-32, -54 - fl], [-40, -30 - fl * .6], [-8, -28]], dk);\n        line([[-4, -14], [-5 + L * .5, 0]], dk, 4); line([[5, -14], [6 - L * .5, 0]], dk, 4);\n        poly([[-9, -22], [-24, -14], [-9, -13]], dk);\n        el(0, -26, 11, 13, color); el(3, -22, 6, 8, lt);\n        poly([[3, -36], [36, -56 + fl], [42, -30 + fl * .6], [9, -26]], color);\n        line([[6, -34], [34, -50 + fl * .8]], dk, 1.5);\n        poly([[6, -34], [11, -50], [20, -48], [13, -32]], color);\n        poly([[9, -52], [40, -45], [9, -44]], color);\n        poly([[8, -52], [-14, -62], [9, -47]], dk);\n        eye(14, -49, 2.6);\n        break;\n      case 'raptor':\n        lowTail(() => poly([[2, -28], [-40, -32 + sw], [-40, -27 + sw], [2, -19]], color));\n        if (duck) { bent(dk, color); poly([[18, -8], [25, -12], [22, 0]], '#f5efd9'); }\n        else {\n          poly([[-9, -24], [2, -24], [4 + L * .6, -6], [11 + L * .6, 0], [-2 + L * .6, 0], [-5 + L * .6, -8]], dk);\n          poly([[8 + L * .6, -5], [15 + L * .6, -9], [11 + L * .6, 0]], '#f5efd9');\n          poly([[-3, -24], [8, -24], [10 - L * .6, -6], [17 - L * .6, 0], [3 - L * .6, 0], [0 - L * .6, -8]], color);\n          poly([[13 - L * .6, -5], [20 - L * .6, -9], [16 - L * .6, 0]], '#f5efd9');\n        }\n        pose(() => {\n          el(0, -31, 16, 10, color); el(4, -27, 9, 5, lt);\n          for (let i = 0; i < 4; i++) line([[-8 + i * 5, -40], [-6 + i * 5, -26]], dk, 2);\n          poly([[7, -36], [15, -50], [22, -48], [13, -30]], color);\n          poly([[13, -54], [34, -51], [36, -46], [21, -44], [13, -47]], color);\n          poly([[21, -45], [35, -46], [32, -42], [21, -42]], dk); teeth(24, -45, 4, 3);\n          eye(22, -50, 2.6);\n          poly([[10, -31], [19, -27], [17, -24], [9, -26]], color); poly([[17, -27], [22, -26], [18, -23]], '#f5efd9');\n        });\n        break;\n      case 'anky': {\n        const cy = -10 + sw * .4;\n        poly([[-12, -20], [-34, cy - 4], [-34, cy + 4], [-12, -8]], color);\n        el(-38, cy, 9, 8, color); poly([[-45, cy - 5], [-50, cy - 12], [-41, cy - 8]], '#f6e3a0'); poly([[-45, cy + 5], [-50, cy + 12], [-41, cy + 8]], '#f6e3a0');\n        if (duck) [-14, -5, 6, 15].forEach((x, i) => el(x, -3, 6, 3.5, i % 2 ? dk : color));\n        else [-14, -5, 6, 15].forEach((x, i) => { const o = (i % 2 ? 1 : -1) * L * .5; poly([[x - 4, -14], [x + 4, -14], [x + 4 + o, 0], [x - 4 + o, 0]], i % 2 ? dk : color); });\n        g.save(); if (duck) g.translate(0, 10);\n        el(2, -21, 23, 13, color); el(4, -14, 16, 6, '#f6c945');\n        for (let i = 0; i < 5; i++) poly([[-16 + i * 8, -30], [-12 + i * 8, -40], [-8 + i * 8, -30]], '#f6e3a0');\n        g.restore();\n        g.save(); if (duck) g.translate(-5, 13);\n        el(26, -19, 9, 8, color); poly([[22, -26], [25, -32], [28, -26]], '#f6e3a0'); eye(29, -22, 2.4); line([[26, -15], [33, -16]], dk, 1.5);\n        g.restore();\n        break; }\n      case 'para': {\n        const og = mixc(color, '#c2410c', .55);\n        lowTail(() => poly([[2, -26], [-38, -12 + sw], [-36, -7 + sw], [2, -12]], color));\n        legs2(og, color, .5);\n        pose(() => {\n          el(0, -29, 14, 14, color); el(4, -25, 8, 9, lt);\n          poly([[2, -40], [10, -56], [19, -54], [11, -36]], color);\n          poly([[9, -60], [27, -59], [35, -54], [29, -49], [12, -50]], color);\n          poly([[10, -60], [-12, -68], [-10, -62], [10, -54]], og);\n          eye(19, -56, 2.6); poly([[8, -32], [16, -27], [14, -24], [7, -27]], color);\n        }, .92);\n        break; }\n      case 'spino':\n        lowTail(() => poly([[2, -32], [-38, -22 + sw], [-36, -14 + sw], [2, -15]], color));\n        legs2(dk, color, .5);\n        pose(() => {\n          poly([[-12, -40], [-9, -60], [-3, -48], [3, -66], [9, -48], [15, -62], [18, -40]], '#d4a017');\n          for (let i = 0; i < 3; i++) line([[-3 + i * 6, -42], [-3 + i * 6, -52]], dk, 1.5);\n          el(0, -30, 17, 14, color); el(5, -25, 9, 9, lt);\n          for (let i = 0; i < 4; i++) line([[-9 + i * 6, -42], [-7 + i * 6, -24]], '#e5b818', 3);\n          poly([[4, -44], [10, -50], [40, -49], [45, -44], [41, -40], [12, -37], [5, -40]], color);\n          poly([[12, -38], [41, -41], [38, -36], [14, -34]], dk); teeth(17, -41, 6, 4);\n          poly([[28, -49], [31, -54], [35, -49]], '#d4a017'); eye(21, -45, 2.8);\n          poly([[10, -30], [21, -28], [20, -24], [10, -25]], color);\n        }, .85);\n        break;\n      default: // rex\n        lowTail(() => poly([[2, -32], [-38, -24 + sw], [-36, -15 + sw], [2, -15]], color));\n        legs2(dk, color, .5);\n        pose(() => {\n          el(0, -30, 17, 15, color); el(5, -25, 9, 10, lt);\n          poly([[2, -44], [10, -54], [36, -55], [41, -47], [38, -41], [12, -37], [4, -40]], color);\n          poly([[12, -38], [37, -41], [33, -34], [14, -33]], dk); teeth(16, -41, 5, 4);\n          eye(24, -48, 3); line([[19, -53], [28, -51]], dk, 2);\n          poly([[9, -30], [19, -27], [18, -24], [9, -25]], color);\n        }, .92);\n    }\n    g.restore();\n  }\n  \nfunction drawDino(p, color = '#2e7d32') {",
    ],
    [
      "X.fillStyle = color; X.fillRect(-9, -10, 7, 10 + lg); X.fillRect(2, -10, 7, 10 - lg);",
      "const _ga = X.globalAlpha; drawDinoShape(X, p.type || 'rex', color, t, lg, d); X.globalAlpha = 0;\n    X.fillStyle = color; X.fillRect(-9, -10, 7, 10 + lg); X.fillRect(2, -10, 7, 10 - lg);",
    ],
    [
      "const swd = swordOf(p), swing = p.sw > 0;",
      "X.globalAlpha = _ga; if (d) X.translate(6, 9); const swd = swordOf(p), swing = p.sw > 0;",
    ],

    // ===== SENHA COM * =====
    [
      "$('select-code').addEventListener('input', e => {\n    const v = e.target.value.trim(), m = $('select-msg');",
      "let secretCode = '';\n  $('select-code').addEventListener('input', e => {\n    const raw = e.target.value; secretCode = raw.length <= secretCode.length ? secretCode.slice(0, raw.length) : secretCode + raw.slice(secretCode.length); e.target.value = '*'.repeat(secretCode.length);\n    const v = secretCode, m = $('select-msg');",
    ],
    [
      "m.textContent = 'Espinossauro desbloqueado!'; e.target.value = '';",
      "m.textContent = 'Espinossauro desbloqueado!'; e.target.value = ''; secretCode = '';",
    ],
    [
      "m.textContent = 'Vida e dano infinitos ativados!'; e.target.value = '';",
      "m.textContent = 'Vida e dano infinitos ativados!'; e.target.value = ''; secretCode = '';",
    ],
    [
      "else if (v.length >= 6) m.textContent = 'Código inválido.';",
      "else if (v.length >= 6) { m.textContent = 'Código inválido.'; e.target.value = ''; secretCode = ''; }",
    ],

    // ===== CUTSCENE: mais segura + pontos na mesma tela =====
    [
      "if (victory) playCastleCutscene(); else show('game-modal');",
      "if (victory) { try { playCastleCutscene(); } catch (err) { console.error(err); cutOn = false; show('game-modal'); } } else show('game-modal');",
    ],
    [
      "const tick = now => {",
      "const tick = now => { try { tick2(now); } catch (err) { console.error(err); skipCut(); } }\n    const tick2 = now => {",
    ],
    [
      "g.fillStyle = '#d9f99d'; g.font = 'bold 22px sans-serif'; tx('Pontos: ' + pts, 260, 170);",
      "",
    ],
    [
      "const ta = clamp((f - fLast - 40) / 30);",
      "g.globalAlpha = 1; g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(100, 14, 320, 52); g.strokeStyle = '#fde047'; g.lineWidth = 2; g.strokeRect(100, 14, 320, 52);\n      g.textAlign = 'center'; g.fillStyle = '#d9f99d'; g.font = 'bold 11px sans-serif'; g.fillText('PONTOS', 260, 32); g.fillStyle = '#fff'; g.font = 'bold 20px sans-serif'; g.fillText(String(pts), 260, 57);\n      const ta = clamp((f - fLast - 40) / 30);",
    ],

    // ===== ORBES NAS PLATAFORMAS =====
    [
      "const pl = platforms.find(q => i.x >= q.x && i.x <= q.x + q.w) || platforms[platforms.length - 1];",
      "const free = platforms.filter(q => q.x + q.w > 30 && !items.some(o => o !== i && o.plat === q)), pool = free.length ? free : platforms, pl = pool.reduce((a, q) => Math.abs(q.x + q.w / 2 - i.x) < Math.abs(a.x + a.w / 2 - i.x) ? q : a);",
    ],
    [
      "i.off = Math.max(14, Math.min(pl.w - 14, i.x - pl.x)); i.y = pl.y - 24;",
      "i.off = pl.w / 2 + R(-30, 30); i.y = pl.y - 22;",
    ],

    // ===== MENOS OBSTÁCULOS NA ÚLTIMA FASE =====
    [
      "if (used.length >= 2) return true;",
      "if (used.length >= 1) return true;",
    ],
    [
      "const r = Math.random();\n    if (r < .2) {",
      "const r = Math.random();\n    if (r >= .2 && Math.random() < .3) return true;\n    if (r < .2) {",
    ],
    [
      "nextSp = R(50, 110) - Math.min(biome * 4, 25);",
      "nextSp = inAirBiome ? R(110, 190) : R(50, 110) - Math.min(biome * 4, 25);",
    ],
  ];

  const fail = (msg) => {
    console.error(msg);
    alert(msg);
  };

  async function boot() {
    let code;
    try {
      const r = await fetch(BASE);
      if (!r.ok) throw new Error("HTTP " + r.status);
      code = (await r.text()).replace(/\r\n/g, "\n");
    } catch (e) {
      return fail(
        "Não consegui carregar " +
          BASE +
          "\nUse um servidor local (Live Server / python -m http.server) e confira o caminho do index.js.",
      );
    }
    for (const [a, b] of JS_PATCH) {
      const i = code.indexOf(a);
      if (i < 0) {
        console.warn(
          "Patch ignorado (trecho não encontrado no index.js):\n" + a.slice(0, 80),
        );
        continue;
      }
      code = code.slice(0, i) + b + code.slice(i + a.length);
    }
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    const res = document.getElementById("game-result-message"),
      gm = document.getElementById("game-modal");
    if (!res || !gm)
      return fail(
        "index.html não tem os elementos do jogo (game-result-message / game-modal).",
      );
    res.insertAdjacentHTML("afterend", HTML_AFTER_RESULT);
    gm.insertAdjacentHTML("beforebegin", HTML_BEFORE_MODAL);
    const s = document.createElement("script");
    s.textContent = code + "\n//# sourceURL=index.patched.js";
    document.body.appendChild(s);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
