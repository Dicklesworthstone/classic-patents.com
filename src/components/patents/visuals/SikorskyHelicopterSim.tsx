"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  type SikorskyHelicopterControls,
  type SikorskyHelicopterMetrics,
  type SikorskyHelicopterState,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";

export const SikorskyHelicopterSim: React.FC = () => {
  const [controls, setControls] = useState<SikorskyHelicopterControls>(DEFAULT_SIKORSKY_CONTROLS);
  const [simState, setSimState] = useState<SikorskyHelicopterState>(INITIAL_SIKORSKY_STATE);
  const [metrics, setMetrics] = useState<SikorskyHelicopterMetrics>(() => {
    return stepSikorskyHelicopterSi(INITIAL_SIKORSKY_STATE, DEFAULT_SIKORSKY_CONTROLS, 0.016)
      .metrics;
  });

  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  const setControl = <K extends keyof SikorskyHelicopterControls>(
    key: K,
    value: SikorskyHelicopterControls[K],
  ) => {
    setControls((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animation & simulation loop (60 FPS)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      setSimState((prevState) => {
        const { state: nextState, metrics: nextMetrics } = stepSikorskyHelicopterSi(
          prevState,
          controlsRef.current,
          dt,
        );
        setMetrics(nextMetrics);
        return nextState;
      });

      // Render Canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          renderHelicopterSim(ctx, canvas.width, canvas.height, simState, metrics, controlsRef.current);
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [simState, metrics]);

  return (
    <div className="w-full bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl p-4 sm:p-6 text-stone-100 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-stone-800">
        <div>
          <h3 className="text-lg font-bold text-amber-400 tracking-wide">
            Sikorsky VS-300 Aerodynamic Rotorcraft Simulator
          </h3>
          <p className="text-xs text-stone-400">
            US 2,318,259: Single Main Rotor Cyclic/Collective Feathering & Tail Anti-Torque Equilibrium
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-mono font-semibold ${
              simState.clutchEngaged
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : "bg-amber-950 text-amber-400 border border-amber-800 animate-pulse"
            }`}
          >
            {simState.clutchEngaged ? "ENGINE DRIVE ACTIVE" : "AUTOROTATION FREECYCLE"}
          </span>
          <span
            className={`px-2.5 py-1 text-xs rounded-full font-mono font-semibold ${
              metrics.isHovering
                ? "bg-blue-950 text-blue-400 border border-blue-800"
                : "bg-stone-800 text-stone-400"
            }`}
          >
            {metrics.isHovering ? "STEADY HOVER" : "MANEUVERING"}
          </span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative my-4 w-full bg-stone-950 rounded-lg border border-stone-800 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={840}
          height={380}
          className="w-full h-[280px] sm:h-[360px] object-contain block"
        />
      </div>

      {/* Controls & Telemetry Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-stone-800 text-xs">
        {/* Column 1: Collective & Engine */}
        <div className="space-y-3 bg-stone-950/60 p-3 rounded-lg border border-stone-800/80">
          <div className="font-semibold text-amber-400 uppercase tracking-wider flex justify-between">
            <span>Collective & Engine Power</span>
            <span className="font-mono text-emerald-400">{controls.collectivePitchDeg.toFixed(1)}°</span>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>Collective Pitch Lever (Vertical Lift)</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={16.0}
              step={0.2}
              value={controls.collectivePitchDeg}
              onChange={(e) => setControl("collectivePitchDeg", parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
              <span>2° (Descent)</span>
              <span>9.5° (Hover)</span>
              <span>16° (Max Climb)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>Engine Throttle Base</span>
              <span className="font-mono text-stone-300">{controls.engineThrottlePercent}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={controls.engineThrottlePercent}
              onChange={(e) => setControl("engineThrottlePercent", parseFloat(e.target.value))}
              className="w-full accent-teal-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-stone-400">Engine Ignition State</span>
            <button
              type="button"
              onClick={() => setControl("engineRunning", controls.engineRunning ? 0 : 1)}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                controls.engineRunning
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-rose-700 hover:bg-rose-600 text-white"
              }`}
            >
              {controls.engineRunning ? "Cut Engine (Autorotate)" : "Start Engine"}
            </button>
          </div>
        </div>

        {/* Column 2: Cyclic Stick & Yaw Rudder */}
        <div className="space-y-3 bg-stone-950/60 p-3 rounded-lg border border-stone-800/80">
          <div className="font-semibold text-amber-400 uppercase tracking-wider flex justify-between">
            <span>Flight Controls (Cyclic & Yaw)</span>
            <span className="font-mono text-cyan-400">
              P:{controls.cyclicPitchForwardDeg.toFixed(1)}° R:{controls.cyclicRollRightDeg.toFixed(1)}°
            </span>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>Fore/Aft Cyclic (Pitch Stick)</span>
            </div>
            <input
              type="range"
              min={-10.0}
              max={10.0}
              step={0.5}
              value={controls.cyclicPitchForwardDeg}
              onChange={(e) => setControl("cyclicPitchForwardDeg", parseFloat(e.target.value))}
              className="w-full accent-cyan-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
              <span>-10° (Aft/Brake)</span>
              <span>0° (Level)</span>
              <span>+10° (Forward)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-stone-400 mb-1">
              <span>Anti-Torque Rudder Pedals (Yaw)</span>
              <span className="font-mono text-stone-300">{controls.tailRotorPedalPercent}%</span>
            </div>
            <input
              type="range"
              min={-100}
              max={100}
              step={5}
              value={controls.tailRotorPedalPercent}
              onChange={(e) => setControl("tailRotorPedalPercent", parseFloat(e.target.value))}
              className="w-full accent-purple-500 bg-stone-800 rounded h-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
              <span>Left Turn</span>
              <span>Trim Balanced</span>
              <span>Right Turn</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-stone-400 pt-1">
            <span>Correlated Throttle:</span>
            <span className="font-mono font-semibold text-teal-400">
              {metrics.effectiveThrottlePercent.toFixed(1)}% (Linkage Active)
            </span>
          </div>
        </div>

        {/* Column 3: Live SI Telemetry */}
        <div className="space-y-2 bg-stone-950/60 p-3 rounded-lg border border-stone-800/80 font-mono">
          <div className="font-semibold text-amber-400 uppercase tracking-wider font-sans mb-2">
            Live SI Telemetry
          </div>

          <div className="flex justify-between border-b border-stone-800/50 pb-1">
            <span className="text-stone-400">Main Rotor Lift:</span>
            <span className={metrics.mainRotorThrustNewtons >= 5100 ? "text-emerald-400 font-bold" : "text-amber-400"}>
              {metrics.mainRotorThrustNewtons.toFixed(1)} N <span className="text-[10px] text-stone-500">/ 5,100 N Wt</span>
            </span>
          </div>

          <div className="flex justify-between border-b border-stone-800/50 pb-1">
            <span className="text-stone-400">Main Rotor RPM:</span>
            <span className="text-stone-200">
              {simState.rotorRpm.toFixed(1)} RPM <span className="text-[10px] text-stone-500">(Tip M {metrics.tipMachNumber.toFixed(2)})</span>
            </span>
          </div>

          <div className="flex justify-between border-b border-stone-800/50 pb-1">
            <span className="text-stone-400">Reactive Torque Q:</span>
            <span className="text-amber-400">{metrics.mainRotorTorqueNm.toFixed(1)} N·m</span>
          </div>

          <div className="flex justify-between border-b border-stone-800/50 pb-1">
            <span className="text-stone-400">Tail Anti-Torque T:</span>
            <span className="text-cyan-400">{metrics.tailRotorThrustNewtons.toFixed(1)} N</span>
          </div>

          <div className="flex justify-between border-b border-stone-800/50 pb-1">
            <span className="text-stone-400">Net Yaw Moment:</span>
            <span className={Math.abs(metrics.netYawMomentNm) < 20 ? "text-emerald-400" : "text-rose-400"}>
              {metrics.netYawMomentNm.toFixed(1)} N·m
            </span>
          </div>

          <div className="flex justify-between pt-0.5">
            <span className="text-stone-400">Altitude & Climb:</span>
            <span className="text-blue-400">
              {simState.altitudeMeters.toFixed(1)} m ({simState.verticalVelocityMs >= 0 ? "+" : ""}
              {simState.verticalVelocityMs.toFixed(1)} m/s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

function renderHelicopterSim(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: SikorskyHelicopterState,
  metrics: SikorskyHelicopterMetrics,
  controls: SikorskyHelicopterControls,
) {
  // Clear Background
  ctx.fillStyle = "#0c0a09"; // Stone 950
  ctx.fillRect(0, 0, width, height);

  // Split view: Left = Side Elevation Flight Dynamics (55%), Right = Plan View Torque Vector Equilibrium (45%)
  const splitX = width * 0.54;

  // Draw Divider
  ctx.strokeStyle = "#292524";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(splitX, 10);
  ctx.lineTo(splitX, height - 10);
  ctx.stroke();

  // ----------------------------------------------------
  // LEFT PANEL: SIDE ELEVATION & MOMENTUM DOWNWASH
  // ----------------------------------------------------
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, splitX, height);
  ctx.clip();

  // Sky / Ground
  const groundY = height - 40;
  ctx.fillStyle = "#1c1917";
  ctx.fillRect(0, groundY, splitX, 40);

  // Ground grid lines
  ctx.strokeStyle = "#44403c";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(splitX, groundY);
  ctx.stroke();

  for (let gx = 0; gx < splitX; gx += 30) {
    ctx.strokeStyle = "#292524";
    ctx.beginPath();
    ctx.moveTo(gx, groundY);
    ctx.lineTo(gx - 20, height);
    ctx.stroke();
  }

  // Altitude scaling: 0..20m maps to groundY .. groundY - 180px
  const altPx = Math.min(180, (state.altitudeMeters / 15.0) * 160);
  const heliX = splitX * 0.45;
  const heliY = groundY - 30 - altPx;

  // Draw Downwash Flow Particles / Streamlines
  const inducedSpeed = metrics.inducedVelocityMs;
  if (state.rotorRpm > 30) {
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)"; // Cyan air flow
    ctx.lineWidth = 1.5;
    for (let i = -70; i <= 70; i += 20) {
      const startX = heliX + i;
      const startY = heliY - 10;
      const flowLen = Math.min(groundY - startY, 40 + inducedSpeed * 6);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(
        startX + (i * 0.2),
        startY + flowLen * 0.6,
        startX + (i * 0.5),
        startY + flowLen,
      );
      ctx.stroke();
    }
  }

  // Helicopter Body (Fuselage, Mast, Tail Boom)
  ctx.save();
  ctx.translate(heliX, heliY);
  ctx.rotate((state.pitchAngleDeg * Math.PI) / 180.0);

  // Fuselage Truss (VS-300 open tubular steel frame)
  ctx.strokeStyle = "#78716c";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Nose to cabin
  ctx.moveTo(-35, 12);
  ctx.lineTo(-10, -10);
  ctx.lineTo(15, -10);
  ctx.lineTo(25, 5);
  ctx.lineTo(-25, 15);
  ctx.closePath();
  ctx.stroke();

  // Engine block (Franklin 4-cyl)
  ctx.fillStyle = "#57534e";
  ctx.fillRect(-10, -2, 22, 14);

  // Pilot Figure (Igor Sikorsky in Fedora)
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(-20, -5, 5, 0, Math.PI * 2); // Head
  ctx.fill();
  // Fedora hat brim
  ctx.fillStyle = "#334155";
  ctx.fillRect(-26, -9, 12, 2.5);

  // Landing Gear Struts & Wheels
  ctx.strokeStyle = "#57534e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-25, 15);
  ctx.lineTo(-30, 28);
  ctx.moveTo(10, 15);
  ctx.lineTo(15, 28);
  ctx.stroke();

  // Wheels
  ctx.fillStyle = "#292524";
  ctx.beginPath();
  ctx.arc(-30, 28, 4, 0, Math.PI * 2);
  ctx.arc(15, 28, 4, 0, Math.PI * 2);
  ctx.fill();

  // Tail Boom Structure (Steel tube extending aft)
  ctx.strokeStyle = "#a8a29e";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(110, -8);
  ctx.lineTo(112, -22); // Tail pylon
  ctx.stroke();

  // Main Rotor Mast & Swashplate Collar
  ctx.strokeStyle = "#d6d3d1";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(0, -32);
  ctx.stroke();

  // Swashplate Collar
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(-6, -24, 12, 4);

  // Spinning Main Rotor Blades (Flapping & Cyclic Tilt)
  const bladeRadius = 85;
  const rotorTiltRad = (-controls.cyclicPitchForwardDeg * Math.PI) / 180.0;
  ctx.save();
  ctx.translate(0, -32);
  ctx.rotate(rotorTiltRad);

  const phase = state.rotorPhaseRad;
  const blade1X = Math.cos(phase) * bladeRadius;
  const blade2X = Math.cos(phase + (2 * Math.PI) / 3) * bladeRadius;
  const blade3X = Math.cos(phase + (4 * Math.PI) / 3) * bladeRadius;

  ctx.strokeStyle = state.rotorRpm > 50 ? "rgba(251, 191, 36, 0.85)" : "#f59e0b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-blade1X, 0);
  ctx.lineTo(blade1X, 0);
  ctx.stroke();

  // Rotor Hub Center Pin
  ctx.fillStyle = "#ea580c";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Vertical Tail Rotor at Tail Pylon
  ctx.save();
  ctx.translate(112, -22);
  const tailPhase = state.tailRotorPhaseRad;
  const tailSpan = 22;
  const tailY = Math.sin(tailPhase) * tailSpan;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -tailY);
  ctx.lineTo(0, tailY);
  ctx.stroke();
  ctx.fillStyle = "#0284c7";
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore(); // Restore heli transform

  // Labels on Left Panel
  ctx.fillStyle = "#e7e5e4";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("SIDE ELEVATION & VERTICAL DYNAMICS", 14, 22);

  ctx.fillStyle = "#a8a29e";
  ctx.font = "10px system-ui, sans-serif";
  ctx.fillText(`Alt: ${state.altitudeMeters.toFixed(1)}m | Downwash v_i: ${metrics.inducedVelocityMs.toFixed(1)} m/s`, 14, 38);

  ctx.restore();

  // ----------------------------------------------------
  // RIGHT PANEL: TOP PLAN VIEW & TORQUE MOMENT EQUILIBRIUM
  // ----------------------------------------------------
  ctx.save();
  ctx.beginPath();
  ctx.rect(splitX, 0, width - splitX, height);
  ctx.clip();

  const planCenterX = splitX + (width - splitX) * 0.42;
  const planCenterY = height * 0.52;

  ctx.fillStyle = "#e7e5e4";
  ctx.font = "bold 11px system-ui, sans-serif";
  ctx.fillText("PLAN VIEW: TORQUE EQUILIBRIUM", splitX + 16, 22);

  ctx.fillStyle = "#a8a29e";
  ctx.font = "10px system-ui, sans-serif";
  ctx.fillText("Q_main (Counter-Torque) vs T_tail × L_boom", splitX + 16, 38);

  ctx.save();
  ctx.translate(planCenterX, planCenterY);
  ctx.rotate((state.yawAngleDeg * Math.PI) / 180.0);

  // Main Rotor Disk Swept Area (Circle)
  ctx.strokeStyle = "rgba(251, 191, 36, 0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 68, 0, Math.PI * 2);
  ctx.stroke();

  // Fuselage Plan Outline
  ctx.strokeStyle = "#78716c";
  ctx.fillStyle = "#292524";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail Boom Plan (Extending South)
  ctx.strokeStyle = "#a8a29e";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, 14);
  ctx.lineTo(0, 85);
  ctx.stroke();

  // Rotating Main Rotor Blades in Plan View
  const p = state.rotorPhaseRad;
  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2.5;
  for (let b = 0; b < 3; b++) {
    const angle = p + (b * 2 * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(angle) * 68, Math.sin(angle) * 68);
    ctx.stroke();
  }

  // Tail Rotor Hub & Vector (at boom end)
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(6, 85, 3, 0, Math.PI * 2);
  ctx.fill();

  // Tail Anti-Torque Thrust Force Vector Arrow (Points Left/West to counter CCW torque)
  const tailThrustLen = Math.min(50, (metrics.tailRotorThrustNewtons / 500.0) * 40);
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(6, 85);
  ctx.lineTo(6 - tailThrustLen, 85);
  ctx.stroke();

  // Arrowhead
  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.moveTo(6 - tailThrustLen - 4, 85);
  ctx.lineTo(6 - tailThrustLen + 2, 81);
  ctx.lineTo(6 - tailThrustLen + 2, 89);
  ctx.closePath();
  ctx.fill();

  // Main Rotor Torque Reaction Arc (Amber CCW Arrow)
  ctx.strokeStyle = "rgba(245, 158, 11, 0.85)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, 38, -Math.PI * 0.4, Math.PI * 0.5);
  ctx.stroke();

  // Torque Arrowhead
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.moveTo(0, 38);
  ctx.lineTo(-6, 32);
  ctx.lineTo(-6, 44);
  ctx.closePath();
  ctx.fill();

  ctx.restore(); // Restore plan transform

  // Legend & Vector Math Box
  const boxX = splitX + 16;
  const boxY = height - 85;
  ctx.fillStyle = "rgba(28, 25, 23, 0.85)";
  ctx.strokeStyle = "#44403c";
  ctx.lineWidth = 1;
  ctx.fillRect(boxX, boxY, width - splitX - 32, 70);
  ctx.strokeRect(boxX, boxY, width - splitX - 32, 70);

  ctx.font = "10px monospace";
  ctx.fillStyle = "#fbbf24";
  ctx.fillText(`Main Q: ${metrics.mainRotorTorqueNm.toFixed(0)} N·m (CCW reaction)`, boxX + 8, boxY + 18);

  ctx.fillStyle = "#38bdf8";
  ctx.fillText(`Tail T×L: ${(metrics.tailRotorThrustNewtons * 4.8).toFixed(0)} N·m (CW balance)`, boxX + 8, boxY + 36);

  ctx.fillStyle = Math.abs(metrics.netYawMomentNm) < 20 ? "#34d399" : "#f43f5e";
  ctx.fillText(`Net ΔM: ${metrics.netYawMomentNm.toFixed(1)} N·m (${Math.abs(metrics.netYawMomentNm) < 20 ? "STABLE" : "SPINNING"})`, boxX + 8, boxY + 54);

  ctx.restore();
}
