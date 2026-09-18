import type * as React from 'react';
import type { ReactNode } from 'react';
import { content } from '../i18n/content';
import { useLanguage } from '../i18n/language';
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

/** Responsive dashed timeline with a gently flowing active link and concentric ripples at the current phase. */
export function RoadmapTimeline(props: RoadmapTimelineProps) {
  const { language } = useLanguage();
  const copy = content[language].roadmap;
  const {
    id = 'roadmap',
    eyebrow,
    title = copy.title,
    description,
    phases = copy.phases,
    tone = 'base',
  } = props;
  return (
    <Section id={id} tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <Reveal className="mt-16">
        <ol
          className="ds-roadmap"
          style={{ '--ds-phases': phases.length } as React.CSSProperties}
        >
          {phases.map((phase, i) => (
            <li
              key={phase.phase}
              className={cx('ds-roadmap-phase', phase.current && 'ds-roadmap-phase-current')}
              aria-current={phase.current ? 'step' : undefined}
            >
              {i < phases.length - 1 ? (
                <span className="ds-roadmap-track" aria-hidden="true" />
              ) : null}
              <span className="ds-roadmap-node" aria-hidden="true" />
              <div className="ds-roadmap-label">
                <span>{phase.phase}</span>
                {phase.note ? <span className="ds-roadmap-note">— {phase.note}</span> : null}
              </div>
              <h3 className="ds-roadmap-title">{phase.title}</h3>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
