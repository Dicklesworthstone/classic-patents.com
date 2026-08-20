import type { Patent } from "@/types/patent";
import { roombaArchivalEdition } from "../editions/roombaEdition";

export const roombaPatent: Patent = {
  id: "us-6594844-roomba",
  archivalEdition: roombaArchivalEdition,
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
        principle: "Archimedean Spiral Coverage Geometry",
        formula: "r(\\theta) = r_0 + \\frac{v_{\\text{drive}}}{2\\pi} t",
        explanation:
          "Maintains constant track spacing equal to the brush cleaning width, ensuring 100% surface coverage in open areas without overlap waste.",
      },
    ],
    whyItMattersToday:
      "The Roomba was the first commercially successful autonomous mobile robot in history, selling over 40 million units and pioneering domestic automation.",
  },
  historicalContext: {
    problemStatement:
      "Previous attempts at robotic vacuums cost over $3,000 and used fragile vision systems that broke in complex home environments.",
    priorArtLimitations: [
      "Electrolux Trilobite ($2,000+) used ultrasonic sonar that missed narrow chair legs",
      "Failed in dark rooms",
      "Required artificial beacon markers",
    ],
    breakthroughInsight:
      "Brooks's subsumption architecture: complex intelligent behavior arises from simple sensor-motor loops without an internal world map.",
    patentWars: [
      {
        rivalName: "SharkNinja / Bobsweep",
        rivalClaim:
          "Infringement disputes over bumper sensor mechanisms and edge-following routines",
        conflictDetails:
          "Competitors attempted to replicate iRobot's obstacle escape heuristics and dual counter-rotating brush rollers.",
        resolution:
          "iRobot successfully defended its patent portfolio before the US International Trade Commission (ITC).",
        legalOutcome:
          "ITC issued exclusion orders blocking infringing robotic cleaners from import into the United States.",
      },
    ],
    civilizationalImpact:
      "Proved that behavior-based robotics could create robust consumer products that operate reliably in unconstrained real-world homes.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "An autonomous cleaning robot comprising: a chassis supported by a differential drive system; a mechanical bumper assembly responsive to physical collisions; and a controller configured to direct the robot in an outward spiral coverage mode having a continuously expanding radius, and to transition the robot into an obstacle avoidance turn upon receiving a signal from the bumper assembly.",
      plainEnglish:
        "A robotic vacuum that systematically sweeps open floors in expanding spirals and redirects itself when hitting walls.",
      keyInnovations: [
        "Expanding Archimedean spiral cleaning algorithm",
        "Deterministic-to-random collision deflection state machine",
        "Mapless statistical complete surface coverage",
      ],
    },
  ],
  drawings: [],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
  tags: ["robotics", "consumer", "automation", "state machine", "irobot"],
};
