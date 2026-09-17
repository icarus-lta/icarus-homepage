import { cx } from '../utils';

export interface EarthLimbProps {
  /** Swap the CSS-drawn planet for a real photograph (stratospheric horizon shot). */
  imageSrc?: string | null;
  /** How far down the frame the horizon sits, as a CSS length or percentage. Lower values raise the planet. */
  horizon?: string;
  /** Darkening over the scene so text stays readable. 0 = none, 1 = heavy. */
  scrim?: number;
  /** Extra classes appended to the layer. */
  className?: string;
}

/**
 * Full-bleed background of Earth seen from 20 km: black space, stars, the planet's dark
 * disc and its lit atmospheric rim. Drawn entirely in CSS; pass `imageSrc` to use a real
 * photograph instead. Sits behind hero content - it is decorative and aria-hidden.
 */
export function EarthLimb({ imageSrc, horizon = '72%', scrim = 0.55, className }: EarthLimbProps) {
  return (
    <div className={cx('absolute inset-0 overflow-hidden bg-space-950', className)} aria-hidden="true">
      {imageSrc ? (
        <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-space-950 via-space-950 to-space-900" />
          <div className="ds-stars absolute inset-0 opacity-70 animate-twinkle" />
          <div
            className="ds-atmo absolute left-0 right-0 h-64 pointer-events-none"
            style={{ top: `calc(${horizon} - 16rem)` }}
          />
          <div
            className="ds-earth absolute left-1/2 -translate-x-1/2 w-[260vw] h-[260vw] max-w-none"
            style={{ top: horizon }}
          />
        </>
      )}
      <div
        className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-space-950/60"
        style={{ opacity: scrim }}
      />
    </div>
  );
}
