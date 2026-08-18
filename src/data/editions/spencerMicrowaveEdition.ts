import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});

const claim = (number: number, text: string) => ({
  kind: "claim" as const,
  number,
  inlines: literal(text),
});

const SPENCER_FIGURE_PREVIEW = {
  src: "/patents/figures/us-2495429-spencer-microwave/fig-1-source-crop-v1.png",
  alt: "US 2,495,429 drawing: two magnetron oscillators feed a common wave guide and conveyor treatment region.",
  width: 2040,
  height: 1550,
} as const;

/**
 * This reference is authored at the sole source occurrence. It opens a
 * selected crop from the pinned drawing sheet; it is never inferred by a
 * formatter from the words around it.
 */
const singleFigureReference: CuratedSpecificationInline = {
  kind: "reference",
  text: "single figure",
  href: "#",
  referenceType: "figure",
  label: "Preview the sole drawing from US 2,495,429",
  figurePreviews: [SPENCER_FIGURE_PREVIEW],
};

const term = (
  text: string,
  definition: string,
  label = "Patent vocabulary",
): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
  label,
});

/**
 * A continuous, source-led reading edition of US 2,495,429. The three pinned
 * sheets were visually reviewed: one drawing sheet, two specification columns,
 * six claims, signature, and the printed references-cited table.
 */
export const spencerMicrowaveArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "c5affa57d71dd79a431c8a87427672d9d04579cab911b1b6b5eec9a16ad00aca",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "2,495,429.",
        "METHOD OF TREATING FOODSTUFFS.",
        "Percy L. Spencer, West Newton, Mass., assignor to Raytheon Manufacturing Company, Newton, Mass., a corporation of Delaware.",
        "Application October 8, 1945, Serial No. 620,919. 6 Claims. (Cl. 99-217.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "DRAWING SHEET",
      title: "Sole apparatus schematic",
      description: literal(
        "P. L. SPENCER. METHOD OF TREATING FOODSTUFFS. Filed Oct. 8, 1945. 2,495,429. MAGNETRON OSCILLATOR. POWER LINES. COMMON WAVE GUIDE. FOOD TO BE COOKED. CONVEYOR SYSTEM. INVENTOR: PERCY L. SPENCER. BY ELMER J. GORR, ATTY.",
      ),
    },
    paragraph(
      literal(
        "My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Such energy has been used before for this purpose, but the frequencies employed have been relatively low, for example, not over ",
      },
      term(
        "50 megacycles",
        "Fifty megahertz. “Megacycles” was a period name for millions of cycles per second.",
      ),
      {
        kind: "text",
        text: ". I have found that at frequencies of this order of magnitude, the energy necessarily expended in order to generate sufficient heat to satisfactorily cook the foodstuff is much too high to permit the practical use of the process. I have further found, however, that this disadvantage may be eliminated by employing wave lengths falling in the ",
      },
      term(
        "microwave region",
        "The shorter-wavelength radio-frequency part of the electromagnetic spectrum. Spencer gives about ten centimetres or less as his example.",
      ),
      {
        kind: "text",
        text: " of the electromagnetic spectrum, for example, wave lengths of the order of 10 centimeters or less. By so doing, the wave length of the energy becomes comparable to the average dimension of the foodstuff to be cooked, and as a result, the heat generated in the foodstuff becomes intense, the energy expended becomes a minimum, and the entire process becomes efficient and commercially feasible.",
      },
    ]),
    paragraph(
      literal(
        "It is, therefore, one of the objects of my present invention to provide an efficient method of employing electromagnetic energy for the cooking of foodstuffs.",
      ),
    ),
    paragraph(
      literal(
        "In the accompanying specification I shall describe, and in the annexed drawing show, an illustrative embodiment of the method and means for treating foodstuff of my present invention. It is, however, to be clearly understood that I do not wish to be limited to the details herein shown and described for purposes of illustration only, inasmuch as changes therein may be made without the exercise of invention and within the true spirit and scope of the claims hereto appended.",
      ),
    ),
    paragraph([
      { kind: "text", text: "In said drawing, the " },
      singleFigureReference,
      {
        kind: "text",
        text: " is a schematic arrangement of apparatus which may be utilized to carry out the method of my present invention.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Referring now more in detail to the aforesaid illustrative embodiment of my present invention, with particular reference to the drawing illustrating the same, the numerals 10 and 11 generally designate ",
      },
      term(
        "electron-discharge devices",
        "Vacuum electronic devices in which controlled electron motion carries current; here they are magnetron oscillators.",
      ),
      {
        kind: "text",
        text: " of the magnetron type, each including, for example, an evacuated envelope 12, made of highly conductive material, such as copper, and provided with a plurality of inwardly-directed, radially-disposed anode vanes 13. The arrangement is such that each pair of adjacent anode vanes 13 forms, together with that portion of the envelope 12 lying therebetween, a ",
      },
      term(
        "cavity resonator",
        "A conductive enclosure whose geometry selects electromagnetic resonant frequencies. Here adjacent anode vanes and their enclosing wall make each cavity.",
      ),
      {
        kind: "text",
        text: " whose natural resonant frequency is, as is well known to those skilled in the art, a function of the geometry of the physical elements making up the same. For the purposes of my present invention it is desirable that the dimensions of each such cavity resonator be such that the wave length of the electrical oscillations adapted to be generated therein is comparable to the average dimension of the foodstuff to be cooked, for example, of the order of 10 centimeters or less.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "Centrally located in each envelope 12 is a highly electron-emissive cathode member 14, for example, of the well-known alkaline-earth metal oxide type, said cathode member being provided with conventional means (not shown) for raising the temperature thereof to a level sufficient for ",
      },
      term(
        "thermionic emission",
        "Electron release from a heated material. In a vacuum tube, the heated cathode supplies the electrons that the electric and magnetic fields steer.",
      ),
      { kind: "text", text: "." },
    ]),
    paragraph(
      literal(
        "Each electron-discharge device 10 is completed by magnetic means (not shown) for establishing a magnetic field in a direction transversely of the electron path between the cathode and anode members thereof.",
      ),
    ),
    paragraph(
      literal(
        "The conductive envelopes 12 of the electron-discharge devices 10 and 11 are connected, respectively, by conductors 15 and 16, to the opposite terminals of the secondary winding 17 of a transformer 18, the primary winding 19 of said transformer being connected to a source of raw A.-C., for example, the conventional 60 cycle power lines. The cathodes 14 of said electron-discharge devices 10 and 11 are tied together by conductors 20 and 21, which are, in turn, connected, by a conductor 22, to a center tap on the secondary winding 17 of the transformer 18.",
      ),
    ),
    paragraph([
      {
        kind: "text",
        text: "Thus, the electron-discharge devices 10 and 11 are connected for ",
      },
      term(
        "push-pull operation",
        "A two-device circuit arrangement in which the devices operate on opposite halves of an alternating waveform.",
      ),
      {
        kind: "text",
        text: ", whereby said devices alternately deliver hyper-frequency energy to a common, hollow ",
      },
      term(
        "wave guide",
        "A hollow conductive passage that channels electromagnetic energy by its internal boundary conditions.",
      ),
      {
        kind: "text",
        text: " 23 through coaxial transmission lines 24 and 25 which are coupled to their respective oscillators, for example, by loops 26 and 27.",
      },
    ]),
    paragraph(
      literal(
        "Adjacent the outlet end of the wave guide 23 I provide an appropriate, transversely-moving conveyor system 28 for carrying the foodstuff to be cooked into a region where it will be exposed to the energy emanating from said wave guide, the speed at which said conveyor system is operated being determined by the nature of the particular foodstuff to be cooked, and the time required for cooking the same.",
      ),
    ),
    paragraph(
      literal(
        "With the system described, I have found that an egg may be rendered hardboiled with the expenditure of 2 kw.-sec. This compares with an expenditure of 36 kw.-sec. to conventionally cook the same. I have also found that with my system a potato requires the expenditure of about 240 kw.-sec., which compares with 72,000 kw.-sec. necessary to bake the same in an electric oven. These examples are, it is to be clearly understood, merely illustrative. I have observed similar results with other foodstuffs. In each instance, where the wave length of the energy is of the order of the average dimension of the foodstuff to be cooked, the process is very efficient, requiring the expenditure of a minimum amount of energy for a minimum amount of time.",
      ),
    ),
    paragraph(
      literal(
        "This completes the description of the aforesaid illustrative embodiment of my present invention. It will be noted from all of the foregoing that my process is simple and easily practiced; it is economical; and it requires relatively simple and inexpensive equipment.",
      ),
    ),
    paragraph(
      literal(
        "Other objects and advantages of my present invention will readily occur to those skilled in the art to which the same relates.",
      ),
    ),
    paragraph(literal("What is claimed is:")),
    claim(
      1,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
    ),
    claim(
      2,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate of speed as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
    ),
    claim(
      3,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
    ),
    claim(
      4,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
    ),
    claim(
      5,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate of speed as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
    ),
    claim(
      6,
      "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
    ),
    paragraph(literal("PERCY L. SPENCER.")),
    { kind: "heading", level: 2, text: "References Cited" },
    {
      kind: "table",
      headers: [literal("Number"), literal("Name"), literal("Date")],
      rows: [
        [literal("1,181,219"), literal("Goucher"), literal("May 2, 1916")],
        [literal("1,863,222"), literal("Hoermann"), literal("June 14, 1932")],
        [literal("1,900,573"), literal("McArthur"), literal("Mar. 7, 1933")],
        [literal("1,945,867"), literal("Rawls"), literal("Feb. 6, 1934")],
        [literal("1,981,583"), literal("Craig"), literal("Nov. 20, 1934")],
        [literal("1,992,515"), literal("Uhlmann"), literal("Feb. 26, 1935")],
        [literal("2,052,919"), literal("Brogdon"), literal("Sept. 1, 1936")],
        [literal("2,094,602"), literal("Kassner"), literal("Oct. 5, 1937")],
        [literal("2,382,033"), literal("Supplee et al."), literal("Aug. 14, 1945")],
      ],
    },
  ],
};

/**
 * These paragraph companions intentionally retain the mechanism, dimensions,
 * stated economy figures, and claim-facing limits of their source paragraphs.
 */
export const spencerMicrowaveParallelReadings: Readonly<
  Record<number, readonly string[]>
> = {
  2: [
    "Spencer states a field of use rather than a particular kitchen appliance: treating food, especially cooking it, with electromagnetic energy.",
  ],
  3: [
    "He contrasts his proposal with prior food-heating attempts using frequencies no higher than 50 megacycles, now 50 MHz. In his account, producing enough heat at that frequency cost too much energy for a practical process.",
    "His stated move is to use microwave wavelengths of about 10 centimetres or less. He ties that scale to the average size of the food body and says the resulting heat becomes intense while the energy expenditure falls. The paragraph gives the claimed comparison of scales; it does not specify a household oven frequency or a door design.",
  ],
  4: [
    "The expressly stated object is an efficient food-cooking method using electromagnetic energy. The following description supplies one apparatus that can perform it, but the claims define the requested legal scope.",
  ],
  5: [
    "Spencer will describe one illustrative method and apparatus in the drawing. He reserves room for changes that do not require inventive work and remain within the appended claims, so the pictured machine is not the whole claimed subject matter.",
  ],
  6: [
    "The patent has one schematic drawing. It shows the paired oscillator supply, the common wave guide, and a transverse conveyor that takes food into the energy region.",
  ],
  7: [
    "Numbers 10 and 11 are two magnetron-type vacuum devices. Each has a conductive evacuated envelope, suggested as copper, with inward radial anode vanes. The envelope wall plus each adjacent vane pair forms a cavity resonator.",
    "The resonant frequency is set by geometry. Spencer wants cavities that generate an electrical wavelength comparable with the average dimension of the food being treated, giving ten centimetres or less as his example. The source describes a geometry condition, not a measured power output or a universal 2.45 GHz setting.",
  ],
  8: [
    "Each evacuated envelope has central cathode 14. Spencer gives an alkaline-earth metal-oxide cathode as an example and assumes conventional heating hardware sufficient to produce thermionic emission.",
  ],
  9: [
    "Magnetic hardware, not drawn, establishes a field transverse to the electron path between the cathode and anode. That is the magnetic part of the illustrated magnetron arrangement.",
  ],
  10: [
    "The two conductive envelopes connect to opposite ends of transformer secondary winding 17 through conductors 15 and 16. Transformer 18 has a primary winding 19 on ordinary 60-cycle alternating-current lines.",
    "The cathodes are tied together through conductors 20 and 21, and conductor 22 joins them to the secondary's centre tap. Those exact connections are what makes the next paragraph's push-pull operation possible.",
  ],
  11: [
    "The two devices work push-pull, alternately delivering high-frequency energy. Coaxial lines 24 and 25 carry it to common hollow wave guide 23, with loops 26 and 27 given as example couplers.",
    "A wave guide here is the conductive passage to the treatment region. The source does not call it a sealed household cooking chamber, nor does it describe a quarter-wave door choke.",
  ],
  12: [
    "Conveyor 28 moves food across the wave-guide outlet into the radiated-energy region. Its speed is selected for the particular food and required cooking time, which is the conveyor limitation later repeated in claims 2 and 5.",
  ],
  13: [
    "Spencer reports two source examples: a hard-boiled egg at 2 kilowatt-seconds against 36 kilowatt-seconds for conventional cooking, and a potato at about 240 kilowatt-seconds against 72,000 kilowatt-seconds in an electric oven. Those are source observations, not independently verified appliance ratings.",
    "He treats the examples as illustrative and repeats his scale condition: when the wavelength is of the order of the average food dimension, the process is said to use minimum energy for minimum time.",
  ],
  14: [
    "This is the source's closing assessment of the illustrated method: simple to practice, economical, and requiring relatively simple, inexpensive equipment. It is not a claim that every later microwave appliance has those properties.",
  ],
  15: [
    "Spencer makes the conventional closing statement that practitioners in the field will recognize other objects and advantages. It adds no separate apparatus limitation.",
  ],
  16: [
    "The six claims that follow define a method rather than a particular magnetron, housing, or door. Claims 1 through 3 use microwave-region wavelength; claims 4 through 6 narrow that to substantially ten centimetres.",
  ],
  23: [
    "Percy L. Spencer signs the specification. The printed reference table after the signature is preserved as part of the supplied patent sheet.",
  ],
};
