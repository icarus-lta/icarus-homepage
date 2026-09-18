import { RoadmapTimeline } from '@icarus-lta/design-system';

/** The four homepage programme phases. */
export const Default = () => <RoadmapTimeline />;

/** A four-step version for a detailed programme page. */
export const FourPhases = () => (
  <RoadmapTimeline
    id="programme"
    eyebrow="PROGRAMME"
    title="Development milestones"
    tone="raised"
    phases={[
      { phase: 'PHASE 01', title: 'Envelope material development', note: 'Done' },
      { phase: 'PHASE 02', title: 'Autonomous flight control testing', note: 'In progress', current: true },
      { phase: 'PHASE 03', title: 'Stratospheric test flight' },
      { phase: 'PHASE 04', title: 'Commercial service' },
    ]}
  />
);
