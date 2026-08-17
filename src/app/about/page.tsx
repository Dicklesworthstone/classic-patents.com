import { Compass, ExternalLink, Layers, Scroll, Terminal } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About & Methodology — Classic Patents",
  description:
    "Learn about our mission, pure-Rust OCR pipeline via focr, dual-projection architecture, and editorial methodology.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="space-y-3 border-b border-parchment-300 dark:border-ink-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
          <Compass className="w-3.5 h-3.5" />
          Mission &amp; Architecture
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 dark:text-parchment-50">
          Restoring History&apos;s Technical Masterpieces
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 italic">
          Why we built Classic Patents and how we extract, decode, and simulate humanity&apos;s
          greatest technical breakthroughs.
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
            human civilization. The legal patents recording these breakthroughs are held in public
            domain archives at the USPTO and Google Patents.
          </p>
          <p>However, these historical documents suffer from severe barriers to entry:</p>
          <ul className="list-disc pl-5 space-y-1.5 font-mono text-xs">
            <li>
              <strong>Microfilm Degradation:</strong> Most scanned PDFs are low-contrast, noisy,
              skewed raster scans from 19th-century microfilms.
            </li>
            <li>
              <strong>Legalistic Obfuscation:</strong> Patent language was engineered to maximize
              legal scope in litigation, resulting in impenetrable, run-on sentences that obscure
              the underlying physics.
            </li>
            <li>
              <strong>Static 2D Lithographs:</strong> Original drawings cannot show the dynamic,
              rotating magnetic stator flux of an AC motor or the high-speed deflection of an
              electron beam.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 2: The focr Pure-Rust OCR Pipeline */}
      <section className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h2 className="font-serif text-xl font-bold text-ink-900 dark:text-parchment-100">
            High-Fidelity OCR with franken_ocr (focr)
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-ink-800 dark:text-parchment-200 leading-relaxed">
          Classic Patents uses our pure-Rust hyper-optimized OCR engine,{" "}
          <a
            href="https://github.com/Dicklesworthstone/franken_ocr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-700 dark:text-amber-400 underline font-semibold"
          >
            franken_ocr (focr)
          </a>
          . Unlike generic Tesseract OCR which struggles with 19th-century typography and tight
          mathematical equations,{" "}
          <code className="font-mono text-xs bg-parchment-200 dark:bg-ink-900 px-1 py-0.5 rounded">
            focr
          </code>{" "}
          delivers sub-token accuracy across historical patent columns and multi-page
          specifications.
        </p>

        <div className="bg-ink-950 text-ink-200 p-4 rounded-lg font-mono text-xs space-y-2 border border-ink-800">
          <div className="text-ink-500"># Batch OCR high-resolution patent scans with focr</div>
          <div className="text-emerald-400">
            $ focr ocr-batch scans/*.png --multi-page --output wright_flyer_spec.md
          </div>
          <div className="text-ink-400 text-[11px]">
            ✓ 6.2 GB int8 neural weights loaded in memory once · 100% pure Rust CPU SIMD execution
          </div>
        </div>
      </section>

      {/* Section 3: Dual-Projection (The Diptych Model) */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-ink-900 dark:text-parchment-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700 dark:text-amber-500" />
          The Dual-Projection (Diptych) Philosophy
        </h2>
        <div className="text-xs sm:text-sm font-sans text-ink-800 dark:text-parchment-200 space-y-3 leading-relaxed">
          <p>Every patent in our museum is projected into two synchronized faces:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 space-y-1">
              <span className="font-serif font-bold text-ink-900 dark:text-parchment-100 text-sm block">
                Face 1: Archival Specification
              </span>
              <p className="text-xs text-ink-600 dark:text-ink-400">
                Exact, verified transcription of the historical text, figure references, and formal
                claims for legal historians and scholars.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="font-serif font-bold text-emerald-900 dark:text-emerald-300 text-sm block">
                Face 2: Plain English Breakdown
              </span>
              <p className="text-xs text-ink-600 dark:text-emerald-200/80">
                A rigorous, mathematically precise deconstruction of the mechanical, electrical, and
                chemical physics for engineers and curious minds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Open Source & Stack */}
      <section className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/50 dark:bg-ink-900/50 p-6 space-y-4">
        <h2 className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
          Open Source &amp; Architecture
        </h2>
        <p className="text-xs sm:text-sm font-sans text-ink-700 dark:text-ink-300 leading-relaxed">
          Classic Patents is built with Next.js 15, React 19, TypeScript, and Tailwind CSS, hosted
          on Vercel with zero build credit burn. The complete code is open-source on GitHub under
          the MIT License with an OpenAI/Anthropic Rider.
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
