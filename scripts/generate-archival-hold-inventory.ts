#!/usr/bin/env bun
/**
 * scripts/generate-archival-hold-inventory.ts
 *
 * Generates the deterministic internal archival hold inventory and remediation report.
 * Usage:
 *   bun scripts/generate-archival-hold-inventory.ts [--write] [--json]
 */

import * as fs from "node:fs";
import * as path from "node:path";
import {
  formatArchivalHoldInventoryMarkdown,
  generateArchivalHoldInventory,
} from "../src/data/editions/archivalHoldInventory";

function main() {
  const isJson = process.argv.includes("--json");
  const shouldWrite = process.argv.includes("--write");

  const report = generateArchivalHoldInventory();

  if (isJson) {
    const jsonText = JSON.stringify(report, null, 2);
    if (shouldWrite) {
      const outPath = path.join(process.cwd(), "artifacts", "archival-hold-inventory.json");
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, jsonText, "utf8");
      console.log(`Wrote JSON report to ${outPath}`);
    } else {
      console.log(jsonText);
    }
    return;
  }

  const markdown = formatArchivalHoldInventoryMarkdown(report);
  if (shouldWrite) {
    const outPath = path.join(process.cwd(), "artifacts", "archival-hold-inventory.md");
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, markdown, "utf8");
    console.log(`Wrote markdown inventory to ${outPath}`);
  } else {
    console.log(markdown);
  }
}

main();
