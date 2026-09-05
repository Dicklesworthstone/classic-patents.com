import { Layers } from "lucide-react";
import type { Metadata } from "next";
import { CoupledTeachingLabs } from "@/components/patents/visuals/labs/CoupledTeachingLabs";

export const metadata: Metadata = {
  title: "Coupled Teaching Laboratories — Classic Patents",
  description:
    "Interactive multi-patent teaching laboratories modeling coupled rotary power transmission and electrical power distribution networks under genuine port-Hamiltonian energy conservation.",
};

export default function LabsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <div className="space-y-3 border-b border-parchment-300 dark:border-ink-800 pb-6 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
          <Layers className="w-3.5 h-3.5" />
          Multi-Patent Systems &amp; Port Networks
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-950 dark:text-parchment-50">
          Coupled Teaching Laboratories
        </h1>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 italic">
          Explore how disparate historical technical grants interact when assembled into dynamic
          networks: from 19th-century mechanical factory line shafts to electrical generation,
          transformation, and incandescent illumination.
        </p>
      </div>

      <CoupledTeachingLabs />
    </div>
  );
}
