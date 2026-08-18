import { FERMI_REACTOR_FIGURE_CAPTIONS } from "@/data/editions/fermiReactorEdition";
import type { Patent } from "@/types/patent";

export const fermiReactorPatent: Patent = {
  id: "us-2708656-fermi-reactor",
  patentNumber: "US 2,708,656",
  title: "Neutronic Reactor",
  shortTitle: "Fermi & Szilárd's Nuclear Reactor",
  subtitle: "Heterogeneous Graphite Moderator, Uranium Lattice, and Cadmium Control Rods",
  inventors: ["Enrico Fermi", "Leo Szilard"],
  inventorLocation: "Santa Fe, New Mexico & Chicago, Illinois",
  grantDate: "1955-05-17",
  filingDate: "1944-12-19",
  era: "Atomic & Space Age (1940–1970)",
  category: "electricity",
  categoryLabel: "Nuclear Physics & Energy",
  summary:
    "The Dawn of the Atomic Age: On December 19, 1944, Enrico Fermi and Leo Szilard filed US Patent No. 2,708,656 for the world's first artificial nuclear fission reactor (Chicago Pile-1). Solving the central puzzle of nuclear physics—how to sustain an atomic chain reaction using natural, un-enriched uranium (0.7% U-235)—Fermi and Szilard invented the heterogeneous lattice. By embedding discrete lumps of uranium inside high-purity graphite carbon, fast 2 MeV fission neutrons were slowed to thermal energies (0.025 eV) without getting swallowed by U-238 resonance traps, achieving a self-sustaining neutron reproduction factor $k_{eff} \\ge 1.0$ on December 2, 1942.",
  heroQuote:
    "The Italian navigator has landed in the New World... The earthlings were very friendly.",
  originalPdfUrl: "/patents/pdfs/us-2708656-fermi-reactor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2708656A/en",
  usptoClassification: "G21C 1/00 (Nuclear reactors; Core structures and control)",
  originalTextAsset: {
    url: "/patents/source-text/us-2708656-fermi-reactor.txt",
    pageCount: 58,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE
2,708,656
Patented May 17, 1955

NEUTRONIC REACTOR
Enrico Fermi, Santa Fe, N. Mex., and Leo Szilard, Chicago, Ill., assignors to the United States of America as represented by the United States Atomic Energy Commission
Application December 19, 1944, Serial No. 568,904
8 Claims. (Cl. 204–193)

The 58-page pinned facsimile comprises 27 drawing sheets, the complete two-column specification, eight claims, cited references, and a certificate of correction. Its earlier text field was an invented summary, not a transcription. It is deliberately withheld from the public archival face until a complete, typed, page-by-page edition has been reviewed against the facsimile.`,
  plainEnglishExplanation: {
    overview:
      "Before Enrico Fermi and Leo Szilard, human energy came entirely from chemical combustion (rearranging outer electron shells, yielding ~4 eV per molecule). Nuclear fission unlocks the binding energy of the atomic nucleus, releasing 200,000,000 eV per uranium atom—50 million times more energy per kilogram than coal. However, natural uranium consists of 99.3% non-fissionable U-238 and only 0.7% fissionable U-235. In raw uranium, fast 2 MeV fission neutrons are instantly captured non-fissionably by U-238 atoms, snuffing out the reaction. Fermi and Szilard solved this by spacing uranium cylinders into a geometric lattice embedded within ultra-pure graphite carbon blocks, slowing neutrons down until they selectively split U-235 atoms in a self-sustaining chain reaction.",
    coreMechanism:
      "When a U-235 nucleus splits inside a fuel lump, it emits 2.5 fast neutrons with 2 MeV kinetic energy ($v \\approx 20,000\\text{ km/s}$). Because the fuel is clumped into discrete lumps rather than mixed uniformly, fast neutrons quickly escape the lump into the surrounding graphite moderator. Over ~114 elastic collisions with carbon-12 nuclei, the neutrons slow down to room-temperature thermal energy ($0.025\\text{ eV}$, $v \\approx 2.2\\text{ km/s}$), safely bypassing the dangerous 5–100 eV resonance absorption bands of U-238. The thermalized neutrons diffuse back into a neighboring uranium lump, where the U-235 fission cross-section is massive (584 barns), triggering new fissions. Motorized cadmium control rods absorb thermal neutrons ($\\sigma_a = 20,600\\text{ barns}$) to balance the effective multiplication factor at exactly $k_{eff} = 1.0000$.",
    mechanicalBreakdown: [
      {
        title: "Heterogeneous Uranium-Graphite Fuel Lattice",
        summary: "Discrete uranium metal and oxide cylinders arranged in a 3D cubic lattice.",
        technicalDetails:
          "Geometrically separating fuel lumps from the moderator increases the resonance escape probability ($p$) from ~0.5 in homogeneous mixtures to >0.87, enabling criticality ($k_\\infty = \\eta \\epsilon p f > 1.0$) in un-enriched natural uranium.",
        archaicTerm: "Bodies of fissionable material disposed in a spaced geometric lattice",
        modernEquivalent: "Nuclear reactor core / Fuel rod assembly matrix",
      },
      {
        title: "High-Purity Carbon Graphite Moderator",
        summary:
          "Ultra-pure graphite blocks surrounding fuel channels with zero boron contamination.",
        technicalDetails:
          "Carbon-12 has low mass ($A=12$) and an extraordinarily tiny thermal neutron capture cross-section ($\\sigma_a = 0.0035\\text{ barns}$), slowing neutrons through elastic collisions without absorbing them.",
        archaicTerm: "Neutron moderating material",
        modernEquivalent: "Reactor moderator (Graphite / Heavy Water / Light Water)",
      },
      {
        title: "Movable Cadmium Neutron Absorption Control Rods",
        summary:
          "Motorized rods sliding into the core to regulate neutron population and power output.",
        technicalDetails:
          "Cadmium-113 possesses a gigantic thermal neutron capture cross-section ($\\sigma_a = 20,600\\text{ barns}$). Adjusting rod depth precisely regulates reactivity $\\rho = (k_{eff}-1)/k_{eff}$.",
        archaicTerm: "Neutron-absorbing control rods",
        modernEquivalent: "Control rod drive mechanism (CRDM) / Scram safety rods",
      },
      {
        title: "Delayed Neutron Passive Safety Buffer",
        summary:
          "Fission product beta decay generating delayed neutrons across multi-second timescales.",
        technicalDetails:
          "Approximately 0.65% of fission neutrons ($\beta = 0.0065$) are emitted with half-lives of 0.2 to 55 seconds (e.g. Br-87, I-137), expanding the reactor period from microseconds to tens of seconds and enabling stable manual/automatic control.",
        archaicTerm: "Delayed neutron emission from fission fragments",
        modernEquivalent: "Delayed neutron precursor groups / Dynamic reactivity feedback",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Fermi Four-Factor Formula & Criticality Geometry",
        formula:
          "k_\\infty = \\eta \\cdot \\epsilon \\cdot p \\cdot f \\implies k_{eff} = k_\\infty P_{FNL} P_{TNL} = \\frac{k_\\infty e^{-B^2 \\tau}}{1 + L^2 B^2}",
        explanation:
          "Criticality ($k_{eff} = 1$) requires balancing neutron reproduction factor ($\\eta$), fast fission factor ($\\epsilon$), resonance escape probability ($p$), thermal utilization ($f$), and non-leakage probabilities ($P_{NL}$).",
      },
      {
        principle: "Logarithmic Energy Loss in Elastic Moderation",
        formula:
          "\\xi = 1 + \\frac{(A-1)^2}{2A}\\ln\\left(\\frac{A-1}{A+1}\\right) \\approx \\frac{2}{A + 2/3}, \\quad N = \\frac{\\ln(E_0/E_{th})}{\\xi} \\approx 114 \\; (\\text{Carbon-12})",
        explanation:
          "Neutrons transfer kinetic energy to carbon nuclei through billiard-ball elastic collisions, slowing from 2 MeV down to thermal energy (0.025 eV) in approximately 114 steps.",
      },
      {
        principle: "6-Group Delayed Neutron Point Reactor Kinetics",
        formula:
          "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^{6} \\lambda_i C_i, \\quad \\frac{dC_i}{dt} = \\frac{\\beta_i}{\\Lambda} n - \\lambda_i C_i",
        explanation:
          "Because delayed neutrons ($\beta = 0.0065$) are released seconds after fission, the reactor period $T = \\frac{\\beta - \\rho}{\\lambda \\rho}$ is prolonged to tens of seconds, making nuclear reactors safe to control.",
      },
      {
        principle: "Resonance Escape Probability in Lumped Lattices",
        formula:
          "p = \\exp\\left(-\\frac{N_U}{\\xi \\Sigma_s} I_{eff}\\right), \\quad I_{eff} = A + B \\frac{S}{M}",
        explanation:
          "Concentrating uranium into lumps reduces the effective resonance integral $I_{eff}$ by self-shielding interior U-238 atoms, allowing fast neutrons to safely escape into the moderator.",
      },
      {
        principle: "Geometric Buckling & Core Critical Dimensions",
        formula:
          "B_g^2 = \\left(\\frac{\\pi}{H}\\right)^2 + \\left(\\frac{2.4048}{R}\\right)^2, \\quad \\nabla^2 \\Phi + B^2 \\Phi = 0",
        explanation:
          "Solving the Helmholtz neutron diffusion equation determines the exact critical radius $R$ and height $H$ required to ensure neutron production exceeds boundary leakage.",
      },
    ],
    whyItMattersToday:
      "Enrico Fermi and Leo Szilard's nuclear reactor patent is the foundational patent for all civil nuclear power and naval propulsion. Today, over 440 commercial nuclear reactors in 32 countries generate roughly 10% of the world's zero-carbon electricity, while nuclear-powered submarines and aircraft carriers operate for 25+ years without refueling—all governed by Fermi and Szilard's four-factor lattice physics and delayed neutron kinetics.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator of graphite and natural uranium rods disposed in a geometric pattern therein, the size of the rods and the volume ratio of moderator to uranium being within the area encompassed by the k=1.00 curve of Figure 3, the purity of the graphite and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "This claim is limited to graphite moderator and natural-uranium rods. Their size and graphite-to-uranium volume ratio must fall within the Fig. 3 region marked k=1.00, and the materials and total mass must be sufficient for a self-sustaining chain reaction.",
      keyInnovations: ["Graphite moderator", "Natural-uranium rods", "Fig. 3 criticality contour"],
      legalSignificance:
        "The first printed claim is a specific graphite-and-natural-uranium rod reactor, not a general claim to every reactor lattice.",
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator selected from the group consisting of heavy water and graphite and bodies of a thermal neutron fissionable material selected from the group consisting of natural uranium and natural uranium oxide disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the shape of the bodies and the radius of the bodies and the volume ratio of moderator to thermal neutron fissionable material being within the area encompassed by the k=1.00 curve of Figures 2 through 6, the purity of the moderator and the thermal neutron fissionable material and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "This broader independent claim permits graphite or heavy water, natural uranium or natural uranium oxide, and several fuel-body shapes. The geometry must fall within the k=1.00 contour regions in Figs. 2–6, with continuous surrounding moderator and enough pure material and mass for a chain reaction.",
      keyInnovations: [
        "Graphite or heavy-water moderator",
        "Natural uranium or oxide",
        "Figs. 2–6 criticality contours",
      ],
      legalSignificance:
        "The printed scope expressly ties its alternatives to the plotted geometry ranges rather than claiming any possible moderator-fuel arrangement.",
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium in the form of spheres disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium being within the area encompassed by the k=1.00 curve of Figure 2, the purity of the moderator and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 3 narrows the construction to natural-uranium spheres in continuous graphite, using the Fig. 2 k=1.00 contour to define the allowed sphere radius and moderator-to-uranium ratio.",
      keyInnovations: [
        "Natural-uranium spheres",
        "Graphite continuous phase",
        "Fig. 2 criticality contour",
      ],
      legalSignificance:
        "This is a separate sphere-lattice claim; the printed claim does not mention a control rod.",
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium oxide in the form of spheres disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium oxide being within the area encompassed by the k=1.00 curve of Figure 4, the purity of the moderator and the uranium oxide and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 4 is the uranium-oxide-sphere counterpart of claim 3. It requires continuous graphite around each sphere and uses Fig. 4, not Fig. 2, for the k=1.00 geometry range.",
      keyInnovations: [
        "Natural uranium-oxide spheres",
        "Continuous graphite moderator",
        "Fig. 4 criticality contour",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator of graphite and bodies of natural uranium oxide in the form of rods disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium oxide being within the area encompassed by the k=1.00 curve of Figure 5, the purity of the moderator and the uranium oxide and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 5 changes the uranium-oxide bodies from spheres to rods and points to Fig. 5 for the k=1.00 radius and volume-ratio range; the graphite must remain a continuous phase around each body.",
      keyInnovations: [
        "Natural uranium-oxide rods",
        "Continuous graphite moderator",
        "Fig. 5 criticality contour",
      ],
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "A neutronic reactor which comprises a moderator of heavy water and bodies of natural uranium in the form of rods disposed in a geometric pattern therein, each body being surrounded by moderator and the moderator being in a substantially continuous phase, the radius of the bodies and the volume ratio of moderator to uranium being within the area encompassed by the k=1.00 curve of Figure 6, the purity of the moderator and the uranium and the total mass thereof being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 6 covers natural-uranium rods in heavy water. It requires a continuous heavy-water phase and locates the working rod size and moderator-to-uranium ratio on the Fig. 6 k=1.00 contour.",
      keyInnovations: [
        "Heavy-water moderator",
        "Natural-uranium rods",
        "Fig. 6 criticality contour",
      ],
    },
    {
      number: 7,
      isIndependent: true,
      originalText:
        "In a neutronic reactor having an active portion comprising a moderator of graphite having dispersed therein uranium containing U235 and U238, the improved construction wherein the uranium is aggregated in the form of bodies substantially free of moderator and of neutron absorbers other than U238, said bodies being in the moderator, geometrically spaced therein, and surrounded by the moderator, the moderator being in a substantially continuous phase, said bodies having all dimensions thereof at least 0.5 centimeter, the purity of the moderator and the uranium, the size and spacing of the bodies of uranium in the moderator, and the total mass of uranium and moderator being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 7 states the broader graphite-lattice construction in terms of uranium containing U-235 and U-238. It requires fuel bodies at least 0.5 cm in every dimension, substantially free of moderator and other absorbers, geometrically spaced and surrounded by a continuous graphite phase, with sufficient purity, size, spacing, and mass for a chain reaction.",
      keyInnovations: [
        "U-235/U-238 fuel bodies",
        "At least 0.5 cm fuel dimensions",
        "Geometrically spaced continuous-phase graphite lattice",
      ],
    },
    {
      number: 8,
      isIndependent: true,
      originalText:
        "In a neutronic reactor having an active portion comprising a mass of moderator selected from the group consisting of graphite and heavy water, having dispersed therein a thermal neutron fissionable material containing a thermal neutron fissionable isotope and an isotope having a resonance absorption for neutrons, the improved construction wherein the thermal neutron fissionable material is aggregated in the form of bodies substantially free of moderator and of neutron absorbers other than said latter isotope, said bodies being in the moderator, geometrically spaced therein, and surrounded by the moderator, the moderator being in a substantially continuous phase, said bodies having all dimensions thereof at least 0.5 centimeter, the purity of the moderator and the thermal neutron fissionable material, the size and spacing of the bodies of fissionable material in the moderator, and the total mass of fissionable material and moderator being sufficient to sustain a chain reaction.",
      plainEnglish:
        "Claim 8 generalizes the 0.5 cm discrete-body lattice to graphite or heavy water and to a fuel that contains both a thermally fissionable isotope and a resonance-absorbing isotope. It preserves the same continuous moderator phase, geometric spacing, purity, and total-mass conditions.",
      keyInnovations: [
        "Graphite or heavy-water moderator",
        "Discrete fuel bodies at least 0.5 cm",
        "Resonance-absorbing isotope constraint",
      ],
    },
  ],
  drawings: Array.from({ length: 42 }, (_, index) => {
    const figureNumber = `Fig. ${index + 1}` as const;
    return {
      figureNumber,
      title: figureNumber,
      caption: FERMI_REACTOR_FIGURE_CAPTIONS[figureNumber],
      // The shared schematic renderer has no source-raster mode. Do not invent
      // numbered callouts for these sheets; the forthcoming archival edition
      // links each explicit source reference to its preserved source crop.
      svgType: "fermi-reactor",
      callouts: [],
    };
  }),
  historicalContext: {
    problemStatement:
      "Following the discovery of nuclear fission by Otto Hahn, Fritz Strassmann, and Lise Meitner in late 1938, physicists realized that uranium atoms release immense energy when split by a neutron. However, natural uranium consists of 99.3% non-fissionable U-238 and only 0.7% fissionable U-235. Fast 2 MeV neutrons emitted during fission are captured non-fissionably by U-238 in 'resonance absorption' energy bands, extinguishing the chain reaction before a second generation can occur. Creating an atomic chain reaction was considered impossible without trillions of dollars in uranium isotope enrichment.",
    priorArtLimitations: [
      "Homogeneous mixtures of uranium and water or carbon suffered 100% resonance capture extinction in U-238.",
      "Commercial industrial graphite contained minute boron impurities (a few parts per million) that absorbed all thermal neutrons.",
      "No controlled nuclear chain reaction had ever been demonstrated in human history.",
    ],
    breakthroughInsight:
      "Enrico Fermi and Leo Szilard made two monumental breakthroughs. First, Szilard realized that industrial graphite was poisoned by trace boron and personally convinced chemical manufacturers to produce unprecedented ultra-pure, boron-free graphite. Second, Fermi developed the mathematical physics of the **heterogeneous lattice**: by aggregating uranium into discrete lumps spaced evenly throughout graphite blocks, fast neutrons escape the uranium lump into the carbon matrix, undergo ~114 elastic collisions to slow down to 0.025 eV, and diffuse back into neighboring lumps to split U-235 without ever being captured by U-238!",
    patentWars: [
      {
        rivalName: "Manhattan Project and the Atomic Energy Commission",
        rivalClaim:
          "The United States Government classified all atomic fission research as Top Secret under the 1946 Atomic Energy Act (McMahon Act), preventing any commercial exploitation or foreign filing.",
        conflictDetails:
          "Fermi and Szilard filed their patent application on December 19, 1944. Because the invention was developed under the Manhattan Project, the War Department placed a permanent Secrecy Order on the file. Fermi and Szilard assigned their patent rights to the US Government for the nominal legal sum of **$1.00**.",
        resolution:
          "After the war, under President Dwight D. Eisenhower's **'Atoms for Peace'** initiative, the US Atomic Energy Commission declassified the basic physics of nuclear reactors, officially issuing US Patent No. 2,708,656 on May 17, 1955.",
        legalOutcome:
          "The patent became public prior art, ensuring that basic nuclear reactor physics remained in the public domain and could not be monopolized by private corporations.",
      },
    ],
    civilizationalImpact:
      "On the freezing afternoon of **December 2, 1942**, beneath the abandoned west stands of Stagg Field at the University of Chicago, Chicago Pile-1 reached self-sustaining criticality ($k = 1.0006$). Arthur Compton famously telephoned James Conant at Harvard: *'The Italian navigator has landed in the New World.'* Conant asked: *'How were the natives?'* Compton replied: *'Very friendly.'* Humanity had unlocked the energy of the atomic nucleus.",
    funFact:
      "The unheated squash court beneath Stagg Field was freezing cold (under 30°F / 0°C). Fermi and his team of 49 scientists worked in heavy wool overcoats and fedoras. When CP-1 achieved criticality at 3:53 PM, Hungarian physicist Eugene Wigner produced a hidden bottle of Italian Chianti red wine. The scientists drank the wine silently from paper cups and signed their names on the straw Chianti basket.",
    aftermath:
      "Enrico Fermi received the 1938 Nobel Prize in Physics and became one of the greatest experimental and theoretical physicists in history. He died of stomach cancer in 1954 at age 53, just six months before his reactor patent was publicly issued. Leo Szilard spent his remaining years campaigning tirelessly for nuclear disarmament, international arms control, and molecular biology.",
    sideNotes: [
      "The term 'SCRAM' (emergency reactor shutdown) allegedly originated at CP-1 as an acronym for 'Safety Control Rod Axe Man'—physicist Norman Hilberry stood ready with a sharp wood axe to sever a hemp rope holding an emergency cadmium rod above the pile if the reaction went runaway!",
      "Dr. Leona Woods Marshall was the sole female physicist present on the squash court during criticality, operating the boron-trifluoride neutron detectors.",
    ],
  },
  tags: [
    "Enrico Fermi",
    "Leo Szilard",
    "Nuclear Reactor",
    "Chicago Pile-1",
    "Manhattan Project",
    "Nuclear Physics",
    "Atomic Age",
    "Atoms for Peace",
  ],
  stats: {
    totalClaims: 8,
    independentClaims: 8,
    patentWarYears: "1944–1955",
    impactScore: 100,
  },
};
