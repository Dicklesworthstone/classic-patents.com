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
  "us-223898-edison-lightbulb": [
    {
      claimNumber: 1,
      patentId: "us-223898-edison-lightbulb",
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
  "us-223898-edison-lamp": [
    {
      claimNumber: 1,
      patentId: "us-223898-edison-lightbulb",
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
      claimTitle: "Tool Compatibility Identifier and Lookup Table",
      activeDescription:
        "Claim 1 requires circuitry on a releasable robotic surgical tool to transmit an identifier that the processor compares with a table of compatible tool identifiers.",
      invertedDescription:
        "Unverified tool interface: a processor cannot safely configure a detachable tool when the tool provides no compatible identifier at the holder boundary.",
      failureModeName: "Compatibility Signal Missing",
      historicalPriorArt:
        "The grant describes tool changes, multiple tool types, and the need to avoid operating a tool whose data is absent from the system's compatibility information.",
    },
  ],
  "us-6594844-roomba": [
    {
      claimNumber: 1,
      patentId: "us-6594844-roomba",
      claimTitle: "Intersecting Optical Fields & Redirect Circuit",
      activeDescription:
        "Claim 1 mounts a directed photon emitter and detector on the robot so their fields intersect at a finite surface region, then redirects the housing when that expected surface is absent.",
      invertedDescription:
        "Optical subsystem absent: no emitter/detector intersection is observed and the claimed circuit cannot command the source-described surface-absence redirect. Mechanical bumper contact remains a separate behavior.",
      failureModeName: "Claimed Optical Redirect Condition Absent",
      historicalPriorArt:
        "The grant frames the improvement as a low-cost finite-region optical test for floors, walls, and obstacles rather than a claim to a complete coverage algorithm.",
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
        "Claim 1 combines the curved eye-pointed needle on its vibrating arm with shuttle K passing between the needle and upper thread.",
      invertedDescription:
        "Offset shuttle track: shuttle K passes beside the upper-thread loop instead of between the needle and thread, so the interlock is not formed.",
      failureModeName: "Shuttle Misses Upper-Thread Loop",
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
      claimTitle: "Nested Auxiliary Rocket with Ordered Firing",
      activeDescription:
        "Claim 1 keeps a secondary rocket mounted in firing tube 24 and fires it only when the primary explosive is substantially consumed.",
      invertedDescription:
        "Omit the nested auxiliary rocket entirely, leaving only the primary solid-charge chamber and tapered tube.",
      failureModeName: "Missing Auxiliary Flight Stage",
      historicalPriorArt:
        "Ordinary single-body rockets did not carry a reduced rocket inside a forward firing tube with the printed delayed-firing sequence.",
    },
    {
      claimNumber: 2,
      patentId: "us-1102653-goddard-rocket",
      claimTitle: "Long Slightly Tapered Combustion-Gas Tube",
      activeDescription:
        "Claim 2 requires tube 11 to be a slightly tapered truncated cone whose length is not less than three times its longest diameter.",
      invertedDescription:
        "Shorten tube 11 to L/D = 2.5 so the model visibly crosses the exact legal geometry boundary printed in Claim 2.",
      failureModeName: "Claim 2 Tube-Ratio Violation",
      historicalPriorArt:
        "The specification contrasts tube 11 with ordinary rockets that discharged combustion gases through a rear opening.",
    },
    {
      claimNumber: 3,
      patentId: "us-1102653-goddard-rocket",
      claimTitle: "Initial and Restored Rocket Rotation",
      activeDescription:
        "Claim 3 combines primary spin passages with corresponding means in the secondary rocket for maintaining its rotation.",
      invertedDescription:
        "Remove both sets of transverse spin-charge passages and set the declared primary spin rate to zero.",
      failureModeName: "Spin-System Omission",
      historicalPriorArt:
        "A rocket without the printed spin-charge systems has no claimed mechanism for imparting and restoring rotation.",
    },
    {
      claimNumber: 7,
      patentId: "us-1102653-goddard-rocket",
      claimTitle: "Gyroscope-Restrained Pivoted Instrument Support",
      activeDescription:
        "Claim 7 mounts gyroscope 37 on pivoted support 33 so the camera support can be restrained from rotating with head 29.",
      invertedDescription:
        "Remove the gyroscope assembly so support 33 inherits the rocket head's angular velocity.",
      failureModeName: "Camera Support Co-Rotation",
      historicalPriorArt:
        "A camera rigidly carried by a spinning rocket head rotates with the casing and cannot retain its initial pointing direction.",
    },
  ],
  "us-1219881-sundback-zipper": [
    {
      claimNumber: 1,
      patentId: "us-1219881-sundback-zipper",
      claimTitle: "Staggered Interlocking Scoop Geometry",
      activeDescription:
        "Claim 1 requires interlocking members arranged in staggered relation with rounded recess and projection meeting in a guiding edge.",
      invertedDescription:
        "Break half-pitch stagger alignment, forcing teeth to collide head-to-head at the slider throat.",
      failureModeName: "Tooth Jam & Throat Collision",
      historicalPriorArt:
        "Judson's clasp lockers and early hook-and-eye chains jammed continuously because they lacked self-guiding nested cup geometry.",
    },
    {
      claimNumber: 2,
      patentId: "us-1219881-sundback-zipper",
      claimTitle: "Transversely Elongated Rounded Nesting Sockets",
      activeDescription:
        "Claim 2 requires transversely elongated rounded projections and sockets that prevent unmeshing under lateral flexion.",
      invertedDescription:
        "Reduce tooth overlap shoulder area, causing the closed fastener to pop open when folded or bent.",
      failureModeName: "Flexion Unmeshing Pop-Out",
      historicalPriorArt:
        "Judson's 1905 C-curity fastener popped open unexpectedly whenever clothing was flexed across the knee or torso.",
    },
  ],
  "us-2717437-mestral-velcro": [
    {
      claimNumber: 1,
      patentId: "us-2717437-mestral-velcro",
      claimTitle: "Thermal Shape Setting of Synthetic Monofilament Loops",
      activeDescription:
        "Claim 1 subjects auxiliary synthetic warp loops to thermal heat setting before cutting, permanently freezing hook shape memory.",
      invertedDescription:
        "Without thermal heat setting, cut monofilament strands relax into straight vertical bristles without retaining hook curvature.",
      failureModeName: "Hook Shape Relaxation & Zero Fastening Adhesion",
      historicalPriorArt:
        "Traditional velvet pile looms cut unheated natural fibers (silk/cotton) which lacked spring recovery and hook geometry.",
    },
    {
      claimNumber: 3,
      patentId: "us-2717437-mestral-velcro",
      claimTitle: "Synthetic Raised Hook Pile Foundation Fabric",
      activeDescription:
        "Claim 3 claims foundation weave with raised synthetic resin pile threads terminating in material-engaging hooks.",
      invertedDescription:
        "Reverting to unhooked velvet pile, eliminating in-plane shear holding capacity.",
      failureModeName: "Soft Velvet Pile Slippage",
      historicalPriorArt:
        "Decorative upholstery velvets provided silky softness but zero mechanical retention force.",
    },
  ],
  "us-4575330-hull-stereolithography": [
    {
      claimNumber: 1,
      patentId: "us-4575330-hull-stereolithography",
      claimTitle: "Stepwise Layer-by-Layer Additive Build Platform",
      activeDescription:
        "Claim 1 draws cross-sectional laminae at a 2D interface and moves the object away stepwise to build up a 3D solid part.",
      invertedDescription:
        "Without layer-by-layer slicing and translation: attempt bulk curing in 3D volume, leading to uncontrolled polymer gelation and thermal runaway.",
      failureModeName: "Uncontrolled Bulk Photopolymer Gelation",
      historicalPriorArt:
        "Prior art (Swainson US 4,041,476) attempted two-laser beam intersecting points in 3D liquid volumes, suffering catastrophic positioning instability and bulk clouding.",
    },
    {
      claimNumber: 2,
      patentId: "us-4575330-hull-stereolithography",
      claimTitle: "Thin Surface Layer Restricted Reaction",
      activeDescription:
        "Claim 2 restricts synergistic stimulation to only a thin surface layer at the designated working interface.",
      invertedDescription:
        "Without surface-depth confinement: actinic light penetrates deeply into the vat, solidifying the entire resin pool into an unusable block.",
      failureModeName: "Excessive Deep-Cure Z-Distortion",
      historicalPriorArt:
        "Magat (US 2,708,617) irradiated unconfined bulk monomers, causing uncontrolled polymerization throughout the fluid container.",
    },
  ],
  "us-4921293-salisbury-robot-hand": [
    {
      claimNumber: 1,
      patentId: "us-4921293-salisbury-robot-hand",
      claimTitle: "Three-Joint, Four-Cable Pull Sequence",
      activeDescription:
        "Claim 1 specifies three serial revolute joints, four control cables, and the opposed or paired cable pulls that rotate each joint in either direction.",
      invertedDescription:
        "Remove that routing combination. The three printed torque equations no longer describe the comparison state, so the exhibit zeros their outputs instead of predicting a mechanical failure.",
      failureModeName: "Claimed Cable Routing Absent",
      historicalPriorArt:
        "The specification contrasts its hand with Okada’s 22-cable system and with remote-actuator arrangements whose bare cables crowded the wrist gimbals; it also acknowledges Moreki’s earlier n+1 cable result.",
    },
    {
      claimNumber: 2,
      patentId: "us-4921293-salisbury-robot-hand",
      claimTitle: "Fixable First-Axis Idler and Outboard Drive Pulley",
      activeDescription:
        "Claim 2 specifies an idler concentric with the first axis, a drive pulley at the second axis, one cable drive engaging both, and means to hold the idler while cable motion articulates the first joint.",
      invertedDescription:
        "Release the first idler in the teaching comparison. This removes the claim predicate but does not alter the separate Figure 3 torque equation or invent a decoupling error.",
      failureModeName: "First-Idler Holding Predicate Absent",
      historicalPriorArt:
        "The grant describes the idler and drive-pulley relationship as part of its articulated-finger routing; it does not provide measured comparative performance for a released idler.",
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
  "us-542846-diesel-engine": [
    {
      claimNumber: 1,
      patentId: "us-542846-diesel-engine",
      claimTitle: "Extreme Air Compression Ignition (P > 30 atm) & Timed Fuel Injection",
      activeDescription:
        "Claim 1 compresses atmospheric air to extreme pressure (>30 atm) heating it above fuel auto-ignition temperature (>550°C), injecting fuel without spark plugs.",
      invertedDescription:
        "Low compression Otto engine: limited to ~4:1 compression ratio by premature spark knock (pre-ignition), capped at 15–20% thermal efficiency.",
      failureModeName: "Pre-Ignition Knock & Low Thermodynamic Carnot Efficiency",
      historicalPriorArt:
        "Otto and early gas/steam engines achieved low thermal efficiency (10–18%) due to low compression and boiler heat losses.",
    },
  ],
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
  "us-3858581-kamen-medication-injection-device": [
    {
      claimNumber: 1,
      patentId: "us-3858581-kamen-medication-injection-device",
      claimTitle: "Lead Screw Striker & Pulse-Counted Syringe Advance",
      activeDescription:
        "Claim 1 couples a drive motor to a uniform-pitch lead screw with a radial striker that trips a pulse switch once per revolution to count turns and control plunger displacement.",
      invertedDescription:
        "Open-loop timed injection: without pulse counting from the lead-screw striker, variations in motor speed cause erratic plunger advance and inaccurate dosing.",
      failureModeName: "Uncounted Open-Loop Plunger Advance",
      historicalPriorArt:
        "Early automated infusion pumps used unregulated clockwork or analog motor timers that drifted under varying mechanical friction.",
    },
  ],
  "us-2495429-spencer-microwave": [
    {
      claimNumber: 1,
      patentId: "us-2495429-spencer-microwave",
      claimTitle: "Generated, Guided Microwave-Region Food Treatment",
      activeDescription:
        "Claim 1 generates electromagnetic wave energy in the microwave region, concentrates and guides it within a restricted region of space, and exposes food there long enough to cook it to a predetermined degree.",
      invertedDescription:
        "With the generated-and-guided microwave-region energy path removed, the illustrated apparatus no longer performs the treatment sequence recited by Claim 1.",
      failureModeName: "Claimed Microwave Energy Path Removed",
      historicalPriorArt:
        "The specification contrasts the claimed microwave-region process with earlier electromagnetic food treatment at frequencies not over about fifty megacycles, which Spencer describes as impractical because of the energy required.",
    },
  ],
  "us-194047-otto-engine": [
    {
      claimNumber: 1,
      patentId: "us-194047-otto-engine",
      claimTitle: "Graded Separate Air and Combustible Charge",
      activeDescription:
        "Claim 1 introduces the combustible mixture separately from an air or incombustible-gas charge, concentrated near ignition and increasingly dispersed farther forward so heat and pressure rise gradually.",
      invertedDescription:
        "Ungraded charge counterfactual: the source-described concentration gradient and its claimed gradual heat-and-pressure development are absent. The grant supplies no measurements from which to invent a replacement pressure trace.",
      failureModeName: "Claimed Charge Gradient Absent",
      historicalPriorArt:
        "Otto's specification distinguishes this staged, spatially graded charge from engines that ignite a combustible charge without the claimed intervening distribution of air or incombustible gas.",
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
      claimTitle: "Marine Motor, Ahead Coupling, and Astern Gearing",
      activeDescription:
        "Claim 1 combines a vessel, an in-line gas or petroleum motor and propeller shaft, mating coupling members for ahead propulsion, and gearing that drives the propeller shaft in the opposite direction for astern propulsion.",
      invertedDescription:
        "Without the claimed coupling and reverse-gearing relationship, the source-defined installation no longer establishes both ahead and astern drive from the continuously rotating motor shaft.",
      failureModeName: "Claimed Ahead/Astern Drive Path Incomplete",
      historicalPriorArt:
        "The patent frames the problem as a vessel-installation arrangement; it does not claim an automobile differential, an enclosed crankcase, a hot-tube ignition system, or a numerical speed threshold.",
    },
  ],
  "us-307031-edison-indicator": [
    {
      claimNumber: 1,
      patentId: "us-307031-edison-indicator",
      claimTitle: "Lamp Vacuum-Space Circuit Controlling Electrical Apparatus",
      activeDescription:
        "Claim 1 combines an incandescent lamp, a circuit that includes the vacuous space within its globe, and electrical apparatus controlled by current in that circuit.",
      invertedDescription:
        "With the vacuum-space circuit path removed, the claim's electrical apparatus is no longer controlled by current in the specified circuit; no numerical current or sensitivity is inferred.",
      failureModeName: "Claimed Vacuum-Space Control Path Open",
      historicalPriorArt:
        "The grant describes indicating and regulating uses of the circuit but prints no operating voltage, current, vacuum pressure, temperature, or response calibration.",
    },
  ],
  "us-233692-pelton-water-wheel": [
    {
      claimNumber: 1,
      patentId: "us-233692-pelton-water-wheel",
      claimTitle: "Sloped Front, Dividing Apex, Curved Bottoms, and Flaring Sides",
      activeDescription:
        "Claim 1 combines sloping bucket-front b, two curved bottoms c meeting at central dividing apex d, and inclined flaring discharge sides e, with the front arranged so the entering stream can pass without striking the bucket face.",
      invertedDescription:
        "Removing any named part breaks the printed combination: the source no longer establishes admission past front b, division at apex d, travel through both curved bottoms c, and side discharge through e.",
      failureModeName: "Claimed Bucket Geometry Incomplete",
      historicalPriorArt:
        "Pelton describes earlier flat or flat-bottomed buckets as throwing water against following buckets, but the grant prints no numerical efficiency, force, turning angle, speed, or head comparison.",
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
      claimTitle: "Primary / Secondary / Earth Common-Node Transformer",
      activeDescription:
        "Claim 1 electrically connects one secondary terminal with the primary and, while the transformer is in use, with earth.",
      invertedDescription:
        "Open secondary bond: the secondary terminal is no longer electrically connected to the claimed primary-and-earth common node, so the Claim 1 topology is absent. No voltage or damage result is inferred.",
      failureModeName: "Claimed Common-Node Topology Absent",
      historicalPriorArt:
        "The specification distinguishes its terminal arrangement and winding placement from the flat spiral itself, which Tesla expressly says was already old.",
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
      claimTitle: "Distributed-Capacity Sending Conductor",
      activeDescription:
        "Claim 1 requires a sending conductor whose large capacity is distributed with substantial uniformity over its radiating portion.",
      invertedDescription:
        "Distributed-capacity relation absent: the reader no longer represents the large, substantially uniform capacity over the radiating portion required by Claim 1.",
      failureModeName: "Distributed-Capacity Relation Absent",
      historicalPriorArt:
        "The specification contrasts this arrangement with earlier high-frequency systems whose waves rapidly diminished and varied in frequency and form.",
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
        "Claim 1 applies heat ($150^circ\text{C}-200^circ\text{C}$) and pressure ($10-20\\text{ MPa}$) to phenol and formaldehyde prepolymers in a closed mold to synthesize insoluble, infusible Bakelite C resin.",
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
  "us-2543181-land-polaroid": [
    {
      claimNumber: 1,
      patentId: "us-2543181-land-polaroid",
      claimTitle: "Rupturable Pod Reagent Spreading & Instant Diffusion-Transfer Development",
      activeDescription:
        "Claim 1 spreads a viscous chemical reagent from a rupturable pod between a photosensitive negative and image-receiving sheet via compression rollers, completing solubilizing diffusion-transfer positive image formation in under 60 seconds without a darkroom.",
      invertedDescription:
        "Multi-bath wet darkroom immersion: without viscous pod spreading and positive transfer mordants, exposed film requires developer tanks, acid stop baths, fixers, and wash baths over 30+ minutes.",
      failureModeName: "Multi-Bath Wet Darkroom Immersion Delay",
      historicalPriorArt:
        "Traditional photography required wet chemical processing tanks, darkrooms, and prolonged chemical fixing/washing before a positive print could be viewed.",
    },
  ],
  "gb-913-watt-separate-condenser": [
    {
      claimNumber: 1,
      patentId: "gb-913-watt-separate-condenser",
      claimTitle: "Separate Condenser Vessel & Steam Jacketed Working Cylinder",
      activeDescription:
        "Claim 1 condenses steam in a separate cold vessel while maintaining the working cylinder at boiling steam temperature.",
      invertedDescription:
        "Newcomen atmospheric injection: cold water sprayed inside the cylinder chills the metal, wasting 75% of boiler fuel reheating walls.",
      failureModeName: "Cyclic Cylinder Thermal Shock & 75% Fuel Inefficiency",
      historicalPriorArt:
        "Newcomen atmospheric engine condensed steam directly inside the working cylinder on every power stroke.",
    },
  ],
  "gb-1306-watt-rotary-engine": [
    {
      claimNumber: 1,
      patentId: "gb-1306-watt-rotary-engine",
      claimTitle: "Sun and Planet Rotary Gear Transmission with Flywheel Integration",
      activeDescription:
        "Claim 1 converts reciprocating beam motion into continuous shaft rotation using a sun gear and orbiting planet gear, doubling shaft speed.",
      invertedDescription:
        "Unconnected reciprocating beam: vertical pump-only motion cannot drive rotating factory shafts, mills, or machine tools.",
      failureModeName: "Non-Rotary Reciprocating Constraint Bottleneck",
      historicalPriorArt:
        "Reciprocating atmospheric and early steam beam engines were confined strictly to vertical water pumping.",
    },
  ],
  "us-x8277-mccormick-reaper": [
    {
      claimNumber: 1,
      patentId: "us-x8277-mccormick-reaper",
      claimTitle: "Serrated Reciprocating Cutter-Bar, Guard Fingers, and Revolving Reel",
      activeDescription:
        "Claim 1 guides grain into slotted guard teeth, slices stems with a rapid reciprocating sickle knife, and sweeps cut grain onto a platform.",
      invertedDescription:
        "Manual scythe harvesting: grain stems bend away from dull blades uncut, seed heads shatter, and harvesting is capped at 1 acre/day per laborer.",
      failureModeName: "Grain Stem Deflection & Seed Shatter Loss",
      historicalPriorArt:
        "Manual scythes and cradles were exhausting, weather-vulnerable, and severely limited harvested acreage.",
    },
  ],
  "us-132-davenport-electric-motor": [
    {
      claimNumber: 1,
      patentId: "us-132-davenport-electric-motor",
      claimTitle: "Electromagnetic Commutating Rotor and Stationary Stator Magnets",
      activeDescription:
        "Claim 1 alternates the polarity of rotating electromagnets via a split-ring commutator against stationary magnets to generate rotary torque.",
      invertedDescription:
        "Non-commutated electromagnet: rotor rotates 90° to maximum magnetic alignment and locks permanently in place with zero continuous rotation.",
      failureModeName: "Static Magnetic Alignment Stall (Zero Continuous Torque)",
      historicalPriorArt:
        "Early electromagnetic devices (Henry, Ritchie) produced oscillating rocker or clicking motion rather than practical rotary power.",
    },
  ],
  "us-588-ericsson-propeller": [
    {
      claimNumber: 1,
      patentId: "us-588-ericsson-propeller",
      claimTitle: "Submerged Multi-Bladed Screw Propeller on In-Line Propeller Shaft",
      activeDescription:
        "Claim 1 propels vessels through water via submerged helical propeller blades keyed directly to an underwater shaft at high efficiency.",
      invertedDescription:
        "Side paddle-wheels: rolling sea waves expose paddle wheels above the surface, destroying propulsion symmetry, and are vulnerable to combat fire.",
      failureModeName: "Wave Decoupling & Vulnerable Paddle Wheel Asymmetry",
      historicalPriorArt:
        "Side and stern paddle-wheel steamships suffered severe wave immersion variance and fragile machinery exposure.",
    },
  ],
  "us-3237-rillieux-evaporator": [
    {
      claimNumber: 1,
      patentId: "us-3237-rillieux-evaporator",
      claimTitle: "Multiple-Effect Vacuum Evaporation Using Latent Vapor Enthalpy",
      activeDescription:
        "Claim 1 uses the steam boiled off from one sugar pan under higher pressure to boil the liquid in a second pan under lower pressure (higher vacuum).",
      invertedDescription:
        "Open-kettle Jamaica train boiling: atmospheric open-flame boiling scorched sugar juice, wasted huge firewood/bagasse fuel, and risked burns.",
      failureModeName: "Sugar Caramelization Scorching & Extreme Thermal Fuel Waste",
      historicalPriorArt:
        "Open kettle batteries ('Jamaica train') boiled cane juice directly over open wood fires with terrible fuel efficiency.",
    },
  ],
  "us-6469-lincoln-buoy": [
    {
      claimNumber: 1,
      patentId: "us-6469-lincoln-buoy",
      claimTitle: "Inflatable Waterproof Air-Chambers for Shallow-Water Shoal Navigation",
      activeDescription:
        "Claim 1 expands flexible airtight canvas/rubber compartments below the water line to displace water, reduce ship draft, and float over sandbars.",
      invertedDescription:
        "Rigid unbuoyed hull: grounded vessel sticks fast on shallow river shoals, requiring manual cargo unloading, winching, or waiting for floods.",
      failureModeName: "Shoal Grounding & River Sandbar Stranding",
      historicalPriorArt:
        "River steamboats frequently ran aground on shifting Mississippi/Ohio river sandbars and shoals.",
    },
  ],
  "us-31128-otis-elevator": [
    {
      claimNumber: 1,
      patentId: "us-31128-otis-elevator",
      claimTitle: "Hook-Form Pawls and Racks That Lock under Platform Weight",
      activeDescription:
        "Claim 1 gives pawls f and racks C complementary hook form so a broken lifting rope G lets the platform's own weight draw them into a lock that resists separation.",
      invertedDescription:
        "Counterfactual geometry: pawls f remain guided with platform D but cannot lock into racks C after rope G breaks; the model refuses to assert an arrest.",
      failureModeName: "Claim 1 Hook-Lock Geometry Removed",
      historicalPriorArt:
        "The patent identifies separation of pawls from rack teeth under platform load as the contingency that its hook geometry prevents.",
    },
    {
      claimNumber: 3,
      patentId: "us-31128-otis-elevator",
      claimTitle: "Simultaneous Belt Idling and Brake Application",
      activeDescription:
        "Claim 3 connects slide S, brake shoe Z, and hand rope T so a stop shifts straight belt O and crossed belt P onto idle pulleys J and K while applying Z to working pulley L.",
      invertedDescription:
        "Counterfactual interlock: a stop still idles both belts, but brake shoe Z is disconnected from the same control action; no stopping performance is inferred.",
      failureModeName: "Claim 3 Brake Interlock Disconnected",
      historicalPriorArt:
        "The claim is directed to coordinated drive disengagement and braking, not to a quantified brake force or stopping distance.",
    },
    {
      claimNumber: 4,
      patentId: "us-31128-otis-elevator",
      claimTitle: "Opposite-Wound Counterpoise without Safety Interference",
      activeDescription:
        "Claim 4 attaches counterpoise rope Q to the opposite side of winding drum H from lifting rope G, so R moves opposite platform D without interfering with safety mechanism E-e-f.",
      invertedDescription:
        "Counterfactual winding: R follows D rather than opposing it, exposing why the claimed opposite-side attachment matters without inventing counterweight mass or travel.",
      failureModeName: "Claim 4 Counterpoise Winding Inverted",
      historicalPriorArt:
        "The source claims the rope attachment topology and preservation of the safety path; it does not disclose a balancing mass ratio.",
    },
  ],
  "us-48475-yale-lock": [
    {
      claimNumber: 1,
      patentId: "us-48475-yale-lock",
      claimTitle: "Pin-Tumbler Cylinder with Differential-Length Split Pins & Flat Key Shear Line",
      activeDescription:
        "Claim 1 aligns split pin pairs along the plug shear line using a flat bitted key, permitting rotation while resisting picking.",
      invertedDescription:
        "Warded lock: simple skeleton key or bent wire picks past fixed interior wards without pin tumbler height decoding, opening the lock effortlessly.",
      failureModeName: "Skeleton Key Ward Bypass & Trivial Lock Picking",
      historicalPriorArt:
        "Large, heavy warded and lever locks used cumbersome iron keys and were easily bypassed by simple picks.",
    },
  ],
  "us-78317-nobel-dynamite": [
    {
      claimNumber: 1,
      patentId: "us-78317-nobel-dynamite",
      claimTitle: "Kieselguhr Porous Earth Absorbent for Stable Nitroglycerin Solidification",
      activeDescription:
        "Claim 1 absorbs liquid nitroglycerin into porous diatomaceous earth (kieselguhr), converting an ultrasensitive liquid explosive into a safe solid paste.",
      invertedDescription:
        "Liquid nitroglycerin transport: slight mechanical shocks, vibrations, or temperature fluctuations trigger spontaneous detonation during handling.",
      failureModeName: "Spontaneous Shock-Induced Liquid Nitroglycerin Detonation",
      historicalPriorArt:
        "Pure liquid nitroglycerin was so violently shock-sensitive that fatal factory and transport explosions plagued mining.",
    },
  ],
  "us-79265-sholes-typewriter": [
    {
      claimNumber: 1,
      patentId: "us-79265-sholes-typewriter",
      claimTitle: "Radial Converging Type-Bars, Ink Ribbon Mechanism, and Escapement Carriage Step",
      activeDescription:
        "Claim 1 strikes inked ribbon against paper wrapped on a cylindrical platen using radially pivoting type-bars, advancing the carriage one character pitch.",
      invertedDescription:
        "Manual script / unspaced mechanical strike: typebars collide and jam at the strike basket center, producing illegible overlapping ink smears.",
      failureModeName: "Typebar Center Basket Jamming & Character Overprint",
      historicalPriorArt:
        "Handwriting was slow (~25 WPM) and inconsistent; early mechanical writing machines were slow, massive, and frequently jammed.",
    },
  ],
  "us-105338-hyatt-celluloid": [
    {
      claimNumber: 1,
      patentId: "us-105338-hyatt-celluloid",
      claimTitle: "Pyroxylin (Nitrocellulose) Plasticized with Camphor under Heat and Pressure",
      activeDescription:
        "Claim 1 dissolves nitrocellulose in solid camphor under heat and heavy hydraulic pressure, synthesizing the first mouldable synthetic thermoplastic.",
      invertedDescription:
        "Unplasticized nitrocellulose: brittle, explosive guncotton flakes or sticky collodion cannot be molded, thermoformed, or machined into solid goods.",
      failureModeName: "Brittle Nitrocellulose Flaking & Flammability Hazard",
      historicalPriorArt:
        "Parkesine and early collodions shrank drastically, cracked upon drying, and lacked thermoplastic moldability.",
    },
  ],
  "us-120057-gramme-dynamo": [
    {
      claimNumber: 1,
      patentId: "us-120057-gramme-dynamo",
      claimTitle: "Continuous Closed-Ring Toroidal Armature with Multi-Segment Commutator",
      activeDescription:
        "Claim 1 winds continuous insulated copper wire around a soft iron ring armature connected to radial commutator segments, generating non-pulsating DC.",
      invertedDescription:
        "Shuttle armature (Siemens T-armature): produces violent pulsating AC spikes that generate heavy commutator arcing and severe voltage fluctuations.",
      failureModeName: "Pulsating Voltage Ripple & Severe Commutator Brush Arcing",
      historicalPriorArt:
        "Pixii, Clarke, and early dynamos used reciprocating magnets or shuttle armatures yielding jerky pulsating currents.",
    },
  ],
  "us-157124-glidden-barbed-wire": [
    {
      claimNumber: 1,
      patentId: "us-157124-glidden-barbed-wire",
      claimTitle: "Two-Strand Twisted Fence Wire Locking Spurred Wire Barbs in Position",
      activeDescription:
        "Claim 1 coils short pointed wire barbs around one wire strand and twists a second strand around it to permanently clamp and space the barbs.",
      invertedDescription:
        "Smooth single wire / loose barbs: cattle lean on the fence without deterrent, pushing down posts, or loose barbs slide leaving long unbarbed gaps.",
      failureModeName: "Barb Migration & Cattle Fence Breakdown",
      historicalPriorArt:
        "Smooth wire fences sagged and were easily snapped or trampled by cattle herds across the open American prairie.",
    },
  ],
  "us-313224-mergenthaler-linotype": [
    {
      claimNumber: 1,
      patentId: "us-313224-mergenthaler-linotype",
      claimTitle: "Keyboard-Assembled Circulating Brass Matrices & Integral Slug Casting",
      activeDescription:
        "Claim 1 releases brass character matrices from an overhead magazine via keyboard, justifies lines with wedge spacebands, and casts a solid lead slug.",
      invertedDescription:
        "Manual hand-setting of individual movable lead type: compositors pick individual type characters letter-by-letter at a slow 1,500 chars/hour.",
      failureModeName: "Hand-Typesetting Speed Bottleneck & Letter Drop Spills",
      historicalPriorArt:
        "Manual typesetting by hand was the single biggest bottleneck in print publishing for over 400 years.",
    },
  ],
  "us-347140-thomson-welding": [
    {
      claimNumber: 1,
      patentId: "us-347140-thomson-welding",
      claimTitle: "Electric Resistance Heating and End-to-End Mechanical Butt Pressure",
      activeDescription:
        "Claim 1 clamps metal pieces end-to-end and passes a massive low-voltage electric current across the joint, melting the interface under axial pressure.",
      invertedDescription:
        "Forge fire hammer welding: metal surfaces oxidize heavily in coal fires, requiring hazardous fluxes and leaving weak, slag-contaminated joints.",
      failureModeName: "Oxide Scale Inclusion & Incomplete Joint Fusion",
      historicalPriorArt:
        "Blacksmith forge welding was slow, labor-intensive, limited in geometry, and prone to internal slag defects.",
    },
  ],
  "us-388850-eastman-kodak": [
    {
      claimNumber: 1,
      patentId: "us-388850-eastman-kodak",
      claimTitle: "Roll-Film Box Camera with Flexible Emulsion Film Spools and Rotary Shutter",
      activeDescription:
        "Claim 1 houses a continuous roll of flexible photographic film inside a compact box camera with winding key, instantaneous shutter, and factory service.",
      invertedDescription:
        "Wet-plate collodion / fragile glass dry plates: photographer must lug heavy portable darkroom tents, toxic chemicals, and fragile glass sheets.",
      failureModeName: "Fragile Glass Plate Shattering & Darkroom Field Burden",
      historicalPriorArt:
        "Photography required cumbersome tripods, fragile glass plates, and immediate on-site chemical darkroom processing.",
    },
  ],
  "us-395781-hollerith-tabulating": [
    {
      claimNumber: 1,
      patentId: "us-395781-hollerith-tabulating",
      claimTitle:
        "Punched Card Data Encoding, Mercury Cup Sensing Pins, and Electromechanical Counters",
      activeDescription:
        "Claim 1 punches demographic data into standardized cards, senses hole positions via spring-loaded pins dipping into mercury cups, and advances dials.",
      invertedDescription:
        "Manual tally marks on paper ledgers: census tabulation for millions of citizens requires years of human clerk counting, creating severe errors.",
      failureModeName: "Human Clerical Counting Errors & Tabulation Delay",
      historicalPriorArt:
        "The 1880 US Census took nearly eight years to tabulate by hand, threatening to exceed the 10-year constitutional deadline.",
    },
  ],
  "us-470918-reno-escalator": [
    {
      claimNumber: 1,
      patentId: "us-470918-reno-escalator",
      claimTitle:
        "Inclined Endless Traveling Step Treadway with Stationary Comb-Plate Intermeshing",
      activeDescription:
        "Claim 1 carries passengers up an incline on continuous longitudinal slats whose grooves intermesh with fixed comb teeth at the upper landing.",
      invertedDescription:
        "Flat conveyor belt landing without comb teeth: passengers' shoes and clothing get pulled into the moving pinch point beneath the floor plate.",
      failureModeName: "Landing Pinch-Point Entrapment & Severe Foot Crushing",
      historicalPriorArt:
        "Early moving walkways had open landing gaps that dangerously caught clothing and passengers' limbs.",
    },
  ],
  "us-621195-zeppelin-airship": [
    {
      claimNumber: 1,
      patentId: "us-621195-zeppelin-airship",
      claimTitle: "Rigid Structural Duralumin Framework with Internal Separated Gas Cells",
      activeDescription:
        "Claim 1 encases multiple independent hydrogen gas cells inside a rigid longitudinal truss framework with an outer fabric envelope.",
      invertedDescription:
        "Non-rigid blimp: gas envelope sags, buckles, and deforms under aerodynamic wind loads, losing directional pitch control.",
      failureModeName: "Envelope Dynamic Buckling & Structural Aerodynamic Collapse",
      historicalPriorArt:
        "Non-rigid and semi-rigid airships suffered from dangerous envelope sagging, control loss, and engine vibration tearing.",
    },
  ],
  "us-2929922-townes-laser": [
    {
      claimNumber: 1,
      patentId: "us-2929922-townes-laser",
      claimTitle: "Fabry-Pérot Resonant Cavity Optical Masers (Laser) with Population Inversion",
      activeDescription:
        "Claim 1 places an active atomic medium in optical population inversion between parallel reflective mirrors, stimulating coherent optical emission.",
      invertedDescription:
        "Incoherent thermal lamp: spontaneous emission photons emit randomly in all directions and phases, with zero spatial coherence and massive divergence.",
      failureModeName: "Incoherent Spontaneous Emission & Spatial Beam Divergence",
      historicalPriorArt:
        "Conventional light sources relied on thermal incandescence or gas discharge with incoherent, multi-directional emission.",
    },
  ],
  "us-3119501-lemelson-automatic-warehousing": [
    {
      claimNumber: 1,
      patentId: "us-3119501-lemelson-automatic-warehousing",
      claimTitle: "Rail Carriage, Vertical Carrier, Lateral Fixture, Scanner, and Preset Counter",
      activeDescription:
        "Claim 1 combines a self-propelled rail carriage, a vertical second guide and carrier, a lateral article fixture, storage bays and identifiers, a scanning relay, and preset counting logic that stops the carriage drive after selected position signals.",
      invertedDescription:
        "Claim-topology probe: omitting the scan-and-count stop chain leaves a moving storage carrier but removes the issued claim's selected-position feedback combination; no performance or safety outcome is inferred.",
      failureModeName: "Claim 1 Position-Feedback Chain Omitted",
      historicalPriorArt:
        "The specification contrasts its programmed storage/retrieval apparatus with manual direction, manual remote control, and limited single-level conveyor storage.",
    },
    {
      claimNumber: 3,
      patentId: "us-3119501-lemelson-automatic-warehousing",
      claimTitle: "Dual-Axis Optical Scanning & Independent Coordinate Down-Counters",
      activeDescription:
        "Claim 3 expressly adds reflective markers in the scanner path and uses generated feedback signals with a predetermining counter circuit in the claimed first- and second-conveying-means combination.",
      invertedDescription:
        "Claim-topology probe: omitting reflective marker feedback removes Claim 3's specified sensing implementation; the grant supplies no drift, load, voltage, or collision model.",
      failureModeName: "Claim 3 Reflective-Marker Feedback Omitted",
      historicalPriorArt:
        "The specification presents photoelectric markers and a mechanical limit-switch alternative as position-event sources for its preset counting control.",
    },
  ],
  "us-4098001-watson-rcc": [
    {
      claimNumber: 1,
      patentId: "us-4098001-watson-rcc",
      claimTitle: "Radial Rotation and Axial Translation Topology",
      activeDescription:
        "Claim 1 connects fixed, intermediate, and tool-carrying members with at least three rotational elements lying along spherical radii of a remote point, plus plural generally axis-parallel translational elements.",
      invertedDescription:
        "Topology contrast only: moving the illustrated center back to the wrist removes the claim's remote-point arrangement; the patent does not quantify the resulting compliance or insertion outcome.",
      failureModeName: "Claimed Remote-Point Topology Omitted",
      historicalPriorArt:
        "The specification contrasts remote-center geometry with proximate-center mechanisms whose supporting structure can occupy the work area.",
    },
    {
      claimNumber: 2,
      patentId: "us-4098001-watson-rcc",
      claimTitle: "Torsional Drive Restraint for Fastener Torque Transmission",
      activeDescription:
        "Claim 2 retains Claim 1 and adds torque-resistant means between the fixed member and operator means to prevent twisting of the operator tool.",
      invertedDescription:
        "With the torque-resistant means omitted, the normalized exhibit no longer depicts Claim 2's added anti-twist limitation; no source-backed stiffness or yield prediction is made.",
      failureModeName: "Claim 2 Anti-Twist Means Omitted",
      historicalPriorArt:
        "The specification presents bellows 90 as one embodiment for resisting operator-axis twist when a tool applies torque.",
    },
  ],
  "us-2988237-devol-programmed-transfer": [
    {
      claimNumber: 1,
      patentId: "us-2988237-devol-programmed-transfer",
      claimTitle: "Stored Position Symbols and Individual Coincidence Detectors",
      activeDescription:
        "Claim 1 couples position-representing sensing units to the mechanical output, stores selected combinational position symbols in a program controller, and compares corresponding channels with individual coincidence detectors that jointly control the power-operating means.",
      invertedDescription:
        "Claim-topology probe: omitting the corresponding coincidence-detector chain removes Claim 1's selected-code comparison condition; the source supplies no retooling-time or productivity model.",
      failureModeName: "Claim 1 Coincidence Chain Omitted",
      historicalPriorArt:
        "The specification contrasts its recorded reusable position sequence with transfer equipment directed manually or by fixed-purpose arrangements.",
    },
  ],
  // Claims remain unpublished while the Stackhouse edition/ledger draft is on
  // fabrication hold. The source-bounded geometry exhibit must not surface
  // decoders for unverified claim text.
  "us-4068536-stackhouse-manipulator": [],
  "us-4341502-makino-scara": [
    {
      claimNumber: 1,
      patentId: "us-4341502-makino-scara",
      claimTitle: "Concentric Base Four-Link SCARA Mechanism",
      activeDescription:
        "Claim 1 mounts first and fourth links coaxially on a common base axis, forming a closed four-link kinematic chain with planar compliance.",
      invertedDescription:
        "Serial Cartesian gantry: heavy cantilevered axes introduce serial flexure and high inertia, degrading assembly cycle speed.",
      failureModeName: "Serial Axis Inertial Lag & Non-Selective Flexure",
      historicalPriorArt:
        "Cartesian and articulated robots suffered from high moving inertia and lack of selective horizontal compliance for peg-in-hole insertion.",
    },
  ],
  "us-2846084-goertz-electronic-master-slave-manipulator": [
    {
      claimNumber: 9,
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      claimTitle: "Force-Reflecting Position-Error Servo",
      activeDescription:
        "Claim 9 couples corresponding master and slave elements so their positional difference creates an electrical signal that acts on both, allowing resistance encountered remotely to be reflected to the master.",
      invertedDescription:
        "Topology comparison: removing Claim 9 force reflection leaves a displayed master/slave positional mismatch but no source-described resistance path back to the master handle; it does not predict a force, payload, or contact outcome.",
      failureModeName: "Force-Reflection Path Omitted",
      historicalPriorArt:
        "The specification identifies the absence of a direct mechanical connection as the reason that electrical correspondence and a transmitted sense of feel had to be established between the paired units.",
    },
    {
      claimNumber: 10,
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      claimTitle: "Abnormal-Condition Error-Signal Limiter",
      activeDescription:
        "Claim 10 adds a limiter to the Claim 9 signal path, limiting the electrical signal and therefore the source-described speed of operation under abnormal conditions.",
      invertedDescription:
        "Topology comparison: bypassing the limiter removes the claimed clipping predicate while retaining only normalized correspondence channels; the grant does not provide a modern voltage, acceleration, or injury threshold to calculate.",
      failureModeName: "Limiter Predicate Omitted",
      historicalPriorArt:
        "The specification discusses a large initial positional mismatch or removal of an obstacle as conditions that can produce a large error signal, motivating the limiter path.",
    },
    {
      claimNumber: 11,
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      claimTitle: "Relative-Speed Tachometer Feedback",
      activeDescription:
        "Claim 11 forms a signal proportional to the speed difference of corresponding master and slave members and opposes it against the position-error signal.",
      invertedDescription:
        "Topology comparison: disconnecting the tachometer branch removes the claimed relative-speed feedback path; no damping ratio, bandwidth, inertia, or oscillation amplitude is inferred from the historical source.",
      failureModeName: "Relative-Speed Feedback Path Omitted",
      historicalPriorArt:
        "The specification says the derivative or tachometer signal damps the system and prevents hunting, while also improving the initial response of the slave channel.",
    },
    {
      claimNumber: 12,
      patentId: "us-2846084-goertz-electronic-master-slave-manipulator",
      claimTitle: "Limited Error Signal with Relative-Speed Feedback",
      activeDescription:
        "Claim 12 combines the Claim 10 limiting path with the Claim 11 opposing relative-speed signal in the force-reflecting servo arrangement.",
      invertedDescription:
        "Topology comparison: removing the combined claim predicate bypasses both source-described protection branches without turning the illustration into an unsupported speed, force, or safety forecast.",
      failureModeName: "Combined Limiter and Feedback Topology Omitted",
      historicalPriorArt:
        "The specification places the derivative signal after the limiter so that abnormal, rapidly decreasing error is damped while normal following can still receive the available limiter voltage.",
    },
  ],
  "us-4765668-robot-end-effector": [
    {
      claimNumber: 1,
      patentId: "us-4765668-robot-end-effector",
      claimTitle: "Symmetric Opposed-Thread Hands and Removable Fingers",
      activeDescription:
        "Claim 1 combines left- and right-hand ball-screw portions, symmetric paired-hand travel about the screw midpoint, and removable fingers on the corresponding hands.",
      invertedDescription:
        "Comparison state: suppressing Claim 1's opposed-thread/finger combination removes the illustrated symmetric, removable grasp-interface topology; the source does not support a contact-force, payload, or productivity prediction.",
      failureModeName: "Claim 1 Symmetric Removable-Hand Topology Omitted",
      historicalPriorArt:
        "The specification identifies earlier opposed-screw manipulators, then presents the narrow double hand, removable fingers, and associated axes as the machine-tool end-effector combination at issue.",
    },
  ],
  "us-5701965-kamen-transporter": [
    {
      claimNumber: 1,
      patentId: "us-5701965-kamen-transporter",
      claimTitle: "Closed-Loop Dynamic Inverted Pendulum Stability in Fore-Aft Plane",
      activeDescription:
        "Claim 1 maintains dynamic pitch balance by commanding restorative motor torque to ground wheels based on sensed pitch deviation and angular rate.",
      invertedDescription:
        "Disabled balance loop: inverted pendulum chassis immediately falls over due to uncontrolled gravitational moment.",
      failureModeName: "Inverted Pendulum Gravitational Overturn",
      historicalPriorArt:
        "Prior-art wheelchairs relied on static 4-point wheelbases with low centers of gravity, unable to navigate rough ground or climb stairs.",
    },
    {
      claimNumber: 16,
      patentId: "us-5701965-kamen-transporter",
      claimTitle: "Planetary Cluster Wheel Stair-Climbing Mechanism",
      activeDescription:
        "Claim 16 equips opposing sides with multi-wheel clusters rotatable about a central axle for stair stepping and dynamic elevation.",
      invertedDescription:
        "Locked cluster: vehicle is constrained to standard 4-wheel rolling, unable to step over curbs or climb stair risers.",
      failureModeName: "Obstacle / Stair Riser Immobilization",
      historicalPriorArt:
        "Tracked or legged stair climbers were excessively heavy, mechanically complex, and prone to slipping.",
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

    case "us-223898-edison-lightbulb":
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
      if (!(claimStates[1] ?? true)) {
        modified.auxiliaryReleaseFraction = 0;
        activeFailures.push(
          "Claim 1 omission: the nested auxiliary rocket and firing sequence are absent",
        );
      }
      if (!(claimStates[2] ?? true)) {
        modified.tubeLengthRatio = 2.5;
        activeFailures.push(
          "Claim 2 violation: tapered tube length falls below three longest diameters",
        );
      }
      if (!(claimStates[3] ?? true)) {
        modified.primarySpinRpm = 0;
        activeFailures.push(
          "Claim 3 omission: primary and auxiliary spin-charge passages are absent",
        );
      }
      if (!(claimStates[7] ?? true)) {
        modified.gyroEnabled = 0;
        activeFailures.push(
          "Claim 7 omission: camera support co-rotates without gyroscope restraint",
        );
      }
      if (activeFailures.length > 0) {
        refusalWarning =
          "SOURCE CLAIM PROBE: the connected apparatus now visibly omits or violates the selected printed combination.";
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
        modified.rfPowerSetting = 0;
        activeFailures.push("Claim 1 microwave-region generation and guided exposure are disabled");
        refusalWarning =
          "CLAIM 1 INVERSION: the apparatus no longer generates and guides microwave-region energy into the restricted food-treatment region.";
      }
      break;
    }

    case "us-194047-otto-engine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.claim1ChargeGradingPresent = 0;
        activeFailures.push(
          "Claim 1 charge-grading condition absent: the combustible mixture is no longer represented as concentrated near ignition and increasingly dispersed through the separate air charge",
        );
        refusalWarning =
          "CLAIM 1 TOPOLOGY ABSENT: no source-backed pressure, efficiency, or power consequence is inferred for an ungraded replacement charge.";
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
        modified.claim1Active = 0;
        modified.aheadCouplingEngaged = 0;
        modified.asternGearingEngaged = 0;
        activeFailures.push("Claim 1 ahead-coupling and astern-gearing path is incomplete");
        refusalWarning =
          "CLAIM 1 INVERSION: the source-defined vessel installation no longer establishes both ahead and astern propulsion paths.";
      }
      break;
    }

    case "us-307031-edison-indicator": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.claim1Active = 0;
        modified.plateBiasPolarity = 0;
        modified.circuitPathEstablished = 0;
        activeFailures.push("Claim 1 vacuum-space circuit path is open");
        refusalWarning =
          "CLAIM 1 INVERSION: current in a circuit including the lamp globe's vacuous space can no longer control the specified electrical apparatus.";
      }
      break;
    }

    case "us-233692-pelton-water-wheel": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.claim1Active = 0;
        modified.bucketFrontAdmitsStream = 0;
        modified.dividingApexPresent = 0;
        modified.curvedBottomsPresent = 0;
        modified.flaringSidesPresent = 0;
        activeFailures.push(
          "Claim 1 bucket-front, apex, curved-bottom, and flaring-side combination is incomplete",
        );
        refusalWarning =
          "CLAIM 1 INVERSION: the source-defined stream-admission, division, curved-bottom, and side-discharge path is no longer established.";
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
        modified.claim1CommonNodeConnected = 0;
        activeFailures.push(
          "Source-bound Claim 1 condition absent: the secondary terminal is disconnected from the primary-and-earth common node",
        );
        refusalWarning =
          "SOURCE-BOUND REFUSAL: Tesla Claim 1 requires one secondary terminal to be electrically connected with the primary and, in use, with earth; no voltage or failure magnitude is inferred.";
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

    case "us-6594844-roomba": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.opticalSensorEnabled = 0;
        activeFailures.push(
          "Source-bound Claim 1 condition absent: no intersecting emitter/detector field drives the surface-absence redirect circuit",
        );
        refusalWarning =
          "SOURCE-BOUND REFUSAL: Claim 1 requires a directed photon field, an intersecting detector field, and circuitry that redirects the robot when the expected surface is absent; mechanical bumper behavior is not a substitute.";
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
        modified.distributedCapacity = 0;
        activeFailures.push("Distributed-capacity relation absent");
        refusalWarning =
          "SOURCE-BOUND REFUSAL: Claim 1 requires large capacity distributed with substantial uniformity over the radiating portion.";
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

    case "us-2543181-land-polaroid": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.transferEfficiencyPct = 0.0; // No diffusion transfer
        modified.developmentTimeSec = 1800.0; // 30 minutes in darkroom
        activeFailures.push(
          "Multi-Bath Darkroom Delay: Without pod reagent spreading, positive image requires wet developer, stop, and fixer baths",
        );
        refusalWarning =
          "INSTANT DEVELOPMENT COLLAPSE: Rupturable pod and solubilizing diffusion transfer required for 60-second daylight processing.";
      }
      break;
    }

    case "us-1219881-sundback-zipper": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.staggerAligned = 0;
        activeFailures.push(
          "Tooth Jam & Collision: Without half-pitch stagger, scoops collide head-to-head at slider throat",
        );
        refusalWarning =
          "STAGGER ALIGNMENT LOSS: Claim 1 half-pitch offset required for progressive nested interlock.";
      }
      break;
    }

    case "us-4921293-salisbury-robot-hand": {
      const claim1Active = claimStates[1] ?? true;
      const claim2Active = claimStates[2] ?? true;
      if (!claim1Active) {
        modified.tensionT1N = 0;
        modified.tensionT2N = 0;
        modified.tensionT3N = 0;
        modified.tensionT4N = 0;
        activeFailures.push(
          "Claim 1 routing absent: the comparison removes the four source-law cable inputs and makes no derailment, collapse, or force-performance prediction",
        );
        refusalWarning =
          "SOURCE BOUNDARY: Claim 1 inversion is a topology comparison; US 4,921,293 supplies no historic cable pretension, dimensions, inertia, damping, contact, or failure measurements.";
      }
      if (!claim2Active) {
        modified.firstIdlerFixed = 0;
        activeFailures.push(
          "Claim 2 first-idler holding predicate absent: the printed Figure 3 torque map remains a separate source relation",
        );
        refusalWarning =
          "SOURCE BOUNDARY: Releasing the Claim 2 idler does not authorize a fabricated decoupling error or dynamic failure result.";
      }
      break;
    }

    case "us-2717437-mestral-velcro": {
      const claim1Active = claimStates[1] ?? true;
      const claim3Active = claimStates[3] ?? true;
      if (!claim1Active) {
        modified.heatSettingTempC = 25; // Cold un-set
        activeFailures.push(
          "Hook Shape Relaxation: Without thermal heat setting, cut loops relax into straight bristles with 0% hook retention",
        );
        refusalWarning =
          "THERMAL SETTING LOSS: Claim 1 in-situ heat setting required to lock nylon monofilament curvature.";
      }
      if (!claim3Active) {
        modified.engagementRatio = 0.05;
        activeFailures.push(
          "Uncut Smooth Pile: Without raised material-engaging hooks, velvet fabric cannot interlock or sustain shear load",
        );
        refusalWarning =
          "HOOK GEOMETRY LOSS: Claim 3 synthetic hook pile required for reversible multi-hook fastening.";
      }
      break;
    }

    case "us-2846084-goertz-electronic-master-slave-manipulator": {
      const claim9Active = claimStates[9] ?? true;
      const claim10Active = claimStates[10] ?? true;
      const claim11Active = claimStates[11] ?? true;
      const claim12Active = claimStates[12] ?? true;
      if (!claim9Active) {
        modified.forceReflectionEnabled = 0;
        activeFailures.push(
          "Claim 9 force-reflection path omitted: displayed position correspondence has no source-described resistance return to the master handle",
        );
        refusalWarning =
          "SOURCE BOUNDARY: this is a bilateral-servo topology comparison only; US 2,846,084 does not publish a force calibration, contact stiffness, payload, motor constant, arm inertia, or performance result.";
      }
      if (!claim10Active) {
        modified.limiterEnabled = 0;
        activeFailures.push(
          "Claim 10 limiter predicate omitted: the normalized display bypasses the source-described error-signal clipping path",
        );
        refusalWarning =
          "SOURCE BOUNDARY: bypassing the limiter does not establish a voltage, speed, acceleration, injury, or damage prediction.";
      }
      if (!claim11Active) {
        modified.tachometerDampingEnabled = 0;
        activeFailures.push(
          "Claim 11 relative-speed feedback path omitted: the normalized display removes the opposing tachometer branch",
        );
        refusalWarning =
          "SOURCE BOUNDARY: disconnecting the tachometer path does not authorize an invented damping ratio, hunting amplitude, bandwidth, or settling time.";
      }
      if (!claim12Active) {
        modified.limiterEnabled = 0;
        modified.tachometerDampingEnabled = 0;
        activeFailures.push(
          "Claim 12 combined limiter and relative-speed-feedback topology omitted",
        );
        refusalWarning =
          "SOURCE BOUNDARY: the combined-claim comparison removes source-described topology only; it supplies no quantitative safety or servo-performance outcome.";
      }
      break;
    }

    case "us-4765668-robot-end-effector": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.jawOpeningFraction = 0;
        modified.fingerChangeFraction = 1;
        activeFailures.push(
          "Claim 1 Symmetric Removable-Hand Topology Omitted: the comparison state removes the illustrated opposed-thread opening and releases the source-described removable fingers.",
        );
        refusalWarning =
          "SOURCE BOUNDARY: Claim 1 inversion is a topology comparison only; US 4,765,668 supplies no workpiece, contact, friction, payload, pneumatic, or throughput result to predict.";
      }
      break;
    }

    case "us-5701965-kamen-transporter": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.riderPitchLeanDeg = 25; // Overturn tilt
        activeFailures.push(
          "Dynamic Balance Collapse: Without closed-loop motor torque feedback, inverted pendulum falls over under gravity",
        );
        refusalWarning =
          "INVERTED PENDULUM INSTABILITY: Claim 1 active feedback control loop required to counteract gravitational overturning moment.";
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

CATALOG_CLAIM_CONSTRAINTS["us-4098001-watson-remote-center-compliance"] = CATALOG_CLAIM_CONSTRAINTS[
  "us-4098001-watson-rcc"
].map((c) => ({
  ...c,
  patentId: "us-4098001-watson-remote-center-compliance",
}));
