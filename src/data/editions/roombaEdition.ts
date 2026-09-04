import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

export const ROOMBA_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 2320, height: 3408 },
  2: { width: 2320, height: 3408 },
  3: { width: 2320, height: 3408 },
};

function figureAssetPath(): string {
  return "/patents/figures/us-6594844-roomba/source-sheet-1-v1.png";
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
      src: figureAssetPath(),
      alt: `Figure ${num}: ${altText}. Complete source drawing sheet 1 of 19.`,
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
    "Abstract: A robot housing navigates with respect to a surface; an optical emitter and photon detector have intersecting fields at a region, and a circuit redirects the robot when the surface does not occupy that region. A similar system detects walls.",
  ],
  4: ["Field of the Invention: An obstacle detection system for an autonomous cleaning robot."],
  6: [
    "Background: Sonar systems for autonomous cleaning robots are too complex or expensive, while tactile sensors are inefficient; battery-operated consumer robots need simple, low-cost detection of stairs, unsuitable obstacles, and walls.",
  ],
  7: [
    "Objects: The invention seeks an obstacle detector that is simple, accurate, easy to implement and calibrate, and a wall detector that consumes minimal power and is unaffected by surfaces of different reflectivity.",
  ],
  9: [
    "Summary: Intersect the field of view of a detector with the field of emission of a directed beam at a predetermined region, then detect whether the floor or wall occupies that region.",
  ],
  10: [
    "Summary: The autonomous robot carries one sensor subsystem aimed at the traversed surface and another aimed near its direction of travel. Each combines a directed optical emitter with a photon detector whose fields intersect at a finite predetermined region.",
  ],
  12: [
    "Brief description: FIGS. 1-3 show the robot approaching a downward stair, an upward stair, and an obstacle on a floor. These are the initial operating situations the source uses to introduce the detector geometry.",
  ],
  13: [
    "Brief description: FIGS. 4-15 cover random and wall-following travel, the emitter and detector fields, overlap examples, the height relation, preferred sensor details, installation in the robot shell, and wall-detection placement.",
  ],
  14: [
    "Brief description: FIGS. 16-34 continue through the cliff and wall flow charts, decreasing-radius wall following, system and sensor views, and the detector, oscillator, power, decoupling, connector, jumper, and constant-current circuits.",
  ],
  16: [
    "The preferred cleaning robot may dust, mop, vacuum, or sweep. It uses random coverage and wall following, distinguishes stairs from traversable low obstacles, and gives the claimed detector a concrete cleaning-machine setting.",
  ],
  17: [
    "The source contrasts its two operating modes: random bounce runs straight until contact and then makes a random turn, while wall following tracks a wall for a time. Both modes explain why the device needs low-power reliable obstacle sensing.",
  ],
  18: [
    "Sensor subsystem 50 uses emitter 52 and detector 56. Their directed emission and view fields intersect in a region whose expected occupancy by floor or wall lets the controller distinguish a drop or obstacle from an intended surface.",
  ],
  19: [
    "The detailed description states both responses of the same geometry: obstacle avoidance redirects the robot when the floor does not occupy the overlap region, while wall following redirects it when a wall does occupy that region. Collimator tubes define the two optical cones.",
  ],
  20: [
    "The preferred angled collimators make the overlap region finite, reducing sensitivity to specular scattering and surface reflectivity. The source identifies an infrared emitter and infrared radiation detector, while noting the differing distance responses of emitted and returned energy.",
  ],
  21: [
    "For wall sensing, emitter 102 and detector 100 are parallel to the floor and use 22-degree cones. Their optical axes intersect 80 degrees apart, locating the finite sensing volume ahead of the robot shell and directing specular reflections from emitter toward detector.",
  ],
  22: [
    "The cliff-sensor logic modulates the emitter at several kilohertz and tests the tuned detector at step 150. An absent signal at step 152 means the expected surface is absent, initiates avoidance, and resumes the sensing loop after a reflected signal.",
  ],
};

export const roombaArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e",
  preparedBy:
    "Classic Patents editorial agent (BrightPelican; cloud-assisted research reconciled to the pinned facsimile)",
  preparedAt: "2026-08-21",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Jones",
        "Patent No.: US 6,594,844 B2",
        "Date of Patent: Jul. 22, 2003",
        "ROBOT OBSTACLE DETECTION SYSTEM",
        "Inventor: Joseph L. Jones, Acton, MA (US)",
        "Assignee: iRobot Corporation, Burlington, MA",
        "Appl. No.: 09/768,773",
        "Filed: Jan. 24, 2001",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "A robot obstacle detection system including a robot housing which navigates with respect to a surface and a sensor subsystem having a defined relationship with respect to the housing and aimed at the surface for detecting the surface. The sensor subsystem includes an optical emitter which emits a directed beam having a defined field of emission and a photon detector having a defined field of view which intersects the field of emission of the emitter at a region. A circuit in communication with a detector redirects the robot when the surface does not occupy the region to avoid obstacles. A similar system is employed to detect walls.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p("This invention relates to an obstacle detection system for an autonomous cleaning robot."),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "There is a long felt need for autonomous robotic cleaning devices for dusting, mopping, vacuuming, and sweeping operations. Although technology exists for complex robots which can, to some extent, “see” and “feel” their surroundings, the complexity, expense and power requirements associated with these types of robotic subsystems render them unsuitable for the consumer marketplace.",
    ),
    p(
      "The assignee of the subject application has devised a less expensive, battery operated, autonomous cleaning robot which operates in two modes: random and wall following. In the random bounce mode, the processing circuitry of the robot causes it to move in a straight line until the robot comes into contact with an obstacle; the robot then turns away from the obstacle and heads in a random direction. In the wall following mode, the robot encounters a wall, follows it for a time, and then returns to the random mode.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "It is therefore an object of this invention to provide a robot obstacle detection system which is simple in design, low cost, accurate, easy to implement, and easy to calibrate. It is a further object of this invention to provide such a robot detection system which prevents an autonomous cleaning robot from driving off a stair or over an obstacle which is too high or too low. It is a further object of this invention to provide a robotic wall detection system which is low cost, accurate, easy to implement and easy to calibrate.",
    ),
    p(
      "This invention features an autonomous robot comprising a housing which navigates in at least one direction on a surface. A first sensor subsystem is aimed at the surface for detecting obstacles on the surface. A second sensor subsystem is aimed at least proximate the direction of navigation for detecting walls. Each subsystem includes an optical emitter which emits a directed beam having a defined field of emission and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite, predetermined region.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "Other objects, features and advantages will occur to those skilled in the art from the following description of a preferred embodiment and the accompanying drawings, in which:\n",
      makePreview("FIG. 1", [1], "Robot 10 approaching downward stair 12"),
      " is schematic view of a robot in accordance with the subject invention approaching a downward stair;\n",
      makePreview("FIG. 2", [2], "Robot 10 approaching upward stair 14"),
      " is a schematic view of the same robot approaching an upward stair;\n",
      makePreview("FIG. 3", [3], "Robot 10 approaching floor obstacle 16"),
      " is a schematic view of the same robot approaching an obstacle on a floor.",
    ),
    p(
      "FIG. 4 is a schematic view showing the difference between the wall following and random modes of travel of a robot in accordance with the subject invention; FIG. 5 is a schematic view of a sensor subsystem in accordance with one embodiment of the subject invention; FIG. 6 is a schematic view of a sensor subsystem in accordance with another, preferred embodiment of the subject invention; FIG. 7 is a schematic view showing the field of emission of the emitter and the field of view of the detector of the sensor subsystem shown in FIG. 6; FIG. 8 is a three dimensional schematic view showing a fall overlap of the field of emission of the emitter and the field of view of the detector in accordance with the subject invention; FIG. 9 is a three dimensional schematic view showing the situation which occurs when there is a minimal overlap between the field of emission and the field of view of the sensor subsystem of the subject invention; FIG. 10 is a graph showing the relationship between the ratio of overlap area and the height of the sensor subsystem above the floor; FIG. 11 is a series of views showing, from top to bottom, no overlap between the field of emission and the field of view and then a full overlap of the field of view over the field of emission; FIG. 12 is a set of figures corresponding to FIG. 11 depicting the area of overlap for each of these situations shown in FIG. 11; FIG. 13 is a more detailed schematic view of the sensor subsystem according to the preferred embodiment of the subject invention; FIG. 14 is a schematic view of the sensor subsystem of FIG. 13 in place on the shell or housing of a robot in accordance with the subject invention; FIG. 15 is a schematic view of the wall detection system in accordance with the subject invention in place on the shell or housing of a robot;",
    ),
    p(
      "FIG. 16 is a schematic three dimensional view of another embodiment of the sensor system in accordance with the subject invention; FIG. 17 is a flow chart depicting the primary steps associated with a logic which detects whether a cliff is present in front of the robot in accordance with the subject invention; FIG. 18 is a flow chart depicting the primary steps associated with the logic of the wall detection mode of operation of the robot in accordance with the subject invention; FIG. 19 is a bottom view of a cleaning robot in accordance with the subject invention configured to turn about curvatures of decreasing radiuses; FIG. 20 is a schematic top view showing the abrupt turns made by a robot in the wall following mode when the wall following algorithm of the subject invention is not employed; FIG. 21 is a view similar to FIG. 20 except that now the wall following algorithm of the subject invention is employed to smooth out the path of the robotic cleaning device in the wall following mode; FIG. 22 is a block diagram showing the primary components associated with a complete robotic cleaning device; FIG. 23 is a schematic three dimensional view of a robotic cleaning device employing a number of cliff sensors and wall sensors in accordance with the subject invention; FIG. 24 is a bottom view of one particular robotic cleaning device and the cliff sensors incorporated therewith in accordance to the subject invention; FIG. 25 is a side view of the same robot further incorporating wall following sensors in accordance with the subject invention; FIG. 26 is a circuit diagram for the detector circuit of the subject invention; FIG. 27 is a circuit diagram for the oscillator circuit of the subject invention; FIG. 28 is a circuit diagram for the power connection circuit of the subject invention; FIG. 29 is the decoupling circuit of the subject invention; FIG. 30 is a diagram of a connector used in the subject invention; FIG. 31 is a diagram of another connector; FIG. 32 is a diagram of still another connector; FIG. 33 is a circuit diagram of a jumper used in the subject invention; and FIG. 34 is a circuit diagram for constant current source used in the subject invention.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Robotic cleaning device 10, ",
      makePreview("FIG. 1", [1], "Robot 10 approaching downward stair 12"),
      ' can be configured to dust, mop, vacuum, and/or sweep a surface such as a floor. Typically, robot 10 operates in two modes: random coverage and a wall following mode as discussed in the Background section above. In either mode, robot 10 may encounter downward stair 12 or another similar “cliff”, upward stair 14, FIG. 2 or another similar rise, and/or obstacle 16, FIG. 3. According to one specification, the robot must be capable of traversing obstacles less then 5/8" high or low. Therefore, robot 10 must avoid stairs 12 and 14 but traverse obstacle 16 which may be an extension cord, the interface between a rug and hard flooring, or a threshold between rooms.',
    ),
    p(
      "As delineated in the background of the invention, presently available obstacle sensor subsystems useful in connection with robot 10 are either too complex or too expensive or both. Moreover, robot 10, FIG. 4 is designed to be inexpensive and to operate based on battery power to thus thoroughly clean room 20 in two modes: a wall following mode as shown at 22 and 24 and a random bounce mode as shown at 26. In the wall following mode, the robot follows the wall for a time. In the random bounce mode, the robot travels in a straight line until it bumps into an object. It then turns away from the obstacle by a random turn and then continues along in a straight line until the next object is encountered.",
    ),
    p(
      "In the simplest embodiment, sensor subsystem 50, FIG. 5 according to this invention includes optical emitter 52 which emits a directed beam 54 having a defined field of emission explained supra. Sensor subsystem 50 also includes photon detector 56 having a defined field of view which intersects the field of emission of emitter 52 at or for a given region. Surface 58 may be a floor or a wall depending on the arrangement of sensor subsystem 50 with respect to the housing of the robot.",
    ),
    p(
      "In general, for obstacle avoidance, circuitry is added to the robot and connected to detector 56 to redirect the robot when surface 58 does not occupy the region defining the intersection of the field of emission of emitter 52 and the field of view of detector 56. For wall following, the circuitry redirects the robot when the wall occupies the region defined by the intersection of the field of emission of emitter 52 and the field of view of detector 56. Emitter collimator tube 60 forms directed beam 54 with a predefined field of emission and detector collimator tube 62 defines the field of view of the detector 56.",
    ),
    p(
      "Accordingly, in the preferred embodiment, emitter collimator 60', FIG. 6 and detector collimator 62' are both angled with respect to surface 58 and with respect to each other as shown. In this way, the region 70, FIG. 7 in which the field of emission of emitter 52' as shown at 72 and the field of view of detector 56' as shown at 74 intersect is finite to more adequately address specular scattering and surfaces of different reflectivity. In this design, the emitter is typically an infrared emitter and the detector is typically an infrared radiation detector. The infrared energy directed at the floor decreases rapidly as the sensor-to-floor distance increases while the infrared energy received by the detector changes linearly with surface reflectivity.",
    ),
    p(
      "For wall detection, emitter 102 and detector 100 are arranged as shown in FIG. 15. The optical axes of the emitter and detector are parallel to the floor on which the robot travels. The field of emission of the emitter and the field of view of the detector are both 22 degree cones. A three millimeter diameter tube produces a cone of this specification when the active element is mounted 0.604 inches from the open end as shown. The optical axes of the emitter and detector intersect at an angle of 80 degrees. The volume of intersection 103 occurs at a point about 2.6 inches ahead of the point of tangency between the robot shell 106 and the wall 104 when the robot is travelling parallel to the wall. The line bisecting the intersection of the optical axes of the emitter and detector is perpendicular to the wall. This ensures that reflections from specular walls are directed from the emitter into the detector.",
    ),
    p(
      "The logic of the circuitry associated with the cliff sensor embodiment modulates the emitter at a frequency of several kilohertz and detects any signal from the detector, step 150, FIG. 17, which is tuned to that frequency. When a signal is not output by the detector, step 152, the expected surface is not present and no overlap is detected. In response, an avoidance algorithm is initiated, step 17 to cause the robot to avoid any interfering obstacle. When a reflected signal is detected, processing continues to step 150.",
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
          text: "A robot obstacle detection system comprising: a robot housing which navigates with respect to a surface; a sensor subsystem having a defined relationship with respect to the housing and aimed at the surface for detecting the surface, the sensor subsystem including: an optical emitter which emits a directed beam having a defined field of emission, and a photon detector having a defined field of view which intersects the field of emission of the emitter at a finite region; and a circuit in communication with the detector for redirecting the robot when the surface does not occupy the region to avoid obstacles.",
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
          text: "A robot wall detection system comprising: a robot housing which navigates with respect to a wall; a sensor subsystem having a defined relationship with respect to the housing and aimed at the wall for detecting the presence of the wall, the sensor subsystem including: an emitter which emits a directed beam having a defined field of emission, and a detector having a defined field of view which intersects the field of emission of the emitter at a region; and a circuit in communication with the detector for redirecting the robot when the wall occupies the region.",
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
          text: "The system of claim 9 in which the circuit includes logic which redirects the robot away from the wall when the wall occupies the region and back towards the wall when the wall no longer occupies the region of intersection.",
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
