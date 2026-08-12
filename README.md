# PADELWRIST website

Static marketing website for the PADELWRIST iOS, iPadOS and watchOS app.

## Local preview

From the project directory, run:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Cloudflare

The site uses plain HTML, CSS and JavaScript and requires no build step. Cloudflare Workers serves the repository root as static assets using `wrangler.jsonc`.

## Legacy Netlify configuration

`netlify.toml` remains in the repository from the previous Netlify deployment and is not used by Cloudflare.
