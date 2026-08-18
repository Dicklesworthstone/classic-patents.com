"use client";

import { useEffect } from "react";

interface LegacyPatentRedirectProps {
  targetId: string;
}

/**
 * Client-side redirect deliberately retains both the active view query and
 * browser-only fragment. Fragments are never sent to a Next.js server, so a
 * server redirect alone cannot preserve a claim or source location.
 */
export function LegacyPatentRedirect({ targetId }: LegacyPatentRedirectProps) {
  const targetPath = `/patents/${targetId}`;

  useEffect(() => {
    window.location.replace(`${targetPath}${window.location.search}${window.location.hash}`);
  }, [targetPath]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="font-serif text-2xl text-ink-950 dark:text-parchment-50">
        This patent record has moved to its verified catalog identity.
      </p>
      <p className="mt-3 text-ink-700 dark:text-ink-300">
        Continuing to{" "}
        <a className="underline" href={targetPath}>
          {targetPath}
        </a>
        .
      </p>
    </main>
  );
}
