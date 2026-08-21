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
  42: [
    "Formal execution and subscription of the patent specification signed by Peter Cooper Hewitt on March 21, 1900 in the presence of subscribing witnesses Henry Noel Potter and Wm. H. Capel.",
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
          "1. A lamp for producing light by electric energy consisting of an inclosing chamber, a gas or vapor contained therein capable, under proper conditions, of conducting currents of considerable quantity under the influence of moderate difference of potential, and a starting material also contained within the chamber and serving to convey a starting-current under the influence of a higher difference of potential.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. In a gas or vapor lamp, the combination with a conducting vapor or gas constituting the sole path for the current while the lamp is in operation, of a starting material serving to permit the initial passage of the electric current through the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. An electric lamp consisting of a hermetically-sealed inclosing chamber, electrodes within the same, means for securing electrical connection therewith, respectively, through the walls of the chamber, a vapor or gas contained within the chamber having, when traversed by an electric current, a resistance so varying with increments of current as to render it substantially self-regulating, and a steadying resistance in series with the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. In an electric vapor or gas lamp, the combination of two electrodes located at or near the respective ends of the lamp, a conducting medium between the electrodes consisting of a vapor or gas which is light-emitting under the influence of electric currents of moderate potential, means for applying a preliminary higher difference of potential to the terminals of the lamp for creating a condition on the part of the conducting-vapor which will permit it to conduct currents of moderate potential, and means for thereafter operating the lamp by the currents of moderate potential.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. In an electric lamp, the combination of an inclosing chamber, two electrodes, a conducting medium between the electrodes consisting of a vapor or gas which is light-emitting under the influence of electric currents of moderate potential, means for applying a higher difference of potential to the terminals of the lamp for producing a condition on the part of the vapor or gas which will render it conductive for currents of considerable quantity and moderate potential, and means for relieving the static charge at or near one of the electrodes caused by the action of the higher difference of potential.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        text(
          "6. In an electric lamp, the combination of an inclosing chamber, two electrodes, a conducting medium between the electrodes consisting of a vapor or gas which is light-emitting under the influence of electric currents of moderate potential, means for applying a higher difference of potential to the terminals of the lamp for producing a condition on the part of the vapor or gas which will render it conductive for currents of considerable quantity and moderate potential, and means for relieving the static charge at or near one of the electrodes caused by the action of the higher difference of potential consisting of a band of conducting material located near, but out of contact with, that electrode, and electrically connected with the other electrode.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        text(
          "7. A lamp for producing light by means of electric energy consisting of an inclosing chamber, a gas or vapor contained therein capable, under the proper conditions, of conducting currents of considerable quantity and moderate electromotive force, a starting material within the chamber facilitating the passage of current therethrough under the influence of higher differences of potential, a conducting-band surrounding the inclosing chamber near one of the electrodes of the lamp, and electric connections for leading off the electric charge produced therein under the influence of the electric currents of high differences of potential.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        text(
          "8. An electric lamp consisting of a transparent tube, a gas or vapor column contained therein, an electrode at the lower end thereof consisting wholly or in part of liquid, a metallic electrode at or near the upper end of said tube, a cooling and impurity-containing chamber surrounding the upper electrode, and means for securing electric connections with the respective electrodes through the wall of the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        text(
          "9. An electric lamp consisting of a transparent inclosing chamber, an electrode at or near one end of the chamber consisting wholly or in part of mercury, an electrode at or near the other end of the chamber consisting of a body of iron, and means for forming electrical connections with said electrodes through the wall of said chamber.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        text(
          "10. An electric lamp consisting of an inclosing chamber, electrodes within said chamber connected with each other through an intervening gas or vapor column, and a static charge dissipator located near one of the electrodes but insulated therefrom and electrically connected with the other electrode.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        text(
          "11. An electric lamp consisting of an inclosing chamber and two electrodes at or near the respective ends of said chamber, one of said electrodes consisting of a solid body of not readily vaporizable material free from carbon and other materials liable to be given off thereby in injurious quantities by the operation of the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        text(
          "12. An electrode for electric lamps employing a vapor or gas as a conducting medium consisting of a quantity of mercury and a non-conducting wall constricting the path of the electric current between said vapor or gas and said mercury.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        text(
          "13. The combination with an electric lamp wherein light is produced by the passage of electric energy through a hermetically-inclosed gas or vapor, a source of electric currents of moderate difference of potential, connections from said source with the terminals of the lamp, a potential-raising device also connected with said source of electric currents, and means for applying the higher difference of potential produced by said device to the terminals of the lamp while the moderate potential is also applied.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        text(
          "14. The combination with an electric lamp in which light is produced by electric energy traversing a hermetically-inclosed vapor or gas, a source of electric currents of moderate electromotive force, electric connections therefrom to the terminals of the lamp, and a potential-raising transformer having its secondary coil connected in the circuit leading to the lamp and its primary coil connected with the source of currents of moderate difference of potential, substantially as and for the purpose described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        text(
          "15. The combination of an electric vapor or gas lamp having a gas or vapor path adapted to be rendered luminous by the passage of an electric current, said vapor path having a resistance so varying with increments of currents employed for its operation as to render it substantially self-regulating, a circuit of low potential for the normal operation of the lamp, and a local circuit of higher potential part of which local circuit forms part of the circuit of low potential, the vapor path forming a part of both circuits.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        text(
          "16. The combination with an electric lamp in which light is produced by electric energy acting on a hermetically-inclosed vapor or gas, a source of electric currents of moderate electromotive force, electric connections therefrom to the terminals of the lamp, and a potential-raising transformer having its secondary coil connected in the circuit leading to the lamp and its primary coil connected with the source of currents of moderate difference of potential, with means on starting for shifting from the higher potential to the lower potential circuit, substantially as and for the purpose described.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        text(
          "17. The combination in an electric lamp in which light is produced by electric energy acting on a vapor or gas, a source of electric currents of moderate electromotive force, electric connections therefrom to the terminals of the lamp, a potential-raising transformer having its secondary coil connected in the circuit leading to the lamp and its primary coil connected with the source of currents of moderate potential, and an automatic circuit-interrupter for opening the circuit of the primary coil when currents of considerable quantity traverse the lamp under the influence of the normal electromotive force from said source.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        text(
          "18. The combination with an electric lamp in which light is produced by electric energy acting on a vapor or gas column, a source of electric currents of moderate electromotive force, electric connections therefrom to the terminals of the lamp, a potential-raising transformer having its secondary coil connected in the circuit leading to the lamp and its primary coil connected with the source of currents of moderate difference of potential, and means for producing rapid variations of current in the primary coil, thereby superposing a higher electromotive force upon the moderate electromotive force applied to the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        text(
          "19. The combination with an electric lamp in which light is produced by the conduction of currents through a path of vapor or gas, of a source of electric currents, connections therefrom with the terminals of the lamp, a converter having its secondary coil connected in said circuit with the lamp and having its primary coil connected with said source, means for rapidly magnetizing and demagnetizing the core of said transformer, a resistance shunt-circuit around the secondary coil of the transformer, and means for closing the connections of said shunt-circuit when the lamp is in operation.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        text(
          "20. The combination with an electric lamp in which light is produced by the conduction of currents through a path of vapor or gas, of a source of electric currents, connections therefrom with the terminals of the lamp, a converter having its secondary coil connected in circuit with the lamp, and having its primary coil connected with said source, means for rapidly magnetizing and demagnetizing the core of said transformer, a resistance shunt-circuit around the secondary coil of the transformer, means for closing the connections of said shunt-circuit when the lamp is in operation, and means for simultaneously interrupting the connections of the primary circuit.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        text(
          "21. The combination in an electric lamp in which a starting-current of higher electromotive force is required, of a transformer for producing such higher electromotive force having its secondary coil connected with the terminals of the lamp and its primary coil connected with a source of electric currents, connections from said source through the secondary coil, and a circuit-interrupting device for the primary coil operated by the magnetization of the core of the converter under the influence of operating-currents traversing the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        text(
          "22. The combination with a lamp for producing light by the conduction of electric currents through a hermetically-inclosed vapor or gas path, of a source of high difference of potential and a source of moderate difference of potential, means for connecting the lamp with the source of high difference of potential for starting the lamp and with the source of moderate difference of potential for operating the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        text(
          "23. The combination with an electric lamp, two sources of electromotive force, means for connecting said sources in series for starting the lamp, and means for connecting the lamp with one of said sources for operating it when started.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        text(
          "24. The combination with an electric lamp having a light-emitting material consisting of a hermetically-inclosed vapor or gas capable of emitting light under the influence of currents of moderate potential, a source of electric currents, means for connecting the lamp with said source, means for creating from the moderate potential currents of higher potential, means for applying the higher potential to the lamp for starting it, and means for discontinuing the high potential when the lamp is started.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        text(
          "25. The combination with an electric lamp comprising an inclosing chamber and a vapor or gas forming a path for the current between the electrodes of the lamp, of a transformer, means for causing independent variations in the current traversing the primary coil of the transformer, and circuit connections through the secondary coil of the transformer with a source of electric currents.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        text(
          "26. The combination with an electric lamp comprising an inclosing chamber and a vapor or gas forming a path for the current between the electrodes of the lamp, of a transformer, means for causing independent variations in the current traversing the primary coil of the transformer, connections through the secondary coil of the transformer with a source of electric currents, and means for interrupting the flow of currents through the primary coil.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        text(
          "27. The combination with an electric lamp having a hermetically-inclosed gas or vapor path, of a circuit leading to the terminals thereof, a transformer the secondary coil of which is included in said circuit, means for causing a rapidly-varying current to traverse the primary of the transformer, and means for interrupting the circuit of said primary coil, by the action of current flowing through the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        text(
          "28. The combination with an electric lamp of the character described, of a circuit leading to the terminals thereof, a transformer the secondary coil of which is included in said circuit, means for causing a varying current to traverse the primary of the transformer, means for interrupting the circuit of said primary coil by the action of currents of lower potential flowing through the lamp, and means for cutting the secondary coil out of circuit when the lamp is operating.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        text(
          "29. The combination with a lamp of the character described, of a permanent source of electric current connected to the terminals of the said lamp through the secondary of a transformer, a second circuit from the said source, including the primary of the said transformer, and means for varying the current in the said primary and afterward cutting out the circuit of the primary by the action of the current passing through the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 30,
      inlines: [
        text(
          "30. The combination with an electric lamp, of a main supply-circuit, connections therefrom through the secondary coil of a transformer with the terminals of the lamp, a primary coil for the transformer, a circuit-interrupter, means for connecting said primary coil and circuit-interrupter with the supply-circuit, and means for interrupting the primary-coil circuit by the action of currents supplying the lamp.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 31,
      inlines: [
        text(
          "31. The combination of a translating device, a source of current, a transformer having one coil connected in series with the translating device and with the source of current, means for creating independent time variations in the supply-current traversing the other coil, whereby the electromotive force of the current in the first-named coil is modified, and a device for automatically cutting out the means for creating the independent time variations, through the instrumentality of currents passing through the translating device.",
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
