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
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
  RenderTask,
} from "pdfjs-dist";

/**
 * This worker is copied from the exact pinned pdfjs-dist release during the
 * dependency update. A same-origin static asset avoids a CDN/CSP dependency
 * and makes the historical facsimile available offline with the rest of the
 * published site assets.
 */
export const PDFJS_WORKER_URL = "/pdfjs/pdf.worker.min.mjs";

const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_CANVAS_PIXELS = 16_000_000;
const MIN_PAGE_SCALE = 0.5;
const MAX_PAGE_SCALE = 2.5;

export type PinnedPdfRenderState = "loading" | "ready" | "error";

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

export function clampPdfPage(page: number, pageCount: number): number {
  if (!Number.isFinite(pageCount) || pageCount < 1) return 1;
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(Math.trunc(page), 1), Math.trunc(pageCount));
}

function printableError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) return error.message.trim();
  return "The browser could not render this page from the pinned PDF.";
}

function isCancelledRender(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "RenderingCancelledException" || /cancel(?:led|ed)/i.test(error.message))
  );
}

function canvasScale(page: PDFPageProxy, availableWidth: number): {
  cssScale: number;
  backingScale: number;
} {
  const baseViewport = page.getViewport({ scale: 1 });
  const cssScale = Math.min(
    Math.max(availableWidth / Math.max(baseViewport.width, 1), MIN_PAGE_SCALE),
    MAX_PAGE_SCALE,
  );
  const cssWidth = baseViewport.width * cssScale;
  const cssHeight = baseViewport.height * cssScale;
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
  const pixelBoundScale = Math.sqrt(MAX_CANVAS_PIXELS / Math.max(cssWidth * cssHeight, 1));

  return {
    cssScale,
    backingScale: Math.max(0.25, Math.min(devicePixelRatio, pixelBoundScale)),
  };
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const [availableWidth, setAvailableWidth] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(() => clampPdfPage(initialPage, 1));
  const [pageInput, setPageInput] = useState(String(clampPdfPage(initialPage, 1)));
  const [renderState, setRenderState] = useState<PinnedPdfRenderState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [documentRevision, setDocumentRevision] = useState(0);
  const [retryRevision, setRetryRevision] = useState(0);

  const goToPage = useCallback(
    (candidate: number) => {
      if (pageCount < 1) return;
      setPageNumber(clampPdfPage(candidate, pageCount));
    },
    [pageCount],
  );

  const commitPageInput = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      goToPage(Number(pageInput));
    },
    [goToPage, pageInput],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () => setAvailableWidth(Math.max(0, Math.floor(viewport.clientWidth)));
    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let disposed = false;
    const previousDocument = documentRef.current;
    const previousLoadingTask = loadingTaskRef.current;

    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    documentRef.current = null;
    loadingTaskRef.current = null;
    void previousLoadingTask?.destroy();
    void previousDocument?.destroy();

    setPageCount(0);
    setPageNumber(clampPdfPage(initialPage, 1));
    setPageInput(String(clampPdfPage(initialPage, 1)));
    setErrorMessage(null);
    setRenderState("loading");

    const loadDocument = async () => {
      try {
        // This import intentionally lives inside the client effect: PDF.js
        // reaches browser Worker/Canvas APIs and must never execute during RSC.
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        const loadingTask = pdfjs.getDocument({
          url: pdfUrl,
          disableAutoFetch: false,
          disableRange: false,
          disableStream: false,
          isEvalSupported: false,
        });
        loadingTaskRef.current = loadingTask;
        const document = await loadingTask.promise;

        if (disposed) {
          void document.destroy();
          return;
        }

        documentRef.current = document;
        setPageCount(document.numPages);
        setPageNumber((current) => clampPdfPage(current, document.numPages));
        setDocumentRevision((revision) => revision + 1);
      } catch (error) {
        if (disposed) return;
        setErrorMessage(printableError(error));
        setRenderState("error");
      }
    };

    void loadDocument();

    return () => {
      disposed = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      if (loadingTaskRef.current) void loadingTaskRef.current.destroy();
      if (documentRef.current) void documentRef.current.destroy();
      loadingTaskRef.current = null;
      documentRef.current = null;
    };
  }, [initialPage, pdfUrl, retryRevision]);

  useEffect(() => {
    setPageInput(String(pageNumber));
  }, [pageNumber]);

  useEffect(() => {
    const document = documentRef.current;
    const canvas = canvasRef.current;
    if (!document || !canvas || availableWidth < 1 || pageCount < 1) return;

    let disposed = false;
    let task: RenderTask | null = null;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    setErrorMessage(null);
    setRenderState("loading");

    const renderPage = async () => {
      try {
        const page = await document.getPage(pageNumber);
        if (disposed) return;

        const { cssScale, backingScale } = canvasScale(page, availableWidth);
        const cssViewport = page.getViewport({ scale: cssScale });
        const renderViewport = page.getViewport({ scale: cssScale * backingScale });
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Canvas 2D rendering is unavailable in this browser.");

        canvas.width = Math.max(1, Math.floor(renderViewport.width));
        canvas.height = Math.max(1, Math.floor(renderViewport.height));
        canvas.style.width = `${Math.max(1, Math.floor(cssViewport.width))}px`;
        canvas.style.height = `${Math.max(1, Math.floor(cssViewport.height))}px`;
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        task = page.render({
          canvasContext: context,
          viewport: renderViewport,
          background: "rgb(255, 255, 255)",
        });
        renderTaskRef.current = task;
        await task.promise;
        if (disposed) return;

        setRenderState("ready");
      } catch (error) {
        if (disposed || isCancelledRender(error)) return;
        setErrorMessage(printableError(error));
        setRenderState("error");
      } finally {
        if (renderTaskRef.current === task) renderTaskRef.current = null;
      }
    };

    void renderPage();

    return () => {
      disposed = true;
      task?.cancel();
      if (renderTaskRef.current === task) renderTaskRef.current = null;
    };
  }, [availableWidth, documentRevision, pageCount, pageNumber]);

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
    <section
      className="space-y-4"
      data-testid="pinned-pdf-renderer"
      data-render-state={renderState}
      data-pdf-url={pdfUrl}
      data-current-page={pageNumber}
      data-page-count={pageCount || undefined}
    >
      <div
        ref={viewportRef}
        className="relative flex min-h-[440px] w-full items-start justify-center overflow-auto rounded-xl border border-parchment-300 bg-ink-900 p-2 dark:border-ink-800 sm:min-h-[560px] sm:p-4"
      >
        {showPreview && previewUrl ? (
          <img
            src={previewUrl}
            alt={`${patentNumber} original source facsimile, page 1`}
            className={`h-auto max-w-full bg-white shadow-lg transition-opacity duration-150 ${
              renderState === "ready" && pageNumber === 1
                ? "pointer-events-none absolute opacity-0"
                : "relative opacity-100"
            }`}
            data-testid="pinned-pdf-preview"
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-parchment-300 bg-parchment-100/80 p-3 dark:border-ink-800 dark:bg-ink-900/70">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(pageNumber - 1)}
            disabled={renderState === "loading" || pageNumber <= 1 || pageCount < 1}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-parchment-300 bg-parchment-50 px-3 text-sm font-mono font-bold text-ink-900 transition-colors hover:bg-parchment-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100 dark:hover:bg-ink-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous
          </button>
          <button
            type="button"
            onClick={() => goToPage(pageNumber + 1)}
            disabled={renderState === "loading" || pageCount < 1 || pageNumber >= pageCount}
            className="inline-flex min-h-10 items-center gap-1 rounded-lg border border-parchment-300 bg-parchment-50 px-3 text-sm font-mono font-bold text-ink-900 transition-colors hover:bg-parchment-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-ink-700 dark:bg-ink-950 dark:text-parchment-100 dark:hover:bg-ink-800"
          >
            Next
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <form onSubmit={commitPageInput} className="flex min-h-10 items-center gap-2 text-sm font-mono">
            <label htmlFor="pinned-pdf-page" className="sr-only">
              Go to scanned patent page
            </label>
            <input
              id="pinned-pdf-page"
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value)}
              onBlur={() => goToPage(Number(pageInput))}
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

      {renderState === "error" ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50/80 p-4 text-sm text-ink-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-parchment-100"
        >
          <div className="flex min-w-0 items-start gap-2">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
            <p className="leading-relaxed">
              The in-page renderer could not load this source page. The pinned original remains
              available through Open PDF and Download.
              {previewUrl ? " Its literal page 1 facsimile remains visible above." : ""}
              <span className="sr-only"> Error detail: {errorMessage}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRetryRevision((revision) => revision + 1)}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg border border-amber-400 bg-amber-100 px-3 text-sm font-mono font-bold text-amber-950 transition-colors hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-100 dark:hover:bg-amber-900"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Retry renderer
          </button>
        </div>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {renderState === "ready"
          ? `Original scanned page ${pageNumber} of ${pageCount} is ready.`
          : renderState === "error"
            ? "The in-page original-PDF renderer is unavailable; Open PDF and Download remain available."
            : loadingLabel}
      </p>
    </section>
  );
}
