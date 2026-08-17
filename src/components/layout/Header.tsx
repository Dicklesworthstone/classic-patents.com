"use client";

import { Compass, Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform border border-amber-600/40">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="font-serif text-xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
              CLASSIC PATENTS
            </div>
            <div className="text-xs font-sans tracking-widest text-ink-500 uppercase -mt-0.5 font-semibold">
              Historical Technical Museum
            </div>
          </div>
        </Link>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-ink-800 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors font-semibold"
          >
            Museum Catalog
          </Link>
          <Link
            href="/patents/us-821393-wright-flyer"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Wright Flyer 3D
          </Link>
          <Link
            href="/patents/us-381968-tesla-motor"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Tesla AC Motor
          </Link>
          <Link
            href="/patents/us-2981877-noyce-ic"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Noyce Silicon IC
          </Link>
          <Link
            href="/timeline"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/about"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Mission
          </Link>
        </nav>

        {/* Medium Tablet Nav (768px - 1023px) */}
        <nav className="hidden md:flex lg:hidden items-center gap-3.5 text-xs font-medium">
          <Link
            href="/"
            className="text-ink-800 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors font-semibold"
          >
            Catalog
          </Link>
          <Link
            href="/timeline"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors font-medium"
          >
            Timeline
          </Link>
          <Link
            href="/about"
            className="text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 transition-colors font-medium"
          >
            Mission
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle & GitHub */}
        <div className="flex items-center gap-3.5">
          <ThemeToggle />
          <a
            href="https://github.com/Dicklesworthstone/classic-patents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
