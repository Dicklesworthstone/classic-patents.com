import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
  Patent,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (number: number, width: number, height: number, version: "v1" | "v2" = "v1") => ({
  src: `/patents/figures/us-2981877-noyce-ic/fig-${number}-source-crop-${version}.png`,
  alt: `Source-facsimile crop of Fig. ${number} from US 2,981,877.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": crop(1, 820, 760),
  "Fig. 2": crop(2, 880, 470),
  "Fig. 3": crop(3, 920, 620),
  "Fig. 4": crop(4, 1800, 650, "v2"),
  "Fig. 5": crop(5, 920, 440),
  "Fig. 6": crop(6, 780, 600),
  "Fig. 7": crop(7, 780, 510),
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 2,981,877`,
  figurePreviews: [FIGURES[label]],
});

const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});

/**
 * A manually prepared, continuous reading edition of the complete eight-page
 * US 2,981,877 facsimile. The first three sheets are drawings and the last
 * five sheets carry the specification, claims, and cited references.
 */
export const noyceIcArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "c6efa2efedcfdec092a8f5aff7354fc067f3b287bbfad6749e1235cee77a2d59",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "2,981,877.",
        "SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE.",
        "Robert N. Noyce, Los Altos, Calif., assignor to Fairchild Semiconductor Corporation, Mountain View, Calif., a corporation of Delaware.",
        "Filed July 30, 1959, Ser. No. 830,507. 10 Claims. (Cl. 317-235.) Patented Apr. 25, 1961.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-7",
      title: "Transistor leads, a multi-device circuit, and parallel-strip contacts",
      description: [
        { kind: "text", text: "The three drawing sheets contain " },
        figure("Fig. 1"),
        { kind: "text", text: " and " },
        figure("Fig. 2"),
        { kind: "text", text: "; " },
        figure("Fig. 3"),
        { kind: "text", text: ", " },
        figure("Fig. 4"),
        { kind: "text", text: ", and " },
        figure("Fig. 5"),
        { kind: "text", text: "; and " },
        figure("Fig. 6"),
        { kind: "text", text: " and " },
        figure("Fig. 7"),
        { kind: "text", text: ". Every preview is cropped directly from the pinned facsimile." },
      ],
    },
    p(
      "This invention relates to electrical circuit structures incorporating semiconductor devices. Its principal objects are these: to provide improved device-and-lead structures for making electrical connections to the various semiconductor regions; to make unitary circuit structures more compact and more easily fabricated in small sizes than has heretofore been feasible; and to facilitate the inclusion of numerous semiconductor devices within a single body of material.",
    ),
    paragraph([
      { kind: "text", text: "In brief, the present invention utilizes " },
      term(
        "dished junctions",
        "P-N junctions whose curved boundary reaches the semiconductor surface and encloses a region there.",
      ),
      {
        kind: "text",
        text: " extending to the surface of a body of ",
      },
      term(
        "extrinsic semiconductor",
        "Semiconductor deliberately doped with donor or acceptor impurities so that its carrier population and conductivity differ from those of intrinsic material.",
      ),
      {
        kind: "text",
        text: ", an insulating surface layer consisting essentially of oxide of the same semiconductor extending across the junctions, and leads in the form of vacuum-deposited or otherwise formed metal strips extending over and adherent to the insulating oxide layer for making electrical connections to and between various regions of the semiconductor body without shorting the junctions.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The invention may be better understood from the following illustrative description and the accompanying drawings. ",
      },
      figure("Fig. 1"),
      {
        kind: "text",
        text: " is a greatly enlarged plan view of a transistor-and-lead structure embodying principles of this invention; ",
      },
      figure("Fig. 2"),
      { kind: "text", text: " is a section taken along the line 2-2 of " },
      figure("Fig. 1"),
      { kind: "text", text: "; " },
      figure("Fig. 3"),
      {
        kind: "text",
        text: " is a greatly enlarged plan view of a multi-device semiconductor-and-lead structure embodying principles of this invention; ",
      },
      figure("Fig. 4"),
      { kind: "text", text: " is a section taken along the line 4-4 of " },
      figure("Fig. 3"),
      { kind: "text", text: "; " },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " is a simplified equivalent circuit of the structure shown in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", with additional circuit elements external to said structure represented by broken lines; ",
      },
      figure("Fig. 6"),
      {
        kind: "text",
        text: " is a greatly enlarged plan view of another transistor-and-lead structure embodying principles of the invention; and ",
      },
      figure("Fig. 7"),
      { kind: "text", text: " is a section taken along the line 7-7 of " },
      figure("Fig. 6"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: " and " },
      figure("Fig. 2", "2"),
      {
        kind: "text",
        text: " illustrate one example of a structure according to this invention. A single-crystal body of semiconductor-grade silicon, represented at 1, has a high-quality surface 2, prepared in accordance with known transistor technology. Within the body 1 there are ",
      },
      term(
        "high-resistivity regions",
        "Regions made sufficiently pure or compensated that they supply few mobile charge carriers and electrically behave more like an insulator than the adjacent doped regions.",
      ),
      {
        kind: "text",
        text: ", designated I in the drawing, composed either of high-purity silicon having so few donor and acceptor impurities that it is a good insulator at ordinary temperatures and an intrinsic semiconductor at elevated temperatures, or of somewhat less-pure silicon containing a trace of a material such as gold that diminishes the effect of donor and acceptor impurities by greatly reducing the carrier concentrations.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Elsewhere within body 1, there are extrinsic N-type and extrinsic P-type regions, designated N and P respectively, formed in the well-known manner by diffusing N-type and P-type dopants through surface 2 into the crystal, with appropriate masking to limit the dopant to the desired areas. The smallest and uppermost N-type region constitutes an emitter layer of the transistor. This emitter layer overlies a somewhat larger P-type region which constitutes the base layer of the transistor. The base layer, in turn, overlies a still larger N-type region which constitutes the collector layer of the transistor. Between the emitter and base layers there is a dished, P-N junction 3, having a circular edge which extends to surface 2 and there completely surrounds the emitter. Between the base and collector layers there is a dished, P-N junction 4, having a circular edge that extends to surface 2 and there completely surrounds the base.",
      },
    ]),
    p(
      "The thickness of the emitter and base layers has been exaggerated in the drawings: in actual practice each of these layers is but a few microns thick. The collector layer generally is considerably thicker, and in the example illustrated extends completely through the body 1 so that contact thereto may be made from the back side. Thus, the three extrinsic semiconductor layers described form a transistor equivalent to previously known types of double-diffused junction transistors.",
    ),
    paragraph([
      {
        kind: "text",
        text: "During diffusion of the donor and acceptor impurities into the semiconductor, at elevated temperature in an oxidizing atmosphere, the surface of the silicon oxidizes and forms an oxide layer 5, often one micron or more in thickness, congenitally united with and covering surface 2. This layer may consist chiefly of silicon dioxide, or of disproportionated silicon suboxide, depending upon the temperature and conditions of formation. In any event, the oxide surface layer is durable and firmly adherent to the semiconductor body, and furthermore it is a good electrical insulator.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "According to common prior practice in manufacturing diffused-junction transistors, the semiconductor body was deoxidized by chemical etching prior to deposition of metal contacts on the semiconductor surface. According to the present invention, only selected portions of the oxide layer are removed, as illustrated in ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: " and " },
      figure("Fig. 2", "2"),
      {
        kind: "text",
        text: ", for example, while other portions of the oxide layer are left in place to serve as insulation for electrical leads used in making connections to and between the several semiconductor regions.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In particular, portions of the remaining oxide film extend across the edges of the P-N junctions at the surface of the semiconductor body, to facilitate the making of electrical connections from one side of a junction to another without shorting the junction. Thus, as illustrated in ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: " and " },
      figure("Fig. 2", "2"),
      {
        kind: "text",
        text: ", the remaining oxide film comprises a tongue 5′ that crosses the edge of junction 4, and another tongue 5″ that crosses the edges of both junctions 3 and 4. On the other hand, at least a portion of the surface over each of the emitter and base layers must be cleared to permit the formation of base and emitter contacts.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A convenient and highly accurate way to remove only selected portions of the oxide film is to use ",
      },
      term(
        "photoengraving techniques",
        "A photographic-resist and etching process that transfers a patterned mask into selected regions of a surface.",
      ),
      {
        kind: "text",
        text: ". The photoengraving resist is placed over the oxide-coated surface, and this is then exposed through a master photographic plate having opaque areas corresponding to the areas from which the oxide is to be removed. In the usual photographic developing, the unexposed resist is removed; and chemical etching can then be employed to remove the oxide layer from the unexposed areas, while the exposed and developed resist serves as a mask to prevent chemical etching of the oxide areas that are to be left on the semiconductor surface.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A discoid, metal, emitter contact 6 is adherent to surface 2, wholly within the edge of junction 3, centered upon and in electrical connection with the emitter region of the transistor. Electrical connections to this emitter contact are made through a metal strip 7 extending over and adherent to oxide layer 5. The strip 7 extends over the tongue 5″ of the insulating oxide layer across the junctions 3 and 4, and thus provides an electrical connection extending from one side of the composite structure inward to the central emitter contact, without shorting any of the transistor junctions.",
      },
    ]),
    paragraph([
      { kind: "text", text: "The base contact is a " },
      term(
        "C-shaped, metal strip",
        "A metal contact formed as an open ring: its two ends leave a gap through which an insulated lead can pass without touching the ring.",
      ),
      {
        kind: "text",
        text: " 8, adherent to surface 2 wholly between the edges of junctions 3 and 4, substantially concentric with the emitter contact 6 and substantially encircling the junction 3. It will be noted that tongue 5″ and lead 7 extend between the two ends of the C-shaped contact 8, so that lead 7 and the emitter contact are effectively insulated from the base contact even though the base contact substantially surrounds the emitter junction. Electrical connection to contact 8 is made through a metal strip 9 extending over and adherent to the insulating oxide layer 5. Strip 9 extends over tongue 5′ across the collector junction 4, and thus provides an electrical connection from one side of the composite structure into the base layer, which in this embodiment is completely surrounded by the collector layer at the surface 2, without shorting the collector junction 4.",
      },
    ]),
    p(
      "Various methods may be employed for forming the base and emitter contacts and leads. By way of example, the contacts and leads can be deposited in the configuration shown by direct vacuum evaporation of aluminum, or other suitable contact metal, through a mask of suitable size and shape. Alternatively, a metal coating may be deposited over the entire upper surface of the composite structure, and the unwanted metal then removed by known photoengraving techniques to leave only the contact-and-lead configuration shown. After the contacts have been deposited upon surface 2 of the semiconductor, the structure is usually heated to form an alloy at the metal-silicon interface so that good, ohmic contact between the metal and the silicon is obtained.",
    ),
    paragraph([
      {
        kind: "text",
        text: "It will be noted that regions of high-resistivity silicon are made to underlie portions of the leads 7 and 9. The principal purpose in this is to reduce the ",
      },
      term(
        "shunt capacitance",
        "Unwanted capacitance from a lead to the semiconductor body beneath it.",
      ),
      {
        kind: "text",
        text: " between the leads and the semiconductor body. Otherwise, an undesirably high shunt capacitance may exist in some cases since the extrinsic semiconductor regions are fairly good conductors, and the insulating layer 5 has a thickness of only one to two microns. The high-resistivity regions act essentially as insulators rather than as conductors, and thus reduce the area of closely spaced conductors that lead to high shunt capacitances. Of course, in cases where the shunt capacitance is not excessive for the purposes desired, use of high-resistivity regions as disclosed is not required.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The transistor structure is completed by an electrical contact to the collector layer, which may take the form of a metal coating 10 plated over the entire back side of the silicon body. Even in a single transistor, as illustrated in ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: " and " },
      figure("Fig. 2", "2"),
      {
        kind: "text",
        text: ", the composite semiconductor-and-lead structure provided by this invention has significant advantages. According to prior practice, electrical connection to the base and emitter contacts had to be made by fastening wires directly to the contact areas. This led to certain manufacturing difficulties, particularly in the case of small devices wherein, for example, the emitter region might be only a few mils in diameter and a few microns in thickness. Merely to position the emitter lead on the emitter contact in such small structures required the use of microscopes and micro-manipulators; and the use of any considerable pressure or considerable heat in making the joint permanent could cause sufficient damage to destroy the transistor.",
      },
    ]),
    p(
      "By means of the present invention, the leads 7 and 9 can be deposited at the same time and in the same manner as the contacts themselves. Furthermore, leads 7 and 9 can be made as large as may be desired at the point where wires or other external circuit elements are to be attached; and such attachments can be made at a distance from the active elements of the transistor proper, so that the chances of damage to the transistor are significantly reduced.",
    ),
    paragraph([
      {
        kind: "text",
        text: "Further advantages accrue when it is desired to incorporate more than one circuit device into a single body of semiconductor. In this way exceptionally compact and rugged circuits can be constructed. One example of such a multi-device structure is illustrated in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ". A single-crystal body 11 of silicon, largely P-type, has a high-quality surface 12 prepared in accordance with well known transistor technology. The other side of body 11 is plated with a metal coating 13, which serves as an electrical contact to the largest P-type region and as a ground plane for the electrical circuit. Various circuit elements may be formed within and on this body of silicon. N-type and P-type dopants, restricted to specific areas by known masking techniques, are diffused through surface 12 to form a plurality of N-type and P-type extrinsic semiconductor regions, separated from the underlying P-type region and from each other by a plurality of dished, P-N junctions of various diameters and depths, all having, in this particular example, circular edges extending to surface 12 and there surrounding the overlying semiconductor regions.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Toward the left end of the structure illustrated in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", there will be found an N-type region overlying a small P-type region and separated therefrom by a dished junction 14. The small P-type region overlies another N-type region; and the underlying N-type region in turn overlies the large, grounded P-type region and is separated therefrom by a dished junction 15. The junction between the two intermediate layers is shorted by contact 17. Consequently, this structure provides two rectifying junctions connected in series, each equivalent to a crystal diode. Electrical connection to the upper N-type region is made through a discoid, metal contact 16, adherent to surface 12, wholly within junction 14 and substantially centered upon the N-type region. Electrical contact to the two regions between junctions 14 and 15 is made through a C-shaped metal contact 17, adherent to surface 12, wholly between the edges of junctions 14 and 15, concentric with contact 16 and substantially encircling the edge of junction 14, which extends to the surface 12.",
      },
    ]),
    p(
      "Proceeding toward the right in the drawings, there will be found another N-type region, separated from the underlying, grounded, P-type region by a dished junction 18. Electrical connection to the N-type region in this case is made through a discoid, metal contact 19, adherent to surface 12 and substantially centered inside the edge of junction 18, which extends to the surface of the semiconductor. Toward the right end of the structure illustrated, there will be found a small N-type region overlying a P-type region and separated therefrom by a dished junction 20. The last-mentioned P-type region in turn overlies a larger N-type region and is separated therefrom by a dished junction 21. The N-type region below junction 21 in turn overlies the grounded P-type region and is separated therefrom by a dished junction 22. In this case, the width of the P-type region between junctions 20 and 21 is less than a diffusion length, so that a substantial proportion of the electrons that cross junction 20 are collected by junction 21. The result is an N-P-N junction transistor, in which the small N-type region overlying junction 20 acts as the emitter, the P-type region between junctions 20 and 21 acts as the base, and the N-type region between junctions 21 and 22 acts as the collector. The width of the last-mentioned N-type region is greater than a diffusion length, and consequently there is little interaction between junctions 21 and 22. As will be explained hereinafter, junction 22 is normally reverse-biased and acts much as a capacitor in the overall circuit. It serves the important function of isolating the collector of the transistor from the grounded, underlying, P-type region.",
    ),
    p(
      "Electrical connections to the three active regions of the transistor are made as follows: A discoid, metal contact 23 is adherent to surface 12, wholly within the edge of junction 20, centered upon and in electrical connection with the emitter layer of the transistor. A C-shaped contact 24 is a metal strip adherent to surface 12 between junctions 20 and 21, substantially surrounding the circular edge of junction 20 that extends to the surface of the semiconductor body. This contact overlies and is in electrical connection with the base layer of the transistor. Another and larger C-shaped contact 25, which overlies and is in electrical connection with the collector layer, is likewise in the form of a metal strip, adherent to surface 12 between junctions 21 and 22, and surrounding the circular edge of collector junction 21 that extends to the surface. Still another contact is provided upon and adherent to surface 12. This is the discoid, metal contact 26, directly upon and in electrical connection with the grounded P-type layer, for the purpose of providing a ground terminal at the upper surface of the composite structure.",
    ),
    p(
      "Except for the contacts described above, the entire surface 12 is covered with an insulating layer 27 of oxidized silicon, generally about one micron thick. This insulating layer may be formed upon the exposed surface of the silicon during diffusion of the N-type and P-type dopants into the silicon, at elevated temperatures and in an oxidizing atmosphere. The presence of water vapor will enhance oxidation of the silicon. Preferably, in accordance with this invention and contrary to prior practice, after diffusion is completed the oxide layer is never removed from the silicon, except for the areas to be covered by the contacts herein described. The contact areas are cleared by photoengraving, after which the contact metal can be deposited by various known processes, e.g., by the vacuum deposition of an aluminum film covering both the cleared and oxide-coated areas. Afterwards, unwanted metal can be removed from the oxide-coated areas by photoengraving. The aluminum contacts may be alloyed to the silicon to make ohmic contacts in a known manner.",
    ),
    p(
      "The circuit structure is completed by providing metal strips extending over and adherent to the insulating oxide layer 27 and making electrical connections to and between the various contacts heretofore described. These metal strips may be deposited by vacuum evaporation and deposition, and may conveniently be parts of the deposited film from which contacts are made. The leads come from portions of the film that are deposited onto the oxide film and are thereby insulated from the semiconductor body. As hereinbefore explained, photoengraving can be used to remove the unwanted metal, leaving only the leads and contacts.",
    ),
    paragraph([
      {
        kind: "text",
        text: "In the structure illustrated, there is an input lead 28 electrically connected to contact 17, and an output lead 29 electrically connected to contact 25. A lead 30 interconnects contacts 16 and 19; if desired, lead 30 can be made sufficiently thin and narrow to have an appreciable resistance, and thereby serve as a resistance element in the circuit. A similar lead 31 interconnects contacts 19 and 24, and still another lead 32, which may be made to have an appreciable resistance if desired, interconnects contacts 23 and 26. The solid lines in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " represent the simplified, equivalent circuit for the structure shown in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", while the broken lines in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " represent typical external circuit components added for purposes of explanation. The solid-line parts are identified by reference numbers identical to the reference numbers of corresponding parts in the structure of ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ", with the addition of a prime to the reference numbers in ",
      },
      figure("Fig. 5"),
      { kind: "text", text: "." },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Any desired source of an amplitude-modulated, A.-C. signal is represented at 34 in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ". This A.-C. signal is applied between the input lead 28′ and the ground connection 13′, corresponding to lead 28 and ground plane 13 of the physical structure shown in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: ". Lead 28 conducts the signal through contact 17 into the two layers between junctions 14 and 15. As hereinbefore explained, each of the junctions 14 and 15 performs essentially the functions of a crystal diode rectifier, as schematically represented at 14′ and 15′, ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ". Thus, as is evident from the equivalent circuit shown in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ", the input signal is rectified or detected by the junctions 14 and 15, to provide at contact 16 a signal essentially corresponding to the modulation envelope of the input signal. Because of its appreciable resistance, lead 30 acts as a circuit resistor, represented in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " as 30′.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "It will be noted that the polarity of rectifying junctions 14 and 15 is such that the signal supplied to contact 19 has a D.-C. component of the polarity required to ",
      },
      term(
        "reverse-bias junction 18",
        "Apply a voltage polarity that widens a P-N junction's depleted charge region and suppresses ordinary conduction, allowing its junction capacitance to be used.",
      ),
      {
        kind: "text",
        text: ". Hence, the voltage across junction 18 is always in the high-resistance direction of the junction, and there is no appreciable current flow across this junction. However, there are charge layers on both sides of the junction which form a capacitance, as is well known, and therefore the circuit function of junction 18 is to provide a capacitance, represented in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " at 18′. The value of this capacitance can be made greater or less, as desired, by increasing or decreasing the area of junction 18. Lead 31 has an appreciable resistance and therefore acts as a circuit resistor, represented at 31′, ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ". This leads to the base contact 24 of the transistor, shown at 24′ in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ". The emitter contact of the transistor is connected through lead 32 and contact 26 to the grounded P-type semiconductor region. This is represented in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " by the emitter terminal 23′ connected through resistor 32′ to the ground line 13′. The value of the resistor 32′ is the sum of the resistances of contacts 23 and 26, lead 32, and the current path through the P-type layer between contact 26 and ground plane 13.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Normal operation of the N-P-N transistor requires that the N-type collector be supplied with a relatively positive voltage, as is accomplished in the equivalent circuit illustrated in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: " by the external voltage supply 36 connected to the collector terminal 25′ through any appropriate load 35. It is evident that this supply voltage reverse-biases junction 22, and therefore, for reasons already explained, the junction 22 acts essentially as a capacitor, represented at 22′ of the equivalent circuit shown in ",
      },
      figure("Fig. 5"),
      {
        kind: "text",
        text: ". It should now be apparent that the structure shown in ",
      },
      figure("Fig. 3", "Figs. 3"),
      { kind: "text", text: " and " },
      figure("Fig. 4", "4"),
      {
        kind: "text",
        text: " comprises, within a single, rugged, compact unit, detector, filtering, and transistor-amplifier stages. It is believed to be evident that the principles of this invention make feasible the construction of an endless variety of circuit combinations, including combinations much more elaborate and complex than the simple circuit employed for purposes of illustration, all within a highly compact and rugged, essentially unitary, solid body.",
      },
    ]),
    paragraph([
      figure("Fig. 6", "Figs. 6"),
      { kind: "text", text: " and " },
      figure("Fig. 7", "7"),
      {
        kind: "text",
        text: " show an example in which the emitter and base contacts are ",
      },
      term(
        "parallel strips",
        "Straight, side-by-side metal contacts whose spacing and path are chosen so an oxide-protected junction can run between them.",
      ),
      {
        kind: "text",
        text: ". A single-crystal body 37 of silicon contains a P-type, emitter layer overlying an N-type, base layer and separated therefrom by a dished junction 38, which extends to the upper surface of the semiconductor and there surrounds the P-type, emitter layer. In this case, the edge of junction 38 does not form a circle at the surface, but forms an elongated, closed figure. The N-type, base layer overlies a P-type, collector layer and is separated therefrom by a flat junction 39. The emitter contact 40 is a straight strip of metal, vacuum-deposited or otherwise placed upon the upper surface of the silicon, and preferably alloyed thereto to form an ohmic contact. The base contact 41 is a similar strip of metal, parallel to contact 40. The edge of junction 38 extends between the two contacts, and around contact 40, as shown. The collector contact 42 may be a metal layer plated onto the bottom surface of the silicon.",
      },
    ]),
    p(
      "Except for the areas covered by contacts 40 and 41, the upper surface of the silicon is covered by an insulating oxide layer, congenitally united with the silicon and actually formed by heating the silicon in an oxidizing atmosphere. The oxide layer completely covers the edge of junction 38, and protects the junction against accidental shorting in addition to providing insulation between the electrical leads and the silicon. Electrical connection to contact 40 is made by a metal strip 43, extending over and firmly adherent to the oxide layer. Electrical connection to contact 41 is made by a metal strip 44, similarly extending over and firmly adherent to the oxide layer. These metal strips can be formed by vacuum deposition through a mask, or by plating the entire surface and then removing unwanted metal by photoengraving, or by any other method providing metal strips that adhere securely to the oxide surface.",
    ),
    p(
      "The invention in its broader aspects is not limited to the specific examples illustrated and described. What is claimed is:",
    ),
    claim(
      1,
      "A semiconductor device comprising a body of semiconductor having a surface, said body containing adjacent P-type and N-type regions with a junction therebetween extending to said surface, two closely spaced contacts adherent to said surface upon opposite sides of and adjacent to one portion of said junction, an insulating layer consisting essentially of oxide of said semiconductor on and adherent to said surface, said layer extending across a different portion of said junction, and an electrical connection to one of said contacts comprising a conductor adherent to said layer, said conductor extending from said one contact over said layer across said different portion of the junction, thereby providing electrical connections to both of the closely spaced contacts.",
    ),
    claim(
      2,
      "A semiconductor device comprising a body of extrinsic semiconductor having a surface, said body containing adjacent P-type and N-type regions, one overlying the other, with a junction therebetween extending to said surface and there completely encircling said overlying region, the underlying one of said regions extending to said surface and there surrounding said junction, a first metal contact adherent to said surface in ohmic electrical connection with said overlying region, an insulating layer consisting essentially of oxide of said semiconductor united with said surface and extending across said junction, a metal strip adherent to said layer, said strip being electrically connected to said first contact and extending therefrom over said layer across said junction, and a second metal contact adherent to said surface in ohmic electrical connection with said underlying region, said second contact substantially encircling said junction from one side of said strip to the other.",
    ),
    claim(
      3,
      "A semiconductor device comprising a body of extrinsic semiconductor having a surface, said body containing adjacent P-type and N-type regions with a dished junction therebetween having a substantially circular edge at said surface, a discoid metal contact adherent to said surface wholly within and substantially concentric with said edge, a C-shaped metal contact adherent to said surface and substantially concentric with said discoid contact, said C-shaped contact being wholly outside of and substantially encircling said edge, said C-shaped contact having two ends defining a gap therebetween, an insulating layer consisting of oxide of said semiconductor on said surface extending through said gap and across said junction, and a metal strip over and adherent to said layer extending through said gap and across said junction to said discoid contact, said contacts being in direct electrical connection with respective ones of said regions, and said metal strip being in direct electrical connection with said discoid contact but spaced and insulated from the ends of said C-shaped contact.",
    ),
    claim(
      4,
      "A diffused junction transistor comprising a body of extrinsic silicon having a surface, said body containing adjacent base and emitter regions, with a discoid emitter junction therebetween having a substantially circular edge at said surface encircling said emitter region, a discoid metal contact to said emitter region adherent to said surface wholly within said edge, a C-shaped metal contact to said base region adherent to said surface and substantially encircling said edge, said C-shaped contact having two ends defining a gap therebetween, an insulating layer of oxidized silicon on said surface, said layer being congenitally united with said body and extending across said junction, and a metal strip adherent to said layer, said strip extending from said discoid contact over said layer across said junction and between said ends forming an electrical connection to said emitter region.",
    ),
    claim(
      5,
      "A semiconductor device comprising a single-crystal body of semiconductor material having a surface, said body containing a high-resistivity region and extrinsic P-type and extrinsic N-type regions with a P-N junction therebetween extending to said surface, a metal contact to one of said extrinsic regions adherent to said surface, an insulating layer consisting essentially of oxide of said material on said surface, said layer being congenitally united with said body and extending across said junction, and an electrical connection to said contact comprising a metal strip adherent to said layer, said strip extending from said contact over said layer across said junction, said high-resistivity region underlying a portion of said strip, reducing the shunt capacitance between said strip and said body.",
    ),
    claim(
      6,
      "A semiconductor device comprising a body of semiconductor having a surface, said body containing adjacent P-type and N-type regions, one overlying the other, with a junction therebetween extending to said surface, a first metal contact adherent to said surface in electrical connection to said overlying region, a second metal contact in electrical connection with the underlying one of said regions, an insulating layer consisting essentially of oxide of said semiconductor on said surface, said layer being congenitally united with said body and extending across said junction, an electrical connection to said first contact comprising a metal strip adherent to said layer, said strip extending from said first contact over said layer across said junction, and circuit means for applying between said strip and second contact a D.C. voltage of the polarity that reverse-biases said junction, so that said junction acts as a capacitor connected between said strip and said second contact.",
    ),
    claim(
      7,
      "A semiconductor device comprising a body of extrinsic semiconductor having a surface, said body containing adjacent, first, second and third regions, one overlying the other, P-type and N-type alternately, with a first, dished, P-N junction between said first and second regions having an edge extending to said surface and there surrounding said first region, and a second, dished, P-N junction between said second and third regions extending to said surface and there surrounding said second region, a first metal contact adherent to said surface in electrical connection with said first region, a second metal contact adherent to said surface in electrical connection with said second region, a third metal contact in electrical connection with said third region, an insulating layer consisting essentially of an oxide of said semiconductor on said surface, said layer being congenitally united with said body and extending across both of said junctions, an electrical connection to said first contact comprising a first metal strip adherent to said layer, said first strip extending from said first contact over said layer across both of said junctions, and an electrical connection to said second contact comprising a second metal strip adherent to said layer, said second strip extending from said second contact over said layer across said second junction.",
    ),
    claim(
      8,
      "A semiconductor device as in claim 7, wherein said second contact is a C-shaped metal strip substantially encircling said first junction, and said third contact is a larger C-shaped metal strip adherent to said surface and substantially encircling said second junction.",
    ),
    claim(
      9,
      "A semiconductor device comprising a body of extrinsic semiconductor having a surface, said body containing a plurality of dished, P-N junctions each having an edge extending to said surface and there surrounding and defining an enclosed region of said semiconductor, a plurality of metal contacts adherent to said surface in electrical connection with respective ones of said enclosed regions, an insulating layer consisting essentially of oxide of said semiconductor on said surface, said layer being congenitally united with said body and extending across a plurality of said junctions, and electrical interconnections between said contacts comprising metal strips adherent to said layer and extending over said layer across a plurality of said junctions.",
    ),
    claim(
      10,
      "A semiconductor device comprising a body of extrinsic semiconductor having a surface, said body containing adjacent P-type and N-type regions with a dished junction therebetween, said junction having an edge that extends to said surface and there forms an elongated, closed figure, first and second contacts in the form of parallel metal strips adherent to said surface, said first contact being wholly within and said second contact wholly without said edge of the junction, an insulating layer consisting of oxide of said semiconductor on said surface and extending across said junction, and a metal strip adherent to said insulating layer and extending thereover across said junction to connect physically and electrically with said first contact.",
    ),
    { kind: "heading", level: 2, text: "References cited in the file of this patent" },
    {
      kind: "table",
      headers: [text("United States patent"), text("Name"), text("Date")],
      rows: [
        [text("2,813,326"), text("Liebowitz"), text("Nov. 19, 1957")],
        [text("2,836,878"), text("Shepard"), text("June 3, 1958")],
        [text("2,842,723"), text("Koch et al."), text("July 8, 1958")],
        [text("2,849,664"), text("Beale"), text("Aug. 26, 1958")],
      ],
    },
  ],
};

const blocks = noyceIcArchivalEdition.blocks;

/**
 * One deliberately authored, non-lossy companion for every source paragraph.
 * The keys are content-block positions, not PDF pages; the visitor's edition
 * is continuous and no run-time text parsing supplies these readings.
 */
export const noyceIcParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Noyce opens with three manufacturing goals: reliable connections to semiconductor regions, small unitary structures, and many devices in one body. The scope is circuit construction, not merely a new transistor material.",
  ],
  3: [
    "The core move is architectural. A silicon oxide layer remains across surface-reaching P-N junctions, so a deposited metal strip can travel over that insulating bridge without electrically joining the regions on opposite sides.",
  ],
  4: [
    "The seven figures deliberately progress from one transistor and its section, through a multi-device circuit and its equivalent schematic, to parallel-strip contacts. Each source reference above opens the corresponding local facsimile crop.",
  ],
  5: [
    "For the single-transistor example, body 1 is silicon and surface 2 is prepared by known transistor practice. The regions marked I are deliberately high-resistivity: either very pure silicon or silicon compensated with a trace such as gold, so it behaves more like an insulator.",
  ],
  6: [
    "N-type and P-type diffusion creates a small N emitter above a larger P base above an N collector. Junction 3 rings the emitter at the surface; junction 4 rings the base. The drawing exaggerates the layer thicknesses to make this geometry legible.",
  ],
  7: [
    "The source says emitter and base layers are only a few microns thick, while the collector can extend through the body for a back-side contact. It identifies the stack as a familiar double-diffused-junction transistor, not a new transistor effect.",
  ],
  8: [
    "Diffusion in an oxidizing atmosphere grows layer 5 at the same time. Noyce treats that adherent oxide, whether chiefly silicon dioxide or silicon suboxide, as a durable electrical insulator rather than a surface contaminant to strip away.",
  ],
  9: [
    "The contrast with prior practice is precise: older fabrication chemically removed the oxide before putting down contacts. Here only selected areas are opened; the surviving oxide becomes insulation under the future lead pattern.",
  ],
  10: [
    "Oxide tongues 5′ and 5″ cross the exposed edges of junctions 4 and 3/4. They give a metal path a bridge over a junction, but emitter and base contact areas still need windows where metal can touch the semiconductor.",
  ],
  11: [
    "Photoengraving supplies positional control. Resist and a photographic master select oxide to be removed; development and chemical etching clear only the unprotected parts while the remaining resist masks oxide that must stay.",
  ],
  12: [
    "Contact 6 sits on the emitter inside junction 3. Lead 7 crosses oxide tongue 5″ and both junctions to reach it from outside the nested structure. The insulation, not physical separation alone, prevents a short.",
  ],
  13: [
    "The base contact 8 is C-shaped and surrounds the emitter geometry without closing its gap. Lead 9 crosses oxide tongue 5′ to reach the base. The two different oxide bridges let the nested emitter and base be connected independently.",
  ],
  14: [
    "Noyce allows two fabrication routes: evaporate aluminum through a mask, or coat broadly and photoengrave away unwanted metal. Heating after deposition alloys the metal-silicon interface to obtain an ohmic contact where a window was opened.",
  ],
  15: [
    "High-resistivity silicon below leads 7 and 9 reduces stray lead-to-body capacitance. The source gives the oxide thickness as one to two microns and makes this added isolation optional when the capacitance is not troublesome.",
  ],
  16: [
    "A back-side metal coating 10 finishes the collector connection. The practical gain is that broad external leads can be attached away from fragile micrometre-scale emitter and base regions, avoiding microscope-scale wire placement and damaging heat or pressure.",
  ],
  17: [
    "Contacts and their leads are formed together, then widened where external wiring joins. That moves mechanical work away from the active transistor. The passage ties the claimed planar lead process to a concrete manufacturing reliability advantage.",
  ],
  18: [
    "The multi-device example shares one largely P-type silicon body 11 and a grounded back coating 13. Masked diffusion forms several N and P regions, each bounded by surface-reaching dished junctions, in a common substrate.",
  ],
  19: [
    "At the left of Figs. 3 and 4, junctions 14 and 15 form two series rectifying junctions. Contacts 16 and 17 reach the upper region and the two intermediate regions; the source maps their geometry to crystal-diode behavior.",
  ],
  20: [
    "At the right, junction 18 is a separate N region; junctions 20, 21, and 22 form an N-P-N transistor. The P base between 20 and 21 is shorter than a diffusion length so injected electrons are collected; the collector region between 21 and 22 is longer, and junction 22 isolates it from the grounded P body when reverse-biased.",
  ],
  21: [
    "Contacts 23, 24, and 25 are the emitter, base, and collector contacts of the transistor; contact 26 exposes the grounded P layer at the top. Their discoid and C-shaped geometries make the layers independently reachable without abandoning a planar surface.",
  ],
  22: [
    "Layer 27 is the same process principle at circuit scale: keep the oxidized silicon everywhere except contact windows. Deposit aluminum across both oxide and cleared windows, photoengrave unwanted metal away, and alloy only the intended contacts.",
  ],
  23: [
    "The deposited film supplies both contacts and interconnect strips. Because each strip lies on oxide except at a deliberate contact window, it may run across semiconductor regions without becoming an unintended electrical connection.",
  ],
  24: [
    "Leads 28 through 32 assign circuit roles to the planar pattern: input at 28, output at 29, and deliberately resistive narrow leads 30 through 32. Fig. 5 is not a separate invention; its solid lines are an electrical abstraction of Figs. 3 and 4, while broken lines are external apparatus.",
  ],
  25: [
    "The illustrative circuit detects an amplitude-modulated AC input. Series junctions 14 and 15 rectify it, producing at contact 16 a signal corresponding to the modulation envelope; lead 30 contributes resistance in that equivalent circuit.",
  ],
  26: [
    "The rectifier polarity supplies a DC component that reverse-biases junction 18. With little current across it, the charge layers act as a controllable capacitor. Lead 31 is another resistor, and lead 32 plus its contacts and P-body path supply the emitter resistance to ground.",
  ],
  27: [
    "A positive collector supply through load 35 reverse-biases junction 22, so it also acts as a capacitor. Noyce's concrete example therefore places detector, filtering, and transistor-amplifier stages in one compact solid body, while expressly presenting it as an illustration rather than a limit.",
  ],
  28: [
    "Figs. 6 and 7 show a variation with parallel strip contacts. A P emitter lies above an N base and a P collector; junction 38 has an elongated surface outline rather than a circle. Contacts 40 and 41 serve emitter and base, with back-side contact 42 for the collector.",
  ],
  29: [
    "The oxide completely covers the edge of junction 38, preventing an accidental short. Strips 43 and 44 reach contacts 40 and 41 over that oxide. Again Noyce permits mask deposition or blanket plating followed by photoengraving, provided the strips adhere securely to the oxide.",
  ],
  30: [
    "The claims now define legal scope. They are not a claim to every microchip; each specifies a particular surface-reaching P-N geometry, oxide layer, contact configuration, lead path, or circuit relationship.",
  ],
};

const claims = blocks.filter(
  (block): block is Extract<(typeof blocks)[number], { kind: "claim" }> => block.kind === "claim",
);

function manualClaimText(number: number): string {
  const sourceClaim = claims.find((candidate) => candidate.number === number);
  if (!sourceClaim) throw new Error(`Noyce manual edition is missing claim ${number}.`);
  return sourceClaim.inlines.map((inline) => inline.text).join("");
}

export const noyceIcRecordCorrections: Pick<
  Patent,
  | "shortTitle"
  | "subtitle"
  | "summary"
  | "heroQuote"
  | "originalText"
  | "plainEnglishExplanation"
  | "claims"
  | "drawings"
  | "historicalContext"
  | "tags"
  | "stats"
> = {
  // The legacy research record deliberately remains non-exported so that its
  // older prose can be compared during review. Every visitor-facing field it
  // supplied is explicitly replaced here; do not let a partial object spread
  // make experimental reconstruction copy public again.
  shortTitle: "Oxide-insulated semiconductor leads",
  subtitle:
    "Metal strips carried over surface-reaching P-N junctions by retained semiconductor oxide",
  summary:
    "US 2,981,877 describes semiconductor bodies whose surface-reaching P-N junctions remain covered by an oxide layer except at selected contacts. Metal strips adhere to that oxide and cross the junction without shorting it. The specification illustrates one transistor, a multi-device circuit, and a parallel-strip variant; the grant issued on April 25, 1961, from an application filed July 30, 1959.",
  heroQuote:
    "This invention relates to electrical circuit structures incorporating semiconductor devices.",
  originalText:
    "This catalogue excerpt is not the archival edition. Open Original Patent Text for the complete manually prepared specification, all ten claims, all seven figures, and the source-cited references.",
  plainEnglishExplanation: {
    overview:
      "Noyce's specification addresses a practical routing problem inside a semiconductor body. Contacts must reach selected P-type and N-type regions, yet a lead that crosses a surface-reaching P-N junction must not join the two sides electrically. The proposed construction retains an oxide of the semiconductor across the junction and places a metal strip on that insulating surface, opening the oxide only where a contact is intended.",
    coreMechanism:
      "First form the semiconductor regions and their surface-reaching junctions. During diffusion in an oxidizing atmosphere, an oxide layer can form on the exposed silicon. Instead of stripping it away everywhere, clear only the chosen contact areas by photoengraving. Deposit metal over both the cleared areas and the remaining oxide, then remove unwanted metal. A strip on oxide can pass over a junction; a contact through a cleared window can reach a selected region. The patent's examples use this relationship for nested transistor contacts, a multi-device circuit, and parallel-strip contacts.",
    mechanicalBreakdown: [
      {
        title: "Surface-reaching dished junctions",
        summary:
          "A P-N boundary reaches the semiconductor surface, making its geometry available for both insulation and contact layout.",
        technicalDetails:
          "The source calls several such boundaries dished junctions. In the single-transistor example, circular surface edges let a central contact and a surrounding C-shaped contact reach different regions. The important constraint is geometric: contacts on opposite sides of the junction remain separate while the oxide crosses another portion of that same boundary.",
        archaicTerm: "Dished junction",
        modernEquivalent: "Surface-reaching P-N junction with a defined planar perimeter",
      },
      {
        title: "Oxide retained as a lead bridge",
        summary:
          "The oxide is not merely a coating to remove before contacting the silicon; it carries the crossing portion of a metal lead.",
        technicalDetails:
          "The specification describes an insulating layer consisting essentially of oxide of the semiconductor, adherent to the surface and extending across the junction. In the illustrated single-transistor structure, oxide tongues bridge the nested junction edges. The patent reports that the oxide layer may be about one or two microns thick in that example, while making no general performance claim for every device made by the process.",
        archaicTerm: "Oxide layer congenitally united with the body",
        modernEquivalent: "Thermally formed insulating surface oxide",
      },
      {
        title: "Contact windows, deposited metal, and photoengraving",
        summary:
          "Selected oxide areas are cleared for contacts; the remaining oxide insulates metal strips laid across it.",
        technicalDetails:
          "The source permits vacuum deposition through a mask or deposition followed by photoengraving away unwanted metal. It also describes alloying aluminum contacts to silicon to make ohmic contacts. These are alternative fabrication routes in the specification, not a claim that every later integrated circuit uses the same materials, temperatures, or dimensions.",
        archaicTerm: "Photoengraving",
        modernEquivalent: "Patterned resist-and-etch process",
      },
      {
        title: "Multi-device circuit and reverse-biased junctions",
        summary:
          "The larger example combines rectifying junctions, a transistor, resistive leads, and junction capacitances in one body.",
        technicalDetails:
          "In Figs. 3 through 5, the source treats junctions 14 and 15 as rectifiers and explains that a reverse-biased junction 18, and later junction 22, acts as a capacitance. It is an illustrative detector, filtering, and transistor-amplifier arrangement. The patent does not state an operating frequency, clock rate, dopant concentration, or a universal speed limit for the arrangement.",
        archaicTerm: "Crystal diode rectifier",
        modernEquivalent: "P-N junction used for rectification",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electrical insulation across a P-N junction",
        formula:
          "R_{\\text{insulation}} = \\rho_{\\text{oxide}} \\frac{t_{\\text{oxide}}}{A_{\\text{lead}}} \\gg R_{\\text{junction}}",
        explanation:
          "A conducting strip can cross the map of a junction only when the strip is kept electrically separate from the semiconductor below it. Here that separation comes from a retained oxide layer. The patent gives geometry and fabrication relationships, not a source equation for capacitance, depletion width, or breakdown voltage.",
      },
      {
        principle: "Reverse-biased junction capacitance",
        formula:
          "C_j = \\frac{\\varepsilon A}{W} = A \\sqrt{\\frac{q \\varepsilon N_A N_D}{2 (N_A + N_D) (V_0 + V_R)}}",
        explanation:
          "The specification expressly uses reverse-biased junctions 18 and 22 as capacitances in the illustrated circuit. It explains the effect through charge layers on both sides of the junction and says the value at junction 18 can be varied by changing its area. No numeric capacitance value or bias voltage is printed in the grant.",
      },
    ],
    whyItMattersToday:
      "The document is valuable because it makes the routing constraint visible in concrete layouts: a lead can cross an insulating oxide where a P-N junction reaches the surface, while selected windows still provide contact to particular semiconductor regions. The original text shows the legal and geometric details behind that idea rather than treating the patent as a generic history of all later microelectronics.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 protects the basic crossing: two closely spaced contacts on opposite sides of a surface-reaching P-N junction, with oxide retained across a different part of that junction so an adherent conductor can cross there and reach one contact. The legal function is to preserve separate contact access without shorting the junction.",
      keyInnovations: [
        "Oxide bridge across a P-N junction",
        "Two-sided contact access",
        "Adherent crossing conductor",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 narrows the crossing arrangement to nested extrinsic P and N regions. It requires ohmic contacts to the overlying and underlying regions, an oxide layer across their enclosing junction, and a metal strip that crosses the oxide while the second contact encircles the junction on both sides of that strip.",
      keyInnovations: [
        "Nested extrinsic regions",
        "Encircling second contact",
        "Ohmic oxide-crossing lead",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 specifies the concentric geometry shown in the drawings: a circular dished junction, a central discoid contact, and a surrounding C-shaped contact. The oxide passes through the C's gap, allowing a strip to cross the junction to the central contact while remaining insulated from the two C ends.",
      keyInnovations: [
        "Concentric discoid contact",
        "C-shaped surrounding contact",
        "Insulated gap-crossing strip",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 applies that geometry to a diffused silicon transistor. It calls for an emitter contact inside a circular emitter junction, a C-shaped base contact around it, oxidized silicon grown with the body, and a metal strip that reaches the emitter across the oxide and between the base contact's ends.",
      keyInnovations: [
        "Diffused silicon transistor",
        "Congenitally united oxide",
        "Emitter lead through base-contact gap",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 adds a high-resistivity region beneath part of an oxide-supported metal strip. Its legal contribution is not simply the lead: the underlying resistive silicon reduces the unwanted lead-to-body shunt capacitance while the strip crosses the surface-reaching P-N junction.",
      keyInnovations: [
        "High-resistivity underlay",
        "Reduced shunt capacitance",
        "Oxide-supported metal strip",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 claims a circuit use of the structure. A DC voltage between the strip connected to the overlying region and the second contact reverse-biases their junction, so the junction is used as a capacitor rather than as a conducting path.",
      keyInnovations: [
        "Reverse-biased junction capacitor",
        "DC bias circuit means",
        "Oxide-crossing first-contact strip",
      ],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 expands the unit from one junction to three alternating P/N regions. It requires two surface-reaching dished junctions, three contacts, oxide over both junctions, a first strip crossing both junctions, and a second strip crossing the second junction to connect the second region.",
      keyInnovations: [
        "Three alternating semiconductor regions",
        "Two dished P-N junctions",
        "Independently routed first and second strips",
      ],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [7],
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 depends on Claim 7 and fixes the second and third contacts as nested C-shaped metal strips. The smaller C substantially encircles the first junction, while the larger C substantially encircles the second junction, preserving the concentric contact architecture of the illustrated circuit.",
      keyInnovations: [
        "Nested C-shaped contacts",
        "First-junction enclosure",
        "Second-junction enclosure",
      ],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 generalizes to many dished P-N junctions and their enclosed semiconductor regions. It claims the combination of respective surface contacts, an oxide layer extending across multiple junctions, and metal strips over that oxide that provide multiple electrical interconnections.",
      keyInnovations: [
        "Plurality of dished junctions",
        "Multiple enclosed regions",
        "Multi-junction planar interconnections",
      ],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: manualClaimText(10),
      plainEnglish:
        "Claim 10 covers the Fig. 6 and 7 variant: an elongated closed junction outline with parallel metal-strip contacts, one inside and one outside the outline. An oxide layer crosses the junction, and a further metal strip on that oxide reaches the inner contact both physically and electrically.",
      keyInnovations: [
        "Elongated closed junction",
        "Parallel strip contacts",
        "Oxide-crossing connection to inner contact",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Transistor-and-lead structure",
      caption:
        "Greatly enlarged plan view of one transistor-and-lead structure described in the specification.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-lead",
          figureRef: "Fig. 1",
          label: "11",
          element: "Adherent metal lead",
          description: "Vapor-deposited aluminum lead extending over insulating oxide.",
          x: 50,
          y: 35,
        },
        {
          id: "noyce-contact",
          figureRef: "Fig. 1",
          label: "12",
          element: "Central contact",
          description: "Ohmic contact window to underlying semiconductor region.",
          x: 50,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Section through Fig. 1",
      caption:
        "Section taken along the line 2-2 of Fig. 1, showing the relationship of the semiconductor body, oxide, and leads.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-oxide",
          figureRef: "Fig. 2",
          label: "13",
          element: "Silicon oxide insulating layer",
          description: "Thermally grown SiO2 layer insulating the lead from the junction.",
          x: 50,
          y: 40,
        },
        {
          id: "noyce-junc",
          figureRef: "Fig. 2",
          label: "14",
          element: "Dished P-N junction",
          description: "Junction extending to the planar surface beneath the protective oxide.",
          x: 35,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Multi-device semiconductor-and-lead structure",
      caption:
        "Greatly enlarged plan view of a semiconductor body carrying multiple transistor structures and their leads.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-leads",
          figureRef: "Fig. 3",
          label: "16, 17",
          element: "Deposited interconnect strips",
          description: "Planar metal strips interconnecting multiple circuit components.",
          x: 45,
          y: 50,
        },
        {
          id: "noyce-juncs",
          figureRef: "Fig. 3",
          label: "18",
          element: "Reverse-biased junction",
          description: "Junction operated as a capacitor in the multi-device circuit.",
          x: 65,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Section through Fig. 3",
      caption:
        "Section taken along the line 4-4 of Fig. 3, showing the depth relationship of the semiconductor regions and contact structure.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-cross",
          figureRef: "Fig. 4",
          label: "19",
          element: "Cross-sectional semiconductor body",
          description: "Unitary semiconductor wafer supporting multiple active regions.",
          x: 50,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Equivalent circuit of the multi-device structure",
      caption:
        "Simplified equivalent circuit corresponding to the multi-device semiconductor structure of Figs. 3 and 4.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-diode",
          figureRef: "Fig. 5",
          label: "D1, D2",
          element: "Equivalent diode junctions",
          description: "Circuit diagram representation of integrated P-N junctions.",
          x: 35,
          y: 50,
        },
        {
          id: "noyce-trans",
          figureRef: "Fig. 5",
          label: "T1",
          element: "Equivalent transistor",
          description: "Circuit diagram representation of the integrated planar transistor.",
          x: 65,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Alternate transistor-and-lead structure",
      caption:
        "Plan view of the alternate transistor-and-lead construction discussed in the specification.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-strip",
          figureRef: "Fig. 6",
          label: "26",
          element: "Parallel contact strips",
          description: "Elongated metal strip contacts for high-frequency operation.",
          x: 45,
          y: 50,
        },
        {
          id: "noyce-bridge",
          figureRef: "Fig. 6",
          label: "27",
          element: "Oxide-crossing lead bridge",
          description: "Deposited lead extending over oxide to inner contact strip.",
          x: 60,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 7",
      title: "Section through Fig. 6",
      caption:
        "Section taken along the line 7-7 of Fig. 6, showing the alternate structure in cross section.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "noyce-sec7",
          figureRef: "Fig. 7",
          label: "28",
          element: "Elongated junction profile",
          description: "Cross section through elongated parallel-strip transistor structure.",
          x: 50,
          y: 55,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification identifies the problem as making electrical connections to semiconductor regions while building compact unitary circuit structures that can include numerous devices in one body of material.",
    priorArtLimitations: [
      "The source says prior practice removed the oxide layer after diffusion except where contacts were to be made, losing the insulating surface needed for a lead to cross a junction.",
      "The source describes the difficulty of attaching external leads directly to small emitter and base contacts without damaging the semiconductor body through applied heat or pressure.",
    ],
    breakthroughInsight:
      "Retain the semiconductor oxide across selected junction edges and use it as the insulating support for deposited metal strips, while clearing only the contact areas that need direct electrical connection.",
    patentWars: [],
    civilizationalImpact:
      "The grant provides a primary-source record of a planar semiconductor lead structure: its legal scope, figure geometry, fabrication alternatives, and the illustrative multi-device circuit are available together for close technical reading.",
    aftermath:
      "The patent issued on April 25, 1961. This catalogue does not infer a litigation result, a priority award, or a later-product lineage from the grant alone.",
  },
  tags: [
    "Robert N. Noyce",
    "Semiconductor device-and-lead structure",
    "P-N junction",
    "Silicon oxide",
    "Photoengraving",
    "Planar metal lead",
  ],
  stats: { totalClaims: 10, independentClaims: 9 },
};
