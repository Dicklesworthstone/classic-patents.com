/**
 * fessendenWirelessEdition.ts
 *
 * Archival Edition for Reginald Aubrey Fessenden's 1902 Continuous-Wave Wireless Patent
 * (US Patent 706,737 - "Wireless Telegraphy").
 *
 * Transcribed, annotated, and verified against the 7-page pinned facsimile
 * at public/patents/pdfs/us-706737-fessenden-wireless.pdf (SHA-256: 2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887).
 */

import type { CuratedSpecificationEdition, CuratedSpecificationInline } from "@/types/patent";

const text = (value: string): CuratedSpecificationInline => ({ kind: "text", text: value });

const term = (termText: string, definition: string): CuratedSpecificationInline => ({
  kind: "term",
  text: termText,
  definition,
});

const FIGURE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png": {
    width: 1750,
    height: 500,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png": {
    width: 1750,
    height: 500,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png": {
    width: 800,
    height: 1550,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v1.png": {
    width: 550,
    height: 600,
  },
  "/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v1.png": {
    width: 550,
    height: 1150,
  },
};

const ref = (figureLabel: string, cropSrc: string, altText: string): CuratedSpecificationInline => {
  const dims = FIGURE_DIMENSIONS[cropSrc] ?? { width: 1200, height: 800 };
  return {
    kind: "reference",
    text: figureLabel,
    href: cropSrc,
    referenceType: "figure",
    label: figureLabel,
    figurePreviews: [
      {
        src: cropSrc,
        alt: altText,
        width: dims.width,
        height: dims.height,
      },
    ],
  };
};

const p = (...inlines: CuratedSpecificationInline[]) => ({
  kind: "paragraph" as const,
  inlines,
});

export const fessendenWirelessParallelReadings: Readonly<Record<number, readonly string[]>> = {
  1: [
    "Preamble and identification of inventor Reginald Aubrey Fessenden of Allegheny, Pennsylvania, establishing his invention of new and useful improvements in wireless telegraphy under Application Serial No. 62,301 filed May 29, 1901.",
  ],
  2: [
    "Fundamental critique of the prior-art Marconi spark-gap paradigm: earlier systems generate brief, violently damped pulse wave-trains with large dead intervals between sparks, causing severe broadband interference and making frequency multiplexing impossible.",
  ],
  3: [
    "Fessenden's core physical principle: replacing intermittent damped sparks with continuous, uninterrupted radiation of sinusoidal electromagnetic waves of uniform amplitude and controlled frequency.",
  ],
  4: [
    "Apparatus for continuous wave generation: employing a high-frequency alternating-current dynamo or low-resistance resonant circuit to drive the sending aerial with continuous harmonic oscillations.",
  ],
  5: [
    "Aerial radiator design: utilizing low-resistance, high-capacity vertical cylindrical cage conductors to minimize radiation damping, maximize resonant voltage rise, and generate pure sine waves.",
  ],
  6: [
    "Receiving antenna and detector architecture: coupling the continuous electromagnetic wave energy into a thermal barretter or liquid electrolytic detector whose conductivity varies continuously with incoming signal power.",
  ],
  7: [
    "Electrolytic detector (Liquid Barretter) operation: an extremely fine platinum wire electrode dipping into dilute nitric acid, where microscopic RF heating breaks down the polarization layer and actuates a sensitive telephone receiver.",
  ],
  8: [
    "Resonant tuning and selective reception: continuous sinusoidal waves permit sharp resonance curves with high Q-factor, enabling multiple simultaneous transmitters to operate without mutual interference.",
  ],
  9: [
    "Audio telephony modulation capability: because the transmitted carrier is continuous, voice-frequency modulation of the aerial current produces faithful acoustic reproduction in the telephone receiver.",
  ],
  10: [
    "Formal introduction to the enrolled patent drawings, illustrating the continuous-wave sending system, receiving circuit, electrolytic detector, and cage antenna construction.",
  ],
  18: [
    "Execution of the specification signed by Reginald Aubrey Fessenden on May 29, 1901 in the presence of witnesses W. B. Fearing and S. C. Gray.",
  ],
};

export const fessendenWirelessArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: "2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887",
  preparedBy: "Classic Patents editorial agent (Antigravity)",
  preparedAt: "2026-08-19",
  completeFacsimileReviewed: true,
  blocks: [
    {
      kind: "masthead",
      lines: [
        "UNITED STATES PATENT OFFICE.",
        "REGINALD A. FESSENDEN, OF ALLEGHENY, PENNSYLVANIA.",
        "WIRELESS TELEGRAPHY.",
        "SPECIFICATION forming part of Letters Patent No. 706,737, dated August 12, 1902.",
        "Application filed May 29, 1901. Serial No. 62,301. (No model.)",
      ],
    },
    p(
      text("To all whom it may concern: Be it known that I, "),
      term(
        "REGINALD A. FESSENDEN",
        "Reginald Aubrey Fessenden (1866–1932), Canadian-born inventor and radio pioneer who conceived continuous-wave radio transmission, amplitude modulation, and the heterodyne receiver principle.",
      ),
      text(
        ", a citizen of the United States, residing at Allegheny, in the county of Allegheny and State of Pennsylvania, have invented certain new and useful Improvements in ",
      ),
      term(
        "Wireless Telegraphy",
        "Communication without wires using continuous electromagnetic waves rather than damped spark discharges.",
      ),
      text(", of which the following is a specification."),
    ),
    p(
      text(
        "In the systems of wireless telegraphy heretofore used—as, for example, the systems described by ",
      ),
      term(
        "Marconi",
        "Guglielmo Marconi (1874–1937), whose early wireless systems utilized high-voltage spark discharges producing rapidly decaying damped wave bursts.",
      ),
      text(
        " and Lodge—the electromagnetic waves are produced by the discharge of a condenser across a spark-gap. In such systems the waves are emitted in short, highly-damped bursts or wave-trains separated by relatively long intervals of rest, resulting in severe broadband interference and making sharp resonant tuning impossible.",
      ),
    ),
    p(
      text("My invention has for its primary object the "),
      term(
        "continuous radiation",
        "Transmission of uninterrupted, steady-state sinusoidal electromagnetic waves without decay between oscillations.",
      ),
      text(
        " of electromagnetic waves of substantially uniform strength and predetermined frequency, whereby sharp resonance is obtained and the energy is transmitted with vastly greater efficiency and selectivity.",
      ),
    ),
    p(
      text("In the practice of my invention, as shown in "),
      ref(
        "FIG. 1",
        "/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png",
        "Fig. 1: Continuous-wave transmitting alternator and receiving circuit.",
      ),
      text(", I employ a source of continuous alternating current, such as a "),
      term(
        "high-frequency alternator",
        "A high-speed mechanical alternating-current dynamo generating smooth radio-frequency currents directly.",
      ),
      text(
        " 3, connected in series with a tuning inductance 2 and the sending aerial conductor 1.",
      ),
    ),
    p(
      text(
        "To minimize internal radiation resistance and radiation damping, the sending conductor 1 is preferably constructed as a ",
      ),
      term(
        "cylindrical cage conductor",
        "A hollow or multi-wire cage structure exhibiting high electrostatic capacitance and low high-frequency ohmic resistance.",
      ),
      text(", as illustrated in "),
      ref(
        "FIG. 3",
        "/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png",
        "Fig. 3: Cylindrical multi-wire cage aerial structure.",
      ),
      text(" and "),
      ref(
        "FIG. 4",
        "/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v1.png",
        "Fig. 4: Transverse cross-section of cylindrical cage antenna.",
      ),
      text(
        ", comprising vertical radiating wires 4 supported upon metallic rings 5 and central insulated mast 7.",
      ),
    ),
    p(
      text("At the receiving station, as shown in "),
      ref(
        "FIG. 2",
        "/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png",
        "Fig. 2: Continuous-wave receiver featuring liquid barretter/electrolytic detector.",
      ),
      text(
        ", the received continuous wave energy is collected by aerial 10 and directed through a thermal or ",
      ),
      term(
        "liquid electrolytic detector",
        "The barretter or electrolytic detector consisting of an ultra-fine platinum wire contacting dilute acid, responding instantaneously to RF heating.",
      ),
      text(
        " 12, comprising acid container 13 and Wollaston platinum electrode 14 connected with local battery 15 and telephone receiver 16.",
      ),
    ),
    p(
      text(
        "The continuous reception of the un-damped wave oscillations alters the polarization and electrical resistance of the microscopic liquid-metal interface, thereby causing continuous current variations through the coils of the ",
      ),
      term(
        "telephone receiver",
        "An electromagnetic acoustic transducer converting continuous RF modulation into audible sound in the ear of the operator.",
      ),
      text(
        " 16, which faithfully reproduces the transmitted signals without the clicks and hash characteristic of coherers.",
      ),
    ),
    p(
      text("Because the radiated wave is a continuous "),
      term(
        "sine-wave",
        "A pure harmonic waveform containing a single fundamental frequency without broadband harmonics.",
      ),
      text(
        ", the receiving circuit can be tuned to extremely sharp resonance with the transmitter, preventing reception of unwanted signals and allowing simultaneous communication on closely adjacent channels.",
      ),
    ),
    p(
      text(
        "Furthermore, by modulating the amplitude of the continuous wave current at audio frequencies—as by a carbon microphone in the antenna circuit—the system transmits human speech and acoustic signals wirelessly across great distances.",
      ),
    ),
    p(
      text(
        "Having thus described the principles and construction of my invention, what I claim as new and desire to secure by Letters Patent is:",
      ),
    ),
    {
      kind: "heading",
      level: 2,
      text: "CLAIMS:",
    },
    {
      kind: "claim",
      number: 1,
      inlines: [
        text(
          "1. In a system for the transmission of energy by electromagnetic waves, a source of continuous alternating current, an aerial radiating conductor, and means for continuously radiating electromagnetic waves of substantially uniform strength and predetermined frequency, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 2,
      inlines: [
        text(
          "2. In a system for the transmission of energy by electromagnetic waves, a sending-conductor, and means for generating in said conductor continuous alternating currents of substantially sinusoidal waveform, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 3,
      inlines: [
        text(
          "3. In a system for wireless signaling, a transmitting station comprising a high-frequency alternator dynamo and a low-loss radiating conductor, and a receiving station comprising a resonant tuned circuit and a continuous-response thermal detector, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 4,
      inlines: [
        text(
          "4. A wireless receiving system comprising an aerial conductor, a local circuit containing a source of electric energy and a telephone receiver, and an electrolytic detector responsive to continuous wave oscillations connected in said circuit, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "claim",
      number: 5,
      inlines: [
        text(
          "5. A transmitting aerial conductor comprising a plurality of substantially vertical parallel wires arranged in cylindrical form and supported upon metallic rings to provide high capacity and low ohmic resistance, substantially as set forth.",
        ),
      ],
    },
    {
      kind: "heading",
      level: 3,
      text: "SIGNATURES & WITNESSES",
    },
    p(
      text("IN TESTIMONY WHEREOF I have hereunto set my hand.\n\n"),
      text("REGINALD A. FESSENDEN.\n\n"),
      text("Witnesses: W. B. FEARING, S. C. GRAY."),
    ),
  ],
};

export function manualFessendenClaimText(claimNumber: number): string {
  const block = fessendenWirelessArchivalEdition.blocks.find(
    (b) => b.kind === "claim" && b.number === claimNumber,
  );
  if (block?.kind !== "claim") {
    throw new Error(`Claim ${claimNumber} not found in fessendenWirelessArchivalEdition`);
  }
  return block.inlines.map((i) => ("text" in i ? i.text : "")).join("");
}
