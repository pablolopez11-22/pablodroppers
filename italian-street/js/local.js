/* =========================================================
   Italian Street · recorrido por el local
   En escritorio la sección se queda fija y, al bajar, el
   recorrido avanza de lado. En móvil se desliza con el dedo.
   ========================================================= */
(function () {
  var tour = document.getElementById('local');
  var track = document.getElementById('tourTrack');
  var bar = document.getElementById('tourBar');
  if (!tour || !track) return;

  var mqWide = window.matchMedia('(min-width: 901px) and (min-height: 560px)');
  var mqCalm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var distance = 0, ticking = false;
  var frames = [].slice.call(track.querySelectorAll('.stop__frame img'));

  function setup() {
    var pin = mqWide.matches && !mqCalm.matches;
    tour.classList.toggle('is-pinned', pin);
    track.style.transform = '';
    if (!pin) { tour.style.height = ''; return; }
    // Con el escalado de pantallas grandes, las medidas de la ventana van en
    // píxeles reales y las de la página en píxeles escalados (Z)
    var Z = window.__Z || 1;
    distance = Math.max(0, track.scrollWidth - window.innerWidth / Z);
    // Altura de la sección = lo que hay que bajar para recorrer todo el ancho
    tour.style.height = (window.innerHeight / Z + distance) + 'px';
    update();
  }

  function update() {
    ticking = false;
    if (!tour.classList.contains('is-pinned')) return;
    var top = tour.getBoundingClientRect().top;
    var p = Math.min(1, Math.max(0, -top / ((distance * (window.__Z || 1)) || 1)));
    track.style.transform = 'translate3d(' + (-p * distance) + 'px, 0, 0)';
    if (bar) bar.style.transform = 'scaleX(' + p + ')';
    // Las fotos se acercan suavemente al pasar por el centro
    var cx = window.innerWidth / 2;
    frames.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect();
      var d = Math.min(1, Math.abs(r.left + r.width / 2 - cx) / cx);
      img.style.setProperty('--zoom', (1 + d * 0.12).toFixed(3));
    });
  }

  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', setup);
  (mqWide.addEventListener ? mqWide.addEventListener('change', setup) : mqWide.addListener(setup));
  window.addEventListener('load', setup);
  setup();
})();
