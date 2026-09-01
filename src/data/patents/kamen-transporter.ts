import { kamenTransporterArchivalEdition } from "@/data/editions/kamenTransporterEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = kamenTransporterArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Kamen Transporter manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const kamenTransporterPatent: Patent = {
  id: "us-5701965-kamen-transporter",
  patentNumber: "US 5,701,965",
  title: "Human Transporter",
  shortTitle: "Dean Kamen Self-Balancing Transporter",
  subtitle: "Inverted Pendulum Dynamic Balance, Cluster Wheel Locomotion, and Stair Climbing",
  inventors: [
    "Dean L. Kamen",
    "Robert R. Ambrogi",
    "Robert J. Duggan",
    "Richard K. Heinzmann",
    "Brian R. Key",
    "Andrzej Skoskiewicz",
    "Phyllis K. Kristal",
  ],
  inventorLocation: "Manchester, New Hampshire",
  grantDate: "1997-12-30",
  filingDate: "1994-05-27",
  era: "Information & Digital Age (1950–Present)",
  category: "consumer",
  categoryLabel: "Robotics & Dynamic Stabilization",
  summary:
    "Dean Kamen's foundational 1997 patent for the iBOT mobility system and Segway personal transporter established closed-loop dynamic inverted-pendulum stabilization over a minimal two-wheel contact patch combined with planetary cluster wheels for autonomous stair climbing.",
  heroQuote:
    "A control loop, in which the motorized drive is included, dynamically maintains stability in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.",
  originalPdfUrl: "/patents/pdfs/us-5701965-kamen-transporter.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US5701965A/en",
  usptoClassification: "180/7.1",

  originalTextAsset: {
    url: "/patents/transcripts/us-5701965-kamen-transporter-reviewed.txt",
    pageCount: 48,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65",
  },

  archivalEdition: kamenTransporterArchivalEdition,

  originalText: `There is provided, in a preferred embodiment, a device for transporting a human subject over ground having a surface that may be irregular and may include stairs. This embodiment has a support for supporting the subject. A ground-contacting module, movably attached to the support, serves to suspend the subject in the support over the surface. The orientation of the ground-contacting module defines fore-aft and lateral planes intersecting one another at a vertical. The support and the ground-contacting module are components of an assembly.

A motorized drive, mounted to the assembly and coupled to the ground-contacting module, causes locomotion of the assembly and the subject therewith over the surface. Finally, the embodiment has a control loop, in which the motorized drive is included, for dynamically enhancing stability in the fore-aft plane by operation of the motorized drive in connection with the ground-contacting module.`,

  plainEnglishExplanation: {
    overview:
      "For over a century, personal mobility vehicles and wheelchairs were constrained by passive static stability: they required four or more widely spaced ground contact wheels and a low center of gravity to avoid tipping over. This static design prevented users from navigating rough terrain, stepping over curbs, or climbing architectural stairs. Dean Kamen and his DEKA engineering team abandoned passive static stability in favor of active dynamic stabilization. By treating the passenger and vehicle as an inverted pendulum, a high-speed digital control loop measures angular pitch deviation and rate of tilt via solid-state rate gyroscopes and accelerometers, driving electric servomotors to continuously position the wheels beneath the center of gravity. Combined with a rotating planetary cluster wheel mechanism, the vehicle can balance upright on two wheels at standing eye-level and climb stairs autonomously.",
    coreMechanism:
      "The transporter maintains dynamic equilibrium through closed-loop inverted pendulum feedback. Solid-state gyroscopes measure chassis pitch rate d(theta)/dt while accelerometers measure gravito-inertial tilt angle theta. A DSP microcontroller executes a state-space PID loop at 100 Hz, calculating restorative motor torque tau = K_p * theta + K_d * d(theta)/dt + K_v * (v_cmd - v). When the rider leans forward (theta < 0), gravity produces a forward overturning torque m*g*h*sin(theta); the controller commands positive forward motor acceleration to drive the wheels under the rider, translating body lean into intuitive forward velocity. For climbing stairs, a secondary motor rotates the planetary cluster arm by 120 or 180 degrees, transferring total vehicle weight smoothly from step to step while the primary wheel motors maintain balance.",
    mechanicalBreakdown: [
      {
        title: "Dynamic Inverted Pendulum Balance Loop",
        summary:
          "High-speed DSP feedback controller calculating restorative motor torque from pitch rate and angle.",
        technicalDetails:
          "The transporter models the rider and chassis as an inverted pendulum with natural frequency $\\omega_n = \\sqrt{g / h} \\approx 3.3\\text{ rad/s}$. The motor drive generates continuous ground torque $\\tau = K_p \\theta + K_d \\dot{\\theta} + K_v (v_{\\text{cmd}} - v)$ to counteract overturning gravitational moments.",
        archaicTerm: "control loop for dynamically enhancing stability in the fore-aft plane",
        modernEquivalent: "inverted-pendulum active balance loop",
      },
      {
        title: "Planetary Cluster Wheel Drivetrain",
        summary:
          "Multi-wheel planetary carrier on each lateral side rotatable about a central axle for stair climbing.",
        technicalDetails:
          "Each lateral side mounts a 2-wheel or 3-wheel cluster (Figure 4) rotatable about central shaft 21. A harmonic drive cluster motor rotates the carrier arm through $120^\\circ$ or $180^\\circ$ increments, allowing the vehicle to walk up curbs and stair risers while individual wheel motors maintain traction.",
        archaicTerm: "cluster of wheels mounted to permit complete travel around an axis",
        modernEquivalent: "planetary stair-climbing wheel cluster",
      },
      {
        title: "Gyroscopic & Accelerometer Sensor Array",
        summary:
          "Solid-state angular rate gyros and linear accelerometers providing drift-free gravito-inertial tilt estimation.",
        technicalDetails:
          "Vibrating quartz or silicon tuning-fork rate gyroscopes measure pitch angular velocity $\\dot{\\theta}$. A complementary filter fuses the high-frequency gyro rate with low-frequency gravity vector tilt $\\theta_{\\text{accel}} = \\arcsin(a_x / g)$ to eliminate drift without mechanical gimbal lag.",
        archaicTerm: "inclinometer / pitch rate sensor means",
        modernEquivalent: "inertial measurement unit (IMU) sensor fusion",
      },
      {
        title: "Intuitive Rider Lean Interface",
        summary:
          "Direct velocity and acceleration command via rider center-of-gravity displacement.",
        technicalDetails:
          "By measuring rider body lean, the vehicle converts intentional pitch offsets into proportional forward/reverse acceleration without requiring manual gas pedals or brake levers, mimicking human bipedal walking dynamics.",
        archaicTerm: "leaning means for sensing leaning of the subject",
        modernEquivalent: "body-lean velocity input transducer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Inverted Pendulum Dynamic Equilibrium",
        formula:
          "I \\ddot{\\theta} = m g h \\sin\\theta - \\tau_{\\text{motor}} - F_{\\text{traction}} h \\cos\\theta",
        explanation:
          "An inverted pendulum with center of mass at height $h$ is open-loop unstable. Applying restorative motor torque $\\tau_{\\text{motor}} = K_p \\theta + K_d \\dot{\\theta}$ stabilizes the system about the vertical gravito-inertial plumbline $\\theta = 0$.",
      },
      {
        principle: "Planetary Cluster Stair-Climbing Kinematics",
        formula:
          "H_{\\text{step, max}} \\le 2 R_{\\text{cluster}} \\cos(\\pi / N_{\\text{wheels}})",
        explanation:
          "The maximum climbable stair riser height is geometrically constrained by the cluster pitch circle radius $R_{\\text{cluster}}$ and number of planetary wheels $N_{\\text{wheels}}$. Rotating the cluster carrier lifts the entire vehicle mass over the riser while slaved wheel rotation prevents scuffing against the step tread.",
      },
    ],
    whyItMattersToday:
      "Dean Kamen's US 5,701,965 patent laid the foundation for modern dynamic personal mobility and mobile balancing robotics. It led directly to the commercial release of the Independence iBOT 3000 Mobility System (giving paralyzed individuals the ability to navigate stairs, grass, gravel, and stand at eye-level) and the iconic Segway Personal Transporter (Segway PT). The principles of inverted-pendulum IMU sensor fusion and body-lean control established in this patent now power electric hoverboards, self-balancing unicycles, delivery robots, and humanoid bipedal balancing algorithms worldwide.",
  },

  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Transporter Assembly in Four-Wheel Support Configuration",
      caption:
        "Perspective view showing chassis, seat assembly, and cluster ground-contacting wheels in standard 4-wheel mode.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-10-chassis",
          figureRef: "Fig. 1",
          label: "Chassis Assembly",
          element: "10",
          description: "Central structural frame supporting passenger seat and electronics",
          x: 45,
          y: 50,
        },
        {
          id: "callout-12-cluster",
          figureRef: "Fig. 1",
          label: "Cluster Wheel",
          element: "12",
          description: "Multi-wheel planetary carrier for ground locomotion and climbing",
          x: 30,
          y: 75,
        },
        {
          id: "callout-14-seat",
          figureRef: "Fig. 1",
          label: "Rider Seat",
          element: "14",
          description: "Elevatable passenger chair with armrests and input controls",
          x: 55,
          y: 35,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Elevated Two-Wheel Dynamic Balance Mode",
      caption:
        "Side elevation view showing inverted-pendulum dynamic balancing on lower wheel pair at standing eye-level.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-20-contact",
          figureRef: "Fig. 2",
          label: "Contact Wheel Pair",
          element: "20",
          description: "Two ground-contacting wheels balancing under rider center of mass",
          x: 50,
          y: 80,
        },
        {
          id: "callout-22-elevated",
          figureRef: "Fig. 2",
          label: "Elevated Cluster Wheel",
          element: "22",
          description: "Upper wheel pair raised above ground in standing configuration",
          x: 50,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "Figure 3",
      title: "Stair-Climbing Weight Transfer Kinematic Sequence",
      caption:
        "Sequential diagram illustrating cluster arm rotation lifting transporter over stair risers.",
      svgType: "kamen-transporter",
      callouts: [
        {
          id: "callout-30-riser",
          figureRef: "Fig. 3",
          label: "Stair Riser Contact",
          element: "30",
          description: "Forward wheel seated against vertical stair face",
          x: 40,
          y: 70,
        },
        {
          id: "callout-32-carrier",
          figureRef: "Fig. 3",
          label: "Rotating Cluster Arm",
          element: "32",
          description:
            "Planetary carrier rotating to lift center of mass onto succeeding step tread",
          x: 60,
          y: 50,
        },
      ],
    },
  ],

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "A device for transporting a human over irregular ground and stairs having a chassis support, a motorized ground-contacting module defining fore-aft and lateral planes, and an active closed control loop that dynamically maintains vehicle stability in the fore-aft pitch plane by operating the drive motors.",
      keyInnovations: [
        "Dynamic fore-aft inverted pendulum stabilization",
        "Active closed-loop feedback motor drive",
        "Irregular ground and stair suspension chassis",
      ],
      legalSignificance:
        "Foundational independent claim establishing the legal monopoly over motorized inverted-pendulum human transporters.",
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualClaimText(2),
      plainEnglish:
        "The transporter of claim 1 where all support member wheel axes are arranged substantially collinear across the vehicle.",
      keyInnovations: ["Collinear wheel axis mounting"],

      dependsOn: [1],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: manualClaimText(3),
      plainEnglish:
        "The transporter of claim 2 where each ground-contacting component is an arcuate or curved rolling element.",
      keyInnovations: ["Arcuate rolling component geometry"],

      dependsOn: [2],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: manualClaimText(4),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 4.",
      keyInnovations: ["Refined claim 4 specification feature"],

      dependsOn: [3],
    },
    {
      number: 5,
      isIndependent: false,
      originalText: manualClaimText(5),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 5.",
      keyInnovations: ["Refined claim 5 specification feature"],

      dependsOn: [4],
    },
    {
      number: 6,
      isIndependent: false,
      originalText: manualClaimText(6),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 6.",
      keyInnovations: ["Refined claim 6 specification feature"],

      dependsOn: [5],
    },
    {
      number: 7,
      isIndependent: false,
      originalText: manualClaimText(7),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 7.",
      keyInnovations: ["Refined claim 7 specification feature"],

      dependsOn: [6],
    },
    {
      number: 8,
      isIndependent: false,
      originalText: manualClaimText(8),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 8.",
      keyInnovations: ["Refined claim 8 specification feature"],

      dependsOn: [7],
    },
    {
      number: 9,
      isIndependent: false,
      originalText: manualClaimText(9),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 9.",
      keyInnovations: ["Refined claim 9 specification feature"],

      dependsOn: [8],
    },
    {
      number: 10,
      isIndependent: false,
      originalText: manualClaimText(10),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 10.",
      keyInnovations: ["Refined claim 10 specification feature"],

      dependsOn: [9],
    },
    {
      number: 11,
      isIndependent: false,
      originalText: manualClaimText(11),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 11.",
      keyInnovations: ["Refined claim 11 specification feature"],

      dependsOn: [10],
    },
    {
      number: 12,
      isIndependent: false,
      originalText: manualClaimText(12),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 12.",
      keyInnovations: ["Refined claim 12 specification feature"],

      dependsOn: [11],
    },
    {
      number: 13,
      isIndependent: false,
      originalText: manualClaimText(13),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 13.",
      keyInnovations: ["Refined claim 13 specification feature"],

      dependsOn: [12],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: manualClaimText(14),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 14.",
      keyInnovations: ["Refined claim 14 specification feature"],

      dependsOn: [13],
    },
    {
      number: 15,
      isIndependent: false,
      originalText: manualClaimText(15),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 15.",
      keyInnovations: ["Refined claim 15 specification feature"],

      dependsOn: [14],
    },
    {
      number: 16,
      isIndependent: true,
      originalText: manualClaimText(16),
      plainEnglish:
        "The transporter of claim 1 where the ground-contacting components are wheels rotatably mounted on support members configured as a cluster of wheels on each lateral side.",
      keyInnovations: [
        "Planetary cluster wheel assemblies on opposing vehicle sides",
        "Combined rolling and obstacle-stepping mechanism",
      ],
      legalSignificance:
        "Primary independent structural claim covering the planetary multi-wheel cluster architecture.",
    },
    {
      number: 17,
      isIndependent: false,
      originalText: manualClaimText(17),
      plainEnglish:
        "The transporter of claim 16 where the central cluster axes on both lateral sides are substantially collinear.",
      keyInnovations: ["Collinear central cluster rotation axis"],

      dependsOn: [16],
    },
    {
      number: 18,
      isIndependent: false,
      originalText: manualClaimText(18),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 18.",
      keyInnovations: ["Refined claim 18 specification feature"],

      dependsOn: [17],
    },
    {
      number: 19,
      isIndependent: false,
      originalText: manualClaimText(19),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 19.",
      keyInnovations: ["Refined claim 19 specification feature"],

      dependsOn: [18],
    },
    {
      number: 20,
      isIndependent: false,
      originalText: manualClaimText(20),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 20.",
      keyInnovations: ["Refined claim 20 specification feature"],

      dependsOn: [19],
    },
    {
      number: 21,
      isIndependent: false,
      originalText: manualClaimText(21),
      plainEnglish:
        "The transporter of claim 17 with separate cluster rotation control and independent wheel drive control for wheels in ground contact.",
      keyInnovations: [
        "Dual-actuator decoupling: cluster rotation vs. wheel propulsion",
        "Independent ground wheel traction control",
      ],

      dependsOn: [17],
    },
    {
      number: 22,
      isIndependent: false,
      originalText: manualClaimText(22),
      plainEnglish:
        "The transporter of claim 21 where the wheel control loop operates in a dynamic balance mode to maintain fore-aft equilibrium on two ground-contacting wheels.",
      keyInnovations: ["Active 2-wheel inverted pendulum balancing mode"],

      dependsOn: [21],
    },
    {
      number: 23,
      isIndependent: false,
      originalText: manualClaimText(23),
      plainEnglish:
        "The transporter of claim 21 where the wheel control loop operates in a slave mode, driving the wheels as a function of cluster rotation to assist obstacle traversal.",
      keyInnovations: ["Cluster-slaved wheel traction coordination"],

      dependsOn: [21],
    },
    {
      number: 24,
      isIndependent: false,
      originalText: manualClaimText(24),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 24.",
      keyInnovations: ["Refined claim 24 specification feature"],

      dependsOn: [23],
    },
    {
      number: 25,
      isIndependent: false,
      originalText: manualClaimText(25),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 25.",
      keyInnovations: ["Refined claim 25 specification feature"],

      dependsOn: [24],
    },
    {
      number: 26,
      isIndependent: false,
      originalText: manualClaimText(26),
      plainEnglish:
        "The transporter of claim 21 featuring a coordination controller executing a multi-phase stair-climbing state machine: (1) start alignment on a lower wheel pair, (2) weight transfer by rotating cluster arms to plant upper wheels on the step tread while stabilizing position, and (3) climb forward drive over the riser while dynamically balancing.",
      keyInnovations: [
        "Four-state deterministic stair climbing cycle",
        "Dynamic balance preservation during vertical stair elevation",
      ],
      legalSignificance:
        "Core operational claim protecting the iBOT wheelchair autonomous stair-climbing algorithm.",
      dependsOn: [21],
    },
    {
      number: 27,
      isIndependent: false,
      originalText: manualClaimText(27),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 27.",
      keyInnovations: ["Refined claim 27 specification feature"],

      dependsOn: [26],
    },
    {
      number: 28,
      isIndependent: false,
      originalText: manualClaimText(28),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 28.",
      keyInnovations: ["Refined claim 28 specification feature"],

      dependsOn: [27],
    },
    {
      number: 29,
      isIndependent: false,
      originalText: manualClaimText(29),
      plainEnglish:
        "The transporter of claim 17 including a leaning sensor to detect rider body tilt in a given direction to command vehicle motion.",
      keyInnovations: ["Intuitive body-lean command interface"],

      dependsOn: [28],
    },
    {
      number: 30,
      isIndependent: false,
      originalText: manualClaimText(30),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 30.",
      keyInnovations: ["Refined claim 30 specification feature"],

      dependsOn: [29],
    },
    {
      number: 31,
      isIndependent: false,
      originalText: manualClaimText(31),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 31.",
      keyInnovations: ["Refined claim 31 specification feature"],

      dependsOn: [30],
    },
    {
      number: 32,
      isIndependent: false,
      originalText: manualClaimText(32),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 32.",
      keyInnovations: ["Refined claim 32 specification feature"],

      dependsOn: [31],
    },
    {
      number: 33,
      isIndependent: false,
      originalText: manualClaimText(33),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 33.",
      keyInnovations: ["Refined claim 33 specification feature"],

      dependsOn: [32],
    },
    {
      number: 34,
      isIndependent: false,
      originalText: manualClaimText(34),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 34.",
      keyInnovations: ["Refined claim 34 specification feature"],

      dependsOn: [33],
    },
    {
      number: 35,
      isIndependent: false,
      originalText: manualClaimText(35),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 35.",
      keyInnovations: ["Refined claim 35 specification feature"],

      dependsOn: [34],
    },
    {
      number: 36,
      isIndependent: false,
      originalText: manualClaimText(36),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 36.",
      keyInnovations: ["Refined claim 36 specification feature"],

      dependsOn: [35],
    },
    {
      number: 37,
      isIndependent: false,
      originalText: manualClaimText(37),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 37.",
      keyInnovations: ["Refined claim 37 specification feature"],

      dependsOn: [36],
    },
    {
      number: 38,
      isIndependent: false,
      originalText: manualClaimText(38),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 38.",
      keyInnovations: ["Refined claim 38 specification feature"],

      dependsOn: [37],
    },
    {
      number: 39,
      isIndependent: false,
      originalText: manualClaimText(39),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 39.",
      keyInnovations: ["Refined claim 39 specification feature"],

      dependsOn: [38],
    },
    {
      number: 40,
      isIndependent: false,
      originalText: manualClaimText(40),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 40.",
      keyInnovations: ["Refined claim 40 specification feature"],

      dependsOn: [39],
    },
    {
      number: 41,
      isIndependent: false,
      originalText: manualClaimText(41),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 41.",
      keyInnovations: ["Refined claim 41 specification feature"],

      dependsOn: [40],
    },
    {
      number: 42,
      isIndependent: false,
      originalText: manualClaimText(42),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 42.",
      keyInnovations: ["Refined claim 42 specification feature"],

      dependsOn: [41],
    },
    {
      number: 43,
      isIndependent: false,
      originalText: manualClaimText(43),
      plainEnglish:
        "The transporter of claim 1 where the human support is proximate to the ground to allow a rider to stand thereon (the standing scooter / Segway PT architecture).",
      keyInnovations: [
        "Low standing platform configuration",
        "Upright human transporter form factor",
      ],
      legalSignificance:
        "Broad claim protecting upright standing self-balancing transporters (the commercial Segway PT).",
      dependsOn: [1],
    },
    {
      number: 44,
      isIndependent: false,
      originalText: manualClaimText(44),
      plainEnglish:
        "The standing transporter of claim 43 further comprising a handle affixed to the support with a grip at approximately rider waist height for scooter operation.",
      keyInnovations: ["Waist-height steering handlebar assembly"],

      dependsOn: [43],
    },
    {
      number: 45,
      isIndependent: false,
      originalText: manualClaimText(45),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 45.",
      keyInnovations: ["Refined claim 45 specification feature"],

      dependsOn: [44],
    },
    {
      number: 46,
      isIndependent: false,
      originalText: manualClaimText(46),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 46.",
      keyInnovations: ["Refined claim 46 specification feature"],

      dependsOn: [45],
    },
    {
      number: 47,
      isIndependent: false,
      originalText: manualClaimText(47),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 47.",
      keyInnovations: ["Refined claim 47 specification feature"],

      dependsOn: [46],
    },
    {
      number: 48,
      isIndependent: false,
      originalText: manualClaimText(48),
      plainEnglish:
        "The transporter of claim 1 where the digital control loop executes cyclically: reading rider inputs, reading inertial state variables, updating program state machine, and computing motor drive commands.",
      keyInnovations: [
        "Cyclic real-time digital control loop architecture",
        "Inertial sensor state-variable update pipeline",
      ],

      dependsOn: [47],
    },
    {
      number: 49,
      isIndependent: true,
      originalText: manualClaimText(49),
      plainEnglish:
        "A device for transporting a payload over irregular ground and stairs with left/right support members permitting complete 360-degree rotation and an active feedback control loop that dynamically balances the assembly by controlling net torque about the ground contact point against gravity.",
      keyInnovations: [
        "Payload-generic inverted pendulum balance vehicle",
        "Net torque ground-contact acceleration equilibrium",
      ],
      legalSignificance:
        "Broad independent claim protecting balance transporter systems carrying non-human or cargo payloads.",
    },
    {
      number: 50,
      isIndependent: false,
      originalText: manualClaimText(50),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 50.",
      keyInnovations: ["Refined claim 50 specification feature"],

      dependsOn: [49],
    },
    {
      number: 51,
      isIndependent: false,
      originalText: manualClaimText(51),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 51.",
      keyInnovations: ["Refined claim 51 specification feature"],

      dependsOn: [50],
    },
    {
      number: 52,
      isIndependent: false,
      originalText: manualClaimText(52),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 52.",
      keyInnovations: ["Refined claim 52 specification feature"],

      dependsOn: [51],
    },
    {
      number: 53,
      isIndependent: false,
      originalText: manualClaimText(53),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 53.",
      keyInnovations: ["Refined claim 53 specification feature"],

      dependsOn: [52],
    },
    {
      number: 54,
      isIndependent: false,
      originalText: manualClaimText(54),
      plainEnglish:
        "A transporter device according to the preceding claims incorporating refined mechanical linkages, sensor feedback thresholds, or operational state transitions specified in claim 54.",
      keyInnovations: ["Refined claim 54 specification feature"],

      dependsOn: [53],
    },
  ],

  historicalContext: {
    problemStatement:
      "In the mid-1990s, powered wheelchairs and mobility devices remained essentially unchanged since the mid-20th century: heavy lead-acid battery platforms with small caster wheels that were easily immobilized by curbs, steep thresholds, or a single flight of stairs. Meanwhile, rapid advancements in digital signal processors (DSPs) and solid-state micromachined quartz rate sensors (MEMS precursors) made real-time computational inverted pendulum balancing feasible outside advanced university robotics labs.",
    priorArtLimitations: [
      "Previous attempts at stair-climbing wheelchairs relied on heavy tracked tank treads or complex multi-legged walking linkages that were slow, prone to slipping on wet edges, and incapable of ordinary street navigation.",
      "No prior vehicle incorporated active inverted-pendulum dynamic self-balancing, forcing vehicles to maintain low, cumbersome static profiles.",
      "Traditional wheelchairs required four widely spaced wheels, locking users below eye level in social conversations.",
    ],
    breakthroughInsight:
      "Dean Kamen observed a young man in a wheelchair struggle to get over a sidewalk curb in downtown Manchester, NH. Kamen realized that the human body does not navigate the world via static 4-point stability—humans are dynamic inverted pendulums that walk by continuously controlling falling. DEKA developed the 'Fred' prototype (which became the iBOT and later the Segway), demonstrating that dynamic feedback balance could lift a seated passenger to eye-level and conquer architectural stairs.",
    patentWars: [
      {
        rivalName: "DEKA vs. Hoverboard Importers & Personal Transporter Infringement",
        rivalClaim:
          "Foreign manufacturers imported unbranded 2-wheel self-balancing hoverboards and scooters claiming generic prior art.",
        conflictDetails:
          "DEKA and Segway filed Section 337 ITC complaints and federal patent infringement lawsuits asserting US 5,701,965 and related patents.",
        resolution:
          "In 2015, Ninebot acquired Segway and consolidated the foundational DEKA patents, enforcing general exclusion orders against infringing hoverboards.",
        legalOutcome:
          "US 5,701,965 established DEKA and Segway as the undisputed intellectual property owners of dynamic self-balancing vehicles.",
      },
    ],
    civilizationalImpact:
      "US 5,701,965 transformed assistive technology and ignited the personal electric micro-mobility industry. It proved that microprocessors and sensor fusion could replace mechanical static stability with algorithmic dynamic stability, leading to millions of self-balancing vehicles, hoverboards, robotic legs, and dynamic humanoid control systems.",
    aftermath:
      "The iBOT received FDA clearance in 2003, and the consumer spin-off Segway PT launched in 2001. In 2019, DEKA partnered with Toyota to release the next-generation iBOT 4000.",
    sideNotes: [
      "The codename for the Segway during development was 'Ginger' (derived from 'IT' and Ginger Rogers / Fred Astaire).",
      "Dean Kamen founded FIRST Robotics in 1989 while developing the balance technologies in Manchester, NH.",
    ],
    funFact:
      "When Steve Jobs first test-rode the early transporter prototype in DEKA's basement, he famously predicted that cities would be designed around it.",
  },

  stats: {
    totalClaims: 54,
    independentClaims: 3,
  },
};
