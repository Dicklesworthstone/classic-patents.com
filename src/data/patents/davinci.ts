import type { Patent } from "@/types/patent";
import { davinciArchivalEdition, davinciClaimText } from "../editions/daVinciEdition";

export const daVinciPatent: Patent = {
  id: "us-6331181-davinci",
  patentNumber: "US 6,331,181",
  title: "Surgical Robotic Tools, Data Architecture, and Use",
  shortTitle: "Robotic Surgical Tool Compatibility and Calibration Interface",
  subtitle: "Tool-Mounted Memory, Compatibility Signals, and Releasable Drive Interfaces",
  inventors: [
    "Michael J. Tierney",
    "Thomas G. Cooper",
    "Chris A. Julian",
    "Stephen J. Blumenkranz",
    "Gary S. Guthart",
    "Robert G. Younge",
  ],
  inventorLocation: "California, United States",
  grantDate: "2001-12-18",
  filingDate: "1999-10-15",
  era: "Internet & Modern Computing (1990–Present)",
  category: "computing",
  categoryLabel: "Surgical Robotics & Tool Data Interfaces",
  summary:
    "US 6,331,181 covers robotic surgical tools and system components that carry compatibility, tool-type, calibration, coupling, and tool-life information from a releasable tool interface to a processor. Its claims also cover driven tool interfaces, memory-stored offsets, engagement structures, and a magnetically actuated holder circuit, rather than a generic claim to every master-slave surgical robot.",
  heroQuote:
    "The memory can provide a signal verifying that the tool is compatible with that particular robotic system.",
  originalPdfUrl: "/patents/pdfs/us-6331181-davinci.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6331181B1/en",
  usptoClassification: "A61B 19/00; U.S. 606/130; 600/429",
  archivalEdition: davinciArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6331181-davinci-reviewed.txt",
    pageCount: 34,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (WindyAnchor)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91",
  },
  originalText: `UNITED STATES PATENT
Tierney et al.
Patent No.: US 6,331,181 B1
Date of Patent: Dec. 18, 2001

SURGICAL ROBOTIC TOOLS, DATA ARCHITECTURE, AND USE

ABSTRACT
Robotic surgical tools, systems, and methods for preparing for and performing robotic surgery include a memory mounted on the tool. The memory can perform a number of functions when the tool is loaded on the tool manipulator: first, the memory can provide a signal verifying that the tool is compatible with that particular robotic system. Secondly, the tool memory may identify the tool-type to the robotic system so that the robotic system can reconfigure its programming. Thirdly, the memory of the tool may indicate tool-specific information, including measured calibration offsets indicating misalignment of the tool drive system, tool life data, or the like. This information may be stored in a read only memory (ROM), or in a nonvolatile memory which can be written to only a single time. The invention further provides improved engagement structures for coupling robotic surgical tools with manipulator structures.`,
  plainEnglishExplanation: {
    overview:
      "The grant addresses a concrete systems problem in robotically assisted surgery: a processor must know which detachable tool is mounted, how its mechanics differ from nominal geometry, whether it is coupled, and whether its use history permits continued operation. The invention moves that information into memory and interface signals on the tool or related component.",
    coreMechanism:
      "A releasable tool interface carries compatibility or tool-type data to the processor. For a driven tool, memory stores the offset between nominal and measured positions of the interface drive elements and distal end effector. The processor can use those values when it generates drive signals; the patent does not specify a universal sampling rate, motion ratio, or tremor cutoff.",
    mechanicalBreakdown: [
      {
        title: "Tool-mounted compatibility memory",
        summary:
          "Circuitry on a releasable tool transmits a compatibility signal and may identify tool type or tool-specific data.",
        technicalDetails:
          "The source permits a unique identifier, an identifier in a processor lookup table, or an arbitrary compatibility string. Nonvolatile memory may retain the data through tool exchange.",
      },
      {
        title: "Measured drive calibration",
        summary:
          "Memory carries offsets between nominal interface-drive positions and measured end-effector positions.",
        technicalDetails:
          "The processor can factor tool-specific offsets into coordinate transformations and servo drive signals, allowing tools of one type to be exchanged without assuming identical mechanical alignment.",
      },
      {
        title: "Engagement and sterile adapter",
        summary:
          "Sensors and a sterile-drape adapter preserve coupling information while transferring motion from holder drives to tool-driven elements.",
        technicalDetails:
          "The adapter places movable bodies between holder-side drive elements and the tool interface. The source also describes redundant engagement signals and an optional magnet that actuates holder circuitry.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Rigid-body coordinate transformation",
        formula: "\\mathbf{x}_{tool} = T_{base\\rightarrow tool}(q)\\,\\mathbf{x}_{base}",
        explanation:
          "The specification says the processor generates coordinate transformations and servo drive signals for different tool geometries. The grant does not set a single commercial transform, motion scale, or tremor filter, so the equation is an engineering abstraction of the claimed calibration-data path rather than a literal numeric limitation.",
      },
      {
        principle: "Calibration offset compensation",
        formula: "\\Delta q = q_{measured} - q_{nominal}",
        explanation:
          "Claim 17 expressly stores data indicating offsets between nominal and measured relative positions of driven elements and the end effector, then couples that memory to the interface for transmission to the processor.",
      },
    ],
    whyItMattersToday:
      "Modern robotic instruments still need deterministic identification, calibration, coupling, and use-history data before a controller can safely configure a detachable tool. This patent is best read as an interface and data-architecture contribution within surgical robotics, not as proof of a particular clinical outcome or commercial system statistic.",
  },
  historicalContext: {
    problemStatement:
      "The specification identifies tool-change delay, limited manipulator count, shared trocar access, and the risk of operating a tool whose geometry or compatibility is unknown as practical bottlenecks in robotically assisted surgery.",
    priorArtLimitations: [
      "Manual or robotic tools without a machine-readable compatibility signal",
      "Tool changes that require external identification or manual reconfiguration",
      "Nominal drive geometry that does not account for tool-specific measured offsets",
      "Engagement sensing vulnerable to temporary loss of one signal",
    ],
    breakthroughInsight:
      "Put compatibility, tool-type, calibration, life, and coupling information at the releasable tool boundary so the processor can configure and verify a tool during exchange.",
    patentWars: [],
    civilizationalImpact:
      "The claim architecture helped make detachable surgical tools legible to a controller: a tool can report what it is, how its measured drive geometry differs from nominal geometry, and whether it is compatible before the system applies drive signals.",
    aftermath:
      "The patent is expired according to the Google Patents record. This page does not infer a specific litigation outcome or commercial product scope from the family record.",
    sideNotes: [
      "The grant lists 28 claims and 22 drawing sheets, and its detailed embodiments include tool memory, engagement sensors, sterile adapters, and compatibility verification.",
    ],
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Robotic procedure and tool change",
      caption:
        "FIG. 1 illustrates a robotic surgical procedure in which a surgeon at a master station directs robotic surgical tools effected by a slave manipulator while an assistant prepares to change a tool.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-console",
          figureRef: "Fig. 1",
          label: "150",
          element: "Master controller",
          description: "The source labels the surgeon-side master controller 150.",
          x: 42,
          y: 55,
        },
        {
          id: "dv-cart",
          figureRef: "Fig. 1",
          label: "50",
          element: "Robotic arm slave cart",
          description: "The source labels the patient-side robotic arm slave cart 50.",
          x: 70,
          y: 62,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Robotic surgical arm cart",
      caption:
        "FIG. 2 is a perspective view of the robotic surgical arm cart system and its supported tools.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-wrist",
          figureRef: "Fig. 2",
          label: "54",
          element: "Surgical tools",
          description: "The source labels the supported surgical tools 54.",
          x: 36,
          y: 35,
        },
        {
          id: "dv-jaws",
          figureRef: "Fig. 2",
          label: "58",
          element: "Robotic manipulator",
          description: "The source labels the robotic manipulator 58.",
          x: 55,
          y: 54,
        },
      ],
    },
    {
      figureNumber: "Fig. 2A",
      title: "Manipulator linkage and remote center",
      caption:
        "FIG. 2A is a perspective view of a robotic surgical manipulator used in the cart system.",
      svgType: "davinci",
      callouts: [
        {
          id: "dv-housing",
          figureRef: "Fig. 3",
          label: "62",
          element: "Parallelogram linkage",
          description:
            "Rigid links and rotational joints constrain tool motion around the remote center.",
          x: 44,
          y: 56,
        },
        {
          id: "dv-disks",
          figureRef: "Fig. 3",
          label: "64",
          element: "Remote center",
          description: "Pitch and yaw axes intersect at remote center 64 along the tool shaft.",
          x: 69,
          y: 73,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      legalSignificance:
        "Independent claim 1 covers a tool-side compatibility identifier presented to a processor through a releasable interface and compared with a table of compatible identifiers.",
      originalText: davinciClaimText(1),
      plainEnglish:
        "This claim requires a detachable robotic surgical tool with a proximal interface, distal end effector, and circuitry that sends an identifier found in a processor table so compatibility can be checked before operation.",
      keyInnovations: [
        "Tool interface circuitry",
        "Calibration offset transmission",
        "Robotic tool compatibility identification",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: davinciClaimText(2),
      plainEnglish:
        "This dependent claim adds tool calibration offsets to the compatibility signal, allowing the processor to account for measured tool-specific misalignment rather than assuming every tool was assembled at nominal geometry.",
      keyInnovations: ["Factory tool calibration", "Kinematic offset compensation"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText: davinciClaimText(3),
      plainEnglish:
        "This dependent claim requires the signal to report the end effector's strength to the processor, so the controller can distinguish a tool's stated mechanical capability from another tool type.",
      keyInnovations: ["Grip strength rating", "Dynamic force limits"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText: davinciClaimText(4),
      plainEnglish:
        "This dependent claim adds a range-of-motion value for the end effectors to the tool signal, giving the processor a declared limit for its commanded articulation.",
      keyInnovations: ["Joint range limits", "Workspace boundary transmission"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [1],
      originalText: davinciClaimText(5),
      plainEnglish:
        "This dependent claim covers a wrist between the probe and end effectors whose axis geometry is reported in the signal, allowing coordinate transforms to use the actual tool architecture.",
      keyInnovations: ["Wrist kinematic geometry", "Multi-axis DH parameters"],
    },
    {
      number: 6,
      isIndependent: true,
      legalSignificance:
        "Independent claim 6 protects the alternative arbitrary compatibility-string path, without requiring the claim 1 lookup-table form.",
      originalText: davinciClaimText(6),
      plainEnglish:
        "This independent tool claim uses an arbitrary compatibility data string rather than the lookup-table identifier, while retaining the probe, end effector, releasable interface, circuitry, processor, and tool-holder relationship.",
      keyInnovations: ["Driven engagement elements", "Onboard calibration memory"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(7),
      plainEnglish:
        "This dependent claim requires the arbitrary-string tool to report end-effector range of motion, giving the processor a tool-specific articulation boundary in addition to compatibility data.",
      keyInnovations: ["Actuator motion bounds", "Drive disk limits"],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(8),
      plainEnglish:
        "This dependent claim requires the arbitrary-string tool's wrist axis geometry to be transmitted, so the processor can form transforms for that particular distal mechanism.",
      keyInnovations: ["Wrist axis geometry transmission", "Slave arm inverse kinematics"],
    },
    {
      number: 9,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(9),
      plainEnglish:
        "This dependent claim adds measured calibration offsets to the arbitrary-string tool signal, allowing the robot to compensate for assembly differences between nominal and actual tool positions.",
      keyInnovations: ["Deviation offset calibration", "Sub-millimeter backlash tuning"],
    },
    {
      number: 10,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(10),
      plainEnglish:
        "This dependent claim requires the compatibility signal to identify the tool type, enabling the processor to select programming appropriate to a grasper, scissors, cautery tool, or another declared instrument.",
      keyInnovations: ["Tool type automated detection", "Hot-swap tool configuration"],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(11),
      plainEnglish:
        "This dependent claim adds an intermediate joint and requires its axis geometry in the signal, extending tool identification beyond the wrist to the full interface-to-effector joint arrangement.",
      keyInnovations: ["Intermediate joint parameterization", "Multi-segment kinematics"],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(12),
      plainEnglish:
        "This dependent claim limits the arbitrary-string tool to a probe with an elongate shaft suitable for insertion through a minimally invasive opening to an internal patient site.",
      keyInnovations: ["8mm laparoscopy trocar shaft", "Minimally invasive cannula insertion"],
    },
    {
      number: 13,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(13),
      plainEnglish:
        "This dependent claim requires the arbitrary-string tool to report end-effector strength, giving the processor a declared mechanical capability it can associate with the selected instrument.",
      keyInnovations: ["Tissue grip force limits", "Over-torque protection"],
    },
    {
      number: 14,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(14),
      plainEnglish:
        "This dependent claim permits the signal to report tool life or cumulative use measured by date, time, procedures, couplings, or end-effector actuations, supporting a processor's tool-use decision.",
      keyInnovations: ["Tool life tracking", "Single-use sterility interlocks"],
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(15),
      plainEnglish:
        "This dependent claim includes an image-capture device as the end effector, so the same compatibility-signaled robotic tool architecture can cover a camera or other imaging instrument.",
      keyInnovations: ["Integrated endoscopic camera", "Distal chip-on-tip vision"],
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [6],
      originalText: davinciClaimText(16),
      plainEnglish:
        "This dependent claim adds a wrist joint between end effector and probe that varies orientation within an internal surgical site, while retaining the arbitrary compatibility-string interface.",
      keyInnovations: ["Wrist joint", "Internal-site orientation variation"],
    },
    {
      number: 17,
      isIndependent: true,
      legalSignificance:
        "Independent claim 17 combines a component, driven interface, distal degrees of motion, measured calibration offsets, and memory transmission to the processor.",
      originalText: davinciClaimText(17),
      plainEnglish:
        "This independent component claim covers a body mounted to a holder, a processor-commanded drive system, and circuitry reporting compatibility, type, coupling, or calibration, plus a tool interface with stored measured offsets.",
      keyInnovations: ["Modular surgical component", "Drive system interface"],
    },
    {
      number: 18,
      isIndependent: false,
      dependsOn: [17],
      originalText: davinciClaimText(18),
      plainEnglish:
        "This dependent claim limits the claimed component to a body with an elongate shaft suitable for distal insertion through a minimally invasive aperture to an internal surgical site.",
      keyInnovations: ["Trocar entry cannula", "Peritoneal port access"],
    },
    {
      number: 19,
      isIndependent: true,
      legalSignificance:
        "Independent claim 19 protects a tool interface magnet positioned to actuate magnetically actuatable circuitry in the holder.",
      originalText: davinciClaimText(19),
      plainEnglish:
        "This independent claim covers a tool whose proximal interface contains a magnet positioned to actuate circuitry in a manipulator holder, alongside the probe and distal surgical end effector.",
      keyInnovations: ["Magnetic proximity latching", "Non-contact sensor engagement"],
    },
    {
      number: 20,
      isIndependent: false,
      dependsOn: [19],
      originalText: davinciClaimText(20),
      plainEnglish:
        "This dependent claim requires the magnetically actuated circuitry to define a signal sent to a processor, turning the physical interface event into machine-readable tool information.",
      keyInnovations: ["Central processor telemetry", "Digital tool handshake"],
    },
    {
      number: 21,
      isIndependent: false,
      dependsOn: [20],
      originalText: davinciClaimText(21),
      plainEnglish:
        "This dependent claim specifies that the processor signal includes a unique tool identifier, allowing the system to distinguish one compatible instrument from another.",
      keyInnovations: ["Cryptographic tool ID", "Authenticity verification"],
    },
    {
      number: 22,
      isIndependent: false,
      dependsOn: [20],
      originalText: davinciClaimText(22),
      plainEnglish:
        "This dependent claim specifies calibration offsets in the magnetically enabled tool signal, allowing the processor to account for measured differences in that tool's drive and end-effector geometry.",
      keyInnovations: ["Factory offset mapping", "Pre-calibrated instrument replacement"],
    },
    {
      number: 23,
      isIndependent: false,
      dependsOn: [20],
      originalText: davinciClaimText(23),
      plainEnglish:
        "This dependent claim permits the signal to report tool life or cumulative use by dates, procedures, couplings, or end-effector actuations, supporting a controller's decision about continued tool use.",
      keyInnovations: ["Procedure countdown counter", "Actuation cycle logging"],
    },
    {
      number: 24,
      isIndependent: false,
      dependsOn: [19],
      originalText: davinciClaimText(24),
      plainEnglish:
        "This dependent claim requires the manipulator to include a drive system coupled to the probe, with processor commands producing movement of the distal end effector.",
      keyInnovations: ["Manipulator drive system", "Processor-commanded end-effector motion"],
    },
    {
      number: 25,
      isIndependent: false,
      dependsOn: [19],
      originalText: davinciClaimText(25),
      plainEnglish:
        "This dependent claim adds a wrist between probe and end effector so orientation can vary inside the internal surgical site while the magnetically actuated interface remains part of the tool.",
      keyInnovations: ["Articulated wrist orientation", "Internal dexterous maneuvering"],
    },
    {
      number: 26,
      isIndependent: false,
      dependsOn: [19],
      originalText: davinciClaimText(26),
      plainEnglish:
        "This dependent claim makes the end effector an image-capture device that defines a field of view, extending the magnetically identified tool family to surgical imaging.",
      keyInnovations: ["Stereoscopic endoscope", "Illuminated surgical imaging"],
    },
    {
      number: 27,
      isIndependent: false,
      dependsOn: [20],
      originalText: davinciClaimText(27),
      plainEnglish:
        "This dependent claim adds a joint between interface and end effector and requires its axis geometry in the processor signal, so the controller can transform commands for that tool structure.",
      keyInnovations: ["Kinematic forward mapping", "Coordinate frame alignment"],
    },
    {
      number: 28,
      isIndependent: false,
      dependsOn: [19],
      originalText: davinciClaimText(28),
      plainEnglish:
        "This dependent claim requires a wrist coupling the end effectors to the probe and requires the signal to indicate wrist-axis geometry, preserving tool-specific kinematic information during exchange.",
      keyInnovations: ["Wrist kinematic transformation", "Robotic telepresence control"],
    },
  ],
  stats: {
    totalClaims: 28,
    independentClaims: 4,
  },
};
