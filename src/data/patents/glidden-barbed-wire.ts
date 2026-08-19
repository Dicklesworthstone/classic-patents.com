import { gliddenBarbedWireArchivalEdition } from "@/data/editions/gliddenBarbedWireEdition";
import type { Patent } from "@/types/patent";

export const gliddenBarbedWirePatent: Patent = {
  id: "us-157124-glidden-barbed-wire",
  patentNumber: "US 157,124",
  title: "Improvement in Wire-Fences",
  shortTitle: "Glidden's Twisted Barbed Wire",
  subtitle: "A transverse spur wire clamped between two twisted fence-wire strands",
  inventors: ["Joseph F. Glidden"],
  inventorLocation: "De Kalb, Illinois",
  grantDate: "1874-11-24",
  filingDate: "1873-10-27",
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "materials",
  categoryLabel: "Metallurgy & Structural Wire Fencing",
  summary:
    "Joseph F. Glidden's 1874 patent describes a fence wire made from two long strands twisted together after short crosswise spur wires have been placed on one strand. The second strand grips each spur's central bend, preventing it from sliding or rotating; a key through the fence-post can retighten the twist if it loosens.",
  heroQuote:
    "This operation locks each spur wire at its allotted place, and prevents it from moving therefrom in either direction.",
  originalPdfUrl: "/patents/pdfs/us-157124-glidden-barbed-wire.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US157124A/en",
  usptoClassification: "B21F 25/00 (Making barbed wire; Barbed wire construction)",
  originalTextAsset: {
    url: "/patents/transcripts/us-157124-glidden-barbed-wire-reviewed.txt",
    pageCount: 2,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "19c3874222e125ad1be8df9b1e4e59df4d7ff6452876588666a3c9ddf2cb0cc1",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "J. F. GLIDDEN.",
        sourceRelationship: "Printed drawing sheet carrying Figures 1 through 3.",
      },
      {
        page: 2,
        exactSourceText: "UNITED STATES PATENT OFFICE.",
        sourceRelationship: "Patent-office specification, single claim, execution, and witnesses.",
      },
    ],
  },
  archivalEdition: gliddenBarbedWireArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
JOSEPH F. GLIDDEN, OF DE KALB, ILLINOIS.

IMPROVEMENT IN WIRE-FENCES.

To all whom it may concern:
Be it known that I, JOSEPH F. GLIDDEN, of De Kalb, in the county of De Kalb and State of Illinois, have invented a new and valuable Improvement in Wire-Fences; and that the following is a full, clear, and exact description of the construction and operation of the same, reference being had to the accompanying drawings, in which—

Figure 1 represents a side view of a section of fence exhibiting my invention. Fig. 2 is a sectional view, and Fig. 3 is a perspective view, of the same.

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including the full specification and its single claim.`,
  plainEnglishExplanation: {
    overview:
      "Glidden's patent answers a narrow mechanical problem: a barb on a fence wire must remain where it was placed and must keep pointing across the fence when an animal pushes on it. His solution puts a short crosswise wire around one long strand, then twists a second long strand alongside it. The two-strand twist becomes the retaining fixture for the short barb.",
    coreMechanism:
      "First, short spur wires are bent at their middles and placed along one long fence-wire strand. Their free ends project in opposite directions. A second long strand is brought up on the side opposite those projecting ends and the two long strands are twisted together. The twist presses the spur-wire bend against the first strand, stops it from travelling along the fence, and creates close approaches between the long wires that act as stops against rotation. If the assembly loosens, a key through the fence post can add twist again.",
    mechanicalBreakdown: [
      {
        title: "Two long fence-wire strands",
        summary:
          "The patented fence wire has at least two strands, marked a and z, that are twisted together after the spur wires are placed.",
        technicalDetails:
          "The second strand is not merely extra tensile material. Its position in the twist clamps each short spur wire against the first strand. The claim makes that relationship explicit: the other strand is twisted upon its fellow and holds the spur in position.",
        archaicTerm: "fence-wire",
        modernEquivalent: "Two-strand twisted fence wire",
      },
      {
        title: "Transverse spur wire",
        summary:
          "A short wire bends around one long strand at its middle while its two ends project in opposite directions.",
        technicalDetails:
          "Several turns at the middle make a longer coil, which Glidden calls a bearing-head. The source says that bearing is intended to resist sideways vibration and to stop cattle from pressing the projecting spur ends down against the fence wire.",
        archaicTerm: "spur-wire",
        modernEquivalent: "Crosswise barb wire",
      },
      {
        title: "Twist-formed stops",
        summary: "The paired long wires constrain the spur wire in translation and rotation.",
        technicalDetails:
          "Twisting the two long strands grips the central bend of the short wire. Where the long strands come close together, they form the shoulders or stops named in the specification. Those geometric stops keep the spur from turning either direction, so its free ends continue to project across the line of the fence.",
        archaicTerm: "shoulders or stops",
        modernEquivalent: "Geometric anti-rotation stops",
      },
      {
        title: "Through-post twisting key",
        summary:
          "A shank through the fence-post provides a way to retighten a length of wire that has begun to untwist.",
        technicalDetails:
          "The wire attaches to an eye at the inner end of the key. A transverse thumb-piece at the outer end turns it and bears against the post, preventing the tensioned wire from drawing the key through the post. Turning the key restores the twist and straightens the wire according to the specification.",
        archaicTerm: "twisting-key or head-piece",
        modernEquivalent: "Post-mounted tensioning handle",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Torsional clamping and helical normal force",
        formula:
          "F_N = \\frac{2 \\pi T_{\\text{twist}}}{p_{\\text{pitch}}} \\cdot \\cos(\\theta_{\\text{helix}})",
        explanation:
          "Twisting two long wires stores torsional deformation and brings their surfaces into repeated contact. Here that geometry also traps the bent middle of a third, short wire. The patent relies on the resulting contact and shape, not on soldering or an added fastener.",
      },
      {
        principle: "Constraint of translation and rotational shear",
        formula:
          "F_{\\text{slip}} = \\mu_s F_N + \\sigma_{\\text{yield}} \\cdot A_{\\text{shoulder}}",
        explanation:
          "A barb fails if it slides along the carrier wire or turns until its ends lie in a harmless direction. Glidden describes two independent constraints: the twist holds the central bend at an allotted place, and the closely approaching strands make shoulders that block turning.",
      },
      {
        principle: "Catenary tension and torsional pitch relation",
        formula: "T = \\frac{w L^2}{8 d} + \\frac{G J \\theta}{L}",
        explanation:
          "The twisting key converts a hand rotation at the post into additional twist in the paired fence wire. Retightening restores the clamping relation around the spur wires and removes slack from the span.",
      },
    ],
    whyItMattersToday:
      "The document is a compact example of manufacturing through geometry. A length of wire, short crosswise pieces, and a repeatable twisting operation create both the deterrent and its retaining mechanism. The resulting product became commercially important in the fencing of open-range land, but the claim remains specific to the arrangement that locks the spur wire between the two twisted strands.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A twisted fence-wire having the transverse spur-wire D bent at its middle portion about one of the wire strands a of said fence-wire, and clamped in position and place by the other wire strand z, twisted upon its fellow, substantially as specified.",
      plainEnglish:
        "The protected combination is a two-strand twisted fence wire in which a short crosswise spur wire is bent around one strand and the other strand clamps it in place. The legal work of the claim is the locking relationship, not every fence that happens to have sharp projections.",
      keyInnovations: [
        "Twisted fence wire",
        "Transverse spur wire bent around one strand",
        "Second strand clamping the spur against the first",
      ],
      legalSignificance:
        "The single printed claim defines the source document's protected combination. The specification describes the post key as a practical retightening device, but that key is not separately recited in the printed claim.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Fence section between posts",
      caption:
        "The source sheet's side view of a fence section, showing posts B, twisted fence-wire A, spur wires D, and the twisting-key arrangement C.",
      svgType: "glidden-barbed-wire",
      callouts: [
        {
          id: "gb-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Twisted fence-wire",
          description: "The pair of long fence-wire strands identified in the specification.",
          x: 50,
          y: 52,
        },
        {
          id: "gb-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Fence-post",
          description: "The post through which the twisting-key shank passes.",
          x: 20,
          y: 50,
        },
        {
          id: "gb-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Twisting-key",
          description: "The through-post key used to turn and retighten the fence-wire ends.",
          x: 44,
          y: 19,
        },
        {
          id: "gb-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Spur-wire",
          description: "The short transverse wire whose ends project across the fence line.",
          x: 50,
          y: 60,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Sectional view of the twisted wire",
      caption:
        "The source sheet's small sectional view, showing the relationship of the transverse spur wire to the two long strands.",
      svgType: "glidden-barbed-wire",
      callouts: [
        {
          id: "gb-5",
          figureRef: "Fig. 2",
          label: "D",
          element: "Transverse spur-wire",
          description: "The short wire crossing the fence-wire section.",
          x: 64,
          y: 53,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Perspective of one locked spur wire",
      caption:
        "The source sheet's enlarged perspective of a spur wire bent around one strand and held by the twist of the two long wires.",
      svgType: "glidden-barbed-wire",
      callouts: [
        {
          id: "gb-6",
          figureRef: "Fig. 3",
          label: "E",
          element: "Central bend",
          description: "The bent or coiled middle of the short spur-wire around one long strand.",
          x: 59,
          y: 56,
        },
        {
          id: "gb-7",
          figureRef: "Fig. 3",
          label: "s",
          element: "Shoulder or stop",
          description:
            "A close part of the twist that the specification says prevents spur rotation.",
          x: 71,
          y: 52,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A prairie fence had to restrain animals over long distances where timber fencing was costly. A smooth wire could be crossed or deformed easily; a useful wire fence needed a projection that would remain exposed after repeated contact.",
    priorArtLimitations: [
      "A projection that slides along a carrier wire can bunch up, leaving long unprotected stretches.",
      "A projection that turns around its carrier can lose the crosswise orientation needed to deter an animal.",
      "A tensioned fence that gradually untwists loses both its straightness and the clamping force holding its spur wires.",
    ],
    breakthroughInsight:
      "Glidden used the same two-strand twist both as the fence's long carrier and as the fixture that locks each short spur wire. The source's separate twisting key makes that locking relationship adjustable after installation.",
    patentWars: [
      {
        rivalName: "Barbed-wire validity litigation",
        rivalClaim:
          "Competitors argued that earlier wire fences and barbed constructions anticipated Glidden's arrangement.",
        conflictDetails:
          "The validity of Glidden's patent was litigated with other barbed-wire manufacturers. The litigation centered on whether prior devices taught the particular practical combination described in US 157,124.",
        resolution:
          "In The Barbed Wire Patent, 143 U.S. 275 (1892), the Supreme Court upheld US 157,124 against the anticipatory prior-art arguments considered in that case.",
        legalOutcome:
          "The decision treated the claimed arrangement as a patentable invention on the record before the Court. This entry does not treat the opinion as a license to claim every historical barbed-wire design.",
      },
    ],
    civilizationalImpact:
      "Barbed wire allowed long, relatively light fence lines to be erected across open land. It changed the economics of livestock containment and field boundaries in regions where conventional timber fences were difficult to build and maintain.",
    aftermath:
      "The patent became one of the important barbed-wire rights contested in nineteenth-century United States litigation. Its technical lesson is unusually legible in the source: a two-wire twist can function as a continuous series of clamps for separately formed barbs.",
  },
  tags: ["Joseph F. Glidden", "Barbed Wire", "Agriculture", "Open Range", "Wire Fencing"],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1874–1892",
    impactScore: 100,
  },
};
