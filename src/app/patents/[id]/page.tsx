import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AudioNarrationPlayer } from "@/components/patents/AudioNarrationPlayer";
import { DualProjectionViewer } from "@/components/patents/DualProjectionViewer";
import { LegacyPatentRedirect } from "@/components/patents/LegacyPatentRedirect";
import { PatentHeader } from "@/components/patents/PatentHeader";
import { PatentLineageView } from "@/components/patents/PatentLineageView";
import { getColorizedEquationsForPatent } from "@/data/colorizedEquations";
import { archivalPublicationDiagnostics } from "@/data/editions/archivalPublicationState";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import {
  evaluateArchivalPublicationState,
  patentForPublicationViewer,
} from "@/data/editions/publicationApproval";
import { reviewedLedgerTextForViewer } from "@/data/editions/reviewedLedgerPublicationEvidence.server";
import { getLineagesForPatent } from "@/data/patentLineages";
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
  // Editorial acceptance never gates source text. The viewer projection keeps
  // a complete, structurally valid edition, or falls open to the complete
  // reviewed ledger when the stored edition is only a draft.
  const viewerPatent = patentForPublicationViewer(patent, archivalPublication);
  const archivalEdition = viewerPatent.archivalEdition;
  const archivalDiagnostics = archivalPublicationDiagnostics(archivalPublication);
  const archivalParallelReadings = archivalEdition
    ? archivalParallelReadingsFor(patent.id)
    : undefined;
  // A legitimate reviewed transcript is readable source material even before
  // a complete structured React edition is available. Keep it as text, not as
  // a substitute PDF experience, and never use review state as a visibility gate.
  const reviewedTranscript = archivalEdition ? undefined : reviewedLedgerTextForViewer(patent);
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

      {/* Audio Engineering Breakdown Narration */}
      <div className="print:hidden">
        <AudioNarrationPlayer patent={patent} />
      </div>

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
          reviewedTranscript={reviewedTranscript}
          colorizedEquations={colorizedEquations}
        />
      </div>

      {/* Technological Lineage & Descent (Predecessors & Successors) */}
      {getLineagesForPatent(id).length > 0 && (
        <section aria-label="Technological Lineage and Historical Ancestry" className="pt-2">
          <PatentLineageView currentPatentId={patent.id} />
        </section>
      )}

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
