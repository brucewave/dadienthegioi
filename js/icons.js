'use strict';
/* ==========================================================
   ICONS — biểu tượng vẽ tay (viewBox 64×64) cho vật phẩm,
   manh mối và nút giao diện
   ========================================================== */
const ICON = (() => {
  const I = '#2B1F1A', C = '#F3EEDF', R = '#B84A3E', M = '#D9A93A', T = '#4E8C84', G = '#4C9A6A', S = '#8FB7C4', B = '#7A5236', W = '#A8743E', P = '#7E62A8', GR = '#4A4650';
  const D = {
    // ---- vật phẩm / manh mối ----
    wallet: `<rect x="10" y="18" width="44" height="30" rx="5" fill="${B}"/><path d="M10,26 H54" fill="none"/><rect x="38" y="30" width="16" height="10" rx="3" fill="${W}"/><circle cx="44" cy="35" r="2" fill="${M}"/>`,
    watch: `<path d="M32,8 v6" fill="none"/><circle cx="32" cy="6" r="3" fill="${M}"/><circle cx="32" cy="36" r="20" fill="${M}"/><circle cx="32" cy="36" r="15" fill="${C}"/><path d="M32,36 V26 M32,36 l8,4" fill="none"/><path d="M32,23 v2 M32,47 v2 M19,36 h2 M43,36 h2" fill="none" stroke-width="2"/>`,
    key: `<circle cx="20" cy="24" r="11" fill="${M}"/><circle cx="20" cy="24" r="4" fill="${C}"/><path d="M28,32 L52,56 M42,46 l6,-6 M48,52 l5,-5" fill="none" stroke-width="5"/><path d="M28,32 L52,56" fill="none" stroke="${M}" stroke-width="2"/>`,
    knife: `<path d="M12,52 L40,24 Q50,14 56,8 Q54,20 44,30 L20,54Z" fill="#D6DCE0"/><path d="M40,24 L44,30" fill="none"/><rect x="5" y="46" width="16" height="9" rx="3" fill="${B}" transform="rotate(-45 13 50)"/><path d="M44,16 L50,12" fill="none" stroke="#fff" stroke-width="2"/>`,
    phone: `<rect x="18" y="6" width="28" height="52" rx="5" fill="${GR}"/><rect x="22" y="12" width="20" height="36" rx="2" fill="${S}"/><path d="M25,20 h14 M25,26 h10 M25,32 h12" fill="none" stroke-width="2"/><circle cx="32" cy="53" r="2" fill="${C}"/>`,
    thread: `<path d="M8,40 C16,10 30,54 38,26 S56,22 56,40" fill="none" stroke="${R}" stroke-width="5"/><path d="M8,40 C16,10 30,54 38,26 S56,22 56,40" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/><path d="M52,44 l6,6 M50,48 l4,6" fill="none" stroke="${R}" stroke-width="2.5"/>`,
    bottle: `<rect x="24" y="6" width="16" height="9" rx="2" fill="${C}"/><path d="M22,15 H42 L46,24 V54 Q46,58 42,58 H22 Q18,58 18,54 V24 Z" fill="#8A4A2A"/><rect x="22" y="30" width="20" height="16" rx="2" fill="${C}"/><path d="M28,38 h8 M32,34 v8" fill="none" stroke="${R}" stroke-width="3"/>`,
    blood: `<path d="M32,6 Q48,30 48,40 A16,16 0 0 1 16,40 Q16,30 32,6Z" fill="${R}"/><path d="M24,40 q0,6 6,8" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3"/>`,
    lock: `<path d="M20,28 V20 a12,12 0 0 1 24,0 V28" fill="none" stroke-width="5"/><rect x="12" y="28" width="40" height="28" rx="5" fill="${M}"/><circle cx="32" cy="40" r="4" fill="${I}"/><path d="M32,42 v8" fill="none" stroke-width="3.5"/>`,
    window: `<rect x="8" y="8" width="48" height="48" rx="3" fill="${S}"/><path d="M20,8 V56 M32,8 V56 M44,8 V56" fill="none" stroke-width="3.5"/><path d="M12,14 l10,10" fill="none" stroke="#fff" stroke-width="2.5"/>`,
    feather: `<path d="M50,8 C24,12 12,32 14,52 C30,50 48,34 50,8Z" fill="${GR}"/><path d="M48,10 L10,58" fill="none" stroke-width="2.5"/><path d="M38,20 l-8,0 M32,28 l-8,0 M26,36 l-6,0" fill="none" stroke="${C}" stroke-width="1.8"/>`,
    case: `<rect x="8" y="14" width="48" height="40" rx="3" fill="${W}"/><rect x="13" y="19" width="38" height="28" rx="2" fill="#D7EAF0"/><path d="M18,24 l8,14 M30,22 l4,7" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="32" cy="34" r="6" fill="none" stroke="${M}" stroke-dasharray="3 3" stroke-width="2"/>`,
    medal: `<path d="M20,6 L32,26 L44,6" fill="${R}"/><circle cx="32" cy="40" r="16" fill="#C9CED6"/><path d="M32,30 l3,7 h7 l-6,4 l2,7 l-6,-4 l-6,4 l2,-7 l-6,-4 h7z" fill="${M}" stroke-width="2"/>`,
    files: `<path d="M10,14 H28 L32,20 H54 V54 H10Z" fill="${M}"/><rect x="14" y="24" width="36" height="26" rx="2" fill="${C}"/><path d="M19,32 h24 M19,38 h20 M19,44 h14" fill="none" stroke-width="2"/><circle cx="44" cy="44" r="4" fill="${R}" stroke-width="2"/>`,
    clothes: `<path d="M20,8 L10,16 L16,28 L20,24 V56 H44 V24 L48,28 L54,16 L44,8 Q32,16 20,8Z" fill="${S}"/><path d="M26,30 q6,10 14,2" fill="none" stroke="${G}" stroke-width="3"/><path d="M22,48 q10,-4 20,0" fill="none" stroke="${B}" stroke-width="2.5"/>`,
    footprint: `<path d="M18,10 q10,0 10,12 q0,10 -6,16 q-8,2 -10,-8 q-2,-20 6,-20z" fill="${R}" opacity=".85"/><ellipse cx="20" cy="48" rx="6" ry="7" fill="${R}" opacity=".85"/><path d="M42,20 q10,0 10,12 q0,10 -6,16 q-8,2 -10,-8 q-2,-20 6,-20z" fill="${R}" opacity=".85"/><ellipse cx="44" cy="58" rx="5" ry="4" fill="${R}" opacity=".85"/>`,
    dust: `<path d="M8,48 q12,-14 24,0 q12,-14 24,0 Z" fill="#FFFDF5"/><circle cx="18" cy="24" r="3" fill="#FFFDF5"/><circle cx="34" cy="16" r="4" fill="#FFFDF5"/><circle cx="46" cy="28" r="3" fill="#FFFDF5"/><circle cx="26" cy="34" r="2.5" fill="#FFFDF5"/>`,
    leaf: `<path d="M10,54 C10,24 30,10 54,10 C54,36 38,54 10,54Z" fill="${G}"/><path d="M10,54 L44,20 M24,40 h10 M32,32 v-8" fill="none" stroke-width="2.4"/><circle cx="46" cy="50" r="5" fill="${B}"/>`,
    hand: `<path d="M18,56 V30 Q18,26 22,26 V12 Q22,8 26,8 Q30,8 30,12 V24 V8 Q30,4 34,4 Q38,4 38,8 V24 V12 Q38,8 42,8 Q46,8 46,12 V36 Q46,52 34,56Z" fill="#EBCDAA"/><path d="M24,46 q8,4 14,0" fill="none" stroke="${R}" stroke-width="3"/><path d="M22,30 q5,-2 8,2" fill="none" stroke-width="2"/>`,
    speech: `<path d="M8,10 H56 Q58,10 58,14 V40 Q58,44 54,44 H28 L16,56 L18,44 H10 Q6,44 6,40 V14 Q6,10 10,10Z" fill="${C}"/><path d="M16,22 h30 M16,30 h22" fill="none" stroke-width="3"/>`,
    ear: `<path d="M22,40 Q12,10 34,8 Q54,8 50,30 Q46,40 38,44 Q34,58 24,54" fill="#EBCDAA"/><path d="M30,24 q8,-6 12,2 q2,8 -8,10" fill="none" stroke-width="3"/><path d="M52,14 q6,6 0,14 M56,8 q10,12 0,26" fill="none" stroke="${T}" stroke-width="3"/>`,
    photo: `<rect x="8" y="12" width="48" height="40" rx="3" fill="${C}" transform="rotate(-6 32 32)"/><rect x="14" y="18" width="36" height="24" fill="${S}" transform="rotate(-6 32 32)"/><circle cx="26" cy="30" r="5" fill="#EBCDAA"/><circle cx="38" cy="28" r="5" fill="#EBCDAA"/><path d="M20,42 q6,-8 12,0 M32,40 q6,-8 12,0" fill="${GR}"/><path d="M12,8 L52,56" fill="none" stroke="${R}" stroke-width="3"/>`,
    car: `<rect x="6" y="24" width="52" height="20" rx="8" fill="${T}"/><path d="M16,24 L22,12 H42 L50,24" fill="${S}"/><circle cx="18" cy="46" r="7" fill="${I}"/><circle cx="46" cy="46" r="7" fill="${I}"/><circle cx="18" cy="46" r="2.5" fill="${C}"/><circle cx="46" cy="46" r="2.5" fill="${C}"/>`,
    bandage: `<rect x="6" y="22" width="52" height="20" rx="10" fill="#F2D8B8" transform="rotate(-25 32 32)"/><rect x="24" y="24" width="16" height="16" rx="3" fill="${C}" transform="rotate(-25 32 32)"/><circle cx="29" cy="30" r="1.5" fill="${I}"/><circle cx="35" cy="34" r="1.5" fill="${I}"/><path d="M40,14 q4,4 8,0" fill="none" stroke="${R}" stroke-width="3"/>`,
    globe: `<circle cx="32" cy="32" r="24" fill="${S}"/><path d="M14,24 q10,4 14,-4 q6,8 14,2 M18,44 q8,-6 16,2 q6,4 12,-4" fill="none" stroke="${G}" stroke-width="4"/><circle cx="32" cy="32" r="24" fill="none" stroke="${P}" stroke-width="3" stroke-dasharray="6 4"/><circle cx="38" cy="30" r="5" fill="${P}"/>`,
    mirror: `<ellipse cx="32" cy="26" rx="18" ry="22" fill="${W}"/><ellipse cx="32" cy="26" rx="13" ry="17" fill="#D7EAF0"/><path d="M28,48 L26,60 H38 L36,48" fill="${W}"/><path d="M22,16 q10,10 4,24 M36,14 l-4,26" fill="none" stroke="${P}" stroke-width="2.5"/>`,
    bone: `<path d="M16,20 L30,34 M34,30 L48,44" fill="none" stroke-width="9"/><path d="M16,20 L30,34 M34,30 L48,44" fill="none" stroke="${C}" stroke-width="4"/><circle cx="12" cy="18" r="5" fill="${C}"/><circle cx="18" cy="12" r="5" fill="${C}"/><circle cx="52" cy="46" r="5" fill="${C}"/><circle cx="46" cy="52" r="5" fill="${C}"/><path d="M28,28 l4,2 l-2,4 l4,2" fill="none" stroke="${R}" stroke-width="2.5"/>`,
    drawer: `<rect x="8" y="10" width="48" height="46" rx="3" fill="${W}"/><rect x="12" y="14" width="40" height="11" rx="2" fill="#B98552"/><rect x="6" y="30" width="44" height="12" rx="2" fill="#B98552" transform="rotate(-4 28 36)"/><rect x="12" y="44" width="40" height="9" rx="2" fill="#B98552"/><path d="M14,30 q6,-8 12,-2 q6,-6 12,0" fill="${S}"/>`,
    question: `<circle cx="32" cy="32" r="24" fill="${M}"/><path d="M24,24 q8,-12 16,0 q2,8 -8,12 v4" fill="none" stroke-width="5"/><circle cx="32" cy="48" r="3.5" fill="${I}"/>`,
    cat: `<path d="M14,30 L16,8 L28,20 Z M50,30 L48,8 L36,20Z" fill="${P}"/><ellipse cx="32" cy="34" rx="22" ry="20" fill="${P}"/><ellipse cx="24" cy="32" rx="4" ry="5" fill="#F2D35A"/><ellipse cx="40" cy="32" rx="4" ry="5" fill="#F2D35A"/><path d="M29,42 l3,2 l3,-2" fill="none" stroke-width="2"/>`,
    // ---- giao diện ----
    notebook: `<rect x="12" y="6" width="40" height="52" rx="4" fill="${R}"/><rect x="18" y="12" width="30" height="40" rx="2" fill="${C}"/><path d="M24,22 h18 M24,30 h14 M24,38 h16" fill="none" stroke-width="2.5"/><path d="M12,14 h-4 M12,24 h-4 M12,34 h-4 M12,44 h-4" fill="none" stroke-width="3"/><circle cx="42" cy="44" r="7" fill="none" stroke-width="3"/><path d="M47,49 l5,5" fill="none" stroke-width="4"/>`,
    scroll: `<path d="M14,10 H46 Q52,10 52,16 V50 Q52,56 46,56 H18" fill="${C}"/><path d="M14,10 Q8,10 8,16 Q8,22 14,22 H20 V16 Q20,10 14,10Z" fill="${M}"/><path d="M18,56 Q12,56 12,50 V22" fill="none"/><path d="M26,24 h18 M26,32 h18 M26,40 h12" fill="none" stroke-width="2.5"/>`,
    ff: `<path d="M8,14 L30,32 L8,50Z M32,14 L54,32 L32,50Z" fill="${M}"/>`,
    gear: `<path d="M28,4 h8 l2,8 l7,3 l7,-4 l6,6 l-4,7 l3,7 l8,2 v8 l-8,2 l-3,7 l4,7 l-6,6 l-7,-4 l-7,3 l-2,8 h-8 l-2,-8 l-7,-3 l-7,4 l-6,-6 l4,-7 l-3,-7 l-8,-2 v-8 l8,-2 l3,-7 l-4,-7 l6,-6 l7,4 l7,-3z" fill="${S}"/><circle cx="32" cy="32" r="9" fill="${C}"/>`,
    magnifier: `<circle cx="26" cy="26" r="16" fill="#D7EAF0"/><path d="M20,18 q4,-4 10,-2" fill="none" stroke="#fff" stroke-width="3"/><path d="M38,38 L56,56" fill="none" stroke-width="9"/><path d="M38,38 L56,56" fill="none" stroke="${B}" stroke-width="4"/>`,
    check: `<path d="M10,34 L26,50 L54,14" fill="none" stroke="${G}" stroke-width="8"/>`,
    cross: `<path d="M14,14 L50,50 M50,14 L14,50" fill="none" stroke="${R}" stroke-width="8"/>`,
    heart: `<path d="M32,56 C6,38 6,12 22,12 Q30,12 32,22 Q34,12 42,12 C58,12 58,38 32,56Z" fill="${R}"/><path d="M18,24 q2,-6 8,-6" fill="none" stroke="#fff" stroke-width="3"/>`,
    heartEmpty: `<path d="M32,56 C6,38 6,12 22,12 Q30,12 32,22 Q34,12 42,12 C58,12 58,38 32,56Z" fill="#D8CFBF"/>`,
    brain: `<path d="M30,10 Q14,8 12,22 Q4,28 10,38 Q8,52 24,52 Q28,58 32,54 V10Z" fill="#E9A6B0"/><path d="M34,10 Q50,8 52,22 Q60,28 54,38 Q56,52 40,52 Q36,58 32,54 V10Z" fill="#E9A6B0"/><path d="M18,24 q6,2 8,8 M16,40 q8,-2 10,4 M46,24 q-6,2 -8,8 M48,40 q-8,-2 -10,4" fill="none" stroke-width="2.4"/>`,
    tape: `<path d="M4,22 L60,10 L60,26 L4,38Z" fill="${M}"/><path d="M14,20 l6,14 M28,17 l6,14 M42,14 l6,14" fill="none" stroke="${I}" stroke-width="4"/><path d="M8,44 v14 M56,32 v26" fill="none" stroke-width="4"/>`,
    gloves: `<path d="M16,58 V34 Q14,30 16,26 V14 Q16,10 20,10 Q24,10 24,14 V8 Q24,4 28,4 Q32,4 32,8 V14 Q32,10 36,10 Q40,10 40,14 V30 L48,24 Q52,22 54,26 L42,46 V58Z" fill="${S}"/><path d="M16,50 H42" fill="none" stroke-width="3"/>`,
    chalk: `<rect x="10" y="22" width="40" height="14" rx="4" fill="#fff" transform="rotate(-35 30 29)"/><path d="M8,56 q14,-8 28,2 q10,6 22,-4" fill="none" stroke="#fff" stroke-width="5"/><path d="M8,56 q14,-8 28,2 q10,6 22,-4" fill="none" stroke-width="1.5" stroke-dasharray="2 4"/>`,
    bag: `<path d="M12,14 H52 V54 Q52,58 48,58 H16 Q12,58 12,54Z" fill="#D9E6EF" fill-opacity=".9"/><path d="M12,14 H52 V22 H12Z" fill="${R}"/><path d="M20,32 h24 M20,40 h18" fill="none" stroke-width="2.4"/><path d="M38,44 L50,30" fill="none" stroke="#9AA2A8" stroke-width="4"/>`,
    fist: `<path d="M14,30 Q14,20 22,20 H44 Q52,20 52,28 V42 Q52,54 40,54 H24 Q14,54 14,44Z" fill="#EBCDAA"/><path d="M24,20 V34 M34,20 V34 M44,22 V34" fill="none" stroke-width="2.4"/><path d="M14,36 Q26,34 30,42" fill="none" stroke-width="2.4"/><path d="M4,12 l8,6 M10,4 l4,10 M58,12 l-6,6" fill="none" stroke="${R}" stroke-width="3"/>`,
    star: `<path d="M32,6 l7,16 l17,2 l-13,11 l4,17 l-15,-9 l-15,9 l4,-17 l-13,-11 l17,-2z" fill="${M}"/>`,
    arrowL: `<path d="M40,12 L18,32 L40,52" fill="none" stroke-width="8"/>`,
    arrowR: `<path d="M24,12 L46,32 L24,52" fill="none" stroke-width="8"/>`,
    arrowU: `<path d="M12,40 L32,18 L52,40" fill="none" stroke-width="8"/>`,
    arrowD: `<path d="M12,24 L32,46 L52,24" fill="none" stroke-width="8"/>`,
    pause: `<path d="M24,16 V48 M40,16 V48" fill="none" stroke-width="8"/>`,
    home: `<path d="M8,32 L32,10 L56,32" fill="none" stroke-width="5"/><path d="M16,28 V54 H48 V28" fill="${C}"/><rect x="27" y="38" width="10" height="16" fill="${W}"/>`,
    play: `<path d="M18,10 L52,32 L18,54Z" fill="${M}"/>`,
    sound: `<path d="M8,24 H18 L32,12 V52 L18,40 H8Z" fill="${M}"/><path d="M40,22 q6,10 0,20 M46,16 q12,16 0,32" fill="none" stroke-width="4"/>`,
    mute: `<path d="M8,24 H18 L32,12 V52 L18,40 H8Z" fill="#D8CFBF"/><path d="M40,24 L56,40 M56,24 L40,40" fill="none" stroke="${R}" stroke-width="5"/>`,
    note: `<path d="M24,48 V12 L50,6 V40" fill="none" stroke-width="4"/><ellipse cx="18" cy="48" rx="8" ry="6" fill="${R}"/><ellipse cx="44" cy="42" rx="8" ry="6" fill="${R}"/><path d="M24,20 L50,14" fill="none" stroke-width="4"/>`,
    retry: `<path d="M48,22 A20,20 0 1 0 52,38" fill="none" stroke-width="6"/><path d="M40,20 H52 V8" fill="none" stroke-width="6"/>`,
  };
  const ID = {
    door: 'lock', coat: 'wallet', bed: 'watch', win: 'window', window: 'window', knife: 'knife', phone: 'phone', blood: 'blood', feather: 'feather', case: 'case',
    seats: 'question', drawer: 'drawer', clothes: 'clothes', hair: 'leaf', missing: 'files', cuong: 'files', khanh: 'files', steps: 'footprint', wound: 'knife',
    memo: 'speech', rack: 'key', body: 'question', nha: 'hand', tu: 'bandage',
  };
  const CLUE = {
    c1_ngu: 'speech', c1_chia: 'key', c1_bui: 'dust', c1_tran: 'footprint', c1_chido: 'thread', c1_traitrai: 'hand', c1_thuoc: 'bottle', c1_gocdam: 'knife', c1_cando: 'bottle',
    c1_nha: 'hand', c1_mau: 'blood', c1_chot: 'thread', c2_trinho: 'brain', c3_x: 'ear', c3_haicuong: 'question', c4_gaycot: 'bone', c4_cuop: 'wallet', c4_quanao: 'clothes',
    c4_datco: 'leaf', c4_giong: 'speech', c5_kyuc: 'photo', c5_xe: 'car', c6_khongchongcu: 'hand', c6_huong: 'knife', c6_dep: 'footprint', c6_thamtu: 'bandage', c6_loibinh: 'speech',
    c7_tu: 'files', c7_cuong: 'files', c7_vung: 'globe', c8_ban: 'mirror',
  };
  function svg(name, cls = 'ico') {
    const d = D[name] || D.question;
    return `<svg viewBox="0 0 64 64" class="${cls}"><g stroke="${I}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" filter="url(#ink)">${d}</g></svg>`;
  }
  return { svg, ID, CLUE, has: n => !!D[n] };
})();
