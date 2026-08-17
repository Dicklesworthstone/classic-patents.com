import { Cpu } from "lucide-react";
import { useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const STEPS = [
  {
    step: 0,
    title: "1. Monolithic P-Type Silicon Substrate",
    desc: "A single continuous crystalline silicon wafer provides the physical foundation for all transistors.",
  },
  {
    step: 1,
    title: "2. Thermal Silicon Dioxide (SiO₂) Passivation",
    desc: "Growing an insulating glass oxide layer prevents surface contamination and electrical short circuits.",
  },
  {
    step: 2,
    title: "3. Photolithographic Window Etching",
    desc: "Selective chemical acid etching opens precise microscopic access ports directly into the silicon below.",
  },
  {
    step: 3,
    title: "4. N-Type Impurity Gas Diffusion",
    desc: "High-temperature furnace dopant gas diffuses into the silicon to form self-isolated P-N diode junctions.",
  },
  {
    step: 4,
    title: "5. Vacuum Vapor-Deposited Aluminum Leads (The Breakthrough)",
    desc: "Noyce's central patent claim: evaporating flat aluminum traces over the oxide eliminates fragile hand-soldered wires.",
  },
];

export function NoycePlanarICSim() {
  const { params, updateParam } = usePatentPhysics("us-2981877-noyce-ic");
  const oxideThickness = params.oxideThickness ?? 0.5;
  const reverseBias = params.reverseBias ?? 5.0;
  const [activeLayerStep, setActiveLayerStep] = useState<number>(4); // 0: Substrate, 1: Oxide, 2: Windows, 3: Junctions, 4: Aluminum Leads

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-500" />
            <h3 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
              Noyce Monolithic Planar Silicon Microchip Simulator (US 2,981,877)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Explore the layer-by-layer planar process that enabled billions of microscopic
            transistors on a single silicon chip.
          </p>
        </div>

        {/* Manufacturing Step Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs font-mono">
          {STEPS.map((s) => (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveLayerStep(s.step)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeLayerStep === s.step
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
            >
              Layer {s.step + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Layer Cross Section SVG View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[360px]">
          {/* Blueprint Drafting Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none" />

          <svg viewBox="0 0 400 220" className="w-full max-w-md h-auto select-none relative z-10">
            {/* Base Monolithic Silicon Substrate (P-type) */}
            <rect
              x="40"
              y="110"
              width="320"
              height="80"
              rx="4"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            <text
              x="200"
              y="160"
              textAnchor="middle"
              fontSize="12"
              fill="#94a3b8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              Monolithic P-Type Silicon Substrate (Base Die)
            </text>

            {/* Diffused N-wells (Active Transistor Collector/Emitters) */}
            {activeLayerStep >= 3 && (
              <g>
                <rect
                  x="70"
                  y="110"
                  width="70"
                  height="35"
                  rx="3"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text
                  x="105"
                  y="132"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontFamily="monospace"
                >
                  N-Well #1
                </text>

                <rect
                  x="180"
                  y="110"
                  width="70"
                  height="35"
                  rx="3"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text
                  x="215"
                  y="132"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontFamily="monospace"
                >
                  N-Well #2
                </text>

                <rect
                  x="290"
                  y="110"
                  width="50"
                  height="35"
                  rx="3"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <text
                  x="315"
                  y="132"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fff"
                  fontFamily="monospace"
                >
                  N-Well #3
                </text>
              </g>
            )}

            {/* Thermal Silicon Dioxide (SiO2 Glass) Passivation Layer */}
            {activeLayerStep >= 1 && (
              <g>
                {activeLayerStep === 1 ? (
                  <rect
                    x="40"
                    y="90"
                    width="320"
                    height="20"
                    fill="#065f46"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    opacity="0.9"
                  />
                ) : (
                  // Windows appear at the etch step (layer 3 / step 2), not only after diffusion.
                  <g fill="#065f46" stroke="#10b981" strokeWidth="1.5" opacity="0.9">
                    <rect x="40" y="90" width="40" height="20" />
                    <rect x="120" y="90" width="70" height="20" />
                    <rect x="230" y="90" width="70" height="20" />
                    <rect x="330" y="90" width="30" height="20" />
                  </g>
                )}
                <text
                  x="200"
                  y="104"
                  textAnchor="middle"
                  fontSize="10"
                  fill="#a7f3d0"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  SiO₂ Silicon Dioxide Insulator Glass (Jean Hoerni Planar Oxide)
                </text>
              </g>
            )}

            {/* Vapor-Deposited Aluminum Interconnect Leads (Noyce Breakthrough) */}
            {activeLayerStep >= 4 && (
              <g>
                {/* Continuous evaporated aluminum metal traces */}
                <path
                  d="M 90,110 L 90,75 L 195,75 L 195,110"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 230,110 L 230,75 L 305,75 L 305,110"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text
                  x="200"
                  y="65"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#fde68a"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  Vapor-Deposited Aluminum Leads (No Flying Wires!)
                </text>
              </g>
            )}
          </svg>

          {/* Real-Time Telemetry Bar */}
          <div className="w-full text-center text-xs font-mono pt-3 border-t border-ink-800 text-ink-300">
            Current Stage:{" "}
            <span className="text-amber-400 font-bold">{STEPS[activeLayerStep].title}</span>
          </div>
        </div>

        {/* Step Explanation Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Planar Process Architecture
            </span>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-900 dark:text-parchment-100 space-y-2">
              <span className="font-serif font-bold text-sm text-blue-900 dark:text-blue-300 block">
                {STEPS[activeLayerStep].title}
              </span>
              <p className="text-xs font-sans text-ink-800 dark:text-parchment-200 leading-relaxed">
                {STEPS[activeLayerStep].desc}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-parchment-200 dark:border-ink-800">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ink-800 dark:text-parchment-200">
                    SiO₂ Oxide Thickness
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {oxideThickness.toFixed(2)} µm
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="SiO2 Oxide Thickness"
                  min="0.2"
                  max="1.2"
                  step="0.05"
                  value={oxideThickness}
                  onChange={(e) => updateParam("oxideThickness", Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-ink-800 dark:text-parchment-200">
                    P-N Isolation Reverse Bias
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                    {reverseBias.toFixed(1)} V
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="P-N Isolation Reverse Bias"
                  min="1"
                  max="20"
                  step="0.5"
                  value={reverseBias}
                  onChange={(e) => updateParam("reverseBias", Number(e.target.value))}
                  className="w-full accent-cyan-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <span className="font-bold text-ink-800 dark:text-parchment-200 block">
                Why This Beat Jack Kilby&apos;s Hybrid IC:
              </span>
              <p className="text-ink-600 dark:text-ink-400 font-sans text-xs leading-relaxed">
                Kilby&apos;s 1958 TI prototype required gold flying wires hand-soldered under
                microscopes, making mass production impossible. Noyce&apos;s planar IC fabricated
                all interconnects simultaneously using vacuum vapor-deposition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
