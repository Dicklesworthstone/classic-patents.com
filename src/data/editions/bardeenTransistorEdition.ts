import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});

const crop = (file: string, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-2524035-bardeen-transistor/${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 2,524,035.`,
  width,
  height,
});

const FIGURES = {
  "Fig. 1": [crop("fig-1-source-crop-v1", 980, 420, "Fig. 1")],
  "Fig. 1a": [crop("fig-1a-source-crop-v1", 1100, 390, "Fig. 1a")],
  "Fig. 2": [crop("fig-2-source-crop-v1", 540, 410, "Fig. 2")],
  "Fig. 3": [crop("fig-3-source-crop-v1", 450, 350, "Fig. 3")],
  "Fig. 3a": [crop("fig-3a-source-crop-v1", 450, 350, "Fig. 3a")],
  "Fig. 4": [crop("fig-4-source-crop-v1", 450, 330, "Fig. 4")],
  "Fig. 5": [crop("fig-5-source-crop-v1", 450, 330, "Fig. 5")],
  "Fig. 6": [crop("fig-6-source-crop-v1", 450, 330, "Fig. 6")],
  "Fig. 7": [crop("fig-7-source-crop-v1", 450, 330, "Fig. 7")],
  "Fig. 8": [crop("fig-8-source-crop-v1", 570, 520, "Fig. 8")],
  "Fig. 9": [crop("fig-9-source-crop-v1", 570, 520, "Fig. 9")],
  "Fig. 10": [crop("fig-10-source-crop-v1", 520, 410, "Fig. 10")],
  "Fig. 11": [crop("fig-11-source-crop-v1", 560, 480, "Fig. 11")],
  "Fig. 12": [crop("fig-12-source-crop-v2", 400, 375, "Fig. 12")],
  "Fig. 13": [crop("fig-13-source-crop-v1", 760, 350, "Fig. 13")],
  "Fig. 14": [crop("fig-14-source-crop-v1", 760, 310, "Fig. 14")],
  "Fig. 15": [crop("fig-15-source-crop-v1", 850, 630, "Fig. 15")],
  "Fig. 16": [crop("fig-16-source-crop-v1", 900, 630, "Fig. 16")],
} as const;

const figure = (
  label: keyof typeof FIGURES,
  sourceText: string = label,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 2,524,035`,
  figurePreviews: FIGURES[label],
});

/**
 * Manually prepared continuous source face of the fourteen-page US 2,524,035
 * facsimile. Drawing sheets are followed by the specification and all forty
 * printed claims; page markers remain solely in the reviewed ledger.
 */
export const bardeenTransistorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "6de62de550a221c5380088e0485c2ae6955334a199b6da15ff3dcd6ca65978de",
  preparedBy: "Classic Patents editorial agent (GPT-5)",
  preparedAt: "2026-08-18",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "Patented Oct. 3, 1950",
        "2,524,035",
        "UNITED STATES PATENT OFFICE",
        "JOHN BARDEEN, SUMMIT, AND WALTER H. BRATTAIN, MORRISTOWN, N. J., ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, NEW YORK, N. Y., A CORPORATION OF NEW YORK.",
        "THREE-ELECTRODE CIRCUIT ELEMENT UTILIZING SEMICONDUCTIVE MATERIALS.",
        "Application June 17, 1948, Serial No. 33,466. 40 Claims. (Cl. 179-171.)",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 3",
      title: "Preferred circuit, section, and circuit forms",
      description: [
        figure("Fig. 1"),
        { kind: "text", text: " is the preferred circuit element and circuit; " },
        figure("Fig. 1a"),
        { kind: "text", text: " is its enlarged section; " },
        figure("Fig. 2"),
        { kind: "text", text: " is the equivalent tube circuit; and " },
        figure("Fig. 10"),
        { kind: "text", text: ", " },
        figure("Fig. 11"),
        { kind: "text", text: ", and " },
        figure("Fig. 12"),
        { kind: "text", text: " show alternative circuit connections." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 3",
      title: "Electrode fields and contact alternatives",
      description: [
        figure("Fig. 3"),
        { kind: "text", text: " and " },
        figure("Fig. 3a"),
        { kind: "text", text: " show the collector's influence on current flow; " },
        figure("Fig. 4"),
        { kind: "text", text: ", " },
        figure("Fig. 5"),
        { kind: "text", text: ", " },
        figure("Fig. 6"),
        { kind: "text", text: ", and " },
        figure("Fig. 7"),
        { kind: "text", text: " show alternative collector dispositions; " },
        figure("Fig. 8"),
        { kind: "text", text: " and " },
        figure("Fig. 9"),
        { kind: "text", text: " show alternative electrode structures." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 3",
      title: "Potential distributions",
      description: [
        figure("Fig. 13"),
        { kind: "text", text: " and " },
        figure("Fig. 14"),
        { kind: "text", text: " plot metal contacts with N- and P-type material; " },
        figure("Fig. 15"),
        { kind: "text", text: " plots the thin P-type layer and barrier; " },
        figure("Fig. 16"),
        {
          kind: "text",
          text: " makes the collector-directed potential surface three-dimensional.",
        },
      ],
    },
    p(
      text(
        "This application is a continuation-in-part of application Serial No. 11,165, filed February 26, 1948, and thereafter abandoned.",
      ),
    ),
    p(
      text(
        "This invention relates to a novel method of and means for translating electrical variations for such purposes as amplification, wave generation, and the like.",
      ),
    ),
    p(
      text(
        "The principal object of the invention is to amplify or otherwise translate electric signals or variations by use of compact, simple, and rugged apparatus of novel type.",
      ),
    ),
    p(
      text(
        "Another object is to provide a circuit element for use as an amplifier or the like which does not require a heated thermionic cathode for its operation, and which therefore is immediately operative when turned on. A related object is to provide such a circuit element which requires no evacuated or gas-filled envelope.",
      ),
    ),
    p(
      text(
        "Attempts have been made in the past to convert solid rectifiers utilizing selenium, copper sulphide, or other semi-conductive materials into amplifiers by the direct expedient of embedding a grid-like electrode in a dielectric layer disposed between the cathode and the anode of the rectifier. The grid is supposed, by exerting an electric force at the surface of the cathode, to modify its emission and so alter the cathode-anode current. As a practical matter it is impossible to embed a grid in a layer which is so thick as to insulate the grid from the other electrodes and yet so thin as to permit current to flow between them.",
      ),
    ),
    p(
      text(
        "It has also been proposed to pass a current from end to end of a strip of homogeneous isotropic semiconductive material and, by the application of a strong transverse electrostatic field, to control the resistance of the strip, and hence the current through it. So far as is known, all of such past devices are beyond human skill to fabricate with the fineness necessary to produce amplification. In any event they do not appear to have been commercially successful.",
      ),
    ),
    p(
      text(
        "It is well known that in semiconductors there are two types of carriers of electricity which differ in the signs of the effective mobile charges. The negative carriers are excess electrons which are free to move, and are denoted by the term conduction electrons or simply electrons. The positive carriers are missing or defect electrons, and are denoted by the term holes. The conductivity of a semiconductor is called excess or defect, or N or P type, depending on whether the mobile charges normally present in excess in the material under equilibrium conditions are electrons (Negative carriers) or holes (Positive carriers).",
      ),
    ),
    p([
      {
        kind: "text",
        text: "When a metal electrode is placed in contact with a semiconductor and a potential difference is applied across the junction, the magnitude of the current which flows often depends on the sign as well as on the magnitude of the potential. A junction of this sort is called a ",
      },
      term(
        "rectifying contact",
        "Here the term identifies a junction whose easy-current direction depends on its bias polarity. The patent uses it for the emitter and collector contacts and for an opposite-type semiconductor boundary.",
      ),
      {
        kind: "text",
        text: ". If the contact is made to an N-type semiconductor, the direction of easy current flow is that in which the semiconductor is negative with respect to the electrode. With a P-type semiconductor, the direction of easy flow is that in which the semiconductor is positive. A similar rectifying contact exists at the boundary between two semiconductors of opposite conductivity types.",
      },
    ]),
    p(
      text(
        "This boundary may separate two semiconductor materials of different constitutions, or it may separate zones or regions, within a body of semiconductor material which is chemically and stoichiometrically uniform, which exhibit different conductivity characteristics.",
      ),
    ),
    p(
      text(
        "The present invention in one form utilizes a block of semiconductor material on which three electrodes are placed. One of these, termed the collector, makes rectifier contact with the body of the block. The other, termed the emitter, preferably makes rectifier contact with the body of the block also. The third electrode, which may be designated the base electrode, preferably makes a low resistance contact with the body of the block. When operated as an amplifier, the emitter is normally biased in the direction of easy current flow with respect to the body of the semiconductor block. The nature of the emitter electrode and of that portion of the semiconductor which is in the immediate neighborhood of the electrode contact is such that a substantial fraction of the current from this electrode is carried by charges whose signs are opposite to the signs of the mobile charges normally in excess in the body of the semiconductor. The collector is biased in the reverse, or high resistance direction relative to the body of the semiconductor. In the absence of the emitter, the current to the collector flows exclusively from the base electrode and is impeded by the high resistance of this collector contact. The sign of the collector bias potential is such as to attract the carriers of opposite sign which come from the emitter. The collector is so disposed in relation to the emitter that a large fraction of the emitter current enters the collector. The fraction depends in part on the geometrical disposition of the electrodes and in part on the bias potentials applied.",
      ),
    ),
    p(
      text(
        "As the emitter is biased in the direction of easy flow, the emitter current is sensitive to small changes in potential between the emitter and the body of the semiconductor, or between the emitter and the base electrode. Application of a small voltage variation between the base electrode and emitter causes a relatively large change in the current entering the semiconductor from the emitter, and a correspondingly large change in the current to the collector. One effect of the change in emitter current is to modify the total current flowing to the collector, so that the overall change in collector current may be greater than the change in the emitter current. The collector circuit may contain a load of high impedance matched to the internal impedance of the collector, which, because of the high resistance rectifier contact of the collector, is high. As a result, voltage amplification, current amplification, and power amplification of the input signal are obtained.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "In one form, the device utilizes a block of semiconductor material of which the main body is of one conductivity type while a very thin surface layer or film is of opposite conductivity type. The surface layer is separated from the body by a ",
      },
      term(
        "high resistance rectifying barrier",
        "The source uses this phrase for the high-resistance region that separates the surface layer from the supporting body while retaining a bias-dependent rectifying junction between them.",
      ),
      {
        kind: "text",
        text: ". The emitter and collector electrodes make contact with this surface layer sufficiently close together for mutual influence in the manner described above. The base electrode makes a low resistance contact with the body of the semiconductor. When suitable bias potentials are applied to the various electrodes, a current flows from the emitter into the thin layer. Owing to the conductivity of the layer and to the nature of the barrier, this current tends to flow laterally in the thin layer, rather than following the most direct path across the barrier to the base electrode. This current is composed of carriers whose signs are opposite to the signs of the mobile charges normally in excess in the body of the semiconductor.",
      },
    ]),
    p(
      text(
        "In other words, when there is a thin layer of opposite conductivity type immediately under the emitter electrode, the current flowing into the block in the direction of easy flow consists largely of carriers of opposite sign to those of the mobile charges normally present in excess in the body of the block; and the presence of these carriers increases the conductivity of the block. The bias voltage on the collector which, as stated above, is biased in the reverse or high resistance direction relative to the block, produces a strong electrostatic field in a region surrounding the collector so that the current from the emitter which enters this region is drawn in to the collector. Thus, the collector current, and hence the conductance of the unit as a whole, are increased. The size of the region in which this strong field exists is comparatively insensitive to variations in the collector potential so that the impedance of the collector circuit is high. On the other hand, the current from the emitter to the layer is extremely sensitive to variations of the emitter potential, so that the impedance of the emitter circuit is low.",
      ),
    ),
    p(
      text(
        "It is a feature of the invention that the input and output impedances of the device are controlled by choice and treatment of the semiconductor material body and of its surface, as well as by choice of the bias potentials of the electrodes.",
      ),
    ),
    p(
      text(
        'From the standpoint of its external behavior and uses, the device of the invention resembles a vacuum tube triode; and while the electrodes are designated emitter, collector and base electrode, respectively, they may be externally interconnected in the various ways which have become recognized as appropriate for triodes, such as the conventional, the "grounded grid," the "grounded plate" or cathode follower, and the like. Indeed, the discovery on which the invention is based, was first made with circuit connections which are extremely similar to the so-called "grounded grid" vacuum tube connections. However, the analogies among the circuits is, of course, no better than the analogy between emitter and cathode, base electrode and grid, collector and anode.',
      ),
    ),
    p(
      text(
        "By feeding back a portion of the output voltage in proper phase to the input terminals, the device may be caused to oscillate at a frequency determined by its external circuit elements, and, among other tests, power amplification was confirmed by a feedback connection which caused it to oscillate.",
      ),
    ),
    p(
      text(
        "It has been found that the performance of the device is expressed, to a good approximation, by the following functional relations:",
      ),
    ),
    { kind: "equation", text: "Ie = f(Ve + RfIc). (1)" },
    { kind: "equation", text: "Ic = Ic⁰(Vc) + aIe. (1a)" },
    p(
      text(
        "where Ie = emitter current; Ic = collector current; Ic⁰(Vc) = collector current with emitter disconnected; Ve = voltage of emitter electrode measured with respect to the base electrode; Vc = voltage of collector electrode measured with respect to the base electrode; Rf = an equivalent resistance independent of bias; a = a numerical factor which depends on the bias voltages; f(Ve) gives the relation between emitter current and emitter voltage with the collector circuit open.",
      ),
    ),
    p(
      text(
        "The interpretation of the foregoing Equation 1 is that the collector current lowers the potential of the surface of the block in the vicinity of the emitter relative to the base electrode by an amount RfIc, and thus increases the effective bias voltage on the emitter by the same amount. The term RfIc thus represents positive feedback.",
      ),
    ),
    p(
      text(
        "The invention will be fully apprehended from the following detailed description of one embodiment thereof, taken in connection with the appended drawings, in which:",
      ),
    ),
    p([
      figure("Fig. 1", "Fig. 1"),
      {
        kind: "text",
        text: " is a schematic diagram, partly in perspective, showing a preferred embodiment of the invention; ",
      },
      figure("Fig. 1a", "Fig. 1a"),
      {
        kind: "text",
        text: " is a cross-section of a part of ",
      },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: " to a greatly enlarged scale; " },
      figure("Fig. 2", "Fig. 2"),
      { kind: "text", text: " is the equivalent vacuum tube schematic circuit of " },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: "; " },
      figure("Fig. 3", "Fig. 3"),
      {
        kind: "text",
        text: " is a plan view of the block of ",
      },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: ", showing the disposition of the electrodes; " },
      figure("Fig. 3a", "Fig. 3a"),
      {
        kind: "text",
        text: " is like ",
      },
      figure("Fig. 3", "Fig. 3"),
      {
        kind: "text",
        text: " but shows the influence of the collector in modifying the emitter current; Figs. ",
      },
      figure("Fig. 4", "4"),
      { kind: "text", text: ", " },
      figure("Fig. 5", "5"),
      { kind: "text", text: ", " },
      figure("Fig. 6", "6"),
      { kind: "text", text: " and " },
      figure("Fig. 7", "7"),
      { kind: "text", text: " show electrode dispositions alternative to those of " },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: "; Figs. " },
      figure("Fig. 8", "8"),
      { kind: "text", text: " and " },
      figure("Fig. 9", "9"),
      { kind: "text", text: " show electrode structures alternative to those of " },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: "; " },
      figure("Fig. 10", "Fig. 10"),
      {
        kind: "text",
        text: " shows a modified unit of the invention connected for operation in the circuit of a conventional triode; ",
      },
      figure("Fig. 11", "Fig. 11"),
      {
        kind: "text",
        text: ' shows another modified unit of the invention connected for operation in a "grounded plate" or cathode follower circuit; ',
      },
      figure("Fig. 12", "Fig. 12"),
      {
        kind: "text",
        text: " shows the unit of the invention connected for self-sustained oscillation;",
      },
    ]),
    p([
      figure("Fig. 13", "Fig. 13"),
      {
        kind: "text",
        text: " is a diagram showing the electron potential distribution in the interior of an N-type semiconductor in contact with a metal; ",
      },
      figure("Fig. 14", "Fig. 14"),
      {
        kind: "text",
        text: " is a diagram showing the electron potential distribution in the interior of a P-type semiconductor in contact with a metal; ",
      },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: " is a diagram showing the electron potential distribution in the interior of a thin P-type semiconductive layer in contact on one side with a metal and on the other side with a body of N-type semiconducting material, for electrons in the conduction band (upper curves), and in the filled band (lower curves); and ",
      },
      figure("Fig. 16", "Fig. 16"),
      {
        kind: "text",
        text: " is a diagram showing the variation of the potential distribution of curve D of ",
      },
      figure("Fig. 15", "Fig. 15"),
      { kind: "text", text: " as a function of distance from the emitter to the collector." },
    ]),
    p(
      text(
        'The materials with which the invention deals are those semiconductors whose electrical characteristics are largely dependent on the inclusion therein of very small amounts of significant impurities. The expression "significant impurities" is here used to denote those impurities which affect the electrical characteristics of the material such as its resistivity, photosensitivity, rectification, and the like, as distinguished from other impurities which have no apparent effect on these characteristics. The term "impurities" is intended to include intentionally added constituents as well as any which may be included in the basic material as found in nature or as commercially available. Germanium is such a material which, along with some representative impurities, will furnish an illustrative example for explanation of the present invention. Silicon is another such material. In the case of semiconductors which are chemical compounds such as cuprous oxide (Cu₂O) or silicon carbide (SiC), deviations from stoichiometric composition may constitute significant impurities.',
      ),
    ),
    p(
      text(
        'Small amounts, i. e., up to 0.1 per cent of impurities, generally of higher valency than the basic semiconductor material, e. g., phosphorus in silicon, antimony and arsenic in germanium, are termed "donor" impurities because they contribute to the conductivity of the basic material by donating electrons to an unfilled "conduction energy band" in the basic material. In such case the donated negative electrons constitute the carriers of current and the material and its conductivity are said to be of the N-type. Similar small amounts of impurities, generally of lower valency than the basic material, e. g., boron in silicon or aluminum in germanium, are termed "acceptor" impurities because they contribute to the conductivity by "accepting" electrons from the atoms of the basic material in the filled band. Such an acceptance leaves a gap or "hole" in the filled band. By interchange of the borrowed electrons from atom to atom, these positive "holes" effectively move about and constitute the carriers of current, and the material and its conductivity are said to be of the P-type. Under equilibrium conditions, the conductivity of an electrically neutral region or zone of such a semiconductor material is directly related to the concentration of significant impurities. Donor impurities which have given up electrons to an unfilled band are positively charged, and may be thought of as fixed positive ions. In a region of a semiconductor which has only donor type impurities, the concentration of conduction electrons is equal to the concentration of ionized donors. Similarly, in a region of a semiconductor which has only acceptor impurities, the concentration of holes is equal to the concentration of the negatively charged acceptor ions.',
      ),
    ),
    p([
      {
        kind: "text",
        text: "If for any reason there is a departure from electrical neutrality in a region, giving a resultant ",
      },
      term(
        "space charge",
        "A local net electric charge produced when mobile carriers and fixed ionized impurities no longer balance. The patent uses it to explain a conductivity type that can differ from the bulk impurity indication.",
      ),
      {
        kind: "text",
        text: ", the magnitude of the conductivity, and even the conductivity type may differ from that indicated by the significant impurities. It was once thought that the high resistance barrier layer in a rectifier differs somehow in chemical constitution or in the nature of the significant impurities from the main body of the semiconductor. W. Schottky, in Zeits. f. Phys., volume 113, page 367 (1939), has shown that this is not necessary. While the concentration of carriers (mobile charges) in the barrier layer is small, the concentration of ionized impurities (fixed charges) may be the same as in the body of the semiconductor. The fixed charges in the barrier layer act in concert with induced charges of opposite sign on the metal electrode to produce a potential drop between the electrode and the body of the semiconductor. The concentration of carriers at a point depends on the electrostatic potential at that point, and is small compared with the equilibrium concentration in the body of the semiconductor if the potential differs from that in the body by more than a small fraction of a volt. The mathematical theory has been developed by W. Schottky and E. Spenke in Wiss. Veroff. Siemens Werke, vol. 18, page 225 (1939). These authors show that if the variation in electrostatic potential with depth below the surface is sufficiently large, the conductivity passes through a minimum for a certain potential and depth and the conductivity is of opposite type for larger values of the potential corresponding to smaller values of depth. They call the region of opposite conductivity type an ",
      },
      term(
        "inversion region",
        "The locally opposite-conductivity region created by a sufficient electrostatic potential variation near the surface. In the cited account it need not result from a changed chemical impurity composition.",
      ),
      {
        kind: "text",
        text: ". It is thus possible to have at a rectifier contact a thin layer of one conductivity type next to the metal electrode, separated by a ",
      },
      term(
        "high resistance barrier",
        "A high-resistance intervening region between the near-surface layer and the opposite-type body. The source distinguishes its electrical effect from an automatically different chemical constitution.",
      ),
      { kind: "text", text: " from the body of opposite conductivity type." },
    ]),
    p(
      text(
        "It has been pointed out by J. Bardeen in Phys. Rev., vol. 71, page 717 (1947), that the same sort of barrier layer that Schottky found for rectifying contacts may exist beneath the free surface of a semiconductor, the space charge of the barrier layer being balanced by a charge of opposite sign on the surface atoms. It is possible, for example, to have a thin layer of P-type conductivity at the free surface of a block which has a uniform concentration of donor impurities and which, therefore, has N-type conductivity in the body of the block, even though there are no actual acceptor impurities.",
      ),
    ),
    p([
      {
        kind: "text",
        text: 'To distinguish such a situation from the similar one which depends on the presence of significant chemical impurities of opposite type in a thin surface layer, the terms "physical" and "chemical" are employed. Thus the terms ',
      },
      term(
        '"physical layer"',
        "The patent's name for an opposite-type surface layer caused by surface conditions rather than a changed concentration or nature of significant chemical impurities.",
      ),
      { kind: "text", text: " and " },
      term(
        '"physical barrier"',
        "The associated high-resistance barrier created by those surface conditions. It separates the physical layer from the semiconductor body without being attributed to a changed impurity profile.",
      ),
      {
        kind: "text",
        text: " refer to the layer of opposite conductivity type next to the surface and the high resistance barrier which separates it from the body of the semiconductor, both of which exist as a result of surface conditions and not as a result of a variation in the nature or concentration of significant impurities. The terms ",
      },
      term(
        '"chemical layer"',
        "The corresponding opposite-type surface layer when the source attributes the condition to a variation in significant chemical impurities rather than to surface conditions alone.",
      ),
      { kind: "text", text: " and " },
      term(
        '"chemical barrier"',
        "The corresponding high-resistance barrier where the source attributes the layer-and-barrier condition to a variation in significant chemical impurities.",
      ),
      {
        kind: "text",
        text: " refer to the corresponding situation which does depend on a variation in significant impurities.",
      },
    ]),
    p(text("Both physical layers and chemical layers are suitable for the invention.")),
    p(
      text(
        "It is known how, by control of the distribution of impurities, to fabricate a block of silicon of which the main body is of one conductivity type while a thin surface layer, separated from the main body by a high resistance barrier, is of the other type. In this case the layer is believed to be chemical rather than physical. For methods of preparing such silicon, as well as for certain uses of the same, reference may be made to an application of J. H. Scaff and H. C. Theuerer, filed December 24, 1947, Serial No. 793,744 and to United States Patents 2,402,661 and 2,402,662 to R. S. Ohl. Such materials are suitable for use in connection with the present invention. It is preferred, however, to describe the invention in connection with the material which was employed when the discovery on which the invention is based was made, namely, N-type germanium which has been so treated as to enable it to withstand high voltage in the reverse direction when used as a point contact rectifier.",
      ),
    ),
    p(
      text(
        'There are a number of methods by which the germanium and its surface may be prepared. One such method commences with the process which forms the subject-matter of an application of J. H. Scaff and H. C. Theuerer, filed December 29, 1945, Serial No. 638,351, and which is further described in "Crystal Rectifiers" by H. C. Torrey and C. A. Whitmer, Radiation Laboratory Series No. 15, (McGraw-Hill 1948). Briefly, germanium dioxide is placed in a porcelain dish and reduced to germanium in a furnace in an atmosphere of hydrogen. After a preliminary low heat, the temperature is raised to 1,000° C. at which the germanium is liquefied and substantially complete reduction takes place. The charge is then rapidly cooled to room temperature, whereupon it may be broken into pieces of convenient size for the next step. The charge is now placed in a graphite crucible and heated to liquefaction in an induction furnace in an atmosphere of helium and then slowly cooled from the bottom upwardly by raising the heating coil at the rate of about 1/8 inch per minute until the charge has fully solidified. It is then cooled to room temperature.',
      ),
    ),
    p(
      text(
        "The ingot is next soaked at a low heat of about 500° C. for 24 hours in a neutral atmosphere, for example of helium after which it is allowed to cool to room temperature.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "In the resulting heat-treated ingot, various parts or zones are of various characteristics. In particular, the central part of the ingot is of N-type material capable of withstanding a ",
      },
      term(
        '"back voltage,"',
        "The rectifier-art term used here for the reverse-voltage tolerance of the selected N-type germanium. The stated 100-200 volts describes the preferred material-selection property.",
      ),
      {
        kind: "text",
        text: " in the sense in which this term is employed in the rectifier art, of 100-200 volts. It is this material which it is preferred to employ in connection with the present invention.",
      },
    ]),
    p(
      text(
        "This material is next cut into blocks of suitable size and shape for use in connection with the invention. A suitable shape is a disc shaped block of about 1/4 inch diameter, and 3/32 inch thickness. The block is then ground flat on both sides, first with 280 mesh abrasive dust, for example, carborundum, and then with 600 mesh. It is then etched for one minute. The etching solution may consist of 10 c. c. of concentrated nitric acid, 5 c. c. of commercial standard (50 per cent) hydrofluoric acid, and 10 c. c. of water, in which a small amount, e. g. 0.2 gram, of copper nitrate has been dissolved. This etching treatment enables the block to withstand high (rectifier) back voltages. Next, one side of the block is provided with a coating of metal, for example copper or gold, which constitutes a low resistance electric contact. This may be done by evaporation or electroplating in accordance with well-known techniques. As a precaution against contamination of the other (unplated) side of the block which may have occurred in the course of the plating process, the unplated side may be subjected to a repetition of the etching process.",
      ),
    ),
    p(
      text(
        "The block may now be given an anodic oxidation treatment, which may be carried out in the following way. The block is placed, plated side down, on a metal bed-plate which is connected to the positive terminal of a source of voltage such as a battery, and that part of the upper (unplated) surface which is to be treated is covered with polymerized glycol boriborate, or other preferably viscous electrolyte in which germanium dioxide is insoluble. An electrode of inert metal, such as silver, is dipped into the liquid without touching the surface of the block, and is connected to a negative battery terminal of about -22.5 volts. Current of about 1 milliampere commences to flow for each square centimeter of block surface, falling to about 0.2 milliampere per cm.² in about 4 minutes. The electrode is then connected to the -45 volt battery terminal. The initial current is about 0.7 milliampere per cm.², falling to 0.2 milliampere per cm.² in about 6 minutes. The electrode is then connected to the -90 volt battery terminal. The initial current is now about 0.5 milliampere per cm.², falling to about 0.15 milliampere per cm.² in 10 to 20 minutes.",
      ),
    ),
    p(
      text(
        "The battery is then disconnected, the block is removed and washed clean of the glycol borate with warm water, and dried with fine paper tissue. Finish drying has been successfully carried out by placing the block in a vacuum chamber and applying radiant heat. Either the heat or the vacuum may be sufficient, but both together are known to be. If spot electrodes are required on the upper surface as later described, they may be evaporated on in the course of the finish drying process. The germanium block is now ready for use.",
      ),
    ),
    p(
      text(
        "The foregoing oxidation process, however, is not essential. Amplification has been obtained with specimens to which no surface treatment has been applied subsequent to the etch, other than the electrical forming process described below.",
      ),
    ),
    p([
      figure("Fig. 1", "Fig. 1"),
      {
        kind: "text",
        text: " shows a block 1 of germanium which has been prepared in the foregoing manner, and ",
      },
      figure("Fig. 1a", "Fig. 1a"),
      {
        kind: "text",
        text: " shows the central part of the block 1 in section and to an enlarged scale. Referring to ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: " and " },
      figure("Fig. 1a", "1a"),
      {
        kind: "text",
        text: " together, the lower part of the block 1, whose surface is plated with a metal film 2 serving as the base electrode, is known to be of N-type. The thin layer 3 at the upper surface manifests P-type conductivity in which case, as is well known, the boundary 4 separating this P-type layer from the N-type material of the main body of the block behaves like a high resistance rectifying barrier. A first electrode 5, denoted the emitter, makes contact with the upper face of the block, i. e., with the P-type layer 3, preferably somewhere near its center, or at least several point diameters removed from the nearest edge. This contact is preferably of the rectifier type with respect to the body of the block 1. It may comprise a bent wire of springy material, from 0.5 to 5 mils in diameter, preferably pointed at the contact and electrolytically or by grinding. Processes for forming the points on such wires are described in United States Patent 2,430,028 to W. G. Pfann, J. H. Scaff and A. H. White. The point of the wire is brought into contact with the upper surface 3 of the block with a force of 1 to 10 grams, whereupon a cold flow of the metal of the point takes place, causing it to conform to any minute irregularities of the block surface. To this end the wire of the point should be ductile as compared with the material of the block. Tungsten, copper and phosphor bronze are examples of suitable materials.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "A second electrode 6, denoted the collector, makes contact with the upper face 3 of the block very close to the emitter 5. Best results have been obtained when the separation, measured along the surface of the block, between the collector and the emitter, is from 1 to 10 mils. This electrode 6 should make rectifier contact with the block and may be a pointed spring wire, formed and placed as above described in connection with the emitter 5. On the other hand, it may comprise a small spot of metal, for example, gold, which has been evaporated onto the upper surface of the block in the course of the final drying operation, and through which a central hole has been pierced (see ",
      },
      figure("Fig. 6", "Fig. 6"),
      { kind: "text", text: ") or across which a diametral slot has been cut (see " },
      figure("Fig. 7", "Fig. 7"),
      {
        kind: "text",
        text: "). Evaporation of such a spot or film of metal onto the upper face after completion of the anodic oxidation process described above results in a non-ohmic rectifier junction or connection.",
      },
    ]),
    p(
      text(
        "A third connection, termed the base electrode, is made, by soldering or otherwise, to the metal film 2 which has been plated onto the lower surface of the block 1.",
      ),
    ),
    p(
      text(
        "While the unit is now ready for use, its operation can generally be improved by an electrical forming process, in which a potential in excess of the peak back voltage is applied to either one or both of the point electrodes 5, 6, i. e., between it and the base electrode 2. The unit is protected from injury by heavy currents by inclusion of a resistor in series. The effect of this treatment is believed to lie in a concentrated application of electric field and heat to the material in the immediate neighborhood of the point, and so in an improvement of the electrical characteristics of the contact.",
      ),
    ),
    p(
      text(
        "Bias voltages are now applied to the electrodes: a small bias, usually positive, on the emitter of the order of a fraction of a volt and a larger negative bias on the collector, usually in the range from -5 to -50 volts, measured, in each case, from the body of the block to the point electrode. These bias potentials may be obtained from batteries 7, 8 connected as shown or otherwise, as desired.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "A load of 1,000 to 100,000 ohms may now be connected in circuit with the collector, for example by way of an output transformer 9, and a signal to be amplified may be applied between the emitter and the base electrode, for example by way of an input transformer 10. The connections may be those of the conventional triode as indicated in ",
      },
      figure("Fig. 10", "Fig. 10"),
      { kind: "text", text: ", or of the so-called grounded plate or cathode-follower, as in " },
      figure("Fig. 11", "Fig. 11"),
      {
        kind: "text",
        text: ". In these figures the input signal is symbolically represented by a source 11 and the load by an output resistor RL. Discovery of the amplifying properties of the device was made, however, with the grounded base circuit of ",
      },
      figure("Fig. 1", "Fig. 1"),
      {
        kind: "text",
        text: ', of which the vacuum tube counterpart is the so-called "grounded grid" connection of ',
      },
      figure("Fig. 2", "Fig. 2"),
      {
        kind: "text",
        text: ". (The principal distinguishing feature of this circuit as employed with a vacuum tube triode is that the load current flows through the source. This does not hold for the unit of the present invention, because the base electrode may draw substantial current.) The device as thus connected has given power gains of more than a factor of 75. Operating data on three different samples are given in the following table:",
      },
    ]),
    {
      kind: "table",
      headers: [text("Sample No."), text("1"), text("2"), text("3")],
      rows: [
        [text("Input Res. (ohms)"), text("640"), text("500"), text("1,000")],
        [text("Output Res. (ohms)"), text("3×10⁴"), text("3×10⁴"), text("3×10⁴")],
        [text("Input Voltage, A.C.R.M.S."), text("0.29"), text("0.30"), text("0.10")],
        [text("Output Voltage, A.C.R.M.S."), text("18"), text("15"), text("3.6")],
        [text("Voltage Gain"), text("62"), text("50"), text("36")],
        [text("Power in (watts)"), text("1.3×10⁻⁴"), text("1.8×10⁻⁴"), text("1.15×10⁻⁵")],
        [text("Power out (watts)"), text("100×10⁻⁴"), text("75×10⁻⁴"), text("42.5×10⁻⁵")],
        [text("Power Gain"), text("80"), text("42"), text("36")],
        [text("Input Bias D.C. (volts)"), text("+0.2"), text("+0.25"), text("+0.2")],
        [text("Output Bias D.C. (volts)"), text("−40"), text("−20"), text("−10")],
      ],
    },
    p([
      {
        kind: "text",
        text: "Confirmation of the presence of power amplification has been obtained by feeding back a part of the output voltage to the input circuit, as by way of the coupling between the windings of a transformer 12, as in ",
      },
      figure("Fig. 12", "Fig. 12"),
      { kind: "text", text: " whereupon sustained self-oscillation took place." },
    ]),
    p(
      text(
        "It is to be noted that in the case of the No. 1 sample of the foregoing table, the power gain exceeds the voltage gain by a factor of 80/62 or 1.3. Inasmuch as, in any amplifying device which gives both power gain and voltage gain, the current gain is the quotient of the two, it is evident that sample No. 1 manifests a current gain of 1.3.",
      ),
    ),
    p(
      text(
        "Without necessarily subscribing to any particular theory, the following hypothesis is presented to account for the experimentally determined facts, with all of which it is consistent. It is believed that the preparation of the semiconductor material and its surface treatment result in the formation of an oxide film, and, below it, of a layer or film 3 of P-type conductivity on the surface of the block, separated from the main body, which is of N-type, by a high resistance barrier 4. The oxide film is removed by washing. This P-type layer is very thin, perhaps 10⁻⁵ cm. in thickness, but the N-type body of the block provides all necessary support for it, and also provides a low impedance path to the base electrode 2. Its presence is confirmed by the fact that, particularly with featherweight forces on the contact points 5, 6 and with small voltages applied to them, P-type rectifier characteristics have sometimes been obtained. (P-type and N-type rectifier characteristics and their significance and differences are discussed in United States Patent 2,402,839 to R. S. Ohl.) But when the mechanical force on the contact point is increased to 10 grams or so and the voltage applied to it is raised to ½ volt or so, the rectifier characteristic is observed suddenly to shift from P-type to N-type. Furthermore, potential probe measurements on the surface of the block, made with the collector disconnected, indicate that the major part of the emitter current travels on or close to the surface of the block, substantially laterally in all directions away from the emitter 5 before crossing the barrier 4. These measurements indicate the presence of a conducting layer at the surface of the block, which by inference is of P-type. In case the treatment stops with the etching process, the layer is believed to be physical. If it includes the further anodic oxidation step, the layer is believed to be chemical, but its nature has not been definitely established.",
      ),
    ),
    p(
      text(
        "It is believed that the P-type layer on the germanium surface of the preferred embodiment is not greatly altered when a contact is made with a metal point. When a small positive bias is applied to the emitter, and a current flows, the carriers are largely those of the surface layer, that is, holes rather than conduction electrons. The potential probe measurements discussed above indicate that the concentration of holes, and thus the conductivity, in the vicinity of the emitter point, increase with increasing forward current. This hole current spreads out in all directions from the emitter 5 before crossing the high resistance barrier 4. With the collector circuit open, it then makes its way throughout the body of the block to the plated lower surface 2. (In the N-type body of the block, the current may take the form of a flow of electrons upward to neutralize the downward flow of holes from the P-type layer.) In the absence of the collector electrode 6, this current is the only current. Its path is indicated in ",
      ).concat([figure("Fig. 1a", "Fig. 1a")], text(" by stream lines 13.")),
    ),
    p(
      text(
        "Now when the collector 6 contact is made, and a negative bias potential is applied to it, of from -5 to -50 volts, a strong electrostatic field appears across the P-type layer 3, and across the high resistance barrier 4, being maintained by the fixed positive charges in the N-type body material in the immediate vicinity of the collector. The barrier and the P-type layer together are believed to be of the order of 10⁻⁴ cm. in thickness. Thus with 10 volts across a space of 10⁻⁴ cms., the average strength of this field is of the order of 10⁵ volts per cm., being greatest at the collector and extending in all directions from the collector, and is indicated in ",
      ).concat(
        [figure("Fig. 1a", "Fig. 1a")],
        text(
          " by the broken line 14, within which some of the fixed positive charges are indicated by plus signs.",
        ),
      ),
    ),
    p(
      text(
        "It is in order that the material shall be able to support a large voltage drop across this region that material of the so-called high back voltage type is preferred.",
      ),
    ),
    p(
      text(
        "Now when the current of positive holes as indicated by stream lines 13 comes within the influence of this field, the holes are attracted to the region of lowest potential, namely, to the point at which the collector electrode 6 makes contact with the layer 3. There they are picked up by the collector 6 to appear as a current in an external load circuit 8, 9 connected to the collector 6. With the large negative bias on the collector 6, a variation of several volts on the collector makes very little difference in the strength or the extent of the field which surrounds it, and therefore has but a secondary effect on the fraction of the emitter current collected by the collector. In other words the collector operates under conditions which are close to saturation, and the alternating current impedance of the collector circuit is high. As shown in Table I, it has been measured at values from 10,000 to 100,000 ohms. For maximum power output, the external load impedance should be matched to the internal impedance of the collector. On the other hand, variation of the voltage between the emitter 5 and the base electrode 2 by a small fraction of a volt, as by a signal which may be applied to the input terminals and so impressed on these electrodes, for example, by way of the transformer 10, effects a large variation in the emitter current and therefore in the collector current. Hence an amplified replica of the input signal voltage appears across the load resistor.",
      ),
    ),
    p([
      { kind: "text", text: "As shown in " },
      figure("Fig. 1a", "Fig. 1a"),
      {
        kind: "text",
        text: ", it is preferred that the area of contact of each of the two point electrodes with the surface of the block be large as compared with the layer thickness. This reduces the actual contact resistance as compared with the resistance encountered by the current flowing laterally in the surface layer itself; i. e., the spreading resistance of the layer.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "When the collector electrode 6 is a single pointed wire or an evaporated metal spot, a fraction of the emitter current, after spreading out laterally in the P-type layer 3, eventually finds its way across the barrier 4 to the plated electrode 2 on the lower face of the block, i. e., to the base electrode. This situation is depicted in ",
      },
      figure("Fig. 3", "Fig. 3"),
      {
        kind: "text",
        text: " which is a plan view of the block showing current stream lines 13 diverging in all directions from the emitter. The current stream lines 13 are straight in the absence of the collector field. When the collector field 14 is present the current field is distorted as in ",
      },
      figure("Fig. 3a", "Fig. 3a"),
      {
        kind: "text",
        text: " which shows that even with a single collector electrode 6 more than half of the emitter current can be collected. In fact, the fraction of the emitter current which reaches the collector may in favorable cases be as high as 90 per cent.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "To increase this ratio, especially in the case of units in which this ratio is less favorable, requires a modified electrode arrangement. Obviously, if the strong field 14 surrounding the collector 6 were to overlap or include the emitter 5, substantially all of the emitter current would be collected. This, however, would involve a loss of control. A solution is to provide two collectors 6, 6a, as in ",
      },
      figure("Fig. 4", "Fig. 4"),
      { kind: "text", text: ", or three 6, 6a, 6b, as in " },
      figure("Fig. 5", "Fig. 5"),
      {
        kind: "text",
        text: ", symmetrically disposed about the emitter 5. Evidently with such an arrangement a considerably greater fraction of the emitter current is collected. In each case the boundaries of the collector field are indicated by broken lines 14. The several collectors may be connected together and as many may be employed as may seem desirable.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Pursuing this solution still further leads to the ring collector 6d of ",
      },
      figure("Fig. 6", "Fig. 6"),
      {
        kind: "text",
        text: ", in which case the collector field 14 bears the shape of a semitorus. Its trace on the plane of the block surface is shown by the broken lines 14a, 14b. The two semicircular spots 6e, 6f, of ",
      },
      figure("Fig. 7", "Fig. 7"),
      { kind: "text", text: " are the substantial equivalent of the circle of " },
      figure("Fig. 6", "Fig. 6"),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "Further increase may be made in the effective resistance of the barrier 4 and therefore in the internal resistance of the emitter-base electrode circuit and of the ratio of the collector current to the emitter current by restricting the area of the barrier 4 itself to a comparatively small region surrounding the emitter 5 and the collector 6. This may be accomplished by restricting the area of the block 1 which is subjected to the anodic oxidation treatment or by machining the block after treatment. In the former case the result is a bowl-shaped P-layer 3′, bounded by a bowl-shaped barrier 4′, as shown in ",
      },
      figure("Fig. 11", "Fig. 11"),
      {
        kind: "text",
        text: ", and in the latter case it is a block 1′ having the form of a truncated pyramid, with the barrier 4″ close to the smallest face, as indicated in ",
      },
      figure("Fig. 10", "Fig. 10"),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "In the event that the spring feature is not desired for the emitter and collector contact points, various alternative structures may be employed. For example, two sides of a wedge-shaped piece of insulating material 16 may be plated with metal films as in ",
      },
      figure("Fig. 8", "Fig. 8"),
      {
        kind: "text",
        text: ", one 51 to serve as emitter and the other 61 as collector. Or a cone-shaped piece 17 may be plated over its conical surface and a wire inserted through a central hole as in ",
      },
      figure("Fig. 9", "Fig. 9"),
      {
        kind: "text",
        text: ". The central wire 52 is preferably employed as the emitter and the surrounding plate film 62 as collector. The cone and the wedge serve to hold the interelectrode capacities to a minimum while keeping the contacts close together where they bear against the surface of the semiconductor.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Further understanding of the considerations which govern the thickness of the P-type surface layer may be had from the following considerations, which apply specifically to a chemical layer. ",
      },
      figure("Fig. 13", "Fig. 13"),
      {
        kind: "text",
        text: " is a plot of the electrostatic potential within the body of an N-type semiconductor in contact with a metal. As above stated, the N-type material of the semiconductor contains fixed or bound positive charges. They are believed to be distributed with fair uniformity in depth to a certain distance, beyond which the material is electrically neutral, because the bound positive charges are balanced by equal negative (electron) charges. In accordance with Poisson’s equation:",
      },
    ]),
    { kind: "equation", text: "d²V/dx² = −4πρ/ε     (2)" },
    p(
      text(
        "where V is the potential; x is the distance, measured from the metal into the semiconductor; ρ is the charge density, and ε is the dielectric constant of the material.",
      ),
    ),
    p(
      text(
        "Assuming the charge density ρ to be uniform, two integrations give the potential as a function of depth. When plotted, it is a parabola. In the figure, negative potential has been plotted upward. The vertical rise Ee from the Fermi level to the terminus of the curve, i. e., to its intercept with the potential axis, represents the energy which must be imparted to an electron to cause it to move from the metal to the semiconductor. These matters are fully explained in the literature, for example, in “Schottky’s Theories of Dry Solid Rectifiers,” by J. Joffe, published in “Electrical Communication,” vol. 22 (1944–1945) at page 217.",
      ),
    ),
    p([
      { kind: "text", text: "Similarly " },
      figure("Fig. 14", "Fig. 14"),
      {
        kind: "text",
        text: " shows the potential distribution, for positive holes, within a P-type semiconductor in contact with a metal. In this case the height Eh of the terminus of the curve from the Fermi level represents the energy which must be given to a positive hole to cause it to leave the metal and enter the semiconductor.",
      },
    ]),
    p([
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: " is a composite diagram showing, in the upper curves, the electron energy and in the lower curves the hole energy, within a semiconductor which comprises a thin layer of P-type material separated from a body of N-type material by a barrier. The fixed charges are negative in the P-type material and positive in the N-type, and for simplicity are assumed to be distributed uniformly in each zone. Integration of the charge density, twice, in accordance with Poisson’s equation gives the lowermost curves, a, b of the two groups, which represent equilibrium conditions and which, but for an additive constant Eg, are alike. The constant Eg represents the energy difference between the filled band and the conduction band for the particular material. The middle curves a₁, b₁, of each group represent the conditions when a small negative bias is applied to the semiconductor block 1 with respect to the emitter 5, and the upper curves a₂, b₂, of each group represent the conditions when a signal applied between the emitter and the control electrode further reduces the potential of the block. Evidently the alteration of the block potential with respect to the emitter operates in each case to increase the effective thickness of the P-type layer and so the density of holes and the layer conductivity. Such an increase in conductivity with increase in the forward bias has been observed in connection with the potential probe measurements referred to above.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The rounded peak of the hole potential curve lies below the Fermi level. The greater the thickness of the P-type layer, the more the terminus of this curve falls below the Fermi level, i. e., the greater the magnitude of Eh, and the greater the difficulty for holes to leave the metal of the emitter and enter the semiconductor. Similarly, the thinner the P-type layer, the less is the magnitude of Eh, and the greater the ease with which holes move from the metal of the emitter to the semiconductor and enter it. On the other hand, if the P-type layer is too thin, the conductivity of the layer, which is related to the width of the approximately flat portion of the upper part of the curve b₁ of ",
      },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: " will be small. In the vicinity of the collector electrode, the thickness of the P-type layer should be sufficiently small so that the rectification characteristic of the collector is determined primarily by the body of the semiconductor and not by the layer. If, now, the collector is biased in the reverse direction relative to the body, most of the drop from the high voltage on the electrode occurs in the immediate vicinity of the collector, so that the impedance of the collector circuit is high.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The P-type layer is preferably adjusted to an optimum thickness lying between these extremes. Best results are believed to be obtained when its thickness is such that the terminus of the curve falls slightly below the rounded peak. Holes can enter the semiconductor without great difficulty, and tend to collect in the region of greatest negative potential as a cloud of mobile positive charges. They then diffuse away from the emitter—laterally in ",
      },
      figure("Fig. 1", "Fig. 1"),
      { kind: "text", text: ", perpendicular to the paper in " },
      figure("Fig. 15", "Fig. 15"),
      { kind: "text", text: "—some of them entering the field 14 of the collector 6." },
    ]),
    p(
      text(
        "Because the right-hand part of the lower curve falls well below the left-hand part, positive holes can cross the barrier only with difficulty. Because the P-type layer is thin, the energy Eh, required to cause holes to enter the layer, is small. Therefore holes enter easily under the influence of the positive bias on the emitter 5 and collect in the layer, like air bubbles as it were, at the top of a liquid in a closed vessel. They may easily travel in the layer and parallel with it.",
      ),
    ),
    p(
      text(
        "The sense in which, and the reason why the barrier exists, separating a region of P-type conductivity from a region of N-type conductivity, despite the fact that the semiconductor material itself may be chemically and stoichiometrically uniform, may be explained as follows:",
      ),
    ),
    p(text("From the elementary considerations, the conductivity is given by")),
    { kind: "equation", text: "C = n₁e₁μ₁ + n₂e₂μ₂     (3)" },
    p(
      text(
        "where n₁, e₁, μ₁ are the electron density, the electronic charge, and the electron’s mobility, respectively, and n₂, e₂, μ₂ are the corresponding quantities for positive holes.",
      ),
    ),
    p(text("It is known that")),
    { kind: "equation", text: "n₁ = A₁e^(−eVₑ/KT)     (4a)" },
    { kind: "equation", text: "n₂ = A₂e^(eVₕ/KT)     (4b)" },
    p([
      { kind: "text", text: "where Ve is the height of the electron space potential curve (a of " },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: ") above the Fermi level, and Vh is, correspondingly, the height of the Fermi level above the hole space potential curve (b of ",
      },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: ") and A₁, A₂, K, and T are constants for a given temperature. Inasmuch as the potential difference between the two kinds of space potential curves is a constant Eg, the conductivity may be written",
      },
    ]),
    {
      kind: "equation",
      text: "C = A₁μ₁e₁e^(−eVₑ/KT) + A₂μ₂e₂e^(e(Eg−Vₑ)/KT)     (5)",
    },
    p(
      text(
        "Since the factor A₁μ₁e₁ does not differ greatly in magnitude from the factor A₂μ₂e₂, it is a simple matter of calculation to show that this expression is a minimum when",
      ),
    ),
    { kind: "equation", text: "Vₑ = Vₕ = Eg/2     (6)" },
    p([
      {
        kind: "text",
        text: "i. e., that the resistivity of the material is greatest at the depth at which the a curves and the b curves of ",
      },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: " lie at equal distances above and below the Fermi level, respectively; and that, furthermore, the resistivity departs rapidly from this maximum value as the space potentials Ve and Vh depart from equality. If Ve < Eg/2, the electron conductivity is greater than the hole conductivity, and the conductivity is N-type. If Ve > Eg/2, or Vh < Eg/2, the hole conductivity is greater than the electron conductivity, and the conductivity is P-type.",
      },
    ]),
    p([
      figure("Fig. 16", "Fig. 16"),
      {
        kind: "text",
        text: " is a three dimensional representation of the conditions which the holes encounter in the course of their travel in the layer from the emitter to the collector—in the figure, parallel with the Y axis. As in ",
      },
      figure("Fig. 15", "Fig. 15"),
      {
        kind: "text",
        text: ", the X axis represents depth measured into the semiconductor and the V axis which is drawn to an approximately logarithmic scale, represents negative potential. As the holes approach the collector the peak of the potential curve becomes less and less pronounced until finally, at the collector, the region of lowest potential, to which the holes flow, is the collector itself, where they are withdrawn.",
      },
    ]),
    p(
      text(
        "Of that part of the emitter current which crosses the barrier, a certain fraction crosses it again in the vicinity of the collector and is collected, thus forming a part of the collector current. The foregoing hypothesis as to the mechanism by which amplification is obtained applies to this fraction of the current as well as to the fraction which proceeds entirely within the layer.",
      ),
    ),
    p(
      text(
        "The collector current contains still another component, which consists of a flow of electrons from the collector to the base electrode, crossing the barrier once on its way. A hypothesis as to the manner in which this current component takes part in the amplification process is as follows:",
      ),
    ),
    p([
      {
        kind: "text",
        text: "There is a potential hill at the contact point between the collector electrode and the surface layer which offers an impedance to the flow of electrons from the electrode into the semiconductor. In the absence of bias, the height of this hill, indicated by Ee in ",
      },
      figure("Fig. 13", "Figs. 13"),
      { kind: "text", text: " and " },
      figure("Fig. 15", "15"),
      {
        kind: "text",
        text: ", is the energy required to take an electron from the metal and place it in the conduction band of the semiconductor. When the collector is biased in the reverse direction, the effective height of the hill, and so the impedance of the contact point, are reduced by the electric field across the layer and barrier which acts in such a direction as to pull electrons from the electrode. The effect is to increase the flow of electrons into the semiconductor in a way which is similar to the enhancement of current from a thermionic cathode by field-induced emission. When the emitter is connected, and a current of holes flows to the collector, the accumulation of the positive charges of these holes in the vicinity of the collector tends to make the potential fall more rapidly with depth into the material, and so results in an increase in field and a decrease in the effective height of the hill, i. e., in the impedance of the contact point. Thus any increase in that component of the collector current which originates at the emitter is accompanied by a corresponding increase in the other component of the collector current, namely, in the flow of electrons to the base electrode. Hence the total change in collector current may be greater than the change in the emitter current.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "From the foregoing description it will be clear that if it is desired to employ a semiconductor block of which the main body is of P-type so that the conductivity of the thin surface layer, whether due to impurities or to space charge effects, is of N-type, the polarities of all the bias sources of ",
      },
      figure("Fig. 1", "Figs. 1"),
      { kind: "text", text: ", " },
      figure("Fig. 10", "10"),
      { kind: "text", text: ", " },
      figure("Fig. 11", "11"),
      { kind: "text", text: " and " },
      figure("Fig. 12", "12"),
      {
        kind: "text",
        text: " are to be reversed. It is also to be understood that the magnitudes of the biases for best operation will depend on the semiconductor material employed and on its heat treatment and processing. Furthermore, it is possible to use a P-type layer of one semiconductor material on an N-type body of some other semiconductor material or vice versa. All such variations are contemplated as being within the spirit of the invention.",
      },
    ]),
    p(
      text(
        "The invention is not to be construed as limited to the particular forms disclosed herein, since these are to be regarded as illustrative rather than restrictive.",
      ),
    ),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    claim(
      1,
      "A circuit element which comprises a block of semiconductive material of which the body is of one conductivity type and a thin surface layer is of the opposite conductivity type, an emitter electrode making contact with said layer, a collector electrode making contact with said layer disposed to collect current spreading from said emitter electrode, and a base electrode making contact with the body of the block.",
    ),
    claim(
      2,
      "Apparatus as defined in claim 1 wherein the surface layer is of the same chemical material as the block.",
    ),
    claim(3, "Apparatus as defined in claim 1 wherein the block is of germanium."),
    claim(
      4,
      "Apparatus as defined in claim 1 wherein the block is of N-type germanium and the surface layer of P-type germanium.",
    ),
    claim(
      5,
      "Apparatus as defined in claim 1 wherein the block is of high back voltage germanium and to at least a part of one surface of which an anodic oxidation treatment has been applied.",
    ),
    claim(
      6,
      "A circuit element which comprises a semiconductive supporting body, a thin surface layer of semiconductor material supported by and in electrical contact with said body and differing in conductivity type therefrom, an emitter electrode making contact with said layer, a collector electrode in contact with a different part of the element from the part contacted by said emitter electrode and disposed to collect current spreading from said emitter electrode, and a base electrode making contact with the body.",
    ),
    claim(
      7,
      "Apparatus as defined in claim 6 wherein the area of contact of the emitter electrode with the semiconductor layer is large compared with the layer thickness.",
    ),
    claim(8, "Apparatus as defined in claim 6 wherein the emitter electrode is a point contact."),
    claim(
      9,
      "Apparatus as defined in claim 6 wherein the emitter electrode and the collector electrode are point contacts.",
    ),
    claim(
      10,
      "Apparatus as defined in claim 6 wherein the emitter electrode and the collector electrode make rectifier contact with the body by way of the semiconductor layer.",
    ),
    claim(
      11,
      "Apparatus as defined in claim 6 wherein the collector electrode is spaced from the emitter electrode by a distance of the order of 1 to 2 mils.",
    ),
    claim(
      12,
      "Apparatus as defined in claim 6 wherein the collector electrode is spaced from the emitter electrode by a distance which is small compared with the semiconductor layer area but large compared with the layer thickness.",
    ),
    claim(
      13,
      "Apparatus as defined in claim 6 wherein the semiconductive supporting body is separated from the surface layer by a high resistance barrier, and wherein the base electrode makes contact with said body over a wide area of a surface thereof which is opposite to the surface bearing the semiconductive layer.",
    ),
    claim(
      14,
      "In combination with apparatus as defined in claim 6, means for biasing the emitter electrode with respect to said semiconductive layer in a sense to supply charges thereto of the sign for which the layer is conductive, and means for biasing the collector electrode to collect charges of the same sign.",
    ),
    claim(
      15,
      "In combination with apparatus as defined in claim 6, a work circuit interconnecting the collector electrode with the base electrode, and connections for applying a signal voltage between the emitter electrode and the base electrode.",
    ),
    claim(
      16,
      "A circuit element which comprises a block of semiconductor material characterized by fixed charges of one sign and having a thin surface layer, separated from the main body of the block by a high resistance barrier, characterized by mobile charges of the same sign, a base electrode in contact with said body, an emitter electrode in contact with said layer, a potential source connected to said base electrode and to said emitter electrode to bias said emitter electrode in a sense to supply mobile charges of the same sign to said layer, a collector electrode in contact with said layer, and a potential source connected to said base electrode and to said collector electrode to bias said collector in a sense to establish an electric field across said layer between said collector electrode and fixed charges in the body of said block.",
    ),
    claim(
      17,
      "A circuit element which comprises a semiconductive body, a thin surface layer of semiconductive material separated from said body by a high impedance conducting barrier, at least two electrodes, of which one is a sharp point of conductive material, in close-spaced contact with said surface layer, and a third electrode in contact with said body.",
    ),
    claim(
      18,
      "A circuit element which comprises a block of semiconductor material, an electrode making low resistance contact with a part of the surface of the block, a plurality of electrodes making rectifier contact with other parts of the surface of the block, connections including said first-named electrode for applying a forward direction bias to one of said rectifier contact electrodes, and connections including said first-named electrode for applying a reverse direction bias to another of said rectifier contact electrodes.",
    ),
    claim(
      19,
      "A circuit element which comprises a block of semiconductor material, an electrode making low resistance contact with a part of the surface of the block, a plurality of electrodes making rectifier contact with other parts of the surface of the block, connections including said first-named electrode for applying a smaller forward direction bias to one of said rectifier contact electrodes, and connections including said first-named electrode for applying a larger reverse direction bias to another of said rectifier contact electrodes.",
    ),
    claim(
      20,
      "A circuit element which comprises a block of semiconductor material, an electrode making low resistance contact with a part of the surface of the block, a plurality of electrodes making rectifier contact with other parts of the surface of the block and spaced apart by a distance which is not greater than the smallest dimension of the block, connections including said first-named electrode for applying a smaller forward direction bias to one of said rectifier contact electrodes, and connections including said first-named electrode for applying a larger reverse direction bias to another of said rectifier contact electrodes.",
    ),
    claim(
      21,
      "In combination, a block of semiconductive material, a collector electrode making rectifier contact therewith, a second electrode connected to said block, a circuit including a source of voltage and a load connected to said collector electrode and to said second electrode, said source being so poled as to draw reverse current from the block through said contact, and another electrode making rectifier contact with the block and disposed to control the magnitude of the current from the block through said first contact.",
    ),
    claim(
      22,
      "The combination recited in the preceding claim in which said semiconductive material comprises germanium.",
    ),
    claim(
      23,
      "A translating device comprising a semiconductor, three electrodes in contact therewith, a high impedance output circuit including two of said electrodes and making a high-resistance reverse-rectifier contact therewith by way of one of said two electrodes, and a low impedance input circuit including one of the first two electrodes and the third electrode and making a low resistance forward-rectifier contact therewith by way of the third of said electrodes.",
    ),
    claim(
      24,
      "A circuit element which comprises a block of semiconductor material, an electrode making low resistance contact with a part of the surface of the block, an emitter electrode and a collector electrode making rectifier contact with other parts of the block, means for biasing the emitter electrode for conduction in the forward direction, means for biasing the collector electrode for conduction in the reverse direction, connections for applying a signal between the low resistance electrode and the emitter electrode to introduce a current of mobile charges into said block at low impedance by way of said emitter electrode, which charges are of signs opposite to the signs of the mobile charges normally present in excess in the semiconductor material under equilibrium conditions, connections for withdrawing said charges from said block at high impedance by way of said collector electrode, whereby the voltage across said collector electrode contact contains a component which is an amplified version of the signal voltage, said charges acting, by reason of their accumulation in the block in the vicinity of the collector electrode, to modify the impedance of its contact to current flowing from the low resistance contact electrode to the collector electrode, whereby the current drawn from the collector electrode contains a component which is an amplified version of the signal current.",
    ),
    claim(
      25,
      "A circuit element which comprises a block of semiconductive material of which the body is of one conductivity type while a thin surface layer is of the opposite conductivity type, an emitter electrode making contact with the surface layer, a collector electrode making contact with the surface layer and disposed to collect current spreading from the emitter electrode, a base electrode making contact with the body of the block, an input circuit including a source connected to the base electrode and to the emitter electrode, respectively, and an output circuit including a load connected to the base electrode and to the collector electrode, respectively.",
    ),
    claim(
      26,
      "A circuit element which comprises a block of semiconductive material of which the body is of one conductivity type while a thin surface layer is of the opposite conductivity type, an emitter electrode making contact with the surface layer, a collector electrode making contact with the surface layer and disposed to collect current spreading from the emitter electrode, a base electrode making contact with the body of the block, an input circuit including a source connected to the emitter electrode and to the base electrode, respectively, and an output circuit including a load connected to the emitter electrode and to the collector electrode, respectively.",
    ),
    claim(
      27,
      "A circuit element which comprises a block of semiconductive material of which the body is of one conductivity type while a thin surface layer is of the opposite conductivity type, an emitter electrode making contact with the surface layer, a collector electrode making contact with the surface layer and disposed to collect current spreading from the emitter electrode, a base electrode making contact with the body of the block, an input circuit including a source connected to the collector electrode and to the base electrode, respectively, and an output circuit including a load connected to the collector electrode and to the emitter electrode, respectively.",
    ),
    claim(
      28,
      "A translating device comprising a semiconductor, two rectifier contacts thereon, another contact thereon, a source of input current variations, a load, sources of bias voltage, a circuit extending between said other contact and the first of said rectifier contacts including at least said source of input current variations and one of said bias sources poled for forward rectifier current flow through said first rectifier contact, and a circuit extending from the other rectifier contact through said load to one of the two other mentioned contacts and including a source of bias voltage poled for reverse rectifier current flow through said other rectifier contact.",
    ),
    claim(
      29,
      "A translating device according to claim 28 in which said load is included between said other rectifier contact and said other contact.",
    ),
    claim(
      30,
      "A translating device according to claim 28 in which said load is included between said two rectifier contacts.",
    ),
    claim(
      31,
      "A translating device according to claim 28 in which said load is included between said two rectifier contacts and in which the first-mentioned circuit is connected to said first of said rectifier contacts independently of said load.",
    ),
    claim(
      32,
      "A translating device according to claim 28 in which said load is included in a circuit portion that is common to said two mentioned circuits, one terminal of said load being connected to said first of said two rectifier contacts.",
    ),
    claim(
      33,
      "A circuit element which comprises a block of semiconductor material, an emitter electrode making contact with the block, a region of the body of the block immediately under the contact and engaged by said emitter electrode being characterized by an inversion of conductivity type, a collector electrode disposed in engagement with the block to collect current flowing to the block by way of the emitter electrode, and a base electrode making contact with the body of the block to vary the magnitude of said current.",
    ),
    claim(
      34,
      "Apparatus as defined in claim 33 wherein said collector electrode makes reverse rectifier contact with the block.",
    ),
    claim(
      35,
      "In combination with apparatus as defined in claim 6, connections for feeding a current into said body by way of said emitter electrode, connections for withdrawing a current from said body by way of said collector electrode, said current being carried within said body from said emitter electrode to said collector electrode by carriers whose signs are opposite to the signs of the mobile charges normally present in excess in the material of the body under equilibrium conditions, and connections for applying a signal to be amplified between the emitter electrode and the base electrode, whereby the current withdrawn from the collector electrode contains a component which is an amplified version of said signal.",
    ),
    claim(
      36,
      "A circuit element as defined in claim 6 wherein the semiconductive supporting body has the form of a truncated pyramid and wherein the surface layer covers the smallest face of the pyramid.",
    ),
    claim(
      37,
      "A circuit element as defined in claim 6 wherein the body has at least one face of substantial area and wherein the thin surface layer occupies a small part of said one face.",
    ),
    claim(
      38,
      "A circuit element comprising a body of semiconductive material, which material normally contains an excess of mobile charges of one sign over mobile charges of the other sign, a base electrode making low resistance contact with said body, an emitter electrode making contact with said body at a region spaced from said base electrode, an input circuit connected between said base and emitter electrodes and including a source for biasing said emitter electrode with said other sign, thereby to inject into said body charges of said other sign, an output electrode connection to said body, and an output circuit connected between said output electrode connection and one of said emitter and base electrodes and including a source for biasing said output electrode connection with said one sign, thereby to withdraw from said body a current of charges of said other sign introduced into said body through said emitter electrode.",
    ),
    claim(
      39,
      "A signal translating device comprising a body of semiconductive material, which material normally contains an excess of mobile charges of one sign over mobile charges of the other sign, collector and base connections to said body, a source of input energy, means separate from said collector and base connections and including said source for applying to a region of said body spaced from said collector connection energy to establish in said region mobile electric charges of said other sign, and an output circuit connected between said collector and base connections, said output circuit including means for applying to said collector connection a bias of the polarity opposite to the sign of said established charges, thereby to attract to said collector connection said established charges.",
    ),
    claim(
      40,
      "A circuit element comprising a body of semiconductor material, one portion of which is of one conductivity type and another portion of which is of different conductivity type, an emitter electrode engaging the first portion of the body, a collector electrode engaging the body to collect current flowing to the body by way of said emitter electrode, and a base electrode providing a low-resistance connection to said other portion of the body to vary the magnitude of said current.",
    ),
    { kind: "heading", level: 2, text: "Signatures" },
    p(text("JOHN BARDEEN.")),
    p(text("WALTER H. BRATTAIN.")),
    { kind: "heading", level: 2, text: "REFERENCES CITED" },
    { kind: "heading", level: 3, text: "UNITED STATES PATENTS" },
    {
      kind: "table",
      headers: [text("Number"), text("Name"), text("Date")],
      rows: [
        [text("1,745,175"), text("Lilienfeld"), text("Jan. 28, 1930")],
        [text("1,900,018"), text("Lilienfeld"), text("Mar. 7, 1933")],
        [text("1,949,383"), text("Weber"), text("Feb. 27, 1934")],
        [text("2,173,904"), text("Holst"), text("Sept. 26, 1939")],
        [text("2,402,662"), text("Ohl"), text("June 25, 1946")],
        [text("2,438,893"), text("Bieling"), text("Apr. 6, 1943")],
        [text("2,441,603"), text("Storks et al."), text("May 18, 1948")],
        [text("2,447,829"), text("Whaley"), text("Aug. 24, 1948")],
        [text("2,464,807"), text("Hansen"), text("Mar. 22, 1949")],
      ],
    },
    { kind: "heading", level: 3, text: "FOREIGN PATENTS" },
    {
      kind: "table",
      headers: [text("Number"), text("Country"), text("Date")],
      rows: [[text("439,457"), text("Great Britain"), text("Dec. 6, 1935")]],
    },
    { kind: "heading", level: 2, text: "Certificate of Correction" },
    p(text("Patent No. 2,524,035. October 3, 1950. JOHN BARDEEN ET AL.")),
    p(
      text(
        "It is hereby certified that error appears in the printed specification of the above numbered patent requiring correction as follows: Column 6, line 54, for “ar” read are; column 8, line 73, for “and” read end; column 17, line 51, for the word “side” read sign; and that the said Letters Patent should be read as corrected above, so that the same may conform to the record of the case in the Patent Office.",
      ),
    ),
    p(text("Signed and sealed this 2nd day of January, A. D. 1951.")),
    p(text("[SEAL]")),
    p(text("THOMAS F. MURPHY, Assistant Commissioner of Patents.")),
  ],
};

/** Non-lossy reading companions for each source paragraph, keyed by block index. */
export const bardeenTransistorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: [
    "This records the application lineage only: the present grant continues an earlier, abandoned filing and does not claim that the abandoned application was itself a completed device.",
  ],
  5: [
    "This opening statement defines the subject broadly as translating electrical variations for amplification, wave generation, and related uses. It precedes the later material, contact, and bias limitations of the illustrated device.",
  ],
  6: [
    "The principal stated objective is practical amplification or translation using compact, simple, rugged apparatus. It is an object clause, not an independent claim that every signal translator is within the grant.",
  ],
  7: [
    "This second objective contrasts the source device with thermionic equipment: it requires neither a heated cathode nor an evacuated or gas-filled envelope, so it is immediately operative when switched on.",
  ],
  8: [
    "The source reviews earlier solid-rectifier amplifier proposals that put a grid-like electrode inside a dielectric layer. It says the necessary layer cannot both insulate the grid and remain thin enough to pass current between the other electrodes.",
  ],
  9: [
    "A second earlier proposal controlled the resistance of a homogeneous semiconductor strip with a transverse electrostatic field. The source says those devices could not be fabricated finely enough for amplification and were not commercially successful.",
  ],
  10: [
    "This paragraph establishes the carrier vocabulary used throughout the specification: conduction electrons and holes have opposite effective charges, and N-type or P-type names which mobile charge is normally in excess.",
  ],
  11: [
    "The source defines a rectifying contact by its preferred current direction. An N-type contact conducts readily when the semiconductor is negative relative to the metal; a P-type contact has the opposite sign convention.",
  ],
  12: [
    "Different semiconductor compositions can meet at a boundary, but so can different conductivity regions within chemically and stoichiometrically uniform material. The source therefore separates conductivity behavior from an automatic claim of differing material composition.",
  ],
  13: [
    "This is the core three-electrode arrangement: emitter and collector are rectifying contacts, the base is low resistance, forward emitter bias supplies opposite-sign carriers, and reverse collector bias draws a fraction into the collector.",
  ],
  14: [
    "Small emitter-voltage changes create larger changes in emitter and collector current. Because the collector contact has high internal impedance, the source says a matched high-impedance load can obtain voltage, current, and power amplification.",
  ],
  15: [
    "This form puts an opposite-type thin surface layer above the semiconductor body and separates it with a high-resistance rectifying barrier. Emitter current spreads laterally in the layer before the base returns it across the barrier.",
  ],
  16: [
    "The authors restate the transport mechanism: opposite-sign carriers injected under the emitter raise local conductivity, while the reverse-biased collector field draws current from its surrounding region and creates high collector impedance but low emitter impedance.",
  ],
  17: [
    "Input and output impedance are presented as design variables: semiconductor bulk and surface preparation set the contact behavior, while the selected bias potentials complete the operating choice.",
  ],
  18: [
    "The tube names describe external wiring analogies only. The source limits the correspondence to emitter with cathode, base with grid, and collector with anode; it does not make the solid-state device a vacuum tube.",
  ],
  19: [
    "Positive feedback returns part of the output in phase to the input. With an external frequency-selecting circuit, that loop can sustain oscillation; the authors cite that oscillation as an experimental confirmation of power amplification.",
  ],
  20: [
    "The authors next give a compact empirical description of the device, rather than claiming the relations are a complete microscopic theory. The following two displayed relations define the quantities used in their feedback interpretation.",
  ],
  23: [
    "The definitions distinguish the emitter current from the collector current and its disconnected-emitter value. They also state which electrode voltages are measured against the base and identify Rf, a, and the open-collector function f(Ve).",
  ],
  24: [
    "Equation 1 is read as positive feedback: collector current lowers the nearby surface potential, increasing the effective emitter bias by RfIc. That added emitter bias reinforces the current change rather than merely recording it.",
  ],
  25: [
    "This sentence introduces the drawings as part of the detailed embodiment. It does not claim that every later figure is a separate invention; the figures are the source's ordered evidence for one described form and its alternatives.",
  ],
  26: [
    "The first twelve figures distinguish the preferred device, its enlarged section and tube analogy, current-flow plans, alternative electrode layouts, and three external circuit uses. Each figure number remains a separate source-cited reference.",
  ],
  27: [
    "The final four figures are potential-distribution diagrams: N-type and P-type metal contacts, a thin P-type layer against N-type material, and the variation along the emitter-to-collector path. This completes the printed Fig. 1 through Fig. 16 guide.",
  ],
  28: [
    "This paragraph fixes the patent's material vocabulary. Significant impurities are those with electrical consequences, whether deliberately added or already present; germanium supplies the example, but silicon, cuprous oxide, and silicon carbide remain within the stated discussion.",
  ],
  29: [
    "Donors leave excess mobile electrons and acceptors leave mobile holes. The source explains both carrier types, their N-type or P-type classification, and the neutral-region relation between each mobile carrier concentration and the corresponding fixed ionized impurity concentration.",
  ],
  30: [
    "Space charge can make local conductivity differ from the impurity indication. The cited Schottky and Spenke account explains how a rectifying contact can create a high-resistance barrier and an opposite-type inversion region through electrostatic potential rather than a changed chemical composition.",
  ],
  31: [
    "Bardeen's cited surface analysis extends the rectifying-contact barrier to a free semiconductor surface. A uniformly donor-doped block can therefore carry a thin P-type surface layer without actual acceptor impurities in that layer.",
  ],
  32: [
    "The source distinguishes a physical layer or barrier, created by surface conditions, from a chemical layer or barrier, created by a variation in significant impurities. The distinction concerns cause, not merely the observed conductivity type.",
  ],
  33: [
    "This short conclusion states that either the surface-condition route or the impurity-variation route can provide a layer suitable for the invention; it does not prefer one as the only permissible embodiment.",
  ],
  34: [
    "The source permits an impurity-controlled silicon surface layer, but identifies its preferred worked material as high-back-voltage N-type germanium. The distinction is between a possible chemical-layer embodiment and the material actually used for the reported discovery.",
  ],
  35: [
    "This is a historical preparation sequence: reduction of germanium dioxide, controlled melting and directional solidification in helium, then cooling. It supplies the source's material provenance and does not claim that every later transistor must be produced by this route.",
  ],
  36: [
    "The stated low-temperature helium soak is a separate heat-treatment step after solidification, followed by cooling to room temperature before the material is selected and cut.",
  ],
  37: [
    "The preferred central zone is N-type germanium that can withstand 100 to 200 volts of reverse rectifier bias. The period phrase back voltage names this reverse-bias tolerance, not an operating collector voltage asserted for every device.",
  ],
  38: [
    "This block-preparation paragraph specifies cutting, two-stage grinding, an acid etch, and a plated low-resistance contact. Its numerical dimensions and chemical quantities describe the illustrated preparation, including a repeated etch when plating may contaminate the opposite face.",
  ],
  39: [
    "The anodic treatment gives a staged negative-bias schedule through an inert electrode in a viscous electrolyte. The source states the current densities and decay times so the treatment is a reproducible historical process rather than a generic claim that any oxide will work.",
  ],
  40: [
    "After the anodic treatment, the block is washed and dried. Vacuum and radiant heat are named as successful finishing methods, and spot electrodes may be evaporated during drying; this is the source's preparation path before electrical use.",
  ],
  41: [
    "The authors explicitly say the oxidation is optional. They report amplification after an etch without later surface treatment except electrical forming, so this example does not turn anodic oxidation into a universal prerequisite.",
  ],
  42: [
    "This continuous apparatus paragraph ties the figure to the prepared block: plated N-type base, thin P-type surface layer, rectifying barrier, and a springy point emitter. It also records the stated point-contact force and ductile-wire examples without replacing them with a modern junction fabrication account.",
  ],
  43: [
    "The collector is a second close, rectifying contact. The source gives the one-to-ten-mil spacing and two constructions: a spring wire or a pierced or slotted evaporated-metal spot, each tied to its own printed figure citation.",
  ],
  44: [
    "The third connection is the low-resistance base path through the plated lower film. This sentence fixes the historical connection point instead of treating base as an abstract circuit symbol.",
  ],
  45: [
    "Electrical forming applies a potential above peak back voltage to one or both point contacts through a series resistor. The stated explanation is localized field and heat that improve the contact; it is not presented as a complete microscopic proof.",
  ],
  46: [
    "The operating bias is asymmetrical: a small usually positive emitter bias and a larger negative collector bias, each referenced to the semiconductor body. The source gives the stated collector range and identifies the two batteries without collapsing them into a modern transistor bias convention.",
  ],
  47: [
    "This paragraph identifies the load and signal transformers, then distinguishes the three named tube analogies. The reported more-than-75 power gain belongs specifically to the grounded-base arrangement and the source cautions that its current path differs from a vacuum-tube grounded-grid circuit.",
  ],
  49: [
    "This reports the feedback experiment used to confirm power amplification. Returning output voltage through transformer 12 produced sustained oscillation, so the source treats oscillation as evidence of a loop with sufficient power gain.",
  ],
  50: [
    "For sample 1, the table’s power gain divided by voltage gain gives a current gain of 1.3. The calculation is an explicit inference from the listed operating data, not a claim that every sample has that current gain.",
  ],
  51: [
    "The authors mark this as a hypothesis, then relate their preparation and contact observations to a thin P-type layer, an N-type supporting body, and a barrier. They distinguish physical and chemical-layer explanations without pretending the layer’s chemical nature was settled.",
  ],
  52: [
    "With an open collector circuit, holes injected at the emitter spread in the surface layer and eventually reach the plated base path. The potential-probe result is the stated reason for treating the surface current as P-type rather than ordinary N-type bulk-electron current.",
  ],
  53: [
    "A reverse-biased collector creates a strong local field across the thin layer and barrier. The cited dimensions and 10-volt example give an order-of-magnitude field estimate; the fixed positive charge in the N-type body maintains that field near the collector.",
  ],
  54: [
    "High-back-voltage material is preferred because the collector region must support a substantial voltage drop. This is the material-selection reason supplied by the source, not a new independent circuit requirement.",
  ],
  55: [
    "The collector attracts laterally spreading holes into the external load while operating near saturation, which gives its circuit a high alternating-current impedance. A small emitter-base signal therefore changes collector current and produces an amplified load voltage.",
  ],
  56: [
    "The point contacts are deliberately broad relative to the thin surface layer. This lowers contact resistance compared with the lateral spreading resistance in that layer, preserving the source’s distinction between contact and sheet resistance.",
  ],
  57: [
    "The source’s plan views contrast straight hole-current stream lines without collector field and distorted lines with it. The field can collect more than half, and in favorable cases up to 90 percent, of the emitter current at a single collector.",
  ],
  58: [
    "Multiple symmetric collectors increase capture without allowing a single collector field to engulf the emitter, which would remove useful control. The field boundaries remain explicitly drawn as broken lines and the collectors may be tied together.",
  ],
  59: [
    "The ring collector and paired semicircular spots are source-described alternatives for extending the collector field. Their geometry is tied to the facsimile figures, not substituted with a later transistor layout.",
  ],
  60: [
    "Restricting the treated or machined region confines the high-resistance barrier around the emitter and collector. The source gives both a bowl-shaped treated layer and a truncated-pyramid geometry as ways to raise resistance and collector-current ratio.",
  ],
  61: [
    "The wedge and cone structures replace spring points with plated insulating forms while maintaining close electrodes and low interelectrode capacitance. The central wire and surrounding metal film retain the stated emitter and collector roles.",
  ],
  62: [
    "The potential plot for an N-type semiconductor explains how fixed positive charge and balancing electrons create a depth-dependent electrostatic potential. The displayed Poisson relation is part of the printed source argument for the chemical surface layer.",
  ],
  64: [
    "This is the source’s definition list for the Poisson-equation symbols: potential, distance into the semiconductor, charge density, and dielectric constant. It preserves the variables rather than treating the formula as decorative notation.",
  ],
  65: [
    "Assuming uniform charge density yields a parabolic potential curve. The vertical rise from the Fermi level is identified as the electron-transfer energy, with the cited Joffe article offered as the contemporary explanatory reference.",
  ],
  66: [
    "The companion hole-potential diagram defines Eh as the energy needed for a positive hole to leave the metal and enter the P-type semiconductor. It parallels, but does not duplicate, the preceding electron-potential case.",
  ],
  67: [
    "The composite figure joins electron and hole energy curves for a thin P-type layer against N-type material. Bias shifts the curves, changing effective layer thickness, hole density, and conductivity in the direction reported by the probe measurements.",
  ],
  68: [
    "The layer must be thick enough to conduct laterally but thin enough to admit holes readily and let collector rectification be dominated by the supporting body. Reverse collector bias localizes most voltage drop near the collector and keeps its impedance high.",
  ],
  69: [
    "The preferred layer thickness lies between poor injection and poor lateral conduction. Holes gather near the potential peak and diffuse outward; the source explicitly locates their spreading in the two figure geometries before some enter the collector field.",
  ],
  70: [
    "The source explains that the barrier impedes hole crossing while a thin P-type layer still permits easy entry from the positively biased emitter. The air-bubble comparison is the historical text’s own analogy for accumulation and lateral motion.",
  ],
  71: [
    "This paragraph frames the remaining mathematical treatment: a P-type region can be separated from an N-type region even where the semiconductor’s chemical composition and stoichiometry are uniform, so the barrier is an electrical-state phenomenon.",
  ],
  72: [
    "The conductivity expression separates electron and positive-hole contributions. Its variables define carrier density, charge, and mobility for each carrier population rather than reducing the result to a modern shorthand conductivity label.",
  ],
  74: [
    "This definition list identifies the electron and hole densities, charges, and mobilities that appear in the conductivity equation. It keeps the two carrier populations distinct, as the historical explanation requires.",
  ],
  75: [
    "The two exponential relations describe the equilibrium carrier populations that feed the conductivity calculation. They are printed as part of the physical explanation, not asserted as separate patent claims.",
  ],
  78: [
    "Ve and Vh are defined geometrically relative to the Fermi level and the two Figure 15 curves. The constant Eg lets the source rewrite conductivity using one potential variable while keeping the two carrier contributions explicit.",
  ],
  80: [
    "The rewritten conductivity expression makes the competing electron and hole terms visible in one equation. The accompanying text then seeks the potential depth at which the material’s resistivity reaches its maximum.",
  ],
  82: [
    "Equal electron and hole potential heights give the maximum-resistivity point. Departing to either side changes which carrier contribution dominates, yielding the source’s N-type or P-type conductivity classification.",
  ],
  83: [
    "The three-dimensional diagram follows holes from emitter toward collector. The potential peak diminishes near the collector until the collector itself is the lowest-potential withdrawal point, tying the energy picture back to current collection.",
  ],
  84: [
    "Some emitter-originated current crosses the barrier and then crosses back near the collector, becoming collector current. The authors state that their amplification hypothesis covers this path as well as current that remains entirely in the surface layer.",
  ],
  85: [
    "A second collector-current component is electron flow from collector to base across the barrier once. The next paragraph gives the source’s proposed mechanism by which this component changes together with emitter-originated collector current.",
  ],
  86: [
    "The collector contact has an electron-energy hill whose reverse-bias field lowers its effective height. Accumulated holes steepen the potential fall, further lower contact impedance, and therefore make the electron-to-base component rise with the emitter-originated component.",
  ],
  87: [
    "The authors permit the conductivity types and bias polarities to be reversed, and permit different semiconductor materials for the layer and body. They retain the dependence of best bias on material and processing while declaring these variants within the invention’s spirit.",
  ],
  88: [
    "This is the formal non-limitation sentence immediately before the claims. It preserves the distinction between the disclosed examples and the legal scope to be defined by the following numbered claims.",
  ],
  131: [
    "This printed signature identifies John Bardeen as a named inventor on the grant. It is preserved as formal patent matter, not treated as an editorial attribution added by the archive.",
  ],
  132: [
    "This printed signature identifies Walter H. Brattain as the other named inventor on the grant. The source face keeps the signature distinct from the later correction certificate’s administrative signature.",
  ],
  139: [
    "This correction-certificate masthead identifies the affected patent, its printed date, and the inventor group. It begins a formal correction record rather than a new specification paragraph or claim.",
  ],
  140: [
    "The certificate directs three exact readings of the printed specification: column 6 substitutes are for an, column 8 substitutes and for and, and column 17 substitutes sign for side. The historical source must be read subject to those stated corrections.",
  ],
  141: [
    "This is the certificate’s sealing date. It records the Patent Office action on January 2, 1951, after the October 3, 1950 patent date shown in the certificate heading.",
  ],
  142: [
    "The facsimile prints a seal marker beneath the certificate. It is retained as formal documentary matter even though it carries no additional specification prose.",
  ],
  143: [
    "Thomas F. Murphy is printed as Assistant Commissioner of Patents beneath the certificate. This is the official administrative signature line for the correction certificate, not an inventor signature.",
  ],
};
