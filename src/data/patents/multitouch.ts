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
  shortTitle: "Touch-gesture command heuristics",
  subtitle:
    "Initial-motion direction distinguishes vertical scrolling, two-dimensional translation, and item navigation",
  inventors: [
    "Steven P. Jobs",
    "Scott Forstall",
    "Greg Christie",
    "Stephen O. Lemay",
    "Scott Herz",
    "Marcel van Os",
    "Bas Ording",
    "Gregory Novick",
    "Wayne C. Westerman",
    "Imran Chaudhri",
    "Patrick Lee Coffman",
    "Kenneth Kocienda",
    "Nitin K. Ganatra",
    "Freddy Allen Anzures",
    "Jeremy A. Wyld",
    "Jeffrey Bush",
    "Michael Matas",
    "Paul D. Marcos",
    "Charles J. Pisula",
    "Virgil Scott King",
    "Chris Blumenberg",
    "Francisco Ryan Tolmasky",
    "Richard Williamson",
    "Andre M. J. Boule",
    "Henri C. Lamiraux",
  ],
  inventorLocation:
    "Various California cities, United States (printed individually on the facsimile)",
  grantDate: "2009-01-20",
  filingDate: "2008-04-11",
  era: "Internet & Modern Computing (1990–Present)",
  category: "computing",
  categoryLabel: "Human-Computer Interaction & Touch Interfaces",
  summary:
    "US 7,479,949 claims a touch-screen computing device, method, and storage medium that apply heuristics to one or more finger contacts. Its independent claims distinguish one-dimensional vertical scrolling, two-dimensional translation, and next-item navigation; dependent Claim 8 additionally covers a two-finger pinch gesture for zooming a displayed image or document.",
  heroQuote:
    "A computer-implemented method for use in conjunction with a computing device with a touch screen display comprises: detecting one or more finger contacts with the touch screen display, applying one or more heuristics to the one or more finger contacts to determine a command for the device, and processing the command.",
  originalPdfUrl: "/patents/pdfs/us-7479949-multitouch.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US7479949B2/en",
  usptoClassification: "G09G 5/00; G06F 3/048 (as printed on the issued front page)",
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
      figureNumber: "Figure 2",
      title: "Portable multifunction device with touch-screen contact",
      caption:
        "FIG. 2: Portable multifunction device 100 shown with a finger contact at its touch screen.",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-device",
          figureRef: "Fig. 2",
          label: "100",
          element: "Portable multifunction device",
          description: "The device identified by reference numeral 100 in the drawing.",
          x: 50,
          y: 16,
        },
        {
          id: "mt-screen",
          figureRef: "Fig. 2",
          label: "112",
          element: "Touch Screen Display",
          description:
            "The touch-screen display identified in the drawing; the claim does not specify its sensing-stack construction.",
          x: 50,
          y: 72,
        },
      ],
    },
    {
      figureNumber: "Figure 3A",
      title: "Exemplary unlocking interface",
      caption: "FIG. 3A: Exemplary user interface 300A for unlocking a portable electronic device.",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-unlocking-interface",
          figureRef: "Fig. 3A",
          label: "300A",
          element: "Unlocking interface",
          description:
            "The exemplary unlocking user interface identified by reference numeral 300A.",
          x: 50,
          y: 17,
        },
        {
          id: "mt-slide-control",
          figureRef: "Fig. 3A",
          label: "302",
          element: "Slide-to-unlock control",
          description: "The illustrated slide-to-unlock control in the exemplary interface.",
          x: 38,
          y: 63,
        },
      ],
    },
    {
      figureNumber: "Figure 3B",
      title: "Exemplary unlocking interface with device features shown",
      caption:
        "FIG. 3B: A second exemplary unlocking interface 300B for a portable electronic device.",
      svgType: "multitouch",
      callouts: [
        {
          id: "mt-unlocking-interface-rear",
          figureRef: "Fig. 3B",
          label: "300B",
          element: "Unlocking interface",
          description:
            "The exemplary unlocking user interface identified by reference numeral 300B.",
          x: 50,
          y: 17,
        },
        {
          id: "mt-slide-control-rear",
          figureRef: "Fig. 3B",
          label: "302",
          element: "Slide-to-unlock control",
          description: "The illustrated slide-to-unlock control in the second exemplary interface.",
          x: 38,
          y: 68,
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
      "This grant is principally about a software decision: given one or more detected finger contacts, which command should the device process? Claim 1 separates an initially vertical gesture from two-dimensional translation and next-item navigation. It does not claim a particular capacitive sensor stack, rotation gesture, or inertial-scrolling law.",
    coreMechanism:
      "A touch-screen device receives contact motion, measures its initial direction with respect to the screen, and applies a predetermined heuristic to classify the command. A small initial horizontal displacement relative to a vertical displacement can be treated as vertical scrolling; a different direction can be treated as two-dimensional translation. Claim 8 separately adds a two-finger pinch-to-zoom command.",
    mechanicalBreakdown: [
      {
        title: "Touch-screen command boundary",
        summary:
          "The claim starts with detected finger contacts on a touch-screen display, without prescribing the display's sensing technology.",
        technicalDetails:
          "The relevant claim boundary is logical rather than electromechanical: the system detects one or more contacts, applies a heuristic, and processes a resulting command. The grant's claim text does not set an electrode material, mutual-capacitance value, scan rate, or contact pressure.",
      },
      {
        title: "Initial-motion direction heuristic",
        summary:
          "Claim 1 uses the initial angle of a finger contact's movement to distinguish vertical scrolling from two-dimensional translation.",
        technicalDetails:
          "A screen-coordinate implementation can compute an initial displacement vector $\\Delta\\mathbf{p}=(\\Delta x,\\Delta y)$ and compare its direction with a chosen angular boundary. The patent requires a predetermined angle but does not print a numerical threshold, so a simulator must label any chosen cutoff as illustrative.",
      },
      {
        title: "Application-specific command sets",
        summary:
          "Claims 9 and 12 apply different heuristic sets while a web browser and photo album are displayed.",
        technicalDetails:
          "The browser set includes vertical and two-dimensional translation heuristics. The photo-album set includes next- and previous-image navigation. The legal idea is context-sensitive command classification, not an assertion that the same movement must always mean the same thing in every application.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Initial-motion angle classification",
        formula: "\\theta = \\operatorname{atan2}(|\\Delta x|, |\\Delta y|)",
        explanation:
          "This is a transparent modern expression for an angle from the screen's vertical direction: $\\theta=0$ for a purely vertical initial displacement. Claim 1 uses a predetermined angle to route vertical scrolling versus two-dimensional translation, but the patent does not specify the threshold value.",
      },
      {
        principle: "Two-finger pinch scale (Claim 8)",
        formula:
          "S = \\frac{\\|\\mathbf{p}_2(t)-\\mathbf{p}_1(t)\\|}{\\|\\mathbf{p}_2(0)-\\mathbf{p}_1(0)\\|}",
        explanation:
          "The ratio is a modern, explicit way to render the zoom-in or zoom-out effect described by dependent Claim 8. It is not quoted as a formula from the grant and says nothing about how the contacts are electrically sensed.",
      },
    ],
    whyItMattersToday:
      "The record makes a useful distinction still relevant to interface engineering: raw contact locations are not commands. A system needs a context and a decision rule to turn a trajectory into scrolling, panning, navigation, or zooming without making unsupported claims about the sensor beneath the glass.",
  },
  historicalContext: {
    problemStatement:
      "The specification identifies the difficulty of presenting many functions on compact portable devices without forcing users through complex button arrays, menu sequences, and hierarchies.",
    priorArtLimitations: [
      "Complex pushbutton and menu systems can impose memorized sequences and hierarchies",
      "Imprecise user gestures can be difficult to translate into intended commands",
      "A contact gesture may only roughly correspond to a desired command without a classification rule",
    ],
    breakthroughInsight:
      "Treat the initial direction and application context of a finger movement as evidence for a command, rather than treating every movement as the same generic gesture.",
    patentWars: [],
    civilizationalImpact:
      "The grant records an iPhone-era attempt to specify touch-interface command disambiguation as a legal and engineering problem, with vertical scrolling, translation, and item navigation expressed as separate outcomes.",
  },
  tags: ["apple", "touch-screen", "gesture recognition", "hci", "mobile computing"],
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
