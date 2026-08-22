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

const FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1740, height: 1120 },
  2: { width: 1750, height: 360 },
  3: { width: 1080, height: 480 },
  4: { width: 340, height: 500 },
};

const preview = (
  surfaceText: string,
  figureNumber: number,
  src: string,
  alt: string,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: surfaceText,
  href: `#figure-${figureNumber}`,
  referenceType: "figure",
  label: alt,
  figurePreviews: [
    {
      src,
      alt,
      width: FIGURE_DIMS[figureNumber]?.width ?? 1400,
      height: FIGURE_DIMS[figureNumber]?.height ?? 1400,
    },
  ],
});

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const edisonIndicatorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Formal preamble and legal identification: Thomas A. Edison of Menlo Park, New Jersey, declares an Improvement in Electrical Indicators and identifies Case No. 603.",
  ],
  2: [
    "The objective is an apparatus for indicating variations in electro-motive force in an electric circuit, especially an electrical-distribution system. Edison connects an indicating device into the shunt path around the lamp, so current through the shunt — which includes part of the lamp's vacuous space — tracks the conductor's incandescence, making candle-power changes directly readable and available for regulation.",
  ],
  3: [
    "Broad statement of application: using the described shunt current to indicate or regulate electro-motive-force variations, or to affect circuit-controlling and other electrical apparatus.",
  ],
  4: [
    "Operating embodiment in incandescent lighting: place a thin platinum plate or wire within the standard lamp's globe, preferably between the limbs of its carbon conductor, and connect it to the circuit under observation. Run an additional connection from the positive terminal of the lamp-circuit to one galvanometer terminal, and lead from the platinum piece through a wire sealed into the glass to the other terminal. A torsional device holds the needle at zero under normal current, so any rise or fall of electro-motive force deflects it oppositely, making candle-power drift readable at a glance.",
  ],
  5: [
    "Reference to the patent drawing sheets: Figure 1 depicting the general circuit and galvanometer mechanism; Figure 2 depicting a shunt test circuit with calibration lamp A'; Figure 3 illustrating circuit-closing relay contacts; and Figure 4 showing the construction of the indicator bulb.",
  ],
  6: [
    "Detailed circuitry and mechanical construction of the indicating instrument: main conductors 1 and 2 feed lamps a arranged in multiple-arc circuits 3 and 4. Lamp A carries the platinum indicator piece b with its sealed platinum wire 5, and wire 6 runs from positive main conductor 3 to binding-posts c and c', which terminate the galvanometer's coils d d around pivoted needle e, torsion-spring f, split bar g, screws h h, stud i, thumb-nut j, and spring k; nut l and screw i' set the torsion zero, and light pointer m swings over calibrated scale n so the operator reads exactly how far the system's electro-motive force has moved from normal.",
  ],
  7: [
    "Automatic-control adaptation: the needle may carry circuit-controlling arm o, which closes contacts p or another suitable circuit to operate regulating, indicating, or other electrical apparatus.",
  ],
  8: [
    "Integration with Edison's Patent No. 287,524: the lamp and galvanometer can replace that patent's pressure-magnet B, with its working magnets in the two circuits closed by arm o; adjustable resistance C may maintain standard-lamp resistance.",
  ],
  9: [
    "Calibration test circuit of Fig. 2: placing a duplicate test bulb A' in parallel with working lamp A to periodically verify filament aging and resistance stability.",
  ],
  19: ["Formal attestation and date of execution: signed by Thomas A. Edison on November 2, 1883."],
  20: [
    "The inventor's signature, THOS. A. EDISON., closes the specification in his own hand; under 1883 practice this executed signing is what dates and validates the instrument that the two subscribing witnesses then attest below.",
  ],
  21: ["Attestation of subscribing witnesses H. W. Seely and Edward H. Pyatt."],
};

export const edisonIndicatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "THOMAS A. EDISON, OF MENLO PARK, NEW JERSEY.",
        "ELECTRICAL INDICATOR.",
        "SPECIFICATION forming part of Letters Patent No. 307,031, dated October 21, 1884.",
        "Application filed November 15, 1883. (No model.)",
      ],
    },
    p(
      "To all whom it may concern: Be it known that I, THOMAS A. EDISON, of Menlo Park, in the county of Middlesex and State of New Jersey, have invented a new and useful Improvement in Electrical Indicators, (Case No. 603,) of which the following is a specification.",
    ),
    p(
      "The object of my invention is to produce an efficient apparatus for indicating the variations of electro-motive force in an electric circuit, preferably for use in connection with systems of electrical distribution to show the changes in pressure in the various parts of the district. The apparatus is also capable of use in automatically regulating the electro-motive force to correspond with such variations. I have discovered that if a conducting substance is interposed anywhere in the ",
      term(
        "vacuous space",
        "vacuous-space",
        "The patent's term for the evacuated interior of the lamp globe, a portion of which is included in the shunt circuit described here.",
      ),
      " within the globe of an incandescent electric lamp, and said conducting substance is connected outside of the lamp with one terminal, preferably the positive one, of the ",
      term(
        "incandescent conductor",
        "incandescent-conductor",
        "The lamp's incandescing carbon conductor; the specification relates the current in the shunt circuit to the conductor's degree of incandescence or candle-power.",
      ),
      ", a portion of the current will, when the lamp is in operation, pass through the ",
      term(
        "shunt-circuit",
        "shunt-circuit",
        "The circuit described as including a portion of the lamp globe's vacuous space and connecting the internal conducting substance with an external lamp-circuit terminal.",
      ),
      " thus formed, which shunt includes a portion of the vacuous space within the lamp. This current I have found to be proportional to the degree of incandescence of the conductor or candle-power of the lamp.",
    ),
    p(
      "My invention consists in the utilization of this discovery for indicating or regulating variations in electro-motive force, or for affecting electrical apparatus in any desired manner. By connecting a device for indicating current changes in the shunt-circuit, changes in the candle-power of the lamp, and consequently in the electro-motive force of the source of supply, are made apparent; or if, instead of an indicating device, the variations in electro-motive force are made to affect circuit-controlling apparatus, automatic regulators or other electrical apparatus may be controlled thereby.",
    ),
    p(
      "In applying my invention to a system of incandescent electric lighting I place a standard lamp having within its globe a ",
      term(
        "piece of platinum",
        "platinum-electrode",
        "A thin platinum plate, or platinum wire, placed preferably between the limbs of the carbon conductor and connected with the circuit whose electrical condition is to be indicated.",
      ),
      ", preferably a thin plate, though platinum wire may be used, placed preferably between the limbs of its carbon conductor, such platinum piece being in connection with the circuit whose electrical condition is to be observed, connecting said terminals similarly to those of the other lamps of the system, and making an additional connection from the positive terminal, preferably of the lamp-circuit, to one terminal of a galvanometer or other indicator, and from the platinum piece through a wire sealed in the glass to the other terminal of the galvanometer or indicator. The ",
      term(
        "galvanometer",
        "torsion-galvanometer",
        "The indicator described with a torsional device that holds its needle at zero under a normal current, so variations above or below normal deflect it in opposite directions.",
      ),
      ", if one is used, is provided with a torsional device for holding its needle at zero under a normal current, so that variations above or below the normal deflect the needle in one direction or the other. If the electro-motive force in the system, and consequently the candle-power of the lamps, increases, the indicating-lamp varies with the rest, and the current from it to the galvanometer is increased, causing the deflection of the galvanometer-needle; and, conversely, a decrease in electro-motive force in the system produces an opposite deflection. The galvanometer-needle may be made to close circuit to electrically-operated devices for accomplishing the automatic regulation of the generator supplying current to the system, or for any other purpose.",
    ),
    p(
      "My invention is illustrated in the annexed drawings. ",
      preview(
        "Figure 1",
        1,
        "/patents/figures/us-307031-edison-indicator/fig-1-source-crop-v2.png",
        "Figure 1: Diagram of distribution mains, indicator lamp, and galvanometer.",
      ),
      " is a diagram of the system and connections, with a view in perspective of the galvanometer; ",
      preview(
        "Fig. 2",
        2,
        "/patents/figures/us-307031-edison-indicator/fig-2-source-crop-v2.png",
        "Figure 2: Shunt testing circuit with standard calibration lamp.",
      ),
      ", a diagram of a modified arrangement; ",
      preview(
        "Fig. 3",
        3,
        "/patents/figures/us-307031-edison-indicator/fig-3-source-crop-v3.png",
        "Figure 3: Galvanometer needle carrying circuit-closing contact arm.",
      ),
      ", a view showing the use of the galvanometer to close regulating or other circuits; and ",
      preview(
        "Fig. 4",
        4,
        "/patents/figures/us-307031-edison-indicator/fig-4-source-crop-v2.png",
        "Figure 4: Detail perspective view of vacuum indicator lamp with platinum plate.",
      ),
      " a view of the indicating lamp.",
    ),
    p(
      "1 2 are main conductors of a system of electric lighting, and a a electric lamps connected across them in ",
      term(
        "multiple-arc circuits",
        "multiple-arc-circuits",
        "The specification's term for electric lamps connected across the main conductors in circuits numbered 3 and 4.",
      ),
      " 3 4. A is a lamp similarly connected, and similar in every way to the other lamps, except that it has a piece of platinum, b, placed between the limbs of its incandescent conductor, while a wire, 5, attached to said platinum, is sealed in the glass of the globe with the wires 3 4. The wire 5 leads to the binding-post c, while a wire, 6, connected with the positive wire 3 of the lamp, leads to the binding-post c'. These binding-posts are the terminals of a galvanometer which consists of coils d d and a needle, e, carried by a torsion-wire, f. The parts are held in a frame, B. The upper cross-bar of the frame is split at g, the split being held together by screws h h, and the torsion-wire is attached to the smooth stud i, which is held by friction in the split, its torsion being adjusted by turning the thumb-nut j. A spring, k, is attached to the other end of the torsion-wire, serving to keep said wire stiff, and the tension of the spring is adjusted by means of nut l. A pointer, m, extends from the needle to indicate its variations upon a scale, n. The torsion of the wire f is so adjusted as to hold the needle and the pointer centrally with a normal current—that is, when the lamps of the system are at their normal candle-power—and, as previously explained, any variations in the electro-motive force of the system causing changes in the candle-power of the lamps will produce deflections of the galvanometer-needle, which deflections will be indicated on the scale.",
    ),
    p(
      "Instead of simply causing the variations to be indicated on the scale, a circuit-controlling arm, o, ",
      preview(
        "Fig. 3",
        3,
        "/patents/figures/us-307031-edison-indicator/fig-3-source-crop-v3.png",
        "Figure 3: Circuit-controlling contact arm carried by the galvanometer needle.",
      ),
      ", may be carried by the needle, which may close circuit at contacts p, or in any other suitable manner, to electrical devices for automatically regulating the electro-motive force of the system, to electrically-operated indicating devices, or to any electrically-operated apparatus.",
    ),
    p(
      "For regulating a dynamo-electric machine, a mechanism such as shown in my Patent No. 287,524 may be used, the lamp A and galvanometer of the present apparatus being used in place of the pressure-magnet B of said patent, the working-magnets C C of said patent being located in the two circuits closed by arm o of the present apparatus, which takes the place of the armature-lever of said pressure-magnet B. An adjustable resistance, C, may be placed in circuit with the lamp A, to maintain said circuit at the standard-lamp resistance.",
    ),
    p(
      "In ",
      preview(
        "Fig. 2",
        2,
        "/patents/figures/us-307031-edison-indicator/fig-2-source-crop-v2.png",
        "Figure 2: Shunt testing circuit with standard calibration lamp A'.",
      ),
      " a lamp, A', is shown placed in a shunt around the lamp A. The lamp A being constantly in use, lamp A' is occasionally placed in circuit instead, so by observing its candle-power it may be determined whether or not the resistance of the lamp A has changed.",
    ),
    {
      kind: "heading",
      level: 3,
      text: "What I claim is—",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "1. The combination of an incandescent electric lamp, a circuit including the vacuous space within the globe of said lamp, and electrical apparatus controlled by the current in such circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "2. The combination, with a system of electrical distribution, of an indicating or regulating apparatus therefor, comprising a standard lamp, a circuit including the vacuous space within the globe of said lamp, and electrical apparatus controlled by the current in such circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "3. The combination, with an incandescent electric lamp, of a circuit having one terminal in the vacuous space within the globe of said lamp, and the other in connection without the lamp with one side of the lamp-circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "4. The combination, with an incandescent electric lamp, of a circuit having one terminal in the vacuous space within the globe of said lamp, and the other in connection without the lamp with the positive side of the lamp-circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "5. The combination, with an incandescent electric lamp, of a circuit having one terminal in the vacuous space within the globe of said lamp, and the other connected with one side of the lamp-circuit, and electrically controlled or operated apparatus in said circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "6. The combination, with an incandescent electric lamp, of a piece of conducting material placed in the vacuous space within its globe, and a conductor connected therewith and passing through and sealed in the glass of the lamp, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "7. In a system of electrical distribution, the combination, with incandescent electric lamps connected in multiple arc, of a similar lamp similarly connected, a circuit having one terminal in the vacuous space within the globe of said lamp, and the other connected with one side of the lamp-circuit, and electrically-operated apparatus in said circuit, substantially as set forth.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "8. The combination, with an incandescent electric lamp, of a piece of conducting material placed between the sides of the incandescent loop, and a conductor leading therefrom to the exterior of the lamp, substantially as set forth.",
        },
      ],
    },
    p("This specification signed and witnessed this 2d day of November, 1883."),
    p("THOS. A. EDISON."),
    p("Witnesses: H. W. SEELY, EDWARD H. PYATT."),
  ],
};

export function edisonIndicatorClaimText(claimNumber: number): string {
  const block = edisonIndicatorArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in edisonIndicatorArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
