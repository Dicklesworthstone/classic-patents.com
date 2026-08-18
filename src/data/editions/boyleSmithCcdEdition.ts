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

const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

const ccdFigureDims: Record<string, { width: number; height: number }> = {
  "1a": { width: 720, height: 369 },
  "1b": { width: 720, height: 369 },
  "1c": { width: 720, height: 369 },
  "1d": { width: 720, height: 388 },
  "2": { width: 456, height: 720 },
  "3": { width: 456, height: 720 },
  "4": { width: 720, height: 320 },
  "5": { width: 720, height: 328 },
  "6": { width: 720, height: 264 },
  "7a": { width: 430, height: 350 },
  "7b": { width: 430, height: 350 },
  "7c": { width: 720, height: 336 },
  "8": { width: 720, height: 312 },
  "9a": { width: 720, height: 279 },
  "9b": { width: 720, height: 297 },
  "10": { width: 720, height: 360 },
  "11": { width: 720, height: 304 },
  "12": { width: 720, height: 344 },
  "13": { width: 720, height: 280 },
  "14": { width: 720, height: 320 },
  "15": { width: 720, height: 248 },
  "16": { width: 720, height: 360 },
};

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
      width: ccdFigureDims[id]?.width ?? 720,
      height: ccdFigureDims[id]?.height ?? 720,
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
 * Literal, editor-authored reading of printed specification pages 1–4.
 * These nodes follow the source's paragraph divisions, not its scan columns.
 * Later printed pages are added in the following source-page batches; this
 * deliberately remains an unbound work in progress until all pages are present.
 */
const specificationPagesOneToFour = [
  { kind: "heading" as const, level: 2 as const, text: "Cross Reference to Related Application" },
  paragraph([
    {
      kind: "text",
      text: "This application is a continuation-in-part of our copending application, Ser. No. 11,541, filed Feb. 16, 1970, now abandoned, by W. S. Boyle and G. E. Smith. This invention relates to information storage devices known as ",
    },
    term(
      "charge coupled devices",
      "The source uses this name for a device that stores a charge packet in an electrically induced minimum and transfers that packet by changing the electrode biases in sequence.",
    ),
    { kind: "text", text: "." },
  ]),
  { kind: "heading" as const, level: 2 as const, text: "Background of the Invention" },
  paragraph(
    literal(
      "There is a wide variety of electrical devices in which information storage is an essential feature. Memory and logic devices often rely on magnetic mechanisms in which the information is represented by the polarity of magnetic domains stored in a sheet, hollow core or wire.",
    ),
  ),
  paragraph(
    literal(
      "In the usual form of the video camera an optical image is stored in the form of electrostatic charge on a monolithic storage layer. The localized charge density of the electrostatic pattern is then ‘read’ with a scanning electron beam.",
    ),
  ),
  paragraph(
    literal(
      "Information storage is also implicit in delay lines. These devices are typically acoustic or electromechanical with the information stored dynamically in a traveling elastic wave.",
    ),
  ),
  paragraph(
    literal(
      "Electrical storage devices commonly comprise arrays of devices connected in logic patterns in which binary information is stored and processed by sequential switching of the devices.",
    ),
  ),
  { kind: "heading" as const, level: 2 as const, text: "Statement of the Invention" },
  paragraph(
    literal(
      "The present invention involves an information storage mechanism that is unique and versatile. It offers many of the advantages of the several forms of storage devices mentioned above.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "The invention is based largely on the recognition that electric charge can be stored in a spatially defined potential minimum within a semiconductor; that the storage site within the semiconductor can be selected; and, most importantly, that the storage site can be changed within the semiconductor in at least two dimensions. Thus electric charge, representing information, can be generated, translated and retrieved.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "In a static sense, the sites used for storage according to the invention are well known. They are depletion layers that are capable of trapping and storing minority charge carriers. For the purpose of the description of this invention, these storage sites will be termed ‘",
    },
    term(
      "potential wells",
      "A potential-energy minimum in the semiconductor. The patent uses it as the selected place where a charge packet is confined before a subsequent bias sequence transfers the packet to another site.",
    ),
    {
      kind: "text",
      text: ".’ It is important to recognize that this embodiment of the charge coupled device concept relies on minority carriers exclusively to represent the information throughout the generation-transfer-detection operations.",
    },
  ]),
  paragraph(
    literal(
      "Alternately, materials are available in which the free carrier concentration is very low and minority carrier lifetime is high so that storage of minority carriers can occur in potential wells within the medium that may not be considered by traditional standards to be depletion layers. In a sense, such materials are inherently fully depleted so that when a potential is applied there is no recognizable interface between regions of relatively high and low carrier concentration. Hence the explanation of the transfer mechanism in terms of depleted regions no longer vigorously applies. It is important to recognize that in such inherently depleted materials the charge being stored as information need not necessarily be minority charge as, by definition, in these materials the distinction between majority and minority carriers is not critical.",
    ),
  ),
  paragraph(
    literal(
      "Preferred materials that have these characteristics are KTaO3, ZnO, ZnS and, CdS, and other II-VI compound semiconductors. These materials are normally classed as high resistivity semiconductors. The references in this specification to semiconductor storage media should be construed as encompassing these materials as well as other high resistivity materials that meet the foregoing criteria. A more complete discussion of the properties of storage media for charge coupled devices will be found in U.S. patent application Ser. No. 47,205, filed June 18, 1970 by D. Kahng.",
    ),
  ),
  paragraph(
    literal(
      "The storage medium must also provide sufficient carrier mobility for charge carrier transfer. This consideration is especially important for high speed operation. With reference to silicon, the storage medium that is preferred at this stage of the development of charge coupled device technology, this requirement suggests that the storage medium be p-type for electron mobility in depleted p-type material can be approximately three times the hole mobility in depleted n-type material. However, other considerations may favor the use of n-type storage media. Another embodiment, in which charge is stored in an electrically depleted homogeneous storage layer is described in U.S. application Ser. No. 131,722, filed Apr. 6, 1971 by W. S. Boyle and G. E. Smith.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "A potential well can be generated at a desired location in the semiconductor by locally biasing the semiconductor. This can be facilitated in a representative embodiment by forming an electric field pattern over the semiconductor surface. The pattern may be monolithic for certain forms of devices (to be described below) or may assume a specific geometry to perform a desired function, e.g., a logic function. In a preferred embodiment of the invention the devices comprise an ",
    },
    term(
      "MIS array",
      "A metal-insulator-semiconductor electrode structure. The source says the depletion region is formed through its field effect; it does not identify this period structure with a later pixel implementation.",
    ),
    { kind: "text", text: " and the depletion region is formed via the well-known field effect." },
  ]),
  paragraph(
    literal(
      "The potential wells can be charged initially by several methods. These will be treated in detail below along with detection or readout schemes. The translating function is achieved by moving the potential wells along the desired translation path. This has the effect of moving the charge accumulated in each well. Since mobile charge influenced by more than one potential well will accumulate in the deepest potential well, operation of some charge coupled device embodiments will focus on the deepest of more than one overlapping potential well.",
    ),
  ),
  { kind: "heading" as const, level: 2 as const, text: "Detailed Description of the Invention" },
  paragraph([
    {
      kind: "text",
      text: "The following detailed description sets forth various embodiments of the invention, all of which share the basic information storage feature described above. In the drawing: ",
    },
    figure("1a", "FIGS. 1A to 1D"),
    {
      kind: "text",
      text: " are schematic diagrams illustrating the charge translating mechanism that is a fundamental feature of the invention; ",
    },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " is a front sectional view, partly schematic, of a shift register embodying the novel information storage feature; ",
    },
    figure("3", "FIG. 3"),
    { kind: "text", text: " is a pulse program for the shift register of FIG. 2; and " },
    figure("4", "FIG. 4"),
    {
      kind: "text",
      text: " is a front sectional view partly schematic illustrating a preferred method of charge translation.",
    },
  ]),
  paragraph([
    figure("5", "FIG. 5"),
    { kind: "text", text: " is a sectional view of a buried channel charge coupled device; " },
    figure("6", "FIG. 6"),
    {
      kind: "text",
      text: " is a front sectional view, partly schematic, illustrating a preferred arrangement for introducing charge into a charge coupled device; ",
    },
    figure("7a", "FIGS. 7A, 7B and 7C"),
    {
      kind: "text",
      text: " are largely schematic representations of means for detecting the presence or absence of charge in the terminal translating stage; ",
    },
    figure("8", "FIG. 8"),
    {
      kind: "text",
      text: " is a sectional view showing, schematically, the transfer of stored charge between storage sites on opposite sides of a storage medium; ",
    },
    figure("9a", "FIGS. 9A and 9B"),
    {
      kind: "text",
      text: " are schematic representations of preferred techniques for enhancing charge translation; ",
    },
    figure("10", "FIG. 10"),
    {
      kind: "text",
      text: " is a plan view of a multichannel shift register, an extension of the device of FIG. 2; ",
    },
    figure("11", "FIG. 11"),
    {
      kind: "text",
      text: " is a plan view of a preferred conductor arrangement designed to avoid crossovers in the three-conductor storage control circuit; ",
    },
    figure("12", "FIG. 12"),
    {
      kind: "text",
      text: " is a perspective view of a portion of a charge translating device illustrating a preferred electrical contact arrangement; ",
    },
    figure("13", "FIG. 13"),
    {
      kind: "text",
      text: " is a front sectional view of a charge translating device showing an alternative electrical contact arrangement; ",
    },
    figure("14", "FIG. 14"),
    {
      kind: "text",
      text: " is a front section, largely schematic, of an image detection device employing features of the invention; ",
    },
    figure("15", "FIG. 15"),
    {
      kind: "text",
      text: " is a front sectional view of an alternative means for transferring charge that does not require wire connections to each transfer stage; and ",
    },
    figure("16", "FIG. 16"),
    {
      kind: "text",
      text: " is a front sectional view illustrating a structure alternative to that of FIG. 15.",
    },
  ]),
] as const;

/** Literal, editor-authored reading of printed specification pages 5–8. */
const specificationPagesFiveToEight = [
  paragraph(
    literal(
      "A more detailed description of charge coupled devices having these functional capabilities can be found in U.S. Application Ser. No. 114,625 filed, Feb. 11, 1971 by G. E. Smith and M. F. Tompsett.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "It should be appreciated that another important device application is implicit in the operation of the device of ",
    },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: ". That application is information or signal delay. Many forms of delay lines can make use of structures similar to that of ",
    },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: ". By sequentially biasing conductors 23′, 24′, and 22′, the charge will shift into pocket 27b. In a like manner the charge is translated into pocket 27a and then into the depletion region 28 accompanying the p-n junction 29 of the output stage. A pulse output is then detected across load 30 as shown. A bias source 31 is connected to electrode 32 to bias the junction.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "The output stage shown here utilizes a p-n junction to extract charge collected from the terminal stage 24n. A directly analogous detector which is equally effective is a ",
    },
    term(
      "Schottky barrier device",
      "A metal-semiconductor junction whose barrier can collect or sense charge. The patent names it as an alternative detector, rather than treating it as a separate storage mechanism.",
    ),
    {
      kind: "text",
      text: ". An appropriate Schottky device is described in the Bell System Technical Journal, Vol. XLIV, No. 7, Sept. 1965 at pp. 1525–1528. For purposes of definition, the aforementioned charge detecting devices can be characterized by the term ‘barrier layer.’",
    },
  ]),
  paragraph([
    { kind: "text", text: "An exemplary pulse program for the shift register of " },
    figure("2", "FIG. 2"),
    { kind: "text", text: " is shown in " },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: " (The ordinate is not to scale.). This diagram illustrates transmission of the binary code 1101. While it is not evident from this abbreviated representation, it is clear from ",
    },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " that each element 22a through 22n is simultaneously pulsed via conductor 22′, likewise for conductors 23′ and 24′. The pulses on each element are timed such that the time period between the initiation of sequential pulses, Δt, is less than three times the pulse width, tp. This ensures that the pulse on each sequential stage overlaps both the former and the subsequent stage. Otherwise one potential well may collapse before the next one is accessible to the charge.",
    },
  ]),
  paragraph([
    { kind: "text", text: "Referring back to " },
    figure("1c", "FIG. 1C"),
    {
      kind: "text",
      text: ", it will be appreciated that the charge transfer time for that portion of charge situated under electrode 12 will be equal to the fall time of the pulse in ",
    },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: ". Experimental evidence indicates that the transfer time under the conditions outlined is quite fast. However, if the pulse program of ",
    },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: " is comparably fast, it may be advantageous to use a pulse shape that gives a longer fall time. A convenient pulse form serving this function is a sine wave.",
    },
  ]),
  paragraph(
    literal(
      "A preferred modification of the charge translating mechanism of this invention makes use of a continuous uniform bias on all conductors so as to maintain at least a shallow depletion layer over the entire surface of the device. This bias should be at least equal to the threshold voltage for producing inversion under steady state conditions. In this way the troublesome surface states, which are inevitably present at semiconductor-insulator interfaces (and which cause adverse surface recombination), can be maintained relatively free of majority carriers. That is, by isolating the bulk of the majority carriers from the interface via a space-charge layer, the carriers in the surface states, having once recombined with minority carriers, cannot then be replenished. This technique, which simply requires a prebias on every metal contact, insures a long lifetime for the minority carriers constituting the signal. In a device having many stages this expedient may be essential.",
    ),
  ),
  paragraph([
    { kind: "text", text: "The modification just described is illustrated in " },
    figure("4", "FIG. 4"),
    {
      kind: "text",
      text: ". The device corresponds to a middle portion of the shift register of ",
    },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: ". The semiconductor base layer 40, which again is n-type, the insulating layer 41, and metal contacts 42a, 43a, 44a, 42b, 43b, and 44b and the associated conductors 42′, 43′, and 44′ correspond to similar elements in ",
    },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: ". The essential distinction is the presence of a continuous bias voltage V′ on all conductors to form a uniform depletion region 45 over the entire device. Potential wells 46 are formed under contacts 42a and 42b as the result of the pulse voltage Vp superimposed on the bias voltage V′. An alternative way of isolating the charge carriers from the adverse effects of surface states is to store and transfer the charge within the bulk of the storage layer and electrically isolated from the surface. One means of achieving this object is to provide a barrier layer along both major boundaries of the storage layer so that stored charge is confined to the bulk of the semiconductor. When the isolated storage layer is biased with respect to the boundary layers a potential minimum (for stored charge) exists within the bulk of the storage layer. Charge tends to be confined to the interior region of the storage layer.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "One embodiment of the buried storage layer charge coupled device concept is shown in ",
    },
    figure("5", "FIG. 5"),
    {
      kind: "text",
      text: ". In this exemplary configuration the storage layer 150, which here is shown as p-type semiconductor, and in a preferred embodiment is silicon with a normal resistivity (0.1 to 100 ohm cm), is bounded on the surface with the usual insulating layer 151 and is further isolated at its lower boundary by p-n junction 152, formed in any appropriate n-layer 153. The device shown has control electrodes 154, 155 and 156 connected to a three wire drive comprising wires 157, 158, and 159 (illustrated schematically). Bias means 160 is shown schematically and is intended to bias, via electrode 161, the storage layer with respect to n-layer 153 so that the free carriers in the storage layer are largely removed. Electrode 161 may comprise a Schottky contact or a p+ region 162 may be provided to allow ohmic contact. The device is then in condition for normal charge coupled operation except that the information carriers will now be stored and transferred in the bulk of the storage layer as indicated schematically in the Figure. Further details of buried channel charge coupled devices are contained in U.S. Pat. application, Ser. No. 131,722, filed, Apr. 6, 1971 by W. S. Boyle and G. E. Smith and Ser. No. 131,721, filed Apr. 6, 1971 by R. H. Krambeck.",
    },
  ]),
  { kind: "heading" as const, level: 2 as const, text: "Input Stage" },
  paragraph([
    { kind: "text", text: "The shift register of " },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " is described as having an avalanche device for creating charge at the input location 25. There are several alternative methods for creating minority charge carriers. For example, if the input stage comprises a p-n junction, minority charge carriers can be injected into the bulk region of the semiconductor by forward bias pulses corresponding to the desired input signal.",
    },
  ]),
  paragraph(
    literal(
      "The junction current can be modulated with information or, alternatively, the p-n junction can be biased continuously to provide an infinite source of minority carriers and the desired carriers can be gated into the charge transfer line through a channel formed adjacent an MIS gate as in the well-known field effect device. These approaches are essentially equivalent in principle since the first transfer stage can be compared to the gating device except that the information signal is applied to the junction in the first case and to the gate electrode in the second.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "A gated input stage in accordance with the description above is shown in ",
    },
    figure("6", "FIG. 6"),
    {
      kind: "text",
      text: ". The storage medium 40″ is shown with insulating layer 41″ and three transfer electrodes 42″, 43″, and 44″ as in the device of ",
    },
    figure("4", "FIG. 4"),
    {
      kind: "text",
      text: ". The input stage comprises p-n junction 45″ continuously biased via source 46″. The information signal is gated with electrode 47″ as shown. The information signal is clocked with the first transfer electrode 42″.",
    },
  ]),
  paragraph(
    literal(
      "Alternatively carriers can be injected by MIS surface avalanching as described in Journal of Applied Physics, Vol. 9, No. 12, p. 444. A hybrid structure employing a metal-oxide surface contact on a p-n junction is effective for the same purpose. Another alternative is to generate hole-electron pairs by photon absorption or absorption of other ionizing radiation. This is treated fully in U.S. Pat. No. 3,523,208, issued Aug. 4, 1970 to E. I. Gordon–F. J. Morris. The minority charge carriers will diffuse to nearby depletion region which in the case of the shift register of FIG. 2 is the first stage 27a. A means for achieving this is shown in phantom at 34 in FIG. 2, the element 34 is a light source—in this case, a schematic representation of an electroluminescent diode. This mechanism for minority carrier generation is quite useful in imaging devices based upon the principles of the invention. These will be described in more detail below.",
    ),
  ),
  { kind: "heading" as const, level: 2 as const, text: "Output Stage" },
  paragraph([
    { kind: "text", text: "The output stage can also assume a variety of forms. " },
    figure("7a", "FIGS. 7A to 7C"),
    {
      kind: "text",
      text: " illustrate a few alternative embodiments. These figures show the terminal section of the device of ",
    },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " including the last transfer stage 24n. Each of these devices are charge detection devices constructed according to known principles. In ",
    },
    figure("7a", "FIG. 7A"),
    {
      kind: "text",
      text: " the detector is an MIS device and is therefore especially convenient, from a processing standpoint, where an MIS array comprises the transfer stages. With the semiconductor depleted, the capacitance associated with detector electrode 50 will indicate the presence or absence of externally introduced charge in the depleted region 51. The capacity across the MIS detector is measured by a standard capacitive bridge as shown and the value indicated at detector 52. The bias source 53 is arranged via switch 54 to intermittently bias that portion of the semiconductor below electrode 50 first to establish the depletion region for attracting the charge to be detected and then to collapse the depleted region to recombine the charge which may have accumulated.",
    },
  ]),
  paragraph([
    { kind: "text", text: "In the detection stage of " },
    figure("7b", "FIG. 7B"),
    {
      kind: "text",
      text: " an alternating current source 55 is connected to two adjacent field plates 56 and 57, the latter again comprising MIS devices with semiconductor 20 and insulating layer 21. A bias source 58 maintains a depletion region 59 beneath both electrodes 56 and 57. If charge is present in the terminal transfer stage 24n it is transferred to the potential well accompanying plate 56 on its negative half cycle and then toward the well of electrode 57 on the latter’s negative half cycle. This transfer of charge back and forth beneath electrodes 56 and 57 changes the a.c. impedance of the circuit from its value without charge in the depletion layer. The presence or absence of charge is thus detectable across impedance 60 by potentiometer 61. The switch 62 functions to erase the charge in the manner of switch 54 of ",
    },
    figure("7a", "FIG. 7A"),
    {
      kind: "text",
      text: ". The speed of the erase function can be enhanced by providing a switching network to reverse the d.c. bias rather than merely removing the bias.",
    },
  ]),
  paragraph([
    { kind: "text", text: "The detection stage of " },
    figure("7c", "FIG. 7C"),
    {
      kind: "text",
      text: " relies on a direct voltage measurement to detect interface charge Qi accumulated between semiconductor 20 and insulator 21. The electrode 63 is biased negatively via source 64 connected in series with a blocking capacitance which is shown in the figure as a capacitor, 65, but may alternatively be a diode. A change in the charge level Qi is reflected by a change in the equivalent capacitance of the MIS device. This affects the capacitive division between that element and the capacitor 65 resulting in a change in VD. The voltage VD can be measured in various ways, e.g., at the gate of a field-effect transistor. Shown in ",
    },
    figure("7c", "FIG. 7C"),
    {
      kind: "text",
      text: " is a field-effect device integrated with the semiconductor base 20 of the storage device. A p-region 20A is shown representing isolation according to known integrated circuit techniques. The voltage VD being measured is connected to the gate electrode 66. The insulating layer for the gate is shown as an extension of insulating layer 21. Source and drain regions 67 and 68 are diffused through windows formed in this layer. Source and drain electrodes 69 and 70 are connected through load 71 to bias source 72. Detector 73 indicates the conduction state of the FET which reveals the presence or absence of charge Qi in the following manner.",
    },
  ]),
  paragraph(
    literal(
      "A positive pulse delivered by power source 64 recombines any residual charge Qi and primes the device for detection. A negative pulse places negative charge on plate 63 and depletes the region under that electrode for collecting holes delivered (or not delivered) from terminal stage 24n. The gate 66 is biased at the same potential leaving the FET in an ‘ON’ condition indicated at 73. If charge Qi enters the region below plate 63, the negative potential on the plate will be reduced. The corresponding reduction in potential at the gate electrode 66 will place the FET in an ‘OFF’ condition. If there is no charge Qi the FET remains ‘ON.’",
    ),
  ),
  paragraph([
    { kind: "text", text: "The device of " },
    figure("7c", "FIG. 7C"),
    {
      kind: "text",
      text: " is shown partly integrated. The FET device can be used separately or the device can be further integrated, e.g., the elements 65, 71 and the electrical connections can be integrated.",
    },
  ]),
  paragraph(
    literal(
      "The device geometries described so far have all their active elements disposed on one surface of the storage medium and all charge translation occurs in one dimension. Charge translation in two dimensions is straightforward. For example, the charge coupled line of FIG. 2 can be serpentined in two dimensions or can assume other x-y configurations specifically designed for various logic functions. This concept can be extended along the lines suggested by the magnetic domain wall or ‘bubble’ information storage technology.",
    ),
  ),
  paragraph(
    literal(
      "The design of charge coupled devices can be extended yet further into a three-dimension regime to give a new dimension of design freedom that heretofore has not been utilized commercially in devices of this kind. With the appropriate application of electric fields, charge can be made to transfer selectively through the thickness of the storage medium. The storage medium is still envisioned as a relatively thin wafer in which the influence of electric fields applied at the surface can extend far enough along the thickness dimension that uncontrolled lateral movement of the charge is avoided.",
    ),
  ),
] as const;

/** Literal, editor-authored reading of printed specification pages 9–10. */
const specificationPagesNineToTen = [
  paragraph(
    literal(
      "It can be inferred from the two-dimensional discussion above that stepping of the charge at any reasonable angle, usually 90°, in the plane of the storage medium is straightforward. Likewise the movement of charge in any of three orthogonal dimensions can be achieved in the same manner. It is necessary in each case only that the potential wells from the transferring and receiving sites overlap, or so nearly overlap that carriers will diffuse to the receiving site and be captured in adequate amounts to achieve the objective desired. In some cases the latter requirement is quite lenient. For example, we know that in the case of minority carrier generation due to photon absorption near one surface of a silicon wafer 25 mils in thickness, the carriers can be captured in adequate numbers by space charge regions attending biasing means applied to the opposite side of the wafer.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "Transfer of charge through the thickness dimension of the storage medium is illustrated in ",
    },
    figure("8", "FIG. 8"),
    { kind: "text", text: ". The device shown has a basic structure similar to that of " },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " except that transfer electrodes 184 are formed on both sides of the storage medium 180. Transfer of charge through the slice will be described as occurring sequentially between the storage sites associated with electrodes 185, 186, and 187. Electrode 186 is initially biased negatively (assuming an n-type storage medium), in sequence to the normal three-phase transfer bias on electrode 185, to transfer charge to its storage region. After a half-cycle of negative bias the voltage is made more positive, or sufficient to inject the stored carriers into the bulk of medium 180. The transfer bias is shown by the schematic waveform designated Vt. The positive portion of the cycle may be greater or smaller as desired and the duration may require adjustment to fit individual applications. Electrode 187 is biased with the normal transfer bias, −Vt, in sequence. Charge will be trapped temporarily in the depletion region adjacent electrode 187 until transferred in the normal sequence to the storage site adjacent electrode 188.",
    },
  ]),
  { kind: "heading" as const, level: 2 as const, text: "Charge Translation Enhancement" },
  paragraph([
    { kind: "text", text: "The charge translating mechanism described in connection with " },
    figure("1a", "FIG. 1"),
    {
      kind: "text",
      text: " relies in part on thermal diffusion to transport carriers from potential well 14 to potential well 14′. While this transport mechanism is adequate, the response time of devices using this mechanism can be significantly reduced by using an electric field to drive the charge to the new location. In many cases the use of the drive field will improve the collection efficiency also. One means of achieving this is to shape the potential well so that a field gradient exists between adjacent wells. This scheme, which for the purpose of this description will be termed ‘",
    },
    term(
      "field enhancement",
      "The source's name for shaping the well or pulse timing so that an electric-field gradient drives charge toward the receiving site, rather than relying only on thermal diffusion.",
    ),
    { kind: "text", text: ",’ is shown in two illustrative embodiments in " },
    figure("9a", "FIGS. 9A and 9B"),
    { kind: "text", text: "." },
  ]),
  paragraph([
    {
      kind: "text",
      text: "FIG. 9A shows two conductors 72 and 73 situated on insulating layer 74 which in turn covers semiconductor substrate 75. With the conductors 72 and 73 biased, their respective depletion layers appear to have shapes indicated by dashed lines 76 and 77. These lines, which represent the boundaries of the depleted region of the semiconductor also are a function of the field potential at the semiconductor-insulator interface. Thus it is convenient in this discussion to consider these boundary lines as potential profiles along the surface of the semiconductor where the charge is stored. As a consequence of making the size of the electrode comparable to, or less than, the thickness of the insulator, the field approaches the situation where it appears to emanate as if from a point rather than a plate (as in ",
    },
    figure("1a", "FIG. 1"),
    {
      kind: "text",
      text: ") and produces a continuous field gradient along the surface. This field gradient is aptly described as a potential well and tends to confine the charge at its center. When these wells are made to overlap (a condition implicit from the previous discussion, e.g., the pulse program of ",
    },
    figure("3", "FIG. 3"),
    {
      kind: "text",
      text: ") the composite field profile is described by the dotted line 78 of FIG. 9A. Now it is intuitively obvious that the charges will transport from the region directly under electrode 72 toward electrode 73. After the depletion field represented by line 76 collapses, the charges will be swept to the surface region of highest potential in the well represented by line 77, or directly under electrode 73.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "Referring back to the buried channel device described in connection with ",
    },
    figure("5", "FIG. 5"),
    {
      kind: "text",
      text: " it will be evident that one consequence of storing the charge in the interior of the storage layer is that charge is further removed from the field plates than it is in the surface storage mode. From the point of view of the field potential lines this is roughly equivalent to making the insulating layer thick with respect to the size of the field plates and reduces the electrode spacing requirements that occur with devices operating in the surface storage mode.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "Field enhancement can be made more effective by using a shaped pulse as described by ",
    },
    figure("9b", "FIG. 9B"),
    {
      kind: "text",
      text: ". For example, if a saw-tooth pulse is applied to electrodes 72 and 73, then at a time t1 during the period of pulse overlap (the charge translating period), electrode 72 will be biased at a lower voltage than electrode 73. This is indicated schematically by the arrows adjacent the respective pulse forms. The separate field profiles at t1 are described by dashed lines 79 and 80 with the composite profile appearing as dotted line 89. The field gradient in the direction of desired charge translation extends instantaneously all the way to the region immediately below electrode 73.",
    },
  ]),
  paragraph(
    literal(
      "The schemes just described are but two of many possibilities for producing a field gradient or drive field for the charge (or absence of charge) accumulated at the initial storage location. All those arrangements which produce field enhancement of charge translation are intended to be within the scope of this embodiment of the invention.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "A closely related consideration and one which is more basic to the operation of charge coupled devices is the mechanism whereby the directionality of charge transfer is obtained. Two symmetrical drive electrodes with alternate equivalent voltages applied will cause the charge to go back and forth under the two electrodes, as occurs in the detector of ",
    },
    figure("7b", "FIG. 7B"),
    { kind: "text", text: ". When the third drive phase is added, as in " },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: ", the drive field becomes asymmetrical (as long as the three phases are biased in a 1-2-3-1 rather than a 1-2-3-2-sequence). The asymmetry is a necessary condition for controlled directional transfer.",
    },
  ]),
  paragraph(
    literal(
      "There are various ways of obtaining asymmetry in the drive field. For example, the field profile under a given field plate can be made asymmetrical by using a dual thickness insulating layer, the thinner portion being disposed on the forward side with respect to the direction of charge transfer. This is explained in detail in U.S. Pat. application Ser. No. 11,448, filed Feb. 16, 1970 by D. Kahng and E. H. Nicollian.",
    ),
  ),
] as const;

/** Literal, editor-authored reading begun for printed specification page 11. */
const specificationPageEleven = [
  paragraph(
    literal(
      "It will be apparent that by using this expedient the number of essential drive phases reduces from three to two. Whenever the asymmetry is incorporated into the semiconductor or the insulator, the electrode pattern and bias sequence can be symmetrical. This usually implies two phase clocking for charge transfer. This is important because it eliminates the necessity for the crossovers that are necessary in the three phase drive devices. It is possible to provide asymmetry in the drive electrodes themselves by using electrode materials with different work functions or by shaping the electrodes.",
    ),
  ),
  paragraph(
    literal(
      "Asymmetry in the drive field can also be supplied by appropriate potentials applied to the drive electrodes in a manner resembling the field enhanced transfer described above.",
    ),
  ),
  paragraph(
    literal(
      "An alternative structure known in the art for obtaining an asymmetric potential to impart directionality to the charge transfer is described and claimed in U.S. application, Ser. No. 85,026, filed Oct. 29, 1970, by G. E. Smith and R. J. Strain. This structure can be driven with either two or four phases and comprises a sequence including a first level of electrodes insulated from and partially overlapping the first level electrodes.",
    ),
  ),
  paragraph(
    literal(
      "An alternative technique for creating an asymmetrical drive field is to vary the doping density along the surface region of the storage medium. With a bias applied, the surface potential will vary with variations in the doping density. The charge carriers being stored and transferred will ordinarily seek a state of lowest potential energy, i.e., where the surface potential of opposite charge is greatest. Thus even though the potential on a given field plate is ordinarily spatially uniform the surface potential below that field plate can be made nonuniform so as to allow the flow of charge carriers only in one lateral direction. This concept, and several structures based upon it, are described and claimed in U.S. Pat. application Ser. No. 157,509, filed June 28, 1971 by R. H. Krambeck, et al. Similar results from the viewpoint of obtaining asymmetry in the drive field can be obtained if the charge placed along the transfer path is graded. However the additional advantage of field enhancement results from graded charge if the gradation extends along a significant portion of the storage site. Device embodiments based upon this concept are described and claimed in U.S. Pat. application Ser. No. 157,507, filed June 28, 1971 by G. F. Amelio–R. H. Krambeck–K. A. Pickar. Similar effects can be produced by introducing charge into the insulating layer overlying the storage sites.",
    ),
  ),
  paragraph(
    literal(
      "Fixed charge can also be used to advantage to obtain increased transfer efficiency and to reduce the number of active transfer electrodes. The former expedient recognizes the advantage in having a uniform or increasing surface potential across the interelectrode gaps. This eliminates the potential barrier that exists normally due to the finite interelectrode spacing. If the surface potential is tailored to provide this result then the size of the interelectrode gaps is no longer critical. The appropriate charge concentration to achieve these results is described in U.S. Pat. application Ser. No. 157,508, filed June 28, 1971 by G. F. Amelio and R. H. Krambeck.",
    ),
  ),
  paragraph(
    literal(
      "The use of localized fixed charge to replace an active drive electrode is described and claimed in U.S. Pat. application Ser. No. 157,510, filed June 28, 1971 by R. H. Krambeck and C. H. Sequin. This device modification recognizes that a region of localized charge in the storage medium will have the same influence on carriers within the storage medium as a conventional drive electrode with a fixed bias. If a storage site adjacent to the fixed charge region has a lower surface potential then the site with the fixed charge region will attract carriers. To effect charge transfer the surface potential at the sites adjacent to the fixed charge site can be adjusted alternately between values above and below the surface potential at the fixed charge site. An advantage of this structure is that charge transfer can be made reversible. Related embodiments are described and claimed in U.S. Pat. application Ser. No. 157,507, filed June 28, 1971 by G. F. Amelio, R. H. Krambeck and K. A. Pickar. In one of these the substitution of fixed charge for an active drive electrode in a two-phase device yields a device in which only one varying potential is necessary to effect charge transfer.",
    ),
  ),
  paragraph(
    literal(
      "Fixed charge can also be used to vary the storage potential at selected sites in accordance with a digital or analog code. Charge is then allowed to accumulate at each site to the predetermined capacity. Shifting out this charge yields a coded signal. Read-only memories in which the charge storage capacity of the storage sites are selectively adjusted either permanently or semipermanently are described and claimed in U.S. Pat. application Ser. No. 49,462, filed June 24, 1970 by G. E. Smith now U.S. Pat. No. 3,654,499, issued Apr. 4, 1972. Several other mechanisms for adjusting the charge storage capacity are given.",
    ),
  ),
  paragraph(
    literal(
      "A device constructed without external connections and according to this driven with an electric field applied externally of the device is described in U.S. application Ser. No. 128,999, filed Mar. 29, 1971 by G. E. Smith. A charge coupled device with a two-phase drive arrangement is placed between a large parallel plate capacitor. With only every other drive electrode biased, the depletion region under the remaining electrodes can be controlled by capacitive coupling to the external capacitor.",
    ),
  ),
  paragraph([
    { kind: "text", text: "The one dimension shift register shown in " },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " can advantageously be incorporated in a multichannel register as shown in ",
    },
    figure("10", "FIG. 10"),
    { kind: "text", text: ". It is evident that the linear array of " },
    figure("2", "FIG. 2"),
    {
      kind: "text",
      text: " requires at least n crossovers (the figure shows 3n-3 crossovers but a straightforward modification reduces this number to n). Crossovers are used more economically in the arrangement of ",
    },
    figure("10", "FIG. 10"),
    {
      kind: "text",
      text: " wherein the same number of crossovers may provide a large number of channels. FIG. 10 shows four channels but this number can be extended without adding additional crossover connections. The conductor arrangement of conductors 81′, 82′, and 83′ is the same as that in FIG. 2 with conductor 81′ connected to contacts 81a through 81n in sheet 86 and likewise with conductors 82′, 83′ and electrodes 82a to 82n and 83a to 83n. Input stages 84 and output stages 85 have been discussed previously.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "Another embodiment which is advantageous from the point of view of minimizing crossovers is illustrated by the electrode configuration of ",
    },
    figure("11", "FIG. 11"),
    {
      kind: "text",
      text: ". Shown there is a portion of a device which may, for example, be a plan view of a device similar to that of ",
    },
    figure("4", "FIG. 4"),
    {
      kind: "text",
      text: " and in which the conductors are so arranged as to avoid the necessity of crossover connections. Using numbers preceded by ‘1’ to indicate elements corresponding with those of FIG. 4, the three conductors 142′, 143′ and 144′ are deposited directly upon a raised portion of the insulating layer 140 and interconnect electrodes 142a, 142b, 143a, 143b, and 144a, 144b, respectively. The path followed by the charge as it is stepped through this section is indicated by the dashed line 145. In this connection it should be appreciated that the charge is being translated under conductor wires and thus forms a convenient ‘crossunder’ arrangement.",
    },
  ]),
  paragraph(
    literal(
      "Other arrangements similar in concept to that of FIG. 11 will occur to those skilled in the art. These can be described broadly as electrode configurations having a plurality of electrodes in which every third electrode is connected to one of three conductors and is adjacent to two electrodes, each of which is connected to a separate conductor of the remaining two, with all of the conductors and electrodes deposited on a single substrate surface. The disposition of the conductors along the surface of the device can be an important consideration. In a large array it is impractical to bond each lead to its associated electrode. Consequently the charge transfer circuit would ordinarily be printed directly on the insulator covering the substrate. However, the effectiveness of the invention often relies on careful control of the field profile at the semiconductor-insulator interface. If the conductors are in direct contact with the insulator, the field from each lead will perturb the desired field profile. To overcome this a dual thickness oxide can be formed over the semiconductor.",
    ),
  ),
  paragraph([
    { kind: "text", text: "Such an arrangement is shown in perspective in " },
    figure("12", "FIG. 12"),
    {
      kind: "text",
      text: ". The semiconductor substrate 110 is first coated with a thin insulating layer 111. Next a thick layer of another insulating material is formed on layer 111 and etched to form a grid 112 with openings for the metal field plates 113. The field plates can be deposited along with interconnections 114 using a single photolithographic step. Some overlap is shown in the figure to insure complete covering of the site. The conductor paths 114 to the electrodes 113 are isolated from the substrate by the thick insulator 112. The dual thickness insulating layer is conveniently made by selecting two different insulating materials, such as SiO2 and Si3N4 that have different etching characteristics. Thus when the second layer is etched to form windows for the electrodes an etch can be selected which does not attack the first insulating layer. An alternate procedure known in the art for forming a dual thickness layer is to deposit a continuous first layer, etch the windows, and deposit another uniform layer.",
    },
  ]),
  paragraph([
    { kind: "text", text: "An especially convenient fabricating technique is illustrated in " },
    figure("13", "FIG. 13"),
    {
      kind: "text",
      text: ". This is a front sectional view of a portion of a planar processed device. The semiconductor substrate 120 is again covered with a suitable thin insulating layer 121. A continuous metal layer is deposited on layer 121 and etched to form discrete metal electrodes 122–124. A continuous insulating layer 125 is then deposited over the electrodes 122–124. Windows 127 are etched in layer 125 to the underlying metal. A ribbon or beam lead conductor 128 is then deposited so as to contact electrodes 122–124. The procedure has a distinct advantage in that it is devoid of any critical photoresist alignment steps.",
    },
  ]),
  paragraph([
    {
      kind: "text",
      text: "The capability of producing minority charge carriers in the semiconductor by photon absorption, as mentioned previously, and as treated fully in U.S. Pat. No. 3,403,284, issued Sept. 24, 1968 to Buck, et al., introduces another category of devices which make use of the information storage and charge translation mechanism of this invention. One form of this device is a video camera, an embodiment of which is illustrated schematically in ",
    },
    figure("14", "FIG. 14"),
    {
      kind: "text",
      text: ". The essential characteristic of this class of device is parallel read-in of information. Light in the form of the optical image being recorded is incident on the side of the semiconductor 130 opposite to the storage control elements. The latter again comprise metal-insulator-semiconductor devices as in FIG. 2. It bears repeating that these elements can be constructed according to any suitable embodiment described herein and may comprise other types of depletion layer devices such as transistor-type structures. The array shown contains three bit locations comprising three electrodes designated 132a to 134a, 132b to 134b, and 132c to 134c connected to conductors 132′, 133′, and 134′ in a manner similar to the arrangement of FIG. 2. Except for the parallel read-in feature, the charge translation and readout operation can follow the teachings described above.",
    },
  ]),
  paragraph(
    literal(
      "The linear array shown in FIG. 11 may represent one raster line in a video system. The charge is stored at locations 132a–132c during the optical integration period. It is read out serially by translating the charge to the readout section (refer to FIG. 2). By sequentially reading each raster line, the video frame is constructed. One problem associated with sensing optical images with a charge coupled line or x-y array is that the charge transfer time during readout is finite, meaning that the sensing elements continue to integrate during the readout operation. Intuitively it is evident that smearing of the image will occur unless the image sensing, or integration, function is separated somehow from the readout operation. One obvious means for achieving this is to use an optical shutter. Another is to illuminate the subject being viewed only during the integration period so that readout occurs in the dark. Another way of effecting readout occurs in the dark is to transfer the integrated information to a parallel storage line or array which is maintained in the dark and to effect readout while the sensing line or array integrates the next frame. Since the transfer time for the parallel shift operation is a small fraction of the readout time (the reciprocal of the number of line elements) smearing can effectively be eliminated. Devices based upon this recognition are described fully in U.S. Pat. application Ser. No. 124,735, filed Mar. 16, 1971 by M. F. Tompsett.",
    ),
  ),
] as const;

const specificationPagesFourteenToSixteen = [
  paragraph(
    literal(
      "Yet another solution to the smearing problem takes advantage of the three dimensional charge transfer concept described earlier. The image is sensed with a line or array situated on one side of the device, then the recorded information is shifted to the opposite side of the device where it can be read out in the dark. This device is more fully described in U.S. Pat. application, Ser. No. 211,514, filed Dec. 23, 1971, by G. E. Smith and F. Vratny.",
    ),
  ),
  paragraph([
    {
      kind: "text",
      text: "It is evident at this point that the essential objective of the charge translation scheme is to create a traveling potential well along the surface of the semiconductor. The use of electrical connections for this purpose has been described above. However other means of producing a traveling potential will offer distinct advantages. For example, the field accompanying an acoustic wave traveling in a piezoelectric medium is an attractive alternative. An embodiment based upon this principle is shown in ",
    },
    figure("15", "FIG. 15"),
    {
      kind: "text",
      text: ". This figure shows a portion of the shift register of FIG. 2 with semiconductor 159, insulator 160, and a series of metal contacts 161 corresponding essentially to similar elements in FIG. 2. A piezoelectric layer 162 is deposited over the metal contacts. This layer may be composed of a suitable piezoelectric material such as zinc oxide or cadmium sulfide, and may be evaporated or sputtered onto the device. A piezoelectric transducer (not shown) or other suitable means creates an ultrasonic wave which propagates through the layer 162 parallel to the surface of the device. The electric field accompanying the elastic deformation in the piezoelectric layer sequentially biases the electrodes 161 and creates potential wells 163 that travel along the surface of semiconductor 159. This is the same result that is achieved stepwise in FIG. 2.",
    },
  ]),
  paragraph([
    { kind: "text", text: "By extending the traveling field approach of " },
    figure("15", "FIG. 15"),
    { kind: "text", text: " the discrete electrodes can be eliminated. For example, " },
    figure("16", "FIG. 16"),
    {
      kind: "text",
      text: " shows a device very simple in structure. The semiconductor 170 is coated directly with a piezoelectric layer 171. In this device the field that propagates in association with the elastic wave in medium 171 (initiated by appropriate ultrasonic generator not shown) is used to form traveling potential wells 172. A metal electrode 173 may be used to create a uniform depletion layer over the entire charge translating surface for the purpose described in connection with FIG. 4.",
    },
  ]),
  paragraph(
    literal(
      "While the several embodiments described above are set forth in terms of structure, a brief discussion of material considerations is warranted. A very distinct advantage of the novel device concept herein disclosed is that materials suitable for each of the devices described are available and well understood. For example, these devices can be fabricated of silicon and silicon dioxide according to well-established technology. Combinations of insulators such as SiO2–Si3N4, SiO2–Al2O3, etc. are especially useful in certain circumstances as the insulating layer. Known electrode materials are gold, aluminum and doped-silicon. A useful structure for the device of FIG. 2 could employ 10 ohm/cm n-type silicon as the base layer 20 and 1,000 Angstroms to 2,000 Angstroms of thermally grown SiO2 as the layer 21. The oxide which has given the best results so far is a dry oxide 1,200 Angstroms thick grown in oxygen at 1,100° C. for 1 hour and annealed in a nitrogen atmosphere for 1 hour at 400° C. The flatband potential for this oxide is typically −5 V. and the surface state density is of the order of 10¹⁰ states/cm². Electrodes 22–24 may be gold in any typical thickness, e.g., 0.1 to a few microns. An appropriate charge generator is a p-region, having a boron concentration of 10¹⁸ atoms/cm³, driven at avalanche, i.e., a few volts. The detector may be a similar p-n junction. The creation and detection of minority carriers in semiconductors can be accomplished by well-known techniques.",
    ),
  ),
  paragraph(
    literal(
      "The dimensions of the transfer array can vary widely. The spacing between electrodes depends upon the extent of the space charge region permitted. For example if the semiconductor is 10 ohm/cm silicon and a voltage of 10 volts is used, the depletion region will extend approximately 5μ. This would suggest an electrode spacing of the order of a few microns for the necessary overlap. The creation and detection of minority charge carriers in silicon are easily accomplished using known techniques. It should be understood, however, that the devices described herein are in no way limited to silicon and its associated technology although that is relied on by way of example.",
    ),
  ),
  paragraph(
    literal(
      "In assessing the contribution made to the art by the foregoing device descriptions it may be useful to point out that devices made in accordance with the novel principles set forth will normally include a multiplicity of discrete storage sites. Recognizing that each storage site has three electrodes in a device with three phase drive, or two electrodes in a device with two phase drive, and that a useful device would presumably have at least two bits, then the minimum number of electrodes that would be disposed between the input stage and the detection stage would be four. As a practical matter this number would be significantly greater, for example 288 in a 96 bit device actually developed. However, these considerations are useful in pointing out the qualitative difference between this device configuration and gated MIS devices previously known. Even in efficiently integrated MIS arrays the signal is conventionally injected and removed from the semiconductor at each control element. The storage and transfer of electrical information carriers wholly within the storage medium according to the invention is a basically new approach to information handling.",
    ),
  ),
  paragraph(
    literal(
      "Another approach to this form of information handling is described in U.S. Pat. No. 3,621,283, issued Nov. 16, 1971. The device described in connection with that approach gates free charge between adjacent diffused regions in a semiconductor. The gate overlies one of the diffused regions more than the other in order to impart directionality to the charge transfer. As a consequence, the semiconductor area below each gate electrode includes regions of both conductivity types.",
    ),
  ),
  paragraph(
    literal(
      "By contrast, the charge coupled devices described here are characterized in that the semiconductor areas below the transfer electrodes are of a single conductivity type.",
    ),
  ),
  paragraph(
    literal(
      "Various additional modifications and deviations will occur to those skilled in the art. All such variations which basically rely on the teachings through which the disclosure has advanced the art are properly considered within the scope of this invention.",
    ),
  ),
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
    ...specificationPagesOneToFour,
    ...specificationPagesFiveToEight,
    ...specificationPagesNineToTen,
    ...specificationPageEleven,
    ...specificationPagesFourteenToSixteen,
    { kind: "heading", level: 2, text: "Claims" },
    { kind: "paragraph", inlines: literal("What is claimed is:") },
    { kind: "claim", number: 1, inlines: literal(boyleSmithCcdClaimTexts[0].text) },
    { kind: "claim", number: 2, inlines: literal(boyleSmithCcdClaimTexts[1].text) },
    { kind: "claim", number: 3, inlines: literal(boyleSmithCcdClaimTexts[2].text) },
    { kind: "claim", number: 4, inlines: literal(boyleSmithCcdClaimTexts[3].text) },
    { kind: "claim", number: 5, inlines: literal(boyleSmithCcdClaimTexts[4].text) },
    { kind: "claim", number: 6, inlines: literal(boyleSmithCcdClaimTexts[5].text) },
    { kind: "claim", number: 7, inlines: literal(boyleSmithCcdClaimTexts[6].text) },
    { kind: "claim", number: 8, inlines: literal(boyleSmithCcdClaimTexts[7].text) },
    { kind: "claim", number: 9, inlines: literal(boyleSmithCcdClaimTexts[8].text) },
    { kind: "claim", number: 10, inlines: literal(boyleSmithCcdClaimTexts[9].text) },
    { kind: "claim", number: 11, inlines: literal(boyleSmithCcdClaimTexts[10].text) },
    { kind: "claim", number: 12, inlines: literal(boyleSmithCcdClaimTexts[11].text) },
    { kind: "claim", number: 13, inlines: literal(boyleSmithCcdClaimTexts[12].text) },
    { kind: "claim", number: 14, inlines: literal(boyleSmithCcdClaimTexts[13].text) },
    { kind: "claim", number: 15, inlines: literal(boyleSmithCcdClaimTexts[14].text) },
    { kind: "claim", number: 16, inlines: literal(boyleSmithCcdClaimTexts[15].text) },
    { kind: "claim", number: 17, inlines: literal(boyleSmithCcdClaimTexts[16].text) },
    { kind: "claim", number: 18, inlines: literal(boyleSmithCcdClaimTexts[17].text) },
    { kind: "claim", number: 19, inlines: literal(boyleSmithCcdClaimTexts[18].text) },
    { kind: "claim", number: 20, inlines: literal(boyleSmithCcdClaimTexts[19].text) },
    { kind: "claim", number: 21, inlines: literal(boyleSmithCcdClaimTexts[20].text) },
    { kind: "claim", number: 22, inlines: literal(boyleSmithCcdClaimTexts[21].text) },
    { kind: "claim", number: 23, inlines: literal(boyleSmithCcdClaimTexts[22].text) },
    { kind: "claim", number: 24, inlines: literal(boyleSmithCcdClaimTexts[23].text) },
    { kind: "claim", number: 25, inlines: literal(boyleSmithCcdClaimTexts[24].text) },
    { kind: "claim", number: 26, inlines: literal(boyleSmithCcdClaimTexts[25].text) },
    { kind: "claim", number: 27, inlines: literal(boyleSmithCcdClaimTexts[26].text) },
    { kind: "claim", number: 28, inlines: literal(boyleSmithCcdClaimTexts[27].text) },
    { kind: "claim", number: 29, inlines: literal(boyleSmithCcdClaimTexts[28].text) },
    { kind: "claim", number: 30, inlines: literal(boyleSmithCcdClaimTexts[29].text) },
    { kind: "claim", number: 31, inlines: literal(boyleSmithCcdClaimTexts[30].text) },
    { kind: "claim", number: 32, inlines: literal(boyleSmithCcdClaimTexts[31].text) },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1A",
      title: "Charge generation and the first potential well",
      description: [figure("1a", "FIG. 1A")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1B",
      title: "Minority-carrier generation and storage",
      description: [figure("1b", "FIG. 1B")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1C",
      title: "Overlapped depletion regions",
      description: [figure("1c", "FIG. 1C")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1D",
      title: "Charge shifted into the next potential well",
      description: [figure("1d", "FIG. 1D")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 2",
      title: "Shift-register embodiment with input, output, and regeneration",
      description: [figure("2", "FIG. 2")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 3",
      title: "Pulse program for the shift register",
      description: [figure("3", "FIG. 3")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 4",
      title: "Preferred charge-translation arrangement",
      description: [figure("4", "FIG. 4")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 5",
      title: "Buried-channel charge-coupled device",
      description: [figure("5", "FIG. 5")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 6",
      title: "Gated input arrangement",
      description: [figure("6", "FIG. 6")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 7A",
      title: "Capacitive-bridge output detector",
      description: [figure("7a", "FIG. 7A")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 7B",
      title: "Alternating-current output detector",
      description: [figure("7b", "FIG. 7B")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 7C",
      title: "Integrated field-effect-transistor detector",
      description: [figure("7c", "FIG. 7C")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 8",
      title: "Charge transfer through the storage-medium thickness",
      description: [figure("8", "FIG. 8")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 9A",
      title: "Field-enhanced transfer with adjacent electrodes",
      description: [figure("9a", "FIG. 9A")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 9B",
      title: "Shaped-pulse field enhancement",
      description: [figure("9b", "FIG. 9B")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 10",
      title: "Multichannel shift register",
      description: [figure("10", "FIG. 10")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 11",
      title: "Conductor arrangement avoiding crossovers",
      description: [figure("11", "FIG. 11")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 12",
      title: "Perspective of a preferred electrical-contact arrangement",
      description: [figure("12", "FIG. 12")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 13",
      title: "Alternative electrical-contact arrangement",
      description: [figure("13", "FIG. 13")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 14",
      title: "Parallel read-in image-detection device",
      description: [figure("14", "FIG. 14")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 15",
      title: "Acoustic-wave charge translation",
      description: [figure("15", "FIG. 15")],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 16",
      title: "Electrodeless acoustic-wave alternative",
      description: [figure("16", "FIG. 16")],
    },
  ],
};

export const boyleSmithCcdParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The application establishes its priority timeline as a continuation-in-part of abandoned application Ser. No. 11,541 filed February 16, 1970, formally defining the device category as charge coupled devices.",
  ],
  4: [
    "The inventors summarize prior magnetic storage systems, noting that magnetic memories and logic circuits represent binary states via magnetic domain polarities in ferrite sheets, cores, or plated wires.",
  ],
  5: [
    "Conventional television camera tubes store visual images as electrostatic charge patterns across a target plate, which must be scanned and discharged sequentially using a focused vacuum electron beam.",
  ],
  6: [
    "Delay lines achieve dynamic data storage by encoding information into acoustic or electromechanical traveling waves propagating through an elastic medium.",
  ],
  7: [
    "Standard digital electronic storage employs discrete semiconductor logic elements interconnected in arrays where binary data is stored and manipulated through repetitive active device switching.",
  ],
  9: [
    "The inventors state that their charge-coupling mechanism provides a versatile information storage system combining high density, simplified fabrication, and dynamic shifting without internal active switches.",
  ],
  10: [
    "The fundamental concept is that electric charge packets representing information can be confined in spatially defined potential energy minima in a semiconductor and translated across the substrate in multiple dimensions.",
  ],
  11: [
    "In standard operation, the potential wells are localized depletion regions induced beneath surface electrodes that trap minority carriers representing signal packets throughout generation, transfer, and detection.",
  ],
  12: [
    "In high-resistivity or inherently depleted semiconductor materials with low carrier concentrations, potential wells confine charges without requiring conventional depletion layer boundaries.",
  ],
  13: [
    "Alternative suitable high-resistivity storage media include potassium tantalate (KTaO3), zinc oxide (ZnO), zinc sulfide (ZnS), cadmium sulfide (CdS), and other II-VI compound semiconductors.",
  ],
  14: [
    "High carrier mobility is required for rapid charge transfer. In silicon, p-type substrates are often preferred because electron mobility in depleted p-type silicon exceeds hole mobility in n-type silicon.",
  ],
  15: [
    "A potential well is formed by locally biasing an electrode to create an electric field across the semiconductor surface, using a metal-insulator-semiconductor (MIS) structure operating in deep depletion.",
  ],
  16: [
    "Initial charge packets can be generated electrically or optically. Information is translated across the chip by shifting the deepest potential well sequentially along the desired transfer path.",
  ],
  18: [
    "The detailed description introduces Figures 1A through 4, outlining the fundamental charge transfer step, the shift register architecture, the clock waveforms, and uniform depletion biasing.",
  ],
  19: [
    "The description further introduces Figures 5 through 16, covering buried channels, input/output structures, three-dimensional bulk transfer, field enhancement, multichannel arrays, optical imaging, and acoustic drive.",
  ],
  20: [
    "The basic transfer mechanism creates a localized potential well beneath an initial electrode, accumulates minority carriers, and then establishes a deeper adjacent well to induce lateral charge transit.",
  ],
  21: [
    "Figure 2 illustrates a three-phase shift register constructed on a single-conductivity substrate covered with an oxide insulator and three interleaved sets of metal transfer electrodes.",
  ],
  22: [
    "The output stage utilizes a reverse-biased p-n junction to collect transferred minority carrier packets, which flow through an external load resistor and can be regenerated into subsequent stages.",
  ],
  23: [
    "The three-phase clock program in Figure 3 applies overlapping voltage pulses (phi-1, phi-2, phi-3) to ensure a forward potential well is fully established before the trailing well collapses.",
  ],
  24: [
    "Charge transfer speed is governed by carrier diffusion and drift across the overlapping depletion regions, requiring minimal spacing between adjacent transfer electrodes.",
  ],
  25: [
    "A preferred operating mode applies a uniform background depletion bias across all electrodes, superimposing localized clock pulses to form deep moving potential wells for charge packet transport.",
  ],
  26: [
    "Figure 4 demonstrates this uniform depletion mode, where background voltage V0 maintains a continuous surface depletion layer while transfer pulse V1 drives localized charge packet migration.",
  ],
  27: [
    "Figure 5 illustrates a buried-channel CCD where charge is stored and transferred within an electrically depleted bulk layer, avoiding surface traps at the semiconductor-insulator interface.",
  ],
  29: [
    "Input charge packets can be introduced by avalanche injection from a localized p-n junction diode driven into temporary breakdown near the first transfer electrode.",
  ],
  30: [
    "The injected input current can be analog-modulated by the input signal voltage or digital-pulsed to represent binary ones and zeros as discrete charge packets.",
  ],
  31: [
    "Figure 6 shows a gated input arrangement comprising an input diffusion, a gate electrode, and the initial transfer electrode for precise metering of charge packets into the channel.",
  ],
  32: [
    "Alternatively, minority carriers can be injected without p-n junctions by surface avalanche breakdown induced directly beneath a high-voltage metal-insulator-semiconductor electrode.",
  ],
  34: [
    "Output detection can take several forms, including the capacitive bridge circuit of Figure 7A which detects charge packets by measuring the resulting change in surface depletion capacitance.",
  ],
  35: [
    "Figure 7B illustrates an AC output detection stage where radio-frequency power dissipation is measured across adjacent sensing electrodes as minority carriers modulate channel conductance.",
  ],
  36: [
    "Figure 7C shows direct voltage sensing where collected charge charges an output diode node connected directly to the gate of an on-chip field-effect transistor amplifier.",
  ],
  37: [
    "A periodic positive reset pulse delivered to the output diode node clears residual signal charge and restores the sense node to a known reference potential before the next packet arrives.",
  ],
  38: [
    "The field-effect transistor sensing amplifier can be integrated directly onto the same silicon substrate as the charge-transfer array, minimizing parasitic node capacitance and maximizing sensitivity.",
  ],
  39: [
    "While planar surface transfer is standard, charge-coupled devices can also transfer charge packets across multiple orthogonal directions or between opposite surfaces of the substrate.",
  ],
  40: [
    "Three-dimensional charge transfer extends device density by shifting charge packets through the bulk thickness dimension of the semiconductor wafer between upper and lower electrode arrays.",
  ],
  41: [
    "Vertical stepping allows multi-layer charge routing, where charge packets are transferred downward into the substrate, shifted laterally, and returned to the upper surface.",
  ],
  42: [
    "Figure 8 shows bidirectional charge transfer through the semiconductor thickness, where opposing surface electrodes establish overlapping depletion fields across the bulk wafer.",
  ],
  44: [
    "Charge transfer efficiency and speed are substantially enhanced by fringe electric fields that extend laterally into the gap between adjacent transfer electrodes.",
  ],
  45: [
    "Figure 9A demonstrates that when inter-electrode gaps are comparable to insulator thickness, overlapping fringing fields accelerate minority carriers into the advancing potential well.",
  ],
  46: [
    "In buried-channel structures, fringing fields penetrate deeper and more uniformly through the bulk channel, resulting in faster charge transit and higher clock frequencies.",
  ],
  47: [
    "Figure 9B illustrates shaped clock waveforms with ramped trailing edges that create asymmetric drift fields, driving carriers forward and preventing backward diffusion spills.",
  ],
  48: [
    "Additional field-enhancement techniques include asymmetric gate lengths, tapered dielectric layers, and non-uniform surface dopings along the transfer direction.",
  ],
  49: [
    "Asymmetric potential profiles allow two-phase clock operation by ensuring that charge packets can only move in one direction even when adjacent electrodes receive identical phase clocks.",
  ],
  50: [
    "Figure 12 shows a stepped-oxide structure where each electrode spans thick and thin dielectric regions, creating a built-in potential step that enforces unidirectional transfer.",
  ],
  51: [
    "Two-phase clocking simplifies clock generation circuitry, reduces clock line count, and eliminates overlapping phase timing constraints required by three-phase systems.",
  ],
  52: [
    "Asymmetric drive fields can also be generated by applying multi-level staircase voltage waveforms to uniform electrodes, establishing directional potential gradients.",
  ],
  53: [
    "Built-in potential asymmetry can alternatively be produced by localized ion implantation or differential surface doping beneath one portion of each transfer electrode.",
  ],
  54: [
    "Varying the dielectric constant or work function across the gate area similarly establishes a built-in lateral potential step to guide charge flow unidirectionally.",
  ],
  55: [
    "Fixed electrostatic charge embedded in the insulator or at the semiconductor interface can permanently shift local surface potential and enforce directional charge transfer.",
  ],
  56: [
    "Localized fixed charge can replace every alternate active clock electrode, halving the number of active gates and clock lines needed for a multi-stage shift register.",
  ],
  57: [
    "Patterned fixed charge can also be used to define custom potential barriers and storage well capacities for programmable logic and signal processing applications.",
  ],
  58: [
    "Electrodeless passive transfer channels can be constructed where traveling potential wells are sustained entirely by external acoustic waves or fringing fields.",
  ],
  59: [
    "Figure 10 illustrates a multichannel shift register where parallel charge transfer channels are isolated from one another by heavily doped channel-stop diffusion barriers.",
  ],
  60: [
    "Figure 11 shows a clock bus layout that connects three-phase drive lines to transfer electrodes along channel edges without requiring multilayer conductor crossovers.",
  ],
  61: [
    "Multilevel metallization schemes enable dense two-dimensional imaging and memory arrays with minimal parasitic capacitance and high packing density.",
  ],
  62: [
    "Figure 12 provides a perspective view of the stepped-oxide two-phase electrode arrangement, showing the contact busbars and the underlying asymmetric oxide profiles.",
  ],
  63: [
    "Figure 13 illustrates a two-level overlapping gate fabrication technique using refractory polysilicon and aluminum to achieve zero-gap electrode spacing without short circuits.",
  ],
  64: [
    "Figure 14 shows an optical image sensor where incident photons generate electron-hole pairs, accumulating photoelectrons in potential wells in proportion to local light intensity.",
  ],
  65: [
    "Linear and area image sensors integrate optical charge packets during an exposure period, then rapidly shift the packets line-by-line into an output register for serial video readout.",
  ],
  66: [
    "Backside illumination with three-dimensional bulk transfer allows optical photons to enter the backside of the wafer while charge packets are shifted and read out on the frontside in the dark.",
  ],
  67: [
    "Figure 15 illustrates acoustic-wave charge translation where a piezoelectric layer (ZnO or CdS) carries an ultrasonic surface wave whose electric field sequentially biases surface electrodes.",
  ],
  68: [
    "Figure 16 shows an electrodeless acoustic device where traveling acoustic waves in a piezoelectric layer directly induce and propagate potential wells through the adjacent silicon substrate.",
  ],
  69: [
    "The inventors detail preferred fabrication parameters: 10 ohm-cm n-type silicon, 1,200 Angstrom dry thermal SiO2 grown at 1,100°C, and gold or aluminum gate electrodes.",
  ],
  70: [
    "Array geometry requires electrode gaps of a few microns to match the approximately 5-micron lateral depletion width created by a 10-volt gate bias in 10 ohm-cm silicon.",
  ],
  71: [
    "The core architectural distinction from prior MIS devices is that charge packets representing information are stored and transferred continuously within the semiconductor without intermediate wiring.",
  ],
  72: [
    "The disclosure contrasts itself with prior gated shift registers (such as U.S. Pat. 3,621,283) that transferred charge between isolated opposite-conductivity diffused p-n regions.",
  ],
  73: [
    "By contrast, the charge-coupled device is defined by transferring and storing charge packets in a continuous channel consisting entirely of a single conductivity type.",
  ],
  74: [
    "The inventors conclude by noting that numerous structural and material variations relying on these charge-coupling principles fall within the broad scope of the invention.",
  ],
  76: [
    "The formal legal claims define the exclusive scope of the patent, reciting the combination of potential wells, sequential transfer electrodes, single-conductivity channels, and detection means.",
  ],
};
