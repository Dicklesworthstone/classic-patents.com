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
    "The Digital Eye of Humanity: Willard Boyle and George Smith's Charge-Coupled Device (CCD) at Bell Labs stores photo-generated charge packets in silicon MOS potential wells and shifts them across the chip with three-phase clocking, replacing chemical photographic film with digital pixels and earning the 2009 Nobel Prize in Physics.",
  heroQuote:
    "Charge coupled devices typically comprise a semiconductor substrate covered with an insulating layer upon which an array of closely spaced field electrodes are formed... Packets of minority carriers representing information or image data can be stored in these wells and transferred from well to well along the semiconductor surface by sequentially manipulating the potentials applied to adjacent electrodes.",
  originalPdfUrl: "/patents/pdfs/us-3923554-boyle-smith-ccd.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3923554A/en",
  usptoClassification: "H01L 27/148 (Charge coupled device image sensors)",
  originalText: `UNITED STATES PATENT OFFICE.
WILLARD S. BOYLE AND GEORGE E. SMITH, RESIDING AT SUMMIT AND BERKELEY HEIGHTS, N.J., ASSIGNORS TO BELL TELEPHONE LABORATORIES, INCORPORATED, MURRAY HILL, N.J.

THREE PHASE CHARGE COUPLED DEVICE.

Appl. No. 484,008. Filed June 28, 1974.
Patent No. 3,923,554. Patented Dec. 2, 1975.

To all whom it may concern:
Be it known that we, WILLARD S. BOYLE and GEORGE E. SMITH, citizens of the United States and Canada, residing at Summit and Berkeley Heights, in the County of Union, State of New Jersey, have invented certain new and useful Improvements in Three Phase Charge Coupled Devices, of which the following is a specification, reference being had to the accompanying drawings.

This invention relates to charge coupled devices (CCDs) and, more particularly, to arrangements for achieving highly efficient, unidirectional charge transfer in such devices using three-phase clocking.

Charge coupled devices typically comprise a semiconductor substrate of one conductivity type, such as p-type silicon, covered with an insulating layer of silicon dioxide upon which an array of closely spaced field electrodes are formed. By applying appropriate potentials to these electrodes, localized surface depletion regions or potential energy wells are formed within the semiconductor beneath the electrodes. Packets of minority carrier electrons, generated either photoelectrically by incident illumination or injected electrically, can be stored in these wells without lateral dispersion.

Transfer of the stored charge packets along the semiconductor surface is achieved by sequentially manipulating the potentials applied to adjacent electrodes. In a three-phase system, every third electrode is interconnected to one of three clock voltage lines ($\\phi_1, \\phi_2, \\phi_3$). By lowering the potential barrier under the forward adjacent electrode while simultaneously raising the potential under the storage electrode, the charge packet is transferred forward by self-induced electric fields, thermal diffusion, and fringing fields with extremely high transfer efficiency.

We claim as our invention:

1. A charge coupled device comprising a semiconductor substrate, an insulating layer overlying a surface of said substrate, an array of closely spaced electrodes overlying said insulating layer and forming a plurality of three-electrode charge transfer stages, and means for applying three-phase clock voltages to said electrodes to cause sequential transfer of charge packets through said substrate.

2. A charge coupled device in accordance with claim 1 wherein said electrodes of each transfer stage are arranged in overlapping relationship to eliminate potential barriers between adjacent electrodes during charge transfer.

3. A charge coupled device in accordance with claim 1 further comprising channel stop diffusion regions of higher conductivity than said substrate disposed laterally adjacent said transfer stages to confine charge packets within defined channels.`,
  plainEnglishExplanation: {
    overview:
      "For over a century, photography required chemical silver-halide film that was slow, messy, and impossible to transmit electronically. In October 1969 at Bell Labs, Willard Boyle and George Smith invented the electronic equivalent of film: the Charge-Coupled Device (CCD). Light striking silicon knocks electrons free via the photoelectric effect, collecting in microscopic electrostatic potential 'buckets' beneath metal-oxide-semiconductor (MOS) gates. By sequencing voltages across three phases of gate electrodes, the charge packets are walked smoothly across the chip like a fire-brigade bucket line into a single high-gain readout amplifier, transforming photons into digital images.",
    coreMechanism:
      "Incident photons create electron-hole pairs in p-type silicon ($n_e = \\eta_{QE} \\Phi$). Applying a positive gate voltage ($V_G > V_{th}$) creates an electrostatic potential well ($\\psi_s$) in the silicon that traps the electrons. A 3-phase clock cycle ($\\phi_1, \\phi_2, \\phi_3$) lowers the potential of the adjacent electrode, causing the electron packet to spill forward into the neighboring well. At the end of each shift register line, a floating diffusion sense node converts the charge packet into a proportional voltage signal ($V_{out} = Q / C_{sense}$) for digitization.",
    mechanicalBreakdown: [
      {
        title: "MOS Depletion Potential Well Matrix",
        summary: "An array of metal-oxide-semiconductor gate electrodes overlying p-type silicon.",
        technicalDetails:
          "Positive bias creates surface depletion regions with deep potential wells ($\\psi_s \\approx V_G - V_0 + \\sqrt{2 V_G V_0}$), confining up to $10^5$ photoelectrons per pixel with negligible spatial crosstalk.",
        archaicTerm: "Depletion potential well array",
        modernEquivalent: "CCD pixel photo-gate and pinned photodiode",
      },
      {
        title: "3-Phase Polysilicon Shift Register",
        summary: "Tri-level overlapping gate electrodes sequenced by three-phase clock pulses.",
        technicalDetails:
          "Overlapping gate geometry eliminates potential pockets and achieves a Charge Transfer Efficiency exceeding 99.999% ($\\text{CTE} > 0.99999$), preventing trailing charge smear across thousands of shift steps.",
        archaicTerm: "Three-phase sequential transfer electrodes",
        modernEquivalent: "3-phase polysilicon charge transfer shift register",
      },
      {
        title: "Lateral Channel Stops",
        summary: "Heavy $p^+$ boron-doped diffusion strips bordering the transfer channels.",
        technicalDetails:
          "High acceptor doping ($N_A > 10^{18}\\text{ cm}^{-3}$) pins the surface potential near zero, preventing photo-generated charge packets from blooming or diffusing into adjacent column channels.",
        archaicTerm: "Channel stop diffusion barriers",
        modernEquivalent: "$p^+$ channel stop isolation diffusions",
      },
      {
        title: "Floating Diffusion Readout Node",
        summary: "An on-chip reverse-biased $n^+$ diode connected to a MOSFET source follower.",
        technicalDetails:
          "Translates microscopic femtocoulomb charge packets into low-noise analog voltage steps ($\\Delta V = Q / C_{FD}$, sensitivity $\\approx 5-20\\ \\mu\\text{V}/e^-$) with correlated double sampling (CDS) reset.",
        archaicTerm: "Output charge sensing diode and amplifier",
        modernEquivalent: "Floating diffusion sense node with source follower amplifier",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Internal Photoelectric Effect & Charge Accumulation",
        formula:
          "n_e = \\frac{P_{opt} \\cdot \\eta_{QE} \\cdot T_{int}}{h \\nu}, \\quad Q_{pixel} = q \\cdot n_e",
        explanation:
          "Photons with energy exceeding the silicon bandgap ($h\\nu > E_g = 1.12\\text{ eV}$) excite valence electrons into the conduction band, accumulating a stored charge packet ($Q$) precisely proportional to optical intensity.",
      },
      {
        principle: "MOS Surface Depletion Potential Well Depth",
        formula:
          "\\psi_s = V_G' + V_0 - \\sqrt{2 V_G' V_0 + V_0^2}, \\quad V_0 = \\frac{q \\varepsilon_{si} N_A}{C_{ox}^2}",
        explanation:
          "Positive voltage applied to the gate electrode pushes away majority holes, creating a positive donor ion depletion layer with an electrostatic potential well ($\\psi_s$) that traps minority electrons.",
      },
      {
        principle: "Charge Transfer Inefficiency (CTI) & Image Contrast",
        formula:
          "S_{out}(N) = S_{in} \\cdot (1 - \\epsilon)^N \\approx S_{in} \\cdot e^{-N \\epsilon}, \\quad \\text{CTE} = 1 - \\epsilon",
        explanation:
          "Even a tiny transfer inefficiency ($\\epsilon = 10^{-4}$) causes significant image degradation over $N = 2,000$ shifts. Boyle & Smith's three-phase geometry reduced $\\epsilon < 10^{-5}$, preserving sharp image contrast across megapixel arrays.",
      },
      {
        principle: "Floating Diffusion Charge-to-Voltage Sensitivity",
        formula: "\\Delta V_{out} = \\frac{q \\cdot n_e}{C_{FD}} \\cdot A_V",
        explanation:
          "Minimizing the capacitance of the floating output node ($C_{FD} < 10\\text{ fF}$) maximizes the output voltage conversion gain, allowing single-electron detection above thermal noise.",
      },
      {
        principle: "Thermal Dark Current Generation",
        formula: "J_{dark} = q \\frac{n_i W_{dep}}{2 \\tau_g} + q n_i s_0",
        explanation:
          "Thermal generation of electron-hole pairs in the depletion region and surface states creates spurious 'dark current.' Deep-space astronomical CCDs are cryogenically cooled to $-100^\\circ\\text{C}$ to suppress $n_i \\propto e^{-E_g / 2kT}$.",
      },
    ],
    whyItMattersToday:
      "Boyle and Smith's CCD sensor transformed human civilization: it enabled modern astronomy (including the Hubble and James Webb Space Telescopes), digital photography, video camcorders, endoscopy and medical imaging, barcode scanners, and the billion-sensor CMOS image sensor industry in every modern smartphone.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "A charge coupled device comprising a semiconductor substrate, an insulating layer overlying a surface of said substrate, an array of closely spaced electrodes overlying said insulating layer and forming a plurality of three-electrode charge transfer stages, and means for applying three-phase clock voltages to said electrodes to cause sequential transfer of charge packets through said substrate.",
      plainEnglish:
        "The master apparatus claim covering a 3-phase charge coupled device with a semiconductor substrate, an insulating dielectric layer, an array of 3-electrode transfer stages, and 3-phase clock voltage means for moving charge packets sequentially across the chip.",
      keyInnovations: [
        "Bucket-brigade charge packet manipulation",
        "3-phase sequential electrode clocking",
        "Monolithic solid-state digital imaging sensor",
      ],
      legalSignificance:
        "The foundational patent claim of digital imaging sensors, recognized as the basis for the 2009 Nobel Prize in Physics.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "A charge coupled device in accordance with claim 1 wherein said electrodes of each transfer stage are arranged in overlapping relationship to eliminate potential barriers between adjacent electrodes during charge transfer.",
      plainEnglish:
        "A 3-phase CCD where the gate electrodes physically overlap in multi-level polysilicon layers, eliminating spurious potential energy barriers and dips in the silicon channel.",
      keyInnovations: [
        "Overlapping multi-layer polysilicon gates",
        "Elimination of inter-electrode potential pockets",
        "Near-unity Charge Transfer Efficiency",
      ],
      legalSignificance:
        "Protected the crucial structural fabrication technique that enabled CCDs to achieve high transfer speeds and clean images.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "A charge coupled device in accordance with claim 1 further comprising channel stop diffusion regions of higher conductivity than said substrate disposed laterally adjacent said transfer stages to confine charge packets within defined channels.",
      plainEnglish:
        "A charge coupled device featuring high-doping lateral channel stop regions that confine the moving charge packets strictly within their designated column lanes.",
      keyInnovations: [
        "Channel stop isolation diffusions",
        "Anti-blooming spatial confinement",
        "Multi-column parallel imaging arrays",
      ],
      legalSignificance:
        "Secured the lateral isolation architecture essential for building large two-dimensional megapixel sensor arrays.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Cross Section of 3-Phase CCD Showing Surface Potential Wells",
      caption:
        "Cross-sectional schematic showing the silicon substrate, silicon dioxide dielectric, and 3-phase clock electrodes ($\\phi_1, \\phi_2, \\phi_3$) shifting electron charge packets.",
      svgType: "boyle-smith-ccd",
      callouts: [
        {
          id: "ccd-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "3-Phase Polysilicon Electrodes",
          description:
            "Clocked gate electrodes establishing shifting electrostatic potential wells.",
          x: 50,
          y: 28,
        },
        {
          id: "ccd-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Silicon Dioxide Dielectric",
          description:
            "High-integrity gate oxide insulating gate electrodes from the silicon substrate.",
          x: 50,
          y: 45,
        },
        {
          id: "ccd-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Trapped Electron Charge Packet",
          description: "Photo-generated electrons confined within surface potential minimum.",
          x: 50,
          y: 68,
        },
        {
          id: "ccd-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "p-Type Silicon Substrate",
          description:
            "Semiconductor bulk where electron-hole pairs are photoelectrically generated.",
          x: 50,
          y: 88,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Three-Phase Clock Timing Diagram & Potential Profiles",
      caption:
        "Waveform timing diagram illustrating the overlapping clock phases ($\\phi_1, \\phi_2, \\phi_3$) and the corresponding smooth step-by-step transfer of electrons along the silicon channel.",
      svgType: "boyle-smith-ccd",
      callouts: [
        {
          id: "ccd-5",
          figureRef: "Fig. 2",
          label: "E",
          element: "Overlapping Phase Waveforms",
          description: "Clock pulses ensuring forward well is deep before trailing well collapses.",
          x: 50,
          y: 50,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In the late 1960s, capturing visual images required either wet chemical film (which took hours to develop in darkrooms and could not be transmitted across networks) or cumbersome vacuum-tube vidicon cameras (which were bulky, fragile, power-hungry, and suffered from severe image burn-in and lag).",
    priorArtLimitations: [
      "Silver-halide photographic film could not provide real-time electronic feedback or digital storage.",
      "Vidicon, plumbicon, and image-orthicon vacuum tubes required high operating voltages (>1,000 V) and suffered filament burnout.",
      "Early photodiode arrays required a dedicated read amplifier transistor at every single pixel, creating prohibitive manufacturing yield defects and high electronic fixed-pattern noise.",
    ],
    breakthroughInsight:
      "On October 17, 1969, during a one-hour brainstorming session at Bell Labs, Willard Boyle and George Smith conceived the charge-coupling principle: store photo-generated electrons in potential wells beneath MOS capacitors and shift them sequentially across the chip like a bucket brigade into a single shared output amplifier. This eliminated the need for individual pixel amplifiers and made dense, high-yield digital imaging chips possible.",
    patentWars: [
      {
        rivalName: "Fairchild Semiconductor, RCA, and Texas Instruments",
        rivalClaim:
          "Competitors developed linear and area imaging CCD architectures (interline transfer and frame transfer CCDs), claiming distinct imaging implementations.",
        conflictDetails:
          "While commercial manufacturers in Japan (Sony, Panasonic) and the US (Fairchild, TI, Kodak) commercialized CCD cameras for consumer camcorders and broadcast television, Bell Labs held the foundational patents on charge-coupling physics. In the 1990s, Eric Fossum at NASA JPL developed CMOS Active Pixel Sensors (APS), which integrated amplifiers back onto each pixel using standard low-cost CMOS fabrication.",
        resolution:
          "Willard S. Boyle and George E. Smith were awarded the 2009 Nobel Prize in Physics 'for the invention of an imaging semiconductor circuit—the CCD sensor.'",
        legalOutcome:
          "Boyle and Smith's 1974–1975 patents stand universally recognized as the foundational patent disclosures that sparked the digital imaging revolution.",
      },
    ],
    civilizationalImpact:
      "The CCD sensor transformed scientific discovery and everyday life. It unlocked astronomical observations with the Hubble Space Telescope, robotic exploration on Mars rovers, optical microscopes and DNA sequencers, endoscopic medical surgery, and the universal shift from film to digital video and photography.",
    funFact:
      "Boyle and Smith were originally tasked with inventing a semiconductor memory device to compete with magnetic bubble memory. In just one afternoon with chalk on a blackboard, they outlined the entire operational physics of charge-coupling. Their device made mediocre computer memory, but became the greatest digital camera in human history.",
    aftermath:
      "George Smith later remarked: 'After making the first device, we knew certainly that digital photography was here. We made a device that moved charge along, but then we made one with an array of imaging spots... we took a picture of our own faces, and there it was on the screen.'",
    sideNotes: [
      "The Hubble Space Telescope's Wide Field and Planetary Camera (WFPC2), installed during the famous 1993 servicing mission, utilized four Texas Instruments 800x800 pixel CCDs that delivered the iconic Deep Field images of the early universe.",
      "Modern scientific CCDs can achieve a quantum efficiency ($\\eta_{QE}$) exceeding 95% at optical wavelengths, compared to less than 2% for the finest photographic film.",
    ],
  },
  tags: [
    "Willard Boyle",
    "George Smith",
    "CCD Sensor",
    "Digital Photography",
    "Nobel Prize",
    "Semiconductor Revolution",
    "Optoelectronics",
    "Hubble",
    "Bell Labs",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1974–2009",
    impactScore: 100,
  },
};
