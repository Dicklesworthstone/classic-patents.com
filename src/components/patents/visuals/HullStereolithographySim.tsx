"use client";

import { useId, useMemo, useState } from "react";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  HULL_FRANKENSIM_ELEVATOR_OWNER,
  HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER,
  HULL_SLA_DEFAULT_CONTROLS,
  type HullStereolithographyControls,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

const PATENT_ID = "us-4575330-hull-stereolithography";

type HullView = "apparatus" | "sequence" | "source";

const HULL_SOURCE_SEQUENCE = [
  [
    "10",
    "Form one cross-sectional lamina",
    "Apply the prescribed pattern only at the selected two-dimensional interface.",
  ],
  [
    "11",
    "Integrate it with the previous lamina",
    "The new solid adheres to the already-supported object.",
  ],
  [
    "12",
    "Contain the responsive fluid",
    "Liquid 22 remains in container 21 with a designated working surface 23.",
  ],
  [
    "13",
    "Apply stimulation as a graphic pattern",
    "Direct the prescribed pattern at working surface 23 so the fluid forms one thin individual lamina.",
  ],
  [
    "14",
    "Superimpose successive adjacent laminae",
    "Place each newly formed lamina against the preceding one so the integrated stack defines object 30.",
  ],
] as const;

const HULL_PREFERRED_SOURCE_CARD = [
  ["Lamp electrical rating", "350 W mercury short-arc lamp"],
  ["Fiber bundle", "1 mm diameter · 1 m long · UV transmitting"],
  ["Switching", "electronically controlled shutter"],
  ["Focus", "quartz lens · spot somewhat under 1 mm"],
  ["Surface irradiance", "about 1 W/cm² long-wave UV"],
  ["Working liquid", "Potting Compound 363 modified acrylate"],
  ["Positioning/control", "HP 9872 plotter · HP 3497A controller"],
] as const;

export function HullStereolithographySim() {
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const [activeView, setActiveView] = useState<HullView>("apparatus");
  const baseId = useId();
  const controls = useMemo(
    () =>
      readHullStereolithographyControls({
        ...HULL_SLA_DEFAULT_CONTROLS,
        ...effectiveParams,
      }),
    [effectiveParams],
  );
  const state = useMemo(() => stepHullStereolithographySi(controls), [controls]);

  const update = <K extends keyof HullStereolithographyControls>(
    key: K,
    value: HullStereolithographyControls[K],
  ) => updateParam(key, value);

  const lensX = 400 + state.spotXFraction * 145;
  const platformY = 320 + state.platformDepthFraction * 46;
  const displayedLaminae = Math.min(9, state.visibleLaminaCount);

  return (
    <div
      className="flex scroll-mt-24 flex-col gap-5 rounded-2xl border border-amber-900/30 bg-stone-950 p-3 text-stone-200 shadow-2xl [&_button]:scroll-mt-24 [&_input]:scroll-mt-24 sm:p-6"
      data-testid="hull-stereolithography-two"
      data-hull-shutter-effective={state.shutterOpen ? "open" : "closed"}
      data-hull-shutter-interlock={state.shutterInterlockActive ? "active" : "clear"}
      data-hull-platform-depth={state.platformDepthFraction.toFixed(3)}
      data-hull-lamina-count={state.visibleLaminaCount}
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-amber-900/40 pb-4">
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-400">
            US 4,575,330 · source-bounded technical diagram
          </div>
          <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-amber-100">
            Drawing at a liquid surface, one supported lamina at a time
          </h2>
        </div>
        <div className="flex max-w-full flex-wrap gap-1 rounded-lg border border-stone-800 bg-stone-900/90 p-1">
          {(
            [
              ["apparatus", "Fig. 3 apparatus", "Fig. 3"],
              ["sequence", "Figs. 1–2 sequence", "Sequence"],
              ["source", "1986 source card", "Source"],
            ] as const
          ).map(([view, label, compactLabel]) => (
            <button
              key={view}
              type="button"
              aria-pressed={activeView === view}
              aria-label={label}
              onClick={() => setActiveView(view)}
              className={`shrink-0 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-3 sm:text-xs ${
                activeView === view
                  ? "bg-amber-600 text-white"
                  : "text-stone-400 hover:text-stone-200"
              }`}
            >
              <span className="sm:hidden">{compactLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={resetParams}
            className="shrink-0 rounded-md px-2 py-1.5 text-[11px] font-medium text-stone-300 transition-colors hover:text-white sm:px-3 sm:text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      <div
        className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900/50 shadow-inner sm:block sm:aspect-[16/9] ${
          activeView === "apparatus" ? "block" : "hidden"
        }`}
      >
        <svg
          viewBox="0 0 800 450"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Source-bounded diagram of Hull's preferred stereolithography apparatus"
        >
          <defs>
            <linearGradient id={`${baseId}-resin`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#075985" stopOpacity="0.84" />
            </linearGradient>
            <linearGradient id={`${baseId}-fiber`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
            <marker
              id={`${baseId}-arrow`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>

          {activeView === "apparatus" && (
            <g>
              <rect
                x="55"
                y="178"
                width="690"
                height="238"
                rx="6"
                fill="#1c1917"
                stroke="#78716c"
                strokeWidth="5"
              />
              <rect x="65" y="205" width="670" height="201" fill={`url(#${baseId}-resin)`} />
              <line x1="65" y1="205" x2="735" y2="205" stroke="#7dd3fc" strokeWidth="3" />
              <text x="75" y="196" fill="#bae6fd" fontSize="12" fontFamily="monospace">
                fixed working surface 23 · UV-curable liquid 22
              </text>
              <text x="68" y="435" fill="#d6d3d1" fontSize="12" fontFamily="monospace">
                container 21
              </text>

              <rect x="604" y="226" width="15" height="178" rx="6" fill="#a8a29e" />
              <rect
                x="585"
                y={platformY - 2}
                width="52"
                height="16"
                rx="5"
                fill="#d6d3d1"
                stroke="#78716c"
              />
              <rect
                x="274"
                y={platformY}
                width="320"
                height="16"
                rx="3"
                fill="#78716c"
                stroke="#e7e5e4"
              />
              <text x="624" y="247" fill="#e7e5e4" fontSize="11" fontFamily="monospace">
                elevator guide
              </text>
              <text x="282" y={platformY + 34} fill="#e7e5e4" fontSize="11" fontFamily="monospace">
                object-support platform 29
              </text>

              {Array.from({ length: displayedLaminae }, (_, index) => {
                const width = 208 - index * 8;
                const y = platformY - 1 - (index + 1) * 11;
                return (
                  <rect
                    key={`hull-lamina-${index}`}
                    x={434 - width / 2}
                    y={y}
                    width={width}
                    height="11"
                    rx="2"
                    fill={index % 2 === 0 ? "#d97706" : "#f59e0b"}
                    stroke="#fbbf24"
                    strokeWidth="0.7"
                  />
                );
              })}
              <text
                x="300"
                y={platformY - displayedLaminae * 11 - 9}
                fill="#fde68a"
                fontSize="11"
                fontFamily="monospace"
              >
                touching display laminae 30a / 30b / 30c
              </text>

              <rect
                x="86"
                y="35"
                width="185"
                height="60"
                rx="8"
                fill="#171412"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text
                x="101"
                y="59"
                fill="#fbbf24"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="bold"
              >
                source 26
              </text>
              <text x="101" y="79" fill="#e7e5e4" fontSize="11" fontFamily="monospace">
                350 W mercury short-arc lamp
              </text>
              <rect
                x="276"
                y="53"
                width="10"
                height="24"
                fill={state.shutterOpen ? "#10b981" : "#ef4444"}
                stroke="#f8fafc"
              />
              <text x="262" y="111" fill="#d6d3d1" fontSize="10" fontFamily="monospace">
                electronic shutter
              </text>
              <path
                d={`M 286 65 C 340 12, ${lensX - 50} 20, ${lensX} 92`}
                fill="none"
                stroke={`url(#${baseId}-fiber)`}
                strokeWidth="5"
              />
              <text x="340" y="30" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                1 mm bundle · 1 m long
              </text>
              <rect
                x={lensX - 18}
                y="86"
                width="36"
                height="66"
                rx="7"
                fill="#292524"
                stroke="#cbd5e1"
                strokeWidth="2"
              />
              <text x={lensX + 26} y="112" fill="#e7e5e4" fontSize="10" fontFamily="monospace">
                quartz lens tube on plotter carriage
              </text>

              {state.exposureAtWorkingSurface && (
                <>
                  <line x1={lensX} y1="152" x2={lensX} y2="205" stroke="#e879f9" strokeWidth="3" />
                  <ellipse cx={lensX} cy="205" rx="10" ry="4" fill="#f0abfc" />
                  <text x={lensX + 15} y="222" fill="#f5d0fe" fontSize="11" fontFamily="monospace">
                    spot 27 ({state.spotXFraction.toFixed(2)}, {state.spotZFraction.toFixed(2)})
                  </text>
                </>
              )}

              <line
                x1="670"
                y1="270"
                x2="670"
                y2="350"
                stroke="#f59e0b"
                strokeWidth="3"
                markerEnd={`url(#${baseId}-arrow)`}
              />
              <text x="680" y="304" fill="#fbbf24" fontSize="11" fontFamily="monospace">
                programmed move away
              </text>
            </g>
          )}

          {activeView === "sequence" && (
            <g>
              {HULL_SOURCE_SEQUENCE.map(([number, title, detail], index) => {
                const x = 42 + (index % 3) * 252;
                const y = 55 + Math.floor(index / 3) * 185;
                return (
                  <g key={number}>
                    <rect
                      x={x}
                      y={y}
                      width="220"
                      height="142"
                      rx="10"
                      fill="#1c1917"
                      stroke="#57534e"
                    />
                    <circle cx={x + 28} cy={y + 29} r="17" fill="#b45309" />
                    <text
                      x={x + 28}
                      y={y + 34}
                      textAnchor="middle"
                      fill="#fff7ed"
                      fontSize="13"
                      fontWeight="bold"
                    >
                      {number}
                    </text>
                    <text
                      x={x + 54}
                      y={y + 27}
                      fill="#fbbf24"
                      fontSize="12"
                      fontFamily="serif"
                      fontWeight="bold"
                    >
                      {title}
                    </text>
                    <foreignObject x={x + 18} y={y + 52} width="184" height="76">
                      <p className="m-0 text-[11px] leading-relaxed text-stone-300">{detail}</p>
                    </foreignObject>
                  </g>
                );
              })}
            </g>
          )}

          {activeView === "source" && (
            <g>
              <rect
                x="50"
                y="42"
                width="700"
                height="365"
                rx="12"
                fill="#141210"
                stroke="#57534e"
              />
              <text x="80" y="78" fill="#fbbf24" fontSize="16" fontFamily="serif" fontWeight="bold">
                What the preferred embodiment actually prints
              </text>
              {HULL_PREFERRED_SOURCE_CARD.map(([label, value], index) => (
                <g key={label} transform={`translate(80 ${108 + index * 34})`}>
                  <text fill="#a8a29e" fontSize="11" fontFamily="monospace">
                    {label}
                  </text>
                  <text x="225" fill="#e7e5e4" fontSize="12" fontFamily="monospace">
                    {value}
                  </text>
                </g>
              ))}
              <rect x="80" y="347" width="640" height="42" rx="7" fill="#3f1018" stroke="#fb7185" />
              <text x="96" y="365" fill="#fecdd3" fontSize="10.5" fontFamily="monospace">
                Not printed: resin absorption / critical dose / cure kinetics / layer step / scan
                speed /
              </text>
              <text x="96" y="380" fill="#fecdd3" fontSize="10.5" fontFamily="monospace">
                platform stroke or speed / viscosity / part scale / adhesion force / build duration.
              </text>
            </g>
          )}
        </svg>
      </div>

      {activeView === "sequence" && (
        <div className="grid gap-3 rounded-xl border border-stone-800 bg-stone-900/50 p-3 shadow-inner sm:hidden">
          {HULL_SOURCE_SEQUENCE.map(([number, title, detail]) => (
            <article key={number} className="rounded-lg border border-stone-700 bg-stone-950 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-700 font-mono text-sm font-bold text-white">
                  {number}
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold leading-snug text-amber-300">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-300">{detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeView === "source" && (
        <div className="rounded-xl border border-stone-700 bg-stone-900/60 p-4 shadow-inner sm:hidden">
          <h3 className="font-serif text-lg font-bold text-amber-300">
            What the preferred embodiment actually prints
          </h3>
          <dl className="mt-4 space-y-3">
            {HULL_PREFERRED_SOURCE_CARD.map(([label, value]) => (
              <div key={label} className="border-b border-stone-800 pb-3 last:border-0 last:pb-0">
                <dt className="font-mono text-[11px] uppercase tracking-wide text-stone-500">
                  {label}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-stone-200">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 rounded-lg border border-rose-400/60 bg-rose-950/40 p-3 text-xs leading-relaxed text-rose-100">
            Not printed: resin absorption, critical dose, cure kinetics, layer step, scan speed,
            platform stroke or speed, viscosity, part scale, adhesion force, or build duration.
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 sm:col-span-2 xl:col-span-1">
          <div className="text-xs text-stone-300">Electronic shutter</div>
          <button
            type="button"
            aria-label={controls.shutterRequestedOpen === 1 ? "Close shutter" : "Open shutter"}
            aria-pressed={controls.shutterRequestedOpen === 1}
            onClick={() =>
              update("shutterRequestedOpen", controls.shutterRequestedOpen === 1 ? 0 : 1)
            }
            className={`mt-2 w-full rounded-md border px-3 py-2 text-xs font-semibold ${
              controls.shutterRequestedOpen === 1
                ? "border-fuchsia-400/50 bg-fuchsia-500/20 text-fuchsia-200"
                : "border-stone-700 bg-stone-950 text-stone-300"
            }`}
          >
            {controls.shutterRequestedOpen === 1 ? "Requested open" : "Closed"}
          </button>
        </div>
        {(
          [
            ["scanXFraction", "Scan spot X", -1, 1, 0.05, controls.scanXFraction.toFixed(2)],
            ["scanZFraction", "Scan spot Z", -1, 1, 0.05, controls.scanZFraction.toFixed(2)],
            [
              "recoatExcursionFraction",
              "Recoating excursion",
              0,
              1,
              0.05,
              `${Math.round(controls.recoatExcursionFraction * 100)}%`,
            ],
            [
              "displayLaminaCount",
              "Illustrative laminae",
              1,
              12,
              1,
              String(controls.displayLaminaCount),
            ],
          ] as const
        ).map(([key, label, min, max, step, value]) => (
          <div key={key} className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
            <label htmlFor={`${baseId}-${key}`} className="block text-xs text-stone-300">
              {label} ({value})
            </label>
            <input
              id={`${baseId}-${key}`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={controls[key]}
              onChange={(event) => update(key, Number(event.target.value))}
              className="mt-1 w-full accent-amber-500"
            />
          </div>
        ))}
      </div>

      {state.shutterInterlockActive && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-950/30 p-3 text-sm text-amber-100">
          Sequence guard: the requested open shutter is held closed while platform 29 is below its
          next-layer working position.
        </div>
      )}

      {claimConstraintResult.activeFailures.length > 0 && (
        <div
          role="status"
          className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs leading-relaxed text-rose-100"
        >
          {claimConstraintResult.activeFailures.map((failure) => (
            <p key={failure}>{failure}</p>
          ))}
          {claimConstraintResult.refusalWarning && (
            <p className="mt-1 text-rose-200">{claimConstraintResult.refusalWarning}</p>
          )}
        </div>
      )}

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs leading-relaxed text-emerald-100">
          <div className="font-mono font-bold uppercase tracking-wider text-emerald-300">
            Connected topology
          </div>
          <p className="mt-1">
            Every displayed lamina touches the one below; object 30 stays on platform 29; the
            platform stays joined to its guide carriage; and the light head stays on the plotter
            rails throughout X–Z motion.
          </p>
        </div>
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs leading-relaxed text-rose-100">
          <div className="font-mono font-bold uppercase tracking-wider text-rose-300">
            Quantitative result refused
          </div>
          <p className="mt-1">
            {HULL_FRANKENSIM_ELEVATOR_OWNER} and {HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER} are the
            relevant generic owners, but the grant cannot parameterize an elevator solve or an
            attenuation-plus-photopolymer cure solve. No cure depth, adhesion, conversion, force,
            recoating time, or build duration is fabricated here.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-800 pt-3">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onToggleClaim={(number, active) =>
            updateParam(claimConstraintStateParamId(number), active ? 1 : 0)
          }
        />
      </div>
    </div>
  );
}

export default HullStereolithographySim;
