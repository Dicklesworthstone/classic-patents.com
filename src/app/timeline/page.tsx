import { History } from "lucide-react";
import type { Metadata } from "next";
import { PatentTimeline } from "@/components/timeline/PatentTimeline";

export const metadata: Metadata = {
  title: "Historical Inventions Timeline (1794–1979) — Classic Patents",
  description:
    "Interactive chronology of transformative patents from Whitney's cotton gin and Morse's telegraph to the Noyce silicon microchip, Kevlar, and Apple II.",
};

export default function TimelinePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-parchment-300 dark:border-ink-800 pb-6 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
          <History className="w-3.5 h-3.5" />
          Chronological Evolution of Technology
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 dark:text-parchment-50">
          Nearly Two Centuries of Human Ingenuity (1794–1979)
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 italic">
          Follow how mechanical automation, telegraphy, materials science, electricity,
          aerodynamics, nuclear physics, monolithic silicon, and computing built the modern world.
        </p>
      </div>

      <PatentTimeline />
    </div>
  );
}
