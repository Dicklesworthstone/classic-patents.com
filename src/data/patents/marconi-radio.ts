import type { Patent } from "@/types/patent";

export const marconiRadioPatent: Patent = {
  id: "us-586193-marconi-radio",
  patentNumber: "US 586,193",
  title: "Transmitting Electrical Impulses and Signals, and Apparatus Therefor",
  shortTitle: "Marconi Wireless Radio Telegraphy",
  subtitle: "Tuned Spark-Gap Radio Frequency Transmission & Earth-Grounded Antennas",
  inventors: ["Guglielmo Marconi"],
  inventorLocation: "London, England (transferred from Bologna, Italy)",
  grantDate: "1897-07-13",
  filingDate: "1896-12-07",
  era: "Wireless Telecommunications (1890-1910)",
  category: "telecom",
  categoryLabel: "Wireless & Radio",
  summary:
    "Guglielmo Marconi's seminal patent for wireless electromagnetic telegraphy. By combining an elevated vertical monopole antenna, earth ground, and a sensitive nickel-silver coherer detector, Marconi transmitted telegraph signals through free space across miles without intervening wires.",
  heroQuote:
    "I have discovered that when an electrical spark discharge is produced between conductors connected to an elevated capacity and to earth, electromagnetic waves are propagated through the ether to immense distances.",
  originalPdfUrl: "/patents/pdfs/us-586193-marconi-radio.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US586193A/en",
  usptoClassification: "H04B 1/02; H04L 27/00",
  originalText: `TO ALL WHOM IT MAY CONCERN:
Be it known that I, GUGLIELMO MARCONI, a subject of the King of Italy, residing at London, England, have invented certain new and useful Improvements in Transmitting Electrical Impulses and Signals, and in Apparatus therefor, of which the following is a specification.

According to this invention signals are transmitted through the air, earth, or water by means of oscillations of high frequency produced by spark-discharges. The transmitter consists of an induction-coil having its secondary terminals connected to spark-gap balls, one of which is connected to an elevated conductor or aerial wire and the other to earth. When the primary circuit is interrupted by a Morse key, high-tension oscillatory discharges occur across the spark-gap, causing electromagnetic waves of high frequency to radiate from the aerial wire.

At the receiving station an elevated conductor and earth connection are connected to a sensitive tube containing metallic filings, termed a 'coherer.' Under the influence of the received high-frequency oscillations, the resistance of the coherer drops from thousands of ohms to a few hundred ohms, completing a local battery circuit which actuates a telegraphic relay and Morse inker. A mechanical tapper automatically decoheres the filings after each signal pulse.`,
  plainEnglishExplanation: {
    overview:
      "Marconi transformed Heinrich Hertz's laboratory demonstration of electromagnetic radiation into a practical, long-distance communication system. His crucial engineering breakthroughs were connecting one side of the spark gap to an elevated vertical antenna wire and the other side directly to an earth ground, multiplying the transmission range from a few meters to hundreds of miles.",
    coreMechanism:
      "A high-voltage induction coil charges an elevated antenna wire relative to earth ground. When the spark gap breaks down, the stored electrostatic charge discharges in a burst of damped high-frequency oscillatory current (radio frequency), radiating transverse electromagnetic waves through the atmosphere.",
    mechanicalBreakdown: [
      {
        title: "Elevated Monopole Aerial & Ground Plane",
        summary:
          "Converting a dipole into a quarter-wave vertical monopole over an infinite conductive earth ground plane.",
        technicalDetails:
          "Hertz's original spark dipoles had tiny radiation resistance and radiated in all directions with rapid attenuation. Marconi grounded one terminal to the conductive earth and elevated the other high into the air, creating an asymmetrical vertical dipole whose range scaled with the square of antenna height (Marconi's Law: D ∝ H²).",
        archaicTerm: "Elevated capacity wire and earth plate",
        modernEquivalent: "Quarter-wave vertical monopole antenna with ground reflection",
      },
      {
        title: "The Nickel-Silver Vacuum Coherer Detector",
        summary:
          "A microscopic metallic switch that triggers upon absorbing radio-frequency energy.",
        technicalDetails:
          "An evacuated glass tube containing 95% nickel and 5% silver filings between silver plugs. In its resting state, the oxide film on the powder particles creates a high resistance (100,000+ Ω). When an incoming RF wave induces even microvolts across the plugs, microscopic electrical micro-welds form between particles, dropping resistance to <500 Ω and closing a local DC relay circuit.",
        archaicTerm: "Sensitive tube containing metallic powder",
        modernEquivalent: "RF semiconductor diode / envelope detector",
      },
      {
        title: "The Automatic Electromagnetic Decoherer (Tapper)",
        summary: "A mechanical bell-clapper that resets the detector after each Morse dot or dash.",
        technicalDetails:
          "Once the coherer conducts, it remains conductive even after the RF wave ends. An electromagnet in series with the Morse relay taps the glass tube with a tiny hammer, shaking the filings loose and restoring high electrical resistance within milliseconds to receive the next incoming dot.",
        archaicTerm: "Trembler or automatic tapper",
        modernEquivalent: "Detector quench circuit / reset pulse generator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Maxwell-Hertz Electromagnetic Radiation",
        formula: "c = 1 / √(μ₀ ε₀) ≈ 3 × 10⁸ m/s",
        explanation:
          "Accelerating electrical charges in the spark gap produce coupled oscillating electric (E) and magnetic (B) fields that detach from the wire and propagate through free space at the speed of light.",
      },
      {
        principle: "Marconi Antenna Range Law",
        formula: "Range D ∝ H² (or D = k · H · √P)",
        explanation:
          "The effective radiated power and ground-wave propagation distance of a vertical monopole increases with the height H of the aerial wire above the conductive earth.",
      },
    ],
    whyItMattersToday:
      "Marconi's elevated antenna and grounded transmitter established the architecture for all wireless telecommunication: broadcast radio, television, cellular towers, Wi-Fi, satellite uplinks, and deep space exploration.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The combination, in an apparatus for transmitting electrical impulses, of an induction-coil, a spark-gap connected to the secondary winding, an elevated conductor connected to one side of said gap, and an earth connection to the other side of said gap, substantially as described.",
      plainEnglish:
        "The master combination of a high-voltage spark induction coil with an elevated aerial antenna on one terminal and an earth ground connection on the other, creating a high-power wireless RF wave transmitter.",
      keyInnovations: [
        "Elevated antenna wire",
        "Earth ground connection",
        "Spark-gap RF oscillator",
      ],
      legalSignificance:
        "The foundational claim that established Marconi's global patent monopoly over early maritime wireless telegraphy and coast station communications.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a receiver for electrical oscillations, the combination of an imperfect electrical contact device connected to an elevated conductor and to earth, a local battery circuit controlled by said contact device, and an automatic tapper to decohere said contact device after each impulse.",
      plainEnglish:
        "A radio receiver combining an elevated aerial and ground with a metallic filings coherer, a local battery relay for recording Morse code, and an automatic mechanical hammer to reset the filings between Morse pulses.",
      keyInnovations: [
        "Metallic coherer tube",
        "Local battery relay",
        "Automatic mechanical decoherer",
      ],
      legalSignificance:
        "Enabled automated printing of telegraph messages on paper tape from radio waves across miles of ocean.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Complete Spark-Gap Wireless Transmitter and Aerial Monopole",
      caption:
        "Showing induction coil, Morse operating key, spark discharge spheres, elevated wire, and earth ground plate.",
      svgType: "spencer-microwave",
      callouts: [
        {
          id: "aerial",
          figureRef: "Fig. 1",
          label: "Elevated Aerial Wire",
          element: "A",
          description:
            "High vertical wire suspended from mast to radiate high-frequency electromagnetic waves.",
          x: 25,
          y: 20,
        },
        {
          id: "spark-gap",
          figureRef: "Fig. 1",
          label: "Spark Discharge Spheres",
          element: "d",
          description:
            "Brass spark gap terminals where dielectric breakdown produces damped radio frequency oscillations.",
          x: 50,
          y: 45,
        },
        {
          id: "earth-plate",
          figureRef: "Fig. 1",
          label: "Earth Ground Plate",
          element: "E",
          description:
            "Buried metal plate establishing electrical contact with the conductive earth ground.",
          x: 25,
          y: 80,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Prior to 1896, telegraphy and telephony required expensive physical copper cables strung on poles or laid under the sea. Ships at sea were completely isolated from communication once beyond line of sight from land.",
    priorArtLimitations: [
      "Heinrich Hertz's lab spark gap only transmitted across a single room (10–20 meters).",
      "Oliver Lodge's coherer lacked automatic decoherence and grounded antennas, failing at practical distances.",
      "Scientific consensus believed electromagnetic waves could not travel beyond the geometric horizon due to the curvature of the Earth.",
    ],
    breakthroughInsight:
      "Marconi discovered that grounding one side of the spark gap to the earth and raising the other side on a tall mast altered the wave impedance, creating ground-wave propagation that traveled beyond the horizon and across vast oceans.",
    patentWars: [
      {
        rivalName: "Nikola Tesla & Oliver Lodge",
        rivalClaim:
          "Tesla claimed earlier invention of tuned 4-circuit RF wireless transmission (US 645,576), while Oliver Lodge patented syntonic resonance (US 609,154).",
        conflictDetails:
          "A 40-year epic legal battle between the Marconi Wireless Telegraph Company and the Tesla/Lodge estates over tuned RF syntony.",
        resolution:
          "In 1943, the US Supreme Court (Marconi Wireless Tel. Co. v. United States, 320 U.S. 1) invalidated key Marconi tuning claims, recognizing Tesla's fundamental priority in multi-circuit tuned radio.",
        legalOutcome:
          "Reaffirmed the importance of precise circuit tuning while cementing Marconi's commercial legacy.",
      },
    ],
    civilizationalImpact:
      "Marconi's wireless system saved hundreds of lives during the sinking of the RMS Republic (1909) and the Titanic (1912). It launched the global electronics, broadcasting, telecommunications, and defense radar industries.",
    funFact:
      "When the Italian Ministry of Posts and Telegraphs initially rejected Marconi's invention as useless, his mother (an Irish Jameson whiskey heiress) took him to London, where the British Post Office immediately backed his demonstrations across the Salisbury Plain.",
  },
  tags: ["Radio", "Wireless", "Electromagnetism", "Telecommunications", "Antennas", "Marconi"],
  stats: {
    totalClaims: 16,
    independentClaims: 4,
    patentWarYears: "1897–1943 (46 Years)",
    impactScore: 99,
  },
};
