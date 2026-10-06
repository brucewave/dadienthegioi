'use strict';
/* ==========================================================
   WORLD — bản đồ top-down: dựng cảnh, nhân vật, camera
   và MINI.world (đi lại, xem xét, nói chuyện, lén lút)
   ========================================================== */
const TILE = 3;            // 1 ô = 3em (khung hình rộng 64em × 36em)
let WS = null;             // trạng thái cảnh hiện tại
const KEYS = new Set();
addEventListener('keydown', e => KEYS.add(e.key.toLowerCase()));
addEventListener('keyup', e => KEYS.delete(e.key.toLowerCase()));
addEventListener('blur', () => KEYS.clear());

const unitPx = () => parseFloat(stage().style.fontSize) || 20;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function buildMap(key, opt = {}) {
  const root = $('#world'); root.innerHTML = ''; root.className = '';
  const m = MAPS[key];
  if (!m) {
    root.innerHTML = ART.special(key) + '<div class="scast"></div>'; root.classList.add('isSpecial');
    WS = { special: true, key, ents: [] }; return WS;
  }
  const H = m.tiles.length, W = m.tiles[0].length;
  if (m.night && opt.night === undefined) opt = { ...opt, night: true };
  // ban đêm: phủ bóng tối, khoét “lỗ sáng” quanh đèn/nến/cửa sổ sáng
  let dark = '';
  if (opt.night || opt.dark) {
    const L = ART.mapLights(m, opt.extraProps || []), VW = W * 32, VH = H * 32, id = 'dm' + Math.random().toString(36).slice(2, 7);
    dark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VW} ${VH}" width="${VW}" height="${VH}" preserveAspectRatio="none"><defs>
      <radialGradient id="${id}g"><stop offset="0" stop-color="#000"/><stop offset=".45" stop-color="#000" stop-opacity=".9"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}w"><stop offset="0" stop-color="#FFD98A" stop-opacity=".45"/><stop offset="1" stop-color="#FFD98A" stop-opacity="0"/></radialGradient>
      <mask id="${id}"><rect width="${VW}" height="${VH}" fill="#fff"/>${L.map(([x, y, r]) => `<circle cx="${x * 32}" cy="${y * 32}" r="${r * 32}" fill="url(#${id}g)"/>`).join('')}</mask></defs>
      <rect width="${VW}" height="${VH}" fill="${opt.dark ? '#120808' : '#141A3A'}" opacity="${opt.dark ? .66 : .55}" mask="url(#${id})"/>
      ${L.map(([x, y, r]) => `<circle cx="${x * 32}" cy="${y * 32}" r="${r * 26}" fill="url(#${id}w)"/>`).join('')}</svg>`;
  }
  root.innerHTML = `<div class="wcont" style="width:${W * TILE}em;height:${H * TILE}em">
    <div class="wmap"><img alt="" draggable="false" src="${svgUrl(ART.mapSvg(m, { ...opt, standalone: true }))}"></div>${dark ? `<img class="wdark" alt="" draggable="false" src="${svgUrl(dark)}">` : ''}<div class="wlow"></div>
    <canvas class="wfx" width="${W * 32}" height="${H * 32}"></canvas><div class="wents"></div></div>
    <div class="tint ${opt.sunset ? 'sunset' : ''} ${opt.dream ? 'dream' : ''}"></div>`;
  const solids = (m.props || []).concat(opt.extraProps || []).filter(p => p.solid).map(p => [p.x, p.y, p.w || 1, p.h || 1]);
  WS = { key, m, H, W, ents: [], opt, solids };
  camera(W / 2, H / 2, true);
  return WS;
}
function svgUrl(svg) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); }
function tileAt(x, y) { const r = WS.m.tiles[Math.floor(y)]; return r ? (r[Math.floor(x)] || '#') : '#'; }
function blocked(x, y) {
  const c = tileAt(x, y); if (c === '#' || c === 'X') return true;
  return WS.solids.some(([a, b, w, h]) => x >= a && x <= a + w && y >= b && y <= b + h);
}
function camera(x, y, instant, lift = 0) {
  if (!WS || WS.special) return;
  WS.camX = x; WS.camY = y;
  const Z = WS.zoom || 1, U = unitPx(), T = TILE * U * Z, s = stage(), vw = s.clientWidth, vh = s.clientHeight;
  const mw = WS.W * T, mh = WS.H * T;
  const cx = mw <= vw ? (vw - mw) / 2 : clamp(vw / 2 - x * T, vw - mw, 0);
  const cy = mh <= vh ? (vh - mh) / 2 - lift * T : clamp(vh / 2 - y * T - lift * T, vh - mh, 0);
  const c = $('#world .wcont'); if (!c) return;
  c.style.transition = instant ? 'none' : ''; c.style.transform = `translate(${cx}px,${cy}px) scale(${Z})`;
}

/* ---------- Nhân vật trên bản đồ ---------- */
function renderEnt(e) {
  e.el.innerHTML = ART.chibi(e.key, e.dir, { emo: e.emo }) + (e.bub ? `<div class="emote">${ART.emote(e.bub)}</div>` : '');
}
function camFollow(x, y, dt) {
  if (WS.camX === undefined) { camera(x, y, true); return; }
  const k = Math.min(1, dt * 7);
  camera(WS.camX + (x - WS.camX) * k, WS.camY + (y - WS.camY) * k, true);
}
function addEnt(key, x, y, dir = 'down', cls = '') {
  const e = { key, x, y, dir, emo: 'neutral', bub: null, el: h('div', 'ent ' + cls) };
  renderEnt(e); e.el.dataset.k = key;
  if (WS.special) { $('#world .scast').append(e.el); WS.ents.push(e); return e; }
  $('#world .wents').append(e.el); WS.ents.push(e); placeEnt(e); return e;
}
function placeEnt(e) {
  if (WS.special) return;
  e.el.style.transform = `translate(calc(${e.x * TILE}em - 1.95em), calc(${e.y * TILE}em - 4.42em))`;
  e.el.style.zIndex = Math.round(e.y * 10);
}
function faceEnt(e, dir) { if (e.dir !== dir) { e.dir = dir; renderEnt(e); } }
function emoEnt(e, emo, bubble) { const b = bubble === undefined ? (emo !== 'neutral' ? emo : null) : bubble; if (e.emo !== emo || e.bub !== b) { e.emo = emo; e.bub = b; renderEnt(e); } }
function dirFrom(dx, dy) { return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); }
function removeEnts(filter) { WS.ents = WS.ents.filter(e => { if (filter(e)) { e.el.remove(); return false; } return true; }); }

/* ---------- Cảnh hội thoại (bg + cast) ---------- */
function sceneBg(key, opt) {
  const mk = key === 'fire' ? 'inn_room' : key;
  buildMap(mk, opt);
  if (G.cast && G.cast.length) sceneCast(G.cast);
}
function sceneCast(list) {
  if (!WS) return;
  removeEnts(e => e.cast);
  if (WS.special) { list.forEach(k => { const e = addEnt(k, 0, 0); e.cast = true; }); return; }
  const sp = WS.m.spots || [[WS.W / 2 - 1, WS.H / 2], [WS.W / 2 + 1, WS.H / 2], [WS.W / 2 - 3, WS.H / 2], [WS.W / 2 + 3, WS.H / 2]];
  list.forEach((k, i) => { const p = sp[i % sp.length]; const e = addEnt(k, p[0], p[1], i === 0 && list.length > 1 ? 'right' : i === 1 ? 'left' : 'down'); e.cast = true; });
  WS.zoom = list.length ? 1.45 : 1;
  if (!list.length) camera(WS.W / 2, WS.H / 2);
  if (list.length) {
    const pts = list.map((_, i) => sp[i % sp.length]);
    camera(pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length, false, 1.2);
  }
}
function sceneTalk(spk, emo = 'neutral') {
  if (!WS) return;
  WS.ents.forEach(e => {
    const me = e.key === spk;
    e.el.classList.toggle('talk', me);
    if (me) emoEnt(e, emo); else if (e.emo !== 'neutral' || e.bub) emoEnt(e, 'neutral', null);
  });
}

/* ==========================================================
   MINI.world — chơi tự do trên bản đồ
   cfg: { map, o, title, hint, player, at:[x,y], dir,
          objs:[{id, at, label, on:[...], clue, key, finish, prop:{k,x,y,w,h,solid}}],
          npcs:[{c, at, dir, label, on, key, finish, wander, flee}],
          guards:[{c, at, path:[[x,y]...], speed, fov, range, turn:[góc], every}],
          hazards:[{rect:[x,y,w,h], on, off, phase}],
          events:[{id, rect, on:[...]}], require:[id...],
          goal:{reach:[x,y,w,h], label, needKeys} | {keys:true} | {catch:'ve', need:3} | {talk:true},
          done:'chữ nút' }
   ========================================================== */
MINI.world = cfg => new Promise(res => {
  hideText();
  const my = session;
  const objs = (cfg.objs || []).map(o => ({ ...o, kind: 'obj' }));
  const extraProps = objs.filter(o => o.prop).map(o => o.prop).concat(cfg.props || []);
  const mapKey = cfg.map || (G.bgKey === 'fire' ? 'inn_room' : G.bgKey);
  const opt = { ...(cfg.map ? {} : G.bgOpt), ...(cfg.o || {}), extraProps };
  buildMap(mapKey, opt);
  autoMusic(cfg.music || (cfg.guards ? 'tense' : (cfg.goal && cfg.goal.catch) ? 'market' : null));
  const wx = $('#weather'); wx.className = ''; if (opt.rain) wx.classList.add('rain'); if (opt.fire) wx.classList.add('fire'); if (opt.smoke) wx.classList.add('smoke');
  const ents = $('#world .wents'), low = $('#world .wlow'), fxs = $('#world .wfx'), cg = fxs.getContext('2d');
  const start = cfg.at || WS.m.spawn || [WS.W / 2, WS.H / 2];
  const pl = addEnt(cfg.player || G.pov || 'lieng', start[0], start[1], cfg.dir || 'down', 'player');
  const npcs = (cfg.npcs || []).map((n, i) => { const e = addEnt(n.c, n.at[0], n.at[1], n.dir || 'down', 'npc'); Object.assign(e, { n, id: 'npc' + i, kind: 'npc', label: n.label, home: [...n.at], tgt: null, wt: 0, on: n.on, clue: n.clue }); return e; });
  const guards = (cfg.guards || []).map(g => { const e = addEnt(g.c, g.at[0], g.at[1], 'down', 'guard'); Object.assign(e, { g, wi: 0, ang: g.ang ?? 90, tAng: g.ang ?? 90, tt: 0, wait: 0 }); return e; });
  const resetGuards = () => guards.forEach(e => { e.x = e.g.at[0]; e.y = e.g.at[1]; e.wi = 0; e.ang = e.tAng = e.g.ang ?? 90; e.tt = 0; e.wait = 0; placeEnt(e); });
  const st = { busy: false, done: false, fails: 0, found: new Set(), events: new Set(), caught: 0, time: 0, target: null, pending: null, toastKeys: false };
  const keyIds = objs.filter(o => o.key !== false && !o.finish && o.on).map(o => o.id).concat(npcs.filter(e => e.n.key).map(e => e.id));
  const inter = () => objs.filter(o => o.on).concat(npcs.filter(e => e.on));
  const posOf = t => t.kind === 'npc' ? [t.x, t.y] : t.at;

  // vùng: đích, sự kiện, bẫy
  const zone = (r, cls, label) => { const d = h('div', 'zone ' + cls, label ? `<span>${esc(label)}</span>` : ''); Object.assign(d.style, { left: r[0] * TILE + 'em', top: r[1] * TILE + 'em', width: r[2] * TILE + 'em', height: r[3] * TILE + 'em' }); low.append(d); return d; };
  const goal = cfg.goal || (keyIds.length ? { keys: true } : {});
  if (goal.reach) goal.el = zone(goal.reach, 'goal', goal.label || 'Đích');
  (cfg.events || []).forEach(ev => { ev.el = zone(ev.rect, 'event', ev.label || '?'); });
  const haz = (cfg.hazards || []).map(z => ({ ...z, el: zone(z.rect, 'haz') }));

  // dấu hỏi trên đồ vật & người
  const marks = new Map();
  inter().forEach(t => {
    let m;
    if (t.kind === 'npc') m = h('div', 'mark talkm', `<svg viewBox="0 0 64 64"><g stroke="#2B1F1A" stroke-width="4" stroke-linejoin="round" filter="url(#ink)"><path d="M8,10 H56 Q60,10 60,14 V40 Q60,44 56,44 H28 L16,56 L18,44 H8 Q4,44 4,40 V14 Q4,10 8,10Z" fill="#F3EEDF"/><circle cx="20" cy="27" r="3.5" fill="#2B1F1A"/><circle cx="32" cy="27" r="3.5" fill="#2B1F1A"/><circle cx="44" cy="27" r="3.5" fill="#2B1F1A"/></g></svg>`);
    else {
      const ic = t.icon || (t.clue && ICON.CLUE[t.clue.id]) || ICON.ID[t.id] || 'magnifier';
      m = h('div', 'mark itemm' + (t.key === false ? ' minor' : ''), `<div class="mbub">${ICON.svg(ic)}</div><i>?</i>`);
      if (!t.prop) { const g = h('div', 'glint'); g.style.transform = `translate(calc(${t.at[0] * TILE}em - 50%), calc(${t.at[1] * TILE}em - 50%))`; ents.append(g); t.glint = g; }
    }
    ents.append(m); marks.set(t, m);
  });
  const prompt = h('div', 'prompt'); ents.append(prompt);

  // HUD
  const hud = h('div', 'whud');
  hud.innerHTML = `<div class="wtitle">${ICON.svg(cfg.guards ? 'ear' : 'magnifier', 'hico')}<b>${esc(cfg.title || '')}</b><span class="wcnt"></span><p>${esc(cfg.hint || 'Di chuyển: WASD / mũi tên / bấm chuột · Xem xét / nói chuyện: E')}</p></div>
    <div class="wbtns"><button class="btn wdone">${ICON.svg('check', 'bico')}${esc(cfg.done || 'Tiếp tục →')}</button><button class="btn ghost wskip">${ICON.svg('ff', 'bico')}Bỏ qua màn này</button></div>
    <div class="wpad"><button data-d="u">${ICON.svg('arrowU', 'bico')}</button><button data-d="l">${ICON.svg('arrowL', 'bico')}</button><button data-d="r">${ICON.svg('arrowR', 'bico')}</button><button data-d="d">${ICON.svg('arrowD', 'bico')}</button></div><button class="wact">${ICON.svg('magnifier', 'bico')}<b>E</b></button>`;
  hud.querySelectorAll('button').forEach(b => b.dataset.noadv = 1);
  $('#mini').append(hud);
  const pad = { x: 0, y: 0 };
  hud.querySelectorAll('.wpad button').forEach(b => {
    const v = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] }[b.dataset.d];
    const on = e => { e.preventDefault(); pad.x = v[0]; pad.y = v[1]; st.target = null; }, off = () => { pad.x = pad.y = 0; };
    b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off);
  });
  hud.querySelector('.wact').onclick = e => { e.stopPropagation(); tryInteract(); };
  hud.querySelector('.wdone').onclick = e => { e.stopPropagation(); finish(); };
  hud.querySelector('.wskip').onclick = e => { e.stopPropagation(); finish(); };
  const cnt = hud.querySelector('.wcnt');
  const updCount = () => {
    if (goal.catch) cnt.textContent = `Bắt được: ${st.caught}/${goal.need}`;
    else if (keyIds.length) cnt.textContent = `Điểm quan trọng: ${keyIds.filter(i => st.found.has(i)).length}/${keyIds.length}`;
    const allKeys = keyIds.every(i => st.found.has(i));
    hud.querySelector('.wdone').classList.toggle('on', !!goal.keys && allKeys);
    if (goal.keys && allKeys && keyIds.length && !st.toastKeys) { st.toastKeys = true; toast('✔ Đã đủ manh mối quan trọng — bấm “' + (cfg.done || 'Tiếp tục →') + '” khi sẵn sàng.', 'clue'); }
    if (goal.reach && goal.needKeys) goal.el.classList.toggle('off', !allKeys);
  };
  updCount();

  // tương tác
  const near = () => {
    let best = null, bd = 1.35;
    inter().forEach(t => { const [x, y] = posOf(t); const d = Math.hypot(x - pl.x, y - pl.y); if (d < bd) { bd = d; best = t; } });
    return best;
  };
  async function interact(t) {
    AUDIO.sfx('pop');
    st.busy = true; st.target = null; pl.el.classList.remove('walking'); hud.classList.add('busy'); prompt.classList.remove('on');
    const [x, y] = posOf(t); faceEnt(pl, dirFrom(x - pl.x, y - pl.y));
    if (t.kind === 'npc') faceEnt(t, dirFrom(pl.x - t.x, pl.y - t.y));
    await runSteps(t.on || []);
    if (my !== session) return;
    if (t.clue) addClue(t.clue);
    if (t.kind === 'npc' ? t.n.key : t.key !== false && !t.finish) st.found.add(t.id);
    const m = marks.get(t); if (m) m.classList.add('seen'); if (t.glint) t.glint.classList.add('seen');
    hideText(); st.busy = false; hud.classList.remove('busy'); updCount();
    if (t.finish || (t.kind === 'npc' && t.n.finish)) { if (!goal.needKeys || keyIds.every(i => st.found.has(i))) finish(); else toast(goal.needText || 'Hãy xem xét hết những điểm đáng ngờ trước đã.', 'bad'); }
    if (t.once) { t.on = null; const m2 = marks.get(t); if (m2) m2.remove(); }
  }
  function tryInteract() { if (st.busy) return; const t = near(); if (t) interact(t); }

  // bấm chuột trên bản đồ
  const cont = $('#world .wcont');
  cont.addEventListener('click', e => {
    if (st.busy || st.done) return;
    const r = cont.getBoundingClientRect(), T = r.width / WS.W;
    const x = (e.clientX - r.left) / T, y = (e.clientY - r.top) / T;
    let hit = null; inter().forEach(t => { const [tx, ty] = posOf(t); if (Math.hypot(tx - x, ty - (y + (t.kind === 'npc' ? .8 : 0))) < 1) hit = t; });
    st.pending = hit; st.path = findPath(...(hit ? posOf(hit) : [x, y])); st.target = st.path.shift() || null;
    AUDIO.sfx('tick');
  });

  // bắt / bị phát hiện
  function caught(msg) {
    if (st.busy) return;
    st.busy = true; st.fails++; AUDIO.sfx(msg && msg === (cfg.hazardText || 'Dẫm phải bẫy!') ? 'zap' : 'alarm'); fx('redflash'); toast('⚠ ' + (msg || cfg.caught || 'Bị phát hiện!'), 'bad');
    T(() => {
      pl.x = start[0]; pl.y = start[1]; placeEnt(pl); resetGuards(); st.time = 0; st.target = null; st.busy = false;
      if (st.fails >= 3) hud.querySelector('.wskip').classList.add('on');
    }, 900);
  }
  const angDiff = (a, b) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };
  const ray = (x, y, ang, range) => { const dx = Math.cos(ang * Math.PI / 180), dy = Math.sin(ang * Math.PI / 180); let d = 0; while (d < range) { d += .12; if (blocked(x + dx * d, y + dy * d)) return d - .12; } return range; };
  const hidden = () => tileAt(pl.x, pl.y) === 'H';
  const inRect = (r, x, y) => x >= r[0] && x <= r[0] + r[2] && y >= r[1] && y <= r[1] + r[3];
  function finish() {
    if (st.done) return; st.done = true; G.keyHandler = null;
    hud.remove(); prompt.remove(); marks.forEach(m => m.remove()); cg.clearRect(0, 0, fxs.width, fxs.height);
    pl.el.classList.remove('walking'); SFX.ok();
    T(res, 250);
  }

  // vòng lặp
  let last = performance.now();
  const D2A = { right: 0, down: 90, left: 180, up: 270 };
  function frame(now) {
    if (my !== session || st.done) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!st.busy) update(dt);
    requestAnimationFrame(frame);
  }
  const HW = .24, HH = .13;
  const fits = (x, y) => !blocked(x - HW, y - HH) && !blocked(x + HW, y - HH) && !blocked(x - HW, y + HH) && !blocked(x + HW, y + HH) && !blocked(x, y - HH) && !blocked(x, y + HH);
  function moveEnt(e, vx, vy, dt, sp, slide = true) {
    const dist = sp * dt, n = Math.max(1, Math.ceil(dist / .04)), sx = vx * dist / n, sy = vy * dist / n;
    const stuck = !fits(e.x, e.y);                    // lỡ kẹt trong vật: cho phép thoát ra
    const ok = (x, y) => stuck || fits(x, y);
    let moved = false;
    for (let i = 0; i < n; i++) {
      let mx = false, my = false;
      if (sx && ok(e.x + sx, e.y)) { e.x += sx; mx = true; }
      if (sy && ok(e.x, e.y + sy)) { e.y += sy; my = true; }
      // trượt qua góc: bị chặn theo 1 trục thì thử lách sang bên cạnh (tối đa ~0.4 ô)
      if (slide && !mx && sx && !sy) for (let k = 1; k <= 10 && !mx; k++) for (const d of [1, -1]) { const o = d * k * .04; if (ok(e.x, e.y + o) && ok(e.x + sx, e.y + o)) { e.y += d * Math.min(.04, Math.abs(sx)); mx = true; break; } }
      if (slide && !my && sy && !sx) for (let k = 1; k <= 10 && !my; k++) for (const d of [1, -1]) { const o = d * k * .04; if (ok(e.x + o, e.y) && ok(e.x + o, e.y + sy)) { e.x += d * Math.min(.04, Math.abs(sy)); my = true; break; } }
      if (!mx && !my) break;
      moved = true;
    }
    return moved;
  }
  // tìm đường khi bấm chuột (lưới 0.5 ô)
  function findPath(tx, ty) {
    const C = .5, key = (i, j) => i + ',' + j, cell = v => Math.round(v / C);
    const si = cell(pl.x), sj = cell(pl.y), ti = cell(tx), tj = cell(ty);
    const prev = new Map([[key(si, sj), null]]); let q = [[si, sj]], found = null, best = [si, sj], bd = 1e9;
    for (let it = 0; q.length && it < 6000 && !found; it++) {
      const nq = [];
      for (const [i, j] of q) {
        const d = Math.hypot(i - ti, j - tj); if (d < bd) { bd = d; best = [i, j]; }
        if (i === ti && j === tj) { found = [i, j]; break; }
        for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const ni = i + a, nj = j + b, k2 = key(ni, nj);
          if (prev.has(k2) || !fits(ni * C, nj * C) || (a && b && (!fits(i * C + a * C, j * C) || !fits(i * C, j * C + b * C)))) continue;
          prev.set(k2, [i, j]); nq.push([ni, nj]);
        }
      }
      q = nq;
    }
    let c = found || best; const path = [];
    while (c && !(c[0] === si && c[1] === sj)) { path.unshift([c[0] * C, c[1] * C]); c = prev.get(key(...c)); }
    if (found) path.push([tx, ty]);
    return path;
  }
  function update(dt) {
    st.time += dt;
    // người chơi
    let vx = 0, vy = 0;
    if (KEYS.has('arrowleft') || KEYS.has('a')) vx -= 1; if (KEYS.has('arrowright') || KEYS.has('d')) vx += 1;
    if (KEYS.has('arrowup') || KEYS.has('w')) vy -= 1; if (KEYS.has('arrowdown') || KEYS.has('s')) vy += 1;
    vx += pad.x; vy += pad.y;
    if (vx || vy) { st.target = null; st.pending = null; st.path = null; }
    else if (st.target) {
      const dx = st.target[0] - pl.x, dy = st.target[1] - pl.y, d = Math.hypot(dx, dy);
      if (st.pending && Math.hypot(st.pending.kind === 'npc' ? st.pending.x - pl.x : st.pending.at[0] - pl.x, (st.pending.kind === 'npc' ? st.pending.y : st.pending.at[1]) - pl.y) < 1.2) { const t = st.pending; st.pending = null; st.target = null; st.path = null; interact(t); return; }
      if (d < .1) st.target = (st.path && st.path.shift()) || null; else { vx = dx / d; vy = dy / d; }
    }
    const len = Math.hypot(vx, vy);
    if (len) {
      vx /= len; vy /= len;
      const moved = moveEnt(pl, vx, vy, dt, cfg.speed || 3.6, !st.target);
      if (!moved && st.target) { st.target = null; st.path = null; }
      if (moved) { st.stepT = (st.stepT || 0) - dt; if (st.stepT <= 0) { st.stepT = .3 * 3.6 / (cfg.speed || 3.6); AUDIO.sfx('step', WS.m.theme); } }
      if (Math.abs(vx) > .2 || Math.abs(vy) > .2) faceEnt(pl, dirFrom(vx, vy));
      placeEnt(pl);
    }
    pl.el.classList.toggle('walking', !!len);
    pl.el.classList.toggle('hidden', hidden());
    camFollow(pl.x, pl.y - .6, dt);

    // NPC đi lang thang / chạy trốn
    npcs.forEach(e => {
      if (!e.n.wander && !e.n.flee) return;
      e.wt -= dt;
      if (!e.tgt || e.wt <= 0) {
        for (let k = 0; k < 20; k++) { const tx = 1 + Math.random() * (WS.W - 2), ty = 2 + Math.random() * (WS.H - 3); if (!blocked(tx, ty)) { e.tgt = [tx, ty]; break; } }
        e.wt = 1.5 + Math.random() * 2;
      }
      const dx = e.tgt[0] - e.x, dy = e.tgt[1] - e.y, d = Math.hypot(dx, dy);
      if (d > .1) { if (!moveEnt(e, dx / d, dy / d, dt, e.n.speed || 1.4)) e.wt = 0; faceEnt(e, dirFrom(dx, dy)); e.el.classList.add('walking'); placeEnt(e); } else e.el.classList.remove('walking');
      if (goal.catch === e.n.c && Math.hypot(e.x - pl.x, e.y - pl.y) < .8) {
        st.caught++; AUDIO.sfx('meow'); toast(['Meo!', 'Ngoao~', 'Phì!', 'Mrrr?'][st.caught % 4]); updCount();
        if (st.caught >= goal.need) return finish();
        let best = null, bd = 0; for (let k = 0; k < 40; k++) { const tx = 1 + Math.random() * (WS.W - 2), ty = 2 + Math.random() * (WS.H - 3); const dd = Math.hypot(tx - pl.x, ty - pl.y); if (!blocked(tx, ty) && dd > bd) { bd = dd; best = [tx, ty]; } }
        e.x = best[0]; e.y = best[1]; e.wt = 0; placeEnt(e);
      }
    });

    // lính gác
    const polys = [];
    guards.forEach(e => {
      const g = e.g;
      if (g.path) {
        if (e.wait > 0) e.wait -= dt;
        else {
          const [tx, ty] = g.path[e.wi], dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
          if (d < .08) { e.wi = (e.wi + 1) % g.path.length; e.wait = g.pause ?? .6; }
          else { const s = Math.min(d, (g.speed || 1.4) * dt); e.x += dx / d * s; e.y += dy / d * s; e.tAng = Math.atan2(dy, dx) * 180 / Math.PI; }
        }
        e.el.classList.toggle('walking', e.wait <= 0);
      } else if (g.turn) {
        e.tt += dt; if (e.tt >= (g.every || 2)) { e.tt = 0; const i = g.turn.findIndex(a => Math.abs(angDiff(a, e.tAng)) < 1); e.tAng = g.turn[(i + 1) % g.turn.length]; }
      }
      const diff = angDiff(e.tAng, e.ang); e.ang += clamp(diff, -240 * dt, 240 * dt);
      faceEnt(e, Object.entries(D2A).reduce((b, [k, a]) => Math.abs(angDiff(a, e.ang)) < Math.abs(angDiff(D2A[b], e.ang)) ? k : b, 'down'));
      placeEnt(e);
      const fov = g.fov || 60, range = g.range || 4, ex = e.x, ey = e.y - .25;
      const pts = [[ex * 32, ey * 32]];
      for (let i = 0; i <= 16; i++) { const a = e.ang - fov / 2 + fov * i / 16, r = ray(ex, ey, a, range); pts.push([(ex + Math.cos(a * Math.PI / 180) * r) * 32, (ey + Math.sin(a * Math.PI / 180) * r) * 32]); }
      polys.push(pts);
      // phát hiện
      const dx = pl.x - ex, dy = (pl.y - .25) - ey, d = Math.hypot(dx, dy);
      if (!hidden() && !st.busy && d < range && Math.abs(angDiff(Math.atan2(dy, dx) * 180 / Math.PI, e.ang)) < fov / 2 && ray(ex, ey, Math.atan2(dy, dx) * 180 / Math.PI, d) >= d - .15) caught();
      if (!st.busy && d < .55) caught();
    });
    if (guards.length) {
      cg.clearRect(0, 0, fxs.width, fxs.height);
      cg.fillStyle = 'rgba(216,64,47,.28)'; cg.strokeStyle = 'rgba(184,74,62,.75)'; cg.lineWidth = 2; cg.setLineDash([6, 5]); cg.lineJoin = 'round';
      polys.forEach(pts => { cg.beginPath(); pts.forEach(([x, y], i) => i ? cg.lineTo(x, y) : cg.moveTo(x, y)); cg.closePath(); cg.fill(); cg.stroke(); });
    }

    // bẫy
    haz.forEach(z => {
      const per = (z.on || 1.2) + (z.off || 1.4), t = (st.time + (z.phase || 0)) % per, on = t < (z.on || 1.2);
      z.el.classList.toggle('on', on);
      if (on && !st.busy && inRect(z.rect, pl.x, pl.y)) caught(cfg.hazardText || 'Dẫm phải bẫy!');
    });

    // sự kiện
    (cfg.events || []).forEach(ev => {
      if (st.busy || st.events.has(ev.id) || !inRect(ev.rect, pl.x, pl.y)) return;
      st.events.add(ev.id); ev.el.classList.add('used');
      st.busy = true; hud.classList.add('busy'); pl.el.classList.remove('walking');
      runSteps(ev.on || []).then(() => { if (my !== session) return; hideText(); st.busy = false; hud.classList.remove('busy'); });
    });

    // đích
    if (goal.reach && !st.busy && inRect(goal.reach, pl.x, pl.y)) {
      const miss = (cfg.require || []).filter(r => !st.events.has(r));
      const keysOk = !goal.needKeys || keyIds.every(i => st.found.has(i));
      if (miss.length || !keysOk) { if (!st.warned) { st.warned = true; toast(cfg.requireText || goal.needText || 'Còn việc phải làm trước đã.', 'bad'); T(() => st.warned = false, 2500); } }
      else return finish();
    }

    // gợi ý tương tác & dấu hỏi
    const t = near();
    if (t) { const [x, y] = posOf(t); prompt.innerHTML = `<b class="kc">E</b> ${esc(t.label || (t.kind === 'npc' ? (CHARS[t.n.c] || {}).name : 'Xem'))}`; prompt.style.transform = `translate(calc(${x * TILE}em - 50%), calc(${(y - (t.kind === 'npc' ? 1.75 : .9)) * TILE}em))`; prompt.classList.add('on'); }
    else prompt.classList.remove('on');
    marks.forEach((m, tt) => { const [x, y] = posOf(tt); m.style.transform = `translate(calc(${x * TILE}em - 50%), calc(${(y - (tt.kind === 'npc' ? 1.85 : 1.05)) * TILE}em))`; m.classList.toggle('hide', tt === t); });
  }

  G.keyHandler = e => {
    if (st.busy) return false;
    const k = e.key.toLowerCase();
    if (k === 'e' || k === ' ' || k === 'enter') { tryInteract(); return true; }
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) return true;
  };
  WS.dbg = { inter, interact, finish, st, pl };
  requestAnimationFrame(frame);
});
