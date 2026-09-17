import { EarthLimb, images } from '@icarus-lta/design-system';

/** The CSS-drawn horizon, used wherever no photograph is available. */
export const Drawn = () => (
  <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
    <EarthLimb />
  </div>
);

/** A higher horizon leaves more space for content above the planet. */
export const HighHorizon = () => (
  <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
    <EarthLimb horizon="55%" />
  </div>
);

/** With a photograph instead: the NASA balloon view that ships with the system. */
export const WithPhotograph = () => (
  <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
    <EarthLimb imageSrc={images.heroStratosphere} />
  </div>
);
