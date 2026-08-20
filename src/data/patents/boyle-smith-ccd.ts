import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
} from "@/data/editions/boyleSmithCcdEdition";
import type { Patent, PatentClaim } from "@/types/patent";

const claims: PatentClaim[] = boyleSmithCcdClaimTexts.map((c) => {
  const isIndependent = [1, 10, 14, 18, 23, 27, 30].includes(c.number);
  return {
    number: c.number,
    isIndependent,
    originalText: boyleSmithCcdClaimText(c.number),
    plainEnglish:
      c.number === 1
        ? "Master claim for an information-storage device comprising a semiconductor medium of single conductivity type, an array of closely spaced field electrodes on an insulating layer, and drive voltage means to sequentially induce potential energy wells that store and translate packets of minority charge carriers along the continuous channel without intermediate p-n diffusions."
        : c.number === 10
          ? "Apparatus claim reciting a multichannel charge-coupled shift register with heavily doped channel-stop isolation barriers separating parallel charge translation channels."
          : c.number === 14
            ? "Optical image sensor embodiment wherein incident optical radiation generates electron-hole pairs, accumulating photoelectrons in potential wells in proportion to spatial light intensity for sequential serial readout."
            : c.number === 18
              ? "Two-phase asymmetrical electrode configuration utilizing stepped oxide thicknesses or differentiated work functions to establish built-in directional potential gradients."
              : c.number === 23
                ? "Charge input and detection circuitry comprising reverse-biased p-n junction or MIS floating diffusion sensing nodes that convert transported charge packets into low-noise output electrical voltages."
                : c.number === 27
                  ? "Acoustic-wave charge translation apparatus wherein a piezoelectric layer propagates an acoustic surface wave whose electric field sequentially biases the semiconductor charge-storage sites."
                  : c.number === 30
                    ? "Buried-channel charge-coupled architecture wherein potential energy minima are positioned beneath the semiconductor surface in the bulk substrate to eliminate surface-state trapping and maximize transfer speed."
                    : `Refinement claim ${c.number} detailing specific clock waveforms, electrode overlap geometries, dielectric dimensions, or charge-injection parameters.`,
    keyInnovations:
      c.number === 1
        ? [
            "Continuous single-conductivity charge-transfer channel",
            "Induced electrostatic potential energy wells",
            "Sequential field-electrode clocking",
          ]
        : [`CCD architectural feature ${c.number}`],
    legalSignificance:
      c.number === 1
        ? "The foundational master patent claim for Charge-Coupled Devices, establishing broad legal protection for potential-well charge packet storage and transfer."
        : `Subsidiary claim protecting specific embodiment ${c.number}.`,
  };
});

export const boyleSmithCcdPatent: Patent = {
  id: "us-3858232-boyle-smith-ccd",
  patentNumber: "US 3,858,232",
  title: "Information Storage Devices",
  shortTitle: "Boyle & Smith Charge-Coupled Device (CCD)",
  subtitle:
    "Sequential Charge Packet Storage and Transfer Through Induced Semiconductor Potential Wells",
  inventors: ["Willard S. Boyle", "George E. Smith"],
  inventorLocation: "Murray Hill, New Jersey",
  grantDate: "1974-12-31",
  filingDate: "1971-11-09",
  era: "Information Age (1960–1990)",
  category: "computing",
  categoryLabel: "Digital Imaging & Optoelectronics",
  summary:
    "United States Patent 3,858,232 discloses the Charge-Coupled Device (CCD), invented at Bell Telephone Laboratories by Willard S. Boyle and George E. Smith. The device stores and manipulates information in the form of discrete packets of minority charge carriers (photoelectrons) confined within mobile electrostatic potential energy wells created by an array of closely spaced MOS gate electrodes on a single-conductivity semiconductor substrate. By sequentially clocking adjacent electrode voltages, potential wells are deepened and collapsed in an overlapping sequence, smoothly transferring charge packets along a continuous channel with over 99.999% transfer efficiency. The CCD replaced bulky electron-beam vacuum tubes (vidicons) and magnetic storage with solid-state digital imaging, winning Boyle and Smith the 2009 Nobel Prize in Physics.",
  heroQuote:
    "The specification describes devices based on the recognition that minority charge carriers within a semiconductor can be used to represent information, and that localized potential energy minima can be created and translated through the semiconductor to store and transfer that information.",
  originalPdfUrl: "/patents/pdfs/us-3858232-boyle-smith-ccd.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US3858232A/en",
  usptoClassification: "357/24",
  originalTextAsset: {
    url: "/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
    pageCount: 19,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents Archival & Semiconductor Review Team",
    reviewedAt: "2026-08-20",
    sourcePdfSha256: "769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2",
  },
  archivalEdition: boyleSmithCcdArchivalEdition,
  originalText:
    "This invention relates to information storage devices and, more particularly, to such devices which utilize semiconductor media. In the past, devices operating on the principles of charge storage in semiconductor devices typically required separate isolated p-n junctions for every bit of stored information. In accordance with the present invention, an array of closely spaced field electrodes overlying a single-conductivity semiconductor substrate creates mobile potential energy minima that store and translate charge packets directly through the semiconductor without intermediate wiring or junctions.",
  drawings: [
    {
      figureNumber: "Figure 1a",
      title: "Basic 3-Phase CCD Shift Register Structure",
      caption:
        "Schematic cross section of a three-phase charge-coupled device shift register showing the silicon substrate 11, insulating oxide layer 12, and sequentially clocked gate electrodes 13.",
      svgType: "ccd-gate-array",
      callouts: [
        {
          id: "callout-substrate",
          figureRef: "Fig. 1a",
          label: "11",
          element: "11",
          description: "Single-conductivity silicon semiconductor substrate.",
          x: 50,
          y: 80,
        },
        {
          id: "callout-oxide",
          figureRef: "Fig. 1a",
          label: "12",
          element: "12",
          description: "Thin silicon dioxide insulating layer.",
          x: 50,
          y: 45,
        },
        {
          id: "callout-electrodes",
          figureRef: "Fig. 1a",
          label: "13",
          element: "13",
          description: "Clocked metal-insulator-semiconductor field electrodes.",
          x: 50,
          y: 25,
        },
      ],
    },
    {
      figureNumber: "Figure 1b",
      title: "Depletion Potential Well Profile and Stored Charge",
      caption:
        "Surface potential distribution showing the localized potential energy well containing a packet of minority electrons under an active gate electrode.",
      svgType: "ccd-potential-well",
      callouts: [
        {
          id: "callout-well",
          figureRef: "Fig. 1b",
          label: "W",
          element: "W",
          description: "Induced electrostatic potential energy minimum.",
          x: 50,
          y: 50,
        },
      ],
    },
    {
      figureNumber: "Figure 14",
      title: "Optical Image Sensor and Photo-Carrier Accumulation",
      caption:
        "Charge-coupled optical image sensor showing photons generating electron-hole pairs that collect in potential wells in proportion to image irradiance.",
      svgType: "ccd-image-sensor",
      callouts: [
        {
          id: "callout-light",
          figureRef: "Fig. 14",
          label: "hν",
          element: "hν",
          description: "Incident optical photons generating photo-charge packets.",
          x: 50,
          y: 15,
        },
      ],
    },
  ],
  plainEnglishExplanation: {
    overview:
      "In October 1969 at Bell Telephone Laboratories, physicists Willard Boyle and George Smith were asked to create a solid-state memory technology to compete with magnetic bubble memory. In just one hour of brainstorming at a blackboard, they conceived the Charge-Coupled Device (CCD). Instead of building complex circuits with millions of separate transistors and wires, they realized that electric voltages applied to surface metal plates could create invisible 'buckets' (potential energy wells) in a flat silicon crystal. Stored electrical charges (representing digital 1s/0s or analog pixel brightness) could be poured like water from bucket to bucket simply by clocking the voltages. When exposed to light, silicon naturally converts photons into electron packets, turning the CCD into an electronic eye that revolutionized astronomy, digital cameras, and medical imaging.",
    coreMechanism:
      "A CCD operates through a 3-step sequence: (1) Charge Generation & Integration: Incident light generates electron-hole pairs in p-type silicon via the photoelectric effect. A positive gate voltage ($V_G \\approx 10\\text{ V}$) repels majority positive holes, creating a deep depletion potential well ($\\psi_s \\approx 8\\text{ V}$) that captures photoelectrons. (2) Three-Phase Clocked Transfer: Three adjacent gate electrodes ($\\Phi_1, \\Phi_2, \\Phi_3$) are clocked in overlapping phase cycles. When $\\Phi_2$ is energized while $\\Phi_1$ is still high, an overlapping potential well opens, and thermal diffusion plus fringing electric fields drive electrons into the new well. When $\\Phi_1$ is ramped down, the electrons are trapped under $\\Phi_2$. Repeating this across thousands of gates transfers charge with over 99.999% efficiency (CTE). (3) Output Readout: At the channel end, charge packets are dumped onto a floating diffusion sensing node connected to an on-chip source-follower MOSFET, converting charge packets ($Q$) into low-noise analog output voltage ($V_{\\text{out}} = Q / C_{\\text{FD}}$).",
    mechanicalBreakdown: [
      {
        title: "MOS Depletion Potential Well Array",
        summary:
          "Array of metal-oxide-semiconductor gate electrodes overlying p-type silicon substrate.",
        technicalDetails:
          "Positive gate bias ($V_G = 5\\text{ to }15\\text{ V}$) creates surface depletion layers ($\\psi_s \\approx V_G - V_{\\text{FB}} + V_0 - \\sqrt{2(V_G - V_{\\text{FB}})V_0 + V_0^2}$), forming potential energy minima with full-well storage capacity up to $3 \\times 10^5$ electrons per $100\\ \\mu\\text{m}^2$ pixel.",
        archaicTerm: "potential energy minima in semiconductor",
        modernEquivalent: "MOS potential well / CCD pixel photogate",
      },
      {
        title: "3-Phase Polysilicon Clocked Shift Register",
        summary: "Sequential tri-level gate electrodes driven by overlapping clock waveforms.",
        technicalDetails:
          "Three-phase clocking ($\\Phi_1, \\Phi_2, \\Phi_3$) produces directional traveling potential wells with transit times under 50 nanoseconds, achieving Charge Transfer Inefficiency below $10^{-5}$ ($\\text{CTE} > 0.99999$).",
        archaicTerm: "sequential field-electrode translating means",
        modernEquivalent: "multi-phase CCD charge shift register",
      },
      {
        title: "Single-Conductivity Channel Architecture",
        summary:
          "Continuous semiconductor channel formed without intermediate p-n junction diffusions.",
        technicalDetails:
          "Eliminates p-n junctions between adjacent bits, dramatically reducing parasitic capacitance, dark current leakage, and silicon surface area requirements.",
        archaicTerm: "channel of single conductivity type",
        modernEquivalent: "charge-coupled transport channel",
      },
      {
        title: "Floating Diffusion Readout Node",
        summary:
          "Low-capacitance output sensing diode with reset MOSFET and source-follower buffer.",
        technicalDetails:
          "Converts discrete electron packets into microvolt-level analog signals with extremely low read noise ($\\sigma_{\\text{read}} < 5\\text{ e}^-$ rms) and dynamic range exceeding 80 dB.",
        archaicTerm: "charge detecting device",
        modernEquivalent: "floating diffusion amplifier node",
      },
    ],
    scientificPrinciples: [
      {
        principle: "MOS Deep Depletion Surface Potential",
        formula:
          "\\psi_s = V_G - V_{\\text{FB}} + V_0 - \\sqrt{2 (V_G - V_{\\text{FB}}) V_0 + V_0^2} \\quad \\text{where} \\quad V_0 = \\frac{q \\epsilon_{\\text{Si}} N_A}{C_{\\text{ox}}^2}",
        explanation:
          "Positive gate voltage repels mobile holes from the surface, creating an unshielded negative acceptor space-charge depletion region with a deep electrostatic potential well.",
      },
      {
        principle: "Charge Transfer Efficiency & Diffusion Kinetics",
        formula:
          "\\text{CTE} = 1 - \\text{CTI} = 1 - \\left[ \\exp\\left(-\\frac{\\pi^2 D_n t_{\\text{transfer}}}{4 L_{\\text{gate}}^2}\\right) + \\epsilon_{\\text{trap}} \\right]",
        explanation:
          "Thermal diffusion and self-induced electrostatic drift govern the rapid transit of electrons between adjacent potential wells during clock phase overlap.",
      },
      {
        principle: "Photoelectric Carrier Generation & Integration",
        formula:
          "N_e = \\min\\left(Q_{\\text{max}}, \\eta_{\\text{QE}} \\frac{P_{\\text{opt}} A_{\\text{pixel}} t_{\\text{int}}}{h \\nu} + N_{\\text{dark}}\\right)",
        explanation:
          "Incident photons with energy exceeding the 1.12 eV silicon bandgap create electron-hole pairs collected and stored linearly during the optical integration frame time.",
      },
    ],
    whyItMattersToday:
      "The CCD revolutionized human vision and scientific discovery. It enabled digital photography, smartphone cameras, camcorders, medical endoscopy, barcode scanners, and astronomical imaging—including the Hubble Space Telescope and deep-space planetary probes—earning Boyle and Smith the 2009 Nobel Prize in Physics.",
  },
  claims,
  historicalContext: {
    problemStatement:
      "In the late 1960s, electronic imaging required fragile, bulky, high-voltage vacuum tubes (Vidicons and Image Orthicons) with raster electron beams, while computer memory relied on complex magnetic cores or emerging transistor circuits that required separate wiring for every bit.",
    priorArtLimitations: [
      "Vidicon camera tubes required high vacuum, high voltages (>1000V), and had severe image lag and burn-in",
      "Semiconductor shift registers required separate isolated p-n junction diffusions for every bit",
      "Magnetic core memory was expensive, bulky, and power-hungry",
    ],
    breakthroughInsight:
      "Boyle and Smith realized that mobile electric charge packets could be stored in surface potential wells and shifted continuously through a single homogeneous semiconductor substrate simply by manipulating the voltages on a sequence of surface metal plates.",
    patentWars: [
      {
        rivalName: "Texas Instruments & Fairchild Semiconductor",
        rivalClaim: "Bucket-Brigade Devices (BBD) and Charge-Injection Devices (CID)",
        conflictDetails:
          "Philips had developed the Bucket-Brigade Device (BBD) using discrete transistors and capacitors. Bell Labs established that the CCD's continuous single-conductivity substrate without intermediate p-n diffusions was fundamentally superior in packing density, speed, and transfer efficiency.",
        resolution:
          "Boyle and Smith's patent US 3,858,232 was granted on December 31, 1974, establishing Bell Labs' foundational priority for charge-coupled devices.",
        legalOutcome:
          "Willard Boyle and George Smith were awarded the 2009 Nobel Prize in Physics for their invention of the Charge-Coupled Device.",
      },
    ],
    civilizationalImpact:
      "The CCD democratized digital visual culture, eliminated photographic film development, made modern medical endoscopy non-invasive, and allowed astronomers to peer back to the dawn of the universe with quantum efficiency exceeding 90%.",
    funFact:
      "Willard Boyle and George Smith conceived the entire architecture of the Charge-Coupled Device in approximately one hour of intense brainstorming on an afternoon in October 1969.",
  },
  stats: {
    totalClaims: 32,
    independentClaims: 7,
  },
};
