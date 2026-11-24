/* =========================================================
   Street Beef · «Elige tu corte»: la cámara de maduración
   La cámara se abre al pulsar la puerta (o sola, al llegar a
   ella). Dentro, cada corte de la brasa está en una balda con su
   etiqueta; al elegirlo se ve la foto en grande, que crece con el
   peso, y el ticket calcula el precio.
   Los cortes y precios salen de js/menu.js (platos de «A la
   brasa» con unit: '100 g'); foto y etiqueta, de CORTES_INFO.
   ========================================================= */
(function () {
  var list = document.getElementById('cutList');
  if (!list || typeof MENU === 'undefined') return;
  var brasa = MENU.find(function (c) { return c.id === 'brasa'; });
  var cuts = [brasa.featured].concat(brasa.items).filter(function (i) { return i && i.unit === '100 g'; });

  var cab = document.getElementById('cab');
  var door = document.getElementById('cabDoor');
  var cta = document.getElementById('cabCta');
  var nameEl = document.getElementById('cutName');
  var originEl = document.getElementById('cutOrigin');
  var noteEl = document.getElementById('cutNote');
  var range = document.getElementById('cutWeight');
  var weightEl = document.getElementById('cutGrams');
  var priceEl = document.getElementById('cutPrice');
  var perEl = document.getElementById('cutPer');
  var presets = document.getElementById('cutPresets');
  var photo = document.getElementById('cutPhoto');
  var piece = document.getElementById('piece');
  var tag = document.getElementById('pieceTag');
  var credits = document.getElementById('cutCredits');
  var state = { i: 0, g: +range.value };

  var e = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var info = function (c) { return CORTES_INFO[c.name] || {}; };

  // Baldas: 4 + 3 + 3 piezas
  var rows = [cuts.slice(0, 4), cuts.slice(4, 7), cuts.slice(7)];
  var idx = 0;
  list.innerHTML = rows.map(function (row) {
    return '<div class="shelf">' + row.map(function (c) {
      var i = idx++, inf = info(c);
      return '<button type="button" class="cut" role="radio" aria-checked="false" data-i="' + i + '" aria-label="' + e(c.name) + ', ' + eur(c.price) + ' cada 100 g" tabindex="-1">' +
        '<span class="cut__img"><img src="' + e(inf.foto || '') + '" alt="" width="800" height="600" loading="lazy"></span>' +
        '<span class="cut__tag"><b>' + e(inf.corto || c.name) + '</b><small>' + eur(c.price) + '</small></span>' +
        '</button>';
    }).join('') + '<span class="shelf__rack" aria-hidden="true"></span></div>';
  }).join('');
  var buttons = [].slice.call(list.querySelectorAll('.cut'));

  // Créditos de las fotos (obligatorios por la licencia)
  var seen = {};
  if (credits) credits.innerHTML = 'Fotos de referencia: ' + cuts.map(function (c) {
    var cr = info(c).credito; if (!cr) return '';
    var k = cr.url; if (seen[k]) return ''; seen[k] = 1;
    return e(c.name) + ' — <a href="' + e(cr.url) + '" target="_blank" rel="noopener">' + e(cr.autor) + '</a> (<a href="' + e(cr.lic) + '" target="_blank" rel="noopener">' + e(cr.licencia) + '</a>)';
  }).filter(Boolean).join(' · ') + '.';

  // ---------- Abrir / cerrar ----------
  function setOpen(open) {
    cab.classList.toggle('is-open', open);
    door.setAttribute('aria-expanded', String(open));
    cta.textContent = open ? 'Cerrar' : 'Abrir la cámara';
    buttons.forEach(function (b, i) { b.tabIndex = open && i === state.i ? 0 : -1; });
  }
  door.addEventListener('click', function () { setOpen(!cab.classList.contains('is-open')); });
  // Se abre sola la primera vez que aparece en pantalla
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { io.disconnect(); setTimeout(function () { setOpen(true); }, 700); }
    }, { threshold: .55 });
    io.observe(cab);
  } else setOpen(true);

  // ---------- Elegir pieza ----------
  function paint(swap) {
    var c = cuts[state.i], inf = info(c);
    buttons.forEach(function (b, i) {
      var on = i === state.i;
      b.setAttribute('aria-checked', String(on));
      if (cab.classList.contains('is-open')) b.tabIndex = on ? 0 : -1;
    });
    nameEl.textContent = c.name;
    originEl.textContent = inf.origen || 'Al peso';
    noteEl.textContent = inf.nota || '';
    var gtxt = state.g >= 1000 ? (state.g / 1000).toFixed(state.g % 1000 ? 2 : 0).replace('.', ',') + ' kg' : state.g + ' g';
    weightEl.textContent = gtxt;
    priceEl.textContent = eur(c.price * state.g / 100);
    perEl.textContent = eur(c.price) + ' cada 100 g';
    range.style.setProperty('--p', ((state.g - range.min) / (range.max - range.min) * 100).toFixed(1) + '%');
    [].forEach.call(presets.children, function (b) { b.setAttribute('aria-pressed', String(+b.dataset.g === state.g)); });
    // la pieza: foto del corte, más grande cuanto más pesa
    if (swap && inf.foto && photo.getAttribute('src') !== inf.foto) {
      piece.classList.remove('is-in'); void piece.offsetWidth;
      photo.src = inf.foto; piece.classList.add('is-in');
    }
    photo.alt = c.name;
    piece.style.setProperty('--s', (.72 + (state.g - 300) / 1200 * .28).toFixed(3));
    tag.textContent = (inf.corto || c.name) + ' · ' + gtxt;
  }

  list.addEventListener('click', function (ev) {
    var b = ev.target.closest('.cut');
    if (!b) return;
    state.i = +b.dataset.i;
    paint(true);
    if (window.matchMedia('(max-width: 900px)').matches) piece.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  list.addEventListener('keydown', function (ev) {
    var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[ev.key];
    if (!d) return;
    ev.preventDefault();
    state.i = (state.i + d + cuts.length) % cuts.length;
    paint(true);
    buttons[state.i].focus();
  });
  range.addEventListener('input', function () { state.g = +range.value; paint(false); });
  presets.addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    state.g = +b.dataset.g; range.value = state.g; paint(false);
  });
  paint(true);
})();
