/** Emits the deterministic, server-only archival remediation inventory as JSON. */

import { buildArchivalAuditInventory } from "../src/data/editions/archivalAuditInventory.server";
import { allPatents } from "../src/data/patents";

process.stdout.write(`${JSON.stringify(buildArchivalAuditInventory(allPatents), null, 2)}\n`);
