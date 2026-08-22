import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
} from "@/data/editions/boyleSmithCcdEdition";
import type { Patent, PatentClaim } from "@/types/patent";

const claimMetadata: Record<
  number,
  {
    isIndependent: boolean;
    dependsOn?: number[];
    plainEnglish: string;
    keyInnovations: string[];
    legalSignificance?: string;
  }
> = {
  1: {
    isIndependent: true,
    plainEnglish:
      "Master apparatus claim for a charge transfer device wherein information-bearing charge carriers are stored in and serially transferred through a plurality of induced potential energy wells along a continuous semiconductor medium that is characterized by having a uniform single conductivity type without intermediate p-n junctions.",
    keyInnovations: [
      "Continuous single-conductivity charge-transfer channel",
      "Induced electrostatic potential energy wells",
      "Sequential field-electrode clocking",
    ],
    legalSignificance:
      "The foundational master patent claim for Charge-Coupled Devices, establishing broad legal protection for potential-well charge packet storage and transfer.",
  },
  2: {
    isIndependent: true,
    plainEnglish:
      "Protects a charge transfer apparatus wherein discrete minority charge carrier packets are stored and serially translated along a semiconductor medium by sequentially applying voltages through field electrodes, characterized in that the semiconductor region directly underlying each transfer electrode is of a single conductivity type.",
    keyInnovations: [
      "Single-conductivity semiconductor underlying transfer electrodes",
      "Elimination of isolated p-n diffusions beneath gates",
    ],
    legalSignificance:
      "Key apparatus claim protecting single-conductivity substrate regions under every field gate.",
  },
  3: {
    isIndependent: false,
    dependsOn: [2],
    plainEnglish:
      "Covers the charge transfer apparatus of claim 2 wherein the single-conductivity semiconductor storage medium is covered by an insulating dielectric layer, with the plurality of field electrodes disposed directly on top of the insulating layer.",
    keyInnovations: [
      "Metal-Insulator-Semiconductor (MIS) gate stack architecture",
      "Continuous dielectric insulation over charge channel",
    ],
  },
  4: {
    isIndependent: false,
    dependsOn: [3],
    plainEnglish:
      "Protects the charge transfer apparatus of claim 3 wherein the single-conductivity semiconductor charge storage medium is crystalline silicon, providing high carrier mobility and low thermal generation leakage for room-temperature charge transfer.",
    keyInnovations: [
      "Crystalline silicon storage medium",
      "High minority carrier mobility and lifetime",
    ],
  },
  5: {
    isIndependent: false,
    dependsOn: [3],
    plainEnglish:
      "Covers the charge transfer apparatus of claim 3 wherein the insulating dielectric layer disposed between the semiconductor and field electrodes comprises thermally grown silicon dioxide ($SiO_2$) exhibiting low interface state density.",
    keyInnovations: [
      "Thermally grown silicon dioxide dielectric",
      "Low surface state interface trapping",
    ],
  },
  6: {
    isIndependent: false,
    dependsOn: [2],
    plainEnglish:
      "Protects the charge transfer apparatus of claim 2 further incorporating means for exposing the semiconductor device to incident optical radiation to generate minority charge carriers via the internal photoelectric effect.",
    keyInnovations: [
      "Optical image sensing integration",
      "Photoelectric carrier generation in potential wells",
    ],
    legalSignificance:
      "Foundational claim protecting the CCD as an electronic optical image sensor and solid-state camera.",
  },
  7: {
    isIndependent: false,
    dependsOn: [6],
    plainEnglish:
      "Covers the optical charge transfer apparatus of claim 6 wherein incident image light simultaneously generates and accumulates photo-charge carrier packets across a plurality of distinct potential energy wells during an optical integration period.",
    keyInnovations: [
      "Parallel optical image exposure and accumulation",
      "Simultaneous spatial photon-to-electron conversion",
    ],
  },
  8: {
    isIndependent: false,
    dependsOn: [2],
    plainEnglish:
      "Protects the charge transfer apparatus of claim 2 further comprising a piezoelectric layer formed on the device and acoustic transducers creating traveling acoustic surface waves whose electric fields sequentially induce moving potential wells.",
    keyInnovations: [
      "Acoustic surface wave (SAW) charge translation",
      "Piezoelectric-induced moving potential wells",
    ],
  },
  9: {
    isIndependent: false,
    dependsOn: [2],
    plainEnglish:
      "Covers the charge transfer apparatus of claim 2 wherein the semiconductor portion in which charge packets are stored and translated is specifically the surface depletion layer adjacent to the insulator interface.",
    keyInnovations: [
      "Surface-channel charge-coupled operation",
      "Interface depletion layer potential wells",
    ],
  },
  10: {
    isIndependent: true,
    plainEnglish:
      "Apparatus claim for a charge-coupled device comprising an input region for introducing signal charge, an output detection region, a single-conductivity semiconductor transfer channel interconnecting input and output, an overlying insulating layer, and at least four discrete gate electrodes disposed on the insulator.",
    keyInnovations: [
      "Complete input-to-output CCD device topology",
      "At least four discrete transfer electrodes over single-conductivity channel",
    ],
    legalSignificance:
      "Foundational structural combination claim for complete shift register and memory architectures.",
  },
  11: {
    isIndependent: false,
    dependsOn: [10],
    plainEnglish:
      "Covers the charge-coupled device of claim 10 wherein the charge input region for introducing information-bearing charge carrier packets into the storage medium comprises a reverse-biased p-n junction diffusion.",
    keyInnovations: [
      "p-n junction electrical charge injector",
      "Controlled electronic data input into potential wells",
    ],
  },
  12: {
    isIndependent: false,
    dependsOn: [10],
    plainEnglish:
      "Protects the charge-coupled device of claim 10 wherein the charge input region for introducing minority carrier packets into the semiconductor channel comprises an independently biased metal-insulator-semiconductor (MIS) gate structure.",
    keyInnovations: [
      "MIS gate structure electrical charge input",
      "Junctionless charge injection via field avalanche or tunneling",
    ],
  },
  13: {
    isIndependent: true,
    plainEnglish:
      "Protects a semiconductor device having a single-conductivity charge storage layer, an insulating layer, an electrode assembly, and control means for creating a succession of spaced potential-well storage sites and transferring stored charges in a predetermined direction.",
    keyInnovations: [
      "Spaced storage site generation in single-conductivity layer",
      "Directional charge packet transfer control",
    ],
  },
  14: {
    isIndependent: true,
    plainEnglish:
      "Covers a semiconductor device having a major surface covered by an insulating layer and gate electrodes, with means for creating spaced storage sites and transferring stored charges, characterized in that the semiconductor region directly underlying each electrode is of a single conductivity type.",
    keyInnovations: [
      "Homogeneous single-conductivity semiconductor under each electrode",
      "Sequential transfer across un-diffused substrate regions",
    ],
  },
  15: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Protects the device of claim 14 further comprising three separate electrical clock bus conductors, with each conductor connected to a different one of every third electrode in sequence across the multi-phase electrode array.",
    keyInnovations: [
      "Three-phase clock bus wiring distribution",
      "Interconnection to every third electrode in sequence",
    ],
  },
  16: {
    isIndependent: false,
    dependsOn: [15],
    plainEnglish:
      "Covers the device of claim 15 wherein the gate electrodes are geometrically configured and spaced so that the three separate clock bus conductors extend parallel to one another across the integrated circuit layout.",
    keyInnovations: [
      "Parallel three-phase bus layout without critical crossovers",
      "Planar metallization routing geometry",
    ],
  },
  17: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Protects the device of claim 14 wherein the storage and transfer means comprises electrical clock circuit means connected to the plurality of electrodes for applying voltage pulses sequentially to propagate potential wells along the channel.",
    keyInnovations: [
      "Multi-phase electrical pulse clocking",
      "Sequential voltage stepping for traveling potential wells",
    ],
  },
  18: {
    isIndependent: false,
    dependsOn: [17],
    plainEnglish:
      "Covers the device of claim 17 wherein the sequential electrical clock pulses applied to the transfer electrodes are symmetrical square wave pulses having overlapping high-bias phase transitions for efficient carrier transfer.",
    keyInnovations: [
      "Square wave clock pulse drive",
      "Overlapping phase windows for zero-loss transfer",
    ],
  },
  19: {
    isIndependent: false,
    dependsOn: [17],
    plainEnglish:
      "Protects the device of claim 17 wherein the sequential electrical drive voltages applied to the transfer electrodes are multi-phase sinusoidal sine wave signals with smooth, continuous overlapping phase relationships.",
    keyInnovations: [
      "Sinusoidal clock drive waveforms",
      "Continuous resonant clocking for high-frequency operation",
    ],
  },
  20: {
    isIndependent: false,
    dependsOn: [17],
    plainEnglish:
      "Covers the device of claim 17 wherein the sequential electrical drive voltages applied to the transfer electrodes are sawtooth wave pulses having linear voltage ramps that impart directional electrostatic drift forces.",
    keyInnovations: [
      "Sawtooth clock waveforms",
      "Directional electrostatic drift acceleration",
    ],
  },
  21: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Protects the device of claim 14 further including electrical circuit means for applying a uniform baseline bias potential to all electrodes, maintaining the semiconductor surface continuously depleted of majority carriers during operation.",
    keyInnovations: [
      "Uniform baseline DC depletion bias",
      "Prevention of majority carrier recombination during clock transitions",
    ],
  },
  22: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Covers the device of claim 14 wherein the inter-electrode spacing gap between adjacent metal field electrodes along the charge transfer channel is fabricated to be approximately 3 microns.",
    keyInnovations: [
      "Micron-scale inter-electrode spacing (approx. 3 µm)",
      "Depletion layer fringing field overlap",
    ],
  },
  23: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Protects the device of claim 14 wherein the longitudinal length of each field electrode along the transfer direction is dimensioned to be comparable to or less than the thickness of the overlying insulating layer.",
    keyInnovations: [
      "Sub-micron electrode length scaling",
      "High-speed transit time optimization",
    ],
  },
  24: {
    isIndependent: false,
    dependsOn: [14],
    plainEnglish:
      "Covers the device of claim 14 further comprising charge detection means positioned at a terminal charge detection region for measuring the presence, absence, or quantity of charge carriers emerging from the channel.",
    keyInnovations: [
      "Terminal charge detection node",
      "Quantitative measurement of discrete charge packets",
    ],
  },
  25: {
    isIndependent: false,
    dependsOn: [24],
    plainEnglish:
      "Protects the device of claim 24 wherein the output charge detection means comprises a metal-insulator-semiconductor (MIS) capacitor sensing structure that detects capacitance variations induced by accumulated charge packets.",
    keyInnovations: [
      "MIS capacitor charge sensing",
      "Capacitance-modulation charge detection",
    ],
  },
  26: {
    isIndependent: false,
    dependsOn: [25],
    plainEnglish:
      "Covers the device of claim 25 wherein the metal-insulator-semiconductor sensing capacitor is electrically connected to the gate of an on-chip field-effect transistor for non-destructive, low-noise voltage readout.",
    keyInnovations: [
      "On-chip FET gate charge readout buffer",
      "Low-noise floating gate sensing amplifier",
    ],
  },
  27: {
    isIndependent: false,
    dependsOn: [24],
    plainEnglish:
      "Protects the device of claim 24 wherein the terminal charge detection means is electrically coupled back to a charge input region to recirculate charge packets in a closed digital loop.",
    keyInnovations: [
      "Closed-loop charge recirculation",
      "Dynamic shift register circulating memory",
    ],
  },
  28: {
    isIndependent: false,
    dependsOn: [24],
    plainEnglish:
      "Covers the device of claim 24 further including active electronic amplifier and refresh circuit means for regenerating the magnitude of detected charge packets before recirculating them through the shift register.",
    keyInnovations: [
      "Active charge packet regeneration and refresh",
      "Digital signal restoration for infinite storage persistence",
    ],
  },
  29: {
    isIndependent: false,
    dependsOn: [24],
    plainEnglish:
      "Protects the device of claim 24 wherein the charge detection means comprises an AC capacitive bridge circuit coupled to the detection region for measuring subtle changes in semiconductor depletion layer capacitance.",
    keyInnovations: [
      "Capacitive bridge sensing circuit",
      "High-sensitivity depletion capacitance readout",
    ],
  },
  30: {
    isIndependent: false,
    dependsOn: [24],
    plainEnglish:
      "Covers the device of claim 24 wherein the charge detection means comprises two adjacent electrodes overlying the detection region, an alternating current source, and circuit means measuring power dissipation caused by charge packet oscillation.",
    keyInnovations: [
      "AC power dissipation charge detection",
      "High-frequency carrier oscillation sensing",
    ],
  },
  31: {
    isIndependent: true,
    plainEnglish:
      "Apparatus claim for a multichannel CCD shift register comprising a uniform single-conductivity semiconductor body, an insulating layer, multiple parallel series of metal electrodes defining isolated transfer paths, input charge generators, multi-phase clock circuits, and output detectors in each series.",
    keyInnovations: [
      "Parallel multichannel CCD shift register architecture",
      "Multi-channel array on single homogeneous substrate",
    ],
    legalSignificance:
      "Protects parallel multichannel CCD architectures used for area image sensors and high-bandwidth memory arrays.",
  },
  32: {
    isIndependent: true,
    plainEnglish:
      "Comprehensive structural claim for a multichannel CCD shift register with input electrodes along one side, output electrodes along the opposite side, and groups of three-phase transfer electrodes extending between inputs and outputs, characterized by single-conductivity semiconductor regions underlying each transfer electrode.",
    keyInnovations: [
      "Complete three-phase multichannel shift register topology",
      "Inter-electrode channel pitch greater than intra-channel electrode gap",
      "Uniform single-conductivity channel substrate",
    ],
    legalSignificance:
      "Broad structural patent protecting full integrated circuit implementations of multichannel CCD arrays.",
  },
};

const claims: PatentClaim[] = boyleSmithCcdClaimTexts.map((c) => {
  const meta = claimMetadata[c.number];
  if (!meta) {
    throw new Error(`Missing metadata for CCD claim ${c.number}`);
  }
  return {
    number: c.number,
    isIndependent: meta.isIndependent,
    ...(meta.dependsOn ? { dependsOn: meta.dependsOn } : {}),
    originalText: boyleSmithCcdClaimText(c.number),
    plainEnglish: meta.plainEnglish,
    keyInnovations: meta.keyInnovations,
    ...(meta.legalSignificance ? { legalSignificance: meta.legalSignificance } : {}),
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
