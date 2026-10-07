'use strict';
/* =================== CHƯƠNG 1: CHÚ THÁM TỬ TƯ =================== */
/* Chương này ông Tư chưa biết tên hai người công an: hiện là “Công an thứ nhất” (Bình) và “Công an thứ hai” (Liễng). */
Object.assign(SCENES, {
  c1_start: [
    { chap: 'Chương 1', title: 'Chú thám tử Tư', pov: 'tu', set: {}, alias: { binh: 'Công an thứ nhất', lieng: 'Công an thứ hai' } },
    { date: 'Ngày 18 tháng 10 năm 2026' },
    { bg: 'inn_room', cast: [] },
    { cut: [
      { img: 'street', o: { time: 'dawn' }, cam: [[1050, 250, 1.32], [740, 430, 1.05]], t: 12, say: [
        'Một nhà trọ nhỏ nằm sâu trong con hẻm ở quận Tân Bình. Ông Tư thuê một phòng — một đêm, một ngày. Tối nay ông sẽ lên đường.',
      ] },
      { img: 'nightstand', cam: [[640, 400, 1.04], [830, 540, 1.38]], t: 12, say: [
        '*Lâu lắm rồi mới ngủ được một giấc yên như vậy...',
        '*...',
        { fx: 'shake' },
        '*Khoan đã.',
      ] },
    ] },
    '*Có gì đó không đúng. Xem lại căn phòng một lượt đã.',
    { game: 'world', title: 'Phòng 204 — buổi sáng', player: 'tu', at: [9.5, 7.2], hint: 'Đi lại: WASD / mũi tên / bấm chuột · Xem xét: E. Kiểm tra những chỗ có dấu “?”.',
      objs: [
        { id: 'bed', at: [14.4, 5.4], label: 'Đầu giường', on: ['*Chiếc đồng hồ quả quýt để ở đây tối qua. Giờ chỉ còn một vệt bụi hình tròn.'] },
        { id: 'coat', at: [9.8, 6.4], label: 'Áo khoác trên ghế', on: ['*Túi áo trống rỗng. Chiếc ví đã biến mất.'] },
        { id: 'door', at: [8, 9.3], label: 'Cửa phòng', on: ['*Ổ khóa còn nguyên, không bị cạy. Kẻ vào được đây chỉ có thể là người có chìa khóa.'] },
        { id: 'win', at: [9, 2.3], label: 'Cửa sổ', on: ['*Song sắt chắc chắn. Không ai chui lọt.'] },
      ],
      goal: { reach: [7, 9.3, 2, 1.6], label: 'Xuống sảnh', needKeys: true, needText: 'Xem xét căn phòng trước đã.' } },
    { go: 'c1_lobby' },
  ],

  c1_lobby: [
    { bg: 'inn_lobby', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 380, 'think', 'down', { back: true, y: 700 }]] }, cam: [[420, 360, 1.34], [640, 420, 1.08]], t: 9, say: [
        'Dưới sảnh, ông chủ trọ đang cặm cụi lật cuốn sổ nợ dày cộp.',
      ] },
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 380, 'scared', 'right', { back: true, y: 700 }], ['tu', 1000, 'angry', 'left']] }, tr: 'cut', cam: [[700, 420, 1.12], [700, 420, 1.2]], t: 6, say: [
        'Thấy ông Tư bước xuống, lão gập vội cuốn sổ lại.',
      ] },
    ] },
    { game: 'world', title: 'Sảnh nhà trọ', player: 'tu', at: [17.5, 5.6], dir: 'left', hint: 'Hỏi chuyện ông chủ trọ (đứng sau quầy).',
      objs: [{ id: 'rack', at: [10.1, 2.4], label: 'Bảng chìa khóa', key: false, on: ['*Bảng treo chìa khóa dự phòng của các phòng.'] }],
      npcs: [{ c: 'chutro', at: [10.6, 2.9], dir: 'down', finish: true, on: [
        'chutro: Dậy rồi đấy à? Trả phòng thì trước trưa nhé, quá giờ tôi tính thêm nửa ngày.',
        'tu: Phòng tôi mất đồ. Một cái ví và một chiếc đồng hồ quả quýt.',
        'chutro[angry]: Mất đồ? Ông nói thế là có ý gì? Nhà trọ tôi làm ăn đàng hoàng hai chục năm nay rồi đấy!',
        '*Lão trả lời nhanh quá. Như thể đã chuẩn bị sẵn. Hỏi thêm vài câu xem sao.',
        { ask: [
          { t: 'Đêm qua có ai lên tầng hai không?', steps: [
            'tu: Đêm qua có ai lên tầng hai không?',
            'chutro[smug]: Không ai cả! Chín giờ tôi khóa cổng rồi đi ngủ. Ngủ một mạch tới sáng.',
            'chutro[smug]: Mà ông ngáy to thật đấy. Hơn một giờ sáng mà tôi còn nghe rõ mồn một.',
            '*Ngủ một mạch tới sáng... mà lại nghe thấy ta ngáy lúc một giờ?',
            { clue: { id: 'c1_ngu', name: 'Lời khai mâu thuẫn', desc: 'Chủ trọ nói ngủ say từ 9 giờ tối, nhưng lại nghe rõ ông Tư ngáy lúc hơn 1 giờ sáng.' } },
          ] },
          { t: 'Chìa khóa dự phòng các phòng ai giữ?', steps: [
            'tu: Chìa khóa dự phòng các phòng, ai giữ?',
            'chutro: Tôi giữ. Treo ở cái bảng sau lưng đây này. Ai mà lấy được.',
            { cut: [
              { img: 'scene', o: { place: 'lobby', emptyKey: true, figs: [['chutro', 380, 'scared', 'down', { back: true, y: 700 }]] }, tr: 'cut', cam: [[420, 250, 2.1], [430, 270, 2.3]], t: 6, hold: 500, say: [
                '*Trên bảng, móc của phòng 204 — phòng ta — trống trơn.',
                'chutro[scared]: À... chắc cô quản lý cầm đi lau dọn rồi.',
              ] },
            ] },
            { clue: { id: 'c1_chia', name: 'Móc chìa 204 trống', desc: 'Chìa dự phòng phòng 204 không có trên bảng. Chủ trọ đổ cho cô quản lý.' } },
          ] },
          { t: '(Quan sát kỹ ông chủ trọ)', steps: [
            '*Vai áo lão lấm tấm bụi trắng. Không phải bụi đường — là bột thạch cao, thứ chỉ có trên trần nhà.',
            '*Gấu quần bên phải có một vệt bụi gỗ hằn ngang. Như vừa trèo lên ghế.',
            { clue: { id: 'c1_bui', name: 'Bụi thạch cao trên vai', desc: 'Vai áo chủ trọ dính bột thạch cao; gấu quần có vết như vừa đứng lên ghế.' } },
          ] },
        ], need: 'all' },
        { game: 'deduce', q: 'Ai đã lẻn vào phòng ông Tư đêm qua?', opts: ['Cô quản lý — cô ta cầm chìa dự phòng', 'Ông chủ trọ', 'Một vị khách trọ khác'], ans: 1, hint: 'Ai nói dối về giấc ngủ của mình, và ai dính bụi trần nhà?' },
      ] }] },
    '*Là lão. Nhưng nếu lão đã giấu đồ thì sẽ không giấu dưới quầy này, nơi ai cũng nhìn thấy.',
    '*Nhắm mắt lại. Căn phòng tối hôm qua, lúc ta vừa nhận phòng...',
    { go: 'c1_memory' },
  ],

  c1_memory: [
    { bg: 'void', cast: [] },
    { game: 'memory', title: 'Phòng 204 — tối hôm qua', map: 'inn_room', study: 9, prompt: 'So với ký ức, những gì trong phòng đã thay đổi?',
      objs: [
        { id: 'win', k: 'window', x: 7, y: .25, w: 4, h: 1.3, label: 'cửa sổ' },
        { id: 'rug', k: 'rug', x: 5, y: 4, w: 7, h: 4.2, c: '#9E5A4A', label: 'tấm thảm' },
        { id: 'ward', k: 'wardrobe', x: 1.4, y: 1.1, w: 2.4, h: 2.2, label: 'tủ áo' },
        { id: 'print', k: 'steps', x: 1.6, y: 1.3, w: 2, h: .7, hidden: true, label: 'nóc tủ' },
        { id: 'dust', k: 'dust', x: 1.5, y: 3.4, w: 2.4, h: .9, hidden: true, label: 'sàn trước tủ' },
        { id: 'bed', k: 'bed', x: 12.6, y: 2, w: 4, h: 3, label: 'giường' },
        { id: 'stand', k: 'table', x: 11.4, y: 2.1, w: 1, h: 1, label: 'tủ đầu giường' },
        { id: 'table', k: 'table', x: 6.5, y: 5, w: 2.6, h: 1.5, label: 'cái bàn' },
        { id: 'chair', k: 'chair', x: 9.3, y: 5.2, w: 1, h: 1, label: 'cái ghế' },
        { id: 'case', k: 'suitcase', x: 1.6, y: 7.5, w: 1.3, h: 1.1, label: 'chiếc vali' },
      ],
      changes: {
        chair: { x: 4, y: 3.5, note: 'Chiếc ghế bị kéo sát tới cạnh tủ áo.' },
        dust: { hidden: false, note: 'Bột thạch cao trắng rơi trước tủ — từ trên trần xuống!' },
        print: { hidden: false, note: 'Dấu giày trên nóc tủ áo — ai đó đã trèo lên đó.' },
      } },
    { clue: { id: 'c1_tran', name: 'Tấm trần bị xê dịch', desc: 'Ghế bị kéo sát tủ áo, dấu giày trên nóc tủ, bột thạch cao rơi từ trần xuống ngay phía trước.' } },
    { game: 'deduce', q: 'Lão chủ trọ giấu đồ ở đâu?', opts: ['Dưới gầm giường', 'Trong chậu cây cạnh cửa sổ', 'Trên trần, ngay phía trên tủ áo', 'Lão đã mang đi bán'], ans: 2, hint: 'Bột thạch cao, chiếc ghế, dấu giày trên nóc tủ...' },
    { go: 'c1_confront' },
  ],

  c1_confront: [
    { bg: 'inn_lobby', cast: ['tu', 'chutro'] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 380, 'scared', 'right', { back: true, y: 700 }], ['tu', 960, 'smug', 'left']], marks: [[380, 290, '!']] }, tr: 'cut', sfx: 'hit', cam: [[640, 420, 1.06], [560, 400, 1.22]], t: 10, say: [
        'tu: Ghế trong phòng tôi bị kéo sát vào tủ áo, trên nóc tủ có dấu giày, dưới sàn rơi đầy bột thạch cao. Còn trên vai ông cũng là bụi thạch cao.',
        'tu[smug]: Ông lên phòng bằng chìa dự phòng, lấy ví và đồng hồ, giấu tạm lên trần — định đợi tôi trả phòng rồi mới lấy xuống. Tôi nói có sai không?',
        'Mặt lão chủ trọ trắng bệch. Môi lão mấp máy nhưng không thành tiếng.',
      ] },
    ] },
    { choice: [
      { t: '“Trả lại đồ, tôi sẽ không báo công an.”', steps: ['tu: Trả lại đồ cho tôi. Tôi sẽ không báo công an.'] },
      { t: '“Tối nay tôi đi rồi. Coi như chưa có chuyện gì.”', steps: ['tu: Tối nay tôi đi rồi. Ông trả lại đồ, coi như chưa có chuyện gì xảy ra.'] },
    ] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 400, 'sad', 'down', { back: true, y: 700 }]] }, cam: [[420, 380, 1.4], [460, 420, 1.55]], t: 8, say: [
        'Lão lầm lũi đi lên lầu. Một lúc sau quay xuống, đặt chiếc ví và chiếc đồng hồ lên quầy, không nói một lời.',
        '*Đồng hồ vẫn chạy. Kim chỉ bảy giờ bốn mươi. Ta vốn phải rời đi tối nay, cũng chẳng cần so đo với lão làm gì.',
      ] },
    ] },
    { go: 'c1_debt' },
  ],

  c1_debt: [
    { bg: 'inn_lobby', cast: ['quanly'] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', food: true, figs: [['quanly', 1050, 'smile', 'left'], ['tu', 1380, 'neutral', 'left']] }, cam: [[1200, 520, 1.3], [1150, 480, 1.12]], t: 10, say: [
        'Ông Tư quay lại bàn ăn sáng. Cô quản lý mang ra một tô hủ tiếu còn bốc khói.',
        'quanly: Chú dùng đi ạ. Sáng nay... ông chủ có làm gì phiền chú không?',
        '*Cô ta biết chuyện. Hoặc ít ra là đoán được.',
      ] },
      { img: 'close', o: { k: 'thread' }, tr: 'cut', cam: [[700, 400, 1.04], [760, 380, 1.16]], t: 7, say: [
        'Cô gạt lọn tóc ra sau, buộc lại bằng một sợi chỉ đỏ đã sờn.',
      ] },
    ] },
    { clue: { id: 'c1_chido', name: 'Sợi chỉ đỏ buộc tóc', desc: 'Cô quản lý buộc tóc bằng một sợi chỉ đỏ đã sờn.' } },
    { music: 'tense' },
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['khanh', 1340, 'angry', 'left'], ['chutro', 380, 'scared', 'right', { back: true, y: 700 }], ['quanly', 860, 'scared', 'right']], marks: [[1340, 300, '!!']] }, tr: 'flash', sfx: 'boom', cam: [[1300, 380, 1.4], [1000, 420, 1.1]], t: 7, hold: 500, say: [
        { fx: 'shake' },
        'khanh: LÃO GIÀ! RA ĐÂY!',
        'Một gã đàn ông đạp cửa bước vào. Vết sẹo dài chạy từ thái dương xuống tận cằm.',
        'khanh[smug]: Anh Khánh sẹo tới thăm đây. Lão biết anh tới làm gì rồi chứ hả?',
      ] },
    ] },
    { cast: ['tu', 'quanly'] },
    'tu: (khẽ hỏi) Chuyện gì vậy?',
    'quanly: (thì thầm) Con trai ông chủ dính vào cờ bạc mạng, vay nặng lãi không trả nổi. Giờ cả khoản nợ khổng lồ đổ hết lên đầu ông ấy...',
    'quanly: Trước kia ông ấy tốt bụng lắm chú ạ. Từ khi gánh nợ mới thành ra hách dịch, thủ đoạn gì cũng làm.',
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 640, 'scared', 'right'], ['khanh', 900, 'angry', 'left']], rays: true }, tr: 'cut', cam: [[770, 380, 1.3], [770, 400, 1.42]], t: 7, say: [
        'chutro[scared]: Tôi... tôi chỉ gom được chừng này. Cậu cho tôi khất thêm mấy bữa...',
        'khanh[angry]: Chừng này? Đến tiền lãi còn không đủ!',
        'Khánh sẹo túm cổ áo lão chủ trọ, vung nắm đấm lên.',
      ] },
    ] },
    { choice: [
      { t: 'Can ngăn' },
      { t: 'Đứng nhìn', steps: ['*Lão vừa trộm đồ của ta. Lão đáng bị như vậy.', '*...', '*Không. Ta không thể đứng nhìn.'] },
    ] },
    { cast: ['tu', 'khanh'] },
    { cut: [
      { img: 'fight', o: { kind: 'duel', a: 'tu', b: 'khanh', pa: 'block', pb: 'punch', place: 'lobby' }, tr: 'flash', sfx: 'clash', hold: 700, cam: [[800, 470, 1.18], [800, 450, 1.04]], t: 6, say: [
        'tu[angry]: Đủ rồi. Đánh người ta thì cũng chẳng ra được đồng nào đâu.',
        'khanh: Lão già kia là ai mà dám xen vào chuyện của anh?',
      ] },
      { img: 'fight', o: { kind: 'cutin', a: 'tu', move: 'THẾ THỦ', sub: 'tay trái che mặt · tay phải chờ gỡ', emoA: 'angry' }, tr: 'cut', sfx: 'stomp', hold: 900, cam: [[800, 420, 1.02], [860, 420, 1.1]], t: 3 },
    ] },
    { game: 'timed', vs: ['tu', 'khanh'], title: 'Đỡ đòn Khánh sẹo', noRetry: true, maxMiss: 1, intro: 'Khánh sẹo lao tới!', rounds: [
      { tell: 'Hắn vung cú đấm móc từ bên phải!', opts: ['← Né trái', '→ Né phải', '↓ Cúi xuống'], ans: 0, time: 2.4, ok: 'Né được!' },
      { tell: 'Hắn đá quét thấp!', opts: ['↑ Nhảy lùi', '↓ Cúi xuống', '→ Né phải'], ans: 0, time: 2, ok: 'Tránh được!' },
      { tell: 'Hắn túm lấy cổ áo ông!', opts: ['Gỡ tay hắn', 'Đấm trả', 'Đứng yên'], ans: 0, time: 1.8, ok: 'Gỡ được — nhưng sức già có hạn...' },
    ] },
    { cut: [
      { img: 'fight', o: { kind: 'clash', a: 'tu', b: 'khanh', place: 'lobby', fx: 'CHÁT!' }, tr: 'flash', sfx: 'impact', hold: 500, cam: [[800, 450, 1.2], [800, 450, 1.06]], t: 3, say: [
        'Ông Tư đỡ được vài đòn. Nhưng sức một ông già sao bì được với gã giang hồ đang điên tiết.',
      ] },
      { img: 'fight', o: { kind: 'impact', a: 'khanh', b: 'tu', pa: 'punch', fx: 'HỰ!', red: true }, tr: 'cut', sfx: 'impact', hold: 450, cam: [[880, 440, 1.25], [860, 440, 1.1]], t: 2, say: [
        { fx: 'shake' },
      ] },
      { img: 'fight', o: { kind: 'down', a: 'khanh', b: 'tu', place: 'lobby', emoA: 'smug', emoB: 'hurt' }, tr: 'cut', hold: 500, cam: [[900, 520, 1.15], [1000, 450, 1.04]], t: 6, say: [
        'khanh[angry]: Hôm nay anh tha. Lần sau mà không đủ tiền thì đừng trách.',
      ] },
    ] },
    { cast: [] },
    'Hắn đúng là đã bỏ đi thật. Nhưng bỏ lại phía sau là hai khuôn mặt bị đánh tới biến dạng.',
    { go: 'c1_after' },
  ],

  c1_after: [
    { cast: ['quanly', 'chutro'] },
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['chutro', 620, 'hurt', 'right'], ['quanly', 880, 'sad', 'left']] }, cam: [[750, 380, 1.3], [750, 400, 1.14]], t: 9, say: [
        'Cô quản lý vội chạy ra đỡ hai người vào trong, lấy hộp thuốc ra. Cô dùng bông thấm thuốc sát trùng màu nâu, chấm lên vết thương cho lão chủ trọ.',
        'Lão chủ trọ giữ tay cô lại.',
        'chutro[angry]: Để ta tự làm. Cô có đối xử tốt với ta thì ta cũng không trả lương cho cô đâu. Có giỏi thì báo công an đi.',
        'Nói rồi lão đuổi cả hai ra ngoài, không cảm ơn lấy một tiếng.',
      ] },
    ] },
    { cast: ['tu', 'quanly'] },
    '*Cái lão này...',
    { choice: [
      { t: 'Xông vào dạy cho lão một bài học', steps: ['Ông Tư toan quay lại, nắm đấm siết chặt. Nhưng một bàn tay nhỏ giữ ông lại.'] },
      { t: 'Thở dài cho qua', steps: ['Ông Tư thở hắt ra. Cô quản lý khẽ lắc đầu, như cảm ơn ông đã nhịn.'] },
    ] },
    'quanly[sad]: Cảm ơn chú. Cháu hiểu mà — ông ấy làm vậy cũng là muốn tốt cho cháu. Đuổi cháu đi để cháu khỏi bị liên lụy.',
    'quanly[sad]: Trong thời gian ở lại phụ ông ấy, cháu cũng tìm được việc mới rồi. Dù thương ông ấy lắm, nhưng cháu cũng phải kiếm sống chú ạ.',
    { cut: [
      { img: 'scene', o: { place: 'lobby', figs: [['tu', 640, 'hurt', 'right'], ['quanly', 880, 'smile', 'left']] }, cam: [[760, 380, 1.4], [760, 380, 1.5]], t: 7, say: [
        'Cô ngồi xuống, chấm thuốc lên vết thương trên mặt ông Tư. Tay trái cô thoăn thoắt, quen thuộc như đã làm việc này cả trăm lần.',
        '*Mùi thuốc hắc. Màu nâu sẫm. Và bàn tay trái.',
      ] },
    ] },
    { clue: { id: 'c1_traitrai', name: 'Cô quản lý thuận tay trái', desc: 'Cô quản lý buộc tóc, bôi thuốc đều bằng tay trái.' } },
    { clue: { id: 'c1_thuoc', name: 'Thuốc sát trùng màu nâu', desc: 'Cô quản lý dùng loại thuốc sát trùng màu nâu, mùi hắc.' } },
    'quanly[smile]: Xong rồi. Cháu xin phép về trước nhé chú.',
    { bg: 'inn_hall', cast: [] },
    { game: 'world', title: 'Hành lang tầng 2', player: 'tu', at: [19.5, 4], dir: 'left', hint: 'Có ai đó đang thò đầu ra hóng chuyện ở phòng 203...',
      npcs: [{ c: 'nha', at: [11.8, 2.6], dir: 'down', finish: true, label: 'Cậu trai lạ', on: [
        'Một cậu trai trẻ đang thò đầu ra khỏi phòng 203 hóng chuyện. Vừa thấy ông Tư, cậu ta rụt ngay vào trong.',
        'nha[sad]: (lẩm bẩm) ...Cứ chịu bán cái nhà trọ này đi mà trả nợ thì đâu tới nước này...',
      ] }] },
    { go: 'c1_murder' },
  ],

  c1_murder: [
    { bg: 'inn_room', o: { night: true, lamp: true } },
    { big: 'Chiều tối hôm đó', auto: 1800 },
    { cut: [
      { img: 'street', o: { time: 'dusk', police: true }, cam: [[820, 420, 1.04], [700, 500, 1.22]], t: 10, sfx: 'whoosh', say: [
        'Ông Tư đang xếp đồ vào vali thì nghe tiếng còi xe và tiếng bước chân dồn dập dưới nhà.',
        '???: Công an đây! Nơi này tạm thời bị phong tỏa, đề nghị mọi người ở yên trong phòng!',
      ] },
      { img: 'scene', o: { place: 'hall', night: true, tape: true, figs: [['binh', 640, 'neutral', 'right'], ['lieng', 860, 'neutral', 'left'], ['tu', 1200, 'think', 'left']] }, tr: 'black', cam: [[800, 420, 1.02], [820, 400, 1.14]], t: 12, say: [
        'Hành lang tầng hai. Hai người công an trẻ đứng chắn trước cửa phòng 203, dây phong tỏa vàng chăng ngang.',
        'binh: Chú ơi, chú là khách trọ ở đây ạ? Cho cháu hỏi tên và số phòng.',
        'tu: Tư. Phòng 204, ngay bên cạnh.',
        '*Hai cậu công an còn trẻ măng, chắc ra trường chưa được bao lâu. Cậu đeo kính thì mắt sáng rỡ, hỏi han không ngớt. Cậu kia thì lạnh như đá, chẳng buồn nhìn ta lấy một lần.',
      ] },
    ] },
    { bg: 'inn_hall', o: { night: true }, cast: ['binh', 'lieng', 'tu'] },
    'binh: Ông chủ trọ được phát hiện đã chết trong phòng 203. Cửa cài chốt từ bên trong, bọn cháu phải phá cửa mới vào được.',
    'binh: Ông ấy chết vì mất máu, con dao đâm vào ngực. Con trai ông ấy — cậu Nhà — nằm ngất ngay bên cạnh, tay còn dính máu.',
    'lieng[smug]: Ông bố chết thì cậu ta được thừa kế cái nhà trọ. Phòng khóa kín, chỉ có hai người. Rõ như ban ngày.',
    'lieng: Tôi vào khoanh vùng hiện trường. Cậu lấy lời khai đi.',
    { cut: [
      { img: 'scene', o: { place: 'hall', night: true, open203: true, figs: [['lieng', 1270, 'neutral', 'up', { h: 330, y: 760 }], ['binh', 640, 'sad', 'right'], ['tu', 900, 'neutral', 'right']] }, cam: [[1100, 420, 1.2], [1000, 420, 1.06]], t: 7, say: [
        'Người công an thứ hai bước vào phòng 203, khép cửa lại sau lưng.',
      ] },
    ] },
    { cast: ['binh', 'tu'] },
    'binh: Chú ở ngay phòng bên cạnh... Chiều nay chú có nghe thấy gì không ạ?',
    'tu: Khoảng năm giờ có tiếng gì đổ rầm một cái. Sau đó thì im bặt.',
    'binh[think]: Rầm một cái... rồi im. Không cãi nhau, không la hét gì ạ?',
    'tu: Không.',
    'binh: Lạ thật. Hai bố con giằng co tới mức đâm nhau mà chẳng ai la lên tiếng nào.',
    'binh: Nói thật với chú, cháu thấy vụ này có mấy chỗ không khớp lắm.',
    'tu: Hồi trước tôi làm thám tử tư. Mấy chuyện “rõ như ban ngày” thường lại là chuyện tối nhất.',
    'binh[surprised]: Thám tử thật ạ?',
    'binh[happy]: Vậy chú vào xem cùng cháu được không? Thêm một đôi mắt vẫn hơn.',
    { cut: [
      { img: 'scene', o: { place: 'hall', night: true, open203: true, figs: [['lieng', 1180, 'neutral', 'left'], ['binh', 760, 'happy', 'right'], ['tu', 480, 'neutral', 'right']] }, tr: 'cut', cam: [[900, 420, 1.12], [960, 420, 1.2]], t: 9, say: [
        'lieng: Phong tỏa, đeo găng, đánh dấu, thu tang vật. Xong cả rồi.',
        'binh[happy]: Cảm ơn cậu! Chú Tư đây cũng thấy vụ này có chỗ không khớp. Vào xem cùng tớ nhé? Cái chốt cửa ấy, tớ thấy có vết—',
        'lieng: Việc của tôi xong rồi. Tôi xuống dưới canh cửa.',
      ] },
      { img: 'scene', o: { place: 'hall', night: true, tape: true, stairs: true, figs: [['lieng', 200, 'angry', 'left', { y: 880 }], ['binh', 820, 'sad', 'left'], ['tu', 1120, 'think', 'left']] }, tr: 'cut', cam: [[500, 520, 1.25], [700, 460, 1.08]], t: 8, say: [
        '*Cậu ta quay lưng, đi thẳng xuống cầu thang. Không ngoái lại lấy một lần.',
        'binh[sad]: ...Cậu ấy vẫn còn giận cháu.',
      ] },
    ] },
    { cast: ['binh', 'tu'] },
    'binh[smile]: À, cháu xin lỗi. Mình vào thôi chú.',
    '*Giữa hai người này có chuyện gì đó. Nhưng không phải việc của ta.',
    { go: 'c1_scene' },
  ],

  c1_scene: [
    { bg: 'inn_room', o: { night: true, lamp: true }, cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'room', blood: true, body: true, nha: true, tape: true, figs: [] }, tr: 'black', cam: [[800, 520, 1.3], [800, 460, 1.04]], t: 9, say: [
        'Phòng 203. Đèn bàn hắt một quầng vàng đục lên hai thân người trên sàn.',
      ] },
    ] },
    { game: 'world', title: 'Phòng 203 — hiện trường', player: 'tu', at: [9, 9], dir: 'up', hint: 'Khám xét các điểm có dấu “?”. Đủ điểm quan trọng thì bấm “Suy luận →”.', done: 'Suy luận →',
      objs: [
        { id: 'body', at: [8, 7.2], label: 'Thi thể chủ trọ', prop: { k: 'body', x: 6.9, y: 6.6, w: 2.3, h: 1.2, knife: true, c: '#4E8C84', pants: '#4A4650', hair: '#2B1F1A', seed: 4 }, on: [
          'Lão chủ trọ nằm ngửa, con dao cắm giữa ngực.',
          '*Vết đâm đi chéo từ phía bên phải của nạn nhân sang trái. Kẻ đứng đối diện đâm theo hướng này — gần như chắc chắn cầm dao bằng tay trái.',
        ], clue: { id: 'c1_gocdam', name: 'Góc đâm: tay trái', desc: 'Vết đâm chéo cho thấy hung thủ cầm dao bằng tay trái.' } },
        { id: 'knife', at: [9.4, 6.9], label: 'Cán dao', on: [
          { cut: [
            { img: 'close', o: { k: 'knife' }, cam: [[800, 450, 1.02], [700, 460, 1.18]], t: 8, say: ['Cán dao đã bị lau sạch dấu vân tay.'] },
            { img: 'close', o: { k: 'knife', smear: true }, tr: 'cut', cam: [[640, 440, 1.3], [620, 440, 1.42]], t: 7, say: ['*Nhưng trong khe chuôi dao còn vương một vệt màu nâu nhạt. Không phải máu. Có mùi hắc... mùi thuốc sát trùng.'] },
          ] },
        ], clue: { id: 'c1_cando', name: 'Vệt thuốc sát trùng trên cán dao', desc: 'Khe chuôi dao vương vệt thuốc sát trùng màu nâu.' } },
        { id: 'nha', at: [13.9, 6.9], label: 'Cậu Nhà (bất tỉnh)', prop: { k: 'body', x: 12.8, y: 6.35, w: 2.2, h: 1.15, c: '#7A6AA8', pants: '#3A4766', dead: false, blood: false }, on: [
          { cut: [
            { img: 'close', o: { k: 'palms' }, cam: [[800, 450, 1.04], [800, 420, 1.16]], t: 9, say: [
              'Cậu Nhà vẫn chưa tỉnh. Hai lòng bàn tay đỏ lòm máu.',
              '*Nhưng mu bàn tay, cổ tay áo thì sạch trơn. Đâm một nhát chí mạng như vậy, máu phải bắn lên tay áo chứ?',
            ] },
          ] },
          '*Sau gáy cậu ta còn sưng một cục u to. Cậu ta không tự ngất — cậu ta bị đánh ngất.',
        ], clue: { id: 'c1_nha', name: 'Máu chỉ ở lòng bàn tay + cục u sau gáy', desc: 'Cậu Nhà chỉ dính máu ở lòng bàn tay, tay áo sạch; sau gáy có cục u do bị đánh.' } },
        { id: 'blood', at: [3, 4.4], label: 'Vệt máu góc phòng', prop: { k: 'blood', x: 1.8, y: 3.6, w: 2.4, h: 1.2 }, on: [
          'Vũng máu dưới lưng thi thể nhỏ một cách bất thường so với lượng máu đã mất.',
          '*Còn ở góc phòng cạnh tủ có một vệt loang lớn đã bị lau vội. Nạn nhân bị đâm ở đây, rồi mới bị kéo sang nằm cạnh cậu Nhà.',
        ], clue: { id: 'c1_mau', name: 'Vết máu không khớp', desc: 'Nạn nhân bị đâm ở góc phòng rồi mới bị kéo tới cạnh cậu Nhà.' } },
        { id: 'door', at: [8, 9.4], label: 'Chốt cửa', on: [
          { cut: [
            { img: 'close', o: { k: 'latch' }, cam: [[800, 400, 1.02], [860, 340, 1.12]], t: 8, say: ['Cửa phòng có một cái chốt cài bên trong. Khe dưới cửa khá rộng.'] },
            { img: 'close', o: { k: 'latch', mark: true }, tr: 'cut', cam: [[860, 300, 1.5], [860, 300, 1.6]], t: 6, say: ['*Trên núm chốt có một vết hằn mảnh, tròn — như bị sợi chỉ siết qua.'] },
            { img: 'close', o: { k: 'latch', mark: true, thread: true }, tr: 'cut', cam: [[820, 800, 1.5], [820, 800, 1.6]], t: 6, say: ['*Và mắc ở mép khe cửa... là một mẩu chỉ đỏ đã sờn.'] },
          ] },
        ], clue: { id: 'c1_chot', name: 'Mẩu chỉ đỏ ở chốt cửa', desc: 'Núm chốt có vết hằn của sợi chỉ; một mẩu chỉ đỏ sờn mắc ở khe dưới cửa.' } },
        { id: 'phone', at: [15.6, 8.6], label: 'Điện thoại cậu Nhà', key: false, prop: { k: 'item', x: 15.2, y: 8.3, w: .8, h: .6, c: '#3A4766' }, on: [
          { cut: [
            { img: 'close', o: { k: 'phone' }, cam: [[800, 360, 1.1], [800, 380, 1.22]], t: 8, say: ['Tin nhắn cuối cùng trong điện thoại cậu Nhà, gửi lúc 16:40, từ một số lạ.'] },
          ] },
          '*Ai đó đã cố tình sắp xếp để hai bố con gặp nhau ở đây.',
        ] },
        { id: 'win', at: [9, 2.3], label: 'Cửa sổ', key: false, on: ['Song sắt chắc chắn, không ai chui lọt.'] },
      ],
      npcs: [
        { c: 'binh', at: [4.6, 8.4], dir: 'right', on: ['binh: Chú cứ xem thoải mái nhé. Cháu cũng đang để ý mấy chỗ lạ lắm.'] },
      ] },
    { cast: ['binh', 'tu'] },
    { game: 'deduce', q: 'Chọn 2 manh mối cho thấy cậu Nhà KHÔNG phải hung thủ.', opts: ['Góc đâm: tay trái', 'Máu chỉ ở lòng bàn tay, tay áo sạch', 'Cục u sau gáy — bị đánh ngất', 'Cửa sổ có song sắt'], ans: [1, 2], hint: 'Kẻ đâm người thì phải dính máu thế nào? Và cậu ta ngất vì đâu?' },
    { cut: [
      { img: 'scene', o: { place: 'room', blood: true, body: true, nha: true, figs: [['tu', 420, 'smug', 'right'], ['binh', 1180, 'surprised', 'left']], marks: [[800, 300, '!']] }, tr: 'flash', sfx: 'hit', cam: [[800, 420, 1.06], [800, 400, 1.16]], t: 9, say: [
        'tu: Cậu Nhà không phải hung thủ.',
        'binh: Cậu Nhà không phải hung thủ.',
        'Hai người đồng thanh. Người công an trẻ quay sang, nhoẻn miệng cười.',
        'binh[happy]: Chú Tư, thi xem ai tìm ra trước nhé?',
        'tu[smug]: Ta già rồi, nhưng chưa lẩm cẩm đâu.',
      ] },
    ] },
    { cast: ['tu'] },
    { game: 'deduce', q: 'Căn phòng bị “khóa từ bên trong” bằng cách nào?', opts: ['Hung thủ trốn qua cửa sổ', 'Hung thủ vòng sợi chỉ qua núm chốt, ra ngoài rồi luồn chỉ qua khe cửa kéo chốt lại', 'Cậu Nhà tự cài chốt trước khi ngất', 'Hung thủ dùng chìa dự phòng'], ans: 1, hint: 'Vết hằn trên núm chốt và mẩu chỉ ở khe cửa.' },
    { game: 'deduce', q: 'Vậy ai là hung thủ?', opts: ['Khánh sẹo', 'Cô quản lý', 'Cậu Nhà', 'Một khách trọ lạ mặt'], ans: 1, hint: 'Ai thuận tay trái, buộc tóc bằng chỉ đỏ, và dùng thuốc sát trùng màu nâu?' },
    { game: 'deduce', q: 'Chọn 3 manh mối chỉ thẳng tới cô quản lý.', opts: ['Góc đâm: tay trái', 'Lời khai mâu thuẫn của chủ trọ', 'Mẩu chỉ đỏ ở chốt cửa', 'Vệt thuốc sát trùng trên cán dao', 'Bụi thạch cao trên vai'], ans: [0, 2, 3] },
    { cut: [
      { img: 'close', o: { k: 'thread' }, tr: 'cut', cam: [[760, 360, 1.1], [760, 360, 1.2]], t: 4, hold: 300, say: ['*Thuận tay trái. Sợi chỉ đỏ buộc tóc.'] },
      { img: 'close', o: { k: 'knife', smear: true }, tr: 'cut', cam: [[600, 440, 1.3], [600, 440, 1.36]], t: 4, hold: 300, say: ['*Thuốc sát trùng màu nâu sáng nay cô dùng để băng cho ta và lão chủ trọ.'] },
      { img: 'scene', o: { place: 'room', blood: true, body: true, nha: true, figs: [['quanly', 800, 'angry', 'down', { tone: 'sil', op: .85 }]], spot: [800, 420, .5] }, tr: 'black', cam: [[800, 420, 1.1], [800, 400, 1.2]], t: 9, say: [
        '*Cô ta đã quay lại. Cô ta biết cậu Nhà sẽ về lúc năm giờ, đánh ngất cậu ta, giết lão chủ trọ ngay bên cạnh — dựng thành một vụ xô xát giữa hai bố con.',
      ] },
    ] },
    'Người công an trẻ vẫn đang cúi xuống, chăm chú nhìn mẩu chỉ đỏ.',
    '*Ta nhanh hơn một bước.',
    { go: 'c1_end' },
  ],

  c1_end: [
    { bg: 'inn_lobby', o: { night: true }, cast: ['quanly'] },
    { music: 'sad' },
    { cut: [
      { img: 'scene', o: { place: 'lobby', night: true, figs: [['quanly', 1340, 'scared', 'left'], ['tu', 760, 'neutral', 'right', { tone: 'cold' }]] }, cam: [[1200, 420, 1.3], [1000, 420, 1.1]], t: 9, say: [
        'Ông Tư tìm thấy cô quản lý ở cửa sảnh tầng một, tay xách một chiếc túi vải. Cô đứng sững lại khi thấy ông.',
        'tu: Tại sao cô lại làm vậy?',
        'Im lặng rất lâu. Rồi cô cười — một nụ cười mệt mỏi.',
      ] },
    ] },
    { cast: ['tu', 'quanly'] },
    'quanly[sad]: Cháu là người nhập cư trái phép, chú ạ. Lão không trả lương, cháu cũng chẳng dám báo công an.',
    'quanly[angry]: Cháu căm thù lão. Cả thằng con lão nữa — nó lợi dụng cháu, hết lần này tới lần khác.',
    'quanly[cry]: Chỉ khi hai kẻ đó chết đi thì cháu mới được giải thoát. Nhưng cháu cũng không muốn vì chúng mà thành tử tù.',
    'quanly[smug]: Nên cháu sắp xếp để thằng con giết ông bố. Đánh ngất nó, giết lão ngay cạnh đó... Một vụ xô xát giữa hai bố con. Ai mà nghi ngờ chứ.',
    { choice: [
      { t: '“Ta hiểu được ước muốn của cô.”' },
      { t: '“Giết người thì không có lý do nào là đủ.”', steps: ['tu: Giết người thì không có lý do nào là đủ cả.', 'quanly: Cháu biết. Nhưng chú sẽ không hiểu được đâu.', 'tu: ...Không. Có lẽ ta hiểu.'] },
    ] },
    'tu[sad]: Ta hiểu được ước muốn một cuộc sống bình yên của cô. Ta cũng đã từng mong một cuộc sống như thế.',
    'tu: Ta sẽ không bắt cô. Nhưng không có nghĩa là pháp luật thì không.',
    'tu: Giờ có muốn làm lại thì cũng muộn rồi. Kế hoạch của cô chỉ lừa được người bình thường thôi. Với những người công an tài giỏi, bị phát hiện chỉ là chuyện sớm muộn.',
    'tu: Chắc giờ này cậu công an kia cũng đã nhận ra cô là thủ phạm rồi.',
    { cast: [] },
    { cut: [
      { img: 'hands', cam: [[860, 470, 1.02], [790, 460, 1.24]], t: 14, say: [
        'Ông đưa tay ra.',
        'tu[smile]: Nhưng mà ta có thể giúp cô. Người tốt như cô xứng đáng được hưởng bình yên.',
        'Cô quản lý nhìn bàn tay ấy rất lâu. Rồi cô nắm lấy.',
        '*Bàn tay ông lạnh một cách lạ thường.',
      ] },
      { img: 'upwindow', tr: 'black', cam: [[1060, 280, 1.32], [470, 620, 1.16]], t: 11, say: [
        'Ở tầng trên, người công an trẻ vẫn đang cúi xuống, chăm chú nhìn mẩu chỉ đỏ.',
      ] },
    ] },
    { unlock: 'c2' },
    { go: 'c2_start' },
  ],
});
