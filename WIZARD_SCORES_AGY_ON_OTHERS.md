# WIZARD_SCORES_AGY_ON_OTHERS.md

## Cross-Scoring Analysis by AGY

As an independent evaluator, I have reviewed the finalists proposed by Claude Code (CC) and Codex (COD). Below is my structural analysis of their proposals, followed by rigorous 0-1000 scoring based on the dueling-idea-wizards rubric.

### 1. Duplicate & Overlapping Ideas
- **WebGL Simulation Refactoring:** CC's F3 (Rebuild scenes once) and COD's #5 (On-demand WebGL runtime) are fundamentally the same insight. Both correctly identify that React dependencies are forcing complete Three.js scene teardowns on every slider tick. COD's version is slightly superior because it explicitly adds `next/dynamic` chunking.
- **Accessibility Floor:** CC's F5 and COD's #4 are identical in intent. Both spot the lack of `aria-labels`, the broken modal semantics, the dead mobile menu, and the missing `prefers-reduced-motion` queries.
- **Data Verification:** CC's F1 and COD's #2 both tackle the broken `verify-data.ts` script. CC proposes patching the existing manual checks, while COD proposes a much heavier Zod runtime schema + E2E Playwright rewrite.

### 2. Unsupported Premises
- **COD #3 (Source-linked diagrams):** COD claims the generic schematic frame must be replaced with accurate vectors. While true in spirit, this heavily underestimates the massive editorial and graphical burden of manually vectorizing and aligning 18+ historical patents into SVG. It is practically unsupported as a "code" fix.
- **CC F2 (Transcription coverage):** CC claims the project "implies completeness" and needs a disclosure. While true, the original `originalText` is clearly meant to be a proxy. Calling it "deceptive" is slightly uncharitable, though technically accurate.

### 3. Risks & Dependencies
- **Risk in WebGL Refactoring (CC F3 / COD #5):** Moving slider state into `useRef` and updating Three.js objects manually in the render loop is highly performant but breaks declarative React paradigms. If not cleaned up correctly, it risks leaving the visual state desynced from the React state.
- **Dependencies in Verification (COD #2):** Moving to Playwright E2E testing introduces massive CI time overhead and dependency weight for a static museum site. CC's F1 approach (fixing the script) is much safer.
- **Content Burden (COD #1 & COD #3):** Both require substantial manual labor from the maintainer to audit manifests, re-run OCR, and draw SVGs.

### 4. Single Strongest Rival Idea
**Winner: COD #1 (Evidence-backed archival truth chain)**
This is a devastatingly brilliant catch. COD noticed that the pipeline is an illusion: `download-patents.ts` downloads to `artifacts/`, but `verify-data.ts` checks `public/patents/pdfs`. Even worse, `ocr-patents.ts` doesn't OCR anything—it just takes the hardcoded TypeScript strings and writes them to Markdown files. The foundational "data pipeline" of the museum is completely fake. Exposing and fixing this is the highest possible leverage for the project's credibility.

---

## Scores for Claude Code (CC)

### F1 — Make the data-integrity gate real
**Score: 880/1000**
- **Rationale:** A fast, highly pragmatic fix. Spotting that the verifier logs `✓` even on failures is a great catch. The fix requires zero new dependencies and immediately stops the bleeding. 
- **Strengths:** High practicality, immediate usefulness.
- **Weaknesses:** It's a band-aid. It doesn't solve the underlying fake pipeline issue that COD found.

### F2 — Disclose transcription coverage instead of implying completeness
**Score: 820/1000**
- **Rationale:** A solid editorial fix. It protects the museum's credibility without requiring hours of typing to complete the transcripts.
- **Strengths:** High accretiveness, great user benefit for historians.
- **Weaknesses:** Purely cosmetic/editorial; doesn't fix underlying architecture.

### F3 — Rebuild the Three.js scenes once, not on every slider tick
**Score: 920/1000**
- **Rationale:** Crucial performance and UX fix. Tearing down the WebGL context on every slider move is a fatal flaw for the "Interactive Pedagogy" pillar.
- **Strengths:** Massive performance boost, high robustness.
- **Weaknesses:** Requires careful React/Three.js ref bridging to avoid state bugs.

### F4 — Render the mathematics
**Score: 960/1000**
- **Rationale:** Pedagogical gold. The stated goal is "Never Dumb Down," yet the math is rendered as unreadable raw LaTeX (`\frac{1}{2}`). Adding KaTeX is a trivial dependency that unlocks massive educational value.
- **Strengths:** Extremely high intuitiveness and compellingness. Perfectly aligned with project goals.
- **Weaknesses:** None.

### F5 — Establish an accessibility floor
**Score: 890/1000**
- **Rationale:** A missing mobile menu and zero `aria-labels` on 74 sliders makes the site completely broken for a large chunk of users. 
- **Strengths:** High ergonomics and user benefit. 
- **Weaknesses:** Basic table-stakes fixes, nothing revolutionary, but absolutely necessary.

---

## Scores for Codex (COD)

### 1. Evidence-backed archival truth chain
**Score: 980/1000**
- **Rationale:** The most insightful catch of the session. COD realized the OCR and download scripts are effectively mock code. Fixing this restores the actual integrity of the project. 
- **Strengths:** Unbeatable usefulness and robustness. Saves the project's core promise.
- **Weaknesses:** High implementation cost (requires real OCR and manifest curation).

### 2. Enforced verification ladder and CI release gate
**Score: 910/1000**
- **Rationale:** A robust, modern approach to preventing regressions. Moving to Zod and adding a GitHub Action ensures the `main` branch never breaks.
- **Strengths:** High reliability and maintainability.
- **Weaknesses:** Playwright might be overkill and too brittle for this specific static content site.

### 3. Faithful, source-linked diagrams
**Score: 700/1000**
- **Rationale:** A great idea in theory, but incredibly impractical. The labor required to vectorize 18+ historical patents into interactive SVGs with mapped coordinates is a multi-week content task, not a coding fix.
- **Strengths:** Highly compelling pedagogical vision.
- **Weaknesses:** Abysmal practicality score.

### 4. Accessible progressive enhancement for every mechanism
**Score: 890/1000**
- **Rationale:** Identical to CC's F5. It's a necessary baseline fix that must be implemented.
- **Strengths:** High user benefit.
- **Weaknesses:** Unoriginal overlap with CC.

### 5. On-demand, stable WebGL simulator runtime
**Score: 940/1000**
- **Rationale:** Takes CC's F3 performance fix and makes it even better by suggesting `next/dynamic` to code-split the 3D libraries. This is the ultimate fix for the site's heavy payload.
- **Strengths:** Exceptional performance and accretiveness scores. 
- **Weaknesses:** Similar ref-sync risks to CC's F3.
