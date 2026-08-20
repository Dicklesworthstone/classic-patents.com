"use client";

import { useEffect, useRef, useState } from "react";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { stepWattCondenser, WATT_DEFAULT_CONTROLS } from "@/physics/wattCondenserKernel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";
import { buildWattSeparateCondenserModel } from "./wattSeparateCondenserModel";

const EXHIBIT_ID = "gb-913-watt-separate-condenser";

export function WattSeparateCondenser3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutaway, setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<
    "iso" | "cylinder" | "condenser" | "beam" | "boiler"
  >("iso");

  const { params } = usePatentPhysics(EXHIBIT_ID);
  const liveParams = useRef(params);
  useEffect(() => {
    liveParams.current = params;
  }, [params]);

  const cutawayRef = useRef(cutaway);
  cutawayRef.current = cutaway;
  const calloutsRef = useRef(showCallouts);
  calloutsRef.current = showCallouts;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const studio = createThreeStudioScene({
      container,
      cameraPos: [9, 7, 12],
      targetPos: [0, 3.5, 0],
      environmentStyle: "studio",
    });

    const model = buildWattSeparateCondenserModel();
    studio.scene.add(model.root);

    let cyclePhase = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const p = liveParams.current;

      const spm = p.strokesPerMinute ?? WATT_DEFAULT_CONTROLS.strokesPerMinute;
      const cycleFreq = spm / 60;
      const dtVirtual = 1 / 60;
      cyclePhase = (cyclePhase + dtVirtual * cycleFreq * 2 * Math.PI) % (2 * Math.PI);

      const pistonPos = Math.sin(cyclePhase);
      const beamAngleRad = -pistonPos * (12 * (Math.PI / 180));

      model.beamGroup.rotation.z = beamAngleRad;
      model.pistonGroup.position.y = 2.6 + pistonPos * 0.5;
      model.airPumpRodGroup.position.y = 2.5 - pistonPos * 0.35;
      model.pitworkRodGroup.position.y = 2.5 - pistonPos * 0.55;
      model.setCutaway(cutawayRef.current);
      model.setCalloutsVisible(calloutsRef.current);

      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      model.dispose();
      studio.dispose();
    };
  }, []);

  const outputs = stepWattCondenser({
    boilerPressurePsi: params.boilerPressurePsi,
    condenserTempC: params.condenserTempC,
    cylinderBoreInches: params.cylinderBoreInches,
    pistonStrokeFeet: params.pistonStrokeFeet,
    strokesPerMinute: params.strokesPerMinute,
    hasSeparateCondenser: (params.hasSeparateCondenser ?? 1) > 0.5,
    hasSteamJacket: (params.hasSteamJacket ?? 1) > 0.5,
  });

  const chips: KernelChip[] = [
    {
      label: "Indicated Power",
      value: `${outputs.indicatedHorsepower.toFixed(1)} hp`,
      unit: `${outputs.indicatedPowerKw.toFixed(1)} kW`,
      tone: "ok",
    },
    {
      label: "Condenser Vacuum",
      value: `${outputs.vacuumDepthInchesHg.toFixed(1)} inHg`,
      unit: `${outputs.condenserPressureAbsKpa.toFixed(1)} kPa`,
      tone: "ok",
    },
    {
      label: "Thermal Efficiency",
      value: `${outputs.thermalEfficiencyPct.toFixed(2)}%`,
      unit: "Rankine cycle",
      tone: "hot",
    },
    {
      label: "Coal Burn Rate",
      value: `${outputs.coalConsumptionKgPerHour.toFixed(1)} kg/h`,
      unit: `${outputs.specificFuelConsumptionKgPerKwh.toFixed(2)} kg/kWh`,
      tone: "warn",
    },
  ];

  return (
    <div className="relative flex-1 min-h-[380px] sm:min-h-[460px] w-full cursor-grab active:cursor-grabbing">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Preset Camera View Buttons */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
        {(
          [
            ["iso", "Overview"],
            ["cylinder", "Steam Jacket (B)"],
            ["condenser", "Condenser (E)"],
            ["beam", "Walking Beam (H)"],
            ["boiler", "Boiler (A)"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setActivePreset(id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
              activePreset === id
                ? "bg-amber-500 text-ink-950 font-bold"
                : "bg-ink-900/80 hover:bg-ink-800 text-parchment-200 border border-parchment-700/40 backdrop-blur-md"
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
          {cutaway ? "Cutaway ON" : "Cutaway OFF"}
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
