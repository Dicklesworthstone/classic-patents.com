"use client";

import { useEffect, useState } from "react";
import {
  type DaimlerKernelSource,
  daimlerKernelSource,
  ensureDaimlerWasm,
} from "@/physics/daimlerWasm";
import { FrankenSimEngine } from "@/physics/engine";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

function DaimlerMarineInstallationFace({
  shaftPosition,
  coolingPumpEnabled,
  kernelSource,
}: {
  shaftPosition: number;
  coolingPumpEnabled: number;
  kernelSource: DaimlerKernelSource;
}) {
  const topology = FrankenSimEngine.stepDaimlerMarineApparatus(
    shaftPosition,
    coolingPumpEnabled > 0.5,
  );
  const shaftDx = topology.shaftTranslationAlongAxisNormalized * 18;
  const driveState = topology.aheadCouplingEngaged
    ? "ahead"
    : topology.asternGearingEngaged
      ? "astern"
      : "neutral";
  const kernelLabel =
    kernelSource === "wasm"
      ? "compiled fs-mbd prismatic kernel"
      : kernelSource === "ts-fallback"
        ? "typed parity fallback"
        : "kernel loading";
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
        viewBox="0 0 760 340"
        className="w-full rounded-xl bg-sky-50 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800"
        role="img"
        aria-label="Connected marine installation with vessel foundation, gas motor, sliding propeller shaft, mutually exclusive ahead and astern contacts, cooling-water paths, reservoirs, propeller, and steering linkage"
      >
        <path
          d="M28 268 Q112 326 376 326 Q644 326 732 268 L710 304 Q650 334 376 334 Q100 334 48 304 Z"
          fill="#5b321e"
          opacity="0.82"
        />
        <path d="M50 292 H708" fill="none" stroke="#2f231c" strokeWidth="8" />
        <path
          d="M95 292 V255 M185 292 V255 M280 292 V255 M405 292 V255 M535 292 V255 M670 292 V255"
          stroke="#6f4933"
          strokeWidth="5"
        />
        <path d="M78 255 H680" fill="none" stroke="#6f4933" strokeWidth="9" />

        <g aria-label="connected gas reservoirs and supply line">
          <ellipse cx="70" cy="86" rx="31" ry="39" fill="#38bdf8" opacity="0.68" />
          <ellipse cx="113" cy="166" rx="38" ry="27" fill="#38bdf8" opacity="0.68" />
          <path d="M70 125 V139 H113" fill="none" stroke="#0e7490" strokeWidth="5" />
          <circle cx="91" cy="139" r="7" fill="#d97706" />
          <path d="M151 166 H177 V180" fill="none" stroke="#0e7490" strokeWidth="5" />
          <path d="M70 125 V255 M113 193 V255" stroke="#475569" strokeWidth="4" />
          <text x="70" y="91" textAnchor="middle" fill="#082f49" fontSize="12">
            w²
          </text>
          <text x="113" y="171" textAnchor="middle" fill="#082f49" fontSize="12">
            w¹
          </text>
          <text x="104" y="31" textAnchor="middle" fontSize="12">
            high → reducing cock → low pressure
          </text>
        </g>

        <g aria-label="motor A and water jacket">
          <rect x="158" y="146" width="142" height="108" rx="10" fill="#475569" />
          <rect x="192" y="82" width="72" height="72" rx="24" fill="#334155" />
          <rect
            x="181"
            y="76"
            width="94"
            height="84"
            rx="28"
            fill="none"
            stroke="#a9561d"
            strokeWidth="8"
          />
          <path d="M177 180 H158" stroke="#0e7490" strokeWidth="5" />
          <text x="229" y="204" textAnchor="middle" fill="white" fontSize="15">
            motor A
          </text>
          <text x="229" y="118" textAnchor="middle" fill="white" fontSize="11">
            water jacket
          </text>
        </g>

        <g aria-label="fixed motor shaft and ahead half coupling">
          <line x1="300" y1="218" x2="309" y2="218" stroke="#cbd5e1" strokeWidth="10" />
          <rect
            x="305"
            y="195"
            width="11"
            height="46"
            rx="4"
            fill={topology.aheadCouplingEngaged ? "#17875d" : "#c77c18"}
          />
          <text x="307" y="187" textAnchor="middle" fontSize="11">
            a
          </text>
        </g>

        <g
          transform={`translate(${shaftDx} 0)`}
          aria-label="longitudinally movable propeller shaft and attached members"
        >
          <line x1="326" y1="218" x2="649" y2="218" stroke="#b8c3ce" strokeWidth="10" />
          <rect
            x="318"
            y="195"
            width="15"
            height="46"
            rx="5"
            fill={topology.aheadCouplingEngaged ? "#17875d" : "#7b8794"}
          />
          <text x="326" y="187" textAnchor="middle" fontSize="11">
            a²
          </text>
          <circle
            cx="365"
            cy="218"
            r="21"
            fill={topology.asternGearingEngaged ? "#17875d" : "#c77c18"}
          />
          <text x="365" y="223" textAnchor="middle" fill="white" fontSize="11">
            c
          </text>
          <circle cx="649" cy="218" r="12" fill="#c77c18" />
          <path
            d="M649 218 L674 180 L660 216 Z M649 218 L674 256 L660 220 Z M649 218 L623 218 L646 207 Z"
            fill="#c77c18"
          />
          <text x="649" y="174" textAnchor="middle" fontSize="11">
            d
          </text>
        </g>

        <g aria-label="fixed shaft bearings and connected foundations">
          {[440, 560].map((x) => (
            <g key={x}>
              <circle cx={x} cy="218" r="18" fill="none" stroke="#c77c18" strokeWidth="7" />
              <path
                d={
                  "M" +
                  (x - 16) +
                  " 236 H" +
                  (x + 16) +
                  " L" +
                  (x + 24) +
                  " 255 H" +
                  (x - 24) +
                  " Z"
                }
                fill="#475569"
              />
            </g>
          ))}
          <text x="500" y="280" textAnchor="middle" fontSize="11">
            shaft b slides through fixed bearings
          </text>
        </g>

        <g aria-label="astern intermediate disks, levers, and fulcrums">
          <circle
            cx="383"
            cy="182"
            r="15"
            fill={topology.asternGearingEngaged ? "#17875d" : "#94a3b8"}
          />
          <circle
            cx="383"
            cy="254"
            r="15"
            fill={topology.asternGearingEngaged ? "#17875d" : "#94a3b8"}
          />
          <path
            d="M383 182 L411 161 V255 M383 254 L411 275 V255"
            fill="none"
            stroke="#92400e"
            strokeWidth="6"
          />
          <circle cx="411" cy="255" r="7" fill="#475569" />
          <text x="399" y="145" textAnchor="middle" fontSize="11">
            e¹/e² · f¹/f²
          </text>
        </g>
        <g aria-label="passive fore and aft cooling paths and optional pump branch">
          <path
            d="M42 295 Q78 261 114 238 Q154 214 181 200"
            fill="none"
            stroke="#0e7490"
            strokeWidth="6"
          />
          <path
            d="M275 200 Q365 224 488 248 Q610 272 705 295"
            fill="none"
            stroke="#0e7490"
            strokeWidth="6"
          />
          <path
            d="M395 295 V265 Q360 224 275 218"
            fill="none"
            stroke={topology.coolingPumpActive ? "#22b8cf" : "#64748b"}
            strokeWidth="5"
          />
          <circle
            cx="395"
            cy="263"
            r="13"
            fill={topology.coolingPumpActive ? "#0f766e" : "#64748b"}
          />
          <text x="395" y="267" textAnchor="middle" fill="white" fontSize="10">
            u
          </text>
          <text x="552" y="312" textAnchor="middle" fontSize="11">
            s¹/s² passive paths always present · pump u {topology.coolingPumpActive ? "on" : "off"}
          </text>
        </g>

        <g aria-label="connected steering chain and rudder">
          <circle cx="529" cy="95" r="22" fill="none" stroke="#c77c18" strokeWidth="5" />
          <path
            d="M529 117 V255 M550 95 Q622 95 693 137"
            fill="none"
            stroke="#475569"
            strokeWidth="4"
          />
          <path
            d="M693 126 V254 M693 177 L721 194 L721 249 L693 238 Z"
            fill="none"
            stroke="#6f4933"
            strokeWidth="7"
          />
          <text x="619" y="82" textAnchor="middle" fontSize="11">
            n chain → m rudder
          </text>
        </g>

        <g aria-label="thrust bearing and starter crank">
          <circle cx="284" cy="218" r="17" fill="none" stroke="#d1d5db" strokeWidth="5" />
          <path d="M280 203 V174 H299" fill="none" stroke="#c77c18" strokeWidth="5" />
          <text x="280" y="167" textAnchor="middle" fontSize="11">
            q · r¹
          </text>
        </g>

        <rect x="526" y="126" width="170" height="25" rx="12" fill="#0f172a" opacity="0.88" />
        <text x="611" y="143" textAnchor="middle" fill="white" fontSize="11">
          {driveState} · {kernelLabel}
        </text>
      </svg>
      <div className="mt-4 grid grid-cols-2 gap-3 text-center font-mono text-sm">
        <div className="rounded-xl bg-parchment-100 dark:bg-ink-900 p-2">
          Selector: {driveState} ({shaftPosition})
        </div>
        <div className="rounded-xl bg-parchment-100 dark:bg-ink-900 p-2">
          {topology.thrustCanMaintainAheadContact
            ? "Propeller thrust maintains ahead contact"
            : topology.asternGearingEngaged
              ? "Intermediate disks reverse the propeller"
              : "Both drive paths are open"}
        </div>
      </div>
    </div>
  );
}

export function DaimlerEngineSim() {
  const { params, updateParam } = usePatentPhysics("us-361931-daimler-engine");
  const [kernelSource, setKernelSource] = useState(daimlerKernelSource());
  const shaftPosition = params.shaftPosition ?? 1;
  const coolingPumpEnabled = params.coolingPumpEnabled ?? 0;

  useEffect(() => {
    let active = true;
    void ensureDaimlerWasm().then((nextSource) => {
      if (active) setKernelSource(nextSource);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <DaimlerMarineInstallationFace
        shaftPosition={shaftPosition}
        coolingPumpEnabled={coolingPumpEnabled}
        kernelSource={kernelSource}
      />
      <div className="grid grid-cols-1 gap-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs font-medium text-ink-700 dark:text-ink-300">
          Propeller-shaft position: <span className="font-mono">{shaftPosition.toFixed(2)}</span>
          <input
            type="range"
            min="-1"
            max="1"
            step="1"
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
