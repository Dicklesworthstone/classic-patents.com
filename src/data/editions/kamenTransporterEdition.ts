import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const text = (value: string): CuratedSpecificationInlines => [{ kind: "text", text: value }];
const paragraph = (inlines: CuratedSpecificationInlines) => ({
  kind: "paragraph" as const,
  inlines,
});
const p = (value: string) => paragraph(text(value));

const term = (value: string, definition: string, label?: string): CuratedSpecificationInline => ({
  kind: "term",
  text: value,
  definition,
  label,
});

const FIGURES = {
  "1": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
    alt: "Figure 1 from US 5,701,965: perspective view of human transporter assembly in four-wheel support configuration.",
    width: 1306,
    height: 1363,
  },
  "2": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-2-source-crop-v1.png",
    alt: "Figure 2 from US 5,701,965: human transporter operating in two-wheel dynamically balancing inverted pendulum mode.",
    width: 1287,
    height: 1903,
  },
  "3": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-3-source-crop-v1.png",
    alt: "Figure 3 from US 5,701,965: human transporter performing stair ascent via rotating cluster wheel weight transfer sequence.",
    width: 1289,
    height: 1908,
  },
  "4": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-4-source-crop-v1.png",
    alt: "Figure 4 from US 5,701,965: side elevation showing cluster wheel planetary gear drive and central axle rotation.",
    width: 1313,
    height: 1627,
  },
  "5": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-5-source-crop-v1.png",
    alt: "Figure 5 from US 5,701,965: closed-loop control system block diagram with pitch angle, angular velocity, and wheel velocity feedback.",
    width: 1295,
    height: 1992,
  },
  "6": {
    src: "/patents/figures/us-5701965-kamen-transporter/fig-6-source-crop-v1.png",
    alt: "Figure 6 from US 5,701,965: pitch rate gyroscopic sensor assembly and accelerometer sensor fusion architecture.",
    width: 1287,
    height: 1554,
  },
} as const;

const figure = (
  label: string,
  numbers: readonly (keyof typeof FIGURES)[],
): CuratedSpecificationInline => ({
  kind: "reference",
  text: label,
  href: "#",
  referenceType: "figure",
  label: `Preview ${label} from US 5,701,965 source facsimile`,
  figurePreviews: numbers.map((n) => FIGURES[n]),
});

const claim = (number: number, inlines: CuratedSpecificationInlines) => ({
  kind: "claim" as const,
  number,
  inlines,
});

export const kamenTransporterParallelReadings: Readonly<Record<number, readonly string[]>> = {
  4: [
    "The inventors establish the field: dynamic personal mobility devices capable of transporting humans across irregular ground surfaces, curbs, and architectural staircases.",
    "Traditional wheelchairs and carts are physically constrained to level or gently ramped surfaces because static four-wheel stability limits climbable obstacle height.",
  ],
  6: [
    "The background outlines the historical engineering dilemma: prior-art powered wheelchairs prioritized static stability (four widely spaced wheels with low center of gravity), sacrificing maneuverability, ground clearance, and stair-negotiating capability.",
    "Kamen et al. propose shifting from passive static stability to active dynamic inverted-pendulum stabilization.",
  ],
  8: [
    "The summary introduces the core architecture: a human support chassis suspended over ground-contacting members with an integrated motorized drive and closed feedback loop that continuously maintains dynamic balance in the fore-aft pitch plane.",
    "Rather than relying on wide wheelbases to prevent tipping, the control system drives the wheels under the user center of gravity to maintain equilibrium.",
  ],
  9: [
    "The cluster wheel embodiment mounts pairs or triads of wheels on planetary cluster arms that rotate about a central axle, enabling both rolling locomotion and stair-stepping.",
    "Separate motor drives independently actuate wheel spin and cluster arm rotation, coordinated by a supervisory state machine.",
  ],
  11: [
    "The drawing schedule details Figures 1 through 6: the four-wheel support pose (Figure 1), two-wheel elevated balance pose (Figure 2), stair climbing weight transfer cycle (Figure 3), planetary cluster drivetrain (Figure 4), control feedback block diagram (Figure 5), and sensor fusion assembly (Figure 6).",
  ],
  13: [
    "In two-wheel balance mode, the vehicle behaves as an active inverted pendulum. Rate gyroscopes measure angular pitch velocity d(theta)/dt while accelerometers detect gravito-inertial tilt angle theta.",
    "The control loop computes restorative torque tau = K_p * theta + K_d * d(theta)/dt, driving the wheels forward or backward to continuously balance the rider and execute forward locomotion via intuitive user body lean.",
  ],
  14: [
    "For stair climbing, the coordination controller cycles through four deterministic states: (1) start alignment at the stair riser, (2) weight transfer by rotating cluster arms to seat the upper wheel pair on the tread, (3) motorized climbing lift while maintaining dynamic pitch balance, and (4) re-stabilization on the next step.",
  ],
  15: [
    "The specification concludes with 54 numbered claims defining the legal boundaries of the dynamic balance feedback loop, cluster wheel climbing mechanisms, sensor fusion algorithms, and standing scooter embodiments.",
  ],
};

export const kamenTransporterArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65",
  preparedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent [19] Kamen et al.",
        "[11] Patent Number: 5,701,965",
        "[45] Date of Patent: Dec. 30, 1997",
        "[54] HUMAN TRANSPORTER",
        "[75] Inventors: Dean L. Kamen, Bedford; Robert R. Ambrogi, Manchester; Robert J. Duggan, Northwood; Richard K. Heinzmann, Francestown; Brian R. Key, Pelham; Andrzej Skoskiewicz, Manchester; Phyllis K. Kristal, Sunapee, all of N.H.",
        "[73] Assignee: Deka Products Limited Partnership, Manchester, N.H.",
        "[21] Appl. No.: 08/250,693 [22] Filed: May 27, 1994",
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "Drawing sheet: printed title and figure schedule",
    },
    {
      kind: "figure-sheet",
      figureLabel: "FIGURES 1-6",
      title:
        "Personal Transporter, Balancing Dynamics, Cluster Drive, and Sensor Control Architecture",
      description: [
        {
          kind: "text",
          text: "5,701,965. Kamen et al. Human Transporter. Application Filed May 27, 1994. Patented Dec. 30, 1997. ",
        },
        figure("FIG. 1", ["1"]),
        { kind: "text", text: ", " },
        figure("FIG. 2", ["2"]),
        { kind: "text", text: ", " },
        figure("FIG. 3", ["3"]),
        { kind: "text", text: ", " },
        figure("FIG. 4", ["4"]),
        { kind: "text", text: ", " },
        figure("FIG. 5", ["5"]),
        { kind: "text", text: ", " },
        figure("FIG. 6", ["6"]),
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "TECHNICAL FIELD",
    },
    paragraph([
      {
        kind: "text",
        text: "The present invention pertains to devices and methods for transporting human subjects, including those experiencing physical handicaps or incapacitation, and more particularly to devices and methods for transporting human subjects over regions that may include stairs.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND ART",
    },
    paragraph([
      {
        kind: "text",
        text: "A wide range of devices and methods are known for transporting human subjects experiencing physical incapacitation. The design of these devices has generally required a compromise to address the physical incapacity of the users. Stability has been deemed essential, so relative ease of locomotion is generally compromised. It becomes difficult to provide a self-propelled user-guidable device for transporting a physically handicapped individual that has high mobility over irregular ground surfaces, curbs, and stairs.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    paragraph([
      {
        kind: "text",
        text: "There is provided, in a preferred embodiment, a device for transporting a human subject over ground having a surface that may be irregular and may include stairs. This embodiment has a support for supporting the subject. A ",
      },
      term(
        "ground-contacting module",
        "A motorized wheeled or cluster-wheel assembly movably attached to the vehicle chassis to suspend the passenger over ground surfaces.",
      ),
      {
        kind: "text",
        text: ", movably attached to the support, serves to suspend the subject in the support over the surface. The orientation of the ground-contacting module defines fore-aft and lateral planes intersecting one another at a vertical. A motorized drive causes locomotion of the assembly and the subject therewith over the surface. Finally, the embodiment has a control loop, in which the motorized drive is included, for ",
      },
      term(
        "dynamically maintaining stability",
        "Continuous closed-loop control of motor drive torque to stabilize an inverted pendulum chassis about its gravito-inertial plumbline.",
      ),
      {
        kind: "text",
        text: " in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "In another embodiment, each ground-contacting member includes a ",
      },
      term(
        "cluster of wheels",
        "A planetary arrangement of two or more wheels rotatable about a central cluster axle, enabling both rolling locomotion and stair-stepping.",
      ),
      {
        kind: "text",
        text: " mounted to permit complete travel around an axis. A cluster drive controls rotation of each cluster about the central axis, while separate wheel drives control rotation of wheels in contact with the ground, permitting seamless transition between rolling, dynamic balancing on two wheels, and stair-climbing weight transfer.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
    },
    paragraph([
      { kind: "text", text: "In the accompanying drawings: " },
      figure("FIG. 1", ["1"]),
      {
        kind: "text",
        text: " is a perspective view of the human transporter embodiment in four-wheel support mode; ",
      },
      figure("FIG. 2", ["2"]),
      {
        kind: "text",
        text: " is a side elevation of the transporter in elevated two-wheel dynamic balance mode; ",
      },
      figure("FIG. 3", ["3"]),
      {
        kind: "text",
        text: " illustrates the weight transfer sequence utilized by the transporter to climb stairs; ",
      },
      figure("FIG. 4", ["4"]),
      {
        kind: "text",
        text: " is a schematic view of the cluster wheel assembly and planetary drive mechanism; ",
      },
      figure("FIG. 5", ["5"]),
      {
        kind: "text",
        text: " is a block diagram showing the closed-loop inverted pendulum balance control system; and ",
      },
      figure("FIG. 6", ["6"]),
      {
        kind: "text",
        text: " illustrates the sensor assembly including pitch rate gyroscopes and accelerometer tilt transducers.",
      },
    ]),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS",
    },
    paragraph([
      {
        kind: "text",
        text: "The transporter operates fundamentally as an ",
      },
      term(
        "inverted pendulum",
        "An inherently unstable mechanical dynamic system with center of mass above the wheel axle, requiring continuous restorative motor acceleration.",
      ),
      {
        kind: "text",
        text: " in its balance mode. The pitch angle theta and pitch angular velocity d(theta)/dt are monitored continuously by rate gyroscopes and accelerometers. The motorized drive applies a calculated restoring torque tau = K_p * theta + K_d * d(theta)/dt to drive the wheels forward or aft under the rider center of mass, maintaining upright equilibrium while propelling the vehicle in response to user body lean.",
      },
    ]),
    paragraph([
      {
        kind: "text",
        text: "When ascending stairs as illustrated in ",
      },
      figure("FIG. 3", ["3"]),
      {
        kind: "text",
        text: ", the coordination control executes a four-phase cycle: (1) start, balancing on the lower wheel pair adjacent to the stair riser; (2) transfer weight, rotating the cluster to place the upper wheel pair onto the stair tread; (3) climb, driving the upper wheel pair to lift the center of mass up and forward while maintaining dynamic pitch balance; and (4) re-stabilization on the succeeding step tread.",
      },
    ]),
    p("What is claimed is:"),
    claim(
      1,
      text(
        "A device, for transporting a human subject over a surface that may be irregular and may include stairs, the device comprising: (a) a support for supporting the subject, the support having left and right sides and defining fore-aft and lateral planes; (b) a plurality of support members on each side of the a support, each support member being mounted to permit complete travel around an axis and joined to a discrete ground-contacting component, the ground-contacting component having a point of contact with the surface 19 and occupying only a portion of the entire angular distance around the axis; the support and the support members being parts of an assembly; (c) a motorized drive arrangement, mounted to the assembly, coupled to the support members, for causing locomotion of the assembly and the subject over the surface; and (d) a control loop, in which the motorized drive arrange ment is included, for dynamically maintaining stability in the fore-aft plane by operation of the motorized drive arrangement so that the net torque experienced by the assembly about the point of contact with the surface, taking into account torques caused by gravity as well as by all other external forces and by the motorized drive, causes a desired acceleration of the assembly.",
      ),
    ),
    claim(
      2,
      text(
        "A device according to claim 1, wherein the axes of all of the support members are substantially collinear.",
      ),
    ),
    claim(
      3,
      text(
        "A device according to claim 2, wherein each ground contacting component is an arcuate element mounted to its respective support member, each support member being rotatably mounted and motor-driven about a central axis defined by the axes.",
      ),
    ),
    claim(
      4,
      text(
        "A device according to claim 3, wherein the radially outermost extent of each arcuate element has a generally constant main radius of curvature conforming generally with that of a circle having a radius equal to such extent.",
      ),
    ),
    claim(
      5,
      text(
        "A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of the arcuate element near the tip of each leading portion is somewhat smaller than the element's main radius of curvature.",
      ),
    ),
    claim(
      6,
      text(
        "A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of each arcuate element near the tip of its trailing portion is somewhat smaller than such element's main radius of curvature.",
      ),
    ),
    claim(
      7,
      text(
        "A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein the radius of curvature of each arcuate element near at least one of its tips differs from the main radius of curvature.",
      ),
    ),
    claim(
      8,
      text(
        "A device according to claim 4, wherein each arcuate element has a leading portion and a trailing portion deter mined in relation to forward motion of the assembly, the leading portion contacting the ground first during forward motion, each portion having a tip, and wherein at least one of the tips of each arcuate element is deflectably mounted and is coupled to a deflection arrangement, so that on actuation the local radius of curvature may be modified.",
      ),
    ),
    claim(
      9,
      text(
        "A device according to claim 3, wherein the support is proximate to the ground to permit a subject to stand thereon.",
      ),
    ),
    claim(
      10,
      text(
        "A device according to claim 9, further comprising a handle, affixed to the support. having a grip at approximately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
      ),
    ),
    claim(
      11,
      text(
        "A device according to claim , further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
      ),
    ),
    claim(
      12,
      text(
        "A device according to claim 9, further comprising: leaning means for sensingleaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
      ),
    ),
    claim(
      13,
      text(
        "A device according to claim 3, further comprising: drive control means, including the control loop, for driv ing the support members in a first mode wherein a first arcuate element in each group of axially adjacent arcuate elements generally remains in contact with the ground up to a point near in arcuate distance to where the next succeeding arcuate element comes in contact with the ground, and so on as successive arcuate elements come in contact with the ground, so as to provide substantially continuous rolling motion of the device along the arcuate elements.",
      ),
    ),
    claim(
      14,
      text(
        "A device according to claim 13, wherein the drive control means includes means for driving the support mem bers in a second mode to permit ascent and descent of stairs and other surface features.",
      ),
    ),
    claim(
      15,
      text(
        "A device according to claim 14, further comprising: means for causing a second one of the arcuate elements of each group to land on a succeeding surface feature, which may include a step, when a first one of the elements of each group is on a preceding surface feature.",
      ),
    ),
    claim(
      16,
      text(
        "A device according to claim 1, wherein the ground contacting components are wheels and the support members on the left and right sides of the vehicle are in each case coupled so as to provide a cluster of wheels on each of the left and right sides of the vehicle respectively, the wheels of each cluster being capable of being motor-driven indepen dently of the cluster.",
      ),
    ),
    claim(
      17,
      text(
        "A device according to claim 16, wherein the axes of all of the support members are substantially collinear and define a central axis.",
      ),
    ),
    claim(
      18,
      text(
        "A device according to claim 17, wherein the distance from the central axis through a diameter of each wheel is approximately the same for each of the wheels in the cluster.",
      ),
    ),
    claim(
      19,
      text(
        "A device according to claim 17, wherein each cluster has two wheels of substantially equal diameter.",
      ),
    ),
    claim(
      20,
      text(
        "A device according to claim 17, wherein each cluster has three wheels of substantially equal diameter.",
      ),
    ),
    claim(
      21,
      text(
        "A device according to claim 17, further comprising: cluster control means for controlling the angular orienta tion of each cluster about the central axis; and wheel control means for controlling separately, as to the wheels of each cluster, the rotation of wheels in contact with the ground.",
      ),
    ),
    claim(
      22,
      text(
        "A device according to claim 21, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane.",
      ),
    ),
    claim(
      23,
      text(
        "A device according to claim 21, wherein the wheel control means has a slave mode in which the wheels are driven as a function of the rotation of the clusters; and the cluster control means has a lean mode, utilizing the control loop, in which the clusters are driven in such a manner as to tend to maintain balance of the device in the fore-aft plane while the wheels are in the slave mode, so as to permit the device to ascend or descend stairs or other surface features.",
      ),
    ),
    claim(
      24,
      text(
        "A device according to claim 23, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane.",
      ),
    ),
    claim(
      25,
      text(
        "A device according to claim 24, wherein the wheel control means has a transition mode, used in the transition 21 from the slave mode to the balance mode, operative to prevent entering the balance mode until a zero crossing by the clusters has been sensed.",
      ),
    ),
    claim(
      26,
      text(
        "A device according to claim 21, further comprising: coordination control means for coordinating operation of the cluster control means with that of the wheel control means, the coordination control means having a stair climbing mode to cause steps as follows: (1) start, in which the assembly, balanced on a first wheel pair, one from each cluster, is disposed adjacent to a stair and the clusters are then rotated so that a second wheel pair is resting on the stair; (2) transfer weight, in which the weight of the device and the subject is transferred from the lower first wheel pair to the second wheel pair on the stair by motion of the clusters relative to the assembly while the wheels are driven to maintain the position of the clusters relative to the world; (3) climb, in which the second wheel pair is driven to move the device forward to the riser of the succeeding stair while simultaneously the clusters are driven to position the next wheel pair on the tread of the suc ceeding stair, this step being carried out while the wheel control means is in the balance mode; and wherein steps (2) and (3) are alternated until the last stair, at which point normal balance mode of the wheel control means is entered into.",
      ),
    ),
    claim(
      27,
      text(
        "A device according to claim 23, further comprising: slave function adjustment for modifying the function in the slave mode, so that the device may accommodate climbing and descent of stairs and of surface features having varying geometries.",
      ),
    ),
    claim(
      28,
      text(
        "A device according to claim 17, further comprising: a joystickfor use by the subject in controlling direction of the device.",
      ),
    ),
    claim(
      29,
      text(
        "A device according to claim 17, further comprising: leaning means for sensing leaning of the subjectin a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
      ),
    ),
    claim(
      30,
      text("A device according to claim 29, wherein the leaning means includes a forceplate."),
    ),
    claim(
      31,
      text(
        "A device according to claim 29, wherein the leaning means includes a proximity sensor.",
      ),
    ),
    claim(
      32,
      text(
        "A device according to claim 17, wherein the support includes a chair having a seat, hingedly attached to the assembly, so as to have a first position in which the subject may be seated on the seat and a second position in which the subject may stand.",
      ),
    ),
    claim(
      33,
      text(
        "A device according to claim 17, wherein the device has a roll axis and a pitch axis, further comprising: attitude determination means for determining the attitude of the support; attitude control means for controlling the attitude of the support relative to the ground-contacting member.",
      ),
    ),
    claim(
      34,
      text(
        "A device according to claim 23, further comprising: roll adjustment means for permitting adjustment of the angular orientation of the support with respect to the ground-contacting module about an axis approximately parallel to the roll axis of the device, the roll adjustment means controlled by the attitude control means.",
      ),
    ),
    claim(
      35,
      text(
        "A device according to claim 24, further comprising: banking means for causing the roll adjustment means, in the course of a turn, to bank the support in the general direction of turning. 22",
      ),
    ),
    claim(
      36,
      text(
        "A device according to claim 33, further comprising: tilt adjustment means for permitting adjustment of the angular orientation of the support with respect to the ground-contacting module about an axis approximately parallel to the pitch axis of the device, the tilt adjust ment means controlled by the attitude control means.",
      ),
    ),
    claim(
      37,
      text(
        "A device according to claim 17, further comprising: height adjustment means for adjusting the height of the support relative to the ground.",
      ),
    ),
    claim(
      38,
      text(
        "A device according to claim 37, wherein the height adjustment means includes a variable extension between the support and the ground-contacting module.",
      ),
    ),
    claim(
      39,
      text(
        "A device according to claim 17, wherein the support is proximate to the ground to permit a subject to stand thereon.",
      ),
    ),
    claim(
      40,
      text(
        "A device according to claim 39, further comprising a handle, affixed to the support, having a grip at approximately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
      ),
    ),
    claim(
      41,
      text(
        "A device according to claim 39, further comprising: leaning means for sensingleaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
      ),
    ),
    claim(
      42,
      text(
        "A device according to claim 41, further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
      ),
    ),
    claim(
      43,
      text(
        "A device according to claim 1, wherein the support is proximate to the ground to permit a subject to stand thereon.",
      ),
    ),
    claim(
      44,
      text(
        "A device according to claim 43, further comprising: a handle, affixed to the support, having a grip at approxi mately waist height of the subject, so that the device may be operated in a manner analogous to a scooter.",
      ),
    ),
    claim(
      45,
      text("A device according to claim 43, wherein the ground contacting components are wheels."),
    ),
    claim(
      46,
      text(
        "A device according to claim 43 further comprising: leaning means for sensingleaning of the subject in a given direction and for controlling the motorized drive to cause the device to move in the direction in which the subject may lean.",
      ),
    ),
    claim(
      47,
      text(
        "A device according to claim 44, further comprising: a joystick, mounted on the handle, for use by the subject in controlling direction of the device.",
      ),
    ),
    claim(
      48,
      text(
        "A device according to claim 1, wherein the control loop includes means for performing the following steps on a cyclical basis: (1) reading inputs provided by the subject; (2) reading state variable inputs; (3) modifying the program state based upon the state variables; and (4) performing calculations for controlling the motorized drive based on the subject-provided inputs and the state variable inputs.",
      ),
    ),
    claim(
      49,
      text(
        "A device, for transporting a payload over a surface that may be irregular and may include stairs, the device com prising: (a) a support for supporting the payload, the support having left and right sides and defining fore-aft and lateral planes; (b) a plurality of support members on each side of the support, each support member being mounted to permit complete travel around an axis and joined to a discrete ground-contacting component, the ground-contacting component having a point of contact with the surface and occupying only a portion of the entire angular 23 distance around the axis; the support and the support members being parts of an assembly; (c) a motorized drive arrangement, mounted to the assembly, coupled to the support members, for causing locomotion of the assembly and the payload over the surface; and (d) a control loop. in which the motorized drive arrange ment is included, for dynamically maintaining stability in the fore-aft plane by operation of the motorized drive arrangement so that the net torque experienced by the assembly about the point of contact with the surface, taking into account torques caused by gravity as well as by all other external forces and by the motorized drive, causes a desired acceleration of the assembly,",
      ),
    ),
    claim(
      50,
      text(
        "A device according to claim 49, wherein the axes are substantially collinear and define a central axis, and the ground-contacting components are wheels and the support members on the left and right sides of the vehicle are in each case coupled so as to provide a cluster of wheels on each of the left and rightsides of the vehicle respectively, the wheels of each cluster being capable of being motor-driven inde pendently of the cluster.",
      ),
    ),
    claim(
      51,
      text(
        "A device according to claim 49, wherein the axes substantially collinear and each ground-contacting compo 24 nent is an arcuate element mounted to its respective support member, each support member being rotatably mounted and motor-driven about a central axis defined by the axes.",
      ),
    ),
    claim(
      52,
      text(
        "A device according to claim , further comprising: cluster control means for controlling the angular orienta tion of each cluster about the central axis; and wheel control means for controlling separately, as to the wheels of each cluster, the rotation of wheels in contact with the ground.",
      ),
    ),
    claim(
      53,
      text(
        "A device according to claim 52, wherein the wheel control means has a slave mode in which the wheels are driven as a function of the rotation of the clusters; and the cluster control means has a lean mode, utilizing the control loop, in which the clusters are driven in such a manner as to tend to maintain balance of the device in the fore-aft plane while the wheels are in the slave mode, so as to permit the device to ascend or descend stairs or other surface features.",
      ),
    ),
    claim(
      54,
      text(
        "A device according to claim 52, wherein the wheel control means has a balance mode, utilizing the control loop, in which the wheels of each cluster in contact with the ground are driven in such a manner as to maintain balance of the device in the fore-aft plane. k 3 is",
      ),
    ),
  ],
};
