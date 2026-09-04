import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const FIGURE_ROOT = "/patents/figures/us-4765668-robot-end-effector";
const SOURCE_SHEET_DIMENSIONS = { width: 2320, height: 3408 } as const;

/**
 * The public previews retain each complete primary drawing sheet. Figure 6
 * shares sheet 1 with Figure 1; Figures 4 and 5 share sheet 4. The older
 * individual crops remain preserved on disk as editorial aids only.
 */
const FIGURE_SOURCE_PDF_PAGE: Record<number, 2 | 3 | 4 | 5> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 5,
  6: 2,
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
  const sourcePdfPage = FIGURE_SOURCE_PDF_PAGE[number];
  if (!sourcePdfPage) {
    throw new Error(`Robot End Effector source sheet is not mapped for figure ${number}.`);
  }
  return {
    kind: "reference",
    text,
    href: `#figure-${number}`,
    referenceType: "figure",
    label: `Complete primary drawing sheet for ${text} from US 4,765,668`,
    figurePreviews: [
      {
        src: `${FIGURE_ROOT}/source-sheet-${sourcePdfPage}-v1.png`,
        alt: `${text}, complete primary drawing sheet ${sourcePdfPage - 1} of 4 from US 4,765,668`,
        width: SOURCE_SHEET_DIMENSIONS.width,
        height: SOURCE_SHEET_DIMENSIONS.height,
      },
    ],
  };
};

const figures = (numbers: readonly number[], text: string): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: `#figure-${numbers[0]}`,
  referenceType: "figure",
  label: `Complete primary drawing sheets for ${text} from US 4,765,668`,
  figurePreviews: numbers.map((number) => {
    const sourcePdfPage = FIGURE_SOURCE_PDF_PAGE[number];
    if (!sourcePdfPage) {
      throw new Error(`Robot End Effector source sheet is not mapped for figure ${number}.`);
    }
    return {
      src: `${FIGURE_ROOT}/source-sheet-${sourcePdfPage}-v1.png`,
      alt: `FIG. ${number}, complete primary drawing sheet ${sourcePdfPage - 1} of 4 from US 4,765,668`,
      width: SOURCE_SHEET_DIMENSIONS.width,
      height: SOURCE_SHEET_DIMENSIONS.height,
    };
  }),
});

const term = (text: string, label: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  label,
  definition,
});

export const robotEndEffectorParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "The abstract defines a doubled, symmetric workholding tool rather than a general robot arm. Two opposing pairs of hands move from repeatable midpoints, while removable fingers make the contact tooling replaceable.",
  ],
  4: [
    "The field is narrow and concrete: a device attached to a robot that mechanically grasps and orients objects. It does not purport to claim robot perception, task planning, or a universal human-like hand.",
  ],
  6: [
    "The background treats dedicated end effectors as a practical bottleneck. The grant contrasts user-made special tools with more versatile off-the-shelf grippers, without claiming that one gripper geometry suits every task.",
  ],
  7: [
    "The patent credits a parallel jaw gripper with simple actuation and sensing, then identifies its limits: it cannot reorient a held part and it makes a workcell wait while an entire hand is adjusted or changed.",
  ],
  8: [
    "Precision machine-tool cells change the problem from merely holding an object to putting it back at a repeatable location. The source ties useful robot payload to grip-force-to-weight ratio and warns that flexible, accurate systems can become mechanically elaborate.",
  ],
  9: [
    "The cited double-thread screw closes or opens two bosses, and the cited robot manipulator uses opposed screw portions. The new disclosure is therefore not the bare use of opposed threads; it combines that motion with a narrow symmetric double hand, interchangeable fingers, and ancillary axes.",
  ],
  10: [
    "The asserted design brief is a machine-tool gripper that remains thin and symmetric, has useful force for its carried weight, and can be manipulated in more than one axis. Those are stated objectives, not a universal performance guarantee.",
  ],
  12: [
    "The summary gives the visitor-level mechanism: replaceable grasping components, controllable width and force, and a center point that changes very little as force changes. The claims determine the legal boundary, not this aspiration alone.",
  ],
  13: [
    "The narrow rectangular body carries hands on both sides of its long axis. With the connector able to rotate the frame, the specification describes taking one workpiece from a collet, turning it, and inserting its other side while a machine tool continues cutting.",
  ],
  14: [
    "Opposite-handed screw threads convert one screw rotation into symmetric separation or approach of two hands. A second, opposing pair on another screw turns that arrangement into a double hand; the rectangular cross section gives the fingers their transverse reach.",
  ],
  15: [
    "This is the summary's complete mechanical statement: an opposed-thread screw moves one pair symmetrically, removable fingers provide the grasp interface, and a second screw/pair occupies the opposite side of the elongated frame. The later claims select and organize those details differently.",
  ],
  17: [
    "The drawing list establishes what each source sheet shows. It matters because Figure 3 is the sectional evidence for the screw and gear drive, while Figures 4–6 isolate the finger interface and robot-side connector; these are archival figure references, not generated diagrams.",
  ],
  19: [
    "The depicted gripper is a symmetric, rectangular frame with a pair of sliding hands on each opposite transverse side. Each pair carries removable fingers, so the described machine is a double hand rather than a single parallel-jaw mechanism.",
  ],
  20: [
    "The frame is a structural sandwich: upper cylinder, web, and lower cylinder. The web's bore both reduces material and routes utilities; the grant places one air motor in each cylinder to drive the corresponding hand system.",
  ],
  21: [
    "The source makes a real actuator tradeoff. Pneumatic rotary motors tolerate stall and offer power density, while an electric motor is easier to control but can overheat; the prototype's current feedback and PWM are evidence for controllable force, not a modern closed-loop controller specification.",
  ],
  22: [
    "A screw with equal-and-opposite threads moves paired nuts symmetrically about an unthreaded center. The patent explicitly reports up to 90 percent screw efficiency and therefore names the back-driving consequence: continued motor torque is needed to keep a high grip force.",
  ],
  23: [
    "This paragraph supplies the measurements that qualify the simulation: a 35.6 mm driving gear, 48.3 mm screw gear, 5 mm screw lead, 2,000 N maximum gripping force, and 43 mm/s maximum screw travel in a prototype. These are an embodiment, not every implementation covered by the claims.",
  ],
  24: [
    "The hand is both a guided carriage and a ball-screw nut carrier. Its legs wrap a cylinder, pads engage the web to prevent rotation, and the result is longitudinal translation rather than the hand turning with the screw.",
  ],
  25: [
    "The ball nut turns screw rotation into the hand's linear motion and sends closing force into the hand body. The described bearing coating and retention details explain why a sliding hand can remain guided while resisting opening loads.",
  ],
  26: [
    "The source's dovetail channel is a tooling interface. Its bosses set an insertion stop and its detent cavities prepare a repeatable lock location; it is not just decorative finger mounting.",
  ],
  27: [
    "Each removable finger combines an outward grasping portion with a dovetailed tenon. The matching channel in the hand constrains the finger interface while leaving the shape of the work-contact surface available for task-specific tooling.",
  ],
  28: [
    "The fingers slide into the hand until their bases meet the bosses. A spring-loaded detent retains them, while the triangular dovetail centers and aligns the contact tooling under gripping force.",
  ],
  29: [
    "The intended workflow changes fingers in an auxiliary fixture: close, insert the fingers into the fixture, open to leave them, and reverse the sequence to acquire new fingers. That is the practical bridge from one gripper body to different turning, tooling, or collet tasks.",
  ],
  30: [
    "The connector is deliberately only shown in general form, but the disclosure assigns it two jobs: rotate the long axis and pass electrical and pneumatic connections. The visual therefore represents its rotation as a source-described degree of freedom, not an undocumented robot-arm model.",
  ],
  31: [
    "A double piston assembly moves the full frame transversely while upper and lower bearings stabilize it. The linear transducer is feedback for that axis; the grant does not state its resolution, controller gains, or a pneumatic pressure law.",
  ],
  32: [
    "The closing account links narrowness, two-sided symmetry, rotation, and interchangeable fingers to a machine-tending sequence. It also reports no more than 0.05 mm repeatability over the grip-force range and a typical 6-inch jaw opening for a specific design.",
  ],
  33: [
    "The source locates two different deformation concerns: finger and hand deflection create cosine error at the contact point, while frame translation directly moves that point. It prefers lightweight 2024-T6 aluminum but supplies no section dimensions or elastic modulus calculation for the actual frame.",
  ],
  34: [
    "The conventional closing paragraph preserves the distinction between the depicted embodiment and the claims. Variants may be possible, but an archival explanation should not turn that permission into invented dimensions or performance data.",
  ],
};

export const robotEndEffectorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485",
  preparedBy: "Classic Patents editorial agent (JadeHeron)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19]",
        "Slocum et al.",
        "[11] Patent Number: 4,765,668",
        "[45] Date of Patent: Aug. 23, 1988",
        "[54] ROBOT END EFFECTOR",
        "[75] Inventors: Alexander H. Slocum, McLean, Va.; Peter A. Jurgens, Kirkland, Wash.",
        "[73] Assignee: The United States of America as represented by the Secretary of Commerce, Washington, D.C.",
        "[21] Appl. No.: 67,400 · [22] Filed: Jun. 26, 1987",
        "[63] Continuation of Ser. No. 829,052, Feb. 13, 1986, abandoned.",
      ],
    },
    { kind: "heading", level: 2, text: "ABSTRACT" },
    p(
      "A double-handed, robot end effector or gripper which can be used for moving and positioning machine parts. The gripper is elongate and symmetric about its longitudinal axis, having a first and a second set of hands extending in each of the two transverse directions. Each hand has a removable finger and is positioned about an accurately repeatable midpoint. The hands are mounted on and are moved about the longitudinal plane by a ",
      term(
        "ball screw",
        "Recirculating ball screw",
        "A threaded rotary-to-linear transmission that uses rolling balls between screw and nut. Here opposite thread hands move two guided hands symmetrically about the screw's unthreaded midpoint.",
      ),
      " which is rotated by either an electric motor or an air driven motor through gears located at one end.",
    ),
    { kind: "heading", level: 2, text: "FIELD OF THE INVENTION" },
    p(
      "The present invention relates to manipulating devices, and in particular relates to an end effector or gripper attachable to a robot for mechanically grasping and orienting objects.",
    ),
    { kind: "heading", level: 2, text: "BACKGROUND OF THE INVENTION" },
    p(
      "Robots can be used in a multitude of tasks, but generally they require end effectors which are designed for specific tasks. Normally, the design and fabrication of specialized end effectors has been the responsibility of the robot user. However, in order to increase the versatility of ",
      term(
        "off-the-shelf grippers",
        "Standardized grippers",
        "The period phrase identifies generally available gripper products rather than purpose-made end tooling. The grant contrasts that hoped-for versatility with specialized hands built by a robot user.",
      ),
      ", more universal anthropomorphic designs are being developed.",
    ),
    p(
      "One advanced design is a parallel jaw gripper which has as its main advantages simplicity in mechanical and electrical design and a desirable ",
      term(
        "grip force-to-weight ratio",
        "Grip force divided by carried tool weight",
        "The source's performance ratio compares available clamping force with the weight the robot must carry. It does not identify a payload, friction coefficient, contact geometry, or safe workpiece mass.",
      ),
      ". For example, force and position control can be obtained with a single actuator, one position sensor and one force sensor, and one microcomputer. Grip force-to-weight ratios on the order of 50:1 are easily obtainable as a result of the point of load application having no mechanical advantage over the linkage. Nevertheless, such grippers have several disadvantages, such as the inability of the gripper to reorient a part after it is grasped and the necessity of presenting an object to the gripper in a predetermined, known orientation. An additional disadvantage is the need for different types of hands for different parts and the requirement that the entire robot be disabled while lengthy adjustments in gripper hands are done.",
    ),
    p(
      'Unfortunately, as with the robots themselves, there is usually no "best type" of design for a grasping system. It is important in any such design that the characteristics and movements of the overall system be considered. For example, in a precision flexible manufacturing work cell, finished parts having tolerances on the order of one-thousandth of an inch are usually stored in an orderly fashion to prevent the formation of burrs instead of merely being piled in a bin so human-like grasping abilities are not required. Other problems with respect to robots include payloads being quite limited in order to maximize the grip force-to-weight ratio and thus maximize a robot\'s potential to do useful work. When operating in a precision flexible manufacturing area, robot repeatability and accuracy must be high and reliable, but usually are not when compared to the precision parts and fixtures with which they operate. Consequently, methods are necessary to assist the robot during parts insertion processes and parts manipulation processes. On the other hand, those manipulators which have the flexibility and accuracy are usually extremely complex in both their mechanical and electrical systems, and consequently usually have a low grip force-to-weight ratio. As an example, a gripper currently being developed uses 38 pneumatic actuators controlled by 6 microprocessors that are coordinated by a minicomputer.',
    ),
    p(
      "A manipulating device that utilizes a double threaded ball screw is disclosed in the U.S. Pat. No. 3,261,479 Baker et al. Such a device utilizes a stationary threaded screw which when turned, causes two bosses 19 and 20 to move together or apart so that grasping fingers 21 can engage an object 22. A two finger manipulator for a robot is disclosed in the Inagaki et al U.S. Pat. No. 4,336,926. This patent discloses in column 1, lines 14–24 that it is old to use a motor driven screw rod with oppositely threaded portions to drive the robot fingers. Such a rod is also disclosed in a photograph of a precursor to the present invention on the cover of the January, 1984 edition of American Machinist.",
    ),
    p(
      "Nevertheless, all of these prior art devices do not provide a highly versatile, mechanically and electrically simplistic robot end manipulator with the accuracies required in the machine tool manufacturing industry. Thus, there is need for an end effector or grasping system for use by robots which are operated in a machine tool environment. Such a gripper must not only have a high grip force-to-weight ratio, but should be thin, symmetrical, and manipulatable in a plurality of axes.",
    ),
    { kind: "heading", level: 2, text: "SUMMARY OF THE INVENTION" },
    p(
      "In view of the deficiencies of the prior art, the present invention was developed so as to provide a state-of-the-art gripper for use with robots that manipulate machine tools. The present invention can automatically change the grasping components of the end effector thereby providing increased versatility in the handling of a variety of part shapes and sizes while also having a high grip force-to-payload ratio.",
    ),
    p(
      "Further design objectives of the present invention include a high grip force-to-payload ratio and the controllability of the grasping width and grasping force. Furthermore, in order to maintain repeatability and accuracy, the center of the gripping fingers moves an extremely small amount over the entire range of grip forces.",
    ),
    p(
      "In a particular embodiment, the gripper frame has a configuration that makes it extremely narrow so as to permit the end effector to insert thin parts into collets. Furthermore, that embodiment is symmetrical about a central, longitudinal axis of the frame with hands and grasping fingers mounted on each side of the axis, the frame being rotatably mounted about that axis. As a result, two parts can be handled at once and a part removed from a collet can be turned over and then reinserted into the collet. This permits a machine tool being tended to cut metal while the robot removes a finished part and gets a new blank.",
    ),
    p(
      "According to the present invention, a robot end effector or gripper comprises a manipulator having a frame and a left and right hand threaded ball screw mounted on the frame and rotatable by a motor. A pair of hands are threadingly engaged by the ball screw such that upon rotation of the ball screw in one direction the hands are moved relatively apart and upon rotation of the ball screw in the other direction, the hands are moved relatively toward one another. A pair of gripper fingers are removably mounted on the hands. In a particular embodiment of the present invention, the end effector is elongate and symmetrical about its longitudinal axis, the pair of hands being mounted on one side of the axis and a further pair of hands being mounted on a second ball screw located on the other side of the axis. In this embodiment, the frame has a generally rectangular shape in cross section and the fingers extend in the direction of the long or major axis of the rectangle.",
    ),
    { kind: "heading", level: 2, text: "BRIEF DESCRIPTION OF THE DRAWINGS" },
    p(
      figure(1),
      " is a perspective view of an actual model according to the present invention depicting the gear end of the end effector, and with some parts removed; ",
      figure(2),
      " is a perspective view from the other end of the end effector depicted in ",
      figure(1),
      "; ",
      figure(3),
      " is a side elevational view, partly in cross section, of the end effector depicted in ",
      figure(1),
      "; ",
      figure(4),
      " is an end elevational view from the gear end of the end effector; ",
      figure(5),
      " is an elevational view from the other end of the end effector; ",
      figure(6),
      " is a top plan view of the end effector depicted in ",
      figure(3),
      ".",
    ),
    { kind: "heading", level: 2, text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS" },
    p(
      "With reference now to the figures in which like numerals represent like elements throughout the several views, a robot end effector or gripper 10 mountable on the end of a robot arm is depicted. Gripper 10 is comprised of a symmetrical elongate frame 12 having a generally rectangular cross section (see ",
      figure(4),
      "), a first pair of hands 14 and 16 slidably mounted on and extending from the top side of frame 12 (as depicted in ",
      figure(1),
      ") and a second pair of hands 18 and 20 slidably mounted on and extending from the opposite, bottom side of frame 12 (as depicted in ",
      figure(1),
      "). Pairs of fingers 22 and 23 and 24 and 25, are slidably and removably mounted on hands 14, 16, 18 and 20 and extend outwardly therefrom.",
    ),
    p(
      "As shown in ",
      figures([1, 2, 4], "FIGS. 1, 2 and 4"),
      ", frame 12 is an integral unit comprised of an upper (as depicted in the figures) hollow cylinder 26, a central web 28 and a lower hollow cylinder 30. Web 28 has a bore 32 therethrough so as to both lighten the web and to receive electrical wires or pipes. As shown in ",
      figure(3),
      ", an air motor 34 is mounted inside upper cylinder 26 and a corresponding air motor (not shown) is mounted inside lower cylinder 30. The air motors turn corresponding shafts 36 and 38.",
    ),
    p(
      "The air motors 34 are essentially a rotary actuator and thus in other embodiments can also be an electric motor. An air motor has a higher power density and the capability of being run at a stall without damages. The disadvantages of an air motor include the difficulty in controlling the output torque and problems in correlating air pressure to torque output, which is a function of rotor position. On the other hand, an electric motor has the advantage of its easy controllability, but a disadvantage of burning out in a stall condition. If an electric motor is used, it is preferable that it be a brushless DC motor. On the other hand, an initial prototype used brushes and required a cooling air stream to prevent the motor from overheating. Nevertheless, by using current feedback and pulse width modulation, the gripper was able to hold a light bulb without crushing it, on the one hand, and could exert a compression force of over 600 pounds, on the other hand. If the particular application of the current invention can stand a coarser force resolution and a higher minimum gripping force, then the preferable motor would be an air motor. In an embodiment of the present invention, a 75 watt (0.1 horsepower), air motor having a stall torque of 10 N-m (90 in-lb) at 690 kPa (100 psi) and a maximum speed of 260 RPM was used.",
    ),
    p(
      "As shown in ",
      figure(3),
      ", an upper ball screw 40 is rotatably mounted at each end in bearings 42 and 44. Bearings 42 and 44 are mounted on end plates 46 and 48, which in turn are rigidly mounted on opposite ends of frame 12 (see also ",
      figures([4, 5], "FIGS. 4 and 5"),
      "). A lower ball screw (not shown), located inside a flexible diaphragm 50, is rotatably mounted in bearings (not shown) similar to the mounting of ball screw 40. The ball screws are symmetrically mounted to end plates 46 and 48 about the longitudinal axis of frame 12. The ball screws can be identical and thus only upper ball screw 40 will be described. Ball screw 40 has a right hand threaded portion 56, a central unthreaded portion 58 and a left hand threaded portion 60. Hands 14 and 16, and 18 and 20 are symmetrically mounted on their respective ball screws about central portion 58. The linearity of the ball screw and the symmetrical mounting of the hands ensure that the gripping center-point of the fingers is repeatable and remains fixed with respect to gripper 10. In fact, because the ball screw is so highly efficient (up to 90%) it generates a ",
      term(
        "back-driving torque",
        "Torque caused by a load driving the screw backward",
        "An efficient screw can transmit force from a gripped object back through its nut and screw into the motor. The source says continuous driving torque is therefore needed to sustain high grip force.",
      ),
      " that requires the driving motor to provide a continuous torque in order to maintain a high grip force on an object.",
    ),
    p(
      "Ball screw 40 is rotated by air motor 34 through a gear train 62 and the lower ball screw (not shown) is rotated by a lower air motor (also not shown but located in lower cylinder 30, ",
      figure(3),
      ") by a lower gear train 64. Each gear train is similar and therefore only gear train 62 will be described. Gear train 62 is comprised of a relatively small spur gear 66 mounted on shaft 36 and a larger spur gear 68 mounted on a shaft 70 that is integral with ball screw 40 and extends through bearing 44. Both spur gears 66 and 68 are mounted spaced from end plate 48. Spur gear 66 has eight pegs 72 pressed into holes therein and which protrude toward end plate 48. An inductive proximity switch 74 (",
      figures([1, 4], "FIGS. 1 and 4"),
      ") senses posts 72 as they go by and thereby provides an 8 count encoder. In a prototype of the present invention, motor spur gear 66 has a 35.6 mm (1.4 inch) diameter and ball screw spur gear 68 has a 48.3 mm (1.9 inch) diameter. The use of a spur gear train allows fine tuning of the desired mechanical gain because the gear pitch diameters can be changed. In a prototype of the present invention, in which ball screw 40 had a 5 mm (0.2 inch) lead left/right hand thread, the maximum gripping force was 2000 N (1555 lbs.), and the maximum travel along ball screw 40 was 43 mm/sec (1.7 in/sec).",
    ),
    p(
      "With reference now to ",
      figures([1, 3, 6], "FIGS. 1, 3 and 6"),
      ", hands 14, 16, 18 and 20 will be described. Because the hands are substantially similar, only hand 14 will be described. Hand 14 is comprised of an upper (as depicted in ",
      figure(3),
      ") body portion 76 and two, integral, depending legs 78 and 79. Legs 78 and 79 are configured to fit around upper cylinder 26 and are slightly resilient so that they can be mounted thereon. Legs 78 have lower portions 80 which engage corresponding sides of frame web 28. Bearing pads 82 located on the inner sides of the leg lower portions 80 (depicted on hands 18 and 20 in ",
      figure(3),
      ") engage frame web 28 and prevent rotation of the hand while permitting longitudinal movement along frame web 28.",
    ),
    p(
      "Hand 14 is also threadedly engaged by ball screw 40 and thus acts as a travelling nut upon the rotation of ball screw 40. In particular, hand body 76 is comprised of a hollow sleeve portion 84 having a bore 86 through which a ball nut 87 is mounted. Ball nut 87 has a flange 88 which transfers the closing force of nuts 87 to hand 14. Ball nut 87 may be mounted to hand body 76 by a press fit or set screws. Such mounting means prevent disengagement of ball nut 87 from hands 14, 16 when they are being opened. The inner surface of the lower part of hand body 76 has a coating of a bearing material 90, such as Teflon, on those portions which engage frame upper or lower cylinders 26 and 28.",
    ),
    p(
      "As shown in ",
      figures([2, 6], "FIGS. 2 and 6"),
      ", the upper (as depicted in the figures) end of hand 14 and hand 16 have a ",
      term(
        "dovetail shaped channel",
        "Tapered slide-and-lock tooling interface",
        "A dovetail has angled flanks that resist transverse pullout while permitting axial insertion. In this design the paired geometry also centers the removable finger when grip load is applied.",
      ),
      " 92 in the upper surface thereof. Two upstanding bosses 94 and 96, located on the outermost top portions (as seen in ",
      figure(6),
      ") of hands 14 and 16, are integral with the upper surface of hand body 76. Located along the center line of hands 14 and 16, toward bosses 94 and 96 are detent cavities 98 and 99, respectively.",
    ),
    p(
      "As shown in ",
      figures([1, 2, 3, 4], "FIGS. 1–4"),
      ", slidably, removably mounted on hands 14 and 16 and hands 18 and 20 are fingers 22 and 23 and fingers 24 and 25, respectively. Each of the fingers are substantially similar and therefore only finger 22 will be described. Finger 22 has an outward grasping portion 104 integral with a base 106. As shown in ",
      figure(4),
      ", extending outwardly in the opposite direction from base 106 is a projecting tenon 108 having a dovetailed shape conforming to the shape of dovetail channel 92 in hand 16.",
    ),
    p(
      "Fingers 22 and 23 can be easily and removably inserted into corresponding hands 14 and 16 by sliding them in the axial direction until the finger base 106 abuts bosses 94 and 96. Each finger furthermore has a spring loaded detent 109 (depicted in ",
      figure(4),
      ") comprised of a spring 110 and a plunger 112 located in an outwardly extending cavity 114 in tenon 108. Thus, when a finger is inserted into a hand, detent 109 is received by detent cavity 98 and thus the finger is removably retained on the hand and prevented from easily sliding back out. Because fingers 22 and 23 and 24 and 25 are designed to grasp an object by their inner surfaces, bosses 94 and 96 provide the necessary rigidity and permit the fingers to obtain the maximum designed grasping or compression forces. The triangular shape of the dovetail further acts to center and align the fingers when a grasping force is applied.",
    ),
    p(
      "The ability to change fingers allows gripper 10 and the robot to which gripper 10 is attached to perform different tasks more economically than if the entire gripper or if the entire hand had to be changed. For example, when tending a turning center, a narrow set of fingers is used to allow short parts to be turned over, while a different set of fingers is used to change tooling. A third set of fingers is required to change collets. In a completely automated flexible manufacturing environment, if an odd shaped part is to be handled, a set of disposable fingers could be machined as needed, thereby reducing the fixturing inventories and their associated costs. The dovetail slot attachment means for the fingers allows them to be changed simply by first closing the fingers, moving the gripper 10 to insert the fingers into a stationary, auxiliary fixture (not shown) and then opening the hands. As the hands are opened, the fingers are held by the auxiliary fixture. Similarly, new fingers can be mounted on the hands by reversing these procedures.",
    ),
    p(
      "With reference now to ",
      figures([2, 3, 5], "FIGS. 2, 3 and 5"),
      ", the end of gripper 10 which is connected to a robot will now be described. For the purposes of illustration, the connector to the robot is shown only in general form at 130 in ",
      figure(3),
      ". Robot connector 130 connects between a robot generally shown at 132 and gripper 10. Robot connector 130 is comprised of a conventional rotational fitting for permitting gripper 10 to be rotated about its longitudinal axis with respect to robot 132. Thus, in addition to providing a supporting connection between gripper 10 and robot 132, robot connector 130 also provides the means for rotating gripper 10 and means for providing the appropriate electrical signals to and from gripper 10 and for providing the appropriate pneumatic connections (not shown) to motor 34. Alternatively, the pneumatic connections can be made directly with flexible hoses to motor 34, bypassing connector 130, and the rotation of connector 130 is simply limited to a predesigned angle.",
    ),
    p(
      "The robot connector 130 also includes a means for reciprocally moving frame 12 in a transverse direction as depicted in ",
      figure(2),
      ". This transverse movement is provided by a conventional piston and cylinder mechanism 134. Mechanism 134 is comprised of an upper cylinder 136 and a lower cylinder 138 rigidly connected to end plate 46 with fasteners such as bolts 140. Upper and lower cylinders 136 and 138 respectively receive pistons 142 and 144 to which are attached piston tails 146 and 148. In the embodiment depicted in the figures, mechanism 134 is a double piston assembly having a unitary S shaped housing 150 in which both cylinders 136 and 138 are located. Two couplings 152 and 154 are respectively mounted on to the ends of piston tails 146 and 148, and in turn are rigidly connected to robot connector 130. Thus, the movement of piston 142 or 144 inside its corresponding cylinder 136 or 138 results in the lateral movement of gripper 10. The lateral movement of gripper 10 is stabilized by an upper bearing 156 and a lower bearing 158, which can either be ball bearings or crossed roller bearings. The gripper halves of bearings 156 and 158 are rigidly mounted to end plate 46 with fasteners such as screws 160 and 162. The cooperating halves of bearings 156 and 158 are rigidly mounted to robot connector 130. Position feedback is provided by a linear transducer 164, the piston part 166 of which is connected to housing 150 and the cylinder part 168 of which is rigidly connected to robot connector 130.",
    ),
    p(
      "The present invention has the ability to change its own fingers and because of its narrow profile, is particularly well suited for removing a part from a fixture and immediately inserting another part, or rotating that part and inserting the other side thereof into a fixture. The versatility of the present invention allows it to handle a variety of part shapes and sizes and still has a very high grip force to payload ratio. By designing the gripper symmetrically, two parts can be handled at once which permits one to be removed from a fixture such as a collet, to be turned over by the rotation of the gripper connector, and then have the other side inserted into the collet. Then, the robot can take the removed part and drop it off and get a new blank while the inserted part is being worked on. The design of the hands and the ball screws provides a system repeatability that does not vary more than 0.05 mm (0.002 in.) over the entire range of grip forces. In addition, in a specific design of the present invention, a jaw opening (the distance between the fingers) can be typically 6 inches.",
    ),
    p(
      "The hand and finger designs are based on a maximum stress criterion because the hand and finger deflections only create cosine errors in the repeatability of the grip point as the grip force is increased. The frame design is based primarily on a maximum deflection criterion because the translation of the beam directly affects the grip point repeatability. In order to achieve the low weight feature of the present invention, all structural members are preferably made from a light weight material, such as 2024-T6 aluminum.",
    ),
    p(
      "The present invention has been described with respect to a preferred embodiment thereof. Obviously, modifications and changes can be made thereto within the abilities of those skilled in the art without affecting the scope of the invention.",
    ),
    { kind: "heading", level: 2, text: "WE CLAIM:" },
    claim(
      1,
      "A robot end effector or gripper comprising: a manipulator having an elongate frame that defines a longitudinal frame axis; a motor mounted on said frame; a ball screw rotatably mounted on said frame generally parallel to said longitudinal frame axis, said screw being rotatable by said motor and having a mid portion, a left hand threaded portion on one side of said mid portion, and a right hand threaded portion on the other side of said mid portion; a pair of hands slidingly mounted on said frame for reciprocal movement in said longitudinal frame axis, each hand having inner sides facing the other hand and opposed outer sides, one hand threadedly engaged by said screw left hand portion and the other hand threadedly engaged by said screw right hand portion, and both hands being slidingly mounted on said frame such that upon rotation of said ball screw in one direction said hands are moved relatively apart and upon rotation of said ball screw in the other direction said hands are moved relatively together, all such movement being substantially symmetrical to said screw mid portion; a pair of fingers used to grasp an object; and means for removably mounting each said finger on a corresponding one of said hands such that said fingers can be automatically mounted and dismounted on said hands.",
    ),
    claim(
      2,
      "The robot end effector or gripper as claimed in claim 1 wherein said frame has a generally rectangular cross-section with a long and a short axis, and said frame is symmetrical about said longitudinal axis; and wherein said hands extend in the direction of the long transverse axis of said frame and are movable in a direction generally parallel to said longitudinal axis.",
    ),
    claim(
      3,
      "The robot end effector or gripper as claimed in claim 1 and further including a second ball screw rotatably mounted on said frame, and having a left hand threaded portion and a right hand threaded portion; a second pair of hands, one threadedly engaged by said second screw left hand portion, and the other threadedly engaged by said second screw right hand portion; and a second pair of fingers removably mounted on said second pair of hands.",
    ),
    claim(
      4,
      "The robot end effector or gripper as claimed in claim 1 wherein said frame comprises an upper cylinder and a lower cylinder mounted integrally on either side of a central web.",
    ),
    claim(
      5,
      "The robot end effector or gripper as claimed in claim 4 wherein said web has a longitudinal bore therethrough.",
    ),
    claim(
      6,
      "The robot end effector or gripper as claimed in claim 4 wherein said motor is mounted inside one of said upper and lower cylinders.",
    ),
    claim(
      7,
      "The robot end effector or gripper as claimed in claim 6 wherein said motor has a shaft that extends outside said cylinder; and further including a gear train connected between said motor shaft and an end of said ball screw.",
    ),
    claim(
      8,
      "The robot end effector or gripper as claimed in claim 7 wherein said gear train comprises a first spur gear mounted on said motor shaft, and a second spur gear meshing with said first spur gear and mounted on said ball screw end, and further including first means mounted to one of said spur gears and second means mounted on said frame for jointly providing a signal indicative of the rotation of said one spur gear.",
    ),
    claim(
      9,
      "The robot end effector or gripper as claimed in claim 1 and further including: a shaft driven by said motor; and a gear train connected between said shaft and an end of said ball screw.",
    ),
    claim(
      10,
      "The robot end effector or gripper as claimed in claim 9 wherein said gear train comprises a first spur gear mounted on said shaft and a second spur gear in meshing engagement with said first spur gear and mounted on said ball screw end.",
    ),
    claim(
      11,
      "A robot end effector or gripper comprising: a manipulator having an elongate frame that defines a longitudinal frame axis; a motor mounted on said frame; a ball screw rotatably mounted on said frame generally parallel to said longitudinal frame axis, said screw being rotatable by said motor and having a mid portion, a left hand threaded portion on one side of said mid portion, and a right hand threaded portion on the other side of said mid portion; a pair of hands slidingly mounted on said frame for reciprocal movement in said longitudinal frame axis, one hand threadedly engaged by said screw left hand portion and the other hand threadedly engaged by said screw right hand portion, and both hands being spaced equally from said screw mid portion and slidingly mounted on said frame such that upon rotation of said ball screw in one direction said hands are moved relatively apart and upon rotation of said ball screw in the other direction said hands are moved relatively together, all such movement being substantially symmetrical to said screw mid portion; a pair of fingers removably mounted on said pair of hands; a shaft driven by said motor; a gear train connected between said shaft and an end of said ball screw, said gear train comprising a first spur gear mounted on said shaft and a second spur gear in meshing engagement with said first spur gear mounted on said ball screw end; and first means mounted in one of said spur gears and second means mounted on said frame for jointly providing a signal indicative of the rotation of said one spur gear.",
    ),
    claim(
      12,
      "The robot end effector or gripper as claimed in claim 1 wherein said motor is a pneumatically driven motor.",
    ),
    claim(
      13,
      "The robot end effector or gripper as claimed in claim 1 wherein each of said hands are engaged by said screw at one portion thereof and extend outwardly from said frame in the transverse direction; and further including means for slidably mounting each said finger on its corresponding one of said hands, said mounting means comprising a stop located at the outward end of said hand, a rail mounted on one of said finger and said hand, and a channel mounted on the other of said finger and said hand such that said finger can be slidable out of engagement with said hand only in an inward direction.",
    ),
    claim(
      14,
      "The robot end effector or gripper as claimed in claim 13 wherein said rail and channel have a dovetail shape.",
    ),
    claim(
      15,
      "The robot end effector or gripper as claimed in claim 13 wherein said mounting means further comprises a releasably engageable catch to releasably retain said finger mounted on said hand.",
    ),
    claim(
      16,
      "The robot end effector or gripper as claimed in claim 1 and further including means for reciprocally moving said frame in a transverse direction.",
    ),
    claim(
      17,
      "The robot end effector or gripper as claimed in claim 1 and further including means for mounting said frame for at least partial rotation about the longitudinal axis thereof.",
    ),
    claim(
      18,
      "A robot end effector or gripper comprising: a manipulator having an elongate frame that defines a longitudinal frame axis and comprising an elongate web, an upper cylinder and a lower cylinder mounted integrally on either side of said web; a pair of hands slidingly mounted on said frame about one of said cylinders and a portion of which slidingly engages said web for reciprocal movement in said longitudinal frame axis; and means for selectively, reciprocally sliding said pair of hands on said frame such that said hands are moved relatively apart and are moved relatively together.",
    ),
    claim(
      19,
      "A robot end effector or gripper as claimed in claim 18 wherein said sliding means comprises a motor mounted in one of said cylinders, a rotatable elongated screw mounted on the side of one of said cylinders opposite said web such that said screw, said cylinders and said web are coplanar, and means for operatively connecting said motor to said hands.",
    ),
    claim(
      20,
      "A robot end effector or gripper as claimed in claim 19, and further comprising a further pair of hands slidingly mounted on said frame for reciprocal movement in said longitudinal frame axis; and further means for selectively, reciprocally sliding said further pair of hands on said frame such that said hands are moved relatively apart and are moved relatively together, said further sliding means comprising a further motor mounted in the other one of said cylinders, and further means for operatively connecting said further motor to said further hands; said hands and said further hands being mounted on opposite transverse sides of said frame.",
    ),
  ],
};

/** Keeps the patent record's legal text bound to the single manual edition. */
export function robotEndEffectorClaimText(number: number): string {
  const block = robotEndEffectorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Robot End Effector manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
