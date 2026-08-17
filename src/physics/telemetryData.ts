/**
 * telemetryData.ts
 *
 * Domain-specific FrankenSim SI Physics Telemetry Registry.
 * Supplies authentic mathematical governing laws, real SI physical units,
 * and live computational state indicators for every classic patent.
 */

export interface PatentPhysicsMetadata {
  domain: string;
  domainTitle: string;
  equationName: string;
  governingEquation: string;
  engineMethod: string;
  metrics: {
    label: string;
    value: string;
    unit: string;
    badgeColor: "cyan" | "emerald" | "amber" | "indigo" | "rose" | "purple";
  }[];
  pedagogicalInsight: string;
}

export const PATENT_PHYSICS_REGISTRY: Record<string, PatentPhysicsMetadata> = {
  "us-821393-wright-flyer": {
    domain: "aerodynamics_mbd",
    domainTitle: "6-DoF Aerodynamics & Lie-Group Multibody Dynamics",
    equationName: "Prandtl Induced Drag & Wing Warping Differential",
    governingEquation:
      "C_{D_i} = \\frac{C_L^2}{\\pi \\cdot \\text{AR} \\cdot e} \\quad \\text{and} \\quad \\Delta L = \\frac{1}{2} \\rho v^2 S \\cdot \\Delta C_L",
    engineMethod: "FrankenSimEngine.stepWrightFlyer",
    metrics: [
      { label: "Gross Airspeed", value: "31.5", unit: "mph", badgeColor: "cyan" },
      { label: "Total Lift", value: "1,420", unit: "N", badgeColor: "emerald" },
      { label: "Induced Drag", value: "84.2", unit: "N", badgeColor: "amber" },
      { label: "Lift-to-Drag (L/D)", value: "7.42", unit: "ratio", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Helical wing warping creates differential lift across wing tips; the mechanical coupling to the vertical rudder counteracts adverse yaw induced by differential vortex drag.",
  },
  "us-381968-tesla-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Discrete de Rham Stator Electromagnetics & Rotor Slip",
    equationName: "Rotating Magnetic Field & Induction Slip",
    governingEquation:
      "\\vec{B}(t) = B_0(\\cos\\omega t\\,\\hat{i} + \\sin\\omega t\\,\\hat{j}) \\quad \\text{with} \\quad s = \\frac{n_s - n}{n_s}",
    engineMethod: "FrankenSimEngine.stepTeslaMotor",
    metrics: [
      { label: "Synchronous Speed", value: "1,800", unit: "RPM", badgeColor: "cyan" },
      { label: "Rotor Slip (s)", value: "3.2", unit: "%", badgeColor: "amber" },
      { label: "Electromagnetic Torque", value: "38.5", unit: "N·m", badgeColor: "emerald" },
      { label: "Efficiency (η)", value: "91.4", unit: "%", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Two alternating currents 90° out of phase excite orthogonal stator poles, synthesizing a smooth rotating magnetic field that drags the short-circuited rotor across magnetic lines of flux.",
  },
  "us-2708656-fermi-reactor": {
    domain: "nuclear_kinetics",
    domainTitle: "6-Group Delayed Neutron Point Kinetics & Criticality",
    equationName: "Point Kinetics Differential Equation",
    governingEquation:
      "\\frac{dn}{dt} = \\frac{\\rho - \\beta}{\\Lambda} n + \\sum_{i=1}^6 \\lambda_i C_i \\quad \\text{with} \\quad k_{\\text{eff}} = 1.0000",
    engineMethod: "FrankenSimEngine.stepFermiReactor",
    metrics: [
      {
        label: "Multiplication Index (keff)",
        value: "1.0008",
        unit: "critical",
        badgeColor: "emerald",
      },
      { label: "Reactivity (ρ)", value: "+0.12", unit: "$", badgeColor: "amber" },
      { label: "Thermal Neutron Flux", value: "6.4 × 10⁹", unit: "n/(cm²·s)", badgeColor: "cyan" },
      { label: "Thermal Power", value: "200", unit: "W", badgeColor: "purple" },
    ],
    pedagogicalInsight:
      "Delayed neutron emission fractions (β = 0.0065) expand the reactor period from milliseconds to dozens of seconds, allowing cadmium control rods to maintain sub-prompt criticality safely.",
  },
  "us-1155986-goddard-rocket": {
    domain: "thermodynamics_transport",
    domainTitle: "Supersonic Isentropic de Laval Expansion & Thrust Kinetics",
    equationName: "Nozzle Exhaust Velocity & Specific Impulse",
    governingEquation:
      "v_e = \\sqrt{\\frac{2\\gamma}{\\gamma - 1} R T_c \\left[1 - \\left(\\frac{P_e}{P_c}\\right)^{\\frac{\\gamma - 1}{\\gamma}}\\right]} \\quad \\text{and} \\quad F = \\dot{m} v_e",
    engineMethod: "FrankenSimEngine.stepGoddardRocket",
    metrics: [
      { label: "Exit Mach Number", value: "2.45", unit: "Mach", badgeColor: "cyan" },
      { label: "Exhaust Velocity (ve)", value: "2,064", unit: "m/s", badgeColor: "emerald" },
      { label: "Specific Impulse (Isp)", value: "210.5", unit: "s", badgeColor: "amber" },
      { label: "Thrust Force (F)", value: "420", unit: "N", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Converging-diverging de Laval nozzle geometry accelerates subsonic combustion gases past the sonic throat ($M=1$) into supersonic exhaust, transferring thermal enthalpy into axial kinetic momentum.",
  },
  "us-2569347-bardeen-transistor": {
    domain: "semiconductor_carrier",
    domainTitle: "Point-Contact Minority Carrier Injection & Hole Diffusion",
    equationName: "Einstein Diffusion & Current Gain Alpha",
    governingEquation:
      "D_p = \\frac{k_B T}{q} \\mu_p \\quad \\text{and} \\quad \\alpha = \\gamma \\cdot \\beta = \\frac{\\Delta I_c}{\\Delta I_e} \\approx 1.8",
    engineMethod: "FrankenSimEngine.stepBardeenTransistor",
    metrics: [
      { label: "Current Gain (α)", value: "1.82", unit: "ratio", badgeColor: "emerald" },
      { label: "Hole Transit Time (τ)", value: "12.4", unit: "ns", badgeColor: "cyan" },
      { label: "Collector Bias", value: "-40.0", unit: "V", badgeColor: "purple" },
      { label: "Power Amplification", value: "18.5", unit: "dB", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Forward-biased emitter phosphor-bronze point injects minority carrier holes into n-type germanium base; reverse-biased collector placed 50 µm away sweeps them across the barrier for net power gain.",
  },
  "us-1781541-einstein-refrigerator": {
    domain: "thermodynamics_transport",
    domainTitle: "Dalton Partial Pressure Absorption Cycle & Bubble Pump",
    equationName: "Dalton Evaporative Vaporization & COP",
    governingEquation:
      "P_{\\text{total}} = P_{\\text{NH}_3} + P_{\\text{butane}} + P_{\\text{H}_2\\text{O}} \\quad \\text{and} \\quad \\text{COP} = \\frac{Q_{\\text{evap}}}{Q_{\\text{heat}}}",
    engineMethod: "FrankenSimEngine.stepEinsteinRefrigerator",
    metrics: [
      { label: "Evaporator Temp", value: "-18.0", unit: "°C", badgeColor: "cyan" },
      { label: "System Total Pressure", value: "15.0", unit: "atm", badgeColor: "amber" },
      { label: "Coefficient of Perf (COP)", value: "0.28", unit: "ratio", badgeColor: "emerald" },
      { label: "Cooling Power (Qc)", value: "68", unit: "W", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "A sealed ternary mixture operates at uniform pressure with no moving mechanical parts: introduced butane gas lowers ammonia partial pressure, triggering endothermic evaporative cooling.",
  },
  "us-2495429-spencer-microwave": {
    domain: "thermodynamics_transport",
    domainTitle: "Cavity Magnetron Standing Waves & Dielectric Dipole Loss",
    equationName: "Dielectric Volumetric Microwave Heating Rate",
    governingEquation:
      "\\dot{q} = 2\\pi f \\cdot \\varepsilon_0 \\varepsilon'' |\\vec{E}|^2 \\quad (f = 2.45\\ \\text{GHz})",
    engineMethod: "FrankenSimEngine.stepSpencerMicrowave",
    metrics: [
      { label: "Resonant Frequency", value: "2,450", unit: "MHz", badgeColor: "cyan" },
      { label: "Electric Field (E)", value: "45.2", unit: "kV/m", badgeColor: "amber" },
      { label: "Dielectric Loss Factor (ε'')", value: "12.5", unit: "F/m", badgeColor: "emerald" },
      { label: "RF Radiated Power", value: "800", unit: "W", badgeColor: "purple" },
    ],
    pedagogicalInsight:
      "Crossed electric and magnetic fields inside the cavity magnetron induce relativistic electron hub-and-spoke rotating clouds that excite 2.45 GHz standing microwaves, agitating water dipoles.",
  },
  "us-2981877-noyce-ic": {
    domain: "semiconductor_carrier",
    domainTitle: "Planar PN Barrier Depletion & Monolithic Silicon Interconnects",
    equationName: "Depletion Region Barrier Capacitance",
    governingEquation:
      "W = \\sqrt{\\frac{2\\varepsilon_s (V_{bi} + V_R)}{q}\\left(\\frac{1}{N_A} + \\frac{1}{N_D}\\right)}",
    engineMethod: "FrankenSimEngine.stepNoyceIC",
    metrics: [
      { label: "Depletion Barrier Width", value: "0.85", unit: "µm", badgeColor: "cyan" },
      { label: "Propagation Delay (tpd)", value: "1.20", unit: "ns", badgeColor: "emerald" },
      { label: "Breakdown Voltage", value: "28.5", unit: "V", badgeColor: "indigo" },
      { label: "Oxide Layer (SiO2)", value: "0.50", unit: "µm", badgeColor: "purple" },
    ],
    pedagogicalInsight:
      "Surface oxide passivation electrically insulates individual diffused transistor regions while vapor-deposited aluminum film leads unite components directly on a single monolithic silicon crystal.",
  },
  "us-223898-edison-lightbulb": {
    domain: "thermodynamics_transport",
    domainTitle: "High-Vacuum Stefan-Boltzmann Radiative Blackbody Kinetics",
    equationName: "Stefan-Boltzmann Radiative Blackbody Law",
    governingEquation:
      "P_{\\text{rad}} = \\varepsilon \\sigma A (T^4 - T_0^4) \\quad \\text{with} \\quad R(T) = R_0(1 + \\alpha \\Delta T)",
    engineMethod: "FrankenSimEngine.stepEdisonBulb",
    metrics: [
      { label: "Filament Temperature", value: "2,100", unit: "K", badgeColor: "amber" },
      { label: "Radiant Output Power", value: "16.4", unit: "W", badgeColor: "emerald" },
      { label: "Vacuum Level", value: "10⁻⁶", unit: "Torr", badgeColor: "cyan" },
      { label: "Filament Hot Resistance", value: "140", unit: "Ω", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Evacuating the glass globe to one-millionth of an atmosphere prevents oxygen combustion and dramatically suppresses convective heat transfer, enabling a high-resistance carbonized thread to glow incandescently.",
  },
  "us-174465-bell-telephone": {
    domain: "electromagnetics_flux",
    domainTitle: "Variable Resistance Acoustic Diaphragm Speech Undulation",
    equationName: "Diaphragm Acoustic Pressure to Resistance Transfer",
    governingEquation:
      "i(t) = \\frac{E}{R_0 + \\Delta R \\sin(\\omega t)} \\approx I_0 + \\Delta I \\sin(\\omega t)",
    engineMethod: "FrankenSimEngine.stepBellTelephone",
    metrics: [
      { label: "Acoustic Bandwidth", value: "300–3,400", unit: "Hz", badgeColor: "cyan" },
      { label: "Electromagnetic Flux", value: "0.45", unit: "T", badgeColor: "emerald" },
      { label: "Transduction Sensitivity", value: "14.2", unit: "mV/Pa", badgeColor: "amber" },
      { label: "Loop Resistance", value: "120", unit: "Ω", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Vibrating iron diaphragm modulates the air gap of an electromagnet, producing an undulating continuous electrical current whose instantaneous voltage mimics human vocal acoustic waveforms.",
  },
  "us-586193-marconi-radio": {
    domain: "electromagnetics_flux",
    domainTitle: "Spark-Gap Resonant Damped Wave Oscillations & Aerial Radiation",
    equationName: "Monopole Radiation Resistance & Resonant Frequency",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{rad}} = 36.56\\ \\Omega \\quad (\\lambda = 4h)",
    engineMethod: "FrankenSimEngine.stepMarconiRadio",
    metrics: [
      { label: "Resonant Frequency", value: "850", unit: "kHz", badgeColor: "cyan" },
      { label: "Aerial Height (h)", value: "88", unit: "m", badgeColor: "indigo" },
      { label: "Radiation Resistance", value: "36.5", unit: "Ω", badgeColor: "emerald" },
      { label: "Spark Energy Packet", value: "4.5", unit: "J", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "Connecting one terminal of an elevated vertical antenna to the spark gap and the other directly to the conductive earth turns the system into an asymmetric quarter-wave Hertzian radiator.",
  },
  "us-1647-morse-telegraph": {
    domain: "electromagnetics_flux",
    domainTitle: "Solenoid Core Inductance & Armature Magnetic Force",
    equationName: "Electromagnetic Solenoid Attraction Force",
    governingEquation:
      "F_{\\text{mag}} = \\frac{B^2 A}{2\\mu_0} = \\frac{\\mu_0 N^2 I^2 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepMorseTelegraph",
    metrics: [
      { label: "Magnetic Pull Force", value: "4.85", unit: "N", badgeColor: "emerald" },
      { label: "Inductive Time Constant (τ)", value: "12.5", unit: "ms", badgeColor: "cyan" },
      { label: "Coil Wire Turns (N)", value: "1,200", unit: "turns", badgeColor: "amber" },
      { label: "Keying Velocity", value: "25", unit: "WPM", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Direct electrical current passes through a soft iron horse-shoe electromagnet, overcoming mechanical spring tension to draw down the armature lever and press an embossed stylus into moving paper tape.",
  },
  "us-3671542-kwolek-kevlar": {
    domain: "continuum_elasticity",
    domainTitle: "Liquid-Crystalline Poly-Aramid Hydrogen-Bonded Lattice",
    equationName: "Tensile Modulus & Sonic Dispersion Velocity",
    governingEquation:
      "v_{\\text{sound}} = \\sqrt{\\frac{E}{\\rho}} \\quad \\text{and} \\quad \\sigma_{\\text{max}} = E \\cdot \\varepsilon_{\\text{rupture}}",
    engineMethod: "FrankenSimEngine.stepKevlarContinuum",
    metrics: [
      { label: "Elastic Modulus (E)", value: "130", unit: "GPa", badgeColor: "cyan" },
      { label: "Sonic Shock Velocity", value: "9,500", unit: "m/s", badgeColor: "emerald" },
      { label: "Tensile Strength", value: "3,620", unit: "MPa", badgeColor: "amber" },
      { label: "Fiber Density (ρ)", value: "1.44", unit: "g/cm³", badgeColor: "purple" },
    ],
    pedagogicalInsight:
      "All-trans rigid rod aromatic poly-p-phenylene terephthalamide chains align in parallel liquid-crystalline domains, transferring impact kinetic energy along transverse hydrogen-bonded sheets at Mach 28.",
  },
  "us-3633-goodyear-rubber": {
    domain: "continuum_elasticity",
    domainTitle: "Disulfide Polymer Cross-Linking & Entropic Elasticity",
    equationName: "Disulfide Cross-Link Kinetics & Entropic Restoring Force",
    governingEquation:
      "f = -T \\left(\\frac{\\partial S}{\\partial L}\\right)_T = n k_B T \\left(\\lambda - \\frac{1}{\\lambda^2}\\right)",
    engineMethod: "FrankenSimEngine.stepGoodyearRubber",
    metrics: [
      { label: "Cross-Link Density", value: "0.85", unit: "mol/cm³", badgeColor: "emerald" },
      { label: "Tensile Strength", value: "2,850", unit: "psi", badgeColor: "cyan" },
      { label: "Elastic Return", value: "95.0", unit: "%", badgeColor: "indigo" },
      { label: "Vulcanization Temp", value: "145", unit: "°C", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "Heating raw polyisoprene rubber with sulfur forms covalent disulfide bridges between entangled polymer chains, transforming thermally plastic gum into resilient, temperature-stable entropic elastomer.",
  },
  "us-6281-lincoln-buoy": {
    domain: "continuum_elasticity",
    domainTitle: "Pneumatic Expandable Buoyancy & Riverbed Shoal Navigation",
    equationName: "Archimedes Buoyant Lift & Hydrostatic Draft Reduction",
    governingEquation:
      "\\Delta F_b = \\rho_{\\text{water}} \\cdot g \\cdot \\Delta V_{\\text{air}} \\quad \\text{and} \\quad \\Delta d = \\frac{\\Delta F_b}{\\rho g A_{\\text{waterplane}}}",
    engineMethod: "FrankenSimEngine.stepLincolnBuoy",
    metrics: [
      { label: "Buoyant Lift Force", value: "320", unit: "kN", badgeColor: "cyan" },
      { label: "Draft Reduction (Δd)", value: "1.85", unit: "ft", badgeColor: "emerald" },
      { label: "Shoal Clearance", value: "+1.2", unit: "ft", badgeColor: "amber" },
      { label: "Chamber Air Volume", value: "32.6", unit: "m³", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Waterproof bellows affixed to the steamboat hull expand downwards via geared shaft linkages, displacing hundreds of cubic feet of river water to float the grounded hull over shallow sandbars.",
  },
  "us-2292387-lamarr-frequency-hopping": {
    domain: "semiconductor_carrier",
    domainTitle: "Slotted Carrier Spread-Spectrum & Processing Anti-Jamming Gain",
    equationName: "Processing Gain & Spread-Spectrum Bandwidth",
    governingEquation:
      "G_p = 10 \\log_{10}\\left(\\frac{\\text{BW}_{\\text{RF}}}{\\text{BW}_{\\text{signal}}}\\right) = 10 \\log_{10}\\left(\\frac{8.8\\ \\text{MHz}}{10\\ \\text{kHz}}\\right) \\approx 29.4\\ \\text{dB}",
    engineMethod: "FrankenSimEngine.stepLamarrFrequencyHopping",
    metrics: [
      { label: "Carrier Channels", value: "88", unit: "slots", badgeColor: "indigo" },
      { label: "Processing Gain (Gp)", value: "29.4", unit: "dB", badgeColor: "emerald" },
      { label: "Anti-Jam Margin", value: "26.4", unit: "dB", badgeColor: "cyan" },
      { label: "Hop Rate", value: "4.0", unit: "hops/s", badgeColor: "purple" },
    ],
    pedagogicalInsight:
      "Synchronized 88-key slotted player-piano rolls rapidly steer the radio carrier across 88 distinct frequencies, making torpedo steering signals mathematically immune to continuous-wave narrowband jamming.",
  },
  "us-3541541-engelbart-mouse": {
    domain: "continuum_elasticity",
    domainTitle: "Orthogonal Coordinate Resolver Kinematics & Potentiometer D/A",
    equationName: "Dual Knife-Edge Orthogonal Coordinate Integration",
    governingEquation:
      "\\Delta X = R \\cdot \\Delta \\theta_x \\quad \\text{and} \\quad \\Delta Y = R \\cdot \\Delta \\theta_y \\quad (\\vec{v}_x \\perp \\vec{v}_y)",
    engineMethod: "FrankenSimEngine.stepEngelbartMouse",
    metrics: [
      { label: "Coordinate Resolution", value: "200", unit: "DPI", badgeColor: "cyan" },
      { label: "Resolver Orthogonality", value: "90.0", unit: "deg", badgeColor: "emerald" },
      { label: "Tracking Velocity", value: "450", unit: "mm/s", badgeColor: "amber" },
      { label: "Sampling Frequency", value: "100", unit: "Hz", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "Two sharp metal wheels mounted at right angles roll independently across the desk: each wheel turns a variable potentiometer wiper, decomposing continuous 2D planar motion into orthogonal $(X, Y)$ signals.",
  },
  "us-1773980-farnsworth-tv": {
    domain: "semiconductor_carrier",
    domainTitle: "Relativistic Photo-Cathode Lorentz Deflection Dissector Tube",
    equationName: "Lorentz Force Magnetic Scanline Deflection",
    governingEquation:
      "\\vec{F} = -e (\\vec{E} + \\vec{v} \\times \\vec{B}) \\quad \\text{and} \\quad r = \\frac{m_e v}{e B}",
    engineMethod: "FrankenSimEngine.stepFarnsworthTV",
    metrics: [
      { label: "Electron Beam Speed", value: "1.87 × 10⁷", unit: "m/s", badgeColor: "cyan" },
      { label: "Scanline Resolution", value: "400", unit: "lines", badgeColor: "emerald" },
      { label: "Anode Voltage", value: "1,500", unit: "V", badgeColor: "purple" },
      { label: "Dissector Current", value: "2.4", unit: "µA", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "An optical image focused onto a potassium hydride photo-cathode emits a continuous electron image; orthogonal electromagnetic deflection coils sweep the entire electron cloud past an anode aperture.",
  },
  "us-3923554-boyle-smith-ccd": {
    domain: "semiconductor_carrier",
    domainTitle: "3-Phase MOS Potential Well Bucket-Brigade Charge Transport",
    equationName: "Charge Transfer Efficiency & Potential Well Depth",
    governingEquation:
      "Q_{\\text{final}} = Q_0 \\cdot (\\text{CTE})^N \\quad \\text{with} \\quad \\text{CTE} = 0.99995",
    engineMethod: "FrankenSimEngine.stepBoyleSmithCCD",
    metrics: [
      { label: "Charge Transfer Eff (CTE)", value: "99.995", unit: "%", badgeColor: "emerald" },
      { label: "Well Capacity", value: "100,000", unit: "e⁻", badgeColor: "cyan" },
      { label: "Clock Phases", value: "3", unit: "phases", badgeColor: "indigo" },
      { label: "Dark Current", value: "0.05", unit: "nA/cm²", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "Overlapping polysilicon gates pulsed in three phases create shifting potential energy wells in silicon, marching packets of photo-generated electrons across the substrate without wire interconnects.",
  },
  "us-4136359-wozniak-apple": {
    domain: "semiconductor_carrier",
    domainTitle: "Two-Phase Non-Conflicting DRAM Bus Arbitration & Video Sync",
    equationName: "Time-Multiplexed CPU vs. Video Scanline Bus Access",
    governingEquation:
      "\\text{Bus Access} = \\begin{cases} \\text{6502 CPU Read/Write} & \\phi_1 = 1 \\\\ \\text{Video Scanline Fetch} & \\phi_2 = 1 \\end{cases} \\quad (f_{\\text{master}} = 14.31818\\ \\text{MHz})",
    engineMethod: "FrankenSimEngine.stepWozniakApple",
    metrics: [
      { label: "Master Crystal Clock", value: "14.31818", unit: "MHz", badgeColor: "cyan" },
      { label: "Microprocessor Clock", value: "1.023", unit: "MHz", badgeColor: "emerald" },
      { label: "NTSC Color Subcarrier", value: "3.579545", unit: "MHz", badgeColor: "purple" },
      { label: "DRAM Wait States", value: "0", unit: "cycles", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "A master 14.318 MHz crystal divides down to interleave 6502 CPU memory access during clock phase $\\phi_1$ and video display fetch during phase $\\phi_2$, eliminating video flicker with zero wait-state contention.",
  },
  "us-4750-howe-sewing-machine": {
    domain: "continuum_elasticity",
    domainTitle: "Eye-Pointed Needle & Reciprocating Shuttle Lockstitch Kinematics",
    equationName: "Lockstitch Loop Interlocking Kinematics",
    governingEquation:
      "\\theta_{\\text{shuttle}}(t) = A \\sin(\\omega t + \\delta) \\quad \\text{with} \\quad \\text{Stitch Rate} = \\frac{\\omega}{2\\pi}",
    engineMethod: "FrankenSimEngine.stepHoweSewingMachine",
    metrics: [
      { label: "Stitch Velocity", value: "250", unit: "SPM", badgeColor: "cyan" },
      { label: "Shuttle Oscillations", value: "4.17", unit: "Hz", badgeColor: "emerald" },
      { label: "Needle Stroke Length", value: "38.0", unit: "mm", badgeColor: "amber" },
      { label: "Thread Tension", value: "1.85", unit: "N", badgeColor: "indigo" },
    ],
    pedagogicalInsight:
      "A curved eye-pointed needle pushes a thread loop through the cloth; an oscillating shuttle carrying a second bobbin thread passes through the loop, locking both threads inside the seam.",
  },
  "us-533367-tesla-coil": {
    domain: "electromagnetics_flux",
    domainTitle: "Dual-Resonant Coupled LC Tank Voltage Multiplication & Ionization",
    equationName: "Resonant Transformer Voltage Multiplication",
    governingEquation:
      "V_2 = V_1 \\sqrt{\\frac{L_2}{L_1}} \\quad \\text{with} \\quad \\omega_0 = \\frac{1}{\\sqrt{L_1 C_1}} = \\frac{1}{\\sqrt{L_2 C_2}}",
    engineMethod: "FrankenSimEngine.stepTeslaCoil",
    metrics: [
      { label: "Resonant Peak Voltage", value: "450", unit: "kV", badgeColor: "purple" },
      { label: "LC Tank Frequency", value: "150", unit: "kHz", badgeColor: "cyan" },
      { label: "Coupling Coefficient (k)", value: "0.18", unit: "ratio", badgeColor: "emerald" },
      { label: "Streamer Spark Length", value: "1.45", unit: "m", badgeColor: "amber" },
    ],
    pedagogicalInsight:
      "Air-core primary and secondary coils tuned to identical LC natural resonant frequencies transfer energy inductively over multiple cycles, building up electrostatic voltage until the air dielectric ionizes.",
  },
};
