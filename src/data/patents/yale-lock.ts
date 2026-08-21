import { manualYaleClaimText, yaleLockArchivalEdition } from "@/data/editions/yaleLockEdition";
import type { Patent } from "@/types/patent";

export const yaleLockPatent: Patent = {
  id: "us-48475-yale-lock",
  patentNumber: "US 48,475",
  title: "Improvement in Locks",
  shortTitle: "Yale Pin-Tumbler Cylinder Lock & Flat Bitted Key",
  subtitle:
    "Shear-Line Pin Alignment, Flat Corrugated Keyway, Rotating Plug, and Modular Threaded Mortise Cylinder",
  inventors: ["Linus Yale, Jr."],
  inventorLocation: "Shelburne Falls, Massachusetts",
  grantDate: "1865-06-27",
  filingDate: null,
  era: "Industrial Revolution & Mechanical Age (1760–1870)",
  category: "consumer",
  categoryLabel: "Mechanical Locks & Security Systems",
  summary:
    "Linus Yale Jr.'s 1865 patent describes a lock combining a cylindrical tumbler-case, a rotating plug, two-piece pin tumblers, a thin bitted key, and a lost-motion wing or lazy-arm. The same specification also claims a spring plate for retaining the bolt and threaded cylinder mounting that can be adapted to either hand of lock and to doors of different thicknesses.",
  heroQuote:
    "The tumblers or pins are each made in two pieces, I and J, and must all be arranged by the key, so that the various lines of division between the two parts of the tumblers are all in the same line before the cylinder D can be turned.",
  originalPdfUrl: "/patents/pdfs/us-48475-yale-lock.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US48475A/en",
  usptoClassification: "70/375",

  originalTextAsset: {
    url: "/patents/transcripts/us-48475-yale-lock-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Editorial Team",
    reviewedAt: "2026-08-19",
    sourcePdfSha256: "8426b35afe9957149ea2f87629cb37c9519409799ddbb578947e23d3d0fa0250",
  },

  archivalEdition: yaleLockArchivalEdition,

  originalText:
    "Be it known that I, LINUS YALE, Jr., of Shelburne Falls, in the county of Franklin and State of Massachusetts, have invented certain new and useful Improvements in Locks... A case, C, contains the tumblers and a wing, E, moved by the key. This case has a thread cut on its outside corresponding with the screw-threads in O, and the tumbler-case can be screwed into either side of the lock-case, thus making it a right or left hand lock... The tumblers or pins are each made in two pieces, I and J, and each is provided with a spring, L. The pieces I and J are of different lengths, and must all be arranged by the key, so that the various lines of division between the two parts of the tumblers are all in the same line before the cylinder D can be turned.",

  plainEnglishExplanation: {
    overview:
      "The specification addresses two practical problems in a tumbler lock: resistance to picking and the difficulty of adapting a lock to either hand of door and to different door thicknesses. Yale's design puts the key-operated tumblers in a cylindrical case that screws into the lock-case, while a thin wing or lazy-arm actuates and stops the bolt. The key raises the two-piece tumblers until their division lines are in line with the periphery of the plug. The document does not state a pin count, machining tolerance, key thickness, or universal door-thickness range; those values remain unspecified here.",
    coreMechanism:
      "In the locked state, the springs press the two-piece tumblers across the boundary between the stationary tumbler-case and the rotating plug. Inserting the thin key raises the lower pieces so that every division between pieces is brought into line with the plug's periphery; the specification gives no numerical tolerance. The plug can then turn, and its ring recess and axial groove engage the lazy-arm's knob. The lazy-arm moves through less than the plug's whole revolution, so its wing remains in contact with a bolt talon at the locked and unlocked positions.",
    mechanicalBreakdown: [
      {
        title: "Revolving Plug & Eccentric Cylinder Housing",
        summary:
          "The inner cylindrical core that contains the keyway slot and pin chambers, mounted eccentrically inside the externally threaded tumbler-case.",
        technicalDetails:
          "Plug D revolves in the cylindrical bore of tumbler-case C. The case has an external thread that engages a tapped hole in either side of lock-case A, and a jam-nut or pointed screw H can hold the case at the desired depth so its end remains flush with the door. The source gives no material, diameter, or door-thickness dimensions.",
        archaicTerm: "cylinder D eccentric to the tumbler-case",
        modernEquivalent: "Revolving Lock Core / Plug Cylinder",
      },
      {
        title: "Two-Piece Split Pin Tumblers & Compression Springs",
        summary:
          "Pin chambers contain paired tumbler pieces I and J, with springs L pressing the pieces toward the plug.",
        technicalDetails:
          "The source says only that pieces I and J have different lengths and that each tumbler is provided with a spring. The key is shaped so the divisions between the pieces lie in one line before plug D can turn. No pin dimensions, spring constant, material, or force value is stated.",
        archaicTerm: "tumblers or pins made in two pieces, I and J",
        modernEquivalent: "Driver Pins & Key Pins (Pin Stack)",
      },
      {
        title: "Flat Serrated Bitted Key Blade",
        summary:
          "A thin slip of steel shaped to bring the divisions between the tumbler pieces into one line.",
        technicalDetails:
          "The specification calls K a thin slip of steel and describes its shape in relation to the pin divisions and narrow key-hole. It does not quantify the blade thickness, number of bittings, key-space size, or weight reduction.",
        archaicTerm: "thin slip of steel properly shaped (key K)",
        modernEquivalent: "Flat Bitted Paracentric Key",
      },
      {
        title: "Anti-Pick Circumferential Serrations & Racked Chambers",
        summary:
          "Notches or screw-like cuts on the tumblers or their containing recesses, used with the narrow key-hole and comparatively large cavities.",
        technicalDetails:
          "Yale says these notches serve the purpose of racking on vibrating or rotating tumblers and prevent picking to a certain extent. The narrow key-hole leaves most of each containing cavity supporting the part that projects into the key-hole, reducing the risk of jamming under key thrust. The source does not quantify a picking force or friction coefficient.",
        archaicTerm: "racked pin-tumblers and notched containing-recesses",
        modernEquivalent: "Serrated Security Pins / Spool Pins",
      },
      {
        title: "Lost-Motion Cam (Lazy-Arm) & Deadbolt Deadlock",
        summary:
          "A thin wing that engages the plug's groove, actuates the bolt talons, holds the cylinder in place, and stops the plug at the key-removal positions.",
        technicalDetails:
          "Wing E is formed from thin steel with knob v engaging groove t. The source says the key-hole cylinder can turn nearly a whole revolution without moving the wing, while the wing moves less than a whole revolution and remains in contact with a bolt talon at both locked and unlocked positions. It does not state an angular value or a zero-torque condition.",
        archaicTerm: "wing or lazy-arm E",
        modernEquivalent: "Lost-Motion Drive Cam & Deadbolt Actuator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Shear-Line Boundary Kinematics & Geometric Tolerances",
        explanation:
          "The plug can turn only when the division between each pair of tumbler pieces is brought into the same line at the plug's periphery. The patent states the alignment condition but supplies no numerical machining tolerance.",
        formula: "y_{\\mathrm{division},i} = y_{\\mathrm{shear\\ line}}\\quad\\text{for every tumbler }i",
      },
      {
        principle: "Hooke's Law Spring Restoration & Shear Binding Torque",
        explanation:
          "The springs provide the restoring action that pushes the tumbler pieces toward their recesses. Their stiffness and travel are not specified in the patent, so the general spring relation is the most that can be stated quantitatively here.",
        formula: "F_i = k_i\\,\\Delta x_i",
      },
      {
        principle: "Lost-Motion Cam Kinematics & Mechanical Deadlocking",
        explanation:
          "The key-hole cylinder must reach a key-removal position, but Yale's lazy-arm is arranged to move through less than a whole revolution and remain against a bolt talon at both terminal positions. This is the claimed lost-motion relationship, not a quantified torque guarantee.",
        formula: "0 < \\theta_{\\mathrm{lazy\\mbox{-}arm}} < 2\\pi",
      },
    ],
    whyItMattersToday:
      "The patent is an early primary description of a pin-tumbler cylinder with a thin bitted key, threaded case mounting, bolt-retaining plate, and lost-motion lazy-arm. Later lockmaking may be compared with these mechanisms, but this record does not assign a percentage of modern locks or claim a particular industrial lineage without separate evidence.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualYaleClaimText(1),
      plainEnglish:
        "Claims the novel elastic spring-plate contrivance and clamping screw that holds the sliding deadbolt inside the mortise lock case, enabling the entire bolt assembly to be inserted or serviced directly through the front mortise faceplate after the lock case is mounted in the door.",
      keyInnovations: [
        "Front-insertable deadbolt mechanism",
        "Elastic spring retention plate",
        "Through-faceplate servicing and installation",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualYaleClaimText(2),
      plainEnglish:
        "Claims the combination of a mortise lock case and an interchangeable cylindrical tumbler housing, arranged so the cylinder can be mounted into either the right or left face of the case and adjusted to fit doors of any thickness.",
      keyInnovations: [
        "Reversible right/left hand lock orientation",
        "Modular cylinder-to-case mating architecture",
        "Universal door thickness adaptation",
      ],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualYaleClaimText(3),
      plainEnglish:
        "Claims an externally threaded tumbler cylinder screwed into a tapped nut in the lock case and clamped in place by an off-axis locking screw accessed through the front bolt opening.",
      keyInnovations: [
        "Threaded mortise cylinder housing",
        "Internal set-screw clamping through bolt hole",
        "Tamper-resistant hidden cylinder retention",
      ],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualYaleClaimText(4),
      plainEnglish:
        "Claims the combination of circumferentially notched (racked/serrated) pin tumblers and notched chamber cavities with a narrow keyway slit that is narrower than the pin diameter, ensuring wide pin bearing support against key thrust while defeating lockpicking tools.",
      keyInnovations: [
        "Serrated and spool anti-pick pin tumblers",
        "Narrow paracentric keyway slot narrower than pin diameter",
        "Wide circumferential pin chamber bearing support",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualYaleClaimText(5),
      plainEnglish:
        "Claims the lost-motion rotating wing or lazy-arm cam in combination with the cylinder, key-hole, and pin tumblers. The source says the key-hole cylinder can make nearly a whole revolution while the wing moves through less than a whole revolution and remains against the bolt talons at the terminal positions.",
      keyInnovations: [
        "Lost-motion lazy-arm drive cam",
        "Mechanical deadbolt deadlocking geometry",
        "Less-than-whole-revolution wing movement",
      ],
    },
  ],

  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Mortise Lock Case and Mounted Cylinder",
      caption:
        "Side elevation of the mortise lock case showing the circular threaded aperture and mounted cylinder.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "A",
          description: "Mortise lock case housing",
          x: 20,
          y: 30,
        },
        {
          id: "callout-2",
          figureRef: "Fig. 1",
          label: "C",
          element: "C",
          description: "Cylindrical tumbler-case / escutcheon",
          x: 50,
          y: 50,
        },
        {
          id: "callout-3",
          figureRef: "Fig. 1",
          label: "D",
          element: "D",
          description: "Eccentric revolving plug with keyhole",
          x: 60,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Lock Case Cross-Section and Bolt Engagement",
      caption:
        "Interior cross-section of lock case showing sliding bolt, talons, and cam lazy-arm engagement.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-4",
          figureRef: "Fig. 3",
          label: "B",
          element: "B",
          description: "Sliding deadbolt with talons",
          x: 30,
          y: 40,
        },
        {
          id: "callout-5",
          figureRef: "Fig. 3",
          label: "E'",
          element: "E'",
          description: "Lost-motion lazy-arm cam wing",
          x: 55,
          y: 45,
        },
        {
          id: "callout-6",
          figureRef: "Fig. 3",
          label: "G",
          element: "G",
          description: "Bolt-retaining clamp screw",
          x: 70,
          y: 60,
        },
        {
          id: "callout-7",
          figureRef: "Fig. 3",
          label: "H",
          element: "H",
          description: "Cylinder locking set-screw",
          x: 80,
          y: 65,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Cylinder Pin Tumblers and Revolving Plug",
      caption:
        "Horizontal section through door showing threaded cylinder, pin chambers, and revolving plug.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-8",
          figureRef: "Fig. 4",
          label: "C",
          element: "C",
          description: "Threaded outer tumbler-case",
          x: 25,
          y: 35,
        },
        {
          id: "callout-9",
          figureRef: "Fig. 4",
          label: "D",
          element: "D",
          description: "Revolving plug cylinder",
          x: 45,
          y: 45,
        },
        {
          id: "callout-10",
          figureRef: "Fig. 4",
          label: "I",
          element: "I",
          description: "Upper driver pin stack",
          x: 50,
          y: 30,
        },
        {
          id: "callout-11",
          figureRef: "Fig. 4",
          label: "J",
          element: "J",
          description: "Lower key pin stack",
          x: 50,
          y: 60,
        },
        {
          id: "callout-12",
          figureRef: "Fig. 4",
          label: "L",
          element: "L",
          description: "Helical pin compression springs",
          x: 50,
          y: 15,
        },
      ],
    },
    {
      figureNumber: "Fig. 6",
      title: "Plug Cross-Section and Keyway Slot",
      caption:
        "Transverse section through cylinder showing eccentric plug, pin chamber, and narrow keyway slot.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-13",
          figureRef: "Fig. 6",
          label: "C",
          element: "C",
          description: "Outer cylinder casing",
          x: 30,
          y: 30,
        },
        {
          id: "callout-14",
          figureRef: "Fig. 6",
          label: "D",
          element: "D",
          description: "Revolving plug",
          x: 50,
          y: 50,
        },
        {
          id: "callout-15",
          figureRef: "Fig. 6",
          label: "t",
          element: "t",
          description: "Narrow keyhole slit",
          x: 50,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Fig. 10",
      title: "Chamber Alignment and Lazy-Arm Slot",
      caption:
        "Longitudinal section of cylinder showing the pin tumbler chambers with compression springs.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-16",
          figureRef: "Fig. 10",
          label: "r'",
          element: "r'",
          description: "Upper pin chambers in casing",
          x: 40,
          y: 25,
        },
        {
          id: "callout-17",
          figureRef: "Fig. 10",
          label: "r",
          element: "r",
          description: "Lower pin chambers in revolving plug",
          x: 40,
          y: 65,
        },
        {
          id: "callout-18",
          figureRef: "Fig. 10",
          label: "W'",
          element: "W'",
          description: "Circumferential lazy-arm clearance slit",
          x: 80,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 17",
      title: "Flat Bitted Key Blade and Pin Shear Alignment",
      caption:
        "Serrated flat bitted key blade and matching pin tumbler stack showing shear line alignment.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-19",
          figureRef: "Fig. 17",
          label: "K",
          element: "K",
          description: "Flat bitted steel key",
          x: 30,
          y: 50,
        },
        {
          id: "callout-20",
          figureRef: "Fig. 17",
          label: "I, J",
          element: "I, J",
          description: "Split pins aligned flush at shear line",
          x: 60,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 19",
      title: "Two-Piece Pin Tumbler Assembly",
      caption:
        "Elevation of individual two-piece pin tumbler stack with upper spring, driver pin, and key pin.",
      svgType: "yale-lock",
      callouts: [
        {
          id: "callout-21",
          figureRef: "Fig. 19",
          label: "L",
          element: "L",
          description: "Helical compression spring",
          x: 50,
          y: 20,
        },
        {
          id: "callout-22",
          figureRef: "Fig. 19",
          label: "I",
          element: "I",
          description: "Upper driver pin with anti-pick serrations",
          x: 50,
          y: 45,
        },
        {
          id: "callout-23",
          figureRef: "Fig. 19",
          label: "J",
          element: "J",
          description: "Lower key pin with rounded key-contact tip",
          x: 50,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Front Elevation of the Lock",
      caption: "The patent's front elevation of the lock, identified in the figure list as Fig. 2.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 5",
      title: "Bolt and Bolt-Retaining Contrivance",
      caption: "The patent groups Fig. 5 with Figs. 7 and 8 as an elevation of the bolt and the contrivance for securing it.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 7",
      title: "Bolt Talon Range",
      caption: "The patent groups Fig. 7 with Figs. 5 and 8 in its description of the bolt and the contrivance for securing it.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 8",
      title: "Bolt-Retaining Plate in Its Raised Position",
      caption: "The patent refers to Fig. 8 when describing the elastic plate tending to spring upward.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 9",
      title: "Plan of the Elastic Bolt-Securer",
      caption: "The patent identifies Fig. 9 as a plan of the elastic bolt-securer.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 11",
      title: "Elevation of the Cylinder",
      caption: "The patent identifies Fig. 11 as an elevation of the cylinder.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 12",
      title: "Cylinder Section",
      caption: "The patent groups Fig. 12 with Figs. 13 and 14 as sections through the cylinder.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 13",
      title: "Cylinder Section at the Key-Hole",
      caption: "The patent groups Fig. 13 with Figs. 12 and 14 as sections through the cylinder and later calls it out when discussing the supported tumbler recess.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 14",
      title: "Cylinder Section at the Key-Hole",
      caption: "The patent groups Fig. 14 with Figs. 12 and 13 as sections through the cylinder and later calls it out when discussing the supported tumbler recess.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 15",
      title: "Cylinder and Lazy-Arm Section",
      caption: "The patent groups Fig. 15 with Fig. 16 as sections through the cylinder and lazy-arm.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 16",
      title: "Cylinder and Lazy-Arm Section",
      caption: "The patent groups Fig. 16 with Fig. 15 as sections through the cylinder and lazy-arm.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 18",
      title: "Elevation of the Tumblers and Key",
      caption: "The patent groups Fig. 18 with Fig. 17 as a plan and elevation of one section of the tumblers and the key.",
      svgType: "yale-lock",
      callouts: [],
    },
    {
      figureNumber: "Fig. 20",
      title: "Tumbler-Case and Lazy-Arm from Inside",
      caption: "The patent identifies Fig. 20 as a plan of the tumbler-case, lazy-arm, and related parts from inside the lock.",
      svgType: "yale-lock",
      callouts: [],
    },
  ],

  historicalContext: {
    problemStatement:
      "The specification addresses a mid-19th-century lockmaking problem: retain the bolt in a mortise case, adapt a cylinder to either hand of door and to different door thicknesses, and make a pin-lock less susceptible to picking.",
    priorArtLimitations: [
      "A bolt could need to be inserted through the lock's bolt-hole after the case was already fitted to the door.",
      "A cylinder fixed at one depth or on one side of a case would not adapt readily to different doors or handing.",
      "The specification identifies picking and unsupported tumbler ends as practical failure modes for the pin-lock arrangement it improves.",
    ],
    breakthroughInsight:
      "Linus Yale Jr. separated the key cylinder from the bolt throw mechanism, using spring-loaded two-piece tumblers aligned at the plug periphery by a small, thin bitted key.",
    patentWars: [],
    civilizationalImpact:
      "The document preserves a compact combination of pin alignment, threaded cylinder mounting, bolt retention, and lost-motion bolt control. Its later influence on lock hardware requires separate historical evidence and is not quantified here.",
  },

  tags: [
    "Lock",
    "Pin Tumbler",
    "Cylinder Lock",
    "Linus Yale",
    "Flat Key",
    "Shear Line",
    "Security",
    "Mechanical Engineering",
    "Mortise Lock",
    "Precision Mechanics",
  ],

  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
};
