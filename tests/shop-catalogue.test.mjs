import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateCatalogue,publishedCatalogue,deduplicateCandidates} from '../src/shop-catalogue.mjs';
import {renderShop,buildShop} from '../scripts/build-shop.mjs';
import worker from '../src/content-negotiation.mjs';
const source=JSON.parse(await readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
const clone=v=>structuredClone(v);
const now=new Date('2026-11-03T00:00:00Z');
const options={now};
function fixture(){const feed=clone(source.catalogue);feed.expiresAt='2099-01-01T00:00:00Z';feed.webLinksEnabled=false;for(const p of feed.products){p.publicationStatus='published';for(const v of p.variants){v.publicationStatus='published';v.destinations.web.enabled=false;v.destinations.web.reviewedAt=null;}}return feed;}

test('reviewed UK website families publish while all other families stay private',()=>{
 const live=publishedCatalogue(source,options);assert.equal(live.products.length,10);assert.equal(live.products.flatMap(p=>p.variants).length,12);assert.equal(live.webLinksEnabled,true);
 assert.equal(source.catalogue.products.length,74);
 assert.equal(source.catalogue.products[0].variants.length,3);
 assert.equal(source.catalogue.products[1].variants.length,1);
 assert.equal(source.candidates.filter(c=>c.verificationStatus==='superseded').length,1);
 for(const p of source.catalogue.products)for(const v of p.variants){assert.equal(new URL(v.destinations.web.url).searchParams.get('tag'),'thediaryroom-21');assert.equal(v.destinations.web.enabled,p.publicationStatus==='published');assert.deepEqual(v.destinations.mobile,[]);}
});
test('players/clubs/both, featured ordering, variants and localisation survive publication',()=>{
 const s=clone(source);s.catalogue=fixture();s.catalogue.products[0].audiences=['players','clubs'];
 s.productApprovals=s.catalogue.products.flatMap(p=>p.variants.map(v=>({productId:p.id,variantId:v.id,status:'verified',listingURL:v.destinations.web.url,checkedAt:'2026-11-01T15:00:00Z',notes:'Test-only listing approval',review:{publicationApproved:true,commercialApproved:false}})));
 s.variantApprovals=s.catalogue.products.filter(p=>p.variants.length>1).map(p=>({productId:p.id,status:'verified',variantIds:p.variants.map(v=>v.id),evidence:'Test-only independent variant verification'}));
 const feed=publishedCatalogue(s,options);
 assert.equal(feed.products[0].id,'raquex-elite-padel-balls-club-pack');
 assert.deepEqual(feed.products[1].audiences,['players','clubs']);
 assert.equal(feed.products[1].variants.length,3);
 assert.match(renderShop(feed,'es'),/Tamaño del pack/);
 assert.match(renderShop(feed,'en'),/Pack size/);
 assert.match(renderShop(feed,'en'),/data-technical-fallback="\/catalogue\/images\/category-balls.svg"/);
 assert.doesNotMatch(renderShop(feed,'en'),/src="https:\/\/padelwrist.com\/catalogue\/images/);
 assert.doesNotMatch(renderShop(feed,'en'),/href="https:\/\/www.amazon/);
});
test('publication and retailer links require independent explicit approval and cannot be enabled from draft',()=>{
 const s=clone(source);s.catalogue.webLinksEnabled=false;for(const product of s.catalogue.products){product.publicationStatus='draft';for(const v of product.variants){v.publicationStatus='draft';v.destinations.web.enabled=false;v.destinations.web.reviewedAt=null;}}const p=s.catalogue.products[0];
 for(const a of s.productApprovals.filter(a=>a.productId===p.id)){a.status='pending';a.review.publicationApproved=false;a.review.commercialApproved=false;}
 p.publicationStatus='published';
 for(const v of p.variants){
  v.publicationStatus='published';
  const a=s.productApprovals.find(a=>a.productId===p.id&&a.variantId===v.id);
  a.status='verified';
 }
 s.variantApprovals.find(a=>a.productId===p.id).status='verified';
 assert.throws(()=>publishedCatalogue(s,options),/publication approval/);
 for(const a of s.productApprovals.filter(a=>a.productId===p.id))a.review.publicationApproved=true;
 assert.equal(publishedCatalogue(s,options).products.length,1);
 s.catalogue.webLinksEnabled=true;
 const v=p.variants[0],a=s.productApprovals.find(a=>a.productId===p.id&&a.variantId===v.id);
 v.destinations.web.enabled=true;v.destinations.web.reviewedAt='2026-11-02T08:50:00Z';
 assert.throws(()=>publishedCatalogue(s,options),/commercial approval/);
 a.review.commercialApproved=true;
 assert.equal(publishedCatalogue(s,options).products.length,1);
 a.review.affiliateDestination.candidateURL='https://www.amazon.co.uk/dp/INVALID?tag=thediaryroom-21';
 assert.throws(()=>publishedCatalogue(s,options),/commercial approval/);
 a.review.affiliateDestination.candidateURL=v.destinations.web.url;
 p.publicationStatus='draft';assert.throws(()=>publishedCatalogue(s,options),/draft product/);
});

test('approved website links retain OneLink-compatible full URL byte-for-byte after HTML escaping',()=>{
 const feed=fixture();feed.webLinksEnabled=true;const d=feed.products[0].variants[0].destinations.web;d.enabled=true;d.reviewedAt='2026-11-01T15:00:00Z';
 validateCatalogue(feed,options);
 const html=renderShop(feed,'en');assert.ok(html.includes(d.url.replaceAll('&','&amp;')));
 assert.match(html,/rel="sponsored noopener"/);assert.match(html,/As an Amazon Associate/);
 assert.match(renderShop(feed,'es'),/Como afiliado de Amazon/);
 assert.doesNotMatch(html,/"offers"|"price"|"aggregateRating"|"availability"/);
});
test('rejects malformed, expired, unknown schema, duplicates, bad URLs, unlicensed imagery and price fields',()=>{
 const mutations=[f=>f.schemaVersion=2,f=>f.expiresAt='2020-01-01T00:00:00Z',f=>f.products.push(clone(f.products[0])),f=>f.products[0].price=1,f=>f.products[0].title.es='',f=>f.products[0].variants[0].destinations.web.url='javascript:alert(1)',f=>f.products[0].variants[0].destinations.web.url='https://www.amazon.co.uk.evil.test/dp/B0D123Q6RL',f=>f.products[0].variants[0].destinations.web.enabled=true,f=>f.products[0].variants.push(clone(f.products[0].variants[0])),f=>f.products[0].variants[0].destinations.web.url='https://www.amazon.co.uk/dp/B0D123Q6RL?email=secret',f=>f.products[0].image={url:'https://m.media-amazon.com/test.jpg',alt:{en:'test',es:'test'},licenseId:'none'}];
 for(const mutate of mutations){const f=fixture();mutate(f);assert.throws(()=>validateCatalogue(f,options));}
 const s=clone(source);s.catalogue=fixture();s.catalogue.products[0].image={url:'https://padelwrist.com/catalogue/images/test.webp',alt:{en:'test',es:'prueba'},licenseId:'missing'};assert.throws(()=>publishedCatalogue(s,options));
});
test('unverified listings cannot be published merely by toggling status',()=>{const s=clone(source);s.catalogue=fixture();assert.throws(()=>publishedCatalogue(s,options),/verification/);});

test('candidate deduplication is deterministic and conflicting records fail review',()=>{
 const candidate=source.candidates[1];assert.equal(deduplicateCandidates([candidate,clone(candidate)]).length,1);
 assert.throws(()=>deduplicateCandidates([candidate,{...candidate,note:'different review'}]));
});
test('generated JSON/HTML is current and no draft or candidate links leak',async()=>{
 await buildShop({check:true});const json=await readFile(new URL('../catalogue/v1.json',import.meta.url),'utf8');const published=JSON.parse(json);assert.equal(published.products.length,10);assert.match(json,/thediaryroom-21/);assert.doesNotMatch(json,/candidate-b0|B0755HRLQD|B0GV226SKF|suppliedLabel/);
 for(const slug of ['shop','shop-es']){const html=await readFile(new URL(`../${slug}/index.html`,import.meta.url),'utf8');assert.match(html,/CollectionPage/);assert.match(html,/hreflang="es"/);const md=await readFile(new URL(`../${slug}.md`,import.meta.url),'utf8');assert.match(md,/Canonical HTML:/);}
});
function envFor(feed){return {ASSETS:{fetch:async()=>new Response(JSON.stringify(feed),{headers:{'Content-Type':'application/json'}})}};}
test('Worker feed GET/HEAD/ETag, JSON regardless of Accept, and failure/expired/write rejection',async()=>{
 const feed=fixture(),env=envFor(feed),url='https://padelwrist.com/catalogue/v1.json';
 const r=await worker.fetch(new Request(url,{headers:{Accept:'text/markdown'}}),env);assert.equal(r.status,200);assert.match(r.headers.get('Content-Type'),/application\/json/);assert.equal(r.headers.get('Access-Control-Allow-Origin'),'*');
 assert.equal((await r.json()).schemaVersion,1);const etag=r.headers.get('ETag');assert.ok(etag);
 const unchanged=await worker.fetch(new Request(url,{headers:{'If-None-Match':etag}}),env);assert.equal(unchanged.status,304);assert.equal(await unchanged.text(),'');
 const head=await worker.fetch(new Request(url,{method:'HEAD'}),env);assert.equal(head.status,200);assert.equal(await head.text(),'');
 assert.equal((await worker.fetch(new Request(url,{method:'POST'}),env)).status,405);
 const expired=fixture();expired.expiresAt='2020-01-01T00:00:00Z';const bad=await worker.fetch(new Request(url),envFor(expired));assert.equal(bad.status,503);assert.equal(bad.headers.get('Cache-Control'),'no-store');
 const privateFeed=fixture();privateFeed.products[0].publicationStatus='draft';assert.equal((await worker.fetch(new Request(url),envFor(privateFeed))).status,503);
});

test('preview hosts are noindex and disallow robots without changing production responses',async()=>{
 const env=envFor(fixture());
 const preview=await worker.fetch(new Request('https://preview-padelwrist-website.example.workers.dev/catalogue/v1.json'),env);
 assert.equal(preview.headers.get('X-Robots-Tag'),'noindex, nofollow, noarchive');
 const robots=await worker.fetch(new Request('https://preview-padelwrist-website.example.workers.dev/robots.txt'),env);
 assert.equal(await robots.text(),'User-agent: *\nDisallow: /\n');
 const prod=await worker.fetch(new Request('https://padelwrist.com/catalogue/v1.json'),env);
 assert.equal(prod.headers.get('X-Robots-Tag'),null);
});

test('cards omit single-option selectors and keep an original fallback for failed licensed photos',()=>{
 const feed=fixture(), single=feed.products.find(p=>p.id==='nox-pro-series-backpack-blue');
 let html=renderShop(feed,'en');
 assert.doesNotMatch(html,new RegExp(`id="players-${single.id}-pack"`));
 assert.match(html,/id="players-raquex-elite-padel-balls-pack"/);
 single.image={url:'https://padelwrist.com/catalogue/images/review-missing.jpg',alt:{en:'Synthetic failed photo',es:'Foto de prueba no disponible'},licenseId:'test-only'};
 html=renderShop(feed,'es');assert.match(html,/data-shop-photo/);assert.match(html,/data-shop-fallback hidden/);assert.match(html,/Imagen solo con fines ilustrativos/);
});
