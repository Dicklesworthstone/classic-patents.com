"use client";

import { Gauge, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { FrankenSimEngine } from "@/physics/engine";
import {
  ensureGoddardWasm,
  goddardKernelSource,
  subscribeGoddardKernelSource,
} from "@/physics/goddardWasm";
import { getPatentPhysicsParams, usePatentPhysics } from "@/physics/usePatentPhysics";
import { useWasmKernelSource } from "@/physics/useWasmKernelSource";
import { useOffscreenGate } from "./useOffscreenGate";

const PATENT_ID = "us-1102653-goddard-rocket";
const UI_SNAPSHOT_INTERVAL_MS = 80;

type GoddardAnimationControls = {
  primarySpinRpm: number;
  gyroSpinRpm: number;
  tubeLengthRatio: number;
  auxiliaryReleaseFraction: number;
  primaryChargeSubstantiallyConsumed: boolean;
  gyroEnabled: boolean;
};

function readGoddardAnimationControls(params: Record<string, number>): GoddardAnimationControls {
  return {
    primarySpinRpm: params.primarySpinRpm ?? 120,
    gyroSpinRpm: params.gyroSpinRpm ?? 6_000,
    tubeLengthRatio: params.tubeLengthRatio ?? 4.5,
    auxiliaryReleaseFraction: params.auxiliaryReleaseFraction ?? 0,
    primaryChargeSubstantiallyConsumed: (params.primaryChargeConsumed ?? 0) !== 0,
    gyroEnabled: (params.gyroEnabled ?? 1) !== 0,
  };
}

function quaternionAxisAngleDeg([w, _x, y]: readonly [number, number, number, number]): number {
  return (2 * Math.atan2(y, w) * 180) / Math.PI;
}

function projectGoddardPose(
  primaryAssembly: SVGGElement | null,
  auxiliaryAssembly: SVGGElement | null,
  gyroAssembly: SVGGElement | null,
  primaryAngleDeg: number,
  auxiliaryReleaseFraction: number,
  gyroOperational: boolean,
) {
  primaryAssembly?.setAttribute("transform", `rotate(${primaryAngleDeg} 320 300)`);
  auxiliaryAssembly?.setAttribute("transform", `translate(0 ${-auxiliaryReleaseFraction * 125})`);
  gyroAssembly?.setAttribute(
    "transform",
    `rotate(${gyroOperational ? -primaryAngleDeg : 0} 320 42)`,
  );
}

export function GoddardRocketSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const kernelSource = useWasmKernelSource(
    goddardKernelSource,
    subscribeGoddardKernelSource,
    ensureGoddardWasm,
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedSecondsRef = useRef(0);
  const primaryAssemblyRef = useRef<SVGGElement>(null);
  const auxiliaryAssemblyRef = useRef<SVGGElement>(null);
  const gyroAssemblyRef = useRef<SVGGElement>(null);
  const controls = readGoddardAnimationControls(params);
  const controlsRef = useRef(controls);
  const {
    primarySpinRpm,
    gyroSpinRpm,
    tubeLengthRatio,
    auxiliaryReleaseFraction,
    primaryChargeSubstantiallyConsumed,
    gyroEnabled,
  } = controls;

  useEffect(() => {
    controlsRef.current = {
      primarySpinRpm,
      gyroSpinRpm,
      tubeLengthRatio,
      auxiliaryReleaseFraction,
      primaryChargeSubstantiallyConsumed,
      gyroEnabled,
    };
  }, [
    auxiliaryReleaseFraction,
    gyroEnabled,
    gyroSpinRpm,
    primaryChargeSubstantiallyConsumed,
    primarySpinRpm,
    tubeLengthRatio,
  ]);

  useEffect(() => {
    let requestId = 0;
    let lastFrame = 0;
    let lastUiSnapshot = 0;
    const animate = (now: number) => {
      requestId = requestAnimationFrame(animate);
      if (!onscreenRef.current) {
        lastFrame = now;
        return;
      }
      const dtSeconds = lastFrame === 0 ? 0 : Math.min((now - lastFrame) / 1000, 0.1);
      lastFrame = now;
      elapsedSecondsRef.current = (elapsedSecondsRef.current + dtSeconds) % 600;
      const currentControls = controlsRef.current;
      const currentPhysics = FrankenSimEngine.stepGoddardApparatus(
        elapsedSecondsRef.current,
        currentControls.primarySpinRpm,
        currentControls.gyroSpinRpm,
        currentControls.tubeLengthRatio,
        currentControls.auxiliaryReleaseFraction,
        currentControls.primaryChargeSubstantiallyConsumed,
        currentControls.gyroEnabled,
      );
      const currentPrimaryAngleDeg = quaternionAxisAngleDeg(currentPhysics.primaryQuaternion);
      projectGoddardPose(
        primaryAssemblyRef.current,
        auxiliaryAssemblyRef.current,
        gyroAssemblyRef.current,
        currentPrimaryAngleDeg,
        currentControls.auxiliaryReleaseFraction,
        currentControls.gyroEnabled && currentControls.gyroSpinRpm > 0,
      );
      if (now - lastUiSnapshot >= UI_SNAPSHOT_INTERVAL_MS) {
        lastUiSnapshot = now;
        setElapsedSeconds(elapsedSecondsRef.current);
      }
    };
    requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, [onscreenRef]);

  const gyroOperational = gyroEnabled && gyroSpinRpm > 0;
  const physics = FrankenSimEngine.stepGoddardApparatus(
    elapsedSeconds,
    primarySpinRpm,
    gyroSpinRpm,
    tubeLengthRatio,
    auxiliaryReleaseFraction,
    primaryChargeSubstantiallyConsumed,
    gyroEnabled,
  );
  const tubeLength = 34 * tubeLengthRatio;
  const primaryAngleDeg = quaternionAxisAngleDeg(physics.primaryQuaternion);

  return (
    <div
      ref={rootRef}
      className="space-y-6 rounded-2xl border border-amber-900/20 bg-parchment-50 p-6 shadow-patent dark:border-ink-800 dark:bg-ink-950 sm:p-7"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-parchment-200 pb-4 dark:border-ink-800 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <Gauge className="h-6 w-6 text-amber-700 dark:text-amber-400" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Goddard&apos;s Connected 1914 Rocket Apparatus
            </h3>
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink-700 dark:text-ink-300 sm:text-base">
            The source mechanism is one connected chain: frame bearings 22/23 → primary chamber 10 →
            tapered tube 11 → firing tube 24 → nested auxiliary rocket 25 → pivoted camera support
            33 and gyroscope 37.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <span className="rounded-xl border border-parchment-300 bg-parchment-100 px-3 py-1.5 font-mono text-xs font-bold text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-parchment-300">
            {kernelSource === "wasm"
              ? "fs-mbd compiled browser kernel stepped"
              : "typed TS fallback"}
          </span>
          <button
            type="button"
            onClick={() => {
              resetParams();
              const resetControls = readGoddardAnimationControls(getPatentPhysicsParams(PATENT_ID));
              controlsRef.current = resetControls;
              elapsedSecondsRef.current = 0;
              const resetPhysics = FrankenSimEngine.stepGoddardApparatus(
                0,
                resetControls.primarySpinRpm,
                resetControls.gyroSpinRpm,
                resetControls.tubeLengthRatio,
                resetControls.auxiliaryReleaseFraction,
                resetControls.primaryChargeSubstantiallyConsumed,
                resetControls.gyroEnabled,
              );
              projectGoddardPose(
                primaryAssemblyRef.current,
                auxiliaryAssemblyRef.current,
                gyroAssemblyRef.current,
                quaternionAxisAngleDeg(resetPhysics.primaryQuaternion),
                resetControls.auxiliaryReleaseFraction,
                resetControls.gyroEnabled && resetControls.gyroSpinRpm > 0,
              );
              setElapsedSeconds(0);
            }}
            aria-label="Reset source apparatus"
            className="rounded-lg bg-parchment-200 p-2 text-ink-800 transition-colors hover:bg-parchment-300 dark:bg-ink-800 dark:text-parchment-200 dark:hover:bg-ink-700"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden rounded-2xl border border-parchment-300 bg-[#111827] p-3 dark:border-ink-800 lg:col-span-8">
          <svg
            viewBox="0 0 640 600"
            role="img"
            aria-label={`Source-bounded Goddard rocket apparatus. Tapered tube ratio ${tubeLengthRatio.toFixed(1)} to one. Auxiliary release ${Math.round(auxiliaryReleaseFraction * 100)} percent. Camera support angular velocity ${physics.cameraSupportAngularVelocityRadPerSec.toFixed(2)} radians per second.`}
            className="h-auto max-h-[570px] w-full"
          >
            <defs>
              <linearGradient id="goddard-brass" x1="0" x2="1">
                <stop offset="0" stopColor="#705130" />
                <stop offset="0.5" stopColor="#d0b37b" />
                <stop offset="1" stopColor="#705130" />
              </linearGradient>
              <linearGradient id="goddard-efflux" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fde68a" />
                <stop offset="0.55" stopColor="#f97316" />
                <stop offset="1" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="640" height="600" fill="#111827" />
            <g stroke="#64748b" strokeWidth="8" strokeLinecap="round">
              <line x1="140" y1="550" x2="255" y2="225" />
              <line x1="500" y1="550" x2="385" y2="225" />
              <line x1="125" y1="552" x2="515" y2="552" />
              <line x1="245" y1="300" x2="285" y2="300" />
              <line x1="395" y1="300" x2="355" y2="300" />
              <line x1="254" y1="225" x2="286" y2="225" />
              <line x1="386" y1="225" x2="354" y2="225" />
            </g>
            <ellipse
              cx="320"
              cy="300"
              rx="42"
              ry="12"
              fill="none"
              stroke="#d97706"
              strokeWidth="7"
            />
            <ellipse
              cx="320"
              cy="225"
              rx="42"
              ry="12"
              fill="none"
              stroke="#d97706"
              strokeWidth="7"
            />
            <text x="115" y="530" fill="#cbd5e1" fontSize="14" fontFamily="monospace">
              21 frame
            </text>
            <text x="405" y="294" fill="#fbbf24" fontSize="13" fontFamily="monospace">
              22/23 bearings
            </text>

            <g ref={primaryAssemblyRef} transform={`rotate(${primaryAngleDeg} 320 300)`}>
              <rect
                x="280"
                y="210"
                width="80"
                height="150"
                rx="18"
                fill="url(#goddard-brass)"
                stroke="#f3e4c0"
                strokeWidth="2"
              />
              {[0, 1, 2, 3, 4, 5].map((disk) => (
                <rect
                  key={disk}
                  x="291"
                  y={326 - disk * 19}
                  width="58"
                  height="13"
                  rx="3"
                  fill="#7f1d1d"
                  opacity={primaryChargeSubstantiallyConsumed ? 0.25 : 0.95}
                />
              ))}
              <text x="289" y="347" fill="#fff7ed" fontSize="12" fontFamily="monospace">
                10 / disks 12
              </text>

              <path
                d={`M 297 360 L 343 360 L ${tubeLengthRatio >= 3 ? 342 : 350} ${360 + tubeLength} L ${tubeLengthRatio >= 3 ? 298 : 290} ${360 + tubeLength} Z`}
                fill="#8b5e34"
                stroke={physics.claim2Satisfied ? "#34d399" : "#ef4444"}
                strokeWidth="3"
              />
              <text
                x="352"
                y={390}
                fill={physics.claim2Satisfied ? "#6ee7b7" : "#fca5a5"}
                fontSize="13"
                fontFamily="monospace"
              >
                11 · L/D {tubeLengthRatio.toFixed(1)}
              </text>

              {!primaryChargeSubstantiallyConsumed && physics.claim2Satisfied && (
                <path
                  d={`M 303 ${360 + tubeLength} Q 320 ${405 + tubeLength} 337 ${360 + tubeLength} Z`}
                  fill="url(#goddard-efflux)"
                />
              )}

              <g
                transform="translate(320 210)"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeLinecap="round"
              >
                <path d="M -24 0 Q -58 -12 -62 -42" />
                <path d="M 24 0 Q 58 12 62 42" />
                <path d="M 0 -24 Q 12 -58 42 -62" />
                <path d="M 0 24 Q -12 58 -42 62" />
              </g>
              <text x="384" y="188" fill="#fbbf24" fontSize="13" fontFamily="monospace">
                15 spin passages
              </text>

              <rect
                x="300"
                y="92"
                width="40"
                height="120"
                fill="#76532f"
                stroke="#d6b477"
                strokeWidth="2"
              />
              <text x="347" y="145" fill="#fbbf24" fontSize="13" fontFamily="monospace">
                24 firing tube
              </text>

              <g
                ref={auxiliaryAssemblyRef}
                transform={`translate(0 ${-auxiliaryReleaseFraction * 125})`}
              >
                <path
                  d="M 309 155 L 331 155 L 329 105 L 311 105 Z"
                  fill="#b87333"
                  stroke="#fbbf24"
                />
                <rect
                  x="304"
                  y="62"
                  width="32"
                  height="44"
                  rx="7"
                  fill="#b9a77a"
                  stroke="#f3e4c0"
                />
                <path
                  d="M 300 62 L 340 62 L 334 28 Q 320 10 306 28 Z"
                  fill="#9a7b52"
                  stroke="#f3e4c0"
                />
                <text x="348" y="78" fill="#fbbf24" fontSize="13" fontFamily="monospace">
                  25 auxiliary
                </text>
                <g
                  ref={gyroAssemblyRef}
                  transform={`rotate(${gyroOperational ? -primaryAngleDeg : 0} 320 42)`}
                >
                  <line x1="305" y1="42" x2="335" y2="42" stroke="#94a3b8" strokeWidth="5" />
                  <circle cx="314" cy="42" r="10" fill="#b87333" stroke="#fde68a" strokeWidth="2" />
                  <rect x="324" y="33" width="14" height="12" fill="#111827" stroke="#cbd5e1" />
                </g>
                <text
                  x="348"
                  y="42"
                  fill={gyroOperational ? "#6ee7b7" : gyroEnabled ? "#fbbf24" : "#fca5a5"}
                  fontSize="12"
                  fontFamily="monospace"
                >
                  37 gyro / 33 camera
                </text>
              </g>
            </g>

            <g transform="translate(24 24)" fontFamily="monospace" fontSize="12">
              <rect width="220" height="100" rx="9" fill="#0f172a" stroke="#334155" />
              <text x="12" y="22" fill="#94a3b8">
                FRANKENSIM SOURCE STATE
              </text>
              <text x="12" y="43" fill={physics.claim2Satisfied ? "#6ee7b7" : "#fca5a5"}>
                Claim 2: {physics.claim2Satisfied ? "L ≥ 3D" : "FAILED — L < 3D"}
              </text>
              <text x="12" y="64" fill={physics.claim1SequenceSatisfied ? "#6ee7b7" : "#fca5a5"}>
                Claim 1: {physics.claim1SequenceSatisfied ? "ordered firing" : "premature firing"}
              </text>
              <text x="12" y="85" fill="#7dd3fc">
                camera ω: {physics.cameraSupportAngularVelocityRadPerSec.toFixed(2)} rad/s
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <div className="space-y-4 rounded-2xl border border-parchment-300 bg-parchment-100/80 p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900/70">
            <span className="block font-serif text-lg font-bold text-ink-950 dark:text-parchment-50">
              Source Controls &amp; Claim Probes
            </span>

            {[
              ["tubeLengthRatio", "Tapered tube ratio", tubeLengthRatio, 1.5, 6, 0.1, "L/D"],
              ["primarySpinRpm", "Declared primary spin", primarySpinRpm, 0, 300, 5, "rpm"],
              ["gyroSpinRpm", "Declared gyro spin", gyroSpinRpm, 0, 12_000, 250, "rpm"],
              [
                "auxiliaryReleaseFraction",
                "Auxiliary release",
                auxiliaryReleaseFraction,
                0,
                1,
                0.02,
                "fraction",
              ],
            ].map(([key, label, value, min, max, step, unit]) => (
              <label key={String(key)} className="block space-y-1.5 font-mono text-xs">
                <span className="flex justify-between gap-2 text-ink-800 dark:text-parchment-200">
                  <span>{label}</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">
                    {Number(value).toLocaleString()} {unit}
                  </span>
                </span>
                <input
                  type="range"
                  min={Number(min)}
                  max={Number(max)}
                  step={Number(step)}
                  value={Number(value)}
                  onChange={(event) => updateParam(String(key), Number(event.target.value))}
                  className="h-11 w-full cursor-pointer accent-amber-700"
                />
              </label>
            ))}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateParam("primaryChargeConsumed", primaryChargeSubstantiallyConsumed ? 0 : 1)
                }
                className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  primaryChargeSubstantiallyConsumed
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-amber-700 bg-amber-700 text-white"
                }`}
              >
                {primaryChargeSubstantiallyConsumed
                  ? "Main charge consumed"
                  : "Main charge burning"}
              </button>
              <button
                type="button"
                onClick={() => updateParam("gyroEnabled", gyroEnabled ? 0 : 1)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold ${
                  gyroEnabled
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-red-700 bg-red-700 text-white"
                }`}
              >
                Gyro {gyroOperational ? "restrains support" : gyroEnabled ? "stopped" : "omitted"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-relaxed text-ink-900 dark:text-parchment-100">
            <span className="mb-1 block font-mono text-xs font-bold tracking-wider text-amber-900 uppercase dark:text-amber-300">
              Physics boundary
            </span>
            <p>
              <TextWithLatex text="$\omega = 2\pi N / 60$" /> converts declared RPM to SI angular
              velocity. FrankenSim then advances normalized torque-free rigid-body poses. Claim 2 is
              the exact source test <TextWithLatex text="$L \ge 3D$" />. Absolute dimensions, mass,
              thrust, Mach number, and flight trajectory remain unknown because this facsimile does
              not supply the inputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
