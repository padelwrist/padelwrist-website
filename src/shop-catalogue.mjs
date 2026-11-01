/** Shared publication contract. Pure validation is reusable by a future authenticated editor. */
export const SCHEMA_VERSION = 1;
export const MAX_BYTES = 256000;
export const CATEGORY_IDS = ['rackets','balls','grips','footwear','bags','accessories','bulkBalls','coaching','court','tournament'];
export const MARKETPLACES = {GB:'www.amazon.co.uk',ES:'www.amazon.es',US:'www.amazon.com',DE:'www.amazon.de',FR:'www.amazon.fr',IT:'www.amazon.it',CA:'www.amazon.ca',AU:'www.amazon.com.au'};
const fail = message => { throw new Error(`Shop catalogue: ${message}`); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
function keys(value, allowed) { if (!object(value) || Object.keys(value).some(k => !allowed.includes(k))) fail('unsupported fields'); }
function text(value, max) { if (typeof value !== 'string' || !value.trim() || value.length > max || /[\u0000-\u001f<>]/.test(value)) fail('invalid text'); }
function localized(value, max) { keys(value,['en','es']); for (const lang of ['en','es']) text(value[lang],max); }
function list(value, allowed) { if (!Array.isArray(value) || !value.length || new Set(value).size !== value.length || value.some(x => !allowed.includes(x))) fail('invalid selection'); }
function timestamp(value) { if (typeof value !== 'string' || !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(value) || !Number.isFinite(Date.parse(value))) fail('invalid timestamp'); }
export function safeURL(value) {
  text(value,2048);
  let url; try { url = new URL(value); } catch { fail('invalid URL'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) fail('unsafe URL');
  return url;
}
export function destination(value, mobile = false) {
  keys(value,mobile ? ['url','reviewedAt','marketplace','enabled'] : ['url','reviewedAt','enabled']);
  if (typeof value.enabled !== 'boolean') fail('invalid link gate');
  if (value.reviewedAt !== null) timestamp(value.reviewedAt);
  if (value.enabled && !value.reviewedAt) fail('unreviewed active link');
  const url = safeURL(value.url);
  if (mobile) {
    if (!MARKETPLACES[value.marketplace] || url.hostname !== MARKETPLACES[value.marketplace] || !/^\/dp\/[A-Z0-9]{10}\/?$/.test(url.pathname)) fail('invalid mobile destination');
  } else if (!Object.values(MARKETPLACES).includes(url.hostname) && !['amzn.to','link.amazon'].includes(url.hostname)) fail('unapproved retailer');
  const pairs = [...url.searchParams];
  const allowed = mobile ? ['tag'] : ['th','psc','linkCode','tag','linkId','gaOptInStatus','ref_'];
  if (pairs.some(([key,v]) => !allowed.includes(key) || !/^[a-zA-Z0-9_-]{1,100}$/.test(v)) || new Set(pairs.map(([k])=>k)).size !== pairs.length) fail('unapproved tracking parameters');
  if (Object.values(MARKETPLACES).includes(url.hostname) && !/^\/dp\/[A-Z0-9]{10}\/?$/.test(url.pathname)) fail('not a product link');
  return url;
}
export function validateCatalogue(value, {now = new Date(), allowExpired = false} = {}) {
  keys(value,['schemaVersion','revision','updatedAt','expiresAt','webLinksEnabled','categories','products']);
  if (value.schemaVersion !== SCHEMA_VERSION || !Number.isSafeInteger(value.revision) || value.revision < 1) fail('unsupported version/revision');
  if (typeof value.webLinksEnabled !== 'boolean') fail('invalid web gate');
  timestamp(value.updatedAt); timestamp(value.expiresAt);
  if (Date.parse(value.updatedAt) > now.getTime() + 300000 || Date.parse(value.expiresAt) <= Date.parse(value.updatedAt) || (!allowExpired && Date.parse(value.expiresAt) <= now.getTime())) fail('invalid validity window');
  if (!Array.isArray(value.categories) || value.categories.length !== CATEGORY_IDS.length) fail('missing categories');
  const ids = new Set();
  for (const c of value.categories) {
    keys(c,['id','audiences','title','description']);
    if (!CATEGORY_IDS.includes(c.id) || ids.has(c.id)) fail('unknown/duplicate category'); ids.add(c.id);
    list(c.audiences,['players','clubs']); localized(c.title,80); localized(c.description,600);
  }
  if (!Array.isArray(value.products) || value.products.length > 100) fail('too many products');
  const products = new Set(), links = new Set();
  for (const p of value.products) {
    keys(p,['id','audiences','categories','featuredOrder','publicationStatus','title','description','image','variants']);
    if (typeof p.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id) || p.id.length > 80 || products.has(p.id)) fail('invalid/duplicate product ID'); products.add(p.id);
    list(p.audiences,['players','clubs']); list(p.categories,CATEGORY_IDS);
    for (const a of p.audiences) if (!p.categories.some(id => value.categories.find(c => c.id === id).audiences.includes(a))) fail('category audience mismatch');
    if (!Number.isSafeInteger(p.featuredOrder) || p.featuredOrder < 0 || p.featuredOrder > 10000 || !['draft','published','retired'].includes(p.publicationStatus)) fail('invalid publication/order');
    localized(p.title,120); localized(p.description,600);
    if (p.image !== null) {
      keys(p.image,['url','alt','licenseId']); const url = safeURL(p.image.url);
      if (url.hostname !== 'padelwrist.com' || !/^\/catalogue\/images\/[a-z0-9-]+\.(webp|png|jpg|svg)$/.test(url.pathname) || url.search) fail('unapproved image');
      localized(p.image.alt,180); text(p.image.licenseId,120);
    }
    if (!Array.isArray(p.variants) || !p.variants.length || p.variants.length > 20) fail('invalid variants');
    const variants=new Set(), productLinks=new Set();
    for (const v of p.variants) {
      keys(v,['id','title','publicationStatus','destinations']);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v.id) || variants.has(v.id) || v.id.length>80) fail('invalid/duplicate variant'); variants.add(v.id);
      localized(v.title,80);
      if (!['draft','published','retired'].includes(v.publicationStatus)) fail('invalid variant status');
      keys(v.destinations,['web','mobile']);
      const web=v.destinations.web;
      if(web!==null) destination(web);
      if(!Array.isArray(v.destinations.mobile) || v.destinations.mobile.length>8) fail('invalid mobile destinations');
      const countries=new Set();
      for(const d of v.destinations.mobile) {destination(d,true);if(countries.has(d.marketplace))fail('duplicate marketplace');countries.add(d.marketplace);}
      const identities=new Set([web,...v.destinations.mobile].filter(Boolean).map(d=>{const u=new URL(d.url);return u.origin+u.pathname.replace(/\/$/,'');}));
      for(const identity of identities) {if(links.has(identity)||productLinks.has(identity))fail('duplicate product link');productLinks.add(identity);}
    }
    for(const identity of productLinks) links.add(identity);
  }
  if (new TextEncoder().encode(JSON.stringify(value)).length > MAX_BYTES) fail('oversized feed');
  return value;
}
export function publishedCatalogue(source, options) {
  keys(source,['catalogue','candidates','imageApprovals','verificationNotes','productApprovals']);
  validateCatalogue(source.catalogue,options);
  const feed = {...source.catalogue, products: source.catalogue.products.filter(p => p.publicationStatus === 'published').map(p=>({...p, variants:p.variants.filter(v=>v.publicationStatus==='published')})).sort((a,b) => a.featuredOrder-b.featuredOrder || a.id.localeCompare(b.id))};
  for (const p of feed.products) for (const v of p.variants) {
    const approval=source.productApprovals?.find(a=>a.productId===p.id && a.variantId===v.id && a.status==='verified' && a.listingURL===v.destinations.web?.url);
    if(!approval || !approval.notes) fail('listing/variant verification missing');
    timestamp(approval.checkedAt);
  }
  for (const p of feed.products) if (!p.variants.length) fail('published product needs published variants');
  for (const p of feed.products) if (p.image && !source.imageApprovals?.some(a => a.licenseId === p.image.licenseId && a.url === p.image.url && a.status === 'approved' && a.evidence)) fail('image rights not approved');
  return feed;
}
export function deduplicateCandidates(candidates) {
  const found = new Map();
  for (const candidate of candidates) {
    keys(candidate,['url','suppliedLabel','verificationStatus','note']); safeURL(candidate.url);
    if (!['pending','rejected','verified','superseded'].includes(candidate.verificationStatus)) fail('invalid candidate status');
    text(candidate.suppliedLabel,200); text(candidate.note,600);
    const url = new URL(candidate.url); url.hash=''; const key=url.origin+url.pathname.replace(/\/$/,'');
    if (found.has(key) && JSON.stringify(found.get(key)) !== JSON.stringify(candidate)) fail('conflicting duplicate candidate');
    found.set(key,candidate);
  }
  return [...found.values()];
}
