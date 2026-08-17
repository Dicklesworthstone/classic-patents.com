import type { Patent } from "@/types/patent";

export const boyleSmithCcdPatent: Patent = {
  id: "us-3923554-boyle-smith-ccd",
  patentNumber: "US 3,923,554",
  title: "Three Phase Charge Coupled Device",
  shortTitle: "Boyle & Smith's Charge-Coupled Device (CCD Sensor)",
  subtitle:
    "The Solid-State Imaging Sensor that Eliminated Chemical Photographic Film and Enabled Digital Cameras",
  inventors: ["Willard S. Boyle", "George E. Smith"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1975-12-02",
  filingDate: "1974-06-28",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Digital Imaging & Optoelectronics",
  summary:
    "The Digital Eye of Humanity: Willard Boyle and George Smith's Charge-Coupled Device (CCD) at Bell Labs, which stores photo-generated charge packets in silicon potential wells and shifts them across the chip with three-phase clocking, replacing chemical photographic film with digital pixels.",
  heroQuote:
    "Be it known that we, Willard S. Boyle and George E. Smith, citizens of the United States and Canada, residing at Summit and Berkeley Heights, in the County of Union, State of New Jersey, have invented certain new and useful Improvements in Three Phase Charge Coupled Devices...",
  originalPdfUrl: "/patents/pdfs/us-3923554-boyle-smith-ccd.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3923554A/en",
  usptoClassification: "H01L 27/148 (Charge coupled device image sensors)",
  originalText: `UNITED STATES PATENT OFFICE.
WILLARD S. BOYLE AND GEORGE E. SMITH, RESIDING AT SUMMIT AND BERKELEY HEIGHTS, N.J., ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, MURRAY HILL, N.J.

THREE PHASE CHARGE COUPLED DEVICE.

Appl. No. 484,008. Filed June 28, 1974.
Patent No. 3,923,554. Patented Dec. 2, 1975.

To all whom it may concern:
Be it known that we, WILLARD S. BOYLE and GEORGE E. SMITH, citizens of the United States and Canada, residing at Summit and Berkeley Heights, in the County of Union, State of New Jersey, have invented certain new and useful Improvements in Three Phase Charge Coupled Devices, of which the following is a specification.

This invention relates to charge coupled devices (CCDs) and, more particularly, to arrangements for achieving efficient charge transfer in such devices using three-phase clocking.

Charge coupled devices typically comprise a semiconductor substrate covered with an insulating layer upon which an array of closely spaced field electrodes are formed. By applying appropriate potentials to these electrodes, potential energy wells are formed within the semiconductor beneath the electrodes. Packets of minority carriers representing information or image data can be stored in these wells and transferred from well to well along the semiconductor surface by sequentially manipulating the potentials applied to adjacent electrodes.

In accordance with our invention, an improved three-phase electrode structure is provided which provides unidirectional, highly efficient charge transfer with simplified fabrication requirements.`,
  plainEnglishExplanation: {
    overview:
      "For over a century, photography required messy chemical silver-halide film that could not be transmitted electronically or viewed immediately. Boyle and Smith conceived a solid-state electronic analog of photographic film: light hitting silicon creates tiny packets of electrical charge, which are trapped in microscopic potential 'buckets' and shifted across the surface of the chip like a bucket brigade to create digital images.",
    coreMechanism:
      "Photons generate electrons in silicon ($n_e = \\eta \\Phi$). These electrons collect in potential wells under MOS gate electrodes. Applying a 3-phase clock voltage sequence ($\\phi_1, \\phi_2, \\phi_3$) lowers potential under adjacent electrodes, shifting each pixel charge packet step-by-step to a floating diffusion amplifier node at the edge of the chip ($V_{out} = Q / C_{sense}$).",
    mechanicalBreakdown: [
      {
        title: "MOS Potential Well Storage Array",
        summary: "An array of metal-oxide-semiconductor electrodes over p-type silicon.",
        technicalDetails:
          "Positive gate voltages create surface depletion potential wells ($V_s \\propto V_G$) that collect and store photo-generated electrons with minimal dark-current leakage.",
        archaicTerm: "Depletion potential well array",
        modernEquivalent: "CCD pixel photo-gate array",
      },
      {
        title: "3-Phase Charge Transfer Shift Register",
        summary: "Overlapping gate electrodes clocked in 3-phase sequence.",
        technicalDetails:
          "Dynamically translates charge packets along silicon channels with Charge Transfer Efficiency exceeding 99.999% ($\\text{CTE} > 0.99999$).",
        archaicTerm: "Sequential multi-phase clocking",
        modernEquivalent: "Charge-transfer shift register",
      },
      {
        title: "Floating Diffusion Readout Node",
        summary: "On-chip diode and source follower converting charge to voltage.",
        technicalDetails:
          "Translates minute femtocoulomb charge packets into low-noise video signals ($S = Q / C$).",
        archaicTerm: "Output sensing diode",
        modernEquivalent: "Sense amplifier charge-to-voltage readout",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Internal Photoelectric Effect & Charge Integration",
        formula: "Q_{pixel} = q \\cdot \\eta_{QE} \\int_0^{T_{int}} I(x, y, t) \\, dt",
        explanation:
          "Incident photons generate electron-hole pairs in silicon, accumulating a linear charge packet proportional to light intensity and exposure time.",
      },
      {
        principle: "Charge Transfer Efficiency (CTE)",
        formula: "Q_{out} = Q_{in} \\cdot (\\text{CTE})^N, \\quad \\text{CTE} = 1 - \\epsilon",
        explanation:
          "Extremely high charge transfer efficiency preserves crisp image contrast after thousands of sequential transfers across the pixel array.",
      },
    ],
    whyItMattersToday:
      "The CCD sensor eliminated film, launched the digital photography and video revolution, made the Hubble Space Telescope possible, and paved the way for CMOS sensors in billions of smartphones today.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A charge coupled device comprising a semiconductor substrate, an insulating layer overlying a surface of said substrate, an array of closely spaced electrodes overlying said insulating layer and forming a plurality of three-electrode charge transfer stages, and means for applying three-phase clock voltages to said electrodes to cause sequential transfer of charge packets through said substrate.",
      plainEnglish:
        "The master claim covering a 3-phase charge coupled device with a semiconductor substrate, dielectric layer, electrode array, and 3-phase clocking means to transfer charge packets across the chip.",
      keyInnovations: [
        "Charge packet bucket-brigade transfer",
        "3-phase overlapping gate clocking",
        "Monolithic solid-state digital imaging sensor",
      ],
      legalSignificance:
        "Foundational patent that founded digital photography and earned Boyle and Smith the 2009 Nobel Prize in Physics.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Cross Section of 3-Phase CCD Showing Potential Wells",
      caption:
        "Cross-sectional blueprint showing silicon substrate, oxide dielectric layer, and 3-phase gate electrodes shifting charge packets.",
      svgType: "noyce-ic",
      callouts: [
        {
          id: "ccd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Gate Electrodes",
          description: "Overlapping poly-silicon 3-phase clock electrodes.",
          x: 50,
          y: 30,
        },
        {
          id: "ccd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Charge Packets",
          description: "Electrons trapped in surface depletion potential wells.",
          x: 50,
          y: 65,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "Photography required chemical silver-halide films with slow chemical darkroom processing, while vacuum television camera tubes (Vidicons) were bulky, fragile, and prone to image burning and distortion.",
    priorArtLimitations: [
      "Chemical silver-halide film emulsions.",
      "Vidicon and plumbicon vacuum camera pickup tubes.",
      "Early photodiode arrays requiring amplifiers at every single pixel.",
    ],
    breakthroughInsight:
      "Boyle and Smith realized that photo-generated electrical charges could be stored in surface potential wells in silicon and moved along the surface like a bucket brigade by clocking electrode voltages.",
    patentWars: [
      {
        rivalName: "Texas Instruments & Fairchild Camera",
        rivalClaim:
          "Fairchild and TI developed competing frame-transfer and interline CCD architectures.",
        conflictDetails:
          "Bell Labs defended Boyle and Smith's foundational priority for the charge-coupled transfer mechanism.",
        resolution:
          "Boyle and Smith were recognized as the primary inventors and awarded the 2009 Nobel Prize in Physics.",
        legalOutcome:
          "CCDs became the universal standard for digital astronomical imaging, camcorders, and digital cameras.",
      },
    ],
    civilizationalImpact:
      "Democratized visual documentation, enabled digital cameras, medical endoscopes, space telescopes, and modern camera phones.",
    funFact:
      "Boyle and Smith sketched the entire CCD concept on a chalkboard at Bell Labs during a single brainstorming session lasting just one hour on October 17, 1969.",
  },
  tags: ["CCD", "Digital Photography", "Nobel Prize", "Bell Labs", "Semiconductors", "Hubble"],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1974–2009",
    impactScore: 99,
  },
};
