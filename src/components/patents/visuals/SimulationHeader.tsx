"use client";

import { RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

type SimulationHeaderAction = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
};

type SimulationHeaderProps = {
  icon?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  playbackAction?: SimulationHeaderAction;
  audioAction: SimulationHeaderAction;
  onReset: () => void;
  /** Keep a gap beneath standalone headers; flex-column simulators already supply one. */
  withBottomMargin?: boolean;
  /** Some legacy headers intentionally set their description flush to the title. */
  descriptionHasTopMargin?: boolean;
  /** Preserve the established control order where audio precedes playback. */
  actionOrder?: "playback-audio" | "audio-playback";
};

/**
 * The common semantic header for the SVG mechanism simulators.
 *
 * Keeping the three global actions in one component prevents superficially
 * identical headers from drifting in keyboard names, icon states, or theme
 * treatment while each simulator retains ownership of its physical state.
 */
export function SimulationHeader({
  icon,
  title,
  description,
  playbackAction,
  audioAction,
  onReset,
  withBottomMargin = true,
  descriptionHasTopMargin = true,
  actionOrder = "playback-audio",
}: SimulationHeaderProps) {
  const playbackButton = playbackAction ? (
    <button
      type="button"
      onClick={playbackAction.onPress}
      aria-label={playbackAction.label}
      title={playbackAction.label}
      className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
    >
      {playbackAction.icon}
    </button>
  ) : null;
  const audioButton = (
    <button
      type="button"
      onClick={audioAction.onPress}
      aria-label={audioAction.label}
      title={audioAction.label}
      className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
    >
      {audioAction.icon}
    </button>
  );

  return (
    <div
      className={`flex flex-col items-start justify-between gap-3 border-parchment-200 border-b pb-3 sm:flex-row sm:items-center dark:border-ink-800${
        withBottomMargin ? " mb-4" : ""
      }`}
    >
      <div>
        {icon ? (
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              {title}
            </h3>
          </div>
        ) : (
          <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
            {title}
          </h3>
        )}
        <p
          className={`${descriptionHasTopMargin ? "mt-0.5 " : ""}font-sans text-xs text-ink-500 dark:text-ink-400`}
        >
          {description}
        </p>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {actionOrder === "audio-playback" ? (
          <>
            {audioButton}
            {playbackButton}
          </>
        ) : (
          <>
            {playbackButton}
            {audioButton}
          </>
        )}
        <button
          type="button"
          onClick={onReset}
          aria-label="Reset Simulation"
          title="Reset Simulation"
          className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
