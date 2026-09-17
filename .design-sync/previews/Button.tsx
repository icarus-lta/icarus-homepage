import type { ReactNode } from 'react';
import { Button } from '@icarus-lta/design-system';

/** The system is dark-only, so every card sits on the page's own background. */
const Dark = ({ children }: { children: ReactNode }) => (
  <div className="bg-space-950 rounded-xl p-10">{children}</div>
);

/** The three fills, side by side. */
export const Variants = () => (
  <Dark>
    <div className="flex flex-wrap items-center gap-4">
      <Button href="#company-profile">Company Profile (PDF)</Button>
      <Button variant="secondary" href="mailto:contact@icarus-airship.com">
        Contact
      </Button>
      <Button variant="ghost" onClick={() => {}}>
        Download deck
      </Button>
    </div>
  </Dark>
);

/** Small pills are for the header and dense rows. */
export const Sizes = () => (
  <Dark>
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" href="/contact">
        Get in touch
      </Button>
      <Button size="sm" variant="secondary" href="/career">
        Careers
      </Button>
    </div>
  </Dark>
);
