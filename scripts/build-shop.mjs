import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { publishedCatalogue, deduplicateCandidates } from '../src/shop-catalogue.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy = {
 en: {slug:'shop',other:'shop-es',name:'Shop',otherLanguage:'Español',title:'Padel equipment for players and clubs',description:'Thoughtful equipment choices for your next match, coaching session or club event.',players:'For Players',clubs:'For Clubs',categories:'Explore equipment',pending:'Our equipment collection is taking shape. Reviewed selections will appear here.',empty:'No selections yet.',retailer:'View on Amazon',disclosure:'As an Amazon Associate I earn from qualifying purchases.',context:'PadelWrist may earn a commission when you buy through these links. The retailer confirms price, delivery and availability. International Amazon links may take you to a local store or matching product.',guide:'New to padel equipment?',guideCopy:'Start with the essentials and choose equipment around how you play.',guideLink:'Read the equipment guide',home:'Home',privacy:'Privacy',support:'Support'},
 es: {slug:'shop-es',other:'shop',name:'Tienda',otherLanguage:'English',title:'Equipamiento de pádel para jugadores y clubes',description:'Equipamiento bien elegido para tu próximo partido, entrenamiento o torneo de club.',players:'Para jugadores',clubs:'Para clubes',categories:'Explora el equipamiento',pending:'Estamos preparando nuestra colección. Las selecciones revisadas aparecerán aquí.',empty:'Todavía no hay selecciones.',retailer:'Ver en Amazon',disclosure:'Como afiliado de Amazon, obtengo ingresos por las compras adscritas que cumplen los requisitos aplicables.',context:'PadelWrist puede recibir una comisión cuando compras a través de estos enlaces. La tienda confirma el precio, el envío y la disponibilidad. Los enlaces internacionales de Amazon pueden llevarte a una tienda local o a un producto equivalente.',guide:'¿Empiezas a jugar al pádel?',guideCopy:'Empieza por lo esencial y elige el equipamiento según tu forma de jugar.',guideLink:'Guía de equipamiento (en inglés)',home:'Inicio',privacy:'Privacidad',support:'Ayuda'}
};
export function renderShop(feed, language) {
 const t = copy[language], url = `https://padelwrist.com/${t.slug}/`;
 const products = feed.products.filter(p => p.publicationStatus === 'published');
 const hasLinks = feed.webLinksEnabled && products.some(p => p.variants.some(v=>v.destinations.web?.enabled));
 const card = (p,audience) => `<article class="shop-product" id="${audience}-${escape(p.id)}">
 ${p.image ? `<img src="${escape(p.image.url)}" alt="${escape(p.image.alt[language])}" width="640" height="480" loading="lazy" decoding="async">` : ''}
 <h3>${escape(p.title[language])}</h3><p>${escape(p.description[language])}</p>
 <label for="${audience}-${escape(p.id)}-pack">${language==='es'?'Tamaño del pack':'Pack size'}</label>
 <select class="shop-pack" id="${audience}-${escape(p.id)}-pack" data-shop-pack>${p.variants.map((v,i)=>`<option value="${i}">${escape(v.title[language])}</option>`).join('')}</select>
 <div class="shop-variant-links">${p.variants.map((v,i)=>`<div data-shop-variant="${i}"><p>${escape(v.title[language])}</p>${feed.webLinksEnabled && v.destinations.web?.enabled ? `<a class="feedback-link" href="${escape(v.destinations.web.url)}" rel="sponsored noopener">${t.retailer} <span aria-hidden="true">↗</span></a>` : `<p>${language==='es'?'Enlace de tienda en revisión.':'Retailer link under review.'}</p>`}</div>`).join('')}</div></article>`;
 const sections = ['players','clubs'].map(a => {
   const categories = feed.categories.filter(c => c.audiences.includes(a));
   const items = products.filter(p => p.audiences.includes(a));
   return `<section class="shop-section" id="${a}" aria-labelledby="${a}-heading"><h2 id="${a}-heading">${t[a]}</h2>
   ${items.length ? `<div class="shop-products">${items.map(p=>card(p,a)).join('')}</div>` : `<p class="shop-empty">${t.empty}</p>`}
   <div class="shop-categories">${categories.map(c=>`<div><h3>${escape(c.title[language])}</h3><p>${escape(c.description[language])}</p></div>`).join('')}</div></section>`;
 }).join('');
 const structured = {'@context':'https://schema.org','@graph':[{'@type':'CollectionPage','@id':url+'#webpage',url,name:t.title,description:t.description,inLanguage:language,isPartOf:{'@id':'https://padelwrist.com/#website'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'PadelWrist',item:'https://padelwrist.com/'},{'@type':'ListItem',position:2,name:t.name,item:url}]},...(products.length ? [{'@type':'ItemList',itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.title[language],url:url+'#'+p.audiences[0]+'-'+p.id}))}] : [])]};
 return `<!doctype html>
<!-- Generated from data/shop/catalogue.json by scripts/build-shop.mjs. Do not hand-edit. -->
<html lang="${language}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(t.title)} | PadelWrist</title><meta name="description" content="${escape(t.description)}">
<meta name="robots" content="index,follow,max-image-preview:large"><meta name="theme-color" content="#020711">
<link rel="canonical" href="${url}"><link rel="alternate" type="text/markdown" href="/${t.slug}.md">
<link rel="alternate" hreflang="en" href="https://padelwrist.com/shop/"><link rel="alternate" hreflang="es" href="https://padelwrist.com/shop-es/">
<link rel="alternate" hreflang="x-default" href="https://padelwrist.com/shop/">
<link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:site_name" content="PadelWrist"><meta property="og:type" content="website"><meta property="og:url" content="${url}">
<meta property="og:title" content="${escape(t.title)} | PadelWrist"><meta property="og:description" content="${escape(t.description)}"><meta property="og:image" content="https://padelwrist.com/assets/padelwrist-social-card.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(t.title)}"><meta name="twitter:description" content="${escape(t.description)}"><meta name="twitter:image" content="https://padelwrist.com/assets/padelwrist-social-card.png">
<script type="application/ld+json">${JSON.stringify(structured).replace(/</g,'\\u003c')}</script>
<link rel="stylesheet" href="/assets/tokens.css"><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/pages.css"><script src="/assets/site.js" defer></script><script src="/assets/shop.js" defer></script>
</head><body class="page-body shop-body"><a class="skip-link" href="#main">${language==='es'?'Ir al contenido':'Skip to content'}</a>
<header class="site-header solid"><div class="shell nav-wrap"><a class="brand" href="/" aria-label="PadelWrist"><span class="brand-mark" aria-hidden="true">PW</span><span>PADELWRIST</span></a>
<nav class="site-nav" aria-label="${language==='es'?'Navegación principal':'Primary navigation'}"><a href="/">${t.home}</a><a href="/players/">Players</a><a href="/clubs/">Clubs</a><a href="/${t.slug}/" aria-current="page">${t.name}</a><a href="/${t.other}/" lang="${language==='en'?'es':'en'}">${t.otherLanguage}</a></nav></div></header>
<main id="main" class="content-page shell shop-page"><nav class="breadcrumbs" aria-label="${language==='es'?'Ruta de navegación':'Breadcrumb'}"><a href="/">${t.home}</a><span aria-hidden="true"> / </span><span aria-current="page">${t.name}</span></nav><div class="page-heading"><p class="eyebrow">PadelWrist / ${t.name}</p><h1>${escape(t.title)}</h1><p>${escape(t.description)}</p></div>
<nav class="shop-audiences" aria-label="${t.categories}"><a href="#players">${t.players}</a><a href="#clubs">${t.clubs}</a></nav>
${hasLinks ? `<aside class="shop-disclosure"><p><strong>${t.disclosure}</strong></p><p>${t.context}</p></aside>` : `<p class="shop-empty">${t.pending}</p>`}
${sections}
<aside class="guide-cta"><h2>${t.guide}</h2><p>${t.guideCopy}</p><a class="feedback-link" href="/padel-equipment-for-beginners/">${t.guideLink}</a></aside>
</main><footer class="site-footer"><div class="shell footer-grid"><div><a class="brand" href="/"><span>PADELWRIST</span></a></div><nav><a href="/privacy/">${t.privacy}</a><a href="/support/">${t.support}</a></nav><p class="copyright">© <span data-year>2026</span> PadelWrist</p></div></footer></body></html>\n`;
}
export async function buildShop({check = false} = {}) {
 const source = JSON.parse(await readFile(resolve(root,'data/shop/catalogue.json'),'utf8'));
 const candidates = deduplicateCandidates(source.candidates);
 if (candidates.length !== source.candidates.length) throw new Error('Deduplicate candidate links before committing');
 const feed = publishedCatalogue(source);
 for (const p of feed.products) if (p.image) await readFile(resolve(root,new URL(p.image.url).pathname.slice(1)));
 const outputs = {'catalogue/v1.json':JSON.stringify(feed,null,2)+'\n','shop/index.html':renderShop(feed,'en'),'shop-es/index.html':renderShop(feed,'es')};
 for (const [name,content] of Object.entries(outputs)) {
   const path=resolve(root,name);
   if (check) { if (await readFile(path,'utf8') !== content) throw new Error(`Stale generated Shop output: ${name}`); }
   else { await mkdir(dirname(path),{recursive:true}); await writeFile(path,content); }
 }
 return feed;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const feed = await buildShop({check:process.argv.includes('--check')});
 console.log(`Validated Shop revision ${feed.revision}: ${feed.products.length} published products`);
}
