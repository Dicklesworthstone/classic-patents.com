// One-off audit: verify every params.X referenced in claimLiveState branches
// exists (as a registry control id, an alias key, or an alias canonical
// target) for every registry patent matching the branch's id fragment.
import * as fs from "node:fs";

const regSrc = fs.readFileSync("src/physics/telemetryData.ts", "utf8");
const aliasSrc = fs.readFileSync("src/physics/paramAliases.ts", "utf8");
const decSrc = fs.readFileSync("src/components/patents/ClaimsDecoder.tsx", "utf8");

const regIds = [...regSrc.matchAll(/"(us-[a-z0-9-]+)":\s*\{/g)].map((m) => m[1]);

function controlIdsFor(patentId: string): Set<string> | null {
  const key = `"${patentId}"`;
  const idx = regSrc.indexOf(key);
  if (idx === -1) return null;
  let i = regSrc.indexOf("{", idx);
  const start = i;
  let depth = 0;
  for (; i < regSrc.length; i++) {
    if (regSrc[i] === "{") depth++;
    else if (regSrc[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const block = regSrc.slice(start, i);
  return new Set([...block.matchAll(/\bid:\s*"([^"]+)"/g)].map((m2) => m2[1]));
}

const aliasesByPatent: Record<string, Record<string, string>> = {};
for (const m of aliasSrc.matchAll(/"(us-[a-z0-9-]+)":\s*\{([\s\S]*?)\n {2}\}/g)) {
  const pid = m[1];
  const map: Record<string, string> = {};
  for (const a of m[2].matchAll(
    /([a-zA-Z][a-zA-Z0-9]*):\s*(?:same\("([^"]+)"\)|canonical:\s*"([^"]+)")/g,
  )) {
    map[a[1]] = a[2] || a[3];
  }
  if (Object.keys(map).length > 0) aliasesByPatent[pid] = map;
}

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

const problems: unknown[] = [];
let checkedCount = 0;
for (const b of branches) {
  const pids = regIds.filter((id) => id.includes(b.frag));
  if (pids.length === 0) {
    problems.push({ frag: b.frag, issue: "no registry entry matches fragment", keys: b.keys });
    continue;
  }
  for (const pid of pids) {
    const ctrls = controlIdsFor(pid) || new Set<string>();
    const aliasMap = aliasesByPatent[pid] || {};
    const aliasKeys = new Set(Object.keys(aliasMap));
    const aliasTargets = new Set(Object.values(aliasMap));
    for (const k of b.keys) {
      checkedCount++;
      const ok = ctrls.has(k) || aliasKeys.has(k) || aliasTargets.has(k);
      if (!ok) {
        problems.push({
          frag: b.frag,
          pid,
          key: k,
          controls: [...ctrls],
          aliasTargets: [...aliasTargets],
        });
      }
    }
  }
}
console.log(
  JSON.stringify({ branches: branches.length, checked: checkedCount, problems }, null, 2),
);
