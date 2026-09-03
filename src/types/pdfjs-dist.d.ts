declare module "pdfjs-dist" {
  export interface PDFPageViewport {
    width: number;
    height: number;
  }

  export interface RenderTask {
    promise: Promise<void>;
    cancel(): void;
  }

  export interface RenderParameters {
    canvas?: HTMLCanvasElement | null;
    canvasContext?: CanvasRenderingContext2D | null;
    viewport: PDFPageViewport;
    transform?: number[];
    background?: string;
    [key: string]: unknown;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PDFPageViewport;
    render(params: RenderParameters): RenderTask;
  }

  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
    destroy(): Promise<void>;
  }

  export interface PDFDocumentLoadingTask {
    promise: Promise<PDFDocumentProxy>;
    destroy(): Promise<void>;
  }

  export interface DocumentInitParameters {
    url?: string | URL;
    data?: string | number[] | ArrayBuffer | Uint8Array;
    disableAutoFetch?: boolean;
    disableRange?: boolean;
    disableStream?: boolean;
    [key: string]: unknown;
  }

  export const GlobalWorkerOptions: {
    workerSrc: string;
    workerPort?: unknown;
  };

  export function getDocument(src: string | URL | DocumentInitParameters): PDFDocumentLoadingTask;
}
