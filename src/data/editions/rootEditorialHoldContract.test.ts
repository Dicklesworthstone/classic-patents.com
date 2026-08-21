import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { carlsonElectrophotographyPatent } from "@/data/patents/carlson-electrophotography";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";
import {
  archivalEditionForPublication,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

/**
 * Independent release sentinel for editions that have failed source QA.
 *
 * This list intentionally does not share a constant with the editable
 * publication map. A mistaken bulk registration must therefore fail the
 * release path instead of exposing an incomplete source face to visitors.
 */
const REQUIRED_ROOT_EDITORIAL_HOLDS = [
  "us-x72-whitney-cotton-gin",
  "us-x9430-colt-revolver",
  "us-31128-otis-elevator",
  "us-79265-sholes-typewriter",
  "us-319596-maxim-machine-gun",
  "us-3237-rillieux-evaporator",
  "us-48475-yale-lock",
  "us-120057-gramme-dynamo",
  "us-124404-westinghouse-air-brake",
  "us-1647-morse-telegraph",
  "us-174465-bell-telephone",
  "us-194047-otto-engine",
  "us-223898-edison-lightbulb",
  "us-235199-bell-photophone",
  "us-247804-delaval-separator",
  "us-1102653-goddard-rocket",
  "us-36836-gatling-gun",
  "us-588-ericsson-propeller",
  "us-586193-marconi-radio",
  "us-682690-hewitt-mercury-lamp",
  "us-706737-fessenden-wireless",
  "us-727650-linde-air-liquefaction",
  "us-621195-zeppelin-airship",
  "us-2708656-fermi-reactor",
  "us-3541541-engelbart-mouse",
  "us-313224-mergenthaler-linotype",
  "us-395781-hollerith-tabulating",
  "us-2297691-carlson-electrophotography",
  "us-233692-pelton-water-wheel",
  "us-2524035-bardeen-transistor",
  "us-2543181-land-polaroid",
  "us-3138743-kilby-integrated-circuit",
  "us-3353115-maiman-ruby-laser",
  "us-347140-thomson-welding",
  "us-381968-tesla-motor",
  "us-388850-eastman-kodak",
  "us-608969-parsons-turbine",
  "us-613809-tesla-teleautomaton",
  "us-6162-corliss-steam-engine",
  "us-400766-hall-aluminium",
  "us-470918-reno-escalator",
  "us-3858232-boyle-smith-ccd",
  "us-1773980-farnsworth-tv",
  "us-1781541-einstein-refrigerator",
  "us-2929922-townes-laser",
  "us-3671542-kwolek-kevlar",
  "us-2981877-noyce-ic",
  "us-2292387-lamarr-frequency-hopping",
  "us-542846-diesel-engine",
  "us-821393-wright-flyer",
  "us-593138-tesla-coil",
  "us-808897-carrier-air-conditioner",
  "us-4136359-wozniak-apple",
  "us-157124-glidden-barbed-wire",
  "us-x1-hopkins-potash",
  "us-135245-pasteur-fermentation",
  "us-4750-howe-sewing-machine",
  "us-200521-edison-phonograph",
  "us-2495429-spencer-microwave",
  "us-307031-edison-indicator",
  "us-361931-daimler-engine",
  "us-879532-de-forest-audion",
  "us-942699-baekeland-bakelite",
  "us-971501-haber-ammonia",
  "us-6120588-eink",
  "us-6285999-pagerank",
  "us-6331181-davinci",
  "us-6594844-roomba",
  "us-7479949-multitouch",
] as const;

const SOURCE_QA_RELEASED_EDITIONS = ["us-3633-goodyear-rubber"] as const;

describe("root editorial publication holds", () => {
  test("keeps every rejected edition unavailable through the actual visitor lookup", () => {
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...REQUIRED_ROOT_EDITORIAL_HOLDS].map(String).sort(),
    );

    for (const patentId of REQUIRED_ROOT_EDITORIAL_HOLDS) {
      const patent =
        allPatents.find((candidate) => candidate.id === patentId) ??
        (patentId === carlsonElectrophotographyPatent.id
          ? carlsonElectrophotographyPatent
          : undefined);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(archivalEditionForPublication(patent)).toBeUndefined();
    }
  });

  test("keeps records with known incomplete source ledgers unbound as a second fail-closed layer", () => {
    for (const patentId of [
      "gb-913-watt-separate-condenser",
      "gb-931-arkwright-water-frame",
      "gb-1306-watt-rotary-engine",
      "gb-1420-cort-puddling-rolling",
    ]) {
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(patent.archivalEdition).toBeUndefined();
      expect(patent.originalTextAsset).toBeUndefined();
    }
  });

  test("makes an independently accepted source edition available only with its explicit companion map", () => {
    for (const patentId of SOURCE_QA_RELEASED_EDITIONS) {
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS).not.toContain(patentId);
      expect(
        ARCHIVAL_PARALLEL_READINGS[patentId],
        `Patent ${patentId} missing companion map`,
      ).toBeDefined();
      expect(archivalEditionForPublication(patent)).toBe(patent.archivalEdition);
    }
  });
});
