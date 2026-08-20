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
    "Linus Yale Jr.'s 1865 master patent revolutionized physical security worldwide by miniaturizing the pin-tumbler cylinder lock and pairing it with a small, lightweight flat bitted key. By dividing each tumbler into an upper driver pin and lower key pin that align at a cylindrical shear line, introducing anti-pick circumferential serrations, and driving the bolt through a lost-motion lazy-arm cam, Yale rendered heavy Victorian warded keys obsolete and established the universal architecture of modern commercial and residential door locks.",
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
      "Before Linus Yale Jr.'s 1865 invention, doors and safes were secured by heavy iron warded locks or early lever tumbler locks that required massive, cumbersome keys weighing up to several pounds. Because the key had to reach entirely through the door thickness and physically throw the heavy iron bolt, larger and more secure locks required exponentially larger keys. Linus Yale Jr. broke this paradigm by separating the keyway cylinder from the bolt mechanism. By utilizing a compact cylindrical plug with five spring-loaded split pins elevated to a microscopic shear line by a featherweight flat steel key, Yale achieved unprecedented cryptographic permutation security in a lock that could be installed in doors of any thickness.",
    coreMechanism:
      "The lock operates through five distinct mechanical stages governed by precision geometric tolerances: (1) In the resting locked state, helical compression springs push five upper driver pins across the cylindrical shear boundary between the stationary outer housing and the revolving plug, mechanically pinning the plug in place. (2) When the authorized flat steel key is inserted into the narrow keyway slot, its serrated bottom bittings directly lift the five bottom key pins against spring resistance. (3) Because the key notches match the varied lengths of the lower pins, the division lines between every lower key pin and upper driver pin align exactly flush with the cylindrical plug circumference (shear error $\\Delta y_i < 0.09\\text{ mm}$). (4) With all pins clearing the shear line, turning torque applied to the key rotates the plug smoothly. (5) As the plug rotates, an axial knob drives a lost-motion lazy-arm cam through a smaller angle (approx. $90^\\circ$), throwing the heavy sliding deadbolt and deadlocking it against external forced retraction.",
    mechanicalBreakdown: [
      {
        title: "Revolving Plug & Eccentric Cylinder Housing",
        summary:
          "The inner cylindrical core that contains the keyway slot and lower pin chambers, mounted eccentrically inside an externally threaded brass housing.",
        technicalDetails:
          "The inner plug ($R_{\\text{plug}} = 6.35\\text{ mm}$) revolves within a precision-reamed bore in the outer cylindrical casing C. The outer casing features external machine threads that screw directly into tapped nuts in the mortise lock case, enabling continuous adjustment for doors from $1.25\\text{ in}$ to over $3.0\\text{ in}$ thickness while remaining flush with the door escutcheon.",
        archaicTerm: "cylinder D eccentric to the tumbler-case",
        modernEquivalent: "Revolving Lock Core / Plug Cylinder",
      },
      {
        title: "Two-Piece Split Pin Tumblers & Compression Springs",
        summary:
          "Five vertical pin chambers each containing an upper driver pin, lower key pin, and top helical compression spring.",
        technicalDetails:
          "Each chamber houses a flat-ended driver pin I ($L_d = 5.5\\text{ mm}$) and a variable-length key pin J ($L_k = 2.5\\text{ to }6.5\\text{ mm}$), loaded from above by a phosphor-bronze spring ($k_s \\approx 140\\text{ N/m}$). When the division line reaches the shear line $R_{\\text{plug}}$, the shear impedance drops from infinite normal interference to pure journal friction ($F_{\\text{shear}} \\to 0$).",
        archaicTerm: "tumblers or pins made in two pieces, I and J",
        modernEquivalent: "Driver Pins & Key Pins (Pin Stack)",
      },
      {
        title: "Flat Serrated Bitted Key Blade",
        summary:
          "A thin, lightweight blade stamped from sheet steel with serrated edge bittings that directly set pin heights.",
        technicalDetails:
          "By replacing heavy cast-iron round key shanks with a flat blade ($1.2\\text{ mm}$ thick) featuring rounded lateral corrugations and five precision-milled bitting depths, Yale reduced key weight by over $90\\%$ while providing $6^5 = 7,776$ unique theoretical key differs per keyway profile.",
        archaicTerm: "thin slip of steel properly shaped (key K)",
        modernEquivalent: "Flat Bitted Paracentric Key",
      },
      {
        title: "Anti-Pick Circumferential Serrations & Racked Chambers",
        summary:
          "Notched grooves cut into the circumference of the pins and chamber walls that bind against the shear line during picking attempts.",
        technicalDetails:
          "Yale tapped micro-grooves and notches into the pin perimeters and housing bore. When a lockpicker applies rotational tension while probing pins, the serration shelves catch in the housing notch, creating a false set with high frictional lockup ($F_{\\text{bind}} = \\mu_s \\tau / R_{\\text{plug}}$) that prevents feeling the true shear line.",
        archaicTerm: "racked pin-tumblers and notched containing-recesses",
        modernEquivalent: "Serrated Security Pins / Spool Pins",
      },
      {
        title: "Lost-Motion Cam (Lazy-Arm) & Deadbolt Deadlock",
        summary:
          "A rotating cam ring that turns through a smaller angle than the key plug, keeping the bolt permanently deadlocked.",
        technicalDetails:
          "The stamped steel lazy-arm E rotates through approximately $90^\\circ$ while the key plug rotates a full $360^\\circ$. In both the locked and unlocked terminal positions, the cam wing W rests in positive contact against the bolt talon at a $90^\\circ$ mechanical angle ($mathbf{r} \\times mathbf{F} = 0$), preventing burglars from jimming or forcing the deadbolt backward into the case.",
        archaicTerm: "wing or lazy-arm E",
        modernEquivalent: "Lost-Motion Drive Cam & Deadbolt Actuator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Shear-Line Boundary Kinematics & Geometric Tolerances",
        explanation:
          "Rotational freedom of the inner plug requires that all five pin division lines simultaneously satisfy the shear boundary condition within machining tolerance $\\delta_{\\text{shear}} \\le 0.09\\text{ mm}$. Any single misaligned pin creates solid brass mechanical interference that withstands hundreds of newtons of rotational torque.",
        formula:
          "\\Delta y_i = |y_{\\text{bitting},i} + L_{\\text{keypin},i} - R_{\\text{plug}}| \\le \\delta_{\\text{shear}}",
      },
      {
        principle: "Hooke's Law Spring Restoration & Shear Binding Torque",
        explanation:
          "Individual compression springs apply downward restoring force $F_i = k_s \\Delta x_i$. Under unauthorized turning torque $\\tau$, misaligned pins experience a normal clamping force against the housing wall, generating static friction that resists picking and locks the plug rigidly.",
        formula:
          "F_s = \\sum_{i=1}^5 k_s \\Delta x_i \\quad \\text{and} \\quad \\tau_{\\text{net}} = \\tau_{\\text{applied}} - \\sum_{i=1}^5 \\mu_s \\frac{\\tau_{\\text{applied}}}{R_{\\text{plug}}} [1 - \\Theta(\\delta_{\\text{tol}} - \\Delta y_i)]",
      },
      {
        principle: "Lost-Motion Cam Kinematics & Mechanical Deadlocking",
        explanation:
          "By decoupling the plug's full $360^\\circ$ key-withdrawal rotation from the cam's $90^\\circ$ bolt-throw arc, the lazy-arm abuts the deadbolt talon perpendicularly, ensuring external forces on the bolt head generate zero rotational torque on the cam.",
        formula:
          "\\tau_{\\text{external}} = \\mathbf{r} \\times \\mathbf{F}_{\\text{jimmy}} = r F_{\\text{jimmy}} \\sin(0^\\circ) = 0",
      },
    ],
    whyItMattersToday:
      "Linus Yale Jr.'s 1865 lock was the foundation of the modern security hardware industry. By creating a standardized, interchangeable cylinder that could be mass-produced, keyed in master-key hierarchies, and operated by small flat keys carried in pockets, Yale transformed physical security across the globe and led directly to the founding of the Yale & Towne Manufacturing Company in 1868.",
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
      legalSignificance:
        "Allowed locksmiths and carpenters to install and service lock internals without disassembling the mortise door pocket.",
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
      legalSignificance:
        "Established the universal concept of modular lock cylinders separate from the mortise chassis, slashing inventory costs for building hardware.",
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
      legalSignificance:
        'The direct legal ancestor of the standard 1-5/32" threaded mortise cylinder used throughout commercial architecture today.',
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
      legalSignificance:
        "The core security claim of the patent, introducing modern anti-pick serrated pins and narrow paracentric keyways that resisted picking manipulation.",
    },
    {
      number: 5,
      isIndependent: true,
      originalText: manualYaleClaimText(5),
      plainEnglish:
        "Claims the lost-motion rotating wing or lazy-arm cam in combination with the pin-tumbler cylinder and keyway, allowing full $360^\\circ$ key plug rotation for key withdrawal while driving the deadbolt through a smaller angle and deadlocking it against forced entry.",
      keyInnovations: [
        "Lost-motion lazy-arm drive cam",
        "Mechanical deadbolt deadlocking geometry",
        "360-degree plug rotation with 90-degree bolt throw",
      ],
      legalSignificance:
        "Solved the fundamental pin-tumbler constraint requiring full plug rotation to align pins for key extraction while maintaining positive deadbolt deadlocking.",
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
        "Horizontal section through door showing threaded cylinder, five pin chambers, and revolving plug.",
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
        "Longitudinal section of cylinder showing all five pin tumbler chambers with compression springs.",
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
  ],

  historicalContext: {
    problemStatement:
      "In the mid-19th century, locks were heavy iron warded mechanisms operated by giant keys that were difficult to carry, offered low key permutation security, and were readily bypassed by lockpicks.",
    priorArtLimitations: [
      "Heavy iron keys weighing up to several pounds needed to reach through door thickness",
      "Warded locks were vulnerable to skeleton keys and impressioning picks",
      "Bramah and Chubb lever locks were expensive, large, and delicate to install",
    ],
    breakthroughInsight:
      "Linus Yale Jr. separated the key cylinder from the bolt throw mechanism, using five miniature spring-loaded split pins aligned to a shear line by a small, lightweight flat bitted key.",
    patentWars: [
      {
        rivalName: "Hobbs, Hart & Co. and European Warded Lockmakers",
        rivalClaim: "Traditional Warded and Lever Lock Patents",
        conflictDetails:
          "Traditional lockmakers argued that Yale's tiny flat key could never generate enough torque to throw a heavy iron deadbolt, claiming the mechanism was too delicate for robust commercial use.",
        resolution:
          "Yale proved that separating the key cylinder from the bolt throw and driving the bolt via a lost-motion lazy-arm cam allowed a tiny key to throw bolts with zero mechanical strain.",
        legalOutcome:
          "Yale's cylinder lock quickly displaced Victorian warded locks across America and Britain, establishing the modern security lock industry.",
      },
    ],
    civilizationalImpact:
      "US Patent 48,475 is the direct ancestor of over 85% of all mechanical door locks in existence today. Yale's flat serrated key, cylinder housing, split pin tumblers, and interchangeable mortise format became the universal standard for commercial buildings, residential doors, padlocks, automotive ignitions, and cabinet security across the world.",
    funFact:
      "Linus Yale Jr. was originally trained as a portrait painter before joining his father's lockmaking business, bringing an artist's precision to geometric mechanical lock design.",
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
