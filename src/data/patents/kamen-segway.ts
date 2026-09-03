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
    "US 6,302,230 describes a vehicle whose platform and ground-contacting module form a system unstable with respect to tipping when its motorized drive is unpowered, and automatically balanced when powered. Its independent claims define a balancing margin from present and maximum operating velocity, a monitor for that margin, and an alarm when the margin falls below a specified limit; Claim 2 adds ripple modulation of drive power as one alarm form.",

  heroQuote:
    "The motorized drive arrangement, ground contacting module and payload comprise a system being unstable with respect to tipping when the motorized drive is not powered; the motorized drive arrangement causing, when powered, automatically balanced operation of the system.",

  originalPdfUrl: "/patents/pdfs/us-6302230-kamen-segway.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6302230B1/en",
  usptoClassification: "B60K 31/00, B60K 28/00, B62D 61/00",

  originalTextAsset: {
    url: "/patents/transcripts/us-6302230-kamen-segway-reviewed.txt",
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Research Team",
    reviewedAt: "2026-09-02",
    sourcePdfSha256: EXPECTED_PDF_SHA256,
    pageCount: 29,
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "US 6,302,230 B1\n\n(12) United States Patent",
        sourceRelationship: "Title page masthead",
      },
      {
        page: 2,
        exactSourceText: "US 6,302,230 B1\nPage 2",
        sourceRelationship: "Facsimile page 2 references cited",
      },
      {
        page: 3,
        exactSourceText: "US 6,302,230 B1\nPage 3",
        sourceRelationship: "Facsimile page 3 references cited",
      },
      {
        page: 4,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 1 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 1 of 16 (FIG. 1)",
      },
      {
        page: 5,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 2 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 2 of 16 (FIG. 2)",
      },
      {
        page: 6,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 3 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 3 of 16 (FIG. 3)",
      },
      {
        page: 7,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 4 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 4 of 16 (FIG. 4)",
      },
      {
        page: 8,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 5 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 5 of 16 (FIG. 5)",
      },
      {
        page: 9,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 6 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 6 of 16 (FIG. 6)",
      },
      {
        page: 10,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 7 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 7 of 16 (FIG. 7)",
      },
      {
        page: 11,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 8 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 8 of 16 (FIG. 8)",
      },
      {
        page: 12,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 9 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 9 of 16 (FIG. 9)",
      },
      {
        page: 13,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 10 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 10 of 16 (FIG. 10)",
      },
      {
        page: 14,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 11 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 11 of 16 (FIG. 11)",
      },
      {
        page: 15,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 12 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 12 of 16 (FIG. 12)",
      },
      {
        page: 16,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 13 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 13 of 16 (FIG. 13)",
      },
      {
        page: 17,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 14 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 14 of 16 (FIG. 14)",
      },
      {
        page: 18,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 15 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 15 of 16 (FIG. 15)",
      },
      {
        page: 19,
        exactSourceText: "U.S. Patent   Oct. 16, 2001   Sheet 16 of 16   US 6,302,230 B1",
        sourceRelationship: "Drawing sheet 16 of 16 (FIG. 16)",
      },
      {
        page: 20,
        exactSourceText: "PERSONAL MOBILITY VEHICLES AND\nMETHODS\nTECHNICAL FIELD",
        sourceRelationship:
          "Specification columns 1-2 (Technical Field, Background Art, Summary of the Invention)",
      },
      {
        page: 21,
        exactSourceText: "ment provides a device for carrying a payload including a",
        sourceRelationship: "Specification columns 3-4 (Summary of the Invention)",
      },
      {
        page: 22,
        exactSourceText: "b. operating a motorized drive arrangement, coupled to",
        sourceRelationship:
          "Specification columns 5-6 (Summary of the Invention, Brief Description of Drawings)",
      },
      {
        page: 23,
        exactSourceText: "user, as in the case of a bicycle or motorcycle or Scooter, or,",
        sourceRelationship:
          "Specification columns 7-8 (Description of Specific Embodiments, Dynamic Stability)",
      },
      {
        page: 24,
        exactSourceText: "to maintain dynamic stability, subject 10 will no longer be",
        sourceRelationship: "Specification columns 9-10 (Control loop equations and wheel torque)",
      },
      {
        page: 25,
        exactSourceText: "non-Zero K, the effect of X is to produce a specified offset",
        sourceRelationship: "Specification columns 11-12 (Pitch and lean orientation)",
      },
      {
        page: 26,
        exactSourceText: "for platform adjustment and for determining the mode of",
        sourceRelationship:
          "Specification columns 13-14 (Microcontroller architecture and sensor processing)",
      },
      {
        page: 27,
        exactSourceText: "were permitted to reach the maximum speed of which they",
        sourceRelationship:
          "Specification columns 15-16 (Headroom and balancing margin monitoring)",
      },
      {
        page: 28,
        exactSourceText: "Such as arcuate members and clusters of wheels are",
        sourceRelationship:
          "Specification columns 17-18 (Steering, alternative ground contact, Claims 1-3)",
      },
      {
        page: 29,
        exactSourceText: "4. A device according to claim 1, wherein the ground",
        sourceRelationship: "Specification columns 19-20 (Claims 4-7 conclusion)",
      },
    ],
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
        "Independent apparatus claim: it states the platform, ground-contacting module, powered automatic balancing, balancing-margin monitor, and alarm combination that defines this grant's asserted legal scope.",
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
        "Independent method claim: it recites operating the motorized drive for automatic balance, monitoring a balancing margin, generating a signal, and generating an alarm below the specified limit.",
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
      "The specification distinguishes static stability from a vehicle kept upright by a control loop. Its legal move is not a specified motor, sensor package, or production model: it is the combination of powered automatic balance with a balancing-margin monitor and an alarm. In ordinary dynamics, moving a wheel beneath a leaning payload can counter its gravitational moment; the visitor model makes that relationship visible while clearly treating all SI hardware values as modern illustrative inputs.",

    coreMechanism:
      "The grant's source-bound chain is: a powered ground-contacting module automatically balances the otherwise tipping-prone platform; the system compares present velocity with a maximum operating velocity chosen to retain acceleration potential; a monitor characterizes that balancing margin; and an alarm warns when the margin crosses a specified limit. The patent names audible, visual, tactile, and ripple-modulated alarm forms. The live SI exhibit is a modern illustrative inverted-pendulum scenario: its mass, geometry, gain, speed, torque, friction, and warning waveform are teaching inputs, not figures printed by the grant.",

    mechanicalBreakdown: [
      {
        title: "Coaxial Dual-Wheel Inverted Pendulum Chassis",
        summary:
          "A platform and ground-contacting module form a vehicle that the claim says is unstable with respect to tipping when the motorized drive is unpowered.",
        technicalDetails:
          "Figures 1 and 2 show standing-rider embodiments and ground-contacting arrangements. $I \\ddot\\theta = M g L \\sin\\theta$ is the modern small-model way to express an overturning moment; the grant does not print a mass, center-of-mass height, wheel size, or fall time.",
        archaicTerm: "system being unstable with respect to tipping",
        modernEquivalent: "dynamically balanced inverted pendulum mobile robot",
      },
      {
        title: "Inertial Gyroscope & Accelerometer Sensor Cluster",
        summary:
          "The illustrated control arrangements use pitch and wheel-rotation sensing as inputs to a control system.",
        technicalDetails:
          "Figure 5 labels a pitch sensor, wheel-rotation sensors, and pitch-rate sensor; Figure 3 depicts state-feedback blocks. The grant does not identify a count, sampling rate, redundancy arrangement, IMU technology, or filter implementation. A contemporary sensor-fusion interpretation is therefore pedagogical, not archival fact.",
        archaicTerm: "attitude sensor arrangement",
        modernEquivalent: "MEMS 6-axis IMU with Kalman sensor fusion",
      },
      {
        title: "Balancing Margin Supervisory Monitor",
        summary:
          "A real-time safety algorithm tracking the acceleration headroom between current operating velocity and motor physical saturation limits.",
        technicalDetails:
          "Claim 1 defines the balancing margin as the difference between maximum operating velocity and present velocity. A normalized reserve calculation in the exhibit is a modern illustrative teaching device; the grant does not print its algebraic form, threshold, torque reserve, road-bump response, or deceleration profile.",
        archaicTerm: "means for monitoring a balancing margin",
        modernEquivalent: "dynamic torque headroom supervisory safety observer",
      },
      {
        title: "Haptic Torque Ripple & Platform Shudder Alarm",
        summary: "Claim 2 specifies ripple modulation of motorized-drive power as an alarm form.",
        technicalDetails:
          "The source says that ripple modulation can provide an alarm perceived as a rumbling ride. It does not disclose a waveform, frequency, torque amplitude, platform acceleration, or human-factors result. The exhibit therefore signals ripple state without presenting those unprinted quantities as patent facts.",
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
          "This is a modern illustrative mechanics model of the source-described unstable/automatically balanced relationship. It teaches how acceleration can counter a gravitational moment, but the grant does not supply its mass, geometry, acceleration law, or performance envelope.",
      },
      {
        principle: "State-Feedback Control Diagram (Modern Interpretation)",
        formula:
          "\\mathbf{u}(t) = -\\mathbf{K} \\mathbf{x}(t) = - (K_\\theta \\theta + K_{\\dot\\theta} \\dot\\theta + K_x x + K_v v)",
        explanation:
          "Figure 3 depicts feedback terms labeled $K_1$ through $K_4$. Reading that diagram through an LQR formulation is a modern control-theory interpretation; the patent does not name an LQR, give calibrated gains, a cost function, pole locations, or a damping result.",
      },
      {
        principle: "Ground Traction Limit & Acceleration Headroom",
        formula:
          "F_{\\text{drive}} = \\frac{\\tau_{\\text{motor}}}{R} \\le \\mu_{\\text{ground}} M g",
        explanation:
          "This modern tire-contact bound supplies an honest refusal boundary for the illustrative model. The grant identifies an underlying surface but does not disclose a friction coefficient, tire model, or slip threshold.",
      },
    ],

    whyItMattersToday:
      "The document is a useful primary record for studying a persistent robotics problem: a mechanically tipping-prone platform can be kept upright only while its drive has enough authority to respond. Its balancing-margin claim makes that reserve explicit. The exhibit connects this legal topology to a clearly labeled modern mechanics model rather than asserting an undocumented line of technical descent or product performance.",
  },

  historicalContext: {
    problemStatement:
      "The specification frames the problem as transporting a standing user over an irregular surface without requiring a statically stable resting position. It contrasts static stability with dynamic stability maintained either by a user or by a control loop.",
    priorArtLimitations: [
      "The source says that vehicles generally rely on static stability under foreseen placement conditions, while bicycles, motorcycles, and scooters can instead rely on user-maintained dynamic stability.",
      "The grant does not provide a comparative turning-radius, wheelchair, terrain, motor-saturation, or accident-rate study; this exhibit does not supply one in its place.",
    ],
    breakthroughInsight:
      "The independently claimed addition is supervisory as well as balancing: Claim 1 defines a balancing margin from present and maximum operating velocity, asks a monitor to characterize it, and calls for an alarm below a specified limit. Claim 2 specifies ripple modulation as one alarm form.",
    patentWars: [],
    civilizationalImpact:
      "The grant provides a compact primary-source case study in active balance, control authority, and rider-facing warning. Claims about later market share, commercial deployment, litigation, or technical lineage require separately reviewed authoritative records and are intentionally absent here.",
    aftermath:
      "This record is limited to the reviewed grant, its pinned facsimile, and the source-faithful editorial edition. It makes no unlocated assertion about a later launch, acquisition, litigation, award, or commercial outcome.",
    funFact:
      "The printed drawings span several embodiments: two-wheel and clustered arrangements, an unicycle, standing rider configurations, control diagrams, and a force diagram. The visitor-facing record identifies the drawings by their printed figure numbers.",
    sideNotes: [
      "Claim 1 defines balancing margin as the difference between maximum operating velocity and present velocity; it does not print a percentage reserve or torque rating.",
      "Claim 2 identifies ripple modulation of motorized-drive power. The source does not print a vibration frequency or amplitude.",
    ],
  },

  drawings: [
    {
      figureNumber: "1",
      title: "FIG. 1: Side View of Standing Personal Vehicle",
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
      title: "FIG. 2: Alternate Personal Vehicle with Wheel Cluster",
      caption:
        "Perspective drawing of an alternate standing-rider vehicle with the printed wheel-cluster arrangement.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-2-platform",
          figureRef: "Fig. 2",
          label: "Platform",
          element: "12",
          description: "Printed platform reference numeral",
          x: 50,
          y: 72,
        },
        {
          id: "callout-2-grips",
          figureRef: "Fig. 2",
          label: "Handlebar",
          element: "14",
          description: "Printed handlebar reference numeral",
          x: 50,
          y: 18,
        },
        {
          id: "callout-2-wheels",
          figureRef: "Fig. 2",
          label: "Wheel Cluster",
          element: "28",
          description: "Printed clustered ground-contacting-wheel reference numeral",
          x: 30,
          y: 77,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "FIG. 3: Simplified Balance Control Strategy",
      caption:
        "Block diagram showing a plant, feedback terms K1 through K4, and the two printed integrator blocks.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-3-plant",
          figureRef: "Fig. 3",
          label: "Plant",
          element: "61",
          description: "Printed plant block in the simplified control strategy",
          x: 53,
          y: 28,
        },
        {
          id: "callout-3-feedback",
          figureRef: "Fig. 3",
          label: "Feedback Terms",
          element: "K1–K4",
          description: "Printed feedback gains in the simplified diagram",
          x: 49,
          y: 53,
        },
        {
          id: "callout-3-pitch-integrator",
          figureRef: "Fig. 3",
          label: "Pitch Integrator",
          element: "62",
          description: "Printed integrator block for the pitch-rate path",
          x: 68,
          y: 52,
        },
        {
          id: "callout-3-position-integrator",
          figureRef: "Fig. 3",
          label: "Position Integrator",
          element: "63",
          description: "Printed integrator block for the position-rate path",
          x: 68,
          y: 73,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "FIG. 4: Directional Command Diagram",
      caption:
        "Printed directional diagram with forward, reverse, left-turn, and right-turn commands.",
      svgType: "kamen-segway",
      callouts: [
        {
          id: "callout-4-forward",
          figureRef: "Fig. 4",
          label: "Forward",
          element: "FORWARD",
          description: "Printed forward direction label",
          x: 50,
          y: 22,
        },
        {
          id: "callout-4-left-turn",
          figureRef: "Fig. 4",
          label: "Left Turn",
          element: "LEFT TURN",
          description: "Printed left-turn direction label",
          x: 18,
          y: 53,
        },
        {
          id: "callout-4-right-turn",
          figureRef: "Fig. 4",
          label: "Right Turn",
          element: "RIGHT TURN",
          description: "Printed right-turn direction label",
          x: 82,
          y: 53,
        },
        {
          id: "callout-4-reverse",
          figureRef: "Fig. 4",
          label: "Reverse",
          element: "REVERSE",
          description: "Printed reverse direction label",
          x: 50,
          y: 83,
        },
      ],
    },
  ],
};
