import type { ArchivalParallelReading } from "./parallelReadings";

/** Patent-local companions keyed only to paragraph blocks in the manual edition. */
export const pasteurFermentationParallelReadings: Readonly<
  Record<number, ArchivalParallelReading>
> = {
  1: ["This conventional address begins the specification. It makes no technical claim by itself."],
  2: [
    "Pasteur identifies the French grant of June 28, 1871 and makes the labeled drawing part of his description. The local source PDF is a U.S. grant dated January 28, 1873.",
  ],
  3: [
    "The prior practice was to let boiled wort meet ordinary air during cooling. Pasteur says that exposure reduces both beer quality and the quantity made from a given amount of wort.",
  ],
  4: [
    "His stated solution is not a heat-hold pasteurization step. He wants the hot wort in a closed vessel, air expelled, and the vessel exterior cooled by sprayed water.",
  ],
  5: [
    "This paragraph begins the apparatus description. Fig. 1 shows three vessels A on stands b, water pipe E, branch valves r, flexible hoses, and the spray nozzles P.",
  ],
  6: [
    "Generator M M makes carbonic-acid gas, now called carbon dioxide. It supplies the vessels through the tubes marked w so the gas can displace air before cooling.",
  ],
  7: [
    "The exit tubing a′ dips into water cups v. That permits gas to leave while also providing a place from which it can be collected in a gasometer.",
  ],
  8: [
    "Only one gas connection is drawn to avoid visual clutter. Pasteur says the other vessels may have the same connection.",
  ],
  9: [
    "Nozzles P spray water centrally over domed vessel tops. The dotted lines in Fig. 1 show a falling water film that runs down the outside wall and removes heat.",
  ],
  10: [
    "The circular trough catches the cooling water. Tube i and discharge trough c carry it away; this is a recirculation or disposal path, not a product path.",
  ],
  11: [
    "R′ is the outlet cock used to transfer contents; R is the faucet for dispensing beer left in vessel A. The prime mark distinguishes the two valves.",
  ],
  12: [
    "Fig. 2 is an alternate vessel B with removable top and conventional instrumentation and access openings. It is a vessel variation, not a different process claim.",
  ],
  13: [
    "The operating sequence is explicit: put boiling-hot wort in A; flow carbon dioxide to expel air; spray water outside; then add yeast at 16°–18° Réaumur, or 20°–22.5 °C. The first fermentation can be followed by transfer to barrels for further fermentation.",
  ],
  14: [
    "If beer remains in A, it can finish fermenting there and later leave through R. If more air is desirable for first fermentation, Pasteur says to heat it in a tube or filter it through cotton first; this is an optional instruction, not a separate claim.",
  ],
  15: [
    "The pictured equipment is sized for about one barrel, but Pasteur expressly says capacity can be varied. The claim therefore speaks in terms of a process rather than a fixed tank size.",
  ],
  16: [
    "Carbon dioxide generated during fermentation may be collected in a gasometer and reused with or instead of generator gas. The patent stresses thorough gas penetration to remove contained air.",
  ],
  17: [
    "Pasteur attributes several results to the process: no usual cooling vessels, less evaporation loss, improved quality and alcoholic gradation, and more output from the same material. These are asserted results, not measured values in the grant.",
  ],
  18: [
    "The final descriptive paragraph says the product is more resistant to change during transport, aromatic, and limpid, meaning clear. It does not claim a modern microbiological sterilization result.",
  ],
  21: ["This is Pasteur's signature, immediately following the single printed claim."],
  22: [
    "The document records its execution date, December 8, 1871, and names Cayon and Grenet Fyre as witnesses.",
  ],
};
