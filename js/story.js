'use strict';
/* ==========================================================
   KỊCH BẢN — "Đa Diện Thế Giới"
   Cú pháp một bước:
     "Lời dẫn"                  → lời kể
     "tu: Lời thoại"            → nhân vật nói (khóa trong CHARS)
     "*Suy nghĩ"                → độc thoại nội tâm
     {bg, o:{night,rain...}}    → đổi phông      {cast:[...]} → nhân vật trên màn
     {chap,title} {date} {big}  → thẻ chữ lớn
     {choice:[{t,go,steps,set}]} {ask:[{t,steps}],need,exit}
     {game:'investigate'|'deduce'|'memory'|'protect'|'stealth'|'timed'|'catchcat', ...}
     {clue:{id,name,desc}} {set:{...}} {if:'flag'} {fx} {go:'scene'} {end:'Tên', text, kind}
   Nội dung từng chương nằm trong js/story/cN.js
   ========================================================== */
const CHAPTERS = [
  { id: 'c1', num: 'Chương 1', name: 'Chú thám tử Tư', scene: 'c1_start' },
  { id: 'c2', num: 'Chương 2', name: 'Anh công an Liễng', scene: 'c2_start' },
  { id: 'c3', num: 'Chương 3', name: 'Cậu Vẻ', scene: 'c3_start' },
  { id: 'c4', num: 'Chương 4', name: 'Ông công an Trưởng', scene: 'c4_start' },
  { id: 'c5', num: 'Chương 5', name: 'Nốt cao (1)', scene: 'c5_start' },
  { id: 'c6', num: 'Chương 6', name: 'Nốt cao (2)', scene: 'c6_start' },
  { id: 'c7', num: 'Chương 7', name: 'Đoạn kết mới', scene: 'c7_start' },
  { id: 'c8', num: 'Chương 8', name: 'Đoạn kết cuối', scene: 'c8_start' },
];
const SCENES = {};
