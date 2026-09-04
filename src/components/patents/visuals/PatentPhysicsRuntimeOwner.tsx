"use client";

import { useEffect, useState } from "react";
import {
  ARKWRIGHT_FRANKENSIM_BOUNDARY,
  ARKWRIGHT_KERNEL_SOURCE,
  ARKWRIGHT_SOURCE_BOUNDARY,
  createArkwrightTransportUpdater,
  getArkwrightTapeFrame,
  readArkwrightRuntimeControls,
} from "@/physics/arkwrightKernel";
import { createBaerOdysseyTransportUpdater, readBaerControls } from "@/physics/baerOdysseyKernel";
import {
  createBoyleSmithCcdTransportUpdater,
  getBoyleSmithCcdTapeFrame,
  readBoyleSmithCcdSourceControls,
} from "@/physics/boyleSmithCcdKernel";
import {
  CORT_FRANKENSIM_BOUNDARY,
  CORT_KERNEL_SOURCE,
  CORT_SOURCE_BOUNDARY,
  createCortTransportUpdater,
  getCortTapeFrame,
  readCortRuntimeControls,
} from "@/physics/cortKernel";
import {
  createEInkTransportUpdater,
  getEInkTapeFrame,
  readEInkRuntimeControls,
} from "@/physics/eInkSharedKernel";
import {
  createFarnsworthTvTransportUpdater,
  getFarnsworthTvTapeFrame,
  readFarnsworthTvControls,
} from "@/physics/farnsworthTvKernel";
import {
  createHopkinsTransportUpdater,
  getHopkinsTapeFrame,
  HOPKINS_FRANKENSIM_BOUNDARY,
  HOPKINS_KERNEL_SOURCE,
  HOPKINS_SOURCE_BOUNDARY,
  readHopkinsRuntimeControls,
} from "@/physics/hopkinsPotashKernel";
import {
  createKamenInjectionTransportUpdater,
  getKamenInjectionTapeFrame,
  readKamenInjectionControls,
} from "@/physics/kamenInjectionKernel";
import {
  createLamarrTransportUpdater,
  getLamarrTapeFrame,
  readLamarrRuntimeControls,
} from "@/physics/lamarrSharedKernel";
import {
  createMarconiTransportUpdater,
  getMarconiTapeFrame,
  readMarconiRuntimeControls,
} from "@/physics/marconiSharedKernel";
import {
  createMetcalfeEthernetTransportUpdater,
  readEthernetControls,
} from "@/physics/metcalfeEthernetKernel";
import { globalTransportBus, useFrankenSimPhysics } from "@/physics/useFrankenSimPhysics";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import {
  createWattRotaryTransportUpdater,
  getWattRotaryTapeFrame,
  readWattRotaryRuntimeControls,
  WATT_ROTARY_FRANKENSIM_BOUNDARY,
  WATT_ROTARY_KERNEL_SOURCE,
  WATT_ROTARY_SOURCE_BOUNDARY,
} from "@/physics/wattRotaryKernel";
import { useLiveSimParams } from "./three/useLiveSimParams";

let nextRuntimeOwnerMount = 0;

function useRuntimeOwnerMount(): number {
  const [mount] = useState(() => {
    nextRuntimeOwnerMount += 1;
    return nextRuntimeOwnerMount;
  });
  return mount;
}

/** Stable owner for the prescribed water-frame transmission coordinates. */
export function ArkwrightPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId, {
    domain: "continuum_elasticity",
    refusal: { isRefused: true, reason: ARKWRIGHT_SOURCE_BOUNDARY },
  });

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createArkwrightTransportUpdater(() => readArkwrightRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getArkwrightTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-runtime-provenance={frame.provenance}
      data-arkwright-kernel-source={ARKWRIGHT_KERNEL_SOURCE}
      data-arkwright-frankensim-boundary={ARKWRIGHT_FRANKENSIM_BOUNDARY}
      data-arkwright-running={tape?.controls.isRunning ?? ""}
      data-arkwright-total-draft-ratio={tape?.outputs.totalDraftRatio ?? ""}
      data-arkwright-time-sec={tape?.timeSec ?? ""}
      data-arkwright-wheel-phase-rad={tape?.phases.wheelRad ?? ""}
      data-arkwright-feed-phase-rad={tape?.phases.feedRollerRad ?? ""}
      data-arkwright-intermediate-one-phase-rad={tape?.phases.intermediateRollerOneRad ?? ""}
      data-arkwright-intermediate-two-phase-rad={tape?.phases.intermediateRollerTwoRad ?? ""}
      data-arkwright-delivery-phase-rad={tape?.phases.deliveryRollerRad ?? ""}
      data-arkwright-spindle-layshaft-phase-rad={tape?.phases.spindleLayshaftRad ?? ""}
      data-arkwright-spindle-phase-rad={tape?.phases.spindleRad ?? ""}
      data-arkwright-bobbin-phase-rad={tape?.phases.bobbinRad ?? ""}
      data-arkwright-traverse-phase-rad={tape?.phases.traverseRad ?? ""}
    />
  );
}

/** Stable owner for Watt's closed linkage and constrained external-gear mesh. */
export function WattRotaryPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId, {
    domain: "thermo_fluid",
    refusal: { isRefused: true, reason: WATT_ROTARY_SOURCE_BOUNDARY },
  });

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createWattRotaryTransportUpdater(() => readWattRotaryRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getWattRotaryTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-runtime-provenance={frame.provenance}
      data-watt-kernel-source={WATT_ROTARY_KERNEL_SOURCE}
      data-watt-frankensim-boundary={WATT_ROTARY_FRANKENSIM_BOUNDARY}
      data-watt-running={tape?.controls.isRunning ?? ""}
      data-watt-time-sec={tape?.timeSec ?? ""}
      data-watt-carrier-angle-rad={tape?.telemetry.planetOrbitAngleRad ?? ""}
      data-watt-rod-angle-rad={tape?.telemetry.connectingRodAngleRad ?? ""}
      data-watt-planet-angle-rad={tape?.telemetry.planetBodyAngleRad ?? ""}
      data-watt-sun-angle-rad={tape?.telemetry.sunShaftAngleRad ?? ""}
      data-watt-mesh-residual-rad={tape?.telemetry.gearMeshConstraintResidualRad ?? ""}
      data-watt-rod-residual-m={tape?.telemetry.connectingRodConstraintResidualM ?? ""}
      data-watt-sun-teeth={tape?.telemetry.sunTeeth ?? ""}
      data-watt-planet-teeth={tape?.telemetry.planetTeeth ?? ""}
    />
  );
}

/** Stable owner for Cort's declared furnace/roll teaching coordinates. */
export function CortPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId, {
    domain: "thermodynamics_transport",
    refusal: { isRefused: true, reason: CORT_SOURCE_BOUNDARY },
  });

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createCortTransportUpdater(() => readCortRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getCortTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-runtime-provenance={frame.provenance}
      data-cort-kernel-source={CORT_KERNEL_SOURCE}
      data-cort-frankensim-boundary={CORT_FRANKENSIM_BOUNDARY}
      data-cort-running={tape?.controls.isRunning ?? ""}
      data-cort-time-sec={tape?.timeSec ?? ""}
      data-cort-top-roll-phase-rad={tape?.phases.topRollRad ?? ""}
      data-cort-bottom-roll-phase-rad={tape?.phases.bottomRollRad ?? ""}
      data-cort-rabble-phase-rad={tape?.phases.rabbleCycleRad ?? ""}
      data-cort-billet-travel-m={tape?.phases.billetTravelM ?? ""}
      data-cort-working-roll-radius-mm={tape?.outputs.workingRollRadiusMm ?? ""}
      data-cort-roll-nip-gap-mm={tape?.outputs.rollNipGapMm ?? ""}
      data-cort-billet-height-mm={tape?.outputs.billetEntryHeightMm ?? ""}
      data-cort-nip-interference-mm={tape?.outputs.nipInterferenceMm ?? ""}
    />
  );
}

/** Stable owner for Hopkins's source-bounded five-operation process reader. */
export function HopkinsPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId, {
    domain: "thermodynamics_transport",
    refusal: { isRefused: true, reason: HOPKINS_SOURCE_BOUNDARY },
  });

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createHopkinsTransportUpdater(() => readHopkinsRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getHopkinsTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-runtime-provenance={frame.provenance}
      data-hopkins-kernel-source={HOPKINS_KERNEL_SOURCE}
      data-hopkins-frankensim-boundary={HOPKINS_FRANKENSIM_BOUNDARY}
      data-hopkins-running={tape?.controls.isRunning ?? ""}
      data-hopkins-time-sec={tape?.timeSec ?? ""}
      data-hopkins-process-cycle={tape?.phases.processCycle01 ?? ""}
      data-hopkins-flame-phase-rad={tape?.phases.flamePhaseRad ?? ""}
      data-hopkins-boil-phase-rad={tape?.phases.boilPhaseRad ?? ""}
    />
  );
}

/** Stable nonvisual owner that survives 2D/3D face switches in the dispatcher. */
export function BaerOdysseyPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createBaerOdysseyTransportUpdater(() => readBaerControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-ball-x={frame.telemetry.video?.ballX ?? ""}
      data-ball-y={frame.telemetry.video?.ballY ?? ""}
    />
  );
}

/** Stable owner for the source-bounded Figure 2/3 three-phase transfer tape. */
export function BoyleSmithCcdPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createBoyleSmithCcdTransportUpdater(() =>
        readBoyleSmithCcdSourceControls(liveParams.current),
      ),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getBoyleSmithCcdTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-active-phase={tape?.metrics.activePhase ?? ""}
      data-packet-coordinate={tape?.state.packetCoordinateGates ?? ""}
      data-transfer-allowed={tape?.metrics.packetMotionAllowed ?? ""}
    />
  );
}

/** Stable owner for the source-described screw, switch, counter, and timer sequence. */
export function KamenInjectionPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createKamenInjectionTransportUpdater(() => readKamenInjectionControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = getKamenInjectionTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-source-phase={tape?.metrics.phase ?? ""}
      data-motor-rotor-turns={tape?.state.motorRotorTurns ?? ""}
      data-lead-screw-turns={tape?.state.leadScrewTurns ?? ""}
      data-cycle-pulse-count={tape?.metrics.cyclePulseCount ?? ""}
      data-follower-position={tape?.metrics.followerPositionNormalized ?? ""}
      data-clutch-engaged={tape?.metrics.clutchEngaged ?? ""}
    />
  );
}

/** Stable owner for the image-dissector raster and electron-optics state tape. */
export function FarnsworthTvPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createFarnsworthTvTransportUpdater(() => readFarnsworthTvControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);
  const running = getFarnsworthTvTapeFrame()?.controls.running;

  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-running={running === undefined ? "" : String(running)}
      data-raster-line={frame.telemetry.raster?.rasterLineIndex ?? ""}
      data-raster-x={frame.telemetry.raster?.rasterXPercent ?? ""}
      data-raster-y={frame.telemetry.raster?.rasterYPercent ?? ""}
      data-raster-retrace={frame.telemetry.raster?.inHorizontalRetrace ?? ""}
    />
  );
}

/** Stable owner for E Ink particle drift and optical state across face switches. */
export function EInkPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createEInkTransportUpdater(() =>
        readEInkRuntimeControls({
          ...(liveParams.current as any),
          running: (liveParams.current.isRunning ?? 1) > 0,
        }),
      ),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const tape = frame.telemetry.em;
  const running = getEInkTapeFrame()?.controls.running;
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-running={running === undefined ? "" : String(running)}
      data-electric-field-vpm={tape?.electricFieldVpm ?? ""}
      data-electrode-voltage={tape?.voltageVolts ?? ""}
    />
  );
}

/** Stable owner for the two indexed Lamarr/Antheil record mechanisms. */
export function LamarrPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createLamarrTransportUpdater(() => readLamarrRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const state = getLamarrTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-record-position={state?.recordPosition ?? ""}
      data-transmitter-row={state?.transmitterRow ?? ""}
      data-receiver-row={state?.receiverRow ?? ""}
      data-command-tone={state?.commandTone ?? ""}
    />
  );
}

/** Stable owner for the user-fired transmitter-to-coherer/reset sequence. */
export function MarconiPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createMarconiTransportUpdater(() => readMarconiRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  const state = getMarconiTapeFrame();
  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-pulse-sequence={state?.controls.sparkPulseSequence ?? ""}
      data-receiver-stage={state?.receiverStage ?? ""}
      data-receiver-conducting={state?.receiverConducting ?? ""}
      data-relay-active={state?.relayActive ?? ""}
      data-reset-active={state?.resetActive ?? ""}
    />
  );
}

/** Stable nonvisual owner that survives 2D/3D face switches in the dispatcher. */
export function MetcalfeEthernetPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // The registered bus updater remains mounted while this layout-effect-synchronized ref receives the latest controls.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createMetcalfeEthernetTransportUpdater(() => readEthernetControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId, liveParams]);

  return (
    <span
      hidden
      data-testid="patent-physics-runtime-owner"
      data-patent-id={patentId}
      data-runtime-tick={frame.tick}
      data-runtime-owner-mount={mount}
      data-runtime-digest={frame.digest}
      data-rng-seed={frame.telemetry.network?.rngSeed ?? ""}
      data-rng-counter={frame.telemetry.network?.rngCounter ?? ""}
      data-collision-count={frame.telemetry.network?.totalCollisionCount ?? ""}
      data-last-collision-time={frame.telemetry.network?.lastCollisionTimeSec ?? ""}
      data-station-1-backoff={frame.telemetry.network?.station1BackoffRemainingSec ?? ""}
      data-station-2-backoff={frame.telemetry.network?.station2BackoffRemainingSec ?? ""}
      data-station-1-jam={frame.telemetry.network?.station1JamRemainingSec ?? ""}
      data-station-2-jam={frame.telemetry.network?.station2JamRemainingSec ?? ""}
      data-station-1-state={frame.telemetry.network?.station1State ?? ""}
      data-station-2-state={frame.telemetry.network?.station2State ?? ""}
    />
  );
}
