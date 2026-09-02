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
type FigurePreview = {
  src: string;
  alt: string;
  width: number;
  height: number;
};
const figurePreview = (
  label: "FIG. 1" | "FIG. 2" | "FIG. 3" | "FIG. 4" | "FIG. 5" | "FIG. 6",
  width: number,
  height: number,
): FigurePreview => ({
  src: `/patents/figures/us-3858581-kamen-medication-injection-device/${label.toLowerCase().replace(".", "").replace(" ", "-")}-source-crop-v1.png`,
  alt: `Source-facsimile crop of ${label} from US 3,858,581.`,
  width,
  height,
});
const figure = (
  label: "FIG. 1" | "FIG. 2" | "FIG. 3" | "FIG. 4" | "FIG. 5" | "FIG. 6",
  width: number,
  height: number,
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 3,858,581`,
  figurePreviews: [figurePreview(label, width, height)],
});
const figureGroup = (
  label: "FIGS. 1-3",
  previews: readonly [FigurePreview, FigurePreview, FigurePreview],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crops for ${label} in US 3,858,581`,
  figurePreviews: previews,
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
        "UNITED STATES PATENT",
        "DEAN KAMEN, OF ROCKVILLE CENTRE, NEW YORK.",
        "MEDICATION INJECTION DEVICE.",
        "Patent No. 3,858,581. Filed July 2, 1973. Patented Jan. 7, 1975. Application No. 375,955.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1",
      title: "Device perspective, plan, and longitudinal section",
      description: [
        figure("FIG. 1", 2800, 1350),
        { kind: "text", text: ", " },
        figure("FIG. 2", 2800, 1000),
        { kind: "text", text: ", and " },
        figure("FIG. 3", 3000, 1350),
        {
          kind: "text",
          text: " show the source device, its pulse-scale presentation, and its internal longitudinal arrangement.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2",
      title: "Pulse generator, coupling, and control circuit",
      description: [
        figure("FIG. 4", 1000, 800),
        { kind: "text", text: ", " },
        figure("FIG. 5", 1200, 750),
        { kind: "text", text: ", and " },
        figure("FIG. 6", 2800, 2700),
        {
          kind: "text",
          text: " show the pulse generator, further mechanical structure, and the block diagram of electrical components.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "MEDICATION INJECTION DEVICE" },
    paragraph(
      words(
        "The present invention relates to improvements in a medication injection device, and more particularly to an automatic medication-injecting or administering device readily capable of dispensing medication in accordance with any selected schedule of successive intervals of operation and non-operation of a syringe-driving or powering motor.",
      ),
    ),
    paragraph([
      figureGroup("FIGS. 1-3", [
        figurePreview("FIG. 1", 2800, 1350),
        figurePreview("FIG. 2", 2800, 1000),
        figurePreview("FIG. 3", 3000, 1350),
      ]),
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
      figure("FIG. 2", 2800, 1000),
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
      figure("FIG. 6", 2800, 2700),
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
