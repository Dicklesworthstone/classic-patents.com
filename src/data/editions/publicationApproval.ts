/**
 * Root-owned editorial holds for source editions that have not passed final
 * facsimile, transcript, claim, figure, and companion-reading acceptance.
 *
 * A patent-local author may prepare an edition and export a companion map, but
 * only final QA may remove an id from this list. Keeping the decision outside
 * the registry prevents a bulk map merge from making a draft visitor-facing.
 */

import type { Patent } from "@/types/patent";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";

export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
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
  "us-808897-carrier-air-conditioner",
  "us-x1-hopkins-potash",
  "us-135245-pasteur-fermentation",
  "us-2495429-spencer-microwave",
  "us-879532-de-forest-audion",
  "us-971501-haber-ammonia",
  "us-6120588-eink",
  "us-6285999-pagerank",
  "us-6331181-davinci",
  "us-6594844-roomba",
  "us-7479949-multitouch",
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  return ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS.some((withheldId) => withheldId === patentId);
}

export function archivalEditionForPublication(patent: Pick<Patent, "id" | "archivalEdition">) {
  return patent.archivalEdition &&
    !isArchivalEditionExplicitlyWithheld(patent.id) &&
    ARCHIVAL_PARALLEL_READINGS[patent.id]
    ? patent.archivalEdition
    : undefined;
}
