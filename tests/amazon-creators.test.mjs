import test from 'node:test';
import assert from 'node:assert/strict';
import {CreatorsAPIClient,normalizeCreatorsItems,serveOptionalCreatorsContent} from '../src/amazon-creators.mjs';
const asin='B000000001',tag='example-21';
const row={asin,parentASIN:'B000000002',title:'untrusted',itemInfo:{title:{displayValue:'Synthetic test item'}},images:{primary:{medium:{url:'https://m.media-amazon.com/images/I/synthetic.jpg',width:160,height:100}}},detailPageURL:`https://www.amazon.co.uk/dp/${asin}?tag=${tag}`,variationAttributes:[{name:'colour',value:'blue'}],offersV2:{price:123}};
const json=value=>new Response(JSON.stringify(value),{headers:{'Content-Type':'application/json'}});
test('disabled or unapproved optional API never reads secrets, queries Amazon or affects curated output',async()=>{
 let calls=0;const response=await serveOptionalCreatorsContent(new Request('https://padelwrist.com/catalogue/amazon/v1.json?surface=web&marketplace=GB&asin='+asin),{get CREATORS_CREDENTIAL_SECRET(){throw Error('must not read');}},{fetcher:async()=>{calls++;throw Error('must not fetch');}});
 assert.equal(response.status,503);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(calls,0);assert.deepEqual(await response.json(),{status:'unavailable',items:[]});
});
test('official metadata is transient, exact-ASIN, bounded and excludes offers/credentials',()=>{
 const now=new Date('2026-11-01T00:00:00Z');const value=normalizeCreatorsItems({itemsResult:{items:[row]}},{marketplace:'GB',partnerTag:tag,allowedASINs:[asin],now});
 assert.equal(value.items[0].parentASIN,'B000000002');assert.equal(value.items[0].attributes[0].value,'blue');assert.equal(value.items[0].image.width,160);assert.equal(Date.parse(value.expiresAt)-Date.parse(value.fetchedAt),3600000);
 assert.doesNotMatch(JSON.stringify(value),/offersV2|price|secret|credential/);
 const invalid=structuredClone(row);invalid.images.primary.medium.url='https://evil.test/secret.jpg';assert.equal(normalizeCreatorsItems({itemsResult:{items:[invalid]}},{marketplace:'GB',partnerTag:tag,allowedASINs:[asin]}).items[0].image,null);
 assert.equal(normalizeCreatorsItems({itemsResult:{items:[row]}},{marketplace:'GB',partnerTag:tag,allowedASINs:['B000000099']}).items.length,0);
});
test('Creators API OAuth uses server credentials only and GetItems/GetVariations whitelist resources',async()=>{
 const requests=[];const client=new CreatorsAPIClient({credentialID:'synthetic-id',credentialSecret:'synthetic-secret',credentialVersion:'3.2',fetcher:async(url,options)=>{requests.push({url,options});if(url.includes('/auth/'))return json({access_token:'synthetic-token',expires_in:3600});if(url.endsWith('getItems'))return json({itemsResult:{items:[row]}});return json({variationsResult:{items:[row],variationSummary:{pageCount:2}}});}});
 assert.equal((await client.getItems({asins:[asin],marketplace:'GB',partnerTag:tag})).items.length,1);
 assert.equal((await client.getVariations({asin,marketplace:'GB',partnerTag:tag})).pageCount,2);
 assert.equal(requests[0].url,'https://api.amazon.co.uk/auth/o2/token');assert.equal(requests.length,3);
 const payload=JSON.parse(requests[1].options.body);assert.equal(payload.resources.includes('offersV2.listings.price'),false);assert.equal(payload.itemIds[0],asin);assert.equal(requests[1].options.redirect,'error');
});
test('public endpoint cannot use intake/research records as an API lookup service',async()=>{
 let touched=false;const response=await serveOptionalCreatorsContent(new Request('https://padelwrist.com/catalogue/amazon/v1.json?surface=web&marketplace=GB&asin='+asin),{CREATORS_API_ENABLED:'true',CREATORS_WEB_CONTENT_APPROVED:'true',CREATORS_CREDENTIAL_ID:'synthetic',CREATORS_CREDENTIAL_SECRET:'synthetic',CREATORS_WEB_TAG_GB:tag,ASSETS:{fetch:async()=>json({})}},{clientFactory:()=>{touched=true;throw Error('must not construct');}});
 assert.equal(response.status,503);assert.equal(touched,false);
});
