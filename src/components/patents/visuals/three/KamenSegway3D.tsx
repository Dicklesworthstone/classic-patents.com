"use client";

import { useEffect, useMemo, useRef } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { createKamenSegwayModel } from "@/components/patents/visuals/three/kamenSegwayModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { readKamenSegwayControls, stepKamenSegwaySi } from "@/physics/kamenSegwayKernel";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-6302230-kamen-segway";

export function KamenSegway3D({ patentId = PATENT_ID }: { patentId?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);

  const _frankenPhysics = useFrankenSimPhysics(patentId);
  const patentPhysics = usePatentPhysics(patentId);

  const effectiveControls = useMemo(() => {
    return readKamenSegwayControls(patentPhysics?.params ?? {});
  }, [patentPhysics?.params]);

  const tel = useMemo(() => {
    return stepKamenSegwaySi(effectiveControls);
  }, [effectiveControls]);
  const claimStates = useMemo(
    () => ({
      1: effectiveControls.claim1BalanceEnabled,
      2: effectiveControls.claim2RippleEnabled,
    }),
    [effectiveControls.claim1BalanceEnabled, effectiveControls.claim2RippleEnabled],
  );

  // Dynamic references for the render loop
  const controlsRef = useRef(effectiveControls);
  controlsRef.current = effectiveControls;
  const telRef = useRef(tel);
  telRef.current = tel;

  useEffect(() => {
    if (!containerRef.current) return;

    const segway3D = createKamenSegwayModel();

    const studio = createThreeStudioScene({
      container: containerRef.current,
      cameraPos: [1.8, 1.4, 2.4],
      targetPos: [0, 0.8, 0],
      fov: 42,
    });

    studio.scene.add(segway3D.rootGroup);
    studioRef.current = studio;

    const clock = createStudioClock();
    let animId: number;

    const loop = (nowMs: number) => {
      const { simTimeSec } = clock.pump(nowMs);
      segway3D.update(controlsRef.current, telRef.current, simTimeSec);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      studio.dispose();
      studioRef.current = null;
    };
  }, []);

  const updateControl = (key: string, value: number) => {
    patentPhysics?.updateParam?.(key, value);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-xl border border-slate-800 p-4 shadow-2xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="font-mono text-sm font-semibold tracking-wider text-cyan-400 uppercase">
              US 6,302,230 • 3D Inverted Pendulum Transporter Studio
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Source-disclosed automatic-balance and ripple-alarm topology with modern illustrative 3D
            kinematics
          </p>
          <ClaimConstraintToggle
            patentId={PATENT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNumber, active) => {
              const key = claimNumber === 1 ? "claim1BalanceEnabled" : "claim2RippleEnabled";
              patentPhysics?.updateParam?.(key, active ? 1 : 0);
            }}
            className="mt-2"
          />
        </div>
      </div>

      {/* 3D WebGL Viewport */}
      <div className="relative w-full h-[400px] bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* Refusal Overlay */}
        {tel.refusalReason && (
          <div className="absolute inset-0 z-20 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center border border-rose-500/50">
            <span className="text-3xl mb-2">⚠️</span>
            <h4 className="text-sm font-bold text-rose-300 font-mono uppercase tracking-wider mb-1">
              Physical Refusal Boundary Encountered
            </h4>
            <p className="text-xs text-rose-200 max-w-md">{tel.refusalReason}</p>
            <button
              type="button"
              onClick={() => patentPhysics?.resetParams?.()}
              className="mt-3 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono rounded transition-colors"
            >
              Reset to Safe Equilibrium
            </button>
          </div>
        )}

        {/* HUD Overlay */}
        <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur border border-slate-800/80 rounded-lg p-3 text-xs font-mono flex flex-col gap-1.5 pointer-events-none">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
            <span>DYNAMICS HUD</span>
            <span>{tel.velocityKmh.toFixed(1)} km/h</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Pitch Lean:</span>
            <span className="text-cyan-300 font-bold">
              {effectiveControls.riderPitchDeg.toFixed(1)}°
            </span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Motor Torque:</span>
            <span className="text-indigo-300 font-bold">{tel.motorTorqueNm.toFixed(1)} N·m</span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Balancing Margin:</span>
            <span
              className={`font-bold ${
                tel.balancingMarginRatio > 0.4
                  ? "text-emerald-400"
                  : tel.balancingMarginRatio > 0.22
                    ? "text-amber-400"
                    : "text-rose-400"
              }`}
            >
              {(tel.balancingMarginRatio * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-slate-300 flex justify-between gap-4">
            <span>Haptic Ripple:</span>
            <span
              className={
                tel.tactileAlarmActive ? "text-rose-400 font-bold animate-pulse" : "text-slate-500"
              }
            >
              {tel.claim2RippleWithheld
                ? "CLAIM 2 WITHHELD"
                : tel.tactileAlarmActive
                  ? "RIPPLE ACTIVE"
                  : "OFF"}
            </span>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80 text-xs">
        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Rider Pitch Lean (θ):</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.riderPitchDeg.toFixed(1)}°
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="15"
            step="0.5"
            value={effectiveControls.riderPitchDeg}
            onChange={(e) => updateControl("riderPitchDeg", Number.parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Steering Yaw Command:</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.steeringInput.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="-1.0"
            max="1.0"
            step="0.1"
            value={effectiveControls.steeringInput}
            onChange={(e) => updateControl("steeringInput", Number.parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between font-mono mb-1">
            <span className="text-slate-400">Speed Governor Limit:</span>
            <span className="text-cyan-400 font-bold">
              {effectiveControls.speedLimitMS.toFixed(1)} m/s
            </span>
          </div>
          <input
            type="range"
            min="2.0"
            max="6.0"
            step="0.5"
            value={effectiveControls.speedLimitMS}
            onChange={(e) => updateControl("speedLimitMS", Number.parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Telemetry Badge */}
      <PhysicsTelemetryBadge
        patentId={patentId}
        equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
      />
    </div>
  );
}
