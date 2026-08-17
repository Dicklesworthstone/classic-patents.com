"use client";

import { AlertOctagon, Gauge } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";

export function WestinghouseAirBrakeSim() {
  const { params, updateParam } = usePatentPhysics("us-124404-westinghouse-air-brake");
  const trainPipePressurePsi = params.trainPipePressure ?? 70;
  const carMassTonnes = params.carMass ?? 35;

  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [trainSpeedMph, setTrainSpeedMph] = useState<number>(45);

  const isEmergency = trainPipePressurePsi < 10;
  const isService = trainPipePressurePsi < 60 && !isEmergency;
  const isRelease = trainPipePressurePsi >= 65;

  // Cylinder pressure equalizes inversely with pipe pressure
  const cylPressurePsi = Math.max(0, Math.min(55, Math.round((70 - trainPipePressurePsi) * 1.1)));
  const pistonStrokePx = Math.round((cylPressurePsi / 55) * 18); // 0 to 18px stroke
  const shoeDistancePx = Math.max(0, 18 - pistonStrokePx);

  const pistonThrustKn = ((cylPressurePsi * 78.5 * 5 * 4.44822) / 1000).toFixed(1);

  // Wheel animation loop
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      setTrainSpeedMph((prev) => {
        if (cylPressurePsi > 5) {
          // Decelerate proportionally to clamping pressure
          const decel = (cylPressurePsi / 50) * 18 * dt;
          return Math.max(0, prev - decel);
        }
        // Accelerate back to 45 mph if release
        return Math.min(45, prev + 10 * dt);
      });

      setWheelRotation((prev) => (prev + trainSpeedMph * 8 * dt) % 360);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [cylPressurePsi, trainSpeedMph]);

  const setPreset = (psi: number, _mode?: string) => {
    updateParam("trainPipePressure", psi);
    if (psi < 10) {
      // Violent pneumatic dump
      soundEngine.playTone(180, 400, "sawtooth", 0.4);
    } else if (psi < 60) {
      // Service hiss
      soundEngine.playTone(400, 200, "sine", 0.25);
    } else {
      // Release recharge
      soundEngine.playTone(600, 150, "triangle", 0.2);
    }
  };

  return (
    <div className="rounded-2xl border border-amber-900/20 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-patent space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-600 dark:text-amber-500 animate-pulse" />
            <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Westinghouse Automatic Triple-Valve Air Brake (US 124,404)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-1">
            Simulate George Westinghouse&apos;s fail-safe train brake: vent the continuous train
            line to watch the triple-valve piston shift, discharging auxiliary reservoir air into
            the brake cylinder to clamp spinning wheels.
          </p>
        </div>

        {/* Engineer Valve Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPreset(70, "Release")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isRelease
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-parchment-300"
            }`}
          >
            Running (70 psi)
          </button>
          <button
            type="button"
            onClick={() => setPreset(45, "Service")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              isService
                ? "bg-amber-600 text-white shadow-sm"
                : "border border-parchment-300 dark:border-ink-700 bg-white/80 dark:bg-ink-900/80 text-ink-700 dark:text-parchment-300"
            }`}
          >
            Service (45 psi)
          </button>
          <button
            type="button"
            onClick={() => setPreset(0, "Emergency")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
              isEmergency
                ? "bg-red-600 text-white shadow-md animate-pulse"
                : "border border-red-300 dark:border-red-900/50 bg-red-500/10 text-red-700 dark:text-red-400"
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Emergency (0 psi)</span>
          </button>
        </div>
      </div>

      {/* Visual Canvas & Pneumatic Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG Schematic */}
        <div className="lg:col-span-8 relative bg-[#0a0f1d] rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center justify-center min-h-[420px] overflow-hidden select-none">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none" />

          {/* Speed HUD */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-ink-900/90 border border-parchment-300 dark:border-ink-700 rounded-xl text-xs font-mono flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-ink-400">Train Speed:</span>
              <span className="text-amber-400 font-bold">{trainSpeedMph.toFixed(1)} MPH</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-ink-700 pl-3">
              <span className="text-ink-400">Clamping Force:</span>
              <span className="text-emerald-400 font-bold">{pistonThrustKn} kN</span>
            </div>
          </div>

          <svg viewBox="0 0 520 340" className="w-full max-w-lg h-auto relative z-10">
            {/* Continuous Train Pipe (Bottom Line) */}
            <g transform="translate(20, 290)">
              <line
                x1="0"
                y1="0"
                x2="480"
                y2="0"
                stroke={trainPipePressurePsi > 40 ? "#10b981" : "#ef4444"}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <line
                x1="0"
                y1="0"
                x2="480"
                y2="0"
                stroke="#0f172a"
                strokeWidth="2"
                strokeDasharray="6,4"
              />
              <text
                x="240"
                y="20"
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                CONTINUOUS TRAIN PIPE ({trainPipePressurePsi} PSI) — FROM LOCOMOTIVE
              </text>
            </g>

            {/* Pipe Riser to Triple Valve */}
            <line
              x1="120"
              y1="290"
              x2="120"
              y2="200"
              stroke={trainPipePressurePsi > 40 ? "#10b981" : "#ef4444"}
              strokeWidth="6"
            />

            {/* TRIPLE VALVE HOUSING (Cutaway Section) */}
            <g transform="translate(70, 70)">
              {/* Outer Casting */}
              <rect
                x="0"
                y="0"
                width="100"
                height="130"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                rx="4"
              />
              <rect
                x="10"
                y="10"
                width="80"
                height="110"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1"
              />

              {/* Triple Valve Differential Piston */}
              {/* Piston moves UP during release (y=20), DOWN during application (y=65) */}
              <g transform={`translate(15, ${isRelease ? 20 : 65})`}>
                <rect
                  x="0"
                  y="0"
                  width="70"
                  height="14"
                  fill="#f59e0b"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  rx="2"
                />
                <rect x="30" y="14" width="10" height="25" fill="#cbd5e1" />
                {/* D-Slide Valve */}
                <rect x="22" y="39" width="26" height="14" fill="#38bdf8" stroke="#0284c7" rx="1" />
                <path d="M 28 46 Q 35 40 42 46" fill="none" stroke="#0f172a" strokeWidth="2" />
              </g>

              {/* Ports */}
              {/* Top Port to Aux Reservoir */}
              <circle cx="85" cy="25" r="4" fill="#38bdf8" />
              {/* Bottom Port to Brake Cyl */}
              <circle cx="85" cy="85" r="4" fill={cylPressurePsi > 10 ? "#ef4444" : "#64748b"} />
              {/* Exhaust Port */}
              <circle cx="15" cy="85" r="3" fill="#94a3b8" />

              <text
                x="50"
                y="-8"
                fill="#f59e0b"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                TRIPLE VALVE
              </text>
              <text
                x="50"
                y="125"
                fill="#64748b"
                fontSize="7"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {isRelease ? "UP (CHARGE/REL)" : "DOWN (APPLY)"}
              </text>
            </g>

            {/* AUXILIARY RESERVOIR (Pressure Storage Tank) */}
            <g transform="translate(220, 50)">
              <rect
                x="0"
                y="0"
                width="110"
                height="60"
                rx="30"
                fill="#1e3a8a"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="60"
                stroke="#2563eb"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <line
                x1="80"
                y1="0"
                x2="80"
                y2="60"
                stroke="#2563eb"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text
                x="55"
                y="34"
                fill="#93c5fd"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                AUX RESERVOIR
              </text>
              <text
                x="55"
                y="46"
                fill="#60a5fa"
                fontSize="8"
                fontFamily="monospace"
                textAnchor="middle"
              >
                70 PSI CHARGED
              </text>
            </g>

            {/* Conduit: Triple Valve to Aux Reservoir */}
            <line x1="170" y1="95" x2="220" y2="80" stroke="#38bdf8" strokeWidth="4" />

            {/* BRAKE CYLINDER & FOUNDATION LEVER */}
            <g transform="translate(220, 140)">
              {/* Cylinder Body */}
              <rect
                x="0"
                y="0"
                width="80"
                height="50"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="2"
                rx="3"
              />
              <rect x="5" y="5" width="70" height="40" fill="#0f172a" />

              {/* Internal Piston & Pushrod */}
              <g transform={`translate(${15 + pistonStrokePx}, 8)`}>
                <rect x="0" y="0" width="8" height="34" fill="#ef4444" stroke="#dc2626" />
                <rect x="8" y="14" width="45" height="6" fill="#cbd5e1" stroke="#94a3b8" />
              </g>

              {/* Return Spring */}
              <path
                d="M 30 18 Q 40 14 50 18 Q 60 22 70 18"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              <text
                x="40"
                y="-6"
                fill="#f87171"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                BRAKE CYLINDER ({cylPressurePsi} PSI)
              </text>
            </g>

            {/* Conduit: Triple Valve to Brake Cylinder */}
            <line
              x1="170"
              y1="155"
              x2="220"
              y2="165"
              stroke={cylPressurePsi > 10 ? "#ef4444" : "#334155"}
              strokeWidth="4"
            />

            {/* RAILCAR WHEEL & FOUNDATION BRAKE SHOE */}
            <g transform="translate(420, 200)">
              {/* Steel Rail Track */}
              <line x1="-70" y1="70" x2="70" y2="70" stroke="#94a3b8" strokeWidth="5" />
              <line x1="-70" y1="75" x2="70" y2="75" stroke="#475569" strokeWidth="8" />

              {/* Spinning Railcar Wheel */}
              <g transform={`rotate(${wheelRotation})`}>
                <circle cx="0" cy="0" r="68" fill="#1e293b" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="0" cy="0" r="54" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="0" r="16" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                {/* Wheel Spokes */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1="0"
                    x2={54 * Math.cos((i * 60 * Math.PI) / 180)}
                    y2={54 * Math.sin((i * 60 * Math.PI) / 180)}
                    stroke="#64748b"
                    strokeWidth="3"
                  />
                ))}
              </g>

              {/* Brake Shoe & Lever */}
              {/* Brake shoe moves inward from x=-88 to x=-70 as cylinder stroke increases */}
              <g transform={`translate(${-88 + (18 - shoeDistancePx)}, 0)`}>
                {/* Curved Cast-Iron Brake Shoe */}
                <path
                  d="M 12 -35 Q 20 0 12 35 L 4 35 Q 12 0 4 -35 Z"
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                {/* Brake Head & Beam */}
                <rect x="-8" y="-12" width="12" height="24" fill="#475569" stroke="#64748b" />
              </g>

              {/* Friction Sparks when clamped during spin */}
              {cylPressurePsi > 15 && trainSpeedMph > 2 && (
                <g transform="translate(-70, 20)">
                  <polygon
                    points="0,0 -8,-6 -3,-2 -12,-4 -4,4"
                    fill="#fbbf24"
                    className="animate-ping"
                  />
                  <polygon
                    points="0,0 -12,8 -6,2 -16,6 -4,-4"
                    fill="#f97316"
                    className="animate-pulse"
                  />
                </g>
              )}

              <text
                x="0"
                y="100"
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                33-INCH STEEL WHEEL
              </text>
            </g>
          </svg>
        </div>

        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-5 space-y-4 shadow-sm">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Pneumatic Brake Controls
            </span>

            {/* Train Pipe Pressure Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Train Pipe Pressure (Brake Valve)
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  {trainPipePressurePsi} PSI
                </span>
              </div>
              <input
                type="range"
                aria-label="Train Pipe Pressure (Brake Valve)"
                min="0"
                max="70"
                step="5"
                value={trainPipePressurePsi}
                onChange={(e) => updateParam("trainPipePressure", Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Railcar Gross Mass Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-semibold text-ink-800 dark:text-parchment-200">
                  Railcar Loaded Mass
                </span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  {carMassTonnes} tonnes
                </span>
              </div>
              <input
                type="range"
                aria-label="Railcar Loaded Mass"
                min="20"
                max="80"
                step="5"
                value={carMassTonnes}
                onChange={(e) => updateParam("carMass", Number(e.target.value))}
                className="w-full accent-cyan-600 cursor-pointer h-2 bg-parchment-300 dark:bg-ink-700 rounded-lg"
              />
            </div>

            {/* Live Pneumatic Telemetry */}
            <div className="space-y-2 pt-2 border-t border-parchment-300 dark:border-ink-800 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Triple Valve State:</span>
                <span
                  className={`font-bold ${
                    isEmergency ? "text-red-500" : isService ? "text-amber-500" : "text-emerald-500"
                  }`}
                >
                  {isEmergency
                    ? "EMERGENCY DUMP"
                    : isService
                      ? "SERVICE APPLY"
                      : "RUNNING / CHARGE"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Brake Cylinder Pressure:</span>
                <span className="font-bold text-red-500">{cylPressurePsi} PSI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Piston Thrust Force:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {pistonThrustKn} kN
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-600 dark:text-ink-400">Rarefaction Wave Speed:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">340 m/s (Sonic)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-ink-900 dark:text-parchment-100 text-xs font-sans space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-300 block font-mono text-[11px] uppercase tracking-wider">
                Fail-Safe Pneumatic Principle:
              </span>
              <p className="leading-relaxed">
                By using continuous air pressure to hold the brakes released, any line rupture or
                accidental separation of railcars automatically applies the brakes with full
                reservoir force.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
