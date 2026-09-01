import { watsonRccArchivalEdition } from "@/data/editions/watsonRccEdition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = watsonRccArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Watson RCC manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

export const watsonRemoteCenterCompliancePatent: Patent = {
  id: "us-4098001-watson-rcc",
  patentNumber: "US 4,098,001",
  title: "Remote Center Compliance System",
  shortTitle: "Watson Passive Remote-Center Compliance End Effector",
  subtitle: "Radial flexures, axial flexures, and a virtual pivot at the insertion tip",
  inventors: ["Paul C. Watson"],
  inventorLocation: "Arlington, Massachusetts",
  grantDate: "1978-07-04",
  filingDate: "1976-10-13",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Robotics & Passive Assembly",
  summary:
    "Granted on July 4, 1978, Watson's two-claim grant covers a passive assembly attachment with at least three rotational interconnection elements laid along spherical radii of a remote point and a separate plurality of generally axial translational elements. The claimed arrangement lets an inserted tool seek a hole laterally and then rotate about a virtual center at, near, or beyond its working end, without asserting an active sensor-and-servo control loop.",
  heroQuote:
    "The invention results from the realization that by creating virtual rotation centers located beyond the remote center compliance system mechanism and near or at the end of the insertion member, forces and moments may be created corresponding to a gentle pulling of the member to be inserted into the hole.",
  originalPdfUrl: "/patents/pdfs/us-4098001-watson-rcc.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4098001A/en",
  usptoClassification: "Int. Cl. G01B 5/25; U.S. Cl. 33/169 C, 33/185 R, 33/189 (printed)",
  archivalEdition: watsonRccArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-4098001-watson-rcc-reviewed.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
    sourcePdfSha256: "67ca409f96f1456b603f198653a1a5d9c411c25dab5737ac2824b7fdaff2093b",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-01",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "REMOTE CENTER COMPLIANCE SYSTEM",
        sourceRelationship: "front page and sectional drawing",
      },
      { page: 2, exactSourceText: "Sheet 1 of 3", sourceRelationship: "printed drawing sheet 1" },
      { page: 3, exactSourceText: "Sheet 2 of 3", sourceRelationship: "printed drawing sheet 2" },
      { page: 4, exactSourceText: "Sheet 3 of 3", sourceRelationship: "printed drawing sheet 3" },
      {
        page: 5,
        exactSourceText: "FIELD OF INVENTION",
        sourceRelationship: "printed specification pp. 1–2",
      },
      {
        page: 6,
        exactSourceText: "There is shown in FIG. 1",
        sourceRelationship: "printed specification pp. 3–4",
      },
      {
        page: 7,
        exactSourceText: "The means for establishing translational motion 14",
        sourceRelationship: "printed specification pp. 5–6",
      },
      {
        page: 8,
        exactSourceText: "The system of claim 1",
        sourceRelationship: "printed specification pp. 7–8 and claims",
      },
    ],
  },
  originalText: `FIELD OF INVENTION

This invention relates to a remote center compliance system and more particularly to such a system which enables rotation in two directions about a remote center and which enables translational motion as well as rotational motion.

BACKGROUND OF INVENTION

In many industrial, scientific and other applications, it is necessary to perform insertion operations, such as putting pegs in holes, screws into threaded apertures, placing parts into specific locations, and similar operations.

SUMMARY OF INVENTION

The invention results from the realization that by creating virtual rotation centers located beyond the remote center compliance system mechanism and near or at the end of the insertion member, forces and moments may be created corresponding to a gentle pulling of the member to be inserted into the hole.`,
  plainEnglishExplanation: {
    overview:
      "The patent treats a common robot problem—getting a peg, bearing, screw, or gripped component into a slightly misplaced hole—as a geometry problem before it is a sensing problem. A rigid tool jams when its lateral position or axis is wrong. A fully active answer can use force sensors, servos, computing, and a search routine; Watson instead claims a passive stack of compliant members whose working tip has a virtual pivot at the relevant insertion location.",
    coreMechanism:
      "Three radial flexures are oriented as portions of spherical radii that meet at a virtual remote center. When the tool is tilted by a contact moment, their constrained bending makes the tool axis rotate approximately about that point. A separate set of generally axial flexures accommodates lateral translation. The source's sequence is contact at a chamfer → lateral accommodation → a second contact pair creates a moment → axis alignment. The grant gives topology, not a stiffness matrix, a force limit, a clearance, or a material model.",
    mechanicalBreakdown: [
      {
        title: "Remote-center rotational layer",
        summary:
          "At least three rotational elements lie along spherical radii leading toward the virtual point at, near, or beyond the tool end.",
        technicalDetails:
          "In the Figure 1 form, flexures 24, 26, and 28 connect plate 20 and ring 22; their centerlines follow radii 42, 44, and 46 toward remote center 50. A small orientation change is geometrically read as a rotation around that point. The source does not give a spring constant, so the exhibit reports geometry and claim topology rather than invented torque or force values.",
        archaicTerm: "remote center",
        modernEquivalent: "virtual remote-center-of-compliance pivot",
      },
      {
        title: "Translational layer",
        summary:
          "A plurality of elements generally parallel to the operator axis gives the tool lateral accommodation before angular correction.",
        technicalDetails:
          "The text identifies flexures 56, 58, and 60 between lip 54 and plate 22. With a lateral contact, their motion shifts the tool relative to the machine. In a small-displacement teaching picture, the tip's lateral coordinate changes first; the patent does not establish a linear stiffness law such as $F = kx$ for this embodiment.",
        archaicTerm: "means for establishing translational motion",
        modernEquivalent: "passive translational compliance stage",
      },
      {
        title: "Chamfered insertion contact",
        summary:
          "The drawing uses the entrance chamfer to turn a positioning error into a lateral force and then an aligning moment.",
        technicalDetails:
          "Figures 4 and 5 distinguish two errors. A rod guided by chamfer 75 can shift toward hole 71. If its axis 76 still differs from hole axis 78, opposite contacts generate the indicated rotational moment M. The source describes this causal order but provides no contact friction coefficient or permissible insertion load.",
        archaicTerm: "operator means",
        modernEquivalent: "tool, gripper, or end effector",
      },
      {
        title: "Torque-resistant addition",
        summary:
          "The dependent claim adds a member that prevents twist around the tool's long axis while retaining the specified lateral and angular freedoms.",
        technicalDetails:
          "Figure 7 depicts bellows 90 with casing 92 and support wire 94. Its purpose is to resist a third rotational mode—tool-axis twist—when the end tool applies turning torque such as a screw-threading operation. Claim 2 is about the presence of that torque-resistant means, not a specified torsional stiffness.",
        archaicTerm: "torque resistant means",
        modernEquivalent: "anti-twist constraint or torsional restraint",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Remote-center kinematics",
        formula:
          "\\Delta\\mathbf{x}_{tip} \\approx \\boldsymbol{\\theta} \\times \\mathbf{r}_{tip}",
        explanation:
          "For a small angular change, a point's displacement is the cross product of the rotation vector and its vector from the virtual center. The formula explains why locating the virtual center at the useful tip matters. It is a teaching relation, not a calibration of Watson's unreported geometry.",
      },
      {
        principle: "Spherical-radius constraint geometry",
        formula: "\\mathbf{r}_{24},\\mathbf{r}_{26},\\mathbf{r}_{28} \\rightarrow O_{remote}",
        explanation:
          "The radial rotational elements are arranged along radii that converge at the remote center. Their layout constrains the permitted relative motion so that a contact moment can be represented as an orientation change about the chosen virtual point.",
      },
      {
        principle: "Contact-guided alignment sequence",
        formula: "e_{axis} = \\hat{u}_{tool} \\times \\hat{u}_{hole}",
        explanation:
          "The cross product is zero only when the tool and hole axes are parallel or anti-parallel. The patent's Figure 5 narrative says contact creates a moment until the rod axis becomes coincident with the hole axis; it does not supply a controller gain or a convergence rate.",
      },
    ],
    whyItMattersToday:
      "Remote-center compliance made a crucial industrial-robotics idea legible: a useful end effector can use the shape of a contact and the geometry of its compliant members instead of treating every insertion as a software perception-and-control problem. The 1978 NBS/RIA workshop report on Draper's RCC program records experimental assembly work with large initial errors; that is technology-lineage evidence, not a claim that this exact grant sets those test dimensions or sales figures.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 requires a fixed first member, a second member carrying the operator tool, and a third intermediate member. It then requires at least three rotational interconnection elements located along spherical radii that lead to a remote point at, near, or beyond the tool end, plus plural generally axial translational elements on the other side of the intermediate member. The legal combination is the topology that gives the tool both a remote-center rotation and translation relative to the fixed machine.",
      keyInnovations: [
        "Three radial rotational interconnection elements",
        "Remote center at or beyond tool end",
        "Plural generally axial translational elements",
        "Intermediate shared member",
      ],
      legalSignificance:
        "The sole independent claim defines a structured passive compliance architecture rather than claiming every robotic insertion method or every end-effector flexure.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 keeps all of Claim 1 and adds torque-resistant means between the fixed member and operator means. Its specific legal function is prevention of twisting of the end tool; Figure 7's bellows is the explanatory embodiment, while the claim itself is framed more generally as a means limitation.",
      keyInnovations: [
        "Torque-resistant means",
        "Anti-twist tool constraint",
        "Bellows-supported torsional restraint",
      ],
      legalSignificance:
        "This dependent claim narrows the architecture to installations where the insertion tool must not spin about its own axis, such as a tool applying turning torque.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Remote center compliance system",
      caption:
        "Sectional Figure 1 places three rotational flexures and three translational flexures between the fixed machine portion and rod 16; dashed radii meet at remote center 50 near the working end.",
      svgType: "watson-remote-center-compliance",
      callouts: [
        {
          id: "wrcc-1",
          figureRef: "Fig. 1",
          label: "16",
          element: "Rod",
          description: "The printed operating rod whose free end is near the virtual center.",
          x: 50,
          y: 72,
        },
        {
          id: "wrcc-2",
          figureRef: "Fig. 1",
          label: "50",
          element: "Remote center",
          description: "The marked virtual point where the flexure radii converge.",
          x: 50,
          y: 85,
        },
        {
          id: "wrcc-3",
          figureRef: "Fig. 1",
          label: "24, 26, 28",
          element: "Rotational flexures",
          description: "Three elements aligned along the printed radial geometry.",
          x: 50,
          y: 30,
        },
        {
          id: "wrcc-4",
          figureRef: "Fig. 1",
          label: "56, 58, 60",
          element: "Translational flexures",
          description: "Elements that provide the source-described translational motion.",
          x: 20,
          y: 30,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Angular correction at the hole",
      caption:
        "The source shows rod axis 76 initially noncoincident with hole axis 78, then rotated by the indicated moment M after contact at the chamfered opening.",
      svgType: "watson-remote-center-compliance",
      callouts: [
        {
          id: "wrcc-5",
          figureRef: "Fig. 5",
          label: "76",
          element: "Rod axis",
          description: "The source labels the initially misaligned tool axis.",
          x: 50,
          y: 54,
        },
        {
          id: "wrcc-6",
          figureRef: "Fig. 5",
          label: "78",
          element: "Hole axis",
          description: "The target opening axis used for the source's alignment description.",
          x: 50,
          y: 78,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "How can an industrial end effector insert a part despite lateral and angular error without making a powered sensing-and-servo system responsible for every small contact correction?",
    priorArtLimitations: [
      "Watson says manual insertion was tedious, expensive, and difficult to sustain with the necessary delicacy.",
      "The specification describes servo-and-force-sensor mechanical hands as expensive because of feedback circuitry, computers, and software.",
      "It characterizes one-dimensional periphery search and proximate-center fixtures as complex or obstructive in the work area.",
    ],
    breakthroughInsight:
      "Put the effective rotation center where the insertion geometry needs it—at, near, or beyond the tool end—and concatenate that rotational compliance with an independent translational stage. Contact at a chamfer then supplies the geometric cue that the passive structure accommodates.",
    patentWars: [],
    civilizationalImpact:
      "The grant is a lucid source for passive-compliance end-effectors: mechanism geometry can externalize part of the alignment problem that would otherwise be pushed into sensors, actuators, and control software. It records a family of flexure, bellows, bearing, and concatenated arrangements rather than a single decorative gripper.",
    funFact:
      "The front page says “2 Claims, 15 Drawing Figures”; the three sheets visibly number them as 1, 2, 3, 4, 4A, 5, 5A, 6, 7, 8, 9, 10, 11, 11A, and 12.",
    aftermath:
      "A 1978 National Bureau of Standards/RIA workshop report describes Draper's RCC work as experimentally demonstrating assembly despite large initial error and identifies the program as a simpler alternative to sensory feedback. That supports the surrounding technology lineage, not an unqualified claim about shipment or performance of the exact patented fixture.",
    sideNotes: [
      "The printed disclosure expressly names a robot hand, mechanical grip, claws, and clamps as possible replacements for rod 16.",
      "The source admits flexures, springs, ball bearings, and low-friction spherical surfaces as alternative interconnections; it does not lock every embodiment to one material or one mechanism layout.",
    ],
  },
  tags: [
    "Paul C. Watson",
    "Remote Center Compliance",
    "End Effector",
    "Robot Assembly",
    "Passive Compliance",
    "Flexure",
  ],
  stats: { totalClaims: 2, independentClaims: 1 },
};
