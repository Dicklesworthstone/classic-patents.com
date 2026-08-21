import { peltonWaterWheelRecordCorrections } from "@/data/editions/peltonWaterWheelEdition";
import type { Patent } from "@/types/patent";

const peltonWaterWheelSourceRecord: Pick<
  Patent,
  | "id"
  | "patentNumber"
  | "title"
  | "grantDate"
  | "filingDate"
  | "era"
  | "category"
  | "categoryLabel"
  | "originalPdfUrl"
  | "googlePatentsUrl"
> = {
  id: "us-233692-pelton-water-wheel",
  patentNumber: "US 233,692",
  title: "Water Wheel",
  grantDate: "1880-10-26",
  filingDate: "1880-07-03",
  era: "Electrification & Early Modern (1870–1920)",
  category: "electricity",
  categoryLabel: "Fluid Mechanics & Hydraulic Machinery",
  originalPdfUrl: "/patents/pdfs/us-233692-pelton-water-wheel.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US233692/en",
};
export const peltonWaterWheelPatent: Patent = {
  ...peltonWaterWheelSourceRecord,
  originalTextAsset: {
    url: "/patents/transcripts/us-233692-pelton-water-wheel-reviewed.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-21",
    sourcePdfSha256: "b81019c0239af3ab932bd477970c1a414a91f765a68b28f9b22444e4f95c597c",
  },
  ...peltonWaterWheelRecordCorrections,
};
