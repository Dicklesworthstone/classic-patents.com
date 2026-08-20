"use client";

import { useEffect, useRef, useState } from "react";
import { stepBaekelandBakelite } from "@/physics/catalogKernels";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildBaekelandBakeliteModel } from "./baekelandBakeliteModel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const EXHIBIT_ID = "us-942699-baekeland-bakelite";

export function BaekelandBakelite3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutaway, setCutaway] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<
    "iso" | "autoclave" | "mold" | "molecular" | "gauges"
  >("iso");

  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams(params);

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;
  const calloutsRef = useRef(showCallouts);
  calloutsRef.current = showCallouts;

  const studioRef = useRef<ReturnType<typeof createThreeStudioScene> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [4.5, 3.2, 5.5],
      targetPos: [0, 1.6, 0],
      environmentStyle: "studio",
    });
    studioRef.current = studio;

    const model = buildBaekelandBakeliteModel();
    studio.scene.add(model.rootGroup);

    let virtualTime = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      virtualTime += 1 / 60;

      model.update(live.current, virtualTime);
      model.setCutaway(cutawayRef.current);
      model.setCalloutsVisible(calloutsRef.current);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      studio.dispose();
      studioRef.current = null;
    };
  }, [live]);

  const setPreset = (preset: "iso" | "autoclave" | "mold" | "molecular" | "gauges") => {
    setActivePreset(preset);
    const studio = studioRef.current;
    if (!studio) return;

    switch (preset) {
      case "iso":
        studio.camera.position.set(4.5, 3.2, 5.5);
        studio.controls.target.set(0, 1.6, 0);
        break;
      case "autoclave":
        studio.camera.position.set(0, 1.8, 4.0);
        studio.controls.target.set(0, 1.4, 0);
        break;
      case "mold":
        setCutaway(true);
        studio.camera.position.set(0, 1.4, 1.6);
        studio.controls.target.set(0, 1.3, 0);
        break;
      case "molecular":
        studio.camera.position.set(0, 4.2, 2.5);
        studio.controls.target.set(0, 3.4, 0);
        break;
      case "gauges":
        studio.camera.position.set(0, 2.8, 1.8);
        studio.controls.target.set(0, 2.4, 0);
        break;
    }
  };

  const tempC = (params.curingTempC as number) ?? 130;
  const pressPsi = (params.autoclavePressurePsi as number) ?? 75;
  const catPct = (params.catalystPct as number) ?? 1.5;
  const timeMin = (params.curingTimeMin as number) ?? 60;
  const filler = (params.fillerPct as number) ?? 45;

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
    <div className="relative w-full h-[600px] bg-stone-950 rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Chips */}
      <StudioKernelChips visible={true} chips={chips} title="Bakelite SI Telemetry" />

      {/* Camera Presets & Toggles */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap justify-between items-center gap-2 bg-stone-900/80 backdrop-blur-md p-2 rounded-lg border border-stone-700/60">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
          <span className="text-stone-400 mr-1 hidden sm:inline">Camera:</span>
          {(["iso", "autoclave", "mold", "molecular", "gauges"] as const).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              className={`px-2.5 py-1 rounded transition-colors ${
                activePreset === preset
                  ? "bg-amber-500 text-stone-950 font-bold"
                  : "bg-stone-800 text-stone-300 hover:bg-stone-700"
              }`}
            >
              {preset.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setCutaway(!cutaway)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              cutaway
                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold"
                : "bg-stone-800 border-stone-700 text-stone-400"
            }`}
          >
            {cutaway ? "CUTAWAY ON" : "CUTAWAY OFF"}
          </button>
          <button
            type="button"
            onClick={() => setShowCallouts(!showCallouts)}
            className={`px-2.5 py-1 rounded border transition-colors ${
              showCallouts
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                : "bg-stone-800 border-stone-700 text-stone-400"
            }`}
          >
            {showCallouts ? "CALLOUTS ON" : "CALLOUTS OFF"}
          </button>
        </div>
      </div>
    </div>
  );
}
