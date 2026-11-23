/* =========================================================
   Italian Street · Crea tu pasta: «Il viaggio della pasta»
   Mapa de Italia con el origen de cada salsa. Al tocar una
   región se ilumina y se muestran sus salsas, su historia y la
   pasta que recomienda la casa.
   Usa PASTAS, SALSA_STYLE y MENU (js/menu.js) y las utilidades
   de js/main.js ($, esc, euro, alText, reduceMotion).
   ========================================================= */
(function () {
  var svg = document.getElementById('mapSvg');
  if (!svg) return;

  // Regiones (coordenadas en el mapa) y salsas de la carta que vienen de cada una
  var REGIONES = [
    { id: 'liguria', nombre: 'Liguria', ciudad: 'Génova', x: 120, y: 171.8, lado: 'left',
      salsas: { 'Pesto Verde': 'Nace en Génova: albahaca, piñones, ajo, queso y aceite, majados en mortero de mármol.' } },
    { id: 'emilia', nombre: 'Emilia-Romaña', ciudad: 'Bolonia', x: 219.7, y: 169.9, lado: 'right',
      salsas: { 'Boloñesa': 'En Bolonia la llaman ragù y se cocina a fuego muy lento, durante horas, los domingos en familia.' } },
    { id: 'umbria', nombre: 'Umbría', ciudad: 'Norcia', x: 292.6, y: 262, lado: 'right',
      salsas: { 'Bosco Nero': 'Setas y trufa negra: el sabor de los bosques de Umbría, tierra de trufas.' } },
    { id: 'lazio', nombre: 'Lacio', ciudad: 'Roma', x: 267.6, y: 320.1, lado: 'left',
      salsas: {
        'Carbonara': 'El gran clásico de Roma: huevo, pecorino romano, guanciale y mucha pimienta negra.',
        'Amatriciana': 'Viene de Amatrice, un pueblo de montaña del Lacio: guanciale, tomate y pecorino.',
        'Arrabbiata': '«Arrabbiata» significa «enfadada» en italiano, por su punto picante. Muy romana.'
      } },
    { id: 'campania', nombre: 'Campania', ciudad: 'Nápoles', x: 345, y: 380, lado: 'right',
      salsas: {
        'Puttanesca': 'Salsa napolitana de despensa: tomate, aceitunas, alcaparras y anchoas.',
        'Vongole': 'Las almejas del golfo de Nápoles, con ajo, vino blanco y perejil.',
        'Frutti di Mare': 'El mar del sur de Italia en el plato: gambas, mejillones y calamares.'
      } },
    { id: 'malaga', nombre: 'Málaga', ciudad: 'Creaciones de la casa', x: 52, y: 598, lado: 'right', casa: true,
      salsas: {
        'Salmone Napoli': 'Una receta de nuestra cocina: salmón flambeado con vodka en salsa cremosa de tomate.',
        'Gamberi al Coñac': 'Creación de la casa: gambas flambeadas con coñac, tomate italiano y pecorino.'
      } }
  ];

  var SALSAS = {};
  MENU.find(function (c) { return c.id === 'pasta'; }).items.forEach(function (it) {
    SALSAS[it.name] = Object.assign({}, it, SALSA_STYLE[it.name]);
  });
  var isMatch = function (p, s) { return p.goes.some(function (g) { return s.kind.indexOf(g) !== -1; }); };
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var state = { region: 'lazio', salsa: 'Carbonara', pasta: null };

  // ---------- Puntos del mapa ----------
  var hubsG = document.getElementById('mapHubs');
  REGIONES.forEach(function (r) {
    var g = el('g', { class: 'hub' + (r.casa ? ' hub--casa' : ''), transform: 'translate(' + r.x + ' ' + r.y + ')', tabindex: '0', role: 'button',
      'aria-label': r.nombre + ', ' + r.ciudad + ': ' + Object.keys(r.salsas).join(', ') }, hubsG);
    g.dataset.id = r.id;
    el('circle', { class: 'hub__glow', r: 64, fill: 'url(#hubGlow)' }, g);
    el('circle', { class: 'hub__ring', r: 13 }, g);
    el('circle', { class: 'hub__dot', r: 7 }, g);
    el('circle', { class: 'hub__hit', r: 26 }, g);
    var n = Object.keys(r.salsas).length;
    var t = el('text', { class: 'hub__label', x: r.lado === 'left' ? -20 : 20, y: -3, 'text-anchor': r.lado === 'left' ? 'end' : 'start' }, g);
    t.textContent = r.casa ? r.nombre : r.ciudad;
    var sub = el('text', { class: 'hub__sub', x: r.lado === 'left' ? -20 : 20, y: 13, 'text-anchor': r.lado === 'left' ? 'end' : 'start' }, g);
    sub.textContent = r.casa ? 'Creaciones de la casa' : n + (n === 1 ? ' salsa' : ' salsas');
    var pick = function () { selectRegion(r.id); };
    g.addEventListener('click', pick);
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
  });

  function selectRegion(id) {
    var r = REGIONES.find(function (x) { return x.id === id; });
    state.region = id;
    state.salsa = Object.keys(r.salsas)[0];
    state.pasta = null;
    render(true);
  }

  // ---------- Panel ----------
  var panel = document.querySelector('.mappa__panel');
  function render(animate) {
    var r = REGIONES.find(function (x) { return x.id === state.region; });
    var s = SALSAS[state.salsa];
    var recs = PASTAS.filter(function (p) { return isMatch(p, s); });
    if (!state.pasta) state.pasta = (recs[0] || PASTAS[0]).id;
    var p = PASTAS.find(function (x) { return x.id === state.pasta; });

    hubsG.querySelectorAll('.hub').forEach(function (g) {
      var on = g.dataset.id === state.region;
      g.classList.toggle('is-active', on);
      g.setAttribute('aria-pressed', String(on));
    });

    $('#mapRegion').textContent = r.casa ? 'Málaga · Creaciones de la casa' : r.nombre + ' · ' + r.ciudad;
    $('#mapTabs').innerHTML = Object.keys(r.salsas).map(function (name) {
      return '<button type="button" class="mtab" data-salsa="' + esc(name) + '" aria-pressed="' + (name === state.salsa) + '">' + esc(name) + '</button>';
    }).join('');
    $('#mapTabs').hidden = Object.keys(r.salsas).length < 2;

    $('#plateName').innerHTML = esc(p.name) + ' <em>' + esc(s.name) + '</em>';
    $('#mapStory').textContent = r.salsas[state.salsa];
    $('#mapPastas').innerHTML = PASTAS.map(function (x) {
      var rec = isMatch(x, s);
      return '<button type="button" class="mpasta' + (rec ? ' is-rec' : '') + '" data-pasta="' + x.id + '" aria-pressed="' + (x.id === p.id) + '" aria-label="' + esc(x.name) + (rec ? ', recomendada por la casa' : '') + '">' +
        '<img src="' + x.img + '" alt="" width="56" height="56"><span>' + esc(x.name) + '</span>' + (rec ? '<i aria-hidden="true">★</i>' : '') + '</button>';
    }).join('');
    $('#platePrice').textContent = euro(s.price);
    $('#plateDesc').textContent = s.desc;
    $('#plateAl').textContent = 'Alérgenos: ' + alText(s.al);

    if (animate && !reduceMotion) { panel.classList.remove('is-in'); void panel.offsetWidth; panel.classList.add('is-in'); }
  }

  document.getElementById('mapTabs').addEventListener('click', function (e) {
    var b = e.target.closest('.mtab'); if (!b) return;
    state.salsa = b.dataset.salsa; state.pasta = null; render(true);
  });
  document.getElementById('mapPastas').addEventListener('click', function (e) {
    var b = e.target.closest('.mpasta'); if (!b) return;
    state.pasta = b.dataset.pasta; render(false);
  });

  render(false);
})();
