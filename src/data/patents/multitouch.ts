import type { Patent } from "@/types/patent";
import {
  manualMultiTouchClaimText,
  multiTouchArchivalEdition,
} from "../editions/multiTouchEdition";

export const multiTouchPatent: Patent = {
  id: "us-7479949-multitouch",
  patentNumber: "US 7,479,949",
  title:
    "Touch Screen Device, Method, and Graphical User Interface for Determining Commands by Applying Heuristics",
  shortTitle: "Apple iPhone Multi-Touch Heuristics",
  subtitle: "Mutual Capacitance Matrix Shunts, Pinch-to-Zoom & Real-Time Affine Transformations",
  inventors: [
    "Steven P. Jobs",
    "Scott Forstall",
    "Greg Christie",
    "J. Stephen Lemay",
    "Scott Herz",
    "Marcel Van Os",
    "Bas Ording",
    "Imran Chaudhri",
  ],
  inventorLocation: "Cupertino, California",
  grantDate: "2009-01-20",
  filingDate: "2007-04-11",
  era: "Internet & Modern Computing (1990–Present)",
  category: "computing",
  categoryLabel: "Human-Computer Interaction & Touch Interfaces",
  summary:
    "The Touch Interface Revolution: Often referred to as Steve Jobs's 'Steve Jobs patent', US 7,479,949 defined the software heuristics that turned raw multi-point capacitive sensor scans into natural touch gestures. By computing the dynamic Euclidean distance between simultaneous contact points, the iPhone introduced the iconic pinch-to-zoom scaling transformation that defined modern smartphones and tablets.",
  heroQuote:
    "Detecting two simultaneous contact points and scaling a displayed object by a magnification factor derived from their changing separation distance.",
  originalPdfUrl: "/patents/pdfs/us-7479949-multitouch.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US7479949B2/en",
  usptoClassification: "G06F 3/0488 (Touch-screen gestures; Multi-touch heuristics)",
  archivalEdition: multiTouchArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-7479949-multitouch-reviewed.txt",
    pageCount: 364,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "9b29747e60aad27302671e1be32fda99680c474d4e3a5ce0ffc93201460bfe1c",
  },
  drawings: [
    {
      figureNumber: "Figure 1",
      title: "Block Diagram of Multi-Touch Device Architecture",
      caption: "FIG. 1: Block diagram of portable multi-touch device architecture",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-cpu",
          figureRef: "Fig. 1",
          label: "122",
          element: "Processing Unit (CPU)",
          description: "Application processor executing touch heuristics.",
          x: 50,
          y: 35,
        },
        {
          id: "mt-screen",
          figureRef: "Fig. 1",
          label: "112",
          element: "Touch Screen Display",
          description: "Capacitive multi-touch sensor and display panel.",
          x: 50,
          y: 70,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Portable Multifunction Device Application Grid",
      caption:
        "FIG. 2: Portable multifunction device with graphical user interface application grid",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-icons",
          figureRef: "Fig. 2",
          label: "200",
          element: "Application Icons",
          description: "Grid of touch-target application launch icons.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Figure 3",
      title: "Touch Gesture Recognition & Trajectory Angle Heuristics",
      caption: "FIG. 3: Touch gesture recognition and trajectory angle heuristics",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-angle",
          figureRef: "Fig. 3",
          label: "300",
          element: "Trajectory Angle θ",
          description: "Initial contact vector angle used for heuristic routing.",
          x: 50,
          y: 40,
        },
      ],
    },
  ],
  originalText: `United States Patent
Jobs et al.
Patent No.: US 7,479,949 B2
Date of Patent: *Jan. 20, 2009

TOUCH SCREEN DEVICE, METHOD, AND GRAPHICAL USER INTERFACE FOR DETERMINING COMMANDS BY APPLYING HEURISTICS
Assignee: Apple Inc., Cupertino, CA (US)
Appl. No.: 12/101,832
Filed: Apr. 11, 2008`,
  plainEnglishExplanation: {
    overview:
      "The iPhone multi-touch heuristics patent defined how multi-finger gestures like pinch-to-zoom, two-finger rotation, and inertia scrolling operate seamlessly in software.",
    coreMechanism:
      "Scans a grid of mutual capacitance sensors to locate concurrent contact centroids, computes the changing Euclidean vector between them, and maps it directly to a 2D affine scaling and rotation matrix.",
    mechanicalBreakdown: [
      {
        title: "Mutual Capacitance Matrix",
        summary: "Orthogonal drive and sense ITO electrodes scanned continuously.",
        technicalDetails:
          "Human fingers introduce stray capacitance to ground, reducing mutual capacitance by ~0.5 pF at row/column intersections without ghosting.",
      },
      {
        title: "Gesture Heuristic Engine",
        summary: "Determines whether finger movement represents scroll, zoom, or rotate.",
        technicalDetails:
          "Computes delta distance D(t)/D(0) for affine zoom and angular change theta(t) for rotation, applying velocity dampening.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Affine Scale Transformation & Capacitive Shunt",
        formula:
          "S(t) = \\frac{\\|\\mathbf{p}_2(t) - \\mathbf{p}_1(t)\\|}{\\|\\mathbf{p}_2(0) - \\mathbf{p}_1(0)\\|}, \\quad \\Delta C_m = -\\frac{\\varepsilon_0 \\varepsilon_r A_{finger}}{d}",
        explanation:
          "Dynamic finger separation distance scales graphical view matrices continuously in real time, eliminating discrete step zoom buttons.",
      },
    ],
    whyItMattersToday:
      "Pinch-to-zoom became the universal touch gesture across all smartphones, tablets, trackpads, and interactive displays worldwide.",
  },
  historicalContext: {
    problemStatement:
      "Pre-2007 smartphones relied on physical styluses, tiny plastic trackballs, or mechanical zoom buttons that were clumsy and unintuitive.",
    priorArtLimitations: [
      "Resistive single-touch screens could only register one point",
      "Stylus required two hands",
      "Zooming web pages required tapping separate +/- magnifying glass icons",
    ],
    breakthroughInsight:
      "Direct finger manipulation: if you spread two fingers apart on a photograph, the photograph should expand under your fingers like real physical elastic paper.",
    patentWars: [
      {
        rivalName: "Samsung Electronics",
        rivalClaim:
          "Smartphone touchscreen user interfaces (*Apple Inc. v. Samsung Electronics Co.*)",
        conflictDetails:
          "Apple asserted the '949 patent against Samsung's Galaxy smartphone lineup in 2011 federal court in San Jose, California.",
        resolution:
          "The federal jury found Samsung willfully infringed Claim 19 of the '949 patent, awarding Apple over $1 billion in damages in 2012.",
        legalOutcome:
          "Established the '949 patent as one of the most powerful and valuable software patents in corporate history.",
      },
    ],
    civilizationalImpact:
      "Defined the modern mobile computing paradigm, transforming smartphones into direct-manipulation glass windows for humanity.",
  },
  tags: ["apple", "iphone", "touch", "hci", "steve jobs", "mobile"],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualMultiTouchClaimText(1),
      plainEnglish:
        "A computing device with a touch screen display applying vertical scrolling, 2D translation, and next-item heuristics based on initial finger gesture angles.",
      keyInnovations: [
        "Multi-touch computing device",
        "Initial contact angle heuristics",
        "Vertical scrolling vs 2D translation",
        "Next item navigation",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(2),
      plainEnglish:
        "The computing device heuristic for transitioning to a previous item in a set of items.",
      keyInnovations: ["Previous item heuristic", "Photo transition gesture"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(3),
      plainEnglish:
        "The horizontal screen scrolling heuristic based on initial finger contact angle.",
      keyInnovations: ["1D horizontal screen scrolling", "Angle disambiguation"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(4),
      plainEnglish:
        "A finger swipe gesture moving within a predetermined angle of vertical issuing vertical scrolling.",
      keyInnovations: ["Vertical swipe gesture", "Threshold angle locking"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(5),
      plainEnglish:
        "A moving finger gesture within a predefined range of angles issuing 2D screen translation.",
      keyInnovations: ["2D translation panning", "Free-angle gesture"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(6),
      plainEnglish:
        "A finger swipe gesture within a predetermined angle of horizontal issuing horizontal scrolling.",
      keyInnovations: ["Horizontal swipe gesture", "Threshold angle locking"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(7),
      plainEnglish: "A finger tap gesture selecting a user interface object at the tap location.",
      keyInnovations: ["Finger tap gesture", "Object selection"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(8),
      plainEnglish: "A two-finger pinch gesture scaling/zooming a displayed image or document.",
      keyInnovations: ["Two-finger pinch gesture", "Pinch-to-zoom scaling"],
    },
    {
      number: 9,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(9),
      plainEnglish:
        "Contextual heuristics switching between vertical/2D translation in browser and next/previous in photo album.",
      keyInnovations: [
        "Context-aware application heuristics",
        "Web browser vs photo album interaction",
      ],
    },
    {
      number: 10,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(10),
      plainEnglish: "Horizontal scrolling heuristic in browser based on initial touch angle.",
      keyInnovations: ["Browser horizontal scrolling", "Angle threshold"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText: manualMultiTouchClaimText(11),
      plainEnglish:
        "A computer-implemented method detecting contacts and applying vertical, 2D translation, and next item heuristics.",
      keyInnovations: [
        "Touch gesture method",
        "Contextual heuristic pipeline",
        "Direct screen manipulation",
      ],
    },
    {
      number: 12,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(12),
      plainEnglish:
        "The method applying application-specific heuristic sets in browser and photo album.",
      keyInnovations: ["Multi-application heuristic method", "Application state switching"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(13),
      plainEnglish:
        "The method applying horizontal scrolling heuristic based on initial touch angle.",
      keyInnovations: ["Horizontal scrolling method", "Angle discrimination"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(14),
      plainEnglish:
        "The method recognizing vertical swipe gesture within predetermined angle of vertical.",
      keyInnovations: ["Vertical swipe method"],
    },
    {
      number: 15,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(15),
      plainEnglish:
        "The method recognizing 2D translation gesture within predefined range of angles.",
      keyInnovations: ["2D panning method"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(16),
      plainEnglish:
        "The method recognizing horizontal swipe gesture within predetermined angle of horizontal.",
      keyInnovations: ["Horizontal swipe method"],
    },
    {
      number: 17,
      isIndependent: true,
      originalText: manualMultiTouchClaimText(17),
      plainEnglish:
        "A computer-readable storage medium storing instructions for applying vertical, 2D translation, and next item heuristics.",
      keyInnovations: ["Computer-readable medium", "Heuristic execution software"],
    },
    {
      number: 18,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(18),
      plainEnglish:
        "The storage medium instructions switching heuristic sets between web browser and photo album.",
      keyInnovations: ["Application-specific heuristic software"],
    },
    {
      number: 19,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(19),
      plainEnglish:
        "The storage medium instructions recognizing vertical swipe within predetermined angle.",
      keyInnovations: ["Vertical swipe software"],
    },
    {
      number: 20,
      isIndependent: false,
      originalText: manualMultiTouchClaimText(20),
      plainEnglish:
        "The storage medium instructions recognizing 2D translation gesture within predefined range of angles.",
      keyInnovations: ["2D translation software"],
    },
  ],
  stats: {
    totalClaims: 20,
    independentClaims: 3,
  },
};
