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
const MESTRAL_VELCRO_ID = "us-2717437-mestral-velcro";
const MESTRAL_VELCRO_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[MESTRAL_VELCRO_ID].assets,
);
const MESTRAL_VELCRO_OCCURRENCES = {
  "edition-block-1-group-0-inline-0":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-1-group-0-inline-2":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-6-group-0-inline-1":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-6-group-0-inline-3":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-7-group-0-inline-1":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-11-group-0-inline-1":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-11-group-0-inline-5":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-13-group-0-inline-1":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-13-group-0-inline-3":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-16-group-0-inline-1":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
  "edition-block-16-group-0-inline-3":
    "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
} as const;
const LINCOLN_BUOY_ID = "us-6469-lincoln-buoy";
const LINCOLN_BUOY_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[LINCOLN_BUOY_ID].assets,
);
const LINCOLN_BUOY_OCCURRENCES = {
  "edition-block-7-group-0-inline-0": "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-7-group-0-inline-2": "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-7-group-0-inline-4": "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-9-group-0-inline-1": "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-10-group-0-inline-1":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-11-group-0-inline-1":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-12-group-0-inline-1":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-12-group-0-inline-3":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-12-group-0-inline-5":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
  "edition-block-13-group-0-inline-1":
    "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
} as const;
const HALL_ALUMINIUM_ID = "us-400766-hall-aluminium";
const HALL_ALUMINIUM_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[HALL_ALUMINIUM_ID].assets,
);
const HALL_ALUMINIUM_OCCURRENCES = {
  "edition-block-1-group-0-inline-1":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
  "edition-block-1-group-0-inline-3":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
  "edition-block-4-group-0-inline-1":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
  "edition-block-4-group-0-inline-3":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
  "edition-block-8-group-0-inline-1":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
  "edition-block-8-group-0-inline-3":
    "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
} as const;
const EASTMAN_KODAK_ID = "us-388850-eastman-kodak";
const EASTMAN_KODAK_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[EASTMAN_KODAK_ID].assets,
);
const EASTMAN_KODAK_OCCURRENCES = {
  "edition-block-4-group-0-inline-1":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-1-v1.png",
  "edition-block-4-group-0-inline-3":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-1-v1.png",
  "edition-block-4-group-0-inline-5":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-1-v1.png",
  "edition-block-4-group-0-inline-7":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  "edition-block-4-group-0-inline-9":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  "edition-block-4-group-0-inline-11":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  "edition-block-4-group-0-inline-13":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  "edition-block-4-group-0-inline-15":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  "edition-block-4-group-0-inline-17":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-3-v1.png",
  "edition-block-4-group-0-inline-19":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-3-v1.png",
  "edition-block-4-group-0-inline-23":
    "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
} as const;
const MAKINO_SCARA_ID = "us-4341502-makino-scara";
const MAKINO_SCARA_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[MAKINO_SCARA_ID].assets,
);
const MAKINO_SCARA_OCCURRENCES = {
  "edition-block-11-group-0-inline-0":
    "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png",
  "edition-block-11-group-0-inline-2":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-11-group-0-inline-4":
    "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png",
  "edition-block-11-group-0-inline-6":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-11-group-0-inline-8":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-13-group-0-inline-1":
    "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png",
  "edition-block-14-group-0-inline-1":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-15-group-0-inline-0":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-15-group-0-inline-2":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-16-group-0-inline-1":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-16-group-0-inline-3":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-16-group-0-inline-5":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-16-group-0-inline-7":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-16-group-0-inline-9":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-17-group-0-inline-1":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
  "edition-block-17-group-0-inline-3":
    "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
} as const;
const BAER_ODYSSEY_ID = "us-3728480-baer-odyssey";
const BAER_ODYSSEY_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[BAER_ODYSSEY_ID].assets,
);
const BAER_ODYSSEY_OCCURRENCES = {
  "edition-block-21-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
  "edition-block-22-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
  "edition-block-23-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
  "edition-block-24-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png",
  "edition-block-25-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png",
  "edition-block-26-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png",
  "edition-block-27-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-05-v1.png",
  "edition-block-28-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png",
  "edition-block-29-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-06-v1.png",
  "edition-block-30-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png",
  "edition-block-31-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png",
  "edition-block-32-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png",
  "edition-block-33-group-0-inline-0":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png",
  "edition-block-35-group-0-inline-1":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
  "edition-block-35-group-0-inline-3":
    "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
} as const;
const CARLSON_ELECTROPHOTOGRAPHY_ID = "us-2297691-carlson-electrophotography";
const CARLSON_ELECTROPHOTOGRAPHY_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[CARLSON_ELECTROPHOTOGRAPHY_ID].assets,
);
const CARLSON_ELECTROPHOTOGRAPHY_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[CARLSON_ELECTROPHOTOGRAPHY_ID].map((locator) => [
    locator.occurrenceKey,
    locator.activeAsset,
  ]),
);
const YALE_LOCK_ID = "us-48475-yale-lock";
const YALE_LOCK_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[YALE_LOCK_ID].assets);
const YALE_LOCK_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[YALE_LOCK_ID].map((locator) => [
    locator.occurrenceKey,
    locator.activeAsset,
  ]),
);
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

const HULL_ID = "us-4575330-hull-stereolithography";
const HULL_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[HULL_ID].assets);
const HULL_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[HULL_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const WRIGHT_ID = "us-821393-wright-flyer";
const WRIGHT_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[WRIGHT_ID].assets);
const WRIGHT_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[WRIGHT_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const SUNDBACK_ZIPPER_ID = "us-1219881-sundback-zipper";
const SUNDBACK_ZIPPER_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[SUNDBACK_ZIPPER_ID].assets,
);
const SUNDBACK_ZIPPER_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[SUNDBACK_ZIPPER_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const SPENCER_MICROWAVE_ID = "us-2495429-spencer-microwave";
const SPENCER_MICROWAVE_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[SPENCER_MICROWAVE_ID].assets,
);
const SPENCER_MICROWAVE_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[SPENCER_MICROWAVE_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const EINSTEIN_REFRIGERATOR_ID = "us-1781541-einstein-refrigerator";
const EINSTEIN_REFRIGERATOR_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[EINSTEIN_REFRIGERATOR_ID].assets,
);
const EINSTEIN_REFRIGERATOR_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[EINSTEIN_REFRIGERATOR_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const TESLA_MOTOR_ID = "us-381968-tesla-motor";
const TESLA_MOTOR_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[TESLA_MOTOR_ID].assets,
);
const TESLA_MOTOR_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[TESLA_MOTOR_ID].map((locator) => [
    locator.occurrenceKey,
    locator.activeAsset,
  ]),
);

const TESLA_COIL_593138_ID = "us-593138-tesla-coil";
const TESLA_COIL_593138_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[TESLA_COIL_593138_ID].assets,
);
const TESLA_COIL_593138_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[TESLA_COIL_593138_ID].map((locator) => [
    locator.occurrenceKey,
    locator.activeAsset,
  ]),
);

const DAVENPORT_ELECTRIC_MOTOR_ID = "us-132-davenport-electric-motor";
const DAVENPORT_ELECTRIC_MOTOR_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[DAVENPORT_ELECTRIC_MOTOR_ID].assets,
);
const DAVENPORT_ELECTRIC_MOTOR_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[DAVENPORT_ELECTRIC_MOTOR_ID].map((locator) => [
    locator.occurrenceKey,
    locator.activeAsset,
  ]),
);

const DE_FOREST_ID = "us-879532-de-forest-audion";
const DE_FOREST_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[DE_FOREST_ID].assets);
const DE_FOREST_SOURCE_SHEET = "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png";
const DE_FOREST_OCCURRENCES = {
  "edition-block-5-group-0-inline-1": DE_FOREST_SOURCE_SHEET,
  "edition-block-5-group-0-inline-3": DE_FOREST_SOURCE_SHEET,
  "edition-block-7-group-0-inline-3": DE_FOREST_SOURCE_SHEET,
  "edition-block-7-group-0-inline-5": DE_FOREST_SOURCE_SHEET,
  "edition-block-9-group-0-inline-3": DE_FOREST_SOURCE_SHEET,
  "edition-block-9-group-0-inline-5": DE_FOREST_SOURCE_SHEET,
} as const;

const GLIDDEN_BARBED_WIRE_ID = "us-157124-glidden-barbed-wire";
const GLIDDEN_BARBED_WIRE_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[GLIDDEN_BARBED_WIRE_ID].assets,
);
const GLIDDEN_BARBED_WIRE_SOURCE_SHEET =
  "/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png";
const GLIDDEN_BARBED_WIRE_OCCURRENCES = {
  "edition-block-1-group-0-inline-1": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
  "edition-block-1-group-0-inline-2": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
  "edition-block-1-group-0-inline-3": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
  "edition-block-4-group-0-inline-0": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
  "edition-block-4-group-0-inline-2": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
  "edition-block-4-group-0-inline-4": GLIDDEN_BARBED_WIRE_SOURCE_SHEET,
} as const;

const PELTON_ID = "us-233692-pelton-water-wheel";
const PELTON_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PELTON_ID].assets);
const PELTON_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[PELTON_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const DELAVAL_ID = "us-247804-delaval-separator";
const DELAVAL_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[DELAVAL_ID].assets);
const DELAVAL_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[DELAVAL_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const EDISON_BULB_ID = "us-223898-edison-lightbulb";
const EDISON_BULB_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[EDISON_BULB_ID].assets,
);
const EDISON_BULB_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[EDISON_BULB_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const EDISON_PHONOGRAPH_ID = "us-200521-edison-phonograph";
const EDISON_PHONOGRAPH_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[EDISON_PHONOGRAPH_ID].assets,
);
const EDISON_PHONOGRAPH_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[EDISON_PHONOGRAPH_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const MCCORMICK_REAPER_ID = "us-x8277-mccormick-reaper";
const MCCORMICK_REAPER_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[MCCORMICK_REAPER_ID].assets,
);
const MCCORMICK_REAPER_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[MCCORMICK_REAPER_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const MAXIM_MACHINE_GUN_ID = "us-319596-maxim-machine-gun";
const MAXIM_MACHINE_GUN_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[MAXIM_MACHINE_GUN_ID].assets,
);
const MAXIM_MACHINE_GUN_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[MAXIM_MACHINE_GUN_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const DAIMLER_ENGINE_ID = "us-361931-daimler-engine";
const DAIMLER_ENGINE_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[DAIMLER_ENGINE_ID].assets,
);
const DAIMLER_ENGINE_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[DAIMLER_ENGINE_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const ROOMBA_ID = "us-6594844-roomba";
const ROOMBA_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[ROOMBA_ID].assets);
const ROOMBA_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[ROOMBA_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const CORLISS_ID = "us-6162-corliss-steam-engine";
const CORLISS_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[CORLISS_ID].assets);
const CORLISS_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[CORLISS_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const LINDE_AIR_LIQUEFACTION_ID = "us-727650-linde-air-liquefaction";
const LINDE_AIR_LIQUEFACTION_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[LINDE_AIR_LIQUEFACTION_ID].assets,
);
const LINDE_AIR_LIQUEFACTION_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[LINDE_AIR_LIQUEFACTION_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const PARSONS_TURBINE_ID = "us-608969-parsons-turbine";
const PARSONS_TURBINE_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PARSONS_TURBINE_ID].assets,
);
const PARSONS_TURBINE_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[PARSONS_TURBINE_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const EDISON_INDICATOR_ID = "us-307031-edison-indicator";
const EDISON_INDICATOR_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[EDISON_INDICATOR_ID].assets,
);
const EDISON_INDICATOR_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[EDISON_INDICATOR_ID].map((l) => [
    l.occurrenceKey,
    l.activeAsset,
  ]),
);

const OTIS_ELEVATOR_ID = "us-31128-otis-elevator";
const OTIS_ELEVATOR_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[OTIS_ELEVATOR_ID].assets,
);
const OTIS_ELEVATOR_OCCURRENCES = Object.fromEntries(
  FIGURE_OCCURRENCE_SOURCE_LOCATORS[OTIS_ELEVATOR_ID].map((l) => [l.occurrenceKey, l.activeAsset]),
);

const VALIDATION_OPTIONS = {
  canonicalAssetsByPatent: {
    [HULL_ID]: HULL_ASSETS,
    [KAMEN_TRANSPORTER_ID]: KAMEN_TRANSPORTER_ASSETS,
    [KAMEN_SEGWAY_ID]: KAMEN_SEGWAY_ASSETS,
    [KAMEN_MEDICATION_INJECTION_ID]: KAMEN_MEDICATION_INJECTION_ASSETS,
    [SIKORSKY_ID]: SIKORSKY_ASSETS,
    [METCALFE_ID]: METCALFE_ASSETS,
    [PASTEUR_ID]: PASTEUR_ASSETS,
    [COLT_ID]: COLT_ASSETS,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_ASSETS,
    [PAGERANK_ID]: PAGERANK_ASSETS,
    [WRIGHT_ID]: WRIGHT_ASSETS,
    [DE_FOREST_ID]: DE_FOREST_ASSETS,
    [EDISON_INDICATOR_ID]: EDISON_INDICATOR_ASSETS,
    [GLIDDEN_BARBED_WIRE_ID]: GLIDDEN_BARBED_WIRE_ASSETS,
    [SUNDBACK_ZIPPER_ID]: SUNDBACK_ZIPPER_ASSETS,
    [PELTON_ID]: PELTON_ASSETS,
    [MESTRAL_VELCRO_ID]: MESTRAL_VELCRO_ASSETS,
    [LINCOLN_BUOY_ID]: LINCOLN_BUOY_ASSETS,
    [HALL_ALUMINIUM_ID]: HALL_ALUMINIUM_ASSETS,
    [EASTMAN_KODAK_ID]: EASTMAN_KODAK_ASSETS,
    [MAKINO_SCARA_ID]: MAKINO_SCARA_ASSETS,
    [BAER_ODYSSEY_ID]: BAER_ODYSSEY_ASSETS,
    [CARLSON_ELECTROPHOTOGRAPHY_ID]: CARLSON_ELECTROPHOTOGRAPHY_ASSETS,
    [YALE_LOCK_ID]: YALE_LOCK_ASSETS,
    [ROOMBA_ID]: ROOMBA_ASSETS,
    [CORLISS_ID]: CORLISS_ASSETS,
    [LINDE_AIR_LIQUEFACTION_ID]: LINDE_AIR_LIQUEFACTION_ASSETS,
    [EINSTEIN_REFRIGERATOR_ID]: EINSTEIN_REFRIGERATOR_ASSETS,
    [SPENCER_MICROWAVE_ID]: SPENCER_MICROWAVE_ASSETS,
    [TESLA_MOTOR_ID]: TESLA_MOTOR_ASSETS,
    [TESLA_COIL_593138_ID]: TESLA_COIL_593138_ASSETS,
    [DAVENPORT_ELECTRIC_MOTOR_ID]: DAVENPORT_ELECTRIC_MOTOR_ASSETS,
    [DELAVAL_ID]: DELAVAL_ASSETS,
    [EDISON_BULB_ID]: EDISON_BULB_ASSETS,
    [EDISON_PHONOGRAPH_ID]: EDISON_PHONOGRAPH_ASSETS,
    [OTIS_ELEVATOR_ID]: OTIS_ELEVATOR_ASSETS,
    [MAXIM_MACHINE_GUN_ID]: MAXIM_MACHINE_GUN_ASSETS,
    [DAIMLER_ENGINE_ID]: DAIMLER_ENGINE_ASSETS,
    [PARSONS_TURBINE_ID]: PARSONS_TURBINE_ASSETS,
    [MCCORMICK_REAPER_ID]: MCCORMICK_REAPER_ASSETS,
  },
  canonicalOccurrencesByPatent: {
    [HULL_ID]: HULL_OCCURRENCES,
    [KAMEN_TRANSPORTER_ID]: KAMEN_TRANSPORTER_OCCURRENCES,
    [KAMEN_SEGWAY_ID]: KAMEN_SEGWAY_ASSETS ? KAMEN_SEGWAY_OCCURRENCES : {},
    [KAMEN_MEDICATION_INJECTION_ID]: KAMEN_MEDICATION_INJECTION_OCCURRENCES,
    [SIKORSKY_ID]: SIKORSKY_OCCURRENCES,
    [METCALFE_ID]: METCALFE_OCCURRENCES,
    [PASTEUR_ID]: PASTEUR_OCCURRENCES,
    [COLT_ID]: COLT_REVOLVER_OCCURRENCES,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_OCCURRENCES,
    [PAGERANK_ID]: PAGERANK_OCCURRENCES,
    [WRIGHT_ID]: WRIGHT_OCCURRENCES,
    [DE_FOREST_ID]: DE_FOREST_OCCURRENCES,
    [EDISON_INDICATOR_ID]: EDISON_INDICATOR_OCCURRENCES,
    [GLIDDEN_BARBED_WIRE_ID]: GLIDDEN_BARBED_WIRE_OCCURRENCES,
    [SUNDBACK_ZIPPER_ID]: SUNDBACK_ZIPPER_OCCURRENCES,
    [PELTON_ID]: PELTON_OCCURRENCES,
    [MESTRAL_VELCRO_ID]: MESTRAL_VELCRO_OCCURRENCES,
    [LINCOLN_BUOY_ID]: LINCOLN_BUOY_OCCURRENCES,
    [HALL_ALUMINIUM_ID]: HALL_ALUMINIUM_OCCURRENCES,
    [EASTMAN_KODAK_ID]: EASTMAN_KODAK_OCCURRENCES,
    [MAKINO_SCARA_ID]: MAKINO_SCARA_OCCURRENCES,
    [BAER_ODYSSEY_ID]: BAER_ODYSSEY_OCCURRENCES,
    [CARLSON_ELECTROPHOTOGRAPHY_ID]: CARLSON_ELECTROPHOTOGRAPHY_OCCURRENCES,
    [YALE_LOCK_ID]: YALE_LOCK_OCCURRENCES,
    [ROOMBA_ID]: ROOMBA_OCCURRENCES,
    [CORLISS_ID]: CORLISS_OCCURRENCES,
    [LINDE_AIR_LIQUEFACTION_ID]: LINDE_AIR_LIQUEFACTION_OCCURRENCES,
    [EINSTEIN_REFRIGERATOR_ID]: EINSTEIN_REFRIGERATOR_OCCURRENCES,
    [SPENCER_MICROWAVE_ID]: SPENCER_MICROWAVE_OCCURRENCES,
    [TESLA_MOTOR_ID]: TESLA_MOTOR_OCCURRENCES,
    [TESLA_COIL_593138_ID]: TESLA_COIL_593138_OCCURRENCES,
    [DAVENPORT_ELECTRIC_MOTOR_ID]: DAVENPORT_ELECTRIC_MOTOR_OCCURRENCES,
    [DELAVAL_ID]: DELAVAL_OCCURRENCES,
    [EDISON_BULB_ID]: EDISON_BULB_OCCURRENCES,
    [EDISON_PHONOGRAPH_ID]: EDISON_PHONOGRAPH_OCCURRENCES,
    [OTIS_ELEVATOR_ID]: OTIS_ELEVATOR_OCCURRENCES,
    [MAXIM_MACHINE_GUN_ID]: MAXIM_MACHINE_GUN_OCCURRENCES,
    [DAIMLER_ENGINE_ID]: DAIMLER_ENGINE_OCCURRENCES,
    [PARSONS_TURBINE_ID]: PARSONS_TURBINE_OCCURRENCES,
    [MCCORMICK_REAPER_ID]: MCCORMICK_REAPER_OCCURRENCES,
  },
  sourcePdfPageCountsByPatent: {
    [HULL_ID]: 16,
    [KAMEN_TRANSPORTER_ID]: 48,
    [KAMEN_SEGWAY_ID]: 29,
    [KAMEN_MEDICATION_INJECTION_ID]: 8,
    [SIKORSKY_ID]: 15,
    [METCALFE_ID]: 19,
    [PASTEUR_ID]: 3,
    [COLT_ID]: 7,
    [CLAVEL_DELTA_ROBOT_ID]: 11,
    [PAGERANK_ID]: 15,
    [WRIGHT_ID]: 10,
    [DE_FOREST_ID]: 4,
    [EDISON_INDICATOR_ID]: 3,
    [GLIDDEN_BARBED_WIRE_ID]: 2,
    [SUNDBACK_ZIPPER_ID]: 5,
    [PELTON_ID]: 3,
    [MESTRAL_VELCRO_ID]: 3,
    [LINCOLN_BUOY_ID]: 3,
    [HALL_ALUMINIUM_ID]: 3,
    [EASTMAN_KODAK_ID]: 9,
    [MAKINO_SCARA_ID]: 5,
    [BAER_ODYSSEY_ID]: 21,
    [CARLSON_ELECTROPHOTOGRAPHY_ID]: 10,
    [YALE_LOCK_ID]: 4,
    [ROOMBA_ID]: 26,
    [CORLISS_ID]: 8,
    [LINDE_AIR_LIQUEFACTION_ID]: 5,
    [EINSTEIN_REFRIGERATOR_ID]: 4,
    [SPENCER_MICROWAVE_ID]: 3,
    [TESLA_MOTOR_ID]: 9,
    [TESLA_COIL_593138_ID]: 4,
    [DAVENPORT_ELECTRIC_MOTOR_ID]: 3,
    [DELAVAL_ID]: 3,
    [EDISON_BULB_ID]: 4,
    [EDISON_PHONOGRAPH_ID]: 3,
    [OTIS_ELEVATOR_ID]: 3,
    [MAXIM_MACHINE_GUN_ID]: 5,
    [DAIMLER_ENGINE_ID]: 6,
    [PARSONS_TURBINE_ID]: 8,
    [MCCORMICK_REAPER_ID]: 3,
  },
} as const;

describe("figure occurrence source locators", () => {
  test("seeds all three receipt-backed Pasteur figure occurrences", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[PASTEUR_ID];
    expect(Object.keys(FIGURE_OCCURRENCE_SOURCE_LOCATORS)).toEqual([
      HULL_ID,
      KAMEN_TRANSPORTER_ID,
      KAMEN_SEGWAY_ID,
      KAMEN_MEDICATION_INJECTION_ID,
      SIKORSKY_ID,
      METCALFE_ID,
      PASTEUR_ID,
      COLT_ID,
      CLAVEL_DELTA_ROBOT_ID,
      PAGERANK_ID,
      WRIGHT_ID,
      DE_FOREST_ID,
      EDISON_INDICATOR_ID,
      GLIDDEN_BARBED_WIRE_ID,
      SUNDBACK_ZIPPER_ID,
      PELTON_ID,
      MESTRAL_VELCRO_ID,
      LINCOLN_BUOY_ID,
      HALL_ALUMINIUM_ID,
      EASTMAN_KODAK_ID,
      MAKINO_SCARA_ID,
      BAER_ODYSSEY_ID,
      CARLSON_ELECTROPHOTOGRAPHY_ID,
      YALE_LOCK_ID,
      ROOMBA_ID,
      CORLISS_ID,
      LINDE_AIR_LIQUEFACTION_ID,
      EINSTEIN_REFRIGERATOR_ID,
      SPENCER_MICROWAVE_ID,
      TESLA_MOTOR_ID,
      TESLA_COIL_593138_ID,
      DAVENPORT_ELECTRIC_MOTOR_ID,
      DELAVAL_ID,
      EDISON_BULB_ID,
      EDISON_PHONOGRAPH_ID,
      OTIS_ELEVATOR_ID,
      MAXIM_MACHINE_GUN_ID,
      DAIMLER_ENGINE_ID,
      PARSONS_TURBINE_ID,
      MCCORMICK_REAPER_ID,
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

  test("binds Spencer's sole cited drawing to its complete primary source sheet", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[SPENCER_MICROWAVE_ID];
    expect(locators).toEqual([
      expect.objectContaining({
        occurrenceKey: "edition-block-6-group-0-inline-1",
        activeAsset: "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png",
        sourcePdfPage: 1,
        sourceRaster: { width: 2320, height: 3408 },
        sourceRectPixels: { x: 0, y: 0, width: 2320, height: 3408 },
        evidenceReference:
          "docs/provenance/us-2495429-spencer-microwave.md#source-sheet-acceptance-2026-09-03",
      }),
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
