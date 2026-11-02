import fs from 'node:fs/promises';
import path from 'node:path';
import {buildReviewCatalogueV3} from '../src/shop-review.mjs';
import {renderShop} from './build-shop.mjs';
const directory=process.argv[2];if(!directory||!path.isAbsolute(directory))throw new Error('Supply an absolute temporary review directory');
await fs.mkdir(directory,{recursive:true});const actual=await fs.realpath(directory);
if(!actual.startsWith('/private/tmp/')&&!actual.startsWith('/tmp/'))throw new Error('Review outputs must remain in temporary storage');
const source=JSON.parse(await fs.readFile(new URL('../data/shop/catalogue.json',import.meta.url),'utf8'));
const feed=buildReviewCatalogueV3(source);
await fs.writeFile(path.join(actual,'catalogue-v3-review.json'),JSON.stringify(feed,null,2)+'\n');
for(const language of ['en','es']){
 const notice=language==='en'?'Editorial review preview · publication and affiliate approval pending':'Vista previa editorial · publicación y afiliación pendientes';
 const html=renderShop(feed,language).replace('index,follow,max-image-preview:large','noindex,nofollow,noarchive').replace('<main id="main"',`<aside class="shell shop-review-notice">${notice}</aside><main id="main"`);
 await fs.writeFile(path.join(actual,`shop-${language}.html`),html);
}
console.log(`Isolated review: ${feed.products.length} families; all links disabled; ${actual}`);
