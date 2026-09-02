import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_NUMBER = "4,512,709";
const FIGURE_ROOT = "/patents/figures/us-4512709-milacron-robot-toolchanger";

const figureDimensions: Record<number, readonly [number, number]> = {
  1: [1400, 1950],
  2: [1400, 963],
  3: [1400, 875],
  4: [1400, 875],
  5: [1400, 1867],
  6: [1235, 1900],
  7: [1400, 1786],
  8: [997, 1150],
  9: [1400, 1131],
  10: [1400, 840],
};

const p = (
  ...inlines: readonly (string | CuratedSpecificationInline)[]
): { kind: "paragraph"; inlines: CuratedSpecificationInlines } => ({
  kind: "paragraph",
  inlines: inlines.map((inline) =>
    typeof inline === "string" ? { kind: "text", text: inline } : inline,
  ),
});

const claim = (
  number: number,
  ...inlines: readonly (string | CuratedSpecificationInline)[]
): { kind: "claim"; number: number; inlines: CuratedSpecificationInlines } => ({
  kind: "claim",
  number,
  inlines: inlines.map((inline) =>
    typeof inline === "string" ? { kind: "text", text: inline } : inline,
  ),
});

const figure = (number: number, text = `FIG. ${number}`): CuratedSpecificationInline => {
  const [width, height] = figureDimensions[number] ?? [1200, 800];
  return {
    kind: "reference",
    text,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Source crop of ${text} from US ${PATENT_NUMBER}`,
    figurePreviews: [
      {
        src: `${FIGURE_ROOT}/fig-${number}-source-crop-v1.png`,
        alt: `${text}, source drawing crop from US ${PATENT_NUMBER}`,
        width,
        height,
      },
    ],
  };
};

const term = (text: string, label: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  label,
  definition,
});

/** Paragraph-indexed, source-specific engineering readings; never OCR cleanup. */
export const milacronRobotToolchangerParallelReadings: Readonly<
  Record<number, readonly string[]>
> = {
  2: [
    "The abstract gives the complete visitor-level idea: a robot-side adapter receives a common tool base and a T-shaped member, then a reversing slide locks or unlocks it. The claims specify the exact required elements.",
  ],
  10: [
    "The field is a robot-side interface for changing the tool at the wrist, rather than a general-purpose robot arm. The source distinguishes the arm, wrist, end effector, and attached working tool so their roles do not blur.",
  ],
  11: [
    "The stated bottleneck is changeover: a programmable robot still carries one special tool until a person replaces it. The invention tries to make the tool interface itself part of the robot's working sequence.",
  ],
  12: [
    "The applicants frame automatic exchange as a way to use several tool types during one workpiece cycle. That is an objective of this disclosed arrangement, not a guarantee of a particular production rate or economic result.",
  ],
  13: [
    "Bistable here means the retention mechanism is intended to remain in either of its two terminal conditions after loss of actuator power. The source supplies topology, not a force, friction, shock, or certification calculation for that behavior.",
  ],
  15: [
    "The summary names the reusable interface: an adapter fixed to the end effector, a common base attached to each tool, and a retention member that couples them. The claims, rather than this summary, define the legal combinations.",
  ],
  16: [
    "The first object is storage-side interchange: the common base lets several tools wait in a rack while one adapter remains fixed to the robot. It is an objective statement rather than a throughput or availability guarantee.",
  ],
  17: [
    "The second object is the stated tendency to retain a tool after loss of power. The text does not supply the quantitative conditions needed to turn that aspiration into a specified holding-force or impact-survival result.",
  ],
  19: [
    "The drawing list is archival navigation. It establishes that the open and closed locking states, electrical alternate, locating pins, and toolbase are actual source figures rather than modern reconstructions.",
  ],
  21: [
    "Figure 1 separates the robot's motion system from the change interface. A wrist-mounted adapter meets any of several tool bases on a rack, so the exhibit models the claimed interface rather than pretending to reproduce a particular arm's kinematics.",
  ],
  22: [
    "The adapter receives actuator fluid through the robot and can pass a separate utility connection to a selected tool. Because no pressure, bore, flow, or duty-cycle figure is printed, the visual shows only whether the source-described interface is present.",
  ],
  23: [
    "Two plates and two spacer blocks form the adapter housing. The essential sequence is geometric: open aperture admits the T-member, then a transverse slide shifts so the aperture no longer aligns and its ramps bear on the crossbar.",
  ],
  24: [
    "The source calls the pin-and-bushing reception accurate registration before clamping. A cylindrical pin and a diamond-profile pin are a locating pair; the museum model shows the registration prerequisite but refuses an unprinted positional tolerance.",
  ],
  25: [
    "The actuator's rod, yoke, and slide are mechanically coupled, while an optional front fitting passes a utility to a seated tool. Neither the claim nor the description gives actuator stroke or output force, so the slider is normalized state rather than measured travel.",
  ],
  26: [
    "The alternate embodiment changes the optional utility connection from a fluid fitting to an electrical connector. It does not alter the core mechanical capture path, which is why the simulation treats utilities as a source-described option rather than an energy model.",
  ],
  27: [
    "The side view explains the guidance: a rectangular slide fits slots in the front plate and moves together with the actuator yoke. A proximity switch detects a base's presence, but the grant does not specify a sensing range, signal protocol, or controller.",
  ],
  28: [
    "At the locked position, the aperture has moved out of line with the opening and the two ramp surfaces engage. That physical interference is the pedagogical heart of the exhibit: a base cannot withdraw while the crossbar is captured by the shifted slide.",
  ],
  29: [
    "The two locating pins intentionally have different cross sections, while their mating bushings sit in the tool base. This supplies a repeatable geometric datum before the retention feature takes load; no numerical repeatability should be inferred from the description.",
  ],
  30: [
    "The base can expose either a fluid port, electrical connector, or neither, according to the attached tool. The document consequently describes an interface family, but it does not supply a universal electrical or pneumatic specification.",
  ],
  31: [
    "The closing paragraph preserves the ordinary patent boundary: the illustrated embodiment is preferred, while the claims select what is legally required. It is not license to add unprinted dimensions, loads, reliability claims, or robot performance figures.",
  ],
};

export const milacronRobotToolchangerArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "9ac43ea5baee978c390bd096fe4beaa2c229a5cde227d9f3e005d035026425b0",
  preparedBy: "Classic Patents editorial agent (GentleCedar)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "Hennekes et al.",
        "[11] Patent Number: 4,512,709",
        "[45] Date of Patent: Apr. 23, 1985",
        "[54] ROBOT TOOLCHANGER SYSTEM",
        "[75] Inventors: Daniel M. Hennekes, Morrow, Ohio; Richard A. Kolde, Ft. Thomas, Ky.; David E. Suica, Lebanon, Ohio",
        "[73] Assignee: Cincinnati Milacron Inc., Cincinnati, Ohio",
        "[21] Appl. No.: 516,972 · [22] Filed: Jul. 25, 1983",
      ],
    },
    { kind: "heading", level: 2, text: "ABSTRACT" },
    p(
      "A robot toolchanger system is disclosed, where an adapter unit is mounted to the end effector of a robot. The housing of the adapter unit has central opening for receiving a T-shaped member which is affixed to a common toolbase, applied to a variety of tools. The crossbar of the T-shaped member is engaged by a slide movable in the housing in reversing directions to lock and unlock the tool with respect to the robot end effector.",
    ),
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 1",
      title: "Robot, adapter, tool bases, and rack",
      description: [figure(1), { kind: "text", text: ", perspective source drawing on sheet 1 of 6." }],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 2–4",
      title: "Open lock, closed lock, and electrical alternate",
      description: [
        figure(2),
        { kind: "text", text: ", " },
        figure(3),
        { kind: "text", text: ", and " },
        figure(4),
        { kind: "text", text: ", source drawings on sheet 2 of 6." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 5–6",
      title: "Adapter side elevation and locking plan section",
      description: [
        figure(5),
        { kind: "text", text: " and " },
        figure(6),
        { kind: "text", text: ", source drawings on sheets 3 and 4 of 6." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 7–8",
      title: "Retention member and locating pin",
      description: [
        figure(7),
        { kind: "text", text: " and " },
        figure(8),
        { kind: "text", text: ", source drawings on sheet 5 of 6." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 9–10",
      title: "Common tool base",
      description: [
        figure(9),
        { kind: "text", text: " and " },
        figure(10),
        { kind: "text", text: ", source drawings on sheet 6 of 6." },
      ],
    },
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p(
      "The invention relates generally to toolchanger systems, wherein a machine mechanism may utilize an interchangeable plurality of tools. More specifically, the invention relates to robot systems, such as industrial robot arms, which have a plurality of elements movable with respect to a robot base. In such robot arms, the last element in the system, i.e., the wrist, generally has a movable end effector to which is attached a gripper or some other tool.",
    ),
    p(
      "While robots have the inherent flexibility of being reprogrammed for different jobs, they generally carry one special tool concerning the immediate task to be performed. At time of reprogramming or changeover of jobs, the robot tooling may be replaced by a maintenance operator as a new task is to be undertaken.",
    ),
    p(
      "With the idea of improving productivity of a robot machine, applicants have determined that it is a desirable feature to be able to interchange multiple tool types with a given robot end effector, during the working cycle on a given workpiece, and it is to this task that they have directed their efforts. Applicants have also determined that it is a desirable feature, in a replaceable tool system, to have the capability to enable the robot to automatically interchange a plurality of tools, without the need for human intervention.",
    ),
    p(
      "Applicants have considered various power means for clamping a tool, and have determined that the tool retention system should tend to be ",
      term(
        "bistable",
        "Two terminal states",
        "The specification uses this word for a retention arrangement intended to remain in either its locked or unlocked terminal position after a power failure; it does not state a load, friction coefficient, shock condition, or certification test.",
      ),
      ", i.e., the mechanism should remain in either the locked or unlocked position, in the event of a power failure.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "The invention is shown embodied in a robot having a movable end effector, wherein a toolchanger comprises, in part, an adapter unit affixed to the end effector. The adapter unit has a housing with means for locating and securing the housing on the end effector, and a means for locating and releasably retaining a tool base on the housing is embodied therein. A common tool base is affixed to a plurality of tools to be releasably retained with the adapter unit, and a retention member affixed to the tool base cooperates with the adapter unit for holding the tool base and tool in position with the adapter unit.",
    ),
    p("It is an object of the invention to provide a robot toolchanger which will releasably retain a plurality of tools which may be interchanged with a tool storage module."),
    p("It is another object of the invention to provide a robot toolchanger which will tend to retain the tool in the event of a power failure."),
    { kind: "heading", level: 2, text: "BRIEF DESCRIPTION OF THE DRAWINGS" },
    p(
      figure(1),
      " is a perspective view of robot having a toolchanger, and a rack with a stored plurality of tools. ",
      figure(2),
      " is a perspective view in partial section of a toolchanger adapter unit, illustrating the locking slide in the open position, and the tool retention member separated from the adapter unit. ",
      figure(3),
      " is a perspective view of the adapter unit of FIG. 2, illustrating the locking slide in the closed position, and the tool retention member secured by the locking slide. ",
      figure(4),
      " is an alternate embodiment of the adapter unit of FIG. 2, illustrating that a separable electrical connection unit may be affixed to both the adapter unit and the releasable tool. ",
      figure(5),
      " is a side elevation view of the adapter unit of FIG. 2. ",
      figure(6),
      " is a plan section of the toolchanger unit taken along the line 6—6 of FIG. 5. ",
      figure(7),
      " is a front elevation view taken in the direction of arrow 7 of FIG. 6, depicting the tool retention member in partial section. ",
      figure(8),
      " is a section through the adapter locating pin taken along the line 8—8 of FIG. 7. ",
      figure(9),
      " is a front elevation view of the tool base with the tool removed for clarity. ",
      figure(10),
      " is a plan view of the tool base of FIG. 9.",
    ),
    { kind: "heading", level: 2, text: "DESCRIPTION OF THE PREFERRED EMBODIMENT" },
    p(
      figure(1),
      " of the drawings depicts an industrial robot 10, having a base 11; movable upper arm 12; movable forearm 13; and, articulatable wrist 14. The robot 10 could be any of a variety of robots produced, including coordinate movement robots and jointed arm robots, such as the one shown, which is described in U.S. Pat. No. 269,681 of Morser et al entitled “Robot Arm”. The wrist 14 could also be a variety of mechanisms, but the wrist 14 shown is that of U.S. Pat. No. 4,068,536, of Stackhouse, entitled “Manipulator”. The end effector 15 of the wrist unit 14 is capable of three-axis movement, so that a spherical path may be covered by the effector 15. The end effector 15 carries a robot toolchanger 16 comprised generally of an adapter unit 17 which is affixed to the end effector 15, and a separable, or releasably retained, tool base 18 which is affixed integrally to a desired tool 19. A family of tools 19 are shown situated on a representative tool rack 20, and each distinct tool 19 has a common tool base 18 to enable the tool 19 to be located and retained on the toolchanger adapter unit 17.",
    ),
    p(
      "Fluid pressure lines 21,22 are brought from a fluid source to a junction block (not shown) on the side of the robot forearm. Flexible fluid lines 23,24 are brought from the junction block to the adapter unit 17 for powering a linear actuator to clamp and unclamp the tool bases 18. An additional fluid line 25 is brought to the front plate 26 of the adapter unit to provide a pressure line for those tools which are to be fluid powered.",
    ),
    p(
      figure(2),
      " illustrates a perspective view of the adapter unit 17, which is comprised of a pair of spaced-apart circular plates 26,27 rigidly tied to one another through spaced-apart rectangular blocks 28,29 forming walls for the unit 17. A fluid powered linear actuator 60 (see ",
      figure(3),
      ") is located on the rear base plate 27 of the unit. The front plate 26 of the adapter unit 17 is provided with a central opening 30, and parallel slots 31,32 are provided across the plate 26 to guide a locking slide 33 which is moved radially in the plate 26 by the actuator 60. The locking slide 33 has a squared central aperture 34 in line with the plate opening 30 in the position shown, for receiving a ",
      term(
        "T-shaped retention member",
        "Captive T-member",
        "A member fixed to the common tool base whose narrow stem passes through a slot while its wider crossbar presents ramp faces to the shifted locking slide; this term denotes a particular source-drawn capture geometry, not every tool coupling.",
      ),
      " 35 secured to the tool base 18. The T-member 35 has its bottom surface 36, i.e., the bottom of the T stem 37, secured to the tool base 18 by screws (see ",
      figure(6),
      ") longitudinally received through the stem 37. The cross bar 38 of the T-member 35 extends toward the adapter unit 17 and the cross bar 38 is beveled at its underside to provide ramp surfaces 39 which cooperate with the locking slide 33. The locking slide 33 has a central slot 40 to accommodate the stem 37 of the T-member 35, and cooperating ramp surfaces 41 are provided on the central portion of the locking slide 33 to engage the ramp surfaces 39 of the cross bar 38 in a forked, clevis manner with a wedging action. In the event of power failure on the linear actuator 60, the tool 19 will tend to remain in the locked or clamped position, due to the essentially irreversible nature of the locking slide 33/T-member 35 engagement. The tool base 18 is provided with a pair of hardened steel bushings 42, which are accurately positioned in the tool base 18, and the bushings 42 are received on a pair of ",
      term(
        "locating pins",
        "Kinematic registration pins",
        "The two source-drawn pins mate with bushings in the common base before the locking slide moves. One is cylindrical and one has a diamond-shaped cross-section, a pairing that constrains location without claiming a numerical tolerance.",
      ),
      " 43,44 secured to and extending from, the front plate 26 of the adapter unit 17. The reception of the bushings 42 on the pins 43,44 assures accurate registration of the tool 19 before the locking slide 35 is moved into the clamping position.",
    ),
    p(
      figure(3),
      " illustrates that the locking slide 33 is provided with yoke block 45, extending transversely from its rear surface toward the rear plate 27, and the yoke block 45 is affixed to the piston rod 46 of the linear actuator 60 (see ",
      figure(5),
      " and ",
      figure(6),
      "). The cylinder 47 of the actuator 60 is affixed to the rear plate 27 of the adapter unit 17. Once the tool base 18 is registered on the front plate 26 of the adapter unit 17, and the cross bar 38 of the T-member 35 is received through the central aperture 34 of the locking slide 33, the slide 33 is moved in a radial direction relative to the front plate 26, and the tool 19 is retained in position on the adapter unit 17. A pair of pipes 48 extend from the cylinder 47 of the linear actuator 60, to connect the fluid lines 23,24. A fluid fitting 49 is received in the front plate 26, and interdrilling connects the fitting 49 to a front hole 50 which is aligned with a mating fluid port (not shown) in the tool base 18 to provide fluid power for a tool, when desired.",
    ),
    p(
      figure(4),
      " depicts the elements of FIG. 2, with the exception that the fluid fitting 49 is replaced by an electrical connector 51 on the front plate 26 of the adapter unit 17, and a mating electrical connector 52 is provided on the tool base 18 for conducting electrical signals, if desired, to the tool 19 when the tool base 18 is clamped in position on the adapter unit 17.",
    ),
    p(
      figure(5),
      " depicts the adapter unit 17 and tool base 18 in assembly. The rear plate 27 of the adapter unit 17 is located by a pilot diameter 53 and secured by screws 54 to the end effector 15. The front and rear plates 26,27 of the unit are tied together by screws 55 extending through the parallel spaced-apart blocks 28,29, to form a rigid structure. The linear actuator 60 is centrally located between the blocks 28,29, and is mounted to a pad 55 on the rear plate 27. The locking slide 33 is generally rectangular in cross-section, having accurate edges, machined to a close fit in guide slots 31,32 provided in the front plate 26. The yoke block 45 is secured to the locking slide 33 by a pair of screws 56 so that movement of the linear actuator 60 will cause the yoke block 45 and slide 33 to move in unison, in a radial direction, relative to the circular front plate 26. The tool base 18 is shown clamped to the front plate 26 of the adapter unit 17, and the tool base 18 carries any one of a variety of tools 19. A proximity switch 58 is threadably received through the back face 59 of the front plate 26 and secured by a locknut 61. The tip 62 of the proximity switch 58 is recessed into the front plate 26 a slight amount, and is capable of sensing the presence or absence of a tool base 18.",
    ),
    p(
      "The plan section of ",
      figure(6),
      " illustrates the adapter unit 17 having its locking slide 33 moved to the locked position. At such position, the T-member 35 is securely held within the central opening 30 of the front plate 26 by a wedging action on the cross bar 38. The tool base 18 is received on the front plate 26 of the adapter unit 17. The T-member 35 extends through the central opening 30 of the plate 26 and the aperture 34 of the locking slide 33 is shifted out of alignment with the opening 30. In the position shown, the ramp surfaces 41 of the locking slide 33 are engaged with the ramp surfaces 39 of the T-member 35, so that the tool base 18 may not be withdrawn and separated from the adapter unit 17.",
    ),
    p(
      "Referring to ",
      figure(7),
      ", the slide 33 must be shifted to the phantom position shown in order to align the slide aperture 34 with the T-member 35 for tool separation to occur. The pair of locating pins 43,44 are provided on the front plate 26, one pin 43 being cylindrical, and the other pin 44 being diamond-shaped in cross section. The section of ",
      figure(8),
      " is typical for both pins 43,44, as both receive a hardened steel bushing 42 of the tool base 18.",
    ),
    p(
      figure(9),
      " and ",
      figure(10),
      " depict the tool base 18 with the tool 19 removed, for clarity of viewing. The tool base 18 is a cylindrical plate, having the T-member 35 secured to it by locking screws 76, and a fluid port 89 is drilled through, in line with the O-ring 80 and front hole 50 of the adapter unit front plate 26. The tool base 18 has a pair of hardened, shouldered, bushings 42 received in mating bores 90 and counterbores 91 so the base 18 can be located on the locating pins 43,44 of the adapter unit 17. Tapped holes 92 are provided on the tool base 18 in a predetermined pattern so that a selected tool 19 may be affixed thereto.",
    ),
    p(
      "As previously stated, the fluid ports 50 of the adapter unit 17 and tool base 18 are provided only for those tools 19 which need pressurized fluid for a motive source. FIG. 4 illustrates as an example electrical connectors 51,52 which might be employed when an electrical motive power source is needed. It may be appreciated that certain tools may need no power supplied to them and, in such case, the electrical and fluid connectors shown would be omitted.",
    ),
    p(
      "While the invention has been shown in connection with a preferred embodiment, the invention is not limited to such embodiment, but rather extends to all such designs and modifications as come within the scope of the appended claims.",
    ),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    claim(
      1,
      "1. A robot toolchanger, comprising: (a) a housing, having spaced-apart front and rear plates rigidly connected to one another; (b) a central opening through said front plate; (c) a linear actuator mounted to said rear plate between said plates, and having a rod movable between extended and retracted end positions; (d) a linear slideway on said front plate, transverse to said central opening; (e) a locking slide carried in said slideway and affixed to said rod, said slide having an aperture alignable with said central opening, and further having means for engaging a tool retention member; (f) a toolbase having a tool retention member affixed thereto, said member insertable into said housing through said central opening and said slide aperture; (g) means for positioning said toolbase on said housing; and (h) means for positioning and securing said housing on a movable robot member.",
    ),
    claim(
      2,
      "2. The toolchanger of claim 1, wherein said tool retention member has a head portion and adjacent stem portion, said stem portion being smaller in cross-section than said head portion and located against said toolbase, and further wherein said slide means for engaging said tool retention member comprises a slide surface adjacent to said aperture for bearing against said head portion.",
    ),
    claim(
      3,
      "3. A robot toolchanger system, comprising in combination: (a) a movable robot member having a movable end effector; (b) a housing mounted to said end effector, said housing having spaced-apart front and rear plates rigidly connected to one another; (c) a central opening through said front plate; (d) a linear actuator mounted to said rear plate, between said plates, and having a rod movable transverse to said central opening between extended and retracted positions; (e) a linear slideway extending through said front plate, transverse to said central opening; (f) a linear slide carried in said slideway and affixed to said actuator rod and movable in accordance with said actuator movement between locking and unlocking positions, said slide further having an aperture alignable with said central opening and a ramp surface adjacent said aperture for engaging a tool retention member; (g) a toolbase having a tool retention member affixed thereto said member insertable into said housing through said central opening and said slide aperture; (h) means for positioning said toolbase on said housing; and (i) means for positioning and securing said housing on said movable end effector.",
    ),
    claim(
      4,
      "4. The toolchanger system of claim 3, wherein said tool retention member comprises a T-shaped member having its stem affixed to said toolbase, and having its crossbar formed with a ramp surface cooperating with said slide ramp surface, and further wherein said slide ramp surface is bifurcated to form a clearance slot for said stem.",
    ),
  ],
};

/** Keeps the patent record's legal text bound to the single manual edition. */
export function milacronRobotToolchangerClaimText(number: number): string {
  const block = milacronRobotToolchangerArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Milacron Robot Toolchanger manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
