import {validateCatalogueV2,publishedCatalogueV2} from './shop-catalogue-v2.mjs';
import {MAX_BYTES} from './shop-catalogue.mjs';
export const BADGES=['featured','editorsPick'];
export const SUITABILITY=['beginner','intermediate','advanced','training','clubEssential'];
const fail=()=>{throw new Error('Shop catalogue: invalid merchandising');};
const keys=(v,allowed)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!allowed.includes(k)))fail();};
const copy=value=>typeof value==='string'&&value.trim()===value&&value.length>0&&value.length<=100&&!/[\u0000-\u001f<>£€$]|best seller|bestseller|más vendido|amazon.?s choice|stars|estrellas|ratings|valoraciones/i.test(value);
export function validateMerchandising(value){
 keys(value,['highlights','suitability','badge']);
 if(!Object.keys(value).length)fail();
 if(value.highlights!==undefined){if(!Array.isArray(value.highlights)||value.highlights.length<2||value.highlights.length>3)fail();
  for(const h of value.highlights){keys(h,['en','es']);if(!copy(h.en)||!copy(h.es))fail();}
  for(const l of ['en','es'])if(new Set(value.highlights.map(h=>h[l].toLowerCase())).size!==value.highlights.length)fail();
 }
 if(value.suitability!==undefined&&!SUITABILITY.includes(value.suitability))fail();
 if(value.badge!==undefined&&!BADGES.includes(value.badge))fail();
 return value;
}
export function validateEditorialMerchandising(source){
 keys(source.productMerchandising??{},source.catalogue.products.map(p=>p.id));
 for(const entry of Object.values(source.productMerchandising??{})){
  keys(entry,['content','review','evidence','assessment']);validateMerchandising(entry.content);keys(entry.review,['en','es']);
  if(!['en','es'].every(l=>['pending','approved'].includes(entry.review[l])))fail();
  if(!Array.isArray(entry.evidence)||!entry.evidence.length)fail();
  for(const evidence of entry.evidence){try{const u=new URL(evidence);if(u.protocol!=='https:'||u.username||u.password)fail();}catch{fail();}}
  if(entry.content.suitability!==undefined){
   keys(entry.assessment,['status','basis']);if(entry.assessment.status!=='approved'||!copy(entry.assessment.basis))fail();
  } else if(entry.assessment!==undefined)fail();
 }
}
export function validateCatalogueV3(value,options){
 if(value?.schemaVersion!==3||!Array.isArray(value.products))fail();
 const products=value.products.map(p=>{const {merchandising,...legacy}=p;if(merchandising!==undefined)validateMerchandising(merchandising);return legacy;});
 validateCatalogueV2({...value,schemaVersion:2,products},options);
 if(new TextEncoder().encode(JSON.stringify(value)).length>MAX_BYTES)fail();return value;
}
export function publishedCatalogueV3(source,options){
 validateEditorialMerchandising(source);const feed=publishedCatalogueV2(source,options);
 const products=feed.products.map(p=>{const entry=source.productMerchandising?.[p.id];return entry?.review.en==='approved'&&entry.review.es==='approved'?{...p,merchandising:entry.content}:p;});
 return validateCatalogueV3({...feed,schemaVersion:3,products},options);
}
