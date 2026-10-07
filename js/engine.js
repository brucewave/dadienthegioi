'use strict';
/* ==========================================================
   ENGINE — chạy kịch bản, lời thoại, lựa chọn, lưu game
   ========================================================== */
const $ = (s, r = document) => r.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function h(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

const SAVE_KEY = 'ddtg_save_v1', OPT_KEY = 'ddtg_opt_v1', UNLOCK_KEY = 'ddtg_unlock_v1';
const G = { flags: {}, clues: {}, scene: null, pov: null, log: [], cast: [], bgKey: null, bgOpt: {}, snap: null, keyHandler: null, timers: new Set(), skip: false, chapter: '' };
const SET = { speed: 26, music: .55, sfx: .8 };
let adv = null;            // hàm "đi tiếp" của dòng thoại hiện tại
let typer = null;          // interval đánh chữ

function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
function load(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
Object.assign(SET, load(OPT_KEY, {}));

/* ---------- Âm thanh: chuyển sang AUDIO (js/audio.js) ---------- */
function tone() { }
const SFX = new Proxy({}, { get: (_, name) => () => AUDIO.sfx(name) });


/* ---------- Khung hình 16:9 ---------- */
const stage = () => $('#stage');
function fit() {
  const W = innerWidth, H = innerHeight, w = Math.min(W, H * 16 / 9), hh = w * 9 / 16;
  const s = stage(); s.style.width = w + 'px'; s.style.height = hh + 'px'; s.style.fontSize = (w / 64) + 'px'; s.style.setProperty('--u', (w / 64) + 'px');
  $('#rotate').classList.toggle('on', W < H && W < 700);
}
addEventListener('resize', fit);
if (window.ResizeObserver) new ResizeObserver(() => fit()).observe(document.documentElement);

/* ---------- Phông, nhân vật, hiệu ứng ---------- */
function setBg(key, opt = {}) {
  if (typeof DIM3D !== 'undefined') DIM3D.exit();
  G.bgKey = key; G.bgOpt = opt;
  sceneBg(key, opt);
  G.musicLock = null; autoMusic();
  const w = $('#world'); w.classList.remove('fadein'); void w.offsetWidth; w.classList.add('fadein');
  const fx = $('#weather'); fx.className = ''; if (opt.rain) fx.classList.add('rain'); if (opt.fire || key === 'fire') fx.classList.add('fire'); if (opt.smoke) fx.classList.add('smoke');
}
function setCast(list) { G.cast = list || []; sceneCast(G.cast); }
function highlight(spk) { sceneTalk(spk); }
async function fx(name) {
  const s = stage();
  if (name === 'shake') { s.classList.remove('shake'); void s.offsetWidth; s.classList.add('shake'); SFX.hit(); return; }
  if (name === 'flash' || name === 'redflash') {
    const f = h('div', 'flash' + (name === 'redflash' ? ' red' : '')); s.append(f); setTimeout(() => f.remove(), 700);
    if (name === 'redflash') SFX.hit(); return;
  }
  if (name === 'glitch') { s.classList.add('glitch'); AUDIO.sfx('glitch'); await sleep(900); s.classList.remove('glitch'); return; }
  if (name === 'blackout') { const f = h('div', 'blackout'); s.append(f); await sleep(1300); f.remove(); return; }
  if (name === 'boom') { SFX.boom(); return fx('shake'); }
}
function toast(msg, cls = '') {
  const t = h('div', 'toast ' + cls, msg); $('#toasts').append(t);
  setTimeout(() => t.classList.add('out'), 2600); setTimeout(() => t.remove(), 3200);
}
function clueIcon(c) { return c.icon || ICON.CLUE[c.id] || 'magnifier'; }
function addClue(c) {
  if (G.clues[c.id]) return;
  G.clues[c.id] = { name: c.name, desc: c.desc, chap: G.chapter, icon: clueIcon(c) };
  SFX.clue();
  const k = h('div', 'cluecard', `<div class="ccimg">${ICON.svg(clueIcon(c))}</div><div><small>MANH MỐI MỚI</small><b>${esc(c.name)}</b><span>Đã ghi vào sổ tay (N)</span></div>`);
  $('#toasts').append(k);
  setTimeout(() => k.classList.add('out'), 3000); setTimeout(() => k.remove(), 3600);
  const nb = $('#btnNote'); nb.classList.remove('ping'); void nb.offsetWidth; nb.classList.add('ping');
}

/* ---------- Lời thoại ---------- */
function parseLine(s) {
  if (s.startsWith('*')) { const m = s.match(/^\*\[([a-z]+)\]\s*([\s\S]*)$/); return m ? { s: 'think', e: m[1], t: m[2] } : { s: 'think', t: s.slice(1).trim() }; }
  const m = s.match(/^([a-z]+)(?:\[([a-z]+)\])?:\s*([\s\S]*)$/);
  if (m && CHARS[m[1]]) return { s: m[1], e: m[2], t: m[3] };
  return { s: null, t: s };
}
/* đoán cảm xúc khi câu thoại không ghi rõ */
function autoEmo(t) {
  const x = t.trim(), low = x.toLowerCase();
  const caps = x.split(/[\s,.!?…]+/).some(w => w.length >= 3 && w === w.toUpperCase() && w !== w.toLowerCase());
  if (/\?!|!\?/.test(x) || /^(hả|ơ|khoan|cái gì|á!|á )/.test(low)) return 'surprised';
  if (caps || /câm miệng|thằng |mày |chết tiệt|tên khốn|đồ ngu|thằng ngu/.test(low)) return 'angry';
  if (/hì|ha ha|vui ghê|cười|toe toét/.test(low)) return 'happy';
  if (/cảm ơn|tốt lắm|giỏi lắm/.test(low)) return 'smile';
  if (/xin lỗi|hối hận|thương lắm|tội nghiệp/.test(low)) return 'sad';
  if (/^\.\.\./.test(x) || /\?$/.test(x)) return 'think';
  return 'neutral';
}
function hideText() { $('#textbox').classList.add('hidden'); }
function say(spk, text, emo) {
  const tb = $('#textbox'), np = $('#nameplate'), tx = $('#text');
  tb.classList.remove('hidden');
  tb.classList.toggle('thought', spk === 'think');
  tb.classList.toggle('narr', !spk);
  const c = spk && spk !== 'think' ? CHARS[spk] : null;
  if (c) { np.textContent = c.name; np.style.setProperty('--c', c.color); np.style.display = ''; }
  else if (spk === 'think') { const p = CHARS[G.pov]; np.textContent = (p ? p.name : '') + ' · suy nghĩ'; np.style.setProperty('--c', p ? p.color : '#888'); np.style.display = ''; }
  else np.style.display = 'none';
  const pk = c ? spk : spk === 'think' ? G.pov : null, pt = $('#portrait');
  const em = pk ? (emo || autoEmo(text)) : 'neutral';
  if (pk && CHARS[pk]) {
    const sig = pk + '|' + em;
    if (pt.dataset.k !== sig) { pt.innerHTML = `<div class="pframe">${ART.chibi(pk, 'down', { bust: true, emo: em })}</div>`; pt.dataset.k = sig; pt.style.setProperty('--pc', CHARS[pk].color); pt.classList.remove('pop'); void pt.offsetWidth; pt.classList.add('pop'); }
    tb.classList.add('withp');
  }
  else { tb.classList.remove('withp'); pt.dataset.k = ''; pt.innerHTML = ''; }
  sceneTalk(spk === 'think' ? null : spk, em);
  if (spk === 've' && !G.skip) AUDIO.sfx('meow');
  G.log.push({ n: c ? c.name : spk === 'think' ? '(nghĩ)' : '', t: text }); if (G.log.length > 300) G.log.shift();
  $('#next').classList.remove('on');
  return new Promise(res => {
    let i = 0, done = false;
    clearInterval(typer);
    const full = () => { clearInterval(typer); tx.textContent = text; done = true; $('#next').classList.add('on'); if (G.skip) setTimeout(() => adv && adv(), 60); };
    adv = () => { if (!done) full(); else { adv = null; $('#next').classList.remove('on'); res(); } };
    tx.textContent = '';
    if (SET.speed <= 0 || G.skip) full();
    else typer = setInterval(() => { i += 1; tx.textContent = text.slice(0, i); if (i % 3 === 0) SFX.blip(); if (i >= text.length) full(); }, SET.speed);
  });
}
function advance() { if (adv) adv(); }

/* ---------- Lựa chọn ---------- */
function cond(c) {
  if (typeof c === 'function') return !!c(G);
  if (typeof c === 'string') return c[0] === '!' ? !G.flags[c.slice(1)] : !!G.flags[c];
  return true;
}
function choose(list) {
  G.skip = false; $('#btnSkip').classList.remove('on');
  hideText();
  return new Promise(res => {
    const box = $('#choices'); box.innerHTML = ''; box.classList.add('on');
    list.filter(o => !o.if || cond(o.if)).forEach((o, i) => {
      const b = h('button', 'choice', `<span class="k">${i + 1}</span>${esc(o.t)}`); b.dataset.noadv = 1;
      b.onmouseenter = () => AUDIO.sfx('hover');
      b.onclick = e => { e.stopPropagation(); SFX.click(); box.classList.remove('on'); box.innerHTML = ''; G.keyHandler = null; res(o); };
      box.append(b);
    });
    G.keyHandler = e => { const n = +e.key; const bs = box.querySelectorAll('button'); if (n >= 1 && n <= bs.length) { bs[n - 1].click(); return true; } };
  });
}
async function doAsk(st) {
  const asked = new Set();
  while (true) {
    const avail = st.ask.map((o, i) => ({ ...o, i })).filter(o => !asked.has(o.i) && (!o.if || cond(o.if)));
    const need = st.need === 'all' ? st.ask.length : (st.need || 0);
    const met = asked.size >= need;
    if (met && !st.exit) break;
    const list = avail.map(o => ({ t: o.t, i: o.i }));
    if (met && st.exit) list.push({ t: st.exit, exit: true });
    if (!list.length) break;
    const o = await choose(list);
    if (o.exit) break;
    asked.add(o.i);
    const r = await runSteps(st.ask[o.i].steps || []); if (r) return r;
  }
}

/* ---------- Thẻ chương / ngày / chữ lớn ---------- */
function card(html, cls, auto) {
  hideText();
  return new Promise(res => {
    const c = $('#card'); c.className = 'on ' + (cls || ''); c.innerHTML = html;
    let t;
    const close = () => { clearTimeout(t); adv = null; c.className = ''; setTimeout(res, 350); };
    adv = close; if (auto) t = setTimeout(close, G.skip ? 300 : auto);
  });
}

/* ---------- Chạy bước kịch bản ---------- */
async function runSteps(steps) {
  for (const st of steps) { const r = await runStep(st); if (r && (r.go || r.end)) return r; }
}
async function runStep(st) {
  if (typeof st === 'string') { const p = parseLine(st); await say(p.s, p.t, p.e); return; }
  if (typeof st === 'function') return st(G);
  if (st.if !== undefined && !cond(st.if)) return;
  if (st.pov) G.pov = st.pov;
  if (st.set) Object.assign(G.flags, st.set);
  if (st.bg) setBg(st.bg, st.o || {});
  if (st.music !== undefined) { G.musicLock = st.music === 'auto' ? null : (st.music || 'none'); autoMusic(); }
  if (st.cast !== undefined) setCast(st.cast);
  if (st.clue) addClue(st.clue);
  if (st.fx) await fx(st.fx);
  if (st.chap) { G.chapter = st.chap; AUDIO.sfx('gong'); await card(`<div class="cnum">${esc(st.chap)}</div><div class="ctitle">${esc(st.title || '')}</div><div class="chint">nhấn để tiếp tục</div>`, 'chapter'); }
  if (st.date) { AUDIO.sfx('page'); } if (st.date) await card(`<div class="date">${esc(st.date)}</div>`, 'datecard', 2200);
  if (st.big) { AUDIO.sfx('whoosh'); } if (st.big) await card(`<div class="big">${esc(st.big)}</div>`, 'bigcard', st.auto || 2400);
  if (st.wait) await sleep(G.skip ? 50 : st.wait);
  if (st.t !== undefined) await say(st.s || null, st.t, st.e);
  if (st.unlock) unlock(st.unlock);
  if (st.choice) {
    const o = await choose(st.choice);
    if (o.set) Object.assign(G.flags, o.set);
    if (o.steps) { const r = await runSteps(o.steps); if (r) return r; }
    if (o.go) return { go: o.go };
  }
  if (st.ask) { const r = await doAsk(st); if (r) return r; }
  if (st.game) { const r = await MINI[st.game](st); if (r && r.go) return r; }
  if (st.end) return { end: st };
  if (st.go) return { go: st.go };
}

/* ---------- Vòng chơi, lưu, mở khóa chương ---------- */
let session = 0;
function resetStage() {
  session++;
  if (typeof DIM3D !== 'undefined') DIM3D.exit();
  clearInterval(typer); adv = null; G.keyHandler = null; G.skip = false;
  G.timers.forEach(t => { clearTimeout(t); clearInterval(t); cancelAnimationFrame(t); }); G.timers.clear();
  $('#mini').innerHTML = ''; $('#choices').innerHTML = ''; $('#choices').classList.remove('on'); $('#card').className = '';
  hideText(); $('#btnSkip').classList.remove('on');
}
function snapshot() { return JSON.parse(JSON.stringify({ flags: G.flags, clues: G.clues, pov: G.pov, chapter: G.chapter })); }
function save() { store(SAVE_KEY, { scene: G.scene, ...G.snap }); }
function unlock(id) { const u = load(UNLOCK_KEY, ['c1']); if (!u.includes(id)) { u.push(id); store(UNLOCK_KEY, u); } }

async function play(id, restore) {
  resetStage(); const my = session;
  $('#title').classList.remove('on'); $('#hud').classList.add('on');
  if (restore) Object.assign(G, JSON.parse(JSON.stringify(restore)));
  while (id && my === session) {
    if (!SCENES[id]) { console.error('Thiếu cảnh', id); return; }
    G.scene = id; G.snap = snapshot(); save();
    const r = await runSteps(SCENES[id]);
    if (my !== session) return;
    if (r && r.end) return endScreen(r.end);
    id = r && r.go;
  }
}
function endScreen(e) {
  hideText(); G.skip = false;
  const o = $('#overlay'); o.className = 'on end ' + (e.kind || 'bad');
  AUDIO.sfx(e.kind === 'true' ? 'gong' : 'bad'); AUDIO.music(e.kind === 'true' ? 'eerie' : 'sad');
  o.innerHTML = `<div class="endbox"><div class="etag">${e.kind === 'true' ? 'KẾT THÚC' : 'KẾT THÚC KHÁC'}</div><h2>${esc(e.end)}</h2><p>${esc(e.text || '')}</p>
    <div class="row">${e.kind === 'true' ? '' : `<button class="btn" id="eRetry">${ICON.svg('retry', 'bico')}Chọn lại</button>`}<button class="btn ghost" id="eMenu">${ICON.svg('home', 'bico')}Về màn hình chính</button></div></div>`;
  const back = G.scene, snap = G.snap;
  if ($('#eRetry')) $('#eRetry').onclick = () => { o.className = ''; play(e.retry || back, snap); };
  $('#eMenu').onclick = () => { o.className = ''; showTitle(); };
}

/* ---------- Bảng phụ: sổ tay, nhật ký, cài đặt ---------- */
function panel(title, body) {
  const o = $('#overlay'); o.className = 'on';
  o.innerHTML = `<div class="pbox"><div class="phead"><b>${title}</b><button class="x" id="pClose">${ICON.svg('cross', 'bico')}</button></div><div class="pbody">${body}</div></div>`;
  $('#pClose').onclick = closePanel;
}
function closePanel() { $('#overlay').className = ''; $('#overlay').innerHTML = ''; }
function showNotebook() {
  AUDIO.sfx('page');
  const list = Object.values(G.clues);
  panel(ICON.svg('notebook', 'hico') + ' Sổ tay manh mối', list.length ? `<div class="cgrid">${list.slice().reverse().map(c => `<div class="clue"><div class="cimg">${ICON.svg(c.icon || 'magnifier')}</div><div><b>${esc(c.name)}</b><small>${esc(c.chap || '')}</small><p>${esc(c.desc)}</p></div></div>`).join('')}</div>` : '<p class="muted">Chưa có manh mối nào.</p>');
}
function showLog() {
  AUDIO.sfx('page');
  panel(ICON.svg('scroll', 'hico') + ' Lịch sử hội thoại', G.log.slice(-120).map(l => `<div class="logl">${l.n ? `<b>${esc(l.n)}</b>` : ''}<span>${esc(l.t)}</span></div>`).join('') || '<p class="muted">Trống.</p>');
  const b = $('.pbody'); b.scrollTop = b.scrollHeight;
}
function showSettings() {
  AUDIO.sfx('page');
  panel(ICON.svg('gear', 'hico') + ' Cài đặt', `<label class="opt">Tốc độ chữ <select id="sSpeed"><option value="45">Chậm</option><option value="26">Vừa</option><option value="12">Nhanh</option><option value="0">Hiện ngay</option></select></label>
    <label class="opt">${ICON.svg('note', 'hico')} Nhạc nền <input type="range" id="sMusic" min="0" max="1" step=".05" value="${SET.music}"></label>
    <label class="opt">${ICON.svg('sound', 'hico')} Hiệu ứng âm thanh <input type="range" id="sSfx" min="0" max="1" step=".05" value="${SET.sfx}"></label>
    <p class="muted">Phím tắt: <b>Space/Enter</b> đọc tiếp · <b>1–4</b> chọn · <b>Ctrl</b> giữ để tua · <b>N</b> sổ tay · <b>L</b> lịch sử · <b>Esc</b> đóng bảng.<br>Lén lút: <b>mũi tên / WASD</b> di chuyển, <b>Space</b> đứng yên.</p>
    ${$('#title').classList.contains('on') ? '' : '<div class="row"><button class="btn ghost" id="sMenu">Về màn hình chính</button></div>'}`);
  $('#sSpeed').value = String(SET.speed);
  $('#sSpeed').onchange = e => { SET.speed = +e.target.value; store(OPT_KEY, SET); };
  $('#sMusic').oninput = e => { SET.music = +e.target.value; AUDIO.setVol('music', SET.music); store(OPT_KEY, SET); };
  $('#sSfx').oninput = e => { SET.sfx = +e.target.value; AUDIO.setVol('sfx', SET.sfx); AUDIO.sfx('click'); store(OPT_KEY, SET); };
  if ($('#sMenu')) $('#sMenu').onclick = () => { closePanel(); showTitle(); };
}

/* ---------- Màn hình chính ---------- */
function showTitle() {
  resetStage(); G.cast = []; setBg('void'); $('#hud').classList.remove('on'); AUDIO.music('title'); AUDIO.ambience({});
  $('#tLine').innerHTML = [['tu', 'smug'], ['quanly', 'sad'], ['lieng', 'angry'], ['binh', 'happy'], ['bac', 'neutral'], ['ve', 'happy'], ['x', 'angry']].map(([k, e], i) => `<div class="tchar" style="animation-delay:${i * -.4}s">${ART.chibi(k, 'down', { emo: e })}</div>`).join('');
  const t = $('#title'); t.classList.add('on');
  const sv = load(SAVE_KEY, null);
  $('#tContinue').disabled = !sv;
  const u = load(UNLOCK_KEY, ['c1']);
  $('#tChapters').innerHTML = CHAPTERS.map(c => `<button class="chbtn" ${u.includes(c.id) ? '' : 'disabled'} data-s="${c.scene}"><b>${esc(c.num)}</b><span>${u.includes(c.id) ? esc(c.name) : '???'}</span></button>`).join('');
  $('#tChapters').querySelectorAll('button').forEach(b => b.onclick = () => { G.log = []; play(b.dataset.s, { flags: {}, clues: {}, pov: null, chapter: '' }); });
}

/* ---------- Khởi động ---------- */
function boot() {
  fit();
  const st = stage();
  st.addEventListener('click', e => { if (e.target.closest('[data-noadv],#hud,#overlay,#title,#mini .panel,#mini .inv .hot,.whud')) return; advance(); });
  addEventListener('keydown', e => {
    if (e.key === 'Escape') { if ($('#overlay').classList.contains('on') && !$('#overlay').classList.contains('end')) closePanel(); return; }
    if ($('#overlay').classList.contains('on') || $('#title').classList.contains('on')) return;
    if (e.key === 'Control') { G.skip = true; $('#btnSkip').classList.add('on'); advance(); return; }
    if (G.keyHandler && G.keyHandler(e)) { e.preventDefault(); return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); advance(); }
    if (e.key === 'n' || e.key === 'N') showNotebook();
    if (e.key === 'l' || e.key === 'L') showLog();
  });
  addEventListener('keyup', e => { if (e.key === 'Control') { G.skip = false; $('#btnSkip').classList.remove('on'); } });
  AUDIO.setVol('music', SET.music); AUDIO.setVol('sfx', SET.sfx);
  const mute = $('#btnMute'), updMute = () => { const off = SET.music === 0 && SET.sfx === 0; mute.innerHTML = ICON.svg(off ? 'mute' : 'sound', 'bico'); mute.classList.toggle('on', off); };
  mute.onclick = () => { if (SET.music === 0 && SET.sfx === 0) { SET.music = SET._m ?? .55; SET.sfx = SET._s ?? .8; } else { SET._m = SET.music; SET._s = SET.sfx; SET.music = 0; SET.sfx = 0; } AUDIO.setVol('music', SET.music); AUDIO.setVol('sfx', SET.sfx); store(OPT_KEY, SET); updMute(); };
  updMute();
  document.addEventListener('mouseover', e => { const b = e.target.closest && e.target.closest('.btn,.dopt,.topt,.tool,.hbtn,.chbtn'); if (b && b !== G._hov) { G._hov = b; AUDIO.sfx('hover'); } });
  document.addEventListener('click', e => { if (e.target.closest && e.target.closest('.btn,.dopt,.topt,.tool,.hbtn,.chbtn')) AUDIO.sfx('click'); }, true);
  $('#btnNote').onclick = showNotebook; $('#btnLog').onclick = showLog; $('#btnSet').onclick = showSettings;
  $('#btnSkip').onclick = () => { G.skip = !G.skip; $('#btnSkip').classList.toggle('on', G.skip); if (G.skip) advance(); };
  $('#tNew').onclick = () => { G.log = []; play(CHAPTERS[0].scene, { flags: {}, clues: {}, pov: null, chapter: '' }); };
  $('#tContinue').onclick = () => { const sv = load(SAVE_KEY, null); if (sv) { G.log = []; play(sv.scene, { flags: sv.flags || {}, clues: sv.clues || {}, pov: sv.pov, chapter: sv.chapter || '' }); } };
  $('#tSettings').onclick = showSettings;
  showTitle();
}
addEventListener('DOMContentLoaded', boot);
