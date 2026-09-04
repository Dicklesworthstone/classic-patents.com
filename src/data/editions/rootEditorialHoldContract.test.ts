import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { carlsonElectrophotographyPatent } from "@/data/patents/carlson-electrophotography";
import {
  archivalEditionForPublication,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

/**
 * Independent snapshot of the root-QA roster. The typed publication boundary
 * consumes this audit evidence as a restrictive release condition until a
 * record receives an explicit replacement acceptance.
 */
const REQUIRED_ROOT_EDITORIAL_HOLDS = [
  "us-2543181-land-polaroid",
  "us-2708656-fermi-reactor",
  "us-313224-mergenthaler-linotype",
  "us-542846-diesel-engine",
  "us-6120588-eink",
  "us-706737-fessenden-wireless",
] as const;

const SOURCE_QA_RELEASED_EDITIONS = [
  "us-105338-hyatt-celluloid",
  "us-1102653-goddard-rocket",
  "us-120057-gramme-dynamo",
  "us-124404-westinghouse-air-brake",
  "us-132-davenport-electric-motor",
  "us-135245-pasteur-fermentation",
  "us-157124-glidden-barbed-wire",
  "us-1647-morse-telegraph",
  "us-174465-bell-telephone",
  "us-1773980-farnsworth-tv",
  "us-1781541-einstein-refrigerator",
  "us-194047-otto-engine",
  "us-200521-edison-phonograph",
  "us-223898-edison-lightbulb",
  "us-2297691-carlson-electrophotography",
  "us-2292387-lamarr-frequency-hopping",
  "us-233692-pelton-water-wheel",
  "us-235199-bell-photophone",
  "us-247804-delaval-separator",
  "us-2495429-spencer-microwave",
  "us-2524035-bardeen-transistor",
  "us-2929922-townes-laser",
  "us-2981877-noyce-ic",
  "us-307031-edison-indicator",
  "us-31128-otis-elevator",
  "us-3138743-kilby-integrated-circuit",
  "us-319596-maxim-machine-gun",
  "us-3237-rillieux-evaporator",
  "us-3353115-maiman-ruby-laser",
  "us-347140-thomson-welding",
  "us-3541541-engelbart-mouse",
  "us-361931-daimler-engine",
  "us-3633-goodyear-rubber",
  "us-3671542-kwolek-kevlar",
  "us-36836-gatling-gun",
  "us-381968-tesla-motor",
  "us-3858232-boyle-smith-ccd",
  "us-388850-eastman-kodak",
  "us-395781-hollerith-tabulating",
  "us-400766-hall-aluminium",
  "us-4136359-wozniak-apple",
  "us-470918-reno-escalator",
  "us-4750-howe-sewing-machine",
  "us-48475-yale-lock",
  "us-586193-marconi-radio",
  "us-588-ericsson-propeller",
  "us-593138-tesla-coil",
  "us-608969-parsons-turbine",
  "us-613809-tesla-teleautomaton",
  "us-6162-corliss-steam-engine",
  "us-621195-zeppelin-airship",
  "us-6285999-pagerank",
  "us-6331181-davinci",
  "us-6469-lincoln-buoy",
  "us-6594844-roomba",
  "us-682690-hewitt-mercury-lamp",
  "us-727650-linde-air-liquefaction",
  "us-7479949-multitouch",
  "us-78317-nobel-dynamite",
  "us-79265-sholes-typewriter",
  "us-808897-carrier-air-conditioner",
  "us-821393-wright-flyer",
  "us-879532-de-forest-audion",
  "us-942699-baekeland-bakelite",
  "us-971501-haber-ammonia",
  "us-x1-hopkins-potash",
  "us-x72-whitney-cotton-gin",
  "us-x8277-mccormick-reaper",
  "us-x9430-colt-revolver",
] as const;

describe("root editorial hold history", () => {
  test("keeps every inherited root-QA hold out of the accepted source face", () => {
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

  test("keeps the historical hold list intact as a QA record", () => {
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...REQUIRED_ROOT_EDITORIAL_HOLDS].map(String).sort(),
    );
    for (const patentId of SOURCE_QA_RELEASED_EDITIONS) {
      expect(ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS).not.toContain(patentId);
    }
  });
});
