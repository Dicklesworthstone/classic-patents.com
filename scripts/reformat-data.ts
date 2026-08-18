import * as fs from "node:fs";
import * as path from "node:path";
import { ESOTERIC_PATENT_GLOSSARY } from "../src/data/esotericPatentTerms.js";

const sourceDir = path.join(process.cwd(), "public", "patents", "source-text");
const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");

function formatTranscript(content: string): string {
  let text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // 1. Remove page markers completely
  text = text.replace(/---\s*SOURCE PDF PAGE \d+ OF \d+\s*---/gi, " ");

  // 2. Rejoin lines that were broken in the middle of a sentence.
  // We split by \n, then rejoin lines that don't end in punctuation or are clearly continued.
  let lines = text.split("\n");
  let newLines: string[] = [];
  let currentPara = "";
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) {
      if (currentPara) {
        newLines.push(currentPara);
        currentPara = "";
      }
      continue;
    }
    
    // Table detection heuristic: if a line has multiple multiple-spaces, it's probably tabular data
    if (line.match(/\s{4,}.*\s{4,}/)) {
      if (currentPara) {
        newLines.push(currentPara);
        currentPara = "";
      }
      newLines.push("<pre class=\"font-mono text-sm whitespace-pre overflow-x-auto p-4 bg-ink-900/10 dark:bg-parchment-100/10 rounded-lg\">" + lines[i] + "</pre>"); // keep original spacing
      continue;
    }

    if (!currentPara) {
      currentPara = line;
    } else {
      if (currentPara.endsWith("-")) {
        currentPara = currentPara.slice(0, -1) + line;
      } else {
        currentPara += " " + line;
      }
    }
  }
  if (currentPara) newLines.push(currentPara);

  // 3. Separate UNITED STATES PATENT OFFICE banner
  text = newLines.join("\n\n");
  text = text.replace(/(UNITED STATES PATENT OFFICE\.)\s*([A-Z])/i, "$1\n\n$2");

  // 4. Separate Preamble
  text = text.replace(/([^\n])\s*(To all whom it may concern:?)\s*([^\n])/i, "$1\n\n$2\n\n$3");
  text = text.replace(/^(To all whom it may concern:?)\s*([^\n])/im, "$1\n\n$2");

  // 5. Separate inline numbered claims
  text = text.replace(/(\s)([0-9]+\.\s+[A-Z])/g, "$1\n\n$2");

  // 6. Split excessively long paragraphs
  const paragraphs = text.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  const balancedParagraphs: string[] = [];
  
  for (const para of paragraphs) {
    if (para.startsWith("<pre")) {
      balancedParagraphs.push(para);
      continue;
    }
    if (para.length < 800 || /^\d+\.\s/.test(para) || para === para.toUpperCase()) {
      balancedParagraphs.push(para);
      continue;
    }

    const sentences = para.match(/[^.!?]+[.!?]+(?:["'”’)]+)?|[^.!?]+$/g) || [para];
    let currentChunk = "";
    for (const sent of sentences) {
      const trimmed = sent.trim();
      if (!trimmed) continue;
      if (currentChunk.length + trimmed.length > 700 && currentChunk.length > 300) {
        balancedParagraphs.push(currentChunk.trim());
        currentChunk = `${trimmed} `;
      } else {
        currentChunk += `${trimmed} `;
      }
    }
    if (currentChunk.trim()) {
      balancedParagraphs.push(currentChunk.trim());
    }
  }

  // 7. Inject Hover Definitions
  let finalText = balancedParagraphs.join("\n\n");
  
  // Sort terms by length descending to avoid partial matches
  const terms = Object.entries(ESOTERIC_PATENT_GLOSSARY).sort((a, b) => b[0].length - a[0].length);
  for (const [termKey, def] of terms) {
    const escapedTerm = termKey.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b(${escapedTerm})\\b`, "gi");
    
    finalText = finalText.replace(regex, (match) => {
      // Don't replace if it's already inside an HTML tag
      return `<dfn title="${def.historicalDefinition} (Modern: ${def.modernEquivalent})" class="cursor-help underline decoration-dotted decoration-amber-600 dark:decoration-amber-400 decoration-2 underline-offset-4 text-ink-950 dark:text-parchment-50 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 rounded px-0.5 transition-colors">${match}</dfn>`;
    });
  }

  return finalText + "\n";
}

function main() {
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".txt"));
  console.log(`Processing ${files.length} source text files...`);

  if (!fs.existsSync(transcriptsDir)) {
    fs.mkdirSync(transcriptsDir, { recursive: true });
  }

  let modifiedCount = 0;
  for (const file of files) {
    const filePath = path.join(sourceDir, file);
    const original = fs.readFileSync(filePath, "utf8");
    const formatted = formatTranscript(original);

    const outPath = path.join(transcriptsDir, file);
    fs.writeFileSync(outPath, formatted, "utf8");
    console.log(`✓ Formatted ${file} to ${formatted.length} bytes`);
    modifiedCount++;
  }

  console.log(`\nReformatting complete. ${modifiedCount} transcript files generated.`);
}

main();
