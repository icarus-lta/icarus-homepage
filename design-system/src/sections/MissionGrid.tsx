import type { ReactNode } from 'react';
import { Reveal } from '../primitives/Reveal';
import { Section } from '../primitives/Section';
import { SectionHeading } from '../primitives/SectionHeading';

export interface MissionGridProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Missions in order; four fill two rows at desktop width. */
  items?: Array<{ title: string; body: string }>;
  /** Section background. */
  tone?: 'base' | 'raised' | 'deep' | 'navy';
}

const DEFAULT_ITEMS = [
  { title: 'Maritime connectivity', body: 'Coverage for islands, coastal waters and vessels far past the last tower.' },
  { title: 'Disaster response', body: 'An airborne base station on station within hours when ground networks fail.' },
  { title: 'Wide-area observation', body: 'Persistent monitoring for environment, maritime safety and security.' },
  { title: 'Direct non-terrestrial links', body: 'NTN relay to devices without building new ground infrastructure.' },
];

/** Grid of mission profiles - each a hairline-topped block with a title and one line of detail. */
export function MissionGrid({
  id = 'missions',
  eyebrow = 'MISSIONS',
  title = 'One airship, many missions',
  description,
  items = DEFAULT_ITEMS,
  tone = 'raised',
}: MissionGridProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 100}>
            <div className="border-t border-ice/40 pt-6">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-mist leading-relaxed max-w-md">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
