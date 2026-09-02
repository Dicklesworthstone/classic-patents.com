import type { Patent, PatentClaim } from "@/types/patent";
import {
  milacronRobotToolchangerArchivalEdition,
  milacronRobotToolchangerClaimText,
} from "../editions/milacronRobotToolchangerEdition";

const patentId = "us-4512709-milacron-robot-toolchanger";

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
    originalText: milacronRobotToolchangerClaimText(number),
    plainEnglish,
    keyInnovations,
    ...(legalSignificance ? { legalSignificance } : {}),
  };
}

export const milacronRobotToolchangerPatent: Patent = {
  id: patentId,
  patentNumber: "US 4,512,709",
  title: "Robot Toolchanger System",
  shortTitle: "Milacron Robot Toolchanger: Common Base, Pins, and Wedge Lock",
  subtitle: "Common Tool Bases, Kinematic Registration, and Slide-Ramp Retention",
  inventors: ["Daniel M. Hennekes", "Richard A. Kolde", "David E. Suica"],
  inventorLocation: "Morrow, Ohio; Ft. Thomas, Kentucky; Lebanon, Ohio",
  grantDate: "1985-04-23",
  filingDate: "1983-07-25",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Robotics & Automation",
  summary:
    "US 4,512,709 claims a robot-end-effector toolchanger whose housing admits a common tool base through a central opening, locates it on a two-pin/bushing pair, and uses an actuator-driven transverse slide to capture its retention member. The principal disclosed form uses a T-shaped member: when the slide shifts, bifurcated ramp faces bear on the T crossbar and prevent withdrawal; moving the aperture back into alignment permits separation. The grant claims two independent forms—the toolchanger itself and the robot-plus-toolchanger system—and two dependent refinements for head-and-stem and T-ramp geometry.",
  heroQuote:
    "Applicants have determined that it is a desirable feature to be able to interchange multiple tool types with a given robot end effector, during the working cycle on a given workpiece.",
  originalPdfUrl: "/patents/pdfs/us-4512709-milacron-robot-toolchanger.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4512709A/en",
  usptoClassification: "B66C 1/00; U.S. 414/729; 248/122; 294/86.4; 403/338; 403/374; 901/41",
  archivalEdition: milacronRobotToolchangerArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-4512709-milacron-robot-toolchanger-reviewed.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GentleCedar)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "9ac43ea5baee978c390bd096fe4beaa2c229a5cde227d9f3e005d035026425b0",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "ROBOT TOOLCHANGER SYSTEM",
        sourceRelationship: "Printed masthead, bibliographic data, abstract, and claim/figure count.",
      },
      {
        page: 2,
        exactSourceText: "Sheet 1 of 6",
        sourceRelationship: "Printed drawing sheet containing the robot, rack, and adapter overview in Figure 1.",
      },
      {
        page: 3,
        exactSourceText: "Sheet 2 of 6",
        sourceRelationship: "Printed drawing sheet containing Figures 2, 3, and 4.",
      },
      {
        page: 4,
        exactSourceText: "Sheet 3 of 6",
        sourceRelationship: "Printed drawing sheet containing the side elevation in Figure 5.",
      },
      {
        page: 5,
        exactSourceText: "Sheet 4 of 6",
        sourceRelationship: "Printed drawing sheet containing the locking plan section in Figure 6.",
      },
      {
        page: 6,
        exactSourceText: "Sheet 5 of 6",
        sourceRelationship: "Printed drawing sheet containing Figures 7 and 8.",
      },
      {
        page: 7,
        exactSourceText: "Sheet 6 of 6",
        sourceRelationship: "Printed drawing sheet containing the common tool base in Figures 9 and 10.",
      },
      {
        page: 8,
        exactSourceText: "The tool retention system should tend to be bistable",
        sourceRelationship: "Background, summary, figure list, and opening preferred-embodiment description.",
      },
      {
        page: 9,
        exactSourceText: "The locking slide 33 has a central slot 40",
        sourceRelationship: "Detailed adapter, registration, slide, and optional utility-connection description.",
      },
      {
        page: 10,
        exactSourceText: "What is claimed is:",
        sourceRelationship: "Remaining description and all four printed claims.",
      },
    ],
  },
  originalText: `ROBOT TOOLCHANGER SYSTEM

The invention relates generally to toolchanger systems, wherein a machine mechanism may utilize an interchangeable plurality of tools. More specifically, the invention relates to robot systems, such as industrial robot arms, which have a plurality of elements movable with respect to a robot base. In such robot arms, the last element in the system, i.e., the wrist, generally has a movable end effector to which is attached a gripper or some other tool.

With the idea of improving productivity of a robot machine, applicants have determined that it is a desirable feature to be able to interchange multiple tool types with a given robot end effector, during the working cycle on a given workpiece, and it is to this task that they have directed their efforts. Applicants have also determined that it is a desirable feature, in a replaceable tool system, to have the capability to enable the robot to automatically interchange a plurality of tools, without the need for human intervention.

The invention is shown embodied in a robot having a movable end effector, wherein a toolchanger comprises, in part, an adapter unit affixed to the end effector. The adapter unit has a housing with means for locating and securing the housing on the end effector, and a means for locating and releasably retaining a tool base on the housing is embodied therein. A common tool base is affixed to a plurality of tools to be releasably retained with the adapter unit, and a retention member affixed to the tool base cooperates with the adapter unit for holding the tool base and tool in position with the adapter unit.`,
  plainEnglishExplanation: {
    overview:
      "A robot is programmable, but its wrist cannot do a new physical job until it has the appropriate physical tool. This patent makes the tool interface a repeatable mechanism: the robot carries an adapter; every candidate tool carries the same base. The base first lands on two locating pins, then its retention member passes through an open aperture. A linear actuator shifts the locking slide sideways so that the crossbar is captured by mating ramps. The legal scope is this organized housing–slide–retention–positioning combination, not the broad idea of swapping robot tools.",
    coreMechanism:
      "The source describes an ordered geometric state machine, not a source-measured force calculation: an unloaded adapter has its aperture aligned; a base may enter only in that opening state; bushings seat on the cylindrical and diamond-profile pins; the T-member crossbar passes the aperture; and a transverse slide moves so its aperture is no longer aligned. In the Claim 4 form, the slide's bifurcated ramp surfaces meet ramps on the T crossbar, making withdrawal geometrically blocked. The live relation is deliberately Boolean: $\mathrm{captured}=\mathrm{basePresent}\land\mathrm{registered}\land\mathrm{slideLocked}\land\mathrm{TMember}$; it identifies the claimed engagement topology but does not fabricate actuator pressure, ramp angle, friction, clamp force, load capacity, or time.",
    mechanicalBreakdown: [
      {
        title: "Adapter Housing and Central Opening",
        summary:
          "Spaced front and rear plates, joined by blocks, carry the robot-side housing; the front plate's central opening is the admission path for the tool-base retention member.",
        technicalDetails:
          "Claims 1 and 3 require a housing, paired rigidly connected plates, and the opening. The source locates a linear actuator between the plates and identifies the shown circular plates and rectangular spacer blocks. It provides no full dimensions, material, mass, stiffness, or robot-wrist pattern. The 2D and 3D forms are therefore source-shaped teaching diagrams, not a scaled replacement part.",
        archaicTerm: "housing",
        modernEquivalent: "robot-side toolchanger adapter body",
      },
      {
        title: "Common Tool Base and Registration Pair",
        summary:
          "Each tool can carry the same base, whose bushings receive a cylindrical locating pin and a diamond-shaped locating pin before the lock moves.",
        technicalDetails:
          "The source says reception of bushings 42 on pins 43 and 44 assures accurate registration before clamping. A round/diamond pair is a practical way to constrain position while avoiding a redundant second round-pin fit. The patent does not print diameters, clearance, tolerance, compliance, or repeatability. Accordingly the visual exposes a registration state, not a numerical alignment claim.",
        archaicTerm: "toolbase",
        modernEquivalent: "standardized tool-side interface plate",
      },
      {
        title: "Linear Slideway and Aperture",
        summary:
          "A rod-driven linear slide crosses the front plate. Its aperture aligns with the central opening only in the admission/release position.",
        technicalDetails:
          "The slideway is transverse to the central opening, and Claims 1 and 3 make the slide's rod coupling and alignable aperture legal requirements. Shifting it is the key topological transition: when the aperture is offset, the inserted retention member cannot simply follow its original straight withdrawal path. The grant names extended and retracted end positions but gives no stroke or timing, so slider travel is normalized from 0 to 1.",
        archaicTerm: "slideway",
        modernEquivalent: "linear guide track",
      },
      {
        title: "T-Member, Clearance Slot, and Wedge Ramps",
        summary:
          "The preferred Claim 4 retention member has a narrow stem and a wider crossbar; the bifurcated slide leaves clearance for the stem while ramp faces bear on the crossbar.",
        technicalDetails:
          "The source calls the interaction a forked, clevis manner with a wedging action. The lock result is a capture geometry: the stem stays in the central slot while the slide ramps engage the crossbar ramps. The statement that the tool tends to remain locked after power failure is preserved as source language. Without ramp angle, lubrication, material, actuator force, load, shock, or back-drive data, the museum does not calculate a holding force or safety factor.",
        archaicTerm: "forked, clevis manner",
        modernEquivalent: "split-slide capture around a T-stem",
      },
      {
        title: "Actuator, Utility Passage, and Presence Switch",
        summary:
          "A fluid-powered linear actuator moves the yoke and locking slide; optional fluid or electrical connections can pass through an engaged tool base, while a proximity switch detects base presence.",
        technicalDetails:
          "The patent separates retention from utilities: some tools may have a fluid port, some an electrical connector, and some neither. The actuator's cylinder, piston rod, yoke, and the switch are named source parts, but their supply pressure, bore, flow, wiring, switching distance, controller, and cycle time are absent. The exhibit treats those as source-described options, not telemetry inputs.",
        archaicTerm: "interdrilling",
        modernEquivalent: "internal drilled utility passage",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Geometric constraint and registration",
        formula: "$\mathrm{registered}=\mathrm{basePresent}\land\mathrm{bushingsOnPins}$",
        explanation:
          "The equation is an editorial state relation that binds the live diagram to the source's stated order: the base is positioned on its pin-and-bushing pair before clamping. It is not a tolerance or stiffness equation, because the grant supplies none of the needed dimensions or material data.",
      },
      {
        principle: "Interference-based retention",
        formula: "$\mathrm{withdrawalBlocked}=\mathrm{slideOffset}\land\mathrm{crossbarCaptured}$",
        explanation:
          "An aligned aperture admits the T-member; an offset slide brings its ramp surfaces into engagement with the wider crossbar. The intended lock is physical interference. This source-based relation says nothing about the magnitude of load the interface withstands.",
      },
      {
        principle: "Wedge contact requires missing data for a force result",
        formula: "$F_{axial}\ \text{is not evaluated}$",
        explanation:
          "A wedge force calculation would require ramp angle, normal force, friction, actuator output, preload, material stiffness, and applied tool load. None are printed in the grant. The physics boundary therefore refuses a numerical clamp/holding-force display rather than assigning plausible values.",
      },
    ],
    whyItMattersToday:
      "Industrial automation often works through interfaces rather than a single universal hand: a robot needs a repeatable way to pick up a gripper, welding tool, fluid-powered fixture, or an unpowered tool at the wrist. This grant is a crisp teaching example because it separates three questions modern cells still confront—where the tool is located, how it is retained, and which utilities it needs—then makes the ramp-and-T capture visible without claiming unprinted performance.",
  },
  claims: [
    decodedClaim(
      1,
      true,
      "Claim 1 covers the toolchanger itself. It requires the rigid two-plate housing, central opening, actuator and rod, transverse slideway, locking slide with alignable aperture, tool base and its retention member, plus means to position the base and to secure the housing to a movable robot member. The slide is legally central: it must be carried in the guideway, attached to the rod, and able to engage the inserted retention member. A removable robot tool without that coordinated admission, slide, and positioning arrangement is not automatically the claimed combination.",
      ["Two-plate adapter housing", "Alignable locking-slide aperture", "Common tool base"],
      undefined,
      "Independent apparatus claim defining the housing, opening, slide, retention member, and robot-side positioning combination.",
    ),
    decodedClaim(
      2,
      false,
      "Claim 2 narrows Claim 1 to a retention member with a wider head and an adjacent, smaller-cross-section stem against the base. The slide's engaging surface must bear against that head near the aperture. In mechanical language, this turns the generic retention member into an undercut/head-and-stem geometry that lets a shifted slide hold the head while the stem passes the opening. It does not yet require the specific T-shape or bifurcated ramp arrangement of Claim 4, and it does not supply any holding-force value.",
      ["Head-and-stem retention member", "Slide bearing surface"],
      [1],
    ),
    decodedClaim(
      3,
      true,
      "Claim 3 claims the complete robot toolchanger system: a movable robot member and end effector carry the two-plate housing; its actuator drives a transverse slide between lock and unlock positions; the slide has an alignable aperture and ramp surface; and the positioned tool base inserts its retention member through the opening and aperture. It is not merely a robot beside a rack. Its legal work is to join the robot-side mounting, tool-side base, relative positioning, and ramp-engagement lock in one system combination.",
      ["Robot-mounted adapter", "Actuator-driven locking slide", "Ramped retention path"],
      undefined,
      "Independent system claim tying the adapter and tool base to a movable robot end effector.",
    ),
    decodedClaim(
      4,
      false,
      "Claim 4 adds the preferred source geometry to Claim 3: a T-shaped member has its stem fixed to the tool base; its crossbar carries a ramp surface; and the slide's mating ramp is bifurcated to leave clearance for the stem. This is the drawing's most pedagogically direct capture: the stem can remain in the split path while the shifted slide bears against the broader ramped crossbar. The claim defines geometry and cooperation, not ramp angle, actuator pressure, coefficient of friction, retention load, or failure probability.",
      ["T-shaped retention member", "Bifurcated slide ramp", "Crossbar ramp engagement"],
      [3],
      "Dependent claim selecting the T-member and bifurcated slide-ramp form visibly shown in the locking figures.",
    ),
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Robot with adapter and stored-tool rack",
      caption:
        "Source Figure 1: a robot wrist carries adapter 17 while distinct tools 19, each with common base 18, wait on rack 20.",
      svgType: "milacron-robot-toolchanger",
      callouts: [
        {
          id: "adapter",
          figureRef: "Fig. 1",
          label: "Adapter unit",
          element: "17",
          description: "Robot-side housing that positions and retains a common tool base.",
          x: 58,
          y: 53,
        },
        {
          id: "tool-base",
          figureRef: "Fig. 1",
          label: "Common tool base",
          element: "18",
          description: "Tool-side base shared across the depicted family of tools.",
          x: 72,
          y: 54,
        },
        {
          id: "tool-rack",
          figureRef: "Fig. 1",
          label: "Tool rack",
          element: "20",
          description: "Representative storage module holding the tool family.",
          x: 17,
          y: 72,
        },
      ],
    },
    {
      figureNumber: "2–10",
      title: "Open admission, ramp capture, and registered tool base",
      caption:
        "Source Figures 2–10: open and locked positions of slide 33, T-member 35, locating pins 43 and 44, and the common tool base.",
      svgType: "milacron-robot-toolchanger",
      callouts: [
        {
          id: "slide",
          figureRef: "Fig. 2",
          label: "Locking slide",
          element: "33",
          description: "Transverse slide whose aperture admits or captures the retention member.",
          x: 49,
          y: 48,
        },
        {
          id: "t-member",
          figureRef: "Fig. 6",
          label: "T-shaped retention member",
          element: "35",
          description: "Tool-base member whose crossbar meets the slide ramps.",
          x: 65,
          y: 55,
        },
        {
          id: "pins",
          figureRef: "Fig. 7",
          label: "Locating pins",
          element: "43, 44",
          description: "Cylindrical and diamond-profile pins that receive the base bushings.",
          x: 34,
          y: 35,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A programmable industrial robot may still be interrupted when a person must replace the physical tool at its wrist. The grant targets automatic selection, registration, retention, and release of multiple tool types on a common interface.",
    priorArtLimitations: [
      "The specification says a robot generally carries one special tool for the immediate task, with changeover performed by a maintenance operator when work changes.",
      "A replaceable interface needs both accurate position before clamping and a retention scheme intended to remain in a terminal state after actuator power fails.",
    ],
    breakthroughInsight:
      "Separate tool choice from wrist mounting: use a shared base for several tools, a nonredundant locating-pin/bushing pair for registration, and a transverse aperture/ramp slide that converts admission into mechanical capture.",
    patentWars: [],
    civilizationalImpact:
      "The document makes a durable industrial-robotics problem unusually visible: automation has to exchange physical capability as well as move an arm. Its value in this archive is the inspectable interface logic—registration before capture, then a deliberate release path—not an unverified claim that this one grant created all modern toolchanging practice.",
    aftermath:
      "The grant's own embodiment connects the adapter to the cited Stackhouse wrist and depicts multiple common-base tools in a rack. No patent-dispute record is asserted here because this archival packet did not establish one from primary legal evidence.",
    sideNotes: [
      "The source depicts both fluid and electrical tool-side connections, but says some tools may need neither; utility transfer is optional rather than the core retention claim.",
      "The patent calls one locating pin cylindrical and the other diamond-shaped in cross section; it does not print their dimensions or an alignment tolerance.",
    ],
  },
  tags: ["robotics", "industrial automation", "toolchanger", "end effector", "mechanical locking"],
  stats: { totalClaims: 4, independentClaims: 2 },
};
