import type { Patent, PatentClaim } from "@/types/patent";
import {
  amfVersatranArchivalEdition,
  amfVersatranClaimText,
} from "../editions/amfVersatranEdition";

const PATENT_ID = "us-3212649-amf-versatran";
const PDF_SHA256 = "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd";

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
    ...(dependsOn ? { dependsOn } : {}),
    originalText: amfVersatranClaimText(number),
    plainEnglish,
    keyInnovations,
    ...(legalSignificance ? { legalSignificance } : {}),
  };
}

export const amfVersatranPatent: Patent = {
  id: PATENT_ID,
  patentNumber: "US 3,212,649",
  title: "Machine for Performing Work",
  shortTitle: "AMF Versatran Programmed Manipulator",
  subtitle: "Hydraulic column, carriage, arm, wrist, gripper, and tape-playback control",
  inventors: ["Harry T. Johnson", "Veljko Milenkovic", "John Walter"],
  inventorLocation: "Glenview, Chicago, and Evergreen Park, Illinois",
  grantDate: "1965-10-19",
  filingDate: "1960-07-15",
  era: "Atomic & Space Age (1940–1970)",
  category: "computing",
  categoryLabel: "Robotics, Industrial Automation & Servo Control",
  summary:
    "US 3,212,649 claims a machine with a rotatable column, vertically moving carriage, reciprocating horizontal arm, wrist, work manipulator, six hydraulic actuators, and electrical servo-valve control. Its later claims add a detachable programming arm, resolver-derived signals, recording on tape, repetitive playback, and a mechanically coordinated gripper. The grant supplies a specific hydraulic and analog-recording architecture, not a blanket claim to industrial automation.",
  heroQuote:
    "The present invention relates to a machine for performing a plurality of repetitive operations or manipulations with or on objects in accordance with a prescribed patterned sequence.",
  originalPdfUrl: "/patents/pdfs/us-3212649-amf-versatran.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3212649A/en",
  usptoClassification: "U.S. Cl. 214—1 (printed)",
  archivalEdition: amfVersatranArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3212649-amf-versatran-reviewed.txt",
    pageCount: 31,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: PDF_SHA256,
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 1 of 17 facsimile drawing",
      },
      {
        page: 2,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 2 of 17 facsimile drawing",
      },
      {
        page: 3,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 3 of 17 facsimile drawing",
      },
      {
        page: 4,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 4 of 17 facsimile drawing",
      },
      {
        page: 5,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 5 of 17 facsimile drawing",
      },
      {
        page: 6,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 6 of 17 facsimile drawing",
      },
      {
        page: 7,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 7 of 17 facsimile drawing",
      },
      {
        page: 8,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 8 of 17 facsimile drawing",
      },
      {
        page: 9,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 9 of 17 facsimile drawing",
      },
      {
        page: 10,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 10 of 17 facsimile drawing",
      },
      {
        page: 11,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 11 of 17 facsimile drawing",
      },
      {
        page: 12,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 12 of 17 facsimile drawing",
      },
      {
        page: 13,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 13 of 17 facsimile drawing",
      },
      {
        page: 14,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 14 of 17 facsimile drawing",
      },
      {
        page: 15,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 15 of 17 facsimile drawing",
      },
      {
        page: 16,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 16 of 17 facsimile drawing",
      },
      {
        page: 17,
        exactSourceText: "Oct. 19, 1965   H. T. JOHNSON ET AL   3,212,649",
        sourceRelationship: "Sheet 17 of 17 facsimile drawing",
      },
      {
        page: 18,
        exactSourceText: "United States Patent Office  3,212,649",
        sourceRelationship: "Specification columns for page 18 of 31",
      },
      {
        page: 19,
        exactSourceText:
          "ments of the machine to prevent damage to the machine as well as to the article hand",
        sourceRelationship: "Specification columns for page 19 of 31",
      },
      {
        page: 20,
        exactSourceText:
          "With reference to the drawings, the article handling and transfer apparatus sele",
        sourceRelationship: "Specification columns for page 20 of 31",
      },
      {
        page: 21,
        exactSourceText:
          "ally suspended from a forked bracket 160 fixed to the rear side of carrier housing",
        sourceRelationship: "Specification columns for page 21 of 31",
      },
      {
        page: 22,
        exactSourceText:
          "shaped key-ways and keys and securing the latter on hub 252 by screws 249",
        sourceRelationship: "Specification columns for page 22 of 31",
      },
      {
        page: 23,
        exactSourceText:
          "Gripper fingers 324 and 326 are connected to each other through arms 330 and 342",
        sourceRelationship: "Specification columns for page 23 of 31",
      },
      {
        page: 24,
        exactSourceText:
          "contact with a suitable disc 466 secured within the forward end of a stationary ",
        sourceRelationship: "Specification columns for page 24 of 31",
      },
      {
        page: 25,
        exactSourceText:
          "manufactured by the Double A Products Co. of Manchester, Michigan. Solenoid flow",
        sourceRelationship: "Specification columns for page 25 of 31",
      },
      {
        page: 26,
        exactSourceText:
          "end and passes through the same into the servo valve to which the valve is conne",
        sourceRelationship: "Specification columns for page 26 of 31",
      },
      {
        page: 27,
        exactSourceText:
          "A mechanism suitable for effecting the recording of movements in a programmed se",
        sourceRelationship: "Specification columns for page 27 of 31",
      },
      {
        page: 28,
        exactSourceText:
          "in turn are connected to the torque motors of the servo valves 112, 216 and 278,",
        sourceRelationship: "Specification columns for page 28 of 31",
      },
      {
        page: 29,
        exactSourceText:
          "vertical carriage actuator and the column swing actuator effect the desired degr",
        sourceRelationship: "Specification columns for page 29 of 31",
      },
      {
        page: 30,
        exactSourceText:
          "regulating the flow of fluid to and from said units to actuate said plungers for",
        sourceRelationship: "Specification columns for page 30 of 31",
      },
      {
        page: 31,
        exactSourceText:
          "11. The machine according to claim 9 wherein said sensing means includes a signa",
        sourceRelationship: "Specification columns for page 31 of 31",
      },
    ],
  },
  originalText:
    "The present invention relates to a machine for performing a plurality of repetitive operations or manipulations with or on objects in accordance with a prescribed patterned sequence.\n\nThe demands of industry are such that there is an ever increasing need for machines capable of simulating operations and functions of all kinds of workers in handling manipulating, assembling and transferring work, work pieces, machines and objects being fabricated at the work bench, or from one machine to another or in one machine only as the case may be in accordance with prescribed sequences of operations.\n\nAttempts have been made heretofore to solve this problem and machines and attachments have been designed for this purpose. For example, devices have been built to control the automatic operation of machine tools, such as presses and lathes. Also, attempts have been made to operate machines which functioned within prescribed coordinates of motion in response to carefully calculated or computed straight-line paths of movement. Further, such machines required tooling for one job only and were not readily applicable for others.",
  plainEnglishExplanation: {
    overview:
      "The source frames the factory problem as repeatable handling and transfer work without building one fixed-purpose mechanism for every job. Its illustrated answer is a six-motion hydraulic manipulator: column swing, carriage lift, arm travel, two wrist motions, and a work-handling action. The programming mechanism records control and position-related signals while a detachable arm is operated; tape playback sends command signals into a resolver-and-error-detector control path. The issued claims are narrower than the historical idea of a robot: they require the stated mechanical, hydraulic, and electrical combinations.",
    coreMechanism:
      "For the three primary motions, the document couples the physical units to resolvers and records their output signals on tape channels. In replay, each tape command is compared with a resolver signal by an error detector; the specification says the output is approximately proportional to the phase difference. In normalized editorial notation, e_i = wrap(phi_tape,i - phi_resolver,i). The sign of that error directs a servo-valve path toward correspondence. The source also describes separate tape-recorded signals for gripper swing/wrist motion and gripper opening/closing. It prints topology and several gear relationships, but not a calibrated actuator stroke, pressure, flow, mass, payload, valve coefficient, gain, timing, or accuracy result. The live model therefore visualizes normalized configuration and phase relationships and refuses fictional SI force, speed, energy, or positioning claims.",
    mechanicalBreakdown: [
      {
        title: "Column, carriage, and horizontal arm",
        summary:
          "The three basic motions are a rotating column B, vertically moving carriage C, and reciprocatory horizontal arm A.",
        technicalDetails:
          "The specification describes the carriage on the column and the arm in the carriage. The carriage rack arrangement makes its travel twice that of yoke block 150; the arm drive states approximately 3:1 and 1.66:1 gear ratios for an approximately 5:1 overall relationship. The source gives these dimensionless mechanisms but not a link length or travel in metres. A display coordinate may therefore show p_display = cylindrical(column, carriage, arm), but it is not a recovered SI position.",
        archaicTerm: "reciprocatory horizontal arm",
        modernEquivalent: "linearly translating manipulator arm",
      },
      {
        title: "Hydraulic actuation and safety path",
        summary:
          "A motor-driven pump, reservoir, filter, accumulator, radiator, manifolds, safety valves, and servo valves distribute fluid to the primary and gripper actuators.",
        technicalDetails:
          "Claim 1 requires a source of fluid under pressure, conduit means, individual hydraulic actuators, servo-valve means, and electrical control. Figure 46 traces the power-and-return topology, including accumulator D and radiator E. The patent describes pressure regulation and protective valve behavior but never gives a supply pressure, cylinder area, fluid flow, efficiency, or response time. Thus F = pressure times area is explanatory physics, not an evaluable output for this source.",
        archaicTerm: "servo-valve means",
        modernEquivalent: "electrically controlled hydraulic flow-control valves",
      },
      {
        title: "Sleeve-driven wrist and gripper",
        summary:
          "The hollow arm carries sleeve members that independently manipulate the tool, rotate it about the arm axis, and rotate it about a perpendicular axis.",
        technicalDetails:
          "Claim 4 identifies distinct fluid-actuated sleeve members and separate connections to the work-handling means. Claims 12–14 then describe the two gripping fingers, engaging pinions, linearly movable racks, U-shaped channel, rollers, and adjustable stops. The specification explains coordinated swing versus finger opening; it does not state grip force, jaw travel, payload, or a general three-axis wrist specification.",
        archaicTerm: "work manipulating member",
        modernEquivalent: "end effector and mechanically coordinated gripper",
      },
      {
        title: "Programming arm and tape record",
        summary:
          "A detachable programming arm and stick generate control signals while the desired operation is guided and recorded.",
        technicalDetails:
          "Figures 42–45 show the separate programming arm, gimballed head, stick, and linear potentiometers. Figure 47 records primary-axis resolver signals on tape channels 1–3, an excitation signal on channel 4, and gripper-related signals on channels 5–6. The source calls for a recording medium such as magnetic tape; it does not publish a digital trajectory format, sampling rate, or a modern kinesthetic-teaching specification.",
        archaicTerm: "programming arm",
        modernEquivalent: "manual programming input mechanism",
      },
      {
        title: "Resolver feedback and phase error",
        summary:
          "Resolvers turn primary-axis movement into position-related electrical signals; the error detector compares them with tape commands during playback.",
        technicalDetails:
          "The grant calls the resolvers variable transformers with stators and rotors. Figure 49 says its output is approximately proportional to the phase difference between resolver voltage E_R and tape-command voltage E_T. The safe, source-bound statement is e_i = wrap(phi_tape,i - phi_resolver,i), where the values are normalized exhibit phase—not a published volt, shaft-angle calibration, controller-gain, or closed-loop accuracy.",
        archaicTerm: "variable transformer resolver",
        modernEquivalent: "electromechanical position-feedback transducer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Cylindrical configuration topology",
        formula: "p_display = cylindrical(c, l, a)",
        explanation:
          "Column swing, carriage lift, and arm travel provide a useful cylindrical-coordinate display analogy. The patent establishes the three motions, while the formula explicitly names a normalized exhibit position rather than asserting unprinted link dimensions or SI coordinates.",
      },
      {
        principle: "Rack-and-pinion motion multiplication",
        formula: "x_carriage = 2 x_yoke; x_arm approximately 5 x_piston_increment",
        explanation:
          "The specification directly states a 2:1 carriage relationship and an approximately 5:1 arm relationship through its gear train. These relationships describe mechanical transmission; they do not establish absolute stroke, velocity, or force.",
      },
      {
        principle: "Hydraulic actuator boundary",
        formula: "F = Delta P A",
        explanation:
          "Differential pressure times piston area is the governing force relation for an ideal hydraulic actuator. US 3,212,649 does not publish Delta P or A, so no force value is calculated or displayed.",
      },
      {
        principle: "Resolver/tape phase comparison",
        formula: "e_i = wrap(phi_tape,i - phi_resolver,i)",
        explanation:
          "Figure 49 describes an output approximately proportional to phase difference between E_R and E_T. This normalized relationship is enough to show the feedback sign without inventing a voltage scale, gain, bandwidth, or tracking tolerance.",
      },
    ],
    whyItMattersToday:
      "The grant makes a durable engineering point: a flexible handling machine is a coordinated system, not an arm alone. Its claims connect structure, hydraulic power, signal sensing, a record/playback path, and a gripper mechanism. Modern robots normally use different motors, sensors, control hardware, and safety practice, but engineers still have to keep the same distinctions clear—mechanical degrees of freedom, a feedback signal, a command record, actuator authority, and end-effector behavior. This record preserves what this particular 1965 grant actually teaches rather than assigning it unprinted performance or a universal robotics lineage.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 is the broad six-actuator combination. It requires a base, rotatable column, vertically and horizontally movable arm, two stated wrist motions, work manipulator, hydraulic actuators, pressurized-fluid conduits, servo valves, and electrical control. Its legal work is the specified coordinated hydraulic machine, not the abstract idea of an industrial robot.",
      [
        "Rotatable column",
        "Vertically movable carriage",
        "Reciprocatory horizontal arm",
        "Hydraulic actuator set",
        "Servo-valve control",
      ],
      undefined,
      "This is the broadest issued combination claim for the stated mechanical and hydraulic architecture.",
    ),
    decodedClaim(
      2,
      true,
      "Claim 2 isolates a horizontal-arm drive inside a carriage on a rotatable column. Two hydraulic motor units move their plungers reciprocally, and gear means translate that motion to the arm. The scope is a particular hydraulic-and-gear subcombination, not a claim to any telescoping arm or every cylinder-driven slide.",
      ["Paired hydraulic motor units", "Reciprocal plungers", "Gear-translated arm travel"],
    ),
    decodedClaim(
      3,
      true,
      "Claim 3 independently gives a more detailed arm-drive architecture: paired hydraulic units, controlled servo valves, interconnecting gears, a grooved rotating rod through the carriage, a carriage gear keyed to that rod, and an arm rack. It claims the named linear-to-rotary-to-linear transmission path, not an unspecified robot transmission.",
      [
        "Grooved transmission rod",
        "Carriage-keyed gear",
        "Arm rack",
        "Servo-controlled hydraulic units",
      ],
    ),
    decodedClaim(
      4,
      true,
      "Claim 4 independently covers a hollow arm with several distinct fluid-actuated sleeve members. The sleeves separately manipulate the work handler and rotate it about the longitudinal arm axis and a perpendicular axis, with fluid conduits, servo valves, and prescribed control. Its legal center is the separated sleeve-drive arrangement, not any generic robot wrist.",
      [
        "Hollow tubular arm",
        "Separated sleeve members",
        "Longitudinal-axis rotation",
        "Perpendicular-axis rotation",
      ],
    ),
    decodedClaim(
      5,
      false,
      "Claim 5 depends on Claim 4 and adds means for limiting travel of the sleeve members and work-handling means. The dependent scope is a mechanical motion-boundary refinement of the sleeve-driven tool architecture, rather than a general claim to safety limits or travel stops in all automated machinery.",
      ["Sleeve travel limiter", "Work-handling motion limit"],
      [4],
    ),
    decodedClaim(
      6,
      false,
      "Claim 6 depends on Claim 4 and adds springs that normally bias sleeve members away from actuating the work-handling means. The legal addition is a stated return or bias relationship inside the source’s sleeve arrangement, not a broad right over using a spring anywhere near a robotic end effector.",
      ["Spring-biased sleeve members", "Return bias"],
      [4],
    ),
    decodedClaim(
      7,
      false,
      "Claim 7 depends on Claim 4 and makes the work-handling means a gripper with two fingers adapted to engage and hold a workpiece. It narrows the sleeve-drive arm to that two-finger tool form, without claiming every two-finger gripper independently of the parent fluid-actuated architecture.",
      ["Two-finger gripper", "Workpiece engagement"],
      [4],
    ),
    decodedClaim(
      8,
      true,
      "Claim 8 combines the six-actuator machine with a programming arm, signal generation tied to the arm, sensing, recording, and repetitive playback to the servo valves. Its legal work is the complete manually programmed and recorded control arrangement stated in the claim, rather than the broad modern concept of robot programming.",
      [
        "Programming arm",
        "Actuator sensing",
        "Recorded signal sequence",
        "Repetitive servo playback",
      ],
      undefined,
      "This is the principal issued system claim for manual programming, recording, and automatic replay.",
    ),
    decodedClaim(
      9,
      true,
      "Claim 9 similarly requires the primary machine, continuous sensing relative to fixed initial positions, recording, and repetitive playback, while specifying reciprocal column and wrist motions and electrically controlled servo-valve means. It makes the feedback and record/playback loop part of the machine combination, not a standalone claim to magnetic tape or resolvers.",
      [
        "Continuous sensing",
        "Fixed initial positions",
        "Electrical servo-valve means",
        "Recorded playback",
      ],
    ),
    decodedClaim(
      10,
      false,
      "Claim 10 depends on Claim 9 and identifies a variable transformer resolver for each column and arm actuator, coupled to its associated actuator. Its legal contribution is the named resolver-feedback implementation for those primary motions; it does not establish a universal resolver calibration, accuracy, or controller law.",
      ["Variable transformer resolver", "Actuator coupling"],
      [9],
    ),
    decodedClaim(
      11,
      false,
      "Claim 11 depends on Claim 9 and adds signal generators associated with wrist and work-manipulating actuators. Those generators indicate movement and operation of the supplemental mechanisms. The dependent claim distinguishes those indicated tool functions from the primary resolver channels without claiming all electronic sensing at an end effector.",
      ["Wrist signal generator", "Work-manipulator signal generator"],
      [9],
    ),
    decodedClaim(
      12,
      true,
      "Claim 12 independently claims a work-handling device with two gripping fingers on engaging pinions. The pinions can counter-rotate to move the fingers together or apart and conjointly move around a vertical axis to swing them. Its legal focus is the coupled pinion mechanism, not a generic clamp.",
      ["Engaging pinions", "Paired gripping fingers", "Conjoint finger swing"],
      undefined,
      "This is the independent mechanical claim directed specifically to the gripper’s coupled motion.",
    ),
    decodedClaim(
      13,
      false,
      "Claim 13 depends on Claim 12 and adds at least two linearly movable racks in the arm, selectively moved separately or together, engaging the pinions. The legal work is the rack-driven implementation of the parent’s opening and conjoint-swing functions rather than an abstract instruction to actuate a gripper with linear motion.",
      ["Linearly movable racks", "Selective separate or combined motion"],
      [12],
    ),
    decodedClaim(
      14,
      false,
      "Claim 14 depends on Claim 12 and adds the U-shaped channel, rollers, adjustable channel-length means, and abutment means that stops conjoint finger movement. The scope is a concrete adjustable swing-stop construction, not a broad assertion over adjustable end-effector limits.",
      ["U-shaped channel", "Roller stop", "Adjustable abutment"],
      [12],
    ),
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Article-handling and transfer apparatus",
      caption:
        "Front elevation of the illustrated machine, including programming arm H, horizontal arm A, column B, carriage C, gripping device G, and power/manifold components.",
      svgType: "amf-versatran-overall",
      callouts: [
        {
          id: "amf-h",
          figureRef: "Fig. 1",
          label: "Programming arm",
          element: "H",
          description: "Separate arm used while programming the desired operation.",
          x: 37,
          y: 27,
        },
        {
          id: "amf-a",
          figureRef: "Fig. 1",
          label: "Horizontal arm",
          element: "A",
          description: "Reciprocatory tubular work arm.",
          x: 37,
          y: 40,
        },
        {
          id: "amf-b",
          figureRef: "Fig. 1",
          label: "Vertical column",
          element: "B",
          description: "Rotatable support for the carriage.",
          x: 55,
          y: 55,
        },
        {
          id: "amf-c",
          figureRef: "Fig. 1",
          label: "Carriage",
          element: "C",
          description: "Vertically moving arm support.",
          x: 60,
          y: 40,
        },
        {
          id: "amf-g",
          figureRef: "Fig. 1",
          label: "Gripping device",
          element: "G",
          description: "Source-described work-handling mechanism.",
          x: 73,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "37",
      title: "Gripper fingers and actuating mechanism",
      caption:
        "Plan view of the paired gripper fingers, pinions, and rack-driven actuation discussed in Claims 12–14.",
      svgType: "amf-versatran-gripper",
      callouts: [
        {
          id: "amf-324",
          figureRef: "Fig. 37",
          label: "Gripper finger",
          element: "324",
          description: "One of the pair of gripping fingers.",
          x: 25,
          y: 23,
        },
        {
          id: "amf-326",
          figureRef: "Fig. 37",
          label: "Gripper finger",
          element: "326",
          description: "The cooperating second gripping finger.",
          x: 25,
          y: 39,
        },
        {
          id: "amf-334",
          figureRef: "Fig. 37",
          label: "Gripper gear (pinion in Claim 12)",
          element: "334",
          description:
            "Gear 334 in the illustrated embodiment; Claim 12 calls the paired engaging members pinions.",
          x: 41,
          y: 31,
        },
        {
          id: "amf-418",
          figureRef: "Fig. 37",
          label: "Swing member",
          element: "418",
          description: "Member that carries coordinated finger swing.",
          x: 41,
          y: 38,
        },
      ],
    },
    {
      figureNumber: "42",
      title: "Programming arm",
      caption:
        "Sectional side elevation of the detachable programming arm, programming head, and stick used to guide recorded operations.",
      svgType: "amf-versatran-programming-arm",
      callouts: [
        {
          id: "amf-612",
          figureRef: "Fig. 42",
          label: "Arm member",
          element: "612",
          description: "Programming-arm member.",
          x: 52,
          y: 42,
        },
        {
          id: "amf-624",
          figureRef: "Fig. 42",
          label: "Programming head",
          element: "624",
          description: "Head containing the gimballed input mechanism.",
          x: 25,
          y: 52,
        },
        {
          id: "amf-644",
          figureRef: "Fig. 42",
          label: "Programming stick",
          element: "644",
          description: "Operator-actuated stick.",
          x: 30,
          y: 32,
        },
      ],
    },
    {
      figureNumber: "46",
      title: "Hydraulic system flow diagram",
      caption:
        "Source flow diagram connecting pump, reservoir, filter, manifolds, primary actuators, gripper mechanism, accumulator, radiator, and return path.",
      svgType: "amf-versatran-hydraulic-flow",
      callouts: [
        {
          id: "amf-p",
          figureRef: "Fig. 46",
          label: "Pump",
          element: "PUMP",
          description: "Motor-driven hydraulic pump.",
          x: 47,
          y: 88,
        },
        {
          id: "amf-r",
          figureRef: "Fig. 46",
          label: "Reservoir tank",
          element: "RESERVOIR TANK",
          description: "Hydraulic-fluid reservoir.",
          x: 60,
          y: 77,
        },
        {
          id: "amf-f",
          figureRef: "Fig. 46",
          label: "Filter",
          element: "FILTER",
          description: "Filter in the source fluid path.",
          x: 34,
          y: 86,
        },
        {
          id: "amf-d",
          figureRef: "Fig. 46",
          label: "Accumulator",
          element: "ACCUMULATOR",
          description: "Source-described accumulator.",
          x: 47,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "49",
      title: "Resolver/tape error detector",
      caption:
        "Electrical diagram of the error detector that compares resolver voltage with tape command voltage during playback.",
      svgType: "amf-versatran-error-detector",
      callouts: [
        {
          id: "amf-er",
          figureRef: "Fig. 49",
          label: "Resolver-related voltage",
          element: "E_R",
          description:
            "The text calls E_R a voltage from the resolver rotor; the printed drawing labels its input FROM STATOR OF RESOLVER.",
          x: 27,
          y: 27,
        },
        {
          id: "amf-et",
          figureRef: "Fig. 49",
          label: "Tape command",
          element: "E_T",
          description: "Command voltage from tape T.",
          x: 24,
          y: 38,
        },
        {
          id: "amf-810",
          figureRef: "Fig. 49",
          label: "Summing resistor",
          element: "810",
          description: "Source-described balancing component.",
          x: 68,
          y: 26,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The patent identifies an increasing industrial need for machines that can handle, manipulate, assemble, and transfer work in prescribed sequences rather than being dedicated to one task.",
    priorArtLimitations: [
      "The specification says prior machine-tool automation included presses and lathes.",
      "It says some apparatus followed calculated straight-line paths of movement.",
      "It says such earlier machines required tooling for one job only and were not readily applicable for others.",
    ],
    breakthroughInsight:
      "The issued document joins multiple hydraulic motions, a separate programming arm, position-related resolver signals, recording on tape, playback through error detectors, and a mechanically coordinated gripper into one claimed apparatus. It is important to distinguish that specific architecture from the broader later category of industrial robots.",
    patentWars: [],
    civilizationalImpact:
      "This grant is a rich primary record of early programmable factory-manipulator engineering: it exposes the practical dependency between an arm mechanism, fluid-power system, sensing path, recorded command path, and work tool. Its educational value is strongest when those documented relationships are preserved without turning the grant into an unsupported priority or litigation narrative.",
    aftermath:
      "The facsimile identifies American Machine & Foundry Company as assignee. This record does not assert an enforcement campaign or a patent-war outcome because the reviewed primary source does not establish one.",
  },
  tags: [
    "industrial automation",
    "hydraulics",
    "servo control",
    "resolvers",
    "magnetic tape",
    "robot gripper",
  ],
  stats: {
    totalClaims: 14,
    independentClaims: 7,
  },
};
