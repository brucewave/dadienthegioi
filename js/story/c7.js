'use strict';
/* =================== CHƯƠNG 7: ĐOẠN KẾT MỚI =================== */
Object.assign(SCENES, {
  c7_start: [
    { chap: 'Chương 7', title: 'Đoạn kết mới', pov: 'lieng' },
    { bg: 'inn_room', cast: ['mong'] },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, lying: 'thach', lyingX: 700, figs: [['mong', 980, 'cry', 'left'], ['lieng', 1350, 'sad', 'left']] }, cam: [[800, 600, 1.34], [900, 460, 1.08]], t: 12, say: [
        'Tôi sực nhớ ra tên mình vừa buông. Quay lại — nhưng hắn không hề có ý tấn công tôi.',
        'Hắn chạy tới, ôm lấy xác đồng đội.',
        'mong[cry]: Thạch... Thạch ơi...',
      ] },
    ] },
    'mong: (ngẩng lên) Sếp đâu? Ông Trưởng đâu rồi?!',
    '*Tôi chưa thể để hắn thả ông Trưởng ra. Chưa thể tin ai cả.',
    { choice: [
      { t: '“Tôi sẽ không nói cho anh biết.”' },
      { t: 'Im lặng' },
    ] },
    { bg: 'inn_room', o: { smoke: true } },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, smoke: true, figs: [['mong', 900, 'scared', 'up'], ['lieng', 600, 'scared', 'up']], marks: [[1460, 260, '!!']] }, tr: 'cut', cam: [[1460, 320, 1.4], [900, 420, 1.08]], t: 9, say: [
        'Đúng lúc đó, tôi thấy những làn khói lạ tràn vào từ khe hở phía trên cửa.',
        '*Tên điên đó đốt cả cái nhà trọ này rồi!',
      ] },
    ] },
    'Theo phản xạ, tên trùm mũ lao tới định phá cửa.',
    { go: 'c7_fire' },
  ],

  c7_fire: [
    { bg: 'fire', o: { fire: true }, cast: ['mong'] },
    { choice: [
      { t: 'Ngăn hắn lại', steps: [
        'lieng: Dừng lại! Cửa bằng kim loại, nóng lắm, anh sẽ bị bỏng! Mà phá ra thì lửa còn bén vào nhanh hơn!',
        'mong[angry]: Vậy mày tính chết cháy ở đây à?!',
      ] },
      { t: 'Để hắn phá cửa', steps: [
        { fx: 'redflash' },
        'mong[hurt]: AAAA!',
        'Hắn vừa chạm vào tay nắm đã giật tay lại, lòng bàn tay phồng rộp.',
        'lieng: Cửa bằng kim loại! Mà có phá được, lửa ngoài hành lang cũng sẽ tràn vào ngay!',
      ] },
    ] },
    '*Trong nhà vệ sinh có một ô cửa kính. Cả bọn phải thoát ra bằng đường đó.',
    'Tôi giật cửa tủ áo, lôi ông Trưởng ra, cắt dây trói.',
    { cast: ['truong', 'mong'] },
    'lieng: Mau lên, đi lối nhà vệ sinh! Phá cửa kính ra là—',
    'truong[angry]: Đứng lại.',
    'truong: Tên thám tử đó có thể đang đứng ngoài đợi chúng ta thoát ra từ đúng chỗ đó. Ra bây giờ là chui vào bẫy.',
    'truong: Nghe lệnh tôi.',
    { game: 'deduce', q: 'Việc đầu tiên cần làm là gì?', opts: ['Phá cửa kính nhà vệ sinh ngay', 'Dùng vải ướt bịt kín khe hở trên cửa để chặn khói', 'Mở cửa chính ra xem tình hình'], ans: 1, hint: 'Khói giết người nhanh hơn lửa.' },
    { cut: [
      { img: 'scene', o: { place: 'room', day: true, smoke: true, figs: [['lieng', 1300, 'angry', 'right'], ['mong', 1060, 'angry', 'right'], ['truong', 520, 'think', 'right']] }, cam: [[1200, 460, 1.2], [800, 440, 1.06]], t: 10, say: [
        'Tôi và tên trùm mũ nhúng ga giường vào nước, chèn kín khe cửa. Ông Trưởng gọi 114, rồi lôi hết đồ đạc dễ cháy dồn vào một góc xa cửa.',
      ] },
    ] },
    'truong: Lửa sẽ cần khoảng mười phút để bắt vào đồ đạc trong này.',
    'lieng: Cứu hỏa tới đây cũng phải mất hai mươi phút. Như vậy chúng ta chết từ lâu rồi.',
    'Ông không trả lời. Ông kéo cả bọn vào nhà vệ sinh, mở hé cửa sổ, xả nước ướt đẫm lên tường.',
    '*Việc này thì có ích gì? Chưa kịp chết cháy, chúng tôi đã chết ngạt rồi.',
    { bg: 'fire', o: { fire: true, smoke: true } },
    { big: 'Mười phút sau', auto: 1500 },
    'Khói bắt đầu len vào tới đây. Tôi ho sặc sụa.',
    { go: 'c7_trust' },
  ],

  c7_trust: [
    { bg: 'fire', o: { fire: true, smoke: true }, cast: ['truong'] },
    'lieng: Tôi sẽ liều ra ngoài trước. Có thể hắn đã tính tới cả tình huống này rồi, nhưng không liều thì chết hết!',
    'truong[smug]: Có lẽ toàn bộ chuyện này đã nằm trong tính toán của hắn. Nhưng có một điều hắn chưa tính tới. Tin tôi.',
    { choice: [
      { t: 'Liều nhảy ra ngay', go: 'c7_bad' },
      { t: 'Tin ông Trưởng, chờ thêm', steps: [] },
    ] },
    { wait: 800 },
    'Đúng ba mươi giây sau.',
    { cut: [
      { img: 'street', o: { time: 'night', fire: true }, cam: [[720, 320, 1.3], [520, 560, 1.1]], t: 9, say: [
        'Tiếng còi xe cảnh sát vang lên ở đầu hẻm. Cùng lúc đó là tiếng một chiếc ô tô rú ga rời khỏi nhà xe.',
      ] },
    ] },
    '*Hắn đã đứng đợi. Thật sự đã đứng đợi ngoài kia. Và tiếng còi — ông Trưởng gọi 114 không phải để chờ cứu hỏa. Mà là để gọi cả công an tới, đuổi hắn đi.',
    'truong[angry]: Ngay bây giờ!',
    { game: 'timed', title: 'Thoát ra!', maxMiss: 1, intro: 'Phá cửa kính!', fail: 'Sặc khói! Cố lên!', rounds: [
      { tell: 'Cửa kính nhà vệ sinh!', opts: ['Đạp vỡ kính', 'Mở chốt', 'Đập bằng tay'], ans: 0, time: 2, ok: 'XOẢNG!' },
      { tell: 'Nhảy xuống mái hiên!', opts: ['↓ Nhảy', '↑ Leo lên', '← Bám tường'], ans: 0, time: 1.8, ok: 'Tiếp đất!' },
      { tell: 'Đỡ từng người xuống!', opts: ['Dang tay đỡ', 'Chạy trước'], ans: 0, time: 2, ok: 'Cả bọn đều an toàn!' },
    ] },
    { go: 'c7_out' },
  ],

  c7_bad: [
    'Tôi đạp vỡ cửa kính, nhảy ra ngoài.',
    { bg: 'street_night', o: { smoke: true }, cast: ['cuong'] },
    'Chân tôi vừa chạm đất, một bàn tay to như cái kìm đã bóp lấy cổ tôi.',
    'cuong[smug]: Đã bảo rồi mà. Cậu nên bỏ qua vụ này.',
    { fx: 'redflash' },
    { end: 'Con mồi', text: 'Mọi lối thoát đều đã nằm trong tính toán của hắn. Đôi khi, điều duy nhất có thể làm là tin vào một người khác.', kind: 'bad', retry: 'c7_trust' },
  ],

  c7_out: [
    { bg: 'street_night', o: { smoke: true }, cast: ['truong', 'mong'] },
    'Cả bọn thoát ra ngoài, ho sặc sụa. Nhưng tạm thời thì đã an toàn.',
    '*Tôi vẫn không tin hai người này. Nhưng ít nhất lúc này chúng tôi có chung một kẻ thù. Gạt mọi thứ sang một bên đã.',
    'truong: Cậu Liễng. Tới đây thôi. Đừng can thiệp vào chuyện này nữa.',
    'mong: Sếp nói đúng. Mày không biết mình đang dính vào cái gì đâu.',
    'lieng[angry]: Không. Giờ tôi cũng là người liên quan rồi. Tên đó đã giết bạn tôi, và suýt nữa giết cả tôi.',
    '*Ông bác và cậu Vẻ... không thấy đâu cả. Chắc đã chạy trước khi lửa bén. Mong là vậy.',
    'Để tránh làm to chuyện với những người vừa tới, chúng tôi lên xe, vừa đi vừa nói.',
    { bg: 'car', cast: ['truong'] },
    { cut: [
      { img: 'scene', o: { place: 'car', figs: [['truong', 1200, 'sad', 'up', { h: 540, y: 790 }], ['lieng', 400, 'think', 'up', { h: 520, y: 790 }]] }, cam: [[800, 360, 1.04], [800, 420, 1.14]], t: 10, say: [
        'Sau một hồi im lặng rất lâu, ông Trưởng cuối cùng cũng mở lời.',
      ] },
    ] },
    { music: 'mystery' },
    'truong: Cậu muốn biết từ đâu?',
    'lieng: Tất cả mọi thứ.',
    { go: 'c7_history' },
  ],

  c7_history: [
    { date: 'Ngày 1 tháng 12 năm 2025' },
    { bg: 'void', cast: ['truong'] },
    { cut: [
      { img: 'fight', o: { kind: 'duel', a: 'truong', b: 'x', pa: 'stance', pb: 'block', place: 'night' }, cam: [[800, 420, 1.12], [800, 460, 1.02]], t: 16, mem: 'tháng 12 · 2025 · lời ông Trưởng', say: [
        'truong[sad]: Khi ấy chúng tôi đang truy bắt một kẻ sát nhân hàng loạt. Chúng tôi không có chút thông tin gì về hắn — kể cả cái tên. Chúng tôi gọi hắn là X.',
        'truong: Chúng tôi theo vụ này nhiều năm, cho tới khi tìm được một người có liên quan tới hắn. Là ông bác.',
        'truong: Rồi chúng tôi hiểu ra quy luật: hắn giết những người biết về hắn. Hắn đang cố xóa sạch mọi người biết danh tính của mình.',
        'truong: Chúng tôi đã dồn được hắn vào đường cùng. Và rồi... một chuyện đã xảy ra.',
      ] },
      { img: 'close', o: { k: 'flat' }, tr: 'glitch', mem: '1/12/2025 · lời ông Trưởng', cam: [[820, 380, 1.04], [820, 400, 1.24]], t: 16, say: [
        'truong: Cơ thể hắn biến mất. Nó in lên một mặt phẳng giữa không trung — như một bức ảnh dán vào không khí.',
        'truong: Người ta đưa ra giả thuyết về thứ gọi là thế giới hai chiều. Chúng ta có thể dễ dàng hình dung hai chiều là như thế nào. Nhưng hai chiều tồn tại ra sao thì không ai tưởng tượng nổi.',
      ] },
    ] },
    { date: 'Ngày 1 tháng 1 năm 2026' },
    { bg: 'collapse', cast: [] },
    { cut: [
      { img: 'boundary', cam: [[800, 470, 1.4], [800, 450, 1.02]], t: 18, say: [
        'truong: Trong khi mọi người còn đang nghiên cứu, từ điểm X biến mất, không gian giãn nở ra rất nhanh. Nó cuốn gần tám trăm nghìn người ở quận Tân Bình vào trong.',
        'truong: Vùng không gian đó ngăn mọi người đi ra ngoài. Và nó vẫn đang lan ra — chậm hơn, nhưng vẫn lan.',
        'truong: Những người bên trong bị thay đổi ký ức. Mọi thứ không tồn tại trong vùng này bị xóa khỏi nhận thức của họ. Họ sống tiếp với thân phận cũ, nhưng ký ức mới.',
      ] },
    ] },
    { fx: 'glitch' },
    '*...Voi là gì cơ?',
    { cast: ['truong'] },
    'truong: Chỉ trừ một số người vẫn giữ được nhận thức: tôi, ba người trong căn nhà hôm trước, và... cậu bạn của cậu.',
    'truong: Họ không mất ký ức, mà trở thành dị nhân có khả năng đặc biệt — giống như X.',
    'truong: Tôi là người duy nhất có thể tự do đi qua vùng giao thoa giữa hai nơi. Còn ông bác... có khả năng tạo ra con mèo kia, thứ cảm nhận được mọi người có năng lực đặc biệt trong vùng này.',
    'truong: Nhờ ông ấy mà tôi tìm được mọi người.',
    { date: 'Ngày 27 tháng 3 năm 2026' },
    { bg: 'car', cast: ['truong'] },
    'truong: Chúng tôi tìm được X. Đã xảy ra xung đột. Hắn thoát được, không rõ tung tích. Sau đó ông bác cũng biến mất.',
    'truong: Mãi tới gần đây, tôi mới gặp lại ông ấy — ở nhà cậu bạn của cậu. Rồi mọi chuyện thành ra như bây giờ.',
    'truong: Tôi không hiểu sao cậu ta lại giấu ông bác đi. Cậu ta chưa từng nói với tôi.',
    'truong: Chúng tôi phải giết X, càng nhanh càng tốt. Trước khi vùng này nuốt thêm người.',
    { clue: { id: 'c7_vung', name: 'Vùng không gian Tân Bình', desc: 'Từ 1/1/2026, một vùng không gian nuốt ~800.000 người, thay đổi ký ức họ, và vẫn đang lan ra. Nguồn gốc: X.' } },
    { go: 'c7_ability' },
  ],

  c7_ability: [
    { big: 'Hiện tại', auto: 1200 },
    { bg: 'car', cast: ['truong', 'mong'] },
    '*Câu chuyện quá kỳ quặc. Nhưng không hiểu sao, tôi thấy nó đáng tin.',
    'lieng: Năng lực của anh là gì?',
    'mong: Tôi chạm vào ai, người đó ngất. Và bị kéo về khoảnh khắc họ hối hận nhất.',
    '*...Thì ra là vậy.',
    'mong: Tên gác cổng — Cường — có năng lực tăng cường thể chất. Đó là lý do hắn bẻ cổ Thạch dễ như bẻ que.',
    'lieng: Nếu X có thể biến thành Cường rồi tập kích, hay biến thành ông Trưởng để đi ra ngoài thì sẽ rất khó đối phó.',
    '*Khoan đã.',
    'lieng: Lần đụng độ trước với X, hắn có biến thành Cường không?',
    'truong: Không. Lần đó hắn chỉ dùng bộ dạng của chính hắn.',
    '*Hắn nói hắn “có thể biến thành người ngoài hành tinh để dùng năng lực của chúng”. Nhưng hắn đã không làm thế khi bị dồn vào đường cùng...',
    'lieng: Hắn nói dối về năng lực của mình. Chúng ta về trụ sở. Tôi cần xem lại hồ sơ.',
    { go: 'c7_files' },
  ],

  c7_files: [
    { bg: 'station', cast: [] },
    { game: 'world', title: 'Hồ sơ vụ án — trụ sở công an', player: 'lieng', at: [5, 10], dir: 'up', hint: 'Lục lại hồ sơ trên các bàn làm việc, hỏi Mộng về trận đấu.', done: 'Suy luận →',
      objs: [
        { id: 'missing', at: [3.75, 5.1], label: 'Hồ sơ người mất tích', prop: { k: 'files', x: 2.4, y: 3.3, w: 1.2, h: .9 }, on: [
          'Một tập hồ sơ người mất tích, đề ngày 16 tháng 10. Tên: Nguyễn Văn Tư. Nghề nghiệp: thám tử tư.',
          'Ảnh đính kèm: một người đàn ông trung niên, không mũ, không râu.',
          '*Thêm cái mũ phớt, thêm bộ ria... thì giống hệt.',
          '*Ông thám tử Tư mất tích hai ngày TRƯỚC khi tới nhà trọ.',
        ], clue: { id: 'c7_tu', name: 'Ông Tư thật đã mất tích', desc: 'Thám tử Tư được báo mất tích ngày 16/10 — hai ngày trước khi “ông Tư” xuất hiện ở nhà trọ.' } },
        { id: 'cuong', at: [9.75, 5.1], label: 'Biên bản: Cường', prop: { k: 'files', x: 8.4, y: 3.3, w: 1.2, h: .9 }, on: [
          'Biên bản khám nghiệm: Cường, chết vì gãy cổ. Thời điểm tử vong: đêm 22/10.',
          '*Cùng đêm đó, “Cường” xuất hiện bên trong nhà để cứu tôi. Trong khi Cường thật nằm ngoài cổng.',
          '*Không phải tôi giết hắn. X đã giết hắn ở bụi cây — rồi biến thành hắn.',
        ], clue: { id: 'c7_cuong', name: 'Cường chết trước khi “xuất hiện”', desc: 'Cường thật đã chết ngoài cổng đêm 22/10 trước khi “Cường” vào nhà cứu Liễng.' } },
        { id: 'khanh', at: [3.75, 9.5], label: 'Vụ Khánh sẹo', key: false, on: [
          'Khánh sẹo chết tại nhà riêng, cùng đêm với Cường. Không rõ hung thủ.',
          '*Một người nữa từng chạm mặt “ông Tư”...',
        ] },
      ],
      npcs: [
        { c: 'mong', at: [15.6, 6], dir: 'left', key: true, label: 'Hỏi Mộng', on: [
          'mong: X biến thành Cường đúng lúc đánh nhau với Thạch. Trước đó hắn chưa từng dùng bộ dạng đó.',
          '*Vì trước đêm 22/10, Cường vẫn còn sống.',
        ] },
        { c: 'truong', at: [13, 9.6], dir: 'up', on: ['truong: Tìm được gì thì nói. Thời gian không còn nhiều đâu.'] },
      ] },
    { cut: [
      { img: 'close', o: { k: 'file', who: false, lines: ['Họ tên: Nguyễn Văn Tư', 'Nghề nghiệp: thám tử tư', 'Ngày báo mất tích: 16/10/2026', 'Đặc điểm: không râu, không đội mũ'] }, tr: 'shutter', cam: [[800, 400, 1.04], [700, 360, 1.2]], t: 8, say: [
        '*Mất tích ngày 16/10. Hai ngày sau, “ông Tư” bước vào nhà trọ.',
      ] },
    ] },
    { game: 'deduce', q: 'Năng lực thật sự của X là gì?', opts: ['Biến thành bất kỳ ai hắn muốn', 'Biến thành người ngoài hành tinh để dùng năng lực của chúng', 'Chỉ biến thành được những người mà chính hắn đã giết', 'Xóa ký ức người khác'], ans: 2, hint: 'Ông Tư mất tích trước. Cường chết trước. Lần đụng độ đầu tiên hắn không biến thành Cường...' },
    'lieng: Hắn không chỉ biến thành những người có năng lực đặc biệt. Rất có thể hắn chỉ biến được thành những người mà chính hắn đã giết.',
    { cast: ['truong', 'mong'] },
    'truong: ...Vậy “ông Tư” mà cậu gặp ở nhà trọ...',
    'lieng: Ngay từ đầu đã là X.',
    'Ông Trưởng ngồi phịch xuống ghế.',
    'lieng: Còn một chuyện. Anh có thể đánh thức cậu Vẻ không? Không có nó thì không tìm được X đâu.',
    'mong: Xin lỗi, nhưng tôi không thể làm vậy. Năng lực của tôi chỉ có tác dụng một chiều. Còn tỉnh lại lúc nào thì phải đợi con mèo đó thôi.',
    '*Cậu Vẻ, ông bác... hai người đang ở đâu?',
    { unlock: 'c8' },
    { go: 'c8_start' },
  ],
});
