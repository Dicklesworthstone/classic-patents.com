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
    <div className="space-y-4 pb-6 border-b border-parchment-300 dark:border-ink-800">
      {/* Archaic Legal Glossary & Citation Modal */}
      <ArchaicGlossaryModal
        isOpen={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
        patent={patent}
      />

      {/* Breadcrumb & Era badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-mono text-ink-500">
          <Link
            href="/"
            className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          >
            Classic Patents
          </Link>
          <span>/</span>
          <span className="text-ink-900 dark:text-parchment-200 font-semibold">
            {patent.patentNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGlossaryOpen(true)}
            className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Archaic Glossary &amp; Cite</span>
          </button>

          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
            {patent.era}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-parchment-200 text-ink-800 dark:bg-ink-900 dark:text-ink-300 border border-parchment-300 dark:border-ink-800 uppercase tracking-wider">
            {patent.categoryLabel}
          </span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink-950 dark:text-parchment-50">
            {patent.shortTitle}
          </h1>
          <span className="font-mono text-base sm:text-lg text-amber-700 dark:text-amber-400 font-bold">
            {patent.patentNumber}
          </span>
        </div>
        <p className="font-serif text-base sm:text-lg text-ink-700 dark:text-parchment-300 italic">
          {patent.subtitle}
        </p>
      </div>

      {/* Meta Grid (Inventors, Grant Date, Filing Date, Location) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800">
          <span className="text-ink-500 text-[10px] block flex items-center gap-1">
            <User className="w-3 h-3" /> Inventor(s)
          </span>
          <span className="font-bold text-ink-900 dark:text-parchment-100 truncate block">
            {patent.inventors.join(", ")}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800">
          <span className="text-ink-500 text-[10px] block flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Grant Date
          </span>
          <span className="font-bold text-ink-900 dark:text-parchment-100">{patent.grantDate}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800">
          <span className="text-ink-500 text-[10px] block flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Filing Date
          </span>
          <span className="font-bold text-ink-900 dark:text-parchment-100">
            {patent.filingDate}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-parchment-100/70 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800">
          <span className="text-ink-500 text-[10px] block flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Location
          </span>
          <span className="font-bold text-ink-900 dark:text-parchment-100 truncate block">
            {patent.inventorLocation}
          </span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-ink-600 dark:text-ink-400 font-sans max-w-2xl">
          {patent.summary}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg border border-parchment-300 dark:border-ink-700 bg-parchment-100 dark:bg-ink-900 text-xs font-mono flex items-center gap-1.5 hover:bg-parchment-200 dark:hover:bg-ink-800 text-ink-800 dark:text-parchment-200 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          <a
            href={patent.originalPdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>USPTO PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
