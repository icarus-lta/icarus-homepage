import { containerClass } from '../primitives/container';
import { cx } from '../utils';

export interface StatBarProps {
  /** Figures shown across the bar. Three reads best. */
  items?: Array<{ value: string; unit?: string; label: string }>;
  /** Extra classes appended to the bar. */
  className?: string;
}

const DEFAULT_ITEMS = [
  { value: '20', unit: 'km', label: 'Operating altitude' },
  { value: '30', unit: 'days+', label: 'Continuous flight' },
  { value: '24', unit: '/7', label: 'Always on station' },
];

/**
 * Hairline-bounded band of headline figures (20 km / 30 days+ / 24/7) that sits directly
 * under the hero: large white number, ice unit, muted caption. The first figure lines up
 * with the page gutter.
 */
export function StatBar({ items = DEFAULT_ITEMS, className }: StatBarProps) {
  return (
    <div className={cx('border-y border-white/10 bg-space-900', className)}>
      <div className={cx(containerClass, 'grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10')}>
        {items.map((item, i) => (
          <div key={item.label} className={cx('py-10', i === 0 ? 'md:pr-10' : 'md:px-10')}>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">{item.value}</span>
              {item.unit ? <span className="text-xl md:text-2xl font-medium text-ice">{item.unit}</span> : null}
            </div>
            <div className="mt-3 text-sm text-mist-dim">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
