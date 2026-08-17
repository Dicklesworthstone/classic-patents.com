import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { allPatents } from "../src/data/patents";

const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");
if (!fs.existsSync(transcriptsDir)) {
  fs.mkdirSync(transcriptsDir, { recursive: true });
}

for (const patent of allPatents) {
  const txtPath = path.join(transcriptsDir, `${patent.id}.txt`);
  if (!fs.existsSync(txtPath) || fs.statSync(txtPath).size === 0) {
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", `${patent.id}.pdf`);
    let text = "";
    if (fs.existsSync(pdfPath)) {
      try {
        text = execSync(`pdftotext "${pdfPath}" -`, { encoding: "utf-8" }).trim();
      } catch {
        text = "";
      }
    }

    if (!text || text.length < 50) {
      // Fall back to originalText from canonical record
      text = `UNITED STATES PATENT OFFICE\n\n${patent.title.toUpperCase()}\nPatent Number: ${patent.patentNumber}\nGrant Date: ${patent.grantDate}\nInventors: ${patent.inventors.join(", ")}\n\nSPECIFICATION\n\n${patent.originalText}\n\nCLAIMS\n\n${patent.claims.map((c) => `Claim ${c.number}. ${c.originalText}`).join("\n\n")}`;
    }

    fs.writeFileSync(txtPath, text, "utf-8");
    console.log(`Generated transcript for ${patent.id} (${text.length} chars)`);
  }
}
