/**
 * manifest.ts
 *
 * Data-driven scenario manifest for the Classic Patents vertical-slice E2E test harness.
 * Dynamically registers every patent in the catalogue and maps its required faces,
 * controls, telemetry expectations, claim probes, figures, and publication boundaries.
 */

import { allPatents } from "@/data/patents";
import { CATALOG_CLAIM_CONSTRAINTS } from "@/physics/claimConstraints";
import { ENERGY_CHANNEL_OMISSION_REASONS } from "@/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import type { PatentE2EScenario } from "./types";

export function buildPatentE2EScenario(patentId: string): PatentE2EScenario {
  const patent = allPatents.find((p) => p.id === patentId);
  if (!patent) {
    throw new Error(`Patent ID "${patentId}" not found in allPatents catalogue.`);
  }

  const physics = PATENT_PHYSICS_REGISTRY[patentId];
  const claimConstraints = CATALOG_CLAIM_CONSTRAINTS[patentId] ?? [];
  const energyOmission =
    ENERGY_CHANNEL_OMISSION_REASONS[patentId as keyof typeof ENERGY_CHANNEL_OMISSION_REASONS];

  const primaryControls = (physics?.controls ?? []).slice(0, 2).map((ctrl) => ({
    id: ctrl.id,
    label: ctrl.label,
    testValue: ctrl.defaultValue !== undefined ? ctrl.defaultValue : (ctrl.min + ctrl.max) / 2,
  }));

  const sampleMetrics = physics?.computeMetrics ? physics.computeMetrics({}) : [];
  const expectedTelemetryLabels = sampleMetrics.map((m) => m.label);

  const isArchivalPublished = Boolean(
    patent.archivalEdition && patent.originalTextAsset?.kind === "reviewed-transcription",
  );

  return {
    patentId: patent.id,
    patentNumber: patent.patentNumber,
    title: patent.title,
    isArchivalPublished,
    hasFigures: (patent.drawings?.length ?? 0) > 0,
    figureCount: patent.drawings?.length ?? 0,
    claimCount: patent.claims?.length ?? 0,
    supports3D: true,
    supports2D: true,
    primaryControls,
    expectedTelemetryLabels,
    hasEnergyOmission: Boolean(energyOmission),
    energyOmissionReason: energyOmission,
    claimProbeNumbers: claimConstraints.map((c) => c.claimNumber),
  };
}

export function getAllE2EScenarios(): PatentE2EScenario[] {
  return allPatents.map((p) => buildPatentE2EScenario(p.id));
}

export const E2E_SCENARIOS_MAP: Readonly<Record<string, PatentE2EScenario>> = Object.fromEntries(
  allPatents.map((p) => [p.id, buildPatentE2EScenario(p.id)]),
);
