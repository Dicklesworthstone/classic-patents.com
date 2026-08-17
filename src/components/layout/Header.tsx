"use client";

import { Compass, Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [_mobileMenuOpen, _setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform border border-amber-600/40">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="font-serif text-lg font-bold tracking-tight text-ink-900 dark:text-parchment-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
              CLASSIC PATENTS
            </div>
            <div className="text-[10px] font-mono tracking-widest text-ink-500 uppercase -mt-1">
              Historical Technical Archive
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Museum Catalog
          </Link>
          <Link
            href="/patents/us-821393-wright-flyer"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Wright Flyer
          </Link>
          <Link
            href="/patents/us-381968-tesla-motor"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Tesla AC Motor
          </Link>
          <Link
            href="/patents/us-2981877-noyce-ic"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Noyce Silicon IC
          </Link>
          <Link
            href="/timeline"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Timeline
          </Link>
          <Link
            href="/about"
            className="text-ink-700 dark:text-parchment-200 hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            Methodology &amp; OCR
          </Link>
        </nav>

        {/* Right Actions: Theme Toggle & GitHub */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://github.com/Dicklesworthstone/classic-patents.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-parchment-300 transition-colors"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
