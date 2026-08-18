/**
 * telemetryData.ts
 *
 * Domain-specific FrankenSim SI Physics Telemetry Registry with live reactive computational models.
 * Supplies authentic mathematical governing laws, real SI physical units,
 * interactive parameter controllers, and 60-FPS computed telemetry states for every classic patent.
 */

import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

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
  enforceConstraints?: (
    params: Record<string, number>,
    key: string,
    value: number,
  ) => Record<string, number>;
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
        defaultValue: 28,
        unit: "mph",
      },
      {
        id: "wingWarp",
        label: "Wing Warp Deflection",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 8,
        unit: "°",
      },
      {
        id: "rudder",
        label: "Rudder Deflection",
        min: -25,
        max: 25,
        step: 0.5,
        defaultValue: 4,
        unit: "°",
      },
      {
        id: "elevator",
        label: "Canard Elevator",
        min: -15,
        max: 15,
        step: 0.5,
        defaultValue: 5,
        unit: "°",
      },
      {
        id: "coupled",
        label: "Claim 1 hip-cradle coupling",
        min: 0,
        max: 1,
        step: 1,
        defaultValue: 1,
        unit: "",
      },
    ],
    computeMetrics: (p) => {
      const si = stepWrightFlyerSi(readWrightControls(p));
      return [
        {
          label: "Gross Lift",
          value: Math.round(si.liftNewtons).toLocaleString(),
          unit: "N",
          badgeColor: "emerald",
          progressPct: Math.min(100, (si.liftNewtons / 2500) * 100),
        },
        {
          label: "Induced Drag",
          value: si.inducedDragNewtons.toFixed(1),
          unit: "N",
          badgeColor: "amber",
          progressPct: Math.min(100, (si.inducedDragNewtons / 150) * 100),
        },
        {
          label: "Lift-to-Drag (L/D)",
          value: si.liftToDrag.toFixed(2),
          unit: "ratio",
          badgeColor: "indigo",
          progressPct: Math.min(100, (si.liftToDrag / 10) * 100),
        },
        {
          label: "Net Yaw",
          value: si.netYawNm >= 0 ? `+${si.netYawNm.toFixed(1)}` : si.netYawNm.toFixed(1),
          unit: "N·m",
          badgeColor: si.adverseYawDominant ? "rose" : "cyan",
          progressPct: Math.max(0, 100 - Math.abs(si.netYawNm) * 4),
        },
      ];
    },
    pedagogicalInsight:
      "Helical wing warping creates differential lift across wing tips; the mechanical coupling to the vertical rudder counteracts adverse yaw induced by differential vortex drag.",
    enforceConstraints: (params, key, value) => {
      const updated = { ...params, [key]: value };
      if (updated.coupled === 1) {
        if (key === "wingWarp" || key === "coupled") {
          updated.rudder = Number((updated.wingWarp * 0.5).toFixed(1)); // Simple linear coupling equivalent
        }
      }
      return updated;
    },
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
        min: 100,
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
        max: 8.0,
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
        min: 15,
        max: 150,
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
        min: 80,
        max: 500,
        step: 5,
        defaultValue: 220,
        unit: "W",
      },
      {
        id: "totalPressure",
        label: "System Total Pressure",
        min: 6,
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
        max: 6000,
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
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 28,
        unit: "kV",
      },
      {
        id: "aerialHeight",
        label: "Vertical Aerial Height",
        min: 10,
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
        max: 12.0,
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
        max: 30,
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
        max: 6000,
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
        min: 7.0,
        max: 28.0,
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
  "us-138-colt-revolver": {
    domain: "continuum_elasticity",
    domainTitle: "Pawl-Ratchet Angular Discretization & Internal Ballistic Hoop Stress",
    equationName: "Hoop Stress Limit & 72° Cylinder Indexing",
    governingEquation:
      "\\sigma_{\\text{hoop}} = \\frac{P_{\\text{combustion}} \\cdot r}{t} \\quad \\text{and} \\quad \\Delta \\theta = \\frac{360^\\circ}{N_{\\text{chambers}}} = 72^\\circ",
    engineMethod: "FrankenSimEngine.stepColtRevolver",
    controls: [
      {
        id: "chamberPressure",
        label: "Black Powder Combustion Peak Pressure",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 85,
        unit: "MPa",
      },
      {
        id: "cockingAngle",
        label: "Hammer Cocking Arc Angle",
        min: 0,
        max: 45,
        step: 1,
        defaultValue: 45,
        unit: "deg",
      },
    ],
    computeMetrics: (p) => {
      const pMpa = p.chamberPressure ?? 85;
      const cockDeg = p.cockingAngle ?? 45;
      const rInnerMm = 4.5;
      const tWallMm = 3.8;
      const hoopStressMpa = ((pMpa * rInnerMm) / tWallMm).toFixed(1);
      const indexAngleDeg = ((cockDeg / 45) * 72).toFixed(1);
      const isLocked = cockDeg >= 44;
      const muzzleVelocityMps = Math.round(180 + Math.sqrt(pMpa) * 13.5);

      return [
        {
          label: "Cylinder Hoop Stress",
          value: hoopStressMpa,
          unit: "MPa",
          badgeColor: Number(hoopStressMpa) < 180 ? "emerald" : "amber",
          progressPct: (Number(hoopStressMpa) / 250) * 100,
        },
        {
          label: "Cylinder Index Rotation",
          value: `${indexAngleDeg}°`,
          unit: "deg (72° step)",
          badgeColor: "cyan",
          progressPct: (Number(indexAngleDeg) / 72) * 100,
        },
        {
          label: "Muzzle Exit Velocity",
          value: muzzleVelocityMps.toString(),
          unit: "m/s",
          badgeColor: "amber",
          progressPct: (muzzleVelocityMps / 360) * 100,
        },
        {
          label: "Cylinder Bolt Lock",
          value: isLocked ? "LOCKED (0.02 mm)" : "INDEXING (72°)",
          unit: "detent",
          badgeColor: isLocked ? "emerald" : "amber",
          progressPct: isLocked ? 100 : 30,
        },
      ];
    },
    pedagogicalInsight:
      "Drawing back the hammer with the thumb lifts the pawl to advance the ratchet 72 degrees, while simultaneously withdrawing and re-engaging the perimeter bolt to lock the next chamber directly into concentric alignment with the stationary rifled barrel.",
  },
  "us-31128-otis-elevator": {
    domain: "continuum_elasticity",
    domainTitle: "Transverse Leaf Spring Deflection & Ratchet Catch Kinematics",
    equationName: "Elastic Release Time Constant & Deceleration Impulse",
    governingEquation:
      "t_{\\text{snap}} = \\frac{\\pi}{2} \\sqrt{\\frac{m_{\\text{pawl}}}{k_{\\text{spring}}}} \\quad \\text{and} \\quad F_{\\text{arrest}} = m_{\\text{cab}} (g + a_{\\text{stop}})",
    engineMethod: "FrankenSimEngine.stepOtisElevator",
    controls: [
      {
        id: "cabPayload",
        label: "Elevator Passenger & Freight Payload",
        min: 200,
        max: 1500,
        step: 50,
        defaultValue: 650,
        unit: "kg",
      },
      {
        id: "cableTension",
        label: "Hoisting Cable Tension",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 100,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const payload = p.cabPayload ?? 650;
      const tension = p.cableTension ?? 100;
      const isSnapped = tension < 15;
      const grossMassKg = 400 + payload;
      const deflectionCm = ((tension / 100) * 10).toFixed(1);
      const snapTimeMs = 38;
      const arrestForceKn = isSnapped ? ((grossMassKg * 9.81 * 1.8) / 1000).toFixed(1) : "0.0";
      const stopDistCm = isSnapped ? 4.5 : 0;

      return [
        {
          label: "Spring Bow Deflection",
          value: `${deflectionCm} cm`,
          unit: "δ",
          badgeColor: Number(deflectionCm) > 5 ? "emerald" : "amber",
          progressPct: (Number(deflectionCm) / 10) * 100,
        },
        {
          label: "Brake Release Speed",
          value: `${snapTimeMs} ms`,
          unit: "t_snap",
          badgeColor: "cyan",
          progressPct: 95,
        },
        {
          label: "Arrest Catch Status",
          value: isSnapped ? "LOCKED (ARRESTED)" : "RUNNING (FREE)",
          unit: "state",
          badgeColor: isSnapped ? "emerald" : "purple",
          progressPct: isSnapped ? 100 : 0,
        },
        {
          label: "Arrest Dynamic Force",
          value: arrestForceKn,
          unit: "kN",
          badgeColor: isSnapped ? "amber" : "emerald",
          progressPct: (Number(arrestForceKn) / 30) * 100,
        },
        {
          label: "Arrest Catch Distance",
          value: `${stopDistCm} cm`,
          unit: "Δy",
          badgeColor: isSnapped ? "emerald" : "cyan",
          progressPct: isSnapped ? 45 : 0,
        },
      ];
    },
    pedagogicalInsight:
      "Hoisting cable tension actively holds the safety pawls disengaged by bowing a heavy transverse leaf spring upward. If the cable snaps, the spring instantly straightens flat, firing pawls outward into the vertical guide-rail ratchets within 38 milliseconds.",
  },
  "us-313224-mergenthaler-linotype": {
    domain: "materials_kinetics",
    domainTitle: "Binary Matrix Keyway Demultiplexing & Eutectic Solidification",
    equationName: "7-Bit Binary Matrix Address & Solidification Time",
    governingEquation:
      "B = \\sum_{i=0}^6 b_i 2^i \\quad \\text{and} \\quad t_{\\text{solid}} = C \\left(\\frac{V}{A}\\right)^2 \\left(T_{\\text{pour}} - T_{\\text{mold}}\\right)",
    engineMethod: "FrankenSimEngine.stepMergenthalerLinotype",
    controls: [
      {
        id: "matrixRate",
        label: "Keyboard Typesetting Speed",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "char/min",
      },
      {
        id: "spacebandWedge",
        label: "Spaceband Justification Wedge",
        min: 2.0,
        max: 12.0,
        step: 0.5,
        defaultValue: 6.5,
        unit: "mm",
      },
      {
        id: "potTemp",
        label: "Lead Pot Temperature",
        min: 220,
        max: 300,
        step: 2,
        defaultValue: 260,
        unit: "°C",
      },
      {
        id: "lineLengthPicas",
        label: "Column Measure Width",
        min: 8,
        max: 26,
        step: 1,
        defaultValue: 13,
        unit: "picas",
      },
    ],
    computeMetrics: (p) => {
      const rate = p.matrixRate ?? 60;
      const wedge = p.spacebandWedge ?? 6.5;
      const temp = p.potTemp ?? 260;
      const justWidth = (85 + wedge * 4.2).toFixed(1);
      const solidMs = Math.round(450 * (temp / 260));
      const hardness = temp >= 240 && temp <= 275 ? "24 HB (Optimal)" : "18 HB (Sub-optimal)";

      return [
        {
          label: "Justified Line Width",
          value: `${justWidth} mm`,
          unit: "width",
          badgeColor: "emerald",
          progressPct: (Number(justWidth) / 140) * 100,
        },
        {
          label: "Slug Solidification",
          value: `${solidMs} ms`,
          unit: "t_solid",
          badgeColor: "cyan",
          progressPct: Math.min(100, (solidMs / 600) * 100),
        },
        {
          label: "Lead-Alloy Hardness",
          value: hardness,
          unit: "HB",
          badgeColor: temp >= 240 && temp <= 275 ? "emerald" : "amber",
          progressPct: temp >= 240 && temp <= 275 ? 95 : 60,
        },
        {
          label: "Distributor Sorting",
          value: (rate / 60).toFixed(2),
          unit: "Hz",
          badgeColor: "indigo",
          progressPct: (rate / 120) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Wedge-shaped two-part spacebands expand between words until the composed line locks tightly against fixed column jaws, while a binary keyway rail sorts recirculating brass matrices back into 90 magazine channels.",
  },
  "us-319596-maxim-machine-gun": {
    domain: "continuum_elasticity",
    domainTitle: "Short-Recoil Momentum Conservation & Toggle-Lock Kinematics",
    equationName: "Conservation of Linear Recoil Momentum",
    governingEquation:
      "m_{\\text{recoil}} v_{\\text{recoil}} = m_{\\text{bullet}} v_{\\text{bullet}} + m_{\\text{gas}} v_{\\text{gas}} \\quad \\text{and} \\quad F_{\\text{breech}} = \\frac{F_{\\text{toggle}}}{\\tan\\theta} \\to \\infty",
    engineMethod: "FrankenSimEngine.stepMaximMachineGun",
    controls: [
      {
        id: "firingRate",
        label: "Cyclic Firing Rate",
        min: 300,
        max: 750,
        step: 25,
        defaultValue: 600,
        unit: "RPM",
      },
      {
        id: "waterLevel",
        label: "Water Jacket Fill",
        min: 0,
        max: 4.0,
        step: 0.2,
        defaultValue: 4.0,
        unit: "liters",
      },
      {
        id: "recoilStroke",
        label: "Short-Recoil Stroke",
        min: 12,
        max: 25,
        step: 1,
        defaultValue: 19,
        unit: "mm",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.firingRate ?? 600;
      const water = p.waterLevel ?? 4.0;
      const _stroke = p.recoilStroke ?? 19;
      const recoilVel = ((0.014 * 740) / 3.2).toFixed(2);
      const recoilMom = (3.2 * Number(recoilVel)).toFixed(2);
      const barrelTemp = water > 0.5 ? 100 : Math.min(450, Math.round(100 + (rpm / 600) * 280));
      const boilRate = water > 0.5 ? (((rpm / 60) * 45 * 0.28) / 2.26).toFixed(1) : "0.0";

      return [
        {
          label: "Recoil Velocity",
          value: `${recoilVel} m/s`,
          unit: "v_rec",
          badgeColor: "emerald",
          progressPct: (Number(recoilVel) / 5) * 100,
        },
        {
          label: "Recoil Momentum",
          value: `${recoilMom} N·s`,
          unit: "p_rec",
          badgeColor: "cyan",
          progressPct: (Number(recoilMom) / 15) * 100,
        },
        {
          label: "Barrel Temperature",
          value: `${barrelTemp} °C`,
          unit: "T_barrel",
          badgeColor: barrelTemp <= 100 ? "emerald" : "rose",
          progressPct: (barrelTemp / 450) * 100,
        },
        {
          label: "Steam Vaporization",
          value: `${boilRate} g/s`,
          unit: "dm/dt",
          badgeColor: "purple",
          progressPct: (Number(boilRate) / 20) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "The exploding cartridge drives the barrel and breech block rearward; breaking the collinear toggle linkage unlocks the breech, ejects the casing, indexes a fresh cartridge from the cloth belt, and returns under spring tension.",
  },
  "us-361931-daimler-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "High-RPM Internal Combustion & Epicyclic Bevel Differential",
    equationName: "Engine Specific Power & Differential Kinematics",
    governingEquation:
      "P = \\frac{\\text{BMEP} \\cdot V_d \\cdot N}{120} \\quad \\text{and} \\quad \\omega_{\\text{left}} + \\omega_{\\text{right}} = 2\\omega_{\\text{carrier}}",
    engineMethod: "FrankenSimEngine.stepDaimlerEngine",
    controls: [
      {
        id: "engineRpm",
        label: "Crankshaft Speed",
        min: 400,
        max: 950,
        step: 25,
        defaultValue: 750,
        unit: "RPM",
      },
      {
        id: "hotTubeTemp",
        label: "Hot-Tube Igniter Temp",
        min: 650,
        max: 950,
        step: 10,
        defaultValue: 850,
        unit: "°C",
      },
      {
        id: "turnAngle",
        label: "Steering Wheel Turn Angle",
        min: 0,
        max: 35,
        step: 1,
        defaultValue: 15,
        unit: "°",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.engineRpm ?? 750;
      const temp = p.hotTubeTemp ?? 850;
      const turn = p.turnAngle ?? 15;
      const bmep = temp >= 800 ? 4.5 : Number((4.5 * (temp / 800)).toFixed(2));
      const hp = ((bmep * 100 * 0.000462 * rpm) / (120 * 0.7457)).toFixed(2);
      const carrierRpm = Math.round(rpm / 4.5);
      const deltaRpm = Math.round(carrierRpm * Math.sin((turn * Math.PI) / 180) * 0.4);

      return [
        {
          label: "Brake Horsepower",
          value: `${hp} hp`,
          unit: "P_brake",
          badgeColor: "emerald",
          progressPct: (Number(hp) / 2.5) * 100,
        },
        {
          label: "BMEP Pressure",
          value: `${bmep} bar`,
          unit: "BMEP",
          badgeColor: "cyan",
          progressPct: (bmep / 6.0) * 100,
        },
        {
          label: "Outer Wheel Speed",
          value: `${carrierRpm + deltaRpm} RPM`,
          unit: "ω_outer",
          badgeColor: "indigo",
          progressPct: ((carrierRpm + deltaRpm) / 250) * 100,
        },
        {
          label: "Inner Wheel Speed",
          value: `${carrierRpm - deltaRpm} RPM`,
          unit: "ω_inner",
          badgeColor: "amber",
          progressPct: ((carrierRpm - deltaRpm) / 250) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Raising engine RPM by a factor of 4 using incandescent glow-tube ignition slashed weight per horsepower by 80%, while the bevel differential split torque across drive wheels during cornering.",
  },
  "us-388850-eastman-kodak": {
    domain: "optics_waves",
    domainTitle: "Hyperfocal Fixed-Focus Optics & Logarithmic Exposure Law",
    equationName: "Hyperfocal Distance & Exposure Value (EV)",
    governingEquation:
      "H = \\frac{f^2}{N \\cdot c} + f \\quad \\text{and} \\quad \\text{EV} = \\log_2\\left(\\frac{N^2}{t}\\right)",
    engineMethod: "FrankenSimEngine.stepEastmanKodak",
    controls: [
      {
        id: "shutterSpeed",
        label: "Barrel Shutter Speed",
        min: 0.01,
        max: 0.1,
        step: 0.01,
        defaultValue: 0.05,
        unit: "s",
      },
      {
        id: "apertureStop",
        label: "Lens Aperture (f-number)",
        min: 8,
        max: 16,
        step: 1,
        defaultValue: 9,
        unit: "f/#",
      },
      {
        id: "subjectDist",
        label: "Subject Distance",
        min: 0.5,
        max: 8.0,
        step: 0.2,
        defaultValue: 3.0,
        unit: "m",
      },
    ],
    computeMetrics: (p) => {
      const t = p.shutterSpeed ?? 0.05;
      const n = p.apertureStop ?? 9;
      const dist = p.subjectDist ?? 3.0;
      const h = (0.057 ** 2 / (n * 0.00003) + 0.057).toFixed(2);
      const dofNear = ((Number(h) * dist) / (Number(h) + dist)).toFixed(2);
      const ev = Math.log2(n ** 2 / t).toFixed(2);
      const inFocus = dist >= Number(dofNear);

      return [
        {
          label: "Hyperfocal Point",
          value: `${h} m`,
          unit: "H",
          badgeColor: "emerald",
          progressPct: (Number(h) / 15) * 100,
        },
        {
          label: "Near Focus Limit",
          value: `${dofNear} m`,
          unit: "D_near",
          badgeColor: "cyan",
          progressPct: (Number(dofNear) / 5) * 100,
        },
        {
          label: "Exposure Value (EV)",
          value: `EV ${ev}`,
          unit: "EV",
          badgeColor: "indigo",
          progressPct: (Number(ev) / 15) * 100,
        },
        {
          label: "Focus Status",
          value: inFocus ? "SHARP (IN FOCUS)" : "BLURRED (TOO CLOSE)",
          unit: "status",
          badgeColor: inFocus ? "emerald" : "rose",
          progressPct: inFocus ? 100 : 25,
        },
      ];
    },
    pedagogicalInsight:
      "A fixed 57mm f/9 doublet set at its hyperfocal distance renders everything from 1.2 meters to optical infinity in sharp focus, eliminating viewfinders and focusing bellows.",
  },
  "us-395781-hollerith-tabulating": {
    domain: "electromagnetics_flux",
    domainTitle: "Punched Card Matrix Logic & Electromagnetic Solenoid Accumulators",
    equationName: "Electromagnetic Solenoid Force & Inductive Time Constant",
    governingEquation:
      "F_{\\text{mag}} = \\frac{(N I)^2 \\mu_0 A}{2 g^2} \\quad \\text{and} \\quad \\tau = \\frac{L}{R}",
    engineMethod: "FrankenSimEngine.stepHollerithTabulating",
    controls: [
      {
        id: "cardsPerMin",
        label: "Tabulating Feed Speed",
        min: 20,
        max: 90,
        step: 5,
        defaultValue: 60,
        unit: "cards/min",
      },
      {
        id: "batteryVolts",
        label: "Battery Bank Potential",
        min: 6,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
      },
      {
        id: "activeRelays",
        label: "Parallel Accumulator Relays",
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 16,
        unit: "relays",
      },
    ],
    computeMetrics: (p) => {
      const cpm = p.cardsPerMin ?? 60;
      const v = p.batteryVolts ?? 12;
      const relays = p.activeRelays ?? 16;
      const cycleMs = Math.round(60000 / cpm);
      const forceN = (
        ((relays * (v / 12) * 35) ** 2 * 1.256e-6 * 0.0004) /
        (2 * 0.002 ** 2)
      ).toFixed(2);
      const tauMs = ((0.08 / (v / 2.4)) * 1000).toFixed(1);

      return [
        {
          label: "Reading Cycle Time",
          value: `${cycleMs} ms`,
          unit: "t_cycle",
          badgeColor: "cyan",
          progressPct: (cycleMs / 3000) * 100,
        },
        {
          label: "Solenoid Pull Force",
          value: `${forceN} N`,
          unit: "F_mag",
          badgeColor: "emerald",
          progressPct: Math.min(100, (Number(forceN) / 5) * 100),
        },
        {
          label: "Circuit Time Constant",
          value: `${tauMs} ms`,
          unit: "τ",
          badgeColor: "amber",
          progressPct: (Number(tauMs) / 30) * 100,
        },
        {
          label: "Parallel Accumulators",
          value: `${relays} dials`,
          unit: "active",
          badgeColor: "purple",
          progressPct: (relays / 40) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Spring-loaded brass pins pass through card perforations into mercury pools, completing 12V circuits that advance dial accumulators and trigger sorting box lids in parallel.",
  },
  "us-470918-reno-escalator": {
    domain: "continuum_elasticity",
    domainTitle: "Inclined Passenger Throughput & Comb-Plate Safety Extraction",
    equationName: "Continuous Transit Throughput & Motor Drive Torque",
    governingEquation:
      "\\dot{N}_{\\text{pass}} = \\frac{v \\cdot w_{\\text{step}}}{L_{\\text{pass}}} \\quad \\text{and} \\quad \\tau = \\frac{R}{\\eta} \\sum m_i g (\\sin\\theta + \\mu \\cos\\theta)",
    engineMethod: "FrankenSimEngine.stepRenoEscalator",
    controls: [
      {
        id: "passengerCount",
        label: "Live Passenger Load",
        min: 0,
        max: 60,
        step: 2,
        defaultValue: 30,
        unit: "riders",
      },
      {
        id: "inclineAngle",
        label: "Truss Incline Angle",
        min: 20,
        max: 35,
        step: 1,
        defaultValue: 25,
        unit: "°",
      },
      {
        id: "beltSpeed",
        label: "Linear Tread Velocity",
        min: 0.3,
        max: 0.75,
        step: 0.05,
        defaultValue: 0.45,
        unit: "m/s",
      },
    ],
    computeMetrics: (p) => {
      const count = p.passengerCount ?? 30;
      const angle = p.inclineAngle ?? 25;
      const v = p.beltSpeed ?? 0.45;
      const throughput = Math.round((v * 2 * 3600) / 0.5);
      const angleRad = (angle * Math.PI) / 180;
      const torque = Math.round(
        ((count * 700 * Math.sin(angleRad) + count * 700 * Math.cos(angleRad) * 0.03 + 800) *
          0.35) /
          0.88,
      );
      const powerKw = ((torque * (v / 0.35)) / 1000).toFixed(2);

      return [
        {
          label: "Hourly Throughput",
          value: `${throughput.toLocaleString()}/hr`,
          unit: "passengers",
          badgeColor: "emerald",
          progressPct: (throughput / 10000) * 100,
        },
        {
          label: "Drive Motor Torque",
          value: `${torque} N·m`,
          unit: "τ_motor",
          badgeColor: "indigo",
          progressPct: (torque / 6000) * 100,
        },
        {
          label: "Motor Power Draw",
          value: `${powerKw} kW`,
          unit: "P_elec",
          badgeColor: "amber",
          progressPct: (Number(powerKw) / 10) * 100,
        },
        {
          label: "Comb-Plate Clearance",
          value: "1.2 mm",
          unit: "δ_gap",
          badgeColor: "cyan",
          progressPct: 80,
        },
      ];
    },
    pedagogicalInsight:
      "Longitudinally grooved treads pass smoothly under stationary comb-plate fingers with sub-millimeter clearance, lifting footwear off the incline without danger of pinching.",
  },
  "us-542846-diesel-engine": {
    domain: "thermodynamics_transport",
    domainTitle: "Adiabatic Compression Auto-Ignition & Constant-Pressure Expansion",
    equationName: "Adiabatic Temperature Rise & Diesel Cycle Efficiency",
    governingEquation:
      "T_2 = T_1 r^{\\gamma - 1} \\quad \\text{and} \\quad \\eta = 1 - \\frac{1}{r^{\\gamma - 1}} \\left[\\frac{r_c^\\gamma - 1}{\\gamma (r_c - 1)}\\right]",
    engineMethod: "FrankenSimEngine.stepDieselEngine",
    controls: [
      {
        id: "compRatio",
        label: "Compression Ratio (r)",
        min: 12,
        max: 22,
        step: 0.5,
        defaultValue: 18,
        unit: ":1",
      },
      {
        id: "blastAirPressure",
        label: "Blast-Air Injector Pressure",
        min: 45,
        max: 85,
        step: 2,
        defaultValue: 65,
        unit: "bar",
      },
      {
        id: "cutoffRatio",
        label: "Fuel Cutoff Ratio (rc)",
        min: 1.2,
        max: 2.2,
        step: 0.1,
        defaultValue: 1.6,
        unit: "ratio",
      },
      {
        id: "engineRpm",
        label: "Engine Shaft Speed",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 150,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const r = p.compRatio ?? 18;
      const pBlast = p.blastAirPressure ?? 65;
      const rc = p.cutoffRatio ?? 1.6;
      const _rpm = p.engineRpm ?? 150;
      const tCompC = Math.round(300 * r ** 0.4 - 273);
      const pComp = (1.0 * r ** 1.4).toFixed(1);
      const idealEff = ((1 - (1 / r ** 0.4) * ((rc ** 1.4 - 1) / (1.4 * (rc - 1)))) * 100).toFixed(
        1,
      );
      const brakeEff = (Number(idealEff) * 0.68).toFixed(1);

      return [
        {
          label: "Compression Temperature",
          value: `${tCompC} °C`,
          unit: "T_comp",
          badgeColor: tCompC > 210 ? "emerald" : "amber",
          progressPct: (tCompC / 800) * 100,
        },
        {
          label: "Peak Cylinder Pressure",
          value: `${pComp} bar`,
          unit: "P_comp",
          badgeColor: "cyan",
          progressPct: (Number(pComp) / 80) * 100,
        },
        {
          label: "Brake Thermal Efficiency",
          value: `${brakeEff}%`,
          unit: "η_brake",
          badgeColor: "emerald",
          progressPct: (Number(brakeEff) / 50) * 100,
        },
        {
          label: "Auto-Ignition State",
          value: tCompC > 210 && pBlast > Number(pComp) ? "SELF-IGNITING" : "NO IGNITION",
          unit: "state",
          badgeColor: tCompC > 210 && pBlast > Number(pComp) ? "emerald" : "rose",
          progressPct: tCompC > 210 ? 100 : 0,
        },
      ];
    },
    pedagogicalInsight:
      "Compressing pure air to 18:1 generates 680°C heat, causing atomized fuel droplets injected under high pressure to self-ignite instantaneously and expand at constant pressure.",
  },
  "us-613809-tesla-teleautomaton": {
    domain: "electromagnetics_flux",
    domainTitle: "Tuned RF Resonant Tank & Coherer Logic State Machine",
    equationName: "LC Resonant Frequency & Coherer Demodulation",
    governingEquation:
      "f_0 = \\frac{1}{2\\pi \\sqrt{L C}} \\quad \\text{and} \\quad R_{\\text{coherer}} \\xrightarrow{E_{\\text{RF}}} 50\\,\\Omega",
    engineMethod: "FrankenSimEngine.stepTeslaTeleautomaton",
    controls: [
      {
        id: "rfFrequency",
        label: "RF Transmitter Frequency",
        min: 120,
        max: 180,
        step: 2,
        defaultValue: 150,
        unit: "kHz",
      },
      {
        id: "rudderAngle",
        label: "Rudder Steering Angle",
        min: -35,
        max: 35,
        step: 5,
        defaultValue: 15,
        unit: "°",
      },
      {
        id: "pulseCount",
        label: "RF Pulse Count",
        min: 0,
        max: 20,
        step: 1,
        defaultValue: 3,
        unit: "pulses",
      },
      {
        id: "propellerThrottlePct",
        label: "Electric Motor Throttle",
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
    ],
    computeMetrics: (p) => {
      const f = p.rfFrequency ?? 150;
      const rudder = p.rudderAngle ?? 15;
      const isRes = Math.abs(f - 150) <= 4;
      const cohererR = isRes ? "50 Ω (Conducting)" : "100 kΩ (Open)";
      const thrustN = isRes ? "85 N" : "0 N";
      const turnRadiusM =
        Math.abs(rudder) > 0
          ? (12.5 / Math.sin((Math.abs(rudder) * Math.PI) / 180)).toFixed(1)
          : "Straight";

      return [
        {
          label: "Coherer Resistance",
          value: cohererR,
          unit: "R_det",
          badgeColor: isRes ? "emerald" : "amber",
          progressPct: isRes ? 95 : 10,
        },
        {
          label: "Propulsion Motor",
          value: thrustN,
          unit: "Thrust",
          badgeColor: isRes ? "cyan" : "purple",
          progressPct: isRes ? 85 : 0,
        },
        {
          label: "Turning Radius",
          value: `${turnRadiusM} m`,
          unit: "R_turn",
          badgeColor: "indigo",
          progressPct: Math.abs(rudder) > 0 ? 70 : 100,
        },
        {
          label: "Carrier Resonance",
          value: isRes ? "LOCKED (150 kHz)" : "DETUNED",
          unit: "resonance",
          badgeColor: isRes ? "emerald" : "rose",
          progressPct: isRes ? 100 : 20,
        },
      ];
    },
    pedagogicalInsight:
      "Tuned RF waves trigger metal filings in the coherer to fuse and drop resistance, stepping a motorized rotary commutator drum that decodes commands into propulsion and steering.",
  },
  "us-621195-zeppelin-airship": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Cell Archimedean Buoyancy & Space-Frame Bending",
    equationName: "Net Aerostatic Buoyant Lift & Pitch Trim",
    governingEquation:
      "L_{\\text{buoyant}} = V_{\\text{gas}} g (\\rho_{\\text{air}} - \\rho_{\\text{H}_2}) - W_{\\text{struct}}",
    engineMethod: "FrankenSimEngine.stepZeppelinAirship",
    controls: [
      {
        id: "gasInflation",
        label: "Hydrogen Cell Inflation",
        min: 75,
        max: 100,
        step: 1,
        defaultValue: 95,
        unit: "%",
      },
      {
        id: "flightAlt",
        label: "Flight Altitude",
        min: 0,
        max: 2000,
        step: 50,
        defaultValue: 300,
        unit: "m",
      },
      {
        id: "trimWeight",
        label: "Keel Sliding Ballast Position",
        min: -15,
        max: 15,
        step: 1,
        defaultValue: 5,
        unit: "m",
      },
      {
        id: "flightSpeedKnots",
        label: "Cruising Airspeed",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 28,
        unit: "knots",
      },
    ],
    computeMetrics: (p) => {
      const inflation = p.gasInflation ?? 95;
      const alt = p.flightAlt ?? 300;
      const trim = p.trimWeight ?? 5;
      const rhoAir = 1.225 * Math.exp(-alt / 8400);
      const rhoH2 = 0.089 * Math.exp(-alt / 8400);
      const grossKn = ((11300 * (inflation / 100) * 9.81 * (rhoAir - rhoH2)) / 1000).toFixed(1);
      const netKn = (Number(grossKn) - 98.0).toFixed(1);
      const pitchDeg = ((trim * 300 * 9.81) / 15000).toFixed(1);

      return [
        {
          label: "Net Aerostatic Lift",
          value: `${netKn} kN`,
          unit: "L_net",
          badgeColor: Number(netKn) > 0 ? "emerald" : "rose",
          progressPct: Math.min(100, (Number(netKn) / 40) * 100),
        },
        {
          label: "Gross Buoyancy",
          value: `${grossKn} kN`,
          unit: "L_gross",
          badgeColor: "cyan",
          progressPct: (Number(grossKn) / 140) * 100,
        },
        {
          label: "Pitch Trim Angle",
          value: `${pitchDeg}°`,
          unit: "α_trim",
          badgeColor: "indigo",
          progressPct: (Math.abs(Number(pitchDeg)) / 10) * 100,
        },
        {
          label: "Air Density",
          value: `${rhoAir.toFixed(3)} kg/m³`,
          unit: "ρ_air",
          badgeColor: "purple",
          progressPct: (rhoAir / 1.225) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Seventeen independent hydrogen gas cells enclosed inside a rigid duralumin space-frame provide 125 kN of aerostatic lift, protected from solar radiation and wind deformation.",
  },
  "us-727650-linde-air-liquefaction": {
    domain: "thermodynamics_transport",
    domainTitle: "Isenthalpic Joule-Thomson Cryogenic Throttling & Liquefaction",
    equationName: "Joule-Thomson Throttling & Counter-Current Heat Exchange",
    governingEquation:
      "\\mu_{\\text{JT}} = \\left(\\frac{\\partial T}{\\partial P}\\right)_H = \\frac{1}{C_p}\\left[T\\left(\\frac{\\partial V}{\\partial T}\\right)_P - V\\right] \\quad \\text{and} \\quad \\dot{Q} = U A \\Delta T_{\\text{LMTD}}",
    engineMethod: "FrankenSimEngine.stepLindeAirLiquefaction",
    controls: [
      {
        id: "compressorPress",
        label: "Multi-Stage Compressor Pressure",
        min: 100,
        max: 220,
        step: 5,
        defaultValue: 200,
        unit: "bar",
      },
      {
        id: "regenPasses",
        label: "Regenerator Exchanger Cycles",
        min: 10,
        max: 50,
        step: 2,
        defaultValue: 45,
        unit: "cycles",
      },
    ],
    computeMetrics: (p) => {
      const press = p.compressorPress ?? 200;
      const passes = p.regenPasses ?? 45;
      const coldK = Math.max(78, Math.round(293 - (passes / 50) * 215));
      const coldC = coldK - 273;
      const isLiq = coldK <= 80;
      const yieldPct = isLiq ? (((80 - (coldK - 78)) / 80) * 8.5).toFixed(1) : "0.0";
      const litersHr = ((press / 200) * Number(yieldPct) * 0.45).toFixed(2);

      return [
        {
          label: "Nozzle Cryo Temp",
          value: `${coldC} °C (${coldK} K)`,
          unit: "T_nozzle",
          badgeColor: isLiq ? "emerald" : "cyan",
          progressPct: ((293 - coldK) / 215) * 100,
        },
        {
          label: "Liquefaction Yield",
          value: `${yieldPct}%`,
          unit: "yield",
          badgeColor: isLiq ? "emerald" : "amber",
          progressPct: (Number(yieldPct) / 10) * 100,
        },
        {
          label: "Liquid Air Production",
          value: `${litersHr} L/hr`,
          unit: "output",
          badgeColor: isLiq ? "purple" : "indigo",
          progressPct: (Number(litersHr) / 5) * 100,
        },
        {
          label: "Cryogenic Phase",
          value: isLiq ? "LIQUID CONDENSING" : "PRECOOLING GAS",
          unit: "state",
          badgeColor: isLiq ? "emerald" : "cyan",
          progressPct: isLiq ? 100 : (passes / 50) * 80,
        },
      ];
    },
    pedagogicalInsight:
      "Isenthalpic expansion through a stationary needle valve produces a temperature drop that accumulates regeneratively through coaxial heat exchangers until air condenses at -193°C.",
  },
  "us-808897-carrier-air-conditioner": {
    domain: "thermodynamics_transport",
    domainTitle: "Psychrometric Moist Air Enthalpy & Dew-Point Dehumidification",
    equationName: "Moist Air Enthalpy & Dew-Point Condensation",
    governingEquation:
      "h = c_{pa} T + W(h_{fg0} + c_{pw}T) \\quad \\text{and} \\quad \\dot{m}_{\\text{cond}} = \\dot{m}_{\\text{air}}(W_{\\text{in}} - W_{\\text{dew}})",
    engineMethod: "FrankenSimEngine.stepCarrierAirConditioner",
    controls: [
      {
        id: "inletTemp",
        label: "Summer Outdoor Temperature",
        min: 25,
        max: 42,
        step: 1,
        defaultValue: 35,
        unit: "°C",
      },
      {
        id: "inletRh",
        label: "Outdoor Relative Humidity",
        min: 40,
        max: 95,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "sprayTemp",
        label: "Chilled Water Spray Temp",
        min: 4,
        max: 18,
        step: 1,
        defaultValue: 8,
        unit: "°C",
      },
      {
        id: "reheatTemp",
        label: "Sensible Reheat Supply Temp",
        min: 18,
        max: 26,
        step: 1,
        defaultValue: 22,
        unit: "°C",
      },
    ],
    computeMetrics: (p) => {
      const tIn = p.inletTemp ?? 35;
      const rhIn = p.inletRh ?? 75;
      const tSpray = p.sprayTemp ?? 8;
      const tReheat = p.reheatTemp ?? 22;
      const a = 17.27;
      const b = 237.7;
      const alpha = (a * tIn) / (b + tIn) + Math.log(rhIn / 100);
      const dewPoint = ((b * alpha) / (a - alpha)).toFixed(1);
      const moistureRemoved =
        tSpray < Number(dewPoint) ? ((Number(dewPoint) - tSpray) * 1.15).toFixed(1) : "0.0";
      const finalRh = Math.round(
        Math.min(
          100,
          Math.max(
            20,
            (100 * Math.exp((17.27 * tSpray) / (237.7 + tSpray))) /
              Math.exp((17.27 * tReheat) / (237.7 + tReheat)),
          ),
        ),
      );

      return [
        {
          label: "Intake Dew Point",
          value: `${dewPoint} °C`,
          unit: "T_dew",
          badgeColor: "amber",
          progressPct: (Number(dewPoint) / 40) * 100,
        },
        {
          label: "Moisture Extracted",
          value: `${moistureRemoved} g/kg`,
          unit: "ΔW",
          badgeColor: "emerald",
          progressPct: (Number(moistureRemoved) / 25) * 100,
        },
        {
          label: "Supply Air Temp",
          value: `${tReheat} °C`,
          unit: "T_supply",
          badgeColor: "cyan",
          progressPct: (tReheat / 30) * 100,
        },
        {
          label: "Supply Room RH",
          value: `${finalRh}%`,
          unit: "RH_out",
          badgeColor: finalRh >= 40 && finalRh <= 55 ? "emerald" : "indigo",
          progressPct: finalRh,
        },
      ];
    },
    pedagogicalInsight:
      "Atomized water chilled below the intake air dew point condenses humidity directly into the spray droplets; inertial eliminators trap mist before steam coils reheat air to comfortable humidity.",
  },
  "us-124404-westinghouse-air-brake": {
    domain: "thermo_fluid",
    domainTitle: "Continuous Pneumatic Train Line & Triple-Valve Differential Pressure Dynamics",
    equationName: "Boyle's Equalization & Train Line Rarefaction Wave Speed",
    governingEquation:
      "c = \\sqrt{\\gamma R T} \\approx 340\\text{ m/s} \\quad \\text{and} \\quad P_{\\text{final}}(V_{\\text{aux}} + V_{\\text{cyl}}) = P_{\\text{aux}} V_{\\text{aux}}",
    engineMethod: "FrankenSimEngine.stepWestinghouseAirBrake",
    controls: [
      {
        id: "trainPipePressure",
        label: "Brake Pipe Pressure (Locomotive Engineer Valve)",
        min: 0,
        max: 70,
        step: 5,
        defaultValue: 70,
        unit: "psi",
      },
      {
        id: "carMass",
        label: "Railcar Gross Mass",
        min: 20,
        max: 80,
        step: 5,
        defaultValue: 35,
        unit: "tonnes",
      },
    ],
    computeMetrics: (p) => {
      const pipePsi = p.trainPipePressure ?? 70;
      const mass = p.carMass ?? 35;
      const cylPsi = Math.max(0, Math.min(55, Math.round((70 - pipePsi) * 1.1)));
      const pistonThrustKn = ((cylPsi * 78.5 * 5 * 4.44822) / 1000).toFixed(1);
      const isEmergency = pipePsi < 10;
      const isService = pipePsi < 60 && !isEmergency;
      const stopDistM = cylPsi > 10 ? Math.round((500 * (mass / 35)) / (cylPsi / 50)) : 1200;

      return [
        {
          label: "Brake Cylinder Pressure",
          value: `${cylPsi} psi`,
          unit: "P_cyl",
          badgeColor: cylPsi > 30 ? "amber" : "emerald",
          progressPct: (cylPsi / 55) * 100,
        },
        {
          label: "Shoe Clamping Force",
          value: `${pistonThrustKn} kN`,
          unit: "F_clamp",
          badgeColor: Number(pistonThrustKn) > 40 ? "rose" : "cyan",
          progressPct: (Number(pistonThrustKn) / 85) * 100,
        },
        {
          label: "Triple Valve State",
          value: isEmergency
            ? "EMERGENCY DUMP"
            : isService
              ? "SERVICE APPLICATION"
              : "RUNNING / CHARGE",
          unit: "mode",
          badgeColor: isEmergency ? "rose" : isService ? "amber" : "emerald",
          progressPct: isEmergency ? 100 : isService ? 60 : 10,
        },
        {
          label: "Estimated Stop Distance",
          value: `${stopDistM} m`,
          unit: "d_stop",
          badgeColor: stopDistM < 400 ? "emerald" : "amber",
          progressPct: Math.min(100, (stopDistM / 1200) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "The triple valve inverts brake control: maintaining 70 psi in the continuous train pipe keeps the brakes released. When line pressure is dropped, higher pressure in the car's local auxiliary reservoir shifts the piston to dump air directly into the brake cylinder, stopping the train.",
  },
  "us-x72-whitney-cotton-gin": {
    domain: "aerodynamics_mbd",
    domainTitle: "Rotary Kinematics & Solid-State Fiber Separation",
    equationName: "Centrifugal Separation & Circular Shear Kinematics",
    governingEquation:
      "v_t = \\omega \\cdot r \\quad \\text{and} \\quad \\dot{m} = \\rho \\cdot A \\cdot v",
    engineMethod: "FrankenSimEngine.stepWhitneyCottonGin",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Speed",
        min: 60,
        max: 360,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.crankRpm ?? 180;
      const sawRpm = Math.round(rpm * 3.5);
      const brushRpm = Math.round(rpm * 12.0);
      const outputLbs = Math.round((rpm / 180) * 50);
      return [
        {
          label: "Saw Cylinder Speed",
          value: `${sawRpm} RPM`,
          unit: "omega_saw",
          badgeColor: "amber",
          progressPct: (sawRpm / 1260) * 100,
        },
        {
          label: "Brush Speed",
          value: `${brushRpm} RPM`,
          unit: "omega_brush",
          badgeColor: "cyan",
          progressPct: (brushRpm / 4320) * 100,
        },
        {
          label: "Daily Clean Fiber Yield",
          value: `${outputLbs} lbs/day`,
          unit: "m_dot",
          badgeColor: "emerald",
          progressPct: (outputLbs / 100) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Whitney's saw teeth hook fiber through narrow 2.8mm grate slots that block green seeds. The high-speed counter-rotating brush cylinder removes lint continuously via centrifugal airflow.",
  },
  "us-x8277-mccormick-reaper": {
    domain: "aerodynamics_mbd",
    domainTitle: "Ground-Traction Kinematics & Reciprocating Shear",
    equationName: "Cutter Frequency & Gathering Reel Cycloid Kinematics",
    governingEquation:
      "f_{\\text{cut}} = \\frac{v_{\\text{ground}}}{p_{\\text{stroke}}} \\cdot G_{\\text{ratio}}",
    engineMethod: "FrankenSimEngine.stepMcCormickReaper",
    controls: [
      {
        id: "forwardSpeedMph",
        label: "Horse Ground Speed",
        min: 1.0,
        max: 5.0,
        step: 0.2,
        defaultValue: 2.5,
        unit: "MPH",
      },
    ],
    computeMetrics: (p) => {
      const v = p.forwardSpeedMph ?? 2.5;
      const fCut = Math.round((v * 5280 * 12) / (3600 * 3.5));
      const reelRpm = Math.round(v * 12.5);
      const harvestRate = (v * 1.8).toFixed(1);
      return [
        {
          label: "Cutting Frequency",
          value: `${fCut} Hz`,
          unit: "f_cut",
          badgeColor: "amber",
          progressPct: (fCut / 35) * 100,
        },
        {
          label: "Gathering Reel",
          value: `${reelRpm} RPM`,
          unit: "omega_reel",
          badgeColor: "cyan",
          progressPct: (reelRpm / 65) * 100,
        },
        {
          label: "Harvest Velocity",
          value: `${harvestRate} acres/day`,
          unit: "dA/dt",
          badgeColor: "emerald",
          progressPct: (Number(harvestRate) / 10) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "The master traction bull wheel drives the gathering reel to sweep standing grain stalks across the triangular serrated sickle bar, depositing cut wheat onto the collection bed.",
  },
  "us-132-davenport-electric-motor": {
    domain: "electromagnetics_flux",
    domainTitle: "Permanent Magnet Stator & Commutated Rotor Torque",
    equationName: "Lorentz Force & Commutated Armature Torque",
    governingEquation:
      "\\tau = 2 \\cdot N \\cdot I \\cdot B \\cdot r \\cdot l \\cdot \\sin(\\theta)",
    engineMethod: "FrankenSimEngine.stepDavenportMotor",
    controls: [
      {
        id: "batteryVoltage",
        label: "Galvanic Battery Voltage",
        min: 4,
        max: 24,
        step: 1,
        defaultValue: 12,
        unit: "V",
      },
      {
        id: "loadTorque",
        label: "Mechanical Load Torque",
        min: 0.2,
        max: 2.5,
        step: 0.1,
        defaultValue: 0.8,
        unit: "N·m",
      },
    ],
    computeMetrics: (p) => {
      const v = p.batteryVoltage ?? 12;
      const load = p.loadTorque ?? 0.8;
      const rpm = Math.round((v / 12) * (450 / Math.max(0.5, load)));
      const powerW = Math.round(((rpm * 2 * Math.PI) / 60) * load);
      return [
        {
          label: "Motor Speed",
          value: `${rpm} RPM`,
          unit: "omega",
          badgeColor: "cyan",
          progressPct: (rpm / 900) * 100,
        },
        {
          label: "Shaft Power Output",
          value: `${powerW} W`,
          unit: "P_out",
          badgeColor: "amber",
          progressPct: (powerW / 120) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Davenport's split-ring commutator reverses the polarity of the cross-arm electromagnets every half revolution, producing continuous rotation against permanent stator shoes.",
  },
  "us-588-ericsson-propeller": {
    domain: "aerodynamics_mbd",
    domainTitle: "Hydrodynamics & Contra-Rotating Screw Propulsion",
    equationName: "Screw Propeller Thrust & Axial Momentum Theory",
    governingEquation: "T = \\rho \\cdot A \\cdot v_a \\cdot (v_j - v_a)",
    engineMethod: "FrankenSimEngine.stepEricssonPropeller",
    controls: [
      {
        id: "shaftRpm",
        label: "Engine Shaft Speed",
        min: 40,
        max: 240,
        step: 10,
        defaultValue: 120,
        unit: "RPM",
      },
      {
        id: "bladePitchAngleDeg",
        label: "Helical Blade Pitch Angle",
        min: 20,
        max: 55,
        step: 1,
        defaultValue: 35,
        unit: "°",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.shaftRpm ?? 120;
      const pitchDeg = p.bladePitchAngleDeg ?? 35;
      const pitchFactor = Math.tan((pitchDeg * Math.PI) / 180) / Math.tan((35 * Math.PI) / 180);
      const speedKnots = ((rpm / 120) * 8.5 * pitchFactor).toFixed(1);
      const thrustKn = Math.round((rpm / 120) ** 2 * 18 * pitchFactor);
      return [
        {
          label: "Vessel Speed",
          value: `${speedKnots} Knots`,
          unit: "v_ship",
          badgeColor: "cyan",
          progressPct: (Number(speedKnots) / 22) * 100,
        },
        {
          label: "Axial Thrust",
          value: `${thrustKn} kN`,
          unit: "T_prop",
          badgeColor: "emerald",
          progressPct: (thrustKn / 90) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Concentric shafts drive two contra-rotating screw wheels enclosed in cylindrical shroud rings, canceling gyroscopic torque and rotational wake turbulence.",
  },
  "us-6162-corliss-steam-engine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Thermodynamics & Variable Cut-Off Steam Valve Gear",
    equationName: "Rankine Thermodynamic Expansion & Indicated Power",
    governingEquation:
      "P_{\\text{IHP}} = \\frac{p_{\\text{mep}} \\cdot L \\cdot A \\cdot N}{33000}",
    engineMethod: "FrankenSimEngine.stepCorlissEngine",
    controls: [
      {
        id: "steamPressurePsi",
        label: "Boiler Steam Pressure",
        min: 40,
        max: 180,
        step: 5,
        defaultValue: 100,
        unit: "PSI",
      },
      {
        id: "engineRpm",
        label: "Engine Speed",
        min: 30,
        max: 120,
        step: 5,
        defaultValue: 65,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const psi = p.steamPressurePsi ?? 100;
      const rpm = p.engineRpm ?? 65;
      const ihp = Math.round(psi * rpm * 0.25 * 1.8);
      return [
        {
          label: "Indicated Horsepower",
          value: `${ihp} IHP`,
          unit: "P_ind",
          badgeColor: "amber",
          progressPct: (ihp / 500) * 100,
        },
        {
          label: "Thermal Efficiency",
          value: "24.5%",
          unit: "eta_th",
          badgeColor: "emerald",
          progressPct: 75,
        },
      ];
    },
    pedagogicalInsight:
      "The central oscillating wrist-plate trips the admission valves closed instantaneously via pneumatic dashpots, allowing steam to expand adiabatically without throttling loss.",
  },
  "us-36836-gatling-gun": {
    domain: "aerodynamics_mbd",
    domainTitle: "Kinematics & Rotary Cam-Driven Cyclic Action",
    equationName: "Cyclic Fire Rate & Spiral Cam Kinematics",
    governingEquation:
      "\\text{RPM}_{\\text{fire}} = N_{\\text{barrels}} \\cdot \\text{RPM}_{\\text{crank}}",
    engineMethod: "FrankenSimEngine.stepGatlingGun",
    controls: [
      {
        id: "crankRpm",
        label: "Hand Crank Rotation Rate",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "RPM",
      },
      {
        id: "barrelCount",
        label: "Revolving Barrel Cluster Count",
        min: 4,
        max: 10,
        step: 2,
        defaultValue: 6,
        unit: "barrels",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.crankRpm ?? 60;
      const count = p.barrelCount ?? 6;
      const rof = Math.round(rpm * count);
      return [
        {
          label: "Rate of Fire",
          value: `${rof} rounds/min`,
          unit: "ROF",
          badgeColor: "rose",
          progressPct: (rof / 1200) * 100,
        },
        {
          label: "Barrel Cooling Interval",
          value: `${((60 / Math.max(1, rof)) * count).toFixed(2)} s`,
          unit: "t_cool",
          badgeColor: "cyan",
          progressPct: 80,
        },
      ];
    },
    pedagogicalInsight:
      "Six revolving barrels rotate around a stationary central cylinder containing spiral cam grooves that load, cock, lock, fire, and extract cartridges during one continuous turn.",
  },
  "us-78317-nobel-dynamite": {
    domain: "solid_mechanics",
    domainTitle: "Explosive Detonation & Porous Matrix Stabilization",
    equationName: "Chapman-Jouguet Detonation Velocity",
    governingEquation: "D = \\sqrt{2 \\cdot (\\gamma^2 - 1) \\cdot q}",
    engineMethod: "FrankenSimEngine.stepNobelDynamite",
    controls: [
      {
        id: "ngConcentrationPct",
        label: "Nitroglycerin Matrix Absorption",
        min: 50,
        max: 85,
        step: 5,
        defaultValue: 75,
        unit: "%",
      },
      {
        id: "capEnergyJoules",
        label: "Blasting Cap Shock Energy",
        min: 0.2,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.2,
        unit: "J",
      },
    ],
    computeMetrics: (p) => {
      const ng = p.ngConcentrationPct ?? 75;
      const cap = p.capEnergyJoules ?? 1.2;
      const vDet = Math.round(5500 + (ng - 50) * 80);
      const isInitiated = cap >= 0.4;
      return [
        {
          label: "Detonation Velocity",
          value: isInitiated ? `${vDet} m/s` : "0 m/s (Sub-threshold)",
          unit: "D_CJ",
          badgeColor: isInitiated ? "rose" : "amber",
          progressPct: isInitiated ? (vDet / 8500) * 100 : 0,
        },
        {
          label: "Porous Cushioning Factor",
          value: "3.8×",
          unit: "safety",
          badgeColor: "emerald",
          progressPct: 90,
        },
      ];
    },
    pedagogicalInsight:
      "Inert porous kieselguhr absorbs liquid nitroglycerin like a sponge, rendering the explosive insensitive to shock while the fulminate of mercury cap delivers the shockwave necessary for full detonation.",
  },
  "us-79265-sholes-typewriter": {
    domain: "aerodynamics_mbd",
    domainTitle: "Mechanism Kinematics & Anti-Collision Type-Basket",
    equationName: "Typebar Angular Acceleration & Escapement Pitch",
    governingEquation:
      "\\tau_{\\text{key}} = I_{\\text{bar}} \\cdot \\alpha \\quad \\text{and} \\quad \\Delta x_{\\text{platen}} = p_{\\text{pitch}}",
    engineMethod: "FrankenSimEngine.stepSholesTypewriter",
    controls: [
      {
        id: "typingSpeedWpm",
        label: "Typing Cadence",
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 60,
        unit: "WPM",
      },
    ],
    computeMetrics: (p) => {
      const wpm = p.typingSpeedWpm ?? 60;
      const cps = (wpm * 5) / 60;
      return [
        {
          label: "Key Strike Frequency",
          value: `${cps.toFixed(1)} chars/sec`,
          unit: "f_strike",
          badgeColor: "amber",
          progressPct: (cps / 12) * 100,
        },
        {
          label: "QWERTY Jam Suppression",
          value: "98.5%",
          unit: "anti-jam",
          badgeColor: "emerald",
          progressPct: 98,
        },
      ];
    },
    pedagogicalInsight:
      "Radial typebars swing up to hit the central printing guide beneath the platen. The QWERTY layout separates commonly paired letters across opposite sectors to prevent physical clashes.",
  },
  "us-105338-hyatt-celluloid": {
    domain: "solid_mechanics",
    domainTitle: "Thermoplastic Rheology & Hydraulic Injection",
    equationName: "Arrhenius Viscosity & Hydraulic Ram Extrusion",
    governingEquation: "\\eta(T) = \\eta_0 \\cdot \\exp\\left(\\frac{E_a}{R \\cdot T}\\right)",
    engineMethod: "FrankenSimEngine.stepHyattCelluloid",
    controls: [
      {
        id: "steamTempC",
        label: "Steam Jacket Temperature",
        min: 70,
        max: 160,
        step: 5,
        defaultValue: 95,
        unit: "°C",
      },
      {
        id: "hydraulicPressureMpa",
        label: "Hydraulic Ram Pressure",
        min: 4,
        max: 25,
        step: 1,
        defaultValue: 10,
        unit: "MPa",
      },
    ],
    computeMetrics: (p) => {
      const temp = p.steamTempC ?? 95;
      const press = p.hydraulicPressureMpa ?? 10;
      const visc = Math.round(1800 * Math.exp(-0.03 * (temp - 70)));
      const isMelted = temp >= 80 && press >= 6;
      return [
        {
          label: "Melt Viscosity",
          value: `${visc} Pa·s`,
          unit: "eta",
          badgeColor: "amber",
          progressPct: Math.min(100, (visc / 2000) * 100),
        },
        {
          label: "Plasticity State",
          value: isMelted ? "FLUID INJECTION" : "RIGID SOLID",
          unit: "phase",
          badgeColor: isMelted ? "emerald" : "rose",
          progressPct: isMelted ? 100 : 20,
        },
      ];
    },
    pedagogicalInsight:
      "Camphor plasticizes nitrocellulose into the first synthetic thermoplastic. The steam-jacketed cylinder heats the mass to $120^\\circ\\text{C}$ where hydraulic pressure forces it into precision split molds.",
  },
  "us-120057-gramme-dynamo": {
    domain: "electromagnetics_flux",
    domainTitle: "Continuous Direct-Current Toroidal Electromagnetics",
    equationName: "Faraday Induced EMF & Ring Armature Integration",
    governingEquation:
      "\\mathcal{E} = -N \\cdot \\frac{d\\Phi_B}{dt} = \\frac{p \\cdot N \\cdot \\Phi \\cdot n}{60 \\cdot a}",
    engineMethod: "FrankenSimEngine.stepGrammeDynamo",
    controls: [
      {
        id: "shaftRpm",
        label: "Dynamo Shaft Speed",
        min: 300,
        max: 1600,
        step: 50,
        defaultValue: 950,
        unit: "RPM",
      },
      {
        id: "coilSegments",
        label: "Toroidal Coil Segments",
        min: 12,
        max: 48,
        step: 4,
        defaultValue: 32,
        unit: "segments",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.shaftRpm ?? 950;
      const segs = p.coilSegments ?? 32;
      const emf = Math.round((rpm / 950) * 110 * (segs / 32));
      const power = Math.round(emf ** 2 / 12);
      return [
        {
          label: "Generated EMF",
          value: `${emf} V DC`,
          unit: "EMF",
          badgeColor: "cyan",
          progressPct: (emf / 200) * 100,
        },
        {
          label: "Electrical Output",
          value: `${power} W`,
          unit: "P_elec",
          badgeColor: "amber",
          progressPct: (power / 3000) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "The continuous toroidal ring core keeps magnetic flux constant in both halves of the winding. The commutator taps smooth DC output with negligible ripple voltage.",
  },
  "us-135245-pasteur-fermentation": {
    domain: "thermal_transport",
    domainTitle: "Biochemical Kinetics & Sterile Barrier Thermodynamics",
    equationName: "Thermal Sterilization & Biological Inactivation",
    governingEquation: "k = A \\cdot \\exp\\left(-\\frac{E_a}{R \\cdot T}\\right)",
    engineMethod: "FrankenSimEngine.stepPasteurFermentation",
    controls: [
      {
        id: "pasteurizationTempC",
        label: "Pasteurization Bath Temperature",
        min: 45,
        max: 75,
        step: 1,
        defaultValue: 58,
        unit: "°C",
      },
      {
        id: "holdTimeMin",
        label: "Thermal Hold Time",
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 20,
        unit: "min",
      },
      {
        id: "wortTempC",
        label: "Fermentation Wort Temperature",
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 22,
        unit: "°C",
      },
    ],
    computeMetrics: (p) => {
      const pTemp = p.pasteurizationTempC ?? 58;
      const hold = p.holdTimeMin ?? 20;
      const temp = p.wortTempC ?? 22;
      const logRed = Math.min(8.0, (hold / 20) * ((pTemp - 45) / 10) * 4.5);
      const activity = Math.min(100, Math.round(100 * Math.exp(-0.02 * (temp - 24) ** 2)));
      return [
        {
          label: "Bacterial Inactivation",
          value: `${logRed.toFixed(1)} log reduction`,
          unit: "log_N",
          badgeColor: logRed >= 5 ? "emerald" : "amber",
          progressPct: Math.min(100, (logRed / 6) * 100),
        },
        {
          label: "Yeast Culture Activity",
          value: `${activity}%`,
          unit: "rate",
          badgeColor: activity > 70 ? "emerald" : "amber",
          progressPct: activity,
        },
      ];
    },
    pedagogicalInsight:
      "Pasteur's narrow S-curved swan-neck pipe lets air enter freely while atmospheric dust and wild airborne bacteria settle in the lower bend, preserving pure yeast strains.",
  },
  "us-157124-glidden-barbed-wire": {
    domain: "solid_mechanics",
    domainTitle: "Elastic Continuum Mechanics & Torsional Wire Locking",
    equationName: "Hooke Tensile Stress & Helical Wire Twist",
    governingEquation:
      "\\sigma = E \\cdot \\epsilon = \\frac{F}{A} \\quad \\text{and} \\quad \\theta_{\\text{twist}} = \\frac{T \\cdot L}{J \\cdot G}",
    engineMethod: "FrankenSimEngine.stepGliddenBarbedWire",
    controls: [
      {
        id: "wireTensionN",
        label: "Line Wire Tension",
        min: 200,
        max: 1200,
        step: 50,
        defaultValue: 650,
        unit: "N",
      },
      {
        id: "twistsPerFoot",
        label: "Helical Twist Rate",
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        unit: "twists/ft",
      },
      {
        id: "animalPushForceN",
        label: "Livestock Push Force",
        min: 20,
        max: 300,
        step: 10,
        defaultValue: 120,
        unit: "N",
      },
    ],
    computeMetrics: (p) => {
      const t = p.wireTensionN ?? 650;
      const twists = p.twistsPerFoot ?? 5;
      const push = p.animalPushForceN ?? 120;
      const sagCm = Number((2800 / Math.max(100, t)).toFixed(1));
      const barbSlipThresholdN = twists * 95;
      const isLocked = barbSlipThresholdN >= push;
      return [
        {
          label: "Span Sag",
          value: `${sagCm} cm`,
          unit: "delta_y",
          badgeColor: sagCm < 5 ? "emerald" : "amber",
          progressPct: Math.min(100, (sagCm / 15) * 100),
        },
        {
          label: "Barb Longitudinal Lock",
          value: isLocked ? "LOCKED (No Slip)" : "SLIPPING (Insufficient Twist)",
          unit: "lock",
          badgeColor: isLocked ? "emerald" : "rose",
          progressPct: isLocked ? 100 : 25,
        },
      ];
    },
    pedagogicalInsight:
      "Coiling the short spur wire around a single core strand and twisting a second line wire around it locks the barb permanently in place against longitudinal slipping or livestock pressure.",
  },
  "us-194047-otto-engine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Internal Combustion & 4-Stroke Otto Thermodynamic Cycle",
    equationName: "Air-Standard Otto Cycle Efficiency",
    governingEquation:
      "\\eta_{\\text{Otto}} = 1 - \\frac{1}{r_c^{\\gamma - 1}} \\quad (\\gamma = 1.4)",
    engineMethod: "FrankenSimEngine.stepOttoEngine",
    controls: [
      {
        id: "engineRpm",
        label: "Crankshaft Speed",
        min: 60,
        max: 320,
        step: 10,
        defaultValue: 180,
        unit: "RPM",
      },
      {
        id: "compressionRatio",
        label: "Geometric Compression Ratio",
        min: 3.0,
        max: 8.0,
        step: 0.5,
        defaultValue: 4.5,
        unit: ":1",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.engineRpm ?? 180;
      const cr = p.compressionRatio ?? 4.5;
      const hp = ((rpm / 180) * (3.0 * (cr / 4.5) ** 0.5)).toFixed(1);
      const etaPct = Math.round((1 - 1 / cr ** 0.4) * 100);
      return [
        {
          label: "Brake Horsepower",
          value: `${hp} BHP`,
          unit: "P_bhp",
          badgeColor: "amber",
          progressPct: (Number(hp) / 6) * 100,
        },
        {
          label: "Cycle Efficiency",
          value: `${etaPct}%`,
          unit: "eta_otto",
          badgeColor: "emerald",
          progressPct: etaPct,
        },
      ];
    },
    pedagogicalInsight:
      "The four distinct strokes (Intake, Compression, Power, Exhaust) compress the fuel-air charge prior to flame ignition, raising peak thermodynamic combustion temperature and work output.",
  },
  "us-200521-edison-phonograph": {
    domain: "solid_mechanics",
    domainTitle: "Acoustic Transduction & Micro-Groove Indentation",
    equationName: "Acoustic Pressure & Diaphragm Displacement",
    governingEquation:
      "p(t) = \\rho_0 \\cdot c \\cdot v(t) \\quad \\text{and} \\quad z(t) = \\frac{p(t) \\cdot A}{k_{\\text{mica}}}",
    engineMethod: "FrankenSimEngine.stepEdisonPhonograph",
    controls: [
      {
        id: "mandrelRpm",
        label: "Mandrel Rotational Speed",
        min: 40,
        max: 140,
        step: 5,
        defaultValue: 60,
        unit: "RPM",
      },
      {
        id: "voiceVolumeDb",
        label: "Acoustic Voice Volume",
        min: 40,
        max: 100,
        step: 5,
        defaultValue: 75,
        unit: "dB",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.mandrelRpm ?? 60;
      const vol = p.voiceVolumeDb ?? 75;
      const trackSpeed = ((rpm / 60) * Math.PI * 4.0).toFixed(1);
      const depthMicrons = ((vol / 75) * 25).toFixed(1);
      return [
        {
          label: "Linear Tracking Speed",
          value: `${trackSpeed} in/s`,
          unit: "v_track",
          badgeColor: "amber",
          progressPct: (Number(trackSpeed) / 30) * 100,
        },
        {
          label: "Indentation Depth",
          value: `${depthMicrons} µm`,
          unit: "depth",
          badgeColor: "cyan",
          progressPct: Math.min(100, (Number(depthMicrons) / 35) * 100),
        },
      ];
    },
    pedagogicalInsight:
      "Acoustic sound waves vibrate a thin mica diaphragm, driving a steel stylus into a sheet of tinfoil wrapped around a grooved brass cylinder advancing along a lead-screw mandrel.",
  },
  "us-233692-pelton-water-wheel": {
    domain: "aerodynamics_mbd",
    domainTitle: "Impulse Hydrodynamics & Momentum Transfer",
    equationName: "Euler Turbine Equation & Dual-Cup Jet Deflection",
    governingEquation:
      "P = \\rho \\cdot Q \\cdot v_{\\text{jet}} \\cdot u \\cdot (1 - \\cos \\beta) \\quad (\\beta = 165^\\circ)",
    engineMethod: "FrankenSimEngine.stepPeltonWheel",
    controls: [
      {
        id: "headMeters",
        label: "Hydraulic Water Head",
        min: 50,
        max: 600,
        step: 25,
        defaultValue: 450,
        unit: "m",
      },
      {
        id: "runnerRpm",
        label: "Runner Rotational Speed",
        min: 100,
        max: 900,
        step: 25,
        defaultValue: 600,
        unit: "RPM",
      },
    ],
    computeMetrics: (p) => {
      const h = p.headMeters ?? 450;
      const rpm = p.runnerRpm ?? 600;
      const vJet = Math.round(Math.sqrt(2 * 9.81 * h));
      const uBucket = (rpm * 2 * Math.PI * 0.75) / 60;
      const speedRatio = uBucket / Math.max(1, vJet);
      const eta = Math.max(40, Math.round(93 - Math.abs(speedRatio - 0.5) * 160));
      const hydroKw = (45 * 9.81 * h) / 1000;
      const kw = Math.round(hydroKw * (eta / 100));
      return [
        {
          label: "Jet Velocity",
          value: `${vJet} m/s`,
          unit: "v_jet",
          badgeColor: "cyan",
          progressPct: (vJet / 110) * 100,
        },
        {
          label: "Turbine Efficiency",
          value: `${eta}%`,
          unit: "eta",
          badgeColor: eta >= 85 ? "emerald" : "amber",
          progressPct: eta,
        },
        {
          label: "Turbine Shaft Power",
          value: `${kw} kW`,
          unit: "P_hydro",
          badgeColor: "emerald",
          progressPct: (kw / 250) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "The knife-edge splitter divides the jet into two equal halves deflected backward at $165^\\circ$, extracting nearly 90% of kinetic energy while avoiding jet interference.",
  },
  "us-247804-delaval-separator": {
    domain: "aerodynamics_mbd",
    domainTitle: "Centrifugal Dynamics & Multi-Phase Fluid Separation",
    equationName: "Centrifugal Acceleration & Stokes Separation Velocity",
    governingEquation:
      "a_c = \\omega^2 \\cdot r \\quad \\text{and} \\quad v_r = \\frac{d^2 \\cdot (\\rho_{\\text{skim}} - \\rho_{\\text{fat}}) \\cdot \\omega^2 \\cdot r}{18 \\cdot \\mu}",
    engineMethod: "FrankenSimEngine.stepDeLavalSeparator",
    controls: [
      {
        id: "bowlRpm",
        label: "Centrifuge Bowl Speed",
        min: 2000,
        max: 9000,
        step: 250,
        defaultValue: 6500,
        unit: "RPM",
      },
      {
        id: "rawMilkFlowLph",
        label: "Raw Milk Feed Rate",
        min: 100,
        max: 600,
        step: 25,
        defaultValue: 300,
        unit: "L/h",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.bowlRpm ?? 6500;
      const flow = p.rawMilkFlowLph ?? 300;
      const g = Math.round((((rpm * 2 * Math.PI) / 60) ** 2 * 0.1) / 9.80665);
      const yieldFat = Math.min(99.9, Number((95 + (g / 5000) * 4.5).toFixed(1)));
      const creamFlow = Number((flow * 0.12).toFixed(1));
      return [
        {
          label: "Centrifugal G-Force",
          value: `${g.toLocaleString()} g`,
          unit: "a_c",
          badgeColor: "rose",
          progressPct: (g / 11000) * 100,
        },
        {
          label: "Fat Separation Yield",
          value: `${yieldFat}%`,
          unit: "yield",
          badgeColor: "emerald",
          progressPct: Number(yieldFat),
        },
        {
          label: "Cream Discharge Rate",
          value: `${creamFlow} L/h`,
          unit: "Q_cream",
          badgeColor: "cyan",
          progressPct: (creamFlow / 75) * 100,
        },
      ];
    },
    pedagogicalInsight:
      "Rotating at 6,000 RPM on a self-centering flexible spindle, the conical disc stack forces dense skim milk to the bowl perimeter while light butterfat concentrates along the central axis.",
  },
  "us-347140-thomson-welding": {
    domain: "electromagnetics_flux",
    domainTitle: "Electric Resistance Joule Heating & Solid-State Fusion",
    equationName: "Joule Heating & Upset Forge Welding",
    governingEquation: "Q = I^2 \\cdot R_{\\text{contact}} \\cdot t",
    engineMethod: "FrankenSimEngine.stepThomsonWelding",
    controls: [
      {
        id: "weldCurrentAmps",
        label: "Secondary Welding Current",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 4500,
        unit: "A",
      },
      {
        id: "clampPressureMpa",
        label: "Mechanical Upset Pressure",
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 35,
        unit: "MPa",
      },
    ],
    computeMetrics: (p) => {
      const i = p.weldCurrentAmps ?? 4500;
      const press = p.clampPressureMpa ?? 35;
      const kw = Math.round((i ** 2 * 0.00018) / 1000);
      const tempC = Math.round(25 + (kw / 3.6) * 850);
      const isForged = tempC >= 1150 && press >= 25;
      return [
        {
          label: "Joule Heat Rate",
          value: `${kw} kW`,
          unit: "P_joule",
          badgeColor: "rose",
          progressPct: (kw / 8) * 100,
        },
        {
          label: "Interface Temperature",
          value: `${tempC}°C`,
          unit: "T_weld",
          badgeColor: tempC >= 1150 ? "amber" : "cyan",
          progressPct: Math.min(100, (tempC / 1500) * 100),
        },
        {
          label: "Solid-State Weld Quality",
          value: isForged ? "SOLID FORGE WELD" : "COLD / UNFORGED",
          unit: "fusion",
          badgeColor: isForged ? "emerald" : "rose",
          progressPct: isForged ? 100 : 30,
        },
      ];
    },
    pedagogicalInsight:
      "A massive single-turn copper secondary bar steps AC down to 1.5V at 2,500A. Localized resistance at the abutted joint heats steel to plastic fusion temperature where an upset screw welds the bond.",
  },
  "us-608969-parsons-turbine": {
    domain: "aerodynamics_mbd",
    domainTitle: "Multi-Stage Axial Steam Expansion & Reaction Blading",
    equationName: "Reaction Turbine Enthalpy Drop & Stage Expansion",
    governingEquation:
      "\\Delta h_{\\text{stage}} = \\frac{1}{2} \\cdot (v_1^2 - v_2^2) + \\frac{1}{2} \\cdot (w_2^2 - w_1^2)",
    engineMethod: "FrankenSimEngine.stepParsonsTurbine",
    controls: [
      {
        id: "rotorRpm",
        label: "Turbine Rotor Speed",
        min: 1000,
        max: 6000,
        step: 100,
        defaultValue: 3000,
        unit: "RPM",
      },
      {
        id: "inletPressurePsi",
        label: "Boiler Inlet Steam Pressure",
        min: 60,
        max: 300,
        step: 10,
        defaultValue: 180,
        unit: "psi",
      },
    ],
    computeMetrics: (p) => {
      const rpm = p.rotorRpm ?? 3000;
      const psi = p.inletPressurePsi ?? 180;
      const enthalpy = Math.round(550 * (psi / 180));
      const kw = Math.round(28 * enthalpy * 0.84 * (rpm / 3000));
      return [
        {
          label: "Shaft Power Output",
          value: `${kw.toLocaleString()} kW`,
          unit: "P_shaft",
          badgeColor: "emerald",
          progressPct: (kw / 25000) * 100,
        },
        {
          label: "Inlet Pressure",
          value: `${(psi * 0.00689476).toFixed(2)} MPa`,
          unit: "P_inlet",
          badgeColor: "amber",
          progressPct: (psi / 300) * 100,
        },
        {
          label: "Reaction Expansion",
          value: "45 Compound Stages",
          unit: "stages",
          badgeColor: "cyan",
          progressPct: 100,
        },
      ];
    },
    pedagogicalInsight:
      "Parsons divided high-pressure steam expansion across multiple expanding annular rows of reaction blades, keeping tip velocity manageable while directly driving high-speed electrical alternators.",
  },
};
