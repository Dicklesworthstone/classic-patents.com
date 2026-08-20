import type { CuratedSpecificationEdition, CuratedSpecificationInlines } from "@/types/patent";

const literal = (text: string): CuratedSpecificationInlines => [{ kind: "text", text }];

export const pagerankParallelReadings: Record<string, string> = {
  "pagerank-abstract":
    "This invention provides a mathematical method for calculating the objective importance of web documents by analyzing the hyperlink citation network. Ranks are iteratively derived from citing pages and a random surfer jump probability.",
  "pagerank-p1":
    "Search engines typically index documents by keyword frequency, which is easily spammed and does not correlate with document authority or quality.",
  "pagerank-p2":
    "The PageRank algorithm models an idealized random web surfer who follows links with probability d and randomly jumps to any document with probability (1-d)/N.",
  "pagerank-claim1":
    "A computer-implemented method of assigning an objective rank to a document by summing the weighted ranks of all documents that link to it, divided by each document's total outbound link count.",
};

export const pagerankArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "United States Patent",
        "Page",
        "Patent No.: US 6,285,999 B1",
        "Date of Patent: Sep. 4, 2001",
        "METHOD FOR NODE RANKING IN A LINKED DATABASE",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "A method assigns importance ranks to nodes in a linked database, such as the World Wide Web. The rank assigned to a document is calculated from the ranks of documents citing it, in combination with a constant representing random jump probability.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Traditional information retrieval systems rank documents based on the presence and frequency of search query keywords within the document text. However, in large distributed hypermedia databases like the World Wide Web, text matching alone fails because document quality varies widely and creators can manipulate keyword frequencies.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    {
      kind: "paragraph",
      inlines: literal(
        "The present invention provides an objective, link-structure-based ranking architecture. Each document is assigned a rank determined by the number and rank of pages linking to it. The algorithm solves for the dominant eigenvector of the stochastic link transition matrix adjusted by a damping factor representing a random surfer model.",
      ),
    },
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: literal(
        "A computer-implemented method of assigning an importance rank to nodes in a linked database, comprising: determining a plurality of citing nodes that contain links to a selected node; calculating an initial rank for each citing node; and updating the importance rank of the selected node by summing contributions from each citing node, wherein each contribution is proportional to the citing node's rank divided by its total number of outbound links, and scaled by a damping factor representing a transition probability.",
      ),
    },
    {
      kind: "paragraph",
      inlines: literal(
        "Inventor: Lawrence Page, Stanford, CA. Assignee: The Board of Trustees of the Leland Stanford Junior University, Stanford, CA.",
      ),
    },
  ],
};
