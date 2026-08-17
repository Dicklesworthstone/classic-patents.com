/**
 * Page counts for complete text layers extracted directly from the local source
 * PDFs. These are deliberately distinct from reviewed OCR transcriptions: the
 * visitor is told that they are machine-extracted and can compare them against
 * the source facsimile page-for-page.
 *
 * Records are omitted when the local PDF is known to identify a different
 * document, or when it has no usable text layer. They must never fall back to
 * an editorial excerpt and pretend to be complete.
 */
export const sourcePdfTextPageCounts: Readonly<Record<string, number>> = {
  "us-x8277-mccormick-reaper": 3,
  "us-138-colt-revolver": 2,
  "us-132-davenport-electric-motor": 3,
  "us-588-ericsson-propeller": 5,
  "us-1647-morse-telegraph": 9,
  "us-3633-goodyear-rubber": 2,
  "us-4750-howe-sewing-machine": 6,
  "us-6162-corliss-steam-engine": 8,
  "us-31128-otis-elevator": 3,
  "us-36836-gatling-gun": 3,
  "us-78317-nobel-dynamite": 2,
  "us-79265-sholes-typewriter": 6,
  "us-105338-hyatt-celluloid": 1,
  "us-120057-gramme-dynamo": 9,
  "us-124404-westinghouse-air-brake": 4,
  "us-135245-pasteur-fermentation": 3,
  "us-157124-glidden-barbed-wire": 2,
  "us-174465-bell-telephone": 6,
  "us-194047-otto-engine": 8,
  "us-200521-edison-phonograph": 3,
  "us-223898-edison-lightbulb": 4,
  "us-233692-pelton-water-wheel": 3,
  "us-247804-delaval-separator": 3,
  "us-313224-mergenthaler-linotype": 35,
  "us-319596-maxim-machine-gun": 5,
  "us-347140-thomson-welding": 5,
  "us-361931-daimler-engine": 6,
  "us-381968-tesla-motor": 9,
  "us-388850-eastman-kodak": 9,
  "us-395781-hollerith-tabulating": 17,
  "us-470918-reno-escalator": 4,
  "us-542846-diesel-engine": 10,
  "us-586193-marconi-radio": 11,
  "us-608969-parsons-turbine": 7,
  "us-613809-tesla-teleautomaton": 13,
  "us-621195-zeppelin-airship": 7,
  "us-727650-linde-air-liquefaction": 5,
  "us-808897-carrier-air-conditioner": 4,
  "us-821393-wright-flyer": 10,
  "us-1773980-farnsworth-tv": 13,
  "us-1781541-einstein-refrigerator": 4,
  "us-2292387-lamarr-frequency-hopping": 7,
  "us-2495429-spencer-microwave": 3,
  "us-2708656-fermi-reactor": 58,
  "us-2981877-noyce-ic": 8,
  "us-3541541-engelbart-mouse": 7,
  "us-3671542-kwolek-kevlar": 58,
  "us-4136359-wozniak-apple": 7,
};
