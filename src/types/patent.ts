export type PatentCategory =
  | "aviation"
  | "aerospace"
  | "electricity"
  | "telecom"
  | "computing"
  | "consumer"
  | "materials"
  | "optics";

export interface PatentClaim {
  number: number;
  isIndependent: boolean;
  dependsOn?: number[];
  originalText: string;
  plainEnglish: string;
  keyInnovations: string[];
  legalSignificance?: string;
}

export interface DrawingCallout {
  id: string;
  figureRef: string; // e.g. "Fig. 1", "Fig. 2"
  label: string;
  element: string; // e.g. "12", "a", "k"
  description: string;
  x: number; // percentage coordinate 0-100
  y: number; // percentage coordinate 0-100
}

export interface PatentDrawing {
  figureNumber: string;
  title: string;
  caption: string;
  svgType: string;
  callouts: DrawingCallout[];
}

export interface PatentWar {
  rivalName: string;
  rivalClaim: string;
  conflictDetails: string;
  resolution: string;
  legalOutcome: string;
}

export interface HistoricalContext {
  problemStatement: string;
  priorArtLimitations: string[];
  breakthroughInsight: string;
  patentWars: PatentWar[];
  civilizationalImpact: string;
  funFact?: string;
  /** What happened after grant: money, later suits, later use. */
  aftermath?: string;
  /** Extra dated anecdotes that do not fit the bottleneck / war cards. */
  sideNotes?: string[];
}

export interface MechanicalBreakdownSection {
  title: string;
  summary: string;
  technicalDetails: string;
  archaicTerm?: string;
  modernEquivalent?: string;
}

export interface ScientificPrinciple {
  principle: string;
  formula?: string;
  explanation: string;
}

export interface PlainEnglishExplanation {
  overview: string;
  coreMechanism: string;
  mechanicalBreakdown: MechanicalBreakdownSection[];
  scientificPrinciples: ScientificPrinciple[];
  whyItMattersToday: string;
}

/**
 * The only permitted source format for a published archival edition.
 *
 * These nodes are deliberately authored one by one in the catalogue, rather
 * than inferred from OCR, HTML, Markdown, or a raw PDF text layer. The source
 * document is rendered as a continuous reading experience; scan-page numbers
 * and page breaks belong to the facsimile, not to this edition.
 */
export type CuratedSpecificationInline =
  | { kind: "text"; text: string }
  | {
      kind: "reference";
      /** Exact source-language reference, authored at this occurrence. */
      text: string;
      /** Editor-chosen destination; the reader never infers this from prose. */
      href: string;
      referenceType: "figure" | "claim" | "section";
      /** Accessible description of the visual source or source section. */
      label: string;
      /**
       * Crops from the pinned source facsimile, selected by the editor for
       * this exact occurrence. Omitted for non-figure source references.
       */
      figurePreviews?: readonly {
        src: string;
        alt: string;
        width: number;
        height: number;
      }[];
    }
  | {
      kind: "term";
      /** Exact words from the historical specification. */
      text: string;
      /** A concise modern definition, authored for this exact occurrence. */
      definition: string;
      /** Optional short label when the definition needs a historical qualifier. */
      label?: string;
    }
  | { kind: "emphasis"; text: string }
  | { kind: "small-caps"; text: string };

export type CuratedSpecificationInlines = CuratedSpecificationInline[];

export type CuratedSpecificationBlock =
  | { kind: "masthead"; lines: string[] }
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; inlines: CuratedSpecificationInlines }
  | {
      kind: "claim";
      number: number;
      inlines: CuratedSpecificationInlines;
    }
  | {
      kind: "figure-sheet";
      figureLabel: string;
      title?: string;
      description: CuratedSpecificationInlines;
    }
  | {
      kind: "table";
      caption?: string;
      headers: CuratedSpecificationInlines[];
      rows: CuratedSpecificationInlines[][];
    }
  | {
      kind: "equation";
      /** Exact mathematical notation or formula appearing in the source. */
      text: string;
      description?: string;
    };

export interface CuratedSpecificationEdition {
  kind: "manual-react-edition";
  /** SHA-256 of the exact PDF served by originalPdfUrl. */
  sourcePdfSha256: string;
  /** Named agent/editor who prepared the continuous edition. */
  preparedBy: string;
  /** ISO calendar date on which preparation finished. */
  preparedAt: string;
  /** An explicit attestation that the full facsimile, not OCR alone, was checked. */
  completeFacsimileReviewed: boolean;
  /**
   * Present only when the reviewed historical facsimile genuinely contains no
   * separately enumerated legal claims. It prevents the catalogue from
   * inventing claims merely to satisfy a modern data shape.
   */
  claimStatus?: {
    kind: "no-formal-claims-in-facsimile";
    /** Precise source-facing evidence of the absence. */
    evidence: string;
  };
  /**
   * Present only when the reviewed historical facsimile genuinely contains no
   * drawing sheets. It prevents the catalogue from flagging historical text-only grants.
   */
  drawingStatus?: {
    kind: "no-drawings-in-facsimile";
    /** Precise source-facing evidence of the absence. */
    evidence: string;
  };
  /** The ordered authored content of the continuous reading edition. */
  blocks: CuratedSpecificationBlock[];
}

export type OriginalTextAssetKind = "reviewed-transcription" | "source-pdf-text-layer";

/**
 * A literal, page-specific check made while visually reviewing a facsimile.
 *
 * The anchor is deliberately editorial evidence, not a value generated from
 * OCR or a PDF text layer. It makes a shifted ledger detectable: the exact
 * printed phrase must occur under the reviewed ledger marker for the same PDF
 * page, while `sourceRelationship` records what that page actually is.
 */
export type ReviewedTranscriptionPageAnchor =
  | {
      /** One-based PDF page number, including drawing sheets and certificates. */
      page: number;
      /** Exact printed header or distinctive source phrase seen on that page. */
      exactSourceText: string;
      /** Human-authored description such as “printed drawing sheet 1 of 2”. */
      sourceRelationship: string;
      /** Omitted for a facsimile page with printed content. */
      isBlank?: false;
    }
  | {
      /** One-based PDF page number that was visually verified as blank. */
      page: number;
      /** No printed phrase exists to anchor a truly blank facsimile page. */
      isBlank: true;
      /** Human-authored evidence that the scanned page has no printed content. */
      sourceRelationship: string;
      /** A blank page must not be made to look like it contains source text. */
      exactSourceText?: never;
    };

export interface OriginalTextAsset {
  /** Public, cleaned transcription of every page in the source facsimile. */
  url: string;
  /** Source-page count, including drawing sheets and post-grant records. */
  pageCount: number;
  /**
   * Provenance of the public text. Absent only on legacy records; legacy assets
   * are intentionally not treated as complete by the reader.
   */
  kind?: OriginalTextAssetKind;
  /**
   * Required for a reviewed transcription. They make the human, date, and
   * exact source PDF accountable rather than inferring review from a filename.
   */
  reviewedBy?: string;
  reviewedAt?: string;
  sourcePdfSha256?: string;
  /**
   * Optional until this legacy catalogue is migrated page by page. Once an
   * edition declares anchors, the verification gate requires one for every
   * source page and rejects any ledger-page mismatch.
   */
  pageAnchors?: readonly ReviewedTranscriptionPageAnchor[];
}

export interface Patent {
  id: string;
  patentNumber: string; // e.g. "US 821,393"
  title: string;
  shortTitle: string;
  subtitle: string;
  inventors: string[];
  inventorLocation: string;
  grantDate: string; // "YYYY-MM-DD"
  /** `null` only when the reviewed primary record does not document a filing date. */
  filingDate: string | null; // "YYYY-MM-DD"
  era: string; // "Early Aviation (1900-1910)"
  category: PatentCategory;
  categoryLabel: string;
  summary: string;
  heroQuote: string;
  originalPdfUrl: string;
  googlePatentsUrl: string;
  usptoClassification: string;
  originalText: string;
  /** Complete source text loaded only when a reader opens the archival face. */
  originalTextAsset?: OriginalTextAsset;
  /**
   * Optional until this patent is manually prepared. When present, this is the
   * sole public source for the complete archival specification face.
   */
  archivalEdition?: CuratedSpecificationEdition;
  plainEnglishExplanation: PlainEnglishExplanation;
  claims: PatentClaim[];
  drawings: PatentDrawing[];
  historicalContext: HistoricalContext;
  tags?: string[];
  stats?: {
    totalClaims: number;
    independentClaims: number;
    patentWarYears?: string;
    impactScore?: number; // 1-100
  };
}
