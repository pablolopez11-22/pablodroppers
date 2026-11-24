// Genera, a partir de js/menu.js:
//  1) los datos estructurados de la carta (schema.org Menu) dentro del JSON-LD
//  2) una copia de la carta en HTML dentro de #menuPanels (para buscadores y
//     vistas previas; al cargar la página, js/main.js la sustituye por la
//     carta interactiva)
// Uso (desde la carpeta street-beef): node seo/generar.mjs
import fs from 'fs'; import vm from 'vm';
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/menu.js', 'utf8') + ';this.MENU=MENU;', ctx);
const { MENU } = ctx;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const euro = n => n.toFixed(2).replace('.', ',') + ' €';
const items = c => (c.featured ? [c.featured] : []).concat(c.items);
const firstPrice = i => i.price ?? (i.prices ? i.prices[0][1] : null);
const priceHTML = i => i.prices
  ? `<span class="dish__price dish__price--multi">${i.prices.map(p => `<span><small>${esc(p[0])}</small> ${euro(p[1])}</span>`).join('')}</span>`
  : i.priceText ? `<span class="dish__price dish__price--text">${esc(i.priceText)}</span>`
  : `<span class="dish__price">${euro(i.price)}${i.unit ? `<small class="unit">/ ${esc(i.unit)}</small>` : ''}</span>`;

const menuLD = {
  '@type': 'Menu', name: 'Carta de Street Beef', inLanguage: 'es',
  hasMenuSection: MENU.map(c => ({
    '@type': 'MenuSection', name: c.title,
    hasMenuItem: items(c).map(i => ({
      '@type': 'MenuItem', name: i.name, ...(i.desc ? { description: i.desc } : {}),
      ...(firstPrice(i) != null ? { offers: { '@type': 'Offer', price: firstPrice(i).toFixed(2), priceCurrency: 'EUR' } } : {}),
    }))
  }))
};

let html = fs.readFileSync('index.html', 'utf8');
const a = html.indexOf('<script type="application/ld+json">'), b = html.indexOf('</script>', a);
const ld = JSON.parse(html.slice(a + 35, b));
ld.hasMenu = menuLD;
html = html.slice(0, a + 35) + '\n  ' + JSON.stringify(ld, null, 2).replace(/\n/g, '\n  ') + '\n  ' + html.slice(b);
const fallback = MENU.map(c => `<section class="menu-cat"><header class="menu-cat__head"><h3 class="menu-cat__title">${esc(c.title)}</h3>${c.sub ? `<p class="menu-cat__sub">${esc(c.sub)}</p>` : ''}</header><ul class="dishes">` +
  items(c).map(i => `<li class="dish"><div class="dish__row"><h4 class="dish__name">${esc(i.name)}</h4><span class="dish__dots"></span>${priceHTML(i)}</div>${i.desc ? `<p class="dish__desc">${esc(i.desc)}</p>` : ''}</li>`).join('') +
  `</ul></section>`).join('\n');
html = html.replace(/<div id="menuPanels">[\s\S]*?<\/div><!-- \/menuPanels -->|<div id="menuPanels"><\/div>/, `<div id="menuPanels"><!-- Carta para buscadores (generada con seo/generar.mjs) -->\n${fallback}\n</div><!-- /menuPanels -->`);
fs.writeFileSync('index.html', html);
console.log('OK:', menuLD.hasMenuSection.length, 'secciones,', menuLD.hasMenuSection.reduce((n, s) => n + s.hasMenuItem.length, 0), 'platos');
