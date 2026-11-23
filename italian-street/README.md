# Italian Street by Nacho García · web

Web de una sola página para Italian Street (Av. Jane Bowles, 17 · Málaga).
HTML + CSS + JS sin dependencias: abre `index.html` en el navegador.

## Estructura
- `index.html`: contenido y secciones
- `css/styles.css`: diseño (colores y tipografías en `:root`)
- `js/menu.js`: **la carta** (platos, precios, alérgenos) y las pastas de «Crea tu pasta». Para cambiar un precio, solo se toca este archivo.
- `js/main.js`: pestañas, buscador y filtros de la carta, «Crea tu pasta» y **horario** (`HORARIO`, al principio)
- `img/`: portada (sacada de la portada de la carta), logo, pastas

## Pendiente
- [x] Fachada en buena calidad (animación de entrada)
- [x] Fotos del local para el recorrido (baldas, luz, mesa)
- [ ] Fotos de platos (opcional: se pueden añadir a la carta y a la portada)
- [ ] Confirmar con cocina qué platos son vegetarianos (marcados según ingredientes)
- [x] Reseñas reales (js/resenas.js)
- [x] Logo en alta resolución

## Sugerencias (pizarra «Fuera de carta»)
Se cambian sin tocar el diseño, de dos formas (instrucciones en `js/sugerencias.js`):
- **Hoja de Google** (recomendado): importa `sugerencias-plantilla.csv` en una hoja, publícala como CSV y pega el enlace en `HOJA_CSV`. Desde entonces basta con editar la hoja.
- **A mano**: editar la lista `SUGERENCIAS` y volver a publicar.
