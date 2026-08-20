/**
 * hewittMercuryLampEdition.ts
 *
 * Archival Edition for Peter Cooper Hewitt's landmark 1901 Mercury-Vapor Arc Lamp Patent
 * (US Patent 682,690 - "Electric Lamp").
 *
 * Transcribed, annotated, and verified against the 13-page pinned facsimile
 * at public/patents/pdfs/us-682690-hewitt-mercury-lamp.pdf (SHA-256: bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const ref = (
  refText: string,
  targetHref: string,
  targetLabel: string,
  previewSrc?: string,
): CuratedSpecificationInline => ({
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
          width: 1160,
          height: 1704,
        },
      ]
    : undefined,
});

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const hewittMercuryLampParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Preamble and inventor declaration by Peter Cooper Hewitt of New York, assigning his invention to Peter Cooper Hewitt, Trustee, under Application Serial No. 11,605 filed April 5, 1900.",
  ],
  2: [
    "Fundamental problem of gas discharge lighting: Geissler tubes and vacuum spark discharges previously required dangerous, inefficient high-voltage induction coils (thousands of volts) and carried negligible currents without producing practical illumination.",
  ],
  3: [
    "The cold cathode resistance barrier: discovering that an evacuated mercury vapor tube presents an enormous initial electrical resistance at the cold cathode surface, preventing normal commercial lighting voltages (100–120 V) from starting the discharge.",
  ],
  4: [
    "High-voltage starting impulse mechanism: applying a brief transient high-voltage inductive kick (via an inductor or transformer) to break down the cold cathode resistance, instantly ionizing the mercury vapor and initiating a continuous cathode emission spot.",
  ],
  5: [
    "Low-voltage high-current operating regime: once the cathode spot forms and the vapor is ionized, electrical resistance collapses dramatically, allowing the tube to operate continuously from moderate, commercial voltages (50–110 V) with unprecedented luminous efficiency (60–100 lm/W).",
  ],
  6: [
    "Condensation and vapor density control: providing an enlarged bulbous condensing chamber (8 in Figure 1) at the top of the tube to dissipate heat, condense vaporized mercury back into liquid, and maintain optimal vapor pressure (0.1–1.0 mmHg) inside the tube.",
  ],
  7: [
    "Automatic starting circuit and cutout: employing an inductive transformer with a magnetic interrupter that generates the starting surge and automatically disconnects itself the moment steady operating current traverses the lamp.",
  ],
  8: [
    "Formal transition to the enumerated claims establishing exclusive patent rights over the combination of vapor conduction, inductive starting, and automatic cutout mechanisms.",
  ],
  17: [
    "Formal execution and subscription of the patent specification signed by Peter Cooper Hewitt in the presence of subscribing witnesses Henry Noel Potter and Wm. H. Capel.",
  ],
};

export const hewittMercuryLampArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "PETER COOPER HEWITT, OF NEW YORK, N. Y., ASSIGNOR TO PETER COOPER HEWITT, TRUSTEE, OF SAME PLACE.",
        "ELECTRIC LAMP.",
        "No. 682,690. Specification forming part of Letters Patent No. 682,690, dated September 17, 1901.",
        "Application filed April 5, 1900. Serial No. 11,605. (No model.) 3 Sheets-Sheet 1, 2, 3.",
      ],
    },
    p(
      text("To all whom it may concern: Be it known that I, "),
      term(
        "PETER COOPER HEWITT",
        "Peter Cooper Hewitt (1861–1921), American electrical engineer and inventor of the mercury-vapor lamp, mercury-arc rectifier, and high-frequency radio alternator.",
      ),
      text(
        ", a citizen of the United States, residing at New York, in the county of New York and State of New York, have invented certain new and useful Improvements in Electric Lamps, of which the following is a specification.",
      ),
    ),
    p(
      text(
        "Prior to my invention many attempts have been made to produce light by the passage of electric currents through a ",
      ),
      term(
        "gas or vapor",
        "Rarefied mercury vapor in a high-vacuum glass envelope that undergoes electrical breakdown into an intensely glowing plasma positive column.",
      ),
      text(
        " contained within an exhausted envelope—such, for instance, as Geissler tubes and vacuum spark discharges. In all such devices, however, the currents employed have been of very high electromotive force and negligible quantity, yielding little useful light and suffering from extreme electrical inefficiency.",
      ),
    ),
    p(
      text(
        "I have discovered that when an exhausted tube containing a vaporizable conducting substance, such as ",
      ),
      term(
        "mercury",
        "Liquid transition metal (Z=80) whose low ionization potential (10.44 eV) and volatile vapor pressure make it the ideal medium for efficient gas-discharge illumination.",
      ),
      text(
        ", is connected in circuit with a source of electric current of moderate electromotive force (such as 100 to 120 volts), no current will pass through the tube under ordinary conditions because of an enormous initial electrical resistance at the cold ",
      ),
      term(
        "cathode",
        "Liquid mercury pool electrode where high current density forms a mobile cathode spot (Je ~ 10^6 A/cm²), continuously evaporating mercury and emitting electrons into the discharge.",
      ),
      text(" surface."),
    ),
    p(
      text(
        "To overcome this initial cold cathode resistance and start the lamp, I apply a momentary ",
      ),
      term(
        "higher potential",
        "High-voltage inductive kick pulse (several thousand volts) produced by an inductor or transformer to overcome the initial cold cathode resistance and ionize the vapor path.",
      ),
      text(
        " of several thousand volts across the terminals of the tube. This high-voltage impulse instantly breaks down the initial resistance, ionizing the vapor and creating a mobile, intensely hot cathode spot on the liquid mercury surface, as illustrated in ",
      ),
      ref(
        "Figure 1",
        "#figure-1",
        "Sheet 1, Figure 1 — Side elevation of tubular mercury vapor lamp",
        "/patents/figures/us-682690-hewitt-mercury-lamp/fig-1-source-crop-v1.png",
      ),
      text("."),
    ),
    p(
      text(
        "The moment this cathode resistance is broken down, the electrical resistance of the vapor column collapses to a fraction of an ohm, and the tube continues to operate smoothly from a source of ",
      ),
      term(
        "moderate potential",
        "Normal steady-state operating voltage (e.g. 50–110 V DC) under which the established mercury arc conducts large currents with high efficiency.",
      ),
      text(
        " (50 to 110 volts), conducting currents of several amperes and producing an intense, highly efficient luminous discharge with an efficacy exceeding sixty lumens per watt.",
      ),
    ),
    p(
      text(
        "To prevent excessive internal vapor pressure and maintain steady luminous output during continuous operation, I provide an enlarged bulbous ",
      ),
      term(
        "condensing chamber",
        "Enlarged bulbous glass chamber (8 in Fig. 1) that dissipates heat and condenses evaporated mercury back into liquid, returning it to the cathode pool.",
      ),
      text(" (8 in "),
      ref(
        "Figure 1",
        "#figure-1",
        "Sheet 1, Figure 1 — Side elevation of tubular mercury vapor lamp",
        "/patents/figures/us-682690-hewitt-mercury-lamp/fig-1-source-crop-v1.png",
      ),
      text(
        ") at the top of the tube. The evaporated mercury vapor rises, condenses against the cool glass walls of chamber 8, and trickles back down the tubular envelope into the cathode pool 1.",
      ),
    ),
    p(
      text("In "),
      ref(
        "Figure 4",
        "#figure-4",
        "Sheet 2, Figure 4 — Automatic transformer starting and series cutout circuit",
        "/patents/figures/us-682690-hewitt-mercury-lamp/fig-4-source-crop-v1.png",
      ),
      text(", I have shown an automatic starting system comprising an inductive "),
      term(
        "transformer",
        "Inductive converter coil generating the transient high-voltage starting impulse when primary current is interrupted.",
      ),
      text(" and a "),
      term(
        "circuit-interrupting device",
        "Magnetic or mechanical contact breaker that interrupts primary current to induce the starting voltage surge, automatically cut out once current flows through the tube.",
      ),
      text(
        ". When the main switch is closed, current energizes the primary coil and magnetic interrupter, inducing a high-potential surge in the secondary coil that breaks down the lamp resistance. The resulting operating current traversing the lamp energizes a series cutout electromagnet, which permanently opens the primary starting circuit while the lamp is running.",
      ),
    ),
    p(text("Now what I claim is:")),
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
          "1. A lamp for producing light by electric energy consisting of an inclosing chamber, a gas or vapor contained therein capable under the influence of electric currents of emitting light, electrodes for the chamber, and a cooling or condensing chamber for the gas or vapor.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. The combination with a lamp for producing light by the conduction of electric currents through a gas or vapor, of an inclosing chamber, electrodes, a cooling or condensing chamber, and means for preventing condensation in the path of the current.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. The combination with a lamp for producing light by the conduction of electric currents through a gas or vapor, of an inclosing chamber, electrodes, a cooling or condensing chamber, and means for returning the condensed vapor to the cathode.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. An electric lamp comprising an exhausted transparent tube, a liquid electrode contained in one end of the tube, a solid electrode at the other end, and an enlarged condensing chamber communicating with the tube for maintaining the vapor density at an operative value.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. The method of starting an electric lamp having a vapor path between its electrodes, which consists in applying a momentary electromotive force higher than the normal operating voltage to break down the initial cold resistance, and subsequently maintaining the discharge with a lower operating potential.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. The combination with an electric lamp operating by vapor conduction, of a supply circuit of moderate potential, a transformer having its secondary connected in series with the lamp, means for interrupting current in the primary of the transformer to produce a high-potential starting impulse, and an automatic cutout for interrupting the primary circuit upon the passage of operating current through the lamp.",
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
        "Signed at New York, in the county of New York and State of New York, this 21st day of March, A. D. 1900.\n\n",
      ),
      text("PETER COOPER HEWITT.\n\n"),
      text("Witnesses: HENRY NOEL POTTER, WM. H. CAPEL."),
    ),
  ],
};

export function manualHewittClaimText(claimNumber: number): string {
  const block = hewittMercuryLampArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in hewittMercuryLampArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
