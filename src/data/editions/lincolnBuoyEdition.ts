import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const FIGURE_PREVIEWS = {
  1: {
    src: "/patents/figures/us-6469-lincoln-buoy-fig-1-hover.png",
    alt: "US 6,469, Figure 1: side elevation of Lincoln's vessel with the buoyant chambers expanded.",
    width: 2100,
    height: 780,
  },
  2: {
    src: "/patents/figures/us-6469-lincoln-buoy-fig-2-hover.png",
    alt: "US 6,469, Figure 2: transverse section of a contracted buoyant chamber.",
    width: 900,
    height: 750,
  },
  3: {
    src: "/patents/figures/us-6469-lincoln-buoy-fig-3-hover.png",
    alt: "US 6,469, Figure 3: longitudinal vertical section through a buoyant chamber and receiving box.",
    width: 900,
    height: 750,
  },
} as const;

const figure = (number: keyof typeof FIGURE_PREVIEWS) => ({
  kind: "reference" as const,
  text: `Fig. ${number}`,
  href: `#lincoln-buoy-figure-${number}`,
  referenceType: "figure" as const,
  label: `Figure ${number} in the US 6,469 source drawing sheet`,
  figurePreviews: [FIGURE_PREVIEWS[number]],
});

const figures = (...numbers: (keyof typeof FIGURE_PREVIEWS)[]) => ({
  kind: "reference" as const,
  text: `Figs. ${numbers.join(" and ")}`,
  href: `#lincoln-buoy-figure-${numbers[0]}`,
  referenceType: "figure" as const,
  label: `Figures ${numbers.join(" and ")} in the US 6,469 source drawing sheet`,
  figurePreviews: numbers.map((number) => FIGURE_PREVIEWS[number]),
});

/**
 * A continuous, hand-prepared reading edition made from direct visual review
 * of all three pages of the US 6,469 local facsimile. The drawing sheet stays
 * source evidence; this edition does not reconstruct source-page layout.
 */
export const lincolnBuoyArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "0663103c4dc8e15ae66d7829ace7916bd4025bd1751afb8710fca8d3fdbf53be",
  preparedBy: "Classic Patents editorial agent (codex-juliet)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "ABRAHAM LINCOLN, OF SPRINGFIELD, ILLINOIS.",
        "BUOYING VESSELS OVER SHOALS.",
        "Specification forming part of Letters Patent No. 6,469, dated May 22, 1849; application filed March 10, 1849.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Side elevation, chambers expanded",
      description: literal(
        "A. Lincoln. Manner of buoying vessels. No. 6,469. Patented May 22, 1849. Side elevation of a vessel with the buoyant chambers expanded.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 2",
      title: "Transverse section, chambers contracted",
      description: literal(
        "A. Lincoln. Manner of buoying vessels. No. 6,469. Patented May 22, 1849. Transverse section with the buoyant chambers contracted.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 3",
      title: "Longitudinal vertical chamber section",
      description: literal(
        "A. Lincoln. Manner of buoying vessels. No. 6,469. Patented May 22, 1849. Longitudinal vertical section through a buoyant chamber and receiving box.",
      ),
    },
    { kind: "paragraph", inlines: literal("To all whom it may concern:") },
    {
      kind: "paragraph",
      inlines: literal(
        "Be it known that I, Abraham Lincoln, of Springfield, in the County of Sangamon, in the State of Illinois, have invented a new and improved manner of combining adjustable buoyant air chambers with a steamboat or other vessel for the purpose of enabling their draught of water to be readily lessened to enable them to pass over bars, or through shallow water, without discharging their cargoes; and I do hereby declare the following to be a full, clear, and exact description thereof, reference being had to the accompanying drawings making a part of this specification. Similar letters indicate like parts in all the figures.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The buoyant chambers A, A, which I employ, are constructed in such a manner that they can be expanded so as to hold a large volume of air when required for use, and can be contracted, into a very small space and safely secured as soon as their services can be dispensed with.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        figure(1),
        {
          kind: "text",
          text: ", is a side elevation of a vessel with the buoyant chambers combined therewith, expanded; ",
        },
        figure(2),
        {
          kind: "text",
          text: ", is a transverse section of the same with the buoyant chambers contracted. ",
        },
        figure(3),
        {
          kind: "text",
          text: ", is a longitudinal vertical section through the centre of one of the buoyant chambers, and the box B, for receiving it when contracted, which is secured to the lower guard of the vessel.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The top g, and bottom h, of each buoyant chamber, is composed of plank or metal, of suitable strength and stiffness, and the flexible sides and ends of the chambers, are composed of ",
        },
        {
          kind: "term",
          text: "india-rubber cloth",
          definition:
            "Waterproof fabric coated or made with natural rubber; Lincoln permits another suitable waterproof fabric.",
        },
        {
          kind: "text",
          text: ", or other suitable water-proof fabric, securely united to the edges and ends of the top and bottom of the chambers.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The sides of the chambers may be stayed and supported centrally by a frame k, as shown in ",
        },
        figure(3),
        {
          kind: "text",
          text: ", or as many stays may be combined with them as may be necessary to give them the requisite fullness and strength when expanded.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The buoyant chambers are suspended and operated as follows: A suitable number of vertical shafts or spars D, D, are combined with each of the chambers, as represented in ",
        },
        figures(2, 3),
        {
          kind: "text",
          text: ", to wit: The shafts work freely in apertures formed in the upper sides of the chambers, and their lower ends are permanently secured to the under sides of the chambers: The vertical shafts or spars (D, D,) pass up through the top of the boxes B, B, on the lower guards of the vessel, and then through its upper guards, or some other suitable support, to keep them in a vertical position.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The vertical shafts (D, D,) are connected to the main shaft C, which passes longitudinally through the centre of the vessel—just below its upper deck—by endless ropes f, f, as represented in ",
        },
        figure(2),
        {
          kind: "text",
          text: ": The said ropes, f, f, being wound several times around the main shaft C, then passing outwards over sheaves or rollers attached to the upper deck or guards of the vessel, from which they descend along the inner sides of the vertical shafts or spars D, D, to sheaves or rollers connected to the boxes B, B, and thence rise to the main shaft (C,) again.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The ropes f, f, are connected to the vertical shafts at i, i, as shown in ",
        },
        figures(1, 2),
        {
          kind: "text",
          text: ". It will therefore be perceived, that by turning the main shaft C, in one direction, the buoyant chambers will be expanded into the position shown in ",
        },
        figure(1),
        {
          kind: "text",
          text: "; and by turning the shaft in an opposite direction, the chambers will be contracted into the position shown in ",
        },
        figure(2),
        { kind: "text", text: "." },
      ],
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "In " },
        figure(3),
        { kind: "text", text: ", e, e, are " },
        {
          kind: "term",
          text: "check ropes",
          definition:
            "Ropes that restrain the chamber's upper side so that lowering its bottom opens the chamber.",
        },
        {
          kind: "text",
          text: ", made fast to the tops of the boxes B, B, and to the upper sides of the buoyant chambers; which ropes catch and retain the upper sides of the chambers when their lower sides are forced down, and cause the chambers to be expanded to their full capacity. By varying the length of the check ropes, the depth of immersion of the buoyant chambers can be governed. A suitable number of openings m, m, are formed in the upper sides of the buoyant chambers, for the admission and emission of air when the chambers are expanded and contracted.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The ropes f, f, that connect the main shaft C, with the shafts or spars D, D, (rising from the buoyant chambers,) may be passed from one to the other in any direction that may be deemed best, and that will least incommode the deck of the vessel; or other mechanical means may be employed as the medium of communication between the main shaft and the buoyant chambers, if it should be found expedient.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I shall generally make the main shaft C, in as many parts as there are corresponding pairs of buoyant chambers, so that by coupling the sections of the shaft together, the whole of the chambers can be expanded at the same time, and by disconnecting them, either pair of chambers can be expanded, separately from the others as circumstances may require.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The buoyant chambers may be operated by the power of the steam engine applied to the main shaft C, in any convenient manner, or by man power.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "Where the " },
        {
          kind: "term",
          text: "guards",
          definition:
            "The projecting deck-edge structures of a vessel. Lincoln uses lower and upper guards as support locations.",
        },
        {
          kind: "text",
          text: " of a vessel are very high above the water, the boxes B, B, for the reception of the buoyant chambers when contracted, may be dispensed with, and the chambers be contracted by drawing them against the under side of the guards. Or, protecting cases may be secured to the under sides of the guards for the reception of the buoyant chambers when contracted.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "When it is desired to combine my expansible buoyant chambers with vessels which have no projecting guards; shelves or cases must be strongly secured to their sides for the reception of the buoyant chambers.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "I wish it to be distinctly understood, that I do not intend to limit myself to any particular mechanical arrangement, in combining expansible buoyant chambers with a vessel, but shall vary the same as I may deem expedient, whilst I attain the same end by substantially the same means.",
      ),
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "What I claim as my invention and desire to secure by letters patent, is the combination of expansible buoyant chambers placed at the sides of a vessel, with the main shaft or shafts C, by means of the sliding spars or shafts D, which pass down through the buoyant chambers and are made fast to their bottoms, and the series of ropes and pullies, or their equivalents, in such a manner that by turning the main shaft or shafts in one direction, the buoyant chambers will be forced downwards into the water and at the same time expanded and filled with air for buoying up the vessel by the displacement of water; and by turning the shaft in an opposite direction, the buoyant chambers will be contracted into a small space and secured against injury.",
      ),
    },
    { kind: "paragraph", inlines: literal("A. LINCOLN. Witness: Z. C. ROBBINS, H. H. SYLVESTER.") },
  ],
};

/**
 * Paragraph companions prepared alongside the source nodes. They are kept
 * patent-local until CopperGrove elects to merge them into the shared reader
 * registry, which is deliberately outside this Bead's file lane.
 */
export const lincolnBuoyParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: [
    "This conventional notice addresses any person who may need to identify the legal instrument.",
  ],
  5: [
    "Lincoln identifies himself, his Springfield residence, and the stated job: let a steamboat or other vessel reduce its draught without unloading cargo. He treats the drawings as part of the specification, and the letter labels as a shared map across the figures.",
  ],
  6: [
    "Chambers A can do two opposite jobs. Expanded, they contain a large air volume and displace more water. Contracted, they occupy little space and can be safely stowed when their lift is not needed.",
  ],
  7: [
    "Figure 1 is the expanded side view; Figure 2 is the contracted cross-section; Figure 3 cuts lengthwise through one chamber and its receiving box B. These are three views of the same mechanism, not three alternative inventions.",
  ],
  8: [
    "Each chamber has stiff faces, g above and h below, but flexible waterproof walls. The rigid faces give the chamber something for the drive and guides to push against; the flexible enclosure permits its volume to change.",
  ],
  9: [
    "Frame k, or enough equivalent stays, prevents the flexible chamber sides from collapsing inward when expanded. Lincoln specifies the functional result: adequate fullness and strength.",
  ],
  10: [
    "Vertical spars D pass through holes in the upper chamber sides but attach permanently to the bottoms. They also pass through box B and the vessel's guards, so the moving bottom follows a vertical path rather than swinging freely.",
  ],
  11: [
    "Main shaft C runs along the vessel below the upper deck. Endless ropes f wrap around C, go outward over deck or guard sheaves, descend beside D, return through sheaves at boxes B, and rise to C again. The arrangement converts shaft rotation into a balanced vertical pull.",
  ],
  12: [
    "Ropes f attach at i. Turning C one way opens the chamber into Figure 1's working position; reversing C returns it to Figure 2's compact position. This reversible travel is an express part of the described operation.",
  ],
  13: [
    "Check ropes e retain the chamber's upper side while the mechanism forces its lower side down. Their selected length controls how deeply the chamber can be immersed. The openings m let ordinary air enter or leave as volume changes.",
  ],
  14: [
    "Lincoln permits the rope route to be chosen to avoid obstructing the deck. He also permits another mechanical communication between C and the chambers, but identifies the same functional connection: the main shaft must operate the buoyant chambers.",
  ],
  15: [
    "A segmented main shaft lets the operator couple all chamber pairs for simultaneous expansion or disconnect sections to expand one pair independently. This is a control option for different grounding circumstances.",
  ],
  16: [
    "The source permits steam-engine power or human power. It does not require either one, so the claimed mechanism is not limited to a particular prime mover.",
  ],
  17: [
    "With high guards, box B can be omitted and the chamber can be drawn against the guards. A protecting case can replace the box. These are stowage alternatives for the contracted chamber, not a change in its buoyancy function.",
  ],
  18: [
    "A vessel without projecting guards needs firmly attached shelves or cases to receive the chambers. Lincoln therefore identifies a mounting condition, rather than assuming every vessel already has suitable overhangs.",
  ],
  19: [
    "Lincoln says he does not confine himself to one exact mechanical arrangement if substantially the same means attain the same end. That reservation appears in the description; the legal boundary remains the printed claim that follows.",
  ],
  21: [
    "The printed execution names A. Lincoln and witnesses Z. C. Robbins and H. H. Sylvester. The witnesses attest execution; the source does not present them as co-inventors.",
  ],
};

export function manualLincolnClaimText(claimNumber: number): string {
  const claimBlock = lincolnBuoyArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (claimBlock?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Lincoln Buoy archival edition`);
  }
  return claimBlock.inlines.map((inl) => inl.text).join("");
}
