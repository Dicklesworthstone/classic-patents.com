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
    "The seminal master patent of nuclear fission power: Enrico Fermi and Leo Szilard's Chicago Pile-1 design featuring a heterogeneous lattice of natural uranium fuel lumps embedded within a high-purity graphite moderator to achieve self-sustaining criticality ($k \\ge 1.0$) with cadmium control rods.",
  heroQuote:
    "The Italian navigator has landed in the New World... The earthlings were very friendly.",
  originalPdfUrl: "/patents/pdfs/us-2708656-fermi-reactor.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2708656A/en",
  usptoClassification: "G21C 1/00 (Nuclear reactors; Core structures and control)",
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
      "Fermi and Szilard solved the central physics puzzle of nuclear fission: how to achieve a self-sustaining atomic chain reaction using un-enriched, natural uranium (which contains 99.3% non-fissionable U-238 and only 0.7% U-235). Their heterogeneous graphite matrix slowed neutrons down without letting them get trapped in U-238 resonance absorption bands.",
    coreMechanism:
      "Fast 2 MeV fission neutrons emitted inside discrete uranium lumps escape into surrounding graphite blocks. After ~114 elastic collisions with carbon nuclei, they slow down to thermal energies (0.025 eV) before diffusing back into a neighboring uranium lump, where they selectively trigger fission in U-235. Movable cadmium rods absorb neutrons to maintain $k_{eff} = 1.000$.",
    mechanicalBreakdown: [
      {
        title: "Heterogeneous Uranium Fuel Lattice",
        summary: "Discrete uranium metal and oxide cylinders spaced in a 3D grid.",
        technicalDetails:
          "Lumping the fuel prevents fast neutrons from immediately colliding with U-238 atoms at resonance capture energies (5–100 eV). The resonance escape probability $p$ increases from ~0.5 in homogeneous mixtures to >0.85 in a lumped lattice.",
        archaicTerm: "Bodies of fissionable material disposed in a spaced geometric lattice",
        modernEquivalent: "Fuel assemblies / fuel rods in reactor core",
      },
      {
        title: "High-Purity Graphite Moderator Matrix",
        summary: "Blocks of ultra-pure graphite carbon surrounding fuel channels.",
        technicalDetails:
          "Carbon-12 has a low atomic mass (A=12) and an extraordinarily low thermal neutron absorption cross-section ($sigma_a = 0.0035$ barns), allowing fast neutrons to thermalize through elastic scattering without parasitic loss.",
        archaicTerm: "Neutron moderating material",
        modernEquivalent: "Graphite moderator / Light water moderator",
      },
      {
        title: "Cadmium / Boron Control Rods",
        summary: "Movable rods containing high neutron absorption cross-section elements.",
        technicalDetails:
          "Cadmium-113 has a massive thermal neutron absorption cross-section ($sigma_a = 20,600$ barns). Inserting the rods reduces the effective reproduction factor $k_{eff} < 1$, shutting down the reactor.",
        archaicTerm: "Neutron-absorbing control elements",
        modernEquivalent: "Control rod drive mechanism (CRDM) / Scram rods",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Fermi Four-Factor Formula",
        formula:
          "k_\\infty = \\eta \\cdot \\epsilon \\cdot p \\cdot f \\implies k_{eff} = k_\\infty P_{NL}",
        explanation:
          "The infinite multiplication factor is the product of reproduction factor (η), fast fission factor (ε), resonance escape probability (p), and thermal utilization (f). Criticality requires $k_{eff} \\ge 1.0$.",
      },
      {
        principle: "Neutron Moderation Logarithmic Energy Loss",
        formula:
          "\\xi = 1 + \\frac{(A-1)^2}{2A}\\ln\\left(\\frac{A-1}{A+1}\\right) \\approx \\frac{2}{A + 2/3}",
        explanation:
          "Average logarithmic energy loss per elastic collision in carbon is ξ = 0.158, requiring ~114 collisions to slow from 2 MeV to 0.025 eV.",
      },
      {
        principle: "Delayed Neutron Reactor Kinetics",
        formula:
          "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^{6} \\lambda_i C_i",
        explanation:
          "Delayed neutrons (β = 0.0065) provide a multi-second time constant, allowing human and motorized mechanical control rods to safely balance criticality.",
      },
    ],
    whyItMattersToday:
      "Fermi and Szilard's patent provided the blueprint for all nuclear energy stations, naval nuclear propulsion, radioisotope cancer treatments, and research reactors operating worldwide today.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. A neutronic reactor comprising a mass of neutron moderating material having a neutron capture cross-section to scattering cross-section ratio less than 0.005, and bodies of a fissionable material disposed in said moderating material in a spaced geometric lattice, the volume ratio of moderating material to fissionable material, the spatial configuration of said bodies, and the purity of said materials being coordinated to provide a neutron reproduction ratio k for an infinite system greater than unity.",
      plainEnglish:
        "Covers the fundamental architecture of a nuclear fission reactor with a low-capture moderator surrounding a geometric lattice of fissionable fuel bodies designed to achieve a neutron reproduction factor k exceeding 1.0.",
      keyInnovations: [
        "Heterogeneous moderator-fuel geometric lattice",
        "Neutron reproduction factor k > 1.0 in natural uranium",
        "Low neutron capture cross-section moderating medium",
      ],
      legalSignificance:
        "The master patent claim for artificial nuclear chain reactions and nuclear energy generation.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. A reactor as set forth in claim 1, wherein said moderating material is high-purity graphite and said fissionable material comprises natural uranium.",
      plainEnglish:
        "Specifies graphite carbon as the moderator and natural metallic/oxide uranium as the fuel.",
      keyInnovations: ["Ultra-pure graphite carbon moderator", "Natural un-enriched uranium fuel"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "3. A reactor as set forth in claim 1, further comprising neutron-absorbing control rods slidably disposed within said mass for movement into and out of said moderating material to selectively adjust the effective reproduction factor k_eff of the reactor.",
      plainEnglish:
        "Specifies movable neutron-absorbing rods (cadmium/boron) to regulate reactivity and maintain criticality.",
      keyInnovations: ["Movable cadmium/boron control rods for dynamic reactivity control"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Perspective Cutaway of Graphite Reactor Core",
      caption: "Isometric cutaway of Chicago Pile-1 graphite lattice and fuel channels.",
      svgType: "fermi-reactor",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "Graphite Moderator",
          element: "20",
          description: "High-purity carbon moderator blocks",
          x: 40,
          y: 45,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "Uranium Fuel Lattice",
          element: "22",
          description: "Natural uranium cylinders in channels",
          x: 60,
          y: 55,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Control Rod Channels & Safety Mechanism",
      caption: "Vertical cross-section showing motorized cadmium control rods.",
      svgType: "fermi-reactor",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "Cadmium Control Rod",
          element: "28",
          description: "Thermal neutron absorber rod",
          x: 50,
          y: 20,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Natural uranium consists of 99.3% uranium-238 and only 0.7% fissionable uranium-235. When a U-235 nucleus fissions, it releases fast neutrons with kinetic energies of ~2 MeV. In pure uranium metal, these fast neutrons are almost entirely captured non-fissionably by U-238 in 'resonance capture' energy bands, extinguishing the chain reaction before a second generation of fissions can occur.",
    priorArtLimitations: [
      "Homogeneous uranium mixtures suffered 100% resonance capture extinction",
      "Commercial graphite contained boron impurities that absorbed all thermal neutrons",
      "No controlled nuclear chain reaction had ever been demonstrated in human history",
    ],
    breakthroughInsight:
      "Fermi and Szilard realized that by geometrically separating the uranium into discrete lumps or rods distributed throughout a moderator medium of low atomic weight and negligible neutron absorption (high-purity graphite carbon), fast neutrons escape the uranium lump into the carbon matrix. Through ~114 elastic collisions with carbon atoms, the neutrons thermalize down to 0.025 eV before diffusing back into a neighboring uranium lump, bypassing U-238 resonance traps and preferentially triggering thermal fission in U-235.",
    patentWars: [
      {
        rivalName: "Manhattan Project / AEC Secrecy Order",
        rivalClaim:
          "United States Government classified atomic inventions under the 1946 Atomic Energy Act",
        conflictDetails:
          "Filed in December 1944 during the height of the Manhattan Project, the patent was classified as Top Secret. Fermi and Szilard assigned rights to the U.S. government for a nominal sum of $1.00.",
        resolution:
          "Declassified and issued publicly on May 17, 1955 under President Eisenhower's 'Atoms for Peace' initiative.",
        legalOutcome:
          "Became public prior art preventing private monopolization of basic nuclear fission physics.",
      },
    ],
    civilizationalImpact:
      "On December 2, 1942, CP-1 achieved criticality, proving that humanity could harness atomic energy and establishing the foundation for all modern nuclear power plants.",
    funFact:
      "Because the squash court at Stagg Field was unheated, Fermi and Szilard wore heavy winter overcoats and fedora hats during the criticality experiment, celebrating with a bottle of Chianti wine in paper cups.",
  },
  tags: ["energy", "nuclear", "physics", "electricity"],
  stats: {
    totalClaims: 37,
    independentClaims: 1,
    patentWarYears: "1944–1955 (Manhattan Project Secrecy Classification)",
    impactScore: 100,
  },
};
