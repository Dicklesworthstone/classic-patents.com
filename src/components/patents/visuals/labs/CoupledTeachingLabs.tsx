"use client";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cog,
  Info,
  Layers,
  Link2,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  StepForward,
  Unlink2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  type CoupledLabAction,
  type CoupledLabState,
  createInitialElectricalChainState,
  createInitialMechanicalChainState,
  executeCoupledLabReplay,
  stepElectricalChainLab,
  stepMechanicalChainLab,
} from "@/physics/coupleGraph";

export interface CoupledTeachingLabsProps {
  initialLabId?: "mechanical-rotary-chain" | "electrical-power-chain";
  defaultShowTextOnlyTable?: boolean;
}

export function CoupledTeachingLabs({
  initialLabId = "mechanical-rotary-chain",
  defaultShowTextOnlyTable = false,
}: CoupledTeachingLabsProps = {}) {
  const [selectedLabId, setSelectedLabId] = useState<
    "mechanical-rotary-chain" | "electrical-power-chain"
  >(initialLabId);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showTextOnlyView, setShowTextOnlyView] = useState(defaultShowTextOnlyTable);
  const [replaySuccessMsg, setReplaySuccessMsg] = useState<string | null>(null);

  // Mechanical parameters
  const [mechParams, setMechParams] = useState({
    steamPressurePsi: 100,
    engineRpm: 65,
    cutoffPct: 25,
    totalDraftRatio: 6.0,
    rollerClampingWeightKg: 3.5,
    loopSlackPct: 65,
    stitchPitchMm: 3.5,
    clutch1Connected: true,
    clutch2Connected: true,
    injectedFault: undefined as "negative_dissipation" | "active_torque" | undefined,
  });

  // Electrical parameters
  const [elecParams, setElecParams] = useState({
    shaftRate: 1.0,
    fieldExcitation: 1.0,
    turnsRatio: 1.0,
    coreCoupling: 0.96,
    filamentLengthCm: 15.0,
    coldResistanceOhm: 15.0,
    switch1Connected: true,
    switch2Connected: true,
    injectedFault: undefined as "negative_resistance" | "spontaneous_generation" | undefined,
  });

  // Live lab states
  const [mechState, setMechState] = useState<CoupledLabState>(() =>
    createInitialMechanicalChainState(mechParams),
  );
  const [elecState, setElecState] = useState<CoupledLabState>(() =>
    createInitialElectricalChainState(elecParams),
  );

  const activeState = selectedLabId === "mechanical-rotary-chain" ? mechState : elecState;

  // Step function
  const stepForward = useCallback(() => {
    if (selectedLabId === "mechanical-rotary-chain") {
      setMechState((prev) => stepMechanicalChainLab(prev, mechParams, [], 0.05));
    } else {
      setElecState((prev) => stepElectricalChainLab(prev, elecParams, [], 0.05));
    }
  }, [selectedLabId, mechParams, elecParams]);

  // Reset function
  const resetLab = useCallback(() => {
    setIsPlaying(false);
    setReplaySuccessMsg(null);
    if (selectedLabId === "mechanical-rotary-chain") {
      setMechParams({
        steamPressurePsi: 100,
        engineRpm: 65,
        cutoffPct: 25,
        totalDraftRatio: 6.0,
        rollerClampingWeightKg: 3.5,
        loopSlackPct: 65,
        stitchPitchMm: 3.5,
        clutch1Connected: true,
        clutch2Connected: true,
        injectedFault: undefined,
      });
      setMechState(
        createInitialMechanicalChainState({
          steamPressurePsi: 100,
          engineRpm: 65,
          cutoffPct: 25,
          totalDraftRatio: 6.0,
          rollerClampingWeightKg: 3.5,
          loopSlackPct: 65,
          stitchPitchMm: 3.5,
          clutch1Connected: true,
          clutch2Connected: true,
        }),
      );
    } else {
      setElecParams({
        shaftRate: 1.0,
        fieldExcitation: 1.0,
        turnsRatio: 1.0,
        coreCoupling: 0.96,
        filamentLengthCm: 15.0,
        coldResistanceOhm: 15.0,
        switch1Connected: true,
        switch2Connected: true,
        injectedFault: undefined,
      });
      setElecState(
        createInitialElectricalChainState({
          shaftRate: 1.0,
          fieldExcitation: 1.0,
          turnsRatio: 1.0,
          coreCoupling: 0.96,
          filamentLengthCm: 15.0,
          coldResistanceOhm: 15.0,
          switch1Connected: true,
          switch2Connected: true,
        }),
      );
    }
  }, [selectedLabId]);

  // Test deterministic replay
  const testDeterministicReplay = useCallback(() => {
    if (selectedLabId === "mechanical-rotary-chain") {
      const actions: CoupledLabAction[] = [
        {
          tick: 2,
          type: "toggle_connection",
          targetId: "clutch-engine-to-arkwright",
          value: false,
        },
        { tick: 6, type: "toggle_connection", targetId: "clutch-engine-to-arkwright", value: true },
      ];
      const run1 = executeCoupledLabReplay("mechanical-rotary-chain", mechParams, actions, 15);
      const run2 = executeCoupledLabReplay("mechanical-rotary-chain", mechParams, actions, 15);
      const isBitExact = run1.every(
        (s, idx) =>
          s.energy.measuredResidualWatts === run2[idx].energy.measuredResidualWatts &&
          s.connections[0].transferredPowerWatts === run2[idx].connections[0].transferredPowerWatts,
      );
      setReplaySuccessMsg(
        isBitExact
          ? "✓ Verified Deterministic Replay: 15 ticks reproduced bit-exact trajectories."
          : "⚠ Replay divergence detected.",
      );
    } else {
      const actions: CoupledLabAction[] = [
        {
          tick: 2,
          type: "toggle_connection",
          targetId: "switch-generator-to-transformer",
          value: false,
        },
        {
          tick: 6,
          type: "toggle_connection",
          targetId: "switch-generator-to-transformer",
          value: true,
        },
      ];
      const run1 = executeCoupledLabReplay("electrical-power-chain", elecParams, actions, 15);
      const run2 = executeCoupledLabReplay("electrical-power-chain", elecParams, actions, 15);
      const isBitExact = run1.every(
        (s, idx) =>
          s.energy.measuredResidualWatts === run2[idx].energy.measuredResidualWatts &&
          s.connections[0].transferredPowerWatts === run2[idx].connections[0].transferredPowerWatts,
      );
      setReplaySuccessMsg(
        isBitExact
          ? "✓ Verified Deterministic Replay: 15 ticks reproduced bit-exact trajectories."
          : "⚠ Replay divergence detected.",
      );
    }
  }, [selectedLabId, mechParams, elecParams]);

  // Shared replay animation clock
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      stepForward();
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying, stepForward]);

  // Global Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        stepForward();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        resetLab();
      } else if (e.key === "1") {
        e.preventDefault();
        if (selectedLabId === "mechanical-rotary-chain") {
          setMechParams((p) => ({ ...p, clutch1Connected: !p.clutch1Connected }));
        } else {
          setElecParams((p) => ({ ...p, switch1Connected: !p.switch1Connected }));
        }
      } else if (e.key === "2") {
        e.preventDefault();
        if (selectedLabId === "mechanical-rotary-chain") {
          setMechParams((p) => ({ ...p, clutch2Connected: !p.clutch2Connected }));
        } else {
          setElecParams((p) => ({ ...p, switch2Connected: !p.switch2Connected }));
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedLabId, stepForward, resetLab]);

  return (
    <section
      className="w-full max-w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 text-ink-900 dark:text-parchment-100 shadow-patent space-y-6"
      aria-label="Coupled Teaching Laboratories Simulator"
      data-testid="coupled-teaching-labs"
    >
      {/* Top Header & Lab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-parchment-300 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
              Coupled Teaching Laboratories
            </h3>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800/60">
              fs-couple · Multi-Patent V2
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-600 dark:text-parchment-400 mt-1">
            Genuine multi-patent port network solver with Dirac coupling, clutch slip, switch
            inrush, and energy conservation.
          </p>
        </div>

        {/* Lab Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedLabId("mechanical-rotary-chain");
              setReplaySuccessMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLabId === "mechanical-rotary-chain"
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-700"
            }`}
            aria-pressed={selectedLabId === "mechanical-rotary-chain"}
          >
            <Cog className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Lab 1: Mechanical Rotary
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedLabId("electrical-power-chain");
              setReplaySuccessMsg(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedLabId === "electrical-power-chain"
                ? "bg-cyan-700 text-white shadow-sm"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-700"
            }`}
            aria-pressed={selectedLabId === "electrical-power-chain"}
          >
            <Zap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
            Lab 2: Electrical Power
          </button>
        </div>
      </div>

      {/* Prominent Evidence Boundary Disclosure Banner */}
      <div className="rounded-xl border border-amber-300/80 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/30 p-3.5 text-xs font-sans leading-relaxed text-amber-950 dark:text-amber-200 flex gap-2.5 items-start">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block uppercase tracking-wider text-[10px] text-amber-800 dark:text-amber-300">
            Educational Composition & Evidence Boundary
          </span>
          <p className="mt-0.5 text-ink-800 dark:text-parchment-200">
            {activeState.compositionDisclosure}
          </p>
        </div>
      </div>

      {/* Shared Replay Clock & Primary Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white/60 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={isPlaying ? "Pause simulation" : "Play continuous simulation"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>

          <button
            type="button"
            onClick={stepForward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-medium text-xs transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Step forward one simulation tick"
          >
            <StepForward className="w-3.5 h-3.5" />
            <span>Step (50ms)</span>
          </button>

          <button
            type="button"
            onClick={resetLab}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 font-medium text-xs transition-colors focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Reset laboratory to initial conditions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={testDeterministicReplay}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-medium text-xs border border-emerald-300/60 dark:border-emerald-800/60 transition-colors"
            aria-label="Verify deterministic action replay"
          >
            <span>Verify Replay</span>
          </button>
        </div>

        {/* Unified Shared Clock Readout */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-parchment-100 dark:bg-ink-950 px-2.5 py-1 rounded border border-parchment-200 dark:border-ink-800">
            <span className="text-ink-500 dark:text-ink-400 mr-1">TICK:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {activeState.clock.tick}
            </span>
          </div>
          <div className="bg-parchment-100 dark:bg-ink-950 px-2.5 py-1 rounded border border-parchment-200 dark:border-ink-800">
            <span className="text-ink-500 dark:text-ink-400 mr-1">TIME:</span>
            <span className="font-bold text-amber-700 dark:text-amber-400">
              {activeState.clock.simTimeSec.toFixed(2)}s
            </span>
          </div>
        </div>
      </div>

      {replaySuccessMsg && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 p-2.5 text-xs font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{replaySuccessMsg}</span>
        </div>
      )}

      {/* Primary Visual Pipeline: 3 Components + 2 Interactive Port Junctions */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {activeState.components.map((comp, idx) => {
            const liveState = activeState.componentStates[comp.componentId];
            const isFirst = idx === 0;
            const isLast = idx === activeState.components.length - 1;
            const connection = !isLast ? activeState.connections[idx] : null;

            return (
              <div key={comp.componentId} className="flex flex-col space-y-3">
                {/* Component Card */}
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all shadow-sm ${
                    liveState?.isRunning
                      ? "border-amber-400/80 dark:border-amber-700/80 bg-white/90 dark:bg-ink-900/90"
                      : "border-parchment-300 dark:border-ink-800 bg-parchment-100/50 dark:bg-ink-950/50 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-2.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
                        {comp.patentNumber} · {comp.title.split("(")[0]}
                      </span>
                      <h4 className="font-serif font-bold text-base text-ink-950 dark:text-parchment-50 leading-snug">
                        <Link
                          href={`/patents/${comp.patentId}`}
                          className="hover:underline hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                          data-patent-id={comp.patentId}
                        >
                          {comp.title}
                        </Link>
                      </h4>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase ${
                        liveState?.isRunning
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {liveState?.isRunning ? "Active" : "Halted"}
                    </span>
                  </div>

                  {/* Telemetry Display */}
                  <div className="my-3 grid grid-cols-2 gap-2 text-xs font-mono">
                    {Object.entries(liveState?.telemetry ?? {}).map(([key, val]) => {
                      if (key.includes("Unrounded")) return null;
                      return (
                        <div
                          key={key}
                          className="p-1.5 rounded bg-parchment-100/70 dark:bg-ink-950/70 border border-parchment-200/60 dark:border-ink-800/60"
                        >
                          <div className="text-[9px] uppercase text-ink-500 dark:text-ink-400 truncate">
                            {key.replace(/([A-Z])/g, " $1")}
                          </div>
                          <div className="font-bold text-ink-900 dark:text-white truncate">
                            {typeof val === "number" ? val.toLocaleString() : String(val)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Ports SI Readout */}
                  <div className="space-y-1.5 border-t border-parchment-200 dark:border-ink-800/80 pt-2.5 text-[11px] font-mono">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 dark:text-ink-400">
                      Live Port-Thermodynamic Interface
                    </div>
                    {Object.values(liveState?.portValues ?? {}).map((port) => (
                      <div
                        key={port.portId}
                        className="p-1.5 rounded bg-parchment-50 dark:bg-ink-950 border border-parchment-200/80 dark:border-ink-800 flex justify-between items-center gap-1"
                      >
                        <span className="text-ink-600 dark:text-parchment-400 truncate">
                          {port.direction === "in" ? "INPUT:" : "OUTPUT:"}
                        </span>
                        <span className="font-semibold text-ink-900 dark:text-white truncate">
                          {port.effort} {port.effortUnit} × {port.flow} {port.flowUnit}
                        </span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {port.powerWatts} W
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Component Controls */}
                  <div className="mt-3 pt-2.5 border-t border-parchment-200 dark:border-ink-800/80 space-y-2">
                    {selectedLabId === "mechanical-rotary-chain" && isFirst && (
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-parchment-400">
                          <span>Corliss Engine Speed</span>
                          <span className="font-bold">{mechParams.engineRpm} RPM</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          step="1"
                          value={mechParams.engineRpm}
                          onChange={(e) =>
                            setMechParams((p) => ({ ...p, engineRpm: Number(e.target.value) }))
                          }
                          className="w-full h-1.5 bg-parchment-300 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          aria-label="Corliss engine speed slider"
                        />
                      </div>
                    )}

                    {selectedLabId === "mechanical-rotary-chain" && idx === 1 && (
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-parchment-400">
                          <span>Water Frame Draft Ratio</span>
                          <span className="font-bold">{mechParams.totalDraftRatio}×</span>
                        </div>
                        <input
                          type="range"
                          min="3.0"
                          max="10.0"
                          step="0.5"
                          value={mechParams.totalDraftRatio}
                          onChange={(e) =>
                            setMechParams((p) => ({
                              ...p,
                              totalDraftRatio: Number(e.target.value),
                            }))
                          }
                          className="w-full h-1.5 bg-parchment-300 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-amber-600"
                          aria-label="Water frame draft ratio slider"
                        />
                      </div>
                    )}

                    {selectedLabId === "electrical-power-chain" && isFirst && (
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-parchment-400">
                          <span>Dynamo Shaft Rate</span>
                          <span className="font-bold">{elecParams.shaftRate.toFixed(2)}×</span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="1.6"
                          step="0.05"
                          value={elecParams.shaftRate}
                          onChange={(e) =>
                            setElecParams((p) => ({ ...p, shaftRate: Number(e.target.value) }))
                          }
                          className="w-full h-1.5 bg-parchment-300 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                          aria-label="Dynamo shaft rate slider"
                        />
                      </div>
                    )}

                    {selectedLabId === "electrical-power-chain" && idx === 1 && (
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-ink-600 dark:text-parchment-400">
                          <span>Transformer Turns Ratio</span>
                          <span className="font-bold">{elecParams.turnsRatio.toFixed(2)}:1</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="2.0"
                          step="0.1"
                          value={elecParams.turnsRatio}
                          onChange={(e) =>
                            setElecParams((p) => ({ ...p, turnsRatio: Number(e.target.value) }))
                          }
                          className="w-full h-1.5 bg-parchment-300 dark:bg-ink-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                          aria-label="Transformer turns ratio slider"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Connection Toggle Between Components */}
                {connection && (
                  <div className="p-3 rounded-xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-300 dark:border-ink-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedLabId === "mechanical-rotary-chain") {
                            if (idx === 0) {
                              setMechParams((p) => ({
                                ...p,
                                clutch1Connected: !p.clutch1Connected,
                              }));
                            } else {
                              setMechParams((p) => ({
                                ...p,
                                clutch2Connected: !p.clutch2Connected,
                              }));
                            }
                          } else {
                            if (idx === 0) {
                              setElecParams((p) => ({
                                ...p,
                                switch1Connected: !p.switch1Connected,
                              }));
                            } else {
                              setElecParams((p) => ({
                                ...p,
                                switch2Connected: !p.switch2Connected,
                              }));
                            }
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500 ${
                          connection.connected
                            ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                            : "bg-zinc-600 hover:bg-zinc-700 text-white"
                        }`}
                        aria-pressed={connection.connected}
                        aria-label={`Toggle connection between ${comp.title} and downstream component`}
                      >
                        {connection.connected ? (
                          <Link2 className="w-3.5 h-3.5" />
                        ) : (
                          <Unlink2 className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {connection.connected
                            ? connection.couplingType === "clutch"
                              ? "Clutch Engaged"
                              : "Switch Closed"
                            : connection.couplingType === "clutch"
                              ? "Clutch Disengaged"
                              : "Switch Open"}
                        </span>
                      </button>

                      <div className="text-[11px] font-mono text-ink-600 dark:text-parchment-400 truncate">
                        State:{" "}
                        <span className="font-semibold text-ink-900 dark:text-white uppercase">
                          {connection.transitionState}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono flex items-center gap-2">
                      <span className="text-ink-500 dark:text-ink-400">Transferred:</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {connection.transferredPowerWatts} W
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Network Energy Accounting & Passivity Ledger */}
      <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-ink-800 dark:text-parchment-200">
              Energy Conservation & Passivity Ledger (SI Measured Residuals)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                activeState.energy.isPassive
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
              }`}
            >
              {activeState.energy.isPassive ? "PASSIVE" : "PASSIVITY VIOLATION"}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                activeState.energy.isConserved
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300"
              }`}
            >
              {activeState.energy.isConserved ? "CONSERVED" : "RESIDUAL EXCEEDED"}
            </span>
          </div>
        </div>

        {/* 5-Column Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Input Power</div>
            <div className="font-bold text-ink-950 dark:text-white text-sm">
              {activeState.energy.totalInputPowerWatts} W
            </div>
          </div>
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Useful Work</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {activeState.energy.totalUsefulOutputPowerWatts} W
            </div>
          </div>
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Dissipated</div>
            <div className="font-bold text-amber-700 dark:text-amber-400 text-sm">
              {activeState.energy.totalDissipatedPowerWatts} W
            </div>
          </div>
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Stored dE/dt</div>
            <div className="font-bold text-cyan-700 dark:text-cyan-400 text-sm">
              {activeState.energy.totalRateOfStoredEnergyWatts} W
            </div>
          </div>
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Interface Slip Loss</div>
            <div className="font-bold text-ink-800 dark:text-parchment-200 text-sm">
              {activeState.energy.totalInterfaceLossWatts} W
            </div>
          </div>
          <div className="p-2 rounded bg-parchment-100/80 dark:bg-ink-950/80 border border-parchment-200 dark:border-ink-800">
            <div className="text-[10px] text-ink-500 uppercase">Measured Residual (R)</div>
            <div
              className={`font-bold text-sm ${
                activeState.energy.isConserved
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600"
              }`}
            >
              {activeState.energy.measuredResidualWatts.toFixed(6)} W
            </div>
          </div>
        </div>

        {/* Refusal Boundary Alert if fault injected */}
        {activeState.energy.refusal?.isRefused && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 p-3 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block uppercase text-[10px] tracking-wider text-rose-800 dark:text-rose-300">
                Refusal Boundary Triggered · Unphysical Energy Injected
              </span>
              <p className="mt-0.5 font-mono">{activeState.energy.refusal.reason}</p>
            </div>
          </div>
        )}

        {/* Energy Fault Injection Test Toggle */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-parchment-200 dark:border-ink-800 text-xs">
          <span className="text-ink-600 dark:text-parchment-400">
            Verification Probe: Test non-passive fault refusal detection
          </span>
          <button
            type="button"
            onClick={() => {
              if (selectedLabId === "mechanical-rotary-chain") {
                setMechParams((p) => ({
                  ...p,
                  injectedFault: p.injectedFault ? undefined : "negative_dissipation",
                }));
              } else {
                setElecParams((p) => ({
                  ...p,
                  injectedFault: p.injectedFault ? undefined : "negative_resistance",
                }));
              }
            }}
            className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeState.energy.injectedEnergyError
                ? "bg-rose-700 hover:bg-rose-800 text-white"
                : "bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200"
            }`}
          >
            {activeState.energy.injectedEnergyError
              ? "Remove Fault Injection"
              : "Inject Non-Passive Fault"}
          </button>
        </div>
      </div>

      {/* Accessible Text-Only Telemetry Table Toggle */}
      <div className="pt-2 border-t border-parchment-300 dark:border-ink-800">
        <button
          type="button"
          onClick={() => setShowTextOnlyView((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-mono text-ink-600 dark:text-parchment-400 hover:text-ink-900 dark:hover:text-white"
        >
          {showTextOnlyView ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          <span>
            {showTextOnlyView
              ? "Hide Accessible Text-Only Telemetry Table"
              : "Show Accessible Text-Only Telemetry Table"}
          </span>
        </button>

        {showTextOnlyView && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse border border-parchment-300 dark:border-ink-800">
              <thead>
                <tr className="bg-parchment-200 dark:bg-ink-900">
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">Component</th>
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">Patent</th>
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">
                    Input Port
                  </th>
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">
                    Output Port
                  </th>
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">State</th>
                  <th className="p-2 border border-parchment-300 dark:border-ink-800">
                    Evidence Boundary
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeState.components.map((comp) => {
                  const s = activeState.componentStates[comp.componentId];
                  const inPort = Object.values(s?.portValues ?? {}).find(
                    (p) => p.direction === "in",
                  );
                  const outPort = Object.values(s?.portValues ?? {}).find(
                    (p) => p.direction === "out",
                  );
                  return (
                    <tr
                      key={comp.componentId}
                      className="hover:bg-parchment-100 dark:hover:bg-ink-900/50"
                    >
                      <td className="p-2 border border-parchment-300 dark:border-ink-800 font-bold">
                        {comp.title}
                      </td>
                      <td className="p-2 border border-parchment-300 dark:border-ink-800">
                        <Link
                          href={`/patents/${comp.patentId}`}
                          className="underline hover:text-amber-700 dark:hover:text-amber-400 font-bold"
                        >
                          {comp.patentNumber}
                        </Link>
                      </td>
                      <td className="p-2 border border-parchment-300 dark:border-ink-800">
                        {inPort
                          ? `${inPort.effort} ${inPort.effortUnit} · ${inPort.flow} ${inPort.flowUnit} (${inPort.powerWatts} W)`
                          : "None (Prime Mover)"}
                      </td>
                      <td className="p-2 border border-parchment-300 dark:border-ink-800">
                        {outPort
                          ? `${outPort.effort} ${outPort.effortUnit} · ${outPort.flow} ${outPort.flowUnit} (${outPort.powerWatts} W)`
                          : "None (Load)"}
                      </td>
                      <td className="p-2 border border-parchment-300 dark:border-ink-800">
                        {s?.isRunning ? "Active" : "Halted"}
                      </td>
                      <td className="p-2 border border-parchment-300 dark:border-ink-800 text-[10px] text-ink-600 dark:text-parchment-400">
                        {comp.evidenceBoundaryNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
