export const PDFJS_WORKER_URL = "/pdfjs/pdf.worker.min.mjs";
export const PDFJS_WASM_URL = "/pdfjs/wasm/";

export type PinnedPdfRenderState = "loading" | "ready" | "error";

export interface PinnedPdfFacsimileState {
  availableWidth: number;
  errorMessage: string | null;
  pageCount: number;
  pageInput: string;
  pageNumber: number;
  renderState: PinnedPdfRenderState;
  retryRevision: number;
}

export type PinnedPdfFacsimileAction =
  | { type: "document-loaded"; pageCount: number }
  | { type: "document-load-failed"; errorMessage: string }
  | { type: "go-to-page"; page: number }
  | { type: "render-failed"; errorMessage: string }
  | { type: "render-ready"; pageNumber: number; availableWidth: number }
  | { type: "render-started" }
  | { type: "reset-document"; initialPage: number }
  | { type: "retry" }
  | { type: "set-available-width"; availableWidth: number }
  | { type: "set-page-input"; pageInput: string };

export function clampPdfPage(page: number, pageCount: number): number {
  if (!Number.isFinite(pageCount) || pageCount < 1) return 1;
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(Math.trunc(page), 1), Math.trunc(pageCount));
}

export function createPinnedPdfFacsimileState(initialPage: number): PinnedPdfFacsimileState {
  const pageNumber = clampPdfPage(initialPage, 1);
  return {
    availableWidth: 0,
    errorMessage: null,
    pageCount: 0,
    pageInput: String(pageNumber),
    pageNumber,
    renderState: "loading",
    retryRevision: 0,
  };
}

export function pinnedPdfFacsimileReducer(
  state: PinnedPdfFacsimileState,
  action: PinnedPdfFacsimileAction,
): PinnedPdfFacsimileState {
  switch (action.type) {
    case "set-available-width":
      return state.availableWidth === action.availableWidth
        ? state
        : { ...state, availableWidth: action.availableWidth, renderState: "loading" };

    case "reset-document": {
      const pageNumber = clampPdfPage(action.initialPage, 1);
      return {
        ...state,
        errorMessage: null,
        pageCount: 0,
        pageInput: String(pageNumber),
        pageNumber,
        renderState: "loading",
      };
    }

    case "document-loaded": {
      const pageNumber = clampPdfPage(state.pageNumber, action.pageCount);
      return {
        ...state,
        pageCount: action.pageCount,
        pageInput: String(pageNumber),
        pageNumber,
      };
    }

    case "document-load-failed":
    case "render-failed":
      return {
        ...state,
        errorMessage: action.errorMessage,
        renderState: "error",
      };

    case "go-to-page": {
      if (state.pageCount < 1) return state;
      const pageNumber = clampPdfPage(action.page, state.pageCount);
      return {
        ...state,
        pageInput: String(pageNumber),
        pageNumber,
        renderState: pageNumber === state.pageNumber ? state.renderState : "loading",
      };
    }

    case "set-page-input":
      return { ...state, pageInput: action.pageInput };

    case "render-started":
      return { ...state, errorMessage: null, renderState: "loading" };

    case "render-ready":
      if (action.pageNumber !== state.pageNumber || action.availableWidth !== state.availableWidth)
        return state;
      return { ...state, renderState: "ready" };

    case "retry":
      return { ...state, retryRevision: state.retryRevision + 1 };
  }
}
