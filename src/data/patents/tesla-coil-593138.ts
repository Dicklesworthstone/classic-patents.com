import { teslaCoil593138ArchivalEdition } from "@/data/editions/teslaCoil593138Edition";
import type { Patent } from "@/types/patent";

function manualClaimText(number: number): string {
  const block = teslaCoil593138ArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Tesla US 593,138 manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}

/**
 * Canonical catalogue record for the four-sheet facsimile inspected on
 * 2026-08-18. Its title sheet and specification identify it as US 593,138,
 * not US 533,367. The complete source face is the separately authored manual
 * React edition, checked against this pinned PDF.
 */
export const teslaCoil593138Patent: Patent = {
  id: "us-593138-tesla-coil",
  patentNumber: "US 593,138",
  title: "Electrical Transformer",
  shortTitle: "Tesla's High-Potential Transformer",
  subtitle:
    "A spiral secondary winding that keeps adjacent turns near one another in potential while moving the high-potential terminal away from the primary.",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, N.Y.",
  grantDate: "1897-11-02",
  filingDate: "1897-03-20",
  era: "Electrification Era (1880–1900)",
  category: "electricity",
  categoryLabel: "High-Potential Electrical Transmission",
  summary:
    "Tesla's 1897 transformer arranges primary and secondary windings so the secondary's greatest potential is remote from the primary and adjacent turns have a small voltage difference. The grant also describes paired step-up and step-down transformers for transmission.",
  heroQuote:
    "The convolutions of the conductor of the latter will be farther removed from the primary as the liability of injury from the effects of potential increases, the terminal or point of highest potential being the most remote.",
  originalPdfUrl: "/patents/pdfs/us-593138-tesla-coil.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US593138A/en",
  usptoClassification: "H01F 38/00 (transformers; resonant coils)",
  originalTextAsset: {
    url: "/patents/transcripts/us-593138-tesla-coil-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: teslaCoil593138ArchivalEdition.sourcePdfSha256,
  },
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y.

ELECTRICAL TRANSFORMER.

SPECIFICATION forming part of Letters Patent No. 593,138, dated November 2, 1897.
Application filed March 20, 1897. Serial No. 628,453. (No model.)

The present application is based upon an apparatus which I have devised and employed for the purpose of developing electrical currents of high potential.`,
  archivalEdition: teslaCoil593138ArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "The problem addressed here is insulation, not a generic spark-coil recipe. Tesla arranges the winding so that neighboring turns have relatively little voltage between them, while the terminal at the greatest potential is physically remote from the primary and from a person handling the apparatus.",
    coreMechanism:
      "A secondary coil is wound as a flat spiral or another graded form. Its inner end, nearest the primary, is electrically connected to the primary and to earth in use. The remote end reaches the highest potential. Tesla also describes a transmission pair: a sending transformer raises the line potential and a receiving transformer lowers it again.",
    mechanicalBreakdown: [
      {
        title: "Graded Secondary Winding",
        summary:
          "The secondary's geometry separates the high-potential terminal from the primary and keeps neighboring turns closer in potential.",
        technicalDetails:
          "The specification identifies a flat spiral as the usual form and permits a frustum-of-cone form. Its stated safety rationale is that potential rises along the winding while the difference between adjacent turns remains comparatively small.",
        archaicTerm: "convolutions",
        modernEquivalent: "winding turns",
      },
      {
        title: "Primary and Earth Connection",
        summary:
          "The secondary terminal adjacent to the primary is connected to the primary and, in use, to earth.",
        technicalDetails:
          "Claims 1 through 3 make this electrical relationship part of the claimed transformer. The source says it reduces the tendency for sparks to jump between adjacent primary and secondary portions.",
        archaicTerm: "earth",
        modernEquivalent: "protective ground connection",
      },
      {
        title: "Transmission Pair",
        summary:
          "A sending transformer raises potential for a line, and a receiving transformer lowers it for lamps, motors, or another local circuit.",
        technicalDetails:
          "Figure 1 depicts this system-level arrangement. Claim 4 covers the relationship between the two transformers and the line and earth terminals of their longer, fine-wire coils.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Voltage grading along a winding",
        formula:
          "The voltage between adjacent turns is the difference between their local potentials.",
        explanation:
          "The historical claim is architectural: distribute the change in potential along a long winding rather than allowing a large change across closely adjacent conductors.",
      },
      {
        principle: "Standing-wave length described by the specification",
        formula:
          "Tesla specifies a secondary approximately one quarter of the electrical disturbance wavelength.",
        explanation:
          "Tesla specifies a secondary length approximately one-quarter of the electrical disturbance wavelength so the remote terminal is at maximum potential. The manual edition preserves and explains the source's numerical example.",
      },
    ],
    whyItMattersToday:
      "This patent records a high-potential transformer design whose insulation strategy is geometric and system-level. The complete source reading retains Tesla's terminal arrangement, quarter-wave example, and Figure 1 to 3 constructions beside their precise modern companions.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: manualClaimText(1),
      plainEnglish:
        "Claims a high-potential transformer having primary and secondary coils, with one secondary terminal electrically tied to the primary and, during operation, to earth. The claim makes that specified three-way relationship the legal limitation, without requiring the later flat-spiral geometry.",
      keyInnovations: ["primary-secondary connection", "grounded secondary terminal"],
    },
    {
      number: 2,
      isIndependent: true,
      originalText: manualClaimText(2),
      plainEnglish:
        "Claims the same high-potential transformer when its primary and secondary are wound as a flat spiral. It specifically fixes the secondary end nearest the primary as the end electrically connected both to the primary and, in use, to earth.",
      keyInnovations: ["flat spiral winding", "adjacent secondary terminal"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText: manualClaimText(3),
      plainEnglish:
        "Claims a spiral arrangement in which the secondary lies inside and is surrounded by the primary turns. The secondary terminal adjacent to the primary must be electrically connected both to that primary and, while in use, to earth; that nested placement distinguishes this claim from the broader first claim.",
      keyInnovations: ["nested spiral geometry", "surrounding primary winding"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText: manualClaimText(4),
      plainEnglish:
        "Claims a transmission system using two transformers: one raises and the other lowers the current potential. The longer or fine-wire coil has a terminal on the line; its other terminal, adjacent to the shorter coil, is electrically connected to that coil and to earth at each transformer.",
      keyInnovations: ["step-up transformer", "step-down transformer", "line transmission pair"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Sending and receiving transformer system",
      caption:
        "The first drawing sheet shows the primary and secondary windings in a transmission arrangement with a dynamo, lamps, and motors.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tesla-593138-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Core",
          description:
            "The core marked A in the source figure; the specification says it may be magnetic when desired.",
          x: 27,
          y: 35,
        },
        {
          id: "tesla-593138-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Secondary coil",
          description: "The spiral secondary coil shown in each transformer.",
          x: 25,
          y: 25,
        },
        {
          id: "tesla-593138-c",
          figureRef: "Fig. 1",
          label: "C",
          element: "Primary coil",
          description: "The primary wound in proximity to the secondary.",
          x: 35,
          y: 31,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Frustum-of-cone winding form",
      caption:
        "The second drawing sheet shows a secondary wound on a frustum-of-cone support with the primary around its base.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tesla-593138-fig2-b",
          figureRef: "Fig. 2",
          label: "B",
          element: "Secondary coil",
          description: "The secondary winding drawn on the conical support.",
          x: 58,
          y: 63,
        },
        {
          id: "tesla-593138-fig2-c",
          figureRef: "Fig. 2",
          label: "C",
          element: "Primary coil",
          description: "The primary winding around the base of the conical form.",
          x: 77,
          y: 65,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Two-section secondary construction",
      caption:
        "The second drawing sheet also shows two insulating spools, two secondary sections, a surrounding flat-strip primary, and insulating lead-out tubes.",
      svgType: "tesla-coil",
      callouts: [
        {
          id: "tesla-593138-fig3-b",
          figureRef: "Fig. 3",
          label: "B",
          element: "Secondary coil sections",
          description: "The two secondary sections wound on insulating spools.",
          x: 30,
          y: 28,
        },
        {
          id: "tesla-593138-fig3-c",
          figureRef: "Fig. 3",
          label: "C",
          element: "Primary strip",
          description: "The spirally wound flat-strip primary surrounding both secondary sections.",
          x: 48,
          y: 41,
        },
        {
          id: "tesla-593138-fig3-m",
          figureRef: "Fig. 3",
          label: "M",
          element: "Insulating lead-out tubes",
          description:
            "The insulating tubes through which the inner secondary terminals are led out.",
          x: 16,
          y: 51,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Tesla describes earlier transformer and induction-coil construction as unable to produce or practically use the required high potentials without danger to apparatus or people.",
    priorArtLimitations: [
      "Ordinary winding arrangements placed conductors with large potential differences too near each other.",
      "A high-potential line could discharge to nearby grounded objects without adequate insulation and support.",
    ],
    breakthroughInsight:
      "Make the potential gradient a property of the winding geometry and terminal arrangement, then use paired transformers to raise and lower potential across a transmission line.",
    patentWars: [],
    civilizationalImpact:
      "The source documents a practical concern central to high-voltage engineering: insulation coordination between winding turns, terminals, lines, and ground.",
    aftermath:
      "The complete manual source edition is prepared against the four-sheet facsimile; independent facsimile and live-route acceptance remains a separate root quality-control step.",
  },
  tags: ["Nikola Tesla", "transformer", "high potential", "winding insulation"],
  stats: {
    totalClaims: 4,
    independentClaims: 4,
  },
};
