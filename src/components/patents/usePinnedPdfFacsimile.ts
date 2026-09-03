"use client";

import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
  RenderTask,
} from "pdfjs-dist";
import { type FormEvent, useEffect, useReducer, useRef } from "react";
import {
  createPinnedPdfFacsimileState,
  PDFJS_WORKER_URL,
  pinnedPdfFacsimileReducer,
} from "./pinnedPdfFacsimileState";

const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_CANVAS_PIXELS = 16_000_000;
const MIN_PAGE_SCALE = 0.5;
const MAX_PAGE_SCALE = 2.5;

interface DocumentRequest {
  id: number;
  retryRevision: number;
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

function canvasScale(
  page: PDFPageProxy,
  availableWidth: number,
): {
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

export function usePinnedPdfFacsimile({
  initialPage,
  pdfUrl,
}: {
  initialPage: number;
  pdfUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const documentRequestRef = useRef<DocumentRequest | null>(null);
  const renderRequestRef = useRef(0);
  const [state, dispatch] = useReducer(
    pinnedPdfFacsimileReducer,
    initialPage,
    createPinnedPdfFacsimileState,
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateWidth = () =>
      dispatch({
        type: "set-available-width",
        availableWidth: Math.max(0, Math.floor(viewport.clientWidth)),
      });
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
    const request = {
      id: (documentRequestRef.current?.id ?? 0) + 1,
      retryRevision: state.retryRevision,
    };
    documentRequestRef.current = request;
    let cancelled = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let loadedDocument: PDFDocumentProxy | null = null;
    const previousLoadingTask = loadingTaskRef.current;

    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    documentRef.current = null;
    loadingTaskRef.current = null;
    void previousLoadingTask?.destroy();

    dispatch({ type: "reset-document", initialPage });

    const loadDocument = async () => {
      try {
        // PDF.js reaches browser Worker/Canvas APIs and must not execute during RSC.
        const pdfjs = await import("pdfjs-dist");
        if (cancelled || request !== documentRequestRef.current) return;

        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
        const nextLoadingTask = pdfjs.getDocument({
          url: pdfUrl,
          disableAutoFetch: false,
          disableRange: false,
          disableStream: false,
        });
        if (cancelled || request !== documentRequestRef.current) {
          void nextLoadingTask.destroy();
          return;
        }

        loadingTask = nextLoadingTask;
        loadingTaskRef.current = nextLoadingTask;
        const nextDocument = await nextLoadingTask.promise;

        if (cancelled || request !== documentRequestRef.current) {
          void nextLoadingTask.destroy();
          return;
        }

        loadedDocument = nextDocument;
        documentRef.current = nextDocument;
        dispatch({ type: "document-loaded", pageCount: nextDocument.numPages });
      } catch (error) {
        if (loadingTaskRef.current === loadingTask) loadingTaskRef.current = null;
        loadingTask = null;
        if (cancelled || request !== documentRequestRef.current) return;
        dispatch({ type: "document-load-failed", errorMessage: printableError(error) });
      }
    };

    void loadDocument();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      if (loadingTaskRef.current === loadingTask) loadingTaskRef.current = null;
      if (documentRef.current === loadedDocument) documentRef.current = null;
      void loadingTask?.destroy();
    };
  }, [initialPage, pdfUrl, state.retryRevision]);

  useEffect(() => {
    const document = documentRef.current;
    const canvas = canvasRef.current;
    if (!document || !canvas || state.availableWidth < 1 || state.pageCount < 1) return;

    const requestId = renderRequestRef.current + 1;
    renderRequestRef.current = requestId;
    let cancelled = false;
    let task: RenderTask | null = null;
    renderTaskRef.current?.cancel();
    renderTaskRef.current = null;
    dispatch({ type: "render-started" });

    const renderPage = async () => {
      try {
        const page = await document.getPage(state.pageNumber);
        if (cancelled) return;
        if (requestId !== renderRequestRef.current) return;

        const { cssScale, backingScale } = canvasScale(page, state.availableWidth);
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
          canvas,
          canvasContext: context,
          viewport: renderViewport,
          background: "rgb(255, 255, 255)",
        });
        renderTaskRef.current = task;
        await task.promise;
        if (cancelled) return;
        if (requestId !== renderRequestRef.current) return;

        dispatch({ type: "render-ready" });
      } catch (error) {
        if (cancelled) return;
        if (requestId !== renderRequestRef.current || isCancelledRender(error)) return;
        dispatch({ type: "render-failed", errorMessage: printableError(error) });
      } finally {
        if (renderTaskRef.current === task) renderTaskRef.current = null;
      }
    };

    void renderPage();

    return () => {
      cancelled = true;
      task?.cancel();
      if (renderTaskRef.current === task) renderTaskRef.current = null;
    };
  }, [state.availableWidth, state.pageCount, state.pageNumber]);

  return {
    canvasRef,
    goToPage: (page: number) => dispatch({ type: "go-to-page", page }),
    pageInput: state.pageInput,
    retry: () => dispatch({ type: "retry" }),
    setPageInput: (pageInput: string) => dispatch({ type: "set-page-input", pageInput }),
    state,
    submitPageInput: (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      dispatch({ type: "go-to-page", page: Number(state.pageInput) });
    },
    viewportRef,
  };
}
