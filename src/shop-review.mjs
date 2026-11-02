import {validateEditorialMerchandising,validateCatalogueV3} from './shop-catalogue-v3.mjs';
import {enrichCatalogueV2} from './shop-catalogue-v2.mjs';
/** Isolated renderer fixture only. Never called by the publication/Worker paths. */
export function buildReviewCatalogue(source){
 const legacy=structuredClone(source.catalogue);legacy.expiresAt='2099-01-01T00:00:00Z';
 legacy.products=legacy.products.filter(p=>p.variants.every(v=>source.productApprovals.some(a=>a.productId===p.id&&a.variantId===v.id&&a.status==='pending'&&a.review?.editorialReadiness==='ready-for-editorial-review')));
 for(const p of legacy.products){p.publicationStatus='published';for(const v of p.variants){v.publicationStatus='published';v.destinations.mobile=[];if(v.destinations.web)v.destinations.web.enabled=false;}}
 legacy.webLinksEnabled=false;return enrichCatalogueV2(source,legacy);
}

/** Pending copy is rendered only by the explicitly isolated editorial review workflow. */
export function buildReviewCatalogueV3(source){
 validateEditorialMerchandising(source);const feed=buildReviewCatalogue(source);
 return validateCatalogueV3({...feed,schemaVersion:3,products:feed.products.map(p=>{
  const entry=source.productMerchandising?.[p.id];return entry?{...p,merchandising:entry.content}:p;
 })});
}
