/* Trang 1 — TỰ sinh mã QR ngay trong trình duyệt, từ chính URL đang chạy.
   => Deploy 1 lần là xong, không cần biết link trước, không cần gen_qr.py.

   Mã trỏ tới file  celebrate.html  nằm cạnh index.html:
     https://<tên-miền-của-bạn>/celebrate.html
   Muốn ép link khác: đặt  deployLink  (http/https) trong assets/js/config.js. */
(function () {
  "use strict";

  // ---- Xác định link đích ----
  var CFG = (window.APP_CONFIG || {});
  var forced = (CFG.deployLink || "").trim();
  var isRealUrl = /^https?:\/\//i.test(forced) && !/your-deploy-link\.example\.com/.test(forced);
  var target = isRealUrl ? forced : new URL("celebrate.html", window.location.href).href;

  // ---- Vẽ QR (giữ vuông để luôn quét được) ----
  function drawQR() {
    var canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    var size = 512;
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");

    if (typeof qrcode !== "function") {
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = "#b5179e"; ctx.font = "600 20px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Thiếu assets/js/qrcode.min.js", size / 2, size / 2);
      return;
    }

    var qr = qrcode(0, "H");        // ECC cao — quét tốt kể cả in ra
    qr.addData(target);
    qr.make();
    var n = qr.getModuleCount();
    var quiet = 4;
    var cell = size / (n + quiet * 2);

    ctx.clearRect(0, 0, size, size);

    // module bo tròn (nền trong suốt để composite gradient)
    ctx.fillStyle = "#1b0a3d";
    for (var row = 0; row < n; row++) {
      for (var col = 0; col < n; col++) {
        if (!qr.isDark(row, col)) continue;
        var x = (col + quiet) * cell, y = (row + quiet) * cell;
        roundRect(ctx, x + cell * 0.06, y + cell * 0.06, cell * 0.88, cell * 0.88, cell * 0.31);
        ctx.fill();
      }
    }

    // gradient tím → magenta CHỈ lên module
    ctx.globalCompositeOperation = "source-in";
    var g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0.00, "#2b1055");
    g.addColorStop(0.45, "#6a1fb1");
    g.addColorStop(0.75, "#b5179e");
    g.addColorStop(1.00, "#3a0ca3");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    // nền trắng phía sau (giữ tương phản)
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.globalCompositeOperation = "source-over";

    // làm rõ 3 ô định vị
    drawFinder(ctx, quiet, quiet, cell);
    drawFinder(ctx, quiet + n - 7, quiet, cell);
    drawFinder(ctx, quiet, quiet + n - 7, cell);
  }

  function drawFinder(ctx, cx, cy, cell) {
    ctx.fillStyle = "#1b0a3d";
    roundRect(ctx, cx * cell, cy * cell, cell * 7, cell * 7, cell * 1.6); ctx.fill();
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, (cx + 1) * cell, (cy + 1) * cell, cell * 5, cell * 5, cell * 1.2); ctx.fill();
    var fg = ctx.createLinearGradient(cx * cell, cy * cell, (cx + 7) * cell, (cy + 7) * cell);
    fg.addColorStop(0, "#6a1fb1"); fg.addColorStop(1, "#b5179e");
    ctx.fillStyle = fg;
    roundRect(ctx, (cx + 2) * cell, (cy + 2) * cell, cell * 3, cell * 3, cell * 0.8); ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---- Trái tim nhỏ trang trí ----
  var HUES = ["#ff2e97", "#7b2ff7", "#00d4ff", "#ff7a1a", "#ffd23f", "#35e0a1"];
  for (var i = 0; i < 16; i++) {
    var s = document.createElement("span");
    s.className = "mini-heart";
    s.textContent = "♥";
    s.style.left = (Math.random() * 100) + "vw";
    s.style.color = HUES[i % HUES.length];
    s.style.fontSize = (12 + Math.random() * 22) + "px";
    s.style.animationDuration = (9 + Math.random() * 10) + "s";
    s.style.animationDelay = (-Math.random() * 18) + "s";
    document.body.appendChild(s);
  }

  if (window.initStars) initStars(document.getElementById("stars"), { count: 120, speed: 0.7 });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", drawQR);
  else drawQR();
})();
