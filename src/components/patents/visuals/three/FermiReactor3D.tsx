"use client";

import { Eye, EyeOff, Layers, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import {
  FERMI_KINETICS_SOURCE_BOUNDARY,
  NATURAL_URANIUM_U235_PERCENT,
  stepFermiKinetics,
} from "@/physics/fermiKinetics";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { createStudioClock } from "@/physics/tickScheduler";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import {
  type FermiReactorCameraPreset as CameraPreset,
  FERMI_REACTOR_CAMERA_PRESETS,
  fermiReactorViewForViewport,
} from "./fermiReactorCamera";
import { buildFermiReactorModel, updateFermiReactorKinematics } from "./fermiReactorModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

export function FermiReactor3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { params, updateParam } = usePatentPhysics("us-2708656-fermi-reactor");
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [isCutaway, setIsCutaway] = useState<boolean>(true);
  const controlRodWithdrawalPct = params.rodWithdrawal ?? 83.5;
  const moderatorPurityPct = params.moderatorPurity ?? 99.5;
  const showNeutronCascade = true;
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("iso");
  const claim1Active = (params.claim1Active ?? 1) >= 0.5;

  useEffect(() => {
    // Generic FrankenSim lattice/field helpers supply the display texture.
    // They do not promote this source-bounded view into a neutronics solver.
    void ensureGenericWasm();
  }, []);

  const reactorKinetics = stepFermiKinetics(
    controlRodWithdrawalPct,
    moderatorPurityPct,
    NATURAL_URANIUM_U235_PERCENT,
    claim1Active,
  );
  const normalizedWithdrawalPct = 100 * (1 - reactorKinetics.controlRodInsertionFraction);
  const declaredPurityPct = reactorKinetics.moderatorPurityPercent;

  const kEff = reactorKinetics.kEffective.toFixed(3);
  const isSupercritical = claim1Active && Number(kEff) > 1.002;
  const isCritical = claim1Active && Number(kEff) >= 0.998 && Number(kEff) <= 1.002;

  useFrankenSimPhysics("us-2708656-fermi-reactor", {
    domain: "nuclear_kinetics",
    refusal: { isRefused: true, reason: FERMI_KINETICS_SOURCE_BOUNDARY },
  });

  const live = useLiveSimParams({
    controlRodWithdrawalPct: normalizedWithdrawalPct,
    moderatorPurityPct: declaredPurityPct,
    showNeutronCascade,
    isCutaway,
    claim1Active,
    kEff,
    neutronDisplaySpeed: reactorKinetics.neutronDisplaySpeed,
    rodStudioX: reactorKinetics.rodStudioX,
    fuelGlowIntensity: reactorKinetics.fuelGlowIntensity,
  });

  const studioRef = useRef<StudioContext | null>(null);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const cfg = fermiReactorViewForViewport(preset, containerRef.current?.clientWidth ?? 1024);
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = fermiReactorViewForViewport("iso", container.clientWidth);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Build procedural 3D model
    const model = buildFermiReactorModel();
    scene.add(model.root);

    let reqId: number;
    const clock = createStudioClock();

    const animate = (now: number) => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const { dt: delta } = clock.pump(now);
      const p = live.current;

      updateFermiReactorKinematics(
        model,
        delta,
        p.controlRodWithdrawalPct,
        Number(p.kEff),
        p.moderatorPurityPct,
        p.neutronDisplaySpeed,
        p.rodStudioX,
        p.fuelGlowIntensity,
        p.showNeutronCascade,
        p.isCutaway,
        p.claim1Active,
      );

      controls.update();
      renderer.render(scene, camera);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-parchment-100 dark:bg-ink-950 border border-parchment-300 dark:border-ink-800 shadow-xl flex flex-col transition-colors">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-900/90 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${claim1Active ? "bg-emerald-500" : "bg-rose-500"}`}
            />
            <h3 className="font-serif text-base sm:text-lg font-bold text-ink-900 dark:text-parchment-100">
              Fermi & Szilard Graphite–Uranium Reactor (US 2,708,656)
            </h3>
          </div>
          <p className="text-xs text-ink-600 dark:text-ink-400 mt-0.5">
            Figures 7–8 source arrangement: enclosed graphite pile, natural-uranium rod lattice,
            side-entry absorbers, and ionization chamber.
          </p>
        </div>
      </div>

      {/* 3D WebGL Studio Canvas Viewport */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[380px] max-h-[600px] bg-ink-950 overflow-hidden select-none">
        <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Top-Left Camera View Presets Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 shadow-sm max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-28rem)]">
            {(Object.keys(FERMI_REACTOR_CAMERA_PRESETS) as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2 py-1 rounded-lg text-xs font-sans font-semibold shrink-0 whitespace-nowrap transition-colors ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800"
                }`}
              >
                {FERMI_REACTOR_CAMERA_PRESETS[preset].label}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap items-center gap-1.5 max-w-[min(90%,26rem)] sm:max-w-[26rem] justify-end">
          <button
            type="button"
            onClick={() => {
              setIsCutaway(!isCutaway);
            }}
            title={
              isCutaway ? "Restore enclosure and opaque moderator" : "Expose Claim 1 rod lattice"
            }
            aria-label={
              isCutaway ? "Restore enclosure and opaque moderator" : "Expose Claim 1 rod lattice"
            }
            className={`min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              isCutaway
                ? "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
                : "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`min-h-9 p-1.5 sm:p-2 rounded-xl backdrop-blur-md border transition-colors shadow-sm ${
              showUiOverlay
                ? "bg-white/90 dark:bg-ink-900/90 border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100"
                : "bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-500/30"
            }`}
            title={showUiOverlay ? "Hide Overlay UI (Clean 3D View)" : "Show Overlay UI"}
            aria-label={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="min-h-9 min-w-9 flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom-Left Telemetry HUD */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 p-3 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md rounded-xl border border-parchment-300 dark:border-ink-800 pointer-events-none text-xs font-mono flex flex-col gap-1.5 shadow-md max-w-xs text-ink-900 dark:text-parchment-100">
            <div className="flex items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800/80 pb-1">
              <span className="text-ink-600 dark:text-ink-400 font-sans font-semibold">
                k Effective:
              </span>
              <span
                className={`font-bold ${
                  isSupercritical
                    ? "text-red-700 dark:text-red-400"
                    : isCritical
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-blue-700 dark:text-blue-400"
                }`}
              >
                {claim1Active
                  ? `${kEff} (${isSupercritical ? "above unity" : isCritical ? "near unity" : "below unity"})`
                  : "not established"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Claim 1 lattice:</span>
              <span
                className={`${claim1Active ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"} font-bold`}
              >
                {claim1Active ? "present" : "uranium rods removed"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Fuel:</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold">natural uranium</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-ink-600 dark:text-ink-400">Rod Withdrawal:</span>
              <span className="text-cyan-800 dark:text-cyan-400 font-bold">
                {normalizedWithdrawalPct}%
              </span>
            </div>
          </div>
        )}

        {/* Bottom-Right SI Telemetry Chip Strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE TOPOLOGY · NORMALIZED ABSORBER LENS"
          chips={[
            {
              label: "Claim 1 path",
              value: claim1Active ? "graphite + U rods" : "removed",
              tone: claim1Active ? "ok" : "warn",
            },
            {
              label: "Scenario k_eff",
              value: claim1Active ? String(kEff) : "refused",
              tone: isSupercritical ? "hot" : isCritical ? "ok" : "warn",
            },
            {
              label: "Absorber travel",
              value: `${normalizedWithdrawalPct.toFixed(1)}%`,
              unit: "normalized",
            },
            {
              label: "Graphite",
              value: `${declaredPurityPct.toFixed(1)}%`,
              unit: "declared purity",
            },
            {
              label: "Fuel basis",
              value: `${NATURAL_URANIUM_U235_PERCENT.toFixed(2)}% U-235`,
              unit: "natural-U ref.",
            },
            { label: "Source contour", value: "Figure 3", unit: "K = 1 boundary" },
          ]}
        />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <p
          data-testid="fermi-reactor-source-boundary"
          className="mb-4 text-xs leading-relaxed text-ink-600 dark:text-ink-300"
        >
          <strong className="text-ink-900 dark:text-parchment-100">Source boundary.</strong>{" "}
          {FERMI_KINETICS_SOURCE_BOUNDARY}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SensitivitySlider
            id="rodWithdrawal"
            patentId="us-2708656-fermi-reactor"
            paramKey="rodWithdrawal"
            label="Normalized Absorber Withdrawal"
            value={normalizedWithdrawalPct}
            min={0}
            max={100}
            step={0.5}
            unit="%"
            onChange={(val) => updateParam("rodWithdrawal", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="moderatorPurity"
            patentId="us-2708656-fermi-reactor"
            paramKey="moderatorPurity"
            label="Declared Graphite Purity"
            value={declaredPurityPct}
            min={95}
            max={100}
            step={0.1}
            unit="%"
            onChange={(val) => updateParam("moderatorPurity", val)}
            allParams={params}
          />
        </div>
        <ClaimConstraintToggle
          patentId="us-2708656-fermi-reactor"
          claimStates={{ 1: claim1Active }}
          onToggleClaim={(_claimNumber, active) => updateParam("claim1Active", active ? 1 : 0)}
          className="mt-2"
        />
      </div>
    </div>
  );
}
