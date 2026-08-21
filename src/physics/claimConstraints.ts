/**
 * claimConstraints.ts
 *
 * Interactive Patent Claim Inversion & Prior-Art Failure Mode Engine.
 * Modifies the FrankenSim mechanical/electrical constraint matrix when a
 * claim is toggled off, demonstrating the exact historical failure mode
 * that the patent overcame.
 */

export interface ClaimConstraintDefinition {
  claimNumber: number;
  patentId: string;
  claimTitle: string;
  activeDescription: string;
  invertedDescription: string;
  failureModeName: string;
  historicalPriorArt: string;
}

export const CATALOG_CLAIM_CONSTRAINTS: Record<string, ClaimConstraintDefinition[]> = {
  "us-821393-wright-flyer": [
    {
      claimNumber: 1,
      patentId: "us-821393-wright-flyer",
      claimTitle: "Coordinated Rudder & Wing-Warp Linkage",
      activeDescription:
        "Claim 1 links the vertical rudder to the wing-warping cradle to cancel adverse yaw.",
      invertedDescription:
        "Uncoupled rudder: differential wing warping produces adverse yaw, rolling opposite to turn.",
      failureModeName: "Adverse Yaw Stalling Spin",
      historicalPriorArt:
        "Lilienthal & Langley treated control as inherent stability or pure weight-shifting.",
    },
  ],
  "us-381968-tesla-motor": [
    {
      claimNumber: 1,
      patentId: "us-381968-tesla-motor",
      claimTitle: "Independent Alternating-Current Motor Circuits",
      activeDescription:
        "Claim 1 combines separate or independent motor circuits with independently connected induced circuits in an alternating-current generator, so generator rotation progressively shifts the motor poles.",
      invertedDescription:
        "Without the claimed corresponding independent circuits, the source-specific progressive shifting of the motor poles is not established; no torque, speed, heating, or rotor-performance result is inferred.",
      failureModeName: "Progressive Magnetic-Shift Condition Not Established",
      historicalPriorArt:
        "Tesla contrasts the arrangement with mechanically commutated direct-current systems: the motor needs no commutator, while Fig. 9 uses the alternating-current generator's insulated contact or collector rings and brushes to form the corresponding circuits.",
    },
  ],
  "us-223898-edison-lamp": [
    {
      claimNumber: 1,
      patentId: "us-223898-edison-lamp",
      claimTitle: "High-Vacuum Enclosure (10⁻⁴ Torr)",
      activeDescription:
        "Claim 1 encloses the high-resistance carbon filament in an all-glass hermetic vacuum.",
      invertedDescription:
        "Atmospheric air intrusion: oxygen causes instantaneous carbon filament oxidation and burnout.",
      failureModeName: "Filament Thermal Oxidation Burnout",
      historicalPriorArt:
        "Previous low-vacuum lamps burned out within minutes due to gas convection and oxidation.",
    },
  ],
  "us-174465-bell-telephone": [
    {
      claimNumber: 1,
      patentId: "us-174465-bell-telephone",
      claimTitle: "Continuous Undulatory Wave Transmission",
      activeDescription:
        "Claim 1 transmits vocal sounds by generating continuous undulatory electrical currents proportional to acoustic air vibrations.",
      invertedDescription:
        "Intermittent make-and-break pulses: harmonic telegraph currents clip acoustic waveforms into unintelligible clicks.",
      failureModeName: "Pulse-Clipping Acoustic Intelligibility Loss",
      historicalPriorArt:
        "Reis and Bourseul attempted speech transmission using rapid intermittent on/off circuit breakers.",
    },
  ],
  "us-135245-pasteur-fermentation": [
    {
      claimNumber: 1,
      patentId: "us-135245-pasteur-fermentation",
      claimTitle: "Air Expulsion Followed by Cooling",
      activeDescription:
        "Claim 1 subjects the wort to air expulsion and then cools it substantially by the disclosed closed-vessel gas-sweep and exterior water-spray process.",
      invertedDescription:
        "Removing either operation breaks the claimed combination: ordinary-air exposure remains if the sweep is omitted, while the disclosed process is incomplete if exterior cooling is omitted.",
      failureModeName: "Claimed Two-Operation Process Incomplete",
      historicalPriorArt:
        "Pasteur describes the prior brewing practice as exposing wort to atmospheric air during the process, which he says impaired quality and reduced output.",
    },
  ],
  "us-1773980-farnsworth-tv": [
    {
      claimNumber: 1,
      patentId: "us-1773980-farnsworth-tv",
      claimTitle: "Continuous Optical-to-Electronic Image Dissection",
      activeDescription:
        "Claim 1 scans a continuous electronic charge image across an aperture without mechanical spinning discs.",
      invertedDescription:
        "Mechanical Nipkow disc: scanning speed is limited by inertia, producing low resolution and severe motion blur.",
      failureModeName: "Mechanical Disc Line Tearing & Frame Desync",
      historicalPriorArt:
        "Baird and Jenkins used spinning mechanical aperture discs limited to 30–60 lines.",
    },
  ],
  "us-1781541-einstein-refrigerator": [
    {
      claimNumber: 1,
      patentId: "us-1781541-einstein-refrigerator",
      claimTitle: "Single-Pressure Inert Gas Absorption Cycle",
      activeDescription:
        "Claim 1 circulates butane, ammonia, and hydrogen at uniform total pressure without mechanical pumps or shaft seals.",
      invertedDescription:
        "Mechanical shaft pump: moving piston seals degrade over time, leaking toxic sulfur dioxide or methyl chloride refrigerant.",
      failureModeName: "Shaft-Seal Refrigerant Leakage",
      historicalPriorArt:
        "Early domestic compressor refrigerators caused fatal toxic gas poisonings due to worn shaft packings.",
    },
  ],

  "us-2524035-bardeen-transistor": [
    {
      claimNumber: 1,
      patentId: "us-2524035-bardeen-transistor",
      claimTitle: "Minority Carrier Injection Point Contacts",
      activeDescription:
        "Claim 1 places emitter and collector contacts within minority carrier diffusion length on germanium crystal.",
      invertedDescription:
        "Excessive contact spacing: injected holes recombine before reaching collector, reducing current gain to zero.",
      failureModeName: "Recombination Gain Quenching",
      historicalPriorArt:
        "Vacuum tube triodes required high filament heating power and bulky glass envelopes.",
    },
  ],
  "us-3138743-kilby-integrated-circuit": [
    {
      claimNumber: 1,
      patentId: "us-3138743-kilby-integrated-circuit",
      claimTitle: "Monolithic Semiconductor Body Integration",
      activeDescription:
        "Claim 1 integrates active transistors, bulk resistors, and PN junction capacitors within a single semiconductor bar.",
      invertedDescription:
        "Discrete wired components: interconnections suffer from high solder joint failure rates and parasitics.",
      failureModeName: "Tyranny of Numbers Interconnect Failure",
      historicalPriorArt:
        "Complex electronics required thousands of hand-soldered discrete components with prohibitive failure rates.",
    },
  ],
  "us-3541541-engelbart-mouse": [
    {
      claimNumber: 1,
      patentId: "us-3541541-engelbart-mouse",
      claimTitle: "Orthogonal Dual-Wheel 2D Coordinate Resolution",
      activeDescription:
        "Claim 1 resolves XY position independently using two mutually perpendicular rolling wheels contacting potentiometers.",
      invertedDescription:
        "Single-axis trackball slippage: mechanical skew introduces cross-axis coupling error during cursor positioning.",
      failureModeName: "Cross-Axis Positional Drift",
      historicalPriorArt:
        "Light pens and trackballs were ergonomically tiring and required complex analog tracking electronics.",
    },
  ],
  "us-4136359-wozniak-apple": [
    {
      claimNumber: 1,
      patentId: "us-4136359-wozniak-apple",
      claimTitle: "Multiplexed Dynamic RAM Video Display Timing",
      activeDescription:
        "Claim 1 interleaves CPU and video display RAM access on alternate clock phases, eliminating display snow without wait states.",
      invertedDescription:
        "Asynchronous memory contention: CPU and video generator collide on shared RAM bus, causing visible screen snow and bus stalls.",
      failureModeName: "Video Bus Contention Screen Snow",
      historicalPriorArt:
        "Prior microcomputers used separate expensive dual-port video RAM or suffered visible display flicker.",
    },
  ],
  "us-6120588-eink": [
    {
      claimNumber: 1,
      patentId: "us-6120588-eink",
      claimTitle: "Bistable Microencapsulated Electrophoretic Display",
      activeDescription:
        "Claim 1 suspends charged titanium dioxide particles in microcapsules that remain stable in position with zero holding power.",
      invertedDescription:
        "Continuous-power LCD: liquid crystals relax without continuous electric field refresh, consuming high battery power.",
      failureModeName: "Static Holding Power Drain",
      historicalPriorArt:
        "Emissive and LCD displays required continuous power and struggled with sunlight readability.",
    },
  ],
  "us-6285999-pagerank": [
    {
      claimNumber: 1,
      patentId: "us-6285999-pagerank",
      claimTitle: "Ergodic Random Surfer Link Graph Weighting",
      activeDescription:
        "Claim 1 models hyperlinked document importance through stationary probability distribution with random teleportation damping.",
      invertedDescription:
        "Pure keyword density matching: search indices are easily manipulated by hidden keyword spamming and link farms.",
      failureModeName: "Keyword-Stuffing Relevance Inversion",
      historicalPriorArt:
        "Early web search engines ranked pages solely by on-page word frequency and meta tags.",
    },
  ],
  "us-6331181-davinci": [
    {
      claimNumber: 1,
      patentId: "us-6331181-davinci",
      claimTitle: "Tele-Robotic Master-Slave Surgical Wrist Articulation",
      activeDescription:
        "Claim 1 maps surgeon master console hand motions through tendon-driven 7-DOF articulating wrist end-effectors.",
      invertedDescription:
        "Rigid laparoscopic shaft: rigid tool lacks internal wrist degrees of freedom, restricting dexterity in deep surgical cavities.",
      failureModeName: "Fulcrum-Effect Dexterity Lock",
      historicalPriorArt:
        "Standard laparoscopy reversed surgeon hand motions over a fixed port fulcrum with only 4 degrees of freedom.",
    },
  ],
  "us-6594844-roomba": [
    {
      claimNumber: 1,
      patentId: "us-6594844-roomba",
      claimTitle: "Autonomous Multi-Mode Coverage & Obstacle Escape",
      activeDescription:
        "Claim 1 switches deterministically between spiral, wall-following, and bounce modes upon mechanical bumper contact.",
      invertedDescription:
        "Linear dead-reckoning: vacuum gets trapped in room corners or furniture legs indefinitely.",
      failureModeName: "Corner Entrapment & Battery Depletion",
      historicalPriorArt:
        "Industrial robotic cleaners required complex laser positioning beacons or magnetic floor tape.",
    },
  ],
  "us-7479949-multitouch": [
    {
      claimNumber: 1,
      patentId: "us-7479949-multitouch",
      claimTitle: "Mutual Capacitance Multi-Point Touch Processing",
      activeDescription:
        "Claim 1 detects multiple distinct concurrent touch nodes on a transparent mutual-capacitance grid without ghosting.",
      invertedDescription:
        "Resistive single-touch membrane: dual touch points calculate ambiguous geometric centroid, creating false touch triggers.",
      failureModeName: "Centroid Ghost-Touch Ambiguity",
      historicalPriorArt:
        "Resistive touch screens could track only a single contact point with heavy stylus pressure.",
    },
  ],
  "us-4750-howe-sewing-machine": [
    {
      claimNumber: 1,
      patentId: "us-4750-howe-sewing-machine",
      claimTitle: "Synchronized Eye-Pointed Needle & Shuttle Interlock",
      activeDescription:
        "Claim 1 coordinates the eye-pointed needle dwell with the oscillating shuttle pass.",
      invertedDescription:
        "Desynchronized shuttle pass: shuttle misses the thread loop, jamming the mechanical feed dog.",
      failureModeName: "Shuttle Collision & Thread Jam",
      historicalPriorArt:
        "Hand-sewing needles passed entirely through the fabric, making continuous mechanical feeding impossible.",
    },
  ],
  "us-2708656-fermi-reactor": [
    {
      claimNumber: 1,
      patentId: "us-2708656-fermi-reactor",
      claimTitle: "Delayed Neutron Controlled Criticality Margin",
      activeDescription:
        "Claim 1 maintains operating reactivity within the delayed neutron fraction (k_eff <= 1 + beta).",
      invertedDescription:
        "Prompt supercriticality: reactivity exceeds delayed neutron fraction, causing prompt power divergence.",
      failureModeName: "Prompt Critical Power Excursion",
      historicalPriorArt:
        "Pre-reactor calculations lacked verified 6-group delayed neutron precursor kinetics.",
    },
  ],
  "us-2981877-noyce-ic": [
    {
      claimNumber: 1,
      patentId: "us-2981877-noyce-ic",
      claimTitle: "Adherent Passivating Oxide & Thin-Film Interconnects",
      activeDescription:
        "Claim 1 forms adherent SiO₂ insulating layers with vapor-deposited aluminum leads crossing PN junctions.",
      invertedDescription:
        "Unpassivated flying wire bonds: fragile gold whiskers create parasitic inductance and risk junction shorts.",
      failureModeName: "Flying Wire Bond Parasitic Short",
      historicalPriorArt:
        "Kilby's initial 1958 IC required manual gold wire bonding between mesa-isolated semiconductor devices.",
    },
  ],
  "us-3633-goodyear-rubber": [
    {
      claimNumber: 1,
      patentId: "us-3633-goodyear-rubber",
      claimTitle: "Thermal Sulfur Vulcanization Crosslinking",
      activeDescription:
        "Claim 1 crosslinks polyisoprene polymer chains with sulfur bridges under heat and pressure.",
      invertedDescription:
        "Raw unvulcanized gum: polymer chains slip plastically, melting into sticky tar above 35°C and shattering when cold.",
      failureModeName: "Thermoplastic Melt & Creep Rupture",
      historicalPriorArt:
        "Raw natural caoutchouc softened in summer heat and turned brittle and fragile in winter frosts.",
    },
  ],
  "us-3671542-kwolek-kevlar": [
    {
      claimNumber: 1,
      patentId: "us-3671542-kwolek-kevlar",
      claimTitle: "Liquid-Crystalline PPTA Anisotropic Spin Dope",
      activeDescription:
        "Claim 1 spins extended-chain poly(p-phenylene terephthalamide) nematic dopes into ultra-high-modulus aligned fibers.",
      invertedDescription:
        "Isotropic random coils: unaligned polymer chains fold into spherulites with 90% lower tensile strength and low modulus.",
      failureModeName: "Isotropic Spherulitic Yield & Tensile Sag",
      historicalPriorArt:
        "Conventional melt-spun aliphatic polyamides (nylon 6,6) exhibited flexible chain folding and moderate tensile strength.",
    },
  ],
  "us-1102653-goddard-rocket": [
    {
      claimNumber: 1,
      patentId: "us-1102653-goddard-rocket",
      claimTitle: "Step-Down Multi-Stage Chamber Jettisoning",
      activeDescription:
        "Claim 1 combines successive combustion chambers, jettisoning spent primary casings to maximize final velocity.",
      invertedDescription:
        "Single-stage deadweight: carrying empty combustion chamber mass to apogee slashes mass ratio ln(m₀/mf).",
      failureModeName: "Single-Stage Deadweight Apogee Ceiling",
      historicalPriorArt:
        "Nineteenth-century gunpowder black powder rockets carried all structural casings throughout the trajectory.",
    },
  ],
  "us-400766-hall-aluminium": [
    {
      claimNumber: 1,
      patentId: "us-400766-hall-aluminium",
      claimTitle: "Cryolite Electrolytic Bath Reduction",
      activeDescription:
        "Claim 1 dissolves alumina in molten cryolite at 960°C, passing continuous current through carbon anodes.",
      invertedDescription:
        "Direct thermal reduction: unfluxed Al₂O₃ requires 2072°C and carbon yields refractory aluminum carbide.",
      failureModeName: "Refractory Carbide Solidification",
      historicalPriorArt:
        "Deville's chemical sodium reduction of aluminum chloride cost $12/pound before Hall's electrolytic bath.",
    },
  ],
  "us-542846-diesel-engine": [],
  "us-608969-parsons-turbine": [
    {
      claimNumber: 1,
      patentId: "us-608969-parsons-turbine",
      claimTitle: "Multi-Stage Compound Pressure & Velocity Expansion",
      activeDescription:
        "Claim 1 drops steam pressure across successive fixed and rotating blade rings, keeping blade peripheral speed near optimal velocity ratio.",
      invertedDescription:
        "Single-stage de Laval nozzle: full boiler pressure drops in one expansion, producing Mach 3 steam jet requiring destructive wheel RPM.",
      failureModeName: "Supersonic Shock Choking & Centrifugal Rotor Rupture",
      historicalPriorArt:
        "De Laval single-wheel impulse turbines ran at destructive 30,000 RPM, requiring complex reducing gears.",
    },
  ],
  "us-1647-morse-telegraph": [
    {
      claimNumber: 1,
      patentId: "us-1647-morse-telegraph",
      claimTitle: "Local Electromagnetic Relay & Recording Circuit",
      activeDescription:
        "Claim 1 uses line current to trip sensitive local relays that switch high-current local batteries to drive the recording stylus.",
      invertedDescription:
        "Direct line drive without relays: Ohmic line resistance over long distance starves sounder electromagnet below mechanical trip threshold.",
      failureModeName: "Long-Distance Line Attenuation & Signal Erasure",
      historicalPriorArt:
        "Previous electrostatic and magnetic needle telegraphs failed beyond a few miles due to Ohmic voltage drop.",
    },
  ],
  "us-x9430-colt-revolver": [
    {
      claimNumber: 1,
      patentId: "us-x9430-colt-revolver",
      claimTitle: "Mechanical Lifter Hand Pawl & Ratchet Indexing",
      activeDescription:
        "Claim 1 indexes the cylinder exactly one chamber pitch (72°) as the hammer is cocked, locking positive chamber-to-bore alignment.",
      invertedDescription:
        "Manual cylinder indexing: shooter must rotate cylinder by hand between shots, causing out-of-battery bore misalignment and chamber shaving.",
      failureModeName: "Manual Cylinder Misalignment & Lead Shaving",
      historicalPriorArt:
        "Collier and Pepperbox revolvers required manual hand rotation, leading to frequent off-center strikes and misaligned bore discharge.",
    },
    {
      claimNumber: 2,
      patentId: "us-x9430-colt-revolver",
      claimTitle: "Radial Flash-Isolating Partition Walls Between Nipples",
      activeDescription:
        "Claim 2 interposes solid steel partition walls between percussion nipples to prevent cap flashover.",
      invertedDescription:
        "Unshielded shared nipple wells: ignition flame from fired percussion cap enters adjacent chambers, causing simultaneous catastrophic multi-cylinder discharge.",
      failureModeName: "Catastrophic Multi-Chamber Chain Fire",
      historicalPriorArt:
        "Early multi-chamber pistols suffered frequent chain fires that ruptured cylinders and injured shooters' hands.",
    },
  ],
  "us-124404-westinghouse-air-brake": [
    {
      claimNumber: 1,
      patentId: "us-124404-westinghouse-air-brake",
      claimTitle: "Automatic Double-Pipe Signal Line & Reservoir Supply",
      activeDescription:
        "Claim 1 maintains continuous reservoir line pressure while using a secondary signal line to automatically apply brakes if train parts.",
      invertedDescription:
        "Straight direct-air single pipe: parting of train hose vents air to atmosphere, completely disabling all brakes when needed most.",
      failureModeName: "Train Parting Catastrophic Brake Failure",
      historicalPriorArt:
        "Straight-air brakes required continuous line pressure to apply shoes; any hose rupture left train runaway.",
    },
  ],
  "us-808897-carrier-air-conditioner": [
    {
      claimNumber: 1,
      patentId: "us-808897-carrier-air-conditioner",
      claimTitle: "Unobstructed Wet Front and Projected Rear Separator",
      activeDescription:
        "Claim 1 keeps the front portion of each upright sinuous plate unobstructed for liquid distribution, then uses projections on the succeeding portion to obstruct liquid flow and separate it from the air.",
      invertedDescription:
        "A straight or fully obstructed plate loses the source's two-stage wet-contact and liquid-separation arrangement.",
      failureModeName: "Liquid Carryover and Missed Wet-Contact Capture",
      historicalPriorArt:
        "A simple spray or drain plate can leave droplets entrained or lose the wet surface needed to catch suspended impurities.",
    },
  ],
  "us-727650-linde-air-liquefaction": [
    {
      claimNumber: 1,
      patentId: "us-727650-linde-air-liquefaction",
      claimTitle: "Regenerative Counter-Current Joule-Thomson Liquefaction",
      activeDescription:
        "Claim 1 recirculates cold throttled air through counter-current heat exchangers to cumulatively cool compressed air below the liquefaction threshold.",
      invertedDescription:
        "Single-pass throttling: without regenerative counter-current heat exchange, Joule-Thomson cooling yields only ~0.25 K/bar, never reaching 77 K.",
      failureModeName: "Joule-Thomson Inversion Ceiling",
      historicalPriorArt:
        "Direct expansion machines locked up from ice and lubricant freezing before reaching cryogenic temperatures.",
    },
  ],
  "us-971501-haber-ammonia": [
    {
      claimNumber: 1,
      patentId: "us-971501-haber-ammonia",
      claimTitle: "High-Pressure Catalytic Cycle & Continuous Recycling",
      activeDescription:
        "Claim 1 passes stoichiometric N₂/H₂ over osmium/iron catalysts at 200 bar, continuously condensing NH₃ and recycling unreacted gases.",
      invertedDescription:
        "Low-pressure single-pass synthesis: equilibrium conversion drops below 0.1%, wasting 99.9% of purified feed gas.",
      failureModeName: "Le Chatelier Thermodynamic Equilibrium Quench",
      historicalPriorArt:
        "Atmospheric synthesis produced undetectable traces of ammonia, deemed commercially unviable by physical chemists.",
    },
  ],
  "us-2292387-lamarr-frequency-hopping": [
    {
      claimNumber: 1,
      patentId: "us-2292387-lamarr-frequency-hopping",
      claimTitle: "Synchronized Slotted-Tape Spread-Spectrum Frequency Hopping",
      activeDescription:
        "Claim 1 rapidly steps RF carrier frequencies across 88 channels in synchronized pseudo-random sequence between transmitter and receiver.",
      invertedDescription:
        "Single-channel fixed frequency: adversary narrowband CW jamming broadcasts overwhelm the radio guidance link completely.",
      failureModeName: "Narrowband Electronic Jamming Overwhelm",
      historicalPriorArt:
        "Radio-controlled torpedoes operated on static fixed frequencies vulnerable to enemy radio interference.",
    },
  ],
  "us-2297691-carlson-electrophotography": [
    {
      claimNumber: 1,
      patentId: "us-2297691-carlson-electrophotography",
      claimTitle: "Photoconductive Electrostatic Latent Image Transfer",
      activeDescription:
        "Claim 1 establishes uniform electrostatic charge on a photoconductive insulating layer and dissipates charge via optical exposure to create a latent toner image.",
      invertedDescription:
        "Dark-conductive charge dissipation: uncharged layer leaks electrostatic potential before exposure, failing to attract toner particles.",
      failureModeName: "Dark-Decay Electrostatic Potential Dissipation",
      historicalPriorArt:
        "Wet photographic processes required chemical developing baths, darkrooms, and silver halide emulsion papers.",
    },
  ],
  "us-3353115-maiman-ruby-laser": [
    {
      claimNumber: 1,
      patentId: "us-3353115-maiman-ruby-laser",
      claimTitle: "Optically Pumped Solid-State Population Inversion",
      activeDescription:
        "Claim 1 pulses high-intensity xenon flashlamp radiation into chromium-doped corundum to establish N₂ > N₁ population inversion with Fabry-Pérot mirrors.",
      invertedDescription:
        "Sub-threshold ground-state absorption: unpopulated metastable state causes chromium ions to absorb incident photons instead of amplifying them.",
      failureModeName: "Thermal Ground-State Photon Absorption",
      historicalPriorArt:
        "Masers operated strictly at microwave frequencies; optical stimulated emission was widely deemed theoretically unachievable in solids.",
    },
  ],
  "us-3858232-boyle-smith-ccd": [
    {
      claimNumber: 1,
      patentId: "us-3858232-boyle-smith-ccd",
      claimTitle: "Sequential Multi-Phase Potential Well Charge Transfer",
      activeDescription:
        "Claim 1 applies sequential multi-phase clock voltages across dielectric-isolated electrodes to shift potential energy wells and transport discrete minority carrier packets.",
      invertedDescription:
        "Static unclocked gate array: without sequential three-phase potential well progression, photogenerated charge packets smear across pixel boundaries.",
      failureModeName: "Charge Smear & Bulk Interface Recombination",
      historicalPriorArt:
        "Early image sensors used destructive X-Y matrix diode addressing with high readout noise and low fill factor.",
    },
  ],
  "us-2495429-spencer-microwave": [
    {
      claimNumber: 1,
      patentId: "us-2495429-spencer-microwave",
      claimTitle: "Volumetric Dielectric Microwave Cooking",
      activeDescription:
        "Claim 1 exposes foodstuff directly to enclosed 2.45 GHz microwave radiation to excite dipole water molecules and cook from within.",
      invertedDescription:
        "Conductive surface heating: heat penetrates slowly via surface conduction, scorching outer layers while the core remains frozen/raw.",
      failureModeName: "Conductive Thermal Surface Scorching",
      historicalPriorArt:
        "Conventional ovens relied exclusively on external hot air convection and radiative conduction from vessel walls.",
    },
  ],
  "us-194047-otto-engine": [
    {
      claimNumber: 1,
      patentId: "us-194047-otto-engine",
      claimTitle: "Four-Stroke Stratified Charge Compression & Power Cycle",
      activeDescription:
        "Claim 1 separates intake, compression, power expansion, and positive exhaust scavenging into four distinct piston strokes over two crankshaft revolutions.",
      invertedDescription:
        "Two-stroke uncompressed scavenging: fresh fuel charge mixes with burning residual exhaust gases, causing intake backfire and thermal efficiency collapse.",
      failureModeName: "Scavenging Charge Loss & Intake Backfire",
      historicalPriorArt:
        "Lenoir and atmospheric gas engines ignited uncompressed charge at mid-stroke with poor thermal efficiency (<4%).",
    },
  ],
  "us-235199-bell-photophone": [
    {
      claimNumber: 1,
      patentId: "us-235199-bell-photophone",
      claimTitle: "Acoustic Diaphragm Optical Beam Modulation & Selenium Reception",
      activeDescription:
        "Claim 1 modulates a projected sunlight beam via vocal acoustic vibrations of a mirror diaphragm, detecting the fluctuating flux with a parabolic selenium cell.",
      invertedDescription:
        "Static unmodulated optical transmission: without flexible mirror curvature modulation, optical flux is constant and selenium photocurrent produces zero acoustic signal.",
      failureModeName: "Optical Modulation Collapse & Silent Reception",
      historicalPriorArt:
        "Telephony was restricted entirely to metallic conductor wires, with no atmospheric optical wireless transmission.",
    },
  ],
  "us-200521-edison-phonograph": [
    {
      claimNumber: 1,
      patentId: "us-200521-edison-phonograph",
      claimTitle: "Grooved Cylinder Tinfoil Acoustic Indentation & Reproduction",
      activeDescription:
        "Claim 1 indents acoustic wave traces into a pliable metal foil cylinder via an acoustic diaphragm stylus, reproducing sound by retracing indentations.",
      invertedDescription:
        "Rigid non-indentable cylinder: stylus scratches or tears recording medium without depth modulation, destroying acoustic groove topography.",
      failureModeName: "Tinfoil Groove Tearing & Reproduction Loss",
      historicalPriorArt:
        "Scott's phonautograph produced visual squiggles on lampblack glass but had no mechanical means of acoustic playback.",
    },
  ],
  "us-247804-delaval-separator": [
    {
      claimNumber: 1,
      patentId: "us-247804-delaval-separator",
      claimTitle: "Continuous Centrifugal Liquid Density Separation",
      activeDescription:
        "Claim 1 subjects continuous milk flow to high centrifugal acceleration (>4,000 G), separating lighter butterfat cream inward and heavier skim milk outward.",
      invertedDescription:
        "Gravitational settling: without high-speed centrifugal acceleration, Stokes buoyancy separation takes 24–36 hours, risking spoilage.",
      failureModeName: "Gravity Settling Stagnation & Emulsion Retention",
      historicalPriorArt:
        "Dairy creaming required shallow pans sitting for days in cold water tanks with high butterfat loss.",
    },
  ],
  "us-361931-daimler-engine": [
    {
      claimNumber: 1,
      patentId: "us-361931-daimler-engine",
      claimTitle: "Enclosed Crankcase High-Speed Hot-Tube Ignition Engine",
      activeDescription:
        "Claim 1 encloses twin counter-rotating flywheels within an oil-tight crankcase and employs glow-tube ignition to achieve high rotational speeds (>800 RPM).",
      invertedDescription:
        "Heavy open-flame slide valve: slow ignition flame propagation caps engine speed to 150 RPM, yielding excessive weight unsuitable for vehicles.",
      failureModeName: "Slide-Valve Flame Quench & Low Power-to-Weight",
      historicalPriorArt:
        "Stationary gas engines weighed several hundred pounds per horsepower and operated under 200 RPM.",
    },
  ],
  "us-233692-pelton-water-wheel": [
    {
      claimNumber: 1,
      patentId: "us-233692-pelton-water-wheel",
      claimTitle: "Split Crescent Bucket 180° Impulse Flow Reversal",
      activeDescription:
        "Claim 1 divides incoming high-pressure water jet with a central knife-edge wedge, smoothly reversing stream direction through 180° to extract >85% kinetic energy.",
      invertedDescription:
        "Flat impact bucket: jet strikes flat surface at 90°, retaining 50% residual kinetic energy and causing severe back-splash against oncoming buckets.",
      failureModeName: "Flat Bucket Back-Splashing & Kinetic Loss",
      historicalPriorArt:
        "Traditional water wheels and flat impulse paddles suffered from turbulence and back-splash drag with <40% efficiency.",
    },
  ],
  "us-319596-maxim-machine-gun": [
    {
      claimNumber: 1,
      patentId: "us-319596-maxim-machine-gun",
      claimTitle: "Barrel Recoil-Operated Automatic Breech Action & Belt Feed",
      activeDescription:
        "Claim 1 harnesses the kinetic recoil impulse of the discharging barrel to unlock the toggle lock, extract/eject the cartridge case, advance the ammunition belt, and recock the firing pin.",
      invertedDescription:
        "Manual bolt cycling / fixed barrel: recoil energy is absorbed by the mounting rather than operating the mechanism, reducing rate of fire from 600 RPM to ~15 RPM manual cycling.",
      failureModeName: "Manual Bolt-Action Cycling Bottleneck",
      historicalPriorArt:
        "Prior repeating arms (Gardner, Nordenfelt, manual Gatling) required continuous manual hand-cranking or lever manipulation by human operators.",
    },
  ],
  "us-36836-gatling-gun": [
    {
      claimNumber: 1,
      patentId: "us-36836-gatling-gun",
      claimTitle: "Revolving Multi-Barrel Cluster with Continuous Cam Track Reciprocation",
      activeDescription:
        "Claim 1 rotates a cluster of six barrels around a central shaft, each barrel having an independent lock guided by an elliptical stationary cam to load, fire, and extract continuously.",
      invertedDescription:
        "Single-barrel rapid fire: continuous firing through one barrel overheats the chamber (>450°C) within seconds, causing barrel rupture and dangerous round cook-off.",
      failureModeName: "Single-Barrel Thermal Overheat & Cook-Off Rupture",
      historicalPriorArt:
        "Single-barrel machine and volley guns (Billinghurst-Requa, Ager Coffee Mill) suffered catastrophic overheating and frequent feed jamming.",
    },
  ],
  "us-586193-marconi-radio": [
    {
      claimNumber: 1,
      patentId: "us-586193-marconi-radio",
      claimTitle: "Elevated Monopole Antenna & Ground Connection with Automatic De-Coherer",
      activeDescription:
        "Claim 1 connects one spark terminal to an elevated conductive aerial and the other to earth ground, pairing with an evacuated nickel-silver filings coherer and automatic mechanical tapper.",
      invertedDescription:
        "Ungrounded low-dipole spark without de-coherer: radiation resistance collapses by 99%, ground absorption kills range past 50m, and coherer latches permanently conductive after first pulse.",
      failureModeName: "EM Propagation Attenuation & Coherer Latch Freeze",
      historicalPriorArt:
        "Hertz and Branly demonstrated laboratory electromagnetic spark resonance over mere meters without elevated aerial antennas or automatic resetting detectors.",
    },
  ],
  "us-593138-tesla-coil": [
    {
      claimNumber: 1,
      patentId: "us-593138-tesla-coil",
      claimTitle: "Resonant Air-Core High-Frequency Step-Up Transformer",
      activeDescription:
        "Claim 1 steps up high-frequency electrical oscillations using tuned air-core primary/secondary coils ($L_1 C_1 = L_2 C_2$) without an iron core, achieving mega-volt potential.",
      invertedDescription:
        "Iron-core transformer at RF (100+ kHz): magnetic hysteresis and eddy-current losses saturate the core instantly, causing thermal insulation destruction and zero resonant step-up.",
      failureModeName: "Ferromagnetic Core Saturation & RF Eddy Burnout",
      historicalPriorArt:
        "Conventional Ruhmkorff induction coils and closed iron-core transformers experienced severe core saturation and breakdown at radio frequencies.",
    },
  ],
  "us-613809-tesla-teleautomaton": [
    {
      claimNumber: 1,
      patentId: "us-613809-tesla-teleautomaton",
      claimTitle: "Coded RF Pulse Sequence Telecontrol & Step-By-Step Commutator",
      activeDescription:
        "Claim 1 receives modulated radio pulses via a coherer receiver, stepping a multi-position rotary commutator to selectively actuate steering rudder motors and electric propulsion.",
      invertedDescription:
        "Uncoded spark receiver / direct connection: ambient electrical noise and spurious sparks randomly trip the actuators, causing wild erratic steering and teleoperation loss.",
      failureModeName: "Spurious RF Interference & Wild Steering Oscillation",
      historicalPriorArt:
        "Torpedos and marine vessels had zero wireless remote guidance; early cable-steered models (Sims-Edison) required miles of physical trailing electrical wire.",
    },
  ],
  "us-682690-hewitt-mercury-lamp": [
    {
      claimNumber: 1,
      patentId: "us-682690-hewitt-mercury-lamp",
      claimTitle: "Enclosed Evacuated Mercury Vapor Gas Discharge Arc",
      activeDescription:
        "Claim 1 generates light by passing electric current through an evacuated glass tube containing low-pressure mercury vapor with a liquid mercury cathode.",
      invertedDescription:
        "Non-conductive mercury vapor / cold arc: without high-voltage ignition and cathode pooling, mercury gas remains an insulator with zero electrical conductivity or light emission.",
      failureModeName: "Gas Discharge Non-Conduction Extinction",
      historicalPriorArt:
        "Incandescent lamps relied entirely on resistive heating of solid carbon/metal filaments with low luminous efficiency (<3 lm/W).",
    },
  ],
  "us-706737-fessenden-wireless": [
    {
      claimNumber: 1,
      patentId: "us-706737-fessenden-wireless",
      claimTitle: "Continuous Undamped High-Frequency Wave Audio Modulation",
      activeDescription:
        "Claim 1 generates continuous sinusoidal electromagnetic waves modulated directly by acoustic voice currents and detected by a heterodyne electrolytic receiver.",
      invertedDescription:
        "Damped spark pulses: intermittent broadband spark trains drown out analog acoustic signals with harsh broadband noise, limiting transmission to Morse telegraphy.",
      failureModeName: "Damped Spark Noise Modulation Masking",
      historicalPriorArt:
        "Marconi and earlier systems used intermittent spark gaps that were fundamentally incapable of continuous voice or music transmission.",
    },
  ],
  "us-879532-de-forest-audion": [
    {
      claimNumber: 1,
      patentId: "us-879532-de-forest-audion",
      claimTitle: "Interposed Electrostatic Control Grid Modulation",
      activeDescription:
        "Claim 1 interposes a wire grid electrode between the heated filament cathode and anode plate to electrostatically modulate electron flow and amplify voltage signals.",
      invertedDescription:
        "Two-electrode Fleming diode: without a control grid, the tube acts merely as a passive rectifier with zero voltage gain or active signal amplification ($A_v = 0$).",
      failureModeName: "Passive Rectification & Zero Voltage Amplification",
      historicalPriorArt:
        "The Fleming oscillation valve was a two-electrode diode capable only of rectifying RF signals without amplification.",
    },
  ],
  "us-942699-baekeland-bakelite": [
    {
      claimNumber: 1,
      patentId: "us-942699-baekeland-bakelite",
      claimTitle: "Simultaneous Heat & Pressure Autoclaved Thermoset Polycondensation",
      activeDescription:
        "Claim 1 applies heat ($150^\circ\text{C}-200^\circ\text{C}$) and pressure ($10-20\\text{ MPa}$) to phenol and formaldehyde prepolymers in a closed mold to synthesize insoluble, infusible Bakelite C resin.",
      invertedDescription:
        "Atmospheric unpressurized heating: volatile condensation water and formaldehyde boil off at 100°C, producing a porous, foamy, brittle, and mechanically useless spongy mass.",
      failureModeName: "Volatile Boiling & Spongy Foam Collapse",
      historicalPriorArt:
        "Baeyer and early chemists obtained only intractable tar or porous, brittle resins when attempting phenol-formaldehyde reactions at atmospheric pressure.",
    },
  ],
  "us-6162-corliss-steam-engine": [
    {
      claimNumber: 1,
      patentId: "us-6162-corliss-steam-engine",
      claimTitle: "Governor-Tripped Rotary Valve Variable Cut-Off Mechanism",
      activeDescription:
        "Claim 1 connects oscillating rotary steam admission valves to a flyball governor via spring/dashpot disengagement catches, cutting off steam expansion instantaneously at variable stroke positions.",
      invertedDescription:
        "Fixed-cutoff throttling slide valve: governor throttles steam inlet pressure, causing massive wire-drawing entropy losses and wasting 30–40% of boiler thermal energy.",
      failureModeName: "Throttle Wire-Drawing Enthalpy Loss",
      historicalPriorArt:
        "Steam engines used fixed eccentric slide valves and throttle governors that restricted steam pressure throughout the entire stroke.",
    },
  ],
};

/**
 * Modifies simulation dynamics based on claim constraint state.
 */
export function applyClaimConstraintModifications(
  patentId: string,
  params: Record<string, number>,
  claimStates: Record<number, boolean>, // true = Claim active, false = Claim inverted (prior-art mode)
): {
  modifiedParams: Record<string, number>;
  activeFailures: string[];
  refusalWarning: string | null;
} {
  const modified = { ...params };
  const activeFailures: string[] = [];
  let refusalWarning: string | null = null;

  switch (patentId) {
    case "us-821393-wright-flyer": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        // Uncoupled rudder -> adverse yaw induces roll reversal
        const warp = params.wingWarp ?? 5.0;
        modified.adverseYawMultiplier = 3.5;
        modified.yawMomentNm = -warp * 45.0; // Adverse yaw opposite to bank
        activeFailures.push(
          "Adverse Yaw Roll-Spin: Uncoupled vertical rudder cannot counter induced drag",
        );
        refusalWarning =
          "CRITICAL: Aerodynamic adverse yaw exceeds roll authority. Airframe unstable.";
      }
      break;
    }

    case "us-381968-tesla-motor": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        // Claim 1 is an apparatus combination; do not infer modern torque,
        // speed, thermal, or rotor behavior from its inversion.
        activeFailures.push(
          "Source-bound Claim 1 condition absent: corresponding independent alternating-current circuits and progressive pole shifting are not established",
        );
        refusalWarning =
          "SOURCE-BOUND REFUSAL: Tesla Claim 1 requires the stated motor/generator circuit correspondence and progressive pole shift; this inversion reports only that apparatus condition as absent.";
      }
      break;
    }

    case "us-223898-edison-lamp": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        // Atmosphere restored -> rapid filament burnout
        modified.vacuumTorr = 760.0;
        modified.isFilamentBurned = 1;
        activeFailures.push("Filament Burnout: Oxygen combustion consumed carbon filament in 1.4s");
        refusalWarning =
          "MATERIAL REFUSAL: Mean free path << envelope diameter. Filament oxidized.";
      }
      break;
    }

    case "us-2981877-noyce-ic": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.parasiticInductanceNh = 45.0; // Flying gold bond wire inductance
        modified.propDelayPs = 2500.0; // Delay explodes from 400ps to 2500ps
        activeFailures.push(
          "Wire Bond Inductance Ringing: Unpassivated leads limit clock to < 100 MHz",
        );
        refusalWarning =
          "SEMICONDUCTOR FAULT: Flying wire bond parasitic L-C ringing causes clock skew.";
      }
      break;
    }

    case "us-3633-goodyear-rubber": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.crossLinkDensity = 0.0; // Zero covalent sulfur crosslinks
        modified.elasticReturnPct = 12.0; // Viscous plastic creep
        modified.tensileStrengthPsi = 180.0; // Weak raw gum strength
        activeFailures.push(
          "Plastic Flow & Creep: Unvulcanized polymer chains slip permanently under tension",
        );
        refusalWarning =
          "POLYMER INSTABILITY: Absence of covalent crosslinks causes unrecoverable plastic creep deformation.";
      }
      break;
    }

    case "us-3671542-kwolek-kevlar": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.drawRatio = 1.2; // Low isotropic draw
        modified.tensileModulusGpa = 3.5; // Collapsed modulus from 130 GPa to 3.5 GPa
        modified.tensileStrengthMpa = 240.0; // Collapsed strength from 3200 MPa to 240 MPa
        activeFailures.push(
          "Isotropic Chain Spherulites: Unaligned PPTA chains yield plastically upon impact",
        );
        refusalWarning =
          "LIQUID-CRYSTAL LOSS: Loss of nematic liquid-crystalline orientation prevents ballistic energy dispersion.";
      }
      break;
    }

    case "us-1102653-goddard-rocket": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.activeStage = 1; // Locked single stage
        modified.chamberPressure = 80.0; // Reduced chamber pressure from deadweight backpressure
        modified.fuelFlowRateKgs = 0.5; // Stagnating burn rate
        activeFailures.push(
          "Single-Stage Inertial Drag: Retained structural deadweight caps terminal altitude at 5.8 km",
        );
        refusalWarning =
          "PROPULSION REFUSAL: Tsiolkovsky mass ratio insufficient to overcome gravity drag without staging.";
      }
      break;
    }

    case "us-400766-hall-aluminium": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.currentAmperes = 15000.0; // Collapsed cell current
        modified.bathTemperatureCelsius = 2050.0; // Required unfluxed melting point
        modified.aluminaConcentrationPct = 0.2; // Frozen solubility
        activeFailures.push(
          "Anode Effect & Refractory Freezing: Absence of cryolite flux creates solid alumina crust",
        );
        refusalWarning =
          "ELECTROCHEMICAL REFUSAL: Insoluble Al₂O₃ lacks ionic conductivity without molten fluoride bath.";
      }
      break;
    }

    case "us-608969-parsons-turbine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.stages = 1;
        modified.steamRpm = 28000.0;
        activeFailures.push(
          "Centrifugal Over-Stress: Uncompounded single stage creates transonic shock choking and 850 MPa rim tension",
        );
        refusalWarning =
          "AERODYNAMIC CHOKE: Supersonic expansion exceeds blade strength threshold without staged velocity compounding.";
      }
      break;
    }

    case "us-1647-morse-telegraph": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.lineResistance = 4500.0;
        modified.loopCurrentMa = 1.2;
        activeFailures.push(
          "Line Attenuation: Loop current drops below 5 mA mechanical sounder trip threshold",
        );
        refusalWarning =
          "ELECTRICAL REFUSAL: Long-distance line resistance attenuates signal below mechanical relay sensitivity.";
      }
      break;
    }

    case "us-124404-westinghouse-air-brake": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.brakePipePressure = 0.0;
        modified.reservoirPressure = 0.0;
        activeFailures.push(
          "Train Parting Depressurization: Direct-air line vents to atmosphere, disabling all brake cylinders",
        );
        refusalWarning =
          "PNEUMATIC FAILURE: Direct-air system lacks emergency reservoir storage, preventing fail-safe train arrest.";
      }
      break;
    }

    case "us-808897-carrier-air-conditioner": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.sprayRatePct = 0.0;
        modified.separatorFaces = 2;
        activeFailures.push(
          "Wet-contact and gutter failure: no spray film and too few sinuous faces leave liquid and dust separation unproven",
        );
        refusalWarning =
          "SEPARATOR INCOMPLETE: Claim 1 requires the wet front, projected rear, and continuous sinuous passages together.";
      }
      break;
    }

    case "us-727650-linde-air-liquefaction": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.throttlePressureBar = 1.0; // No throttling delta
        modified.liquidFraction = 0.0; // Zero liquid yield
        activeFailures.push(
          "Joule-Thomson Inversion Ceiling: Single-pass expansion without counter-current recovery stays at 285 K",
        );
        refusalWarning =
          "CRYOGENIC CEILING: Regenerative heat exchange required to descend below Joule-Thomson inversion temperature.";
      }
      break;
    }

    case "us-971501-haber-ammonia": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.synthesisPressureBar = 1.0; // Atmospheric pressure
        modified.equilibriumYieldPct = 0.04; // Collapsed yield
        activeFailures.push(
          "Le Chatelier Equilibrium Collapse: 1 bar pressure achieves <0.05% ammonia conversion",
        );
        refusalWarning =
          "EQUILIBRIUM QUENCH: Forward reaction 3H₂ + N₂ ⇌ 2NH₃ volume contraction requires extreme 200 bar drive.";
      }
      break;
    }

    case "us-2292387-lamarr-frequency-hopping": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.hoppingRateHz = 0.0; // Static single carrier
        modified.activeChannels = 1;
        modified.jammingSuppressionDb = 0.0;
        activeFailures.push(
          "Narrowband Jamming Interception: Static carrier frequency overridden by adversary EW noise broadcast",
        );
        refusalWarning =
          "EW VULNERABILITY: Fixed-frequency carrier lacks spread-spectrum processing gain against jamming.";
      }
      break;
    }

    case "us-2297691-carlson-electrophotography": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.surfacePotentialV = 10.0; // Collapsed charge from 600V
        modified.tonerAdhesionRatio = 0.02;
        activeFailures.push(
          "Dark Decay Charge Loss: Electrostatic potential dissipates before optical exposure and toner dusting",
        );
        refusalWarning =
          "ELECTROSTATIC COLLAPSE: Photoconductive layer fails to retain surface charge in dark state.";
      }
      break;
    }

    case "us-3353115-maiman-ruby-laser": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.pumpEnergyJoules = 50.0; // Sub-threshold pump
        modified.populationInversionRatio = 0.2; // Absorbing state N2 < N1
        modified.laserOutputJoules = 0.0;
        activeFailures.push(
          "Ground-State Population Absorption: Chromium ions remain in ⁴A₂ ground state, absorbing 694.3 nm light",
        );
        refusalWarning =
          "THRESHOLD DEFICIT: Optical pump energy density insufficient to overcome ruby ground-state absorption.";
      }
      break;
    }

    case "us-3858232-boyle-smith-ccd": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.clockFrequencyMhz = 0.0; // Clock frozen
        modified.gateVoltageV = 0.5; // Collapsed potential wells
        modified.chargeTransferEfficiency = 0.82; // Massive CTE degradation
        activeFailures.push(
          "Charge Smear: Static gate potential traps minority carriers at SiO₂ interface defects",
        );
        refusalWarning =
          "CHARGE COLLAPSE: Without sequential 3-phase potential stepping, discrete charge packets diffuse and recombine.";
      }
      break;
    }

    case "us-2495429-spencer-microwave": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.rfPowerSetting = 0.0; // Zero microwave emission
        modified.anodeVoltage = 200.0; // Sub-cutoff magnetron voltage
        activeFailures.push(
          "Conductive Heat Stagnation: Loss of 2.45 GHz dielectric rotation slows core heating by 40x",
        );
        refusalWarning =
          "THERMAL PENETRATION FAILURE: Without volumetric microwave dielectric heating, thermal conduction rate caps cooking speed.";
      }
      break;
    }

    case "us-194047-otto-engine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.compressionRatio = 1.2; // Uncompressed atmospheric charge
        modified.thermalEfficiencyPct = 3.5; // Collapsed from 24% to 3.5%
        modified.indicatedPowerHp = 0.4;
        activeFailures.push(
          "Intake Backfire & Residual Exhaust Contamination: Fresh gas charge ignites prematurely in intake tract",
        );
        refusalWarning =
          "FOUR-STROKE CYCLE COLLAPSE: Without distinct 4-stroke induction and scavenging, engine suffers backfire.";
      }
      break;
    }

    case "us-235199-bell-photophone": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.mirrorModulationDepthPct = 0.0; // Rigid unvibrating mirror
        modified.photocellSignalMv = 0.0; // Zero alternating photocurrent
        activeFailures.push(
          "Optical Modulation Collapse: Unmodulated optical beam produces static DC current with zero acoustic reception",
        );
        refusalWarning =
          "OPTICAL MODULATION LOSS: Flexible mirror diaphragm vibration required to modulate radiant energy.";
      }
      break;
    }

    case "us-200521-edison-phonograph": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.grooveDepthUm = 0.0; // Rigid stylus tears foil without indentation
        modified.playbackAcousticDb = 0.0;
        activeFailures.push(
          "Tinfoil Tear & Groove Destruction: Non-indentable stylus shears foil, obliterating sound wave topography",
        );
        refusalWarning =
          "INDENTATION FAILURE: Pliable foil medium must be vertically embossed without tearing to store acoustic waves.";
      }
      break;
    }

    case "us-247804-delaval-separator": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.centrifugalRpm = 100.0; // Sub-critical rotation (<10 G)
        modified.separationEfficiencyPct = 8.0; // Heavy emulsion retention
        activeFailures.push(
          "Centrifugal Boundary Turbulence: Low acceleration fails to overcome Stokes viscous drag on fat globules",
        );
        refusalWarning =
          "CENTRIFUGAL FIELD COLLAPSE: High angular velocity (>4,000 RPM) required for continuous liquid density partitioning.";
      }
      break;
    }

    case "us-361931-daimler-engine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.engineRpm = 120.0; // Slow slide-valve speed ceiling
        modified.powerToWeightHpKg = 0.015; // Heavy stationary engine ratio
        activeFailures.push(
          "Slide-Valve Flame Quench: Slow flame travel limits crank speed to 150 RPM, preventing vehicular power density",
        );
        refusalWarning =
          "SPEED CEILING: Unenclosed low-speed slide valve produces insufficient power-to-weight ratio for locomotion.";
      }
      break;
    }

    case "us-233692-pelton-water-wheel": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.deflectionAngleDeg = 90.0; // Flat impact paddle
        modified.hydraulicEfficiencyPct = 38.0; // Collapsed from 88% to 38%
        activeFailures.push(
          "Flat Impact Back-Splashing: 90° jet deflection retains 50% residual kinetic energy and impinges oncoming buckets",
        );
        refusalWarning =
          "IMPULSE SPLITTER LOSS: Knife-edge wedge required to divide and reverse water jet through 180°.";
      }
      break;
    }

    case "us-319596-maxim-machine-gun": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.rateOfFireRpm = 15.0; // Manual bolt cycling
        modified.recoilOperatingJ = 0.0; // Rigid non-recoiling barrel
        activeFailures.push(
          "Manual Bolt Bottleneck: Recoil energy is absorbed into fixed mount without automatic feeding cycle",
        );
        refusalWarning =
          "RECOIL DISCONNECT: Automatic cycling requires floating barrel recoil to actuate toggle lock and belt feed.";
      }
      break;
    }

    case "us-36836-gatling-gun": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.barrelCount = 1.0;
        modified.barrelTempC = 480.0; // Critical single-barrel thermal runaway
        activeFailures.push(
          "Single-Barrel Thermal Overheat: Continuous cyclic firing causes rapid chamber heat accumulation and cook-off",
        );
        refusalWarning =
          "THERMAL OVERLOAD: Multi-barrel revolving cluster required to distribute thermal load across consecutive discharges.";
      }
      break;
    }

    case "us-586193-marconi-radio": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.antennaElevationM = 0.5; // Low ungrounded dipole
        modified.transmissionRangeKm = 0.04; // Range drops from 50 km to 40 meters
        activeFailures.push(
          "Ground Absorption & Coherer Latch: Ungrounded signal decays exponentially; coherer remains latched conductive",
        );
        refusalWarning =
          "GROUNDING & ELEVATION COLLAPSE: Elevated aerial monopole and earth ground return required for long-distance propagation.";
      }
      break;
    }

    case "us-593138-tesla-coil": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.secondaryVoltageKv = 2.5; // Iron core hysteresis saturation collapse
        modified.resonantQ = 1.2; // Destroyed high-Q resonance
        activeFailures.push(
          "Iron Core Hysteresis Saturation: Ferromagnetic core induces massive RF eddy currents and insulation burnout",
        );
        refusalWarning =
          "RF CORE SATURATION: Tuned air-core quarter-wave resonance required for mega-volt high-frequency potential.";
      }
      break;
    }

    case "us-613809-tesla-teleautomaton": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.spuriousNoisePct = 95.0; // Errant random triggering
        modified.steeringFidelityPct = 5.0; // Control loss
        activeFailures.push(
          "Spurious Interference Oscillation: Uncoded spark reception triggers errant commutator steps and wild rudder swings",
        );
        refusalWarning =
          "TELECONTROL DESYNC: Multi-pulse coded sequencing and rotary commutator required for deterministic remote steering.";
      }
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.arcConductanceMho = 0.0; // Cold non-ignited vapor
        modified.luminousOutputLumens = 0.0;
        activeFailures.push(
          "Gas Discharge Non-Conduction: Cold mercury gas acts as dielectric insulator without high-voltage arc initiation",
        );
        refusalWarning =
          "ARC EXTINCTION: Liquid mercury cathode pool and high-voltage impulse required to establish conductive gas discharge.";
      }
      break;
    }

    case "us-706737-fessenden-wireless": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.harmonicPurityPct = 5.0; // Broadband spark noise
        modified.audioIntelligibilityPct = 0.0; // Damped sparks mask speech
        activeFailures.push(
          "Damped Spark Audio Masking: Intermittent spark discharges mask analog speech modulation with acoustic noise",
        );
        refusalWarning =
          "CONTINUOUS-WAVE FAILURE: Continuous undamped sinusoidal carrier required for amplitude-modulated voice telephony.";
      }
      break;
    }

    case "us-879532-de-forest-audion": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.voltageGainAv = 1.0; // Passive diode (no gain)
        modified.transconductanceMicromhos = 0.0;
        activeFailures.push(
          "Passive Diode Rectification: Without electrostatic grid control, the tube cannot amplify weak incoming signals",
        );
        refusalWarning =
          "TRIODE GAIN COLLAPSE: Interposed control grid required for electrostatic carrier modulation and voltage amplification.";
      }
      break;
    }

    case "us-942699-baekeland-bakelite": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.crosslinkDensityPct = 12.0; // Under-cured porous sponge
        modified.tensileStrengthMpa = 3.5; // Collapsed from 60 MPa to 3.5 MPa
        activeFailures.push(
          "Unpressurized Volatile Boiling: Escape of steam and formaldehyde at 100°C produces a brittle, porous foam",
        );
        refusalWarning =
          "AUTOCLAVE PRESSURE LOSS: Closed pressurized cure (>10 MPa) required to prevent volatile gas boiling during crosslinking.";
      }
      break;
    }

    case "us-6162-corliss-steam-engine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.thermalEfficiencyPct = 8.5; // Throttling slide-valve baseline
        modified.wireDrawingLossKw = 45.0;
        activeFailures.push(
          "Throttle Wire-Drawing Enthalpy Loss: Continuous throttling restricts cylinder admission pressure throughout stroke",
        );
        refusalWarning =
          "CUT-OFF DISENGAGEMENT FAILURE: Automatic governor trip-gear required for instantaneous valve cutoff and full steam expansion.";
      }
      break;
    }

    default:
      break;
  }

  return {
    modifiedParams: modified,
    activeFailures,
    refusalWarning,
  };
}
