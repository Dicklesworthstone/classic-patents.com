import type { Patent } from "@/types/patent";

export const spencerMicrowavePatent: Patent = {
  id: "us-2495429-spencer-microwave",
  patentNumber: "US 2,495,429",
  title: "Method of Treating Foodstuffs",
  shortTitle: "Spencer Microwave Oven",
  subtitle: "High-Frequency Electromagnetic Cavity Magnetron Dielectric Cooking",
  inventors: ["Percy L. Spencer"],
  inventorLocation: "Newton, Massachusetts (Raytheon Manufacturing Company)",
  grantDate: "1950-01-24",
  filingDate: "1945-10-08",
  era: "Post-War Applied Physics (1945–1955)",
  category: "consumer",
  categoryLabel: "Consumer Physics & Cooking",
  summary:
    "The accidental breakthrough that revolutionized cooking. While testing a high-power radar cavity magnetron at Raytheon in 1945, self-taught engineer Percy Spencer noticed a peanut candy bar in his pocket had completely melted. He investigated by placing popcorn kernels (which violently popped) and an egg (which exploded in a colleague's face) near the waveguide. Spencer patented the method of heating foodstuffs inside a metallic resonant cavity using electromagnetic microwave radiation.",
  heroQuote:
    "This invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof by the use of electromagnetic energy...",
  originalPdfUrl: "/patents/pdfs/us-2495429-spencer-microwave.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2495429A/en",
  usptoClassification: "H05B 6/64 (Heating by microwaves; Cooking ovens)",
  originalText: `UNITED STATES PATENT OFFICE.
PERCY L. SPENCER, OF NEWTON, MASSACHUSETTS, ASSIGNOR TO RAYTHEON MANUFACTURING COMPANY.

METHOD OF TREATING FOODSTUFFS.

Patent No. 2,495,429. Patented Jan. 24, 1950.
Application October 8, 1945, Serial No. 620,919.

This invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof by the use of electromagnetic energy.

In the past, the cooking of food has been accomplished primarily by the application of heat to the exterior of the food, as by conduction, convection, or radiant heat. In such methods, the heat must penetrate from the surface of the food toward the interior by thermal conduction, which is a relatively slow process and often results in overcooking or burning the outer portions of the food before the interior is thoroughly cooked.

It is an object of the present invention to provide a method of cooking foodstuffs which is extremely rapid and which heats the food substantially uniformly throughout its volume by subjecting the food to high-frequency electromagnetic waves...`,
  plainEnglishExplanation: {
    overview:
      "For thousands of years, cooking relied on external surface heat (open fires, coal stoves, ovens, and frying pans) where heat slowly crept into food via thermal conduction ($q = -k \\nabla T$). Percy Spencer realized that radar microwaves penetrate directly into the interior of food and heat it volumetrically in seconds by vibrating water molecules.",
    coreMechanism:
      "A cavity magnetron generates high-frequency electromagnetic microwaves (around $2.45\\text{ GHz}$, wavelength $\\lambda \\approx 12.2\\text{ cm}$). When these waves pass into food, the oscillating electric field forces polar water molecules ($\text{H}_2\text{O}$ dipoles) to flip back and forth billions of times per second. This molecular friction converts electromagnetic energy directly into thermal heat throughout the entire volume of the food simultaneously, cooking food in a fraction of traditional baking time.",
    mechanicalBreakdown: [
      {
        title: "Cavity Magnetron RF Generator",
        summary: "A vacuum tube producing high-power continuous microwaves.",
        technicalDetails:
          "Electrons emitted by a central cathode are swept through resonant anode cavities by a static magnetic field, oscillating at gigahertz frequencies ($f = c/\\lambda$) to produce hundreds of watts of RF energy.",
        archaicTerm: "Magnetron oscillator supplying high-frequency electromagnetic energy",
        modernEquivalent: "2.45 GHz Cavity Magnetron",
      },
      {
        title: "Metallic Enclosed Resonant Cavity",
        summary: "A metal box reflecting microwaves and preventing radiation leakage.",
        technicalDetails:
          "The metallic walls act as a Faraday cage and RF standing-wave resonator, reflecting microwaves repeatedly through the food until absorbed by dielectric loss ($\\tan \\delta$).",
        archaicTerm: "Metallic enclosure confining the electromagnetic waves",
        modernEquivalent: "Microwave cooking cavity & Faraday shield",
      },
      {
        title: "Volumetric Dielectric Heating",
        summary:
          "Instantaneous heating throughout the mass rather than surface-only heat transfer.",
        technicalDetails:
          "Power absorbed per unit volume is $P = 2\\pi f \\varepsilon_0 \\varepsilon'' |E|^2$, directly converting the electric field $E$ into thermal energy within water-rich tissue.",
        archaicTerm: "Heating by high-frequency energy throughout the volume",
        modernEquivalent: "Dielectric dipole heating",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dielectric Dipole Heating",
        formula: "P_v = 2\\pi f \\cdot \\varepsilon_0 \\cdot \\varepsilon_r'' \\cdot |E|^2",
        explanation:
          "Polar water molecules continuously rotate to align with the oscillating alternating electric field, dissipating electromagnetic energy as molecular thermal agitation.",
      },
      {
        principle: "Microwave Skin Depth & Penetration",
        formula:
          "D_p = \\frac{\\lambda_0}{2\\pi \\sqrt{2\\varepsilon_r'}} \\left[ \\sqrt{1 + \\left(\\frac{\\varepsilon_r''}{\\varepsilon_r'}\\right)^2} - 1 \\right]^{-1/2}",
        explanation:
          "Microwaves at 2.45 GHz have a penetration depth of several centimeters in meat and vegetables, heating deep interior layers directly.",
      },
    ],
    whyItMattersToday:
      "Over 90% of all households in the developed world own a microwave oven. Spencer’s patent transitioned radar warfare technology into the most ubiquitous kitchen appliance in modern culinary history and established the basis for industrial microwave drying, polymer curing, and plasma processing.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of treating foodstuffs which comprises subjecting the foodstuff to electromagnetic energy of a wavelength of the order of centimeters for a period of time sufficient to cook the same.",
      plainEnglish:
        "Protects the method of cooking food by subjecting it to centimeter-wavelength electromagnetic microwave energy.",
      keyInnovations: [
        "Microwave cooking",
        "Centimeter-band RF energy",
        "Dielectric food preparation",
      ],
      legalSignificance:
        "The foundational patent for microwave cooking, establishing Raytheon’s early monopoly and the creation of the famous 'Radarange'.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Schematic Diagram of Microwave Cooking Enclosure",
      caption:
        "Drawing of the magnetron, waveguide conduit, and enclosed metallic cooking cavity with conveyor.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "sm-1",
          figureRef: "Fig. 1",
          label: "1",
          element: "Cavity Magnetron",
          description: "High-power radar vacuum tube generating gigahertz microwave radiation.",
          x: 25,
          y: 28,
        },
        {
          id: "sm-2",
          figureRef: "Fig. 1",
          label: "4",
          element: "Waveguide Horn",
          description:
            "Rectangular metal duct directing microwave energy into the cooking chamber.",
          x: 48,
          y: 35,
        },
        {
          id: "sm-3",
          figureRef: "Fig. 1",
          label: "6",
          element: "Metallic Cooking Cavity",
          description: "Reflective Faraday enclosure holding the foodstuff.",
          x: 68,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1945, Raytheon was producing thousands of magnetrons for Allied military radar. With WWII ending, Raytheon needed civilian industrial applications for its massive magnetron manufacturing capacity.",
    priorArtLimitations: [
      "Induction heating existed for smelting metals, but could not heat non-conductive dielectric organic foods.",
      "Infrared lamps heated only the extreme outer crust of food without penetrating interior tissue.",
    ],
    breakthroughInsight:
      "While testing a radar magnetron in Waltham, MA, Percy Spencer felt a strange sensation in his trousers pocket. He reached in and found that his Mr. Goodbar peanut candy bar had melted into warm liquid chocolate. Intrigued, he asked for a bag of unpopped popcorn kernels, held them near the microwave horn, and watched in amazement as fluffy popcorn exploded across the lab.",
    patentWars: [
      {
        rivalName: "Commercial Appliance Competitors (Amana, Litton, Tappan)",
        rivalClaim:
          "Competitors attempted to design different RF frequencies or cavity stirrer geometries to avoid Raytheon's patent.",
        conflictDetails:
          "Raytheon commercialized the 'Radarange' in 1947 (standing 6 feet tall and costing $5,000) and aggressively licensed its cavity magnetron patents.",
        resolution:
          "Raytheon acquired Amana Refrigeration in 1965 to produce the first compact 100-volt countertop domestic microwave oven, licensing Spencer’s patent across the industry.",
        legalOutcome:
          "Raytheon dominated early microwave oven manufacturing and earned millions in commercial royalties.",
      },
    ],
    civilizationalImpact:
      "Spencer's invention transformed global food preparation, convenience foods, frozen dinner distribution, and modern restaurant speed-cooking.",
    funFact:
      "Percy Spencer was an orphan who never finished grammar school and taught himself advanced trigonometry and calculus while working as a teenager in a spool mill! Raytheon awarded him a standard $2 token gratuity for assigning his billion-dollar patent to the company.",
  },
  tags: [
    "Consumer Tech",
    "Percy Spencer",
    "Microwave",
    "Raytheon",
    "Radar",
    "Food Science",
    "Physics",
  ],
  stats: {
    totalClaims: 7,
    independentClaims: 1,
    patentWarYears: "1945–1955",
    impactScore: 92,
  },
};
