"use client";

import {
  ChevronLeft,
  ChevronRight,
  Compass,
  Layers,
  MapPin,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { teslaBAt, teslaFig4Strobe } from "@/physics/teslaKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type { PatentDrawing } from "@/types/patent";

interface InteractiveDiagramViewerProps {
  drawings: PatentDrawing[];
  patentNumber: string;
  patentId?: string;
}

const SCHEMATIC_HINTS: Array<[RegExp, string]> = [
  [/wright|821.?393/, "wright-flyer"],
  [/tesla[- ]coil|533.?367|593.?138/, "tesla-coil"],
  [/tesla|381.?968/, "tesla-motor"],
  [/edison|223.?898/, "edison-bulb"],
  [/farnsworth|1773980|1,773,980/, "farnsworth-tv"],
  [/spencer|microwave|2495429|2,495,429/, "spencer-microwave"],
  [/noyce|2981877|2,981,877/, "noyce-ic"],
  [/kwolek|kevlar|3671542|3,671,542/, "kwolek-kevlar"],
  [/bell|174465|174,465/, "bell-phone"],
  [/lincoln|buoy|6281/, "lincoln-buoy"],
  [/howe|sewing|4750/, "howe-sewing"],
  [/goddard|rocket|1155986|1,155,986/, "goddard-rocket"],
  [/bardeen|transistor|2569347|2,569,347/, "bardeen-transistor"],
  [/boyle|ccd|3923554|3,923,554/, "boyle-smith-ccd"],
  [/morse|telegraph|1647/, "morse-telegraph"],
  [/goodyear|rubber|3633/, "goodyear-rubber"],
  [/lamarr|hopping|2292387|2,292,387/, "lamarr-frequency-hopping"],
  [/marconi|586193|586,193/, "marconi-radio"],
  [/engelbart|mouse|3541541|3,541,541/, "engelbart-mouse"],
  [/fermi|reactor|2708656|2,708,656/, "fermi-reactor"],
  [/wozniak|apple|4136359|4,136,359/, "wozniak-apple"],
  [/einstein|refrigerator|1781541|1,781,541/, "einstein-refrigerator"],
  [/colt|revolver|138/, "colt-revolver"],
  [/otis|elevator|31128|31,128/, "otis-elevator"],
  [/whitney|cotton[- ]gin|x72/, "whitney-cotton-gin"],
  [/mccormick|reaper|x8277|4895|4,895/, "mccormick-reaper"],
  [/davenport|132/, "davenport-motor"],
  [/ericsson|propeller|588/, "ericsson-propeller"],
  [/corliss|steam|6162|6,162/, "corliss-engine"],
  [/gatling|battery|36836|36,836/, "gatling-gun"],
  [/nobel|dynamite|78317|78,317/, "nobel-dynamite"],
  [/sholes|typewriter|79265|79,265/, "sholes-typewriter"],
  [/hyatt|celluloid|105338|105,338/, "hyatt-celluloid"],
  [/gramme|dynamo|120057|120,057/, "gramme-dynamo"],
  [/westinghouse|air[- ]brake|124404|124,404/, "westinghouse-air-brake"],
  [/pasteur|fermentation|135245|135,245/, "pasteur-fermentation"],
  [/glidden|barbed[- ]wire|157124|157,124/, "glidden-barbed-wire"],
  [/otto|194047|194,047/, "otto-engine"],
  [/phonograph|200521|200,521/, "edison-phonograph"],
  [/pelton|water[- ]wheel|233692|233,692/, "pelton-water-wheel"],
  [/delaval|separator|247804|247,804/, "delaval-separator"],
  [/mergenthaler|linotype|313224|313,224/, "mergenthaler-linotype"],
  [/maxim|machine[- ]gun|319596|319,596/, "maxim-machine-gun"],
  [/thomson|welding|347140|347,140/, "thomson-welding"],
  [/daimler|361931|361,931/, "daimler-engine"],
  [/eastman|kodak|388850|388,850/, "eastman-kodak"],
  [/hollerith|tabulating|395781|395,781/, "hollerith-tabulating"],
  [/reno|escalator|470918|470,918/, "reno-escalator"],
  [/diesel|542846|542,846/, "diesel-engine"],
  [/parsons|turbine|608969|608,969/, "parsons-turbine"],
  [/teleautomaton|613809|613,809/, "tesla-teleautomaton"],
  [/zeppelin|airship|621195|621,195/, "zeppelin-airship"],
  [/linde|liquefaction|727650|727,650/, "linde-air-liquefaction"],
  [/carrier|condition|808897|808,897/, "carrier-air-conditioner"],
];

function resolveSchematicKind(
  svgType: string,
  figureNumber: string,
  patentNumber: string,
  patentId?: string,
): string {
  const known = new Set(SCHEMATIC_HINTS.map(([, kind]) => kind));
  if (known.has(svgType) || svgType === "wright-fig1" || svgType === "wright-fig2") {
    return svgType.startsWith("wright-fig") ? "wright-flyer" : svgType;
  }
  const hay = `${svgType} ${figureNumber} ${patentNumber} ${patentId ?? ""}`.toLowerCase();
  for (const [pattern, kind] of SCHEMATIC_HINTS) {
    if (pattern.test(hay)) return kind;
  }
  return "generic";
}

/**
 * Renders authentic historical blueprint vector schematics matching the patent's figure type.
 */
function renderHistoricalSchematic(
  svgType: string,
  figureNumber: string,
  patentNumber: string,
  patentId?: string,
  params?: Record<string, number>,
) {
  const kind = resolveSchematicKind(svgType, figureNumber, patentNumber, patentId);
  switch (kind) {
    case "wright-flyer": {
      const warp = ((params?.wingWarp ?? 8) / 15) * 12;
      const rudderAngle = (params?.rudder ?? params?.rudderAngle ?? 4) * 0.7;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Upper & Lower Biplane Wings with Dynamic Warping Differential */}
          <path
            d={`M 40 ${100 - warp} Q 200 80 360 ${100 + warp} Q 200 90 40 ${100 - warp} Z`}
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <path
            d={`M 40 ${190 - warp} Q 200 170 360 ${190 + warp} Q 200 180 40 ${190 - warp} Z`}
            fill="#0284c7"
            fillOpacity="0.15"
          />
          {/* Vertical Struts with Universal Pivots */}
          <line
            x1="80"
            y1={95 - warp * 0.7}
            x2="80"
            y2={185 - warp * 0.7}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          <line x1="160" y1="90" x2="160" y2="180" strokeWidth="2" stroke="#bae6fd" />
          <line x1="240" y1="90" x2="240" y2="180" strokeWidth="2" stroke="#bae6fd" />
          <line
            x1="320"
            y1={95 + warp * 0.7}
            x2="320"
            y2={185 + warp * 0.7}
            strokeWidth="2"
            stroke="#bae6fd"
          />
          {/* Diagonal Guy-Wires */}
          <line
            x1="80"
            y1={95 - warp * 0.7}
            x2="160"
            y2="180"
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1="160"
            y1="90"
            x2="80"
            y2={185 - warp * 0.7}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1="240"
            y1="90"
            x2="320"
            y2={185 + warp * 0.7}
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          <line
            x1="320"
            y1={95 + warp * 0.7}
            x2="240"
            y2="180"
            strokeDasharray="3 2"
            stroke="#7dd3fc"
          />
          {/* Forward Canard Elevator */}
          <rect
            x="140"
            y="35"
            width="120"
            height="24"
            rx="3"
            fill="#0369a1"
            fillOpacity="0.3"
            stroke="#38bdf8"
          />
          <line x1="150" y1="59" x2="180" y2="90" stroke="#bae6fd" />
          <line x1="250" y1="59" x2="220" y2="90" stroke="#bae6fd" />
          {/* Rear Vertical Rudder with Dynamic Coordinated Deflection */}
          <g transform={`rotate(${rudderAngle} 200 225)`}>
            <rect
              x="185"
              y="225"
              width="30"
              height="55"
              rx="2"
              fill="#0369a1"
              fillOpacity="0.3"
              stroke="#38bdf8"
            />
            <line x1="190" y1="185" x2="190" y2="225" stroke="#bae6fd" strokeWidth="2" />
            <line x1="210" y1="185" x2="210" y2="225" stroke="#bae6fd" strokeWidth="2" />
          </g>
          {/* Pilot Cradle */}
          <rect
            x="180"
            y="172"
            width="40"
            height="15"
            rx="3"
            fill="#f59e0b"
            fillOpacity="0.3"
            stroke="#f59e0b"
          />
        </g>
      );
    }
    case "tesla-motor": {
      const freq = params?.frequency ?? 60;
      const fieldIntensity = Math.min(1, Math.max(0.3, freq / 60));
      const omegaT = ((params?.omegaT ?? 0) * Math.PI) / 180;
      const live = teslaBAt(omegaT, 2);
      const strobe = teslaFig4Strobe(2);
      const arrow = (bx: number, by: number, len: number, opacity: number, width: number) => {
        const x2 = 200 + bx * len;
        const y2 = 150 - by * len;
        return (
          <g key={`${bx.toFixed(3)}-${by.toFixed(3)}-${opacity}`} opacity={opacity}>
            <line x1="200" y1="150" x2={x2} y2={y2} stroke="#ef4444" strokeWidth={width} />
          </g>
        );
      };
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <circle cx="200" cy="150" r="95" strokeWidth="2.5" stroke="#60a5fa" />
          <circle
            cx="200"
            cy="150"
            r="65"
            strokeWidth="1.5"
            stroke="#3b82f6"
            fill="#1e3a8a"
            fillOpacity={0.1 * fieldIntensity}
          />
          <rect
            x="180"
            y="58"
            width="40"
            height="26"
            rx="4"
            fill="#d97706"
            fillOpacity="0.3"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <rect
            x="180"
            y="216"
            width="40"
            height="26"
            rx="4"
            fill="#d97706"
            fillOpacity="0.3"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <rect
            x="108"
            y="130"
            width="26"
            height="40"
            rx="4"
            fill="#2563eb"
            fillOpacity="0.3"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <rect
            x="266"
            y="130"
            width="26"
            height="40"
            rx="4"
            fill="#2563eb"
            fillOpacity="0.3"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <circle
            cx="200"
            cy="150"
            r="42"
            fill="#047857"
            fillOpacity="0.2"
            stroke="#10b981"
            strokeWidth="2"
          />
          <circle cx="200" cy="150" r="8" fill="#10b981" />
          {strobe.map((s, i) => arrow(s.bx, s.by, 28, 0.18 + i * 0.04, 1.2))}
          {arrow(live.bx, live.by, 44, 1, 2.5)}
        </g>
      );
    }
    case "tesla-coil":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="70" y="230" width="260" height="18" rx="3" fill="#334155" stroke="#94a3b8" />
          <line x1="100" y1="230" x2="100" y2="170" stroke="#f59e0b" strokeWidth="3" />
          <line x1="300" y1="230" x2="300" y2="170" stroke="#f59e0b" strokeWidth="3" />
          <path
            d="M 120 170 C 120 120 160 80 200 80 C 240 80 280 120 280 170 Z"
            fill="#1e3a8a"
            fillOpacity="0.3"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <ellipse
            cx="200"
            cy="70"
            rx="50"
            ry="18"
            fill="#d97706"
            fillOpacity="0.4"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <line x1="200" y1="88" x2="200" y2="170" stroke="#fbbf24" strokeWidth="2.5" />
          <circle cx="160" cy="245" r="5" fill="#ef4444" />
          <circle cx="240" cy="245" r="5" fill="#ef4444" />
          <line x1="165" y1="245" x2="235" y2="245" stroke="#f87171" strokeDasharray="2 2" />
        </g>
      );
    case "edison-bulb": {
      const filamentTemp = params?.filamentTemp ?? 2100;
      const glowOpacity = Math.min(0.9, Math.max(0.2, (filamentTemp - 1800) / 1000));
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d="M 150 190 C 120 160 120 100 160 70 C 200 40 240 70 280 100 C 280 160 250 190 230 210 L 170 210 Z"
            fill="#fef08a"
            fillOpacity={glowOpacity * 0.3}
            stroke="#eab308"
            strokeWidth="2"
          />
          <path d="M 170 210 L 170 235 L 230 235 L 230 210 Z" fill="#64748b" stroke="#94a3b8" />
          <line x1="160" y1="245" x2="240" y2="245" stroke="#94a3b8" />
          <path
            d="M 185 220 L 185 140 C 185 90 215 90 215 140 L 215 220"
            stroke="#f59e0b"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="185" cy="220" r="4" fill="#d97706" />
          <circle cx="215" cy="220" r="4" fill="#d97706" />
        </g>
      );
    }
    case "fermi-reactor": {
      const rodWithdrawal = params?.rodWithdrawal ?? 83.5;
      const rodY = 20 + ((100 - rodWithdrawal) / 100) * 70;
      const modPurity = params?.moderatorPurity ?? 99.5;
      const keff = 0.85 + (rodWithdrawal / 100) * 0.18 * (modPurity / 100);
      const fuelGlow = keff > 1.002 ? "#ef4444" : keff >= 0.998 ? "#10b981" : "#3b82f6";
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="80"
            y="70"
            width="240"
            height="170"
            rx="4"
            fill="#1e293b"
            fillOpacity="0.6"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <line x1="80" y1="110" x2="320" y2="110" stroke="#475569" />
          <line x1="80" y1="150" x2="320" y2="150" stroke="#475569" />
          <line x1="80" y1="190" x2="320" y2="190" stroke="#475569" />
          <line x1="140" y1="70" x2="140" y2="240" stroke="#475569" />
          <line x1="200" y1="70" x2="200" y2="240" stroke="#475569" />
          <line x1="260" y1="70" x2="260" y2="240" stroke="#475569" />
          {/* Uranium fuel slug matrix with dynamic criticality color */}
          <circle cx="110" cy="90" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="170" cy="90" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="230" cy="90" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="290" cy="90" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="110" cy="170" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="170" cy="170" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="230" cy="170" r="9" fill={fuelGlow} stroke="#34d399" />
          <circle cx="290" cy="170" r="9" fill={fuelGlow} stroke="#34d399" />
          {/* Cadmium Control Rod moving dynamically into core */}
          <rect
            x="195"
            y={rodY}
            width="10"
            height="160"
            rx="2"
            fill="#ef4444"
            fillOpacity="0.9"
            stroke="#f87171"
            strokeWidth="1.5"
          />
        </g>
      );
    }
    case "wozniak-apple":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="50"
            y="60"
            width="80"
            height="60"
            rx="4"
            fill="#1e3a8a"
            fillOpacity="0.4"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <text x="90" y="95" fill="#93c5fd" fontSize="10" textAnchor="middle" fontWeight="bold">
            MOS 6502
          </text>
          <rect
            x="170"
            y="60"
            width="60"
            height="60"
            rx="4"
            fill="#7c2d12"
            fillOpacity="0.4"
            stroke="#f97316"
            strokeWidth="2"
          />
          <text x="200" y="95" fill="#fdba74" fontSize="10" textAnchor="middle" fontWeight="bold">
            MUX
          </text>
          <rect
            x="270"
            y="60"
            width="85"
            height="150"
            rx="4"
            fill="#065f46"
            fillOpacity="0.4"
            stroke="#34d399"
            strokeWidth="2"
          />
          <text x="312" y="140" fill="#6ee7b7" fontSize="10" textAnchor="middle" fontWeight="bold">
            48KB RAM
          </text>
          <rect
            x="50"
            y="150"
            width="80"
            height="60"
            rx="4"
            fill="#4c1d95"
            fillOpacity="0.4"
            stroke="#a855f7"
            strokeWidth="2"
          />
          <text x="90" y="185" fill="#d8b4fe" fontSize="10" textAnchor="middle" fontWeight="bold">
            Video Gen
          </text>
          <line x1="130" y1="90" x2="170" y2="90" stroke="#60a5fa" strokeWidth="2" />
          <line x1="130" y1="180" x2="170" y2="105" stroke="#a855f7" strokeWidth="2" />
          <line x1="230" y1="90" x2="270" y2="90" stroke="#f97316" strokeWidth="2" />
        </g>
      );
    case "engelbart-mouse":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d="M 120 220 L 120 100 C 120 60 160 50 200 50 C 240 50 280 60 280 100 L 280 220 Z"
            fill="#78350f"
            fillOpacity="0.3"
            stroke="#d97706"
            strokeWidth="2"
          />
          <rect x="180" y="40" width="40" height="20" rx="4" fill="#ef4444" stroke="#f87171" />
          <rect x="140" y="130" width="14" height="60" rx="2" fill="#d97706" stroke="#fbbf24" />
          <text x="147" y="205" fill="#fef3c7" fontSize="9" textAnchor="middle">
            X-Wheel
          </text>
          <rect x="210" y="150" width="60" height="14" rx="2" fill="#d97706" stroke="#fbbf24" />
          <text x="240" y="180" fill="#fef3c7" fontSize="9" textAnchor="middle">
            Y-Wheel
          </text>
        </g>
      );
    case "farnsworth-tv":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="55"
            y="95"
            width="290"
            height="110"
            rx="48"
            fill="#0f172a"
            fillOpacity="0.5"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          <circle cx="95" cy="150" r="28" fill="#0369a1" fillOpacity="0.4" stroke="#38bdf8" />
          <text x="95" y="154" fill="#bae6fd" fontSize="8" textAnchor="middle">
            CsO
          </text>
          <rect x="300" y="132" width="22" height="36" rx="3" fill="#f59e0b" fillOpacity="0.35" />
          <line x1="123" y1="150" x2="300" y2="150" stroke="#fbbf24" strokeDasharray="4 3" />
          <rect x="150" y="78" width="70" height="14" rx="2" fill="#d97706" fillOpacity="0.4" />
          <rect x="150" y="208" width="70" height="14" rx="2" fill="#d97706" fillOpacity="0.4" />
        </g>
      );
    case "spencer-microwave":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="50"
            y="55"
            width="300"
            height="190"
            rx="8"
            fill="#0f172a"
            fillOpacity="0.45"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <circle cx="110" cy="150" r="42" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return (
              <circle
                key={i}
                cx={110 + Math.cos(a) * 26}
                cy={150 + Math.sin(a) * 26}
                r="7"
                fill="#0f172a"
                stroke="#fbbf24"
              />
            );
          })}
          <path
            d="M 152 150 L 200 130 L 330 130 L 330 170 L 200 170 Z"
            fill="#7c3aed"
            fillOpacity="0.15"
            stroke="#a78bfa"
          />
          <circle cx="265" cy="150" r="16" fill="#f59e0b" fillOpacity="0.25" stroke="#fbbf24" />
        </g>
      );
    case "noyce-ic":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="70"
            y="70"
            width="260"
            height="160"
            rx="4"
            fill="#1e3a8a"
            fillOpacity="0.25"
            stroke="#60a5fa"
          />
          <rect
            x="90"
            y="150"
            width="50"
            height="50"
            fill="#64748b"
            fillOpacity="0.5"
            stroke="#94a3b8"
          />
          <rect
            x="170"
            y="150"
            width="50"
            height="50"
            fill="#64748b"
            fillOpacity="0.5"
            stroke="#94a3b8"
          />
          <rect
            x="250"
            y="150"
            width="50"
            height="50"
            fill="#64748b"
            fillOpacity="0.5"
            stroke="#94a3b8"
          />
          <rect
            x="80"
            y="110"
            width="240"
            height="10"
            fill="#f59e0b"
            fillOpacity="0.5"
            stroke="#fbbf24"
          />
          <line x1="115" y1="120" x2="115" y2="150" stroke="#fbbf24" strokeWidth="2" />
          <line x1="195" y1="120" x2="195" y2="150" stroke="#fbbf24" strokeWidth="2" />
          <line x1="275" y1="120" x2="275" y2="150" stroke="#fbbf24" strokeWidth="2" />
          <text x="200" y="98" fill="#93c5fd" fontSize="9" textAnchor="middle">
            SiO₂ + vapor-deposited Al
          </text>
        </g>
      );
    case "kwolek-kevlar":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {Array.from({ length: 5 }, (_, row) => (
            <g key={row}>
              <line
                x1="60"
                y1={80 + row * 30}
                x2="340"
                y2={80 + row * 30}
                stroke="#f59e0b"
                strokeWidth="3"
              />
              {Array.from({ length: 7 }, (_, col) => (
                <circle
                  key={col}
                  cx={80 + col * 40}
                  cy={80 + row * 30}
                  r="5"
                  fill={row % 2 === 0 ? "#38bdf8" : "#34d399"}
                />
              ))}
            </g>
          ))}
          <line x1="120" y1="80" x2="120" y2="200" stroke="#67e8f9" strokeDasharray="3 3" />
          <line x1="200" y1="80" x2="200" y2="200" stroke="#67e8f9" strokeDasharray="3 3" />
          <line x1="280" y1="80" x2="280" y2="200" stroke="#67e8f9" strokeDasharray="3 3" />
          <text x="200" y="250" fill="#fde68a" fontSize="9" textAnchor="middle">
            Nematic aramid H-bond lattice
          </text>
        </g>
      );
    case "bell-phone":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <ellipse
            cx="200"
            cy="70"
            rx="55"
            ry="16"
            fill="#334155"
            fillOpacity="0.4"
            stroke="#94a3b8"
          />
          <rect
            x="160"
            y="70"
            width="80"
            height="70"
            rx="6"
            fill="#1e293b"
            fillOpacity="0.4"
            stroke="#7dd3fc"
          />
          <rect
            x="175"
            y="145"
            width="50"
            height="28"
            rx="4"
            fill="#0f766e"
            fillOpacity="0.4"
            stroke="#2dd4bf"
          />
          <text x="200" y="163" fill="#99f6e4" fontSize="8" textAnchor="middle">
            H₂SO₄
          </text>
          <line x1="185" y1="140" x2="185" y2="200" stroke="#f59e0b" />
          <line x1="215" y1="140" x2="215" y2="200" stroke="#f59e0b" />
          <rect
            x="150"
            y="200"
            width="100"
            height="18"
            rx="3"
            fill="#78350f"
            fillOpacity="0.4"
            stroke="#d97706"
          />
        </g>
      );
    case "lincoln-buoy":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d="M 50 110 L 90 80 L 310 80 L 350 110 L 340 140 L 60 140 Z"
            fill="#1e3a8a"
            fillOpacity="0.25"
            stroke="#60a5fa"
            strokeWidth="2"
          />
          <rect
            x="80"
            y="140"
            width="70"
            height="40"
            rx="8"
            fill="#0f766e"
            fillOpacity="0.35"
            stroke="#2dd4bf"
          />
          <rect
            x="250"
            y="140"
            width="70"
            height="40"
            rx="8"
            fill="#0f766e"
            fillOpacity="0.35"
            stroke="#2dd4bf"
          />
          <line x1="50" y1="190" x2="350" y2="190" stroke="#38bdf8" strokeDasharray="6 4" />
          <line x1="115" y1="80" x2="115" y2="140" stroke="#f59e0b" />
          <line x1="285" y1="80" x2="285" y2="140" stroke="#f59e0b" />
        </g>
      );
    case "howe-sewing":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="70" y="190" width="260" height="22" rx="3" fill="#334155" stroke="#94a3b8" />
          <path d="M 90 190 L 90 90 L 220 90 L 220 130" stroke="#60a5fa" strokeWidth="3" />
          <circle cx="300" cy="150" r="32" stroke="#f59e0b" strokeWidth="2" />
          <line x1="300" y1="150" x2="322" y2="132" stroke="#fbbf24" strokeWidth="2" />
          <line x1="220" y1="130" x2="220" y2="175" stroke="#ef4444" strokeWidth="2" />
          <circle cx="220" cy="178" r="3" fill="#f87171" />
          <rect x="200" y="200" width="40" height="12" rx="2" fill="#d97706" fillOpacity="0.4" />
        </g>
      );
    case "goddard-rocket":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d="M 200 40 L 230 90 L 170 90 Z"
            fill="#1e3a8a"
            fillOpacity="0.4"
            stroke="#60a5fa"
          />
          <rect
            x="170"
            y="90"
            width="60"
            height="70"
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#38bdf8"
          />
          <rect
            x="174"
            y="162"
            width="52"
            height="40"
            fill="#1e293b"
            fillOpacity="0.5"
            stroke="#7dd3fc"
          />
          <path
            d="M 174 202 L 160 250 L 240 250 L 226 202 Z"
            fill="#7c2d12"
            fillOpacity="0.4"
            stroke="#f59e0b"
          />
          <path d="M 190 250 Q 200 275 210 250" fill="#ef4444" fillOpacity="0.5" stroke="#f97316" />
        </g>
      );
    case "bardeen-transistor":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="110"
            y="150"
            width="180"
            height="70"
            rx="4"
            fill="#64748b"
            fillOpacity="0.35"
            stroke="#94a3b8"
          />
          <text x="200" y="190" fill="#cbd5e1" fontSize="9" textAnchor="middle">
            n-Ge
          </text>
          <line x1="160" y1="70" x2="175" y2="150" stroke="#f59e0b" strokeWidth="2" />
          <line x1="240" y1="70" x2="225" y2="150" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="175" cy="150" r="4" fill="#fbbf24" />
          <circle cx="225" cy="150" r="4" fill="#7dd3fc" />
          <text x="150" y="64" fill="#fde68a" fontSize="9" textAnchor="middle">
            E
          </text>
          <text x="250" y="64" fill="#bae6fd" fontSize="9" textAnchor="middle">
            C
          </text>
        </g>
      );
    case "boyle-smith-ccd":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="60"
            y="160"
            width="280"
            height="50"
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <rect
            x="60"
            y="140"
            width="280"
            height="20"
            fill="#334155"
            fillOpacity="0.5"
            stroke="#94a3b8"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              x={70 + i * 45}
              y="100"
              width="36"
              height="40"
              fill={i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#38bdf8" : "#34d399"}
              fillOpacity="0.35"
              stroke="#e2e8f0"
            />
          ))}
          <path d="M 88 180 Q 133 150 178 180" stroke="#fde68a" fill="none" />
          <text x="200" y="80" fill="#93c5fd" fontSize="9" textAnchor="middle">
            φ1 · φ2 · φ3 charge packets
          </text>
        </g>
      );
    case "morse-telegraph":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="50"
            y="150"
            width="70"
            height="18"
            rx="3"
            fill="#78350f"
            fillOpacity="0.4"
            stroke="#d97706"
          />
          <line x1="85" y1="150" x2="120" y2="110" stroke="#94a3b8" strokeWidth="2" />
          <rect
            x="160"
            y="90"
            width="80"
            height="50"
            rx="4"
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <text x="200" y="120" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Relay
          </text>
          <rect
            x="280"
            y="130"
            width="70"
            height="40"
            rx="4"
            fill="#334155"
            fillOpacity="0.4"
            stroke="#f59e0b"
          />
          <text x="315" y="154" fill="#fde68a" fontSize="8" textAnchor="middle">
            Sounder
          </text>
          <line x1="120" y1="159" x2="160" y2="115" stroke="#38bdf8" />
          <line x1="240" y1="115" x2="280" y2="150" stroke="#38bdf8" />
        </g>
      );
    case "goodyear-rubber":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path d="M 70 80 Q 120 140 70 200" stroke="#f59e0b" strokeWidth="3" />
          <path d="M 140 70 Q 190 150 140 220" stroke="#f59e0b" strokeWidth="3" />
          <path d="M 220 75 Q 260 145 220 215" stroke="#f59e0b" strokeWidth="3" />
          <path d="M 300 85 Q 340 150 300 210" stroke="#f59e0b" strokeWidth="3" />
          <line x1="88" y1="120" x2="155" y2="125" stroke="#38bdf8" strokeWidth="2" />
          <line x1="155" y1="170" x2="235" y2="165" stroke="#38bdf8" strokeWidth="2" />
          <line x1="235" y1="110" x2="315" y2="120" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="122" cy="123" r="5" fill="#34d399" />
          <circle cx="195" cy="167" r="5" fill="#34d399" />
          <circle cx="275" cy="115" r="5" fill="#34d399" />
          <text x="200" y="250" fill="#6ee7b7" fontSize="9" textAnchor="middle">
            Sulfur S–S crosslinks
          </text>
        </g>
      );
    case "lamarr-frequency-hopping":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="50"
            y="60"
            width="300"
            height="160"
            rx="4"
            fill="#0f172a"
            fillOpacity="0.45"
            stroke="#64748b"
          />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1="70" y1={75 + i * 13} x2="330" y2={75 + i * 13} stroke="#1e293b" />
          ))}
          {[0, 3, 1, 7, 4, 9, 2, 6].map((row, i) => (
            <rect
              key={i}
              x={80 + i * 30}
              y={75 + row * 13}
              width="22"
              height="11"
              fill="#f59e0b"
              fillOpacity="0.7"
            />
          ))}
          <text x="200" y="245" fill="#fde68a" fontSize="9" textAnchor="middle">
            88-slot piano-roll hop sequence
          </text>
        </g>
      );
    case "marconi-radio":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <line x1="120" y1="50" x2="120" y2="200" stroke="#94a3b8" strokeWidth="3" />
          <line x1="80" y1="55" x2="160" y2="55" stroke="#f59e0b" strokeWidth="2" />
          <line x1="120" y1="200" x2="200" y2="200" stroke="#38bdf8" />
          <circle cx="230" cy="175" r="10" fill="#fbbf24" />
          <circle cx="260" cy="175" r="10" fill="#fbbf24" />
          <line x1="240" y1="175" x2="250" y2="175" stroke="#ef4444" strokeWidth="2" />
          <rect x="210" y="210" width="80" height="20" fill="#334155" stroke="#94a3b8" />
          <text x="250" y="224" fill="#cbd5e1" fontSize="8" textAnchor="middle">
            Earth
          </text>
        </g>
      );
    case "einstein-refrigerator":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect
            x="70"
            y="50"
            width="90"
            height="60"
            rx="6"
            fill="#7c2d12"
            fillOpacity="0.35"
            stroke="#f97316"
          />
          <text x="115" y="85" fill="#fdba74" fontSize="9" textAnchor="middle">
            Generator
          </text>
          <rect
            x="240"
            y="50"
            width="90"
            height="60"
            rx="6"
            fill="#1e3a8a"
            fillOpacity="0.35"
            stroke="#60a5fa"
          />
          <text x="285" y="85" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Condenser
          </text>
          <rect
            x="240"
            y="170"
            width="90"
            height="60"
            rx="6"
            fill="#0f766e"
            fillOpacity="0.35"
            stroke="#2dd4bf"
          />
          <text x="285" y="205" fill="#99f6e4" fontSize="9" textAnchor="middle">
            Evaporator
          </text>
          <rect
            x="70"
            y="170"
            width="90"
            height="60"
            rx="6"
            fill="#4c1d95"
            fillOpacity="0.35"
            stroke="#a855f7"
          />
          <text x="115" y="205" fill="#d8b4fe" fontSize="9" textAnchor="middle">
            Absorber
          </text>
          <line x1="160" y1="80" x2="240" y2="80" stroke="#f59e0b" />
          <line x1="285" y1="110" x2="285" y2="170" stroke="#38bdf8" />
          <line x1="240" y1="200" x2="160" y2="200" stroke="#34d399" />
          <line x1="115" y1="170" x2="115" y2="110" stroke="#a855f7" />
        </g>
      );
    case "colt-revolver": {
      const cockDeg = params?.cockingAngle ?? 45;
      const rotDeg = (cockDeg / 45) * 60;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Revolver Frame & Barrel */}
          <rect
            x="220"
            y="90"
            width="140"
            height="30"
            stroke="#60a5fa"
            strokeWidth="2"
            fill="#1e3a8a"
            fillOpacity="0.2"
            rx="2"
          />
          <path
            d="M 60 70 L 220 70 L 220 160 L 100 160 L 80 200 L 50 180 Z"
            stroke="#38bdf8"
            strokeWidth="2"
            fill="#0369a1"
            fillOpacity="0.2"
          />

          {/* Cylinder with chambers */}
          <rect
            x="130"
            y="80"
            width="85"
            height="55"
            stroke="#f59e0b"
            strokeWidth="2"
            fill="#78350f"
            fillOpacity="0.25"
            rx="3"
          />
          <rect x="130" y="86" width="80" height="12" stroke="#fbbf24" strokeDasharray="3,3" />
          <rect x="130" y="116" width="80" height="12" stroke="#fbbf24" strokeDasharray="3,3" />

          {/* Hammer & Pawl */}
          <g transform={`translate(100, 125) rotate(${-cockDeg})`}>
            <path
              d="M 0 0 L -12 -35 L 4 -60 L 15 -55 L 8 -30 Z"
              stroke="#cbd5e1"
              strokeWidth="2"
              fill="#334155"
            />
            <line x1="8" y1="-20" x2="28" y2="-15" stroke="#f59e0b" strokeWidth="3" />
          </g>

          {/* Ratchet Wheel */}
          <circle cx="126" cy="108" r="10" stroke="#f59e0b" strokeWidth="1.5" />

          {/* Detent Bolt */}
          <rect
            x="170"
            y="136"
            width="10"
            height="12"
            fill={cockDeg >= 44 ? "#34d399" : "#fbbf24"}
            stroke="#10b981"
          />

          <text x="290" y="82" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Rifled Barrel
          </text>
          <text x="172" y="74" fill="#fbbf24" fontSize="9" textAnchor="middle">
            6-Chamber Cylinder (Δθ={rotDeg.toFixed(0)}°)
          </text>
          <text x="65" y="55" fill="#bae6fd" fontSize="9">
            Pawl & Hammer
          </text>
        </g>
      );
    }
    case "otis-elevator": {
      const tension = params?.cableTension ?? 100;
      const isCut = tension < 15;
      const springBow = isCut ? 0 : 15;
      const pawlExt = isCut ? 15 : 4;
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Guide Rail Ratchets */}
          <line x1="80" y1="30" x2="80" y2="240" stroke="#64748b" strokeWidth="3" />
          <line x1="320" y1="30" x2="320" y2="240" stroke="#64748b" strokeWidth="3" />
          {[50, 80, 110, 140, 170, 200].map((y) => (
            <g key={y}>
              <polygon
                points={`80,${y} 90,${y + 6} 80,${y + 12}`}
                fill="#94a3b8"
                stroke="#cbd5e1"
              />
              <polygon
                points={`320,${y} 310,${y + 6} 320,${y + 12}`}
                fill="#94a3b8"
                stroke="#cbd5e1"
              />
            </g>
          ))}

          {/* Hoist Rope */}
          {!isCut ? (
            <line x1="200" y1="20" x2="200" y2={90 - springBow} stroke="#f59e0b" strokeWidth="3" />
          ) : (
            <path d="M 200 20 L 195 40 L 205 55" stroke="#ef4444" strokeWidth="2.5" />
          )}

          {/* Elevator Frame */}
          <rect
            x="100"
            y="100"
            width="200"
            height="120"
            stroke="#60a5fa"
            strokeWidth="2"
            fill="#1e3a8a"
            fillOpacity="0.2"
            rx="3"
          />

          {/* Transverse Leaf Spring */}
          <path d={`M 110 100 Q 200 ${100 - springBow} 290 100`} stroke="#38bdf8" strokeWidth="4" />

          {/* Safety Pawls */}
          <line
            x1="110"
            y1="100"
            x2={100 - pawlExt}
            y2="105"
            stroke={isCut ? "#34d399" : "#38bdf8"}
            strokeWidth="3.5"
          />
          <line
            x1="290"
            y1="100"
            x2={300 + pawlExt}
            y2="105"
            stroke={isCut ? "#34d399" : "#38bdf8"}
            strokeWidth="3.5"
          />

          <text x="200" y="70" fill="#fbbf24" fontSize="9" textAnchor="middle">
            {!isCut ? "Hoisting Cable" : "Rope Severed"}
          </text>
          <text x="200" y="140" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Cab Platform
          </text>
          <text
            x="200"
            y="180"
            fill={isCut ? "#34d399" : "#38bdf8"}
            fontSize="9"
            textAnchor="middle"
          >
            {isCut ? "PAWLS LOCKED IN RATCHETS" : "Leaf Spring Bowed Under Tension"}
          </text>
        </g>
      );
    }
    case "westinghouse-air-brake": {
      const pipePsi = params?.trainPipePressure ?? 70;
      const isRel = pipePsi >= 65;
      const isEmerg = pipePsi < 10;
      const cylPsi = Math.max(0, Math.min(55, Math.round((70 - pipePsi) * 1.1)));
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Continuous Train Pipe */}
          <line
            x1="40"
            y1="230"
            x2="360"
            y2="230"
            stroke={pipePsi > 40 ? "#10b981" : "#ef4444"}
            strokeWidth="5"
          />
          <text x="200" y="248" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Continuous Train Pipe ({pipePsi} PSI)
          </text>

          {/* Triple Valve Body */}
          <rect
            x="60"
            y="70"
            width="90"
            height="110"
            rx="4"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          {/* Differential Piston (Up in release, down in apply) */}
          <rect
            x="70"
            y={isRel ? 85 : 125}
            width="70"
            height="14"
            fill="#f59e0b"
            stroke="#d97706"
            rx="2"
          />
          <text x="105" y="60" fill="#f59e0b" fontSize="8" textAnchor="middle">
            Triple Valve
          </text>

          {/* Auxiliary Reservoir */}
          <rect
            x="180"
            y="50"
            width="100"
            height="55"
            rx="25"
            stroke="#3b82f6"
            fill="#1e3a8a"
            fillOpacity="0.3"
            strokeWidth="2"
          />
          <text x="230" y="82" fill="#93c5fd" fontSize="8" textAnchor="middle">
            Aux Reservoir (70 PSI)
          </text>

          {/* Brake Cylinder */}
          <rect
            x="180"
            y="130"
            width="80"
            height="45"
            rx="3"
            stroke="#f87171"
            fill="#7f1d1d"
            fillOpacity="0.2"
          />
          <rect x={190 + (cylPsi / 55) * 18} y="138" width="8" height="28" fill="#ef4444" />
          <line
            x1="200 + (cylPsi / 55) * 18"
            y1="152"
            x2="280"
            y2="152"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <text x="220" y="190" fill="#f87171" fontSize="8" textAnchor="middle">
            Cylinder ({cylPsi} PSI)
          </text>

          {/* Wheel & Shoe */}
          <circle cx="330" cy="152" r="35" stroke="#94a3b8" strokeWidth="3" />
          <path d="M 285 130 Q 292 152 285 174" stroke="#f59e0b" strokeWidth="4" fill="none" />
          <text x="330" y="200" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Rail Wheel
          </text>
        </g>
      );
    }
    case "mergenthaler-linotype":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Magazine Chute */}
          <polygon
            points="120,40 240,40 210,130 90,130"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          <line x1="140" y1="40" x2="110" y2="130" stroke="#38bdf8" strokeDasharray="3 3" />
          <line x1="180" y1="40" x2="150" y2="130" stroke="#38bdf8" strokeDasharray="3 3" />
          <line x1="220" y1="40" x2="190" y2="130" stroke="#38bdf8" strokeDasharray="3 3" />
          {/* Assembler Front & Line of Matrices */}
          <rect
            x="70"
            y="145"
            width="160"
            height="25"
            rx="3"
            stroke="#fbbf24"
            fill="#78350f"
            fillOpacity="0.25"
          />
          <text x="150" y="162" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Assembled Matrix Line + Spacebands
          </text>
          {/* Casting Mold Disk */}
          <circle cx="280" cy="180" r="45" stroke="#f87171" strokeWidth="2" />
          <rect
            x="260"
            y="172"
            width="40"
            height="16"
            fill="#dc2626"
            fillOpacity="0.4"
            stroke="#f87171"
          />
          <text x="280" y="240" fill="#f87171" fontSize="9" textAnchor="middle">
            Casting Mold & Lead Pump
          </text>
          {/* Distributor Bar Keyways */}
          <line x1="80" y1="20" x2="320" y2="20" stroke="#4ade80" strokeWidth="3" />
          <text x="200" y="15" fill="#4ade80" fontSize="9" textAnchor="middle">
            7-Bit Binary Distributor Bar
          </text>
        </g>
      );
    case "maxim-machine-gun":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Water Jacket */}
          <rect
            x="40"
            y="90"
            width="180"
            height="60"
            rx="4"
            stroke="#60a5fa"
            fill="#0284c7"
            fillOpacity="0.25"
          />
          <line x1="20" y1="120" x2="240" y2="120" stroke="#e2e8f0" strokeWidth="3" />
          {/* Breech Casing & Toggle Knee Joint */}
          <rect x="220" y="80" width="140" height="80" rx="3" stroke="#94a3b8" />
          <line
            x1="240"
            y1="120"
            x2="280"
            y2="105"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="280"
            y1="105"
            x2="330"
            y2="120"
            stroke="#fbbf24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="280" cy="105" r="4" fill="#fbbf24" />
          {/* Fusee Spring */}
          <path
            d="M 330 140 Q 350 150, 330 160 T 310 170"
            stroke="#4ade80"
            strokeWidth="2"
            strokeDasharray="3 2"
          />
          <text x="130" y="110" fill="#93c5fd" fontSize="9" textAnchor="middle">
            Water Jacket (4L)
          </text>
          <text x="280" y="70" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Toggle-Lock Linkage
          </text>
        </g>
      );
    case "daimler-engine":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Cylinder Bore */}
          <rect x="140" y="30" width="120" height="140" rx="4" stroke="#94a3b8" />
          {/* Hot-Tube Igniter */}
          <rect x="90" y="45" width="50" height="14" rx="2" fill="#f97316" stroke="#ea580c" />
          <text x="60" y="56" fill="#f97316" fontSize="8" textAnchor="middle">
            Hot Tube
          </text>
          {/* Piston & Connecting Rod */}
          <rect
            x="150"
            y="70"
            width="100"
            height="45"
            rx="3"
            fill="#38bdf8"
            fillOpacity="0.2"
            stroke="#38bdf8"
          />
          <line
            x1="200"
            y1="115"
            x2="200"
            y2="210"
            stroke="#e2e8f0"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Enclosed Flywheel Crankcase */}
          <circle cx="200" cy="220" r="50" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="200" cy="210" r="6" fill="#fbbf24" />
          <text x="200" y="285" fill="#fbbf24" fontSize="9" textAnchor="middle">
            Balanced Crankcase Flywheels
          </text>
        </g>
      );
    case "eastman-kodak":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Box Camera Body */}
          <rect
            x="80"
            y="50"
            width="240"
            height="180"
            rx="8"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.3"
          />
          {/* Film Supply & Take-Up Spools */}
          <circle cx="110" cy="90" r="22" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="110" cy="190" r="22" stroke="#fbbf24" strokeWidth="2" />
          <line x1="132" y1="90" x2="132" y2="190" stroke="#fbbf24" strokeWidth="2" />
          {/* Cone & Barrel Shutter */}
          <polygon
            points="150,140 260,100 260,180"
            stroke="#60a5fa"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <circle cx="280" cy="140" r="20" stroke="#38bdf8" strokeWidth="2" />
          <rect x="270" y="130" width="20" height="20" rx="2" fill="#38bdf8" fillOpacity="0.4" />
          <text x="110" y="145" fill="#fbbf24" fontSize="8" textAnchor="middle">
            100-Exposure Spool
          </text>
          <text x="280" y="175" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Rotary Barrel Shutter
          </text>
        </g>
      );
    case "hollerith-tabulating":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Press Head & Spring Pin Matrix */}
          <rect x="60" y="40" width="280" height="30" rx="3" fill="#64748b" stroke="#94a3b8" />
          {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((x) => (
            <line key={x} x1={x} y1="70" x2={x} y2="105" stroke="#fbbf24" strokeWidth="2" />
          ))}
          {/* Punched Card Interposed */}
          <rect x="70" y="105" width="260" height="15" rx="2" fill="#d97706" stroke="#b45309" />
          {/* Mercury Cup Bed */}
          <rect x="60" y="125" width="280" height="35" rx="4" fill="#0284c7" stroke="#0369a1" />
          {[80, 110, 140, 170, 200, 230, 260, 290, 320].map((x) => (
            <circle key={x} cx={x} cy="142" r="5" fill="#38bdf8" />
          ))}
          {/* Counter Dials Array */}
          <rect
            x="100"
            y="180"
            width="200"
            height="70"
            rx="6"
            stroke="#a855f7"
            fill="#581c87"
            fillOpacity="0.2"
          />
          <circle cx="140" cy="215" r="18" stroke="#c084fc" />
          <circle cx="200" cy="215" r="18" stroke="#c084fc" />
          <circle cx="260" cy="215" r="18" stroke="#c084fc" />
          <text x="200" y="270" fill="#c084fc" fontSize="9" textAnchor="middle">
            Solenoid Ratchet Dial Accumulators
          </text>
        </g>
      );
    case "reno-escalator":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* 25-Degree Incline Frame */}
          <line
            x1="40"
            y1="210"
            x2="340"
            y2="70"
            stroke="#64748b"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Moving Grooved Cleats */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 60 + i * 42;
            const y = 200 - i * 20;
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="22"
                height="10"
                rx="2"
                fill="#d97706"
                stroke="#fbbf24"
              />
            );
          })}
          {/* Comb-Plate Landings */}
          <polygon points="330,65 360,65 345,78" fill="#fbbf24" stroke="#b45309" />
          <polygon points="30,205 60,205 45,218" fill="#fbbf24" stroke="#b45309" />
          {/* Moving Handrail */}
          <line
            x1="40"
            y1="170"
            x2="340"
            y2="30"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="190" y="110" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Synchronous Moving Handrail
          </text>
          <text x="310" y="55" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Comb-Plate Teeth
          </text>
        </g>
      );
    case "diesel-engine":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* High-Pressure Cylinder */}
          <rect x="130" y="30" width="140" height="170" rx="6" stroke="#94a3b8" />
          {/* Blast-Air Injector */}
          <rect x="185" y="15" width="30" height="30" rx="3" fill="#fbbf24" stroke="#d97706" />
          <text x="200" y="10" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Blast-Air Injector (65 bar)
          </text>
          {/* Piston & Heavy Rod */}
          <rect
            x="140"
            y="75"
            width="120"
            height="55"
            rx="3"
            fill="#38bdf8"
            fillOpacity="0.2"
            stroke="#38bdf8"
          />
          <line
            x1="200"
            y1="130"
            x2="200"
            y2="230"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Crankshaft */}
          <circle cx="200" cy="240" r="40" stroke="#fbbf24" strokeWidth="2" />
          <text x="200" y="295" fill="#4ade80" fontSize="9" textAnchor="middle">
            Adiabatic Compression Ratio 18:1 (680°C)
          </text>
        </g>
      );
    case "tesla-teleautomaton":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Submersible Boat Hull */}
          <path
            d="M 60 160 C 120 120, 280 120, 340 160 C 280 200, 120 200, 60 160 Z"
            stroke="#60a5fa"
            fill="#1e3a8a"
            fillOpacity="0.2"
          />
          {/* Receiving Mast Antenna */}
          <line x1="200" y1="140" x2="200" y2="60" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="200" cy="55" r="5" fill="#fbbf24" />
          {/* Coherer & Decoherer */}
          <rect
            x="150"
            y="150"
            width="40"
            height="15"
            rx="2"
            fill="#38bdf8"
            fillOpacity="0.3"
            stroke="#38bdf8"
          />
          {/* Rotary Commutator Drum */}
          <circle cx="240" cy="160" r="16" stroke="#4ade80" strokeWidth="2" />
          <text x="200" y="45" fill="#fbbf24" fontSize="9" textAnchor="middle">
            RF Antenna (150 kHz Tuning)
          </text>
          <text x="170" y="180" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Coherer
          </text>
          <text x="240" y="190" fill="#4ade80" fontSize="8" textAnchor="middle">
            6-State Drum
          </text>
        </g>
      );
    case "zeppelin-airship":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Streamlined Outer Hull */}
          <ellipse
            cx="200"
            cy="140"
            rx="170"
            ry="50"
            stroke="#94a3b8"
            fill="#1e293b"
            fillOpacity="0.2"
          />
          {/* 17 Internal Gas Cells */}
          {Array.from({ length: 9 }).map((_, i) => (
            <ellipse
              key={i}
              cx={70 + i * 32}
              cy="140"
              rx="12"
              ry="42"
              stroke="#38bdf8"
              strokeOpacity="0.6"
              strokeDasharray="3 2"
            />
          ))}
          {/* Keel Corridor & Trim Weight */}
          <line x1="60" y1="180" x2="340" y2="180" stroke="#fbbf24" strokeWidth="2" />
          <circle cx="220" cy="180" r="5" fill="#fbbf24" />
          {/* Gondolas */}
          <rect x="120" y="190" width="30" height="12" rx="2" fill="#64748b" />
          <rect x="250" y="190" width="30" height="12" rx="2" fill="#64748b" />
          <text x="200" y="80" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Rigid Duralumin Space-Frame (128m)
          </text>
          <text x="200" y="215" fill="#fbbf24" fontSize="8" textAnchor="middle">
            Sliding Keel Ballast & Twin Engine Cars
          </text>
        </g>
      );
    case "linde-air-liquefaction":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Compressor */}
          <rect
            x="40"
            y="50"
            width="70"
            height="60"
            rx="4"
            stroke="#f87171"
            fill="#7f1d1d"
            fillOpacity="0.3"
          />
          <text x="75" y="85" fill="#f87171" fontSize="8" textAnchor="middle">
            200-Bar Comp
          </text>
          {/* Counter-Current Column */}
          <rect
            x="160"
            y="30"
            width="80"
            height="170"
            rx="6"
            stroke="#38bdf8"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          <path
            d="M 180 40 L 180 190 M 200 40 L 200 190 M 220 40 L 220 190"
            stroke="#38bdf8"
            strokeDasharray="4 2"
          />
          {/* JT Valve & Vacuum Vessel */}
          <polygon points="200,195 190,210 210,210" fill="#fbbf24" stroke="#d97706" />
          <rect
            x="170"
            y="215"
            width="60"
            height="40"
            rx="4"
            stroke="#38bdf8"
            fill="#0369a1"
            fillOpacity="0.4"
          />
          <text x="200" y="240" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Liquid Air (-193°C)
          </text>
          <text x="200" y="20" fill="#38bdf8" fontSize="9" textAnchor="middle">
            Counter-Current Regenerator
          </text>
        </g>
      );
    case "carrier-air-conditioner":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Plenum Chamber */}
          <rect
            x="40"
            y="60"
            width="320"
            height="140"
            rx="6"
            stroke="#94a3b8"
            fill="#0f172a"
            fillOpacity="0.3"
          />
          {/* Chilled Water Nozzle Sprays */}
          <line x1="120" y1="70" x2="120" y2="190" stroke="#0284c7" strokeWidth="3" />
          {[90, 120, 150, 180].map((y) => (
            <polygon
              key={y}
              points={`120,${y} 150,${y - 12} 150,${y + 12}`}
              fill="#38bdf8"
              fillOpacity="0.4"
            />
          ))}
          {/* Zigzag Baffles */}
          {[190, 205, 220].map((x) => (
            <polyline
              key={x}
              points={`${x},70 ${x + 8},100 ${x},130 ${x + 8},160 ${x},190`}
              stroke="#94a3b8"
              strokeWidth="2"
            />
          ))}
          {/* Steam Reheat Coil */}
          <rect
            x="270"
            y="70"
            width="18"
            height="120"
            rx="2"
            fill="#ef4444"
            fillOpacity="0.3"
            stroke="#ef4444"
          />
          <text x="120" y="50" fill="#38bdf8" fontSize="8" textAnchor="middle">
            Chilled Spray
          </text>
          <text x="205" y="50" fill="#94a3b8" fontSize="8" textAnchor="middle">
            Eliminators
          </text>
          <text x="280" y="50" fill="#ef4444" fontSize="8" textAnchor="middle">
            Reheat
          </text>
          <text x="200" y="225" fill="#4ade80" fontSize="9" textAnchor="middle">
            Psychrometric Dew-Point Control Cycle
          </text>
        </g>
      );
    default:
      return (
        <g stroke="#64748b" strokeWidth="1.5" fill="none">
          <ellipse cx="200" cy="150" rx="140" ry="70" />
          <line x1="60" y1="150" x2="340" y2="150" />
          <line x1="200" y1="80" x2="200" y2="220" />
          <rect x="140" y="105" width="120" height="90" rx="6" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="200" cy="150" r="28" stroke="#f59e0b" strokeWidth="2" />
        </g>
      );
  }
}

export function InteractiveDiagramViewer({
  drawings,
  patentNumber,
  patentId,
}: InteractiveDiagramViewerProps) {
  const { params: livePhysicsParams } = usePatentPhysics(patentId || "");
  const [activeFigIndex, setActiveFigIndex] = useState<number>(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);
  const [hoveredCalloutId, setHoveredCalloutId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [schematicTheme, setSchematicTheme] = useState<"blueprint" | "parchment" | "chalkboard">(
    "blueprint",
  );

  const activeDrawing = drawings[activeFigIndex] || drawings[0];
  const callouts = useMemo(() => activeDrawing?.callouts ?? [], [activeDrawing]);
  const activePin = callouts.find((c) => c.id === activeCalloutId);
  const currentPinIndex = callouts.findIndex((c) => c.id === activeCalloutId);

  const handlePrevPin = useCallback(() => {
    if (callouts.length === 0) return;
    if (currentPinIndex <= 0) {
      setActiveCalloutId(callouts[callouts.length - 1].id);
    } else {
      setActiveCalloutId(callouts[currentPinIndex - 1].id);
    }
  }, [callouts, currentPinIndex]);

  const handleNextPin = useCallback(() => {
    if (callouts.length === 0) return;
    if (currentPinIndex === -1 || currentPinIndex >= callouts.length - 1) {
      setActiveCalloutId(callouts[0].id);
    } else {
      setActiveCalloutId(callouts[currentPinIndex + 1].id);
    }
  }, [callouts, currentPinIndex]);

  // Keyboard navigation for pins
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPin();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPin();
      } else if (e.key === "Escape") {
        setActiveCalloutId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevPin, handleNextPin]);

  if (!activeDrawing) return null;

  // Theme palettes
  const themeStyles = {
    blueprint: {
      bg: "bg-[#061121]",
      grid: "bg-[linear-gradient(to_right,#0c2340_1px,transparent_1px),linear-gradient(to_bottom,#0c2340_1px,transparent_1px)] opacity-60",
      borderStroke: "#0ea5e9",
      textFill: "#7dd3fc",
      badgeClass: "bg-cyan-950/80 text-cyan-400 border-cyan-800",
    },
    parchment: {
      bg: "bg-[#fbf7ee]",
      grid: "bg-[linear-gradient(to_right,#e7dec8_1px,transparent_1px),linear-gradient(to_bottom,#e7dec8_1px,transparent_1px)] opacity-70",
      borderStroke: "#78350f",
      textFill: "#451a03",
      badgeClass: "bg-amber-100 text-amber-900 border-amber-300",
    },
    chalkboard: {
      bg: "bg-[#090d16]",
      grid: "bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] opacity-50",
      borderStroke: "#10b981",
      textFill: "#6ee7b7",
      badgeClass: "bg-emerald-950/80 text-emerald-400 border-emerald-800",
    },
  }[schematicTheme];

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-5 sm:p-6 shadow-patent space-y-5">
      {/* Header, Figure Switcher & Viewport Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <h3 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
              Interactive Schematic Sheet ({activeDrawing.figureNumber})
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">{activeDrawing.caption}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Palette Switcher */}
          <div className="flex items-center bg-parchment-200/80 dark:bg-ink-900 rounded-xl p-1 border border-parchment-300 dark:border-ink-800 text-xs">
            <button
              type="button"
              onClick={() => setSchematicTheme("blueprint")}
              className={`px-2.5 py-1 rounded-lg font-sans transition-colors ${
                schematicTheme === "blueprint"
                  ? "bg-cyan-700 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
              title="Cyan Engineering Blueprint"
            >
              Blueprint
            </button>
            <button
              type="button"
              onClick={() => setSchematicTheme("parchment")}
              className={`px-2.5 py-1 rounded-lg font-sans transition-colors ${
                schematicTheme === "parchment"
                  ? "bg-amber-700 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
              title="Archival Sepia Parchment"
            >
              Parchment
            </button>
            <button
              type="button"
              onClick={() => setSchematicTheme("chalkboard")}
              className={`px-2.5 py-1 rounded-lg font-sans transition-colors ${
                schematicTheme === "chalkboard"
                  ? "bg-emerald-700 text-white font-bold shadow-xs"
                  : "text-ink-700 dark:text-ink-400 hover:text-ink-900"
              }`}
              title="Slate Technical Chalkboard"
            >
              Chalkboard
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center bg-parchment-200/80 dark:bg-ink-900 rounded-xl p-1 border border-parchment-300 dark:border-ink-800 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z > 1 ? z - 0.25 : 1))}
              disabled={zoomLevel <= 1}
              className="p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom out schematic"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold text-ink-800 dark:text-ink-200">
              {zoomLevel.toFixed(2)}x
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel((z) => (z < 1.75 ? z + 0.25 : 1.75))}
              disabled={zoomLevel >= 1.75}
              className="p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-40 text-ink-700 dark:text-ink-300"
              aria-label="Zoom in schematic"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                type="button"
                onClick={() => setZoomLevel(1)}
                className="ml-1 p-1 rounded hover:bg-parchment-300 dark:hover:bg-ink-800 text-ink-500"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Figure tabs if multiple */}
          {drawings.length > 1 && (
            <div className="flex items-center gap-1">
              {drawings.map((draw, idx) => (
                <button
                  key={draw.figureNumber}
                  type="button"
                  onClick={() => {
                    setActiveFigIndex(idx);
                    setActiveCalloutId(null);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-sans transition-colors border ${
                    activeFigIndex === idx
                      ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 shadow-xs"
                      : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
                  }`}
                >
                  {draw.figureNumber}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Schematic Container with Interactive Pins & Pin Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drawing Artboard */}
        <div
          className={`lg:col-span-8 flex flex-col items-center justify-center rounded-2xl ${themeStyles.bg} p-4 sm:p-6 border border-parchment-300 dark:border-ink-800 relative min-h-[380px] shadow-inner overflow-hidden transition-colors duration-300`}
        >
          {/* Blueprint background grid */}
          <div
            className={`absolute inset-0 ${themeStyles.grid} bg-[size:24px_24px] rounded-2xl pointer-events-none`}
          />

          {/* Schematic SVG Vector Frame */}
          <div
            className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <svg viewBox="0 0 400 300" className="w-full h-full select-none">
              {/* Outer drawing border */}
              <rect
                x="10"
                y="10"
                width="380"
                height="280"
                fill="none"
                stroke={themeStyles.borderStroke}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                strokeOpacity="0.4"
                rx="4"
              />
              <text
                x="200"
                y="32"
                textAnchor="middle"
                fontSize="11"
                fill={themeStyles.textFill}
                fontFamily="serif"
                fontWeight="bold"
                letterSpacing="1"
              >
                {patentNumber} · {activeDrawing.figureNumber.toUpperCase()}
              </text>

              {/* Central authentic mechanical blueprint vectors */}
              {renderHistoricalSchematic(
                activeDrawing.svgType,
                activeDrawing.figureNumber,
                patentNumber,
                patentId,
                livePhysicsParams,
              )}

              {/* Animated Radar Target Reticle on selected pin */}
              {activePin && (
                <g className="pointer-events-none transition-opacity duration-300">
                  <circle
                    cx={activePin.x * 4}
                    cy={activePin.y * 3}
                    r="18"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    className="animate-spin"
                    style={{
                      transformOrigin: `${activePin.x * 4}px ${activePin.y * 3}px`,
                      animationDuration: "10s",
                    }}
                  />
                  <circle
                    cx={activePin.x * 4}
                    cy={activePin.y * 3}
                    r="28"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1"
                    opacity="0.35"
                  />
                  {/* Crosshairs */}
                  <line
                    x1={activePin.x * 4 - 36}
                    y1={activePin.y * 3}
                    x2={activePin.x * 4 + 36}
                    y2={activePin.y * 3}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  <line
                    x1={activePin.x * 4}
                    y1={activePin.y * 3 - 36}
                    x2={activePin.x * 4}
                    y2={activePin.y * 3 + 36}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                </g>
              )}
            </svg>

            {/* Interactive Numbered Callout Pins */}
            {callouts.map((callout, pinIdx) => {
              const isSelected = callout.id === activeCalloutId;
              const isHovered = callout.id === hoveredCalloutId;
              const pinText = callout.element.length <= 5 ? callout.element : String(pinIdx + 1);
              return (
                <button
                  key={callout.id}
                  type="button"
                  aria-label={`${callout.label}: ${callout.description}`}
                  onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                  onMouseEnter={() => setHoveredCalloutId(callout.id)}
                  onMouseLeave={() => setHoveredCalloutId(null)}
                  style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[28px] max-w-[3.5rem] h-7 px-2 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 shadow-md truncate ${
                    isSelected
                      ? "bg-amber-500 text-ink-950 ring-4 ring-amber-500/50 scale-125 z-20 shadow-amber-500/30"
                      : isHovered
                        ? "bg-amber-600 text-white scale-115 ring-2 ring-amber-400 z-15"
                        : "bg-ink-900/90 text-amber-300 border border-amber-500/60 hover:scale-110 hover:bg-amber-600 hover:text-white z-10"
                  }`}
                  title={`${callout.label}: ${callout.description}`}
                >
                  {pinText}
                </button>
              );
            })}
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-sans text-ink-400 mt-4 pt-3 border-t border-ink-800/80">
            <span className="flex items-center gap-2">
              <span className="hidden sm:inline">
                Click any numbered callout pin or use arrow keys [← / →]
              </span>
              <span className="sm:hidden">Tap any numbered pin</span>
            </span>
            <span className="text-amber-400 font-bold font-mono">
              {callouts.length} Curated Callouts
            </span>
          </div>
        </div>

        {/* Pin Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Callout Pin Inspector
              </span>
              {callouts.length > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevPin}
                    className="p-1 rounded-md bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition-colors"
                    title="Previous Pin (Arrow Left)"
                    aria-label="Previous callout pin"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPin}
                    className="p-1 rounded-md bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-700 dark:text-ink-300 transition-colors"
                    title="Next Pin (Arrow Right)"
                    aria-label="Next callout pin"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {activePin ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 h-6 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                    {activePin.element}
                  </span>
                  <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
                    {activePin.label}
                  </span>
                </div>
                <p className="text-xs font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
                  {activePin.description}
                </p>
                <div className="p-2.5 rounded-lg bg-parchment-200/60 dark:bg-ink-950 text-[11px] font-sans text-ink-600 dark:text-ink-400 border border-parchment-300 dark:border-ink-800">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-0.5">
                    Historical Specification Reference:
                  </span>
                  Reference numeral{" "}
                  <span className="font-mono font-bold text-ink-800 dark:text-ink-200">
                    {activePin.element}
                  </span>{" "}
                  designates the {activePin.label.toLowerCase()} in {activeDrawing.figureNumber}.
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCalloutId(null)}
                  className="w-full text-center py-1.5 text-xs text-amber-700 dark:text-amber-400 hover:underline font-sans"
                >
                  Clear Selection (Esc)
                </button>
              </div>
            ) : (
              <div className="text-xs text-ink-500 font-sans py-8 text-center space-y-1.5">
                <MapPin className="w-6 h-6 mx-auto text-amber-600/70 dark:text-amber-400/70 mb-1 animate-bounce" />
                <p className="font-medium text-ink-800 dark:text-ink-200">
                  Select Any Numbered Pin
                </p>
                <p className="text-ink-500 text-[11px]">
                  Click pins on the schematic or select from the list below to inspect historical
                  specifications.
                </p>
              </div>
            )}
          </div>

          {/* Quick list of all callouts */}
          {callouts.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {callouts.map((callout) => {
                const isSelected = activeCalloutId === callout.id;
                return (
                  <button
                    key={callout.id}
                    type="button"
                    onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                    onMouseEnter={() => setHoveredCalloutId(callout.id)}
                    onMouseLeave={() => setHoveredCalloutId(null)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                      isSelected
                        ? "bg-amber-600 text-white font-bold shadow-xs"
                        : "hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300"
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono font-bold mr-1">[{callout.element}]</span>{" "}
                      {callout.label}
                    </span>
                    <span className="text-[10px] opacity-70 flex-shrink-0 ml-1">
                      {isSelected ? "Active ✓" : "Inspect →"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
