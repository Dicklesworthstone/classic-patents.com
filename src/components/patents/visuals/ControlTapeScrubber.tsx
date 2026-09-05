"use client";

import {
  BookOpen,
  Circle,
  Hash,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ControlTape,
  type ControlTapeCheckpoint,
  ControlTapeRecorder,
  ControlTapeReplayer,
  computeTapeDigest,
  LAMARR_HOPPING_TEACHING_TAPE,
  validateTapeCompatibility,
  WRIGHT_FLYER_TEACHING_TAPE,
} from "@/physics/controlTape";

export interface ControlTapeScrubberProps {
  patentId: string;
  modelIdentity: string;
  currentParams: Record<string, number>;
  onApplyParams: (params: Record<string, number>) => void;
  defaultTape?: ControlTape;
  className?: string;
}

export function ControlTapeScrubber({
  patentId,
  modelIdentity,
  currentParams,
  onApplyParams,
  defaultTape,
  className = "",
}: ControlTapeScrubberProps) {
  // Determine available teaching tape
  const teachingTape =
    defaultTape ??
    (patentId === "us-821393-wright-flyer"
      ? WRIGHT_FLYER_TEACHING_TAPE
      : patentId === "us-2292387-lamarr-frequency-hopping"
        ? LAMARR_HOPPING_TEACHING_TAPE
        : undefined);

  const [activeTape, setActiveTape] = useState<ControlTape | undefined>(teachingTape);

  const initialValidation = activeTape
    ? validateTapeCompatibility(activeTape, patentId, modelIdentity)
    : { valid: true };

  const initialCheckpoint = activeTape?.checkpoints?.find((cp) => cp.tick === 0) ?? null;

  const [currentTick, setCurrentTick] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [digest, setDigest] = useState<string>(() => {
    if (!activeTape) return "host:00000000";
    if (!initialValidation.valid) return "refused";
    return (
      initialCheckpoint?.digest ??
      computeTapeDigest(activeTape.initialConditions, 0, activeTape.seed).digest
    );
  });
  const [digestKind, setDigestKind] = useState<"host" | "blake3">(
    () => initialCheckpoint?.digestKind ?? "host",
  );
  const [activeCheckpoint, setActiveCheckpoint] = useState<ControlTapeCheckpoint | null>(
    () => initialCheckpoint,
  );
  const [refusalReason, setRefusalReason] = useState<string | null>(() =>
    initialValidation.valid
      ? null
      : (initialValidation.reason ?? "Incompatible control tape refused"),
  );

  const replayerRef = useRef<ControlTapeReplayer | null>(null);
  const recorderRef = useRef<ControlTapeRecorder | null>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize or update replayer when activeTape changes
  useEffect(() => {
    if (!activeTape) {
      replayerRef.current = null;
      return;
    }
    const replayer = new ControlTapeReplayer(activeTape, patentId, modelIdentity);
    replayerRef.current = replayer;

    if (replayer.refused) {
      setRefusalReason(replayer.reason ?? "Incompatible control tape refused");
      setIsPlaying(false);
      return;
    }

    setRefusalReason(null);
    const initialResult = replayer.seekTo(0);
    setCurrentTick(initialResult.tick);
    setDigest(initialResult.digest);
    setDigestKind(initialResult.digestKind);
    setActiveCheckpoint(initialResult.activeCheckpoint);
  }, [activeTape, patentId, modelIdentity]);

  // Handle seeking to a specific tick
  const seekTo = useCallback(
    (targetTick: number) => {
      if (!replayerRef.current || replayerRef.current.refused) return;
      const res = replayerRef.current.seekTo(targetTick);
      setCurrentTick(res.tick);
      setDigest(res.digest);
      setDigestKind(res.digestKind);
      setActiveCheckpoint(res.activeCheckpoint);
      onApplyParams(res.state);
    },
    [onApplyParams],
  );

  // Replay playback loop
  useEffect(() => {
    if (!isPlaying || !activeTape || !replayerRef.current) {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = (activeTape.tickS ?? 1 / 60) * 1000;
    playIntervalRef.current = setInterval(() => {
      setCurrentTick((prev) => {
        if (!replayerRef.current) return prev;
        if (prev >= activeTape.totalTicks) {
          setIsPlaying(false);
          return activeTape.totalTicks;
        }
        const nextTick = prev + 1;
        const res = replayerRef.current.seekTo(nextTick);
        setDigest(res.digest);
        setDigestKind(res.digestKind);
        setActiveCheckpoint(res.activeCheckpoint);
        onApplyParams(res.state);
        return nextTick;
      });
    }, intervalMs);

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    };
  }, [isPlaying, activeTape, onApplyParams]);

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (isRecording) {
        // Stop recording before playback
        stopRecording();
      }
      if (currentTick >= (activeTape?.totalTicks ?? 0)) {
        seekTo(0);
      }
      setIsPlaying(true);
    }
  };

  // Recording controls
  const startRecording = () => {
    setIsPlaying(false);
    const rec = new ControlTapeRecorder(patentId, modelIdentity, currentParams);
    rec.start();
    recorderRef.current = rec;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!recorderRef.current) return;
    recorderRef.current.stop();
    const exported = recorderRef.current.exportTape(
      "Visitor Recording",
      "Interactive visitor session",
    );
    recorderRef.current = null;
    setIsRecording(false);
    setActiveTape(exported);
    setCurrentTick(0);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.code === "Space") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      seekTo(currentTick - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      seekTo(currentTick + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      seekTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      seekTo(activeTape?.totalTicks ?? 0);
    }
  };

  const totalTicks = activeTape?.totalTicks ?? 100;
  const timeSec = (currentTick * (activeTape?.tickS ?? 1 / 60)).toFixed(2);
  const totalSec = (totalTicks * (activeTape?.tickS ?? 1 / 60)).toFixed(2);

  return (
    <section
      aria-label="Simulation Control Tape & Replay Panel"
      onKeyDown={handleKeyDown}
      className={`rounded-xl border border-amber-900/20 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/70 p-4 shadow-sm space-y-3 focus-within:ring-1 focus-within:ring-amber-500/40 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-ink-900 dark:text-parchment-100">
            Replay Tape
          </span>
          {activeTape?.title && (
            <span className="rounded bg-amber-200/60 dark:bg-amber-900/40 px-1.5 py-0.5 font-mono text-[11px] text-amber-900 dark:text-amber-200 truncate max-w-[200px]">
              {activeTape.title}
            </span>
          )}
        </div>

        {/* State Digest & Provenance */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-ink-500 dark:text-ink-400">
            <Hash className="w-3 h-3 text-ink-400" />
            <span
              data-testid="state-digest-badge"
              className={`rounded px-1.5 py-0.5 ${
                digestKind === "blake3"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300"
                  : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-parchment-300"
              }`}
            >
              {digest}
            </span>
          </span>
        </div>
      </div>

      {/* Refusal Boundary Notice if Incompatible */}
      {refusalReason && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 p-2.5 text-xs text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
          <span>{refusalReason}</span>
        </div>
      )}

      {/* Scrubber Range Slider & Checkpoint Pins */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-ink-600 dark:text-ink-400">
          <span>
            Tick {currentTick} / {totalTicks}
          </span>
          <span>
            {timeSec}s / {totalSec}s
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={totalTicks}
            value={currentTick}
            onChange={(e) => seekTo(Number(e.target.value))}
            aria-label="Simulation timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={totalTicks}
            aria-valuenow={currentTick}
            aria-valuetext={`Tick ${currentTick} of ${totalTicks}`}
            disabled={Boolean(refusalReason)}
            className="w-full h-1.5 bg-parchment-300 dark:bg-ink-700 rounded-lg appearance-none cursor-pointer accent-amber-600 dark:accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        {/* Checkpoint marker buttons */}
        {activeTape?.checkpoints && activeTape.checkpoints.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {activeTape.checkpoints.map((cp) => (
              <button
                key={cp.tick}
                type="button"
                onClick={() => seekTo(cp.tick)}
                title={cp.label ?? `Checkpoint at tick ${cp.tick}`}
                aria-label={`Jump to ${cp.label ?? `tick ${cp.tick}`}`}
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                  currentTick === cp.tick
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-parchment-200 text-ink-700 hover:bg-parchment-300 border-parchment-300 dark:bg-ink-800 dark:text-parchment-300 dark:border-ink-700 dark:hover:bg-ink-700"
                }`}
              >
                t:{cp.tick}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Checkpoint Teaching Note Pill */}
      {activeCheckpoint?.teachingNote && (
        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-2.5 text-xs text-amber-950 dark:text-amber-200 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-[11px] text-amber-900 dark:text-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{activeCheckpoint.label ?? "Checkpointed Mechanism Note"}</span>
          </div>
          <p className="font-sans text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/80">
            {activeCheckpoint.teachingNote}
          </p>
        </div>
      )}

      {/* Control Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-parchment-200 dark:border-ink-800">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => seekTo(0)}
            disabled={Boolean(refusalReason)}
            aria-label="Rewind to start"
            title="Rewind to start (Home)"
            className="rounded p-1.5 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => seekTo(currentTick - 1)}
            disabled={Boolean(refusalReason) || currentTick <= 0}
            aria-label="Step backward 1 tick"
            title="Step backward (Left Arrow)"
            className="rounded p-1.5 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors disabled:opacity-40"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={Boolean(refusalReason)}
            aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="rounded bg-amber-600 text-white p-1.5 hover:bg-amber-700 transition-colors disabled:opacity-40"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => seekTo(currentTick + 1)}
            disabled={Boolean(refusalReason) || currentTick >= totalTicks}
            aria-label="Step forward 1 tick"
            title="Step forward (Right Arrow)"
            className="rounded p-1.5 text-ink-700 dark:text-parchment-300 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors disabled:opacity-40"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Record & Preset Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleRecording}
            aria-label={isRecording ? "Stop recording visitor tape" : "Record visitor control tape"}
            title={isRecording ? "Stop Recording" : "Record Control Tape"}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-sans transition-colors ${
              isRecording
                ? "bg-red-600 text-white animate-pulse"
                : "bg-parchment-200 text-ink-800 hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
            }`}
          >
            <Circle
              className={`w-3 h-3 ${isRecording ? "fill-white" : "fill-red-500 text-red-500"}`}
            />
            <span>{isRecording ? "Stop Rec" : "Record"}</span>
          </button>

          {teachingTape && (
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setIsRecording(false);
                setActiveTape(teachingTape);
                seekTo(0);
              }}
              aria-label={`Load ${teachingTape.title ?? "teaching lesson"}`}
              title="Reset to authored pedagogical teaching lesson"
              className="px-2 py-1 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:hover:bg-amber-900 text-xs font-sans border border-amber-300 dark:border-amber-800 transition-colors"
            >
              Load Lesson
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
