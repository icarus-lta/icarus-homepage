import { TechCards } from '@icarus-lta/design-system';

/** The three core systems. */
export const Default = () => <TechCards />;

/** Any set of cards works; here, what a payload page might show. */
export const PayloadOptions = () => (
  <TechCards
    id="payloads"
    eyebrow="PAYLOADS"
    title="What the airship can carry"
    tone="raised"
    items={[
      { index: '01', label: 'RELAY', title: 'Communication relay', body: 'Backhaul for areas with no ground network.' },
      { index: '02', label: 'SENSING', title: 'Optical sensing', body: 'Persistent wide-area imaging from 20 km.' },
      { index: '03', label: 'CUSTOM', title: 'Customer payloads', body: 'Mass and power budgets shared with partners.' },
    ]}
  />
);
