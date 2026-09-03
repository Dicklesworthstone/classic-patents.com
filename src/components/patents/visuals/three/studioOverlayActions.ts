import { Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { createElement, Fragment, type ReactNode } from "react";
import type { StudioOverlayAction } from "./StudioOverlayActionToolbar";

const STANDARD_CUTAWAY_CLASS =
  "min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm text-xs font-sans flex items-center gap-1";
const STANDARD_OVERLAY_CLASS =
  "min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const STANDARD_IDLE_CLASS =
  "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100";
const STANDARD_ACTIVE_CLASS =
  "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30";
const STANDARD_ICON_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";
const STANDARD_RESET_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";

export type StandardStudioOverlayActionOptions = {
  readonly isCutaway: boolean;
  readonly onToggleCutaway: () => void;
  readonly cutawayTitle: string;
  readonly isAudioMuted: boolean;
  readonly onToggleSound: () => void;
  readonly showUiOverlay: boolean;
  readonly onToggleUiOverlay: () => void;
  readonly overlayTitle: string;
  readonly onResetCamera: () => void;
};

function fragment(...children: ReactNode[]): ReactNode {
  return createElement(Fragment, null, ...children);
}

/**
 * Builds the standard studio shell actions as data. It intentionally owns no
 * React state: each patent visual retains its own camera, audio, and HUD
 * callbacks while the shared toolbar renders the common controls.
 */
export function createStandardStudioOverlayActions({
  isCutaway,
  onToggleCutaway,
  cutawayTitle,
  isAudioMuted,
  onToggleSound,
  showUiOverlay,
  onToggleUiOverlay,
  overlayTitle,
  onResetCamera,
}: StandardStudioOverlayActionOptions): readonly StudioOverlayAction[] {
  const soundTitle = isAudioMuted ? "Unmute Sound" : "Mute Sound";

  return [
    {
      id: "cutaway",
      ariaLabel: cutawayTitle,
      title: cutawayTitle,
      onClick: onToggleCutaway,
      className: `${STANDARD_CUTAWAY_CLASS} ${isCutaway ? STANDARD_ACTIVE_CLASS : STANDARD_IDLE_CLASS}`,
      content: fragment(
        createElement(Layers, { className: "w-4 h-4" }),
        createElement("span", { className: "hidden sm:inline" }, isCutaway ? "Cutaway" : "Solid"),
      ),
    },
    {
      id: "sound",
      ariaLabel: soundTitle,
      title: soundTitle,
      onClick: onToggleSound,
      className: STANDARD_ICON_BUTTON_CLASS,
      content: createElement(isAudioMuted ? VolumeX : Volume2, { className: "w-4 h-4" }),
    },
    {
      id: "overlay",
      ariaLabel: overlayTitle,
      title: overlayTitle,
      onClick: onToggleUiOverlay,
      className: `${STANDARD_OVERLAY_CLASS} ${showUiOverlay ? STANDARD_IDLE_CLASS : STANDARD_ACTIVE_CLASS}`,
      content: createElement(showUiOverlay ? EyeOff : Eye, { className: "w-4 h-4" }),
    },
    {
      id: "reset-camera",
      ariaLabel: "Reset camera view",
      title: "Reset Orbit Camera",
      onClick: onResetCamera,
      className: STANDARD_RESET_BUTTON_CLASS,
      content: createElement(RotateCcw, { className: "w-4 h-4" }),
    },
  ];
}

const ORBIT_ICON_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";
const ORBIT_ROTATION_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs";
const ORBIT_HUD_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs";
const ORBIT_CUTAWAY_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const ORBIT_IDLE_CLASS =
  "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100";
const ORBIT_ACTIVE_CLASS = "bg-amber-700 text-white border-amber-800 dark:bg-amber-700";
const ORBIT_ACTIVE_WITH_RING_CLASS =
  "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-700";
const ORBIT_CUTAWAY_IDLE_CLASS =
  "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100";
const ORBIT_CUTAWAY_ACTIVE_CLASS =
  "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30";
const ORBIT_RESET_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";

export type OrbitingStudioOverlayActionOptions = {
  readonly isAudioMuted: boolean;
  readonly onToggleSound: () => void;
  readonly isRotating: boolean;
  readonly onToggleRotating: () => void;
  readonly isCutaway: boolean;
  readonly onToggleCutaway: () => void;
  readonly cutawayTitle: string;
  readonly showUiOverlay: boolean;
  readonly onToggleUiOverlay: () => void;
  readonly onResetCamera: () => void;
};

/**
 * Shared presentation data for the four studios whose exhibit controls include
 * explicit auto-orbit. The individual studios still own their animation and
 * camera state; this factory merely preserves their identical control chrome.
 */
export function createOrbitingStudioOverlayActions({
  isAudioMuted,
  onToggleSound,
  isRotating,
  onToggleRotating,
  isCutaway,
  onToggleCutaway,
  cutawayTitle,
  showUiOverlay,
  onToggleUiOverlay,
  onResetCamera,
}: OrbitingStudioOverlayActionOptions): readonly StudioOverlayAction[] {
  const soundTitle = isAudioMuted ? "Unmute Sound" : "Mute Sound";
  const overlayTitle = showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry";

  return [
    {
      id: "sound",
      ariaLabel: soundTitle,
      title: soundTitle,
      onClick: onToggleSound,
      className: ORBIT_ICON_BUTTON_CLASS,
      content: createElement(isAudioMuted ? VolumeX : Volume2, {
        className: "w-3.5 h-3.5 sm:w-4 sm:h-4",
      }),
    },
    {
      id: "auto-orbit",
      ariaLabel: isRotating ? "Stop Orbit" : "Auto Orbit",
      title: isRotating ? "Stop Orbit" : "Auto Orbit",
      onClick: onToggleRotating,
      pressed: isRotating,
      className: `${ORBIT_ROTATION_BUTTON_CLASS} ${isRotating ? ORBIT_ACTIVE_CLASS : ORBIT_IDLE_CLASS}`,
      content: isRotating ? "Stop Orbit" : "Auto Orbit",
    },
    {
      id: "cutaway",
      ariaLabel: cutawayTitle,
      title: cutawayTitle,
      onClick: onToggleCutaway,
      className: `${ORBIT_CUTAWAY_BUTTON_CLASS} ${isCutaway ? ORBIT_CUTAWAY_ACTIVE_CLASS : ORBIT_CUTAWAY_IDLE_CLASS}`,
      content: createElement(Layers, { className: "w-4 h-4" }),
    },
    {
      id: "overlay",
      ariaLabel: overlayTitle,
      title: overlayTitle,
      onClick: onToggleUiOverlay,
      className: `${ORBIT_HUD_BUTTON_CLASS} ${showUiOverlay ? ORBIT_IDLE_CLASS : ORBIT_ACTIVE_WITH_RING_CLASS}`,
      content: fragment(
        createElement(showUiOverlay ? EyeOff : Eye, { className: "w-4 h-4" }),
        createElement(
          "span",
          { className: "hidden md:inline" },
          showUiOverlay ? "Hide HUD" : "Show HUD",
        ),
      ),
    },
    {
      id: "reset-camera",
      ariaLabel: "Reset camera view",
      title: "Reset Orbit Camera",
      onClick: onResetCamera,
      className: ORBIT_RESET_BUTTON_CLASS,
      content: createElement(RotateCcw, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }),
    },
  ];
}

const LAYER_TOGGLE_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const LAYER_OVERLAY_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const LAYER_IDLE_CLASS =
  "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100";
const LAYER_ACTIVE_CLASS =
  "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30";
const LAYER_CUTAWAY_ACTIVE_CLASS =
  "bg-cyan-600 text-white border-cyan-700 shadow-md ring-2 ring-cyan-500/30";

export type ExplodedLayerStudioOverlayActionOptions = {
  readonly isAudioMuted: boolean;
  readonly onToggleSound: () => void;
  readonly isCutaway: boolean;
  readonly onToggleCutaway: () => void;
  readonly cutawayTitle: string;
  readonly showUiOverlay: boolean;
  readonly onToggleUiOverlay: () => void;
  readonly onResetCamera: () => void;
};

/** Presentation data for the two exhibit stacks that expand their physical layers. */
export function createExplodedLayerStudioOverlayActions({
  isAudioMuted,
  onToggleSound,
  isCutaway,
  onToggleCutaway,
  cutawayTitle,
  showUiOverlay,
  onToggleUiOverlay,
  onResetCamera,
}: ExplodedLayerStudioOverlayActionOptions): readonly StudioOverlayAction[] {
  const soundTitle = isAudioMuted ? "Unmute Sound" : "Mute Sound";
  const overlayTitle = showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI";

  return [
    {
      id: "sound",
      ariaLabel: soundTitle,
      title: soundTitle,
      onClick: onToggleSound,
      className: ORBIT_ICON_BUTTON_CLASS,
      content: createElement(isAudioMuted ? VolumeX : Volume2, {
        className: "w-3.5 h-3.5 sm:w-4 sm:h-4",
      }),
    },
    {
      id: "cutaway",
      ariaLabel: cutawayTitle,
      title: cutawayTitle,
      onClick: onToggleCutaway,
      className: `${LAYER_TOGGLE_BUTTON_CLASS} ${isCutaway ? LAYER_CUTAWAY_ACTIVE_CLASS : LAYER_IDLE_CLASS}`,
      content: createElement(Layers, { className: "w-4 h-4" }),
    },
    {
      id: "overlay",
      ariaLabel: overlayTitle,
      title: overlayTitle,
      onClick: onToggleUiOverlay,
      className: `${LAYER_OVERLAY_BUTTON_CLASS} ${showUiOverlay ? LAYER_IDLE_CLASS : LAYER_ACTIVE_CLASS}`,
      content: createElement(showUiOverlay ? EyeOff : Eye, { className: "w-4 h-4" }),
    },
    {
      id: "reset-camera",
      ariaLabel: "Reset camera view",
      title: "Reset Orbit Camera",
      onClick: onResetCamera,
      className: STANDARD_RESET_BUTTON_CLASS,
      content: createElement(RotateCcw, { className: "w-4 h-4" }),
    },
  ];
}

const SOURCE_TOGGLE_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const SOURCE_OVERLAY_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:p-2.5 rounded-xl backdrop-blur-md border transition-colors shadow-sm";
const SOURCE_ICON_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";
const SOURCE_IDLE_CLASS =
  "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100";
const SOURCE_ACTIVE_CLASS =
  "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30";
const SOURCE_PIN_ACTIVE_CLASS = "bg-amber-600 text-white border-amber-700 shadow-md";
const SOURCE_RESET_BUTTON_CLASS =
  "min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm";

export type SourceBoundStudioOverlayActionOptions = {
  readonly isCutaway: boolean;
  readonly onToggleCutaway: () => void;
  readonly cutawayTitle: string;
  readonly showUiOverlay: boolean;
  readonly onToggleUiOverlay: () => void;
  readonly isAudioMuted: boolean;
  readonly onToggleSound: () => void;
  readonly audioAriaLabel: string;
  readonly audioTitle: string;
  readonly showCalloutPins: boolean;
  readonly onToggleCalloutPins: () => void;
  readonly onResetCamera: () => void;
};

/**
 * Presentation data for studios that expose source-figure numeral pins beside
 * their cutaway, HUD, audio, and camera controls.
 */
export function createSourceBoundStudioOverlayActions({
  isCutaway,
  onToggleCutaway,
  cutawayTitle,
  showUiOverlay,
  onToggleUiOverlay,
  isAudioMuted,
  onToggleSound,
  audioAriaLabel,
  audioTitle,
  showCalloutPins,
  onToggleCalloutPins,
  onResetCamera,
}: SourceBoundStudioOverlayActionOptions): readonly StudioOverlayAction[] {
  const overlayTitle = showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI";

  return [
    {
      id: "cutaway",
      ariaLabel: cutawayTitle,
      title: cutawayTitle,
      onClick: onToggleCutaway,
      className: `${SOURCE_TOGGLE_BUTTON_CLASS} ${isCutaway ? SOURCE_ACTIVE_CLASS : SOURCE_IDLE_CLASS}`,
      content: createElement(Layers, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }),
    },
    {
      id: "overlay",
      ariaLabel: showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI",
      title: overlayTitle,
      onClick: onToggleUiOverlay,
      className: `${SOURCE_OVERLAY_BUTTON_CLASS} ${showUiOverlay ? LAYER_IDLE_CLASS : LAYER_ACTIVE_CLASS}`,
      content: createElement(showUiOverlay ? EyeOff : Eye, {
        className: "w-3.5 h-3.5 sm:w-4 sm:h-4",
      }),
    },
    {
      id: "sound",
      ariaLabel: audioAriaLabel,
      title: audioTitle,
      onClick: onToggleSound,
      className: SOURCE_ICON_BUTTON_CLASS,
      content: createElement(isAudioMuted ? VolumeX : Volume2, {
        className: isAudioMuted
          ? "w-3.5 h-3.5 sm:w-4 sm:h-4"
          : "w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600",
      }),
    },
    {
      id: "callout-pins",
      ariaLabel: showCalloutPins ? "Hide annotation pins" : "Show annotation pins",
      title: "Toggle Historical Patent Numeral Pins",
      onClick: onToggleCalloutPins,
      className: `${SOURCE_TOGGLE_BUTTON_CLASS} ${showCalloutPins ? SOURCE_PIN_ACTIVE_CLASS : SOURCE_IDLE_CLASS}`,
      content: createElement(Zap, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }),
    },
    {
      id: "reset-camera",
      ariaLabel: "Reset camera view",
      title: "Reset Orbit Camera",
      onClick: onResetCamera,
      className: SOURCE_RESET_BUTTON_CLASS,
      content: createElement(RotateCcw, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }),
    },
  ];
}

const WIDE_CUTAWAY_BUTTON_CLASS =
  "min-h-9 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1";

export type WideStudioOverlayActionOptions = {
  readonly isCutaway: boolean;
  readonly onToggleCutaway: () => void;
  readonly cutawayTitle: string;
  readonly isAudioMuted: boolean;
  readonly onToggleSound: () => void;
  readonly showUiOverlay: boolean;
  readonly onToggleUiOverlay: () => void;
  readonly onResetCamera: () => void;
};

/** Presentation data for wide studios that can wrap their four persistent controls. */
export function createWideStudioOverlayActions({
  isCutaway,
  onToggleCutaway,
  cutawayTitle,
  isAudioMuted,
  onToggleSound,
  showUiOverlay,
  onToggleUiOverlay,
  onResetCamera,
}: WideStudioOverlayActionOptions): readonly StudioOverlayAction[] {
  const soundTitle = isAudioMuted ? "Unmute Sound" : "Mute Sound";
  const overlayTitle = showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry";

  return [
    {
      id: "cutaway",
      ariaLabel: cutawayTitle,
      title: cutawayTitle,
      onClick: onToggleCutaway,
      className: `${WIDE_CUTAWAY_BUTTON_CLASS} ${isCutaway ? ORBIT_ACTIVE_WITH_RING_CLASS : ORBIT_IDLE_CLASS}`,
      content: fragment(
        createElement(Layers, { className: "w-4 h-4" }),
        createElement("span", { className: "hidden sm:inline" }, isCutaway ? "Cutaway" : "Solid"),
      ),
    },
    {
      id: "sound",
      ariaLabel: soundTitle,
      title: soundTitle,
      onClick: onToggleSound,
      className: ORBIT_ICON_BUTTON_CLASS,
      content: createElement(isAudioMuted ? VolumeX : Volume2, {
        className: "w-3.5 h-3.5 sm:w-4 sm:h-4",
      }),
    },
    {
      id: "overlay",
      ariaLabel: overlayTitle,
      title: overlayTitle,
      onClick: onToggleUiOverlay,
      className: `${ORBIT_HUD_BUTTON_CLASS} ${showUiOverlay ? ORBIT_IDLE_CLASS : ORBIT_ACTIVE_WITH_RING_CLASS}`,
      content: fragment(
        createElement(showUiOverlay ? EyeOff : Eye, { className: "w-4 h-4" }),
        createElement(
          "span",
          { className: "hidden md:inline" },
          showUiOverlay ? "Hide HUD" : "Show HUD",
        ),
      ),
    },
    {
      id: "reset-camera",
      ariaLabel: "Reset camera view",
      title: "Reset Orbit Camera",
      onClick: onResetCamera,
      className: ORBIT_RESET_BUTTON_CLASS,
      content: createElement(RotateCcw, { className: "w-3.5 h-3.5 sm:w-4 sm:h-4" }),
    },
  ];
}
