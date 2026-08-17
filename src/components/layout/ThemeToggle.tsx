"use client";

import { BookOpen, Compass, Moon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "parchment" | "blueprint" | "dark" | "light";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("parchment");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("classic-patents-theme", newTheme);

    const root = document.documentElement;
    root.classList.remove("dark", "theme-blueprint", "theme-parchment", "theme-light");

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "blueprint") {
      root.classList.add("dark", "theme-blueprint");
    } else if (newTheme === "parchment") {
      root.classList.add("theme-parchment");
    } else {
      root.classList.add("theme-light");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("classic-patents-theme") as ThemeMode;
    if (saved) {
      applyTheme(saved);
    } else {
      applyTheme("parchment");
    }
  }, [applyTheme]);

  if (!mounted) return <div className="w-24 h-8" />;

  return (
    <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-lg border border-parchment-300 dark:border-ink-800 text-xs font-mono">
      <button
        type="button"
        onClick={() => applyTheme("parchment")}
        className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
          theme === "parchment"
            ? "bg-amber-600 text-white font-bold shadow-sm"
            : "text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
        }`}
        title="Archival Parchment Mode (Vintage)"
      >
        <BookOpen className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Parchment</span>
      </button>
      <button
        type="button"
        onClick={() => applyTheme("blueprint")}
        className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
          theme === "blueprint"
            ? "bg-blue-600 text-white font-bold shadow-sm"
            : "text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
        }`}
        title="Engineering Blueprint Mode (Cyanotype)"
      >
        <Compass className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Blueprint</span>
      </button>
      <button
        type="button"
        onClick={() => applyTheme("dark")}
        className={`px-2 py-1 rounded flex items-center gap-1 transition-colors ${
          theme === "dark"
            ? "bg-zinc-800 text-white font-bold shadow-sm"
            : "text-ink-700 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-200"
        }`}
        title="Obsidian Dark Mode"
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
