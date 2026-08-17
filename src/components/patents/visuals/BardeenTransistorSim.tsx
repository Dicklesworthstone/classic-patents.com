import { Cpu } from "lucide-react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function BardeenTransistorSim() {
  const { params, updateParam } = usePatentPhysics("us-2569347-bardeen-transistor");
  const emitterCurrentMa = params.emitterCurrent ?? 1.5;
  const collectorVoltageV = Math.abs(params.collectorBias ?? -40);
  const pointSpacingMicrons = params.pointSpacing ?? 50;

  // Solid-state calculations
  // Current transfer ratio alpha decreases with wider point spacing
  const geometricAlpha = Math.max(0.4, 1.8 * Math.exp(-pointSpacingMicrons / 80));
  // Reverse collector bias must be strong enough to sweep injected holes before they recombine.
  const collectionEfficiency = Math.min(1, Math.max(0.25, collectorVoltageV / 28));
  const alphaRatio = geometricAlpha * collectionEfficiency;
  const collectorCurrentMa = emitterCurrentMa * alphaRatio;
  const loadResistanceKohm = 20;
  const inputResistanceOhm = 250;
  const voltageGain = (alphaRatio * (loadResistanceKohm * 1000)) / inputResistanceOhm;
  const powerGainDb = (10 * Math.log10(Math.max(1e-6, voltageGain * alphaRatio))).toFixed(1);

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-emerald-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Bardeen &amp; Brattain&apos;s Point-Contact Transistor Simulator (US 2,569,347)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Simulate minority carrier hole injection in n-type germanium and solid-state power
            amplification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-mono font-bold border border-emerald-300 dark:border-emerald-800 shadow-2xs">
            +{powerGainDb} dB Power Gain (Solid-State)
          </div>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 320" className="w-full h-auto max-h-[340px]">
            {/* Background Lab */}
            <rect width="600" height="320" fill="#090d16" />

            {/* Germanium Crystal Block */}
            <g transform="translate(150, 160)">
              {/* Main Germanium Wedge */}
              <polygon
                points="0,0 300,0 270,100 30,100"
                fill="#334155"
                stroke="#64748b"
                strokeWidth="2"
              />
              <text
                x="100"
                y="55"
                fill="#94a3b8"
                fontSize="13"
                fontFamily="monospace"
                fontWeight="bold"
              >
                n-TYPE GERMANIUM CRYSTAL
              </text>

              {/* Base Electrode (Bottom Metal Plate) */}
              <rect
                x="25"
                y="100"
                width="250"
                height="15"
                fill="#d97706"
                stroke="#fbbf24"
                strokeWidth="1.5"
              />
              <text
                x="95"
                y="112"
                fill="#0f172a"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                BASE ELECTRODE
              </text>

              {/* Surface Depletion / Inversion Layer */}
              <rect x="20" y="0" width="260" height="12" fill="#0284c7" opacity="0.4" />
            </g>

            {/* Emitter Gold Contact (Left Point) */}
            <g transform={`translate(${280 - pointSpacingMicrons * 0.8}, 160)`}>
              {/* Gold Foil / Phosphor Bronze Whisker */}
              <polygon
                points="-12,-100 0,-100 0,0 -8,-2"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="3" fill="#ef4444" />
              <text
                x="-45"
                y="-110"
                fill="#ef4444"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                EMITTER (+)
              </text>
              <text x="-45" y="-95" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                {emitterCurrentMa} mA
              </text>
            </g>

            {/* Collector Gold Contact (Right Point) */}
            <g transform={`translate(${280 + pointSpacingMicrons * 0.8}, 160)`}>
              {/* Gold Foil / Phosphor Bronze Whisker */}
              <polygon
                points="0,-100 12,-100 8,-2 0,0"
                fill="#fbbf24"
                stroke="#d97706"
                strokeWidth="1.5"
              />
              <circle cx="0" cy="0" r="3" fill="#38bdf8" />
              <text
                x="10"
                y="-110"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                COLLECTOR (-)
              </text>
              <text x="10" y="-95" fill="#94a3b8" fontSize="9" fontFamily="monospace">
                -{collectorVoltageV}V / {collectorCurrentMa.toFixed(2)} mA
              </text>
            </g>

            {/* Minority Carrier Hole Injection Stream (Red moving to Collector) */}
            <g transform="translate(150, 160)">
              {Array.from({ length: 12 }).map((_, i) => {
                const startX = 130 - pointSpacingMicrons * 0.8;
                const endX = 130 + pointSpacingMicrons * 0.8;
                const frac = i / 12;
                const cx = startX + frac * (endX - startX);
                const cy = 4 + Math.sin(frac * Math.PI) * 10;
                return (
                  <g key={i}>
                    <circle cx={cx} cy={cy} r="3" fill="#ef4444" />
                    <text x={cx - 2} y={cy + 3} fill="#ffffff" fontSize="7" fontWeight="bold">
                      +
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Point Spacing Dimension Line */}
            <g transform="translate(280, 130)">
              <line
                x1={-pointSpacingMicrons * 0.8}
                y1="0"
                x2={pointSpacingMicrons * 0.8}
                y2="0"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <line
                x1={-pointSpacingMicrons * 0.8}
                y1="-5"
                x2={-pointSpacingMicrons * 0.8}
                y2="5"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <line
                x1={pointSpacingMicrons * 0.8}
                y1="-5"
                x2={pointSpacingMicrons * 0.8}
                y2="5"
                stroke="#f59e0b"
                strokeWidth="1.5"
              />
              <text
                x="-18"
                y="-8"
                fill="#f59e0b"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {pointSpacingMicrons} µm
              </text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">CURRENT GAIN (α)</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {alphaRatio.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">VOLTAGE GAIN</span>
              <span className="text-amber-400 font-bold text-sm sm:text-base">
                {voltageGain.toFixed(0)}x
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">POWER GAIN</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                +{powerGainDb} dB
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              Solid-State Transistor Controls
            </span>

            {/* Emitter Current Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Emitter Input Current ($I_E$)" />
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {emitterCurrentMa} mA
                </span>
              </div>
              <input
                type="range"
                aria-label="Emitter Input Current"
                min="0.5"
                max="4.0"
                step="0.1"
                value={emitterCurrentMa}
                onChange={(e) => updateParam("emitterCurrent", Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Contact Spacing Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Point Contact Spacing ($d$)" />
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {pointSpacingMicrons} µm
                </span>
              </div>
              <input
                type="range"
                aria-label="Point Contact Spacing"
                min="20"
                max="100"
                step="5"
                value={pointSpacingMicrons}
                onChange={(e) => updateParam("pointSpacing", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Collector Voltage Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  <TextWithLatex text="Reverse Collector Voltage ($V_C$)" />
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  -{collectorVoltageV} V
                </span>
              </div>
              <input
                type="range"
                aria-label="Reverse Collector Voltage"
                min="10"
                max="80"
                step="5"
                value={collectorVoltageV}
                onChange={(e) => updateParam("collectorBias", -Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-emerald-900 dark:text-emerald-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Minority Hole Injection:
              </span>
              <p className="leading-relaxed">
                Forward-biasing the emitter injects minority holes into the surface of the
                germanium. Because the collector contact is only {pointSpacingMicrons} µm away,
                almost all holes are captured by the reverse collector field, yielding{" "}
                {voltageGain.toFixed(0)}x voltage amplification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
