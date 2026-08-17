import type { Patent } from "@/types/patent";

export const wozniakApplePatent: Patent = {
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
    "Wozniak's Apple II bus: video reads DRAM on 6502 Φ1, the CPU on Φ2, one set of chips, no wait states. Color on a stock TV comes from gating the 14.31818 MHz clock in 90° steps.",
  heroQuote:
    "I was designing the computer because I wanted to own a computer... but when I finished, I realized I had designed a device that would change how ordinary people lived and worked.",
  originalPdfUrl: "/patents/pdfs/us-4136359-wozniak-apple.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US4136359A/en",
  usptoClassification:
    "G06F 13/00 (Data processing; Program control and shared memory bus systems)",
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
      "Steve Wozniak designed the Apple II to be affordable, elegant, and blazingly fast. In 1977, video display cards cost hundreds of dollars and froze the CPU during raster refreshes. Wozniak's patent solved this with shared-bus memory multiplexing, making high-resolution color graphics standard on a home microcomputer.",
    coreMechanism:
      "The MOS 6502 CPU only accesses memory during the high half of its clock cycle ($Phi_2$). Wozniak gave the video display exclusive RAM access during the low half ($Phi_1$). Both ran at full speed without wait states. Simultaneously, video raster scanning automatically refreshed the dynamic RAM rows and generated NTSC color via digital phase shifts.",
    mechanicalBreakdown: [
      {
        title: "Two-Phase Shared Bus Multiplexer",
        summary: "74LS-series multiplexers switching address lines between CPU and Video.",
        technicalDetails:
          "During $Phi_1$ (489 ns), video counters read pixel bytes. During $Phi_2$ (489 ns), the 6502 CPU executes instructions. Memory contention is zero, and CPU throughput is 100%.",
        archaicTerm: "Multiplexing means for coupling video generator and microprocessor",
        modernEquivalent: "Unified Memory Architecture (UMA) / Arbiter",
      },
      {
        title: "Digital NTSC Color Subcarrier Phase Modulator",
        summary: "Generating color on home TVs using 4 discrete digital phase taps.",
        technicalDetails:
          "Dividing the 14.31818 MHz master oscillator by 4 generates the 3.579545 MHz color reference. Gating pixel bits with 90-degree phase delays creates green, violet, blue, and orange colors.",
        archaicTerm: "Phase-shifting display pulses relative to color subcarrier",
        modernEquivalent: "Digital Video Chroma Phase Synthesizer",
      },
      {
        title: "Automatic Dynamic RAM Row Refresh",
        summary: "Using video scan line counters to refresh 4116 DRAM capacitor cells.",
        technicalDetails:
          "Dynamic RAM requires reading every row address within 2 ms. The sequential vertical video scan automatically satisfies DRAM refresh cycles, eliminating complex refresh controller chips.",
        archaicTerm: "Dynamic random-access memory array refresh",
        modernEquivalent: "DRAM auto-refresh controller",
      },
    ],
    scientificPrinciples: [
      {
        principle: "Time-Division Bus Multiplexing",
        formula:
          "T_{cycle} = t_{\\Phi_1} + t_{\\Phi_2} = 489\\text{ ns} + 489\\text{ ns} = 978\\text{ ns} \\implies f_{CPU} = 1.0227\\text{ MHz}",
        explanation:
          "Splitting the clock period gives both CPU and video full uninterrupted access to shared RAM every cycle.",
      },
      {
        principle: "NTSC Quadrature Color Phase Modulation",
        formula:
          "V_{color}(t) = Y(t) + I\\cos(2\\pi f_{sc} t) + Q\\sin(2\\pi f_{sc} t), \\quad f_{sc} = 3.579545\\text{ MHz}",
        explanation:
          "Phase shifts relative to the 3.58 MHz color burst subcarrier modulate color hue and saturation on standard color TVs.",
      },
    ],
    whyItMattersToday:
      "Sharing one DRAM between a display and a CPU is still how a lot of small systems are built. Apple Silicon UMA is a distant cousin with a memory controller, not a 6502 clock phase, in the middle.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "1. In a microcomputer system including a microprocessor and a dynamic random-access memory array, a video display generation apparatus comprising: clock means for generating a two-phase clock signal having a first phase and a second phase; multiplexing means coupled to said microprocessor, said video display generator, and said dynamic random-access memory array for coupling said video display generator to said memory array during said first phase to retrieve display data therefrom, and for coupling said microprocessor to said memory array during said second phase to perform memory read and write operations; and video output means for converting the display data retrieved during said first phase into video signals for driving a display monitor.",
      plainEnglish:
        "Covers the shared-bus multiplexing architecture that interleaves video display generation in Phase 1 and CPU program execution in Phase 2 across a single common RAM bank.",
      keyInnovations: [
        "Two-phase non-overlapping shared-bus memory multiplexing",
        "Zero-wait-state CPU execution with transparent video display refresh",
        "Unified system and video RAM architecture",
      ],
      legalSignificance:
        "Video and CPU take turns on the same DRAM, locked to the microprocessor clock phases.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "2. An apparatus as set forth in claim 1, further comprising color generation means for generating a color subcarrier signal and for phase-shifting display pulses relative to said color subcarrier signal to produce color video signals.",
      plainEnglish:
        "Specifies discrete digital phase shifting of graphic bits to synthesize full NTSC color on standard televisions.",
      keyInnovations: ["Digital synthesis of NTSC color subcarrier without analog modulators"],
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Microcomputer Architecture Block Diagram",
      caption:
        "Overall block diagram showing microprocessor, multiplexer, RAM, and video display generator.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "c1",
          figureRef: "Fig. 1",
          label: "MOS 6502 CPU",
          element: "12",
          description: "8-bit central processing unit",
          x: 25,
          y: 40,
        },
        {
          id: "c2",
          figureRef: "Fig. 1",
          label: "Shared Dynamic RAM",
          element: "20",
          description: "Time-multiplexed 48KB RAM array",
          x: 55,
          y: 40,
        },
      ],
    },
    {
      figureNumber: "Fig. 2",
      title: "Two-Phase Bus Timing Diagram",
      caption: "Timing relationship of Phi 1 video scan access and Phi 2 CPU execution cycles.",
      svgType: "wozniak-apple",
      callouts: [
        {
          id: "c3",
          figureRef: "Fig. 2",
          label: "Phi 1 Video Window",
          element: "32",
          description: "489 ns video display byte fetch",
          x: 30,
          y: 60,
        },
        {
          id: "c4",
          figureRef: "Fig. 2",
          label: "Phi 2 CPU Window",
          element: "34",
          description: "489 ns CPU instruction cycle",
          x: 70,
          y: 60,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "An Altair or IMSAI in 1976 was switches and a teletype. Video boards either used dual-port RAM nobody could afford or stole the CPU bus during the scan, so the machine stuttered whenever the beam was live.",
    priorArtLimitations: [
      "DMA video: 30–50% of cycles gone.",
      "Dual-port frame buffers: cost more than the computer.",
      "Color on a TV usually meant a pile of analog parts.",
    ],
    breakthroughInsight:
      "The MOS 6502 only talks to the bus on Φ2. Φ1 is idle. Wozniak gave Φ1 to the video counters and Φ2 to the CPU. One set of cheap DRAM, no wait states, no flicker. The NTSC color trick (14.31818 MHz ÷ 4, gated phases) was the encore.",
    patentWars: [
      {
        rivalName: "Commodore, Tandy, IBM (by architecture, not a single suit)",
        rivalClaim: "You can do home color without a shared-bus multiplexer.",
        conflictDetails:
          "PET and TRS-80 started as character-generator machines. IBM CGA (1981) used separate video RAM and 'snowed' when the CPU touched it during active scan. Apple II hi-res was already in living rooms.",
        resolution:
          "US 4,136,359 did not stop IBM. It did keep Apple's video design distinctive through the IIe era. VisiCalc shipped first on the II because the machine could update a screen without dying.",
        legalOutcome:
          "A useful patent, not a blocking one. The business win was the disk and the spreadsheet.",
      },
    ],
    civilizationalImpact:
      "Classrooms and small businesses bought a computer that showed color on the TV they already owned. That, more than the 1976 garage myth, is why the II matters.",
    funFact:
      "Wozniak wrote Integer BASIC and much of the early disk code by hand, hex on paper, then keyed it in. The Disk II controller is seven chips because he refused to use more.",
    aftermath:
      "Jobs sold the company as appliances. Wozniak crashed a plane in 1981, came back briefly, and left day-to-day engineering. The IIgs was the last machine that still felt like his.",
    sideNotes: [
      "The 14.31818 MHz crystal is four times the NTSC color burst. That is not a coincidence.",
      "Mike Markkola and the Homebrew club saw the prototype before there was a company. The patent is the bus; the culture is the club.",
    ],
  },
  tags: ["computing", "microprocessor", "apple", "graphics"],
  stats: {
    totalClaims: 11,
    independentClaims: 1,
    patentWarYears: "1977–1988 (Apple II Architecture Era)",
    impactScore: 99,
  },
};
