/* =====================================================================
   Trang 2 — Giao diện chính
   • Lời chúc + nhiều ảnh nhỏ RƠI TỪ TRÊN XUỐNG như mưa sao
   • Trái tim bay lên nhiều màu
   • Phóng to / thu nhỏ (nút · con lăn · pinch) + kéo để di chuyển
   • Nút trái tim: gom chữ thành HÌNH CẦU LỚN; ảnh xoay quanh trục trung tâm
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.APP_CONFIG || {};
  var REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var PLACEHOLDER_IMG = "assets/img/photo-placeholder.svg";
  var TAU = Math.PI * 2;

  var PALETTE = ["#00d4ff", "#7b2ff7", "#ff2e97", "#ff7a1a", "#ffd23f", "#35e0a1", "#ffffff", "#ff5db1", "#8f6bff"];

  var GOLDEN = Math.PI * (3 - Math.sqrt(5));
  var R = 380;          // bán kính hình cầu (toạ độ sân khấu) — LỚN
  var FOV = 900;

  var viewport = document.getElementById("viewport");
  var stage = document.getElementById("stage");
  var photoEl = document.getElementById("photo");
  var heartsLayer = document.getElementById("hearts-layer");
  var revealBtn = document.getElementById("reveal");
  var revealLabel = revealBtn.querySelector(".label");
  var hintEl = document.getElementById("hint");

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function map(v, a, b, c, d) { return c + (d - c) * ((v - a) / (b - a)); }

  // ---------- PRNG có seed ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var rnd = mulberry32(20260903);
  function rr(min, max) { return min + rnd() * (max - min); }
  function pick(arr) { return arr[(rnd() * arr.length) | 0]; }

  // ---------- Ảnh trung tâm (trục hình cầu) ----------
  var mainSrc = CFG.photo || PLACEHOLDER_IMG;
  var mimg = document.createElement("img");
  mimg.alt = "Ảnh trung tâm";
  mimg.src = mainSrc;
  mimg.onerror = function () { mimg.src = PLACEHOLDER_IMG; };
  photoEl.appendChild(mimg);
  var photoCur = { x: 0, y: 0, s: 0.32, z: 400 };

  // ---------- Lời chúc (rơi xuống / mặt cầu) ----------
  var texts = (CFG.messages && CFG.messages.length) ? CFG.messages.slice() : ["Chúc mừng sinh nhật! 🎉"];
  var N = texts.length;
  var msgs = [];
  for (var i = 0; i < N; i++) {
    var el = document.createElement("div");
    el.className = "msg";
    el.textContent = texts[i];
    if (rnd() < 0.28) el.style.fontStyle = "italic";
    el.style.fontSize = rr(16, 40).toFixed(1) + "px";
    el.style.color = pick(PALETTE);
    stage.appendChild(el);

    var y = 1 - (i / Math.max(1, N - 1)) * 2;
    var rad = Math.sqrt(Math.max(0, 1 - y * y));
    var th = GOLDEN * i;
    var layer = rr(0.4, 1);

    msgs.push({
      el: el,
      px: rr(-720, 720), py: rr(-600, 600),
      vx: rr(-0.15, 0.15),
      vy: (rr(0.4, 0.9) + layer * 1.7) * (REDUCE ? 0.4 : 1),
      ph1: rr(0, 6.28), phr: rr(0, 6.28),
      ws1: rr(0.15, 0.5), wr: rr(0.2, 0.7),
      aw1: rr(6, 20), arot: rr(3, 8),
      layer: layer,
      baseScale: 0.7 + layer * 0.5,
      baseOpacity: 0.35 + layer * 0.6,
      ux: rad * Math.cos(th), uy: y, uz: rad * Math.sin(th),
      sphereScale: rr(0.85, 1.15),
      cx: 0, cy: 0, csc: 1, crot: 0, cop: 0, cbl: 0
    });
    msgs[i].cx = msgs[i].px; msgs[i].cy = msgs[i].py;
  }

  // ---------- Ảnh nhỏ (rơi xuống / vòng quanh trục) ----------
  var srcList = (CFG.photos && CFG.photos.length) ? CFG.photos.slice() : [mainSrc];
  var IMG_COUNT = Math.min(14, srcList.length >= 6 ? srcList.length : Math.max(6, srcList.length * 3));
  var imgs = [];
  for (var j = 0; j < IMG_COUNT; j++) {
    var wrap = document.createElement("div");
    wrap.className = "float-img";
    // Dựng ở kích thước LỚN (120–190px) rồi luôn scale <= ~1 để ảnh không bị vỡ.
    var sz = rr(120, 190);
    wrap.style.width = sz.toFixed(0) + "px";
    wrap.style.height = sz.toFixed(0) + "px";
    wrap.style.borderRadius = (rnd() < 0.5 ? "50%" : (12 + rnd() * 16).toFixed(0) + "px");
    var im = document.createElement("img");
    im.alt = "Ảnh kỷ niệm";
    im.decoding = "async";
    im.src = srcList[j % srcList.length];
    im.onerror = (function (n) { return function () { n.src = PLACEHOLDER_IMG; }; })(im);
    wrap.appendChild(im);
    stage.appendChild(wrap);

    var ily = rr(0.45, 1);
    imgs.push({
      el: wrap,
      px: rr(-680, 680), py: rr(-620, 620),
      vx: rr(-0.12, 0.12),
      vy: (rr(0.35, 0.8) + ily * 1.4) * (REDUCE ? 0.4 : 1),
      swPh: rr(0, 6.28), swSpd: rr(0.15, 0.45), swAmp: rr(8, 26),
      rPh: rr(0, 6.28), rSpd: rr(0.2, 0.6),
      layer: ily,
      baseScale: 0.30 + ily * 0.22,          // mưa: nhỏ nhỏ (0.30–0.52 của 120–190px)
      baseOpacity: 0.6 + ily * 0.4,
      ua: (j / IMG_COUNT) * TAU + rr(-0.12, 0.12), // góc quanh trục Y
      ur: rr(0.66, 0.95),                     // bán kính vòng (theo tỉ lệ R)
      uy: rr(-0.42, 0.42),                    // độ cao trên trục (theo tỉ lệ R)
      ringSpin: rr(0.05, 0.13),               // tự quay quanh trục, chậm
      sphereScale: rr(0.5, 0.78),             // giữ scale hiển thị <= ~1
      cx: 0, cy: 0, csc: 1, crot: 0, cop: 0, cbl: 0
    });
    imgs[j].cx = imgs[j].px; imgs[j].cy = imgs[j].py;
  }

  // ---------- Trái tim bay ----------
  var HEART_SVG = '<svg viewBox="0 0 32 32" width="100%" height="100%"><path d="M16 28C6 21 2 15 2 9.5 2 5 5.6 2 9.6 2 12.5 2 14.9 3.7 16 6.1 17.1 3.7 19.5 2 22.4 2 26.4 2 30 5 30 9.5 30 15 26 21 16 28Z" fill="currentColor"/></svg>';
  var HEART_COUNT = REDUCE ? 8 : 18;
  for (var h = 0; h < HEART_COUNT; h++) {
    var d = document.createElement("div");
    d.className = "fly-heart";
    d.innerHTML = HEART_SVG;
    var hs = rr(14, 46);
    d.style.width = hs + "px";
    d.style.height = hs + "px";
    d.style.left = rr(0, 100) + "%";
    d.style.color = pick(PALETTE);
    d.style.setProperty("--s", rr(0.6, 1.5).toFixed(2));
    d.style.setProperty("--dx", rr(-70, 70).toFixed(0) + "px");
    d.style.setProperty("--o", rr(0.4, 0.9).toFixed(2));
    d.style.animationDuration = rr(7, 17).toFixed(1) + "s";
    d.style.animationDelay = (-rr(0, 18)).toFixed(1) + "s";
    heartsLayer.appendChild(d);
  }

  // ---------- Trạng thái ----------
  var mode = "scatter";
  var MINZ = 0.3, MAXZ = 3.4;
  function fitScatterZoom() { return clamp(Math.min(window.innerWidth / 1000, window.innerHeight / 720), 0.5, 1.15); }
  function fitSphereZoom() { return clamp(Math.min(window.innerWidth, window.innerHeight) / (R * 2.15), 0.34, 1.3); }
  var initZoom = fitScatterZoom();
  var state = {
    zoom: initZoom, zoomTarget: initZoom, panX: 0, panY: 0,
    rotX: 0, rotY: 0, velX: 0, velY: 0
  };

  // ---------- Vòng lặp chính ----------
  var t0 = performance.now(), last = t0;
  function tick(now) {
    var dt = Math.min((now - last) / 16.7, 3);
    last = now;
    var t = (now - t0) / 1000;
    var ease = 1 - Math.pow(1 - 0.15, dt);
    var zease = 1 - Math.pow(1 - 0.12, dt);

    state.zoom += (state.zoomTarget - state.zoom) * zease;

    if (mode === "sphere" && !drag.active) {
      var auto = REDUCE ? 0.0016 : 0.0044;
      state.rotY += (auto + state.velY) * dt;
      state.rotX += state.velX * dt;
      state.velX *= 0.94; state.velY *= 0.94;
    }
    state.rotX = clamp(state.rotX, -1.15, 1.15);

    var cosX = Math.cos(state.rotX), sinX = Math.sin(state.rotX);
    var cosY = Math.cos(state.rotY), sinY = Math.sin(state.rotY);

    // ----- Lời chúc -----
    for (var k = 0; k < msgs.length; k++) {
      var m = msgs[k];
      var tx, ty, tsc, trot, top, tz;
      if (mode === "sphere") {
        var x1 = m.ux;
        var y1 = m.uy * cosX - m.uz * sinX;
        var z1 = m.uy * sinX + m.uz * cosX;
        var x2 = x1 * cosY + z1 * sinY;
        var z2 = -x1 * sinY + z1 * cosY;
        var persp = FOV / (FOV + z2 * R);
        tx = x2 * R * persp;
        ty = y1 * R * persp;
        tsc = Math.min(persp * m.sphereScale, 1.12);   // chặn scale > 1.12 để không mờ
        trot = 0;
        top = map(z2, -1, 1, 1, 0.18);
        tz = 400 + Math.round(persp * 140);
      } else {
        m.py += m.vy * dt; m.px += m.vx * dt;
        if (m.py > 600) { m.py = -600; m.px = rr(-720, 720); }
        if (m.px > 780) m.px = -780; else if (m.px < -780) m.px = 780;
        tx = m.px + Math.sin(t * m.ws1 + m.ph1) * m.aw1;
        ty = m.py;
        trot = Math.sin(t * m.wr + m.phr) * m.arot;
        tsc = m.baseScale;
        top = m.baseOpacity;
        tz = 200 + Math.round(m.layer * 120);
      }
      apply(m, tx, ty, tsc, trot, top, tz, ease);
    }

    // ----- Ảnh nhỏ -----
    for (var q = 0; q < imgs.length; q++) {
      var im = imgs[q];
      var itx, ity, itsc, itrot, itop, itz;
      if (mode === "sphere") {
        // toạ độ đơn vị: vòng bán kính ur, cao uy, quay quanh trục Y
        var ang = im.ua + state.rotY + t * im.ringSpin;
        var ux = Math.cos(ang) * im.ur;
        var uz = Math.sin(ang) * im.ur;
        var uyy = im.uy;
        var y4 = uyy * cosX - uz * sinX;
        var z4 = uyy * sinX + uz * cosX;
        var pr = FOV / (FOV + z4 * R);
        itx = ux * R * pr;
        ity = y4 * R * pr;
        itsc = Math.min(pr * im.sphereScale, 1.0);      // chỉ thu nhỏ layer -> luôn nét
        itrot = 0;
        itop = map(z4, -1, 1, 1, 0.42);
        itz = 460 + Math.round(pr * 150);
      } else {
        im.py += im.vy * dt; im.px += im.vx * dt;
        if (im.py > 620) { im.py = -620; im.px = rr(-680, 680); }
        if (im.px > 740) im.px = -740; else if (im.px < -740) im.px = 740;
        itx = im.px + Math.sin(t * im.swSpd + im.swPh) * im.swAmp;
        ity = im.py;
        itrot = Math.sin(t * im.rSpd + im.rPh) * 8;
        itsc = im.baseScale;
        itop = im.baseOpacity;
        itz = 150 + Math.round(im.layer * 120);
      }
      apply(im, itx, ity, itsc, itrot, itop, itz, ease);
    }

    // ----- Ảnh trung tâm -----
    var pT = (mode === "sphere")
      ? { x: 0, y: Math.sin(t * 0.6) * 10, s: 1.0, z: 9999 }
      : { x: Math.sin(t * 0.13) * 40 - 6, y: Math.cos(t * 0.17) * 30 + 6, s: 0.32, z: 400 };
    photoCur.x += (pT.x - photoCur.x) * ease;
    photoCur.y += (pT.y - photoCur.y) * ease;
    photoCur.s += (pT.s - photoCur.s) * ease;
    photoEl.style.transform =
      "translate(-50%,-50%) translate(" + photoCur.x.toFixed(1) + "px," + photoCur.y.toFixed(1) +
      "px) scale(" + photoCur.s.toFixed(3) + ") translateZ(0)";
    if (photoCur._z !== pT.z) { photoEl.style.zIndex = pT.z; photoCur._z = pT.z; }

    stage.style.transform =
      "translate(-50%,-50%) translate(" + state.panX.toFixed(1) + "px," + state.panY.toFixed(1) +
      "px) scale(" + state.zoom.toFixed(4) + ")";

    requestAnimationFrame(tick);
  }

  function apply(o, tx, ty, tsc, trot, top, tz, ease) {
    o.cx += (tx - o.cx) * ease;
    o.cy += (ty - o.cy) * ease;
    o.csc += (tsc - o.csc) * ease;
    o.crot += (trot - o.crot) * ease;
    o.cop += (top - o.cop) * ease;
    // Chỉ dùng transform + opacity (đã lên layer GPU) — không blur, không đổi layout.
    o.el.style.transform =
      "translate(-50%,-50%) translate(" + o.cx.toFixed(1) + "px," + o.cy.toFixed(1) +
      "px) scale(" + o.csc.toFixed(3) + ") rotate(" + o.crot.toFixed(2) + "deg) translateZ(0)";
    if ((o._op === undefined) || Math.abs(o.cop - o._op) > 0.004) {
      o.el.style.opacity = o.cop.toFixed(3);
      o._op = o.cop;
    }
    if (o._z !== tz) { o.el.style.zIndex = tz; o._z = tz; }
  }
  requestAnimationFrame(tick);

  // ---------- Nút gom thành hình cầu ----------
  function setMode(next) {
    mode = next;
    var on = mode === "sphere";
    document.body.classList.toggle("mode-sphere", on);
    heartsLayer.style.opacity = on ? "0.22" : "1";
    state.velX = state.velY = 0;
    state.panX = state.panY = 0;
    if (on) { state.rotX = 0; state.zoomTarget = fitSphereZoom(); }
    else { state.zoomTarget = initZoom; }
    if (revealLabel) revealLabel.textContent = on ? "Về mưa lời chúc" : "Gom thành hình cầu";
    if (hintEl) hintEl.style.opacity = "0";
  }
  revealBtn.addEventListener("click", function () {
    setMode(mode === "sphere" ? "scatter" : "sphere");
  });

  // ---------- Zoom ----------
  function setZoom(z) { state.zoomTarget = clamp(z, MINZ, MAXZ); }
  document.getElementById("zoom-in").addEventListener("click", function () { setZoom(state.zoomTarget * 1.2); });
  document.getElementById("zoom-out").addEventListener("click", function () { setZoom(state.zoomTarget / 1.2); });
  document.getElementById("zoom-reset").addEventListener("click", function () {
    state.zoomTarget = (mode === "sphere") ? fitSphereZoom() : initZoom;
    state.panX = state.panY = 0;
    state.rotX = state.rotY = state.velX = state.velY = 0;
  });
  viewport.addEventListener("wheel", function (e) {
    e.preventDefault();
    setZoom(state.zoomTarget * (e.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  // ---------- Kéo / Pinch ----------
  var drag = { active: false, x: 0, y: 0 };
  var pointers = new Map();
  var pinch = { active: false, dist: 0, zoom: 1 };

  function onDown(e) {
    if (e.target.closest(".hud")) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    viewport.setPointerCapture(e.pointerId);
    if (pointers.size === 2) {
      var p = Array.from(pointers.values());
      pinch.active = true;
      pinch.dist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      pinch.zoom = state.zoom;
    } else {
      drag.active = true; drag.x = e.clientX; drag.y = e.clientY;
      viewport.classList.add("dragging");
    }
  }
  function onMove(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.active && pointers.size === 2) {
      var p = Array.from(pointers.values());
      var dd = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (pinch.dist > 0) {
        var z = clamp(pinch.zoom * (dd / pinch.dist), MINZ, MAXZ);
        state.zoom = z; state.zoomTarget = z;
      }
      return;
    }
    if (!drag.active) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    drag.x = e.clientX; drag.y = e.clientY;
    if (mode === "sphere") {
      state.rotY += dx * 0.006;
      state.rotX = clamp(state.rotX + dy * 0.006, -1.15, 1.15);
      state.velY = dx * 0.006 * 0.5;
      state.velX = dy * 0.006 * 0.5;
    } else if (state.zoom > 1.02) {
      state.panX += dx; state.panY += dy;
    }
  }
  function onUp(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch.active = false;
    if (pointers.size === 0) { drag.active = false; viewport.classList.remove("dragging"); }
  }
  viewport.addEventListener("pointerdown", onDown);
  viewport.addEventListener("pointermove", onMove);
  viewport.addEventListener("pointerup", onUp);
  viewport.addEventListener("pointercancel", onUp);

  var lastTap = 0;
  viewport.addEventListener("pointerup", function (e) {
    if (e.target.closest(".hud")) return;
    var nowT = performance.now();
    if (nowT - lastTap < 300 && mode === "scatter") {
      setZoom(state.zoomTarget > initZoom * 1.3 ? initZoom : 1.9);
      state.panX = state.panY = 0;
    }
    lastTap = nowT;
  });

  window.addEventListener("resize", function () {
    initZoom = fitScatterZoom();
    state.zoomTarget = (mode === "sphere") ? fitSphereZoom() : initZoom;
  });

  // ---------- Tiêu đề ----------
  var nm = (CFG.recipientName || "").trim();
  document.getElementById("main-title").textContent =
    nm ? ("Chúc Mừng Sinh Nhật " + nm) : (CFG.headline || "Chúc Mừng Sinh Nhật");
  if (CFG.birthDate) document.getElementById("main-sub").textContent = CFG.birthDate;

  initStars(document.getElementById("stars"), { count: 110, speed: 0.5 });
  setTimeout(function () { if (hintEl) hintEl.style.opacity = "0"; }, 6000);
})();
