import type { Patent } from "@/types/patent";
import { daVinciArchivalEdition } from "../editions/daVinciEdition";

export const daVinciPatent: Patent = {
  id: "us-6331181-davinci",
  archivalEdition: daVinciArchivalEdition,
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
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A surgical robotic system comprising: a master control input device configured to receive surgeon hand movements; an articulated robotic slave manipulator holding an instrument shaft insertable through a minimally invasive incision; a multi-axis wrist mechanism disposed at the distal end of the instrument shaft; and a computer controller operatively connecting the master input device to the slave manipulator, the controller programmed to apply motion scaling and tremor filtration to drive the slave end-effector in real time.",
      plainEnglish:
        "A robotic teleoperation console that scales down surgeon hand gestures and cancels hand tremor at internal micro-surgical tools.",
      keyInnovations: [
        "Master-slave telepresence architecture",
        "Cable-driven 7-DOF EndoWrist micro-articulation",
        "Digital low-pass 8Hz physiological tremor cancellation",
      ],
    },
  ],
  drawings: [],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
  tags: ["robotics", "medical", "telepresence", "kinematics", "intuitive surgical"],
};
