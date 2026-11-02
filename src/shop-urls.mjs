const fail = message=>{throw new Error(`Shop URL: ${message}`);};
const text=value=>{if(typeof value!=='string'||!value.trim()||value.length>2048||/[\u0000-\u001f<>]/.test(value))fail('invalid URL text');};
export function safeURL(value) {
  text(value);
  let url; try { url = new URL(value); } catch { fail('invalid URL'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.hash) fail('unsafe URL');
  return url;
}
