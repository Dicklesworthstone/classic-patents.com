"use client";

import { Compass, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Museum Catalog" },
  { href: "/patents/us-821393-wright-flyer", label: "Wright Flyer 3D" },
  { href: "/patents/us-381968-tesla-motor", label: "Tesla AC Motor" },
  { href: "/patents/us-2981877-noyce-ic", label: "Noyce Silicon IC" },
  { href: "/timeline", label: "Timeline" },
  { href: "/about", label: "Mission" },
] as const;

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 isolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-700 to-amber-900 dark:from-amber-600 dark:to-amber-800 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform border border-amber-600/40">
            <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
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

        {/* Right Actions: Theme Toggle, GitHub, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3.5">
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
          <button
            type="button"
            className="md:hidden p-2.5 rounded-xl border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200 transition-colors"
            aria-expanded={mobileOpen}
            aria-controls="mobile-museum-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-museum-nav"
          className="md:hidden border-t border-parchment-300 dark:border-ink-800 bg-parchment-50/98 dark:bg-ink-950/98 px-4 py-3 flex flex-col gap-1"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
