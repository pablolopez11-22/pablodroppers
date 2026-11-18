/* =========================================================
   Italian Street · interacción
   Los datos editables (pastas, salsas y horario) están arriba.
   ========================================================= */

/* ---------- DATOS EDITABLES ---------- */

// PENDIENTE: sustituir por las pastas reales de la carta
const PASTAS = [
  { id: 'spaghetti',   name: 'Spaghetti',   shape: 'long' },
  { id: 'tagliatelle', name: 'Tagliatelle', shape: 'ribbon' },
  { id: 'penne',       name: 'Penne',       shape: 'tube' },
  { id: 'rigatoni',    name: 'Rigatoni',    shape: 'bigtube' },
];

// PENDIENTE: sustituir por las salsas reales de la carta
const SALSAS = [
  { id: 'pomodoro',   name: 'Pomodoro',     color: '#c8361f', veg: true,  herb: true,  desc: 'Tomate, ajo, aceite de oliva y albahaca.' },
  { id: 'bolognesa',  name: 'Boloñesa',     color: '#8a3a1e', veg: false, herb: false, desc: 'Ragú de carne cocinado a fuego lento.' },
  { id: 'carbonara',  name: 'Carbonara',    color: '#f1d98a', veg: false, herb: false, desc: 'Yema, queso curado, pimienta y panceta.' },
  { id: 'pesto',      name: 'Pesto',        color: '#4f8a3a', veg: true,  herb: true,  desc: 'Albahaca, piñones, parmesano y aceite.' },
  { id: 'formaggi',   name: '4 quesos',     color: '#f4e7c3', veg: true,  herb: false, desc: 'Cremosa mezcla de cuatro quesos italianos.' },
  { id: 'arrabbiata', name: 'Arrabbiata',   color: '#b02a17', veg: true,  herb: false, desc: 'Tomate con un buen toque de guindilla.' },
];

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

/* ---------- Cabecera y menú móvil ---------- */
const header = document.querySelector('.header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40 || nav.classList.contains('is-open'));
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  nav.classList.toggle('is-open', open);
  onScroll();
});
nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); onScroll(); }
});

/* ---------- Pestañas de la carta ---------- */
const tabs = [...document.querySelectorAll('.tab')];
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
    t.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls'));
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    selectTab(next); next.focus();
  });
});

/* ---------- Crea tu pasta ---------- */
const state = { pasta: PASTAS[0].id, salsa: SALSAS[0].id };
const SVGNS = 'http://www.w3.org/2000/svg';
const PASTA_COLOR = '#f0c878';
const PASTA_EDGE = '#d9a94f';

function el(tag, attrs) {
  const n = document.createElementNS(SVGNS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

// Generador pseudoaleatorio estable para que cada combinación dibuje siempre igual
function rng(seed) {
  let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function drawPasta(g, shape, rand) {
  g.replaceChildren();
  if (shape === 'long' || shape === 'ribbon') {
    const w = shape === 'long' ? 3 : 7;
    const count = shape === 'long' ? 16 : 9;
    for (let i = 0; i < count; i++) {
      const r = 14 + rand() * 46;
      const a = rand() * Math.PI * 2;
      const span = 2.2 + rand() * 2;
      const cx = 100 + (rand() - .5) * 18, cy = 100 + (rand() - .5) * 18;
      const pts = [];
      for (let t = 0; t <= 1.0001; t += .1) {
        const ang = a + t * span, rr = r + Math.sin(t * 6) * 4;
        pts.push(`${(cx + Math.cos(ang) * rr).toFixed(1)},${(cy + Math.sin(ang) * rr).toFixed(1)}`);
      }
      g.append(el('polyline', { points: pts.join(' '), fill: 'none', stroke: PASTA_EDGE, 'stroke-width': w + 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
      g.append(el('polyline', { points: pts.join(' '), fill: 'none', stroke: PASTA_COLOR, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    }
  } else {
    const big = shape === 'bigtube';
    const count = big ? 18 : 26;
    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 56;
      const x = 100 + Math.cos(a) * d, y = 100 + Math.sin(a) * d;
      const len = big ? 22 : 24, thick = big ? 11 : 8;
      const rot = rand() * 180;
      const grp = el('g', { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)})` });
      const skew = big ? 0 : 4; // la penne tiene corte en diagonal
      grp.append(el('path', { d: `M${-len / 2 + skew},${-thick / 2} L${len / 2 + skew},${-thick / 2} L${len / 2 - skew},${thick / 2} L${-len / 2 - skew},${thick / 2} Z`, fill: PASTA_COLOR, stroke: PASTA_EDGE, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }));
      for (let k = -2; k <= 2; k++) {
        const xx = k * (len / 6);
        grp.append(el('line', { x1: xx + skew * .6, y1: -thick / 2 + 1, x2: xx - skew * .6, y2: thick / 2 - 1, stroke: PASTA_EDGE, 'stroke-width': .8, opacity: .7 }));
      }
      g.append(grp);
    }
  }
}

function drawSauce(g, salsa, rand) {
  g.replaceChildren();
  const blobs = 7;
  for (let i = 0; i < blobs; i++) {
    const a = rand() * Math.PI * 2, d = rand() * 34;
    const cx = 100 + Math.cos(a) * d, cy = 100 + Math.sin(a) * d;
    const r = 10 + rand() * 16;
    g.append(el('ellipse', { cx: cx.toFixed(1), cy: cy.toFixed(1), rx: r.toFixed(1), ry: (r * (.6 + rand() * .4)).toFixed(1), fill: salsa.color, opacity: .82, transform: `rotate(${(rand() * 180).toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})` }));
  }
  // queso rallado
  for (let i = 0; i < 26; i++) {
    const a = rand() * Math.PI * 2, d = Math.sqrt(rand()) * 50;
    g.append(el('rect', { x: (100 + Math.cos(a) * d).toFixed(1), y: (100 + Math.sin(a) * d).toFixed(1), width: 2.4, height: 1.4, fill: '#fff8e6', opacity: .9, transform: `rotate(${(rand() * 180).toFixed(0)} 100 100)` }));
  }
  // hojas de albahaca
  if (salsa.herb) {
    [[-14, -10, -30], [12, 6, 40], [0, 18, 120]].forEach(([dx, dy, rot]) => {
      g.append(el('path', { d: 'M0,-9 C7,-6 7,6 0,9 C-7,6 -7,-6 0,-9 Z', fill: '#3f7a32', stroke: '#2c5a22', 'stroke-width': .8, transform: `translate(${100 + dx} ${100 + dy}) rotate(${rot})` }));
    });
  }
}

const plate = document.querySelector('.plate');
const plateName = document.getElementById('plateName');
const plateDesc = document.getElementById('plateDesc');
const pastaG = document.getElementById('pastaShape');
const sauceG = document.getElementById('sauceTop');

function renderPlate() {
  const pasta = PASTAS.find((p) => p.id === state.pasta);
  const salsa = SALSAS.find((s) => s.id === state.salsa);
  const rand = rng(pasta.id + salsa.id);
  drawPasta(pastaG, pasta.shape, rand);
  drawSauce(sauceG, salsa, rand);
  plateName.textContent = `${pasta.name} ${salsa.name.toLowerCase().startsWith('4') ? 'a los ' : 'a la '}${salsa.name.toLowerCase()}`;
  plateDesc.textContent = salsa.desc + (salsa.veg ? ' Apta para vegetarianos.' : '');
  plate.classList.remove('is-changing'); void plate.offsetWidth; plate.classList.add('is-changing');
}

function buildChips(group, items) {
  const wrap = document.querySelector(`.chips[data-group="${group}"]`);
  items.forEach((item) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.dataset.id = item.id;
    b.setAttribute('aria-pressed', String(state[group] === item.id));
    if (item.color) {
      const dot = document.createElement('span');
      dot.className = 'chip__dot';
      dot.style.background = item.color;
      b.append(dot);
    }
    b.append(item.name);
    b.addEventListener('click', () => {
      state[group] = item.id;
      wrap.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      renderPlate();
    });
    wrap.append(b);
  });
}
buildChips('pasta', PASTAS);
buildChips('salsa', SALSAS);
renderPlate();

document.getElementById('randomBtn').addEventListener('click', () => {
  const pick = (arr, current) => { let x; do { x = arr[Math.floor(Math.random() * arr.length)].id; } while (x === current && arr.length > 1); return x; };
  state.pasta = pick(PASTAS, state.pasta);
  state.salsa = pick(SALSAS, state.salsa);
  document.querySelectorAll('.chips').forEach((wrap) => {
    const g = wrap.dataset.group;
    wrap.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === state[g])));
  });
  renderPlate();
});

/* ---------- Horario + estado de hoy (hora de Madrid) ---------- */
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
const hoursTable = document.getElementById('hours');
HORARIO.forEach((d) => {
  const tr = document.createElement('tr');
  if (d.day === now.day) tr.className = 'is-today';
  const th = document.createElement('th'); th.scope = 'row'; th.textContent = d.label;
  const td = document.createElement('td'); td.textContent = d.slots.length ? d.slots.map(fmtSlot).join(' · ') : 'Cerrado';
  if (d.note) { const small = document.createElement('small'); small.textContent = d.note; td.append(small); }
  tr.append(th, td);
  hoursTable.append(tr);
});

// Próximo día con servicio, p. ej. «mañana a las 13:00» o «el jueves a las 13:00»
function nextOpening() {
  for (let i = 1; i <= 7; i++) {
    const d = HORARIO.find((h) => h.day === (now.day + i) % 7);
    if (d.slots.length) return `${i === 1 ? 'mañana' : 'el ' + d.label.toLowerCase()} a las ${d.slots[0][0]}`;
  }
  return '';
}

(function todayStatus() {
  const box = document.getElementById('todayStatus');
  const span = box.querySelector('span');
  const today = HORARIO.find((d) => d.day === now.day);
  if (!today.slots.length) { box.classList.add('is-closed'); box.querySelector('strong').textContent = 'Hoy cerrado'; span.textContent = `por descanso · abrimos ${nextOpening()}`; return; }
  const open = today.slots.find(([a, b]) => now.minutes >= toMin(a) && now.minutes < toMin(b, true));
  if (open) { box.classList.add('is-open'); box.querySelector('strong').textContent = 'Abierto'; span.textContent = open[1] === '00:00' ? 'hasta medianoche' : `hasta las ${open[1]}`; return; }
  const next = today.slots.find(([a]) => now.minutes < toMin(a));
  if (next) { span.textContent = `abrimos a las ${next[0]}`; return; }
  box.classList.add('is-closed'); box.querySelector('strong').textContent = 'Cerrado';
  span.textContent = `abrimos ${nextOpening()}`;
})();

/* ---------- Aparición al hacer scroll ---------- */
const io = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12 })
  : null;
document.querySelectorAll('.reveal').forEach((n) => (io ? io.observe(n) : n.classList.add('is-in')));

document.getElementById('year').textContent = new Date().getFullYear();
