import type { Patent } from "@/types/patent";
import { makinoScaraArchivalEdition, makinoScaraClaimText } from "../editions/makinoScaraEdition";

export const makinoScaraPatent: Patent = {
  id: "us-4341502-makino-scara",
  patentNumber: "US 4,341,502",
  title: "Assembly Robot",
  shortTitle: "Makino Four-Link SCARA Assembly Robot",
  subtitle: "Planar Closed-Chain Positioning with Independent Tool-Attitude Control",
  inventors: ["Hiroshi Makino"],
  inventorLocation: "Kofu City, Yamanashi Prefecture, Japan",
  grantDate: "1982-07-27",
  filingDate: "1980-03-24",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Industrial Robotics & Assembly Automation",
  summary:
    "US 4,341,502 claims an assembly robot built around a four-link planar mechanism. Two base-mounted motors rotate the first and fourth links; the assembly tool sits at the opposite link connection. Its independent claims cover concentric and nonconcentric base-axis forms and a Y-linked form that keeps the tool's relative alignment while it moves. The grant also claims a belt-driven third motor that can change tool attitude independently of planar position.",
  heroQuote:
    "The position of the assembling tool 9 can be controlled two dimensionally, and also the attitude or rotational angle of the assembling tool 9 can be controlled.",
  originalPdfUrl: "/patents/pdfs/us-4341502-makino-scara.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4341502A/en",
  usptoClassification: "B25J 13/00; B25J 1/12; G05G 11/00; U.S. 414/744 R; 414/917; 74/479",
  archivalEdition: makinoScaraArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-4341502-makino-scara-reviewed.txt",
    pageCount: 5,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (JadeHeron)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "0ecad64ed838700e9595b18bc782609ff68fe7c0d7829887b4663554ba24b8b8",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "An assembly robot includes a quadrilateral link mechanism",
        sourceRelationship: "Printed masthead, abstract, and bibliographic page.",
      },
      {
        page: 2,
        exactSourceText: "U.S. Patent Jul. 27, 1982 Sheet 1 of 2",
        sourceRelationship: "Printed drawing sheet 1 of 2, containing Figure 1.",
      },
      {
        page: 3,
        exactSourceText: "FIG. 2 FIG. 3 FIG. 4 FIG. 5 FIG. 6",
        sourceRelationship: "Printed drawing sheet 2 of 2, containing Figures 2 through 6.",
      },
      {
        page: 4,
        exactSourceText: "ASSEMBLY ROBOT",
        sourceRelationship:
          "Specification opening, description, and claims 1 through the beginning of 3.",
      },
      {
        page: 5,
        exactSourceText:
          "In the aforementioned embodiment three groups of parallelogram link mechanisms are formed",
        sourceRelationship: "Remainder of specification and printed claims 1 through 7.",
      },
    ],
  },
  originalText: `ASSEMBLY ROBOT

This invention relates to an assembly robot by which parts can be assembled automatically at a high speed.

An object of this invention is to provide an improved assembly robot which avoids the aforementioned problem of weight load on the swinging device, which is capable of operating at a high speed, which is selective, which has a wide working area and which controls the position and attitude of the workpiece.

This object is achieved in accordance with the present invention by the provision of an assembly robot including a quadrilateral link mechanism constructed of four links. Movement devices are connected to each of the first and fourth links. An assembling tool is mounted at the connection of the second and third links. Each of the first and fourth links are concentrically mounted on a base. In some cases, it is possible to connect the first and the fourth links to the base non-concentrically, or to construct the link system in the style of a Y-shape.`,
  plainEnglishExplanation: {
    overview:
      "The ordinary two-link pick-and-place arm has a simple forward-kinematics story: two rotary joints locate the tool, but a distal motor can become moving mass that the proximal joint must accelerate. Makino rearranges the drive and linkage into a four-sided closed chain. Two base motors steer two adjacent sides while the opposite joint carries the assembly tool. The mechanism's legal novelty is not a generic SCARA label; it is the particular four-link, concentric or offset shaft, belt-drive, and Y-link combinations printed in the claims.",
    coreMechanism:
      "For the concentric embodiment, the tool moves in the horizontal plane when the two base axes turn the first and fourth links through θ₁ and θ₂. Equal opposing link lengths keep the main chain a parallelogram. A separate motor can transmit through belts to rotate the tool about its own axis without changing its planar position. In the Y-link embodiment, three coupled parallelogram groups constrain the tool's attitude while the end point translates. The actual grant gives topology and rotations, not link lengths, inertia, torque, payload, control gains, or a numeric compliance matrix; the live model therefore shows source-bounded angular geometry instead of pretending to calculate unprovided SI loads.",
    mechanicalBreakdown: [
      {
        title: "Four-Link Closed Chain",
        summary:
          "First, second, third, and fourth links form a quadrilateral whose opposite side pairs are described as equal and parallel in the Figure 1 embodiment.",
        technicalDetails:
          "A closed planar chain creates dependent joint positions: once the two driven base angles are chosen, the remaining connections must close the loop. In the symmetric visual normalization, the tool coordinate is the intersection required by the two equal-length paths. The source states $\\theta_1$ and $\\theta_2$ as the motor-determined angles but does not state a length $L$, so the viewer reports normalized geometry rather than fictitious metres.",
        archaicTerm: "link mechanism",
        modernEquivalent: "planar closed-chain parallel linkage",
      },
      {
        title: "Concentric Base Drive",
        summary:
          "Claim 1 fixes the first and fourth links to vertically aligned concentric base shafts, with the tool at the second vertical axis.",
        technicalDetails:
          "The two motors remain on the base and rotate separate members about a shared vertical centerline. The claimed result is horizontal movement of the tool. This reduces the need to place the second main drive at the moving distal link; the patent makes a qualitative moving-mass argument, not a payload or acceleration specification.",
        archaicTerm: "swinging device",
        modernEquivalent: "base-mounted rotary actuator",
      },
      {
        title: "Belt-Driven Tool Attitude",
        summary:
          "Claims 2 and 5 add a third motor and two belt runs to rotate the assembly tool independently of its planar position.",
        technicalDetails:
          "The source routes the third motor through belt-supporting members on the base and linkage. In kinematic terms, position is controlled by the two main configuration angles while tool yaw is a separate coordinate $\\phi$. The distinction matters during an insertion task: a tool can approach the same point with a different angular orientation, but the grant supplies no gear ratio, belt tension, or motor speed.",
      },
      {
        title: "Offset and Y-Shaped Variants",
        summary:
          "Claims 3–7 expand the architecture to parallel nonconcentric base axes and to a Y-shaped linkage that preserves relative tool alignment.",
        technicalDetails:
          "With separated base shafts, the linkage no longer forms the simple concentric parallelogram but still positions the tool in its plane. The Y-link construction adds a third constrained path; the patent says it moves the tool without altering its relative alignment. That is a geometric orientation constraint, not proof of a particular compliance stiffness or peg-in-hole force response.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Planar forward kinematics",
        formula: "$\\mathbf{p}_{tool}=f(\\theta_1,\\theta_2;\\text{link topology})$",
        explanation:
          "The tool position is determined by the two base rotations and the linkage's loop-closure constraints. The patent provides the angular inputs and the topology but no numerical geometry, so f is rendered in normalized coordinates only.",
      },
      {
        principle: "Closed-chain loop closure",
        formula: "$\\sum_{i=1}^{4}\\mathbf{r}_i=\\mathbf{0}$",
        explanation:
          "Traversing the four links around a closed mechanism must return to its start. Equal and parallel opposing links in the Figure 1 embodiment yield the parallelogram behavior that carries the tool at the opposite joint.",
      },
      {
        principle: "Independent tool attitude coordinate",
        formula: "$q=[\\theta_1,\\theta_2,\\phi]^T$",
        explanation:
          "The two main motors determine planar configuration; the third motor and belts described in the grant add tool rotation φ. The equation names coordinates only and does not imply a source-provided controller or performance value.",
      },
    ],
    whyItMattersToday:
      "The SCARA family became a practical way to repeat fast planar assembly moves while reserving a separate tool-orientation motion. Makino's patent is especially useful as a teaching object because its figures expose a crucial robotics design choice: where the actuators and transmission mass sit changes the mechanism's dynamic burden, while the claims preserve exact linkage alternatives rather than claiming robotics in the abstract.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: makinoScaraClaimText(1),
      plainEnglish:
        "Claim 1 is the core concentric-base architecture. It requires a four-link mechanism movable in a horizontal plane, three vertical pivot axes through the chain, two base motors whose vertically concentric shafts are fixed to the first and fourth links, and a tool at the second vertical axis. The legal work is the combination: rotating those two base-connected links must move the tool horizontally; a generic two-joint robot with a different topology is not this claim simply because it also moves a tool in a plane.",
      keyInnovations: [
        "Four-link planar closed chain",
        "Concentric base shafts",
        "Opposite-joint assembly tool",
      ],
      legalSignificance:
        "Independent claim defining the concentric-shaft four-link embodiment shown by the central Figure 1 construction.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: makinoScaraClaimText(2),
      plainEnglish:
        "Claim 2 narrows claim 1 by adding a third concentric motor, three belt-support points, and two belt runs along the first and second links. Its functional limit is important: the third motor must rotate the second axis and tool independently of horizontal tool position. In engineering terms this adds a distal orientation coordinate to the planar linkage, but the claim says nothing about a particular belt pitch, gear ratio, tension, angular range, or servo algorithm.",
      keyInnovations: [
        "Concentric third motor",
        "Two-belt transmission",
        "Independent tool rotation",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: makinoScaraClaimText(3),
      plainEnglish:
        "Claim 3 is a separate independent form for a four-link chain driven from two base motors whose shafts are parallel but nonconcentric. The tool is mounted at the second axis, and the driven first and fourth links move it within the mechanism's plane. This preserves the patent's offset-axis alternative: the claim does not require the simple Figure 1 concentric arrangement, while it still requires the four-link topology, two base drives, and their defined relationship to the tool.",
      keyInnovations: [
        "Parallel offset base shafts",
        "Planar four-link tool positioning",
        "Nonconcentric drive arrangement",
      ],
      legalSignificance:
        "Independent claim covering the separated-base-axis embodiment shown in Figure 4.",
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [3],
      originalText: makinoScaraClaimText(4),
      plainEnglish:
        "Claim 4 restricts the claim 3 version to the conventional horizontal work plane: both motor shafts and the first three chain axes extend vertically, and both linkage and tool move horizontally. It does not add a motor or sensor. Instead, it makes the spatial orientation explicit, preventing the broad offset-axis language of claim 3 from being read as an arbitrary three-dimensional linkage with differently oriented pivots.",
      keyInnovations: ["Vertical pivot-axis arrangement", "Horizontal assembly plane"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [3],
      originalText: makinoScaraClaimText(5),
      plainEnglish:
        "Claim 5 adds the Figure 5-style orientation transmission to the offset-axis machine of claim 3. A third motor is concentric with the first motor, while belt-support members and two belts transmit its output along the first and second links to rotate the second axis and the assembly tool independently of planar position. The limitation combines nonconcentric main base axes with the separate belt path; it does not claim all tool rotation on all robot arms.",
      keyInnovations: [
        "Offset-base belt drive",
        "Third-motor attitude control",
        "Independent planar and rotational motion",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: makinoScaraClaimText(6),
      plainEnglish:
        "Claim 6 claims the more elaborate Y-shaped arrangement. It specifies two parallel nonconcentric motor shafts, a first/fourth link path through the tool, plus three Y-link arms coupled around a fifth axis to the first axis, third axis, and second motor shaft. The legal result is constrained: operating the two motors moves the tool within the linkage plane without altering its relative alignment or attitude. It is an attitude-preserving mechanical linkage claim, not an assertion that the machine supplies a universal active compliance controller.",
      keyInnovations: [
        "Y-shaped auxiliary linkage",
        "Three-parallelogram orientation constraint",
        "Attitude-preserving tool motion",
      ],
      legalSignificance:
        "Independent claim for the Figure 6 orientation-preserving Y-link construction.",
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [6],
      originalText: makinoScaraClaimText(7),
      plainEnglish:
        "Claim 7 limits the Y-linked claim 6 machine to vertically extending shafts and axes, with the link mechanism and tool moving in a horizontal plane. The dependent claim does not change how the Y-link preserves attitude; it locates the articulated geometry in the horizontal assembly layout illustrated by the source, which is the setting relevant to a planar pick, placement, or insertion cycle.",
      keyInnovations: ["Vertical-axis Y linkage", "Horizontal tool plane"],
    },
  ],
  drawings: [
    {
      figureNumber: "1",
      title: "Concentric-base four-link assembly robot",
      caption:
        "Source Figure 1: motors 1 and 2 on base 15 drive concentric shafts 3 and 3a, first and fourth links 4 and 5, equal parallel links 6 and 7, and assembly tool 9 at the opposite shaft 8.",
      svgType: "makino-scara",
      callouts: [
        {
          id: "motor-1",
          figureRef: "Fig. 1",
          label: "First motor",
          element: "1",
          description: "Base-mounted motor whose shaft 3 fixes the first link 4.",
          x: 57,
          y: 35,
        },
        {
          id: "motor-2",
          figureRef: "Fig. 1",
          label: "Second motor",
          element: "2",
          description: "Base-mounted motor whose shaft 3a fixes the fourth link 5.",
          x: 54,
          y: 61,
        },
        {
          id: "first-link",
          figureRef: "Fig. 1",
          label: "First link",
          element: "4",
          description: "One driven side of the quadrilateral link mechanism.",
          x: 38,
          y: 50,
        },
        {
          id: "tool",
          figureRef: "Fig. 1",
          label: "Assembly tool",
          element: "9",
          description: "Tool mounted at the shaft opposite the two base shafts.",
          x: 34,
          y: 77,
        },
      ],
    },
    {
      figureNumber: "2–6",
      title: "Planar kinematic and linkage variants",
      caption:
        "Source Figures 2–6: angular path diagram, belt-driven tool rotation, separated base shafts, combined belt/offset form, and the Y-shaped attitude-preserving linkage.",
      svgType: "makino-scara",
      callouts: [
        {
          id: "theta-1",
          figureRef: "Fig. 2",
          label: "First-link angle",
          element: "θ1",
          description: "Rotation of link 4 about its driven base shaft.",
          x: 32,
          y: 24,
        },
        {
          id: "theta-2",
          figureRef: "Fig. 2",
          label: "Fourth-link angle",
          element: "θ2",
          description: "Rotation of link 5 about its driven base shaft.",
          x: 68,
          y: 24,
        },
        {
          id: "belt-drive",
          figureRef: "Fig. 3",
          label: "Belt devices",
          element: "11, 12",
          description: "Belts driven by motor 10 to rotate the assembly tool.",
          x: 28,
          y: 34,
        },
        {
          id: "y-link",
          figureRef: "Fig. 6",
          label: "Y-shaped link mechanism",
          element: "14",
          description: "Auxiliary three-arm linkage used to maintain tool alignment.",
          x: 50,
          y: 76,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "High-speed assembly, especially peg-in-hole work, needs more than reaching a coordinate: the tool must arrive with the usable position and attitude without loading a moving distal drive into a proximal actuator.",
    priorArtLimitations: [
      "The specification says rectangular and cylindrical coordinated robots had relatively small working ranges and equal-direction movement that could cause peg-entry jamming.",
      "The earlier multi-jointed compliance arrangement placed a second-link swinging device where it became a weight load on the first-link drive.",
    ],
    breakthroughInsight:
      "Put the main motion drives at the base and use a quadrilateral closed chain to carry the tool; then add belt transmission or a Y-link only where the claim needs independent tool rotation or preserved tool attitude.",
    patentWars: [],
    civilizationalImpact:
      "This is an early, legible source for the SCARA class of factory assembly robot: a spatial machine whose drawings make the linkage/actuator trade-off inspectable. Its industrial relevance is in the repeatable planar assembly problem, not in a claim that it invented every subsequent robot arm.",
    aftermath:
      "Makino reported later that early SCARA prototypes were followed by industrial partners' commercial variants. That later adoption is historical context, while the museum record keeps the legal scope anchored to the seven claims of this United States grant.",
    sideNotes: [
      "The specification reports that assembling speed can be one or more pieces per second, but does not identify a payload, part geometry, motor rating, or test procedure.",
      "The patent's English title is simply “Assembly Robot”; SCARA is a later widely used class name, not a title printed on the grant.",
    ],
  },
  tags: ["robotics", "industrial automation", "SCARA", "closed-chain linkage", "assembly"],
  stats: { totalClaims: 7, independentClaims: 3 },
};
