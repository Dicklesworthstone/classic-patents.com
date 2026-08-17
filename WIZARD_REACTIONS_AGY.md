# WIZARD_REACTIONS_AGY.md

## Reactions to Rival Cross-Scoring

### 1. The Most Persuasive Challenges
The most devastating and persuasive critiques came from CC regarding my evidence discipline:
- **On A4 (CI/CD) & A1 (Zod):** CC rightly pointed out that `verify-data.ts` currently prints a success checkmark unconditionally and crashes on missing PDFs. By proposing CI without fixing the underlying script, I was effectively proposing an automated rubber-stamp for a broken process. Shipping CI first would manufacture false assurance. This is a fatal flaw in my original sequencing.
- **On A3 (Scroll Sync):** CC absolutely dismantled my scroll-sync proposal by pointing out that the DOM elements I wanted to anchor to do not exist. Face 2 is rendered as a single `whitespace-pre-wrap` string. You cannot `id`-link to a paragraph that isn't a discrete DOM node. Furthermore, COD correctly noted that aggressive auto-scroll can fight the reader. This idea is structurally unbuildable without a massive content parsing overhaul.
- **On A5 (URL State):** CC caught a lethal Next.js App Router footgun: using `useSearchParams` without a `<Suspense>` boundary will opt the 18 patent routes out of static generation. I missed this completely, and shipping it as written would have tanked the site's prerendering performance.

### 2. What I Would Revise
- **A4 & A1:** I must completely resequence my CI and Zod proposals. The absolute prerequisite is fixing the manual logic bugs in `verify-data.ts` (CC's F1). Only once the gate can meaningfully fail should Zod (specifically `safeParse`, to aggregate errors without blinding the sweep) and GitHub Actions be introduced.
- **A2 (Dynamic Import):** I accept CC's correction that my mechanism explanation was flawed (the WebGL chunk actually loads immediately because the default view mounts it, not just when the user clicks 'Interactive Simulator'). Furthermore, my dynamic import alone doesn't fix the GPU memory leaks. I would merge my A2 with COD's B5 (On-demand WebGL runtime) to solve both the bundle size and the Three.js lifecycle bugs simultaneously.
- **A5 (URL State):** I must revise this to strictly enforce a `<Suspense>` boundary to protect SSG. I also agree with COD that we should only sync named, deterministic presets rather than arbitrary float values from sliders.
- **A3 (Scroll Sync):** I am formally demoting this idea from the backlog. It requires semantic source-locators and a split-view content refactor first.

### 3. Criticism I Reject
I reject COD's assertion that proposing Zod (A1) is "overspecified" and that we should simply write a "small custom validator." Hand-rolled validation is exactly how the project ended up with the current `verify-data.ts` mess. Zod is the standard, reliable architectural boundary between static TypeScript definitions and runtime data integrity. While I concede I should use `safeParse` instead of `parse` (to avoid fail-fast blindness), introducing Zod is not an over-prescription—it is the correct tool for the job.

### 4. Revised Priority and Dependency Order
Integrating the sharpest insights from my rivals, here is my revised, pragmatic execution sequence:

1. **Gate Fix (CC F1):** Immediately patch `verify-data.ts` so it accurately reports failures and doesn't crash on missing files. This is the measuring instrument for everything else.
2. **Honest Disclosure (CC F2):** Add the excerpt/completeness UI disclosures to protect the museum's credibility.
3. **Data Integrity & CI (AGY A1 + AGY A4):** Implement Zod schema validation (via `safeParse`) and wire it into a GitHub Actions CI pipeline.
4. **Accessibility Floor (CC F5 / COD B4):** Rescue the mobile navigation, add missing ARIA labels, and respect `prefers-reduced-motion`.
5. **WebGL Bundle & Lifecycle Refactor (AGY A2 + COD B5):** Introduce `next/dynamic` imports for the Three.js simulations AND refactor them to use `useRef` for slider state, ending the expensive scene teardowns.
