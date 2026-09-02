import { goertzElectronicMasterSlaveManipulatorArchivalEdition } from "@/data/editions/goertzElectronicMasterSlaveManipulatorEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Goertz manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const goertzElectronicMasterSlaveManipulatorPatent: Patent = {
  id: "us-2846084-goertz-electronic-master-slave-manipulator",
  patentNumber: "US 2,846,084",
  title: "Electronic Master Slave Manipulator",
  shortTitle: "Goertz Force-Reflecting Master–Slave Manipulator",
  subtitle: "Seven coordinated motion channels, synchro error control, and bilateral resistance",
  inventors: ["Raymond C. Goertz", "William M. Thompson", "Robert A. Olsen"],
  inventorLocation: "Downers Grove and Chicago, Illinois",
  grantDate: "1958-08-05",
  filingDate: "1955-06-21",
  era: "Atomic & Space Age (1940–1970)",
  category: "computing",
  categoryLabel: "Robotics, Teleoperation & Servo Control",
  summary:
    "This Atomic Energy Commission grant claims an electrical master–slave manipulator in which a human-operated handle and a remote claw correspond through seven motion-specific assemblies. Synchro transducers form a position-error signal, reversible motors drive both sides toward correspondence, tachometer feedback damps relative motion, and a limiter bounds excessive error signals. Its claims distinguish this particular bilateral arm-and-servo architecture from a generic claim to every robot or remote-control system.",
  heroQuote:
    "The sense of feel between master and slave units is highly desirable in order that fragile objects to be grasped such as beakers and test tubes be not broken.",
  originalPdfUrl: "/patents/pdfs/us-2846084-goertz-electronic-master-slave-manipulator.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2846084A/en",
  usptoClassification: "U.S. Cl. 214—1 (printed)",
  archivalEdition: goertzElectronicMasterSlaveManipulatorArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-2846084-goertz-electronic-master-slave-manipulator-reviewed.txt",
    pageCount: 20,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "0e5ceed27b4cf8fc72a9144851a9c58e0342cae111fd932519828171550a6d64",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "FIG. 1",
        sourceRelationship: "printed first figure sheet and master-assembly drawing",
      },
      {
        page: 2,
        exactSourceText: "FIG. 2",
        sourceRelationship: "printed second figure sheet and master end view",
      },
      {
        page: 3,
        exactSourceText: "FIG. 3",
        sourceRelationship: "printed third figure sheet with arm sections",
      },
      {
        page: 4,
        exactSourceText: "FIG. 6",
        sourceRelationship: "printed fourth figure sheet and horizontal-arm support section",
      },
      {
        page: 5,
        exactSourceText: "FIG. 7",
        sourceRelationship: "printed fifth figure sheet and horizontal-arm mounting",
      },
      {
        page: 6,
        exactSourceText: "FIG. 8",
        sourceRelationship: "printed sixth figure sheet and support assemblies",
      },
      {
        page: 7,
        exactSourceText: "FIG. 9",
        sourceRelationship: "printed seventh figure sheet and cable perspective",
      },
      {
        page: 8,
        exactSourceText: "FIG. 10",
        sourceRelationship: "printed eighth figure sheet and gear-box details",
      },
      {
        page: 9,
        exactSourceText: "FIG. 13",
        sourceRelationship: "printed ninth figure sheet and gear-box sections",
      },
      {
        page: 10,
        exactSourceText: "FIG. 15",
        sourceRelationship: "printed tenth figure sheet and duplicate servo-system diagram",
      },
      {
        page: 11,
        exactSourceText: "FIG. 16",
        sourceRelationship: "printed eleventh figure sheet and limiter schematic",
      },
      {
        page: 12,
        exactSourceText: "The present invention relates to a remote-control manipulator",
        sourceRelationship: "printed masthead and opening specification",
      },
      {
        page: 13,
        exactSourceText:
          "The remote-control manipulator of the present invention comprises a master unit",
        sourceRelationship: "printed mechanical arrangement and motion-channel description",
      },
      {
        page: 14,
        exactSourceText: "As shown in Figs. 6 and 8, the support 50 comprises",
        sourceRelationship: "printed support, carriage, cable-guide, and gear description",
      },
      {
        page: 15,
        exactSourceText: "As shown in Fig. 6, the horizontal arm 51 is mounted in the carriage 66",
        sourceRelationship: "printed arm, counterweight, cable, and transducer description",
      },
      {
        page: 16,
        exactSourceText: "Each transducer on the master unit is a synchro control transformer 209",
        sourceRelationship: "printed servo, force-reflection, tachometer, and limiter description",
      },
      {
        page: 17,
        exactSourceText:
          "As previously pointed out, in normal operation no large error signal will appear",
        sourceRelationship: "printed safety, component, and limiter-circuit description",
      },
      {
        page: 18,
        exactSourceText:
          "The master unit of the manipulator of the present invention is capable of seven motions",
        sourceRelationship: "printed seven-motion and cable-tension discussion",
      },
      {
        page: 19,
        exactSourceText: "What is claimed is:",
        sourceRelationship: "printed end of description and claims 1 through 7",
      },
      {
        page: 20,
        exactSourceText: "8. The manipulator specified in claim 7",
        sourceRelationship: "printed claims 8 through 13 and cited references",
      },
    ],
  },
  originalText:
    "The present invention relates to a remote-control manipulator of the type in which motions of a master unit against which an operator acts are reproduced by a slave unit acting against an object to be manipulated. More particularly, the instant manipulator is characterized by the employment of electrical connections between the master unit and the slave unit of the manipulator.",
  plainEnglishExplanation: {
    overview:
      "This is an early bilateral teleoperation architecture for a job that cannot safely put a person at the work site. A human moves a master handle; a remote slave claw follows. The important refinement is not merely remote motion: each of seven source-described movements has a corresponding position-error servo channel, and an obstacle at the claw raises the error that pushes back at the master. The patent therefore treats delicate remote work as a problem of kinematics, feedback, damping, cable management, and force reflection together.",
    coreMechanism:
      "For one motion channel, let $q_m$ be the master position and $q_s$ the slave position. The synchro pair produces an error signal with $E \\propto q_m-q_s$; phase carries direction. The amplifier drives reversible motors in the direction that reduces the mismatch, while a tachometer path opposes relative speed, $V_t \\propto \\dot q_m-\\dot q_s$. If the slave claw contacts an object, $q_s$ cannot advance with $q_m$, so $|E|$ increases and the master motor opposes the operator. That is a real closed-loop causal chain. The grant supplies no arm lengths, gear ratios, payload, contact stiffness, motor constants, control gains, or bandwidth, so the shared interactive model intentionally reports normalized motion and resistance relationships rather than invented SI force or performance values.",
    mechanicalBreakdown: [
      {
        title: "Seven mechanically distinct motion channels",
        summary:
          "The master and slave have first and second arms plus a tool, with seven movements reproduced through seven corresponding assemblies.",
        technicalDetails:
          "The source enumerates pivoting the horizontal arm about transverse axis $113b$ and its own axis, pivoting the vertical arm about axis $126$ and its own axis, two tool-axis pivots $171$ and $172$, and opening or closing the tool. A configuration vector $q=(q_1,\\ldots,q_7)$ makes that architecture legible. It does not supply a calibrated coordinate frame or link dimensions, so the exhibit uses normalized channel positions only.",
        archaicTerm: "master unit and slave unit",
        modernEquivalent: "bilateral teleoperation master and remote manipulator",
      },
      {
        title: "Handle, claw, and cable paths",
        summary:
          "The master tool is a hand-held handle; the slave tool is a claw or grasper. Flexible cable routes carry several tool motions through the arms.",
        technicalDetails:
          "Cables $160$ through $164$ route gripping and tool-axis motions through the vertical and horizontal arms to assemblies $54$ through $56$; cables $175$ and $176$ route vertical-arm rotation to assembly $57$. Pulleys, take-up sheaves, and spring-loaded gear boxes manage changes in path length when a different joint moves. This is a source-backed routing topology, not a quantified cable-stress calculation.",
        archaicTerm: "force-receiving and -transmitting assemblies",
        modernEquivalent: "motion-channel transmission and servo packages",
      },
      {
        title: "Synchro position correspondence",
        summary:
          "A master-side synchro control transformer and slave-side synchro transmitter turn angular mismatch into a direction-sensitive alternating error signal.",
        technicalDetails:
          "The grant says the error signal $E$ is proportional in amplitude to the difference between corresponding shaft positions and that its phase indicates the direction of mechanical error. In modern control notation, $E\\propto q_m-q_s$. That relationship determines direction and relative correction demand, but the source does not publish a volts-per-degree conversion or servo gain.",
        archaicTerm: "synchro control transformer",
        modernEquivalent: "electromechanical position-error transducer",
      },
      {
        title: "Force-reflecting motor pair",
        summary:
          "Reversible motors act on both sides of a channel so a slave obstruction produces resistance at the master handle.",
        technicalDetails:
          "Claim 9 is not a generic haptics slogan. It requires corresponding movable elements, an error signal responsive to slave-versus-ideal position, and forces tending to reduce the mismatch on both master and slave. The beaker example illustrates $q_s$ lagging because contact prevents further closure; the rising $|E|$ drives a corresponding opposing motor action at the master. No force-newton output is asserted because force calibration and contact mechanics are absent from the grant.",
        archaicTerm: "sense of feel",
        modernEquivalent: "bilateral force reflection / haptic feedback",
      },
      {
        title: "Tachometer damping and abnormal-condition limiter",
        summary:
          "Relative motor-speed feedback opposes fast mismatch changes, while a limiter restricts excessively large error signals.",
        technicalDetails:
          "The tachometer bridge produces a signal proportional to a speed difference and opposes it against the position-error signal: $V_t\\propto\\dot q_m-\\dot q_s$. Claims 10–12 add signal limiting and speed-difference feedback. The document prints examples of components and a 60-cycle motor arrangement, but not a universal closed-loop transfer function, stability margin, maximum velocity, or safety rating.",
        archaicTerm: "signal-limiting means",
        modernEquivalent: "command-amplitude limiter with derivative-like damping path",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Bilateral position error",
        formula: "E \\propto q_m-q_s",
        explanation:
          "The synchro pair creates a signal whose amplitude is proportional to the mismatch between a master channel and its corresponding slave channel, while phase indicates correction direction. The proportionality is source-supported; its numerical gain is not published.",
      },
      {
        principle: "Force reflection through matched correction",
        formula: "\\tau_m,\\tau_s \\propto E",
        explanation:
          "Claim 9 directs force to both movable elements in a way that tends to reduce their positional disagreement. The source’s beaker example explains why an obstruction then becomes resistance at the master; it does not establish a Newton-for-Newton calibration.",
      },
      {
        principle: "Relative-speed damping",
        formula: "V_t \\propto \\dot q_m-\\dot q_s, \\qquad E_{drive}=E-kV_t",
        explanation:
          "The tachometer bridge makes an electrical signal from a difference in corresponding motor speeds and opposes it against the position-error path. The second expression is a modern sign convention for the stated opposing relationship, not an unpublished controller-gain value.",
      },
      {
        principle: "Seven-axis configuration topology",
        formula: "q=(q_1,q_2,q_3,q_4,q_5,q_6,q_7)",
        explanation:
          "The vector labels the seven movements actually enumerated in the specification. It helps distinguish the individual correspondence channels from a made-up Cartesian workspace or geometric performance envelope.",
      },
      {
        principle: "Amplitude limiting",
        formula: "u=\\operatorname{limit}(E)",
        explanation:
          "Claims 10 and 12 require a signal-limiting means used to limit device speed under abnormal conditions. The notation communicates bounded command amplitude without suggesting that the patent supplies a threshold, rated torque, or certified safety limit.",
      },
    ],
    whyItMattersToday:
      "The patent makes a useful historical distinction that still matters in robotics: remote manipulation is not solved by sending position alone. A practical operator needs a structured arm, transmission paths that survive multi-axis motion, stable tracking, and a way for remote resistance to return to the hand. The architecture belongs to the lineage of nuclear hot-cell manipulators and later force-reflecting teleoperation. Modern surgical, underwater, and hazardous-environment systems use far newer electronics and safety practice, but they confront the same separation between commanded motion, remote contact, and human perception.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 is the broad arm-and-signal combination. It requires corresponding master and slave units, two articulated arms, a tool with three angular relations, electrical signals for those motions and tool opening or closing, and a response that reproduces them remotely. It does not read simply on any two robotic arms, because the specified multi-axis structure and signal-responsive correspondence are both doing legal work.",
      keyInnovations: [
        "Corresponding master and slave arms",
        "Three-axis tool mounting",
        "Electrical motion correspondence",
        "Tool opening and closing channel",
      ],
      legalSignificance:
        "This is the broadest issued structural formulation of the paired articulated manipulator and its electrically reproduced motions.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 makes the apparatus more concrete: a carriage and side-piece support carry the first arm, four flexible-tie assemblies handle the tool and wrist motions, and three further assemblies correspond to the primary arm rotations. Its legal focus is the particular distribution of seven movement responses through the carriage, support, cables, and assemblies rather than a bare idea of a remote arm.",
      keyInnovations: [
        "Carriage-mounted first arm",
        "Flexible tie means",
        "Seven force-receiving assemblies",
        "Side-piece support",
      ],
      legalSignificance:
        "It is the detailed mechanical channel layout that connects the source drawings to the multi-motion control claim.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 depends on Claim 2 and specifies how the fifth and sixth assemblies couple to the first and second arms: one uses a carriage-coaxial gear, while the other uses a gear and a link tied to the second arm. The added legal work is a particular geared transmission arrangement for those motion channels, not a generic instruction to use gears anywhere in a robot.",
      keyInnovations: [
        "Coaxial carriage gear",
        "Linked second-arm gear",
        "Fifth and sixth assemblies",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 independently claims a support-mounted articulated master/slave pair whose tool can open, close, and move about three axes. Four force-receiving and transmitting assemblies receive cables routed along the two arms and then generally along the pivot axis. Its key legal contribution is the cable path’s relation to the arm pivot and to the four tool-motion assemblies.",
      keyInnovations: [
        "Support-mounted arm pair",
        "Four cable-driven assemblies",
        "Pivot-axis cable routing",
        "Three-axis tool movement",
      ],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [4],
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 narrows Claim 4 by adding spring-supported assemblies that urge outward and keep cables tight when motion about one tool axis would otherwise slacken a cable used for another axis. This is a practical cross-coupling remedy: the springs are part of a coordinated multi-axis transmission, not merely decorative shock absorbers on an arm.",
      keyInnovations: [
        "Spring-loaded gear boxes",
        "Cable-tension compensation",
        "Cross-axis cable management",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 independently recites the support, two arms, tool, opposing-side force-transmitting assemblies, and cables routed from the tool through the arms to those assemblies. Compared with Claim 4, it states the topology at a more general level without enumerating opening, closing, or all three particular tool axes. It still requires the source’s physical cable-and-assembly arrangement.",
      keyInnovations: [
        "Opposed-side assemblies",
        "Tool-to-support cable route",
        "Two-arm manipulator topology",
      ],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [6],
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 builds on Claim 6 by adding two further force-transmitting assemblies that respond respectively to first-arm movement near its inner end and to second-arm pivoting. It calls out coaxial gears and a link tying a gear to the second arm. The legal addition is a defined mechanical route for those larger arm motions, not simply an extra motor on a joint.",
      keyInnovations: [
        "Additional arm-motion assemblies",
        "Coaxial pivot gears",
        "Second-arm link",
      ],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [7],
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 further adds the carriage located between support and first arm, lets the first arm rotate in that carriage about its own axis, and mounts another responsive assembly on the carriage. This dependent claim captures the nested carriage-and-roll layout needed to add a first-arm roll channel while retaining the pivot structure already required by Claim 7.",
      keyInnovations: [
        "Interposed carriage",
        "First-arm axial rotation",
        "Carriage-mounted responsive assembly",
      ],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 is the core bilateral-servo claim. Corresponding master and slave elements have many possible positions; an error signal is proportional to the difference between actual slave position and the slave position implied by the master. Forces on both sides tend to reduce that mismatch, so mechanical resistance at the slave produces corresponding resistance during master operation. It is an error-driven force-reflection relationship, not an unsourced claim of calibrated haptics.",
      keyInnovations: [
        "Position-error signal",
        "Bilateral force application",
        "Force reflection",
        "Corresponding movable elements",
      ],
      legalSignificance:
        "This is the grant’s clearest issued statement of force-reflecting bilateral servo behavior.",
    },
    {
      number: 10,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(10),
      plainEnglish:
        "Claim 10 depends on Claim 9 and adds signal-limiting means coupled to the signal-producing means. It requires that the electrical signal, and therefore device operating speed, be limited when abnormal conditions occur. The legal work is a specific control-path safety refinement layered onto bilateral force reflection, not a sweeping claim to all safety limits in remote machinery.",
      keyInnovations: [
        "Signal limiter",
        "Abnormal-condition speed limit",
        "Bilateral servo safety path",
      ],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(11),
      plainEnglish:
        "Claim 11 depends on Claim 9 and adds a signal proportional to the difference between master and slave motion speeds, then opposes that signal against the first electrical signal. In modern language this is a damping-like relative-speed feedback path. Its legal contribution is not a numerical controller law; it is the stated opposing speed-difference signal relationship.",
      keyInnovations: [
        "Speed-difference signal",
        "Opposing feedback path",
        "Oscillation-reducing damping",
      ],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [9],
      originalText: manualClaimText(12),
      plainEnglish:
        "Claim 12 combines the two refinements: it limits the position-error signal under abnormal conditions and also derives a relative-speed signal from the master and slave members that opposes the limited signal. Its legal work is the combined limiter-plus-damping control path on top of Claim 9’s force-reflecting servo, without supplying a fixed threshold or gain value.",
      keyInnovations: [
        "Signal limiting",
        "Relative-speed feedback",
        "Combined limiter and damping path",
      ],
    },
    {
      number: 13,
      isIndependent: true,
      originalText: manualClaimText(13),
      plainEnglish:
        "Claim 13 combines the multi-axis arm structure with a plurality of servo systems, one for each source-described arm, tool, and gripper motion. Each servo compares actual slave position with the ideal position implied by the master and applies corresponding force to both sides. It therefore joins the physical seven-motion manipulator to the bilateral error-and-resistance behavior rather than treating either in isolation.",
      keyInnovations: [
        "Plurality of motion-specific servos",
        "Multi-axis master–slave arm",
        "Error-proportional correction",
        "Force-reflecting resistance",
      ],
      legalSignificance:
        "It is the independent claim that reunites the articulated arm geometry and the force-reflecting servo principle.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Master-arm elevation",
      caption:
        "The source elevation identifies the support, horizontal and vertical arms, tool, and motion assemblies of the master unit.",
      svgType: "goertz-master-slave",
      callouts: [
        {
          id: "goertz-50",
          figureRef: "Fig. 1",
          label: "50",
          element: "Support",
          description: "Source support carrying the articulated master arm.",
          x: 31,
          y: 57,
        },
        {
          id: "goertz-51",
          figureRef: "Fig. 1",
          label: "51",
          element: "Horizontal arm",
          description: "First arm in the source description.",
          x: 47,
          y: 42,
        },
        {
          id: "goertz-52",
          figureRef: "Fig. 1",
          label: "52",
          element: "Vertical arm",
          description: "Second arm carrying the tool at its lower end.",
          x: 65,
          y: 54,
        },
        {
          id: "goertz-53",
          figureRef: "Fig. 1",
          label: "53",
          element: "Tool",
          description:
            "Master handle in this view; the corresponding slave tool is a claw or grasper.",
          x: 68,
          y: 76,
        },
      ],
    },
    {
      figureNumber: "Fig. 9",
      title: "Cable routes for the tool channels",
      caption:
        "The source perspective traces cable paths for tool opening, closing, two tool-axis motions, and vertical-arm rotation.",
      svgType: "goertz-master-slave",
      callouts: [
        {
          id: "goertz-162",
          figureRef: "Fig. 9",
          label: "162",
          element: "Opening/closing cable",
          description: "Source cable splitting at the tool and leading to take-up sheave 165.",
          x: 62,
          y: 48,
        },
        {
          id: "goertz-160-164",
          figureRef: "Fig. 9",
          label: "160–164",
          element: "Tool-motion cables",
          description: "Source cable set routed through the arms for tool-axis motions.",
          x: 52,
          y: 64,
        },
        {
          id: "goertz-175-176",
          figureRef: "Fig. 9",
          label: "175, 176",
          element: "Vertical-arm rotation cables",
          description: "Source cable pair connected with take-up sheave 153 and assembly 57.",
          x: 42,
          y: 37,
        },
      ],
    },
    {
      figureNumber: "Fig. 15",
      title: "One duplicated master–slave servo channel",
      caption:
        "The block diagram shows one of the source’s seven corresponding electrical systems: synchro error, limiter, amplifier, motors, and tachometers.",
      svgType: "goertz-master-slave",
      callouts: [
        {
          id: "goertz-209",
          figureRef: "Fig. 15",
          label: "209 / 209a",
          element: "Synchro pair",
          description:
            "Master control transformer and slave transmitter that establish position error E.",
          x: 48,
          y: 34,
        },
        {
          id: "goertz-210",
          figureRef: "Fig. 15",
          label: "210",
          element: "Limiter",
          description: "Signal-limiting means placed before the power amplifier.",
          x: 60,
          y: 43,
        },
        {
          id: "goertz-204-205",
          figureRef: "Fig. 15",
          label: "204 / 205",
          element: "Motor and tachometer",
          description: "Reversible motor and speed-feedback generator for one movement channel.",
          x: 75,
          y: 63,
        },
      ],
    },
    {
      figureNumber: "Fig. 16",
      title: "Limiter circuit",
      caption:
        "The circuit schematic gives the detailed limiter construction, including transformer, rectifiers, resistors, and condensers described in the specification.",
      svgType: "goertz-master-slave",
      callouts: [
        {
          id: "goertz-218",
          figureRef: "Fig. 16",
          label: "218",
          element: "Transformer",
          description: "Source transformer providing the limiter control voltage.",
          x: 29,
          y: 33,
        },
        {
          id: "goertz-234-236",
          figureRef: "Fig. 16",
          label: "234, 236",
          element: "Mutually inverted rectifiers",
          description: "Source rectifier pair that shunts excess signal amplitude.",
          x: 54,
          y: 57,
        },
        {
          id: "goertz-238",
          figureRef: "Fig. 16",
          label: "238",
          element: "Series resistor",
          description:
            "Source high resistor that receives excess instantaneous voltage during limiting.",
          x: 72,
          y: 62,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A worker needs to grasp, orient, and move objects in a remote or sealed environment where direct access is unsafe or impossible, without losing the tactile judgment that prevents damaging fragile objects or pushing into an obstruction.",
    priorArtLimitations: [
      "A direct mechanical linkage ties master and slave separation, routing, and enclosure design together.",
      "Sending motion alone can make a remote claw follow while withholding resistance at the work site from the operator’s hand.",
      "Multi-axis cable paths can change length when another joint moves, creating slack, excess tension, or entanglement unless their geometry is managed.",
      "An error-driven servo can oscillate or overdrive a motor unless relative-speed feedback and abnormal-condition limiting are designed into the control path.",
    ],
    breakthroughInsight:
      "The grant joins an articulated, cable-managed arm to a repeated bilateral servo channel: position mismatch produces an electrical correction signal, and a remote obstruction converts that mismatch into opposing action at the operator’s handle. It gives a mechanical form to the idea that remote manipulation must carry both motion and resistance.",
    patentWars: [],
    civilizationalImpact:
      "The electronic master–slave approach became part of the technical lineage of manipulators used around nuclear hot cells and other hazardous environments. Its enduring educational value is not a claim that every later robot descends legally from this grant; it is the unusually explicit demonstration that useful teleoperation is a coupled mechanics-and-feedback problem.",
    aftermath:
      "Historical accounts of nuclear remote handling describe the Goertz electrical master–slave architecture as a significant transition from direct mechanical linkages to systems with much greater separation and flexible installation. The record is careful not to convert that broader deployment history into an unproved sales or performance claim for this single patent.",
    funFact:
      "The specification uses closing a remote claw on a glass beaker as its intuitive test case for force reflection: once the claw touches the beaker, the rising position mismatch causes resistance at the operator’s handle.",
  },
  tags: [
    "robotics",
    "teleoperation",
    "force feedback",
    "servo control",
    "nuclear engineering",
    "synchro",
  ],
  stats: {
    totalClaims: 13,
    independentClaims: 6,
  },
};
