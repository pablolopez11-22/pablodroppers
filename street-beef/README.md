# Street Beef by Nacho García · web

Web de una sola página para Street Beef (Av. Jane Bowles, 17, Local 1 · Málaga).
Misma estructura que la web de Italian Street (rama `claude/stoic-hawking-lg259l`).
HTML + CSS + JS sin dependencias: abre `index.html` en el navegador.

## Estructura
- `index.html`: contenido y secciones
- `css/styles.css`: diseño (colores y tipografías en `:root`)
- `js/menu.js`: **la carta** (platos y precios). Para cambiar un precio, solo se toca este archivo
  y después se ejecuta `node seo/generar.mjs` (actualiza la copia para buscadores).
- `js/main.js`: pestañas y buscador de la carta, y **horario** (`HORARIO`, al principio)
- `js/cortes.js`: «Elige tu corte» (calculadora de la brasa, usa los precios de `menu.js`)
- `js/sugerencias.js`: pizarra «Sugerencias del chef»
- `js/reservas.js`: ventana de reserva (WhatsApp o teléfono)
- `img/logo-original.webp`: el logo oficial (rótulo negro con neón rojo)
- `img/rotulo-3d.webp`: el logo preparado para la portada (con el halo de neón transparente)
- `img/letras-claro.webp` / `img/letras-oscuro.webp`: las letras del logo (cabecera, pie y ticket)
- `img/logo-dibujo.svg`: el logo anterior (dibujo a línea) en vector

## Pendiente
- [ ] Fotos del local (sala, rincón motero, brasa, terraza) para «El local»
- [x] Moto de la portada: Harley antigua dibujada en vector (`img/moto.svg`). Si hay foto de una moto real del local, se puede cambiar
- [ ] Foto de la fachada para la animación de entrada
- [ ] Confirmar que el 744 70 42 32 tiene WhatsApp (`PHONE` en `js/reservas.js`)
- [ ] Instagram del local (pie de página)
- [ ] Reseñas reales para `js/resenas.js` (opcional)
