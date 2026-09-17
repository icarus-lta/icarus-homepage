import { AltitudeScrollSection } from '@icarus-lta/design-system';

/** Start of the scroll: the satellite and the ground station talk straight to each other. */
export const FrameDirectLink = () => <AltitudeScrollSection progress={0.08} />;

/** Mid-scroll: ICARUS flies into the empty layer at 20 km. */
export const FrameAirshipArrives = () => <AltitudeScrollSection progress={0.5} />;

/** End of the scroll: laser link up to the satellite, RF link down to the ground. */
export const FrameRelayActive = () => <AltitudeScrollSection progress={1} />;
