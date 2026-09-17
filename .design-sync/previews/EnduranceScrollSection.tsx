import { EnduranceScrollSection } from '@icarus-lta/design-system';

/** Daytime: the arrays are charging the pack. */
export const FrameCharging = () => <EnduranceScrollSection progress={0.3} />;

/** Night: the airship is flying on stored energy. */
export const FrameOnBattery = () => <EnduranceScrollSection progress={0.5} />;

/** End of the scroll: the ladder reaches five years and beyond. */
export const FrameFiveYears = () => <EnduranceScrollSection progress={1} />;
