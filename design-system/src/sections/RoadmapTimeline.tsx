import type * as React from 'react';
import type { ReactNode } from 'react';
import { Reveal } from '../primitives/Reveal';
import { Section } from '../primitives/Section';
import { SectionHeading } from '../primitives/SectionHeading';
import { cx } from '../utils';

export interface RoadmapTimelineProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Phases in order; mark the one under way with `current`. */
  phases?: Array<{ phase: string; title: string; note?: string; current?: boolean }>;
  /** Section background. */
  tone?: 'base' | 'raised' | 'deep' | 'navy';
}

const DEFAULT_PHASES = [
  { phase: 'PHASE 01', title: 'Autonomous flight control testing', note: 'In progress', current: true },
  { phase: 'PHASE 02', title: 'Mission scenario field trials' },
  { phase: 'PHASE 03', title: 'Commercial service' },
];

/** Horizontal development timeline: a hairline track with a node per phase, the current one lit in ice. */
export function RoadmapTimeline({
  id = 'roadmap',
  eyebrow = 'ROADMAP',
  title = 'From test flights to service',
  description,
  phases = DEFAULT_PHASES,
  tone = 'base',
}: RoadmapTimelineProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-16">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[7px] h-px bg-white/10" />
          <div
            className="relative grid grid-cols-1 md:grid-cols-[repeat(var(--ds-phases),minmax(0,1fr))] gap-10 md:gap-6"
            style={{ '--ds-phases': phases.length } as React.CSSProperties}
          >
            {phases.map((phase, i) => (
              <Reveal key={phase.phase} delay={i * 120}>
                <div>
                  <span
                    className={cx(
                      'block w-4 h-4 rounded-full border-2',
                      phase.current ? 'bg-ice border-ice' : 'bg-space-950 border-white/25',
                    )}
                  />
                  <div className="mt-6 font-mono text-xs tracking-[0.16em] text-mist-dim">
                    {phase.phase}
                    {phase.note ? <span className="text-ice"> — {phase.note}</span> : null}
                  </div>
                  <h3 className={cx('mt-3 text-lg font-semibold', phase.current ? 'text-white' : 'text-mist')}>
                    {phase.title}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
