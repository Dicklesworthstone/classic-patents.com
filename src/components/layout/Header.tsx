"use client";

import { Compass, Github, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PatentSearchPalette } from "./PatentSearchPalette";
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [isApplePlatform, setIsApplePlatform] = useState(true);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const isLinkActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (
        e.key === "/" &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement ||
          (e.target instanceof HTMLElement && e.target.isContentEditable)
        )
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  // Hydration-safe platform probe: SSR renders the ⌘ glyph; non-Apple
  // clients correct it after mount so Windows/Linux show their real modifier.
  useEffect(() => {
    setIsApplePlatform(/Mac|iPhone|iPad|iPod/.test(navigator.userAgent));
  }, []);

  // Close the mobile drawer on Escape or any press outside the header shell.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && e.target instanceof Node && !headerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-40 w-full pt-[env(safe-area-inset-top)] border-b border-parchment-300 dark:border-ink-800 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md isolate"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-700 dark:bg-amber-700 flex items-center justify-center text-amber-50 shadow-xs group-hover:scale-105 transition-transform border border-amber-800/20 dark:border-amber-500/40">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100 dark:text-amber-50 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div className="hidden xs:flex flex-col min-w-0">
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
                isLinkActive("/")
                  ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              Catalog
            </Link>
            <Link
              href="/timeline"
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
                isLinkActive("/timeline")
                  ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              Timeline
            </Link>
            <Link
              href="/about"
              className={`px-2.5 py-1.5 rounded-lg transition-colors font-sans ${
                isLinkActive("/about")
                  ? "bg-amber-100/80 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold"
                  : "text-ink-700 dark:text-parchment-300 hover:text-amber-800 dark:hover:text-amber-400"
              }`}
            >
              Mission
            </Link>
          </nav>

          {/* Right Actions: Search Trigger, Theme Toggle, GitHub, Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 sm:py-1.5 min-h-11 sm:min-h-0 rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100/80 dark:bg-ink-900/80 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-700 dark:text-parchment-300 text-xs font-sans font-medium transition-colors shadow-2xs cursor-pointer"
              title={`Search all patents (${isApplePlatform ? "⌘K" : "Ctrl+K"})`}
              aria-label="Search patents"
            >
              <Search className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-parchment-200 dark:bg-ink-800 border border-parchment-300 dark:border-ink-700 rounded text-ink-500">
                {isApplePlatform ? "⌘K" : "Ctrl K"}
              </kbd>
            </button>

            <ThemeToggle />
            <a
              href="https://github.com/Dicklesworthstone/classic-patents.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-2.5 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 flex items-center justify-center rounded-xl border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200 transition-colors"
              title="View on GitHub"
              aria-label="View Classic Patents on GitHub"
            >
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <button
              type="button"
              className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center rounded-xl border border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200 transition-colors cursor-pointer"
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
            className="drawer-in md:hidden border-t border-parchment-300 dark:border-ink-800 bg-parchment-50/95 dark:bg-ink-950/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 shadow-xl"
          >
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Instant Patent Search Palette Modal */}
      <PatentSearchPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
