"use client";

import { Search, X } from "lucide-react";
import { useMemo } from "react";
import { allPatents } from "@/data/patents";

interface EraFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  resultCount: number;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Masterpieces" },
  { id: "aviation", label: "Aviation & Aerospace" },
  { id: "electricity", label: "Electricity & AC" },
  { id: "telecom", label: "Telecommunications" },
  { id: "computing", label: "Computing & Silicon" },
  { id: "consumer", label: "Consumer & Mechanical" },
  { id: "materials", label: "Materials Science" },
  { id: "optics", label: "Optics & Imaging" },
];

export function EraFilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  resultCount,
}: EraFilterBarProps) {
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPatents.length };
    for (const p of allPatents) {
      const catKey = p.category === "aerospace" ? "aviation" : p.category;
      counts[catKey] = (counts[catKey] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="space-y-4 bg-parchment-100/90 dark:bg-ink-900/80 p-5 sm:p-6 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="patent-catalog-search" className="sr-only">
            Search patents by inventor, title, or patent number
          </label>
          <Search className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="patent-catalog-search"
            type="search"
            placeholder="e.g. Wright, US 821,393, magnetron"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-700 rounded-xl text-sm sm:text-base font-sans text-ink-950 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-400 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
              title="Clear search query"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-sm font-sans text-ink-600 dark:text-ink-300 whitespace-nowrap self-center sm:self-auto font-medium">
          Displaying{" "}
          <span className="font-bold text-amber-700 dark:text-amber-400 text-base">
            {resultCount}
          </span>{" "}
          historical patents
        </div>
      </div>

      {/* Category Filter Pills with Item Counts */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.id] ?? 0;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-colors shadow-xs flex items-center gap-2 ${
                isSelected
                  ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                  : "bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-parchment-200 border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-parchment-200 dark:bg-ink-800 text-ink-600 dark:text-ink-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
