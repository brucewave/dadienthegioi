'use strict';
/* =================== CHƯƠNG 3: CẬU VẺ =================== */
Object.assign(SCENES, {
  c3_start: [
    { chap: 'Chương 3', title: 'Cậu Vẻ', pov: 'lieng' },
    { bg: 'funeral', cast: ['bac'] },
    { cut: [
      { img: 'scene', o: { place: 'funeral', figs: [['lieng', 520, 'sad', 'right'], ['bac', 1080, 'neutral', 'left']] }, cam: [[800, 300, 1.25], [800, 440, 1.05]], t: 12, say: [
        'Vì thấy có lỗi, tôi xin nghỉ hai ngày để ở lại đây, đảm bảo đám tang không có chuyện gì trước khi hạ huyệt. Để một ông lão thiểu năng ở đây một mình thì chẳng thể yên tâm được.',
      ] },
      { img: 'scene', o: { place: 'funeral', figs: [['ve', 800, 'happy', 'right', { h: 150, y: 650 }], ['bac', 1200, 'smile', 'left'], ['lieng', 380, 'surprised', 'right']], marks: [[380, 330, '!']] }, tr: 'cut', sfx: 'meow', cam: [[800, 560, 1.36], [800, 480, 1.12]], t: 8, say: [
        'Và tôi đã không lo thừa. Ngay hôm sau, ông bác bế một con mèo vào, rồi thả nó chạy lung tung quanh linh cữu.',
        '*Mèo chạy qua quan tài là điềm gở! Phải bắt nó lại ngay!',
      ] },
    ] },
    { game: 'world', title: 'Bắt con mèo!', player: 'lieng', at: [9, 9.4], dir: 'up', hint: 'Đuổi theo và chạm vào con mèo 3 lần trước khi nó nhảy lên quan tài!',
      npcs: [{ c: 've', at: [10, 6.6], flee: true, speed: 2.6 }, { c: 'bac', at: [15, 7], dir: 'left', on: ['bac: ...', '*Ông bác chỉ đứng nhìn, chẳng nói chẳng rằng.'] }],
      goal: { catch: 've', need: 3 } },
    { cast: ['bac', 've'] },
    { cut: [
      { img: 'scene', o: { place: 'funeral', cage: 1250, vemo: 'angry', figs: [['lieng', 560, 'smug', 'right'], ['bac', 960, 'sad', 'left']] }, cam: [[1150, 600, 1.34], [900, 480, 1.08]], t: 10, say: [
        'Tôi tóm được nó, nhốt vào một cái lồng. Ông bác không thông minh lắm, nhưng ít ra khi tôi nhắc thì ông cũng chịu nghe.',
        'Từ đó ông ở ngoài với con mèo nhiều hơn là ở trong này.',
      ] },
      { img: 'scene', o: { place: 'funeral', dark: true, figs: [['lieng', 800, 'scared', 'down', { tone: 'cold' }]], spot: [800, 520, .45] }, tr: 'black', cam: [[800, 440, 1.04], [800, 480, 1.25]], t: 14, say: [
        'Trong phòng chỉ còn tôi và quan tài của cậu ta.',
        'Tôi không tin ma quỷ. Nhưng ở một mình trong này thì cũng sợ phết. Tôi cứ tưởng tượng cảnh cậu ta về đòi mạng.',
        'May là tới khi hạ huyệt, chẳng có chuyện gì xảy ra cả.',
      ] },
    ] },
    { cast: [] },
    { go: 'c3_night' },
  ],

  c3_night: [
    { date: 'Ngày 22 tháng 10 năm 2026' },
    { bg: 'funeral', cast: ['bac', 've'] },
    { cut: [
      { img: 'scene', o: { place: 'funeral', cage: 1020, vemo: 'angry', figs: [['lieng', 460, 'surprised', 'right'], ['bac', 1240, 'think', 'left']], marks: [[1020, 560, '!!', .6]] }, sfx: 'meow', cam: [[1050, 620, 1.4], [900, 500, 1.12]], t: 12, say: [
        'Mọi thứ xong xuôi. Tôi đang thu dọn chuẩn bị ra về thì con mèo bỗng gào lên.',
        've[angry]: NGAOOOO!',
        'Ông bác ngồi thụp xuống cạnh cái lồng, nghiêng tai lắng nghe rất chăm chú.',
        'Suốt hai ngày qua, ông chưa nói một lời. Tôi hỏi gì ông cũng chỉ ngơ ngơ ra. Vậy mà lần này—',
        'bac[neutral]: Cậu Vẻ nói phải chạy thôi cậu Liễng ơi.',
      ] },
    ] },
    'lieng[surprised]: Hả? Cậu Vẻ là ai cơ? Mà chạy là sao?',
    'Ông không trả lời nữa. Ông mở lồng cho con mèo ra.',
    'bac[sad]: Xin lỗi cậu Vẻ. Để cậu phải chịu khổ rồi.',
    '*Cậu Vẻ mà ông ta nói là... con mèo đó hả? Thay vì thiểu năng trí tuệ thì ông ta nên vào trại thương điên mới đúng.',
    '*Mà khoan. Ông ta nói được mà? Vậy là suốt hai ngày qua ông ta cố tình bơ tôi à?',
    { choice: [
      { t: '“Bác ơi, mèo không biết nói đâu.”', steps: ['lieng: Bác này, bình tĩnh lại đi. Tôi không nghĩ một con mèo có thể nói chuyện được đâu.', '*Mà thật ra tôi cũng chẳng nghĩ ông ấy hiểu tôi nói gì.'] },
      { t: '“Thế... cậu Vẻ còn nói gì nữa?”', steps: ['lieng: Thế... cậu Vẻ còn nói gì nữa không?', '*Mình đang làm cái quái gì vậy. Nói chuyện với một con mèo qua phiên dịch viên.'] },
    ] },
    { fx: 'blackout' },
    { bg: 'funeral', o: { dark: true }, cast: [] },
    { music: 'eerie' },
    { cut: [
      { img: 'scene', o: { place: 'funeral', dark: true, figs: [['lieng', 600, 'scared', 'right', { tone: 'cold' }], ['bac', 1020, 'scared', 'left', { tone: 'cold' }]], spot: [800, 500, .5] }, tr: 'black', cam: [[800, 460, 1.06], [760, 440, 1.24]], t: 14, say: [
        'Đúng lúc ấy, đèn phụt tắt.',
        'bac[scared]: Cậu Vẻ nói hắn tới rồi.',
        '*Ê này. Tôi thật sự sợ đấy. Chẳng lẽ con mèo cảm được ma quỷ? Cậu ta thật sự về tìm tôi đòi mạng sao?',
        'Tay chân tôi cứng đờ. Đừng nói tới chạy — nếu cậu ta hiện hồn ra đây, tôi sẽ chết đứng mất.',
        'Rồi lòng tôi bỗng trở nên bình thản. Có lẽ đó là cái kết thích hợp cho một kẻ như tôi.',
        'Tôi nhắm mắt chờ đợi.',
      ] },
      { img: 'scene', o: { place: 'funeral', dark: true, figs: [['lieng', 600, 'sleep', 'right', { tone: 'cold' }]], spot: [600, 470, .32] }, tr: 'black', hold: 1600, cam: [[600, 420, 1.3], [600, 420, 1.4]], t: 6, say: [
        'Không có gì xảy ra cả.',
      ] },
      { img: 'scene', o: { place: 'funeral', dark: true, figs: [['lieng', 600, 'angry', 'right', { tone: 'cold' }]], marks: [[600, 330, '?!']] }, tr: 'cut', cam: [[700, 440, 1.12], [800, 440, 1.02]], t: 6, say: [
        'Tôi từ từ mở mắt. Chẳng có ai ở đó. Kể cả ông bác.',
        'lieng[angry]: Ông già chết tiệt giỡn mặt tôi hả?!',
      ] },
    ] },
    { bg: 'street_night', cast: [] },
    { cut: [
      { img: 'kidnap', cam: [[1150, 520, 1.1], [760, 430, 1.26]], t: 13, say: [
        'Tôi lao ra ngoài. Một kẻ đang vác ông bác trên lưng, tay kia xách con mèo. Ông bác đã ngất, còn con mèo đang điên cuồng cào cấu trong vô vọng.',
        'Kẻ đó quay lại, nhìn thấy tôi. Hắn giơ tay chào, giọng phởn phơ lạ thường.',
        'bichmat[smug]: Chào cậu. Tôi sẽ đem ông lão này đi chăm sóc. Nếu cậu vui lòng bỏ qua chuyện này thì tôi sẽ rất biết ơn đấy.',
      ] },
    ] },
    'Rồi hắn biến mất vào bóng tối.',
    '*Tôi không biết chuyện gì đang xảy ra. Nhưng trước mắt tôi là một vụ bắt cóc.',
    '*Hắn đã mất dạng, nhưng tôi vẫn còn nghe được tiếng mèo kêu. Tôi có thể lần theo đó. Vấn đề là không được để bị phát hiện — đánh động hắn, hắn có thể làm chuyện liều lĩnh.',
    { go: 'c3_follow' },
  ],

  c3_follow: [
    { bg: 'street_night', cast: [] },
    { game: 'world', map: 'alley', o: { night: true }, title: 'Lần theo tiếng mèo', player: 'lieng', at: [2.5, 3.2],
      hint: 'Tới chỗ phát ra tiếng mèo (ô vàng). Tránh vùng đỏ — tầm nhìn của đồng bọn canh đường. Đứng vào bụi cây để nấp.', caught: 'Bị phát hiện! Phải lùi lại từ đầu...',
      guards: [
        { c: 'unk', at: [7, 3], path: [[7, 3], [22, 3]], speed: 1.4, range: 4, fov: 60 },
        { c: 'unk', at: [16.5, 8.6], turn: [0, 90, 180, 270], every: 2.2, ang: 0, range: 3.5, fov: 60 },
        { c: 'unk', at: [5, 14.2], path: [[5, 14.2], [19, 14.2]], speed: 1.3, range: 3.5, fov: 60 },
      ],
      goal: { reach: [28.2, 12.2, 2.6, 2.6], label: '🐈 Meo!' } },
    { bg: 'house_night', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'gate', figs: [['cuong', 640, 'neutral', 'right'], ['bichmat', 900, 'smug', 'left']] }, cam: [[800, 360, 1.08], [800, 470, 1.22]], t: 10, say: [
        'Tiếng mèo dẫn tôi tới trước một căn nhà ở cuối hẻm. Hắn đi vào trong.',
        'Ngoài hắn, còn ít nhất hai kẻ nữa: một kẻ ra mở cổng, một kẻ đứng trong nhà chào hắn.',
      ] },
    ] },
    '*Liều vào đó một mình thì quá rủi ro. Tôi nên quay về trụ sở báo cáo, xin lệnh khám xét và điều thêm người.',
    { choice: [
      { t: 'Quay về trụ sở xin hỗ trợ', steps: ['Tôi lùi lại một bước, quay người định rời đi—'] },
      { t: 'Đợi thêm một lúc, quan sát', steps: ['Tôi nép vào bóng tối, nín thở chờ—'] },
    ] },
    { fx: 'shake' },
    've: NGAOOOOOO—!',
    'Một tiếng mèo kêu rất to, rất chói tai vang lên từ trong nhà. Rồi im bặt.',
    '*Có thể bọn chúng đã làm gì đó nguy hiểm. Nếu chậm trễ thì sẽ không kịp mất. Phải hành động ngay!',
    { go: 'c3_yard' },
  ],

  c3_yard: [
    { game: 'world', map: 'house_night', o: { night: true }, title: 'Lẻn qua sân — áp sát tên canh cổng', player: 'lieng', at: [1.8, 12.2],
      hint: 'Tên gác cổng quay đầu liên tục. Nấp trong bụi cây, đợi hắn quay đi rồi áp sát sau lưng hắn (ô vàng).', caught: 'Hắn nhìn thấy rồi! Lùi lại!',
      guards: [
        { c: 'cuong', at: [11.9, 11.9], turn: [90, 180, 270, 0], every: 2.4, ang: 90, range: 4, fov: 70 },
        { c: 'unk', at: [6, 9.6], path: [[6, 9.6], [18, 9.6]], speed: 1.1, range: 3, fov: 60 },
      ],
      goal: { reach: [10.9, 10.1, 2, 1], label: 'Sau lưng hắn' } },
    { cut: [
      { img: 'fight', o: { kind: 'sneak', a: 'lieng', b: 'cuong', place: 'night' }, cam: [[1000, 420, 1.2], [760, 460, 1.06]], t: 6, hold: 700, say: [
        '*Ngay sau lưng hắn. Hắn vẫn chưa hay biết gì.',
      ] },
    ] },
    { game: 'timed', vs: ['lieng', 'cuong'], title: 'Đánh ngất tên gác cổng', maxMiss: 0, intro: 'Ngay sau lưng hắn...', fail: 'Hắn quay lại! Thử lại!', rounds: [
      { tell: 'Hắn chưa hay biết gì. Ra đòn!', opts: ['Chặt vào gáy', 'Gọi hắn quay lại', 'Đẩy ngã'], ans: 0, time: 2, ok: 'Hắn đổ gục xuống không một tiếng động.' },
    ] },
    { cut: [
      { img: 'fight', o: { kind: 'impact', a: 'lieng', b: 'cuong', pa: 'punch', fx: 'PHỤP!' }, tr: 'flash', sfx: 'impact', hold: 700, cam: [[880, 440, 1.2], [860, 440, 1.08]], t: 3, say: [] },
      { img: 'fight', o: { kind: 'down', a: 'lieng', b: 'cuong', place: 'night', emoA: 'think' }, tr: 'cut', hold: 500, cam: [[800, 480, 1.1], [900, 450, 1.02]], t: 6, say: [
        'Tên gác cổng nằm bất tỉnh. Tôi kéo hắn vào bụi cây cạnh cổng rồi lẻn vào trong nhà.',
      ] },
    ] },
    { go: 'c3_inside' },
  ],

  c3_inside: [
    { bg: 'house_in', cast: [] },
    { game: 'world', map: 'house_in', o: { night: true }, title: 'Bên trong căn nhà', player: 'lieng', at: [2, 3.2],
      hint: 'Tới ô xanh để nghe lén, sau đó tìm tới cuối hành lang (ô vàng).', caught: 'Có tiếng bước chân lại gần — phải lùi lại!',
      require: ['nghe'], requireText: 'Khoan — có tiếng nói chuyện ở đâu đó. Nghe lén trước đã (ô xanh).',
      guards: [
        { c: 'unk', at: [3, 9.6], path: [[3, 9.6], [22, 9.6]], speed: 1.2, range: 4, fov: 60 },
        { c: 'unk', at: [9, 3.9], path: [[9, 3.9], [15.5, 3.9], [15.5, 7.5], [9, 7.5]], speed: 1, range: 3, fov: 60 },
      ],
      events: [{ id: 'nghe', rect: [11, 7.4, 2, 1.6], label: '👂', on: [
        'Có tiếng người nói vọng ra từ sau cánh cửa. Tôi áp tai vào nghe.',
        '???: ...Có ông già với con mèo thì cuối cùng cũng tìm được X rồi.',
        '???: Tìm được rồi thì sao? Ông ấy vừa ngất xỉu đấy. Phải ưu tiên chữa trị cho ông ấy trước!',
        '???: Không có thời gian đâu! Mỗi ngày trôi qua, cái vùng đó lại lan thêm—',
        '???: Ông ấy là người, không phải công cụ!',
        '*X? Vùng gì? Bọn này đang nói cái quái gì vậy?',
        { clue: { id: 'c3_x', name: '“X”', desc: 'Bọn bắt cóc cần ông bác và con mèo để tìm một kẻ tên “X”. Có kẻ muốn chữa trị cho ông bác trước.' } },
      ] }],
      goal: { reach: [22, 9, 3, 2], label: 'Cuối hành lang' } },
    { fx: 'shake' },
    '???: Khoan! Ngoài cổng — thằng gác đâu rồi?! Có kẻ đột nhập!',
    '*Chết rồi! Phải trốn ngay!',
    { choice: [
      { t: 'Chui vào cánh cửa bên trái' },
      { t: 'Chui vào cánh cửa bên phải' },
      { t: 'Chui vào cánh cửa cuối hành lang' },
    ] },
    { bg: 'house_in', cast: ['bac', 've'] },
    { cut: [
      { img: 'scene', o: { place: 'bare', mattress: true, lying: 'bac', wardrobe: false, figs: [['ve', 780, 'sad', 'left', { h: 130, y: 760 }], ['lieng', 1150, 'scared', 'left']] }, cam: [[600, 600, 1.3], [800, 480, 1.08]], t: 10, say: [
        'Tôi lao vào một căn phòng, đóng cửa lại. Và tình cờ thay — đây lại đúng là phòng ông bác đang nằm.',
        'Con mèo nằm cuộn tròn cạnh ông, thở yếu ớt. Bên ngoài, tiếng bước chân chia nhau ra lục soát.',
      ] },
      { img: 'scene', o: { place: 'bare', mattress: true, lying: 'bac', figs: [['bichmat', 1300, 'smug', 'left'], ['lieng', 900, 'angry', 'right']], marks: [[1300, 300, '!']] }, tr: 'flash', sfx: 'boom', cam: [[1150, 420, 1.3], [1000, 440, 1.1]], t: 8, say: [
        { fx: 'shake' },
        'Cánh cửa bật mở. Là hắn — kẻ đã vác ông bác đi.',
        'bichmat[smug]: Chà. Tôi đã bảo cậu bỏ qua vụ này đi mà. Giờ thì tôi phải giết cậu rồi.',
      ] },
      { img: 'fight', o: { kind: 'duel', a: 'lieng', b: 'bichmat', pa: 'stance', pb: 'stance', place: 'night' }, tr: 'cut', sfx: 'stomp', hold: 700, cam: [[800, 460, 1.16], [800, 440, 1.04]], t: 8, say: [
        'Đúng lúc đó, tên canh cổng đột nhiên xuất hiện ngay sau lưng hắn.',
        '*Hết rồi. Hai đánh một, lại còn phải che cho một ông già và một con mèo...',
      ] },
    ] },
    { cast: ['bichmat', 'cuong'] },
    { cut: [
      { img: 'fight', o: { kind: 'hit', a: 'cuong', b: 'bichmat', place: 'house', fx: 'RẦM!' }, tr: 'flash', sfx: 'hit', hold: 500, cam: [[860, 450, 1.25], [800, 450, 1.06]], t: 5, say: [
        { fx: 'shake' },
        'Nhưng tên gác cổng lại quay sang tấn công chính đồng bọn của mình!',
        'cuong[angry]: Còn đứng đó làm gì?! Dẫn ông già chạy đi! Tôi giữ chân hắn!',
      ] },
    ] },
    { cast: [] },
    { game: 'timed', title: 'Cõng ông bác chạy trốn!', maxMiss: 2, intro: 'Ông bác nặng chết khiếp...', fail: 'Vấp ngã rồi! Đứng dậy chạy lại!', rounds: [
      { tell: 'Hành lang — có kẻ chặn bên phải!', opts: ['← Rẽ trái', '→ Rẽ phải', '↑ Lao thẳng'], ans: 0, time: 2.2, ok: 'Thoát!' },
      { tell: 'Bậc thềm phía trước!', opts: ['↑ Nhảy qua', '↓ Bò xuống', '→ Vòng qua'], ans: 0, time: 1.8, ok: 'Vững!' },
      { tell: 'Cổng sắt khép hờ!', opts: ['→ Đẩy cổng', '← Trèo tường', '↓ Chui dưới'], ans: 0, time: 1.8, ok: 'Ra được bên ngoài!' },
    ] },
    { go: 'c3_out' },
  ],

  c3_out: [
    { bg: 'house_night', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'gate', lit: false, figs: [['lieng', 1000, 'scared', 'left', { tone: 'cold' }]] }, cam: [[900, 420, 1.06], [900, 460, 1.18]], t: 7, say: [
        'Tôi chạy thục mạng, không hiểu tại sao tên đó lại giúp mình.',
        'Nhưng khi ra tới cổng, tôi khựng lại.',
      ] },
      { img: 'scene', o: { place: 'gate', lit: false, body: true, figs: [['lieng', 1000, 'surprised', 'left', { tone: 'cold' }]], marks: [[1000, 320, '!?']] }, tr: 'glitch', cam: [[300, 760, 1.5], [600, 560, 1.12]], t: 10, say: [
        'Tên canh cổng... vẫn nằm bất tỉnh trong bụi cây. Đúng ở chỗ tôi đã kéo hắn vào lúc lẻn vào đây.',
        '*Vậy... người vừa cứu tôi là ai?',
      ] },
    ] },
    { clue: { id: 'c3_haicuong', name: 'Hai tên gác cổng', desc: 'Tên gác cổng vẫn bất tỉnh ngoài cổng — trong khi “hắn” vừa xuất hiện bên trong để cứu Liễng.' } },
    'Tôi không hiểu chuyện gì đang xảy ra nữa. Chỉ có một điều tôi chắc chắn:',
    '*Ông lão này là lời giải cho tất cả. Và tôi phải giữ ông ta an toàn.',
    { unlock: 'c4' },
    { go: 'c4_start' },
  ],
});
