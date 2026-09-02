import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
} from "@/types/patent";

const PDF_SHA256 = "7ab2b9b23907b26bff0afd37e2630b73b15c2c429c603a73cb841c8a2b4e114c";
const SOURCE_FIGURE_DIRECTORY = "/patents/figures/us-2318259-sikorsky-helicopter";

export type SourceFigureNumber =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18;

const sourceSheetByFigure: Readonly<Record<number, string>> = {
  1: "fig-1-source-crop-v1.png",
  2: "fig-1-source-crop-v1.png",
  3: "fig-2-source-crop-v1.png",
  4: "fig-3-source-crop-v1.png",
  5: "fig-4-source-crop-v1.png",
  6: "fig-4-source-crop-v1.png",
  7: "fig-4-source-crop-v1.png",
  8: "fig-5-source-crop-v1.png",
  9: "fig-6-source-crop-v1.png",
  10: "fig-6-source-crop-v1.png",
  11: "fig-7-source-crop-v1.png",
  12: "fig-7-source-crop-v1.png",
  13: "fig-8-source-crop-v1.png",
  14: "fig-9-source-crop-v1.png",
  15: "fig-9-source-crop-v1.png",
  16: "fig-9-source-crop-v1.png",
  17: "fig-10-source-crop-v1.png",
  18: "fig-10-source-crop-v1.png",
};

function sheetForFigure(figureNumber: number): string {
  const sheet = sourceSheetByFigure[figureNumber];
  if (!sheet) {
    throw new Error(`US 2,318,259 has no source sheet for Fig. ${String(figureNumber)}.`);
  }
  return sheet;
}

function text(value: string): CuratedSpecificationInline {
  return { kind: "text", text: value };
}

function sourceFigure(
  sourceNumbers: SourceFigureNumber | readonly SourceFigureNumber[],
  sourceText: string,
): CuratedSpecificationInline {
  const numbers = Array.isArray(sourceNumbers) ? sourceNumbers : [sourceNumbers];
  const number = numbers[0];
  if (!number) {
    throw new Error("US 2,318,259 figure reference has no figure number.");
  }
  return {
    kind: "reference",
    text: sourceText,
    href: `#fig-${String(number)}`,
    referenceType: "figure",
    label: `Pinned source crop for ${sourceText}`,
    figurePreviews: numbers.map((sourceFigureNumber) => ({
      src: `${SOURCE_FIGURE_DIRECTORY}/${sheetForFigure(sourceFigureNumber)}`,
      alt: `${sourceText} on its pinned US 2,318,259 drawing sheet for Fig. ${String(sourceFigureNumber)}.`,
      width: 2320,
      height: 3408,
    })),
  };
}

function term(value: string, definition: string): CuratedSpecificationInline {
  return {
    kind: "term",
    text: value,
    definition,
  };
}

function paragraph(textValue: string): CuratedSpecificationBlock {
  return {
    kind: "paragraph",
    inlines: [text(textValue)],
  };
}

function claim(number: number, claimText: string): CuratedSpecificationBlock {
  return {
    kind: "claim",
    number,
    inlines: [text(claimText)],
  };
}

const blocks: CuratedSpecificationBlock[] = [
  {
    kind: "masthead",
    lines: [
      "Patented May 4, 1943",
      "2,318,259",
      "UNITED STATES PATENT OFFICE",
      "2,318,259",
      "DIRECT-LIFT AIRCRAFT",
      "Igor I. Sikorsky, Trumbull, Conn., assignor to United Aircraft Corporation, East Hartford, Conn., a corporation of Delaware",
      "Application April 6, 1940, Serial No. 328,230",
      "10 Claims. (Cl. 244-17)",
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "BACKGROUND AND OBJECTS OF THE INVENTION",
  },
  paragraph(
    "This invention relates to improvements in aircraft and has particular reference to improvements in direct lift type of aircraft commonly referred to as helicopters.",
  ),
  {
    kind: "paragraph",
    inlines: [
      text(
        "An object of the invention resides in the provision of an improved direct lift type aircraft of the character indicated, having an engine, or engines, a ",
      ),
      term(
        "main sustaining rotor",
        "Horizontal overhead multi-blade rotor providing vertical lift and directional propulsion.",
      ),
      text(" and auxiliary rotors or propellers with a positive driving connection between the main rotor and the "),
      term(
        "auxiliary rotor",
        "Vertical tail rotor mounted at the tail boom providing anti-torque thrust and directional yaw control.",
      ),
      text(" and an automatic one-way driving connection (free-wheeling clutch) between the engine and the rotors."),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "A further object resides in the provision, in a direct lift type aircraft of the character indicated having an engine, or engines, a main rotor and means for changing the pitch of the main rotor, of means for automatically controlling the engine power as the ",
      ),
      term(
        "collective pitch",
        "Simultaneous equal pitch change of all main rotor blades to control vertical ascent and descent.",
      ),
      text(
        " of the main rotor is changed in order to avoid stalling the engine or reducing its speed to a dangerously low value when the pitch is increased as well as preventing the engine and rotor from increasing excessively the speed of rotation when the pitch is suddenly decreased.",
      ),
    ],
  },
  paragraph(
    "A still further object resides in the provision of an improved direct lift aircraft having an engine, a main sustaining rotor, and an auxiliary torque counteracting propeller or rotor, with means for automatically or manually varying the pitch of the auxiliary propeller in accordance with changes in the rotational position of the aircraft.",
  ),
  {
    kind: "heading",
    level: 2,
    text: "BRIEF DESCRIPTION OF THE DRAWINGS",
  },
  paragraph(
    "Other objects and advantages will be more particularly pointed out hereinafter and indicated in the accompanying drawings, in which:",
  ),
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(1, "Fig. 1"),
      text(
        " is a side elevational view of a direct lift aircraft constructed in accordance with the present invention;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(2, "Fig. 2"),
      text(
        " is a diagrammatic view showing the torque reaction of the main sustaining rotor and the counteracting thrust of the auxiliary rotor;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(3, "Fig. 3"),
      text(
        " is a top plan view of the aircraft shown in Fig. 1, with portions of the fuselage covering and structural members removed to expose the interior mechanisms;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(4, "Fig. 4"),
      text(
        " is a perspective view of the hub portion of the main sustaining rotor and the pitch control mechanism associated therewith;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure([5, 6, 7], "Figs. 5, 6 and 7"),
      text(
        " are detailed sectional views showing the blade flapping and drag hinges, pitch bearing sleeve, and resilient blade dampers;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(8, "Fig. 8"),
      text(
        " is a transverse sectional view through the main rotor transmission gearbox illustrating the bevel reduction gearing and free-wheeling overrunning clutch;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure([9, 10], "Figs. 9 and 10"),
      text(
        " are sectional views illustrating the collective pitch control lever and the interconnected engine throttle correlator linkage;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure([11, 12], "Figs. 11 and 12"),
      text(
        " are views showing the auxiliary tail rotor pitch control mechanism and drive shaft assembly;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(13, "Fig. 13"),
      text(
        " is a schematic diagram of the pilot cockpit controls illustrating the cyclic stick, collective lever, and rudder pedals;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure([14, 15, 16], "Figs. 14, 15 and 16"),
      text(
        " are detailed views showing the gyroscopic stabilizer vane and aerodynamic yaw feedback trim mechanism; and",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure([17, 18], "Figs. 17 and 18"),
      text(
        " are views showing a modified auxiliary rotor arrangement comprising two intersecting orthogonal rotors at the tail boom.",
      ),
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
  },
  {
    kind: "paragraph",
    inlines: [
      text("Referring to "),
      sourceFigure(1, "Fig. 1"),
      text(
        ", the aircraft comprises an elongated fuselage 10 supporting a main drive engine 60, a vertical main rotor drive shaft 64 driving main rotor 68, and an outrigger tail boom structure carrying an auxiliary tail rotor 70 rotating in a vertical plane substantially parallel to the longitudinal axis of the fuselage.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "When engine 60 drives main rotor 68 in the direction indicated by arrow 72, the air resistance against the rotating blades exerts an equal and opposite aerodynamic torque reaction ",
      ),
      term(
        "torque reaction",
        "Newtonian reaction torque tending to rotate the helicopter fuselage in the direction opposite to main rotor spin.",
      ),
      text(
        " on fuselage 10. To prevent the fuselage from spinning uncontrollably, auxiliary tail rotor 70 produces a lateral thrust force T at distance L from the main rotor axis, creating an anti-torque moment T × L that precisely balances the main rotor torque Q.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text("As shown in "),
      sourceFigure(4, "Fig. 4"),
      text(
        ", each blade of main rotor 68 is mounted on the hub through a universal joint permitting flapping movements in a vertical plane and hunting (lead-lag) movements in the rotational plane, as well as angular feathering about the blade longitudinal axis to vary pitch angle. A swashplate pitch control collar 130 slidable and tiltable on shaft 64 connects to the blade pitch horns through rigid push-pull links 126.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "Pilot control is achieved through three integrated control organs: (1) an azimuth cyclic pitch stick 220 for tilting the rotor thrust vector in pitch and roll; (2) a collective pitch lever 192 for simultaneously altering the pitch of all blades for vertical climb and descent, positively connected to the engine throttle through link 208 to maintain constant rotor RPM under changing aerodynamic load; and (3) foot pedals 280 for modulating the pitch of auxiliary tail rotor 70 to control aircraft heading and yaw rate.",
      ),
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "CLAIMS",
  },
  claim(
    1,
    "1. In an aircraft having a direct lift rotor and an engine for driving said rotor, manually actuatable means permanently connected with said rotor for varying the pitch of said rotor, and means positively and permanently connected with said manually actuatable means and with said motor for simultaneously and positively varying the rotor pitch and the power output of said engine upon each movement of said manually actuatable means.",
  ),
  claim(
    2,
    "2. In an aircraft having a direct lift main rotor and an auxiliary rotor having a plane of rotation at right angles to the plane of rotation of said main rotor, an auxiliary rotor blade mounted for pitch changing movements, means for changing the pitch of said blade, and means responsive to positional changes of said aircraft operatively connected with said pitch changing means for controlling the pitch of said auxiliary rotor to maintain the position of said aircraft substantially constant.",
  ),
  claim(
    3,
    "3. In an aircraft having a direct lift main rotor and an auxiliary rotor for directional control, means for changing the pitch of said auxiliary rotor, and a vane responsive to movements of said aircraft about the axis of said main rotor for automatically controlling the pitch of said auxiliary rotor to control rotational movements of said aircraft about said axis.",
  ),
  claim(
    4,
    "4. In an aircraft having a direct lift main rotor and an auxiliary rotor for changing the position of said aircraft about the axis of said main rotor, means for varying the effect of said auxiliary rotor by changing the pitch thereof, operator actuated means for controlling said pitch changing means, and means responsive to movements of said aircraft about the axis of said main rotor for controlling the pitch of said auxiliary rotor to minimize such movements.",
  ),
  claim(
    5,
    "5. In an aircraft having a main sustaining rotor including a plurality of airfoil blades, and a rotor supporting drive shaft, a universal connection between the inner end of each blade and said shaft, a pivotal connection between each blade and said shaft providing freedom of pitch changing movements of said blades about their longitudinal axes, a bracket pivotally connected to the inner end of each blade on an axis perpendicular to said longitudinal axis, a pitch control member surrounding said shaft at a location spaced from said universal connections, a pair of rigid links pivotally connected to each bracket at locations spaced apart in the direction of the thickness of said blade and spaced from the major axis thereof, a pivotal connection between one of said links and said shaft, and a pivotal connection between the other of said links and said control member.",
  ),
  claim(
    6,
    "6. The arrangement as set forth in claim 5 in which the pivotal connection between one of said links and said control member is a torque transmitting connection operative to constrain a portion of said control member to rotate with said rotor.",
  ),
  claim(
    7,
    "7. The arrangement as set forth in claim 5 including resilient torque transmitting links pivotally secured to said blades and said shaft to constrain said blades to rotate with said shaft while permitting a limited freedom of resiliently resisted movement in the plane of rotation about said universal joints.",
  ),
  claim(
    8,
    "8. In an aircraft having a direct lift main rotor, a combination of two auxiliary rotors arranged so closely to each other as to intersect the plane of rotation of each other, spaced from said main rotor and each having one or more blades, the rotors in said combination being disposed approximately at right angles to each other, one of said auxiliary rotors being effective to control turning movement of said aircraft about the axis of the main rotor and the other being effective to change the plane of rotation of said main rotor, means for driving said combination of auxiliary rotors from said main rotor, means for independently changing the pitch of each of said auxiliary rotor blades, and operator actuated means for controlling said pitch changing means.",
  ),
  claim(
    9,
    "9. In an aircraft having a direct lift rotor and an engine for driving said rotor, means connected with said rotor for varying the pitch thereof, a throttle for said engine, and mechanism positively and permanently connecting said throttle with said means, said mechanism including means for selectively setting the throttle at will and means actuated by each pitch changing movement of said pitch varying means, for simultaneously, positively, varying said selected throttle setting.",
  ),
  claim(
    10,
    "10. In an aircraft having a direct lift rotor and an engine for driving said rotor, means connected with said rotor for varying the pitch thereof, a throttle control for said engine, means for setting said throttle at any desired position, means positively and permanently connecting said throttle control with said pitch varying means for simultaneously and positively varying the rotor pitch and the power output of said engine upon each movement of said pitch varying means.",
  ),
];

export function sikorskyHelicopterClaimText(claimNumber: number): string {
  const claimBlock = blocks.find(
    (block): block is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
      block.kind === "claim" && block.number === claimNumber,
  );
  if (!claimBlock) {
    throw new Error(
      `US 2,318,259 claim ${String(claimNumber)} was not found in the archival edition.`,
    );
  }
  return claimBlock.inlines.map((inline: CuratedSpecificationInline) => inline.text).join("");
}

export const sikorskyHelicopterParallelReadings: Record<number, string[]> = {
  2: [
    "Field of invention: establishes improvements in direct-lift aircraft of the helicopter type.",
  ],
  3: [
    "Primary object: provides direct-lift helicopter with positive transmission driving both the main lifting rotor and the tail anti-torque rotor, with an automatic overrunning freewheeling clutch for safe autorotation descent upon engine failure.",
  ],
  4: [
    "Collective-throttle correlation: establishes automatic mechanical coupling between main rotor blade pitch change and engine throttle opening to prevent engine stall or overspeed during sudden pitch maneuvers.",
  ],
  5: [
    "Auxiliary rotor directional stabilization: establishes automatic and manual pitch modulation of the tail rotor in response to aircraft rotational yaw movements.",
  ],
  6: [
    "Brief description introduction: introduces Figures 1 through 18 of the patent drawings.",
  ],
  7: [
    "FIG. 1: side elevation view of the VS-300 direct-lift helicopter configuration showing main lifting rotor, transmission, engine, and tail anti-torque propeller.",
  ],
  8: [
    "FIG. 2: schematic vector plan view showing main rotor counter-clockwise torque reaction Q and tail rotor anti-torque thrust T × L.",
  ],
  9: [
    "FIG. 3: plan view showing fuselage structure, engine mount, drive shafts, and control rod routing.",
  ],
  10: [
    "FIG. 4: perspective view of main rotor hub, flapping hinge pins, pitch sleeve, and swashplate pitch horn links.",
  ],
  11: [
    "FIGS. 5-7: sectional views of flapping hinge, drag hinge, and resilient lead-lag dampers.",
  ],
  12: [
    "FIG. 8: main transmission gearbox with bevel reduction gears and overrunning sprag clutch for autorotation.",
  ],
  13: [
    "FIGS. 9-10: collective pitch control lever with integrated throttle correlator linkage.",
  ],
  14: [
    "FIGS. 11-12: variable-pitch tail rotor hub and push-pull pitch crosshead.",
  ],
  15: [
    "FIG. 13: pilot flight controls schematic: cyclic stick, collective lever with twist-grip throttle, and anti-torque pedals.",
  ],
  16: [
    "FIGS. 14-16: aerodynamic yaw stabilizing vane and feedback damper mechanism.",
  ],
  17: [
    "FIGS. 17-18: alternative orthogonal auxiliary rotor arrangement for simultaneous pitch and yaw trim.",
  ],
  18: [
    "Detailed description: explains airframe configuration, engine transmission, and vertical tail rotor orientation.",
  ],
  19: [
    "Anti-torque physics: derives the equilibrium between engine shaft torque reaction on the airframe and tail rotor lateral thrust moment.",
  ],
  20: [
    "Main rotor kinematics: details flapping hinges, drag hinges, and pitch control push-pull rods.",
  ],
  21: [
    "Pilot control coordination: describes cyclic pitch stick, collective lever with throttle correlation, and rudder pedals.",
  ],
};

export const sikorskyHelicopterArchivalEdition: CuratedSpecificationEdition = {
  catalogueId: "us-2318259-sikorsky-helicopter",
  kind: "manual-react-edition",
  sourcePdfSha256: PDF_SHA256,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks,
};
