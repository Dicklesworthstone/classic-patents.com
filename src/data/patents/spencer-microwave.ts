import type { Patent } from "@/types/patent";

export const spencerMicrowavePatent: Patent = {
  id: "us-2495429-spencer-microwave",
  patentNumber: "US 2,495,429",
  title: "Method of Treating Foodstuffs",
  shortTitle: "Spencer Microwave Oven & Dielectric RF Heating",
  subtitle: "High-Power Cavity Magnetron and Ten-Centimeter Microwave Food Processing",
  inventors: ["Percy L. Spencer"],
  inventorLocation: "Newton, Massachusetts",
  grantDate: "1950-01-24",
  filingDate: "1945-10-08",
  era: "Electronic Era (1920–1960)",
  category: "materials",
  categoryLabel: "Microwave Engineering & Thermodynamics",
  summary:
    "Spencer's 1945 Raytheon filing treats food by directing roughly ten-centimeter microwave energy from magnetrons through a common wave guide, including a conveyor-fed arrangement. The later Radarange made this process familiar in kitchens.",
  heroQuote:
    "My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.",
  originalPdfUrl: "/patents/pdfs/us-2495429-spencer-microwave.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US2495429A/en",
  usptoClassification: "H05B 6/64 (Dielectric heating / Microwave ovens)",
  originalText: `UNITED STATES PATENT OFFICE

METHOD OF TREATING FOODSTUFFS

Percy L. Spencer, West Newton, Mass., assignor to Raytheon Manufacturing Company, Newton, Mass., a corporation of Delaware

Application October 8, 1945, Serial No. 620,919

My present invention relates to the treatment of foodstuffs, and more particularly to the cooking thereof through the use of electromagnetic energy.

Such energy has been used before for this purpose, but the frequencies employed have been relatively low, for example, not over 50 megacycles. I have found that at frequencies of this order of magnitude, the energy necessarily expended in order to generate sufficient heat to satisfactorily cook the foodstuff is much too high to permit the practical use of the process.`,
  originalTextAsset: {
    url: "/patents/transcripts/us-2495429-spencer-microwave.txt",
    pageCount: 3,
  },
  plainEnglishExplanation: {
    overview:
      "Spencer's claimed process is not yet a countertop oven. It is an industrial microwave treatment line: two magnetrons feed a common hollow wave guide, which concentrates the field near food moving on a conveyor. The technical insight is that a microwave wavelength comparable to a food's dimensions can heat it much more efficiently than the low-frequency electromagnetic methods Spencer contrasts with it.",
    coreMechanism:
      "Two cavity magnetrons alternate in push-pull operation and feed a common hollow wave guide. The patent repeatedly specifies a wavelength of about ten centimetres or less ($f \\approx c/\\lambda$, so roughly 3 GHz at 10 cm), then controls cooking time by holding food in or moving it through the concentrated field. Modern domestic ovens commonly use 2.45 GHz, a later practical standard rather than a number written into this patent's claims.",
    mechanicalBreakdown: [
      {
        title: "Resonant Cavity Magnetron Oscillator",
        summary: "A vacuum tube with cylindrical resonant cavities cut into a copper anode block.",
        technicalDetails:
          "Crossed electric ($E$) and magnetic ($B$) fields guide thermionically emitted electrons through the magnetron's resonant cavities, exciting microwave oscillations. The patent uses two such devices in push-pull operation and calls their output hyper-frequency energy.",
        archaicTerm: "Magnetron oscillator tube",
        modernEquivalent: "Microwave cavity magnetron",
      },
      {
        title: "Common Hollow Wave Guide",
        summary: "The shared hollow guide carries both magnetrons' energy to the treatment region.",
        technicalDetails:
          "Spencer's drawing identifies a common hollow wave guide fed from the two magnetrons by coaxial transmission lines. The specification deliberately claims the method of concentrating and guiding the field rather than a particular domestic-oven cavity geometry.",
        archaicTerm: "Hollow rectangular waveguide",
        modernEquivalent: "Microwave waveguide launcher",
      },
      {
        title: "Transversely Moving Conveyor",
        summary:
          "A conveyor carries food through the region exposed to the guided microwave energy.",
        technicalDetails:
          "Claims 2 and 5 define cooking by conveying food through the treatment region at a rate chosen for the required exposure interval. Claims 3 and 6 likewise protect moving the food relative to the established electromagnetic field.",
        archaicTerm: "Transversely-moving conveyor system",
        modernEquivalent: "Continuous microwave processing line",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Dielectric Loss & Molecular Dipole Rotation",
        formula:
          "P_v = 2 \\pi f \\cdot \\varepsilon_0 \\varepsilon'' \\cdot |\\vec{E}|^2, \\quad \\varepsilon'' = (\\varepsilon_s - \\varepsilon_\\infty) \\frac{\\omega \\tau}{1 + (\\omega \\tau)^2}",
        explanation:
          "The volumetric heating power P_v is proportional to frequency f, dielectric loss factor ε'', and the square of electric field strength E.",
      },
      {
        principle: "Microwave Penetration Depth in Foodstuffs",
        formula:
          "f = \\frac{c}{\\lambda}; \\quad \\lambda \\approx 10\\text{ cm} \\implies f \\approx 3\\text{ GHz}",
        explanation:
          "The specification's key scale argument is explicit: when wavelength is comparable to a food's average dimension, heating becomes intense while the energy requirement falls. Penetration and absorbed power still depend on the food's dielectric properties and geometry.",
      },
    ],
    whyItMattersToday:
      "The countertop oven is the obvious heir. Industrial drying and some medical hyperthermia use the same ISM band. Wi-Fi lives next door at 2.4 GHz and still loses to leftover chili.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "The broad process claim: generate microwave energy, direct it into a defined zone, and leave food there until it reaches the desired doneness.",
      keyInnovations: [
        "Microwave-region electromagnetic energy",
        "Guided, concentrated treatment zone",
        "Cooking to a specified degree",
      ],
    },
    {
      number: 2,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
      plainEnglish:
        "Adds a moving conveyor: cook by controlling how long food travels through the microwave field.",
      keyInnovations: ["Conveyor-fed microwave processing", "Residence-time control"],
    },
    {
      number: 3,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wavelength falling in the microwave region of the electromagnetic spectrum; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
      plainEnglish:
        "Covers relative motion between food and the field, a way to avoid heating one fixed spot continuously.",
      keyInnovations: ["Relative motion during exposure", "Field-uniformity process control"],
    },
    {
      number: 4,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said wave energy within a restricted region of space and exposing the foodstuff to be treated to the energy so generated for a period of time sufficient to cook the same to a predetermined degree.",
      plainEnglish: "The narrower version fixes the microwave wavelength at about ten centimetres.",
      keyInnovations: [
        "Approximately ten-centimetre microwaves",
        "Wavelength matched to food dimensions",
      ],
    },
    {
      number: 5,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space; and conveying the foodstuff to be treated through said region of space at such a rate of speed as to expose the same to said energy for an interval of time sufficient to cook the same to a predetermined degree.",
      plainEnglish: "Combines the ten-centimetre wavelength with controlled conveyor speed.",
      keyInnovations: ["Ten-centimetre process window", "Conveyor-speed control"],
    },
    {
      number: 6,
      isIndependent: true,
      originalText:
        "In the method of treating foodstuffs, those steps which include: generating electromagnetic wave energy of a wave length of substantially ten centimeters; concentrating and guiding said energy within a restricted region of space to establish an electromagnetic field therein; exposing the foodstuff to be treated to said field for a period of time sufficient to cook the same to a predetermined degree; and moving said foodstuff relative to said field while said foodstuff is so exposed.",
      plainEnglish:
        "Combines the ten-centimetre field with movement of the food through or within that field.",
      keyInnovations: [
        "Moving product through a microwave field",
        "Ten-centimetre wavelength variant",
      ],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Spencer Dual-Magnetron Food-Treatment System",
      caption:
        "The sole patent drawing: two push-pull magnetrons, their transformer supply and coaxial lines, a common hollow wave guide, and food moving on a conveyor at the guide outlet.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "sm-1",
          figureRef: "Fig. 1",
          label: "10, 11",
          element: "Push-Pull Magnetron Oscillators",
          description:
            "The paired magnetron electron-discharge devices alternately feed hyper-frequency energy to the common guide.",
          x: 25,
          y: 40,
        },
        {
          id: "sm-2",
          figureRef: "Fig. 1",
          label: "23",
          element: "Common Hollow Wave Guide",
          description:
            "Concentrates and guides energy from both magnetrons to the food-treatment region.",
          x: 45,
          y: 30,
        },
        {
          id: "sm-3",
          figureRef: "Fig. 1",
          label: "28",
          element: "Transversely-Moving Conveyor",
          description:
            "Carries food through the exposed region at a speed set by the desired cooking time.",
          x: 75,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "A 1940s oven cooked by heating air, then waiting for conduction ($k_{food} \\approx 0.5\\text{ W/m·K}$) to reach the center. Potatoes took the better part of an hour. Raytheon, flush with wartime magnetron contracts, needed a peacetime load for the same tube.",
    priorArtLimitations: [
      "Surface heat arrives first; the middle is still cold when the crust burns.",
      "Gas and electric ovens spend most of their energy on iron and air.",
      "No one had packaged a 2.45 GHz cavity as a kitchen appliance.",
    ],
    breakthroughInsight:
      "Spencer noticed a chocolate bar in his pocket soften near a live radar set (1945, the popcorn-and-egg demos followed). Water is a dipole. A magnetron's non-ionizing field couples to that dipole through the volume, not through the crust.",
    patentWars: [
      {
        rivalName: "Nobody serious; the fight was productization",
        rivalClaim:
          "Raytheon owned the magnetron line and Spencer's heating claims. Competitors waited for the patents and for a box that fit on a counter.",
        conflictDetails:
          "The 1947 Radarange was about six feet tall, 750 lb, and $5,000, a restaurant machine. Amana, a Raytheon subsidiary, put a 115 V countertop Radarange on sale in 1967 for $495.",
        resolution:
          "Raytheon's employee-invention gratuity was $2. Spencer became a senior vice president. The Hall of Fame plaque came later.",
        legalOutcome:
          "US 2,495,429 held. The consumer market opened when the power supply shrank, not when the claim chart changed.",
      },
    ],
    civilizationalImpact:
      "Frozen dinners, office leftovers, and a restaurant pass that can reheat without a salamander. Microwave ovens also quietly trained a generation that 2.45 GHz leaks are a door-seal problem, not a death ray.",
    funFact:
      "The third demo after candy and popcorn was an egg. It exploded in a colleague's face. Spencer kept going.",
    aftermath:
      "ISM-band 2.45 GHz exists in part because magnetron cooking needed a free slice of spectrum. Wi-Fi later moved in next door and has been arguing with popcorn ever since.",
    sideNotes: [
      "Percy Spencer had a fifth-grade formal education and more than 100 patents. Raytheon hired him as a plant expert, not as a university hire.",
      "The cavity magnetron itself is Randall and Boot (Birmingham, 1940), brought to the US by the Tizard Mission. Spencer's patent is the kitchen use, not the tube.",
    ],
  },
};
