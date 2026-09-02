import {
  lemelsonAdjustableManipulatorArchivalEdition,
  lemelsonAdjustableManipulatorClaimText,
} from "@/data/editions/lemelsonAdjustableManipulatorEdition";
import type { Patent, PatentClaim } from "@/types/patent";

const EXPECTED_PDF_SHA256 = "e7be38b9f72cba77958ddab0422e147a6947056e4d51dddc7559508723cbdf34";

function decodedClaim(
  number: number,
  isIndependent: boolean,
  plainEnglish: string,
  keyInnovations: string[],
  dependsOn?: number[],
  legalSignificance?: string,
): PatentClaim {
  return {
    number,
    isIndependent,
    originalText: lemelsonAdjustableManipulatorClaimText(number),
    plainEnglish,
    keyInnovations,
    dependsOn,
    legalSignificance,
  };
}

export const lemelsonAdjustableManipulatorPatent: Patent = {
  id: "us-3260375-lemelson-adjustable-manipulator",
  patentNumber: "US 3,260,375",
  title: "Adjustable Manipulator",
  shortTitle: "Lemelson Adjustable Manipulator",
  subtitle:
    "Overhead Carriage, Rotating Column, Articulated Wrist, and Sequential Limit-Switch Control",
  inventors: ["Jerome H. Lemelson"],
  inventorLocation: "Metuchen, New Jersey",
  filingDate: "1963-01-14",
  grantDate: "1966-07-12",
  era: "Space Age & Computing (1950–1970)",
  category: "computing",
  categoryLabel: "Robotics & Industrial Automation",
  summary:
    "Jerome H. Lemelson's grant describes an article manipulator with a track-guided carriage, a vertically movable column, rotary and pivoting arm joints, article-seizing means, and positionally adjustable switch actuators. Its specification presents limit-switch control as an alternative to a programming device for selected cyclic motions; its numbered claims define particular rotary, joint, article-manipulation, conveying, and seizing combinations.",
  heroQuote:
    "The primary object of this invention is to provide an automatic manipulator apparatus which is applicable to many automation functions without the need for complex automatic control apparatus such as recording or numerical control means.",
  originalPdfUrl: "/patents/pdfs/us-3260375-lemelson-adjustable-manipulator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3260375A/en",
  usptoClassification: "214/1",
  originalTextAsset: {
    url: "/patents/transcripts/us-3260375-lemelson-adjustable-manipulator-reviewed.txt",
    pageCount: 11,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SapphireElm)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: EXPECTED_PDF_SHA256,
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "July 12, 1966. J. H. LEMELSON. 3,260,375. ADJUSTABLE MANIPULATOR.",
        sourceRelationship:
          "Sheet 1 of 3: Figs. 1, 2, 2' showing overhead track, carriage, telescoping column, and dovetail limit stop.",
      },
      {
        page: 2,
        exactSourceText: "July 12, 1966. J. H. LEMELSON. 3,260,375. ADJUSTABLE MANIPULATOR.",
        sourceRelationship:
          "Sheet 2 of 3: Figs. 3, 4, 5, 6 showing circular stop channel, stop fastening, and wrist pivot joint.",
      },
      {
        page: 3,
        exactSourceText: "July 12, 1966. J. H. LEMELSON. 3,260,375. ADJUSTABLE MANIPULATOR.",
        sourceRelationship:
          "Sheet 3 of 3: Fig. 7 showing sequential electromechanical control block diagram.",
      },
      {
        page: 4,
        exactSourceText:
          "United States Patent Office 3,260,375 Jerome H. Lemelson, 8B Garfield Apts., Metuchen, N.J. ADJUSTABLE MANIPULATOR Filed Jan. 14, 1963, Ser. No. 251,411 17 Claims. (Cl. 214–1) Patented July 12, 1966 This invention relates to automatic article manipulation apparatus and is a continuation-in-part of my application entitled Automatic Conveying Apparatus, Serial No. 477,467, which was filed on December 24, 1954, and now abandoned.",
        sourceRelationship:
          "Specification columns 1–2: Title, objectives, figure list, overhead carriage, and track drive.",
      },
      {
        page: 5,
        exactSourceText:
          "A reversible gear motor Mz is shown secured to the side wall of column 23 and has a pulley or sprocket wheel 30 secured to its output shaft.",
        sourceRelationship:
          "Specification columns 3–4: Telescoping vertical column, rotary turntable, and articulated wrist assembly.",
      },
      {
        page: 6,
        exactSourceText:
          "As stated, in a preferred mode of operation, the apparatus of FIGS. 1 and 2 may be operated solely by the actuation of a plurality of limit switches and adjustable actuation means associated with the various manipulator arms.",
        sourceRelationship:
          "Specification columns 5–6: Limit switch control and longitudinal dovetail stop construction.",
      },
      {
        page: 7,
        exactSourceText:
          "FIG. 3 is a partially exploded view showing details of a rotatable joint assembly such as that defined between components 23′a and carriage 22 or arms 35′ and 85.",
        sourceRelationship:
          "Specification columns 7–8: Circular stop track 45, threaded stop pins 36, and slip ring electrical collectors.",
      },
      {
        page: 8,
        exactSourceText:
          "FIGS. 5 and 6 illustrate details of a rotary joint such as that defined by the notation 50 in FIG. 2.",
        sourceRelationship:
          "Specification columns 9–10: Bevel sector wrist joint, sequential relay handoff logic, and diode gate pulse paths.",
      },
      {
        page: 9,
        exactSourceText:
          "I CLAIM: A rotatable assembly for use in article manipulators and the like comprising in combination with a first assembly including manipulator elements, a second assembly including a carriage, guide means for guiding said carriage along a predetermined path, first power means for driving said carriage along said predetermined path, rotational coupling means between said second assembly and said first assembly, second power means for rotating said first assembly on said second assembly about a predetermined rotational axis, means for controlling said power means and starting and stopping movement of said carriage along said predetermined path",
        sourceRelationship: "Claims columns 11–12: Heading and Claims 1–6.",
      },
      {
        page: 10,
        exactSourceText:
          "An assembly in accordance with claim 6, said actuator means comprising a plurality of actuator pins each provided with means for removably securing it to said switch actuator plate against the circular formation therein.",
        sourceRelationship: "Claims columns 13–14: Claims 7–14.",
      },
      {
        page: 11,
        exactSourceText:
          "Automatic conveying apparatus comprising in combination, a self-propelled conveyor including a first conveying means, a servo means for driving said first conveying means along a first guide means, said first conveying means having a second guide means secured thereto",
        sourceRelationship:
          "Claims columns 15–16: Claims 15–17, cited references, and examiner signatures.",
      },
    ],
  },
  archivalEdition: lemelsonAdjustableManipulatorArchivalEdition,
  originalText:
    "This invention relates to automatic article manipulation apparatus and is a continuation-in-part of my application entitled Automatic Conveying Apparatus, Serial No. 477,467, which was filed on December 24, 1954, and now abandoned.\n\nThis invention is particularly concerned with article manipulation apparatus and tooling which is automatically controllable in a predetermined cycle of operative movements to perform many different functions associated with manufacturing operations which would ordinarily require the labor of one or more human beings. Heretofore, article manipulation apparatus has consisted of specialized, inflexible equipment designed and developed to perform a particular work tool or article manipulation function automatically.\n\nOther article manipulation devices have been developed since the filing of my aforementioned parent application, Ser. No. 477,467, now abandoned, and are illustrated in said application which are programmable by means of presettable means or command signals generated from recordings. However, such apparatus is relatively complex and costly since it involves, in addition to variable controls, feedback control elements, motor speed and braking controls and a programming means or positional computer.",
  plainEnglishExplanation: {
    overview:
      "The specification contrasts specialized article-handling equipment with a mechanism whose motion limits may be changed by repositioning actuators for limit switches. Its claimed subject is not a general-purpose robot: it is a family of mechanical combinations in which guided travel, rotation or pivoting, article-seizing means, switch actuators, and power controls meet at selected positions. The patent gives no payload, speed, repeatability, force, or production-rate figures, so the exhibit confines itself to topology and switch-event relationships.",
    coreMechanism:
      "A guide carries a carriage to a chosen position. Relative motion then brings an adjustable actuator into a limit switch's scanning path. In the described arrangements, a switch event can stop a presently moving member and can be connected to a later control event; Claims 13–16 express the same idea for linear travel, azimuth rotation, article seizing, and a repetitive conveying cycle. The displayed sequence is a normalized reading of those disclosed motion relationships, not a reconstructed production program or a quantitative control model.",
    mechanicalBreakdown: [
      {
        title: "Overhead Carriage & Gantry Track",
        summary:
          "A carriage runs along the illustrated overhead track and carries the manipulator assembly.",
        technicalDetails:
          "In the specification, reversible gear motor $M_x$ drives toothed wheel $26$ against toothed track $26'$. Brushes or sliding elements collect power from overhead wires $28$. The grant supplies the arrangement but no track length, gear ratio, motor rating, or travel speed.",
        modernEquivalent: "Overhead Cartesian gantry robot / 7th-axis linear transfer rail",
      },
      {
        title: "Telescoping Vertical Mast & Elevation Hoist",
        summary: "A vertically movable tubular column changes the elevation of the lower assembly.",
        technicalDetails:
          "The text describes reversible motor $M_z$, sprockets $30$ and $32$, and chain or belt $31$ raising and lowering column $23' within column $23$. It separately describes adjustable actuation means and limit switches; the viewer therefore shows normalized stroke and stop settings rather than an inferred lead-screw geometry or SI travel.",
        modernEquivalent: "Telescoping vertical lift actuator / Z-axis hoist column",
      },
      {
        title: "Rotary Azimuth Turntable Joint",
        summary:
          "A column and the assembly below it rotate relative to the carriage about the illustrated vertical axis.",
        technicalDetails:
          "The disclosed spur gear $43$ and motor gear $44$ rotate column $23'a. A circular formation and selectable switch actuators are the important legal features of Claims 1–8; the exhibit uses a normalized azimuth coordinate because the grant does not provide a complete angular range, inertia, or stopping accuracy.",
        modernEquivalent: "Robotic base azimuth turntable / J1 rotational axis",
      },
      {
        title: "Articulated Wrist Pitch Joint",
        summary: "A yoke, shaft, and gear plate form a pivoting joint for a further arm assembly.",
        technicalDetails:
          "The specification describes yoke $53$, shaft $60$, a gear plate, a reversible motor, and selectable limit-switch actuators. It mentions a gear sector of approximately $240^\\circ$ in its drawing discussion. The visual represents only the pivot topology and selected stops; it does not infer link length, torque, or a modern wrist-axis count.",
        modernEquivalent: "Robotic pitch wrist / J4-J5 articulated yoke joint",
      },
      {
        title: "Parallel Jaw Workpiece Gripper",
        summary:
          "The illustrated head uses openable and closable jaws; the specification also names other retaining or working means.",
        technicalDetails:
          "The text identifies jaws $87a$ and $87b$, linkage $84$, and a possible servo arrangement. It also permits forks, platforms, magnetic, suction, and other power-operated devices. Claim 16 concerns a signal that stops relative arm rotation and starts the retaining or seizing means; no gripping force or workpiece mass is stated.",
        modernEquivalent: "Parallel-jaw pneumatic/servo gripper",
      },
      {
        title: "Sequential Limit-Switch Relay Controller",
        summary:
          "Limit switches and adjustable actuators select positional events in a described cycle.",
        technicalDetails:
          "The specification describes bi-stable limit switches, adjustable actuation means, motor-control circuits, and optional diode elements. Claims 8, 13–16 make selected switch-actuated stop/start relationships legally important. This is not a claim that every movement is software-free or that the depicted circuit guarantees collision avoidance.",
        modernEquivalent: "Programmable Logic Controller (PLC) sequence / Relay ladder logic",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Sequential Relay Interlocking & Asynchronous Handoff",
        formula:
          "\\text{Trip}(\\theta_i) = \\mathbb{I}\\left(|\\theta_i - \\theta_{\\text{stop},i}| < \\epsilon\\right) \\implies S_i = \\text{STOP} \\;\\wedge\\; F_{i+1} = \\text{PULSE}",
        explanation:
          "This is a pedagogical Boolean abstraction of the disclosed switch-and-actuator relationship, not a measured contact law. It marks the selected normalized coordinate at which the viewer treats a limit switch as actuated. The grant gives no switch travel, tolerance, debounce, timing, motor-load, or reliability data.",
      },
      {
        principle: "Forward Kinematic Chain Transformation",
        formula:
          "\\mathbf{p}_{\\text{tool}} = \\mathbf{p}_{\\text{carriage}} + \\mathbf{R}_z(\\theta) \\left[ \\mathbf{d}_{\\text{column}} + \\mathbf{R}_y(\\phi) \\mathbf{l}_{\\text{arm}} \\right]",
        explanation:
          "This is a normalized kinematic notation for the illustrated guide, vertical member, rotary column, pivoting joint, and end member. It explains which displayed pose changes with each control. None of its vector lengths is presented as a dimension from the patent, and the telemetry labels these outputs as normalized display coordinates.",
      },
    ],
    whyItMattersToday:
      "The document is a compact case study in a still-recognizable engineering distinction: geometry can be supplied by guides and joints, while the order of a fixed cycle can be supplied by physical position events. Its readable value today is not a claimed line of descent to every gantry robot or PLC, but the way Claims 1–16 separate carriage travel, joint motion, adjustable stops, switch actuation, and article handling into concrete legal combinations.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 covers a rotatable assembly with a track-guided carriage, power for carriage travel, a rotational coupling, power for relative rotation, and two switch/actuator relationships. A first switch stops carriage movement and permits rotation; a second switch stops the rotating assembly at positions selected by its cooperating actuators.",
      [
        "Overhead carriage and track drive combination",
        "Rotational coupling between carriage and manipulator arm",
        "Coordinated limit switches stopping carriage and permitting arm rotation",
      ],
      undefined,
      "The first independent claim links guided carriage movement, rotation, and two distinct position-switch relationships in one legal combination.",
    ),
    decodedClaim(
      2,
      false,
      "The assembly of claim 1 wherein the rotational switch actuation means comprises multiple separate switch actuators disposed in a circular path centered on the rotational axis.",
      ["Circular array of rotational switch actuators"],
      [1],
    ),
    decodedClaim(
      3,
      false,
      "The assembly of claim 2 wherein the switch actuators are positionally adjustable to a plurality of different angular locations to vary the stopping attitudes of the arm.",
      ["Positionally adjustable angular stop actuators"],
      [2],
    ),
    decodedClaim(
      4,
      false,
      "The assembly of claim 3 in which separately positionable elements at angular locations predetermine the annular location and degree of relative movement at the end of each part of a positional cycle.",
      ["Angularly positionable cycle-limit elements"],
      [3],
    ),
    decodedClaim(
      5,
      true,
      "A rotatable manipulator assembly having a carriage, guide track, carriage drive motor, rotary joint, rotary drive motor, and a switch actuator plate with a concentric circular formation that slidably engages adjustable actuator stops for predetermining angular motion limits.",
      [
        "Concentric circular slotted guide formation in actuator plate",
        "Slidably adjustable actuator stop elements",
        "Mechanical radial and angular stop positioning",
      ],
      undefined,
      "Independent mechanical sub-combination protecting the circular slotted stop plate.",
    ),
    decodedClaim(
      6,
      false,
      "The assembly of claim 5 wherein the limit switch is mounted offset from the rotational axis with an actuator arm positioned to engage each stop actuator.",
      ["Offset electromechanical limit switch with radial actuator arm"],
      [5],
    ),
    decodedClaim(
      7,
      false,
      "The assembly of claim 6 wherein the actuators are removable pins fastened securely against the circular formation of the actuator plate.",
      ["Removable threaded stop pins clamping in circular slot"],
      [6],
    ),
    decodedClaim(
      8,
      true,
      "Claim 8 adds a bi-stable limit switch to the rotatable assembly. At a first selected position one actuator closes a first set of contacts and stops the assembly; at a further position another actuator closes a further set of contacts and further means stop the assembly there.",
      [
        "Bi-stable limit switch with multiple contact sets",
        "First contact set at a selected rotary position",
        "Further contact set at a further rotary position",
      ],
      undefined,
      "This independent claim makes the bi-stable switch and two selected rotary stopping positions part of the protected combination.",
    ),
    decodedClaim(
      9,
      true,
      "Claim 9 covers two pivotally connected joint members, power that rotates one relative to the other, an offset limit switch, and first and second switch-activating means. Those activators define selectable limits of the relative arc and stop the joint at each limit.",
      [
        "Articulated two-member pivoting joint",
        "Offset limit switch scanning pivoting arc",
        "First and second selectable arc-limit activators",
      ],
      undefined,
      "This independent claim isolates the pivot-joint and selectable-arc-limit arrangement; it does not require the illustrated end effector.",
    ),
    decodedClaim(
      10,
      false,
      "The joint of claim 9 wherein the limit switch actuator arm projects outward to engage index member stop surfaces at the respective arc limits.",
      ["Projecting switch arm engaging arc index surfaces"],
      [9],
    ),
    decodedClaim(
      11,
      false,
      "The joint of claim 9 wherein each switch actuator is adjustably positionable along a circular path to vary the rotational stroke coordinates.",
      ["Continuously adjustable arc stop locations"],
      [9],
    ),
    decodedClaim(
      12,
      false,
      "The joint of claim 11 wherein a shaft extends normal to a joint plate containing a concentric circular slotted hole, with clamping stop pins projecting into the switch arm path.",
      ["Circular slotted hole concentric with joint shaft and clamping pins"],
      [11],
    ),
    decodedClaim(
      13,
      true,
      "Claim 13 covers article manipulation apparatus with a support, an arm assembly, linear-translation and azimuth-rotation power means, article-seizing means, and first and second limit-switch arrangements. At least one arrangement has two positionally adjustable limit-defining means, and the controls coordinate the stated motions.",
      [
        "Linear translation, azimuth rotation, and article-seizing power means",
        "Linear limit switch scanning linear stroke stops",
        "Rotary limit switch scanning azimuth rotation stops",
      ],
      undefined,
      "This independent claim combines the two coordinate types with article-seizing means and adjustable limits; its terms define the legal boundary more precisely than a generic robot label.",
    ),
    decodedClaim(
      14,
      true,
      "Claim 14 independently specifies article manipulation apparatus with linear, azimuth, and article-seizing power means plus first, second, and third limit-switch arrangements. The third arrangement is on relatively movable parts of the article-seizing means, and all three coordinate driving, retaining, and releasing between their selected limits.",
      [
        "3-axis limit switch coordination: linear, rotary, and gripper",
        "Gripper actuation directly linked into sequence state machine",
      ],
      undefined,
      "This independent claim adds an article-seizing switch arrangement to the two-coordinate arrangement rather than depending on Claim 13.",
    ),
    decodedClaim(
      15,
      true,
      "Claim 15 covers an automatic conveying apparatus with a self-propelled first conveying means, two further fixtures moving on stated paths, three servo means, and adjustable control means. When a moving part reaches a selected position, a switching means causes one servo to stop and another to start, allowing repeatable cycles with changed travel limits.",
      [
        "Self-propelled conveying means with successive fixtures",
        "Selected-position servo stop and start relationship",
        "Adjustable travel-limit control means",
      ],
      undefined,
      "This independent conveying claim is the clearest legal expression of a selected-position stop/start control relationship in a repetitive cycle.",
    ),
    decodedClaim(
      16,
      true,
      "Claim 16 covers a manipulator with retaining and seizing means, two relatively rotatable arms, a limit switch, circularly moving actuator means, and separate power for relative rotation and seizing. An activated switch produces a stop signal for rotation and a start signal for the seizing means at the selected arm position.",
      [
        "Dual-signal limit switch event",
        "Stop rotation command paired with simultaneous gripper actuation command",
      ],
      undefined,
      "This independent claim makes the paired stop/start signals at a selected rotational position legally explicit.",
    ),
    decodedClaim(
      17,
      false,
      "The manipulator joint of claim 9 further comprising a reversible motor driving a pinion that meshes with a circular array of gear teeth on the peripheral edge of a joint plate.",
      ["Peripheral sector gear plate driven by reversible pinion motor"],
      [9],
    ),
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Track-Guided Carriage and Manipulator Assembly",
      caption:
        "Source Fig. 1 shows track 21, carriage 22, the illustrated column members, arm assembly, and jaw means 87.",
      svgType: "lemelson-manipulator-elevation",
      callouts: [
        {
          id: "callout-1",
          figureRef: "Fig. 1",
          label: "Overhead Support Track",
          element: "21",
          description: "The illustrated trackway along which the carriage is guided.",
          x: 20,
          y: 15,
        },
        {
          id: "callout-2",
          figureRef: "Fig. 1",
          label: "Trolley Carriage",
          element: "22",
          description:
            "The carriage carrying the illustrated manipulator assembly; the specification describes motor Mx and toothed wheel 26 for travel.",
          x: 45,
          y: 25,
        },
        {
          id: "callout-3",
          figureRef: "Fig. 1",
          label: "Telescoping Vertical Column",
          element: "23",
          description:
            "Column 23 and its vertically movable member 23' in the described arrangement.",
          x: 45,
          y: 55,
        },
        {
          id: "callout-4",
          figureRef: "Fig. 1",
          label: "Manipulator Arm & Jaws",
          element: "87",
          description:
            "The illustrated jaw means; the specification also permits other retaining or handling means.",
          x: 75,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Rotatable Column, Joint, and Jaw Assembly",
      caption:
        "Source Fig. 2 shows the rotatable column arrangement, gear 43, joint 50, arm assemblies, and jaw assembly.",
      svgType: "lemelson-manipulator-assembly",
      callouts: [
        {
          id: "callout-5",
          figureRef: "Fig. 2",
          label: "Base Turntable Spur Gear",
          element: "43",
          description:
            "The large spur gear described as secured to the bottom wall of carriage 22 in the Fig. 2 arrangement.",
          x: 35,
          y: 20,
        },
        {
          id: "callout-6",
          figureRef: "Fig. 2",
          label: "Articulated Wrist Joint",
          element: "50",
          description:
            "The joint assembly identified by notation 50 in the specification and described in connection with Figs. 5 and 6.",
          x: 65,
          y: 45,
        },
        {
          id: "callout-7",
          figureRef: "Fig. 2",
          label: "Gripper Actuator Wedge",
          element: "84",
          description:
            "Linkage notation 84 associated with the illustrated jaw assembly; the text does not state a gripping force.",
          x: 80,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "Circular Switch-Actuator Track and Rotatable Assembly",
      caption:
        "Source Fig. 3 shows the rotatable joint detail, including circular formation 45 and the illustrated switch-actuator arrangement.",
      svgType: "lemelson-manipulator-stops",
      callouts: [
        {
          id: "callout-8",
          figureRef: "Fig. 3",
          label: "Circular Stop Channel",
          element: "45",
          description:
            "The circular formation used with the selectable switch-actuator arrangement.",
          x: 50,
          y: 40,
        },
        {
          id: "callout-9",
          figureRef: "Fig. 3",
          label: "Adjustable Stop Pins",
          element: "36",
          description:
            "Illustrated actuator elements positioned to engage a limit switch; Claims 5–8 specify the related legal combinations.",
          x: 65,
          y: 35,
        },
        {
          id: "callout-10",
          figureRef: "Fig. 3",
          label: "Power Slip Rings",
          element: "67, 68",
          description: "Conductive-ring and brush elements shown in the rotary-joint detail.",
          x: 30,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "7",
      title: "Forward, Stop, and Reverse Control Diagram",
      caption:
        "Source Fig. 7 diagrams forward, stop, and reverse controls for the described carriage, column, rotary, arm, and jaw motions.",
      svgType: "lemelson-manipulator-schematic",
      callouts: [
        {
          id: "callout-11",
          figureRef: "Fig. 7",
          label: "Carriage Limit Switch",
          element: "SWx",
          description: "The carriage-switch notation in the source control diagram.",
          x: 20,
          y: 20,
        },
        {
          id: "callout-12",
          figureRef: "Fig. 7",
          label: "Azimuth Rotary Limit Switch",
          element: "SWR",
          description: "The rotary-switch notation in the source control diagram.",
          x: 50,
          y: 45,
        },
        {
          id: "callout-13",
          figureRef: "Fig. 7",
          label: "Pulse Steering Diodes",
          element: "76-78",
          description: "Diode elements shown in the described control-circuit discussion.",
          x: 80,
          y: 65,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification says earlier article-manipulation apparatus tended to be specialized and inflexible, and describes programmable alternatives as relatively complex and costly because they involved variable controls, feedback, motor speed and braking controls, and a programming means or positional computer.",
    priorArtLimitations: [
      "The grant characterizes earlier article-manipulation apparatus as specialized, inflexible equipment developed for a particular tool or article function.",
      "It describes other programmable apparatus as involving variable controls, feedback control elements, motor-speed and braking controls, and a programming means or positional computer.",
      "It identifies cyclic variation through adjustable limit-switch actuators as an object; it does not document comparative uptime, cost, adoption, or labor savings.",
    ],
    breakthroughInsight:
      "The patent pairs a mechanical manipulator with adjustable actuator positions and limit-switch control. In the independent claims, the resulting idea appears at several scales: a carriage/rotary assembly, a pivoting joint, article-seizing apparatus, a conveying mechanism, and a stop-signal/start-signal relationship at a selected arm position.",
    patentWars: [],
    civilizationalImpact:
      "The grant makes a useful historical teaching document because its drawings and claims put motion geometry and event sequencing side by side: guides and joints establish reachable poses, while selected switch-actuator contacts establish boundaries in a cycle. This record deliberately makes no unsupported assertion that this particular grant created a later industry, controller family, or commercial deployment.",
    funFact:
      "The same specification that depicts jaws expressly lists forks, a platform, magnetic and suction retaining means, and other power-operated devices as possible replacements for the illustrated jaw assembly.",
    aftermath:
      "No patent-war or deployment claim is entered for US 3,260,375 here because the reviewed primary record establishes the grant's content, not a specific later lawsuit, license, or production installation. The legal instrument and its source-bounded model remain the basis for this entry.",
  },
  stats: {
    totalClaims: 17,
    independentClaims: 8,
  },
};
