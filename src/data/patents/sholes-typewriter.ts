import type { Patent } from "@/types/patent";
import { sholesTypewriterArchivalEdition } from "../editions/sholesTypewriterEdition";

export const sholesTypewriterPatent: Patent = {
  id: "us-79265-sholes-typewriter",
  patentNumber: "US 79,265",
  title: "Improvement in Type-Writing Machines",
  shortTitle: "Type-bar, carriage, and ribbon mechanisms",
  subtitle:
    "Radial type-bars, self-adjusting platen, two-axis paper carriage, ratchet spacing, and ribbon feed",
  inventors: ["Christopher Latham Sholes", "Carlos Glidden", "Samuel W. Soule"],
  inventorLocation: "Milwaukee, Milwaukee County, Wisconsin",
  grantDate: "1868-06-23",
  // The facsimile mentions an October 11, 1867 application for the prior
  // machine it improves, not a filing date for US 79,265 itself.
  filingDate: null,
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Mechanical Information Systems & Ergonomics",
  summary:
    "US 79,265 describes improvements to an earlier type-writing machine: a radially slotted disk and direct key-lever action for type-bars, a self-adjusting platen, a carriage with separate writing-line and line-to-line motions, a key-actuated ratchet spacer, and a driven inking-ribbon feed.",
  heroQuote:
    "Its features are a better way of working the type-bars, of holding the paper on the carriage, of moving and regulating the movement of the carriage, of holding, applying, and moving the inking-ribbon, a self-adjusting platen, and a rest or cushion for the type-bars to follow.",
  originalPdfUrl: "/patents/pdfs/us-79265-sholes-typewriter.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US79265/en",
  usptoClassification: "B41J (Typewriters and selective printing mechanisms)",
  originalTextAsset: {
    url: "/patents/transcripts/us-79265-sholes-typewriter-reviewed.txt",
    pageCount: 6,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "59e3d127ca09c1468d554cd70cd7621b77e155b42df3194e61f04e69d8750aca",
  },
  archivalEdition: sholesTypewriterArchivalEdition,
  // This short catalogue excerpt remains supplementary; the manual React
  // edition above is the complete visitor-facing source specification.
  originalText: `To all whom it may concern:

Be it known that we, C. LATHAM SHOLES, CARLOS GLIDDEN, and SAMUEL W. SOULE, of the city of Milwaukee, and county of Milwaukee, and State of Wisconsin, have invented new and useful Improvements in Type-Writing Machines; and we do hereby declare that the following is a full, clear, and exact description of the invention, which will enable those skilled in the art to make and use the same, reference being had to the accompanying drawings, forming part of this specification, in which—

This invention is of improvements to an invention of a type-writing machine, an application for a patent for which we filed October 11, 1867. Its features are a better way of working the type-bars, of holding the paper on the carriage, of moving and regulating the movement of the carriage, of holding, applying, and moving the inking-ribbon, a self-adjusting platen, and a rest or cushion for the type-bars to follow.`,
  plainEnglishExplanation: {
    overview:
      "This is not a patent for a particular keyboard arrangement, a ribbon vibrator, or the later commercial Sholes and Glidden machine. The printed specification calls itself an improvement to an earlier type-writing machine and concentrates on a particular mechanical package: direct-acting keys below radial type-bars, a platen that can square itself to the type, two perpendicular carriage motions, a key-driven spacing ratchet, and a ribbon drive linked to carriage motion.",
    coreMechanism:
      "A key L pivots on fulcrum M. Its inner finger w directly lifts the matching type-bar from a radial slot in disk B, so the type reaches the common central point beneath platen G. The platen is carried in a spherical bowl, allowing it to adjust its face against the paper. Weights and cords pull the paper carriage, but a bifurcated lever H and serrated ratchet I hold it until a key stroke releases exactly one notch. A separate pin-and-pawl system makes the transverse line-to-line move. The same carriage movement turns cone pulleys and advances a fresh portion of the ribbon beneath the platen.",
    mechanicalBreakdown: [
      {
        title: "Radial disk and direct key action",
        summary:
          "Disk B is an annulus with radial grooves; type-bars O pivot at its outer edge and their inner type ends meet one central printing point.",
        technicalDetails:
          "The source specifies brass as the preferred disk material, a diameter of four to five inches, a central hole one to one and a half inches or more across, and radial grooves. It prefers steel for the type-bars. A piano-like keyboard has one more key than the number of types, the extra key being the space-key. The patent says the key finger can be a stiff wire or an integral bent part of the key; it does not state a key count, a named keyboard arrangement, an impact speed, or a force.",
        archaicTerm: "Type-bars or hammers",
        modernEquivalent: "Pivoted typebars in a radial type segment",
      },
      {
        title: "Self-adjusting platen and paper carriage",
        summary:
          "Platen G has a spherical upper end seated in a spherical bowl in anvil O′, making a universal joint that lets the face meet the paper squarely.",
        technicalDetails:
          "The primary open frame C, C′, C² moves in one direction for a line of words. Its secondary frame E, E′, E² moves at right angles for a series of lines. Springs b and a keep paper in the chase and against the platen. The printed text calls for a bar F with equally spaced pins e and a pawl h with spring l; that second mechanism moves the paper carriage the required line-to-line distance. It does not claim a cylindrical rubber platen, a line pitch, or feed-roller force.",
        archaicTerm: "Platen self-adjustable",
        modernEquivalent: "Spherically mounted printing platen",
      },
      {
        title: "Key-actuated ratchet spacing",
        summary:
          "Cross-bar T lies behind the key fulcrum. A key stroke raises T, which moves bifurcated lever H through the notches in ratchet-bar I to permit one regular carriage step.",
        technicalDetails:
          "The source explains a two-fork escapement: each fork alternately fits a serration while the other releases. Weights W and W′, cords v and a′, and pulleys R and e′ provide the carriage pull. The patent makes the causal timing explicit: the paper moves while the type-bar falls to cushion q, and remains held while the type strikes the platen. It provides no tooth count, character pitch, carriage mass, spring constant, or key-repeat rate.",
        archaicTerm: "Spacer or ratchet",
        modernEquivalent: "Escapement-style carriage spacing mechanism",
      },
      {
        title: "Carriage-enabled ribbon feed",
        summary:
          "Spools m carry an inking-ribbon under platen G. Carriage movement rotates the connected cone pulleys R and k, shaft l, and the driven spool.",
        technicalDetails:
          "The source calls the pulley faces cone pulleys, meaning a sequence of diameters. It says their relative sizes can regulate ribbon feed. Ratchet wheel V and pawl t stop pulley R from turning toward bar F, while a weighted pivoted bar P keeps the belt tight. The document does not identify silk, a spool-reversal mechanism, a ribbon step distance, or a per-key ribbon ratchet.",
        archaicTerm: "Inking-ribbon",
        modernEquivalent: "Ink-transfer ribbon on supply and take-up spools",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Radial convergence",
        formula:
          "Type-bar length equals the disk radius, so each inner type end reaches the same center point.",
        explanation:
          "The patent gives a geometric condition, not an impact calculation. Equal radial lengths make a different pivoted bar reach the same point when raised into its slot.",
      },
      {
        principle: "Discrete spacing by alternating catches",
        formula:
          "One fork releases a serration only while the other catches the next one; the carriage then moves one notch.",
        explanation:
          "This is the mechanism the specification uses to convert a steady pull from the carriage weights into repeatable letter spacing. It never supplies a numerical pitch.",
      },
    ],
    whyItMattersToday:
      "The document is valuable as a compact study in coordinating several mechanical functions around each written character: selecting a type, holding paper at one point, moving through a line, moving to the next line, and refreshing the ink interface. Those are distinct design problems in the source, even though later typewriters solve them in very different forms.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The key-levers L, vibrating on the fulcrum M, with the inner ends or fingers w reaching under the type-bars, so that the keys will act directly on the types, substantially as and for the purpose described.",
      plainEnglish:
        "Claim 1 is narrowly about direct actuation: keys L pivot on beam M and their inner fingers w reach under type-bars, so pressing a key acts directly on a type-bar.",
      keyInnovations: ["Key-levers L", "Fulcrum M", "Direct fingers w beneath type-bars"],
      legalSignificance:
        "This record identifies the printed combination only; it does not make an unsourced claim about later litigation or the general typewriter field.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "The spacer or ratchet I, combined with the bifurcated lever H, connected with the bar T, pivoted at s and resting on and across the arms of the keys L behind the fulcrum M, so that striking the faces of the keys will work the teeth of the forks of the lever up and down and into the notches of the spaces and give a certain uniform and regular space movement to the paper-carriage in line of the types, when made substantially as described.",
      plainEnglish:
        "Claim 2 protects the detailed spacing train. A key raises cross-bar T; that moves the two-forked lever H against ratchet I, and the alternating fork teeth permit a regular one-notch movement of the carriage along the line of type.",
      keyInnovations: [
        "Ratchet I",
        "Bifurcated lever H",
        "Cross-bar T behind fulcrum M",
        "Regular in-line carriage movement",
      ],
      legalSignificance:
        "The printed claim requires the named ratchet, lever, bar, keys, and their stated spacing relationship; it is not a claim to every carriage advance mechanism.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "The pins e, fastened to the table A′, combined with the pawl h and the spring l, to give the paper-carriage a certain and regular cross-line movement at a right angle to the space movement from line to line, when made substantially as described.",
      plainEnglish:
        "Claim 3 covers the separate line-to-line mechanism: pins e on table A′ cooperate with pawl h and spring l to move the carriage across the writing direction by a regular amount.",
      keyInnovations: ["Line-spacing pins e", "Pawl h", "Spring l", "Cross-line carriage movement"],
      legalSignificance:
        "The claim is for the named pin, pawl, and spring combination that provides transverse motion, not merely for paper line spacing in the abstract.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "The clasps or springs b, attached to the bars C′ and C² on a line through the middle of the platen G, combined with the springs a, attached to the bar E, to hold the paper to the carriage and press it down smooth and tight in passing under the platen, when made substantially as described.",
      plainEnglish:
        "Claim 4 covers the paper-holding arrangement: springs or clasps b on the primary frame work with springs a on the secondary frame so paper stays smooth and tight as it passes beneath platen G.",
      keyInnovations: [
        "Springs or clasps b",
        "Springs a",
        "Bars C′, C², and E",
        "Paper held smooth under platen G",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "The spools m, combined with the gudgeon s′, the shaft l, the pulleys k and R, the band v′, the cord v, the weight W, the ratchet-wheel V, the pawl t, and the bar P, pivoted to the back of the case A² to feed a fresh part of the inking-ribbon under the platen to each type successively, when made substantially as described.",
      plainEnglish:
        "Claim 5 is the complete ribbon-feed train. The carriage pull and its pulleys drive a shaft and spools while a ratchet, pawl, and weighted pivoted bar preserve direction and belt tension, bringing a fresh ribbon portion under the platen.",
      keyInnovations: [
        "Ribbon spools m",
        "Shaft l and pulleys k and R",
        "Weighted cord v and weight W",
        "Ratchet-wheel V and pawl t",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective view of the type-writing machine",
      caption:
        "Fig. 1 is the source perspective view. It shows the case A, annular type-bar disk B, frames C and E, platen G, keys L, ratchet I, and the linked carriage and ribbon mechanisms.",
      svgType: "sholes-typewriter",
      callouts: [
        {
          id: "st-1",
          figureRef: "Fig. 1",
          label: "Case",
          element: "A",
          description:
            "The case and its cover provide the mounting surface for the disk, key-board, carriage, and other named parts.",
          x: 38,
          y: 61,
        },
        {
          id: "st-2",
          figureRef: "Fig. 1",
          label: "Annular type-bar disk",
          element: "B",
          description:
            "The radially slotted annular disk in which type-bars pivot and rise toward the central point.",
          x: 48,
          y: 31,
        },
        {
          id: "st-3",
          figureRef: "Fig. 1",
          label: "Primary carriage frame",
          element: "C",
          description:
            "The larger open carriage frame, which moves in the writing-line direction and carries the secondary paper frame.",
          x: 60,
          y: 50,
        },
        {
          id: "st-4",
          figureRef: "Fig. 1",
          label: "Arm to the anvil",
          element: "D",
          description:
            "Arm D reaches from the case edge toward the solid anvil above the disk; it supports the platen arrangement described in Fig. 7.",
          x: 26,
          y: 22,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The inventors present US 79,265 as a set of practical improvements to an earlier type-writing machine: better type-bar action, paper holding, carriage movement, ribbon management, a self-adjusting platen, and a type-bar rest.",
    priorArtLimitations: [
      "The printed specification says an application for the earlier type-writing machine was filed October 11, 1867; it identifies the need for improved type-bar, carriage, ribbon, platen, and cushion arrangements rather than claiming that every prior writing machine failed in the same way.",
    ],
    breakthroughInsight:
      "The source ties selection, registration, and inking together: direct key fingers lift radial bars; a self-adjusting platen holds the paper at their common point; ratchet and pin mechanisms define the two carriage motions; and carriage motion advances the ribbon.",
    patentWars: [],
    civilizationalImpact:
      "The patent makes an early writing machine legible as a coordinated information mechanism. It distinguishes selection of a character, spacing within a line, moving to the next line, keeping paper against the platen, and refreshing the inked interface.",
    funFact:
      "The inventors prefer brass for the four-to-five-inch annular disk and steel for its type-bars, but allow other suitable materials and sizes.",
    aftermath:
      "The printed grant is dated June 23, 1868, and the execution at the end of the specification is dated May 1, 1868.",
  },
  tags: ["Christopher Sholes", "Typewriter", "Escapement", "Paper Carriage", "Inking Ribbon"],
  stats: {
    totalClaims: 5,
    independentClaims: 5,
  },
};
