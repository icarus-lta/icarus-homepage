import { Hero, SiteHeader } from '@icarus-lta/design-system';

/** The live setup: the bar floats over the top of the hero photograph. */
export const OverHero = () => (
  <div>
    <SiteHeader />
    <Hero imageHeight="short" primaryLabel={null} secondaryLabel={null} />
  </div>
);

/** In-flow bar for subpages, with the CTA pill hidden. */
export const InFlow = () => (
  <div className="bg-space-950 pb-16">
    <SiteHeader
      position="static"
      ctaLabel={null}
      links={[
        { label: 'Info', href: '/info' },
        { label: 'Technology', href: '/technology' },
        { label: 'Career', href: '/career' },
        { label: 'Contact', href: '/contact' },
      ]}
    />
  </div>
);
