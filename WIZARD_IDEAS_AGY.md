# Classic Patents: Wizard Ideas & Architecture Enhancements

Based on an independent code-investigation of the `classic-patents.com` Next.js architecture, data pipelines, and UI layer, here are 30 high-leverage improvement ideas, winnowed down to the top 5 finalists.

## 30 Brainstormed High-Leverage Ideas

1. **Lazy loading/Dynamic Import** for heavy Three.js WebGL components via Next.js `next/dynamic`.
2. **Zod-based runtime schema validation** to replace manual `if/else` checks in `verify-data.ts`.
3. **Synchronous Bi-Directional Scrolling** between Plain English and OCR faces in Split-View mode.
4. **URL State Synchronization** for deep-linking specific `viewMode`s and simulation parameters.
5. **Automated CI/CD Workflow** (GitHub Actions) to enforce `pipeline:verify`, `typecheck`, and `lint` on PRs.
6. **Claim Dependency Graph Verification** ensuring `dependsOn` targets exist in the same patent.
7. **Accessibility (`prefers-reduced-motion`)** support for WebGL animations and smooth scrolling.
8. **External Object Storage** (e.g., R2 or Vercel Blob) for raw PDFs to prevent `public/` folder bloat.
9. **Compile-time local search index** (e.g., MiniSearch) for instant full-text search across all OCR text.
10. **React Memoization** (`useMemo`/`useCallback`) for the `ClaimsDecoder` to avoid re-renders.
11. **Web Workers** for offloading intensive simulation physics (e.g., Kwolek chain alignment).
12. **Visual Regression Testing** (Playwright) covering the 6 highly distinct `DualProjectionViewer` states.
13. **Parallelized network requests** in `download-patents.ts` using `Promise.all` with concurrency limits.
14. **PDF Hashing** in `ocr-patents.ts` to cache `focr` results and prevent redundant OCR processing.
15. **Keyboard Shortcuts** (e.g., `1-6` keys) for rapidly switching `viewMode`s.
16. **Print-Optimized CSS** (`@media print`) so users can generate clean physical documents of the Plain English text.
17. **Interactive "Tour Guide"** overlays that highlight and explain simulation UI controls on first load.
18. **Cross-Patent Hyperlinking** automatically detecting and linking mentioned inventors or patent numbers.
19. **Text-to-Speech (TTS) Narrations** (via `ftts`) of the Plain English explanations for accessibility.
20. **Forced-Colors / High-Contrast support** in Tailwind variables for visually impaired researchers.
21. **Patent "Compare" Mode** to place two competing patents (e.g., Wright vs. Curtiss) side-by-side.
22. **Strict ARIA labels** on all custom HTML overlay sliders driving the Three.js canvases.
23. **Mobile-optimized Swipe Gestures** for cycling through the 6 viewer modes on touch devices.
24. **Deterministic WebGL Context Disposal** on React unmount to prevent severe memory leaks in SPAs.
25. **`next/image` Optimization** for static SVG drawing assets to improve Core Web Vitals.
26. **Font Preloading** for Playfair Display and EB Garamond to strictly eliminate Cumulative Layout Shift (CLS).
27. **Enforce React Hooks Linting** via `biome` to catch missing dependency arrays.
28. **"Report Accuracy Issue"** automated button generating pre-filled GitHub Issues with line numbers.
29. **Inline Glossary Popovers** mapping text matching `archaicTerm` directly to definitions without modals.
30. **Retry & Backoff Logic** in `download-patents.ts` to handle intermittent Google Patents/USPTO network drops.

---

## The 5 Finalists

After rigorous evaluation against correctness, historical/data integrity, pedagogy, accessibility, performance, and maintainability, the following 5 ideas represent the highest return on investment.

### 1. Zod Runtime Schema Validation for Data Integrity
*   **Problem/Evidence**: `src/types/patent.ts` relies on TypeScript interfaces, while `scripts/verify-data.ts` uses fragile, manual `if/else` checks. This does not strictly guarantee schema invariants (e.g., ensuring `dependsOn` points to a valid claim `number` within the same patent dataset).
*   **Minimal Implementation Direction**: Replace TypeScript interfaces in `patent.ts` with strict `zod` schemas and use `z.infer`. Update `verify-data.ts` to simply call `PatentSchema.parse(patent)`, letting Zod handle deep validation, enum checks, and custom refinement logic for claim dependencies.
*   **Expected Benefit**: Absolute, deterministic data integrity. Guarantees no phantom claims, invalid dates, or malformed SVG pin callouts will ever break the Next.js build or UI.
*   **Risk**: Low. Some existing curated data might fail strict validation initially and require minor manual corrections.
*   **Priority**: **Critical**. Directly supports the "Data Integrity & Determinism" doctrine.

### 2. Dynamic Import for Three.js Simulations
*   **Problem/Evidence**: `DualProjectionViewer.tsx` orchestrates all visual modes, importing `PatentVisualDispatcher.tsx`. In Next.js App Router, unconditionally importing heavy Three.js/WebGL simulations bloats the initial client-side JavaScript bundle, severely impacting Time to Interactive (TTI), even if the user hasn't opened the "Interactive Sim" tab.
*   **Minimal Implementation Direction**: Use `next/dynamic` (`const Sim = dynamic(() => import('./Sim'), { ssr: false })`) for the 3D components inside `PatentVisualDispatcher`.
*   **Expected Benefit**: Massive reduction in initial page load weight. 3D physics engines are only downloaded and parsed when the user explicitly clicks the "Interactive Simulator" mode.
*   **Risk**: Low. Requires building a simple loading skeleton/spinner so the UI doesn't jump when the chunk loads.
*   **Priority**: **High**. Crucial for Web Vitals and mobile performance.

### 3. Synchronous Bi-Directional Scroll in Split-Screen Mode
*   **Problem/Evidence**: The "Dual Split-Screen" diptych mode displays Face 1 (Plain English) and Face 2 (Original Spec) side-by-side. However, they scroll independently. A user reading about a specific claim or mechanism in Face 1 must manually hunt for the corresponding archaic text in Face 2, defeating the "Rosetta Stone" pedagogical goal.
*   **Minimal Implementation Direction**: Implement an `IntersectionObserver` in a shared parent hook. Wrap logical blocks (claims, paragraphs) in both faces with `id`s. When a block in Face 1 intersects the viewport, trigger a smooth programmatic scroll to the matching `id` in Face 2, and apply a subtle `bg-amber-500/20` highlight.
*   **Expected Benefit**: A magical, highly educational user experience that dynamically anchors modern explanations directly to historical prose in real-time.
*   **Risk**: Medium. Scroll synchronization can cause infinite scroll loops or jank if not properly debounced.
*   **Priority**: **High**. Directly fulfills the "Dual-Projection Parity" mission.

### 4. Synchronous CI/CD Data Verification Workflow
*   **Problem/Evidence**: The repository relies on developers remembering to run `bun run pipeline:verify`, `typecheck`, and `lint` locally before committing. With multiple AI agents (`br`, `focr`) and humans collaborating, bad or unverified OCR data could easily be merged into `main`.
*   **Minimal Implementation Direction**: Add a `.github/workflows/verify.yml` file. On `push` or `pull_request` to `main`, run `bun install`, `bun run lint`, `bun run typecheck`, and `bun run pipeline:verify`.
*   **Expected Benefit**: Zero regressions. Automates the "Landing the Plane" rules from `AGENTS.md` into an un-bypassable server-side gate.
*   **Risk**: Very low. GitHub Actions minutes are free for public repos.
*   **Priority**: **High**. Essential for project maintainability.

### 5. URL State Synchronization for View Modes & Simulations
*   **Problem/Evidence**: The `viewMode` in `DualProjectionViewer` and the internal states of the physics simulators (e.g., AC frequency, wing warp angle) are strictly local React state. Users cannot share a link to a specific view (e.g., "Check out the original Wright PDF" or "Look at the stall condition on the simulation").
*   **Minimal Implementation Direction**: Use Next.js `useSearchParams` and `useRouter` to lift the `viewMode` state to the URL (`?view=interactive-sim`). For simulators, sync major parameters (e.g., `?view=interactive-sim&yaw=15&roll=20`). Use `router.replace` to avoid breaking the back button.
*   **Expected Benefit**: Deep linkability, turning the museum from a static site into a highly shareable, referencable educational instrument.
*   **Risk**: Medium. Requires careful `useEffect` management to avoid infinite render loops when parsing URL parameters back into Three.js canvas state.
*   **Priority**: **Medium**. Excellent UX multiplier.
