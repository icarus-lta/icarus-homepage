import { StatBar } from '@icarus-lta/design-system';

/** The figures that sit under the hero. */
export const Default = () => <StatBar />;

/** Any three figures work - here, programme milestones. */
export const CustomFigures = () => (
  <StatBar
    items={[
      { value: '130,000', unit: 'ft', label: 'Highest test altitude' },
      { value: '5', unit: 'years+', label: 'Target endurance' },
      { value: '200', unit: 'km', label: 'Coverage per airship' },
    ]}
  />
);
