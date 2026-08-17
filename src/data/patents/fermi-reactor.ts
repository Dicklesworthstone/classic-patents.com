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
37 Claims. (Cl. 204-193.2)

SPECIFICATION

TO ALL WHOM IT MAY CONCERN:
Be it known that we, ENRICO FERMI and LEO SZILARD, citizens of the United States, have invented certain new and useful improvements in NEUTRONIC REACTORS, of which the following is a specification:

GENERAL THEORY OF NEUTRONIC REACTIONS
In a neutronic reactor, uranium nuclei undergo fission upon absorption of a thermal or slow neutron. Each fission event releases an average of approximately 2.5 fast neutrons along with roughly 200 million electron volts (MeV) of kinetic energy and radioactive fission fragments.

If the neutrons emitted by one generation of fissions induce, on average, exactly one subsequent fission in the next generation, the system is said to be "critical" (k = 1.0) and a steady, self-sustaining release of nuclear energy is maintained. If k < 1.0, the reaction is subcritical and decays to zero. If k > 1.0, the reaction is supercritical and the neutron population multiplies exponentially.

HETEROGENEOUS MODERATOR GEOMETRY
In natural uranium, the isotope U-238 exhibits intense resonance capture cross-sections for neutrons possessing kinetic energies between 5 eV and 100 eV. To prevent fast fission neutrons from being captured in U-238 resonances, we introduce the concept of the heterogeneous lattice.

By aggregating the uranium into discrete lumps (cylinders, spheres, or rods) embedded in a matrix of high-purity carbon (graphite), fast neutrons born in a fuel lump escape into the moderator before undergoing resonance capture. In traversing the graphite, the neutrons collide elastically with carbon nuclei, losing energy in steps until they attain thermal equilibrium with the ambient medium (~0.025 eV). Once thermalized, the neutrons diffuse back into a fuel lump, where the fission cross-section of U-235 is extremely large (580 barns), thereby producing sustained nuclear fission.

REACTIVITY CONTROL
To regulate the rate of nuclear energy release and shut down the reaction at will, channels are provided through the core structure for the insertion of control elements composed of materials possessing very high thermal neutron absorption cross-sections, such as cadmium (Cd) or boron (B).

Withdrawal of the cadmium control rods decreases neutron absorption, increasing k_eff above unity and allowing reactor power to rise. Reinsertion of the rods increases absorption, lowering k_eff below unity and terminating the reaction. Because approximately 0.65% of the neutrons are emitted with time delays ranging from fractions of a second to over 50 seconds following fission product beta decay, mechanical adjustment of the control rods provides stable, safe manual and automatic control.

WE CLAIM:
1. A neutronic reactor comprising a mass of neutron moderating material having a neutron capture cross-section to scattering cross-section ratio less than 0.005, and bodies of a fissionable material disposed in said moderating material in a spaced geometric lattice, the volume ratio of moderating material to fissionable material, the spatial configuration of said bodies, and the purity of said materials being coordinated to provide a neutron reproduction ratio k for an infinite system greater than unity.
2. A reactor as set forth in claim 1, wherein said moderating material is high-purity graphite and said fissionable material comprises natural uranium.
3. A reactor as set forth in claim 1, further comprising neutron-absorbing control rods slidably disposed within said mass for movement into and out of said moderating material to selectively adjust the effective reproduction factor k_eff of the reactor.`,
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
        "1. A neutronic reactor comprising a mass of neutron moderating material having a neutron capture cross-section to scattering cross-section ratio less than 0.005, and bodies of a fissionable material disposed in said moderating material in a spaced geometric lattice, the volume ratio of moderating material to fissionable material, the spatial configuration of said bodies, and the purity of said materials being coordinated to provide a neutron reproduction ratio k for an infinite system greater than unity.",
      plainEnglish:
        "The master patent claim covering the nuclear reactor: a geometric lattice of fissionable fuel bodies embedded in a low-absorption neutron moderating material, dimensioned and purified to achieve a neutron reproduction factor k exceeding 1.0.",
      keyInnovations: [
        "Heterogeneous moderator-fuel geometric lattice",
        "Neutron reproduction factor k > 1.0 in natural uranium",
        "Low neutron capture cross-section moderating medium",
      ],
      legalSignificance:
        "The pioneer patent claim defining the basic structural and physics architecture of all nuclear fission reactors.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. A reactor as set forth in claim 1, wherein said moderating material is high-purity graphite and said fissionable material comprises natural uranium.",
      plainEnglish:
        "Specifies the combination of high-purity graphite carbon as the moderator and natural un-enriched uranium metal/oxide as the fissionable fuel.",
      keyInnovations: ["Ultra-pure graphite carbon moderator", "Natural un-enriched uranium fuel"],
      legalSignificance:
        "Protected the graphite-moderated natural uranium reactor architecture used in early production reactors.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "3. A reactor as set forth in claim 1, further comprising neutron-absorbing control rods slidably disposed within said mass for movement into and out of said moderating material to selectively adjust the effective reproduction factor k_eff of the reactor.",
      plainEnglish:
        "Specifies movable neutron-absorbing control rods (cadmium/boron) inserted into the core channels to dynamically adjust reactivity and regulate or terminate the chain reaction.",
      keyInnovations: ["Movable cadmium/boron control rods for dynamic reactivity control"],
      legalSignificance:
        "Secured the primary mechanical control mechanism used in nuclear reactors worldwide.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective Cutaway of Graphite Reactor Core",
      caption:
        "Isometric cutaway of the Chicago Pile-1 reactor core showing stacked graphite moderator blocks, discrete uranium fuel channels, and control rod penetrations.",
      svgType: "fermi-reactor",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "20",
          element: "High-Purity Graphite Moderator",
          description: "Ultra-pure graphite carbon blocks slowing fast fission neutrons.",
          x: 40,
          y: 45,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "22",
          element: "Uranium Fuel Lattice",
          description: "Discrete natural uranium metal and oxide cylinders in channels.",
          x: 60,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Control Rod Channels & Safety Mechanism",
      caption:
        "Vertical cross-section showing motorized cadmium control rods, counterweight scram lines, and neutron flux monitoring chambers.",
      svgType: "fermi-reactor",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "28",
          element: "Cadmium Control Rod",
          description: "Thermal neutron absorber rod regulating core reactivity ($k_{eff}$).",
          x: 50,
          y: 20,
        },
      ],
    },
  ],
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
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1944–1955",
    impactScore: 100,
  },
};
