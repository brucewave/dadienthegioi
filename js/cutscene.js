'use strict';
/* ==========================================================
   CUTSCENE — đoạn phim minh họa lúc kể chuyện
   Trong kịch bản:
     { cut: [
         { img: 'street', o: { time: 'dawn' },        // tranh (js/cutart.js) + tùy chọn
           cam: [[x, y, zoom], [x, y, zoom]], t: 12,   // máy quay trượt từ A → B trong t giây
           tr: 'fade' | 'cut' | 'flash' | 'glitch' | 'black',
           hold: 900,                                  // ms ngắm tranh trước câu đầu
           say: ['Lời kể...', 'tu: Lời thoại', { fx: 'shake' }, ...] },
         ...
     ] }
   Toạ độ tranh 1600×900; mỗi tranh chia nhiều lớp có độ sâu d (0 xa → 1 gần)
   để máy quay tạo thị sai.
   ========================================================== */
const CUT = (() => {
  const W = 1600, H = 900, SCN = {};
  let uid = 0, gN = 0, defs = [], root = null, cur = null, skipping = false;

  /* ---------- bộ nét vẽ dùng chung cho các tranh ---------- */
  const stops = st => st.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('');
  const K = {
    id: n => `cu${uid}_${n}`,
    def: s => { defs.push(s); return ''; },
    rng(seed) { let s = (seed * 7919 + 13) % 2147483647 || 1; return () => (s = s * 16807 % 2147483647) / 2147483647; },
    ol: (d, f, w = 4, x = '') => `<path d="${d}" fill="${f}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${x}/>`,
    ln: (d, c = INK, w = 4, x = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${x}/>`,
    fl: (d, f, x = '') => `<path d="${d}" fill="${f}" ${x}/>`,
    rc: (x, y, w, h, f, sw = 4, ex = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" ${sw ? `stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"` : ''} ${ex}/>`,
    ci: (x, y, r, f, sw = 0, ex = '') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${sw ? `stroke="${INK}" stroke-width="${sw}"` : ''} ${ex}/>`,
    el: (x, y, rx, ry, f, sw = 0, ex = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${sw ? `stroke="${INK}" stroke-width="${sw}"` : ''} ${ex}/>`,
    ink: (s, f = 'ink') => `<g filter="url(#${f})">${s}</g>`,
    lg: (id, st, x2 = 0, y2 = 1, x1 = 0, y1 = 0) => K.def(`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(st)}</linearGradient>`) || `url(#${id})`,
    rg: (id, st, cx = .5, cy = .5, r = .5) => K.def(`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops(st)}</radialGradient>`) || `url(#${id})`,
    /* quầng sáng mềm */
    glow(x, y, r, c, a = .6, ex = '') { const f = K.rg(K.id('g' + gN++), [[0, c, a], [.45, c, a * .45], [1, c, 0]]); return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" ${ex}/>`; },
    eglow(x, y, rx, ry, c, a = .6, ex = '') { const f = K.rg(K.id('g' + gN++), [[0, c, a], [.5, c, a * .4], [1, c, 0]]); return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}" ${ex}/>`; },
    txt: (x, y, s, size, f = INK, ex = '') => `<text x="${x}" y="${y}" font-family="Patrick Hand, Itim, cursive" font-size="${size}" fill="${f}" text-anchor="middle" ${ex}>${s}</text>`,
    /* nhân vật chibi của game, đặt chân tại (x, y), cao h */
    fig: (key, x, y, h, opt = {}) => ART.chibi(key, opt.dir || 'down', opt).replace('<svg ', `<svg x="${x - h * 80 / 190}" y="${y - h * 181 / 190}" width="${h * 160 / 190}" height="${h}" overflow="visible" `),
    /* bộ lọc màu: phủ tông (lạnh / ấm / tối) lên một nhóm — dùng cho chibi trong cảnh đêm */
    tone(id, m) { K.def(`<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`); return `filter="url(#${id})"`; },
    cold: () => K.tone(K.id('cold'), '.32 .12 .06 0 .02  .1 .38 .14 0 .05  .1 .18 .55 0 .12  0 0 0 1 0'),
    warm: () => K.tone(K.id('warm'), '.75 .2 .05 0 .06  .12 .55 .08 0 .02  .05 .1 .35 0 0  0 0 0 1 0'),
    /* bóng người (silhouette) — chân tại (x, y), cao h; o: pose, hat, hair, big, coat, bag, c, rim, flip */
    person(x, y, h, o = {}) {
      const body = c => {
        const L = (d, w) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
        const b = o.big ? 4 : 0, p = o.pose || 'stand';
        let g = '';
        let hd = '';
        if (o.hat === 'fedora') hd += `<path d="M-18,-94 Q0,-99 18,-94 L18,-91 Q0,-95 -18,-91Z" fill="${c}"/><path d="M-10,-93 Q-11,-107 0,-107 Q11,-107 10,-93Z" fill="${c}"/>`;
        if (o.hat === 'cap') hd += `<path d="M-11,-93 Q-10,-105 1,-105 Q12,-105 11,-93Z" fill="${c}"/><path d="M7,-95 Q17,-96 19,-92 L7,-91Z" fill="${c}"/>`;
        if (o.hat === 'cone') hd += `<path d="M-20,-91 L0,-112 L20,-91 Q0,-87 -20,-91Z" fill="${c}"/>`;
        if (o.hair === 'long') hd += `<path d="M-11,-96 Q-15,-80 -14,-64 L14,-64 Q15,-80 11,-96 Z" fill="${c}"/>`;
        if (o.hair === 'bun') hd += `<circle cx="-6" cy="-100" r="5.5" fill="${c}"/>`;
        if (o.hair === 'messy') hd += `<path d="M-11,-91 l-5,-7 l7,1 l0,-8 l6,5 l4,-8 l3,8 l7,-4 l-1,8 l6,2 Z" fill="${c}"/>`;
        if (p === 'kneel') {   // quỳ, cúi đầu (nhìn nghiêng, hướng sang phải)
          g += L('M-8,-30 L12,-4 L-24,-3', 10) + `<path d="M-18,-36 Q-16,-62 2,-76 Q18,-78 22,-68 L6,-30 Q-6,-26 -18,-36Z" fill="${c}"/>` + L('M10,-70 Q22,-52 20,-34', 7);
          return g + `<g transform="translate(24,14) rotate(28 0 -89)"><circle cx="0" cy="-89" r="${10 + b / 3}" fill="${c}"/>${hd}</g>`;
        }
        g += L({ walk: 'M-4,-46 L-13,-2 M4,-46 Q8,-24 13,-2', run: 'M-3,-46 L-16,-24 L-24,-6 M3,-46 L13,-26 L24,-14' }[p] || `M-5,-46 L-6,-2 M5,-46 L6,-2`, 9 + b / 2);
        g += `<path d="M${-15 - b},-78 Q0,-83 ${15 + b},-78 L${13 + b},-42 Q0,-38 ${-13 - b},-42 Z" fill="${c}"/>`;
        if (o.coat) g += `<path d="M-15,-62 L-19,-26 Q0,-22 19,-26 L15,-62Z" fill="${c}"/>`;
        const arms = { stand: 'M-14,-75 Q-21,-60 -19,-44 M14,-75 Q21,-60 19,-44', walk: 'M-14,-75 Q-22,-62 -25,-48 M14,-75 Q17,-60 10,-46', run: 'M-14,-75 L-27,-62 L-31,-72 M14,-75 L23,-57 L34,-60', hold: 'M-14,-75 Q-23,-60 -10,-54 M14,-75 Q23,-60 10,-54', hang: 'M-14,-75 Q-17,-58 -16,-42 M14,-75 Q17,-58 16,-42' };
        g += L(arms[o.arms || p] || arms.stand, 7 + b / 3);
        g += L('M0,-82 L0,-76', 8) + `<circle cx="0" cy="-89" r="${10 + b / 3}" fill="${c}"/>` + hd;
        if (o.bag) g += L('M13,-74 L22,-50', 2.5) + `<rect x="15" y="-52" width="14" height="15" rx="3" fill="${c}"/>`;
        if (o.flower) g += L('M19,-44 L22,-8', 2.5) + `<circle cx="23" cy="-6" r="6" fill="${o.flower}"/>`;
        return g;
      };
      const s = h / 100, f = o.flip ? -1 : 1, tr = `translate(${x},${y}) scale(${s * f},${s})`;
      return (o.rim ? `<g transform="${tr} translate(${o.rimX || 1.6},${o.rimY || -.6})" opacity="${o.rimA || .9}">${body(o.rim)}</g>` : '') + `<g transform="${tr}">${body(o.c || INK)}</g>`;
    },
    /* mèo — ngồi (mặc định) hoặc nhảy (leap) */
    cat(x, y, s, o = {}) {
      const c = o.c || INK, e = o.eye || '#F2D04A', d = (o.delay ?? 0).toFixed(2);
      let g;
      if (o.leap) g = `<path d="M-34,-12 Q-6,-30 24,-22 L30,-34 L35,-24 L42,-32 L42,-18 Q42,-8 30,-8 Q4,-2 -26,-2 Z" fill="${c}"/><path d="M28,-12 L52,0 M22,-10 L44,8 M-26,-6 L-52,-16 M-22,-2 L-50,4 M-32,-10 Q-56,-22 -62,-44" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><g class="cblink" style="animation-delay:${d}s"><circle cx="34" cy="-20" r="2.4" fill="${e}"/></g>`;
      else g = `<path d="M-16,0 Q-21,-22 -10,-34 Q0,-39 10,-34 Q21,-22 16,0 Z" fill="${c}"/><path d="M15,-2 Q32,-4 30,-22" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><circle cx="0" cy="-42" r="12.5" fill="${c}"/><path d="M-12,-46 L-10,-61 L-2,-52Z M12,-46 L10,-61 L2,-52Z" fill="${c}"/><g class="cblink" style="animation-delay:${d}s"><ellipse cx="-4.6" cy="-43" rx="2.8" ry="2.3" fill="${e}"/><ellipse cx="4.6" cy="-43" rx="2.8" ry="2.3" fill="${e}"/></g>`;
      return `<g transform="translate(${x},${y}) scale(${o.flip ? -s : s},${s})">${g}</g>`;
    },
    /* mưa rơi liền mạch (2 bản sao lệch nhau 1 khung) */
    rain(n = 150, seed = 3, c = '#C8DAEA', a = .5, cls = 'crain') {
      const r = K.rng(seed); let d = '';
      for (let i = 0; i < n; i++) { const x = r() * 1900 - 150, y = r() * 900, l = 28 + r() * 46; d += `M${x.toFixed(0)},${y.toFixed(0)} l${(-l * .25).toFixed(0)},${l.toFixed(0)}`; }
      const p = `<path d="${d}" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      return `<g opacity="${a}"><g class="${cls}">${p}<g transform="translate(225,-900)">${p}</g></g></g>`;
    },
    /* bụi lơ lửng trong nắng */
    motes(n, seed, x0, y0, w, h, c = '#FFF4D6', rMax = 3.4) {
      const r = K.rng(seed); let s = '';
      for (let i = 0; i < n; i++) s += `<g class="cmote" style="animation-delay:${(-r() * 9).toFixed(2)}s;animation-duration:${(7 + r() * 6).toFixed(1)}s"><circle cx="${(x0 + r() * w).toFixed(0)}" cy="${(y0 + r() * h).toFixed(0)}" r="${(1 + r() * rMax).toFixed(1)}" fill="${c}"/></g>`;
      return s;
    },
    /* tàn lửa bay lên */
    embers(n, seed, x0, y0, w, h) {
      const r = K.rng(seed); let s = '';
      for (let i = 0; i < n; i++) s += `<g class="cember" style="animation-delay:${(-r() * 4).toFixed(2)}s;animation-duration:${(2.6 + r() * 2.4).toFixed(1)}s"><circle cx="${(x0 + r() * w).toFixed(0)}" cy="${(y0 + r() * h).toFixed(0)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="${r() > .5 ? '#FFD27A' : '#FF8A3C'}"/></g>`;
      return s;
    },
    /* khói nhang / khói cháy: các dải cong bay lên */
    smoke(x, y, n, o = {}) {
      const c = o.c || '#D8D0C4', w = o.w || 3, hgt = o.h || 160; let s = '';
      for (let i = 0; i < n; i++) {
        const dx = (i % 2 ? 1 : -1) * (8 + i * 3);
        s += `<g class="${o.big ? 'csmoke2' : 'csmoke'}" style="animation-delay:${(-i * (o.big ? 2.2 : 1.1)).toFixed(1)}s"><path d="M${x},${y} q${dx},${-hgt * .25} 0,${-hgt * .5} t${-dx * .6},${-hgt * .5}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/></g>`;
      }
      return s;
    },
    /* ngọn lửa nến */
    flame(x, y, s = 1) {
      const f = K.lg(K.id('fl' + gN++), [[0, '#FFF6D0'], [.5, '#FFC24A'], [1, '#E0602A']], 0, 1, 0, 0);
      return K.glow(x, y - 14 * s, 60 * s, '#FFC870', .55, 'class="cflick"') + `<g transform="translate(${x},${y}) scale(${s})"><g class="cflame"><path d="M0,0 Q-9,-10 -6,-22 Q-3,-32 0,-40 Q3,-32 6,-22 Q9,-10 0,0Z" fill="${f}"/><path d="M0,-3 Q-4,-9 -2,-16 Q0,-22 0,-25 Q2,-16 3,-12 Q3,-6 0,-3Z" fill="#FFFBEA"/></g></g>`;
    },
    /* đám cháy lớn */
    fire(x, y, w, h, seed = 1) {
      const r = K.rng(seed); let s = '';
      const cols = ['#B83A22', '#E0602A', '#F2943A', '#FFC24A', '#FFE9A0'];
      cols.forEach((c, k) => {
        const n = Math.max(2, Math.round(w / (36 + k * 6)));
        for (let i = 0; i < n; i++) {
          const fx = x + (i + .5) / n * w + (r() - .5) * 18, fw = w / n * (1.3 - k * .12), fh = h * (1 - k * .16) * (.65 + r() * .45);
          s += `<g class="cfire" style="animation-delay:${(-r()).toFixed(2)}s;animation-duration:${(.5 + r() * .5).toFixed(2)}s"><path d="M${fx - fw / 2},${y} Q${fx - fw * .55},${y - fh * .5} ${fx - fw * .1},${y - fh * .7} Q${fx},${y - fh * .82} ${fx + fw * .05},${y - fh} Q${fx + fw * .3},${y - fh * .6} ${fx + fw * .55},${y - fh * .4} Q${fx + fw * .6},${y - fh * .15} ${fx + fw / 2},${y} Z" fill="${c}"/></g>`;
        }
      });
      return s;
    },
    /* dây đèn trang trí dọc đường cong bậc 2 */
    bulbs(x1, y1, cx, cy, x2, y2, n, seed = 1, cols = ['#FFD27A', '#FFB0A0', '#FFF0C0']) {
      const r = K.rng(seed); let s = K.ln(`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, '#1B1410', 2.5);
      for (let i = 1; i < n; i++) {
        const t = i / n, x = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t * t * x2, y = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t * t * y2 + 6, c = cols[i % cols.length];
        s += `<g class="ctw" style="animation-delay:${(-r() * 3).toFixed(2)}s">${K.ci(x, y, 16, c, 0, 'opacity=".25"')}${K.ci(x, y, 5.5, c)}</g>`;
      }
      return s;
    },
    cloud: (x, y, s, c = '#FFFFFF', a = 1) => `<g transform="translate(${x},${y}) scale(${s})" opacity="${a}"><path d="M-90,20 Q-100,-10 -60,-14 Q-50,-48 -10,-40 Q14,-66 50,-40 Q92,-44 90,-8 Q118,4 96,20 Z" fill="${c}"/></g>`,
  };

  /* ---------- dựng một cảnh (shot) ---------- */
  function build(sh) {
    uid++; defs = [];
    const fn = SCN[sh.img];
    if (!fn) console.error('Thiếu tranh cutscene', sh.img);
    const layers = fn ? fn(sh.o || {}, K) : [];
    const el = h('div', 'cshot');
    const dd = `<defs>${defs.join('')}</defs>`;
    layers.forEach(l => {
      const d = h('div', 'cl ' + (l.cls || ''));
      d.dataset.d = l.d;
      d.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">${dd}${l.s}</svg>`;
      el.append(d);
    });
    if (sh.tint) el.append(h('div', 'ctint', '')), el.lastChild.style.background = sh.tint;
    return el;
  }
  /* máy quay: lớp gần (d=1) trượt nhiều, lớp xa trượt ít → thị sai */
  function camT(c, d) {
    const k = .3 + .7 * d, z = 1 + (c[2] - 1) * (.5 + .5 * d);
    const lim = v => Math.max(0, (57 * v - 50) / 1.14);       // khung lớp rộng 114% sân khấu
    const cl = (v, m) => Math.max(-m, Math.min(m, v));
    const tx = cl((W / 2 - c[0]) / W * 100 * k * z, lim(z)), ty = cl((H / 2 - c[1]) / H * 100 * k * z, lim(z));
    return `translate(${tx.toFixed(2)}%,${ty.toFixed(2)}%) scale(${z.toFixed(4)})`;
  }
  function roll(el, sh) {
    const cam = sh.cam || [[800, 450, 1.03], [800, 450, 1.1]], a = cam[0], b = cam[1] || cam[0];
    const dur = (sh.t || 13) * 1000;
    el.querySelectorAll('.cl').forEach(l => {
      const d = +l.dataset.d;
      if (l.animate) l.animate([{ transform: camT(a, d) }, { transform: camT(b, d) }], { duration: dur, easing: 'cubic-bezier(.4,.05,.3,1)', fill: 'forwards' });
      else l.style.transform = camT(b, d);
    });
  }

  function open() {
    root = $('#cine');
    if (!root.dataset.ready) {
      root.dataset.ready = 1;
      root.innerHTML = '<div class="cstack"></div><div class="cvig"></div><div class="cgrain"></div><div class="cscrim"></div><div class="cbar t"></div><div class="cbar b"></div><button class="cskip" data-noadv="1" title="Tua nhanh đoạn phim">Bỏ qua ▸▸</button>';
      root.querySelector('.cskip').onclick = e => { e.stopPropagation(); skipping = true; G.skip = true; $('#btnSkip').classList.add('on'); advance(); };
    }
    root.classList.remove('out'); root.classList.add('on');
    stage().classList.add('cine');
    void root.offsetWidth; root.classList.add('bars');
  }
  async function show(sh, first) {
    hideText();
    const el = build(sh), stack = root.querySelector('.cstack'), old = cur;
    cur = el;
    const tr = sh.tr || 'fade', fast = G.skip;
    if (tr === 'black' && old && !fast) { old.classList.remove('in'); await sleep(650); }
    stack.append(el); roll(el, sh);
    if (tr === 'flash') fx('flash');
    if (tr === 'glitch') fx('glitch');
    if (tr === 'cut' || tr === 'flash' || tr === 'glitch' || fast) { el.classList.add('now', 'in'); if (old) old.remove(); }
    else { void el.offsetWidth; el.classList.add('in'); if (old) setTimeout(() => old.remove(), 1100); }
    if (sh.sfx) AUDIO.sfx(sh.sfx);
    await sleep(G.skip ? 30 : (sh.hold ?? (first ? 1300 : 900)));
  }
  function stop() {
    if (!root) return;
    root.classList.remove('on', 'bars', 'out');
    root.querySelector('.cstack').innerHTML = ''; cur = null;
    stage().classList.remove('cine');
    if (skipping) { skipping = false; G.skip = false; $('#btnSkip').classList.remove('on'); }
  }
  async function close() {
    hideText();
    root.classList.remove('bars'); root.classList.add('out');
    await sleep(G.skip ? 40 : 850);
    stop();
  }
  async function play(st) {
    const my = session;
    open();
    for (let i = 0; i < st.cut.length; i++) {
      const sh = st.cut[i];
      await show(sh, i === 0);
      if (my !== session) return;
      const r = await runSteps(sh.say || []);
      if (my !== session) return;
      if (r) { stop(); return r; }
      if (sh.wait) await sleep(G.skip ? 30 : sh.wait);
    }
    await close();
  }
  /* xem thử một tranh: index.html?cut=street&o=time:night,police */
  function preview(name, o = {}) {
    $('#title').classList.remove('on'); $('#hud').classList.add('on'); resetStage();
    return play({ cut: [{ img: name, o, cam: [[800, 450, 1], [800, 450, 1.06]], t: 20, hold: 400, say: ['(xem thử tranh “' + name + '”)'] }] });
  }
  addEventListener('load', () => {
    const q = new URLSearchParams(location.search), n = q.get('cut');
    if (!n) return;
    const o = {};
    (q.get('o') || '').split(',').filter(Boolean).forEach(kv => { const [k, v] = kv.split(':'); o[k] = v === undefined ? true : v; });
    setTimeout(() => preview(n, o), 300);
  });
  return { play, stop, preview, reg: (name, fn) => { SCN[name] = fn; }, K, SCN };
})();
