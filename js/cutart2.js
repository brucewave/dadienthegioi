'use strict';
/* ==========================================================
   CUTART 2 — tranh ghép cảnh: nền vẽ tay + nhân vật chibi, và tranh cận cảnh manh mối
   { img: 'scene', o: { place: 'lobby' | 'hall' | 'room' | 'classroom' | 'stage' | 'yard' | 'office' | 'home',
                        figs: [['binh', 620, 'happy', 'right', { h, y, back, tone, lie, flip, op }]],
                        night, spot: [x, r], marks: [[x, y, '!']], rays, ...tuỳ chọn riêng của từng nơi } }
   { img: 'close', o: { k: 'window' | 'fan' | 'photo' | 'gutter' | 'cushion' | 'pocket' | 'latch' | 'knife'
                            | 'palms' | 'phone' | 'thread' | 'file' | 'badge' , ... } }
   ========================================================== */
(() => {
  const R = CUT.reg, K = CUT.K;
  const { ol, ln, fl, rc, ci, el, ink, txt } = K;
  const dk = (hex, f = .8) => '#' + hex.slice(1).match(/../g).map(v => Math.max(0, Math.min(255, Math.round(parseInt(v, 16) * f))).toString(16).padStart(2, '0')).join('');
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- sàn, tường ---------- */
  const floorWood = (y0, c, vx = 800) => {
    let s = rc(-80, y0, 1760, 1080 - y0, c, 0), d = '', e = '';
    for (let k = -16; k <= 16; k++) d += `M${vx + k * 70},${y0} L${vx + k * 300},1080 `;
    [.1, .26, .48, .78].forEach(t => { e += `M-80,${(y0 + (1080 - y0) * t).toFixed(0)} H1680 `; });
    return s + ln(d, dk(c, .72), 3, 'opacity=".6"') + ln(e, dk(c, .72), 2, 'opacity=".3"') + ln(`M-80,${y0} H1680`, INK, 5);
  };
  const floorTile = (y0, c1, c2, vx = 800) => {
    let s = rc(-80, y0, 1760, 1080 - y0, c1, 0), d = '';
    for (let k = -14; k <= 14; k++) d += `M${vx + k * 92},${y0} L${vx + k * 340},1080 `;
    for (let y = y0, st = 26; y < 1080; y += st, st *= 1.36) d += `M-80,${y.toFixed(0)} H1680 `;
    return s + ln(d, c2, 3) + ln(`M-80,${y0} H1680`, INK, 5);
  };
  const wall = (y0, c, wain) => {
    let s = rc(-80, -80, 1760, y0 + 80, c, 0);
    if (wain) s += rc(-80, y0 - 150, 1760, 150, wain, 4) + ln(`M-80,${y0 - 150} H1680`, dk(wain, .7), 8);
    return s + rc(-80, y0 - 22, 1760, 22, dk(wain || c, .6), 4);
  };
  /* ---------- đồ vật ---------- */
  const door = (x, y0, w, hh, c, num, o = {}) => {
    let s = rc(x - 12, y0 - hh - 12, w + 24, hh + 12, '#6A4A34', 4);
    if (o.open) s += rc(x, y0 - hh, w, hh, '#1A1210', 4) + ol(`M${x},${y0 - hh} L${x + w * .32},${y0 - hh + 22} L${x + w * .32},${y0 - 12} L${x},${y0}Z`, c, 4);
    else s += rc(x, y0 - hh, w, hh, c, 4) + rc(x + w * .14, y0 - hh + hh * .08, w * .72, hh * .38, dk(c, .88), 3) + rc(x + w * .14, y0 - hh * .48, w * .72, hh * .38, dk(c, .88), 3) + ci(x + w * .84, y0 - hh * .5, 9, '#C9A64A', 3);
    if (num) s += rc(x + w / 2 - 36, y0 - hh + 14, 72, 34, '#F3EEDF', 3) + txt(x + w / 2, y0 - hh + 41, num, 28, INK);
    return s;
  };
  const tape = (x1, y1, x2, y2) => { const d = `M${x1},${y1} L${x2},${y2}`; return ln(d, '#E8C24A', 18) + ln(d, INK, 2.5, 'stroke-dasharray="18 14"'); };
  const leafy = (cx, cy, r, seed, cols = ['#4C8A4E', '#5FA05A', '#3E7A44', '#6EB060']) => {
    const q = K.rng(seed); let s = '';
    for (let i = 0; i < 16; i++) { const a = q() * 6.28, d = q() * r; s += ci(cx + Math.cos(a) * d, cy + Math.sin(a) * d * .7, r * (.28 + q() * .22), cols[i % cols.length], 3); }
    return s;
  };
  const win = (x, y, w, hh, o = {}) => {
    const v = o.view || 'day', sky = { night: ['#0E1428', '#2A3050'], dusk: ['#3A2A50', '#D8805A'], day: ['#8FC0D8', '#E4F0F2'] }[v];
    const cid = K.id('wc' + x + '_' + y);
    K.def(`<clipPath id="${cid}"><rect x="${x}" y="${y}" width="${w}" height="${hh}"/></clipPath>`);
    let s = rc(x - 14, y - 14, w + 28, hh + 28, '#6A4A34', 4) + `<rect x="${x}" y="${y}" width="${w}" height="${hh}" fill="${K.lg(K.id('ws' + x + '_' + y), [[0, sky[0]], [1, sky[1]]])}"/>`;
    let inner = '';
    if (o.tree) inner += ln(`M${x + w + 40},${y + hh * .8} Q${x + w * .5},${y + hh * .6} ${x - 20},${y + hh * .7}`, '#5A3A26', 18) + leafy(x + w * .7, y + hh * .3, w * .35, 3) + leafy(x + w * .15, y + hh * .2, w * .28, 5, ['#C8553D', '#4C8A4E', '#D9823A', '#5FA05A']);
    if (v === 'night') inner += ci(x + w * .75, y + hh * .25, 18, '#EDE8DA');
    s += `<g clip-path="url(#${cid})">${inner}</g>`;
    if (o.open) s += ol(`M${x},${y} L${x - w * .22},${y + 16} L${x - w * .22},${y + hh - 16} L${x},${y + hh}Z`, '#A8C8D4', 4, 'fill-opacity=".8"') + ol(`M${x + w},${y} L${x + w + w * .22},${y + 16} L${x + w + w * .22},${y + hh - 16} L${x + w},${y + hh}Z`, '#A8C8D4', 4, 'fill-opacity=".8"');
    else s += ln(`M${x + w / 2},${y} V${y + hh} M${x},${y + hh / 2} H${x + w}`, '#6A4A34', 8) + ln(`M${x + 14},${y + 14} l${w * .25},${hh * .3}`, '#fff', 6, 'opacity=".5"');
    if (o.bars) { let b = ''; for (let bx = x + w / 7; bx < x + w; bx += w / 7) b += `M${bx.toFixed(0)},${y} V${y + hh} `; s += ln(b, '#2E2A2A', 6); }
    if (o.latch) s += rc(x + w / 2 - 16, y + hh / 2 - 26, 32, 52, '#C9A64A', 3) + (o.open ? '' : rc(x + w / 2 - 4, y + hh / 2 - 40, 8, 30, '#8A7A4A', 2));
    return s + rc(x - 26, y + hh + 10, w + 52, 18, '#7A5A40', 4);
  };
  const bowl = (x, y, steam) => ol(`M${x - 56},${y - 30} Q${x - 50},${y + 10} ${x},${y + 12} Q${x + 50},${y + 10} ${x + 56},${y - 30}Z`, '#F3EEDF', 4) + el(x, y - 30, 56, 12, '#E8C890', 3) + ln(`M${x - 30},${y - 34} q12,-6 24,0 q12,6 24,0`, '#D9A050', 4) + ln(`M${x + 30},${y - 60} L${x + 70},${y - 4} M${x + 40},${y - 64} L${x + 80},${y - 8}`, '#8A5A36', 4) + (steam ? K.smoke(x, y - 44, 3, { c: '#FFFFFF', w: 5, h: 120 }) : '');
  const table = (x, y, w, c = '#9A6A3E') => rc(x, y, w, 26, c, 4) + rc(x + 20, y + 26, 18, 120, dk(c, .75), 4) + rc(x + w - 38, y + 26, 18, 120, dk(c, .75), 4);
  const stool = (x, y, c = '#C8553D') => ol(`M${x - 34},${y - 70} h68 l-10,70 h-10 l-4,-46 h-20 l-4,46 h-10Z`, c, 4);
  const lamp = (x, y, on = true) => ln(`M${x},-80 V${y - 40}`, INK, 4) + ol(`M${x - 60},${y} L${x - 30},${y - 44} L${x + 30},${y - 44} L${x + 60},${y}Z`, '#C99A5A', 4) + (on ? K.glow(x, y + 10, 260, '#FFD88A', .45, 'class="cflick"') : '');
  const tube = (x, y, w) => rc(x - w / 2, y, w, 16, '#F6F2E6', 4) + K.eglow(x, y + 60, w * .9, 120, '#F6F2E6', .3);
  const seatsRow = (y, seed, col = '#7A2A2A', heads = true) => {
    const q = K.rng(seed); let s = '';
    for (let x = -60; x < 1700; x += 120) {
      if (heads && q() > .35) s += ci(x + 60 + (q() - .5) * 20, y - 60 - q() * 20, 42, '#1E1614') + rc(x + 22, y - 40, 76, 50, '#1E1614', 0);
      s += ol(`M${x + 6},${y + 140} L${x + 6},${y} Q${x + 60},${y - 26} ${x + 114},${y} L${x + 114},${y + 140}Z`, col, 4);
    }
    return s;
  };
  const crowLeaf = (x, y, a, sc, c) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${sc})"><path d="M0,0 Q22,-30 60,-34 Q100,-30 104,0 Q100,30 60,34 Q22,30 0,0Z" fill="${c}" stroke="${INK}" stroke-width="3"/><path d="M4,0 H96" stroke="${INK}" stroke-width="1.6" opacity=".45"/></g>`;
  const badge = (x, y, s = 1, glint = true) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0,-34 L30,-22 L26,14 Q14,32 0,38 Q-14,32 -26,14 L-30,-22Z" fill="#D8DEE4" stroke="${INK}" stroke-width="4"/><path d="M0,-18 L6,-4 L20,-4 L9,5 L13,19 L0,11 L-13,19 L-9,5 L-20,-4 L-6,-4Z" fill="#9AA8B4" stroke="${INK}" stroke-width="2"/><path d="M-18,-20 L-6,-26" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>` + (glint ? `<g class="cglint"><path d="M${x + 20 * s},${y - 60 * s} l5,20 l20,5 l-20,5 l-5,20 l-5,-20 l-20,-5 l20,-5Z" fill="#fff"/></g>` : '');

  /* ======================================================
     CÁC NƠI CHỐN — trả về { s0: nền xa, s1: đồ vật sau nhân vật, s2: tiền cảnh, fy: mặt sàn đứng }
     ====================================================== */
  const P = {};
  /* sảnh nhà trọ — quầy, bảng chìa khóa, cửa ra hẻm, bàn ăn sáng */
  P.lobby = o => {
    const n = o.night;
    let s0 = wall(600, n ? '#8A7A62' : '#EAD9B4', n ? '#5A4030' : '#A8743E');
    s0 += rc(250, 150, 320, 220, '#7A5236', 5) + txt(410, 190, 'CHÌA KHÓA', 26, '#F3EEDF');
    const nums = ['101', '102', '103', '104', '201', '202', '203', '204'];
    nums.forEach((nm, i) => {
      const kx = 290 + (i % 4) * 75, ky = 230 + Math.floor(i / 4) * 70;
      s0 += ci(kx, ky, 5, '#C9A64A', 2);
      if (!(o.emptyKey && nm === '204')) s0 += ln(`M${kx},${ky} v18`, '#C9A64A', 4) + rc(kx - 14, ky + 18, 28, 30, ['#C8553D', '#3E78A6', '#D9A93A', '#4C8A4E'][i % 4], 2.5) + txt(kx, ky + 40, nm, 13, '#F3EEDF');
      else s0 += txt(kx, ky + 40, nm, 13, '#F3EEDF') + ci(kx, ky + 26, 30, 'none', 0, 'stroke="#E8C24A" stroke-width="4" stroke-dasharray="8 6"');
    });
    s0 += ci(760, 170, 52, '#F3EEDF', 5) + ln('M760,170 V136 M760,170 L786,184', INK, 5);
    s0 += rc(880, 140, 130, 170, '#F3EEDF', 4) + rc(880, 140, 130, 42, '#B84A3E', 4) + txt(945, 172, 'THÁNG 10', 22, '#F3EEDF') + txt(945, 270, '18', 78, INK);
    s0 += rc(1180, 170, 330, 430, '#5A4030', 5) + rc(1200, 190, 290, 410, n ? '#1E2640' : '#BFD8E2', 3);
    let gr = ''; for (let gx = 1220; gx < 1490; gx += 36) gr += `M${gx},190 V600 `; for (let gy = 230; gy < 600; gy += 70) gr += `M1200,${gy} H1490 `;
    s0 += ln(gr, '#3A3632', 4);
    if (!n) s0 += `<path d="M1200,600 L1490,600 L1640,1000 L1050,1000Z" fill="#FFF6DA" opacity=".18"/>`;
    s0 = ink(s0) + floorTile(600, n ? '#6A6058' : '#D8CBB0', n ? '#4A4038' : '#B8A88A');
    let s1 = rc(80, 470, 600, 200, '#8A5A36', 5) + rc(60, 446, 640, 32, '#B07A4A', 5) + ln('M120,520 H640 M120,600 H640', '#6A4226', 3);
    s1 += `<g transform="rotate(-6 480 430)">${rc(400, 410, 150, 34, '#3A4766', 4)}${ln('M410,420 h130', '#F3EEDF', 3)}</g>` + el(220, 440, 30, 10, '#C9A64A', 3) + ci(220, 428, 9, '#C9A64A', 3);
    s1 = ink(s1);
    let s2 = '';
    if (o.food) s2 += ink(table(1080, 760, 420)) + bowl(1250, 762, true) + ink(stool(1500, 940));
    if (n) s2 += K.glow(760, 300, 600, '#FFD88A', .25);
    return { s0, s1, s2, fy: 770 };
  };
  /* hành lang tầng 2 — phối cảnh một điểm tụ, cửa phòng hai bên */
  P.hall = o => {
    const n = o.night, VX = 800, wc = n ? '#5A5468' : '#E3D2AE', wc2 = dk(wc, .86);
    const L = (t, v) => [lerp(-80, 560, t), lerp(lerp(1000, 560, t), lerp(-80, 220, t), v)];
    const Rr = (t, v) => [lerp(1680, 1040, t), lerp(lerp(1000, 560, t), lerp(-80, 220, t), v)];
    const quad = (f, t1, t2, v1, v2) => { const a = f(t1, v1), b = f(t1, v2), c = f(t2, v2), d = f(t2, v1); return `M${a[0].toFixed(0)},${a[1].toFixed(0)} L${b[0].toFixed(0)},${b[1].toFixed(0)} L${c[0].toFixed(0)},${c[1].toFixed(0)} L${d[0].toFixed(0)},${d[1].toFixed(0)}Z`; };
    let s0 = rc(-80, -80, 1760, 1160, n ? '#2A2630' : '#C9B590', 0);
    s0 += fl('M-80,-80 L560,220 L560,560 L-80,1000Z', wc) + fl('M1680,-80 L1040,220 L1040,560 L1680,1000Z', wc2);
    s0 += fl('M560,220 H1040 V560 H560Z', dk(wc, .92)) + fl('M-80,1000 L560,560 L1040,560 L1680,1000Z', n ? '#3A3036' : '#A8845E');
    s0 += fl('M-80,-80 L560,220 H1040 L1680,-80Z', n ? '#22202A' : '#EFE6D0');
    let pl = ''; for (let k = -8; k <= 8; k++) pl += `M${VX + k * 60},560 L${VX + k * 260},1000 `;
    s0 += ln(pl, n ? '#2A2228' : '#8A6A48', 3, 'opacity=".6"');
    s0 += win(720, 290, 160, 170, { view: n ? 'night' : 'day', bars: true });
    s0 += fl(quad(L, 0, 1, 0, .17), dk(wc, .7)) + fl(quad(Rr, 0, 1, 0, .17), dk(wc2, .7));
    const doorQ = (f, t1, t2, num, c, extra) => {
      let s = fl(quad(f, t1 - .015, t2 + .015, 0, .76), '#5A4030') + ol(quad(f, t1, t2, 0, .72), c, 4);
      const p = f((t1 + t2) / 2, .64), z = 1 - (t1 + t2) / 2 * .62;
      s += rc(p[0] - 30 * z, p[1] - 16 * z, 60 * z, 30 * z, '#F3EEDF', 3) + txt(p[0], p[1] + 9 * z, num, 24 * z, INK);
      const k = f(f === L ? t2 - .02 : t1 + .02, .36); s += ci(k[0], k[1], 7 * z, '#C9A64A', 2);
      return s + (extra || '');
    };
    s0 += doorQ(L, .12, .4, '201', '#9A6A44') + doorQ(L, .58, .76, '202', '#9A6A44');
    let tp = '';
    if (o.tape) { const a = Rr(.14, .5), b = Rr(.42, .32), c = Rr(.14, .3), d = Rr(.42, .52); tp = tape(a[0], a[1], b[0], b[1]) + tape(c[0], c[1], d[0], d[1]); }
    s0 += doorQ(Rr, .1, .42, '203', o.open203 ? '#1A1210' : '#9A6A44') + doorQ(Rr, .58, .76, '204', '#9A6A44');
    s0 = ink(s0) + tp;
    if (o.open203) s0 += K.eglow(Rr(.26, .3)[0], Rr(.26, .3)[1], 140, 260, '#F2C46A', .35);
    s0 += tube(800, 130, 260) + (n ? K.eglow(800, 700, 560, 260, '#F6F2E6', .12) : '');
    let s2 = '';
    if (o.stairs) {
      s2 += ink(fl('M-80,760 L380,760 L380,1080 L-80,1080Z', '#2A2018') + ln('M-80,800 H380 M-80,850 H380 M-80,910 H380 M-80,980 H380', '#5A4030', 6) + ln('M380,760 V1080', INK, 6) + ln('M-80,700 L400,700 M40,700 V770 M140,700 V770 M240,700 V770 M340,700 V770', '#6A4A34', 10));
    }
    if (n) s2 += `<rect x="-80" y="-80" width="1760" height="1160" fill="#10142A" opacity=".28" style="mix-blend-mode:multiply"/>`;
    return { s0, s1: '', s2, fy: 800 };
  };
  /* phòng trọ 203 — đêm: cửa sổ song sắt, tủ áo, giường */
  P.room = o => {
    let s0 = wall(600, '#7A8A86', '#5A6A66') + win(640, 120, 300, 280, { view: o.day ? 'day' : 'night', bars: true });
    s0 += rc(80, 140, 260, 460, '#8A5A36', 5) + ln('M210,150 V590', INK, 4) + ci(196, 380, 7, '#C9A64A', 2) + ci(224, 380, 7, '#C9A64A', 2);
    s0 += rc(1100, 400, 460, 200, '#B8A890', 5) + rc(1100, 360, 120, 120, '#E8E0CC', 4) + rc(1220, 400, 340, 200, '#4E6A8A', 4);
    s0 += door(1380, 600, 170, 380, '#9A6A44', '', {});
    s0 = ink(s0) + floorWood(600, '#5A4434');
    if (!o.day) s0 += K.glow(250, 120, 300, '#F2C46A', .25, 'class="cflick"');
    let s1 = '';
    if (o.blood) s1 += el(230, 640, 160, 36, '#6A1E1A', 0, 'opacity=".75"') + el(640, 676, 230, 40, '#7A1E1A', 0, 'opacity=".55"');
    if (o.body) {
      s1 += `<g transform="translate(560,700) rotate(-84) translate(-560,-700)">${K.fig('chutro', 560, 700, 300, { emo: 'sleep' })}</g>`;
      s1 += `<g transform="rotate(-28 640 560)">${rc(600, 540, 90, 18, '#3A2A1A', 3)}${ol('M690,542 L780,550 L690,558Z', '#CFD6DD', 3)}</g>`;
    }
    if (o.nha) s1 += `<g transform="translate(980,700) rotate(84) translate(-980,-700)">${K.fig('nha', 980, 700, 270, { emo: 'sleep' })}</g>`;
    if (o.lying) s1 += `<g transform="translate(${o.lyingX || 700},700) rotate(-84) translate(${-(o.lyingX || 700)},-700)">${K.fig(o.lying, o.lyingX || 700, 700, 280, { emo: o.lyingEmo || 'sleep' })}</g>`;
    let s2 = o.tape ? tape(-80, 780, 1680, 720) : '';
    if (o.smoke) s2 += `<g opacity=".85">${K.smoke(700, 260, 4, { big: true, c: '#4A4448', w: 70, h: 300 })}${K.smoke(1100, 240, 4, { big: true, c: '#3A3438', w: 90, h: 320 })}</g>` + K.eglow(800, 900, 900, 260, '#FF7A30', .18, 'class="cflick"');
    if (!o.day) s2 += `<rect x="-80" y="-80" width="1760" height="1160" fill="#0E1430" opacity=".3" style="mix-blend-mode:multiply"/>`;
    return { s0, s1, s2, fy: 790 };
  };
  /* lớp học ở Học viện — bảng đen, cửa sổ đầy nắng, bàn học tiền cảnh */
  P.classroom = o => {
    let s0 = wall(620, '#CFE0C8', '#7A9A6A');
    s0 += rc(470, 110, 760, 330, '#3E5A44', 8) + rc(450, 440, 800, 20, '#8A6A4A', 4);
    const board = (o.board || 'BẢO VỆ HIỆN TRƯỜNG|1. Phong tỏa  2. Găng tay|3. Đánh dấu  4. Tang vật').split('|');
    board.forEach((l, i) => { s0 += txt(850, 190 + i * 70, l, i ? 40 : 50, '#F3EEDF', 'opacity=".9"'); });
    s0 += win(60, 120, 280, 300, { view: 'day', tree: true }) + win(1340, 120, 240, 300, { view: 'day', tree: true });
    s0 += ci(850, 70, 0, 'none') + rc(760, 30, 180, 50, '#B84A3E', 3) + txt(850, 66, 'HỌC VIỆN', 30, '#F6E2A0');
    s0 = ink(s0) + floorWood(620, '#B08A5E');
    s0 += `<path d="M60,420 L340,420 L700,1080 L240,1080Z M1340,420 L1580,420 L1700,1080 L1400,1080Z" fill="#FFF6DA" opacity=".2"/>`;
    let s2 = '';
    if (!o.noDesks) {
      [[-40, 820], [560, 830], [1160, 820]].forEach(([x, y]) => { s2 += rc(x, y, 480, 34, '#B07A4A', 4) + rc(x + 10, y + 34, 460, 140, '#9A6A3E', 4); });
      s2 = ink(s2 + `<g transform="rotate(-5 300 812)">${rc(220, 790, 150, 26, '#3A4766', 3)}${rc(232, 770, 126, 24, '#C8553D', 3)}</g>`);
    }
    s2 += K.motes(30, 4, 100, 200, 1400, 500, '#FFF6DA', 3);
    return { s0, s1: '', s2, fy: 860 };
  };
  /* sân khấu hội trường — rèm nhung, hộp kính, cửa sổ bên phải, hàng ghế */
  P.stage = o => {
    let s0 = rc(-80, -80, 1760, 760, '#5A1E22', 0);
    let fold = ''; for (let x = -60; x < 1700; x += 64) fold += `M${x},-80 Q${x + 16},300 ${x},640 `;
    s0 += ln(fold, '#3E1216', 10, 'opacity=".7"');
    s0 += rc(330, 130, 940, 84, '#2E4E8A', 5) + txt(800, 188, 'LỄ TỐT NGHIỆP KHÓA 2022 – 2026', 46, '#F6E2A0', 'font-weight="bold"');
    s0 += win(1270, 220, 230, 260, { view: 'day', tree: true, open: o.win === 'open', latch: true });
    if (o.feather) s0 += `<g transform="rotate(-18 1390 500)">${ol('M1340,506 Q1390,486 1440,500 Q1392,512 1340,506Z', '#1E1A22', 3)}${ln('M1336,506 L1446,500', '#5A5A6A', 2)}</g>`;
    s0 = ink(s0);
    let fl0 = rc(-80, 640, 1760, 440, '#8A5A36', 0); let pk = ''; for (let k = -14; k <= 14; k++) pk += `M${800 + k * 80},640 L${800 + k * 300},1080 `;
    s0 += fl0 + ln(pk, '#6A4226', 3, 'opacity=".55"') + ln('M-80,640 H1680', INK, 5);
    s0 += ol('M-80,-80 L220,-80 Q160,300 240,700 L-80,700Z', '#8A2228', 5) + ol('M1680,-80 L1400,-80 Q1460,300 1380,700 L1680,700Z', '#8A2228', 5);
    s0 += ol('M-80,-80 H1680 V40 Q1200,90 800,50 Q400,90 -80,40Z', '#9A2A2E', 5) + ln('M-80,30 Q400,80 800,40 Q1200,80 1680,30', '#D9A93A', 6);
    let s1 = '';
    if (o.case) {
      const cx = o.caseX || 800;
      s1 += rc(cx - 90, 520, 180, 160, '#3A2A24', 5) + rc(cx - 100, 500, 200, 26, '#5A4030', 4);
      s1 += rc(cx - 80, 400, 160, 100, '#BFD8E2', 4, 'fill-opacity=".35"') + rc(cx - 60, 470, 120, 30, '#7A1E2A', 3);
      if (o.case !== 'empty' && o.case !== 'open') s1 += badge(cx, 448, .9);
      if (o.case === 'open' || o.case === 'empty') s1 += ol(`M${cx - 80},400 L${cx - 60},346 L${cx + 100},346 L${cx + 80},400Z`, '#BFD8E2', 4, 'fill-opacity=".35"');
      else s1 += rc(cx - 84, 392, 168, 12, '#BFD8E2', 3, 'fill-opacity=".6"');
      s1 = ink(s1);
      if (o.lit !== false) s1 = `<path d="M${cx - 30},-80 L${cx - 220},680 L${cx + 220},680 L${cx + 30},-80Z" fill="${K.lg(K.id('sp'), [[0, '#FFF2C8', .5], [1, '#FFF2C8', .05]])}"/>` + s1 + K.glow(cx, 450, 160, '#FFF6D8', .35);
    }
    if (o.mic) s1 += ink(ln('M520,680 V420', '#3A3632', 8) + el(520, 680, 60, 12, '#3A3632', 3) + rc(508, 396, 24, 40, '#3A3632', 3, 'rx="10"'));
    if (o.flowers !== false) [180, 1420].forEach(x => { s1 += ink(ol(`M${x - 60},680 L${x - 40},560 L${x + 40},560 L${x + 60},680Z`, '#C9A27A', 4) + leafy(x, 520, 70, x, ['#F6D04A', '#F07A7A', '#F3EEDF', '#4C8A4E'])); });
    let s2 = o.crowd ? ink(seatsRow(930, 7)) : '';
    return { s0, s1, s2, fy: 770 };
  };
  /* sân trường bên ngoài hội trường — tường, cửa sổ, máng xối, cây bàng, tổ quạ */
  P.yard = o => {
    let s0 = `<rect x="-80" y="-80" width="1760" height="760" fill="${K.lg(K.id('sky'), [[0, '#7AB4D8'], [1, '#D8ECF4']])}"/>` + `<g class="cdrift">${K.cloud(300, 120, 1.2)}${K.cloud(1200, 90, 1, '#fff', .9)}</g>`;
    let b = rc(-80, 120, 1100, 600, '#EDE2C8', 5) + ol('M-100,130 L1040,130 L1060,80 L-100,80Z', '#B85A3E', 5);
    b += win(560, 230, 230, 250, { view: 'day', open: o.win !== 'closed' });
    b += rc(440, 520, 470, 34, '#8A8E92', 4) + ln('M440,554 Q675,580 910,554', '#6A6E72', 4) + rc(890, 520, 26, 300, '#8A8E92', 4);
    let lv = ''; const q = K.rng(9); for (let i = 0; i < 18; i++) { const x = 450 + q() * 450; if (o.dig && x > 640 && x < 720) continue; lv += crowLeaf(x, 518 + q() * 8, -20 + q() * 40, .32, ['#C8553D', '#D9823A', '#A86A3A'][i % 3]); }
    b += lv;
    if (o.badge) b += badge(680, 516, .55);
    s0 += ink(b);
    let s1 = rc(-80, 720, 1760, 360, '#C9B89A', 0) + ln('M-80,720 H1680', INK, 4);
    s1 += ln('M1300,1080 Q1290,600 1320,380', INK, 70) + ln('M1300,1080 Q1290,600 1320,380', '#6E4A32', 56) + ln('M1316,420 Q1150,330 1000,300 M1320,420 Q1480,340 1640,300', '#6E4A32', 26);
    s1 = ink(s1) + ink(leafy(1300, 240, 260, 31) + leafy(1050, 280, 150, 33, ['#C8553D', '#4C8A4E', '#5FA05A']) + leafy(1560, 260, 170, 35));
    if (o.nest) s1 += ink(el(1130, 320, 80, 30, '#6E4A2E', 4)) + `<g>${ol('M1150,300 Q1140,250 1180,240 Q1220,236 1236,262 L1290,268 L1238,282 Q1230,306 1196,312Z', '#1C1A20', 4)}${ci(1200,256,5,'#F3EEDF')}</g>`;
    return { s0, s1, s2: '', fy: 820 };
  };
  /* phòng làm việc ở đồn công an */
  P.office = o => {
    let s0 = wall(600, '#C8D4D8', '#6E8290');
    s0 += rc(80, 120, 360, 300, '#3A4250', 5);
    let bl = ''; for (let y = 130; y < 420; y += 22) bl += `M86,${y} H434 `;
    s0 += ln(bl, '#E8F0F2', 9, 'opacity=".85"');
    s0 += ci(800, 150, 64, '#B8302A', 5) + `<path d="M800,104 L813,140 L851,140 L820,162 L832,198 L800,176 L768,198 L780,162 L749,140 L787,140Z" fill="#F2C14A" stroke="${INK}" stroke-width="3"/>`;
    s0 += rc(980, 140, 320, 220, '#C9A27A', 5);
    [[1000, 160, '#F3EEDF'], [1100, 170, '#F6E2A0'], [1200, 160, '#F3EEDF'], [1030, 260, '#F6E2A0'], [1160, 250, '#F3EEDF']].forEach(([x, y, c]) => { s0 += rc(x, y, 80, 80, c, 2.5) + ci(x + 40, y + 6, 6, '#B8302A'); });
    s0 += rc(1380, 260, 200, 340, '#8A9298', 5) + ln('M1380,370 H1580 M1380,480 H1580', INK, 4) + rc(1460, 310, 40, 10, INK, 0) + rc(1460, 420, 40, 10, INK, 0) + rc(1460, 530, 40, 10, INK, 0);
    s0 = ink(s0) + floorTile(600, '#B8BCB4', '#8A8E86');
    s0 += `<path d="M80,420 L440,420 L760,1080 L240,1080Z" fill="#FFF6DA" opacity=".14"/>`;
    let s2 = '';
    if (!o.noDesk) s2 += ink(rc(380, 830, 840, 40, '#7A5A40', 5) + rc(400, 870, 800, 220, '#6A4A34', 5) + rc(460, 760, 160, 70, '#F3EEDF', 3) + rc(470, 744, 160, 70, '#F6E2A0', 3) + rc(900, 700, 190, 130, '#3A3E46', 5) + rc(916, 714, 158, 100, '#7AA8C8', 0) + rc(970, 830, 50, 10, '#3A3E46', 3));
    return { s0, s1: '', s2, fy: 830 };
  };
  /* căn hộ nhỏ của Liễng — đêm */
  P.home = o => {
    let s0 = wall(600, '#B8A88E', '#7A6A54') + win(1150, 140, 280, 300, { view: o.day ? 'day' : 'night' });
    s0 += rc(120, 250, 320, 30, '#7A5A40', 4) + rc(150, 190, 60, 60, '#3E78A6', 3) + rc(220, 200, 50, 50, '#C8553D', 3) + rc(290, 170, 40, 80, '#D9A93A', 3);
    s0 += rc(560, 380, 380, 220, '#6A4A3A', 5) + rc(580, 400, 340, 60, '#8A6A54', 3);
    s0 = ink(s0) + floorWood(600, '#7A5A44');
    if (!o.day) s0 += K.glow(760, 200, 500, '#FFD88A', .25);
    return { s0, s1: '', s2: o.day ? '' : `<rect x="-80" y="-80" width="1760" height="1160" fill="#10142A" opacity=".2" style="mix-blend-mode:multiply"/>`, fy: 790 };
  };

  /* nhà tang lễ: rèm trắng, bàn thờ có di ảnh, quan tài giữa phòng (o.dark: mất điện, o.cage: lồng mèo) */
  P.funeral = o => {
    const dkn = o.dark;
    let s0 = rc(-80, -80, 1760, 760, dkn ? '#2A2630' : '#E8E2D4', 0);
    let dr = ''; for (let x = -60; x < 1700; x += 90) dr += `M${x},-80 Q${x + 30},300 ${x},640 `;
    s0 += ln(dr, dkn ? '#1E1A22' : '#D2CCBE', 8);
    s0 += rc(560, 112, 480, 64, '#7A1E1A', 4) + txt(800, 156, 'VÔ CÙNG THƯƠNG TIẾC', 34, '#E8C86A', 'font-weight="bold"');
    s0 += rc(700, 190, 200, 240, '#3A2418', 6) + rc(716, 206, 168, 208, '#E9E4D6', 3) + `<svg x="716" y="206" width="168" height="208" viewBox="716 206 168 208">${K.fig('binh', 800, 470, 260, { emo: 'happy' })}</svg>`;
    s0 += rc(560, 440, 480, 30, '#5A1E18', 4) + rc(580, 470, 440, 170, '#7A1E1A', 4);
    s0 = ink(s0) + floorTile(640, dkn ? '#2E2A30' : '#B8B0A0', dkn ? '#1E1A20' : '#9A9284');
    if (!dkn) s0 += K.flame(620, 430, 1) + K.flame(980, 430, 1) + K.smoke(800, 420, 3, { c: '#E8E2D8', w: 3, h: 200 });
    let s1 = ol('M380,700 L1220,700 L1260,760 L1220,820 L380,820 L340,760Z', '#5A3420', 6) + ol('M400,660 L1200,660 L1240,700 L360,700Z', '#7A4A2E', 5) + ln('M500,680 h600', '#C9A64A', 5);
    s1 += leafy(800, 650, 90, 3, ['#F6F4EC', '#F3EEDF', '#E8E0B0', '#F6F4EC']);
    s1 = ink(s1);
    if (o.cage) { const cx = o.cage; s1 += ink(rc(cx - 80, 680, 160, 130, 'none', 0) + ln(`M${cx - 80},680 V810 M${cx - 48},680 V810 M${cx - 16},680 V810 M${cx + 16},680 V810 M${cx + 48},680 V810 M${cx + 80},680 V810 M${cx - 84},680 H${cx + 84} M${cx - 84},810 H${cx + 84}`, '#8A8E92', 6)) + K.fig('ve', cx, 800, 120, { emo: o.vemo || 'angry' }); }
    let s2 = dkn ? `<rect x="-80" y="-80" width="1760" height="1160" fill="#0A0814" opacity=".55" style="mix-blend-mode:multiply"/>` : '';
    return { s0, s1, s2, fy: 800 };
  };
  /* cổng nhà cuối hẻm — đêm (o.lit: đèn trong nhà, o.body: người nằm trong bụi cây) */
  P.gate = o => {
    let s0 = `<rect x="-80" y="-80" width="1760" height="800" fill="${K.lg(K.id('gs'), [[0, '#0C1020'], [1, '#262A44']])}"/>`;
    s0 += rc(260, 120, 1080, 560, '#3A3644', 5) + ol('M220,130 L800,-20 L1380,130Z', '#2A2632', 5);
    s0 += win(380, 240, 200, 180, { view: 'night' }) + win(1020, 240, 200, 180, { view: 'night' });
    if (o.lit !== false) s0 += rc(380, 240, 200, 180, '#F2C46A', 0, 'opacity=".65"') + K.glow(480, 330, 220, '#F2C46A', .35) + rc(1020, 240, 200, 180, '#F2C46A', 0, 'opacity=".5"');
    s0 += rc(700, 380, 200, 300, '#4A3A30', 5);
    s0 = ink(s0);
    let s1 = rc(-80, 620, 600, 120, '#4A4654', 5) + rc(1080, 620, 680, 120, '#4A4654', 5) + rc(-80, 720, 1760, 360, '#1E1C26', 0);
    let bars = ''; for (let x = 540; x < 1080; x += 34) bars += `M${x},560 V760 `;
    s1 += ln(bars, '#1A1820', 10) + ln('M520,560 H1080 M520,660 H1080', '#1A1820', 10) + rc(500, 540, 40, 230, '#2A2630', 4) + rc(1060, 540, 40, 230, '#2A2630', 4);
    s1 = ink(s1) + K.eglow(800, 760, 420, 40, '#F2C46A', .15);
    let s2 = ink(leafy(120, 820, 180, 41, ['#1E3A26', '#2A4A30', '#16301E']) + leafy(1480, 830, 190, 43, ['#1E3A26', '#2A4A30', '#16301E']));
    if (o.body) s2 = `<g transform="translate(260,880) rotate(-84) translate(-260,-880)">${K.fig('cuong', 260, 880, 300, { emo: 'sleep' })}</g>` + s2;
    return { s0, s1, s2, fy: 800 };
  };
  /* phòng trống tối: bóng đèn treo, ghế gỗ (o.chair: có người bị trói), nệm (o.mattress), tủ áo */
  P.bare = o => {
    let s0 = wall(620, o.warm ? '#9A8A74' : '#77727F', o.warm ? '#5A4A3A' : '#4A4654');
    const q = K.rng(5); let pe = ''; for (let i = 0; i < 9; i++) { const x = q() * 1500, y = 60 + q() * 380; pe += `M${x.toFixed(0)},${y.toFixed(0)} q20,-14 44,-2 q16,18 -6,30 q-26,6 -38,-28Z `; }
    s0 += fl(pe, o.warm ? '#9A8A74' : '#6A6674', 'opacity=".7"');
    if (o.wardrobe !== false) s0 += rc(1240, 160, 260, 460, '#5A3A26', 5) + ln('M1370,170 V610', INK, 4);
    s0 += win(160, 160, 220, 220, { view: 'night', bars: true });
    s0 = ink(s0) + floorWood(620, o.warm ? '#6A5240' : '#54493F');
    s0 += ln('M800,-80 V120', INK, 4) + ci(800, 140, 22, '#FFF0C8', 3) + K.glow(800, 160, 620, '#FFE0A0', .42, 'class="cflick"');
    let s1 = '';
    if (o.mattress) s1 += ink(rc(240, 700, 520, 80, '#C8C0B0', 5) + rc(250, 690, 120, 30, '#E8E0D0', 4));
    if (o.lying) s1 += `<g transform="translate(470,730) rotate(-84) translate(-470,-730)">${K.fig(o.lying, 470, 730, 260, { emo: 'sleep' })}</g>`;
    if (o.chair) s1 += ink(rc(o.chair - 70, 600, 140, 20, '#7A5A40', 4) + rc(o.chair - 70, 470, 18, 300, '#7A5A40', 4) + rc(o.chair + 52, 470, 18, 300, '#7A5A40', 4) + rc(o.chair - 60, 760, 14, 60, '#7A5A40', 3) + rc(o.chair + 46, 760, 14, 60, '#7A5A40', 3));
    let s2 = '';
    if (o.ropes) s2 += ln(`M${o.chair - 90},640 Q${o.chair},670 ${o.chair + 90},640 M${o.chair - 80},760 Q${o.chair},790 ${o.chair + 80},760`, '#C9A27A', 8);
    if (o.clothes) s2 += ink(ol('M1180,880 Q1240,780 1360,800 Q1480,780 1520,880Z', '#6A6A74', 5) + ol('M1240,860 Q1300,820 1380,840 L1360,880Z', '#4A5E3A', 4));
    s2 += `<rect x="-80" y="-80" width="1760" height="1160" fill="${K.rg(K.id('bv'), [[0, '#000', 0], [.6, '#000', 0], [1, '#000', .38]], .5, .2, .85)}"/>`;
    return { s0, s1, s2, fy: 820 };
  };
  /* trong xe ô tô ban đêm: kính chắn gió, đèn đường trôi qua, hai hàng ghế */
  P.car = o => {
    let s0 = `<rect x="-80" y="-80" width="1760" height="1160" fill="${K.lg(K.id('cs'), [[0, '#0A0E1C'], [1, '#1E2236']])}"/>` + roofsLite();
    let streaks = ''; const q = K.rng(7); for (let i = 0; i < 16; i++) { const y = 140 + q() * 340, x = q() * 1600; streaks += `<g class="cfly" style="animation-delay:${(-q() * 6).toFixed(1)}s;animation-duration:${(1.4 + q()).toFixed(1)}s">${ln(`M${(x + 1700).toFixed(0)},${y.toFixed(0)} h-${(80 + q() * 140).toFixed(0)}`, ['#FFD88A', '#FF8A6A', '#F6F2E6'][i % 3], 5, 'opacity=".75"')}</g>`; }
    s0 += streaks;
    let s1 = fl('M-80,-80 H1680 V120 Q800,60 -80,120Z', '#14121A') + fl('M-80,560 Q800,500 1680,560 V1160 H-80Z', '#1C1A22') + ln('M-80,120 Q800,60 1680,120', '#2A2834', 18);
    s1 += ol('M980,580 Q1100,540 1200,580 L1180,640 Q1100,610 1000,640Z', '#2A2834', 4) + ci(1100, 600, 70, 'none', 0, 'stroke="#3A3844" stroke-width="16"');
    s1 = ink(s1);
    let s2 = ink(ol('M200,1160 L180,700 Q190,600 320,590 L520,590 Q600,600 600,700 L620,1160Z', '#3A3440', 6) + ol('M1000,1160 L980,700 Q990,600 1120,590 L1320,590 Q1400,600 1400,700 L1420,1160Z', '#3A3440', 6) + rc(300, 520, 180, 80, '#3A3440', 5, 'rx="24"') + rc(1100, 520, 180, 80, '#3A3440', 5, 'rx="24"'));
    s2 += K.eglow(800, 900, 700, 200, '#3A6AFF', .08) + K.eglow(800, 300, 900, 260, '#FFD88A', .1, 'class="cflick"');
    return { s0, s1, s2, fy: 900 };
  };
  const roofsLite = () => { const r = K.rng(19); let d = '', w = ''; for (let x = -80; x < 1700;) { const ww = 90 + r() * 160, hh = 80 + r() * 200; d += `M${x.toFixed(0)},700 V${(480 - hh).toFixed(0)} h${ww.toFixed(0)} V700 `; for (let k = 0; k < 3; k++) if (r() < .5) w += rc(x + 14 + r() * (ww - 40), 480 - hh + 30 + r() * (hh - 40), 14, 18, '#F2C46A', 0, `opacity="${(.4 + r() * .5).toFixed(2)}"`); x += ww + 4; } return fl(d, '#121628') + w; };

  /* ---------- nhân vật ---------- */
  const TONES = {
    cold: '.62 .12 .08 0 .02  .1 .62 .14 0 .04  .12 .18 .8 0 .1  0 0 0 1 0',
    warm: '1 .1 0 0 .05  .05 .9 .05 0 .02  0 .05 .75 0 0  0 0 0 1 0',
    dark: '.3 .06 .04 0 0  .06 .3 .08 0 .01  .08 .1 .42 0 .04  0 0 0 1 0',
    sil: '0 0 0 0 .07  0 0 0 0 .05  0 0 0 0 .06  0 0 0 1 0',
  };
  function figure(f, fy, night) {
    if (Array.isArray(f)) f = { c: f[0], x: f[1], emo: f[2], dir: f[3], ...(f[4] || {}) };
    const hh = f.h || 380, y = f.y || fy;
    let g = K.fig(f.c, f.x, y, hh, { dir: f.dir || 'down', emo: f.emo || 'neutral' });
    if (f.flip) g = `<g transform="translate(${2 * f.x},0) scale(-1,1)">${g}</g>`;
    if (f.lie) g = `<g transform="translate(${f.x},${y}) rotate(${f.lie === 'r' ? 84 : -84}) translate(${-f.x},${-y})">${g}</g>`;
    const tn = f.tone || (night ? 'cold' : null);
    if (tn && TONES[tn]) g = `<g ${K.tone(K.id('t' + tn + f.x), TONES[tn])}>${g}</g>`;
    if (f.op) g = `<g opacity="${f.op}">${g}</g>`;
    if (f.glow) g = K.glow(f.x, y - hh * .5, hh * .7, f.glow, .35) + g;
    return (f.lie ? '' : K.eglow(f.x, y - 4, hh * .32, hh * .05, '#000', .35)) + g;
  }
  const mark = (x, y, t, s = 1) => `<g class="cburst" style="animation-delay:-.1s">${K.txt(x, y, t, 150 * s, '#F2C14A', `font-weight="bold" stroke="${INK}" stroke-width="${12 * s}" paint-order="stroke" stroke-linejoin="round"`)}</g>` + ln(`M${x - 90 * s},${y - 150 * s} l-30,-30 M${x},${y - 170 * s} v-40 M${x + 90 * s},${y - 150 * s} l30,-30`, INK, 8 * s);

  R('scene', o => {
    const pl = (P[o.place] || P.lobby)(o), fy = pl.fy;
    const figs = o.figs || [];
    const back = figs.filter(f => (Array.isArray(f) ? (f[4] || {}).back : f.back)).map(f => figure(f, fy, o.night)).join('');
    const mid = figs.filter(f => !(Array.isArray(f) ? (f[4] || {}).back : f.back)).map(f => figure(f, fy, o.night)).join('');
    let top = '';
    if (o.spot) top += `<rect x="-80" y="-80" width="1760" height="1160" fill="${K.rg(K.id('spt'), [[0, '#000', 0], [.35, '#000', 0], [1, '#000', .75]], o.spot[0] / 1600, (o.spot[1] || 450) / 900, o.spot[2] || .6)}"/>`;
    if (o.rays) top += `<g class="cspeed" opacity=".25">${(() => { const q = K.rng(5); let d = ''; for (let i = 0; i < 60; i++) { const t = q() * 6.28; d += `M${(800 + Math.cos(t) * 420).toFixed(0)},${(450 + Math.sin(t) * 300).toFixed(0)} L${(800 + Math.cos(t) * 1900).toFixed(0)},${(450 + Math.sin(t) * 1900).toFixed(0)} `; } return ln(d, '#fff', 5); })()}</g>`;
    (o.marks || []).forEach(([x, y, t, s]) => { top += mark(x, y, t, s || 1); });
    if (o.rain) top += K.rain(150, 4, '#C8DAEA', .5);
    return [{ d: .25, s: pl.s0 }, { d: .6, s: back + pl.s1 + mid }, { d: 1, s: pl.s2 + top }];
  });

  /* ======================================================
     CẬN CẢNH MANH MỐI
     ====================================================== */
  const C = {};
  const deskBg = (c = '#6A4A34') => { let s = rc(-80, -80, 1760, 1160, c, 0); const q = K.rng(3); let g = ''; for (let k = 0; k < 24; k++) { const y = k * 46 + q() * 10; g += `M-80,${y.toFixed(0)} C400,${(y + q() * 20).toFixed(0)} 1000,${(y - q() * 20).toFixed(0)} 1680,${(y + q() * 10).toFixed(0)} `; } return s + ln(g, dk(c, .78), 3, 'opacity=".6"'); };
  /* cửa sổ cận cảnh: chốt cài, bậu cửa, lông vũ */
  C.window = o => {
    let s0 = `<rect x="-80" y="-80" width="1760" height="1160" fill="${K.lg(K.id('sk'), [[0, '#8FC0D8'], [1, '#E4F0F2']])}"/>` + leafy(1200, 200, 380, 7) + leafy(300, 120, 260, 9, ['#C8553D', '#4C8A4E', '#D9823A']) + ln('M1700,500 Q1100,380 600,460', '#5A3A26', 40);
    let s1 = rc(-80, -80, 280, 1160, '#E8DCC0', 0) + rc(1400, -80, 280, 1160, '#E8DCC0', 0) + rc(-80, 700, 1760, 400, '#E8DCC0', 0);
    s1 += rc(200, -80, 1200, 780, 'none', 0) + ln('M200,-80 V700 H1400 V-80', '#6A4A34', 40);
    s1 += rc(160, 690, 1280, 70, '#8A6A4A', 5) + rc(160, 760, 1280, 20, '#6A4A34', 4);
    if (o.open) s1 += ol('M200,-80 L-40,20 L-40,640 L200,700Z', '#A8C8D4', 6, 'fill-opacity=".8"') + ol('M1400,-80 L1640,20 L1640,640 L1400,700Z', '#A8C8D4', 6, 'fill-opacity=".8"');
    else s1 += ln('M800,-80 V700', '#6A4A34', 30) + rc(206, -80, 1188, 780, '#DDEEF4', 0, 'opacity=".25"');
    s1 += rc(760, 280, 80, 160, '#C9A64A', 5) + ci(800, 360, 16, '#8A7A4A', 4) + (o.open ? ol('M790,280 L790,180 L810,180 L810,280Z', '#C9A64A', 4) : ol('M790,440 L790,520 L810,520 L810,440Z', '#C9A64A', 4));
    s1 += txt(800, 250, o.open ? 'chốt mở' : 'chốt cài', 30, INK, 'opacity=".55"');
    if (o.feather) {
      s1 += `<g transform="translate(980,700) rotate(-10)">${ol('M-200,0 Q-60,-50 180,-14 Q-40,30 -200,0Z', '#1E1A22', 4)}${ln('M-210,4 L190,-12', '#6A6A7A', 3)}`;
      let barbs = ''; for (let k = -180; k < 170; k += 18) barbs += `M${k},${-3 - k * .04} l${12},${-22 + Math.abs(k) * .06} M${k},${-3 - k * .04} l${12},${20 - Math.abs(k) * .06} `;
      s1 += ln(barbs, '#3A3644', 2.5) + (o.cut ? ln('M-214,-6 L-196,14', '#F3EEDF', 6) + txt(-200, 60, 'vết kéo cắt', 30, '#F3EEDF') : '') + '</g>';
    }
    return [{ d: .1, s: s0 }, { d: .8, s: `<g transform="translate(0,-120)">${ink(s1)}</g>` }];
  };
  /* quạt lông của thợ ảnh: o.n lông (12 hay 11) */
  C.fan = o => {
    let s0 = deskBg('#4A3A34');
    let s1 = ol('M300,800 Q260,460 420,360 L1180,360 Q1340,460 1300,800Z', '#C9A27A', 6) + ln('M320,540 H1280 M300,660 H1300', '#9A7A54', 5);
    s1 += rc(340, 470, 260, 180, '#F3EEDF', 4) + txt(470, 550, 'ĐẠO CỤ', 36, INK) + txt(470, 600, 'CHỤP ẢNH', 32, INK);
    const n = o.n || 12, cx = 950, cy = 700;
    let fan = '';
    for (let i = 0; i < 12; i++) {
      if (i >= n && i === (o.gap ?? 7)) continue;
      if (n < 12 && i === (o.gap ?? 7)) continue;
      const a = -160 + i * (140 / 11);
      fan += `<g transform="rotate(${a} ${cx} ${cy})">${ol(`M${cx},${cy} Q${cx + 160},${cy - 40} ${cx + 380},${cy} Q${cx + 160},${cy + 40} ${cx},${cy}Z`, '#1E1A22', 3)}${ln(`M${cx},${cy} L${cx + 380},${cy}`, '#5A5A6A', 2)}</g>`;
    }
    s1 += fan + ci(cx, cy, 30, '#C9A64A', 5);
    if (o.count) for (let i = 0; i < 12; i++) { const a = (-160 + i * (140 / 11)) * Math.PI / 180, x = cx + Math.cos(a) * 420, y = cy + Math.sin(a) * 420; s1 += i === (o.gap ?? 7) && n < 12 ? ci(x, y, 26, 'none', 0, 'stroke="#D8402F" stroke-width="5" stroke-dasharray="8 6"') + txt(x, y + 12, '?', 34, '#D8402F') : ci(x, y, 22, '#F3EEDF', 3) + txt(x, y + 10, i + 1 - (n < 12 && i > (o.gap ?? 7) ? 1 : 0), 26, INK); }
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* màn hình máy ảnh: ảnh huy hiệu, bóng lá in trên nền */
  C.photo = o => {
    let s0 = deskBg('#2E2A2A');
    let s1 = rc(260, 120, 1080, 700, '#1E1E22', 8, 'rx="40"') + rc(320, 170, 760, 560, '#0A0A0A', 4);
    const out = o.window ? ['#F6E6B0', '#E8C870'] : ['#3A3040', '#1A1418'];
    s1 += `<rect x="330" y="180" width="740" height="540" fill="${K.lg(K.id('ph'), [[0, out[0]], [1, out[1]]])}"/>`;
    if (o.window) { s1 += rc(330, 560, 740, 160, '#8A6A4A', 0); const q = K.rng(4); for (let i = 0; i < 9; i++) s1 += `<g opacity=".35">${crowLeaf(360 + q() * 680, 220 + q() * 360, q() * 180, 1 + q(), '#3A2A10')}</g>`; }
    else s1 += rc(330, 560, 740, 160, '#7A1E2A', 0) + K.glow(700, 300, 300, '#FFF2C8', .3);
    s1 += badge(700, 520, 2.4, false);
    s1 += txt(1000, 216, o.time || '07:41', 34, '#F3EEDF', 'font-family="monospace"') + ci(360, 210, 10, '#D8402F');
    s1 += ci(1200, 300, 50, '#3A3A40', 4) + ci(1200, 460, 34, '#3A3A40', 4) + rc(1160, 560, 80, 40, '#3A3A40', 4, 'rx="12"');
    s1 += ol('M120,1080 Q160,760 300,720 L380,760 L330,1080Z', SKIN, 5) + ol('M1480,1080 Q1440,760 1300,720 L1220,760 L1270,1080Z', SKIN, 5);
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* máng xối dưới cửa sổ: lá bàng khô, huy hiệu lấp ló */
  C.gutter = o => {
    let s0 = rc(-80, -80, 1760, 600, '#EDE2C8', 0) + ln('M-80,200 H1680 M-80,400 H1680', '#D8CCB0', 4) + rc(-80, 480, 1760, 600, '#C9B89A', 0);
    let s1 = ol('M-80,420 L1680,420 L1680,600 Q800,700 -80,600Z', '#8A8E92', 6) + ln('M-80,440 H1680', '#B8BCC0', 6);
    const q = K.rng(13); let lv = '';
    for (let i = 0; i < 40; i++) { const x = -60 + q() * 1720; if (o.dig && x > 640 && x < 980) continue; lv += crowLeaf(x, 430 + q() * 80, -30 + q() * 60, .9 + q() * .5, ['#C8553D', '#D9823A', '#A86A3A', '#8A5A2A'][i % 4]); }
    s1 += lv;
    if (o.dig) s1 += el(810, 500, 180, 50, '#5A5E62', 0, 'opacity=".5"');
    if (o.badge) s1 += badge(820, 470, 1.6);
    return [{ d: .2, s: ink(s0) }, { d: .9, s: ink(s1) }];
  };
  /* đệm nhung trong hộp kính */
  C.cushion = o => {
    let s0 = rc(-80, -80, 1760, 1160, '#2A1A1A', 0) + K.glow(800, 300, 700, '#FFF2C8', .3);
    let s1 = ol('M200,900 L380,380 L1220,380 L1400,900Z', '#7A1E2A', 6) + ln('M380,380 L200,900 M1220,380 L1400,900', '#5A1018', 4);
    if (o.badge) s1 += `<g transform="rotate(${o.tilt ?? -35} 800 600)">${badge(800, 600, 3.4, false)}</g>`;
    else s1 += `<g transform="rotate(${o.tilt ?? -35} 800 600)"><path d="M800,484 L902,525 L888,648 Q848,709 800,729 Q752,709 712,648 L698,525Z" fill="#5A1018" stroke="#4A0A12" stroke-width="6"/></g>`;
    s1 += ol('M200,900 L380,380', 'none', 0) + rc(160, 300, 1280, 30, '#BFD8E2', 4, 'fill-opacity=".5"');
    if (o.arrow) s1 += ln('M800,600 m-260,-220 a 300 120 -35 1 1 0.1 0', '#F2C14A', 6, 'stroke-dasharray="20 14"');
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* túi áo của Hùng: tia bạc lấp lánh → huy chương á khoa */
  C.pocket = o => {
    let s0 = rc(-80, -80, 1760, 1160, PAL.police, 0) + ln('M-80,300 H1680', '#4A6A3A', 8);
    let s1 = ol('M420,260 L1180,260 L1150,860 Q800,920 450,860Z', dk(PAL.police, .88), 6) + ol('M400,240 L1200,240 L1200,400 Q800,460 400,400Z', dk(PAL.police, .8), 6) + ci(800, 380, 22, PAL.gold, 4);
    if (o.reveal) s1 += `<g transform="rotate(-8 800 620)">${rc(700, 420, 50, 120, '#B8302A', 3)}${rc(850, 420, 50, 120, '#2E4E8A', 3)}${ci(800, 640, 110, '#C8CCD0', 6)}${ci(800, 640, 80, '#AEB4BA', 3)}${K.txt(800, 660, 'Á KHOA', 44, INK)}</g>`;
    else s1 += `<g>${el(800, 470, 120, 16, '#1A2A10', 0)}${ci(800, 460, 30, '#E8ECF0', 0)}</g><g class="cglint">${`<path d="M800,400 l8,50 l50,8 l-50,8 l-8,50 l-8,-50 l-50,-8 l50,-8Z" fill="#fff"/>`}</g>`;
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* chốt cửa phòng 203: vết hằn sợi chỉ, mẩu chỉ đỏ ở khe cửa */
  C.latch = o => {
    let s0 = rc(-80, -80, 1760, 1160, '#9A6A44', 0) + ln('M-80,200 H1680 M-80,700 H1680', '#7A5034', 6);
    let s1 = rc(260, 340, 900, 140, '#B8B4A8', 6, 'rx="20"') + rc(300, 370, 700, 80, '#8A867C', 4, 'rx="14"') + rc(820, 330, 70, 160, '#B8B4A8', 6, 'rx="10"');
    s1 += ci(860, 300, 52, '#C8C4B8', 6) + ci(860, 300, 30, '#A8A49A', 3);
    if (o.mark) s1 += el(860, 300, 52, 14, 'none', 0, 'stroke="#5A3A2A" stroke-width="4" stroke-dasharray="6 4"') + txt(1060, 230, 'vết hằn', 36, '#F3EEDF');
    s1 += rc(-80, 860, 1760, 40, '#1A1210', 0);
    if (o.thread) s1 += ln('M700,880 Q760,840 820,884 T940,876', '#D8302A', 7) + ln('M700,880 l-14,10 M940,876 l12,8 M944,874 l10,-6', '#D8302A', 3);
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* cán dao: vệt thuốc sát trùng màu nâu trong khe chuôi */
  C.knife = o => {
    let s0 = rc(-80, -80, 1760, 1160, '#4A3A30', 0) + el(900, 520, 600, 200, '#6A1E1A', 0, 'opacity=".55"');
    let s1 = `<g transform="rotate(-14 800 470)">${ol('M120,420 L760,420 L780,520 L120,520 Q80,470 120,420Z', '#3A2A1A', 6)}${ln('M200,450 H700 M200,490 H700', '#2A1A10', 3)}${ol('M780,410 L1560,452 L1560,470 L780,530Z', '#CFD6DD', 6)}${ln('M820,470 L1500,462', '#fff', 6, 'opacity=".6"')}`;
    if (o.smear) s1 += el(520, 470, 90, 16, '#9A5A2A', 0, 'opacity=".9"') + el(600, 472, 50, 10, '#B0703A', 0) + txt(520, 400, 'màu nâu · mùi hắc', 34, '#F3EEDF');
    s1 += '</g>';
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* bàn tay cậu Nhà: lòng bàn tay đẫm máu, cổ tay áo sạch */
  C.palms = () => {
    let s0 = deskBg('#5A4434');
    const hand = (x, f) => `<g transform="translate(${x},0) scale(${f},1)">${ol('M-140,1080 L-110,700 L110,700 L140,1080Z', '#7A6AA8', 6)}${ol('M-120,700 Q-140,520 -100,420 L100,420 Q140,520 120,700Z', SKIN, 6)}${ln('M-80,420 L-96,250 M-30,420 L-34,220 M20,420 L28,230 M70,420 L90,270', INK, 50)}${ln('M-80,420 L-96,250 M-30,420 L-34,220 M20,420 L28,230 M70,420 L90,270', SKIN, 38)}${ln('M-110,560 L-190,470', INK, 50)}${ln('M-110,560 L-190,470', SKIN, 38)}${el(0, 560, 100, 100, '#9A1E1A', 0, 'opacity=".85"')}${ln('M-60,440 l-20,-120 M0,430 l0,-150', '#9A1E1A', 22, 'opacity=".75"')}${rc(-118, 690, 236, 30, '#E8E0F0', 4)}</g>`;
    let s1 = hand(520, 1) + hand(1080, -1) + txt(800, 180, 'cổ tay áo sạch trơn', 44, '#F3EEDF');
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* điện thoại: tin nhắn từ số lạ */
  C.phone = o => {
    let s0 = deskBg('#3A2E2A');
    let s1 = rc(520, 60, 560, 960, '#1E1E22', 8, 'rx="60"') + rc(550, 120, 500, 820, '#E8ECF0', 4, 'rx="12"');
    s1 += rc(550, 120, 500, 80, '#3A4766', 0) + txt(800, 172, o.from || 'Số lạ', 34, '#F3EEDF');
    const lines = (o.msg || 'Bố mày định bán nhà trọ.|5 giờ về phòng mà nói|chuyện cho ra nhẽ.').split('|');
    s1 += rc(580, 250, 420, 60 + lines.length * 46, '#FFFFFF', 3, 'rx="24"');
    lines.forEach((l, i) => { s1 += txt(790, 300 + i * 46, l, 32, INK); });
    s1 += txt(980, 330 + lines.length * 46, o.time || '16:40', 24, '#8A8E92');
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* sợi chỉ đỏ buộc tóc, tay trái */
  C.thread = () => {
    let s0 = rc(-80, -80, 1760, 1160, '#E8D0B0', 0) + K.glow(500, 300, 600, '#FFF2D0', .4);
    let s1 = ol('M300,1080 Q240,500 600,200 Q900,40 1200,200 Q1500,420 1400,1080Z', '#2B1F1A', 6);
    s1 += ln('M760,320 Q800,360 840,320 Q800,300 760,320', '#D8302A', 12) + ln('M820,330 l40,90 M808,334 l10,100', '#D8302A', 8);
    s1 += ol('M200,1080 Q260,700 520,560 L640,640 Q440,780 420,1080Z', SKIN, 6) + ln('M600,580 L700,430 M630,600 L740,460 M650,630 L770,500', INK, 40) + ln('M600,580 L700,430 M630,600 L740,460 M650,630 L770,500', SKIN, 28);
    s1 += txt(520, 700, 'tay trái', 44, '#F3EEDF');
    return [{ d: .2, s: s0 }, { d: .9, s: `<g transform="translate(60,-110)">${ink(s1)}</g>` }];
  };
  /* hồ sơ người mất tích */
  C.file = o => {
    let s0 = deskBg('#5A4434');
    let s1 = `<g transform="rotate(-4 800 520)">${rc(360, 100, 880, 860, '#F3EEDF', 5)}${rc(360, 100, 880, 90, '#B8302A', 5)}${txt(800, 162, o.title || 'HỒ SƠ NGƯỜI MẤT TÍCH', 44, '#F3EEDF', 'font-weight="bold"')}`;
    const tx = o.who === false ? 420 : 700;
    if (o.who !== false) s1 += rc(420, 240, 240, 300, '#E0D8C4', 4) + `<svg x="420" y="240" width="240" height="300" viewBox="0 0 240 300">${K.fig(o.who || 'tu', 120, 420, 400, { emo: 'neutral' })}</svg>`;
    (o.lines || ['Họ tên: Nguyễn Văn Tư', 'Nghề nghiệp: thám tử tư', 'Ngày báo mất tích: 16/10']).forEach((l, i) => { s1 += `<text x="${tx}" y="${290 + i * 70}" font-family="Patrick Hand, Itim, cursive" font-size="38" fill="${INK}">${l}</text>`; });
    if (o.stain) s1 += ci(1110, 860, 70, 'none', 0, 'stroke="#8A5A2A" stroke-width="14" opacity=".55"') + `<path d="M1080,800 l-12,-26 l26,14 M1140,800 l12,-26 l-26,14" stroke="#8A5A2A" stroke-width="10" fill="none" opacity=".55"/>`;
    s1 += ln('M420,620 H1180 M420,680 H1120 M420,740 H1160 M420,800 H980', '#8A8070', 5) + '</g>';
    return [{ d: .2, s: s0 }, { d: .9, s: ink(s1) }];
  };
  /* X biến mất: thân thể in lên một mặt phẳng giữa không trung, công an vây quanh soi đèn */
  C.flat = () => {
    let s0 = `<rect x="-80" y="-80" width="1760" height="1160" fill="${K.lg(K.id('fs'), [[0, '#0A0C18'], [1, '#22263A']])}"/>` + rc(-80, 700, 1760, 400, '#16141C', 0);
    let s1 = `<g class="cbreath"><path d="M560,140 L1100,90 L1080,640 L540,690Z" fill="#DDE6F6" opacity=".16" stroke="#DDE6F6" stroke-width="3" stroke-opacity=".6"/></g>`;
    s1 += `<g transform="matrix(1,-.09,0,1,0,70)" opacity=".85">${K.fig('x', 820, 640, 460, { emo: 'neutral' }).replace('<svg ', '<svg style="filter:grayscale(1) contrast(1.4)" ')}</g>`;
    s1 += K.glow(820, 380, 380, '#C8D4F0', .25);
    const beam = (x, y, tx, ty) => `<path d="M${x},${y} L${tx - 90},${ty} L${tx + 90},${ty}Z" fill="#FFF2C8" opacity=".18"/>`;
    let s2 = beam(180, 760, 640, 360) + beam(1420, 770, 980, 330) + beam(400, 860, 820, 600);
    [[180, 860, 300], [1420, 870, 310], [420, 960, 330]].forEach(([x, y, hh], i) => { s2 += K.person(x, y, hh, { hat: 'cap', c: '#0C0A10', rim: '#5A6A9A', flip: i === 1, arms: 'hold' }); });
    return [{ d: .2, s: s0 }, { d: .6, s: s1 }, { d: 1, s: s2 }];
  };
  R('close', o => (C[o.k] || C.window)(o));
})();
