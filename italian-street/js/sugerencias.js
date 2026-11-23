/* =========================================================
   Italian Street · Sugerencias («Fuera de carta»)

   DOS FORMAS DE CAMBIARLAS:

   A) Desde una hoja de Google (recomendado, sin tocar código):
      1. Crea una hoja con estas columnas en la primera fila:
           nombre | descripcion | precio | etiqueta | visible
         (etiqueta es opcional: «Nuevo», «Solo viernes»…;
          visible: «sí» o «no» para ocultar una sin borrarla).
      2. Archivo → Compartir → Publicar en la web → la hoja →
         «Valores separados por comas (.csv)» → Publicar.
      3. Pega el enlace que te da en HOJA_CSV (abajo) y vuelve a
         publicar la web UNA sola vez. Desde entonces, lo que
         cambies en la hoja aparece en la web (tarda unos minutos).

   B) Editando la lista SUGERENCIAS de aquí abajo y volviendo a
      publicar la web.

   Si no hay ninguna sugerencia visible, la sección no se muestra.
   ========================================================= */
const HOJA_CSV = '';            // enlace .csv de la hoja publicada
const PERIODO = 'de la semana'; // «del día», «de la semana», «de otoño»…

const SUGERENCIAS = [
  { nombre: 'Pizza Emiliana', descripcion: 'Mortadela, burrata cremosa, crema de pistacho, ricotta y pistacho molido.', precio: '15,00 €', etiqueta: 'La especialidad' },
  { nombre: 'Tortellini Ricotta e Tartufo', descripcion: 'Rellenos de ricotta, con crema suave de nata, pecorino romano y un toque de trufa.', precio: '14,50 €' },
  { nombre: 'Tiramisú al Pistacho', descripcion: 'Bizcocho bañado en café, mascarpone y crema de pistacho.', precio: '6,50 €', etiqueta: 'Postre' },
];

(function () {
  var section = document.getElementById('sugerencias');
  var list = document.getElementById('suggList');
  if (!section || !list) return;
  document.getElementById('suggPeriod').textContent = PERIODO;

  function pintar(items) {
    items = items.filter(function (s) { return s.nombre && !/^\s*no\s*$/i.test(s.visible || ''); });
    if (!items.length) { section.hidden = true; return; }
    list.innerHTML = items.map(function (s) {
      var precio = String(s.precio || '').trim();
      if (precio && /^\d+([.,]\d+)?$/.test(precio)) precio = euro(parseFloat(precio.replace(',', '.')));
      return '<li class="sitem">' +
        '<span class="sitem__name">' + esc(s.nombre) + (s.etiqueta ? '<span class="sitem__tag">' + esc(s.etiqueta) + '</span>' : '') + '</span>' +
        '<span class="sitem__price">' + esc(precio) + '</span>' +
        (s.descripcion ? '<p class="sitem__desc">' + esc(s.descripcion) + '</p>' : '') +
        '</li>';
    }).join('');
    section.hidden = false;
  }

  // Lector de CSV sencillo (admite comillas y comas dentro de los textos)
  function leerCSV(txt) {
    var filas = [], fila = [], campo = '', q = false;
    for (var i = 0; i < txt.length; i++) {
      var c = txt[i];
      if (q) { if (c === '"' && txt[i + 1] === '"') { campo += '"'; i++; } else if (c === '"') q = false; else campo += c; }
      else if (c === '"') q = true;
      else if (c === ',') { fila.push(campo); campo = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && txt[i + 1] === '\n') i++; fila.push(campo); filas.push(fila); fila = []; campo = ''; }
      else campo += c;
    }
    if (campo || fila.length) { fila.push(campo); filas.push(fila); }
    var cab = (filas.shift() || []).map(function (h) { return h.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); });
    return filas.filter(function (f) { return f.some(function (x) { return x.trim(); }); }).map(function (f) {
      var o = {}; cab.forEach(function (h, k) { o[h] = (f[k] || '').trim(); }); return o;
    });
  }

  pintar(SUGERENCIAS);
  if (HOJA_CSV) {
    fetch(HOJA_CSV + (HOJA_CSV.indexOf('?') < 0 ? '?' : '&') + 't=' + Date.now())
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { var items = leerCSV(t); if (items.length) pintar(items); })
      .catch(function () { /* sin conexión con la hoja: se quedan las de la lista */ });
  }
})();
