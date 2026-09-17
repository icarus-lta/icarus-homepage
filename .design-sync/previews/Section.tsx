import { Button, Section, SectionHeading } from '@icarus-lta/design-system';

/** A new section built from Section + SectionHeading + Tailwind layout classes. */
export const RaisedBand = () => (
  <Section id="partners" tone="raised">
    <SectionHeading
      eyebrow="PARTNERS"
      title="Built with research institutes and operators"
      description="Envelope materials, flight control and payload integration are developed with partners in Korea."
    />
    <div className="mt-10">
      <Button variant="secondary" href="/contact">
        Partner with us
      </Button>
    </div>
  </Section>
);

/** The starry navy band used for closing sections. */
export const NavyWithStars = () => (
  <Section id="vision" tone="navy" stars>
    <SectionHeading align="center" eyebrow="VISION" title="Infrastructure that stays above the weather" />
  </Section>
);
