# Đa Diện Thế Giới — game trinh thám top-down

## Cách chơi
Mở file `index.html` bằng Chrome / Edge / Firefox (nhấp đúp là được).

- **Đi lại:** WASD / mũi tên, hoặc bấm chuột vào chỗ muốn tới (trên điện thoại có nút điều hướng ảo)
- **Xem xét / nói chuyện:** đến gần chỗ có dấu **?** (đồ vật) hoặc **…** (người) rồi bấm **E** (hoặc bấm chuột vào nó)
- **Đọc thoại:** Space / Enter / bấm chuột · **1–4** chọn đáp án · **giữ Ctrl** để tua
- **N** sổ tay manh mối · **L** lịch sử hội thoại · **Esc** đóng bảng
- Game tự lưu ở đầu mỗi cảnh; chương đã tới sẽ mở trong "Chọn chương".

## Các kiểu màn chơi
| Kiểu | Ví dụ |
|---|---|
| Điều tra tự do trên bản đồ | Phòng 204, hiện trường phòng 203, hội trường, nhà nạn nhân, hồ sơ ở đồn |
| Hỏi chuyện NPC | Ông chủ trọ, cậu Nhà, các sạp ở chợ Bến Thành, Mộng |
| Lén lút thời gian thực | Lính gác có **tầm nhìn hình nón đỏ**; đứng vào bụi cây để nấp; ô sọc đỏ là bẫy bật/tắt. Bị bắt 3 lần sẽ hiện nút "Bỏ qua màn này". |
| Đuổi bắt | Bắt con mèo trong đám tang (chạm 3 lần) |
| Ký ức | Nhìn căn phòng tối hôm qua, tìm 3 điểm khác |
| Bảo vệ hiện trường | Dây phong tỏa → găng tay → kẻ viền → túi tang vật |
| Đánh theo chỉ định | Chọn đúng hành động trước khi hết giờ (chương 6: ra lệnh cho ông bác) |
| Suy luận | Chọn đáp án / chọn nhiều manh mối |

## Cấu trúc
- `js/art.js` — nhân vật chibi (vẽ bằng SVG theo mẫu `nhan-vat-chibi-v2.svg`), đồ vật, bản đồ
- `js/maps.js` — bản đồ các địa điểm (ô `#` tường, `.` sàn, `H` bụi cây…)
- `js/world.js` — chế độ đi lại top-down, camera, lính gác, bẫy
- `js/story/c1.js … c8.js` — kịch bản từng chương

### Biểu cảm nhân vật
Ghi cảm xúc trong ngoặc vuông ngay sau tên nhân vật:

```js
"khanh[angry]: Chừng này? Đến tiền lãi còn không đủ!",
"*[sad]Người giết cậu ta là tôi.",          // suy nghĩ cũng gắn được
```

Có 12 loại: `neutral, smile, happy, sad, angry, surprised, scared, think, smug, hurt, cry, sleep`.
Không ghi thì game tự đoán theo câu thoại (có "?!" → ngạc nhiên, có "xin lỗi" → buồn…).
Biểu cảm hiện ở chân dung trong hộp thoại, trên nhân vật ngoài bản đồ, kèm bong bóng cảm xúc trên đầu.

### Nhạc nền & âm thanh
Nhạc và hiệu ứng được tạo trực tiếp bằng WebAudio trong `js/audio.js` (không cần file nhạc).
Nhạc tự đổi theo bối cảnh (đám tang → buồn, chợ → vui, lén lút → căng thẳng, đánh nhau → hành động, ban đêm → nhạc đêm…).
Muốn ép một bản nhạc tại một chỗ trong kịch bản:

```js
{ music: 'sad' },     // title, calm, mystery, tense, action, sad, market, dream, eerie, night
{ music: null },      // im lặng
{ music: 'auto' },    // trả về chọn tự động
```
Chỉnh âm lượng nhạc / hiệu ứng trong ⚙ Cài đặt, hoặc bấm nút loa trên góc phải để tắt/bật nhanh.

### Biểu tượng vật phẩm / manh mối
Các biểu tượng vẽ tay nằm trong `js/icons.js`. Manh mối tự lấy biểu tượng theo `id` (bảng `CLUE`), hoặc ghi thẳng: `clue: { id, name, desc, icon: 'knife' }`.
Đồ vật trên bản đồ cũng nhận `icon: 'phone'`.

Một màn đi lại được viết trong kịch bản như sau:

```js
{ game: 'world', map: 'inn_room', title: 'Phòng 204', player: 'tu', at: [9.5, 7],
  objs: [{ id: 'door', at: [8, 9.3], label: 'Cửa phòng', on: ['*Ổ khóa còn nguyên...'] }],
  npcs: [{ c: 'chutro', at: [10.6, 2.9], on: ['chutro: ...'], finish: true }],
  guards: [{ c: 'unk', at: [7, 3], path: [[7, 3], [22, 3]], range: 4, fov: 60 }],
  goal: { reach: [7, 9.3, 2, 1.6], label: 'Xuống sảnh' } }
```

### Đoạn kết 2D → 3D
`js/dim3d.js` dựng lại căn phòng cuối của chương 8 bằng three.js (tải từ cdnjs khi tới chương 8): bản đồ phẳng nghiêng thành sa bàn, tường mọc lên, nhân vật "đứng dậy" khỏi mặt giấy, ánh nến và bóng đổ thật; khi vùng không gian sụp đổ, cảnh gập về 2D rồi xoáy vào hố đen.
Dùng trong kịch bản bằng các bước hàm: `() => DIM3D.enter({ focus, figs })`, `DIM3D.add({ c, at, rise | from | lie })`, `DIM3D.pose(c, { bow })`, `DIM3D.collapse()`.
Không có mạng / WebGL thì tự chuyển sang nghiêng bản đồ bằng CSS 3D.

### Bot dò lỗi
Mở `index.html?bot` (cần chạy qua máy chủ, ví dụ `python -m http.server`) — bot tự chơi lần lượt 8 chương, bảng góc trái báo lỗi / chỗ kẹt.
- `?bot=c5` chỉ chơi chương 5 · `&pick=last` luôn chọn đáp án cuối (để đi nhánh khác; chương 5, 7, 8 cần `pick=last` mới tới kết thúc chính).
