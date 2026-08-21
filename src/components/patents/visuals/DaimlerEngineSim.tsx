"use client";

import { usePatentPhysics } from "@/physics/usePatentPhysics";

function DaimlerMarineInstallationFace({
  shaftPosition,
  coolingPumpEnabled,
}: {
  shaftPosition: number;
  coolingPumpEnabled: number;
}) {
  const aheadContact = Math.max(0, Math.min(1, shaftPosition));
  const asternEngagement = Math.max(0, Math.min(1, -shaftPosition));
  const neutral = 1 - Math.min(1, Math.abs(shaftPosition));
  return (
    <div className="w-full rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:p-6 shadow-md">
      <div className="border-b border-parchment-200 dark:border-ink-800 pb-3 mb-4">
        <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
          Gottlieb Daimler Marine Propulsion Installation (US 361,931)
        </h3>
        <p className="font-sans text-xs text-ink-500 dark:text-ink-400 mt-1">
          In-line motor and sliding propeller shaft; ahead friction coupling, astern disks, cooling
          pipes, and gas reservoirs.
        </p>
      </div>
      <svg
        viewBox="0 0 720 300"
        className="w-full rounded-xl bg-sky-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800"
        role="img"
        aria-label="Marine installation with in-line motor, sliding propeller shaft, reverse disks, cooling pipes, and gas reservoirs"
      >
        <rect x="72" y="100" width="170" height="100" rx="12" fill="#475569" />
        <text x="157" y="155" textAnchor="middle" fill="white" fontSize="16">
          motor A
        </text>
        <line x1="242" y1="150" x2="588" y2="150" stroke="#b45309" strokeWidth="14" />
        <circle cx="280" cy="150" r="30" fill="#d97706" opacity={aheadContact} />
        <circle cx="320" cy="150" r="26" fill="#f59e0b" opacity={aheadContact} />
        <text x="300" y="90" textAnchor="middle" fontSize="14">
          sliding forward coupling
        </text>
        <circle cx="360" cy="150" r="24" fill="#94a3b8" opacity={asternEngagement} />
        <circle cx="420" cy="150" r="24" fill="#94a3b8" opacity={asternEngagement} />
        <line
          x1="360"
          y1="110"
          x2="360"
          y2="190"
          stroke="#92400e"
          strokeWidth="8"
          opacity={asternEngagement}
        />
        <line
          x1="420"
          y1="110"
          x2="420"
          y2="190"
          stroke="#92400e"
          strokeWidth="8"
          opacity={asternEngagement}
        />
        <text x="390" y="230" textAnchor="middle" fontSize="14">
          reverse disks and levers
        </text>
        <path
          d="M100 90 H520"
          fill="none"
          stroke="#b45309"
          strokeWidth="5"
          opacity={coolingPumpEnabled ? 1 : 0.35}
        />
        <path
          d="M100 215 H520"
          fill="none"
          stroke="#b45309"
          strokeWidth="5"
          opacity={coolingPumpEnabled ? 1 : 0.35}
        />
        <circle cx="500" cy="90" r="12" fill="#0f766e" opacity={coolingPumpEnabled ? 1 : 0.35} />
        <text x="500" y="95" textAnchor="middle" fill="white" fontSize="10">
          u
        </text>
        <text x="520" y="80" textAnchor="end" fontSize="13">
          fore / aft cooling pipes · pump {coolingPumpEnabled ? "on" : "off"}
        </text>
        <ellipse cx="610" cy="105" rx="38" ry="25" fill="#38bdf8" opacity="0.65" />
        <ellipse cx="610" cy="205" rx="38" ry="25" fill="#38bdf8" opacity="0.65" />
        <text x="610" y="145" textAnchor="middle" fontSize="13">
          gas
        </text>
        <text x="610" y="160" textAnchor="middle" fontSize="13">
          holders
        </text>
        <text x="90" y="270" fontSize="13">
          thrust-maintained ahead contact
        </text>
        <text x="460" y="270" textAnchor="middle" fontSize="13">
          ahead: {aheadContact.toFixed(2)} · neutral: {neutral.toFixed(2)} · astern:{" "}
          {asternEngagement.toFixed(2)}
        </text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3 text-center font-mono text-sm">
        <div className="rounded-xl bg-parchment-100 dark:bg-ink-900 p-2">
          Shaft position: {shaftPosition.toFixed(2)}
        </div>
        <div className="rounded-xl bg-parchment-100 dark:bg-ink-900 p-2">
          Thrust maintains ahead contact
        </div>
      </div>
    </div>
  );
}

export function DaimlerEngineSim() {
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");
  const shaftPosition = params.shaftPosition ?? 1;
  const coolingPumpEnabled = params.coolingPumpEnabled ?? 1;
  return (
    <div className="space-y-4">
      <DaimlerMarineInstallationFace
        shaftPosition={shaftPosition}
        coolingPumpEnabled={coolingPumpEnabled}
      />
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs font-medium text-ink-700 dark:text-ink-300">
          Propeller-shaft position: <span className="font-mono">{shaftPosition.toFixed(2)}</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={shaftPosition}
            onChange={(event) => updateParam("shaftPosition", Number(event.target.value))}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs font-medium text-ink-700 dark:text-ink-300">
          Cooling pump: <span className="font-mono">{coolingPumpEnabled ? "on" : "off"}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="1"
            value={coolingPumpEnabled}
            onChange={(event) => updateParam("coolingPumpEnabled", Number(event.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
