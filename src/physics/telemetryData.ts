/**
 * telemetryData.ts
 *
 * Domain-specific FrankenSim SI Physics Telemetry Registry with live reactive computational models.
 * Supplies authentic mathematical governing laws, real SI physical units,
 * interactive parameter controllers, and 60-FPS computed telemetry states for every classic patent.
 */

export interface PhysicsControl {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface PhysicsMetric {
  label: string;
  value: string;
  unit: string;
  badgeColor: "cyan" | "emerald" | "amber" | "indigo" | "rose" | "purple";
  progressPct?: number; // 0 to 100 for live graphic meter
}

export interface PatentPhysicsMetadata {
  domain: string;
  domainTitle: string;
  equationName: string;
  governingEquation: string;
  engineMethod: string;
  controls: PhysicsControl[];
  computeMetrics: (params: Record<string, number>) => PhysicsMetric[];
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
    controls: [
      {
        id: "airspeed",
        label: "Gross Airspeed",
        min: 15,
        max: 45,
        step: 0.5,
        defaultValue: 31.5,
        unit: "mph",
      },
      {
        id: "wingWarp",
        label: "Wing Warp Deflection",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 4.0,
        unit: "°",
      },
      {
        id: "rudder",
        label: "Rudder Deflection",
        min: -20,
        max: 20,
        step: 0.5,
        defaultValue: -2.0,
        unit: "°",
      },
    ],
    computeMetrics: (p) => {
      const vMps = (p.airspeed ?? 31.5) * 0.44704;
      const warp = p.wingWarp ?? 4.0;
      const rudder = p.rudder ?? -2.0;

      const baseLift = 0.5 * 1.225 * vMps ** 2 * 47.4 * 0.45;
      const deltaLift = warp * 18.5;
      const liftN = Math.max(0, baseLift + deltaLift);
      const indDrag = liftN ** 2 / (Math.PI * 6.4 * 0.85 * 0.5 * 1.225 * vMps ** 2 * 47.4 + 1e-4);
      const totalDrag = indDrag + 0.5 * 1.225 * vMps ** 2 * 4.2;
      const ldRatio = totalDrag > 0 ? liftN / totalDrag : 0;
      const netYaw = warp * 0.08 + rudder * 0.12;

      return [
        {
          label: "Gross Lift",
          value: Math.round(liftN).toLocaleString(),
          unit: "N",
          badgeColor: "emerald",
          progressPct: Math.min(100, (liftN / 2500) * 100),
        },
        {
          label: "Induced Drag",
          value: indDrag.toFixed(1),
          unit: "N",
          badgeColor: "amber",
          progressPct: Math.min(100, (indDrag / 150) * 100),
        },
        {
          label: "Lift-to-Drag (L/D)",
          value: ldRatio.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (ldRatio / 10) * 100),
        },
        {
          label: "Net Yaw Stability",
          value: netYaw >= 0 ? `+${netYaw.toFixed(2)}` : netYaw.toFixed(2),
          unit: "N·m",
          badgeColor: Math.abs(netYaw) < 0.5 ? "cyan" : "rose",
          progressPct: Math.max(0, 100 - Math.abs(netYaw) * 40),
        },
      ];
    },
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
    controls: [
      {
        id: "frequency",
        label: "Line AC Frequency",
        min: 20,
        max: 120,
        step: 1,
        defaultValue: 60,
        unit: "Hz",
      },
      {
        id: "loadTorque",
        label: "Mechanical Load Torque",
        min: 5,
        max: 45,
        step: 0.5,
        defaultValue: 38.5,
        unit: "N·m",
      },
    ],
    computeMetrics: (p) => {
      const f = p.frequency ?? 60;
      const torque = p.loadTorque ?? 38.5;
      const synchRpm = (120 * f) / 4;
      const slipPct = Math.min(95, Math.max(1.5, (torque / 45) * 4.2));
      const rotorRpm = Math.round(synchRpm * (1 - slipPct / 100));
      const _shaftWatts = (torque * (rotorRpm * 2 * Math.PI)) / 60;
      const effPct = Math.min(96, Math.max(40, 94 - (slipPct - 3) * 3));

      return [
        {
          label: "Synchronous Speed",
          value: Math.round(synchRpm).toLocaleString(),
          unit: "RPM",
          badgeColor: "cyan",
          progressPct: (synchRpm / 3600) * 100,
        },
        {
          label: "Rotor Speed",
          value: rotorRpm.toLocaleString(),
          unit: "RPM",
          badgeColor: "emerald",
          progressPct: (rotorRpm / synchRpm) * 100,
        },
        {
          label: "Rotor Slip (s)",
          value: slipPct.toFixed(1),
          unit: "%",
          badgeColor: slipPct < 8 ? "amber" : "rose",
          progressPct: Math.min(100, slipPct * 5),
        },
        {
          label: "Efficiency (η)",
          value: effPct.toFixed(1),
          unit: "%",
          badgeColor: "indigo",
          progressPct: effPct,
        },
      ];
    },
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
    controls: [
      {
        id: "rodWithdrawal",
        label: "Cadmium Rod Withdrawal",
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 83.5,
        unit: "%",
      },
      {
        id: "moderatorPurity",
        label: "Graphite Moderator Purity",
        min: 80,
        max: 100,
        step: 0.5,
        defaultValue: 99.5,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const rod = p.rodWithdrawal ?? 83.5;
      const mod = p.moderatorPurity ?? 99.5;
      const keff = 0.85 + (rod / 100) * 0.18 * (mod / 100);
      const rhoDollars = (keff - 1.0) / (keff * 0.0065);
      const thermalPower =
        keff > 1.002
          ? Math.round(500 * (keff / 1.002) ** 4)
          : keff >= 0.998
            ? 200
            : Math.max(1, Math.round(20 * (keff / 0.99)));
      const flux = (thermalPower * 3.2e7).toExponential(2);

      return [
        {
          label: "Multiplication (keff)",
          value: keff.toFixed(4),
          unit: "critical",
          badgeColor: keff > 1.005 ? "rose" : keff >= 0.998 ? "emerald" : "amber",
          progressPct: Math.min(100, (keff / 1.05) * 100),
        },
        {
          label: "Reactivity (ρ)",
          value: rhoDollars >= 0 ? `+${rhoDollars.toFixed(2)}` : rhoDollars.toFixed(2),
          unit: "$",
          badgeColor: rhoDollars > 1 ? "rose" : "amber",
          progressPct: Math.min(100, Math.max(0, (rhoDollars + 2) * 25)),
        },
        {
          label: "Thermal Power",
          value: thermalPower.toLocaleString(),
          unit: "W",
          badgeColor: "purple",
          progressPct: Math.min(100, (thermalPower / 1000) * 100),
        },
        {
          label: "Thermal Flux",
          value: flux,
          unit: "n/(cm²·s)",
          badgeColor: "cyan",
          progressPct: Math.min(100, (thermalPower / 500) * 100),
        },
      ];
    },
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
    controls: [
      {
        id: "chamberPressure",
        label: "Chamber Pressure (Pc)",
        min: 150,
        max: 600,
        step: 10,
        defaultValue: 350,
        unit: "psi",
      },
      {
        id: "expansionRatio",
        label: "Nozzle Expansion Ratio (Ae/At)",
        min: 2.0,
        max: 8.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ratio",
      },
    ],
    computeMetrics: (p) => {
      const pc = p.chamberPressure ?? 350;
      const ar = p.expansionRatio ?? 3.5;
      const mach = Math.sqrt((2 / 0.24) * (ar ** (2 / 2.24) - 1));
      const ve = Math.round(1650 * Math.sqrt(1 - (1 / ar) ** 0.24) * 1.62);
      const isp = (ve / 9.80665).toFixed(1);
      const thrust = Math.round(0.205 * ve * (pc / 350));

      return [
        {
          label: "Exit Mach Number",
          value: mach.toFixed(2),
          unit: "Mach",
          badgeColor: "cyan",
          progressPct: Math.min(100, (mach / 4.0) * 100),
        },
        {
          label: "Exhaust Velocity",
          value: ve.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: Math.min(100, (ve / 3000) * 100),
        },
        {
          label: "Specific Impulse (Isp)",
          value: isp,
          unit: "s",
          badgeColor: "amber",
          progressPct: Math.min(100, (Number(isp) / 300) * 100),
        },
        {
          label: "Thrust Force (F)",
          value: thrust.toLocaleString(),
          unit: "N",
          badgeColor: "indigo",
          progressPct: Math.min(100, (thrust / 800) * 100),
        },
      ];
    },
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
    controls: [
      {
        id: "emitterCurrent",
        label: "Emitter Current (Ie)",
        min: 0.5,
        max: 4.0,
        step: 0.1,
        defaultValue: 1.5,
        unit: "mA",
      },
      {
        id: "collectorBias",
        label: "Collector Reverse Bias",
        min: -80,
        max: -10,
        step: 1,
        defaultValue: -40,
        unit: "V",
      },
      {
        id: "pointSpacing",
        label: "Whiskers Contact Spacing",
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 50,
        unit: "µm",
      },
    ],
    computeMetrics: (p) => {
      const ie = p.emitterCurrent ?? 1.5;
      const vcoll = Math.abs(p.collectorBias ?? -40);
      const spacing = p.pointSpacing ?? 50;
      const transitTimeNs = ((spacing * 1e-4) ** 2 / (2 * 49.2)) * 1e9;
      const alpha = Number((1.95 * Math.max(0.2, 1 - spacing / 120)).toFixed(2));
      const powerGainDb = (10 * Math.log10(alpha ** 2 * (vcoll / 1.5))).toFixed(1);
      const ic = (ie * alpha + vcoll * 0.04).toFixed(2);

      return [
        {
          label: "Current Gain (α)",
          value: alpha.toFixed(2),
          unit: "ratio",
          badgeColor: alpha >= 1.0 ? "emerald" : "amber",
          progressPct: Math.min(100, (alpha / 2.5) * 100),
        },
        {
          label: "Hole Transit Time",
          value: transitTimeNs.toFixed(1),
          unit: "ns",
          badgeColor: "cyan",
          progressPct: Math.min(100, (transitTimeNs / 30) * 100),
        },
        {
          label: "Collector Current",
          value: ic,
          unit: "mA",
          badgeColor: "purple",
          progressPct: Math.min(100, (Number(ic) / 10) * 100),
        },
        {
          label: "Power Amplification",
          value: `${powerGainDb}`,
          unit: "dB",
          badgeColor: "indigo",
          progressPct: Math.min(100, (Number(powerGainDb) / 25) * 100),
        },
      ];
    },
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
    controls: [
      {
        id: "heatInput",
        label: "Generator Heat Input",
        min: 100,
        max: 350,
        step: 5,
        defaultValue: 220,
        unit: "W",
      },
      {
        id: "totalPressure",
        label: "System Total Pressure",
        min: 8,
        max: 22,
        step: 0.5,
        defaultValue: 15.0,
        unit: "atm",
      },
    ],
    computeMetrics: (p) => {
      const qIn = p.heatInput ?? 220;
      const press = p.totalPressure ?? 15.0;
      const evapTemp = -25 + (press - 10) * 1.4;
      const cop = Number((0.32 * (1 - Math.abs(evapTemp) / 120)).toFixed(2));
      const coolingWatts = Math.round(qIn * cop);

      return [
        {
          label: "Evaporator Temp",
          value: evapTemp.toFixed(1),
          unit: "°C",
          badgeColor: evapTemp < 0 ? "cyan" : "amber",
          progressPct: Math.min(100, Math.max(0, (30 - evapTemp) * 2)),
        },
        {
          label: "Cooling Power (Qc)",
          value: coolingWatts.toString(),
          unit: "W",
          badgeColor: "emerald",
          progressPct: Math.min(100, (coolingWatts / 120) * 100),
        },
        {
          label: "Thermodynamic COP",
          value: cop.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (cop / 0.5) * 100),
        },
        {
          label: "Total System Pressure",
          value: press.toFixed(1),
          unit: "atm",
          badgeColor: "purple",
          progressPct: (press / 25) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "anodeVoltage",
        label: "Magnetron Anode Voltage",
        min: 1200,
        max: 3000,
        step: 50,
        defaultValue: 2200,
        unit: "V",
      },
      {
        id: "rfPowerSetting",
        label: "RF Power Output",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 800,
        unit: "W",
      },
    ],
    computeMetrics: (p) => {
      const v = p.anodeVoltage ?? 2200;
      const rfWatts = p.rfPowerSetting ?? 800;
      const eField = (30 + (v / 3000) * 25).toFixed(1);
      const heatRate = ((rfWatts / 800) * 14.2).toFixed(1);

      return [
        {
          label: "Resonant Frequency",
          value: "2,450",
          unit: "MHz",
          badgeColor: "cyan",
          progressPct: 80,
        },
        {
          label: "Electric Field (E)",
          value: eField,
          unit: "kV/m",
          badgeColor: "amber",
          progressPct: (Number(eField) / 60) * 100,
        },
        {
          label: "Volumetric Heating",
          value: heatRate,
          unit: "W/cm³",
          badgeColor: "emerald",
          progressPct: (Number(heatRate) / 25) * 100,
        },
        {
          label: "RF Output Power",
          value: rfWatts.toString(),
          unit: "W",
          badgeColor: "purple",
          progressPct: (rfWatts / 1200) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "reverseBias",
        label: "Reverse Bias Voltage (VR)",
        min: 1,
        max: 20,
        step: 0.5,
        defaultValue: 5.0,
        unit: "V",
      },
      {
        id: "oxideThickness",
        label: "SiO2 Oxide Thickness",
        min: 0.2,
        max: 1.2,
        step: 0.05,
        defaultValue: 0.5,
        unit: "µm",
      },
    ],
    computeMetrics: (p) => {
      const vr = p.reverseBias ?? 5.0;
      const tox = p.oxideThickness ?? 0.5;
      const w = (0.5 * Math.sqrt(0.7 + vr)).toFixed(2);
      const propDelay = (0.8 + (1 / tox) * 0.2 + vr * 0.02).toFixed(2);
      const cap = (28 / Number(w)).toFixed(1);

      return [
        {
          label: "Depletion Barrier (W)",
          value: w,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: (Number(w) / 2.5) * 100,
        },
        {
          label: "Junction Capacitance",
          value: cap,
          unit: "pF/mm²",
          badgeColor: "amber",
          progressPct: (Number(cap) / 60) * 100,
        },
        {
          label: "Propagation Delay (tpd)",
          value: propDelay,
          unit: "ns",
          badgeColor: "emerald",
          progressPct: (Number(propDelay) / 3.0) * 100,
        },
        {
          label: "Breakdown Margin",
          value: (35 - vr).toFixed(1),
          unit: "V",
          badgeColor: "indigo",
          progressPct: ((35 - vr) / 35) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "voltage",
        label: "Applied Terminal Voltage",
        min: 40,
        max: 130,
        step: 1,
        defaultValue: 110,
        unit: "V",
      },
      {
        id: "filamentLength",
        label: "Carbon Filament Length",
        min: 10,
        max: 30,
        step: 1,
        defaultValue: 22,
        unit: "cm",
      },
    ],
    computeMetrics: (p) => {
      const v = p.voltage ?? 110;
      const len = p.filamentLength ?? 22;
      const tempK = Math.round(1200 + (v / 130) * 1150);
      const res = Math.round(90 + (tempK / 2350) * 60 * (len / 22));
      const powerWatts = Number((v ** 2 / res).toFixed(1));
      const lumEff = Math.max(0.1, ((tempK - 1400) / 1000) ** 2 * 2.8).toFixed(2);

      return [
        {
          label: "Filament Temperature",
          value: tempK.toLocaleString(),
          unit: "K",
          badgeColor: "amber",
          progressPct: (tempK / 2500) * 100,
        },
        {
          label: "Radiant Output Power",
          value: powerWatts.toFixed(1),
          unit: "W",
          badgeColor: "emerald",
          progressPct: (powerWatts / 120) * 100,
        },
        {
          label: "Hot Resistance",
          value: res.toString(),
          unit: "Ω",
          badgeColor: "indigo",
          progressPct: (res / 200) * 100,
        },
        {
          label: "Luminous Efficiency",
          value: lumEff,
          unit: "lm/W",
          badgeColor: "cyan",
          progressPct: (Number(lumEff) / 4.0) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "voiceAmplitude",
        label: "Voice Sound Pressure",
        min: 40,
        max: 95,
        step: 1,
        defaultValue: 75,
        unit: "dB",
      },
      {
        id: "airGap",
        label: "Diaphragm Magnetic Gap",
        min: 0.1,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.35,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const db = p.voiceAmplitude ?? 75;
      const gap = p.airGap ?? 0.35;
      const displMicrons = (10 ** ((db - 40) / 30) * 0.45).toFixed(2);
      const modCurrent = ((Number(displMicrons) / (gap * 1000)) * 18.5).toFixed(2);
      const sens = (18.5 / (gap + 0.1)).toFixed(1);

      return [
        {
          label: "Diaphragm Deflection",
          value: displMicrons,
          unit: "µm",
          badgeColor: "cyan",
          progressPct: (Number(displMicrons) / 5) * 100,
        },
        {
          label: "Modulated Signal",
          value: modCurrent,
          unit: "mA",
          badgeColor: "emerald",
          progressPct: (Number(modCurrent) / 20) * 100,
        },
        {
          label: "Transduction Sensitivity",
          value: sens,
          unit: "mV/Pa",
          badgeColor: "amber",
          progressPct: (Number(sens) / 40) * 100,
        },
        {
          label: "Acoustic Bandwidth",
          value: "300–3,400",
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: 85,
        },
      ];
    },
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
    controls: [
      {
        id: "sparkVoltage",
        label: "Induction Coil Voltage",
        min: 10,
        max: 50,
        step: 1,
        defaultValue: 28,
        unit: "kV",
      },
      {
        id: "aerialHeight",
        label: "Vertical Aerial Height",
        min: 30,
        max: 120,
        step: 2,
        defaultValue: 88,
        unit: "m",
      },
    ],
    computeMetrics: (p) => {
      const v = p.sparkVoltage ?? 28;
      const h = p.aerialHeight ?? 88;
      const freqKhz = Math.round(3e8 / (4 * h) / 1000);
      const sparkEnergy = (0.5 * 12e-9 * (v * 1000) ** 2).toFixed(2);
      const rangeKm = Math.round(Math.sqrt(h * v * 0.8));

      return [
        {
          label: "Resonant Frequency",
          value: freqKhz.toString(),
          unit: "kHz",
          badgeColor: "cyan",
          progressPct: (freqKhz / 2500) * 100,
        },
        {
          label: "Spark Energy Packet",
          value: sparkEnergy,
          unit: "J",
          badgeColor: "amber",
          progressPct: (Number(sparkEnergy) / 15) * 100,
        },
        {
          label: "Radiation Resistance",
          value: "36.5",
          unit: "Ω",
          badgeColor: "emerald",
          progressPct: 75,
        },
        {
          label: "Estimated Range",
          value: rangeKm.toString(),
          unit: "km",
          badgeColor: "indigo",
          progressPct: (rangeKm / 80) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "currentMa",
        label: "Telegraph Line Current",
        min: 20,
        max: 120,
        step: 2,
        defaultValue: 65,
        unit: "mA",
      },
      {
        id: "wireTurns",
        label: "Electromagnet Coil Turns",
        min: 500,
        max: 2000,
        step: 50,
        defaultValue: 1200,
        unit: "turns",
      },
    ],
    computeMetrics: (p) => {
      const i = (p.currentMa ?? 65) / 1000;
      const n = p.wireTurns ?? 1200;
      const forceN = ((4e-7 * Math.PI * (n * i) ** 2 * 0.0004) / (2 * 0.0015 ** 2)).toFixed(2);
      const tauMs = (n * 0.00012 * 10).toFixed(1);

      return [
        {
          label: "Magnetic Pull Force",
          value: forceN,
          unit: "N",
          badgeColor: Number(forceN) >= 2 ? "emerald" : "amber",
          progressPct: (Number(forceN) / 10) * 100,
        },
        {
          label: "Time Constant (τ)",
          value: tauMs,
          unit: "ms",
          badgeColor: "cyan",
          progressPct: (Number(tauMs) / 30) * 100,
        },
        {
          label: "Ampere-Turns (NI)",
          value: Math.round(n * i).toString(),
          unit: "A·turns",
          badgeColor: "indigo",
          progressPct: (Math.round(n * i) / 200) * 100,
        },
        {
          label: "Stylus Emboss Pressure",
          value: (Number(forceN) * 28).toFixed(0),
          unit: "kPa",
          badgeColor: "purple",
          progressPct: ((Number(forceN) * 28) / 250) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "drawRatio",
        label: "Filament Draw Orientation Ratio",
        min: 2.0,
        max: 9.0,
        step: 0.2,
        defaultValue: 6.5,
        unit: "ratio",
      },
      {
        id: "impactVelocity",
        label: "Projectile Impact Velocity",
        min: 150,
        max: 900,
        step: 25,
        defaultValue: 450,
        unit: "m/s",
      },
    ],
    computeMetrics: (p) => {
      const draw = p.drawRatio ?? 6.5;
      const vImp = p.impactVelocity ?? 450;
      const eGpa = Math.min(145, 60 + draw * 11.5);
      const vSonic = Math.round(Math.sqrt((eGpa * 1e9) / 1440));
      const strainPct = ((vImp / vSonic) * 100).toFixed(2);
      const stressMpa = Math.round((Number(strainPct) / 100) * eGpa * 1000);

      return [
        {
          label: "Elastic Modulus (E)",
          value: Math.round(eGpa).toString(),
          unit: "GPa",
          badgeColor: "cyan",
          progressPct: (eGpa / 150) * 100,
        },
        {
          label: "Sonic Shock Velocity",
          value: vSonic.toLocaleString(),
          unit: "m/s",
          badgeColor: "emerald",
          progressPct: (vSonic / 12000) * 100,
        },
        {
          label: "Tensile Stress",
          value: stressMpa.toLocaleString(),
          unit: "MPa",
          badgeColor: stressMpa < 3600 ? "indigo" : "rose",
          progressPct: (stressMpa / 4000) * 100,
        },
        {
          label: "Elastic Strain",
          value: strainPct,
          unit: "%",
          badgeColor: Number(strainPct) < 3.5 ? "amber" : "rose",
          progressPct: (Number(strainPct) / 4.0) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "vulcanTemp",
        label: "Vulcanization Temperature",
        min: 110,
        max: 190,
        step: 2,
        defaultValue: 145,
        unit: "°C",
      },
      {
        id: "sulfurPct",
        label: "Sulfur Content Fraction",
        min: 2,
        max: 14,
        step: 0.5,
        defaultValue: 8.0,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const temp = p.vulcanTemp ?? 145;
      const sulfur = p.sulfurPct ?? 8.0;
      const isOptimal = temp >= 135 && temp <= 165;
      const crossLink = ((sulfur / 8.0) * (isOptimal ? 1.0 : 0.45)).toFixed(3);
      const tensilePsi = Math.round(Number(crossLink) * 2900);
      const returnPct = Math.min(98, Math.round(55 + Number(crossLink) * 42));

      return [
        {
          label: "Cross-Link Density",
          value: crossLink,
          unit: "mol/cm³",
          badgeColor: "emerald",
          progressPct: (Number(crossLink) / 1.5) * 100,
        },
        {
          label: "Tensile Strength",
          value: tensilePsi.toLocaleString(),
          unit: "psi",
          badgeColor: "cyan",
          progressPct: (tensilePsi / 3500) * 100,
        },
        {
          label: "Elastic Return",
          value: returnPct.toString(),
          unit: "%",
          badgeColor: "indigo",
          progressPct: returnPct,
        },
        {
          label: "Thermal Stability",
          value: isOptimal ? "Resilient" : "Brittle / Plastic",
          unit: "state",
          badgeColor: isOptimal ? "emerald" : "rose",
          progressPct: isOptimal ? 95 : 30,
        },
      ];
    },
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
    controls: [
      {
        id: "inflationPct",
        label: "Air Bellows Inflation",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "shoalDepth",
        label: "Riverbed Shoal Water Depth",
        min: 2.0,
        max: 6.0,
        step: 0.1,
        defaultValue: 3.5,
        unit: "ft",
      },
    ],
    computeMetrics: (p) => {
      const infl = p.inflationPct ?? 75;
      const depth = p.shoalDepth ?? 3.5;
      const volM3 = ((infl / 100) * 42.5).toFixed(1);
      const liftKn = Math.round(Number(volM3) * 9.81);
      const draftRedFt = (Number(volM3) * 0.055).toFixed(2);
      const hullDraftFt = 5.0 - Number(draftRedFt);
      const clearanceFt = (depth - hullDraftFt).toFixed(2);

      return [
        {
          label: "Buoyant Lift Force",
          value: liftKn.toString(),
          unit: "kN",
          badgeColor: "cyan",
          progressPct: (liftKn / 450) * 100,
        },
        {
          label: "Draft Reduction",
          value: draftRedFt,
          unit: "ft",
          badgeColor: "emerald",
          progressPct: (Number(draftRedFt) / 3.0) * 100,
        },
        {
          label: "Shoal Keel Clearance",
          value: `${clearanceFt}`,
          unit: "ft",
          badgeColor: Number(clearanceFt) > 0 ? "emerald" : "rose",
          progressPct: Math.min(100, Math.max(0, (Number(clearanceFt) + 1.5) * 35)),
        },
        {
          label: "Displaced Air Volume",
          value: volM3,
          unit: "m³",
          badgeColor: "indigo",
          progressPct: (Number(volM3) / 45) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "channels",
        label: "Piano Roll Active Channels",
        min: 12,
        max: 88,
        step: 1,
        defaultValue: 88,
        unit: "keys",
      },
      {
        id: "hopRate",
        label: "Tape Synchronous Hop Rate",
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 4.0,
        unit: "hops/s",
      },
    ],
    computeMetrics: (p) => {
      const ch = p.channels ?? 88;
      const hops = p.hopRate ?? 4.0;
      const rfBwMhz = (ch * 0.1).toFixed(1);
      const procGainDb = (10 * Math.log10((Number(rfBwMhz) * 1000) / 10)).toFixed(1);
      const antiJamDb = (Number(procGainDb) - 3.0).toFixed(1);

      return [
        {
          label: "RF Spread Bandwidth",
          value: rfBwMhz,
          unit: "MHz",
          badgeColor: "indigo",
          progressPct: (Number(rfBwMhz) / 10) * 100,
        },
        {
          label: "Processing Gain (Gp)",
          value: procGainDb,
          unit: "dB",
          badgeColor: "emerald",
          progressPct: (Number(procGainDb) / 32) * 100,
        },
        {
          label: "Anti-Jamming Margin",
          value: antiJamDb,
          unit: "dB",
          badgeColor: "cyan",
          progressPct: (Number(antiJamDb) / 30) * 100,
        },
        {
          label: "Hop Dwell Period",
          value: (1000 / hops).toFixed(0),
          unit: "ms",
          badgeColor: "purple",
          progressPct: (hops / 10) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "mouseSpeed",
        label: "Manual Tracking Speed",
        min: 100,
        max: 800,
        step: 25,
        defaultValue: 350,
        unit: "mm/s",
      },
      {
        id: "wheelRadius",
        label: "Knife-Edge Wheel Radius",
        min: 6,
        max: 18,
        step: 0.5,
        defaultValue: 10.0,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const v = p.mouseSpeed ?? 350;
      const r = p.wheelRadius ?? 10.0;
      const omegaRps = (v / r).toFixed(1);
      const dpi = Math.round((200 * 10) / r);

      return [
        {
          label: "Coordinate Resolution",
          value: dpi.toString(),
          unit: "DPI",
          badgeColor: "cyan",
          progressPct: (dpi / 350) * 100,
        },
        {
          label: "Wheel Angular Velocity",
          value: omegaRps,
          unit: "rad/s",
          badgeColor: "emerald",
          progressPct: (Number(omegaRps) / 80) * 100,
        },
        {
          label: "Resolver Orthogonality",
          value: "90.0",
          unit: "deg",
          badgeColor: "indigo",
          progressPct: 100,
        },
        {
          label: "Tracking Slew Rate",
          value: (v * 3.8).toFixed(0),
          unit: "px/s",
          badgeColor: "purple",
          progressPct: (v / 800) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "anodeVoltage",
        label: "Anode Accelerating Potential",
        min: 600,
        max: 2500,
        step: 50,
        defaultValue: 1500,
        unit: "V",
      },
      {
        id: "coilCurrent",
        label: "Deflection Coils Current",
        min: 0.1,
        max: 0.8,
        step: 0.02,
        defaultValue: 0.42,
        unit: "A",
      },
    ],
    computeMetrics: (p) => {
      const v = p.anodeVoltage ?? 1500;
      const i = p.coilCurrent ?? 0.42;
      const beamVelocity = (Math.sqrt((2 * 1.6e-19 * v) / 9.1e-31) / 1e6).toFixed(2);
      const deflAngle = (i * 48 * (1500 / v) ** 0.5).toFixed(1);

      return [
        {
          label: "Electron Beam Speed",
          value: `${beamVelocity} × 10⁶`,
          unit: "m/s",
          badgeColor: "cyan",
          progressPct: (Number(beamVelocity) / 35) * 100,
        },
        {
          label: "Deflection Angle",
          value: deflAngle,
          unit: "deg",
          badgeColor: "emerald",
          progressPct: (Number(deflAngle) / 45) * 100,
        },
        {
          label: "Scanline Resolution",
          value: "400",
          unit: "lines",
          badgeColor: "indigo",
          progressPct: 80,
        },
        {
          label: "Anode Aperture Current",
          value: (2.4 * (v / 1500)).toFixed(1),
          unit: "µA",
          badgeColor: "purple",
          progressPct: (Number(beamVelocity) / 30) * 100,
        },
      ];
    },
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
    controls: [
      {
        id: "clockFreq",
        label: "3-Phase Clock Frequency",
        min: 0.5,
        max: 8.0,
        step: 0.25,
        defaultValue: 2.5,
        unit: "MHz",
      },
      {
        id: "gateVoltage",
        label: "Gate Potential Well Voltage",
        min: 3.0,
        max: 15.0,
        step: 0.5,
        defaultValue: 8.0,
        unit: "V",
      },
    ],
    computeMetrics: (p) => {
      const f = p.clockFreq ?? 2.5;
      const vGate = p.gateVoltage ?? 8.0;
      const wellCap = Math.round(12500 * vGate);
      const cte = (99.999 - f * 0.0012).toFixed(3);
      const transitNs = (1000 / (f * 3)).toFixed(1);

      return [
        {
          label: "Charge Transfer Eff",
          value: `${cte}%`,
          unit: "CTE",
          badgeColor: "emerald",
          progressPct: 99,
        },
        {
          label: "Full Well Capacity",
          value: wellCap.toLocaleString(),
          unit: "e⁻",
          badgeColor: "cyan",
          progressPct: (wellCap / 200000) * 100,
        },
        {
          label: "Gate Step Period",
          value: transitNs,
          unit: "ns",
          badgeColor: "purple",
          progressPct: (Number(transitNs) / 500) * 100,
        },
        {
          label: "Dynamic Range",
          value: (20 * Math.log10(wellCap / 15)).toFixed(1),
          unit: "dB",
          badgeColor: "indigo",
          progressPct: 88,
        },
      ];
    },
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
    controls: [
      {
        id: "crystalFreq",
        label: "Master Quartz Crystal",
        min: 10.0,
        max: 18.0,
        step: 0.1,
        defaultValue: 14.318,
        unit: "MHz",
      },
    ],
    computeMetrics: (p) => {
      const f = p.crystalFreq ?? 14.318;
      const cpuClock = (f / 14).toFixed(3);
      const colorSubcarrier = (f / 4).toFixed(3);
      const dramWindow = ((1000 / Number(cpuClock)) * 0.5).toFixed(1);

      return [
        {
          label: "Microprocessor Clock",
          value: cpuClock,
          unit: "MHz",
          badgeColor: "emerald",
          progressPct: (Number(cpuClock) / 1.5) * 100,
        },
        {
          label: "NTSC Color Burst",
          value: colorSubcarrier,
          unit: "MHz",
          badgeColor: "purple",
          progressPct: (Number(colorSubcarrier) / 4.5) * 100,
        },
        {
          label: "DRAM Access Window",
          value: dramWindow,
          unit: "ns",
          badgeColor: "cyan",
          progressPct: (Number(dramWindow) / 600) * 100,
        },
        {
          label: "Bus Contention Wait",
          value: "0",
          unit: "cycles",
          badgeColor: "indigo",
          progressPct: 100,
        },
      ];
    },
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
    controls: [
      {
        id: "crankRpm",
        label: "Flywheel Drive Velocity",
        min: 60,
        max: 320,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
      {
        id: "feedRate",
        label: "Cloth Baser Feed Rate",
        min: 1.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 3.5,
        unit: "mm/s",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.crankRpm ?? 180;
      const feed = p.feedRate ?? 3.5;
      const shuttleHz = (rpm / 60).toFixed(2);
      const stitchLen = ((feed * 1000) / (rpm * 10)).toFixed(1);

      return [
        {
          label: "Stitch Velocity",
          value: rpm.toString(),
          unit: "SPM",
          badgeColor: "cyan",
          progressPct: (rpm / 350) * 100,
        },
        {
          label: "Shuttle Oscillations",
          value: shuttleHz,
          unit: "Hz",
          badgeColor: "emerald",
          progressPct: (Number(shuttleHz) / 6) * 100,
        },
        {
          label: "Stitch Length",
          value: stitchLen,
          unit: "mm",
          badgeColor: "amber",
          progressPct: (Number(stitchLen) / 5) * 100,
        },
        {
          label: "Thread Lock Security",
          value: "Locked",
          unit: "state",
          badgeColor: "indigo",
          progressPct: 100,
        },
      ];
    },
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
    controls: [
      {
        id: "primaryCap",
        label: "Primary Tank Capacitance",
        min: 10,
        max: 90,
        step: 5,
        defaultValue: 45,
        unit: "nF",
      },
      {
        id: "couplingK",
        label: "Coil Magnetic Coupling (k)",
        min: 0.08,
        max: 0.35,
        step: 0.01,
        defaultValue: 0.18,
        unit: "ratio",
      },
    ],
    computeMetrics: (p) => {
      const cap = p.primaryCap ?? 45;
      const k = p.couplingK ?? 0.18;
      const freqKhz = Math.round(180 * Math.sqrt(45 / cap));
      const peakKv = Math.round(350 * (k / 0.18) * Math.sqrt(cap / 45));
      const streamerM = (peakKv * 0.0032).toFixed(2);

      return [
        {
          label: "Resonant Peak Voltage",
          value: `${peakKv}`,
          unit: "kV",
          badgeColor: "purple",
          progressPct: (peakKv / 800) * 100,
        },
        {
          label: "LC Tank Frequency",
          value: freqKhz.toString(),
          unit: "kHz",
          badgeColor: "cyan",
          progressPct: (freqKhz / 350) * 100,
        },
        {
          label: "Streamer Spark Length",
          value: streamerM,
          unit: "m",
          badgeColor: "amber",
          progressPct: (Number(streamerM) / 3.0) * 100,
        },
        {
          label: "Coupling Coefficient",
          value: k.toFixed(2),
          unit: "k",
          badgeColor: "emerald",
          progressPct: (k / 0.35) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Air-core primary and secondary coils tuned to identical LC natural resonant frequencies transfer energy inductively over multiple cycles, building up electrostatic voltage until the air dielectric ionizes.",
  },
};
