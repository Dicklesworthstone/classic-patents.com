"use client";

import { Camera, Eye, EyeOff, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  createThreeStudioScene,
  type StudioContext,
} from "@/components/patents/visuals/three/ThreeStudioScene";
import { useLiveSimParams } from "@/components/patents/visuals/three/useLiveSimParams";
import {
  DA_VINCI_INTERFACE_KERNEL_SOURCE,
  DA_VINCI_INTERFACE_SOURCE_BOUNDARY,
  readDaVinciInterfaceControls,
  resolveDaVinciInterfaceTopology,
} from "@/physics/daVinciInterfaceTopology";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { ClaimConstraintToggle } from "../ClaimConstraintToggle";
import { buildDaVinciInterfaceModel } from "./daVinciInterfaceModel";
import { StudioKernelChips, useResponsiveStudioHud } from "./StudioKernelChips";

const EXHIBIT_ID = "us-6331181-davinci";

type CameraPreset = "overview" | "processor" | "tool";

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: "Interface overview",
    pos: [5.4, 3.2, 7.2],
    target: [0, 0, 0],
  },
  processor: {
    label: "Processor boundary",
    pos: [-3.8, 1.8, 3.7],
    target: [-1.4, 0.2, 0],
  },
  tool: {
    label: "Tool-side memory",
    pos: [4.25, 1.8, 3.35],
    target: [1.2, 0.18, 0],
  },
};

function statusCopy(status: ReturnType<typeof resolveDaVinciInterfaceTopology>["status"]) {
  switch (status) {
    case "ready":
      return "Processor can identify, calibrate, and verify the loaded tool.";
    case "calibration-record-missing":
      return "Compatibility is present, but the measured calibration record is unavailable.";
    case "engagement-unconfirmed":
      return "The tool data path is present, but engagement has not been confirmed.";
    case "incompatible":
      return "No compatible-tool identifier is available to the processor.";
  }
}

export function DaVinciInterface3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const [showUiOverlay, setShowUiOverlay] = useResponsiveStudioHud(true);
  const [activeCamera, setActiveCamera] = useState<CameraPreset>("overview");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 17: true });
  const { params, updateParam, resetParams } = usePatentPhysics(EXHIBIT_ID);
  const topology = resolveDaVinciInterfaceTopology(readDaVinciInterfaceControls(params));
  const liveTopology = useLiveSimParams(topology);

  // US 6,331,181 discloses interface topology and data relations, not a
  // dimensioned manipulator, trajectory, contact material, force, or speed.
  // Publish that refusal rather than manufacturing SI telemetry.
  useFrankenSimPhysics(EXHIBIT_ID, {
    domain: "solid_mechanics",
    refusal: {
      isRefused: true,
      reason: DA_VINCI_INTERFACE_SOURCE_BOUNDARY,
    },
    machine: {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: 0,
      wheelSpeedMps: 0,
      modeLabel: `tool interface ${topology.status.replaceAll("-", " ")}`,
    },
  });

  const setCamera = (preset: CameraPreset) => {
    setActiveCamera(preset);
    const camera = CAMERA_PRESETS[preset];
    studioRef.current?.controls.setView(camera.pos, camera.target);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const overview = CAMERA_PRESETS.overview;
    const studio = createThreeStudioScene({
      container,
      cameraPos: overview.pos,
      targetPos: overview.target,
    });
    studioRef.current = studio;
    const model = buildDaVinciInterfaceModel();
    studio.scene.add(model.root);
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!studio.isVisible()) return;
      model.setTopologyState(liveTopology.current);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      model.dispose();
      studio.dispose();
      studioRef.current = null;
    };
  }, [liveTopology]);

  const controls = [
    {
      id: "compatibilitySignalPresent",
      label: "Compatibility identifier",
      active: topology.compatibilitySignalPresent,
      description: "Tool-side circuitry presents an identifier for processor comparison.",
    },
    {
      id: "calibrationRecordAvailable",
      label: "Measured calibration record",
      active: topology.calibrationRecordAvailable,
      description: "The tool carries measured nominal-to-actual offset information.",
    },
    {
      id: "engagementSignalPresent",
      label: "Engagement confirmation",
      active: topology.engagementSignalPresent,
      description: "The holder/tool interface reports that its engagement condition is present.",
    },
  ] as const;

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-parchment-300 bg-parchment-50/60 shadow-patent dark:border-ink-800 dark:bg-ink-950/80"
      data-testid="davinci-interface-three"
      data-interface-status={topology.status}
      data-compatibility-signal={String(topology.compatibilitySignalPresent)}
      data-calibration-record={String(topology.calibrationRecordAvailable)}
      data-engagement-signal={String(topology.engagementSignalPresent)}
      data-processor-can-configure={String(topology.processorCanConfigureTool)}
      data-kernel-source={DA_VINCI_INTERFACE_KERNEL_SOURCE}
      data-quantitative-mechanics="refused"
      data-connected-topology="processor-data-path-holder-engagement-tool"
    >
      <div className="sr-only">US 6,331,181 source-bounded tool interface topology</div>
      <div className="relative min-h-[380px] flex-1 cursor-grab active:cursor-grabbing sm:min-h-[460px]">
        <div ref={containerRef} className="absolute inset-0 h-full w-full" />

        <div className="pointer-events-none absolute left-3 top-3 max-w-[20rem] rounded-lg border border-cyan-500/30 bg-ink-950/85 p-3 text-[11px] text-parchment-100 shadow-lg backdrop-blur-sm">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">
            Claim-bound interface topology
          </p>
          <p className="mt-1 font-semibold text-parchment-50">{statusCopy(topology.status)}</p>
          <p className="mt-2 text-ink-300">
            Normalized relationship diagram only: no clinical scene, scale, trajectory, force, or
            speed is asserted.
          </p>
        </div>

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {(
            Object.entries(CAMERA_PRESETS) as [
              CameraPreset,
              (typeof CAMERA_PRESETS)[CameraPreset],
            ][]
          ).map(([preset, config]) => (
            <button
              key={preset}
              type="button"
              onClick={() => setCamera(preset)}
              className={`rounded-md border px-2 py-1 text-[10px] font-semibold transition-colors ${
                activeCamera === preset
                  ? "border-cyan-300 bg-cyan-500/20 text-cyan-100"
                  : "border-ink-600 bg-ink-900/85 text-ink-200 hover:border-cyan-500/70"
              }`}
            >
              <Camera className="mr-1 inline h-3 w-3" aria-hidden="true" />
              {config.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowUiOverlay((visible) => !visible)}
            className="rounded-md border border-ink-600 bg-ink-900/85 px-2 py-1 text-[10px] font-semibold text-ink-200 hover:border-cyan-500/70"
          >
            {showUiOverlay ? (
              <EyeOff className="mr-1 inline h-3 w-3" />
            ) : (
              <Eye className="mr-1 inline h-3 w-3" />
            )}
            HUD
          </button>
        </div>

        <StudioKernelChips
          visible={showUiOverlay}
          side="right"
          title="Source-bound interface status"
          chips={[
            {
              label: "Compatibility",
              value: topology.compatibilitySignalPresent ? "present" : "absent",
              tone: topology.compatibilitySignalPresent ? "ok" : "warn",
            },
            {
              label: "Calibration record",
              value: topology.calibrationRecordAvailable ? "available" : "missing",
              tone: topology.calibrationRecordAvailable ? "ok" : "warn",
            },
            {
              label: "Engagement",
              value: topology.engagementSignalPresent ? "confirmed" : "unconfirmed",
              tone: topology.engagementSignalPresent ? "ok" : "warn",
            },
            { label: "Quantitative mechanics", value: "withheld", tone: "warn" },
          ]}
        />
      </div>

      <div className="border-t border-parchment-300 bg-parchment-100/90 p-4 dark:border-ink-800 dark:bg-ink-900/90">
        <div className="grid gap-2 sm:grid-cols-3">
          {controls.map((control) => (
            <button
              key={control.id}
              type="button"
              aria-pressed={control.active}
              onClick={() => updateParam(control.id, control.active ? 0 : 1)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                control.active
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                  : "border-rose-500/50 bg-rose-500/10 text-rose-950 dark:text-rose-100"
              }`}
            >
              <span className="block text-xs font-semibold">{control.label}</span>
              <span className="mt-1 block text-[10px] leading-relaxed opacity-80">
                {control.description}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <ClaimConstraintToggle
            patentId={EXHIBIT_ID}
            claimStates={claimStates}
            onToggleClaim={(claimNo, active) =>
              setClaimStates((previous) => ({ ...previous, [claimNo]: active }))
            }
          />
          <button
            type="button"
            onClick={resetParams}
            className="rounded-md border border-parchment-400 px-2 py-1 text-[10px] font-semibold text-ink-600 hover:border-cyan-600 hover:text-cyan-700 dark:border-ink-700 dark:text-ink-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
          >
            <RotateCcw className="mr-1 inline h-3 w-3" aria-hidden="true" />
            Restore source topology
          </button>
        </div>
      </div>
    </section>
  );
}
