"use client";

import { Compass, MapPin } from "lucide-react";
import { useState } from "react";
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
) {
  const kind = resolveSchematicKind(svgType, figureNumber, patentNumber, patentId);
  switch (kind) {
    case "wright-flyer": {
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          {/* Upper & Lower Biplane Wings */}
          <path d="M 40 100 Q 200 80 360 100 Q 200 90 40 100 Z" fill="#0284c7" fillOpacity="0.15" />
          <path
            d="M 40 190 Q 200 170 360 190 Q 200 180 40 190 Z"
            fill="#0284c7"
            fillOpacity="0.15"
          />
          {/* Vertical Struts with Universal Pivots */}
          <line x1="80" y1="95" x2="80" y2="185" strokeWidth="2" stroke="#bae6fd" />
          <line x1="160" y1="90" x2="160" y2="180" strokeWidth="2" stroke="#bae6fd" />
          <line x1="240" y1="90" x2="240" y2="180" strokeWidth="2" stroke="#bae6fd" />
          <line x1="320" y1="95" x2="320" y2="185" strokeWidth="2" stroke="#bae6fd" />
          {/* Diagonal Guy-Wires */}
          <line x1="80" y1="95" x2="160" y2="180" strokeDasharray="3 2" stroke="#7dd3fc" />
          <line x1="160" y1="90" x2="80" y2="185" strokeDasharray="3 2" stroke="#7dd3fc" />
          <line x1="240" y1="90" x2="320" y2="185" strokeDasharray="3 2" stroke="#7dd3fc" />
          <line x1="320" y1="95" x2="240" y2="180" strokeDasharray="3 2" stroke="#7dd3fc" />
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
          {/* Rear Vertical Rudder */}
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
    case "tesla-motor":
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
            fillOpacity="0.1"
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
          <line x1="200" y1="150" x2="232" y2="118" stroke="#ef4444" strokeWidth="2.5" />
          <polygon points="232,118 220,122 228,130" fill="#ef4444" />
        </g>
      );
    case "tesla-coil":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <rect x="70" y="230" width="260" height="18" rx="3" fill="#334155" stroke="#94a3b8" />
          <circle cx="200" cy="92" r="28" fill="#7dd3fc" fillOpacity="0.15" stroke="#67e8f9" />
          <path
            d="M 155 230 L 170 200 L 230 200 L 245 230"
            fill="#1e3a8a"
            fillOpacity="0.25"
            stroke="#60a5fa"
          />
          <path
            d="M 175 200 L 185 120 L 215 120 L 225 200"
            fill="#0f172a"
            fillOpacity="0.4"
            stroke="#38bdf8"
          />
          <path d="M 178 195 Q 200 150 222 195" stroke="#f59e0b" strokeWidth="2" />
          <path d="M 180 170 Q 200 135 220 170" stroke="#fbbf24" />
          <line x1="200" y1="120" x2="200" y2="64" stroke="#fde68a" strokeWidth="2" />
        </g>
      );
    case "edison-bulb":
      return (
        <g stroke="#38bdf8" strokeWidth="1.5" fill="none">
          <path
            d="M 160 230 C 140 180 120 150 120 110 C 120 60 155 30 200 30 C 245 30 280 60 280 110 C 280 150 260 180 240 230 Z"
            fill="#38bdf8"
            fillOpacity="0.08"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          <rect
            x="160"
            y="230"
            width="80"
            height="35"
            rx="3"
            fill="#64748b"
            fillOpacity="0.4"
            stroke="#94a3b8"
          />
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
    case "fermi-reactor":
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
          <circle cx="110" cy="90" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="170" cy="90" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="230" cy="90" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="290" cy="90" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="110" cy="170" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="170" cy="170" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="230" cy="170" r="9" fill="#10b981" stroke="#34d399" />
          <circle cx="290" cy="170" r="9" fill="#10b981" stroke="#34d399" />
          <rect
            x="195"
            y="30"
            width="10"
            height="160"
            rx="2"
            fill="#ef4444"
            fillOpacity="0.8"
            stroke="#f87171"
            strokeWidth="1.5"
          />
        </g>
      );
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
  const [activeFigIndex, setActiveFigIndex] = useState<number>(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);

  const activeDrawing = drawings[activeFigIndex] || drawings[0];
  if (!activeDrawing) return null;

  const activePin = activeDrawing.callouts?.find((c) => c.id === activeCalloutId);

  return (
    <div className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
      {/* Header & Figure Switcher */}
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

        {/* Figure tabs if multiple */}
        {drawings.length > 1 && (
          <div className="flex items-center gap-1.5">
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
                    ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 shadow-sm"
                    : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200"
                }`}
              >
                {draw.figureNumber}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Schematic Container with Interactive Pins */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drawing Artboard */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-2xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[340px] shadow-inner">
          {/* Blueprint background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 rounded-2xl pointer-events-none" />

          {/* Schematic SVG Vector Frame */}
          <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
            <svg viewBox="0 0 400 300" className="w-full h-full select-none">
              {/* Outer drawing border */}
              <rect
                x="10"
                y="10"
                width="380"
                height="280"
                fill="none"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="4"
              />
              <text
                x="200"
                y="35"
                textAnchor="middle"
                fontSize="12"
                fill="#94a3b8"
                fontFamily="serif"
                fontWeight="bold"
              >
                {patentNumber} · {activeDrawing.figureNumber}
              </text>

              {/* Central authentic mechanical blueprint vectors */}
              {renderHistoricalSchematic(
                activeDrawing.svgType,
                activeDrawing.figureNumber,
                patentNumber,
                patentId,
              )}
            </svg>

            {/* Interactive Numbered Callout Pins */}
            {activeDrawing.callouts?.map((callout, pinIdx) => {
              const isSelected = callout.id === activeCalloutId;
              const pinText = callout.element.length <= 5 ? callout.element : String(pinIdx + 1);
              return (
                <button
                  key={callout.id}
                  type="button"
                  onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                  style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[28px] max-w-[3.25rem] h-7 px-1.5 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 shadow-md truncate ${
                    isSelected
                      ? "bg-amber-500 text-ink-950 ring-4 ring-amber-500/40 scale-125 z-20"
                      : "bg-ink-800 text-amber-300 border border-amber-500/60 hover:scale-110 hover:bg-amber-600 hover:text-white z-10"
                  }`}
                  title={`${callout.label}: ${callout.description}`}
                >
                  {pinText}
                </button>
              );
            })}
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-sans text-ink-400 mt-3 pt-3 border-t border-ink-800">
            <span>Click any numbered callout pin to inspect its historical function</span>
            <span className="text-amber-400 font-bold">
              {activeDrawing.callouts?.length || 0} Numbered Pins
            </span>
          </div>
        </div>

        {/* Pin Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/60 p-4 space-y-3">
            <span className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100 block">
              Callout Pin Inspector
            </span>

            {activePin ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 h-6 rounded-full bg-amber-600 text-white font-mono text-xs font-bold flex items-center justify-center">
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
                    Schematic Identification:
                  </span>
                  Reference numeral{" "}
                  <span className="font-mono font-bold text-ink-800 dark:text-ink-200">
                    {activePin.element}
                  </span>{" "}
                  designates the {activePin.label.toLowerCase()} in {activeDrawing.figureNumber}.
                </div>
              </div>
            ) : (
              <div className="text-xs text-ink-500 font-sans py-8 text-center space-y-1">
                <MapPin className="w-5 h-5 mx-auto text-ink-400 mb-1" />
                <p>Click any numbered pin on the schematic to read its legal specification.</p>
              </div>
            )}
          </div>

          {/* Quick list of all callouts */}
          {activeDrawing.callouts && (
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {activeDrawing.callouts.map((callout) => (
                <button
                  key={callout.id}
                  type="button"
                  onClick={() => setActiveCalloutId(callout.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                    activeCalloutId === callout.id
                      ? "bg-amber-600 text-white font-bold"
                      : "hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-ink-300"
                  }`}
                >
                  <span className="truncate">
                    [{callout.element}] {callout.label}
                  </span>
                  <span className="text-[10px] opacity-70">Inspect →</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
