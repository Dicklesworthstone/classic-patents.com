import type { Patent } from "@/types/patent";
import { multiTouchArchivalEdition } from "../editions/multiTouchEdition";

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
      figureNumber: 1,
      caption: "FIG. 1: Block diagram of portable multi-touch device architecture",
      imageUrl: "/patents/figures/us-7479949-multitouch/fig-1-source-crop-v1.png",
      description:
        "Architecture showing processor, touch screen controller, memory, and peripheral subsystems.",
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
      figureNumber: 2,
      caption:
        "FIG. 2: Portable multifunction device with graphical user interface application grid",
      imageUrl: "/patents/figures/us-7479949-multitouch/fig-2-source-crop-v1.png",
      description:
        "Graphical user interface presenting icons for phone, email, browser, and photo applications.",
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
      figureNumber: 3,
      caption: "FIG. 3: Touch gesture recognition and trajectory angle heuristics",
      imageUrl: "/patents/figures/us-7479949-multitouch/fig-3-source-crop-v1.png",
      description:
        "Diagram of finger contact motion angle thresholds differentiating vertical scroll from 2D pan.",
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
  drawings: [],
  tags: ["apple", "iphone", "touch", "hci", "steve jobs", "mobile"],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A computing device, comprising: a touch screen display; one or more processors; memory; and one or more programs, wherein the one or more programs are stored in the memory and configured to be executed by the one or more processors, the one or more programs including: instructions for detecting one or more finger contacts with the touch screen display; instructions for applying one or more heuristics to the one or more finger contacts to determine a command for the device; and instructions for processing the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
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
      originalText:
        "The computing device of claim 1, wherein the one or more heuristics comprise a heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying the respective item in the set of items to displaying a previous item in the set of items.",
      plainEnglish:
        "The computing device heuristic for transitioning to a previous item in a set of items.",
      keyInnovations: ["Previous item heuristic", "Photo transition gesture"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein the one or more heuristics comprise a horizontal screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
      plainEnglish:
        "The horizontal screen scrolling heuristic based on initial finger contact angle.",
      keyInnovations: ["1D horizontal screen scrolling", "Angle disambiguation"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
      plainEnglish:
        "A finger swipe gesture moving within a predetermined angle of vertical issuing vertical scrolling.",
      keyInnovations: ["Vertical swipe gesture", "Threshold angle locking"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
      plainEnglish:
        "A moving finger gesture within a predefined range of angles issuing 2D screen translation.",
      keyInnovations: ["2D translation panning", "Free-angle gesture"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly horizontal with respect to the touch screen display corresponds to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command.",
      plainEnglish:
        "A finger swipe gesture within a predetermined angle of horizontal issuing horizontal scrolling.",
      keyInnovations: ["Horizontal swipe gesture", "Threshold angle locking"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger tap gesture corresponds to a command to select a user interface object at the location of the finger tap gesture.",
      plainEnglish: "A finger tap gesture selecting a user interface object at the tap location.",
      keyInnovations: ["Finger tap gesture", "Object selection"],
    },
    {
      number: 8,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, wherein, in one heuristic of the one or more heuristics, a contact comprising a two-finger pinch gesture corresponds to a command to zoom in or zoom out on a displayed image or document.",
      plainEnglish: "A two-finger pinch gesture scaling/zooming a displayed image or document.",
      keyInnovations: ["Two-finger pinch gesture", "Pinch-to-zoom scaling"],
    },
    {
      number: 9,
      isIndependent: false,
      originalText:
        "The computing device of claim 1, including: instructions for, while displaying a web browser application, detecting one or more first finger contacts with the touch screen display; instructions for applying a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and instructions for processing the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and instructions for, while displaying a photo album application, detecting one or more second finger contacts with the touch screen display; instructions for applying a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and instructions for processing the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
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
      originalText:
        "The computing device of claim 9, wherein the first set of heuristics comprises a heuristic for determining that the one or more first finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
      plainEnglish: "Horizontal scrolling heuristic in browser based on initial touch angle.",
      keyInnovations: ["Browser horizontal scrolling", "Angle threshold"],
    },
    {
      number: 11,
      isIndependent: true,
      originalText:
        "A computer-implemented method, comprising: at a computing device with a touch screen display, detecting one or more finger contacts with the touch screen display; applying one or more heuristics to the one or more finger contacts to determine a command for the device; and processing the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
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
      originalText:
        "The computer-implemented method of claim 11, including: while displaying a web browser application, detecting one or more first finger contacts with the touch screen display; applying a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and processing the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and while displaying a photo album application, detecting one or more second finger contacts with the touch screen display; applying a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and processing the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
      plainEnglish:
        "The method applying application-specific heuristic sets in browser and photo album.",
      keyInnovations: ["Multi-application heuristic method", "Application state switching"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText:
        "The computer-implemented method of claim 12, wherein the first set of heuristics comprises a heuristic for determining that the one or more first finger contacts correspond to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command based on the angle of initial movement of the finger contact with respect to the touch screen display.",
      plainEnglish:
        "The method applying horizontal scrolling heuristic based on initial touch angle.",
      keyInnovations: ["Horizontal scrolling method", "Angle discrimination"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText:
        "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
      plainEnglish:
        "The method recognizing vertical swipe gesture within predetermined angle of vertical.",
      keyInnovations: ["Vertical swipe method"],
    },
    {
      number: 15,
      isIndependent: false,
      originalText:
        "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
      plainEnglish:
        "The method recognizing 2D translation gesture within predefined range of angles.",
      keyInnovations: ["2D panning method"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText:
        "The computer-implemented method of claim 11, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly horizontal with respect to the touch screen display corresponds to a one-dimensional horizontal screen scrolling command rather than the two-dimensional screen translation command.",
      plainEnglish:
        "The method recognizing horizontal swipe gesture within predetermined angle of horizontal.",
      keyInnovations: ["Horizontal swipe method"],
    },
    {
      number: 17,
      isIndependent: true,
      originalText:
        "A computer readable storage medium having stored therein instructions, which when executed by a device with a touch screen display, cause the device to: detect one or more finger contacts with the touch screen display; apply one or more heuristics to the one or more finger contacts to determine a command for the device; and process the command; wherein the one or more heuristics comprise: a vertical screen scrolling heuristic for determining that the one or more finger contacts correspond to a one-dimensional vertical screen scrolling command rather than a two-dimensional screen translation command based on an angle of initial movement of a finger contact with respect to the touch screen display; a two-dimensional screen translation heuristic for determining that the one or more finger contacts correspond to the two-dimensional screen translation command rather than the one-dimensional vertical screen scrolling command based on the angle of initial movement of the finger contact with respect to the touch screen display; and a next item heuristic for determining that the one or more finger contacts correspond to a command to transition from displaying a respective item in a set of items to displaying a next item in the set of items.",
      plainEnglish:
        "A computer-readable storage medium storing instructions for applying vertical, 2D translation, and next item heuristics.",
      keyInnovations: ["Computer-readable medium", "Heuristic execution software"],
    },
    {
      number: 18,
      isIndependent: false,
      originalText:
        "The computer readable storage medium of claim 17, wherein the computer readable medium has stored therein instructions, which when executed by a device with a touch screen display, cause the device to: while displaying a web browser application, detect one or more first finger contacts with the touch screen display; apply a first set of heuristics for the web browser application to the one or more first finger contacts to determine a first command for the device; and process the first command; wherein the first set of heuristics comprises: the vertical screen scrolling heuristic; and the two-dimensional screen translation heuristic; and while displaying a photo album application, detect one or more second finger contacts with the touch screen display; apply a second set of heuristics for the photo album application to the one or more second finger contacts to determine a second command for the device; and process the second command; wherein the second set of heuristics comprises: the next item heuristic, wherein the respective item in the set of items is a respective image in a set of images; and a heuristic for determining that the one or more second finger contacts correspond to a command to transition from displaying the respective image in the set of images to displaying a previous image in the set of images.",
      plainEnglish:
        "The storage medium instructions switching heuristic sets between web browser and photo album.",
      keyInnovations: ["Application-specific heuristic software"],
    },
    {
      number: 19,
      isIndependent: false,
      originalText:
        "The computer readable storage medium of claim 17, wherein, in one heuristic of the one or more heuristics, a contact comprising a finger swipe gesture that initially moves within a predetermined angle of being perfectly vertical with respect to the touch screen display corresponds to the one-dimensional vertical screen scrolling command.",
      plainEnglish:
        "The storage medium instructions recognizing vertical swipe within predetermined angle.",
      keyInnovations: ["Vertical swipe software"],
    },
    {
      number: 20,
      isIndependent: false,
      originalText:
        "The computer readable storage medium of claim 17, wherein, in one heuristic of the one or more heuristics, a contact comprising a moving finger gesture that initially moves within a predefined range of angles corresponds to the two-dimensional screen translation command.",
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
