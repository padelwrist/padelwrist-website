import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {categoryPhotography} from '../src/shop-image-policy.mjs';
export async function auditShopPhotography(root, nativeRoot=null) {
 const source=JSON.parse(await readFile(resolve(root,'data/shop/catalogue.json'),'utf8'));
 const registry=JSON.parse(await readFile(resolve(root,'image-licenses.json'),'utf8')).shopCategoryAssets;
 const photos={...categoryPhotography(source),...Object.fromEntries(Object.entries(categoryPhotography(source,'productFallbackPhotography')).map(([k,v])=>['context-'+k,v]))}, expected=new Set();
 for(const [category,image] of Object.entries(photos)){
  const record=source.imageApprovals.find(a=>a.url===image.url&&a.licenseId===image.licenseId);
  if(!registry?.some(a=>JSON.stringify(a)===JSON.stringify(record)))throw new Error('Inconsistent image licence register');
  const stem=new URL(image.url).pathname.slice(1).replace(/\.jpg$/,'');
  const files=[stem+'.jpg',...[320,640,960].map(w=>stem+'-'+w+'.webp')];
  if(Object.keys(record.files??{}).sort().join()!==files.sort().join())throw new Error('Missing responsive derivatives');
  for(const file of files){
   expected.add(file.split('/').pop());const bytes=await readFile(resolve(root,file));
   if(bytes.length>350000||createHash('sha256').update(bytes).digest('hex')!==record.files[file])throw new Error('Unreviewed or oversized derivative: '+file);
  }
  if(nativeRoot){
   const bytes=await readFile(resolve(nativeRoot,'Assets.xcassets/Shop',record.nativeAsset+'.imageset',record.nativeAsset+'.jpg'));
   if(createHash('sha256').update(bytes).digest('hex')!==record.files[stem+'.jpg'])throw new Error('Native photo differs: '+category);
  }
 }
 for(const file of await readdir(resolve(root,'catalogue/images')))if(/^photo-.*\.(jpg|webp)$/.test(file)&&!expected.has(file))throw new Error('Unregistered category photo: '+file);
 if(nativeRoot){const native=JSON.parse(await readFile(resolve(nativeRoot,'Resources/Shop/category-photo-licenses.json'),'utf8'));if(JSON.stringify(native.assets)!==JSON.stringify(registry))throw new Error('Native licence evidence differs');}
 return Object.keys(photos).length;
}
if(process.argv[1]?.endsWith('audit-shop-photography.mjs'))console.log('Verified category photography:',await auditShopPhotography(process.cwd(),process.argv[2]??null));
