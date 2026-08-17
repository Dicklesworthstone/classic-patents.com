import { Compass, FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 mb-2">
        <FileQuestion className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
          Archival Record Unindexed (404)
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink-950 dark:text-parchment-50">
          Patent Not Found in Museum Catalog
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 max-w-xl mx-auto italic">
          The historical patent document or simulation route you requested does not exist in our
          curated library or has been relocated.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          Return to Museum Catalog
        </Link>
        <Link
          href="/timeline"
          className="px-5 py-2.5 rounded-xl bg-parchment-200 dark:bg-ink-800 hover:bg-parchment-300 dark:hover:bg-ink-700 text-ink-900 dark:text-parchment-100 border border-parchment-300 dark:border-ink-700 font-sans text-sm font-medium transition-colors"
        >
          View Chronological Timeline
        </Link>
      </div>
    </div>
  );
}
