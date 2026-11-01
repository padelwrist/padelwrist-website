import { validateCatalogue, MAX_BYTES } from './shop-catalogue.mjs';

/** Read-only public feed. No cookies, geolocation, redirects, HTML negotiation or writes. */
export async function serveShopFeed(request, env) {
 const headers = {'Content-Type':'application/json; charset=utf-8','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET, HEAD','Cache-Control':'public, max-age=3600, must-revalidate'};
 if (!['GET','HEAD'].includes(request.method)) return new Response(null,{status:405,headers:{...headers,Allow:'GET, HEAD','Cache-Control':'no-store'}});
 // Fetch a full representation to validate even when the caller asks for HEAD/304.
 const assetURL = new URL(request.url); assetURL.search='';
 const asset = await env.ASSETS.fetch(new Request(assetURL,{method:'GET'}));
 if (asset.status !== 200) return new Response(null,{status:asset.status >= 400 ? asset.status : 503,headers:{...headers,'Cache-Control':'no-store'}});
 try {
   const length = Number(asset.headers.get('Content-Length'));
   if (length > MAX_BYTES) throw new Error('oversized');
   const reader=asset.body?.getReader(); if (!reader) throw new Error('empty');
   const chunks=[]; let size=0;
   try { while (true) { const {done,value}=await reader.read(); if(done) break; size+=value.length; if(size>MAX_BYTES) throw new Error('oversized'); chunks.push(value); } }
   finally { await reader.cancel(); }
   const bytes=new Uint8Array(size); let offset=0; for(const chunk of chunks) {bytes.set(chunk,offset);offset+=chunk.length;}
   const feed=JSON.parse(new TextDecoder().decode(bytes)); validateCatalogue(feed);
   if(feed.products.some(p=>p.publicationStatus!=='published' || p.variants.some(v=>v.publicationStatus!=='published'))) throw new Error('private product');
   const digest=await crypto.subtle.digest('SHA-256',bytes);
   const etag='"'+[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')+'"';
   headers.ETag=etag;
   if (request.headers.get('If-None-Match')?.split(',').some(tag=>tag.trim().replace(/^W\//,'')===etag || tag.trim()==='*')) return new Response(null,{status:304,headers});
   return new Response(request.method==='HEAD'?null:bytes,{status:200,headers});
 } catch { return new Response(null,{status:503,headers:{...headers,'Cache-Control':'no-store'}}); }
}
