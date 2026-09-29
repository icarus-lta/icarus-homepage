# About page footage

Supplied by the user on 2026-09-19 as `미디어1.mp4`.

- `about-flight.mp4`: full 19.017-second source sequence, 1280 × 720, 24 fps, H.264 with original AAC stereo audio. Stream-copied without re-encoding; MP4 metadata moved to the front for progressive playback.
- `about-flight-poster.jpg`: frame at 0.7 seconds.
- `about-flight-team.jpg`: frame at 16 seconds.

These show a flight on the GIST campus. The About page identifies the film as flight-test footage and does not describe it as a stratospheric flight or evidence of commercial operation.

The preview builder copies these public assets to `/media/`. The original Desktop file is unchanged.

## CFD presentation footage

`about-cfd-clean.mp4` and `about-cfd-clean-poster.webp` are the current display copy
of the supplied `about-cfd.gif` simulation (800 × 450, 15 seconds, 20 fps).
The legend and pale background streamlines are removed for a quieter presentation
on the site's `#060a10` background. Alpha-only edge cleanup preserves the colored
airship and dense wake structures. The subject is shifted 74 pixels left without
scaling, so it stays centered after the legend is removed. The source is unchanged.

To regenerate the display copy with FFmpeg installed:

```sh
node .design-sync/build-cfd-clean.mjs
./build.sh
```
