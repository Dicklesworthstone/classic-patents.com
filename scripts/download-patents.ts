/**
 * download-patents.ts
 *
 * Automated utility to fetch historical patent PDFs and metadata from Google Patents & USPTO archives.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

async function main() {
  console.log("=== Classic Patents Download Pipeline ===");
  console.log(`Processing ${allPatents.length} curated historical patents...\n`);

  const outputDir = path.join(process.cwd(), "artifacts", "raw_pdfs");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const patent of allPatents) {
    console.log(`[${patent.patentNumber}] ${patent.shortTitle}`);
    console.log(`  Inventors: ${patent.inventors.join(", ")}`);
    console.log(`  Grant Date: ${patent.grantDate}`);
    console.log(`  PDF Source: ${patent.originalPdfUrl}`);

    const targetFile = path.join(outputDir, `${patent.id}.pdf`);
    if (fs.existsSync(targetFile)) {
      console.log(`  ✓ PDF already cached locally: ${targetFile}\n`);
      continue;
    }

    try {
      console.log(`  Downloading PDF from ${patent.originalPdfUrl}...`);
      const response = await fetch(patent.originalPdfUrl);
      if (!response.ok) {
        console.warn(`  ⚠ Remote fetch returned status ${response.status}. Skipping download.`);
        continue;
      }
      const buffer = await response.arrayBuffer();
      fs.writeFileSync(targetFile, Buffer.from(buffer));
      console.log(`  ✓ Downloaded ${buffer.byteLength} bytes -> ${targetFile}\n`);
    } catch (err: any) {
      console.warn(`  ⚠ Could not download PDF: ${err.message}\n`);
    }
  }

  console.log("=== Download Pipeline Run Finished ===");
}

main().catch((err) => {
  console.error("Pipeline failed:", err);
  process.exit(1);
});
