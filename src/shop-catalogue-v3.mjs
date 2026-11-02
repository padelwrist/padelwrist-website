import {validateCatalogueV2,publishedCatalogueV2} from './shop-catalogue-v2.mjs';
import {MAX_BYTES} from './shop-catalogue.mjs';
const fail=()=>{throw new Error('Shop catalogue: invalid merchandising');};
const keys=(v,allowed)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!allowed.includes(k)))fail();};
const identifier=v=>typeof v==='string'&&v.length<=80&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const copy=(v,max=100)=>typeof v==='string'&&v.trim()===v&&v.length>0&&v.length<=max&&!/[\u0000-\u001f<>£€$]|best.?seller|más vendido|amazon.?s choice|stars|estrellas|ratings|valoraciones|discount|descuento/i.test(v);
const localized=(v,max)=>{keys(v,['en','es']);if(!copy(v.en,max)||!copy(v.es,max))fail();};
function label(value){
 keys(value,['id','text','audiences']);if(!identifier(value.id)||/best.?seller|amazon|rating|promo/.test(value.id))fail();localized(value.text,40);
 if(value.audiences!==undefined&&(!Array.isArray(value.audiences)||!value.audiences.length||new Set(value.audiences).size!==value.audiences.length||value.audiences.some(a=>!['players','clubs'].includes(a))))fail();
}
export function validateMerchandising(value){
 keys(value,['shortDescription','highlights','suitability','badge']);if(!Object.keys(value).length)fail();
 if(value.shortDescription!==undefined)localized(value.shortDescription,220);
 if(value.highlights!==undefined){if(!Array.isArray(value.highlights)||value.highlights.length<2||value.highlights.length>3)fail();
  for(const h of value.highlights)localized(h,100);
  for(const l of ['en','es'])if(new Set(value.highlights.map(h=>h[l].toLowerCase())).size!==value.highlights.length)fail();
 }
 if(value.suitability!==undefined)label(value.suitability);if(value.badge!==undefined)label(value.badge);return value;
}
export function validateEditorialMerchandising(source){
 keys(source.productMerchandising??{},source.catalogue.products.map(p=>p.id));
 for(const [id,entry] of Object.entries(source.productMerchandising??{})){
  keys(entry,['content','review','evidence','assessment']);validateMerchandising(entry.content);keys(entry.review,['en','es']);
  if(!['en','es'].every(l=>['pending','approved'].includes(entry.review[l])))fail();
  if(!Array.isArray(entry.evidence)||!entry.evidence.length)fail();
  for(const evidence of entry.evidence){try{const u=new URL(evidence);if(u.protocol!=='https:'||u.username||u.password)fail();}catch{fail();}}
  const product=source.catalogue.products.find(p=>p.id===id);
  for(const l of [entry.content.suitability,entry.content.badge])if(l?.audiences?.some(a=>!product.audiences.includes(a)))fail();
  if(entry.content.suitability!==undefined){
   keys(entry.assessment,['status','basis']);if(!['approved','evidenceRecorded'].includes(entry.assessment.status)||!copy(entry.assessment.basis))fail();
   if(entry.assessment.status==='evidenceRecorded'&&!source.productApprovals.some(a=>a.productId===id&&a.review?.editorialReadiness==='ready-for-editorial-review'&&a.review.evidence.some(e=>entry.evidence.includes(e.url))))fail();
  }else if(entry.assessment!==undefined)fail();
 }
 validateEditorialPresentation(source);
}
function validateProductPresentation(product){
 if(product.audienceOrder!==undefined){keys(product.audienceOrder,product.audiences);if(!Object.keys(product.audienceOrder).length||Object.values(product.audienceOrder).some(n=>!Number.isSafeInteger(n)||n<0||n>10000))fail();}
 if(product.defaultVariantID!==undefined&&!product.variants.some(v=>v.id===product.defaultVariantID&&v.publicationStatus==='published'))fail();
}
export function validateEditorialPresentation(source){
 keys(source.productPresentation??{},source.catalogue.products.map(p=>p.id));
 for(const [id,entry] of Object.entries(source.productPresentation??{})){
  keys(entry,['audienceOrder','variantOrder','defaultVariantID']);const p=source.catalogue.products.find(p=>p.id===id);
  if(!Array.isArray(entry.variantOrder)||entry.variantOrder.length!==p.variants.length||new Set(entry.variantOrder).size!==p.variants.length||entry.variantOrder.some(id=>!p.variants.some(v=>v.id===id))||!entry.variantOrder.includes(entry.defaultVariantID))fail();
  validateProductPresentation({...p,audienceOrder:entry.audienceOrder});
 }
}
export function applyPresentation(source,product){
 const entry=source.productPresentation?.[product.id];if(!entry)return product;
 const variants=[...product.variants].sort((a,b)=>entry.variantOrder.indexOf(a.id)-entry.variantOrder.indexOf(b.id));
 const defaultVariantID=variants.some(v=>v.id===entry.defaultVariantID)?entry.defaultVariantID:variants[0]?.id;
 return {...product,variants,audienceOrder:entry.audienceOrder,defaultVariantID};
}
export function validateCatalogueV3(value,options){
 if(value?.schemaVersion!==3||!Array.isArray(value.products))fail();
 const products=value.products.map(p=>{const {merchandising,audienceOrder,defaultVariantID,...legacy}=p;if(merchandising!==undefined)validateMerchandising(merchandising);validateProductPresentation(p);
  for(const l of [merchandising?.suitability,merchandising?.badge])if(l?.audiences?.some(a=>!p.audiences.includes(a)))fail();return legacy;});
 validateCatalogueV2({...value,schemaVersion:2,products},options);if(new TextEncoder().encode(JSON.stringify(value)).length>MAX_BYTES)fail();return value;
}
export function publishedCatalogueV3(source,options){
 validateEditorialMerchandising(source);const feed=publishedCatalogueV2(source,options);
 const products=feed.products.map(p=>{const entry=source.productMerchandising?.[p.id],product=applyPresentation(source,p);return entry?.review.en==='approved'&&entry.review.es==='approved'?{...product,merchandising:entry.content}:product;});
 return validateCatalogueV3({...feed,schemaVersion:3,products},options);
}
