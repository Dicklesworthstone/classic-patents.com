/**
 * deForestAudionEdition.ts
 *
 * Archival Edition for Lee de Forest's foundational 1908 Audion Triode Patent
 * (US Patent 879,532 - "Space Telegraphy").
 *
 * Transcribed, annotated, and verified against the 4-page pinned facsimile
 * at public/patents/pdfs/us-879532-de-forest-audion.pdf (SHA-256: 3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png": {
    width: 2320,
    height: 3408,
  },
};

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string,
): CuratedSpecificationInline => {
  const dims = previewSrc
    ? (FIGURE_DIMENSIONS[previewSrc] ?? { width: 800, height: 1000 })
    : { width: 800, height: 1000 };
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

export const deForestAudionParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Preamble and inventor declaration by Lee de Forest of New York, assigning the invention to the De Forest Radio Telephone Company, under Application Serial No. 354,662 filed January 29, 1907.",
  ],
  2: [
    "Relationship to prior oscillation detectors: referencing de Forest's earlier two-electrode flame and diode patents (US 824,637 and US 836,070), which lacked electronic amplification.",
  ],
  3: [
    "Core objective: dramatically increasing detector sensitivity and receiving range by introducing a third electrostatic control electrode between the cathode and anode.",
  ],
  4: [
    "Introductory reference to the accompanying drawings illustrating the complete receiving system and alternative electrode connections.",
  ],
  5: [
    "Figure references: Figures 1 and 2 showing the Audion circuit diagram and modified detector.",
  ],
  6: [
    "Antenna coupling: describing the elevated conductor W, earth ground E, and RF transformer primary I1 and secondary I2 coupled to the tuned resonant LC circuit.",
  ],
  7: [
    "The physical triode structure: an evacuated glass bulb D containing heated incandescent filament F, cold plate anode b, and the interposed perforated wire grid a, with local B-battery and telephone receiver T.",
  ],
  8: [
    "Empirical discovery of grid sensitivity: acknowledging that placing the grid directly between the filament and plate creates an unprecedented electronic response to weak wireless signals.",
  ],
  9: [
    "Grid coupling and DC blocking condenser: inserting series condenser C to isolate the grid from direct B-battery DC potential while coupling high-frequency radio oscillations.",
  ],
  10: [
    "Universal applicability: noting that the interposed grid and circuit topology apply across all forms of gaseous and vacuum discharge tubes.",
  ],
  11: [
    "Formal legal preamble introducing the enumerated patent claims for the three-electrode oscillation detector and amplification circuits.",
  ],
  35: [
    "Formal execution and subscription of the patent specification signed by Lee de Forest on December 21, 1906, in the presence of subscribing witnesses Thomas I. Gallagher and Hans W. Goetze.",
  ],
};

export const deForestAudionArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "LEE DE FOREST, OF NEW YORK, N. Y., ASSIGNOR, BY MESNE ASSIGNMENTS, TO DE FOREST RADIO TELEPHONE CO., A CORPORATION OF NEW YORK.",
        "SPACE TELEGRAPHY.",
        "No. 879,532. Specification of Letters Patent. Patented Feb. 18, 1908.",
        "Application filed January 29, 1907. Serial No. 354,662.",
      ],
    },
    p(
      text("To all whom it may concern: Be it known that I, "),
      term(
        "LEE DE FOREST",
        "Lee de Forest (1873–1961), American inventor who created the Audion triode vacuum tube, introducing the third control electrode that enabled electronic amplification and launched the electronics age.",
      ),
      text(
        ", a citizen of the United States, and a resident of New York, in the county of New York and State of New York, have invented a new and useful Improvement in Space Telegraphy, of which the following is a specification.",
      ),
    ),
    p(
      text("My invention relates to wireless telegraph receivers or "),
      term(
        "oscillation detectors",
        "Early terminology for radio frequency demodulators and detectors that convert high-frequency electromagnetic carrier oscillations into audible audio signals.",
      ),
      text(
        " of a type heretofore described in my prior Letters Patent Nos. 824,637, June 26, 1906 and 836,070, November 13, 1906.",
      ),
    ),
    p(
      text("The objects of my invention are to increase the "),
      term(
        "sensitiveness",
        "The signal sensitivity and transconductance amplification of the receiver, allowing the detection of extremely weak, distant radio transmissions beyond the reach of passive crystal or electrolytic detectors.",
      ),
      text(
        " of oscillation detectors comprising in their construction a gaseous medium by means of the structural features and circuit arrangements which are hereinafter more fully described.",
      ),
    ),
    p(
      text(
        "My invention will be described with reference to the drawings which accompany and form a part of the present specification, although it is to be understood that many modifications may be made in the apparatus and systems herein described without departing from the principles of my invention.",
      ),
    ),
    p(
      text("In the drawings, "),
      ref(
        "Figure 1",
        "#figure-1",
        "Complete source drawing sheet 1 of 1 — Figure 1, triode Audion circuit diagram with tuned input and telephone indicator",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(
        " represents in diagram a wireless telegraph receiving system comprising an oscillation detector constructed and connected in accordance with the present invention and ",
      ),
      ref(
        "Fig. 2",
        "#figure-2",
        "Complete source drawing sheet 1 of 1 — Figure 2, modified form of Audion oscillation detector",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(
        " represents a space telegraph receiving system having a modified form of oscillation detector connected therein in a manner which constitutes one of the subjects matter of said invention.",
      ),
    ),
    p(
      text(
        "W I1 E is an elevated conductor system including the elevated conductor W, earth connection E, and primary I1 of the transformer M, the secondary I2 of which forms part of the tuned receiving circuit I2 C. It will be understood of course that the aforesaid tuned receiving circuit may be associated with the elevated conductor system in any suitable manner.",
      ),
    ),
    p(
      text("D represents an "),
      term(
        "evacuated vessel",
        "Sealed glass bulb maintaining a high vacuum through which thermionic electrons travel from the heated cathode to the anode.",
      ),
      text(
        ", preferably of glass, having sealed therein three conducting members, F, a and b, in ",
      ),
      ref(
        "Fig. 1",
        "#figure-1",
        "Complete source drawing sheet 1 of 1 — Figure 1, triode Audion circuit diagram with tuned input and telephone indicator",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(" and F, a' and b in "),
      ref(
        "Fig. 2",
        "#figure-2",
        "Complete source drawing sheet 1 of 1 — Figure 2, modified form of Audion oscillation detector",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(". The conducting member or electrode F is shown as consisting of a "),
      term(
        "filament",
        "Thermionic cathode (typically carbon or tungsten) heated to incandescence by a low-voltage A-battery to emit free electrons via Richardson-Dushman thermionic emission.",
      ),
      text(
        ", preferably of metal, which is connected in series with the battery A or other source of electrical current of sufficient strength to heat said filament, preferably to incandescence. The conducting member b, which may be a ",
      ),
      term(
        "plate",
        "Cold nickel or platinum anode collecting the electron stream, connected to a positive high-voltage B-battery (20–100 V).",
      ),
      text(
        " of platinum, has one end brought out to the terminal 3. Interposed between the members F and b is a ",
      ),
      term(
        "grid-shaped member",
        "The revolutionary third electrode: an open wire mesh or zigzag platinum wire placed directly across the thermionic electron stream to electrostatically control the plate current.",
      ),
      text(
        " a, which may be formed of platinum wire, and which has one end brought out to the terminal 1. The local receiving circuit, which includes the battery B, or other suitable source of electromotive force, and the signal indicating device T, which may be a telephone receiver, has its terminals connected to the plate b and filament F at the points 3 and 4 respectively. The means for conveying the oscillations to be detected to the oscillation-detector, are the conductors which connect the filament F and grid a to the tuned receiving circuit and, as shown, said conductors pass from the terminals 2 and 1 to the armatures of the condenser C.",
      ),
    ),
    p(
      text(
        "I have determined experimentally that the presence of the conducting member a, which as before stated may be grid-shaped, increases the sensitiveness of the oscillation detector and, inasmuch as the explanation of this phenomenon is exceedingly complex and at best would be merely tentative, I do not deem it necessary herein to enter into a detailed statement of what I believe to be the probable explanation.",
      ),
    ),
    p(
      text(
        "In associating an oscillation detector of the above mentioned type, said detector being now commonly known as the ",
      ),
      term(
        "audion",
        "The historic name coined by de Forest for the triode vacuum tube—the first active electronic amplifier in human history.",
      ),
      text(", with a closed tuned circuit, it will be noted by reference to "),
      ref(
        "Fig. 2",
        "#figure-2",
        "Complete source drawing sheet 1 of 1 — Figure 2, modified form of Audion oscillation detector",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(
        ", that the secondary I2 closes a circuit containing a battery shown at B through the electrode b, conducting member a' and the conducting gaseous medium intervening between said electrode and member. Also by reference to ",
      ),
      ref(
        "Fig. 1",
        "#figure-1",
        "Complete source drawing sheet 1 of 1 — Figure 1, triode Audion circuit diagram with tuned input and telephone indicator",
        "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
      ),
      text(
        ", it will be seen that a similar closed circuit exists between said battery, and the electrode b and conducting member a. In order to close each of said circuits to the passage of direct current from the aforesaid battery therethrough, or to prevent the development of a difference of potential between the members a and b, or between a' and b, or to prevent the members a and a' from becoming electrically charged from said battery, I insert a ",
      ),
      term(
        "condenser",
        "Small series capacitance (grid leak capacitor) that blocks direct B-battery DC potential while coupling high-frequency RF oscillations directly to the grid.",
      ),
      text(
        " C in said circuit and, as I have found by repeated experiments, a very great increase in the sound produced in the telephone T results in each instance when said condenser is present over the sounds produced therein under the same conditions when said condenser is not employed.",
      ),
    ),
    p(
      text(
        "It will be understood that the circuit arrangements herein described with reference to the particular forms of audion herein disclosed may with advantage also be employed with various other types of audion.",
      ),
    ),
    p(text("I claim:")),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. An oscillation detector comprising an evacuated vessel, an electrode inclosed therein, means for heating said electrode, a second electrode inclosed within said vessel, a local circuit having its terminals electrically connected to said electrodes, a conducting member inclosed within said vessel and located between said electrodes, and means for conveying the oscillations to be detected to the first mentioned electrode and said conducting member.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. An oscillation detector comprising an evacuated vessel, two electrodes inclosed within said vessel, means for heating one of said electrodes, and a conducting member inclosed within said vessel and interposed between said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. An oscillation detector comprising an evacuated vessel, two electrodes inclosed within said vessel, means for heating one of said electrodes, and a grid-shaped member of conducting material inclosed within said vessel and interposed between said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. An oscillation detector comprising an evacuated vessel, a filament sealed therein, a source of electrical energy connected in series with said filament, an electrode sealed in said vessel, a local circuit having its terminals connected to said filament and electrode, respectively, said local circuit including a source of electromotive force and a signal indicating device, a grid of conducting material sealed in said vessel and interposed between said filament and electrode, and means for conveying the oscillations to be detected to said filament and grid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. An oscillation detector comprising an evacuated vessel, an electrode inclosed therein, means for heating said electrode, a second electrode inclosed within said vessel, a local circuit having its terminals connected to said electrodes, a conducting member inclosed within said vessel and located between said electrodes, a closed circuit for conveying the oscillations to be detected to said first mentioned electrode and conducting member, and a condenser in said closed circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a conducting member inclosed within said vessel and interposed between said electrodes, means for establishing a difference of electrical potential between said electrodes and means for preventing said conducting member from becoming electrically charged.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. An oscillation detector comprising an evacuated vessel inclosing a sensitive conducting gaseous medium, three conducting members inclosed therein, a closed oscillation circuit, a circuit connecting an element of said oscillation circuit with two of said members, a condenser in said circuit, a signal-indicating device, and a circuit connecting said device with one of said two members and with the third member.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a conducting member inclosed within said vessel and interposed between said electrodes, means for establishing a difference of electrical potential between said electrodes and means for preventing the establishment of a difference of electrical potential between one of said electrodes and said conducting member.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a grid of conducting material inclosed within said vessel and interposed between said electrodes, means for establishing a difference of electrical potential between said electrodes and means for preventing said grid from becoming electrically charged.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a grid of conducting material inclosed within said vessel and interposed between said electrodes, means for establishing a difference of electrical potential between said electrodes and means for preventing the establishment of a difference of electrical potential between one of said electrodes and said grid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. An oscillation detector comprising an evacuated vessel, an electrode inclosed therein, means for heating said electrode, a second electrode inclosed within said vessel, a local circuit having its terminals electrically connected to said electrodes, a grid of conducting material inclosed within said vessel and located between said electrodes, and means for conveying the oscillations to be detected to the heated electrode and grid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. An oscillation detector comprising an evacuated vessel, an electrode inclosed therein, means for heating said electrode, a second electrode inclosed within said vessel, a local circuit having its terminals connected to said electrodes, a grid of conducting material inclosed within said vessel and located between said electrodes, a closed circuit for conveying the oscillations to be detected to the heated electrode and grid, and a condenser in said closed circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. An oscillation detector comprising an evacuated vessel, an electrode inclosed therein, means for heating said electrode, a second electrode inclosed within said vessel, a local circuit having its terminals electrically connected to said electrodes, said local circuit including a source of electromotive force and a signal indicating device, a grid of conducting material inclosed within said vessel and located between said electrodes, and means for conveying the oscillations to be detected to the heated electrode and grid.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. An oscillation detector comprising an evacuated vessel, two electrodes, one of which is a filament, inclosed within said vessel, means for heating said filament, and a conducting member inclosed within said vessel and interposed between said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. An oscillation detector comprising an evacuated vessel, two electrodes inclosed within said vessel, means for heating one of said electrodes, a grid of conducting material inclosed within said vessel and interposed between said electrodes, a local circuit connecting said electrodes, and a source of electromotive force and signal indicating device in said local circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. An oscillation detector comprising an evacuated vessel, two electrodes, one of which is a filament, inclosed within said vessel, means for heating said filament, and a grid of conducting material inclosed within said vessel and interposed between said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "17. An oscillation detector comprising an evacuated vessel, two electrodes inclosed within said vessel, means for heating one of said electrodes, a conducting member inclosed within said vessel and interposed between said electrodes, and a local circuit including a source of electromotive force connecting said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. An oscillation detector comprising an evacuated vessel, two electrodes inclosed within said vessel, means for heating one of said electrodes, a grid of conducting material inclosed within said vessel and interposed between said electrodes, a local circuit including a source of electromotive force connecting said electrodes and a signal indicating device associated with said local circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. An oscillation detector comprising an evacuated vessel, two electrodes, one of which is a filament, inclosed within said vessel, means for heating said filament, a grid of conducting material inclosed within said vessel and interposed between said electrodes and a local circuit including a source of electromotive force connecting said electrodes.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a conducting member inclosed within said vessel, a closed oscillation circuit, a circuit connecting one element of said oscillation circuit with one of said electrodes and said conducting member, and a condenser in said circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. An oscillation detector comprising an evacuated vessel, two electrodes inclosed therein, means for heating one of said electrodes, a conducting member inclosed within said vessel, a closed oscillation circuit, a circuit connecting one element of said oscillation circuit with one of said electrodes and said conducting member, a condenser in said circuit, a signal indicating device and a circuit connecting said device with the other of said electrodes and said conducting member.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURES & WITNESSES",
    },
    p(
      text(
        "In testimony whereof, I have hereunto subscribed my name this 21st day of Dec., 1906.\n\n",
      ),
      text("LEE DE FOREST.\n\n"),
      text("Witnesses: THOMAS I. GALLAGHER, HANS W. GOETZE."),
    ),
  ],
};

export function manualDeForestClaimText(claimNumber: number): string {
  const block = deForestAudionArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in deForestAudionArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
