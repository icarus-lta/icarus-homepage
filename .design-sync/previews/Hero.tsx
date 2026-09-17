import { Hero } from '@icarus-lta/design-system';

/** The homepage opening: headline set into the sky beside the limb. Ships one size taller. */
export const Homepage = () => <Hero imageHeight="medium" />;

/** Without a photograph: the CSS-drawn Earth limb takes over. */
export const DrawnHorizon = () => <Hero backgroundImage={null} imageHeight="medium" />;

/** Shorter band and different copy, for a campaign or product page. */
export const ShortBand = () => (
  <Hero
    id="platform-hero"
    imageHeight="short"
    titleLines={['A Platform That', 'Stays On Station']}
    primaryLabel="See the technology"
    primaryHref="/technology"
    secondaryLabel={null}
  />
);
