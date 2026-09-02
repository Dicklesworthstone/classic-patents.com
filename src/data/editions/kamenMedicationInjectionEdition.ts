import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const words = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: words(value),
});
const term = (text: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});
type FigureNumber = 1 | 2 | 3 | 4 | 5 | 6;

const figurePreview = (number: FigureNumber, width: number, height: number) => ({
  src: `/patents/figures/us-3858581-kamen-medication-injection-device/fig-${number}-source-crop-v2.png`,
  alt: `Source-facsimile crop of FIG. ${number} from US 3,858,581.`,
  width,
  height,
});

const FIGURES = {
  1: figurePreview(1, 8700, 3400),
  2: figurePreview(2, 9000, 3250),
  3: figurePreview(3, 8700, 4200),
  4: figurePreview(4, 4000, 4200),
  5: figurePreview(5, 4300, 3200),
  6: figurePreview(6, 8500, 7300),
} as const;

const figure = (
  number: FigureNumber,
  sourceText: string = `FIG. ${number}`,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for FIG. ${number} in US 3,858,581`,
  figurePreviews: [FIGURES[number]],
});

const figureGroup = (
  sourceText: string,
  numbers: readonly FigureNumber[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: sourceText,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crops for ${sourceText} in US 3,858,581`,
  figurePreviews: numbers.map((number) => FIGURES[number]),
});

/** A continuous manual edition checked against the eight-page US 3,858,581 facsimile. */
export const kamenMedicationInjectionArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "[11] 3,858,581",
        "Kamen [45] Jan. 7, 1975",
        "[54] MEDICATION INJECTION DEVICE",
        "[76] Inventor: Dean Kamen, 99 Bulsar Rd., Rockville Centre, N.Y. 11570",
        "[22] Filed: July 2, 1973",
        "[21] Appl. No.: 375,955",
        "[52] U.S. Cl. 128/218 A, 128/DIG. 1",
        "[51] Int. Cl. A61m 5/20",
        "[58] Field of Search 128/2 R, 2.05 R, 218 R, 128/218 A, 214 E, 214 F, DIG. 1, 234, 236",
        "[56] References Cited",
        "Primary Examiner—Dalton L. Truluck",
        "Attorney, Agent, or Firm—Bauer & Amer",
        "[57] ABSTRACT",
      ],
    },
    paragraph(
      words(
        "A medication-administering device controlled for repetitive delivery, by intravenous injection or otherwise, of predetermined syringe volumes of said medication at present time intervals, wherein the syringe plunger medication injection stroke is achieved using a powering motor, and the control exercised over the mode of operation of the device is related to the rotational traverses of said motor. This minimizes non-uniform performance and other shortcomings which characterize prior art medication injection devices in which the performance of the powering motors are vulnerable to variances due to varying line voltage, changing work loads (i.e. medication with different viscosities) and the like.",
      ),
    ),
    paragraph(words("5 Claims, 6 Drawing Figures")),
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 2",
      description: [
        { kind: "text", text: "PATENTED JAN 7 1975  3,858,581  " },
        figure(1, "FIG.1"),
        { kind: "text", text: "  " },
        figure(2, "FIG.2"),
        { kind: "text", text: "  " },
        figure(3, "FIG.3"),
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 2",
      description: [
        { kind: "text", text: "PATENTED JAN 7 1975  3,858,581  " },
        figure(4, "FIG.4"),
        { kind: "text", text: "  " },
        figure(5, "FIG.5"),
        { kind: "text", text: "  " },
        figure(6, "FIG.6"),
      ],
    },
    { kind: "heading", level: 2, text: "MEDICATION INJECTION DEVICE" },
    paragraph(
      words(
        "The present invention relates to improvements in a medication injection device, and more particularly to an automatic medication-injecting or administering device readily capable of dispensing medication in accordance with any selected schedule of successive intervals of operation and non-operation of a syringe-driving or powering motor.",
      ),
    ),
    paragraph([
      figureGroup("FIGS. 1-3", [1, 2, 3]),
      {
        kind: "text",
        text: " show the general organization of the mechanical parts of a medication injection device, generally designated 10. The device includes a syringe 12 of the type having a plunger 14, the linear displacement of which dictates the amount dispensed from the syringe chamber through tubing 15. Arranged to cause linear displacement of the plunger 14 is an upstanding head 16 of a follower 18, which has a threaded member mounted on a lead screw 22 powered in rotation by a motor 24.",
      },
    ]),
    paragraph([
      { kind: "text", text: "The lead screw 22 has threads 26 of " },
      term(
        "uniform pitch",
        "The source says the screw threads repeat at a constant advance per rotation. It does not state that pitch numerically, authorize a dose calibration here, or supply a clinical delivery rate.",
      ),
      {
        kind: "text",
        text: " machined along its length and is disposed substantially parallel to the path of linear displacement of the plunger 14. A body element of the follower is prevented from rotating simultaneously with the lead screw, so the threaded member advances along the screw.",
      },
    ]),
    paragraph([
      { kind: "text", text: "As illustrated in " },
      figure(2, "FIG. 2"),
      {
        kind: "text",
        text: ", scale 62 is laid out in ascending numbers corresponding to distances of advancement produced by the uniform thread pitch 26. The source uses the scale to relate a selected number of rotational traverses to the linear position of the follower; it is not a current clinical instruction.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "A radially oriented striker 80 is driven in rotation simultaneously with the lead screw 22. Physical contact with switch contact arm 82 during each rotational traverse actuates switch 84 and produces an electric pulse for a ",
      },
      term(
        "pulse-counting circuit",
        "A circuit receiving the source-described rotation-triggered electrical pulses and using their count to control motor operation. The patent does not provide a contemporary safety or software specification.",
      ),
      {
        kind: "text",
        text: " on printed circuit board 86. The circuit causes commencement of motor operation and continued operation for a selected number of pulses.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The electrical components provide resetting of the motor-on timer, termination of the powering motor, and starting of the motor-off timer. ",
      },
      figure(6, "FIG. 6"),
      {
        kind: "text",
        text: " illustrates an exemplary circuit with pulse counters whose outputs are activated in succession. During motor operation, the striker's contact with switch 84 produces the pulses counted by the motor-on timer.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "The source also describes a safety feature disconnecting the drive between motor 24 and lead screw 22 after reverse resistance. A ",
      },
      term(
        "clutch",
        "A mechanical coupling that can disconnect the motor from the screw drive when the source-described limited linear movement occurs. This historical description is not a validated pressure alarm or medical safety recommendation.",
      ),
      {
        kind: "text",
        text: " 136 of shaft coupling 90 breaks its driving connection between driving and driven elements and discontinues the driving connection.",
      },
    ]),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    claim(
      1,
      "A medication injection device comprising a syringe for dispensing medication in accordance with linear displacement of a plunger thereof, means secured to said syringe for connection to a patient for dispensing said medication to said patient, a rotatively mounted lead screw with threads of uniform pitch disposed in substantially parallel relation to the linear displacement path of said syringe plunger, pushing means mounted on said lead screw for advancement therealong in pushing engagement with said syringe plunger, a motor operatively arranged to power said lead screw in rotation to cause advancement of said pushing means and corresponding linear displacement of said syringe plunger, a radially oriented striker mounted on said lead screw, a pulse-emitting switch located adjacent said lead screw in the path of the rotational traverse of said striker so as to be engaged thereby to cause an emission of an electrical pulse during each rotation of said lead screw, and a pulse-counting means electrically connected to receive the transmission of each aforesaid pulse and operatively connected to permit the operation of said motor for the duration of the transmission thereto of a selected number of said pulses, whereby medication is dispensed in accordance with the linear displacement of said syringe plunger as a function of the number of rotational traverses of said lead screw as counted by said pulse-counting means.",
    ),
    claim(
      2,
      "A medication injection device as defined in claim 1 including an additional timing means operatively connected to said motor to cause the commencement of the operation thereof after a selected interval of non-operation, whereby said medication is dispensed by said device in accordance with a selected schedule of successive intervals of operation and non-operation of said motor.",
    ),
    claim(
      3,
      "A medication injection device as defined in claim 2 including a clutch interposed in the drive connection between said motor and said lead screw, and including means mounting said lead screw for selected limited linear movement for disengaging the same from said clutch to thereby terminate the powering rotation of said lead screw by said motor, whereby said dispensing of medication by said device is capable of being terminated in an emergency situation.",
    ),
    claim(
      4,
      "A medication injection device as defined in claim 2 wherein said additional timing means is of the type operated by pulses transmitted to it as is also said pulse-counting means, and further including a visual signaling device connected to be operated by each pulse being transmitted to said additional timing means and to said pulse-counting means, whereby the operation of said visual signal device is effective in indicating the working condition of said medication injection device.",
    ),
    claim(
      5,
      "A medication injection device as defined in claim 4 including a scale calibrating linear displacement of said syringe plunger with an ascending number of pulses produced during said rotational operation of said motor, whereby the volume of medication to be dispensed can be readily related to a selected number of pulses as counted by said pulse-counting means.",
    ),
  ],
};

export const kamenMedicationInjectionParallelReadings: Record<number, readonly string[]> = {
  4: [
    "The source frames the device as a motor-driven, intermittently scheduled injection mechanism. That historical scope should not be mistaken for a present-day medication recommendation or a validated clinical protocol.",
  ],
  5: [
    "The basic mechanical chain is syringe plunger, follower, lead screw, and motor. The legal claims later add rotation sensing and counting, so the mechanism is more than a generic motorized plunger.",
  ],
  6: [
    "A uniform-pitch screw makes repeated rotations correspond to repeated linear advances in the follower. The patent does not print the pitch or enough source data to turn that relationship into a safe numerical dose calculation.",
  ],
  7: [
    "Figure 2 makes the historical link between screw rotations and a scale visible. The edition preserves that source relationship while the interactive exhibit avoids reproducing a clinical amount or schedule.",
  ],
  8: [
    "The striker and switch translate one mechanical rotation into one electrical pulse. The pulse counter is the claimed bridge between screw motion and the motor's commanded operating interval.",
  ],
  9: [
    "The timers create a repeating on/off sequence and Figure 6 explains the old electronic logic. The source gives a circuit arrangement, not modern control software, alarm behavior, or clinical safety validation.",
  ],
  10: [
    "The clutch arrangement is a mechanical disengagement feature under the source's stated reverse-resistance condition. It does not allow the museum to claim a pressure threshold or certify medical safety performance.",
  ],
};
