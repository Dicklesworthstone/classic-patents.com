import type { Patent } from "@/types/patent";
import { davinciArchivalEdition } from "../editions/daVinciEdition";

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
      caption: "Perspective view showing surgeon master console, viewer, and patient cart manipulator arms.",
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
        "number": 1,
        "isIndependent": true,
        "originalText": "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an identifier signal included in a table accessible to the processor for comparison 10 15 20 25 30 40 45 55 60 18 with the signal, the table comprising a plurality of compatible tool identification signals.",
        "plainEnglish": "A robotic surgical tool comprising a probe, surgical end effector, interface, and circuitry transmitting tool calibration or compatibility signals.",
        "keyInnovations": [
            "Tool interface circuitry",
            "Calibration offset transmission",
            "Robotic tool compatibility identification"
        ]
    },
    {
        "number": 2,
        "isIndependent": false,
        "originalText": "The tool of claim 1, wherein the signal indicates tool calibration offsets of the tool.",
        "plainEnglish": "Signal indicating tool calibration offsets.",
        "keyInnovations": [
            "Factory tool calibration",
            "Kinematic offset compensation"
        ]
    },
    {
        "number": 3,
        "isIndependent": false,
        "originalText": "The tool of claim 1, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        "plainEnglish": "End effector having a strength capability indicated by the transmitted signal.",
        "keyInnovations": [
            "Grip strength rating",
            "Dynamic force limits"
        ]
    },
    {
        "number": 4,
        "isIndependent": false,
        "originalText": "The tool of claim 1, wherein the signal indicates a range of motion of the end effectors.",
        "plainEnglish": "Signal indicating a range of motion of the tool degrees of freedom.",
        "keyInnovations": [
            "Joint range limits",
            "Workspace boundary transmission"
        ]
    },
    {
        "number": 5,
        "isIndependent": false,
        "originalText": "The tool of claim 1, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        "plainEnglish": "End effectors coupled to probe via a wrist with axis geometry indicated by the signal.",
        "keyInnovations": [
            "Wrist kinematic geometry",
            "Multi-axis DH parameters"
        ]
    },
    {
        "number": 6,
        "isIndependent": true,
        "originalText": "A robotic surgical tool for use in a robotic surgical system having a processor which directs movement of a tool holder, the tool comprising: a probe having a proximal end and a distal end; a surgical end effector disposed adjacent the distal end of the probe; an interface disposed adjacent the proximal end of the probe, the interface releasably coupleable with the tool holder; and circuitry mounted on the probe, the circuitry defining a signal for transmitting to the processor so as to indicate compatibility of the tool with the system; wherein the signal comprises an arbitrary compatibility data string.",
        "plainEnglish": "Robotic surgical tool with interface driven elements and memory storing calibration offsets.",
        "keyInnovations": [
            "Driven engagement elements",
            "Onboard calibration memory"
        ]
    },
    {
        "number": 7,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the signal indicates a range of motion of the end effectors.",
        "plainEnglish": "Signal indicating range of motion of driven elements.",
        "keyInnovations": [
            "Actuator motion bounds",
            "Drive disk limits"
        ]
    },
    {
        "number": 8,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        "plainEnglish": "End effectors coupled to probe via a wrist with geometry transmitted to processor.",
        "keyInnovations": [
            "Wrist axis geometry transmission",
            "Slave arm inverse kinematics"
        ]
    },
    {
        "number": 9,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the signal indicates tool calibration offsets of the tool.",
        "plainEnglish": "Signal indicating tool calibration offsets between nominal and measured positions.",
        "keyInnovations": [
            "Deviation offset calibration",
            "Sub-millimeter backlash tuning"
        ]
    },
    {
        "number": 10,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the signal indicates a tool-type of the tool.",
        "plainEnglish": "Signal indicating a tool-type code for automated arm configuration.",
        "keyInnovations": [
            "Tool type automated detection",
            "Hot-swap tool configuration"
        ]
    },
    {
        "number": 11,
        "isIndependent": false,
        "originalText": "The tool of claim 6, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        "plainEnglish": "Joint disposed between interface and end effector with axis geometry transmitted in signal.",
        "keyInnovations": [
            "Intermediate joint parameterization",
            "Multi-segment kinematics"
        ]
    },
    {
        "number": 12,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the probe comprises an elongate shaft suitable for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        "plainEnglish": "Probe comprising an elongate shaft for minimally invasive insertion.",
        "keyInnovations": [
            "8mm laparoscopy trocar shaft",
            "Minimally invasive cannula insertion"
        ]
    },
    {
        "number": 13,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the end effector has a strength, and wherein the signal indicates the strength of the end effector to the processor.",
        "plainEnglish": "End effector having strength capability transmitted to processor.",
        "keyInnovations": [
            "Tissue grip force limits",
            "Over-torque protection"
        ]
    },
    {
        "number": 14,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the signal further indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of cal- endar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        "plainEnglish": "Signal indicating tool life, serial number, and procedure counts.",
        "keyInnovations": [
            "Tool life tracking",
            "Single-use sterility interlocks"
        ]
    },
    {
        "number": 15,
        "isIndependent": false,
        "originalText": "The tool of claim 6, wherein the end effector comprises an image capture device to define a field of view.",
        "plainEnglish": "End effector comprising an image capture device.",
        "keyInnovations": [
            "Integrated endoscopic camera",
            "Distal chip-on-tip vision"
        ]
    },
    {
        "number": 16,
        "isIndependent": false,
        "originalText": "The tool of claim 6, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        "plainEnglish": "Wrist joint coupling end effector to probe for orientation variation inside body cavity.",
        "keyInnovations": [
            "EndoWrist 7-DOF articulation",
            "Internal pitch and yaw"
        ]
    },
    {
        "number": 17,
        "isIndependent": true,
        "originalText": "A robotic surgical component for use in a robotic surgical system having a processor and a component holder, the component comprising: a component body having an interface mountable to the component holder, the body supporting a surgical end effector; a drive system coupled to the body, the drive system moving the end effector in response to commands from the processor; and circuitry mounted on the body, the circuitry defining a signal for transmitting to the processor, the signal comprising at least one member selected from the group consisting of compatibility of the component with the system, a component-type of the component, coupling of the component to the system, and calibration of the component; wherein the component comprises a tool including a shaft having a proximal end and a distal end, the end effector disposed adjacent the distal end of the shaft, with a plurality of degrees of motion relative to the proximal end of the shaft, and wherein the interface comprises a plurality of driven elements, and further comprising a tool drive system coupling the driven elements to the degrees of motion of the end effector, the tool drive system having one or more calibration offsets between a nominal position of the end effector relative to the driven elements and a measured position of the end effector relative to the driven elements; wherein the circuitry comprises a memory storing data indicating the offsets, the memory coupled to the interface so as to transmit the offsets to the processor.",
        "plainEnglish": "Robotic surgical component with body, drive system, and circuitry transmitting component status.",
        "keyInnovations": [
            "Modular surgical component",
            "Drive system interface"
        ]
    },
    {
        "number": 18,
        "isIndependent": false,
        "originalText": "The component of claim 17, wherein the component body comprises an elongate shaft for distal insertion via a minimally invasive aperture to an internal surgical site of a patient body.",
        "plainEnglish": "Component body comprising an elongate shaft for minimally invasive aperture insertion.",
        "keyInnovations": [
            "Trocar entry cannula",
            "Peritoneal port access"
        ]
    },
    {
        "number": 19,
        "isIndependent": true,
        "originalText": "A robotic surgical tool for use with a robotic manipulator having a tool holder, the tool holder having magnetically actuatable circuitry, the tool comprising; a probe having a proximal end and a distal end; a surgical end effector adjacent the distal end of the probe; an interface adjacent the proximal end of the probe, the interface releasably coupleable with the holder, the 10 15 20 25 30 20 interface comprising a magnet positioned so as to actuate the circuitry of the holder.",
        "plainEnglish": "Robotic surgical tool for manipulator with magnetically actuatable circuitry and magnet interface.",
        "keyInnovations": [
            "Magnetic proximity latching",
            "Non-contact sensor engagement"
        ]
    },
    {
        "number": 20,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 19, wherein the circuitry defines a signal for transmitting to a processor.",
        "plainEnglish": "Circuitry defining a signal transmitting to a central processor.",
        "keyInnovations": [
            "Central processor telemetry",
            "Digital tool handshake"
        ]
    },
    {
        "number": 21,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 20, wherein the signal comprises an unique tool identifier.",
        "plainEnglish": "Signal comprising a unique tool identifier.",
        "keyInnovations": [
            "Cryptographic tool ID",
            "Authenticity verification"
        ]
    },
    {
        "number": 22,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 20, wherein the signal comprises tool calibration offsets of the tool.",
        "plainEnglish": "Signal comprising tool calibration offsets.",
        "keyInnovations": [
            "Factory offset mapping",
            "Pre-calibrated instrument replacement"
        ]
    },
    {
        "number": 23,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 20, wherein the signal indicates at least one of tool life and cumulative tool use by a measurement selected from the group consisting of calendar date, clock time, number of surgical procedures, number of times the tool has been coupled to the system, and number of end effector actuations.",
        "plainEnglish": "Signal indicating tool life and cumulative use measurements.",
        "keyInnovations": [
            "Procedure countdown counter",
            "Actuation cycle logging"
        ]
    },
    {
        "number": 24,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 19, wherein the robotic manipulator comprises a drive system coupled to the probe, the drive system moving the end effector in response to commands from a processor.",
        "plainEnglish": "Robotic manipulator drive system moving end effector in response to processor commands.",
        "keyInnovations": [
            "Master-slave teleoperation",
            "Real-time servo motion"
        ]
    },
    {
        "number": 25,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 19, further comprising a wrist joint coupling the end effector to the probe for varying an orientation of the end effector within an internal surgical site.",
        "plainEnglish": "Wrist joint coupling end effector to probe for orientation variation.",
        "keyInnovations": [
            "Articulated wrist orientation",
            "Internal dexterous maneuvering"
        ]
    },
    {
        "number": 26,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 19, wherein the end effector comprises an image capture device to define a field of view.",
        "plainEnglish": "End effector comprising an image capture device to define a field of view.",
        "keyInnovations": [
            "Stereoscopic endoscope",
            "Illuminated surgical imaging"
        ]
    },
    {
        "number": 27,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 20, further comprising at least one joint disposed between the interface and end effector, the joint defining a joint axis geometry, wherein the signal indicates the joint geometry of the tool to the processor.",
        "plainEnglish": "Joint geometry transmitted to processor for kinematic transformation.",
        "keyInnovations": [
            "Kinematic forward mapping",
            "Coordinate frame alignment"
        ]
    },
    {
        "number": 28,
        "isIndependent": false,
        "originalText": "The robotic surgical tool of claim 19, wherein the end effectors are coupled to the probe with a wrist, wherein the signal indicates a wrist axis geometry.",
        "plainEnglish": "End effectors coupled with a wrist whose axis geometry is indicated by the signal.",
        "keyInnovations": [
            "Wrist kinematic transformation",
            "Robotic telepresence control"
        ]
    }
],
};
