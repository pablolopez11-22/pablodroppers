/* =========================================================
   Italian Street · recorrido por el local
   Carrusel libre: se desliza con el dedo o con las flechas.
   No obliga a recorrerlo para seguir bajando por la web.
   ========================================================= */
(function () {
  var track = document.getElementById('tourTrack');
  if (!track) return;
  var bar = document.getElementById('tourBar');
  var prev = document.getElementById('tourPrev');
  var next = document.getElementById('tourNext');
  var frames = [].slice.call(track.querySelectorAll('.stop__frame img'));
  var ticking = false;

  function update() {
    ticking = false;
    var max = track.scrollWidth - track.clientWidth;
    var p = max > 0 ? track.scrollLeft / max : 0;
    if (bar) bar.style.transform = 'scaleX(' + Math.max(.06, p) + ')';
    if (prev) prev.disabled = track.scrollLeft < 8;
    if (next) next.disabled = track.scrollLeft > max - 8;
    // Las fotos se acercan suavemente al pasar por el centro
    var r0 = track.getBoundingClientRect(), cx = r0.left + r0.width / 2;
    frames.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect();
      var d = Math.min(1, Math.abs(r.left + r.width / 2 - cx) / (r0.width / 2 || 1));
      img.style.setProperty('--zoom', (1 + d * 0.1).toFixed(3));
    });
  }
  function go(dir) {
    var item = track.querySelector('.stop');
    var step = item ? item.getBoundingClientRect().width / (window.__Z || 1) + 40 : track.clientWidth * .8;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });
  track.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();
