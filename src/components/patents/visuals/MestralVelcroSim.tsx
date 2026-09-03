"use client";

import { useId, useMemo, useState } from "react";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  type MestralVelcroControls,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "@/physics/mestralVelcroKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "./PortHamiltonianEnergyStrip";

interface MestralVelcroSimProps {
  initialControls?: Partial<MestralVelcroControls>;
  className?: string;
}

export function MestralVelcroSim({ initialControls = {}, className = "" }: MestralVelcroSimProps) {
  const { effectiveParams, claimStates, updateParam } = usePatentPhysics(
    "us-2717437-mestral-velcro",
  );
  const controls = useMemo(
    () =>
      readMestralVelcroControls({
        ...(initialControls as Record<string, number>),
        ...effectiveParams,
      }),
    [effectiveParams, initialControls],
  );
  const [viewMode, setViewMode] = useState<"loom" | "peel" | "single-hook">("peel");

  const clipId = useId();
  const tel = stepMestralVelcroSi(controls);

  const updateControl = (key: keyof MestralVelcroControls, val: number) => {
    updateParam(key, val);
  };

  return (
    <div
      className={`flex flex-col bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-2xl ${className}`}
    >
      {/* Top Header & View Selector */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3.5 bg-stone-950/80 border-b border-stone-800 text-stone-200">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60">
            US 2,717,437
          </span>
          <h3 className="text-sm font-semibold tracking-wide text-stone-100">
            De Mestral Hook-and-Loop Fastener (Velcro) Simulator
          </h3>
        </div>

        <div className="flex items-center space-x-1.5 p-1 bg-stone-900 rounded-lg border border-stone-800">
          <button
            type="button"
            onClick={() => setViewMode("peel")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "peel"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Peeling Anisotropy (Fig. 2)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("loom")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "loom"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Heated Lancet Loom (Fig. 1)
          </button>
          <button
            type="button"
            onClick={() => setViewMode("single-hook")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "single-hook"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Hook Cantilever Beam FEA
          </button>
        </div>
      </div>

      {/* Main SVG Visualization Canvas */}
      <div className="relative w-full h-[380px] bg-stone-950 flex items-center justify-center p-4 select-none">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-full max-w-4xl drop-shadow-md"
          role="img"
          aria-label="Interactive De Mestral Velcro mechanical simulation diagram"
        >
          <defs>
            <linearGradient id={`nylon-grad-${clipId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id={`lancet-heat-${clipId}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={controls.heatSettingTempC > 140 ? "#ef4444" : "#f97316"}
                stopOpacity="0.85"
              />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>
            <filter id={`glow-${clipId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND GRID */}
          <g stroke="#292524" strokeWidth="1" strokeDasharray="4,4">
            <line x1="0" y1="100" x2="800" y2="100" />
            <line x1="0" y1="200" x2="800" y2="200" />
            <line x1="0" y1="300" x2="800" y2="300" />
            <line x1="200" y1="0" x2="200" y2="400" />
            <line x1="400" y1="0" x2="400" y2="400" />
            <line x1="600" y1="0" x2="600" y2="400" />
          </g>

          {/* VIEW MODE 1: PEELING ANISOTROPY & INTERLOCKING ARRAY */}
          {viewMode === "peel" && (
            <g>
              {/* Lower Foundation Tape (Fixed Substrate) */}
              <rect
                x="60"
                y="270"
                width="680"
                height="24"
                rx="4"
                fill="#3f3f46"
                stroke="#52525b"
                strokeWidth="2"
              />
              <text
                x="75"
                y="286"
                fill="#a1a1aa"
                fontSize="11"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                LOWER FOUNDATION TAPE (1-inch width)
              </text>

              {/* Lower Hooks & Loops Array */}
              {Array.from({ length: 18 }).map((_, i) => {
                const x = 90 + i * 36;
                const isPeelingZone = x > 380 && x < 540;
                const _isDisengaged = x >= 540;
                const hookBend = isPeelingZone ? (x - 380) * 0.08 : 0;

                return (
                  <g key={`lower-hook-${i}`} transform={`translate(${x}, 270)`}>
                    {/* Straight standing strand 10 */}
                    <line
                      x1="-5"
                      y1="0"
                      x2="-5"
                      y2="-38"
                      stroke="#78716c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Upright hook 9 with curved apex 4 */}
                    <path
                      d={`M 5,0 L 5,-45 Q ${5 - hookBend * 10},-60 ${-10 + hookBend * 12},-50`}
                      fill="none"
                      stroke={isPeelingZone ? "#f59e0b" : "#fbbf24"}
                      strokeWidth={controls.filamentDiameterMm * 14}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* Upper Foundation Tape (Peeling Flap) */}
              {(() => {
                const peelAngleRad = (controls.peelAngleDeg * Math.PI) / 180;
                const peelStartX = 90 + tel.peelProgress * 550;
                const flapLength = 260;
                const flapEndX = peelStartX + flapLength * Math.cos(Math.PI - peelAngleRad);
                const flapEndY = 220 - flapLength * Math.sin(peelAngleRad);

                return (
                  <g>
                    {/* Engaged Flat Section of Upper Tape */}
                    <path
                      d={`M 60,220 L ${peelStartX},220 Q ${peelStartX + 20},220 ${peelStartX + 40 * Math.cos(Math.PI - peelAngleRad * 0.5)},${220 - 40 * Math.sin(peelAngleRad * 0.5)} L ${flapEndX},${flapEndY}`}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />

                    {/* Opposing Meshed Hooks on Engaged Section */}
                    {Array.from({ length: 14 }).map((_, j) => {
                      const ux = 90 + j * 36;
                      if (ux >= peelStartX - 15) return null;
                      return (
                        <g key={`upper-hook-${j}`} transform={`translate(${ux}, 220)`}>
                          {/* Downward pointing hooks */}
                          <path
                            d="M 0,0 L 0,40 Q 0,55 12,46"
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth={controls.filamentDiameterMm * 14}
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    })}

                    {/* Peeling Tensile Pull Vector */}
                    <g transform={`translate(${flapEndX}, ${flapEndY})`}>
                      <line
                        x1="0"
                        y1="0"
                        x2={-50 * Math.cos(peelAngleRad)}
                        y2={-50 * Math.sin(peelAngleRad)}
                        stroke="#ef4444"
                        strokeWidth="3"
                        markerEnd="url(#arrow)"
                      />
                      <circle cx="0" cy="0" r="5" fill="#ef4444" />
                      <text
                        x={-60 * Math.cos(peelAngleRad)}
                        y={-60 * Math.sin(peelAngleRad)}
                        fill="#f87171"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        F_peel = {tel.totalPeelForceN.toFixed(2)} N ({controls.peelAngleDeg}°)
                      </text>
                    </g>

                    {/* Peel Crack Tip Stress Concentration Indicator */}
                    <circle
                      cx={peelStartX}
                      cy="245"
                      r="16"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                    />
                    <text
                      x={peelStartX}
                      y="210"
                      fill="#fbbf24"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      Peel Front (w·Gc)
                    </text>
                  </g>
                );
              })()}

              {/* Shear Vector Annotation */}
              <g transform="translate(180, 160)">
                <rect
                  x="-10"
                  y="-14"
                  width="220"
                  height="28"
                  rx="6"
                  fill="#1c1917"
                  stroke="#44403c"
                />
                <text
                  x="0"
                  y="4"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  In-Plane Shear: {tel.maxShearCapacity5cm2N.toFixed(1)} N (
                  {tel.forceAnisotropyRatio.toFixed(1)}x vs Peel)
                </text>
              </g>
            </g>
          )}

          {/* VIEW MODE 2: HEATED LANCET BAR & BAR LOOM (FIG. 1) */}
          {viewMode === "loom" && (
            <g transform="translate(80, 50)">
              {/* Foundation Weft Threads 1 (cross-section circles) */}
              {Array.from({ length: 12 }).map((_, k) => (
                <circle
                  key={`weft-${k}`}
                  cx={k * 50}
                  cy="260"
                  r="7"
                  fill="#78716c"
                  stroke="#d6d3d1"
                  strokeWidth="2"
                />
              ))}

              {/* Foundation Warp Threads 2 (interlacing wave) */}
              <path
                d="M -20,250 C 10,240 40,280 70,250 C 100,240 130,280 160,250 C 190,240 220,280 250,250 C 280,240 310,280 340,250 C 370,240 400,280 430,250 C 460,240 490,280 520,250 C 550,240 580,280 600,250"
                fill="none"
                stroke="#a8a29e"
                strokeWidth="4"
              />

              {/* Heated Metallic Lancet Bar 5 */}
              <g transform="translate(420, 110)">
                <rect
                  x="0"
                  y="0"
                  width="36"
                  height="145"
                  rx="6"
                  fill={`url(#lancet-heat-${clipId})`}
                  stroke="#ef4444"
                  strokeWidth="2"
                  filter={`url(#glow-${clipId})`}
                />
                {/* Guide Groove 7 */}
                <line x1="26" y1="10" x2="26" y2="135" stroke="#1c1917" strokeWidth="4" />
                <text
                  x="18"
                  y="75"
                  fill="#fef08a"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  5 ({controls.heatSettingTempC}°C)
                </text>
              </g>

              {/* Loop 6 Formed Over Lancet Bar */}
              <path
                d="M 405,255 L 405,120 Q 438,70 470,120 L 470,255"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Traveling Knife Blade 8 Slitting Loop */}
              <g transform="translate(450, 75)">
                <polygon
                  points="0,0 20,-35 28,-30 8,5"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                <text
                  x="35"
                  y="-15"
                  fill="#f87171"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Blade 8
                </text>
              </g>

              {/* Pre-Cut Heat-Set Hook 9 & Lost Strand 10 */}
              <g transform="translate(180, 255)">
                <line
                  x1="20"
                  y1="0"
                  x2="20"
                  y2="-90"
                  stroke="#78716c"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="28" y="-45" fill="#a8a29e" fontSize="11" fontFamily="monospace">
                  10
                </text>
                <path
                  d="M -15,0 L -15,-120 Q -15,-155 -38,-130"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <text
                  x="-48"
                  y="-140"
                  fill="#fef08a"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  Hook 4
                </text>
              </g>

              {/* Annotation Labels */}
              <text x="0" y="295" fill="#a8a29e" fontSize="11" fontFamily="sans-serif">
                Weft 1 / Warp 2 (Ground Weave)
              </text>
              <text x="370" y="295" fill="#f59e0b" fontSize="11" fontFamily="sans-serif">
                Thermic Annealing Zone (ϕ_set = {(tel.thermalRetentionFraction * 100).toFixed(0)}%)
              </text>
            </g>
          )}

          {/* VIEW MODE 3: SINGLE HOOK CANTILEVER BEAM FEA */}
          {viewMode === "single-hook" && (
            <g transform="translate(250, 40)">
              {/* Foundation Ground Anchor */}
              <rect
                x="-60"
                y="280"
                width="220"
                height="30"
                rx="4"
                fill="#3f3f46"
                stroke="#71717a"
                strokeWidth="2"
              />
              <text
                x="50"
                y="300"
                fill="#d4d4d8"
                fontSize="11"
                fontFamily="monospace"
                textAnchor="middle"
              >
                Foundation Anchorage (&gt;15 N)
              </text>

              {/* Magnified Hook Profile with Live Deflection */}
              {(() => {
                const defl = (tel.hookDeflectionMm / 1000) * 120; // scaled visual px
                return (
                  <g>
                    {/* Neutral Unloaded Curve (dashed) */}
                    <path
                      d="M 0,280 L 0,100 Q 0,10 65,40"
                      fill="none"
                      stroke="#52525b"
                      strokeWidth="3"
                      strokeDasharray="4,4"
                    />

                    {/* Loaded Deflected Hook Beam */}
                    <path
                      d={`M 0,280 L 0,100 Q 0,10 ${65 + defl},${40 - defl * 0.4}`}
                      fill="none"
                      stroke={defl > 15 ? "#ef4444" : "#f59e0b"}
                      strokeWidth={controls.filamentDiameterMm * 40}
                      strokeLinecap="round"
                    />

                    {/* Tip Force Vector */}
                    <g transform={`translate(${65 + defl}, ${40 - defl * 0.4})`}>
                      <line x1="0" y1="0" x2="60" y2="-30" stroke="#38bdf8" strokeWidth="3" />
                      <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                      <text
                        x="70"
                        y="-35"
                        fill="#7dd3fc"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        F = {(tel.singleHookReleaseForceN * 1000).toFixed(1)} mN
                      </text>
                    </g>

                    {/* Deflection Dimension Arc */}
                    <text x="35" y="160" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                      δ = {tel.hookDeflectionMm.toFixed(2)} mm
                    </text>
                    <text x="35" y="180" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                      k_hook = {tel.singleHookSpringRateN_M.toFixed(1)} N/m
                    </text>
                    <text x="35" y="200" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                      EI = {(tel.flexuralRigidityN_M2 * 1e6).toFixed(3)} μN·m²
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Floating Live Telemetry Badge Overlay */}
        <div className="absolute top-4 right-4 bg-stone-950/90 border border-stone-800 backdrop-blur-md px-3 py-2.5 rounded-lg shadow-lg text-xs font-mono text-stone-300 space-y-1">
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Shear Capacity:</span>
            <span className="text-emerald-400 font-semibold">
              {tel.shearStressCapacityN_Cm2.toFixed(1)} N/cm²
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Peel Force (1-in):</span>
            <span className="text-amber-400 font-semibold">{tel.totalPeelForceN.toFixed(2)} N</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Anisotropy Ratio:</span>
            <span className="text-purple-400 font-bold">
              {tel.forceAnisotropyRatio.toFixed(1)}x
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Thermal Memory:</span>
            <span className="text-cyan-400 font-semibold">
              {(tel.thermalRetentionFraction * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Parameter Control Sliders */}
      <div className="p-5 bg-stone-950 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Filament Diameter */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Nylon Monofilament d</span>
            <span className="font-mono text-amber-400">
              {controls.filamentDiameterMm.toFixed(2)} mm
            </span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.35"
            step="0.01"
            value={controls.filamentDiameterMm}
            onChange={(e) => updateControl("filamentDiameterMm", parseFloat(e.target.value))}
            className="accent-amber-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Lancet Bar Temperature */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Lancet Heat Temp (Fig. 1)</span>
            <span className="font-mono text-red-400">{controls.heatSettingTempC}°C</span>
          </div>
          <input
            type="range"
            min="100"
            max="200"
            step="5"
            value={controls.heatSettingTempC}
            onChange={(e) => updateControl("heatSettingTempC", parseInt(e.target.value, 10))}
            className="accent-red-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Peeling Angle */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Peeling Angle θ (Fig. 2)</span>
            <span className="font-mono text-blue-400">{controls.peelAngleDeg}°</span>
          </div>
          <input
            type="range"
            min="20"
            max="160"
            step="5"
            value={controls.peelAngleDeg}
            onChange={(e) => updateControl("peelAngleDeg", parseInt(e.target.value, 10))}
            className="accent-blue-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Hook Density */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex justify-between text-stone-300 font-medium">
            <span>Hook Density</span>
            <span className="font-mono text-emerald-400">{controls.hookDensityPerCm2} cm⁻²</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            step="4"
            value={controls.hookDensityPerCm2}
            onChange={(e) => updateControl("hookDensityPerCm2", parseInt(e.target.value, 10))}
            className="accent-emerald-500 bg-stone-800 h-1.5 rounded-lg cursor-pointer"
          />
        </div>

        {/* Interactive Peel Progress in Peel View */}
        {viewMode === "peel" && (
          <div className="flex flex-col space-y-1.5 md:col-span-2 lg:col-span-4 pt-2 border-t border-stone-800/60">
            <div className="flex justify-between text-stone-300 font-medium">
              <span>Interactive Peeling Separation Front</span>
              <span className="font-mono text-cyan-400">
                {(tel.peelProgress * 100).toFixed(0)}% Separated
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.95"
              step="0.01"
              value={controls.peelProgress}
              onChange={(e) => updateControl("peelProgress", parseFloat(e.target.value))}
              className="accent-cyan-500 bg-stone-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Claim Constraints & Energy Ledger */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col space-y-3">
        <ClaimConstraintToggle
          patentId="us-2717437-mestral-velcro"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
        <PortHamiltonianEnergyStrip
          patentId="us-2717437-mestral-velcro"
          params={controls as unknown as Record<string, number>}
        />
      </div>
    </div>
  );
}
export default MestralVelcroSim;
