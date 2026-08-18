import {
  westinghouseAirBrakeArchivalEdition,
  westinghouseAirBrakeRecordCorrections,
} from "@/data/editions/westinghouseAirBrakeEdition";
import type { Patent } from "@/types/patent";

export const westinghouseAirBrakePatent: Patent = {
  id: "us-124404-westinghouse-air-brake",
  patentNumber: "US 124,404",
  title: "Improvement in Steam-Power Air-Brakes and Signals",
  shortTitle: "Westinghouse Double-Pipe Air Brake and Signal System",
  subtitle: "Two brake pipes, car receivers, automatic tripping cocks, and pneumatic signals",
  inventors: ["George Westinghouse Jr."],
  inventorLocation: "Pittsburg, Allegheny County, Pennsylvania",
  grantDate: "1872-03-05",
  filingDate: null,
  era: "Civil War & Industrial Acceleration (1860–1880)",
  category: "consumer",
  categoryLabel: "Pneumatic Control & Railroad Systems",
  summary:
    "US 124,404 describes a two-pipe railway air-brake system with a local air receiver on each car, cocks that assign the pipes to reservoir charging and brake operation, a mechanical trip that shifts a cock after a derailment or separated coupling, and gauges and whistles for signals between conductor and engineer.",
  heroQuote:
    "When a car becomes disconnected from the train by accident or otherwise, a port or ports will thereby be opened ... so as automatically to apply the brakes.",
  originalPdfUrl: "/patents/pdfs/us-124404-westinghouse-air-brake.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US124404/en",
  usptoClassification: "B60T 15/18 (Triple-valves; Automatic pneumatic brake control)",
  originalTextAsset: {
    url: "/patents/transcripts/us-124404-westinghouse-air-brake-reviewed.txt",
    pageCount: 4,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "4071920f448fd1c3c5d8b5d593963e629adc0b3ae91212aae23cfad3d95ed665",
  },
  archivalEdition: westinghouseAirBrakeArchivalEdition,
  originalText: `UNITED STATES PATENT OFFICE.
GEORGE WESTINGHOUSE, JR., OF PITTSBURG, PENNSYLVANIA.

IMPROVEMENT IN STEAM-POWER AIR-BRAKES AND SIGNALS.

This is a catalogue excerpt. Open Original Patent Text for the complete manually prepared edition, including the full specification and all five printed claims.`,
  ...westinghouseAirBrakeRecordCorrections,
};
