import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {validateCatalogueV2,publishedCatalogueV2} from '../src/shop-catalogue-v2.mjs';
import {validateCatalogueV3,publishedCatalogueV3,validateEditorialMerchandising} from '../src/shop-catalogue-v3.mjs';
import {buildReviewCatalogueV3} from '../src/shop-review.mjs';import {renderShop} from '../scripts/build-shop.mjs';
import worker from '../src/content-negotiation.mjs';
const source=JSON.parse(await fs.readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
test('v3 isolates bounded optional merchandising, preserves strict v2 and cannot approve products or links',async()=>{
 const publicFeed=publishedCatalogueV3(source),qa=buildReviewCatalogueV3(source);
 assert.equal(publicFeed.schemaVersion,3);assert.equal(publicFeed.products.length,10);assert.equal(qa.products.length,11);assert.equal(qa.products.flatMap(p=>p.variants).length,13);
 assert.equal(qa.products.find(p=>p.id==='raquex-elite-padel-balls').merchandising.highlights.length,2);
 assert.equal(qa.products.find(p=>p.id==='raquex-elite-padel-balls').merchandising.badge.id,'featured');
 assert.ok(qa.products.every(p=>p.merchandising?.shortDescription));assert.equal(qa.products.filter(p=>p.merchandising?.suitability).length,2);
 const downgraded={...qa,schemaVersion:2};assert.throws(()=>validateCatalogueV2(downgraded));
 assert.deepEqual(publishedCatalogueV2(source),JSON.parse(await fs.readFile(new URL('../catalogue/v2.json',import.meta.url),'utf8')));
 for(const mutate of [m=>m.highlights=[],m=>m.highlights=[m.highlights[0]],m=>m.highlights[0].es='',m=>m.highlights[0].en='Best seller',m=>m.price=10,m=>m.badge='bestSeller',m=>m.suitability='professional',m=>m.highlights[0].url='https://example.com']){
  const invalid=structuredClone(qa);mutate(invalid.products.find(p=>p.merchandising).merchandising);assert.throws(()=>validateCatalogueV3(invalid));
 }
 const env={ASSETS:{fetch:async()=>new Response(JSON.stringify(publicFeed))}},url='https://padelwrist.com/catalogue/v3.json';
 const get=await worker.fetch(new Request(url),env);assert.equal(get.status,200);
 assert.equal((await worker.fetch(new Request(url,{headers:{'If-None-Match':get.headers.get('ETag')}}),env)).status,304);
 assert.equal((await worker.fetch(new Request(url,{method:'HEAD'}),env)).status,200);
 const mismatch={ASSETS:{fetch:async()=>new Response(JSON.stringify(publishedCatalogueV2(source)))}};
 assert.equal((await worker.fetch(new Request(url),mismatch)).status,503);
});
test('full approved-range simulation stays within v3 feed and EN/ES rendering limits without changing actual approvals',()=>{
 const staged=structuredClone(source);staged.catalogue.webLinksEnabled=false;
 for(const p of staged.catalogue.products){
  p.publicationStatus='published';
  for(const v of p.variants){v.publicationStatus='published';v.destinations.web.enabled=false;v.destinations.web.reviewedAt=null;}
 }
 for(const a of staged.productApprovals){a.status='verified';a.review.publicationApproved=true;}
 for(const a of staged.variantApprovals)a.status='verified';
 // Simulate editorial approvals only in isolated test memory; production source and links remain unchanged.
 for(const e of Object.values(staged.productMerchandising)){e.review.en='approved';e.review.es='approved';}
 const feed=publishedCatalogueV3(staged);
 assert.equal(feed.products.length,74);
 assert.equal(feed.products.reduce((n,p)=>n+p.variants.length,0),76);
 assert.equal(feed.webLinksEnabled,false);
 assert.ok(feed.products.every(p=>p.variants.every(v=>!v.destinations.web.enabled&&v.destinations.mobile.length===0)));
 for(const lang of ['en','es']){
  const html=renderShop(feed,lang);
  assert.match(html,/data-shop-product/);
  assert.equal(html.includes('href="https://www.amazon'),false);
 }
 // This fixture is deliberately not written to disk and never updates live source approval flags.
 assert.equal(publishedCatalogueV3(source).products.length,10);
});

test('EN/ES merchandising needs evidence and independent approval; suitability needs approved assessment',()=>{
 validateEditorialMerchandising(source);
 for(const mutate of [e=>e.review.es='unchecked',e=>delete e.review.en,e=>e.evidence=[],e=>e.content.suitability='training',e=>e.content.badge='bestSeller']){
  const invalid=structuredClone(source);mutate(Object.values(invalid.productMerchandising)[0]);assert.throws(()=>validateEditorialMerchandising(invalid));
 }
 const approvedProduct=structuredClone(source);const p=approvedProduct.catalogue.products[0];approvedProduct.catalogue.webLinksEnabled=false;approvedProduct.catalogue.products.forEach(product=>product.variants.forEach(variant=>{variant.destinations.web.enabled=false;variant.destinations.web.reviewedAt=null;}));approvedProduct.productMerchandising[p.id].review={en:'pending',es:'pending'};p.publicationStatus='published';p.variants.forEach(v=>v.publicationStatus='published');
 approvedProduct.productApprovals.filter(a=>a.productId===p.id).forEach(a=>{a.status='verified';a.review.publicationApproved=true;});p.variants.forEach(v=>{v.destinations.web.enabled=false;v.destinations.web.reviewedAt=null;});approvedProduct.variantApprovals.filter(a=>a.productId===p.id).forEach(a=>a.status='verified');
 assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising,undefined);
 approvedProduct.productMerchandising[p.id].review.en='approved';assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising,undefined);
 approvedProduct.productMerchandising[p.id].review.es='approved';assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising.highlights.length,2);
 assert.equal(publishedCatalogueV3(approvedProduct).webLinksEnabled,false);
});
test('radio options preserve exact child URL mapping and disabled CTAs; single variants stay simple',()=>{
 const qa=buildReviewCatalogueV3(source),p=qa.products.find(p=>p.id==='raquex-elite-padel-balls');
 assert.deepEqual(p.variants.map(v=>new URL(v.destinations.web.url).pathname),['/dp/B0D123Q6RL','/dp/B0D1VZ4VNJ','/dp/B0D1VXLW6J']);
 for(const language of ['en','es']){const html=renderShop(qa,language);assert.match(html,/type="radio"/);assert.match(html,/value="2"/);assert.match(html,/class="shop-retailer" type="button" disabled/);assert.doesNotMatch(html,/href="https:\/\/www.amazon/);assert.match(html,/shop-highlights/);}
 assert.equal(publishedCatalogueV3(source).products.length,10);
});

test('remote presentation controls audience order, variant order/default and editable labels without product approval',()=>{
 const s=structuredClone(source), id='raquex-elite-padel-balls',entry=s.productPresentation[id];
 entry.variantOrder=['pack-9','pack-3','pack-6'];entry.defaultVariantID='pack-9';entry.audienceOrder={players:999,clubs:1};
 const qa=buildReviewCatalogueV3(s),p=qa.products.find(p=>p.id===id);
 assert.deepEqual(p.variants.map(v=>v.id),entry.variantOrder);assert.equal(p.defaultVariantID,'pack-9');
 assert.deepEqual(p.audienceOrder,{players:999,clubs:1});
 const html=renderShop(qa,'en');assert.match(html,/value="0" checked/);
 assert.ok(html.indexOf('id="clubs-raquex-elite-padel-balls"')<html.indexOf('id="clubs-raquex-elite-padel-balls-club-pack"'));
 const training=s.productMerchandising['vermont-pressureless-training-balls-60'];training.content.suitability.text={en:'Coaching sessions',es:'Sesiones de entrenamiento'};
 const updated=buildReviewCatalogueV3(s);assert.equal(updated.products.find(p=>p.id==='vermont-pressureless-training-balls-60').merchandising.suitability.text.en,'Coaching sessions');
 for(const mutate of [s=>s.productPresentation[id].defaultVariantID='unverified',s=>s.productPresentation[id].variantOrder=['pack-3'],s=>s.productPresentation[id].audienceOrder={unknown:1},s=>s.productMerchandising[id].content.shortDescription.es='',s=>s.productMerchandising[id].content.suitability={id:'beginner',text:{en:'Beginner',es:'Principiante'}}]){const bad=structuredClone(source);mutate(bad);assert.throws(()=>publishedCatalogueV3(bad));}
 assert.equal(publishedCatalogueV3(s).products.length,10);
});
