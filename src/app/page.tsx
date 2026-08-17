"use client";

import { Activity, ArrowRight, Compass, Layers, Scroll, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EraFilterBar } from "@/components/layout/EraFilterBar";
import { PatentCard } from "@/components/patents/PatentCard";
import { getFeaturedPatents, searchPatents } from "@/data/patents";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const featuredPatents = useMemo(() => getFeaturedPatents(), []);

  const filteredPatents = useMemo(() => {
    let list = searchPatents(searchQuery);
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto py-6 sm:py-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 text-xs font-mono text-amber-900 dark:text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Curated Open-Source Historical Patent Museum</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 leading-tight">
          History&apos;s Greatest Inventions, Decoded &amp; Simulated.
        </h1>

        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 max-w-2xl mx-auto leading-relaxed">
          Original USPTO patents restored with pure-Rust OCR, deconstructed into rigorous Plain
          English engineering explanations, and brought to life through interactive physics and
          mechanical simulations.
        </p>

        {/* Hero Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono text-ink-600 dark:text-ink-400">
          <span className="flex items-center gap-1">
            <Scroll className="w-3.5 h-3.5 text-amber-700" /> Verbatim OCR Specs
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Plain English Dual-Mode
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-600" /> Real-Time Simulations
          </span>
        </div>
      </section>

      {/* Featured Masterpieces Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-parchment-300 dark:border-ink-800 pb-2">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Featured Breakthroughs
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-500">Milestones of Modern Civilization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPatents.map((patent) => (
            <PatentCard key={patent.id} patent={patent} />
          ))}
        </div>
      </section>

      {/* Museum Catalog Gallery & Search Filter */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-parchment-300 dark:border-ink-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700 dark:text-amber-500" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-ink-900 dark:text-parchment-100">
              Complete Patent Museum Collection
            </h2>
          </div>
          <span className="text-xs font-mono text-ink-500">8 Curated Historic Masterpieces</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatents.map((patent) => (
              <PatentCard key={patent.id} patent={patent} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-parchment-100 dark:bg-ink-900 rounded-xl border border-parchment-300 dark:border-ink-800 space-y-2">
            <p className="font-serif text-lg text-ink-800 dark:text-parchment-200">
              No patents matched your query.
            </p>
            <p className="text-xs font-mono text-ink-500">
              Try searching by inventor name, patent number, or technical keyword.
            </p>
          </div>
        )}
      </section>

      {/* Why Classic Patents Callout */}
      <section className="rounded-2xl border border-amber-300 dark:border-amber-900/40 bg-gradient-to-r from-amber-50 to-parchment-100 dark:from-ink-900 dark:to-ink-950 p-8 sm:p-10 shadow-patent space-y-4">
        <div className="max-w-3xl space-y-3">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900 dark:text-parchment-100">
            The Philosophy of Plain English Without Dumbing Down
          </h3>
          <p className="font-sans text-xs sm:text-sm text-ink-800 dark:text-parchment-200 leading-relaxed">
            Patents are the primary historical blueprints of human ingenuity, but 19th-century legal
            prose was engineered for lawyers and examiners, not for students, engineers, or curious
            minds. Classic Patents bridges this gap: we preserve every character of the original
            legal text while providing a rigorous, first-principles engineering breakdown with the
            real equations and interactive physics.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-800 dark:text-amber-400 hover:underline"
            >
              Learn about our OCR pipeline and methodology <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
