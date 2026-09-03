/* Trường sao nền — dùng chung cho cả 2 trang.
   initStars(canvas, { count, speed, colors }) */
(function () {
  "use strict";

  function initStars(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext("2d", { alpha: true });
    var DPR = 1;  // sao chỉ là chấm nhỏ — DPR 1 là đủ, nhẹ GPU hơn nhiều
    var count = opts.count || 140;
    var speed = opts.speed || 1;
    var colors = opts.colors || ["#ffffff", "#8ad0ff", "#ffd1a8", "#ffb3e6", "#c9b3ff"];
    var stars = [];
    var w = 0, h = 0;
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function make() {
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z: Math.random() * 0.9 + 0.1,
          r: Math.random() * 1.4 + 0.3,
          tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.04 + 0.008,
          c: colors[(Math.random() * colors.length) | 0]
        });
      }
    }

    var last = performance.now();
    var skip = 0;
    function frame(now) {
      requestAnimationFrame(frame);
      // ~30fps là quá đủ cho nền sao, nhường CPU/GPU cho hiệu ứng chính
      if ((skip ^= 1)) return;
      var dt = Math.min(now - last, 80) / 16.7;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduced) {
          s.y += s.z * 0.12 * speed * dt;
          s.x += s.z * 0.04 * speed * dt;
          s.tw += s.tws * dt;
        }
        if (s.y > h + 4) { s.y = -4; s.x = Math.random() * w; }
        if (s.x > w + 4) { s.x = -4; }
        var a = 0.35 + Math.sin(s.tw) * 0.35 + 0.3;
        ctx.globalAlpha = Math.max(0.05, Math.min(1, a)) * s.z;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z), 0, Math.PI * 2);
        ctx.fill();
        if (s.r > 1.1) {
          ctx.globalAlpha *= 0.25;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    var ro = new ResizeObserver(function () { resize(); make(); });
    ro.observe(canvas);
    resize();
    make();
    requestAnimationFrame(frame);
  }

  window.initStars = initStars;
})();
