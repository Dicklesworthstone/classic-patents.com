"use client";

import { Flame, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { stepHallAluminium } from "@/physics/catalogKernels";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";
import { PortHamiltonianEnergyStrip } from "./PortHamiltonianEnergyStrip";
import { usePatentAudio } from "./three/usePatentAudio";

export function HallAluminiumSim() {
  const { params, effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics("us-400766-hall-aluminium");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const currentAmperes = (effectiveParams.currentAmperes as number) ?? 300000;
  const bathTemperatureCelsius = (effectiveParams.bathTemperatureCelsius as number) ?? 960;
  const aluminaConcentrationPct = (effectiveParams.aluminaConcentrationPct as number) ?? 5.5;
  const claim1Active = effectiveParams.claim1Active;

  const [activeTab, setActiveTab] = useState<"electrolysis" | "cross_section" | "chemistry">(
    "electrolysis",
  );

  const sim = useMemo(() => {
    return stepHallAluminium({
      currentAmperes,
      bathTemperatureCelsius,
      aluminaConcentrationPct,
      claim1Active,
    });
  }, [currentAmperes, bathTemperatureCelsius, aluminaConcentrationPct, claim1Active]);

  // Visual scaling derived from SI state
  const isClaim1Active = claim1Active === undefined || claim1Active >= 0.5;
  const currentRatio = isClaim1Active ? currentAmperes / 300000 : 0;
  const bubbleCount = isClaim1Active ? Math.round(12 * currentRatio) : 0;
  const _anodeGlow = isClaim1Active ? Math.min(1.0, 0.4 + currentRatio * 0.4) : 0.05;

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-4 sm:p-6 shadow-xl text-ink-900 dark:text-parchment-100 font-sans space-y-6">
      <PortHamiltonianEnergyStrip patentId="us-400766-hall-aluminium" params={params} />
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-600 dark:text-cyan-400 font-bold">
            <Zap className="w-3.5 h-3.5" />
            Hall-Héroult Electrolytic Smelting Simulator
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-50">
            Molten Cryolite Alumina Reduction Cell (US 400,766)
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:self-auto">
          <div className="flex bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
            {(["electrolysis", "cross_section", "chemistry"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  soundEngine.playSwitchClick();
                }}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-cyan-600 text-white font-bold shadow-xs"
                    : "text-ink-700 dark:text-parchment-400 hover:text-ink-900 dark:hover:text-white"
                }`}
              >
                {tab.replace("_", " ")}
              </button>
            ))}
          </div>
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
              setActiveTab("electrolysis");
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

      {claimConstraintResult.refusalWarning && (
        <div
          role="alert"
          className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200"
        >
          <span className="font-mono font-bold uppercase tracking-wider text-rose-400 mr-2">
            Refusal:
          </span>
          {claimConstraintResult.refusalWarning}
        </div>
      )}

      <ClaimConstraintToggle
        patentId="us-400766-hall-aluminium"
        claimStates={claimStates}
        onToggleClaim={(claim, active) => {
          updateParam(claimConstraintStateParamId(claim), active ? 1 : 0);
        }}
      />

      {/* Interactive SVG Diagram */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-canvas rounded-xl border border-ink-800 overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox="0 0 800 480"
          className="w-full h-full select-none"
          role="img"
          aria-label="Hall Electrolytic Smelting Pot Cross Section"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="hallPotShell" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            <linearGradient id="hallRefractory" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            <linearGradient id="hallCarbonLining" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Molten Cryolite Electrolyte Glow Gradient */}
            <linearGradient id="hallCryoliteBath" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#ea580c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
            </linearGradient>

            {/* Sunk Molten Aluminium Liquid Pad */}
            <linearGradient id="hallAluminiumPad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            {/* Carbon Anodes */}
            <linearGradient id="hallCarbonAnode" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* Busbar Copper */}
            <linearGradient id="hallCopperBus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>

          {/* BACKGROUND STRUCTURE */}
          <rect x="0" y="0" width="800" height="480" fill="#0a0f1d" />

          {/* 1. STEEL POT SHELL (A) */}
          <rect
            x="120"
            y="140"
            width="560"
            height="280"
            rx="16"
            fill="url(#hallPotShell)"
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* Thermal Insulation Layer */}
          <rect
            x="140"
            y="160"
            width="520"
            height="240"
            rx="10"
            fill="url(#hallRefractory)"
            opacity="0.6"
          />

          {/* 2. CARBON CATHODE LINING (B) */}
          <rect
            x="160"
            y="180"
            width="480"
            height="200"
            rx="6"
            fill="url(#hallCarbonLining)"
            stroke="#0284c7"
            strokeWidth="1.5"
          />

          {/* 3. MOLTEN CRYOLITE BATH (D, ~960°C) */}
          <rect
            x="180"
            y="210"
            width="440"
            height="130"
            fill={isClaim1Active ? "url(#hallCryoliteBath)" : "#334155"}
            opacity={isClaim1Active ? 1 : 0.85}
          />

          {/* Cryolite Crust Layer on top */}
          <rect
            x="180"
            y="200"
            width="440"
            height="16"
            fill="#78350f"
            stroke="#451a03"
            strokeWidth="1"
          />
          {/* Crust Breaker Holes */}
          <circle cx="280" cy="208" r="5" fill="#f59e0b" />
          <circle cx="520" cy="208" r="5" fill="#f59e0b" />

          {/* 4. SUNK MOLTEN ALUMINIUM METAL PAD (E, density 2.3 g/cm³) */}
          {isClaim1Active && (
            <rect
              x="180"
              y="340"
              width="440"
              height="35"
              fill="url(#hallAluminiumPad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
          )}

          {/* Cathode Collector Bars (Steel rods embedded in bottom) */}
          <rect x="220" y="375" width="360" height="12" fill="#64748b" rx="2" />
          <line
            x1="400"
            y1="387"
            x2="400"
            y2="440"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeDasharray="4 2"
          />
          <text
            x="400"
            y="458"
            textAnchor="middle"
            fill="#38bdf8"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            NEGATIVE CATHODE BUS (-)
          </text>

          {/* 5. SUSPENDED CONSUMABLE CARBON ANODES (C C) */}
          {/* Anode 1 */}
          <rect
            x="220"
            y="100"
            width="70"
            height="150"
            rx="3"
            fill="url(#hallCarbonAnode)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <rect x="245" y="40" width="20" height="60" fill="url(#hallCopperBus)" />

          {/* Anode 2 */}
          <rect
            x="320"
            y="100"
            width="70"
            height="150"
            rx="3"
            fill="url(#hallCarbonAnode)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <rect x="345" y="40" width="20" height="60" fill="url(#hallCopperBus)" />

          {/* Anode 3 */}
          <rect
            x="420"
            y="100"
            width="70"
            height="150"
            rx="3"
            fill="url(#hallCarbonAnode)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <rect x="445" y="40" width="20" height="60" fill="url(#hallCopperBus)" />

          {/* Anode 4 */}
          <rect
            x="520"
            y="100"
            width="70"
            height="150"
            rx="3"
            fill="url(#hallCarbonAnode)"
            stroke="#f59e0b"
            strokeWidth="1"
          />
          <rect x="545" y="40" width="20" height="60" fill="url(#hallCopperBus)" />

          {/* Positive Anode Busbar Trunk */}
          <rect
            x="200"
            y="30"
            width="410"
            height="16"
            fill="url(#hallCopperBus)"
            rx="4"
            stroke="#ea580c"
            strokeWidth="1"
          />
          <text
            x="405"
            y="22"
            textAnchor="middle"
            fill="#f97316"
            fontSize="11"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {isClaim1Active
              ? `POSITIVE ANODE BUS (+) [${sim.currentAmperes.toLocaleString()} A · ${sim.totalCellVoltage} V]`
              : "CIRCUIT OPEN: INVERTED CLAIM 1 (NO MOLTEN CRYOLITE SOLVENT)"}
          </text>

          {/* 6. CO2 BUBBLE EVOLUTION ANIMATION (O2- + C -> CO2 + 4e-) */}
          {Array.from({ length: bubbleCount }).map((_, i) => {
            const bx = 225 + ((i * 32) % 360);
            const by = 235 - ((i * 7) % 30);
            return (
              <circle key={i} cx={bx} cy={by} r={2 + (i % 3)} fill="#ffffff" opacity={0.8}>
                <animate
                  attributeName="cy"
                  values={`${by};${by - 25};${by - 40}`}
                  dur="1.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.9;0.5;0"
                  dur="1.2s"
                  repeatCount="indefinite"
                />
              </circle>
            );
          })}

          {/* 7. ALUMINA HOPPER & FEEDING POINT */}
          <polygon
            points="270,140 290,140 285,185 275,185"
            fill="#94a3b8"
            stroke="#475569"
            strokeWidth="1"
          />
          <text
            x="280"
            y="130"
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="10"
            fontFamily="monospace"
          >
            Al₂O₃ Feed
          </text>

          {/* 8. MOLTEN METAL SIPHON TAP */}
          <path
            d="M 620 355 L 680 355 L 680 375 L 720 375"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <polygon points="720,370 735,375 720,380" fill="#e2e8f0" />
          <text
            x="715"
            y="360"
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize="10"
            fontFamily="monospace"
            fontWeight="bold"
          >
            Liquid Al ({sim.aluminiumProductionRateKgPerHour} kg/h)
          </text>

          {/* 9. ANNOTATION CALLOUT LABELS */}
          {/* Label D */}
          <g transform="translate(630, 240)">
            <line x1="0" y1="0" x2="-40" y2="20" stroke="#f59e0b" strokeWidth="1" />
            <rect
              x="5"
              y="-12"
              width="145"
              height="42"
              rx="4"
              fill="#0f172a"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x="12"
              y="4"
              fill="#f59e0b"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              Molten Cryolite (D)
            </text>
            <text x="12" y="18" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Na₃AlF₆ + Al₂O₃ ({sim.bathTemperatureCelsius}°C)
            </text>
            <text x="12" y="28" fill="#94a3b8" fontSize="8" fontFamily="monospace">
              ρ = 2.10 g/cm³ (Floats)
            </text>
          </g>

          {/* Label E */}
          <g transform="translate(630, 310)">
            <line x1="0" y1="0" x2="-30" y2="40" stroke="#38bdf8" strokeWidth="1" />
            <rect
              x="5"
              y="-12"
              width="145"
              height="42"
              rx="4"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text
              x="12"
              y="4"
              fill="#38bdf8"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              Liquid Aluminium Pool (E)
            </text>
            <text x="12" y="18" fill="#cbd5e1" fontSize="9" fontFamily="monospace">
              Cathode Pad (ρ = 2.28 g/cm³)
            </text>
            <text x="12" y="28" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              Dense metal sinks to bottom
            </text>
          </g>

          {/* Label C */}
          <g transform="translate(45, 120)">
            <line x1="85" y1="20" x2="175" y2="20" stroke="#f97316" strokeWidth="1" />
            <rect
              x="0"
              y="0"
              width="125"
              height="34"
              rx="4"
              fill="#0f172a"
              stroke="#f97316"
              strokeWidth="1"
            />
            <text
              x="8"
              y="14"
              fill="#f97316"
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="bold"
            >
              Carbon Anodes (C)
            </text>
            <text x="8" y="26" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
              2O²⁻ + C → CO₂ + 4e⁻
            </text>
          </g>
        </svg>
      </div>

      {/* Physics Control Sliders & Real-Time SI Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Controls */}
        <div className="lg:col-span-1 bg-parchment-100 dark:bg-ink-900/80 p-4 rounded-xl border border-parchment-300 dark:border-ink-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-bold border-b border-parchment-300 dark:border-ink-800 pb-2">
            <Flame className="w-3.5 h-3.5" />
            Smelting Cell Controls
          </div>

          <SensitivitySlider
            id="hall-2d-current"
            patentId="us-400766-hall-aluminium"
            paramKey="currentAmperes"
            label="Hall cell direct current in amperes"
            min={100000}
            max={500000}
            step={10000}
            value={currentAmperes}
            unit="A"
            thumb="cyan"
            allParams={params}
            onChange={(value) => updateParam("currentAmperes", value)}
          />
          <SensitivitySlider
            id="hall-2d-temperature"
            patentId="us-400766-hall-aluminium"
            paramKey="bathTemperatureCelsius"
            label="Cryolite bath temperature in degrees Celsius"
            min={920}
            max={1020}
            step={5}
            value={bathTemperatureCelsius}
            unit="°C"
            allParams={params}
            onChange={(value) => updateParam("bathTemperatureCelsius", value)}
          />
          <SensitivitySlider
            id="hall-2d-alumina"
            patentId="us-400766-hall-aluminium"
            paramKey="aluminaConcentrationPct"
            label="Alumina concentration by weight percentage"
            min={2}
            max={8}
            step={0.5}
            value={aluminaConcentrationPct}
            unit="wt%"
            allParams={params}
            onChange={(value) => updateParam("aluminaConcentrationPct", value)}
          />
          <p className="text-xs leading-relaxed text-ink-600 dark:text-ink-300">
            Slopes describe aluminium production in this modern teaching model, holding the other
            controls fixed. At 960 °C or 4 wt% the corresponding efficiency curve has a corner, so
            that control has no single local slope.
          </p>
        </div>

        {/* Live Telemetry Display */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-ink-900/80 border border-ink-800 space-y-1">
            <div className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">
              Al Production
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400">
              {sim.aluminiumProductionRateKgPerHour}
            </div>
            <div className="text-[10px] font-mono text-cyan-400/80">kg pure Al / hour</div>
          </div>

          <div className="p-3.5 rounded-xl bg-ink-900/80 border border-ink-800 space-y-1">
            <div className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">
              Current Efficiency
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400">
              {sim.currentEfficiencyPct}%
            </div>
            <div className="text-[10px] font-mono text-emerald-400/80">Faradaic yield (η)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-ink-900/80 border border-ink-800 space-y-1">
            <div className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">
              Cell Voltage
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400">
              {sim.totalCellVoltage} V
            </div>
            <div className="text-[10px] font-mono text-amber-400/80">1.18V rev + IR drop</div>
          </div>

          <div className="p-3.5 rounded-xl bg-ink-900/80 border border-ink-800 space-y-1">
            <div className="text-[10px] font-mono text-ink-400 uppercase tracking-wider">
              Specific Energy
            </div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400">
              {sim.specificEnergyKwhPerKg}
            </div>
            <div className="text-[10px] font-mono text-purple-400/80">kWh / kg Al</div>
          </div>

          {/* Bottom Descriptive Card */}
          <div className="col-span-2 sm:col-span-4 p-3.5 rounded-xl bg-ink-900/50 border border-ink-800 text-xs font-serif text-parchment-300 italic leading-relaxed">
            <strong className="font-sans font-bold text-parchment-100 not-italic">
              Electrochemical Reaction:{" "}
            </strong>
            2Al₂O₃ + 3C → 4Al(l) + 3CO₂(g). Cryolite (Na₃AlF₆) dissolves alumina at ~950°C, allowing
            Faraday electrodeposition of aluminium without consuming the fluoride solvent. Liquid
            aluminium metal (ρ = 2.28 g/cm³) sinks beneath the lighter molten electrolyte (ρ = 2.10
            g/cm³), shielding it from air re-oxidation.
          </div>
        </div>
      </div>
    </div>
  );
}
