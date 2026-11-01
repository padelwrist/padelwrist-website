import {safeURL} from './shop-urls.mjs';
const ASIN=/^[A-Z0-9]{10}$/;
const CATEGORY = {'Padel Rackets':'rackets','Bags & Backpacks':'bags','Padel Balls':'balls','Grips & Overgrips':'grips','Caps & Wristbands':'accessories','Racket Covers':'accessories','Racket Protection':'accessories','Grip Aids':'grips','Training Equipment':'coaching','Training Balls':'balls','Ball Care & Pressurisers':'accessories','Needs Classification':null};
const fail = message=>{throw new Error(`Shop intake: ${message}`);};
const text = value=>typeof value==='string' && value.length<=2048 && !/[\u0000-\u001f<>]/.test(value);
function directURL(value,asin) {
 const u=safeURL(value);
 if(u.hostname!=='www.amazon.co.uk' || u.pathname!==`/dp/${asin}` || u.search)fail('ASIN/URL mismatch');
}
export function stageIntake(intake, reconciliation) {
 if(!Array.isArray(intake.candidates) || intake.candidates.length!==intake.candidateCount || intake.candidateCount>500 || !Array.isArray(intake.amazonASINMissingLeads))fail('invalid counts');
 const seen=new Set();
 const records=intake.candidates.map(c=>{
   if(!ASIN.test(c.asin) || seen.has(c.asin))fail('invalid/duplicate ASIN');seen.add(c.asin);
   if(!text(c.title)||!c.title||!(c.category in CATEGORY)||!Array.isArray(c.audiences)||c.audiences.some(a=>!['players','clubs'].includes(a)))fail('invalid candidate metadata');
   const quarantine=c.productURL===null;
   if(!quarantine) directURL(c.productURL,c.asin);
   else if(c.asin!=='B0DQY6CKVJ' || c.audiences.length || c.category!=='Needs Classification')fail('unresolved product identity');
   safeURL(c.sourceURL);
   if(c.websiteAffiliateURLCandidate!==null){const u=safeURL(c.websiteAffiliateURLCandidate);if(u.hostname!=='www.amazon.co.uk'||u.pathname!==`/dp/${c.asin}`||u.searchParams.get('tag')!=='thediaryroom-21'||[...u.searchParams.keys()].some(k=>k!=='tag'))fail('unapproved candidate URL');}
   return {...c,publicationStatus:'unpublished',affiliateEligibility:'unverified',imageRights:'unverified',
    canonicalCategoryId:CATEGORY[c.category],stagingStatus:quarantine?'identity-quarantine':'awaiting-verification',
    proposedFamilyKey:c.familyKey,variantRelationshipStatus:'unverified',verifiedParentASIN:null,
    imageReview:{source:null,verificationStatus:'unverified',evidence:[],permittedSurfaces:[]},
    reviewFlags:[...(quarantine?['storefront-reference-not-product-proof']:[]),...(c.category==='Padel Rackets'?['model-construction-year-must-remain-distinct']:[]),...(/carton|bucket|tubes|120|72|6 \/ 12 \/ 24/i.test(c.variantLabel||'')?['quantity-and-selected-child-require-verification']:[]),...(/Machine|Pressuriser/.test(c.title)?['equipment-not-ball-pack']:[])]};
 });
 const researchLeads=intake.amazonASINMissingLeads.map(lead=>{
   if(lead.status!=='research-only'||!text(lead.name)||!lead.name||'asin'in lead||'productURL'in lead)fail('research lead cannot become a product');
   safeURL(lead.sourceURL);return {...lead,publicationStatus:'research-only'};
 });
 if(reconciliation.matchedASINs!==records.length||reconciliation.matchedResearchLeads!==researchLeads.length)fail('workbook reconciliation missing');
 const proposedFamilies=[...new Set(records.map(r=>r.proposedFamilyKey))].map(key=>({key,name:records.find(r=>r.proposedFamilyKey===key).familyName,
  asins:records.filter(r=>r.proposedFamilyKey===key).map(r=>r.asin),relationshipStatus:'proposed-not-verified'}));
 const value={schemaVersion:1,generatedOn:intake.generatedOn,sourceWorkbook:reconciliation.workbook,
  provenance:{workbookSHA256:reconciliation.workbookSHA256,jsonSHA256:reconciliation.jsonSHA256},records,researchLeads,proposedFamilies,storefrontSources:reconciliation.storefronts};
 validateStaging(value);return value;
}
export function validateStaging(value) {
 if(value.schemaVersion!==1 || !Array.isArray(value.records)||!Array.isArray(value.researchLeads)||!Array.isArray(value.proposedFamilies))fail('invalid staging schema');
 const seen=new Set();for(const r of value.records){
  if(!ASIN.test(r.asin)||seen.has(r.asin)||r.publicationStatus!=='unpublished'||r.affiliateEligibility!=='unverified'||r.imageRights!=='unverified'||r.variantRelationshipStatus!=='unverified'||r.verifiedParentASIN!==null)fail('staging cannot approve publication or variants');
  seen.add(r.asin);if(r.productURL!==null)directURL(r.productURL,r.asin);
  if(!text(r.title)||!(r.category in CATEGORY)||r.canonicalCategoryId!==CATEGORY[r.category])fail('invalid staging product');
  if(r.asin==='B0DQY6CKVJ'&&(r.productURL!==null||r.websiteAffiliateURLCandidate!==null||r.audiences.length||r.stagingStatus!=='identity-quarantine'))fail('MaxPadel identity remains unresolved');
  if(r.imageReview?.source!==null||r.imageReview?.verificationStatus!=='unverified'||r.imageReview?.permittedSurfaces?.length||r.imageReview?.evidence?.length)fail('unreviewed staging image');
 }
 for(const lead of value.researchLeads)if(lead.status!=='research-only'||lead.publicationStatus!=='research-only'||'asin'in lead||'productURL'in lead)fail('invalid research lead');
 for(const family of value.proposedFamilies)if(family.relationshipStatus!=='proposed-not-verified'||family.asins.some(asin=>!seen.has(asin)))fail('unverified family relationship');
 return value;
}
