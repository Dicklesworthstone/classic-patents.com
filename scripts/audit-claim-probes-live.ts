// Definitive probe audit: import the REAL modules and verify every
// claimLiveState param key resolves through the live bus for its patent.

import * as fs from "node:fs";
import { expandParamAliases, PATENT_PARAM_ALIASES } from "../src/physics/paramAliases";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

const decSrc = fs.readFileSync("src/components/patents/ClaimsDecoder.tsx", "utf8");
const fnStart = decSrc.indexOf("export function claimLiveState");
const fnBody = decSrc.slice(fnStart);
const marker = 'patentId.includes("';
const branches: Array<{ frag: string; keys: string[] }> = [];
let cursor = fnBody.indexOf(marker);
while (cursor !== -1) {
  const openQuote = cursor + marker.length;
  const closeQuote = fnBody.indexOf('"', openQuote);
  const frag = fnBody.slice(openQuote, closeQuote);
  const nextIf = fnBody.indexOf("\n  if (", cursor + 10);
  const body = fnBody.slice(cursor, nextIf === -1 ? cursor + 500 : nextIf);
  const keys = [...body.matchAll(/params\.([a-zA-Z0-9_]+)/g)].map((k) => k[1]);
  branches.push({ frag, keys: [...new Set(keys)] });
  cursor = fnBody.indexOf(marker, cursor + marker.length);
}

const regIds = Object.keys(PATENT_PHYSICS_REGISTRY).filter((id) => !id.startsWith("_"));
const problems: unknown[] = [];
for (const b of branches) {
  const pids = regIds.filter((id) => id.includes(b.frag));
  if (pids.length === 0) {
    problems.push({ frag: b.frag, issue: "no registry id matches", keys: b.keys });
    continue;
  }
  for (const pid of pids) {
    const meta = PATENT_PHYSICS_REGISTRY[pid];
    const base: Record<string, number> = {};
    for (const c of meta.controls) base[c.id] = c.defaultValue;
    const expanded = expandParamAliases(pid, base);
    for (const k of b.keys) {
      if (typeof expanded[k] !== "number") {
        problems.push({ frag: b.frag, pid, key: k });
      }
    }
  }
}
// Alias map sanity: every alias target must be a registered control.
for (const [pid, map] of Object.entries(PATENT_PARAM_ALIASES)) {
  const meta = PATENT_PHYSICS_REGISTRY[pid];
  if (!meta) {
    problems.push({ aliasEntry: pid, issue: "no registry entry for alias patent" });
    continue;
  }
  const ctrlIds = new Set(meta.controls.map((c) => c.id));
  for (const spec of Object.values(map)) {
    if (!ctrlIds.has(spec.canonical)) {
      problems.push({
        aliasEntry: pid,
        canonical: spec.canonical,
        issue: "canonical is not a control",
      });
    }
  }
}
console.log(
  JSON.stringify({ branches: branches.length, registryPatents: regIds.length, problems }, null, 2),
);
