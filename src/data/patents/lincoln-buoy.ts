import type { Patent } from "@/types/patent";
import { lincolnBuoyArchivalEdition } from "../editions/lincolnBuoyEdition";

export const lincolnBuoyPatent: Patent = {
  id: "us-6469-lincoln-buoy",
  patentNumber: "US 6,469",
  title: "Buoying Vessels Over Shoals",
  shortTitle: "Lincoln Expansible Buoyant Chambers",
  subtitle: "Variable Displacement Chambers Operated by Shafts, Ropes, and Pulleys",
  inventors: ["Abraham Lincoln"],
  inventorLocation: "Springfield, Illinois",
  grantDate: "1849-05-22",
  filingDate: "1849-03-10",
  era: "Early Industrial Navigation (1830–1850)",
  category: "materials",
  categoryLabel: "Marine Engineering & Hydraulics",
  summary:
    "Lincoln's 1849 specification claims a vessel-side buoyancy apparatus: expansible air chambers, sliding spars fixed to their bottoms, and a main shaft with ropes and pulleys. Turning the shaft lowers and expands the chambers to displace water; reverse rotation contracts them for protection.",
  heroQuote:
    "What I claim as my invention and desire to secure by letters patent, is the combination of expansible buoyant chambers placed at the sides of a vessel, with the main shaft or shafts C...",
  originalPdfUrl: "/patents/pdfs/us-6469-lincoln-buoy.pdf",
  googlePatentsUrl: "https://patentimages.storage.googleapis.com/pdfs/US6469.pdf",
  usptoClassification: "B63B 43/14 (Vessels; buoyancy tanks)",
  archivalEdition: lincolnBuoyArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-6469-lincoln-buoy.txt",
    pageCount: 3,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (codex-juliet)",
    reviewedAt: "2026-08-17",
    sourcePdfSha256: "0663103c4dc8e15ae66d7829ace7916bd4025bd1751afb8710fca8d3fdbf53be",
  },
  originalText: `UNITED STATES PATENT OFFICE.
ABRAHAM LINCOLN, OF SPRINGFIELD, ILLINOIS.

BUOYING VESSELS OVER SHOALS.

Specification forming part of Letters Patent No. 6,469, dated May 22, 1849; application filed March 10, 1849.

To all whom it may concern:
Be it known that I, Abraham Lincoln, of Springfield, in the County of Sangamon, in the State of Illinois, have invented a new and improved manner of combining adjustable buoyant air chambers with a steamboat or other vessel for the purpose of enabling their draught of water to be readily lessened to enable them to pass over bars, or through shallow water, without discharging their cargoes; and I do hereby declare the following to be a full, clear, and exact description thereof, reference being had to the accompanying drawings making a part of this specification. Similar letters indicate like parts in all the figures.

The buoyant chambers A, A, which I employ, are constructed in such a manner that they can be expanded so as to hold a large volume of air when required for use, and can be contracted, into a very small space and safely secured as soon as their services can be dispensed with.`,
  plainEnglishExplanation: {
    overview:
      "Lincoln proposed adding controllable displacement rather than unloading a grounded vessel. His patent puts a collapsible air chamber at each side of a vessel. A shaft-and-rope mechanism drives the chambers downward; trapped air makes them displace more water, so the vessel rises relative to a bar or shoal.",
    coreMechanism:
      "The apparatus uses a chamber with rigid top g and bottom h and flexible waterproof sides. Vertical spars D pass through the chamber and attach to its bottom. Endless ropes f running from main shaft C over sheaves pull the lower structure down. Check ropes e retain the upper side, so the chamber opens and admits air through openings m. Reversing C draws the assembly back into a compact protected position.",
    mechanicalBreakdown: [
      {
        title: "Expansible buoyant chamber A",
        summary:
          "A rigid-topped and rigid-bottomed chamber with flexible waterproof sides and ends.",
        technicalDetails:
          "The specification names plank or metal for top g and bottom h, with india-rubber cloth or another waterproof fabric for the flexible enclosure. Its lift follows Archimedes' principle: each added submerged volume displaces water and supplies buoyant force $F_B = \\rho g V$.",
        archaicTerm: "india-rubber cloth",
        modernEquivalent: "waterproof elastomeric chamber fabric",
      },
      {
        title: "Sliding spars D and main shaft C",
        summary:
          "Vertical spars attach to chamber bottoms and are driven from a longitudinal main shaft.",
        technicalDetails:
          "The spars D move freely through openings in the chamber tops but are fastened to the bottoms. Endless ropes f, wound around C and routed over sheaves, translate shaft rotation into controlled vertical motion of the bottoms.",
        archaicTerm: "shafts or spars",
        modernEquivalent: "vertical guide rods and a rotary actuator shaft",
      },
      {
        title: "Check ropes e and air openings m",
        summary:
          "Retaining ropes set immersion while openings exchange air during expansion and contraction.",
        technicalDetails:
          "Check ropes e hold the upper sides when the lower sides are forced down, opening the chamber. Their length governs immersion depth. Openings m admit and emit air, so the mechanism does not require a separate pressure vessel or pump.",
        archaicTerm: "check ropes",
        modernEquivalent: "travel-limiting tension members",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Archimedes' principle",
        formula: "F_B = \\rho_{water} g V_{displaced}",
        explanation:
          "Expanding the side chambers increases the water volume displaced by the vessel-and-chamber system. At equilibrium, the buoyant force balances the vessel's weight, so extra displaced volume raises the hull and reduces draft.",
      },
      {
        principle: "Rotary-to-linear rope drive",
        formula: "s = r\\theta",
        explanation:
          "For a rope wrapped around shaft C, a shaft rotation $\\theta$ moves rope length s in proportion to drum radius r. The sheaves redirect that motion down the sides of the vessel to the sliding spars.",
      },
    ],
    whyItMattersToday:
      "The document is a precise early statement of adjustable displacement: it identifies the chamber, its guides, the rope transmission, air exchange, and a reversible stowed state. The claim is narrower than the general idea of floating a vessel because it requires that particular working combination.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "What I claim as my invention and desire to secure by letters patent, is the combination of expansible buoyant chambers placed at the sides of a vessel, with the main shaft or shafts C, by means of the sliding spars or shafts D, which pass down through the buoyant chambers and are made fast to their bottoms, and the series of ropes and pullies, or their equivalents, in such a manner that by turning the main shaft or shafts in one direction, the buoyant chambers will be forced downwards into the water and at the same time expanded and filled with air for buoying up the vessel by the displacement of water; and by turning the shaft in an opposite direction, the buoyant chambers will be contracted into a small space and secured against injury.",
      plainEnglish:
        "Claim 1 covers the combination, not buoyancy in the abstract: expansible chambers at vessel sides; main shaft C; sliding spars D fixed to the chamber bottoms; and ropes and pulleys or equivalents. Rotation in one direction must drive the chambers down, expand them, and fill them with air to buoy the vessel by water displacement; reverse rotation must contract and protect them.",
      keyInnovations: [
        "expansible side chambers",
        "main shaft C",
        "sliding spars D",
        "reversible rope-and-pulley actuation",
      ],
      legalSignificance:
        "The sole printed claim expressly combines the structural parts with both operating directions. The specification's statements that details may vary do not turn the claim into ownership of every buoyancy aid.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Side elevation with chambers expanded",
      caption:
        "Source drawing sheet, PDF page 1: side elevation of a vessel with buoyant chambers combined therewith and expanded.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-a",
          figureRef: "Fig. 1",
          label: "A",
          element: "Buoyant chamber",
          description: "Expansible side chamber.",
          x: 42,
          y: 64,
        },
        {
          id: "lb-b",
          figureRef: "Fig. 1",
          label: "B",
          element: "Box",
          description: "Receiving box on the lower guard when the chamber is contracted.",
          x: 48,
          y: 60,
        },
        {
          id: "lb-c",
          figureRef: "Fig. 1",
          label: "C",
          element: "Main shaft",
          description: "Longitudinal shaft driving the endless ropes.",
          x: 50,
          y: 34,
        },
        {
          id: "lb-d",
          figureRef: "Fig. 1",
          label: "D",
          element: "Vertical spars",
          description: "Spars fixed to chamber bottoms and guided vertically.",
          x: 43,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Transverse section with chambers contracted",
      caption:
        "Source drawing sheet, PDF page 1: transverse section of the vessel with buoyant chambers contracted.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-f",
          figureRef: "Fig. 2",
          label: "f",
          element: "Endless ropes",
          description: "Ropes joining main shaft C to the vertical spars.",
          x: 51,
          y: 42,
        },
        {
          id: "lb-i",
          figureRef: "Fig. 2",
          label: "i",
          element: "Rope connection",
          description: "Point where ropes f connect to the vertical shafts.",
          x: 42,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Longitudinal vertical chamber section",
      caption:
        "Source drawing sheet, PDF page 1: longitudinal vertical section through a buoyant chamber and its receiving box.",
      svgType: "lincoln-buoy",
      callouts: [
        {
          id: "lb-e",
          figureRef: "Fig. 3",
          label: "e",
          element: "Check rope",
          description: "Rope retaining the upper chamber side during expansion.",
          x: 45,
          y: 33,
        },
        {
          id: "lb-g",
          figureRef: "Fig. 3",
          label: "g",
          element: "Chamber top",
          description: "Rigid top made of plank or metal.",
          x: 54,
          y: 38,
        },
        {
          id: "lb-h",
          figureRef: "Fig. 3",
          label: "h",
          element: "Chamber bottom",
          description: "Rigid bottom made of plank or metal.",
          x: 54,
          y: 67,
        },
        {
          id: "lb-m",
          figureRef: "Fig. 3",
          label: "m",
          element: "Air opening",
          description: "Opening admitting and emitting air during chamber movement.",
          x: 50,
          y: 51,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The specification names a direct operating problem: reduce a vessel's draught sufficiently to pass bars or shallow water without discharging cargo.",
    priorArtLimitations: [
      "The source identifies cargo discharge as the avoided response to a bar or shallow water.",
      "The source also distinguishes a compact protected state from an expanded working state, making a permanently protruding float unsuitable for the stated arrangement.",
    ],
    breakthroughInsight:
      "Instead of altering cargo mass, the apparatus changes displaced volume with side-mounted chambers and a reversible mechanical drive.",
    patentWars: [],
    civilizationalImpact:
      "The source provides a fully specified nineteenth-century mechanism for adjustable vessel displacement, including its geometry, force transmission, stowage, and air exchange. This record makes no further historical-impact claim without a separate cited source.",
    aftermath:
      "The grant is dated May 22, 1849. The facsimile does not state whether the proposed apparatus was built or adopted.",
    sideNotes: [
      "The execution on PDF page 3 reads A. LINCOLN, with Z. C. ROBBINS and H. H. SYLVESTER as witnesses.",
    ],
  },
  tags: ["Abraham Lincoln", "Marine engineering", "Buoyancy", "Steamboats", "Hydraulics"],
  stats: { totalClaims: 1, independentClaims: 1 },
};
