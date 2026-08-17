"use client";

import { useEffect, useRef, useState } from "react";
import { FrankenSimEngine } from "./engine";
import type { UniversalPatentPhysicsTelemetry } from "./types";

export function useFrankenSimPhysics(
  patentId: string,
  initialTelemetry: Partial<UniversalPatentPhysicsTelemetry>,
) {
  const [telemetry, setTelemetry] = useState<UniversalPatentPhysicsTelemetry>(() =>
    FrankenSimEngine.createTelemetryEnvelope(patentId, initialTelemetry),
  );

  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;

  const updateTelemetry = (updater: (prev: UniversalPatentPhysicsTelemetry) => Partial<UniversalPatentPhysicsTelemetry>) => {
    setTelemetry((prev) => ({
      ...prev,
      ...updater(prev),
      timestampMs: Date.now(),
    }));
  };

  return {
    telemetry,
    telemetryRef,
    updateTelemetry,
  };
}
