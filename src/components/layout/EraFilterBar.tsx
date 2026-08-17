"use client";

import { Search } from "lucide-react";

interface EraFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  resultCount: number;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: "all", label: "All Masterpieces" },
  { id: "aviation", label: "Aviation" },
  { id: "electricity", label: "Electricity & AC" },
  { id: "telecom", label: "Telecommunications" },
  { id: "computing", label: "Computing & Silicon" },
  { id: "consumer", label: "Consumer Physics" },
  { id: "materials", label: "Materials Science" },
];

export function EraFilterBar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  resultCount,
}: EraFilterBarProps) {
  return (
    <div className="space-y-4 bg-parchment-100/90 dark:bg-ink-900/80 p-5 sm:p-6 rounded-2xl border border-parchment-300 dark:border-ink-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patents by inventor, title, claim keyword, patent number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-700 rounded-xl text-sm sm:text-base font-mono text-ink-950 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-400 transition-all shadow-inner"
          />
        </div>

        <div className="text-sm font-mono text-ink-600 dark:text-ink-300 whitespace-nowrap self-center sm:self-auto font-medium">
          Displaying{" "}
          <span className="font-bold text-amber-700 dark:text-amber-400 text-base">
            {resultCount}
          </span>{" "}
          historical patents
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-semibold transition-all shadow-xs ${
              selectedCategory === cat.id
                ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                : "bg-parchment-50 dark:bg-ink-950 text-ink-800 dark:text-parchment-200 border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
