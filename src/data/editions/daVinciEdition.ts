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

export const DAVINCI_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1856, height: 2385 },
  2: { width: 1856, height: 2385 },
  3: { width: 1856, height: 2385 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-6331181-davinci/fig-${number}-source-crop-v1.png`;
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
      width: DAVINCI_FIGURE_DIMS[num]?.width ?? 1200,
      height: DAVINCI_FIGURE_DIMS[num]?.height ?? 1600,
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

export const davinciParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Abstract: Robotic surgical system comprising master-slave manipulators, tool interface electronics, and memory for tool calibration offsets and compatibility identification.",
  ],
  4: [
    "Field of the Invention: Minimally invasive robotic tele-surgery, articulated multi-axis surgical end effectors, and surgical instrument calibration memory systems.",
  ],
  6: [
    "Background: Open surgery requires large traumatic incisions resulting in extended recovery times. Laparoscopic surgery reduces incision size but restricts surgeon dexterity to straight, unarticulated rigid instruments with inverted pivot kinematics.",
  ],
  7: [
    "Limitations of conventional laparoscopy: Loss of hand-eye coordination, lack of wrist articulation inside the patient, surgeon fatigue, and magnified physiological hand tremor.",
  ],
  9: [
    "Summary: Master-slave telemanipulator system providing 7 degrees of freedom, intuitive natural hand-eye alignment, motion scaling, tremor filtering, and digital tool identification.",
  ],
  10: [
    "Tool interface circuitry: Non-volatile memory on each detachable surgical instrument storing unique serial numbers, tool life counters, and factory calibration offsets for automated robot initialization.",
  ],
  12: [
    "Brief Description of Figures: FIG. 1 is an overview of the robotic surgical workstation and patient cart; FIG. 2 shows the articulated EndoWrist wrist joint; FIG. 3 shows the sterile tool interface mount.",
  ],
  14: [
    "Detailed Description: The surgeon sits comfortably at an ergonomic master console viewing a 3D stereoscopic display aligned with hand master controllers.",
  ],
  15: [
    "Master-slave kinematics: Digital servo controllers track surgeon hand motions at 1,000 Hz, applying customizable motion scaling (e.g., 3:1 or 5:1 reduction) and low-pass filtering to eliminate physiological tremor.",
  ],
  16: [
    "EndoWrist mechanism: A multi-cable pulleyless wrist assembly positioned at the distal end of an 8 mm shaft provides full internal pitch, yaw, and roll articulation inside the patient.",
  ],
  17: [
    "Tool interface & sterile drape: Driven rotary disks on the robotic slave arm engage mating driven elements on the detachable tool housing across a sterile plastic barrier.",
  ],
  18: [
    "Onboard EEPROM memory: The instrument housing includes electronic memory transmitting tool type, joint axis geometry, and precise measured calibration offsets directly to the central robot computer.",
  ],
  19: [
    "Safety interlocks: Automated tool life tracking prevents instrument wear and ensures single-procedure sterility compliance across complex surgical interventions.",
  ],
};

export const davinciArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Tierney et al.",
        "Patent No.: US 6,331,181 B1",
        "Date of Patent: Dec. 18, 2001",
        "SURGICAL ROBOTIC TOOLS, DATA ARCHITECTURE, AND USE",
        "Inventors: Michael J. Tierney, David J. Rosa, Stephen J. Blumenkranz, Gary S. Guthart",
        "Assignee: Intuitive Surgical, Inc., Mountain View, CA (US)",
        "Application No.: 09/418,726 · Filed: Oct. 15, 1999",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "Robotic surgical tools, systems, and methods for preparing for and performing robotic surgery include a robotic surgical component having a component body with an interface mountable to a component holder of a robotic surgical system. The component includes circuitry defining a signal for transmitting to the processor, indicating component compatibility, component type, and calibration offsets.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p(
      "The present invention relates generally to robotic surgical devices, systems, and methods, and more particularly to articulated robotic surgical instruments, master-slave telemanipulation architectures, and data exchange interfaces between detachable surgical tools and robotic controllers.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "Minimally invasive surgical techniques avoid open surgical incisions by introducing elongate surgical instruments and endoscopes through small puncture apertures (such as 5 to 12 mm trocars) in the patient’s body wall. While minimally invasive surgery significantly reduces patient trauma, postoperative pain, and recovery times, conventional manual laparoscopic instruments severely constrain surgeon dexterity.",
    ),
    p(
      "Traditional manual laparoscopic instruments pivot about the entry incision fulcrum, causing inverted motion where moving the instrument handle to the left moves the tool tip to the right. Furthermore, rigid manual instruments lack wrist articulation inside the body cavity, severely limiting the surgeon’s ability to manipulate delicate tissue, perform precise dissection, and tie surgical sutures in deep anatomical spaces.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "The present invention provides advanced robotic surgical tools and master-slave control architectures that restore intuitive human dexterity inside minimally invasive surgical sites. The robotic system includes a surgeon master console, a patient-side surgical cart with motorized robotic manipulator arms, and detachable articulated robotic instruments.",
    ),
    p(
      "Each robotic surgical instrument incorporates an ",
      term(
        "EndoWrist mechanism",
        "Articulated EndoWrist Wrist Joint",
        "A multi-cable distal wrist mechanism providing internal pitch, yaw, and rotation inside the patient with 7 degrees of freedom.",
      ),
      " providing pitch, yaw, and grip actuation inside the patient body, combined with onboard electronic memory that stores tool calibration offsets and tool-type identification for automatic calibration by the robot processor.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWING FIGURES",
    },
    p(
      "The invention is described in detail with reference to the accompanying drawings:\n",
      makePreview(
        "FIG. 1",
        [1],
        "Perspective view of the master-slave robotic surgical workstation and patient cart",
      ),
      " is a perspective view of a robotic surgical workstation and patient cart;\n",
      makePreview(
        "FIG. 2",
        [2],
        "Perspective view of the distal articulated EndoWrist wrist joint and forceps end effector",
      ),
      " is a perspective view of an articulated distal wrist joint and forceps end effector; and\n",
      makePreview(
        "FIG. 3",
        [3],
        "Perspective view of the sterile tool interface housing showing driven engagement disks",
      ),
      " is a perspective view of the tool interface housing showing driven engagement elements.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Robotic surgical workstation overview"),
      ", a robotic surgical system 10 includes a surgeon console 12 and a patient-side cart 14 supporting a plurality of robotic manipulator arms 16. The surgeon sits at console 12 viewing a high-resolution 3D stereoscopic surgical field through viewer 18 while manipulating left and right master control grips 20.",
    ),
    p(
      "A digital control system samples master grip positions at high frequency (1,000 Hz) and maps master movements to slave instrument motions using coordinate transformation matrices. The controller incorporates selectable motion scaling (such as 3:1 or 5:1 displacement reduction) and digital low-pass filtering to completely filter out physiological hand tremor, enabling microscopic surgical precision.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Distal wrist and forceps"),
      ", the distal end of tool shaft 30 includes a multi-axis wrist joint 32 supporting opposed forceps jaws 34. Actuation cables extending through the shaft couple driven disks at the proximal interface to the wrist pulleys and jaws, providing seven degrees of freedom matching human wrist and finger movement.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Tool interface housing"),
      ", tool housing 40 includes an interface 42 that releasably latches onto the robotic arm tool holder. A series of rotatable driven disks 44 engage motor output drive pins on the robot arm across a sterile drape barrier to transmit mechanical torque without breaking sterility.",
    ),
    p(
      "Tool housing 40 further houses an electronic memory chip (such as an EEPROM) electrically connected to interface pins. The memory stores a unique tool serial number, tool-type code, permitted procedure count, and high-precision factory calibration offsets measuring the angular deviation between nominal driven disk positions and actual jaw angles.",
    ),
    p(
      "When the instrument is latched onto the robot arm, the central processor automatically reads the calibration data from memory, initializes kinematic transformation tables, and verifies tool compatibility and remaining procedure life before enabling master-slave motion.",
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
          text: "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an identifier signal included in a table accessible to the processor for comparison 10 15 20 25 30 40 45 55 60 18 with the signal, the table comprising a plurality of compatible tool identification signals.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the signal indicates tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the signal indicates a range of motion of the end effectors.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 1, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an arbitrary compatibility data string.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates a range of motion of the end effectors.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal indicates a tool-type of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the probe comprises an elongate shaft suitable for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the signal further indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of cal- endar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, wherein the end effector comprises an image capture device to define a field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The tool of claim 6, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical component for use in a robotic surgical system having a processor and a component holder, the component comprising: a component body having an interface mountable to the component holder, the body supporting a surgical end effector; a drive system coupled to the body, the drive system moving the end effector in response to commands from the processor; and circuitry mounted on the body, the circuitry defining a signal for transmitting to the processor, the signal comprising at least one member selected from the group consisting of compatibility of the component with the system, a component-type of the component, coupling of the component to the system, and calibration of the component; wherein the component comprises a tool including a shaft having a proximal end and a distal end, the end effector disposed adjacent the distal end of the shaft, with a plurality of degrees of motion relative to the proximal end of the shaft, and wherein the interface comprises a plurality of driven elements, and further comprising a tool drive system coupling the driven elements to the degrees of motion of the end effector, the tool drive system having one or more calibration offsets between a nominal position of the end effector relative to the driven elements and a measured position of the end effector relative to the driven elements; wherein the circuitry comprises a memory storing data indicating the offsets, the memory coupled to the interface so as to transmit the offsets to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "The component of claim 17, wherein the component body comprises an elongate shaft for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "A robotic surgical tool for use with a robotic manipulator having a tool holder, the tool holder having magnetically actuatable circuitry, the tool comprising; a probe having a proximal end and a distal end; a surgical end effector adjacent the distal end of the probe; an interface adjacent the proximal end of the probe, the interface releasably coupleable with the holder, the 10 15 20 25 30 20 interface comprising a magnet positioned so as to actuate the circuitry of the holder.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the circuitry defines a signal for transmitting to a processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal comprises an unique tool identifier.",
        },
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal comprises tool calibration offsets of the tool.",
        },
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, wherein the signal indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of calendar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        },
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the robotic manipulator comprises a drive system coupled to the probe, the drive system moving the end effector in response to commands from a processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        },
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the end effector comprises an image capture device to define a field of view.",
        },
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 20, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        {
          kind: "text",
          text: "The robotic surgical tool of claim 19, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        },
      ],
    },
  ],
};

export const davinciEdition = davinciArchivalEdition;
