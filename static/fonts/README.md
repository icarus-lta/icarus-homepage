# Fonts for the local preview

The preview serves these fonts from the PC, so a delayed external stylesheet cannot block page startup. The component library's stylesheet stays portable; `build-preview.mjs` substitutes these local font faces only in the preview output.

- Pretendard Variable 1.3.9: https://github.com/orioncactus/pretendard/tree/v1.3.9
  - Downloaded from https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2
  - License: `Pretendard-OFL.txt`
- IBM Plex Mono Regular and Medium: Google Fonts CSS response for `IBM Plex Mono` weights 400 and 500, retrieved 2026-09-19.
  - https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n5ig.ttf
  - https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJ8lc.ttf
  - License: `IBMPlexMono-OFL.txt`, from https://github.com/google/fonts/tree/main/ofl/ibmplexmono
