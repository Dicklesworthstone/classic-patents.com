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
    "Sensor coordination: A downward sensor redirects the robot when the expected surface is absent; a wall sensor redirects when the wall occupies the intersection region and returns toward it through decreasing radii of curvature.",
  ],
  12: [
    "Brief Description of Figures: FIGS. 1-3 show a robot approaching downward and upward stairs and a floor obstacle; FIGS. 4-16 show travel paths, optical fields, overlap, collimators, and sensor placement; FIGS. 17-18 show cliff and wall logic; FIGS. 19-21 show decreasing-curvature wall following; FIGS. 22-25 show system and sensor placement; and FIGS. 26-34 show detector, oscillator, power, connector, jumper, and charging circuits.",
  ],
  13: [
    "Detailed Description: Cleaning device 10 can dust, mop, vacuum, or sweep a floor and operates in random coverage and wall-following modes. It may encounter downward stair 12, upward stair 14, or floor obstacle 16.",
  ],
  14: [
    "Random and wall-following modes: In random bounce the robot travels straight until contact, turns away randomly, and continues; in wall following it follows a wall for a time before returning to random mode.",
  ],
  16: [
    "Cliff detection geometry: Emitter 52 and detector 56 have fields that intersect at a region. When the expected floor does not occupy that region, circuitry redirects the robot to avoid the stair or unsuitable obstacle.",
  ],
  17: [
    "Wall-following behavior: A side-looking emitter and detector identify a wall in their finite intersection region; the controller turns away and back toward the wall through decreasing radii of curvature for smoother following.",
  ],
  18: [
    "Preferred optics: Angled emitter and detector collimators create a finite overlap that better addresses specular scattering and surfaces of different reflectivity. Infrared systems are preferred when cost is a design constraint.",
  ],
  19: [
    "Modulation and thresholding: The emitter is modulated at several kilohertz and the detector is tuned to that frequency; amplification, DC blocking, peak detection, and comparison produce the logic output.",
  ],
  20: [
    "Circuit and embodiments: The source also describes fiber-optic or laser emitters, a microprocessor controlling drive motion, multiple cliff and wall sensors, and detector, oscillator, power, connector, jumper, and constant-current circuits.",
  ],
  21: [
    "The wall controller turns away when a wall occupies the intersection and turns back when it leaves, preferably through continuously decreasing radii of curvature for smoother following.",
  ],
  22: [
    "The preferred cliff logic modulates the emitter at several kilohertz, tunes the detector, and starts avoidance when the expected-surface reflection is absent.",
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
        "Application No.: 09/768,773 · Filed: Jan. 24, 2001",
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
      "The robot includes a ",
      term(
        "cliff sensor subsystem",
        "Cliff Detection Optical Subsystem",
        "Down-looking collimated infrared emitter and photodiode pairs whose beams intersect at a defined distance above the floor, detecting drops such as stairs.",
      ),
      " comprising an optical emitter and detector whose fields intersect at a predetermined region, providing detection of whether the expected floor occupies that region.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    p(
      "The invention is described in detail with reference to the accompanying drawings:\n",
      makePreview("FIG. 1", [1], "Robot 10 approaching downward stair 12"),
      " is a schematic view of a robot in accordance with the subject invention approaching a downward stair;\n",
      makePreview("FIG. 2", [2], "Robot 10 approaching upward stair 14"),
      " is a schematic view of the same robot approaching an upward stair; and\n",
      makePreview("FIG. 3", [3], "Robot 10 approaching floor obstacle 16"),
      " is a schematic view of the same robot approaching an obstacle on a floor.",
    ),
    p(
      "FIG. 4 is a schematic view showing the difference between the wall following and random modes of travel; FIG. 5 is a schematic view of a sensor subsystem; FIG. 6 is a schematic view of another, preferred sensor subsystem; FIG. 7 shows the field of emission and field of view; FIG. 8 shows full overlap; FIG. 9 shows minimal overlap; FIG. 10 is a graph of overlap area and sensor height; FIGS. 11 and 12 show overlap examples and corresponding areas; FIG. 13 is a detailed sensor-subsystem view; FIG. 14 shows the subsystem in a robot housing; FIG. 15 shows the wall detection system in the housing; and FIG. 16 shows another sensor-system embodiment.",
    ),
    p(
      "FIG. 17 is a flow chart for cliff detection; FIG. 18 is a flow chart for wall detection; FIG. 19 shows decreasing-curvature wall following; FIGS. 20 and 21 compare abrupt and smoothed wall-following paths; FIG. 22 is a complete robotic-cleaning-device block diagram; FIG. 23 is a three-dimensional device view with cliff and wall sensors; FIG. 24 is a bottom view of cliff detectors; FIG. 25 is a side view with wall sensors; and FIGS. 26 through 34 show detector, oscillator, power, decoupling, connector, jumper, and constant-current circuits.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Robot 10 approaching downward stair 12"),
      ", robotic cleaning device 10 can be configured to dust, mop, vacuum, and/or sweep a surface such as a floor. Typically, robot 10 operates in two modes: random coverage and a wall following mode. In either mode, robot 10 may encounter downward stair 12, upward stair 14, and/or obstacle 16.",
    ),
    p(
      "As delineated in the background of the invention, presently available obstacle sensor subsystems useful in connection with robot 10 are either too complex or too expensive or both. Moreover, robot 10, FIG. 4 is designed to be inexpensive and to operate based on battery power to thus thoroughly clean room 20 in two modes: a wall following mode as shown at 22 and 24 and a random bounce mode as shown at 26.",
    ),
    p(
      "In the simplest embodiment, sensor subsystem 50, FIG. 5 includes optical emitter 52 which emits a directed beam 54 having a defined field of emission. Sensor subsystem 50 also includes photon detector 56 having a defined field of view which intersects the field of emission of emitter 52 at or for a given region. Surface 58 may be a floor or a wall depending on the arrangement of sensor subsystem 50 with respect to the housing of the robot.",
    ),
    p(
      "For wall following, the circuitry redirects the robot when the wall occupies the region defined by the intersection of the field of emission of emitter 52 and the field of view of detector 56. Emitter collimator tube 60 forms directed beam 54 with a predefined field of emission and detector collimator tube 62 defines the field of view of detector 56.",
    ),
    p(
      "Accordingly, in the preferred embodiment, emitter collimator 60', FIG. 6 and detector collimator 62' are both angled with respect to surface 58 and with respect to each other. The region 70, FIG. 7 in which the field of emission of emitter 52' and the field of view of detector 56' intersect is finite to more adequately address specular scattering and surfaces of different reflectivity.",
      term(
        "wall following mode",
        "Wall boundary tracking behavior",
        "The source's controller turns away from a detected wall and then returns through decreasing radii of curvature until the optical intersection again contains the wall.",
      ),
      " the circuitry redirects the robot when the wall occupies the region and back towards the wall when the wall no longer occupies the region of intersection, preferably at decreasing radiuses of curvature until the wall once again occupies the region.",
    ),
    p(
      "In the wall detection mode, the logic modulates the emitter and detects signals from the detector until a reflection is detected. A wall is then next to the robot and the controlling circuitry causes the robot to turn away from the wall and then turn back until a reflection is again detected. By continuously decreasing the radius of curvature, the path of the robot along the wall in the wall following mode is made smoother.",
    ),
    p(
      "The source further describes an emitter modulated at a frequency of several kilohertz and a detector tuned to that frequency. When a signal is not output by the detector, the expected surface is not present and no overlap is detected; in response, an avoidance algorithm is initiated.",
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
