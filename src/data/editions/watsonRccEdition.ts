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
  src: `/patents/figures/us-4098001-watson-rcc/${file}.png`,
  alt: `Source-facsimile crop of ${label} from US 4,098,001.`,
  width,
  height,
});

const FIGURES = {
  "FIG. 1": [crop("fig-1-source-crop-v1", 1300, 1280, "Fig. 1")],
  "FIG. 2": [crop("fig-2-source-crop-v1", 1350, 1050, "Fig. 2")],
  "FIG. 3": [crop("fig-3-source-crop-v1", 1350, 1250, "Fig. 3")],
  "FIG. 4": [crop("fig-4-source-crop-v1", 1200, 1050, "Fig. 4")],
  "FIG. 4a": [crop("fig-4a-source-crop-v1", 1200, 980, "Fig. 4a")],
  "FIG. 5": [crop("fig-5-source-crop-v1", 1200, 1050, "Fig. 5")],
  "FIG. 5a": [crop("fig-5a-source-crop-v1", 1350, 1050, "Fig. 5a")],
  "FIG. 6": [crop("fig-6-source-crop-v1", 1350, 1580, "Fig. 6")],
  "FIG. 7": [crop("fig-7-source-crop-v1", 1350, 1050, "Fig. 7")],
  "FIG. 8": [crop("fig-8-source-crop-v1", 1350, 1600, "Fig. 8")],
  "FIG. 9": [crop("fig-9-source-crop-v1", 1350, 1450, "Fig. 9")],
  "FIG. 10": [crop("fig-10-source-crop-v1", 1400, 1700, "Fig. 10")],
  "FIG. 11": [crop("fig-11-source-crop-v1", 1400, 1650, "Fig. 11")],
  "FIG. 11a": [crop("fig-11a-source-crop-v1", 1400, 1250, "Fig. 11a")],
  "FIG. 12": [crop("fig-12-source-crop-v1", 1400, 1750, "Fig. 12")],
} as const;

const figure = (label: keyof typeof FIGURES): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Open the source-facsimile crop for ${label} in US 4,098,001`,
  figurePreviews: FIGURES[label],
});

/**
 * A continuous, manual reading of the complete eight-page US 4,098,001
 * facsimile. Pages 2–4 are drawing sheets; pages 5–8 print the specification
 * and both claims. Page locators remain only in the reviewed ledger.
 */
export const watsonRccArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "67ca409f96f1456b603f198653a1a5d9c411c25dab5737ac2824b7fdaff2093b",
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT",
        "PAUL C. WATSON, OF ARLINGTON, MASSACHUSETTS, ASSIGNOR TO THE CHARLES STARK DRAPER LABORATORY, INC., OF CAMBRIDGE, MASSACHUSETTS.",
        "REMOTE CENTER COMPLIANCE SYSTEM.",
        "Patent No. 4,098,001. Filed October 13, 1976. Patented July 4, 1978. Application No. 732,286.",
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 1 OF 3",
      title: "Remote-center geometry and basic compliant states",
      description: [
        figure("FIG. 1"),
        { kind: "text", text: ", " },
        figure("FIG. 2"),
        { kind: "text", text: ", " },
        figure("FIG. 3"),
        { kind: "text", text: ", " },
        figure("FIG. 4"),
        { kind: "text", text: ", " },
        figure("FIG. 4a"),
        { kind: "text", text: ", and " },
        figure("FIG. 5"),
        {
          kind: "text",
          text: " show the original sectional system, its radial geometry, and the translational and rotational contact states.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 2 OF 3",
      title: "Alternative structures and anti-twist arrangement",
      description: [
        figure("FIG. 5a"),
        { kind: "text", text: ", " },
        figure("FIG. 6"),
        { kind: "text", text: ", " },
        figure("FIG. 7"),
        { kind: "text", text: ", " },
        figure("FIG. 8"),
        { kind: "text", text: ", and " },
        figure("FIG. 9"),
        {
          kind: "text",
          text: " show a complying state, alternate flexure layouts, a torque-resistant bellows, ball-bearing construction, and a tension-oriented construction.",
        },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "SHEET 3 OF 3",
      title: "Concatenated and hub-like alternatives",
      description: [
        figure("FIG. 10"),
        { kind: "text", text: ", " },
        figure("FIG. 11"),
        { kind: "text", text: ", " },
        figure("FIG. 11a"),
        { kind: "text", text: ", and " },
        figure("FIG. 12"),
        {
          kind: "text",
          text: " print alternative concatenated and multi-element mechanisms under the same grant identification.",
        },
      ],
    },
    { kind: "heading", level: 2, text: "FIELD OF INVENTION" },
    p(
      text(
        "This invention relates to a remote center compliance system and more particularly to such a system which enables rotation in two directions about a remote center and which enables translational motion as well as rotational motion.",
      ),
    ),
    { kind: "heading", level: 2, text: "BACKGROUND OF INVENTION" },
    p(
      text(
        "In many industrial, scientific and other applications, it is necessary to perform insertion operations, such as putting pegs in holes, screws into threaded apertures, placing parts into specific locations, and similar operations. Conventionally, such operations could be done by hand by humans, but this work is tedious and boring, and often requires extremely precise and delicate placement which may not be possible for humans to accomplish for extended periods of time or with the proper delicacy. In addition, the use of human labor is often extremely expensive. Mechanical hands and arms using servo and force sensors have been used in many applications. These devices are typically extremely expensive because of the complex circuitry required to sense and feed back operational signals to the servos, and because of the relatively high cost of the computers and software which must be used to operate such systems. More recently, a variation on these mechanical devices has been introduced which searches in one dimension for a periphery and then returns some predetermined distance to an assumed middle point and then performs the same operation in a perpendicular direction. This too is a relatively expensive and complex device. Proximate center mechanical centering devices have been suggested for such applications, but they necessarily require the presence of part of their supporting structure in the work area, where it may interfere with the operations of the device.",
      ),
    ),
    p(
      text(
        "While human operators are limited as to the size and force of the tasks they can perform, the automated devices are not so limited but they do require increasing energy with increasing size and force range demands.",
      ),
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF INVENTION" },
    p(
      text(
        "It is therefore an object of this invention to provide a remote center compliance system which may be used in an assembly or insertion device. It is a further object of this invention to provide an improved insertion or assembly device which is extremely simple and inexpensive. It is a further object of this invention to provide such a device which requires no energy sources, no people, and no sensors and servos for its operation.",
      ),
    ),
    p([
      {
        kind: "text",
        text: "The invention results from the realization that by creating virtual rotation centers located beyond the ",
      },
      term(
        "remote center compliance",
        "The source names a passive mechanism whose effective rotation point is spatially separated from its flexures and may be located at, near, or beyond the working end. It does not mean a software feedback loop or an actively controlled Cartesian coordinate.",
      ),
      {
        kind: "text",
        text: " system mechanism and near or at the end of the insertion member, forces and moments may be created corresponding to a gentle pulling of the member to be inserted into the hole, and the further realization that by the addition of a translational motion device ",
      },
      term(
        "concatenated",
        "Joined in a sequence so that the rotational and translational portions share or connect through members. Watson uses the word for a mechanical arrangement, not a mathematical function composition or a computer-program operation.",
      ),
      {
        kind: "text",
        text: " with the rotational motion device and the operator member, the operator member is enabled to seek the hole with translational motion and then, in a second separate, decoupled, independent rotational motion, rotate to bring the axis of the operator member in line with that of the hole.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The invention features a remote center compliance system which may be used in a mechanical assembler or insertion device. It includes means for establishing rotational motion in directions transverse (tangential) to the radii of and about a center remote from the means for establishing the rotational motion. In a preferred embodiment the means for establishing the rotational motion may include first and second members and means for relatively, rotatably engaging the first and second members with each other for relative rotation about a center remote from the first and second members. The means for relatively, rotatably engaging may include at least three rotational interconnection elements located along portions of spherical radii emanating from the remote center, and each such rotational interconnection element may include two major motion portions, one proximate each of the first and second members. Also in a preferred embodiment, ",
      },
      term(
        "operator means",
        "The claimed member connected to the mechanism at its working end. In the description it may be a rod, robot hand, mechanical grip, claws, clamps, or another tool; “operator” does not require a human person to operate it.",
      ),
      {
        kind: "text",
        text: " are fixed to the means for establishing the rotational motion, and the center of rotational motion is at or near the end of the operator means.",
      },
    ]),
    { kind: "heading", level: 2, text: "DISCLOSURE OF PREFERRED EMBODIMENT" },
    p([
      {
        kind: "text",
        text: "Other objects, features and advantages will occur from the following description of a preferred embodiment and the accompanying drawings. ",
      },
      figure("FIG. 1"),
      {
        kind: "text",
        text: " is a schematic cross-sectional diagram using rotational and translational mechanisms; ",
      },
      figure("FIG. 2"),
      { kind: "text", text: " is a plan view; " },
      figure("FIG. 3"),
      { kind: "text", text: " shows the basic geometry; " },
      figure("FIG. 4"),
      { kind: "text", text: " and " },
      figure("FIG. 4a"),
      { kind: "text", text: " show translational response; " },
      figure("FIG. 5"),
      { kind: "text", text: " and " },
      figure("FIG. 5a"),
      { kind: "text", text: " show rotational response; " },
      figure("FIG. 6"),
      { kind: "text", text: " through " },
      figure("FIG. 10"),
      { kind: "text", text: " show alternate constructions." },
    ]),
    p([
      {
        kind: "text",
        text: "There is shown in ",
      },
      figure("FIG. 1"),
      {
        kind: "text",
        text: " a remote center compliance system 10 including means for establishing rotational motion 12 and means for establishing translational motion 14. An operating member, rod 16, is extended outwardly from the means for establishing rotational motion 12, and the means for establishing rotational motion 12 and translational motion 14 are concatenated and extended from the fixed portion 18 of the machine or device in which they are applied. Rod 16 is typically replaced by or carries a robot hand, mechanical grip, claws, clamps or the like which manipulate the part to be inserted or directed by the mechanism. The means for establishing rotational motion includes a member, plate 20, and another member, ring 22, which are relatively, rotatably interconnected by means such as flexures 24, 26, and 28. Flexures 24, 26, and 28 have major motion portions, pairs of reduced portions 30, 32; 34, 36; 38, 40, respectively, conveniently located proximate associated plates 20 and 22 in order to concentrate the motion at those reduced portions. Flexures 24, 26, and 28 lie along portions or radii 42, 44, 46, which emanate from center 50 which is remote from the system: it exists at, near, or beyond the free end 52 of rod 16.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The means for establishing translational motion 14 includes a member such as lip 54 integral with cylindrical wall 55 of machine 18, and another member which can be constituted by plate 22, which thus forms a part of both the translational and rotational mechanisms. Means for establishing translational motion 14 also includes, between plate 22 and lip 54, ",
      },
      term(
        "flexures",
        "Compliant members shaped so most bending occurs at specified reduced regions. The patent also allows alternatives such as springs, bearings, or wires; it does not disclose a universal spring constant, material modulus, or calibrated force response.",
      ),
      {
        kind: "text",
        text: " 56, 58, and 60. A translational force, T, on the end 52 of rod 16 causes relative translational motion between plates 20 and 22 by means of flexures 56, 58, and 60, while a rotational force, R, about the end 52 causes relative rotational motion between plates 20 and 22 about remote center 50 by means of flexures 24, 26, and 28. The basic geometry is depicted in ",
      },
      figure("FIG. 3"),
      {
        kind: "text",
        text: ", where flexures 24, 26, and 28 are disposed along portions of radii 42, 44, and 46 emanating from remote center 50, to form a triangular pattern typically but not necessarily equilateral.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "In operation, system 10, ",
      },
      figure("FIG. 4"),
      {
        kind: "text",
        text: ", is moved axially with machine part 18 to move rod 16 into hole 71 in work piece 73. Fine adjustment occurs by means for establishing translational motion 14 in response to force F developed as end 52 of rod 16 is guided by chamfer 75 as rod 16 experiences force I. The means for establishing translational motion 14 is shown in its shifted position in ",
      },
      figure("FIG. 4a"),
      {
        kind: "text",
        text: ". The fine adjustment afforded by the remote center compliance system, after the machine brings rod 16 to an approximate position over hole 71, enables precise translational alignment of rod 16 with hole 71 as an insertion force is applied.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "The means for establishing rotational motion operates in a similar fashion to make fine, precise adjustment. For example, as shown in ",
      },
      figure("FIG. 5"),
      {
        kind: "text",
        text: ", when rod 16 has been located at hole 71′, perfect alignment is not yet obtained because the axis 76 of rod 16 is not coincident with the center axis 78 of hole 71′. Upon application of insertion force, rod 16 makes contact at point 81 or 83 and then at the other point, subsequent to which a rotational moment, arrow M, is applied and is enabled by the rotational mechanism to rotate rod 16 until axis 76 becomes coincident with axis 78. The system may be made adaptive for different rod or tool lengths by suitable adjustment of the inclination of flexures 24, 26, and 28. The rotational mechanism in that condition is shown in ",
      },
      figure("FIG. 5a"),
      { kind: "text", text: "." },
    ]),
    p([
      {
        kind: "text",
        text: "The system may be alternatively constructed as shown in ",
      },
      figure("FIG. 6"),
      {
        kind: "text",
        text: ", where rod 16a is fixed to plate 20a and the rotational and translational flexures connect annular parts. In applications where the operator or rod is used to apply a torque or turning force to a workpiece, such as threading a screw into a threaded hole, it may be desirable to prevent even slight twisting. For this purpose bellows 90, ",
      },
      figure("FIG. 7"),
      {
        kind: "text",
        text: ", composed of casing 92 and support wire 94, may be fixed to machine 18 and plate 20 to permit translational motion and rotational motion in directions transverse to radii from the remote center, but prevent a third rotational motion, a twisting motion of rod 16. Bellows 90 need not be introduced through the center of the device but may as well be externally attached so that it envelops the entire mechanism.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "Although the system has been shown with mechanisms employing flexures, that is not a necessary limitation: the interconnection between members of rotational and translational portions may be made by springs, ball bearings, and various other devices. In ",
      },
      figure("FIG. 8"),
      {
        kind: "text",
        text: ", ball bearings replace the illustrated flexures for limited rotation and translation. In ",
      },
      figure("FIG. 9"),
      {
        kind: "text",
        text: ", the arrangement puts rotational flexures in tension under an excessive axial-force condition. As thus far described, the decoupled, independent translational and rotational motions enabled by the system are effected by two discrete mechanisms, one of which performs solely translational motion, the other of which performs solely rotational motion. However, this is not a necessary limitation of the invention: a single mechanism which enables both motions, or two mechanisms, one of which performs one motion and the other both motions, may be constructed.",
      },
    ]),
    p([
      {
        kind: "text",
        text: "An example of a combined arrangement is shown in ",
      },
      figure("FIG. 10"),
      {
        kind: "text",
        text: ", where a concatenated rotational mechanism 12c and translational mechanism 14c support operating member 16c. The flexures lie along radii emanating from remote center 50c beyond the end 52c. A translational force T and a rotational force R produce the separately described rotations of the plates and flexure. The source also says the relatively rotatable parts need not be discrete engagements: they may be sections of a sphere sliding relative to one another by low-friction surfaces, coatings, or members. Other objects, features and advantages will occur to those skilled in the art and are within the following claims:",
      },
    ]),
    { kind: "heading", level: 2, text: "What is claimed is:" },
    claim(
      1,
      "A remote center compliance system for an assembler device comprising: a first member fixed to said assembler device; a second member; operator means interconnected with said second member; a third member intermediately interconnected with said first and second members; at least three rotational interconnection elements interconnected between said third member and one of said first and second members and disposed along spherical radii of a remote center at, near or beyond the end of said operator means for enabling said operator means to rotate about said remote center; each of said rotational elements including a major motion portion proximate each of said members with which it is interconnected; and a plurality of translational interconnection elements interconnected between said third member and the other of said first and second members and disposed generally parallel to the axis of said operator means for enabling said operator means to translate relative to said first member; each of said translational elements including a major motion portion proximate each of said members with which it is interconnected.",
    ),
    claim(
      2,
      "The system of claim 1, further including torque resistant means interconnected between said first member and operator means for preventing twisting of the operator means.",
    ),
  ],
};

export const watsonRccParallelReadings: Record<number, readonly string[]> = {
  5: [
    "The field is deliberately two-axis at the working end: the apparatus allows a tool to translate and to rotate around a virtual point, rather than treating alignment as a rigid one-dimensional slide.",
  ],
  7: [
    "Watson frames insertion as a systems-cost problem. Human placement can be tiring and expensive, while an actively sensed robot hand needs electronics, feedback, computing, and software; a proximate-centering fixture can physically occupy the work zone.",
  ],
  8: [
    "The passage distinguishes human limits from automated-machine scale. It does not supply a force rating; it says only that demands for larger size and force range require more energy in automated equipment.",
  ],
  10: [
    "The three stated objects establish the intended contrast: an insertion or assembly attachment, mechanically simple and inexpensive, that relies on passive compliance rather than a powered sensing-and-servo loop.",
  ],
  11: [
    "The claimed insight is sequencing. First the tool can move laterally toward the opening, then it can rotate about a remote virtual center to bring its tool axis into line with the hole axis; the text calls those motions separate and decoupled.",
  ],
  12: [
    "The summary turns the concept into claim language: three or more radial rotational elements establish the remote rotation, while a separate set of generally axial elements establishes translation. “Operator means” is the interchangeable working tool, not a human operator.",
  ],
  14: [
    "The figure list is a source map, not an engineering simplification. It establishes that the patent documents multiple embodiments: the baseline geometry, contact responses, an anti-twist version, bearings, tension-oriented parts, and concatenated arrangements.",
  ],
  15: [
    "The baseline mechanism has a plate, a ring, three radial flexures, and an outward rod. The lines of the flexures converge at a remote point near or beyond the tool tip, so bending can imitate a small rotation about that otherwise empty point.",
  ],
  16: [
    "Watson separates the flexure sets by the motion they principally permit. The transverse group accommodates lateral motion; the radial group accommodates orientation change. The document provides their layout, not numerical stiffness or an elastic-material specification.",
  ],
  17: [
    "At the chamfered entrance, lateral contact lets the translational part shift the working rod toward the opening before the workpiece is fully inserted. This is a geometric contact narrative, not a calibrated force or clearance calculation.",
  ],
  18: [
    "After the rod reaches the opening, contact at the chamfer generates a moment that lets the radial flexure system change orientation. The target condition is coincidence of the rod and hole axes; tool length can alter where the virtual center should sit.",
  ],
  19: [
    "The bellows embodiment adds a constraint rather than a new alignment axis. It preserves the lateral and remote-center rotational freedoms while resisting torsional twist, useful where the end tool must apply turning torque such as screw threading.",
  ],
  20: [
    "The alternatives broaden the mechanical vocabulary: bearings, springs, a tension-oriented layout, a shared-motion mechanism, and low-friction spherical surfaces can realize the stated relative motions. The core claims remain a specific three-radial-plus-axial topology.",
  ],
  21: [
    "The final embodiment shows that concatenation does not require the same vertical stack as the baseline. What remains important is the remote-center geometry and the relationship between an operating member and the distinct translational and rotational responses.",
  ],
};
