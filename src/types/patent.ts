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

export type OriginalTextAssetKind = "reviewed-transcription" | "source-pdf-text-layer";

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
  filingDate: string; // "YYYY-MM-DD"
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
