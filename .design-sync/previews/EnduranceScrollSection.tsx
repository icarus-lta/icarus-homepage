import { EnduranceScrollSection } from '@icarus-lta/design-system';

/** Scene 1 — the airframe in three-quarter cutaway, its five parts named in turn. */
export const SceneAnatomy = () => <EnduranceScrollSection progress={0.3} />;

/** The bridge — the labels go and the same airframe turns to plan view, nose north. */
export const SceneTurning = () => <EnduranceScrollSection progress={0.55} />;

/** Scene 2 — the peninsula draws and the six 100km footprints expand in turn. */
export const SceneCoverage = () => <EnduranceScrollSection progress={0.78} />;

/** The close — all six footprints fill and the original airframe occupies the middle-left station. */
export const SceneFleet = () => <EnduranceScrollSection progress={1} />;
