import {
  lemelsonMachineVisionArchivalEdition,
  lemelsonMachineVisionClaimText,
} from "@/data/editions/lemelsonMachineVisionEdition";
import type { Patent } from "@/types/patent";

export const lemelsonMachineVisionPatent: Patent = {
  id: "us-3081379-lemelson-machine-vision",
  patentNumber: "US 3,081,379",
  title: "Automatic Measurement Apparatus",
  shortTitle: "Lemelson Machine Vision & Automated Video Inspection",
  subtitle: "Electron-Beam Scanning, Synchronized Video Gating, and Signal Analysis",
  inventors: ["Jerome H. Lemelson"],
  inventorLocation: "Metuchen, New Jersey",
  grantDate: "1963-03-12",
  filingDate: "1956-12-04",
  era: "Information & Digital Age (1950–Present)",
  category: "computing",
  categoryLabel: "Machine Vision & Industrial Automation",
  summary:
    "US 3,081,379 claims an automatic scanning and control apparatus: an electron beam scans a predetermined path in an image field, synchronized programming operates a gate, and an analyzing circuit receives only the selected portion of the resulting picture signal. The reviewed source supports that signal-path architecture, but does not provide a calibration packet for beam speed, pickup responsivity, signal amplitude, or an actuator's force and response.",
  heroQuote:
    "An automatic scanning and control apparatus comprising in combination with an electron beam scanning apparatus including means for causing an electron beam to scan an area of an image field in a single frame sweep... an analyzing means for inspecting a predetermined area of said image field by the analysis of that portion of the picture signal generated during scanning.",
  originalPdfUrl: "/patents/pdfs/us-3081379-lemelson-machine-vision.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3081379A/en",
  usptoClassification: "178/6.8",

  originalTextAsset: {
    url: "/patents/transcripts/us-3081379-lemelson-machine-vision-reviewed.txt",
    pageCount: 35,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (Gemini 3.7 Flash)",
    reviewedAt: "2026-09-01",
    sourcePdfSha256: "2550a9d494a822f3f639c985899452b39432d53928db419633458d020c554b44",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "10 Sheets—Sheet 1",
        sourceRelationship: "drawing sheet 1 of 10",
      },
      {
        page: 2,
        exactSourceText: "10 Sheets—Sheet 2",
        sourceRelationship: "drawing sheet 2 of 10",
      },
      {
        page: 3,
        exactSourceText: "10 Sheets—Sheet 3",
        sourceRelationship: "drawing sheet 3 of 10",
      },
      {
        page: 4,
        exactSourceText: "10 Sheets—Sheet 4",
        sourceRelationship: "drawing sheet 4 of 10",
      },
      {
        page: 5,
        exactSourceText: "10 Sheets—Sheet 5",
        sourceRelationship: "drawing sheet 5 of 10",
      },
      {
        page: 6,
        exactSourceText: "10 Sheets—Sheet 6",
        sourceRelationship: "drawing sheet 6 of 10",
      },
      {
        page: 7,
        exactSourceText: "10 Sheets—Sheet 7",
        sourceRelationship: "drawing sheet 7 of 10",
      },
      {
        page: 8,
        exactSourceText: "10 Sheets—Sheet 8",
        sourceRelationship: "drawing sheet 8 of 10",
      },
      {
        page: 9,
        exactSourceText: "10 Sheets—Sheet 9",
        sourceRelationship: "drawing sheet 9 of 10",
      },
      {
        page: 10,
        exactSourceText: "10 Sheets—Sheet 10",
        sourceRelationship: "drawing sheet 10 of 10",
      },
      {
        page: 11,
        exactSourceText: "United States Patent Office  3,081,379",
        sourceRelationship: "specification column 1 masthead and preamble",
      },
      {
        page: 12,
        exactSourceText: "Column 3",
        sourceRelationship: "specification columns 3-4",
      },
      {
        page: 13,
        exactSourceText: "Column 5",
        sourceRelationship: "specification columns 5-6",
      },
      {
        page: 14,
        exactSourceText: "Column 7",
        sourceRelationship: "specification columns 7-8",
      },
      {
        page: 15,
        exactSourceText: "Column 9",
        sourceRelationship: "specification columns 9-10",
      },
      {
        page: 16,
        exactSourceText: "Column 11",
        sourceRelationship: "specification columns 11-12",
      },
      {
        page: 17,
        exactSourceText: "Column 13",
        sourceRelationship: "specification columns 13-14",
      },
      {
        page: 18,
        exactSourceText: "Column 15",
        sourceRelationship: "specification columns 15-16",
      },
      {
        page: 19,
        exactSourceText: "Column 17",
        sourceRelationship: "specification columns 17-18",
      },
      {
        page: 20,
        exactSourceText: "Column 19",
        sourceRelationship: "specification columns 19-20",
      },
      {
        page: 21,
        exactSourceText: "Column 21",
        sourceRelationship: "specification columns 21-22",
      },
      {
        page: 22,
        exactSourceText: "Column 23",
        sourceRelationship: "specification columns 23-24",
      },
      {
        page: 23,
        exactSourceText: "Column 25",
        sourceRelationship: "specification columns 25-26",
      },
      {
        page: 24,
        exactSourceText: "Column 27",
        sourceRelationship: "specification columns 27-28",
      },
      {
        page: 25,
        exactSourceText: "Column 29",
        sourceRelationship: "specification columns 29-30",
      },
      {
        page: 26,
        exactSourceText: "Column 31",
        sourceRelationship: "specification columns 31-32",
      },
      {
        page: 27,
        exactSourceText: "Column 33",
        sourceRelationship: "specification columns 33-34",
      },
      {
        page: 28,
        exactSourceText: "Column 35",
        sourceRelationship: "specification columns 35-36",
      },
      {
        page: 29,
        exactSourceText: "Column 37",
        sourceRelationship: "specification columns 37-38",
      },
      {
        page: 30,
        exactSourceText: "Column 39",
        sourceRelationship: "specification columns 39-40",
      },
      {
        page: 31,
        exactSourceText: "Column 41",
        sourceRelationship: "specification columns 41-42",
      },
      {
        page: 32,
        exactSourceText: "Column 43",
        sourceRelationship: "specification columns 43-44",
      },
      {
        page: 33,
        exactSourceText: "Column 45",
        sourceRelationship: "specification columns 45-46",
      },
      {
        page: 34,
        exactSourceText: "Column 47",
        sourceRelationship: "specification columns 47-48 claim opening",
      },
      {
        page: 35,
        exactSourceText: "Column 49",
        sourceRelationship: "specification columns 49-50 claim conclusion and references cited",
      },
    ],
  },

  archivalEdition: lemelsonMachineVisionArchivalEdition,

  originalText:
    "The present invention relates to magnetic recording and particularly to arrangements whereby video picture signals may be used for effecting a multiple of computing, operative, measurement and control functions. It is known in the art to record a series of picture signals on a moving magnetic tape and for reproducing said signals at essentially the time rate of recording to create a motion picture on a video or television screen for visual observation. My copending application Serial No. 477,467, filed December 24, 1954, for Automatic Scanning Apparatus, now abandoned, and its continuation Serial No. 626,244, filed December 4, 1956, disclose apparatus and methods for scanning an object or pattern, generating video signals, and utilizing such signals to measure dimensions, identify characters or objects, and control industrial operations.",

  plainEnglishExplanation: {
    overview:
      "The issued claim is a signal-selection architecture. An electron beam makes a predetermined scan of an image field; a programming means is synchronized to the picture signal; a gate then passes only the selected segment to an analyzing circuit. The archive also describes reference-picture and comparison arrangements. That is enough to teach why the order of scan, selection, and analysis matters, but it is not enough to reconstruct a particular factory camera, dimensional gauge, comparator threshold, or sorting actuator.",
    coreMechanism:
      "The public instrument treats the claim as a source-bounded logical path: $C = S \\land G \\land A \\land I$. Here $S$ is the source-described scan path, $G$ is the synchronized gate, $A$ is the analyzing circuit, and $I$ is a picture-signal-present state. $C$ means only that the depicted control path is available. It is not a voltage, pulse width, physical measurement, reject decision, force, or response-time prediction. A reference branch may show a match or difference as a display state; the reviewed grant does not license a calibrated optical or actuator model.",
    mechanicalBreakdown: [
      {
        title: "Cathode Ray Vidicon Video Camera",
        summary:
          "An electron-beam scanning apparatus that produces a picture signal while traversing a predetermined image-field path.",
        technicalDetails:
          "Claim 1 requires an electron beam to scan a predetermined path and produce a picture signal. It does not print a particular raster count, frame rate, image-field dimension, electron-beam velocity, pickup material, optical responsivity, or signal-voltage calibration. The exhibit therefore marks the scan path as present or withheld rather than presenting a reconstructed camera measurement.",
        archaicTerm: "Electron beam scanning apparatus / television camera pickup tube",
        modernEquivalent: "CCD / CMOS line-scan and area-scan industrial machine vision camera",
      },
      {
        title: "Synchronized Video Gating Network",
        summary:
          "Electronic gating and commutation circuits that isolate specific regions of interest within the video frame.",
        technicalDetails:
          "The claim's programming means operates the gate in predetermined time relation to picture-signal generation. Its legal work is selective passage: the analyzer receives the part of the picture signal made while the beam scans the chosen area. The source does not set a gate width, delay, comparator threshold, or noise margin for a particular apparatus.",
        archaicTerm: "Gating means controlled by variable programming means",
        modernEquivalent: "Region of Interest (ROI) hardware windowing & FPGA frame grabber gating",
      },
      {
        title: "Analyzing Circuit",
        summary:
          "A circuit that inspects the picture-signal portion admitted by the synchronized gate.",
        technicalDetails:
          "The apparatus makes the selected signal available to an analyzing circuit. That preserves the claim's causal order, $\\text{scan} \\to \\text{gate} \\to \\text{analysis}$, without assigning a threshold voltage, a pulse duration, a dimensional tolerance, or an accuracy result that the reviewed record does not establish.",
        archaicTerm: "Clipping circuit, differential analyzer, and pulse width measurement means",
        modernEquivalent: "Sub-pixel edge detection & 1D/2D dimensional gauging algorithm",
      },
      {
        title: "Control Output Path",
        summary:
          "A depicted downstream control relationship, shown only when the scan, gate, picture signal, and analyzing circuit form a complete source-described path.",
        technicalDetails:
          "The drawing set includes sorting and ejection arrangements, but this grant's reviewed public record does not establish coil turns, current, gap, moving mass, force, stroke, or response time for a particular diverter. The visual therefore shows a control-path state, not a solenoid simulation or a pass/fail production claim.",
        archaicTerm: "Electromechanical sorting means / solenoid diverter gate",
        modernEquivalent: "Pneumatic blow-off nozzle & servo diverter sortation gate",
      },
      {
        title: "Reference Signal Waveform Store",
        summary:
          "A multi-track magnetic drum or disc that stores golden standard reference waveforms for differential comparison.",
        technicalDetails:
          "The specification describes stored reference picture signals and comparison arrangements. The source-backed visual represents only the topological result of that branch, reference match, difference, or withheld; it does not manufacture waveform amplitude, sampling rate, optical sensitivity, or a defect-classification threshold.",
        archaicTerm: "Magnetic drum storage device and differential playback pickup",
        modernEquivalent:
          "Golden template matching & normalized cross-correlation (NCC) memory buffer",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Scan-Path Signal Generation",
        formula: "S \\rightarrow P",
        explanation:
          "The claim starts with a scan along a predetermined path $S$ that produces a picture signal $P$. This is a relationship of apparatus functions, not a published scan rate or a reconstructed beam trajectory.",
      },
      {
        principle: "Synchronized Gating",
        formula: "P_{\\text{selected}} = P \\land G",
        explanation:
          "The synchronized programming and gating means $G$ selects only the picture-signal portion produced while the chosen image-field area is scanned. No absolute gate width, delay, or voltage is asserted.",
      },
      {
        principle: "Analyzing-Circuit Admission",
        formula: "A = P_{\\text{selected}} \\land C_A",
        explanation:
          "The analyzing circuit is active only when it receives the selected signal and its own circuit path $C_A$ is available. The expression describes connection topology, not a comparator transfer curve or a measurement accuracy.",
      },
      {
        principle: "Claim 1 Control-Path Condition",
        formula: "C = S \\land G \\land A \\land I",
        explanation:
          "The public visual lights its control path $C$ only when scan $S$, synchronized gating $G$, analysis $A$, and picture-signal presence $I$ are all represented. $C$ is a normalized display state, not an electrical output or actuator command.",
      },
      {
        principle: "Reference Comparison State",
        formula: "R = \\operatorname{compare}(P_{\\text{test}}, P_{\\text{reference}})",
        explanation:
          "The specification describes reference-picture comparison. This display uses match, difference, and withheld as qualitative outcomes only; it does not infer optical amplitude, tolerance, defect type, or automated sorting performance.",
      },
    ],
    whyItMattersToday:
      "The record is useful as an early, explicit statement of a still-familiar engineering separation: form a picture signal, select the portion that matters, and send that portion to analysis. Modern image sensors and software use different components. This museum treatment keeps the historical signal-path idea distinct from claims about the performance, lineage, or calibration of any later machine-vision product.",
  },

  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: lemelsonMachineVisionClaimText(1),
      plainEnglish:
        "Claim 1 defines the complete combination of an electron beam scanning camera that sweeps across an image field to produce an analog video picture signal, an analyzing circuit that inspects a specific zone of that field, a gating circuit placed in the video signal path, and a synchronized programming device that automatically triggers the gate to pass only the specific portion of the video signal generated while the electron beam is scanning that predetermined inspection zone.",
      keyInnovations: [
        "Electron beam scanning along a predetermined image-field path",
        "Synchronized electronic gating networks isolating predetermined inspection zones",
        "Analyzing circuit receiving only the selected picture-signal portion",
        "Programming means synchronized to picture-signal generation",
      ],
      legalSignificance:
        "Claim 1 was the primary independent claim asserted across decades of high-stakes patent licensing and litigation in the bar-coding and machine vision industries, ultimately culminating in the landmark Federal Circuit case Symbol Technologies v. Lemelson (2004-2005) on the doctrine of patent prosecution laches.",
    },
  ],

  drawings: [
    {
      figureNumber: "Figure 1A",
      title: "Scanning Inspection Station & Conveyor",
      caption:
        "Overall block diagram showing the scanning camera, synchronization generator, clipping amplifier, gating circuit, and workpiece conveyor belt.",
      svgType: "flowchart",
      callouts: [
        {
          id: "callout-camera",
          figureRef: "Fig. 1A",
          label: "10",
          element: "10",
          description: "Scanning camera pickup tube.",
          x: 45,
          y: 30,
        },
        {
          id: "callout-conveyor",
          figureRef: "Fig. 1A",
          label: "12",
          element: "12",
          description: "Continuous workpiece conveyor belt.",
          x: 50,
          y: 75,
        },
      ],
    },
    {
      figureNumber: "Figure 2",
      title: "Video Waveform & Reference Comparison",
      caption:
        "Waveform diagram showing raw video scan pulse es, clipped pulse, and reference timing pulse ec.",
      svgType: "flowchart",
      callouts: [
        {
          id: "callout-scan-pulse",
          figureRef: "Fig. 2",
          label: "es",
          element: "es",
          description: "Analog video scanning waveform pulse.",
          x: 40,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "Figure 9",
      title: "Automated Sorting Diverter Gate",
      caption:
        "Illustrated sorting and ejection arrangement. The public visual treats it as a downstream control-path depiction, not a calibrated force, stroke, timing, or production-performance model.",
      svgType: "flowchart",
      callouts: [
        {
          id: "callout-diverter-gate",
          figureRef: "Fig. 9",
          label: "90",
          element: "90",
          description: "Electromechanical solenoid reject diverter gate.",
          x: 60,
          y: 50,
        },
      ],
    },
  ],

  historicalContext: {
    problemStatement:
      "Mid-20th century manufacturing lines moved at high speeds, but quality control and dimensional inspection were bottlenecked by human visual fatigue or crude fixed photocells incapable of measuring complex geometry, identifying printed markings, or detecting localized surface flaws.",
    priorArtLimitations: [
      "Human inspectors could not reliably inspect hundreds of components per minute and suffered from eye strain and inconsistency.",
      "Fixed photocells and mechanical limit switches could only detect bulk physical presence or gross binary blocking of a single light beam.",
      "Early optical comparators were static benchtop optical projection instruments requiring manual alignment and manual reticle reading.",
      "There was no electronic system capable of converting optical image scenes into real-time waveform voltages for synchronous automated sorting.",
    ],
    breakthroughInsight:
      "The claim makes a particular selection order explicit: a beam scans an image field, synchronized programming operates a gate, and the analyzer receives only the signal made while the predetermined area is scanned. That is a useful architecture to study without treating the grant as a calibration sheet for a camera or an actuator.",
    patentWars: [
      {
        rivalName: "Symbol Technologies, Cognex Corp., and the Machine Vision / Barcode Industry",
        rivalClaim:
          "Industrial barcode scanners and CCD machine vision systems developed in the 1980s and 1990s were independent solid-state inventions that should not be subject to patent infringement claims stemming from 1954/1956 vacuum-tube television camera disclosures.",
        conflictDetails:
          "Starting in the late 1980s, Jerome Lemelson and his licensing foundation aggressively asserted his 1954/1956 patent continuation portfolio against hundreds of major automotive, electronics, and semiconductor manufacturers, collecting over $1.5 billion in licensing royalties. Symbol Technologies and Cognex filed a landmark declaratory judgment action in federal court challenging the validity and enforceability of the asserted claims.",
        resolution:
          "In Symbol Technologies, Inc. v. Lemelson Medical, Education & Research Foundation (2004–2005), the U.S. Court of Appeals for the Federal Circuit ruled that the doctrine of prosecution laches is a valid equitable defense against patent enforceability when an applicant engages in an unreasonable and unexplained delay in prosecuting patent claims.",
        legalOutcome:
          "The Federal Circuit affirmed that Lemelson's decades-long continuation practice constituted prosecution laches, rendering the asserted submarine patent claims unenforceable and establishing the modern boundaries of continuation prosecution.",
      },
    ],
    civilizationalImpact:
      "Lemelson's vision of automated optical inspection laid the technical and conceptual foundations for modern machine vision, industrial robotics quality control, automated barcode sortation, and semiconductor wafer metrology across global manufacturing.",
    aftermath:
      "Lemelson used his patent licensing royalties to fund major educational and philanthropic initiatives, creating the Lemelson-MIT Program, establishing the prestigious Lemelson-MIT Prize for American inventors, and donating millions to the Smithsonian Institution's National Museum of American History.",
  },

  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
};
