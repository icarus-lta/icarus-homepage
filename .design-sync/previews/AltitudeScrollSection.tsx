import { AltitudeScrollSection } from '@icarus-lta/design-system';

/** 0% — Ground Station, Mbps and Network bottleneck are visible before scrolling. */
export const FrameBottleneck = () => <AltitudeScrollSection progress={0} />;

/** 50% — the airship and Gbps / x 100 bandwidth relay join the persistent ground station. */
export const FrameRelayActive = () => <AltitudeScrollSection progress={0.5} />;

/** 100% — City, Mobile, Mobility and Military join the airship through Direct to Cell links. */
export const FrameDirectToCell = () => <AltitudeScrollSection progress={1} />;
