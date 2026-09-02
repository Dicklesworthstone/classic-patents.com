import { salisburyRobotHandArchivalEdition } from "@/data/editions/salisburyRobotHandEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = salisburyRobotHandArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Salisbury Robot Hand manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const salisburyRobotHandPatent: Patent = {
  id: "us-4921293-salisbury-robot-hand",
  patentNumber: "US 4,921,293",
  title: "Multi-Fingered Robotic Hand",
  shortTitle: "Salisbury Four-Cable Articulated Robot Hand",
  subtitle: "Remote Tendon Actuation, Three-Axis Fingers, and Cable-Tension Feedback",
  inventors: ["Carl F. Ruoff", "J. Kenneth Salisbury, Jr."],
  inventorLocation: "Palo Alto and La Crescenta, California",
  grantDate: "1990-05-01",
  filingDate: "1984-12-12",
  era: "Computing & Digital (1970–Present)",
  category: "computing",
  categoryLabel: "Robotics & Dextrous Manipulators",
  summary:
    "Ruoff and Salisbury’s NASA-assigned patent describes a three-digit robotic hand with three joints per digit, four remotely driven cables per digit, two cable-tension sensor arrangements, and resilient frictional tip surfaces. The printed torque equations show exactly how four cable tensions and selected pulley radii combine into three joint torques.",
  heroQuote:
    "Also like the human hand, the object can be moved about, twisted, rotated, etc. for a wide variety of tasks by finger motion alone.",
  originalPdfUrl: "/patents/pdfs/us-4921293-salisbury-robot-hand.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4921293A/en",
  usptoClassification: "294/111",

  originalTextAsset: {
    url: "/patents/transcripts/us-4921293-salisbury-robot-hand-reviewed.txt",
    pageCount: 10,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "a630e3a6c5e3bee141740ed3de4d315ea4ded7f525d5db8f8c4f9605af52fbed",
  },

  archivalEdition: salisburyRobotHandArchivalEdition,

  originalText: `The present invention relates to robot manipulators having end effectors, i.e. robotic hands.

In the past robotic manipulators have generally employed a six-degrees-of-freedom arm with an end effector, i.e. hand, capable of only simple grasping. Typically such end effectors used in the past have included two vise-like clamping fingers having together only one degree-of-freedom of movement, due to being coupled together for movement purposes. Two problems that exist with such end effectors are that they are (1) unable to adapt to a wide range of object shapes; and (2) unable to make small displacements at the hand without moving the entire manipulating arm.

One solution of this problem has been an attempt to use robot manipulators having actuators for the hands located on the forearm of the manipulator. Such actuators have been connected to the fingers by bare cables passing over a plurality of pulley sheaves in the manner of vintage dentist’s drills.`,

  plainEnglishExplanation: {
    overview:
      "The patent starts from a scale mismatch. A large six-degree-of-freedom arm can position a part across a broad work volume, but asking those same joints to make the last sub-centimetre correction slows and blurs force control. Earlier two-jaw hands could grasp but could not adapt well to shape or move the object inside the grasp. Ruoff and Salisbury put nine finger degrees of freedom at the tool while keeping the drive package remote. Three connected digits—two fingers and an opposing thumb—each receive four sheathed cables routed beside, rather than operatively through, the wrist mechanism.",
    coreMechanism:
      "For the Figure 3 routing, the four cable tensions are T₁ through T₄ and the illustrated pulley radii are R₁ through R₃. Opposing T₂ and T₃ rotates the third joint; opposing T₁ and T₄ rotates the second. Pulling T₂ and T₃ together while T₁ and T₄ pay out turns the first joint one way; pulling T₁ and T₄ together turns it the other. The patent gives the source law directly: $\\tau_1=-T_1R_1+T_2R_2+T_3R_2-T_4R_1$, $\\tau_2=T_1R_3+T_2R_2-T_3R_2-T_4R_3$, and $\\tau_3=T_2R_2-T_3R_2$. It also warns that a built hand may use four distinct radii. Strain-gauged palm structures measure each cable’s tension; no historic force, speed, stiffness, friction, or dimension values are printed, so the interactive model refuses to invent them.",
    mechanicalBreakdown: [
      {
        title: "Connected Three-Joint Digit",
        summary:
          "Pins, brackets, pulleys, and three serial joints form a continuous load path from the palm to the covered tip.",
        technicalDetails:
          "Axis 1 passes through pin 36 at the palm. Axis 2 passes through pin 43 and Axis 3 through pin 47. The source states that Axes 2 and 3 lie in one plane and Axis 1 lies in a perpendicular plane. It supplies no link lengths or joint-angle limits; the model therefore shows topology and normalized articulation rather than asserting a historic workspace.",
        archaicTerm: "first joint, second joint, and third joint",
        modernEquivalent: "three-degree-of-freedom serial robotic digit",
      },
      {
        title: "Four-Cable, Three-Torque Transmission",
        summary:
          "Four tension-only cable ends share drive and idler pulleys to address three joint axes.",
        technicalDetails:
          "For the illustrated route, cable ends T₂ and T₃ wrap the tip idler and Axis-2 idler; T₁ and T₄ are the ends of one cable passing from Axis 1 around the Axis-2 drive pulley. The products $T_iR_j$ are moments in newton-metres when tension is in newtons and radius in metres. The patent does not specify cable material, diameter, baseline pretension, or a backlash value.",
        archaicTerm:
          "means for guiding and attaching first, second, third, and fourth control cables",
        modernEquivalent:
          "underactuated tendon routing with four cable ends for three joint torques",
      },
      {
        title: "Palm-Mounted Cable-Tension Sensors",
        summary:
          "Two disclosed structures convert cable loading into measurable support strain before the cables enter a digit.",
        technicalDetails:
          "Figure 5 bends the cable over a central strut inside a deflecting member and places gauges between that strut and an exit opening. Figure 4 instead carries a cable pulley on a strain-gauged cantilever. The specification calls the measured strain a function of cable tension, but gives no calibration curve, range, accuracy, bandwidth, or friction compensation claim.",
        archaicTerm: "cable tension sensing structure mounted on hand",
        modernEquivalent: "tendon-force transducer at the palm",
      },
      {
        title: "Resilient Frictional Tip Covering",
        summary:
          "A durable, somewhat flexible surface helps the terminal joints engage irregular objects.",
        technicalDetails:
          "The preferred embodiment says the third joint may be covered in a resilient material and offers hard rubber only as an example. It names flexibility, compliability, firmness, durability, and frictional engagement as desired properties. It does not identify polyurethane, a tip radius, covering thickness, durometer, coefficient of friction, contact law, or a force-closure guarantee.",
        archaicTerm: "resilient and pliable friction enhancing surface",
        modernEquivalent: "compliant high-friction fingertip covering",
      },
      {
        title: "Remote Actuator and External Wrist Routing",
        summary:
          "The drive and control mechanism stays away from the hand while individually sheathed cables run beside the arm and wrist.",
        technicalDetails:
          "The embodiment bundles four sheathed cables per digit into protective sleeves and locates the drive package remotely, for example on the forearm. The source’s claimed benefit is reduced hand actuator mass and no required operative cable connection through wrist gimbals. The grant permits other remote locations and even unsheathed or unbundled cable variants.",
        archaicTerm: "passing externally of the robot manipulating arm",
        modernEquivalent:
          "remotely actuated tendon transmission routed outside the wrist mechanism",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Moment from Cable Tension",
        formula: "\\tau_1=-T_1R_1+T_2R_2+T_3R_2-T_4R_1",
        explanation:
          "Each cable contributes a signed moment equal to tension times its effective pulley radius. At Axis 1, T₂ and T₃ act with one sign while T₁ and T₄ act with the other for the Figure 3 route.",
      },
      {
        principle: "Differential Cable Action",
        formula: "\\tau_3=(T_2-T_3)R_2",
        explanation:
          "Equal T₂ and T₃ cancel at Axis 3; their difference curls the terminal joint. The same pair’s sum can still contribute to Axis 1 because both cables pass the base axis on the same side.",
      },
      {
        principle: "Middle-Joint Cable Balance",
        formula: "\\tau_2=(T_1-T_4)R_3+(T_2-T_3)R_2",
        explanation:
          "The middle-joint torque combines the differential action of both cable pairs for the illustrated radii. A distal command can therefore also load Axis 2 unless the other tensions compensate it.",
      },
      {
        principle: "Measured Tension as Controller Input",
        formula: "\\varepsilon_{\\text{support}} \\longrightarrow T_i \\longrightarrow \\tau_j",
        explanation:
          "The disclosed gauges measure strain in a support loaded by a routed cable. A controller can use the resulting cable-tension estimates with motor encoder data to compute joint torques, but the patent does not print a sensor transfer function or controller gains.",
      },
    ],
    whyItMattersToday:
      "The grant captures a still-central robot-hand tradeoff in unusually concrete form: dexterity at the tool increases the number of joints, but remote tendon actuation keeps motors and their inertia away from those joints. Its value here is not a claim that every later hand descends from it; it is a checkable worked architecture in which routing, sensing, torque equations, and the connected mechanical assembly can be read together.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 covers the full three-joint, four-cable routing combination. It specifies which opposed cable pull rotates the third or second joint and which paired pull, while the other pair moves, turns the first joint in either direction; it does not claim dimensions, materials, or force performance.",
      keyInnovations: [
        "Three-revolute-joint articulated finger",
        "Four control cables for three articulated joints",
        "Claimed paired and opposed cable-pull sequence",
      ],
      legalSignificance:
        "The broad independent apparatus claim: the legal work is the specified relationship among three serial joints, four cables, and four pull patterns.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 separately covers an articulated finger with an idler on the first axis, a drive pulley on the outboard second axis, one cable drive engaging both, and a way to fix the idler so cable movement articulates the first joint. It does not promise decoupling accuracy.",
      keyInnovations: [
        "Concentric idler pulley on first axis",
        "Drive pulley on second axis",
        "Fixable idler position for first-joint articulation",
      ],
      legalSignificance:
        "The second independent claim protects the stated idler-and-drive-pulley subassembly even apart from Claim 1’s complete four-cable sequence.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 adds a second idler on the first axis and a second cable drive. Fixing the second idler and moving its cable articulates the first joint opposite to the direction produced by fixing the first idler and driving the first cable.",
      keyInnovations: [
        "Second idler pulley on the first axis",
        "Opposite first-joint articulation directions",
      ],
      legalSignificance:
        "Narrows Claim 2 to a second routed cable drive that supplies the opposite first-joint direction; it does not require equal or symmetric torque.",
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [3],
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 narrows Claim 3 by putting the first and second cable-drive engagement positions on opposite sides of the first axis. The protected fact is their sidedness relative to that axis, not a numerical pulley spacing or a guarantee of balanced torque.",
      keyInnovations: [
        "Cable engagements on opposite sides of Axis 1",
        "Two-position idler routing geometry",
      ],
      legalSignificance:
        "Adds a concrete spatial limit to Claim 3: the two cable engagement positions must lie on opposite sides of the first axis.",
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [3],
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 adds an outboard third joint on a third axis and a second drive pulley whose rotation articulates that joint. The second cable drive from Claim 3 must also engage this second drive pulley, extending the routed drive farther along the finger.",
      keyInnovations: [
        "Outboard third joint and third axis",
        "Second cable drive engaging the second drive pulley",
      ],
      legalSignificance:
        "Extends Claim 3’s two-cable-drive arrangement to a third articulated joint without specifying a historic link length or joint range.",
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 adds one geometric requirement to Claim 2: the second axis is perpendicular to the first. That establishes two orthogonal rotation directions, but the claim does not promise a hemispherical workspace or state any angular limits.",
      keyInnovations: [
        "Perpendicular first and second axes",
        "Orthogonal two-joint articulation geometry",
      ],
      legalSignificance:
        "Narrows the independent idler-pulley claim to the perpendicular-axis embodiment drawn and described in the specification.",
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [5],
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 narrows Claim 5 by requiring both the second and third axes to be perpendicular to the first axis. Because both are perpendicular to Axis 1, the embodiment can curl its outboard joints in the plane described by the specification.",
      keyInnovations: [
        "Second and third axes perpendicular to Axis 1",
        "Three-axis finger orientation constraint",
      ],
      legalSignificance:
        "Adds the printed axis-orientation constraint to the three-joint routing of Claim 5; the claim itself does not state joint travel or link proportions.",
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [2],
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 specifies the ‘means to fix’ from Claim 2: the first cable drive has two ends, and pulling both ends fixes the first idler’s position. The language does not require equal force or claim a particular stiffness, impedance, or locking accuracy.",
      keyInnovations: ["Two-ended first cable drive", "First-idler fixation by pulling both ends"],
      legalSignificance:
        "Narrows Claim 2 by defining idler fixation through a two-ended cable pull rather than leaving the fixing means entirely generic.",
    },
    {
      number: 9,
      isIndependent: false,
      dependsOn: [3],
      originalText: manualClaimText(9),
      plainEnglish:
        "Claim 9 applies the same two-ended-cable construction to Claim 3’s second drive: pulling both ends fixes the second idler. It claims that mechanical action only, not programmable stiffness, clutch replacement, or a quantified rigidity.",
      keyInnovations: [
        "Two-ended second cable drive",
        "Second-idler fixation by pulling both ends",
      ],
      legalSignificance:
        "Narrows Claim 3 by specifying how the second idler can be held while the routed cable arrangement supplies the opposite first-joint direction.",
    },
  ],

  drawings: [
    {
      figureNumber: "1",
      title: "Robot Arm, Wrist, Palm, and Three-Digit Hand",
      caption:
        "Perspective view of the connected arm, two-axis wrist, palm, two fingers, opposing thumb, cable bundles, and remote actuator drive and control.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-1-palm",
          figureRef: "Fig. 1",
          label: "Palm member",
          element: "20",
          description: "Connected palm structure supporting the two fingers and opposing thumb.",
          x: 49,
          y: 45,
        },
        {
          id: "callout-1-drive",
          figureRef: "Fig. 1",
          label: "Actuator drive and control",
          element: "35",
          description:
            "Remote package connected to the hand by three bundled groups of four cables.",
          x: 78,
          y: 79,
        },
      ],
    },
    {
      figureNumber: "2",
      title: "Side View of a Multi-Jointed Finger",
      caption:
        "Side view identifying pins 36, 43, and 47, the first and second joint structures, and the covered terminal joint.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-2-pulley",
          figureRef: "Fig. 2",
          label: "Axis-2 idler pulley",
          element: "44",
          description: "Idler mounted on pin 43 at the second joint axis.",
          x: 55,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "3",
      title: "Exploded Cable-and-Pulley Routing",
      caption:
        "Exploded schematic showing cable ends T₁ through T₄, the three axes, and the R₁, R₂, and R₃ pulley-radius labels used in the equations.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-3-axis1",
          figureRef: "Fig. 3",
          label: "Four base pulleys",
          element: "30′–30⁗",
          description: "Contiguous sheaves route all four cables through the Axis-1 connection.",
          x: 25,
          y: 51,
        },
        {
          id: "callout-3-axis2",
          figureRef: "Fig. 3",
          label: "Tip idler pulley",
          element: "54",
          description: "T₂ and T₃ wrap this idler at the terminal joint.",
          x: 82,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "4",
      title: "Cantilever Cable-Tension Sensor",
      caption:
        "One sensor embodiment routes cable 33 over pulley 59 on cantilever 58, whose strain gauges 56 respond to cable loading.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-4-sensor",
          figureRef: "Fig. 4",
          label: "Strain-gauged cantilever",
          element: "56, 58",
          description:
            "Gauges on the cantilever measure support strain caused by the routed cable.",
          x: 47,
          y: 53,
        },
      ],
    },
    {
      figureNumber: "5",
      title: "Deflecting-Member Cable-Tension Sensor",
      caption:
        "Alternative sensor embodiment in which cable 33 passes through member 64 and over central strut 54 between strain gauges 56.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-5-member",
          figureRef: "Fig. 5",
          label: "Deflecting member",
          element: "64",
          description: "The cable deflects this structure so gauges can infer its tension.",
          x: 50,
          y: 48,
        },
      ],
    },
    {
      figureNumber: "6",
      title: "Further Finger Embodiment, Side View",
      caption:
        "Side view of the alternate cable route from the palm sensors over Axis 1 and through the connected finger joints.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-6-routing",
          figureRef: "Fig. 6",
          label: "Four cable routes",
          element: "T₁–T₄",
          description:
            "All four tension paths remain mechanically routed from the palm into the joints.",
          x: 47,
          y: 48,
        },
      ],
    },
    {
      figureNumber: "7",
      title: "Further Finger Embodiment, Plan View",
      caption:
        "Plan view showing the double-helical wrap around idler 44′, the second idler 44″, fasteners 70, and curved cable-bearing surface 72.",
      svgType: "salisbury-robot-hand",
      callouts: [
        {
          id: "callout-7-idlers",
          figureRef: "Fig. 7",
          label: "Paired idler routing",
          element: "44′, 44″",
          description: "Two Axis-2 idlers organize the four side-by-side cable paths.",
          x: 50,
          y: 49,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "The specification says contemporary robot arms commonly ended in coupled, vise-like two-finger grippers with one degree of freedom. They adapted poorly to varied shapes and forced small, precise assembly corrections back onto much larger arm joints.",
    priorArtLimitations: [
      "Forearm actuators with bare cables required multiple wrist gimbals per cable, crowding the wrist and limiting finger count and motion.",
      "Passive compliance devices and active small-motion stages still used grippers suited mainly to static grasping, leaving manipulation to the arm.",
      "The cited Okada hand used 22 cables for 11 degrees of freedom, routed all of them through wrist gimbals, and required a specially designed arm and controller.",
      "Seven frictionless contacts could immobilize many objects, but the patent notes that implementation was formidable and could not twist a surface of revolution against resistance.",
    ],
    breakthroughInsight:
      "The disclosed hand separates the heavy drive package from a mechanically connected, nine-degree-of-freedom hand. Four cables per digit route through the joints, two sensor designs expose cable tension, and the printed equations make the relationship between tension, pulley radius, and joint torque inspectable.",
    patentWars: [],
    civilizationalImpact:
      "This public grant preserves a complete, teachable robot-hand architecture: serial joints, remote tendon drives, cable sensing, compliant friction surfaces, and a source-printed torque map. It lets readers evaluate the real engineering compromises without relying on later marketing claims or an untraceable reconstruction.",
    aftermath:
      "The patent was assigned to the United States of America as represented by NASA’s Administrator. The facsimile does not document licensing, commercial adoption, or later-product lineage, so this edition does not manufacture one.",
    funFact:
      "The preferred hand gives nine finger degrees of freedom with twelve cables and no extra cable-tensioning devices; the specification contrasts that with the eighteen cables its cited two-cables-per-joint approach would need for nine degrees of freedom.",
    sideNotes: [
      "The patent offers hard rubber only as an example fingertip covering; it does not print a material grade or friction coefficient.",
      "The torque equations are tied to Figure 3’s routing and radii, and the inventors explicitly allow other pulley sizes and rigging.",
    ],
  },

  tags: [
    "robotics",
    "dextrous manipulation",
    "robot hand",
    "tendon drive",
    "NASA",
    "cable tension sensing",
    "remote actuation",
  ],

  stats: {
    totalClaims: 9,
    independentClaims: 2,
  },
};
