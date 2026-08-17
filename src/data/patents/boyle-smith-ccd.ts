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
      svgType: "boyle-smith-ccd",
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
      "A 1969 camera was either silver halide (hours in a darkroom) or a vidicon (a hot glass bottle that burned in highlights). Photodiode arrays needed an amplifier per pixel, which did not scale.",
    priorArtLimitations: [
      "Film: beautiful, slow, wet.",
      "Vidicons and plumbicons: bulky, laggy, burn-in.",
      "XY-addressed photodiodes: a transistor budget that exploded with resolution.",
    ],
    breakthroughInsight:
      "17 October 1969, one hour at a Bell Labs blackboard: store photocharge in MOS potential wells and march it to a single output amplifier by clocking the gates, a bucket brigade. No per-pixel amp.",
    patentWars: [
      {
        rivalName: "Fairchild, TI, and the later CMOS crowd",
        rivalClaim:
          "Fairchild and TI shipped frame-transfer and interline CCDs and argued architecture, not the transfer idea.",
        conflictDetails:
          "Bell kept the charge-coupling claim. The commercial cameras came from Japan and from Fairchild's space line. CMOS active-pixel sensors (Fossum and others, 1990s) later took the phone market by putting the amplifier back at the pixel, cheaply.",
        resolution:
          "Boyle and Smith received the 2009 Nobel Prize in Physics. Hubble's WFPC and a generation of camcorders were CCD.",
        legalOutcome:
          "The 1974 Boyle–Smith patent is the transfer device. CMOS did not invalidate it; it out-economized it in consumer volumes.",
      },
    ],
    civilizationalImpact:
      "Astronomy went digital first (you cannot develop a plate on Mauna Kea as fast as you can read a chip). Then camcorders, then, after CMOS, everyone's pocket.",
    funFact:
      "The chalkboard session is well attested. They were supposed to be thinking about magnetic bubble memory. They walked out with an imager.",
    aftermath:
      "Bell Labs did not become a camera company. Kodak, Sony, and later every phone vendor did. Boyle retired to Nova Scotia; Smith stayed in device physics.",
    sideNotes: [
      "A CCD is a shift register that happens to be light-sensitive. That is why early video cameras had 'smear': the charge had to walk through other pixels.",
      "Hubble's original WFPC used Texas Instruments CCDs. The 1993 repair mission swapped in WFPC2, still CCD.",
    ],
  },
  tags: ["CCD", "Digital Photography", "Nobel Prize", "Bell Labs", "Semiconductors", "Hubble"],
  stats: {
    totalClaims: 1,
    independentClaims: 1,
    patentWarYears: "1974–2009",
    impactScore: 99,
  },
};
