"use client";

import { ArrowRight, Box, Compass, Layers, Scroll, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EraFilterBar } from "@/components/layout/EraFilterBar";
import { PatentCard } from "@/components/patents/PatentCard";
import { allPatents, getFeaturedPatents, getPatentsByCategory, searchPatents } from "@/data/patents";
import type { Patent } from "@/types/patent";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featuredPatents = useMemo(() => getFeaturedPatents(), []);

  const filteredPatents = useMemo(() => {
    const catalog = getPatentsByCategory(selectedCategory);
    if (!searchQuery.trim()) return catalog;
    const searched = new Set(searchPatents(searchQuery).map((p: Patent) => p.id));
    return catalog.filter((p) => searched.has(p.id));
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto py-8 sm:py-12">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700/80 text-xs sm:text-sm font-sans text-amber-900 dark:text-amber-300 font-semibold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Curated Open-Source Historical Patent Museum</span>
        </div>

        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 leading-[1.1]">
          History&apos;s Greatest Inventions, Decoded &amp; Simulated.
        </h1>

        <p className="font-serif text-lg sm:text-xl text-ink-800 dark:text-parchment-200 max-w-3xl mx-auto leading-relaxed">
          Original USPTO patents restored with verified archival transcripts, deconstructed into
          rigorous Plain English engineering explanations, and brought to life through real-time 3D
          Three.js physical simulations.
        </p>

        {/* Hero Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 text-xs sm:text-sm font-sans text-ink-700 dark:text-ink-300 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-parchment-100/80 dark:bg-ink-900/80 rounded-lg border border-parchment-200 dark:border-ink-800">
            <Scroll className="w-4 h-4 text-amber-700 dark:text-amber-400" /> Verbatim Archival
            Transcripts &amp; PDFs
          </span>
          <span className="hidden sm:inline text-ink-400">•</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-parchment-100/80 dark:bg-ink-900/80 rounded-lg border border-parchment-200 dark:border-ink-800">
            <Sparkles className="w-4 h-4 text-emerald-600" /> Plain English Dual-Projection
          </span>
          <span className="hidden sm:inline text-ink-400">•</span>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-parchment-100/80 dark:bg-ink-900/80 rounded-lg border border-parchment-200 dark:border-ink-800">
            <Box className="w-4 h-4 text-blue-600" /> 3D WebGL Physics Engines
          </span>
        </div>
      </section>

      {/* Featured Masterpieces Spotlight */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-parchment-300 dark:border-ink-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-amber-700 dark:text-amber-500" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
              Featured Breakthroughs
            </h2>
          </div>
          <span className="text-sm font-sans text-ink-600 dark:text-ink-400 font-semibold">
            Milestones of Modern Civilization
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {featuredPatents.map((patent) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>
      </section>

      {/* Museum Catalog Gallery & Search Filter */}
      <section className="space-y-8 pt-4">
        <div className="flex items-center justify-between border-b border-parchment-300 dark:border-ink-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-amber-700 dark:text-amber-500" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-950 dark:text-parchment-50">
              Complete Patent Museum Collection
            </h2>
          </div>
          <span className="text-sm font-sans text-ink-600 dark:text-ink-400 font-semibold">
            {allPatents.length} Curated Historic Masterpieces
          </span>
        </div>

        {/* Filter and search bar */}
        <EraFilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredPatents.length}
        />

        {/* Grid of All Patents */}
        {filteredPatents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPatents.map((patent: Patent) => (
              <PatentCard key={patent.id} patent={patent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-parchment-100 dark:bg-ink-900 rounded-2xl border border-parchment-300 dark:border-ink-800 space-y-3">
            <p className="font-serif text-2xl text-ink-900 dark:text-parchment-100 font-bold">
              No patents matched your query.
            </p>
            <p className="text-sm font-sans text-ink-600 dark:text-ink-400">
              Try searching by inventor name, patent number, or technical keyword.
            </p>
          </div>
        )}
      </section>

      {/* Why Classic Patents Callout */}
      <section className="rounded-3xl border border-amber-300 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/90 to-parchment-100/90 dark:from-ink-900 dark:to-ink-950 p-8 sm:p-12 shadow-patent space-y-5">
        <div className="max-w-4xl space-y-4">
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ink-950 dark:text-parchment-50">
            The Philosophy of Plain English Without Dumbing Down
          </h3>
          <p className="font-sans text-base sm:text-lg text-ink-800 dark:text-parchment-200 leading-relaxed">
            Patents are the primary historical blueprints of human ingenuity, but 19th-century legal
            prose was engineered for lawyers and examiners, not for students, engineers, or curious
            minds. Classic Patents bridges this gap: we preserve every character of the original
            legal text and drawings while providing a rigorous, first-principles engineering
            breakdown with the real equations, 3D WebGL simulations, and interactive physical
            parameter dials.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-sans font-bold text-amber-800 dark:text-amber-400 hover:underline"
            >
              Learn about our architecture and mission <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
