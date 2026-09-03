/* =====================================================================
   CẤU HÌNH ỨNG DỤNG  —  chỉ cần sửa file này là xong
   ---------------------------------------------------------------------
   Sau khi deploy (Vercel / Netlify / GitHub Pages...), dán link vào
   deployLink. Trang 1 sẽ tự sinh mã QR trỏ tới trang chính.
   ===================================================================== */
window.APP_CONFIG = {

  /* Tên người nhận. Để "" nếu muốn dùng tiêu đề chung chung. */
  recipientName: "Mỹ Tâm",

  /* ---- LINK DEPLOY ----
     Dán link trang chính của bạn vào đây. Ví dụ:
       "https://mytamsn.vercel.app/celebrate.html"
     Nếu để nguyên placeholder, QR vẫn sinh ra nhưng trỏ tới link mẫu. */
  deployLink: "",

  /* ---- ẢNH TRUNG TÂM ----
     Bỏ file ảnh vào thư mục  assets/img/  rồi sửa đường dẫn bên dưới.
     Ví dụ:  "assets/img/my-photo.jpg"
     Đây là ảnh nằm ở TÂM (trục) của hình cầu khi bấm nút. */
  photo: "assets/img/mytam.jpg",

  /* ---- ẢNH NHỎ TRÔI XUỐNG ----
     Nhiều tấm ảnh nhỏ rơi từ trên xuống cùng lời chúc; khi bấm nút
     chúng xoay thành vòng quanh trục hình cầu.
     Thêm bao nhiêu tuỳ thích. Để [] thì dùng lại ảnh chính ở trên. */
  photos: [
    // "assets/img/anh-1.jpg",
    // "assets/img/anh-2.jpg",
    // "assets/img/anh-3.jpg"
  ],

  /* Ngày sinh hiển thị nhỏ ở trang chính. Để "" để ẩn. */
  birthDate: "",

  /* Tiêu đề lớn + phụ đề ở trang QR */
  headline: "Chúc Mừng Sinh Nhật MyTammm",
  subtitle: "Quét trái tim để mở món quà",

  /* ---- LỜI CHÚC TRÔI NỔI ----
     Lời chúc sinh nhật trung lập, thân thiện. Thêm / bớt / sửa thoải mái. */
  messages: [
    "Chúc mừng sinh nhật MyTammm! 🎉",
    "Chúc em tuổi mới thật vui nhé 🎂",
    "Mừng ngày sinh nhật 🥳",
    "Chúc em nhiều sức khỏe",
    "Vạn sự như ý 🌟",
    "Chúc mọi điều tốt đẹp nhất đến với eim",
    "Tuổi mới nhiều niềm vui",
    "May mắn 🍀",
    "Xinh gái 😘",
    "Chúc em luôn vui vẻ",
    "Một ngày sinh nhật rực rỡ ✨",
    "Chúc em bình an mỗi ngày",
    "Tuổi mới, mục tiêu mới 🎯",
    "Chúc Mỹ Tâm gặp nhiều may mắn",
    "Happy Birthday! 🎈",
    "Chúc luôn tràn năng lượng ⚡",
    "Mong mọi dự định thành công",
    "Chúc em luôn cười thật nhiều 😄",
    "Tuổi mới nhiều trải nghiệm hay",
    "Nhiều niềm vui nhỏ mỗi ngày",
    "Chúc em có một ngày sinh nhật đáng nhớ 🎁",
  ]
};
