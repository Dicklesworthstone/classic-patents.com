"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const setMode = useCallback((dark: boolean) => {
    setIsDark(dark);
    localStorage.setItem("classic-patents-theme", dark ? "dark" : "light");

    const root = document.documentElement;
    root.classList.remove("theme-blueprint", "theme-parchment");

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setMode(!isDark);
  };

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("classic-patents-theme");
    if (saved === "dark") {
      setMode(true);
      return;
    }
    if (saved === "light") {
      setMode(false);
      return;
    }
    // No explicit choice stored: the pre-paint bootstrap in layout.tsx already
    // applied the OS preference to <html>. Mirror it instead of forcing light,
    // which would flash dark-then-light for OS-dark visitors on every load.
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [setMode]);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-parchment-200 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-white dark:bg-ink-900 border border-parchment-300 dark:border-ink-700 text-ink-700 dark:text-parchment-200 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400 dark:hover:border-amber-500/50 shadow-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 group overflow-hidden"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon (Rotates and scales out in dark mode) */}
        <Sun
          className={`w-5 h-5 text-amber-600 dark:text-amber-400 absolute transition-transform transition-opacity duration-500 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />

        {/* Moon Icon (Rotates and scales in when dark mode active) */}
        <Moon
          className={`w-5 h-5 text-blue-400 absolute transition-transform transition-opacity duration-500 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </button>
  );
}
