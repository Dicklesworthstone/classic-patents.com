"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Museum global render error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center p-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
              System Error (500)
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-100">
              Archival Display Interrupted
            </h1>
            <p className="font-sans text-sm text-neutral-400 max-w-md mx-auto">
              An unexpected error occurred while rendering the patent projection or physical
              simulation engine.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-sans text-sm font-bold transition-colors shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Exhibition
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
