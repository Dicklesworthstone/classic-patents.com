import type { Patent } from "@/types/patent";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdFigureSheets,
} from "../editions/boyleSmithCcdEdition";

export const boyleSmithCcdPatent: Patent = {
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
  claims: boyleSmithCcdClaimTexts.map((claim) => {
    const independent = [1, 2, 10, 13, 14, 31, 32].includes(claim.number);
    const parent: Record<number, number> = {
      3: 2,
      4: 3,
      5: 3,
      6: 2,
      7: 6,
      8: 2,
      9: 2,
      11: 10,
      12: 10,
      15: 14,
      16: 15,
      17: 14,
      18: 17,
      19: 17,
      20: 17,
      21: 14,
      22: 14,
      23: 14,
      24: 14,
      25: 24,
      26: 25,
      27: 24,
      28: 24,
      29: 24,
      30: 24,
    };
    return {
      number: claim.number,
      isIndependent: independent,
      ...(parent[claim.number] ? { dependsOn: [parent[claim.number]] } : {}),
      originalText: claim.text,
      plainEnglish:
        "This claim defines the stated charge-storage or charge-transfer arrangement by retaining its physical medium, electrode arrangement, input, output, timing, or detection condition. It does not claim the later three-phase CCD record that was previously attached to this route.",
      keyInnovations: ["Induced potential-energy storage sites", "Sequential charge transfer"],
    };
  }),
  /*
  Legacy drawing metadata for the unserved US 3,923,554 asset. Kept in source
  history only while this object is corrected to the reviewed US 3,858,232.
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
  ],
  */
  drawings: boyleSmithCcdFigureSheets.map(([id, figureNumber, title]) => ({
    figureNumber,
    title,
    caption: `${figureNumber} from the local US 3,858,232 facsimile: ${title.toLowerCase()}.`,
    svgType: "boyle-smith-ccd",
    callouts: [
      {
        id: `boyle-smith-${id}`,
        figureRef: figureNumber,
        label: figureNumber,
        element: title,
        description: `Source-faithful crop for ${figureNumber}; reference numerals remain in the facsimile image.`,
        x: 50,
        y: 50,
      },
    ],
  })),
  /* Legacy US 3,923,554 historical copy retained as unserved source history. */
  /*
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
  },
  */
  historicalContext: {
    problemStatement:
      "The source identifies information storage in magnetic domains, electrostatic camera targets, and delay lines, then seeks a semiconductor medium where charge can be generated, stored in selected potential minima, moved, and retrieved.",
    priorArtLimitations: [
      "Magnetic stores represented information by domain polarity in sheets, cores, or wires.",
      "Electrostatic camera targets required scanning-electron-beam readout.",
      "Acoustic and electromechanical delay lines held information dynamically in traveling elastic waves.",
    ],
    breakthroughInsight:
      "A field-electrode sequence can translate a localized minority-carrier packet through a semiconductor by establishing an overlapping next potential well before the preceding well is removed. The same mechanism can serve serial storage, logic, multichannel transfer, imaging, or a traveling-wave implementation.",
    patentWars: [],
    civilizationalImpact:
      "The patent supplies a source-documented vocabulary and set of device arrangements for charge-coupled storage: potential wells, serial transfer, recirculation, multichannel paths, image read-in, and capacitive detection. The record does not attribute the later development of every digital camera to this particular grant.",
    funFact:
      "The front sheet expressly calls this application a continuation-in-part of Ser. No. 11,541, filed February 16, 1970 and then abandoned.",
    aftermath:
      "The grant issued on December 31, 1974 with 32 claims and 22 drawing figures. The current record confines its historical statement to what the reviewed facsimile documents.",
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
  },
};
