"use client";

import { useId } from "react";
import {
  readStackhouseSourceControls,
  stepStackhouseSourceTopology,
} from "@/physics/stackhouseSourceKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

const PATENT_ID = "us-4068536-stackhouse-manipulator";
const POINT_P = { x: 390, y: 220 } as const;

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

function AngleSlider({ id, label, value, min, max, onChange }: SliderProps) {
  return (
    <label htmlFor={id} className="rounded-lg border border-border/40 bg-background/55 p-3">
      <span className="mb-2 flex justify-between gap-3 text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-mono text-primary">{value.toFixed(0)}°</span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
      />
    </label>
  );
}

export function StackhouseSourceBoundedSim() {
  const gradientId = useId();
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const controls = readStackhouseSourceControls(params);
  const pose = stepStackhouseSourceTopology(controls);

  const firstAxisAngle = -pose.alphaABRad;
  const bEnd = {
    x: POINT_P.x + Math.cos(firstAxisAngle) * 118,
    y: POINT_P.y + Math.sin(firstAxisAngle) * 118,
  };
  const terminalBase = {
    x: POINT_P.x + pose.terminalAxisOffset * 90,
    y: POINT_P.y,
  };
  const projectedMagnitude = Math.hypot(pose.toolDirection[0], pose.toolDirection[2]) || 1;
  const toolEnd = {
    x: terminalBase.x + (pose.toolDirection[2] / projectedMagnitude) * 142,
    y: terminalBase.y - (pose.toolDirection[0] / projectedMagnitude) * 142,
  };

  return (
    <section className="space-y-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Connected 3-roll wrist topology
          </h3>
          <p className="max-w-3xl text-xs leading-relaxed text-muted-foreground">
            A source-bounded drawing-space exhibit of shafts 15/16/19, housing shaft 14a, shaft 23,
            terminal shaft 26, and preferred intersection point P. Selected angles are teaching
            geometry; the patent prints only that both fixed oblique angles are greater than 45°.
          </p>
        </div>
        <button
          type="button"
          onClick={resetParams}
          className="rounded-md border border-border/60 bg-background px-3 py-1 text-xs font-medium text-foreground hover:bg-muted"
        >
          Reset
        </button>
      </header>

      <div className="overflow-hidden rounded-lg border border-border/30 bg-slate-950">
        <svg viewBox="0 0 720 440" className="aspect-[18/11] w-full" role="img">
          <title>Connected Stackhouse manipulator wrist topology</title>
          <desc>
            Three elbow-mounted hydraulic motors connect through concentric forearm shafts, bevel
            gears, nested housings, and a terminal shaft. The preferred axes meet at point P; an
            optional source contrast shows a small offset joined by a housing.
          </desc>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#334155" />
              <stop offset="0.55" stopColor="#94a3b8" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>

          <path
            d="M390 220 A152 152 0 0 1 542 68"
            fill="none"
            stroke="#0ea5e9"
            strokeDasharray="5 6"
            opacity="0.38"
          />
          <text x="502" y="82" fill="#7dd3fc" fontSize="10">
            source-described spherical sector
          </text>

          <rect
            x="105"
            y="190"
            width="285"
            height="60"
            rx="13"
            fill={`url(#${gradientId})`}
            stroke="#cbd5e1"
            strokeWidth="2"
          />
          {[0, 1, 2].map((index) => (
            <line
              key={index}
              x1="118"
              y1={211 + index * 9}
              x2="390"
              y2={211 + index * 9}
              stroke={["#0369a1", "#0ea5e9", "#7dd3fc"][index]}
              strokeWidth={7 - index * 1.5}
            />
          ))}
          <text x="165" y="179" fill="#cbd5e1" fontSize="11">
            forearm section 6 • concentric shafts 15, 16, 19
          </text>

          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(${65 + index * 42} 314)`}>
              <rect width="30" height="55" rx="6" fill="#0f766e" stroke="#5eead4" />
              <line x1="15" y1="0" x2={53 - index * 42} y2="-69" stroke="#5eead4" />
              <text x="15" y="73" textAnchor="middle" fill="#99f6e4" fontSize="10">
                9{String.fromCharCode(97 + index)}
              </text>
            </g>
          ))}
          <text x="42" y="399" fill="#99f6e4" fontSize="10">
            elbow-mounted hydraulic motors
          </text>

          <circle cx={POINT_P.x} cy={POINT_P.y} r="25" fill="#b45309" stroke="#fbbf24" />
          <path
            d={`M${POINT_P.x} ${POINT_P.y} L${bEnd.x} ${bEnd.y}`}
            stroke="#0284c7"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d={`M${POINT_P.x} ${POINT_P.y} L${bEnd.x} ${bEnd.y}`}
            stroke="#7dd3fc"
            strokeWidth="7"
            strokeDasharray="9 5"
          />
          <text x={bEnd.x - 6} y={bEnd.y - 13} fill="#7dd3fc" fontSize="10">
            housing shaft 14a / shaft 23
          </text>

          {pose.terminalAxisOffset > 0 && (
            <line
              x1={POINT_P.x}
              y1={POINT_P.y}
              x2={terminalBase.x}
              y2={terminalBase.y}
              stroke="#fb923c"
              strokeWidth="14"
              strokeLinecap="round"
            />
          )}
          <line
            x1={terminalBase.x}
            y1={terminalBase.y}
            x2={toolEnd.x}
            y2={toolEnd.y}
            stroke="#7e22ce"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <line
            x1={terminalBase.x}
            y1={terminalBase.y}
            x2={toolEnd.x}
            y2={toolEnd.y}
            stroke="#d8b4fe"
            strokeWidth="5"
          />
          <circle cx={toolEnd.x} cy={toolEnd.y} r="13" fill="#a855f7" stroke="#f3e8ff" />
          <text x={toolEnd.x + 15} y={toolEnd.y - 12} fill="#e9d5ff" fontSize="10">
            shaft 26 / mounting surface 14c
          </text>

          <circle
            cx={POINT_P.x}
            cy={POINT_P.y}
            r="6"
            fill="#ef4444"
            stroke="white"
            strokeWidth="2"
          />
          <text x={POINT_P.x - 13} y={POINT_P.y + 48} fill="#fca5a5" fontSize="11">
            P
          </text>

          <g transform="translate(18 18)">
            <rect width="235" height="115" rx="8" fill="#0f172a" stroke="#334155" />
            <text x="12" y="22" fill="#f8fafc" fontSize="11" fontWeight="bold">
              Source-bounded pose
            </text>
            <text x="12" y="43" fill="#7dd3fc" fontSize="10">
              A/B/C roll: {controls.forearmRollDeg.toFixed(0)}° /{" "}
              {controls.intermediateRollDeg.toFixed(0)}° / {controls.toolRollDeg.toFixed(0)}°
            </text>
            <text x="12" y="61" fill="#fbbf24" fontSize="10">
              Selected obliquities: {controls.firstObliqueAngleDeg.toFixed(0)}° /{" "}
              {controls.secondObliqueAngleDeg.toFixed(0)}°
            </text>
            <text x="12" y="79" fill="#c4b5fd" fontSize="10">
              Display bend: {pose.bendAngleDeg.toFixed(1)}°
            </text>
            <text
              x="12"
              y="97"
              fill={pose.terminalAxisOffset === 0 ? "#86efac" : "#fdba74"}
              fontSize="10"
            >
              {pose.orientationHoleState}
            </text>
          </g>
        </svg>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AngleSlider
          id="stackhouse-a-roll"
          label="Axis A–A′ roll"
          value={controls.forearmRollDeg}
          min={-180}
          max={180}
          onChange={(value) => updateParam("forearmRollDeg", value)}
        />
        <AngleSlider
          id="stackhouse-b-roll"
          label="Axis B–B′ roll"
          value={controls.intermediateRollDeg}
          min={-180}
          max={180}
          onChange={(value) => updateParam("intermediateRollDeg", value)}
        />
        <AngleSlider
          id="stackhouse-c-roll"
          label="Axis C–C′ roll"
          value={controls.toolRollDeg}
          min={-180}
          max={180}
          onChange={(value) => updateParam("toolRollDeg", value)}
        />
        <AngleSlider
          id="stackhouse-ab-angle"
          label="Selected A–B obliquity (>45°)"
          value={controls.firstObliqueAngleDeg}
          min={46}
          max={80}
          onChange={(value) => updateParam("firstObliqueAngleDeg", value)}
        />
        <AngleSlider
          id="stackhouse-bc-angle"
          label="Selected B–C obliquity (>45°)"
          value={controls.secondObliqueAngleDeg}
          min={46}
          max={80}
          onChange={(value) => updateParam("secondObliqueAngleDeg", value)}
        />
        <label className="flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/55 p-3 text-xs">
          <span>
            <span className="block font-medium text-foreground">Axis-intersection contrast</span>
            <span className="text-muted-foreground">
              Preferred point P vs permitted small deviation
            </span>
          </span>
          <input
            type="checkbox"
            checked={controls.singleIntersection >= 0.5}
            onChange={(event) => updateParam("singleIntersection", event.target.checked ? 1 : 0)}
            className="h-4 w-4 accent-primary"
          />
        </label>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
        <strong>Quantitative refusal:</strong> {pose.refusal.reason}
      </p>
    </section>
  );
}
