'use strict';
/* ==========================================================
   CUTART — tranh minh họa cho các đoạn cutscene (1600×900)
   Mỗi tranh trả về danh sách lớp [{ d: độ sâu 0..1, s: '<svg nội dung>' }]
   Nét mực rung (filter #ink) chỉ đặt trên phần tĩnh; phần chuyển động
   (mưa, lửa, khói, đèn) nằm ngoài filter để chạy nhẹ.
   ========================================================== */
(() => {
  const R = CUT.reg, K = CUT.K;
  const { ol, ln, fl, rc, ci, el, ink, txt } = K;
  const FONT = 'font-family="Patrick Hand, Itim, cursive"';

  /* ======================================================
     PHỐ SÀI GÒN — dãy nhà ống mặt tiền, nhà trọ ở giữa
     o.time: dawn | dusk | night · o.police · o.fire · o.car
     ====================================================== */
  const HOUSES = [
    { x: -215, w: 225, h: 470, c: '#C9A27A', sign: 'BÁNH MÌ' },
    { x: 10, w: 220, h: 440, c: '#86ABA2', sign: 'SỬA XE', tank: true },
    { x: 230, w: 180, h: 540, c: '#E2B85C', sign: 'PHỞ BÒ' },
    { x: 410, w: 175, h: 400, c: '#D9A3A0', sign: 'TẠP HÓA', tank: true },
    { x: 585, w: 250, h: 585, c: '#EAD9B4', inn: true },
    { x: 835, w: 190, h: 480, c: '#93ABC6', sign: 'CÀ PHÊ' },
    { x: 1025, w: 215, h: 420, c: '#AEB77E', sign: 'GẠO', tank: true },
    { x: 1240, w: 185, h: 550, c: '#DB9070', sign: '' },
    { x: 1425, w: 200, h: 460, c: '#B9A7CB', sign: 'GIẶT ỦI' },
    { x: 1625, w: 210, h: 510, c: '#9DB59A', sign: 'THUỐC', tank: true },
  ];
  function house(hs, i, night, lit) {
    const { x, w, h, c } = hs, top = 700 - h, r = K.rng(i * 31 + 7);
    let s = rc(x, top, w, h, c, 4);
    s += rc(x - 4, top - 16, w + 8, 20, c, 4) + fl(`M${x},${top + 4} h${w} v8 h-${w}Z`, INK, 'opacity=".18"');
    s += rc(x + w - 16, top + 4, 16, h - 4, INK, 0, 'opacity=".12"');
    if (hs.tank) s += `<g>${rc(x + w * .55, top - 66, 46, 50, '#C9CED2', 3.5, 'rx="8"')}${ln(`M${x + w * .55 + 4},${top - 50} h38 M${x + w * .55 + 4},${top - 34} h38`, INK, 2)}${rc(x + w * .55 + 6, top - 18, 6, 4, INK, 0)}${rc(x + w * .55 + 34, top - 18, 6, 4, INK, 0)}</g>`;
    // tầng trệt
    if (hs.inn) {
      s += rc(x + 24, 560, w - 48, 140, '#3A2E28', 4);
      for (let k = 0; k < 13; k++) s += ln(`M${x + 30 + k * 15},${566} v128`, '#8B7B6A', 2.5);
      s += ln(`M${x + 26},${606} H${x + w - 26} M${x + 26},${652} H${x + w - 26}`, '#8B7B6A', 2.5);
      lit.push(rc(x + 26, 562, w - 52, 136, '#F2C46A', 0, `opacity="${night ? .28 : 0}"`));
      s += rc(x + 30, 520, w - 60, 30, '#2B4A44', 3.5) + txt(x + w / 2, 543, 'NHÀ TRỌ · PHÒNG NGHỈ', 21, '#F3EEDF');
    } else {
      const op = r() > .45;
      s += rc(x + 18, 560, w - 36, 140, op ? '#4A3A30' : '#9A9A94', 4);
      if (op) {
        s += rc(x + 18, 560, w - 36, 40, '#B5B3AB', 4);
        for (let k = 0; k < 5; k++) s += ln(`M${x + 20},${566 + k * 7} H${x + w - 20}`, '#7A7872', 1.5);
        s += rc(x + 30, 640, 40, 24, '#C8553D', 3) + rc(x + w - 80, 650, 34, 22, '#3E78A6', 3);
        lit.push(rc(x + 20, 602, w - 40, 96, '#F6C873', 0, `opacity="${night ? .45 : .12}"`));
      } else for (let k = 0; k < 17; k++) s += ln(`M${x + 20},${566 + k * 8} H${x + w - 20}`, '#7A7872', 1.8);
      if (hs.sign) { s += rc(x + 14, 518, w - 28, 34, i % 2 ? '#F3EEDF' : '#B84A3E', 3.5) + txt(x + w / 2, 543, hs.sign, 24, i % 2 ? '#B84A3E' : '#F3EEDF'); }
    }
    // các tầng trên
    for (let fy = 500, k = 0; fy - 110 > top + 10; fy -= 122, k++) {
      const y0 = fy - 110;
      if ((k + i) % 2 === 0 || hs.inn) {
        s += rc(x + 20, y0 + 6, w - 40, 96, '#5E4A3E', 3.5);
        for (let j = 0; j < 4; j++) s += ln(`M${x + 24},${y0 + 16 + j * 22} H${x + w - 24}`, '#8E7A68', 2);
        const win = rc(x + w * .3, y0 + 18, w * .4, 60, night ? '#F2C46A' : '#9FC2CF', 3);
        if (night && r() > .3) lit.push(win + K.glow(x + w / 2, y0 + 48, 90, '#F2C46A', .35)); else s += win;
        s += rc(x + 10, y0 + 100, w - 20, 10, c, 3.5) + fl(`M${x + 10},${y0 + 110} h${w - 20} v5 h-${w - 20}Z`, INK, 'opacity=".25"');
        let bars = '';
        for (let bx = x + 16; bx < x + w - 12; bx += 13) bars += `M${bx},${y0 + 62} v38 `;
        s += ln(`M${x + 12},${y0 + 62} H${x + w - 12}`, INK, 4) + ln(bars, INK, 2.2);
        for (let p = 0; p < 3; p++) if (r() > .35) { const px = x + 28 + p * (w - 56) / 2; s += rc(px - 9, y0 + 46, 18, 16, '#B5643E', 2.5) + `<g>${ci(px - 6, y0 + 40, 9, '#4C8A4E', 2.5)}${ci(px + 6, y0 + 38, 10, '#5FA05A', 2.5)}${ci(px, y0 + 30, 9, '#6EB060', 2.5)}</g>`; }
        if (hs.inn && k === 0) s += rc(x + w - 70, y0 + 20, 42, 22, '#F3EEDF', 2.5) + txt(x + w - 49, y0 + 37, '204', 18, INK);
        if (hs.inn && k === 0 && !night) s += K.ln(`M${x + 30},${y0 + 70} q30,18 60,0 q30,18 60,0`, '#B84A3E', 3);   // phơi khăn
      } else {
        s += rc(x + w * .22, y0 + 14, w * .56, 76, '#3F6E5E', 3.5);
        for (let j = 0; j < 7; j++) s += ln(`M${x + w * .22 + 4},${y0 + 22 + j * 10} h${w * .26} M${x + w * .5 + 2},${y0 + 22 + j * 10} h${w * .26}`, '#6F9A86', 2);
        s += ln(`M${x + w / 2},${y0 + 14} v76`, INK, 3);
        if (r() > .5) s += rc(x + w - 58, y0 + 60, 40, 28, '#E8E4DA', 3) + ci(x + w - 38, y0 + 74, 9, '#BDB8AC', 2);
      }
    }
    if (hs.inn) {   // biển hộp đèn dọc
      const sx = x - 18, sy = top + 60;
      s += rc(sx, sy, 50, 250, '#F3EEDF', 4, 'rx="6"');
      const letters = [...'NHÀTRỌ'].map((ch, j) => txt(sx + 25, sy + 42 + j * 38 + (j > 2 ? 14 : 0), ch, 34, '#B84A3E', 'font-weight="bold"')).join('');
      s += letters;
      if (night) lit.push(K.glow(sx + 25, sy + 125, 170, '#FFD9A0', .5) + rc(sx, sy, 50, 250, '#FFF6E6', 0, 'opacity=".9" rx="6"') + letters);
    }
    return s;
  }
  function street(o) {
    const t = o.time || 'dawn', night = t !== 'dawn', id = K.id;
    const sky = {
      dawn: [[0, '#8FB0C4'], [.55, '#EDC5A2'], [1, '#F7E2BE']],
      dusk: [[0, '#2A2846'], [.55, '#6E4A6C'], [1, '#C9805E']],
      night: [[0, '#0E1322'], [.6, '#1F2740'], [1, '#33304A']],
    }[t];
    // L0 — trời + phố xa
    let s0 = `<rect width="1600" height="900" fill="${K.lg(id('sky'), sky)}"/>`;
    if (t === 'dawn') s0 += K.glow(1280, 340, 420, '#FFE6B8', .8) + ci(1280, 340, 62, '#FFF4DC');
    else {
      const r = K.rng(5);
      for (let i = 0; i < 70; i++) s0 += ci(r() * 1600, r() * 380, r() * 1.8 + .4, '#F3EEDF', 0, `opacity="${(.3 + r() * .6).toFixed(2)}"`);
      s0 += K.glow(1300, 150, 160, '#E8E4F0', .25) + ci(1300, 150, 34, '#EDE8DA');
    }
    if (o.fire) s0 += K.eglow(720, 320, 700, 420, '#FF7A30', .55, 'class="cflick"');
    const fr = K.rng(9);
    let sky2 = '', win0 = '';
    for (let x = -60; x < 1660;) {
      const w = 60 + fr() * 110, hh = 110 + fr() * 260;
      sky2 += `M${x.toFixed(0)},600 V${(560 - hh).toFixed(0)} h${w.toFixed(0)} V600 `;
      if (night) for (let k = 0; k < 6; k++) if (fr() > .5) win0 += rc(x + 8 + fr() * (w - 20), 560 - hh + 14 + fr() * (hh - 40), 6, 8, '#F2C46A', 0, `opacity="${(.4 + fr() * .5).toFixed(2)}"`);
      x += w + 6;
    }
    s0 += fl(sky2 + 'Z', { dawn: '#B6A2A6', dusk: '#3E2E4A', night: '#151A2C' }[t], `opacity="${t === 'dawn' ? .55 : 1}"`) + win0;
    // L1 — dãy nhà
    const lit = [];
    let s1 = '';
    HOUSES.forEach((hs, i) => { s1 += house(hs, i, night, lit); });
    s1 = ink(s1);
    if (night) s1 += `<rect x="-400" y="-300" width="2400" height="1020" fill="${t === 'dusk' ? '#2A2050' : '#0E1430'}" opacity="${t === 'dusk' ? .38 : .52}" style="mix-blend-mode:multiply"/>`;
    else s1 += `<rect x="-400" y="-300" width="2400" height="1020" fill="${K.lg(id('sun'), [[0, '#FFE2B0', .0], [.7, '#FFE2B0', .18], [1, '#FFB070', .25]], 1, 0)}"/>`;
    s1 += lit.join('');
    // lửa cháy nhà trọ
    if (o.fire) {
      const X = 585, Wd = 250;
      [380, 258, 136].forEach((y0, k) => { s1 += `<g>${K.glow(X + Wd / 2, y0 + 48, 200, '#FF8A3C', .6, 'class="cflick"')}${K.fire(X + Wd * .28, y0 + 82, Wd * .44, 120 + k * 10, 3 + k)}</g>`; });
      s1 += K.fire(X + 20, 700, Wd - 40, 150, 11);
      const cl = (cx, cy, sc, c) => K.cloud(cx, cy, sc, c);
      s1 = `<g opacity=".92">${cl(700, 70, 2.6, '#2A2226')}${cl(900, 20, 3.2, '#231C20')}${cl(520, 0, 2.4, '#2E2428')}${cl(760, -60, 3.6, '#1E181B')}</g>` + s1;
      s1 += `<g opacity=".55">${cl(720, 96, 1.9, '#B8502A')}</g>`;
      s1 += K.smoke(X + 70, 360, 4, { big: true, c: '#2E2629', w: 60, h: 360 }) + K.smoke(X + 180, 250, 4, { big: true, c: '#3A3034', w: 80, h: 380 }) + K.smoke(X + 120, 140, 3, { big: true, c: '#2A2326', w: 100, h: 400 });
    }
    // L2 — cột điện, dây điện
    const wr = K.rng(21);
    let s2 = '';
    [490, 1250].forEach(px => {
      s2 += rc(px - 11, 120, 22, 640, '#9A968C', 4) + rc(px - 60, 170, 120, 12, '#7A766C', 3.5) + rc(px - 46, 230, 92, 10, '#7A766C', 3.5);
      s2 += rc(px + 14, 300, 46, 64, '#6E7A70', 3.5, 'rx="6"') + ln(`M${px + 18},${316} h38 M${px + 18},${332} h38`, INK, 2);
      for (let k = 0; k < 4; k++) s2 += el(px, 380 + k * 16, 26, 7, 'none', 3);
    });
    let wd = '';
    for (let k = 0; k < 14; k++) {
      const y1 = 170 + k * 7 + wr() * 30, y2 = 172 + k * 8 + wr() * 30, sag = 70 + wr() * 90;
      wd += `M-330,${(y1 + 60).toFixed(0)} Q80,${(y1 + sag + 60).toFixed(0)} 490,${y1.toFixed(0)} `;
      wd += `M490,${y1.toFixed(0)} Q870,${(y1 + sag * 1.4).toFixed(0)} 1250,${y2.toFixed(0)} `;
      wd += `M1250,${y2.toFixed(0)} Q1590,${(y2 + sag).toFixed(0)} 1930,${(y2 + 50).toFixed(0)} `;
    }
    s2 += ln(wd, '#1B1410', 2.4) + ln('M490,240 Q870,420 1250,250 M490,250 Q870,440 1250,262', '#1B1410', 6);
    if (t === 'dawn') [[300, 268], [338, 274], [960, 352], [1000, 356], [1410, 268]].forEach(([bx, by]) => { s2 += fl(`M${bx - 9},${by - 7} q5,-6 9,0 q4,-6 9,0 q-3,6 -9,7 q-6,-1 -9,-7Z`, '#2B1F1A'); });
    s2 = ink(s2);
    // L3 — vỉa hè, xe máy, ghế nhựa
    let s3 = rc(-400, 700, 2400, 70, night ? '#4A4454' : '#CDBCA0', 4) + rc(-400, 766, 2400, 260, night ? '#2C2A33' : '#6E6870', 4);
    for (let k = -6; k < 30; k++) s3 += ln(`M${k * 70},700 l-14,66`, INK, 1.6, 'opacity=".3"');
    s3 += ln('M-400,836 H2000', night ? '#5A5666' : '#E8DCC0', 6, 'stroke-dasharray="70 60" opacity=".7"');
    // xe máy
    const moto = (mx, my, c) => `<g>${ci(mx - 62, my, 30, '#2B2622', 4)}${ci(mx - 62, my, 12, '#9A968C', 3)}${ci(mx + 62, my, 30, '#2B2622', 4)}${ci(mx + 62, my, 12, '#9A968C', 3)}${ol(`M${mx - 70},${my - 20} Q${mx - 60},${my - 70} ${mx - 10},${my - 66} L${mx + 40},${my - 66} Q${mx + 72},${my - 60} ${mx + 80},${my - 26} L${mx + 30},${my - 20} Q${mx},${my - 40} ${mx - 20},${my - 20} Z`, c)}${ol(`M${mx - 40},${my - 70} Q${mx - 10},${my - 86} ${mx + 26},${my - 76} L${mx + 22},${my - 66} L${mx - 36},${my - 64}Z`, '#2B2622')}${ln(`M${mx + 64},${my - 40} L${mx + 86},${my - 104} L${mx + 70},${my - 110}`, INK, 6)}${ci(mx + 92, my - 82, 8, '#F2E6A0', 3)}</g>`;
    s3 += moto(430, 780, '#B84A3E') + moto(1110, 790, '#3E78A6');
    const stool = (sx, sy, c) => ol(`M${sx - 20},${sy - 40} h40 l-6,40 h-6 l-2,-26 h-12 l-2,26 h-6Z`, c, 3.5);
    s3 += stool(220, 760, '#C8553D') + stool(268, 762, '#3E78A6') + rc(150, 716, 60, 10, '#C8553D', 3) + ln('M156,726 l-6,36 M204,726 l6,36', INK, 3);
    if (!night) s3 += `<g>${ci(1490, 690, 26, '#5FA05A', 3)}${ci(1520, 676, 30, '#4C8A4E', 3)}${rc(1480, 690, 52, 36, '#B5643E', 3)}</g>`;
    // đèn đường
    s3 += ln('M1380,720 V240 Q1380,200 1340,196 L1300,198', '#3A3632', 9) + ol('M1272,190 h48 l-8,16 h-32 Z', '#5A5650', 3);
    let s4 = '';
    if (night) {
      s4 += `<path d="M1282,206 L1180,730 L1430,730 L1318,206Z" fill="${K.lg(id('cone'), [[0, '#FFE6A8', .5], [1, '#FFE6A8', 0]])}"/>` + K.eglow(1300, 740, 170, 34, '#FFE6A8', .45) + K.glow(1296, 204, 40, '#FFF0C8', .9);
      s4 += K.eglow(720, 850, 200, 24, '#F2C46A', .22) + K.eglow(1300, 860, 120, 20, '#FFE6A8', .25);
    }
    // công an phong tỏa
    if (o.police) {
      s3 += ln('M590,600 L835,650 M590,650 L835,600', '#E8C24A', 12) + ln('M590,600 L835,650 M590,650 L835,600', INK, 2, 'stroke-dasharray="14 10"');
      s3 += K.person(660, 780, 150, { hat: 'cap', c: '#1E2530' }) + K.person(760, 782, 156, { hat: 'cap', c: '#1E2530', arms: 'hold' });
      [[120, 760, 140, {}], [170, 764, 120, { hair: 'long' }], [1000, 770, 150, { hair: 'bun' }], [1050, 768, 128, {}], [1500, 772, 146, { hat: 'cone' }]].forEach(([px, py, ph, oo]) => { s3 += K.person(px, py, ph, { c: '#191622', ...oo }); });
      s3 += K.person(905, 330, 70, { c: '#191622' }) + K.person(1320, 382, 64, { c: '#191622', hair: 'long' });
      // xe công an
      const cx = 1250, cy = 870;
      s3 += `<g>${ol(`M${cx - 230},${cy - 30} Q${cx - 226},${cy - 92} ${cx - 160},${cy - 98} L${cx - 110},${cy - 150} L${cx + 90},${cy - 150} L${cx + 150},${cy - 96} Q${cx + 230},${cy - 90} ${cx + 236},${cy - 30} Z`, '#E9E6DE')}${ol(`M${cx - 96},${cy - 140} L${cx - 10},${cy - 140} L${cx - 10},${cy - 100} L${cx - 140},${cy - 100}Z M${cx + 6},${cy - 140} L${cx + 84},${cy - 140} L${cx + 124},${cy - 100} L${cx + 6},${cy - 100}Z`, '#38465A', 3.5)}${rc(cx - 226, cy - 76, 460, 18, '#2E5A9A', 0)}${txt(cx, cy - 46, 'CẢNH SÁT', 30, '#2E5A9A', 'font-weight="bold"')}${ci(cx - 140, cy - 22, 36, '#1E1A18', 4)}${ci(cx + 140, cy - 22, 36, '#1E1A18', 4)}${rc(cx - 50, cy - 168, 46, 18, '#D8402F', 3)}${rc(cx + 4, cy - 168, 46, 18, '#3E6EC8', 3)}</g>`;
      s4 += `<g class="cpolr">${K.glow(cx - 27, cy - 160, 120, '#FF4A3A', .9)}${K.eglow(400, 420, 900, 520, '#FF3A2A', .42)}</g><g class="cpolb">${K.glow(cx + 27, cy - 160, 120, '#4A8AFF', .9)}${K.eglow(1200, 420, 900, 520, '#3A6AFF', .42)}</g>`;
    }
    if (o.fire) {
      s4 += K.eglow(720, 520, 820, 520, '#FF7A30', .3, 'class="cflick"') + K.embers(46, 4, 520, 80, 420, 640);
      s4 += `<g class="cpolr">${K.glow(1560, 760, 160, '#FF4A3A', .7)}</g><g class="cpolb">${K.glow(1500, 760, 160, '#4A8AFF', .7)}</g>`;
      // ô tô phóng đi
      const cx = 250, cy = 850;
      s3 += `<g>${ol(`M${cx - 190},${cy - 26} Q${cx - 190},${cy - 80} ${cx - 130},${cy - 84} L${cx - 90},${cy - 128} L${cx + 70},${cy - 128} L${cx + 120},${cy - 84} Q${cx + 196},${cy - 80} ${cx + 198},${cy - 26} Z`, '#2A2E3A')}${ci(cx - 110, cy - 20, 30, '#141210', 4)}${ci(cx + 116, cy - 20, 30, '#141210', 4)}${rc(cx + 180, cy - 70, 16, 18, '#FF3A2A', 3)}${ln(`M${cx - 120},${cy - 84} L${cx - 84},${cy - 124} L${cx + 66},${cy - 124} L${cx + 114},${cy - 84}`, '#FF9A50', 4, 'opacity=".8"')}</g>`;
      s4 += K.glow(cx + 190, cy - 60, 90, '#FF3A2A', .8) + ln(`M${cx + 230},${cy - 110} h220 M${cx + 240},${cy - 70} h300 M${cx + 230},${cy - 30} h180`, '#F3EEDF', 3, 'opacity=".35"');
    }
    s3 = ink(s3);
    const Z = s => `<g transform="translate(800,668) scale(.78) translate(-800,-700)">${s}</g>`;
    return [{ d: .12, s: s0 }, { d: .45, s: Z(s1) }, { d: .7, s: Z(s2) }, { d: 1, s: Z(s3 + s4) }];
  }
  R('street', street);

  /* ======================================================
     ĐẦU GIƯỜNG — vệt bụi tròn nơi chiếc đồng hồ từng nằm
     ====================================================== */
  R('nightstand', () => {
    const id = K.id;
    let s0 = rc(-50, -50, 1700, 600, '#E3CFA8', 0);
    for (let y = 20; y < 520; y += 64) for (let x = (y / 64 % 2) * 40; x < 1600; x += 80) s0 += `<path d="M${x},${y} l8,-10 l8,10 l-8,10Z" fill="#C9AE84" opacity=".55"/>`;
    s0 += rc(-50, 470, 1700, 34, '#A87C52', 4);
    // nắng xuyên song cửa
    let beams = '';
    [[620, 120], [840, 120], [1060, 120], [1280, 120]].forEach(([bx, bw]) => { beams += `M${bx},-40 L${bx + bw},-40 L${bx + bw - 520},1160 L${bx - 520},1160Z `; });
    const sun = `<path d="${beams}" fill="${K.lg(id('beam'), [[0, '#FFF6DA', .75], [1, '#FFE2A8', .35]])}" style="mix-blend-mode:screen"/>`;
    s0 = ink(s0) + sun;
    // mặt bàn gỗ
    let s1 = `<path d="M-60,520 H1660 V1160 H-60Z" fill="#9A6A3E"/>` + rc(-60, 500, 1720, 26, '#B8875A', 4);
    const r = K.rng(4);
    let grain = '';
    for (let k = 0; k < 22; k++) { const y = 540 + k * 19 + r() * 8; grain += `M-60,${y.toFixed(0)} C300,${(y + r() * 20 - 10).toFixed(0)} 700,${(y + r() * 26 - 13).toFixed(0)} 1000,${(y + r() * 16).toFixed(0)} S1500,${(y - 8).toFixed(0)} 1660,${(y + r() * 10).toFixed(0)} `; }
    s1 += ln(grain, '#6E4626', 2, 'opacity=".45"') + el(1180, 640, 60, 14, 'none', 0, `stroke="#6E4626" stroke-width="2" opacity=".5"`);
    // lớp bụi mỏng, chừa vòng tròn sạch
    const cx = 830, cy = 705, rx = 132, ry = 44;
    let dust = '';
    for (let i = 0; i < 3200; i++) {
      const x = -40 + r() * 1680, y = 528 + r() * 600, q = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2;
      if (q < 1.05 || (q < 1.6 && r() > .5)) continue;
      dust += `M${x.toFixed(0)},${y.toFixed(0)}h${(1 + r() * 2.5).toFixed(1)} `;
    }
    s1 += `<path d="M-60,528 H1660 V1160 H-60Z" fill="#D9C8A8" opacity=".16"/>` + ln(dust, '#EDE2CC', 2.6, 'opacity=".7"');
    s1 += el(cx, cy, rx, ry, '#875632', 0) + el(cx, cy, rx, ry, 'none', 0, `stroke="#D9C8A8" stroke-width="5" opacity=".55"`);
    s1 += ln(`M${cx + rx - 6},${cy + 6} C${cx + 190},${cy + 30} ${cx + 230},${cy - 10} ${cx + 290},${cy + 26} S${cx + 380},${cy + 70} ${cx + 420},${cy + 44}`, '#8C5B33', 9);
    s1 += el(cx - 30, cy - 10, 60, 10, '#B9875A', 0, 'opacity=".5"');
    // cốc nước
    const gx = 360, gy = 640;
    s1 += el(gx + 10, gy + 128, 78, 16, INK, 0, 'opacity=".2"');
    s1 += `<g>${ol(`M${gx - 60},${gy - 120} L${gx - 48},${gy + 118} Q${gx},${gy + 134} ${gx + 48},${gy + 118} L${gx + 60},${gy - 120}`, '#CFE3E8', 4, 'fill-opacity=".45"')}${ol(`M${gx - 56},${gy - 40} L${gx - 48},${gy + 118} Q${gx},${gy + 134} ${gx + 48},${gy + 118} L${gx + 56},${gy - 40} Q${gx},${gy - 28} ${gx - 56},${gy - 40}Z`, '#8FC3CF', 3, 'fill-opacity=".55"')}${el(gx, gy - 120, 60, 14, '#E8F2F2', 4, 'fill-opacity=".6"')}${ln(`M${gx - 36},${gy - 90} L${gx - 28},${gy + 90}`, '#fff', 7, 'opacity=".7"')}</g>`;
    // tờ báo gấp
    s1 += `<g transform="rotate(-8 1240 760)">${rc(1080, 690, 330, 210, '#EFE8D6', 4)}${rc(1100, 710, 290, 44, '#D9D0BC', 0)}${txt(1245, 745, 'TIN SÁNG', 38, INK, 'font-weight="bold"')}${ln('M1100,775 h140 M1100,795 h140 M1100,815 h120 M1100,835 h140 M1100,855 h100 M1260,775 h130 M1260,795 h130 M1260,815 h110', '#8A8070', 4)}${rc(1260, 830, 130, 50, '#BDB4A0', 3)}</g>`;
    // chìa khóa phòng 204
    s1 += `<g transform="rotate(14 560 800)">${ci(520, 800, 22, 'none', 0, `stroke="#C9A64A" stroke-width="7"`)}${ln('M542,800 h96 M612,800 v16 M628,800 v12', '#C9A64A', 9)}${ol('M470,776 l-80,-16 q-10,0 -12,12 l-8,46 q0,10 10,12 l80,12Z', '#C8553D', 4)}${txt(432, 816, '204', 30, '#F3EEDF', 'transform="rotate(8 432 806)"')}</g>`;
    s1 = ink(s1) + `<path d="${beams}" fill="#FFF0C8" opacity=".22" style="mix-blend-mode:screen"/>`;
    const s2 = K.motes(46, 3, 200, 60, 1200, 700, '#FFF6DA', 3.2);
    const up = x => `<g transform="translate(0,-170)">${x}</g>`;
    return [{ d: .25, s: up(s0) }, { d: .8, s: up(s1) }, { d: 1, s: s2 }];
  });

  /* ======================================================
     HAI BÀN TAY — ông Tư chìa tay, cô quản lý với tới
     ====================================================== */
  const hand = (palm, fingers, thumb, skin, fw) => {
    const out = fingers.concat([thumb]).map(d => ln(d, INK, fw + 8)).join('');
    const inn = fingers.concat([thumb]).map(d => ln(d, skin, fw)).join('');
    return `<path d="${palm}" fill="${skin}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>${out}<path d="${palm}" fill="${skin}"/>${inn}`;
  };
  R('hands', () => {
    const id = K.id;
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('bg'), [[0, '#140E0C'], [.6, '#24180F'], [1, '#1A120E']])}"/>`;
    s0 += ln('M-60,690 H1660', '#3A2A20', 4) + ln('M200,690 L-200,960 M520,690 L420,960 M840,690 L860,960 M1160,690 L1300,960 M1480,690 L1740,960', '#2E2219', 3);
    s0 += rc(1180, 200, 150, 490, '#3A2A1E', 4) + rc(1196, 214, 118, 476, '#E8B86A', 0, 'opacity=".55"');
    s0 += `<path d="M1196,690 L1314,690 L1500,960 L1080,960Z" fill="#E8B86A" opacity=".16"/>` + K.glow(1255, 420, 380, '#E8B86A', .22);
    // tay ông Tư (bên phải, ngửa lòng)
    const skinT = '#E2BE95';
    let s1 = ol('M1720,380 L1130,436 Q1110,500 1130,566 L1720,660 Z', '#7A5C3A', 5);
    s1 += ln('M1300,430 Q1320,500 1290,580 M1480,410 Q1500,520 1470,620', '#5E4428', 4);
    s1 += ol('M1130,436 L1088,446 Q1074,500 1088,556 L1130,566 Q1110,500 1130,436Z', '#E8E0CC', 4);
    s1 += hand('M1092,452 Q1010,440 950,462 Q900,486 905,520 Q930,552 1000,558 Q1060,562 1092,550 Z',
      ['M955,470 Q900,452 860,460', 'M936,494 Q880,486 840,496', 'M930,516 Q880,518 846,532', 'M942,538 Q902,548 874,562'], 'M1012,454 Q988,418 948,410', skinT, 25);
    s1 += ln('M1004,482 Q965,500 930,503 M1046,504 Q996,524 954,534 M880,456 q4,6 0,12 M862,490 q4,6 0,12 M866,526 q4,6 0,12', '#9A7650', 2.6);
    // tay cô quản lý (bên trái, úp xuống, với tới)
    const skinQ = '#EBCDAA';
    s1 += ol('M-120,170 L520,322 Q548,374 512,424 L-120,340 Z', '#B84A3E', 5) + ln('M120,240 Q140,300 110,350 M330,290 Q350,350 320,400', '#8E3328', 4);
    s1 += hand('M516,330 Q600,344 652,382 Q676,408 652,430 Q600,448 510,424 Z',
      ['M650,392 Q700,410 742,428', 'M656,410 Q706,432 750,452', 'M648,426 Q690,448 728,470', 'M632,440 Q664,460 690,482'], 'M588,428 Q616,462 652,472', skinQ, 19);
    s1 += ln('M528,326 Q544,374 518,424', '#C8302A', 6) + ln('M520,424 q-8,22 6,38 M522,424 q12,18 2,34', '#C8302A', 3.5);
    s1 = ink(s1) + ln('M1110,446 Q1000,436 950,456', '#FFE0A8', 3, 'opacity=".6"') + ln('M540,330 Q610,344 650,378', '#FFE0A8', 3, 'opacity=".5"');
    const s2 = K.glow(800, 460, 260, '#FFD9A0', .28, 'class="cflick"') + K.motes(30, 8, 300, 200, 1000, 500, '#FFE6B8', 2.6);
    return [{ d: .2, s: s0 }, { d: .85, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     Ô CỬA SÁNG TRÊN LẦU — Bình cúi xuống; dưới hẻm hai bóng người rời đi
     ====================================================== */
  R('upwindow', () => {
    const id = K.id;
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#0C1020'], [1, '#232A40']])}"/>`;
    s0 += ci(230, 190, 30, '#E8E2D0') + K.glow(230, 190, 140, '#E8E2D0', .2);
    // tường nhà trọ (mảng lớn bên phải)
    let s1 = rc(620, -60, 1100, 700, '#3A3640', 5) + rc(600, 620, 1120, 26, '#2E2A34', 4);
    for (let y = 40; y < 620; y += 46) s1 += ln(`M620,${y} H1720`, '#2C2932', 2);
    s1 += rc(900, 120, 300, 260, '#2B1F1A', 6) + rc(916, 136, 268, 228, '#F2C46A', 0);
    // Bình cúi gập người nhìn xuống sàn (chỉ thấy nửa trên qua khung cửa)
    s1 += `<g fill="#3A2A22"><path d="M930,366 Q936,268 1010,236 Q1070,214 1112,250 L1130,300 Q1090,300 1060,322 L1046,366Z"/><circle cx="1124" cy="282" r="30"/><path d="M1096,262 Q1112,236 1146,248 Q1162,262 1154,286Z"/><path d="M1150,290 l22,14 l-20,4Z"/><path d="M1040,300 Q1090,330 1120,360" stroke="#3A2A22" stroke-width="22" stroke-linecap="round" fill="none"/></g>`;
    s1 += ln('M916,250 H1184 M1050,136 V364', '#2B1F1A', 6) + rc(890, 372, 320, 18, '#4A4450', 4);
    s1 += rc(1330, 120, 220, 200, '#22202A', 5) + ln('M1440,120 v200 M1330,220 h220', '#2B1F1A', 4);
    s1 = ink(s1) + K.glow(1050, 250, 330, '#F2C46A', .35);
    // hẻm dưới: đèn đường, hai người đi xa
    let s2 = rc(-60, 640, 1720, 340, '#1C1A22', 0) + ln('M-60,640 H1660', '#3A3644', 4);
    s2 += ln('M560,640 V300 Q560,272 530,270 L500,272', '#2A2630', 8) + ol('M476,264 h44 l-6,14 h-32Z', '#3A3640', 3);
    s2 += `<path d="M484,280 L380,700 L640,700 L512,280Z" fill="${K.lg(id('lc'), [[0, '#FFE6A8', .45], [1, '#FFE6A8', 0]])}"/>` + K.eglow(505, 712, 180, 34, '#FFE6A8', .35) + K.glow(498, 278, 36, '#FFF0C8', .9);
    s2 += K.eglow(1050, 700, 220, 40, '#F2C46A', .14);
    const tu = K.person(330, 742, 170, { hat: 'fedora', coat: true, pose: 'walk', c: '#0E0B0A', flip: true, rim: '#E0B070' });
    const ql = K.person(410, 748, 150, { hair: 'long', pose: 'walk', bag: true, c: '#0E0B0A', flip: true, rim: '#E0B070' });
    s2 += `<path d="M330,742 L300,900 L350,900 L344,740Z M410,748 L400,910 L446,910 L422,746Z" fill="#000" opacity=".35"/>`;
    s2 = ink(s2) + tu + ql;
    return [{ d: .1, s: s0 }, { d: .55, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     PHỐ HOA NGÀY 20/10 — Liễng đi ngược dòng, tay cầm hoa cúc trắng
     ====================================================== */
  R('flowers', () => {
    const id = K.id, r = K.rng(12);
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#0E1226'], [1, '#2A2440']])}"/>`;
    for (let x = -60; x < 1660;) { const w = 70 + r() * 110, hh = 160 + r() * 240; s0 += rc(x, 520 - hh, w, hh + 60, '#161A2C', 0); for (let k = 0; k < 8; k++) if (r() > .45) s0 += rc(x + 6 + r() * (w - 16), 530 - hh + r() * (hh - 30), 7, 9, '#F2C46A', 0, `opacity="${(.3 + r() * .6).toFixed(2)}"`); x += w + 4; }
    // dãy hàng quán ấm áp
    let s1 = '';
    [[-40, '#7A3A2E'], [300, '#5E4A2E'], [640, '#6E2E3A'], [980, '#4A3A2E'], [1320, '#6A3A28']].forEach(([x, c], i) => {
      s1 += rc(x, 300, 340, 300, c, 4) + rc(x + 20, 400, 300, 200, '#F6C873', 0, 'opacity=".75"') + rc(x - 6, 360, 352, 36, i % 2 ? '#B84A3E' : '#D9A93A', 4);
      s1 += txt(x + 170, 388, ['HOA TƯƠI', 'QUÀ TẶNG', 'SHOP HOA', 'BÁNH KEM', 'HOA TƯƠI'][i], 28, i % 2 ? '#F3EEDF' : INK);
    });
    s1 = ink(s1) + rc(-60, 590, 1720, 400, '#2A2230', 0);
    s1 += `<g>${rc(420, 200, 760, 70, '#B84A3E', 4)}${txt(800, 248, 'MỪNG NGÀY PHỤ NỮ VIỆT NAM 20 · 10', 38, '#F6E2A0', 'font-weight="bold"')}</g>`;
    s1 += K.bulbs(-60, 170, 400, 300, 820, 160, 16, 1) + K.bulbs(820, 160, 1220, 300, 1680, 170, 16, 2) + K.bulbs(-60, 300, 800, 430, 1660, 300, 28, 3);
    // sạp hoa
    let s2 = '';
    const bouquet = (bx, by, sc, cols) => { let g = ''; for (let k = 0; k < 9; k++) { const a = k / 9 * 6.28, rr = 16 + (k % 3) * 8; g += ci(bx + Math.cos(a) * rr * sc, by + Math.sin(a) * rr * .6 * sc - 10 * sc, 11 * sc, cols[k % cols.length], 2.5); } return ol(`M${bx - 30 * sc},${by - 8 * sc} L${bx},${by + 60 * sc} L${bx + 30 * sc},${by - 8 * sc}Z`, '#C9A27A', 3) + `<g>${ci(bx - 20 * sc, by - 14 * sc, 9 * sc, '#4C8A4E', 2)}${ci(bx + 22 * sc, by - 12 * sc, 9 * sc, '#4C8A4E', 2)}</g>` + g; };
    [[120, 640], [330, 650], [1160, 646], [1400, 640]].forEach(([x, y], i) => {
      s2 += rc(x - 120, y, 240, 90, '#5A3A2A', 4);
      for (let k = 0; k < 4; k++) s2 += rc(x - 105 + k * 56, y - 30, 46, 40, '#7A8A9A', 3) + bouquet(x - 82 + k * 56, y - 40, 1, [['#D8402F', '#F07A7A'], ['#F6D04A', '#F3EEDF'], ['#F49AB8', '#D8402F'], ['#F3EEDF', '#F49AB8']][(k + i) % 4]);
    });
    s2 = ink(s2);
    [[520, 830, 230, { hair: 'long', flower: '#F07A7A' }], [580, 834, 250, { hat: 'cap', arms: 'hold' }], [930, 820, 210, { hair: 'bun', flower: '#F6D04A' }], [990, 826, 236, { arms: 'hold' }], [250, 860, 260, { hat: 'cone' }], [1360, 858, 250, { hair: 'long', flower: '#F49AB8' }]].forEach(([x, y, hh, oo], i) => {
      s2 += K.person(x, y, hh, { c: '#2A1A1E', rim: '#F6C873', pose: i % 2 ? 'walk' : 'stand', flip: i % 3 === 0, ...oo });
    });
    // Liễng (quay lưng, đứng lặng giữa dòng người — ánh lạnh)
    const L = 1110, Ly = 718, Lh = 410, k = Lh / 190;
    let s3 = K.eglow(L, Ly - Lh * .5, 240, 330, '#8FB7D8', .2) + K.eglow(L, Ly - 6, 150, 22, '#000', .5);
    s3 += `<g ${K.cold()}>${K.fig('lieng', L, Ly, Lh, { dir: 'up' })}</g>`;
    const hx = L + 31 * k, hy = Ly - 34 * k, fx = hx + 8, fy = Ly + 4;
    s3 += ln(`M${hx},${hy} L${fx},${fy}`, '#5C8A4E', 5);
    let pet = ''; for (let j = 0; j < 20; j++) { const a = j / 20 * 6.28, px = (fx + Math.cos(a) * 19).toFixed(0), py = (fy + Math.sin(a) * 19).toFixed(0); pet += `<ellipse cx="${px}" cy="${py}" rx="15" ry="5" transform="rotate(${(a * 57.3).toFixed(0)} ${px} ${py})" fill="#F6F4EC" stroke="${INK}" stroke-width="1.6"/>`; }
    s3 = K.glow(fx, fy, 80, '#FFFFFF', .35) + s3 + pet + ci(fx, fy, 9, '#E8E0B0', 1.5) + ci(hx, hy, 6 * k, '#9AA4A8', 3);
    const bok = '';
    return [{ d: .1, s: s0 }, { d: .35, s: s1 }, { d: .65, s: s2 }, { d: 1, s: s3 + bok }];
  });

  /* ======================================================
     TỔ QUẠ TRÊN CÂY BÀNG — huy hiệu bạc lấp lánh
     ====================================================== */
  const leaf = (x, y, a, sc, c) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${sc})"><path d="M0,0 Q22,-30 60,-34 Q100,-30 104,0 Q100,30 60,34 Q22,30 0,0Z" fill="${c}" stroke="${INK}" stroke-width="3"/><path d="M4,0 H96 M40,0 l16,-18 M40,0 l16,18 M68,0 l14,-16 M68,0 l14,16" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".45"/></g>`;
  const rosette = (x, y, sc, r, red) => { let g = ''; for (let k = 0; k < 7; k++) g += leaf(x, y, k * 51 + r() * 20, sc * (.8 + r() * .4), red && k % 3 === 0 ? ['#C8553D', '#D9823A'][k % 2] : ['#4C8A4E', '#5FA05A', '#3E7A44'][k % 3]); return g; };
  R('crow', () => {
    const id = K.id, r = K.rng(31);
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#6FA8CF'], [1, '#CFE6F0']])}"/>`;
    s0 += `<g class="cdrift">${K.cloud(300, 160, 1.4)}${K.cloud(1100, 110, 1.1, '#fff', .9)}${K.cloud(1450, 260, .9, '#fff', .8)}</g>`;
    let sb = rc(-60, 80, 520, 900, '#EDE2C8', 5) + ol('M-80,90 L480,90 L500,40 L-80,40Z', '#B85A3E', 5);
    sb += rc(180, 260, 200, 260, '#5E7A8A', 5) + rc(196, 276, 168, 228, '#BFD8E2', 0) + ln('M280,276 V504 M196,390 H364', INK, 5);
    sb += ol('M380,262 L470,240 L470,530 L380,518Z', '#9FC2CF', 5);
    s0 += ink(sb);
    // cành bàng
    const br = 'M1700,620 Q1300,600 1060,560 Q900,540 700,580 Q560,610 380,560', br2 = 'M1060,560 Q1100,420 1240,330 M700,580 Q640,700 560,780';
    let s1 = ln(br, INK, 46) + ln(br, '#6E4A32', 36) + ln(br2, INK, 26) + ln(br2, '#6E4A32', 18) + ln('M1300,600 Q1360,480 1480,440', INK, 18) + ln('M1300,600 Q1360,480 1480,440', '#6E4A32', 11);
    s1 += ln('M1600,612 Q1300,592 1060,552 Q900,532 700,572', '#8E6A4A', 5, 'opacity=".6"');
    s1 = ink(s1);
    const lv = rosette(1240, 320, 1.3, r, true) + rosette(1480, 430, 1.2, r) + rosette(560, 790, 1.2, r, true) + rosette(400, 560, 1.1, r) + rosette(1640, 640, 1.4, r, true) + rosette(1180, 760, 1.1, r);
    s1 += ink(lv);
    // tổ
    let s2 = '';
    const nx = 880, ny = 540;
    s2 += el(nx, ny + 10, 150, 56, '#6E4A2E', 5);
    let tw = ''; for (let k = 0; k < 40; k++) { const a = r() * 3.14, x0 = nx - 150 + r() * 300, y0 = ny - 10 + r() * 50; tw += `M${x0.toFixed(0)},${y0.toFixed(0)} q${(Math.cos(a) * 40).toFixed(0)},${(-10 + r() * 20).toFixed(0)} ${(Math.cos(a) * 80).toFixed(0)},${(Math.sin(a) * 10).toFixed(0)} `; }
    s2 += ln(tw, '#3E2A1A', 3.5) + el(nx, ny - 14, 120, 28, '#3E2A1A', 0);
    // kho báu trong tổ
    s2 += `<g transform="rotate(-12 ${nx - 50} ${ny - 26})">${rc(nx - 92, ny - 34, 52, 14, '#3E78A6', 3, 'rx="6"')}</g><g transform="rotate(20 ${nx + 70} ${ny - 26})">${rc(nx + 50, ny - 34, 46, 14, '#C8553D', 3, 'rx="6"')}</g>`;
    s2 += ci(nx + 10, ny - 30, 16, 'none', 0, `stroke="#F49AB8" stroke-width="6"`);
    s2 += `<g transform="rotate(-25 ${nx + 100} ${ny - 34})">${ci(nx + 100, ny - 34, 12, 'none', 0, 'stroke="#C9A64A" stroke-width="5"')}${ln(`M${nx + 110},${ny - 30} h40 M${nx + 138},${ny - 30} v10`, '#C9A64A', 6)}</g>`;
    const badge = `<g transform="translate(${nx - 30},${ny - 48})"><path d="M0,-34 L30,-22 L26,14 Q14,32 0,38 Q-14,32 -26,14 L-30,-22Z" fill="#D8DEE4" stroke="${INK}" stroke-width="4"/><path d="M0,-18 L6,-4 L20,-4 L9,5 L13,19 L0,11 L-13,19 L-9,5 L-20,-4 L-6,-4Z" fill="#9AA8B4" stroke="${INK}" stroke-width="2"/><path d="M-18,-20 L-6,-26" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>`;
    s2 = ink(s2 + badge) + `<g class="cglint" style="animation-delay:-.4s">${K.glow(nx - 46, ny - 74, 30, '#fff', 1)}<path d="M${nx - 46},${ny - 104} L${nx - 41},${ny - 79} L${nx - 16},${ny - 74} L${nx - 41},${ny - 69} L${nx - 46},${ny - 44} L${nx - 51},${ny - 69} L${nx - 76},${ny - 74} L${nx - 51},${ny - 79}Z" fill="#fff"/></g><g class="cglint" style="animation-delay:-1.2s"><path d="M${nx - 6},${ny - 40} l3,12 l12,3 l-12,3 l-3,12 l-3,-12 l-12,-3 l12,-3Z" fill="#fff"/></g>`;
    // con quạ
    const qx = 1110, qy = 540;
    let cr = ln(`M${qx - 20},${qy - 20} L${qx - 26},${qy + 10} M${qx + 20},${qy - 20} L${qx + 18},${qy + 10}`, '#2B2622', 6);
    cr += ol(`M${qx - 70},${qy - 120} Q${qx - 92},${qy - 60} ${qx - 40},${qy - 20} Q${qx + 10},${qy} ${qx + 60},${qy - 40} L${qx + 170},${qy - 10} L${qx + 160},${qy - 34} L${qx + 186},${qy - 40} L${qx + 90},${qy - 82} Q${qx + 50},${qy - 150} ${qx - 10},${qy - 150} Q${qx - 50},${qy - 150} ${qx - 70},${qy - 120}Z`, '#1C1A20', 5);
    cr += ln(`M${qx - 30},${qy - 110} Q${qx + 30},${qy - 120} ${qx + 90},${qy - 76} M${qx - 10},${qy - 80} Q${qx + 40},${qy - 84} ${qx + 100},${qy - 56}`, '#4A5A7A', 4, 'opacity=".8"');
    const head = `<g transform="rotate(-24 ${qx - 60} ${qy - 150})">${ci(qx - 60, qy - 166, 46, '#1C1A20', 5)}${ol(`M${qx - 100},${qy - 172} L${qx - 168},${qy - 156} L${qx - 100},${qy - 146}Z`, '#3A3438', 4)}${ci(qx - 76, qy - 176, 9, '#F3EEDF', 2.5)}${ci(qx - 78, qy - 176, 4.5, INK)}<path d="M${qx - 40},${qy - 196} q12,-6 22,4" stroke="#4A5A7A" stroke-width="4" fill="none" opacity=".8"/></g>`;
    s2 += ink(cr + head);
    return [{ d: .1, s: s0 }, { d: .5, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     PHÒNG 203 — CỬA SỔ MỞ TOANG, DẤU DÉP MÁU, CHIẾC MŨ RƠI
     ====================================================== */
  R('deathroom', () => {
    const id = K.id;
    let s0 = rc(-400, -200, 2400, 900, '#2A3044', 0);
    for (let x = -400; x < 2000; x += 90) s0 += ln(`M${x},-200 V700`, '#252A3C', 3);
    s0 += rc(940, 130, 380, 420, K.lg(id('n'), [[0, '#121A30'], [1, '#2E3A5A']]), 6);
    s0 += ci(1210, 220, 40, '#EDE8DA') + K.glow(1210, 220, 160, '#DDE6F6', .3);
    s0 += fl('M944,546 V470 h60 v-34 h48 v54 h70 v-80 h40 v44 h20 v-14 h40 v34 h94 V546Z', '#0C101E') + rc(1068, 446, 12, 14, '#F2C46A', 0, 'opacity=".7"') + rc(1180, 470, 10, 12, '#F2C46A', 0, 'opacity=".6"');
    s0 += ol('M940,130 L860,100 L860,580 L940,550Z', '#3E4A62', 5) + ln('M900,115 V565', INK, 4);
    s0 += ol('M1320,130 L1400,100 L1400,580 L1320,550Z', '#3E4A62', 5) + ln('M1360,115 V565', INK, 4);
    s0 += rc(920, 548, 420, 26, '#4A5470', 5);
    // dép bỏ lại trên bậu cửa
    s0 += ol('M1060,548 q-8,-24 20,-28 q30,-2 36,16 q4,14 -6,12Z', '#7A8AA0', 3.5) + ol('M1130,548 q-6,-26 22,-28 q30,0 34,18 q2,12 -8,10Z', '#7A8AA0', 3.5);
    s0 += ln('M1080,532 q8,-8 16,0 M1150,530 q8,-8 16,0', '#5A1E1E', 3);
    s0 = ink(s0);
    // rèm bay trong gió
    s0 += `<g class="csway">${ol('M820,80 Q860,300 800,560 Q760,580 730,560 Q780,300 760,80Z', '#D8D4C8', 4, 'fill-opacity=".85"')}${ln('M790,100 Q810,300 770,540', '#A8A49A', 3)}</g>`;
    s0 += `<g class="csway2">${ol('M1440,80 Q1400,300 1470,560 Q1500,580 1530,560 Q1480,300 1500,80Z', '#D8D4C8', 4, 'fill-opacity=".85"')}${ln('M1470,100 Q1450,300 1490,540', '#A8A49A', 3)}</g>`;
    s0 += `<path d="M944,550 L1316,550 L1500,1100 L700,1100Z" fill="#BFD3F0" opacity=".12"/>`;
    // sàn gỗ
    let s1 = `<path d="M-60,600 H1660 V1060 H-60Z" fill="#4A3A30"/>`;
    for (let k = -8; k < 18; k++) s1 += ln(`M${800 + k * 110},600 L${800 + k * 300},1060`, '#3A2C24', 3);
    s1 += ln('M-60,600 H1660', INK, 5);
    // dấu dép rướm máu dẫn thẳng tới cửa sổ
    [[260, 900, 1.25], [380, 850, 1.15], [500, 800, 1.05], [620, 760, .95], [740, 722, .86], [850, 690, .78], [950, 662, .7], [1040, 640, .62], [1110, 622, .55]].forEach(([x, y, sc], i) => {
      const dx = i % 2 ? 26 * sc : -26 * sc;
      s1 += `<g transform="translate(${x + dx},${y}) rotate(-18) scale(${sc})"><path d="M-20,-34 Q-22,-50 0,-52 Q22,-50 20,-34 L18,30 Q16,46 0,46 Q-16,46 -18,30Z" fill="#7A1E1A" opacity=".8"/><path d="M-12,-20 h24 M-12,0 h24 M-12,20 h24" stroke="#4A100E" stroke-width="3" opacity=".6"/></g>`;
    });
    // mũ công an rơi
    let cap = `<g transform="translate(110,-70) rotate(-14 330 820)">${el(330, 830, 120, 34, '#2E3A26', 5)}${ol('M220,830 Q230,720 330,712 Q430,720 440,830 Q330,850 220,830Z', '#4E6A3A', 5)}${rc(222, 800, 216, 30, '#2E3A26', 4)}${ci(330, 760, 16, '#D9C27A', 4)}${ln('M440,830 Q500,838 520,858 Q470,860 430,846', INK, 5)}</g>`;
    cap += ci(580, 830, 7, '#7A1E1A') + ci(610, 812, 4, '#7A1E1A') + ci(310, 812, 5, '#7A1E1A');
    s1 = ink(s1 + cap);
    // đèn bàn ấm bên trái
    let s2 = rc(-60, 520, 300, 30, '#5A4030', 5) + ln('M120,520 V420', '#3A2A20', 8) + ol('M60,330 L180,330 L210,420 L30,420Z', '#C99A5A', 5);
    s2 = ink(s2) + K.glow(120, 420, 300, '#F2B860', .4, 'class="cflick"');
    return [{ d: .3, s: `<g transform="translate(1130,120) scale(.82) translate(-1130,-120)">${s0}</g>` }, { d: .75, s: `<g transform="translate(0,-80)">${s1}</g>` }, { d: 1, s: s2 }];
  });

  /* ======================================================
     BÀN THỜ — di ảnh Bình, nến, nhang, cúc trắng
     ====================================================== */
  R('altar', () => {
    const id = K.id, r = K.rng(17);
    let s0 = rc(-60, -60, 1720, 1020, '#2E1E1A', 0);
    s0 += `<path d="M-60,40 Q200,140 400,40 Q600,140 800,40 Q1000,140 1200,40 Q1400,140 1660,40 V-60 H-60Z" fill="#E8E2D4" stroke="${INK}" stroke-width="4"/>`;
    s0 += rc(330, 120, 940, 64, '#7A1E1A', 4) + txt(800, 166, 'VÔ CÙNG THƯƠNG TIẾC', 44, '#E8C86A', 'font-weight="bold" letter-spacing="6"');
    s0 += ol('M-60,180 L120,180 Q160,500 60,960 L-60,960Z', '#E8E2D4', 4) + ol('M1660,180 L1480,180 Q1440,500 1540,960 L1660,960Z', '#E8E2D4', 4);
    s0 = ink(s0);
    // di ảnh
    let s1 = ink(rc(670, 200, 260, 300, '#3A2418', 6) + rc(688, 218, 224, 264, '#C9A64A', 4) + rc(698, 228, 204, 244, '#E9E4D6', 3));
    s1 += `<svg x="698" y="228" width="204" height="244" viewBox="698 228 204 244">${K.fig('binh', 800, 520, 300, { emo: 'happy' })}</svg>`;
    s1 += ink(`<path d="M670,200 L736,200 L670,266Z M930,200 L864,200 L930,266Z" fill="#1A1210" stroke="${INK}" stroke-width="3"/>`) + rc(760, 500, 80, 100, '#3A2418', 4);
    // bàn thờ
    let s2 = rc(180, 600, 1240, 40, '#5A1E18', 5) + rc(200, 640, 1200, 320, '#7A1E1A', 5) + rc(200, 640, 1200, 60, '#E8E2D4', 4);
    for (let k = 0; k < 12; k++) s2 += ln(`M${220 + k * 100},700 q20,40 0,80 q-20,40 0,80`, '#5A1612', 3);
    const vase = (x) => {
      let g = '';
      for (let k = 0; k < 9; k++) {
        const fx = x - 90 + r() * 180, fy = 300 + r() * 150;
        g += ln(`M${x},480 Q${(x + fx) / 2},${fy + 60} ${fx},${fy}`, '#4C7A3E', 4);
        for (let j = 0; j < 12; j++) { const a = j / 12 * 6.28, px = (fx + Math.cos(a) * 15).toFixed(0), py = (fy + Math.sin(a) * 15).toFixed(0); g += `<ellipse cx="${px}" cy="${py}" rx="12" ry="5" transform="rotate(${(a * 57.3).toFixed(0)} ${px} ${py})" fill="#F6F4EC" stroke="${INK}" stroke-width="1.6"/>`; }
        g += ci(fx, fy, 7, '#E8E0B0', 1.5);
      }
      return g + ol(`M${x - 40},600 Q${x - 60},520 ${x - 30},470 L${x + 30},470 Q${x + 60},520 ${x + 40},600Z`, '#D8D2C4', 4) + ln(`M${x - 34},520 h68`, '#3E78A6', 5);
    };
    s2 += vase(330) + vase(1270);
    const plate = (x) => el(x, 596, 90, 16, '#C9A64A', 4) + ci(x - 40, 566, 26, '#E8873A', 3.5) + ci(x + 4, 560, 28, '#E8873A', 3.5) + ci(x + 44, 570, 24, '#D8402F', 3.5) + ol(`M${x - 60},548 Q${x - 20},500 ${x + 30},520 Q${x - 10},530 ${x - 50},560Z`, '#E8C84A', 3);
    s2 += plate(560) + plate(1040);
    s2 += rc(468, 470, 30, 130, '#C8302A', 4) + rc(1102, 470, 30, 130, '#C8302A', 4) + ln('M483,470 v-10 M1117,470 v-10', INK, 3);
    s2 += ol('M720,600 Q716,540 740,526 L860,526 Q884,540 880,600Z', '#8A6A3A', 5) + el(800, 526, 62, 12, '#5A4428', 4);
    s2 += ln('M782,524 L768,486 M800,524 V480 M818,524 L832,486', '#7A3A1E', 4);
    s2 = ink(s2) + `<g>${ci(768, 486, 4, '#FF6A3A')}${ci(800, 480, 4, '#FF6A3A')}${ci(832, 486, 4, '#FF6A3A')}</g>`;
    s2 += K.smoke(768, 480, 3, { c: '#E8E2D8', w: 3, h: 260 }) + K.smoke(800, 474, 3, { c: '#E8E2D8', w: 3, h: 280 }) + K.smoke(832, 480, 3, { c: '#E8E2D8', w: 3, h: 260 });
    s2 += K.flame(483, 460, 1.2) + K.flame(1117, 460, 1.2);
    // ba người đứng lặng (quay lưng)
    let s3 = K.person(430, 1110, 480, { hat: 'cap', c: '#100C0A', rim: '#C98A4A', rimA: .55 });
    s3 += K.person(1170, 1140, 540, { hat: 'cap', big: true, c: '#100C0A', rim: '#C98A4A', rimA: .55 });
    s3 += K.person(1420, 1100, 440, { hair: 'messy', c: '#100C0A', rim: '#C98A4A', rimA: .55 });
    s3 += `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.rg(id('v'), [[0, '#000', 0], [.7, '#000', 0], [1, '#000', .55]], .5, .4, .75)}"/>`;
    return [{ d: .15, s: s0 }, { d: .5, s: s1 + s2 }, { d: 1, s: s3 }];
  });

  /* ---------- nền đêm dùng chung: trời, nhà xa, đèn đường ---------- */
  const nightSky = (seed, top = '#0C1020', bot = '#252A44') => {
    const r = K.rng(seed);
    let s = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(K.id('ns' + seed), [[0, top], [1, bot]])}"/>`;
    for (let i = 0; i < 60; i++) s += ci(r() * 1600, r() * 420, r() * 1.6 + .4, '#F3EEDF', 0, `opacity="${(.25 + r() * .6).toFixed(2)}"`);
    return s;
  };
  const roofs = (seed, y, c, lit = .5) => {
    const r = K.rng(seed);
    let d = '', w = '';
    for (let x = -80; x < 1700;) {
      const ww = 90 + r() * 160, hh = 80 + r() * 200;
      d += `M${x.toFixed(0)},${y + 300} V${(y - hh).toFixed(0)} ${r() > .5 ? `l${(ww / 2).toFixed(0)},-40 l${(ww / 2).toFixed(0)},40` : `h${ww.toFixed(0)}`} V${y + 300} `;
      for (let k = 0; k < 4; k++) if (r() < lit) w += rc(x + 14 + r() * (ww - 40), y - hh + 30 + r() * (hh - 40), 14, 18, '#F2C46A', 0, `opacity="${(.4 + r() * .5).toFixed(2)}"`);
      x += ww + 4;
    }
    return fl(d, c) + w;
  };
  const lamp = (x, gy, h, id) => ln(`M${x},${gy} V${gy - h} Q${x},${gy - h - 28} ${x - 30},${gy - h - 30} L${x - 60},${gy - h - 28}`, '#2A2630', 9) + ol(`M${x - 84},${gy - h - 36} h46 l-6,14 h-34Z`, '#3A3640', 3)
    + `<path d="M${x - 74},${gy - h - 22} L${x - 200},${gy} L${x + 60},${gy} L${x - 46},${gy - h - 22}Z" fill="${K.lg(id, [[0, '#FFE6A8', .42], [1, '#FFE6A8', 0]])}"/>` + K.eglow(x - 70, gy + 8, 200, 36, '#FFE6A8', .35) + K.glow(x - 61, gy - h - 22, 40, '#FFF0C8', .9);

  /* ======================================================
     BẮT CÓC — gã bịt mặt vác ông bác, tay xách con mèo
     ====================================================== */
  R('kidnap', () => {
    const id = K.id;
    let s0 = nightSky(3) + roofs(7, 420, '#121628', .25);
    let s1 = rc(-60, 600, 1720, 400, '#1A1820', 0) + ln('M-60,600 H1660', '#2E2A36', 4);
    s1 += K.eglow(980, 690, 400, 60, '#3A4466', .5);
    s1 += lamp(1180, 640, 470, id('lc'));
    // gã bịt mặt + ông bác vắt trên vai
    const X = 700, Y = 700, Hh = 360, sc = Hh / 100;
    let g = '';
    // ông bác vắt ngang vai: thân nằm ngang, đầu và tay buông thõng phía sau, chân thõng phía trước
    const sy = Y - 80 * sc, OB = '#16121A';
    const bacBody = c => `<g fill="none" stroke="${c}" stroke-linecap="round" stroke-linejoin="round"><path d="M${X - 40},${sy - 16} Q${X + 30},${sy - 46} ${X + 110},${sy - 20}" stroke-width="64"/><path d="M${X + 110},${sy - 20} Q${X + 150},${sy + 10} ${X + 150},${sy + 60} L${X + 164},${sy + 150}" stroke-width="34"/><path d="M${X + 90},${sy - 6} Q${X + 120},${sy + 40} ${X + 112},${sy + 90} L${X + 124},${sy + 170}" stroke-width="30"/><path d="M${X - 60},${sy} Q${X - 82},${sy + 70} ${X - 80},${sy + 150}" stroke-width="22"/></g><circle cx="${X - 78}" cy="${sy + 40}" r="40" fill="${c}"/>`;
    g += `<g transform="translate(-3,-3)" opacity=".7">${bacBody('#D9B070')}</g>` + bacBody(OB);
    g += `<path d="M${X - 112},${sy + 40} l-14,-12 l16,0 l-10,-16 l18,6 l-2,-18 l14,12 l6,-16 l6,16" fill="#C8C2B4" stroke="#C8C2B4" stroke-width="5" stroke-linejoin="round"/>`;
    g += ci(X - 80, sy + 158, 13, '#C9A688') + ci(X + 166, sy + 160, 14, '#5A4030') + ci(X + 126, sy + 180, 14, '#5A4030');
    g += K.person(X, Y, Hh, { big: true, pose: 'walk', arms: 'hold', c: '#120E12', rim: '#E6BC74', rimX: 1.4, rimA: .8 });
    g += `<g>${el(X - 10, Y - 90 * sc, 6, 3.5, '#F3EEDF')}${el(X + 10, Y - 90 * sc, 6, 3.5, '#F3EEDF')}</g>`;
    g += `<path d="M${X},${Y} L${X - 360},${Y + 160} L${X - 260},${Y + 180} L${X + 30},${Y}Z" fill="#000" opacity=".4"/>`;
    // con mèo bị xách gáy, giãy giụa
    const hx = X - 76, hy = Y - 44 * sc;
    g += ln(`M${X - 52},${Y - 74 * sc} Q${X - 90},${Y - 62 * sc} ${hx},${hy}`, '#120E12', 26) + ci(hx, hy, 13, '#3A2E2A');
    g += `<g transform="rotate(-12 ${hx} ${hy})">${K.fig('ve', hx - 6, hy + 124, 200, { emo: 'angry' })}</g>`;
    g += ln(`M${hx - 90},${hy + 50} l-22,4 M${hx - 84},${hy + 80} l-24,12 M${hx + 70},${hy + 60} l24,6`, '#F3EEDF', 3.5, 'opacity=".75"');
    s1 = ink(s1) + g;
    // Liễng đứng ở tiền cảnh (lưng, tối)
    const s2 = `<g ${K.tone(id('dk'), '.2 .06 .04 0 0  .06 .2 .08 0 .01  .08 .1 .32 0 .04  0 0 0 1 0')}>${K.fig('lieng', 1380, 1050, 620, { dir: 'up' })}</g>`;
    return [{ d: .1, s: s0 }, { d: .6, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     MƯA ĐÊM — Liễng cõng ông bác, cậu Vẻ ngủ trên lưng
     ====================================================== */
  R('raincarry', () => {
    const id = K.id;
    let s0 = nightSky(8, '#0A0E1A', '#1E2438') + roofs(11, 470, '#10141F', .35);
    let s1 = rc(-60, 620, 1720, 400, '#1E1E28', 0) + ln('M-60,620 H1660', '#34303E', 4);
    s1 += rc(1180, 260, 300, 360, '#2A2632', 5) + rc(1230, 380, 110, 240, '#4A3A30', 4) + rc(1370, 320, 80, 90, '#F2C46A', 4, 'opacity=".75"') + ci(1322, 500, 5, '#C9A64A');
    s1 += lamp(560, 640, 440, id('lc'));
    // vũng nước phản chiếu
    s1 += el(470, 760, 210, 26, '#3A4A6A', 0, 'opacity=".55"') + el(470, 760, 110, 12, '#FFE6A8', 0, 'opacity=".35"') + el(1060, 800, 170, 20, '#3A4A6A', 0, 'opacity=".5"');
    s1 = ink(s1);
    for (let k = 0; k < 6; k++) s1 += `<g class="csplash" style="animation-delay:${(-k * .23).toFixed(2)}s">${el([420, 520, 1010, 1100, 300, 760][k], [758, 766, 798, 804, 720, 740][k], 26, 6, 'none', 0, 'stroke="#C8DAEA" stroke-width="2"')}</g>`;
    // ba "của nợ"
    const X = 860, Y = 700;
    let g = `<g ${K.cold()}>${K.fig('bac', X + 54, Y - 120, 300, { dir: 'left', emo: 'sleep' })}${K.fig('ve', X + 92, Y - 330, 130, { dir: 'left', emo: 'sleep' })}${K.fig('lieng', X, Y, 330, { dir: 'left', emo: 'hurt' })}</g>`;
    g = K.eglow(X + 20, Y + 4, 170, 22, '#000', .45) + g;
    s1 += g;
    const s2 = K.rain(170, 5, '#C8DAEA', .55) + K.rain(90, 9, '#E4EEF6', .35, 'crain2');
    return [{ d: .1, s: s0 }, { d: .6, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     GIẤC MƠ CON VOI — Buôn Ma Thuột, nắng chiều (o.broken: giấc mơ vỡ)
     ====================================================== */
  const elephant = (x, y, s, c) => `<g transform="translate(${x},${y}) scale(${s})" fill="${c}">
      <path d="M-150,-40 Q-170,-150 -40,-170 Q120,-180 150,-80 Q166,-20 140,40 L-130,40 Q-158,10 -150,-40Z"/>
      <path d="M-120,30 h44 v110 h-44Z M-50,40 h40 v100 h-40Z M60,40 h40 v100 h-40Z M110,30 h40 v108 h-40Z"/>
      <circle cx="-170" cy="-110" r="72"/><path d="M-150,-170 Q-90,-180 -96,-100 Q-100,-40 -150,-50 Z" fill-opacity=".85"/>
      <path d="M-228,-90 Q-262,0 -246,80 Q-240,110 -222,100 Q-232,40 -200,-60Z"/>
      <path d="M-212,-70 Q-246,-40 -236,-26" stroke="#F6E6C0" stroke-width="10" fill="none" stroke-linecap="round"/>
      <path d="M150,-60 Q190,-20 176,40" stroke="${c}" stroke-width="8" fill="none"/>
      <rect x="-86" y="-214" width="164" height="50" rx="8"/><path d="M-112,-336 Q-4,-396 104,-336Z"/><path d="M-96,-214 v-124 M88,-214 v-124" stroke="${c}" stroke-width="7"/>
      <circle cx="-50" cy="-292" r="19"/><path d="M-72,-270 Q-50,-280 -28,-270 L-24,-210 H-76Z"/><path d="M-64,-300 Q-74,-276 -70,-262" stroke="${c}" stroke-width="9" fill="none"/>
      <circle cx="48" cy="-298" r="21"/><path d="M24,-274 Q48,-284 72,-274 L76,-210 H20Z"/>
      <circle cx="0" cy="-262" r="14"/><path d="M-14,-248 Q0,-254 14,-248 L16,-210 H-16Z"/><path d="M14,-244 L34,-268" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
    </g>`;
  R('elephant', o => {
    const id = K.id, r = K.rng(41), bk = o.broken;
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#6A4A7A'], [.35, '#E0805A'], [.7, '#F6B860'], [1, '#FBE0A0']])}"/>`;
    s0 += K.glow(1050, 520, 520, '#FFE6A0', .75) + ci(1050, 520, 120, '#FFF2C8');
    for (let k = 0; k < 6; k++) s0 += `<g class="cfly" style="animation-delay:${(-k * 1.1).toFixed(1)}s">${ln(`M${1300 + k * 70},${220 + (k % 3) * 40} q10,-10 20,0 q10,-10 20,0`, '#4A2A2A', 4)}</g>`;
    let s1 = fl('M-60,600 Q200,520 420,560 Q700,500 960,560 Q1240,500 1660,560 V1000 H-60Z', '#B8664A') + fl('M-60,660 Q300,590 640,640 Q1000,580 1660,640 V1000 H-60Z', '#8A4A3A');
    // nhà dài Tây Nguyên
    s1 += fl('M180,600 L250,470 L520,470 L590,600 Z M220,600 h330 v60 h-330Z', '#5A2E2A') + ln('M240,660 v40 M300,660 v40 M480,660 v40 M530,660 v40', '#5A2E2A', 7);
    let rows = ''; for (let k = 0; k < 9; k++) rows += el(r() * 1700 - 50, 700 + r() * 60, 40 + r() * 30, 18, '#5A3A2A', 0, 'opacity=".8"');
    s1 += rows;
    let s2 = fl('M-60,760 Q400,700 800,740 Q1200,700 1660,750 V1000 H-60Z', '#4A2622');
    for (let k = 0; k < 60; k++) { const x = r() * 1700 - 50; s2 += ln(`M${x.toFixed(0)},${770 + r() * 40} l${(r() * 10 - 5).toFixed(0)},-${(20 + r() * 30).toFixed(0)}`, '#3A1C1A', 4); }
    s2 += elephant(860, 600, .9, '#2A1614');
    s2 += K.eglow(680, 730, 300, 26, '#000', .35);
    let s3 = K.motes(40, 9, 100, 260, 1400, 560, '#FFE6A0', 3);
    if (bk) {
      // giấc mơ rách: dải lệch, vết xé, nét nguệch ngoạc đè lên con voi
      s2 += `<g class="ctear">${`<g transform="translate(40,0)" opacity=".75">${elephant(860, 600, .9, '#2A6A8A')}</g>`}</g>`;
      let sc = ''; for (let k = 0; k < 26; k++) sc += `M${(560 + r() * 520).toFixed(0)},${(300 + r() * 420).toFixed(0)} q${(r() * 120 - 60).toFixed(0)},${(r() * 120 - 60).toFixed(0)} ${(r() * 200 - 100).toFixed(0)},${(r() * 80 - 40).toFixed(0)} `;
      s2 += ln(sc, '#120A0A', 6);
      s2 += K.txt(820, 380, '?', 240, '#120A0A', 'opacity=".75"');
      let bands = ''; for (let k = 0; k < 7; k++) { const y = 140 + r() * 640, hh = 10 + r() * 40; bands += `<g class="ctear" style="animation-delay:${(-r()).toFixed(2)}s"><rect x="-60" y="${y.toFixed(0)}" width="1720" height="${hh.toFixed(0)}" fill="${['#D8402F', '#3A6AFF', '#120A0A', '#F3EEDF'][k % 4]}" opacity="${(.25 + r() * .3).toFixed(2)}"/></g>`; }
      s3 += bands + ln('M760,-60 L800,200 L740,420 L820,640 L770,960', '#F3EEDF', 6, 'opacity=".8"') + ln('M760,-60 L800,200 L740,420 L820,640 L770,960', '#120A0A', 2);
    }
    return [{ d: .08, s: s0 }, { d: .35, s: s1 }, { d: .7, s: ink(s2) }, { d: 1, s: s3 }];
  });

  /* ======================================================
     GIẤC MƠ CĂN NHÀ — người mẹ không mặt, bóng đen đập cửa kính
     o.face: cận mặt người mẹ (nhìn từ lòng mẹ lên)
     ====================================================== */
  if (!CHARS.be) CHARS.be = { name: 'Bé Liễng', color: '#3A4766', look: { hair: 'short', top: '#8FB7C4', pants: PAL.navy, build: 'small', fx: ['blush'] } };
  R('dreamroom', o => {
    const id = K.id;
    if (o.face) {
      let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('bg'), [[0, '#3A2420'], [1, '#1A1010']])}"/>` + K.glow(800, 300, 700, '#E3A68A', .25);
      let s1 = ol('M380,1000 Q360,500 560,300 Q800,120 1040,300 Q1240,500 1220,1000Z', '#2B1F1A', 6);
      s1 += el(800, 520, 300, 340, SKIN, 6) + el(500, 560, 34, 60, SKIN, 5) + el(1100, 560, 34, 60, SKIN, 5);
      s1 += ol('M500,460 Q520,180 800,170 Q1080,180 1100,460 Q980,300 800,300 Q620,300 500,460Z', '#2B1F1A', 6);
      s1 = ink(s1);
      s1 += `<g class="ctv">${el(800, 520, 300, 340, '#7AA8E0', 0, 'opacity=".22" style="mix-blend-mode:screen"')}</g>`;
      const s2 = ol('M480,1100 Q520,900 640,880 L700,920 L640,1100Z', '#8FB7C4', 5) + ln('M640,880 L700,836', INK, 34) + ln('M640,880 L700,836', SKIN, 26) + ln('M700,836 l14,-26 M700,836 l24,-14 M700,836 l28,2 M700,836 l-4,-28', INK, 13) + ln('M700,836 l14,-26 M700,836 l24,-14 M700,836 l28,2 M700,836 l-4,-28', SKIN, 7);
      return [{ d: .2, s: s0 }, { d: .7, s: s1 }, { d: 1, s: `<g transform="translate(60,-150) rotate(-8 700 900)">${ink(s2)}</g>` }];
    }
    let s0 = rc(-60, -60, 1720, 760, '#E8C9A0', 0);
    for (let x = -40; x < 1660; x += 60) s0 += ln(`M${x},-60 V700`, '#DDBA8E', 6, 'opacity=".6"');
    s0 += rc(-60, 680, 1720, 340, '#9A6A4A', 0) + ln('M-60,680 H1660', INK, 4);
    // cửa sổ: đêm đen + bóng đen đập kính
    s0 += rc(1080, 160, 360, 380, K.lg(id('win'), [[0, '#1E2A50'], [1, '#4A5A86']]), 6) + K.glow(1300, 220, 160, '#C8D4F0', .4);
    s0 += `<svg x="1080" y="160" width="360" height="380" viewBox="1080 160 360 380"><g class="cpound">${K.fig('bong', 1260, 640, 470)}${el(1140, 330, 36, 46, '#0A0808')}${el(1380, 316, 36, 46, '#0A0808')}${ln('M1124,300 v-22 M1140,296 v-26 M1156,300 v-22 M1364,286 v-22 M1380,282 v-26 M1396,286 v-22', '#0A0808', 10)}</g></svg>`;
    s0 += ln('M1260,160 V540 M1080,350 H1440', '#6A4A3A', 8) + rc(1070, 530, 380, 22, '#8A5A3A', 4);
    s0 += ol('M1040,140 Q1080,340 1040,560 L1000,560 Q1030,340 990,140Z', '#C8553D', 4) + ol('M1480,140 Q1440,340 1480,560 L1520,560 Q1490,340 1530,140Z', '#C8553D', 4);
    // ti vi
    s0 += rc(80, 380, 300, 220, '#3A2A24', 6) + rc(100, 398, 220, 170, '#9AC8F0', 4) + rc(150, 600, 120, 80, '#6A4A3A', 4);
    let s1 = `<g class="ctv">${rc(100, 398, 220, 170, '#E0F0FF', 0, 'opacity=".6"')}${K.eglow(260, 520, 520, 360, '#9AC8F0', .25)}</g>`;
    // ghế sofa + mẹ + bé
    let s2 = ink(s0) + ink(ol('M420,560 Q420,500 480,500 L1000,500 Q1060,500 1060,560 L1060,760 L420,760Z', '#B84A3E', 6));
    s2 += K.fig('me', 730, 716, 440) + K.fig('be', 800, 712, 230, { emo: 'scared', dir: 'right' });
    s2 += ink(rc(400, 680, 680, 120, '#A23E34', 6) + ln('M740,680 v120', '#7A2A22', 4));
    s2 += K.glow(740, 380, 260, '#FFE0B0', .25);
    return [{ d: .3, s: s2 }, { d: .5, s: s1 }];
  });

  /* ======================================================
     MÁI NHÀ ĐẦY MÈO — ông bác đứng dưới trăng, cậu Vẻ trên vai
     ====================================================== */
  R('catsroof', () => {
    const id = K.id, r = K.rng(77);
    let s0 = nightSky(13, '#0A0E1E', '#2A2A48') + K.glow(1080, 250, 420, '#E8E4D0', .25) + ci(1080, 250, 150, '#EDE6D0');
    s0 += `<g opacity=".25">${ci(1030, 210, 26, '#B8B0A0')}${ci(1120, 300, 18, '#B8B0A0')}${ci(1130, 200, 12, '#B8B0A0')}</g>`;
    // nhà + mái tôn
    let s1 = fl('M140,560 L360,400 L1260,400 L1480,560Z', '#2A2E3E') + rc(200, 560, 1220, 300, '#1E2030', 0);
    let tin = ''; for (let x = 160; x < 1480; x += 28) tin += `M${x},560 L${360 + (x - 140) * (900 / 1340)},400 `;
    s1 += ln(tin, '#3A3E52', 2.5) + ln('M140,560 L360,400 L1260,400 L1480,560', '#111', 6);
    s1 += rc(700, 640, 160, 220, '#3A2A20', 5) + rc(716, 656, 128, 204, '#F2C46A', 0, 'opacity=".7"');
    s1 = ink(s1) + K.glow(780, 760, 260, '#F2C46A', .3);
    // bầy mèo trên nóc và sườn mái
    let cats = '';
    for (let k = 0; k < 18; k++) { const x = 380 + k * 50 + r() * 20; cats += K.cat(x, 402, .9 + r() * .5, { c: '#0A0A12', delay: -r() * 4, flip: r() > .5 }); }
    for (let k = 0; k < 12; k++) { const t = r(), x = 200 + t * 1240, y = 545 - (x < 360 ? (x - 140) / 220 * 145 : x > 1260 ? (1480 - x) / 220 * 145 : 150) * r(); cats += K.cat(x, y, .8 + r() * .4, { c: '#0A0A12', delay: -r() * 4, flip: r() > .5 }); }
    for (let k = 0; k < 6; k++) cats += K.cat(260 + k * 220 + r() * 60, 620 + r() * 80, 1.4, { c: '#0A0A12', leap: true, delay: -r() * 4, flip: k % 2 === 0 });
    s1 += cats;
    // sân + ông bác với cậu Vẻ
    let s2 = rc(-60, 760, 1720, 300, '#14141E', 0) + ln('M-60,760 H1660', '#2A2A3A', 4);
    s2 = ink(s2) + K.eglow(470, 790, 160, 22, '#000', .5);
    s2 += `<g ${K.tone(id('mn'), '.45 .1 .1 0 .03  .1 .45 .12 0 .04  .12 .16 .62 0 .1  0 0 0 1 0')}>${K.fig('bac', 470, 790, 330, { emo: 'neutral' })}</g>`;
    s2 += K.fig('ve', 548, 690, 120, { emo: 'angry', dir: 'right' });
    return [{ d: .1, s: s0 }, { d: .55, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     CHỢ BẾN THÀNH — giữa trưa, đông nghịt
     ====================================================== */
  R('market', () => {
    const id = K.id, r = K.rng(23);
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#6FB0DA'], [1, '#D4ECF4']])}"/>` + `<g class="cdrift">${K.cloud(240, 180, 1.2)}${K.cloud(1300, 140, 1.4)}</g>`;
    // mặt tiền chợ
    let s1 = rc(80, 380, 1440, 360, '#EAD8A8', 5) + rc(80, 360, 1440, 30, '#D9C08A', 4);
    for (let k = 0; k < 12; k++) { const x = 120 + k * 120; if (Math.abs(x + 40 - 800) < 160) continue; s1 += ol(`M${x},640 V500 Q${x + 40},450 ${x + 80},500 V640Z`, '#5A7A8A', 4); }
    s1 += rc(620, 180, 360, 560, '#F0E0B0', 5) + ol('M600,190 L800,110 L1000,190Z', '#C9A270', 5);
    s1 += ol('M690,740 V520 Q800,420 910,520 V740Z', '#4A6A7A', 5);
    s1 += ci(800, 300, 70, '#F6F0E0', 5) + ln('M800,300 V250 M800,300 L838,318', INK, 5);
    for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28; s1 += ln(`M${800 + Math.cos(a) * 58},${300 + Math.sin(a) * 58} L${800 + Math.cos(a) * 64},${300 + Math.sin(a) * 64}`, INK, 3); }
    s1 += rc(640, 392, 320, 50, '#B84A3E', 4) + txt(800, 428, 'BẾN THÀNH', 40, '#F6E2A0', 'font-weight="bold" letter-spacing="4"');
    s1 += rc(380, 330, 120, 50, '#4C8A4E', 4) + rc(1100, 330, 120, 50, '#4C8A4E', 4);
    s1 += rc(-60, 740, 1720, 300, '#C9B89A', 0) + ln('M-60,740 H1660', INK, 4);
    // cây xanh hai bên
    s1 += ln('M40,740 V420', '#5A3A2A', 18) + ci(40, 380, 110, '#4C8A4E', 4) + ci(110, 330, 80, '#5FA05A', 4) + ln('M1560,740 V420', '#5A3A2A', 18) + ci(1560, 380, 110, '#4C8A4E', 4) + ci(1480, 330, 80, '#5FA05A', 4);
    s1 = ink(s1);
    // đám đông + ba người
    let s2 = '';
    const folk = ['phunu', 'banhang', 'banpate', 'khach', 'phunu', 'hocvien', 'banhang', 'khach', 'banpate', 'phunu'];
    let back = '';
    for (let k = 0; k < 20; k++) back += K.fig(folk[(k + 3) % folk.length], -20 + k * 86 + r() * 30, 700 + r() * 12, 112 + r() * 16, { dir: ['left', 'right', 'down', 'up'][k % 4] });
    for (let k = 0; k < 14; k++) { const x = 40 + k * 118 + r() * 40; if (x > 470 && x < 900) continue; back += K.fig(folk[k % folk.length], x, 730 + r() * 20, 150 + r() * 30, { dir: ['left', 'right', 'down'][k % 3], emo: r() > .5 ? 'smile' : 'neutral' }); }
    s2 += `<g opacity=".92">${back}</g>`;
    s2 += K.fig('lieng', 590, 772, 250, { dir: 'right', emo: 'smile' }) + K.fig('bac', 770, 776, 240, { dir: 'right', emo: 'happy' }) + K.fig('ve', 818, 690, 100, { emo: 'happy' });
    return [{ d: .1, s: s0 }, { d: .5, s: s1 }, { d: 1, s: s2 }];
  });

  /* ======================================================
     RANH GIỚI — không khí gợn sóng như bức tường trong suốt
     ====================================================== */
  R('boundary', () => {
    const id = K.id, r = K.rng(61), VX = 800, VY = 470;
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.lg(id('sky'), [[0, '#262446'], [.55, '#7A5272'], [1, '#E09A70']])}"/>` + K.glow(VX, VY, 360, '#FFD0A0', .45);
    // dãy nhà hai bên hội tụ về điểm tụ
    const side = (sgn) => {
      let g = '';
      for (let k = 0; k < 7; k++) {
        const t0 = k / 7, t1 = (k + .92) / 7, X = t => VX + sgn * (900 * (1 - t) + 70 * t), top = t => VY - (560 * (1 - t) + 50 * t) * (k % 2 ? .9 : 1.05), bot = t => VY + 470 * (1 - t) + 10 * t;
        const c = ['#3E3A52', '#4A3E4E', '#3A4256', '#4E4448'][k % 4];
        g += `<path d="M${X(t0)},${top(t0)} L${X(t1)},${top(t1)} L${X(t1)},${bot(t1)} L${X(t0)},${bot(t0)}Z" fill="${c}" stroke="${INK}" stroke-width="3"/>`;
        for (let j = 0; j < 3; j++) { const tm = t0 + (t1 - t0) * (.25 + j * .25), wy = top(tm) + (bot(tm) - top(tm)) * .25, wh = (bot(tm) - top(tm)) * .14; if (r() > .35) g += `<rect x="${X(tm) - Math.abs(X(t1) - X(t0)) * .08}" y="${wy}" width="${Math.abs(X(t1) - X(t0)) * .16}" height="${wh}" fill="#F2C46A" opacity="${(.45 + r() * .4).toFixed(2)}"/>`; }
      }
      return g;
    };
    let s1 = `<path d="M-60,1000 L${VX - 70},${VY + 10} L${VX + 70},${VY + 10} L1660,1000Z" fill="#3A3640"/>` + side(-1) + side(1);
    s1 += ln(`M${VX},${VY + 30} V${VY + 50} M${VX},${VY + 80} V${VY + 120} M${VX},${VY + 170} V${VY + 260} M${VX},${VY + 330} V${VY + 520}`, '#E8C86A', 7);
    s1 = ink(s1);
    // "bức tường" — phía sau gợn sóng như nhìn qua mặt nước
    const bx = 560, by = 200, bw = 480, bh = 400;
    K.def(`<filter id="${id('rip')}" x="0" y="0" width="1" height="1"><feTurbulence type="turbulence" baseFrequency=".012 .05" numOctaves="2" seed="4" result="n"><animate attributeName="baseFrequency" dur="6s" values=".012 .05;.016 .07;.012 .05" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" in2="n" scale="26"/></filter>`);
    K.def(`<clipPath id="${id('cl')}"><rect x="${bx}" y="${by}" width="${bw}" height="${bh}"/></clipPath>`);
    let wall = `<g clip-path="url(#${id('cl')})"><g filter="url(#${id('rip')})"><rect x="${bx - 40}" y="${by - 40}" width="${bw + 80}" height="${bh + 80}" fill="#C8B8D8"/>${s0}${s1}</g><rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="#E8E0F8" opacity=".42"/></g>`;
    for (let k = 0; k < 10; k++) wall += `<g class="cwave" style="animation-delay:${(-r() * 2.4).toFixed(2)}s">${ln(`M${bx + 20 + k * 46},${by} q14,50 0,100 t0,100 t0,100 t0,100`, '#F6F0FF', 2.2)}</g>`;
    wall += `<rect x="${bx - 14}" y="${by}" width="28" height="${bh}" fill="${K.lg(id('e1'), [[0, '#F6F0FF', 0], [.5, '#F6F0FF', .5], [1, '#F6F0FF', 0]], 1, 0)}"/><rect x="${bx + bw - 14}" y="${by}" width="28" height="${bh}" fill="url(#${id('e1')})"/>` + K.glow(bx + bw / 2, by + bh / 2, 340, '#E8D8FF', .2);
    // ông bác ôm cậu Vẻ chạy ngược về phía máy quay
    const s2 = K.eglow(800, 776, 130, 20, '#000', .5) + K.fig('bac', 800, 776, 330, { emo: 'scared' }) + K.fig('ve', 800, 742, 120, { emo: 'scared' }) + ln('M640,560 l-40,-10 M650,620 l-46,4 M960,560 l40,-10 M950,620 l46,4', '#F3EEDF', 4, 'opacity=".6"');
    return [{ d: .1, s: s0 }, { d: .5, s: s1 + wall }, { d: 1, s: s2 }];
  });

  /* ======================================================
     LỚP HỌC CỦA X — những đứa trẻ không tên
     ====================================================== */
  R('xclass', () => {
    const id = K.id;
    let s0 = rc(-60, -60, 1720, 1020, '#3A3C42', 0) + rc(-60, 560, 1720, 460, '#2A2C30', 0);
    s0 += rc(500, 120, 600, 300, '#1E2024', 6) + rc(520, 140, 560, 260, '#4A4E56', 0) + ol('M660,270 Q800,170 940,270 Q800,370 660,270Z', '#D8D4CC', 8) + ci(800, 270, 46, '#8A2A22', 6) + ci(800, 270, 18, '#1E2024');
    for (let k = 0; k < 4; k++) s0 += rc(180 + k * 340, 20, 220, 18, '#E8F0F0', 3) + `<path d="M${180 + k * 340},38 L${120 + k * 340},560 L${460 + k * 340},560 L${400 + k * 340},38Z" fill="#E8F4F4" opacity=".07"/>`;
    s0 = ink(s0);
    let s1 = '';
    const grey = K.tone(id('g'), '.3 .3 .3 0 .02  .3 .3 .3 0 .02  .32 .32 .32 0 .04  0 0 0 1 0');
    [[360, 130, 6, .55], [480, 170, 5, .75], [636, 226, 4, 1]].forEach(([y, hh, n, sc]) => {
      let row = '';
      for (let k = 0; k < n; k++) {
        const x = 800 + (k - (n - 1) / 2) * 300 * sc;
        if (sc === 1 && k === 1) continue;
        row += K.fig('x', x, y + hh * .6, hh, { dir: 'up' }) + rc(x - 70 * sc, y + hh * .35, 140 * sc, 26 * sc, '#5A5C62', 3);
      }
      s1 += `<g ${grey}>${row}</g>`;
    });
    // một đứa quay lại nhìn
    s1 += K.glow(650, 636 + 226 * .6 - 226 * .55, 90, '#D8402F', .3) + K.fig('x', 650, 636 + 226 * .6, 226, { emo: 'neutral' }) + rc(580, 636 + 226 * .35, 140, 26, '#5A5C62', 3);
    return [{ d: .3, s: s0 }, { d: 1, s: s1 }];
  });

  /* ======================================================
     LỒNG KÍNH TÂM TRÍ — bên trong cái bóng đen, người quỳ gối
     ====================================================== */
  R('cage', () => {
    const id = K.id;
    let s0 = `<rect x="-60" y="-60" width="1720" height="1020" fill="${K.rg(id('bg'), [[0, '#3A1E3A'], [.6, '#1A1018'], [1, '#0A0608']], .5, .45, .7)}"/>`;
    let sw = ''; for (let i = 0; i < 12; i++) sw += `<ellipse cx="800" cy="420" rx="${200 + i * 70}" ry="${90 + i * 32}" fill="none" stroke="${i % 2 ? PAL.purple : PAL.red}" stroke-width="${5 - i * .3}" opacity="${(.4 - i * .028).toFixed(2)}" transform="rotate(${i * 13} 800 420)"/>`;
    s0 += `<g class="cswirl">${sw}</g>`;
    // cái bóng khổng lồ
    let s1 = `<g filter="url(#ink2)" fill="#050304"><path d="M330,1000 Q260,640 470,560 Q380,360 800,120 Q1220,360 1130,560 Q1340,640 1270,1000 Z"/></g>`;
    s1 += el(700, 330, 26, 10, '#E8E0D0', 0, 'opacity=".75"') + el(900, 330, 26, 10, '#E8E0D0', 0, 'opacity=".75"');
    // lồng kính ở ngực
    s1 += rc(660, 470, 280, 300, '#BFD8E2', 4, 'fill-opacity=".14" stroke="#DCEAF0" stroke-opacity=".8"') + ln('M716,470 V770 M772,470 V770 M828,470 V770 M884,470 V770', '#DCEAF0', 3, 'opacity=".5"');
    s1 += K.glow(800, 620, 200, '#BFD8E2', .25) + K.fig('lieng', 800, 760, 200, { emo: 'sad' });
    // những người quỳ
    let s2 = rc(-60, 790, 1720, 300, '#0A0608', 0) + K.eglow(800, 790, 700, 40, '#8A5AA8', .18);
    [[250, 790, 230], [470, 800, 250], [1130, 800, 250], [1350, 790, 230]].forEach(([x, y, hh], k) => { s2 += K.person(x, y, hh, { pose: 'kneel', c: '#0E0A0E', flip: k > 1, rim: '#8A5AA8', rimA: .7, hair: k === 2 ? 'messy' : null }); });
    return [{ d: .1, s: s0 }, { d: .5, s: s1 }, { d: 1, s: s2 }];
  });
})();
