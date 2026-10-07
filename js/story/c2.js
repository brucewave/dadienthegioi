'use strict';
/* =================== CHƯƠNG 2: ANH CÔNG AN LIỄNG =================== */
const C2MEM = '07:00 sáng · trí nhớ của Bình';
Object.assign(SCENES, {
  c2_start: [
    { chap: 'Chương 2', title: 'Anh công an Liễng', pov: 'lieng' },
    { date: 'Ngày 20 tháng 10 năm 2026' },
    { bg: 'street_night', cast: [] },
    { cut: [
      { img: 'flowers', cam: [[800, 330, 1.22], [1060, 470, 1.12]], t: 16, say: [
        'Hôm nay là ngày Phụ nữ Việt Nam. Người ta đổ ra đường mua hoa, còn tôi thì lại đang trên đường tới dự một đám tang.',
        'Cậu ấy, giống tôi, là một tân binh công an. Thế nhưng dù có chung một điểm xuất phát, hai chúng tôi lại đi hai con đường khác hẳn nhau.',
        'Cậu ấy sớm bộc lộ năng lực xuất sắc, là người trẻ tuổi nhất trong lịch sử được vào Đội Điều tra trọng án.',
        'Còn tôi chỉ là một kẻ bình thường. Nếu không đứng cạnh cậu ta, tôi cũng được xếp vào hàng tân binh tài năng nhất khóa. Nhưng đặt cạnh một thiên tài, thứ tài năng của tôi chẳng khác gì một trò cười.',
      ] },
    ] },
    { go: 'c2_academy' },
  ],

  c2_academy: [
    { date: 'Ngày 15 tháng 2 năm 2026' },
    { bg: 'academy', cast: ['binh'] },
    { cut: [
      { img: 'scene', o: { place: 'classroom', figs: [['binh', 1100, 'smile', 'left'], ['lieng', 560, 'neutral', 'right']] }, cam: [[850, 300, 1.2], [820, 440, 1.05]], t: 12, say: [
        'Lần đầu tôi gặp cậu ta là ở Học viện Công an. Một học viên được đích thân ông Trưởng công an chuyển tới — vào giữa năm cuối.',
        'Nực cười ở chỗ cậu ta chẳng có chút kiến thức nào. Hỏi gì cũng không biết. Tôi tự hỏi tại sao một kẻ như vậy lại được chuyển tới đây, lại còn xếp chung lớp với tôi.',
        'binh[smile]: Này... cậu là Liễng đúng không? Mọi người bảo cậu giỏi nhất lớp.',
        'binh: Bài giảng lúc nãy tớ không hiểu chỗ “nguyên tắc bảo vệ hiện trường”. Cậu giảng lại cho tớ được không?',
      ] },
    ] },
    { choice: [
      { t: '“Tự đi mà đọc giáo trình.”', steps: [
        'lieng: Tự đi mà đọc giáo trình.',
        'binh[cry]: Tớ đọc rồi! Ba lần rồi! Nhưng nó cứ ghi “theo trình tự quy định” mà không nói trình tự là gì cả...',
        'Cậu ta nhìn tôi bằng ánh mắt của một con cún bị bỏ rơi. Tôi thở dài.',
      ] },
      { t: '“Được. Ngồi xuống đi.”' },
    ] },
    { cut: [
      { img: 'scene', o: { place: 'classroom', figs: [['lieng', 640, 'neutral', 'right'], ['binh', 960, 'happy', 'left']] }, cam: [[850, 220, 1.5], [800, 420, 1.12]], t: 12, say: [
        'lieng: Nghe cho kỹ. Đầu tiên là phong tỏa hiện trường. Sau đó mới đeo găng, đánh dấu vị trí thi thể, rồi thu giữ tang vật. Sai thứ tự là hỏng hết.',
        'binh[happy]: Phong tỏa — găng — đánh dấu — tang vật. Hiểu rồi! Cảm ơn cậu nhiều nha!',
        'Chẳng bao lâu sau, chúng tôi thân hơn. Tên này kiến thức hơi thiếu, nhưng lại rất ham học, và việc mình không biết cũng chẳng làm cậu ta thấy ngại.',
        'binh[happy]: Cậu là người duy nhất chịu nói chuyện với tớ mà không chê tớ ngốc, không chê tớ hỏi nhiều đấy.',
      ] },
    ] },
    'Đúng là thỉnh thoảng cậu ta phiền thật. Nhưng hơn thế, tôi lại thích cái tính không ngại hỏi ấy. Nó làm tôi thấy cậu ta có khả năng bắt kịp tôi hơn bất kỳ tên nào trong lớp — những kẻ dù không biết vẫn giấu dốt vì sĩ diện.',
    '*Biết đâu một ngày nào đó cậu ta sẽ thành cộng sự đắc lực của mình. Như Holmes và Watson vậy.',
    { go: 'c2_memoryflash' },
  ],

  c2_memoryflash: [
    { big: 'Hồi ức — Trang sách', auto: 1800 },
    { bg: 'academy', cast: ['binh', 'lieng'] },
    { cut: [
      { img: 'scene', o: { place: 'classroom', figs: [['binh', 700, 'think', 'down'], ['lieng', 1000, 'surprised', 'left']] }, cam: [[820, 520, 1.3], [820, 460, 1.14]], t: 8, say: [
        'Có một lần, trước giờ kiểm tra, cậu ta mượn cuốn giáo trình của tôi. Lật qua đúng một trang, rồi trả lại.',
        'lieng[surprised]: Cậu đọc xong rồi á? Mới có ba giây.',
      ] },
      { img: 'close', o: { k: 'file', who: false, title: 'GIÁO TRÌNH KHÁM NGHIỆM HIỆN TRƯỜNG', lines: ['Điều 14, khoản 2:', 'Khi phát hiện dấu vết, người tiến hành', 'khám nghiệm phải chụp ảnh, vẽ sơ đồ,', 'mô tả và ghi vào biên bản...'], stain: true }, tr: 'shutter', mem: 'trang 87 · trí nhớ của Bình', cam: [[800, 450, 1.02], [900, 600, 1.16]], t: 10, say: [
        'binh: “Điều 14, khoản 2: Khi phát hiện dấu vết, người tiến hành khám nghiệm phải chụp ảnh, vẽ sơ đồ, mô tả...” — còn có vết cà phê ở góc phải, hình hơi giống con mèo.',
        'Tôi giật lại cuốn sách. Từng chữ. Không sai một chữ. Kể cả vết cà phê.',
      ] },
    ] },
    'binh[happy]: Não tớ nó hoàn thiện hình ảnh trong trí nhớ chính xác lắm, không cần tạo ra hình ảnh giả. Chắc cái này gọi là... khả năng đặc biệt nhỉ?',
    'Cậu ta cười hì hì, như thể đó là chuyện bình thường nhất trên đời.',
    { clue: { id: 'c2_trinho', name: 'Trí nhớ của Bình', desc: 'Bình chỉ cần nhìn qua một lần là nhớ chính xác mọi chi tiết, như chụp ảnh.' } },
    { go: 'c2_grad' },
  ],

  /* ---------- Vụ huy hiệu Thủ khoa: hai người cùng đi, Bình chỉ ra những gì Liễng không thấy ---------- */
  c2_grad: [
    { date: 'Ngày 30 tháng 6 năm 2026' },
    { bg: 'auditorium', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'stage', case: 'closed', win: 'closed', mic: true, crowd: true, figs: [['binh', 520, 'happy', 'right'], ['lieng', 1080, 'smile', 'left']] }, cam: [[800, 300, 1.3], [800, 430, 1.05]], t: 14, say: [
        'Cậu ta tiến bộ dần theo thời gian. Thật ra về kiến thức, cậu ta học còn nhanh hơn tôi. Chỉ có thực hành là dở tệ. Gần bốn tháng tôi kèm cặp, cậu ta đã đủ sức tốt nghiệp.',
        'Bảy giờ sáng ngày lễ tốt nghiệp, cả khóa tập dượt trên sân khấu. Huy hiệu Thủ khoa nằm trong hộp kính dưới ánh đèn — huy hiệu của tôi.',
        'binh[happy]: Lấp lánh ghê! Lát nữa cậu đeo lên chắc oai lắm.',
      ] },
      { img: 'scene', o: { place: 'stage', case: 'empty', win: 'open', feather: true, figs: [['lieng', 560, 'surprised', 'right'], ['giamthi', 1080, 'scared', 'left']], marks: [[800, 330, '!?']] }, tr: 'flash', sfx: 'hit', cam: [[800, 420, 1.2], [800, 420, 1.06]], t: 10, say: [
        'Tám giờ ba mươi. Mười lăm phút trước khi khai mạc.',
        'giamthi[scared]: Liễng! Huy hiệu Thủ khoa biến mất rồi! Hộp kính trống trơn!',
        'giamthi: Lát nữa thầy hiệu trưởng lên trao mà không có huy hiệu thì... Em là thủ khoa, lại giỏi điều tra nhất khóa. Em xem giúp thầy!',
      ] },
    ] },
    { cast: ['lieng', 'binh'] },
    'binh: Tớ đi với cậu!',
    '*Không có bột lấy dấu vân tay. Không camera. Không thiết bị. Hàng trăm người ra vào từ sáng. Chỉ còn mười lăm phút.',
    { game: 'world', title: 'Hội trường — Huy hiệu biến mất', player: 'lieng', at: [11, 11], dir: 'up', done: 'Suy luận →',
      hint: 'Bình đi cùng bạn. Tới đâu cậu ấy cũng sẽ nói thêm những gì cậu ấy nhớ được lúc 7 giờ sáng. Đủ điểm quan trọng thì bấm “Suy luận →”.',
      props: [{ k: 'item', x: 5, y: 4, w: .9, h: .6, c: '#C9A27A' }, { k: 'item', x: 17.2, y: 6.6, w: .6, h: .6, c: '#3E78A6' }],
      objs: [
        { id: 'case', at: [11, 4.2], label: 'Hộp kính', on: [
          'Hộp kính không bị cạy. Nắp chỉ khép hờ. Đệm nhung bên trong trống trơn.',
          '*Ai cũng có thể thò tay vào lấy. Chẳng loại trừ được ai cả.',
          'binh[think]: Khoan. Cậu nhìn vết lõm trên đệm nhung đi.',
          { cut: [
            { img: 'close', o: { k: 'cushion', badge: true, tilt: -35 }, tr: 'shutter', mem: C2MEM, cam: [[800, 520, 1.02], [800, 560, 1.12]], t: 8, say: [
              'binh: Lúc bảy giờ, huy hiệu nằm nghiêng hẳn sang trái, đầu nhọn chỉ ra phía khán phòng. Thợ trang trí đặt thế cho “có dáng”.',
            ] },
            { img: 'close', o: { k: 'cushion', tilt: 0, arrow: true }, tr: 'cut', cam: [[800, 560, 1.12], [800, 600, 1.2]], t: 8, say: [
              'binh: Còn vết lõm bây giờ thì thẳng đứng, ngay ngắn. Nghĩa là sau bảy giờ, đã có người nhấc nó ra — rồi đặt lại.',
              'binh: Kẻ trộm thì chẳng ai đặt lại cho ngay ngắn đâu. Người này cầm nó ra, rồi trả về chỗ cũ... ít nhất là một lần.',
            ] },
          ] },
        ], clue: { id: 'c2_dem', name: 'Vết lõm trên đệm nhung', desc: 'Lúc 7:00 huy hiệu nằm nghiêng; giờ vết lõm thẳng đứng — đã có người nhấc ra rồi đặt lại, trước khi nó biến mất.' } },
        { id: 'window', at: [19.2, 2.4], label: 'Cửa sổ', on: [
          'Cửa sổ bên phải sân khấu đang mở toang. Gió lùa vào.',
          '*Sáng nay nó mở hay đóng nhỉ? ...Mình không nhớ.',
          { cut: [
            { img: 'close', o: { k: 'window' }, tr: 'shutter', mem: C2MEM, cam: [[800, 360, 1.1], [800, 300, 1.24]], t: 8, say: [
              'binh: Đóng. Chốt gài xuống hẳn — tớ nhớ vì cái chốt bị dính một vệt sơn trắng, trông như hạt cơm.',
            ] },
            { img: 'close', o: { k: 'window', open: true }, tr: 'cut', cam: [[800, 300, 1.24], [800, 300, 1.3]], t: 6, say: [
              'binh: Chốt kiểu này chỉ gạt được từ bên trong. Gió không mở được, chim cũng không.',
            ] },
          ] },
        ], clue: { id: 'c2_chot', name: 'Chốt cửa sổ mở từ bên trong', desc: 'Lúc 7:00 cửa sổ đóng, chốt gài. Chỉ người ở bên trong hội trường mới mở được.' } },
        { id: 'feather', at: [20.5, 3.1], label: 'Bậu cửa sổ', prop: { k: 'item', x: 20.1, y: 2.4, w: .8, h: .5, c: '#2B1F1A' }, on: [
          'Một chiếc lông vũ đen nằm trên bậu cửa sổ.',
          '*Lông quạ. Ngoài kia có cây bàng... Một con quạ bay vào, quắp lấy thứ lấp lánh rồi bay đi. Đơn giản thôi.',
          'binh[think]: Cậu nhìn kỹ cái cuống lông đi, Liễng.',
          { cut: [
            { img: 'close', o: { k: 'window', open: true, feather: true, cut: true }, tr: 'cut', cam: [[780, 560, 1.4], [700, 560, 1.55]], t: 8, say: [
              'binh: Cuống bị cắt vát, phẳng lì. Đây là vết kéo. Lông chim rụng tự nhiên thì cuống tròn, còn dính chân lông.',
              '*...Mình nhìn thấy nó trước. Nhưng người nhận ra lại là cậu ta.',
            ] },
          ] },
        ], clue: { id: 'c2_long', name: 'Lông vũ bị cắt bằng kéo', desc: 'Chiếc lông đen trên bậu cửa có cuống bị cắt vát — không phải lông chim tự rụng.' } },
        { id: 'tree', at: [17.4, 2.4], label: 'Nhìn ra cây bàng', on: [
          { cut: [
            { img: 'crow', o: { nobadge: true }, mem: C2MEM, tr: 'shutter', cam: [[1060, 420, 1.04], [880, 480, 1.3]], t: 9, say: [
              'binh: Bảy giờ sáng, trên cành bàng thứ ba có cái tổ quạ. Trong tổ có hai cái nắp bút, một chiếc nhẫn nhựa hồng và một chùm chìa khóa.',
            ] },
            { img: 'crow', o: { nobadge: true }, tr: 'cut', cam: [[880, 480, 1.3], [880, 500, 1.4]], t: 7, say: [
              'Bây giờ, con quạ vẫn ngồi đó, nghiêng đầu nhìn vào sân khấu.',
              'binh: Vẫn đúng chừng ấy thứ. Không thêm gì cả. Nếu nó tha huy hiệu đi thì cái huy hiệu phải nằm trong tổ chứ.',
            ] },
          ] },
        ], clue: { id: 'c2_to', name: 'Tổ quạ không có huy hiệu', desc: 'Trong tổ quạ vẫn chỉ có nắp bút, nhẫn nhựa và chùm chìa khóa như lúc 7:00.' } },
        { id: 'basket', at: [5.4, 4.6], label: 'Giỏ đạo cụ chụp ảnh', on: [
          'Giỏ đạo cụ của anh thợ ảnh: hoa giấy, mũ tốt nghiệp, một chiếc quạt lông đen để học viên cầm tạo dáng.',
          { cut: [
            { img: 'close', o: { k: 'fan', n: 12, count: true }, tr: 'shutter', mem: C2MEM, cam: [[900, 420, 1.04], [900, 380, 1.14]], t: 8, say: [
              'binh: Lúc bảy giờ cái quạt này có mười hai chiếc lông. Tớ đếm rồi — tớ hay đếm linh tinh mà.',
            ] },
            { img: 'close', o: { k: 'fan', n: 11, count: true }, tr: 'cut', cam: [[900, 380, 1.14], [1000, 360, 1.3]], t: 7, say: [
              'binh: Giờ còn mười một.',
              '*Một chiếc lông bị cắt khỏi quạt... và nằm trên bậu cửa sổ.',
            ] },
          ] },
        ], clue: { id: 'c2_quat', name: 'Quạt lông thiếu một chiếc', desc: 'Lúc 7:00 quạt lông đạo cụ của thợ ảnh có 12 chiếc; giờ chỉ còn 11.' } },
      ],
      npcs: [
        { c: 'binh', at: [10, 11.6], dir: 'up', follow: true, on: [
          'binh: Tớ nhớ được mọi thứ lúc bảy giờ sáng — như ảnh chụp vậy. Cậu cứ đi xem, tới đâu tớ nói tới đó.',
          'binh: Nhưng nghĩ ra điều gì từ mấy tấm ảnh ấy thì phải nhờ cậu đấy. Cậu là thủ khoa mà!',
        ] },
        { c: 'giamthi', at: [14, 6], dir: 'left', key: true, on: [
          'giamthi: Nhanh lên em! Mười lăm phút nữa là khai mạc rồi!',
          'giamthi: Sáng nay ai lên sân khấu à? Để thầy nhớ... Bảy rưỡi anh thợ ảnh mở hộp kính chụp ảnh kỷ yếu. Tám giờ em Hùng lên thử micro. Tám giờ mười lăm bác lao công lau sàn. Tám rưỡi thì thầy phát hiện mất.',
          { clue: { id: 'c2_moc', name: 'Mốc thời gian buổi sáng', desc: '7:30 thợ ảnh mở hộp kính · 8:00 Hùng thử micro · 8:15 lao công lau sân khấu · 8:30 phát hiện mất.' } },
        ] },
        { c: 'thoanh', at: [4.2, 6.4], dir: 'right', key: true, on: [
          'thoanh: Tôi á? Bảy rưỡi tôi mở hộp kính chụp mấy kiểu cho kỷ yếu, năm phút là xong. Tôi chẳng đụng vào cái huy hiệu, chụp qua lớp kính thôi. Xong khép nắp lại rồi đi.',
          'thoanh: Mà các cậu nghi tôi à? Cửa sổ mở toang thế kia, chim chóc bay vào tha đi chứ gì.',
          'binh: Anh cho bọn em xem ảnh anh chụp sáng nay được không ạ?',
          'thoanh: ...Xem thì xem.',
          { cut: [
            { img: 'close', o: { k: 'photo', window: true, time: '07:41' }, tr: 'shutter', cam: [[700, 450, 1.04], [700, 480, 1.18]], t: 10, say: [
              'Tấm cuối cùng, chụp lúc 7 giờ 41. Huy hiệu nằm trên nền gỗ, nắng vàng rực, bóng lá đổ lốm đốm.',
              'binh: Đèn sân khấu tắt cả buổi sáng. Trong hộp kính lấy đâu ra nắng với bóng lá bàng? Tấm này chụp trên bậu cửa sổ.',
              'binh: Anh bảo không đụng vào huy hiệu, nhưng anh đã mang nó ra tận cửa sổ để chụp.',
            ] },
          ] },
          'thoanh[scared]: Thì... thì nắng chỗ đó đẹp... Tôi chụp xong là trả lại ngay!',
        ], clue: { id: 'c2_anh', name: 'Ảnh chụp lúc 7:41', desc: 'Huy hiệu được chụp trên bậu cửa sổ đầy nắng — trái với lời khai “chỉ chụp qua lớp kính” của thợ ảnh.' } },
        { c: 'hung', at: [15.6, 8.4], dir: 'left', key: true, on: [
          'Hùng — á khoa, xếp ngay sau tôi. Cả khóa ai cũng biết cậu ta ghét tôi ra mặt.',
          'hung[angry]: Nhìn gì? Nghi tao lấy huy hiệu của mày à?',
          { cut: [
            { img: 'close', o: { k: 'pocket' }, tr: 'cut', cam: [[800, 460, 1.2], [800, 460, 1.34]], t: 6, say: [
              'Trong túi áo ngực của cậu ta có thứ gì đó ánh bạc.',
              '*Bắt được rồi.',
            ] },
          ] },
          'binh: Khoan đã, Liễng.',
          'binh: Huy hiệu Thủ khoa to bằng nửa bàn tay, có góc nhọn. Túi áo cậu ấy chỉ cộm một hình tròn nhỏ.',
          { cut: [
            { img: 'close', o: { k: 'pocket', reveal: true }, tr: 'cut', cam: [[800, 600, 1.2], [800, 620, 1.3]], t: 7, say: [
              'binh: Là huy chương Á khoa. Sáng nay tớ thấy cậu ấy mân mê nó suốt buổi tập.',
            ] },
          ] },
          'hung: ...Tao định lát lên sân khấu ném trả lại nhà trường đấy. Đứng thứ hai thì có gì mà vui.',
          'hung: Mà nói cho mà biết — tám giờ tao lên thử micro thì cửa sổ đã mở toang rồi. Gió thổi bay cả giấy phát biểu của tao.',
        ], clue: { id: 'c2_hung', name: 'Lời khai của Hùng', desc: 'Lúc 8:00 cửa sổ đã mở toang. Thứ ánh bạc trong túi Hùng là huy chương Á khoa của cậu ta.' } },
        { c: 'laocong', at: [17.6, 6.4], dir: 'left', key: true, on: [
          'laocong: Tám giờ mười lăm tôi lau sân khấu. Lúc đó hộp kính trống trơn rồi đấy cậu ạ, tôi còn tưởng nhà trường chưa bày ra.',
          'laocong: À, lúc gần tám giờ tôi quét lá ngoài sân, nghe dưới máng xối chỗ cửa sổ kêu “keng” một cái. Tôi tưởng quả bàng rụng.',
          'binh[think]: “Keng”... Quả bàng rơi xuống máng tôn thì kêu “bộp” chứ ạ.',
        ], clue: { id: 'c2_keng', name: 'Tiếng “keng” dưới máng xối', desc: 'Gần 8:00, bác lao công nghe tiếng kim loại rơi “keng” ở máng xối ngay dưới cửa sổ.' } },
      ] },
    { cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'stage', case: 'empty', win: 'open', lit: false, figs: [['lieng', 640, 'think', 'right'], ['binh', 960, 'think', 'left']], spot: [800, 470, .55] }, cam: [[800, 420, 1.1], [800, 400, 1.24]], t: 10, say: [
        '*Không có dấu vân tay. Không có camera. Hàng trăm người ra vào... Nhưng giờ thì có những tấm ảnh trong đầu cậu ta.',
        'binh: Mình xếp lại từ đầu nhé, Liễng. Cậu hỏi, tớ trả lời.',
      ] },
    ] },
    { cast: ['lieng', 'binh'] },
    { choice: [
      { t: 'Báo cáo thầy: không đủ thiết bị, không thể điều tra', steps: ['lieng: Thưa thầy, không có thiết bị thì em...', 'binh[surprised]: Đừng mà! Cậu nghĩ được mà, cậu chỉ chưa nhìn thấy thôi. Tớ nhìn hộ cậu!'] },
      { t: 'Cố nghĩ thêm', steps: ['*Nghĩ đi... nghĩ đi... Nhìn những gì cậu ta nhìn thấy.'] },
    ] },
    'lieng: Câu đầu tiên. Con quạ.',
    { game: 'deduce', q: 'Con quạ có lấy huy hiệu không?', opts: ['Có — lông quạ nằm ngay trên bậu cửa sổ', 'Không — tổ quạ không có huy hiệu, còn chiếc lông bị cắt bằng kéo từ quạt đạo cụ', 'Không biết được — quạ có thể giấu ở chỗ khác'], ans: 1, hint: 'Bình nhớ trong tổ có những gì? Và cuống chiếc lông trông thế nào?' },
    'binh[happy]: Đúng! Có người cố tình làm cho mọi người nghĩ là con quạ.',
    'lieng: Câu thứ hai. Ai đã mở cửa sổ?',
    { game: 'deduce', q: 'Chọn 3 manh mối cho biết cửa sổ bị mở lúc nào và bởi ai.', opts: ['Chốt cửa sổ chỉ gạt được từ bên trong', 'Lúc 8:00 cửa sổ đã mở (lời Hùng)', 'Ảnh 7:41 chụp huy hiệu trên bậu cửa sổ', 'Thứ ánh bạc trong túi Hùng', 'Bác lao công lau sân khấu lúc 8:15'], ans: [0, 1, 2], hint: 'Cửa sổ đóng lúc 7:00, mở lúc 8:00. Ai đứng ở bậu cửa sổ trong khoảng đó?' },
    { game: 'deduce', q: 'Vậy ai đã mang huy hiệu ra khỏi hộp kính?', opts: ['Hùng', 'Anh thợ ảnh', 'Bác lao công', 'Thầy giám thị'], ans: 1, hint: 'Ai nói dối rằng mình không đụng vào huy hiệu?' },
    'binh: Nhưng anh ấy đâu có mang theo nó. Nếu lấy trộm thì sao lại phải dựng chuyện con quạ cho mệt?',
    'lieng: ...Vì anh ta không còn giữ nó. Anh ta làm mất nó.',
    { game: 'deduce', q: 'Huy hiệu đang ở đâu?', opts: ['Trong túi anh thợ ảnh', 'Trong tổ quạ', 'Trong máng xối, ngay dưới cửa sổ', 'Hùng đã ném đi'], ans: 2, hint: 'Tiếng “keng” lúc gần 8 giờ...' },
    { cut: [
      { img: 'scene', o: { place: 'yard', nest: true, figs: [['lieng', 380, 'think', 'up'], ['binh', 760, 'happy', 'up']] }, tr: 'black', cam: [[700, 400, 1.04], [680, 520, 1.3]], t: 9, say: [
        'Chúng tôi chạy ra sân, ngay dưới khung cửa sổ.',
        'binh: Bảy giờ sáng lá trong máng nằm đều lắm. Giờ có một chỗ bị xới lên — như có ai thò tay vào mà với không tới.',
      ] },
      { img: 'close', o: { k: 'gutter', badge: true, dig: true }, tr: 'cut', cam: [[800, 480, 1.1], [820, 470, 1.3]], t: 9, say: [
        'Giữa đám lá bàng khô, có thứ gì đó lóe lên dưới nắng.',
        'Huy hiệu Thủ khoa.',
      ] },
      { img: 'scene', o: { place: 'stage', case: 'open', win: 'open', figs: [['thoanh', 800, 'cry', 'down'], ['lieng', 480, 'neutral', 'right'], ['binh', 1120, 'sad', 'left']] }, tr: 'black', cam: [[800, 380, 1.2], [800, 420, 1.08]], t: 14, say: [
        'thoanh[cry]: Tôi chỉ muốn có một tấm thật đẹp cho kỷ yếu... Nắng bên cửa sổ đẹp quá. Tôi mở cửa, đặt nó lên bậu.',
        'thoanh[cry]: Gió lùa, cánh cửa đập vào một cái — nó rơi xuống máng. Tôi với không tới.',
        'thoanh[sad]: Tôi sợ mất việc. Nên tôi cắt một chiếc lông ở quạt, đặt lên bậu cửa... Ai cũng sẽ nghĩ là con quạ.',
      ] },
    ] },
    { cast: ['giamthi'] },
    'giamthi[happy]: Giỏi lắm! Không hổ là thủ khoa!',
    { cut: [
      { img: 'scene', o: { place: 'stage', case: 'closed', win: 'closed', crowd: true, figs: [['lieng', 640, 'sad', 'down'], ['binh', 960, 'happy', 'down']], rays: true }, tr: 'flash', cam: [[800, 420, 1.06], [800, 380, 1.18]], t: 12, say: [
        'Cả trường tung hô hai chúng tôi như hai người hùng. Mọi người nghiêng về chuyện tôi có công lớn hơn — còn cậu ta thật may mắn khi chơi cùng tôi. Dễ hiểu thôi, tôi là thủ khoa mà.',
        'Tôi thừa biết toàn bộ là công của cậu ta. Nhưng tôi lại chẳng đủ can đảm để thừa nhận.',
      ] },
    ] },
    { cast: ['binh'] },
    'binh[happy]: Cảm ơn cậu nhé, Liễng! Nhờ cậu mà tụi mình phá được vụ án! Đây là lần đầu tớ thấy vinh dự cỡ này luôn đó!',
    'Đôi mắt và giọng nói ấy chẳng có chút dối trá nào. Cậu ta thật sự nghĩ rằng chúng tôi đã cùng nhau phá án.',
    'Sự lương thiện của cậu ta càng khiến tôi trông như một trò cười.',
    { go: 'c2_station' },
  ],

  c2_station: [
    { bg: 'station', cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'office', figs: [['binh', 700, 'happy', 'right'], ['truong', 1060, 'smile', 'left'], ['lieng', 300, 'neutral', 'right', { tone: 'cold' }]] }, cam: [[800, 360, 1.04], [700, 420, 1.16]], t: 12, say: [
        'Sau đó chúng tôi cùng về một sở công an. Ở đây mới thực sự là sân chơi của cậu ta.',
        'Dù đều là tân binh, cậu ta liên tục giúp các tiền bối phá án. Người ta còn lầm tưởng cậu ta mới là thủ khoa, chứ không phải tôi. Mỗi lần như vậy, mọi thứ lại gượng gạo vô cùng.',
      ] },
    ] },
    { date: 'Ngày 15 tháng 10 năm 2026' },
    { cast: ['binh'] },
    { cut: [
      { img: 'scene', o: { place: 'office', noDesk: true, figs: [['binh', 960, 'sad', 'left'], ['lieng', 620, 'angry', 'right']] }, cam: [[800, 420, 1.1], [780, 400, 1.22]], t: 10, say: [
        'Chỉ đúng ba tháng sau khi nhận việc, cậu ta được điều vào Đội Điều tra trọng án.',
        'binh[sad]: Liễng... tớ không xứng đâu. Đáng lẽ phải chọn mấy anh tiền bối, hoặc ít nhất là cậu mới đúng...',
      ] },
    ] },
    { choice: [
      { t: '“Im miệng mà nhận lấy vinh dự đó đi.”', steps: ['lieng[angry]: Im miệng mà nhận lấy vinh dự đó đi. Tôi không cần sự thương hại rẻ tiền của cậu.'] },
      { t: '“Cậu nói thế là đang khoe hay đang thương hại tôi?”', steps: ['lieng[angry]: Cậu nói thế là đang khoe, hay đang thương hại tôi? Cả hai tôi đều không cần.'] },
    ] },
    'Khuôn mặt đầy hối lỗi của cậu ta càng làm tôi ghét cậu ta hơn.',
    'Ba ngày sau, cậu ta nhận vụ án đầu tiên. Quan hệ giữa chúng tôi chẳng tốt đẹp gì, vậy mà cậu ta vẫn xin cho tôi đi cùng làm nhiệm vụ.',
    '*Tên khốn đó. Hắn không bao giờ ngừng làm tôi mất mặt.',
    { go: 'c2_inn' },
  ],

  /* Liễng chỉ ở hiện trường lúc đầu: bảo vệ hiện trường xong thì bỏ xuống tầng một */
  c2_inn: [
    { date: 'Ngày 18 tháng 10 năm 2026' },
    { bg: 'inn_hall', o: { night: true }, cast: [] },
    { cut: [
      { img: 'street', o: { time: 'dusk', police: true }, cam: [[820, 420, 1.04], [700, 500, 1.22]], t: 10, say: [
        'Nhà trọ trong hẻm, quận Tân Bình. Một người chết trong căn phòng cài chốt từ bên trong.',
        'Vụ án đầu tiên của cậu ta ở Đội trọng án. Còn tôi là kẻ đi theo.',
      ] },
      { img: 'scene', o: { place: 'hall', night: true, tape: true, figs: [['binh', 640, 'smile', 'right'], ['lieng', 860, 'neutral', 'left'], ['tu', 1200, 'think', 'left']] }, tr: 'black', cam: [[1000, 420, 1.2], [820, 420, 1.06]], t: 11, say: [
        'Ở hành lang tầng hai có một ông già đội mũ phớt — khách phòng bên cạnh. Cậu ta hỏi tên, hỏi số phòng, rồi nói chuyện với ông già lạ hoắc như quen từ lâu.',
        '*Cái tính ấy. Gặp ai cũng sáng mắt lên được.',
      ] },
    ] },
    { cast: ['lieng', 'binh'] },
    'lieng: Tôi vào khoanh vùng hiện trường. Cậu lấy lời khai đi.',
    '*Việc của mình: bảo vệ hiện trường. Làm cho đúng quy trình.',
    { bg: 'inn_room', o: { night: true, lamp: true }, cast: [] },
    { game: 'protect', title: 'Bảo vệ hiện trường phòng 203' },
    { bg: 'inn_hall', o: { night: true }, cast: [] },
    { cut: [
      { img: 'scene', o: { place: 'hall', night: true, open203: true, figs: [['lieng', 1180, 'neutral', 'left'], ['binh', 760, 'happy', 'right'], ['tu', 480, 'neutral', 'right']] }, cam: [[900, 420, 1.12], [960, 420, 1.2]], t: 10, say: [
        'lieng: Phong tỏa, đeo găng, đánh dấu, thu tang vật. Xong cả rồi.',
        'binh[happy]: Cảm ơn cậu! Chú Tư đây từng làm thám tử đấy — chú ấy cũng thấy vụ này có chỗ không khớp. Vào xem cùng tớ nhé? Cái chốt cửa ấy, tớ thấy có vết—',
        '*Thám tử. Một ông già cậu ta mới gặp được mười phút, đã kéo ngay vào hiện trường.',
        '*Còn tôi — người kèm cậu ta suốt bốn tháng — thì đứng ngoài canh cửa.',
      ] },
    ] },
    { cast: ['lieng', 'binh'] },
    { choice: [
      { t: 'Ở lại phá án cùng Bình', steps: [
        '*Tôi muốn nói “Ừ, để tớ xem”.',
        '*Nhưng miệng tôi lại nói:',
        'lieng: Việc của tôi xong rồi. Tôi xuống dưới canh cửa.',
      ] },
      { t: 'Bỏ xuống tầng một', steps: ['lieng: Việc của tôi xong rồi. Tôi xuống dưới canh cửa.'] },
    ] },
    { cut: [
      { img: 'scene', o: { place: 'hall', night: true, tape: true, stairs: true, figs: [['lieng', 200, 'angry', 'left', { y: 880 }], ['binh', 820, 'sad', 'left'], ['tu', 1120, 'neutral', 'left']] }, cam: [[500, 520, 1.25], [700, 460, 1.08]], t: 9, say: [
        'Tôi quay lưng bỏ xuống cầu thang, mặc kệ cậu ta gọi với theo.',
        'binh[sad]: Liễng...',
        'Đó là lần cuối cùng tôi nghe cậu ta gọi tên tôi.',
      ] },
    ] },
    { go: 'c2_death' },
  ],

  c2_death: [
    { bg: 'inn_lobby', cast: [] },
    { big: '30 phút sau', auto: 1600 },
    { cut: [
      { img: 'scene', o: { place: 'lobby', night: true, figs: [['lieng', 1300, 'surprised', 'up']], marks: [[1300, 300, '!']] }, tr: 'flash', sfx: 'boom', hold: 500, cam: [[1200, 360, 1.3], [1000, 420, 1.1]], t: 6, say: [
        { fx: 'shake' },
        'RẦM!',
        'Một tiếng va đập dội xuống từ trên lầu. Rồi tiếng chân chạy rầm rập.',
      ] },
    ] },
    { cast: ['quanly'] },
    'quanly[scared]: Anh công an! Anh công an ơi! Bạn anh... bạn anh bị giết rồi! Ông thám tử bị thương, còn thằng Nhà trốn mất rồi!',
    '*Hả? Cậu Nhà? Chẳng phải cậu ta vừa bảo vụ này có chỗ không khớp sao?',
    { bg: 'inn_room', o: { night: true, lamp: true }, cast: [] },
    { fx: 'redflash' },
    { music: 'eerie' },
    { cut: [
      { img: 'deathroom', tr: 'cut', cam: [[460, 640, 1.34], [1100, 360, 1.14]], t: 12, say: [
        'Cậu ta nằm đó. Bị đâm ngay giữa ngực. Đã tắt thở.',
        'Dấu dép rướm máu in khắp sàn, kéo dài tới cửa sổ tầng hai. Đôi dép bị bỏ lại ở đó. Ông thám tử bị đập đầu vào tường, bất tỉnh ngay cạnh. Cửa sổ mở toang.',
      ] },
    ] },
    'quanly: Nó chạy về phía kia! Phía đầu hẻm!',
    { cut: [
      { img: 'fight', o: { kind: 'cutin', a: 'lieng', move: 'ĐUỔI THEO!', sub: 'nhảy qua cửa sổ tầng hai', emoA: 'angry' }, tr: 'flash', sfx: 'swish', hold: 1000, cam: [[800, 420, 1.02], [860, 420, 1.1]], t: 3 },
    ] },
    { game: 'timed', title: 'Đuổi theo!', noRetry: true, maxMiss: 3, intro: 'Tôi nhảy qua cửa sổ!', rounds: [
      { tell: 'Đáp xuống mái tôn — trơn trượt!', opts: ['↓ Hạ thấp người', '↑ Nhảy tiếp', '→ Chạy thẳng'], ans: 0, time: 2.2, ok: 'Giữ được thăng bằng!' },
      { tell: 'Ngã ba đầu hẻm!', opts: ['← Rẽ trái', '→ Rẽ phải', '↑ Đi thẳng'], ans: 0, time: 2, ok: 'Hướng cô quản lý chỉ...' },
      { tell: 'Một bóng người phía trước!', opts: ['↑ Lao tới', '← Chặn đầu', '↓ Dừng lại'], ans: 0, time: 1.6, ok: '...Chỉ là một người đi đường.' },
    ] },
    { bg: 'street_night', cast: [] },
    { cut: [
      { img: 'street', o: { time: 'night' }, cam: [[700, 500, 1.2], [800, 450, 1.04]], t: 10, say: [
        'Không có ai. Không một dấu vết.',
        'Khi tôi quay lại, cô quản lý báo rằng tên Nhà bị thương nặng nên đã vòng ra trốn ở sau nhà. Sau đó vì chấn thương não quá nặng mà chết.',
      ] },
    ] },
    { go: 'c2_guilt' },
  ],

  c2_guilt: [
    { bg: 'station', cast: [] },
    { music: 'sad' },
    { cut: [
      { img: 'scene', o: { place: 'office', night: true, figs: [['lieng', 800, 'sad', 'down', { tone: 'cold' }]], spot: [800, 520, .5] }, cam: [[800, 420, 1.06], [800, 460, 1.2]], t: 14, say: [
        'Tôi nhận ra sự non kém của mình. Tôi đã không thể đoán ra hắn vòng lại để trốn.',
        'Cậu ấy đã chết vì tôi. Vì sự đố kỵ của tôi. Vì tôi tự ý rời vị trí.',
      ] },
      { img: 'close', o: { k: 'file', who: false, title: 'BIÊN BẢN LẤY LỜI KHAI', lines: ['Người khai: Nguyễn Văn Tư; cô quản lý nhà trọ', '“...cán bộ Liễng có mặt tại hiện trường,', 'truy đuổi và xác định được đối tượng...”', 'Đề xuất: khen thưởng, điều chuyển'] }, tr: 'cut', cam: [[800, 420, 1.04], [800, 520, 1.16]], t: 12, say: [
        'Sau đó một nhóm công an được điều tới điều tra lại, lấy lời khai mới. Mọi chi tiết đều khớp.',
        'Chỉ có điều — lời khai của ông thám tử và cô quản lý không hề nhắc tới việc tôi bỏ vị trí. Ngược lại, tôi còn là người đã “bắt được” tên tội phạm.',
      ] },
    ] },
    'Nhờ lời khai đó, tôi không những không bị kỷ luật, mà còn được điều lên Đội Điều tra trọng án.',
    'Một lần nữa, tôi lại không thể phản ứng gì trước những lời nói dối có lợi cho mình.',
    { go: 'c2_funeral' },
  ],

  c2_funeral: [
    { date: 'Ngày 20 tháng 10 năm 2026' },
    { bg: 'funeral', cast: [] },
    { cut: [
      { img: 'altar', cam: [[800, 470, 1.02], [800, 350, 1.34]], t: 16, say: [
        'Trở về hiện tại. Tôi đã tới đám tang của cậu ấy.',
        'Trên giấy tờ, cậu ấy là trẻ mồ côi. Gần đây còn phải nuôi thêm một người bác bị thiểu năng trí tuệ.',
        'Đám tang còn vắng vẻ hơn tôi tưởng. Ngoài tôi ra chỉ có ông Trưởng công an, và một người nữa — có lẽ là ông bác.',
      ] },
    ] },
    { cast: ['truong', 'bac'] },
    '*Vậy là việc cậu ta nói mình không có bạn là thật. Trớ trêu thay, người bạn duy nhất của cậu ta lại là tôi.',
    '*Nếu cuộc đời cho cậu ta một người bạn tốt hơn thì có lẽ cậu ta đã không phải chết. Nếu cậu ta không tin một kẻ rác rưởi như tôi thì...',
    '*Người giết cậu ta không phải tên thủ phạm kia. Người giết cậu ta là tôi.',
    'Ông Trưởng đứng lặng rất lâu trước di ảnh. Tôi để ý thấy ông liếc nhìn ông bác một cái — một cái nhìn rất khó hiểu.',
    'truong[sad]: Tôi phải về đơn vị. Cậu ở lại trông coi giúp tôi được không?',
    'lieng: Vâng. Tôi sẽ ở lại tới khi hạ huyệt.',
    { unlock: 'c3' },
    { go: 'c3_start' },
  ],
});
