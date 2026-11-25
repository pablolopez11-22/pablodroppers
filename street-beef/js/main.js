/* =========================================================
   Street Beef · interacción
   La carta está en js/menu.js.
   El horario está aquí abajo (HORARIO).
   ========================================================= */

// Horario (0 = domingo … 6 = sábado). slots vacío = cerrado.
const HORARIO = [
  { day: 2, label: 'Martes',    slots: [['20:00', '00:00']], note: 'solo por la noche' },
  { day: 3, label: 'Miércoles', slots: [['13:00', '16:00'], ['20:00', '00:00']] },
  { day: 4, label: 'Jueves',    slots: [['12:30', '16:00'], ['20:00', '00:00']] },
  { day: 5, label: 'Viernes',   slots: [['12:30', '16:00'], ['20:00', '00:00']] },
  { day: 6, label: 'Sábado',    slots: [['12:30', '16:00'], ['20:00', '00:00']] },
  { day: 0, label: 'Domingo',   slots: [['12:30', '16:00']], note: 'solo a mediodía' },
  { day: 1, label: 'Lunes',     slots: [], note: 'cerrado por descanso' },
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
const menuState = { tab: MENU[0].id, query: '', exclude: new Set() };
const tabsEl = $('#tabs');
const panelsEl = $('#menuPanels');
const statusEl = $('#menuStatus');
const searchEl = $('#menuSearch');

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

// Filtro de alérgenos: «ocultar platos que contengan…»
const allergenList = $('#allergenList');
Object.entries(ALLERGENS).forEach(([key, label]) => {
  const wrap = document.createElement('label');
  wrap.className = 'check';
  wrap.innerHTML = `<input type="checkbox" value="${key}"><span>${esc(label)}</span>`;
  wrap.querySelector('input').addEventListener('change', (e) => {
    e.target.checked ? menuState.exclude.add(key) : menuState.exclude.delete(key);
    const n = menuState.exclude.size, count = $('#allergenCount');
    count.hidden = !n; count.textContent = n;
    renderMenu();
  });
  allergenList.append(wrap);
});
// Cerrar el panel de alérgenos al pulsar fuera
document.addEventListener('click', (e) => {
  const det = $('#allergenFilter');
  if (det.open && !det.contains(e.target)) det.open = false;
});

let searchTimer;
searchEl.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { menuState.query = searchEl.value.trim(); renderMenu(); }, 120);
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

const alHTML = (item, light) => (item.al && item.al.length
  ? `<p class="dish__al${light ? ' dish__al--light' : ''}"><span class="sr-only">Alérgenos: </span>${item.al.map((a) => esc(ALLERGENS[a])).join(' · ')}</p>`
  : '');
const tags = (item) => (item.hot ? '<span class="hot" title="Picante" aria-label="picante">🌶</span>' : '');

// Precio: fijo, por unidad / por 100 g, varios (tapa / media) o «según mercado»
function priceHTML(item, cls = 'dish__price') {
  if (item.prices) return `<span class="${cls} ${cls}--multi">${item.prices.map(([l, p]) => `<span><small>${esc(l)}</small> ${euro(p)}</span>`).join('')}</span>`;
  if (item.priceText) return `<span class="${cls} ${cls}--text">${esc(item.priceText)}</span>`;
  return `<span class="${cls}">${euro(item.price)}${item.unit ? `<small class="unit">/ ${esc(item.unit)}</small>` : ''}</span>`;
}

function dishHTML(item) {
  return `<li class="dish">
    <div class="dish__row">
      <h4 class="dish__name">${hl(item.name)} ${tags(item)}</h4>
      <span class="dish__dots" aria-hidden="true"></span>
      ${priceHTML(item)}
    </div>
    ${item.desc ? `<p class="dish__desc">${hl(item.desc)}</p>` : ''}
    ${alHTML(item)}
  </li>`;
}

function featuredHTML(f) {
  return `<article class="featured">
    <p class="featured__label">★ ${esc(f.label)}</p>
    <div class="dish__row">
      <h4 class="featured__name">${hl(f.name)} ${tags(f)}</h4>
      ${priceHTML(f, 'featured__price')}
    </div>
    <p class="featured__desc">${hl(f.desc)}</p>
    ${alHTML(f, true)}
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
    ${!compact ? nextHTML(cat) : ''}
  </section>`;
}

// Botón «Siguiente sección» al final de cada sección de la carta
function nextHTML(cat) {
  const i = MENU.indexOf(cat);
  const nxt = MENU[i + 1];
  return nxt ? `<button type="button" class="menu-cat__next" data-next="${nxt.id}">Siguiente: ${esc(nxt.tab)} <span aria-hidden="true">→</span></button>` : '';
}
panelsEl.addEventListener('click', (e) => {
  const b = e.target.closest('.menu-cat__next');
  if (!b) return;
  selectTab(b.dataset.next, false);
  const top = tabsEl.closest('.container').querySelector('#menuPanels').getBoundingClientRect().top;
  window.scrollTo({ top: window.scrollY + top / (window.__Z || 1) - 150, behavior: reduceMotion ? 'auto' : 'smooth' });
});

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

  let msg = '';
  const filtered = menuState.exclude.size > 0;
  if (searching) {
    msg = shown
      ? `${shown} ${shown === 1 ? 'plato' : 'platos'} con «${esc(menuState.query)}»`
      : `No encontramos «${esc(menuState.query)}» en la carta. Prueba con otro plato o ingrediente.`;
  } else if (filtered) {
    const hidden = total - shown;
    msg = shown
      ? `Mostrando ${shown} de ${total} platos${hidden ? ` · ${hidden} ocultos por tus alérgenos` : ''}`
      : 'Ningún plato de esta sección es apto con tus filtros. Prueba en otra sección.';
  }
  if (msg) msg += ` <button type="button" class="link-btn" id="clearFilters">Ver toda la carta</button>`;
  statusEl.innerHTML = msg;
  statusEl.hidden = !msg;
  const clear = $('#clearFilters');
  if (clear) clear.addEventListener('click', clearFilters);
}

function clearFilters() {
  menuState.query = ''; searchEl.value = '';
  menuState.exclude.clear();
  allergenList.querySelectorAll('input').forEach((i) => (i.checked = false));
  $('#allergenCount').hidden = true;
  renderMenu();
}

renderMenu();

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
