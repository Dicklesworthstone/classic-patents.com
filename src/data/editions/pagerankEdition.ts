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
    "The abstract defines importance ranks from citing-document ranks and a constant random-jump probability for a linked database such as the Web.",
  ],
  4: [
    "The provisional application is identified as Ser. No. 60/035,205, filed January 10, 1997, and incorporated by reference.",
  ],
  6: [
    "The government-support paragraph identifies National Science Foundation grant IRI-9411306-4 and reserves government rights in the invention.",
  ],
  8: [
    "The field is techniques for analyzing linked databases and assigning ranks to nodes in citation, Web, or other hypermedia databases.",
  ],
  10: [
    "The background describes growing database searches, Web scale, precision and recall, and the difficulty of finding useful documents among many results.",
  ],
  11: [
    "Constraining a search to subsets or adding terms can remove the desired document when the database is heterogeneous or the information is not known precisely.",
  ],
  12: [
    "Vector-space ranking uses document recency and term position but still leaves search results at relatively low quality.",
  ],
  13: [
    "Keyword and formatting manipulation can inflate relevance and cause search engines to return commercial or irrelevant pages.",
  ],
  14: [
    "The cited Hyperlink Search Engine uses backlink anchor descriptions rather than only body text to characterize a destination document.",
  ],
  15: [
    "Simple citation rank counts backlinks, but the patent says that count treats an obscure citation like a citation from a respected page.",
  ],
  17: [
    "The summary presents objective ranking from relationships, scalable operation on large databases, and the further aspects disclosed with the figures.",
  ],
  18: [
    "The invention uses extrinsic linked structure so a document can receive a high rank from other documents that themselves have high rank.",
  ],
  20: [
    "The drawing references identify FIG. 1 as the three-document relationship, FIG. 2 as the rank example, and FIG. 3 as the flowchart.",
  ],
  22: [
    "FIG. 1 terminology distinguishes a linking parent source from a linked child destination and records the forward and backward link directions.",
  ],
  23: [
    "The patent's recurrence uses alpha divided by N plus normalized rank contributions from each backlink page, with alpha between zero and one.",
  ],
  24: [
    "FIG. 2's alpha-free example gives A from C, B from half of A, and C from B plus half of A, producing ranks 0.4, 0.2, and 0.4.",
  ],
  25: [
    "With alpha equal to one half, the three equations include one-sixth random-jump terms and have solution values fourteen-thirty-ninths, ten-thirty-ninths, and fifteen-thirty-ninths.",
  ],
  26: [
    "The steady-state vector is the dominant eigenvector of the normalized link matrix when the iteration converges, while childless pages require special handling.",
  ],
  27: [
    "Backlink anchor text, indexed alongside the target, can describe a page more accurately than its own content and can expose otherwise hard-to-index objects.",
  ],
  28: [
    "The method can annotate displayed links with an icon, text, or another indicator of destination rank so a viewer can compare relative importance.",
  ],
  29: [
    "A Web-search embodiment builds an index and directed hyperlink graph, ranks the nodes, and combines rank with full text, titles, backlink anchors, and nearby text.",
  ],
  30: [
    "For large databases the preferred embodiment starts ranks at one over N and repeatedly calculates a new set; approximate values may be useful before full precision.",
  ],
  31: [
    "The random-surfer model uses an initial probability vector p0 and an N-by-N transition matrix A, producing p1 equal to A times p0 and p2 equal to A squared times p0.",
  ],
  32: [
    "When convergence occurs, the limiting probability is the dominant eigenvector of A and probability circulates through linked nodes, while childless pages can amplify loops.",
  ],
  33: [
    "Childless pages may be removed during iteration and added back afterward, followed by additional iterations and norm-one normalization, or a short iteration can estimate the steady state.",
  ],
  34: [
    "A node rank can be a steady-state component or a logarithmic ratio to the minimum component, expressing differences that span orders of magnitude.",
  ],
  35: [
    "FIG. 3 selects p0 at step 101, computes pn at step 103 using A to the nth power, and determines r[k] from the kth component at step 105.",
  ],
  36: [
    "A uniform p0 assigns one over N to every node; a non-uniform start can focus probability on known important nodes and reduce iterations or unrelated-term inflation.",
  ],
  37: [
    "The transition matrix combines alpha over N times an all-ones matrix with one minus alpha times normalized adjacency matrix B, where B divides by forward-link count.",
  ],
  38: [
    "Including the random-jump probability during many iterations prevents artificial concentration of rank inside Web loops; alternatively alpha can be zero for only a few iterations.",
  ],
  39: [
    "The random-jump probability may be targeted to selected important nodes, omitted from high-importance nodes, or altered to discount local and same-server links.",
  ],
  40: [
    "Weights may favor backlinks from different institutions, authors, locations, domain roots, visible or emphasized positions, and recently modified pages.",
  ],
  41: [
    "Fast convergence and lower cost than a full-text index permit personalized starting importance for a user's home page or bookmarks.",
  ],
  42: [
    "Rank can estimate exposure, support site design and backlink arrangements, evaluate graph changes, and use real usage data without equating rank with traffic.",
  ],
  43: [
    "A crawler builds the graph and index; the search engine ranks nodes and combines the score with full text, titles, backlink anchors, titles, and nearby text.",
  ],
  44: [
    "The specification concludes that embodiments may be altered and that the scope is determined by the claims and their legal equivalents.",
  ],
  76: [
    "The certificate identifies patent 6,285,999 B1, application 09/004827, the September 4, 2001 date, and Lawrence Page as inventor.",
  ],
  77: [
    "The correction notice certifies that an error appears in the identified patent and that the Letters Patent is corrected as shown.",
  ],
  78: [
    "The correction replaces the government-support paragraph with the statement that the invention was made with government support under contract 9411306.",
  ],
  79: [
    "The certificate records the August 6, 2013 signature and seal of Teresa Stanek Rea, Acting Director of the United States Patent and Trademark Office.",
  ],
};

export const pagerankArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4",
  preparedBy: "Classic Patents editorial agent (GPT-5 Codex)",
  preparedAt: "2026-08-21",
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
      text: "CROSS-REFERENCES TO RELATED APPLICATIONS",
    },
    p(
      "This application claims priority from U.S. provisional patent application Ser. No. 60/035,205 filed Jan. 10, 1997, which is incorporated herein by reference.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "STATEMENT REGARDING GOVERNMENT SUPPORT",
    },
    p(
      "This invention was supported in part by the National Science Foundation grant number IRI-9411306-4. The Government has certain rights in the invention.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "FIELD OF THE INVENTION",
    },
    p(
      "This invention relates generally to techniques for analyzing linked databases. More particularly, it relates to methods for assigning ranks to nodes in a linked database, such as any database of documents containing citations, the World Wide Web or any other hypermedia database.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BACKGROUND OF THE INVENTION",
    },
    p(
      "Due to the developments in computer technology and its increase in popularity, large numbers of people have recently started to frequently search huge databases. For example, internet search engines are frequently used to search the entire World Wide Web. Currently, a popular search engine might execute over 30 million searches per day of the indexable part of the Web, which has a size in excess of 500 Gigabytes. Information retrieval systems are traditionally judged by their precision and recall. What is often neglected, however, is the quality of the results produced by these search engines. Large databases of documents such as the Web contain many low quality documents. As a result, searches typically return hundreds of irrelevant or unwanted documents which camouflage the few relevant ones. In order to improve the selectivity of the results, common techniques allow the user to constrain the scope of the search to a specified subset of the database, or to provide additional search terms.",
    ),
    p(
      "These techniques are most effective in cases where the database is homogeneous and already classified into subsets, or in cases where the user is searching for well known and specific information. In other cases, however, these techniques are often not effective because each constraint introduced by the user increases the chances that the desired information will be inadvertently eliminated from the search results.",
    ),
    p(
      "Search engines presently use various techniques that attempt to present more relevant documents. Typically, documents are ranked according to variations of a standard vector space model. These variations could include (a) how recently the document was updated, and/or (b) how close the search terms are to the beginning of the document. Although this strategy provides search results that are better than with no ranking at all, the results still have relatively low quality.",
    ),
    p(
      "Moreover, when searching the highly competitive Web, this measure of relevancy is vulnerable to spamming techniques that authors can use to artificially inflate their document’s relevance in order to draw attention to it or its advertisements. For this reason search results often contain commercial appeals that should not be considered a match to the query. Although search engines are designed to avoid such ruses, poorly conceived mechanisms can result in disappointing failures to retrieve desired information.",
    ),
    p(
      "Hyperlink Search Engine, developed by IDD Information Services, uses backlink information, namely information from pages that contain links to the current page, to assist in identifying relevant Web documents. Rather than using the content of a document to determine relevance, the technique uses the anchor text of links to the document to characterize the relevance of a document. The idea of associating anchor text with the page the text points to was first implemented in the World Wide Web Worm. The Hyperlink Search Engine has applied this idea to assist in determining document relevance in a search. In particular, search query terms are compared to a collection of anchor text descriptions that point to the page, rather than to a keyword index of the page content. A rank is then assigned to a document based on the degree to which the search terms match the anchor descriptions in its backlink documents.",
    ),
    p(
      "The well known idea of citation counting is a simple method for determining the importance of a document by counting its number of citations, or backlinks. The citation rank r(A) of a document which has n backlink pages is simply r(A) = n. In the case of databases whose content is of relatively uniform quality and importance it is valid to assume that a highly cited document should be of greater interest than a document with only one or two citations. Many databases, however, have extreme variations in the quality and importance of documents. In these cases, citation ranking is overly simplistic. For example, citation ranking will give the same rank to a document that is cited once on an obscure page as to a similar document that is cited once on a well-known and highly respected page.",
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
        "An idealized web browser whose long-run location is modeled by the patent’s probability process; the specification uses alpha for random jumps and one minus alpha for following normalized forward links.",
      ),
      " who traverses the linked database. The rank of a document corresponds to the steady-state probability that the surfer will be at that document after following many links. The invention provides an iterative numerical technique for approximating that distribution over very large linked databases.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWING FIGURES",
    },
    p(
      makePreview(
        "FIG. 1",
        [1],
        "Diagram of the relationship between three linked documents A, B, and C in a hypermedia database",
      ),
      " is a diagram of the relationship between three linked hypertext documents according to the invention. ",
      makePreview(
        "FIG. 2",
        [2],
        "Diagram of a three-document Web illustrating rank propagation and backlink contributions",
      ),
      " is a diagram of a three-document Web illustrating the rank associated with each document in accordance with the present invention. ",
      makePreview(
        "FIG. 3",
        [3],
        "Flowchart of an iterative power iteration method for computing document ranks",
      ),
      " is a flowchart of one embodiment of the invention.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
    },
    p(
      "Referring to ",
      makePreview("FIG. 1", [1], "Relationship between three linked documents A, B, and C"),
      ", a linked database contains documents A, B, and C. The first links in documents B and C point to document A, so B and C are backlinks of A and A is a forward link of B and C. Documents B and C also have other forward links to documents that are not shown. In the terminology of the present invention, a ",
      term(
        "linking document",
        "Linking Document / Forward Link",
        "A source document containing a directed hyperlink to a destination document; the source is the parent of that destination in the directed graph.",
      ),
      " is a linking document (or parent node) with respect to A, while B and C are each a ",
      term(
        "linked document",
        "Linked Document / Backlink",
        "A destination document reached by an incoming directed hyperlink; the destination is the child of the source document in the directed graph.",
      ),
      " (or child node) with respect to A.",
    ),
    p(
      "In the preferred embodiment, the rank r(A) is defined as r(A) = alpha/N + (1-alpha) * (r(B1)/|B1| + ... + r(Bn)/|Bn|), where B1 through Bn are the backlink pages of A, r(Bi) are their ranks, |Bi| are their numbers of forward links, ",
      term(
        "alpha",
        "Random-jump probability",
        "The patent’s constant random-jump probability, in the interval [0, 1], which supplies alpha/N to every page while one minus alpha scales normalized forward-link contributions.",
      ),
      " is in the interval [0, 1], and N is the total number of pages in the Web. The specification also states that the ranks form a probability distribution and sum to unity. The text gives a typical value around 0.1 for alpha and later describes a value around 15 percent.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 2", [2], "Rank propagation across documents A, B, and C"),
      ", document A has a single backlink from C, document B has a single backlink from A, and document C has backlinks from B and A. With alpha omitted, the illustrative values are r(A)=0.4, r(B)=0.2, and r(C)=0.4. With alpha=0.5, the text gives r(A)=1/6+r(C)/2, r(B)=1/6+r(A)/4, and r(C)=1/6+r(A)/4+r(B)/2, whose solution is 14/39, 10/39, and 15/39.",
    ),
    p(
      "Referring to ",
      makePreview("FIG. 3", [3], "Iterative rank computation flowchart"),
      ", step 101 selects an initial N-dimensional vector p_0. Step 103 computes an approximation p_n to the steady-state probability p_infinity according to p_n = A^n p_0. Matrix A is an N by N transition-probability matrix, and step 105 determines rank r[k] from the kth component of p_n. The process uses the ",
      term(
        "power iteration",
        "Power Iteration Method",
        "An iterative numerical procedure that repeatedly applies a transition matrix to approximate its steady-state probability vector, which is a dominant eigenvector when convergence holds.",
      ),
      " method. The patent describes a finite number of iterations and does not require a particular tolerance label.",
    ),
    p(
      "The steady-state vector p represents the ",
      term(
        "dominant eigenvector",
        "Stationary Eigenvector",
        "The limiting probability vector of the patent’s normalized link transition matrix, corresponding to the dominant eigenvector when the iteration converges; this is a source term, not a claim that every Web graph has the same numerical solution.",
      ),
      " of the link transition matrix. The patent explains that childless pages complicate the calculation, proposes removing them during iteration and adding them back, and requires the norm of each intermediate vector to be one when that normalization is used.",
    ),
    p(
      "In another aspect of the invention, link weights can be adjusted by domain, user browsing history, geographic location, link visibility, or recency. In search-engine applications, ",
      term(
        "anchor text",
        "Hyperlink Anchor Text",
        "The descriptive words attached to a hyperlink; the patent proposes indexing those words with the destination so a page can match a query through how other pages describe it.",
      ),
      " from backlinks is indexed alongside the target document. The patent notes that anchor text can describe a page more accurately than the page itself and can help return pages that have not yet been crawled.",
    ),
    p(
      "In another embodiment, document ranks annotate links displayed in documents or directories with an icon, text, or another indicator, so a viewer can assess the relative importance of destinations.",
    ),
    p(
      "The patent describes a Web-search implementation in which a crawler creates an index and a directed graph, the nodes are ranked, and results are sorted by rank. Searches may use full text, titles, backlink anchor text, backlink titles, and nearby text, and results may be grouped by category or site.",
    ),
    p(
      "In practice, there are millions of documents and it is not possible to find the solution to a million equations by inspection. The preferred embodiment starts all ranks at 1/N and uses the formulas repeatedly to calculate a new set of ranks. In the case of millions of documents, sufficient convergence typically takes on the order of 100 iterations. It is not always necessary or desirable to calculate every page with high precision; approximate rank values after two or more iterations can also provide useful information.",
    ),
    p(
      "The random-surfer model includes an initial N-dimensional probability distribution vector p₀, whose component p₀[i] is the probability of starting at node i, and an N × N transition probability matrix A, whose component A[i][j] is the probability of moving from node i to node j. The probability distribution after one link is p₁ = A p₀, and after two links it is p₂ = A p₁ = A² p₀.",
    ),
    p(
      "Assuming the iteration converges, it converges to the steady-state probability p∞ = lim(n→∞) Aⁿ p₀, which is a dominant eigenvector of A. The iteration circulates probability through linked nodes and accumulates it in important places. Pages with no links bleed off probability and can add huge amounts to the random-jump factor, causing loops in the graph to be highly emphasized.",
    ),
    p(
      "To address childless pages, the pages may be removed from the model during the iterative stages and added back after the iteration is complete. After they are added back, the same number of iterations used during removal should be performed so that each receives a value. The norm of pᵢ must be made equal to 1 after each iteration when this normalization is used. An alternate method is to estimate the steady state with only a small number of iterations.",
    ),
    p(
      "The rank r[i] of node i can be defined as a function of the steady-state distribution, for example r[i] = p∞[i]. Equivalent characterizations remain within the scope of the invention. Because ranks can differ by orders of magnitude, a logarithmic rank may be defined as log(p∞[i] / minₖ p∞[k]), assigning rank zero to the lowest-ranked node and increasing by one for each order of magnitude in importance.",
    ),
    p(
      "At step 101 of ",
      makePreview("FIG. 3", [3], "Flowchart showing initial vector selection"),
      ", an initial N-dimensional vector p₀ is selected. At step 103, an approximation pₙ to p∞ is computed according to pₙ = Aⁿ p₀. Matrix A has elements A[i][j] representing the probability of moving from i to j. At step 105, a rank r[k] is determined from the kth component of pₙ.",
    ),
    p(
      "The initial distribution may be uniform or non-uniform. A uniform distribution sets every component of p₀ to 1/N. A non-uniform distribution can divide the initial probability among a few nodes known a priori to have relatively large importance, reducing the number of iterations needed for a close approximation and reducing the effect of artificially inflating relevance by adding unrelated terms.",
    ),
    p(
      "In one particular embodiment, the transition matrix is A = alpha/N · 1 + (1-alpha)B, where 1 is an N × N matrix consisting of all ones, alpha is the probability that a surfer will jump randomly to any of the N nodes, and B[i][j] is 1/nᵢ if node i points to node j and zero otherwise. Here nᵢ is the total number of forward links from node i. The (1-alpha) factor limits the extent to which a document’s rank is inherited by child documents and models the fact that users typically jump to a different place after following a few links. The value of alpha is typically around 15 percent.",
    ),
    p(
      "Including the random-jump probability is important when many iterations are used so that there is no artificial concentration of rank within Web loops. Alternatively, alpha may be set to zero and only a few iterations performed.",
    ),
    p(
      "The random-linking probability may be divided among selected important nodes rather than all sites, or random jumps may be prevented from high-importance nodes. This models a surfer more likely to jump from unimportant sites and follow links from important sites. Local links may be ignored, or links on the same server may be weighted less than links from other servers. Other distances between links may also determine the weighting.",
    ),
    p(
      "Rank can be increased for documents whose backlinks are maintained by different institutions and authors in different geographic locations, for links from unusually important domain roots, and for links weighted by their relative importance within a document. Highly visible links near the top of a document, links in large fonts, emphasized links, and links from recently modified pages may receive higher value.",
    ),
    p(
      "Various implementations converge quickly and cost less than building a full-text index. This speed permits ranking customized for users. A user’s home page or bookmarks can be given a large initial importance or a high probability of a random jump returning to it, which trains the system to recognize pages related to that user’s interests.",
    ),
    p(
      "The ranking method can estimate the amount of attention a document receives, assist site design and arrangements with backlinkers, and evaluate proposed changes to a hypertext structure by adding the changes and recomputing rank. Real usage data can be used as a starting point and as the distribution for alpha. The model does not necessarily match actual traffic, but measures the degree of exposure a document receives throughout the Web.",
    ),
    p(
      "A ranking method according to the invention may be integrated into a Web search engine. A crawler explores the Web and creates an index and a directed graph of nodes corresponding to hyperlink structure. The nodes are ranked according to the method, and a search engine locates documents by full text, titles, backlink anchor text, backlink document titles, and text near backlink anchors. The results are sorted with high-ranking documents first and low-ranking documents last, and may be grouped by category or site.",
    ),
    p(
      "It will be clear to one skilled in the art that the above embodiments may be altered in many ways without departing from the scope of the invention. Accordingly, the scope of the invention should be determined by the following claims and their legal equivalents.",
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
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on the number of links to the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on an estimation of a probability that a linking document will be accessed, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on the URL, host, domain, author, institution, or last update time of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on whether the one or more linking documents are selected documents or roots, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 6,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on the importance, visibility or textual emphasis of the links in the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
        },
      ],
    },
    {
      kind: "claim",
      number: 7,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning includes: identifying a weighting factor for each of the linking documents, the weighting factor being dependent on a particular user's preferences, the rate at which users access the one or more linking documents, or the importance of the one or more linking documents, and adjusting the score of each of the one or more linking documents based on the identified weighting factor.",
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
          text: "The method of claim 10, wherein there is a predetermined probability that the next linked document to be traversed will be a random one according to a distribution of the plurality of linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 12,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the processing includes: displaying links to the linked documents as a directory listing.",
        },
      ],
    },
    {
      kind: "claim",
      number: 13,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the processing includes: displaying links to the linked documents, and displaying annotations representing the score of each of the linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 14,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 13, wherein the annotations are bars, icons, or text.",
        },
      ],
    },
    {
      kind: "claim",
      number: 15,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, further comprising: processing the linked documents based on textual matching.",
        },
      ],
    },
    {
      kind: "claim",
      number: 16,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 15, wherein the textual matching includes matching anchor text associated with the links.",
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
          text: "A computer-readable medium that stores instructions executable by one or more processing devices to perform a method for determining scores for a plurality of linked documents, comprising: instructions for obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; instructions for determining a score for each of the linked documents based on scores for the one or more linking documents; and instructions for processing the linked documents according to their scores.",
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
          text: "The method of claim 1, wherein the assigning a score includes: determining the score based on (1) a number of the linking documents that link to the linked document and (2) an importance of the linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 21,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 20, wherein the importance of the linking documents is based on a number of documents that link to the linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 22,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning a score includes: associating one or more backlinks with each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a weight to each of the backlinks, and determining a score for each of the linked documents based on a number of backlinks for the linked document and the weights assigned to the backlinks.",
        },
      ],
    },
    {
      kind: "claim",
      number: 23,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 22, wherein the processing of the linked documents includes: organizing the linked documents based on the determined scores.",
        },
      ],
    },
    {
      kind: "claim",
      number: 24,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 22, wherein the assigning a weight includes: assigning different weights to at least some of the backlinks associated with at least one of the linked documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 25,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning a score includes: associating one or more backlinks with each of the linked documents, each of the backlinks corresponding to one of the linking documents that links to the linked document, assigning a weight to each of the backlinks, and determining a score for each of the linked documents based on a sum of the weights assigned to the backlinks associated with the linked document.",
        },
      ],
    },
    {
      kind: "claim",
      number: 26,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 25, wherein the weights assigned to each of the backlinks are independent of text of the corresponding linking documents.",
        },
      ],
    },
    {
      kind: "claim",
      number: 27,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning a score includes: determining the score primarily based on linking information.",
        },
      ],
    },
    {
      kind: "claim",
      number: 28,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning a score includes: determining the score substantially independent of user-query content.",
        },
      ],
    },
    {
      kind: "claim",
      number: 29,
      inlines: [
        {
          kind: "text",
          text: "The method of claim 1, wherein the assigning a score includes: iteratively determining the score for a linked document, the score being primarily based on document-linking information and substantially independent of user-query content.",
        },
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "CERTIFICATE OF CORRECTION",
    },
    p(
      "PATENT NO.: 6,285,999 B1. APPLICATION NO.: 09/004827. DATED: September 4, 2001. INVENTOR: Lawrence Page.",
    ),
    p(
      "It is certified that error appears in the above-identified patent and that the Letters Patent is hereby corrected as shown below.",
    ),
    p(
      "In the Specification, Column 1, lines 13-15 should be replaced with the following paragraph: This invention was made with Government support under contract 9411306 awarded by the National Science Foundation. The Government has certain rights in this invention.",
    ),
    p(
      "Signed and sealed the Sixth Day of August, 2013. Teresa Stanek Rea, Acting Director of the United States Patent and Trademark Office.",
    ),
  ],
};

export const pagerankEdition = pagerankArchivalEdition;

/** The catalogue record must read claim literals from these authored nodes. */
export function pagerankManualClaimText(number: number): string {
  const block = pagerankArchivalEdition.blocks.find(
    (candidate) => candidate.kind === "claim" && candidate.number === number,
  );
  if (block?.kind !== "claim") {
    throw new Error(`PageRank manual edition is missing claim ${number}.`);
  }
  return block.inlines.map((inline) => inline.text).join("");
}
