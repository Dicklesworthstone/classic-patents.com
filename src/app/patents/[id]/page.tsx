import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DualProjectionViewer } from "@/components/patents/DualProjectionViewer";
import { LegacyPatentRedirect } from "@/components/patents/LegacyPatentRedirect";
import { PatentHeader } from "@/components/patents/PatentHeader";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { archivalPublicationDiagnostics } from "@/data/editions/archivalPublicationState";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import {
  evaluateArchivalPublicationState,
  patentForPublicationViewer,
} from "@/data/editions/publicationApproval";
import {
  allPatents,
  getAdjacentPatents,
  getPatentById,
  LEGACY_PATENT_REDIRECTS,
  legacyPatentRedirectFor,
} from "@/data/patents";

interface PatentPageProps {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...allPatents.map((p) => p.id), ...Object.keys(LEGACY_PATENT_REDIRECTS)].map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: PatentPageProps): Promise<Metadata> {
  const { id } = await params;
  const legacyTarget = legacyPatentRedirectFor(id);
  if (legacyTarget) {
    return {
      title: "Patent Record Moved",
      robots: { index: false, follow: false },
      alternates: { canonical: `/patents/${legacyTarget}` },
    };
  }
  const patent = getPatentById(id);
  if (!patent) {
    return { title: "Patent Not Found" };
  }

  const description = `${patent.subtitle}. ${patent.summary}`;
  const url = `/patents/${patent.id}`;
  const presentationLabel =
    patent.id === "us-3671542-kwolek-kevlar"
      ? "Plain English & Source-Bound Record"
      : "Plain English & Interactive Sim";
  return {
    title: `${patent.shortTitle} (${patent.patentNumber}) — ${presentationLabel}`,
    description,
    // Without these overrides every patent page inherits the root-layout
    // openGraph/twitter objects: generic og:title and site-level og:url.
    alternates: { canonical: url },
    openGraph: {
      title: `${patent.shortTitle} (${patent.patentNumber})`,
      description,
      url,
      type: "article",
    },
    twitter: {
      title: `${patent.shortTitle} (${patent.patentNumber})`,
      description,
    },
  };
}

export default async function PatentDetailPage({ params }: PatentPageProps) {
  const { id } = await params;
  const legacyTarget = legacyPatentRedirectFor(id);
  if (legacyTarget) {
    return <LegacyPatentRedirect targetId={legacyTarget} />;
  }
  const patent = getPatentById(id);

  if (!patent) {
    notFound();
  }
  const colorizedEquations = getColorizedEquationsForPatent(id);
  const archivalPublication = evaluateArchivalPublicationState(patent);
  // Editorial review status must never replace an existing source-text
  // edition with an empty gate. The state stays available as diagnostics, but
  // visitors can read the hand-authored patent text already in the catalogue.
  const archivalEdition = patent.archivalEdition;
  const archivalDiagnostics = archivalPublicationDiagnostics(archivalPublication);
  const viewerPatent = patentForPublicationViewer(patent, archivalPublication);
  const archivalParallelReadings = archivalEdition
    ? archivalParallelReadingsFor(patent.id)
    : undefined;
  const hasRawSourceText = patent.originalTextAsset?.kind === "source-pdf-text-layer";
  const archivalPublicationView = {
    isPublished: archivalPublication.isPublished,
    reasonCode: archivalPublication.reasonCode,
    explanation: archivalPublication.explanation,
    state: { kind: archivalPublication.state.kind },
  };
  const { prev, next } = getAdjacentPatents(id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${patent.title} (${patent.patentNumber})`,
    description: patent.summary,
    inLanguage: "en-US",
    author: patent.inventors.map((name) => ({
      "@type": "Person",
      name,
      homeLocation: patent.inventorLocation,
    })),
    datePublished: patent.grantDate,
    ...(patent.filingDate ? { dateCreated: patent.filingDate } : {}),
    publisher: {
      "@type": "Organization",
      name: "Classic Patents",
      url: "https://classic-patents.com",
    },
    mainEntityOfPage: `https://classic-patents.com/patents/${patent.id}`,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Validated JSON-LD scholarly article schema
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Patent Header & Metadata Bar */}
      <PatentHeader patent={patent} />

      {/* Dual Projection Viewer (Plain English + original source + visual face) */}
      <div
        data-archival-edition={archivalEdition?.kind ?? "withheld"}
        data-archival-publication-state={archivalPublication.state.kind}
        data-archival-publication-reason={archivalPublication.reasonCode}
        data-archival-publication-evidence={JSON.stringify(archivalDiagnostics)}
      >
        <DualProjectionViewer
          patent={viewerPatent}
          archivalPublication={archivalPublicationView}
          archivalParallelReadings={archivalParallelReadings}
          colorizedEquations={colorizedEquations}
          hasRawSourceText={hasRawSourceText}
        />
      </div>

      {/* Adjacent Patent Chronological Navigation */}
      <nav
        aria-label="Chronological Patent Navigation"
        className="pt-8 border-t border-parchment-300 dark:border-ink-800 grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {prev ? (
          <Link
            href={`/patents/${prev.id}`}
            className="p-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/80 dark:bg-ink-900/60 hover:bg-parchment-100 dark:hover:bg-ink-800/80 transition-colors flex items-center gap-3 group shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-amber-700 dark:text-amber-400 group-hover:-translate-x-1 transition-transform shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] font-sans text-ink-500 dark:text-ink-400 font-bold uppercase tracking-wider block">
                Previous Invention ({prev.grantDate.slice(0, 4)})
              </span>
              <span className="font-serif font-bold text-sm text-ink-950 dark:text-parchment-100 truncate block">
                {prev.shortTitle} ({prev.patentNumber})
              </span>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/patents/${next.id}`}
            className="p-4 rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/80 dark:bg-ink-900/60 hover:bg-parchment-100 dark:hover:bg-ink-800/80 transition-colors flex items-center justify-between gap-3 group shadow-xs sm:text-right"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-sans text-ink-500 dark:text-ink-400 font-bold uppercase tracking-wider block">
                Next Invention ({next.grantDate.slice(0, 4)})
              </span>
              <span className="font-serif font-bold text-sm text-ink-950 dark:text-parchment-100 truncate block">
                {next.shortTitle} ({next.patentNumber})
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-700 dark:text-amber-400 group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
