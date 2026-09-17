import { PageHero, images } from '@icarus-lta/design-system';

/** Subpage header with the page name as the label. */
export const TechnologyPage = () => (
  <PageHero
    id="technology"
    eyebrow="TECHNOLOGY"
    title="The systems that keep an airship at 20 km"
    description="Envelope materials, energy, autonomy and payload - the four problems we work on."
  />
);

/** With a photograph behind the band. */
export const WithPhotograph = () => (
  <PageHero
    id="info"
    eyebrow="INFO"
    title="Who we are"
    description="ICARUS LTA develops uncrewed stratospheric airships in Gwangju, Republic of Korea."
    backgroundImage={images.heroStratosphere}
  />
);
