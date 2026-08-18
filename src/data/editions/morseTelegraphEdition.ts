import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];

const SHEETS = {
  1: {
    src: "/patents/figures/us-1647-morse-telegraph-sheet-1-preview.png",
    alt: "Sheet 1 of 3 from US 1,647: Morse's Examples 1 through 6, including numeral and letter sign systems.",
    width: 1392,
    height: 2045,
  },
  2: {
    src: "/patents/figures/us-1647-morse-telegraph-sheet-2-preview.png",
    alt: "Sheet 2 of 3 from US 1,647: Morse's Examples 7 through 9, including straight and circular port-rules.",
    width: 1392,
    height: 2045,
  },
  3: {
    src: "/patents/figures/us-1647-morse-telegraph-sheet-3-preview.png",
    alt: "Sheet 3 of 3 from US 1,647: Example 10, the register and its clockwork, marking, and alarm details.",
    width: 1392,
    height: 2045,
  },
} as const;

/** Every reference is selected at its printed occurrence. No prose is parsed. */
const figure = (label: string, sheet: keyof typeof SHEETS): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open ${label} on the matching US 1,647 source drawing sheet`,
  figurePreviews: [SHEETS[sheet]],
});

const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
  label: "1840 patent vocabulary",
});

const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

export const morseTelegraphArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
  preparedBy: "Classic Patents editorial agent (codex-foxtrot)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "SAMUEL F. B. MORSE, OF NEW YORK, N. Y.",
        "IMPROVEMENT IN THE MODE OF COMMUNICATING INFORMATION BY SIGNALS BY THE APPLICATION OF ELECTRO-MAGNETISM.",
        "No. 1,647. Specification forming part of Letters Patent No. 1,647, dated June 20, 1840.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 3",
      title: "Examples 1 through 6: signs, type, and port-rules",
      description: text(
        "S. F. B. Morse. Telegraph Signs. No. 1,647. Patented Jun. 20, 1840. The sheet contains Examples 1 through 6 and the inventor and witness signatures.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 3",
      title: "Examples 7 through 9: type-rules and signal levers",
      description: text(
        "S. F. B. Morse. Telegraph Signs. No. 1,647. Patented Jun. 20, 1840. The sheet contains the straight and circular port-rules, type feeder, and signal-lever details.",
      ),
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 3",
      title: "Example 10: register",
      description: text(
        "S. F. B. Morse. Telegraph Signs. No. 1,647. Patented Jun. 20, 1840. The sheet gives perspective, birdseye, side, and section views of the register, plus its alarm detail.",
      ),
    },
    p(text("To all whom it may concern:")),
    p([
      {
        kind: "text",
        text: 'Be it known that I, the undersigned, SAMUEL F. B. MORSE, of the city, county, and State of New York, have invented a new and useful machine and system of signs for transmitting intelligence between distant points by the means of a new application and effect of electro-magnetism in producing sounds and signs, or either, and also for recording permanently by the same means, and application, and effect of electro-magnetism, any signs thus produced and representing intelligence, transmitted as before named between distant points; and I denominate said invention the "American Electro-Magnetic Telegraph," of which the following is a full and exact description, to wit:',
      },
    ]),
    p([
      {
        kind: "text",
        text: 'It consists of the following parts - first, of a circuit of electric or galvanic conductors from any generator of electricity or galvanism and of electro-magnets at any one or more points in said circuit; second, a system of signs by which numerals, and words represented by numerals, and thereby sentences of words, as well as of numerals, and letters of any extent and combination of each, are communicated to any one or more points in the before-described circuit; third, a set of type adapted to regulate the communication of the above-mentioned signs, also cases for convenient keeping of the type and rules in which to set and use the type; fourth, an apparatus called the "straight port-rule," and another called the "circular port-rule," each of which regulates the movement of the type when in use, and also that of the signal-lever; fifth, a signal-lever which breaks and connects the circuit of conductors; sixth, a register which records permanently the signs communicated at any desired points in the circuit; seventh, a dictionary or vocabulary of words to which are prefixed numerals for the uses hereinafter described; eighth, modes of laying the circuit of conductors.',
      },
    ]),
    p([
      {
        kind: "text",
        text: "The circuit of conductors may be made of any metal - such as copper, or iron wire, or strips of copper or iron, or of cord or twine, or other substances - gilt, silvered, or covered with any thin metal leaf properly insulated and in the ground, or through or beneath the water, or through the air. By causing an electric or galvanic current to pass through the circuit of conductors, aid aforesaid, by means of any generator of electricity or galvanism, to one or more electro-magnets placed at any point or points in said circuit, the magnetic power thus concentrated in such magnets is used for the purposes of producing sounds and visible signs, and for permanently recording the latter at any and each of said points at the pleasure of the operator and in the manner hereinafter described - that is to say, by using the system of signs which is formed of the following parts and variations, viz:",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Signs of numerals consist, first, of ten dots or punctures, made in measured distances of equal extent from each other, upon paper or any substitute for paper, and in number corresponding with the numeral desired to be represented. Thus one dot or puncture for the numeral 1; two dots or punctures for the numeral 2, three of the same for 3, four for 4, five for 5, six for 6, seven for 7, eight for 8, nine for 9, and ten for 0, as particularly represented on the annexed drawing marked ",
      },
      figure("Example 1, Mode 1", 1),
      {
        kind: "text",
        text: ", in which is also included a second character, to represent a cipher, if preferred.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Signs of numerals consist, secondly, of marks made as in the case of dots, and particularly represented on the annexed drawing marked ",
      },
      figure("Example 1, Mode 2", 1),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "Signs of numerals consist, thirdly, of characters drawn at measured distances in the shape of the teeth of a common saw by the use of a pencil or any instrument for marking. The points corresponding to the teeth of a saw are in number to correspond with the numeral desired to be represented, as in the case of dots or marks in the other modes described, and as particularly represented in the annexed drawing marked ",
      },
      figure("Example 1, Mode 3", 1),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "Signs of numerals consist, fourthly, of dots and lines separately and conjunctively used as follows, the numerals 1, 2, 3, and 4 being represented by dots, as in Mode 1, first given above; the numeral 5 is represented by a line equal in length to the space between the two dots of any other numeral; 6 is represented by the addition of a dot to the line representing 5; 7 is represented by the addition of two dots to said line; 8 is represented by prefixing a dot to said line; 9 is represented by two dots prefixed to said line; and 0 is represented by two lines, each of the length of said line that represents the number 5; said signs are particularly set forth in the annexed drawings marked ",
      },
      figure("Example 1, Mode 4", 1),
      { kind: "text", text: "." },
    ]),
    p(
      text(
        "Either of said modes are to be used as may be preferred or desired and in the method hereinafter described.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "The sign of a distinct numeral, or of a compound numeral when used in a sentence of words or of numerals, consists of a distance or space of separation between the characters of greater extent than the distance used in separating the characters that compose any such distinct or compound numeral. An illustration of this sign is particularly exhibited in the annexed drawing marked ",
      },
      figure("Example 2", 1),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "Signs of letters consist in variations of the dots, marks, and dots and lines, and spaces of separation of the same formation as compose the signs of numerals, varied and combined differently to represent the letters of the alphabet in the manner particularly illustrated and represented in the annexed drawing marked ",
      },
      figure("Example 3", 1),
      {
        kind: "text",
        text: ". The sign of a distinct letter, or of distinct words, when used in a sentence, is the same as that used in regard to numerals and described above. Signs of words, and even of set phrases or sentences, may be adopted for use and communication in like manner under various forms, as convenience may suggest.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The type for producing the signs of numerals consist, first, of five pieces or plates of thin metal, such as type-metal, brass, iron, or like substances, with teeth or indentations upon one side or edge of ten of said type, corresponding in number to the dots or punctures or marks requisite to constitute the numerals respectively heretofore described in the system of signs, and having also a space left upon the side or edge of each type, at one end thereof, without teeth or indentations, corresponding in length with the distance or separation desired between each sign of a numeral. Another of said type has two indentations, forming thereby three teeth only, and without any space at either end, to correspond with the size of a cipher, as heretofore described by reference to ",
      },
      figure("Example 1, Modes 1, 2, and 3", 1),
      {
        kind: "text",
        text: '. One object of said type is without any indentation on its side or edge and being in length to correspond with the distance or separation desired between distinct or compound numerals, and with the sign heretofore described for that purpose. One of the remaining two of said type is formed with one corner of it beveled, and is called a "rest," and the other is in a pointed form and is called a "stop."',
      },
    ]),
    p([
      {
        kind: "text",
        text: "Each of said type is particularly delineated on the annexed drawing marked ",
      },
      figure("Example 4, Figs. 1 and 2", 1),
      {
        kind: "text",
        text: ", and numbered or labeled in accordance with the purposes for which they are designed respectively, and are used, in like manner, for producing each of the several signs of numerals heretofore described in the system of signs.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The type for producing the signs of numerals consist, secondly, of five pieces or plates of metal first described above, four of which are the same as are numbered 1, 2, 3, and 4 in the annexed drawing marked ",
      },
      figure("Example 4, Fig. 1", 1),
      {
        kind: "text",
        text: ', and the fifth one being the same as is denominated in the same example "the long space," and heretofore alluded to; also, of six other pieces or plates of said metal, varied in indentations and teeth and spaces, as represented on the annexed drawing marked ',
      },
      figure("Example 4, Fig. 2", 1),
      {
        kind: "text",
        text: ", to produce signs of the denominations described in the fourth mode of the before-mentioned system of signs, ",
      },
      figure("Example 1", 1),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "The type for producing the signs of letters are of the same denomination with those used in producing signs of numerals, and only varied in form, from one to twenty-three, as exhibited in the annexed drawing marked ",
      },
      figure("Example 5", 1),
      {
        kind: "text",
        text: '. The type for producing both signs of numerals and signs of letters are adapted for use to either a straight rule, called the "straight port-rule," and are in that case made straight lengthwise, as described in the drawings annexed and heretofore referred to in Example 5, or to a circular port-rule, in which case they are lengthwise circular or formed into sections of a circle, as represented in the drawings annexed marked ',
      },
      figure("Example 6, Figs. 2 and 3", 1),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "On the under side of the type for the circular port-rule is a groove (system of type, Example 6, A in Figs. 1 and 3) about midway of their width, in depth about half the thickness aforesaid, and extending from the space ends, as B, Example 6, Fig. 3 - that is, the ends without indentation - of said type, along the length, and conforming to the curve thereof, to a point, D D, equal in distance from the opposite ends to half the width of the pointed teeth cut upon their edges. For a delineation of those type reference is made to sections thereof in ",
      },
      figure("Example 6, Figs. 1 and 3", 1),
      {
        kind: "text",
        text: ". The type-cases are wood, or of any other material, with small compartments of the exact length of the type, for greater convenience in distributing and reassembling those in common use among printers. The type-rules are of wood or metal, or other material that may be preferred, and about three feet in length, with a groove, into which the type, when used, are placed. On the under side of each type-rule are cogs, by which they are adapted to a pinion-wheel having corresponding cogs and forming part of a port-rule.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The eighth portion consists of a pinion-wheel, before mentioned, turned by a hand-crank attached to a horizontal screw that plays into the cogs of the pinion-wheel as the latter do into the cogs of the type-rule, or by any other power in any of the well-known methods of mechanism. It is connected with a rail-way or groove, in and by which the type-rule, from the motion imparted to it by said wheel, is conveyed in a direct line beneath a lever that breaks and connects the galvanic circuit in the manner hereinafter mentioned. A delineation of said wheel, crank, and screw is contained in the drawings hereto annexed marked ",
      },
      figure("Example 8, Figs. 1, 2, and 3", 2),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "The circular port-rule is a substitute, when preferred, for both the type-rule and the straight port-rule, and consists of a horizontal or inclined wheel, ",
      },
      term("Example 9, Fig. 1, A", "The source's label for the circular port-rule wheel."),
      {
        kind: "text",
        text: ", of any convenient diameter, of wood or metal, having its axis connected on the under side of the wheel, with a pinion-wheel, K, as in the case of the straight port-rule. It is moved by the motion of the pinion-wheel, as is the type-rule in the former description. On the entire circumference of said horizontal or inclined wheel, and upon its upper surface, is a shoulder or cavity, a, Figs. 1, 2, corresponding in depth with the thickness of the type used, and in width, by equal to that of the type, exclusive of the teeth or indentations.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The operation of said circular port-rule in regulating the movement of the type in use is as follows: When the wheel A is set in motion the type resting immediately upon the shoulder of the wheel, in the manner mentioned above, as in Fig. 2, is carried forward on the curvature of the wheel from beneath the column of type resting upon it in the stationary type-feeder by means of one of the before-named cogs coming in contact with that point D, Fig. 3, Example 6, in the groove of the type, hereinbefore described as forming the termination of said groove. As said lower type in the column that is held by the stationary feeder is carried forward and removed, the next type settles immediately upon the shoulder of the wheel, and, after the manner of the removed type, is brought in contact with another cog of said shoulder within the groove of the type, and thence carried forward from beneath the incumbent column, as its predecessor.",
      },
    ]),
    p([
      { kind: "text", text: "The signal-lever, " },
      figure("Example 9, Fig. 3", 2),
      {
        kind: "text",
        text: ", consists, first, for use with the straight port-rule, Example 8, Fig. 1, A, of a strip of wood of any length from six to twenty-four inches, resting upon a pivot, a, or in a notched pillar formed into a fulcrum by a metal pin, a, passing through it and the lever. At one end of the lever a metallic wire, bent to a semicircular or half-square form, as at A, or resembling the prongs of a fork distended, is attached by its center, as described in the annexed drawings, Example 8, at the point marked A. Between said end of the lever and the fulcrum a, and near the latter, on the side of lever A, is inserted a metallic tooth or cog, b, curved on the side nearest to the fulcrum, and in other respects corresponding to the teeth or indentations upon the type already described.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The movement of the type-rule brings each tooth of the type therein set in contact with the tooth or cog of the lever, and thereby forces the lever upward until the points of the two teeth in contact have passed each other, when the lever again descends as the teeth of the type proceeds onward from the tooth of the lever. This motion is repeated as frequently as the indentations or the teeth of the type are brought in contact with the tooth of the lever. By thus forcing the said lever upward and downward the ends of the forked metallic wire are made alternately to rise and fall into two small cups or vessels of mercury, E E, in each of which is an end or termination of the metallic circuit of conductors, first described above. This alternate immersion breaks and limits the current of electricity or galvanism through the circuit; but a connection of the circuit is effected or restored by the falling of the two ends of the pronged wire A attached to said lever into the two cups, connecting the one cup with the other in that way.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The register consists, first, of a lever of the shape of the lever connected with the circular port-rule above described, and is delineated in the annexed drawings marked ",
      },
      figure("Example 10, Figs. 1, 2, and 4", 3),
      {
        kind: "text",
        text: ", at A. Said lever A operates upon a fulcrum, a, that passes through the end that forms the elbow a, upon the lower extremity of which, a, and facing an electro-magnet, is attached the armature of a magnet, f. In the other extremity of the lever, at B, is inserted one or more pencils, fountain-pens, printing-wheels, or other marking-instruments, as may be seen in Fig. 4 of the example last mentioned, at letter B. The magnet is at letter O in the same figure.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Secondly, a cylinder or barrel of metal or wood, and covered with cloth or yielding coating, to turn upon an axis and occupying a position directly beneath the pencil, fountain-pen, printing-wheel, or other marking-instrument to be used, as exhibited in the last-mentioned example of drawings, Fig. 4, at points marked D. Two rollers, marked b b in said figure of drawings, are connected with said cylinder, on the upper side curvatures thereof, and being connected with each other by two narrow bands of tape passing over and beneath each, near the ends thereof, and over the intervening surface of the cylinder, in a manner to cause a friction of the bands of tape upon the latter when in motion, as delineated in the last-named example, Fig. 4, at points marked c c c. The distance between said bands of tape on the rollers is such as to admit of the pencil, or other marking instrument in the lever, to drop upon the intervening space of the cylinder.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The several parts of the register are set in motion by the communication to or action upon the before-named armature of a magnet, attached to the lever of the register, of the electric or galvanic current in the circuit of conductors, and from an electro-magnet in said circuit, as before described, stationed near the said armature. As said armature is drawn or attracted from its stationary and horizontal position toward the said magnet when the latter is charged from the circuit of conductors, said lever is turned upon its fulcrum, and the opposite end thereof necessarily descends and brings the pen, or marking-instrument which it contains in contact with the paper or other substance on the revolving cylinder directly beneath it. As said armature ceases to be thus drawn or attracted by said magnet, as is thus the case as soon as said magnet ceases to be charged from the circuit of conductors, or as the current in said circuit is broken in the manner hereinbefore described, the said armature is forced back by its own specific gravity, or by a spring or weight, as may be needed, to its former position, and the pen or marking-instrument in the opposite end of the lever is again raised.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "To extend more effectually the length of any desired circuit of conductors, and to perpetuate the power of the electric or galvanic current equally throughout the same, I adopt the following mode, and also for connecting and using any desired number of additional and intervening batteries or generators of said current, and for connecting progressively any number of consecutive circuits, viz: Place at any point in a circuit an electro-magnet of the denomination already described, with an armature upon a lever of the form and structure, and in the position of that used at the register to hold and operate the marking-instrument, with only a substitution therein for such marking-instrument of a forked wire, A, Example 9, Fig. 3, like that upon the end of the signal-lever heretofore described. Directly beneath the latter wire place two cups of mercury, E E, or two metallic plates joined to terminations of a circuit leading from the fresh or additional battery or generator of said circuit in the same manner as they are to be provided in the first circuit of conductors at the points where the cups of mercury are hereinbefore described.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "As the current in the first circuit acts upon the magnet thus provided the armature thereof and lever are thereby moved to dip the forked wire A into the cups of the second circuit, as in the circuit first described. This operation instantly connects the break in said second circuit, and thus produces an additional and original power or current of electricity or galvanism from the battery of said second circuit to the magnet or magnets placed at any one or more points in such circuit, to be broken at pleasure, as in the first circuit; and from thence by the same operation the same results may again be repeated, extending and breaking at pleasure such current through yet another and another circuit, ad infinitum, and with as many intervening registers for simultaneous action as may be desired, and at any distances from each other.",
      },
    ]),
    p(
      text(
        "The dictionary or vocabulary consists of words alphabetically arranged and regularly numbered, beginning with the letters of the alphabet, so that each word in the language has its telegraphic number, and is designated at pleasure, through the signs of numerals.",
      ),
    ),
    p(
      text(
        "The modes which I propose of insulating the wires or other metal for conductors, and of laying the circuits, are various. The wires may be insulated by winding each wire with silk, cotton, flax, or hemp, and then dipping them into a solution of caoutchouc, or into a solution of shellac, or into pitch or resin and caoutchouc. They may be laid through the air, inclosed above the ground, in the ground, or in the water. When through the air they may be insulated by a covering that shall protect them from the weather, such as cotton, flax, or hemp, and dipped into any solution which is a non-conductor, and elevated upon pillars. When inclosed above the ground they may be laid in tubes of iron or lead, and these again may be inclosed in wood, if desirable. When laid in the ground they may be inclosed in iron, leaden, wooden, or earthen tubes, and buried beneath the surface. Across rivers the circuit may be carried beneath the bridges, or, where there are no bridges, inclosed in lead or iron, and sunk at the bottom, or stretched across, where the banks are high, upon pillars elevated on each side of the river.",
      ),
    ),
    p(text("What I claim as my invention, and desire to secure by Letters Patent, is as follows:")),
    claim(
      1,
      "The formation and arrangement of the several parts of mechanism constituting the type-rule, the straight port-rule, the circular port-rule, the two signal-levers, and the register-lever, and alarm-lever, with its hammer, as combining respectively with each of said levers one or more armatures of an electro-magnet, and as said parts are severally described in the foregoing specification.",
    ),
    claim(
      2,
      "The combination of the mechanism constituting the recording-cylinder, and the accompanying rollers and train-wheels, with the formation and arrangement of the several parts of mechanism, the formation and arrangement of which are claimed as above, and as described in the foregoing specification.",
    ),
    claim(
      3,
      "The use, system, formation, and arrangement of type, and of signs, for transmitting intelligence between distant points by the application of electro-magnetism and metallic conductors combined with mechanism described in the foregoing specification.",
    ),
    claim(
      4,
      "The mode and process of breaking and connecting by mechanism currents of electricity or galvanism in any circuit of metallic conductors, as described in the foregoing specification.",
    ),
    claim(
      5,
      "The mode and process of propelling and connecting currents of electricity or galvanism in and through any desired number of circuits of metallic conductors from any known generator of electricity or galvanism, as described in the foregoing specification.",
    ),
    claim(
      6,
      "The application of electro-magnets by means of one or more circuits of metallic conductors from any known generator of electricity or galvanism to the several levers in the machinery described in the foregoing specification, for the purpose of imparting motion to said levers and operating said machinery, and for transmitting by signs and sounds intelligence between distant points and simultaneously to different points.",
    ),
    claim(
      7,
      "The mode and process of recording or marking permanently signs of intelligence transmitted between distant points, and simultaneously to different points, by the application and use of electro-magnetism or galvanism as described in the foregoing specification.",
    ),
    claim(
      8,
      "The combination and arrangement of electro-magnets in one or more circuits of metallic conductors with armatures of magnets for transmitting intelligence by signs and sounds, or either, between distant points and to different points simultaneously.",
    ),
    claim(
      9,
      "The combination and mutual adaptation of the several parts of the mechanism and system of type and of signs with and to the dictionary or vocabulary of words, as described in the foregoing specification.",
    ),
    p(
      text(
        "In testimony whereof I, the said SAMUEL F. B. MORSE, hereto subscribe my name in the presence of the witnesses whose names are hereto subscribed, on the 7th day of April, A. D. 1838.",
      ),
    ),
    p(text("SAML. F. B. MORSE. Witnesses: B. B. FRENCH. CHARLES MONROE.")),
  ],
};

/**
 * Patent-owned, hand-authored paragraph companions. CopperGrove must add this
 * export to the shared parallel-reading registry before the edition is exposed
 * by the shared renderer; this Bead does not claim that shared-file lane.
 */
export const morseTelegraphParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: [
    "This is the conventional public address of a patent specification. It announces that the document states an invention intended to be read by anyone who needs to know its scope.",
  ],
  5: [
    "Morse identifies himself and calls the whole arrangement the American Electro-Magnetic Telegraph. He claims a machine and sign system: electric current produces sounds, visible signs, or permanent marks at distant stations.",
    "The stated object is intelligence between distant points. He includes either sound or visible signs and explicitly includes a durable record, so the description does not confine the system to a single receiving effect.",
  ],
  6: [
    "This inventory has eight parts. It is broader than the familiar hand key and Morse alphabet: it also includes reusable metal type, straight and circular carriers for that type, a circuit-breaking lever, a recorder, a numbered word dictionary, and ways of laying the conductors.",
    "The order matters. Conductors carry power from a generator to electromagnets; type determines which sign is sent; port-rules move that type; the signal lever makes and breaks the circuit; and the register preserves the resulting sign. The numbered vocabulary is a separate compression device, not an alternative name for the alphabet.",
  ],
  7: [
    "The line may be wire, strip, or even metal-covered cord, insulated and run underground, under water, or through air. A battery drives current through it; one or more electromagnets convert that current at the selected station into sound, a visible sign, or a permanent record.",
    "The paragraph allows copper, iron, metal-covered textile conductors, and several routes, but requires proper insulation. It also permits several magnets at one or more points, preserving the condition that the operator may choose where the signs are produced and recorded.",
  ],
  8: [
    "The first numerical code represents 1 through 0 by one through ten equally spaced punctures. A second character can be reserved as a cipher. This is a printed mark system, not the later international dot-and-dash alphabet.",
  ],
  9: [
    "The second numerical code uses marks made like dots and is shown on Sheet 1. Morse leaves the operator a choice among the sign systems.",
  ],
  10: [
    "The third numerical code replaces dots with saw-tooth-like marks drawn at measured intervals. The count of points still carries the number, so the physical shape changes without changing the counting principle.",
  ],
  11: [
    "The fourth code combines dots and lines. Four numbers use dots; a line represents 5, and dots before or after it distinguish 6 through 9. Two such lines represent 0. The corresponding printed example fixes the exact convention.",
    "Its line has a defined physical length: the space between the two dots used for another numeral. The order of prefix and suffix dots is therefore a material limitation of this fourth mode.",
  ],
  12: [
    "Morse expressly permits whichever of these modes an operator prefers. The following machine is meant to produce the selected sign form, rather than to mandate one visual code.",
  ],
  13: [
    "A wider blank separates one complete numeral or compound numeral from the next. The difference between an intra-number space and an inter-number space is part of the code, and Example 2 shows it.",
  ],
  14: [
    "Letters use the same basic ingredients: dots, marks, lines, and spaces, combined in a different order. The patent also permits signs for entire words or phrases, so compression into a vocabulary is part of its intended operation.",
  ],
  15: [
    "The first numeral type is a set of thin metal pieces whose teeth or indentations encode the desired mark count and whose blank end supplies spacing. A special three-tooth piece is a cipher; the unindented piece is a separation, while the beveled rest and pointed stop control the mechanism.",
    "The source specifies type-metal, brass, iron, or similar thin metal. Each indented edge corresponds to a numerical sign, while the unindented end has the required length for separating it from the next numeral. The rest and stop are named shapes in the set, not editorial labels.",
  ],
  16: [
    "Example 4 identifies the individual type pieces by label and number. The physical pieces turn a selected numerical sign into a repeatable mechanical input rather than relying on a freehand mark.",
  ],
  17: [
    "The second numerical type set reuses four earlier pieces, a long-space piece, and six pieces with other tooth and space patterns. Together they generate the fourth, dot-and-line mode shown in Example 1.",
    "The arrangement is thus tailored to the signs of the fourth mode, including its line-and-dot distinctions and its explicitly shown spaces.",
  ],
  18: [
    "Letter types use the same family of metal pieces, varied through twenty-three forms. Straight pieces travel in a straight port-rule; curved pieces are arcs for a circular port-rule. The alternative is mechanical geometry, not a different electrical principle.",
  ],
  19: [
    "The circular type has a half-thickness groove that ends before the pointed teeth. The shoulder and cogs of the wheel guide each piece. Type cases store the pieces, while a three-foot type-rule and pinion provide repeatable feed motion.",
    "The groove starts at the space end and terminates at points D D, halfway from the opposite ends. Cogs around the wheel are spaced to match the type teeth or indentations, and a stationary type-feeder holds a column of pieces above the shoulder. These dimensions and relations explain why the circular pieces can be selected and moved without falling out of the carrier.",
  ],
  20: [
    "A hand crank and screw drive the pinion-wheel, which moves the type-rule along a groove under the circuit-breaking lever. The drawings identify the linked wheel, crank, screw, rail, and lever as one feed mechanism.",
    "The source permits another familiar mechanical power in place of the hand crank. Its limitation is functional: motion is conveyed in a direct line beneath the lever that breaks and connects the galvanic circuit.",
  ],
  21: [
    "The circular port-rule replaces the straight rule with a wheel whose shoulder receives curved type. Its pinion drives the wheel; the shoulder depth matches type thickness, and its cogs engage the grooves in the pieces.",
    "The wheel may be horizontal or inclined and may be wood or metal. The cavity has the selected type's width exclusive of its teeth, preserving the fit that lets the type move around the circumference.",
  ],
  22: [
    "As the wheel carries the lower piece away from the stationary type feeder, the next piece drops onto the shoulder. A cog enters each piece's groove and carries it onward. That sequence makes the type feed automatically and in order.",
    "The removed piece travels from below the incumbent column as its predecessor did. The paragraph conditions the sequence on keeping the wheel in motion, so the mechanical feed, rather than a manually placed mark, regulates the order of signs.",
  ],
  23: [
    "For the straight rule, a tooth on the moving type lifts and drops a pivoted signal lever. The lever carries a forked wire. Its repeated movement is the mechanical origin of each opening and closing of the circuit.",
    "The source permits a six-to-twenty-four-inch wood lever on a pivot or notched pillar, with a metal pin fulcrum. The tooth near that fulcrum matches the type teeth and indentations; that physical matching is the constraint that translates the selected type profile into lever travel.",
  ],
  24: [
    "When the lever rises, the forked wire leaves or limits the mercury contacts; when it falls, the contacts reconnect the circuit. The type's teeth and gaps therefore become current pulses with durations and spaces determined by the selected metal piece.",
    "Two mercury cups, each connected to a circuit termination, receive the fork's ends. Their alternate immersion breaks and limits current; falling into both cups restores the connection. The source also permits metallic contact plates in place of cups, preserving the same circuit-making function.",
  ],
  25: [
    "The register uses a lever whose armature faces an electromagnet. At the other end the patent permits a pencil, fountain pen, printing wheel, or other marking tool. Magnetic attraction moves the armature and makes that tool mark the material below it.",
  ],
  26: [
    "A yielding-covered cylinder and two tape-linked rollers move the paper or other recording material. The narrow tape bands leave a central gap so the marking instrument can reach the cylinder; a spool supplies a continuous strip and receives the record after it passes the rollers.",
    "The cylinder can be metal or wood and turns on an axis below the marker. Friction between the bands and cylinder draws the strip forward gradually; after passing the cylinder and rollers it may be deposited in a box or cut off at a chosen length.",
  ],
  27: [
    "When current energizes the magnet, the armature turns the register lever and lowers the marking tool to the moving material. When current stops, gravity, a spring, or a weight returns the lever and raises the tool. The same circuit can operate as many remote registers as have corresponding magnets.",
    "The timing is simultaneous: the circuit signal both makes the mark and can act at multiple points. The mark persists because the cylinder continues to move underneath it, turning the interval during which current flows into a visible sign on the paper or substitute material.",
  ],
  28: [
    "For longer routes, Morse describes a fresh-battery relay. A receiving magnet moves a forked wire into contacts of a second circuit. That second circuit is a new source of current and can in turn repeat the operation through further circuits.",
    "The receiving armature has the register's general form but substitutes the forked wire for its marking instrument. Beneath it are mercury cups or plates connected to the fresh circuit, the same arrangement used in the first circuit. This is a concrete two-circuit arrangement, including a specified contact action and battery source.",
  ],
  29: [
    "The first circuit actuates the relay magnet, which closes the second circuit. Repeating this arrangement can extend the signal through another and another circuit, with intervening registers operating at any distance. This is the printed relay mechanism, not a claim to all forms of electrical communication.",
  ],
  30: [
    "The dictionary is an alphabetically arranged, numbered vocabulary. Instead of spelling every word, an operator may transmit that word's number through the numerical signs.",
  ],
  31: [
    "The final engineering discussion gives insulation and route options: textile wrapping plus caoutchouc, shellac, pitch, or resin; aerial support; tubes above or below ground; and river crossings by bridge, submerged lead or iron, or elevated pillars.",
    "The claim is not that every route is identical. Above-ground lines may sit on pillars and need weather protection; enclosed aerial lines may use iron or lead tubes with an outer wood enclosure; buried lines may use iron, lead, wood, or earthen tubes. For a river, the described alternatives depend on whether a bridge exists and on the banks' height.",
  ],
  32: [
    "This sentence introduces the nine legal claims. They define the combinations for which Morse asks Letters Patent after the detailed specification has described their parts and operation.",
  ],
  42: [
    "Morse executes the specification on 7 April 1838. The date belongs to the signed instrument; the patent notice at the masthead gives the June 20, 1840 grant date.",
  ],
  43: [
    "B. B. French and Charles Monroe appear as the witnesses to Morse's signature. The drawing sheets separately display Joseph G. Clark and Alexr. Jackson as witnesses on those sheets.",
  ],
};
