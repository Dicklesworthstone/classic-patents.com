import { Camera, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { stepCcdWells } from "@/physics/machineKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function BoyleSmithCcdSim() {
  const { params, updateParam } = usePatentPhysics("us-3923554-boyle-smith-ccd");
  const [clockPhase, setClockPhase] = useState<1 | 2 | 3>(1);
  const [lightIntensityLux, setLightIntensityLux] = useState<number>(850); // 100 to 2000 Lux
  const clockFreq = params.clockFreq ?? 2.5;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(
      () => {
        setClockPhase((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
      },
      Math.round(1000 / (clockFreq * 2)),
    );
    return () => clearInterval(interval);
  }, [isPlaying, clockFreq]);

  const ccd = stepCcdWells(clockPhase, lightIntensityLux, clockFreq);
  const photoElectrons = ccd.photoElectrons;
  const outputSignalMillivolts = ((photoElectrons * 1.602e-19) / 10e-15) * 1000;
  const chargeTransferEfficiency = ccd.cte;

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 sm:p-7 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Camera className="w-6 h-6 text-blue-500 animate-pulse" />
            <h3 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-50">
              Boyle &amp; Smith&apos;s Charge-Coupled Device Simulator (US 3,923,554)
            </h3>
          </div>
          <p className="text-sm sm:text-base text-ink-700 dark:text-ink-300 mt-1">
            Simulate 3-phase MOS potential energy wells shifting photo-electron charge packets
            across silicon to replace photographic chemical film.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors border shadow-sm ${
              isPlaying
                ? "bg-blue-600 text-white border-blue-700 animate-pulse"
                : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-300"
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isPlaying ? "Pause Clock" : "Run 3-Phase Clock"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Visual Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-[#0a0f1d] border border-parchment-300 dark:border-ink-800 p-6 relative min-h-[380px] overflow-hidden">
          <svg viewBox="0 0 600 320" className="w-full h-auto max-h-[340px]">
            {/* Background */}
            <rect width="600" height="320" fill="#090d16" />

            {/* Incident Photons (Yellow Arrows) */}
            {[100, 160, 220, 280, 340, 400].map((x) => (
              <g key={x} opacity="0.85">
                <line
                  x1={x - 20}
                  y1="20"
                  x2={x}
                  y2="65"
                  stroke="#fef08a"
                  strokeWidth="2"
                  strokeDasharray="3,3"
                />
                <polygon points={`${x},65 ${x - 4},55 ${x - 8},60`} fill="#fef08a" />
              </g>
            ))}
            <text
              x="60"
              y="35"
              fill="#fef08a"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
            >
              hν INCIDENT PHOTONS
            </text>

            {/* 3-Phase Gate Electrodes (Poly-Silicon Gates) */}
            <g transform="translate(60, 70)">
              {Array.from({ length: 9 }).map((_, i) => {
                const phaseNum = ((i % 3) + 1) as 1 | 2 | 3;
                const isHigh = phaseNum === clockPhase;
                const gx = i * 50;
                return (
                  <g key={i}>
                    {/* Gate Metal Bar */}
                    <rect
                      x={gx}
                      y="0"
                      width="45"
                      height="18"
                      fill={isHigh ? "#0284c7" : "#334155"}
                      stroke={isHigh ? "#38bdf8" : "#475569"}
                      strokeWidth="1.5"
                      rx="2"
                    />
                    <text
                      x={gx + 12}
                      y="13"
                      fill="#f8fafc"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      φ{phaseNum}
                    </text>
                    <text
                      x={gx + 10}
                      y="-6"
                      fill={isHigh ? "#38bdf8" : "#64748b"}
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {isHigh ? "+12V" : "+2V"}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Silicon Dioxide (SiO2) Dielectric Layer */}
            <rect x="60" y="90" width="460" height="10" fill="#38bdf8" opacity="0.6" />
            <text x="470" y="98" fill="#38bdf8" fontSize="8" fontFamily="monospace">
              SiO₂
            </text>

            {/* p-Type Silicon Substrate */}
            <rect
              x="60"
              y="100"
              width="460"
              height="160"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            <text
              x="80"
              y="240"
              fill="#64748b"
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
            >
              p-TYPE SILICON SUBSTRATE
            </text>

            {/* 3-Phase Surface Potential Energy Wells */}
            <g transform="translate(60, 100)">
              <path
                d={`M 0 0 ${Array.from({ length: 9 })
                  .map((_, i) => {
                    const phaseNum = ((i % 3) + 1) as 1 | 2 | 3;
                    const charge = ccd.wells[phaseNum - 1];
                    const depth = 12 + Math.min(70, (charge / 45000) * 65);
                    const gx = i * 50;
                    return `L ${gx} 0 L ${gx} ${depth} L ${gx + 45} ${depth} L ${gx + 45} 0`;
                  })
                  .join(" ")} L 460 0`}
                fill="#0369a1"
                opacity="0.35"
                stroke="#38bdf8"
                strokeWidth="2"
              />

              {/* Trapped Electron Charge Packets in Potential Wells */}
              {Array.from({ length: 3 }).map((_, i) => {
                const wellGateIndex = i * 3 + (clockPhase - 1);
                const px = wellGateIndex * 50 + 22;
                const py = 50;
                return (
                  <g key={i}>
                    {/* Electron Cloud Packet */}
                    <ellipse cx={px} cy={py} rx="16" ry="8" fill="#38bdf8" opacity="0.9" />
                    <text
                      x={px - 14}
                      y={py + 3}
                      fill="#090d16"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {photoElectrons.toLocaleString()}e⁻
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Output Sensing Node / Floating Diffusion Diode on Right */}
            <g transform="translate(525, 95)">
              <rect x="0" y="5" width="25" height="40" fill="#ef4444" opacity="0.7" rx="3" />
              <text
                x="-5"
                y="-5"
                fill="#ef4444"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                n+ DIODE
              </text>
              <line x1="25" y1="25" x2="55" y2="25" stroke="#ef4444" strokeWidth="2" />
              <circle cx="55" cy="25" r="4" fill="#fbbf24" />
              <text
                x="25"
                y="45"
                fill="#fbbf24"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                V_out: {outputSignalMillivolts.toFixed(1)} mV
              </text>
            </g>
          </svg>

          {/* Telemetry Strip */}
          <div className="w-full grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-mono pt-3 border-t border-ink-800 text-ink-300">
            <div>
              <span className="text-ink-400 block text-xs">CLOCK STATE</span>
              <span className="text-blue-400 font-bold text-sm sm:text-base">
                Phase φ{clockPhase} Active
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">PACKET CHARGE</span>
              <span className="text-emerald-400 font-bold text-sm sm:text-base">
                {photoElectrons.toLocaleString()} e⁻/pixel
              </span>
            </div>
            <div>
              <span className="text-ink-400 block text-xs">TRANSFER EFFICIENCY</span>
              <span className="text-purple-400 font-bold text-sm sm:text-base">
                {(chargeTransferEfficiency * 100).toFixed(3)}% CTE
              </span>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/70 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-base sm:text-lg text-ink-950 dark:text-parchment-50 block">
              CCD Image Sensor Controls
            </span>

            {/* Manual Phase Stepper Buttons */}
            <div className="space-y-1.5">
              <span className="text-xs sm:text-sm font-mono block text-ink-800 dark:text-ink-200 font-semibold mb-1">
                Manual 3-Phase Step
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs sm:text-sm font-mono">
                {[1, 2, 3].map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setClockPhase(phase as 1 | 2 | 3)}
                    className={`p-2.5 rounded-xl border text-center transition-colors shadow-2xs ${
                      clockPhase === phase
                        ? "bg-blue-700 text-white font-bold"
                        : "bg-parchment-200 dark:bg-ink-800 text-ink-800 dark:text-ink-200"
                    }`}
                  >
                    Phase φ{phase}
                  </button>
                ))}
              </div>
            </div>

            {/* Light Intensity Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"Incident Light Exposure ($I_{lux}$)"}
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {lightIntensityLux} Lux
                </span>
              </div>
              <input
                type="range"
                aria-label="Simulation parameter"
                min="100"
                max="2000"
                step="50"
                value={lightIntensityLux}
                onChange={(e) => setLightIntensityLux(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* 3-Phase Clock Frequency Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs sm:text-sm font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  {"3-Phase Clock Speed"}
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {clockFreq.toFixed(2)} MHz
                </span>
              </div>
              <input
                type="range"
                aria-label="3-Phase Clock Frequency"
                min="0.5"
                max="8.0"
                step="0.25"
                value={clockFreq}
                onChange={(e) => updateParam("clockFreq", Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-ink-950 dark:text-parchment-100 text-xs sm:text-sm font-sans">
              <span className="font-bold text-blue-900 dark:text-blue-300 block font-mono text-xs uppercase tracking-wider mb-1">
                Bucket-Brigade Charge Transfer:
              </span>
              <p className="leading-relaxed">
                By pulsing voltages across the 3-phase gates, potential wells move across the
                silicon like moving water buckets, delivering the photo-charge packet intact to the
                output diode without losing a single electron.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
