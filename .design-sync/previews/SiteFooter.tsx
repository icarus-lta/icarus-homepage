import { SiteFooter } from '@icarus-lta/design-system';

export const Default = () => <SiteFooter />;

/** Trimmed for subpages: no address block, fewer links. */
export const Compact = () => (
  <SiteFooter
    address={null}
    links={[
      { label: 'Contact', href: '/contact' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com', external: true },
    ]}
  />
);
