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
    "The detailed-description preamble says the examples do not impose limitations and acknowledges the named people who supported reduction to practice.",
  ],
  23: [
    "A linked database is a directed graph of N nodes with forward and backward links; FIG. 1 gives the three-document example and names B and C as backlinks of A.",
  ],
  24: [
    "Simple citation rank is just a backlink count, while the patent says its method is more subtle and gives a different result.",
  ],
  25: [
    "The recurrence combines α/N with normalized ranks from each backlink, so a highly ranked backlink has more effect than a lowly ranked one with the same number of forward links.",
  ],
  26: [
    "Ranks form a probability distribution and the random-jump term represents a surfer going to any page instead of following a forward link; the specification identifies the resulting vector as the principal eigenvector.",
  ],
  27: [
    "FIG. 2 works a three-document example first with α equal to zero and then with α equal to one half, including each recurrence and the resulting fractional ranks.",
  ],
  28: [
    "For large graphs the preferred embodiment starts every rank at one over N, repeats the formulas, and permits useful approximate values before high precision.",
  ],
  29: [
    "The random-surfer description is an equivalent steady-state probability model, not a new legal requirement beyond the source's stated embodiments.",
  ],
  30: [
    "The model defines an initial probability vector p0, a transition matrix A, and the distributions after one and two followed links.",
  ],
  31: [
    "When the iteration converges, its limiting probability is a dominant eigenvector of A; pages without links bleed probability and enlarge the random-jump contribution.",
  ],
  32: [
    "The patent describes removing childless pages during iteration, adding them back, normalizing p_i when used for convergence, or estimating the steady state with few iterations.",
  ],
  33: [
    "Rank can be a component of the steady-state distribution, and the source also gives a logarithmic rank for differences spanning orders of magnitude.",
  ],
  34: [
    "FIG. 3 selects p0 at step 101, computes pn at step 103 using A to the nth power, and determines r[k] from the kth component at step 105.",
  ],
  35: [
    "The initial distribution may be uniform or non-uniform; the source explains how a non-uniform start can reduce iterations and the effect of irrelevant-term inflation.",
  ],
  36: [
    "The transition matrix uses α/N times an all-ones matrix plus one minus α times B, whose entries distribute a node's probability among its forward links.",
  ],
  37: [
    "The one-minus-α factor is described as damping inherited rank and α is typically around fifteen percent; the source also permits a short α-equals-zero calculation.",
  ],
  38: [
    "The random-linking probability can be allocated to selected sites or withheld from highly important nodes, including to reduce artificially inflated relevance.",
  ],
  39: [
    "The source describes a model that jumps from unimportant sites, ignores local links, discounts same-server links, and can use domains or other distances for weighting.",
  ],
  40: [
    "Backlinks may receive more weight for institutional, author, geographic, domain-root, visibility, emphasis, or recency reasons; the source also describes rapid convergence and personalized starting importance.",
  ],
  41: [
    "The specification says a user’s home page or bookmarks can receive large initial importance or a high return-jump probability, and link display can carry a rank indicator.",
  ],
  42: [
    "The ranking can estimate attention and graph changes; real usage data can seed alpha, while rank remains a measure of exposure rather than necessarily actual traffic.",
  ],
  43: [
    "A Web-search embodiment uses a crawler, index, and directed graph, then ranks the graph nodes before locating documents by the specified search criteria.",
  ],
  44: [
    "The search engine may use full text, titles, backlink anchor text and nearby text; results are sorted by rank and may be grouped, after which the source says claim scope controls.",
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
  preparedAt: "2026-09-02",
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
        "Appl. No.: 09/004,827 Filed: Jan. 9, 1998",
      ],
    },
    {
      kind: "heading",
      level: 2,
      text: "ABSTRACT",
    },
    p(
      "A method assigns importance ranks to nodes in a linked database, such as any database of documents containing citations, the World Wide Web or any other hypermedia database. The rank assigned to a document is calculated from the ranks of documents citing it. In addition, the rank of a document is calculated from a constant representing the probability that a browser through the database will randomly jump to the document. The method is particularly useful in enhancing the performance of search engine results for hypermedia databases, such as the World Wide Web, whose documents have a large variation in quality.",
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
      "Hyperlink Search Engine, developed by IDD Information Services, (http://rankdex.gari.com/) uses backlink information (i.e., information from pages that contain links to the current page) to assist in identifying relevant Web documents. Rather than using the content of a document to determine relevance, the technique uses the anchor text of links to the document to characterize the relevance of a document. The idea of associating anchor text with the page the text points to was first implemented in the World Wide Web Worm (Oliver A. McBryan, GENVL and WWWW: Tools for Taming the Web, First International Conference on the World Wide Web, CERN, Geneva, May 25—27, 1994). The Hyperlink Search Engine has applied this idea to assist in determining document relevance in a search. In particular, search query terms are compared to a collection of anchor text descriptions that point to the page, rather than to a keyword index of the page content. A rank is then assigned to a document based on the degree to which the search terms match the anchor descriptions in its backlink documents.",
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
      "Various aspects of the present invention provide systems and methods for ranking documents in a linked database. One aspect provides an objective ranking based on the relationship between documents. Another aspect of the invention is directed to a technique for ranking documents within a database whose content has a large variation in quality and importance. Another aspect of the present invention is to provide a document ranking method that is scalable and can be applied to extremely large databases such as the World Wide Web. Additional aspects of the invention will become apparent in view of the following description and associated figures.",
    ),
    p(
      "One aspect of the present invention is directed to taking advantage of the linked structure of a database to assign a rank to each document in the database, where the document rank is a measure of the importance of a document. Rather than determining relevance only from the intrinsic content of a document, or from the anchor text of backlinks to the document, a method consistent with the invention determines importance from the extrinsic relationships between documents. Intuitively, a document should be important (regardless of its content) if it is highly cited by other documents. Not all citations, however, are necessarily of equal significance. A citation from an important document is more important than a citation from a relatively unimportant document. Thus, the importance of a page, and hence the rank assigned to it, should depend not just on the number of citations it has, but on the importance of the citing documents as well. This implies a recursive definition of rank: the rank of a document is a function of the ranks of the documents which cite it. The ranks of documents may be calculated by an iterative procedure on a linked database.\n\nBecause citations, or links, are ways of directing attention, the important documents correspond to those documents to which the most attention is directed. Thus, a high rank indicates that a document is considered valuable by many people or by important people. Most likely, these are the pages to which someone performing a search would like to direct his or her attention. Looked at another way, the importance of a page is directly related to the steady-state probability that a random Web surfer ends up at the page after following a large number of links. Because there is a larger probability that a surfer will end up at an important page than at an unimportant page, this method of ranking pages assigns higher ranks to the more important pages.\n\nIn one aspect of the invention, a computer implemented method is provided for scoring linked database documents. The method comprises the steps of: obtaining a plurality of documents, at least some of the documents being linked documents, at least some of the documents being linking documents, and at least some of the documents being both linked documents and linking documents, each of the linked documents being pointed to by a link in one or more of the linking documents; assigning a score to each of the linked documents based on scores of the one or more linking documents; and processing the linked documents according to their scores. Additional aspects, applications and advantages will become apparent in view of the following description and associated figures.",
    ),
    {
      kind: "heading",
      level: 2,
      text: "BRIEF DESCRIPTION OF THE DRAWINGS",
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
      text: "DETAILED DESCRIPTION",
    },
    p(
      "Although the following detailed description contains many specifics for the purposes of illustration, anyone of ordinary skill in the art will appreciate that many variations and alterations to the following details are within the scope of the invention. Accordingly, the following embodiments of the invention are set forth without any loss of generality to, and without imposing limitations upon, the claimed invention. For support in reducing the present invention to practice, the inventor acknowledges Sergey Brin, Scott Hassan, Rajeev Motwani, Alan Steremberg, and Terry Winograd.",
    ),
    p(
      "A linked database (i.e. any database of documents containing mutual citations, such as the World Wide Web or other hypermedia archive, a dictionary or thesaurus, and a database of academic articles, patents, or court cases) can be represented as a directed graph of N nodes, where each node corresponds to a Web page document and where the directed connections between nodes correspond to links from one document to another. A given node has a set of forward links that connect it to children nodes, and a set of backward links that connect it to parent nodes. ",
      makePreview("FIG. 1", [1], "Relationship between three linked documents A, B, and C"),
      " shows a typical relationship between three hypertext documents A, B, and C. As shown in this particular figure, the first links in documents B and C are pointers to document A. In this case we say that B and C are backlinks of A, and that A is a forward link of B and of C. Documents B and C also have other forward links to documents that are not shown.",
    ),
    p(
      "Although the ranking method of the present invention is superficially similar to the well known idea of citation counting, the present method is more subtle and complex than citation counting and gives far superior results. In a simple citation ranking, the rank of a document A which has n backlink pages is simply r(A)=n.",
    ),
    p(
      "According to one embodiment of the present method of ranking, the backlinks from different pages are weighted differently and the number of links on each page is normalized. More precisely, the rank of a page A is defined according to the present invention as r(A) = α/N + (1 − α)(r(B₁)/|B₁| + ··· + r(Bₙ)/|Bₙ|), where B₁, . . . , Bₙ are the backlink pages of A, r(B₁), . . . , r(Bₙ) are their ranks, |B₁|, . . . , |Bₙ| are their numbers of forward links, and ",
      term(
        "α",
        "Random-jump probability",
        "The patent’s constant random-jump probability, in the interval [0, 1], which supplies α/N to every page while one minus α scales normalized forward-link contributions.",
      ),
      " is a constant in the interval [0,1], and N is the total number of pages in the Web. This definition is clearly more complicated and subtle than the simple citation rank. Like the citation rank, this definition yields a page rank that increases as the number of backlinks increases. But the present method considers a citation from a highly ranked backlink as more important than a citation from a lowly ranked backlink (provided both citations come from backlink documents that have an equal number of forward links). In the present invention, it is possible, therefore, for a document with only one backlink (from a very highly ranked page) to have a higher rank than another document with many backlinks (from very low ranked pages). This is not the case with simple citation ranking.",
    ),
    p(
      "The ranks form a probability distribution over Web pages, so that the sum of ranks over all Web pages is unity. The rank of a page can be interpreted as the probability that a surfer will be at the page after following a large number of forward links. The constant α in the formula is interpreted as the probability that the Web surfer will jump randomly to any Web page instead of following a forward link. The page ranks for all the pages can be calculated using a simple iterative algorithm, and corresponds to the principal eigenvector of the normalized link matrix of the Web, as will be discussed in more detail below.",
    ),
    p(
      "In order to illustrate the present method of ranking, consider the simple Web of three documents shown in ",
      makePreview("FIG. 2", [2], "Rank propagation across documents A, B, and C"),
      ". For simplicity of illustration, we assume in this example that α=0. Document A has a single backlink to document C, and this is the only forward link of document C, so r(A)=r(C). Document B has a single backlink to document A, but this is one of two forward links of document A, so r(B)=r(A)/2. Document C has two backlinks. One backlink is to document B, and this is the only forward link of document B. The other backlink is to document A via the other of the two forward links from A. Thus r(C)=r(B)+r(A)/2. In this simple illustrative case we can see by inspection that r(A)=0.4, r(B)=0.2, and r(C)=0.4. Although a typical value for α is ~0.1, if for simplicity we set α=0.5 (which corresponds to a 50% chance that a surfer will randomly jump to one of the three pages rather than following a forward link), then the mathematical relationships between the ranks become more complicated. In particular, we then have r(A)=1/6+r(C)/2, r(B)=1/6+r(A)/4, and r(C)=1/6+r(A)/4+r(B)/2. The solution in this case is r(A)=14/39, r(B)=10/39, and r(C)=15/39.",
    ),
    p(
      "In practice, there are millions of documents and it is not possible to find the solution to a million equations by inspection. Accordingly, in the preferred embodiment a simple iterative procedure is used. As the initial state we may simply set all the ranks equal to 1/N. The formulas are then used to calculate a new set of ranks based on the existing ranks. In the case of millions of documents, sufficient convergence typically takes on the order of 100 iterations. It is not always necessary or even desirable, however, to calculate the rank of every page with high precision. Even approximate rank values, using two or more iterations, can provide very valuable, or even superior, information.",
    ),
    p(
      "The iteration process can be understood as a steady-state probability distribution calculated from a model of a ",
      term(
        "random surfer",
        "Random Surfer Model",
        "An idealized web browser whose long-run location is modeled by the patent’s probability process; the specification uses α for random jumps and one minus α for following normalized forward links.",
      ),
      ". This model is mathematically equivalent to the explanation described above, but provides a more direct and concise characterization of the procedure.",
    ),
    p(
      "The model includes (a) an initial N-dimensional probability distribution vector p₀ where each component p₀[i] gives the initial probability that a random surfer will start at a node i, and (b) an N×N transition probability matrix A where each component A[i][j] gives the probability that the surfer will move from node i to node j. The probability distribution of the graph after the surfer follows one link is p₁=Ap₀, and after two links the probability distribution is p₂=Ap₁=A²p₀.",
    ),
    p(
      "Assuming this iteration converges, it will converge to a steady-state probability p∞ = lim(n→∞) Aⁿp₀, which is a ",
      term(
        "dominant eigenvector",
        "Stationary Eigenvector",
        "The limiting probability vector of the patent’s normalized link transition matrix, corresponding to the dominant eigenvector when the iteration converges; this is a source term, not a claim that every Web graph has the same numerical solution.",
      ),
      " of A. The iteration circulates the probability through the linked nodes like energy flows through a circuit and accumulates in important places. Because pages with no links occur in significant numbers and bleed off energy, they cause some complication with computing the ranking. This complication is caused by the fact they can add huge amounts to the “random jump” factor.",
    ),
    p(
      "This, in turn, causes loops in the graph to be highly emphasized which is not generally a desirable property of the model. In order to address this problem, these childless pages can simply be removed from the model during the iterative stages, and added back in after the iteration is complete. After the childless pages are added back in, however, the same number of iterations that was required to remove them should be done to make sure they all receive a value. (Note that in order to ensure convergence, the norm of pᵢ must be made equal to 1 after each iteration.) An alternate method to control the contribution of the childless nodes is to only estimate the steady state by iterating a small number of times.",
    ),
    p(
      "The rank r[i] of a node i can then be defined as a function of this steady-state probability distribution. For example, the rank can be defined simply by r[i]=p∞[i]. This method of calculating rank is mathematically equivalent to the iterative method described first. Those skilled in the art will appreciate that this same method can be characterized in various different ways that are mathematically equivalent. Such characterizations are obviously within the scope of the present invention. Because the rank of various different documents can vary by orders of magnitude, it is convenient to define a logarithmic rank r[i] = log(p∞[i]/minₖ∈[1,N]{p∞[k]}) which assigns a rank of 0 to the lowest ranked node and increases by 1 for each order of magnitude in importance higher than the lowest ranked node.",
    ),
    p(
      "“",
      makePreview("FIG. 3", [3], "Iterative rank computation flowchart"),
      " shows one embodiment of a computer implemented method for calculating an importance rank for N linked nodes of a linked database. At a step 101, an initial N-dimensional vector p₀ is selected. An approximation pₙ to a steady-state probability p∞ in accordance with the equation pₙ=Aⁿp₀ is computed at a step 103. Matrix A can be an N×N transition probability matrix having elements A[i][j] representing a probability of moving from node i to node j. At a step 105, a rank r[k] for node k from a kᵗʰ component of pₙ is determined.”.",
    ),
    p(
      "In one particular embodiment, a finite number of iterations are performed to approximate p∞. The initial distribution can be selected to be uniform or non-uniform. A uniform distribution would set each component of p₀ equal to 1/N. A non-uniform distribution, for example, can divide the initial probability among a few nodes which are known a priori to have relatively large importance. This non-uniform distribution decreases the number of iterations required to obtain a close approximation to p∞ and also is one way to reduce the effect of artificially inflating relevance by adding unrelated terms.",
    ),
    p(
      "In another particular embodiment, the transition matrix A is given by A = α/N · 1 + (1 − α)B, where 1 is an N×N matrix consisting of all 1s, α is the probability that a surfer will jump randomly to any one of the N nodes, and B is a matrix whose elements B[i][j] are given by 1/nᵢ if node i points to node j, and 0 otherwise, where nᵢ is the total number of forward links from node i. The (1−α) factor acts as a damping factor that limits the extent to which a document’s rank can be inherited by children documents. This models the fact that users typically jump to a different place in the Web after following a few links. The value of α is typically around 15%.",
    ),
    p(
      "Including this damping is important when many iterations are used to calculate the rank so that there is no artificial concentration of rank importance within loops of the Web. Alternatively, one may set α=0 and only iterate a few times in the calculation.",
    ),
    p(
      "Consistent with the present invention, there are several ways that this method can be adapted or altered for various purposes. As already mentioned above, rather than including the random linking probability α equally among all nodes, it can be divided in various ways among all the sites by changing the 1 matrix to another matrix. For example, it could be distributed so that a random jump takes the surfer to one of a few nodes that have a high importance, and will not take the surfer to any of the other nodes. This can be very effective in preventing deceptively tagged documents from receiving artificially inflated relevance. Alternatively, the random linking probability could be distributed so that random jumps do not happen from high importance nodes, and only happen from other nodes.",
    ),
    p(
      "This distribution would model a surfer who is more likely to make random jumps from unimportant sites and follow forward links from important sites. A modification to avoid drawing unwarranted attention to pages with artificially inflated relevance is to ignore local links between documents and only consider links between separate domains. Because the links from other sites to the document are not directly under the control of a typical Web site designer, it is then difficult for the designer to artificially inflate the ranking. A simpler approach is to weight links from pages contained on the same Web server less than links from other servers. Also, in addition to servers, internet domains and any general measure of the distance between links could be used to determine such a weighting.",
    ),
    p(
      "Additional modifications can further improve the performance of this method. Rank can be increased for documents whose backlinks are maintained by different institutions and authors in various geographic locations. Or it can be increased if links come from unusually important Web locations such as the root page of a domain. Links can also be weighted by their relative importance within a document. For example, highly visible links that are near the top of a document can be given more weight. Also, links that are in large fonts or emphasized in other ways can be given more weight. In this way, the model better approximates human usage and authors’ intentions. In many cases it is appropriate to assign higher value to links coming from pages that have been modified recently since such information is less likely to be obsolete.",
    ),
    p(
      "Various implementations of the invention have the advantage that the convergence is very fast (a few hours using current processors) and it is much less expensive than building a full-text index. This speed allows the ranking to be customized or personalized for specific users. For example, a user’s home page and/or bookmarks can be given a large initial importance, and/or a high probability of a random jump returning to it. This high rating essentially indicates to the system that the person’s homepage and/or bookmarks does indeed contain subjects of importance that should be highly ranked. This procedure essentially trains the system to recognize pages related to the person’s interests. The present method of determining the rank of a document can also be used to enhance the display of documents. In particular, each link in a document can be annotated with an icon, text, or other indicator of the rank of the document that each link points to. Anyone viewing the document can then easily see the relative importance of various links in the document.",
    ),
    p(
      "The present method of ranking documents in a database can also be useful for estimating the amount of attention any document receives on the Web since it models human behavior when surfing the Web. Estimating the importance of each backlink to a page can be useful for many purposes including site design, business arrangements with the backlinkers, and marketing. The effect of potential changes to the hypertext structure can be evaluated by adding them to the link structure and recomputing the ranking. Real usage data, when available, can be used as a starting point for the model and as the distribution for the alpha factor. This can allow this ranking model to fill holes in the usage data, and provide a more accurate or comprehensive picture. Thus, although this method of ranking does not necessarily match the actual traffic, it nevertheless measures the degree of exposure a document has throughout the Web.",
    ),
    p(
      "Another important application and embodiment of the present invention is directed to enhancing the quality of results from Web search engines. In this application of the present invention, a ranking method according to the invention is integrated into a Web search engine to produce results far superior to existing methods in quality and performance. A search engine employing a ranking method of the present invention provides automation while producing results comparable to a human maintained categorized system. In this approach, a Web crawler explores the Web and creates an index of the Web content, as well as a directed graph of nodes corresponding to the structure of hyperlinks. The nodes of the graph (i.e. pages of the Web) are then ranked according to importance as described above in connection with various exemplary embodiments of the present invention.",
    ),
    p(
      "The search engine is used to locate documents that match the specified search criteria, either by searching full text, or by searching titles only. In addition, the search can include the ",
      term(
        "anchor text",
        "Hyperlink Anchor Text",
        "The descriptive words attached to a hyperlink; the patent proposes indexing those words with the destination so a page can match a query through how other pages describe it.",
      ),
      " associated with backlinks to the page. This approach has several advantages in this context. First, anchors often provide more accurate descriptions of Web pages than the pages themselves. Second, anchors may exist for images, programs, and other objects that cannot be indexed by a text-based search engine. This also makes it possible to return Web pages which have not actually been crawled. In addition, the engine can compare the search terms with a list of its backlink document titles. Thus, even though the text of the document itself may not match the search terms, if the document is cited by documents whose titles or backlink anchor text match the search terms, the document will be considered a match. In addition to or instead of the anchor text, the text in the immediate vicinity of the backlink anchor text can also be compared to the search terms in order to improve the search. Once a set of documents is identified that match the search terms, the list of documents is then sorted with high ranking documents first and low ranking documents last. The ranking in this case is a function which combines all of the above factors such as the objective ranking and textual matching. If desired, the results can be grouped by category or site as well.\n\nIt will be clear to one skilled in the art that the above embodiments may be altered in many ways without departing from the scope of the invention. Accordingly, the scope of the invention should be determined by the following claims and their legal equivalents.",
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
      "PATENT NO. : 6,285,999 B1. Page 1 of 1. APPLICATION NO. : 09/004827. DATED : September 4, 2001. INVENTOR(S) : Lawrence Page.",
    ),
    p(
      "It is certified that error appears in the above-identified patent and that said Letters Patent is hereby corrected as shown below:",
    ),
    p(
      "In the Specification, Column 1, lines 13-15 should be replaced with the following paragraph: This invention was made with Government support under contract 9411306 awarded by the National Science Foundation. The Government has certain rights in this invention.",
    ),
    p(
      "Signed and Sealed this Sixth Day of August, 2013. Teresa Stanek Rea, Acting Director of the United States Patent and Trademark Office.",
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
