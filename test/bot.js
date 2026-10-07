'use strict';
/* ==========================================================
   BOT TỰ CHƠI — dò lỗi toàn bộ game
   Mở:  index.html?bot            chơi lần lượt cả 8 chương
        index.html?bot=c5         chỉ chơi chương 5
        index.html?bot&pick=last  luôn chọn đáp án cuối ở các lựa chọn
   Kết quả: bảng góc trái trên + window.BOT.report (console: BOT.report)
   Bot dùng UI thật (bấm nút, gọi WS.dbg của màn đi lại) nên lỗi trong
   minigame / kịch bản / đoạn kết 3D đều lộ ra.
   ========================================================== */
const BOT = (() => {
  const q = new URLSearchParams(location.search);
  const only = q.get('bot'), pickArg = q.get('pick');
  let pick = pickArg || 'first';
  const R = { errors: [], warns: [], chapters: [], ends: [], scenes: new Set(), games: {}, started: Date.now() };
  const cfgs = {};
  const sleepB = ms => new Promise(r => setTimeout(r, ms));
  const log = (k, m) => { (k === 'err' ? R.errors : R.warns).push(`[${G.scene || '-'}] ${m}`); draw(); };

  // bắt lỗi
  addEventListener('error', e => log('err', (e.message || 'error') + (e.filename ? ` @ ${e.filename.split('/').pop()}:${e.lineno}` : '')));
  addEventListener('unhandledrejection', e => log('err', 'Promise: ' + (e.reason && (e.reason.stack || e.reason.message) || e.reason)));
  const ce = console.error; console.error = (...a) => { log('err', a.join(' ')); ce.apply(console, a); };

  // ghi lại cfg của từng minigame để biết đáp án đúng
  for (const k of Object.keys(MINI)) {
    const f = MINI[k];
    MINI[k] = cfg => { cfgs[k] = cfg; cfgs.cur = k; R.games[k] = (R.games[k] || 0) + 1; return f(cfg); };
  }

  // bảng kết quả
  const box = document.createElement('pre');
  box.style.cssText = 'position:fixed;left:6px;top:6px;z-index:99999;max-width:46vw;max-height:60vh;overflow:auto;margin:0;padding:8px 10px;font:12px/1.35 monospace;background:rgba(0,0,0,.82);color:#cfe;border-radius:6px;white-space:pre-wrap;pointer-events:none';
  document.body.append(box);
  function draw(state) {
    box.textContent = `BOT ${state || ''}\ncảnh: ${G.scene || '-'}  ·  đã qua ${R.scenes.size} cảnh  ·  ${((Date.now() - R.started) / 1000) | 0}s\n` +
      `minigame: ${Object.entries(R.games).map(([k, v]) => k + '×' + v).join(' ')}\n` +
      `chương xong: ${R.chapters.join(', ') || '-'}\nkết thúc: ${R.ends.join(' | ') || '-'}\n` +
      `LỖI (${R.errors.length}):\n${R.errors.slice(-12).join('\n') || '  không có'}\n` + (R.warns.length ? `CẢNH BÁO (${R.warns.length}):\n${R.warns.slice(-8).join('\n')}` : '');
    box.style.color = R.errors.length ? '#fbb' : '#cfe';
  }

  const C = el => el && el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  const vis = sel => { const e = $(sel); return e && e.offsetParent !== null ? e : null; };

  /* --- giải từng loại minigame --- */
  async function solveDeduce() {
    const cfg = cfgs.deduce, bs = [...document.querySelectorAll('.ded .dopt')]; if (!bs.length) return;
    if (Array.isArray(cfg.ans)) { cfg.ans.forEach(i => C(bs[i])); await sleepB(80); C($('.ded .dconf')); }
    else C(bs[cfg.ans]);
    await sleepB(900);
  }
  async function solveMemory() {
    const cfg = cfgs.memory, p = $('.memory');
    const open = [...p.querySelectorAll('.mrow .btn')].find(b => /Mở mắt/.test(b.textContent)); if (open) { C(open); await sleepB(150); }
    const objs = cfg.objs.map(o => (cfg.changes[o.id] ? { ...o, ...cfg.changes[o.id] } : o)).filter(o => !o.hidden);
    const hits = [...p.querySelectorAll('.mhit')];
    objs.forEach((o, i) => { if (cfg.changes[o.id] && hits[i] && !hits[i].classList.contains('found')) C(hits[i]); });
    await sleepB(1200);
  }
  async function solveProtect() {
    const p = $('.protect'), tb = [...p.querySelectorAll('.tool')];
    C(tb[0]); p.querySelectorAll('.post').forEach(C); C(tb[1]); C(tb[2]);
    await sleepB(100); p.querySelectorAll('.dot').forEach(C);
    C(tb[3]); C(p.querySelector('.knife'));
    await sleepB(1300);
    if ($('.protect')) log('err', 'protect: không hoàn tất được (' + $('.protect .cnt').textContent + ')');
  }
  async function solveTimed() {
    const cfg = cfgs.timed, p = $('.timed'); if (!p) return;
    const tell = p.querySelector('.ttell').textContent, r = cfg.rounds.find(x => x.tell === tell);
    const bs = [...p.querySelectorAll('.topt:not([disabled])')];
    if (r && bs.length && !bs.some(b => b.disabled)) { C(bs[r.ans]); await sleepB(300); }
  }
  // màn đi lại: mỗi nhịp làm MỘT việc, hội thoại phát sinh để vòng lặp chính bấm tiếp
  function worldStep() {
    const cfg = cfgs.world, d = WS.dbg, goal = cfg.goal || {};
    const b = d._bot || (d._bot = { used: new Set(), n: 0, reach: 0, wait: 0 });
    const fin = t => t.finish || (t.kind === 'npc' && t.n.finish);
    const go = (x, y) => { d.pl.x = x; d.pl.y = y; placeEnt(d.pl); };
    const t = d.inter().find(t => !fin(t) && !b.used.has(t));
    if (t) { b.used.add(t); d.interact(t); return; }
    const ev = (cfg.events || []).find(ev => !d.st.events.has(ev.id) && !b.used.has(ev));
    if (ev) { b.used.add(ev); go(ev.rect[0] + ev.rect[2] / 2, ev.rect[1] + ev.rect[3] / 2); return; }
    if (goal.catch && b.n < (goal.need || 3) * 8) { const cat = WS.ents.find(e => e.n && e.n.c === goal.catch); if (cat) { b.n++; go(cat.x, cat.y); return; } }
    const f = d.inter().find(t => fin(t) && !b.used.has(t));
    if (f) { b.used.add(f); d.interact(f); return; }
    if (goal.reach && b.reach < 6) { b.reach++; go(goal.reach[0] + goal.reach[2] / 2, goal.reach[1] + goal.reach[3] / 2); return; }
    if (!b.clicked) { b.clicked = 1; const bt = $('.whud .wdone'); if (bt) C(bt); return; }
    if (++b.wait > 20) { log('warn', `world "${cfg.title}": không tự xong được → bỏ qua màn`); d.finish(); }
  }

  /* --- vòng lặp chính: đọc màn hình và bấm thứ phù hợp --- */
  let lastSig = '', lastT = Date.now(), busy = false;
  async function tick(stopAt) {
    if (busy) return; busy = true;
    try {
      G.skip = true;
      if (G.scene) R.scenes.add(G.scene);
      const ov = $('#overlay');
      if (ov.classList.contains('on') && ov.querySelector('.endbox')) return 'end';
      if (vis('#choices.on')) {
        const bs = [...$('#choices').querySelectorAll('button')];
        if (bs.length) C(pick === 'last' ? bs[bs.length - 1] : bs[0]);
      } else if ($('#card').classList.contains('on')) advance();
      else if ($('.ded')) await solveDeduce();
      else if ($('.memory')) await solveMemory();
      else if ($('.protect')) await solveProtect();
      else if ($('.timed')) await solveTimed();
      else if (!$('#textbox').classList.contains('hidden')) advance();
      else if ($('.whud') && WS && WS.dbg && !WS.dbg.st.busy && !WS.dbg.st.done) worldStep();
      else advance();
      if (stopAt && stopAt()) return 'next';
      // phát hiện kẹt
      const sig = G.scene + '|' + $('#text').textContent + '|' + ($('#mini').innerHTML.length) + '|' + $('#card').className;
      if (sig !== lastSig) { lastSig = sig; lastT = Date.now(); }
      else if (Date.now() - lastT > 25000) { log('err', `KẸT >25s ở "${G.scene}" — text: ${$('#text').textContent.slice(0, 60)}`); lastT = Date.now(); return 'stuck'; }
    } catch (e) { log('err', 'bot: ' + (e.stack || e)); }
    finally { busy = false; }
  }
  // chơi 1 chương; lạc vào kết thúc phụ thì chơi lại với cách chọn khác
  async function runChapter(i) {
    const ch = CHAPTERS[i], next = CHAPTERS[i + 1];
    for (const how of pickArg ? [pickArg] : ['first', 'last']) {
      pick = how;
      const r = await playOnce(ch, next);
      if (r !== 'alt') return;
      if (how !== 'last' && !pickArg) R.warns.push(`[${ch.id}] chọn "${how}" → kết thúc phụ, chơi lại với "last"`);
    }
    log('err', `${ch.id}: không tới được kết thúc chính / chương sau`);
  }
  async function playOnce(ch, next) {
    draw(`▶ ${ch.num} (chọn ${pick})`);
    play(ch.scene, { flags: {}, clues: {}, pov: null, chapter: '' });
    await sleepB(300);
    const stopAt = next ? () => G.scene && G.scene.startsWith(next.id + '_') : null;
    for (;;) {
      const r = await tick(stopAt);
      if (r === 'next') { R.chapters.push(ch.id); return 'ok'; }
      if (r === 'stuck') return 'stuck';
      if (r === 'end') {
        const e = $('#overlay .endbox'), tag = e.querySelector('.etag').textContent;
        R.ends.push(`${ch.id}: ${tag} — ${e.querySelector('h2').textContent}`);
        const main = tag === 'KẾT THÚC';
        if (main) R.chapters.push(ch.id);
        if (!main || ch !== CHAPTERS[CHAPTERS.length - 1]) $('#overlay').className = '';
        return main ? 'ok' : 'alt';
      }
      await sleepB(40);
    }
  }
  async function run() {
    await sleepB(600);
    const list = CHAPTERS.map((c, i) => i).filter(i => !only || only === '1' || only === '' || CHAPTERS[i].id === only);
    for (const i of list) await runChapter(i);
    R.done = true; G.skip = false;
    const ok = R.chapters.length === list.length && !R.errors.length;
    draw(ok ? `✔ XONG — ${R.chapters.length}/${list.length} chương qua, 0 lỗi` : `✘ XONG — ${R.chapters.length}/${list.length} chương qua, ${R.errors.length} lỗi`);
    console.log('BOT REPORT', JSON.stringify({ ...R, scenes: [...R.scenes] }, null, 1));
  }
  run();
  return { get report() { return { ...R, scenes: [...R.scenes] }; } };
})();
