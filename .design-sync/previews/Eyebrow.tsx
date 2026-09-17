import type { ReactNode } from 'react';
import { Eyebrow } from '@icarus-lta/design-system';

const Dark = ({ children }: { children: ReactNode }) => (
  <div className="bg-space-950 rounded-xl p-10">{children}</div>
);

/** Section markers used across the page. */
export const SectionLabels = () => (
  <Dark>
    <div className="space-y-6">
      <Eyebrow>WHY 20 KM</Eyebrow>
      <Eyebrow>CORE TECHNOLOGY</Eyebrow>
      <Eyebrow>ROADMAP</Eyebrow>
    </div>
  </Dark>
);

/** Data-style label with figures. */
export const WithFigures = () => (
  <Dark>
    <Eyebrow>ALTITUDE 20,000 M · STATION-KEEPING</Eyebrow>
  </Dark>
);
