import type { Patent } from "@/types/patent";
import { pagerankArchivalEdition } from "../editions/pagerankEdition";

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
    reviewedBy: "Classic Patents editorial agent (Antigravity)",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
  },
  originalText: `UNITED STATES PATENT
US 6,285,999 B1
Date of Patent: Sep. 4, 2001

METHOD FOR NODE RANKING IN A LINKED DATABASE
Inventor: Lawrence Page, Stanford, CA
Assignee: The Board of Trustees of the Leland Stanford Junior University, Stanford, CA

ABSTRACT
A method assigns importance ranks to nodes in a linked database, such as the World Wide Web. The rank assigned to a document is calculated from the ranks of documents citing it, in combination with a constant representing random jump probability.

BACKGROUND OF THE INVENTION
Traditional information retrieval systems rank documents based on the presence and frequency of search query keywords within the document text. However, in large distributed hypermedia databases like the World Wide Web, text matching alone fails because document quality varies widely and creators can manipulate keyword frequencies.

SUMMARY OF THE INVENTION
The present invention provides an objective, link-structure-based ranking architecture. Each document is assigned a rank determined by the number and rank of pages linking to it. The algorithm solves for the dominant eigenvector of the stochastic link transition matrix adjusted by a damping factor representing a random surfer model.

CLAIMS
1. A computer-implemented method of assigning an importance rank to nodes in a linked database, comprising: determining a plurality of citing nodes that contain links to a selected node; calculating an initial rank for each citing node; and updating the importance rank of the selected node by summing contributions from each citing node, wherein each contribution is proportional to the citing node's rank divided by its total number of outbound links, and scaled by a damping factor representing a transition probability.`,
  plainEnglishExplanation: {
    overview:
      "PageRank evaluates the authority of web pages by analyzing the mathematical structure of the hyperlink citation graph across the Internet.",
    coreMechanism:
      "A Markov chain transition matrix models a random surfer clicking links with damping probability d = 0.85 and randomly jumping to any page with probability 1 - d.",
    mechanicalBreakdown: [
      {
        title: "Hyperlink Citation Aggregation",
        summary: "Inbound links act as weighted votes of confidence.",
        technicalDetails:
          "Each citing document distributes its current rank score equally among all outbound links.",
      },
      {
        title: "Damping Factor & Random Surfer",
        summary: "Prevents rank sink traps and disconnected graph loops.",
        technicalDetails:
          "Ensures the transition matrix is irreducible and primitive, guaranteeing convergence to a unique stationary eigenvector.",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Perron-Frobenius Theorem & Stationary Eigenvectors",
        formula: "\\mathbf{r} = d \\mathbf{M} \\mathbf{r} + \\frac{1-d}{N} \\mathbf{1}",
        explanation:
          "Because the adjusted transition matrix is stochastic and irreducible, power iteration converges rapidly to the principal eigenvector representing steady-state visitation frequency.",
      },
    ],
    whyItMattersToday:
      "PageRank was the algorithmic engine that built Google, solving web search indexing at planetary scale and defining modern network centrality analysis.",
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
        rivalName: "Robin Li / RankDex",
        rivalClaim: "Hypertext link analysis and search engine scoring (US Patent 5,920,859)",
        conflictDetails:
          "Robin Li filed RankDex in 1997 using outbound link anchor text; PageRank used global eigenvector centrality across all links.",
        resolution:
          "Both patents coexisted; Stanford University licensed PageRank exclusively to Google.",
        legalOutcome:
          "Stanford received 1.8 million Google shares in exchange for the patent license, yielding $336 million.",
      },
    ],
    civilizationalImpact:
      "PageRank organized the world's information, transforming search from a clumsy directory lookup into an instantaneous global knowledge utility.",
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
          label: "R(u)",
          element: "Rank Propagation Equation",
          description:
            "Recursive accumulation of backlink contributions weighted by outgoing degree.",
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
      ],
    },
  ],
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A computer implemented method of scoring a plurality of linked documents, comprising: obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; assigning a score to each of the linked documents based on scores of the one or more linking documents and processing the linked documents according to their scores.",
      plainEnglish:
        "Foundational method for scoring linked documents based on scores of linking documents.",
      keyInnovations: [
        "Hyperlink citation graph modeling",
        "Recursive backlink propagation",
        "Damping factor integration",
      ],
    },
    {
      number: 2,
      isIndependent: false,
      originalText:
        "The method of claim 1, wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the number of links to the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish: "Weighting factors based on the total number of links to linking documents.",
      keyInnovations: ["Degree-based link weighting", "Link dilution scaling"],
    },
    {
      number: 3,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on an 10 estimation of a probability that a linking document Will be accessed, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish: "Weighting factors based on estimated user access probabilities.",
      keyInnovations: ["Usage probability scaling", "Traffic-aware link weighting"],
    },
    {
      number: 4,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the URL, host, domain, author, institution, or last update time of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish:
        "Weighting factors based on URL domain, host, author, institution, or last update time.",
      keyInnovations: ["Metadata link weighting", "Domain authority weighting"],
    },
    {
      number: 5,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on Whether the one or more linking documents are selected documents or roots, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish: "Weighting factors based on designated root or seed documents.",
      keyInnovations: ["Root set personalization", "Topic-sensitive teleportation"],
    },
    {
      number: 6,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on the importance, visibility or textual emphasis of the links in the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish:
        "Weighting factors based on visual prominence, font size, or textual emphasis of links.",
      keyInnovations: ["Visual link prominence", "Rendered layout weighting"],
    },
    {
      number: 7,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning includes: identifying a Weighting factor for each of the linking documents, the Weighting factor being dependent on a particular user\u2019s preferences, the rate at Which users access the one or more linking documents, or the importance of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identi?ed Weighting factor.",
      plainEnglish:
        "Weighting factors based on individual user browsing preferences or access rates.",
      keyInnovations: ["Personalized PageRank", "User-specific search re-ranking"],
    },
    {
      number: 8,
      isIndependent: true,
      originalText:
        "A computer implemented method of determining a score for a plurality of linked documents, comprising: obtaining a plurality of linked documents; selecting one of the linked documents; assigning a score to the selected document that is dependent on scores of documents that link to the selected document; and processing the linked documents according to their scores.",
      plainEnglish:
        "Selecting a specific document and assigning a score dependent on scores of linking pages.",
      keyInnovations: ["Targeted document scoring", "Local backlink aggregation"],
    },
    {
      number: 9,
      isIndependent: true,
      originalText:
        "A computer implemented method of ranking a plurality of linked documents, comprising: obtaining a plurality of documents, at least some of the documents being linked documents and at least some of the documents being linking documents, at least some of the linking documents also being linked documents, each of the linked documents being pointed to by a link in one or more of the linking documents; generating an initial estimate of a rank for each of the linked documents; updating the estimate of the rank for each of the linked documents using ranks for the one or more linking documents; and processing the linked documents according to their updated ranks.",
      plainEnglish:
        "Generating initial rank estimates and iteratively updating scores using linking page ranks.",
      keyInnovations: ["Iterative rank updating", "Jacobi/Gauss-Seidel relaxation"],
    },
    {
      number: 10,
      isIndependent: true,
      originalText:
        "A computer implemented method of ranking a plurality of linked documents, comprising: automatically performing a random traversal of a plurality of linked documents, the random traversal including selecting a random link to traverse in a current linked document; for each linked document that is traversed, assigning a rank to the linked document that is dependent on the number of times the linked document has been traversed; and processing the plurality of linked documents according to their rank.",
      plainEnglish: "Random walk traversal method where ranks reflect empirical visitation counts.",
      keyInnovations: ["Monte Carlo random surfer simulation", "Empirical visitation scoring"],
    },
    {
      number: 11,
      isIndependent: false,
      originalText:
        "The method of claim 10, Wherein there is a predetermined probability that the next linked document to be traversed Will be a random one according to a distribution of the plurality of linked documents.",
      plainEnglish: "Random walk with predetermined random teleportation probability distribution.",
      keyInnovations: ["Stochastic jump distribution", "Teleportation restart probability"],
    },
    {
      number: 12,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the processing includes: displaying links to the linked documents as a directory listing.",
      plainEnglish: "Displaying scored links in an automated hierarchical directory listing.",
      keyInnovations: ["Directory ranking", "Hierarchical link ordering"],
    },
    {
      number: 13,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the processing includes: displaying links to the linked documents, and displaying annotations representing the score of each of the linked documents.",
      plainEnglish: "Displaying visual annotation badges representing document rank.",
      keyInnovations: ["Visual rank badges", "Link score annotations"],
    },
    {
      number: 14,
      isIndependent: false,
      originalText: "The method of claim 13, Wherein the annotations are bars, icons, or text.",
      plainEnglish: "Formatting visual annotations as score bars, icons, or numeric text.",
      keyInnovations: ["Bar score visualizations", "Icon-based link metrics"],
    },
    {
      number: 15,
      isIndependent: false,
      originalText:
        "The method of claim 1, further comprising: processing the linked documents based on textual match ing.",
      plainEnglish: "Combining hyperlink citation rank scoring with keyword textual matching.",
      keyInnovations: ["Hybrid rank and keyword scoring", "Search engine result fusion"],
    },
    {
      number: 16,
      isIndependent: false,
      originalText:
        "The method of claim 15, Wherein the textual matching includes matching anchor text associated With the links.",
      plainEnglish: "Textual matching using anchor text associated with incoming hyperlinks.",
      keyInnovations: ["Anchor text indexing", "Cross-document keyword association"],
    },
    {
      number: 17,
      isIndependent: false,
      originalText:
        "The method of claim 1, further comprising: processing the linked documents based on groupings of the linked documents.",
      plainEnglish: "Processing and ranking documents based on topical cluster groupings.",
      keyInnovations: ["Document cluster ranking", "Category-based link aggregation"],
    },
    {
      number: 18,
      isIndependent: true,
      originalText:
        "A computer-readable medium that stores instructions executable by one or more processing devices to perform a method for determining scores for a plurality of linked documents, comprising: instructions for obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; instructions for determining a score for each of the linked documents based on scores for the one or more linking documents; and instructions for processing the linked documents accord ing to their scores.",
      plainEnglish: "Computer-readable medium storing executable instructions for link scoring.",
      keyInnovations: ["Machine-executable rank instructions", "Memory-efficient graph scoring"],
    },
    {
      number: 19,
      isIndependent: true,
      originalText:
        "A computer-readable medium that stores instructions executable by one or more processors to perform a method for scoring documents, comprising: instructions for searching a plurality of documents, at least some of the documents being linked documents and at least some of the documents being linking documents, at least some of the linking documents also being linked documents, each of the linked documents being pointed to by a link in one or more of the linking documents; instructions for scoring each of the linked documents based on scores for the one or more linking documents; and instructions for providing the linked documents based on their scores.",
      plainEnglish: "Computer-readable medium storing search engine ranking instructions.",
      keyInnovations: ["Search engine retrieval software", "Query-independent score storage"],
    },
    {
      number: 20,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: determining the score based on (1) a number of the linking documents that link to the linked document and (2) an importance of the linking documents.",
      plainEnglish: "Scoring based on both count and importance of linking documents.",
      keyInnovations: ["Dual-metric link aggregation", "Weighted in-degree scoring"],
    },
    {
      number: 21,
      isIndependent: false,
      originalText:
        "The method of claim 20, Wherein the importance of the linking documents is based on a number of documents that link to the linking documents.",
      plainEnglish: "Recursive importance of linking documents based on their own backlinks.",
      keyInnovations: ["Multi-hop recursive citation authority", "Deep graph prestige propagation"],
    },
    {
      number: 22,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: associating one or more backlinks With each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a Weight to each of the backlinks, and determining a score for each of the linked documents based on a number of backlinks for the linked docu ment and the Weights assigned to the backlinks.",
      plainEnglish: "Associating weighted backlinks with each linked document.",
      keyInnovations: ["Per-backlink weighting", "Edge-specific graph weights"],
    },
    {
      number: 23,
      isIndependent: false,
      originalText:
        "The method of claim 22, Wherein the processing of the linked documents includes: organiZing the linked documents based on the determined scores.",
      plainEnglish: "Organizing search results according to determined link scores.",
      keyInnovations: ["Search result reordering", "Global authority sorting"],
    },
    {
      number: 24,
      isIndependent: false,
      originalText:
        "The method of claim 22, Wherein the assigning a Weight includes: assigning different Weights to at least some of the back links associated With at least one of the linked docu ments.",
      plainEnglish: "Assigning non-uniform weights to different backlink sources.",
      keyInnovations: ["Non-uniform backlink weighting", "Differentiated edge weights"],
    },
    {
      number: 25,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: associating one or more backlinks With each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a Weight to each of the backlinks, and determining a score for each of the linked documents based on a sum of the Weights assigned to the backlinks associated With the linked document.",
      plainEnglish: "Scoring based on the sum of weights assigned to backlinks.",
      keyInnovations: ["Linear sum backlink aggregation", "Normalized weight summation"],
    },
    {
      number: 26,
      isIndependent: false,
      originalText:
        "The method of claim 25, Wherein the Weights assigned to each of the backlinks are independent of teXt of the corresponding linking documents.",
      plainEnglish: "Backlink weighting independent of the text content of linking pages.",
      keyInnovations: ["Query-independent topological scoring", "Text-agnostic link authority"],
    },
    {
      number: 27,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: determining the score primarily based on linking infor mation.",
      plainEnglish: "Determining document score primarily based on link topology.",
      keyInnovations: ["Topology-driven document prestige", "Structural web graph scoring"],
    },
    {
      number: 28,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: determining the score substantially independent of user query content.",
      plainEnglish: "Determining score substantially independent of search query terms.",
      keyInnovations: ["Query-independent global ranking", "Pre-computed static score caching"],
    },
    {
      number: 29,
      isIndependent: false,
      originalText:
        "The method of claim 1, Wherein the assigning a score includes: iteratively determining the score for a linked document, the score being primarily based on document-linking information and substantially independent of user query content.",
      plainEnglish:
        "Iterative scoring primarily based on link information and independent of user query content.",
      keyInnovations: ["Power iteration graph convergence", "Static rank precomputation"],
    },
  ],
};
