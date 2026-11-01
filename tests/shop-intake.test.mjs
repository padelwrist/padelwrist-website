import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validateStaging} from '../src/shop-intake.mjs';
import {publishedCatalogue} from '../src/shop-catalogue.mjs';
import {approvedEditorialImage} from '../src/shop-image-policy.mjs';
const source=JSON.parse(await readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
test('78 distinct ASINs and 20 research leads reconcile without publication',()=>{
 const s=validateStaging(source.staging);assert.equal(s.records.length,78);assert.equal(new Set(s.records.map(r=>r.asin)).size,78);assert.equal(s.researchLeads.length,20);assert.equal(s.proposedFamilies.length,64);
 assert.equal(publishedCatalogue(source).products.length,0);
 assert.ok(s.records.every(r=>r.publicationStatus==='unpublished'&&r.variantRelationshipStatus==='unverified'&&r.verifiedParentASIN===null));
 assert.ok(s.researchLeads.every(r=>r.publicationStatus==='research-only'&&!r.asin&&!r.productURL));
 assert.match(s.provenance.workbookSHA256,/^[a-f0-9]{64}$/);assert.match(s.provenance.jsonSHA256,/^[a-f0-9]{64}$/);
});
test('MaxPadel is quarantined and machines/pressurisers are not bulk balls',()=>{
 const get=asin=>source.staging.records.find(r=>r.asin===asin);
 assert.equal(get('B0DQY6CKVJ').productURL,null);assert.equal(get('B0DQY6CKVJ').websiteAffiliateURLCandidate,null);assert.deepEqual(get('B0DQY6CKVJ').audiences,[]);
 assert.equal(get('B0GV226SKF').canonicalCategoryId,'coaching');assert.equal(get('B0H5XFQWPQ').canonicalCategoryId,'accessories');
 assert.match(get('B0B5253P1F').variantLabel,/unit needs confirmation/);assert.match(get('B0D3ZFSH5T').variantLabel,/mapping unverified/);
 const xzero=source.staging.proposedFamilies.find(f=>f.key==='nox-x-zero-padel-racket-2026');assert.equal(xzero.asins.length,2);assert.equal(xzero.relationshipStatus,'proposed-not-verified');
});
test('staging flags cannot approve a product, image or storefront identity',()=>{
 for(const mutate of [s=>s.records[0].publicationStatus='published',s=>s.records[0].imageReview.verificationStatus='verified',s=>s.researchLeads[0].asin='B000000001',s=>s.records.find(r=>r.asin==='B0DQY6CKVJ').productURL='https://www.amazon.co.uk/dp/B0DQY6CKVJ']){
  const s=structuredClone(source.staging);mutate(s);assert.throws(()=>validateStaging(s));
 }
});
test('owned/manufacturer imagery requires evidence and explicit website/app permission independently of API access',()=>{
 const image={url:'https://padelwrist.com/catalogue/images/manufacturer.jpg',licenseId:'permission-1'};
 const approval={...image,status:'approved',source:'manufacturerLicensed',permittedSurfaces:['web'],evidence:['written-permission-reference'],reviewedAt:'2026-11-01T00:00:00Z'};
 assert.equal(approvedEditorialImage({imageApprovals:[approval]},image),false);
 assert.equal(approvedEditorialImage({imageApprovals:[approval]},image,['web']),true);
 approval.permittedSurfaces.push('mobile');assert.equal(approvedEditorialImage({imageApprovals:[approval]},image),true);
 approval.evidence=[];assert.equal(approvedEditorialImage({imageApprovals:[approval]},image),false);
 assert.equal(Object.keys(source.categoryIllustrations).length,10);assert.ok(Object.values(source.categoryIllustrations).every(art=>approvedEditorialImage(source,art)));
});
