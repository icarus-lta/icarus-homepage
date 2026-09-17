import type { ReactNode } from 'react';
import { SectionHeading } from '@icarus-lta/design-system';

const Dark = ({ children }: { children: ReactNode }) => (
  <div className="bg-space-950 rounded-xl p-12">{children}</div>
);

/** Left-aligned: the default for content sections. */
export const LeftAligned = () => (
  <Dark>
    <SectionHeading
      eyebrow="CORE TECHNOLOGY"
      title={'Three systems,\none platform'}
      description="An ultra-light airframe, autonomy validated in simulation, and a communication payload built for the gap between orbit and the ground."
    />
  </Dark>
);

/** Centered: for closing statements and full-width bands. */
export const Centered = () => (
  <Dark>
    <SectionHeading
      align="center"
      eyebrow="MISSIONS"
      title="One airship, many missions"
      description="Connectivity, disaster response and observation from a single platform."
    />
  </Dark>
);
