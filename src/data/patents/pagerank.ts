import type { Patent } from "@/types/patent";
import { pagerankArchivalEdition } from "../editions/pagerankEdition";

export const pagerankPatent: Patent = {
  id: "us-6285999-pagerank",
  archivalEdition: pagerankArchivalEdition,
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
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A computer-implemented method of assigning an importance rank to nodes in a linked database, comprising: determining a plurality of citing nodes that contain links to a selected node; calculating an initial rank for each citing node; and updating the importance rank of the selected node by summing contributions from each citing node, wherein each contribution is proportional to the citing node's rank divided by its total number of outbound links, and scaled by a damping factor representing a transition probability.",
      plainEnglish:
        "A method for objectively scoring web documents by treating hyperlinks as weighted votes from citing pages.",
      keyInnovations: [
        "Hyperlink citation graph modeling",
        "Damping factor random surfer simulation",
        "Eigenvector stationary probability distribution",
      ],
    },
  ],
  drawings: [],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
  },
  tags: ["search", "algorithms", "graph theory", "internet", "google"],
};
