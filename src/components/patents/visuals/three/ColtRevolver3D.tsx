"use client";

import { Activity, Eye, EyeOff, Layers, RotateCcw, Target, Zap } from "lucide-react";
import { type FocusEvent, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { SensitivitySlider } from "@/components/ui/SensitivitySlider";
import { claimConstraintStateParamId } from "@/physics/claimConstraints";
import {
  COLT_SOURCE_BOUNDARY,
  readColtRuntimeControls,
  stepColtLockwork,
} from "@/physics/coltRevolverKernel";
import { ensureGenericWasm } from "@/physics/genericWasm";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { type ColtRevolverCameraPreset, coltRevolverCameraForViewport } from "./coltRevolverCamera";
import {
  buildColtRevolverModel,
  type ColtRevolverModel,
  updateColtRevolverKinematics,
} from "./coltRevolverModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

/**
 * Keep a keyboard-focused phone control in the lower safe viewing lane.
 * Native range focus otherwise stops with the museum masthead across the
 * remaining visible strip of the canvas. This is Colt-local: it leaves the
 * shared sticky header and the action row's own sticky behavior alone.
 */
function keepFocusedPhoneControlClear(event: FocusEvent<HTMLElement>) {
  const target = event.target;
  const isRange = target instanceof HTMLInputElement && target.type === "range";
  const isClaimToggle =
    target instanceof HTMLButtonElement &&
    target.closest('[data-testid="claim-constraint-toggle"]') !== null;
  if (!isRange && !isClaimToggle) return;
  if (!window.matchMedia("(max-width: 639px)").matches) return;

  // Focusing a claim chip happens during pointer activation. Moving the page
  // in that focus phase can relocate the pointer before its click dispatches,
  // so wait for the next paint while retaining keyboard-focus clearance.
  window.requestAnimationFrame(() => {
    if (!target.isConnected || document.activeElement !== target) return;
    target.scrollIntoView({ block: "end", inline: "nearest", behavior: "instant" });
  });
}

export function ColtRevolver3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const { params, effectiveParams, claimStates, updateParam, resetParams } =
    usePatentPhysics("us-x9430-colt-revolver");

  const sourceControls = readColtRuntimeControls(effectiveParams);
  const lockwork = stepColtLockwork(sourceControls);
  const cockingTravelPct = sourceControls.cockingTravelPct;
  const currentChamberIndex = sourceControls.chamberIndex;

  useEffect(() => {
    void ensureGenericWasm();
  }, []);

  useFrankenSimPhysics("us-x9430-colt-revolver", {
    domain: "solid_mechanics",
    refusal: { isRefused: false },
    continuum: {
      tensileStressMpa: 0,
      tensileStrainPct: 0,
      elasticModulusGpa: 200,
      crossLinkDensityMolesPerCm3: 0,
      stitchFrequencyHz: 0,
      feedVelocityMmPs: 0,
      buoyancyLiftForceKiloNewtons: 0,
    },
  });

  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [showLockworkCutaway, setShowLockworkCutaway] = useState<boolean>(false);
  const [showCalloutPins, setShowCalloutPins] = useState<boolean>(false);
  const [activeCamera, setActiveCamera] = useState<ColtRevolverCameraPreset>("iso");
  const isFullCock = lockwork.safeToReleaseHammer;

  const live = useLiveSimParams({
    ...sourceControls,
    showLockworkCutaway,
    showCalloutPins,
  });

  const applyCameraPreset = (preset: ColtRevolverCameraPreset) => {
    setActiveCamera(preset);
    const container = containerRef.current;
    const cfg = coltRevolverCameraForViewport(
      preset,
      container?.clientWidth ?? window.innerWidth,
      container?.clientHeight ?? window.innerHeight,
    );
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const handleCockHammer = useCallback(() => {
    updateParam("cockingTravelPct", 100);
  }, [updateParam]);

  const handleReleaseHammer = useCallback(() => {
    if (!lockwork.safeToReleaseHammer) return;
    updateParam("chamberIndex", lockwork.alignedChamberIndex);
    updateParam("cockingTravelPct", 0);
  }, [lockwork.alignedChamberIndex, lockwork.safeToReleaseHammer, updateParam]);

  // 3D Scene Initialization
  // The mounted scene reads the stable, layout-effect-synchronized live ref so toggling visual controls never destroys and flashes the WebGL canvas.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = coltRevolverCameraForViewport("iso", container.clientWidth, container.clientHeight);
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
      fov: 38,
      enableFloorGrid: true,
      enableClouds: true,
    });
    studioRef.current = studio;

    const { scene, camera, renderer, controls } = studio;

    // Build Museum-Quality Procedural Colt Paterson 1836 Model
    const model: ColtRevolverModel = buildColtRevolverModel();
    scene.add(model.group);

    // Callout Pins & Historical Markers
    const pinGroup = new THREE.Group();
    pinGroup.visible = live.current.showCalloutPins;

    const callouts = [
      { pos: [4.8, 0.82, 0], text: "1. Barrel and arbor" },
      { pos: [0.0, 0.0, 0], text: "2. Cylinder and wards" },
      { pos: [-2.5, 0.8, 0], text: "3. Hammer and pin p" },
      { pos: [-2.1, -1.8, 0], text: "4. Trigger and connecting-rod" },
      { pos: [-3.0, -1.8, 0], text: "5. Locking key r and spring m" },
      { pos: [3.5, -0.4, 0], text: "6. Lifter d and tooth s" },
      { pos: [2.35, 0.0, 0], text: "7. Ratchet and shackle" },
      { pos: [-1.4, 0.0, 0], text: "8. Cylinder locking-and-turning path" },
    ];

    for (const c of callouts) {
      const pinAnchor = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xd97706,
          emissiveIntensity: 0.5,
          metalness: 0.8,
          roughness: 0.2,
        }),
      );
      pinAnchor.position.set(c.pos[0], c.pos[1], c.pos[2]);
      pinGroup.add(pinAnchor);
    }
    model.group.add(pinGroup);

    // Animation Loop
    let reqId = 0;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (!studio.isVisible()) return;
      const p = live.current;
      const state = stepColtLockwork({
        cockingTravelPct: p.cockingTravelPct,
        chamberIndex: p.chamberIndex,
        claim1CapsPresent: p.claim1CapsPresent,
        claim2PartitionsPresent: p.claim2PartitionsPresent,
        claim5ShacklePresent: p.claim5ShacklePresent,
        claim6LockingAndTurningPresent: p.claim6LockingAndTurningPresent,
      });

      // The model receives only the shared source-order state.  There is no
      // recoil, muzzle flash, pressure, time law, or other ballistic proxy.
      updateColtRevolverKinematics(model, state, p.showLockworkCutaway);

      pinGroup.visible = p.showCalloutPins;

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
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-clip border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only" title={COLT_SOURCE_BOUNDARY}>
        Samuel Colt revolving-gun source-ordered lockwork model; ballistics are not modeled.
      </div>
      {/* 3D WebGL Canvas Viewport */}
      <div className="relative min-h-[420px] sm:min-h-[500px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Camera Preset Toolbar (Top-Left) */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none gap-1 sm:gap-1.5 max-w-[calc(100%-14rem)] sm:max-w-[calc(100%-24rem)] p-1 sm:p-1.5 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md border border-parchment-300 dark:border-ink-700 shadow-sm">
            {(
              [
                ["iso", "Profile 3D"],
                ["cylinder", "Cylinder"],
                ["lockwork", "Action"],
                ["sightline", "Sightline"],
                ["loading_lever", "Under-barrel"],
                ["top", "Top Plan"],
              ] as [ColtRevolverCameraPreset, string][]
            ).map(([preset, label]) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`min-h-9 px-2.5 py-1 text-xs font-mono rounded-lg shrink-0 whitespace-nowrap transition-colors border shadow-2xs ${
                  activeCamera === preset
                    ? "bg-amber-600 text-white font-bold border-amber-500 shadow-sm"
                    : "text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Floating View Actions (Top-Right) */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowLockworkCutaway(!showLockworkCutaway)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${
              showLockworkCutaway
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-white/85 dark:bg-ink-900/85 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
            }`}
            title={
              showLockworkCutaway ? "Hide Internal Lockwork" : "Show Internal Lockwork Cutaway"
            }
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowCalloutPins(!showCalloutPins)}
            className={`p-2 rounded-xl backdrop-blur-md border transition-colors ${
              showCalloutPins
                ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                : "bg-white/85 dark:bg-ink-900/85 text-ink-700 dark:text-parchment-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800"
            }`}
            title={showCalloutPins ? "Hide Part Annotations" : "Show Part Annotations"}
          >
            <Zap className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className="p-2 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={resetParams}
            className="p-2 rounded-xl bg-white/85 dark:bg-ink-900/85 backdrop-blur-md text-ink-700 dark:text-parchment-200 border border-parchment-300 dark:border-ink-700 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Simulation Parameters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Telemetry Overlay (Bottom-Left in Canvas) */}
        {showUiOverlay && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 flex flex-col gap-2 pointer-events-none max-w-xs sm:max-w-sm">
            <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Display Ward #{currentChamberIndex} Lockwork
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isFullCock
                      ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                      : cockingTravelPct > 0
                        ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700"
                        : "bg-parchment-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300"
                  }`}
                >
                  {isFullCock
                    ? "Locked for Release"
                    : cockingTravelPct > 0
                      ? lockwork.stage.replaceAll("-", " ")
                      : "Rest Locked"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Key r:</span>{" "}
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {lockwork.keySeated ? "seated" : "withdrawn"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Ratchet:</span>{" "}
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {(lockwork.ratchetAdvanceFraction * 100).toFixed(0)}% step
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Cylinder:</span>{" "}
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-300">
                    {lockwork.cylinderAndRatchetCoupled
                      ? `${(lockwork.cylinderAdvanceFraction * 100).toFixed(0)}% step`
                      : "uncoupled"}
                  </span>
                </div>
                <div>
                  <span className="text-ink-600 dark:text-ink-400">Release:</span>{" "}
                  <span className="font-mono font-bold text-ink-800 dark:text-parchment-200">
                    {lockwork.safeToReleaseHammer ? "permitted" : "withheld"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom source-order telemetry strip */}
        <StudioKernelChips
          side="right"
          visible={showUiOverlay}
          title="SOURCE-ORDERED LOCKWORK"
          chips={[
            {
              label: "cock",
              value: `${cockingTravelPct.toFixed(0)}`,
              unit: "% display",
            },
            {
              label: "key r",
              value: lockwork.keySeated ? "seated" : "withdrawn",
            },
            {
              label: "ratchet",
              value: `${(lockwork.ratchetAdvanceFraction * 100).toFixed(0)}`,
              unit: "% step",
            },
            {
              label: "cylinder",
              value: `${(lockwork.cylinderAdvanceFraction * 100).toFixed(0)}`,
              unit: "% step",
            },
            {
              label: "release",
              value: lockwork.safeToReleaseHammer ? "permitted" : "withheld",
            },
            { label: "ward", value: `display ${currentChamberIndex}` },
          ]}
        />
      </div>

      {/* Interactive Bottom Control Deck */}
      <div
        className="p-4 sm:p-5 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800 space-y-4 max-sm:[&_input[type=range]]:scroll-mb-[calc(4rem+env(safe-area-inset-top))]"
        onFocusCapture={keepFocusedPhoneControlClear}
      >
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2.5 bg-parchment-100/95 dark:bg-ink-900/95 max-sm:sticky max-sm:top-[calc(4rem+env(safe-area-inset-top))] max-sm:z-20 max-sm:py-2">
          <button
            type="button"
            onClick={handleCockHammer}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-[background-color,transform] cursor-pointer"
          >
            <Activity className="w-4 h-4" />
            Cock Hammer (Display Pose)
          </button>

          <button
            type="button"
            onClick={handleReleaseHammer}
            disabled={!isFullCock}
            className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 px-4 py-2.5 font-mono text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-[background-color,color,border-color,transform] cursor-pointer ${
              isFullCock
                ? "bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white ring-2 ring-emerald-400/50"
                : "bg-parchment-300 dark:bg-ink-800 text-ink-400 dark:text-ink-600 cursor-not-allowed border border-parchment-400 dark:border-ink-700"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Release Hammer (No Ballistics Model)
          </button>
        </div>

        {/* Sensitivity Sliders Grid */}
        <div className="grid grid-cols-1 gap-4 pt-1 max-sm:[&_input[type=range]]:scroll-mt-72 md:grid-cols-2">
          <SensitivitySlider
            id="us-x9430-colt-revolver-cockingtravel"
            patentId="us-x9430-colt-revolver"
            paramKey="cockingTravelPct"
            label="Normalized Cocking Travel"
            value={cockingTravelPct}
            min={0}
            max={100}
            step={1}
            unit="% display"
            onChange={(val) => updateParam("cockingTravelPct", val)}
            allParams={params}
          />

          <SensitivitySlider
            id="us-x9430-colt-revolver-chamberindex"
            patentId="us-x9430-colt-revolver"
            paramKey="chamberIndex"
            label="Starting Display Ward"
            value={currentChamberIndex}
            min={1}
            max={5}
            step={1}
            unit="display index"
            onChange={(val) => updateParam("chamberIndex", val)}
            allParams={params}
          />
        </div>

        {/* Claim Inversion Failure Modes */}
        <ClaimConstraintToggle
          patentId="us-x9430-colt-revolver"
          claimStates={claimStates}
          onToggleClaim={(claimNo, active) =>
            updateParam(claimConstraintStateParamId(claimNo), active ? 1 : 0)
          }
          className="mt-2 max-sm:[&_button]:scroll-mt-72 max-sm:[&_button]:scroll-mb-[calc(4rem+env(safe-area-inset-top))]"
        />

        {/* Footer Attribution Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] font-sans text-ink-600 dark:text-ink-400 border-t border-parchment-200 dark:border-ink-800/80">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Samuel Colt (US X9430 · 1836) — locking-and-turning cylinder mechanism</span>
          </span>
          <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
            Source-bounded host topology · no ballistic telemetry
          </span>
        </div>
      </div>
    </div>
  );
}
