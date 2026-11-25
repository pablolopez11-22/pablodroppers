/* =========================================================
   Street Beef · testimonios
   Reseñas REALES de Google, copiadas tal cual (fuente: ficha de
   Google del local, recogidas en gastroranking.es/r/street-tapas_240412).
   Se firman solo con el nombre y la inicial del apellido.
   Si la lista está vacía, la sección de testimonios no se muestra.
   ========================================================= */
const RESENAS = [
  { texto: 'Un lugar 10 de 10 que da confianza nada más entrar por la puerta, los camareros muy atentos y simpáticos, la comida excelente y el servicio super rápido.',
    nombre: 'Sara C.', estrellas: 5, fuente: 'Google', fecha: 'Diciembre 2025' },
  { texto: 'Siempre es un acierto ir, pidas lo que pidas estará bueno, trato inmejorable, desde el primero al último, capitaneados por Nacho.',
    nombre: 'Saúl B.', estrellas: 5, fuente: 'Google', fecha: 'Noviembre 2025' },
  { texto: 'Fui a tomarme una cerveza y la atención y el servicio fue de 10. Al final acabamos cenando maravillosamente. Buenos precios y buena calidad.',
    nombre: 'José Manuel D.', estrellas: 5, fuente: 'Google', fecha: 'Diciembre 2025' },
  { texto: 'Todo lo que comimos allí estaba muy bueno, el personal inmejorable y sus precios justos. Trato, servicio y calidad excelentes. Se ha convertido en uno de mis sitios favoritos.',
    nombre: 'Fernando O.', estrellas: 5, fuente: 'Google', fecha: 'Noviembre 2025' },
  { texto: 'Mi esposa y yo lo pasamos de maravilla. La comida ha sido la mejor que hemos probado en Málaga hasta ahora. Volveremos enseguida.',
    nombre: 'D4rKOw3N', estrellas: 5, fuente: 'Google', fecha: 'Noviembre 2025' },
  { texto: 'Llegamos por casualidad pero hemos salido muy contentos: los camareros súper amables y muy simpáticos, la comida estupenda, el sitio muy bonito y tranquilo. Os lo recomiendo 100%.',
    nombre: 'Cristina B.', estrellas: 5, fuente: 'Google', fecha: 'Octubre 2025' },
];

(function () {
  var box = document.getElementById('quotes');
  if (!box || !RESENAS.length) return;
  box.innerHTML = RESENAS.map(function (r) {
    var n = Math.max(1, Math.min(5, r.estrellas || 5));
    return '<figure class="quote">' +
      '<span class="quote__stars" aria-label="' + n + ' de 5 estrellas">' + '★★★★★'.slice(0, n) + '</span>' +
      '<blockquote>' + esc(r.texto) + '</blockquote>' +
      '<figcaption><strong>' + esc(r.nombre) + '</strong>' + (r.fuente ? ' · ' + esc(r.fuente) : '') + (r.fecha ? ' · ' + esc(r.fecha) : '') + '</figcaption>' +
      '</figure>';
  }).join('');
  box.hidden = false;
})();
