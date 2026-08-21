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
  "us-x9430-colt-revolver", // Broad division crops clip neighboring figures and labels.
  "us-31128-otis-elevator", // Fig. 1 is sideways; Figs. 2–3 are contaminated or clipped.
  "us-79265-sholes-typewriter", // Fig. 2 omits its label; Fig. 5 includes header and Fig. 6.
  "us-319596-maxim-machine-gun", // Figs. 1–2 are sideways and include formal/neighbor matter.
  "us-3237-rillieux-evaporator",
  "us-48475-yale-lock",
  "us-120057-gramme-dynamo", // Fig. 1/10 include neighbor fragments; Fig. 7 includes Fig. 9 and witness/signature matter.
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
  "us-621195-zeppelin-airship", // Source edition remains unbound and has unresolved drawing/crop coverage.
  "us-2708656-fermi-reactor", // Specification is staged, but drawing sheets 1–27 and preview acceptance remain incomplete.
  "us-3541541-engelbart-mouse", // Reviewed ledger/source edition remains incomplete and unbound.
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
  "us-388850-eastman-kodak", // Sampled Figs. 1, 6, and 11 include masthead or neighboring drawings.
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
  "us-821393-wright-flyer", // Exemplar Figs. 3–5 are contaminated, clipped, or sideways.
  "us-593138-tesla-coil", // All served figures are sideways; Fig. 1 also includes masthead and signatures.
  "us-808897-carrier-air-conditioner", // Figs. 4 and 6 include neighboring figures and inventor/signature matter.
  "us-4136359-wozniak-apple", // Figs. 1 and 3 include sheet headers; Fig. 1 also clips the lower diagram.
  "us-157124-glidden-barbed-wire", // All three served figure previews are rotated sideways.
  "us-x1-hopkins-potash", // Record invents an apparatus drawing/callouts and precise process numbers absent from the one-page grant.
  "us-135245-pasteur-fermentation", // Source repair awaits executable and independent visitor acceptance.
  "us-4750-howe-sewing-machine", // Claims 2–5 have lossy sub-30-word decoders.
  "us-200521-edison-phonograph", // Claim 3 decoder is materially too short.
  "us-2495429-spencer-microwave", // Public visuals model a later countertop oven instead of the patented dual-magnetron conveyor apparatus.
  "us-307031-edison-indicator", // Claims 3–8 have lossy sub-30-word decoders.
  "us-361931-daimler-engine", // Claims 2–10 have lossy sub-30-word decoders.
  "us-879532-de-forest-audion", // Multiple claim decoders fail the non-lossy length floor.
  "us-942699-baekeland-bakelite", // Claim 5 decoder is materially too short.
  "us-971501-haber-ammonia", // All six claim decoders are materially too short.
  "us-6120588-eink", // All 18 claim decoders are terse labels rather than explanations.
  "us-6285999-pagerank", // All 29 claim decoders are terse labels rather than explanations.
  "us-6331181-davinci", // All 28 claim decoders are terse labels rather than explanations.
  "us-6594844-roomba", // All 20 claim decoders fail the non-lossy length floor.
  "us-7479949-multitouch", // All 20 claim decoders fail the non-lossy length floor.
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
