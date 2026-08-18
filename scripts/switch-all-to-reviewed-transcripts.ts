/**
 * switch-all-to-reviewed-transcripts.ts
 *
 * Switches all patent records in src/data/patents/ to use the high-quality reviewed
 * transcripts in /patents/transcripts/ rather than the un-mangled source-text dumps.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const patentsDir = path.join(process.cwd(), "src", "data", "patents");

function main() {
  const files = fs
    .readdirSync(patentsDir)
    .filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "schema.ts");
  console.log(`Checking ${files.length} patent data files...`);

  let updatedCount = 0;
  for (const file of files) {
    const filePath = path.join(patentsDir, file);
    const content = fs.readFileSync(filePath, "utf8");

    // Replace /patents/source-text/ with /patents/transcripts/
    const newContent = content
      .replace(/url:\s*"\/patents\/source-text\/([^"]+)"/g, 'url: "/patents/transcripts/$1"')
      .replace(/kind:\s*"source-pdf-text-layer"/g, 'kind: "reviewed-transcription"');

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`✓ Updated ${file} -> reviewed-transcription`);
      updatedCount++;
    }
  }

  console.log(
    `\nComplete: ${updatedCount} patent data records switched to reviewed-transcription.`,
  );
}

main();
