import { MissionGrid } from '@icarus-lta/design-system';

/** The four mission profiles on the homepage. */
export const Default = () => <MissionGrid />;

/** A shorter grid for a focused page. */
export const TwoMissions = () => (
  <MissionGrid
    id="maritime"
    eyebrow="MARITIME"
    title="Coverage past the last tower"
    tone="base"
    items={[
      { title: 'Island connectivity', body: 'Service for island communities outside mobile coverage.' },
      { title: 'Vessel tracking', body: 'Continuous links and observation over coastal waters.' },
    ]}
  />
);
