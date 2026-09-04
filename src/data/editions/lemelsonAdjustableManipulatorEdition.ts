import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const PATENT_NUMBER = "3,260,375";
const FIGURE_ROOT = "/patents/figures/us-3260375-lemelson-adjustable-manipulator";

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

const sheetForFigure = (n: number) => {
  if (n <= 2) return 1;
  if (n <= 6) return 2;
  return 3;
};

const figure = (number: number, text = `FIG. ${number}`): CuratedSpecificationInline => ({
  kind: "reference",
  text,
  href: `#figure-${number}`,
  referenceType: "figure",
  label: `Source crop of ${text} from US ${PATENT_NUMBER}`,
  figurePreviews: [
    {
      src: `${FIGURE_ROOT}/source-sheet-${sheetForFigure(number)}-v1.png`,
      alt: `${text}, complete source drawing sheet from US ${PATENT_NUMBER}`,
      width: 2320,
      height: 3408,
    },
  ],
});

const term = (text: string, label: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text,
  label,
  definition,
});

/** Paragraph-indexed readings explain the matching source paragraph; they are not OCR cleanup. */
export const lemelsonAdjustableManipulatorParallelReadings: Readonly<
  Record<number, readonly string[]>
> = {
  1: [
    "The grant puts the invention in automatic article and tool manipulation, referencing Lemelson's parent application from December 1954 as foundational lineage.",
  ],
  2: [
    "Lemelson contrasts specialized one-purpose equipment with a reconfigurable assembly. The document calls out complexity in feedback, braking, and programming, then proposes physical adjustment of the travel limits as an alternative for a fixed cycle.",
  ],
  3: [
    "The objectives define the editorial boundary: modular structure, adjustable motion limits, a limit-switch cycle, and an electrically controlled joint without requiring an offline computer.",
  ],
  7: [
    "Figures 1–6 outline the overhead carriage, vertical column, rotary joint, bevel-gear pivot, and gripper jaws, while Figure 7 presents the sequential forward/stop/reverse electrical control circuit.",
  ],
  8: [
    "Figures 1 and 2 show two forms of the same basic arrangement. An overhead carriage carries a vertical member and an arm with jaws, giving the later control discussion a concrete mechanical body rather than an unexplained schematic.",
  ],
  9: [
    "The carriage motor drives a toothed wheel against a toothed track, so longitudinal position comes from travel along the overhead guide. Locking actuators can clamp the carriage after it reaches its selected track location.",
  ],
  10: [
    "Electrical power and command signals are collected via sliding brushes on overhead bus wires, feeding either localized servo motors or an optional onboard positional computer.",
  ],
  11: [
    "A chain or belt raises and lowers the tubular column. Solenoids clamp the column in place once the programmed or limit-switched height is reached.",
  ],
  12: [
    "The second arrangement adds a rotating column below the carriage. A spur gear drives azimuth rotation, while the telescoping and arm parts can be joined in different configurations, which is the source basis for the exhibit's normalized joint coordinates.",
  ],
  13: [
    "The yoke-and-pin joint carries an outward arm and a jaw head. The grant explicitly permits jaws, forks, platforms, magnets, suction, and tools as alternatives, so the two-jaw head is a source figure rather than a claim that every end effector must be a gripper.",
  ],
  14: [
    "The specification permits the illustrated members, arm shapes, lengths, tools, and article-seizing means to vary. That is source support for modular alternatives, not evidence of a particular later deployment or labor outcome.",
  ],
  15: [
    "The source describes the preferred sequence with adjustable limit switches: track travel, vertical motion, base rotation, arm pivot, and jaw opening or closing. Each switch event can stop one motion and start another.",
  ],
  16: [
    "In FIGS. 1 and 2, adjustable linear limit stops are clamped along a longitudinal dovetail slot in the column wall, providing positive physical actuation for bi-stable limit switches.",
  ],
  17: [
    "The source describes the actuator arm riding against an adjustable stop and gives an example in which the resulting switch action stops motor Mz and starts a second motor. It does not provide a timing or relay-performance model.",
  ],
  18: [
    "The circular joint arrangement translates selectable actuator positions into selected relative-rotation limits. Moving an actuator changes the position where the switch operates; that is the normalized independent-claim probe in the shared visual.",
  ],
  19: [
    "The account explains that adjusted stops define different limits of travel or rotation. It presents that arrangement as avoiding a complex computer or contour-control means for the selected automatic operation, without quantifying setup work or performance.",
  ],
  20: [
    "The rotary-joint detail includes conductive rings and brushes for electrical connection across the illustrated assembly. The source gives the topology but no current rating, contact resistance, life, or continuity-performance measurement.",
  ],
  21: [
    "The pivot joint uses a bevel gear around a partial circular sector. Its removable stops set two angular limits. The display uses normalized angles and only the source-printed approximately 240-degree gear sector, not invented link dimensions or servo dynamics.",
  ],
  22: [
    "Figure 7 assigns forward, stop, and reverse commands to each motor. The important control idea is a discrete handoff: an activated limit switch ends one action and can energize the next one in the cycle.",
  ],
  23: [
    "The described control diagram uses forward, stop, and reverse command paths. The reading treats them as source-described control relationships and does not infer a particular latch circuit, pulse duration, or electrical response time.",
  ],
  24: [
    "The forward sequence moves the carriage rightward until stop Sx2 triggers vertical descent, followed by column rotation upon hitting limit Sz2.",
  ],
  25: [
    "Azimuth stop 36a energizes the arm pivot motor MA1, driving the limb downward until stop 59b triggers gripper motor MJ to grasp the workpiece.",
  ],
  26: [
    "The return sequence reverses the motion chain and opens the jaws at the release position. The condition of an article is represented only as a normalized source-described grasp state because neither mass nor jaw force is in the grant.",
  ],
  27: [
    "The alternative circuits let an operator omit the carriage, vertical, or base-rotation stage. This demonstrates that the claimed arrangement is adjustable as a sequence of selected motion branches, not a mandate to move every axis in every cycle.",
  ],
  28: [
    "Lemelson also proposes remote switching, card or tape input, equally spaced indexing features, and preset counters. These are alternatives for choosing an event boundary; they do not turn the source into an account of later numerical-control architecture.",
  ],
  29: [
    "The closing description preserves the patent boundary. The alternate head may inspect or perform a work operation, but the exact legal scope is set by the numbered claims that follow.",
  ],
};

export const lemelsonAdjustableManipulatorArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e7be38b9f72cba77958ddab0422e147a6947056e4d51dddc7559508723cbdf34",
  preparedBy: "Classic Patents editorial agent (SapphireElm)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent Office",
        "3,260,375",
        "Jerome H. Lemelson, 8B Garfield Apts., Metuchen, N.J.",
        "ADJUSTABLE MANIPULATOR",
        "Filed Jan. 14, 1963, Ser. No. 251,411",
        "17 Claims. (Cl. 214–1)",
        "Patented July 12, 1966",
      ],
    },
    p(
      "This invention relates to automatic article manipulation apparatus and is a continuation-in-part of my application entitled Automatic Conveying Apparatus, Serial No. 477,467, which was filed on December 24, 1954, and now abandoned.",
    ),
    p(
      "This invention is particularly concerned with article manipulation apparatus and tooling which is automatically controllable in a predetermined cycle of operative movements to perform many different functions associated with manufacturing operations which would ordinarily require the labor of one or more human beings. Heretofore, article manipulation apparatus has consisted of specialized, inflexible equipment designed and developed to perform a particular work tool or article manipulation function automatically. Other article manipulation devices have been developed since the filing of my aforementioned parent application, Ser. No. 477,467, now abandoned, and are illustrated in said application which are programmable by means of presettable means or command signals generated from recordings. However, such apparatus is relatively complex and costly since it involves, in addition to variable controls, feedback control elements, motor speed and braking controls and a programming means or positional computer. Accordingly, it is a primary object of this invention to provide a new and improved article or tool manipulating apparatus which is adjustably controllable and is relatively simple in structure.",
    ),
    p(
      "Another object is to provide a manipulating apparatus of new design having a modular structure which may be easily varied both as to the physical dimensions of the apparatus and its automatic operation. Another object is to provide a manipulating apparatus for articles or tools capable of automatic recycling movements which may be cyclically varied without resort to a programming device. Another object is to provide an article manipulation apparatus which is cyclically operative to perform various movements in a given realm by means of a plurality of limit switches and positionably variable means for actuating said limit switches. Another object is to provide an improved variable control system for article and tool manipulation apparatus which is cyclically operative by means of limit switches and does not require a programming means. Another object is to provide an improved structure in a manipulator joint including means for electrically controlling the relative movement of components of said joint. Another object is to provide an improved means for controlling the rotation of a manipulator arm relative to a base or second arm.",
    ),
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 1, 2, and 2′",
      title: "Overhead manipulator, arm, jaw head, and vertical stop",
      description: [
        figure(1, "FIGS. 1, 2, and 2′"),
        { kind: "text", text: ", source drawing sheet 1 of 3." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGS. 3–6",
      title: "Rotary base, stop track, and bevel-gear joint",
      description: [
        figure(3, "FIGS. 3–6"),
        { kind: "text", text: ", source drawing sheet 2 of 3." },
      ],
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIG. 7",
      title: "Sequential forward, stop, and reverse control",
      description: [figure(7), { kind: "text", text: ", source drawing sheet 3 of 3." }],
    },
    p(
      figure(1),
      " is a partial view with parts broken away for clarity of a manipulation apparatus suspended from an overhead track; ",
      figure(2),
      " is a side view of a manipulation apparatus which is a modification of that illustrated in ",
      figure(1),
      "; ",
      figure(2, "FIG. 2′"),
      " is a fragment of a sectional view taken through the manipulator arms of ",
      figure(1),
      "; ",
      figure(3),
      " is a partial view of a manipulation apparatus of the type shown in ",
      figure(2),
      " showing parts broken away and exploded for clarity; ",
      figure(4),
      " is a sectional view showing a fragment of part of the apparatus of ",
      figure(3),
      "; ",
      figure(5),
      " is a partially sectioned view of a rotary manipulator joint of the type illustrated in ",
      figure(2),
      "; ",
      figure(6),
      " is a partially sectioned view of the joint of ",
      figure(5),
      "; and ",
      figure(7),
      " is a schematic diagram of control means for apparatus of the type illustrated in ",
      figure(1, "FIGS. 1–6"),
      ".",
    ),
    p(
      figure(1, "FIGS. 1"),
      " and ",
      figure(2, "2"),
      " illustrate details of two arrangements of an automatic article manipulation apparatus or tool, certain portions of which form part of this invention and are illustrated in the other drawings. Part of a typical automatic production apparatus 20 is shown in ",
      figure(1),
      " and application of certain of the features of the apparatus of ",
      figure(1),
      " to an automatic article manipulator apparatus 20′ is shown in ",
      figure(2),
      ". The apparatus comprises an overhead support or trackway 21 along which a tool or manipulator may be conveyed by means of a carriage 22 and a plurality of movable linkages or arms.",
    ),
    p(
      figure(1, "In FIG. 1"),
      " a first arm or column 23 is integrally secured to the overhead carriage 22 and supports a plurality of components including a second arm 23′ which is a tubular cylinder adapted for vertical movement through the bore 23B of the column 23. A plurality of wheels 24, 24′ are supported in bearing by formations 22′ defining sidewall portions of the carriage 22 and ride along the lower cylindrical portion 21′ of the overhead track 21 for movement of the carriage assembly therealong. A reversible electrical gear motor Mx is secured to the sidewall of the carriage 22 and has its output shaft driving a toothed wheel 26 which engages a toothed track 26′ cut in the lower surface of the portion 21′ of overhead track 21. Thus by controlling the operation of motor Mx, the position of the carriage 22 and its manipulator or tool assembly may be predetermined along track 21 for performing predetermined operations on work-in-process which is prepositioned or which follows a predetermined path relative to the overhead track.",
    ),
    p(
      "Electrical power for the servo motors associated with the assembly 20 or 20′ is derived from overhead wires 28 which are insulatedly supported off the overhead track and are swept by respective electrical brushes or sliding elements 27 which are insulatedly supported off the carriage 22 and extend to respective of the servo motors to be controlled or to a ",
      term(
        "positional computing mechanism",
        "Period control terminology",
        "The named mechanism is a contemporary expression for apparatus that stores or determines position-related commands; it does not establish the capabilities of a modern digital computer.",
      ),
      " CO located in a housing CD which is shown mounted along the side wall of the column 23. Thus signals transmitted along the overhead wires may be utilized to preset or otherwise control the positional computer CO as well as to supply electrical energy for the operation of said computer and the servo motors to be described. Notation B refers to steel balls mounted within receptacles in the wall of the carriage 22 to provide rolling engagement with the cylindrical portion 21′ of the overhead track to simplify the movement of 22 therealong. Notation 25 refers to ",
      term(
        "lineal actuators",
        "Period control terminology",
        "Here the phrase names devices that project an actuating arm against the track wall to lock the carriage; it is not a specification of actuator type, force, or travel.",
      ),
      " or servos mounted against the side walls of the overhead carriage 22 which, when activated, are adapted to project their respective actuating arms to engage the wall of the track and to lock the carriage in position.",
    ),
    p(
      "A reversible gear motor Mz is shown secured to the side wall of column 23 and has a pulley or sprocket wheel 30 secured to its output shaft. A drive belt or chain 31 loops over the sprocket 30 and around a second pulley or sprocket 32 which is supported for rotation within the upper end of the column 23′. The drive chain 31 is thus operative to raise and lower column 23′ within column 23 depending on the direction of rotation of the output shaft of motor Mz. Lineal actuators or solenoids 29 mounted on the side wall of 23 are utilized to engage the surface of the column 23′ and to lock it in place when 23′ is in a predetermined vertical position. Notation 33 refers to the wire connecting the locking actuators 29 with the positional computer CO which controls not only the position in which 23′ is stopped and locked but also the degree of operation of the other servos including the locking actuators 25, Mx, Mz and those to be described.",
    ),
    p(
      "Whereas in ",
      figure(1),
      " column 23 is fixed relative to the overhead carriage 22, in ",
      figure(2),
      " the column 23′a is rotationally supported by the overhead carriage. A large spur gear 43 is shown secured to the bottom wall of carriage 22 and the column 23′a is supported on a vertical shaft and bearing. A reversible gear motor MR is secured to the wall of column 23′a near the upper end thereof and has a small spur gear 44 secured to its output shaft and engaging the teeth of gear 43. Thus as motor MR operates, the column 23′a and the assembly therebelow will rotate in a direction depending on the direction of rotation of the output shaft of motor MR. In ",
      figure(2),
      " a second cylindrical column 23′b is longitudinally movable within the bore of column 23′a and has a flange 23′F secured to the end thereof. A third column 23″ having an upper flange 23″F is secured to the column 23′b by retaining the two flanges together with fasteners. Thus various assemblies, arms and fixtures may be secured to the end of column 23′b depending on the operation to be performed by the apparatus 20′.",
    ),
    p(
      "The other end of column 23″ is provided with a yoke formation 53, shown in detail in ",
      figure(5, "FIGS. 5"),
      " and ",
      figure(6, "6"),
      ", which supports a pin or shaft 60 on which is rotationally supported a gear plate 57 which is secured to a further arm assembly including jaw means 87 at the end thereof for seizing and releasing an article. Notation 50 refers to the entire joint assembly, which will be described, and 35 to the manipulator assembly extending outward from said joint assembly. Assembly 35 comprises a first arm 35′ of cylindrical tubular shape, a flange 35F at the end thereof, a second arm 85 having a flange 86 and rotationally supported at the end of 35′ is secured to a jaw assembly 80 which includes openable and closable jaws 87a and 87b. The jaws 87a and 87b are pivotally mounted on pin 80P supported at the end of a base 83 secured to arm 85 and are operated by respective servos or a single servo through linkages 84.",
    ),
    p(
      "The apparatus illustrated in ",
      figure(1, "FIGS. 1"),
      " and ",
      figure(2, "2"),
      " is subject to a substantial degree of variation. By providing simple assembly and disassembly means for the joints defined between components 23, 23′, 23′a, 43, 23′, 23′b, 35′, 85, 35′ and the jaw assembly base 83 and 85, it is easily seen that devices and assemblies of the various configurations may be fabricated by varying the shape, length and configurations of said arms and the type of tool or article seizing means secured to the assembly. The jaws or other manipulation means defining the end of the manipulator assembly may be replaced with means for retaining an article by gravity such as forks or a platform protruding from one of the illustrated arms. Magnetic, suction or other forms of article seizing or handling means may also replace the jaws illustrated in ",
      figure(2),
      " as may a variety of different power operated devices designed to perform an operation or transfer function relative to work-in-process.",
    ),
    p(
      "As stated, in a preferred mode of operation, the apparatus of ",
      figure(1, "FIGS. 1"),
      " and ",
      figure(2, "2"),
      " may be operated solely by the actuation of a plurality of limit switches and adjustable actuation means associated with the various manipulator arms. In other words, limit switch control means may be utilized not only to effect the controlled movement and prepositioning of the carriage 22 to a predetermined location along the overhead track 21 but also to effect the degree of downward and upward movement of the column 23′a within column 23, the degree of rotation of the column 23 below the carriage 22, the degree of rotation of the first manipulator arm 35′ relative to column 23″ in a first direction and its return in the opposite direction, the degree of rotation of the manipulator arm or base 85 relative to the arm 35′ in a first direction and its return to a starting or home position and the sequencing and degree of opening and closing of the jaws 87a and 87b of the article seizing means 80 at the end of arm 85.",
    ),
    p(
      "In ",
      figure(1, "FIGS. 1"),
      " and ",
      figure(2, "2 "),
      term(
        "adjustable limit defining means",
        "Claim terminology",
        "This phrase describes elements whose selected positions set where a relatively moving part actuates a limit switch; it does not itself state a dimensional tolerance or control accuracy.",
      ),
      " is provided for activating a limit switch 54 which is shown secured to the lower portion of the column or arm 23′a and has an actuator arm 54′ extending in the direction of the column 23′. The column 23′ is shown in ",
      figure(1, "FIGS. 1"),
      " and ",
      figure(2, "2"),
      " as having an elongated channel or slot 23S provided in the side wall thereof and extending along a substantial portion of the length of 23′ parallel to its longitudinal axis. Two stops 59′, which are operative upon respective upward and downward movement of column 23′, cause actuation of the limit switch actuator arm 54′ to activate said switch. Each wall of the slot is indented as illustrated at 23′S providing respective channels in which the rectangular stop 59′ is slidably movable up and down the column 23′. A threaded hole 59H extends through 59′ and a threaded screw 59″ having a conical nose is threaded to engage in said hole. A pin 59′P is forced against the inside wall of the channel when the slotted-head fastener 59″ engages the tapered rear face of 59′P, thereby locking the limit switch actuator 59′ in a selected position along the longitudinal slot 23S.",
    ),
    p(
      "The arm 54′ of the limit switch 54 is preferably rounded or contains a wheel at its end which is positioned to ride against the exposed upward face of the block 59′ when column 23′ moves upward to close contacts of the limit switch 54 which action is operative to stop the motor Mz and start a second motor such as that located with column 23″ for rotating arm 35 relative thereto. Limit switch control of the downward movement of column 23′ relative to 23 is effected by a second block similar to 59′ and located at some predetermined position along the upper portion of the slot 23S. The means illustrated in ",
      figure(4),
      " or other means such as a proximity switch or limit switch operating by means of photoelectrically scanning adjustable indicia or reflective markers replacing the physical stops may also be applied.",
    ),
    p(
      figure(3, "FIG. 3"),
      " is a partially exploded view showing details of a rotatable joint assembly such as that defined between components 23′a and carriage 22 or arms 35′ and 85. A limit switch 54 is secured to the plate 22′ and has an actuator arm 54′ extending downward through an opening therein. The switch 54 is a mono-stable switch in which the arm 54′ is spring-urged to a center-neutral position until it is urged in either of two directions to close either of two sets of contacts or a single pair of contacts, depending on the control to be effected. The degree of rotation of the assembly defined by column 23′a is controlled by respective stops 36a and 36b, each of which is adjustably positionable around a track 45 defined between an outer portion 43′ of the gear plate 43 which is secured to the upper end of 23′a and an inner portion or plate 43″. The position of the stops 36a and 36b define respective limits of rotation of the column 23′a since stop 36a will actuate the arm 54′ of the limit switch 54 during rotation of the column in a first direction and stop 36b will actuate said limit switch arm during rotation thereof in a second direction.",
    ),
    p(
      "By making the stops 36a and 36b adjustable to define different limits of travel or rotation of the manipulator assembly relative to the overhead carriage, the assembly and tool or manipulator thereof may be prepositioned at different locations in space for performing many different operations relative to different types of work-in-process or articles. Thus, a complex computer or contour control means will not be necessary for the automatic operation of the apparatus and its performance to meet various product handling requirements. ",
      figure(4, "FIG. 4"),
      " illustrates details of means for adjustably positioning and locking the stop-members 36 relative to the circular gear member 43. The gear member 43 is shown as comprising a base plate 43a to which is welded an outer ring 43′ and an inner disc 43″ in spaced apart relation leaving a channel 45 therebetween. The stop element 36 consists of a threaded shank 37 and a head 36 of enlarged diameter which retains said element against the inside face of the circular opening 46. A nut 38 threads on the shank 37 and locks the element 36 in place when tightened against the outer faces of plates 43′ and 43″.",
    ),
    p(
      "Electrical connections across such a rotary joint may be effected by means of one or more circular, flat conducting strips such as 67 and 68 shown in ",
      figure(3),
      " and insulatedly mounted against the upper face of gear plate 43′ which conducting strips are engaged by brush elements 69 which are insulatedly supported near the peripheral border of the flat plate 22′. The flat elements 67, 68 are connected to respective electrical wires which extend to the various controls and power inputs to the servo motors or electrically operated devices secured to the assembly defined by arm 23′a.",
    ),
    p(
      figure(5, "FIGS. 5"),
      " and ",
      figure(6, "6"),
      " illustrate details of a rotary joint such as that defined by the notation 50 in ",
      figure(2),
      ". Whereas the rotary joint of ",
      figure(3, "FIGS. 3"),
      " and ",
      figure(4, "4"),
      " is defined by a rotational axis which is parallel to the longitudinal axes of at least one of the members, the joint 50 is defined by a rotational or pivotal axis which is substantially normal to the longitudinal axes of the arm members 23″ and 35′. Secured to the end of arm 23″ is a fixture 51 defining yoke members 52 and 53 which support a pin or axle 60. Secured to the end of the other arm member 35′ is a fixture 56 including a disc-shaped base 56′ which defines a semi-circular bevel gear having gear teeth G2 cut therein around approximately 240 degrees of the circularly shaped end portion of 57. A reversible gear motor MRA has a small bevel gear G1 which engages the teeth of the gear formation G2 for rotating the arm assembly 35 about the axis of shaft 60. Control of the degree of rotation of 35′ relative to 23″ is effected by limit-defining stops 59a and 59b which actuate the arm 54′ of the limit switch secured against the end of arm 23″.",
    ),
    p(
      figure(7),
      " illustrates an electrical block diagram and includes control components of a typical adjustable manipulator having the electro-mechanical features hereinabove described. Power supplies are not illustrated in ",
      figure(7),
      " in order to simplify the diagram but it is assumed that the correct source of electrical energy is provided on the correct side of all switches and motor controls. The diagram provided in ",
      figure(7),
      " is intended to be only illustrative of a possible system employing single motors Mx, Mz, MR1, MA1 and MJ. The latter motor MJ is representative of that motor or servo which is operative to activate the product handling fixture such as the jaws 87 of ",
      figure(2),
      " or any other suitable device replacing same for seizing or grasping and releasing an article to be manipulated by the apparatus. Certain of the motors illustrated in ",
      figure(7),
      " may be eliminated or may be multiplied in number depending on the particular mechanical aspects of the apparatus.",
    ),
    p(
      "The notations F, S, and R shown associated with each of the power devices or motors refer respectively to pulse activated controls for said motors which, upon receipt of a control pulse or signal of extended duration from a respective limit switch, will respectively cause the motor to operate in driving the component or assembly coupled thereto in a first direction, stop and reverse. Motor Mx is operative to drive the entire manipulator along a guide or track between limits defined by adjustable switch activating means. The blocks referred to by the general notations SW refer to either single limit switches or pairs of limit switches having two switching positions illustrated within the block and referred to by the general notations S. For example, the switch SWx is secured to the overhead carriage 22 and is a bi-stable switch with a central neutral position to which its actuator arm normally returns when not depressed by a pin or stop secured to the overhead track.",
    ),
    p(
      "In movement along the track from left to right in the direction of the arrow A, a first set of contacts referred to by the notation Sx2 is closed when the actuator of switch SWx engages the adjustable stop which defines the rightward limit of travel of carriage 22 or manipulator assembly. Motion in direction A may be initiated by pulsing the forward control F of Mx by closing or activating a switch 70 adapted to transmit a pulse thereto. When switch SWx becomes energized, contacts Sx2 generate a control signal which is transmitted both to the stop control S of Mx and the forward control F of Mz, thereby starting the latter motor to cause the assembly including column 23′ to be driven downward relative to 23. Downward movement continues until contacts Sz2 of limit switch SWz become activated by the uppermost stop pin located in column 23′. A pulse then stops Mz and starts the forward drive of MR1, causing rotation of the manipulator assembly below the overhead carriage.",
    ),
    p(
      "Thereafter, a pin such as 36a, adjustable relative to a fourth limit switch SWR, contacts the actuator arm of the switch, causing contacts SR2 to close and generate a control signal transmitted to the stop control S of MR1 and the forward drive control F of MA1. Motor MA1 thereafter drives assembly 35 in pivotal action about the joint pivot until an adjustable pin such as 59b engages and deflects the actuator arm of a limit switch SWA. Contacts SA2 of SWA are thereby closed and a pulse is transmitted to the stop control S of MA1 and the closure control F of the motor MJ closing the jaws 87 against the article. The output of contacts Sj2 of switch SWJ is also passed to the reverse drive control R of MA1, causing limb assembly 35 to be driven in the reverse direction until the other limit thereof is attained, whereupon contacts SA1 cause MA1 to stop and MR1 to reverse.",
    ),
    p(
      "Operation of rotary joint motor MR1 in reverse eventually results in closure of contacts SR1 of switch SWR which simultaneously energizes the stop control S of MR1 and the reverse drive control R of motor Mz. Energizing R of Mz causes upward movement of the column 23′ and the assembly therebelow relative to upper column 23 until contacts Sz1 are closed when the upper stop provided in slot 23S deflects the actuator of limit switch SWz. The output of Sz1 stops Mz and starts travel of the entire manipulator leftward along overhead track 21. Movement continues until contacts Sx1 of SWx are closed by a pin or stop defining the leftward limit; that signal stops Mx and opens the jaws to release the article at the selected spatial location. The described cycle is repeated when cycle switch 70 next becomes activated.",
    ),
    p(
      "A plurality of other circuits and switches are illustrated in ",
      figure(7),
      " for rendering the control-system and the manipulator apparatus more flexible in operation. The carriage motor Mx may be removed from a particular cycle so the column moves first. The vertical and carriage motors may both be omitted while the rotary joint motor begins a cycle. The column assembly may be held fixed relative to the overhead carriage while the remaining arm, pivot, vertical, and seizing motions operate. Switches may connect or disconnect the respective contacts from individual motor controls, and if the switches are bi-stable solenoid operated electro-mechanical or solid state switching devices, they may be remotely selectively opened and closed by an operator or by an automatic programming means such as a card or tape reading apparatus.",
    ),
    p(
      "In a further mode of automatic control, the limit stop means illustrated in ",
      figure(2, "FIGS. 2′"),
      " and ",
      figure(3, "3–6"),
      " may be eliminated provided that means are provided for activating the particular limit switch or scanning relay with predetermined degrees of lineal movement or rotation of one component or assembly relative to the other. An electro-mechanical limit switch actuator may be deflected with predetermined equal increments of rotation or lineal motion by riding into and out of indentations defined by equi-spaced holes or serrations. Each motor may thus be controlled by a predetermining controller such as a presettable counter of the self-resetting type which generates a control pulse upon uncounting in either or both directions. Diodes 76-1, 76-2, 77-1, 77-2, and 78 permit a control pulse to pass in only one direction so a pulse travelling in the opposite direction will not energize a servo control beyond the diode. A manually operative knife switch 79 can recycle the apparatus.",
    ),
    p(
      "In a modified form of the invention, the article seizing means of the manipulator such as jaw head 70 may be replaced by a head having a tool, scanning device or other mechanism associated with assembly, inspection or any intermittently operative work performing function. The article seizing means 80 illustrated in ",
      figure(2),
      " may be replaced by a suitable servo operated device operative to inspect or otherwise perform on a workpiece which is prepositioned relative to the apparatus when the article sensing relay 70 of ",
      figure(7),
      " becomes energized. An automatic, adjustable apparatus is thus provided which is applicable to many automation functions without the need for complex automatic control apparatus such as recording or numerical control means. It is to be understood that the above-described arrangements are illustrative of the application of the principles of the invention. Numerous other arrangements may be devised by those skilled in the art without departing from the spirit and scope of the invention.",
    ),
    { kind: "heading", level: 2, text: "I CLAIM:" },
    claim(
      1,
      "A rotatable assembly for use in article manipulators and the like comprising in combination with a first assembly including manipulator elements, a second assembly including a carriage, guide means for guiding said carriage along a predetermined path, first power means for driving said carriage along said predetermined path, rotational coupling means between said second assembly and said first assembly, second power means for rotating said first assembly on said second assembly about a predetermined rotational axis, means for controlling said power means and starting and stopping movement of said carriage along said predetermined path, and rotation of said first assembly between selectively predetermined positions, said control means including first limit switch means and cooperating actuator means, one of which is mounted on said carriage and movable therewith and the other of which is mounted along said predetermined path of carriage travel, such that said first limit switch means is activated upon a selectively predetermined extent of movement of said carriage along said predetermined path, said first limit switch means operatively connected to said first and second power means for stopping the movement of said carriage and permitting the rotational movement of said arm assembly upon the actuation thereof, second limit switch means mounted on one of said assemblies, a plurality of cooperating actuation means mounted on the other assembly in positions to activate said second limit switch means upon rotation of said rotatable assembly to selectively predetermined positions relative to each other when said first assembly rotates on said second assembly whereby said first assembly is stopped at selectively predetermined rotational angles relative to said second assembly as defined by said actuator means when activating said second limit switch means.",
    ),
    claim(
      2,
      "An assembly in accordance with claim 1, said actuation means comprising a plurality of separate switch actuators disposed along a circular path centering at said rotational axis.",
    ),
    claim(
      3,
      "An assembly in accordance with claim 2, said switch actuation means being positionally adjustable on said other assembly to a plurality of different angular locations whereby said first assembly may be controlled in rotation on said second assembly to stop in a plurality of different attitudes relative thereto.",
    ),
    claim(
      4,
      "An assembly in accordance with claim 3, said switch actuation means comprising a plurality of elements which are respectively positionable at different angular locations about said axis of rotation for predetermining the annular location and the degree of movement of said first assembly on said second assembly at the end of each part of a positional cycle.",
    ),
    claim(
      5,
      "A rotatable assembly for use in article manipulators and the like comprising in combination with a first assembly including manipulator elements, a second assembly including a carriage, guide means for guiding said carriage along a predetermined path, power means for driving said carriage along said predetermined path, rotational coupling means between said second assembly and said first assembly, power means for rotating said first assembly on said second assembly about a predetermined rotational axis, means for controlling said power means and starting and stopping rotation of said second assembly between selectively predetermined positions, said control means including limit switch means mounted on one of said assemblies, a plurality of cooperating actuator means mounted on the other assembly in positions to activate said limit switch means upon rotation of said rotatable assembly to selectively predetermined positions relative to each other when said first assembly rotates on said second assembly whereby said first assembly is stopped at selectively predetermined rotational angles relative to said second assembly as defined by said actuator means when activating said limit switch means, said actuator means comprising a plurality of separate switch actuators disposed along a circular path centering at said rotational axis, said switch actuator means being positionally adjustable on said other assembly to a plurality of different angular locations whereby said first assembly may be controlled in rotation on said second assembly to stop in a plurality of different attitudes relative thereto, said switch actuator means comprising a plurality of elements which are respectively positioned at different angular locations about said axis of rotation for predetermining the annular location and the degree of movement of said first assembly on said second assembly at the end of each part of a positional cycle including a switch actuator plate mounted on said first assembly adjacent said limit switch means, a circular formation in said plate centering at the axis of rotation of said assemblies and means for slidably engaging said plurality of actuator means within said circular formation for radially prepositioning each actuator means on said plate.",
    ),
    claim(
      6,
      "An assembly in accordance with claim 5, said limit switch means comprising at least one electro-mechanical limit switch mounted on said second assembly offset from the axis of rotation and having an actuator arm disposed to become actuated by each of said actuator means upon rotation of said first assembly relative to said second assembly.",
    ),
    claim(
      7,
      "An assembly in accordance with claim 6, said actuator means comprising a plurality of actuator pins each provided with means for removably securing it to said switch actuator plate against the circular formation therein.",
    ),
    claim(
      8,
      "A rotatable assembly for use in article manipulators and the like comprising in combination with a first assembly including manipulator elements, a second assembly including a carriage, guide means for guiding said carriage along a predetermined path, power means for driving said carriage along said predetermined path, rotational coupling means between said second assembly and said first assembly, power means for rotating said first assembly on said second assembly about a predetermined rotational axis, means for controlling said power means and starting and stopping rotation of said second assembly between selectively predetermined positions, said control means including limit switch means mounted on one of said assemblies, a plurality of cooperating actuator means mounted on the other assembly in positions to activate said limit switch means upon rotation of said rotatable assembly to selectively predetermined positions relative to each other when said first assembly rotates on said second assembly whereby said first assembly is stopped at selectively predetermined rotational angles relative to said second assembly as defined by said actuator means when activating said limit switch means, said limit switch means comprising a bistable limit switch mounted on one of said assemblies and having an actuator arm which is positioned to become actuated by a first of said actuator means upon rotation of said first assembly on said second assembly to a first position to close a first set of contacts, means operatively connected to said limit switch for stopping said first assembly at said first position, control means for causing movement of said first assembly to a further position, actuator means at said further position for operating said actuator arm to close a further set of contacts, and further means operatively connected to said limit switch further set of contacts for stopping said assembly at said further position.",
    ),
    claim(
      9,
      "A joint for an automatic manipulator comprising in combination with a first joint member, a second joint member pivotally secured to said first joint member for rotation about a predetermined axis, power means secured to said first joint member and operatively coupled to the second joint member for rotating it relative to said first member, means for controlling said power means to operate said joint, means activating said control means to control movement of said second joint member through a selectively predetermined arc from a first position at one selectable limit of said arc to a second position defined at another selectable limit of said arc, said activating means including a limit switch means mounted on one of said joint members offset from the axis of rotation of said joint, said limit switch being operatively connected to said control means for said power means and operative to activate said control means to stop movement of said second joint member upon the activation of said limit switch, a plurality of switch activating means offset from said axis and secured to the other of said joint members for cooperatively engaging said limit switch means, said switch activating means comprising first activating means disposed for activating said switch upon positioning said first and second joint members at said first selectable limit of relative rotation along said arc to stop said second joint member thereat, and second activating means also disposed on said other joint member for activating said switch and stopping said joint members upon relative positioning of said joint members at said second selectable limit of said arc.",
    ),
    claim(
      10,
      "A manipulator joint in accordance with claim 9, said limit switch having an actuator arm projecting outward from the joint member on which said switch is mounted, said switch actuation means comprising respective index members having respective surfaces adapted to urge movement of said limit switch actuator upon movement of said joint members to respective limits of said arc.",
    ),
    claim(
      11,
      "A manipulator joint in accordance with claim 9, each of said switch activating means being adjustably positionable at different locations in a circular path adjacent said joint axis whereby the limits of rotation of said second joint member may be changed to vary the degree said members may be automatically rotated relative to each other and predetermine the rotational coordinates.",
    ),
    claim(
      12,
      "A manipulator joint in accordance with claim 11, said joint including a shaft defining said rotational axis, said switch activating means comprising a plurality of pins, a plate defining part of said second joint member, said shaft extending through said plate and substantially normal thereto, a circular slotted hole in said plate and concentric with said shaft, and means associated with said pins for removably securing each along any portion of said slotted hole whereby the end of each pin projects into the path of the actuator arm of said limit switch and is operative to move said arm and cause actuation of the switch upon engagement therewith.",
    ),
    claim(
      13,
      "Article manipulation apparatus comprising in combination with a support, a mechanical arm assembly rotationally mounted on said support, first power means for moving said arm assembly in linear translation and second power means for moving said arm assembly in azimuth rotation with respect to said support, article seizing means mounted on said arm assembly, third power means for said article seizing means adapted to operate said seizing means for retaining and releasing articles, positional control means comprising first and second limit switch means and cooperating first and second switch activating means mounted on various parts of said arm assembly, said first limit switch means and its cooperating switch actuating means mounted on parts of said arm assembly which are linearly translated relative to each other by said first power means, such that said first switch actuating means is in the scanning path of said first limit switch means and engages said first limit switch means upon preselectively determined movement of said linearly translated parts, said second limit switch means and its cooperating switch actuating means mounted on parts of said arm assembly which are azimuth rotated relative to each other by said second power means, such that said second switch actuating means is in the scanning path of said second limit switch means and engages said second limit switch means upon preselectively determined movement of said azimuth rotated parts, at least one of said switch actuating means having at least two positionally adjustable limit defining means in the scanning path of its respective limit switch means for activating said switch when the respective relatively movable parts of said apparatus are at predetermined limits of their travel, each of said first and second limit switch means being operatively connected for activation of its respective power means to drive said arm assembly and said article seizing means between the limits defined by the limit switch actuation and in predetermined coordination with said sequence of motions.",
    ),
    claim(
      14,
      "Article manipulation apparatus comprising in combination with a support, a mechanical arm assembly rotationally mounted on said support, first power means for moving said arm assembly in linear translation and second power means for moving said arm assembly in azimuth rotation with respect to said support, article seizing means mounted on said arm assembly, third power means for said article seizing means adapted to operate said seizing means for retaining and releasing articles, positional control means comprising first, second and third limit switch means and cooperating first, second and third switch activating means mounted on various parts of said arm assembly, said first limit switch means and its cooperating switch actuating means mounted on parts of said arm assembly which are linearly translated relative to each other by said first power means, such that said first switch actuating means is in the scanning path of said first limit switch means and engages said first limit switch means upon preselectively determined movement of said linearly translated parts, said second limit switch means and its cooperating switch actuating means mounted on parts of said arm assembly which are azimuth rotated relative to each other by said second power means, such that said second switch actuating means is in the scanning path of said second limit switch means and engages said second limit switch means upon preselectively determined movement of said azimuth rotated parts, said third limit switch means and its cooperating switch actuating means mounted on parts of said article seizing means which are relatively movable during operation thereof by said third power means, such that said third switch actuating means is in the scanning path of said third limit switch means and engages said third limit switch means upon preselectively determined movement of said relatively movable parts, at least one of said switch actuating means having at least two positionally adjustable limit defining means in the scanning path of its respective limit switch means for activating said switch when the respective relatively movable parts of said apparatus are at predetermined limits of their travel, each of said first, second and third limit switch means being operatively connected for activation of respective ones of said power means to drive said arm assembly and said article seizing means between the limits defined by the limit switch actuation and to seize and release articles in predetermined coordination with said sequence of motions.",
    ),
    claim(
      15,
      "Automatic conveying apparatus comprising in combination, a self-propelled conveyor including a first conveying means, a servo means for driving said first conveying means along a first guide means, said first conveying means having a second guide means secured thereto, said second guide means having a first fixture extending therefrom which is adapted for movement in a fixed path relative to a second guide means, a second servo for driving said first fixture along said fixed path, a second fixture extending from said first fixture and movably mounted thereon to be driven along a predetermined path relative to a third guide means, a third servo means for driving said second fixture, adjustable control means for controlling the operation of said apparatus in a repetitive cycle which comprises a plurality of discrete movements of each of the movable parts of said apparatus which movements include the movement of said first conveying means between two positions on said first guide means, the movements of said first fixture between two positions in its fixed path, and the movement of said second fixture between two positions in its predetermined path relative to said first fixture, the means for controlling said apparatus including a plurality of control switching means adapted to become actuated by the movement of a respective part of said apparatus to each of said positions of travel, the means actuating each of said switching means being connected in circuits with the control means for the servo means driving said apparatus in a manner whereby when a moving part of said apparatus reaches a predetermined position in its travel a control switching means will become energized and will operate to cause one of said servo means to stop and to cause another of said servo means to start, the means actuating said control switching means being adjustable in position to permit changes in the degree and end limits of travel of the conveying apparatus controlled thereby whereby the path of movement of said third fixture may be varied to effect a plurality of different conveying requirements each comprising a cycle of motions which may be automatically repeated a plurality of times, before the means actuating said control switching means is changed.",
    ),
    claim(
      16,
      "Manipulator apparatus including means for seizing and releasing a product, a first arm member retaining said seizing means, a second arm member, said first arm member being rotationally mounted on said second arm member for positioning said seizing means in a plurality of attitudes at different circumferential portions relative to said first arm member, limit switch means mounted on one of said arm members, a plurality of actuation means mounted on the other arm member, first power means operative for rotating one of said arm members relative to the other, and second power means for operating said seizing means, each of said actuator means mounted for movement relative to said limit switch means in a circular path to intersect the actuation means of said limit switch means at predetermined degrees of movement of said arm members relative to each other for defining preselectable travel limits, said limit switch means adapted, when activated by the intersection with said actuator means, for generating a first and second signal, said first signal presenting a stop signal to said first power means for stopping the rotation of said arm members at an arm position defined by a predetermined location of said actuator means, and said second signal presenting a start signal to said second power means for initiating operation of said retaining and seizing means at said predetermined arm position.",
    ),
    claim(
      17,
      "A manipulator joint in accordance with claim 9, further including a reversible motor secured to said first joint member, first gear means secured to the end of said second joint member adjacent said first joint member, said first gear means comprising a plate having a circular shape, said plate having a circular array of gear teeth provided around at least a part of the periphery of said plate, the radial axis of said gear plate corresponding to said predetermined axis of joint rotation, a drive gear secured to the output shaft of said reversible motor, said drive gear having teeth in operative engagement with the gear teeth of said plate whereby operation of said reversible motor will rotate said plate and said second joint member about said predetermined axis, with the limits of said rotation being defined by the selectable engagement of said limit switch means and said switch activating means.",
    ),
  ],
};

/** The canonical legal text lives only in the manual source edition. */
export function lemelsonAdjustableManipulatorClaimText(number: number): string {
  const block = lemelsonAdjustableManipulatorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Lemelson adjustable-manipulator edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
