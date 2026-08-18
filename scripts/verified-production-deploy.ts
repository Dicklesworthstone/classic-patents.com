/**
 * The only supported production deploy entry point.
 *
 * It is intentionally fail-closed. In particular, it will not upload a stale
 * or partial `.vercel/output` directory, and it never moves either public
 * hostname until the freshly created prebuilt deployment answers the critical
 * museum routes correctly.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import { createServer } from "node:net";
import * as path from "node:path";
import { validateCuratedSpecificationEdition } from "../src/data/archivalEditionValidation";
import { wrightFlyerPatent } from "../src/data/patents/wright-flyer";

const DEPLOYMENT_LOCK_PORT = 45_267;
const PUBLIC_HOSTNAMES = ["classic-patents.com", "www.classic-patents.com"] as const;
const PLATFORM_HOSTNAME = "classic-patents.vercel.app";
const PROMOTION_HOSTNAMES = [...PUBLIC_HOSTNAMES, PLATFORM_HOSTNAME] as const;
const WRIGHT_ROUTE = "/patents/us-821393-wright-flyer";
const WRIGHT_ARCHIVAL_TEXT_LABEL = "Original Patent Text";
const WRIGHT_MANUAL_EDITION_MARKER = 'data-archival-edition="manual-react-edition"';
const PUBLICATION_CONTRACT_TESTS = [
  "src/data/editions/archivalEditionSemantics.test.ts",
  "src/components/patents/visuals/three/determinism.test.ts",
] as const;

type CommandResult = {
  stdout: string;
  stderr: string;
};

function run(
  command: string,
  args: string[],
  capture = false,
  printCapturedOutput = true,
): CommandResult {
  console.log(`\n$ ${[command, ...args].join(" ")}`);
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status ?? "unknown"}.`);
  }

  const stdout = result.stdout ?? "";
  const stderr = result.stderr ?? "";
  if (capture && printCapturedOutput) {
    process.stdout.write(stdout);
    process.stderr.write(stderr);
  }
  return { stdout, stderr };
}

function trackedWorkingTreeChanges(): string {
  const status = run(
    "git",
    ["status", "--porcelain=v1", "--untracked-files=all"],
    true,
    false,
  ).stdout;
  return status
    .split("\n")
    .filter((line) => line && !line.endsWith(" tsconfig.tsbuildinfo"))
    .join("\n");
}

function assertCleanTrackedWorkingTree(stage: string) {
  const changes = trackedWorkingTreeChanges();
  if (changes) {
    throw new Error(
      `${stage}: refusing to deploy from a shared worktree with uncommitted or untracked files:\n${changes}`,
    );
  }
}

function currentCommit(): string {
  return run("git", ["rev-parse", "--verify", "HEAD"], true, false).stdout.trim();
}

function assertCommitUnchanged(expectedCommit: string, stage: string) {
  const actualCommit = currentCommit();
  if (actualCommit !== expectedCommit) {
    throw new Error(
      `${stage}: HEAD changed during the release (${expectedCommit} -> ${actualCommit}); refusing to promote.`,
    );
  }
}

function conflictingBuilds(): string[] {
  const processList = run("ps", ["-Ao", "pid=,ppid=,etime=,command="], true, false).stdout;
  return processList
    .split("\n")
    .filter((line) =>
      /\b(?:next\s+(?:build|dev)|vercel\s+(?:build|deploy)|bun\s+(?:run\s+(?:build|dev)|scripts\/build\.ts))\b/.test(
        line,
      ),
    );
}

function assertNoConflictingBuilds(stage: string) {
  const conflicts = conflictingBuilds();
  if (conflicts.length > 0) {
    throw new Error(
      `${stage}: another Next process, build, or deployment is using shared artifacts. Wait for it to finish:\n${conflicts.join("\n")}`,
    );
  }
}

function countFiles(directory: string): number {
  return fs
    .readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile()).length;
}

function sha256(content: string | Buffer): string {
  return createHash("sha256").update(content).digest("hex");
}

function assertWrightManualEditionInWorkspace() {
  const edition = wrightFlyerPatent.archivalEdition;
  if (!edition) {
    throw new Error("Wright has no manually prepared archival edition; refusing release.");
  }

  const validation = validateCuratedSpecificationEdition(edition);
  if (!validation.valid) {
    throw new Error(
      `Wright manual edition failed its publication contract: ${validation.errors.join(" ")}`,
    );
  }

  const localPdfPath = path.join(
    process.cwd(),
    "public",
    wrightFlyerPatent.originalPdfUrl.replace(/^\//, ""),
  );
  if (!fs.existsSync(localPdfPath)) {
    throw new Error("Wright source PDF is missing; refusing release.");
  }
  if (sha256(fs.readFileSync(localPdfPath)) !== edition.sourcePdfSha256) {
    throw new Error("Wright manual edition is pinned to a different source PDF; refusing release.");
  }

  const claimNumbers = edition.blocks
    .filter((block) => block.kind === "claim")
    .map((block) => block.number);
  if (claimNumbers.length !== 18 || claimNumbers.some((number, index) => number !== index + 1)) {
    throw new Error("Wright manual edition does not contain the complete ordered claim set.");
  }
}

function assertCompletePrebuiltArtifact(buildStartedAtMs: number) {
  const outputDirectory = path.join(process.cwd(), ".vercel", "output");
  const configPath = path.join(outputDirectory, "config.json");
  const staticDirectory = path.join(outputDirectory, "static");
  if (!fs.existsSync(configPath)) {
    throw new Error("Vercel build did not create .vercel/output/config.json.");
  }
  if (!fs.existsSync(staticDirectory)) {
    throw new Error(
      "Vercel build produced no static output; refusing to deploy a partial artifact.",
    );
  }

  let config: { version?: unknown };
  try {
    config = JSON.parse(fs.readFileSync(configPath, "utf8")) as { version?: unknown };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Vercel output config is not valid JSON: ${detail}`);
  }
  if (config.version !== 3) {
    throw new Error("Vercel output config is not a version 3 Build Output API artifact.");
  }
  const configModifiedAtMs = fs.statSync(configPath).mtimeMs;
  if (configModifiedAtMs + 1_000 < buildStartedAtMs) {
    throw new Error(
      "Vercel output predates this release attempt; refusing to upload a stale prebuilt artifact.",
    );
  }

  const fileCount = countFiles(outputDirectory);
  if (fileCount < 100) {
    throw new Error(
      `Vercel output has only ${fileCount} files; a valid Classic Patents release has a full static site.`,
    );
  }

  assertWrightManualEditionInWorkspace();
  console.log(`Validated fresh Vercel artifact: ${fileCount} files.`);
}

function deploymentUrl(output: string): string {
  const urls = output.match(/https:\/\/[^\s"']+\.vercel\.app/g) ?? [];
  const url = urls.at(-1);
  if (!url) throw new Error("Vercel did not return a deployment URL.");
  return url.replace(/[),.]$/, "");
}

async function assertResponse(
  url: string,
  pathName: string,
  requiredText: string,
): Promise<string> {
  const response = await fetch(`${url}${pathName}`, { signal: AbortSignal.timeout(30_000) });
  const body = await response.text();
  if (!response.ok || !body.includes(requiredText)) {
    throw new Error(
      `Release check failed for ${url}${pathName}: HTTP ${response.status}; required content was not present.`,
    );
  }
  return body;
}

function assertProtectedPreviewResponse(
  deployment: string,
  pathName: string,
  requiredText: string,
): string {
  const marker = "__CLASSIC_PATENTS_HTTP_STATUS__";
  const response = run(
    "vercel",
    [
      "curl",
      "--deployment",
      deployment,
      pathName,
      "--",
      "--silent",
      "--show-error",
      "--write-out",
      `\n${marker}%{http_code}`,
    ],
    true,
    false,
  ).stdout;
  const statusIndex = response.lastIndexOf(marker);
  const status = Number.parseInt(response.slice(statusIndex + marker.length).trim(), 10);
  const body = response.slice(0, statusIndex);
  if (statusIndex < 0 || status < 200 || status >= 300 || !body.includes(requiredText)) {
    throw new Error(
      `Release check failed for protected preview ${deployment}${pathName}: HTTP ${status || "unknown"}; required content was not present.`,
    );
  }
  return body;
}

async function assertReleaseRoutes(url: string) {
  await assertResponse(url, WRIGHT_ROUTE, WRIGHT_ARCHIVAL_TEXT_LABEL);
  await assertResponse(url, WRIGHT_ROUTE, WRIGHT_MANUAL_EDITION_MARKER);
}

function assertProtectedPreviewRoutes(deployment: string) {
  assertProtectedPreviewResponse(deployment, WRIGHT_ROUTE, WRIGHT_ARCHIVAL_TEXT_LABEL);
  assertProtectedPreviewResponse(deployment, WRIGHT_ROUTE, WRIGHT_MANUAL_EDITION_MARKER);
}

async function acquireDeploymentLock() {
  const server = createServer();
  await new Promise<void>((resolve, reject) => {
    server.once("error", (error) => {
      if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
        reject(
          new Error(
            "A verified Classic Patents deployment is already running on this machine; wait for it to finish.",
          ),
        );
        return;
      }
      reject(error);
    });
    server.listen({ host: "127.0.0.1", port: DEPLOYMENT_LOCK_PORT, exclusive: true }, resolve);
  });
  return server;
}

async function main() {
  if (process.argv.includes("--help")) {
    console.log("Usage: bun scripts/verified-production-deploy.ts");
    return;
  }

  const lock = await acquireDeploymentLock();
  try {
    assertNoConflictingBuilds("Preflight");
    assertCleanTrackedWorkingTree("Preflight");
    const commit = currentCommit();

    run("bun", ["run", "pipeline:verify"]);
    // These tests express publication invariants which the TypeScript schema
    // cannot: every cited figure/section must resolve to authored source
    // material, and the reference visual must not derive published state from
    // wall-clock time or randomness. A green build without these contracts is
    // not sufficient evidence for a museum release.
    run("bun", ["test", ...PUBLICATION_CONTRACT_TESTS]);
    run("bun", ["run", "typecheck"]);
    run("bun", ["run", "lint"]);
    run("ubs", ["--diff"]);
    run("ubs", ["--staged"]);
    run("bun", ["run", "build"]);
    assertNoConflictingBuilds("After application build");
    assertCommitUnchanged(commit, "After application build");
    assertCleanTrackedWorkingTree("After application build");

    run("vercel", ["pull", "--yes"]);
    const vercelBuildStartedAtMs = Date.now();
    run("vercel", ["build", "--prod"]);
    assertNoConflictingBuilds("After Vercel build");
    assertCommitUnchanged(commit, "After Vercel build");
    assertCleanTrackedWorkingTree("After Vercel build");
    assertCompletePrebuiltArtifact(vercelBuildStartedAtMs);

    const deployment = run(
      "vercel",
      ["deploy", "--prebuilt", "--prod", "--skip-domain", "--json"],
      true,
    );
    const previewUrl = deploymentUrl(`${deployment.stdout}\n${deployment.stderr}`);
    assertProtectedPreviewRoutes(previewUrl);
    assertNoConflictingBuilds("Before promotion");
    assertCommitUnchanged(commit, "Before promotion");
    assertCleanTrackedWorkingTree("Before promotion");

    for (const hostname of PROMOTION_HOSTNAMES) {
      run("vercel", ["alias", "set", previewUrl, hostname]);
    }
    for (const hostname of PROMOTION_HOSTNAMES) {
      await assertReleaseRoutes(`https://${hostname}`);
    }
    console.log(
      `\nProduction release ${commit.slice(0, 12)} is live and verified at both public hostnames and the platform alias.`,
    );
  } finally {
    await new Promise<void>((resolve) => lock.close(() => resolve()));
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\nVerified production deployment refused: ${message}`);
  process.exitCode = 1;
});
