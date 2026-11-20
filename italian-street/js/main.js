/* =========================================================
   Italian Street · interacción
   La carta y las pastas están en js/menu.js.
   El horario está aquí abajo (HORARIO).
   ========================================================= */

// Horario (0 = domingo … 6 = sábado). slots vacío = cerrado.
const HORARIO = [
  { day: 1, label: 'Lunes',     slots: [['13:00', '16:00']], note: 'cerrado por la noche' },
  { day: 2, label: 'Martes',    slots: [], note: 'cerrado por descanso' },
  { day: 3, label: 'Miércoles', slots: [['13:00', '16:00']], note: 'cerrado por la noche' },
  { day: 4, label: 'Jueves',    slots: [['13:00', '16:00'], ['20:00', '00:00']] },
  { day: 5, label: 'Viernes',   slots: [['13:00', '16:00'], ['20:00', '00:00']] },
  { day: 6, label: 'Sábado',    slots: [['13:00', '16:00'], ['20:00', '00:00']] },
  { day: 0, label: 'Domingo',   slots: [['13:00', '16:00'], ['20:00', '00:00']] },
];

/* ---------- Utilidades ---------- */
const $ = (s, ctx = document) => ctx.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
// Quita tildes y pasa a minúsculas carácter a carácter (mantiene la longitud para poder resaltar)
const fold = (s) => [...s].map((c) => c.normalize('NFD').replace(/[̀-ͯ]/g, '')[0] || c).join('').toLowerCase();
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Cabecera y menú móvil ---------- */
const header = $('.header');
const burger = $('#burger');
const nav = $('#nav');

const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40 || nav.classList.contains('is-open'));
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function setNav(open) {
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
  onScroll();
}
burger.addEventListener('click', () => setNav(burger.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); burger.focus(); } });

/* =========================================================
   CARTA
   ========================================================= */
const menuState = { tab: MENU[0].id, query: '', veg: false, exclude: new Set() };
const tabsEl = $('#tabs');
const panelsEl = $('#menuPanels');
const statusEl = $('#menuStatus');
const searchEl = $('#menuSearch');
const vegBtn = $('#vegToggle');

// Pestañas
MENU.forEach((cat, i) => {
  const b = document.createElement('button');
  b.className = 'tab';
  b.type = 'button';
  b.id = `tab-${cat.id}`;
  b.setAttribute('role', 'tab');
  b.setAttribute('aria-controls', 'menuPanels');
  b.dataset.id = cat.id;
  b.textContent = cat.tab;
  b.addEventListener('click', () => selectTab(cat.id, true));
  b.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = MENU[(i + (e.key === 'ArrowRight' ? 1 : -1) + MENU.length) % MENU.length];
    selectTab(next.id, false);
    $(`#tab-${next.id}`).focus();
  });
  tabsEl.append(b);
});

// Filtro de alérgenos
const allergenList = $('#allergenList');
Object.entries(ALLERGENS).forEach(([key, label]) => {
  const wrap = document.createElement('label');
  wrap.className = 'check';
  wrap.innerHTML = `<input type="checkbox" value="${key}"><span>${esc(label)}</span>`;
  wrap.querySelector('input').addEventListener('change', (e) => {
    e.target.checked ? menuState.exclude.add(key) : menuState.exclude.delete(key);
    const n = menuState.exclude.size;
    const count = $('#allergenCount');
    count.hidden = !n;
    count.textContent = n;
    renderMenu();
  });
  allergenList.append(wrap);
});

vegBtn.addEventListener('click', () => {
  menuState.veg = !menuState.veg;
  vegBtn.setAttribute('aria-pressed', String(menuState.veg));
  renderMenu();
});

let searchTimer;
searchEl.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { menuState.query = searchEl.value.trim(); renderMenu(); }, 120);
});

// Cerrar el panel de alérgenos al pulsar fuera
document.addEventListener('click', (e) => {
  const det = $('#allergenFilter');
  if (det.open && !det.contains(e.target)) det.open = false;
});

function selectTab(id, scroll) {
  menuState.tab = id;
  if (menuState.query) { menuState.query = ''; searchEl.value = ''; }
  renderMenu();
  const t = $(`#tab-${id}`);
  tabsEl.scrollTo({ left: t.offsetLeft - (tabsEl.clientWidth - t.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (scroll) {
    const top = panelsEl.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.scrollY + top - 150, behavior: reduceMotion ? 'auto' : 'smooth' });
  }
}

function passes(item) {
  if (menuState.veg && !item.v) return false;
  if (item.al && item.al.some((a) => menuState.exclude.has(a))) return false;
  if (menuState.query) {
    const q = fold(menuState.query);
    if (!fold(item.name).includes(q) && !fold(item.desc).includes(q)) return false;
  }
  return true;
}

// Resalta el texto buscado (sin tener en cuenta tildes)
function hl(text) {
  if (!menuState.query) return esc(text);
  const q = fold(menuState.query);
  const f = fold(text);
  let out = '', i = 0, j;
  while ((j = f.indexOf(q, i)) !== -1) {
    out += esc(text.slice(i, j)) + '<mark>' + esc(text.slice(j, j + q.length)) + '</mark>';
    i = j + q.length;
  }
  return out + esc(text.slice(i));
}

const tags = (item) =>
  (item.v ? '<span class="veg" title="Vegetariano" aria-label="vegetariano">V</span>' : '') +
  (item.hot ? '<span class="hot" title="Picante" aria-label="picante">🌶</span>' : '');

const alText = (al) => (al && al.length ? al.map((a) => ALLERGENS[a]).join(' · ') : '');

function priceHTML(item) {
  if (item.prices) return `<span class="dish__price dish__price--multi">${item.prices.map(([l, p]) => `<span><small>${esc(l)}</small> ${euro(p)}</span>`).join('')}</span>`;
  return `<span class="dish__price">${euro(item.price)}</span>`;
}

function dishHTML(item) {
  return `<li class="dish">
    <div class="dish__row">
      <h4 class="dish__name">${hl(item.name)} ${tags(item)}</h4>
      <span class="dish__dots" aria-hidden="true"></span>
      ${priceHTML(item)}
    </div>
    <p class="dish__desc">${hl(item.desc)}</p>
    ${item.al ? `<p class="dish__al"><span class="sr-only">Alérgenos: </span>${alText(item.al)}</p>` : ''}
  </li>`;
}

function featuredHTML(f) {
  return `<article class="featured">
    <p class="featured__label">★ ${esc(f.label)}</p>
    <div class="dish__row">
      <h4 class="featured__name">${hl(f.name)} ${tags(f)}</h4>
      <span class="featured__price">${euro(f.price)}</span>
    </div>
    <p class="featured__desc">${hl(f.desc)}</p>
    ${f.flavours ? `<ul class="flavours" aria-label="Sabores">${f.flavours.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    <p class="dish__al dish__al--light"><span class="sr-only">Alérgenos: </span>${alText(f.al)}</p>
  </article>`;
}

function catHTML(cat, items, showFeatured, compact) {
  return `<section class="menu-cat${compact ? ' menu-cat--compact' : ''}" aria-labelledby="h-${cat.id}">
    <header class="menu-cat__head">
      <h3 class="menu-cat__title" id="h-${cat.id}">${esc(cat.title)}</h3>
      ${cat.sub ? `<p class="menu-cat__sub">${esc(cat.sub)}</p>` : ''}
    </header>
    ${showFeatured ? featuredHTML(cat.featured) : ''}
    ${items.length ? `<ul class="dishes">${items.map(dishHTML).join('')}</ul>` : ''}
    ${!compact && cat.cta ? `<a class="menu-cat__cta" href="${cat.cta.href}">${esc(cat.cta.text)} →</a>` : ''}
    ${!compact && cat.fact ? `<aside class="fact"><p class="fact__title">¿Sabías que…?</p><p>${esc(cat.fact)}</p></aside>` : ''}
  </section>`;
}

function renderMenu() {
  const searching = !!menuState.query;
  tabsEl.classList.toggle('is-muted', searching);
  [...tabsEl.children].forEach((t) => {
    const active = !searching && t.dataset.id === menuState.tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active || (searching && t === tabsEl.firstElementChild) ? 0 : -1;
  });

  const cats = searching ? MENU : MENU.filter((c) => c.id === menuState.tab);
  let shown = 0, total = 0, html = '';
  cats.forEach((cat) => {
    const items = cat.items.filter(passes);
    const feat = !!cat.featured && passes(cat.featured);
    total += cat.items.length + (cat.featured ? 1 : 0);
    shown += items.length + (feat ? 1 : 0);
    if (items.length || feat || !searching) html += catHTML(cat, items, feat, searching);
  });

  panelsEl.setAttribute('role', searching ? 'region' : 'tabpanel');
  if (searching) { panelsEl.removeAttribute('aria-labelledby'); panelsEl.setAttribute('aria-label', 'Resultados de búsqueda'); }
  else { panelsEl.removeAttribute('aria-label'); panelsEl.setAttribute('aria-labelledby', `tab-${menuState.tab}`); }
  panelsEl.innerHTML = html;

  const filtered = menuState.veg || menuState.exclude.size > 0;
  let msg = '';
  if (searching) {
    msg = shown
      ? `${shown} ${shown === 1 ? 'plato' : 'platos'} con «${esc(menuState.query)}»`
      : `No encontramos «${esc(menuState.query)}» en la carta. Prueba con otro plato o ingrediente.`;
  } else if (filtered) {
    const hidden = total - shown;
    msg = shown
      ? `Mostrando ${shown} de ${total} platos${hidden ? ` · ${hidden} ocultos por tus filtros` : ''}`
      : 'Ningún plato de esta sección cumple tus filtros. Prueba en otra sección.';
  }
  if (msg) msg += ` <button type="button" class="link-btn" id="clearFilters">Ver toda la carta</button>`;
  statusEl.innerHTML = msg;
  statusEl.hidden = !msg;
  const clear = $('#clearFilters');
  if (clear) clear.addEventListener('click', clearFilters);
}

function clearFilters() {
  menuState.query = ''; searchEl.value = '';
  menuState.veg = false; vegBtn.setAttribute('aria-pressed', 'false');
  menuState.exclude.clear();
  allergenList.querySelectorAll('input').forEach((i) => (i.checked = false));
  $('#allergenCount').hidden = true;
  renderMenu();
}

renderMenu();

/* =========================================================
   CREA TU PASTA
   ========================================================= */
const SALSAS = MENU.find((c) => c.id === 'pasta').items.map((it) => ({ ...it, ...SALSA_STYLE[it.name] }));
const pastaState = { pasta: 'spaghetti', salsa: 'Carbonara' };
const SVGNS = 'http://www.w3.org/2000/svg';
const PASTA_COLOR = '#f2cd6e';
const PASTA_EDGE = '#d6a440';

const isMatch = (pasta, salsa) => pasta.goes.some((g) => salsa.kind.includes(g));

function el(tag, attrs, parent) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.append(n);
  return n;
}
// Pseudoaleatorio estable: cada combinación se dibuja siempre igual
function rng(seed) {
  let s = 7; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const polar = (rand, maxR, cx = 100, cy = 100) => {
  const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * maxR;
  return [cx + Math.cos(a) * d, cy + Math.sin(a) * d];
};
const f1 = (n) => n.toFixed(1);
const rot = (rand, max = 180) => Math.floor(rand() * max);

function drawPasta(g, shape, rand) {
  g.replaceChildren();
  if (shape === 'long' || shape === 'ribbon') {
    const w = shape === 'long' ? 2.6 : 7;
    const count = shape === 'long' ? 18 : 10;
    for (let i = 0; i < count; i++) {
      const r = 12 + rand() * 46, a = rand() * Math.PI * 2, span = 2.4 + rand() * 2;
      const cx = 100 + (rand() - .5) * 16, cy = 100 + (rand() - .5) * 16;
      const pts = [];
      for (let t = 0; t <= 1.0001; t += .08) {
        const ang = a + t * span, rr = r + Math.sin(t * 7) * 3.5;
        pts.push(`${f1(cx + Math.cos(ang) * rr)},${f1(cy + Math.sin(ang) * rr)}`);
      }
      const p = pts.join(' ');
      el('polyline', { points: p, fill: 'none', stroke: PASTA_EDGE, 'stroke-width': w + 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
      el('polyline', { points: p, fill: 'none', stroke: PASTA_COLOR, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    }
    return;
  }
  if (shape === 'gnocchi') {
    for (let i = 0; i < 24; i++) {
      const [x, y] = polar(rand, 54);
      const grp = el('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand)})` }, g);
      el('ellipse', { rx: 9, ry: 6.5, fill: PASTA_COLOR, stroke: PASTA_EDGE, 'stroke-width': 1.2 }, grp);
      for (let k = -1; k <= 1; k++) el('path', { d: `M${k * 3.4 - 1},-5 q2,5 0,10`, fill: 'none', stroke: PASTA_EDGE, 'stroke-width': .9, opacity: .8 }, grp);
    }
    return;
  }
  const big = shape === 'bigtube';
  const count = big ? 18 : 26;
  for (let i = 0; i < count; i++) {
    const [x, y] = polar(rand, 54);
    const len = big ? 22 : 24, thick = big ? 11 : 8, skew = big ? 0 : 4;
    const grp = el('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand)})` }, g);
    el('path', { d: `M${-len / 2 + skew},${-thick / 2} L${len / 2 + skew},${-thick / 2} L${len / 2 - skew},${thick / 2} L${-len / 2 - skew},${thick / 2} Z`, fill: PASTA_COLOR, stroke: PASTA_EDGE, 'stroke-width': 1.3, 'stroke-linejoin': 'round' }, grp);
    for (let k = -2; k <= 2; k++) {
      const xx = k * (len / 6);
      el('line', { x1: xx + skew * .6, y1: -thick / 2 + 1, x2: xx - skew * .6, y2: thick / 2 - 1, stroke: PASTA_EDGE, 'stroke-width': .8, opacity: .7 }, grp);
    }
  }
}

const TOPPINGS = {
  herb(g, rand) {
    for (let i = 0; i < 9; i++) { const [x, y] = polar(rand, 44); el('path', { d: 'M0,-3.2 C2.6,-2 2.6,2 0,3.2 C-2.6,2 -2.6,-2 0,-3.2Z', fill: '#4e8a36', transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand)})` }, g); }
  },
  chive(g, rand) {
    for (let i = 0; i < 14; i++) { const [x, y] = polar(rand, 46); el('rect', { x: f1(x), y: f1(y), width: 5, height: 1.3, rx: .6, fill: '#5d9b3c', transform: `rotate(${rot(rand)} ${f1(x)} ${f1(y)})` }, g); }
  },
  pepper(g, rand) {
    for (let i = 0; i < 30; i++) { const [x, y] = polar(rand, 50); el('circle', { cx: f1(x), cy: f1(y), r: .7, fill: '#2a2420' }, g); }
  },
  chili(g, rand) {
    for (let i = 0; i < 10; i++) { const [x, y] = polar(rand, 44); el('rect', { x: f1(x), y: f1(y), width: 3.5, height: 1.6, rx: .8, fill: '#e0381d', transform: `rotate(${rot(rand)} ${f1(x)} ${f1(y)})` }, g); }
  },
  guanciale(g, rand) {
    for (let i = 0; i < 9; i++) {
      const [x, y] = polar(rand, 40);
      const grp = el('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand)})` }, g);
      el('rect', { x: -4.5, y: -2.6, width: 9, height: 5.2, rx: 1, fill: '#9c4a2c' }, grp);
      el('rect', { x: -4.5, y: -.6, width: 9, height: 1.6, fill: '#f1d6c0', opacity: .9 }, grp);
    }
  },
  mushroom(g, rand) {
    for (let i = 0; i < 7; i++) {
      const [x, y] = polar(rand, 40);
      el('path', { d: 'M-6,0 A6,5 0 0 1 6,0 L2,0 L2,5 L-2,5 L-2,0 Z', fill: '#8b6a4a', stroke: '#5e4630', 'stroke-width': .8, transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand, 360)})` }, g);
    }
  },
  olive(g, rand) {
    for (let i = 0; i < 8; i++) { const [x, y] = polar(rand, 44); el('circle', { cx: f1(x), cy: f1(y), r: 3.4, fill: 'none', stroke: '#2b2622', 'stroke-width': 2.2 }, g); }
  },
  clam(g, rand) {
    for (let i = 0; i < 6; i++) {
      const [x, y] = polar(rand, 42);
      const grp = el('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand, 360)})` }, g);
      el('path', { d: 'M-7,2 A7,7 0 0 1 7,2 Z', fill: '#d9cfc0', stroke: '#8f8273', 'stroke-width': .9 }, grp);
      for (let k = -2; k <= 2; k++) el('line', { x1: 0, y1: 2, x2: k * 2.8, y2: -4, stroke: '#8f8273', 'stroke-width': .5 }, grp);
    }
  },
  shrimp(g, rand) {
    for (let i = 0; i < 6; i++) {
      const [x, y] = polar(rand, 40);
      el('path', { d: 'M-5,-3 A6,6 0 1 0 5,-3', fill: 'none', stroke: '#f08e63', 'stroke-width': 4, 'stroke-linecap': 'round', transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand, 360)})` }, g);
    }
  },
  salmon(g, rand) {
    for (let i = 0; i < 7; i++) {
      const [x, y] = polar(rand, 40);
      const grp = el('g', { transform: `translate(${f1(x)} ${f1(y)}) rotate(${rot(rand)})` }, g);
      el('rect', { x: -4.5, y: -3.5, width: 9, height: 7, rx: 2, fill: '#f29a73' }, grp);
      el('path', { d: 'M-3,-3 q2,3 0,6 M1,-3 q2,3 0,6', fill: 'none', stroke: '#fde1d2', 'stroke-width': .9 }, grp);
    }
  },
  burrata(g) {
    el('circle', { cx: 100, cy: 98, r: 15, fill: '#fbf8f0', stroke: '#e3dccb', 'stroke-width': 1.2 }, g);
    el('path', { d: 'M92,94 q8,-6 15,0', fill: 'none', stroke: '#ffffff', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g);
  },
};

function drawSauce(g, salsa, rand) {
  g.replaceChildren();
  for (let i = 0; i < 8; i++) {
    const [cx, cy] = polar(rand, 32);
    const r = 10 + rand() * 15;
    el('ellipse', { cx: f1(cx), cy: f1(cy), rx: f1(r), ry: f1(r * (.6 + rand() * .4)), fill: salsa.color, opacity: .84, transform: `rotate(${rot(rand)} ${f1(cx)} ${f1(cy)})` }, g);
  }
  // pecorino rallado
  for (let i = 0; i < 22; i++) {
    const [x, y] = polar(rand, 48);
    el('rect', { x: f1(x), y: f1(y), width: 2.2, height: 1.3, fill: '#fff8e4', opacity: .9 }, g);
  }
  (salsa.top || []).forEach((t) => TOPPINGS[t] && TOPPINGS[t](g, rand));
}

const plate = $('.plate');
const pastaPicks = $('#pastaPicks');
const salsaPicks = $('#salsaPicks');

PASTAS.forEach((p) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'pasta-pick';
  b.dataset.id = p.id;
  b.innerHTML = `<img src="${p.img}" alt="" width="64" height="64" loading="lazy">
    <span class="pasta-pick__name">${esc(p.name)}</span>
    <span class="pasta-pick__tip">${esc(p.tip)}</span>
    <span class="pasta-pick__rec" aria-hidden="true">★</span>`;
  b.addEventListener('click', () => { pastaState.pasta = p.id; renderPlate(); });
  pastaPicks.append(b);
});

SALSAS.forEach((s) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'chip';
  b.dataset.id = s.name;
  b.innerHTML = `<span class="chip__dot" style="background:${s.color}"></span>${esc(s.name)}${s.v ? ' <span class="veg veg--sm" aria-label="vegetariano">V</span>' : ''}${s.hot ? ' <span aria-label="picante">🌶</span>' : ''}<span class="chip__price">${euro(s.price)}</span>`;
  b.addEventListener('click', () => { pastaState.salsa = s.name; renderPlate(); });
  salsaPicks.append(b);
});

const joinOr = (arr) => (arr.length > 1 ? arr.slice(0, -1).join(', ') + ' o ' + arr[arr.length - 1] : arr[0] || '');

function renderPlate() {
  const pasta = PASTAS.find((p) => p.id === pastaState.pasta);
  const salsa = SALSAS.find((s) => s.name === pastaState.salsa);

  pastaPicks.querySelectorAll('.pasta-pick').forEach((b) => {
    const p = PASTAS.find((x) => x.id === b.dataset.id);
    const rec = isMatch(p, salsa);
    b.setAttribute('aria-pressed', String(p.id === pasta.id));
    b.classList.toggle('is-rec', rec);
    b.setAttribute('aria-label', `${p.name}. ${p.tip}${rec ? '. Recomendada con ' + salsa.name : ''}`);
  });
  salsaPicks.querySelectorAll('.chip').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.id === salsa.name)));

  const rand = rng(pasta.id + salsa.name);
  drawPasta($('#pastaShape'), pasta.shape, rand);
  drawSauce($('#sauceTop'), salsa, rand);

  $('#plateName').textContent = `${pasta.name} ${salsa.name}`;
  $('#platePrice').textContent = euro(salsa.price);
  const match = $('#plateMatch');
  if (isMatch(pasta, salsa)) {
    match.className = 'plate__match is-rec';
    match.textContent = '★ Combinación recomendada por la casa';
  } else {
    const recs = PASTAS.filter((p) => isMatch(p, salsa)).map((p) => p.name);
    match.className = 'plate__match';
    match.textContent = recs.length ? `Combinación libre · la casa la recomienda con ${joinOr(recs)}` : 'Combinación libre';
  }
  $('#plateDesc').textContent = salsa.desc;
  $('#plateAl').textContent = 'Alérgenos: ' + alText(salsa.al);

  if (!reduceMotion) { plate.classList.remove('is-changing'); void plate.offsetWidth; plate.classList.add('is-changing'); }
}
renderPlate();

$('#randomBtn').addEventListener('click', () => {
  const pick = (arr, cur, key) => { let x; do { x = arr[Math.floor(Math.random() * arr.length)][key]; } while (x === cur && arr.length > 1); return x; };
  pastaState.pasta = pick(PASTAS, pastaState.pasta, 'id');
  pastaState.salsa = pick(SALSAS, pastaState.salsa, 'name');
  renderPlate();
});

/* =========================================================
   HORARIO + ESTADO DE HOY (hora de Madrid)
   ========================================================= */
function madridNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: (+get('hour') % 24) * 60 + +get('minute') };
}
// '00:00' como hora de cierre significa medianoche (fin del día)
const toMin = (hhmm, isClose = false) => { const [h, m] = hhmm.split(':').map(Number); const t = h * 60 + m; return isClose && t === 0 ? 24 * 60 : t; };
const fmtSlot = ([a, b]) => `${a} – ${b}`;

const now = madridNow();
const hoursTable = $('#hours');
HORARIO.forEach((d) => {
  const tr = document.createElement('tr');
  if (d.day === now.day) tr.className = 'is-today';
  const th = document.createElement('th'); th.scope = 'row'; th.textContent = d.label;
  const td = document.createElement('td');
  if (d.slots.length) d.slots.forEach((s) => { const span = document.createElement('span'); span.textContent = fmtSlot(s); td.append(span); });
  else td.textContent = 'Cerrado';
  if (d.note) { const small = document.createElement('small'); small.textContent = d.note; td.append(small); }
  tr.append(th, td);
  hoursTable.append(tr);
});

function nextOpening() {
  for (let i = 1; i <= 7; i++) {
    const d = HORARIO.find((h) => h.day === (now.day + i) % 7);
    if (d.slots.length) return `${i === 1 ? 'mañana' : 'el ' + d.label.toLowerCase()} a las ${d.slots[0][0]}`;
  }
  return '';
}

(function todayStatus() {
  const box = $('#todayStatus');
  if (!box) return;
  const strong = box.querySelector('strong');
  const span = box.querySelector('span');
  const today = HORARIO.find((d) => d.day === now.day);
  if (!today.slots.length) { box.classList.add('is-closed'); strong.textContent = 'Hoy cerrado'; span.textContent = `por descanso · abrimos ${nextOpening()}`; return; }
  const open = today.slots.find(([a, b]) => now.minutes >= toMin(a) && now.minutes < toMin(b, true));
  if (open) { box.classList.add('is-open'); strong.textContent = 'Abierto'; span.textContent = open[1] === '00:00' ? 'hasta medianoche' : `hasta las ${open[1]}`; return; }
  const next = today.slots.find(([a]) => now.minutes < toMin(a));
  if (next) { strong.textContent = 'Hoy'; span.textContent = `abrimos a las ${next[0]}`; return; }
  box.classList.add('is-closed'); strong.textContent = 'Cerrado'; span.textContent = `abrimos ${nextOpening()}`;
})();

/* ---------- Aparición al hacer scroll ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12 })
  : null;
document.querySelectorAll('.reveal').forEach((n) => (io ? io.observe(n) : n.classList.add('is-in')));

$('#year').textContent = new Date().getFullYear();
