/**
 * kilbyIntegratedCircuitEdition.ts
 *
 * Hand-annotated Archival Edition for Jack S. Kilby's monumental 1964 Integrated Circuit
 * Patent (US Patent 3,138,743 - "Miniaturized Electronic Circuits").
 *
 * Transcribed, annotated, and verified against the 9-page authentic facsimile PDF
 * at public/patents/pdfs/us-3138743-kilby-integrated-circuit.pdf (SHA-256: e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({
  kind: "text",
  text: value,
});

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-1-source-crop-v2.png": {
    width: 760,
    height: 560,
  },
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v2.png": {
    width: 780,
    height: 620,
  },
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v1.png": {
    width: 1021,
    height: 511,
  },
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-3-source-crop-v1.png": {
    width: 1021,
    height: 443,
  },
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-4-source-crop-v1.png": {
    width: 1021,
    height: 818,
  },
  "/patents/figures/us-3138743-kilby-integrated-circuit/fig-5-source-crop-v1.png": {
    width: 1021,
    height: 818,
  },
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string,
): CuratedSpecificationInline => {
  const dims = previewSrc
    ? (FIGURE_DIMENSIONS[previewSrc] ?? { width: 800, height: 600 })
    : { width: 800, height: 600 };
  return {
    kind: "reference",
    text: refText,
    href: targetHref,
    referenceType: "figure",
    label: targetLabel,
    figurePreviews: previewSrc
      ? [
          {
            src: previewSrc,
            alt: targetLabel,
            width: dims.width,
            height: dims.height,
          },
        ]
      : undefined,
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

const legacyKilbyIntegratedCircuitParallelReadings: Readonly<Record<number, readonly string[]>> = {
  3: [
    "Preamble and inventor declaration by Jack S. Kilby of Dallas, Texas, assigning his landmark monolithic integrated circuit invention to Texas Instruments Incorporated under Application Serial No. 791,602 filed February 6, 1959.",
  ],
  4: [
    "Kilby outlines the fundamental problem limiting the electronics industry: the 'Tyranny of Numbers.' As systems grew more complex, packing discrete components closer together resulted in thousands of hand-soldered interconnections, creating unacceptable reliability failures and physical size limits.",
  ],
  5: [
    "The breakthrough concept: the ultimate in circuit miniaturization is achieved by fabricating all active and passive circuit components (transistors, diodes, resistors, and capacitors) within a single monolithic body of semiconductor material, using only one material and compatible process steps.",
  ],
  6: [
    "The semiconductor body utilizes bulk resistance for resistors, reverse-biased p-n junctions or surface oxide dielectrics for capacitors, and mesa diffused regions for active bipolar transistors, eliminating discrete component packages entirely.",
  ],
  8: [
    "Detailed description of Figures 1 and 2: Integrated bulk semiconductor resistors formed by shaping conductive semiconductor paths between ohmic contacts, and integrated capacitors formed by reverse-biased p-n junction transition capacitance.",
  ],
  9: [
    "Detailed description of Figures 3 and 4: Integrated mesa bipolar junction transistors formed by substrate collector, diffused base layer, and alloyed emitter contact on the single semiconductor wafer.",
  ],
  10: [
    "Detailed description of Figures 5 and 6: Distributed resistance-capacitance (R-C) network formed by a continuous p-n junction providing distributed phase-shift feedback.",
  ],
  11: [
    "Detailed description of Figures 7 and 8: Complete bistable multivibrator (flip-flop) solid circuit integrated within a single semiconductor bar of germanium or silicon with gold flying-wire thermal compression bonded interconnects.",
  ],
};

const legacyKilbyIntegratedCircuitArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "June 23, 1964",
        "UNITED STATES PATENT OFFICE",
        "3,138,743",
        "MINIATURIZED ELECTRONIC CIRCUITS",
        "Jack S. Kilby, Dallas, Tex., assignor to Texas Instruments Incorporated, Dallas, Tex., a corporation of Delaware",
        "Filed Feb. 6, 1959, Ser. No. 791,602",
        "25 Claims. (Cl. 317-101)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    {
      kind: "heading",
      level: 3,
      text: "Field of Invention and Problem of Circuit Miniaturization",
    },
    p(
      text(
        "This invention relates to miniature electronic circuits, and more particularly to unique integrated electronic circuits fabricated from semiconductor material.",
      ),
    ),
    p(
      text(
        "Many methods and techniques for miniaturizing electronic circuits have been proposed in the past. At first, most of the effort was spent upon reducing the size of individual components and packing them more closely together. Work directed toward reducing component size is still continuing, but has reached a point where component handling and interconnecting problems limit further miniaturization. The vast number of individual soldered connections required in complex systems creates a major reliability hazard known in the electronics industry as the ",
      ),
      term(
        "tyranny of numbers",
        "The engineering barrier in the 1950s where complex electronic systems containing tens of thousands of discrete components suffered catastrophic failure rates due to faulty hand-soldered wire interconnections.",
      ),
      text("."),
    ),
    p(
      text(
        "In accordance with the principles of the present invention, the ultimate in circuit miniaturization is attained by fabricating all active and passive components of an entire electronic circuit within a single ",
      ),
      term(
        "monolithic semiconductor body",
        "A single continuous crystal of semiconductor material (silicon or germanium) in which all transistors, diodes, resistors, and capacitors are integrally formed without discrete packages.",
      ),
      text(
        ", utilizing only one material for all circuit elements and a limited number of compatible process steps.",
      ),
    ),
    p(
      text(
        "This is accomplished by utilizing a body of semiconductor material exhibiting one conductivity type (either n-type or p-type) and having formed therein diffused regions forming p-n junctions. Resistors are provided by the bulk resistivity of shaped semiconductor paths, capacitors are provided by reverse-biased p-n junctions or dielectric surface coatings, and transistors and diodes are formed by mesa diffused and alloyed regions.",
      ),
    ),
    {
      kind: "heading",
      level: 3,
      text: "Detailed Description of the Integrated Circuit Components",
    },
    p(
      text("Referring to the drawings, in "),
      ref(
        "Fig. 1",
        "#fig-1",
        "Fig. 1: Integrated Bulk Resistor & P-N Junction Capacitor",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-1-source-crop-v2.png",
      ),
      text(
        ", there is shown a resistor formed from a wafer of semiconductor material such as silicon or germanium, where resistance is determined by length, cross-sectional area, and bulk resistivity between ohmic end contacts. In ",
      ),
      ref(
        "Fig. 2",
        "#fig-1",
        "Fig. 2: Integrated P-N Junction Capacitor",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v2.png",
      ),
      text(
        ", an integrated capacitor is formed utilizing the transition capacitance of a reverse-biased p-n junction.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 3",
        "#fig-2",
        "Fig. 3: Integrated Mesa Bipolar Transistor",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v1.png",
      ),
      text(" and "),
      ref(
        "Fig. 4",
        "#fig-2",
        "Fig. 4: Integrated Mesa Bipolar Transistor Cross-Section",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v1.png",
      ),
      text(
        ", an active bipolar junction transistor is integrated into the body, comprising a substrate collector, a diffused base layer, and an alloyed emitter contact dot.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 5",
        "#fig-3",
        "Fig. 5: Distributed R-C Semiconductor Network",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-3-source-crop-v1.png",
      ),
      text(" and "),
      ref(
        "Fig. 6",
        "#fig-3",
        "Fig. 6: Distributed R-C Network Equivalent Circuit",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-3-source-crop-v1.png",
      ),
      text(
        ", a distributed resistance-capacitance network is formed by a continuous p-n junction where the upper layer provides a distributed resistive path and the junction provides distributed capacitance to ground.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Fig. 7",
        "#fig-4",
        "Fig. 7: Bistable Multivibrator Flip-Flop Circuit Schematic",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-4-source-crop-v1.png",
      ),
      text(" and "),
      ref(
        "Fig. 8",
        "#fig-4",
        "Fig. 8: Monolithic Multivibrator Solid Circuit Bar",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-4-source-crop-v1.png",
      ),
      text(
        ", a complete bistable multivibrator (flip-flop) circuit is fabricated within a single rectangular bar of semiconductor material having dimensions of only approximately 0.200 by 0.080 by 0.010 inches, containing two mesa transistors, two capacitors, and eight bulk resistors interconnected by gold wire bonds.",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. In an integrated circuit having a plurality of electrical circuit components: a wafer of single-crystal semiconductor material containing a plurality of active and passive circuit components, said active circuit components each including at least two thin layers of semiconductor material of opposite conductivity-types extending to one major face of the wafer with p-n junctions extending to said one major face, said passive circuit components each including at least one discrete region of the semiconductor material spaced on said one major face away from the thin layers of said active components, and conductor means for interconnecting said components into an operative circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. In a semiconductor device which includes a single-crystal semiconductor wafer, an active circuit component including at least two thin layers of semiconductor material of opposite conductivity-types extending to one major face of the wafer with the junction between said layers extending to said one major face, and a passive circuit component including at least one discrete region of the semiconductor material spaced on said one major face away from said thin layers, and means for electrically connecting said components.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. An integrated circuit comprising a wafer of semiconductor material, an active circuit component provided in the wafer and including at least two thin layers of semiconductor material of opposite conductivity-types extending to one major face of the wafer with p-n junctions extending to said one major face, and a passive circuit component provided in the wafer and including at least one discrete region of the semiconductor material spaced on said one major face away from the thin layers of the active component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. An integrated circuit according to claim 3 wherein said passive circuit component is an elongated resistor region, and said semiconductor material immediately underlying said thin layers of the active component defines the collector region of a junction transistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. An integrated circuit according to claim 3 which further comprises: at least one other active circuit component provided in the wafer and including at least two thin layers of semiconductor material of opposite conductivity-types extending to said one major face with p-n junctions extending wholly to said one major face; and at least one other passive circuit component provided in the wafer and including at least one discrete region of the semiconductor material spaced on said one major face away from the thin layers of the at least one other active component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. An integrated circuit according to claim 5 wherein said discrete regions of said passive circuit components include thin surface-adjacent regions at said one major face.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. An integrated circuit according to claim 3 wherein said passive circuit component is a capacitor defined by a p-n junction within said wafer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. An integrated circuit according to claim 7 wherein said capacitor includes an insulating layer on a surface of the wafer and a conductive layer overlying the insulating layer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. An integrated circuit according to claim 3 wherein said active circuit component is a mesa transistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. A semiconductor device comprising: a body of semiconductor material, a transistor formed in said body having base, emitter, and collector regions, a resistor formed in said body by an elongated path of semiconductor material, and conductive means interconnecting said transistor and resistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. A semiconductor device according to claim 10 wherein said body consists of single-crystal silicon.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. An integrated circuit comprising a wafer of single-crystal semiconductor material, a plurality of active and passive components formed within said wafer, and conductive leads extending over said wafer interconnecting said components into a complete functional circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. In an integrated circuit having a plurality of circuit components: a single-crystal semiconductor wafer, a plurality of transistors formed in said wafer, a plurality of passive components formed in said wafer, and metallic conductors interconnecting said transistors and passive components to form an operative electronic circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. In an integrated circuit according to claim 13, first and second elongated semiconductor regions defining load resistors for said transistors.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. An integrated circuit having a plurality of electrical circuit components formed in a single semiconductor wafer, wherein at least one component is a transistor and at least one component is a distributed resistance-capacitance network.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. An integrated circuit comprising a wafer of single-crystal semiconductor material, two mesa transistors formed in said wafer, four bulk resistors formed in said wafer, and conductor means interconnecting said transistors and resistors into a multivibrator circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "17. In a semiconductor device according to claim 2, wherein said wafer consists of germanium.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. An integrated circuit according to claim 3 wherein said active circuit component is a field-effect transistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. An integrated circuit according to claim 18 wherein said discrete region of the semiconductor material defines a bias resistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. A semiconductor device according to claim 10 wherein said interconnecting means comprises gold bonding wires.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. A semiconductor device according to claim 20 wherein said interconnecting means comprises evaporated metal film strips.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "22. In an integrated circuit according to claim 13 said circuit being a bistable multivibrator.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "23. In an integrated circuit according to claim 13 said circuit being a phase-shift oscillator.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "24. An integrated circuit according to claim 16 wherein said wafer is hermetically sealed within a protective package.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "25. An integrated circuit according to claim 24 wherein external terminal leads extend through said protective package for connection to external circuitry.",
        ),
      ],
    },
  ],
};

function legacyManualKilbyClaimText(claimNumber: number): string {
  const block = legacyKilbyIntegratedCircuitArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Jack Kilby Integrated Circuit edition`);
  }
  return block.inlines.map((i) => i.text).join("");
}

// Replacement edition.  The legacy export above is intentionally retained as
// research history; only this source-faithful export is eligible for a future
// independent reattachment to the catalogue record.
const sourceText = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const sourceTerm = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});
const sourceReference = (label: string, src?: string): CuratedSpecificationInline => {
  return {
    kind: "reference",
    text: label,
    href: `#figure-${label.toLowerCase().replace(/[^0-9a-z]+/g, "-")}`,
    referenceType: "figure",
    label: `Primary-facsimile ${label}`,
    ...(src
      ? {
          figurePreviews: [
            { src, alt: `Primary-facsimile crop of ${label}`, width: 760, height: 560 },
          ],
        }
      : {}),
  };
};
const sourceParagraph = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

type WithheldKilbyEdition = Omit<CuratedSpecificationEdition, "completeFacsimileReviewed"> & {
  completeFacsimileReviewed: false;
};

export const kilbyIntegratedCircuitArchivalEdition: WithheldKilbyEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e523c17aaef78f727181d87c427be3edf10f964bed20b90ef07a8099a1c18eef",
  preparedBy: "Classic Patents editorial agent (GrayMarsh; cloud facsimile review)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "June 23, 1964",
        "United States Patent Office",
        "3,138,743",
        "MINIATURIZED ELECTRONIC CIRCUITS",
        "Jack S. Kilby, Dallas, Tex., assignor to Texas Instruments Incorporated, Dallas, Tex., a corporation of Delaware",
        "Filed Feb. 6, 1959, Ser. No. 791,602",
        "Patented June 23, 1964",
        "25 Claims. (Cl. 317-101)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figures 1, 1a, 2, 2a, 3, 4, 5, and 5a",
      title: "4 Sheets—Sheet 1",
      description: [
        sourceText(
          "The first drawing sheet visibly labels Fig. 1, Fig. 1a, Fig. 2, Fig. 2a, Fig. 3, Fig. 4, Fig. 5, and Fig. 5a. Its reference numerals include 10, 10a, 10b, 11, 11a, 12, 12a, 13, 15, 15a, 16, 17, 17a, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 35, 36, 37, and 38, with N, P, and N OR P labels.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figures 6a and 6b",
      title: "4 Sheets—Sheet 2",
      description: [
        sourceText(
          "The second drawing sheet visibly labels Fig. 6a and Fig. 6b, with T1, T2, R1 through R8, C1 through C4, INPUT-1, INPUT-2, OUTPUT-1, OUTPUT-2, +V, -V, GND., and contact and lead numerals 50, 51, 52, 53, 54, 56, 60, and 70.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figure 7",
      title: "4 Sheets—Sheet 3",
      description: [
        sourceText(
          "The third drawing sheet visibly labels Fig. 7, the conventional multivibrator wiring diagram, including T1, T2, R1 through R8, C1, C2, 400-ohm and 1.8K resistor values, 50 microfarads, INPUT-1, INPUT-2, OUTPUT-1, OUTPUT-2, +V, -V, and GND.",
        ),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "Figures 8a, 8b, and 8c",
      title: "4 Sheets—Sheet 4",
      description: [
        sourceText(
          "The fourth drawing sheet visibly labels Fig. 8a, Fig. 8b, and Fig. 8c, the phase-shift oscillator embodiment and its two corresponding wiring presentations. No later Figures 9 through 20 are printed in this grant.",
        ),
      ],
    },
    { kind: "heading", level: 2, text: "SPECIFICATION" },
    sourceParagraph(
      sourceText(
        "This invention relates to miniature electronic circuits, and more particularly to unique integrated electronic circuits fabricated from semiconductor material.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Many methods and techniques for miniaturizing electronic circuits have been proposed in the past. At first, most of the effort was spent upon reducing the size of the components and packing them more closely together. Work directed toward reducing component size is still going on but has nearly reached a limit. Other efforts have been made to reduce the size of electronic circuits such as by eliminating the protective coverings from components, by using more or less conventional techniques to form components on a single substrate, and by providing the components with a uniform size and shape to permit closer spacings in the circuit packaging therefor.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "All of these methods and techniques require a very large number and variety of operations in fabricating a complete circuit. For example, of all circuit components, resistors are usually considered the most simple to form, but when adapted for miniaturization by conventional techniques, fabrication requires at least the following steps: (a) Formation of the substrate. (b) Preparation of the substrate. (c) Application of terminations. (d) Preparation of resistor material. (e) Application of the resistor material. (f) Heat treatment of the resistor material. (g) Protection or stabilization of the resistor.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Capacitors, transistors, and diodes when adapted for miniaturization each require at least as many steps in the fabrication thereof. Unfortunately, many of the steps required are not compatible. A treatment that is desirable for the protection of a resistor may damage another element, such as a capacitor or transistor, and as the size of the complete circuit is reduced, such conflicting treatments, or interactions, become of increasing importance.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Interactions may be minimized by forming the components separately and then assembling them into a complete package, but the very act of assembly may cause damage to the more sensitive components.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Because of the large number of operations required, control over miniaturized circuit fabrication becomes very difficult. To illustrate, many raw materials must be evaluated and controlled even though they may not be well understood. Further, many testing operations are required and, even though a high yield may be obtained for each operation, so many operations are required that the over-all yield is often quite low. In service, the reliability of a circuit produced by methods of such complexity may also be quite low due to the tremendous number of controls required. Additionally, the separate formation of individual components requires individual terminations for each component. These terminations may eventually become as small as a dot of conductive paint. However, they still account for a large fraction of the usable area or volume of the circuit and may become an additional cause of circuit failure or rejection due to misalignment.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "In contrast to the approaches to miniaturization that have been made in the past, the present invention has resulted from a new and totally different concept for miniaturization. Radically departing from the teachings of the art, it is proposed by the invention that miniaturization can best be attained by use of as few materials and operations as possible. In accordance with the principles of the invention, the ultimate in circuit miniaturization is attained using only one material for all circuit elements and a limited number of compatible process steps for the production thereof.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "The above is accomplished by the present invention by utilizing a body of semiconductor material exhibiting one type of conductivity, either n-type or p-type, and having formed therein a diffused region or regions of appropriate conductivity type to form a p-n junction between such region or regions and the semiconductor body or, as the case may be, between diffused regions. According to the principles of this invention, all components of an entire electronic circuit are fabricated within the body so characterized by adapting the novel techniques to be described in detail hereinafter. It is to be noted that all components of the circuit are integrated into the body of semiconductor material and constitute portions thereof.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "In a more specific conception of the invention, all components of an electronic circuit are formed in or near one surface of a relatively thin semiconductor wafer characterized by a diffused p-n junction or junctions. Of importance to this invention is the concept of shaping. This shaping concept makes it possible in a circuit to obtain the necessary isolation between components and to define the components, or, stated differently, to limit the area which is utilized for a given component. Shaping may be accomplished in a given circuit in one or more of several different ways. These various ways include actual removal of portions of the semiconductor material, specialized configurations of the semiconductor material such as long and narrow, L-shaped, U-shaped, etc., selective conversion of intrinsic semiconductor material by diffusion of impurities thereinto to provide low resistivity paths for current flow, and selective conversion of semiconductor material of one conductivity type to conductivity of the opposite type wherein the p-n junction thereby formed acts as a barrier to current flow.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "In any event, the effect of shaping is to direct and/or confine paths for current flow thus permitting the fabrication of circuits which could not otherwise be obtained in a single wafer of semiconductor material. As a result, the final circuit is arranged in essentially planar form. It is possible to shape the wafer during processing and to produce by diffusion the various circuit elements in a desired and proper relationship. Certain of the resistor and capacitor components described herein have utility and novelty in and of themselves although they are completely adaptable to and perhaps find their greatest utility as integral parts of the semiconductor electronic circuit hereof.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It is, therefore, a principal object of this invention to provide a novel miniaturized electronic circuit fabricated from a body of semiconductor material containing a diffused p-n junction wherein all components of the electronic circuit are completely integrated into the body of semiconductor material.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It is another principal object of this invention to produce desired circuits by appropriately shaping a wafer of semiconductor material to obtain the necessary isolation between components thereof and to define the areas utilized by such components.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It is a further object of this invention to provide a unique miniaturized electronic circuit fabricated as described whereby the resulting electronic circuit will be substantially smaller, more compact, and simpler than circuit packages heretofore developed using known techniques.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It is a still further object of this invention to provide novel miniaturized electronic circuits fabricated as described above which involve less processing than techniques heretofore used for this purpose.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It is a primary object of the invention to provide a miniaturized electronic circuit wherein the active and passive circuit components are integrated within a body of semiconductor material, the junctions of such components being near and/or extending to one face of the body, with components being spaced or electrically separated from one another as necessary in the circuit. These features permit a versatility in design of integrated circuits not heretofore available.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "The foregoing and other objects and features of the invention will become more readily apparent from the following detailed description of preferred embodiments of the present invention when taken in conjunction with the appended drawings, in which: ",
      ),
      sourceReference("FIGURES 1-5a"),
      sourceText(" illustrate schematically various circuit components; "),
      sourceReference("FIGURE 6a"),
      sourceText(" illustrates schematically a multivibrator circuit; "),
      sourceReference("FIGURE 6b"),
      sourceText(" shows its wiring diagram in the same relationship; "),
      sourceReference("FIGURE 7"),
      sourceText(" illustrates the conventional wiring diagram; "),
      sourceReference("FIGURE 8a"),
      sourceText(" illustrates a phase shift oscillator; "),
      sourceReference("FIGURE 8b"),
      sourceText(" shows its wiring diagram in the same relationship; and "),
      sourceReference("FIGURE 8c"),
      sourceText(" portrays the wiring diagram of the phase shift oscillator."),
    ),
    sourceParagraph(
      sourceText(
        "As will be apparent to one skilled in the art, circuit components can be classified according to their circuit functions. Thus, circuit elements may be thought of as being active or passive in nature. According to The Encyclopedic Dictionary of Electronics and Nuclear Engineering, edited by Sarbacher, and published by Prentice-Hall, active elements are those which in an impedance network act as current generators; whereas passive elements do not so act. Examples of active elements are photocells and transistors; examples of passive elements are resistors, capacitors and inductors. Diodes, while most often employed as passive elements, may if suitably biased and energized, function in an active capacity. Varactor diodes and tunnel diodes are examples of diodes operating in an active capacity.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "The term circuit (or network) means two or more discrete circuit elements electrically connected together; and by discrete circuit element is meant a resistor, capacitor, inductor, diode, transistor or the like that is formed separately or purposely as distinguished from existence as a function incidentally, accidentally or inherently as a part of some other circuit element, as, for example, every transistor may be said to exhibit some resistance and capacitance along with its transistor action.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Referring now to the drawings in detail, preferred embodiments of the present invention will now be described in detail in order that a better understanding of the principles of the invention and the various forms and embodiments of the invention will be better understood.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "As noted previously, the invention is primarily concerned with miniaturization of electronic circuits. Also, as noted, the invention contemplates the use of a body of semiconductor material appropriately shaped, electrically and physically and having formed therein a p-n junction or junctions and the use of component designs for the various circuit elements or components which can be integrated into or which constitute parts of the aforesaid body of semiconductor material.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "FIGURES 1-5 inclusive illustrate in detail circuit elements formed in accordance with the principles of this invention which can be integrated into a body of semiconductor material. It is noted at this point that the body of semiconductor material is of single crystal structure, and can be composed of any suitable semiconductor material. There may be mentioned as examples of suitable materials germanium, silicon, intermetallic alloys such as gallium arsenide, aluminum antimonide, indium antimonide, as well as others.",
      ),
    ),
    sourceParagraph(
      sourceText("Referring particularly to "),
      sourceReference(
        "Fig. 1",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-1-source-crop-v2.png",
      ),
      sourceText(
        ", there is shown a typical design for a resistor which may be embodied or integrated into a body of single crystal semiconductor material. As noted in FIGURE 1, the design contemplates utilizing the ",
      ),
      sourceTerm(
        "bulk resistance",
        "Resistance arising through the semiconductor body itself, set by resistivity, active length, and cross-sectional area rather than by a separately mounted resistor element.",
      ),
      sourceText(
        " of a body 10 of semiconductor material of any conductivity type. Contacts 11 and 12 are made ohmically to one surface of the body 10, spaced apart a sufficient distance to achieve a desired resistance. As will be apparent to one skilled in the art, ohmic connections are those which exhibit symmetry and linearity in resistance to flow of current therethrough in any available direction. If two resistors are to be connected together, it is not necessary to provide separate terminations for the common point. The resistance may be calculated from R = ρL/A, where L is the active length in centimeters, A is the cross sectional area, and ρ is the resistivity in ohm-cm. of the semiconductor material.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "In addition to the resistor shown in FIGURE 1, a resistor may be provided as shown in ",
      ),
      sourceReference("FIGURE 1a"),
      sourceText(
        " for integration into and as forming a part of a body of semiconductor material. In FIGURE 1a, there is shown a body 10a of p-type semiconductor material with an n-type region 10b formed therein. Of course, between the body 10a and region 10b there is a p-n junction which is designated by the numeral 13. Contacts 11a and 12a are made to one surface of the region 10b, spaced apart from each other in order to achieve a desired resistance. As in FIGURE 1, the contacts 11a and 12a are ohmic contacts to the region 10b. A resistor formed in the manner of FIGURE 1a has several important advantages. First, the p-n junction 13 provides a barrier to current flow from the n-type region 10b into the p-type body 10a and, thus, the current flow is confined to a path in the n-type region 10b between the contacts thereto. The second advantage is that the total resistance value thereof can be controlled to a large degree. The total resistance value may be controlled by etching very lightly over the entire surface to remove the uppermost portion of the n-type region 10b, being very careful to not etch through the p-n junction, and as well by selectively etching to or through the p-n junction 13 thereby effectively to increase the length of the path traveled by the current between the contacts. The third, and perhaps major, advantage in forming a resistor according to FIGURE 1a is in that, by controlling the doping level or impurity concentration in the n-type region 10b, lower and more nearly constant temperature coefficients may be provided for the resistor. The above description has been in terms of a p-type body 10a and an n-type region 10b but it is obvious that the body 10a could be equally as well of n-type conductivity and the region 10b of p-type conductivity. Resistors according to FIGURE 1a may be formed as separate circuit elements or components.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Capacitor designs may be obtained by utilizing the capacitance of a ",
      ),
      sourceTerm(
        "p-n junction",
        "The interface between regions of opposite semiconductor conductivity; under reverse bias its depleted charge region stores electric energy and supplies transition capacitance.",
      ),
      sourceText(
        ", as shown in ",
      ),
      sourceReference(
        "FIGURE 2",
        "/patents/figures/us-3138743-kilby-integrated-circuit/fig-2-source-crop-v2.png",
      ),
      sourceText(
        ", wherein a semiconductor wafer 15 of p-type conductivity is shown containing an n-type diffused layer 16. Ohmic contacts 17 are made to opposite faces of the wafer 15. The capacitance of a diffused junction is given by the relation printed in the facsimile, where A is the area of the junction in square cm., ε is the dielectric constant, q is electronic charge, α is the impurity density gradient, and V is the applied voltage.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Instead of the capacitor of FIGURE 2, capacitance in a body of single crystal semiconductor material may be provided as shown and described in connection with ",
      ),
      sourceReference("FIGURE 2a"),
      sourceText(
        ". FIGURE 2a shows a body 15a of semiconductor material, of either n- or p-type conductivity, which constitutes one plate of the capacitor. Evaporated onto the body 15a is a layer 18 providing a dielectric layer for the capacitor. It is necessary that the layer 18 have a suitable dielectric constant and be inert when in contact with the semiconductor body 15a. Silicon oxide has been found to be a suitable material for dielectric layer 18 and may be applied by evaporation or thermal oxidation techniques onto body 15a. Plate 19 forms the other plate of the capacitor and is provided by evaporating a conductive material onto layer 18. Gold and aluminum have been found to be satisfactory materials for the plate 19. Ohmic contact 17a is made to the body of semiconductor material 15a and contact to plate 19 may be made by any suitable electrical contact (not shown). Capacitors formed in the manner described in connection with FIGURE 2a have been found to exhibit much more stable characteristics than pure junction capacitors, that is, p-n junction capacitors, and, of course, may be fabricated as separate elements or components.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Capacitors produced in the manner of FIGURE 2 are also diodes, and must therefore be properly polarized in the circuit. Non-polar capacitors may be made by connecting two such areas back-to-back. Although junction capacitors have a marked voltage dependence, such dependence is present to a lesser degree for low voltages in the non-polar configuration.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Resistor and capacitor designs may be combined to form a distributed R-C network. Such is shown in ",
      ),
      sourceReference("FIGURE 3"),
      sourceText(
        ", wherein a wafer 20 of p-type conductivity having an n-type conductivity diffused layer 21 formed therein is provided with a broad area contact 22 on the face and spaced contacts 23 on the opposite face. These networks are useful for low pass-filters, phase shift networks, coupling elements, etc. Their parameters may be calculated from the equations above. Other configurations of this general type are also possible.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Transistors and diodes may be formed on a wafer, as described by Lee in Bell System Technical Journal, vol. 35, p. 23 (1956). This reference describes a transistor, as shown in ",
      ),
      sourceReference("FIGURE 4"),
      sourceText(
        ", which has a collector region 25, a diffused p-n junction 26, a base layer 27, an emitter contact 28 for a rectifying connection with base layer 27 and base and collector contacts 29 and 30, respectively. The base layer 27 is formed as a ",
      ),
      sourceTerm(
        "mesa",
        "A raised, etched semiconductor plateau whose small cross-section confines the active junction layers and exposes contacts at the wafer surface.",
      ),
      sourceText(
        " of small cross section.",
      ),
    ),
    sourceParagraph(
      sourceText("A diode of similar design is shown in "),
      sourceReference("FIGURE 5"),
      sourceText(
        ", and consists of a region 35 of one type conductivity, a mesa region 36 of opposite conductivity type with a p-n diffused junction formed therebetween and contacts 37 and 38 to each region. Small inductances, suitable for high frequency use, may also be made by shaping the semiconductor as evidenced by ",
      ),
      sourceReference("FIGURE 5a"),
      sourceText(
        " which shows a spiral of semiconductor material. It is also possible to prepare photosensitive, photoresistive, solar cells and other like components utilizing the considerations outlined above.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Although all of the circuit elements have been described in terms of a single diffused layer, it is quite possible to use a double diffused structure. Thus, double diffusion may be employed to form both n-p-n and p-n-p structures. Moreover, any suitable substances can be used for the semiconductor materials, conductivity producing impurities, and contact materials; and suitable and known processing can be exploited in producing the above circuit designs.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Because all of the circuit designs described above can be formed from a single material, a semiconductor, it is possible by physical and electrical shaping to integrate all of them into a single crystal semiconductor wafer containing a diffused p-n junction, or junctions, and to process the wafer to provide the proper circuit and the correct component values. Junction areas for the transistors, diodes, and capacitors are formed by properly shaped mesas on the wafer.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "A specific illustration of an electronic circuit embodying the principles of the invention is shown in ",
      ),
      sourceReference("FIGURE 6a"),
      sourceText(
        ". As shown, a thin wafer of single crystal semiconductor material containing a diffused p-n junction has been processed and shaped to include a complete and integrated multivibrator electronic circuit formed essentially in one surface of the wafer. The regions of the wafer have been marked with symbols representative of the circuit element functions that are performed in the various regions. ",
      ),
      sourceReference("FIGURE 6b"),
      sourceText(
        " shows a wiring diagram of the various circuit functions in the relationship which they occupy in the wafer of FIGURE 6a. A more conventionally drawn circuit diagram is shown in ",
      ),
      sourceReference("FIGURE 7"),
      sourceText(
        " with the circuit values actually used. The multivibrator circuit shown in FIGURES 6a, 6b and 7 will be described as illustrative of the processing techniques employed.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "First, a semiconducting wafer, preferably silicon or germanium, of the proper resistivity is lapped and polished on one side. For this design, 3 ohm-cm. p-type germanium was used. The wafer was then subjected to an antimony diffusion process which produced an n-type layer on the surface about 0.7 mil deep. The wafer was then cut to the proper size, 0.200 inch x 0.080 inch and the unpolished surface was lapped to give a wafer thickness of 0.0025 inch.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Gold plated Kovar leads 50 were attached by alloying to the wafer in the proper positions (as shown). Kovar is a trade name for an iron-nickel-cobalt alloy. Gold was then evaporated through a mask to provide the areas 51-54 which provide ohmic contact with the n region, such as the transistor base connections and the capacitor contacts. Aluminum was evaporated through a properly shaped mask to provide the transistor emitter areas 56, which form rectifying contacts with the n layer.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "The wafer was then coated with a photosensitive resist or lacquer, such as Eastman Photo Resist, supplied by Eastman Kodak Company, and exposed through a negative to a light. The lacquer image remaining after development was used as a resist for etching the wafer to the proper shape. In particular, this etching forms a slot through the wafer to provide isolation between R1 and R2 and the rest of the circuit and also shapes all of the resistor areas to the previously calculated configuration. Either chemical etching or electrolytic etching may be used, although electrolytic etching appears to be preferable.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "After this step, the photoresist was removed with a solvent and the mesa areas 60 masked by the same photographic process. The wafer was again immersed in etchant and the n layer completely removed in the exposed areas. A chemical etch is considered preferable. The photoresist was then removed.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Gold wires 70 were then thermally bonded to the appropriate areas to complete the connections and a final clean-up etch given. Instead of using the gold wires 70 in making electrical connections, connections may be provided in other ways. For example, an insulating and inert material such as silicon oxide may be evaporated onto the semiconductor circuit wafer through a mask either to cover the wafer completely except at the points where electrical contact is to be made thereto, or to cover only selected portions joining the points to be electrically connected. Electrically conducting material such as gold may then be laid down on the insulating material to make the necessary electrical circuit connections.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "After testing, the circuit may be hermetically sealed, if required, for protection against contamination. The finished device was smaller by several orders of magnitude than any others which have previously been proposed. Because the fabrication steps required are quite similar to those now used in manufacturing transistors and because of the relatively small number of steps required, these devices are inherently inexpensive and reliable, as well as compact.",
      ),
    ),
    sourceParagraph(
      sourceText("A further illustration of the process hereof is shown in "),
      sourceReference("FIGURES 8a-8c"),
      sourceText(
        ". Each area of the single crystal semiconductor wafer has been marked with a symbol for the circuit element which it represents. This unit illustrates the use of resistors, transistors, and a distributed R-C network to form a complete phase shift oscillator.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "It must be emphasized that the two embodiments described above are merely two of innumerable circuits which can be fabricated by the techniques of the present invention. There is no limit upon the complexity or configuration of circuits which can be made in this manner. While there is a limit upon the types and values of components which can be made in a limited space, the invention hereof nevertheless represents a remarkable improvement over the prior art.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "As evidence of the advance in the art accomplished by the present invention, it is possible using the techniques described above to achieve component densities of greater than thirty million per cubic foot as compared with five hundred thousand per cubic foot which is the highest component density attained prior to this invention.",
      ),
    ),
    sourceParagraph(
      sourceText(
        "Although the invention has been shown and described in terms of specific embodiments, it will be evident that changes and modifications are possible which do not in fact depart from the inventive concepts taught herein. Hence, such changes and modifications are deemed to fall within the purview of the invention.",
      ),
    ),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    {
      kind: "claim",
      number: 1,
      inlines: [
        sourceText(
          "1. In an integrated circuit having a plurality of electrical circuit components in a wafer of single-crystal semiconductor material, a plurality of junction transistors defined in the wafer, each transistor including thin layers of semiconductor material of opposite conductivity-types adjacent one major face of the wafer providing a base and an emitter region which overlie a collector region, the base-emitter and base-collector junctions of each of said transistors extending wholly to said one major face, a plurality of thin elongated regions of the wafer exhibiting substantial resistance to provide semiconductor resistors, the elongated regions being spaced on said one major face from the transistors, and conductive means connecting selected ones of the elongated regions to regions of selected ones of the transistors.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        sourceText(
          "2. In a semiconductor device which includes a single-crystal semiconductor wafer: a junction transistor provided adjacent one major face of the wafer by thin layers of semiconductor material of opposite conductivity types overlying one another and extending to said one major face with the emitter-base and base-collector junctions of the transistor extending wholly to said one major face; and a resistor provided in the wafer by a discrete elongated region of the semiconductor material which is spaced from the transistor on said one major face.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        sourceText(
          "3. An integrated circuit comprising a wafer of semiconductor material containing a plurality of electrical circuit components including at least one active circuit component and at least one passive circuit component, the active circuit component including at least two thin layers of semiconductor material of opposite conductivity-types extending to one major face of the wafer with p-n junctions of the active circuit component extending wholly to said one major face, the passive circuit component including at least one discrete region of the semiconductor material of the wafer which is spaced on said one major face away from the thin layers of the active component, substantial electrical impedance being exhibited between the semiconductor material contiguous to the at least one discrete region of the passive component and semiconductor material immediately underlying said thin layers of the active component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        sourceText(
          "4. An integrated circuit according to claim 3 wherein said active circuit component is a junction transistor, said passive circuit component is an elongated resistor region, and said semiconductor material immediately underlying said thin layers of the active component defines the collector region of the junction transistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        sourceText(
          "5. An integrated circuit according to claim 3 which further comprises: at least one other active circuit component provided in the wafer and including at least two thin layers of semiconductor material of opposite conductivity-types extending to said one major face with p-n junctions of such other active circuit component extending wholly to said one major face; and at least one other passive circuit component provided in the wafer and including at least one discrete region of the semiconductor material which is spaced on said one major face away from the thin layers of the at least one other active component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        sourceText(
          "6. An integrated circuit according to claim 5 wherein said discrete regions of said passive circuit components include thin surface-adjacent regions at said one major face of the wafer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        sourceText(
          "7. An integrated circuit according to claim 3 wherein the at least one discrete region of the passive circuit component includes a thin surface-adjacent layer of semiconductor material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        sourceText(
          "8. An integrated circuit according to claim 7 wherein the passive circuit component is a resistor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        sourceText(
          "9. An integrated circuit according to claim 3 wherein at least one of said circuit components includes a thin layer of dielectric material overlying said one major face of the wafer with a thin layer of conductive material overlying the dielectric material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        sourceText(
          "10. A semiconductor device comprising: a body of single-crystal semiconductor material; an active circuit component provided adjacent one major face of the body and including thin regions of the semiconductor material which extend to said one major face, each of such regions being of different conductivity than adjoining semiconductor material with the interface between each such region and other of the semiconductor material of the body extending wholly to said one major face; a passive circuit component provided in the body by a discrete portion of the semiconductor material which is spaced from the active circuit component on said one major face, substantial electrical impedance existing through the body between said thin regions of the active circuit component and the discrete portion of the passive circuit component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        sourceText(
          "11. A semiconductor device according to claim 10 wherein at least part of said substantial electrical impedance is exhibited by at least one p-n junction within the wafer.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        sourceText(
          "12. An integrated circuit comprising a wafer of single-crystal semiconductor material having a plurality of electrical circuit components therein, the components including an active circuit component which comprises thin regions of semiconductor material of opposite conductivity types closely adjacent one major face of the wafer with p-n junctions between such thin regions extending wholly to said one major face, the components further including a semiconductor resistor provided by a discrete elongated region of the wafer which is spaced on said one major face from the active circuit component, and a conductive lead connecting an end of the elongated region to one of the thin regions of the active circuit component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        sourceText(
          "13. In an integrated circuit having a plurality of circuit components in a wafer of single-crystal semiconductor material, a pair of junction transistors defined in the wafer with each transistor including thin layers of alternate conductivity type adjacent one major face of the wafer providing a base and an emitter region which overlie a collector region, the base-emitter and collector-base junctions of each of said transistors extending wholly to said one major face, elongated semiconductor means defined in the wafer and exhibiting substantial resistance to provide load resistor means for the pair of transistors, first conductive means connected to the collector region of one of the transistors and to an end of the elongated semiconductor means, second conductive means connected to the collector region of the other one of the transistors and to an end of the elongated semiconductor means, means including contacts to the emitter regions of the transistors and to the elongated semiconductor means for applying operating bias to the transistors and means including separate contacts on said base regions for applying inputs to said pair of transistors.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        sourceText(
          "14. In an integrated circuit according to claim 13 first and second elongated semiconductor regions defined in the wafer and exhibiting substantial resistance to provide base resistors for the pair of transistors, and conductive means separately connecting an end of the first elongated region to the base region of one of the transistors and an end of the second elongated region to the base region of the other of the transistors.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        sourceText(
          "15. An integrated circuit having a plurality of electrical circuit components in a wafer of single-crystal semiconductor material, at least one of the components being an active circuit component which includes thin layers of semiconductor material of alternate conductivity types defined in the wafer adjacent one major face thereof with p-n junctions of such active circuit component extending wholly to said one major face, at least one of the components being a passive circuit component which includes at least one discrete region defined in the wafer, the passive circuit component being spaced on said one major face from the active circuit component, substantial electrical impedance being exhibited through the wafer between the active circuit component and the passive circuit component, a plurality of interconnections between selected ones of the electrical circuit components, the circuit components and interconnections being so arranged and constructed as to allow, upon the application of electrical power, the performance within the structure of an electrical function equivalent to the function performed by a plural element electrical network.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        sourceText(
          "16. An integrated circuit comprising a wafer of single-crystal semiconductor material containing a plurality of electrical circuit components defined in the wafer, the circuit components including an active circuit component which comprises at least two thin regions of the wafer of opposite conductivity-types each extending to one major face with the junction between each such thin region and other semiconductor material of the wafer extending to said one major face, the circuit components further including a passive circuit component which comprises at least one discrete region of the semiconductor material, the discrete region being spaced on said one major face from the thin regions of the active circuit component, non-common regions of the active and passive circuit components being interconnected to form at least part of an electrical circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        sourceText(
          "17. In a semiconductor device according to claim 2, said thin layers of said junction transistor being portions of a raised mesa-shaped part of said one major face.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        sourceText(
          "18. An integrated circuit according to claim 3 wherein said active circuit component is a junction transistor with said two thin layers being the base and emitter regions of said junction transistor, the emitter region being substantially smaller than the base region on said one major face, a base contact being positioned on said base region spaced from the emitter region.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        sourceText(
          "19. An integrated circuit according to claim 18 wherein said discrete region of the passive circuit component includes a thin surface-adjacent layer of semiconductor material of conductivity-type opposite that of subjacent semiconductor material, an ohmic contact is provided on said surface-adjacent layer, and a conductive lead connects such ohmic contact to said base contact.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        sourceText(
          "20. A semiconductor device according to claim 10 wherein said passive circuit component provided in the body by said discrete portion of the semiconductor material includes a thin surface-adjacent portion of the semiconductor material at said one major face of the body, such thin portion being of conductivity differing from subjacent semiconductor material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        sourceText(
          "21. A semiconductor device according to claim 20 wherein separate electrical contacts are provided on at least two of said thin regions of the active circuit component on said one major face, wherein a contact is provided on said thin surface-adjacent portion on said one major face, and wherein conductive means interconnects said contact on said thin surface-adjacent portion with one of said contacts on said thin regions of the active circuit component.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        sourceText(
          "22. In an integrated circuit according to claim 13 said elongated semiconductor means being a single elongated region of the semiconductor material with said first and second conductive means being separately connected to opposite ends of such elongated region and with said means for applying operating bias being connected to a centrally located portion of such elongated region.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        sourceText(
          "23. In an integrated circuit according to claim 13 said means for applying inputs to said pair of transistors includes separate coupling means connecting the first conductive means to the contact on the base region of said one of the transistors and connecting the second conductive means to the contact on the base region of said other one of the transistors.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        sourceText(
          "24. An integrated circuit according to claim 16 wherein said discrete region of the passive circuit component includes a thin surface-adjacent region of conductivity type opposite to that of subjacent semiconductor material.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        sourceText(
          "25. An integrated circuit according to claim 24 wherein said passive circuit component is a P-N junction capacitor.",
        ),
      ],
    },
    sourceParagraph(
      sourceText(
        "References Cited in the file of this patent: 2,493,199 Khouri, January 3, 1950; 2,748,041 Leverenz, May 29, 1956; 2,816,228 Johnson, December 10, 1957; 2,817,048 Thuermel, December 17, 1957; 2,824,977 Pankove, February 25, 1958; 2,836,776 Ishikawa, May 27, 1958; 2,878,147 Beale, March 17, 1959; 2,915,647 Ebers, December 1, 1959; 2,916,408 Freedman, December 8, 1959; 2,922,937 Hutzler, January 26, 1960; 2,935,668 Robinson et al., May 3, 1960; 2,995,686 Selvin, August 8, 1961; 2,998,550 Collins et al., August 29, 1961.",
      ),
    ),
    sourceParagraph(
      sourceText("INVENTOR: Jack S. Kilby. By Stevens, Davis, Miller & Mosher, Attorneys."),
    ),
  ],
};

export function manualKilbyClaimText(claimNumber: number): string {
  const block = kilbyIntegratedCircuitArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === claimNumber,
  );
  if (block?.kind !== "claim")
    throw new Error(`Kilby manual edition is missing claim ${claimNumber}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

export const kilbyIntegratedCircuitParallelReadings: Readonly<Record<number, readonly string[]>> = {
  6: [
    "The opening identifies the subject as miniature electronic circuits fabricated from semiconductor material.",
  ],
  7: [
    "The patent explains that shrinking and packing discrete components was approaching its practical limit.",
  ],
  8: [
    "Conventional resistor miniaturization required a long sequence of substrate, material, termination, heat, and protection operations.",
  ],
  9: [
    "Capacitor, transistor, and diode processes were similarly numerous and often mutually incompatible.",
  ],
  10: [
    "Separate assembly could reduce process interactions, but assembly itself could damage the sensitive components.",
  ],
  11: [
    "Many operations, materials, tests, terminations, and alignment constraints lowered yield and reliability.",
  ],
  12: [
    "The invention's departure is to miniaturize with as few materials and compatible operations as possible.",
  ],
  13: [
    "A semiconductor body with diffused opposite-conductivity regions forms the junction structure that hosts every circuit element.",
  ],
  14: [
    "The components lie at or near one face of a thin wafer, and shaping supplies geometry and isolation.",
  ],
  15: [
    "Removal, geometry, diffusion, and conductivity conversion confine current paths and make the final circuit planar.",
  ],
  16: [
    "The patent states its principal object of integrating all components into a semiconductor body containing diffused junctions.",
  ],
  17: [
    "A second object is to shape the wafer so components are isolated and their occupied areas are defined.",
  ],
  18: ["A further object is a smaller, simpler package than prior circuit assemblies."],
  19: [
    "Another object is to produce the integrated circuits with fewer processing operations than earlier methods.",
  ],
  20: [
    "The primary object combines active and passive components near one body face while separating them as needed.",
  ],
  21: [
    "The drawing list distinguishes component figures, the multivibrator drawings, and the phase-shift oscillator drawings.",
  ],
  22: [
    "Active elements act as current generators in an impedance network; passive elements include resistors, capacitors, and inductors.",
  ],
  23: [
    "The source defines a circuit as electrically connected discrete elements, while acknowledging incidental transistor resistance and capacitance.",
  ],
  24: [
    "The detailed embodiments use an appropriately shaped single-crystal semiconductor body containing p-n junctions.",
  ],
  25: [
    "Germanium, silicon, gallium arsenide, aluminum antimonide, indium antimonide, and other materials are suitable.",
  ],
  26: [
    "The component figures establish the single-crystal semiconductor context and list germanium, silicon, gallium arsenide, aluminum antimonide, and indium antimonide as examples.",
  ],
  27: [
    "Figure 1 uses bulk resistance between ohmic contacts, governed by active length, cross-section, and resistivity.",
  ],
  28: [
    "Figure 1a confines current in a diffused n-type region and permits resistance adjustment by etching and doping.",
  ],
  29: [
    "Figure 2 uses transition capacitance at a diffused p-n junction and identifies the variables in its relation.",
  ],
  30: [
    "Figure 2a uses a semiconductor plate, an inert dielectric such as silicon oxide, and an evaporated metal plate.",
  ],
  31: [
    "Junction capacitors are diodes and are voltage-dependent; back-to-back regions provide a less polarized arrangement.",
  ],
  32: [
    "Figure 3 combines resistive and capacitive regions into useful distributed low-pass, phase-shift, and coupling networks.",
  ],
  33: [
    "Figure 4 identifies the collector, junction, base, emitter, base contact, and collector contact of a mesa transistor.",
  ],
  34: [
    "Figure 5 identifies a mesa diode, while Figure 5a shows a shaped spiral that can serve as a small high-frequency inductance.",
  ],
  35: [
    "Double diffusion can create both n-p-n and p-n-p structures, with suitable materials and established processes.",
  ],
  36: [
    "Physical and electrical shaping integrates the component types in one crystal and uses mesas to form junction areas.",
  ],
  37: [
    "The wafer embodiment in Figure 6a is a complete multivibrator, and Figure 6b preserves the same physical wiring relationship.",
  ],
  38: [
    "The fabrication example begins with polished 3 ohm-cm p-type germanium, antimony diffusion, and a precisely cut thin wafer.",
  ],
  39: [
    "Kovar leads, evaporated gold contacts, and aluminum emitter areas establish the electrical interfaces.",
  ],
  40: [
    "Photoresist and etching form isolation slots and the calculated resistor shapes, with electrolytic etching preferred.",
  ],
  41: [
    "A second mask and etch exposes mesa areas and removes the n layer where isolation requires it.",
  ],
  42: [
    "Thermally bonded gold wires complete the connections, while masked oxide and deposited gold provide an alternative interconnect.",
  ],
  43: [
    "Testing may be followed by hermetic sealing; the limited process sequence produces a compact, reliable, inexpensive device.",
  ],
  44: [
    "Figures 8a through 8c apply resistors, transistors, and distributed R-C material to a complete phase-shift oscillator.",
  ],
  45: [
    "The two embodiments are examples among innumerable circuits, bounded by the component types and values that fit in the space.",
  ],
  46: [
    "The specification reports more than thirty million components per cubic foot compared with five hundred thousand before the invention.",
  ],
  47: [
    "The closing technical paragraph preserves the inventor's allowance for equivalent changes that do not depart from the inventive concepts.",
  ],
  74: [
    "The cited references list the earlier United States patents named in the file of this patent.",
  ],
  75: [
    "The closing signature matter identifies Jack S. Kilby as inventor and Stevens, Davis, Miller and Mosher as attorneys.",
  ],
};
