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

export const watsonRccPatent: Patent = {
  id: "us-4098001-watson-rcc",
  patentNumber: "US 4,098,001",
  title: "Remote Center Compliance System",
  shortTitle: "Watson Remote Center Compliance Device",
  subtitle: "Focal Cone Flexures, Decoupled Compliance Matrix, and Peg-in-Hole Assembly",
  inventors: ["Paul C. Watson"],
  inventorLocation: "Arlington, Massachusetts",
  grantDate: "1978-07-04",
  filingDate: "1976-10-13",
  era: "Information & Digital Age (1950–Present)",
  category: "consumer",
  categoryLabel: "Robotics & Mechanisms",
  summary:
    "Paul C. Watson's landmark 1978 Draper Laboratory patent invented the Remote Center Compliance (RCC) device, a purely passive kinematic wrist that projects the elastic center of rotational compliance forward in space to the tip of a held workpiece. By decoupling lateral forces from angular tilting, the RCC eliminated positive-feedback jamming and wedging, enabling high-speed robotic insertion of tight-tolerance components across global manufacturing.",
  heroQuote:
    "The rotational center of compliance must be projected remotely to the tip of the peg, so that lateral forces produce pure lateral translation without tilting, and moments produce pure angular rotation about the tip without lateral translation.",
  originalPdfUrl: "/patents/pdfs/us-4098001-watson-rcc.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4098001A/en",
  usptoClassification: "29/721",

  originalTextAsset: {
    url: "/patents/transcripts/us-4098001-watson-rcc-reviewed.txt",
    pageCount: 8,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "67ca409f96f1456b603f198653a1a5d9c411c25dab5737ac2824b7fdaff2093b",
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

  archivalEdition: watsonRccArchivalEdition,

  originalText: `This invention relates to a remote center compliance system for assembler devices, and more particularly to such a system which enables decoupled rotational and translational motion of an operator with respect to a remote center.

Automatic assembly machines, robots, and teleoperators often encounter difficulty in fitting mating parts together, such as inserting a cylindrical peg into a chamfered hole, due to minor misalignments between the parts. If the assembler or robot is completely rigid, even a fractional-millimeter lateral or angular misalignment will cause the peg to contact the rim of the hole and generate high contact forces that lead to jamming and wedging.

Conventional flexible mountings, such as rubber bushings or cantilever springs mounted at the wrist of the robot arm, have an elastic center located at or near the wrist itself. Consequently, when a lateral contact force is exerted on the tip of the peg, the peg rotates about the wrist. This rotation tilts the tip of the peg further into the wall of the hole, increasing the misalignment angle and wedging the peg tightly against the bore. To avoid jamming, the effective center of rotational compliance must be projected remotely to the tip of the peg.`,

  plainEnglishExplanation: {
    overview:
      "In industrial robotics, inserting a tight-clearance steel peg into a precision bore is notoriously difficult. If a robot is rigid, any slight misalignment generates massive contact forces that stall the machine. However, if conventional flexible springs are added at the robot wrist, a counter-intuitive failure occurs: when the tip of the peg hits the hole chamfer, the lateral reaction force creates a moment about the wrist spring, rotating the peg into a steeper tilt that gouges into the hole wall and permanently jams (the peg-in-hole paradox). Paul Watson at MIT's Draper Laboratory solved this with geometric brilliance: by angling elastic flexure rods along the generators of a cone whose apex converges at the tip of the peg, the effective elastic center of rotation is projected out into empty space at the peg tip itself. When the tip touches the chamfer, the lateral force acts directly through this elastic center, creating zero net torque. The peg slides laterally into perfect alignment with zero tilt, making high-speed, sub-millimeter insertion effortless and wholly passive.",
    coreMechanism:
      "The Remote Center Compliance (RCC) system employs a two-stage decoupled flexure geometry. Stage 1 consists of three vertical flexure rods arranged parallel to the insertion axis, which bend in parallel S-curves to provide pure planar lateral translation ($C_{xx} = 0.40\\text{ mm/N}$). Stage 2 consists of three focal flexure rods angled inward along a conical surface whose apex intersects at the remote center $L_{\\text{RCC}}$ at the peg tip. These focal rods provide pure spherical pitch/yaw rotation ($C_{\\theta\\theta} = 0.022\\text{ rad}/(\\text{N}\\cdot\\text{m})$). Because the compliance matrix is diagonalized ($C_{x\\theta} = C_{\\theta x} = 0$), transverse contact forces $F_x$ produce pure translation $\\delta_x = C_{xx} F_x$ without tilting, while contact moments $M_y$ produce pure rotation $\\theta_y = C_{\\theta\\theta} M_y$ about the tip without translation.",
    mechanicalBreakdown: [
      {
        title: "Focal Flexure Conical Rotational Stage",
        summary:
          "Three converging elastic rods providing pure spherical rotation about the projected remote center.",
        technicalDetails:
          "Angled along conical radii converging toward the workpiece tip. Each rod features precision necked pivots at both ends that accommodate elastic angular bending while transmitting axial forces with extreme rigidity.",
        archaicTerm: "Rotational interconnection elements disposed along spherical radii",
        modernEquivalent: "Focal flexure cone / Remote elastic center pivot",
      },
      {
        title: "Parallel Flexure Translational Stage",
        summary:
          "Three parallel vertical rods providing pure planar translation perpendicular to insertion axis.",
        technicalDetails:
          "Arranged parallel to the tool axis between the upper mounting plate and the intermediate ring. When transverse loads occur, the rods bend into symmetric parallel curves, allowing lateral shift $\\delta_x$ without angular tilting.",
        archaicTerm: "Translational interconnection elements disposed generally parallel",
        modernEquivalent: "Parallel-guided flexure translation stage",
      },
      {
        title: "Torsional Metal Bellows",
        summary:
          "Concentric corrugated bellows providing high torsional drive stiffness while allowing lateral compliance.",
        technicalDetails:
          "Surrounds the central axis to transmit rotary drive torques up to $350\\text{ N}\\cdot\\text{m/rad}$ for threaded fastener insertion, while remaining completely compliant to lateral shear and spherical pitch/yaw deflection.",
        archaicTerm: "Torque resistant means interconnected between first member and operator",
        modernEquivalent: "Torsional decoupling bellows",
      },
      {
        title: "Tension-Mode Inverted Geometry",
        summary:
          "Alternative kinematic configuration placing focal flexures in tension during press-fits.",
        technicalDetails:
          "In high-force press-fit insertions, forward axial thrust places standard compression flexures at risk of Euler column buckling. The tension-mode embodiment (FIG. 9) routes load paths so axial thrust pulls the focal rods in tension, raising the buckling safety limit above $1200\\text{ N}$.",
        archaicTerm: "Concatenated mechanism arranged to put flexures in tension",
        modernEquivalent: "Tension-configured flexure suspension",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Spatial Compliance Matrix Diagonalization",
        formula:
          "\\begin{bmatrix} \\delta_x \\\\ \\theta_y \\end{bmatrix} = \\begin{bmatrix} C_{xx} & 0 \\\\ 0 & C_{\\theta\\theta} \\end{bmatrix} \\begin{bmatrix} F_x \\\\ M_y \\end{bmatrix}",
        explanation:
          "Conventional wrists have non-zero off-diagonal cross-coupling terms ($C_{x\\theta} \\neq 0$), causing lateral forces to generate fatal tilting moments. The RCC's focal geometry eliminates cross-coupling at the contact point, diagonalizing the compliance matrix.",
      },
      {
        principle: "Critical Wedging Angle & Jamming Boundary",
        formula:
          "\\theta_{\\text{crit}} = \\frac{2c}{d_{\\text{peg}}} \\quad \\text{and} \\quad L_{\\text{jam}} = \\frac{d_{\\text{peg}}}{2\\mu}",
        explanation:
          "In precision peg-in-hole fits, two-point contact causes irreversible geometric wedging if the tilt angle exceeds $2c/d$ (where $c$ is clearance and $d$ is peg diameter). The RCC guarantees that contact forces never tilt the peg past $\\theta_{\\text{crit}}$, preventing wedging.",
      },
      {
        principle: "Euler Flexure Column Buckling Limit",
        formula: "P_{\\text{crit}} = \\frac{\\pi^2 E I}{(K L)^2}",
        explanation:
          "Under axial insertion loads, slender flexure rods must sustain compressive forces without buckling. Watson's necked pivots define fixed-guided end conditions ($K = 0.5$), maximizing critical buckling threshold.",
      },
    ],
    whyItMattersToday:
      "The Remote Center Compliance device revolutionized automated manufacturing. Before Watson's invention at Draper Laboratory, precision assembly required complex, slow, and expensive multi-axis force-feedback electronic servos. The RCC proved that elegant passive kinematic geometry could solve the peg-in-hole paradox instantaneously at zero computational cost, enabling the automated assembly of millions of automotive engines, electronics, and aerospace components worldwide.",
  },

  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Assembly Insertion Schematic",
      caption:
        "Schematic diagram showing the remote center compliance system mounted to a robot head inserting a peg into a chamfered hole.",
      svgType: "watson-rcc",
      callouts: [
        {
          id: "callout-10-rcc",
          figureRef: "Fig. 1",
          label: "RCC System",
          element: "10",
          description: "Overall remote center compliance assembly",
          x: 50,
          y: 30,
        },
        {
          id: "callout-12-rotational",
          figureRef: "Fig. 1",
          label: "Rotational Stage",
          element: "12",
          description: "Focal flexure stage providing spherical rotation about remote center",
          x: 50,
          y: 45,
        },
        {
          id: "callout-14-translational",
          figureRef: "Fig. 1",
          label: "Translational Stage",
          element: "14",
          description: "Parallel flexure stage providing lateral planar translation",
          x: 50,
          y: 20,
        },
        {
          id: "callout-16-peg",
          figureRef: "Fig. 1",
          label: "Workpiece Peg",
          element: "16",
          description: "Cylindrical insertion workpiece held by tool plate",
          x: 50,
          y: 65,
        },
        {
          id: "callout-50-center",
          figureRef: "Fig. 1",
          label: "Remote Center",
          element: "50",
          description: "Projected elastic center of compliance located at peg tip",
          x: 50,
          y: 85,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Decoupled Rotational Deflection",
      caption:
        "Kinematic diagram showing pure angular rotation about the remote center under an applied moment R with zero lateral tip shift.",
      svgType: "watson-rcc",
      callouts: [
        {
          id: "callout-20-tilt",
          figureRef: "Fig. 2",
          label: "Angular Tilt",
          element: "θ",
          description: "Pure rotational deflection about projected apex 50",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Figure 3",
      title: "Decoupled Lateral Translation",
      caption:
        "Kinematic diagram showing pure lateral translation under a transverse force T with zero angular tilt.",
      svgType: "watson-rcc",
      callouts: [
        {
          id: "callout-30-shift",
          figureRef: "Fig. 3",
          label: "Lateral Shift",
          element: "x",
          description: "Pure parallel translation without angular tilting",
          x: 50,
          y: 50,
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
        "A remote center compliance system for an assembler device comprising a first base member, a second tool member, an intermediate third member, at least three rotational flexure elements disposed along spherical radii converging toward a remote center at or near the workpiece tip for enabling rotation about that remote center, and a plurality of translational flexure elements disposed parallel to the insertion axis for enabling independent lateral translation relative to the base member.",
      keyInnovations: [
        "Converging focal flexure rods projecting elastic rotational center to workpiece tip",
        "Parallel flexure rods providing independent lateral planar compliance",
        "Decoupled compliance matrix eliminating cross-coupling moments",
        "Major motion necked flexural pivot hinges",
      ],
      legalSignificance:
        "Foundational independent claim establishing the legal monopoly over passive remote center compliance devices for robotics and automated assembly.",
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualClaimText(2),
      plainEnglish:
        "The compliance system of claim 1, further comprising a torsional restraint mechanism (such as a metal bellows) connected between the base member and tool member to prevent twisting while permitting lateral and spherical compliance.",
      keyInnovations: [
        "Torsional bellows for torque transmission in threaded fastener driving",
        "Preservation of lateral and pitch/yaw compliance under high drive torque",
      ],
      dependsOn: [1],
    },
  ],

  historicalContext: {
    problemStatement:
      "In the mid-1970s, industrial robots such as the Unimate and Cincinnati Milacron were beginning to enter automotive factories, but they were severely limited in assembly operations. Inserting precision parts (like engine wrist pins, ball bearings, or hydraulic spools) into tight bores caused catastrophic wedging and jamming due to fractional-millimeter robot repeatability errors. Active closed-loop force-torque sensing required expensive computers and was too slow (cycle times of seconds per part), while conventional flexible wrist mounts made jamming worse by pivoting at the wrist and tilting the peg into the hole wall.",
    priorArtLimitations: [
      "Rigid robot manipulators generated extreme contact forces under sub-millimeter positional misalignments, damaging workpieces or stalling motors.",
      "Cantilever rubber bushings and wrist springs located their elastic center at the robot wrist plate, causing lateral contact forces to induce counter-productive angular tilts that gouged bore walls.",
      "Active 6-axis force-torque sensor control loops in 1976 required mainframe computers and slow iterative servo corrections, making high-speed industrial cycle times (<0.2 s) impossible.",
    ],
    breakthroughInsight:
      "Paul Watson and Daniel Whitney at MIT Draper Laboratory analyzed the spatial compliance matrix of peg-in-hole contact mechanics. Watson realized that the elastic center of rotation does not need to physically reside inside the metal wrist hardware—by angling flexure rods along converging conical generators, the virtual elastic center of rotation can be projected out into empty space directly at the tip of the held peg. At this remote center, the compliance matrix is diagonalized: lateral contact forces produce pure sideways translation with zero tilt, allowing the chamfer to effortlessly guide the peg into the bore.",
    patentWars: [],
    civilizationalImpact:
      "The Remote Center Compliance (RCC) device became one of the most celebrated and commercially pervasive mechanical inventions in the history of automation. Licensed by Draper Laboratory to companies like Barry Controls, Lord Corporation, and ATI Industrial Automation, the RCC enabled robots worldwide to assemble automobile transmissions, electronic connectors, aircraft jet engines, and consumer appliances at lightning speed without jamming.",
    aftermath:
      "Watson's RCC patent spurred an entire academic and industrial sub-field in passive kinematic compliance, impedance control, and robotic assembly theory. The fundamental mathematics developed for the RCC by Watson, Whitney, and Nevins remain the standard textbook curriculum in modern robotics manipulation.",
    sideNotes: [
      "The invention emerged from the Draper Lab Industrial Automation Program funded by the National Science Foundation (NSF Grant GI-39432X).",
      "Daniel Whitney's 1982 landmark paper 'Quasi-Static Assembly of Compliantly Supported Rigid Parts' in the ASME Journal of Dynamic Systems provided the definitive mathematical treatment of Watson's device.",
    ],
    funFact:
      "Draper Lab engineers demonstrated the RCC by having a standard industrial robot effortlessly insert a 0.5-inch steel peg into a hole with only 0.0005-inch (12-micron) clearance while an engineer violently shook the workpiece table by hand.",
  },

  stats: {
    totalClaims: 2,
    independentClaims: 1,
  },
};
