import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  clampPdfPage,
  createPinnedPdfFacsimileState,
  pinnedPdfFacsimileReducer,
} from "./pinnedPdfFacsimileState";

describe("pinned PDF facsimile state", () => {
  test("clamps page navigation and keeps the displayed input synchronized", () => {
    let state = createPinnedPdfFacsimileState(99);
    expect(state.pageNumber).toBe(1);
    expect(state.pageInput).toBe("1");

    state = pinnedPdfFacsimileReducer(state, { type: "document-loaded", pageCount: 8 });
    state = pinnedPdfFacsimileReducer(state, { type: "go-to-page", page: 6.9 });
    expect(state.pageNumber).toBe(6);
    expect(state.pageInput).toBe("6");

    state = pinnedPdfFacsimileReducer(state, {
      type: "go-to-page",
      page: Number.POSITIVE_INFINITY,
    });
    expect(state.pageNumber).toBe(1);
    expect(state.pageInput).toBe("1");
  });

  test("resets all coupled rendering state before a fresh document attempt", () => {
    let state = createPinnedPdfFacsimileState(1);
    state = pinnedPdfFacsimileReducer(state, { type: "document-loaded", pageCount: 4 });
    state = pinnedPdfFacsimileReducer(state, { type: "go-to-page", page: 4 });
    state = pinnedPdfFacsimileReducer(state, {
      type: "render-failed",
      errorMessage: "network failure",
    });
    state = pinnedPdfFacsimileReducer(state, { type: "retry" });
    state = pinnedPdfFacsimileReducer(state, { type: "reset-document", initialPage: 3 });

    expect(state.retryRevision).toBe(1);
    expect(state.pageCount).toBe(0);
    expect(state.pageNumber).toBe(1);
    expect(state.pageInput).toBe("1");
    expect(state.errorMessage).toBeNull();
    expect(state.renderState).toBe("loading");
  });

  test("handles malformed page inputs without producing an invalid page", () => {
    expect(clampPdfPage(Number.NaN, 4)).toBe(1);
    expect(clampPdfPage(-5, 4)).toBe(1);
    expect(clampPdfPage(10, 4)).toBe(4);
  });

  test("ships a worker built for the installed PDF.js display API", () => {
    const packageMetadata = JSON.parse(
      readFileSync(join(process.cwd(), "node_modules/pdfjs-dist/package.json"), "utf8"),
    ) as { version: string };
    const workerSource = readFileSync(
      join(process.cwd(), "public/pdfjs/pdf.worker.min.mjs"),
      "utf8",
    );

    expect(workerSource).toContain(`pdfjsVersion = ${packageMetadata.version}`);
  });
});
