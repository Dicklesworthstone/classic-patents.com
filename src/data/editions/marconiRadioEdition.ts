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

/** Exact claim sequence manually checked against printed pages 8 through 11. */
export const marconiRadioClaims: readonly string[] = [
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, a circuit through the contact and means actuated by the circuit for shaking the contact.",
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, metallic plates connected to it, a circuit through the contact and means actuated by the circuit for shaking the contact.",
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, metallic plates connected to the contact, choking-coils connected to the contact, a circuit through the contact and means actuated by the circuit for shaking the contact.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, metallic plates connected to the powder, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, metallic plates connected to the powder, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, metallic plates connected to the powder, a circuit through the powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder and means actuated by the circuit for shaking the powder.",
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, a circuit through the contact, a relay actuated by the circuit and means actuated by the relay for shaking the contact.",
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, metallic plates connected to it, a circuit through the contact, a relay actuated by the circuit and means actuated by the relay for shaking the contact.",
  "In a receiver for electrical oscillations the combination of an imperfect electrical contact, metallic plates connected to the contact, choking-coils connected to the contact, a circuit through the coils and contact, a relay actuated by the circuit and means actuated by the relay for shaking the contact.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, metallic plates connected to the powder, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing metallic powder, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, metallic plates connected to the powder, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powders, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, metallic plates connected to the powder, a circuit through the powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube containing a mixture of metallic powder and mercury, metallic plates connected to the powder, choking-coils connected to the powder, a circuit through the coils and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, metallic powder between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powders between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, metallic plates connected to the plugs, a circuit through the plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
  "In a receiver for electrical oscillations the combination of a tube, metallic plugs in the tube, a mixture of metallic powder and mercury between the plugs, metallic plates connected to the plugs, choking-coils connected to the plugs, a circuit through the coils, plugs and powder, a relay actuated by the circuit and means actuated by the relay for shaking the powder.",
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
  const block = marconiRadioArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Marconi manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

const paragraphs: CuratedSpecificationInlines[] = [
  literal("To all whom it may concern:"),
  literal(
    "Be it known that I, GUGLIELMO MARCONI, student, a subject of the King of Italy, residing at 21 Burlington Road, London, in the county of Middlesex, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals and in Apparatus Therefor, of which the following is a specification.",
  ),
  [
    text(
      'According to this invention electrical signals, actions, or manifestations are transmitted through the air, earth, or water by means of oscillations of high frequency, such as have been called the "',
    ),
    term(
      "Hertz rays",
      "A period name for the rapidly oscillating electromagnetic disturbances associated with Hertz; Marconi uses them here as the wireless carrier of a signal.",
    ),
    text(
      '" or "Hertz oscillations." Usually all line-wires are dispensed with. At the transmitting-station I employ a ',
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
  [
    text(
      "At the receiving-station there is a local-battery circuit, containing any ordinary receiving instrument and an appliance for closing the circuit, the latter being actuated by the oscillations from the transmitting-station. When transmitting through the air and it is desired that the signal should only be sent in one direction, I place the oscillation-producer at the transmitting-station in the focus or focal line of a reflector directed to the receiving-station, and I place the ",
    ),
    term(
      "circuit-closer",
      "The receiving-side detector or switching appliance whose response to an incoming oscillation completes a separate local-battery circuit for the telegraphic instrument.",
    ),
    text(
      " at the receiving-station in a similar reflector directed toward the transmitting-station.",
    ),
  ],
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
  literal(
    "The mercury must not be in such a quantity as to clot or cake the filings. An almost imperceptible globule is sufficient for a tube. Instead of mixing the mercury with the powder one can obtain the same effects by slightly amalgamating the inner surfaces of the plugs which are to be in contact with the filings. Very little mercury must be used, just sufficient to brighten the surface of the metallic plugs without showing any free globules. The size of the tube and the distance between the two metallic stops may vary under certain limits. The greater the space allowed for the powder the larger and coarser ought to be the filings or grains.",
  ),
  literal(
    "I prefer to make my sensitive tubes of the following size: The tube j is one and one-half inches long and one-tenth or one-twelfth of an inch internal diameter. The length of the stops j2 is about one-fifth of an inch, and the distance between the stops is about one-thirtieth of an inch. I find that the smaller the space between the stops in the tube the more sensitive it proves, but the space cannot under ordinary circumstances be excessively shortened without injuring the fidelity of the transmission. The metallic powders ought not to be fine, but rather as coarse as can be produced by a large and rough file. All the very fine powder ought to be removed by blowing or sifting.",
  ),
  literal(
    "The tube must be sealed, but a vacuum inside it is not essential, except the slight vacuum which results from having heated it while sealing it. Care must also be taken not to heat the tube too much in the center when sealing it, as it would oxidize the surfaces of the silver stops and also the powder, which would diminish its sensitiveness. I use in sealing the tubes a hydrogen and air flame. A vacuum is, however, desirable, and I have used one of about one one-thousandth of an atmosphere, obtained by a mercury-pump. It is also necessary for the powder or grains to be dry and free from grease or dirt, and the files used in producing the same ought to be frequently washed and dried and used when warm.",
  ),
  [
    text(
      "If the tube has been well made, it should be sensitive to the induction of an ordinary electric bell when the same is working at one to two yards or more from the tube. In order to keep the ",
    ),
    term(
      "sensitive tube",
      "Marconi's powder-filled detector tube: a received oscillation changes the electrical behavior of its filings, allowing the local relay circuit to respond.",
    ),
    text(
      " j in good working order, it is desirable, but not absolutely necessary, not to allow more than one milliampere to flow through it when active. If a stronger current is necessary, several tubes may be put in derivation between the tuned plates, but this arrangement is not quite as satisfactory as the single tube. It is necessary when using tubes of the type I have described not to insert in the circuit more than one cell of the Leclanché type, as a higher electromotive force than 1.5 volts is apt to pass a current through the tube even when no oscillations are transmitted.",
    ),
  ],
  [
    text(
      "I can, however, construct tubes capable of working with a much higher electromotive force. ",
    ),
    figure("Fig. 6", "4-8"),
    text(
      " shows one of these tubes. In this tube instead of one space or gap filled with filings there are several spaces separated by sections of tight-fitting silver wire. A tube thus constructed, observing also the rules of construction of my tubes in general, will work satisfactorily if the electromotive force of the battery in circuit with the tube is equal to 1.2 volts multiplied by the number of gaps. With this tube also it is well not to allow a current of more than one milliampere to pass. The tube j may be replaced by other forms of imperfect electrical contacts, but this is not desirable.",
    ),
  ],
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
    "These choking-coils may, however, be sometimes replaced by simple thin wires. They may also be connected directly to the tube j. The local circuit in which the sensitive tube j is inserted contains a sensitive relay n, preferably wound to a resistance of about twelve hundred ohms. This resistance need not be necessarily that of the relay, but may be the sum of the resistance of the relay and another additional resistance. The relay ought to be one possessing small self-induction.",
  ),
  literal(
    "The plates k, tube j, and choking-coils k' are fastened by means of wire stitches o' to a thin glass tube o, preferably not longer than twelve inches, firmly fixed at one end to a strong piece of timber o2. This may be done by means of wooden or ebonite grasping-screws.",
  ),
  [
    text("I do the tapping automatically by the current started by the tube, employing a "),
    term(
      "trembler",
      "An electrically driven vibrating striker, akin to an electric-bell mechanism, used here to tap the detector so its filings can return to a responsive condition.",
    ),
    text(
      " p on the circuit of the relay n similar in construction to that of an electric bell, but having a shorter arm. The vibrator must be carefully adjusted. Preferably the blows should be directed slightly upward to prevent the filings from getting caked. In place of tapping the tube the powder can be disturbed by slightly moving outward and inward one or both of the stops j2, the trembler p being replaced by a small electromagnet whose armature is connected to the stop.",
    ),
  ],
  literal(
    "I ordinarily work the telegraphic receiver h (or other instruments) by a derivation, as shown, from the circuit which works the trembler p. They can also, however, be worked in series with the trembler. When working ordinary sounders or Morse apparatus, a special adjustment of the same is sometimes needed to enable one to obtain dots and dashes. Sometimes it is necessary to work the telegraphic instruments or relays from the back-stop of the first relay, as is done in some systems of multiple telegraphy. Such adjustments are known to telegraphic experts.",
  ),
  literal(
    "By means of a tube with multiple gaps it is possible to work the trembler and also the signaling or other apparatus direct on the circuit which contains the tube, but I prefer when possible to work with the single-gap tube and the relay, as shown. With a sensitive and well-constructed trembler it is also possible to work the trembler with the single-gap tube in series with it without the relay.",
  ),
  literal(
    "In derivation on the terminals of the relay n is placed an ordinary platinoid resistance double-wound (or wound on the ‘bight,’ as it is sometimes termed) coil q of about four times the resistance of the relay, which prevents the self-induction of the winding of the relay from affecting the sensitive tube. The circuit actuated by the relay contains an ordinary battery r of about twelve cells and the trembler p, the resistance of the winding of which should be about one thousand ohms, and the nucleus ought preferably to be of soft iron, hollow and split lengthwise, like most electromagnets used in telegraph instruments.",
  ),
  [
    text(
      "In series or derivation from this circuit is inserted the telegraphic or other apparatus h which one may desire to work. It is desirable that this instrument or apparatus, if on a derivation, should have a resistance equal to the resistance of the trembler p. A platinoid resistance h' of about five times the resistance of the instrument is inserted in derivation across the terminals of the instrument and connected as close to the same as possible. In derivation across the terminals of the trembler p is placed another platinoid resistance p', also of about five times the resistance of the trembler. A similar resistance p2 is inserted in a circuit connecting the vibrating contacts of the trembler. In derivation across the terminals of the relay-circuit it is well to have a liquid resistance s, which is constituted of a series of tubes, one of which is shown full size in ",
    ),
    figure("Fig. 8", "4-8"),
    text(", filled with water acidulated with sulphuric acid."),
  ],
  literal(
    "The number of these tubes in series across the said terminals ought to be about ten for a circuit of fifteen volts, so as to prevent, in consequence of their counter electromotive force, the current of the local battery from passing through them, but allowing the high-tension jerk of current generated at the opening of the circuit in the relay to pass quietly across them without producing perturbing sparks at the movable contact of the relay. It is also necessary to insert a platinoid resistance in derivation on any apparatus one may be working on the local circuits. These resistances ought also to be inserted in derivation on the terminals of any resistance which may be apt to give self-induction.",
  ),
  literal(
    "I have hitherto only mentioned the use of cylindrical reflectors, but it is also possible to use ordinary concave reflectors, preferably parabolic, such as are used for projectors. It is not essential to have a reflector at the transmitters and receivers, but in their absence the distance at which one can communicate is much smaller.",
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
  literal(
    "When using the last-described apparatus, it is not necessary to have the two instruments in view of each other, as it is of no consequence if they are separated by mountains or other obstacles. At the receiver it is possible to pick up the oscillations from the earth or water without having the plate w. This may be done by connecting the terminals of the sensitive tube j to two earths, preferably at a certain distance from each other and in a line with the direction from which the oscillations are coming. These connections must not be entirely conductive, but must contain a condenser of suitable capacity—say one square yard of surface. Balloons can also be used instead of plates on poles, provided they carry up a plate or are themselves made conductive by being covered with tinfoil.",
  ),
  literal(
    "As the height to which they may be sent is great, the distance at which communication is possible becomes greatly multiplied. Kites may also be successfully employed if made conductive by means of tinfoil. The apparatus above described is so sensitive that it is essential either that the transmitters and receivers at each station should be at a considerable distance from each other or that they should be screened from each other by stout metal plates. It is sufficient to have all the telegraphic apparatus in a metal box and any exposed part of the circuit of the receiver inclosed in metallic tubes which are in electrical communication with the box. When working through the earth or water, the local receiver must be switched out of circuit when the transmitter is at work, and this may also be done when working through air.",
  ),
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
    { kind: "paragraph", inlines: paragraphs[0] },
    { kind: "paragraph", inlines: paragraphs[1] },
    { kind: "paragraph", inlines: paragraphs[2] },
    { kind: "paragraph", inlines: paragraphs[3] },
    { kind: "paragraph", inlines: paragraphs[4] },
    { kind: "paragraph", inlines: paragraphs[5] },
    { kind: "paragraph", inlines: paragraphs[6] },
    { kind: "paragraph", inlines: paragraphs[7] },
    { kind: "paragraph", inlines: paragraphs[8] },
    { kind: "paragraph", inlines: paragraphs[9] },
    { kind: "paragraph", inlines: paragraphs[10] },
    { kind: "paragraph", inlines: paragraphs[11] },
    { kind: "paragraph", inlines: paragraphs[12] },
    { kind: "paragraph", inlines: paragraphs[13] },
    { kind: "paragraph", inlines: paragraphs[14] },
    { kind: "paragraph", inlines: paragraphs[15] },
    { kind: "paragraph", inlines: paragraphs[16] },
    { kind: "paragraph", inlines: paragraphs[17] },
    { kind: "paragraph", inlines: paragraphs[18] },
    { kind: "paragraph", inlines: paragraphs[19] },
    { kind: "paragraph", inlines: paragraphs[20] },
    { kind: "paragraph", inlines: paragraphs[21] },
    { kind: "paragraph", inlines: paragraphs[22] },
    { kind: "paragraph", inlines: paragraphs[23] },
    { kind: "paragraph", inlines: paragraphs[24] },
    { kind: "paragraph", inlines: paragraphs[25] },
    { kind: "paragraph", inlines: paragraphs[26] },
    { kind: "paragraph", inlines: paragraphs[27] },
    { kind: "paragraph", inlines: paragraphs[28] },
    { kind: "paragraph", inlines: paragraphs[29] },
    { kind: "paragraph", inlines: paragraphs[30] },
    { kind: "paragraph", inlines: paragraphs[31] },
    { kind: "paragraph", inlines: paragraphs[32] },
    { kind: "paragraph", inlines: paragraphs[33] },
    { kind: "paragraph", inlines: paragraphs[34] },
    { kind: "claim", number: 1, inlines: literal(marconiRadioClaims[0]) },
    { kind: "claim", number: 2, inlines: literal(marconiRadioClaims[1]) },
    { kind: "claim", number: 3, inlines: literal(marconiRadioClaims[2]) },
    { kind: "claim", number: 4, inlines: literal(marconiRadioClaims[3]) },
    { kind: "claim", number: 5, inlines: literal(marconiRadioClaims[4]) },
    { kind: "claim", number: 6, inlines: literal(marconiRadioClaims[5]) },
    { kind: "claim", number: 7, inlines: literal(marconiRadioClaims[6]) },
    { kind: "claim", number: 8, inlines: literal(marconiRadioClaims[7]) },
    { kind: "claim", number: 9, inlines: literal(marconiRadioClaims[8]) },
    { kind: "claim", number: 10, inlines: literal(marconiRadioClaims[9]) },
    { kind: "claim", number: 11, inlines: literal(marconiRadioClaims[10]) },
    { kind: "claim", number: 12, inlines: literal(marconiRadioClaims[11]) },
    { kind: "claim", number: 13, inlines: literal(marconiRadioClaims[12]) },
    { kind: "claim", number: 14, inlines: literal(marconiRadioClaims[13]) },
    { kind: "claim", number: 15, inlines: literal(marconiRadioClaims[14]) },
    { kind: "claim", number: 16, inlines: literal(marconiRadioClaims[15]) },
    { kind: "claim", number: 17, inlines: literal(marconiRadioClaims[16]) },
    { kind: "claim", number: 18, inlines: literal(marconiRadioClaims[17]) },
    { kind: "claim", number: 19, inlines: literal(marconiRadioClaims[18]) },
    { kind: "claim", number: 20, inlines: literal(marconiRadioClaims[19]) },
    { kind: "claim", number: 21, inlines: literal(marconiRadioClaims[20]) },
    { kind: "claim", number: 22, inlines: literal(marconiRadioClaims[21]) },
    { kind: "claim", number: 23, inlines: literal(marconiRadioClaims[22]) },
    { kind: "claim", number: 24, inlines: literal(marconiRadioClaims[23]) },
    { kind: "claim", number: 25, inlines: literal(marconiRadioClaims[24]) },
    { kind: "claim", number: 26, inlines: literal(marconiRadioClaims[25]) },
    { kind: "claim", number: 27, inlines: literal(marconiRadioClaims[26]) },
    { kind: "claim", number: 28, inlines: literal(marconiRadioClaims[27]) },
    { kind: "claim", number: 29, inlines: literal(marconiRadioClaims[28]) },
    { kind: "claim", number: 30, inlines: literal(marconiRadioClaims[29]) },
    { kind: "claim", number: 31, inlines: literal(marconiRadioClaims[30]) },
    { kind: "claim", number: 32, inlines: literal(marconiRadioClaims[31]) },
    { kind: "claim", number: 33, inlines: literal(marconiRadioClaims[32]) },
    { kind: "claim", number: 34, inlines: literal(marconiRadioClaims[33]) },
    { kind: "claim", number: 35, inlines: literal(marconiRadioClaims[34]) },
    { kind: "claim", number: 36, inlines: literal(marconiRadioClaims[35]) },
    { kind: "claim", number: 37, inlines: literal(marconiRadioClaims[36]) },
    { kind: "claim", number: 38, inlines: literal(marconiRadioClaims[37]) },
    { kind: "claim", number: 39, inlines: literal(marconiRadioClaims[38]) },
    { kind: "claim", number: 40, inlines: literal(marconiRadioClaims[39]) },
    { kind: "claim", number: 41, inlines: literal(marconiRadioClaims[40]) },
    { kind: "claim", number: 42, inlines: literal(marconiRadioClaims[41]) },
    { kind: "claim", number: 43, inlines: literal(marconiRadioClaims[42]) },
    { kind: "claim", number: 44, inlines: literal(marconiRadioClaims[43]) },
    { kind: "claim", number: 45, inlines: literal(marconiRadioClaims[44]) },
    { kind: "claim", number: 46, inlines: literal(marconiRadioClaims[45]) },
    { kind: "claim", number: 47, inlines: literal(marconiRadioClaims[46]) },
    { kind: "claim", number: 48, inlines: literal(marconiRadioClaims[47]) },
    { kind: "claim", number: 49, inlines: literal(marconiRadioClaims[48]) },
    { kind: "claim", number: 50, inlines: literal(marconiRadioClaims[49]) },
    { kind: "claim", number: 51, inlines: literal(marconiRadioClaims[50]) },
    { kind: "claim", number: 52, inlines: literal(marconiRadioClaims[51]) },
    { kind: "claim", number: 53, inlines: literal(marconiRadioClaims[52]) },
    { kind: "claim", number: 54, inlines: literal(marconiRadioClaims[53]) },
    { kind: "claim", number: 55, inlines: literal(marconiRadioClaims[54]) },
    { kind: "claim", number: 56, inlines: literal(marconiRadioClaims[55]) },
  ],
};

export const marconiRadioParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: [
    "This is the formal addressee of the specification. It supplies no mechanism or claim limit.",
  ],
  5: [
    "Marconi identifies himself, his London address, and the subject of the instrument: improvements in transmitting electrical impulses and signals and the apparatus used for them. This paragraph is the formal statement of invention, not a technical description.",
  ],
  6: [
    "The stated transmission medium may be air, earth, or water. The working signal is a high-frequency electrical oscillation, called a Hertz ray or Hertz oscillation in the source, and the system dispenses with a line wire between stations.",
  ],
  7: [
    "For a long transmission the coil or transformer stays energized while the operator interrupts the secondary discharge instead of repeatedly interrupting the primary. Oil immersion is a stated anti-arcing condition: without it, a long spark can continue after the key contacts separate.",
  ],
  8: [
    "The receiver has its own local-battery circuit and a circuit-closer that incoming oscillations actuate. For a directional air path, the transmitter's oscillator and the receiver's circuit-closer sit at the respective reflectors' focus or focal line, with the two reflectors facing one another.",
  ],
  9: [
    "This paragraph is the source's figure index. It assigns Fig. 1 to the air-transmission transmitter, Fig. 2 and 2a to transmitter and oscillator sections, Fig. 3 to a detail, Figs. 4 to 8 to the receiver and its components, Figs. 9 and 10 to alternate transmitter arrangements, and Fig. 11 to an alternate receiver arrangement.",
  ],
  10: [
    "In Fig. 1, battery a and Morse key b energize the Ruhmkorff coil c. Its secondary ends reach the adjustable ball system d and e inside insulating tubes. The threaded rod and ball-and-socket joint set the e-to-e gap; holes d5 admit vaseline, oil, or similar material around that central gap.",
  ],
  11: [
    "The source gives operating dimensions rather than a universal law: with an ordinary eight-inch-spark coil, the e-to-e gap is one twenty-fifth to one thirtieth inch and d-to-e is about one and one-half inches. Reflector f is cylindrical-parabolic and metal-faced; larger balls permit greater distance under otherwise equal conditions. The reported example uses four-inch brass balls and a ten-inch wave.",
  ],
  12: [
    "Reflector length and aperture should be at least twice the emitted wavelength. If the power source makes a very long spark, the central spark gap is divided into smaller series gaps by inserting roughly half-inch balls held in ebonite frames; this preserves the source's stated series-gap condition.",
  ],
  13: [
    "A rotating platinum contact in the primary interrupter keeps the coil discharge regular. Fig. 3 shows the central core c2 in screw c3; motor c4 rotates it. The claimed benefit is practical: smooth contacts resist sticking and last longer, while the patent says the motor wiring is omitted from the drawing.",
  ],
  14: [
    "At the receiver a battery drives an ordinary telegraph instrument, relay, or other apparatus that is to be worked at a distance. In Fig. 4, g is that battery and h is the telegraph instrument on relay n's derived circuit.",
  ],
  15: [
    "Fig. 5's circuit-closer is a glass or gutta-percha tube j filled with metal powder j'. Plates k at its ends are sized for electrical resonance with the received oscillations. Tight silver pieces j2 and platinum wires j3 make the sealed electrical ends; the paragraph preserves both the tube material option and the sealing construction.",
  ],
  16: [
    "The preferred detector filling is hard nickel with about ten percent hard-silver filings. More silver makes the tube more sensitive, but excessive sensitivity invites unwanted atmospheric or other electrical influence. A very small absorbed quantity of mercury also increases sensitivity; these are material limits, not interchangeable labels.",
  ],
  17: [
    "The powder must remain loose enough to move when tapped. A sealed tube need not be evacuated, although the source prefers a vacuum and reports about one one-thousandth of an atmosphere from a mercury pump. The detector's response therefore depends on powder condition as well as the circuit.",
  ],
  18: [
    "A nearly imperceptible mercury globule is sufficient; enough mercury to clot or cake the filings defeats the stated material condition. The alternative is slight amalgamation of the plug faces, with no free globules. A larger powder space calls for larger, coarser filings.",
  ],
  19: [
    "The source fixes a preferred tube length of one and one-half inches, a one-tenth or one-twelfth inch bore, one-fifth inch stops, and an approximately one-thirtieth inch stop gap. It balances greater sensitivity from a smaller gap against loss of transmission fidelity, and rejects fine powder in favor of coarse filings cleared of fines.",
  ],
  20: [
    "Sealing must avoid overheating, which oxidizes silver stops and powder and reduces sensitivity. A hydrogen-and-air flame, a desirable mercury-pump vacuum, dry grease-free grains, and clean warm files are all stated fabrication conditions.",
  ],
  21: [
    "A well-made tube should respond to an ordinary electric bell one to two yards away. The source advises keeping active current below one milliampere; several parallel tubes are possible but less satisfactory than one. A Leclanché cell above 1.5 volts risks false conduction when no oscillations arrive.",
  ],
  22: [
    "Fig. 6 replaces one filing gap with several gaps separated by tight silver-wire sections, allowing a battery voltage of 1.2 volts times the number of gaps while retaining the one-milliampere caution. The text permits other imperfect contacts only as a less desirable substitute for tube j.",
  ],
  23: [
    "The plates k are copper, aluminium, or another metal, about one-half inch or more wide and about one-fiftieth inch thick, with length tuned to the received oscillation. Fig. 7's tinfoil strip m, cut at m2, is the stated adjustable spark detector for finding a suitable plate length, not the sensitive powder tube itself.",
  ],
  24: [
    "The two plates reach the local circuit through small choking-coils k': thin insulated copper wire on a short iron core. Their purpose is to keep the high-frequency oscillation induced at the plates from leaking along local-battery wiring and weakening its action on sensitive tube j.",
  ],
  25: [
    "The source permits thin-wire substitutes or direct tube connections for the choking-coils. The local circuit includes sensitive relay n, preferably about 1,200 ohms in total effective resistance and with small self-induction; the stated resistance may include added resistance, not just the relay winding.",
  ],
  26: [
    "Plates k, tube j, and coils k' are fastened with wire stitches to thin glass tube o, normally no longer than twelve inches, held to timber o2 with wooden or ebonite grasping screws. This is the physical mounting stated in the receiver description.",
  ],
  27: [
    "Trembler p is a relay-circuit, short-arm bell-like vibrator that taps upward to avoid caking. The source also allows a small electromagnet to move stop j2 rather than tap the tube; either action restores the detector after it conducts.",
  ],
  28: [
    "The telegraph instrument h may be on a derived circuit from trembler p or in series with it. Ordinary sounders sometimes need adjustment for dots and dashes, and the source allows operation from the first relay's back-stop in multiple-telegraph arrangements.",
  ],
  29: [
    "A multi-gap tube can work trembler and signalling apparatus directly, but the source prefers the single-gap tube with relay. It allows a sensitive well-made trembler in series with a single-gap tube without the relay, preserving both operating alternatives.",
  ],
  30: [
    "Double-wound platinoid coil q, about four times relay n's resistance, is placed across the relay terminals to stop relay self-induction from disturbing tube j. The relay-operated circuit uses about twelve battery cells, trembler p near 1,000 ohms, and preferably a hollow lengthwise-split soft-iron core.",
  ],
  31: [
    "Instrument h can be series or shunt connected, but a shunt instrument should match trembler p's resistance. Platinoid resistances h', p', and p2 are placed in the stated shunt positions, and liquid resistance s is a series of sulphuric-acid-water tubes, with Fig. 8 showing one tube.",
  ],
  32: [
    "About ten liquid-resistance tubes serve a fifteen-volt circuit: they block ordinary local-battery current yet pass the high-tension opening transient without sparking at the relay contact. Similar shunt resistances are required wherever self-induction might arise on the local circuit.",
  ],
  33: [
    "Cylindrical reflectors are not exclusive: ordinary concave, preferably parabolic projector reflectors are permitted. A reflector is optional but its absence materially shortens the distance at which the stations can communicate.",
  ],
  34: [
    "For long distance, Fig. 9 suspends metallic plates t2 from a rope between poles t and connects them through spheres e and nearby balls t3 to coil or transformer c. The balls t3 are optional because thin insulated wire can connect the plates to the coil or transformer directly.",
  ],
  35: [
    "For earth or water transmission, Fig. 10 connects one transmitter sphere to earth E and the other to an insulated elevated plate u on pole v. Fig. 11 gives the receiver's corresponding sensitive-tube connection to earth and a similar plate w. The source expressly relates greater communication distance to larger and higher plates.",
  ],
  36: [
    "The earth-or-water arrangement can work without line-of-sight between stations. It may pick up oscillations through earth or water without plate w by using two separated earths in the arrival direction, provided the connections include suitable condensers; a balloon carrying or serving as a tin-foil conductor is another stated elevated option.",
  ],
  37: [
    "Greater height multiplies possible distance; tin-foil conductive kites are also proposed. Because the apparatus is sensitive, local transmitters and receivers must be separated or screened with stout metal plates. A metal box and electrically connected metallic tubes screen the telegraph apparatus and exposed receiver circuit.",
  ],
  38: [
    "This is the transition from the detailed specification to the legal claims. The claims that follow define the combinations for which the inventor seeks legal protection; they should not be collapsed into a general assertion that all radio hardware is claimed.",
  ],
};
