"use client";

import { ArrowRight, BookOpen, Compass, Search, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { allPatents, searchPatents } from "@/data/patents";
import type { Patent } from "@/types/patent";

interface PatentSearchPaletteProps {
  onClose: () => void;
}

export function PatentSearchPalette({ onClose }: PatentSearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // The parent mounts a fresh palette for each open action. This resets search
  // state before the dialog is ever painted instead of briefly showing the
  // previous query and then clearing it in response to an `isOpen` prop.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const closeOnBackdropClick = (event: MouseEvent) => {
      // Native <dialog> backdrop clicks target the dialog itself.
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", closeOnBackdropClick);
    return () => dialog.removeEventListener("click", closeOnBackdropClick);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return allPatents.slice(0, 8);
    }
    return searchPatents(query).slice(0, 12);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Escape closes from anywhere inside the dialog.
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    // Result navigation/activation belongs to the combobox input. Scoped so a
    // focused Clear/ESC button or result link keeps its own native Enter.
    if (e.target !== inputRef.current) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      onClose();
      if (router) {
        router.push(`/patents/${results[selectedIndex].id}`);
      } else if (typeof window !== "undefined") {
        window.location.href = `/patents/${results[selectedIndex].id}`;
      }
    }
  };

  // Keep the keyboard-highlighted result visible when navigating with ↑/↓.
  useEffect(() => {
    document
      .getElementById(`patent-search-result-${selectedIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-label="Patent Search Palette"
      className="fixed inset-0 z-50 m-auto w-[min(44rem,calc(100vw-2rem))] max-h-[85dvh] p-0 bg-transparent border-none open:flex open:items-center open:justify-center backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-2xl bg-parchment-50 dark:bg-ink-950 rounded-3xl border border-parchment-300 dark:border-ink-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] relative">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-parchment-200 dark:border-ink-800 flex items-center gap-3 bg-parchment-100/70 dark:bg-ink-900/70">
          <Search className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder={`Search all ${allPatents.length} inventions (e.g. Wright, Tesla, Transistor, 821,393)...`}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none text-base font-sans text-ink-950 dark:text-parchment-50 placeholder:text-ink-400 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/60 dark:focus-visible:ring-amber-400/60 rounded-lg transition-shadow [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            aria-label="Search patents"
            role="combobox"
            aria-expanded="true"
            aria-controls="patent-search-results"
            aria-activedescendant={
              results[selectedIndex] ? `patent-search-result-${selectedIndex}` : undefined
            }
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-md text-ink-400 hover:text-ink-700 dark:hover:text-ink-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 min-h-11 min-w-11 flex items-center justify-center rounded-md text-[11px] font-mono text-ink-500 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors border border-parchment-300 dark:border-ink-700 cursor-pointer"
          >
            ESC
          </button>
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {results.length} {results.length === 1 ? "result" : "results"} shown
        </span>
        <div
          id="patent-search-results"
          role="listbox"
          aria-label="Search results"
          className="p-3 overflow-y-auto overscroll-contain max-h-[60dvh] space-y-1.5 flex-1"
        >
          <div className="px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-500 font-semibold flex items-center justify-between">
            <span>
              {query ? `Search Results (${results.length})` : "Featured Historic Inventions"}
            </span>
            <span className="text-[10px]">Use ↑↓ to navigate · Enter to open</span>
          </div>
          {results.length > 0 ? (
            results.map((patent: Patent, idx: number) => {
              const isSelected = idx === selectedIndex;
              const year = patent.grantDate.split("-")[0];
              const hasVisualHold = patent.id === "us-3671542-kwolek-kevlar";

              return (
                <Link
                  key={patent.id}
                  id={`patent-search-result-${idx}`}
                  href={`/patents/${patent.id}`}
                  onClick={onClose}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={-1}
                  className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-colors text-left group ${
                    isSelected
                      ? "bg-amber-700 text-white dark:bg-amber-700 shadow-sm"
                      : "bg-parchment-100/60 dark:bg-ink-900/60 hover:bg-parchment-200/80 dark:hover:bg-ink-800/80 text-ink-900 dark:text-parchment-100 border border-parchment-200/70 dark:border-ink-800/60"
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60"
                        }`}
                      >
                        {patent.patentNumber}
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          isSelected ? "text-amber-100" : "text-ink-500"
                        }`}
                      >
                        {year} · {patent.categoryLabel}
                      </span>
                    </div>

                    <div className="font-serif font-bold text-sm sm:text-base truncate">
                      {patent.shortTitle}
                    </div>

                    <div
                      className={`text-xs flex items-center gap-1.5 truncate ${
                        isSelected ? "text-amber-100" : "text-ink-600 dark:text-ink-400"
                      }`}
                    >
                      <User className="w-3 h-3 shrink-0 opacity-70" />
                      <span>{patent.inventors.join(", ")}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1">
                    <span
                      className={`text-xs font-mono font-medium hidden sm:inline ${
                        isSelected ? "text-amber-100" : "text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {hasVisualHold ? "Open Source-Bound Record" : "Open 3D Model"}
                    </span>
                    <ArrowRight
                      className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                        isSelected ? "text-white" : "text-ink-400"
                      }`}
                    />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="p-8 text-center space-y-2">
              <p className="font-serif text-lg font-bold text-ink-900 dark:text-parchment-100">
                No patents found for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-ink-600 dark:text-ink-400 font-sans">
                Try searching for inventors (e.g. &ldquo;Edison&rdquo;, &ldquo;Tesla&rdquo;,
                &ldquo;Noyce&rdquo;) or technical domains.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-parchment-200 dark:border-ink-800 bg-parchment-100/70 dark:bg-ink-900/70 flex items-center justify-between text-xs font-mono text-ink-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-600" /> {allPatents.length} Curated Patents
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Full 3D Physics
            </span>
          </div>
          <Link
            href="/timeline"
            onClick={onClose}
            className="hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" /> View Timeline &rarr;
          </Link>
        </div>
      </div>
    </dialog>
  );
}
