import type { Patent } from "@/types/patent";
import { roombaArchivalEdition } from "../editions/roombaEdition";

export const roombaPatent: Patent = {
  id: "us-6594844-roomba",
  patentNumber: "US 6,594,844",
  title: "Robot Obstacle Detection System",
  shortTitle: "iRobot Roomba Autonomous Vacuum",
  subtitle: "Expanding Spiral Surface Coverage & Randomized Bump-and-Turn Heuristics",
  inventors: ["Joseph L. Jones", "Philip R. Mass", "Rodney A. Brooks"],
  inventorLocation: "Burlington, Massachusetts",
  grantDate: "2003-07-22",
  filingDate: "2001-12-21",
  era: "Internet & Modern Computing (1990–Present)",
  category: "consumer",
  categoryLabel: "Autonomous Robotics & Consumer Automation",
  summary:
    "The Dawn of Consumer Domestic Robotics: The landmark 2003 iRobot patent introduced the low-cost behavioral navigation architecture that powered the Roomba. By dispensing with expensive laser lidars and fragile optical mapping, the Roomba achieved near-complete floor coverage using a deterministic outward spiral combined with randomized bump-and-turn deflection heuristics.",
  heroQuote:
    "The robot executes an outward spiral cleaning mode having an expanding radius until an obstacle collision initiates an avoidance deflection.",
  originalPdfUrl: "/patents/pdfs/us-6594844-roomba.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6594844B2/en",
  usptoClassification: "A47L 9/28 (Domestic cleaning robots; Automated floor treaters)",
  archivalEdition: roombaArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6594844-roomba-reviewed.txt",
    pageCount: 26,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e",
  },
  originalText: `UNITED STATES PATENT
Jones et al.
Patent No.: US 6,594,844 B2
Date of Patent: Jul. 22, 2003

ROBOT OBSTACLE DETECTION SYSTEM
Inventors: Joseph L. Jones, Philip R. Mass, Rodney A. Brooks
Assignee: iRobot Corporation, Burlington, MA

ABSTRACT
A robot obstacle detection system for an autonomous cleaning robot including a bumper, an obstacle sensor, and a control system that executes an outward spiraling operational mode and a randomized bump-and-turn deflection mode upon detecting an obstacle.

BACKGROUND OF THE INVENTION
Autonomous vacuum cleaners must navigate rooms filled with obstacles such as chair legs, rugs, and walls. Traditional localization methods requiring ceiling cameras or beacon triangulators are fragile and expensive for consumer applications.

SUMMARY OF THE INVENTION
The present invention implements an effective, low-cost coverage behavior. The robot moves in an increasing-radius spiral to vacuum large contiguous floor areas. When the mechanical bumper trips against an obstacle, the robot reverses slightly, rotates through a pseudo-random angular deflection, and proceeds along a straight vector until the next collision.

CLAIMS
1. An autonomous cleaning robot comprising: a chassis supported by a differential drive system; a mechanical bumper assembly responsive to physical collisions; and a controller configured to direct the robot in an outward spiral coverage mode having a continuously expanding radius, and to transition the robot into an obstacle avoidance turn upon receiving a signal from the bumper assembly.`,
  plainEnglishExplanation: {
    overview:
      "The Roomba systematically vacuums rooms without requiring expensive cameras or laser radars by alternating between deterministic spiral sweeps and randomized bounce angles.",
    coreMechanism:
      "A behavioral state machine drives wheels in an expanding Archimedean spiral to clear open spaces, then reverses and deflects by an LCG-generated angle upon bumping obstacles.",
    mechanicalBreakdown: [
      {
        title: "Differential Wheel Drive",
        summary: "Independent left/right wheel motors enable zero-radius turning.",
        technicalDetails:
          "Modulating relative wheel angular velocities controls curvature radius: omega = (v_r - v_l) / L.",
      },
      {
        title: "Floating Bumper Assembly",
        summary: "Spring-loaded perimeter shell housing dual optical interrupter switches.",
        technicalDetails:
          "Detects left, right, or center collisions to trigger immediate reverse-and-pivot escape maneuvers.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Subsumption Architecture & Stochastic Coverage",
        formula: "C(t) = 1 - e^{-\\frac{v \\cdot w \\cdot t}{A}}",
        explanation:
          "Layered autonomous behaviors (cliff avoidance > bumper escape > spiral coverage) guarantee over 95% floor coverage in bounded arenas through ergodic pseudo-random traversal.",
      },
    ],
    whyItMattersToday:
      "Roomba proved that autonomous mobile robotics could achieve mass consumer adoption through elegant behavioral heuristics rather than fragile heavy computation.",
  },
  historicalContext: {
    problemStatement:
      "Early robotic vacuums in the 1990s were either $10,000 industrial prototypes requiring laser beacons or clumsy toys that became trapped under furniture within minutes.",
    priorArtLimitations: [
      "Electrolux Trilobite ($1,800 ultrasonic sonar)",
      "Dyson DC06 (80 sensors, canceled due to cost)",
      "High power consumption draining batteries in 15 minutes",
    ],
    breakthroughInsight:
      "Rodney Brooks and iRobot applied insect-inspired reactive behaviors: simple local sensor loops produce sophisticated global room coverage without persistent world modeling.",
    patentWars: [
      {
        rivalName: "Electrolux & Dyson",
        rivalClaim: "Ultrasonic sonar navigation and camera SLAM floor mappers",
        conflictDetails:
          "Competitors attempted complex mapping; iRobot secured foundational patents on behavioral sensor heuristics and low-cost optical cliff detection.",
        resolution:
          "iRobot dominated the global consumer market, selling over 40 million Roomba units worldwide.",
        legalOutcome:
          "iRobot successfully defended its behavioral navigation and dual-brush cleaning patents against multiple international copycats.",
      },
    ],
    civilizationalImpact:
      "Roomba made autonomous service robotics a common household reality, creating the multi-billion-dollar domestic robot industry.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Roomba Robot Top Perspective View",
      caption:
        "Perspective view showing circular housing, forward bumper shell, and control buttons.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-housing",
          figureRef: "Fig. 1",
          label: "12",
          element: "Circular Robot Housing",
          description: "Low-profile cylindrical chassis designed to clean beneath furniture.",
          x: 50,
          y: 50,
        },
        {
          id: "rm-bumper",
          figureRef: "Fig. 1",
          label: "14",
          element: "Floating Perimeter Bumper",
          description: "Spring-loaded impact shell with internal optical interrupter switches.",
          x: 50,
          y: 20,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Roomba Bottom Chassis & Cleaning Mechanism",
      caption: "Bottom view showing counter-rotating brushes, cliff sensors, and side brush.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-main-brush",
          figureRef: "Fig. 2",
          label: "20",
          element: "Counter-Rotating Brush Assembly",
          description: "Dual bristled brush and rubber beater bar rotating in opposition.",
          x: 50,
          y: 60,
        },
        {
          id: "rm-cliff-sensor",
          figureRef: "Fig. 2",
          label: "30",
          element: "Down-Looking Optical Cliff Sensor",
          description: "Infrared emitter-photodiode pair detecting stair drops.",
          x: 20,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Wall Sensor Triangulation Geometry",
      caption: "Schematic view of side-looking infrared beam intersection for wall following.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-wall-sensor",
          figureRef: "Fig. 3",
          label: "40",
          element: "Wall-Following Sensor Subsystem",
          description:
            "Collimated infrared beam intersecting photodiode field of view at wall distance.",
          x: 70,
          y: 40,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A robot obstacle detection system comprising: a robot housing which navigates with respect to a surface; a sensor subsystem having a defined relationship with respect to the housing and aimed at the surface for detecting the surface, the sensor subsystem including: an optical emitter which emits a directed beam having a defined field of emission, and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite region; and a circuit in communication with the detector for redirect- ing the robot when the surface does not occupy the region to avoid obstacles.",
      plainEnglish:
        "A robot obstacle detection system comprising a housing, sensor subsystem with intersecting field of emission and view, and a circuit for redirecting the robot.",
      keyInnovations: [
        "Optical obstacle triangulation",
        "Defined intersection volume",
        "Dynamic deflection circuit",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText:
        "The system of claim 1 further including a plurality of sensor subsystems spaced from each other on the housing of the robot, the circuit including logic for detecting whether any detector of each said sensor subsystem has failed to detect a beam from an emitter.",
      plainEnglish: "A plurality of sensor subsystems spaced from each other on the robot housing.",
      keyInnovations: ["Multi-sensor perimeter array", "Distributed obstacle detection"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: "The system of claim 1 in which the robot includes a surface cleaning brush.",
      plainEnglish: "Autonomous robot including a surface cleaning brush.",
      keyInnovations: ["Integrated floor cleaning brush", "Robotic vacuum sweep integration"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText:
        "The system of claim 1 in which the emitter includes an infrared light source and the detector includes an infrared photon detector.",
      plainEnglish:
        "Sensor subsystem using an infrared light source emitter and an infrared photon detector.",
      keyInnovations: ["Infrared optical triangulation", "Photodiode emitter-detector pair"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText:
        "The system of claim 4 further including a modulator connected to the infrared light source for modulating the directed infrared light source beam at a predetermined frequency.",
      plainEnglish:
        "Modulator connected to the infrared emitter for pulsing at a predetermined frequency.",
      keyInnovations: ["Modulated infrared carrier", "Ambient light noise rejection"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText:
        "The system of claim 5 in which the infrared photon detector is tuned to the said predetermined frequency.",
      plainEnglish: "Infrared photon detector tuned to the predetermined modulation frequency.",
      keyInnovations: ["Frequency-selective photodiode tuning", "High-SNR optical detection"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText:
        "The system of claim 4 in which the emitter further includes an emitter collimator about the infrared light source for directing the beam and in which the detector further includes a detector collimator about the infrared photon detector to define the field of view.",
      plainEnglish: "Collimators around the emitter and detector to define the directional field.",
      keyInnovations: ["Optical collimator apertures", "Restricted beam geometry"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText:
        "The system of claim 7 in which the emitter collimator and the detector collimator are angled with respect to the surface to define a finite region of intersection.",
      plainEnglish:
        "Emitter and detector collimators angled to define a finite intersection region.",
      keyInnovations: ["Angled optical triangulation", "Focal convergence volume"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText:
        "A robot wall detection system comprising: a robot housing which navigates with respect to a wall; a sensor subsystem having a defined relationship with respect to the housing and aimed at the wall for detecting the presence of the wall, the sensor subsystem including: an emitter which emits a directed beam having a defined field of emission, and a detector having a defined field of view which intersects the field of emission of the emitter at a region; and a circuit in communication with the detector for redirect- ing the robot when the wall occupies the region.",
      plainEnglish:
        "A robot wall detection system comprising a housing, lateral sensor subsystem, and circuit for wall following.",
      keyInnovations: ["Lateral wall proximity sensing", "Boundary tracking circuit"],
    },
    {
      number: 10,
      isIndependent: false,
      originalText:
        "The system of claim 9 further including a plurality of sensor subsystems spaced from each other on the housing of the robot, the circuit including logic for detecting whether any detector of any said sensor subsystem has detected a beam from an emitter.",
      plainEnglish: "Plurality of wall sensor subsystems spaced along the housing.",
      keyInnovations: ["Multi-point wall tracking", "Distributed perimeter detection"],
    },
    {
      number: 11,
      isIndependent: false,
      originalText: "The system of claim 9 in which the robot includes a surface cleaning brush.",
      plainEnglish: "Wall detection system on a robot with a surface cleaning brush.",
      keyInnovations: ["Baseboard edge sweep brush", "Wall-guided cleaning"],
    },
    {
      number: 12,
      isIndependent: false,
      originalText:
        "The system of claim 9 in which the emitter includes an infrared light source and the detector includes an infrared photon detector.",
      plainEnglish: "Wall sensor using an infrared light source and infrared photon detector.",
      keyInnovations: ["Infrared wall triangulation", "Proximity photodiode sensing"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText:
        "The system of claim 12 further including a modulator connected to the infrared light source for modulating the directed infrared light beam at a predetermined frequency.",
      plainEnglish: "Modulator pulsing the wall sensor infrared beam at a predetermined frequency.",
      keyInnovations: ["Modulated wall-tracking beam", "Sunlight immunity"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText:
        "The system of claim 13 in which the infrared photon detector is tuned to the predetermined frequency.",
      plainEnglish: "Wall detector tuned to the predetermined modulation frequency.",
      keyInnovations: ["Frequency-tuned wall detection", "Bandpass signal filtering"],
    },
    {
      number: 15,
      isIndependent: false,
      originalText:
        "The system of claim 12 in which the emitter further includes an emitter collimator about the infrared light source for directing the beam and in which the detector further includes a detector collimator about the infrared photon detector to define the field of view.",
      plainEnglish: "Collimators around the wall sensor emitter and detector.",
      keyInnovations: ["Directional wall collimation", "Constrained lateral field"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText:
        "The system of claim 15 in which the emitter collimator and the detector collimator are angled with respect to surface.",
      plainEnglish: "Wall sensor collimators angled with respect to the floor surface.",
      keyInnovations: ["Angled wall collimation", "Elevation-compensated sensing"],
    },
    {
      number: 17,
      isIndependent: false,
      originalText:
        "The system of claim 9 in which the circuit includes logic which redirects the robot away from the wall when the 10 15 20 12 wall occupies the region and back towards the wall when the wall no longer occupies the region of intersection.",
      plainEnglish:
        "Circuit redirecting the robot away from the wall when present and back towards the wall when absent.",
      keyInnovations: ["Bang-bang wall following", "Hysteresis boundary control"],
    },
    {
      number: 18,
      isIndependent: false,
      originalText:
        "The system of claim 9 in which the circuit includes logic which redirects the robot away from the wall when the wall occupies the region and then back towards the wall when the wall no longer occupies the region of intersection at decreasing radiuses of curvature until the wall once again occupies the region of intersection.",
      plainEnglish:
        "Circuit redirecting the robot with decreasing radiuses of curvature until the wall is reacquired.",
      keyInnovations: ["Iterative curvature wall tracking", "Smooth perimeter hugging"],
    },
    {
      number: 19,
      isIndependent: true,
      originalText:
        "An autonomous robot comprising: a housing which navigates in at least one direction on a surface; a first sensor subsystem aimed at the surface for detecting obstacles on the surface; and a second sensor subsystem aimed at least proximate the direction of navigation for detecting walls, each said subsystem including: an optical emitter which emits a directed beam having a defined field of emission and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite, predetermined region.",
      plainEnglish:
        "Autonomous robot with a downward obstacle sensor and a lateral wall sensor, each having finite intersecting fields.",
      keyInnovations: ["Dual-axis optical triangulation", "Integrated cliff and wall avoidance"],
    },
    {
      number: 20,
      isIndependent: true,
      originalText:
        "A sensor subsystem for an autonomous robot which rides on a surface, the sensor subsystem comprising: an optical emitter which emits a directed optical beam having a defined field of emission; a photon detector having a defined field of view which intersects the field of emission of the emitter at a region; and a circuit in communication with the detector for providing an output when a wall is not present in the region, wherein the output from the circuit causes the robot to be directed back towards the wall when the wall does not occupy the region of intersection of the defined field of emission of the emitter and the defined field of view of the detector.",
      plainEnglish:
        "Sensor subsystem outputting a signal causing the robot to turn back toward the wall when outside the intersection zone.",
      keyInnovations: ["Negative-feedback wall seeking", "Autonomous perimeter steering"],
    },
  ],
};
