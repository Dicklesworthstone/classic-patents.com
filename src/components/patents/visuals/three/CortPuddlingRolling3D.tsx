"use client";

import { useEffect, useRef, useState } from "react";
import { stepCortPuddlingRolling } from "@/physics/cortKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildCortPuddlingRollingModel } from "./cortPuddlingRollingModel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const EXHIBIT_ID = "gb-1420-cort-puddling-rolling";

export function CortPuddlingRolling3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutaway, setCutaway] = useState(true);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<
    "iso" | "furnace" | "hearth" | "mill" | "grooves"
  >("iso");

  const { params } = usePatentPhysics(EXHIBIT_ID);
  const live = useLiveSimParams({
    furnaceTemperatureCelsius: params.furnaceTemperatureCelsius ?? 1350,
    initialCarbonPercent: params.initialCarbonPercent ?? 3.8,
    rabbleStirringRpm: params.rabbleStirringRpm ?? 15,
    puddlingDurationMinutes: params.puddlingDurationMinutes ?? 90,
    rollerPassCount: params.rollerPassCount ?? 5,
    rollSpeedRpm: params.rollSpeedRpm ?? 30,
  });

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
      cameraPos: [0, 2.8, 6.0],
      targetPos: [0, 1.2, 0],
      fov: 42,
      environmentStyle: "studio",
      enableFloorGrid: true,
      floorColor: 0x181512,
      gridColor: 0x2d241e,
      ambientIntensity: 0.85,
      sunIntensity: 1.6,
    });
    studioRef.current = studio;

    const model = buildCortPuddlingRollingModel();
    studio.scene.add(model.root);

    let virtualTime = 0;
    let animId = 0;

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      virtualTime += 1 / 60;

      const p = live.current;
      const outputs = stepCortPuddlingRolling({
        furnaceTemperatureCelsius: p.furnaceTemperatureCelsius,
        initialCarbonPercent: p.initialCarbonPercent,
        rabbleStirringRpm: p.rabbleStirringRpm,
        puddlingDurationMinutes: p.puddlingDurationMinutes,
        rollerPassCount: p.rollerPassCount,
        rollSpeedRpm: p.rollSpeedRpm,
      });

      model.setCutaway(cutawayRef.current);
      model.setShowCallouts(calloutsRef.current);
      model.updateAnimation(
        virtualTime,
        outputs.isPastyNatureState,
        outputs.rollOmegaRadPerS,
        outputs.rabbleOmegaRadPerS,
      );

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      model.dispose();
      studio.dispose();
    };
  }, [live]);

  const handlePreset = (preset: "iso" | "furnace" | "hearth" | "mill" | "grooves") => {
    setActivePreset(preset);
    const studio = studioRef.current;
    if (!studio) return;

    if (preset === "iso") {
      studio.controls.setView([0, 2.8, 6.0], [0, 1.2, 0]);
    } else if (preset === "furnace") {
      studio.controls.setView([-2.8, 2.2, 3.8], [-2.8, 1.2, 0]);
    } else if (preset === "hearth") {
      studio.controls.setView([-2.5, 1.8, 1.6], [-2.5, 0.9, 0]);
    } else if (preset === "mill") {
      studio.controls.setView([2.0, 1.8, 3.6], [2.0, 1.1, 0]);
    } else if (preset === "grooves") {
      studio.controls.setView([2.0, 1.3, 1.8], [2.0, 1.0, 0]);
    }
  };

  const furnaceTempC = params.furnaceTemperatureCelsius ?? 1350;
  const initialCarbon = params.initialCarbonPercent ?? 3.8;
  const rabbleRpm = params.rabbleStirringRpm ?? 15;
  const puddlingMin = params.puddlingDurationMinutes ?? 90;
  const rollerPasses = params.rollerPassCount ?? 5;
  const rollSpeedRpm = params.rollSpeedRpm ?? 30;

  const outputs = stepCortPuddlingRolling({
    furnaceTemperatureCelsius: furnaceTempC,
    initialCarbonPercent: initialCarbon,
    rabbleStirringRpm: rabbleRpm,
    puddlingDurationMinutes: puddlingMin,
    rollerPassCount: rollerPasses,
    rollSpeedRpm,
  });

  const chips: KernelChip[] = [
    {
      label: "Charge State",
      value: outputs.isPastyNatureState ? "Coming to Nature" : "Molten Fluid",
      unit: `${outputs.residualCarbonPercent.toFixed(2)}% C`,
      tone: outputs.isPastyNatureState ? "ok" : "warn",
    },
    {
      label: "Melting Point",
      value: `${outputs.ironMeltingPointCelsius} °C`,
      unit: `+${outputs.ironMeltingPointCelsius - 1147}°C rise`,
      tone: "ok",
    },
    {
      label: "Residual Slag",
      value: `${outputs.residualSlagVolumeFractionPercent.toFixed(1)}%`,
      unit: `-${outputs.slagExpelledKg.toFixed(1)} kg`,
      tone: outputs.residualSlagVolumeFractionPercent < 3.0 ? "ok" : "warn",
    },
    {
      label: "Tensile Strength",
      value: `${outputs.tensileStrengthMpa.toFixed(0)} MPa`,
      unit: `${outputs.ductilityElongationPercent.toFixed(0)}% elongation`,
      tone: "ok",
    },
    {
      label: "Throughput Speedup",
      value: `${outputs.productionSpeedupVsHammer}×`,
      unit: `${outputs.hourlyIronOutputKg} kg/h`,
      tone: "ok",
    },
  ];

  const presets: { id: "iso" | "furnace" | "hearth" | "mill" | "grooves"; label: string }[] = [
    { id: "iso", label: "Overview" },
    { id: "furnace", label: "Puddling Furnace" },
    { id: "hearth", label: "Molten Hearth" },
    { id: "mill", label: "Rolling Mill" },
    { id: "grooves", label: "Groove Passes" },
  ];

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden bg-ink-950 border border-parchment-700/40 shadow-2xl">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Camera Presets */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 bg-ink-900/80 backdrop-blur-md p-1.5 rounded-xl border border-parchment-700/30">
        {presets.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handlePreset(id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
              activePreset === id
                ? "bg-amber-600 text-white font-bold"
                : "text-parchment-300 hover:text-white hover:bg-ink-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Toggles */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => setCutaway((v) => !v)}
          className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors backdrop-blur-md border ${
            cutaway
              ? "bg-rose-600 text-white border-rose-400"
              : "bg-ink-900/80 text-parchment-200 border-parchment-700/40 hover:bg-ink-800"
          }`}
        >
          {cutaway ? "Roof Cutaway ON" : "Roof Cutaway OFF"}
        </button>
        <button
          type="button"
          onClick={() => setShowCallouts((v) => !v)}
          className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors backdrop-blur-md border ${
            showCallouts
              ? "bg-emerald-600 text-white border-emerald-400"
              : "bg-ink-900/80 text-parchment-200 border-parchment-700/40 hover:bg-ink-800"
          }`}
        >
          {showCallouts ? "Pins ON" : "Pins OFF"}
        </button>
      </div>

      {/* Bottom SI Telemetry Chips */}
      <StudioKernelChips visible={true} chips={chips} title="SI Telemetry" />
    </div>
  );
}
