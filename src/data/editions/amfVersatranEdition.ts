/*
import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

export interface FigureReferenceCrop {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const SHA256 = "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd";

export const FIGURES: Record<number, FigureReferenceCrop> = {
  1: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 3,212,649: front elevation of the complete Versatran transfer machine showing base, rotating column, vertical carriage, horizontal arm, wrist, gripper, hydraulic pack, and manual programming arm.",
    width: 1634,
    height: 2400,
  },
  2: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 3,212,649: top plan view showing horizontal cylindrical sweep angle, base mounting, and reach envelope.",
    width: 1634,
    height: 2400,
  },
  3: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 3,212,649: vertical longitudinal section through rotating column, internal lift cylinder, guide tubes, and carriage.",
    width: 1634,
    height: 2400,
  },
  4: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 3,212,649: horizontal cross section through carriage showing arm extension cylinder, dual rack-and-pinion transmission, and spline feedback shafts.",
    width: 1634,
    height: 2400,
  },
  5: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-5-source-crop-v1.png",
    alt: "Figures 5 and 6 from US 3,212,649: rotary swing drive mechanism showing base cylinder, roller chain, and column drive sprocket.",
    width: 1634,
    height: 2400,
  },
  7: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-7-source-crop-v1.png",
    alt: "Figures 7 and 8 from US 3,212,649: wrist mechanism showing bevel gear cluster, yaw sweep, pitch articulation, and roll rotation.",
    width: 1634,
    height: 2400,
  },
  9: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-9-source-crop-v1.png",
    alt: "Figures 9 to 12 from US 3,212,649: parallel-jaw mechanical gripper mechanism with toggle linkage and replaceable finger pads.",
    width: 1634,
    height: 2400,
  },
  13: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-13-source-crop-v1.png",
    alt: "Figures 13 to 18 from US 3,212,649: electro-hydraulic four-way servo valve manifolds, flapper-nozzle pilot stages, and torque motor drivers.",
    width: 1634,
    height: 2400,
  },
  19: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-19-source-crop-v1.png",
    alt: "Figures 19 to 24 from US 3,212,649: counterbalanced teaching arm, manual guidance handle, and velocity command pickoffs.",
    width: 1634,
    height: 2400,
  },
  25: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-25-source-crop-v1.png",
    alt: "Figures 25 to 30 from US 3,212,649: precision resolver feedback gearboxes for column azimuth, vertical lift, and arm extension.",
    width: 1634,
    height: 2400,
  },
  31: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-31-source-crop-v1.png",
    alt: "Figures 31 to 36 from US 3,212,649: hydraulic power and piping circuit diagram.",
    width: 1634,
    height: 2400,
  },
  37: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-37-source-crop-v1.png",
    alt: "Figures 37 and 38 from US 3,212,649: electronic servo amplifier circuitry, summing junction, and phase demodulators.",
    width: 1634,
    height: 2400,
  },
  39: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-39-source-crop-v1.png",
    alt: "Figures 39 to 42 from US 3,212,649: multichannel magnetic tape transport deck, 7-track read/write head assembly, and tape synchronizer.",
    width: 1634,
    height: 2400,
  },
  43: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-43-source-crop-v1.png",
    alt: "Figures 43 to 46 from US 3,212,649: operator control console, mode selector switch, and point-to-point potentiometer matrix.",
    width: 1634,
    height: 2400,
  },
  47: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-47-source-crop-v1.png",
    alt: "Figures 47 and 48 from US 3,212,649: teaching handle electrical schematic and velocity integrator circuit.",
    width: 1634,
    height: 2400,
  },
  49: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-49-source-crop-v1.png",
    alt: "Figures 49 and 50 from US 3,212,649: phase resolver error detector schematic and tone-sensitive relay circuits.",
    width: 1634,
    height: 2400,
  },
  51: {
    src: "/patents/figures/us-3212649-amf-versatran/fig-51-source-crop-v1.png",
    alt: "Figure 51 from US 3,212,649: master block diagram of the complete closed-loop multi-axis servo control system.",
    width: 1634,
    height: 2400,
  },
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from US 3,212,649 source facsimile`,
  figurePreviews: numbers.map((n) => FIGURES[n]),
});

const _term = (text: string, _title: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  definition,
});

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

const claim = (number: number, text: string) => ({
  kind: "claim" as const,
  number,
  inlines: [{ kind: "text" as const, text }],
});

export const amfVersatranParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The opening specification establishes the core purpose: an industrial machine capable of executing repetitive handling, manipulation, and assembly tasks across multiple degrees of freedom via programmable sequenced control.",
  ],
  11: [
    "The inventors diagnose prior automation limitations: previous machines were dedicated single-purpose presses or rigid coordinate mechanisms requiring extensive retooling and manual setup rather than flexible reprogrammable operation.",
  ],
  12: [
    "The invention provides at least three primary degrees of freedom (cylindrical coordinates: column rotation theta, vertical lift z, horizontal reach r) plus three supplemental wrist degrees of freedom (roll, pitch, yaw) to match human arm dexterity.",
  ],
  13: [
    "Manual programming is achieved by grasping a teaching handle and moving the machine through the desired path; the motions are continuously transduced, phase-encoded, and recorded onto multichannel magnetic tape for automatic closed-loop playback.",
  ],
  14: [
    "Objects of the invention include rapid reprogramming without complex computational recalculation, adjustable playback speed scaling, compact hydraulic actuation, and fail-safe deceleration interlocks.",
  ],
  16: [
    "The structural framework comprises a rotatable vertical column mounted on a heavy base, an elevator carriage driven by an internal vertical hydraulic cylinder, and a horizontal arm extended and retracted by hydraulic rack-and-pinion transmission.",
  ],
  18: [
    "Brief description of the 51 drawing figures across 17 sheets, covering the mechanical assemblies, hydraulic circuits, resolver feedback gearboxes, servo amplifiers, tape deck, and control console.",
  ],
  20: [
    "Detailed description of the mechanical assembly: base turntable D driven by hydraulic cylinder E through roller chain 82, vertical lift cylinder 150 moving carriage C, and arm extension cylinder 228 driving dual racks 236.",
  ],
  21: [
    "Precision position feedback uses splined shafts 714 and 722 engaging variable transformer resolvers to deliver continuous phase-modulated AC position signals with zero backlash.",
  ],
  22: [
    "Wrist unit G provides 3-axis motion via concentric internal push-pull rods and bevel gearing, enabling roll, pitch, and yaw articulation of the parallel-jaw gripper fingers.",
  ],
  23: [
    "Hydraulic power unit P provides pressurized fluid to electro-hydraulic servo valves 508, each featuring an electrical torque motor, flapper-nozzle pilot stage, and balanced four-way sliding spool.",
  ],
  24: [
    "Manual programming arm H is counterbalanced at the top of column B, enabling an operator to guide the robot with negligible effort while velocity command signals are integrated and recorded.",
  ],
  25: [
    "Variable transformer resolvers 708, 710, 716 are excited by reference carrier signals; rotor output phase shifts proportionally with mechanical position across each axis.",
  ],
  26: [
    "Hydraulic safety features include cross-port shock relief valves, accumulator pressure buffering, and solenoid-operated dump valves for fail-safe emergency stopping.",
  ],
  27: [
    "Electronic servo amplifiers compare recorded tape command phase angles with live resolver rotor signals, generating proportional DC error currents that drive the valve torque motors to eliminate tracking error.",
  ],
  28: [
    "Multichannel magnetic tape system records continuous analog phase-modulated positions on channels 1-3, reference clock on channel 4, and discrete audio frequency tones on channels 5-7 for gripper and auxiliary actions.",
  ],
  29: [
    "Point-to-point programming mode utilizes auxiliary potentiometer matrix banks and stepping relays to define discrete coordinate milestones when continuous-path tape recording is not required.",
  ],
  30: [
    "Phase discriminator error detector circuit (Figure 49) converts phase lead/lag into bipolar DC drive voltages to position servo valves with sub-zero steady-state tracking error.",
  ],
  31: [
    "Closing specification legal reservation confirming that the disclosed embodiment illustrates the broad principles of programmable transfer manipulation without limiting the scope defined by the claims.",
  ],
};

export const amfVersatranArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SHA256,
  preparedBy: "Classic Patents editorial team (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,

  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office  3,212,649",
        "Patented Oct. 19, 1965",
        "3,212,649",
        "MACHINE FOR PERFORMING WORK",
        "Harry T. Johnson, Glenview, Veljko Milenkovic, Chicago, and John Walter, Evergreen Park, Ill., assignors to American Machine & Foundry Company, a corporation of New Jersey",
        "Filed July 15, 1960, Ser. No. 43,090",
        "14 Claims. (Cl. 214—1)",
      ],
    },
    { kind: "heading", level: 2, text: "SPECIFICATION" },
    p(
      "The present invention relates to a machine for performing a plurality of repetitive operations or manipulations with or on objects in accordance with a prescribed patterned sequence. The demands of industry are such that there is an ever increasing need for machines capable of simulating operations and functions of all kinds of workers in handling manipulating, assembling and transferring work, work pieces, machines and objects being fabricated at the work bench, or from one machine to another or in one machine only as the case may be in accordance with prescribed sequences of operations.",
    ),
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "AMF Versatran Programmed Transfer Robot Full Elevation",
      description: [
        figure("FIG. 1", [1]),
        {
          kind: "text",
          text: ", front elevation of the complete Versatran transfer machine showing base D, rotating column B, vertical carriage C, horizontal arm A, wrist G, gripper, hydraulic pack P, valve block F, and manual programming arm H.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 2",
      title: "Plan View and Cylindrical Sweep Workspace",
      description: [
        figure("FIG. 2", [2]),
        {
          kind: "text",
          text: ", top plan view showing horizontal cylindrical coordinate sweep arc, base mounting, and reach envelope.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 3–4",
      title: "Column Vertical Lift and Horizontal Arm Drive Sections",
      description: [
        figure("FIG. 3", [3]),
        { kind: "text", text: " and " },
        figure("FIG. 4", [4]),
        {
          kind: "text",
          text: ", vertical section through column lift cylinder and horizontal cross section through carriage rack-and-pinion transmission.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 5–8",
      title: "Column Swing Drive and 3-Axis Wrist Articulation",
      description: [
        figure("FIG. 5", [5]),
        { kind: "text", text: ", " },
        figure("FIG. 7", [7]),
        {
          kind: "text",
          text: ", rotary chain drive mechanism and bevel-geared wrist assembly.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 9–18",
      title: "Gripper Mechanism and Electro-Hydraulic Servo Valves",
      description: [
        figure("FIG. 9", [9]),
        { kind: "text", text: ", " },
        figure("FIG. 13", [13]),
        {
          kind: "text",
          text: ", parallel-jaw gripper toggle mechanism and two-stage flapper-nozzle electro-hydraulic servo valve manifolds.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 19–30",
      title: "Manual Teaching Arm and Resolver Feedback Gearboxes",
      description: [
        figure("FIG. 19", [19]),
        { kind: "text", text: ", " },
        figure("FIG. 25", [25]),
        {
          kind: "text",
          text: ", counterbalanced manual guidance handle and precision resolver feedback gearing for theta, z, and r axes.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 31–51",
      title: "Hydraulic Circuit, Servo Electronics, and Multichannel Tape Deck",
      description: [
        figure("FIG. 31", [31]),
        { kind: "text", text: ", " },
        figure("FIG. 37", [37]),
        { kind: "text", text: ", " },
        figure("FIG. 39", [39]),
        { kind: "text", text: ", " },
        figure("FIG. 43", [43]),
        { kind: "text", text: ", " },
        figure("FIG. 47", [47]),
        { kind: "text", text: ", " },
        figure("FIG. 49", [49]),
        { kind: "text", text: ", and " },
        figure("FIG. 51", [51]),
        {
          kind: "text",
          text: ", hydraulic power schematic, servo amplifiers, multichannel magnetic tape transport, operator console, phase discriminator error detector, and master system block diagram.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p(
      "Attempts have been made heretofore to solve this problem and machines and attachments have been designed for this purpose. For example, devices have been built to control the automatic operation of machine tools, such as presses and lathes. Also, attempts have been made to operate machines which functioned within prescribed coordinates of motion in response to carefully calculated or computed straight-line paths of movement. Further, such machines required tooling for one job only and were not readily applicable for others.",
    ),
    p(
      "The present invention constitutes a solution of the above problem because it provides a machine which has such flexibility and versatility that when properly programmed, it is capable of carrying out not only simple, but also complex movements and operations closely simulating acts and functions heretofore considered to be possible only by actual workers. A machine constructed in accordance with the invention has at least three basic degrees of freedom which allow vertical, horizontal and rotary motion as well as three dimensional diagonal movements. And in the illustrated embodiment at least three supplemental degrees of freedom are provided. Thus it is obvious that when a selected programmed sequence is prepared the machine can perform repetitively such operations as assembling machine parts, transferring work pieces from one station to another, close or open a circuit, and other tasks too numerous to mention, for as long or short a period as desired.",
    ),
    p(
      "Programming the machine is effected with great simplicity manually by providing the machine with means for manually operating the prime actuators of the machine through prescribed paths of travel without substantial regard to high accuracy except at points where this is required, or generally at the end points of an operative cycle where pieces or objects being handled, manipulated or worked on are taken from or delivered to a work station. Because of the novel construction of our machine and the relative simplicity of our programming mechanism, programming is accomplished with relative rapidity and without any need for elaborate computation or calculation in order to effect this purpose. Furthermore, as a result of our novel system of programming the time scale of the machine can be increased or decreased in accordance with the desired rate of playback operation of the machine required.",
    ),
    p(
      "It is an object of the invention to provide a novel machine capable of performing repetitively and continuously for any desired period of time operations and functions heretofore capable of performance only by human beings. The invention is also characterized by a machine which is capable of performing tasks and operations normally performed by workers in which movements are not limited to straight lines, as in a lathe, but rather wherein movement of a tool or work piece carrying element can be along widely varied paths and at arbitrary speed rates through several degrees of freedom. In accordance with the preferred form of the invention disclosed herein, six degrees of freedom are provided.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "The invention also consists in the provision of a novel work handling, transferring and manipulating machine having a horizontally movable work piece handling or tool supporting arm, a carriage supporting the arm, and a rotatable vertical column on which the carriage is mounted for vertical movement and wherein the actuating mechanism for the arm, carriage and column are compact in structure so that the maximum movement of the arm carriage and column can be effected without requiring bulking of the machine. The horizontal arm is provided with a work handling or tool supporting wrist member capable of movement in at least three supplemental degrees of freedom, and power means for effecting each of said movements.",
    ),
    { kind: "heading", level: 2, text: "BRIEF DESCRIPTION OF THE DRAWINGS" },
    p(
      "Referring to the drawings: ",
      figure("FIG. 1", [1]),
      " is a front elevation view of a machine for performing work constructed in accordance with the invention; ",
      figure("FIG. 2", [2]),
      " is a plan view of the machine showing the sweep of the arm and column; ",
      figure("FIG. 3", [3]),
      " is a vertical sectional view through the column and carriage; ",
      figure("FIG. 4", [4]),
      " is a horizontal sectional view through the carriage and horizontal arm; ",
      figure("FIG. 5", [5]),
      " is a sectional view showing the column rotary drive; ",
      figure("FIG. 7", [7]),
      " is a detail view of the wrist mechanism; ",
      figure("FIG. 9", [9]),
      " shows the gripper mechanism; ",
      figure("FIG. 13", [13]),
      " shows the hydraulic servo valve assemblies; ",
      figure("FIG. 19", [19]),
      " shows the manual programming arm; ",
      figure("FIG. 25", [25]),
      " shows the resolver feedback gearing; ",
      figure("FIG. 31", [31]),
      " shows the hydraulic power and piping circuit; ",
      figure("FIG. 37", [37]),
      " shows the electronic servo amplifier circuits; ",
      figure("FIG. 39", [39]),
      " shows the magnetic tape recording and playback system; ",
      figure("FIG. 43", [43]),
      " shows the operator control console; ",
      figure("FIG. 47", [47]),
      " shows the programming arm electrical circuits; ",
      figure("FIG. 49", [49]),
      " shows the phase resolver error detector and tone relay circuits; and ",
      figure("FIG. 51", [51]),
      " is a master block diagram of the complete machine control system.",
    ),
    { kind: "heading", level: 2, text: "DETAILED DESCRIPTION OF THE INVENTION" },
    p(
      "Referring to ",
      figure("FIG. 1", [1]),
      " to ",
      figure("FIG. 4", [4]),
      ", the machine comprises a base D supporting a vertical column B mounted for rotation about its vertical axis. Mounted on column B is a vertically movable carriage C which supports a horizontally movable arm A. At the outer end of arm A is a wrist member G provided with work gripping fingers. A manual programming arm H is mounted at the top of column B for manual teaching of the machine. The base D houses a hydraulic power pack P and valve block F. Column B is rotated by hydraulic actuator E through roller chain 82 engaging sprocket 78. Carriage C is moved vertically along column B by hydraulic lift cylinder 150 whose piston rod is connected to carriage 162. Arm A is extended and retracted horizontally within carriage C by hydraulic actuator cylinder 228 driving dual racks 236 through pinion 244.",
    ),
    p(
      "The horizontal arm A is formed of tubular member 228 guided within carriage 162 by precision roller bearings 246. Feedback splined shaft 714 extends parallel to column B and engages resolver gearbox 710 to provide precision position feedback for the vertical carriage movement. Similarly, splined shaft 722 extends along arm A and engages resolver 716 to provide precision position feedback for horizontal arm extension. Column rotation resolver 708 is geared directly to column turntable 72.",
    ),
    p(
      "Wrist unit G is mounted on the forward end of horizontal arm A and provides three supplemental degrees of freedom: wrist yaw (swinging in a horizontal plane), wrist pitch (tilting in a vertical plane), and wrist roll (continuous or partial axial rotation). The wrist movements are actuated by hydraulic cylinders mounted within the rear portion of arm A, transmitting force through concentric push-pull rods and bevel gearing housed within wrist casting 348.",
    ),
    p(
      "Hydraulic power pack P comprises an electric motor driving a variable-displacement hydraulic pump 504 supplied from reservoir tank 70 through filter 507. High-pressure hydraulic fluid is supplied to main manifold 506 and directed to each actuator through electro-hydraulic servo valves 508. Each servo valve 508 is a two-stage four-way valve comprising an electrical torque motor driving a flapper-nozzle pilot stage, which in turn positions a balanced four-way sliding spool.",
    ),
    p(
      "Manual programming arm H is pivotally mounted on bracket 610 at the upper end of column B. Arm H extends outward and carries at its distal end a manual control handle 612 provided with trigger switches and directional force sensors. During the programming mode, an operator grasps handle 612 and manually guides the machine through the desired path of motion. Manual displacement of handle 612 actuates pilot potentiometers, generating command voltages that cause the servo valves to drive the machine actuators to follow the operator's guidance with negligible manual effort.",
    ),
    p(
      "Precision position feedback for each of the three primary axes (theta, z, r) is provided by variable transformer resolvers 708, 710, 716. Each resolver comprises a stator excited with two-phase sinusoidal reference voltages and a rotor output winding delivering a phase-shifted AC signal whose phase angle is strictly proportional to mechanical axis position. Antibacklash gear trains couple the resolvers to the drive shafts to eliminate lost motion and ensure positional repeatability within fine limits.",
    ),
    p(
      "The hydraulic circuit includes cross-port relief valves and deceleration orifices to prevent mechanical shock when actuators reach the end of their strokes. Accumulator 510 maintains system pressure during peak flow demands and dampens pressure pulsations from the pump. Solenoid-operated bypass valves allow instantaneous unloading of the hydraulic system in response to emergency stop buttons or electrical power failure, causing all actuators to decelerate smoothly and lock in place.",
    ),
    p(
      "Electronic servo amplifiers 746, 748, 750 amplify the phase error signals from demodulator circuits. Each amplifier includes rate feedback and lead-lag compensation networks to provide optimum dynamic response, high stiffness, and complete freedom from hunting or oscillation. Phase discriminator 740 compares command phase angle from magnetic tape T with feedback phase angle from resolver rotor. The resulting DC error voltage is proportional in magnitude and polarity to positional error, driving the torque motor of servo valve 508 to restore axis coincidence.",
    ),
    p(
      "Magnetic tape recorder-reproducer T comprises a multichannel tape deck such as an Ampex Model FR1100. Channels 1, 2, and 3 record continuous phase-modulated carrier signals representing the positions of column rotation (theta), vertical lift (z), and arm extension (r). Channel 4 records the master oscillator reference carrier for synchronous phase comparison. Channels 5, 6, and 7 record discrete frequency tones for auxiliary functions, including gripper open/close, wrist tilt, and external machine interlocks.",
    ),
    p(
      "In point-to-point mode, the tape deck is bypassed, and command signals are supplied from a bank of precision potentiometers on console 43. Stepping switches advance from step to step upon receipt of coincidence signals indicating that all axes have arrived within tolerance of the commanded position. Tone-sensitive relays 756 in the auxiliary channels respond to specific audio frequencies on tape T to actuate solenoid valves for gripper operation, air blast, or workpiece release without requiring separate electrical conductors for each function.",
    ),
    p(
      "Referring to ",
      figure("FIG. 49", [49]),
      ", the error detector circuit produces an output voltage approximately proportional to the difference in phase between voltage ER from the rotor of a resolver and ET the command voltage from tape T. The circuit gives a measure of phase error between two signals and converts it to D.C. suitable for actuating the torque motors of the servo valves and effect the accurate operation of the actuators. The accuracy is achieved by the fact that there is a command signal and a position signal and the error between the two is converted into proper controlling signals so that the servo valves can effect the proper operation of the actuators in such directions as to diminish errors to sub-zero whereby the machine at all times must remain in correct position.",
    ),
    p(
      "It will thus be seen that the objects set forth above, and those made apparent from the preceding description, are efficiently attained. As various changes may be made in the form, construction and arrangement of the parts herein without departing from the spirit and scope of the invention and without sacrificing any of its advantages, it is to be understood that all matter herein is to be interpreted as illustrative and not in a limiting sense.",
    ),
    { kind: "heading", level: 2, text: "We claim:" },
    claim(
      1,
      "1. A machine of the type described, comprising a base, a column mounted thereon for rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement therealong and for movement along a horizontal axis perpendicular to said vertical axis, a wrist member mounted at an end of said arm for rotary movement about said horizontal axis and for swinging about a central vertical axis perpendicular thereto, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for reciprocally rotating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for rotating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, servo-valve means associated with each of said actuators for controlling the flow of fluid thereto and electrical control means for operating said valve means separately or in combination.",
    ),
    claim(
      2,
      "2. In a machine for performing work of the type described, apparatus for reciprocally moving a horizontal arm within a carriage vertically movable on a rotatable column, comprising a pair of hydraulic motor units mounted on said column, each of said units comprising a cylinder and fluid actuated plunger, a source of fluid under pressure connected to each of said units, means regulating the flow of fluid to and from said units to actuate said plungers for unitary reciprocal movement, and gear means connecting said plungers and said arm for translating the movement of said plungers to said arm.",
    ),
    claim(
      3,
      "3. In a machine for performing work of the type described, apparatus for reciprocally moving a horizontal arm within a carriage vertically movable on a rotatable column, comprising a pair of hydraulic motor units mounted on said column for movement therewith, each having a cylinder and fluid actuating plunger, a source of fluid under pressure, conduit means connecting said source and each of said units, servo-valve means for regulating the flow of fluid selectively to and from said units to cooperatively actuate said plungers in linear reciprocal directions, control means for operating said valves in a prescribed sequence, first gear means interconnecting said pistons for translating their linear movement to rotary motion, an elongated grooved rod secured at one end to said first gear means so as to rotate therewith and having its other end extending through said carriage, second gear means mounted on said carriage to move vertically on said rod and keyed thereto so as to rotate therewith, and a rack fixedly mounted on said arm engaging said second gear means, whereby the reciprocal linear movement of said plungers is translated to said arm.",
    ),
    claim(
      4,
      "4. In a machine for performing work of the type described, apparatus for engaging and handling a work piece, comprising a substantially hollow tubular arm having work handling means mounted at an end thereof, said work handling means being adapted to manipulate a work piece and to be rotated about the longitudinal axis of said arm and about a central axis perpendicular thereto, a plurality of movable sleeve members mounted within said arm adapted to be actuated by fluid pressure, one of said sleeve members being adapted to manipulate said work handling means, another of said sleeve members being adapted to rotate said work handling means about said longitudinal axis and a third of said sleeve members being adapted to rotate said work handling means about said perpendicular axis, means separating said sleeve members to permit distinct actuation of each, means respectively connecting each of said sleeve members to said work handling means, a source of fluid under pressure, conduit means connecting said source to said arm in position to actuate said sleeve members, servo-valve means regulating the flow of said fluid to operate each of said sleeve members and control means for automatically operating said servo-valve means in a prescribed sequence.",
    ),
    claim(
      5,
      "5. Apparatus according to claim 4 including means for limiting the movement of said sleeve members and said work handling means.",
    ),
    claim(
      6,
      "6. Apparatus according to claim 4 including spring means normally biasing said sleeve members from actuating said work handling means.",
    ),
    claim(
      7,
      "7. Apparatus according to claim 4 wherein said work handling means comprises a gripper having a pair of fingers adapted to engage and hold a work piece.",
    ),
    claim(
      8,
      "8. A machine of the type described, comprising a base, a column mounted thereon for rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement along said axis, and for movement along a horizontal axis perpendicular to said column, a wrist member mounted at an end of said arm for rotary movement about said horizontal axis and for swinging movement about a central vertical axis perpendicular to said horizontal axis, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for oscillating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for oscillating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, servo-valve means associated with each of said actuators for controlling the flow of fluid thereto, a programming arm mounted on said machine for manually directing the movement of said column, said arm, said wrist member and the operation of said work manipulating through a prescribed path of travel and operation, means producing an electrical signal responsive to the movement of said programming arm respective to each of said servo-valves for controlling each of said actuators to operate said machine through said prescribed path of travel and operation, means for sensing the movement and operation of each of said actuators and for indicating the same as series of electrical signals respectively associated with each of said actuators, means for recording said second mentioned series of signals, means for repetitively playing back said second series of signals and feeding the same to said servo-valves to automatically operate said machine.",
    ),
    claim(
      9,
      "9. A machine of the type described, comprising a base, a column mounted thereon for reciprocal rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement along said axis, and for movement along a horizontal axis perpendicular to said vertical axis, a wrist member mounted at an end of said arm for reciprocal rotary movement about said horizontal axis and for reciprocal swinging movement about a central vertical axis perpendicular thereto, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for oscillating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for oscillating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, electrically controlled servo-valve means located within each conduit controlling the flow of fluid to said hydraulic actuators, a programming arm mounted on said machine for manually directing the movement of said column, said arm, said wrist member and the operation of said work manipulating member through a prescribed path of travel and operation, means producing an electrical signal responsive to the movement of said programming arm respective to each of said servo-valves for controlling each of said actuators to operate said machine through said prescribed path of travel and operation, means continuously sensing the movement and operation of each of said actuators with respect to fixed initial positions, and for indicating the same as series of electrical signals, means for recording said second series of signals, means for repetitively playing back said second series of signals and feeding the same to said servo-valves to automatically operate said machine.",
    ),
    claim(
      10,
      "10. The machine according to claim 9 wherein said sensing means includes a variable transformer resolver associated with each of said column and arm actuators and including means connecting the associated resolvers with its respective actuator respectively.",
    ),
    claim(
      11,
      "11. The machine according to claim 9 wherein said sensing means includes a signal generator associated with each of the actuators for said wrist and work manipulating members, said generators producing a signal indicative of the movement and operation of said members.",
    ),
    claim(
      12,
      "12. A work handling device comprising an arm, a housing located at one end of said arm, a pair of gripping fingers extending from said housing and adapted to hold a work piece, said fingers being respectively mounted on a pair of engaging pinions, one of said pinions being located substantially centrally of said housing, said pinions being cooperatively rotatable in opposite directions and conjointly movable about a vertical axis passing through said centrally located pinion, means for rotating one of said pinions to angularly move said fingers toward and away from each other and for conjointly moving said pinions to angularly swing said fingers about said vertical axis.",
    ),
    claim(
      13,
      "13. The device according to claim 12 wherein said means for rotating and moving said pinions comprise at least a pair of linearly movable racks located in said arm and extending into said housing in engagement with said pinions, said racks being selectively movable separately or in combination.",
    ),
    claim(
      14,
      "14. The device according to claim 12 including means for limiting the conjoint movement of said fingers comprising a substantially U shaped channel structure formed in the lower portion of said housing and mounted for rotatable movement in conjunction with said centrally located pinion, a plurality of rollers located in said channel, adjustable means for limiting the length of said channel, and abutment means located in said channel for engaging said rollers and stopping the rotation of said channel structure.",
    ),
  ],
};

* Dynamic lookup function ensuring single source of truth for claim text
export function amfVersatranClaimText(number: number): string {
  const block = amfVersatranArchivalEdition.blocks.find(
    (b: CuratedSpecificationBlock) => b.kind === "claim" && b.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${number} not found in amfVersatranArchivalEdition`);
  }
  return block.inlines.map((i: CuratedSpecificationInline) => i.text).join("");
}
*/

import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_ID = "us-3212649-amf-versatran";
const SOURCE_SHA256 = "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd";
const SOURCE_FIGURE_DIRECTORY = `/patents/figures/${PATENT_ID}`;

const words = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });
const paragraph = (value: string | CuratedSpecificationInlines): CuratedSpecificationBlock => ({
  kind: "paragraph",
  inlines: typeof value === "string" ? words(value) : value,
});
const claim = (number: number, value: string): CuratedSpecificationBlock => ({
  kind: "claim",
  number,
  inlines: words(value),
});

type SourceFigureNumber = number | "40A";

const sourceSheetByFigure: Readonly<Record<SourceFigureNumber, string>> = {
  1: "sheet-01-source-crop-v1.png",
  2: "sheet-02-source-crop-v1.png",
  3: "sheet-02-source-crop-v1.png",
  4: "sheet-03-source-crop-v1.png",
  5: "sheet-03-source-crop-v1.png",
  6: "sheet-03-source-crop-v1.png",
  7: "sheet-03-source-crop-v1.png",
  8: "sheet-04-source-crop-v1.png",
  9: "sheet-04-source-crop-v1.png",
  10: "sheet-04-source-crop-v1.png",
  11: "sheet-04-source-crop-v1.png",
  12: "sheet-05-source-crop-v1.png",
  13: "sheet-05-source-crop-v1.png",
  14: "sheet-05-source-crop-v1.png",
  15: "sheet-05-source-crop-v1.png",
  16: "sheet-06-source-crop-v1.png",
  17: "sheet-06-source-crop-v1.png",
  18: "sheet-06-source-crop-v1.png",
  19: "sheet-06-source-crop-v1.png",
  20: "sheet-07-source-crop-v1.png",
  21: "sheet-07-source-crop-v1.png",
  22: "sheet-07-source-crop-v1.png",
  23: "sheet-07-source-crop-v1.png",
  24: "sheet-08-source-crop-v1.png",
  25: "sheet-08-source-crop-v1.png",
  26: "sheet-08-source-crop-v1.png",
  27: "sheet-08-source-crop-v1.png",
  28: "sheet-09-source-crop-v1.png",
  29: "sheet-09-source-crop-v1.png",
  30: "sheet-09-source-crop-v1.png",
  31: "sheet-10-source-crop-v1.png",
  32: "sheet-10-source-crop-v1.png",
  33: "sheet-10-source-crop-v1.png",
  34: "sheet-11-source-crop-v1.png",
  35: "sheet-11-source-crop-v1.png",
  36: "sheet-11-source-crop-v1.png",
  37: "sheet-12-source-crop-v1.png",
  38: "sheet-12-source-crop-v1.png",
  39: "sheet-12-source-crop-v1.png",
  40: "sheet-12-source-crop-v1.png",
  "40A": "sheet-12-source-crop-v1.png",
  41: "sheet-12-source-crop-v1.png",
  42: "sheet-13-source-crop-v1.png",
  43: "sheet-13-source-crop-v1.png",
  44: "sheet-13-source-crop-v1.png",
  45: "sheet-13-source-crop-v1.png",
  46: "sheet-14-source-crop-v1.png",
  47: "sheet-15-source-crop-v1.png",
  48: "sheet-16-source-crop-v1.png",
  49: "sheet-17-source-crop-v1.png",
  50: "sheet-17-source-crop-v1.png",
};

function sourceFigure(
  sourceNumbers: SourceFigureNumber | readonly SourceFigureNumber[],
  sourceText: string,
): CuratedSpecificationInline {
  const numbers = Array.isArray(sourceNumbers) ? sourceNumbers : [sourceNumbers];
  const number = numbers[0];
  if (!number) throw new Error("US 3,212,649 figure reference has no figure number.");
  const sheet = sourceSheetByFigure[number];
  if (!sheet) throw new Error(`US 3,212,649 has no source sheet for Fig. ${String(number)}.`);
  return {
    kind: "reference",
    text: sourceText,
    href: `#fig-${String(number)}`,
    referenceType: "figure",
    label: `Pinned source crop for ${sourceText}`,
    figurePreviews: numbers.map((sourceFigureNumber) => ({
      src: `${SOURCE_FIGURE_DIRECTORY}/${sourceSheetByFigure[sourceFigureNumber]}`,
      alt: `${sourceText} on its pinned US 3,212,649 drawing sheet for Fig. ${String(sourceFigureNumber)}.`,
      width: 1634,
      height: 2400,
    })),
  };
}

const blocks: CuratedSpecificationBlock[] = [
  {
    kind: "masthead",
    lines: [
      "United States Patent Office",
      "3,212,649",
      "Patented Oct. 19, 1965",
      "3,212,649",
      "MACHINE FOR PERFORMING WORK",
      "Harry T. Johnson, Glenview, Veljko Milenkovic, Chicago, and John Walter, Evergreen Park, Ill., assignors to American Machine & Foundry Company, a corporation of New Jersey",
      "Filed July 15, 1960, Ser. No. 43,090",
      "14 Claims. (Cl. 214—1)",
    ],
  },
  { kind: "heading", level: 2, text: "Specification" },
  {
    kind: "paragraph",
    inlines: [
      text("The present invention relates to a "),
      {
        kind: "term",
        text: "machine for performing",
        definition:
          "In this grant the phrase names a programmable article-handling machine with several coordinated motions; it is the patent's period description, not a modern claim that every automated factory device is a robot.",
      },
      text(
        " a plurality of repetitive operations or manipulations with or on objects in accordance with a prescribed patterned sequence.",
      ),
    ],
  },
  paragraph(
    "The demands of industry are such that there is an ever increasing need for machines capable of simulating operations and functions of all kinds of workers in handling manipulating, assembling and transferring work, work pieces, machines and objects being fabricated at the work bench, or from one machine to another or in one machine only as the case may be in accordance with prescribed sequences of operations.",
  ),
  paragraph(
    "Attempts have been made heretofore to solve this problem and machines and attachments have been designed for this purpose. For example, devices have been built to control the automatic operation of machine tools, such as presses and lathes. Also, attempts have been made to operate machines which functioned within prescribed coordinates of motion in response to carefully calculated or computed straight-line paths of movement. Further, such machines required tooling for one job only and were not readily applicable for others.",
  ),
  paragraph(
    "The present invention constitutes a solution of the above problem because it provides a machine which has such flexibility and versatility that when properly programmed, it is capable of carrying out not only simple, but also complex movements and operations closely simulating acts and functions heretofore considered to be possible only by actual workers. A machine constructed in accordance with the invention has at least three basic degrees of freedom which allow vertical, horizontal and rotary motion as well as three dimensional diagonal movements. And in the illustrated embodiment at least three supplemental degrees of freedom are provided.",
  ),
  paragraph(
    "Programming the machine is effected with great simplicity manually by providing the machine with means for manually operating the prime actuators of the machine through prescribed paths of travel without substantial regard to high accuracy except at points where this is required, or generally at the end points of an operative cycle where pieces or objects being handled, manipulated or worked on are taken from or delivered to a work station. Because of the novel construction of our machine and the relative simplicity of our programming mechanism, programming is accomplished with relative rapidity and without any need for elaborate computation or calculation in order to effect this purpose. Furthermore, as a result of our novel system of programming the time scale of the machine can be increased or decreased in accordance with the desired rate of playback operation of the machine required.",
  ),
  {
    kind: "figure-sheet",
    figureLabel: "Figs. 1–50",
    description: [
      sourceFigure(1, "FIG. 1"),
      text(" is a front elevation of the article handling and transferring apparatus; "),
      sourceFigure(2, "FIG. 2"),
      text(" is a rear view of the same; "),
      sourceFigure(3, "FIG. 3"),
      text(
        " is a detailed sectional side elevation of the swivelled bottom portion of the vertical column of the machine; ",
      ),
      sourceFigure(4, "FIG. 4"),
      text(" is a sectional side elevation of the machine; "),
      sourceFigure(5, "FIG. 5"),
      text(
        " is an enlarged sectional side elevation of the manifold block for the vertical column cylinders; ",
      ),
      sourceFigure(6, "FIG. 6"),
      text(" is a front elevation of the same, taken on line 6—6 of "),
      sourceFigure(5, "FIG. 5"),
      text("; "),
      sourceFigure(7, "FIG. 7"),
      text(
        " is a detailed sectional plan view of the lower vertical cylinder and its supporting block, taken on line 7—7 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(8, "FIG. 8"),
      text(
        " is a sectional plan view of the manifold connecting the pair of horizontal cylinders employed for activating the vertical column, taken on line 8—8 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(9, "FIG. 9"),
      text(" is also a sectional plan view, taken on line 9—9 of "),
      sourceFigure(4, "FIG. 4"),
      text(
        ", illustrating the actuating means to impart oscillating motion to the vertical column; ",
      ),
      sourceFigure(10, "FIG. 10"),
      text(" is a sectional plan view, taken on line 10—10 of "),
      sourceFigure(4, "FIG. 4"),
      text(", illustrating the vertical column mounting plate and manifold; "),
      sourceFigure(11, "FIG. 11"),
      text(
        " is a detailed sectional plan view of the swivelled bottom portion of the vertical column, taken on line 11—11 of ",
      ),
      sourceFigure(3, "FIG. 3"),
      text("; "),
      sourceFigure(12, "FIG. 12"),
      text(
        " is a sectional plan view illustrating the driving unit for the horizontal arm, taken on line 12—12 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(13, "FIG. 13"),
      text(
        " is a partial sectional bottom view of the horizontal arm and the driving and guiding means for the same as seen from line 13—13 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(14, "FIG. 14"),
      text(
        " is a sectional plan of the vertically reciprocating carriage supporting the horizontally reciprocating arm, taken on line 14—14 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(15, "FIG. 15"),
      text(
        " is a partial sectional rear elevation of the vertical lifting and lowering means for the horizontal arm supporting carriage, taken on line 15—15 of ",
      ),
      sourceFigure(4, "FIG. 4"),
      text("; "),
      sourceFigure(16, "FIG. 16"),
      text(
        " is a sectional plan view of the driving unit which imparts reciprocal motion to the horizontal arm; ",
      ),
      sourceFigure(17, "FIG. 17"),
      text(" is a sectional end elevation of the same, taken on the line 17—17 of "),
      sourceFigure(16, "FIG. 16"),
      text("; "),
      sourceFigure(18, "FIG. 18"),
      text(
        " is another sectional end elevation of the horizontal arm driving unit, taken on line 18—18 of ",
      ),
      sourceFigure(16, "FIG. 16"),
      text("; "),
      sourceFigure(19, "FIG. 19"),
      text(" is a sectional end elevation of the horizontal arm, taken on line 19—19 of "),
      sourceFigure(13, "FIG. 13"),
      text(", illustrating the guiding means for the same; "),
      sourceFigure(20, "FIG. 20"),
      text(
        " is a plan view of the manifold block for the hydraulic control system of the machine; ",
      ),
      sourceFigure(21, "FIG. 21"),
      text(" is a sectional side elevation of the same, taken on line 21—21 of "),
      sourceFigure(20, "FIG. 20"),
      text("; "),
      sourceFigure(22, "FIG. 22"),
      text(" is a sectional plan view of the manifold block taken on line 22—22 of "),
      sourceFigure(27, "FIG. 27"),
      text("; "),
      sourceFigure(23, "FIG. 23"),
      text(" is also a sectional plan view of the manifold block taken on line 23—23 of "),
      sourceFigure(26, "FIG. 26"),
      text("; "),
      sourceFigure(24, "FIG. 24"),
      text(" is another sectional plan view of the manifold block taken on line 24—24 of "),
      sourceFigure(25, "FIG. 25"),
      text("; "),
      sourceFigure(25, "FIG. 25"),
      text(" is a sectional end elevation of the manifold block taken on line 25—25 of "),
      sourceFigure(20, "FIG. 20"),
      text("; "),
      sourceFigure(26, "FIG. 26"),
      text(" is also a sectional end elevation of the manifold block taken on line 26—26 of "),
      sourceFigure(20, "FIG. 20"),
      text("; "),
      sourceFigure(27, "FIG. 27"),
      text(" is another sectional end elevation of the manifold block taken on line 27—27 of "),
      sourceFigure(20, "FIG. 20"),
      text("; "),
      sourceFigure(28, "FIG. 28"),
      text(" is a plan view of one of the safety valves; "),
      sourceFigure(29, "FIG. 29"),
      text(" is a sectional side elevation of the same, taken on line 29—29 of "),
      sourceFigure(28, "FIG. 28"),
      text("; "),
      sourceFigure(30, "FIG. 30"),
      text(" is another sectional side elevation of the safety valve, taken on line 30—30 of "),
      sourceFigure(28, "FIG. 28"),
      text("; "),
      sourceFigure(31, "FIG. 31"),
      text(
        " is an end elevation of the safety valve illustrated with the coverplate removed, taken on line 31—31 of ",
      ),
      sourceFigure(28, "FIG. 28"),
      text("; "),
      sourceFigure(32, "FIG. 32"),
      text(
        " is a side elevation of the safety valve illustrated in conjunction with a manifold block and a servo control valve; ",
      ),
      sourceFigure(33, "FIG. 33"),
      text(" is an end elevation of the same, taken on line 33—33 of "),
      sourceFigure(32, "FIG. 32"),
      text("; "),
      sourceFigure(34, "FIG. 34"),
      text(
        " is a sectional side elevation of the front portion of the horizontal arm which carries the gripper mechanism; ",
      ),
      sourceFigure(35, "FIG. 35"),
      text(" is a sectional side elevation of the rear portion of the horizontal arm; "),
      sourceFigure(36, "FIG. 36"),
      text(
        " is a partial sectional side elevation of the horizontal arm illustrating the wrist motion cam control; ",
      ),
      sourceFigure(37, "FIG. 37"),
      text(" is a plan view of the gripper fingers and their actuating mechanism; "),
      sourceFigure(38, "FIG. 38"),
      text(
        " is a partial bottom view of the gripper finger control mechanism, taken on line 38—38 of ",
      ),
      sourceFigure(34, "FIG. 34"),
      text("; "),
      sourceFigure(39, "FIG. 39"),
      text(
        " is a sectional end elevation of the gripper finger actuating mechanism, taken on line 39—39 of ",
      ),
      sourceFigure(37, "FIG. 37"),
      text("; "),
      sourceFigure(40, "FIG. 40"),
      text(
        " is a sectional end elevation of the horizontal arm, illustrating the adjustable wrist motion arresting mechanism, taken on line 40—40 of ",
      ),
      sourceFigure(34, "FIG. 34"),
      text("; "),
      sourceFigure("40A", "FIG. 40A"),
      text(" is a sectional end elevation of the horizontal arm similar to "),
      sourceFigure(40, "FIG. 40"),
      text(" but with the wrist motion stop pins set in different relation; "),
      sourceFigure(41, "FIG. 41"),
      text(
        " is another sectional end elevation of the horizontal arm, illustrating the wrist motion control mechanism, taken on line 41—41 of ",
      ),
      sourceFigure(35, "FIG. 35"),
      text("; "),
      sourceFigure(42, "FIG. 42"),
      text(" is a sectional side elevation of the programming arm; "),
      sourceFigure(43, "FIG. 43"),
      text(" is a sectional plan view of the programming head, taken on line 43—43 of "),
      sourceFigure(42, "FIG. 42"),
      text("; "),
      sourceFigure(44, "FIG. 44"),
      text(
        " is a partial sectional side elevation of the programming head taken at 90° from the section shown in ",
      ),
      sourceFigure(42, "FIG. 42"),
      text("; "),
      sourceFigure(45, "FIG. 45"),
      text(
        " is a side elevation of one of the linear potentiometer in the programming head illustrating the mounting and support of the same; ",
      ),
      sourceFigure(46, "FIG. 46"),
      text(" is a schematic flow diagram illustrating a suitable system for the machine; "),
      sourceFigure(47, "FIG. 47"),
      text(
        " is a diagram illustrating a suitable electrical control circuit for recording a programmed operation of the machine; ",
      ),
      sourceFigure(48, "FIG. 48"),
      text(
        " is a diagram illustrating a suitable electrical circuit to automatically actuate the machine in accordance to the program recorded on a tape; ",
      ),
      sourceFigure(49, "FIG. 49"),
      text(
        " is an electrical diagram illustrating the components of a suitable error detector; and ",
      ),
      sourceFigure(50, "FIG. 50"),
      text(" is a diagram of a suitable signal detector."),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "With reference to the drawings, the article handling and transfer apparatus selected for purposes of illustrating the invention comprises a ",
      ),
      {
        kind: "term",
        text: "reciprocatory horizontal arm",
        definition:
          "The period adjective means repeatedly moving to and fro along a line. Here it identifies the arm's controlled horizontal travel rather than a claim about an unspecified modern motion profile or rated stroke.",
      },
      text(
        " A provided with article or object handling and manipulating means. The arm in the embodiment shown which is provided with a suitable gripping device is movably supported by a carriage C which slidably engages with a vertical column B on which said carriage C is vertically raised and lowered. The vertical column B at its bottom end is rotatably supported and turned in clockwise or counter-clockwise direction in a manner described hereinafter.",
      ),
    ],
  },
  paragraph(
    "The hydraulic power unit for vertical column B of the machine is actuated by means of controlled hydraulic pressure by means of a suitable hydraulic power unit. The hydraulic power unit disclosed consists of a motor M which drives a pump P connected by means of suitable tubes to a reservoir R and a filter unit F. From the filter unit F suitable tubes branch out to the hydraulic actuator of the vertical column B, the hydraulic actuator for the carriage C and the hydraulic actuator for the horizontal arm A. There is also a tube which connects the filter unit F with a suitable accumulator D. To properly control the temperature of the hydraulic fluid, a suitable radiator E is provided through which the hydraulic fluid may be directed.",
  ),
  paragraph(
    "The above described constructions and relation of racks 156 and 158 to pinion 154 is, therefore, such that the movement of yoke block 150 with its supported gear 154 causes transmittal of vertical linear motion to carriage C which is twice as far and fast as that of the yoke block. There is, therefore, a two to one magnification of the cylinder movement. By means of a more elaborate gearing system, greater multiplication of movement could be obtained.",
  ),
  paragraph(
    "The ratio of the several gears 294, 304, 306, and 246 is important in order to hold to a minimum the space to be occupied by the horizontal drive unit including pistons 284 and 286. We have found that satisfactory results are obtained when the gear ratio between gears 304 and 306 is approximately 3:1 and that between gears 246 and 294 is approximately 1.66:1 so that total ratio in the gear train including these four gears is approximately 5:1. This means that for each increment of movement of either of the pistons 284 and 286 arm A will move five times that distance.",
  ),
  {
    kind: "paragraph",
    inlines: [
      text(
        "In order to maintain fingers 324 and 326 in the same relation to each other, that is, in open or closed position during swinging motion, both gear racks 354 and 412 actuates gears 334 and 414. When a closing or opening of the fingers is desired, only rack 354 is operated. The closing or opening of fingers 324 and 326 may be associated with the gripping and releasing an object or article S as illustrated in ",
      ),
      sourceFigure(37, "FIGURE 37"),
      text("."),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "A mechanism suitable for effecting the recording of movements in a programmed sequence is illustrated in ",
      ),
      sourceFigure(42, "FIGURES 42–45"),
      text(
        ". In order to guide the machine through the desired operation to be programmed, the machine is provided with a detachable ",
      ),
      {
        kind: "term",
        text: "programming arm",
        definition:
          "This is the patent's detachable manual control arm and head used to guide the programmed sequence. It is not a claim that the production arm itself is physically hand-guided through a task.",
      },
      text(
        " H which may be mounted during programming operation on a ring shaped bearing member 610 which is integral with the column cap plate 146.",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "In order to track the swing movement of the column B, the vertical movement of the carriage C and the horizontal movement of the arm A and also to emit suitable signals indicating the specific positions of these units during the cycle of the machine, each unit is provided with a conventional ",
      ),
      {
        kind: "term",
        text: "resolver",
        definition:
          "The patent explicitly calls these conventional variable transformers: an electromechanical device whose rotor and stator produce position-related electrical signals. The grant does not publish a calibrated conversion from signal phase to SI position.",
      },
      text(
        ", such as a type AY-192-A1 manufactured by the Bendix Aviation Corporation. These resolvers are in essence variable transformers, each consisting of a stator and a rotor.",
      ),
    ],
  },
  paragraph(
    "As mentioned before, programming arm H is employed for the purpose of recording a program consisting of the desired motion of the machine onto a suitable medium, such as a magnetic recording tape. The guiding of the machine through the desired motion to be recorded is accomplished by the manipulation of the programming stick 644 by the operator.",
  ),
  {
    kind: "paragraph",
    inlines: [
      text("A suitable error detector circuit is shown diagrammatically in "),
      sourceFigure(49, "FIGURE 49"),
      text(
        ". The purpose of this circuit is to produce an output voltage approximately proportional to the difference in phase between the voltage E_R from the rotor of a resolver and E_T the command voltage from tape T.",
      ),
    ],
  },
  { kind: "heading", level: 2, text: "Claims" },
  claim(
    1,
    "A machine of the type described, comprising a base, a column mounted thereon for rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement therealong and for movement along a horizontal axis perpendicular to said vertical axis, a wrist member mounted at an end of said arm for rotary movement about said horizontal axis and for swinging about a central vertical axis perpendicular thereto, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for reciprocally rotating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for rotating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, servo-valve means associated with each of said actuators for controlling the flow of fluid thereto and electrical control means for operating said valve means separately or in combination.",
  ),
  claim(
    2,
    "In a machine for performing work of the type described, apparatus for reciprocally moving a horizontal arm within a carriage vertically movable on a rotatable column, comprising a pair of hydraulic motor units mounted on said column, each of said units comprising a cylinder and fluid actuated plunger, a source of fluid under pressure connected to each of said units, means regulating the flow of fluid to and from said units to actuate said plungers for unitary reciprocal movement, and gear means connecting said plungers and said arm for translating the movement of said plungers to said arm.",
  ),
  claim(
    3,
    "In a machine for performing work of the type described, apparatus for reciprocally moving a horizontal arm within a carriage vertically movable on a rotatable column, comprising a pair of hydraulic motor units mounted on said column for movement therewith, each having a cylinder and fluid actuating plunger, a source of fluid under pressure, conduit means connecting said source and each of said units, servo-valve means for regulating the flow of fluid selectively to and from said units to cooperatively actuate said plungers in linear reciprocal directions, control means for operating said valves in a prescribed sequence, first gear means interconnecting said pistons for translating their linear movement to rotary motion, an elongated grooved rod secured at one end to said first gear means so as to rotate therewith and having its other end extending through said carriage, second gear means mounted on said carriage to move vertically on said rod and keyed thereto so as to rotate therewith, and a rack fixedly mounted on said arm engaging said second gear means, whereby the reciprocal linear movement of said plungers is translated to said arm.",
  ),
  claim(
    4,
    "In a machine for performing work of the type described, apparatus for engaging and handling a work piece, comprising a substantially hollow tubular arm having work handling means mounted at an end thereof, said work handling means being adapted to manipulate a work piece and to be rotated about the longitudinal axis of said arm and about a central axis perpendicular thereto, a plurality of movable sleeve members mounted within said arm adapted to be actuated by fluid pressure, one of said sleeve members being adapted to manipulate said work handling means, another of said sleeve members being adapted to rotate said work handling means about said longitudinal axis and a third of said sleeve members being adapted to rotate said work handling means about said perpendicular axis, means separating said sleeve members to permit distinct actuation of each, means respectively connecting each of said sleeve members to said work handling means, a source of fluid under pressure, conduit means connecting said source to said arm in position to actuate said sleeve members, servo-valve means regulating the flow of said fluid to operate each of said sleeve members and control means for automatically operating said servo-valve means in a prescribed sequence.",
  ),
  claim(
    5,
    "Apparatus according to claim 4 including means for limiting the movement of said sleeve members and said work handling means.",
  ),
  claim(
    6,
    "Apparatus according to claim 4 including spring means normally biasing said sleeve members from actuating said work handling means.",
  ),
  claim(
    7,
    "Apparatus according to claim 4 wherein said work handling means comprises a gripper having a pair of fingers adapted to engage and hold a work piece.",
  ),
  claim(
    8,
    "A machine of the type described, comprising a base, a column mounted thereon for rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement along said axis, and for movement along a horizontal axis perpendicular to said column, a wrist member mounted at an end of said arm for rotary movement about said horizontal axis and for swinging movement about a central vertical axis perpendicular to said horizontal axis, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for oscillating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for oscillating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, servo-valve means associated with each of said actuators for controlling the flow of fluid thereto, a programming arm mounted on said machine for manually directing the movement of said column, said arm, said wrist member and the operation of said work manipulating through a prescribed path of travel and operation, means producing an electrical signal responsive to the movement of said programming arm respective to each of said servo-valves for controlling each of said actuators to operate said machine through said prescribed path of travel and operation, means for sensing the movement and operation of each of said actuators and for indicating the same as series of electrical signals respectively associated with each of said actuators, means for recording said second mentioned series of signals, means for repetitively playing back said second series of signals and feeding the same to said servo-valves to automatically operate said machine.",
  ),
  claim(
    9,
    "A machine of the type described, comprising a base, a column mounted thereon for reciprocal rotary movement about a vertical axis, a horizontal arm mounted on said column for vertical movement along said axis, and for movement along a horizontal axis perpendicular to said vertical axis, a wrist member mounted at an end of said arm for reciprocal rotary movement about said horizontal axis and for reciprocal swinging movement about a central vertical axis perpendicular thereto, a work manipulating member mounted on said wrist member for engaging and handling a work piece, a first hydraulic actuator including means coupled to said column for oscillating said column, a second hydraulic actuator including means coupled to said arm for raising and lowering said arm, a third hydraulic actuator including means coupled to said arm for reciprocally moving said arm along said horizontal axis, a fourth hydraulic actuator including means coupled to said wrist member for oscillating said wrist member, a fifth hydraulic actuator including means coupled to said wrist member for swinging said wrist member, a sixth hydraulic actuator including means coupled to said work manipulating member for operating said work manipulating member, a source of fluid under pressure, conduit means connecting said source to each of said hydraulic actuators, electrically controlled servo-valve means located within each conduit controlling the flow of fluid to said hydraulic actuators, a programming arm mounted on said machine for manually directing the movement of said column, said arm, said wrist member and the operation of said work manipulating member through a prescribed path of travel and operation, means producing an electrical signal responsive to the movement of said programming arm respective to each of said servo-valves for controlling each of said actuators to operate said machine through said prescribed path of travel and operation, means continuously sensing the movement and operation of each of said actuators with respect to fixed initial positions, and for indicating the same as series of electrical signals, means for recording said second series of signals, means for repetitively playing back said second series of signals and feeding the same to said servo-valves to automatically operate said machine.",
  ),
  claim(
    10,
    "The machine according to claim 9 wherein said sensing means includes a variable transformer resolver associated with each of said column and arm actuators and including means connecting the associated resolvers with its respective actuator respectively.",
  ),
  claim(
    11,
    "The machine according to claim 9 wherein said sensing means includes a signal generator associated with each of the actuators for said wrist and work manipulating members, said generators producing a signal indicative of the movement and operation of said members.",
  ),
  claim(
    12,
    "A work handling device comprising an arm, a housing located at one end of said arm, a pair of gripping fingers extending from said housing and adapted to hold a work piece, said fingers being respectively mounted on a pair of engaging pinions, one of said pinions being located substantially centrally of said housing, said pinions being cooperatively rotatable in opposite directions and conjointly movable about a vertical axis passing through said centrally located pinion, means for rotating one of said pinions to angularly move said fingers toward and away from each other and for conjointly moving said pinions to angularly swing said fingers about said vertical axis.",
  ),
  claim(
    13,
    "The device according to claim 12 wherein said means for rotating and moving said pinions comprise at least a pair of linearly movable racks located in said arm and extending into said housing in engagement with said pinions, said racks being selectively movable separately or in combination.",
  ),
  claim(
    14,
    "The device according to claim 12 including means for limiting the conjoint movement of said fingers comprising a substantially U shaped channel structure formed in the lower portion of said housing and mounted for rotatable movement in conjunction with said centrally located pinion, a plurality of rollers located in said channel, adjustable means for limiting the length of said channel, and abutment means located in said channel for engaging said rollers and stopping the rotation of said channel structure.",
  ),
];

export const amfVersatranArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: SOURCE_SHA256,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks,
};

export const amfVersatranParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The grant frames its invention as a machine that repeats a prescribed sequence on objects. This source-era functional label must not be silently expanded into a claim about every later robotic device.",
  ],
  3: [
    "The opening problem is flexible handling, assembly, and transfer work. The inventors contrast a reusable programmed machine with factory tasks otherwise carried out by human workers and workstations.",
  ],
  4: [
    "The prior examples include automated machine tools and calculated straight-line apparatus. Their stated limitation is specialization: a tool built for one job was not readily repurposed for another.",
  ],
  5: [
    "The illustrated machine combines three basic motions—vertical, horizontal, and rotary—with three supplemental motions. The patent presents that multiplicity as the practical basis for varied programmed operations.",
  ],
  6: [
    "The patent describes manual programming through travel paths and allows changing playback time scale. It does not publish a numerical accuracy, timing, or dynamic-performance specification.",
  ],
  8: [
    "The illustrated topology is a horizontal arm on a vertically moving carriage and a rotating column. The source identifies the three structural motions but supplies no dimensional drawing scale for a calibrated model.",
  ],
  9: [
    "The hydraulic system routes pump output through a reservoir, filter, actuators, accumulator, and radiator. The document describes circuit arrangement, not pressure, flow, temperature, or actuator-area ratings.",
  ],
  10: [
    "The carriage drive uses rack-and-pinion geometry to make carriage travel twice that of the yoke block. This is a literal 2:1 motion multiplication stated in the specification.",
  ],
  11: [
    "The horizontal drive states approximately 3:1 and 1.66:1 gear stages, giving approximately 5:1 overall arm motion. This ratio is published; absolute arm travel is not.",
  ],
  12: [
    "Two racks coordinate the gripper fingers during swing, while one rack alone opens or closes them. The distinction lets workpiece orientation remain fixed while the finger assembly swings.",
  ],
  13: [
    "A detachable programming arm guides the desired operation. The source does not say that an operator physically leads the production manipulator through the trajectory; it describes a separate programming mechanism.",
  ],
  14: [
    "Resolvers track column, carriage, and arm positions as variable transformers with stators and rotors. The record establishes a position-signal topology, not a calibration from phase to SI displacement.",
  ],
  15: [
    "The programming arm records desired machine motion on a medium such as magnetic tape. Playback therefore repeats a recorded command sequence rather than calculating a path from a modern digital robot program.",
  ],
  16: [
    "The error detector compares resolver voltage ER with tape command voltage ET and produces an output approximately proportional to their phase difference. That comparison is the source-supported feedback relationship.",
  ],
};

export function amfVersatranClaimText(number: number): string {
  const block = amfVersatranArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`AMF Versatran manual edition is missing claim ${String(number)}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
