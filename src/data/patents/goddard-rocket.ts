import type { Patent } from "@/types/patent";
import { goddardRocketArchivalEdition } from "../editions/goddardRocketEdition";

function manualClaimText(number: number): string {
  const block = goddardRocketArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim")
    throw new Error(`Goddard manual edition is missing claim ${number}.`);
  return block.inlines.map((inline) => inline.text).join("");
}

export const goddardRocketPatent: Patent = {
  id: "us-1102653-goddard-rocket",
  patentNumber: "US 1,102,653",
  title: "Rocket Apparatus",
  shortTitle: "Solid-Charge Auxiliary Rocket",
  subtitle: "Tapered exhaust tube, spin-producing charges, and gyroscopic camera support",
  inventors: ["Robert H. Goddard"],
  inventorLocation: "Worcester, Massachusetts",
  grantDate: "1914-07-07",
  filingDate: "1913-10-01",
  era: "Early Rocket Research (1900–1920)",
  category: "aerospace",
  categoryLabel: "Aerospace & Rocket Propulsion",
  summary:
    "US 1,102,653 describes a solid-explosive rocket for carrying photographic or other recording instruments to extreme heights. Its disclosed apparatus uses a long tapered exhaust tube, electrically fired backward-curved spin charges, a smaller auxiliary rocket fired from a forward tube after the main charge is substantially consumed, and a gyroscope-supported camera that does not rotate with the spinning head.",
  heroQuote:
    "This invention relates to a rocket apparatus and particularly to a form of such apparatus adapted to transport photographic or other recording instruments to extreme heights.",
  originalPdfUrl: "/patents/pdfs/us-1102653-goddard-rocket.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US1102653A/en",
  usptoClassification: "F02K 9/00 (Rocket-engine plants)",
  archivalEdition: goddardRocketArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-1102653-goddard-rocket-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: goddardRocketArchivalEdition.sourcePdfSha256,
  },
  originalText: `UNITED STATES PATENT OFFICE.
ROBERT H. GODDARD, OF WORCESTER, MASSACHUSETTS.

ROCKET APPARATUS.

1,102,653. Specification of Letters Patent. Patented July 7, 1914.
Application filed October 1, 1913. Serial No. 792,707.

To all whom it may concern:
Be it known that I, ROBERT H. GODDARD, a citizen of the United States, residing at Worcester, in the county of Worcester and State of Massachusetts, have invented a new and useful Rocket Apparatus, of which the following is a specification.

This invention relates to a rocket apparatus and particularly to a form of such apparatus adapted to transport photographic or other recording instruments to extreme heights. Certain features of the invention are also applicable to the display of signals or to the projection of explosives.

The full reviewed transcription and manually authored source edition are available on the visitor-facing archival reading face.`,
  plainEnglishExplanation: {
    overview:
      "The source solves four linked problems for a high-altitude recording rocket: turn explosive heat into useful exhaust motion, rotate the rocket before launch, restore spin in its smaller follow-on rocket, and keep the camera from spinning with the outer body. It uses solid explosive disks, not liquid oxygen or gasoline; it fires the smaller rocket from a tube rather than dropping an exhausted lower stage.",
    coreMechanism:
      "Disks 12 burn in primary chamber 10 and discharge through tapered tube 11. Goddard specifies a slightly tapered truncated cone at least three times its longest diameter, chosen so expanding gases can complete combustion before leaving the tube. Electrical heating elements ignite the backward-curved charges in recesses 15, producing reaction torque and initial spin. After the primary explosive is substantially consumed, fuse 28 fires the reduced auxiliary rocket in tube 24. Its later curved-tube charges restore spin, while gyroscope 37 keeps the pivoted camera support from following the head's rotation.",
    mechanicalBreakdown: [
      {
        title: "Primary solid-charge chamber and tapered tube",
        summary: "Explosive disks burn in chamber 10 and exhaust through the long tapered tube 11.",
        technicalDetails:
          "Goddard prefers disks 12 with progressively increasing burn rates so chamber pressure remains constant at the pressure for which tube 11 is designed. The tube is a truncated cone of slight taper, at least three times its longest diameter. It gives gases room to expand and complete combustion before exit. In conservation-of-momentum terms, exhaust momentum produces the rocket reaction, $F = \\dot{m} v_e$; the source does not state a supersonic nozzle or a measured exhaust velocity.",
        archaicTerm: "explosive material",
        modernEquivalent: "solid propellant charge",
      },
      {
        title: "Initial spin charges",
        summary:
          "Backward-curved radial recesses 15 use reaction from small explosive charges to rotate the complete rocket.",
        technicalDetails:
          "Charges 16 sit in substantially radial, backwardly curved tubes. Battery 19, key 20, wires 18, and embedded heating elements 17 ignite them simultaneously. Their reaction torque raises the rocket's angular speed before fuse 14 starts main propulsion. The engineering relation is $\tau = dL/dt$: a torque changes angular momentum $L$; the patent's limitation is the specific curved-tube explosive arrangement, not a generic attitude-control system.",
        archaicTerm: "tubes or recesses",
        modernEquivalent: "tangential spin thruster passages",
      },
      {
        title: "Firing tube and auxiliary rocket",
        summary:
          "A reduced secondary rocket is launched from firing tube 24 after substantial consumption of the primary charge.",
        technicalDetails:
          "Fuse 28 reaches from auxiliary charge 27 into the last primary disk 12. The condition matters: when the primary propelling charge is substantially exhausted, fuse 28 ignites and firing tube 24 acts as a gun. The smaller rocket has its own chamber 25, tapered tube 26, and disks 27. This is a projectile-from-a-tube arrangement, not a claimed interstage separation mechanism.",
        archaicTerm: "firing tube",
        modernEquivalent: "launch tube for an auxiliary rocket",
      },
      {
        title: "Spin restoration and camera orientation",
        summary:
          "Auxiliary charges restore rotation, while a three-phase-motor gyroscope resists rotation of the camera support.",
        technicalDetails:
          "When auxiliary explosive 27 has been consumed to a predetermined extent, its rapidly burning path lights charges 31 in curved recesses 30. In head 29, pivoted support 33 holds camera 34. Gyroscope 37 is the armature of a three-phase induction motor and is brought to speed through wires 41 and temporary contact wires 43. Angular-momentum conservation makes its axis resist a change of orientation, keeping support 33 from rotating with the spinning head.",
        archaicTerm: "apparatus head",
        modernEquivalent: "instrument compartment",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Energy conversion and exhaust reaction",
        formula: "F = \\dot{m} v_e",
        explanation:
          "Goddard explicitly treats the fraction of explosive heat transformed into kinetic energy as decisive for velocity. The familiar momentum form says thrust follows mass-flow rate times exhaust velocity, but the source's actual hardware is a solid charge and long tapered tube, with proportions selected experimentally.",
      },
      {
        principle: "Rotational dynamics",
        formula: "\\tau = dL/dt",
        explanation:
          "Backward-curved passages discharge gas so its reaction supplies a torque. The initial set is made before flight in frame 21; the auxiliary rocket later has separate passages and a timed ignition path to restore spin after atmospheric friction has reduced it.",
      },
      {
        principle: "Gyroscopic orientation",
        formula: "L = I\\omega",
        explanation:
          "A spinning rotor has angular momentum. Goddard uses gyroscope 37 on pivoted support 33 so the support can resist sharing the head's rotation. The patent describes the practical high-speed drive as a three-phase induction motor rather than claiming modern inertial navigation.",
      },
    ],
    whyItMattersToday:
      "This 1914 document is an unusually complete early high-altitude instrument-rocket proposal: it connects exhaust-tube geometry, pre-launch spin, a follow-on smaller rocket, and a gyroscopically held camera. Its value is in those stated combinations and conditions, not in a retroactive claim that it disclosed liquid engines, de Laval nozzles, or modern stage separation.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claim 1 combines a primary rocket with both a combustion chamber and a firing tube, a secondary rocket mounted in that tube, and a trigger that fires the secondary rocket when the primary explosive is substantially consumed. The timing condition and the tube-mounted secondary rocket are both required parts of this claim.",
      keyInnovations: [
        "primary rocket",
        "firing tube",
        "secondary rocket",
        "substantial-consumption firing condition",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claim 2 is limited to a combustion chamber containing explosive and its rearward tapered discharge tube. The tube must be a slightly tapered truncated cone and must be at least three times its longest diameter. It does not claim liquid propellant, a converging throat, or any specified Mach number.",
      keyInnovations: [
        "solid explosive chamber",
        "rearward tapered tube",
        "truncated cone",
        "three-diameter minimum length",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claim 3 adds rotation to the primary-and-secondary rocket arrangement. The primary rocket supplies the initial rotation of both rockets; the secondary rocket has its own means to maintain its rotation after firing from the primary firing tube.",
      keyInnovations: [
        "primary firing tube",
        "secondary rocket",
        "initial rotation",
        "secondary spin maintenance",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claim 4 covers a rocket casing with propulsion and separate rotation means: substantially radial transverse tubes curved backward relative to the direction of rotation. Those tubes contain explosive with embedded heating elements, and the elements fire all tube charges at the same time.",
      keyInnovations: [
        "backward-curved transverse tubes",
        "explosive spin charges",
        "embedded heating elements",
        "simultaneous ignition",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualClaimText(5),
      plainEnglish:
        "Claim 5 requires a first means that produces initial rotation, a propelling-explosive chamber, additional explosive in substantially radial curved tubes, and firing means between those explosives. The additional tube explosive must ignite when the propelling charge has been consumed to the stated predetermined extent and restore the initial spin rate.",
      keyInnovations: [
        "initial spin",
        "propelling explosive",
        "radial curved tubes",
        "predetermined-consumption ignition",
        "spin restoration",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText: manualClaimText(6),
      plainEnglish:
        "Claim 6 requires a rocket with a combustion chamber, an apparatus head that contains a support for the carried apparatus, means that rotate the rocket, and means that prevent the apparatus support from rotating. Its legal work is to keep the instrument support distinct from the spinning outer rocket.",
      keyInnovations: [
        "combustion chamber",
        "apparatus head",
        "rotating rocket",
        "non-rotating apparatus support",
      ],
    },
    {
      number: 7,
      isIndependent: true,
      originalText: manualClaimText(7),
      plainEnglish:
        "Claim 7 specifies one anti-rotation arrangement: the apparatus head contains a pivotally mounted support, and a gyroscope mounted on that support restrains it from rotating with the head. The pivot and gyroscope are express limitations, not merely a general camera mount.",
      keyInnovations: [
        "pivoted support",
        "apparatus head",
        "gyroscope",
        "restraint from head rotation",
      ],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: manualClaimText(8),
      plainEnglish:
        "Claim 8 covers the head, a support pivoted inside it, a gyroscope on the support, and means that impart a high initial gyroscope speed. In the illustrated apparatus, the three-phase induction-motor arrangement supplies that starting speed, but the claim states the function rather than naming that motor.",
      keyInnovations: [
        "apparatus head",
        "pivoted support",
        "gyroscope",
        "high initial rotational speed",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Longitudinal view of the rocket apparatus",
      caption:
        "Longitudinal view, partly in section, of the rocket apparatus as a whole. Source PDF p. 1.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-10",
          figureRef: "Fig. 1",
          label: "10",
          element: "Combustion chamber",
          description: "Primary combustion chamber containing disks 12.",
          x: 77,
          y: 61,
        },
        {
          id: "gd-11",
          figureRef: "Fig. 1",
          label: "11",
          element: "Tapered tube",
          description: "Elongated tapered discharge tube below the primary chamber.",
          x: 77,
          y: 83,
        },
        {
          id: "gd-24",
          figureRef: "Fig. 1",
          label: "24",
          element: "Firing tube",
          description: "Forward tube from which the auxiliary rocket is fired.",
          x: 78,
          y: 43,
        },
        {
          id: "gd-29",
          figureRef: "Fig. 1",
          label: "29",
          element: "Auxiliary head",
          description: "Head containing the camera support and gyroscope assembly.",
          x: 78,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Enlarged section of the apparatus head",
      caption:
        "Enlarged longitudinal sectional view of the head of the apparatus. Source PDF p. 1.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-33",
          figureRef: "Fig. 2",
          label: "33",
          element: "Apparatus support",
          description: "Pivotally mounted support for the recording apparatus.",
          x: 54,
          y: 22,
        },
        {
          id: "gd-37",
          figureRef: "Fig. 2",
          label: "37",
          element: "Gyroscope",
          description: "Gyroscope carried in the apparatus support.",
          x: 49,
          y: 18,
        },
        {
          id: "gd-39",
          figureRef: "Fig. 2",
          label: "39",
          element: "Field coils",
          description: "Three-phase induction-motor field coils used to start the gyroscope.",
          x: 46,
          y: 28,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Primary rocket spin charges",
      caption: "Transverse sectional view on line 3-3 of Fig. 2. Source PDF p. 1.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-15",
          figureRef: "Fig. 3",
          label: "15",
          element: "Backward-curved tubes",
          description: "Substantially radial, backward-curved recesses for initial-spin charges.",
          x: 50,
          y: 45,
        },
        {
          id: "gd-16",
          figureRef: "Fig. 3",
          label: "16",
          element: "Explosive material",
          description: "Explosive placed in the primary spin tubes.",
          x: 48,
          y: 47,
        },
        {
          id: "gd-17",
          figureRef: "Fig. 3",
          label: "17",
          element: "Heating element",
          description: "Fine metal filament embedded for simultaneous electrical ignition.",
          x: 53,
          y: 51,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Auxiliary rocket spin-restoration charges",
      caption: "Transverse sectional view on line 4-4 of Fig. 2. Source PDF p. 1.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-30",
          figureRef: "Fig. 4",
          label: "30",
          element: "Curved tubes",
          description: "Curved recesses in the auxiliary rocket head.",
          x: 49,
          y: 50,
        },
        {
          id: "gd-31",
          figureRef: "Fig. 4",
          label: "31",
          element: "Explosive charges",
          description: "Charges ignited to increase or restore auxiliary spin.",
          x: 49,
          y: 44,
        },
        {
          id: "gd-32",
          figureRef: "Fig. 4",
          label: "32",
          element: "Ignition tubes",
          description: "Small tubes carrying the rapidly burning compound from charge 27.",
          x: 50,
          y: 52,
        },
      ],
    },
    {
      figureNumber: "Fig. 5",
      title: "Launching framework",
      caption:
        "Vertical elevation of the framework from which the apparatus may be fired, drawn to reduced scale. Source PDF p. 1.",
      svgType: "goddard-rocket",
      callouts: [
        {
          id: "gd-21",
          figureRef: "Fig. 5",
          label: "21",
          element: "Vertical framework",
          description: "Framework that holds the rocket while it is spun before launch.",
          x: 51,
          y: 48,
        },
        {
          id: "gd-22",
          figureRef: "Fig. 5",
          label: "22",
          element: "Ball bearing",
          description: "One of the ball bearings supporting the rocket in the frame.",
          x: 56,
          y: 77,
        },
        {
          id: "gd-23",
          figureRef: "Fig. 5",
          label: "23",
          element: "Ball bearing",
          description: "The second ball bearing at the upper rocket support.",
          x: 57,
          y: 37,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification's stated bottleneck is reaching extreme heights with recording instruments while converting a larger fraction of a solid explosive charge's heat into the rocket's kinetic energy. It also treats spin and the direction of a carried camera as linked practical problems.",
    priorArtLimitations: [
      "The source contrasts ordinary rockets that discharge combustion gases through a rear opening with the elongated tapered tube 11 used here.",
      "A spinning outer rocket would rotate a recording apparatus with it unless a separate support and restraint were provided.",
      "Atmospheric friction reduces the auxiliary rocket's rotation, so initial spin alone does not meet the stated operational goal.",
    ],
    breakthroughInsight:
      "Goddard joins a long, slightly tapered exhaust tube to solid-charge combustion; a pre-launch electrically fired spin system; a reduced auxiliary rocket fired when the main charge is substantially consumed; and a gyroscope-supported recording instrument. The exact claims divide those combinations into eight independently stated legal definitions.",
    patentWars: [],
    civilizationalImpact:
      "The source records an early attempt to make a high-altitude instrument rocket into a coordinated machine rather than a simple firework. Its technical record includes solid-charge exhaust expansion, staged follow-on flight from a firing tube, spin management, and gyroscopic instrument orientation.",
    aftermath:
      "The printed specification does not document a patent dispute, later settlement, or a particular commercial outcome. This record therefore preserves the historical apparatus and avoids attributing later liquid-engine or interstage-separation claims to US 1,102,653.",
  },
  tags: [
    "Robert H. Goddard",
    "solid rocket",
    "high-altitude photography",
    "gyroscope",
    "rocket spin",
    "auxiliary rocket",
  ],
  stats: { totalClaims: 8, independentClaims: 8 },
};
