import type { Patent } from "@/types/patent";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
} from "../editions/boyleSmithCcdEdition";

// Preserved research draft. It contains modern-device claims, numerical
// performance assertions, a reconstructed drawing, and later-history material
// not established by US 3,858,232 itself. It is deliberately not exported.
const _legacyBoyleSmithCcdPatentDraft: Patent = {
  id: "us-3858232-boyle-smith-ccd",
  patentNumber: "US 3,858,232",
  title: "Information Storage Devices",
  shortTitle: "Charge-Coupled Information Storage",
  subtitle: "Localized Charge Storage and Serial Transfer Through Semiconductor Potential Wells",
  inventors: ["Willard S. Boyle", "George E. Smith"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1974-12-31",
  filingDate: "1971-11-09",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Digital Imaging & Optoelectronics",
  summary:
    "US 3,858,232 discloses information-storage devices in which charge carriers occupy induced potential-energy minima in a semiconductor and are translated by sequential electrode bias. The December 31, 1974 grant claims surface and buried storage, serial and multichannel transfer, input and detection stages, and image and acoustic-wave embodiments.",
  heroQuote:
    "The specification describes devices based on the recognition that minority charge carriers within a semiconductor can be used to represent information.",
  originalPdfUrl: "/patents/pdfs/us-3858232-boyle-smith-ccd.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3858232A/en",
  usptoClassification: "US 357/24, 357/23, 307/304; Int. Cl. H01L 11/14.",
  archivalEdition: boyleSmithCcdArchivalEdition,
  originalTextAsset: {
    url: "/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
    pageCount: 19,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (SilverRiver)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
  },
  originalText:
    "The source-corrected record points to the reviewed US 3,858,232 facsimile. The former US 3,923,554 text remains preserved as an unserved comparison asset and is not a transcription of this record.",
  plainEnglishExplanation: {
    overview:
      "The source is a broad charge-coupled information-storage disclosure, not the later three-phase CCD patent previously named by this route. Its central move is to make a movable electrostatic storage site: a voltage on a field electrode changes the semiconductor potential so a packet of minority carriers is confined, then an adjacent voltage sequence moves the packet to a new site for storage, logic, detection, or image readout.",
    coreMechanism:
      "An electrode and insulating layer form a field-controlled depletion region in a single-conductivity semiconductor. The electric potential energy of a carrier varies with position; a local minimum is a storage well. The source's transfer condition is overlap: before the first well is removed, a next well is established so diffusion and the electric field carry the stored charge into it. It describes two- and three-phase drive variants, surface and buried channels, and detectors that convert the stored charge or its capacitance into an observable signal.",
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

      originalText: boyleSmithCcdClaimTexts[0].text,
      plainEnglish:
        "Asymmetrical potential profile claim: two-phase charge transfer where each storage site has an asymmetrical potential well created by stepped insulator thickness or graded substrate doping to enforce unidirectional transfer.",
      keyInnovations: [
        "Asymmetrical potential well profile",
        "Two-phase directional charge transfer",
        "Built-in electrostatic barrier asymmetry",
      ],
      legalSignificance:
        "Protected two-phase CCD architectures utilizing stepped oxide or implant barriers for simplified clocking without reverse back-transfer.",
    },
    {
      number: 2,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[1].text,
      plainEnglish:
        "Foundational charge transfer apparatus: a semiconductor medium with an array of potential wells where minority charge packets are stored and sequentially transferred by establishing an overlapping next well before collapsing the preceding well.",
      keyInnovations: [
        "Sequential overlapping potential wells",
        "Minority carrier packet confinement",
        "Surface depletion charge transfer",
      ],
      legalSignificance:
        "The master apparatus claim defining the fundamental physics of charge coupling and sequential packet translation across a semiconductor substrate.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: boyleSmithCcdClaimTexts[2].text,
      plainEnglish:
        "Insulated gate array structure: specifying an insulating dielectric layer covering the semiconductor charge storage medium, topped by an array of closely spaced field electrodes.",
      keyInnovations: [
        "Insulating dielectric layer",
        "Overlying field electrode array",
        "MOS capacitor potential well generation",
      ],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [3],
      originalText: boyleSmithCcdClaimTexts[3].text,
      plainEnglish:
        "Silicon semiconductor substrate: specifying monocrystalline silicon as the charge storage semiconductor medium for integration with planar IC processes.",
      keyInnovations: [
        "Monocrystalline silicon charge medium",
        "Planar silicon processing compatibility",
        "Silicon minority carrier lifetime optimization",
      ],
    },
    {
      number: 5,
      isIndependent: false,
      dependsOn: [3],
      originalText: boyleSmithCcdClaimTexts[4].text,
      plainEnglish:
        "Silicon dioxide gate dielectric: specifying silicon dioxide (SiO2) as the high-integrity insulating dielectric layer providing low surface-state density.",
      keyInnovations: [
        "Thermally grown SiO2 gate dielectric",
        "Low surface-state interface trap density",
        "Stable oxide breakdown voltage",
      ],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [2],
      originalText: boyleSmithCcdClaimTexts[5].text,
      plainEnglish:
        "Optical image sensing integration: adding optical exposure means so incident photons generate electron-hole pairs, accumulating localized charge packets proportional to optical intensity.",
      keyInnovations: [
        "Direct optical image photon exposure",
        "Photo-generated electron packet accumulation",
        "Linear optoelectronic intensity conversion",
      ],
      legalSignificance:
        "The foundational legal claim establishing the CCD as an optical image sensor and solid-state digital camera target.",
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [6],
      originalText: boyleSmithCcdClaimTexts[6].text,
      plainEnglish:
        "Simultaneous parallel image acquisition: generating charge packets simultaneously in a plurality of spatial potential wells across the array to capture an instantaneous optical image.",
      keyInnovations: [
        "Simultaneous multi-pixel image acquisition",
        "Parallel optical charge integration",
        "Spatial photon distribution sampling",
      ],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [2],
      originalText: boyleSmithCcdClaimTexts[7].text,
      plainEnglish:
        "Piezoelectric acoustic wave coupling: incorporating a piezoelectric layer to launch surface acoustic waves that interact with and translate stored charge packets.",
      keyInnovations: [
        "Piezoelectric surface layer",
        "Acoustic surface wave potential coupling",
        "Electro-acoustic charge packet translation",
      ],
    },
    {
      number: 9,
      isIndependent: false,
      dependsOn: [2],
      originalText: boyleSmithCcdClaimTexts[8].text,
      plainEnglish:
        "Buried channel charge transfer: configuring the potential energy minima within the bulk interior of the semiconductor away from the surface interface to eliminate surface-state trapping.",
      keyInnovations: [
        "Bulk interior potential energy minimum",
        "Buried channel charge transfer",
        "Surface-state trapping elimination",
      ],
      legalSignificance:
        "Protected buried-channel CCD (BCCD) technology, which achieved transfer efficiencies > 99.999% and became standard in all scientific and consumer CCDs.",
    },
    {
      number: 10,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[9].text,
      plainEnglish:
        "Input injection region: a charge coupled device comprising a storage medium and a dedicated electrical input region at a first location for selectively introducing minority charge packets.",
      keyInnovations: [
        "Dedicated charge input injection region",
        "Selective electronic charge introduction",
        "Input-to-channel charge coupling",
      ],
    },
    {
      number: 11,
      isIndependent: false,
      dependsOn: [10],
      originalText: boyleSmithCcdClaimTexts[10].text,
      plainEnglish:
        "P-N junction input diode: an input structure comprising a reverse/forward-biased pn junction diode that injects precise minority carrier quantities into the first potential well.",
      keyInnovations: [
        "P-N junction injection diode",
        "Direct ohmic minority carrier metering",
        "Controlled electronic charge packet sizing",
      ],
    },
    {
      number: 12,
      isIndependent: false,
      dependsOn: [10],
      originalText: boyleSmithCcdClaimTexts[11].text,
      plainEnglish:
        "Avalanche breakdown injector: an input structure utilizing localized avalanche breakdown in the semiconductor to generate controlled minority carrier packets.",
      keyInnovations: [
        "Localized avalanche breakdown injector",
        "High-field impact ionization charge source",
        "Fast-pulse minority carrier injection",
      ],
    },
    {
      number: 13,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[12].text,
      plainEnglish:
        "Planar semiconductor device structure: a semiconductor charge storage layer with a major surface, an insulating layer, and a plurality of electrodes establishing spatially localized minority carrier wells.",
      keyInnovations: [
        "Planar major-surface semiconductor layer",
        "Discrete localized minority carrier wells",
        "Segmented multi-electrode gate array",
      ],
    },
    {
      number: 14,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[13].text,
      plainEnglish:
        "Master clocked charge-transfer system: semiconductor charge layer, insulator, array of transfer electrodes, and multi-phase electrical pulse source applying sequential overlapping voltages to translate stored charge.",
      keyInnovations: [
        "Multi-phase clock voltage source",
        "Sequential overlapping phase waveforms",
        "Synchronous charge packet translation",
      ],
      legalSignificance:
        "The primary system claim protecting multi-phase clocked CCD shift registers and memory arrays.",
    },
    {
      number: 15,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[14].text,
      plainEnglish:
        "Three-phase bus routing network: three separate clock distribution conductors each connected to a cyclical every-third electrode in the transfer array.",
      keyInnovations: [
        "Three separate phase distribution conductors",
        "Cyclical 3-phase electrode interconnection",
        "Three-phase potential well stepping",
      ],
    },
    {
      number: 16,
      isIndependent: false,
      dependsOn: [15],
      originalText: boyleSmithCcdClaimTexts[15].text,
      plainEnglish:
        "Planar 3-phase electrode layout geometry: electrodes shaped and arranged so that three phase lines connect to cyclical gates along the channel without multilayer crossovers.",
      keyInnovations: [
        "Crossover-free 3-phase electrode geometry",
        "Planar inter-digitated bus routing",
        "Monolithic multi-phase gate metallization",
      ],
    },
    {
      number: 17,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[16].text,
      plainEnglish:
        "Cyclic electrical pulse generator: multi-phase clock source producing cyclic voltage waveforms to advance potential wells continuously along the transfer channel.",
      keyInnovations: [
        "Cyclic multi-phase clock pulse generator",
        "Repetitive potential well propagation",
        "Synchronous clock phase timing",
      ],
    },
    {
      number: 18,
      isIndependent: false,
      dependsOn: [17],
      originalText: boyleSmithCcdClaimTexts[17].text,
      plainEnglish:
        "Square-wave clock pulse excitation: driving the transfer electrodes with rectangular square-wave voltage pulses for rapid electrostatic well transitions.",
      keyInnovations: [
        "Square-wave voltage pulses",
        "Steep electrostatic potential step edges",
        "Rapid carrier drift acceleration",
      ],
    },
    {
      number: 19,
      isIndependent: false,
      dependsOn: [17],
      originalText: boyleSmithCcdClaimTexts[18].text,
      plainEnglish:
        "Sinusoidal clock waveform excitation: driving the transfer electrodes with harmonic sinusoidal voltage waveforms for smooth, continuous potential transitions and reduced RF noise.",
      keyInnovations: [
        "Sinusoidal voltage waveforms",
        "Harmonic potential well modulation",
        "Low-noise RF clock excitation",
      ],
    },
    {
      number: 20,
      isIndependent: false,
      dependsOn: [17],
      originalText: boyleSmithCcdClaimTexts[19].text,
      plainEnglish:
        "Sawtooth clock waveform excitation: driving the transfer electrodes with asymmetric sawtooth voltage ramps to induce unidirectional electric fields along the transfer direction.",
      keyInnovations: [
        "Sawtooth voltage ramp waveforms",
        "Asymmetric directional field gradient",
        "Unidirectional charge drift enhancement",
      ],
    },
    {
      number: 21,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[20].text,
      plainEnglish:
        "DC background bias network: applying a uniform static DC voltage bias to all electrodes to maintain continuous surface depletion and prevent majority carrier surface recombination.",
      keyInnovations: [
        "Uniform static DC background bias",
        "Continuous surface depletion maintenance",
        "Surface recombination suppression",
      ],
    },
    {
      number: 22,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[21].text,
      plainEnglish:
        "Inter-electrode spacing limitation: spacing between adjacent electrodes is approximately equal to or less than the semiconductor depletion layer thickness to eliminate inter-gate potential barriers.",
      keyInnovations: [
        "Sub-depletion inter-electrode gap spacing",
        "Inter-gate potential barrier suppression",
        "Continuous fringing field overlap",
      ],
    },
    {
      number: 23,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[22].text,
      plainEnglish:
        "Electrode length dimensioning: gate electrode length in the transfer direction scaled to match carrier transit times and maximize charge transfer speed.",
      keyInnovations: [
        "Optimized gate electrode length dimension",
        "Transit-time-matched carrier diffusion",
        "High-frequency charge transfer scaling",
      ],
    },
    {
      number: 24,
      isIndependent: false,
      dependsOn: [14],
      originalText: boyleSmithCcdClaimTexts[23].text,
      plainEnglish:
        "Output charge detection stage: an electrical charge detection circuit located at an output region of the semiconductor to sense arriving minority charge packets.",
      keyInnovations: [
        "Terminal charge detection stage",
        "Minority packet presence sensing",
        "Charge-to-signal readout conversion",
      ],
    },
    {
      number: 25,
      isIndependent: false,
      dependsOn: [24],
      originalText: boyleSmithCcdClaimTexts[24].text,
      plainEnglish:
        "MOS capacitive sensing node: a metal-insulator-semiconductor capacitor structure whose capacitance or surface potential varies in response to arriving stored charge.",
      keyInnovations: [
        "Metal-insulator-semiconductor sense node",
        "Charge-dependent surface potential modulation",
        "Low-capacitance non-destructive sensing",
      ],
    },
    {
      number: 26,
      isIndependent: false,
      dependsOn: [25],
      originalText: boyleSmithCcdClaimTexts[25].text,
      plainEnglish:
        "Integrated on-chip MOSFET amplifier: connecting the MOS sensing node directly to the gate of an on-chip field-effect transistor for low-noise voltage amplification.",
      keyInnovations: [
        "On-chip MOSFET source-follower amplifier",
        "Direct gate-coupled floating node readout",
        "Sub-femtocoulomb voltage sensitivity",
      ],
      legalSignificance:
        "Protected the integrated floating diffusion amplifier stage used in all modern CCD and CMOS image sensors.",
    },
    {
      number: 27,
      isIndependent: false,
      dependsOn: [24],
      originalText: boyleSmithCcdClaimTexts[26].text,
      plainEnglish:
        "Recirculating loop architecture: coupling the output charge detection stage back to the input injection stage to create a closed recirculating dynamic shift register memory.",
      keyInnovations: [
        "Closed-loop recirculating feedback path",
        "Continuous dynamic charge recirculation",
        "Endless serial digital memory loop",
      ],
    },
    {
      number: 28,
      isIndependent: false,
      dependsOn: [24],
      originalText: boyleSmithCcdClaimTexts[27].text,
      plainEnglish:
        "Charge regeneration and thresholding repeater: an active regenerative repeater circuit that quantizes detected charge packets and reinjects refreshed full-level binary charges.",
      keyInnovations: [
        "Active charge packet regeneration circuit",
        "Binary threshold discrimination",
        "Signal-to-noise refreshing repeater",
      ],
    },
    {
      number: 29,
      isIndependent: false,
      dependsOn: [24],
      originalText: boyleSmithCcdClaimTexts[28].text,
      plainEnglish:
        "Capacitive bridge detection circuit: a balanced capacitive bridge comparing the capacitance of the charge detection node against a reference to reject common-mode clock feedthrough.",
      keyInnovations: [
        "Balanced capacitive bridge readout",
        "Common-mode clock feedthrough rejection",
        "Differential capacitive charge measurement",
      ],
    },
    {
      number: 30,
      isIndependent: false,
      dependsOn: [24],
      originalText: boyleSmithCcdClaimTexts[29].text,
      plainEnglish:
        "Split adjacent differential electrode detection: two adjacent electrodes positioned over the detection channel to detect passing charge packets via differential charge induction.",
      keyInnovations: [
        "Dual adjacent split-electrode detection",
        "Differential electrostatic induction readout",
        "Non-destructive in-flight packet sensing",
      ],
    },
    {
      number: 31,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[30].text,
      plainEnglish:
        "Multichannel parallel shift register: a uniform semiconductor body with a plurality of parallel transfer channels and shared transfer electrodes for parallel data word processing.",
      keyInnovations: [
        "Multichannel parallel transfer tracks",
        "Shared transverse transfer electrode bars",
        "Parallel-word semiconductor shift register",
      ],
    },
    {
      number: 32,
      isIndependent: true,

      originalText: boyleSmithCcdClaimTexts[31].text,
      plainEnglish:
        "2D area imaging matrix shift register: an area array comprising parallel column transfer channels, lateral channel isolation barriers, and orthogonal transfer gates for 2D optical image readout and matrix memory.",
      keyInnovations: [
        "2D area imaging matrix architecture",
        "Lateral channel isolation barrier strips",
        "Orthogonal column-to-line transfer gating",
      ],
      legalSignificance:
        "The master patent claim covering 2D area-array CCD image sensors utilized in digital cameras, camcorders, astronomy, and endoscopy.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Cross Section of 3-Phase CCD Showing Surface Potential Wells",
      caption:
        "Cross-sectional schematic showing the silicon substrate, silicon dioxide dielectric, and 3-phase clock electrodes (phi_1, phi_2, phi_3) shifting electron charge packets.",
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
      "Modern scientific CCDs can achieve a quantum efficiency (\\eta_{QE}) exceeding 95% at optical wavelengths, compared to less than 2% for the finest photographic film.",
    ],
  },
  tags: [
    "Willard Sterling Boyle",
    "George Elwood Smith",
    "Charge-coupled device",
    "Information storage",
    "Semiconductor memory",
    "Semiconductor Revolution",
    "Potential wells",
    "Charge transfer",
    "Bell Labs",
  ],
  stats: {
    totalClaims: 32,
    independentClaims: 7,
    patentWarYears: "1969–2009",
    impactScore: 100,
  },
};

/**
 * Public, source-bounded record while the full manual source edition remains
 * withheld. The detailed WIP stays available to editors above, but visitors
 * must not receive its unsupported modern performance, history, or drawing
 * reconstruction as though it came from this 1974 grant.
 */
export const boyleSmithCcdPatent: Patent = {
  id: "us-3858232-boyle-smith-ccd",
  patentNumber: "US 3,858,232",
  title: "Information Storage Devices",
  shortTitle: "Charge-Coupled Information Storage",
  subtitle: "Sequential transfer of semiconductor charge through induced potential wells",
  inventors: ["Willard S. Boyle", "George E. Smith"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1974-12-31",
  filingDate: "1971-11-09",
  era: "Semiconductor Revolution (1950–1975)",
  category: "computing",
  categoryLabel: "Digital Imaging & Optoelectronics",
  summary:
    "US 3,858,232 describes information-storage devices in which charge carriers occupy induced potential-energy minima in a semiconductor and are translated by sequential electrode bias. The complete, hand-authored source face remains withheld while its page-by-page ledger is corrected.",
  heroQuote:
    "The specification describes devices based on the recognition that minority charge carriers within a semiconductor can be used to represent information.",
  originalPdfUrl: "/patents/pdfs/us-3858232-boyle-smith-ccd.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3858232A/en",
  usptoClassification: "US 357/24, 357/23, 307/304; Int. Cl. H01L 11/14.",
  originalText:
    "The source-corrected record points to the reviewed US 3,858,232 facsimile. The former US 3,923,554 text remains preserved as an unserved comparison asset and is not a transcription of this record.",
  plainEnglishExplanation: {
    overview:
      "The grant treats information as a packet of charge held at a selected place in a semiconductor. An electrode pattern creates a local potential minimum; a later electrode sequence establishes the next minimum before the earlier one disappears, so the packet can move through the medium.",
    coreMechanism:
      "The specification describes minority-charge packets, surface and buried storage regions, input and detection stages, multichannel registers, image read-in, and acoustic-wave alternatives. Its recurring condition is a controlled sequence of potential wells that stores, translates, and detects charge without turning the historical description into a claim about a later camera or sensor product.",
    mechanicalBreakdown: [
      {
        title: "Induced potential wells",
        summary:
          "Electrode bias defines locations at which charge carriers can be stored in a semiconductor.",
        technicalDetails:
          "The source calls these locations potential wells and explains that their position and depth can be changed by the electric-field pattern at the semiconductor surface.",
        archaicTerm: "potential wells",
        modernEquivalent: "electrostatically defined charge-storage sites",
      },
      {
        title: "Sequential charge transfer",
        summary:
          "The next storage site is established in sequence so stored charge can move along the intended path.",
        technicalDetails:
          "The specification describes two- and three-phase electrode arrangements, overlapping wells, and different pulse shapes as alternatives for translating charge packets.",
        archaicTerm: "translating function",
        modernEquivalent: "clocked charge transfer",
      },
      {
        title: "Input and detection",
        summary:
          "The document gives several ways to introduce charge and to detect its presence at a terminal region.",
        technicalDetails:
          "Its examples include p-n-junction and metal-insulator-semiconductor input or detection structures, a capacitive bridge, and a regeneration path; they are described as alternative embodiments.",
        archaicTerm: "charge detecting devices",
        modernEquivalent: "electrical charge readout structures",
      },
      {
        title: "Alternative embodiments",
        summary:
          "The grant also describes buried storage, multichannel transfer, image read-in, and traveling-field arrangements.",
        technicalDetails:
          "These passages extend the same storage-and-transfer idea to different structures, including a piezoelectric layer whose traveling acoustic field can sequentially bias charge-storage sites.",
        archaicTerm: "charge translating device",
        modernEquivalent: "semiconductor charge-transfer structure",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Electrostatic charge storage",
        explanation:
          "A spatial variation in electric potential changes the energy landscape experienced by charge carriers. The patent uses that variation to create a selected storage location in the semiconductor.",
      },
      {
        principle: "Overlapped transfer sequence",
        explanation:
          "The source explains that adjacent potential wells must overlap, or nearly overlap, so charge can diffuse or be carried into the receiving site before the preceding well collapses.",
      },
      {
        principle: "Semiconductor carrier transport",
        explanation:
          "The examples distinguish storage media, carrier mobility, depletion regions, and surface or buried arrangements because those properties determine whether a charge packet can be held and moved.",
      },
    ],
    whyItMattersToday:
      "The grant is an early primary record for charge-coupled information storage. This catalogue entry intentionally does not claim particular later products, performance figures, or commercial outcomes until those statements receive their own cited historical review.",
  },
  claims: _legacyBoyleSmithCcdPatentDraft.claims.map(
    ({ legalSignificance: _legacySignificance, ...claim }) => ({
      ...claim,
      originalText: boyleSmithCcdClaimText(claim.number),
    }),
  ),
  drawings: [],
  historicalContext: {
    problemStatement:
      "The specification contrasts its approach with magnetic storage, scanned video-camera targets, delay lines, and logic-device arrays, then proposes charge storage and translation within a semiconductor.",
    priorArtLimitations: [
      "Magnetic storage represents information through magnetic domains.",
      "A scanned video-camera target stores an optical image as an electrostatic pattern.",
      "Delay lines store information dynamically in traveling acoustic or electromechanical waves.",
    ],
    breakthroughInsight:
      "The documented move is to create, select, change, and retrieve a spatially defined semiconductor storage site by electric fields, then translate the stored charge along a selected path.",
    patentWars: [],
    civilizationalImpact:
      "The pinned grant does not itself establish later commercial adoption or a patent dispute. Those topics remain deliberately unasserted pending separately sourced editorial work.",
    funFact:
      "The 1974 document presents storage, serial transfer, image read-in, multichannel registers, and acoustic-wave arrangements as related uses of one charge-translation concept.",
    aftermath:
      "The complete original text remains unavailable until the corrected ledger and explicit source references pass independent review.",
    sideNotes: [],
  },
  tags: [
    "Willard Sterling Boyle",
    "George Elwood Smith",
    "Charge-coupled device",
    "Information storage",
    "Potential wells",
    "Charge transfer",
    "Bell Labs",
  ],
  stats: {
    totalClaims: 32,
    independentClaims: 7,
  },
};
