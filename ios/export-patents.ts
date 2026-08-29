import { allPatents } from "../src/data/patents/index";

const exported = allPatents.map((patent) => ({
  id: patent.id,
  patentNumber: patent.patentNumber,
  title: patent.title,
  shortTitle: patent.shortTitle,
  subtitle: patent.subtitle,
  inventors: patent.inventors,
  inventorLocation: patent.inventorLocation,
  grantDate: patent.grantDate,
  filingDate: patent.filingDate,
  era: patent.era,
  category: patent.category,
  categoryLabel: patent.categoryLabel,
  summary: patent.summary,
  heroQuote: patent.heroQuote,
  originalPdfURL: `https://classic-patents.com${patent.originalPdfUrl}`,
  googlePatentsURL: patent.googlePatentsUrl,
  exhibitURL: `https://classic-patents.com/patents/${patent.id}`,
  usptoClassification: patent.usptoClassification,
  originalText: patent.originalText,
  plainEnglish: patent.plainEnglishExplanation,
  claims: patent.claims,
  drawings: patent.drawings.map((drawing) => ({
    figureNumber: drawing.figureNumber,
    title: drawing.title,
    caption: drawing.caption,
    calloutCount: drawing.callouts.length,
  })),
  history: patent.historicalContext,
  tags: patent.tags ?? [],
}));

const output = new URL("./Resources/patents.json", import.meta.url);
await Bun.write(output, `${JSON.stringify(exported, null, 2)}\n`);
console.log(`Exported ${exported.length} canonical patent records to ${output.pathname}`);

