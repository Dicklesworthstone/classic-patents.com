"use client";

import { Pause, Play, RotateCcw, Scissors, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  advanceOtisPlatformPosition,
  OTIS_DEFAULT_PLATFORM_POSITION,
  type OtisDriveCommand,
} from "@/physics/otisKernel";
import { ensureOtisWasm, stepOtisTopology } from "@/physics/otisWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { useOffscreenGate } from "./useOffscreenGate";

const PATENT_ID = "us-31128-otis-elevator";

export function OtisHoistingApparatusSim() {
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const { rootRef, onscreenRef } = useOffscreenGate<HTMLDivElement>();
  const [platformPosition, setPlatformPosition] = useState(OTIS_DEFAULT_PLATFORM_POSITION);
  const [drivePhase, setDrivePhase] = useState(0);
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({
    1: true,
    3: true,
    4: true,
  });
  const positionRef = useRef(platformPosition);
  const phaseRef = useRef(drivePhase);
  const driveCommand = [-1, 0, 1].includes(params.driveCommand)
    ? (params.driveCommand as OtisDriveCommand)
    : 0;
  const displayRatePct = params.displayRatePct ?? 60;
  const ropeGIntact = (params.ropeGIntegrityPct ?? 100) >= 15;
  const stopRopePulled = params.stopRopePulled === 1;
  const state = stepOtisTopology({
    platformPositionNormalized: platformPosition,
    drivePhaseRad: drivePhase,
    driveCommand,
    ropeGIntact,
    stopRopePulled,
    claim1HookLockEnabled: claimStates[1] !== false,
    claim3BrakeInterlockEnabled: claimStates[3] !== false,
    claim4CounterpoiseEnabled: claimStates[4] !== false,
  });

  useEffect(() => {
    void ensureOtisWasm();
  }, []);

  useEffect(() => {
    let requestId = 0;
    let frame = 0;
    const clock = createStudioClock();
    const animate = (now: number) => {
      requestId = requestAnimationFrame(animate);
      if (!onscreenRef.current) return;
      const { dt } = clock.pump(now);
      const current = stepOtisTopology({
        platformPositionNormalized: positionRef.current,
        drivePhaseRad: phaseRef.current,
        driveCommand,
        ropeGIntact,
        stopRopePulled,
        claim1HookLockEnabled: claimStates[1] !== false,
        claim3BrakeInterlockEnabled: claimStates[3] !== false,
        claim4CounterpoiseEnabled: claimStates[4] !== false,
      });
      positionRef.current = advanceOtisPlatformPosition(
        positionRef.current,
        current.platformMotionDirection,
        displayRatePct,
        dt,
      );
      const transmittedDirection = current.straightBeltOWorking
        ? 1
        : current.crossBeltPWorking
          ? -1
          : 0;
      if (transmittedDirection !== 0) {
        phaseRef.current =
          (phaseRef.current + transmittedDirection * 1.5 * dt + Math.PI * 2) % (Math.PI * 2);
      }
      frame += 1;
      if (frame % 3 === 0) {
        setPlatformPosition(positionRef.current);
        setDrivePhase(phaseRef.current);
      }
    };
    requestId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestId);
  }, [claimStates, displayRatePct, driveCommand, onscreenRef, ropeGIntact, stopRopePulled]);

  const platformY = 258 - state.platformPositionNormalized * 160;
  const counterY = 258 - state.counterpoisePositionNormalized * 160;
  const pawlExtension = state.pawlsFEngaged ? 14 : 3;
  const setDrive = (command: OtisDriveCommand) => {
    updateParam("driveCommand", command);
    if (command !== 0) updateParam("stopRopePulled", 0);
    soundEngine.playSwitchClick();
  };

  return (
    <div ref={rootRef} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl font-bold text-ink-950 dark:text-parchment-50">
            Otis’s Complete 1861 Hoisting Apparatus
          </h3>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
            Source-order view of Figs. 1–3: hoist, reversing belts, stop interlock, brake,
            counterpoise, and hook-rack safety.
          </p>
        </div>
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            setClaimStates((previous) => ({ ...previous, [claimNumber]: active }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="min-h-[390px] overflow-hidden rounded-2xl border border-parchment-300 bg-slate-950 p-2 shadow-sm dark:border-ink-800 sm:p-4 lg:col-span-9">
          <svg
            viewBox="0 0 640 350"
            role="img"
            aria-label={`Otis 1861 connected hoisting apparatus in ${state.mechanismMode} mode`}
            className="h-auto w-full"
          >
            <rect width="640" height="350" fill="#0f172a" />

            {/* A/B/C fixed frame and hook racks. */}
            <rect x="330" y="42" width="250" height="18" fill="#6f4b2e" />
            <rect x="342" y="42" width="20" height="270" fill="#6f4b2e" />
            <rect x="548" y="42" width="20" height="270" fill="#6f4b2e" />
            <rect x="318" y="304" width="272" height="24" fill="#6f4b2e" />
            <rect x="28" y="304" width="290" height="24" fill="#6f4b2e" />
            <rect x="42" y="42" width="14" height="262" fill="#475569" />
            <rect x="218" y="42" width="14" height="262" fill="#475569" />
            <line x1="42" y1="70" x2="232" y2="70" stroke="#64748b" strokeWidth="7" />
            <rect x="104" y="272" width="12" height="32" fill="#475569" />
            <rect x="134" y="272" width="12" height="32" fill="#475569" />
            {Array.from({ length: 14 }, (_, index) => 72 + index * 16).map((y) => (
              <g key={y}>
                <path d={`M 362 ${y} l 10 -5 v 10 z`} fill="#94a3b8" />
                <path d={`M 548 ${y} l -10 -5 v 10 z`} fill="#94a3b8" />
              </g>
            ))}
            <text x="394" y="337" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              A BASE · B UPRIGHTS · C HOOK RACKS
            </text>

            {/* D and its a/d/F/E/f organs move as one carriage. */}
            <g transform={`translate(0 ${platformY})`}>
              <rect x="378" y="0" width="154" height="18" fill="#8b5e34" />
              <rect x="382" y="-62" width="14" height="62" fill="#64748b" />
              <rect x="514" y="-62" width="14" height="62" fill="#64748b" />
              <rect x="378" y="-66" width="154" height="10" fill="#64748b" />
              <line x1="455" y1="-86" x2="455" y2="-36" stroke="#f59e0b" strokeWidth="5" />
              <circle cx="455" cy="-36" r="6" fill="#d97706" />
              <path
                d="M 389 -34 L 425 -22 L 455 -36"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="5"
              />
              <path
                d="M 521 -34 L 485 -22 L 455 -36"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="5"
              />
              <line
                x1="390"
                y1="-34"
                x2={390 - pawlExtension}
                y2="-27"
                stroke="#f59e0b"
                strokeWidth="7"
              />
              <line
                x1="520"
                y1="-34"
                x2={520 + pawlExtension}
                y2="-27"
                stroke="#f59e0b"
                strokeWidth="7"
              />
              <text x="403" y="14" fill="#f8fafc" fontSize="10" fontFamily="monospace">
                D · a · d · E · F · f
              </text>
              <line x1="382" y1="-12" x2="78" y2="0" stroke="#f59e0b" strokeWidth="4" />
              <circle cx="78" cy="0" r="7" fill="none" stroke="#fbbf24" strokeWidth="3" />
              <text x="88" y="-5" fill="#fbbf24" fontSize="9" fontFamily="monospace">
                aˣ / bˣ LOWER STOP
              </text>
            </g>

            {/* G stays connected to F, both i pulleys, and H; break shows two tethered halves. */}
            {state.ropeGTaut ? (
              <path
                d={`M 455 ${platformY - 86} L 455 50 L 405 50 L 125 245`}
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
              />
            ) : (
              <g stroke="#ef4444" strokeWidth="3" fill="none">
                <path d={`M 455 ${platformY - 86} L 455 50 L 395 82`} />
                <path d="M 125 245 L 405 50 L 380 92" />
              </g>
            )}
            <circle cx="455" cy="50" r="12" fill="none" stroke="#64748b" strokeWidth="5" />
            <circle cx="405" cy="50" r="12" fill="none" stroke="#64748b" strokeWidth="5" />
            <text x="420" y="34" fill="#f59e0b" fontSize="10" fontFamily="monospace">
              G · i · i
            </text>

            {/* H/I/J/K/L and N with straight O and crossed P belts. */}
            <circle cx="125" cy="245" r="28" fill="none" stroke="#94a3b8" strokeWidth="8" />
            <circle cx="125" cy="228" r="31" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <circle cx="137" cy="181" r="18" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <text x="147" y="211" fill="#f59e0b" fontSize="9" fontFamily="monospace">
              j / k MESH
            </text>
            <text x="118" y="249" fill="#f8fafc" fontSize="11" fontFamily="monospace">
              H
            </text>
            <line x1="42" y1="170" x2="232" y2="170" stroke="#64748b" strokeWidth="7" />
            {[70, 137, 204].map((x, index) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy="170"
                  r={index === 1 ? 22 : 19}
                  fill="none"
                  stroke={index === 1 ? "#f59e0b" : "#64748b"}
                  strokeWidth="6"
                />
                <text x={x - 4} y="174" fill="#f8fafc" fontSize="10" fontFamily="monospace">
                  {["J", "L", "K"][index]}
                </text>
              </g>
            ))}
            <circle cx="137" cy="70" r="31" fill="none" stroke="#94a3b8" strokeWidth="8" />
            <text x="131" y="74" fill="#f8fafc" fontSize="11" fontFamily="monospace">
              N
            </text>
            <path
              d="M 106 70 L 115 170 L 159 170 L 168 70 Z"
              fill="none"
              stroke={state.straightBeltOWorking ? "#22c55e" : "#64748b"}
              strokeWidth="4"
            />
            <path
              d="M 109 58 L 159 182 M 165 58 L 115 182"
              fill="none"
              stroke={state.crossBeltPWorking ? "#22c55e" : "#64748b"}
              strokeWidth="4"
            />
            <text x="34" y="33" fill="#94a3b8" fontSize="10" fontFamily="monospace">
              N POWER · O STRAIGHT · P CROSSED
            </text>

            {/* S/T/U/V and W/X/Y/Z are one stop-and-brake chain. */}
            <g transform={`translate(${state.shipperPositionNormalized * 15} 0)`}>
              <rect x="71" y="119" width="132" height="7" fill="#f59e0b" />
              <circle cx="104" cy="123" r="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
              <circle cx="170" cy="123" r="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
              <text x="112" y="113" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                S / m / o
              </text>
            </g>
            <circle cx="213" cy="123" r="10" fill="none" stroke="#fbbf24" strokeWidth="4" />
            <circle cx="234" cy="123" r="13" fill="none" stroke="#94a3b8" strokeWidth="4" />
            <line x1="213" y1="123" x2="234" y2="123" stroke="#cbd5e1" strokeWidth="5" />
            <text x="204" y="105" fill="#f59e0b" fontSize="9" fontFamily="monospace">
              p / q / r
            </text>
            <path d="M 234 123 L 78 304" fill="none" stroke="#d97706" strokeWidth="3" />
            <path d="M 577 64 L 577 289 L 78 274" fill="none" stroke="#d97706" strokeWidth="2" />
            <path
              d="M 78 274 l -12 -16 M 78 274 l 12 -16"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <text x="15" y="323" fill="#f59e0b" fontSize="10" fontFamily="monospace">
              T HAND ROPE · U STOP ROPE · V BRANCH
            </text>
            <path
              d={`M ${203 + state.shipperPositionNormalized * 15} 123 L 232 138 L 200 170`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
            />
            <rect
              x="187"
              y={state.brakeZEngaged ? 145 : 136}
              width="28"
              height="10"
              fill={state.brakeZEngaged ? "#ef4444" : "#64748b"}
            />
            <text x="218" y="153" fill="#f8fafc" fontSize="9" fontFamily="monospace">
              W/X/Y → Z BRAKE
            </text>

            {/* Q is wound opposite G and remains tethered to R. */}
            <path
              d={`M 125 245 L 525 54 L 525 ${counterY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <rect
              x="510"
              y={counterY}
              width="30"
              height="42"
              fill="#475569"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            <text x="517" y={counterY + 25} fill="#f8fafc" fontSize="10" fontFamily="monospace">
              R
            </text>
            <text x="485" y="35" fill="#38bdf8" fontSize="10" fontFamily="monospace">
              Q / l
            </text>

            <g transform="translate(270 16)">
              <rect width="338" height="32" rx="7" fill="#1e293b" stroke="#475569" />
              <text x="10" y="13" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                FRANKENSIM SOURCE TOPOLOGY
              </text>
              <text
                x="10"
                y="25"
                fill={state.freeFallCounterfactual ? "#fb7185" : "#34d399"}
                fontSize="10"
                fontFamily="monospace"
              >
                {state.mechanismMode.toUpperCase()} ·{" "}
                {state.runtimeSource === "wasm" ? "FS-MBD WASM" : "TYPED MIRROR"}
              </text>
            </g>
          </svg>
        </div>

        <div className="space-y-4 lg:col-span-3">
          <div className="space-y-3 rounded-2xl border border-parchment-300 bg-parchment-100/80 p-4 dark:border-ink-800 dark:bg-ink-900/70">
            <span className="block font-serif text-lg font-bold">Drive and safety controls</span>
            {([1, 0, -1] as OtisDriveCommand[]).map((command) => (
              <button
                key={command}
                type="button"
                onClick={() => setDrive(command)}
                className={`min-h-11 w-full rounded-lg border px-3 text-sm font-semibold ${driveCommand === command ? "border-amber-700 bg-amber-600 text-white" : "border-parchment-300 dark:border-ink-700"}`}
              >
                {command > 0 ? (
                  <Play className="mr-1 inline h-4 w-4" />
                ) : command < 0 ? (
                  <Play className="mr-1 inline h-4 w-4 rotate-180" />
                ) : (
                  <Pause className="mr-1 inline h-4 w-4" />
                )}
                {command > 0 ? "Raise on O" : command < 0 ? "Lower on P" : "Idle J / K"}
              </button>
            ))}
            <button
              type="button"
              onClick={() => updateParam("stopRopePulled", stopRopePulled ? 0 : 1)}
              className={`min-h-11 w-full rounded-lg border px-3 text-sm font-semibold ${stopRopePulled ? "border-rose-700 bg-rose-600 text-white" : "border-parchment-300 dark:border-ink-700"}`}
            >
              <Shield className="mr-1 inline h-4 w-4" /> Pull stop rope U
            </button>
            <button
              type="button"
              onClick={() => updateParam("ropeGIntegrityPct", ropeGIntact ? 0 : 100)}
              className={`min-h-11 w-full rounded-lg border px-3 text-sm font-semibold ${!ropeGIntact ? "border-rose-700 bg-rose-600 text-white" : "border-parchment-300 dark:border-ink-700"}`}
            >
              <Scissors className="mr-1 inline h-4 w-4" />{" "}
              {ropeGIntact ? "Sever rope G" : "Restore rope G"}
            </button>
            <label className="block space-y-1.5 text-xs font-mono">
              <span className="flex justify-between">
                <span>Declared display rate</span>
                <strong>{displayRatePct}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={displayRatePct}
                onChange={(event) => updateParam("displayRatePct", Number(event.target.value))}
                className="h-11 w-full accent-amber-600"
                aria-label="Declared display rate"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                resetParams();
                positionRef.current = OTIS_DEFAULT_PLATFORM_POSITION;
                phaseRef.current = 0;
                setPlatformPosition(OTIS_DEFAULT_PLATFORM_POSITION);
                setDrivePhase(0);
              }}
              className="min-h-11 w-full rounded-lg border border-parchment-300 px-3 text-sm dark:border-ink-700"
            >
              <RotateCcw className="mr-1 inline h-4 w-4" /> Reset apparatus
            </button>
          </div>
          <div
            className={`rounded-xl border p-4 text-xs ${state.freeFallCounterfactual ? "border-rose-500 bg-rose-500/10 text-rose-800 dark:text-rose-200" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"}`}
          >
            <strong className="block font-sans">Claim state</strong>
            {state.freeFallCounterfactual
              ? "Refused: rope G is broken while Claim 1's hook-lock geometry is inverted. The carriage stays in its grooves, but no arrest is asserted."
              : state.pawlsFEngaged
                ? "Rope G released F; E turns the hook pawls f into fixed racks C."
                : "The connected apparatus is within the source-described operating topology."}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-ink-500 dark:text-ink-400">
        The facsimile provides connectivity and discrete operating logic only. Positions and rate
        are declared display coordinates; this view makes no historical load, force, timing,
        stopping-distance, or power claim.
      </p>
    </div>
  );
}
