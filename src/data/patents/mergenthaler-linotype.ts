import {
  mergenthalerLinotypeArchivalEdition,
  mergenthalerLinotypeClaims,
} from "@/data/editions/mergenthalerLinotypeEdition";
import type { Patent } from "@/types/patent";

export const mergenthalerLinotypePatent: Patent = {
  id: "us-313224-mergenthaler-linotype",
  patentNumber: "US 313,224",
  title: "Machine for Producing Printing-Bars",
  shortTitle: "Mergenthaler Linotype Hot Metal Typesetting Machine",
  subtitle:
    "Automated Matrix Circulation, Expanding Wedge Spaceband Justification, and Continuous Hot-Metal Casting",
  inventors: ["Ottmar Mergenthaler"],
  inventorLocation: "Baltimore, Maryland",
  grantDate: "1885-03-03",
  filingDate: "1884-08-30",
  era: "Gilded Age & Grid (1870–1900)",
  category: "consumer",
  categoryLabel: "Metallurgy & Mechanical Logic",
  summary:
    "Called 'The Eighth Wonder of the World' by Thomas Edison, Ottmar Mergenthaler's Linotype transformed human literacy, journalism, and information distribution. Before the Linotype, every newspaper line was assembled by hand from individual lead type pieces at 1,500 characters per hour. Mergenthaler automated the entire cycle: an operator typed on a 90-key keyboard, releasing brass character matrices from an inclined gravity magazine. Telescoping wedge spacebands justified the line perfectly against a water-cooled mold, a plunger injected molten eutectic type metal ($84\\%\\text{ Pb}, 12\\%\\text{ Sb}, 4\\%\\text{ Sn}$) at $240^\\circ\\text{C}$ to cast a solid slug ('line-o'-type'), and an elevator arm lifted the matrices to a revolving helical distributor that decoded a 7-bit binary keyway to return each brass matrix back to its exact magazine channel.",
  heroQuote:
    "Be it known that I, Ottmar Mergenthaler, have invented certain new and useful Improvements in Machines for Producing Printing-Bars, of which the following is a specification...",
  originalPdfUrl: "/patents/pdfs/us-313224-mergenthaler-linotype.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US313224A/en",
  usptoClassification: "B41B 11/00 (Matrix-composing machines / Hot-metal casting)",
  archivalEdition: mergenthalerLinotypeArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-313224-mergenthaler-linotype-reviewed.txt",
    pageCount: 35,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SteelNeedle)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "d85530ab4302e8be7e4c0ac280d438756f1dd21dabc844f2c5b2e76861d7444a",
  },
  originalText: `UNITED STATES PATENT OFFICE.
OTTMAR MERGENTHALER, OF BALTIMORE, MARYLAND, ASSIGNOR TO THE
NATIONAL TYPOGRAPHIC COMPANY, OF WEST VIRGINIA.

MACHINE FOR PRODUCING PRINTING-BARS.

SPECIFICATION forming part of Letters Patent No. 313,224, dated March 3, 1885.
Application filed August 30, 1884. (No model.)

To all whom it may concern:
Be it known that I, OTTMAR MERGENTHALER, of Baltimore, in the State of Maryland, have invented certain Improvements in Machines for Producing Printing-Bars, of which the following is a specification.

This invention is directed to the rapid and economical production of letter-press printing, and relates to a machine to be driven by power, and controlled by finger-keys, adapted to produce printing forms or relief surfaces ready for immediate use, thus avoiding the usual operation of type-setting, and also the more recent plan of preparing by machinery matrices from which to cast the forms.

By the use of my machine the operator is enabled to produce with great rapidity printing-bars bearing in relief the selected characters in the sequence and arrangement in which they are to be printed. In short, the machine will produce printing forms or surfaces properly justified, and adapted to be used in the same manner and with precisely the same results as the printing-forms composed of movable type.

My machine embraces two leading groups of mechanism: first, those which form a temporary and changing matrix representing a number of words; and second, those by which molten or plastic material is delivered to the matrix and discharged therefrom in the form of printing-bars. These two groups, which will, for convenience of reference, be hereinafter designated as the “matrix mechanism” and the “casting mechanism,” are so combined that the casting of one bar may be carried on while the characters are being designated and the devices adjusted to adapt the matrix for the production of the next bar, whereby time is economized and the capacity of the machine greatly increased.`,
  plainEnglishExplanation: {
    overview:
      "For 400 years after Johannes Gutenberg, printing was constrained by the manual compositor: a typesetter standing over type cases, picking individual pieces of lead type from compartmentalized wooden drawers at a rate of 1,200 to 1,500 characters per hour, manually spacing each line with copper shims, and tediously redistributing every character back to its case after printing. Ottmar Mergenthaler automated this entire lifecycle into a continuous mechanical closed loop, raising typesetting speed six-fold to over 8,000 characters per hour and enabling modern daily newspapers, mass publishing, and universal public education.",
    coreMechanism:
      "A keyboard operator types keystrokes, tripping escapement pawls at the bottom of a gravity magazine that drops individual brass matrices and two-part steel wedge spacebands down channeled escapement chutes into an assembler elevator. Once a line of text is assembled, the operator trips a transfer lever. A mechanical elevator moves the line to the casting position. An upward-driving justification bar pushes the steel spaceband wedges upward, expanding their wedged tapers until the line tightly bridges the column width without loose gaps. A pump plunger in the hot metal pot drives molten ternary eutectic alloy ($84\\%\\text{ Pb}, 12\\%\\text{ Sb}, 4\\%\\text{ Sn}$) at $240^\\circ\\text{C}$ into a slotted mold box pressed against the brass matrices. The metal freezes in 150 milliseconds without shrinkage, forming a solid type bar (a 'line-o-type') that is ejected into a galley tray. A vertical distributor arm lifts the brass matrices to the top of the machine, sliding them along a keyed distributor rail with 7-bit binary tooth permutations ($B = \\sum b_i 2^i$) until each matrix reaches its matching tooth keyway and falls back into its storage channel ready for immediate reuse.",
    mechanicalBreakdown: [
      {
        title: "Escapement Magazine & 90-Key Operator Deck",
        summary: "Gravity-fed brass matrix storage array with key-lever release pawls.",
        technicalDetails:
          "The magazine holds 90 individual channels containing thousands of reusable brass matrices. Pressing a key actuates an escapement lever, releasing the lowest matrix so it drops onto an inclined leather conveyor belt traveling at $v \\approx 1.2\\text{ m/s}$ into the assembling elevator.",
        archaicTerm: "Matrix magazine and key-releasing escapement",
        modernEquivalent: "Gravity-feed component feeder & mechanical ROM bank",
      },
      {
        title: "Two-Piece Wedge Spaceband Justifier",
        summary: "Sliding wedge pairs providing continuous mechanical line justification.",
        technicalDetails:
          "Each spaceband consists of a stationary long wedge and a sliding short wedge ($5^\\circ\\text{ taper}$). When the justification bar pushes the lower wedges upward, the aggregate line expansion $\\Delta W = \\sum_{k=1}^{n_{\\text{spaces}}} \\Delta y_k \\tan\\theta$ expands the text outwards against heavy vice jaws, eliminating loose type or variable spacing.",
        archaicTerm: "Expansible wedge-spacers",
        modernEquivalent: "Kinematic wedge auto-justifier",
      },
      {
        title: "Hot-Metal Pot & Water-Cooled Mold Disc",
        summary: "Plunger-pumped molten eutectic casting of solid line slugs.",
        technicalDetails:
          "The gas-heated melting pot holds ternary Linotype alloy ($84\\%\\text{ Pb}, 12\\%\\text{ Sb}, 4\\%\\text{ Sn}$) maintained at $240^\\circ\\text{C} \\le T \\le 260^\\circ\\text{C}$. A cam-driven pump plunger injects molten metal under pressure through throat orifices into the mold box. The antimony expands slightly upon crystallizing, offsetting lead's liquid-to-solid contraction to achieve razor-sharp typographic edge fidelity.",
        archaicTerm: "Melting-pot, pump-plunger, and casting-mold",
        modernEquivalent: "Pressure die-casting crucible and injection mold",
      },
      {
        title: "Binary Keyway Distributor Rail",
        summary: "Combinatorial 7-bit binary tooth sorting rail for matrix redistribution.",
        technicalDetails:
          "Each brass matrix features a V-shaped top notch cut with a unique combination of 7 teeth ($2^7 = 128\\text{ permutations}$). As the matrix is propelled along the ribbed distributor screw rail, it disengages and falls into its exact magazine slot when the rail teeth match its specific binary cut.",
        archaicTerm: "Distributor-bar with combinational ribs",
        modernEquivalent: "7-bit mechanical binary demultiplexer",
      },
      {
        title: "First & Second Transfer Dual Mechanical Elevators",
        summary:
          "Articulated counter-balanced elevator levers transferring matrices between levels.",
        technicalDetails:
          "Two intermeshing vertical elevator arms driven by peripheral box cams on the main rear camshaft. The first elevator lowers the assembled line into the casting jaw ($z = 180\\text{ mm}$); after casting, the second elevator lifts the matrices $650\\text{ mm}$ to the top distributor rail while a sliding shifter separates the steel spacebands and drops them into their dedicated storage box.",
        archaicTerm: "First and second elevators for transferring matrices",
        modernEquivalent: "Synchronized dual-axis mechanical transfer elevator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Binary Keyway Matrix Sorting Logic",
        formula: "B = \\sum_{i=0}^{6} b_i 2^i, \\quad b_i \\in \\{0, 1\\}",
        explanation:
          "Mergenthaler implemented a 7-bit mechanical binary keyway where the presence or absence of tooth grooves encodes one of 90 channel positions, mechanically demultiplexing matrices into their storage slots at 270 matrices per minute.",
      },
      {
        principle: "Ternary Eutectic Solidification Thermodynamics",
        formula:
          "\\Delta V_{\\text{freeze}} = V_{\\text{solid}} - V_{\\text{liquid}} \\approx 0 \\quad (84\\%\\text{ Pb}, 12\\%\\text{ Sb}, 4\\%\\text{ Sn})",
        explanation:
          "The ternary Linotype alloy has a sharp eutectic freezing point at $240^\\circ\\text{C}$. The $12\\%$ antimony content expands upon crystal formation, canceling the thermal contraction of the lead matrix and producing sharp printing letterforms without internal void defects.",
      },
      {
        principle: "Wedge Mechanical Advantage for Line Justification",
        formula: "F_{\\text{clamp}} = \\frac{F_{\\text{upward}}}{2 \\tan(\\theta) + \\mu_s}",
        explanation:
          "Driving the spaceband wedges upward converts vertical elevator force into lateral clamping thrust with high mechanical advantage, compressing all word spaces equally until the line meets the rigid column stop.",
      },
      {
        principle: "Chvorinov Rule of Rapid Mold Solidification",
        formula:
          "t_{\\text{freeze}} = B \\cdot \\left(\\frac{V_{\\text{slug}}}{A_{\\text{mold}}}\\right)^2 \\approx 150\\text{ ms}",
        explanation:
          "The high surface-area-to-volume ratio of the thin type slug ($V/A < 1.5\\text{ mm}$) combined with water-cooled steel mold disc conduction extracts the latent heat of fusion in under 200 ms, enabling high-cadence casting cycles.",
      },
      {
        principle: "Multi-Axis Synchronous Camshaft Kinematics",
        formula:
          "\\theta_{\\text{subsystem}}(t) = f_i(\\omega_{\\text{main}} t), \\quad \\sum_{i=1}^8 T_{\\text{cam}, i}(\\theta) = \\text{Bounded Torque}",
        explanation:
          "A single central camshaft carrying 8 radial and groove box cams sequences the entire 12-second cycle (elevator descent, vise lock, pump stroke, mold disc rotation, knife trim, elevator ascent, and distributor feed) without electronic synchronization.",
      },
    ],
    whyItMattersToday:
      "Mergenthaler's Linotype powered the global print revolution from 1886 until the phototypesetting and digital desktop publishing transitions of the 1970s and 1980s. It enabled the modern daily newspaper, 100-page Sunday editions, mass-market paperbacks, and universal public literacy. Mergenthaler's binary matrix distributor also represents one of the earliest mechanical implementations of binary combinatorics in industrial computing.",
  },
  claims: mergenthalerLinotypeClaims,
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Linotype Machine Side Elevation & Operating Cycle",
      caption:
        "Side elevation drawing of Mergenthaler's complete typesetting machine showing inclined matrix magazine, 90-key keyboard, assembler elevator, melting pot, and distributor elevator arm.",
      svgType: "mergenthaler-linotype",
      callouts: [
        {
          id: "ml-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Inclined Matrix Magazine",
          description: "90-channel brass matrix storage gravity chute.",
          x: 42,
          y: 22,
        },
        {
          id: "ml-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "90-Key Operating Keyboard",
          description: "Keyboard deck triggering escapement matrix release.",
          x: 28,
          y: 68,
        },
        {
          id: "ml-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Wedge Spaceband Line Assembler",
          description: "Assembler elevator gathering matrices and expanding spaceband wedges.",
          x: 48,
          y: 58,
        },
        {
          id: "ml-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Molten Type-Metal Melting Pot",
          description:
            "Gas-heated pot casting lead-antimony-tin line slugs under plunger pressure.",
          x: 68,
          y: 52,
        },
        {
          id: "ml-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Binary Keyway Distributor Rail",
          description:
            "7-bit binary tooth rail demultiplexing matrices back into magazine channels.",
          x: 62,
          y: 12,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "By the 1880s, the steam-powered rotary printing press could print tens of thousands of newspapers per hour, but the typesetting bottleneck remained unchanged since 1450. Human compositors took 10 hours to set a single 8-page daily newspaper by hand. Typesetters were prone to lead poisoning, repetitive strain, and typist errors. Dozens of inventors spent millions trying to automate typesetting (including Mark Twain, who lost his entire fortune investing in the failed Paige Compositor).",
    priorArtLimitations: [
      "Manual Gutenberg typesetting was limited to 1,500 characters per hour.",
      "The Paige Compositor used over 18,000 delicate moving parts and constantly jammed when handling pre-cast type.",
      "Cold-metal striking machines bruised and deformed soft lead type after a few impressions.",
    ],
    breakthroughInsight:
      "Mergenthaler's brilliant conceptual leap was to realize that one should not attempt to manipulate pre-cast pieces of type. Instead, one should manipulate lightweight, durable brass female matrices, assemble them into a line, cast a fresh, pristine lead slug for each line of text, and then melt the lead back into the pot after printing while reusing the brass matrices indefinitely.",
    patentWars: [
      {
        rivalName: "Tolbert Lanston (Monotype System)",
        rivalClaim:
          "Lanston patented the Monotype system in 1887, casting individual movable type characters from paper tape punch cards, claiming it was superior for mathematical equations and complex tables.",
        conflictDetails:
          "Mergenthaler and Lanston engaged in patent and commercial warfare across newspaper publishers and book printers worldwide throughout the 1890s.",
        resolution:
          "The Linotype dominated fast-turnaround daily newspapers and periodicals due to its monolithic line slugs, while Monotype captured fine book printing and tabular publishing. Mergenthaler's master patent US 313,224 remained completely dominant.",
        legalOutcome:
          "US courts upheld Mergenthaler's spaceband and circulation claims, establishing the Mergenthaler Linotype Company as the uncontested industrial giant of publishing.",
      },
    ],
    civilizationalImpact:
      "On July 3, 1886, the New York Tribune printed the first newspaper in history composed on a Linotype machine. Editor Whitelaw Reid exclaimed: 'Ottmar, you have done it! A line-o'-type!' Within five years, daily newspapers quadrupled in size from 8 pages to 32+ pages, the price of a daily paper dropped from 5 cents to 1 cent, mass literacy exploded worldwide, and thousands of public libraries, periodicals, and books became accessible to the working public.",
    funFact:
      "When Thomas Alva Edison visited Mergenthaler's Baltimore machine shop and watched the Linotype in operation, the great inventor was awestruck and publicly proclaimed the Linotype to be 'The Eighth Wonder of the World.'",
    aftermath:
      "Mergenthaler died of tuberculosis in Baltimore in 1899 at age 45, but his company grew into a global empire. Over 100,000 Linotype machines were manufactured and used in every major printing house worldwide until the late 20th century.",
    sideNotes: [
      "When Linotype operators made a typing error, instead of backspacing, they quickly swiped their fingers down the first two vertical rows of keys on the keyboard, generating the nonsense slug 'ETAOIN SHRDLU' (the letter frequency order of English), which compositors would discard before casting.",
      "Mark Twain (Samuel Clemens) lost over $300,000 (over $10 million in today's dollars) investing in the competing Paige Compositor, driving Twain into bankruptcy just as Mergenthaler's Linotype captured the entire worldwide market.",
    ],
  },
  tags: [
    "Ottmar Mergenthaler",
    "Linotype",
    "Typesetting",
    "Printing Press",
    "Hot Metal Casting",
    "Binary Distributor",
    "Spaceband",
    "Gilded Age",
    "Publishing Revolution",
  ],
  stats: {
    totalClaims: 70,
    independentClaims: 70,
    patentWarYears: "1885–1898",
    impactScore: 100,
  },
};
