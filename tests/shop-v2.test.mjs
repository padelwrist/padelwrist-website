import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs/promises';
import {validateCatalogue,publishedCatalogue} from '../src/shop-catalogue.mjs';
import {validateCatalogueV2,publishedCatalogueV2,validateEditorialBrands} from '../src/shop-catalogue-v2.mjs';
import {buildReviewCatalogue} from '../src/shop-review.mjs';
import {renderShop} from '../scripts/build-shop.mjs';
import worker from '../src/content-negotiation.mjs';
const source=JSON.parse(await fs.readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
test('v1 stays strict and identical while the v2 endpoint has an independent validated representation',async()=>{
 const v1=publishedCatalogue(source),v2=publishedCatalogueV2(source);
 assert.equal(v1.schemaVersion,1);assert.equal(v2.schemaVersion,2);assert.equal(v2.products.length,0);assert.deepEqual(v2.brands,[]);
 assert.deepEqual(v1,JSON.parse(await fs.readFile(new URL('../catalogue/v1.json',import.meta.url),'utf8')));
 assert.throws(()=>validateCatalogue({...v1,brands:[]}));assert.throws(()=>validateCatalogueV2(v1));assert.throws(()=>validateCatalogue(v2));
 for(const version of [1,2]){const data=JSON.stringify(version===1?v1:v2),env={ASSETS:{fetch:async()=>new Response(data,{headers:{'Content-Type':'application/json'}})}};
  const url=`https://padelwrist.com/catalogue/v${version}.json`;const get=await worker.fetch(new Request(url),env);assert.equal(get.status,200);
  const etag=get.headers.get('ETag');assert.equal((await worker.fetch(new Request(url,{headers:{'If-None-Match':etag}}),env)).status,304);
  assert.equal((await worker.fetch(new Request(url,{method:'HEAD'}),env)).status,200);
 }
 const wrong={ASSETS:{fetch:async()=>new Response(JSON.stringify(v1),{headers:{'Content-Type':'application/json'}})}};
 assert.equal((await worker.fetch(new Request('https://padelwrist.com/catalogue/v2.json'),wrong)).status,503);
});
test('editorial brands require evidence, explicit mappings and unique validated identities',()=>{
 validateEditorialBrands(source);
 for(const mutate of [s=>s.editorialBrands[0].status='pending',s=>s.editorialBrands[0].evidence=[],s=>s.editorialBrands.push(s.editorialBrands[0]),s=>s.productBrands[s.catalogue.products[0].id]='unknown',s=>delete s.productBrands[s.catalogue.products[0].id]]){const s=structuredClone(source);mutate(s);assert.throws(()=>validateEditorialBrands(s));}
 const qa=buildReviewCatalogue(source);assert.equal(qa.products.length,11);assert.ok(!qa.products.some(p=>p.id==='pusun-pt-max-c-machine'));assert.equal(qa.products.flatMap(p=>p.variants).length,13);
 for(const mutate of [v=>v.products[0].brandID='unknown',v=>delete v.products[0].brandID,v=>v.brands.push(v.brands[0]),v=>v.brands[0].name='<script>',v=>v.products[0].price=123]){const v=structuredClone(qa);mutate(v);assert.throws(()=>validateCatalogueV2(v));}
 qa.products[0].title.en='A title with no brand prefix';assert.equal(validateCatalogueV2(qa).products[0].brandID,'raquex');
 const html=renderShop(qa,'es');assert.match(html,/data-shop-brand/);assert.match(html,/data-shop-category-choice="rackets"/);assert.match(html,/aria-pressed="false"/);assert.match(html,/aria-live="polite"/);assert.match(html,/Restablecer filtros/);assert.doesNotMatch(html,/href="https:\/\/www.amazon/);
});
test('the earlier Enhance SiteStripe exclusion remains an explicit activation hold',()=>{
 const a=source.productApprovals.find(a=>a.review.asin==='B0755HRLQD');assert.equal(a.status,'pending');assert.equal(a.review.affiliateDestination.eligibilityStatus,'hold-sitestripe-exclusion-recheck');
 const s=structuredClone(source),p=s.catalogue.products.find(p=>p.id===a.productId);p.variants[0].destinations.web.enabled=true;p.variants[0].destinations.web.reviewedAt='2026-11-02T08:50:00Z';
 assert.throws(()=>publishedCatalogue(s),/eligibility hold/);
});
