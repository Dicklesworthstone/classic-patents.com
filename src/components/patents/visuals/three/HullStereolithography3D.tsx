"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import {
  createHullStereolithographyModel,
  type HullStereolithography3DObjects,
} from "@/components/patents/visuals/three/hullStereolithographyModel";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  HULL_FRANKENSIM_ELEVATOR_OWNER,
  HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER,
  readHullStereolithographyControls,
  stepHullStereolithographySi,
} from "@/physics/hullStereolithographyKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-4575330-hull-stereolithography";

const VIEWS = {
  isometric: {
    position: [3.5, 3.2, 4.2] as [number, number, number],
    target: [0, 0.9, 0] as [number, number, number],
  },
  top: {
    position: [0, 5.0, 0.1] as [number, number, number],
    target: [0, 1.2, 0] as [number, number, number],
  },
  side: {
    position: [3.8, 1.45, 0.15] as [number, number, number],
    target: [0, 1.15, 0] as [number, number, number],
  },
  optics: {
    position: [2.8, 3.25, 3.1] as [number, number, number],
    target: [0, 2.25, -0.25] as [number, number, number],
  },
} as const;

export function HullStereolithography3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { effectiveParams, claimStates, claimConstraintResult, updateParam, resetParams } =
    usePatentPhysics(PATENT_ID);
  const liveParams = useLiveSimParams(effectiveParams);

  const controls = useMemo(
    () => readHullStereolithographyControls(effectiveParams),
    [effectiveParams],
  );
  const telemetry = useMemo(() => stepHullStereolithographySi(controls), [controls]);

  const [cameraPreset, setCameraPreset] = useState<keyof typeof VIEWS>("isometric");

  // Publish the real source boundary to the shared tape. No WASM module is
  // advertised: both generic owners remain unstepped because the grant lacks
  // the material and motion cards required to parameterize them.
  useFrankenSimPhysics(PATENT_ID, {
    domain: "materials_kinetics",
    refusal: {
      isRefused: true,
      reason: claimConstraintResult.refusalWarning ?? telemetry.refusal.reason,
    },
  });

  const handlePresetChange = (preset: keyof typeof VIEWS) => {
    setCameraPreset(preset);
    studioRef.current?.controls.setView(VIEWS[preset].position, VIEWS[preset].target);
  };

  // Reset is a real baseline, not merely a camera shortcut: it restores the
  // shared source-bounded controls used by both visual faces and returns the
  // apparatus to the default inspection view.
  const handleReset = () => {
    resetParams();
    handlePresetChange("isometric");
  };

  // The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.isometric.position,
      targetPos: VIEWS.isometric.target,
      environmentStyle: "studio",
      cameraMinDistance: 1.5,
      cameraMaxDistance: 14.0,
      sunIntensity: 2.8,
      ambientIntensity: 1.2,
    });
    studioRef.current = studio;
    const { scene, camera, renderer, controls: orbitControls } = studio;

    const model: HullStereolithography3DObjects = createHullStereolithographyModel();
    scene.add(model.root);

    let frame = 0;

    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const currentControls = readHullStereolithographyControls(liveParams.current);
      const currentTel = stepHullStereolithographySi(currentControls);
      model.update(currentControls, currentTel);
      orbitControls.update();
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      scene.remove(model.root);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveParams]);

  return (
    <div
      className="relative flex scroll-mt-24 flex-col gap-4 rounded-2xl border border-amber-900/40 bg-stone-950 p-3 text-stone-200 shadow-2xl [&_button]:scroll-mt-24 [&_input]:scroll-mt-24 sm:p-6"
      data-testid="hull-stereolithography-three"
      data-hull-apparatus-state={telemetry.apparatusState}
      data-hull-shutter-requested={telemetry.shutterRequestedOpen ? "open" : "closed"}
      data-hull-shutter-effective={telemetry.shutterOpen ? "open" : "closed"}
      data-hull-shutter-interlock={telemetry.shutterInterlockActive ? "active" : "clear"}
      data-hull-scan-x={telemetry.spotXFraction.toFixed(3)}
      data-hull-scan-z={telemetry.spotZFraction.toFixed(3)}
      data-hull-platform-depth={telemetry.platformDepthFraction.toFixed(3)}
      data-hull-lamina-count={telemetry.visibleLaminaCount}
      data-hull-platform-carriage-gap="0.000"
      data-hull-lamina-stack-gap="0.000"
      data-hull-vat-floor-gap="0.000"
      data-hull-light-path-continuous="true"
      data-hull-frankensim-elevator-owner={HULL_FRANKENSIM_ELEVATOR_OWNER}
      data-hull-frankensim-optical-owner={HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER}
      data-hull-frankensim-boundary="refused-unparameterized"
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-amber-400">
            US 4,575,330 · preferred Fig. 3 apparatus
          </div>
          <h2 className="mt-1 font-serif text-xl font-semibold text-amber-50">
            Surface-written laminae on a supported elevator
          </h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-stone-400">
            The light path is the disclosed mercury lamp → shutter → 1 m fiber bundle → quartz lens.
            The plotter carriage moves spot 27 over fixed working surface 23; it is not a patent-era
            laser galvo.
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-1 rounded-lg border border-stone-700 bg-stone-900 p-1">
          {(
            [
              ["isometric", "Isometric", "Iso"],
              ["top", "Working surface", "Surface"],
              ["side", "Elevator section", "Elevator"],
              ["optics", "Lamp & fiber", "Lamp"],
            ] as const
          ).map(([preset, label, compactLabel]) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePresetChange(preset)}
              aria-pressed={cameraPreset === preset}
              aria-label={label}
              className={`shrink-0 rounded px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-2.5 sm:text-xs ${
                cameraPreset === preset
                  ? "bg-amber-600 text-white"
                  : "text-stone-300 hover:text-white"
              }`}
            >
              <span className="sm:hidden">{compactLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <button
            type="button"
            aria-label="Reset"
            title="Reset apparatus controls and camera"
            onClick={handleReset}
            className="shrink-0 rounded px-2 py-1.5 text-[11px] font-medium text-stone-300 transition-colors hover:text-white sm:px-2.5 sm:text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(17rem,1fr)] md:items-start">
        <div className="relative min-h-[360px] w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950 md:min-h-[400px]">
          <div ref={containerRef} className="absolute inset-0 h-full w-full" />
          <div className="pointer-events-none absolute bottom-3 left-3 hidden max-w-[calc(100%-1.5rem)] rounded-lg border border-stone-700 bg-stone-950/88 p-3 font-mono text-[11px] text-stone-300 backdrop-blur-md sm:block">
            <div className="font-bold text-amber-400">SOURCE-BOUNDED APPARATUS STATE</div>
            <div className="mt-1">{telemetry.apparatusState}</div>
            <div>
              spot ({telemetry.spotXFraction.toFixed(2)}, {telemetry.spotZFraction.toFixed(2)}) ·
              laminae {telemetry.visibleLaminaCount}
            </div>
            <div className="mt-1 text-rose-300">quantitative cure solve: refused</div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 md:col-span-2">
              <div className="text-xs font-medium text-stone-300">Electronic shutter</div>
              <button
                type="button"
                aria-label={controls.shutterRequestedOpen === 1 ? "Close shutter" : "Open shutter"}
                aria-pressed={controls.shutterRequestedOpen === 1}
                onClick={() =>
                  updateParam("shutterRequestedOpen", controls.shutterRequestedOpen === 1 ? 0 : 1)
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
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
              <label htmlFor="sla-3d-scan-x" className="block text-xs font-medium text-stone-300">
                Scan spot X ({controls.scanXFraction.toFixed(2)})
              </label>
              <input
                id="sla-3d-scan-x"
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={controls.scanXFraction}
                onChange={(event) => updateParam("scanXFraction", Number(event.target.value))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
              <label htmlFor="sla-3d-scan-z" className="block text-xs font-medium text-stone-300">
                Scan spot Z ({controls.scanZFraction.toFixed(2)})
              </label>
              <input
                id="sla-3d-scan-z"
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={controls.scanZFraction}
                onChange={(event) => updateParam("scanZFraction", Number(event.target.value))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
              <label htmlFor="sla-3d-recoat" className="block text-xs font-medium text-stone-300">
                Recoating excursion ({Math.round(controls.recoatExcursionFraction * 100)}%)
              </label>
              <input
                id="sla-3d-recoat"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={controls.recoatExcursionFraction}
                onChange={(event) =>
                  updateParam("recoatExcursionFraction", Number(event.target.value))
                }
                className="mt-1 w-full accent-amber-500"
              />
            </div>
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3">
              <label htmlFor="sla-3d-laminae" className="block text-xs font-medium text-stone-300">
                Illustrative laminae ({controls.displayLaminaCount})
              </label>
              <input
                id="sla-3d-laminae"
                type="range"
                min="1"
                max="12"
                step="1"
                value={controls.displayLaminaCount}
                onChange={(event) => updateParam("displayLaminaCount", Number(event.target.value))}
                className="mt-1 w-full accent-amber-500"
              />
            </div>
          </div>

          {telemetry.shutterInterlockActive && (
            <div className="rounded-xl border border-amber-400/40 bg-amber-950/30 p-3 text-sm text-amber-100">
              The requested open shutter is held closed during the recoating excursion. Return
              platform 29 to the working position before exposing another surface lamina.
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs leading-relaxed text-emerald-100">
              <div className="font-mono font-bold uppercase tracking-wider text-emerald-300">
                Printed preferred source card
              </div>
              <div className="mt-1">
                350 W mercury short-arc lamp · 1 mm fiber bundle · 1 m bundle length · spot somewhat
                under 1 mm · about 1 W/cm² long-wave UV at surface 23.
              </div>
            </div>
            <div className="break-words rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs leading-relaxed text-rose-100">
              <div className="font-mono font-bold uppercase tracking-wider text-rose-300">
                FrankenSim boundary
              </div>
              <div className="mt-1">
                {HULL_FRANKENSIM_ELEVATOR_OWNER} owns a parameterized elevator and{" "}
                {HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER} owns attenuation—not cure chemistry. The
                grant lacks the motion and resin cards needed to step either result, so cure depth,
                adhesion, conversion, force, and time remain refused.
              </div>
            </div>
          </div>

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
        </div>
      </div>

      <div className="border-t border-stone-800 bg-stone-950 p-2 sm:p-4">
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
