'use strict';
/* =================== CHƯƠNG 5: NỐT CAO (1) =================== */
Object.assign(SCENES, {
  c5_start: [
    { chap: 'Chương 5', title: 'Nốt cao (1)', pov: 'lieng' },
    { bg: 'inn_room', cast: ['bac', 've'] },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, figs: [['bac', 760, 'neutral', 'down'], ['ve', 900, 'smile', 'left', { h: 140 }], ['lieng', 1180, 'think', 'left']] }, cam: [[760, 720, 1.5], [860, 460, 1.1]], t: 12, say: [
        'Tôi và ông bác lên phòng. Giờ tôi mới để ý: đôi dép và ống quần của ông dính đầy bùn đất.',
        '*Đừng nói là ông cuốc bộ đi tìm tôi đấy nhé. Nếu thế thật thì... tôi hơi cảm động đấy.',
        '*Ngoài ba mẹ ra, đây là lần đầu có người đối tốt với tôi đến vậy.',
      ] },
    ] },
    { fx: 'glitch' },
    '*...Ủa? Ba mẹ tôi mất từ khi tôi còn chưa có nhận thức về thế giới này mà.',
    '*Chắc ý tôi là nếu họ còn sống thì sẽ thương tôi hơn thế này nhiều. Chắc là vậy.',
    { clue: { id: 'c5_kyuc', name: 'Ký ức lệch', desc: 'Liễng nhớ về ba mẹ — nhưng ba mẹ cậu mất từ khi cậu chưa có nhận thức. Giấc mơ về con voi cũng lạ lùng.' } },
    'lieng: Bác ở yên trong phòng nhé. Tôi xuống đưa ông Trưởng lên trước khi ông ta tỉnh và làm loạn.',
    { go: 'c5_carry' },
  ],

  c5_carry: [
    { bg: 'inn_lobby', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', night: true, figs: [['quanly', 380, 'smile', 'down', { back: true, y: 700 }], ['lieng', 1300, 'scared', 'left', { tone: 'cold' }]] }, cam: [[1200, 420, 1.3], [800, 420, 1.06]], t: 10, say: [
        'Tôi xuống chỗ ô tô, bịt miệng ông ta lại cho chắc, rồi lôi ra. Giờ chỉ cần vác lên lầu mà không để cô quản lý thấy.',
      ] },
    ] },
    { game: 'world', map: 'inn_lobby', title: 'Vác ông Trưởng lên lầu', player: 'lieng', at: [3.5, 10.3], dir: 'up',
      hint: 'Cô quản lý đang nghe điện thoại, thỉnh thoảng lại ngoái nhìn. Quầy lễ tân che được tầm nhìn. Lên tới cầu thang (ô vàng).', caught: 'Cô quản lý quay lại! Lùi về chỗ cũ...',
      speed: 2.8,
      guards: [
        { c: 'quanly', at: [10.6, 2.9], turn: [180, 90, 0], every: 2.5, ang: 90, range: 6, fov: 70 },
        { c: 'khach', at: [6, 8.6], path: [[6, 8.6], [14, 8.6]], speed: 1.1, range: 3, fov: 60 },
      ],
      goal: { reach: [16.4, 2.2, 2.4, 2.6], label: 'Cầu thang' } },
    { bg: 'inn_room', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, lying: 'truong', lyingX: 900, figs: [['lieng', 520, 'think', 'right']] }, cam: [[900, 640, 1.3], [800, 460, 1.06]], t: 9, say: [
        'May mà tới giờ ông ta vẫn bất tỉnh. Tôi trói ông ta lại, đặt lên giường.',
      ] },
    ] },
    '*Khi ông ta tỉnh dậy, chắc sẽ có nhiều chuyện phải nói lắm đây. Nếu không tìm được tiếng nói chung, có khi tôi phải trốn chui trốn nhủi cả đời mất.',
    '*Dù gì ông ta cũng là công an Trưởng. Chẳng bao lâu nữa người ta sẽ nhận ra ông ta mất tích. Rồi tôi thành kẻ bắt cóc công an Trưởng, và cuộc đời tôi coi như chấm hết. Haizzz.',
    { cast: ['bac', 've'] },
    'lieng: Sao bác biết tôi ở... Mà thôi, khoan đã. Đi theo tôi. Bác cần một bộ đồ mới, bộ này bẩn lắm rồi. Mặc thế này người ta đuổi cả bọn khỏi trọ mất.',
    'Ông vẫn cứ ngơ ngơ nhìn tôi.',
    { choice: [
      { t: '“À, cả mày nữa. Mày là Vẻ nhỉ.”', steps: ['lieng: À quên mất, cả mày nữa. Mày là Vẻ nhỉ. Chắc tao cũng nên mua ít đồ ăn cho mèo, không thì mày chết đói mất.'] },
      { t: '“Còn cậu Vẻ thì muốn ăn gì không?”', steps: ['lieng: Còn... ờm... cậu Vẻ thì muốn ăn gì không?'] },
    ] },
    've: Meo. Mrrrao meo.',
    'Rồi nó lại bắt đầu nói chuyện với ông bác bằng cái thứ ngôn ngữ chỉ hai người họ hiểu.',
    'bac: Cậu Vẻ nói đi thôi cậu Liễng.',
    '*Haizzz. Tôi quên mất con mèo mới là người có tiếng nói ở đây. Không phải ẩn dụ gì đâu, nghĩa đen đấy.',
    '*Mà tôi cũng không thấy khó chịu như hồi đầu nữa. Chuyện này... không phải điều gì xấu.',
    { go: 'c5_market' },
  ],

  c5_market: [
    { bg: 'market', cast: [] },
    { cut: [
      { img: 'market', cam: [[800, 300, 1.26], [720, 560, 1.1]], t: 10, say: [
        'Chợ Bến Thành. Đông nghịt người, ồn ã, thơm mùi trái cây và cà phê rang.',
      ] },
    ] },
    { game: 'world', title: 'Chợ Bến Thành', player: 'lieng', at: [14, 12.4], dir: 'up', hint: 'Mua quần áo cho ông bác, đồ ăn cho con mèo, rồi nói chuyện với ông bác.', done: 'Về nhà trọ →',
      npcs: [
        { c: 'banhang', at: [10.75, 8.1], dir: 'down', key: true, label: 'Sạp quần áo', on: [
          'banhang: Mua gì con? Đồ bộ, đồ ngủ, áo thun, có hết!',
          'lieng: Cho con một bộ đồ cho ông bác này.',
          { choice: [
            { t: 'Bộ bà ba nâu', steps: ['bac: ...', 've: Meo.', 'bac: Cậu Vẻ nói được.'] },
            { t: 'Áo sơ mi hoa đi biển', steps: ['ve[angry]: Phì!', 'bac: Cậu Vẻ nói không.', 'lieng: ...Ok, bộ bà ba nâu vậy.'] },
            { t: 'Áo thun in chữ “I ♥ SÀI GÒN”', steps: ['ve: Phì! Phì!', 'bac: Cậu Vẻ nói không. Hai lần.', 'lieng: Được rồi, được rồi. Bộ bà ba nâu.'] },
          ] },
          'banhang[happy]: Bà ba nâu, ông mặc là đẹp nhất chợ luôn!',
        ] },
        { c: 'banpate', at: [18.25, 8.1], dir: 'down', key: true, label: 'Quầy đồ ăn thú cưng', on: [
          'banpate: Mèo nhà anh ăn gì? Bên em có đủ!',
          { choice: [
            { t: 'Pate cá ngừ', steps: ['ve[happy]: Mrrrrr~', 'bac: Cậu Vẻ nói cậu Liễng là người tốt.', '*...Mua bằng pate mà được khen là người tốt. Dễ thật.'] },
            { t: 'Hạt khô loại rẻ nhất', steps: ['ve: ...', 'bac: Cậu Vẻ không nói gì.', '*Cái im lặng đó còn đáng sợ hơn bị chửi.', 'lieng: ...Thôi, lấy thêm hộp pate.', 've: Mrrr~'] },
          ] },
        ] },
        { c: 'bac', at: [14.6, 9.9], dir: 'down', key: true, label: 'Ông bác', on: [
          'Tôi đi chậm lại, đứng cạnh ông bác.',
          { ask: [
            { t: 'Cảm ơn bác đã cứu tôi', steps: ['lieng: Bác này... cảm ơn bác. Vì đã tới cứu tôi.', 'bac: Cậu Vẻ nói phải cứu.', '*Lại là cậu Vẻ.'] },
            { t: 'Hỏi: “Sao bác biết tôi ở nhà tên đó?”', steps: ['lieng: Sao bác biết tôi đang ở căn nhà đó?', 've: Meo.', 'bac: Cậu Vẻ biết.', 'lieng: ...Biết bằng cách nào?', 've: Meo.', 'bac: Cậu Vẻ biết.'] },
            { t: 'Hỏi: “Sao bọn chúng lại truy đuổi bác?”', steps: ['lieng: Tại sao bọn họ lại truy đuổi bác ráo riết vậy?', 've: Mrrao. Meo meo. Mrrr.', 'bac: Cậu Vẻ nói... mèo.', '*Ngôn ngữ loài mèo đúng là ngắn gọn thật. Chẳng hiểu gì cả.'] },
          ], need: 'all' },
        ] },
        { c: 've', at: [15.7, 10.1], dir: 'left', label: 'Cậu Vẻ', on: ['ve: Meo?'] },
        { c: 'khach', at: [5, 9], wander: true, speed: 1 },
        { c: 'phunu', at: [22, 9], wander: true, speed: .9 },
        { c: 'hocvien', at: [8, 13], wander: true, speed: 1.1 },
      ] },
    { cast: ['bac', 've'] },
    'Tôi ngồi xuống, nhìn thẳng vào đôi mắt vàng của con mèo tím.',
    'lieng[smile]: Cậu Vẻ. Cảm ơn cậu nữa. Vì đã cứu tôi.',
    've[happy]: ...Meo.',
    'Lần đầu tiên tôi gọi nó là “cậu Vẻ”. Và lần đầu tiên, tôi có cảm giác nó thật sự hiểu tôi nói gì.',
    { set: { goiVe: true } },
    { go: 'c5_return' },
  ],

  c5_return: [
    { bg: 'inn_lobby', cast: [] },
    { cut: [
      { img: 'street', o: { time: 'dusk' }, cam: [[1100, 760, 1.4], [800, 520, 1.08]], t: 10, say: [
        'Bọn tôi trở về. Chỗ đỗ xe có thêm một chiếc ô tô mới — trông khá quen.',
        '*Chỗ này vẫn có người tới thuê à? Lạ thật. Chắc là khách quen.',
      ] },
    ] },
    { clue: { id: 'c5_xe', name: 'Chiếc xe quen', desc: 'Một chiếc ô tô quen mắt vừa đỗ trong nhà xe của nhà trọ.' } },
    'Tôi nhanh chân lên phòng. May là cửa vẫn khóa.',
    { bg: 'inn_room', cast: ['truong'] },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, figs: [['truong', 560, 'angry', 'right'], ['lieng', 1000, 'neutral', 'left']], marks: [[560, 320, '!!']] }, tr: 'cut', cam: [[560, 420, 1.4], [780, 440, 1.1]], t: 9, say: [
        'Ông ta đã tỉnh. Ánh mắt như muốn ăn tươi nuốt sống tôi. May mà tôi đã bịt miệng ông ta từ trước.',
        'Tôi kéo ghế ngồi xuống, gỡ miếng giẻ ra.',
      ] },
    ] },
    'lieng: Tôi muốn nói chuyện với ông. Chúng ta cần hiểu nhau hơn.',
    'Tôi kể lại mọi chuyện mình đã trải qua. Tôi biết ông là người lý tính — chúng tôi sẽ trao đổi từng câu hỏi một.',
    { ask: [
      { t: 'Tại sao ông lại muốn bắt ông bác?', steps: [
        'lieng: Tại sao ông lại muốn bắt ông bác?',
        'truong[sad]: ...Ông ấy thành ra như bây giờ là vì tôi.',
        'truong: Tôi có lỗi với ông ấy. Tôi chỉ muốn đưa ông ấy về nơi ông ấy cần ở.',
      ] },
      { t: 'X là ai? Tại sao các người muốn giết X?', steps: [
        'lieng: Tôi đã nghe lén. Các người muốn tìm X. X là ai? Tại sao muốn giết hắn?',
        'truong[angry]: Tôi không thể nói cho cậu biết.',
      ] },
      { t: 'Tại sao ông bác lại là chìa khóa để tìm X?', steps: [
        'lieng: Tại sao ông bác lại là chìa khóa để tìm X?',
        'truong: Tôi đã nói rồi. Những chuyện này, dù tin cậu hay không, tôi cũng không thể tiết lộ.',
      ] },
    ], need: 'all' },
    { music: 'mystery' },
    'truong[think]: Nghe đây, Liễng. Cứ coi như cậu không biết gì cả. Giao ông bác cho tôi.',
    'truong: Tôi sẽ bỏ qua mọi chuyện. Chuyện tên gác cổng, chuyện cậu đánh tôi. Tôi còn có thể thăng chức cho cậu.',
    '*Một cuộc đời bình thường. Thăng tiến, an toàn. Đúng thứ mà tôi của trước đây sẽ chộp lấy ngay không chút do dự.',
    { go: 'c5_offer' },
  ],

  c5_offer: [
    { bg: 'inn_room', cast: ['truong'] },
    { choice: [
      { t: 'Chấp nhận. Giao ông bác cho ông Trưởng.', go: 'c5_bad' },
      { t: 'Từ chối.', steps: [] },
    ] },
    'lieng: Không.',
    'lieng[angry]: Tôi từ chối. Tôi sẽ không phản bội ông bác này để sống tiếp mà không biết gì cả.',
    { fx: 'shake' },
    'truong[angry]: Thằng ngu! Mày có biết mày đang dính vào chuyện gì không hả?! Mày sẽ—',
    'Tôi nhét lại miếng giẻ vào miệng ông ta trước khi có ai nghe thấy. Để chắc ăn, tôi giấu ông ta vào trong tủ áo.',
    '*Tôi muốn nói chuyện với ông Trưởng là để có thể trở về cuộc sống trước kia. Nhưng cuối cùng, chính tôi lại chọn để mọi chuyện thành ra thế này.',
    { go: 'c5_fight' },
  ],

  c5_bad: [
    'lieng: ...Được. Tôi đồng ý.',
    'Ông Trưởng gật đầu. Ông bác vẫn ngơ ngác nhìn tôi khi người ta dẫn ông đi. Con mèo tím ngoái lại, đôi mắt vàng không chớp.',
    { music: 'sad' },
    { cut: [
      { img: 'scene', o: { place: 'office', night: true, rain: true, figs: [['lieng', 800, 'sad', 'up', { tone: 'cold' }]], spot: [800, 460, .5] }, tr: 'black', cam: [[260, 280, 1.3], [700, 440, 1.08]], t: 16, say: [
        'Tuần sau, tôi được thăng chức. Tôi có một văn phòng riêng, có cửa sổ nhìn ra đường.',
        'Thỉnh thoảng, vào những đêm mưa, tôi nghe thấy tiếng mèo kêu ngoài cửa sổ.',
        'Tôi chưa bao giờ mở cửa ra xem.',
      ] },
    ] },
    { end: 'Kẻ bình thường', text: 'Liễng chọn sống tiếp mà không biết gì — như mọi lần trước. Và như mọi lần trước, cậu không bao giờ tha thứ cho chính mình.', kind: 'bad', retry: 'c5_offer' },
  ],

  c5_fight: [
    { bg: 'inn_room', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, figs: [['mong', 1180, 'smug', 'left'], ['thach', 1420, 'angry', 'left'], ['lieng', 560, 'surprised', 'right']], marks: [[1300, 300, '!!']] }, tr: 'flash', sfx: 'boom', cam: [[1300, 420, 1.3], [1000, 440, 1.08]], t: 9, say: [
        { fx: 'shake' },
        'RẦM! Cánh cửa phòng bật tung.',
        'Hai kẻ lạ mặt đứng ở cửa. Một tên trùm mũ, đôi mắt ánh xanh; một tên vạm vỡ, đầu cạo trọc.',
      ] },
    ] },
    { cast: ['mong', 'thach'] },
    'thach[angry]: Định vị GPS điện thoại sếp chỉ đúng chỗ này. Thằng nhóc, sếp đâu?',
    'mong[smug]: Ông bác cũng ở đây. Tốt. Đỡ phải tìm.',
    '*Người của ông Trưởng. Chúng lần theo điện thoại của ông ta.',
    { cast: ['mong', 'thach', 'tu'] },
    'tu[smug]: Có vẻ tôi tới đúng lúc nhỉ.',
    'Ông thám tử — người tôi đã gặp ở chính nhà trọ này hôm Bình chết — đứng chắn sau lưng hai kẻ kia. Đầu ông vẫn còn quấn băng.',
    '*Chiếc xe quen dưới nhà xe... là của ông ta.',
    'tu[smile]: Cậu Liễng, giữ ông bác cho chắc. Hai kẻ này để tôi lo.',
    { cast: ['mong'] },
    { cut: [
      { img: 'fight', o: { kind: 'clash', a: 'tu', b: 'thach', place: 'room', fx: 'RẦM!' }, tr: 'flash', sfx: 'impact', hold: 400, cam: [[800, 450, 1.2], [800, 450, 1.05]], t: 4, say: [
        'Mọi thứ diễn ra quá nhanh. Tên to con lao vào ông thám tử.',
      ] },
      { img: 'fight', o: { kind: 'reach' }, tr: 'cut', hold: 400, cam: [[800, 520, 1.0], [800, 520, 1.3]], t: 5, say: [
        'Tên trùm mũ lướt về phía tôi như một cái bóng.',
      ] },
    ] },
    { game: 'timed', vs: ['lieng', 'mong'], title: 'Hỗn chiến!', noRetry: true, maxMiss: 1, intro: 'Tên trùm mũ vươn tay về phía đầu bạn!', rounds: [
      { tell: 'Bàn tay hắn vươn tới trán bạn!', opts: ['← Né trái', '→ Né phải', '↓ Cúi xuống'], ans: 2, time: 1.8, ok: 'Sượt qua!' },
      { tell: 'Hắn xoay người, tay kia quét ngang!', opts: ['↑ Lùi lại', '← Né trái', '→ Phản đòn'], ans: 0, time: 1.5, ok: 'Tránh được!' },
      { tell: 'Phía sau! Ông bác bị đẩy ngã về phía bạn—', opts: ['Đỡ ông bác', 'Mặc kệ, tấn công'], ans: 0, time: 1.2, disobey: 'Bạn quay lại đỡ ông bác — và đúng lúc đó, một bàn tay lạnh ngắt chạm vào thái dương...' },
    ] },
    { fx: 'blackout' },
    { bg: 'black', cast: [] },
    'Mọi âm thanh xa dần.',
    '*Khả năng của tên này... chỉ cần chạm vào là...',
    { unlock: 'c6' },
    { go: 'c6_start' },
  ],
});
