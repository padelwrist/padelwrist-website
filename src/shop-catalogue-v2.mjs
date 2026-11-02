import {validateCatalogue,publishedCatalogue,MAX_BYTES} from './shop-catalogue.mjs';
const fail=()=>{throw new Error('Shop catalogue: invalid editorial brand');};
const id=value=>typeof value==='string'&&value.length<=80&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
const name=value=>typeof value==='string'&&value.trim()===value&&value.length>0&&value.length<=80&&!/[\u0000-\u001f<>]/.test(value);
function brands(value){
 if(!Array.isArray(value)||value.length>100)fail();const ids=new Set(),names=new Set();
 for(const b of value){if(!b||Object.keys(b).some(k=>!['id','name'].includes(k))||!id(b.id)||!name(b.name)||ids.has(b.id)||names.has(b.name.toLowerCase()))fail();ids.add(b.id);names.add(b.name.toLowerCase());}return ids;
}
export function validateEditorialBrands(source){
 if(!Array.isArray(source.editorialBrands)||!source.productBrands||typeof source.productBrands!=='object'||Array.isArray(source.productBrands))fail();
 brands(source.editorialBrands.map(({id,name})=>({id,name})));
 for(const b of source.editorialBrands){
  if(Object.keys(b).some(k=>!['id','name','status','checkedAt','evidence'].includes(k))||b.status!=='verified'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/.test(b.checkedAt)||!Number.isFinite(Date.parse(b.checkedAt))||!Array.isArray(b.evidence)||!b.evidence.length)fail();
  for(const evidence of b.evidence){let u;try{u=new URL(evidence);}catch{fail();}if(u.protocol!=='https:'||u.username||u.password)fail();}
 }
 const known=new Set(source.editorialBrands.map(b=>b.id));const products=new Set(source.catalogue.products.map(p=>p.id));
 if(Object.keys(source.productBrands).some(key=>!products.has(key)))fail();
 for(const p of source.catalogue.products)if(!known.has(source.productBrands[p.id]))fail();
}
export function validateCatalogueV2(value,options){
 if(value?.schemaVersion!==2||!Array.isArray(value.products))fail();
 const ids=brands(value.brands);
 const products=value.products.map(p=>{if(!p||!ids.has(p.brandID))fail();const {brandID,...legacy}=p;return legacy;});
 const {brands:_,...legacy}=value;
 validateCatalogue({...legacy,schemaVersion:1,products},options);
 if(new TextEncoder().encode(JSON.stringify(value)).length>MAX_BYTES)fail();return value;
}
export function enrichCatalogueV2(source,legacy,options){
 validateEditorialBrands(source);
 const products=legacy.products.map(p=>({...p,brandID:source.productBrands[p.id]}));
 const used=new Set(products.map(p=>p.brandID));
 const result={...legacy,schemaVersion:2,brands:source.editorialBrands.filter(b=>used.has(b.id)).map(({id,name})=>({id,name})).sort((a,b)=>a.name.localeCompare(b.name)),products};
 return validateCatalogueV2(result,options);
}
export function publishedCatalogueV2(source,options){return enrichCatalogueV2(source,publishedCatalogue(source,options),options);}
