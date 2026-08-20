"use client";

import { useEffect, useRef, useState } from "react";
import { ARKWRIGHT_DEFAULT_CONTROLS, stepArkwrightWaterFrame } from "@/physics/arkwrightKernel";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { buildArkwrightWaterFrameModel } from "./arkwrightWaterFrameModel";
import { type KernelChip, StudioKernelChips } from "./StudioKernelChips";
import { createThreeStudioScene } from "./ThreeStudioScene";

const EXHIBIT_ID = "gb-931-arkwright-water-frame";

export function ArkwrightWaterFrame3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutaway, _setCutaway] = useState(false);
  const [showCallouts, setShowCallouts] = useState(true);
  const [activePreset, setActivePreset] = useState<"iso" | "drafting" | "flyer" | "cam" | "drum">(
    "iso",
  );

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
      cameraPos: [1.8, 1.4, 2.2],
      targetPos: [0, 0.7, 0],
      environmentStyle: "studio",
    });

    const model = buildArkwrightWaterFrameModel();
    studio.scene.add(model.root);

    let virtualTime = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const p = liveParams.current;

      const out = stepArkwrightWaterFrame({
        waterWheelRpm: p.waterWheelRpm,
        totalDraftRatio: p.totalDraftRatio,
        rollerClampingWeightKg: p.rollerClampingWeightKg,
        stapleLengthMm: p.stapleLengthMm,
        inputRovingCountNe: p.inputRovingCountNe,
      });

      const dtVirtual = 1 / 60;
      virtualTime += dtVirtual;

      const wheelRpm = p.waterWheelRpm ?? ARKWRIGHT_DEFAULT_CONTROLS.waterWheelRpm;
      const draftRatio = p.totalDraftRatio ?? ARKWRIGHT_DEFAULT_CONTROLS.totalDraftRatio;

      // Kinematic rotations
      model.wheelGroup.rotation.x = (virtualTime * (wheelRpm * 2 * Math.PI)) / 60;
      model.shaftGroup.rotation.z = (virtualTime * (wheelRpm * 2 * Math.PI)) / 60;

      // Rollers
      model.feedRollersGroup.rotation.x =
        (virtualTime * (((wheelRpm * 0.75) / 4.0) * 2 * Math.PI)) / 60;
      model.deliveryRollersGroup.rotation.x =
        (virtualTime * (((wheelRpm * 0.75 * draftRatio) / 4.0) * 2 * Math.PI)) / 60;

      // Flyers & Bobbins
      const flyerAngle = (virtualTime * (out.flyerSpindleRpm * 2 * Math.PI)) / 60;
      for (const f of model.flyerGroups) {
        f.rotation.y = flyerAngle;
      }

      const bobbinAngle = (virtualTime * (out.bobbinRpm * 2 * Math.PI)) / 60;
      for (const b of model.bobbinGroups) {
        b.rotation.y = bobbinAngle;
      }

      // Heart-cam & traverse rail lift
      const traversePhase = (virtualTime * out.traverseFreqHz * 2 * Math.PI) % (2 * Math.PI);
      const traverseOffset = Math.sin(traversePhase) * 0.04;
      model.traverseRailGroup.position.y = 0.52 + traverseOffset;
      model.camGroup.rotation.z = traversePhase;

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

  const outputs = stepArkwrightWaterFrame({
    waterWheelRpm: params.waterWheelRpm,
    totalDraftRatio: params.totalDraftRatio,
    rollerClampingWeightKg: params.rollerClampingWeightKg,
    stapleLengthMm: params.stapleLengthMm,
    inputRovingCountNe: params.inputRovingCountNe,
  });

  const chips: KernelChip[] = [
    {
      label: "Flyer Spindle",
      value: `${Math.round(outputs.flyerSpindleRpm).toLocaleString()} RPM`,
      unit: `${outputs.spindleOmegaRadPerSec.toFixed(0)} rad/s`,
      tone: "ok",
    },
    {
      label: "Yarn Count",
      value: `${outputs.outputYarnCountNe.toFixed(1)} Ne`,
      unit: `${outputs.yarnLinearDensityTex.toFixed(1)} Tex`,
      tone: "ok",
    },
    {
      label: "Imparted Twist",
      value: `${Math.round(outputs.twistTurnsPerMeter).toLocaleString()} TPM`,
      unit: `${outputs.twistTurnsPerInch.toFixed(1)} TPI`,
      tone: "ok",
    },
    {
      label: "Yarn Tenacity",
      value: `${outputs.yarnBreakingForceN.toFixed(2)} N`,
      unit: outputs.isWarpGradeWaterTwist ? "Warp-Grade" : "Weft-Only",
      tone: outputs.isWarpGradeWaterTwist ? "ok" : "warn",
    },
    {
      label: "Fiber Parallel",
      value: `${outputs.fiberParallelizationPct.toFixed(1)}%`,
      unit: "Slip-Free",
      tone: "ok",
    },
    {
      label: "Cromford Output",
      value: `${outputs.millProductionKgPerDay.toFixed(1)} kg/d`,
      unit: "96 Spindles",
      tone: "ok",
    },
  ];

  const presets = [
    { id: "iso", label: "Full Frame", pos: [1.8, 1.4, 2.2], target: [0, 0.7, 0] },
    { id: "drafting", label: "Draft Rollers (C)", pos: [0, 1.15, 0.45], target: [0, 0.88, 0] },
    {
      id: "flyer",
      label: "Spindle & Flyer (E)",
      pos: [-0.36, 0.85, 0.55],
      target: [-0.36, 0.65, 0.06],
    },
    { id: "cam", label: "Heart-Cam (G)", pos: [0.75, 0.65, 0.4], target: [0.55, 0.52, 0] },
    { id: "drum", label: "Driving Drum (A)", pos: [0.65, 0.45, 0.6], target: [0.35, 0.22, 0] },
  ] as const;

  return (
    <div className="relative w-full h-[580px] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
      {/* 3D Canvas Viewport */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating HUD Camera Presets & Toggles */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-800">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => {
              setActivePreset(preset.id);
            }}
            className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
              activePreset === preset.id
                ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {preset.label}
          </button>
        ))}

        <div className="h-4 w-px bg-stone-700 mx-1" />

        <button
          type="button"
          onClick={() => setShowCallouts((prev) => !prev)}
          className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-all ${
            showCallouts ? "bg-stone-700 text-stone-100" : "text-stone-500 hover:text-stone-300"
          }`}
        >
          Callouts
        </button>
      </div>

      {/* Live SI Kernel Telemetry Chips */}
      <StudioKernelChips visible={true} chips={chips} title="SI Telemetry" />
    </div>
  );
}
