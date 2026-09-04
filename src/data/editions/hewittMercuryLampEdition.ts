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
    "This short opening statement defines the subject as electric-lighting methods and apparatus before the specification narrows to particular vapor paths or starting arrangements.",
  ],
  3: [
    "Hewitt states the stated design objective: convert electrical energy through a vapor or gas efficiently while retaining simple, durable apparatus.",
  ],
  4: [
    "Figure 1 is identified as one complete lamp form; the immediately following figure references identify the modified electrode, operating circuits, and exhaustion apparatus.",
  ],
  5: [
    "The detailed figure description identifies tube 1, electrodes 2 and 5, chamber 4, the two lead-ins, the lower mercury quantity, and the conductive band near that lower electrode.",
  ],
  6: [
    "The specification returns to Figure 1 to explain why chamber 4 provides the radiating area that keeps the vapor path from overheating and extinguishing the lamp.",
  ],
  7: [
    "The Figure 4 spark-coil arrangement raises the starting potential by interrupting its primary coil; its secondary remains in the lamp path after the discharge conditions permit the main current to pass.",
  ],
  8: [
    "This is the grant's exact transition from the specification to the numbered claims, not an editorial claim summary.",
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
        "SPECIFICATION forming part of Letters Patent No. 682,690, dated September 17, 1901.",
        "Application filed April 5, 1900. Serial No. 11,605. (No model.)",
      ],
    },
    p(
      text("To all whom it may concern: Be it known that I, "),
      term(
        "PETER COOPER HEWITT",
        "Peter Cooper Hewitt (1861–1921), American electrical engineer and inventor of the mercury-vapor lamp, mercury-arc rectifier, and high-frequency radio alternator.",
      ),
      text(
        ", a citizen of the United States, and a resident of New York, in the county of New York and State of New York, have invented certain new and useful Improvements in Electric Lamps, of which the following is a specification.",
      ),
    ),
    p(text("My invention relates to methods of and apparatus for electric lighting.")),
    p(
      text(
        "The general purpose of the invention is to produce light by converting electric energy into light through the agency of vapors or gases as efficiently as possible and with simple and durable apparatus.",
      ),
    ),
    p(
      text("In the accompanying drawings, "),
      text("illustrating "),
      text("my invention, "),
      ref(
        "Figure 1",
        "#figure-1",
        "Complete source drawing sheet 1 — Figures 1 and 2, including the tubular mercury-vapor lamp",
        "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-01.png",
      ),
      text(" represents one form of a complete lamp."),
    ),
    p(
      text(
        "Referring to the figures, 1 represents a glass tube of such dimensions as may be required—say, for example, a tube of three-quarters of an inch in diameter and two or three feet in length and having a wall of such thickness as not to be fragile. The particular dimensions of the tube to be chosen are determined by the electromotive force and the current with which it is to be operated and other considerations which will be hereinafter pointed out. This tube is provided with two electrodes, indicated at 2 and 5, respectively. If the lamp is to be run by continuous current, the electrode 2 is usually the anode and the electrode 5 the cathode. In the drawings I have shown the electrode 2 as being of an inverted-cup shape; but other forms may be employed—such, for instance, as a closed spherical, oval, cylindrical, and other shapes. I have obtained excellent results by using a pure iron for this electrode; but other metals may be substituted. It is suspended within or near the neck of an enlargement or chamber 4, which I usually employ, this chamber serving to increase the heat-radiating capacity of the lamp and to retain impurities. The electrode 2 is suspended by leading-in conductor 7, of platinum or other suitable material, extending through the glass wall, and I usually provide a long seal 10 for protecting more or less of the leading-in conductor within the lamp. The electrode 5 is shown in this instance as being a small quantity of mercury. A leading-in conductor 8 connects with this electrode. Surrounding the lower end of the tube, adjacent to and usually projecting a slight distance, say, one-eighth of an inch above the level of the lower electrode, there is placed a thin band 9 of conducting material—such, for instance, as foil—and this is electrically connected by a conductor 13 with the leading-in wire 7.",
      ),
    ),
    p(
      text("As"),
      text(" already stated"),
      text(" in connection with "),
      ref(
        "Fig. 1",
        "#figure-1",
        "Complete source drawing sheet 1 — Figures 1 and 2, including the tubular mercury-vapor lamp",
        "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-01.png",
      ),
      text(
        ", the condensing and impurity-containing chamber 4 or its equivalent performs an important function in the operation of the lamp. As the lamp commences to operate heat accumulates, and the increasing temperature appears to soon result in increased resistance on the part of the vapor path. If the heat is not conducted away after the lamp has reached its proper working condition with the same rapidity that it is generated, the lamp may extinguish itself. The chamber 4 is therefore constructed with sufficient radiating surface to get rid of the excess heat and keep the lamp in the proper condition. The chamber 4 need not, however, necessarily surround the electrode 2; but it may be located elsewhere and be of other form, provided it is out of the vapor-path.",
      ),
    ),
    p(
      text(
        "I have used in some instances in place of the form of apparatus above described for producing the higher potential starting-current a simple spark-coil, as shown in ",
      ),
      ref(
        "Fig. 4",
        "#figure-4",
        "Complete source drawing sheet 2 — Figures 3 and 4, including the automatic starting circuit",
        "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-02.png",
      ),
      text(
        ", comprising a core 40, with a primary coil 41, adapted to be connected, by means of a switch 42, between the main conductors 14 and 15, and also provided with a secondary coil 43, one terminal of which is connected with the electrode 5 of the lamp and the remaining terminal with the main conductor 15. A switch 44 is included in the conductor 45, which leads from the electrode 2 to the main conductor 14. The coils 41 and 43 are so proportioned as to produce a higher difference of potential at the terminals of the coil 43 upon breaking the circuit of the coil 41, and the discharge from this coil suffices to produce in the vapor path of the lamp the proper conditions for permitting the current from the main circuit to flow through the lamp by way of the conductor 45 and the coil 43.",
      ),
    ),
    p(text("The invention claimed is:")),
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
