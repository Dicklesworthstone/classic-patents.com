"use client";

import { useId, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { FrankenSimEngine } from "@/physics/engine";
import { readSalisburyRobotHandControls } from "@/physics/salisburyRobotHandKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function SalisburyRobotHandSim({
  patentId = "us-4921293-salisbury-robot-hand",
}: {
  patentId?: string;
}) {
  const { params, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readSalisburyRobotHandControls(params), [params]);
  const tel = useMemo(() => FrankenSimEngine.stepSalisburyRobotHand(controls), [controls]);
  const equations = useMemo(() => ALL_COLORIZED_EQUATIONS[patentId] ?? [], [patentId]);

  const clipId = useId();
  const [viewMode, setViewMode] = useState<"top" | "transmission">("top");
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 680;
  const height = 480;
  const palmCenterX = 340;
  const palmCenterY = 265;

  // Normalized diagram geometry. The source law supplies torque, not historic
  // link lengths or dynamics, so the pose is explicitly a signed teaching map.
  const l1 = 40;
  const l2 = 55;
  const l3 = 50;

  const spread = (tel.displayJointAnglesDeg[0] * Math.PI) / 180;
  const theta2 = (tel.displayJointAnglesDeg[1] * Math.PI) / 180;
  const theta3 = (tel.displayJointAnglesDeg[2] * Math.PI) / 180;

  // Forward kinematics in 2D projection
  // Finger 1 (Upper Left, base angle -60 deg + spread)
  const baseAngle1 = -Math.PI / 2 - 0.5 + spread;
  const f1_baseX = palmCenterX - 60;
  const f1_baseY = palmCenterY - 40;
  const f1_j2X = f1_baseX + l1 * Math.cos(baseAngle1);
  const f1_j2Y = f1_baseY + l1 * Math.sin(baseAngle1);
  const f1_j3X = f1_j2X + l2 * Math.cos(baseAngle1 + theta2 * 0.4);
  const f1_j3Y = f1_j2Y + l2 * Math.sin(baseAngle1 + theta2 * 0.4);
  const f1_tipX = f1_j3X + l3 * Math.cos(baseAngle1 + theta2 * 0.4 + theta3 * 0.5);
  const f1_tipY = f1_j3Y + l3 * Math.sin(baseAngle1 + theta2 * 0.4 + theta3 * 0.5);

  // Finger 2 (Upper Right, base angle -60 deg - spread)
  const baseAngle2 = -Math.PI / 2 + 0.5 - spread;
  const f2_baseX = palmCenterX + 60;
  const f2_baseY = palmCenterY - 40;
  const f2_j2X = f2_baseX + l1 * Math.cos(baseAngle2);
  const f2_j2Y = f2_baseY + l1 * Math.sin(baseAngle2);
  const f2_j3X = f2_j2X + l2 * Math.cos(baseAngle2 - theta2 * 0.4);
  const f2_j3Y = f2_j2Y + l2 * Math.sin(baseAngle2 - theta2 * 0.4);
  const f2_tipX = f2_j3X + l3 * Math.cos(baseAngle2 - theta2 * 0.4 - theta3 * 0.5);
  const f2_tipY = f2_j3Y + l3 * Math.sin(baseAngle2 - theta2 * 0.4 - theta3 * 0.5);

  // Finger 3 / Opposing Thumb (Bottom Center, reaching upward)
  const f3_baseX = palmCenterX;
  const f3_baseY = palmCenterY + 70;
  const f3_j2X = f3_baseX;
  const f3_j2Y = f3_baseY - l1;
  const f3_j3X = f3_j2X;
  const f3_j3Y = f3_j2Y - l2 * Math.cos(theta2 * 0.4);
  const f3_tipX = f3_j3X;
  const f3_tipY = f3_j3Y - l3 * Math.cos(theta2 * 0.4 + theta3 * 0.5);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-700/60 bg-slate-950/90 p-4 text-slate-100 shadow-2xl backdrop-blur">
      {/* Header & Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-base font-semibold tracking-wide text-slate-100">
            Salisbury Hand Source-Law Transmission Studio
          </h3>
          <p className="text-xs text-slate-400">
            US 4,921,293 • connected arm, wrist, palm, and digits • representative digit: four
            tensions → three torques
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-slate-800/80 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("top")}
              className={`rounded px-2.5 py-1 transition ${
                viewMode === "top"
                  ? "bg-emerald-600 font-medium text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Connected assembly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("transmission")}
              className={`rounded px-2.5 py-1 transition ${
                viewMode === "transmission"
                  ? "bg-emerald-600 font-medium text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Figure 3 torque map
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      <div className="relative overflow-hidden rounded-lg border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full select-none"
          style={{ maxHeight: "420px" }}
        >
          <defs>
            <linearGradient id={`palmGrad-${clipId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id={`linkGrad-${clipId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <pattern id={`grid-${clipId}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Blueprint Grid */}
          <rect width={width} height={height} fill={`url(#grid-${clipId})`} />

          {viewMode === "top" && (
            <g>
              {/* Connected source assembly below the hand: wrist 16/18, arm
                  12, cable sleeve 34, and remote drive/control package 35. */}
              <g>
                <rect
                  x={palmCenterX - 48}
                  y={palmCenterY + 78}
                  width="96"
                  height="20"
                  rx="5"
                  fill="#334155"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <line
                  x1={palmCenterX - 54}
                  y1={palmCenterY + 90}
                  x2={palmCenterX + 54}
                  y2={palmCenterY + 90}
                  stroke="#f59e0b"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line
                  x1={palmCenterX}
                  y1={palmCenterY + 85}
                  x2={palmCenterX}
                  y2={palmCenterY + 118}
                  stroke="#fbbf24"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <rect
                  x={palmCenterX - 34}
                  y={palmCenterY + 105}
                  width="68"
                  height="96"
                  rx="8"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <text
                  x={palmCenterX}
                  y={palmCenterY + 137}
                  textAnchor="middle"
                  className="fill-slate-300 font-mono text-[9px]"
                >
                  WRIST 16/18
                </text>
                <text
                  x={palmCenterX}
                  y={palmCenterY + 172}
                  textAnchor="middle"
                  className="fill-slate-400 font-mono text-[9px]"
                >
                  ARM 12
                </text>

                <rect
                  x="476"
                  y={palmCenterY + 126}
                  width="164"
                  height="68"
                  rx="8"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="2"
                />
                <text
                  x="558"
                  y={palmCenterY + 154}
                  textAnchor="middle"
                  className="fill-slate-300 font-mono text-[9px]"
                >
                  ACTUATOR DRIVE
                </text>
                <text
                  x="558"
                  y={palmCenterY + 170}
                  textAnchor="middle"
                  className="fill-slate-400 font-mono text-[9px]"
                >
                  &amp; CONTROL 35
                </text>
                {[0, 1, 2, 3].map((index) => (
                  <path
                    key={`external-cable-${index}`}
                    d={`M 476 ${palmCenterY + 143 + index * 8} C 430 ${palmCenterY + 143 + index * 6}, 408 ${palmCenterY + 174 + index * 3}, ${palmCenterX + 30 - index * 4} ${palmCenterY + 178 + index * 3} C ${palmCenterX + 18 - index * 3} ${palmCenterY + 150}, ${palmCenterX + 14 - index * 5} ${palmCenterY + 112}, ${palmCenterX + 12 - index * 8} ${palmCenterY + 83}`}
                    fill="none"
                    stroke={["#38bdf8", "#34d399", "#fbbf24", "#fb7185"][index]}
                    strokeWidth="2"
                  />
                ))}
                <text
                  x="425"
                  y={palmCenterY + 201}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[8px]"
                >
                  CABLE SLEEVE 34
                </text>
              </g>

              {/* Palm Base Chassis */}
              <path
                d={`M ${palmCenterX - 100} ${palmCenterY - 30} 
                    Q ${palmCenterX} ${palmCenterY - 50} ${palmCenterX + 100} ${palmCenterY - 30}
                    L ${palmCenterX + 85} ${palmCenterY + 90}
                    Q ${palmCenterX} ${palmCenterY + 110} ${palmCenterX - 85} ${palmCenterY + 90} Z`}
                fill={`url(#palmGrad-${clipId})`}
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x={palmCenterX}
                y={palmCenterY + 45}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[10px] tracking-wider"
              >
                20 PALM · 24 TERMINAL MEMBER
              </text>

              {/* Finger 1 (Left) */}
              <g>
                <line
                  x1={f1_baseX}
                  y1={f1_baseY}
                  x2={f1_j2X}
                  y2={f1_j2Y}
                  stroke="#94a3b8"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <line
                  x1={f1_j2X}
                  y1={f1_j2Y}
                  x2={f1_j3X}
                  y2={f1_j3Y}
                  stroke="#cbd5e1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1={f1_j3X}
                  y1={f1_j3Y}
                  x2={f1_tipX}
                  y2={f1_tipY}
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Joints */}
                <circle
                  cx={f1_baseX}
                  cy={f1_baseY}
                  r="7"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f1_j2X}
                  cy={f1_j2Y}
                  r="6"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f1_j3X}
                  cy={f1_j3Y}
                  r="5"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                {/* Spherical Elastomer Fingertip */}
                <circle
                  cx={f1_tipX}
                  cy={f1_tipY}
                  r="9"
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              </g>

              {/* Finger 2 (Right) */}
              <g>
                <line
                  x1={f2_baseX}
                  y1={f2_baseY}
                  x2={f2_j2X}
                  y2={f2_j2Y}
                  stroke="#94a3b8"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <line
                  x1={f2_j2X}
                  y1={f2_j2Y}
                  x2={f2_j3X}
                  y2={f2_j3Y}
                  stroke="#cbd5e1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1={f2_j3X}
                  y1={f2_j3Y}
                  x2={f2_tipX}
                  y2={f2_tipY}
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Joints */}
                <circle
                  cx={f2_baseX}
                  cy={f2_baseY}
                  r="7"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f2_j2X}
                  cy={f2_j2Y}
                  r="6"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f2_j3X}
                  cy={f2_j3Y}
                  r="5"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                {/* Spherical Elastomer Fingertip */}
                <circle
                  cx={f2_tipX}
                  cy={f2_tipY}
                  r="9"
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              </g>

              {/* Finger 3 (Thumb / Opposing Base) */}
              <g>
                <line
                  x1={f3_baseX}
                  y1={f3_baseY}
                  x2={f3_j2X}
                  y2={f3_j2Y}
                  stroke="#94a3b8"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <line
                  x1={f3_j2X}
                  y1={f3_j2Y}
                  x2={f3_j3X}
                  y2={f3_j3Y}
                  stroke="#cbd5e1"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <line
                  x1={f3_j3X}
                  y1={f3_j3Y}
                  x2={f3_tipX}
                  y2={f3_tipY}
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                {/* Joints */}
                <circle
                  cx={f3_baseX}
                  cy={f3_baseY}
                  r="7"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f3_j2X}
                  cy={f3_j2Y}
                  r="6"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                <circle
                  cx={f3_j3X}
                  cy={f3_j3Y}
                  r="5"
                  fill="#0f766e"
                  stroke="#2dd4bf"
                  strokeWidth="1.5"
                />
                {/* Spherical Elastomer Fingertip */}
                <circle
                  cx={f3_tipX}
                  cy={f3_tipY}
                  r="9"
                  fill="#f59e0b"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              </g>

              {/* Status Overlay HUD */}
              <g transform="translate(16, 20)">
                <rect
                  width="210"
                  height="95"
                  rx="6"
                  fill="rgba(15, 23, 42, 0.85)"
                  stroke="#334155"
                />
                <text x="12" y="20" className="fill-slate-200 font-mono text-[11px] font-semibold">
                  SOURCE-LAW RECEIPT
                </text>
                <text x="12" y="38" className="fill-emerald-400 font-mono text-xs font-bold">
                  {tel.provenance === "TS_SOURCE_LAW" ? "● PRINTED TORQUE MAP" : "○ REFUSED"}
                </text>
                <text x="12" y="56" className="fill-slate-300 font-mono text-[10px]">
                  Pattern: {tel.pullPattern}
                </text>
                <text x="12" y="72" className="fill-slate-300 font-mono text-[10px]">
                  9 revolute joints · 12 cable ends
                </text>
                <text x="12" y="88" className="fill-slate-300 font-mono text-[10px]">
                  Dynamics/contact: source does not supply them
                </text>
              </g>
            </g>
          )}

          {viewMode === "transmission" && (
            <g transform="translate(40, 30)">
              {/* N+1 Routing Diagram */}
              <text x="280" y="20" textAnchor="middle" className="fill-slate-100 font-bold text-sm">
                FIG. 3: FOUR CABLE TENSIONS → THREE JOINT TORQUES
              </text>

              {/* Tendon Tension Readout Bars */}
              {tel.tendonTensionsN.map((tension, i) => {
                const barWidth = Math.min(260, (tension / 40) * 260);
                const yPos = 60 + i * 55;
                const colors = ["#38bdf8", "#34d399", "#fbbf24", "#f87171"];
                return (
                  <g key={`cable-${i}`}>
                    <text
                      x="20"
                      y={yPos + 14}
                      className="fill-slate-300 font-mono text-xs font-semibold"
                    >
                      Cable {i + 1} (T{i + 1}):
                    </text>
                    <rect
                      x="130"
                      y={yPos}
                      width="260"
                      height="18"
                      rx="3"
                      fill="#1e293b"
                      stroke="#334155"
                    />
                    <rect x="130" y={yPos} width={barWidth} height="18" rx="3" fill={colors[i]} />
                    <text
                      x="405"
                      y={yPos + 14}
                      className="fill-slate-100 font-mono text-xs font-bold"
                    >
                      {tension.toFixed(1)} N
                    </text>
                    <text x="470" y={yPos + 14} className="fill-slate-400 font-mono text-[10px]">
                      {i === 0
                        ? "T₁: Axis 1 and Axis 2 moment"
                        : i === 1
                          ? "T₂: all three printed equations"
                          : i === 2
                            ? "T₃: all three printed equations"
                            : "T₄: Axis 1 and Axis 2 moment"}
                    </text>
                  </g>
                );
              })}

              {/* Joint Torques Generated Matrix τ = R · T */}
              <g transform="translate(20, 290)">
                <rect width="560" height="70" rx="6" fill="#0f172a" stroke="#334155" />
                <text x="16" y="24" className="fill-emerald-400 font-mono text-xs font-bold">
                  PRINTED FIGURE 3 TORQUE VECTOR (NOT A DYNAMIC POSE)
                </text>
                <text x="16" y="48" className="fill-slate-200 font-mono text-xs">
                  τ₁ (Yaw):{" "}
                  <span className="font-bold text-sky-400">
                    {tel.jointTorquesNm[0].toFixed(3)} N·m
                  </span>{" "}
                  | τ₂ (Proximal):{" "}
                  <span className="font-bold text-emerald-400">
                    {tel.jointTorquesNm[1].toFixed(3)} N·m
                  </span>{" "}
                  | τ₃ (Distal):{" "}
                  <span className="font-bold text-amber-400">
                    {tel.jointTorquesNm[2].toFixed(3)} N·m
                  </span>
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Refusal Warnings Banner */}
        {tel.refusalReason && (
          <div className="absolute bottom-2 left-2 right-2 rounded border border-rose-500/50 bg-rose-950/90 p-2 text-xs font-mono text-rose-200">
            ⚠️ {tel.refusalReason}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs leading-relaxed text-amber-100/90">
        The moving pose is a normalized diagram of one digit’s signed torque output, mirrored across
        the three connected digits for comparison. The physical hand has twelve separately routed
        cable ends. The grant supplies the cable topology and three static equations, but not
        dimensions, inertia, damping, contact properties, grasp force, force closure, speed, or
        stability.
      </div>

      {/* Physics Sliders Controls Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₁</span>
            <span className="font-mono text-sky-400">{controls.tensionT1N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT1N}
            onChange={(e) => updateParam("tensionT1N", Number.parseFloat(e.target.value))}
            className="accent-sky-500"
          />
          <span className="text-[10px] text-slate-500">
            Signed moment at Axes 1 and 2 through R₁/R₃
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₂</span>
            <span className="font-mono text-emerald-400">{controls.tensionT2N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT2N}
            onChange={(e) => updateParam("tensionT2N", Number.parseFloat(e.target.value))}
            className="accent-emerald-500"
          />
          <span className="text-[10px] text-slate-500">
            Contributes to all three source equations
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₃</span>
            <span className="font-mono text-amber-400">{controls.tensionT3N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT3N}
            onChange={(e) => updateParam("tensionT3N", Number.parseFloat(e.target.value))}
            className="accent-amber-500"
          />
          <span className="text-[10px] text-slate-500">Opposes T₂ at the tip idler and Axis 2</span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Cable tension T₄</span>
            <span className="font-mono text-rose-400">{controls.tensionT4N.toFixed(1)} N</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            step="1"
            value={controls.tensionT4N}
            onChange={(e) => updateParam("tensionT4N", Number.parseFloat(e.target.value))}
            className="accent-rose-500"
          />
          <span className="text-[10px] text-slate-500">
            Opposes T₁ through the Axis-2 drive pulley
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Illustrative R₂ scale</span>
            <span className="font-mono text-cyan-400">{controls.radiusScaleMm} mm</span>
          </div>
          <input
            type="range"
            min="4"
            max="20"
            step="1"
            value={controls.radiusScaleMm}
            onChange={(e) => updateParam("radiusScaleMm", Number.parseFloat(e.target.value))}
            className="accent-cyan-500"
          />
          <span className="text-[10px] text-slate-500">
            Visitor input; not a historic dimension
          </span>
        </div>

        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-300">Claim 2 first idler</span>
            <span className="font-mono text-orange-400">
              {controls.firstIdlerFixed ? "fixed" : "free"}
            </span>
          </div>
          <input
            type="checkbox"
            checked={controls.firstIdlerFixed}
            onChange={(e) => updateParam("firstIdlerFixed", e.target.checked ? 1 : 0)}
            className="h-5 w-5 accent-orange-500"
          />
          <span className="text-[10px] text-slate-500">
            Claim predicate only; torque law remains separate
          </span>
        </div>
      </div>

      {/* Embedded Physics Telemetry Live HUD */}
      <PhysicsTelemetryBadge patentId={patentId} equations={equations} />
    </div>
  );
}
