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
    <div className="space-y-4 bg-parchment-100/80 dark:bg-ink-900/70 p-4 rounded-xl border border-parchment-300 dark:border-ink-800 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patents by inventor, title, claim keyword, patent number..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-parchment-50 dark:bg-ink-950 border border-parchment-300 dark:border-ink-700 rounded-lg text-xs font-mono text-ink-900 dark:text-parchment-100 placeholder:text-ink-400 focus:outline-none focus:ring-1 focus:ring-amber-600 dark:focus:ring-amber-400 transition-all"
          />
        </div>

        <div className="text-xs font-mono text-ink-500 whitespace-nowrap self-center sm:self-auto">
          Displaying{" "}
          <span className="font-bold text-amber-700 dark:text-amber-400">{resultCount}</span>{" "}
          patents
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              selectedCategory === cat.id
                ? "bg-amber-700 text-white font-bold shadow-sm dark:bg-amber-600"
                : "bg-parchment-50 dark:bg-ink-950 text-ink-700 dark:text-parchment-300 border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
