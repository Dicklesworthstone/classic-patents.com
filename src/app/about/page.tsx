import { Compass, ExternalLink, Layers, Scroll, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About & Methodology — Classic Patents",
  description:
    "Learn about our mission to restore and illuminate history's greatest technical patents with interactive simulations and plain English engineering breakdowns.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-parchment-300 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
          <Compass className="w-3.5 h-3.5" />
          Mission &amp; Philosophy
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 dark:text-parchment-50">
          Restoring History&apos;s Technical Masterpieces
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 italic">
          Why we built Classic Patents and how we illuminate humanity&apos;s greatest technical
          breakthroughs through interactive physical simulations and clear engineering breakdowns.
        </p>
      </div>

      {/* Section 1: The Problem & The Mission */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-parchment-100 flex items-center gap-2">
          <Scroll className="w-5 h-5 text-amber-700 dark:text-amber-500" />
          The Dilemma of Historical Patents
        </h2>
        <div className="text-xs sm:text-sm font-sans text-ink-800 dark:text-parchment-200 space-y-3 leading-relaxed">
          <p>
            When Wilbur Wright twisted a bicycle box in Dayton, Ohio, or Nikola Tesla sketched a
            rotating magnetic field in the dust of a Budapest park, they changed the trajectory of
            human civilization. The legal patents recording these breakthroughs are preserved in
            public domain archives at the USPTO.
          </p>
          <p>However, original historical patents suffer from severe barriers to entry:</p>
          <ul className="list-disc pl-5 space-y-1.5 font-mono text-xs">
            <li>
              <strong>Microfilm Degradation:</strong> Most scanned PDFs are low-contrast, skewed
              raster scans from 19th-century microfilms.
            </li>
            <li>
              <strong>Legalistic Obfuscation:</strong> Patent prose was engineered to maximize legal
              scope in courtroom battles, creating impenetrable, archaic legal run-ons that obscure
              the underlying physics.
            </li>
            <li>
              <strong>Static 2D Lithographs:</strong> Original black-and-white drawings cannot
              illustrate the dynamic 3D physics of wing-warping adverse yaw, continuous AC rotating
              magnetic fields, or high-speed electron beam rasterization.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2: Dual-Projection (The Diptych Model) */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-parchment-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700 dark:text-amber-500" />
          The Dual-Projection (Diptych) Architecture
        </h2>
        <div className="text-xs sm:text-sm font-sans text-ink-800 dark:text-parchment-200 space-y-3 leading-relaxed">
          <p>Every patent in our museum is projected into two synchronized, complementary faces:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 space-y-2">
              <span className="font-serif font-bold text-ink-900 dark:text-parchment-100 text-sm block flex items-center gap-1.5">
                <Scroll className="w-4 h-4 text-amber-600" /> Face 1: Primary Archival Facsimile
                &amp; Specification
              </span>
              <p className="text-xs text-ink-600 dark:text-ink-400 leading-relaxed">
                Exact, complete transcription of the historical legal text, annotated claim
                hierarchies, and embedded high-resolution USPTO scanned PDFs for historians and
                legal scholars.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="font-serif font-bold text-emerald-900 dark:text-emerald-300 text-sm block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Face 2: Plain English Engineering
                Breakdown
              </span>
              <p className="text-xs text-ink-600 dark:text-emerald-200/80 leading-relaxed">
                A rigorous, mathematically honest deconstruction explaining the genuine mechanical,
                electrical, aerodynamic, and chemical physics without childish oversimplification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Physical Simulations */}
      <section className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
            Pedagogical Physical Simulations
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-ink-800 dark:text-parchment-200 leading-relaxed">
          Rather than static stock illustrations, every invention features an interactive simulation
          governed by the authentic physical laws described in the patent. Visitors can manipulate
          aerodynamic wing-warping angles, adjust alternating-current stator phase offsets, regulate
          blackbody filament temperatures, or test spread-spectrum frequency-hopping anti-jamming
          ratios in real time.
        </p>
      </section>

      {/* Section 4: Open Source & Stack */}
      <section className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/50 dark:bg-ink-900/50 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
          Open Source Digital Museum
        </h2>
        <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
          Classic Patents is built with Next.js 15, React 19, TypeScript, Three.js, and Tailwind
          CSS. All historical transcripts, schemas, and interactive models are open-source and
          freely available for educational and research use.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="https://github.com/Dicklesworthstone/classic-patents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View on GitHub
          </a>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-parchment-200 text-xs font-mono hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
          >
            Return to Museum Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}
