import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const FIGURE_PATH = "/patents/figures/us-4976582-clavel-delta-robot";
const SOURCE_CROP_SIZE = [5800, 8520] as const;

const p = (
  ...inlines: readonly (string | CuratedSpecificationInline)[]
): { kind: "paragraph"; inlines: CuratedSpecificationInlines } => ({
  kind: "paragraph",
  inlines: inlines.map((inline) =>
    typeof inline === "string" ? { kind: "text", text: inline } : inline,
  ),
});

const term = (text: string, label: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  label,
  definition,
});

const figureFile = (number: number): string => {
  if (number === 3 || number === 4) return "fig-3-4-source-crop-v1.png";
  return `fig-${number}-source-crop-v1.png`;
};

const figure = (number: number, text = `FIG. ${number}`): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: `#figure-${number}`,
  referenceType: "figure",
  label: `Source crop of ${text} from US 4,976,582`,
  figurePreviews: [
    {
      src: `${FIGURE_PATH}/${figureFile(number)}`,
      alt: `${text}, source drawing crop from US 4,976,582`,
      width: SOURCE_CROP_SIZE[0],
      height: SOURCE_CROP_SIZE[1],
    },
  ],
});

const figureGroup = (numbers: readonly number[], text: string): CuratedSpecificationInline => {
  const primaryFigure = numbers[0];
  if (primaryFigure === undefined) {
    throw new Error("A grouped source-figure reference requires at least one figure number.");
  }
  const previewNumbers = numbers.filter(
    (number, index) =>
      numbers.findIndex((candidate) => figureFile(candidate) === figureFile(number)) === index,
  );

  return {
    kind: "reference",
    text,
    href: `#figure-${primaryFigure}`,
    referenceType: "figure",
    label: `Source crops of ${text} from US 4,976,582`,
    figurePreviews: previewNumbers.map((number) => ({
      src: `${FIGURE_PATH}/${figureFile(number)}`,
      alt: `FIG. ${number}, source drawing crop from US 4,976,582`,
      width: SOURCE_CROP_SIZE[0],
      height: SOURCE_CROP_SIZE[1],
    })),
  };
};

const claim = (number: number, text: string) => ({
  kind: "claim" as const,
  number,
  inlines: [{ kind: "text" as const, text }],
});

/**
 * Literal grant text, including the original typographical forms printed in
 * the 1990 grant. The distinct Certificate of Correction blocks below are a
 * source artifact, not a silent rewrite of this historical printing.
 */
const SOURCE_CLAIMS: Readonly<Record<number, string>> = {
  1: "A device for the movement and positioning of an element in space, comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion having a single degree of freedom with respect to said fixed portion; and means fixing in space the inclination and orientation of the movable member with respect to the base member for all motions of the moving portions of the actuators, said fixing means comprising at least three linking means respectively connecting the moving portion of each actuator to the movable member, each of the linking means having a first end mounted by articulation onto the moving portion of its respective actuator and a second end mounted by articulation onto the movable member, the device providing two and only two degrees of freedom between the first end of each linking means and the moving portion of its respective actuator, the device providing two and only two degrees of freedom between the second end of each linking means and the movable member.",
  2: "A device according to claim 1, at least one of the linking means comprising two parallel bars, each of said bars being mounted at a first end thereof by articulation onto the moving portion of its respective actuator, a second end of each of said bars being mounted by articulation onto the movable member.",
  3: "A device according to claim 2, wherein the moving portion of each actuator is mounted for rotation about an axis of the fixed portion of the said actuator.",
  4: "A device as in claim 2, wherein the moving portion of each actuator is mounted for linear translation with respect to the fixed portion thereof and is fixed against rotation thereof about an axis defined by the motion of translation.",
  5: "A device as in claim 1, at least one of the linking means comprising a single bar, a first end of said single bar being mounted on the moving portion of its respective actuator by a first articulation of cardan type, a second end of said single bar being mounted on the movable member by a second articulation of cardan type.",
  6: "A device as in claim 5, wherein the moving portion of each actuator is mounted for rotation about an axis of fixed portion of the said actuator.",
  7: "A device as in claim 5, wherein the moving portion of each actuator is mounted for linear translation with respect to the fixed portion thereof and is fixed against rotation thereof about",
  8: "A device as in one of claims 3, 4, 6 or 7, further comprising a working member rotatably mounted on the movable member and a supplementary motor for rotating the working member about a longitudinal axis of the working member, the supplementary motor being mounted on the base member.",
  9: "A device as in one of claims 3, 4, 6 or 7, further comprising a working member rotatably mounted on the movable member and a supplementary motor for rotating the working member about a longitudinal axis of the working member, the supplementary motor being mounted on the movable member.",
  10: "A device as in one of claims 3 or 4, wherein said at least one linking means is mounted by articulation of cardan type onto the moving portion of its respective actuator.",
  11: "A device as in one of claims 3 or 4, wherein said at least one linking means is mounted by articulation of ball-and-socket type onto the moving portion of its respective actuator.",
  12: "A device as in one of claims 3 or 4, wherein said at lest one linking means is mounted by articulation of cardan type onto the movable member.",
  13: "A device as in one of claims 3 or 4, wherein said at least one linking means is mounted by articulation of ball-and-socket type onto the movable member.",
  14: "A device for the movement and positioning of an element in space, comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by articulation of cardan type onto an end of the moving portion of its respective actuator, a second end of said at least one linking means being mounted onto the movable member by articulation providing two and only two degrees of freedom between the at least one linking means and the movable member.",
  15: "A device for the movement and positioning of an element in space comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of ,the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by articulation of cardan type onto the movable member, a second end of said at least one linking means being mounted onto the moving portion of its respective actuator by articulation providing two and only two degrees of freedom between the at least one linking means and the moving portion of the actuator.",
  16: "A device for the movement and positioning of an element in space, comprising. at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by articulation of ball-and-socket type onto an end of the moving portion of its respective actuator, a second end of said at least one linking means being mounted onto the movable member by articulation providing two and only two degrees of freedom between the at least one linking means and the movable member.",
  17: "A device for the movement and positioning of an element in space comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by articulation of ball-and-socket type onto the movable member, a second end of said at least one linking means being mounted onto the moving portion of its respective actuator by articulation providing two and only two degrees of freedom between the at least one linking means and the moving portion of the actuator.",
  18: "A device for the movement and positioning of an element in space, comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by universal joint articulation onto an end of the moving portion of its respective actuator, a second end of said at least one linking means being mounted onto the movable member by articulation providing two and only two degrees of freedom between the at least one linking means and the movable member.",
  19: "A device for the movement and positioning of an element in space comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, said at least one linking means being mounted at a first end thereof by universal joint articulation onto the movable member, a second end of said at least one linking means being mounted onto the moving portion of its respective actuator by articulation providing two and only two degrees of freedom between the at least one linking means and the moving portion of the actuator.",
  20: "A device for the movement and positioning of an element in space, comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, both of said bars being mounted at a first end thereof by universal joint articulation onto an end of the moving portion of its respective actuator, a second end of both of said bars being mounted by articulation onto the movable member so as to provide two and only degrees of freedom between said at least one linking means and the movable member.",
  21: "A device for the movement and positioning of an element in space comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising two parallel bars, both of said bars being mounted at a first end thereof by universal joint articulation onto the movable member, a second end of both of said bars being mounted by articulation onto the moving portion of its respective actuator so as to provide two and only two degrees of freedom between said at least one linking means and the movable member.",
  22: "A device for the movement and positioning of an element in space, comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising a single bar, said single bar of at least one of said linking means being mounted at a first end thereof by articulation of cardan type onto an end of the moving portion of its respective actuator, a second end of said bar being mounted onto the movable member by articulation providing two and only two degrees of freedom.",
  23: "A device for the movement and positioning of an element in space comprising: at least one base member; at least one movable member; at least three actuators, each actuator comprising a fixed portion, substantially immovably fixed on the base member, and a moving portion mounted for rotation about an axis of the fixed portion of the actuator; and at least three linking means respectively connecting the moving portion of the actuators to the movable member, at least one of the linking means comprising a single bar, said single bar of at least one linking means being mounted at a first end thereof by articulation of cardan type onto the movable member, a second end of said bar being mounted onto the moving portion of its respective actuator by articulation providing two and only two degrees of freedom.",
  24: "A device as in one of claims 14-23, further comprising a working member rotatably mounted on the movable member and a supplementary motor for rotating the working member about a longitudinal axis of the working member, the supplementary motor being mounted on the base member.",
  25: "A device as in one of claims 14-23, further comprising a working member rotatably mounted on the movable member and a supplementary motor for rotating the working member about a longitudinal axis of the working member, the supplementary motor being mounted on the movable member.",
};

export const clavelDeltaRobotArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e11516fed15c0937ee14decea63ff25557b848fb40ab381b29413737a145448e",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-02",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Clavel",
        "[19] Patent Number: 4,976,582",
        "[45] Date of Patent: Dec. 11, 1990",
        "[54] DEVICE FOR THE MOVEMENT AND POSITIONING OF AN ELEMENT IN SPACE",
        "[75] Inventor: Reymond Clavel, Ecublens, Switzerland",
        "[73] Assignee: Sogeva S.A., Switzerland",
        "[21] Appl. No.: 403,987",
        "[22] Filed: Sep. 6, 1989",
        "Related U.S. Application Data",
        "[63] Continuation of Ser. No. 96,113, Aug. 13, 1987, abandoned.",
        "[30] Foreign Application Priority Data: Dec. 16, 1985 [CH] Switzerland 5348/85",
      ],
    },
    { kind: "heading", level: 2, text: "ABSTRACT" },
    p(
      "The device comprises a base element (1) and a movable element (8). Three control arms (4) are rigidly mounted at their first extremity (15) on three shafts (2) which may be rotated. The three assemblies each formed by a shaft (2) and an arm (4) are the movable parts of three actuators (13) of which the fixed parts (3) are integral with the base element. The other extremity (16) of each control arm is made integral with the movable element through two linking bars (5a, 5b) hingedly mounted on the one hand to the second extremity (16) of the control arm and, on the other hand, to the movable element. The inclination and the orientation in space of the movable element remain unchanged, whatever the motions of the three control arms may be. The movable element supports a working element (9) of which the rotation is controlled by a fixed motor (11) situated on the base element. A telescopic arm (14) connects the motor to the working element.",
    ),
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p(
      "The invention is concerned with a device for the movement and positioning of an element in space.",
    ),
    p(
      "The majority of devices of the above type which are known, such, for example, as the main known industrial robots, include a carrier member which supports a wrist, the carrier member having three axes known as the main axes, intended for defining three degrees of freedom which may be rotations and/or translations, so as to position the wrist in space, the orientation of the said wrist being in turn controlled by one to three axes known as the secondary axes, in accordance with one to three supplementary degrees of freedom which are necessarily rotations.",
    ),
    p(
      "In these devices, the configuration of the carrier member of which may be of cartesian type having cylindrical coordinates or spherical coordinates or of ",
      term(
        "SCARA (Selective Compliance Assembly Robot)",
        "SCARA",
        "The period expansion of SCARA names an assembly-robot family intended to yield selectively in a plane. The grant uses it only as serial-robot prior-art context and supplies no compliance magnitude, joint stiffness, or collision model.",
      ),
      " type or having angular coordinates, the control of the degrees of freedom is effected in series. The first main axis is employed as a reference for the motion of the second main axis, the latter serving as a reference for the motion of the third main axis which in turn serves as a reference for the degrees of freedom which define the orientation of the wrist.",
    ),
    p(
      "The configuration in series necessitates the location of the driving motors at the level of each axis or demands a heavy and complicated configuration for the transmission of the motion to the axes, and, consequently, even in the case of the movement of a small load, large masses must be set in motion.",
    ),
    p(
      "On the other hand a device is known having a configuration similar to that of a flight simulator, having six axes working in parallel. In this case, the motors may be fixed, which limits the masses to be set in motion. This species of device, however, enables only a very restricted working volume to be reached.",
    ),
    p(
      "A device in which the control of the three basic degrees of freedom is effected in parallel is described in the patent U.S. Pat. No. 2,286,571. This device is intended for the positioning and t control of the motion of a paint gun. It comprises three actuators integral with one base member, each of the actuators including one fixed portion and one moving arm mounted in rotation at one end of it on the fixed portion of the actuator. On the second end of each of the arms are mounted respectively three linking bars by way of articulations of ",
      term(
        "cardan type",
        "Universal-joint style articulation",
        "A cardan articulation is a universal-joint style connection that admits angular misalignment between linked members. The patent uses the term to describe connection topology, not a specified bearing, stiffness, backlash, or torque capacity.",
      ),
      " mounted respectively at one of the ends of the linking bars. Two of the linking bars are mounted by articulation at their respective second ends onto the third linking bar, near to the second end of it. The support for the gun is mounted by articulation at the end of the third linking bar.",
    ),
    p(
      "The Patent Application FR-A-2,550,985 describes another device in which the control o the three basic degrees of freedom is effected in parallel. This document concerns an arm able to extend, retract and fold, composed of a plurality of extensible members mounted in series, each of them including three actuators acting in parallel.",
    ),
    p(
      "The known devices are, however, poorly adapted to the transfer of light pieces at very high rates.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "The aim of the present invention is to propose a device for the movement and positioning of an element in space, and in particular an industrial robot of new and advantageous configuration which enables the control of the three basic degrees of freedom in parallel from actuators arranged on a fixed support, whilst preserving the parallelism of the moving member with respect to the fixed support, and which is particularly adapted to the transfer of light pieces at very high rates. None of the known devices offers such characteristics.",
    ),
    p(
      "For this purpose the present invention is concerned with a device for the movement and positioning of an element in space, including at least one base member, at least one movable member and at least three actuators each of which comprises one fixed portion and one moving portion, the fixed portion of each actuator being integral with the base member, the moving portion of each of them being connected to the movable member by way of a linking member, each of the linking members being mounted by articulation firstly onto the moving portion of the actuator and mounted by articulation secondly onto the movable member, the whole being arranged so that the inclination and the orientation in space of the movable member remain unchanged, whatever the motions of the moving portions of the actuators may be, so as to constitute a ",
      term(
        "deformable space-parallelogram",
        "Spatial parallelogram constraint",
        "The source’s phrase denotes a three-dimensional linkage whose paired bars stay parallel while joints articulate. In the illustrated embodiment it is the geometric reason the movable member preserves orientation, not a numerical rigidity or dynamics guarantee.",
      ),
      ".",
    ),
    p(
      "In accordance with a first form of the invention, the moving portion of each actuator is mounted to rotate about a shaft integral with the fixed portion of the said actuator.",
    ),
    p(
      "In accordance with a second form of the invention, the moving portion of each actuator is mounted in translation with respect to the fixed portion of the said actuator, and the said moving portion is arranged so as to prevent its rotation about the axis of the motion of translation.",
    ),
    p(
      "In accordance with a characteristic of the invention, the device includes a working member integral with the movable member and a supplementary motor intended for controlling the rotation of the working member about its longitudinal axis.",
    ),
    p(
      "In accordance with a form of the invention, at least one of the linking members include two parallel bars, each of the said bars being mounted at one end of it by articulation onto one end of the moving portion of the actuator, the other end of each of the said bars being mounted by articulation onto the movable member, whence it results that the two parallel bars constitute a deformable parallelogram. The articulations of the parallel bars may be ball-and-socket joints or articulations of cardan type.",
    ),
    p(
      "In accordance with another form of the invention, at least one of the linking members includes one single bar mounted at its first end on the moving portion of the actuator by way of a first articulation of cardan type, and mounted at its second end on the movable member by way of a second articulation of cardan type.",
    ),
    p("The supplementary motor may be attached to the base member or to the moving member."),
    p("The device may be arranged so as to enable the measurement of a displacement in space."),
    p(
      "The advantages of the device of the invention are multiple. One of the main advantages is that the volume which can be reached is large and that the masses in motion are reduced to a minimum. This configuration enables the movement of pieces the total mass of which is of the same order as the inertia of the moving parts of the device. The operating rates may be very high. The presence of the three moving portions of the actuators acting in parallel constitutes an increase in the stiffness of the mechanism, which, at an equal rate of operation, enables better repeatability of position than that obtained with the majority of known industrial robots, even at high speed.",
    ),
    { kind: "heading", level: 2, text: "DESCRIPTION OF THE DRAWINGS" },
    p(
      figure(1),
      " is a perspective view of a device according to a first embodiment; ",
      figure(2),
      " is a similar view of a device according to a second embodiment; ",
      figure(3),
      " is a schematic illustration of a perspective view according to a third embodiment; ",
      figure(4),
      " is a perspective view of an actuator and a linking member of the third embodiment; ",
      figure(5),
      " is a perspective view of a device according to a fourth embodiment.",
    ),
    { kind: "heading", level: 2, text: "DESCRIPTION OF THE PREFERRED EMBODIMENTS" },
    p(
      "Referring to ",
      figure(1),
      ", the device includes one base member 1 and one movable member 8. The base member 1 includes three rotary actuators 13 each including one fixed portion 3 integral with the base member 1, the axes 2 of which are coplanar. Control arms 4 are mounted in the form of a rigid assembly at one end 15 of them respectively on each of the axes of rotation 2, so that the longitudinal axis of each arm is perpendicular to its corresponding axis of rotation 2.",
    ),
    p(
      "The other end 16 of each of the control arms 4 is integral with two linking bars 5a, 5b by way of two double articulations in cardan form 6a, 6b. Each of the two groups of linking bars 5a, 5b is connected otherwise by way of two double articulations 7a, 7b, of cardan type to the movable member 8 the movement of which may thus be controlled by the motion of the control arms 4. In a second embodiment shown in ",
      figure(2),
      ", the articulations 6a, 6b and 7a, 7b, may be replaced by ball-and-socket joints 26a, 26b and 27a, 27b.",
    ),
    p(
      "In the configuration represented in ",
      figure(1),
      ", the linking bars 5a, 5b remaining constantly in parallel form the sides of a parallelogram which moves in space and is deformable as a function of the respective motions of the control arms 4. The result is that the movable member 8 remains in parallel with itself, whatever the motions of the control arms may be. As shown in ",
      figureGroup([3, 4], "FIGS. 3 and 4"),
      ", the same configuration may be obtained in a third embodiment in which if the pairs of linking bars 5a, 5b are replaced by single oars 25, each of the bars 25 be mounted by way of an articulation 36, 37 of cardan type fixed respectively to each of their ends, on the one hand onto one of the control arms 4 and on the other hand onto the movable member 8 respectively.",
    ),
    p(
      "The three actuators 13 are connected by way of adequate amplifiers to a managing computer 12 intended for controlling the motions of the control arms 4.",
    ),
    p(
      "A working member 9 such, for example, as a gripping member, a tool, a sucker or a syringe may be arranged on the movable member 8. In the example represented in ",
      figure(1),
      ", a fourth degree of freedom of the device consists in the rotation of the working member about an axis 10 perpendicular to the movable member 8. This rotation is controlled by a fixed motor 11 arranged on the base member 1, the rotation being controlled by way of a rod system (for example, a telescopic arm 14) and other transmission members Of course in accordance with another variant, as shown in ",
      figure(2),
      ", the motor 11 may be attached to the movable member 8 and connected to the managing computer.",
    ),
    p(
      "In accordance with another variant execution of the device of ",
      figure(1),
      ", but not shown, the configuration described above may be completed by providing the control of the two supplementary degrees of freedom intended for the tilting of the working member in space. The corresponding driving motors may be fixed onto the base member 1, the transmission of the motion to the working member being effected by a system of rods and/or belts, cardan joints and other transmission members. These motors may also be attached directly to the movable member 8, the motors being connected to the managing computer.",
    ),
    p(
      "In accordance with another embodiment of the device, shown in ",
      figure(5),
      ", the control arms 4, which, in the example shown in ",
      figure(1),
      ", constitute moving portion turning about axes 2, may be replaced by members 24 moving on straight guides.",
    ),
    p(
      "In the configuration of the device of the invention represented in ",
      figure(1),
      ", the ends of the three control arms integral with the base member 1 are arranged in accordance with an equilateral triangle, Of course this arrangement is in no way exhaustive. On the other hand, although the device has been represented with one base member and one movable member in the form of plates arranged horizontally, these members may have various forms and be oriented in any positions whatever.",
    ),
    p(
      "The device of the invention may be employed in very wide fields of application. O(ne may mention, for example: the assembly of printed circuits of every kind; any field necessitating accurate and rapid assembly; the handling and packing of parts of every kind; the determination of a position in space intended, for example, for the measurement of a displacement or for a dimensional checking of pieces, etc.",
    ),
    { kind: "heading", level: 2, text: "I CLAIM:" },
    ...Array.from({ length: 25 }, (_, index) => {
      const number = index + 1;
      const sourceText = SOURCE_CLAIMS[number];
      if (sourceText === undefined) {
        throw new Error(
          `US 4,976,582 source claim ${number} is missing from the archival edition.`,
        );
      }
      return claim(number, sourceText);
    }),
    {
      kind: "heading",
      level: 2,
      text: "CERTIFICATE OF CORRECTION",
    },
    p(
      "It is certified that error appears in the above-identified patent and that said Letters Patent is hereby corrected as shown below: In column 1, line 49, before “control” please delete “t” and substitute therefor --the--. In column 1, line 63, after “control” please delete “o” and substitute therefor --of--. In column 3, line 55, please delete “oars” and substitute therefor --bars--; and delete “be” and substitute therefor --being--. In column 4, line 7, after “computer” please insert --.--. In column 4, line 37, please delete “O(ne” and substitute therefor --One--.",
    ),
    p("IN THE CLAIMS. In claim 6, column 5, line 26, before “fixed” please insert --the--."),
    p(
      "In claim 7, column 5, line 30, after “about” please insert --an axis defined by the motion of translation.-- In claim 15, column 6, line 20, after “of” please delete --,--.",
    ),
    p(
      "Signed and Sealed this Fourth Day of August, 1992. Attest: DOUGLAS B. COMER, Attesting Officer, Acting Commissioner of Patents and Trademarks.",
    ),
  ],
};

/** Paragraph-by-paragraph engineering readings keyed to the edition block index. */
export const clavelDeltaRobotParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The abstract establishes the architecture that matters: three base-side actuators, paired bars from each control arm, and a platform whose attitude is constrained. It also identifies a fourth, separately transmitted tool-axis rotation without claiming a particular gripper or payload.",
  ],
  4: [
    "This opening sentence is deliberately broad: the invention is a positioning device, not merely a packaging machine. The legal detail that makes it a Delta-style mechanism arrives in the later linking and orientation constraints.",
  ],
  5: [
    "The source distinguishes three pose-setting main axes from one to three wrist-orientation axes. It describes the conventional industrial-arm decomposition before proposing a different way to create the main translational motion.",
  ],
  6: [
    "This is the serial-chain baseline. Each downstream axis is referenced from a preceding one, so its motor or transmission commonly rides with upstream structure; the patent uses that moving-mass consequence as the problem it wants to avoid.",
  ],
  7: [
    "The stated weakness of serial arrangements is not that every serial robot fails, but that the described layout can require motor mass or a complicated transmission at successive axes. The patent’s proposed geometry tries to keep three drives at the fixed support.",
  ],
  8: [
    "Clavel acknowledges a parallel flight-simulator-like arrangement already could keep motors fixed, but says that arrangement had a restricted working volume. The new record should not turn this contrast into a universal performance theorem.",
  ],
  9: [
    "The prior Pollard mechanism is described as parallel control for a paint gun, but with three bars converging through another bar. Clavel’s paired-bar spatial parallelograms give a different route to holding the platform’s orientation while it translates.",
  ],
  10: [
    "The French application is another cited parallel-control design. The source describes extensible members in series, so this grant is not claiming every parallel robot; its asserted distinction is a fixed-support arrangement with an orientation-preserving movable member.",
  ],
  11: [
    "The stated application target is transfer of light pieces at very high rates. That is a qualitative source purpose; the grant supplies neither a payload mass nor a cycle rate, so the interactive model refuses performance numbers.",
  ],
  13: [
    "The summary names the central trade: three basic degrees are controlled in parallel from a fixed support while the moving member remains parallel to that support. This is the independent geometric idea the live claim probe exposes.",
  ],
  14: [
    "This paragraph lays out the legal chain: fixed actuator portions on a base, moving portions, linking members, articulations at both ends, and a constraint that preserves movable-member inclination and orientation. It is a topology and constraint statement, not a dimensions table.",
  ],
  15: [
    "The first form makes each actuator’s moving portion rotary about a base-supported shaft. Figure 1 chooses that rotary form, while the claim set also reserves a translating alternative rather than treating the illustrated crank arms as the only possible actuator.",
  ],
  16: [
    "The second form replaces a turning arm with a guide-mounted translator whose rotation about its travel axis is prevented. Figure 5 makes this alternative visible; it preserves the parallel-linking principle with a different input joint.",
  ],
  17: [
    "A supplementary motor can rotate a working member about its own longitudinal axis independently of the three parallel positioning inputs. The source gives a mechanical transmission path but no gear ratio, torque, speed, or control law.",
  ],
  18: [
    "Two parallel bars between an actuator and the movable member form a deformable parallelogram. Their central engineering job is not simply to add links: the paired geometry constrains the platform attitude while allowing the joints to articulate through the workspace.",
  ],
  19: [
    "The single-bar alternative uses cardan-type articulation at both ends. It broadens the disclosure beyond paired bars, but the illustrated Delta form and its educational model focus on the paired-bar topology that visibly preserves the platform orientation.",
  ],
  20: [
    "The supplementary tool-axis motor may sit on either the base or the movable member. The preferred illustrated fixed-base motor transfers rotation through a rod system, which is why the model treats tool rotation separately from platform orientation.",
  ],
  21: [
    "The grant also contemplates measuring a displacement in space. It does not identify a sensor principle, calibration procedure, resolution, or uncertainty, so no metrology precision is simulated or displayed.",
  ],
  22: [
    "The patent argues that parallel action reduces moving mass and increases stiffness and repeatability at a given operating rate. Those are the inventor’s qualitative advantages; a faithful model may show geometric closure but must not invent stiffness, payload, or acceleration telemetry.",
  ],
  24: [
    "The drawing list has a purposeful sequence: the rotary paired-bar embodiment, ball-and-socket alternative, single-bar form and its joint detail, then the translating-actuator form. The source crops let a reader compare these disclosed variations directly.",
  ],
  26: [
    "Figure 1 places three rotary actuator axes on a common base and makes each control arm perpendicular to its axis. The triangular base arrangement distributes three input arms around a central movable member rather than chaining them serially.",
  ],
  27: [
    "At each arm tip, two linking bars run to the movable member through paired cardan joints. Figure 2 swaps those cardan joints for ball-and-socket joints; both variants serve the same positional chain while allowing the required angular articulation.",
  ],
  28: [
    "This paragraph states the key invariant: paired bars stay parallel as a moving spatial parallelogram, so the movable member remains parallel with itself. The third embodiment’s single bars are disclosed separately and should not be confused with the paired-bar live probe.",
  ],
  29: [
    "The three actuators are connected through amplifiers to a managing computer. That establishes program control in the source, but the patent provides no servo gains, sampling interval, motor constants, or trajectory planner to justify a closed-loop dynamics simulation.",
  ],
  30: [
    "The working member can be a gripper, tool, sucker, or syringe. Its fourth degree of freedom is tool-axis rotation, transferred in Figure 1 from a fixed motor through a telescopic arm; the model exposes that rotation as a separate normalized input.",
  ],
  31: [
    "The source mentions two further degrees for tilting the working member and says their motors may be fixed or moving. This record’s core interactive geometry remains the claimed three-positioning-axis arrangement, not an invented six-axis tool-wrist controller.",
  ],
  32: [
    "Figure 5 replaces the rotary control arms with translating guide members. It is evidence that the patent’s general positioning idea covers more than the iconic rotary Delta arrangement, while preserving the motion-to-platform linking topology.",
  ],
  33: [
    "The illustrated fixed ends of the three control arms sit in an equilateral-triangle pattern. The patent immediately says this arrangement is not exhaustive, so the model labels its triangular proportions normalized rather than historical dimensions.",
  ],
  34: [
    "The source names printed-circuit assembly, rapid assembly, handling and packing, and dimensional checking as possible uses. Later commercial accounts can document packaging adoption, but those later figures do not retroactively become performance data in this 1990 grant.",
  ],
  62: [
    "The later certificate is part of the reviewed facsimile. It explicitly corrects several apparent typographical errors in the specification, preserving an audit trail rather than inviting the edition to silently clean historic wording.",
  ],
  63: [
    "Claim 6’s certificate insertion changes the phrase to ‘the fixed portion.’ The edition leaves the original printed claim intact and records the correction separately, so readers can see both the grant page and the later official change.",
  ],
  64: [
    "The certificate completes the omitted translation-axis phrase in claim 7 and removes a stray comma in claim 15. Those changes are source-level corrections, not editorial rewrites or an excuse to replace the original printed claim blocks without evidence.",
  ],
  65: [
    "The certificate was signed and sealed on 4 August 1992 by the acting Commissioner of Patents and Trademarks. It is retained as a historical legal artifact associated with the original 11 December 1990 grant.",
  ],
};
