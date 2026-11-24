/* =========================================================
   Street Beef · «Elige tu corte»
   Calculadora de la brasa: eliges la carne y el peso y te dice
   cuánto cuesta. Los cortes y precios salen de js/menu.js
   (platos de «A la brasa» con unit: '100 g'); el origen y la
   frase de cada corte están en CORTES_INFO (también en menu.js).
   ========================================================= */
(function () {
  var list = document.getElementById('cutList');
  if (!list || typeof MENU === 'undefined') return;
  var brasa = MENU.find(function (c) { return c.id === 'brasa'; });
  var cuts = [brasa.featured].concat(brasa.items).filter(function (i) { return i && i.unit === '100 g'; });

  var nameEl = document.getElementById('cutName');
  var originEl = document.getElementById('cutOrigin');
  var noteEl = document.getElementById('cutNote');
  var range = document.getElementById('cutWeight');
  var weightEl = document.getElementById('cutGrams');
  var priceEl = document.getElementById('cutPrice');
  var perEl = document.getElementById('cutPer');
  var presets = document.getElementById('cutPresets');
  var state = { i: 0, g: +range.value };

  var e = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var eur = function (n) { return n.toFixed(2).replace('.', ',') + ' €'; };

  list.innerHTML = cuts.map(function (c, i) {
    var info = CORTES_INFO[c.name] || {};
    return '<button type="button" class="cut" role="radio" aria-checked="false" data-i="' + i + '">' +
      '<span class="cut__name">' + e(c.name) + '</span>' +
      (info.origen ? '<span class="cut__origin">' + e(info.origen) + '</span>' : '') +
      '<span class="cut__price">' + eur(c.price) + '<small>/100 g</small></span>' +
      '</button>';
  }).join('');
  var buttons = [].slice.call(list.querySelectorAll('.cut'));

  function paint() {
    var c = cuts[state.i], info = CORTES_INFO[c.name] || {};
    buttons.forEach(function (b, i) {
      var on = i === state.i;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    nameEl.textContent = c.name;
    originEl.textContent = info.origen || '';
    originEl.hidden = !info.origen;
    noteEl.textContent = info.nota || c.desc || '';
    weightEl.textContent = state.g >= 1000 ? (state.g / 1000).toFixed(state.g % 1000 ? 2 : 0).replace('.', ',') + ' kg' : state.g + ' g';
    priceEl.textContent = eur(c.price * state.g / 100);
    perEl.textContent = eur(c.price) + ' cada 100 g';
    range.style.setProperty('--p', ((state.g - range.min) / (range.max - range.min) * 100).toFixed(1) + '%');
    [].forEach.call(presets.children, function (b) { b.setAttribute('aria-pressed', String(+b.dataset.g === state.g)); });
  }

  list.addEventListener('click', function (ev) {
    var b = ev.target.closest('.cut');
    if (!b) return;
    state.i = +b.dataset.i;
    paint();
  });
  list.addEventListener('keydown', function (ev) {
    var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[ev.key];
    if (!d) return;
    ev.preventDefault();
    state.i = (state.i + d + cuts.length) % cuts.length;
    paint();
    buttons[state.i].focus();
  });
  range.addEventListener('input', function () { state.g = +range.value; paint(); });
  presets.addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    state.g = +b.dataset.g; range.value = state.g; paint();
  });
  paint();
})();
