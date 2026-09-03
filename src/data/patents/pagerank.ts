import type { Patent } from "@/types/patent";
import { pagerankArchivalEdition, pagerankManualClaimText } from "../editions/pagerankEdition";

const PAGE_RANK_CLAIM_DECODERS: Record<number, string> = {
  1: "This foundational method claim scores a linked-document population from the scores of documents pointing to it, then uses those scores to process the documents; it requires establishing linked, linking, and dual-role graph relationships.",
  2: "This dependent claim makes each source document's score contribution inversely or directly depend on the number of links associated with that source, adjusting each linking document's score based on that degree-based weighting factor.",
  3: "This dependent claim permits an access-weighting factor based on an estimation of the probability that a linking document will actually be navigated or accessed by users, adjusting graph contributions accordingly.",
  4: "This dependent claim applies metadata-based weighting factors derived from the URL, host name, domain, author identity, publishing institution, or last-update timestamp of the linking document when adjusting its propagated ranking score.",
  5: "This dependent claim provides weighting factors based on whether linking documents are specifically designated seed documents or root nodes of Internet domains, prioritizing structural authority in the score propagation.",
  6: "This dependent claim adjusts linking document scores based on visual and layout factors, including link importance, graphical visibility, font size, or typographical textual emphasis within the source document's rendered page.",
  7: "This dependent claim adjusts linking document scores based on personalized user preferences, observed access traffic rates, or global document importance, combining historical usage signals with graph structure.",
  8: "This independent method claim selects a specific document from a linked corpus, computes its score as a function of the scores of all documents linking to it, and processes the corpus according to the resulting scores.",
  9: "This independent iterative method claim assigns an initial estimate of rank to each linked document, iteratively updates each estimate using the ranks of linking documents, and processes the documents according to their final updated ranks.",
  10: "This independent method claim performs an automated random traversal across a linked hypermedia corpus, selects random links in currently visited documents, counts traversal frequencies as rank evidence, and processes documents according to their visit ranks.",
  11: "This dependent random-traversal claim introduces a damping parameter with a predetermined probability that the next document visited is chosen randomly from a corpus-wide distribution rather than following a forward link.",
  12: "This claim applies the link-based document scores of claim 1 to human interface navigation, specifically requiring the processing step to format and display links to the ranked documents as an organized directory listing.",
  13: "This claim applies claim 1's link scores to user interface presentation by displaying links alongside explicit visual annotations, bars, or numeric scores representing the computed importance rank of each destination document.",
  14: "This claim specifically narrows the visual rank annotations of claim 13 to graphical metric bars, icon indicators, or explicit alphanumeric text strings displayed adjacent to each presented hypertext link.",
  15: "This claim combines link-graph scoring with information retrieval by adding a textual matching processing step that evaluates document body text against incoming search queries alongside graph centrality scores.",
  16: "This claim narrows the textual matching of claim 15 specifically to hyperlink anchor text, using the descriptive anchor labels attached to incoming backlinks as searchable text for destination pages.",
  17: "This claim adds document grouping to the processing of claim 1, organizing and presenting search results categorized by domain host, topical cluster, or structural grouping according to their ranks.",
  18: "This independent computer-readable medium claim stores instructions for retrieving linked documents, computing individual scores based on the scores of linking documents in the graph, and processing the documents according to their scores.",
  19: "This independent computer-readable medium claim stores instructions for searching a linked document collection, scoring each document based on scores of linking documents, and outputting search results ordered by their computed scores.",
  20: "This dependent claim specifies that assigning a document score requires evaluating both the raw quantity of linking documents that point to it and the intrinsic quality or importance of those linking documents.",
  21: "This claim establishes recursive graph centrality by specifying that the importance of each linking document is itself determined by the quantity and importance of documents linking to that linking document.",
  22: "This claim associates individual backlink objects with each linked document, assigns discrete weighting factors to each backlink, and calculates overall document scores from both the backlink count and assigned weights.",
  23: "This claim requires the processing step of claim 22 to sort and organize the retrieved documents into an ordered search results listing ranked by their determined weighted backlink scores.",
  24: "This claim permits assigning differential, non-uniform weights across different backlinks pointing to the same document, enabling selective edge-weight adjustments based on trust, topical relevance, or domain separation.",
  25: "This claim computes a document's overall ranking score by summing the individual weights assigned to each of its associated incoming backlinks across the entire directed graph structure.",
  26: "This claim requires that the weights assigned to individual backlinks in claim 25 are computed strictly from link topology and metadata, remaining independent of the textual content within the linking documents.",
  27: "This claim requires that the calculated document score is determined primarily from structural hyperlink network topology rather than from unweighted on-page keyword density or manual catalog classifications.",
  28: "This claim establishes query-independent global ranking by requiring that the document score is computed substantially independently of the specific search terms entered in any individual user query.",
  29: "This claim requires iteratively computing document ranking scores based primarily on hyperlink graph topology, in an offline pre-computation process that is substantially independent of user search query content.",
};

function pagerankClaimDecoder(number: number): string {
  const decoder = PAGE_RANK_CLAIM_DECODERS[number];
  if (!decoder) throw new Error(`PageRank claim decoder missing for claim ${number}.`);
  return decoder;
}

export const pagerankPatent: Patent = {
  id: "us-6285999-pagerank",
  patentNumber: "US 6,285,999",
  title: "Method for Node Ranking in a Linked Database",
  shortTitle: "Google PageRank Algorithm",
  subtitle: "Stochastic Link Transition Eigenvector & Random Surfer Centrality",
  inventors: ["Lawrence Page"],
  inventorLocation: "Stanford, California",
  grantDate: "2001-09-04",
  filingDate: "1998-01-09",
  era: "Internet & Modern Computing (1990–Present)",
  category: "computing",
  categoryLabel: "Information Retrieval & Web Algorithms",
  summary:
    "The Foundation of the Modern Internet Search Engine: Larry Page's 1998 patent revolutionized information retrieval by shifting the basis of relevance from simple on-page keyword matching to graph-theoretic link citation analysis. The PageRank algorithm models an idealized random surfer traversing the World Wide Web, calculating the stationary probability distribution of arriving at any given document.",
  heroQuote:
    "The rank of a document is calculated from the ranks of documents citing it, in combination with a constant representing the probability of a random jump.",
  originalPdfUrl: "/patents/pdfs/us-6285999-pagerank.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US6285999B1/en",
  usptoClassification: "G06F 17/30 (Information retrieval; Database structures)",
  archivalEdition: pagerankArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6285999-pagerank-reviewed.txt",
    pageCount: 12,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5 Codex)",
    reviewedAt: "2026-09-02",
    sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
    pageAnchors: [
      {
        page: 1,
        exactSourceText: "Patent No.: US 6,285,999 B1",
        sourceRelationship:
          "Grant masthead, bibliographic record, references, abstract, and partial diagram.",
      },
      {
        page: 2,
        exactSourceText: "OTHER PUBLICATIONS",
        sourceRelationship: "Continuation of the printed other-publications list.",
      },
      {
        page: 3,
        exactSourceText: "U.S. Patent Sep. 4, 2001 Sheet 1 of 3 US 6,285,999 B1",
        sourceRelationship: "Figure 1 drawing sheet.",
      },
      {
        page: 4,
        exactSourceText: "U.S. Patent Sep. 4, 2001 Sheet 2 of 3 US 6,285,999 B1",
        sourceRelationship: "Figure 2 drawing sheet.",
      },
      {
        page: 5,
        exactSourceText: "U.S. Patent Sep. 4, 2001 Sheet 3 of 3 US 6,285,999 B1",
        sourceRelationship: "Figure 3 drawing sheet.",
      },
      {
        page: 6,
        exactSourceText: "METHOD FOR NODE RANKING IN A LINKED DATABASE",
        sourceRelationship: "Opening specification page through the opening summary.",
      },
      {
        page: 7,
        exactSourceText: "BRIEF DESCRIPTION OF THE DRAWINGS",
        sourceRelationship:
          "Summary continuation, drawing descriptions, detailed-description opening, and rank recurrence.",
      },
      {
        page: 8,
        exactSourceText: "In practice, there are millions of documents",
        sourceRelationship:
          "Figure 2 calculation, iterative procedure, random-surfer model, and transition-matrix description.",
      },
      {
        page: 9,
        exactSourceText: "Another important application and embodiment of the present invention",
        sourceRelationship:
          "Weighting variants, Web-search embodiment, conclusion, and opening Claim 1.",
      },
      {
        page: 10,
        exactSourceText: "2. The method of claim 1",
        sourceRelationship:
          "Claims 2 through 19 after Claim 1 ends on the preceding two-column source page.",
      },
      {
        page: 11,
        exactSourceText: "20. The method of claim 1",
        sourceRelationship: "Claims 20 through 29.",
      },
      {
        page: 12,
        exactSourceText: "CERTIFICATE OF CORRECTION",
        sourceRelationship: "USPTO certificate correcting the government-support paragraph.",
      },
    ],
  },
  originalText: `UNITED STATES PATENT
US 6,285,999 B1
Date of Patent: Sep. 4, 2001

METHOD FOR NODE RANKING IN A LINKED DATABASE
Inventor: Lawrence Page, Stanford, CA (US)
Assignee: The Board of Trustees of the Leland Stanford Junior University, Stanford, CA (US)
Appl. No.: 09/004,827 Filed: Jan. 9, 1998

ABSTRACT
A method assigns importance ranks to nodes in a linked database, such as any database of documents containing citations, the World Wide Web or any other hypermedia database. The rank assigned to a document is calculated from the ranks of documents citing it. In addition, the rank of a document is calculated from a constant representing the probability that a browser through the database will randomly jump to the document. The method is particularly useful in enhancing the performance of search engine results for hypermedia databases, such as the World Wide Web, whose documents have a large variation in quality.

CROSS-REFERENCES TO RELATED APPLICATIONS
This application claims priority from U.S. provisional patent application Ser. No. 60/035,205 filed Jan. 10, 1997, which is incorporated herein by reference.

FIELD OF THE INVENTION
This invention relates generally to techniques for analyzing linked databases. More particularly, it relates to methods for assigning ranks to nodes in a linked database, such as any database of documents containing citations, the World Wide Web or any other hypermedia database.

BACKGROUND OF THE INVENTION
Due to the developments in computer technology and its increase in popularity, large numbers of people have recently started to frequently search huge databases. Information retrieval systems are traditionally judged by their precision and recall, but large databases contain many low quality documents and search results can camouflage the few relevant ones. Search engines rank documents using variations of a vector space model, including recency and term position, but these results remain vulnerable to spamming techniques that artificially inflate relevance.

SUMMARY
Various aspects of the present invention provide systems and methods for ranking documents in a linked database. The invention takes advantage of linked structure to assign a rank from extrinsic relationships: a document can be important because it is cited by other important documents.`,
  plainEnglishExplanation: {
    overview:
      "The patent assigns scores to linked documents from the extrinsic structure of their graph. It treats a hyperlink as a directed relation, then recursively weights a destination by the ranks of its backlink pages and by each source page's number of forward links.",
    coreMechanism:
      "The source uses alpha for the random-jump probability, typically around 0.1 to 0.15, and one minus alpha for normalized forward-link propagation. The resulting transition matrix is iterated from p0 toward a steady-state vector; this page does not substitute the later 0.85 convention for the patent's notation.",
    mechanicalBreakdown: [
      {
        title: "Hyperlink Citation Aggregation",
        summary:
          "A destination receives weighted contributions from the documents that link to it.",
        technicalDetails:
          "For a source B, its rank is divided by |B|, the number of forward links, before its contribution is added to a destination; alpha/N supplies the random-jump term.",
      },
      {
        title: "Damping Factor & Random Surfer",
        summary:
          "A random-jump term limits concentration in link loops and supports a bounded iterative model.",
        technicalDetails:
          "The patent discusses childless pages, removing them during iteration and adding them back, and normalizing the vector. It does not promise a universal iteration count or claim that every graph is irreducible.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Perron-Frobenius Theorem & Stationary Eigenvectors",
        formula: "r(A) = \\frac{\\alpha}{N} + (1-\\alpha)\\sum_{i=1}^{n}\\frac{r(B_i)}{|B_i|}",
        explanation:
          "The source defines alpha as the probability of a random jump, normalizes each backlink contribution by its forward-link count, and interprets the converged vector as a steady-state probability distribution. The implementation exposes the source-bounded recurrence rather than asserting an unproved runtime guarantee.",
      },
    ],
    whyItMattersToday:
      "The patent’s link-based score became a foundation for Web search and later graph-centrality work. Its enduring lesson is narrower than a claim that it alone built modern search: rank can be computed from a graph’s directed relationships, then combined with text, anchor context, titles, and user-specific starting distributions.",
  },
  historicalContext: {
    problemStatement:
      "Early search engines indexed web pages solely by keyword density, enabling webmasters to spam results with invisible repeated text.",
    priorArtLimitations: [
      "Keyword stuffing",
      "No concept of editorial authority",
      "Manual directory curation could not scale",
    ],
    breakthroughInsight:
      "Academic citation indexing (where citations indicate influence) could be adapted to recursive web hyperlink topologies.",
    patentWars: [
      {
        rivalName: "Robin Li & RankDex / Baidu",
        rivalClaim:
          "Robin Li invented RankDex in 1996 and was granted US Patent No. 5,920,859 in 1999 for hyperlink analysis to score website popularity, claiming earlier priority over Page's 1998 PageRank filing.",
        conflictDetails:
          "Li's RankDex scored search results by analyzing anchor text and inbound links. Page and Brin's PageRank introduced a mathematical Markov random walk model where the authority of the linking page recursively weighted the target page.",
        resolution:
          "The USPTO determined that PageRank's recursive eigenvector probability distribution constituted a distinct, patentable algorithm, granting US 6,285,999 to Stanford University, which exclusively licensed it to Google.",
        legalOutcome:
          "Stanford's PageRank patent provided the intellectual property foundation for Google's search engine, with Stanford earning $336 million when it sold its Google equity in 2005.",
      },
    ],
    civilizationalImpact:
      "The source-bounded contribution is a scalable way to rank nodes from directed relationships, not a promise that rank equals truth or traffic. That graph perspective influenced Web search and subsequent network-analysis systems.",
    aftermath:
      "The patent was granted September 4, 2001, and the record identifies Stanford as assignee. Google Patents lists the patent as expired after its term; later family continuations are separate records and are not folded into this edition.",
    sideNotes: [
      "The specification acknowledges Sergey Brin, Scott Hassan, Rajeev Motwani, Alan Steremberg, and Terry Winograd for support in reducing the invention to practice.",
      "The certificate of correction in the pinned twelve-page PDF replaces the government-support paragraph with a statement referring to contract 9411306 awarded by the National Science Foundation.",
    ],
  },
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Linked Database Node Graph",
      caption: "Diagram of three interconnected documents A, B, and C with directed hyperlinks.",
      svgType: "pagerank",
      callouts: [
        {
          id: "pr-node-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Document Node A",
          description: "Parent linking document with forward links pointing to documents B and C.",
          x: 25,
          y: 40,
        },
        {
          id: "pr-node-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Document Node B",
          description: "Intermediate document linking to document C.",
          x: 75,
          y: 30,
        },
        {
          id: "pr-node-c",
          figureRef: "Fig. 1",
          label: "C",
          element: "Document Node C",
          description:
            "Target document receiving backlinks from documents A and B and linking back to A.",
          x: 50,
          y: 80,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Hyperlink Rank Propagation Diagram",
      caption: "Diagram illustrating numerical rank flow across nodes A, B, and C.",
      svgType: "pagerank",
      callouts: [
        {
          id: "pr-rank-prop",
          figureRef: "Fig. 2",
          label: "0.4 / 0.2 / 0.4",
          element: "A, B, C rank example",
          description:
            "The source example assigns A=0.4, B=0.2, and C=0.4 when the random-jump term is omitted, then gives the alpha=0.5 equations and 14/39, 10/39, 15/39 solution.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Iterative Power Iteration Flowchart",
      caption:
        "Flowchart showing initialization, transition matrix multiplication, and convergence check.",
      svgType: "pagerank",
      callouts: [
        {
          id: "pr-step-101",
          figureRef: "Fig. 3",
          label: "101",
          element: "Initial Vector Initialization",
          description: "Selecting initial rank vector p_0 with uniform probability distribution.",
          x: 50,
          y: 20,
        },
        {
          id: "pr-step-103",
          figureRef: "Fig. 3",
          label: "103",
          element: "Matrix Multiplication Loop",
          description: "Iteratively calculating p_{i+1} = A * p_i until convergence.",
          x: 50,
          y: 60,
        },
        {
          id: "pr-step-105",
          figureRef: "Fig. 3",
          label: "105",
          element: "Rank extraction",
          description: "Determining r[k] from the kth component of the approximating vector p_n.",
          x: 50,
          y: 80,
        },
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: pagerankManualClaimText(1),
      plainEnglish: pagerankClaimDecoder(1),
      keyInnovations: [
        "Hyperlink citation graph modeling",
        "Recursive backlink propagation",
        "Damping factor integration",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(2),
      plainEnglish: pagerankClaimDecoder(2),
      keyInnovations: ["Degree-based link weighting", "Link dilution scaling"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(3),
      plainEnglish: pagerankClaimDecoder(3),
      keyInnovations: ["Usage probability scaling", "Traffic-aware link weighting"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(4),
      plainEnglish: pagerankClaimDecoder(4),
      keyInnovations: ["Metadata link weighting", "Domain authority weighting"],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(5),
      plainEnglish: pagerankClaimDecoder(5),
      keyInnovations: ["Root set personalization", "Topic-sensitive teleportation"],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(6),
      plainEnglish: pagerankClaimDecoder(6),
      keyInnovations: ["Visual link prominence", "Rendered layout weighting"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(7),
      plainEnglish: pagerankClaimDecoder(7),
      keyInnovations: ["Personalized PageRank", "User-specific search re-ranking"],
    },
    {
      number: 8,
      isIndependent: true,
      originalText: pagerankManualClaimText(8),
      plainEnglish: pagerankClaimDecoder(8),
      keyInnovations: ["Targeted document scoring", "Local backlink aggregation"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText: pagerankManualClaimText(9),
      plainEnglish: pagerankClaimDecoder(9),
      keyInnovations: ["Iterative rank updating", "Jacobi/Gauss-Seidel relaxation"],
    },
    {
      number: 10,
      isIndependent: true,
      originalText: pagerankManualClaimText(10),
      plainEnglish: pagerankClaimDecoder(10),
      keyInnovations: ["Monte Carlo random surfer simulation", "Empirical visitation scoring"],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [10],
      originalText: pagerankManualClaimText(11),
      plainEnglish: pagerankClaimDecoder(11),
      keyInnovations: ["Stochastic jump distribution", "Teleportation restart probability"],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(12),
      plainEnglish: pagerankClaimDecoder(12),
      keyInnovations: ["Directory ranking", "Hierarchical link ordering"],
    },
    {
      number: 13,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(13),
      plainEnglish: pagerankClaimDecoder(13),
      keyInnovations: ["Visual rank badges", "Link score annotations"],
    },
    {
      number: 14,
      isIndependent: false,
      dependsOn: [13],
      originalText: pagerankManualClaimText(14),
      plainEnglish: pagerankClaimDecoder(14),
      keyInnovations: ["Bar score visualizations", "Icon-based link metrics"],
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(15),
      plainEnglish: pagerankClaimDecoder(15),
      keyInnovations: ["Hybrid rank and keyword scoring", "Search engine result fusion"],
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [15],
      originalText: pagerankManualClaimText(16),
      plainEnglish: pagerankClaimDecoder(16),
      keyInnovations: ["Anchor text indexing", "Cross-document keyword association"],
    },
    {
      number: 17,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(17),
      plainEnglish: pagerankClaimDecoder(17),
      keyInnovations: ["Document cluster ranking", "Category-based link aggregation"],
    },
    {
      number: 18,
      isIndependent: true,
      originalText: pagerankManualClaimText(18),
      plainEnglish: pagerankClaimDecoder(18),
      keyInnovations: ["Machine-executable rank instructions", "Memory-efficient graph scoring"],
    },
    {
      number: 19,
      isIndependent: true,
      originalText: pagerankManualClaimText(19),
      plainEnglish: pagerankClaimDecoder(19),
      keyInnovations: ["Search engine retrieval software", "Query-independent score storage"],
    },
    {
      number: 20,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(20),
      plainEnglish: pagerankClaimDecoder(20),
      keyInnovations: ["Dual-metric link aggregation", "Weighted in-degree scoring"],
    },
    {
      number: 21,
      isIndependent: false,
      dependsOn: [20],
      originalText: pagerankManualClaimText(21),
      plainEnglish: pagerankClaimDecoder(21),
      keyInnovations: ["Multi-hop recursive citation authority", "Deep graph prestige propagation"],
    },
    {
      number: 22,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(22),
      plainEnglish: pagerankClaimDecoder(22),
      keyInnovations: ["Per-backlink weighting", "Edge-specific graph weights"],
    },
    {
      number: 23,
      isIndependent: false,
      dependsOn: [22],
      originalText: pagerankManualClaimText(23),
      plainEnglish: pagerankClaimDecoder(23),
      keyInnovations: ["Search result reordering", "Global authority sorting"],
    },
    {
      number: 24,
      isIndependent: false,
      dependsOn: [22],
      originalText: pagerankManualClaimText(24),
      plainEnglish: pagerankClaimDecoder(24),
      keyInnovations: ["Non-uniform backlink weighting", "Differentiated edge weights"],
    },
    {
      number: 25,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(25),
      plainEnglish: pagerankClaimDecoder(25),
      keyInnovations: ["Linear sum backlink aggregation", "Normalized weight summation"],
    },
    {
      number: 26,
      isIndependent: false,
      dependsOn: [25],
      originalText: pagerankManualClaimText(26),
      plainEnglish: pagerankClaimDecoder(26),
      keyInnovations: ["Query-independent topological scoring", "Text-agnostic link authority"],
    },
    {
      number: 27,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(27),
      plainEnglish: pagerankClaimDecoder(27),
      keyInnovations: ["Topology-driven document prestige", "Structural web graph scoring"],
    },
    {
      number: 28,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(28),
      plainEnglish: pagerankClaimDecoder(28),
      keyInnovations: ["Query-independent global ranking", "Pre-computed static score caching"],
    },
    {
      number: 29,
      isIndependent: false,
      dependsOn: [1],
      originalText: pagerankManualClaimText(29),
      plainEnglish: pagerankClaimDecoder(29),
      keyInnovations: ["Power iteration graph convergence", "Static rank precomputation"],
    },
  ],
  stats: { totalClaims: 29, independentClaims: 6 },
};
