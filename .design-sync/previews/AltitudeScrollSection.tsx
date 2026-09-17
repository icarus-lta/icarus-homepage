import { AltitudeScrollSection } from '@icarus-lta/design-system';

/** Frame 1 — orbit only: Tbps runs between the satellites and never comes down. */
export const FrameOrbitOnly = () => <AltitudeScrollSection progress={0.12} />;

/** Frame 2 — a direct drop to the ground appears, thin and slow, straight through the cloud. */
export const FrameDirectDrop = () => <AltitudeScrollSection progress={0.5} />;

/** Frame 3 — ICARUS takes the empty layer at 20 km: laser up, radio down. */
export const FrameRelayActive = () => <AltitudeScrollSection progress={1} />;
