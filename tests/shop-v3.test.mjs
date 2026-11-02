import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {validateCatalogueV2,publishedCatalogueV2} from '../src/shop-catalogue-v2.mjs';
import {validateCatalogueV3,publishedCatalogueV3,validateEditorialMerchandising} from '../src/shop-catalogue-v3.mjs';
import {buildReviewCatalogueV3} from '../src/shop-review.mjs';import {renderShop} from '../scripts/build-shop.mjs';
import worker from '../src/content-negotiation.mjs';
const source=JSON.parse(await fs.readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
test('v3 isolates bounded optional merchandising, preserves strict v2 and cannot approve products or links',async()=>{
 const publicFeed=publishedCatalogueV3(source),qa=buildReviewCatalogueV3(source);
 assert.equal(publicFeed.schemaVersion,3);assert.equal(publicFeed.products.length,0);assert.equal(qa.products.length,11);assert.equal(qa.products.flatMap(p=>p.variants).length,13);
 assert.equal(qa.products.find(p=>p.id==='raquex-elite-padel-balls').merchandising.highlights.length,2);
 assert.equal(qa.products.find(p=>p.id==='raquex-elite-padel-balls').merchandising.badge,'featured');
 assert.ok(qa.products.some(p=>!p.merchandising));assert.ok(qa.products.every(p=>!p.merchandising?.suitability));
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
test('EN/ES merchandising needs evidence and independent approval; suitability needs approved assessment',()=>{
 validateEditorialMerchandising(source);
 for(const mutate of [e=>e.review.es='unchecked',e=>delete e.review.en,e=>e.evidence=[],e=>e.content.suitability='training',e=>e.content.badge='bestSeller']){
  const invalid=structuredClone(source);mutate(Object.values(invalid.productMerchandising)[0]);assert.throws(()=>validateEditorialMerchandising(invalid));
 }
 const approvedProduct=structuredClone(source);const p=approvedProduct.catalogue.products[0];p.publicationStatus='published';p.variants.forEach(v=>v.publicationStatus='published');
 approvedProduct.productApprovals.filter(a=>a.productId===p.id).forEach(a=>a.status='verified');approvedProduct.variantApprovals.filter(a=>a.productId===p.id).forEach(a=>a.status='verified');
 assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising,undefined);
 approvedProduct.productMerchandising[p.id].review.en='approved';assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising,undefined);
 approvedProduct.productMerchandising[p.id].review.es='approved';assert.equal(publishedCatalogueV3(approvedProduct).products[0].merchandising.highlights.length,2);
 assert.equal(publishedCatalogueV3(approvedProduct).webLinksEnabled,false);
});
test('radio options preserve exact child URL mapping and disabled CTAs; single variants stay simple',()=>{
 const qa=buildReviewCatalogueV3(source),p=qa.products.find(p=>p.id==='raquex-elite-padel-balls');
 assert.deepEqual(p.variants.map(v=>new URL(v.destinations.web.url).pathname),['/dp/B0D123Q6RL','/dp/B0D1VZ4VNJ','/dp/B0D1VXLW6J']);
 for(const language of ['en','es']){const html=renderShop(qa,language);assert.match(html,/type="radio"/);assert.match(html,/value="2"/);assert.match(html,/class="shop-retailer" type="button" disabled/);assert.doesNotMatch(html,/href="https:\/\/www.amazon/);assert.match(html,/shop-highlights/);}
 assert.equal(publishedCatalogueV3(source).products.length,0);
});
