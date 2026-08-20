import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

export const roombaParallelReadings: Record<string, string> = {
  "roomba-abstract":
    "An autonomous robotic cleaner uses a deterministic spiral pattern for open floors and a randomized bump-and-turn behavior to systematically traverse and vacuum an enclosed room.",
  "roomba-p1":
    "Prior robot vacuum attempts relied on expensive laser or optical beacons, making them cost-prohibitive for domestic consumer households.",
  "roomba-p2":
    "By alternating between spiral expansion and randomized bump-turn angles, the robot achieves high statistical surface coverage without requiring a persistent internal global map.",
  "roomba-claim1":
    "An autonomous coverage robot comprising a drive system, obstacle sensors, and a control system executing an outward spiral cleaning mode until a bumper collision initiates an obstacle escape maneuver.",
};

export const roombaArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9f833a1dd7e2f5b6d92ef29d045d3bc17e82b7cf02a4b65dd251b689a9f45d82",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jones et al.",
        "Patent No.: US 6,594,844 B2",
        "Date of Patent: Jul. 22, 2003",
        "ROBOT OBSTACLE DETECTION SYSTEM",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A robot obstacle detection system for an autonomous cleaning robot including a bumper, an obstacle sensor, and a control system that executes an outward spiraling operational mode and a randomized bump-and-turn deflection mode upon detecting an obstacle.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Autonomous vacuum cleaners must navigate rooms filled with obstacles such as chair legs, rugs, and walls. Traditional localization methods requiring ceiling cameras or beacon triangulators are fragile and expensive for consumer applications.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The present invention implements an effective, low-cost coverage behavior. The robot moves in an increasing-radius spiral to vacuum large contiguous floor areas. When the mechanical bumper trips against an obstacle, the robot reverses slightly, rotates through a pseudo-random angular deflection, and proceeds along a straight vector until the next collision.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "An autonomous cleaning robot comprising: a chassis supported by a differential drive system; a mechanical bumper assembly responsive to physical collisions; and a controller configured to direct the robot in an outward spiral coverage mode having a continuously expanding radius, and to transition the robot into an obstacle avoidance turn upon receiving a signal from the bumper assembly.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Inventors: Joseph L. Jones, Philip R. Mass, Rodney A. Brooks. Assignee: iRobot Corporation, Burlington, MA.",
      ),
    },
  ],
};
