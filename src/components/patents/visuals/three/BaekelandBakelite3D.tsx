"use client";

import { Camera, Eye, EyeOff, Layers, RotateCcw, Volume2, VolumeX, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { createStudioClock } from "@/physics/tickScheduler";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { soundEngine } from "@/utils/soundEngine";
import { buildBaekelandBakeliteModel } from "./baekelandBakeliteModel";
import { type KernelChip, StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";
import { usePatentAudio } from "./usePatentAudio";

const EXHIBIT_ID = "us-942699-baekeland-bakelite";

type CameraPreset = "iso" | "autoclave" | "mold" | "molecular" | "gauges";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { pos: [number, number, number]; target: [number, number, number] }
> = {
  iso: { pos: [4.5, 3.2, 5.5], target: [0, 1.6, 0] },
  autoclave: { pos: [0, 1.8, 4.0], target: [0, 1.4, 0] },
  mold: { pos: [0, 1.4, 1.6], target: [0, 1.3, 0] },
  molecular: { pos: [0, 4.2, 2.5], target: [0, 3.4, 0] },
  gauges: { pos: [0, 2.8, 1.8], target: [0, 2.4, 0] },
};

const PRESET_LABELS: Record<CameraPreset, string> = {
  iso: "Isometric",
  autoclave: "Autoclave",
  mold: "Mold & Press",
  molecular: "Polymer Matrix",
  gauges: "Gauges",
};

export function BaekelandBakelite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [cutaway, setCutaway] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<CameraPreset>("iso");
  const { isAudioMuted, toggleSound } = usePatentAudio();

  const { params, updateParam } = usePatentPhysics(EXHIBIT_ID);
  const tempC = (params.curingTempC as number) ?? 130;
  const pressPsi = (params.autoclavePressurePsi as number) ?? 75;
  const catPct = (params.catalystPct as number) ?? 1.5;
  const timeMin = (params.curingTimeMin as number) ?? 60;
  const filler = (params.fillerPct as number) ?? 45;

  const live = useLiveSimParams({
    curingTempC: tempC,
    autoclavePressurePsi: pressPsi,
    catalystPct: catPct,
    curingTimeMin: timeMin,
    fillerPct: filler,
  });

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;
  const calloutsRef = useRef(showCallouts);
  calloutsRef.current = showCallouts;

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const iso = CAMERA_PRESETS.iso;
    const studio = createThreeStudioScene({
      container,
      cameraPos: iso.pos,
      targetPos: iso.target,
    });
    studioRef.current = studio;

    const model = buildBaekelandBakeliteModel();
    studio.scene.add(model.rootGroup);

    let rafId = 0;
    const clock = createStudioClock();

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate);
      const { simTimeSec: virtualTime } = clock.pump(now);

      model.update(live.current, virtualTime);
      model.setCutaway(cutawayRef.current);
      model.setCalloutsVisible(calloutsRef.current);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const applyCameraPreset = (preset: CameraPreset) => {
    setActivePreset(preset);
    if (preset === "mold") setCutaway(true);
    const cfg = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(cfg.pos, cfg.target);
  };

  const sim = stepBaekelandBakelite(tempC, pressPsi, catPct, timeMin, filler);

  const chips: KernelChip[] = [
    {
      label: "Stage",
      value: sim.resinStage.split(" ")[0] ?? "A-stage",
      tone: sim.resinStage.startsWith("C") ? "ok" : undefined,
    },
    {
      label: "Conversion",
      value: `${(sim.conversionP * 100).toFixed(1)}%`,
      tone: sim.conversionP >= 0.85 ? "ok" : undefined,
    },
    {
      label: "P_auto",
      value: `${pressPsi} psi`,
      tone: sim.isFoamingSuppressed ? "ok" : "warn",
    },
    {
      label: "Tensile",
      value: `${sim.tensileStrengthMpa} MPa`,
      tone: "ok",
    },
    {
      label: "Dielectric",
      value: `${sim.dielectricBreakdownKvPerMm} kV/mm`,
      tone: "ok",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-parchment-50/60 dark:bg-ink-950/80 rounded-2xl overflow-hidden border border-parchment-300 dark:border-ink-800 shadow-patent">
      <div className="sr-only">Leo Baekeland Bakelite Synthesis 3D</div>
      <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />

        {/* Top-Left Camera Preset Toolbar */}
        {showUiOverlay && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-nowrap overflow-x-auto scrollbar-none max-w-[calc(100%-14rem)] sm:max-w-none gap-1 sm:gap-1.5 bg-white/85 dark:bg-ink-900/85 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-parchment-300 dark:border-ink-700 shadow-sm text-[10px] sm:text-xs transition-opacity duration-200">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-ink-500 font-sans flex items-center gap-1 shrink-0">
              <Camera className="w-3.5 h-3.5" /> View:
            </span>
            {(["iso", "autoclave", "mold", "molecular", "gauges"] as const).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => applyCameraPreset(preset)}
                className={`px-2 py-1 rounded-lg transition-colors font-medium shrink-0 ${
                  activePreset === preset
                    ? "bg-amber-600 text-white shadow-xs font-semibold"
                    : "text-ink-700 dark:text-ink-300 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {PRESET_LABELS[preset]}
              </button>
            ))}
          </div>
        )}

        {/* Top-Right Action Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-wrap justify-end gap-1.5 sm:gap-2 max-w-[90%]">
          <button
            type="button"
            onClick={() => {
              setCutaway(!cutaway);
              soundEngine.playSwitchClick();
            }}
            title={cutaway ? "Switch to Solid Autoclave" : "Switch to Autoclave Cutaway"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              cutaway
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{cutaway ? "Cutaway" : "Solid"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCallouts(!showCallouts);
              soundEngine.playSwitchClick();
            }}
            title={showCallouts ? "Hide Callout Numbers" : "Show Callout Numbers"}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs flex items-center gap-1 ${
              showCallouts
                ? "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
                : "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
            }`}
          >
            <Zap className="w-3.5 h-3.5 inline sm:mr-1" />
            <span className="hidden md:inline">{showCallouts ? "Pins" : "Pins Off"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              toggleSound();
              soundEngine.playSwitchClick();
            }}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isAudioMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isAudioMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-sans font-semibold border transition-colors shadow-xs ${
              showUiOverlay
                ? "bg-parchment-50/90 dark:bg-ink-900/90 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-700 hover:bg-parchment-100"
                : "bg-amber-700 text-white border-amber-800 shadow-md ring-2 ring-amber-500/30 dark:bg-amber-600"
            }`}
            title={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
            aria-label={showUiOverlay ? "Hide Overlay Telemetry" : "Show Overlay Telemetry"}
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden md:inline">{showUiOverlay ? "Hide HUD" : "Show HUD"}</span>
          </button>

          <button
            aria-label="Reset camera view"
            type="button"
            onClick={() => applyCameraPreset("iso")}
            className="p-1.5 sm:p-2.5 rounded-xl bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-ink-800 transition-colors shadow-sm"
            title="Reset Orbit Camera"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <StudioKernelChips visible={showUiOverlay} chips={chips} title="Bakelite SI Telemetry" />
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-4 bg-parchment-100/90 dark:bg-ink-900/90 border-t border-parchment-300 dark:border-ink-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Curing Temperature</span>
              <span className="text-amber-700 dark:text-amber-400 font-mono font-bold">
                {tempC} °C
              </span>
            </div>
            <input
              type="range"
              min="110"
              max="200"
              step="5"
              value={tempC}
              onChange={(e) => updateParam("curingTempC", Number.parseFloat(e.target.value))}
              className="w-full accent-amber-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Autoclave Pressure</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-mono font-bold">
                {pressPsi} psi
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="150"
              step="5"
              value={pressPsi}
              onChange={(e) =>
                updateParam("autoclavePressurePsi", Number.parseFloat(e.target.value))
              }
              className="w-full accent-cyan-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-xs font-sans">
              <span className="text-ink-700 dark:text-ink-300 font-medium">Wood-Flour Filler</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {filler}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={filler}
              onChange={(e) => updateParam("fillerPct", Number.parseFloat(e.target.value))}
              className="w-full accent-emerald-600 bg-parchment-300 dark:bg-ink-700 rounded-lg h-2 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
