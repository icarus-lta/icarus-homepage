# Flight-control simulation

- Source: user-supplied `Airship_Station_Keeping_v20.gif`, 2026-09-26. Replaces v19 in both the video and poster assets.
- Full animation: 1440 × 810, 30 seconds, 20 fps, 600 frames.
- Web assets: `about-control.mp4` (H.264, fast start) and `about-control-poster.webp`. Their component URLs use `?v=20` to refresh previously cached media.
- The source labels its data **ILLUSTRATIVE**. The About caption and accessible description identify it as a simulation.
- The full dashboard stays visible. Its display size and muted color treatment are controlled by `design-system/src/about.css`.

Regenerate from the original GIF (requires ffmpeg):

```sh
node design-system/scripts/prepare-control-media.mjs /path/to/Airship_Station_Keeping_v20.gif
```
