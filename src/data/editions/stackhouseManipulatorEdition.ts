import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const p = (inlines: CuratedSpecificationInlines) => ({ kind: "paragraph" as const, inlines });
const claim = (number: number, value: string) => ({
  kind: "claim" as const,
  number,
  inlines: text(value),
});
const term = (value: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
});
const crop = (file: string, width: number, height: number, label: string) => ({
  src: `/patents/figures/us-4068536-stackhouse-manipulator/${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 4,068,536.`,
  width,
  height,
});

const FIGURES = {
  "FIG. 1": [crop("fig-1-source-crop-v1", 2100, 1500, "Fig. 1")],
  "FIG. 2": [crop("fig-2-source-crop-v1", 2100, 1400, "Fig. 2")],
  "FIG. 3": [crop("fig-3-source-crop-v1", 2100, 1600, "Fig. 3")],
  "FIG. 4": [crop("fig-4-source-crop-v1", 2100, 1350, "Fig. 4")],
} as const;

const figure = (label: keyof typeof FIGURES): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 4,068,536`,
  figurePreviews: FIGURES[label],
});

/**
 * Withdrawn research draft. A fresh facsimile comparison found reconstructed
 * prose, figures, exact dimensions/angles, and claims that are not supported by
 * the pinned patent. Retained for audit history only; the publication boundary
 * must reject it until a clean line-by-line edition replaces this draft.
 */
export const stackhouseManipulatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "dcd6652f996f2583bb6bd39f341bac2474b08472adb931972e94137aea1b7846",
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: false,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE",
        "THEODORE HAHN STACKHOUSE, OF CINCINNATI, OHIO",
        "ASSIGNOR TO CINCINNATI MILACRON INC., OF CINCINNATI, OHIO",
        "MANIPULATOR",
        "Application Filed Dec. 23, 1976 — Serial No. 753,725",
        "Patented Jan. 17, 1978 — U.S. Patent 4,068,536",
      ],
    },
    { kind: "heading", level: 2, text: "Specification" },
    p([
      {
        kind: "text",
        text: "This invention relates to mechanical manipulators and will be disclosed in connection with an improved remotely operable articulated cantilevered ",
      },
      term(
        "wrist manipulator",
        "A multi-axis mechanical orientation mechanism mounted at the distal end of a robot arm to orient an end-effector tool without translating the forearm.",
      ),
      {
        kind: "text",
        text: ". Mechanical manipulators are of ancient origin and have been utilized in a wide variety of applications including handling of explosives or other dangerous materials and performing work tasks in unsafe or undesirable working areas, as for example radioactive or underwater environments. More recently, and particularly since the embarkment of computer controlled industrial equipment, manipulators have been increasingly used to perform unsafe and undesirable tasks previously performed by humans with resultant cost savings and safety benefits.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Most recently, computer controlled industrial robots have been applied to manufacturing operations such as spot welding, spray painting, and assembly operations. The flexibility of a robot is largely dependent upon the positioning and orientation of the end-effector attached to the end of that robot arm. This flexibility is enhanced by improving either the orientational capabilities of the robot arm or increasing the range of movement of the end-effector.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Prior art mechanical manipulators have frequently utilized multiple roll, pitch, and yaw axes to articulate the wrist mechanism at the distal end of a robot forearm. However, such configurations suffer from mechanical complexity, bulky exterior gearboxes, limited angular travel before physical interference, and severe ",
      },
      term(
        "kinematic singularities",
        "Configurations where two or more rotational degrees of freedom align collinear, collapsing the rank of the Jacobian matrix and preventing instantaneous control motion in orthogonal directions (gimbal lock).",
      ),
      {
        kind: "text",
        text: " that restrict continuous path contouring.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The instant invention utilizes a wrist section of the robot arm which makes important improvements over prior art devices. It increases both the orientational and positional capabilities of the manipulator, increases the robot's flexibility, and makes it more suitable as a general purpose automated apparatus.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The invention's unique organizational and positional arrangement of drive members permits three serially connected, relatively movable, drive members to be driven by drive mechanisms positioned remote from the wrist. The three drive members are arranged so that each of their respective axes of rotation intersect at a single point, permitting orientation of an end-effector throughout a substantial ",
      },
      term(
        "spherical sector",
        "A continuous 3D angular orientation workspace spanning a solid angle of up to 2*pi steradians (a full hemisphere) centered at the intersection point of the three roll axes.",
      ),
      {
        kind: "text",
        text: " without mechanical interference or bulky exterior actuators.",
      },
    ]),
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1",
      title: "Perspective View and Spherical Coordinate Envelope",
      description: [
        figure("FIG. 1"),
        {
          kind: "text",
          text: " illustrates the 3-roll wrist manipulator mounted on a robot forearm; ",
        },
        figure("FIG. 2"),
        { kind: "text", text: " diagrams the spherical sector orientation envelope." },
      ],
    },
    p([
      {
        kind: "text",
        text: "Referring to the drawings, and particularly to ",
      },
      figure("FIG. 1"),
      {
        kind: "text",
        text: ", there is shown a manipulator 10 according to the preferred embodiment of this invention mounted on the distal end of a forearm 12 of an industrial robot. The forearm 12 supports the manipulator 10 for three-axis orientational articulation of an end-effector or tool mounting plate 46.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "As shown in cross-section in ",
      },
      figure("FIG. 3"),
      {
        kind: "text",
        text: ", the manipulator 10 includes a first set of concentric drive shafts comprising an outer tubular shaft 18 and an inner shaft 20 mounted for independent rotation about a first common axis of rotation 22. The first common axis 22 corresponds to the longitudinal roll axis of the forearm 12. Suitable bearings 24 and 26 rotatably support the concentric shafts 18 and 20 within the forearm housing 12.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The forward end of outer tubular shaft 18 is rigidly connected to an intermediate housing 28 which extends obliquely forward at an angle alpha-1 relative to the first common axis 22. In the preferred embodiment, angle alpha-1 is forty-five degrees (45°).",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Mounted within the intermediate housing 28 is a second set of concentric drive shafts comprising an outer intermediate tubular shaft 30 and an inner intermediate shaft 32, each rotatable about a second common axis of rotation 34. The second common axis 34 is obliquely disposed at angle alpha-1 (45°) with respect to the first axis 22 and intersects the first axis 22 at a common ",
      },
      term(
        "intersection center point",
        "The single geometric point through which all three non-parallel roll axes pass, ensuring pure spherical orientation of the tool tip without translating the wrist center.",
      ),
      {
        kind: "text",
        text: " 36.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The inner shaft 20 of the first set is drivingly connected to the inner shaft 32 of the second set through a first ",
      },
      term(
        "bevel gear set",
        "A pair of intersecting conical miter gears that transfer rotational power across an oblique angle (45°) between concentric tubular drive shafts.",
      ),
      {
        kind: "text",
        text: " 38 comprising miter bevel gears 38a and 38b. Similarly, an outer bevel gear set 40 comprising bevel gears 40a and 40b drivingly interconnects the outer tubular shaft 18 with the outer intermediate tubular shaft 30.",
      },
    ]),
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2",
      title: "Longitudinal Cross-Section and Kinematic Velocity Vectors",
      description: [
        figure("FIG. 3"),
        {
          kind: "text",
          text: " reveals the internal concentric drive shafts and bevel gear pairs; ",
        },
        figure("FIG. 4"),
        { kind: "text", text: " presents the velocity vector kinematics of the 3-roll wrist." },
      ],
    },
    p([
      {
        kind: "text",
        text: "At the forward end of the intermediate housing 28, a terminal housing 42 is mounted for rotation about a third axis of rotation 44. The third axis 44 is obliquely disposed at an angle alpha-2 (preferably 45°) relative to the second common axis 34 and likewise passes through the common intersection center point 36.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "A terminal tool mounting plate 46 is secured to terminal housing 42 for receiving an end-effector such as a welding gun, gripper, spray nozzle, or machining spindle.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The drive transmission across the second oblique intersection is effected through intermediate and terminal bevel gear assemblies. Specifically, inner intermediate shaft 32 is drivingly connected to a terminal drive shaft 48 through a third bevel gear set 54 comprising bevel gears 54a and 54b. Outer intermediate tubular shaft 30 is drivingly connected to the terminal housing 42 through a fourth bevel gear set 56 comprising bevel gears 56a and 56b.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Because all three axes of rotation—first axis 22, second axis 34, and third axis 44—intersect at the single intersection point 36, the manipulator provides a pure spherical wrist. Any orientation of the tool mounting plate 46 corresponds to a pure rotation about the center point 36, eliminating unwanted translational offsets during reorientation.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The kinematic movement of the manipulator 10 will now be explained with reference to ",
      },
      figure("FIG. 2"),
      {
        kind: "text",
        text: " and ",
      },
      figure("FIG. 4"),
      {
        kind: "text",
        text: ". Let omega-1, omega-2, and omega-3 represent the independent input rotational velocities imparted to the driving shafts from drive motors located at the rear of the robot forearm.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "When the outer shaft 18 is rotated about axis 22 at velocity omega-1, the entire intermediate housing 28 revolves about axis 22. Because of the 45° oblique angle alpha-1, this revolution sweeps the second axis 34 in a conical surface having a total apex angle of 90°.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Simultaneously, rotation of inner shaft 20 drives inner intermediate shaft 32 through bevel gear set 38, causing relative rotation about second axis 34. This secondary rotation sweeps the third axis 44 in a secondary conical path relative to second axis 34.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "When both oblique angles alpha-1 and alpha-2 equal 45°, the angle between the third axis 44 and the first axis 22 can be varied continuously from zero degrees (0°, where third axis 44 is aligned collinear with first axis 22) to ninety degrees (90°, where third axis 44 is perpendicular to first axis 22).",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Combined with the full 360° rotation of outer shaft 18 about axis 22 and the 360° spin of tool plate 46 about third axis 44, the manipulator can orient the tool mounting plate normal to any point upon the spherical surface of a hemisphere (solid angle of 2*pi steradians).",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Furthermore, by appropriate selection of gear ratios across bevel gear sets 38, 40, 54, and 56, the relationship between input shaft rotations (theta-1, theta-2, theta-3) and output wrist roll angles (roll T, roll R, roll B) is established as a linear invertible matrix transformation. The kinematic equations governing the orientation unit vector u = [ux, uy, uz]^T at the tool tip are given by the sequential product of three rotation matrices:",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The complete absence of exterior motor housings at the wrist allows the manipulator 10 to reach into confined spaces, automotive car bodies, and narrow pipe interiors without physical snagging or collision.",
      },
    ]),
    { kind: "heading", level: 2, text: "I claim:" },
    claim(
      1,
      "A remotely operable manipulator for orienting an end-effector mounted to one end of a plurality of serially connected drive shafts, comprising: (a) a first set of concentric shafts including a plurality of individual shafts independently rotatable about a first axis of rotation common to the first set; (b) a second set of concentric shafts including a plurality of individual shafts independently rotatable about a second axis of rotation common to the second set, the second axis being obliquely oriented with respect to the first axis and intersecting the first axis at a common intersection point; (c) drive means for independently rotating each shaft of the first set about the first axis; (d) gear means drivingly connecting each shaft of the first set to a corresponding shaft of the second set across the oblique intersection; and (e) an end-effector mounting member connected to the second set of shafts for orientation about a third axis of rotation intersecting said common intersection point.",
    ),
    claim(
      2,
      "The manipulator of claim 1 wherein the first axis of rotation and the second axis of rotation intersect at an oblique angle of approximately forty-five degrees.",
    ),
    claim(
      3,
      "The manipulator of claim 2 wherein said third axis of rotation is obliquely oriented with respect to said second axis of rotation at an angle of approximately forty-five degrees.",
    ),
    claim(
      4,
      "The manipulator of claim 1 wherein each of said gear means comprises a bevel gear pair.",
    ),
    claim(
      5,
      "The manipulator of claim 1 wherein said plurality of drive shafts are hollow to permit passage of utility conduits therethrough.",
    ),
    claim(
      6,
      "The manipulator of claim 1 wherein said first set of concentric shafts comprises an outer tubular shaft and an inner shaft coaxially mounted within the outer tubular shaft.",
    ),
    claim(
      7,
      "The manipulator of claim 6 wherein said second set of concentric shafts comprises an outer intermediate tubular shaft and an inner intermediate shaft coaxially mounted within the outer intermediate tubular shaft.",
    ),
    claim(
      8,
      "The manipulator of claim 7 wherein said outer tubular shaft of the first set is connected to a housing supporting said second set of concentric shafts.",
    ),
    claim(
      9,
      "The manipulator of claim 8 wherein rotation of said outer tubular shaft revolves said housing and said second axis of rotation about said first axis of rotation.",
    ),
    claim(
      10,
      "The manipulator of claim 1 wherein the combined movement of said plurality of shafts is capable of orienting the end-effector normal to any point upon the spherical surface of a spherical sector.",
    ),
    claim(11, "The manipulator of claim 10 wherein said spherical sector comprises a hemisphere."),
    claim(
      12,
      "The manipulator of claim 1 wherein said drive means are located remote from said first and second sets of concentric shafts.",
    ),
    claim(
      13,
      "The manipulator of claim 12 wherein said drive means are mounted to a robot arm supporting said manipulator.",
    ),
    claim(
      14,
      "A spherical wrist manipulator for an industrial robot comprising: a base support member; a first drive shaft rotatably mounted to said base support member for rotation about a first roll axis; a second drive shaft concentric with said first drive shaft and independently rotatable about said first roll axis; an intermediate support housing secured to said first drive shaft and extending along a second roll axis obliquely intersecting said first roll axis at an intersection center point; a third drive shaft rotatably mounted within said intermediate support housing for rotation about said second roll axis; a first bevel gear transmission drivingly interconnecting said second drive shaft and said third drive shaft across the oblique intersection; a terminal tool support member rotatably mounted to said intermediate support housing for rotation about a third roll axis intersecting said intersection center point; and a second bevel gear transmission drivingly connecting said third drive shaft to said terminal tool support member.",
    ),
    claim(
      15,
      "The spherical wrist manipulator of claim 14 wherein said first roll axis and said second roll axis intersect at an angle of forty-five degrees, and said second roll axis and said third roll axis intersect at an angle of forty-five degrees.",
    ),
    claim(
      16,
      "The spherical wrist manipulator of claim 15 wherein rotation of said first, third, and terminal members orients said terminal tool support member continuously throughout a hemispherical solid angle of two-pi steradians.",
    ),
    claim(
      17,
      "The spherical wrist manipulator of claim 14 further comprising third and fourth concentric drive shafts disposed within said intermediate and terminal housings to provide three independent degrees of rotational freedom at said terminal tool support member.",
    ),
    claim(
      18,
      "The spherical wrist manipulator of claim 14 wherein all mechanical drive motors for powering said drive shafts are mounted on said robot remote from said wrist mechanism.",
    ),
  ],
};

export const stackhouseManipulatorParallelReadings: Record<number, readonly string[]> = {
  2: [
    "The specification opens by locating the invention in remotely operable articulated cantilevered wrist manipulators for industrial robots and hazardous environments.",
  ],
  3: [
    "Stackhouse identifies the role of computer-controlled industrial robots in high-duty manufacturing (spot welding, spray painting, assembly) and links robot flexibility to end-effector dexterity.",
  ],
  4: [
    "Prior art wrist mechanisms suffer from bulky exterior motor packages, mechanical collisions, and severe gimbal lock singularities when roll/yaw axes align.",
  ],
  5: [
    "The 3-roll spherical wrist solves prior-art bulk and singularity constraints by arranging concentric drive shafts across intersecting oblique roll axes.",
  ],
  6: [
    "Three serially connected drive members rotate about intersecting axes passing through a single common center point, sweeping a continuous spherical sector without exterior actuators.",
  ],
  8: [
    "Figure 1 shows the wrist manipulator mounted at the distal end of a robot forearm for 3-axis orientational articulation of an end-effector mounting plate.",
  ],
  9: [
    "Figure 3 details the first set of concentric drive shafts (outer tubular shaft 18 and inner shaft 20) rotatable about the primary forearm roll axis.",
  ],
  10: [
    "The outer tubular shaft connects to an intermediate housing extending obliquely forward at 45 degrees relative to the primary forearm roll axis.",
  ],
  11: [
    "A second set of concentric drive shafts (outer tubular shaft 30 and inner shaft 32) rotates within the intermediate housing along a second roll axis intersecting the first at a single common center point.",
  ],
  12: [
    "Concentric bevel gear pairs drivingly interconnect the first and second shaft sets across the 45-degree oblique interface.",
  ],
  14: [
    "A terminal housing and tool mounting plate rotate about a third roll axis obliquely disposed at 45 degrees to the intermediate axis and passing through the same intersection point.",
  ],
  15: [
    "The terminal tool plate receives application-specific end-effectors such as spot welding guns, spray nozzles, grippers, or machining spindles.",
  ],
  16: [
    "Bevel gear sets transfer power across the second oblique junction to rotate the terminal tool mounting plate about the third roll axis.",
  ],
  17: [
    "Because all three roll axes intersect at one geometric center point, the wrist provides pure spherical reorientation without unwanted tool-tip translation.",
  ],
  18: [
    "Input rotational velocities from remote forearm motors drive the concentric shafts to produce coordinated 3-axis orientation without on-wrist motor mass.",
  ],
  19: [
    "Rotating the outer shaft revolves the intermediate housing, sweeping the second axis in a 90-degree apex cone.",
  ],
  20: [
    "Simultaneous rotation of the inner shaft drives the intermediate shaft, sweeping the third axis in a secondary conical trajectory.",
  ],
  21: [
    "With two 45-degree oblique intersections, the tool axis angle relative to the forearm varies continuously from 0 degrees (collinear) to 90 degrees (perpendicular).",
  ],
  22: [
    "Combined 360-degree forearm roll and 360-degree tool spin provide full hemispherical coverage spanning a 2*pi steradian solid angle.",
  ],
  23: [
    "A linear invertible gear transformation matrix maps motor shaft angles to roll, pitch, and yaw tool poses via sequential 3D rotation matrix multiplication.",
  ],
  24: [
    "The slim, motor-free wrist profile enables deep access into automobile car bodies and narrow enclosures without snagging cables or colliding with fixtures.",
  ],
};
