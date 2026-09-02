"use client";

import { useId, useState } from "react";
import {
  HULL_SLA_DEFAULT_CONTROLS,
  type HullStereolithographyControls,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";

export function HullStereolithographySim() {
  const [controls, setControls] =
    useState<HullStereolithographyControls>(HULL_SLA_DEFAULT_CONTROLS);
  const [activeTab, setActiveTab] = useState<"vat" | "profile" | "kinetics">("vat");
  const baseId = useId();

  const tel = stepHullStereolithographySi(controls);

  const update = <K extends keyof HullStereolithographyControls>(
    key: K,
    value: HullStereolithographyControls[K],
  ) => {
    setControls((prev) =>
      readHullStereolithographyControls({
        ...prev,
        [key]: value,
      }),
    );
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-amber-900/30 bg-stone-950 p-6 text-stone-200 shadow-2xl backdrop-blur-md">
      {/* Title & Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-300">
              US 4,575,330
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400">
              Apparatus for Production of Three-Dimensional Objects by Stereolithography
            </span>
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-amber-100">
            Photopolymerization & Layered Additive Solidification
          </h2>
        </div>

        {/* View Mode Tabs */}
        <div className="flex rounded-lg bg-stone-900/90 p-1 border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab("vat")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "vat"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            SLA Resin Vat (Fig. 1)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "profile"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Beer-Lambert Profile (Fig. 3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("kinetics")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "kinetics"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            Elevator Recoating (Fig. 2)
          </button>
        </div>
      </div>

      {/* Refusal Banner if out-of-bounds */}
      {(tel.underexposureRefusal || tel.overpenetrationRefusal || tel.recoatDelayRefusal) && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-rose-200">
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-rose-400">
            <span>⚠️ Physical Constraint Refusal</span>
          </div>
          <p className="mt-1 text-sm font-medium">{tel.refusalReason}</p>
        </div>
      )}

      {/* Main Visual SVG Simulation Canvas */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900/50 shadow-inner">
        <svg
          viewBox="0 0 800 450"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Stereolithography Simulation Diagram"
        >
          <defs>
            <linearGradient id={`${baseId}-laser-beam`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id={`${baseId}-resin-fluid`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.85" />
            </linearGradient>
            <linearGradient id={`${baseId}-solid-layer`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {activeTab === "vat" && (
            <g id="sla-vat-assembly">
              {/* Vat Tank Body */}
              <rect
                x="120"
                y="160"
                width="560"
                height="240"
                rx="6"
                fill="#1c1917"
                stroke="#78716c"
                strokeWidth="2"
              />
              {/* Liquid Photopolymer */}
              <rect x="130" y="180" width="540" height="210" fill={`url(#${baseId}-resin-fluid)`} />
              <line
                x1="130"
                y1="180"
                x2="670"
                y2="180"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text x="140" y="175" fill="#7dd3fc" fontSize="11" fontFamily="monospace">
                LIQUID RESIN SURFACE (Z = 0)
              </text>

              {/* Elevator Plunger Lead Screw & Platform */}
              <rect
                x="385"
                y="240"
                width="30"
                height="150"
                fill="#44403c"
                stroke="#a8a29e"
                strokeWidth="1"
              />
              <rect
                x="250"
                y="260"
                width="300"
                height="14"
                rx="2"
                fill="#78716c"
                stroke="#d6d3d1"
                strokeWidth="1.5"
              />
              <text x="260" y="285" fill="#e7e5e4" fontSize="11" fontFamily="monospace">
                BUILD PLATFORM 29
              </text>

              {/* Cured Solid Object Layers */}
              {Array.from({
                length: Math.min(8, Math.max(1, Math.floor(controls.partLayersCount / 6))),
              }).map((_, i) => {
                const layerY = 246 - i * 8;
                return (
                  <rect
                    key={`cured-layer-${i}`}
                    x={310 - (i % 2 === 0 ? 0 : 10)}
                    width={180 + (i % 2 === 0 ? 0 : 20)}
                    y={layerY}
                    height="7"
                    rx="1"
                    fill={`url(#${baseId}-solid-layer)`}
                    stroke="#f59e0b"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Active UV Laser Source & Galvanometer Mirrors */}
              <rect
                x="350"
                y="20"
                width="100"
                height="40"
                rx="4"
                fill="#292524"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <text
                x="362"
                y="44"
                fill="#d8b4fe"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                UV LASER 21
              </text>

              {/* Galvanometer Mirror Scanner */}
              <polygon
                points="390,75 410,75 400,90"
                fill="#e2e8f0"
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x="415" y="85" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                X-Y GALVO 26
              </text>

              {/* Focused Gaussian UV Laser Beam */}
              <polygon
                points="400,90 380,180 420,180"
                fill={`url(#${baseId}-laser-beam)`}
                opacity="0.85"
              />
              <line x1="400" y1="90" x2="400" y2="180" stroke="#f3e8ff" strokeWidth="2" />

              {/* Laser Spot Interaction Curing Zone */}
              <ellipse
                cx="400"
                cy="180"
                rx={Math.max(6, tel.curedLineWidthUm * 0.1)}
                ry="3"
                fill="#fbbf24"
                opacity="0.9"
              />

              {/* Telemetry Overlay Callout */}
              <g transform="translate(560, 40)">
                <rect
                  width="210"
                  height="90"
                  rx="6"
                  fill="#0c0a09"
                  stroke="#d97706"
                  strokeWidth="1"
                  opacity="0.9"
                />
                <text
                  x="12"
                  y="24"
                  fill="#fbbf24"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  SLA SPOT DOSIMETRY
                </text>
                <text x="12" y="44" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  Peak Exp: {tel.peakExposureMJCm2.toFixed(1)} mJ/cm²
                </text>
                <text x="12" y="62" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  Cure Depth: {tel.cureDepthUm.toFixed(1)} µm
                </text>
                <text x="12" y="80" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                  Adhesion: {tel.interlayerAdhesionRatio.toFixed(2)}x layer step
                </text>
              </g>
            </g>
          )}

          {activeTab === "profile" && (
            <g id="beer-lambert-profile">
              <rect
                x="80"
                y="40"
                width="640"
                height="360"
                rx="8"
                fill="#141210"
                stroke="#44403c"
                strokeWidth="1.5"
              />
              <text
                x="100"
                y="70"
                fill="#f59e0b"
                fontSize="14"
                fontFamily="serif"
                fontWeight="bold"
              >
                Beer-Lambert Parabolic Photocure Cross-Section (Figure 3)
              </text>

              {/* Grid & Axes */}
              <line x1="140" y1="120" x2="660" y2="120" stroke="#57534e" strokeWidth="1.5" />
              <text x="610" y="115" fill="#a8a29e" fontSize="10" fontFamily="monospace">
                X (µm)
              </text>
              <line x1="400" y1="100" x2="400" y2="360" stroke="#57534e" strokeWidth="1.5" />
              <text x="405" y="355" fill="#a8a29e" fontSize="10" fontFamily="monospace">
                Depth Z (µm)
              </text>

              {/* Layer Step Indicator Line */}
              {(() => {
                const layerLineY = 120 + (controls.layerThicknessUm / 300) * 200;
                return (
                  <g>
                    <line
                      x1="140"
                      y1={layerLineY}
                      x2="660"
                      y2={layerLineY}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <text
                      x="150"
                      y={layerLineY - 6}
                      fill="#38bdf8"
                      fontSize="10"
                      fontFamily="monospace"
                    >
                      Layer Step Δz = {controls.layerThicknessUm} µm
                    </text>
                  </g>
                );
              })()}

              {/* Parabolic Solid Cure Boundary Profile */}
              {(() => {
                const scaleZ = 200 / 300;
                const scaleX = 200 / 400;
                const maxZ = 120 + tel.cureDepthUm * scaleZ;
                const halfW = (tel.curedLineWidthUm * scaleX) / 2;

                const pathData = `M ${400 - halfW} 120 Q 400 ${maxZ + 20} ${400 + halfW} 120 Z`;
                return (
                  <g>
                    <path
                      d={pathData}
                      fill={`url(#${baseId}-solid-layer)`}
                      stroke="#fbbf24"
                      strokeWidth="2"
                      opacity="0.85"
                    />
                    <circle cx="400" cy={maxZ} r="4" fill="#ef4444" />
                    <text x="415" y={maxZ + 4} fill="#fca5a5" fontSize="11" fontFamily="monospace">
                      Max Cure Depth C_d = {tel.cureDepthUm.toFixed(1)} µm
                    </text>
                  </g>
                );
              })()}

              {/* Critical Exposure Threshold Notation */}
              <text x="120" y="380" fill="#d6d3d1" fontSize="11" fontFamily="monospace">
                Working Equation: C_d = D_p · ln(E_max / E_c) = {controls.penetrationDepthUm} · ln(
                {tel.peakExposureMJCm2.toFixed(1)} / {controls.criticalExposureMJCm2})
              </text>
            </g>
          )}

          {activeTab === "kinetics" && (
            <g id="recoating-fluid-dynamics">
              <rect
                x="80"
                y="40"
                width="640"
                height="360"
                rx="8"
                fill="#141210"
                stroke="#44403c"
                strokeWidth="1.5"
              />
              <text
                x="100"
                y="70"
                fill="#f59e0b"
                fontSize="14"
                fontFamily="serif"
                fontWeight="bold"
              >
                Viscous Photopolymer Meniscus Leveling & Recoating
              </text>

              {/* Viscous Meniscus Profile */}
              <path
                d="M 120 180 Q 260 210 400 180 T 680 180 L 680 340 L 120 340 Z"
                fill={`url(#${baseId}-resin-fluid)`}
                stroke="#0284c7"
                strokeWidth="2"
              />

              {/* Elevator Motion Vector */}
              <g transform="translate(400, 240)">
                <line
                  x1="0"
                  y1="-30"
                  x2="0"
                  y2="40"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  markerEnd="url(#arrow)"
                />
                <text x="15" y="10" fill="#fbbf24" fontSize="12" fontFamily="monospace">
                  v_dip = {controls.elevatorDipSpeedMmS} mm/s
                </text>
              </g>

              {/* Recoat Settling Metrics */}
              <rect
                x="120"
                y="270"
                width="560"
                height="60"
                rx="4"
                fill="#1c1917"
                stroke="#57534e"
                strokeWidth="1"
              />
              <text x="140" y="295" fill="#facc15" fontSize="11" fontFamily="monospace">
                Dynamic Viscosity µ = {controls.resinViscosityCp} cP | Meniscus Settling Time ={" "}
                {tel.recoatMeniscusSettlingTimeSec.toFixed(2)} s
              </text>
              <text x="140" y="315" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                Estimated Total Build Time ({controls.partLayersCount} layers) ={" "}
                {tel.totalBuildTimeMin.toFixed(1)} minutes
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Column 1: Optical & Laser Controls */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Laser Beam Optics
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-laser-power`}>UV Laser Power (mW)</label>
              <span className="font-mono text-amber-300">{controls.laserPowerMw} mW</span>
            </div>
            <input
              id={`${baseId}-laser-power`}
              type="range"
              min="10"
              max="150"
              step="1"
              value={controls.laserPowerMw}
              onChange={(e) => update("laserPowerMw", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-scan-speed`}>Scan Speed (mm/s)</label>
              <span className="font-mono text-amber-300">{controls.laserScanSpeedMmS} mm/s</span>
            </div>
            <input
              id={`${baseId}-scan-speed`}
              type="range"
              min="50"
              max="1200"
              step="10"
              value={controls.laserScanSpeedMmS}
              onChange={(e) => update("laserScanSpeedMmS", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-beam-waist`}>Beam Waist Radius w₀ (µm)</label>
              <span className="font-mono text-amber-300">{controls.beamWaistRadiusUm} µm</span>
            </div>
            <input
              id={`${baseId}-beam-waist`}
              type="range"
              min="60"
              max="250"
              step="5"
              value={controls.beamWaistRadiusUm}
              onChange={(e) => update("beamWaistRadiusUm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Column 2: Photopolymer Chemistry */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Resin Photochemistry
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-penetration-depth`}>Penetration Depth D_p (µm)</label>
              <span className="font-mono text-amber-300">{controls.penetrationDepthUm} µm</span>
            </div>
            <input
              id={`${baseId}-penetration-depth`}
              type="range"
              min="60"
              max="250"
              step="5"
              value={controls.penetrationDepthUm}
              onChange={(e) => update("penetrationDepthUm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-critical-exposure`}>Critical Exposure E_c (mJ/cm²)</label>
              <span className="font-mono text-amber-300">
                {controls.criticalExposureMJCm2} mJ/cm²
              </span>
            </div>
            <input
              id={`${baseId}-critical-exposure`}
              type="range"
              min="4"
              max="25"
              step="0.2"
              value={controls.criticalExposureMJCm2}
              onChange={(e) => update("criticalExposureMJCm2", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-viscosity`}>Resin Viscosity (cP)</label>
              <span className="font-mono text-amber-300">{controls.resinViscosityCp} cP</span>
            </div>
            <input
              id={`${baseId}-viscosity`}
              type="range"
              min="100"
              max="4000"
              step="50"
              value={controls.resinViscosityCp}
              onChange={(e) => update("resinViscosityCp", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Column 3: Slicing & Elevator Recoating */}
        <div className="space-y-4 rounded-xl border border-stone-800 bg-stone-900/60 p-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
            Slicing & Recoating
          </h3>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-layer-thickness`}>Layer Step Δz (µm)</label>
              <span className="font-mono text-amber-300">{controls.layerThicknessUm} µm</span>
            </div>
            <input
              id={`${baseId}-layer-thickness`}
              type="range"
              min="25"
              max="250"
              step="5"
              value={controls.layerThicknessUm}
              onChange={(e) => update("layerThicknessUm", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-elevator-speed`}>Elevator Dip Speed (mm/s)</label>
              <span className="font-mono text-amber-300">{controls.elevatorDipSpeedMmS} mm/s</span>
            </div>
            <input
              id={`${baseId}-elevator-speed`}
              type="range"
              min="1"
              max="25"
              step="1"
              value={controls.elevatorDipSpeedMmS}
              onChange={(e) => update("elevatorDipSpeedMmS", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-300">
              <label htmlFor={`${baseId}-layers-count`}>Part Layers Count</label>
              <span className="font-mono text-amber-300">{controls.partLayersCount} layers</span>
            </div>
            <input
              id={`${baseId}-layers-count`}
              type="range"
              min="10"
              max="200"
              step="5"
              value={controls.partLayersCount}
              onChange={(e) => update("partLayersCount", Number(e.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HullStereolithographySim;
