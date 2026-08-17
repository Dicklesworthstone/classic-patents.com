"use client";

import { BookOpen, Calendar, Check, FileDown, MapPin, Share2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Patent } from "@/types/patent";
import { ArchaicGlossaryModal } from "./ArchaicGlossaryModal";

interface PatentHeaderProps {
  patent: Patent;
}

export function PatentHeader({ patent }: PatentHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-5 pb-8 border-b border-parchment-300 dark:border-ink-800">
      {/* Archaic Legal Glossary & Citation Modal */}
      <ArchaicGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        patent={patent}
      />

      {/* Breadcrumb & Era badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-mono text-ink-500">
          <Link
            href="/"
            className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors font-semibold"
          >
            Classic Patents
          </Link>
          <span>/</span>
          <span className="text-ink-950 dark:text-parchment-100 font-bold">
            {patent.patentNumber}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setGlossaryOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Archaic Glossary &amp; Cite</span>
          </button>

          <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 shadow-2xs">
            {patent.era}
          </span>
          <span className="px-3 py-1 rounded-lg text-xs sm:text-sm font-mono font-semibold bg-parchment-200 text-ink-800 dark:bg-ink-900 dark:text-ink-300 border border-parchment-300 dark:border-ink-800 uppercase tracking-wider shadow-2xs">
            {patent.categoryLabel}
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-950 dark:text-parchment-50 leading-tight">
            {patent.shortTitle}
          </h1>
          <span className="font-mono text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-bold">
            {patent.patentNumber}
          </span>
        </div>
        <p className="font-serif text-lg sm:text-xl text-ink-700 dark:text-parchment-300 italic leading-relaxed">
          {patent.subtitle}
        </p>
      </div>

      {/* Meta Grid (Inventors, Grant Date, Filing Date, Location) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 text-sm font-mono">
        <div className="p-3.5 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 shadow-xs">
          <span className="text-ink-500 text-xs block flex items-center gap-1 mb-0.5">
            <User className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Inventor(s)
          </span>
          <span className="font-bold text-ink-950 dark:text-parchment-100 truncate block text-sm sm:text-base">
            {patent.inventors.join(", ")}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 shadow-xs">
          <span className="text-ink-500 text-xs block flex items-center gap-1 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Grant Date
          </span>
          <span className="font-bold text-ink-950 dark:text-parchment-100 text-sm sm:text-base">
            {patent.grantDate}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 shadow-xs">
          <span className="text-ink-500 text-xs block flex items-center gap-1 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Filing Date
          </span>
          <span className="font-bold text-ink-950 dark:text-parchment-100 text-sm sm:text-base">
            {patent.filingDate}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-parchment-100/80 dark:bg-ink-900/70 border border-parchment-200 dark:border-ink-800 shadow-xs">
          <span className="text-ink-500 text-xs block flex items-center gap-1 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> Location
          </span>
          <span className="font-bold text-ink-950 dark:text-parchment-100 truncate block text-sm sm:text-base">
            {patent.inventorLocation}
          </span>
        </div>
      </div>

      {/* Summary and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="text-sm sm:text-base text-ink-800 dark:text-ink-200 font-sans max-w-3xl leading-relaxed">
          {patent.summary}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-900 text-sm font-mono font-semibold flex items-center gap-2 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-900 dark:text-parchment-100 transition-colors shadow-xs"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Share Link"}</span>
          </button>

          <a
            href={patent.originalPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-sm font-mono font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>USPTO PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
