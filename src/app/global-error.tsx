"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalErrorBoundary({
  error,
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#fbf9f5] text-[#2a1f18] antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold">Critical Application Error</h2>
          <p className="font-sans text-sm text-ink-600 max-w-md">
            A critical error occurred while rendering the digital museum application.
          </p>
          {error.digest ? (
            <p className="font-mono text-[11px] text-ink-500">Reference: {error.digest}</p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-sans text-sm font-bold transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
