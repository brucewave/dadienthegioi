'use strict';
/* ==========================================================
   MINIGAMES
   deduce · memory · protect · timed  (màn đi lại top-down nằm ở world.js)
   ========================================================== */
const MINI = {};
const mini = () => $('#mini');
function T(fn, ms) { const t = setTimeout(() => { G.timers.delete(t); fn(); }, ms); G.timers.add(t); return t; }

/* ---------- 2. Suy luận: chọn đáp án / chọn nhiều manh mối ---------- */
MINI.deduce = cfg => new Promise(res => {
  hideText();
  const p = h('div', 'panel ded');
  const multi = Array.isArray(cfg.ans);
  p.innerHTML = `<div class="dtag">${ICON.svg('magnifier', 'hico')} SUY LUẬN</div><div class="dq">${esc(cfg.q)}</div>${multi ? `<div class="dsub">Chọn ${cfg.ans.length} đáp án</div>` : ''}<div class="dopts"></div>${multi ? '<button class="btn dconf" disabled>Xác nhận</button>' : ''}`;
  const sel = new Set(), opts = p.querySelector('.dopts');
  const finish = () => { SFX.ok(); p.classList.add('ok'); T(() => { p.remove(); res(); }, 750); };
  const wrong = () => { SFX.bad(); p.classList.remove('shakeit'); void p.offsetWidth; p.classList.add('shakeit'); toast((cfg.hint || 'Chưa đúng. Mở sổ tay (N) xem lại manh mối.'), 'bad'); };
  cfg.opts.forEach((t, i) => {
    const b = h('button', 'dopt', `<span class="k">${i + 1}</span>${esc(t)}`);
    b.onclick = () => {
      SFX.click();
      if (!multi) { if (i === cfg.ans) { b.classList.add('right'); finish(); } else { b.classList.add('wrongx'); wrong(); } return; }
      sel.has(i) ? sel.delete(i) : sel.add(i); b.classList.toggle('sel', sel.has(i));
      p.querySelector('.dconf').disabled = sel.size !== cfg.ans.length;
    };
    opts.append(b);
  });
  if (multi) p.querySelector('.dconf').onclick = () => {
    if (cfg.ans.every(a => sel.has(a))) finish();
    else { wrong(); sel.clear(); opts.querySelectorAll('.dopt').forEach(b => b.classList.remove('sel')); p.querySelector('.dconf').disabled = true; }
  };
  G.keyHandler = e => { const n = +e.key; const bs = opts.querySelectorAll('.dopt'); if (n >= 1 && n <= bs.length) { bs[n - 1].click(); return true; } if (e.key === 'Enter' && multi) { p.querySelector('.dconf').click(); return true; } };
  mini().append(p);
}).then(() => { G.keyHandler = null; });

/* ---------- 3. Ký ức: nhìn căn phòng cũ (bản đồ từ trên xuống), tìm điểm khác ---------- */
MINI.memory = cfg => new Promise(res => {
  hideText();
  const m = MAPS[cfg.map], H = m.tiles.length, Wd = m.tiles[0].length;
  const p = h('div', 'panel memory');
  p.innerHTML = `<div class="mhead"><b>${ICON.svg('brain', 'hico')} ${esc(cfg.title)}</b><span class="cnt"></span></div><div class="mroom"></div><div class="mbar"><i></i></div><div class="row mrow"></div>`;
  const roomEl = p.querySelector('.mroom'), cnt = p.querySelector('.cnt'), bar = p.querySelector('.mbar i'), row = p.querySelector('.mrow');
  const found = new Set(), ids = Object.keys(cfg.changes);
  const state = (o, phase) => phase === 'now' && cfg.changes[o.id] ? { ...o, ...cfg.changes[o.id] } : o;
  const draw = (phase) => {
    const props = cfg.objs.map(o => state(o, phase)).filter(o => !o.hidden);
    roomEl.innerHTML = ART.mapSvg({ ...m, props }, {});
    roomEl.classList.toggle('past', phase === 'past');
    if (phase !== 'now') return;
    cfg.objs.forEach(o0 => {
      const o = state(o0, 'now'); if (o.hidden) return;
      const d = h('div', 'mhit' + (found.has(o.id) ? ' found' : ''));
      Object.assign(d.style, { left: (o.x / Wd * 100) + '%', top: (o.y / H * 100) + '%', width: ((o.w || 1) / Wd * 100) + '%', height: ((o.h || 1) / H * 100) + '%' });
      d.title = o.label || '';
      d.onclick = () => {
        if (found.has(o.id)) return;
        if (cfg.changes[o.id]) { found.add(o.id); d.classList.add('found'); SFX.ok(); toast('✔ ' + (cfg.changes[o.id].note || 'Có gì đó đã thay đổi.'), 'clue'); upd(); }
        else { SFX.bad(); toast('Không, ' + (o.label || 'chỗ này') + ' vẫn y như hôm qua.', 'bad'); }
      };
      roomEl.append(d);
    });
  };
  const upd = () => { cnt.textContent = `Điểm bất thường: ${found.size}/${ids.length}`; if (found.size === ids.length) T(() => { p.remove(); res(); }, 900); };
  const showPast = (secs, then) => {
    draw('past'); cnt.textContent = 'Ký ức — tối hôm qua'; row.innerHTML = '';
    const b = h('button', 'btn', 'Mở mắt →'); b.onclick = () => { clearInterval(iv); then(); }; row.append(b);
    let left = secs * 10; bar.style.width = '100%';
    const iv = setInterval(() => { left--; bar.style.width = (left / (secs * 10) * 100) + '%'; if (left <= 0) { clearInterval(iv); then(); } }, 100); G.timers.add(iv);
  };
  const showNow = () => {
    draw('now'); bar.style.width = '0'; upd(); row.innerHTML = '';
    const b = h('button', 'btn ghost', '👁 Nhắm mắt nhớ lại'); b.onclick = () => showPast(4, showNow); row.append(b);
    if (!found.size) toast(cfg.prompt || 'Bấm vào những thứ đã khác so với ký ức.');
  };
  mini().append(p);
  showPast(cfg.study || 8, showNow);
});

/* ---------- 4. Bảo vệ hiện trường ---------- */
MINI.protect = cfg => new Promise(res => {
  hideText();
  const p = h('div', 'panel protect');
  const posts = [[90, 70], [710, 70], [710, 400], [90, 400]];
  const dots = [[262, 196], [335, 168], [440, 176], [540, 196], [572, 252], [526, 300], [400, 304], [272, 276]];
  p.innerHTML = `<div class="mhead"><b>${ICON.svg('tape', 'hico')} ${esc(cfg.title || 'Bảo vệ hiện trường')}</b><span class="cnt"></span></div>
   <div class="pwrap"><div class="tools"></div><svg viewBox="0 0 800 460" class="psvg">
    <rect width="800" height="460" fill="#DDBF8E"/>${Array.from({ length: 15 }, (_, i) => `<path d="M0 ${i * 32} H800" stroke="#B8956A" stroke-width="1.5"/>`).join('')}
    <g class="tape"></g>
    <g class="body" filter="url(#ink)">${ART.prop({ k: 'body', x: 7.6, y: 4.4, w: 11, h: 5.6, c: '#4E8C84', knife: true, seed: 4 })}</g>
    <polyline class="chal" points="" fill="none" stroke="#fff" stroke-width="5" stroke-linejoin="round" stroke-dasharray="2 0"/>
    <g class="knife"><path d="M630 340 L700 320 L702 328 L634 348Z" fill="#cfd6dd"/><rect x="600" y="336" width="34" height="14" rx="4" fill="#3a2a1a" transform="rotate(-16 617 343)"/></g>
    <g class="bag" opacity="0"><rect x="680" y="380" width="80" height="64" rx="6" fill="#d9e6ef" opacity=".7" stroke="#fff"/><text x="720" y="418" text-anchor="middle" font-size="14" fill="#123">TANG VẬT</text></g>
    <g class="posts"></g><g class="dots"></g></svg></div><div class="mhint"></div>`;
  const svg = p.querySelector('svg'), tools = p.querySelector('.tools'), hint = p.querySelector('.mhint'), cnt = p.querySelector('.cnt');
  const st = { tool: null, tape: 0, gloves: false, chalk: 0, bagged: false };
  const TOOLS = [['tape', 'tape', 'Dây phong tỏa'], ['gloves', 'gloves', 'Găng tay'], ['chalk', 'chalk', 'Phấn kẻ viền'], ['bag', 'bag', 'Túi tang vật']];
  const status = () => {
    const done = [st.tape === 4, st.gloves, st.chalk === 8, st.bagged];
    cnt.textContent = `${done.filter(Boolean).length}/4 việc`;
    tools.querySelectorAll('button').forEach((b, i) => b.classList.toggle('done', done[i]));
    hint.textContent = st.tape < 4 ? 'Việc đầu tiên khi tới hiện trường là gì?' : !st.gloves ? 'Trước khi chạm vào bất cứ thứ gì...' : st.chalk < 8 ? 'Đánh dấu vị trí thi thể, nối các điểm theo thứ tự.' : !st.bagged ? 'Thu giữ hung khí.' : 'Hoàn tất!';
    if (done.every(Boolean)) { SFX.ok(); T(() => { p.remove(); res(); }, 900); }
  };
  const nag = m => { SFX.bad(); toast(m, 'bad'); };
  TOOLS.forEach(([id, ic, nm]) => {
    const b = h('button', 'tool', `${ICON.svg(ic, 'tico')}<span>${nm}</span>`);
    b.onclick = () => {
      SFX.click();
      if (id !== 'tape' && st.tape < 4) return nag('Sai quy trình! Phải phong tỏa hiện trường trước đã.');
      if (id === 'gloves') { st.gloves = true; toast('Đã đeo găng tay.'); status(); return; }
      if ((id === 'chalk' || id === 'bag') && !st.gloves) return nag('Tay trần? Muốn để lại dấu vân tay của mình lên hiện trường à?');
      st.tool = id; tools.querySelectorAll('button').forEach(x => x.classList.toggle('sel', x === b));
      svg.classList.toggle('chalkmode', id === 'chalk');
    };
    tools.append(b);
  });
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  posts.forEach(([x, y], i) => {
    const g = mk('g', { class: 'post' }); g.append(mk('circle', { cx: x, cy: y, r: 20, fill: '#D9A93A', stroke: '#2B1F1A', 'stroke-width': 3 }));
    const tx = mk('text', { x, y: y + 6, 'text-anchor': 'middle', 'font-size': 18, fill: '#000', 'font-weight': 'bold' }); tx.textContent = i + 1; g.append(tx);
    g.onclick = () => {
      if (st.tool !== 'tape') return nag('Chọn dây phong tỏa trước.');
      if (i !== st.tape) return nag(`Giăng dây theo thứ tự, cọc số ${st.tape + 1}.`);
      st.tape++; g.classList.add('on'); SFX.click();
      const pts = posts.slice(0, st.tape).concat(st.tape === 4 ? [posts[0]] : []);
      p.querySelector('.tape').innerHTML = `<polyline points="${pts.map(q => q.join(',')).join(' ')}" fill="none" stroke="#f5c400" stroke-width="10" stroke-dasharray="26 14"/>`;
      status();
    };
    p.querySelector('.posts').append(g);
  });
  dots.forEach(([x, y], i) => {
    const g = mk('g', { class: 'dot' }); g.append(mk('circle', { cx: x, cy: y, r: 13, fill: '#fff', 'fill-opacity': .35, stroke: '#2B1F1A', 'stroke-width': 2 }));
    const tx = mk('text', { x, y: y + 5, 'text-anchor': 'middle', 'font-size': 13, fill: '#fff' }); tx.setAttribute('fill', '#2B1F1A'); tx.textContent = i + 1; g.append(tx);
    g.onclick = () => {
      if (st.tool !== 'chalk') return;
      if (i !== st.chalk) return nag(`Theo thứ tự, điểm số ${st.chalk + 1}.`);
      st.chalk++; g.classList.add('on'); SFX.click();
      const pts = dots.slice(0, st.chalk).concat(st.chalk === 8 ? [dots[0]] : []);
      p.querySelector('.chal').setAttribute('points', pts.map(q => q.join(',')).join(' '));
      status();
    };
    p.querySelector('.dots').append(g);
  });
  p.querySelector('.knife').onclick = () => {
    if (st.tool !== 'bag') return nag(st.gloves ? 'Dùng túi tang vật để thu giữ.' : 'Đeo găng đã!');
    st.bagged = true; SFX.click(); p.querySelector('.knife').style.transform = 'translate(70px,58px) scale(.5)'; p.querySelector('.knife').style.opacity = .6;
    p.querySelector('.bag').setAttribute('opacity', 1); status();
  };
  mini().append(p); status();
});

/* ---------- 6. Hành động theo thời gian (né, đánh, ra lệnh) ---------- */
MINI.timed = cfg => new Promise(res => {
  hideText();
  const p = h('div', 'panel timed');
  const maxMiss = cfg.maxMiss ?? 1;
  const vs = cfg.vs || [G.pov, null];
  autoMusic('action');
  p.innerHTML = `<div class="mhead"><b>${ICON.svg('fist', 'hico')} ${esc(cfg.title || 'Hành động')}</b><span class="hp"></span></div>
    ${vs[1] ? `<div class="tvs">${ART.chibi(vs[0], 'right')}<span class="vs">VS</span>${ART.chibi(vs[1], 'left')}</div>` : ''}
    <div class="ttell"></div><div class="tbar"><i></i></div><div class="topts"></div><div class="tres"></div>`;
  mini().append(p);
  const tell = p.querySelector('.ttell'), bar = p.querySelector('.tbar i'), opts = p.querySelector('.topts'), resEl = p.querySelector('.tres'), hp = p.querySelector('.hp');
  let i = 0, miss = 0, raf = null, answer = null;
  const hpDraw = () => { hp.innerHTML = Array.from({ length: maxMiss + 1 }, (_, k) => ICON.svg(k < maxMiss + 1 - miss ? 'heart' : 'heartEmpty', 'hpico')).join(''); };
  const AR = { '←': 'ArrowLeft', '→': 'ArrowRight', '↑': 'ArrowUp', '↓': 'ArrowDown' };
  const finish = (r) => { cancelAnimationFrame(raf); G.keyHandler = null; T(() => { p.remove(); autoMusic(); res(r); }, 400); };
  const round = () => {
    const r = cfg.rounds[i];
    tell.innerHTML = esc(r.tell); resEl.textContent = ''; resEl.className = 'tres'; opts.innerHTML = '';
    p.classList.remove('good', 'badr');
    let locked = false;
    r.opts.forEach((t, k) => {
      const AI = { '←': 'arrowL', '→': 'arrowR', '↑': 'arrowU', '↓': 'arrowD' };
      const b = h('button', 'topt', `<span class="k">${AR[t[0]] ? ICON.svg(AI[t[0]], 'kico') : k + 1}</span>${esc(AR[t[0]] ? t.slice(1).trim() || t : t)}`);
      b.onclick = () => pick(k); opts.append(b);
    });
    G.keyHandler = e => {
      const n = +e.key; if (n >= 1 && n <= r.opts.length) { pick(n - 1); return true; }
      const k = r.opts.findIndex(t => AR[t[0]] === e.key); if (k >= 0) { pick(k); return true; }
    };
    const t0 = performance.now(), dur = (r.time || cfg.time || 3) * 1000 * (G.flags.easy ? 1.6 : 1);
    const tick = (now) => { const f = 1 - (now - t0) / dur; bar.style.width = Math.max(0, f * 100) + '%'; if (f <= 0) pick(-1); else raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    function pick(k) {
      if (locked) return; locked = true; cancelAnimationFrame(raf); G.keyHandler = null;
      opts.querySelectorAll('button').forEach((b, j) => { b.disabled = true; if (j === k) b.classList.add('picked'); });
      if (r.disobey) { resEl.textContent = r.disobey; resEl.className = 'tres bad'; SFX.hit(); fx('shake'); return T(() => finish('disobey'), 2200); }
      if (k === r.ans) {
        SFX.ok(); p.classList.add('good'); resEl.textContent = r.ok || 'Thành công!'; resEl.className = 'tres ok';
        i++; T(() => i >= cfg.rounds.length ? finish('win') : round(), 900);
      } else {
        miss++; hpDraw(); SFX.hit(); fx('shake'); p.classList.add('badr');
        resEl.textContent = k < 0 ? (r.late || 'Chậm quá!') : (r.bad || 'Sai rồi!'); resEl.className = 'tres bad';
        if (miss > maxMiss) {
          if (cfg.noRetry) return T(() => finish('lose'), 1200);
          T(() => { resEl.textContent = cfg.fail || 'Thất bại... thử lại!'; }, 900);
          T(() => { i = 0; miss = 0; hpDraw(); round(); }, 2200);
        } else T(() => { i++; i >= cfg.rounds.length ? finish('win') : round(); }, 1100);
      }
    }
  };
  hpDraw();
  tell.textContent = cfg.intro || 'Chuẩn bị...';
  T(round, G.skip ? 200 : 1200);
});
