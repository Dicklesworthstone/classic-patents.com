"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors
    console.error("Museum render error:", error);
  }, [error]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 mb-2">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-widest text-red-700 dark:text-red-400">
          Simulation Error (500)
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 dark:text-parchment-50">
          Archival Render Interrupted
        </h1>
        <p className="font-serif text-sm sm:text-base text-ink-700 dark:text-parchment-300 max-w-xl mx-auto italic">
          An unexpected error occurred while rendering the patent projection or physical simulation
          engine.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reload Projection
        </button>
      </div>
    </div>
  );
}
