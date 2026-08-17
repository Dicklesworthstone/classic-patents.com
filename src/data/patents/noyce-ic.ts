import type { Patent } from "@/types/patent";

export const noyceIcPatent: Patent = {
  id: "us-2981877-noyce-ic",
  patentNumber: "US 2,981,877",
  title: "Semiconductor Device-and-Lead Structure",
  shortTitle: "Noyce Monolithic Planar Integrated Circuit",
  subtitle:
    "Vapor-Deposited Aluminum Interconnects Over Thermally Grown Silicon Dioxide Passivation",
  inventors: ["Robert N. Noyce"],
  inventorLocation: "Los Altos, California",
  grantDate: "1961-04-25",
  filingDate: "1959-07-30",
  era: "Electronic Era (1920–1960)",
  category: "computing",
  categoryLabel: "Semiconductor Physics & Microelectronics",
  summary:
    "Noyce's 1959 Fairchild filing: print aluminum interconnects on top of thermally grown SiO₂ so they can cross p–n junctions on a single silicon die. Kilby had already shown that components could share a semiconductor body; this patent is how you wire them without gold flying leads.",
  heroQuote:
    "In the manufacture of semiconductor devices it is frequently desirable to provide a unitary body of semiconductor material within which are formed a plurality of individual circuit components...",
  originalPdfUrl: "/patents/pdfs/us-2981877-noyce-ic.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2981877A/en",
  usptoClassification: "H01L 27/06 (Monolithic integrated circuits)",
  originalText: `UNITED STATES PATENT OFFICE.
ROBERT N. NOYCE, OF LOS ALTOS, CALIFORNIA, ASSIGNOR TO FAIRCHILD SEMICONDUCTOR CORPORATION, OF MOUNTAIN VIEW, CALIFORNIA.

SEMICONDUCTOR DEVICE-AND-LEAD STRUCTURE.

Application July 30, 1959, Serial No. 830,507. Patent No. 2,981,877. Patented Apr. 25, 1961.

To all whom it may concern:
Be it known that I, ROBERT N. NOYCE, a citizen of the United States, residing at Los Altos, in the county of Santa Clara and State of California, have invented certain new and useful Improvements in Semiconductor Device-and-Lead Structure, of which the following is a specification.

In the manufacture of semiconductor devices it is frequently desirable to provide a unitary body of semiconductor material within which are formed a plurality of individual circuit components, such as transistors, diodes, and resistors, and to interconnect these components to form a complete functional electronic circuit.

Heretofore, the electrical interconnection of separate regions on the surface of a semiconductor crystal has required the attachment of individual metal flying wires (such as gold or aluminum wire leads) bonded by thermo-compression to microscopic contact areas on the crystal. This process is exceedingly delicate, difficult to automate, prone to mechanical failure, and imposes severe limits upon the complexity, density, and reliability of the resulting electronic circuit (the 'Tyranny of Numbers').

According to my invention, I provide an electrical lead structure which is an integral part of the semiconductor device itself and which adheres securely to the surface of the device without requiring delicate wire bonding.

In carrying out my invention, a monocrystalline semiconductor substrate (such as silicon) has formed therein a plurality of PN junctions creating individual transistors, diodes, and resistive regions.

A protective insulating layer of silicon dioxide (SiO2) is thermally grown or deposited over the entire planar surface of the silicon wafer.

Apertures or contact holes are etched through selected portions of the silicon dioxide layer by photo-lithographic techniques to expose the underlying active semiconductor regions (emitters, bases, collectors, etc.).

A layer of electrically conductive metal (such as aluminum) is then vacuum-deposited over the entire oxidized surface, adhering securely to the silicon dioxide insulating layer and making low-resistance ohmic contact with the exposed silicon through the etched apertures.

The metal layer is then selectively etched away by photo-engraving, leaving a predetermined pattern of thin flat metallic strips or leads adherent to the oxide surface, which interconnect the individual semiconductor components to form a complete, monolithic integrated circuit in a single physical unit.

Referring to the drawings:
Figure 1 is a top plan view of a unitary semiconductor device embodying my invention.
Figure 2 is a cross-sectional view taken along line 2-2 of Figure 1.
Figure 3 is a perspective cross-sectional view showing a transistor with vapor-deposited aluminum leads crossing over PN junction boundaries.
Figure 4 is a diagrammatic cross-section showing multiple diffused components and interconnecting metallization on a common silicon substrate.`,
  plainEnglishExplanation: {
    overview:
      "In 1958, computers were limited by the 'Tyranny of Numbers': circuits required millions of discrete transistors, diodes, and resistors hand-soldered together with tiny wires. If a single solder joint failed, the entire room-sized computer crashed. Jack Kilby at Texas Instruments created the first integrated circuit in 1958 by connecting components on a germanium bar with hand-glued gold flying wires. Robert Noyce at Fairchild Semiconductor made the definitive breakthrough that launched the computer age: he realized that by using the planar process with a glass insulating layer of silicon dioxide ($SiO_2$), aluminum wiring could be evaporated directly across the chip's surface, printing millions of transistors and their interconnections simultaneously in one solid crystal.",
    coreMechanism:
      "A single crystal silicon wafer undergoes thermal oxidation to form a tough, insulating layer of silicon dioxide glass ($SiO_2$). Photolithography etches microscopic contact holes through the glass into active p-n junctions below. Aluminum metal is vapor-deposited across the entire surface and etched into flat microscopic wires that travel over the glass insulator, directly connecting transistors without a single loose wire.",
    mechanicalBreakdown: [
      {
        title: "Thermally Grown Silicon Dioxide (SiO2) Passivation",
        summary:
          "A micro-thin layer of pure glass grown on the silicon surface by heating with oxygen.",
        technicalDetails:
          "Has high dielectric breakdown strength ($E_{bd} \\approx 10^7\\text{ V/cm}$), insulating aluminum wires from shorting against the underlying silicon p-n junctions.",
        archaicTerm: "Oxide coating adherent to the semiconductor surface",
        modernEquivalent: "Interlayer dielectric (ILD) / Thermal oxide passivation",
      },
      {
        title: "Vapor-Deposited Aluminum Metallization Leads",
        summary: "Thin flat aluminum stripes vacuum-evaporated over the oxide.",
        technicalDetails:
          "Forms low-resistance ohmic contacts ($R_c < 10^{-6}\\,\\Omega\\cdot\\text{cm}^2$) at exposed silicon contact windows while routing signals across the glass surface.",
        archaicTerm: "Conductor adhering to the oxide coating and extending over a junction",
        modernEquivalent: "Integrated circuit metallization interconnect layer",
      },
      {
        title: "Photolithographic Planar Etching",
        summary:
          "Using photoresist light masks and acid baths to define microscopic circuit geometries.",
        technicalDetails:
          "Enables batch-fabrication of thousands of identical microchips on a single silicon wafer simultaneously.",
        archaicTerm: "Photo-engraving and selective chemical etching",
        modernEquivalent: "Semiconductor photolithography & plasma etching",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Planar Solid-State Monolithic Integration",
        formula:
          "N_{components} \\propto e^{\\alpha t}, \\quad A_{die} = \\sum A_{transistors} + A_{interconnect}",
        explanation:
          "Noyce's planar metallization solved the interconnect bottleneck, enabling Moore's Law scaling from single transistors to billions of logic gates on a microchip.",
      },
      {
        principle: "Dielectric Isolation & Ohmic Contact Formation",
        formula:
          "J_{tunnel} = J_0 \\exp\\left(-\\frac{4\\pi \\sqrt{2m^* \\Phi_B}}{h} d\\right), \\quad C_{ox} = \\frac{\\varepsilon_{ox} A}{t_{ox}}",
        explanation:
          "Thermal SiO₂ provides near-infinite DC isolation resistance (>10¹⁴ Ω·cm) while permitting dense multi-layer metal interconnects.",
      },
    ],
    whyItMattersToday:
      "A modern SoC is still Noyce's stack: oxide on silicon, contact windows, metal that is allowed to run over junctions. Damascene copper and low-κ dielectrics changed the materials, not the topology. Intel, which Noyce co-founded in 1968, still ships that topology by the billion.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A semiconductor device comprising a body of semiconductor material having a surface, a PN junction extending to said surface, an insulating layer on said surface covering said junction, and an electrical conductor adhering to said insulating layer and extending over said junction, said conductor making electrical contact with said body through an aperture in said insulating layer, substantially as described.",
      plainEnglish:
        "The master patent claim of the microchip industry: an integrated circuit where a metal conductor adheres to an insulating layer and travels directly over a PN junction to connect semiconductor components.",
      keyInnovations: [
        "Vapor-deposited metal interconnects",
        "Insulating layer covering PN junctions",
        "Monolithic planar circuit integration",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 3",
      title: "Monolithic Planar Transistor & Metallization Lead",
      caption:
        "Cross-sectional perspective showing silicon substrate, diffused PN junctions, silicon dioxide insulating layer, and vapor-deposited aluminum lead crossing the junction.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "ni-1",
          figureRef: "Fig. 3",
          label: "A",
          element: "Silicon Monolithic Substrate",
          description: "Monocrystalline silicon wafer containing diffused p-n junctions.",
          x: 50,
          y: 75,
        },
        {
          id: "ni-2",
          figureRef: "Fig. 3",
          label: "B",
          element: "Silicon Dioxide (SiO2) Insulator",
          description:
            "Thermally grown glass layer preventing short circuits across junction edges.",
          x: 50,
          y: 50,
        },
        {
          id: "ni-3",
          figureRef: "Fig. 3",
          label: "C",
          element: "Vapor-Deposited Aluminum Lead",
          description:
            "Thin-film metal stripe adhering to oxide and making contact through etched windows.",
          x: 50,
          y: 25,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "By 1958 a large computer was a reliability problem disguised as an electronics problem. A design with 10⁵ transistors implied on the order of 3×10⁵ soldered joints. Each joint was a failure site. The 'tyranny of numbers' (Jack Morton at Bell Labs popularized the phrase) said you could not wire your way to a million devices.",
    priorArtLimitations: [
      "Kilby's 1958 TI germanium bar still used gold flying wires for some connections.",
      "Mesa transistors left junction edges exposed; contamination killed yield.",
      "Hybrid modules (Minuteman, IBM SMS) only hid the wiring, they did not remove it.",
      "Photolithography existed for transistors, not yet for chip-scale metal.",
    ],
    breakthroughInsight:
      "Jean Hoerni's planar process (Fairchild, 1959) left a sheet of SiO₂ over the wafer. Noyce's January 1959 note asked the obvious next question: evaporate aluminum on that glass, etch it into traces, and open windows only where you want contacts. The oxide is both passivation and the printed-circuit board.",
    patentWars: [
      {
        rivalName: "Jack Kilby and Texas Instruments",
        rivalClaim:
          "TI said Kilby's US 3,138,743 already covered a plurality of components in one semiconductor body. Fairchild said that claim did not teach planar surface metal running over oxide.",
        conflictDetails:
          "Interference and infringement dragged through the 1960s. In 1969 the Court of Customs and Patent Appeals credited Noyce with the planar interconnect. Kilby kept the body-of-semiconductor idea. Neither company could ship legally without the other.",
        resolution:
          "TI and Fairchild cross-licensed. The industry treated both men as inventors of the IC. Kilby received the 2000 Nobel Prize in Physics; Noyce had died in 1990 and the Nobel is not given posthumously.",
        legalOutcome:
          "Noyce: planar metal over oxide. Kilby: multiple devices in one body. The product on your board needs both.",
      },
    ],
    civilizationalImpact:
      "Fairchild's 1961 micrologic parts, then Intel (Noyce, Moore, Grove, 1968), made the planar IC a product line instead of a lab trick. Moore's 1965 density essay is a yield and interconnect essay; it assumes this patent's wiring method.",
    funFact:
      "Colleagues called Noyce the Mayor of Silicon Valley. The title stuck because he left Fairchild to start Intel and because he ran meetings without the East Coast suit hierarchy the Shockley refugees had walked out on in 1957.",
    aftermath:
      "US 2,981,877 issued 25 April 1961. Planar TTL and then MOS memories made the flying-lead IC a museum piece within a decade. Noyce spent the 1980s at SEMATECH arguing that the same interconnect physics now needed a national process consortium.",
    sideNotes: [
      "The 'traitorous eight' left Shockley Semiconductor in 1957 and founded Fairchild. Hoerni, Noyce, Moore, and Last were in that group. The planar IC is a Fairchild invention in the narrow sense and a Shockley-lab diaspora invention in the wide one.",
      "Early Fairchild metal was aluminum on SiO₂. Purple plague (Au–Al intermetallics) at the package bonds was a 1960s reliability crisis that this patent does not mention and that packaging groups spent a decade fixing.",
      "Gordon Moore's 1965 Electronics article counts components per dollar and per chip. The curve only exists if the wires are printed with the transistors.",
    ],
  },
};
