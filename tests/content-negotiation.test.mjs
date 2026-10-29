import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { negotiate } from '../src/content-negotiation.mjs';

const SITE = 'https://padelwrist.com';
function setup({ missingMarkdown = false } = {}) {
  const calls = [];
  const assets = {
    async fetch(request) {
      const req = typeof request === 'string' ? new Request(request) : request;
      const path = new URL(req.url).pathname;
      calls.push({ path, method: req.method, accept: req.headers.get('Accept') });
      if (path === '/not-found/' || path === '/not-found.md') {
        return new Response('Not found', { status: 404 });
      }
      if (path === '/clubs.md' || path === '/index.md') {
        if (missingMarkdown) return new Response('Not found', { status: 404 });
        return new Response(req.method === 'HEAD' ? null : '# PadelWrist club page', {
          status: 200,
          headers: { 'Content-Type': 'text/plain', ETag: '"markdown"', 'Cache-Control': 'public, max-age=0, must-revalidate' }
        });
      }
      if (path === '/clubs/' || path === '/') {
        return new Response(req.method === 'HEAD' ? null : '<html><body>PadelWrist clubs</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8', ETag: '"html"', Vary: 'Origin', 'Cache-Control': 'public, max-age=0, must-revalidate' }
        });
      }
      if (path === '/assets/site.css') {
        return new Response('body{}', { headers: { 'Content-Type': 'text/css' } });
      }
      if (path === '/clubs') return Response.redirect(SITE + '/clubs/', 307);
      return new Response('Not found', { status: 404 });
    }
  };
  return { calls, env: { ASSETS: assets } };
}
async function request(path, accept, options = {}) {
  const { calls, env } = setup(options);
  const headers = accept === undefined ? {} : { Accept: accept };
  const response = await worker.fetch(new Request(SITE + path, { headers, method: options.method ?? 'GET' }), env);
  return { response, calls };
}
const markdownTypes = ['text/markdown', 'text/markdown, text/html', 'text/markdown;q=0.8, text/html;q=0.5'];

test('negotiation respects q-values, explicit specificity and wildcards', () => {
  assert.equal(negotiate('text/markdown').format, 'markdown');
  assert.equal(negotiate('text/markdown, text/html').format, 'markdown');
  assert.equal(negotiate('text/html, text/markdown;q=0.5').format, 'html');
  assert.equal(negotiate('text/html;q=0.4, text/markdown;q=0.8').format, 'markdown');
  assert.equal(negotiate('*/*').format, 'html');
  assert.equal(negotiate('text/*').format, 'html');
  assert.equal(negotiate(undefined).format, 'html');
  assert.equal(negotiate('text/html;q=0, text/markdown;q=0').format, 'unacceptable');
  assert.equal(negotiate('application/json').format, 'unacceptable');
  assert.equal(negotiate('text/markdown;q=0, */*;q=1').format, 'html');
  assert.equal(negotiate('text/markdown;q=0.5, text/*;q=1').format, 'html');
  assert.equal(negotiate('text/html;q=0, text/markdown;q=1').format, 'markdown');
  assert.equal(negotiate('text/html;q=0.8, text/markdown;q=bogus').format, 'html');
  assert.equal(negotiate('text/html;q=0, */*;q=0').format, 'unacceptable');
});

for (const accept of markdownTypes) {
  test('Markdown request ' + accept + ' gets equivalent Markdown', async () => {
    const { response, calls } = await request('/clubs/?ref=organic', accept);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
    assert.equal(response.headers.get('x-robots-tag'), 'noindex, follow');
    assert.equal(response.headers.get('vary'), 'Accept');
    assert.equal(response.headers.get('etag'), '"markdown"');
    assert.equal(response.headers.get('link'), '</clubs/>; rel="alternate"; type="text/html"');
    assert.match(await response.text(), /^# PadelWrist/);
    assert.deepEqual(calls.map(x => x.path), ['/clubs.md']);
  });
}
test('HTML request retains HTML, Vary and cache headers', async () => {
  const { response, calls } = await request('/clubs/', 'text/html, text/markdown;q=0.5');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(response.headers.get('x-robots-tag'), null);
  assert.equal(response.headers.get('vary'), 'Origin, Accept');
  assert.equal(response.headers.get('etag'), '"html"');
  assert.equal(response.headers.get('link'), '</clubs.md>; rel="alternate"; type="text/markdown"');
  assert.deepEqual(calls.map(x => x.path), ['/clubs/']);
});
test('Home page negotiates /index.md', async () => {
  const { response, calls } = await request('/', 'text/markdown');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('link'), '</>; rel="alternate"; type="text/html"');
  assert.deepEqual(calls.map(x => x.path), ['/index.md']);
});
test('Explicit Markdown URL remains Markdown regardless of Accept', async () => {
  const { response } = await request('/clubs.md', 'text/html');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('link'), '</clubs/>; rel="alternate"; type="text/html"');
});
test('Neither representation acceptable returns 406', async () => {
  const { response } = await request('/clubs/', 'application/json');
  assert.equal(response.status, 406);
  assert.equal(response.headers.get('vary'), 'Accept');
});
test('Missing Markdown can fall back to HTML only when HTML is acceptable', async () => {
  const { response } = await request('/clubs/', 'text/markdown;q=1,text/html;q=0.5', { missingMarkdown: true });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
});
test('Missing Markdown for Markdown-only client returns 503 not mislabelled HTML', async () => {
  const { response } = await request('/clubs/', 'text/markdown', { missingMarkdown: true });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('cache-control'), 'no-store');
});
test('Unknown pages preserve 404 rather than generating fake Markdown', async () => {
  const { response } = await request('/not-found/', 'text/markdown');
  assert.equal(response.status, 404);
});
test('Static assets pass through without rewriting', async () => {
  const { response, calls } = await request('/assets/site.css', 'text/markdown');
  assert.equal(response.headers.get('content-type'), 'text/css');
  assert.deepEqual(calls.map(x => x.path), ['/assets/site.css']);
});
test('Legacy canonical redirects remain intact', async () => {
  const { response } = await request('/clubs', 'text/markdown');
  assert.equal(response.status, 307);
  assert.equal(response.headers.get('location'), SITE + '/clubs/');
});
test('HEAD requests return headers and no body', async () => {
  const { response, calls } = await request('/clubs/', 'text/markdown', { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
  assert.equal(calls[0].method, 'HEAD');
});
