/* =========================================================
   Street Beef · «Elige tu corte»: la cámara de maduración del bar
   Foto real de la cámara con puntos sobre cada pieza; debajo, la
   lista con todos los cortes. Al elegir uno se ve la pieza en
   grande (que crece con el peso) y el ticket calcula el precio.
   Los cortes y precios salen de js/menu.js (platos de «A la
   brasa» con unit: '100 g'); foto y etiqueta, de CORTES_INFO.
   ========================================================= */
(function () {
  var list = document.getElementById('cutList');
  if (!list || typeof MENU === 'undefined') return;
  var brasa = MENU.find(function (c) { return c.id === 'brasa'; });
  var cuts = [brasa.featured].concat(brasa.items).filter(function (i) { return i && i.unit === '100 g'; });

  var spots = document.getElementById('cutSpots');
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
  var e = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };
  var info = function (c) { return CORTES_INFO[c.name] || {}; };

  // Primero las piezas que están en la cámara del bar
  cuts.sort(function (a, b) { return (info(b).real ? 1 : 0) - (info(a).real ? 1 : 0); });
  var state = { i: 0, g: +range.value };

  // Puntos sobre la foto de la cámara
  spots.innerHTML = cuts.map(function (c, i) {
    var inf = info(c); if (!inf.spot) return '';
    return '<button type="button" class="spot" data-i="' + i + '" style="left:' + inf.spot[0] + '%;top:' + inf.spot[1] + '%" aria-label="' + e(c.name) + '">' +
      '<span class="spot__dot"></span><span class="spot__label">' + e(inf.corto || c.name) + ' · ' + eur(c.price) + '<small>/100 g</small></span></button>';
  }).join('');
  // Lista con todos los cortes
  list.innerHTML = cuts.map(function (c, i) {
    var inf = info(c);
    return '<button type="button" class="cut" role="radio" aria-checked="false" data-i="' + i + '" tabindex="-1">' +
      (inf.real ? '<span class="cut__live" title="En la cámara">En cámara</span>' : '') +
      '<span class="cut__name">' + e(inf.corto || c.name) + '</span><span class="cut__price">' + eur(c.price) + '</span></button>';
  }).join('');
  var buttons = [].slice.call(list.querySelectorAll('.cut'));
  var spotBtns = [].slice.call(spots.querySelectorAll('.spot'));

  // Créditos de las fotos de referencia (las que no son del bar)
  var seen = {};
  var cr = cuts.map(function (c) {
    var k = info(c).credito; if (!k || seen[k.url]) return ''; seen[k.url] = 1;
    return e(c.name) + ' — <a href="' + e(k.url) + '" target="_blank" rel="noopener">' + e(k.autor) + '</a> (<a href="' + e(k.lic) + '" target="_blank" rel="noopener">' + e(k.licencia) + '</a>)';
  }).filter(Boolean);
  if (credits) credits.innerHTML = cr.length ? 'Fotos de referencia de los cortes que no están en la cámara: ' + cr.join(' · ') + '.' : '';

  // ---------- Elegir pieza ----------
  function paint(swap) {
    var c = cuts[state.i], inf = info(c);
    buttons.forEach(function (b, i) {
      var on = i === state.i;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    spotBtns.forEach(function (b) { b.classList.toggle('is-on', +b.dataset.i === state.i); });
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
    tag.textContent = (inf.real ? 'Pieza en cámara · ' : 'Foto de referencia · ') + gtxt;
  }

  function pick(ev) {
    var b = ev.target.closest('.cut, .spot');
    if (!b) return;
    state.i = +b.dataset.i;
    paint(true);
    if (window.matchMedia('(max-width: 900px)').matches) piece.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  list.addEventListener('click', pick);
  spots.addEventListener('click', pick);
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
