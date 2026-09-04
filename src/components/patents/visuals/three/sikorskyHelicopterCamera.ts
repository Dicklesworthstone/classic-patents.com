import { INITIAL_SIKORSKY_STATE } from "@/physics/sikorskyHelicopterKernel";
import { sikorskyStudioAltitude } from "./sikorskyHelicopterModel";

// The full-width desktop card resolves to a 1214 × 680 px WebGL surface: its
// 4:3 layout is capped by max-h-[680px].  This closer pose was projected
// against the complete three-blade phase envelope in the default, collective-
// maximum, and Claim 1-inverted states.  It leaves room above for the view
// rail/source boundary and below for the live reader controls while making the
// VS-300's open truss and pitch-control assembly useful at overview scale.
export const SIKORSKY_DESKTOP_OVERVIEW = {
  position: [4.5, 3.8, 5.5] as [number, number, number],
  target: [-1, 2.15, -1.25] as [number, number, number],
};

export const SIKORSKY_DESKTOP_OVERVIEW_SAFE_ZONE = {
  viewportWidth: 1214,
  viewportHeight: 680,
  horizontalNdcEdge: 0.95,
  topPx: 140,
  bottomPx: 560,
  minimumAirframeWidthPx: 1080,
  minimumOpenFrameWidthPx: 250,
  minimumOpenFrameHeightPx: 270,
} as const;

export const SIKORSKY_HELICOPTER_CAMERA_VIEWS = {
  overview: SIKORSKY_DESKTOP_OVERVIEW,
  rotorHead: {
    position: [1.4, 3.7, 1.7] as [number, number, number],
    target: [0, 3.1, 0] as [number, number, number],
  },
  tailRotor: {
    position: [3.4, 3.4, -2] as [number, number, number],
    target: [0, 2.45, -4.8] as [number, number, number],
  },
  cockpit: {
    position: [1.35, 2.35, 2.1] as [number, number, number],
    target: [0, 1.9, 0.65] as [number, number, number],
  },
} as const;

export type SikorskyHelicopterCameraView = keyof typeof SIKORSKY_HELICOPTER_CAMERA_VIEWS;

// Keep the written inspection names in one place. In particular, phone UI must
// never turn "Main Hub / Swashplate" into an ambiguous clipped fragment beside
// the overlay controls.
export const SIKORSKY_HELICOPTER_VIEW_LABELS: Record<SikorskyHelicopterCameraView, string> = {
  overview: "Full Airframe",
  rotorHead: "Main Hub / Swashplate",
  tailRotor: "Anti-Torque Tail",
  cockpit: "Flight Controls",
};

const MOBILE_OVERVIEW = {
  // The phone frame has a 4:3 canvas but only 286 px of width. A slightly
  // elevated, centred view puts the three-blade envelope into its available
  // vertical field and leaves the truss, swashplate, and cockpit readable.
  position: [5.63, 6.85, 5.57] as [number, number, number],
  target: [0.18, 2.4, 0.12] as [number, number, number],
};

const TABLET_OVERVIEW = {
  // A rendered tablet card is closer to 720 px wide than the browser's 768 px
  // viewport. This extra inspection radius keeps every main-rotor blade inside
  // that narrower field while retaining a substantially closer view than phone.
  position: [6.15, 4.58, 7.56] as [number, number, number],
  target: [-0.35, 1.65, -1.3] as [number, number, number],
};

const INITIAL_STUDIO_ALTITUDE = sikorskyStudioAltitude(INITIAL_SIKORSKY_STATE.altitudeMeters);

export function sikorskyViewForViewport(
  view: SikorskyHelicopterCameraView,
  viewportWidth: number,
  altitudeMeters: number,
): { position: [number, number, number]; target: [number, number, number] } {
  const base =
    view !== "overview"
      ? SIKORSKY_HELICOPTER_CAMERA_VIEWS[view]
      : viewportWidth < 640
        ? MOBILE_OVERVIEW
        : viewportWidth < 1024
          ? TABLET_OVERVIEW
          : SIKORSKY_HELICOPTER_CAMERA_VIEWS.overview;
  const altitudeOffset = sikorskyStudioAltitude(altitudeMeters) - INITIAL_STUDIO_ALTITUDE;
  return {
    position: [base.position[0], base.position[1] + altitudeOffset, base.position[2]],
    target: [base.target[0], base.target[1] + altitudeOffset, base.target[2]],
  };
}
