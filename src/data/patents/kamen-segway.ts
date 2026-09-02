import { kamenSegwayArchivalEdition } from "@/data/editions/kamenSegwayEdition";
import type { Patent } from "@/types/patent";

const EXPECTED_PDF_SHA256 = "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db";

function manualClaimText(number: number): string {
  const claimBlock = kamenSegwayArchivalEdition.blocks.find(
    (b): b is Extract<(typeof kamenSegwayArchivalEdition.blocks)[number], { kind: "claim" }> =>
      b.kind === "claim" && b.number === number,
  );
  if (!claimBlock) {
    throw new Error(`Missing claim ${number} in kamenSegwayArchivalEdition`);
  }
  return claimBlock.inlines.map((i) => i.text).join("");
}

export const kamenSegwayPatent: Patent = {
  id: "us-6302230-kamen-segway",
  patentNumber: "US 6,302,230 B1",
  title: "Personal Mobility Vehicles and Methods",
  shortTitle: "Segway Self-Balancing Human Transporter",
  subtitle:
    "Inverted Pendulum Dynamic Balancing, Dual-Wheel Differential Drive, and Balancing Margin Monitoring",
  inventors: [
    "Dean L. Kamen",
    "Robert R. Ambrogi",
    "Robert J. Duggan",
    "J. Douglas Field",
    "Richard Kurt Heinzmann",
    "Burl Amsbury",
    "Christopher C. Langenfeld",
  ],
  inventorLocation: "Bedford, New Hampshire",
  filingDate: "1999-06-04",
  grantDate: "2001-10-16",
  category: "consumer",
  categoryLabel: "Robotics & Personal Mechatronics",
  era: "Information Age (1970–Present)",

  summary:
    "Dean Kamen and the DEKA engineering team invented the modern self-balancing personal transporter (the Segway HT). Departing from traditional multi-wheel vehicles that rely on static stability, the transporter operates as an actively balanced inverted pendulum supported on two coaxial wheels. Solid-state gyroscopes and accelerometers track rider center-of-gravity displacement, commanding high-torque brushless DC motors to sprint forward or backward beneath the rider to maintain continuous dynamic equilibrium. Crucially, the patent introduces the 'balancing margin monitor'—an onboard supervisory system that measures available acceleration headroom and warns the rider via tactile platform ripple vibration, audible alarms, and pitch pushback before motor torque saturation can cause an overturn.",

  heroQuote:
    "The motorized drive arrangement, ground contacting module and payload comprise a system being unstable with respect to tipping when the motorized drive is not powered; the motorized drive arrangement causing, when powered, automatically balanced operation of the system.",

  originalPdfUrl: "/patents/pdfs/us-6302230-kamen-segway.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6302230B1/en",
  usptoClassification: "B60K 31/00, B60K 28/00, B62D 61/00",

  originalTextAsset: {
    url: "/patents/transcripts/us-6302230-kamen-segway-reviewed.txt",
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Research Team",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: EXPECTED_PDF_SHA256,
    pageCount: 29,
  },

  archivalEdition: kamenSegwayArchivalEdition,

  originalText:
    "The present invention pertains to vehicles and methods for transporting individuals, and more particularly to balancing vehicles and methods for transporting individuals over ground having a surface that may be irregular. A wide range of vehicles and methods are known for transporting human subjects. Typically, such vehicles rely upon static stability, being designed so as to be stable under all foreseen conditions of placement of their ground contacting members. An alternative to operation of a statically stable vehicle is that dynamic stability may be maintained by action of the user, as in the case of a bicycle or motorcycle or scooter, or, in accordance with embodiments of the present invention, by a control loop. When unpowered, the system is unstable with respect to tipping in the fore-aft plane; when powered, the motorized drive automatically balances the system beneath the user.",

  stats: {
    totalClaims: 7,
    independentClaims: 2,
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Defines the fundamental self-balancing personal transporter architecture: a user-supporting platform mounted to a ground-contacting drive module that is statically unstable with respect to fore-aft tipping when unpowered. When powered, the motorized drive maintains automatic dynamic balance while monitoring a 'balancing margin'—the difference between the present velocity and maximum allowable operating velocity needed to retain acceleration balancing authority—and triggering an alarm if the balancing margin drops below a safe limit.",
      keyInnovations: [
        "Inverted pendulum dynamic balancing on coaxial wheels",
        "Balancing margin calculation based on acceleration headroom",
        "Safety alarm triggered upon approaching motor torque/velocity limit",
      ],
      legalSignificance:
        "The master apparatus claim that established legal exclusivity over two-wheeled self-balancing human transporters and active balancing margin supervisory safety systems.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "Specifies that the warning alarm comprises ripple modulation of the motorized drive power output, transmitting a distinct physical shudder / vibration through the foot platform directly into the rider's feet to signal that balancing capacity is running out.",
      keyInnovations: [
        "Haptic/tactile motor torque ripple alarm modulation",
        "Direct through-platform foot shudder feedback",
      ],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(3),
      plainEnglish:
        "Specifies that the motorized drive arrangement includes at least one motor coupled to drive the ground-contacting wheels.",
      keyInnovations: ["Direct electromechanical wheel drive coupling"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(4),
      plainEnglish:
        "Specifies that the ground contacting module comprises laterally disposed left and right wheels rotatable on a common axis.",
      keyInnovations: ["Coaxial dual laterally disposed wheel layout"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Independent method claim for safely controlling an actively balanced personal vehicle: driving ground wheels to automatically balance the statically unstable chassis, computing an instantaneous balancing margin based on available velocity headroom, and triggering an alarm when that margin drops below a threshold.",
      keyInnovations: [
        "Algorithmic balancing margin monitoring method",
        "Threshold-based supervisory safety triggering",
      ],
      legalSignificance:
        "Broad independent method claim covering the algorithmic sequence of balancing an unstable transporter while calculating acceleration margin to prevent tip-over.",
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(6),
      plainEnglish:
        "Method claim specifying that the alarm is delivered by applying a ripple torque to the drive wheels to physically vibrate the platform under the rider's feet.",
      keyInnovations: ["Dynamic motor ripple alarm generation method"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(7),
      plainEnglish:
        "Method claim specifying that the alarm is triggered when the vehicle velocity approaches the defined maximum operating speed.",
      keyInnovations: ["Velocity boundary alarm triggering method"],
    },
  ],

  plainEnglishExplanation: {
    overview:
      "For over a century, wheeled vehicles relied entirely on static geometry for stability: three or four wheels spread out across a wide base to keep the center of gravity strictly inside the wheel perimeter. Dean Kamen and his team at DEKA inverted this paradigm. The Segway HT balances dynamically on two coaxial wheels like an inverted broomstick balanced on an open palm. When the rider leans forward, gravity begins pulling them down; solid-state gyroscopes detect the tilt in milliseconds, commanding the electric motors to accelerate the wheels forward directly beneath the rider's center of gravity. Most importantly, the patent addresses the critical failure mode of inverted-pendulum robotics: if the motor runs at 100% speed, it has zero torque left to sprint forward and catch a falling rider. The 'balancing margin monitor' continuously measures this torque headroom, warning the rider through haptic platform vibration and pitch pushback before an irrecoverable fall can happen.",

    coreMechanism:
      "The transporter balances through four integrated functional subsystems: (1) Inertial Sensing & Pitch Estimation: a cluster of micro-machined silicon angular rate sensors (gyroscopes) and tilt accelerometers measure pitch angle $\\theta$ and pitch angular rate $\\dot\\theta$ relative to gravity. (2) Real-Time State-Space Motor Control: a digital signal processor computes optimal motor voltage using Linear Quadratic Regulator (LQR) state feedback: $\\tau = -(K_\\theta \\theta + K_{\\dot\\theta} \\dot\\theta + K_x x + K_v v)$. (3) Dual Coaxial Brushless DC Drive: high-power servomotors apply bidirectional torque to the left and right wheels via precision planetary reduction gearboxes, driving the chassis forward to cancel forward lean. (4) Balancing Margin & Alarm Supervision: the controller computes the remaining velocity and torque headroom $\\Delta v = v_{\\text{limit}} - |v|$. When $\\Delta v$ drops below safety thresholds, the controller superimposes an 18 Hz torque ripple onto the motor drive signal, causing the platform to shudder violently under the rider's feet while tilting the handlebar backward (pitch pushback) to physically compel the rider to slow down.",

    mechanicalBreakdown: [
      {
        title: "Coaxial Dual-Wheel Inverted Pendulum Chassis",
        summary:
          "Two laterally disposed pneumatic wheels rotating on a single transverse axis, supporting a foot platform that is statically unstable in the fore-aft pitch plane.",
        technicalDetails:
          "The chassis (12) houses the battery pack, motor controllers, and DSP computer directly between two 19-inch coaxial wheels (20). When unpowered, the system immediately falls forward or backward ($I \\ddot\\theta = M g L \\sin\\theta$). When powered, wheel acceleration $\\ddot{x} = g \\tan\\theta$ creates an inertial D'Alembert reaction force that completely stabilizes the inverted mass.",
        archaicTerm: "system being unstable with respect to tipping",
        modernEquivalent: "dynamically balanced inverted pendulum mobile robot",
      },
      {
        title: "Inertial Gyroscope & Accelerometer Sensor Cluster",
        summary:
          "Redundant solid-state vibrating-structure gyroscopes and tilt accelerometers tracking pitch rate and gravitational orientation.",
        technicalDetails:
          "Five solid-state angular rate gyros (three active, two redundant) sample chassis angular velocity at over 100 Hz. Accelerometers measure the gravity vector $\\mathbf{g}$ to continuously correct for gyro bias drift, producing a drift-free estimate of absolute pitch angle $\\theta$ and pitch rate $\\dot\\theta$.",
        archaicTerm: "attitude sensor arrangement",
        modernEquivalent: "MEMS 6-axis IMU with Kalman sensor fusion",
      },
      {
        title: "Balancing Margin Supervisory Monitor",
        summary:
          "A real-time safety algorithm tracking the acceleration headroom between current operating velocity and motor physical saturation limits.",
        technicalDetails:
          "The balancing margin $M_{\\text{bal}} = 1 - (|v| / v_{\\text{max}})^2 - (|\\tau_{\\text{demand}}| / \\tau_{\\text{max}})$ evaluates how much additional torque is available to catch sudden forward rider lunges or road bumps. If $M_{\\text{bal}} \\le 0.15$, supervisory safety routines initiate active deceleration.",
        archaicTerm: "means for monitoring a balancing margin",
        modernEquivalent: "dynamic torque headroom supervisory safety observer",
      },
      {
        title: "Haptic Torque Ripple & Platform Shudder Alarm",
        summary:
          "A motor-drive modulation technique that shakes the foot platform at an unmistakable tactile frequency to warn the rider without taking their eyes off the road.",
        technicalDetails:
          "When the balancing margin drops below the safe threshold, the controller superimposes a sinusoidal or square torque ripple ($f \\approx 18\\text{ Hz}$, amplitude $\\Delta\\tau \\approx 15\\text{ N}\\cdot\\text{m}$) directly onto the motor command. This vibrates the foot platform with high tactile saliency, bypassing sensory overload and alerting the rider instantaneously.",
        archaicTerm: "ripple modulation of the power output",
        modernEquivalent: "haptic motor drive torque ripple alarm",
      },
    ],

    scientificPrinciples: [
      {
        principle: "Inverted Pendulum Dynamic Balancing",
        formula:
          "\\tau_{\\text{motor}} = M g L \\sin\\theta + M L \\ddot{x} \\cos\\theta + I \\ddot{\\theta}",
        explanation:
          "The transporter is modeled as an inverted pendulum where gravitational torque $M g L \\sin\\theta$ destabilizes the system. Forward chassis acceleration $\\ddot{x}$ produces an inertial reaction force $-M \\ddot{x} L \\cos\\theta$ that counteracts gravity. By driving the wheels with acceleration $\\ddot{x} = g \\tan\\theta$, the net torque about the center of mass vanishes, maintaining stable dynamic equilibrium.",
      },
      {
        principle: "State-Space Linear Quadratic Regulator (LQR) Control",
        formula:
          "\\mathbf{u}(t) = -\\mathbf{K} \\mathbf{x}(t) = - (K_\\theta \\theta + K_{\\dot\\theta} \\dot\\theta + K_x x + K_v v)",
        explanation:
          "The digital controller minimizes a quadratic cost function weighting state error against motor effort. Full state feedback uses four calibrated gains: pitch angle gain $K_\\theta$, pitch angular velocity gain $K_{\\dot\\theta}$, position gain $K_x$, and velocity damping gain $K_v$, placing closed-loop poles in the left-half s-plane for robust, critically damped stability.",
      },
      {
        principle: "Ground Traction Limit & Acceleration Headroom",
        formula:
          "F_{\\text{drive}} = \\frac{\\tau_{\\text{motor}}}{R} \\le \\mu_{\\text{ground}} M g",
        explanation:
          "The maximum horizontal thrust force that can be exerted without tire slip is bounded by the Coulomb friction coefficient $\\mu$ and total weight $M g$. If the demanded balancing force exceeds $\\mu M g$, wheel slip occurs and balance is lost, establishing a fundamental physical refusal boundary for low-friction surfaces.",
      },
    ],

    whyItMattersToday:
      "Dean Kamen's Segway patent US 6,302,230 represents a landmark milestone in modern robotics and control theory. It demonstrated to the world that complex multi-variable inverted-pendulum robotics could be made safe, robust, and intuitive enough for everyday consumer transportation. The concepts pioneered here—microprocessor sensor fusion, state-space motor torque balancing, balancing margin supervisory monitors, and intuitive lean-to-drive interfaces—laid the engineering foundation for an entire generation of mobile robotics, autonomous personal electric vehicles, self-balancing hoverboards, and modern robotic exoskeletons.",
  },

  historicalContext: {
    problemStatement:
      "For centuries, all wheeled personal transportation relied on static multi-wheel stability (automobiles, tricycles, wheelchairs) or forward gyroscopic momentum (bicycles). Statically stable vehicles require large footprints and cannot turn within their own geometry, while prior dynamic balancing research lacked safe operational boundaries to prevent runaway motor saturation and catastrophic rider tipover.",
    priorArtLimitations: [
      "Statically stable multi-wheel vehicles have large turning radii and cannot navigate tight indoor corridors or dense pedestrian sidewalks.",
      "Traditional wheelchairs are heavy and restricted to flat ramps, lacking intuitive human body-weight velocity control.",
      "Academic inverted pendulum carts lacked supervisory torque margin monitoring, causing sudden motor saturation and uncontrolled falls upon encountering obstacles or steep slopes.",
    ],
    breakthroughInsight:
      "Dean Kamen and the DEKA team inverted personal mobility by operating the transporter as an active inverted pendulum on two coaxial wheels. By fusing solid-state gyroscopes and accelerometers, the controller drives the wheels forward beneath a falling rider (mimicking human bipedal walking). Crucially, Kamen invented the 'balancing margin monitor', continuously tracking remaining acceleration headroom and warning the rider via 18 Hz tactile platform vibration and pitch pushback before stability is compromised.",
    patentWars: [
      {
        rivalName: "Global Clone Manufacturers & Micro-Mobility Importers",
        rivalClaim:
          "During the 2000s and 2010s, numerous international manufacturers produced two-wheeled self-balancing scooters and hoverboards, claiming basic inverted-pendulum balancing was unpatentable prior art.",
        conflictDetails:
          "Segway LLC and DEKA filed multiple patent infringement lawsuits and United States International Trade Commission (USITC) Section 337 investigations to block infringing balancing vehicles from entering the US market.",
        resolution:
          "In 2015, Chinese robotics company Ninebot, backed by Xiaomi and Sequoia Capital, acquired Segway LLC, uniting the core Kamen patent portfolio with global high-volume manufacturing.",
        legalOutcome:
          "The acquisition solidified Segway-Ninebot as the dominant worldwide intellectual property holder for self-balancing personal electric mobility vehicles.",
      },
    ],
    civilizationalImpact:
      "US 6,302,230 pioneered the modern personal electric vehicle (PEV) revolution. Beyond commercial use in police, security, and tourism, its dynamic balancing and torque margin control algorithms laid the foundation for electric unicycles (EUCs), self-balancing hoverboards, autonomous mobile delivery robots, and humanoid robot balance architectures.",
    aftermath:
      "Dean Kamen officially unveiled the Segway HT on December 3, 2001. Segway became an indelible 21st-century cultural and engineering icon. Dean Kamen was inducted into the National Inventors Hall of Fame and continues to invent breakthrough medical, robotics, and water-purification systems at DEKA.",
    funFact:
      "During secret development under code name 'Ginger' and 'IT', tech luminaries Steve Jobs and Jeff Bezos previewed prototypes in Manchester, New Hampshire, with Jobs predicting it would be as big a deal as the personal computer.",
    sideNotes: [
      "The Segway HT uses five solid-state vibrating-structure gyroscopes and two redundant microprocessors for fail-safe control loop execution.",
      "The speed limiting pitch-pushback automatically tilts the platform backward to induce the rider to naturally lean back and decelerate without hand brakes.",
    ],
  },

  drawings: [
    {
      figureNumber: "1",
      title: "FIG. 1: Side Elevation of Self-Balancing Personal Transporter",
      caption:
        "Side view showing a human rider standing upright on base platform 12 supported on two coaxial wheels 20 with vertical handlebar 16.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-1-user",
          figureRef: "Fig. 1",
          label: "Human Rider",
          element: "10",
          description: "Human user / rider standing on the platform",
          x: 48,
          y: 30,
        },
        {
          id: "callout-1-chassis",
          figureRef: "Fig. 1",
          label: "Base Platform",
          element: "12",
          description: "Base platform / chassis supporting the user",
          x: 50,
          y: 78,
        },
        {
          id: "callout-1-mast",
          figureRef: "Fig. 1",
          label: "Handlebar Mast",
          element: "16",
          description: "Vertical handlebar mast with handgrips 14",
          x: 58,
          y: 45,
        },
        {
          id: "callout-1-wheels",
          figureRef: "Fig. 1",
          label: "Coaxial Wheels",
          element: "20",
          description: "Coaxial ground-contacting drive wheels",
          x: 50,
          y: 88,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "FIG. 2: Isometric View of Transporter and Coordinate Axes",
      caption:
        "Perspective view showing the two laterally disposed drive wheels 20, vertical yaw axis Z-Z, and transverse rotation axis Y-Y.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-2-platform",
          figureRef: "Fig. 2",
          label: "Chassis Platform",
          element: "12",
          description: "Chassis platform astride the two coaxial wheels",
          x: 50,
          y: 72,
        },
        {
          id: "callout-2-grips",
          figureRef: "Fig. 2",
          label: "Handlebar Grips",
          element: "14",
          description: "Handlebar grips with user steer input",
          x: 50,
          y: 18,
        },
        {
          id: "callout-2-wheels",
          figureRef: "Fig. 2",
          label: "Drive Wheels",
          element: "20",
          description: "Left and right pneumatic drive wheels",
          x: 32,
          y: 78,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "FIG. 3: Control Loop & Balancing Margin Architecture",
      caption:
        "Block diagram of the sensor cluster, state estimator, motor amplifiers, balancing margin monitor, and alarm transducers.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-3-imu",
          figureRef: "Fig. 3",
          label: "Sensor Cluster",
          element: "30",
          description: "Inertial sensor cluster (gyroscopes & accelerometers)",
          x: 25,
          y: 35,
        },
        {
          id: "callout-3-dsp",
          figureRef: "Fig. 3",
          label: "Digital Controller",
          element: "32",
          description: "Digital signal processor / state-space controller",
          x: 50,
          y: 35,
        },
        {
          id: "callout-3-margin",
          figureRef: "Fig. 3",
          label: "Balancing Margin Monitor",
          element: "34",
          description: "Balancing margin supervisory monitor",
          x: 50,
          y: 65,
        },
        {
          id: "callout-3-alarm",
          figureRef: "Fig. 3",
          label: "Alarm Transducer",
          element: "36",
          description: "Tactile ripple modulation alarm and audible beeper",
          x: 78,
          y: 65,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "FIG. 4: Rider Pitch Lean Angle & Center of Mass Displacement",
      caption:
        "Diagram illustrating user lean angle θ displacing center of gravity CG forward of the ground contact point P.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-4-cg",
          figureRef: "Fig. 4",
          label: "Center of Gravity",
          element: "CG",
          description: "Displaced center of gravity of loaded transporter",
          x: 62,
          y: 38,
        },
        {
          id: "callout-4-pitch",
          figureRef: "Fig. 4",
          label: "Pitch Angle",
          element: "θ",
          description: "Pitch angle lean relative to gravity vertical",
          x: 52,
          y: 55,
        },
        {
          id: "callout-4-contact",
          figureRef: "Fig. 4",
          label: "Ground Contact",
          element: "P",
          description: "Ground contact patch of wheel axle",
          x: 48,
          y: 92,
        },
      ],
    },
  ],
};
