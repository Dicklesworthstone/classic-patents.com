"use client";

import {
  Activity,
  Cog,
  Flame,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  getWattRotaryTapeFrame,
  readWattRotaryControls,
  stepWattRotaryEngine,
  WATT_ROTARY_FRANKENSIM_BOUNDARY,
  WATT_ROTARY_KERNEL_SOURCE,
  WATT_ROTARY_KINEMATIC_GEOMETRY,
  WATT_ROTARY_SOURCE_BOUNDARY,
} from "@/physics/wattRotaryKernel";
import { soundEngine } from "@/utils/soundEngine";
import { usePatentAudio } from "./three/usePatentAudio";

export function WattRotaryEngineSim() {
  const { params, updateParam, resetParams } = usePatentPhysics("gb-1306-watt-rotary-engine");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const [activeTab, setActiveTab] = useState<
    "engine-elevation" | "gear-mesh" | "alternative-methods"
  >("engine-elevation");
  const isPlaying = (params.isRunning ?? 1) > 0.5;

  const strokeRateSpm = params.strokeRateSpm ?? 20;
  const boilerPressureKpa = params.boilerPressureKpa ?? 70;
  const gearRatioNpOverNs = params.gearRatioNpOverNs ?? 1.0;
  const flywheelMassKg = params.flywheelMassKg ?? 3500;

  // The route-level owner remains mounted while the visitor changes faces.
  // This hook supplies the throttled React snapshot; both faces read the same
  // exact kinematic state from the kernel tape.
  const { frame } = useFrankenSimPhysics("gb-1306-watt-rotary-engine", {
    domain: "thermo_fluid",
    refusal: { isRefused: true, reason: WATT_ROTARY_SOURCE_BOUNDARY },
  });
  const telemetry =
    getWattRotaryTapeFrame()?.telemetry ??
    stepWattRotaryEngine(
      readWattRotaryControls({
        strokeRateSpm,
        boilerPressureKpa,
        gearRatioNpOverNs,
        flywheelMassKg,
      }),
      0,
    );

  // One affine world-to-SVG transform keeps every joint coincident with the
  // same kernel geometry used by the 3D model.
  const pixelsPerMeter = 70;
  const beamPivotX = 280;
  const beamPivotY = 160;
  const worldToSvgX = (worldX: number) => beamPivotX + worldX * pixelsPerMeter;
  const worldToSvgY = (worldY: number) =>
    beamPivotY - (worldY - WATT_ROTARY_KINEMATIC_GEOMETRY.beamPivotY) * pixelsPerMeter;
  const leftBeamX = worldToSvgX(telemetry.leftBeamEndX);
  const leftBeamY = worldToSvgY(telemetry.leftBeamEndY);
  const rightBeamX = worldToSvgX(telemetry.rightBeamEndX);
  const rightBeamY = worldToSvgY(telemetry.rightBeamEndY);
  const sunCenterX = worldToSvgX(WATT_ROTARY_KINEMATIC_GEOMETRY.sunCenterX);
  const sunCenterY = worldToSvgY(WATT_ROTARY_KINEMATIC_GEOMETRY.sunCenterY);
  const rOrbitPx = telemetry.gearCenterDistanceM * pixelsPerMeter;
  const rSunPx = telemetry.sunPitchRadiusM * pixelsPerMeter;
  const rPlanetPx = telemetry.planetPitchRadiusM * pixelsPerMeter;
  const orbitAngleRad = telemetry.planetOrbitAngleRad;
  const planetCenterX = sunCenterX + telemetry.planetPosX * pixelsPerMeter;
  const planetCenterY = sunCenterY - telemetry.planetPosY * pixelsPerMeter;
  // SVG's downward-positive Y axis mirrors the kernel's world coordinates, so
  // a positive physical shaft angle must render as a negative SVG rotation.
  const planetAngleDeg = -telemetry.planetBodyAngleDeg;
  const sunAngleDeg = -telemetry.sunShaftAngleDeg;
  const sunToothAngles = Array.from(
    { length: telemetry.sunTeeth },
    (_, index) => (index / telemetry.sunTeeth) * 360,
  );
  const planetToothAngles = Array.from(
    { length: telemetry.planetTeeth },
    (_, index) => (index / telemetry.planetTeeth) * 360 + 180 / telemetry.planetTeeth,
  );
  // The 2D pitch-mesh panel must keep every supported gear pair in frame.
  // At 2:1, the orbiting planet is substantially larger than the sun, so a
  // fixed 120px orbit clips it at the 350px drawing boundary. This is a
  // uniform presentation scale only: all radii and centre distances still
  // come from the same kernel pitch geometry.
  const gearMeshCenterX = 250;
  const gearMeshCenterY = 180;
  const gearMeshToothOverhangPx = 6;
  const maximumGearRadiusFraction =
    Math.max(telemetry.sunPitchRadiusM, telemetry.planetPitchRadiusM) /
    telemetry.gearCenterDistanceM;
  const gearMeshOrbitRadiusPx = Math.min(
    96,
    (144 - gearMeshToothOverhangPx) / (1 + maximumGearRadiusFraction),
  );
  const gearMeshSunRadiusPx =
    gearMeshOrbitRadiusPx * (telemetry.sunPitchRadiusM / telemetry.gearCenterDistanceM);
  const gearMeshPlanetRadiusPx =
    gearMeshOrbitRadiusPx * (telemetry.planetPitchRadiusM / telemetry.gearCenterDistanceM);
  const pistonY = 400 - (telemetry.pistonPositionM / 1.8) * 100;

  return (
    <div
      className="w-full bg-parchment-50 dark:bg-canvas border border-parchment-300 dark:border-amber-950/40 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-6 text-ink-900 dark:text-parchment-200"
      data-watt-face="two"
      data-watt-runtime-tick={frame.tick}
      data-watt-runtime-provenance={frame.provenance}
      data-watt-kernel-source={WATT_ROTARY_KERNEL_SOURCE}
      data-watt-frankensim-boundary={WATT_ROTARY_FRANKENSIM_BOUNDARY}
      data-watt-running={isPlaying}
      data-watt-carrier-angle-rad={telemetry.planetOrbitAngleRad}
      data-watt-rod-angle-rad={telemetry.connectingRodAngleRad}
      data-watt-planet-angle-rad={telemetry.planetBodyAngleRad}
      data-watt-sun-angle-rad={telemetry.sunShaftAngleRad}
      data-watt-mesh-residual-rad={telemetry.gearMeshConstraintResidualRad}
      data-watt-rod-residual-m={telemetry.connectingRodConstraintResidualM}
      data-watt-sun-teeth={telemetry.sunTeeth}
      data-watt-planet-teeth={telemetry.planetTeeth}
    >
      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-parchment-200 dark:border-amber-900/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold">
              GB 1306 (1781)
            </span>
            <h3 className="text-lg font-bold text-ink-950 dark:text-amber-100 font-serif">
              James Watt Sun &amp; Planet Epicyclic Rotative Engine
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Fixed-centre gear mesh, closed rod geometry, and continuous rotative shaft drive
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => {
              updateParam("isRunning", isPlaying ? 0 : 1);
              soundEngine.playSwitchClick();
            }}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isPlaying ? "Pause Motion" : "Resume Motion"}
            aria-label={isPlaying ? "Pause Motion" : "Resume Motion"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => {
              resetParams();
              updateParam("resetEpoch", (params.resetEpoch ?? 0) + 1);
              updateParam("isRunning", 1);
              soundEngine.playSwitchClick();
            }}
            aria-label="Reset Simulation"
            className="p-2 rounded-lg bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-800 dark:text-parchment-200 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-stone-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("engine-elevation")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "engine-elevation"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Full Engine Elevation (Fig. 1)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("gear-mesh")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "gear-mesh"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          <Cog className="w-3.5 h-3.5" />
          <span>Epicyclic Pitch Mesh (Fig. 2)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("alternative-methods")}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "alternative-methods"
              ? "border-amber-500 text-amber-400 bg-amber-500/10"
              : "border-transparent text-stone-400 hover:text-stone-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Methods 2, 3, 4 (Fig. 3)</span>
        </button>
      </div>

      {/* Main Interactive Canvas & Diagram */}
      <div className="relative w-full aspect-[16/10] bg-canvas rounded-xl border border-stone-800 overflow-hidden">
        {activeTab === "engine-elevation" && (
          <svg
            viewBox="0 0 700 480"
            role="img"
            aria-label={`Rotary steam engine simulation: ${isPlaying ? `beam oscillating with planet gear producing ${telemetry.meanPowerKw.toFixed(1)} kilowatts` : "beam stationary"}`}
            className="w-full h-full"
          >
            {/* Grid and background styling */}
            <defs>
              <pattern id="watt-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="beam-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#78716c" />
                <stop offset="50%" stopColor="#a8a29e" />
                <stop offset="100%" stopColor="#44403c" />
              </linearGradient>
              <linearGradient id="sun-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="planet-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            <rect width="700" height="480" fill="url(#watt-grid)" />

            {/* Masonry Engine Wall & Main Pillar */}
            <rect
              x="25"
              y="240"
              width="130"
              height="220"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2"
            />
            <rect
              x="255"
              y="160"
              width="50"
              height="300"
              fill="#292524"
              stroke="#57534e"
              strokeWidth="2"
            />
            <rect
              x="420"
              y="380"
              width="60"
              height="80"
              fill="#1c1917"
              stroke="#44403c"
              strokeWidth="2"
            />

            {/* Steam Cylinder & Piston */}
            <rect
              x="50"
              y="280"
              width="80"
              height="150"
              fill="#1e293b"
              stroke="#64748b"
              strokeWidth="2"
            />
            <rect x="45" y="270" width="90" height="10" fill="#334155" stroke="#94a3b8" />
            <rect x="45" y="420" width="90" height="10" fill="#334155" stroke="#94a3b8" />

            {/* Reciprocating Piston inside Cylinder */}
            <rect
              x="55"
              y={pistonY}
              width="70"
              height="20"
              fill="#d97706"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Piston Rod */}
            <line
              x1="90"
              y1={pistonY}
              x2={leftBeamX}
              y2={leftBeamY}
              stroke="#e2e8f0"
              strokeWidth="4"
            />

            {/* Great Walking Beam (Rocking about pivot (280, 160)) */}
            <g>
              <polygon
                points={`
                  ${leftBeamX},${leftBeamY - 8}
                  ${beamPivotX},${beamPivotY - 14}
                  ${rightBeamX},${rightBeamY - 8}
                  ${rightBeamX},${rightBeamY + 8}
                  ${beamPivotX},${beamPivotY + 14}
                  ${leftBeamX},${leftBeamY + 8}
                `}
                fill="url(#beam-grad)"
                stroke="#e7e5e4"
                strokeWidth="1.5"
              />
              <circle
                cx={beamPivotX}
                cy={beamPivotY}
                r="10"
                fill="#1c1917"
                stroke="#f59e0b"
                strokeWidth="2.5"
              />
            </g>

            {/* Connecting Spear / Rod from Right Beam to Planet Wheel */}
            <line
              x1={rightBeamX}
              y1={rightBeamY}
              x2={planetCenterX}
              y2={planetCenterY}
              stroke="#e2e8f0"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <circle cx={rightBeamX} cy={rightBeamY} r="5" fill="#f59e0b" />

            {/* Orbit Path Guideline */}
            <circle
              cx={sunCenterX}
              cy={sunCenterY}
              r={rOrbitPx}
              fill="none"
              stroke="#d97706"
              strokeWidth="1.2"
              strokeDasharray="4,4"
              opacity="0.6"
            />

            {/* Massive Flywheel on Sun Shaft Center */}
            <g transform={`rotate(${sunAngleDeg}, ${sunCenterX}, ${sunCenterY})`}>
              <circle
                cx={sunCenterX}
                cy={sunCenterY}
                r="95"
                fill="none"
                stroke="#64748b"
                strokeWidth="10"
                opacity="0.8"
              />
              <line
                x1={sunCenterX - 95}
                y1={sunCenterY}
                x2={sunCenterX + 95}
                y2={sunCenterY}
                stroke="#475569"
                strokeWidth="2.5"
              />
              <line
                x1={sunCenterX}
                y1={sunCenterY - 95}
                x2={sunCenterX}
                y2={sunCenterY + 95}
                stroke="#475569"
                strokeWidth="2.5"
              />
              <line
                x1={sunCenterX - 67}
                y1={sunCenterY - 67}
                x2={sunCenterX + 67}
                y2={sunCenterY + 67}
                stroke="#475569"
                strokeWidth="2"
              />
              <line
                x1={sunCenterX - 67}
                y1={sunCenterY + 67}
                x2={sunCenterX + 67}
                y2={sunCenterY - 67}
                stroke="#475569"
                strokeWidth="2"
              />
            </g>

            {/* Sun Gear (keyed to the output shaft) */}
            <g transform={`rotate(${sunAngleDeg}, ${sunCenterX}, ${sunCenterY})`}>
              <circle
                cx={sunCenterX}
                cy={sunCenterY}
                r={rSunPx}
                fill="url(#sun-grad)"
                stroke="#fef08a"
                strokeWidth="1.5"
              />
              {/* Sun Gear Teeth */}
              {sunToothAngles.map((deg) => (
                <rect
                  key={deg}
                  x={sunCenterX - 3}
                  y={sunCenterY - rSunPx - 4}
                  width="6"
                  height="8"
                  fill="#fef08a"
                  transform={`rotate(${deg}, ${sunCenterX}, ${sunCenterY})`}
                />
              ))}
              <circle
                cx={sunCenterX}
                cy={sunCenterY}
                r="12"
                fill="#0f172a"
                stroke="#f59e0b"
                strokeWidth="2"
              />
            </g>

            {/* Radius Guide Link connecting Sun Center to Planet Center */}
            <line
              x1={sunCenterX}
              y1={sunCenterY}
              x2={planetCenterX}
              y2={planetCenterY}
              stroke="#64748b"
              strokeWidth="3.5"
              strokeDasharray="4,2"
            />

            {/* Planet gear: its centre orbits while its bolted body rocks with the spear. */}
            <g transform={`rotate(${planetAngleDeg}, ${planetCenterX}, ${planetCenterY})`}>
              <circle
                cx={planetCenterX}
                cy={planetCenterY}
                r={rPlanetPx}
                fill="url(#planet-grad)"
                stroke="#bae6fd"
                strokeWidth="1.5"
              />
              {/* Planet Gear Teeth (offset by half pitch to interlock with Sun teeth) */}
              {planetToothAngles.map((deg) => (
                <rect
                  key={deg}
                  x={planetCenterX - 3}
                  y={planetCenterY - rPlanetPx - 4}
                  width="6"
                  height="8"
                  fill="#bae6fd"
                  transform={`rotate(${deg}, ${planetCenterX}, ${planetCenterY})`}
                />
              ))}
              <circle
                cx={planetCenterX}
                cy={planetCenterY}
                r="10"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              {/* Centre bearing joining the rod, guide link, and planet axle. */}
              <circle cx={planetCenterX} cy={planetCenterY} r="4" fill="#fef08a" />
            </g>

            {/* HUD Annotations */}
            <g transform="translate(480, 40)">
              <rect width="200" height="90" rx="8" fill="#0f172a" stroke="#334155" opacity="0.9" />
              <text x="12" y="22" fill="#f59e0b" fontSize="12" fontWeight="bold">
                WATT EPICYCLIC HUD
              </text>
              <text x="12" y="42" fill="#94a3b8" fontSize="10">
                Beam Cycle: <tspan fill="#fef08a">{strokeRateSpm} SPM</tspan>
              </text>
              <text x="12" y="60" fill="#94a3b8" fontSize="10">
                Shaft Speed:{" "}
                <tspan fill="#38bdf8">
                  {telemetry.shaftRpm.toFixed(1)} inst · {telemetry.meanShaftRpm.toFixed(1)} mean
                  RPM
                </tspan>
              </text>
              <text x="12" y="78" fill="#94a3b8" fontSize="10">
                Shaft Power:{" "}
                <tspan fill="#10b981">
                  {telemetry.meanPowerKw.toFixed(1)} kW ({telemetry.brakeHorsepower.toFixed(1)} hp)
                </tspan>
              </text>
            </g>
          </svg>
        )}

        {activeTab === "gear-mesh" && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-canvas">
            <svg
              viewBox="0 0 500 350"
              role="img"
              aria-label={`Rotary engine planetary gear simulation: planet gear orbiting the sun gear at ${Math.round(orbitAngleRad * (180 / Math.PI))} degrees`}
              className="w-full max-w-lg h-auto"
            >
              <rect width="500" height="350" fill="#0a0f1d" rx="10" stroke="#1f2937" />

              {/* Sun gear pitch circle and teeth */}
              <g transform={`rotate(${sunAngleDeg}, ${gearMeshCenterX}, ${gearMeshCenterY})`}>
                <circle
                  cx={gearMeshCenterX}
                  cy={gearMeshCenterY}
                  r={gearMeshSunRadiusPx}
                  fill="#b45309"
                  fillOpacity="0.3"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                />
                {sunToothAngles.map((deg) => (
                  <rect
                    key={deg}
                    x={gearMeshCenterX - 3}
                    y={gearMeshCenterY - gearMeshSunRadiusPx - 4}
                    width="6"
                    height="8"
                    fill="#fef08a"
                    transform={`rotate(${deg}, ${gearMeshCenterX}, ${gearMeshCenterY})`}
                  />
                ))}
                <circle
                  cx={gearMeshCenterX}
                  cy={gearMeshCenterY}
                  r="14"
                  fill="#1e293b"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text
                  x={gearMeshCenterX}
                  y={gearMeshCenterY + 5}
                  fill="#fef08a"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  SUN (A)
                </text>
              </g>

              {/* Radius Guide Link connecting Sun to Planet */}
              {(() => {
                const meshPlanetX =
                  gearMeshCenterX + gearMeshOrbitRadiusPx * Math.sin(orbitAngleRad);
                const meshPlanetY =
                  gearMeshCenterY + gearMeshOrbitRadiusPx * Math.cos(orbitAngleRad);
                const meshContactX =
                  gearMeshCenterX + gearMeshSunRadiusPx * Math.sin(orbitAngleRad);
                const meshContactY =
                  gearMeshCenterY + gearMeshSunRadiusPx * Math.cos(orbitAngleRad);

                return (
                  <>
                    <line
                      x1={gearMeshCenterX}
                      y1={gearMeshCenterY}
                      x2={meshPlanetX}
                      y2={meshPlanetY}
                      stroke="#64748b"
                      strokeWidth="3"
                      strokeDasharray="4,3"
                    />

                    {/* Planet centre orbits; its restrained body rocks with the connecting spear. */}
                    <g transform={`rotate(${planetAngleDeg}, ${meshPlanetX}, ${meshPlanetY})`}>
                      <circle
                        cx={meshPlanetX}
                        cy={meshPlanetY}
                        r={gearMeshPlanetRadiusPx}
                        fill="#0284c7"
                        fillOpacity="0.3"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                      {planetToothAngles.map((deg) => (
                        <rect
                          key={deg}
                          x={meshPlanetX - 3}
                          y={meshPlanetY - gearMeshPlanetRadiusPx - 4}
                          width="6"
                          height="8"
                          fill="#bae6fd"
                          transform={`rotate(${deg}, ${meshPlanetX}, ${meshPlanetY})`}
                        />
                      ))}
                      <circle
                        cx={meshPlanetX}
                        cy={meshPlanetY}
                        r="12"
                        fill="#1e293b"
                        stroke="#38bdf8"
                        strokeWidth="2"
                      />
                      <text
                        x={meshPlanetX}
                        y={meshPlanetY + 5}
                        fill="#bae6fd"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        PLANET (B)
                      </text>
                    </g>

                    {/* Pitch Line Tooth Mesh Contact Point */}
                    <circle cx={meshContactX} cy={meshContactY} r="5" fill="#ef4444" />
                  </>
                );
              })()}

              {/* Formula & Explanation Card */}
              <g transform="translate(20, 20)">
                <text x="0" y="15" fill="#f59e0b" fontSize="13" fontWeight="bold">
                  Epicyclic Velocity Multiplier
                </text>
                <text x="0" y="35" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                  N_s(ω_s−ω_c) + N_p(ω_p−ω_c) = 0
                </text>
                <text x="0" y="55" fill="#94a3b8" fontSize="10">
                  Current pair: {telemetry.planetTeeth}:{telemetry.sunTeeth} teeth →{" "}
                  {telemetry.speedMultiplier.toFixed(2)}× net turns/cycle
                </text>
              </g>
            </svg>
          </div>
        )}

        {activeTab === "alternative-methods" && (
          <div className="w-full h-full grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-canvas overflow-y-auto">
            {/* Method 2: Internal Planetary */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Method 2: Internal Planetary Ring
              </h4>
              <p className="text-[11px] text-stone-300">
                Planet wheel or friction roller orbits inside a concave internal toothed ring fixed
                to the flywheel shaft.
              </p>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>Engagement:</span>
                <span className="text-amber-300">Internal Epicyclic</span>
              </div>
            </div>

            {/* Method 3: Crown Wheel Ratchet */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Method 3: Crown Wheel Ratchet
              </h4>
              <p className="text-[11px] text-stone-300">
                Opposing ratchet catches alternately engage the teeth of a crown wheel on up and
                down strokes for continuous forward rotation.
              </p>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>Mechanism:</span>
                <span className="text-amber-300">Push-Pull Catches</span>
              </div>
            </div>

            {/* Method 4: Double Rack & Pinion */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-stone-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Method 4: Double Rack &amp; Pinions
              </h4>
              <p className="text-[11px] text-stone-300">
                Two vertical toothed racks engage alternating pinion sectors on the output shaft,
                smoothed by counterweighted balance levers.
              </p>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>Conversion:</span>
                <span className="text-amber-300">Sector Clutches</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="rounded-xl border border-amber-500/25 bg-amber-950/10 px-4 py-3 text-xs leading-relaxed text-ink-700 dark:text-parchment-300">
        <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
        {WATT_ROTARY_SOURCE_BOUNDARY}
      </p>

      {/* Interactive Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-stone-900/40 p-4 rounded-xl border border-stone-800">
        {/* Stroke Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> Beam Stroke Rate
            </span>
            <span className="font-mono text-amber-300">{strokeRateSpm} SPM</span>
          </div>
          <input
            type="range"
            aria-label="Beam stroke rate in strokes per minute"
            min="10"
            max="30"
            step="2"
            value={strokeRateSpm}
            onChange={(e) => updateParam("strokeRateSpm", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Boiler Steam Pressure */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Boiler Pressure
            </span>
            <span className="font-mono text-rose-300">{boilerPressureKpa} kPa</span>
          </div>
          <input
            type="range"
            aria-label="Boiler steam pressure in kilopascals"
            min="40"
            max="120"
            step="5"
            value={boilerPressureKpa}
            onChange={(e) => updateParam("boilerPressureKpa", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
        </div>

        {/* Planet / Sun Gear Ratio */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Cog className="w-3.5 h-3.5 text-cyan-400" /> Gear Tooth Ratio
            </span>
            <span className="font-mono text-cyan-300">{gearRatioNpOverNs.toFixed(2)} : 1</span>
          </div>
          <input
            type="range"
            aria-label="Planet-to-sun gear tooth ratio"
            min="0.5"
            max="2.0"
            step="0.25"
            value={gearRatioNpOverNs}
            onChange={(e) => updateParam("gearRatioNpOverNs", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Flywheel Mass */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" /> Flywheel Mass
            </span>
            <span className="font-mono text-purple-300">{flywheelMassKg} kg</span>
          </div>
          <input
            type="range"
            aria-label="Flywheel mass in kilograms"
            min="1000"
            max="6000"
            step="250"
            value={flywheelMassKg}
            onChange={(e) => updateParam("flywheelMassKg", Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
