"use client";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import type { FormEvent, RefObject } from "react";
import type { PinnedPdfFacsimileState, PinnedPdfRenderState } from "./pinnedPdfFacsimileState";
import { usePinnedPdfFacsimile } from "./usePinnedPdfFacsimile";

export interface PinnedPdfFacsimileProps {
  /** Canonical same-origin URL of the immutable source PDF. */
  pdfUrl: string;
  /** Printed patent number used in accessible labels and recovery copy. */
  patentNumber: string;
  /**
   * A literal rendering of page 1 from the same pinned bytes. It is visible
   * before JavaScript/worker startup and remains available if rendering fails.
   */
  previewUrl?: string;
  /** Allows a source link to open a later page when a caller has one. */
  initialPage?: number;
}

function PinnedPdfPageViewport({
  canvasRef,
  patentNumber,
  previewUrl,
  state,
  viewportRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  patentNumber: string;
  previewUrl?: string;
  state: PinnedPdfFacsimileState;
  viewportRef: RefObject<HTMLDivElement | null>;
}) {
  const { pageCount, pageNumber, renderState } = state;
  const showPreview = Boolean(previewUrl) && (renderState !== "ready" || pageNumber === 1);
  const loadingLabel =
    pageCount > 0
      ? `Rendering original scanned page ${pageNumber} of ${pageCount}.`
      : "Loading the complete pinned original patent document.";
  const canvasLabel =
    pageCount > 0
      ? `${patentNumber} original scanned patent page ${pageNumber} of ${pageCount}`
      : `${patentNumber} original scanned patent page`;

  return (
    <div
      ref={viewportRef}
      className="relative flex min-h-[440px] w-full items-start justify-center overflow-auto rounded-xl border border-parchment-300 bg-ink-900 p-2 dark:border-ink-800 sm:min-h-[560px] sm:p-4"
    >
      {showPreview && previewUrl ? (
        <Image
          alt={`${patentNumber} original source facsimile, page 1`}
          className={`h-auto max-w-full bg-white shadow-lg transition-opacity duration-150 ${
            renderState === "ready" && pageNumber === 1
              ? "pointer-events-none absolute opacity-0"
              : "relative opacity-100"
          }`}
          data-testid="pinned-pdf-preview"
          height={1600}
          priority
          sizes="(min-width: 640px) 720px, calc(100vw - 2rem)"
          src={previewUrl}
          width={1200}
        />
      ) : null}
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={canvasLabel}
        className={`h-auto max-w-full bg-white shadow-lg transition-opacity duration-150 ${
          renderState === "ready" ? "relative opacity-100" : "absolute opacity-0"
        }`}
        data-testid="pinned-pdf-canvas"
      />
      {renderState === "loading" ? (
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 rounded-lg bg-ink-950/85 px-3 py-2 text-center text-xs font-mono font-semibold text-parchment-100 shadow-sm sm:inset-x-auto sm:bottom-5">
          <LoaderCircle className="h-4 w-4 animate-spin text-amber-400" aria-hidden />
          <span>{loadingLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

function PinnedPdfControls({
  onPageInputChange,
  onSubmit,
  onGoToPage,
  pageInput,
  pdfUrl,
  state,
}: {
  onPageInputChange: (pageInput: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onGoToPage: (page: number) => void;
  pageInput: string;
  pdfUrl: string;
  state: PinnedPdfFacsimileState;
}) {
  const { pageCount, pageNumber, renderState } = state;
  const isLoading = renderState === "loading";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-parchment-300 bg-parchment-100/80 p-3 dark:border-ink-800 dark:bg-ink-900/70">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onGoToPage(pageNumber - 1)}
          disabled={isLoading || pageNumber <= 1 || pageCount < 1}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-parchment-300 bg-parchment-50 px-3 text-sm font-mono font-bold text-ink-900 transition-colors hover:bg-parchment-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100 dark:hover:bg-ink-800"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onGoToPage(pageNumber + 1)}
          disabled={isLoading || pageCount < 1 || pageNumber >= pageCount}
          className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-parchment-300 bg-parchment-50 px-3 text-sm font-mono font-bold text-ink-900 transition-colors hover:bg-parchment-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100 dark:hover:bg-ink-800"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
        <form onSubmit={onSubmit} className="flex min-h-10 items-center gap-2 text-sm font-mono">
          <label htmlFor="pinned-pdf-page" className="sr-only">
            Go to scanned patent page
          </label>
          <input
            id="pinned-pdf-page"
            value={pageInput}
            onChange={(event) => onPageInputChange(event.target.value)}
            onBlur={() => onGoToPage(Number(pageInput))}
            type="number"
            inputMode="numeric"
            min={1}
            max={pageCount || undefined}
            disabled={pageCount < 1}
            className="h-10 w-16 rounded-lg border border-parchment-300 bg-white px-2 text-center font-bold text-ink-950 outline-none ring-amber-500/60 transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100"
          />
          <span className="whitespace-nowrap text-xs font-semibold text-ink-600 dark:text-ink-300">
            of {pageCount || "…"}
          </span>
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-amber-700 px-3 text-sm font-mono font-bold text-white transition-colors hover:bg-amber-800"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Open PDF
        </a>
        <a
          href={pdfUrl}
          download
          className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-parchment-300 bg-parchment-50 px-3 text-sm font-mono font-bold text-ink-900 transition-colors hover:bg-parchment-200 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100 dark:hover:bg-ink-800"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download
        </a>
      </div>
    </div>
  );
}

function PinnedPdfRenderError({
  errorMessage,
  previewUrl,
  renderState,
  retry,
}: {
  errorMessage: string | null;
  previewUrl?: string;
  renderState: PinnedPdfRenderState;
  retry: () => void;
}) {
  if (renderState !== "error") return null;

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-sm text-ink-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-parchment-100"
    >
      <div className="flex min-w-0 items-start gap-2">
        <FileText
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400"
          aria-hidden
        />
        <p className="leading-relaxed">
          The in-page renderer could not load this source page. The pinned original remains
          available through Open PDF and Download.
          {previewUrl ? " Its literal page 1 facsimile remains visible above." : ""}
          <span className="sr-only"> Error detail: {errorMessage}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={retry}
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-100 px-3 text-sm font-mono font-bold text-amber-950 transition-colors hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-100 dark:hover:bg-amber-900"
      >
        <RotateCcw className="h-4 w-4" aria-hidden />
        Retry renderer
      </button>
    </div>
  );
}

function PinnedPdfLiveStatus({ state }: { state: PinnedPdfFacsimileState }) {
  const { pageCount, pageNumber, renderState } = state;
  const status =
    renderState === "ready"
      ? `Original scanned page ${pageNumber} of ${pageCount} is ready.`
      : renderState === "error"
        ? "The in-page original-PDF renderer is unavailable; Open PDF and Download remain available."
        : pageCount > 0
          ? `Rendering original scanned page ${pageNumber} of ${pageCount}.`
          : "Loading the complete pinned original patent document.";

  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {status}
    </p>
  );
}

/**
 * Browser-owned, one-page-at-a-time rendering of the immutable PDF source.
 *
 * Native <object> PDF plug-ins render as blank/black surfaces in several
 * browsers and cannot be audited by headless production acceptance. PDF.js
 * fetches the exact pinned bytes and paints a literal page onto this canvas.
 * Only the current page is rasterized, preserving responsiveness for long
 * historical records.
 */
export function PinnedPdfFacsimile({
  pdfUrl,
  patentNumber,
  previewUrl,
  initialPage = 1,
}: PinnedPdfFacsimileProps) {
  const {
    canvasRef,
    goToPage,
    pageInput,
    retry,
    setPageInput,
    state,
    submitPageInput,
    viewportRef,
  } = usePinnedPdfFacsimile({ initialPage, pdfUrl });

  return (
    <section
      className="space-y-4"
      data-current-page={state.pageNumber}
      data-page-count={state.pageCount || undefined}
      data-pdf-url={pdfUrl}
      data-render-state={state.renderState}
      data-testid="pinned-pdf-renderer"
    >
      <PinnedPdfPageViewport
        canvasRef={canvasRef}
        patentNumber={patentNumber}
        previewUrl={previewUrl}
        state={state}
        viewportRef={viewportRef}
      />
      <PinnedPdfControls
        onGoToPage={goToPage}
        onPageInputChange={setPageInput}
        onSubmit={submitPageInput}
        pageInput={pageInput}
        pdfUrl={pdfUrl}
        state={state}
      />
      <PinnedPdfRenderError
        errorMessage={state.errorMessage}
        previewUrl={previewUrl}
        renderState={state.renderState}
        retry={retry}
      />
      <PinnedPdfLiveStatus state={state} />
    </section>
  );
}
