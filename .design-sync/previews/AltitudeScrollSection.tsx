import { AltitudeScrollSection } from '@icarus-lta/design-system';

/** Start of the scroll: satellites and ground stations only. */
export const FrameStart = () => <AltitudeScrollSection progress={0.05} />;

/** Mid-scroll: the airship is flying into the middle layer. */
export const FrameArriving = () => <AltitudeScrollSection progress={0.45} />;

/** End of the scroll: on station, coverage spanning the gap down to the ground. */
export const FrameOnStation = () => <AltitudeScrollSection progress={1} />;
