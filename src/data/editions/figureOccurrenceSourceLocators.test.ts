import { describe, expect, test } from "bun:test";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import {
  FIGURE_OCCURRENCE_SOURCE_LOCATORS,
  type FigureOccurrenceKey,
  type FigureOccurrenceSourceLocator,
  figureOccurrenceKey,
  normalizeSourceRectangle,
  validateFigureOccurrenceSourceLocators,
} from "./figureOccurrenceSourceLocators";

const PASTEUR_ID = "us-135245-pasteur-fermentation";
const PASTEUR_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PASTEUR_ID].assets);
const PASTEUR_OCCURRENCES = {
  "edition-block-6-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
  "edition-block-9-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
  "edition-block-12-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-2-v3.png",
} as const;
const CLAVEL_DELTA_ROBOT_ID = "us-4976582-clavel-delta-robot";
const CLAVEL_DELTA_ROBOT_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[CLAVEL_DELTA_ROBOT_ID].assets,
);
const CLAVEL_DELTA_ROBOT_OCCURRENCES = {
  "edition-block-24-group-0-inline-0":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-24-group-0-inline-2":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-24-group-0-inline-4":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-24-group-0-inline-6":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-24-group-0-inline-8":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
  "edition-block-26-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-27-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-28-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-28-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-30-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-30-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-31-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-32-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
  "edition-block-32-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-33-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
} as const;
const COLT_ID = "us-x9430-colt-revolver";
const COLT_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[COLT_ID].assets);
const COLT_REVOLVER_OCCURRENCES = {
  "edition-block-1-group-0-inline-1":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-7-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png",
  "edition-block-7-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-7-group-0-inline-4":
    "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png",
  "edition-block-7-group-0-inline-6":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-7-group-0-inline-8":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-7-group-0-inline-10":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-7-group-0-inline-12":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-7-group-0-inline-14":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-7-group-0-inline-16":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-7-group-0-inline-18":
    "/patents/figures/us-x9430-colt-revolver/division-5-combination-source-crop-v2.png",
  "edition-block-8-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-8-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-9-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-10-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-10-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-11-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-11-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-4":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-6":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-8":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-10":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-12":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-14":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-16":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-12-group-0-inline-18":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-13-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-4":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-6":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-8":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-10":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-12":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-14":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-16":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-18":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-13-group-0-inline-20":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-14-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-15-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-15-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-15-group-0-inline-4":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-15-group-0-inline-6":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-15-group-0-inline-8":
    "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
  "edition-block-15-group-0-inline-10":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-15-group-0-inline-12":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-16-group-0-inline-1":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-16-group-0-inline-3":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
  "edition-block-16-group-0-inline-5":
    "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
  "edition-block-17-group-0-inline-1":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-0":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-2":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-4":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-6":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-8":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-10":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-12":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-14":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-20-group-0-inline-16":
    "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
  "edition-block-21-group-0-inline-1":
    "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
} as const;

const SIKORSKY_ID = "us-2318259-sikorsky-helicopter";
const SIKORSKY_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[SIKORSKY_ID].assets);
const SIKORSKY_OCCURRENCES = {
  "edition-block-11-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
  "edition-block-12-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
  "edition-block-13-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-2-source-crop-v1.png",
  "edition-block-14-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-3-source-crop-v1.png",
  "edition-block-15-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
  "edition-block-16-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
  "edition-block-17-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
  "edition-block-18-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-5-source-crop-v1.png",
  "edition-block-19-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-6-source-crop-v1.png",
  "edition-block-20-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-6-source-crop-v1.png",
  "edition-block-21-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-7-source-crop-v1.png",
  "edition-block-22-group-0-inline-0":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-7-source-crop-v1.png",
  "edition-block-23-group-0-inline-1":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
  "edition-block-30-group-0-inline-1":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
  "edition-block-30-group-0-inline-3":
    "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
} as const;

const METCALFE_ID = "us-4063220-metcalfe-ethernet";
const METCALFE_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[METCALFE_ID].assets);
const METCALFE_OCCURRENCES = {
  "edition-block-9-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-10-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-10-group-0-inline-2":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-11-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
  "edition-block-11-group-0-inline-2":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-12-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-4-source-crop-v1.png",
  "edition-block-12-group-0-inline-2":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
  "edition-block-13-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-5-source-crop-v1.png",
  "edition-block-13-group-0-inline-2":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-14-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-14-group-0-inline-2":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-15-group-0-inline-0":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-19-group-0-inline-1":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-21-group-0-inline-1":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-1":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-3":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-23-group-0-inline-5":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-7":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
  "edition-block-23-group-0-inline-9":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-11":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-13":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
  "edition-block-23-group-0-inline-15":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
  "edition-block-23-group-0-inline-17":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
  "edition-block-23-group-0-inline-19":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-4-source-crop-v1.png",
  "edition-block-25-group-0-inline-1":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-5-source-crop-v1.png",
  "edition-block-25-group-0-inline-3":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-25-group-0-inline-5":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-25-group-0-inline-7":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-25-group-0-inline-9":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-25-group-0-inline-11":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-27-group-0-inline-1":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
  "edition-block-27-group-0-inline-3":
    "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
} as const;

const KAMEN_MEDICATION_INJECTION_ID = "us-3858581-kamen-medication-injection-device";
const KAMEN_MEDICATION_INJECTION_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[KAMEN_MEDICATION_INJECTION_ID].assets,
);
const KAMEN_MEDICATION_INJECTION_OCCURRENCES = {
  "edition-block-3-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
  "edition-block-3-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
  "edition-block-3-group-0-inline-5":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-4-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png",
  "edition-block-4-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png",
  "edition-block-4-group-0-inline-5":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-12-group-0-inline-0":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
  "edition-block-12-group-0-inline-2":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
  "edition-block-12-group-0-inline-4":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-12-group-0-inline-6":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png",
  "edition-block-12-group-0-inline-8":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-12-group-0-inline-10":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png",
  "edition-block-12-group-0-inline-12":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-12-group-0-inline-14":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-13-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
  "edition-block-15-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
  "edition-block-15-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-18-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
  "edition-block-18-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
  "edition-block-19-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
  "edition-block-21-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png",
  "edition-block-21-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
  "edition-block-21-group-0-inline-5":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png",
  "edition-block-21-group-0-inline-7":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-22-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-24-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png",
  "edition-block-27-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
  "edition-block-28-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-28-group-0-inline-3":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-28-group-0-inline-5":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-29-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-31-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
  "edition-block-32-group-0-inline-1":
    "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
} as const;
const KAMEN_MEDICATION_INJECTION_CROP_EVIDENCE = {
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png": {
    sourcePdfPage: 2,
    sourceRectPixels: { x: 500, y: 1850, width: 8700, height: 3400 },
  },
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png": {
    sourcePdfPage: 2,
    sourceRectPixels: { x: 350, y: 5100, width: 9000, height: 3250 },
  },
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png": {
    sourcePdfPage: 2,
    sourceRectPixels: { x: 500, y: 9000, width: 8700, height: 4200 },
  },
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png": {
    sourcePdfPage: 3,
    sourceRectPixels: { x: 600, y: 1700, width: 4000, height: 4200 },
  },
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png": {
    sourcePdfPage: 3,
    sourceRectPixels: { x: 4000, y: 3400, width: 4300, height: 3200 },
  },
  "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png": {
    sourcePdfPage: 3,
    sourceRectPixels: { x: 600, y: 6000, width: 8500, height: 7300 },
  },
} as const;

const PAGERANK_ID = "us-6285999-pagerank";
const PAGERANK_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PAGERANK_ID].assets);
const PAGERANK_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[PAGERANK_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const KAMEN_TRANSPORTER_ID = "us-5701965-kamen-transporter";
const KAMEN_TRANSPORTER_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[KAMEN_TRANSPORTER_ID].assets,
);
const KAMEN_TRANSPORTER_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[KAMEN_TRANSPORTER_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const KAMEN_SEGWAY_ID = "us-6302230-kamen-segway";
const KAMEN_SEGWAY_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[KAMEN_SEGWAY_ID].assets,
);
const KAMEN_SEGWAY_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[KAMEN_SEGWAY_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const VALIDATION_OPTIONS = {
  canonicalAssetsByPatent: {
    [KAMEN_TRANSPORTER_ID]: KAMEN_TRANSPORTER_ASSETS,
    [KAMEN_SEGWAY_ID]: KAMEN_SEGWAY_ASSETS,
    [KAMEN_MEDICATION_INJECTION_ID]: KAMEN_MEDICATION_INJECTION_ASSETS,
    [SIKORSKY_ID]: SIKORSKY_ASSETS,
    [METCALFE_ID]: METCALFE_ASSETS,
    [PASTEUR_ID]: PASTEUR_ASSETS,
    [COLT_ID]: COLT_ASSETS,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_ASSETS,
    [PAGERANK_ID]: PAGERANK_ASSETS,
  },
  canonicalOccurrencesByPatent: {
    [KAMEN_TRANSPORTER_ID]: KAMEN_TRANSPORTER_OCCURRENCES,
    [KAMEN_SEGWAY_ID]: KAMEN_SEGWAY_OCCURRENCES,
    [KAMEN_MEDICATION_INJECTION_ID]: KAMEN_MEDICATION_INJECTION_OCCURRENCES,
    [SIKORSKY_ID]: SIKORSKY_OCCURRENCES,
    [METCALFE_ID]: METCALFE_OCCURRENCES,
    [PASTEUR_ID]: PASTEUR_OCCURRENCES,
    [COLT_ID]: COLT_REVOLVER_OCCURRENCES,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_OCCURRENCES,
    [PAGERANK_ID]: PAGERANK_OCCURRENCES,
  },
  sourcePdfPageCountsByPatent: {
    [KAMEN_TRANSPORTER_ID]: 48,
    [KAMEN_SEGWAY_ID]: 29,
    [KAMEN_MEDICATION_INJECTION_ID]: 8,
    [SIKORSKY_ID]: 15,
    [METCALFE_ID]: 19,
    [PASTEUR_ID]: 3,
    [COLT_ID]: 7,
    [CLAVEL_DELTA_ROBOT_ID]: 11,
    [PAGERANK_ID]: 15,
  },
} as const;

describe("figure occurrence source locators", () => {
  test("seeds all three receipt-backed Pasteur figure occurrences", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[PASTEUR_ID];
    expect(Object.keys(FIGURE_OCCURRENCE_SOURCE_LOCATORS)).toEqual([
      KAMEN_TRANSPORTER_ID,
      KAMEN_SEGWAY_ID,
      KAMEN_MEDICATION_INJECTION_ID,
      SIKORSKY_ID,
      METCALFE_ID,
      PASTEUR_ID,
      COLT_ID,
      CLAVEL_DELTA_ROBOT_ID,
      PAGERANK_ID,
    ]);
    expect(locators).toHaveLength(3);
    expect(new Set(locators.map((locator) => locator.activeAsset))).toEqual(
      new Set(PASTEUR_ASSETS),
    );
    expect(locators.map((locator) => locator.sourcePdfPage)).toEqual([1, 1, 1]);
    expect(locators.map((locator) => locator.sourceRaster)).toEqual([
      { width: 2320, height: 3408 },
      { width: 2320, height: 3408 },
      { width: 2320, height: 3408 },
    ]);
    expect(locators.map((locator) => locator.sourceRectPixels)).toEqual([
      { x: 280, y: 620, width: 1750, height: 1150 },
      { x: 280, y: 620, width: 1750, height: 1150 },
      { x: 710, y: 1770, width: 900, height: 750 },
    ]);
  });

  test("binds every Clavel Delta occurrence to its reviewed full drawing sheet", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[CLAVEL_DELTA_ROBOT_ID];
    expect(locators).toHaveLength(15);
    expect(new Set(locators.map((locator) => locator.activeAsset))).toEqual(
      new Set(CLAVEL_DELTA_ROBOT_ASSETS),
    );
    expect(locators.map((locator) => locator.sourcePdfPage)).toEqual([
      2, 3, 4, 4, 5, 2, 3, 2, 4, 2, 3, 2, 5, 2, 2,
    ]);
    expect(locators.map((locator) => locator.occurrenceKey)).toEqual(
      Object.keys(CLAVEL_DELTA_ROBOT_OCCURRENCES) as FigureOccurrenceKey[],
    );
    expect(
      locators.every(
        (locator) =>
          locator.sourceRaster.width === 5800 &&
          locator.sourceRaster.height === 8520 &&
          locator.sourceRectPixels.x === 0 &&
          locator.sourceRectPixels.y === 0 &&
          locator.sourceRectPixels.width === 5800 &&
          locator.sourceRectPixels.height === 8520 &&
          locator.evidenceReference.endsWith("#figure-crop-review-and-preservation-boundary"),
      ),
    ).toBe(true);
  });

  test("binds every Kamen figure citation to its independently reviewed source pixels", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[KAMEN_MEDICATION_INJECTION_ID];
    expect(locators).toHaveLength(33);
    expect(locators.map((locator) => locator.occurrenceKey)).toEqual(
      Object.keys(KAMEN_MEDICATION_INJECTION_OCCURRENCES) as FigureOccurrenceKey[],
    );
    expect(
      Object.fromEntries(locators.map((locator) => [locator.occurrenceKey, locator.activeAsset])),
    ).toEqual(KAMEN_MEDICATION_INJECTION_OCCURRENCES);
    expect(new Set(locators.map((locator) => locator.activeAsset))).toEqual(
      new Set(KAMEN_MEDICATION_INJECTION_ASSETS),
    );

    for (const locator of locators) {
      const expected =
        KAMEN_MEDICATION_INJECTION_CROP_EVIDENCE[
          locator.activeAsset as keyof typeof KAMEN_MEDICATION_INJECTION_CROP_EVIDENCE
        ];
      expect(expected).toBeDefined();
      expect(locator.sourcePdfPage).toBe(expected.sourcePdfPage);
      expect(locator.sourceRaster).toEqual({ width: 9667, height: 14200 });
      expect(locator.sourceRectPixels).toEqual(expected.sourceRectPixels);
      expect(locator.normalizedSourceRect).toEqual(
        normalizeSourceRectangle(expected.sourceRectPixels, locator.sourceRaster),
      );
      expect(locator.evidenceReference).toBe(
        "docs/provenance/us-3858581-kamen-medication-injection-device.md#figure-crop-review-and-preservation-boundary",
      );
    }
  });

  test("derives normalized rectangles from the exact source pixels", () => {
    const [figureOne, repeatedFigureOne, figureTwo] = FIGURE_OCCURRENCE_SOURCE_LOCATORS[PASTEUR_ID];
    expect(figureOne?.normalizedSourceRect).toEqual(
      normalizeSourceRectangle(figureOne.sourceRectPixels, figureOne.sourceRaster),
    );
    expect(figureTwo?.normalizedSourceRect).toEqual(
      normalizeSourceRectangle(figureTwo.sourceRectPixels, figureTwo.sourceRaster),
    );
    expect(repeatedFigureOne?.normalizedSourceRect).toEqual(figureOne?.normalizedSourceRect);
    expect(figureOccurrenceKey(6, 0, 1)).toBe("edition-block-6-group-0-inline-1");
  });

  test("accepts the receipt-backed registry against the active acceptance assets", () => {
    expect(
      validateFigureOccurrenceSourceLocators(FIGURE_OCCURRENCE_SOURCE_LOCATORS, {
        ...VALIDATION_OPTIONS,
      }),
    ).toEqual({ valid: true, errors: [] });
  });

  test("fails closed for non-canonical assets, escaping rectangles, and non-derived normalization", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS);
    const locator = malformed[PASTEUR_ID][0];
    locator.activeAsset = "/patents/figures/us-381968-tesla-motor/fig-1-source-crop-v2.png";
    locator.sourceRectPixels.width = 3000;
    locator.normalizedSourceRect.x = 0.4;

    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("active asset is not canonical for this patent");
    expect(result.errors.join("\n")).toContain("source pixel rectangle exceeds the source raster");
    expect(result.errors.join("\n")).toContain("normalized x is not mechanically derived");
  });

  test("requires explicit source-page evidence rather than deriving a page from an asset path", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS);
    malformed[PASTEUR_ID][0].sourcePdfPage = 0;
    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("source PDF page must be a positive integer");
  });

  test("refuses missing occurrences, stale occurrences, and pages outside the reviewed PDF", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS) as unknown as Record<
      string,
      FigureOccurrenceSourceLocator[]
    >;
    malformed[PASTEUR_ID].shift();
    malformed[PASTEUR_ID][0].occurrenceKey = figureOccurrenceKey(99, 0, 0);
    malformed[PASTEUR_ID][1].sourcePdfPage = 4;

    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "locator count does not equal the active edition figure-occurrence count",
    );
    expect(result.errors.join("\n")).toContain("active edition occurrence has no locator");
    expect(result.errors.join("\n")).toContain(
      "locator is not bound to an active edition occurrence",
    );
    expect(result.errors.join("\n")).toContain(
      "source PDF page exceeds the reviewed facsimile page count",
    );
  });

  test("refuses duplicate and independently wrong block, group, or inline coordinates", () => {
    const mutations: readonly [
      string,
      (registry: Record<string, FigureOccurrenceSourceLocator[]>) => void,
    ][] = [
      [
        "duplicate",
        (registry) => {
          registry[PASTEUR_ID][1].occurrenceKey = registry[PASTEUR_ID][0].occurrenceKey;
        },
      ],
      [
        "block",
        (registry) => {
          registry[PASTEUR_ID][0].occurrenceKey = figureOccurrenceKey(7, 0, 1);
        },
      ],
      [
        "group",
        (registry) => {
          registry[PASTEUR_ID][0].occurrenceKey = figureOccurrenceKey(6, 1, 1);
        },
      ],
      [
        "inline",
        (registry) => {
          registry[PASTEUR_ID][0].occurrenceKey = figureOccurrenceKey(6, 0, 2);
        },
      ],
    ];

    for (const [name, mutate] of mutations) {
      const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS) as unknown as Record<
        string,
        FigureOccurrenceSourceLocator[]
      >;
      mutate(malformed);
      const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
      const diagnostic = `${name}: ${result.errors.join("\n")}`;

      expect(result.valid, diagnostic).toBe(false);
      if (name === "duplicate") {
        expect(diagnostic).toContain("duplicate occurrence key");
      } else {
        expect(diagnostic).toContain("locator is not bound to an active edition occurrence");
      }
      expect(diagnostic).toContain("active edition occurrence has no locator");
    }
  });

  test("refuses zero-area crops and incomplete independent-review evidence", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS) as unknown as Record<
      string,
      FigureOccurrenceSourceLocator[]
    >;
    const locator = malformed[PASTEUR_ID][0];
    locator.sourceRectPixels.width = 0;
    locator.normalizedSourceRect = normalizeSourceRectangle(
      locator.sourceRectPixels,
      locator.sourceRaster,
    );
    locator.reviewer = " ";
    locator.reviewedAt = "2026-9-2";
    locator.evidenceReference = "docs/provenance/another-patent.md#figure-review";

    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    const diagnostic = result.errors.join("\n");
    expect(result.valid, diagnostic).toBe(false);
    expect(diagnostic).toContain(
      "source pixel rectangle must use non-negative origin and positive integers",
    );
    expect(diagnostic).toContain("reviewer is required");
    expect(diagnostic).toContain("reviewedAt must be an ISO date");
    expect(diagnostic).toContain(
      "evidence reference must identify this patent's provenance receipt",
    );
  });

  test("refuses absent canonical asset evidence and invalid raster geometry", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS) as unknown as Record<
      string,
      FigureOccurrenceSourceLocator[]
    >;
    malformed[PASTEUR_ID][0].sourceRaster.width = 0;

    const result = validateFigureOccurrenceSourceLocators(malformed, {
      canonicalAssetsByPatent: {
        [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_ASSETS,
        [COLT_ID]: COLT_ASSETS,
      },
      canonicalOccurrencesByPatent: VALIDATION_OPTIONS.canonicalOccurrencesByPatent,
      sourcePdfPageCountsByPatent: VALIDATION_OPTIONS.sourcePdfPageCountsByPatent,
    });
    const diagnostic = result.errors.join("\n");
    expect(result.valid, diagnostic).toBe(false);
    expect(diagnostic).toContain("canonical active-asset evidence is required");
    expect(diagnostic).toContain("source raster dimensions must be positive integers");
  });
});
