import type { Patent } from "@/types/patent";

export const teslaTeleautomatonPatent: Patent = {
  id: "us-613809-tesla-teleautomaton",
  patentNumber: "US 613,809",
  title: "Method of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles",
  shortTitle: "Tesla Teleautomaton Wireless RF Remote-Control Boat",
  subtitle:
    "LC Resonant Antenna Tuning, Coherer RF Demodulation, and Rotary Commutator Logic State Machines",
  inventors: ["Nikola Tesla"],
  inventorLocation: "New York, New York",
  grantDate: "1898-11-08",
  filingDate: "1898-07-01",
  era: "Gilded Age & Grid (1870–1900)",
  category: "telecom",
  categoryLabel: "RF Remote Control & Robotics",
  summary:
    "The birth of wireless remote control, robotics, and drone technology: on November 8, 1898, Nikola Tesla received US Patent No. 613,809 for his radio-controlled teleautomaton boat. In September 1898 at the Electrical Exhibition in Madison Square Garden, Tesla stunned the world by navigating a 6-foot steel submersible boat across an indoor lake purely through wireless electromagnetic radio waves. Radio pulses emitted by a high-voltage spark-gap transmitter were captured by the boat's tuned antenna ($f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$), tripping a sensitive coherer tube that dropped resistance from $100\\text{ k}\\Omega$ to $<100\\,\\Omega$. The current pulse stepped a motorized rotary logic commutator drum (the world's first hardware logic state machine) that independently started the electric propeller, steered the rudder left or right, and switched colored navigation lights.",
  heroQuote:
    "Be it known that I, Nikola Tesla, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Methods of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles...",
  originalPdfUrl: "/patents/pdfs/us-613809-tesla-teleautomaton.pdf",
  googlePatentsUrl: "https://patents.google.com/patent/US613809A/en",
  usptoClassification: "B63H 25/04 (Marine steering / Wireless remote-controlled vessels)",
  originalTextAsset: {
    url: "/patents/source-text/us-613809-tesla-teleautomaton.txt",
    pageCount: 13,
    kind: "source-pdf-text-layer",
  },
  originalText: `UNITED STATES PATENT OFFICE.
NIKOLA TESLA, OF NEW YORK, N. Y.

METHOD OF AND APPARATUS FOR CONTROLLING MECHANISM OF MOVING VESSELS OR VEHICLES.

SPECIFICATION forming part of Letters Patent No. 613,809, dated November 8, 1898.
Application filed July 1, 1898. Serial No. 684,934. (No model.)

To all whom it may concern:
Be it known that I, NIKOLA TESLA, a citizen of the United States, residing at New York, in the County and State of New York, have invented certain new and useful Improvements in Methods of and Apparatus for Controlling Mechanism of Moving Vessels or Vehicles; and I do hereby declare that the following is a full, clear, and exact description of the invention.

The invention which I have described consists in a method of and apparatus for controlling from a distance the operation of the mechanism for propelling and steering a moving vessel or vehicle by means of waves, impulses, or radiations conveyed through the natural media to a receiving apparatus situated on the vessel.

My invention comprises:
First, a transmitting apparatus capable of generating and transmitting through the natural media (such as the air, water, or ground) electromagnetic waves or impulses of predetermined frequency and character.
Second, a receiving conductor or antenna mounted on the vessel, connected to a sensitive electrical detector or coherer adapted to be acted upon by the received waves.
Third, a local relay or circuit-controller actuated by the detector whenever an electromagnetic impulse is received.
Fourth, a multi-position rotary switch or commutator device stepped sequentially by the relay, having contacts so arranged that successive impulses selectively close and open circuits controlling the electric steering-motor, the propulsion-motor, and signalling lights on the vessel.
Fifth, an automatic mechanical tapper or decoherer synchronized with the relay mechanism to restore the detector to its sensitive, non-conducting condition immediately after each impulse is received.`,
  plainEnglishExplanation: {
    overview:
      "When Nikola Tesla demonstrated his wireless boat at Madison Square Garden in 1898, the audience thought it was black magic, telepathy, or a hoax involving a trained monkey hidden inside the hull. In reality, Tesla had created the world's first working robot and the foundation of wireless remote control. By combining resonant radio-frequency circuits, coherer radio detectors, and a rotary stepping logic drum, Tesla proved that machines could be commanded wirelessly across space without wires or physical contact.",
    coreMechanism:
      "The operator stands at an RF control console equipped with a high-voltage spark transmitter, an adjustable induction coil, and a telegraph key. Tapping the key emits a burst of high-frequency electromagnetic waves tuned to a carrier frequency ($f_0 = 150\\text{ kHz}$). The radio waves propagate through the air and strike the boat's vertical brass receiving mast. The induced RF current passes through a tuned inductor-capacitor tank circuit into a coherer tube filled with fine nickel-silver metal filings. The high-frequency electric field breaks down the microscopic oxide films between the metal filings, causing them to fuse ('cohere') and dropping electrical resistance from $100\\text{ k}\\Omega$ down to $50\\,\\Omega$. This sudden surge of current from an onboard 12V lead-acid battery energizes a sensitive electromagnetic relay. The relay trips a solenoid escapement that rotates a multi-track brass commutator drum by one notch ($60^\\circ\\text{ rotation}$). Machined contact tracks on the drum act as a hardware logic state machine: Position 1 engages the steering motor to port; Position 2 returns rudder to center; Position 3 steers to starboard; Position 4 shifts the main DC propeller motor to full speed; and Position 5 toggles incandescent hull lights. After each step, a mechanical eccentric hammer taps the coherer glass, shattering the metal bridges and resetting the tube for the next command.",
    mechanicalBreakdown: [
      {
        title: "Tuned Resonant RF Antenna Tank Circuit",
        summary: "Variable LC receiver circuit filtering specific carrier frequencies.",
        technicalDetails:
          "Consists of a copper wire mast antenna, adjustable variometer induction coil $L = 0.45\\text{ mH}$, and mica capacitor $C = 2.5\\text{ nF}$ with resonant peak $f_0 = \\frac{1}{2\\pi\\sqrt{LC}} = 150\\text{ kHz}$ and quality factor $Q > 35$ to reject electrical noise.",
        archaicTerm: "Receiving-circuit adjusted to resonant frequency",
        modernEquivalent: "Tuned LC RF receiver frontend",
      },
      {
        title: "Nickel-Silver Coherer & Motorized Decoherer Tapper",
        summary: "Radio-wave detector tube with motorized mechanical reset hammer.",
        technicalDetails:
          "Evacuated glass tube containing $80\\%\\text{ Ni} / 20\\%\\text{ Ag}$ filings between polished silver electrodes. Resistance drops from $100\\text{ k}\\Omega$ to $50\\,\\Omega$ within $2\\,\\mu\\text{s}$ of RF excitation; decohered by a motor-driven eccentric cam hammer within $40\\text{ ms}$.",
        archaicTerm: "Sensitive device or coherer with automatic tapper",
        modernEquivalent: "Coherer RF detector & mechanical reset actuator",
      },
      {
        title: "Rotary Commutator Logic Drum State Machine",
        summary: "Step-and-rotate barrel switch sequencing propulsion and steering circuits.",
        technicalDetails:
          "A cylindrical insulating drum fitted with segmented brass contact strips, driven by a ratchet wheel and solenoid pawl through 6 discrete angular states ($60^\\circ\\text{ steps}$), executing a finite state machine without digital processors.",
        archaicTerm: "Rotary circuit-controlling cylinder or commutator",
        modernEquivalent: "Rotary stepping relay / Hardware logic state controller",
      },
      {
        title: "Reversible DC Steering & Propulsion Actuators",
        summary: "Battery-powered DC servomotor and twin-blade marine propulsion drive.",
        technicalDetails:
          "A 24V DC series-wound motor driving a $150\\text{ mm}$ bronze screw propeller through a thrust bearing ($4.5\\text{ knots}$ top speed), paired with a worm-geared steering motor holding rudder angles up to $\\pm 35^\\circ$.",
        archaicTerm: "Steering-motor, rudder-gear, and propelling-motor",
        modernEquivalent: "Electric propulsion motor & rudder servo actuator",
      },
      {
        title: "High-Voltage Spark-Gap Transmitter & Telegraph Key",
        summary:
          "Ground station induction coil and rotary spark discharger generating damped RF bursts.",
        technicalDetails:
          "A Ruhmkorff induction coil powered by a 50V battery bank, stepping voltage up to $>30\\text{ kV}$ across zinc spherical electrodes. A heavy brass telegraph key gates the primary current, discharging a high-Q tuned Leyden jar capacitor tank to radiate high-power damped electromagnetic wave packets (pulse power $>15\\text{ kW}$).",
        archaicTerm: "Transmitting apparatus generating electrical oscillations",
        modernEquivalent: "Spark-gap RF transmitter & pulsed power oscillator",
      },
    ],
    scientificPrinciples: [
      {
        principle: "LC Resonant Frequency & Wave Selectivity",
        formula: "f_0 = \\frac{1}{2\\pi \\sqrt{L C}}, \\quad \\omega_0 L = \\frac{1}{\\omega_0 C}",
        explanation:
          "By tuning the transmitter and receiver inductance $L$ and capacitance $C$ to the same resonant frequency, Tesla achieved selective wave reception, demonstrating the fundamental principle of multi-channel wireless telecommunications.",
      },
      {
        principle: "Coherer RF Micro-Conduction Breakdown",
        formula:
          "R_{\\text{cohered}} \\approx \\frac{R_0}{1 + \\beta |E_{\\text{RF}}|^2}, \\quad 100\\text{ k}\\Omega \\xrightarrow{E_{\\text{RF}} > 10\\text{ V/m}} 50\\,\\Omega",
        explanation:
          "High-frequency radio waves induce microscopic spark breakdowns across the thin oxide coatings on the metallic filings, causing microscopic welding that turns the non-conducting tube into a solid electrical conductor until mechanically tapped.",
      },
      {
        principle: "Sequential Finite State Machine Logic",
        formula: "S_{n+1} = \\delta(S_n, X_{\\text{pulse}}), \\quad Y_n = \\lambda(S_n)",
        explanation:
          "Each received radio pulse $X$ advances the rotary commutator drum from state $S_n$ to state $S_{n+1}$, where output vector $Y_n$ (rudder port, rudder starboard, throttle on, throttle off) is uniquely determined by the contact pattern.",
      },
      {
        principle: "Hertzian Dipole Far-Field Radiation Equation",
        formula:
          "E_{\\theta}(r, t) = \\frac{\\mu_0 \\omega I_0 L}{4\\pi r} \\sin\\theta \\cos\\left(\\omega\\left(t - \\frac{r}{c}\\right)\\right), \\quad P_{\\text{rad}} = \\frac{2\\pi}{3} \\eta_0 \\left(\\frac{I_0 L}{\\lambda}\\right)^2",
        explanation:
          "The transmitter antenna radiates electromagnetic power into space proportional to $(L/\\lambda)^2$, where the electric field propagates across the water surface at the speed of light $c$ to induce displacement current in the vessel mast.",
      },
      {
        principle: "Hydrostatic Submergence & Metacentric Stability",
        formula:
          "GM = \\frac{I_{\\text{waterplane}}}{V_{\\text{disp}}} + KB - KG > 0, \\quad F_{\\text{buoyancy}} = \\rho_{\\text{water}} g V_{\\text{hull}} \\approx m_{\\text{vessel}} g",
        explanation:
          "Tesla designed the vessel with a low freeboard (semi-submersible profile) and heavy low-slung lead-acid battery ballast, maximizing metacentric height $GM$ to stabilize the boat against wave rolling and protect the receiving antenna verticality.",
      },
    ],
    whyItMattersToday:
      "Tesla's US Patent No. 613,809 is the foundational patent for all modern wireless robotics, drone warfare, remote-controlled spacecraft (including Mars rovers), radio telemetry, guided missiles, and IoT wireless automation. In his patent specification, Tesla explicitly predicted that teleautomaton craft would serve as uncrewed military instruments capable of maintaining world peace through mutual deterrence.",
  },
  claims: [
    {
      number: 1,
      isIndependent: true,
      originalText:
        "The method of controlling the mechanism of a moving vessel or vehicle, which consists in producing electromagnetic waves or impulses at a distant station, receiving said waves upon a receiving-circuit on the vessel, and utilizing the energy of the received waves to actuate a sensitive electrical device which in turn controls the operation of the propelling or steering mechanism, substantially as described.",
      plainEnglish:
        "The master wireless remote control claim: transmitting electromagnetic waves to a moving vessel, receiving them on an antenna to actuate a detector, and using the detector to control the vessel's propulsion or steering mechanism.",
      keyInnovations: [
        "Wireless RF remote vehicle control",
        "Tuned receiver antenna circuit",
        "Control of vehicle propulsion and steering via radio waves",
      ],
      legalSignificance:
        "The foundational master patent claim of robotics, wireless control, and uncrewed autonomous systems.",
    },
    {
      number: 2,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In an apparatus for controlling moving vessels, the combination, with a receiving-antenna and a sensitive coherer device, of a local relay energized by the coherer, a rotary commutator stepped by said relay, and circuits controlled by said commutator for operating the steering-gear and propulsion-motor of the vessel.",
      plainEnglish:
        "The rotary stepping logic claim: combining a coherer receiver with a stepping rotary commutator drum that translates sequential radio pulses into discrete vehicle steering and motor commands.",
      keyInnovations: [
        "Rotary stepping logic state machine",
        "Multi-function single-channel command multiplexing",
        "Relay-actuated motor switching",
      ],
      legalSignificance:
        "Protected the electro-mechanical logic decoder that enabled multi-function control over a single radio frequency carrier.",
    },
    {
      number: 3,
      isIndependent: false,
      dependsOn: [1],
      originalText:
        "In a radio-controlled vessel, the combination, with the coherer, of an automatic tapper or decoherer operated synchronously with the stepping mechanism to restore the coherer to its high-resistance non-conducting state immediately after the reception of each control impulse.",
      plainEnglish:
        "The synchronized decoherer claim: an automatic mechanical hammer that taps the coherer tube immediately after each pulse to reset it for the next radio command.",
      keyInnovations: [
        "Synchronized automatic decohering",
        "Rapid detector reset cycle",
        "Continuous command reception reliability",
      ],
      legalSignificance:
        "Protected the mechanical reset architecture necessary for continuous radio control.",
    },
  ],
  drawings: [
    {
      figureNumber: "Fig. 1",
      title: "Tesla Teleautomaton Boat Layout & Control Schematic",
      caption:
        "Top plan and longitudinal section of Nikola Tesla's 6-foot radio-controlled submersible boat showing antenna mast, coherer detector, stepping commutator drum, storage battery, and electric propulsion motor.",
      svgType: "tesla-teleautomaton",
      callouts: [
        {
          id: "tt-1",
          figureRef: "Fig. 1",
          label: "A",
          element: "Vertical Receiving Mast Antenna",
          description: "Brass antenna capturing 150 kHz electromagnetic carrier waves.",
          x: 48,
          y: 22,
        },
        {
          id: "tt-2",
          figureRef: "Fig. 1",
          label: "B",
          element: "Nickel-Silver Coherer Detector",
          description: "Evacuated glass tube dropping to 50 ohms when excited by RF energy.",
          x: 42,
          y: 45,
        },
        {
          id: "tt-3",
          figureRef: "Fig. 1",
          label: "C",
          element: "Rotary Logic Commutator Drum",
          description: "6-position stepping barrel switch decoding commands into motor states.",
          x: 58,
          y: 50,
        },
        {
          id: "tt-4",
          figureRef: "Fig. 1",
          label: "D",
          element: "Electric Propulsion DC Motor",
          description: "24V battery-powered motor driving bronze screw propeller.",
          x: 75,
          y: 52,
        },
        {
          id: "tt-5",
          figureRef: "Fig. 1",
          label: "E",
          element: "Worm-Geared Rudder Servomotor",
          description: "Reversible steering actuator positioning balanced marine rudder.",
          x: 88,
          y: 52,
        },
      ],
    },
  ],
  historicalContext: {
    problemStatement:
      "In 1898, during the Spanish-American War, naval vessels fought using fixed-trajectory torpedoes that traveled in straight lines and frequently missed moving targets. Nikola Tesla saw that uncrewed craft could be guided with pinpoint accuracy if commanded through the air by electromagnetic waves. Beyond naval warfare, Tesla envisioned an entirely new class of machines—'telautomatics'—that would execute complex human commands at a distance without physical wires.",
    priorArtLimitations: [
      "The Whitehead naval torpedo was unguided after launch, drifting off target with ocean currents.",
      "The Sims-Edison steerable torpedo required an unwieldy 2-mile insulated copper cable trailing behind it in the water, which constantly snagged and snapped.",
      "Guglielmo Marconi's early 1896 radio experiments were limited to Morse code signaling, with no concept of mechanical remote machine control or multi-channel tuning.",
    ],
    breakthroughInsight:
      "Tesla realized that radio waves were not merely tools for sending dots and dashes to human telegraphers—they could transmit **actionable mechanical intelligence** directly into the logic circuitry of a machine, creating autonomous and remotely directed robots.",
    patentWars: [
      {
        rivalName: "Guglielmo Marconi and the Marconi Wireless Telegraph Company",
        rivalClaim:
          "Marconi claimed prior discovery of wireless transmission and patented a simple radio receiver in 1896.",
        conflictDetails:
          "Tesla challenged Marconi's patents, pointing out that Marconi used Tesla's 4-tuned-circuit architecture (US Patent 645,576 and 649,621) and that Tesla's 1898 teleautomaton was far more advanced than Marconi's primitive sparks.",
        resolution:
          "In 1943, the United States Supreme Court (*Marconi Wireless Telegraph Co. of America v. United States*, 320 U.S. 1) officially ruled that Nikola Tesla was the true original inventor of radio, invalidating Marconi's fundamental radio claims.",
        legalOutcome:
          "Tesla's radio and remote control patents were permanently recognized as the foundational legal origin of wireless communications and radio technology.",
      },
    ],
    civilizationalImpact:
      "Tesla's 1898 demonstration was the dawn of uncrewed autonomous systems. Today, every radio-controlled drone, Mars exploration rover (Curiosity, Perseverance), satellite ground control network, garage door opener, Wi-Fi device, and guided aerospace defense system traces its lineage directly back to Tesla's US Patent No. 613,809.",
    funFact:
      "When a skeptical reporter at Madison Square Garden asked Tesla if his radio-controlled boat could be made to carry dynamite into an enemy harbor underwater, Tesla passionately replied: 'You do not see there a wireless torpedo; you see there the first of a race of robots, mechanical men which will do the laborious work of the human race!'",
    aftermath:
      "Tesla tried to sell his radio-guided torpedo system to the US Navy, but military officials at the time could not comprehend wireless technology. Tesla went on to construct his legendary Wardenclyffe Tower in Shoreham, Long Island, seeking to create a worldwide wireless power and communications grid.",
    sideNotes: [
      "Tesla patented logic gates and 'AND' circuit coincidence detectors in 1900 (US Patent 723,188 and 725,605) to ensure his boat would only respond when two radio frequencies were received simultaneously, inventing spread-spectrum frequency security.",
      "The term 'robot' was not coined until 1920 (by Czech playwright Karel Čapek in *R.U.R.*), so Tesla used the word 'teleautomaton' (Greek *tele* for far, and *automaton* for self-acting).",
    ],
  },
  tags: [
    "Nikola Tesla",
    "Teleautomaton",
    "Radio Control",
    "Robotics",
    "Drone Technology",
    "Coherer",
    "Resonant Circuits",
    "Gilded Age",
    "Madison Square Garden",
  ],
  stats: {
    totalClaims: 3,
    independentClaims: 1,
    patentWarYears: "1898–1943",
    impactScore: 100,
  },
};
