/** Optional server-only Creators API adapter. No images, credentials or API content are persisted. */
import {MARKETPLACES,validateCatalogue} from './shop-catalogue.mjs';
const ASIN=/^[A-Z0-9]{10}$/;
const AUTH={'3.1':'https://api.amazon.com/auth/o2/token','3.2':'https://api.amazon.co.uk/auth/o2/token','3.3':'https://api.amazon.co.jp/auth/o2/token'};
const API='https://creatorsapi.amazon/catalog/v1/';
export const CONTENT_TTL_SECONDS=3600;
const RESOURCES=['images.primary.medium','itemInfo.title','parentASIN','itemInfo.productInfo'];
function unavailable(){throw new Error('Optional Amazon content unavailable');}
async function boundedJSON(response,maximum=512000){
 if(!response.ok||!response.headers.get('Content-Type')?.toLowerCase().includes('application/json')||Number(response.headers.get('Content-Length'))>maximum)unavailable();
 const reader=response.body?.getReader();if(!reader)unavailable();let size=0;const chunks=[];
 try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>maximum)unavailable();chunks.push(value);}}finally{await reader.cancel();}
 const data=new Uint8Array(size);let offset=0;for(const chunk of chunks){data.set(chunk,offset);offset+=chunk.length;}return JSON.parse(new TextDecoder().decode(data));
}
function apiImage(value){
 if(!value)return null;
 let url;try{url=new URL(value.url);}catch{return null;}
 if(url.protocol!=='https:'||url.hostname!=='m.media-amazon.com'||url.username||url.password||url.port||url.search||url.hash||!/^\/images\/I\/[a-zA-Z0-9+_.%-]+\.(jpg|png|webp)$/.test(url.pathname))return null;
 if(!Number.isInteger(value.width)||!Number.isInteger(value.height)||value.width<1||value.height<1||value.width>10000||value.height>10000)return null;
 return {url:url.href,width:value.width,height:value.height};
}
export function normalizeCreatorsItems(raw,{marketplace,partnerTag,allowedASINs,now=new Date()}){
 const items=[];const rows=raw.itemsResult?.items??raw.variationsResult?.items;
 if(!Array.isArray(rows)||rows.length>10)unavailable();
 for(const item of rows){
  if(!ASIN.test(item.asin)||!allowedASINs.includes(item.asin))continue;
  let destination;try{destination=new URL(item.detailPageURL);}catch{continue;}
  if(destination.protocol!=='https:'||destination.hostname!==MARKETPLACES[marketplace]||destination.username||destination.password||destination.port||destination.hash||destination.searchParams.get('tag')!==partnerTag||!new RegExp(`^/dp/${item.asin}/?$`).test(destination.pathname))continue;
  const title=item.itemInfo?.title?.displayValue;
  if(typeof title!=='string'||!title.trim()||title.length>512)continue;
  const attributes=Array.isArray(item.variationAttributes)?item.variationAttributes.filter(a=>typeof a.name==='string'&&typeof a.value==='string'&&a.name.length<=80&&a.value.length<=160).slice(0,12).map(a=>({name:a.name,value:a.value})):[];
  items.push({asin:item.asin,parentASIN:ASIN.test(item.parentASIN??'')?item.parentASIN:null,title,image:apiImage(item.images?.primary?.medium),attributes,detailPageURL:destination.href});
 }
 return {provider:'amazonCreators',schemaVersion:1,marketplace,fetchedAt:now.toISOString(),expiresAt:new Date(now.getTime()+CONTENT_TTL_SECONDS*1000).toISOString(),items};
}
export class CreatorsAPIClient{
 #credentialID;#secret;#version;#fetch;#token;#tokenExpires=0;
 constructor({credentialID,credentialSecret,credentialVersion,fetcher=fetch}){if(!credentialID||!credentialSecret||!AUTH[credentialVersion])unavailable();this.#credentialID=credentialID;this.#secret=credentialSecret;this.#version=credentialVersion;this.#fetch=fetcher;}
 async #accessToken(){
  if(this.#token&&Date.now()<this.#tokenExpires)return this.#token;
  const token=await boundedJSON(await this.#fetch(AUTH[this.#version],{method:'POST',redirect:'error',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/json'},body:JSON.stringify({grant_type:'client_credentials',client_id:this.#credentialID,client_secret:this.#secret,scope:'creatorsapi::default'})}),16000);
  if(typeof token.access_token!=='string'||!token.access_token||!Number.isFinite(token.expires_in)||token.expires_in<60)unavailable();
  this.#token=token.access_token;this.#tokenExpires=Date.now()+Math.min(token.expires_in-30,3300)*1000;return this.#token;
 }
 async #request(operation,payload){
  try{return await boundedJSON(await this.#fetch(API+operation,{method:'POST',redirect:'error',signal:AbortSignal.timeout(8000),headers:{'Content-Type':'application/json',Authorization:'Bearer '+await this.#accessToken(),'x-marketplace':payload.marketplace},body:JSON.stringify(payload)}));}
  catch{this.#token=undefined;this.#tokenExpires=0;unavailable();}
 }
 async getItems({asins,marketplace,partnerTag}){
  if(!MARKETPLACES[marketplace]||!Array.isArray(asins)||!asins.length||asins.length>10||asins.some(a=>!ASIN.test(a)))unavailable();
  const raw=await this.#request('getItems',{itemIds:asins,itemIdType:'ASIN',marketplace:MARKETPLACES[marketplace],partnerTag,resources:RESOURCES});
  return normalizeCreatorsItems(raw,{marketplace,partnerTag,allowedASINs:asins});
 }
 // For a future authenticated editorial review, not arbitrary public discovery or auto-grouping.
 async getVariations({asin,marketplace,partnerTag,page=1}){
  if(!ASIN.test(asin)||!MARKETPLACES[marketplace]||!Number.isInteger(page)||page<1||page>100)unavailable();
  const raw=await this.#request('getVariations',{asin,marketplace:MARKETPLACES[marketplace],partnerTag,variationCount:10,variationPage:page,resources:[...RESOURCES,'variationSummary.variationDimension']});
  const asins=(raw.variationsResult?.items??[]).map(i=>i.asin).filter(a=>ASIN.test(a));
  return {...normalizeCreatorsItems(raw,{marketplace,partnerTag,allowedASINs:asins}),page,pageCount:Math.min(Number(raw.variationsResult?.variationSummary?.pageCount)||1,100)};
 }
}

export async function serveOptionalCreatorsContent(request,env,{fetcher=fetch,clientFactory=config=>new CreatorsAPIClient(config)}={}){
 const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'*'};
 const disabled=()=>new Response('{"status":"unavailable","items":[]}',{status:503,headers});
 if(request.method!=='GET')return new Response(null,{status:405,headers:{...headers,Allow:'GET'}});
 // Fail before loading credentials, touching API quota or consulting private intake.
 if(env.CREATORS_API_ENABLED!=='true')return disabled();
 try{
  const url=new URL(request.url);const allowed=['surface','marketplace','asin'];
  if([...url.searchParams.keys()].some(k=>!allowed.includes(k))||allowed.some(k=>url.searchParams.getAll(k).length!==1))return disabled();
  const surface=url.searchParams.get('surface'),marketplace=url.searchParams.get('marketplace'),asin=url.searchParams.get('asin');
  if(!['web','mobile'].includes(surface)||!MARKETPLACES[marketplace]||!ASIN.test(asin??''))return disabled();
  if(env[surface==='web'?'CREATORS_WEB_CONTENT_APPROVED':'CREATORS_MOBILE_CONTENT_APPROVED']!=='true')return disabled();
  const tag=env[(surface==='web'?'CREATORS_WEB_TAG_':'CREATORS_MOBILE_TAG_')+marketplace];
  if(!tag||!env.CREATORS_CREDENTIAL_ID||!env.CREATORS_CREDENTIAL_SECRET)return disabled();
  const feedURL=new URL('/catalogue/v1.json',request.url);
  const feed=validateCatalogue(await boundedJSON(await env.ASSETS.fetch(new Request(feedURL)),256000));
  if(surface==='web'&&!feed.webLinksEnabled)return disabled();
  const destination=feed.products.filter(p=>p.publicationStatus==='published').flatMap(p=>p.variants.filter(v=>v.publicationStatus==='published')).flatMap(v=>surface==='web'?[v.destinations.web]:v.destinations.mobile.filter(d=>d.marketplace===marketplace)).find(d=>d?.enabled&&d.reviewedAt&&new URL(d.url).pathname.replace(/\/$/,'')===`/dp/${asin}`&&new URL(d.url).hostname===MARKETPLACES[marketplace]&&new URL(d.url).searchParams.get('tag')===tag);
  if(!destination)return disabled();
  const client=clientFactory({credentialID:env.CREATORS_CREDENTIAL_ID,credentialSecret:env.CREATORS_CREDENTIAL_SECRET,credentialVersion:env.CREATORS_CREDENTIAL_VERSION,fetcher});
  const content=await client.getItems({asins:[asin],marketplace,partnerTag:tag});
  return new Response(JSON.stringify({...content,surface}),{headers});
 }catch{return disabled();}
}
