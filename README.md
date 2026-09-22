# Icarus Homepage

This repository contains a small static website for the fictional company **Icarus**. It relies on [HTMX](https://htmx.org/) to load page fragments on demand and [Tailwind CSS](https://tailwindcss.com/) from a CDN. There is no build step or tooling required.

## Structure
- `index.html` – main page that pulls in fragments with HTMX.
- `partials/layout/` – header and footer used across the site.
- `partials/sections/` – individual hero, about, product, news and contact section files.

## Running locally

The homepage currently being developed is the React design system in `design-system/`.
Build and serve it from this repository in WSL/Linux:

```bash
(cd design-system && npm run build) && node .design-sync/build-preview.mjs
python3 .design-sync/serve-preview.py --port 8801
```

Open http://localhost:8801/ or http://localhost:8801/about/?lang=ko.
Re-run the build command after source changes, then reload the browser.
The preview server disables browser caching, and each build versions its CSS/JS URLs.

The root `index.html` and `partials/` are the older static homepage. Serving the repository
root with a generic HTTP server displays that older version, not the current work.

## Deployment
To publish with GitHub Pages, enable Pages in the repository settings and choose the root of the `main` branch as the source.
