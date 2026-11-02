import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {approvedCategoryPhoto,approvedEditorialImage,categoryPhotography} from '../src/shop-image-policy.mjs';
import {auditShopPhotography} from '../scripts/audit-shop-photography.mjs';
import {renderShop} from '../scripts/build-shop.mjs';
import {buildReviewCatalogue} from '../src/shop-review.mjs';
const root=new URL('../',import.meta.url).pathname;
const source=JSON.parse(await readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
test('free category photography is reviewed for both surfaces, hash-bound and cannot authorise product likeness',async()=>{
 assert.equal(await auditShopPhotography(root),20);
 assert.equal(Object.keys(categoryPhotography(source)).length,10);
 for(const image of Object.values(source.categoryPhotography)){
  assert.ok(approvedCategoryPhoto(source,image));assert.equal(approvedEditorialImage(source,image),false);
  for(const mutate of [a=>a.freeLibraryVerified=false,a=>a.licenseURL='https://unsplash.com/plus/license',a=>a.sourceURL='https://plus.unsplash.com/photo',a=>a.permittedSurfaces=['web'],a=>a.photographer='',a=>a.reviewedAt='2099-01-01',a=>a.evidence=[]]){
   const invalid=structuredClone(source);mutate(invalid.imageApprovals.find(a=>a.licenseId===image.licenseId));assert.equal(approvedCategoryPhoto(invalid,image),false);
  }
 }
});
test('both languages render local responsive category photos and explicit illustrative product captions, without public products',()=>{
 for(const language of ['en','es']){
  const html=renderShop(buildReviewCatalogue(source),language);
  assert.match(html,/type="image\/webp"/);assert.match(html,/-320.webp 320w/);assert.match(html,/data-technical-fallback/);
  assert.match(html,language==='en'?/Image for illustration purposes only/:/Imagen solo con fines ilustrativos/);
  assert.doesNotMatch(html,/src="https:\/\/(?:images\.unsplash|.*amazon)/);
 }
 assert.equal(source.catalogue.products.length,12);
 assert.ok(source.catalogue.products.every(p=>p.publicationStatus==='draft'));
});
