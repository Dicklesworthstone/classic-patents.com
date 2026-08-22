// One-off: bind authored archival editions to the EXPORTED patent record of
// patents whose editions sit in non-exported research objects. Idempotent.
import * as fs from "node:fs";

const BINDINGS: Array<{ pid: string; editionPath: string }> = [
  { pid: "us-313224-mergenthaler-linotype", editionPath: "mergenthalerLinotypeEdition" },
  { pid: "us-400766-hall-aluminium", editionPath: "hallAluminiumEdition" },
  { pid: "us-2297691-carlson-electrophotography", editionPath: "carlsonElectrophotographyEdition" },
  { pid: "us-3138743-kilby-integrated-circuit", editionPath: "kilbyIntegratedCircuitEdition" },
];

function patentFile(pid: string): string {
  const suffix = pid.replace(/^(us|gb)-[0-9x]+[0-9a-z]*-/, "");
  return `src/data/patents/${suffix}.ts`;
}

function editionExportName(edFile: string): string | null {
  const src = fs.readFileSync(edFile, "utf8");
  // Prefer an export whose initializer is the manual-react-edition object.
  for (const m of src.matchAll(/export const ([a-zA-Z0-9]+)[^=]*= \{\s*kind: "manual-react-edition"/g)) {
    return m[1];
  }
  const fallback = /export const ([a-zA-Z0-9]*ArchivalEdition)\s*[=:]/.exec(src);
  return fallback ? fallback[1] : null;
}

const results: string[] = [];
for (const { pid, editionPath } of BINDINGS) {
  const hit = patentFile(pid);
  if (!fs.existsSync(hit)) {
    results.push(`SKIP ${pid}: no file ${hit}`);
    continue;
  }
  let src = fs.readFileSync(hit, "utf8");
  const edFile = `src/data/editions/${editionPath}.ts`;
  const exportName = editionExportName(edFile);
  if (!exportName) {
    results.push(`FAIL ${pid}: no edition export in ${edFile}`);
    continue;
  }
  const importLine = `import { ${exportName} } from "../editions/${editionPath}";`;

  // Locate the exported Patent record (not research/legacy objects).
  const exportRe = /export const [a-zA-Z0-9]+Patent: Patent = \{/;
  const em = exportRe.exec(src);
  if (!em) {
    results.push(`FAIL ${pid}: no exported Patent record`);
    continue;
  }
  const after = src.slice(em.index);
  if (/archivalEdition\s*:/.test(after)) {
    results.push(`SKIP ${pid}: exported record already bound`);
    continue;
  }

  // Ensure the edition import exists (merge into an existing import from the
  // same edition module when present, otherwise append a new import).
  const moduleSpecifier = `../editions/${editionPath}`;
  if (!src.includes(importLine)) {
    const sameMod = new RegExp(
      `import \\{([^}]*)\\} from "${moduleSpecifier}";`,
    ).exec(src);
    if (sameMod) {
      src = src.replace(
        sameMod[0],
        `import {${sameMod[1].replace(/\s*$/, "")}, ${exportName} } from "${moduleSpecifier}";`,
      );
    } else {
      const firstImport = /(^import [^\n]*;\s*\n)/m.exec(src);
      const at = firstImport ? firstImport.index + firstImport[1].length : 0;
      src = `${src.slice(0, at)}${importLine}\n${src.slice(at)}`;
    }
  }

  // Insert the field right after googlePatentsUrl INSIDE the exported record.
  const tail = src.slice(em.index);
  const anchorPattern = /(^[ \t]*googlePatentsUrl: .*$)/m;
  if (!anchorPattern.test(tail)) {
    results.push(`FAIL ${pid}: no anchor inside exported record`);
    continue;
  }
  const anchoredTail = tail.replace(anchorPattern, `$1\n  archivalEdition: ${exportName},`);
  src = src.slice(0, em.index) + anchoredTail;
  fs.writeFileSync(hit, src);
  results.push(`BOUND ${pid} -> ${exportName} (${hit})`);
}
console.log(results.join("\n"));
