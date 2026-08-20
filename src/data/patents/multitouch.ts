import type { Patent } from "@/types/patent";
import { multiTouchArchivalEdition } from "../editions/multiTouchEdition";

export const multiTouchPatent: Patent = {
  id: "us-7479949-multitouch",
  archivalEdition: multiTouchArchivalEdition,
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
  originalText: `UNITED STATES PATENT
Jobs et al.
Patent No.: US 7,479,949 B2
Date of Patent: Jan. 20, 2009

TOUCH SCREEN DEVICE, METHOD, AND GRAPHICAL USER INTERFACE FOR DETERMINING COMMANDS BY APPLYING HEURISTICS
Inventors: Steven P. Jobs, Scott Forstall, Greg Christie, J. Stephen Lemay, Scott Herz, Marcel Van Os, Bas Ording, Imran Chaudhri
Assignee: Apple Inc., Cupertino, CA

ABSTRACT
A computer-implemented method for use in conjunction with a portable multifunction device with a touch screen display includes detecting one or more finger contacts with the touch screen display, applying one or more heuristics to determine commands, and adjusting display views such as scaling an object via a multi-finger pinch gesture.

BACKGROUND OF THE INVENTION
As portable electronic devices become more compact and capable, user interfaces become increasingly constrained. Traditional physical buttons and single-touch resistive screens are rigid and lack intuitive manipulation for multi-dimensional content such as web pages, photos, and digital maps.

SUMMARY OF THE INVENTION
The present invention provides intuitive multi-touch gesture interaction. A mutual capacitive touch sensor matrix detects multiple concurrent touch contact points. A gesture heuristic engine evaluates touch vectors and executes affine transformations, allowing users to pinch fingers together to zoom out, spread fingers apart to zoom in, and rotate multiple contact points to reorient digital documents.

CLAIMS
1. A computer-implemented method for controlling a touch screen display, comprising: displaying a computer-generated graphical object; detecting two or more concurrent physical contact points on the touch screen display; determining a first distance between the concurrent contact points at a first point in time; determining a second distance between the contact points at a subsequent point in time; and scaling the displayed graphical object by a magnification factor derived from a ratio of the second distance to the first distance.`,
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
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A computer-implemented method for controlling a touch screen display, comprising: displaying a computer-generated graphical object; detecting two or more concurrent physical contact points on the touch screen display; determining a first distance between the concurrent contact points at a first point in time; determining a second distance between the contact points at a subsequent point in time; and scaling the displayed graphical object by a magnification factor derived from a ratio of the second distance to the first distance.",
      plainEnglish:
        "A method that measures how far apart two fingers move on a screen to smoothly zoom in or out of photos and web pages in real time.",
      keyInnovations: [
        "Mutual capacitance matrix multi-point contact tracking",
        "Pinch-to-zoom continuous Euclidean distance affine scaling",
        "Multi-finger gesture heuristic state machine",
      ],
    },
  ],
  drawings: [],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
  tags: ["apple", "iphone", "touch", "hci", "steve jobs", "mobile"],
};
