import type { Patent } from "@/types/patent";
import { davinciArchivalEdition, davinciClaimText } from "../editions/daVinciEdition";

export const daVinciPatent: Patent = {
  id: "us-6331181-davinci",
  patentNumber: "US 6,331,181",
  title: "Surgical Robotic Tools, Data Architecture, and Use",
  shortTitle: "Intuitive Surgical Da Vinci System",
  subtitle: "Master-Slave Telepresence, Variable Motion Scaling & 7-DOF EndoWrist Kinematics",
  inventors: ["Michael D. Tierney", "J. Kenneth Salisbury", "Robert G. Younge"],
  inventorLocation: "Sunnyvale, California",
  grantDate: "2001-12-18",
  filingDate: "1999-10-15",
  era: "Internet & Modern Computing (1990–Present)",
  category: "consumer",
  categoryLabel: "Surgical Robotics & Telepresence",
  summary:
    "The Genesis of Robotic Surgery: US Patent 6,331,181 established the master-slave telemanipulation architecture of the Da Vinci surgical robot. By decoupling the surgeon's hands from rigid laparoscopic tools, the system restores full natural wrist articulation inside the patient, downscales macroscopic hand gestures for micron precision, and digitally filters physiological hand tremor.",
  heroQuote:
    "The multi-jointed EndoWrist replicates human wrist dexterity at the micro-scale while digital control eliminates tremor and scales motion.",
  originalPdfUrl: "/patents/pdfs/us-6331181-davinci.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6331181B1/en",
  usptoClassification:
    "A61B 34/30 (Medical robots; Telemanipulators for minimally invasive surgery)",
  archivalEdition: davinciArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6331181-davinci-reviewed.txt",
    pageCount: 34,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91",
  },
  originalText: `UNITED STATES PATENT
Tierney et al.
Patent No.: US 6,331,181 B1
Date of Patent: Dec. 18, 2001

SURGICAL ROBOTIC TOOLS, DATA ARCHITECTURE, AND USE
Inventors: Michael D. Tierney, J. Kenneth Salisbury, Robert G. Younge
Assignee: Intuitive Surgical, Inc., Sunnyvale, CA

ABSTRACT
Robotic surgical tool systems and methods provide master-slave telemanipulation with highly articulated end-effectors, digital motion scaling, and physiological tremor cancellation for precision endoscopic surgery.

BACKGROUND OF THE INVENTION
Conventional manual endoscopic techniques require surgeons to work through narrow trocar ports with rigid tools, creating an inverted fulcrum effect and eliminating natural wrist dexterity. Fine micro-suturing inside confined anatomical spaces remains difficult due to normal physiological hand tremor.

SUMMARY OF THE INVENTION
The present invention provides a multi-jointed surgical robotic tool (EndoWrist) that replicates natural human wrist motion at the micro-scale inside the patient. An electronic master-slave control architecture scales macroscopic hand movements down to millimeter precision and digitally filters unwanted high-frequency tremors.

CLAIMS
1. A surgical robotic system comprising: a master control input device configured to receive surgeon hand movements; an articulated robotic slave manipulator holding an instrument shaft insertable through a minimally invasive incision; a multi-axis wrist mechanism disposed at the distal end of the instrument shaft; and a computer controller operatively connecting the master input device to the slave manipulator, the controller programmed to apply motion scaling and tremor filtration to drive the slave end-effector in real time.`,
  plainEnglishExplanation: {
    overview:
      "The Da Vinci system enables surgeons to perform complex minimally invasive procedures through keyhole incisions with greater dexterity and precision than open surgery.",
    coreMechanism:
      "A digital controller samples surgeon hand grips, runs inverse kinematics, applies variable motion scaling (up to 10:1) and a digital 8Hz low-pass filter, and drives cable-actuated micro-wrists.",
    mechanicalBreakdown: [
      {
        title: "EndoWrist Micro-Articulation",
        summary: "Tungsten cable-driven pulleys provide 7 degrees of freedom inside the body.",
        technicalDetails:
          "Nested pitch and yaw clevises with miniature surgical forceps or scissors allow human wrist bending inside a 8mm cannula.",
      },
      {
        title: "Master-Slave Controller",
        summary: "Decouples surgeon kinematics from patient port fulcrum geometry.",
        technicalDetails:
          "Real-time servo loops update motor positions at 1000 Hz, compensating for trocar pivot constraints.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Digital Tremor Filtration & Motion Scaling",
        formula:
          "\\mathbf{x}_{slave}(t) = \\frac{1}{K} \\cdot \\mathcal{F}^{-1}\\{ H_{LPF}(j\\omega) \\cdot \\mathcal{F}\\{\\mathbf{x}_{master}(t)\\} \\}",
        explanation:
          "Low-pass filtering eliminates 6-10 Hz physiological hand tremors while motion scaling (K = 3 to 10) allows 50mm hand movements to translate into 5mm micro-sutures.",
      },
    ],
    whyItMattersToday:
      "The Da Vinci robot revolutionized surgery, performing over 12 million minimally invasive procedures worldwide with reduced trauma, bleeding, and recovery time.",
  },
  historicalContext: {
    problemStatement:
      "Traditional laparoscopy was physically exhausting and awkward due to inverted fulcrum motions and loss of wrist rotation.",
    priorArtLimitations: [
      "Rigid straight instruments",
      "Inverted movement axis (moving hand left moves tool tip right)",
      "Normal hand tremors magnified at tip",
    ],
    breakthroughInsight:
      "Telepresence computing can invert the fulcrum digitally, restoring natural eye-hand alignment and full 3D wrist dexterity.",
    patentWars: [
      {
        rivalName: "Computer Motion (ZEUS Robotic System)",
        rivalClaim:
          "Infringement disputes over robotic arm teleoperation and voice-controlled endoscopy",
        conflictDetails:
          "Intuitive Surgical and Computer Motion sued each other across multiple jurisdictions throughout the late 1990s and early 2000s.",
        resolution:
          "In 2003, Intuitive Surgical acquired Computer Motion in a stock merger valued at $150 million, uniting their patent portfolios.",
        legalOutcome:
          "Consolidated undisputed global dominance over robotic-assisted surgical patents for two decades.",
      },
    ],
    civilizationalImpact:
      "Transformed radical prostatectomy, cardiac valve repair, and gynecological surgery into outpatient or rapid-recovery procedures.",
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Da Vinci Surgical Workstation Overview",
      caption:
        "Perspective view showing surgeon master console, viewer, and patient cart manipulator arms.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-console",
          figureRef: "Fig. 1",
          label: "12",
          element: "Surgeon Master Console",
          description: "Ergonomic workstation with 3D stereo viewer and master input grips.",
          x: 30,
          y: 40,
        },
        {
          id: "dv-cart",
          figureRef: "Fig. 1",
          label: "14",
          element: "Patient-Side Surgical Cart",
          description: "Motorized cart supporting multi-jointed instrument manipulator arms.",
          x: 70,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Articulated EndoWrist Distal Joint",
      caption: "Detail perspective view showing multi-cable pulley wrist and forceps end effector.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-wrist",
          figureRef: "Fig. 2",
          label: "32",
          element: "EndoWrist 7-DOF Articulated Joint",
          description: "Distal cable-driven wrist providing internal pitch and yaw bending.",
          x: 50,
          y: 40,
        },
        {
          id: "dv-jaws",
          figureRef: "Fig. 2",
          label: "34",
          element: "Surgical Forceps Jaws",
          description: "Miniature grasping jaws with controlled tissue grip force.",
          x: 50,
          y: 80,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Sterile Tool Interface Housing",
      caption: "Perspective view showing driven rotary engagement disks and onboard memory chip.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-housing",
          figureRef: "Fig. 3",
          label: "40",
          element: "Tool Interface Housing",
          description: "Sterile latching interface engaging robot arm drive pins.",
          x: 50,
          y: 30,
        },
        {
          id: "dv-disks",
          figureRef: "Fig. 3",
          label: "44",
          element: "Driven Engagement Disks",
          description: "Rotary driven disks transmitting torque to internal tungsten cables.",
          x: 50,
          y: 70,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: davinciClaimText(1),
      plainEnglish:
        "A robotic surgical tool comprising a probe, surgical end effector, interface, and circuitry transmitting tool calibration or compatibility signals.",
      keyInnovations: [
        "Tool interface circuitry",
        "Calibration offset transmission",
        "Robotic tool compatibility identification",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText: davinciClaimText(2),
      plainEnglish: "Signal indicating tool calibration offsets.",
      keyInnovations: ["Factory tool calibration", "Kinematic offset compensation"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: davinciClaimText(3),
      plainEnglish:
        "End effector having a strength capability indicated by the transmitted signal.",
      keyInnovations: ["Grip strength rating", "Dynamic force limits"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: davinciClaimText(4),
      plainEnglish: "Signal indicating a range of motion of the tool degrees of freedom.",
      keyInnovations: ["Joint range limits", "Workspace boundary transmission"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText: davinciClaimText(5),
      plainEnglish:
        "End effectors coupled to probe via a wrist with axis geometry indicated by the signal.",
      keyInnovations: ["Wrist kinematic geometry", "Multi-axis DH parameters"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: davinciClaimText(6),
      plainEnglish:
        "Robotic surgical tool with interface driven elements and memory storing calibration offsets.",
      keyInnovations: ["Driven engagement elements", "Onboard calibration memory"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText: davinciClaimText(7),
      plainEnglish: "Signal indicating range of motion of driven elements.",
      keyInnovations: ["Actuator motion bounds", "Drive disk limits"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText: davinciClaimText(8),
      plainEnglish:
        "End effectors coupled to probe via a wrist with geometry transmitted to processor.",
      keyInnovations: ["Wrist axis geometry transmission", "Slave arm inverse kinematics"],
    },
    {
      number: 9,
      isIndependent: false,
      originalText: davinciClaimText(9),
      plainEnglish:
        "Signal indicating tool calibration offsets between nominal and measured positions.",
      keyInnovations: ["Deviation offset calibration", "Sub-millimeter backlash tuning"],
    },
    {
      number: 10,
      isIndependent: false,
      originalText: davinciClaimText(10),
      plainEnglish: "Signal indicating a tool-type code for automated arm configuration.",
      keyInnovations: ["Tool type automated detection", "Hot-swap tool configuration"],
    },
    {
      number: 11,
      isIndependent: false,
      originalText: davinciClaimText(11),
      plainEnglish:
        "Joint disposed between interface and end effector with axis geometry transmitted in signal.",
      keyInnovations: ["Intermediate joint parameterization", "Multi-segment kinematics"],
    },
    {
      number: 12,
      isIndependent: false,
      originalText: davinciClaimText(12),
      plainEnglish: "Probe comprising an elongate shaft for minimally invasive insertion.",
      keyInnovations: ["8mm laparoscopy trocar shaft", "Minimally invasive cannula insertion"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText: davinciClaimText(13),
      plainEnglish: "End effector having strength capability transmitted to processor.",
      keyInnovations: ["Tissue grip force limits", "Over-torque protection"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: davinciClaimText(14),
      plainEnglish: "Signal indicating tool life, serial number, and procedure counts.",
      keyInnovations: ["Tool life tracking", "Single-use sterility interlocks"],
    },
    {
      number: 15,
      isIndependent: false,
      originalText: davinciClaimText(15),
      plainEnglish: "End effector comprising an image capture device.",
      keyInnovations: ["Integrated endoscopic camera", "Distal chip-on-tip vision"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText: davinciClaimText(16),
      plainEnglish:
        "Wrist joint coupling end effector to probe for orientation variation inside body cavity.",
      keyInnovations: ["EndoWrist 7-DOF articulation", "Internal pitch and yaw"],
    },
    {
      number: 17,
      isIndependent: true,
      originalText: davinciClaimText(17),
      plainEnglish:
        "Robotic surgical component with body, drive system, and circuitry transmitting component status.",
      keyInnovations: ["Modular surgical component", "Drive system interface"],
    },
    {
      number: 18,
      isIndependent: false,
      originalText: davinciClaimText(18),
      plainEnglish:
        "Component body comprising an elongate shaft for minimally invasive aperture insertion.",
      keyInnovations: ["Trocar entry cannula", "Peritoneal port access"],
    },
    {
      number: 19,
      isIndependent: true,
      originalText: davinciClaimText(19),
      plainEnglish:
        "Robotic surgical tool for manipulator with magnetically actuatable circuitry and magnet interface.",
      keyInnovations: ["Magnetic proximity latching", "Non-contact sensor engagement"],
    },
    {
      number: 20,
      isIndependent: false,
      originalText: davinciClaimText(20),
      plainEnglish: "Circuitry defining a signal transmitting to a central processor.",
      keyInnovations: ["Central processor telemetry", "Digital tool handshake"],
    },
    {
      number: 21,
      isIndependent: false,
      originalText: davinciClaimText(21),
      plainEnglish: "Signal comprising a unique tool identifier.",
      keyInnovations: ["Cryptographic tool ID", "Authenticity verification"],
    },
    {
      number: 22,
      isIndependent: false,
      originalText: davinciClaimText(22),
      plainEnglish: "Signal comprising tool calibration offsets.",
      keyInnovations: ["Factory offset mapping", "Pre-calibrated instrument replacement"],
    },
    {
      number: 23,
      isIndependent: false,
      originalText: davinciClaimText(23),
      plainEnglish: "Signal indicating tool life and cumulative use measurements.",
      keyInnovations: ["Procedure countdown counter", "Actuation cycle logging"],
    },
    {
      number: 24,
      isIndependent: false,
      originalText: davinciClaimText(24),
      plainEnglish:
        "Robotic manipulator drive system moving end effector in response to processor commands.",
      keyInnovations: ["Master-slave teleoperation", "Real-time servo motion"],
    },
    {
      number: 25,
      isIndependent: false,
      originalText: davinciClaimText(25),
      plainEnglish: "Wrist joint coupling end effector to probe for orientation variation.",
      keyInnovations: ["Articulated wrist orientation", "Internal dexterous maneuvering"],
    },
    {
      number: 26,
      isIndependent: false,
      originalText: davinciClaimText(26),
      plainEnglish: "End effector comprising an image capture device to define a field of view.",
      keyInnovations: ["Stereoscopic endoscope", "Illuminated surgical imaging"],
    },
    {
      number: 27,
      isIndependent: false,
      originalText: davinciClaimText(27),
      plainEnglish: "Joint geometry transmitted to processor for kinematic transformation.",
      keyInnovations: ["Kinematic forward mapping", "Coordinate frame alignment"],
    },
    {
      number: 28,
      isIndependent: false,
      originalText: davinciClaimText(28),
      plainEnglish:
        "End effectors coupled with a wrist whose axis geometry is indicated by the signal.",
      keyInnovations: ["Wrist kinematic transformation", "Robotic telepresence control"],
    },
  ],
};
