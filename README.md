# 🎂 Chúc Mừng Sinh Nhật — Web App 2 trang

Món quà sinh nhật online: một trang **QR hình trái tim**, một trang **bầu trời lời chúc trôi nổi**
có thể gom lại thành **hình cầu 3D** xoay quanh ảnh trung tâm.

Chỉ dùng HTML + CSS + JavaScript thuần — deploy ở đâu cũng chạy, không cần build.

```
MyTamSN/
├── index.html          → Trang 1: mã QR trái tim (tự sinh trong trình duyệt)
├── celebrate.html      → Trang 2: giao diện chính
├── gen_qr.py           → (TÙY CHỌN) chỉ dùng khi muốn file ảnh QR để in/gửi
├── assets/
│   ├── css/style.css
│   ├── js/config.js    → ⭐ CHỈ CẦN SỬA FILE NÀY
│   ├── js/qrcode.min.js → thư viện QR nhúng sẵn (offline, ~20KB)
│   ├── js/stars.js · js/page1.js · js/page2.js
│   └── img/            → bỏ ảnh của bạn vào đây
└── README.md
```

> **Deploy 1 lần là xong.** Trang QR tự đọc URL nó đang chạy và sinh mã trỏ tới
> `celebrate.html` nằm cạnh nó — không cần biết link trước, không cần chạy lại gì.

## 1. Cá nhân hoá (sửa `assets/js/config.js`)

| Trường | Ý nghĩa |
|---|---|
| `recipientName` | Tên người nhận (để `""` nếu muốn tiêu đề chung) |
| `deployLink` | **Để trống** — QR tự lấy URL đang chạy. Chỉ điền nếu muốn ép QR trỏ đi nơi khác |
| `photo` | Ảnh ở **tâm/trục** hình cầu, ví dụ `assets/img/my-photo.jpg` |
| `photos` | Danh sách **ảnh nhỏ** rơi xuống + xoay quanh hình cầu (để `[]` thì dùng lại `photo`) |
| `messages` | Danh sách lời chúc rơi xuống (thêm/bớt tùy ý) |
| `headline`, `subtitle`, `birthDate` | Chữ hiển thị |

Thêm ảnh: copy ảnh vào `assets/img/`, rồi sửa `photo` trong config.

## 2. Chạy thử ở máy

```bash
cd MyTamSN
python -m http.server 8000
# mở http://localhost:8000            (trang QR)
# mở http://localhost:8000/celebrate.html   (trang chính)
```
> Mở trực tiếp bằng `file://` cũng chạy được, nhưng nên chạy qua server để chắc chắn.

## 3. Deploy (chọn 1)

- **Netlify Drop**: kéo cả thư mục `MyTamSN` vào https://app.netlify.com/drop
- **Vercel**: `vercel` trong thư mục, hoặc import repo trên vercel.com
- **GitHub Pages**: push lên repo → Settings → Pages → deploy từ nhánh `main`

Deploy **một lần duy nhất** là xong:

1. Kéo/đẩy cả thư mục lên host.
2. Mở `index.html` trên tên miền vừa có — QR đã tự sinh, trỏ tới `celebrate.html`
   cùng tên miền. Quét bằng camera điện thoại để kiểm tra.

Đổi nội dung (lời chúc, ảnh…) về sau chỉ cần deploy lại — QR **không cần đụng tới**
vì nó bám theo URL, không phải link cứng.

## 4. (TÙY CHỌN) File ảnh QR để in / gửi — `gen_qr.py`

Trang web không cần file này. Chỉ dùng khi muốn một **file PNG** để in thiệp / gửi qua chat:

```bash
pip install "qrcode[pil]"
python gen_qr.py "https://ten-mien-cua-ban/celebrate.html"
# → assets/img/qr.png   (module bo tròn, gradient tím–magenta, mức sửa lỗi H)

python gen_qr.py "https://..." --plain        # QR đen trắng cổ điển
```

## 5. Cách dùng trang chính

- **Mưa lời chúc**: lời chúc + nhiều ảnh nhỏ rơi từ trên xuống theo nhiều lớp, trái tim màu bay lên, ảnh ở tâm nhỏ nhẹ nhàng.
- **Phóng to / thu nhỏ**: nút `＋ － ⟳` bên phải · con lăn chuột · chụm 2 ngón · nhấp đúp. Kéo để di chuyển khi đang phóng to.
- **Nút trái tim ↙ (dưới màn hình)**: gom lời chúc thành **hình cầu 3D lớn** (tự phóng cho vừa màn hình); ảnh ở tâm phóng to làm trục, các ảnh nhỏ **xoay thành vòng quanh trục**. Kéo để xoay quả cầu, tự xoay khi thả tay. Bấm lại để trả về mưa lời chúc.

## Ghi chú kỹ thuật

- Font **Be Vietnam Pro** tải từ Google Fonts (có fallback hệ thống nếu offline).
- Trang 1 sinh QR ngay trong trình duyệt bằng `assets/js/qrcode.min.js` (nhúng sẵn, không gọi mạng), lấy link từ `window.location` → luôn khớp nơi bạn deploy.
- Mã QR luôn giữ dạng **vuông** bên trong khung trái tim để **chắc chắn quét được**; trái tim là phần trang trí (viền gradient, quầng sáng, tim bay).
- Tôn trọng `prefers-reduced-motion`: giảm chuyển động cho người nhạy cảm.
