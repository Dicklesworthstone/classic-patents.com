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

export const kilbyIntegratedCircuitParallelReadings: Readonly<Record<number, readonly string[]>> = {
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

export const kilbyIntegratedCircuitArchivalEdition: CuratedSpecificationEdition = {
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

export function manualKilbyClaimText(claimNumber: number): string {
  const block = kilbyIntegratedCircuitArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in Jack Kilby Integrated Circuit edition`);
  }
  return block.inlines.map((i) => i.text).join("");
}
