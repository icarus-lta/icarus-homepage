# ICARUS LTA homepage

The current bilingual homepage is built from the React components in
`design-system/`. It includes the main page, About, Newsroom, and Contact.

## Build and run locally

From the repository root, using Node.js and npm:

```sh
npm ci --prefix design-system
npm run build --prefix design-system
node .design-sync/build-preview.mjs
python3 .design-sync/serve-preview.py --port 8801
```

Open <http://localhost:8801/> or <http://localhost:8801/about/?lang=ko>.
Use `?lang=en` for English. After changing source files, repeat the two build
commands and reload the page. The local server disables caching, and the build
versions the CSS and JavaScript URLs.

The build uses only repository files and the locked npm dependencies. Its static
output is `.design-sync/.cache/preview/`, including local fonts and video assets.
`output/` contains optional local design studies and screenshots and is not
required to build or run the site.

## Share through Cloudflare

With the local server running and `cloudflared` installed:

```sh
cloudflared tunnel --url http://127.0.0.1:8801
```

Open the HTTPS `trycloudflare.com` address printed by the command. It serves the
same build as localhost; rebuilding updates both. This is a temporary review
URL: the server and tunnel must remain running, and restarting the tunnel can
change the address.

For a separate static deployment, serve `.design-sync/.cache/preview/` as the
website root. The build command is:

```sh
npm ci --prefix design-system && npm run build --prefix design-system && node .design-sync/build-preview.mjs
```

The repository-root `index.html` and `partials/` are the legacy HTMX homepage.
The existing GitHub Pages configuration publishes that root from `main`; the
current React work is on `dev`.

## Content and media

- Components and styles: `design-system/src/`
- Korean and English copy: `design-system/src/i18n/`
- Source images, fonts, and About videos: `static/`
- Build and local server: `.design-sync/build-preview.mjs`, `.design-sync/serve-preview.py`
- Flight-control media provenance: `static/about/CONTROL-MEDIA.md`

The Contact form remains a design preview unless `ICARUS_CONTACT_FORM_URL` is
set to a public form endpoint when building. See `.design-sync/CONTACT-FORM.md`.
