import { Compass, ExternalLink } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-950 text-ink-700 dark:text-ink-300 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-amber-700 dark:bg-amber-700 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
                CLASSIC PATENTS
              </span>
            </div>
            <p className="text-xs text-ink-600 dark:text-ink-400 max-w-md leading-relaxed">
              Preserving, restoring, and illuminating humanity&apos;s most consequential historical
              patents through verified archival transcripts, dual-projection engineering
              deconstructions, and interactive 3D physical simulations.
            </p>
            <div className="pt-2 text-[11px] font-sans text-ink-700 dark:text-ink-400">
              An open-source digital museum and research archive.
            </div>
          </div>

          {/* Col 2: Curated Patents */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-parchment-200 mb-3">
              Curated Masterpieces
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link
                  href="/patents/us-821393-wright-flyer"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  US 821,393 · Wright Flyer
                </Link>
              </li>
              <li>
                <Link
                  href="/patents/us-381968-tesla-motor"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  US 381,968 · Tesla AC Motor
                </Link>
              </li>
              <li>
                <Link
                  href="/patents/us-2292387-lamarr-frequency-hopping"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  US 2,292,387 · Lamarr Spread Spectrum
                </Link>
              </li>
              <li>
                <Link
                  href="/patents/us-2981877-noyce-ic"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  US 2,981,877 · Noyce Planar IC
                </Link>
              </li>
              <li>
                <Link
                  href="/patents/us-3671542-kwolek-kevlar"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  US 3,671,542 · Kwolek Kevlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Links & Open Source */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-ink-900 dark:text-parchment-200 mb-3">
              Architecture &amp; Docs
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link
                  href="/about"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  Mission &amp; Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  Historical Timeline
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/Dicklesworthstone/classic-patents.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  GitHub Repository <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <span className="text-ink-700 dark:text-ink-400">MIT Open Source License</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-parchment-200 dark:border-ink-800 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-700 dark:text-ink-400 font-sans gap-3">
          <div>
            © {new Date().getFullYear()} Classic Patents · Curated by Jeffrey Emanuel. Open Source.
          </div>
          <div className="flex items-center gap-4">
            <span>Historical patent texts are in the public domain.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
