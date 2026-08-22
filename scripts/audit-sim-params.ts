// Site-wide sim param audit: every updateParam()/paramKey="..."/params.X in
// visual faces must resolve through the real physics bus (registry control
// or registered alias) for the patent that face serves.
import * as fs from "node:fs";
import { execSync } from "node:child_process";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import {
  canonicalizeParam,
  expandParamAliases,
} from "../src/physics/paramAliases";

const files = execSync(
  "find src/components/patents/visuals -name '*.tsx' -o -name '*.ts' | grep -v test | grep -v Model | grep -v index",
)
  .toString()
  .trim()
  .split("\n");

const regIds = Object.keys(PATENT_PHYSICS_REGISTRY).filter(
  (id) => !id.startsWith("_"),
);

function resolveRead(pid: string, key: string): boolean {
  const meta = PATENT_PHYSICS_REGISTRY[pid];
  if (!meta) return true;
  const base: Record<string, number> = {};
  for (const c of meta.controls) base[c.id] = c.defaultValue;
  return typeof expandParamAliases(pid, base)[key] === "number";
}

function resolveWrite(pid: string, key: string): boolean {
  const meta = PATENT_PHYSICS_REGISTRY[pid];
  if (!meta) return true;
  const { id } = canonicalizeParam(pid, key, 0);
  return meta.controls.some((c) => c.id === id);
}

const problems: Array<{
  file: string;
  pid: string;
  kind: string;
  key: string;
}> = [];
let checkedWrites = 0;
let checkedReads = 0;
// Faces whose unregistered keys are deliberate local state, with reasons.
// Anything here still round-trips through the bus correctly once touched;
// they simply have no registry counterpart to expose on the shared badge.
const LOCAL_STATE_OK = new Set<string>([
  // Facsimile source viewers persisting view focus on the bus:
  "us-1102653-goddard-rocket:sourceFocus",
  "us-6285999:noyceSourceFocus",
  "us-2981877-noyce-ic:sourceFocus",
  // 2D-sim-local knobs with no registry counterpart (badge intentionally
  // shows only the registry deck):
  "us-682690-hewitt-mercury-lamp:condenserCoolingLevel",
  "us-307031-edison-indicator:mainsVoltageV",
  "us-307031-edison-indicator:galvanometerTorsionNullV",
  "us-x9430-colt-revolver:rammerPosition",
  "us-4136359-wozniak-apple:phi2Steal",
  "us-942699-baekeland-bakelite:fillerPct",
  "us-942699-baekeland-bakelite:autoclaveTempC",
  "us-2495429-spencer-microwave:anodeVoltage",
  "us-2495429-spencer-microwave:magneticFieldGauss",
  "us-361931-daimler-engine:rollSpeedRpm",
  "us-157124-glidden-barbed-wire:barbSpacingInches",
  "us-7479949-multitouch:touchPressureGrams",
  "us-7479949-multitouch:gestureVelocityMmS",
  "us-6469-lincoln-buoy:riverShoalDepthFt",
  "us-586193-marconi-radio:sparkVoltageKv",
  "us-1647-morse-telegraph:lineVoltageV",
  "us-1647-morse-telegraph:lineResistance",
  // Working-by-design: bus stores the canonical id on first touch and both
  // faces share identical fallbacks.
  "us-6162-corliss-steam-engine:cutoffPct",
  "us-6162-corliss-steam-engine:cutoffRatioPct",
  "us-808897-carrier-air-conditioner:sprayRatePct",
  "us-808897-carrier-air-conditioner:separatorFaces",
]);

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const pids = new Set<string>();
  for (const m of src.matchAll(
    /usePatentPhysics\(\s*(?:WRIGHT_PATENT_ID|"([^"]+)")\s*\)/g,
  )) {
    pids.add(m[1] ?? "us-821393-wright-flyer");
  }
  for (const m of src.matchAll(/patentId="([^"]+)"/g)) pids.add(m[1]);
  for (const m of src.matchAll(/PATENT_PHYSICS_REGISTRY\["([^"]+)"\]/g))
    pids.add(m[1]);
  const pidList = [...pids].filter((p) => regIds.includes(p));
  if (pidList.length === 0) continue;

  for (const pid of pidList) {
    for (const m of src.matchAll(/updateParam\(\s*"([a-zA-Z0-9_]+)"/g)) {
      checkedWrites++;
      if (!resolveWrite(pid, m[1]) && !LOCAL_STATE_OK.has(`${pid}:${m[1]}`)) {
        problems.push({ file, pid, kind: "write", key: m[1] });
      }
    }
    for (const m of src.matchAll(/paramKey="([a-zA-Z0-9_]+)"/g)) {
      checkedWrites++;
      if (!resolveWrite(pid, m[1]) && !LOCAL_STATE_OK.has(`${pid}:${m[1]}`)) {
        problems.push({ file, pid, kind: "paramKey", key: m[1] });
      }
    }
    // Reads: only the conventional bus object name. Kernel-output objects
    // (const sim = stepX(params)) legitimately carry derived fields.
    for (const m of src.matchAll(/params\.([a-zA-Z][a-zA-Z0-9_]+)/g)) {
      checkedReads++;
      if (!resolveRead(pid, m[1]) && !LOCAL_STATE_OK.has(`${pid}:${m[1]}`)) {
        problems.push({ file, pid, kind: "read", key: m[1] });
      }
    }
  }
}

console.log(
  JSON.stringify(
    {
      files: files.length,
      checkedWrites,
      checkedReads,
      problemCount: problems.length,
      problems: problems.slice(0, 80),
    },
    null,
    2,
  ),
);
