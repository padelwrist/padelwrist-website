/** Editorial photography is independent of Amazon API eligibility. */
export const EDITORIAL_IMAGE_SOURCES = ['padelwristOwned','manufacturerLicensed','padelwristIllustration'];
export function approvedEditorialImage(source,image,surfaces=['web','mobile']) {
 return source.imageApprovals?.some(a=>a.url===image.url && a.licenseId===image.licenseId && a.status==='approved'
  && EDITORIAL_IMAGE_SOURCES.includes(a.source) && Array.isArray(a.permittedSurfaces) && surfaces.every(surface=>a.permittedSurfaces.includes(surface))
  && Array.isArray(a.evidence) && a.evidence.length>0 && a.evidence.every(e=>typeof e==='string'&&e.trim().length>0)
  && typeof a.reviewedAt==='string' && Number.isFinite(Date.parse(a.reviewedAt))) ?? false;
}
export function categoryIllustrationURL(category) {
 const slug=category.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
 return `https://padelwrist.com/catalogue/images/category-${slug}.svg`;
}

/** Unsplash copyright grants apply to reviewed category context only, not product likeness. */
export function approvedCategoryPhoto(source, image) {
 const record=source.imageApprovals?.find(a=>a.url===image?.url&&a.licenseId===image?.licenseId);
 if(!record||record.source!=='unsplashCategory'||record.status!=='approved'||record.freeLibraryVerified!==true)return false;
 try {
  const url=new URL(record.sourceURL), local=new URL(image.url);
  return url.protocol==='https:'&&url.hostname==='unsplash.com'&&url.pathname.startsWith('/photos/')&&url.pathname.endsWith(record.photoID)
   &&local.origin==='https://padelwrist.com'&&/^\/catalogue\/images\/photo-[a-z-]+\.jpg$/.test(local.pathname)&&!local.search
   &&record.licenseURL==='https://unsplash.com/license'&&typeof record.photographer==='string'&&record.photographer.trim().length>0
   &&['web','mobile'].every(s=>record.permittedSurfaces?.includes(s))
   &&Number.isFinite(Date.parse(record.reviewedAt))&&Date.parse(record.reviewedAt)<=Date.now()
   &&typeof record.rightsConsiderations==='string'&&record.rightsConsiderations.length>=40
   &&record.evidence?.includes(record.sourceURL)&&record.evidence?.includes(record.licenseURL)
   &&Array.isArray(record.crop)&&record.crop.length===4&&record.crop.every(Number.isFinite)
   &&typeof image.alt?.en==='string'&&image.alt.en.length>0&&typeof image.alt?.es==='string'&&image.alt.es.length>0;
 } catch{return false;}
}
export function categoryPhotography(source, field='categoryPhotography') {
 const result={};
 for(const category of source.catalogue.categories){
  const image=source[field]?.[category.id];
  if(!approvedCategoryPhoto(source,image))throw new Error('Category photography rights missing: '+category.id);
  result[category.id]=image;
 }
 if(Object.keys(source[field]).some(id=>!source.catalogue.categories.some(c=>c.id===id)))throw new Error('Unknown photo category');
 return result;
}
