'use strict';
/* ==========================================================
   BẢN ĐỒ — mỗi ô: '#' tường, '.' sàn, ',' sàn khác màu,
   'H' bụi cây/chậu cây (đứng vào để nấp), 'D' cửa ra vào, 'X' khoảng tối.
   props: đồ vật (đơn vị ô), solid = chặn đường & che tầm nhìn.
   Đồ treo tường đặt ở y < 2 (trên mặt tường).
   spots: chỗ đứng của nhân vật trong cảnh hội thoại.
   ========================================================== */
const room = (w, h, door) => {
  const r = ['#'.repeat(w), '#'.repeat(w)];
  for (let i = 2; i < h - 1; i++) r.push('#' + '.'.repeat(w - 2) + '#');
  r.push(door ? '#'.repeat(door[0]) + 'D'.repeat(door[1]) + '#'.repeat(w - door[0] - door[1]) : '#'.repeat(w));
  return r;
};
const put = (rows, list, ch) => rows.map((r, y) => r.split('').map((c, x) => list.some(([a, b]) => a === x && b === y) ? ch : c).join(''));

const MAPS = {
  /* ----- Phòng trọ 204 / 203 ----- */
  inn_room: { theme: 'wood', tiles: room(18, 11, [7, 2]), spawn: [9.5, 7.5], spots: [[8, 8], [10.5, 8], [6, 8], [13, 8]], props: [
    { k: 'window', x: 7, y: .25, w: 4, h: 1.3 },
    { k: 'picture', x: 4.4, y: .35, w: 1.4, h: 1 }, { k: 'calendar', x: 6, y: .4, w: .7, h: .9, text: '18' },
    { k: 'clock', x: 11.6, y: .35, w: .9, h: .9 }, { k: 'ac', x: 13.4, y: .2, w: 2.6, h: .8 },
    { k: 'rug', x: 5, y: 4, w: 7, h: 4.2, c: '#9E5A4A' }, { k: 'ceil', x: 8, y: 4.4, w: 1.2, h: 1.2 },
    { k: 'wardrobe', x: 1.4, y: 1.1, w: 2.4, h: 2.2, solid: true },
    { k: 'plant', x: 4.1, y: 1.7, w: .9, h: .9, solid: true },
    { k: 'bed', x: 12.6, y: 2, w: 4, h: 3, solid: true },
    { k: 'table', x: 11.4, y: 2.1, w: 1, h: 1, solid: true, items: ['mug'] },
    { k: 'slippers', x: 12.4, y: 5.2, w: 1, h: .6 },
    { k: 'table', x: 6.5, y: 5, w: 2.6, h: 1.5, solid: true, items: ['teapot', 'cups', 'book'] },
    { k: 'chair', x: 9.3, y: 5.2, w: 1, h: 1 }, { k: 'chair', x: 5.3, y: 5.3, w: .9, h: .9 },
    { k: 'suitcase', x: 1.6, y: 7.5, w: 1.3, h: 1.1, solid: true },
    { k: 'trash', x: 1.5, y: 8.9, w: .7, h: .7 },
    { k: 'shelfw', x: 15.4, y: 6.2, w: 1.4, h: .8 },
  ] },

  /* ----- Sảnh nhà trọ ----- */
  inn_lobby: { theme: 'tile', tiles: put(room(20, 12, [3, 2]), [[15, 7], [15, 8], [6, 10]], 'H'), spawn: [3.5, 10.3], spots: [[10, 7.2], [12, 7.2], [8, 7.2], [14, 7.2]], props: [
    { k: 'poster', x: 1.6, y: .25, w: 2.2, h: 1.2, text: 'GIÁ PHÒNG', c: '#F3EEDF' }, { k: 'clock', x: 5, y: .35, w: .9, h: .9 },
    { k: 'keyrack', x: 8.6, y: .35, w: 3, h: 1.2 }, { k: 'sign', x: 13, y: .3, w: 4, h: 1, text: 'NHÀ TRỌ' },
    { k: 'ceil', x: 3.6, y: 5.6, w: 1.2, h: 1.2 }, { k: 'ceil', x: 10, y: 6.4, w: 1.2, h: 1.2 },
    { k: 'stairs', x: 16.2, y: 2, w: 2.8, h: 3.2 },
    { k: 'counter', x: 7.4, y: 3.3, w: 6.4, h: 1.3, solid: true },
    { k: 'dispenser', x: 1.1, y: 2.1, w: .9, h: 1.2, solid: true },
    { k: 'table', x: 2, y: 4, w: 2.2, h: 1.4, solid: true, items: ['plate', 'cups'] }, { k: 'stool', x: 1.05, y: 4.25, w: .9, h: .9, c: '#B84A3E' }, { k: 'stool', x: 4.35, y: 4.25, w: .9, h: .9, c: '#3A4766' },
    { k: 'table', x: 2, y: 7.6, w: 2.2, h: 1.4, solid: true, items: ['mug', 'plate'] }, { k: 'stool', x: 1.05, y: 7.85, w: .9, h: .9, c: '#4E8C84' }, { k: 'stool', x: 4.35, y: 7.85, w: .9, h: .9, c: '#B84A3E' },
    { k: 'plant', x: 18, y: 5.6, w: 1, h: 1, solid: true },
    { k: 'motorbike', x: 16.5, y: 8.4, w: 1, h: 2, c: '#B84A3E', solid: true }, { k: 'motorbike', x: 17.9, y: 8.4, w: 1, h: 2, c: '#3A4766', solid: true },
    { k: 'slippers', x: 1.6, y: 10.2, w: 1, h: .6, c: '#4E8C84' },
    { k: 'fan', x: 13.6, y: 9, w: 1.2, h: 1.2 },
  ] },

  /* ----- Hành lang tầng 2 ----- */
  inn_hall: { theme: 'wood', tiles: room(22, 7), spawn: [18, 4], spots: [[11, 4.6], [13, 4.6], [9, 4.6], [15, 4.6]], props: [
    { k: 'rug', x: 2, y: 3, w: 16, h: 1.6, c: '#9E5A4A' },
    { k: 'door', x: 3, y: .4, w: 1.6, h: 1.6, label: '201' }, { k: 'door', x: 7, y: .4, w: 1.6, h: 1.6, label: '202' },
    { k: 'door', x: 11, y: .4, w: 1.6, h: 1.6, label: '203' }, { k: 'door', x: 15, y: .4, w: 1.6, h: 1.6, label: '204' },
    { k: 'poster', x: 9, y: .5, w: 1.4, h: .9, text: 'CẤM HÚT THUỐC', c: '#F3EEDF' }, { k: 'extinguisher', x: 17.6, y: .7, w: .7, h: 1.1 },
    { k: 'ceil', x: 5, y: 3.3, w: 1.1, h: 1.1 }, { k: 'ceil', x: 13, y: 3.3, w: 1.1, h: 1.1 },
    { k: 'slippers', x: 3.3, y: 2.1, w: 1, h: .6, c: '#3A4766' }, { k: 'slippers', x: 11.3, y: 2.1, w: 1, h: .6 }, { k: 'slippers', x: 15.3, y: 2.1, w: 1, h: .6, c: '#D9A93A' },
    { k: 'plant', x: 1.2, y: 2.1, w: .9, h: .9, solid: true }, { k: 'trash', x: 17.8, y: 5, w: .7, h: .7 },
    { k: 'stairs', x: 19, y: 2, w: 2, h: 4 },
  ] },

  /* ----- Học viện ----- */
  academy: { theme: 'wood', tiles: room(18, 11, [8, 2]), spots: [[8, 7], [10, 7], [6, 7], [12, 7]], props: [
    { k: 'board', x: 4, y: .2, w: 10, h: 1.5 }, { k: 'window', x: 1, y: .3, w: 2, h: 1.3 }, { k: 'flag', x: 14.6, y: .3, w: 1.2, h: .8 }, { k: 'clock', x: 16.2, y: .35, w: .8, h: .8 },
    { k: 'table', x: 7.5, y: 2.4, w: 3, h: 1.1, solid: true, items: ['globe', 'book', 'mug'] }, { k: 'chair', x: 8.6, y: 1.9, w: .9, h: .7 },
    ...[2.2, 7.2, 12.2].flatMap(x => [
      { k: 'table', x, y: 4.6, w: 3.4, h: 1, solid: true, items: ['book', 'book'] }, { k: 'chair', x: x + .5, y: 5.65, w: .9, h: .75 }, { k: 'chair', x: x + 2, y: 5.65, w: .9, h: .75 },
      { k: 'table', x, y: 8.2, w: 3.4, h: 1, solid: true, items: ['book'] }, { k: 'chair', x: x + .5, y: 9.25, w: .9, h: .7 }, { k: 'chair', x: x + 2, y: 9.25, w: .9, h: .7 },
    ]),
    { k: 'shelf', x: 15.2, y: 2.1, w: 1.6, h: .8, solid: true }, { k: 'fan', x: 8.4, y: 6.2, w: 1.2, h: 1.2 }, { k: 'plant', x: 1.1, y: 2.1, w: .9, h: .9, solid: true },
  ] },

  /* ----- Hội trường lễ tốt nghiệp ----- */
  auditorium: { theme: 'carpet', tiles: room(22, 13, [10, 2]), spawn: [11, 11], spots: [[11, 6], [13, 6], [9, 6], [15, 6]], props: [
    { k: 'banner', x: 4, y: .15, w: 13, h: 1.4, text: 'LỄ TỐT NGHIỆP 2026' }, { k: 'window', x: 18.2, y: .3, w: 2.8, h: 1.3 }, { k: 'flag', x: 1.2, y: .35, w: 1.6, h: 1 },
    { k: 'stage', x: 3, y: 2, w: 16, h: 3 },
    { k: 'case', x: 10.2, y: 2.6, w: 1.6, h: 1.2, solid: true }, { k: 'podium', x: 6.6, y: 2.5, w: 1.3, h: .9, solid: true },
    { k: 'flowers', x: 4, y: 2.2, w: 1, h: 1.2 }, { k: 'flowers', x: 14.6, y: 2.2, w: 1, h: 1.2 },
    { k: 'speaker', x: 3.2, y: 3.8, w: .7, h: .9 }, { k: 'speaker', x: 18.1, y: 3.8, w: .7, h: .9 },
    { k: 'seats', x: 2, y: 7, w: 8, h: 1, solid: true }, { k: 'seats', x: 12, y: 7, w: 8, h: 1, solid: true },
    { k: 'seats', x: 2, y: 9.2, w: 8, h: 1, solid: true }, { k: 'seats', x: 12, y: 9.2, w: 8, h: 1, solid: true },
    { k: 'plant', x: 1.1, y: 11, w: .9, h: .9 }, { k: 'plant', x: 20, y: 11, w: .9, h: .9 },
  ] },

  /* ----- Đồn công an ----- */
  station: { theme: 'tile', tiles: room(20, 12, [4, 2]), spawn: [5, 10], spots: [[11, 6], [13, 6], [9, 6], [15, 6]], props: [
    { k: 'window', x: 2, y: .3, w: 4, h: 1.3 }, { k: 'clock', x: 6.6, y: .4, w: .8, h: .8 }, { k: 'window', x: 8, y: .3, w: 4, h: 1.3 },
    { k: 'flag', x: 12.4, y: .35, w: 1.2, h: .8 }, { k: 'whiteboard', x: 14, y: .2, w: 4, h: 1.4 },
    { k: 'desk', x: 2, y: 3, w: 3.5, h: 1.6, solid: true }, { k: 'desk', x: 8, y: 3, w: 3.5, h: 1.6, solid: true }, { k: 'desk', x: 14, y: 3, w: 3.5, h: 1.6, solid: true },
    { k: 'chair', x: 3.2, y: 4.65, w: .9, h: .75 }, { k: 'chair', x: 9.2, y: 4.65, w: .9, h: .75 }, { k: 'chair', x: 15.2, y: 4.65, w: .9, h: .75 },
    { k: 'cabinet', x: 17.4, y: 6, w: 1.5, h: 2.5, solid: true }, { k: 'dispenser', x: 1.1, y: 5.4, w: .9, h: 1.2, solid: true },
    { k: 'desk', x: 2, y: 7.4, w: 3.5, h: 1.6, solid: true }, { k: 'desk', x: 8, y: 7.4, w: 3.5, h: 1.6, solid: true },
    { k: 'chair', x: 3.2, y: 9.05, w: .9, h: .75 }, { k: 'chair', x: 9.2, y: 9.05, w: .9, h: .75 },
    { k: 'papers', x: 12.4, y: 8.4, w: 2, h: 1.2, n: 4 }, { k: 'trash', x: 6, y: 4.4, w: .6, h: .6 },
    { k: 'ceil', x: 6, y: 5.6, w: 1.1, h: 1.1 }, { k: 'ceil', x: 13, y: 5.6, w: 1.1, h: 1.1 },
    { k: 'plant', x: 1.1, y: 9.6, w: 1, h: 1, solid: true },
  ] },

  /* ----- Đám tang ----- */
  funeral: { theme: 'dark', tiles: room(18, 11, [7, 2]), spawn: [9, 9], spots: [[9, 7], [11, 7], [7, 7], [13, 7]], props: [
    { k: 'banner', x: 5.2, y: .15, w: 7.6, h: 1, text: 'VÔ CÙNG THƯƠNG TIẾC', c: '#2B1F1A', tc: '#F3EEDF' },
    { k: 'altar', x: 6.5, y: 1.4, w: 5, h: 1.6, solid: true }, { k: 'flowers', x: 4.4, y: 1.4, w: 1.4, h: 1.6, solid: true }, { k: 'flowers', x: 12.2, y: 1.4, w: 1.4, h: 1.6, solid: true },
    { k: 'wreath', x: 1.6, y: 1.3, w: 1.6, h: 2, solid: true }, { k: 'wreath', x: 14.8, y: 1.3, w: 1.6, h: 2, solid: true },
    { k: 'coffin', x: 7, y: 3.6, w: 4, h: 2, solid: true },
    { k: 'candelabra', x: 5.6, y: 4.2, w: .8, h: .8 }, { k: 'candelabra', x: 11.6, y: 4.2, w: .8, h: .8 },
    { k: 'table', x: 14.3, y: 5.6, w: 1.8, h: 1, solid: true, items: ['teapot', 'cups'] }, { k: 'stool', x: 14.6, y: 6.7, w: .8, h: .8, c: '#4A4650' },
    { k: 'seats', x: 2, y: 8.3, w: 5, h: 1, c: '#4A4650', solid: true }, { k: 'seats', x: 11, y: 8.3, w: 5, h: 1, c: '#4A4650', solid: true },
  ] },

  /* ----- Phố đêm ----- */
  street_night: { night: true, theme: 'street', alt: '#A39A88', tiles: [
    '#'.repeat(24), '#'.repeat(24), '#'.repeat(24), '.'.repeat(24), '.'.repeat(24),
    ','.repeat(24), ','.repeat(24), ','.repeat(24), ','.repeat(24), '.'.repeat(24), '.'.repeat(24), '#'.repeat(24)],
    spots: [[11, 7], [13, 7], [9, 7], [15, 7]], props: [
    { k: 'sign', x: 1.5, y: 1.05, w: 3, h: .75, text: 'TẠP HÓA' }, { k: 'sign', x: 8.5, y: 1.05, w: 3, h: .75, text: 'PHỞ 24H' }, { k: 'sign', x: 16, y: 1.05, w: 3.4, h: .75, text: 'CẮT TÓC' },
    { k: 'window', x: 5, y: .35, w: 2, h: .9, c: 1 }, { k: 'window', x: 12.5, y: .35, w: 2, h: .9 }, { k: 'window', x: 20.5, y: .35, w: 2, h: .9, c: 1 },
    { k: 'lamp', x: 4.5, y: 2.8, w: 2, h: 2 }, { k: 'lamp', x: 17.5, y: 2.8, w: 2, h: 2 },
    { k: 'motorbike', x: 6.4, y: 3.05, w: .9, h: 1.8, c: '#B84A3E' }, { k: 'motorbike', x: 7.6, y: 3.05, w: .9, h: 1.8, c: '#4E8C84' }, { k: 'motorbike', x: 21, y: 3.05, w: .9, h: 1.8, c: '#D9A93A' },
    { k: 'pole', x: 3.2, y: 9.2, w: .7, h: .7 }, { k: 'pole', x: 15, y: 3.2, w: .7, h: .7 },
    { k: 'wire', x: 3.55, y: 9.5, x2: 15.35, y2: 3.5 }, { k: 'wire', x: 15.35, y: 3.5, x2: 24, y2: 2.6 }, { k: 'wire', x: 0, y: 2.8, x2: 3.55, y2: 9.5 },
    { k: 'cart', x: 10.5, y: 9.1, w: 2.2, h: 1.4 }, { k: 'stool', x: 9.7, y: 9.5, w: .7, h: .7, c: '#B84A3E' }, { k: 'stool', x: 12.9, y: 9.6, w: .7, h: .7, c: '#3A4766' },
    { k: 'trash', x: 22.2, y: 9.3, w: .8, h: .8 },
    { k: 'manhole', x: 12, y: 6.4, w: 1, h: 1 }, { k: 'arrow', x: 3.5, y: 7.2, w: 2, h: .8 }, { k: 'zebra', x: 13.6, y: 5, w: 2.2, h: 4 },
    { k: 'car', x: 18, y: 5.6, w: 3.6, h: 1.6, c: '#B84A3E', solid: true },
  ] },

  /* ----- Hẻm (màn lén lút) — đồ trang trí đều không chặn đường ----- */
  alley: { night: true, theme: 'street', tiles: [
    '################################',
    '################################',
    '#....#..........H.......#......#',
    '#....#..................#......#',
    '#....#..####..#######...#..##..#',
    '#.......####..#######......##..#',
    '#.......####..#######......##..#',
    '####..........#######..#####...#',
    '####..####...........H#####...##',
    '#H....####..######.........#...#',
    '#.....####..######..####...#...#',
    '#..........H######..####.......#',
    '#..####.............####...##..#',
    '#..####......H......####...##..#',
    '#..........................##..#',
    '################################'], props: [
    { k: 'lamp', x: 9, y: 2, w: 2, h: 2 }, { k: 'lamp', x: 19, y: 9, w: 2, h: 2 }, { k: 'lamp', x: 27.5, y: 11, w: 2, h: 2 }, { k: 'lamp', x: 2, y: 10.5, w: 2, h: 2 },
    { k: 'pole', x: 7.1, y: 7.1, w: .6, h: .6 }, { k: 'pole', x: 22.2, y: 2.2, w: .6, h: .6 }, { k: 'pole', x: 20.3, y: 13.4, w: .6, h: .6 },
    { k: 'wire', x: 7.4, y: 7.4, x2: 22.5, y2: 2.5 }, { k: 'wire', x: 22.5, y: 2.5, x2: 20.6, y2: 13.7 }, { k: 'wire', x: 7.4, y: 7.4, x2: 1, y2: 13 },
    { k: 'clothesline', x: 1.2, y: 5.3, w: 3.4, h: .1 }, { k: 'clothesline', x: 24.2, y: 9.4, w: 2.6, h: .1 },
    { k: 'trash', x: 4.3, y: 2.1, w: .6, h: .6 }, { k: 'trash', x: 26.3, y: 7.1, w: .6, h: .6, c: '#B84A3E' },
    { k: 'puddle', x: 10.5, y: 8.3, w: 1.6, h: .8 }, { k: 'puddle', x: 3.2, y: 14.1, w: 1.4, h: .6 }, { k: 'manhole', x: 14.5, y: 9.4, w: .8, h: .8 },
    { k: 'box', x: 30, y: 2.2, w: .8, h: .7 }, { k: 'box', x: 29.9, y: 2.9, w: .7, h: .6 },
  ] },

  /* ----- Sân nhà bọn bắt cóc ----- */
  house_night: { night: true, theme: 'grass', tiles: [
    '########################', '########################', '########################',
    '#......................#', '#..H...........H.......#', '#......####............#',
    '#......####.....H......#', '#..............####....#', '#.H............####....#',
    '#.......H..............#', '#...............H......#', '#......................#',
    '#......................#', '###########DD###########'],
    spots: [[11, 6.5], [13, 6.5], [9, 6.5], [15, 6.5]], props: [
    { k: 'door', x: 11, y: 1.2, w: 2, h: 1.8 }, { k: 'window', x: 4, y: 1, w: 3, h: 1.3, c: 1, curtain: '#D9A93A' }, { k: 'window', x: 17, y: 1, w: 3, h: 1.3 },
    { k: 'lamp', x: 10.5, y: 2.6, w: 3, h: 2 },
    { k: 'path', x: 11.1, y: 3.2, w: 1.8, h: 9.4 },
    { k: 'jar', x: 1.3, y: 3.2, w: .9, h: .9 }, { k: 'jar', x: 2.3, y: 3.4, w: .8, h: .8 }, { k: 'plant', x: 8.4, y: 3.1, w: .8, h: .8 }, { k: 'plant', x: 14.6, y: 3.1, w: .8, h: .8 },
    { k: 'clothesline', x: 17.5, y: 4.4, w: 5, h: .1 }, { k: 'bicycle', x: 19.6, y: 11.6, w: 1.8, h: .8 },
    { k: 'tree', x: 20, y: 6.8, w: 2.6, h: 3 }, { k: 'box', x: 7.2, y: 7.3, w: .8, h: .7 },
  ] },

  /* ----- Trong nhà bọn bắt cóc ----- */
  house_in: { night: true, theme: 'dark', tiles: [
    '##########################', '##########################',
    '#......#.........#.......#', '#......#.........#.......#',
    '#..##..#...##....#..##...#', '#..##......##.........#..#',
    '#......#...##....#....#..#', '#......#.........#.......#',
    '###..#####..#######..#####', '#........................#',
    '#H.......................#', '##########################'],
    spots: [[11, 9.6], [13, 9.6], [9, 9.6], [15, 9.6]], props: [
    { k: 'door', x: 2.5, y: .4, w: 1.6, h: 1.6 }, { k: 'door', x: 11.5, y: .4, w: 1.6, h: 1.6 }, { k: 'door', x: 20.5, y: .4, w: 1.6, h: 1.6 },
    { k: 'picture', x: 5, y: .4, w: 1.2, h: .9 }, { k: 'clock', x: 14.6, y: .4, w: .8, h: .8 }, { k: 'portrait', x: 23.4, y: .3, w: 1, h: 1.2 },
    { k: 'bed', x: 19, y: 2.2, w: 2.6, h: 1.8, solid: true, c: '#4A4650', messy: true }, { k: 'table', x: 13.5, y: 2.3, w: 2, h: 1, solid: true, items: ['mug', 'cups'] },
    { k: 'rug', x: 8.5, y: 2.4, w: 2.4, h: 1.6, c: '#5A3A3A' }, { k: 'cobweb', x: 1, y: 2, w: 1.4, h: 1.4 }, { k: 'cobweb', x: 6.8, y: 2, w: 1, h: 1 }, { k: 'cobweb', x: 24, y: 9, w: 1, h: 1 },
    { k: 'box', x: 23.6, y: 6.6, w: .8, h: .7 }, { k: 'box', x: 1.2, y: 6.8, w: .7, h: .6 }, { k: 'papers', x: 15, y: 9.3, w: 2, h: 1, n: 3 },
    { k: 'ceil', x: 4, y: 2.6, w: 1, h: 1 }, { k: 'ceil', x: 13.5, y: 5.6, w: 1, h: 1 }, { k: 'ceil', x: 21.5, y: 5, w: 1, h: 1 },
    { k: 'ceil', x: 6.5, y: 9.2, w: 1, h: 1 }, { k: 'ceil', x: 17.5, y: 9.2, w: 1, h: 1 },
  ] },

  /* ----- Nhà nạn nhân (Cường) ----- */
  victim_room: { theme: 'wood', tiles: room(18, 11, [7, 2]), spawn: [8, 9], spots: [[8, 8.6], [10.5, 8.6], [6, 8.6], [13, 8.6]], props: [
    { k: 'window', x: 11, y: .3, w: 4, h: 1.3 }, { k: 'shelfw', x: 7, y: .3, w: 3, h: 1 }, { k: 'poster', x: 15.6, y: .4, w: 1.3, h: 1, text: 'GYM', c: '#D9A93A' },
    { k: 'cabinet', x: 1.4, y: 1.2, w: 2.4, h: 2, solid: true, open: true }, { k: 'wardrobe', x: 4.2, y: 1.1, w: 2, h: 2.2, solid: true, open: true },
    { k: 'clothes', x: 1.8, y: 3.4, w: 1.8, h: .9 }, { k: 'papers', x: 4.5, y: 3.4, w: 2.4, h: 1.4, n: 6 },
    { k: 'bed', x: 13.4, y: 2, w: 3.4, h: 2.8, solid: true, messy: true, c: '#8FB7C4' },
    { k: 'table', x: 10, y: 4.4, w: 2.6, h: 1.4, solid: true, items: ['wallet', 'mug'] }, { k: 'chair', x: 12.8, y: 4.5, w: 1, h: 1, rot: 70 },
    { k: 'broken', x: 11.2, y: 6.2, w: 1.2, h: .8 }, { k: 'trash', x: 15.8, y: 5.3, w: .7, h: .7, rot: 40 },
    { k: 'ceil', x: 8.5, y: 4.2, w: 1.1, h: 1.1 }, { k: 'slippers', x: 6.2, y: 8.6, w: 1, h: .6, rot: 30 },
  ] },

  /* ----- Giấc mơ ----- */
  dream_home: { theme: 'carpet', tiles: room(18, 11), spots: [[9, 4.6], [11, 4.6]], props: [
    { k: 'picture', x: 2.6, y: .3, w: 1.4, h: 1 }, { k: 'picture', x: 4.4, y: .45, w: 1, h: .8 }, { k: 'clock', x: 11, y: .4, w: .8, h: .8 }, { k: 'window', x: 12.5, y: .25, w: 4, h: 1.4, night: true },
    { k: 'rug', x: 5, y: 3.4, w: 8, h: 5, c: '#C79A5E' }, { k: 'tv', x: 7.4, y: 1.1, w: 3.2, h: 1.2 },
    { k: 'sofa', x: 6.4, y: 5.6, w: 5.2, h: 1.8, solid: true }, { k: 'plant', x: 2, y: 2, w: 1.2, h: 1.2 },
    { k: 'lampfloor', x: 13.2, y: 5.6, w: 1, h: 1 }, { k: 'item', x: 9.5, y: 8.4, w: .6, h: .6, c: '#D9A93A' }, { k: 'item', x: 10.4, y: 8.7, w: .5, h: .5, c: '#B84A3E' },
    { k: 'table', x: 2.4, y: 6, w: 1.8, h: 1.2, solid: true, items: ['teapot'] },
  ] },
  dream_elephant: { theme: 'grass', noSun: true, tiles: [...Array(2).fill('#'.repeat(22)), ...Array(9).fill('.'.repeat(22)), '#'.repeat(22)], spots: [[9, 8], [11, 8]], props: [
    { k: 'path', x: 1, y: 8.2, w: 20, h: 1.2 },
    { k: 'elephant', x: 8.5, y: 2.6, w: 5.5, h: 3.4 }, { k: 'tree', x: 2, y: 2, w: 2.6, h: 3.2 }, { k: 'tree', x: 17, y: 5, w: 2.8, h: 3.4 }, { k: 'tree', x: 4.5, y: 6, w: 2, h: 2.4 },
    { k: 'basket', x: 15, y: 3, w: 1.2, h: 1 }, { k: 'bush', x: 13.5, y: 9.4, w: 1.2, h: 1.1 }, { k: 'bush', x: 1, y: 9.5, w: 1.2, h: 1.1 },
  ] },

  /* ----- Chợ Bến Thành ----- */
  market: { theme: 'tile', tiles: [...Array(4).fill('#'.repeat(28)), ...Array(10).fill('#' + '.'.repeat(26) + '#'), '#'.repeat(12) + 'DDDD' + '#'.repeat(12)], spawn: [14, 12.5], spots: [[13, 8.6], [15, 8.6], [11.5, 8.6]], props: [
    { k: 'tower', x: 12, y: 0, w: 4, h: 4 }, { k: 'poster', x: 3, y: 1.3, w: 3, h: 1, text: 'CỔNG TÂY', c: '#F3EEDF' }, { k: 'poster', x: 22, y: 1.3, w: 3, h: 1, text: 'CỔNG ĐÔNG', c: '#F3EEDF' },
    { k: 'stall', x: 2.5, y: 5.2, w: 4.5, h: 2.2, c: PAL.red, goods: 'fruit', solid: true }, { k: 'stall', x: 8.5, y: 5.2, w: 4.5, h: 2.2, c: PAL.mustard, goods: 'clothes', solid: true },
    { k: 'stall', x: 16, y: 5.2, w: 4.5, h: 2.2, c: PAL.green, goods: 'food', solid: true }, { k: 'stall', x: 22, y: 5.2, w: 4.5, h: 2.2, c: PAL.teal, goods: 'flowers', solid: true },
    { k: 'stall', x: 2.5, y: 10, w: 4.5, h: 2.2, c: PAL.teal, goods: 'bags', solid: true }, { k: 'stall', x: 8.5, y: 10, w: 4.5, h: 2.2, c: PAL.red, goods: 'fruit', solid: true },
    { k: 'stall', x: 16, y: 10, w: 4.5, h: 2.2, c: PAL.sky, goods: 'clothes', solid: true }, { k: 'stall', x: 22, y: 10, w: 4.5, h: 2.2, c: PAL.mustard, goods: 'food', solid: true },
    { k: 'basket', x: 7.2, y: 7.7, w: 1, h: .8 }, { k: 'basket', x: 1.3, y: 7.8, w: 1, h: .8, c: '#4C9A6A' }, { k: 'crate', x: 20.7, y: 7.7, w: .9, h: .8 }, { k: 'crate', x: 26, y: 7.8, w: .8, h: .8 },
    { k: 'stool', x: 9.4, y: 7.8, w: .7, h: .7, c: '#3A4766' }, { k: 'stool', x: 17.2, y: 7.8, w: .7, h: .7, c: '#B84A3E' },
    { k: 'trash', x: 26, y: 12.8, w: .7, h: .7 },
    { k: 'motorbike', x: 1.4, y: 12.2, w: .9, h: 1.7, c: '#B84A3E', solid: true }, { k: 'motorbike', x: 2.6, y: 12.2, w: .9, h: 1.7, c: '#4E8C84', solid: true },
  ] },

  /* ----- Nhà của X ----- */
  x_house: { night: true, theme: 'dark', tiles: [
    '############################', '############################',
    '#.....#.........#..........#', '#.....#.........#..........#',
    '#.....#..####...#...####...#', '#.........####......####...#',
    '###..#####......#####......#', '#........#..H...#..........#',
    '#..####..#......#..........#', '#..####.....#####...####...#',
    '#...........H.......####...#', '#####..#########...........#',
    '#...........H.......H......#', '############################'],
    spots: [[13, 12.2], [15, 12.2], [11, 12.2]], props: [
    { k: 'door', x: 24, y: .4, w: 1.8, h: 1.6 }, { k: 'portrait', x: 3, y: .3, w: 1, h: 1.2 }, { k: 'portrait', x: 19.5, y: .3, w: 1, h: 1.2 }, { k: 'clock', x: 8.4, y: .4, w: .8, h: .8 },
    { k: 'altar', x: 10, y: 2.1, w: 3, h: .9, solid: true },
    { k: 'rug', x: 16.5, y: 11.95, w: 10, h: 1, c: '#7A1E1E' }, { k: 'rug', x: 1.3, y: 7.2, w: 1.5, h: 3.4, c: '#7A1E1E' },
    { k: 'candelabra', x: 3.4, y: 3.2, w: .8, h: .8 }, { k: 'candelabra', x: 4.2, y: 9.8, w: .8, h: .8 }, { k: 'candelabra', x: 13.4, y: 7.3, w: .8, h: .8 },
    { k: 'candelabra', x: 21.5, y: 7.6, w: .8, h: .8 }, { k: 'candelabra', x: 9, y: 12.2, w: .8, h: .8 }, { k: 'candelabra', x: 18, y: 12.2, w: .8, h: .8 }, { k: 'candelabra', x: 25.4, y: 3.2, w: .8, h: .8 },
    { k: 'cobweb', x: 1, y: 2, w: 1.4, h: 1.4 }, { k: 'cobweb', x: 15, y: 2, w: 1, h: 1 }, { k: 'cobweb', x: 26, y: 7, w: 1, h: 1 },
    { k: 'statue', x: 17.2, y: 2.2, w: .9, h: 1 }, { k: 'box', x: 25.6, y: 9.6, w: .8, h: .7 }, { k: 'papers', x: 6.5, y: 2.4, w: 2, h: 1.2, n: 4 },
  ] },
};
