import type { Patent } from "@/types/patent";
import { roombaArchivalEdition } from "../editions/roombaEdition";

/** The archival edition is the sole literal source for every printed claim. */
export function manualClaimText(number: number): string {
  const block = roombaArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (!block || block.kind !== "claim") {
    throw new Error(`Roomba manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const roombaPatent: Patent = {
  id: "us-6594844-roomba",
  patentNumber: "US 6,594,844",
  title: "Robot Obstacle Detection System",
  shortTitle: "Optical Cliff and Wall Detection for an Autonomous Cleaning Robot",
  subtitle: "Intersecting Emitter and Detector Fields for Surface-Height and Wall Sensing",
  inventors: ["Joseph L. Jones"],
  inventorLocation: "Acton, Massachusetts",
  grantDate: "2003-07-22",
  filingDate: "2001-01-24",
  era: "Internet & Modern Computing (1990–Present)",
  category: "consumer",
  categoryLabel: "Autonomous Robotics & Consumer Automation",
  summary:
    "US 6,594,844 protects a low-cost optical obstacle and wall detection system for an autonomous cleaning robot. An emitter's directed field intersects a photon's detector field at a finite region; the circuit uses the presence or absence of reflected signal to avoid stairs and unsuitable obstacles or to reacquire a wall with progressively smaller turning radii. The grant issued July 22, 2003 from an application filed January 24, 2001, claiming priority to provisional 60/177,703 filed January 24, 2000.",
  heroQuote:
    "The invention results from the realization that a low cost, accurate, and easy to implement system ... can be effected by intersecting the field of view of a detector with the field of emission of a directed beam at a predetermined region and then detecting whether the floor or wall occupies that region.",
  originalPdfUrl: "/patents/pdfs/us-6594844-roomba.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6594844B2/en",
  usptoClassification: "A47L 9/28 (Domestic cleaning robots; Automated floor treaters)",
  archivalEdition: roombaArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6594844-roomba-reviewed.txt",
    pageCount: 26,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (BrightPelican; source-static repair)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e",
  },
  originalText: `UNITED STATES PATENT
Jones
Patent No.: US 6,594,844 B2
Date of Patent: Jul. 22, 2003

ROBOT OBSTACLE DETECTION SYSTEM
Inventor: Joseph L. Jones, Acton, MA (US)
Assignee: iRobot Corporation, Burlington, MA

ABSTRACT
A robot obstacle detection system including a robot housing which navigates with respect to a surface and a sensor subsystem having a defined relationship with respect to the housing and aimed at the surface for detecting the surface. The sensor subsystem includes an optical emitter which emits a directed beam having a defined field of emission and a photon detector having a defined field of view which intersects the field of emission of the emitter at a region. A circuit in communication with a detector redirects the robot when the surface does not occupy the region to avoid obstacles. A similar system is employed to detect walls.

PRIORITY CLAIM
This invention claims priority from Provisional Application Ser. No. 60/177,703 filed Jan. 24, 2000.

FIELD OF THE INVENTION
This invention relates to an obstacle detection system for an autonomous cleaning robot.

BACKGROUND OF THE INVENTION
There is a long felt need for autonomous robotic cleaning devices for dusting, mopping, vacuuming, and sweeping operations. Although technology exists for complex robots which can, to some extent, “see” and “feel” their surroundings, the complexity, expense and power requirements associated with these types of robotic subsystems render them unsuitable for the consumer marketplace.

SUMMARY OF THE INVENTION
It is therefore an object of this invention to provide a robot obstacle detection system which is simple in design, low cost, accurate, easy to implement, and easy to calibrate. It is a further object of this invention to provide such a robot detection system which prevents an autonomous cleaning robot from driving off a stair or over an obstacle which is too high or too low. It is a further object of this invention to provide a robotic wall detection system which is low cost, accurate, easy to implement and easy to calibrate.

The invention results from the realization that a low cost, accurate, and easy to implement system for either preventing an autonomous cleaning robot from driving off a stair or over an obstacle which is too high or too low and/or for more smoothly causing the robot to follow a wall can be effected by intersecting the field of view of a detector with the field of emission of a directed beam at a predetermined region and then detecting whether the floor or wall occupies that region.`,
  plainEnglishExplanation: {
    overview:
      "The patent addresses a narrower engineering bottleneck than a complete Roomba navigation policy: sonar and tactile systems were too costly, complex, power-hungry, or unreliable for a battery robot. Jones's move was to make geometry do the discrimination. A directed optical field and a detector field overlap only in a selected finite region, so a missing floor signal identifies a drop or unsuitable obstacle and a wall signal identifies a boundary.",
    coreMechanism:
      "The emitter's optical power occupies a defined field of emission and the detector accepts photons only within its field of view. Their intersection is the measurement region. With a downward sensor, normal floor overlap produces a reflected, modulated signal; when a stair or too-high/low obstacle removes the floor from that region, the circuit emits an avoidance command. With wall optics, a reflected signal marks the wall and the control logic turns away, then back toward it through decreasing radii of curvature. The grant specifies the optical feedback architecture, not a particular spiral path or random-number algorithm.",
    mechanicalBreakdown: [
      {
        title: "Finite Optical Intersection",
        summary:
          "Angled emitter and detector fields create a selected region where reflected photons are expected.",
        technicalDetails:
          "The source geometry uses the overlap of two fields rather than a raw brightness threshold: $R = F_{emission} \\cap F_{view}$. A nominal floor or wall occupies R; a changed height or boundary removes it and changes the detector output.",
        archaicTerm: "field of emission",
        modernEquivalent: "Emitter radiation cone or angular emission field",
      },
      {
        title: "Modulated Infrared Sensor",
        summary:
          "An infrared source and tuned photon detector reject ambient optical conditions while preserving the geometry test.",
        technicalDetails:
          "The preferred embodiment modulates the infrared emitter at several kilohertz and tunes the detector to that frequency. The detector circuit amplifies, rectifies, and thresholds the selected-band signal before sending a logic output to the robot controller.",
        archaicTerm: "photon detector",
        modernEquivalent: "Photodetector or phototransistor receiver",
      },
      {
        title: "Wall Reacquisition Logic",
        summary:
          "Wall detection turns away on a hit and returns along progressively smaller curvature radii.",
        technicalDetails:
          "The controller uses the detector state as feedback. When the wall occupies the intersection region it turns away; after the wall leaves, it turns back toward the wall and decreases the radius of curvature until reflection returns. This is a bounded geometric behavior, not a claim to statistical floor coverage.",
        archaicTerm: "radiuses of curvature",
        modernEquivalent: "Successively smaller path-curvature radii",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Geometric field intersection",
        formula: "R = F_{emission} \\cap F_{view}",
        explanation:
          "The source's sensor does not infer distance from a generic intensity law. It selects a finite overlap region of two optical fields and tests whether the expected floor or wall occupies that region. The patent gives this region as the design variable for rejecting stairs, unsuitable obstacles, and reflectivity-dependent errors.",
      },
      {
        principle: "Modulated optical detection",
        formula: "S_{det}(t) = LPF\\{R_{photo}[I_0 m(t)]\\}",
        explanation:
          "The preferred circuit modulates the infrared source at a several-kilohertz frequency, amplifies the photodetector signal, blocks DC, detects a peak, and compares it with a reference. The formula is a presentation of the described signal chain, not a numerical performance claim.",
      },
      {
        principle: "Differential-drive curvature",
        formula: "\\kappa = \\frac{\\omega_r - \\omega_l}{L}",
        explanation:
          "The figures and description show a cleaning robot changing path curvature in wall following. This kinematic relation describes how unequal wheel rates create curvature, while the claim's distinctive limitation is the detector-driven sequence of decreasing radii, not a fixed wheel geometry.",
      },
    ],
    whyItMattersToday:
      "The durable lesson is source-bounded sensor design: an inexpensive emitter, detector, collimator, modulation circuit, and explicit control response can handle stairs and room boundaries without sonar or a global map. Later domestic robots may add lidar, cameras, or learned maps, but this patent's optical overlap and wall-reacquisition ideas remain legible as a low-cost safety and boundary-sensing pattern.",
  },
  historicalContext: {
    problemStatement:
      "The specification identifies a long-felt need for battery-powered autonomous dusting, mopping, vacuuming, and sweeping robots. It says available sonar systems were too complex or expensive, while tactile sensors were inefficient, and the robot still had to distinguish stairs and unsuitable obstacles from traversable thresholds.",
    priorArtLimitations: [
      "Sonar obstacle and wall sensors described as too complex or expensive for a battery-operated cleaning robot",
      "Tactile sensors described as inefficient for reliable obstacle and wall detection",
      "Single intensity thresholds confounded by surface reflectivity and specular scattering",
    ],
    breakthroughInsight:
      "The source's breakthrough is geometric calibration: intersect the detector's field of view with a directed emitter field at a finite region, then test whether the floor or wall occupies that region. Angled collimators reduce reflectivity and specular-scattering errors, and the wall controller returns through decreasing radii of curvature.",
    patentWars: [
      {
        rivalName: "Electrolux (Trilobite) & SharkNinja / bObsweep",
        rivalClaim:
          "Electrolux commercialized the Trilobite in 2001 using ultrasound acoustic pinging, while later competitors (SharkNinja, bObsweep) attempted to copy Roomba's optical wall-following and cliff-detection sensors.",
        conflictDetails:
          "iRobot brought patent infringement actions before the US International Trade Commission (ITC Investigation No. 337-TA-1057) and federal court against multiple manufacturers, asserting US Patent No. 6,594,844 and companion obstacle navigation patents.",
        resolution:
          "The ITC issued exclusion orders barring infringing robotic vacuums from entering the United States, and competitors settled by licensing or redesigning sensor geometries.",
        legalOutcome:
          "US Patent No. 6,594,844 protected iRobot's optical obstacle and boundary sensing architecture, helping Roomba sell over 40 million units worldwide as the most successful consumer autonomous robot.",
      },
    ],
    civilizationalImpact:
      "Within the boundaries of this grant, the contribution is a low-cost optical safety and boundary-sensing subsystem for autonomous cleaning robots. It does not by itself establish a global map, an expanding spiral, or a randomized coverage guarantee.",
    aftermath:
      "The patent issued July 22, 2003 as US 6,594,844 B2. This record makes no unsupported claim about later litigation, sales, or market share; those belong to separate documented sources.",
    sideNotes: [
      "The specification gives a preferred cliff-sensor geometry with 22 mm by 53 mm housing dimensions, 3 mm collimator tubes, a 60° tube angle, and a 29.00 mm intersection region.",
      "For wall detection it describes parallel-to-floor optical axes intersecting at about 80° and a volume approximately 2.6 inches ahead of the robot shell when travelling parallel to a wall.",
    ],
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Robot Approaching a Downward Stair",
      caption: "FIG. 1 is the source schematic of robot 10 approaching downward stair 12.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-robot",
          figureRef: "Fig. 1",
          label: "10",
          element: "Robot 10",
          description: "Autonomous cleaning robot approaching a floor drop in the source drawing.",
          x: 50,
          y: 50,
        },
        {
          id: "rm-downward-stair",
          figureRef: "Fig. 1",
          label: "12",
          element: "Downward stair 12",
          description:
            "A floor drop that the optical cliff detector must distinguish from traversable surface.",
          x: 50,
          y: 20,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Robot Approaching an Upward Stair",
      caption: "FIG. 2 is the source schematic of robot 10 approaching upward stair 14.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-main-brush",
          figureRef: "Fig. 2",
          label: "10",
          element: "Robot 10",
          description: "Autonomous cleaning robot in the source drawing's upward-stair approach.",
          x: 50,
          y: 60,
        },
        {
          id: "rm-cliff-sensor",
          figureRef: "Fig. 2",
          label: "14",
          element: "Upward stair 14",
          description:
            "A rise that may be too high for the robot and must be detected by the optical subsystem.",
          x: 20,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Robot Approaching a Floor Obstacle",
      caption: "FIG. 3 is the source schematic of robot 10 approaching obstacle 16 on a floor.",
      svgType: "roomba",
      callouts: [
        {
          id: "rm-wall-sensor",
          figureRef: "Fig. 3",
          label: "16",
          element: "Floor obstacle 16",
          description:
            "A floor obstruction such as an extension cord, rug threshold, or room transition that the robot may traverse or avoid according to height.",
          x: 70,
          y: 40,
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
        "This independent claim covers a robot housing, a surface-aimed optical emitter and photon detector whose directed fields intersect at a finite region, plus detector-connected circuitry that redirects the robot when the expected floor or other surface is absent from that region.",
      keyInnovations: [
        "Optical obstacle triangulation",
        "Defined intersection volume",
        "Dynamic deflection circuit",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "This dependent claim adds multiple sensor subsystems distributed around the robot housing and logic that can identify when any detector in that distributed set has failed to receive the corresponding emitter beam, making obstacle sensing redundant rather than single-point.",
      keyInnovations: ["Multi-sensor perimeter array", "Distributed obstacle detection"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(3),
      plainEnglish:
        "This dependent claim limits the system to a robot that also carries a surface-cleaning brush. The brush is an additional cleaning organ; the claim does not turn the optical geometry into a brush design or require any particular brush shape or drive.",
      keyInnovations: ["Integrated floor cleaning brush", "Robotic vacuum sweep integration"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(4),
      plainEnglish:
        "This dependent claim specifies infrared hardware for the emitter and detector. The legal addition is the optical spectrum and photon-responsive detector, while the finite intersection and detector-connected redirecting circuit remain the claim-one arrangement.",
      keyInnovations: ["Infrared optical triangulation", "Photodiode emitter-detector pair"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(5),
      plainEnglish:
        "This dependent claim adds a modulator electrically connected to the infrared source so the directed infrared beam is varied at a predetermined frequency. It describes a coded optical carrier for the claimed sensor, not a general-purpose navigation clock.",
      keyInnovations: ["Modulated infrared carrier", "Ambient light noise rejection"],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(6),
      plainEnglish:
        "This dependent claim requires the infrared photon detector to be tuned to the same predetermined modulation frequency produced by the source modulator. That frequency matching narrows the detector response while preserving the claimed emitter, intersecting fields, and output circuit.",
      keyInnovations: ["Frequency-selective photodiode tuning", "High-SNR optical detection"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(7),
      plainEnglish:
        "This dependent claim adds an emitter collimator around the infrared source and a detector collimator around the photon detector. Those tubes or equivalent optics define the directed emission field and detector field of view that the system uses geometrically.",
      keyInnovations: ["Optical collimator apertures", "Restricted beam geometry"],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [7],
      originalText: manualClaimText(8),
      plainEnglish:
        "This dependent claim further requires the two collimators to be angled relative to the surface. Their geometry creates a finite overlap region, allowing height or surface position to be inferred from whether reflected infrared energy reaches the detector.",
      keyInnovations: ["Angled optical triangulation", "Focal convergence volume"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "This independent claim shifts the detected object from floor surface to wall. It covers a wall-aimed emitter and detector with intersecting fields plus circuitry that redirects the robot when a wall occupies the finite optical region, supporting wall detection without sonar.",
      keyInnovations: ["Lateral wall proximity sensing", "Boundary tracking circuit"],
    },
    {
      number: 10,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(10),
      plainEnglish:
        "This dependent wall claim adds multiple sensor subsystems spaced on the housing and logic that detects whether any detector has detected its emitter beam. The added redundancy applies to the wall-detection arrangement of claim nine rather than replacing its optical intersection.",
      keyInnovations: ["Multi-point wall tracking", "Distributed perimeter detection"],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(11),
      plainEnglish:
        "This dependent wall claim adds a surface-cleaning brush to the robot that uses the claimed wall sensor and redirecting circuit. It protects the combination of perimeter sensing and cleaning hardware, without claiming the brush as an optical component.",
      keyInnovations: ["Baseboard edge sweep brush", "Wall-guided cleaning"],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(12),
      plainEnglish:
        "This dependent wall claim specifies an infrared light source as the emitter and an infrared photon detector. The wall still occupies the emitter-detector intersection region, and the circuit still uses that condition to redirect the robot.",
      keyInnovations: ["Infrared wall triangulation", "Proximity photodiode sensing"],
    },
    {
      number: 13,
      isIndependent: false,
      dependsOn: [12],
      originalText: manualClaimText(13),
      plainEnglish:
        "This dependent wall claim adds a modulator that pulses the directed infrared beam at a predetermined frequency. It narrows the wall sensor's source, while retaining claim twelve's infrared emitter and photon detector and claim nine's wall-region logic.",
      keyInnovations: ["Modulated wall-tracking beam", "Sunlight immunity"],
    },
    {
      number: 14,
      isIndependent: false,
      dependsOn: [13],
      originalText: manualClaimText(14),
      plainEnglish:
        "This dependent wall claim tunes the infrared photon detector to the predetermined frequency used by the source modulator. The synchronized optical carrier makes the wall signal distinguishable while retaining the claimed field intersection and redirecting output.",
      keyInnovations: ["Frequency-tuned wall detection", "Bandpass signal filtering"],
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [12],
      originalText: manualClaimText(15),
      plainEnglish:
        "This dependent wall claim adds collimators around the infrared emitter and photon detector to constrain their emission and viewing fields. The constrained geometry defines where a wall can reflect energy into the detector under the claim-nine circuit.",
      keyInnovations: ["Directional wall collimation", "Constrained lateral field"],
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [15],
      originalText: manualClaimText(16),
      plainEnglish:
        "This dependent wall claim requires the wall-sensor emitter and detector collimators to be angled with respect to the surface. The angle is an optical alignment limitation, not a claim to a particular motor trajectory or wall material.",
      keyInnovations: ["Angled wall collimation", "Elevation-compensated sensing"],
    },
    {
      number: 17,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(17),
      plainEnglish:
        "This dependent wall claim specifies two controller responses: turn away while the wall occupies the intersection region, then turn back toward it after the wall leaves. The circuit therefore implements the source's wall-following reacquisition behavior.",
      keyInnovations: ["Bang-bang wall following", "Hysteresis boundary control"],
    },
    {
      number: 18,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(18),
      plainEnglish:
        "This dependent wall claim adds a smooth reacquisition path. After turning away and losing the wall signal, the circuit turns back through successively decreasing radii of curvature until the wall again occupies the optical intersection region.",
      keyInnovations: ["Iterative curvature wall tracking", "Smooth perimeter hugging"],
    },
    {
      number: 19,
      isIndependent: true,
      originalText: manualClaimText(19),
      plainEnglish:
        "This independent combination claim covers an autonomous robot with a first surface-aimed optical sensor for obstacles and a second sensor aimed at or near the travel direction for walls. Each sensor uses emitter and detector fields intersecting at a finite predetermined region.",
      keyInnovations: ["Dual-axis optical triangulation", "Integrated cliff and wall avoidance"],
    },
    {
      number: 20,
      isIndependent: true,
      originalText: manualClaimText(20),
      plainEnglish:
        "This independent sensor claim covers the optical emitter, photon detector, and circuit as a reusable subsystem. When a wall is absent from the intersection region, its output directs the robot back toward the wall, making the feedback behavior part of the claimed subsystem.",
      keyInnovations: ["Negative-feedback wall seeking", "Autonomous perimeter steering"],
    },
  ],
  stats: {
    totalClaims: 20,
    independentClaims: 4,
  },
};
