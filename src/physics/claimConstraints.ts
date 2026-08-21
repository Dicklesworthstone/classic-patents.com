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
      claimTitle: "Independent Polyphase Alternating Field Circuits",
      activeDescription:
        "Claim 1 energizes stator poles with phase-shifted AC currents to produce a rotating B-field.",
      invertedDescription:
        "Single-phase unassisted: produces a pulsating stationary magnetic field with zero starting torque.",
      failureModeName: "Stalled Rotor Overheating",
      historicalPriorArt: "DC motors required spark-prone mechanical commutators and brushes.",
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
  "us-542846-diesel-engine": [
    {
      claimNumber: 1,
      patentId: "us-542846-diesel-engine",
      claimTitle: "Pure-Air Compression Auto-Ignition & Gradual Injection",
      activeDescription:
        "Claim 1 compresses pure atmospheric air above fuel ignition temperature before injecting fuel gradually without explosive pressure rise.",
      invertedDescription:
        "Premature fuel premixing: fuel vapor in compression chamber detonates before Top Dead Center, causing destructive engine knock.",
      failureModeName: "Premature Detonation Knock & Piston Seizure",
      historicalPriorArt:
        "Otto and Lenoir cycles required premixed air-fuel charge and external spark/flame ignition, limiting compression ratio to ~6:1.",
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
      claimTitle: "Dew-Point Saturation & Humidity Regulation",
      activeDescription:
        "Claim 1 regulates relative humidity by atomizing chilled water spray to saturate air at its exact dew-point temperature before reheating.",
      invertedDescription:
        "Unregulated vapor supersaturation: sensible cooling without dew-point moisture extraction creates condensation rust and fabric molding.",
      failureModeName: "Uncontrolled Vapor Supersaturation & Mold Precipitation",
      historicalPriorArt:
        "Previous cooling systems only cooled dry-bulb temperature, causing erratic humidity swings in lithographic printing plants.",
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
        // Single-phase stator -> zero starting torque
        modified.startingTorqueNm = 0;
        modified.isSinglePhaseStall = 1;
        activeFailures.push(
          "Stalled Rotor: Stationary pulsating field produces zero starting net torque",
        );
        refusalWarning =
          "ELECTROMAGNETIC REFUSAL: Stator field is stationary standing wave. Rotor requires manual spin.";
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

    case "us-542846-diesel-engine": {
      const claim1Active = claimStates[1] ?? true;
      if (!claim1Active) {
        modified.compressionRatio = 6.0;
        modified.compRatio = 6.0;
        modified.blastAirPressure = 15.0;
        modified.isAutoIgnition = 0;
        activeFailures.push(
          "Detonation Knock: Premature fuel premixing ignites at 45° BTDC, opposing piston stroke",
        );
        refusalWarning =
          "THERMODYNAMIC KNOCK: Compression ratio insufficient for auto-ignition; premix charge causes catastrophic cylinder detonation.";
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
        modified.dewPointTempC = 28.0; // High uncontrolled moisture
        modified.targetRelativeHumidityPct = 85.0; // Supersaturation
        activeFailures.push(
          "Dew-Point Saturation Failure: Ambient moisture exceeds printing room tolerance, causing sheet wrinkling",
        );
        refusalWarning =
          "PSYCHROMETRIC INSTABILITY: Absence of dew-point spray regulation causes uncontrolled relative humidity swings.";
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

    default:
      break;
  }

  return {
    modifiedParams: modified,
    activeFailures,
    refusalWarning,
  };
}
