import { ContactCTA } from '@icarus-lta/design-system';

/** The closing band of the homepage. */
export const Default = () => <ContactCTA />;

/** Recruiting variant with a named action. */
export const Recruiting = () => (
  <ContactCTA
    id="join"
    title="Engineers who want to fly something new"
    description="Flight control, materials and payload roles are open."
    primaryLabel="Send us your CV"
    secondaryLabel="Open positions"
    secondaryHref="/career#positions"
  />
);
