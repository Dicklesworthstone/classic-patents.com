"use client";

import { useEffect, useState } from "react";
import { createBaerOdysseyTransportUpdater, readBaerControls } from "@/physics/baerOdysseyKernel";
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
import { useLiveSimParams } from "./three/useLiveSimParams";

let nextRuntimeOwnerMount = 0;

function useRuntimeOwnerMount(): number {
  const [mount] = useState(() => {
    nextRuntimeOwnerMount += 1;
    return nextRuntimeOwnerMount;
  });
  return mount;
}

/** Stable nonvisual owner that survives 2D/3D face switches in the dispatcher. */
export function BaerOdysseyPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createBaerOdysseyTransportUpdater(() => readBaerControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId]);

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

/** Stable owner for the image-dissector raster and electron-optics state tape. */
export function FarnsworthTvPhysicsRuntimeOwner({ patentId }: { patentId: string }) {
  const mount = useRuntimeOwnerMount();
  const { effectiveParams } = usePatentPhysics(patentId);
  const liveParams = useLiveSimParams(effectiveParams);
  const { frame } = useFrankenSimPhysics(patentId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createFarnsworthTvTransportUpdater(() => readFarnsworthTvControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId]);
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
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
  }, [patentId]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createLamarrTransportUpdater(() => readLamarrRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createMarconiTransportUpdater(() => readMarconiRuntimeControls(liveParams.current)),
      "TS_FALLBACK",
    );
  }, [patentId]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: The registered bus updater must remain mounted while this layout-effect-synchronized ref receives the latest controls; depending on current values would reset its transport tape.
  useEffect(() => {
    return globalTransportBus.registerUpdater(
      patentId,
      createMetcalfeEthernetTransportUpdater(() => readEthernetControls(liveParams.current as any)),
      "TS_FALLBACK",
    );
  }, [patentId]);

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
