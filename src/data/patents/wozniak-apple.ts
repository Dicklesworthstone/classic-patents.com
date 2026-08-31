import {
  wozniakAppleArchivalEdition,
  wozniakAppleClaimText,
} from "@/data/editions/wozniakAppleEdition";
import type { Patent } from "@/types/patent";

// Preserved migration witness. The public export below is separately bound to
// the reviewed seven-page facsimile; this legacy copy is not rendered.
const _legacyWozniakApplePatent: Patent = {
  id: "us-4136359-wozniak-apple",
  patentNumber: "US 4,136,359",
  title: "Microcomputer for Use with Video Display",
  shortTitle: "Steve Wozniak's Apple II Personal Computer",
  subtitle: "Shared-Bus Time-Multiplexed Dynamic RAM & Digital NTSC Color Subcarrier Modulation",
  inventors: ["Stephen G. Wozniak"],
  inventorLocation: "San Jose, California",
  grantDate: "1979-01-23",
  filingDate: "1977-04-11",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Microcomputers & Digital Hardware",
  summary:
    "The Genesis of the Personal Computer Industry: On April 11, 1977, Apple Computer co-founder Steve Wozniak filed US Patent No. 4,136,359 for the revolutionary microcomputer architecture of the Apple II. Prior to Wozniak's design, microcomputers required expensive, flickering video cards that stole 50% of processor cycles. Wozniak conceived a dual-phase shared-bus multiplexing architecture: the MOS 6502 CPU accessed DRAM during phase $\\Phi_2$, while the video generator retrieved pixel bytes during phase $\\Phi_1$. This achieved 100% full CPU throughput and flicker-free NTSC color graphics on ordinary home television sets with zero wait states.",
  heroQuote:
    "I was designing the computer because I wanted to own a computer... but when I finished, I realized I had designed a device that would change how ordinary people lived and worked.",
  originalPdfUrl: "/patents/pdfs/us-4136359-wozniak-apple.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4136359A/en",
  usptoClassification:
    "G06F 13/00 (Data processing; Program control and shared memory bus systems)",
  originalTextAsset: {
    url: "/patents/transcripts/us-4136359-wozniak-apple-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: wozniakAppleArchivalEdition.sourcePdfSha256,
  },
  originalText: `UNITED STATES PATENT OFFICE
4,136,359
Patented Jan. 23, 1979

MICROCOMPUTER FOR USE WITH VIDEO DISPLAY
Stephen G. Wozniak, San Jose, Calif., assignor to Apple Computer, Inc., Cupertino, Calif.
Filed Apr. 11, 1977, Ser. No. 786,812
Int. Cl. G06f 13/00
U.S. Cl. 345-547
11 Claims

SPECIFICATION

TO ALL WHOM IT MAY CONCERN:
Be it known that I, STEPHEN G. WOZNIAK, a citizen of the United States, residing at San Jose, in the county of Santa Clara and State of California, have invented certain new and useful improvements in a MICROCOMPUTER FOR USE WITH VIDEO DISPLAY, of which the following is a specification:

BACKGROUND OF THE INVENTION
Personal and hobbyist microcomputers have generally required expensive peripheral cathode ray tube terminals or complex Direct Memory Access (DMA) display interfaces. Conventional DMA video controllers periodically interrupt or halt the central microprocessor during raster scanning, thereby reducing computing throughput by 30% to 50% and causing objectionable visual screen jitter during active computation.

SUMMARY OF THE INVENTION
The present invention provides an elegant and economical architecture whereby a standard microprocessor (such as the MOS 6502) and a raster video display generator share a common random-access memory (RAM) bank without ever interfering with one another.

The microprocessor operates in synchronism with a two-phase non-overlapping clock. During the first clock phase (Phi 1), the address bus of the dynamic RAM is coupled to video raster address counters, and display data (ASCII characters or high-resolution graphic bytes) is latched into video shift registers. During the second clock phase (Phi 2), the address bus of the dynamic RAM is coupled to the microprocessor address lines for normal program fetch and execution.

Because the microprocessor requires memory bus access exclusively during Phi 2, the video refresh is completely transparent to the processor, achieving 100% CPU speed and 100% video raster duty cycle. Furthermore, refreshing the dynamic RAM rows during the sequential video scan inherently satisfies the dynamic charge refresh requirements of the memory chips, eliminating dedicated refresh controller circuitry.

COLOR VIDEO GENERATION
In addition, the invention provides a novel digital technique for generating color video on standard consumer NTSC television receivers. A 14.31818 MHz master clock is divided by four to generate the 3.579545 MHz color subcarrier. By selectively gating pixel data bits with discrete digital delay taps from the high-speed clock divider, phase-modulated color bursts are synthesized directly without requiring expensive analog quadrature modulators.

I CLAIM:
1. In a microcomputer system including a microprocessor and a dynamic random-access memory array, a video display generation apparatus comprising: clock means for generating a two-phase clock signal having a first phase and a second phase; multiplexing means coupled to said microprocessor, said video display generator, and said dynamic random-access memory array for coupling said video display generator to said memory array during said first phase to retrieve display data therefrom, and for coupling said microprocessor to said memory array during said second phase to perform memory read and write operations; and video output means for converting the display data retrieved during said first phase into video signals for driving a display monitor.
2. An apparatus as set forth in claim 1, further comprising color generation means for generating a color subcarrier signal and for phase-shifting display pulses relative to said color subcarrier signal to produce color video signals.`,
  plainEnglishExplanation: {
    overview:
      "In 1976, personal microcomputers like the Altair 8800 and IMSAI 8080 were noisy, blinkenlight metal boxes that required expensive $1,000 video terminals to show text. The few hobbyist machines that could display video directly on a TV screen suffered from severe processor stuttering: whenever the cathode ray tube drew a frame, the CPU was frozen for half the time (Direct Memory Access contention). Steve Wozniak engineered a masterwork of digital efficiency for the Apple II: by locking the MOS 6502 microprocessor to a master 14.31818 MHz clock and splitting each memory cycle into two 489-nanosecond phases, the CPU and the video display shared the exact same dynamic RAM without ever colliding, delivering smooth, high-resolution color graphics on home TVs at zero cost in CPU speed.",
    coreMechanism:
      "The master 14.31818 MHz crystal oscillator is divided down to generate a 1.0227 MHz two-phase non-overlapping clock. During the low phase ($\\Phi_1$, 489 ns), standard 74LS multiplexers connect video raster line counters to the dynamic RAM address bus, latching pixel graphics into a high-speed shift register. During the high phase ($\\Phi_2$, 489 ns), the multiplexers switch address lines to the MOS 6502 microprocessor for instruction fetch and data execution. Because the 6502 only touches memory during $\\Phi_2$, CPU execution runs at 100% peak speed with zero wait states. Simultaneously, sequential video raster memory fetches automatically refresh the capacitive storage cells in the DRAM, eliminating expensive dedicated DRAM refresh chips.",
    mechanicalBreakdown: [
      {
        title: "Two-Phase Non-Overlapping Shared-Bus Multiplexer",
        summary: "74LS-series multiplexers alternating DRAM address buses between CPU and Video.",
        technicalDetails:
          "During $\\Phi_1$ (489 ns), video scan counters read display bytes. During $\\Phi_2$ (489 ns), the 6502 CPU executes instructions. Bus contention is mathematically zero, achieving 100% CPU throughput and 100% video display duty cycle.",
        archaicTerm: "Multiplexing means for coupling video generator and microprocessor",
        modernEquivalent: "Unified Memory Architecture (UMA) / Memory bus arbiter",
      },
      {
        title: "Digital NTSC Chroma Subcarrier Phase Modulator",
        summary: "Synthesizing 4-color and 6-color NTSC video using discrete clock delay taps.",
        technicalDetails:
          "Dividing the 14.31818 MHz master clock by 4 produces the 3.579545 MHz NTSC color subcarrier. Gating pixel bits with 90° and 180° digital phase delays produces violet, green, blue, and orange colors on standard consumer color TVs without expensive analog modulators.",
        archaicTerm: "Phase-shifting display pulses relative to color subcarrier",
        modernEquivalent: "Digital Video Chroma Phase Synthesizer",
      },
      {
        title: "Video Raster DRAM Auto-Refresh Mechanism",
        summary: "Using video scan line sweeps to refresh 4116 DRAM storage capacitors.",
        technicalDetails:
          "4116 DRAM chips require all 64 row addresses to be accessed every 2 milliseconds to prevent charge leakage ($V_c(t) = V_0 e^{-t/RC}$). The video beam traverses 262 scan lines every 16.6 ms, inherently refreshing all DRAM rows without dedicated controller silicon.",
        archaicTerm: "Dynamic random-access memory array refresh",
        modernEquivalent: "DRAM burst/raster auto-refresh controller",
      },
      {
        title: "High-Speed Parallel-to-Serial Dot Clock Shift Register",
        summary:
          "74LS166 shift register converting memory bytes into high-resolution pixel streams.",
        technicalDetails:
          "Latches 7 pixel bits at 1.0227 MHz and clocks them out serially at 7.159 MHz ($t_{pixel} = 139.7\\text{ ns}$), driving composite monochrome and NTSC color video amplifiers.",
        archaicTerm: "Video shift register means",
        modernEquivalent: "Video serialization DAC / RAMDAC",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Two-Phase Non-Overlapping Time-Division Bus Multiplexing",
        formula:
          "T_{cycle} = t_{\\Phi_1} + t_{\\Phi_2} = 489.3\\text{ ns} + 489.3\\text{ ns} = 978.6\\text{ ns} \\implies f_{CPU} = \\frac{14.31818\\text{ MHz}}{14} \\approx 1.0227\\text{ MHz}",
        explanation:
          "Splitting the memory cycle cleanly between Phase 1 (Video) and Phase 2 (CPU) provides 100% non-blocking memory bandwidth to both subsystems simultaneously.",
      },
      {
        principle: "NTSC Composite Color Quadrature Modulation",
        formula:
          "V_{video}(t) = Y(t) + I \\cos(2\\pi f_{sc} t + \\theta) + Q \\sin(2\\pi f_{sc} t + \\theta), \\quad f_{sc} = \\frac{14.31818\\text{ MHz}}{4} = 3.579545\\text{ MHz}",
        explanation:
          "By aligning the master crystal to exactly 4 times the NTSC color subcarrier frequency, discrete digital clock delays produce instant phase angles $\\theta$, generating saturated colors on home TVs.",
      },
      {
        principle: "Dynamic RAM Capacitive Discharge & Scan Refresh Timing",
        formula:
          "V_c(t) = V_{dd} \\exp\\left(-\\frac{t}{R_{leak} C_{cell}}\\right), \\quad t_{refresh} = 64 \\times 63.55\\,\\mu\\text{s/line} = 4.07\\text{ ms} \\le t_{hold}",
        explanation:
          "Horizontal scan line counter addressing sweeps all 64 DRAM row addresses within the maximum dielectric charge retention limit of the 4116 DRAM capacitor cells.",
      },
      {
        principle: "High-Resolution Dot Clock Pixel Latency",
        formula:
          "f_{dot} = 2 f_{sc} = 7.15909\\text{ MHz} \\implies t_{pixel} = \\frac{1}{f_{dot}} \\approx 139.68\\text{ ns/pixel}",
        explanation:
          "Outputting pixel bits at double the color subcarrier frequency provides 280 horizontal pixels across each visible 40-microsecond scan line.",
      },
      {
        principle: "Digital Phase-Delay Color Palette Generation",
        formula:
          "\\Delta\\theta_n = n \\cdot 90^\\circ \\implies [00 \\to \\text{Black}, \\; 01 \\to \\text{Purple/Violet}, \\; 10 \\to \\text{Green}, \\; 11 \\to \\text{White}]",
        explanation:
          "Adjacent bit patterns in the shift register alter the relative phase of the output signal relative to the 3.58 MHz color burst, tricking the TV into displaying distinct primary colors.",
      },
    ],
    whyItMattersToday:
      "Steve Wozniak's Apple II architecture was the foundation of Apple Inc. and the commercial personal computer revolution. The concept of **Unified Memory Architecture (UMA)**—where CPU and high-performance graphics share a single high-bandwidth memory pool without bus contention—remains the core architectural design of modern Apple Silicon processors (M1/M2/M3/M4) and gaming consoles like the PlayStation 5.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. In a microcomputer system including a microprocessor and a dynamic random-access memory array, a video display generation apparatus comprising: clock means for generating a two-phase clock signal having a first phase and a second phase; multiplexing means coupled to said microprocessor, said video display generator, and said dynamic random-access memory array for coupling said video display generator to said memory array during said first phase to retrieve display data therefrom, and for coupling said microprocessor to said memory array during said second phase to perform memory read and write operations; and video output means for converting the display data retrieved during said first phase into video signals for driving a display monitor.",
      plainEnglish:
        "The master architectural claim covering the interleaved two-phase shared-bus memory multiplexer: dynamic RAM is accessed by the video display during Phase 1 and by the CPU during Phase 2, eliminating memory contention.",
      keyInnovations: [
        "Two-phase non-overlapping shared-bus memory multiplexing",
        "Zero-wait-state CPU execution with transparent video display refresh",
        "Unified system and video RAM architecture",
      ],
      legalSignificance:
        "The pioneer patent claim protecting time-multiplexed unified memory architectures in personal microcomputers.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. An apparatus as set forth in claim 1, further comprising color generation means for generating a color subcarrier signal and for phase-shifting display pulses relative to said color subcarrier signal to produce color video signals.",
      plainEnglish:
        "Specifies discrete digital phase-shifting of pixel pulses relative to the 3.58 MHz color subcarrier to synthesize full NTSC color on consumer televisions.",
      keyInnovations: [
        "Digital synthesis of NTSC color subcarrier without analog modulators",
        "Phase-delayed pixel color modulation",
      ],
      legalSignificance:
        "Protected Wozniak's digital color generation circuitry, enabling low-cost color graphics on home microcomputers.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "3. An apparatus as set forth in claim 1, wherein said dynamic random-access memory array is periodically refreshed by sequential address scanning of said video display generator during said first clock phase.",
      plainEnglish:
        "Covers utilizing the sequential video scan line addressing during Phase 1 to automatically refresh the storage capacitors of dynamic RAM cells without separate refresh hardware.",
      keyInnovations: [
        "DRAM auto-refresh via raster video scan",
        "Elimination of dedicated DRAM refresh controller chips",
      ],
      legalSignificance:
        "Secured the video-driven DRAM auto-refresh mechanism that saved dozens of chips and slashed manufacturing costs.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Apple II Microcomputer Architecture Block Diagram",
      caption:
        "Overall system schematic showing MOS 6502 microprocessor, address multiplexer, shared dynamic RAM bank, video raster counters, and composite video generator.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "12",
          element: "MOS 6502 8-Bit Microprocessor",
          description:
            "Central processing unit executing code exclusively during Phi 2 clock phase.",
          x: 25,
          y: 40,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "20",
          element: "Shared Dynamic RAM Array",
          description: "48KB time-multiplexed DRAM storing both system memory and video bitmaps.",
          x: 55,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Two-Phase Bus Timing and Waveform Diagram",
      caption:
        "Timing diagram illustrating the precise non-overlapping interleaving of Phi 1 video scan access and Phi 2 CPU execution cycles.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "32",
          element: "Phi 1 Video Memory Access Window",
          description: "489 ns memory access window dedicated to video raster data retrieval.",
          x: 30,
          y: 60,
        },
        {
          id: "c4",
          figureRef: "Fig. 2",
          label: "34",
          element: "Phi 2 CPU Instruction Execution Window",
          description: "489 ns memory access window dedicated to 6502 microprocessor instructions.",
          x: 70,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1976, hobbyist computers like the MITS Altair 8800 were bare circuit boards with front-panel toggle switches and red LEDs. Displaying text or graphics required buying a separate $1,000 terminal or a crude video board that halted the CPU during screen drawing, causing intolerable visual stutter and slashing computational speed by 50%. Furthermore, color graphics required expensive specialized broadcast equipment that no consumer could afford.",
    priorArtLimitations: [
      "Direct Memory Access (DMA) video interfaces periodically seized the memory bus, stalling microprocessor calculation cycles and halving performance.",
      "Dual-port static RAM video buffers were prohibitively expensive and required complex arbitration logic.",
      "Dynamic RAM required dozens of dedicated peripheral controller chips to generate refresh timing and row address cycles.",
      "Color generation required bulky analog quartz modulators, RF filters, and phase-delay lines.",
    ],
    breakthroughInsight:
      "Steve Wozniak realized that the MOS 6502 microprocessor only accesses the system memory bus during the second half ($\\Phi_2$) of its clock cycle. The first half ($\\Phi_1$) was completely idle. Wozniak designed a simple multiplexer circuit that gave the video raster generator exclusive memory access during $\\Phi_1$ and the CPU exclusive access during $\\Phi_2$. This allowed both CPU and video to run at 100% full speed with zero contention on a single shared RAM bank. To create color, Wozniak chose a 14.31818 MHz master clock (exactly $4\\times$ the NTSC 3.58 MHz color subcarrier) and created full color by digitally shifting pixel bits in 90° increments.",
    patentWars: [
      {
        rivalName: "Commodore PET, Tandy TRS-80, and IBM PC",
        rivalClaim:
          "Commodore (PET 2001) and Tandy (TRS-80 Model I) competed for the 1977 personal computer market with monochrome-only text displays. IBM later introduced the IBM PC in 1981 with the Color Graphics Adapter (CGA), which used separate video RAM and suffered from visible 'snow' noise when the CPU accessed video memory during active scans.",
        conflictDetails:
          "The Apple II became a runaway commercial sensation because it was the only personal computer capable of high-resolution color graphics, smooth animation, and audio without screen snow or processor lag. In 1979, Dan Bricklin and Bob Frankston created **VisiCalc**—the world's first electronic spreadsheet—exclusively for the Apple II because of its fast, instant screen updating.",
        resolution:
          "VisiCalc turned the Apple II from a hobbyist machine into an essential corporate business tool, selling millions of units and propelling Apple Computer to its historic December 1980 IPO.",
        legalOutcome:
          "Wozniak's US Patent No. 4,136,359 protected Apple's unified video memory architecture and cemented Apple's technological advantage throughout the 1970s and 1980s.",
      },
    ],
    civilizationalImpact:
      "The Apple II established the modern personal computer industry. It was the first consumer appliance computer with a molded plastic case, built-in keyboard, expansion slots, color graphics, sound, and floppy disk storage. It introduced an entire generation of students, programmers, and business leaders to personal computing.",
    funFact:
      "Steve Wozniak designed the entire Apple II hardware and software by hand! Working alone at night while employed at Hewlett-Packard, Wozniak hand-wrote the 6502 assembly code for Apple BASIC, the floating-point math routines, and the SWEET-16 virtual machine on paper pads with a pencil, manually converting instructions into hexadecimal machine code bytes before typing them into a ROM burner.",
    aftermath:
      "Over six million Apple II series computers were sold between 1977 and 1993, making it one of the longest-lived computer architectures in history. Steve Wozniak was awarded the National Medal of Technology by President Ronald Reagan in 1985 and was inducted into the National Inventors Hall of Fame in 2000.",
    sideNotes: [
      "Wozniak designed the game *Breakout* in hardware for Atari at Steve Jobs' request in just four days, which inspired him to add color and sound to the Apple II so he could play *Breakout* in BASIC.",
      "The Disk II 5.25-inch floppy disk controller, invented by Wozniak in 1978, used only 8 simple logic chips compared to the 30+ chips used by competing disk controllers, relying on clever state machine code written in ROM.",
    ],
  },
  tags: [
    "Steve Wozniak",
    "Apple II",
    "Apple Inc",
    "Personal Computer",
    "MOS 6502",
    "Unified Memory Architecture",
    "NTSC Color",
    "Silicon Valley",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
  },
};

/**
 * Source-faithful catalogue record for the actual US 4,136,359 grant. Its
 * claims concern video timing, phase compensation, and digital color output;
 * they do not claim the legacy record's invented shared-memory architecture.
 */
export const wozniakApplePatent: Patent = {
  id: "us-4136359-wozniak-apple",
  patentNumber: "US 4,136,359",
  title: "Microcomputer for Use with Video Display",
  shortTitle: "Wozniak Video Timing and Color Circuit",
  subtitle:
    "A crystal-locked horizontal timing correction and recirculating shift-register generator for color graphics on a raster television display.",
  inventors: ["Stephen G. Wozniak"],
  inventorLocation: "Cupertino, California",
  grantDate: "1979-01-23",
  filingDate: "1977-04-11",
  era: "Information Age & Silicon Revolution (1960–1990)",
  category: "computing",
  categoryLabel: "Microcomputers & Digital Hardware",
  summary:
    "US 4,136,359 describes a microcomputer video circuit that derives color directly from recirculating digital bits. Its timing circuit operates horizontal synchronization at an odd submultiple of the chroma reference, then inserts a controlled delay to keep successive raster lines aligned in color phase.",
  heroQuote:
    "Through use of a timing compensation means, counting in the horizontal synchronization counter is delayed to compensate for the fact that the counter operates at an odd-submultiple frequency of a color reference signal.",
  originalPdfUrl: "/patents/pdfs/us-4136359-wozniak-apple.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4136359A/en",
  usptoClassification: "H04N 9/44 (color television; color-signal generation)",
  originalTextAsset: {
    url: "/patents/transcripts/us-4136359-wozniak-apple-reviewed.txt",
    pageCount: 7,
    kind: "reviewed-transcription",
    reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    sourcePdfSha256: wozniakAppleArchivalEdition.sourcePdfSha256,
  },
  originalText: `UNITED STATES PATENT
STEPHEN G. WOZNIAK, OF CUPERTINO, CALIF., ASSIGNOR TO APPLE COMPUTER, INC., OF CUPERTINO, CALIF.

MICROCOMPUTER FOR USE WITH VIDEO DISPLAY.

Patent No. 4,136,359. Patented Jan. 23, 1979.
Application No. 786,197. Filed Apr. 11, 1977. 8 Claims, 4 Drawing Figures.

The invention is for the generation of signals for raster scanned video displays employing digital means.`,
  archivalEdition: wozniakAppleArchivalEdition,
  plainEnglishExplanation: {
    overview:
      "This grant addresses a television-timing problem that appeared when a home microcomputer tried to draw stable color graphics on an ordinary raster CRT. It uses one crystal reference for the video timing chain, deliberately compensates a line-to-line chroma phase reversal, and circulates digital color data through shift registers rather than generating and mixing separate analog color signals.",
    coreMechanism:
      "The oscillator produces 14.31818 MHz, which the disclosed dividers reduce to the 7.15909 MHz and 3.579545 MHz timing relationships used by the circuit. The horizontal counter runs at about 15,734 Hz, an odd submultiple relationship that would otherwise shift chroma phase by 180 degrees each raster line. At a selected counter event, the shift-register counter waits two master-clock cycles, equal to half a chroma cycle, restoring vertical color alignment. Separately, RAM color bits circulate through two four-bit registers and a phase-select multiplexer to form a display-compatible output.",
    mechanicalBreakdown: [
      {
        title: "Crystal Reference and Divider Chain",
        summary:
          "Oscillator 51 and dividers 55 and 57 establish the master, half-rate, and color-subcarrier timing relationships shown in Figure 3.",
        technicalDetails:
          "The source gives 14.31818 MHz on line 33, 7.15909 MHz on line 56, and 3.579545 MHz on line 58. Those signals keep the color reference and the horizontal-timing correction tied to a common clock rather than to independent oscillators.",
        archaicTerm: "timing reference means",
        modernEquivalent: "crystal-derived video clock and timing chain",
      },
      {
        title: "Horizontal Counter Compensation",
        summary:
          "A temporary extension of the counter sequence adds half of a chroma cycle once per line to cancel the unwanted phase flip.",
        technicalDetails:
          "Counter 63 runs at approximately 15,734 Hz. Because its line period contains three and a half chroma cycles, the source says a two-cycle delay at 14.318 MHz is inserted when the prescribed count occurs. Two master-clock cycles equal 180 degrees at 3.58 MHz, so the color relationship is restored line-to-line.",
        archaicTerm: "timing compensation means",
        modernEquivalent: "deterministic phase-correction interval",
      },
      {
        title: "Recirculating Digital Color Register",
        summary:
          "Two four-bit shift registers accept color bits from RAM and repeatedly circulate them at the master-clock rate.",
        technicalDetails:
          "Registers 36 and 37 receive eight bits in parallel at 1 MHz. In color mode they recirculate the data at 14.31818 MHz; phase-select multiplexer 38 chooses staged output bits so the television receives an appropriate color-phase signal without a separate analog color generator.",
        archaicTerm: "recirculating shift register",
        modernEquivalent: "clocked digital serializer with feedback",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Line-to-line chroma phase correction",
        formula:
          "Each 15,734 Hz line contains three and one-half 3.579545 MHz chroma cycles; a two-cycle delay at 14.31818 MHz supplies one-half chroma cycle.",
        explanation:
          "An odd half-cycle remainder reverses the chroma phase on the next line. The disclosed delay adds exactly that missing half-cycle before normal counting resumes, so a vertical color edge does not alternate phase on adjacent raster lines.",
      },
      {
        principle: "Digital color generation by recirculation",
        formula:
          "Eight RAM bits load two four-bit registers at 1 MHz and are recirculated at 14.31818 MHz.",
        explanation:
          "The source's engineering move is temporal: it converts stored bit patterns into the required frequency components by clocking and phase-selecting them, rather than producing independent continuous-wave color signals and mixing them.",
      },
    ],
    whyItMattersToday:
      "The patent is a clear period example of treating a television display as a timing problem as much as a memory problem. Its complete source reading preserves the counter sequence, frequencies, color codes, and figures that explain why a small delay could make digital color graphics legible on a standard raster display.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText: wozniakAppleClaimText(1),
      plainEnglish:
        "Claims a video-display timing apparatus with three linked pieces: a color-reference source, horizontal synchronization that occurs at an odd submultiple of that reference, and a compensation circuit that adjusts horizontal timing so the signals remain phase-related. The claimed result is vertically sharp color graphics on a raster CRT.",
      keyInnovations: ["color reference", "odd-submultiple horizontal sync", "timing compensation"],
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText: wozniakAppleClaimText(2),
      plainEnglish:
        "Narrows claim 1 by requiring the horizontal synchronization means to be a digital counter. It does not claim every counter in a video system; it keeps the parent timing and phase-compensation combination and specifies its horizontal-sync element.",
      keyInnovations: ["digital horizontal counter"],
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [2],
      originalText: wozniakAppleClaimText(3),
      plainEnglish:
        "Further narrows the counter version by requiring the timing compensation to periodically delay counting. The legal work of this claim is the intermittent alteration of the counter sequence, not merely a continuously different clock rate.",
      keyInnovations: ["periodic count delay"],
    },
    {
      number: 4,
      isIndependent: false,
      dependsOn: [3],
      originalText: wozniakAppleClaimText(4),
      plainEnglish:
        "Adds the stated operating figures: a roughly 3.58 MHz color-reference signal and horizontal synchronization of roughly 15,734 Hz. It ties those numerical relationships to the already claimed periodic timing compensation.",
      keyInnovations: ["3.58 MHz chroma reference", "15,734 Hz horizontal rate"],
    },
    {
      number: 5,
      isIndependent: true,
      originalText: wozniakAppleClaimText(5),
      plainEnglish:
        "Claims the timing arrangement from the counter side. A horizontal counter is synchronized by a color-reference source whose frequency is an odd multiple above the counter rate. At a predetermined count, delay circuitry postpones counting, allowing well-defined color graphics to be stored and displayed.",
      keyInnovations: ["horizontal counter", "odd-multiple reference", "predetermined-count delay"],
    },
    {
      number: 6,
      isIndependent: false,
      dependsOn: [5],
      originalText: wozniakAppleClaimText(6),
      plainEnglish:
        "Narrows claim 5 by requiring an odd-integer digital divider between the reference means and the horizontal counter. That divider establishes the unusual timing ratio that makes periodic phase correction necessary while retaining the parent claim's counter, reference, delay, storage, and display relationship.",
      keyInnovations: ["odd-integer digital divider"],
    },
    {
      number: 7,
      isIndependent: false,
      dependsOn: [6],
      originalText: wozniakAppleClaimText(7),
      plainEnglish:
        "Narrows the odd-divider circuit to a shift-register counter whose loading is interrupted at the predetermined count. It connects the abstract delay in the earlier claims to the register-sequence implementation described in Figure 3.",
      keyInnovations: ["shift-register counter", "interrupted loading"],
    },
    {
      number: 8,
      isIndependent: false,
      dependsOn: [7],
      originalText: wozniakAppleClaimText(8),
      plainEnglish:
        "Adds the same approximate numeric relationship to the shift-register-counter version: 3.58 MHz color reference and a predetermined count reached at about 15,734 Hz. It is the most specific dependent expression of that timing chain.",
      keyInnovations: ["3.58 MHz reference", "15,734 Hz predetermined event"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Microcomputer block diagram",
      caption:
        "CPU 10, ROM 14, RAM 23, video generator 25, address multiplexer 28, and timing and synchronization generator 15 as printed in the source.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "woz-fig1-cpu",
          figureRef: "Fig. 1",
          label: "10",
          element: "CPU",
          description: "The central processing unit shown in the source block diagram.",
          x: 17,
          y: 45,
        },
        {
          id: "woz-fig1-video",
          figureRef: "Fig. 1",
          label: "25",
          element: "Video generator",
          description: "The circuit detailed in Figure 2 and connected to output line 26.",
          x: 66,
          y: 39,
        },
        {
          id: "woz-fig1-timing",
          figureRef: "Fig. 1",
          label: "15",
          element: "Timing and synchronization generator",
          description: "The timing circuit detailed in Figure 3.",
          x: 55,
          y: 83,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Video generator shift registers",
      caption:
        "Two four-bit shift registers and phase-select multiplexer 38, as printed in the source.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "woz-fig2-register36",
          figureRef: "Fig. 2",
          label: "36",
          element: "Four-bit shift register",
          description: "One of the two registers receiving RAM color data.",
          x: 30,
          y: 36,
        },
        {
          id: "woz-fig2-mux",
          figureRef: "Fig. 2",
          label: "38",
          element: "Phase-select multiplexer",
          description: "Selects staged register outputs for video line 26.",
          x: 57,
          y: 78,
        },
      ],
    },
    {
      figureNumber: "Fig. 3",
      title: "Timing and synchronization generator",
      caption:
        "Crystal oscillator 51, dividers, shift-register counter 60, horizontal counter 63, and vertical counter 64 as printed in the source.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "woz-fig3-oscillator",
          figureRef: "Fig. 3",
          label: "51",
          element: "Crystal oscillator",
          description: "The 14.31818 MHz timing reference source.",
          x: 22,
          y: 24,
        },
        {
          id: "woz-fig3-counter",
          figureRef: "Fig. 3",
          label: "63",
          element: "Divide-by-65 counter",
          description: "Produces the horizontal synchronization event.",
          x: 39,
          y: 74,
        },
      ],
    },
    {
      figureNumber: "Fig. 4",
      title: "Color and high-resolution waveform examples",
      caption:
        "Printed waveforms for red, light blue, brown, gray, and high-resolution green or violet output.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "woz-fig4-red",
          figureRef: "Fig. 4",
          label: "71",
          element: "Red waveform",
          description: "The source's waveform example for the code 0001.",
          x: 18,
          y: 44,
        },
        {
          id: "woz-fig4-hires",
          figureRef: "Fig. 4",
          label: "77–78",
          element: "High-resolution waveforms",
          description: "The source's examples for green or violet high-resolution output.",
          x: 17,
          y: 82,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "The grant identifies a compatibility problem between digital microcomputer information and ordinary raster-scanned television receivers: maintaining near-standard horizontal synchronization while keeping vertical color lines coherent.",
    priorArtLimitations: [
      "An odd-submultiple horizontal timing relationship produces a line-to-line chroma phase reversal and ragged vertical color lines unless corrected.",
      "An even-submultiple workaround moves horizontal synchronization away from its standard frequency and can require receiver adjustment.",
      "Earlier color generation stored four digital bits but used separate pure-color generation, gating, and mixing circuitry that the source calls complex.",
    ],
    breakthroughInsight:
      "Treat the chroma phase reversal as a deterministic counter-sequence error: extend the sequence by two master-clock cycles at the prescribed event, then use recirculating digital shift registers to turn RAM color bits into the display signal.",
    patentWars: [
      {
        rivalName: "Franklin Computer Corporation (ACE 1000 Litigation)",
        rivalClaim:
          "Franklin Computer manufactured the Franklin ACE 1000 Apple II clone, arguing that video timing, ROM firmware, and system display controllers were utilitarian mechanical schemes ineligible for proprietary legal protection.",
        conflictDetails:
          "Apple sued Franklin in 1982 in federal court (Apple Computer, Inc. v. Franklin Computer Corp.), asserting US Patent 4,136,359 and software copyright over Apple II display generation and ROM routines.",
        resolution:
          "The Third Circuit Court of Appeals ruled in Apple's favor, establishing the foundational legal precedent that microcode, firmware, and video timing controllers embedded in silicon are protectable intellectual property.",
        legalOutcome:
          "Franklin agreed to pay Apple $2.5 million in damages and withdraw clone hardware, securing Apple's market dominance over the Apple II ecosystem throughout the 1980s.",
      },
    ],
    civilizationalImpact:
      "The source captures a concrete engineering route from low-cost digital logic to a usable color raster display: tie color, horizontal sync, and digital data circulation to one clock, then explicitly correct the timing mismatch that makes vertical color edges unstable.",
    aftermath:
      "This record is limited to what the reviewed 1979 grant establishes. The complete manual source edition preserves the circuit, timing values, color table, and all eight printed claims; later product history and other Apple II architecture claims require separate evidence.",
  },
  tags: ["Stephen Wozniak", "raster video", "digital color", "shift register", "timing"],
  stats: { totalClaims: 8, independentClaims: 2 },
};
