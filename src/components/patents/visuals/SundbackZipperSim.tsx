"use client";

import type React from "react";
import { useId, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { readSundbackZipperControls, stepSundbackZipperSi } from "@/physics/sundbackZipperKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";

export function SundbackZipperSim({
  patentId = "us-1219881-sundback-zipper",
}: {
  patentId?: string;
}) {
  const { params, updateParam } = usePatentPhysics(patentId);
  const controls = useMemo(() => readSundbackZipperControls(params), [params]);
  const tel = useMemo(() => stepSundbackZipperSi(controls), [controls]);

  const clipId = useId();
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const toothCount = 28;
  const height = 480;
  const width = 640;
  const centerX = width / 2;
  const startY = 60;
  const endY = 420;
  const chainLength = endY - startY;

  // Slider Y position in SVG coordinates (0% = startY [open], 100% = endY [closed])
  const sliderY = startY + (controls.sliderPositionPct / 100) * chainLength;

  // Generate teeth coordinates along both left and right stringers
  const teeth = useMemo(() => {
    const list: {
      side: "left" | "right";
      index: number;
      x: number;
      y: number;
      isEngaged: boolean;
      rotation: number;
    }[] = [];

    const pitch = chainLength / toothCount;
    const halfPitch = controls.staggerAligned ? pitch / 2 : 0;

    for (let i = 0; i < toothCount; i++) {
      const y = startY + i * pitch;
      const isClosed = y >= sliderY;

      // Left stringer teeth
      let leftX = centerX - 12;
      let leftRot = 0;
      if (!isClosed) {
        // Diverging tracks above slider
        const distAbove = sliderY - y;
        const spread = Math.min(110, distAbove * 0.45);
        leftX = centerX - 12 - spread;
        leftRot = -Math.min(22, distAbove * 0.12);
      }
      list.push({
        side: "left",
        index: i,
        x: leftX,
        y: y,
        isEngaged: isClosed && controls.staggerAligned,
        rotation: leftRot,
      });

      // Right stringer teeth (staggered by half pitch)
      const rightY = y + halfPitch;
      if (rightY <= endY + 10) {
        const isRightClosed = rightY >= sliderY;
        let rightX = centerX + 12;
        let rightRot = 0;
        if (!isRightClosed) {
          const distAbove = sliderY - rightY;
          const spread = Math.min(110, distAbove * 0.45);
          rightX = centerX + 12 + spread;
          rightRot = Math.min(22, distAbove * 0.12);
        }
        list.push({
          side: "right",
          index: i,
          x: rightX,
          y: rightY,
          isEngaged: isRightClosed && controls.staggerAligned,
          rotation: rightRot,
        });
      }
    }
    return list;
  }, [sliderY, chainLength, centerX, controls.staggerAligned]);

  const handlePointerDown = () => {
    setIsDraggingSlider(true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingSlider || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const clampedY = Math.max(startY, Math.min(endY, (y / rect.height) * height));
    const newPct = Math.round(((clampedY - startY) / chainLength) * 100);
    updateParam("sliderPositionPct", newPct);
  };

  const handlePointerUp = () => {
    setIsDraggingSlider(false);
  };

  return (
    <div className="w-full bg-parchment-50 dark:bg-ink-950 rounded-2xl border border-parchment-300 dark:border-ink-800 p-6 flex flex-col items-center space-y-6 shadow-patent">
      {/* Simulation Header */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-200 dark:border-ink-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700">
              US 1,219,881
            </span>
            <span className="text-xs font-mono font-medium text-ink-500 dark:text-ink-400">
              GIDEON SUNDBACK (1917)
            </span>
          </div>
          <h3 className="text-lg font-serif font-bold text-ink-900 dark:text-parchment-100 mt-1">
            Separable Fastener: Interlocking Scoop Cam Kinematics
          </h3>
        </div>
        <PhysicsTelemetryBadge
          patentId={patentId}
          equations={ALL_COLORIZED_EQUATIONS[patentId] ?? []}
        />
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full max-w-[640px] aspect-[4/3] bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-300 dark:border-ink-800 overflow-hidden select-none">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full cursor-crosshair touch-none"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <defs>
            <linearGradient id={`tapeGrad-${clipId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#475569" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#334155" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id={`cordGrad-${clipId}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <linearGradient id={`brassTooth-${clipId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#ca8a04" />
              <stop offset="80%" stopColor="#a16207" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id={`sliderMetal-${clipId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94a3b8" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id={`shadow-${clipId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <g stroke="currentColor" strokeOpacity="0.06" strokeWidth="1">
            {Array.from({ length: 13 }).map((_, i) => (
              <line key={`vg-${i}`} x1={i * 50 + 20} y1={0} x2={i * 50 + 20} y2={height} />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`hg-${i}`} x1={0} y1={i * 50 + 15} x2={width} y2={i * 50 + 15} />
            ))}
          </g>

          {/* Left Fabric Stringer Tape */}
          <path
            d={`M ${centerX - 120} ${startY - 20} L ${centerX - 42} ${startY + 20} L ${centerX - 42} ${endY + 30} L ${centerX - 120} ${endY + 30} Z`}
            fill={`url(#tapeGrad-${clipId})`}
            opacity={0.85}
          />
          {/* Right Fabric Stringer Tape */}
          <path
            d={`M ${centerX + 120} ${startY - 20} L ${centerX + 42} ${startY + 20} L ${centerX + 42} ${endY + 30} L ${centerX + 120} ${endY + 30} Z`}
            fill={`url(#tapeGrad-${clipId})`}
            opacity={0.85}
          />

          {/* Bottom Stop Link (Claim 4) */}
          <g transform={`translate(${centerX - 24}, ${endY + 18})`}>
            <rect
              x="0"
              y="0"
              width="48"
              height="16"
              rx="4"
              fill={`url(#sliderMetal-${clipId})`}
              stroke="#1e293b"
              strokeWidth="1.5"
              filter={`url(#shadow-${clipId})`}
            />
            <text
              x="24"
              y="11"
              textAnchor="middle"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
              fill="#0f172a"
            >
              STOP 4
            </text>
          </g>

          {/* Teeth (Interlocking Scoops) */}
          {teeth.map((t, idx) => (
            <g
              key={`tooth-${t.side}-${idx}`}
              transform={`translate(${t.x}, ${t.y}) rotate(${t.rotation})`}
              filter={t.isEngaged ? undefined : `url(#shadow-${clipId})`}
            >
              {t.side === "left" ? (
                // Left Tooth: pointing right towards center
                <g>
                  {/* Clamping Jaws around corded edge */}
                  <path
                    d="M -22 -5 L -8 -5 L -4 -2 L -4 2 L -8 5 L -22 5 Z"
                    fill={`url(#brassTooth-${clipId})`}
                    stroke="#78350f"
                    strokeWidth="0.8"
                  />
                  {/* Scoop Head with convex projection */}
                  <path
                    d="M -4 -6 C 4 -6, 12 -4, 14 0 C 12 4, 4 6, -4 6 Z"
                    fill={t.isEngaged ? "#eab308" : `url(#brassTooth-${clipId})`}
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                  {/* Convex Projection Pip */}
                  <circle cx="6" cy="0" r="2.8" fill="#fef08a" stroke="#a16207" strokeWidth="0.8" />
                </g>
              ) : (
                // Right Tooth: pointing left towards center
                <g>
                  {/* Clamping Jaws */}
                  <path
                    d="M 22 -5 L 8 -5 L 4 -2 L 4 2 L 8 5 L 22 5 Z"
                    fill={`url(#brassTooth-${clipId})`}
                    stroke="#78350f"
                    strokeWidth="0.8"
                  />
                  {/* Scoop Head with concave pocket */}
                  <path
                    d="M 4 -6 C -4 -6, -12 -4, -14 0 C -12 4, -4 6, 4 6 Z"
                    fill={t.isEngaged ? "#ca8a04" : `url(#brassTooth-${clipId})`}
                    stroke="#78350f"
                    strokeWidth="1"
                  />
                  {/* Concave Nested Pocket Socket */}
                  <circle
                    cx="-6"
                    cy="0"
                    r="3.2"
                    fill="#713f12"
                    stroke="#451a03"
                    strokeWidth="0.8"
                  />
                </g>
              )}
            </g>
          ))}

          {/* Top Stops (Claim 4 & 7) */}
          <g transform={`translate(${centerX - 28}, ${startY - 10})`}>
            <rect
              x="0"
              y="0"
              width="14"
              height="16"
              rx="3"
              fill={`url(#sliderMetal-${clipId})`}
              stroke="#1e293b"
              strokeWidth="1"
            />
          </g>
          <g transform={`translate(${centerX + 14}, ${startY - 10})`}>
            <rect
              x="0"
              y="0"
              width="14"
              height="16"
              rx="3"
              fill={`url(#sliderMetal-${clipId})`}
              stroke="#1e293b"
              strokeWidth="1"
            />
          </g>

          {/* Y-Slider Cam Body (Claim 5) */}
          <g
            transform={`translate(${centerX}, ${sliderY})`}
            className="cursor-ns-resize"
            onPointerDown={handlePointerDown}
          >
            {/* Slider Outer Housing */}
            <path
              d="M -30 -22 L 30 -22 L 18 20 L -18 20 Z"
              fill={`url(#sliderMetal-${clipId})`}
              stroke="#0f172a"
              strokeWidth="2"
              filter={`url(#shadow-${clipId})`}
            />

            {/* Internal Y-Shaped Converging Guide Channels */}
            <path
              d="M -22 -18 L -7 0 L -7 14 L 7 14 L 7 0 L 22 -18"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Central Diamond Wedge Separator Tongue (8) */}
            <polygon
              points="0,-16 -7,-4 0,4 7,-4"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="1.5"
            />

            {/* Central Securing Rivet (14) */}
            <circle cx="0" cy="-2" r="3" fill="#64748b" stroke="#0f172a" strokeWidth="1" />

            {/* Pull Tab Ring (15) and Bow (16) */}
            <g transform="translate(0, 10)">
              <rect
                x="-8"
                y="0"
                width="16"
                height="32"
                rx="4"
                fill={`url(#sliderMetal-${clipId})`}
                stroke="#0f172a"
                strokeWidth="1.5"
                filter={`url(#shadow-${clipId})`}
              />
              <circle cx="0" cy="22" r="4" fill="#0f172a" opacity="0.6" />
            </g>

            {/* Drag Handle Callout Label */}
            <g transform="translate(42, 0)">
              <rect x="0" y="-10" width="68" height="20" rx="4" fill="#1e293b" opacity="0.85" />
              <text
                x="34"
                y="4"
                textAnchor="middle"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                fill="#f8fafc"
              >
                DRAG CAM
              </text>
            </g>
          </g>

          {/* Force Vectors when under tension */}
          {controls.lateralTensionN > 0 && tel.engagedTeeth > 0 && (
            <g stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)">
              <line x1={centerX - 55} y1={endY - 60} x2={centerX - 95} y2={endY - 60} />
              <line x1={centerX + 55} y1={endY - 60} x2={centerX + 95} y2={endY - 60} />
              <text
                x={centerX - 75}
                y={endY - 70}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#ef4444"
                textAnchor="middle"
              >
                {controls.lateralTensionN} N
              </text>
              <text
                x={centerX + 75}
                y={endY - 70}
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
                fill="#ef4444"
                textAnchor="middle"
              >
                {controls.lateralTensionN} N
              </text>
            </g>
          )}
        </svg>

        {/* Refusal / Warning Overlay */}
        {tel.burstRefusal && (
          <div className="absolute inset-x-4 top-4 bg-rose-950/90 border border-rose-600 p-3 rounded-lg text-rose-200 text-xs font-mono backdrop-blur-sm shadow-xl flex items-center justify-between">
            <span>
              ⚠️ <strong>BURST REFUSAL:</strong> {tel.refusalReason}
            </span>
            <span className="font-bold text-rose-400">RUPTURE</span>
          </div>
        )}
        {tel.isStalled && !tel.burstRefusal && (
          <div className="absolute inset-x-4 top-4 bg-amber-950/90 border border-amber-600 p-3 rounded-lg text-amber-200 text-xs font-mono backdrop-blur-sm shadow-xl flex items-center justify-between">
            <span>
              ⚠️ <strong>TOOTH JAM:</strong> {tel.refusalReason}
            </span>
            <span className="font-bold text-amber-400">JAMMED</span>
          </div>
        )}
      </div>

      {/* Interactive Controls Panel */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="slider-pos-range">Slider Position</label>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {controls.sliderPositionPct}%
            </span>
          </div>
          <input
            id="slider-pos-range"
            type="range"
            min="0"
            max="100"
            step="1"
            value={controls.sliderPositionPct}
            onChange={(e) => updateParam("sliderPositionPct", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 space-y-2">
          <div className="flex justify-between items-center text-ink-700 dark:text-parchment-200">
            <label htmlFor="lat-tens-range">Transverse Tension</label>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              {controls.lateralTensionN} N
            </span>
          </div>
          <input
            id="lat-tens-range"
            type="range"
            min="0"
            max="200"
            step="5"
            value={controls.lateralTensionN}
            onChange={(e) => updateParam("lateralTensionN", Number(e.target.value))}
            className="w-full accent-amber-600"
          />
        </div>

        <div className="p-3 bg-parchment-100 dark:bg-ink-900 rounded-lg border border-parchment-200 dark:border-ink-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-ink-800 dark:text-parchment-100">Claim 1 Stagger</span>
            <span className="text-[10px] text-ink-500 dark:text-ink-400">
              Half-pitch tooth phase shift
            </span>
          </div>
          <button
            type="button"
            onClick={() => updateParam("staggerAligned", controls.staggerAligned ? 0 : 1)}
            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
              controls.staggerAligned
                ? "bg-emerald-600 text-white hover:bg-emerald-500"
                : "bg-rose-600 text-white hover:bg-rose-500"
            }`}
          >
            {controls.staggerAligned ? "STAGGERED" : "COLLISION"}
          </button>
        </div>
      </div>
    </div>
  );
}
