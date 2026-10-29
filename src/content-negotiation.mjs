/**
 * PadelWrist content negotiation.
 *
 * The HTML pages are canonical. scripts/generate-markdown.py creates equivalent
 * /index.md and /<slug>.md files from those HTML pages. Never serve different
 * product claims to bots: the only difference is representation.
 */

const PAGE = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)+$/;
const MD = /^\/(?:index|[a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;

function isHtmlPage(pathname) {
  return pathname === "/" || PAGE.test(pathname);
}

function markdownPath(pathname) {
  return pathname === "/" ? "/index.md" : pathname.slice(0, -1) + ".md";
}

function htmlPath(pathname) {
  return pathname === "/index.md" ? "/" : pathname.slice(0, -3) + "/";
}

function parseAccept(value) {
  if (!value || !value.trim()) return [{ type: "*/*", q: 1 }];
  return value.split(",").map(item => {
    const [type, ...parameters] = item.trim().toLowerCase().split(";");
    if (!/^[a-z0-9!#$&^_.+-]+\/(?:[a-z0-9!#$&^_.+-]+|\*)$/.test(type) && type !== "*/*") {
      return { type: "", q: 0 };
    }
    let q = 1;
    for (const parameter of parameters) {
      const matched = parameter.trim().match(/^q\s*=\s*(.*)$/);
      if (!matched) continue;
      const v = matched[1].trim();
      // RFC 9110: weight is 0..1, with up to three decimal places.
      q = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(v) ? Number(v) : 0;
      break;
    }
    return { type, q };
  });
}

function preference(ranges, type) {
  const major = type.split("/")[0];
  let bestSpecificity = -1, bestQ = 0;
  for (const item of ranges) {
    const specificity = item.type === type ? 2
      : item.type === major + "/*" ? 1
      : item.type === "*/*" ? 0 : -1;
    if (specificity < 0) continue;
    if (specificity > bestSpecificity) {
      bestSpecificity = specificity;
      bestQ = item.q;
    } else if (specificity === bestSpecificity) {
      bestQ = Math.max(bestQ, item.q);
    }
  }
  return bestSpecificity < 0 ? 0 : bestQ;
}

export function negotiate(accept) {
  const ranges = parseAccept(accept);
  const htmlQ = preference(ranges, "text/html");
  const markdownQ = preference(ranges, "text/markdown");
  if (htmlQ === 0 && markdownQ === 0) return { format: "unacceptable", htmlQ };
  // A wildcard-only request must not turn ordinary browsers into Markdown.
  const explicitlyMarkdown = ranges.some(x => x.type === "text/markdown" && x.q > 0);
  const format = markdownQ > htmlQ || (markdownQ === htmlQ && explicitlyMarkdown)
    ? "markdown" : "html";
  return { format, htmlQ };
}

function alternate(response, path, type) {
  // Preserve Cloudflare's original status, ETag, cache policy and response body.
  const headers = new Headers(response.headers);
  const previousVary = headers.get("Vary");
  if (!previousVary || !previousVary.split(",").some(x => x.trim().toLowerCase() === "accept")) {
    headers.set("Vary", previousVary ? previousVary + ", Accept" : "Accept");
  }
  const target = type === "markdown" ? htmlPath(path) : markdownPath(path);
  const mime = type === "markdown" ? "text/html" : "text/markdown";
  headers.set("Link", '<' + target + '>; rel="alternate"; type="' + mime + '"');
  if (type === "markdown") {
    headers.set("Content-Type", "text/markdown; charset=utf-8");
    headers.set("X-Robots-Tag", "noindex, follow");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function servePage(request, env, url) {
  const choice = negotiate(request.headers.get("Accept"));
  if (choice.format === "unacceptable") {
    const existing = await env.ASSETS.fetch(request);
    // Preserve proper redirects and the site's existing 404 handling.
    if (existing.status !== 200 && existing.status !== 304) return existing;
    return new Response("Neither HTML nor Markdown is acceptable.", {
      status: 406,
      headers: { "Content-Type": "text/plain; charset=utf-8", Vary: "Accept" }
    });
  }
  if (choice.format === "html") {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 200 && response.status !== 304) return response;
    return alternate(response, url.pathname, "html");
  }
  const markdownUrl = new URL(request.url);
  markdownUrl.pathname = markdownPath(url.pathname);
  const markdownRequest = new Request(markdownUrl, request);
  const response = await env.ASSETS.fetch(markdownRequest);
  if (response.status === 200 || response.status === 304) {
    return alternate(response, markdownUrl.pathname, "markdown");
  }
  // If an HTML page was added before its generated Markdown is deployed,
  // never label its HTML as Markdown. Fall back only if HTML is acceptable.
  const fallback = await env.ASSETS.fetch(request);
  if (fallback.status !== 200 && fallback.status !== 304) return fallback;
  if (choice.htmlQ > 0) return alternate(fallback, url.pathname, "html");
  return new Response("Markdown version temporarily unavailable.", {
    status: 503,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", Vary: "Accept", "Retry-After": "60" }
  });
}

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }
    const url = new URL(request.url);
    if (isHtmlPage(url.pathname)) return servePage(request, env, url);
    if (MD.test(url.pathname)) {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 200 || response.status === 304) {
        return alternate(response, url.pathname, "markdown");
      }
      return response;
    }
    return env.ASSETS.fetch(request);
  }
};
