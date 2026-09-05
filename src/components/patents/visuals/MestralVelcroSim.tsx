"use client";

import { useId, useMemo, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  type MestralVelcroControls,
  readMestralVelcroControls,
  stepMestralVelcroSi,
} from "@/physics/mestralVelcroKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

interface MestralVelcroSimProps {
  initialControls?: Partial<MestralVelcroControls>;
  className?: string;
}

const EMPTY_MESTRAL_VELCRO_CONTROLS: Partial<MestralVelcroControls> = {};

export function MestralVelcroSim({
  initialControls = EMPTY_MESTRAL_VELCRO_CONTROLS,
  className = "",
}: MestralVelcroSimProps) {
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
  const peelFrontX = 90 + tel.peelProgress * 550;

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
            De Mestral Hook-Pile Fabric Source Reader
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
            Hook Interengagement (Fig. 2)
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
            Filament Geometry Lens
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
                stopColor={tel.thermalSettingPresent ? "#ef4444" : "#57534e"}
                stopOpacity="0.85"
              />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>
            <filter id={`glow-${clipId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <marker
              id={`traction-arrow-${clipId}`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
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
                LOWER HOOK-PILE FABRIC · FIXED DISPLAY BOUNDARY
              </text>

              {/* Lower hook strands 9 and straight cut strands 10 */}
              {Array.from({ length: 6 + tel.visiblePileRows * 3 }).map((_, i, hooks) => {
                const x = 90 + (i * 620) / Math.max(1, hooks.length - 1);
                const isPeelingZone = x > peelFrontX - 60 && x < peelFrontX + 60;
                const hookBend = isPeelingZone ? (x - (peelFrontX - 60)) * 0.08 : 0;

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
                      d={
                        tel.hookInterengagementAvailable
                          ? `M 5,0 L 5,-45 Q ${5 - hookBend * 10},-60 ${-10 + hookBend * 12},-50`
                          : "M 5,0 L 5,-48"
                      }
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
                const peelStartX = peelFrontX;
                const flapLength = 260;
                const flapEndX = peelStartX + flapLength * Math.cos(peelAngleRad);
                const flapEndY = 220 - flapLength * Math.sin(peelAngleRad);

                return (
                  <g>
                    {/* Engaged Flat Section of Upper Tape */}
                    <path
                      d={`M 60,220 L ${peelStartX},220 Q ${peelStartX + 20},220 ${peelStartX + 40 * Math.cos(peelAngleRad * 0.5)},${220 - 40 * Math.sin(peelAngleRad * 0.5)} L ${flapEndX},${flapEndY}`}
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />

                    {/* Opposing Meshed Hooks on Engaged Section */}
                    {Array.from({ length: 6 + tel.visiblePileRows * 3 }).map((_, j, hooks) => {
                      const ux = 90 + (j * 620) / Math.max(1, hooks.length - 1);
                      if (ux >= peelStartX - 15) return null;
                      return (
                        <g key={`upper-hook-${j}`} transform={`translate(${ux}, 220)`}>
                          {/* Downward pointing hooks */}
                          <path
                            d={
                              tel.hookInterengagementAvailable
                                ? "M 0,0 L 0,40 Q 0,55 12,46"
                                : "M 0,0 L 0,46"
                            }
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth={controls.filamentDiameterMm * 14}
                            strokeLinecap="round"
                          />
                        </g>
                      );
                    })}

                    {/* External traction direction. No force magnitude is inferred. */}
                    <g transform={`translate(${flapEndX}, ${flapEndY})`}>
                      <line
                        x1="0"
                        y1="0"
                        x2={50 * Math.cos(peelAngleRad)}
                        y2={-50 * Math.sin(peelAngleRad)}
                        stroke="#ef4444"
                        strokeWidth="3"
                        markerEnd={`url(#traction-arrow-${clipId})`}
                      />
                      <circle cx="0" cy="0" r="5" fill="#ef4444" />
                      <text
                        x={60 * Math.cos(peelAngleRad)}
                        y={-60 * Math.sin(peelAngleRad)}
                        fill="#f87171"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        EXTERNAL CLAMP DIRECTION · {controls.peelAngleDeg}°
                      </text>
                    </g>

                    {/* Kernel-owned normalized separation front */}
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
                      NORMALIZED PEEL FRONT
                    </text>
                  </g>
                );
              })()}

              {/* Source Figure 2 topology annotation */}
              <g transform="translate(180, 160)">
                <rect
                  x="-10"
                  y="-14"
                  width="330"
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
                  SOURCE FIG. 2 · TWO HOOK FACES · UPPER TURNED 90°
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
                  HEATED BAR 5
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
                  d={
                    tel.hookInterengagementAvailable
                      ? "M -15,0 L -15,-120 Q -15,-155 -38,-130"
                      : "M -15,0 L -15,-145"
                  }
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
                  {tel.hookInterengagementAvailable ? "Hook 4" : "Straight pile"}
                </text>
              </g>

              {/* Annotation Labels */}
              <text x="0" y="295" fill="#a8a29e" fontSize="11" fontFamily="sans-serif">
                Weft 1 / Warp 2 (Ground Weave)
              </text>
              <text x="370" y="295" fill="#f59e0b" fontSize="11" fontFamily="sans-serif">
                HEAT-BEFORE-CUTTING TOPOLOGY · NO TEMPERATURE PRINTED
              </text>
            </g>
          )}

          {/* VIEW MODE 3: EXACT SECTION GEOMETRY, WITHOUT INVENTED MATERIAL DATA */}
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
                FOUNDATION WEAVE · ATTACHED ROOT
              </text>

              {/* Magnified source hook profile with reader-selected geometry */}
              {(() => {
                const heightScale = controls.hookLengthMm / 1.8;
                return (
                  <g>
                    {/* Selected hook shape. No uncalibrated load deformation. */}
                    <path
                      d={`M 0,280 L 0,${280 - 180 * heightScale} Q 0,${280 - 270 * heightScale} ${65 * heightScale},${280 - 240 * heightScale}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth={controls.filamentDiameterMm * 40}
                      strokeLinecap="round"
                    />
                    <text x="90" y="130" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                      illustrative d = {controls.filamentDiameterMm.toFixed(2)} mm
                    </text>
                    <text x="90" y="150" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                      illustrative L = {controls.hookLengthMm.toFixed(1)} mm
                    </text>
                    <text x="90" y="170" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                      I = {tel.circularSectionSecondMomentM4.toExponential(2)} m⁴
                    </text>
                    <text x="90" y="190" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                      relative d⁴/L³ index = {tel.relativeBendingGeometryIndex.toFixed(2)}×
                    </text>
                    <text x="90" y="225" fill="#fb7185" fontSize="11" fontFamily="monospace">
                      FORCE REFUSED · E AND CONTACT LAW ABSENT
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
            <span className="text-stone-400">Source faces:</span>
            <span className="text-emerald-400 font-semibold">
              {tel.hookInterengagementAvailable ? "2 hook piles" : "straight-pile comparison"}
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Face rotation:</span>
            <span className="text-amber-400 font-semibold">90°</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Display rows:</span>
            <span className="text-purple-400 font-bold">{tel.visiblePileRows}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span className="text-stone-400">Forces / energy:</span>
            <span className="text-rose-400 font-semibold">refused</span>
          </div>
        </div>
      </div>

      {/* Interactive Parameter Control Sliders */}
      <div className="p-5 bg-stone-950 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <SensitivitySlider
          id="velcroFilamentDiameter"
          patentId="us-2717437-mestral-velcro"
          paramKey="filamentDiameterMm"
          label="Illustrative Filament d"
          value={controls.filamentDiameterMm}
          min={0.1}
          max={0.35}
          step={0.01}
          unit=" mm"
          onChange={(val: number) => updateControl("filamentDiameterMm", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcroHookLength"
          patentId="us-2717437-mestral-velcro"
          paramKey="hookLengthMm"
          label="Illustrative Hook Height"
          value={controls.hookLengthMm}
          min={1.0}
          max={3.0}
          step={0.1}
          unit=" mm"
          onChange={(val: number) => updateControl("hookLengthMm", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcroPeelAngle"
          patentId="us-2717437-mestral-velcro"
          paramKey="peelAngleDeg"
          label="Applied Clamp Direction"
          value={controls.peelAngleDeg}
          min={20}
          max={160}
          step={5}
          unit="°"
          onChange={(val: number) => updateControl("peelAngleDeg", val)}
          allParams={effectiveParams}
        />

        <SensitivitySlider
          id="velcroHookDensity"
          patentId="us-2717437-mestral-velcro"
          paramKey="hookDensityPerCm2"
          label="Illustrative Pile Population"
          value={controls.hookDensityPerCm2}
          min={20}
          max={120}
          step={4}
          unit=" cm⁻²"
          onChange={(val: number) => updateControl("hookDensityPerCm2", val)}
          allParams={effectiveParams}
        />

        {/* Interactive Peel Progress in Peel View */}
        {viewMode === "peel" && (
          <div className="md:col-span-2 lg:col-span-4 pt-2 border-t border-stone-800/60">
            <SensitivitySlider
              id="velcroPeelProgress"
              patentId="us-2717437-mestral-velcro"
              paramKey="peelProgress"
              label="Interactive Peeling Separation Front"
              value={controls.peelProgress}
              min={0.05}
              max={0.95}
              step={0.01}
              unit=""
              onChange={(val: number) => updateControl("peelProgress", val)}
              allParams={effectiveParams}
            />
          </div>
        )}
      </div>

      <div className="border-t border-amber-900/60 bg-amber-950/25 px-4 py-3 text-xs leading-relaxed text-amber-100">
        <strong>Source boundary:</strong> The facsimile supplies topology but not the material,
        contact, dimensional, or test data required for shear capacity, peel force, thermal
        retention, power, or a closed energy balance.
      </div>

      {/* Claim Constraints */}
      <div className="p-4 bg-stone-950 border-t border-stone-800 flex flex-col space-y-3">
        <ClaimConstraintToggle
          patentId="us-2717437-mestral-velcro"
          claimStates={claimStates}
          onToggleClaim={(claimNumber, active) =>
            updateParam(claimConstraintStateParamId(claimNumber), active ? 1 : 0)
          }
        />
      </div>
    </div>
  );
}
export default MestralVelcroSim;
