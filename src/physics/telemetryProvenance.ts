/**
 * telemetryProvenance.ts
 *
 * Strongly-typed runtime provenance classification and validation for
 * Classic Patents SI telemetry metrics, controls, and governing equations.
 */

import type { MetricProvenanceClassification } from "./telemetryData";

export interface FormattedProvenanceLabel {
  key: MetricProvenanceClassification;
  shortLabel: string;
  badgeClass: string;
  description: string;
}

export const PROVENANCE_LABELS: Record<MetricProvenanceClassification, FormattedProvenanceLabel> = {
  "source-disclosed": {
    key: "source-disclosed",
    shortLabel: "Source",
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
    description:
      "Explicitly documented or directly claimed in the primary historical patent specification.",
  },
  "scenario-modern": {
    key: "scenario-modern",
    shortLabel: "Modern Model",
    badgeClass:
      "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-800",
    description:
      "Evaluated using genuine modern physical laws and engineering parameters (SI units).",
  },
  "scenario-reader": {
    key: "scenario-reader",
    shortLabel: "Reader Scenario",
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800",
    description: "User-adjusted interactive simulation parameters within valid physical ranges.",
  },
  "topology-normalized": {
    key: "topology-normalized",
    shortLabel: "Normalized",
    badgeClass:
      "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800",
    description:
      "Unitless normalized kinematic or topological coordinates [0, 1] preserving relative motion.",
  },
  "refusal-bounded": {
    key: "refusal-bounded",
    shortLabel: "Source Refusal",
    badgeClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800",
    description:
      "Quantitative value intentionally omitted because the primary source gives qualitative topology only.",
  },
};

export function getProvenanceLabel(
  provenance: MetricProvenanceClassification = "scenario-modern",
): FormattedProvenanceLabel {
  return PROVENANCE_LABELS[provenance] ?? PROVENANCE_LABELS["scenario-modern"];
}
