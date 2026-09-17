import type { ReactNode } from 'react';
import { Reveal } from '../primitives/Reveal';
import { Section } from '../primitives/Section';
import { SectionHeading } from '../primitives/SectionHeading';

export interface TechCardsProps {
  /** Anchor id. */
  id?: string;
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** Cards in order; three fit the row at desktop width. */
  items?: Array<{ index?: string; label: string; title: string; body: string }>;
  /** Section background. */
  tone?: 'base' | 'raised' | 'deep' | 'navy';
}

const DEFAULT_ITEMS = [
  {
    index: '01',
    label: 'AIRFRAME',
    title: 'Stratospheric airframe',
    body: 'An ultra-light, high-strength envelope built for months of station-keeping at 20 km.',
  },
  {
    index: '02',
    label: 'AUTONOMY',
    title: 'Autonomy & digital twin',
    body: 'Uncrewed operation and ground control, validated in simulation before every flight.',
  },
  {
    index: '03',
    label: 'PAYLOAD',
    title: 'Communication payload',
    body: 'A non-terrestrial relay that covers ground no tower or satellite serves well.',
  },
];

/** Three-card row of the core technologies, each with a mono index, label, title and body. */
export function TechCards({
  id = 'technology',
  eyebrow = 'CORE TECHNOLOGY',
  title = 'Three systems, one platform',
  description,
  items = DEFAULT_ITEMS,
  tone = 'base',
}: TechCardsProps) {
  return (
    <Section id={id} tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 100}>
            <article className="h-full rounded-2xl border border-white/10 bg-white/5 p-8 transition-colors duration-500 hover:border-ice/40">
              <div className="flex items-baseline gap-3 font-mono text-xs tracking-[0.16em] text-mist-dim">
                {item.index ? <span className="text-ice">{item.index}</span> : null}
                <span>{item.label}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm text-mist leading-relaxed">{item.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
