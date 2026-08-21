import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

export const HOLLERITH_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1320, height: 1940 },
  2: { width: 1360, height: 880 },
  3: { width: 660, height: 780 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-395781-hollerith-tabulating/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: figureAssetPath(num),
      alt: `Figure ${num}: ${altText}`,
      width: HOLLERITH_FIGURE_DIMS[num]?.width ?? 1200,
      height: HOLLERITH_FIGURE_DIMS[num]?.height ?? 1600,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const hollerithParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "To all whom it may concern: Be it known that I, Herman Hollerith, of Washington, District of Columbia, have invented certain new and useful Improvements in the Art of Compiling Statistics.",
  ],
  4: [
    "Fundamental Principle: Compiling statistical data by punching holes in cards at designated coordinate positions and sensing them electro-mechanically with spring-loaded contact pins.",
  ],
  5: [
    "Electromechanical Circuit Routing: Passing a perforated index card between contact pins and a conductive mercury cup matrix completes specific circuits to advance counter dials and open sorter bins.",
  ],
  7: [
    "Brief Description of Figures: FIG. 1 is a plan view of the tabulating system showing press, counting dials, and sorting box; FIG. 2 shows the pin-press matrix; FIG. 3 shows an electromechanical counter dial.",
  ],
  9: [
    "Detailed Description: The statistical record card C contains discrete spatial fields representing biographical attributes (age, sex, birthplace, occupation, citizenship).",
  ],
  10: [
    "Pin-Press Sensor: When the operator depresses handle H, pins P enter punched holes to contact mercury cups M, completing electrical circuits from battery B through electromagnet coils E.",
  ],
  11: [
    "Sorting Box Interlock: The completed circuit energizes a sorting box relay, releasing a spring lid over a designated destination compartment to sort cards into demographic groups.",
  ],
  12: [
    "High-Speed Tabulation: By replacing manual tallying with automatic electromechanical circuits, the system processes thousands of census records per hour without transcription errors.",
  ],
};

export const hollerithArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "39d7c9879f8386f63f609bd43c0a73c96dbe50943d5d17044733c254b8d5a780",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "Herman Hollerith, of Washington, District of Columbia",
        "Patent No.: US 395,781",
        "Date of Patent: January 8, 1889",
        "ART OF COMPILING STATISTICS",
        "Application filed September 23, 1884. Serial No. 143,827. (No model.)",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "SPECIFICATION",
    },
    p(
      "To all whom it may concern: Be it known that I, Herman Hollerith, of Washington, in the District of Columbia, have invented certain new and useful Improvements in the Art of Compiling Statistics, of which the following is a specification.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "THE ELECTROMECHANICAL TABULATING PRINCIPLE",
    },
    p(
      "In the compilation of statistical matter—such as the national census, insurance mortality tables, and railway freight audits—vast quantities of individual records must be classified, counted, and cross-tabulated according to numerous distinct characteristics.",
    ),
    p(
      "According to the present invention, each individual statistical item is recorded as a pattern of perforations or punched holes in an electrically non-conducting card or sheet. By placing these cards in an electromechanical sensing apparatus, electric circuits are selectively closed through the perforations to operate mechanical counting registers and selective sorting gates automatically.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "The invention is illustrated in the accompanying drawings, in which:\n",
      makePreview("FIG. 1", [1], "Plan View of Hollerith Tabulating Press and Dial Register Board"),
      " is a general diagrammatic view showing the sensing press, counting dials, and sorting compartments;\n",
      makePreview(
        "FIG. 2",
        [2],
        "Cross-Section of Spring Pin Sensing Press and Mercury Contact Matrix",
      ),
      " is a vertical sectional view through the pin-press matrix; and\n",
      makePreview("FIG. 3", [3], "Perspective View of Electromechanical Counter Register Dial"),
      " is a detail perspective view of an individual electromechanical counter dial.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE TABULATING SYSTEM",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Tabulating system plan"),
      ", a statistical card C is punched with holes whose spatial coordinates correspond to demographic attributes. The card is placed upon bed plate 10 beneath pin-press 12. Depressing operating lever 14 lowers an array of spring-mounted contact pins against the card.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Pin-press cross section"),
      ", wherever a hole is punched, the corresponding pin passes through the card into a cup of mercury or conductive contact plate below, closing a circuit from battery B through wiring harness 16. Wherever no hole is punched, the insulating card holds the pin up against its spring, preventing current flow.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Electromechanical register dial"),
      ", the completed circuit energizes the electromagnet of an associated register dial, attracting an armature to advance the index pointer by one unit. Simultaneously, sorting relays open the corresponding lid of sorting box S, allowing the operator to drop the card into the appropriate categorical partition.",
    ),
    p(
      "By combining multiple sensing pins in series or parallel circuits, complex logical intersections (such as native-born married males aged 20–25 employed as carpenters) are tabulated simultaneously in a single pass of the cards, reducing census processing time from years to weeks.",
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
        {
          kind: "text",
          text: "The improvement in the art of compiling statistics, which consists in first preparing a series of separate record-cards, each card representing an individual or subject; second, applying to each card at predetermined intervals circuit-controlling index-points arranged according to a fixed plan of distribution, to represent each item or characteristic of the individual or subject; and, third, applying said separate record-cards successively to circuit-controlling devices acted upon by the index-points to designate each statistical item represented by one or more of said index-points, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "As an improvement in the art of compiling statistical matters by the aid of mechanical or electrical appliances, the hereinbefore-described method of preparing and manipulating the circuit-controlling record, which consists in forming a separate record-card for each individual or thing by applying to said card at predetermined places index-points representing all the characteristic items pertaining to that individual or thing and subsequently subdividing the series of separate record-cards into groups and submitting the cards in each group or division to the action of the circuit-controlling devices, substantially as and for the purpose set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The improvement in the art of compiling statistical matters, consisting in first forming a separate record-card for each individual or thing by applying to said card a series of index-points, each bearing a fixed relation to all the others and to a standard, separating the record-cards into different groups or series, and finally applying the record-cards of the series successively to a series of circuit-controlling devices corresponding in relative position to the predetermined series of index-points representing the several items forming part of the statistical matters to be computed, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The hereinbefore-described improvement in the art of compiling statistics, &c., which consists in first forming a permanent record of each individual or thing by applying a series of circuit-controlling index-points upon a separate card or tablet, each point occupying a fixed relation to all the others and to a standard, and subsequently separating the series of record-cards into groups or divisions and by means of electrical appliances co-operating with the index-points counting the series of statistical items represented by any given point or series of two or more points, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The improvement in the art of compiling statistical matters, as hereinbefore described, consisting in first locating a series of separate points or spaces upon a series of cards, each point or space having a fixed relation to all the others; secondly, apportioning the spaces or points among the several items entering into the computation and giving to each item one or more of the spaces or points as its representative; thirdly, forming upon each card the complete record of one individual or subject, by applying in the representative space or spaces a circuit-controlling index point or points for each one of the series of items which pertain to the particular individual or subject, and, finally, applying all the records thus formed separately and successively to the circuit-controlling apparatus operated by the index-points to designate any one or more of the items represented thereby, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "As an improvement in the art of compiling statistics, the hereinbefore-described method for facilitating the classification of individual records and simplifying the process of computation, which consists in first assigning to each item entering into the proposed series of computations one or more designated points or spaces; secondly, forming a complete record of each individual or subject upon a single card by applying a circuit-controlling index point or points to each space appropriated to or indicative of each separate item in the given series which pertains to the individual or subject, and, finally, feeding said cards successively to an apparatus operated by the index-points on each card to designate the particular division to which it belongs, and depositing each card in a place or receptacle corresponding to the division thus indicated, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The hereinbefore-described improved system for compiling statistical matters, consisting, essentially, in the combination, with a series of circuits and operating electro-magnets and a series of pins controlling said circuits, of a series of separate record-cards, each card bearing circuit-controlling index-points indicative of items characteristic of an individual or subject.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "The combination, to form a system for compiling statistical matters, as hereinbefore described, of a series of separate cards, each card bearing a series of index-points representing the items or characteristics of one individual or subject, an apparatus provided with a series of circuit-controlling devices corresponding and co-operating with the index-points on the cards, a system of electro-magnets connected to said circuit-controlling devices, and a series of operating electro-magnets forming part of said system, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with the separate record-cards bearing index-points representing items or characteristics of the individual or unit, as described, of a series of pins co-operating with said index-points, a series of circuits controlled by the pins and index-points, and operating-magnets controlled by said circuits, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "The combination, to form a system such as hereinbefore described, of a series of separate record-cards, each representing an individual or unit provided with circuit-controlling-index-points, an indicator controlled by an electro-magnet, a circuit-controlling device co-operating with the index-points on the card, and circuit-connections, such as indicated, connecting the electro-magnet of the indicator with said circuit-controlling devices, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "The combination, in a system such as described, and with a circuit-controlling apparatus, a system of circuits connected thereto, and a series of record-cards having index-points, of a series of sorting-boxes and indicators therefor, included in the system of circuits controlled by the index-points on the cards, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The combination, to form a system such as described, of a circuit-controlling apparatus, a system of circuits connected thereto, a series of record-cards provided with index-points co-operating with said circuit-controlling apparatus, a series of electro-magnets included in said system of circuits, indicators controlled by said electro-magnets, and a series of sorting-boxes corresponding with the indicators, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with a record card or strip, circuit-controlling devices, and a system of circuits connected thereto, of operating-magnets controlled by said circuits, and a series of boxes provided with lids controlled by said operating-magnets, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with separate record-cards, of circuit-controlling devices co-operating with index-points on the cards, a system of circuits, one or more receptacles for cards, a movable lid or section controlling the entrance to each box or receptacle, and actuating devices for the movable lid or section, said devices being controlled by the index-points on the record-cards to designate the proper receptacle for each card, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The combination, to form a system such as described, of a series of record-cards having index-points, circuit-controlling devices operated by said index-points, a series of circuits connected to said circuit-controlling devices and including operating electro-magnets, a series of boxes or receptacles corresponding to the groups into which the cards are to be divided, and indicating and directing devices actuated by said operating-magnets, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, and in combination with a record card or strip provided with index-points representing items, a circuit-controlling apparatus provided with a separate contact for each index-point of the series, and a series of operating electro-magnets for actuating independent counting and indicating devices, a system of circuits intermediate the circuit-controlling devices and operating-magnets, said system embracing a series of relay-circuits controlled by one or more of the contacts in the circuit-controlling apparatus, and a series of direct circuits, including the contacts of the relays and governed by one or more contacts of the circuit-controlling apparatus, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "The combination, to form a system such as described, of the record-cards bearing index-points, a circuit-controlling contact for each index-point in the series, operating-magnets, and a system of circuits, substantially such as described, embracing a series of circuits including the coils of relays and certain designated circuit-controlling contacts, and another series of circuits, embracing one or more designated circuit-controlling contacts and the contacts of one or more relays, said operating-magnet being controlled by at least two pairs of contacts, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with the perforated record-cards and a system of circuits controlled thereby, of a bed-plate and platen between which the cards are successively fed, a series of yielding pins mounted upon the platen, and a corresponding series of mercury-cups in the bed-plate, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with the record-cards provided with the series of index-points, a bed-plate provided with a series of contacts forming the terminals of a system of circuits, such as described, and a reciprocating platen carrying a series of contact points or pins corresponding in number and arrangement with the index-points on the cards, of a gauge or gauges for locating the cards, and a pin connected to the ground or return circuit and located at or near the edge of the card to prevent the closing of the circuits until the card has been properly placed, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "In a system such as described, the combination, with the record-cards, the electrically-controlled series of contact-points carried by the platen, and the insulated series of contacts in the bed-plate, of a series of conductors each connected at one end to a contact in the bed-plate corresponding in position to one of the index-points and at the other end to a contact common to all of said circuits, said common contact or ground co-operating with a contact-point in the platen, and thus closing any or all of the circuits, substantially as described.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "In a system for compiling statistical matters, as hereinbefore described, the combination of a series of record-cards bearing circuit-controlling index-points, a circuit-controlling apparatus for co-operating with said cards, a switch-board to which the circuit-wires of said apparatus are connected, a series of mechanical counters and operating-magnets therefor, and a series of sorting-boxes provided with indicators and operating-magnets therefor, and a system of circuits and connections, substantially as herein described, for connecting the several devices for effecting the operation of counting and sorting, or both counting and sorting, the cards, as well as the items, recorded thereon by index-points, substantially as and for the purpose set forth. HERMAN HOLLERITH. Witnesses: JOHN R. FLOYD, EDWARD N. HILL.",
        },
      ],
    },
  ],
};

export const hollerithEdition = hollerithArchivalEdition;
