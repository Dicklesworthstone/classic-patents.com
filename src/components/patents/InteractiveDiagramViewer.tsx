"use client";

import { Compass, MapPin } from "lucide-react";
import { useState } from "react";
import type { PatentDrawing } from "@/types/patent";

interface InteractiveDiagramViewerProps {
  drawings: PatentDrawing[];
  patentNumber: string;
}

export function InteractiveDiagramViewer({
  drawings,
  patentNumber,
}: InteractiveDiagramViewerProps) {
  const [activeFigIndex, setActiveFigIndex] = useState<number>(0);
  const [activeCalloutId, setActiveCalloutId] = useState<string | null>(null);

  const activeDrawing = drawings[activeFigIndex] || drawings[0];
  if (!activeDrawing) return null;

  const activePin = activeDrawing.callouts?.find((c) => c.id === activeCalloutId);

  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6">
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
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  activeFigIndex === idx
                    ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600"
                    : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800"
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
        <div className="lg:col-span-8 flex flex-col items-center justify-center rounded-xl bg-ink-950 p-6 border border-parchment-200 dark:border-ink-800 relative min-h-[340px]">
          {/* Blueprint background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 rounded-xl pointer-events-none" />

          {/* Schematic SVG Vector Frame */}
          <div className="relative w-full max-w-md aspect-[4/3] flex items-center justify-center">
            {/* Ambient Drawing Lines */}
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

              {/* Central stylized mechanical blueprint wireframe */}
              <g stroke="#64748b" strokeWidth="1.5" fill="none">
                <ellipse cx="200" cy="150" rx="140" ry="70" />
                <line x1="60" y1="150" x2="340" y2="150" />
                <line x1="200" y1="80" x2="200" y2="220" />
                <rect x="150" y="110" width="100" height="80" rx="4" />
                <circle cx="200" cy="150" r="25" />
              </g>
            </svg>

            {/* Interactive Numbered Callout Pins */}
            {activeDrawing.callouts?.map((callout) => {
              const isSelected = callout.id === activeCalloutId;
              return (
                <button
                  key={callout.id}
                  type="button"
                  onClick={() => setActiveCalloutId(isSelected ? null : callout.id)}
                  style={{ left: `${callout.x}%`, top: `${callout.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[28px] h-7 px-1.5 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200 shadow-md ${
                    isSelected
                      ? "bg-amber-500 text-ink-950 ring-4 ring-amber-500/40 scale-125 z-20"
                      : "bg-ink-800 text-amber-300 border border-amber-500/60 hover:scale-110 hover:bg-amber-600 hover:text-white z-10"
                  }`}
                  title={`${callout.label}: ${callout.description}`}
                >
                  {callout.element}
                </button>
              );
            })}
          </div>

          <div className="w-full flex items-center justify-between text-[11px] font-mono text-ink-400 mt-3 pt-3 border-t border-ink-800">
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
                <div className="p-2.5 rounded bg-parchment-200/60 dark:bg-ink-950 text-[11px] font-mono text-ink-600 dark:text-ink-400 border border-parchment-300 dark:border-ink-800">
                  <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-0.5">
                    USPTO Specification Reference:
                  </span>
                  &ldquo;Ref. Numeral {activePin.element} marks the {activePin.label.toLowerCase()}{" "}
                  illustrated in {activeDrawing.figureNumber}.&rdquo;
                </div>
              </div>
            ) : (
              <div className="text-xs text-ink-500 font-mono py-8 text-center space-y-1">
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
                  className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
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
