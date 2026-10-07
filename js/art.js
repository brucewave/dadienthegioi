'use strict';
/* ==========================================================
   ART — phong cách vẽ tay: nền giấy, nét mực rung, chibi
   (tham khảo mau-thu/nhan-vat-chibi-v2.svg)
   ========================================================== */
const INK = '#2B1F1A', PAPER = '#E9E2D0', CREAM = '#F3EEDF', SKIN = '#EBCDAA';
const PAL = { red: '#B84A3E', mustard: '#D9A93A', teal: '#4E8C84', green: '#4C9A6A', olive: '#6E9A5A', tan: '#C79A5E', wood: '#A8743E', navy: '#3A4766', grey: '#4A4650', sky: '#8FB7C4', gold: '#D9C27A', brown: '#7A5236', purple: '#7E62A8', police: '#5F7F4A' };

const CHARS = {
  tu:      { name: 'Ông Tư',        color: '#A8743E', look: { hair: 'short', hc: '#6B5D55', top: '#8A6A44', pants: PAL.grey, hat: 'fedora', hatC: '#5B4636', fx: ['mustache', 'tired'], detail: 'coat' } },
  lieng:   { name: 'Liễng',         color: '#3A4766', look: { hair: 'short', top: PAL.police, pants: '#4A5E3A', hat: 'cap', detail: 'uniform' } },
  binh:    { name: 'Bình',          color: '#4C9A6A', look: { hair: 'messy', hc: '#5A3A22', top: PAL.police, pants: '#4A5E3A', hat: 'cap', fx: ['glasses', 'blush'], detail: 'uniform' } },
  quanly:  { name: 'Cô quản lý',    color: '#B84A3E', look: { hair: 'long', top: PAL.red, pants: PAL.grey, fx: ['redtie'], detail: 'apron' } },
  chutro:  { name: 'Ông chủ trọ',   color: '#4E8C84', look: { hair: 'bald', top: PAL.teal, pants: PAL.grey, build: 'big', fx: ['tired'] } },
  khanh:   { name: 'Khánh sẹo',     color: '#B84A3E', look: { hair: 'buzz', top: '#3B3438', pants: PAL.navy, build: 'big', fx: ['scar', 'chain'] } },
  nha:     { name: 'Cậu Nhà',       color: '#7E62A8', look: { hair: 'messy', top: '#7A6AA8', pants: PAL.navy, build: 'small', fx: ['tired'] } },
  truong:  { name: 'Ông Trưởng',    color: '#3A4766', look: { hair: 'short', hc: '#4A4040', top: PAL.police, pants: '#4A5E3A', hat: 'cap', build: 'big', fx: ['mustache'], detail: 'uniform', gold: true } },
  bac:     { name: 'Ông bác',       color: '#C79A5E', look: { hair: 'messy', hc: '#D8D2C4', top: PAL.tan, pants: PAL.brown, fx: ['tired', 'blank'] } },
  ve:      { name: 'Cậu Vẻ',        color: '#7E62A8', look: { type: 'cat' } },
  mong:    { name: 'Mộng',          color: '#4E8C84', look: { hair: 'short', top: '#3E6E78', pants: PAL.grey, fx: ['hood', 'glow'], hoodC: '#3E6E78' } },
  thach:   { name: 'Thạch',         color: '#6E9A5A', look: { hair: 'buzz', top: '#6E7A3A', pants: PAL.grey, build: 'big' } },
  cuong:   { name: 'Tên gác cổng',  color: '#4A4650', look: { hair: 'buzz', top: PAL.grey, pants: '#2E2A30', build: 'big' } },
  x:       { name: 'X',             color: '#B84A3E', look: { hair: 'short', top: '#2E2A30', pants: '#2E2A30', fx: ['mask'], eyeC: '#D8402F' } },
  giamthi: { name: 'Thầy giám thị', color: '#4A4650', look: { hair: 'bald', top: CREAM, pants: PAL.navy, fx: ['glasses'] } },
  hocvien: { name: 'Học viên',      color: '#3A4766', look: { hair: 'short', top: PAL.police, pants: '#4A5E3A' } },
  phunu:   { name: 'Người phụ nữ',  color: '#D9A93A', look: { hair: 'bun', top: PAL.mustard, pants: PAL.grey, hat: 'cone' } },
  banhang: { name: 'Cô bán hàng',   color: '#4E8C84', look: { hair: 'bun', top: PAL.teal, pants: PAL.grey, hat: 'cone', fx: ['tired'] } },
  banpate: { name: 'Anh bán pate',  color: '#4C9A6A', look: { hair: 'short', top: PAL.green, pants: PAL.navy, fx: ['blush'] } },
  me:      { name: 'Mẹ',            color: '#B84A3E', look: { hair: 'long', top: '#E3B4A0', pants: PAL.grey, fx: ['faceless'] } },
  bong:    { name: 'Bóng đen',      color: '#2B1F1A', look: { type: 'shadow' } },
  unk:     { name: '???',           color: '#4A4650', look: { hair: 'short', top: PAL.grey, fx: ['mask'] } },
  bichmat: { name: 'Gã bịt mặt',    color: '#4A4650', look: { hair: 'short', top: '#3B3438', pants: '#2E2A30', build: 'big', fx: ['mask'] } },
  khach:   { name: 'Khách trọ',     color: '#D9A93A', look: { hair: 'short', top: PAL.mustard, pants: PAL.navy, fx: ['blush'] } },
};

const ART = (() => {
  const S = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

  /* ---------- Chibi (nhìn chính diện 3/4, theo hướng, có biểu cảm) ----------
     emo: neutral | smile | happy | sad | angry | surprised | scared | think | smug | hurt | cry | sleep */
  const EMOS = ['neutral', 'smile', 'happy', 'sad', 'angry', 'surprised', 'scared', 'think', 'smug', 'hurt', 'cry', 'sleep'];
  function face(emo, ex, c, has) {
    const L = 66 + ex, R = 94 + ex, mx = 80 + ex, my = has('mustache') ? 104 : 100;
    const ec = c.eyeC || (has('glow') ? '#7FE0DA' : INK);
    const dot = (x, r = 3.3) => `<circle cx="${x}" cy="86" r="${r}" fill="${ec}"/><circle cx="${x + 1.2}" cy="84.6" r="${r * .34}" fill="#fff"/>`;
    let eyes = '', lines = '', extra = '';
    // mắt
    if (emo === 'happy') lines += `<path d="M${L - 5},88 q5,-6 10,0 M${R - 5},88 q5,-6 10,0" fill="none" stroke-width="2.8"/>`;
    else if (emo === 'sleep') lines += `<path d="M${L - 5},86 q5,4 10,0 M${R - 5},86 q5,4 10,0" fill="none" stroke-width="2.6"/>`;
    else if (emo === 'hurt') lines += `<path d="M${L - 4},82 l7,4 l-7,4 M${R + 4},82 l-7,4 l7,4" fill="none" stroke-width="2.6"/>`;
    else if (emo === 'surprised') eyes = `<circle cx="${L}" cy="86" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${R}" cy="86" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${L}" cy="86" r="2.2" fill="${ec}"/><circle cx="${R}" cy="86" r="2.2" fill="${ec}"/>`;
    else if (emo === 'smug') { eyes = `<circle cx="${L}" cy="87.5" r="3" fill="${ec}"/><circle cx="${R}" cy="87.5" r="3" fill="${ec}"/>`; lines += `<path d="M${L - 5},85 h10 M${R - 5},85 h10" fill="none" stroke-width="2.6"/>`; }
    else if (emo === 'scared') eyes = `<circle cx="${L}" cy="86" r="4.4" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="${R}" cy="86" r="4.4" fill="#fff" stroke="${INK}" stroke-width="1.6"/><circle cx="${L}" cy="86" r="1.6" fill="${ec}"/><circle cx="${R}" cy="86" r="1.6" fill="${ec}"/>`;
    else eyes = dot(L) + dot(R);
    // lông mày (bị mặt nạ che thì bỏ)
    if (!has('mask') && !has('blank')) {
      const B = {
        angry: `M${L - 6},73 L${L + 6},79 M${R - 6},79 L${R + 6},73`,
        sad: `M${L - 6},78 L${L + 6},74 M${R - 6},74 L${R + 6},78`, scared: `M${L - 6},77 L${L + 6},72 M${R - 6},72 L${R + 6},77`, cry: `M${L - 6},78 L${L + 6},74 M${R - 6},74 L${R + 6},78`,
        surprised: `M${L - 6},73 q6,-5 12,0 M${R - 6},73 q6,-5 12,0`, happy: `M${L - 6},75 q6,-4 12,0 M${R - 6},75 q6,-4 12,0`,
        think: `M${L - 6},77 q6,-2 12,0 M${R - 6},74 q6,-5 12,1`, smug: `M${L - 6},76 q6,-3 12,0 M${R - 6},78 h12`,
      }[emo] || `M${L - 6},77 q6,-3 12,0 M${R - 6},77 q6,-3 12,0`;
      lines += `<path d="${B}" fill="none" stroke-width="${emo === 'angry' ? 3.4 : 2.4}"/>`;
    }
    if (has('mask') && emo === 'angry') lines += `<path d="M${L - 6},76 L${L + 6},81 M${R - 6},81 L${R + 6},76" fill="none" stroke="${c.eyeC || PAPER}" stroke-width="2.4"/>`;
    // miệng
    if (!has('mask')) {
      const M = {
        smile: `<path d="M${mx - 5},${my - 1} q5,4 10,0" fill="none" stroke-width="2.2"/>`,
        happy: `<path d="M${mx - 6},${my - 2} q6,9 12,0 z" fill="#8A3A2C" stroke-width="2"/>`,
        sad: `<path d="M${mx - 5},${my + 2} q5,-4 10,0" fill="none" stroke-width="2.2"/>`,
        angry: `<path d="M${mx - 6},${my - 1} h12 v5 h-12 z" fill="#fff" stroke-width="2"/><path d="M${mx - 6},${my + 1.5} h12" fill="none" stroke-width="1.2"/>`,
        surprised: `<ellipse cx="${mx}" cy="${my + 1}" rx="3.4" ry="4.4" fill="#8A3A2C" stroke-width="2"/>`,
        scared: `<path d="M${mx - 7},${my + 1} q2,-3 3.5,0 q2,3 3.5,0 q2,-3 3.5,0 q2,3 3.5,0" fill="none" stroke-width="2"/>`,
        think: `<path d="M${mx - 3},${my + 1} l7,-2" fill="none" stroke-width="2.2"/>`,
        smug: `<path d="M${mx - 4},${my} q6,3 9,-3" fill="none" stroke-width="2.2"/>`,
        hurt: `<path d="M${mx - 5},${my + 1} q2.5,-3 5,0 q2.5,3 5,0" fill="none" stroke-width="2"/>`,
        cry: `<path d="M${mx - 5},${my + 4} q5,-7 10,0 z" fill="#8A3A2C" stroke-width="2"/>`,
        sleep: `<circle cx="${mx}" cy="${my + 1}" r="2" fill="none" stroke-width="1.8"/>`,
      }[emo] || `<path d="M${mx - 4},${my} h8" fill="none" stroke-width="2.2"/>`;
      lines += M;
    }
    // má hồng & ký hiệu
    const blushOp = has('blush') || emo === 'happy' || emo === 'smile' ? .4 : .14;
    lines += `<ellipse cx="${55 + ex}" cy="95" rx="5.5" ry="3.4" fill="${PAL.red}" opacity="${blushOp}" stroke="none"/><ellipse cx="${105 + ex}" cy="95" rx="5.5" ry="3.4" fill="${PAL.red}" opacity="${blushOp}" stroke="none"/>`;
    if (emo === 'angry') extra += `<path d="M106,50 q5,3 10,0 M106,58 q5,-3 10,0 M107,49 q3,5 0,10 M115,49 q-3,5 0,10" fill="none" stroke="${PAL.red}" stroke-width="2.6"/>`;
    if (emo === 'scared' || emo === 'hurt') extra += `<path d="M118,58 q7,9 0,13 q-7,-4 0,-13z" fill="${PAL.sky}" stroke-width="2"/>`;
    if (emo === 'cry') extra += `<path d="M${L - 1},91 q-4,9 0,15 q4,-6 0,-15z M${R + 1},91 q4,9 0,15 q-4,-6 0,-15z" fill="${PAL.sky}" stroke-width="1.8"/>`;
    if (emo === 'hurt') extra += `<path d="M${98 + ex},93 l10,-6 M${100 + ex},84 l6,10" fill="none" stroke="${CREAM}" stroke-width="5"/><path d="M${98 + ex},93 l10,-6 M${100 + ex},84 l6,10" fill="none" stroke-width="1.2"/>`;
    return { eyes, lines, extra };
  }
  function chibi(key, dir = 'down', opt = {}) {
    const c = (CHARS[key] || CHARS.unk).look, emo = opt.emo || 'neutral';
    const vb = opt.bust ? '14 4 132 128' : '0 0 160 190';
    if (c.type === 'cat') return cat(dir, vb, emo);
    if (c.type === 'shadow') return shadow(vb);
    const fx = c.fx || [], has = f => fx.includes(f);
    const top = c.top || PAL.grey, pants = c.pants || PAL.grey, shoes = c.shoes || PAL.brown, hc = c.hc || INK;
    const back = dir === 'up', ex = dir === 'left' ? -8 : dir === 'right' ? 8 : 0;
    const bw = c.build === 'big' ? 7 : c.build === 'small' ? -4 : 0;
    let s = `<svg viewBox="${vb}" class="chibi emo-${emo}"><g ${S}>`;
    if (!opt.bust) s += `<ellipse cx="80" cy="181" rx="${42 + bw}" ry="6" fill="${INK}" opacity=".18" stroke="none"/>
      <g class="lgL" filter="url(#ink)"><rect x="${63 - bw / 2}" y="148" width="13" height="24" fill="${pants}"/><ellipse cx="${68 - bw / 2}" cy="175" rx="10" ry="5" fill="${shoes}"/><path d="M${62 - bw / 2},173 q4,-3 8,-2" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/></g>
      <g class="lgR" filter="url(#ink)"><rect x="${84 + bw / 2}" y="148" width="13" height="24" fill="${pants}"/><ellipse cx="${92 + bw / 2}" cy="175" rx="10" ry="5" fill="${shoes}"/><path d="M${86 + bw / 2},173 q4,-3 8,-2" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/></g>`;
    s += `<g class="bob"><g filter="url(#ink)">`;
    if (c.hair === 'long' && !back) s += `<path d="M40,72 Q34,124 50,132 L110,132 Q126,124 120,72 Z" fill="${hc}"/>`;
    if (has('hood')) s += `<ellipse cx="80" cy="74" rx="47" ry="43" fill="${c.hoodC}"/>`;
    // thân
    s += `<path d="M${57 - bw},108 Q80,100 ${103 + bw},108 L${109 + bw},152 Q80,160 ${51 - bw},152 Z" fill="${top}"/>`;
    s += `<path d="M${95 + bw},106 L${103 + bw},108 L${109 + bw},152 Q100,157 92,158 Q99,132 ${95 + bw},106 Z" fill="${INK}" opacity=".2" stroke="none"/>`;
    s += `<path d="M${62 - bw},112 Q${60 - bw},130 ${58 - bw},146" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="3"/>`;
    if (!back) {
      if (c.detail === 'uniform') s += `<path d="M70,104 L80,116 L90,104" fill="${CREAM}" stroke-width="2"/><path d="M80,116 V156" fill="none" stroke-width="1.8"/><circle cx="80" cy="126" r="1.8" fill="${PAL.gold}" stroke="none"/><circle cx="80" cy="142" r="1.8" fill="${PAL.gold}" stroke="none"/><path d="M${54 - bw},134 Q80,140 ${106 + bw},134" fill="none" stroke="${INK}" stroke-width="5"/><rect x="76" y="133" width="8" height="6" rx="1" fill="${PAL.gold}" stroke-width="1.4"/><rect x="88" y="114" width="12" height="9" rx="2" fill="${c.gold ? PAL.gold : PAL.red}" stroke-width="2"/><path d="M${58 - bw},108 l10,-2 M${102 + bw},108 l-10,-2" fill="none" stroke="${PAL.gold}" stroke-width="4"/>`;
      else if (c.detail === 'coat') s += `<path d="M70,104 L80,124 L90,104" fill="${CREAM}" stroke-width="2"/><path d="M80,124 V156" fill="none" stroke-width="2"/><circle cx="74" cy="134" r="2" fill="${INK}"/><circle cx="74" cy="146" r="2" fill="${INK}"/><path d="M${60 - bw},140 l7,3" fill="none" stroke-width="2"/>`;
      else if (c.detail === 'apron') s += `<path d="M72,105 L80,112 L88,105" fill="none" stroke-width="2"/><path d="M66,120 H94 L98,154 Q80,158 62,154 Z" fill="${CREAM}" stroke-width="2.5"/><path d="M72,132 h16" fill="none" stroke-width="1.4"/>`;
      else s += `<path d="M72,105 Q80,112 88,105" fill="none" stroke-width="2"/>`;
      if (has('chain')) s += `<path d="M66,108 Q80,124 94,108" fill="none" stroke="${PAL.mustard}" stroke-width="3"/>`;
    }
    // tay
    const arms = `M${60 - bw},116 Q${46 - bw},128 ${50 - bw},142 M${100 + bw},116 Q${114 + bw},128 ${110 + bw},142`;
    s += `<path d="${arms}" fill="none" stroke-width="12"/><path d="${arms}" fill="none" stroke="${top}" stroke-width="6"/>`;
    s += `<circle cx="${50 - bw}" cy="145" r="5.5" fill="${SKIN}"/><circle cx="${110 + bw}" cy="145" r="5.5" fill="${SKIN}"/>`;
    // đầu + tai
    if (!has('hood')) s += `<ellipse cx="42" cy="84" rx="6" ry="8" fill="${SKIN}"/><ellipse cx="118" cy="84" rx="6" ry="8" fill="${SKIN}"/>`;
    s += `<ellipse cx="80" cy="74" rx="38" ry="34" fill="${SKIN}"/>`;
    if (back) {
      if (c.hair !== 'bald' && !has('hood')) s += `<ellipse cx="80" cy="72" rx="38" ry="34" fill="${hc}"/><path d="M60,52 q14,-10 30,-6" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>`;
      if (c.hair === 'long') s += `<path d="M42,80 Q40,124 52,132 L108,132 Q120,124 118,80 Z" fill="${hc}"/>`;
      if (has('hood')) s += `<ellipse cx="80" cy="72" rx="40" ry="36" fill="${c.hoodC}"/>`;
      if (has('redtie')) s += `<circle cx="80" cy="96" r="5" fill="${PAL.red}"/>`;
      s += hat(c, back);
      return s + '</g></g></g></svg>';
    }
    s += `<path d="M44,66 Q80,80 116,66 L117,76 Q80,90 43,76 Z" fill="${INK}" opacity=".12" stroke="none"/>`;
    s += hair(c.hair, hc);
    if (c.hair && !['bald', 'buzz'].includes(c.hair) && !has('hood')) s += `<path d="M56,50 q12,-9 28,-7" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>`;
    if (has('hood')) s += `<path d="M38,78 Q38,30 80,30 Q122,30 122,78 Q108,48 80,48 Q52,48 38,78Z" fill="${c.hoodC}"/>`;
    if (has('redtie')) s += `<circle cx="${c.hair === 'long' ? 117 : 80}" cy="62" r="5" fill="${PAL.red}"/>`;
    if (has('mask')) s += `<path d="M42,92 Q80,104 118,92 L116,106 Q80,120 44,106 Z" fill="${INK}"/><path d="M44,64 Q80,74 116,64 L116,72 Q80,82 44,72Z" fill="${INK}"/>`;
    if (!has('faceless')) {
      const f = face(has('blank') && emo === 'neutral' ? 'neutral' : emo, ex, c, has);
      s += `</g><g class="e" stroke="none">${f.eyes}</g><g filter="url(#ink)">${f.lines}`;
      if (has('tired') && !['angry', 'surprised', 'happy'].includes(emo)) s += `<path d="M${59 + ex},92 q5,2 10,0 M${88 + ex},92 q5,2 10,0" fill="none" stroke-width="1.4" opacity=".6"/>`;
      if (has('mustache')) s += `<path d="M${66 + ex},99 Q${73 + ex},93 ${80 + ex},98 Q${87 + ex},93 ${94 + ex},99 Q${87 + ex},101 ${80 + ex},100 Q${73 + ex},101 ${66 + ex},99Z" fill="${INK}" stroke-width="2"/>`;
      if (has('glasses')) s += `<g fill="#fff" fill-opacity=".18" stroke-width="2.4"><circle cx="${66 + ex}" cy="86" r="9"/><circle cx="${94 + ex}" cy="86" r="9"/><path d="M${75 + ex},86 h10" fill="none"/></g>`;
      if (has('scar')) s += `<path d="M${100 + ex},62 L${92 + ex},98" fill="none" stroke="${PAL.red}" stroke-width="3"/><path d="M${93 + ex},70 l7,2 M${95 + ex},80 l7,2 M${93 + ex},90 l6,2" fill="none" stroke="${PAL.red}" stroke-width="1.6"/>`;
      s += f.extra;
    }
    s += hat(c, back);
    return s + '</g></g></g></svg>';
  }
  function hair(t, hc) {
    if (t === 'short') return `<path d="M42,78 Q38,38 80,38 Q122,38 118,78 Q108,58 80,60 Q52,58 42,78 Z" fill="${hc}"/>`;
    if (t === 'messy') return `<path d="M42,78 L38,54 L52,60 L52,40 L68,50 L80,32 L92,50 L108,40 L108,60 L122,54 L118,78 Q104,58 80,60 Q56,58 42,78Z" fill="${hc}"/>`;
    if (t === 'long') return `<path d="M42,80 Q38,38 80,38 Q122,38 118,80 Q100,56 80,58 Q60,56 42,80 Z" fill="${hc}"/>`;
    if (t === 'bun') return `<circle cx="80" cy="38" r="12" fill="${hc}"/><path d="M42,76 Q40,42 80,42 Q120,42 118,76 Q106,58 80,60 Q54,58 42,76 Z" fill="${hc}"/>`;
    if (t === 'buzz') return `<path d="M44,66 Q46,40 80,40 Q114,40 116,66 Q100,54 80,54 Q60,54 44,66Z" fill="${hc}" opacity=".85"/>`;
    if (t === 'bald') return `<path d="M42,72 Q39,94 48,102 Q48,84 56,72 Z M118,72 Q121,94 112,102 Q112,84 104,72 Z" fill="${INK}"/><path d="M62,46 q10,-6 22,-4" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`;
    return '';
  }
  function hat(c, back) {
    if (c.hat === 'fedora') return `<ellipse cx="80" cy="48" rx="52" ry="9" fill="${c.hatC}"/><path d="M54,48 Q54,16 80,16 Q106,16 106,48Z" fill="${c.hatC}"/><path d="M55,40 H105" fill="none" stroke="${PAL.wood}" stroke-width="5"/><path d="M62,24 q8,-5 16,-4" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.5"/>`;
    if (c.hat === 'cap') return `<path d="M42,54 Q44,20 80,20 Q116,20 118,54Z" fill="${PAL.police}"/><path d="M43,52 H117" fill="none" stroke="${PAL.red}" stroke-width="5"/><path d="M56,30 q10,-6 22,-6" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2.5"/>` +
      (back ? '' : `<path d="M46,54 Q80,66 114,54 L110,61 Q80,72 50,61Z" fill="${INK}"/><circle cx="80" cy="36" r="7" fill="${c.gold ? PAL.gold : PAL.mustard}"/><path d="M80,31 l1.8,4 h4 l-3.2,2.6 l1.2,4 l-3.8,-2.4 l-3.8,2.4 l1.2,-4 l-3.2,-2.6 h4z" fill="${PAL.red}" stroke="none"/>`);
    if (c.hat === 'cone') return `<path d="M80,14 L140,60 Q80,76 20,60 Z" fill="${PAL.gold}"/><path d="M80,14 L140,60 Q112,67 88,68 Z" fill="${INK}" opacity=".2" stroke="none"/><path d="M54,36 Q80,43 106,36 M37,50 Q80,62 123,50" fill="none" stroke-width="1.8"/>`;
    return '';
  }
  function cat(dir, vb, emo) {
    const back = dir === 'up', ex = dir === 'left' ? -7 : dir === 'right' ? 7 : 0, P = PAL.purple, L = 68 + ex, R = 92 + ex;
    let eyes;
    if (emo === 'happy' || emo === 'smile') eyes = `<path d="M${L - 6},114 q6,-8 12,0 M${R - 6},114 q6,-8 12,0" fill="none" stroke="${INK}" stroke-width="3"/>`;
    else if (emo === 'sleep') eyes = `<path d="M${L - 6},112 q6,5 12,0 M${R - 6},112 q6,5 12,0" fill="none" stroke="${INK}" stroke-width="3"/>`;
    else if (emo === 'angry') eyes = `<path d="M${L - 7},106 L${L + 5},110 M${R + 7},106 L${R - 5},110" stroke="${INK}" stroke-width="3"/><ellipse cx="${L}" cy="114" rx="6" ry="4.5" fill="#F2D35A"/><ellipse cx="${R}" cy="114" rx="6" ry="4.5" fill="#F2D35A"/><ellipse cx="${L}" cy="114" rx="1.4" ry="4" fill="${INK}"/><ellipse cx="${R}" cy="114" rx="1.4" ry="4" fill="${INK}"/>`;
    else if (emo === 'surprised' || emo === 'scared') eyes = `<circle cx="${L}" cy="112" r="7.5" fill="#F2D35A"/><circle cx="${R}" cy="112" r="7.5" fill="#F2D35A"/><circle cx="${L}" cy="112" r="5" fill="${INK}"/><circle cx="${R}" cy="112" r="5" fill="${INK}"/><circle cx="${L + 2}" cy="110" r="1.6" fill="#fff"/><circle cx="${R + 2}" cy="110" r="1.6" fill="#fff"/>`;
    else eyes = `<ellipse cx="${L}" cy="112" rx="6" ry="7" fill="#F2D35A"/><ellipse cx="${R}" cy="112" rx="6" ry="7" fill="#F2D35A"/><ellipse cx="${L}" cy="112" rx="1.8" ry="5.5" fill="${INK}"/><ellipse cx="${R}" cy="112" rx="1.8" ry="5.5" fill="${INK}"/><circle cx="${L + 2}" cy="109" r="1.4" fill="#fff"/><circle cx="${R + 2}" cy="109" r="1.4" fill="#fff"/>`;
    const ears = emo === 'angry' || emo === 'scared' ? `M48,104 L42,80 L70,96 Z M112,104 L118,80 L90,96Z` : `M50,108 L52,72 L74,94 Z M110,108 L108,72 L86,94Z`;
    const mouth = emo === 'angry' ? `<path d="M${74 + ex},124 l6,-4 l6,4" fill="#8A3A2C" stroke-width="2"/>` : emo === 'happy' ? `<path d="M${74 + ex},122 q3,4 6,0 q3,4 6,0" fill="none" stroke-width="2"/>` : `<path d="M${77 + ex},122 l3,3 l3,-3" fill="#E9A6B0" stroke-width="2"/>`;
    return `<svg viewBox="${vb}" class="chibi emo-${emo}"><g ${S}>
      <ellipse cx="80" cy="181" rx="34" ry="6" fill="${INK}" opacity=".18" stroke="none"/>
      <g class="bob"><g filter="url(#ink)"><path class="tail" d="M108,166 Q140,160 132,124" fill="none" stroke-width="12"/><path class="tail" d="M108,166 Q140,160 132,124" fill="none" stroke="${P}" stroke-width="6"/>
      <ellipse cx="80" cy="156" rx="32" ry="24" fill="${P}"/><path d="M64,148 q16,8 32,0" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="3"/>
      <ellipse cx="68" cy="176" rx="9" ry="5" fill="${P}"/><ellipse cx="92" cy="176" rx="9" ry="5" fill="${P}"/>
      <path d="${ears}" fill="${P}"/>${emo === 'angry' || emo === 'scared' ? '' : `<path d="M56,98 L57,82 L67,92Z M104,98 L103,82 L93,92Z" fill="#E9A6B0" stroke-width="1.6"/>`}
      <ellipse cx="80" cy="114" rx="34" ry="28" fill="${P}"/><path d="M66,96 q10,-6 24,-4" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="3"/>
      </g>${back ? '' : `<g class="e" stroke="none">${eyes}</g><g filter="url(#ink)">${mouth}<path d="M${54 + ex},120 h-14 M${54 + ex},126 l-12,3 M${106 + ex},120 h14 M${106 + ex},126 l12,3" fill="none" stroke-width="1.6"/>
      <ellipse cx="${56 + ex}" cy="124" rx="5" ry="3" fill="${PAL.red}" opacity="${emo === 'happy' ? .45 : .15}" stroke="none"/><ellipse cx="${104 + ex}" cy="124" rx="5" ry="3" fill="${PAL.red}" opacity="${emo === 'happy' ? .45 : .15}" stroke="none"/></g>`}
      </g></g></svg>`;
  }

  /* ---------- Bong bóng cảm xúc trên đầu ---------- */
  function emote(emo) {
    const sym = {
      surprised: `<path d="M30,14 v18" stroke="${PAL.red}" stroke-width="6"/><circle cx="30" cy="42" r="3.6" fill="${PAL.red}" stroke="none"/>`,
      angry: `<path d="M18,22 q6,4 12,0 M18,34 q6,-4 12,0 M34,22 q6,4 12,0 M34,34 q6,-4 12,0" fill="none" stroke="${PAL.red}" stroke-width="4"/>`,
      think: `<path d="M22,20 q8,-10 16,0 q2,8 -8,12 v6" fill="none" stroke-width="4.5"/><circle cx="30" cy="44" r="3" fill="${INK}" stroke="none"/>`,
      sad: `<path d="M30,14 q12,16 0,26 q-12,-10 0,-26z" fill="${PAL.sky}"/>`,
      cry: `<path d="M22,16 q9,12 0,20 q-9,-8 0,-20z M38,20 q9,12 0,20 q-9,-8 0,-20z" fill="${PAL.sky}"/>`,
      happy: `<path d="M24,40 V18 l14,-4 V36" fill="none" stroke-width="3.6"/><circle cx="21" cy="40" r="4.5" fill="${INK}" stroke="none"/><circle cx="35" cy="36" r="4.5" fill="${INK}" stroke="none"/>`,
      smile: `<path d="M30,42 C10,28 18,14 30,24 C42,14 50,28 30,42Z" fill="${PAL.red}"/>`,
      scared: `<path d="M18,16 l6,10 M30,12 v12 M42,16 l-6,10" fill="none" stroke-width="3.6"/><path d="M26,32 q6,8 0,12 q-6,-4 0,-12z" fill="${PAL.sky}" stroke-width="2"/>`,
      smug: `<path d="M30,12 l4,12 l12,2 l-10,6 l4,12 l-10,-8 l-10,8 l4,-12 l-10,-6 l12,-2z" fill="${PAL.mustard}"/>`,
      hurt: `<path d="M30,10 l4,10 l10,-4 l-4,10 l10,4 l-10,4 l4,10 l-10,-4 l-4,10 l-4,-10 l-10,4 l4,-10 l-10,-4 l10,-4 l-4,-10 l10,4z" fill="${PAL.red}" stroke-width="2"/>`,
      sleep: `<path d="M16,20 h10 l-10,12 h10 M32,14 h12 l-12,14 h12" fill="none" stroke-width="3.4"/>`,
    }[emo];
    if (!sym) return '';
    return `<svg viewBox="0 0 60 60" class="emote-svg"><g ${S} filter="url(#ink)"><path d="M8,6 H52 Q56,6 56,10 V44 Q56,48 52,48 H30 L20,57 L22,48 H8 Q4,48 4,44 V10 Q4,6 8,6Z" fill="${CREAM}"/>${sym}</g></svg>`;
  }

  function shadow(vb) {
    return `<svg viewBox="${vb}" class="chibi shadowy"><g filter="url(#ink2)" fill="${INK}" stroke="none">
      <ellipse cx="80" cy="181" rx="46" ry="7" opacity=".4"/><g class="bob"><path d="M40,180 Q30,120 56,104 Q42,70 80,36 Q118,70 104,104 Q130,120 120,180 Z"/>
      <ellipse cx="68" cy="84" rx="4" ry="2" fill="${PAPER}" opacity=".7"/><ellipse cx="92" cy="84" rx="4" ry="2" fill="${PAPER}" opacity=".7"/></g></g></svg>`;
  }

  /* ---------- Đồ vật nhìn từ trên xuống (đơn vị ô = 32) ---------- */
  const T = 32;
  const hsh = (a, b) => (((a * 73856093) ^ (b * 19349663)) >>> 0);
  // đồ treo tường / phẳng: không đổ bóng
  const FLAT = new Set(['rug', 'blood', 'steps', 'chalk', 'dust', 'trap', 'window', 'door', 'sign', 'board', 'banner', 'keyrack', 'clock', 'picture', 'calendar', 'poster', 'ac', 'shelfw', 'mirror', 'flag', 'portrait', 'whiteboard', 'switch', 'manhole', 'arrow', 'papers', 'ceil', 'lamp', 'cobweb', 'stage', 'stairs', 'wire', 'tarp', 'puddle', 'path', 'zebra', 'shutter', 'curtain']);
  function prop(p) {
    const x = p.x * T, y = p.y * T, w = (p.w || 1) * T, h = (p.h || 1) * T, k = p.k;
    const SW = (n = 2.6) => S.replace('3.5', String(n));
    const g = inner => `<g transform="translate(${x},${y})${p.rot ? ` rotate(${p.rot} ${w / 2} ${h / 2})` : ''}" ${SW()}>${inner}</g>`;
    const R = (xx, yy, ww, hh, f, r = 3, extra = '') => `<rect x="${xx}" y="${yy}" width="${ww}" height="${hh}" rx="${r}" fill="${f}" ${extra}/>`;
    const sh = (!FLAT.has(k) && !p.noShadow && k !== 'body') ? `<rect x="${x + 4}" y="${y + 6}" width="${w}" height="${h}" rx="6" fill="${INK}" opacity=".16" stroke="none"${p.rot ? ` transform="rotate(${p.rot} ${x + w / 2} ${y + h / 2})"` : ''}/>` : '';
    return sh + draw();
    function draw() {
      switch (k) {
        /* ----- nội thất ----- */
        case 'bed': return g(R(0, 0, w, h, PAL.wood, 4) + R(0, 0, w, 9, '#8A5E3A', 3) + R(5, 10, w - 10, h - 15, CREAM, 3) +
          R(9, 13, w * .38, h * .22, '#fff', 8) + `<path d="M${9 + w * .1},${18} q${w * .1},-3 ${w * .25},0" fill="none" stroke-width="1.2" opacity=".4"/>` +
          (p.messy ? `<path d="M5,${h * .42} Q${w * .3},${h * .3} ${w * .5},${h * .5} T${w - 5},${h * .45} V${h - 6} H5Z" fill="${p.c || PAL.sky}"/><path d="M${w * .2},${h * .55} q${w * .15},${h * .12} ${w * .35},0 M${w * .55},${h * .7} q${w * .1},-${h * .1} ${w * .3},0" fill="none" stroke-width="1.4"/>`
            : R(5, h * .42, w - 10, h * .58 - 6, p.c || PAL.sky, 3) + `<path d="M5,${h * .42 + 8} H${w - 5}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><path d="M${w * .25},${h * .6} q${w * .1},6 ${w * .2},0 M${w * .55},${h * .75} q${w * .1},6 ${w * .2},0" fill="none" stroke-width="1.2" opacity=".45"/>`));
        case 'wardrobe': return g(R(0, 0, w, h, p.open ? '#6B4A30' : PAL.wood, 3) + R(0, 0, w, 7, '#8A5E3A', 2) +
          (p.open ? R(4, 10, w / 2 - 6, h - 20, INK, 2) + `<path d="M8,${h * .3} q6,8 14,0 M10,${h * .55} l8,8" fill="none" stroke="${PAL.sky}" stroke-width="4"/>` + R(-w * .18, 8, w * .2, h - 18, '#8A5E3A', 2) : '') +
          `<path d="M${w / 2},8 V${h - 6}" fill="none"/><rect x="${w / 2 - 9}" y="${h * .5}" width="3" height="10" rx="1" fill="${PAL.gold}" stroke-width="1.2"/><rect x="${w / 2 + 6}" y="${h * .5}" width="3" height="10" rx="1" fill="${PAL.gold}" stroke-width="1.2"/>` +
          `<path d="M6,14 V${h - 12}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>` + R(0, h - 7, w, 7, INK, 1));
        case 'cabinet': return g(R(0, 0, w, h, PAL.wood, 3) + [0, 1, 2].map(i => {
          const yy = 5 + i * (h - 10) / 3, hh2 = (h - 10) / 3 - 4, open = p.open && i === 1;
          return open ? R(3, yy + 4, w - 6, hh2, INK, 2) + R(1, yy + 8, w - 2, hh2, '#B98552', 2) + `<path d="M8,${yy + 12} q8,6 16,-2 q6,8 14,0" fill="none" stroke="${CREAM}" stroke-width="3.5"/>` : R(5, yy, w - 10, hh2, '#B98552', 2) + `<rect x="${w / 2 - 6}" y="${yy + hh2 / 2 - 1.5}" width="12" height="3" rx="1.5" fill="${PAL.gold}" stroke-width="1"/>`;
        }).join(''));
        case 'table': return g(R(0, 0, w, h, p.c || '#B98552', 6) + `<path d="M8,${h * .3} q${w * .3},-3 ${w * .6},2 M10,${h * .7} q${w * .3},3 ${w * .5},-1" fill="none" stroke-width="1.2" opacity=".35"/>` + (p.items || []).map((it, i) => item(it, w * (.22 + i * .28), h * .5)).join(''));
        case 'desk': return g(R(0, 0, w, h, '#B98552', 4) + R(w * .52, 3, w * .38, h * .5, INK, 2) + R(w * .55, 6, w * .32, h * .36, '#9CC4E0', 1) + `<path d="M${w * .58},10 l8,8" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>` +
          R(w * .55, h * .62, w * .3, h * .16, '#D8D2C4', 2, 'stroke-width="1.6"') + R(6, h * .18, w * .32, h * .5, CREAM, 1, 'transform="rotate(-6 20 20)"') + `<path d="M12,${h * .32} h${w * .2} M12,${h * .44} h${w * .16}" fill="none" stroke-width="1.2"/>` + item('mug', w * .42, h * .35));
        case 'chair': return g(R(3, 6, w - 6, h - 8, p.c || PAL.wood, 4) + R(3, 0, w - 6, 7, INK, 2) + `<path d="M8,${h * .55} h${w - 16}" fill="none" stroke-width="1" opacity=".35"/>`);
        case 'stool': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .38}" fill="${p.c || PAL.red}"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * .18}" fill="none" stroke-width="1.6" opacity=".6"/><path d="M${w * .32},${h * .38} q4,-4 9,-3" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`);
        case 'sofa': return g(R(0, 0, w, h, p.c || PAL.red, 10) + R(8, 6, w - 16, h * .45, '#C9675A', 6) + R(0, 0, 10, h, '#9E3E33', 6) + R(w - 10, 0, 10, h, '#9E3E33', 6) + `<path d="M${w / 2},8 V${h * .5}" fill="none" stroke-width="1.4"/>` + R(w * .15, h * .2, w * .16, h * .3, PAL.mustard, 5));
        case 'counter': return g(R(0, 0, w, h, '#6B4A30', 4) + R(0, 0, w, h * .42, '#8A5E3A', 4) + `<path d="M0,${h * .42} H${w}" fill="none"/><path d="M6,${h * .2} H${w - 6}" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>` +
          item('ledger', w * .18, h * .22) + item('bell', w * .42, h * .2) + item('phone2', w * .62, h * .22) + item('register', w * .85, h * .2));
        case 'shelf': return g(R(0, 0, w, h, '#8A5E3A', 2) + Array.from({ length: Math.max(2, Math.round(w / 9)) }, (_, i) => R(3 + i * 9, 3, 7, h - 6, [PAL.red, PAL.navy, PAL.mustard, PAL.green, PAL.teal, CREAM][hsh(i, x | 0) % 6], 1, 'stroke-width="1.2"')).join(''));
        case 'rug': return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" rx="6" fill="${p.c || PAL.red}" opacity=".9" ${SW(2)}/><rect x="8" y="8" width="${w - 16}" height="${h - 16}" rx="4" fill="none" stroke="${CREAM}" stroke-width="2" stroke-dasharray="6 5"/>` +
          `<path d="M${w / 2},${h * .25} L${w * .7},${h / 2} L${w / 2},${h * .75} L${w * .3},${h / 2}Z" fill="none" stroke="${CREAM}" stroke-width="2" opacity=".7"/><circle cx="${w / 2}" cy="${h / 2}" r="4" fill="${PAL.mustard}"/>` +
          Array.from({ length: Math.round(w / 10) }, (_, i) => `<path d="M${5 + i * 10},0 v-4 M${5 + i * 10},${h} v4" stroke="${p.c || PAL.red}" stroke-width="2"/>`).join('') + `</g>`;
        case 'window': {
          const n = Math.max(2, Math.round(w / 14)), night = p.night;
          return g(R(-4, -3, w + 8, h + 6, '#8A5E3A', 2) + R(0, 0, w, h, night ? '#2E3A66' : '#BFD8E2', 1) + (night ? `<circle cx="${w * .75}" cy="${h * .35}" r="${h * .2}" fill="#F3EEDF" opacity=".9"/>` : `<path d="M4,${h - 3} L${w * .35},3 M${w * .2},${h - 3} L${w * .5},3" stroke="#fff" stroke-width="3" opacity=".6"/>`) +
            Array.from({ length: n - 1 }, (_, i) => `<path d="M${(i + 1) * w / n},0 V${h}" fill="none" stroke-width="2.4"/>`).join('') + `<path d="M0,${h / 2} H${w}" fill="none" stroke-width="2"/>` +
            (p.shadow ? `<path d="M${w * .35},${h} Q${w * .3},${h * .3} ${w * .5},${h * .2} Q${w * .7},${h * .3} ${w * .65},${h}Z" fill="${INK}"/>` : '') +
            `<path d="M-6,-3 Q${w * .12},${h * .5} -2,${h + 6} L-10,${h + 6} L-10,-3Z M${w + 6},-3 Q${w * .88},${h * .5} ${w + 2},${h + 6} L${w + 10},${h + 6} L${w + 10},-3Z" fill="${p.curtain || '#9E4A3A'}"/>` + R(-6, h, w + 12, 4, '#B98552', 1));
        }
        case 'door': return g(R(-3, -3, w + 6, h + 3, '#6B4A30', 2) + R(0, 0, w, h, '#8A5E3A', 2) + R(5, 5, w - 10, h * .36, '#9E6E46', 2) + R(5, h * .48, w - 10, h * .44, '#9E6E46', 2) + `<circle cx="${w - 8}" cy="${h * .58}" r="2.8" fill="${PAL.gold}"/>` +
          (p.label ? R(w / 2 - 9, h * .12, 18, 11, CREAM, 2, 'stroke-width="1.4"') + `<text x="${w / 2}" y="${h * .12 + 8.5}" font-size="8" text-anchor="middle" fill="${INK}" stroke="none" font-family="sans-serif" font-weight="bold">${p.label}</text>` : ''));
        case 'plant': return g(R(w * .28, h * .58, w * .44, h * .38, PAL.red, 4) + R(w * .24, h * .56, w * .52, h * .08, '#9E3E33', 2) + `<circle cx="${w / 2}" cy="${h * .38}" r="${w * .34}" fill="${PAL.olive}"/>` +
          [[-.18, -.06], [.18, -.08], [0, -.22], [-.1, .1], [.14, .08]].map(([a, b], i) => `<ellipse cx="${w * (.5 + a)}" cy="${h * (.38 + b)}" rx="${w * .14}" ry="${w * .08}" fill="${i % 2 ? PAL.green : '#5FA872'}" transform="rotate(${i * 50} ${w * (.5 + a)} ${h * (.38 + b)})"/>`).join(''));
        case 'bush': return g(`<circle cx="${w * .3}" cy="${h * .55}" r="${w * .3}" fill="${PAL.green}"/><circle cx="${w * .7}" cy="${h * .55}" r="${w * .3}" fill="${PAL.olive}"/><circle cx="${w * .5}" cy="${h * .35}" r="${w * .3}" fill="#5FA872"/><circle cx="${w * .42}" cy="${h * .3}" r="2.5" fill="#fff" stroke="none"/><circle cx="${w * .66}" cy="${h * .5}" r="2" fill="${PAL.red}" stroke="none"/>`);
        case 'tree': return g(`<ellipse cx="${w / 2}" cy="${h * .9}" rx="${w * .3}" ry="${h * .08}" fill="${INK}" opacity=".2" stroke="none"/>` + R(w * .42, h * .55, w * .16, h * .38, PAL.brown, 2) + `<circle cx="${w / 2}" cy="${h * .38}" r="${w * .42}" fill="${PAL.olive}"/><circle cx="${w * .32}" cy="${h * .3}" r="${w * .2}" fill="${PAL.green}" opacity=".85"/><circle cx="${w * .66}" cy="${h * .44}" r="${w * .18}" fill="#5A8A4A" opacity=".85"/><path d="M${w * .3},${h * .2} q${w * .1},-${h * .06} ${w * .2},-${h * .02}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2.5"/>`);
        case 'stairs': return g(R(0, 0, w, h, '#B98552', 2) + Array.from({ length: 7 }, (_, i) => R(2, i * h / 7, w - 4, h / 7, i % 2 ? '#C9955F' : '#B98552', 0, 'stroke-width="1.6"')).join('') + `<path d="M${w - 4},0 V${h}" fill="none" stroke="${INK}" stroke-width="4"/><path d="M4,0 V${h}" fill="none" stroke="#8A5E3A" stroke-width="3"/>`);
        case 'keyrack': return g(R(0, 0, w, h, '#6B4A30', 2) + Array.from({ length: 8 }, (_, i) => `<circle cx="${8 + i * (w - 16) / 7}" cy="${h * .3}" r="2" fill="${CREAM}"/>${i === 3 ? '' : `<path d="M${8 + i * (w - 16) / 7},${h * .3} v4" stroke-width="1"/><rect x="${5.5 + i * (w - 16) / 7}" y="${h * .42}" width="5" height="${h * .36}" rx="1.5" fill="${PAL.gold}" stroke-width="1"/>`}<text x="${8 + i * (w - 16) / 7}" y="${h * .95}" font-size="5" text-anchor="middle" fill="${CREAM}" stroke="none">${201 + i}</text>`).join(''));
        case 'sign': return g(R(0, 0, w, h, PAL.red, 3) + R(3, 3, w - 6, h - 6, 'none', 2, `stroke="${PAL.gold}" stroke-width="1.5"`) + `<text x="${w / 2}" y="${h * .68}" font-size="${h * .48}" text-anchor="middle" fill="${PAL.gold}" stroke="none" font-family="serif" font-weight="bold">${p.text || ''}</text>`);
        case 'board': return g(R(-3, -3, w + 6, h + 6, '#8A5E3A', 3) + R(0, 0, w, h, '#3E5A44', 2) + `<path d="M12,${h * .3} q${w * .2},-4 ${w * .45},0 M12,${h * .55} q${w * .3},3 ${w * .65},0 M12,${h * .8} q${w * .15},-2 ${w * .3},0" fill="none" stroke="${CREAM}" stroke-width="2" opacity=".75"/>` + R(w - 20, h - 7, 12, 4, '#fff', 1, 'stroke-width="1"'));
        case 'whiteboard': return g(R(-3, -3, w + 6, h + 6, '#9AA2A8', 3) + R(0, 0, w, h, '#FAFAF5', 2) + [[.12, .18], [.42, .12], [.7, .22]].map(([a, b], i) => R(w * a, h * b, w * .16, h * .5, ['#EBCDAA', '#C9CED6', '#EBCDAA'][i], 1, 'stroke-width="1.4"')).join('') + `<path d="M${w * .2},${h * .45} L${w * .5},${h * .38} L${w * .78},${h * .5}" fill="none" stroke="${PAL.red}" stroke-width="1.6"/><circle cx="${w * .2}" cy="${h * .2}" r="2" fill="${PAL.red}"/><circle cx="${w * .5}" cy="${h * .14}" r="2" fill="${PAL.red}"/><circle cx="${w * .78}" cy="${h * .24}" r="2" fill="${PAL.red}"/>`);
        case 'stage': return g(R(0, 0, w, h, '#9E4A3A', 4) + Array.from({ length: Math.round(w / 24) }, (_, i) => `<path d="M${i * 24},0 V${h - 8}" fill="none" stroke-width="1" opacity=".3"/>`).join('') + R(0, h - 9, w, 9, '#6B2A22', 2));
        case 'banner': return g(R(0, 0, w, h, p.c || PAL.red, 2) + R(3, 3, w - 6, h - 6, 'none', 1, `stroke="${PAL.gold}" stroke-width="1.5"`) + `<text x="${w / 2}" y="${h * .66}" font-size="${h * .44}" text-anchor="middle" fill="${p.tc || PAL.gold}" stroke="none" font-family="serif" font-weight="bold">${p.text || ''}</text>`);
        case 'case': return g(R(0, 0, w, h, '#8A5E3A', 2) + R(4, 4, w - 8, h - 12, '#D7EAF0', 2) + `<path d="M8,8 L18,${h - 14} M16,6 L22,16" fill="none" stroke="#fff" stroke-width="2"/>` + `<rect x="${w / 2 - 6}" y="${h / 2 - 7}" width="12" height="9" rx="2" fill="#F3EEDF" stroke-width="1.2" stroke-dasharray="2 2"/>`);
        case 'seats': return g(Array.from({ length: Math.round(w / T) }, (_, i) => R(i * T + 3, 4, T - 6, h - 6, p.c || '#9E4A3A', 5) + R(i * T + 3, 0, T - 6, 7, INK, 3)).join(''));
        case 'coffin': return g(R(0, 0, w, h, '#5A231C', 10) + R(5, 5, w - 10, h - 10, '#7A3226', 8) + R(w * .2, 2, w * .3, h - 4, CREAM, 3, 'opacity=".9"') + `<path d="M${w * .25},${h * .3} h${w * .2} M${w * .25},${h * .7} h${w * .2}" fill="none" stroke="${PAL.gold}" stroke-width="1.6"/>` +
          `<path d="M${w * .62},${h / 2} H${w * .9} M${w * .76},${h * .25} V${h * .75}" fill="none" stroke="${PAL.gold}" stroke-width="2.6"/>` + [[.14, .5], [.56, .25], [.56, .75]].map(([a, b]) => `<circle cx="${w * a}" cy="${h * b}" r="4.5" fill="#fff"/><circle cx="${w * a}" cy="${h * b}" r="1.6" fill="${PAL.mustard}" stroke="none"/>`).join(''));
        case 'altar': return g(R(0, 0, w, h, '#6B2A22', 3) + R(2, 2, w - 4, h * .35, '#8A3A2C', 2) + `<path d="M4,${h * .2} H${w - 4}" fill="none" stroke="${PAL.gold}" stroke-width="1.4"/>` +
          R(w * .41, -h * .35, w * .18, h * .78, INK, 2) + R(w * .44, -h * .27, w * .12, h * .55, '#B8B0A0', 1) + `<circle cx="${w * .5}" cy="${-h * .1}" r="${w * .035}" fill="#8A8070" stroke-width="1"/>` +
          [w * .1, w * .9].map(cx => R(cx - 3, h * .15, 6, h * .5, CREAM, 1) + `<ellipse cx="${cx}" cy="${h * .08}" rx="3.5" ry="6" fill="${PAL.mustard}" class="flame"/>`).join('') +
          `<ellipse cx="${w * .27}" cy="${h * .55}" rx="${w * .07}" ry="${h * .2}" fill="${PAL.gold}"/><path d="M${w * .24},${h * .5} v-${h * .55} M${w * .27},${h * .5} v-${h * .65} M${w * .3},${h * .5} v-${h * .5}" fill="none" stroke-width="1.2"/>` +
          `<ellipse cx="${w * .73}" cy="${h * .6}" rx="${w * .08}" ry="${h * .2}" fill="${CREAM}"/>` + [[-.03, .5, PAL.red], [.03, .52, PAL.mustard], [0, .44, PAL.green]].map(([a, b, c]) => `<circle cx="${w * (.73 + a)}" cy="${h * b}" r="4" fill="${c}" stroke-width="1.4"/>`).join(''));
        case 'flowers': return g(R(w * .45, h * .55, w * .1, h * .45, PAL.brown, 1) + `<circle cx="${w / 2}" cy="${h * .4}" r="${w * .44}" fill="${CREAM}"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${w / 2 + Math.cos(i * .9) * w * .26}" cy="${h * .4 + Math.sin(i * .9) * w * .26}" r="${w * .11}" fill="${i % 3 ? '#fff' : '#F2D35A'}"/>`).join('') + `<path d="M${w * .2},${h * .7} L${w * .1},${h} M${w * .8},${h * .7} L${w * .9},${h}" fill="none" stroke="${INK}" stroke-width="2"/>`);
        case 'wreath': return g(`<path d="M${w / 2},${h * .62} V${h}" fill="none" stroke-width="3"/><path d="M${w * .2},${h} L${w / 2},${h * .7} L${w * .8},${h}" fill="none" stroke-width="2"/><circle cx="${w / 2}" cy="${h * .36}" r="${w * .44}" fill="${PAL.green}"/><circle cx="${w / 2}" cy="${h * .36}" r="${w * .26}" fill="#fff"/>` +
          Array.from({ length: 10 }, (_, i) => `<circle cx="${w / 2 + Math.cos(i * .63) * w * .35}" cy="${h * .36 + Math.sin(i * .63) * w * .35}" r="${w * .07}" fill="${i % 2 ? '#fff' : '#E9E2D0'}" stroke-width="1.2"/>`).join('') + R(w * .38, h * .3, w * .24, h * .5, CREAM, 1, 'stroke-width="1.2"') + `<path d="M${w * .44},${h * .4} v${h * .3} M${w * .56},${h * .4} v${h * .3}" fill="none" stroke-width="1" opacity=".6"/>`);
        case 'cage': return g(R(0, 0, w, h, 'none', 4) + Array.from({ length: 5 }, (_, i) => `<path d="M${(i + 1) * w / 6},2 V${h - 2}" fill="none" stroke-width="2"/>`).join(''));
        case 'tv': return g(R(0, 0, w, h, INK, 3) + R(4, 3, w - 8, h - 9, p.on === false ? '#4A4650' : '#9CC4E0', 2) + `<path d="M8,6 l10,8" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/>` + R(w / 2 - 8, h - 5, 16, 5, '#4A4650', 1));
        case 'suitcase': return g(R(0, h * .15, w, h * .85, PAL.brown, 4) + `<path d="M${w * .35},${h * .15} V2 H${w * .65} V${h * .15}" fill="none"/><path d="M0,${h * .5} H${w}" fill="none" stroke-width="1.4"/>` + R(w * .42, h * .42, w * .16, h * .14, PAL.gold, 1, 'stroke-width="1"'));
        case 'files': return g(R(0, 0, w, h, PAL.mustard, 2) + R(4, -4, w - 4, h - 4, '#F7F2E2', 2) + `<path d="M8,${h * .25} H${w - 8} M8,${h * .45} H${w - 10} M8,${h * .65} H${w * .6}" fill="none" stroke-width="1.4"/>` + `<circle cx="${w - 9}" cy="${h * .65}" r="3.5" fill="${PAL.red}" stroke-width="1"/>`);
        case 'papers': return `<g transform="translate(${x},${y})" ${SW(1.6)}>` + Array.from({ length: p.n || 5 }, (_, i) => { const a = hsh(i, x | 0) % 360, px = (hsh(i + 3, y | 0) % 100) / 100 * (w - 16), py = (hsh(i + 7, x | 0) % 100) / 100 * (h - 14); return `<g transform="translate(${px},${py}) rotate(${a} 8 6)"><rect width="16" height="12" rx="1" fill="#FAF6EA"/><path d="M3,4 h10 M3,8 h7" fill="none" stroke-width="1"/></g>`; }).join('') + `</g>`;
        case 'clothes': return g(`<path d="M2,${h * .7} Q${w * .2},${h * .2} ${w * .5},${h * .3} Q${w * .8},${h * .1} ${w - 2},${h * .7} Q${w * .5},${h} 2,${h * .7}Z" fill="${PAL.sky}"/><path d="M${w * .15},${h * .55} Q${w * .5},${h * .2} ${w * .85},${h * .6}" fill="none" stroke="${PAL.red}" stroke-width="5"/><path d="M${w * .3},${h * .75} q${w * .2},-${h * .25} ${w * .45},-${h * .05}" fill="none" stroke="${PAL.green}" stroke-width="5"/><path d="M${w * .5},${h * .55} l3,4 M${w * .65},${h * .5} l3,4" stroke="#7E9A5E" stroke-width="2"/>`);
        case 'box': return g(R(0, 0, w, h, '#C9A06A', 2) + `<path d="M0,${h * .3} H${w} M${w / 2},0 V${h * .3}" fill="none" stroke-width="1.6"/>` + R(w * .38, 0, w * .24, h * .3, '#D9C27A', 0, 'stroke-width="1"'));
        case 'crate': return g(R(0, 0, w, h, '#B98552', 2) + `<path d="M0,0 L${w},${h} M${w},0 L0,${h}" fill="none" stroke-width="2"/>` + R(0, 0, w, h, 'none', 2));
        case 'basket': return g(`<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * .46}" ry="${h * .42}" fill="#C79A5E"/>` + `<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * .3}" ry="${h * .26}" fill="${p.c || PAL.red}"/>` + Array.from({ length: 5 }, (_, i) => `<circle cx="${w * (.3 + (i % 3) * .2)}" cy="${h * (.42 + Math.floor(i / 3) * .16)}" r="${w * .09}" fill="${[PAL.red, PAL.mustard, PAL.green][i % 3]}" stroke-width="1.2"/>`).join(''));
        case 'trash': return g(`<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * .4}" ry="${h * .4}" fill="${p.c || PAL.teal}"/><ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * .28}" ry="${h * .28}" fill="${INK}" opacity=".6"/><path d="M${w * .35},${h * .45} l${w * .2},${h * .1} M${w * .45},${h * .36} l${w * .1},${h * .25}" stroke="${CREAM}" stroke-width="2"/>`);
        case 'slippers': return g(`<ellipse cx="${w * .3}" cy="${h / 2}" rx="${w * .14}" ry="${h * .36}" fill="${p.c || PAL.red}" transform="rotate(-12 ${w * .3} ${h / 2})"/><ellipse cx="${w * .66}" cy="${h / 2}" rx="${w * .14}" ry="${h * .36}" fill="${p.c || PAL.red}" transform="rotate(10 ${w * .66} ${h / 2})"/><path d="M${w * .2},${h * .35} h${w * .2} M${w * .56},${h * .35} h${w * .2}" stroke="${CREAM}" stroke-width="3"/>`);
        case 'lampfloor': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .36}" fill="#F6E7B8"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * .14}" fill="${PAL.mustard}"/>`);
        case 'fan': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .42}" fill="#D8D2C4"/>` + [0, 120, 240].map(a => `<ellipse cx="${w / 2}" cy="${h / 2 - w * .2}" rx="${w * .1}" ry="${w * .2}" fill="${PAL.sky}" transform="rotate(${a} ${w / 2} ${h / 2})" stroke-width="1.4"/>`).join('') + `<circle cx="${w / 2}" cy="${h / 2}" r="${w * .07}" fill="${INK}"/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${w / 2},${h / 2} L${w / 2 + Math.cos(i * 1.05) * w * .42},${h / 2 + Math.sin(i * 1.05) * w * .42}" stroke-width=".8" opacity=".5"/>`).join(''));
        case 'dispenser': return g(R(w * .15, h * .3, w * .7, h * .66, '#E8E4DA', 3) + `<ellipse cx="${w / 2}" cy="${h * .28}" rx="${w * .3}" ry="${h * .26}" fill="#BFE0F0"/><path d="M${w * .38},${h * .2} q6,-6 12,0" fill="none" stroke="#fff" stroke-width="2"/>` + R(w * .28, h * .62, 5, 6, PAL.red, 1, 'stroke-width="1"') + R(w * .58, h * .62, 5, 6, PAL.sky, 1, 'stroke-width="1"'));
        case 'motorbike': return g(`<ellipse cx="${w / 2}" cy="${h * .12}" rx="${w * .22}" ry="${h * .1}" fill="${INK}"/><ellipse cx="${w / 2}" cy="${h * .9}" rx="${w * .22}" ry="${h * .1}" fill="${INK}"/>` + R(w * .22, h * .18, w * .56, h * .66, p.c || PAL.red, 12) + R(w * .3, h * .45, w * .4, h * .32, INK, 8) + `<path d="M0,${h * .22} H${w}" fill="none" stroke-width="4"/><circle cx="0" cy="${h * .22}" r="3" fill="${INK}"/><circle cx="${w}" cy="${h * .22}" r="3" fill="${INK}"/><circle cx="${w / 2}" cy="${h * .2}" r="4" fill="#F6E7B8" stroke-width="1.4"/><path d="M${w * .32},${h * .3} q${w * .1},-4 ${w * .2},0" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`);
        case 'bicycle': return g(`<circle cx="${w * .2}" cy="${h / 2}" r="${h * .4}" fill="none" stroke-width="2.4"/><circle cx="${w * .8}" cy="${h / 2}" r="${h * .4}" fill="none" stroke-width="2.4"/><path d="M${w * .2},${h / 2} L${w * .45},${h * .2} L${w * .8},${h / 2} M${w * .45},${h * .2} L${w * .5},${h / 2}" fill="none" stroke="${PAL.teal}" stroke-width="3"/>`);
        case 'cart': return g(R(0, h * .15, w, h * .7, PAL.sky, 4) + R(4, h * .2, w - 8, h * .3, '#D7EAF0', 2) + `<circle cx="${w * .18}" cy="${h * .92}" r="5" fill="${INK}"/><circle cx="${w * .82}" cy="${h * .92}" r="5" fill="${INK}"/>` + [.2, .4, .6, .8].map(a => `<circle cx="${w * a}" cy="${h * .35}" r="4" fill="${PAL.mustard}" stroke-width="1.2"/>`).join('') + R(w * .2, h * .6, w * .6, h * .14, PAL.red, 1, 'stroke-width="1"') + `<text x="${w / 2}" y="${h * .72}" font-size="6" text-anchor="middle" fill="${CREAM}" stroke="none" font-weight="bold">BÁNH MÌ</text>`);
        case 'jar': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .44}" fill="#8A5E3A"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * .3}" fill="#3A4766"/><path d="M${w * .38},${h * .4} q4,-3 8,0" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>`);
        case 'pole': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .32}" fill="#9AA2A8"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * .12}" fill="${INK}"/>` + R(w * .1, h * .4, w * .8, h * .2, '#6E7A80', 1));
        case 'wire': return `<path d="M${x},${y} Q${(x + p.x2 * T) / 2},${(y + p.y2 * T) / 2 + 30} ${p.x2 * T},${p.y2 * T}" fill="none" stroke="${INK}" stroke-width="1.6" opacity=".7"/><path d="M${x},${y + 4} Q${(x + p.x2 * T) / 2 + 10},${(y + p.y2 * T) / 2 + 44} ${p.x2 * T},${p.y2 * T + 4}" fill="none" stroke="${INK}" stroke-width="1.2" opacity=".55"/>`;
        case 'manhole': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .42}" fill="#6E6A66"/>` + [-.2, 0, .2].map(a => `<path d="M${w * .15},${h * (.5 + a)} H${w * .85}" stroke-width="1.4"/>`).join(''));
        case 'arrow': return `<g transform="translate(${x},${y})" fill="#F3EEDF" opacity=".75"><path d="M0,${h * .4} H${w * .65} V${h * .15} L${w},${h / 2} L${w * .65},${h * .85} V${h * .6} H0Z"/></g>`;
        case 'zebra': return `<g transform="translate(${x},${y})" fill="#F3EEDF" opacity=".75">${Array.from({ length: Math.round(w / 14) }, (_, i) => `<rect x="${i * 14}" y="0" width="8" height="${h}"/>`).join('')}</g>`;
        case 'puddle': return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="#8FB7C4" opacity=".5"/>`;
        case 'shutter': return g(R(0, 0, w, h, '#9AA2A8', 1) + Array.from({ length: Math.round(h / 4) }, (_, i) => `<path d="M0,${i * 4} H${w}" stroke-width=".9" opacity=".7"/>`).join(''));
        case 'clothesline': return `<g ${SW(1.6)}><path d="M${x},${y} L${x + w},${y}" fill="none"/>${Array.from({ length: Math.round(w / 20) }, (_, i) => `<path d="M${x + 6 + i * 20},${y} l-5,12 h14 l-5,-12z" fill="${[PAL.red, PAL.sky, PAL.mustard, CREAM][i % 4]}"/>`).join('')}</g>`;
        case 'cobweb': return `<g transform="translate(${x},${y})" stroke="${CREAM}" stroke-width="1" opacity=".55" fill="none"><path d="M0,0 L${w},${h * .2} M0,0 L${w * .6},${h * .6} M0,0 L${w * .2},${h}"/><path d="M${w * .3},${h * .06} Q${w * .25},${h * .25} ${w * .06},${h * .3} M${w * .6},${h * .12} Q${w * .5},${h * .5} ${w * .12},${h * .6}"/></g>`;
        case 'candelabra': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .3}" fill="${PAL.gold}"/>` + [[0, 0], [-.25, 0], [.25, 0]].map(([a]) => `<ellipse cx="${w * (.5 + a)}" cy="${h * .35}" rx="2.5" ry="5" fill="${PAL.mustard}" class="flame"/>`).join(''));
        case 'statue': return g(`<rect x="${w * .1}" y="${h * .6}" width="${w * .8}" height="${h * .35}" rx="2" fill="#9AA2A8"/><circle cx="${w / 2}" cy="${h * .28}" r="${w * .2}" fill="#C9CED6"/><path d="M${w * .25},${h * .62} Q${w / 2},${h * .3} ${w * .75},${h * .62}Z" fill="#C9CED6"/>`);
        case 'podium': return g(R(0, 0, w, h, '#6B4A30', 3) + R(3, 3, w - 6, h * .45, '#8A5E3A', 2) + `<circle cx="${w / 2}" cy="${h * .25}" r="3" fill="${INK}"/><path d="M${w / 2},${h * .25} L${w * .7},${-h * .2}" fill="none" stroke-width="2"/><circle cx="${w * .7}" cy="${-h * .2}" r="3.5" fill="#4A4650"/>`);
        case 'speaker': return g(R(0, 0, w, h, INK, 3) + `<circle cx="${w / 2}" cy="${h * .35}" r="${w * .25}" fill="#4A4650" stroke="${CREAM}" stroke-width="1"/><circle cx="${w / 2}" cy="${h * .75}" r="${w * .14}" fill="#4A4650" stroke="${CREAM}" stroke-width="1"/>`);
        case 'curtain': return g(R(0, 0, w, h, '#8A2A22', 2) + Array.from({ length: Math.round(w / 6) }, (_, i) => `<path d="M${i * 6 + 3},0 V${h}" stroke="#6B1E18" stroke-width="2"/>`).join(''));
        case 'flag': return g(R(0, 0, w, h, '#C8102E', 1) + `<path d="M${w / 2},${h * .2} l${w * .07},${h * .2} h${w * .2} l-${w * .16},${h * .13} l${w * .07},${h * .22} l-${w * .18},-${h * .13} l-${w * .18},${h * .13} l${w * .07},-${h * .22} l-${w * .16},-${h * .13} h${w * .2}z" fill="#FFD400" stroke="none"/>`);
        case 'portrait': return g(R(0, 0, w, h, '#C9A23A', 2) + R(3, 3, w - 6, h - 6, '#8A8070', 1) + `<circle cx="${w / 2}" cy="${h * .42}" r="${w * .18}" fill="#C9C0B0" stroke-width="1"/><path d="M${w * .22},${h - 4} Q${w / 2},${h * .5} ${w * .78},${h - 4}" fill="#C9C0B0" stroke-width="1"/>`);
        case 'clock': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .42}" fill="${CREAM}"/><path d="M${w / 2},${h / 2} V${h * .22} M${w / 2},${h / 2} L${w * .7},${h * .58}" fill="none" stroke-width="2"/>` + Array.from({ length: 12 }, (_, i) => `<circle cx="${w / 2 + Math.cos(i * .52) * w * .32}" cy="${h / 2 + Math.sin(i * .52) * w * .32}" r=".9" fill="${INK}" stroke="none"/>`).join(''));
        case 'picture': return g(R(0, 0, w, h, PAL.wood, 1) + R(3, 3, w - 6, h - 6, '#BFD8E2', 0, 'stroke-width="1"') + `<path d="M3,${h - 3} L${w * .4},${h * .35} L${w * .6},${h * .6} L${w * .75},${h * .45} L${w - 3},${h - 3}Z" fill="${PAL.olive}" stroke-width="1"/><circle cx="${w * .75}" cy="${h * .28}" r="2.5" fill="${PAL.mustard}" stroke="none"/>`);
        case 'calendar': return g(R(0, 0, w, h, '#fff', 1) + R(0, 0, w, h * .3, PAL.red, 1) + `<text x="${w / 2}" y="${h * .82}" font-size="${h * .42}" text-anchor="middle" fill="${INK}" stroke="none" font-weight="bold">${p.text || '18'}</text>`);
        case 'poster': return g(R(0, 0, w, h, p.c || PAL.mustard, 1) + `<text x="${w / 2}" y="${h * .45}" font-size="${Math.min(8, h * .28)}" text-anchor="middle" fill="${INK}" stroke="none" font-weight="bold" font-family="sans-serif">${p.text || ''}</text><path d="M${w * .2},${h * .7} h${w * .6}" fill="none" stroke-width="1"/>`);
        case 'ac': return g(R(0, 0, w, h, '#F7F5EE', 6) + `<path d="M6,${h * .6} H${w - 6} M6,${h * .78} H${w - 6}" fill="none" stroke-width="1.2"/><circle cx="${w - 8}" cy="${h * .3}" r="2" fill="${PAL.green}" stroke="none"/>`);
        case 'shelfw': return g(R(0, h * .7, w, h * .3, '#8A5E3A', 1) + Array.from({ length: Math.round(w / 7) }, (_, i) => R(2 + i * 7, h * .7 - (10 + (hsh(i, 3) % 8)), 6, 10 + (hsh(i, 3) % 8), [PAL.red, PAL.navy, PAL.mustard, PAL.green, CREAM][i % 5], 1, 'stroke-width="1"')).join(''));
        case 'mirror': return g(`<ellipse cx="${w / 2}" cy="${h / 2}" rx="${w * .45}" ry="${h * .45}" fill="#D7EAF0"/><path d="M${w * .3},${h * .25} l${w * .2},${h * .3}" stroke="#fff" stroke-width="2" fill="none"/>`);
        case 'switch': return g(R(0, 0, w, h, CREAM, 1, 'stroke-width="1.2"') + R(w * .35, h * .25, w * .3, h * .5, '#D8D2C4', 1, 'stroke-width="1"'));
        case 'extinguisher': return g(R(w * .25, h * .15, w * .5, h * .8, PAL.red, 6) + R(w * .3, 0, w * .4, h * .2, INK, 2) + R(w * .3, h * .45, w * .4, h * .22, CREAM, 1, 'stroke-width="1"'));
        case 'ceil': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .22}" fill="#FFF6D8" stroke-width="2"/><circle cx="${w / 2}" cy="${h / 2}" r="${w * .1}" fill="${PAL.gold}" stroke="none"/>`);
        case 'stall': return g(R(0, h * .35, w, h * .65, '#B98552', 3) + R(4, h * .42, w - 8, h * .5, '#C9955F', 2) + Array.from({ length: 6 }, (_, i) => `<path d="M${i * w / 6},${h * .38} L${(i + 1) * w / 6},${h * .38} L${(i + .5) * w / 6},0Z" fill="${i % 2 ? CREAM : (p.c || PAL.red)}"/>`).join('') + `<path d="M0,${h * .38} H${w}" fill="none" stroke-width="2.4"/>` + goods(p.goods || 'fruit', w, h));
        case 'tower': return g(R(-w * .15, h * .25, w * 1.3, h * .75, '#E8D4AC', 2) + `<path d="M-${w * .2},${h * .25} L${w / 2},0 L${w * 1.2},${h * .25}Z" fill="${PAL.red}"/>` + [0, 1, 2].map(i => `<path d="M${w * (.02 + i * .34)},${h} V${h * .82} Q${w * (.14 + i * .34)},${h * .7} ${w * (.26 + i * .34)},${h * .82} V${h}Z" fill="#6B4A30"/>`).join('') +
          `<circle cx="${w / 2}" cy="${h * .46}" r="${w * .25}" fill="${CREAM}"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M${w / 2 + Math.cos(i * .52) * w * .2},${h * .46 + Math.sin(i * .52) * w * .2} L${w / 2 + Math.cos(i * .52) * w * .23},${h * .46 + Math.sin(i * .52) * w * .23}" stroke-width="1.2"/>`).join('') +
          `<path d="M${w / 2},${h * .46} V${h * .36} M${w / 2},${h * .46} L${w * .6},${h * .5}" fill="none" stroke-width="2.4"/><text x="${w / 2}" y="${h * .76}" font-size="7.5" text-anchor="middle" fill="${PAL.red}" stroke="none" font-weight="bold" font-family="serif">BẾN THÀNH</text>`);
        case 'car': return g(R(0, 0, w, h, p.c || PAL.navy, 14) + R(w * .2, 6, w * .22, h - 12, '#BFD8E2', 4) + R(w * .62, 6, w * .16, h - 12, '#BFD8E2', 4) + R(w * .44, 5, w * .16, h - 10, p.c || PAL.navy, 3) + `<path d="M${w * .24},10 l8,8" stroke="#fff" stroke-width="2" opacity=".6"/>` +
          [[.12, -2], [.82, -2], [.12, h - 4], [.82, h - 4]].map(([a, b]) => R(w * a, b, 12, 6, INK, 2)).join('') + `<circle cx="${w - 3}" cy="8" r="3" fill="#F6E7B8"/><circle cx="${w - 3}" cy="${h - 8}" r="3" fill="#F6E7B8"/>`);
        case 'lamp': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${w * .45}" fill="#F6D88A" opacity=".3" stroke="none"/><circle cx="${w / 2}" cy="${h / 2}" r="6" fill="#6E7A80"/><circle cx="${w / 2}" cy="${h / 2}" r="3" fill="#FFF6D8" stroke="none"/>`);
        case 'elephant': return g(`<ellipse cx="${w * .55}" cy="${h * .55}" rx="${w * .38}" ry="${h * .3}" fill="#9A949A"/>` + [[.3, .82], [.45, .86], [.68, .86], [.82, .8]].map(([a, b]) => R(w * a - 6, h * b - 6, 12, 14, '#8A848A', 4)).join('') +
          `<circle cx="${w * .18}" cy="${h * .42}" r="${h * .22}" fill="#9A949A"/><path d="M${w * .08},${h * .5} Q-2,${h * .8} ${w * .1},${h * .98}" fill="none" stroke="#9A949A" stroke-width="9"/><path d="M${w * .08},${h * .5} Q-2,${h * .8} ${w * .1},${h * .98}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 5"/>` +
          `<ellipse cx="${w * .27}" cy="${h * .38}" rx="${w * .09}" ry="${h * .16}" fill="#B5AEB4"/><circle cx="${w * .13}" cy="${h * .36}" r="2.5" fill="${INK}"/>` + R(w * .38, h * .22, w * .32, h * .24, PAL.red, 4) + `<path d="M${w * .4},${h * .34} h${w * .28}" stroke="${PAL.gold}" stroke-width="2.4"/><path d="M${w * .9},${h * .5} q8,6 4,16" fill="none" stroke="#9A949A" stroke-width="4"/>`);
        case 'fence': return `<g transform="translate(${x},${y})" ${SW(2.4)}>${Array.from({ length: Math.round(w / 10) }, (_, i) => `<rect x="${i * 10 + 2}" y="0" width="6" height="${h}" fill="${PAL.tan}"/>`).join('')}</g>`;
        case 'path': return `<g transform="translate(${x},${y})">${Array.from({ length: Math.round(w / 18) * Math.max(1, Math.round(h / 18)) }, (_, i) => `<ellipse cx="${(i % Math.round(w / 18)) * 18 + 9}" cy="${Math.floor(i / Math.round(w / 18)) * 18 + 9}" rx="7" ry="5" fill="#D8C9A6" stroke="${INK}" stroke-width="1.2"/>`).join('')}</g>`;
        case 'trap': return `<g transform="translate(${x},${y})"><rect width="${w}" height="${h}" rx="4" fill="none" stroke="${PAL.red}" stroke-width="2" stroke-dasharray="4 4"/></g>`;
        case 'body': return body(p, x, y, w, h);
        case 'chalk': return g(`<path d="M${w * .1},${h * .5} C${w * .1},${h * .1} ${w * .4},${h * .1} ${w * .5},${h * .2} L${w * .9},${h * .1} L${w * .95},${h * .5} L${w * .9},${h * .9} L${w * .5},${h * .8} C${w * .4},${h * .9} ${w * .1},${h * .9} ${w * .1},${h * .5}Z" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="3 4"/>`);
        case 'blood': return blood(x, y, w, h, p.seed || 1, p.dry);
        case 'steps': return `<g transform="translate(${x},${y})" fill="${PAL.red}" opacity=".75" stroke="none">${Array.from({ length: Math.round(w / 16) }, (_, i) => `<g transform="translate(${8 + i * 16},${h / 2 + (i % 2 ? 6 : -6)}) rotate(90)"><ellipse rx="5" ry="3.4" cx="-2"/><ellipse rx="2.6" ry="2.4" cx="5"/></g>`).join('')}</g>`;
        case 'clothespile': return prop({ ...p, k: 'clothes' });
        case 'dust': return `<g transform="translate(${x},${y})" fill="#FFFDF5" stroke="none" opacity=".95">${Array.from({ length: 16 }, (_, i) => `<circle cx="${(i * 37) % w}" cy="${(i * 23) % h}" r="${1.5 + i % 3}"/>`).join('')}</g>`;
        case 'broken': return g(`<path d="M4,${h * .6} l8,-6 l4,8z M${w * .5},${h * .3} l7,4 l-5,6z M${w * .7},${h * .7} l6,-3 l2,7z" fill="${PAL.sky}" stroke-width="1.2"/><path d="M${w * .3},${h * .8} q8,-6 14,0" fill="none" stroke="${PAL.green}" stroke-width="2"/>`);
        case 'item': return g(`<circle cx="${w / 2}" cy="${h / 2}" r="${Math.min(w, h) * .3}" fill="${p.c || PAL.mustard}"/><path d="M${w * .4},${h * .38} q3,-2 6,0" fill="none" stroke="#fff" stroke-width="1.4" opacity=".6"/>`);
        case 'tarp': return `<g transform="translate(${x},${y})" ${SW(2)}><path d="M0,0 H${w} L${w - 6},${h} H6Z" fill="${p.c || PAL.teal}" opacity=".55"/></g>`;
        default: return g(R(0, 0, w, h, PAL.tan));
      }
    }
  }
  // đồ nhỏ đặt trên bàn
  function item(kind, cx, cy) {
    const t = `transform="translate(${cx},${cy})"`;
    switch (kind) {
      case 'mug': return `<g ${t}><circle r="5" fill="${CREAM}" stroke-width="1.6"/><circle r="3" fill="#6B3A22" stroke="none"/><path d="M5,-1 q4,1 0,4" fill="none" stroke-width="1.4"/></g>`;
      case 'plate': return `<g ${t}><circle r="7" fill="#fff" stroke-width="1.4"/><circle r="3.5" fill="${PAL.mustard}" stroke="none"/></g>`;
      case 'book': return `<g ${t} transform-origin="0 0"><rect x="-7" y="-5" width="14" height="10" rx="1" fill="${PAL.navy}" stroke-width="1.4" transform="rotate(-10)"/></g>`;
      case 'teapot': return `<g ${t}><circle r="6" fill="${CREAM}" stroke-width="1.4"/><path d="M6,0 l5,-3" stroke-width="2"/><circle r="1.5" fill="${PAL.teal}" stroke="none"/></g>`;
      case 'wallet': return `<g ${t}><rect x="-7" y="-4.5" width="14" height="9" rx="2" fill="${PAL.brown}" stroke-width="1.4"/></g>`;
      case 'ledger': return `<g ${t}><rect x="-8" y="-6" width="16" height="12" rx="1" fill="${PAL.red}" stroke-width="1.4"/><path d="M0,-6 V6" stroke-width="1"/></g>`;
      case 'bell': return `<g ${t}><circle r="5" fill="${PAL.gold}" stroke-width="1.4"/><circle r="1.5" fill="${INK}" stroke="none"/></g>`;
      case 'phone2': return `<g ${t}><rect x="-7" y="-5" width="14" height="10" rx="3" fill="${INK}"/><rect x="-5" y="-3" width="10" height="3" rx="1" fill="#4A4650" stroke="none"/></g>`;
      case 'register': return `<g ${t}><rect x="-8" y="-6" width="16" height="12" rx="2" fill="#9AA2A8" stroke-width="1.4"/><rect x="-6" y="-4" width="12" height="4" fill="#3E5A44" stroke="none"/></g>`;
      case 'cups': return `<g ${t}><circle cx="-5" r="3" fill="#fff" stroke-width="1.2"/><circle cx="3" cy="-3" r="3" fill="#fff" stroke-width="1.2"/><circle cx="3" cy="4" r="3" fill="#fff" stroke-width="1.2"/></g>`;
      case 'globe': return `<g ${t}><circle r="6" fill="${PAL.sky}" stroke-width="1.4"/><path d="M-4,-2 q3,2 6,-1" fill="none" stroke="${PAL.green}" stroke-width="2"/></g>`;
      default: return '';
    }
  }
  function goods(type, w, h) {
    const y0 = h * .55;
    if (type === 'clothes') return Array.from({ length: 5 }, (_, i) => `<path d="M${w * (.12 + i * .18)},${y0 - 6} l-6,4 l3,5 l2,-1 v12 h10 v-12 l2,1 l3,-5 l-6,-4 q-4,3 -8,0z" fill="${[PAL.red, PAL.sky, PAL.mustard, PAL.green, CREAM][i]}" stroke-width="1.4"/>`).join('');
    if (type === 'food') return Array.from({ length: 4 }, (_, i) => `<rect x="${w * (.08 + i * .23)}" y="${y0 - 3}" width="${w * .16}" height="12" rx="3" fill="${['#C9A06A', PAL.red, '#E9D27A', '#8FB7C4'][i]}" stroke-width="1.4"/><path d="M${w * (.1 + i * .23)},${y0 + 2} h${w * .1}" stroke-width="1" fill="none"/>`).join('');
    if (type === 'bags') return Array.from({ length: 4 }, (_, i) => `<path d="M${w * (.1 + i * .22)},${y0 - 2} h${w * .15} l2,14 h-${w * .15 + 4}z" fill="${[PAL.navy, PAL.red, PAL.brown, PAL.teal][i]}" stroke-width="1.4"/><path d="M${w * (.13 + i * .22)},${y0 - 2} q${w * .05},-8 ${w * .1},0" fill="none" stroke-width="1.4"/>`).join('');
    if (type === 'flowers') return Array.from({ length: 6 }, (_, i) => `<circle cx="${w * (.1 + i * .16)}" cy="${y0 + (i % 2) * 6}" r="5" fill="${[PAL.red, '#fff', PAL.mustard, '#E9A6B0'][i % 4]}" stroke-width="1.2"/>`).join('');
    return Array.from({ length: 7 }, (_, i) => `<circle cx="${w * (.1 + i * .13)}" cy="${y0 + (i % 2) * 7}" r="5.5" fill="${[PAL.red, PAL.mustard, PAL.green, '#E9883A'][i % 4]}" stroke-width="1.2"/>`).join('');
  }
  function blood(x, y, w, h, seed, dry) {
    const pts = Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2, r = .72 + ((hsh(i, seed) % 100) / 100) * .32; return [w / 2 + Math.cos(a) * w / 2 * r, h / 2 + Math.sin(a) * h / 2 * r]; });
    const d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' Q') + 'Z';
    const path = pts.reduce((s, p, i) => { const n = pts[(i + 1) % pts.length]; return s + `${i ? '' : `M${((p[0] + n[0]) / 2).toFixed(1)},${((p[1] + n[1]) / 2).toFixed(1)}`} Q${p[0].toFixed(1)},${p[1].toFixed(1)} ${((p[0] + n[0]) / 2).toFixed(1)},${((p[1] + n[1]) / 2).toFixed(1)}`; }, '') + 'Z';
    return `<g transform="translate(${x},${y})" stroke="none"><path d="${path}" fill="${dry ? '#7A2A22' : '#9E2A22'}" opacity=".85"/><ellipse cx="${w * .45}" cy="${h * .5}" rx="${w * .25}" ry="${h * .22}" fill="#6E1A16" opacity=".55"/>` +
      `<ellipse cx="${w * .35}" cy="${h * .35}" rx="${w * .08}" ry="${h * .05}" fill="#fff" opacity=".25"/>` + Array.from({ length: 6 }, (_, i) => `<circle cx="${(w * ((hsh(i, seed + 9) % 140) / 100 - .2)).toFixed(1)}" cy="${(h * ((hsh(i + 5, seed) % 140) / 100 - .2)).toFixed(1)}" r="${1.5 + i % 3}" fill="#9E2A22"/>`).join('') + `</g>`;
  }
  // thi thể nhìn từ trên xuống, vẽ kiểu chibi nằm
  function body(p, x, y, w, h) {
    const c = p.c || PAL.teal, pants = p.pants || PAL.grey, hair = p.hair || INK, skin = SKIN;
    const blood_ = p.blood === false ? '' : blood(x - w * .05, y - h * .1, w * 1.05, h * 1.25, p.seed || 3);
    const hx = w * .13, hy = h * .5, hr = Math.min(h * .34, w * .16);
    // nét vẽ co giãn theo cỡ thi thể (bản đồ nhỏ, cận cảnh to)
    const k = Math.sqrt(h / 61), n = v => (v * k).toFixed(1);
    let s = `<g transform="translate(${x},${y})${p.rot ? ` rotate(${p.rot} ${w / 2} ${h / 2})` : ''}" ${S.replace('3.5', '2.4')}>`;
    // chân
    s += `<path d="M${w * .62},${h * .4} L${w * .9},${h * .22}" fill="none" stroke-width="${n(13)}"/><path d="M${w * .62},${h * .4} L${w * .9},${h * .22}" fill="none" stroke="${pants}" stroke-width="${n(8)}"/>`;
    s += `<path d="M${w * .62},${h * .6} L${w * .92},${h * .74}" fill="none" stroke-width="${n(13)}"/><path d="M${w * .62},${h * .6} L${w * .92},${h * .74}" fill="none" stroke="${pants}" stroke-width="${n(8)}"/>`;
    s += `<ellipse cx="${w * .94}" cy="${h * .2}" rx="${n(6)}" ry="${n(4.5)}" fill="${PAL.brown}" transform="rotate(-30 ${w * .94} ${h * .2})"/><ellipse cx="${w * .96}" cy="${h * .76}" rx="${n(6)}" ry="${n(4.5)}" fill="${PAL.brown}" transform="rotate(25 ${w * .96} ${h * .76})"/>`;
    // tay
    s += `<path d="M${w * .3},${h * .28} Q${w * .36},${h * .02} ${w * .46},${h * .02}" fill="none" stroke-width="${n(11)}"/><path d="M${w * .3},${h * .28} Q${w * .36},${h * .02} ${w * .46},${h * .02}" fill="none" stroke="${c}" stroke-width="${n(6)}"/><circle cx="${w * .48}" cy="${h * .02}" r="${n(4.5)}" fill="${skin}"/>`;
    s += `<path d="M${w * .3},${h * .72} Q${w * .4},${h * .96} ${w * .52},${h * .92}" fill="none" stroke-width="${n(11)}"/><path d="M${w * .3},${h * .72} Q${w * .4},${h * .96} ${w * .52},${h * .92}" fill="none" stroke="${c}" stroke-width="${n(6)}"/><circle cx="${w * .54}" cy="${h * .92}" r="${n(4.5)}" fill="${skin}"/>`;
    // thân
    s += `<path d="M${w * .22},${h * .26} Q${w * .45},${h * .18} ${w * .66},${h * .3} L${w * .68},${h * .7} Q${w * .45},${h * .82} ${w * .22},${h * .74} Z" fill="${c}"/>`;
    s += `<path d="M${w * .25},${h * .5} H${w * .64}" fill="none" stroke-width="1.2" opacity=".4"/><path d="M${w * .6},${h * .28} L${w * .62},${h * .72}" fill="none" stroke="${INK}" stroke-width="4" opacity=".55"/>`;
    // đầu
    s += `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="${skin}"/><path d="M${hx - hr},${hy} A${hr},${hr} 0 0 1 ${hx + hr * .2},${hy - hr * .98} Q${hx - hr * .2},${hy} ${hx + hr * .2},${hy + hr * .98} A${hr},${hr} 0 0 1 ${hx - hr},${hy}Z" fill="${hair}"/>`;
    if (p.dead !== false) s += `<path d="M${hx + hr * .25},${hy - hr * .45} l${hr * .25},${hr * .2} M${hx + hr * .5},${hy - hr * .45} l-${hr * .25},${hr * .2} M${hx + hr * .25},${hy + hr * .25} l${hr * .25},${hr * .2} M${hx + hr * .5},${hy + hr * .25} l-${hr * .25},${hr * .2}" fill="none" stroke-width="${n(1.6)}"/>`;
    else s += `<path d="M${hx + hr * .3},${hy - hr * .4} v${hr * .3} M${hx + hr * .3},${hy + hr * .15} v${hr * .3}" fill="none" stroke-width="1.6"/><path d="M${hx + hr * 1.2},${hy - hr * 1.2} h6 l-6,6 h6" fill="none" stroke-width="1.4" opacity=".6"/>`;
    if (p.knife) s += `<path d="M${w * .44},${h * .5} L${w * .5},${h * .1}" stroke="#D6DCE0" stroke-width="${n(4)}"/><path d="M${w * .44},${h * .5} L${w * .5},${h * .1}" stroke-width="1" fill="none"/><rect x="${w * .4}" y="${h * .44}" width="${n(9)}" height="${n(12)}" rx="2" fill="${PAL.brown}" transform="rotate(10 ${w * .44} ${h * .5})"/>`;
    s += `</g>`;
    const chalk = p.chalk ? `<g transform="translate(${x},${y})" fill="none" stroke="#fff" stroke-width="2.6" stroke-dasharray="5 4" opacity=".9"><path d="M${hx - hr - 6},${hy} A${hr + 6},${hr + 6} 0 0 1 ${w * .22},${h * .14} L${w * .46},-8 L${w * .56},${h * .06} L${w * .66},${h * .2} L${w},${h * .08} L${w + 6},${h * .3} L${w * .7},${h * .5} L${w + 8},${h * .78} L${w * .96},${h * .94} L${w * .62},${h * .8} L${w * .56},${h + 6} L${w * .4},${h} L${w * .22},${h * .86} A${hr + 6},${hr + 6} 0 0 1 ${hx - hr - 6},${hy}Z"/></g>` : '';
    return blood_ + `<ellipse cx="${x + w * .52}" cy="${y + h * .56}" rx="${w * .5}" ry="${h * .4}" fill="${INK}" opacity=".14" stroke="none"/>` + s + chalk;
  }

  /* ---------- Bản đồ ---------- */
  const THEME = {
    wood:   { floor: ['#DDBF8E', '#D6B784', '#E2C597'], line: '#B8956A', face: '#D9C7A4', face2: '#CDB892', top: '#6B4A30', trim: '#8A5E3A', dado: '#B98552' },
    tile:   { floor: ['#E6DFCB', '#DAD2BC'], line: '#C2B9A0', face: '#BCC8B6', face2: '#AEBBA8', top: '#4A5A52', trim: '#7A8A80', dado: '#93A596' },
    grass:  { floor: ['#B5C98A', '#AEC283', '#BBCF92'], line: '#9DB474', face: '#C98F6A', face2: '#B97F5C', top: '#6E5A4A', trim: '#8A7A5A', dado: '#A89C8A', brick: true },
    street: { floor: ['#CFC8B6', '#C8C0AC'], line: '#B0A893', face: '#D8C3A0', face2: '#CBB58F', top: '#5A4E46', trim: '#8A7A6A', dado: '#9AA2A8', shop: true },
    carpet: { floor: ['#C9806A', '#C47A64'], line: '#B36A56', face: '#D8C3A0', face2: '#CBB28C', top: '#6B3A2A', trim: '#8A4A3A', dado: '#9E5A4A' },
    dark:   { floor: ['#8C7C70', '#857568', '#93837A'], line: '#776A60', face: '#5E504C', face2: '#544642', top: '#2E2428', trim: '#4A3A3A', dado: '#3E3230' },
  };
  function mapSvg(m, opt = {}) {
    const rows = m.tiles, H = rows.length, W = rows[0].length, th = THEME[m.theme] || THEME.wood;
    const isW = (x, y) => y < 0 || y >= H || x < 0 || x >= W || rows[y][x] === '#' || rows[y][x] === 'X';
    let fl = '', walls = '', edges = '', bush = '', ao = '', deco = '';
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = rows[y][x], px = x * T, py = y * T, r = hsh(x, y);
      if (c === 'X') { walls += `<rect x="${px}" y="${py}" width="${T + .5}" height="${T + .5}" fill="${INK}" opacity=".85"/>`; continue; }
      if (c === '#') {
        const lowFace = !isW(x, y + 1), face = lowFace || (y < 2 && !isW(x, y + 2) && isW(x, y + 1) && rows[y + 1] && rows[y + 1][x] === '#');
        if (face) {
          walls += `<rect x="${px}" y="${py}" width="${T + .5}" height="${T + .5}" fill="${th.face}"/>`;
          if (th.brick) walls += [0, 1, 2, 3].map(i => `<path d="M${px},${py + i * 8} H${px + T} M${px + ((i % 2) ? 8 : 0) + 16},${py + i * 8} V${py + i * 8 + 8} M${px + ((i % 2) ? 8 : 0)},${py + i * 8} V${py + i * 8 + 8}" stroke="${th.face2}" stroke-width="1.2"/>`).join('');
          else if (m.theme === 'carpet') walls += `<path d="M${px + 8},${py + 4} l8,8 l-8,8 l-8,-8z M${px + 24},${py + 4} l8,8 l-8,8 l-8,-8z" fill="none" stroke="${th.face2}" stroke-width="1.4"/>`;
          else if (m.theme === 'dark') walls += (r % 4 === 0 ? `<path d="M${px + 6},${py + 4} l6,9 l-3,7 l5,8" fill="none" stroke="${INK}" stroke-width="1" opacity=".5"/>` : '') + (r % 5 === 1 ? `<path d="M${px + 10},${py + 6} q8,-3 12,4 q-4,8 -12,2z" fill="${th.face2}"/>` : '');
          else if (m.theme === 'street') walls += (r % 3 === 0 ? `<path d="M${px + 4},${py + 6} q6,6 2,14" fill="none" stroke="${th.face2}" stroke-width="2" opacity=".7"/>` : '');
          else walls += `<path d="M${px + 8},${py} V${py + T} M${px + 24},${py} V${py + T}" stroke="${th.face2}" stroke-width="1.6"/>` + (m.theme === 'wood' && r % 2 ? `<circle cx="${px + 16}" cy="${py + 12}" r="1.6" fill="${th.face2}"/>` : '');
          if (lowFace) {
            if (th.shop && x % 3 === 1) walls += prop({ k: 'shutter', x: x - .02, y: y + .25, w: 1.04, h: .75 });
            else walls += `<rect x="${px}" y="${py + T * .55}" width="${T + .5}" height="${T * .45}" fill="${th.dado}"/><path d="M${px + 8},${py + T * .58} V${py + T} M${px + 24},${py + T * .58} V${py + T}" stroke="${INK}" stroke-width="1" opacity=".3"/><path d="M${px},${py + T * .55} H${px + T}" stroke="${INK}" stroke-width="1.6"/>`;
            walls += `<rect x="${px}" y="${py + T - 5}" width="${T + .5}" height="5" fill="${th.trim}"/>`;
          }
        } else {
          walls += `<rect x="${px}" y="${py}" width="${T + .5}" height="${T + .5}" fill="${th.top}"/><path d="M${px},${py + 10} l10,-10 M${px},${py + 26} l26,-26 M${px + 12},${py + T} l20,-20" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>`;
        }
        continue;
      }
      // sàn
      let base = th.floor[r % th.floor.length];
      if (c === ',') base = m.alt || th.line;
      if (m.theme === 'tile' && c !== ',') base = th.floor[(x + y) % 2];
      fl += `<rect x="${px}" y="${py}" width="${T + .5}" height="${T + .5}" fill="${base}"/>`;
      if (m.theme === 'wood' || m.theme === 'dark') {
        fl += `<path d="M${px},${py + (x % 2 ? 0 : 16)} H${px + T} M${px},${py + (x % 2 ? 16 : 0) + 16} H${px + T}" stroke="${th.line}" stroke-width="1.4"/>` +
          ((x + y) % 3 === 0 ? `<path d="M${px + 16},${py + (x % 2 ? 0 : 16)} v16" stroke="${th.line}" stroke-width="1.2"/>` : '') +
          `<path d="M${px + 3},${py + 7 + r % 6} q8,-2 16,0 t12,0" fill="none" stroke="${th.line}" stroke-width=".8" opacity=".5"/>` +
          (r % 11 === 0 ? `<ellipse cx="${px + 10 + r % 12}" cy="${py + 22}" rx="2.4" ry="1.6" fill="${th.line}"/>` : '') +
          (m.theme === 'dark' && r % 7 === 0 ? `<ellipse cx="${px + 16}" cy="${py + 16}" rx="${8 + r % 6}" ry="${5 + r % 4}" fill="${INK}" opacity=".18"/>` : '');
      } else if (m.theme === 'tile' || (m.theme === 'street' && c === '.')) {
        fl += `<rect x="${px + 1}" y="${py + 1}" width="${T - 2}" height="${T - 2}" rx="1.5" fill="none" stroke="${th.line}" stroke-width="1.2"/>` + (m.theme === 'street' ? `<path d="M${px},${py + 16} H${px + T} M${px + 16},${py} V${py + 16}" stroke="${th.line}" stroke-width="1"/>` : '') +
          (r % 13 === 0 ? `<path d="M${px + 6},${py + 8} l7,6 l-2,7 l8,5" fill="none" stroke="${INK}" stroke-width=".9" opacity=".35"/>` : '');
      } else if (m.theme === 'carpet') {
        fl += `<path d="M${px + 16},${py + 2} L${px + 30},${py + 16} L${px + 16},${py + 30} L${px + 2},${py + 16}Z" fill="none" stroke="${th.line}" stroke-width="1.2" opacity=".7"/><circle cx="${px + 16}" cy="${py + 16}" r="1.8" fill="${PAL.mustard}" opacity=".6"/>`;
      } else if (m.theme === 'grass') {
        if (r % 3 === 0) fl += `<path d="M${px + 8 + r % 10},${py + 22} l2,-6 l2,6 M${px + 18},${py + 12 + r % 8} l2,-5 l2,5" stroke="#7E9A5E" stroke-width="1.4" fill="none"/>`;
        if (r % 17 === 0) fl += `<circle cx="${px + 10 + r % 14}" cy="${py + 10 + r % 12}" r="2.2" fill="${['#fff', '#F2D35A', '#E9A6B0'][r % 3]}"/>`;
        if (r % 23 === 0) fl += `<ellipse cx="${px + 16}" cy="${py + 16}" rx="12" ry="7" fill="#9DB474" opacity=".6"/>`;
      } else if (m.theme === 'street' && c === ',') {
        fl += Array.from({ length: 3 }, (_, i) => `<circle cx="${px + (hsh(x + i, y) % 30)}" cy="${py + (hsh(x, y + i) % 30)}" r=".9" fill="#6E665A"/>`).join('') + (r % 19 === 0 ? `<path d="M${px + 4},${py + 20} l8,-4 l6,5 l10,-3" fill="none" stroke="#6E665A" stroke-width="1"/>` : '');
      }
      if (c === 'H') bush += prop({ k: 'bush', x: x - .05, y: y - .15, w: 1.1, h: 1.1 });
      if (c === 'D') fl += `<rect x="${px + 2}" y="${py + 4}" width="${T - 4}" height="${T - 8}" rx="3" fill="${PAL.brown}" opacity=".6"/><path d="M${px + 6},${py + 8} h${T - 12} M${px + 6},${py + T - 8} h${T - 12}" stroke="${CREAM}" stroke-width="1" opacity=".4"/>`;
      // bóng tối sát tường (ambient occlusion)
      if (isW(x, y - 1)) ao += `<rect x="${px}" y="${py}" width="${T + .5}" height="10" fill="url(#aoT)"/>`;
      if (isW(x - 1, y)) ao += `<rect x="${px}" y="${py}" width="7" height="${T + .5}" fill="url(#aoL)"/>`;
      if (isW(x + 1, y)) ao += `<rect x="${px + T - 7}" y="${py}" width="7.5" height="${T + .5}" fill="url(#aoR)"/>`;
      [[0, -1, `M${px},${py} H${px + T}`], [0, 1, `M${px},${py + T} H${px + T}`], [-1, 0, `M${px},${py} V${py + T}`], [1, 0, `M${px + T},${py} V${py + T}`]].forEach(([dx, dy, d]) => { if (isW(x + dx, y + dy)) edges += d + ' '; });
    }
    const props = (m.props || []).concat(opt.extraProps || []).filter(p => !p.hidden);
    const order = p => (FLAT.has(p.k) ? 0 : 1);
    const propsSvg = props.slice().sort((a, b) => order(a) - order(b) || (a.y + (a.h || 1)) - (b.y + (b.h || 1))).map(p => prop({ ...p, night: opt.night })).join('');
    // vệt nắng qua cửa sổ (ban ngày)
    let sun = '';
    if (!opt.night && !opt.dark && !m.noSun) props.filter(p => p.k === 'window' && p.y < 1.5).forEach(p => {
      const x0 = p.x * T, y0 = (p.y + p.h) * T + 4, w0 = (p.w || 1) * T;
      sun += `<path d="M${x0},${y0} H${x0 + w0} L${x0 + w0 + 40},${y0 + 110} H${x0 + 40}Z" fill="#FFF3C4" opacity=".28"/>`;
    });
    const wire = props.filter(p => p.k === 'wire').map(p => prop(p)).join('');
    const sa = opt.standalone ? ` xmlns="http://www.w3.org/2000/svg" width="${W * T}" height="${H * T}"` : '';
    const inkDef = opt.standalone ? `<filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".03" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>` : '';
    return `<svg${sa} viewBox="0 0 ${W * T} ${H * T}" class="mapsvg" preserveAspectRatio="none"><defs>${inkDef}
      <linearGradient id="aoT" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${INK}" stop-opacity=".28"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>
      <linearGradient id="aoL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${INK}" stop-opacity=".18"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient>
      <linearGradient id="aoR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="${INK}" stop-opacity=".18"/><stop offset="1" stop-color="${INK}" stop-opacity="0"/></linearGradient></defs>
      <g filter="url(#ink)">${fl}</g>${ao}${sun}<g filter="url(#ink)">${walls}<path d="${edges}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>${propsSvg}${bush}</g>${wire}</svg>`;
  }
  /* các điểm sáng của bản đồ (đèn, nến…) — dùng cho lớp bóng tối ban đêm */
  function mapLights(m, extra = []) {
    const L = [];
    (m.props || []).concat(extra).forEach(p => {
      const cx = p.x + (p.w || 1) / 2, cy = p.y + (p.h || 1) / 2;
      if (p.k === 'lamp') L.push([cx, cy, 3.6]);
      if (p.k === 'ceil') L.push([cx, cy, 4.2]);
      if (p.k === 'lampfloor') L.push([cx, cy, 2.6]);
      if (p.k === 'candelabra' || p.k === 'altar') L.push([cx, cy, 2.8]);
      if (p.k === 'tv') L.push([cx, cy + 1, 2.4]);
      if (p.k === 'window' && p.c) L.push([cx, cy + 1, 2.4]);
    });
    return L.concat(m.lights || []);
  }

  /* ---------- Phông đặc biệt (không phải bản đồ) ---------- */
  function special(key) {
    const w = (inner, bg) => `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" class="special"><rect width="1600" height="900" fill="${bg}"/><g filter="url(#ink)" stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none">${inner}</g></svg>`;
    const scrib = (n, col, op) => Array.from({ length: n }, (_, i) => `<path d="M${(i * 397) % 1600},${(i * 211) % 900} q${20 + i % 30},${-10 - i % 20} ${40 + i % 40},0" stroke="${col}" opacity="${op}"/>`).join('');
    if (key === 'white') return w(scrib(30, INK, .08), '#F6F1E4');
    if (key === 'black') return w(scrib(30, PAPER, .06), '#1E1714');
    if (key === 'void') return w(scrib(60, PAPER, .12) + `<circle cx="800" cy="450" r="320" stroke="${PAPER}" opacity=".08" stroke-width="40"/>`, '#2A211C');
    if (key === 'collapse') return w(`<g class="spin">${Array.from({ length: 16 }, (_, i) => `<ellipse cx="800" cy="450" rx="${80 + i * 48}" ry="${30 + i * 19}" stroke="${i % 2 ? PAL.purple : PAL.red}" stroke-width="${6 - i * .25}" opacity="${.8 - i * .04}" transform="rotate(${i * 13} 800 450)"/>`).join('')}</g><circle cx="800" cy="450" r="70" fill="${INK}"/>`, '#1E1714');
    if (key === 'cage') return w(`<rect x="600" y="160" width="400" height="460" fill="#BFD8E2" fill-opacity=".15" stroke="${PAPER}" opacity=".7"/>${[1, 2, 3, 4].map(i => `<path d="M${600 + i * 80},160 V620" stroke="${PAPER}" opacity=".4"/>`).join('')}` +
      [0, 1, 2, 3, 4, 5].map(i => `<g transform="translate(${180 + i * 250 - (i > 2 ? -60 : 60)},770)" fill="${INK}" stroke="${PAPER}" stroke-width="3"><ellipse cx="0" cy="-50" rx="26" ry="24"/><path d="M-40,30 Q-38,-22 0,-24 Q38,-22 40,30Z"/></g>`).join(''), '#2A211C');
    if (key === 'car') return w(`<rect x="0" y="560" width="1600" height="340" fill="#4A4650" stroke="none"/><path d="M0,720 H1600" stroke="${PAL.gold}" stroke-dasharray="80 60" stroke-width="10"/>` +
      Array.from({ length: 10 }, (_, i) => `<circle class="carlight" style="animation-delay:${i * .4}s" cx="${(i * 233) % 1600}" cy="${300 + (i * 47) % 140}" r="${10 + i % 4 * 4}" fill="${i % 2 ? PAL.gold : PAL.red}" opacity=".7" stroke="none"/>`).join('') +
      `<path d="M300,900 Q300,700 560,660 H1040 Q1300,700 1300,900Z" fill="${PAL.navy}"/><path d="M420,900 Q440,760 600,740 H1000 Q1160,760 1180,900" fill="#2E3550"/><circle cx="560" cy="860" r="110" stroke-width="22"/>`, '#3A4766');
    return w('', PAPER);
  }
  return { chibi, prop, mapSvg, mapLights, special, T, emote, EMOS };
})();
