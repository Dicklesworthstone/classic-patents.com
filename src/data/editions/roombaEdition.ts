import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

export const ROOMBA_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1856, height: 2385 },
  2: { width: 1856, height: 2385 },
  3: { width: 1856, height: 2385 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-6594844-roomba/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: figureAssetPath(num),
      alt: `Figure ${num}: ${altText}`,
      width: ROOMBA_FIGURE_DIMS[num]?.width ?? 1200,
      height: ROOMBA_FIGURE_DIMS[num]?.height ?? 1600,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const roombaParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Abstract: An autonomous robotic cleaning device equipped with optical cliff detectors, wall sensors, and bumper collision switches executing systematic coverage patterns.",
  ],
  4: [
    "Field of the Invention: Autonomous mobile service robotics, domestic vacuum cleaning appliances, and surface coverage navigation algorithms.",
  ],
  6: [
    "Background: Domestic floors contain complex, unstructured layouts of furniture, walls, and drop-offs. Traditional robotic systems requiring laser rangefinders or GPS-like ceiling beacons are too fragile and expensive for consumer home appliances.",
  ],
  7: [
    "Shortcomings of grid-mapping: High memory requirements, mapping error accumulation, and catastrophic failure when furniture or obstacles are moved during cleaning.",
  ],
  9: [
    "Summary: Low-cost behavioral navigation architecture combining deterministic outward Archimedean spirals, randomized bump deflection angles, and wall-following perimeter sweeps.",
  ],
  10: [
    "Sensor coordination: Optical cliff sensors pointing down prevent stairway tumbling; infrared optical triangulation detects approaching vertical walls; spring-loaded floating bumper detects physical contact.",
  ],
  12: [
    "Brief Description of Figures: FIG. 1 shows top perspective of the autonomous robot; FIG. 2 shows the bottom chassis with counter-rotating brushes and cliff sensors; FIG. 3 shows wall-following optical sensor geometry.",
  ],
  14: [
    "Detailed Description: The mobile robot includes a compact circular chassis driven by independently reversible left and right drive wheels for differential steering with zero turning radius.",
  ],
  15: [
    "Dual counter-rotating brush mechanism: A flexible rubber beater blade and a bristled brush rotate in opposite directions to sweep particulate debris directly into a vacuum collection chamber.",
  ],
  16: [
    "Cliff detection geometry: Infrared emitters and photodiodes angled toward the floor create a focal intersection region. When a floor drop-off or stair step occurs, reflected photon flux drops below threshold, triggering immediate emergency stop and reverse maneuvers.",
  ],
  17: [
    "Wall-following behavior: A side-looking infrared optical triangulation sensor maintains the robot at a precise fixed distance (~1 to 2 cm) along room perimeters and baseboards.",
  ],
  18: [
    "Spiral cleaning mode: Driving wheels at differential angular velocities to produce an Archimedean spiral with continuously expanding radius until an obstacle collision occurs.",
  ],
  19: [
    "Bounce heuristic: Upon bumper contact, the control microprocessor generates a pseudo-random deflection angle between 90 and 270 degrees, ensuring high statistical floor coverage without internal map storage.",
  ],
  20: [
    "Power management & containment: Onboard rechargeable battery pack and optical receivers responsive to coded infrared virtual-wall containment beacons.",
  ],
};

export const roombaArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
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
        "Inventors: Joseph L. Jones, Philip R. Mass, Rodney A. Brooks",
        "Assignee: iRobot Corporation, Burlington, MA (US)",
        "Application No.: 10/027,475 · Filed: Dec. 21, 2001",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "A robot obstacle detection system for an autonomous cleaning robot including a bumper, an obstacle sensor, and a control system that executes an outward spiraling operational mode and a randomized bump-and-turn deflection mode upon detecting an obstacle.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p(
      "This invention relates generally to autonomous mobile robots and, more particularly, to an obstacle and cliff detection system for a domestic robotic vacuum cleaner.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "Autonomous floor cleaning robots must successfully navigate unstructured living spaces containing diverse obstacles such as walls, table legs, doors, loose rugs, and drop-offs such as staircases. Prior autonomous cleaning robots have generally utilized complex navigation systems incorporating high-precision laser rangefinders, ultrasonic sonar arrays, or optical ceiling-facing cameras for visual Simultaneous Localization and Mapping (SLAM).",
    ),
    p(
      "However, such high-end navigation systems are computationally intensive, power-hungry, and prohibitively expensive for consumer domestic appliances. Furthermore, traditional global mapping systems frequently fail in dynamic home environments where chairs, toys, and pets are constantly relocated, causing robot localization errors that result in missed floor sections or entrapment.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "The present invention provides a robust, low-cost autonomous robot navigation and obstacle detection architecture. In accordance with the invention, the robot achieves high statistical surface coverage by executing a sequence of behavioral modes: an outward spiral cleaning mode for open floor areas, an obstacle avoidance bounce mode upon physical bumper contact, a wall-following mode for perimeter cleaning, and an optical cliff-avoidance mode.",
    ),
    p(
      "The robot includes a ",
      term(
        "cliff sensor subsystem",
        "Cliff Detection Optical Subsystem",
        "Down-looking collimated infrared emitter and photodiode pairs whose beams intersect at a defined distance above the floor, detecting drops such as stairs.",
      ),
      " comprising an optical emitter and detector whose fields intersect at a predetermined floor distance, providing instantaneous detection of staircases without requiring mechanical drop-feelers or vision processing.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "The invention is described in detail with reference to the accompanying drawings:\n",
      makePreview("FIG. 1", [1], "Top perspective view of the autonomous cleaning robot"),
      " is a top perspective view of an autonomous robot according to the present invention;\n",
      makePreview(
        "FIG. 2",
        [2],
        "Bottom perspective view showing dual counter-rotating cleaning brushes and cliff sensors",
      ),
      " is a bottom perspective view showing the brush mechanism and cliff sensors; and\n",
      makePreview("FIG. 3", [3], "Side view showing optical wall-following sensor geometry"),
      " is a side schematic view showing the wall-following optical triangulation geometry.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Top perspective view of robot chassis"),
      ", the autonomous cleaning robot 10 includes a circular housing 12 supported by a differential drive system comprising independent left and right motorized wheel assemblies that allow the robot to pivot about its central vertical axis with zero turning radius. A floating bumper 14 extends around the forward circumference of the housing.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Bottom chassis and cleaning mechanism"),
      ", the underside of housing 12 accommodates a cleaning head comprising a pair of counter-rotating brushes: a main bristled brush and a secondary rubber beater brush that rotate in opposite directions to lift dirt, pet hair, and particulate debris into a removable vacuum bin. A side-mounted spinning edge brush sweeps debris along walls toward the main brush path.",
    ),
    p(
      "A plurality of downward-facing cliff sensors are positioned along the forward perimeter of the lower chassis. Each cliff sensor comprises an infrared LED emitter and an adjacent photodiode detector. The optical axes of the emitter and detector are angled so that their fields of emission and view intersect at a finite region on the floor surface. When the robot approaches a descending stair step, the floor no longer occupies the intersection region, causing reflected photon current to drop abruptly and triggering an emergency reverse-and-turn maneuver.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Wall-following sensor alignment"),
      ", a lateral wall sensor subsystem includes a collimated infrared emitter and detector aimed outward toward room perimeters. When a wall enters the sensor intersection zone, the robot controller modulates the left and right wheel speeds to steer the robot along the wall at a constant nominal clearance (~1 to 2 cm), allowing the side brush to sweep baseboard corners.",
    ),
    p(
      "When operating in open floor areas, the robot initiates an ",
      term(
        "outward spiral mode",
        "Expanding Spiral Cleaning Behavior",
        "A motion pattern where differential wheel speeds expand the curvature radius continuously, sweeping circular floor areas outward from a starting point.",
      ),
      " with an expanding radius of curvature. Upon contacting an obstacle with the floating bumper 14, an internal optical interrupter is tripped, and the microprocessor transitions the robot into an obstacle avoidance turn mode.",
    ),
    p(
      "In the obstacle avoidance turn mode, the robot reverses slightly, selects a pseudo-random deflection angle between 90 and 270 degrees, and drives forward in a straight line until the next obstacle or wall is encountered, achieving over 95% floor coverage through statistical behavioral traversal.",
    ),
    p(
      "The system also includes optical receivers responsive to coded infrared containment beams generated by standalone virtual-wall beacons, allowing homeowners to confine the robot to designated rooms.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "A robot obstacle detection system comprising: a robot housing which navigates with respect to a surface; a sensor subsystem having a defined relationship with respect to the housing and aimed at the surface for detecting the surface, the sensor subsystem including: an optical emitter which emits a directed beam having a defined field of emission, and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite region; and a circuit in communication with the detector for redirect- ing the robot when the surface does not occupy the region to avoid obstacles.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 1 further including a plurality of sensor subsystems spaced from each other on the housing of the robot, the circuit including logic for detecting whether any detector of each said sensor subsystem has failed to detect a beam from an emitter.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 1 in which the robot includes a surface cleaning brush.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 1 in which the emitter includes an infrared light source and the detector includes an infrared photon detector.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 4 further including a modulator connected to the infrared light source for modulating the directed infrared light source beam at a predetermined frequency.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 5 in which the infrared photon detector is tuned to the said predetermined frequency.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 4 in which the emitter further includes an emitter collimator about the infrared light source for directing the beam and in which the detector further includes a detector collimator about the infrared photon detector to define the field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 7 in which the emitter collimator and the detector collimator are angled with respect to the surface to define a finite region of intersection.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "A robot wall detection system comprising: a robot housing which navigates with respect to a wall; a sensor subsystem having a defined relationship with respect to the housing and aimed at the wall for detecting the presence of the wall, the sensor subsystem including: an emitter which emits a directed beam having a defined field of emission, and a detector having a defined field of view which intersects the field of emission of the emitter at a region; and a circuit in communication with the detector for redirect- ing the robot when the wall occupies the region.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 9 further including a plurality of sensor subsystems spaced from each other on the housing of the robot, the circuit including logic for detecting whether any detector of any said sensor subsystem has detected a beam from an emitter.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 9 in which the robot includes a surface cleaning brush.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 9 in which the emitter includes an infrared light source and the detector includes an infrared photon detector.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 12 further including a modulator connected to the infrared light source for modulating the directed infrared light beam at a predetermined frequency.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 13 in which the infrared photon detector is tuned to the predetermined frequency.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 12 in which the emitter further includes an emitter collimator about the infrared light source for directing the beam and in which the detector further includes a detector collimator about the infrared photon detector to define the field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 15 in which the emitter collimator and the detector collimator are angled with respect to surface.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 9 in which the circuit includes logic which redirects the robot away from the wall when the 10 15 20 12 wall occupies the region and back towards the wall when the wall no longer occupies the region of intersection.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "The system of claim 9 in which the circuit includes logic which redirects the robot away from the wall when the wall occupies the region and then back towards the wall when the wall no longer occupies the region of intersection at decreasing radiuses of curvature until the wall once again occupies the region of intersection.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "An autonomous robot comprising: a housing which navigates in at least one direction on a surface; a first sensor subsystem aimed at the surface for detecting obstacles on the surface; and a second sensor subsystem aimed at least proximate the direction of navigation for detecting walls, each said subsystem including: an optical emitter which emits a directed beam having a defined field of emission and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite, predetermined region.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "A sensor subsystem for an autonomous robot which rides on a surface, the sensor subsystem comprising: an optical emitter which emits a directed optical beam having a defined field of emission; a photon detector having a defined field of view which intersects the field of emission of the emitter at a region; and a circuit in communication with the detector for providing an output when a wall is not present in the region, wherein the output from the circuit causes the robot to be directed back towards the wall when the wall does not occupy the region of intersection of the defined field of emission of the emitter and the defined field of view of the detector.",
        },
      ],
    },
  ],
};

export const roombaEdition = roombaArchivalEdition;
