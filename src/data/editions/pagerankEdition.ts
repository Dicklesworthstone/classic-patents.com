import type {
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
  CuratedSpecificationInlines,
} from "@/types/patent";

const term = (
  surfaceText: string,
  key: string,
  definition: string,
): CuratedSpecificationInline => ({
  kind: "term",
  text: surfaceText,
  label: key,
  definition,
});

export const PAGERANK_FIGURE_DIMS: Record<number, { width: number; height: number }> = {
  1: { width: 1681, height: 2580 },
  2: { width: 1783, height: 2598 },
  3: { width: 1659, height: 2859 },
};

function figureAssetPath(number: number): string {
  return `/patents/figures/us-6285999-pagerank/fig-${number}-source-crop-v1.png`;
}

function makePreview(
  surfaceText: string,
  figureNumbers: number[],
  altText: string,
): CuratedSpecificationInline {
  return {
    kind: "reference",
    text: surfaceText,
    href: `#figure-${figureNumbers[0]}`,
    referenceType: "figure",
    label: altText,
    figurePreviews: figureNumbers.map((num) => ({
      src: figureAssetPath(num),
      alt: `Figure ${num}: ${altText}`,
      width: PAGERANK_FIGURE_DIMS[num]?.width ?? 1200,
      height: PAGERANK_FIGURE_DIMS[num]?.height ?? 1600,
    })),
  };
}

const p = (
  ...inlines: (string | CuratedSpecificationInline)[]
): {
  kind: "paragraph";
  inlines: CuratedSpecificationInlines;
} => ({
  kind: "paragraph",
  inlines: inlines.map((item) => (typeof item === "string" ? { kind: "text", text: item } : item)),
});

export const pagerankParallelReadings: Readonly<Record<number, readonly string[]>> = {
  2: [
    "Abstract: Objective document ranking in a linked database calculated from the ranks of citing documents and a random jump transition probability.",
  ],
  4: [
    "Field of the Invention: Information retrieval and document ranking in large-scale hypermedia databases such as the World Wide Web.",
  ],
  6: [
    "Background: Traditional text-matching search engines rank pages based purely on query keyword presence and frequency.",
  ],
  7: [
    "Vulnerability of keyword search: Low-quality web pages and spam creators easily manipulate keyword density to deceive search engines.",
  ],
  9: [
    "Summary: The rank of a page is determined by the global hyperlink graph, meaning a page receives high rank if pointed to by other high-ranking pages.",
  ],
  10: [
    "Random Surfer Model: The rank corresponds to the stationary probability distribution of an idealized web surfer who repeatedly clicks links with probability d and makes random jumps with probability (1-d).",
  ],
  12: [
    "Brief Description of Figures: FIG. 1 shows a 3-document network; FIG. 2 illustrates backlink propagation; FIG. 3 is the iterative power iteration flowchart.",
  ],
  14: [
    "Detailed Description: In a directed graph of nodes A, B, and C, parent linking pages pass forward links to child linked pages.",
  ],
  15: [
    "Recursive formulation: R(u) = (1-d) + d * sum(R(v)/N_v), where B(u) are parent documents linking to u, N(v) is outgoing link count, and d is the damping factor (~0.85).",
  ],
  16: [
    "Propagation dynamics: A small number of links from high-ranking pages impart substantial authority, while links from low-ranking pages contribute minimally.",
  ],
  17: [
    "Iterative algorithm: Initializing rank vector p_0 (step 101), constructing transition matrix A (step 102), and iterating p_{i+1} = A * p_i until convergence threshold epsilon (step 104).",
  ],
  18: [
    "Dominant eigenvector: The damping factor guarantees the transition matrix is irreducible and stochastic, ensuring rapid O(log N) convergence to a unique stationary distribution.",
  ],
  19: [
    "Weighting factors & anchor text: In search engines, descriptive anchor text on incoming links is indexed alongside destination target pages.",
  ],
  20: [
    "Browser annotations: Presenting visual rank badges and traffic indicators next to hyperlinks to guide user navigation.",
  ],
  21: [
    "Hardware architecture: Distributed implementation across clustered servers with high-speed memory for billion-node graph traversals.",
  ],
};

export const pagerankArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
  preparedBy: "Classic Patents Editorial Team",
  preparedAt: "2026-08-20",
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
        "Inventor: Lawrence Page, Stanford, CA (US)",
        "Assignee: The Board of Trustees of the Leland Stanford Junior University, Stanford, CA (US)",
        "Application No.: 09/004,827 · Filed: Jan. 9, 1998",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "A method assigns importance ranks to nodes in a linked database, such as the World Wide Web. The rank assigned to a document is calculated from the ranks of documents citing it. In addition, the rank of a document is calculated from a constant representing the probability that a browser through the database will randomly jump to the document. The method is particularly useful for enhancing the performance of search engines for text databases on the World Wide Web, whose documents have a large variation in quality and importance.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p(
      "This invention relates generally to information retrieval systems, and more particularly to a method for ranking documents in a linked database.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "The World Wide Web is a large, distributed hypermedia database that has experienced rapid growth. As the Web has grown, search engines have become essential tools for locating information of interest. Traditional search engines index the text of documents on the Web and evaluate search queries by matching query terms against the indexed text. Documents containing the query terms are returned to the user, typically sorted by a relevance score based on keyword frequency and position.",
    ),
    p(
      "However, text-matching techniques alone are inadequate for ranking Web documents. Because anyone can publish documents on the Web with minimal effort, the quality and authoritativeness of Web pages vary enormously. Moreover, document creators often manipulate keyword frequencies and text formatting to artificially inflate their documents’ relevance rankings in traditional search engines. Consequently, text-based search engines frequently return thousands of low-quality or irrelevant results, obscuring the most authoritative and useful documents.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "SUMMARY OF THE INVENTION",
    },
    p(
      "The present invention provides an objective, link-structure-based ranking method that overcomes the limitations of keyword-matching search engines. In accordance with the present invention, the importance rank of a document in a linked database is determined by the link structure of the database itself. A document receives a high rank if it is linked to by other high-ranking documents.",
    ),
    p(
      "The rank calculation models a ",
      term(
        "random surfer",
        "Random Surfer Model",
        "An idealized web browser user who repeatedly follows outgoing hyperlinks at random with probability d, and randomly teleports to any page in the database with probability (1-d).",
      ),
      " who traverses the linked database. The rank of a document corresponds to the stationary probability that the random surfer will visit that document. The invention provides an iterative numerical technique for calculating the stationary distribution across millions of linked documents in a computationally efficient manner.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWING FIGURES",
    },
    p(
      "The invention will be described in detail with reference to the accompanying drawings:\n",
      makePreview(
        "FIG. 1",
        [1],
        "Diagram of the relationship between three linked documents A, B, and C in a hypermedia database",
      ),
      " is a diagram of the relationship between three linked documents in a database;\n",
      makePreview(
        "FIG. 2",
        [2],
        "Diagram of a three-document Web illustrating rank propagation and backlink contributions",
      ),
      " is a diagram of a three-document Web illustrating rank propagation; and\n",
      makePreview(
        "FIG. 3",
        [3],
        "Flowchart of an iterative power iteration method for computing document ranks",
      ),
      " is a flowchart of one embodiment of the iterative rank calculation method.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Relationship between three linked documents A, B, and C"),
      ", a linked database contains documents A, B, and C. Document A has outgoing links pointing to documents B and C. Document B has an outgoing link pointing to document C, and document C has an outgoing link pointing to document A. In the terminology of the present invention, document A is a ",
      term(
        "linking document",
        "Linking Document / Forward Link",
        "A document containing a directed hyperlink pointing to a destination target document.",
      ),
      " (or parent node) with respect to B and C, while document B is a ",
      term(
        "linked document",
        "Linked Document / Backlink",
        "A document that is the destination target of an incoming directed hyperlink from a source document.",
      ),
      " (or child node) with respect to A.",
    ),
    p(
      "In the preferred embodiment, the rank R(u) of a document u is defined recursively as: R(u) = (1 - d) + d * sum_{v in B(u)} [R(v) / N(v)], where B(u) is the set of documents that link to u, N(v) is the total number of outgoing links from document v, and ",
      term(
        "d",
        "Damping Factor (Alpha)",
        "A constant probability parameter (typically 0.85) representing the likelihood that a user follows a hyperlink rather than making a random jump to an arbitrary web document.",
      ),
      " is a damping factor between 0 and 1 (typically chosen to be ~0.85).",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Rank propagation across documents A, B, and C"),
      ", the propagation of rank across documents A, B, and C demonstrates that a document receives substantial rank even from a small number of incoming links if those linking documents themselves have high ranks. Conversely, links from low-ranking documents contribute relatively small increments of rank.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Iterative rank computation flowchart"),
      ", the rank computation process begins at step 101 by initializing an N-dimensional rank vector p_0. In step 102, a stochastic transition matrix A is constructed representing the normalized link adjacency structure. In step 103, successive rank approximations p_{i+1} = A * p_i are iteratively calculated using the ",
      term(
        "power iteration",
        "Power Iteration Method",
        "An iterative numerical linear algebra algorithm that computes the dominant eigenvector corresponding to the eigenvalue lambda = 1 of a Markov transition matrix.",
      ),
      " method until convergence is achieved within a predetermined tolerance threshold epsilon (step 104).",
    ),
    p(
      "The rank vector p represents the ",
      term(
        "dominant eigenvector",
        "Stationary Eigenvector",
        "The unique principal eigenvector of the stochastic Google transition matrix corresponding to eigenvalue lambda = 1, representing long-term document popularity.",
      ),
      " of the link transition matrix. Because the matrix is modified with the uniform random jump distribution (1 - d) / N, the graph is rendered irreducible and aperiodic, guaranteeing the existence of a unique, strictly positive stationary probability vector that converges rapidly in approximately 50 to 100 iterations regardless of initial conditions.",
    ),
    p(
      "In another aspect of the invention, the link weights can be adjusted based on domain name, user browsing history, or geographic location. Furthermore, in search engine applications, ",
      term(
        "anchor text",
        "Hyperlink Anchor Text",
        "The descriptive textual label associated with an outgoing hyperlink, which is indexed and attributed to the destination document.",
      ),
      " from incoming hyperlinks is indexed alongside the target document, allowing documents without explicit keywords in their body text to match relevant search queries based on how the broader Web describes them.",
    ),
    p(
      "In another embodiment, document ranks are used to annotate links displayed in Web browsers or directory portals, enabling users to visually assess the authority and quality of linked destinations before clicking.",
    ),
    p(
      "The calculation system is implemented across a distributed cluster of networked computing systems comprising high-speed processors, random access memory for storing link adjacency graphs, and non-volatile storage for indexing billions of hypermedia documents.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        {
          kind: "text",
          text: "A computer implemented method of scoring a plurality of linked documents, comprising: obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; assigning a score to each of the linked documents based on scores of the one or more linking documents and processing the linked documents according to their scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the number of links to the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on an 10 estimation of a probability that a linking document Will be accessed, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the URL, host, domain, author, institution, or last update time of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on Whether the one or more linking documents are selected documents or roots, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the importance, visibility or textual emphasis of the links in the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on a particular user\u2019s preferences, the rate at Which users access the one or more linking documents, or the importance of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 8,
      inlines: [
        {
          kind: "text",
          text: "A computer implemented method of determining a score for a plurality of linked documents, comprising: obtaining a plurality of linked documents; selecting one of the linked documents; assigning a score to the selected document that is dependent on scores of documents that link to the selected document; and processing the linked documents according to their scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 9,
      inlines: [
        {
          kind: "text",
          text: "A computer implemented method of ranking a plurality of linked documents, comprising: obtaining a plurality of documents, at least some of the documents being linked documents and at least some of the documents being linking documents, at least some of the linking documents also being linked documents, each of the linked documents being pointed to by a link in one or more of the linking documents; generating an initial estimate of a rank for each of the linked documents; updating the estimate of the rank for each of the linked documents using ranks for the one or more linking documents; and processing the linked documents according to their updated ranks.",
        },
      ],
    },
    {
      kind: "claim",
      number: 10,
      inlines: [
        {
          kind: "text",
          text: "A computer implemented method of ranking a plurality of linked documents, comprising: automatically performing a random traversal of a plurality of linked documents, the random traversal including selecting a random link to traverse in a current linked document; for each linked document that is traversed, assigning a rank to the linked document that is dependent on the number of times the linked document has been traversed; and processing the plurality of linked documents according to their rank.",
        },
      ],
    },
    {
      kind: "claim",
      number: 11,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 10, Wherein there is a predetermined probability that the next linked document to be traversed Will be a random one according to a distribution of the plurality of linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the processing includes: displaying links to the linked documents as a directory listing.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the processing includes: displaying links to the linked documents, and displaying annotations representing the score of each of the linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 13, Wherein the annotations are bars, icons, or text.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, further comprising: processing the linked documents based on textual match ing.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 15, Wherein the textual matching includes matching anchor text associated With the links.",
        },
      ],
    },
    {
      kind: "claim",
      number: 17,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, further comprising: processing the linked documents based on groupings of the linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 18,
      inlines: [
        {
          kind: "text",
          text: "A computer-readable medium that stores instructions executable by one or more processing devices to perform a method for determining scores for a plurality of linked documents, comprising: instructions for obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; instructions for determining a score for each of the linked documents based on scores for the one or more linking documents; and instructions for processing the linked documents accord ing to their scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 19,
      inlines: [
        {
          kind: "text",
          text: "A computer-readable medium that stores instructions executable by one or more processors to perform a method for scoring documents, comprising: instructions for searching a plurality of documents, at least some of the documents being linked documents and at least some of the documents being linking documents, at least some of the linking documents also being linked documents, each of the linked documents being pointed to by a link in one or more of the linking documents; instructions for scoring each of the linked documents based on scores for the one or more linking documents; and instructions for providing the linked documents based on their scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 20,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: determining the score based on (1) a number of the linking documents that link to the linked document and (2) an importance of the linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 20, Wherein the importance of the linking documents is based on a number of documents that link to the linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: associating one or more backlinks With each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a Weight to each of the backlinks, and determining a score for each of the linked documents based on a number of backlinks for the linked docu ment and the Weights assigned to the backlinks.",
        },
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 22, Wherein the processing of the linked documents includes: organiZing the linked documents based on the determined scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 22, Wherein the assigning a Weight includes: assigning different Weights to at least some of the back links associated With at least one of the linked docu ments.",
        },
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: associating one or more backlinks With each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a Weight to each of the backlinks, and determining a score for each of the linked documents based on a sum of the Weights assigned to the backlinks associated With the linked document.",
        },
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 25, Wherein the Weights assigned to each of the backlinks are independent of teXt of the corresponding linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: determining the score primarily based on linking infor mation.",
        },
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: determining the score substantially independent of user query content.",
        },
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, Wherein the assigning a score includes: iteratively determining the score for a linked document, the score being primarily based on document-linking information and substantially independent of user query content.",
        },
      ],
    },
  ],
};

export const pagerankEdition = pagerankArchivalEdition;
