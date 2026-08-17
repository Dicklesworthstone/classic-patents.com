# AGENTS.md — Classic Patents

Guidelines for AI coding agents working in this repository.

---

## RULE 0 — THE FUNDAMENTAL OVERRIDE PREROGATIVE

If I tell you to do something, even if it goes against what follows below, YOU MUST LISTEN TO ME. I AM IN CHARGE, NOT YOU.

---

## RULE NUMBER 1: NO FILE DELETION

**YOU ARE NEVER ALLOWED TO DELETE A FILE WITHOUT EXPRESS PERMISSION.** Even a new file that you yourself created, such as a test code file. You have a horrible track record of deleting critically important files or otherwise throwing away tons of expensive work. As a result, you have permanently lost any and all rights to determine that a file or folder should be deleted.

**YOU MUST ALWAYS ASK AND RECEIVE CLEAR, WRITTEN PERMISSION BEFORE EVER DELETING A FILE OR FOLDER OF ANY KIND.**

---

## Irreversible Git & Filesystem Actions — DO NOT EVER BREAK GLASS

1. **Absolutely forbidden commands:** `git reset --hard`, `git clean -fd`, `rm -rf`, or any command that can delete or overwrite code/data must never be run unless the user explicitly provides the exact command and states, in the same message, that they understand and want the irreversible consequences.
2. **No guessing:** If there is any uncertainty about what a command might delete or overwrite, stop immediately and ask the user for specific approval. "I think it's safe" is never acceptable.
3. **Safer alternatives first:** When cleanup or rollbacks are needed, request permission to use non-destructive options (`git status`, `git diff`, `git stash`, copying to backups) before ever considering a destructive command.
4. **Mandatory explicit plan:** Even after explicit user authorization, restate the command verbatim, list exactly what will be affected, and wait for a confirmation that your understanding is correct. Only then may you execute it.
5. **Document the confirmation:** When running any approved destructive command, record (in the session notes / final response) the exact user text that authorized it, the command actually run, and the execution time.

---

## Branch Policy

- Primary branch is `main`.
- Work happens on `main`. Do not create feature branches unless the user explicitly asks for one.
- Do not reference `master` in docs or scripts.

---

## Project Mission

**Classic Patents** (`classic-patents.com`) is a digital museum, educational instrument, and open-source archive dedicated to the most consequential technical patents in human history.

The project solves a major historical and educational deficit: original patents represent humanity's greatest technical leaps, yet they are trapped in degraded scanned PDFs and impenetrable 19th/20th-century legal prose. Classic Patents extracts them with ultra-high fidelity OCR (`focr`), transcribes the full specifications and claims, reconstructs original diagrams into modern interactive SVG/Canvas simulations, and provides a synchronous **"Plain English" engineering breakdown** that explains the genuine physics, mechanics, and chemistry without dumbing anything down.

The single source of truth is [`COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md`](./COMPREHENSIVE_PLAN_FOR_CLASSIC_PATENTS.md). Read it before modifying schemas, adding new patent entries, or restructuring visual components.

---

## Product Shape & Tech Stack

The web application is built with:

1. **Web Frontend**: Next.js 15 (App Router, React 19, TypeScript).
2. **Styling & Aesthetics**: Tailwind CSS with custom thematic extensions (Parchment vintage archival mode, Blueprint dark engineering mode, High-contrast clean mode). Google Fonts (Playfair Display, EB Garamond, Inter, JetBrains Mono).
3. **Interactive Visual Engine**: React-driven SVG/Canvas interactive modules illustrating the physical principles of each patent (3-axis wing warping flight simulator, Tesla polyphase AC rotating magnetic field, Edison carbon filament vacuum circuit, Bell variable-resistance telephone, Farnsworth electron dissector raster, Noyce planar integrated circuit, Spencer microwave cavity magnetron, Kwolek liquid-crystal aramid polymer chains).
4. **Data & Pipeline**: TypeScript data schemas (`src/data/patents/`), automated downloading (`scripts/download-patents.ts`), and OCR extraction scripts integrating `focr` (`scripts/ocr-patents.ts`).
5. **Hosting & Deployment**: Vercel (CLI-managed, prebuilt deploy workflow, zero build credit burn).
6. **Code Quality**: Biome (`biome check`, `biome format --write`), TypeScript (`tsc --noEmit`), UBS (`ubs --diff`, `ubs --staged`).

---

## The Classic Patents Engineering Doctrine

1. **Dual-Projection Parity (Diptych)**: Every patent page has two synchronized projections:
   - **Original Specification Face**: Exact historical text, claims, formal legal preamble, and digitized facsimile drawings.
   - **Plain English Engineering Face**: Lucid, rigorous, step-by-step mechanical/electrical/chemical breakdown, annotated claim decoders, historical context, and patent dispute analysis.
2. **Never Dumb Down**: Plain English does not mean childish oversimplification. Explain the exact equations, aerodynamics, vector math, vacuum physics, and semiconductor chemistry in intuitive, elegant terms.
3. **Interactive Visuals are Pedagogical Instruments**: Visuals are not decorative stock art. Every diagram must illustrate real mechanics (e.g. dragging the rudder adjusts aerodynamic yaw while wing warping twists the wing tips).
4. **Data Integrity & Determinism**: All patent transcripts are validated against typed Zod/TypeScript schemas. No phantom claims or hallucinated patent dates.
5. **Aesthetics & Typography**: Museum-quality presentation. Pristine typography, balanced whitespace, beautiful dark/parchment/blueprint themes, and responsive design down to 320px mobile screens.

---

## Vercel Deployment Standards

Vercel CLI is installed and authenticated as `dicklesworthstone`.

```bash
# Pull settings + env
vercel pull --yes

# Build locally (saves Vercel build credits)
vercel build --prod

# Deploy prebuilt artifact
vercel deploy --prebuilt --prod
```

**Rule**: Always use the `--prebuilt` workflow to avoid burning cloud build minutes. `vercel.json` has `{"git": {"deploymentEnabled": false}}`.

---

## Beads Issue Tracking

Use `br` (beads_rust) for task tracking and backlog management. **`br` never runs git.** After changes, sync and stage manually.

```bash
br ready
br list --status=open
br show <id>
br create --title="..." --type=task|bug|feature|epic --priority=2
br update <id> --status=in_progress
br close <id> [--reason "..."]
br dep add <issue> <depends-on>
br sync --flush-only
git add .beads/
```

---

## MCP Agent Mail — Multi-Agent Coordination

In multi-agent sessions:
- Register agent: `ensure_project` → `register_agent`
- Reserve paths before editing: `file_reservation_paths(..., exclusive=true, reason="br-###")`
- Thread communication via `macro_start_session`, `macro_prepare_thread`
- Never revert or clobber unrecognized working tree changes from peer agents.

---

## Code Quality & Verification

After substantial code changes:

```bash
# Typecheck
bun run typecheck

# Lint & Format
bun run lint
bun run format

# Build verification
bun run build

# Bug scanner
ubs --diff
ubs --staged
```

---

## Session Completion ("Landing the Plane")

Before finishing a work session, you MUST:
1. Ensure all TypeScript types pass (`bun run typecheck`).
2. Verify Next.js production build succeeds (`bun run build`).
3. Run Biome lint & format (`bun run lint`).
4. Update beads (`br sync --flush-only` and `git add .beads/`).
5. Summarize changes, verification results, and next actions.
