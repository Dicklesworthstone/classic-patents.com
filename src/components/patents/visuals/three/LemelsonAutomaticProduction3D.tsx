"use client";

import { RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ClaimConstraintToggle } from "@/components/patents/visuals/ClaimConstraintToggle";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  readLemelsonAutomaticProductionControls,
  stepLemelsonAutomaticProductionTopology,
} from "@/physics/lemelsonAutomaticProductionKernel";
import { useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  buildLemelsonAutomaticProductionModel,
  type LemelsonAutomaticProductionModel,
} from "./lemelsonAutomaticProductionModel";
import { createThreeStudioScene, type StudioContext } from "./ThreeStudioScene";
import { useLiveSimParams } from "./useLiveSimParams";

const PATENT_ID = "us-3313014-lemelson-automatic-production";
const VIEWS = {
  overview: {
    position: [6.8, 4.8, 7.8] as [number, number, number],
    target: [0, 1.15, 0.62] as [number, number, number],
  },
  carrier: {
    position: [3.5, 3.1, -4.2] as [number, number, number],
    target: [0, 1.3, 0] as [number, number, number],
  },
  station: {
    position: [4.8, 2.25, 4.6] as [number, number, number],
    target: [0, 0.8, 0.72] as [number, number, number],
  },
} as const;

export function LemelsonAutomaticProduction3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const studioRef = useRef<StudioContext | null>(null);
  const modelRef = useRef<LemelsonAutomaticProductionModel | null>(null);
  const [view, setView] = useState<keyof typeof VIEWS>("overview");
  const [claimStates, setClaimStates] = useState<Record<number, boolean>>({ 1: true, 7: true });
  const { params, updateParam, resetParams } = usePatentPhysics(PATENT_ID);
  const controls = useMemo(() => readLemelsonAutomaticProductionControls(params), [params]);
  const state = useMemo(() => stepLemelsonAutomaticProductionTopology(controls), [controls]);
  const liveState = useLiveSimParams(state);

  useFrankenSimPhysics(PATENT_ID, {
    domain: "solid_mechanics",
    refusal: { isRefused: true, reason: state.sourceBoundary.reason },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: The mounted render loop reads this stable, layout-effect-synchronized ref; depending on its current value would rebuild the Three.js scene.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const studio = createThreeStudioScene({
      container,
      cameraPos: VIEWS.overview.position,
      targetPos: VIEWS.overview.target,
      environmentStyle: "studio",
      enableClouds: false,
      enableFloorGrid: true,
      ambientIntensity: 2.15,
      sunIntensity: 2.55,
      cameraMinDistance: 2.2,
      cameraMaxDistance: 15,
    });
    studioRef.current = studio;
    const model = buildLemelsonAutomaticProductionModel();
    modelRef.current = model;
    studio.scene.add(model.root);
    model.update(liveState.current);

    let frame = 0;
    let destroyed = false;
    const render = () => {
      if (destroyed) return;
      frame = requestAnimationFrame(render);
      if (!studio.isVisible()) return;
      model.update(liveState.current);
      studio.controls.update();
      studio.renderer.render(studio.scene, studio.camera);
    };
    frame = requestAnimationFrame(render);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      studio.scene.remove(model.root);
      model.dispose();
      studio.cleanup();
      modelRef.current = null;
      studioRef.current = null;
    };
  }, []);

  const selectView = (next: keyof typeof VIEWS) => {
    setView(next);
    const camera = VIEWS[next];
    studioRef.current?.controls.setView(camera.position, camera.target);
  };
  const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID] ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-border/40 bg-card/60 p-4 backdrop-blur">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/30 pb-3">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-primary">
            US 3,313,014 · PROCEDURAL 3D SOURCE TOPOLOGY
          </p>
          <h3 className="mt-1 text-base font-semibold text-foreground">
            Portable programme meets a fixed work station
          </h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            The carrier remains physically connected to its overhead carriage, vertical column,
            platform, work fixture, and station interface. Colored state travels from marker to
            lock, coupling, operation, and release; it never pretends that an undisclosed motor or
            conveyor was numerically simulated.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border/50 bg-background/50 p-1">
          {(Object.keys(VIEWS) as Array<keyof typeof VIEWS>).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectView(name)}
              className={`rounded px-2 py-1 text-xs capitalize ${
                view === name
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
        <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-border/30 bg-slate-950">
          <div ref={containerRef} className="absolute inset-0" />
          <div className="pointer-events-none absolute bottom-3 left-3 max-w-sm rounded bg-black/70 px-3 py-2 font-mono text-[10px] leading-relaxed text-white backdrop-blur">
            {state.commandChain} · {state.phase} · {state.activeClaimProbe}
          </div>
        </div>

        <div className="space-y-3">
          <PhysicsTelemetryBadge patentId={PATENT_ID} equations={equations} />
          <div className="space-y-3 rounded-lg border border-border/30 bg-muted/20 p-3">
            <FractionControl
              label="Carrier address"
              value={controls.carrierAddressFraction}
              onChange={(value) => updateParam("carrierAddressFraction", value)}
            />
            <FractionControl
              label="Mz lift pose"
              value={controls.liftFraction}
              onChange={(value) => updateParam("liftFraction", value)}
            />
            <FractionControl
              label="My platform reach"
              value={controls.reachFraction}
              onChange={(value) => updateParam("reachFraction", value)}
            />
            <FractionControl
              label="Ordered cycle"
              value={controls.cycleProgress}
              onChange={(value) => updateParam("cycleProgress", value)}
            />
            <SwitchControl
              label="Marker sensed"
              checked={controls.stationDetected >= 0.5}
              onChange={(value) => updateParam("stationDetected", value ? 1 : 0)}
            />
            <SwitchControl
              label="Station contacts coupled"
              checked={controls.stationCoupled >= 0.5}
              onChange={(value) => updateParam("stationCoupled", value ? 1 : 0)}
            />
            <button
              type="button"
              onClick={resetParams}
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset source exhibit
            </button>
          </div>
        </div>
      </div>

      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
        <strong>Quantitative refusal:</strong> {state.sourceBoundary.reason}
      </p>

      <div className="rounded-lg border border-border/60 bg-card/60 p-3">
        <ClaimConstraintToggle
          patentId={PATENT_ID}
          claimStates={claimStates}
          onClaimStateChange={(num, active) =>
            setClaimStates((prev) => ({ ...prev, [num]: active }))
          }
        />
      </div>
    </section>
  );
}

function FractionControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-[11px]">
      <span className="mb-1 flex justify-between gap-2">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-primary">{(value * 100).toFixed(0)}% display</span>
      </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-border accent-primary"
      />
    </label>
  );
}

function SwitchControl({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-[11px]">
      <span className="text-foreground">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}
