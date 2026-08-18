"use client";

import { Compass, Github, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md isolate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-700 dark:bg-amber-600 flex items-center justify-center text-amber-50 shadow-xs group-hover:scale-105 transition-transform border border-amber-800/20 dark:border-amber-500/40">
            <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100 dark:text-amber-50 group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-tight">
              CLASSIC PATENTS
            </span>
            <span className="text-[10px] sm:text-[11px] font-sans tracking-widest text-amber-800 dark:text-amber-400 uppercase font-semibold">
              Historical Technical Museum
            </span>
          </div>
        </Link>

        {/* Desktop & Tablet Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-colors font-sans ${
                  active
                    ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                    : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-parchment-200/60 dark:hover:bg-ink-900/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Medium Tablet Nav (768px - 1023px) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1 text-xs font-medium">
          <Link
            href="/"
            className={`px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
              pathname === "/"
                ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
            }`}
          >
            Catalog
          </Link>
          <Link
            href="/timeline"
            className={`px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
              pathname.startsWith("/timeline")
                ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
            }`}
          >
            Timeline
          </Link>
          <Link
            href="/about"
            className={`px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
              pathname.startsWith("/about")
                ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
            }`}
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
          className="md:hidden border-t border-parchment-300 dark:border-ink-800 bg-parchment-50/98 dark:bg-ink-950/98 px-4 py-3 flex flex-col gap-1 shadow-xl"
        >
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-amber-600 text-white font-bold"
                    : "text-ink-800 dark:text-parchment-200 hover:bg-parchment-200 dark:hover:bg-ink-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
