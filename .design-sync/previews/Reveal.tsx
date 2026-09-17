import type { ReactNode } from 'react';
import { Reveal, SectionHeading } from '@icarus-lta/design-system';

const Dark = ({ children }: { children: ReactNode }) => (
  <div className="bg-space-950 rounded-xl p-12">{children}</div>
);

/** What a revealed block looks like once it has scrolled into view. */
export const Revealed = () => (
  <Dark>
    <Reveal shown>
      <SectionHeading eyebrow="ROADMAP" title="From test flights to service" />
    </Reveal>
  </Dark>
);

/** Stagger a row by giving each child a larger delay (0 / 100 / 200 ms). */
export const StaggeredRow = () => (
  <Dark>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Airframe', 'Autonomy', 'Payload'].map((title, i) => (
        <Reveal key={title} shown delay={i * 100}>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="font-mono text-xs tracking-[0.16em] text-ice">0{i + 1}</div>
            <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
          </div>
        </Reveal>
      ))}
    </div>
  </Dark>
);
