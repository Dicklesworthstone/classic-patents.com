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
