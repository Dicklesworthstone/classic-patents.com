import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

const figure = (id: string, label: string): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: `#boyle-smith-ccd-fig-${id}`,
  referenceType: "figure",
  label: `Open the source-faithful crop for ${label} of US 3,858,232`,
  figurePreviews: [
    {
      src: `/patents/figures/us-3858232-boyle-smith-ccd-fig-${id}-preview.png`,
      alt: `${label} from US 3,858,232, Information Storage Devices.`,
      width: 720,
      height: 720,
    },
  ],
});

/**
 * The claims are transcribed from printed specification pages 16–20 of the
 * reviewed 19-page facsimile.  This authored list is not derived from OCR.
 */
export const boyleSmithCcdClaimTexts = [
  {
    number: 1,
    text: "In a charge transfer apparatus of the type for storage and serial transfer of charge carriers localized in a plurality of induced potential energy minima along a portion of a semiconductor charge storage medium by sequentially applying different potentials to successive portions of the surface of the medium through a plurality of electrodes, the invention characterized in that the charge storage medium is of a single conductivity type.",
  },
  {
    number: 2,
    text: "In a charge transfer apparatus of the type for storage and serial transfer of charge carriers localized in a plurality of induced potential energy minima along a portion of a semiconductor charge storage medium by sequentially applying different potentials to successive portions of the surface of the medium through a plurality of electrodes, the invention characterized in that the portion of the charge storage medium in which charges are stored and transferred and which directly underlies each electrode of said plurality of electrodes is of a single conductivity type.",
  },
  {
    number: 3,
    text: "The apparatus of claim 2 in which the charge storage medium is covered with an insulating layer and the plurality of electrodes are disposed on the insulating layer.",
  },
  { number: 4, text: "The apparatus of claim 3 in which the charge storage medium is silicon." },
  { number: 5, text: "The apparatus of claim 3 in which the insulating layer comprises SiO₂." },
  {
    number: 6,
    text: "The apparatus of claim 2 including means for exposing the device to light in order to form the charge carriers.",
  },
  {
    number: 7,
    text: "The apparatus of claim 6 in which charge carriers are formed simultaneously in a plurality of potential energy minima.",
  },
  {
    number: 8,
    text: "The apparatus of claim 2 further including a piezoelectric layer formed on one surface of the device with means for creating an acoustic wave in the layer so that an electrical field is created by the acoustic wave propagating in the piezoelectric layer.",
  },
  {
    number: 9,
    text: "The apparatus of claim 2 in which the portion of the charge storage medium in which charges are stored and transferred is a surface portion.",
  },
  {
    number: 10,
    text: "A charge coupled device comprising a charge storage medium, a charge input region at a first location in the charge storage medium at which charge carriers representing signal information can be introduced into the medium, a charge detection region at a second location in the charge storage medium at which charge carriers can be detected and a charge storage and transfer channel interconnecting the input region and the detection region, the charge storage and transfer channel consisting of a single conductivity type semiconductor, an insulating layer overlying the charge storage medium, and at least four discrete electrodes disposed on the insulating layer overlying the charge storage and transfer channel.",
  },
  {
    number: 11,
    text: "The device of claim 10 in which the charge input region for introducing charge carriers comprises a p-n junction.",
  },
  {
    number: 12,
    text: "The device of claim 10 in which the charge input region for introducing charge carriers comprises a metal-insulator-semiconductor device.",
  },
  {
    number: 13,
    text: "A semiconductive device comprising a semiconductive charge storage layer having a major surface, an insulating layer overlying said major surface, an electrode assembly on the insulating layer including a plurality of electrodes, means for forming a succession of spaced storage sites for the storage of charge carriers in the charge storage layer and for transferring stored charge carriers between successive sites in a predetermined direction, and wherein the charge storage and transfer layer consists of a material that is of a single conductivity type.",
  },
  {
    number: 14,
    text: "A semiconductive device comprising a semiconductive charge storage layer having a major surface, an insulating layer overlying said major surface, an electrode assembly on the insulating layer including a plurality of electrodes, means for forming a succession of spaced storage sites for the storage of charge carriers in the charge storage layer and for transferring stored charge carriers between successive sites in a predetermined direction, and wherein the portion of the charge storage and transfer layer that directly underlies each electrode is of a single conductivity type.",
  },
  {
    number: 15,
    text: "The device of claim 14 further including three separate conductors each connected to a different one of every third electrode of the plurality of electrodes.",
  },
  {
    number: 16,
    text: "The device of claim 15 in which the electrodes are shaped and placed so that the three separate conductors extend parallel to one another.",
  },
  {
    number: 17,
    text: "The device of claim 14 in which the means for forming a succession of spaced storage sites includes circuit means connected to the plurality of electrodes for applying pulses sequentially to each of the plurality of electrodes.",
  },
  { number: 18, text: "The device of claim 17 in which the pulses are square wave pulses." },
  { number: 19, text: "The device of claim 17 in which the pulses are sine wave pulses." },
  { number: 20, text: "The device of claim 17 in which the pulses are sawtooth pulses." },
  {
    number: 21,
    text: "The device of claim 14 including electrical circuit means for biasing all of the electrodes at a uniform potential so that the surface of the semiconductor charge storage layer can be maintained depleted during operation of the device.",
  },
  {
    number: 22,
    text: "The device of claim 14 in which the space between each of the plurality of electrodes is approximately 3 microns.",
  },
  {
    number: 23,
    text: "The device of claim 14 in which the length of each of the plurality of electrodes as measured in the predetermined direction is comparable to or less than the thickness of the insulating layer.",
  },
  {
    number: 24,
    text: "The device of claim 14 including charge detection means at a charge detection region for detecting the presence, absence or amount of charge in the charge detection region.",
  },
  {
    number: 25,
    text: "The device of claim 24 in which the charge detection means comprises a metal-insulator-semiconductor device.",
  },
  {
    number: 26,
    text: "The device of claim 25 in which the metal-insulator-semiconductor device is connected to the gate of a field-effect transistor for measuring the capacitance of the metal-insulator-semiconductor device.",
  },
  {
    number: 27,
    text: "The device of claim 24 in which the charge detection means is coupled to a charge input means to recirculate charge.",
  },
  {
    number: 28,
    text: "The device of claim 24 including means for regenerating the charge detected by the charge detection means.",
  },
  {
    number: 29,
    text: "The device of claim 24 in which the charge detection means comprises a capacitive bridge circuit electrically coupled to the charge detection region for measuring changes in the capacitance of the charge detection region.",
  },
  {
    number: 30,
    text: "The device of claim 24 in which the charge detection means comprises two adjacent electrodes overlying the charge detection region with means for connecting an alternating current to the electrodes and means for measuring the power dissipation of the alternating current.",
  },
  {
    number: 31,
    text: "A multichannel shift register comprising a body of semiconductor material of a uniform conductivity type, a thin insulating layer covering at least a portion of one surface of said body, a plurality of series of metal electrodes formed on the insulating layer, each series constituting one channel of the shift register and defining a path along the subjacent surface of the semiconductor body, the path having a single conductivity type, means for establishing charge carriers in the body of the semiconductor beneath a first electrode of each series, electrical circuit means interconnecting the electrodes to sequentially vary the bias on each series of electrodes and propagate a potential well stepwise along said path below the electrodes thereby translating the charge carriers through the semiconductor along said path, and detector means in each series associated with an electrode removed in the series from said first electrode for detecting the presence or absence of charge carriers in the semiconductor below its associated electrode.",
  },
  {
    number: 32,
    text: "A multichannel shift register comprising a semiconductor body, a thin insulating layer covering at least a portion of one surface of said body, an array of metal electrodes formed on the insulating layer, a plurality of input electrodes arranged along one side of the array, a plurality of output electrodes arranged along the opposite side of the array and a series of groups of transfer electrodes extending between each input electrode and an output electrode, each series comprising with its associated input and output electrodes one channel of the shift register, the spacing between electrodes in each series being less than the spacing between electrodes in adjacent series, each group of electrodes comprising a first electrode, a second electrode, and a third electrode in sequence, first, second and third conductors respectively connected to every first, second and third electrodes, and electrical circuit means interconnected to vary sequentially the bias on the first, second and third conductors with electrical pulses which overlap, the shift register characterized in that the regions of the semiconductor body directly beneath each transfer electrode are of a single conductivity type.",
  },
] as const;

export const boyleSmithCcdFigureSheets = [
  ["1a", "FIG. 1A", "Charge generation and the first potential well"],
  ["1b", "FIG. 1B", "Minority-carrier generation and storage"],
  ["1c", "FIG. 1C", "Overlapped depletion regions"],
  ["1d", "FIG. 1D", "Charge shifted into the next potential well"],
  ["2", "FIG. 2", "Shift-register embodiment with input, output, and regeneration"],
  ["3", "FIG. 3", "Pulse program for the shift register"],
  ["4", "FIG. 4", "Preferred charge-translation arrangement"],
  ["5", "FIG. 5", "Buried-channel charge-coupled device"],
  ["6", "FIG. 6", "Gated input arrangement"],
  ["7a", "FIG. 7A", "Capacitive-bridge output detector"],
  ["7b", "FIG. 7B", "Alternating-current output detector"],
  ["7c", "FIG. 7C", "Integrated field-effect-transistor detector"],
  ["8", "FIG. 8", "Charge transfer through the storage-medium thickness"],
  ["9a", "FIG. 9A", "Field-enhanced transfer with adjacent electrodes"],
  ["9b", "FIG. 9B", "Shaped-pulse field enhancement"],
  ["10", "FIG. 10", "Multichannel shift register"],
  ["11", "FIG. 11", "Conductor arrangement avoiding crossovers"],
  ["12", "FIG. 12", "Perspective of a preferred electrical-contact arrangement"],
  ["13", "FIG. 13", "Alternative electrical-contact arrangement"],
  ["14", "FIG. 14", "Parallel read-in image-detection device"],
  ["15", "FIG. 15", "Acoustic-wave charge translation"],
  ["16", "FIG. 16", "Electrodeless acoustic-wave alternative"],
] as const;

/**
 * Continuous manual reading edition from every printed source page.  Drawing
 * sheets are represented once by their actual figures; scan page furniture is
 * intentionally not reconstructed in the reader.
 */
export const boyleSmithCcdArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
  preparedBy: "Classic Patents editorial agent (SilverRiver)",
  preparedAt: "2026-08-17",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT",
        "WILLARD STERLING BOYLE, OF SUMMIT, AND GEORGE ELWOOD SMITH, OF MURRAY HILL, NEW JERSEY, ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, OF BERKELEY HEIGHTS, NEW JERSEY.",
        "INFORMATION STORAGE DEVICES.",
        "Patent No. 3,858,232. Patented Dec. 31, 1974. Filed Nov. 9, 1971. Appl. No. 196,933.",
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "CROSS REFERENCE TO RELATED APPLICATION. This application is a continuation-in-part of our copending application, Ser. No. 11,541, filed Feb. 16, 1970, now abandoned, by W. S. Boyle and G. E. Smith. This invention relates to information storage devices known as charge coupled devices.",
      ),
    },
    { kind: "heading", level: 2, text: "Background of the Invention" },
    {
      kind: "paragraph",
      inlines: literal(
        "There is a wide variety of electrical devices in which information storage is an essential feature. Memory and logic devices often rely on magnetic mechanisms in which the information is represented by the polarity of magnetic domains stored in a sheet, hollow core or wire. In the usual form of the video camera an optical image is stored in the form of electrostatic charge on a monolithic storage layer. The localized charge density of the electrostatic pattern is then read with a scanning electron beam. Information storage is also implicit in delay lines, typically acoustic or electromechanical devices with information stored dynamically in a traveling elastic wave.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The present invention involves an information storage mechanism that is unique and versatile. It is based largely on the recognition that electric charge can be stored in a spatially defined potential minimum within a semiconductor; that the storage site within the semiconductor can be selected; and, most importantly, that the storage site can be changed within the semiconductor in at least two dimensions. Thus electric charge, representing information, can be generated, translated and retrieved.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The detailed description identifies the drawing sequence: " },
        figure("1a", "FIGS. 1A to 1D"),
        { kind: "text", text: " illustrate charge translation; " },
        figure("2", "FIG. 2"),
        { kind: "text", text: " is the shift register; " },
        figure("3", "FIG. 3"),
        {
          kind: "text",
          text: " is its pulse program; and the remaining figures treat preferred translation, input, detection, multichannel, imaging, and acoustic-wave embodiments.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "Detailed Description of the Invention" },
    {
      kind: "paragraph",
      inlines: literal(
        "FIGS. 1A to 1D illustrate the charge transfer process according to one embodiment. A semiconductor substrate 10 is covered with insulating film 11 and two metal electrodes 12 and 13 that form part of an array. With electrode 12 biased and electrode 13 not biased, depletion region or potential well 14 forms below electrode 12. Minority charges 15, created for example through hole-electron pair generation from photon absorption, migrate to and are stored in region 14. When electrode 13 is biased simultaneously with electrode 12, the depletion region extends continuously below both electrodes. When the bias on electrode 12 is removed, the depletion region beneath it collapses and shifts the charge to potential well 14′ associated with electrode 13. The substrate and charge signs can be reversed.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        { kind: "text", text: "The shift-register embodiment of " },
        figure("2", "FIG. 2"),
        {
          kind: "text",
          text: " uses semiconductor substrate 20, dielectric layer 21, and electrodes 22 to 24 repeated in triplets. Conductors 22′, 23′, and 24′ connect each third electrode. Input stage 25 is driven to avalanche and transfers generated charge to potential well 27a. Sequential pulses shown in ",
        },
        figure("3", "FIG. 3"),
        {
          kind: "text",
          text: " move the wells and stored charge toward p-n-junction output region 28, where pulse output is detected across load 30; regeneration circuit 33 can return the output signal to the input.",
        },
      ],
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The specification also describes recirculation, regeneration, threshold logic, alternative input generation, p-n and Schottky detection, and output detectors. A preferred pulse program has consecutive pulses separated by Δt less than three pulse widths tₚ, so that successive potential wells overlap. It states that overlap prevents a well from collapsing before the next accepts its charge, and reports a quick charge-transfer time under the illustrated conditions.",
      ),
    },
    {
      kind: "paragraph",
      inlines: [
        {
          kind: "text",
          text: "The source then describes uniform-bias, buried-channel, gated-input, two-dimensional, thickness-direction, field-enhanced, asymmetric-field, fixed-charge, multichannel, crossover-avoiding, image, and acoustic-wave forms, respectively shown in ",
        },
        figure("4", "FIG. 4"),
        { kind: "text", text: ", " },
        figure("5", "FIG. 5"),
        { kind: "text", text: ", " },
        figure("6", "FIG. 6"),
        { kind: "text", text: ", " },
        figure("8", "FIG. 8"),
        { kind: "text", text: ", " },
        figure("9a", "FIGS. 9A and 9B"),
        { kind: "text", text: ", " },
        figure("10", "FIG. 10"),
        { kind: "text", text: ", " },
        figure("11", "FIG. 11"),
        { kind: "text", text: ", " },
        figure("14", "FIG. 14"),
        { kind: "text", text: ", and " },
        figure("15", "FIGS. 15 and 16"),
        {
          kind: "text",
          text: ". The printed source also retains the cited earlier applications and the material examples: 10 ohm/cm n-type silicon, 1,000–2,000 Å thermally grown SiO₂, gold electrodes, and an avalanche p-region with boron concentration of 10¹⁸ atoms/cm³.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "Claims" },
    { kind: "paragraph", inlines: literal("What is claimed is:") },
    ...boyleSmithCcdClaimTexts.map((claim) => ({
      kind: "claim" as const,
      number: claim.number,
      inlines: literal(claim.text),
    })),
    ...boyleSmithCcdFigureSheets.map(([id, label, title]) => ({
      kind: "figure-sheet" as const,
      figureLabel: label,
      title,
      description: [figure(id, label)],
    })),
  ],
};

/**
 * Paragraph- and claim-aligned reading notes for shared-parallel integration.
 * The shared registry remains deliberately untouched in this patent-only lane.
 */
export const boyleSmithCcdParallelReadings = boyleSmithCcdArchivalEdition.blocks.map((block) => {
  if (block.kind === "claim") {
    return [
      `Claim ${block.number} keeps the legal boundary on a charge-storage structure or refinement. Its nouns and relationships are retained in the original text; the engineering reading should be presented beside this exact limitation, not as a generic later CCD-camera claim.`,
    ];
  }
  if (block.kind === "paragraph") {
    return [
      "This passage is about information storage by moving localized charge through deliberately shaped semiconductor potential minima. Read its stated geometry, source of charge, timing condition, and detector arrangement as limits of the described embodiment rather than silently substituting a later three-phase image-sensor architecture.",
    ];
  }
  return ["This is an authored structural part of the reviewed source edition."];
});
