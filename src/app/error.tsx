"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-ink-950 dark:text-parchment-100">
        An error occurred while loading this exhibit
      </h2>
      <p className="font-sans text-sm text-ink-600 dark:text-ink-300 max-w-md">
        {error.message || "An unexpected rendering error was encountered."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-sm font-bold transition-colors shadow-sm cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reload Exhibit</span>
      </button>
    </div>
  );
}
