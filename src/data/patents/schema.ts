import { z } from "zod";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import type { Patent } from "@/types/patent";

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "expected YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "invalid calendar date");

const patentClaimSchema = z.object({
  number: z.number().int().positive(),
  isIndependent: z.boolean(),
  dependsOn: z.array(z.number().int().positive()).optional(),
  originalText: z.string().min(1),
  plainEnglish: z.string().min(1),
  keyInnovations: z.array(z.string().min(1)).min(1),
  legalSignificance: z.string().min(1).optional(),
});

const drawingCalloutSchema = z.object({
  id: z.string().min(1),
  figureRef: z.string().min(1),
  label: z.string().min(1),
  element: z.string().min(1),
  description: z.string().min(1),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

const patentDrawingSchema = z.object({
  figureNumber: z.string().min(1),
  title: z.string().min(1),
  caption: z.string().min(1),
  svgType: z.string().min(1),
  callouts: z.array(drawingCalloutSchema),
});

const patentWarSchema = z.object({
  rivalName: z.string().min(1),
  rivalClaim: z.string().min(1),
  conflictDetails: z.string().min(1),
  resolution: z.string().min(1),
  legalOutcome: z.string().min(1),
});

const historicalContextSchema = z.object({
  problemStatement: z.string().min(1),
  priorArtLimitations: z.array(z.string().min(1)).min(1),
  breakthroughInsight: z.string().min(1),
  patentWars: z.array(patentWarSchema),
  civilizationalImpact: z.string().min(1),
  funFact: z.string().min(1).optional(),
  aftermath: z.string().min(1).optional(),
  sideNotes: z.array(z.string().min(1)).optional(),
});

const mechanicalBreakdownSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  technicalDetails: z.string().min(1),
  archaicTerm: z.string().min(1).optional(),
  modernEquivalent: z.string().min(1).optional(),
});

const scientificPrincipleSchema = z.object({
  principle: z.string().min(1),
  formula: z.string().min(1).optional(),
  explanation: z.string().min(1),
});

const plainEnglishSchema = z.object({
  overview: z.string().min(1),
  coreMechanism: z.string().min(1),
  mechanicalBreakdown: z.array(mechanicalBreakdownSchema).min(1),
  scientificPrinciples: z.array(scientificPrincipleSchema),
  whyItMattersToday: z.string().min(1),
});

const originalTextAssetSchema = z.object({
  url: z.string().startsWith("/patents/"),
  pageCount: z.number().int().positive(),
  kind: z.enum(["reviewed-transcription", "source-pdf-text-layer"]).optional(),
  reviewedBy: z.string().min(1).optional(),
  reviewedAt: isoDate.optional(),
  sourcePdfSha256: z
    .string()
    .regex(/^[a-f0-9]{64}$/, "expected a SHA-256 hex digest")
    .optional(),
});

const curatedSpecificationInlineSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text: z.string().min(1) }),
  z.object({
    kind: z.literal("term"),
    text: z.string().min(1),
    definition: z.string().min(1),
    label: z.string().min(1).optional(),
  }),
  z.object({ kind: z.literal("emphasis"), text: z.string().min(1) }),
  z.object({ kind: z.literal("small-caps"), text: z.string().min(1) }),
]);

const curatedSpecificationInlinesSchema = z.array(curatedSpecificationInlineSchema).min(1);

const curatedSpecificationBlockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("masthead"), lines: z.array(z.string().min(1)).min(1) }),
  z.object({
    kind: z.literal("heading"),
    level: z.union([z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.object({ kind: z.literal("paragraph"), inlines: curatedSpecificationInlinesSchema }),
  z.object({
    kind: z.literal("claim"),
    number: z.number().int().positive(),
    inlines: curatedSpecificationInlinesSchema,
  }),
  z.object({
    kind: z.literal("figure-sheet"),
    figureLabel: z.string().min(1),
    title: z.string().min(1).optional(),
    description: curatedSpecificationInlinesSchema,
  }),
  z.object({
    kind: z.literal("table"),
    caption: z.string().min(1).optional(),
    headers: z.array(curatedSpecificationInlinesSchema).min(1),
    rows: z.array(z.array(curatedSpecificationInlinesSchema).min(1)).min(1),
  }),
  z.object({
    kind: z.literal("equation"),
    text: z.string().min(1),
    description: z.string().min(1).optional(),
  }),
]);

const curatedSpecificationEditionSchema = z.object({
  kind: z.literal("manual-react-edition"),
  sourcePdfSha256: z.string().regex(/^[a-f0-9]{64}$/, "expected a SHA-256 hex digest"),
  preparedBy: z.string().min(1),
  preparedAt: isoDate,
  completeFacsimileReviewed: z.literal(true),
  blocks: z.array(curatedSpecificationBlockSchema).min(1),
});

export const patentSchema: z.ZodType<Patent> = z.object({
  id: z.string().min(1),
  patentNumber: z.string().min(1),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  subtitle: z.string().min(1),
  inventors: z.array(z.string().min(1)).min(1),
  inventorLocation: z.string().min(1),
  grantDate: isoDate,
  filingDate: isoDate,
  era: z.string().min(1),
  category: z.enum([
    "aviation",
    "aerospace",
    "electricity",
    "telecom",
    "computing",
    "consumer",
    "materials",
    "optics",
  ]),
  categoryLabel: z.string().min(1),
  summary: z.string().min(1),
  heroQuote: z.string().min(1),
  originalPdfUrl: z.string().min(1),
  googlePatentsUrl: z.url(),
  usptoClassification: z.string().min(1),
  originalText: z.string().min(1),
  originalTextAsset: originalTextAssetSchema.optional(),
  archivalEdition: curatedSpecificationEditionSchema.optional(),
  plainEnglishExplanation: plainEnglishSchema,
  claims: z.array(patentClaimSchema).min(1),
  drawings: z.array(patentDrawingSchema).min(1),
  historicalContext: historicalContextSchema,
  tags: z.array(z.string().min(1)).optional(),
  stats: z
    .object({
      totalClaims: z.number().int().nonnegative(),
      independentClaims: z.number().int().nonnegative(),
      patentWarYears: z.string().min(1).optional(),
      impactScore: z.number().min(1).max(100).optional(),
    })
    .optional(),
});

export function parsePatentCatalog(patents: unknown[]): Patent[] {
  return patents.map((entry, index) => {
    const parsed = patentSchema.safeParse(entry);
    if (!parsed.success) {
      const id =
        typeof entry === "object" && entry && "id" in entry
          ? String((entry as { id: unknown }).id)
          : `#${index}`;
      const issue = parsed.error.issues[0];
      const path = issue?.path.join(".") || "(root)";
      throw new Error(`Patent ${id} failed Zod check at ${path}: ${issue?.message ?? "invalid"}`);
    }
    if (parsed.data.filingDate > parsed.data.grantDate) {
      throw new Error(`Patent ${parsed.data.id}: filingDate is after grantDate`);
    }
    if (parsed.data.archivalEdition) {
      const editionValidation = validateCuratedSpecificationEdition(parsed.data.archivalEdition);
      if (!editionValidation.valid) {
        throw new Error(
          `Patent ${parsed.data.id}: invalid manual archival edition: ${editionValidation.errors.join(" ")}`,
        );
      }
    }
    return parsed.data;
  });
}
