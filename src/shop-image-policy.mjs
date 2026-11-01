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
