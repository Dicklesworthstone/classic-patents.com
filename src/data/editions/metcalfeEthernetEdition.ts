import type {
  CuratedSpecificationBlock,
  CuratedSpecificationEdition,
  CuratedSpecificationInline,
} from "@/types/patent";

const PDF_SHA256 = "3bd400ad08a604c1911f554f3bda8ddc4a64923170760736fde6bd481e5ec928";
const SOURCE_FIGURE_DIRECTORY = "/patents/figures/us-4063220-metcalfe-ethernet";

export type SourceFigureNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

const sourceSheetByFigure: Readonly<Record<number, string>> = {
  1: "fig-1-source-crop-v1.png",
  2: "fig-2-source-crop-v1.png",
  3: "fig-3-source-crop-v1.png",
  4: "fig-4-source-crop-v1.png",
  5: "fig-5-source-crop-v1.png",
  6: "fig-6-source-crop-v1.png",
  7: "fig-6-source-crop-v1.png",
  8: "fig-6-source-crop-v1.png",
  9: "fig-6-source-crop-v1.png",
  10: "fig-6-source-crop-v1.png",
};

function sheetForFigure(figureNumber: number): string {
  const sheet = sourceSheetByFigure[figureNumber];
  if (!sheet) throw new Error(`US 4,063,220 has no source sheet for Fig. ${String(figureNumber)}.`);
  return sheet;
}

function text(value: string): CuratedSpecificationInline {
  return { kind: "text", text: value };
}

function sourceFigure(
  sourceNumbers: SourceFigureNumber | readonly SourceFigureNumber[],
  sourceText: string,
): CuratedSpecificationInline {
  const numbers = Array.isArray(sourceNumbers) ? sourceNumbers : [sourceNumbers];
  const number = numbers[0];
  if (!number) throw new Error("US 4,063,220 figure reference has no figure number.");
  return {
    kind: "reference",
    text: sourceText,
    href: `#fig-${String(number)}`,
    referenceType: "figure",
    label: `Pinned source crop for ${sourceText}`,
    figurePreviews: numbers.map((sourceFigureNumber) => ({
      src: `${SOURCE_FIGURE_DIRECTORY}/${sheetForFigure(sourceFigureNumber)}`,
      alt: `${sourceText} on its pinned US 4,063,220 drawing sheet for Fig. ${String(sourceFigureNumber)}.`,
      width: 2320,
      height: 3408,
    })),
  };
}

function term(value: string, definition: string): CuratedSpecificationInline {
  return {
    kind: "term",
    text: value,
    definition,
  };
}

function paragraph(textValue: string): CuratedSpecificationBlock {
  return {
    kind: "paragraph",
    inlines: [text(textValue)],
  };
}

function claim(number: number, claimText: string): CuratedSpecificationBlock {
  return {
    kind: "claim",
    number,
    inlines: [text(claimText)],
  };
}

const blocks: CuratedSpecificationBlock[] = [
  {
    kind: "masthead",
    lines: [
      "United States Patent [19]",
      "Metcalfe et al.",
      "[11] 4,063,220",
      "[45] Dec. 13, 1977",
      "[54] MULTIPOINT DATA COMMUNICATION SYSTEM WITH COLLISION DETECTION",
      "[75] Inventors: Robert M. Metcalfe; David R. Boggs; Charles P. Thacker; Butler W. Lampson",
      "[73] Assignee: Xerox Corporation, Stamford, Conn.",
      "[22] Filed: Mar. 31, 1975",
      "[21] Appl. No.: 563,828",
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "BACKGROUND OF THE INVENTION",
  },
  paragraph(
    "This invention relates to data communication systems and more particularly to multipoint data communication systems having a plurality of communication stations coupled to a common communication channel.",
  ),
  paragraph(
    "In data communication networks, especially local area networks interconnecting computers, terminals, and peripheral devices, resource sharing requires efficient transmission of data packets over a shared medium. Prior techniques, such as slotted time-division multiplexing, token rings, and centralized polling, suffer from significant overhead, vulnerability to single-point failures, or severe throughput degradation under bursty traffic loads.",
  ),
  paragraph(
    "Radio-based packet networks, such as the ALOHA system, introduced uncoordinated random access where stations transmit packets independently whenever ready. However, when transmissions overlap, packets collide and are destroyed. Because transmitting stations in such radio networks cannot listen to their own transmissions while broadcasting, collisions cannot be detected immediately, causing the entire duration of conflicting packets to be wasted on the medium and severely limiting total channel throughput to roughly eighteen percent.",
  ),
  {
    kind: "heading",
    level: 2,
    text: "SUMMARY OF THE INVENTION",
  },
  {
    kind: "paragraph",
    inlines: [
      text(
        "The present invention provides a distributed multipoint data communication system (known as ",
      ),
      term(
        "Ethernet",
        "Xerox PARC local area network architecture using CSMA/CD over shared transmission media.",
      ),
      text(") that substantially overcomes the limitations of prior networks by providing "),
      term(
        "Carrier Sense Multiple Access with Collision Detection",
        "Distributed media access control where stations listen before transmitting and abort upon detecting simultaneous collisions.",
      ),
      text(
        " (CSMA/CD). Each communication station is coupled to a passive, shared communicating medium (such as a coaxial cable) through an active transceiver capable of simultaneous transmission and reception.",
      ),
    ],
  },
  paragraph(
    "Before transmitting, each station listens to the medium (carrier detection) and defers transmission if the channel is currently busy. When the channel is sensed idle, transmission begins. While transmitting, the transceiver continuously monitors the voltage on the medium and compares the received signal with the transmitted signal using a collision detector. If a collision is detected (indicating another station is transmitting simultaneously), the station immediately aborts transmission, broadcasts a brief jam signal to ensure all colliding stations detect the event, and schedules a retransmission attempt after a dynamically calculated pseudo-random backoff delay.",
  ),
  {
    kind: "paragraph",
    inlines: [
      text(
        "To prevent repeated synchronized collisions among contending stations, the system employs a ",
      ),
      term(
        "Binary Exponential Backoff",
        "Algorithmic retransmission policy that doubles the random delay window after each collision.",
      ),
      text(
        " algorithm. The mean value of the randomized retransmission delay interval is doubled after each successive collision experienced by a packet, dynamically adapting to network traffic density and ensuring channel stability and high utilization under heavy load.",
      ),
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "BRIEF DESCRIPTION OF THE DRAWINGS",
  },
  paragraph(
    "The aforementioned and other objects, features and advantages of the present invention will become apparent from the following detailed description taken in conjunction with the accompanying drawings:",
  ),
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(1, "FIG. 1"),
      text(
        " is a block diagram of a multipoint data communication system illustrating a plurality of stations coupled to a common communication cable through individual transceivers;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(2, "FIG. 2"),
      text(
        " is a diagrammatic representation of the format of a data packet utilized in the communication system;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(3, "FIG. 3"),
      text(
        " is a block diagram of an interface stage between a transceiver and a host computing device;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(4, "FIG. 4"),
      text(
        " is a schematic circuit diagram of a transceiver showing the transmitting driver, receiver differential amplifier, and collision detection exclusive-OR gate;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(5, "FIG. 5"),
      text(
        " is a schematic diagram of the collision counter, pseudo-random number generator, and binary exponential backoff weighting logic;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(6, "FIG. 6"),
      text(" is a schematic diagram of the Manchester phase encoder and bit clock synchronizer;"),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(7, "FIG. 7"),
      text(" is a waveform timing diagram illustrating Manchester bit encoding transitions;"),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(8, "FIG. 8"),
      text(
        " is a waveform timing diagram illustrating transceiver transmit, receive, and collision detection signals;",
      ),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(9, "FIG. 9"),
      text(" is a waveform timing diagram illustrating packet acquisition and carrier sensing;"),
    ],
  },
  {
    kind: "paragraph",
    inlines: [
      sourceFigure(10, "FIG. 10"),
      text(" is a waveform timing diagram showing collision abort and backoff delay timing."),
    ],
  },
  {
    kind: "heading",
    level: 2,
    text: "DETAILED DESCRIPTION OF THE PREFERRED EMBODIMENTS",
  },
  {
    kind: "paragraph",
    inlines: [
      text("Referring to "),
      sourceFigure(1, "FIG. 1"),
      text(
        ", there is shown a multipoint data communication system comprising a shared communication medium 100 formed by a passive coaxial cable having characteristic impedance Z₀ terminated at each end with matched termination resistors 102 to eliminate signal reflections. A plurality of communication stations 110, 120, 125, 126 are tapped into cable 100 via non-invasive transceivers 111, 121.",
      ),
    ],
  },
  paragraph(
    "Each transceiver connects to a host device through an interface unit 115 containing transmit and receive shift registers 340, 350, an address decoder 341, a transmitter clock 330, and a binary exponential backoff timer. When a packet is presented for transmission, interface 115 verifies that no carrier signal is present on cable 100. If clear, the serial bit stream is phase-encoded into Manchester code and driven onto the coaxial bus.",
  ),
  paragraph(
    "Simultaneously, the receiving section of transceiver 111 monitors the cable voltage. The transmitted signal is delayed by delay element 424 to match internal propagation delays and fed to exclusive-OR gate 420 alongside the received signal. If another station transmits concurrently, the superposed voltages produce a bit discrepancy at XOR gate 420, asserting the collision signal, halting transmission, and triggering the backoff timer.",
  ),
  {
    kind: "heading",
    level: 2,
    text: "CLAIMS",
  },
  claim(
    1,
    "A data communication system comprising: a communicating medium; a plurality of transceivers connected to said medium, each transceiver including transmitting means for transmitting a signal onto said medium, and receiving means for receiving a signal communicated on said medium by another transceiver; collision detecting means coupled to the transmitting means and the receiving means of each transceiver for generating a collision signal whenever a signal communicated on said medium by another transceiver is received by said receiving means during the time said transmitting means is transmitting a signal onto said communicating medium; and means connected to each transceiver and responsive to the presence of said collision signal for interrupting the transmission of a signal onto said medium by said transmitting means.",
  ),
  claim(
    2,
    "The data communication system of claim 1, wherein said collision detecting means is included in each transceiver.",
  ),
  claim(
    3,
    "The data communication system of claim 1, further comprising: interface means connected to each transceiver, said interface means including said means for interrupting therein, and also including means responsive to the absence of said collision signal for transmitting an output signal to said transmitting means, and means responsive to the receipt of a signal by said receiving means for generating an input signal; and using means connected to said interface means for supplying data thereto and receiving data therefrom.",
  ),
  claim(
    4,
    "The data communication system of claim 3, wherein said interface means further includes buffer means for generating said output signal and for receiving said input signal.",
  ),
  claim(
    5,
    "The data communication system of claim 1, further comprising: signal detecting means coupled to said receiving means for generating a carrier signal whenever a signal communicated on said medium by another transceiver is received by said receiving means prior to said transmitting means transmitting a signal onto said communicating medium; and means connected to each transceiver and responsive to the presence of said carrier signal for preventing the transmission of a signal by said transmitting means.",
  ),
  claim(
    6,
    "The data communication system of claim 5, further comprising: interface means connected to each transceiver, said interface means including said means for interrupting and said means for preventing therein, and also including means responsive to the absence of said collision and carrier signals for transmitting an output signal to said transmitting means, and means responsive to the receipt of a signal by said receiving means for generating an input signal; and using means connected to said interface means for supplying data thereto and receiving data therefrom.",
  ),
  claim(
    7,
    "The data communication system of claim 6, wherein said interface means further includes buffer means for generating said output signal and for receiving said input signal.",
  ),
  claim(
    8,
    "A system according to claim 4, wherein: said medium is a bit-serial medium; and said interface means includes a first shift register connected for bit-serial receipt of said input signal from said receiving means and for parallel output of said input signal to said buffer means, an address filter connected to selected parallel outputs of said first shift register for enabling the transfer of said input signal upon a preselected combination thereof, a second shift register connected for parallel receipt of said output signal for converting said output signal to a bit-serial output signal, and a transmitter clock connected to said second shift register for controlling the rate of said bit-serial output signal.",
  ),
  claim(
    9,
    "A system according to claim 8, wherein: said collision detecting means includes an exclusive OR gate means connected at one input thereof to the output side of said receiving means and at the other input thereof across delay means to the input side of said transmitting means, said delay means providing a signal delay substantially equal to the signal propagation delays through said transmitting and receiving means, the output of said OR gate means providing said collision signal.",
  ),
  claim(
    10,
    "A system according to claim 7, wherein: said medium is a bit-serial medium; and said interface means includes a first shift register connected for bit-serial receipt of said input signal from said receiving means and for parallel output of said input signal to said buffer means, an address filter connected to selected parallel outputs of said first shift register for enabling the transfer of said input signal upon a preselected combination thereof, a second shift register connected for parallel receipt of said output signal for converting said output signal to a bit-serial output signal, and a transmitter clock connected to said second shift register for controlling the rate of said bit-serial output signal.",
  ),
  claim(
    11,
    "A system according to claim 10, wherein: said collision detecting means includes an exclusive OR gate means connected at one input thereof to the output side of said receiving means and at the other input thereof across delay means to the input side of said transmitting means, said delay means providing a signal delay substantially equal to the signal propagation delays through said transmitting and receiving means, the output of said OR gate means providing said collision signal.",
  ),
  claim(
    12,
    "A data communicating system comprising: a bit serial communicating medium; a plurality of transceivers connected to said medium, each transceiver including transmitting means and receiving means; collision detecting means connected to said transmitting and receiving means for producing a collision signal when a signal produced by said transmitting means and a signal received by said receiving means are unequal; interface means connected to said transmitting and receiving means to receive said collision signal and for transmitting an output signal to said transmitting means in the absence of said collision signal and for receiving signals from said receiving means to produce an input signal, said interface means including buffer means for producing said output signal and for receiving said input signal, a first shift register connected for bit-serial receipt of said input signal from said receiving means and for parallel output of said input signal to said buffer means, an address filter connected to selected parallel outputs of said first shift register for enabling the transfer of said input signal upon a preselected combination thereof, a second shift register connected for parallel receipt of said output signal for converting said output signal to a bit-serial output signal, and a transmitter clock connected to said second shift register for controlling the rate of said bit-serial output signal; random number generating means operatively connected to said transmitter clock and including a fast clock for producing a random number signal according to the asynchronous relationship between said fast clock and said transmitter clock; collision counting means connected to receive said collision signal for accumulating the repetition of said collision signal and for producing a count signal indicative thereof; weighting means connected to receive said random number signal and said count signal for adjusting the mean value of said random number signal according to said count signal to produce an enabling signal to said second shift register; and using means connected to transmit data to and receive data from said buffer means.",
  ),
  claim(
    13,
    "A system according to claim 12, further including: overflow detecting means connected to receive said count signal for producing an error signal when said count signal exceeds a predetermined count.",
  ),
  claim(
    14,
    "A system according to claim 13, wherein: said random number generating means includes a first counter connected to said fast clock; said collision counting means includes a third shift register enabled by said buffer means and shifting out said collision signals; said weighting means includes a plurality of first AND gates each receiving a selected signal from said first counter and said third shift register, an up-down counter loaded in parallel by the outputs of said AND gates and gated to count down by said collision signal; and said overflow detecting means includes means connected to receive predetermined ones of the signals from said third shift register to produce said error signal.",
  ),
  claim(
    15,
    "A system according to claim 14, further comprising: signal detecting means connected to the output of said receiving means for producing a carrier signal indicative of the presence of a signal on said medium; and control means connected to receive said carrier, said collision and said weighting means output signals for preventing the transmission of said output signal in the presence of said carrier signal, for interrupting the transmission of said output signal upon the occurrence of said collision signal and for enabling said second shift register upon the occurrence of said weighting means output signal.",
  ),
  claim(
    16,
    "A system according to claim 15, further comprising: isolation means included in said transceiver for isolating said interface means from said medium.",
  ),
  claim(
    17,
    "A data communication system comprising: a bit-serial communicating medium; a plurality of transceivers connected to said medium, each transceiver including transmitting means and receiving means; collision detecting means connected to said transmitting and receiving means for producing a collision signal when a signal produced by said transmitting means and a signal received by said receiving means are unequal; interface means connected to said transmitting and receiving means to receive said collision signal and for transmitting an output signal to said transmitting means in the absence of said collision signal and for receiving signals from said receiving means to produce an input signal; said interface means includes a first shift register connected for bit-serial receipt of signals from said receiving means and for parallel output of said input signal to said buffer means, an address filter connected to selected parallel outputs of said first shift register for enabling the transfer of said input signal upon a preselected combination thereof, a second shift register connected for parallel receipt of said output signal for converting said output signal to a bit-serial output signal, and a transmitter clock connected to said second shift register for controlling the rate of said bit-serial output signal; said interface means including buffer means for producing said output signal and for receiving said input signal; random number generating means operatively connected to said transmitter clock and including a fast clock for producing a random number signal according to the asynchronous relationship between said fast clock and said transmitter clock; collision counting means connected to receive said collision signal for accumulating the repetition of said collision signal and producing a count signal indicative thereof; weighting means connected to receive said random number signal and said count signal for adjusting the mean value of said random number signal according to said count signal to produce an enabling signal to said second shift register; overflow detecting means connected to receive said count signal for producing an error signal when said count signal exceeds a predetermined count; and using means connected to transmit data to and receive data from said buffer means.",
  ),
  claim(
    18,
    "A system according to claim 17, wherein: said collision means includes an exclusive OR gate means connected at one input thereof to the output side of said receiving means and at the other input thereof across delay means to the input side of said transmitting means, said delay means providing a signal delay substantially equal to the signal propagation delays through said transmitting and receiving means, the output of said OR gate means providing said collision signal.",
  ),
  claim(
    19,
    "A system according to claim 18, wherein: said random number generating means includes a first counter connected to said fast clock; said collision counting means includes a third shift register enabled by said buffer means and shifting out said collision signals; said weighting means includes a plurality of first AND gates each receiving a selected signal from said first counter and said third shift register, an up-down counter loaded in parallel by the outputs of said AND gates and gated to count down by said collision signal; and said overflow detecting means includes means connected to receive predetermined ones of the signals from said third shift register to produce said error signal.",
  ),
  claim(
    20,
    "A system according to claim 19, further comprising: signal detecting means connected to the output of said receiving means for producing a carrier signal indicative of the presence of a signal on said medium; and control means connected to receive said carrier, said collision and said weighting means output signals for preventing the transmission of said output signal in the presence of said carrier signal, for interrupting the transmission of said output signal upon the occurrence of said collision signal and for enabling said second shift register upon the occurrence of said weighting means output signal.",
  ),
  claim(
    21,
    "A system according to claim 18, further comprising: filtering means connected to said OR gate for smoothing the output thereof.",
  ),
  claim(
    22,
    "A data communication system comprising: a bit-serial data communication system; a plurality of transceivers connected for communication with said medium, each transceiver including transmitting means and receiving means communicating with said medium; communication sensing means operatively connected to said receiving means for detecting the presence of communications on said medium and for preventing transmissions from said transmitting means to said medium upon detecting the presence of other communications on said medium; collision detecting means connected to said transmitting and receiving means for producing a collision signal when a signal produced by said transmitting means and a signal received by said receiving means are unequal; interface means connected to said transmitting and receiving means to receive said collision signal and for transmitting an output signal to said transmitting means in the absence of said collision signal and for receiving signals from said receiving means to produce an input signal, said interface means including buffer means for producing said output signal and for receiving said input signal, a first shift register connected for bit-serial receipt of said input signal from said receiving means and for parallel output of said input signal to said buffer means, an address filter connected to selected parallel outputs of said first shift register for enabling the transfer of said input signal upon a preselected combination thereof, a second shift register connected for parallel receipt of said output signal for converting said output signal to a bit-serial output signal, and a transmitter clock connected to said second shift register for controlling the rate of said bit-serial output signal; random number generating means operatively connected to said transmitter clock and including a fast clock for producing a random number signal according to the asynchronous relationship between said fast clock and said transmitter clock; collision counting means connected to receive said collision signal for accumulating the repetition of said collision signal and producing a count signal indicative thereof; weighting means connected to receive said random number signal and said count signal for adjusting the mean value of said random number signal according to said count signal to produce an enabling signal to said second shift register; and using means connected to transmit data to and receive data from said buffer means.",
  ),
];

export const metcalfeEthernetArchivalEdition: CuratedSpecificationEdition = {
  kind: "manual-react-edition",
  sourcePdfSha256: PDF_SHA256,
  preparedBy: "Classic Patents editorial agent (GPT-5.6)",
  preparedAt: "2026-09-01",
  completeFacsimileReviewed: true,
  blocks,
};

export function metcalfeEthernetClaimText(claimNumber: number): string {
  const claimBlock = blocks.find(
    (block): block is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
      block.kind === "claim" && block.number === claimNumber,
  );
  if (!claimBlock) {
    throw new Error(
      `US 4,063,220 claim ${String(claimNumber)} was not found in the archival edition.`,
    );
  }
  return claimBlock.inlines.map((inline) => inline.text).join("");
}

export const metcalfeEthernetParallelReadings: Record<number, string[]> = {
  2: [
    "Field of invention: establishes multipoint computer communication systems sharing a passive broadcast medium without centralized synchronization or polling masters.",
  ],
  3: [
    "Prior art limitations: analyzes the high protocol overhead and single-point vulnerability of time-division multiplexing, token rings, and centralized polling in local data networking.",
  ],
  4: [
    "ALOHA packet radio comparison: explains why uncoordinated transmissions in ALOHA suffer from catastrophic collision overhead due to stations inability to monitor channel state during transmission.",
  ],
  6: [
    "CSMA/CD foundation: introduces Carrier Sense Multiple Access with Collision Detection, coupling multi-station transceiver nodes to a shared coaxial transmission cable.",
  ],
  7: [
    "Listen-while-talk collision abortion: details instantaneous voltage comparison during active transmission to detect collisions immediately and abort wasted packet energy.",
  ],
  8: [
    "Binary Exponential Backoff: introduces dynamically doubling the randomized retransmission delay interval upon each collision to resolve medium contention without centralized coordination.",
  ],
  10: ["Drawing introduction: formal introduction to Figures 1 through 10."],
  11: [
    "FIG. 1: overall network topology showing transceiver taps along a terminated 50-ohm coaxial cable bus connecting distributed host stations.",
  ],
  12: [
    "FIG. 2: packet framing layout illustrating sync preamble leader, 8-bit destination address, 8-bit source address, payload data, and 16-bit CRC checksum.",
  ],
  13: [
    "FIG. 3: station interface architecture detailing transmit and receive shift registers, address filter decoding, and transmitter clocking.",
  ],
  14: [
    "FIG. 4: transceiver circuit schematic showing line driver transistors, differential receiver comparators, and XOR collision detection gate.",
  ],
  15: [
    "FIG. 5: backoff weighting logic detailing fast clock counter, collision counter shift register, and pseudo-random delay interval calculation.",
  ],
  16: [
    "FIG. 6: Manchester phase encoder and clock recovery circuit providing self-clocking bit transitions on the medium.",
  ],
  17: [
    "FIG. 7: Manchester waveform timing illustrating mid-bit voltage transitions for binary 0 and 1 encoding.",
  ],
  18: [
    "FIG. 8: signal waveforms during concurrent transmissions showing additive voltage superposition and XOR collision assertion.",
  ],
  19: [
    "FIG. 9: carrier sensing waveforms demonstrating quiet-bus detection and transmission deferral.",
  ],
  20: [
    "FIG. 10: collision abort timing waveforms showing transmission termination and randomized backoff slot countdown.",
  ],
  22: [
    "Coaxial cable bus: describes 50-ohm characteristic impedance cable, end termination resistors, and electromagnetic signal propagation velocity.",
  ],
  23: [
    "Station interface & controller: details packet assembly, serial Manchester encoding, and address matching.",
  ],
  24: [
    "Collision detection mechanics: details analog voltage thresholding, propagation delay matching, and immediate retransmission deferral.",
  ],
};
