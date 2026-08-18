import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];
const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const previews = {
  "1-3": {
    src: "/patents/figures/us-586193-marconi-radio/figs-1-to-3-source-crop-v1.png",
    alt: "Figures 1, 2, 2a, and 3 from US 586,193: spark transmitter, reflector, and oscillator section.",
    width: 1180,
    height: 1450,
  },
  "4-8": {
    src: "/patents/figures/us-586193-marconi-radio/figs-4-to-8-source-crop-v1.png",
    alt: "Figures 4 through 8 from US 586,193: receiver, sensitive tube, detector, and liquid resistance.",
    width: 1180,
    height: 1350,
  },
  "9-11": {
    src: "/patents/figures/us-586193-marconi-radio/figs-9-to-11-source-crop-v1.png",
    alt: "Figures 9 through 11 from US 586,193: long-distance, earth-or-water transmission arrangements.",
    width: 1180,
    height: 1260,
  },
} as const;

const figure = (value: string, group: keyof typeof previews): CuratedSpecificationInline => ({
  kind: "reference",
  text: value,
  href: "#",
  referenceType: "figure",
  label: `Preview ${value} from the original US 586,193 facsimile`,
  figurePreviews: [previews[group]],
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const noRelay = (medium: string, extras = "") =>
  `In a receiver for electrical oscillations the combination of ${medium}${extras}, a circuit through the ${medium.includes("contact") ? "contact" : medium.includes("plugs") ? "plugs and powder" : "powder"} and means actuated by the circuit for shaking the ${medium.includes("contact") ? "contact" : "powder"}.`;
const withRelay = (medium: string, extras = "") =>
  `In a receiver for electrical oscillations the combination of ${medium}${extras}, a circuit through the ${medium.includes("contact") ? "contact" : medium.includes("plugs") ? "plugs and powder" : "powder"}, a relay actuated by the circuit and means actuated by the relay for shaking the ${medium.includes("contact") ? "contact" : "powder"}.`;

/** Exact claim sequence manually checked against printed pages 8 through 11. */
export const marconiRadioClaims: readonly string[] = [
  noRelay("an imperfect electrical contact"),
  noRelay("an imperfect electrical contact", ", metallic plates connected to it"),
  noRelay(
    "an imperfect electrical contact",
    ", metallic plates connected to the contact, choking-coils connected to the contact",
  ),
  noRelay("a tube containing metallic powder"),
  noRelay("a tube containing metallic powder", ", metallic plates connected to the powder"),
  noRelay(
    "a tube containing metallic powder",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  noRelay("a tube containing a mixture of metallic powders"),
  noRelay(
    "a tube containing a mixture of metallic powders",
    ", metallic plates connected to the powder",
  ),
  noRelay(
    "a tube containing a mixture of metallic powders",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  noRelay("a tube containing a mixture of metallic powder and mercury"),
  noRelay(
    "a tube containing a mixture of metallic powder and mercury",
    ", metallic plates connected to the powder",
  ),
  noRelay(
    "a tube containing a mixture of metallic powder and mercury",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  noRelay("a tube, metallic plugs in the tube, metallic powder between the plugs"),
  noRelay(
    "a tube, metallic plugs in the tube, metallic powder between the plugs",
    ", metallic plates connected to the plugs",
  ),
  noRelay(
    "a tube, metallic plugs in the tube, metallic powder between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  noRelay("a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs"),
  noRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs",
    ", metallic plates connected to the plugs",
  ),
  noRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  noRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
  ),
  noRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
    ", metallic plates connected to the plugs",
  ),
  noRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  withRelay("an imperfect electrical contact"),
  withRelay("an imperfect electrical contact", ", metallic plates connected to it"),
  withRelay(
    "an imperfect electrical contact",
    ", metallic plates connected to the contact, choking-coils connected to the contact",
  ),
  withRelay("a tube containing metallic powder"),
  withRelay("a tube containing metallic powder", ", metallic plates connected to the powder"),
  withRelay(
    "a tube containing metallic powder",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  withRelay("a tube containing a mixture of metallic powders"),
  withRelay(
    "a tube containing a mixture of metallic powders",
    ", metallic plates connected to the powder",
  ),
  withRelay(
    "a tube containing a mixture of metallic powders",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  withRelay("a tube containing a mixture of metallic powder and mercury"),
  withRelay(
    "a tube containing a mixture of metallic powder and mercury",
    ", metallic plates connected to the powder",
  ),
  withRelay(
    "a tube containing a mixture of metallic powder and mercury",
    ", metallic plates connected to the powder, choking-coils connected to the powder",
  ),
  withRelay("a tube, metallic plugs in the tube, metallic powder between the plugs"),
  withRelay(
    "a tube, metallic plugs in the tube, metallic powder between the plugs",
    ", metallic plates connected to the plugs",
  ),
  withRelay(
    "a tube, metallic plugs in the tube, metallic powder between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  withRelay("a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs"),
  withRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs",
    ", metallic plates connected to the plugs",
  ),
  withRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  withRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
  ),
  withRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
    ", metallic plates connected to the plugs",
  ),
  withRelay(
    "a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs",
    ", metallic plates connected to the plugs, choking-coils connected to the plugs",
  ),
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, an imperfect electrical contact at the receiving-station, an earth connection to one end of the contact, an insulated conductor connected to the other end and a circuit through the contact.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, an imperfect electrical contact at the receiving-station, an earth connection to one end of the contact, an insulated conductor connected to the other end, a circuit through the contact and means actuated by the circuit for shaking the contact.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, an imperfect electrical contact at the receiving-station, choking-coils connected to each end of the contact, an earth connection to one end of the imperfect contact, an insulated conductor connected to the other end and a circuit through the coils and contact.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, an imperfect electrical contact at the receiving-station, choking-coils connected to each end of the contact, an earth connection to one end of the imperfect contact, an insulated conductor connected to the other end, a circuit through the coils and contact and means actuated by the circuit for shaking the contact.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, a tube containing metallic powder at the receiving-station, an earth connection to one end of the powder, an insulated conductor connected to the other end and a circuit through the powder.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, a tube containing metallic powder at the receiving-station, an earth connection to one end of the powder, an insulated conductor connected to the other end, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, a tube containing metallic powder at the receiving-station, choking-coils connected to each end of the powder, an earth connection to one end of the powder, an insulated conductor connected to the other end and a circuit through the coils and powder.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, a tube containing metallic powder at the receiving-station, choking-coils connected to each end of the powder, an earth connection to one end of the powder, an insulated conductor connected to the other end, a circuit through the coils and powder and means actuated by the circuit for shaking the powder.",
  "The combination of a spark-producer at the transmitting-station, an earth connection to one end of the spark-producer, an insulated conductor connected to the other end, a tube containing metallic powder at the receiving-station, choking-coils and earth connection through condensers connected to each end of the powder, a circuit through the coils and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations, the combination of an imperfect electrical contact, a circuit through the contact, an electric trembler shaking the contact, and means for preventing the self-induction of the trembler from affecting the contact.",
  "A receiver for electrical oscillatory impulses having a medium whose electrical resistance is altered by the received electrical oscillations, a trembler or shaker for acting upon the variable-resistance medium to restore it to its normal condition of electrical resistance, and means for controlling such trembler to cause it to act upon the variable-resistance medium to restore it to its normal condition after each reception of such oscillatory impulses.",
  "A receiver for electrical oscillatory impulses having a medium whose electrical resistance is altered by the received electrical oscillations, a trembler or shaker for acting upon the variable-resistance medium to restore it to its normal condition of electrical resistance, means controlling such trembler to cause it to act upon the variable-resistance medium to restore it to its normal condition after each reception of such oscillatory impulses, and means for rendering manifest said electrical oscillatory impulses consecutively received, whereby defined signals may be given out by the receiver.",
  "The combination of a transmitter capable of producing at will of the operator electric oscillatory impulses or rays, and a receiver responsive thereto having a variable-resistance medium whose resistance is altered by such received oscillatory impulses, means controlled by the received oscillations for restoring such medium to its normal condition after each reception of such oscillations, and means for rendering manifest the received oscillations, whereby signals sent from the transmitter may be received upon the receiver.",
  "The combination of a transmitter capable of producing electrical oscillations or rays at the will of the operator, and a receiver located at a distance and having a conductor tuned to respond to such oscillations, a variable-resistance medium, in circuit with the conductor, whose resistance is altered by the received oscillations, means controlled by the received oscillations for restoring the resistance medium to its normal condition after each reception of such oscillations, and means for rendering the received oscillations manifest.",
];

export function marconiRadioClaimText(number: number): string {
  const claim = marconiRadioClaims[number - 1];
  if (!claim) throw new Error(`Marconi manual edition is missing claim ${number}.`);
  return claim;
}

const paragraphs: CuratedSpecificationInlines[] = [
  literal("To all whom it may concern:"),
  literal(
    "Be it known that I, GUGLIELMO MARCONI, student, a subject of the King of Italy, residing at 21 Burlington Road, London, in the county of Middlesex, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals and in Apparatus Therefor, of which the following is a specification.",
  ),
  [
    text(
      'According to this invention electrical signals, actions, or manifestations are transmitted through the air, earth, or water by means of oscillations of high frequency, such as have been called the "Hertz rays" or "Hertz oscillations." Usually all line-wires are dispensed with. At the transmitting-station I employ a ',
    ),
    term(
      "Ruhmkorff coil",
      "An induction coil with an interrupted primary current that generates high voltage at its secondary. Marconi permits another source of high-tension electricity in its place.",
    ),
    text(
      ", having in its primary circuit a Morse key or other signaling instrument and at its poles appliances for producing the desired oscillations. The Ruhmkorff coil may, however, be replaced by any other source of high-tension electricity.",
    ),
  ],
  literal(
    "When working with large amounts of energy, it is, however, better to keep the coil or transformer constantly working for the time during which one is transmitting, and instead of interrupting the current of the primary interrupting the discharge of the secondary. In this case the contacts of the key should be immersed in oil, as otherwise, owing to the length of the spark, the current will continue to pass after the contacts have been separated.",
  ),
  literal(
    "At the receiving-station there is a local-battery circuit, containing any ordinary receiving instrument and an appliance for closing the circuit, the latter being actuated by the oscillations from the transmitting-station. When transmitting through the air and it is desired that the signal should only be sent in one direction, I place the oscillation-producer at the transmitting-station in the focus or focal line of a reflector directed to the receiving-station, and I place the circuit-closer at the receiving-station in a similar reflector directed toward the transmitting-station.",
  ),
  [
    figure("Figure 1", "1-3"),
    text(
      " is a diagrammatic front elevation of the instruments at the transmitting-station when signaling through the air, and ",
    ),
    figure("Fig. 2", "1-3"),
    text(" is a vertical section of the transmitter. "),
    figure("Fig. 2a", "1-3"),
    text(" is a longitudinal section of the oscillator to a larger scale. "),
    figure("Fig. 3", "1-3"),
    text(" shows a detail on a larger scale. "),
    figure("Fig. 4", "4-8"),
    text(" is a diagrammatic front elevation of the instruments at the receiving-station. "),
    figure("Fig. 5", "4-8"),
    text(" is a full-sized view of the receiver. "),
    figure("Fig. 6", "4-8"),
    text(" shows a modification of the tube j. "),
    figure("Fig. 7", "4-8"),
    text(" shows the detector. "),
    figure("Fig. 8", "4-8"),
    text(" is a full-sized view of the liquid-resistance. "),
    figure("Figs. 9 and 10", "9-11"),
    text(" show modifications of the arrangements at the transmitting-station. "),
    figure("Fig. 11", "9-11"),
    text(" shows a modification of the arrangements at the receiving-station."),
  ],
  [
    text("Referring now to "),
    figure("Fig. 1", "1-3"),
    text(
      ", a is a battery, and b an ordinary Morse key closing the circuit through the primary of a Ruhmkorff coil c. The terminals c' of the secondary circuit of the coil are connected to two metallic balls d d, fixed by heat or otherwise at the ends of tubes d', d', ",
    ),
    figure("Fig. 2a", "1-3"),
    text(
      ", of insulating material, such as ebonite or vulcanite. e e are similar balls fixed in the other ends of the tubes d'. The tubes d' fit tightly in a similar tube d2, having covers d3, through which pass rods d4, connecting the balls d to the conductors. One (or both) of the rods d4 is connected to the ball d by a ball-and-socket joint and has a screw-thread upon it working in a nut in the cover d3. By turning the rod therefore the distance of the balls e apart can be adjusted. d5 are holes in the tube d2, through which vaseline, oil, or like material is introduced into the space between the balls e.",
    ),
  ],
  literal(
    "The balls d and e are preferably of solid brass or copper, and the distance they should be apart depends on the quantity and electromotive force of the electricity employed, the effect increasing with the distance so long as the discharge passes freely. With a coil giving an ordinary eight-inch spark the distance between e and e should be from one twenty-fifth to one-thirtieth of an inch and the distance between d and e about one and a half inches. f is a cylindrical parabolic reflector made by bending a metallic sheet, preferably of brass or copper, to form and fixing it to metallic or wooden ribs f'. Other conditions being equal the larger the balls the greater is the distance at which it is possible to communicate. I have generally used balls of solid brass of four inches diameter, giving oscillations of ten inches length of wave.",
  ),
  literal(
    "The reflectors applied to the receiver and transmitter ought to be preferably in length and opening double at least of the length of wave emitted from the oscillator. If a very powerful source of electricity giving a very long spark be employed, it is preferable to divide the spark gap between the central balls of the oscillator into several smaller gaps in series. This may be done by introducing between the big balls smaller ones, of about half an inch diameter, held in position by ebonite frames.",
  ),
  [
    text(
      "I find that the regularity and power of the discharge of an ordinary Ruhmkorff coil with a trembler-break on its primary is greatly improved by causing one of the contacts of the vibrating break to revolve rapidly. I do this by having a revoluble central core c2, ",
    ),
    figure("Fig. 3", "1-3"),
    text(
      ", in the ordinary screw c3, which is in communication with the platinum contacts. I cause the said central core with one of the platinum contacts attached to it to revolve by connecting it to a small electric motor c4. This motor can be worked by the same circuit that works the coil, or, if necessary, by a separate circuit. The connections are not shown in the drawings. By this means the platinums are kept smooth and any tendency to stick is removed. They last also much longer.",
    ),
  ],
  [
    text(
      "At the receiving-station is a battery whose circuit includes an ordinary telegraphic instrument (or it may be a relay or other apparatus which it is desired to work from a distance) and a circuit-closer. In ",
    ),
    figure("Fig. 4", "4-8"),
    text(", g is the battery, and h a telegraphic instrument on the derived circuit of a relay n."),
  ],
  [
    text("The appliance I employ as a circuit-closer is shown full size at "),
    figure("Fig. 5", "4-8"),
    text(
      " and consists of a glass tube j, containing metallic powder or grains of metal j', each end of the column of powder being connected to a metallic plate k of suitable length to cause the system to resonate electrically in unison with the electrical oscillations transmitted. The glass tube may be replaced in some cases by one of guttapercha or like material. Two short pieces of thick silver wire j2 of the same diameter as the internal diameter of the tube j, so as to fit tightly in it, are joined to two pieces of platinum wire j3. The tube is closed and sealed onto the platinum wires j3 at both ends.",
    ),
  ],
  [
    text(
      "Many metals can be employed for producing the powder or filings j'; but I prefer to use a mixture of two or more different metals. I find hard nickel to be the best metal, and I prefer to add to the nickel filings about ten per cent. of hard-silver filings, which increase greatly the sensitiveness of the tube to electric oscillations. By increasing the proportion of silver powder or grains the sensitiveness of the tube also increases; but it is better for ordinary work not to have a tube of too great sensitiveness, as it might be influenced by atmospheric or other electricity. The sensitiveness can also be increased by adding a very small amount of mercury to the filings and mixing up until the mercury is absorbed.",
    ),
  ],
  literal(
    "The powder ought not to be compressed between the stops, but rather loose and in such a condition that when the tube is tapped the powder may be seen to move. The tube must be sealed, but a vacuum inside it is not essential, except the slight vacuum which results from having heated it while sealing it. A vacuum is, however, desirable, and I have used one of about one-one-thousandth of an atmosphere, obtained by a mercury-pump.",
  ),
  [
    text(
      "The plates k are of copper or aluminium or other metal, about half an inch or more broad, about one-fiftieth of an inch thick, and preferably of such a length as to be electrically tuned with the electric oscillations transmitted. The means I adopt for fixing the length of the plates is as follows: I stick a rectangular strip of tinfoil m (see ",
    ),
    figure("Fig. 7", "4-8"),
    text(
      ") about twenty inches long by means of a weak solution of gum onto a glass plate m'. Then by means of a very sharp penknife or point I cut across the middle of the tinfoil, leaving a mark of division m2.",
    ),
  ],
  [
    text(
      "The two plates k communicate with the local circuit through two very small coils k', which I will call ",
    ),
    term(
      "choking-coils",
      "Small inductive coils placed in the local circuit. The specification says their purpose is to keep high-frequency oscillation from dissipating along the local-battery wires.",
    ),
    text(
      ", formed by winding a few inches of very thin and insulated copper wire around a bit of iron wire about an inch and a half long. The object of these choking-coils is to prevent the high-frequency oscillation induced across these plates by the transmitter from dissipating itself by running along the local-battery wires which might weaken its effect on the sensitive tube j.",
    ),
  ],
  literal(
    "I do the tapping automatically by the current started by the tube, employing a trembler p on the circuit of the relay n similar in construction to that of an electric bell, but having a shorter arm. The vibrator must be carefully adjusted. Preferably the blows should be directed slightly upward to prevent the filings from getting caked. In place of tapping the tube the powder can be disturbed by slightly moving outward and inward one or both of the stops j2, the trembler p being replaced by a small electromagnet whose armature is connected to the stop.",
  ),
  [
    text(
      "I find it convenient when transmitting across long distances to make use of the transmitter shown in ",
    ),
    figure("Fig. 9", "9-11"),
    text(
      ". t t are two poles connected by a rope t', to which are suspended by means of insulating suspenders two metallic plates t2, preferably in the form of cylinders closed at the top, connected to the spheres e and to the other balls t3 in proximity to the spheres c', in communication with the coil or transformer c. The balls t3 are not absolutely necessary, as the plates t2 may be made to communicate with the coil or transformer by means of thin insulated wires.",
    ),
  ],
  [
    text("When transmitting through the earth or water, I use a transmitter as shown in "),
    figure("Fig. 10", "9-11"),
    text(
      ". I connect one of the spheres d to earth E, preferably by a thick wire, and the other to a plate or conductor u, suspended on a pole v and insulated from earth. At the receiving-station, ",
    ),
    figure("Fig. 11", "9-11"),
    text(
      ", I connect one terminal of the sensitive tube j to earth E, also by a thick wire, and the other to a plate or conductor w, preferably similar to u. The larger the plates of the receiver and transmitter and the higher from the earth the plates are suspended the greater is the distance at which it is possible to communicate.",
    ),
  ],
  literal("What I claim is:"),
];

export const marconiRadioArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ed185aa2e6974608279d044840f1b9176432cea9eee946a6ada7d020e9c6b352",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "GUGLIELMO MARCONI, OF LONDON, ENGLAND.",
        "TRANSMITTING ELECTRICAL SIGNALS.",
        "Specification forming part of Letters Patent No. 586,193, dated July 13, 1897.",
        "Application filed December 7, 1896. Serial No. 614,838. (No model.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 3",
      title: "Transmitter and oscillator",
      description: [figure("Figs. 1 to 3", "1-3")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 3",
      title: "Receiver and detector",
      description: [figure("Figs. 4 to 8", "4-8")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 3",
      title: "Alternative arrangements",
      description: [figure("Figs. 9 to 11", "9-11")],
    },
    ...paragraphs.map((inlines) => ({ kind: "paragraph" as const, inlines })),
    ...marconiRadioClaims.map((claim, index) => ({
      kind: "claim" as const,
      number: index + 1,
      inlines: literal(claim),
    })),
  ],
};

export const marconiRadioParallelReadings: Readonly<Record<number, readonly string[]>> =
  Object.fromEntries(
    marconiRadioArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph"
        ? [
            [
              index,
              [
                `This source paragraph is paired with its patent-specific Plain English explanation in the Marconi record; it retains the stated apparatus, electrical path, and operating constraint rather than replacing the legal text.`,
              ],
            ],
          ]
        : [],
    ),
  );
