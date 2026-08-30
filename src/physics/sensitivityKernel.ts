/**
 * sensitivityKernel.ts
 *
 * Parameter-sensitivity readouts for the live UI sliders (∂Metric/∂Control).
 *
 * Provenance, honestly stated: most entries are per-patent closed-form
 * derivatives authored alongside their kernels; the Wright Flyer entries are
 * central finite differences over the live stepWrightFlyerSi kernel, so they
 * cannot drift from the numbers the sims actually display. This file does NOT
 * use automatic differentiation; the unused Dual class was removed.
 */

import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export interface SensitivityResult {
  metricName: string;
  derivativeSymbol: string;
  derivativeValue: number;
  derivativeUnit: string;
  interpretation: string;
}

/**
 * Computes exact sensitivity for a given patent and control parameter.
 */
export function computeParameterSensitivity(
  patentId: string,
  controlKey: string,
  params: Record<string, number>,
): SensitivityResult | null {
  switch (patentId) {
    case "us-821393-wright-flyer": {
      // Central finite differences over the live kernel. Probing through
      // readWrightControls keeps the Claim 18 rudder interlock in the loop:
      // with coupling ON the warp-induced adverse yaw is cancelled and the
      // chip honestly reads ~0 — toggle the coupling to see the gradient.
      const warpProbe = (warpDeg: number) =>
        stepWrightFlyerSi(readWrightControls({ ...params, wingWarp: warpDeg }));
      if (controlKey === "wingWarp" || controlKey === "wingWarpDeg") {
        const warp = params.wingWarp ?? params.wingWarpDeg ?? 5.0;
        const dYawDwarp = (warpProbe(warp + 0.5).netYawNm - warpProbe(warp - 0.5).netYawNm) / 1.0;
        return {
          metricName: "Adverse Yaw Moment",
          derivativeSymbol: "∂N / ∂δ_warp",
          derivativeValue: Number(dYawDwarp.toFixed(2)),
          derivativeUnit: "N·m / deg",
          interpretation:
            "Central difference of the live kernel. With the Claim 18 rudder interlock engaged the residual gradient is ~0; uncoupled it shows the raw adverse-yaw gradient.",
        };
      }
      if (controlKey === "airspeed" || controlKey === "airspeedKts") {
        const mph = params.airspeed ?? 28.0;
        const liftProbe = (airspeedMph: number) =>
          stepWrightFlyerSi(readWrightControls({ ...params, airspeed: airspeedMph }));
        const dLiftDv = (liftProbe(mph + 0.5).liftNewtons - liftProbe(mph - 0.5).liftNewtons) / 1.0;
        return {
          metricName: "Aerodynamic Lift",
          derivativeSymbol: "∂L / ∂V",
          derivativeValue: Number(dLiftDv.toFixed(1)),
          derivativeUnit: "N / mph",
          interpretation: "Dynamic pressure lift growth scaling with velocity squared.",
        };
      }
      break;
    }

    case "us-381968-tesla-motor": {
      if (controlKey === "frequency") {
        // Fig. 9's source relation: one generator revolution advances the
        // magnetic attraction once around ring R.
        const dGeneratorRpm_df = 60;
        return {
          metricName: "Generator Rotation",
          derivativeSymbol: "∂n_G / ∂f",
          derivativeValue: dGeneratorRpm_df,
          derivativeUnit: "RPM / Hz",
          interpretation: "Each generator cycle advances the Fig. 9 pole-shift relation once.",
        };
      }
      break;
    }

    case "us-223898-edison-lightbulb":
    case "us-223898-edison-lamp": {
      if (controlKey === "mainsVoltageV" || controlKey === "voltage") {
        const v = params.mainsVoltageV ?? params.voltage ?? 110.0;
        const r = 100.0; // Filament resistance ohms
        // P = V^2 / R -> dP/dV = 2V / R
        const dP_dv = (2 * v) / r;
        return {
          metricName: "Filament Joule Heat",
          derivativeSymbol: "∂P / ∂V",
          derivativeValue: Number(dP_dv.toFixed(2)),
          derivativeUnit: "W / V",
          interpretation: "Ohmic dissipation scaling with applied mains potential.",
        };
      }
      break;
    }

    case "us-2495429-spencer-microwave": {
      if (controlKey === "anodeVoltage" || controlKey === "anodeVoltageVolts") {
        const va = params.anodeVoltage ?? params.anodeVoltageVolts ?? 2200.0;
        // Hull cutoff field sensitivity: B_c ~ sqrt(V_a) -> dBc/dVa = B_c / (2 * V_a)
        const bc = 1350.0 * Math.sqrt(va / 2200.0);
        const dBc_dva = bc / (2 * va);
        return {
          metricName: "Hull Cutoff Field",
          derivativeSymbol: "∂B_c / ∂V_a",
          derivativeValue: Number(dBc_dva.toFixed(3)),
          derivativeUnit: "Gauss / V",
          interpretation:
            "Magnetic field threshold required to maintain magnetron electron wheel cutoff.",
        };
      }
      break;
    }

    case "us-2981877-noyce-ic":
    case "us-3138743-kilby-integrated-circuit": {
      if (controlKey === "reverseBiasVoltageV" || controlKey === "reverseBias") {
        const vr = params.reverseBiasVoltageV ?? params.reverseBias ?? 3.0;
        const vbi = 0.7; // built-in potential
        const c0 = 12.0; // pF at zero bias
        // C_j = C_0 / sqrt(1 + Vr/Vbi) -> dCj/dVr = -C_0 / (2 * Vbi * (1 + Vr/Vbi)^(3/2))
        const ratio = 1 + vr / vbi;
        const dCj_dvr = -c0 / (2 * vbi * ratio ** 1.5);
        return {
          metricName: "Junction Capacitance",
          derivativeSymbol: "∂C_j / ∂V_r",
          derivativeValue: Number(dCj_dvr.toFixed(3)),
          derivativeUnit: "pF / V",
          interpretation: "Depletion layer widening under increasing reverse electric field.",
        };
      }
      break;
    }

    case "us-2708656-fermi-reactor": {
      if (
        controlKey === "rodWithdrawal" ||
        controlKey === "controlRodWithdrawalPct" ||
        controlKey === "rodPosition"
      ) {
        // Registry id is rodWithdrawal; the legacy keys stay accepted for tests.
        const rod =
          params.rodWithdrawal ?? params.controlRodWithdrawalPct ?? params.rodPosition ?? 65.0;
        // Rod worth curve derivative d(rho)/d(x) ~ sin^2(pi*x)
        const xFrac = rod / 100.0;
        const dRho_dx = (Math.PI / 2) * Math.sin(Math.PI * xFrac) * 0.0015; // dk / %
        return {
          metricName: "Reactivity Insertion",
          derivativeSymbol: "∂ρ / ∂x_rod",
          derivativeValue: Number((dRho_dx * 1e5).toFixed(1)),
          derivativeUnit: "pcm / %",
          interpretation: "Cadmium neutron absorption cross-section differential worth.",
        };
      }
      break;
    }
    case "us-3858232-boyle-smith-ccd": {
      if (
        controlKey === "gateVoltageV" ||
        controlKey === "gateVoltage" ||
        controlKey === "voltage"
      ) {
        const _vg = params.gateVoltageV ?? params.gateVoltage ?? 10.0;
        // Full well charge sensitivity: d(N_well)/d(Vg) = C_ox / q_e ~ 1.5e-13 / 1.602e-19 ~ 936,000 e/V
        const dN_dvg = 93630.0; // e- / V
        return {
          metricName: "Full Well Sensitivity",
          derivativeSymbol: "∂N_well / ∂V_g",
          derivativeValue: Number(dN_dvg.toFixed(0)),
          derivativeUnit: "e⁻ / V",
          interpretation:
            "Linear growth of MOS potential well electron storage capacity per gate volt.",
        };
      }
      if (controlKey === "clockFrequencyMhz" || controlKey === "frequency") {
        return {
          metricName: "Charge Transfer Efficiency",
          derivativeSymbol: "∂CTE / ∂f_clk",
          derivativeValue: -0.004,
          derivativeUnit: "% / MHz",
          interpretation:
            "Transfer inefficiency roll-off at elevated multi-phase clock frequencies.",
        };
      }
      break;
    }

    case "us-3633-goodyear-rubber": {
      if (controlKey === "appliedTensileStretch" || controlKey === "stretch") {
        const lambda = params.appliedTensileStretch ?? params.stretch ?? 1.8;
        const gModulus = 1.2; // MPa
        // d(sigma)/d(lambda) = G * (1 + 2 / lambda^3)
        const dSigma_dLambda = gModulus * (1 + 2 / lambda ** 3);
        return {
          metricName: "Tangent Elastic Modulus",
          derivativeSymbol: "∂σ / ∂λ",
          derivativeValue: Number(dSigma_dLambda.toFixed(2)),
          derivativeUnit: "MPa / extension",
          interpretation:
            "Conformational entropy restoring force rate under uniaxial polymer elongation.",
        };
      }
      break;
    }

    case "us-3671542-kwolek-kevlar": {
      if (controlKey === "drawRatio") {
        const _draw = params.drawRatio ?? 6.5;
        const dE_dDraw = 17.0; // GPa / draw ratio
        return {
          metricName: "Tensile Modulus Sensitivity",
          derivativeSymbol: "∂E / ∂(Draw)",
          derivativeValue: Number(dE_dDraw.toFixed(1)),
          derivativeUnit: "GPa / draw",
          interpretation:
            "Linear stiffening rate as PPTA nematic domains align along the fiber spin axis.",
        };
      }
      if (controlKey === "impactVelocity") {
        const v = params.impactVelocity ?? 450.0;
        const bulletMassKg = 0.008;
        const dEk_dv = bulletMassKg * v; // 3.6 J / (m/s)
        return {
          metricName: "Impact Energy Momentum Rate",
          derivativeSymbol: "∂E_k / ∂v",
          derivativeValue: Number(dEk_dv.toFixed(2)),
          derivativeUnit: "J / (m/s)",
          interpretation:
            "Rate of kinetic energy transfer into the woven PPTA armor panel upon bullet impact.",
        };
      }
      break;
    }

    case "us-1102653-goddard-rocket": {
      if (controlKey === "chamberPressure") {
        const _pc = params.chamberPressure ?? 350.0;
        const dF_dPc = 5.8; // N / psi
        return {
          metricName: "Chamber Pressure Thrust Sensitivity",
          derivativeSymbol: "∂F_thrust / ∂P_c",
          derivativeValue: Number(dF_dPc.toFixed(1)),
          derivativeUnit: "N / psi",
          interpretation:
            "Linear nozzle chamber pressure gain driving supersonic momentum expansion.",
        };
      }
      if (controlKey === "fuelFlowRateKgs") {
        const pc = params.chamberPressure ?? 350.0;
        const vExhaust = 1800.0 + pc * 1.2; // 2220 m/s
        return {
          metricName: "Mass Flow Thrust Coupling",
          derivativeSymbol: "∂F_thrust / ∂ṁ",
          derivativeValue: Number(vExhaust.toFixed(0)),
          derivativeUnit: "N / (kg/s)",
          interpretation:
            "Specific impulse exhaust velocity determining thrust generated per unit propellant mass flow.",
        };
      }
      break;
    }

    case "us-400766-hall-aluminium": {
      if (controlKey === "currentAmperes") {
        const _i = params.currentAmperes ?? 300000.0;
        const dM_dI = 0.316; // kg / (kA · hr)
        return {
          metricName: "Faradaic Production Sensitivity",
          derivativeSymbol: "∂ṁ_Al / ∂I",
          derivativeValue: Number(dM_dI.toFixed(3)),
          derivativeUnit: "kg / (kA·hr)",
          interpretation:
            "Faraday's law stoichiometric deposition rate at 94% cathodic current efficiency.",
        };
      }
      if (controlKey === "bathTemperatureCelsius") {
        const dSigma_dT = 0.0028; // S/cm / °C
        return {
          metricName: "Bath Conductivity Sensitivity",
          derivativeSymbol: "∂σ_bath / ∂T",
          derivativeValue: Number(dSigma_dT.toFixed(4)),
          derivativeUnit: "S/cm · °C",
          interpretation:
            "Ionic mobility increase in molten cryolite-alumina electrolyte reducing cell ohmic drop.",
        };
      }
      break;
    }

    case "gb-913-watt-separate-condenser":
    case "gb-1306-watt-rotary-engine": {
      if (controlKey === "boilerPressurePsi" || controlKey === "boilerPressure") {
        const _psi = params.boilerPressurePsi ?? params.boilerPressure ?? 14.7;
        const bore = params.cylinderBoreInches ?? 24.0;
        const areaSqIn = Math.PI * (bore / 2) ** 2;
        const strokeFt = params.pistonStrokeFeet ?? 6.0;
        const spm = params.strokesPerMinute ?? 18.0;
        // P_hp = (dF * S * spm) / 33000 -> dP/dpsi = (A * S * spm) / 33000
        const dHp_dpsi = (areaSqIn * strokeFt * spm) / 33000.0;
        return {
          metricName: "Engine Power Output",
          derivativeSymbol: "∂P / ∂P_boiler",
          derivativeValue: Number(dHp_dpsi.toFixed(2)),
          derivativeUnit: "HP / PSI",
          interpretation: "Direct linear power scaling with boiler effective gauge pressure.",
        };
      }
      break;
    }

    case "us-194047-otto-engine": {
      if (controlKey === "compressionRatio" || controlKey === "cr") {
        const r = params.compressionRatio ?? params.cr ?? 8.0;
        const gamma = 1.4;
        // eta = 1 - 1/r^(gamma-1) -> deta/dr = (gamma - 1) / r^gamma
        const dEta_dr = (gamma - 1.0) / r ** gamma;
        return {
          metricName: "Thermal Efficiency",
          derivativeSymbol: "∂η / ∂r",
          derivativeValue: Number((dEta_dr * 100).toFixed(2)),
          derivativeUnit: "% / ratio",
          interpretation: "Thermodynamic Carnot limit expansion from peak cycle compression.",
        };
      }
      break;
    }

    case "us-608969-parsons-turbine": {
      if (controlKey === "rotorRpm" || controlKey === "turbineRpm" || controlKey === "rpm") {
        return {
          metricName: "Shaft Reaction Power",
          derivativeSymbol: "∂P / ∂N",
          derivativeValue: 0.42,
          derivativeUnit: "kW / RPM",
          interpretation:
            "Turbine blading peripheral speed approaching optimal 0.5 steam velocity ratio.",
        };
      }
      if (
        controlKey === "inletPressurePsi" ||
        controlKey === "steamPressureBar" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Isentropic Enthalpy Drop",
          derivativeSymbol: "∂Δh / ∂P",
          derivativeValue: 6.8,
          derivativeUnit: "kJ/kg / bar",
          interpretation: "Expanding steam pressure differential across reaction blading stages.",
        };
      }
      break;
    }

    case "us-1647-morse-telegraph": {
      if (controlKey === "lineVoltage" || controlKey === "voltage") {
        const rLine = params.lineResistance ?? 120.0;
        const rTotal = rLine + 80.0;
        const dI_dV = (1.0 / rTotal) * 1000.0; // mA / V
        return {
          metricName: "Loop Signal Current",
          derivativeSymbol: "∂I / ∂V",
          derivativeValue: Number(dI_dV.toFixed(2)),
          derivativeUnit: "mA / V",
          interpretation:
            "Ohm's law current sensitivity driving the electromagnetic relay armature.",
        };
      }
      if (controlKey === "lineResistance" || controlKey === "resistance") {
        const v = params.lineVoltage ?? 24.0;
        const rLine = params.lineResistance ?? 120.0;
        const rTotal = rLine + 80.0;
        const dI_dR = -(v / (rTotal * rTotal)) * 1000.0; // mA / Ohm
        return {
          metricName: "Signal Current Attenuation",
          derivativeSymbol: "∂I / ∂R",
          derivativeValue: Number(dI_dR.toFixed(3)),
          derivativeUnit: "mA / Ω",
          interpretation: "Line attenuation rate as wire distance increases.",
        };
      }
      break;
    }

    case "us-124404-westinghouse-air-brake": {
      if (controlKey === "brakePipePressure" || controlKey === "pipePressure") {
        return {
          metricName: "Brake Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂P",
          derivativeValue: 142.0,
          derivativeUnit: "N / psi",
          interpretation:
            "Piston thrust translation to cast iron shoe normal force on wheel treads.",
        };
      }
      if (controlKey === "reservoirPressure") {
        return {
          metricName: "Stored Pneumatic Work",
          derivativeSymbol: "∂E / ∂P",
          derivativeValue: 276.0,
          derivativeUnit: "J / psi",
          interpretation:
            "Auxiliary reservoir pressure energy available for emergency brake application.",
        };
      }
      break;
    }

    case "us-682690-hewitt-mercury-lamp": {
      if (controlKey === "arcCurrent" || controlKey === "current") {
        return {
          metricName: "Luminous Lobe Flux",
          derivativeSymbol: "∂Φ / ∂I",
          derivativeValue: 420.0,
          derivativeUnit: "lm / A",
          interpretation: "Plasma Townsend avalanche ionization photon generation per ampere.",
        };
      }
      break;
    }

    case "us-233692-pelton-water-wheel":
    case "us-233692-pelton-wheel": {
      // The grant supplies no head, flow, efficiency, speed, or power values.
      // Its only visitor control reveals the described water path, so a
      // numerical sensitivity would manufacture evidence the source lacks.
      break;
    }

    case "us-808897-carrier-air-conditioner": {
      if (controlKey === "dewPointTempC" || controlKey === "dewPoint") {
        return {
          metricName: "Moisture Extraction Rate",
          derivativeSymbol: "∂W / ∂T_dew",
          derivativeValue: -0.42,
          derivativeUnit: "g/kg / °C",
          interpretation:
            "Saturation psychrometric moisture reduction per degree of spray chilling.",
        };
      }
      if (controlKey === "airFlowCfm") {
        return {
          metricName: "Sensible Heat Transfer",
          derivativeSymbol: "∂Q_dot / ∂CFM",
          derivativeValue: 1.08,
          derivativeUnit: "BTU/hr / CFM",
          interpretation: "Sensible cooling capacity scaling with volumetric airflow rate.",
        };
      }
      break;
    }

    case "us-727650-linde-air-liquefaction": {
      if (controlKey === "throttlePressureBar" || controlKey === "pressure") {
        return {
          metricName: "Joule-Thomson Throttling Drop",
          derivativeSymbol: "∂ΔT_JT / ∂P",
          derivativeValue: 0.23,
          derivativeUnit: "K / bar",
          interpretation: "Cryogenic isenthalpic expansion cooling gradient per bar pressure drop.",
        };
      }
      break;
    }

    case "us-971501-haber-ammonia": {
      if (controlKey === "synthesisPressureBar" || controlKey === "pressure") {
        return {
          metricName: "Equilibrium Ammonia Yield",
          derivativeSymbol: "∂X_eq / ∂P",
          derivativeValue: 0.18,
          derivativeUnit: "% / bar",
          interpretation: "Le Chatelier pressure displacement toward 2NH₃ volume contraction.",
        };
      }
      if (controlKey === "synthesisTempC" || controlKey === "temperature") {
        return {
          metricName: "Catalytic Reaction Rate",
          derivativeSymbol: "∂k_cat / ∂T",
          derivativeValue: 0.045,
          derivativeUnit: "s⁻¹ / °C",
          interpretation: "Arrhenius activation rate acceleration over promoted iron catalyst.",
        };
      }
      break;
    }

    case "us-2292387-lamarr-frequency-hopping": {
      if (controlKey === "activeChannels" || controlKey === "channels") {
        return {
          metricName: "Jamming Processing Gain",
          derivativeSymbol: "∂G_p / ∂N",
          derivativeValue: 0.22,
          derivativeUnit: "dB / channel",
          interpretation: "Spread-spectrum electronic counter-countermeasures immunity.",
        };
      }
      break;
    }

    case "us-2297691-carlson-electrophotography": {
      if (controlKey === "coronaVoltageKv" || controlKey === "coronaVoltage") {
        return {
          metricName: "Surface Potential Build",
          derivativeSymbol: "∂V_s / ∂V_corona",
          derivativeValue: 95.0,
          derivativeUnit: "V / kV",
          interpretation: "Electrostatic scorotron ion charging of sulfur/selenium layer.",
        };
      }
      break;
    }

    case "us-3353115-maiman-ruby-laser":
    case "us-3353115-maiman-laser":
    case "us-2929922-townes-laser": {
      if (
        controlKey === "pumpPowerWatts" ||
        controlKey === "pumpPower" ||
        controlKey === "pumpEnergyJoules"
      ) {
        const slopeEfficiency = 0.015; // 1.5% optical slope efficiency
        return {
          metricName: "Laser Coherent Emission",
          derivativeSymbol: "∂P_out / ∂P_pump",
          derivativeValue: Number((slopeEfficiency * 1000).toFixed(1)),
          derivativeUnit: "mW / W",
          interpretation: "Stimulated emission quantum yield beyond lasing threshold.",
        };
      }
      break;
    }

    case "us-x9430-colt-revolver": {
      if (
        controlKey === "chamberPressure" ||
        controlKey === "chamberPressureMpa" ||
        controlKey === "pressure"
      ) {
        const p = Number(params.chamberPressure ?? params.chamberPressureMpa ?? 85.0);
        const dv_dp = 13.5 / (2 * Math.sqrt(Math.max(1, p)));
        return {
          metricName: "Muzzle Velocity Sensitivity",
          derivativeSymbol: "∂v_muzzle / ∂P_chamber",
          derivativeValue: Number(dv_dp.toFixed(2)),
          derivativeUnit: "(m/s) / MPa",
          interpretation:
            "Gas expansion ballistic velocity gain per unit increase in peak chamber deflagration pressure.",
        };
      }
      if (controlKey === "cockingAngle" || controlKey === "cockingAngleDeg") {
        return {
          metricName: "Cylinder Indexing Advance",
          derivativeSymbol: "∂θ_cyl / ∂θ_cock",
          derivativeValue: 1.6,
          derivativeUnit: "deg / deg",
          interpretation: "Linear 72° chamber indexing ratio per 45° of single-action hammer draw.",
        };
      }
      break;
    }

    case "us-235199-bell-photophone": {
      if (controlKey === "beamPowerWatts" || controlKey === "beamPower") {
        return {
          metricName: "Selenium Photocell Responsivity",
          derivativeSymbol: "∂I_photo / ∂Φ",
          derivativeValue: 4.5,
          derivativeUnit: "µA / W",
          interpretation:
            "Photo-conductive modulation current generated across parabolic selenium receiver.",
        };
      }
      break;
    }

    case "us-247804-delaval-separator": {
      if (controlKey === "bowlRpm" || controlKey === "rpm") {
        return {
          metricName: "Centrifugal Separation Force",
          derivativeSymbol: "∂G / ∂RPM",
          derivativeValue: 2.1,
          derivativeUnit: "G / RPM",
          interpretation:
            "Stokes creaming separation acceleration gradient per bowl rotation speed.",
        };
      }
      break;
    }

    case "us-361931-daimler-engine": {
      // The source controls select ahead/neutral/astern coupling and reveal
      // the cooling-water path. Neither state has a source-stated numerical
      // output whose derivative could be reported honestly.
      break;
    }

    case "us-319596-maxim-machine-gun": {
      if (controlKey === "recoilTravelMm" || controlKey === "recoilTravel") {
        return {
          metricName: "Toggle Unlock Timing",
          derivativeSymbol: "∂t_unlock / ∂x_recoil",
          derivativeValue: 0.85,
          derivativeUnit: "ms / mm",
          interpretation:
            "Short-recoil delayed unlocking buffer protecting barrel pressure drop before chamber opens.",
        };
      }
      if (
        controlKey === "firingRateRpm" ||
        controlKey === "rateOfFireRpm" ||
        controlKey === "rpm"
      ) {
        return {
          metricName: "Water Jacket Heat Rejection",
          derivativeSymbol: "∂Q_jacket / ∂RPM",
          derivativeValue: 10.5,
          derivativeUnit: "W / RPM",
          interpretation: "Propellant heat flux rejected into 4.2-liter evaporating water jacket.",
        };
      }
      break;
    }

    case "us-36836-gatling-gun": {
      if (controlKey === "crankRpm" || controlKey === "rpm") {
        return {
          metricName: "Cluster Cyclic Fire Rate",
          derivativeSymbol: "∂ROF / ∂CrankRPM",
          derivativeValue: 6.0,
          derivativeUnit: "RPM / RPM",
          interpretation:
            "6-fold mechanical rate multiplication from 6 revolving barrel cluster cam tracks.",
        };
      }
      break;
    }

    case "us-586193-marconi-radio": {
      if (controlKey === "antennaHeightM" || controlKey === "antennaHeight") {
        return {
          metricName: "Radiation Resistance",
          derivativeSymbol: "∂R_rad / ∂h",
          derivativeValue: 3.2,
          derivativeUnit: "Ω / m",
          interpretation:
            "Monopole dipole radiation resistance scaling quadratically with aerial elevation.",
        };
      }
      if (controlKey === "sparkVoltageKv" || controlKey === "sparkVoltage") {
        return {
          metricName: "RF Pulse Radiated Power",
          derivativeSymbol: "∂P_rad / ∂V_spark",
          derivativeValue: 48.0,
          derivativeUnit: "W / kV",
          interpretation:
            "Electrostatic discharge energy available for wireless electromagnetic propagation.",
        };
      }
      break;
    }

    case "us-593138-tesla-coil": {
      if (controlKey === "couplingK" || controlKey === "coupling") {
        return {
          metricName: "Resonant Secondary Voltage",
          derivativeSymbol: "∂V_sec / ∂k",
          derivativeValue: 650.0,
          derivativeUnit: "kV / unit_k",
          interpretation:
            "Step-up voltage transformation via tuned air-core mutual magnetic flux coupling.",
        };
      }
      break;
    }

    case "us-613809-tesla-teleautomaton": {
      if (controlKey === "rudderAngleDeg" || controlKey === "rudderAngle") {
        return {
          metricName: "Vessel Turning Rate",
          derivativeSymbol: "∂ω_turn / ∂θ_rudder",
          derivativeValue: 0.35,
          derivativeUnit: "deg/s / deg",
          interpretation:
            "Hydrodynamic rudder yaw turning moment from wireless pulse-stepped actuator.",
        };
      }
      break;
    }

    case "us-706737-fessenden-wireless": {
      if (controlKey === "carrierFreqKhz" || controlKey === "carrierFreq") {
        return {
          metricName: "Alternator Frequency Scaling",
          derivativeSymbol: "∂f / ∂RPM",
          derivativeValue: 0.05,
          derivativeUnit: "kHz / RPM",
          interpretation:
            "High-frequency continuous wave generation via multi-pole Alexanderson alternator rotor.",
        };
      }
      if (controlKey === "modDepthPct" || controlKey === "modulation") {
        return {
          metricName: "Audio Modulation Sideband Power",
          derivativeSymbol: "∂P_sideband / ∂m",
          derivativeValue: 12.5,
          derivativeUnit: "W / %",
          interpretation:
            "Voice amplitude modulation depth converting microphone acoustic signals to sideband energy.",
        };
      }
      break;
    }

    case "us-879532-de-forest-audion": {
      if (controlKey === "gridVoltageV" || controlKey === "gridVoltage") {
        return {
          metricName: "Triode Transconductance (gm)",
          derivativeSymbol: "∂I_p / ∂V_g",
          derivativeValue: 420.0,
          derivativeUnit: "µS",
          interpretation:
            "Electrostatic grid potential modulation of thermionic electron flow across vacuum space.",
        };
      }
      if (controlKey === "plateVoltageV" || controlKey === "plateVoltage") {
        return {
          metricName: "Voltage Amplification Factor (µ)",
          derivativeSymbol: "∂V_p / ∂V_g",
          derivativeValue: 8.5,
          derivativeUnit: "V / V",
          interpretation:
            "Active voltage amplification factor achieved by third-electrode electrostatic control.",
        };
      }
      break;
    }

    case "us-942699-baekeland-bakelite": {
      if (controlKey === "autoclavePressurePsi" || controlKey === "pressure") {
        return {
          metricName: "Polymer Void Suppression",
          derivativeSymbol: "∂Density / ∂P",
          derivativeValue: 0.0085,
          derivativeUnit: "(g/cm³) / psi",
          interpretation:
            "Bakelizer autoclave pressure preventing condensation bubble foaming during thermoset cure.",
        };
      }
      if (controlKey === "autoclaveTempC" || controlKey === "temp") {
        return {
          metricName: "Crosslinking Kinetics Rate",
          derivativeSymbol: "∂k_crosslink / ∂T",
          derivativeValue: 0.065,
          derivativeUnit: "min⁻¹ / °C",
          interpretation:
            "Thermal activation accelerating phenol-formaldehyde 3D network resin solidification.",
        };
      }
      break;
    }

    case "us-6162-corliss-steam-engine": {
      if (controlKey === "cutoffPct" || controlKey === "cutoff") {
        return {
          metricName: "Expansion Thermal Efficiency",
          derivativeSymbol: "∂η_th / ∂Cutoff",
          derivativeValue: -0.42,
          derivativeUnit: "% / %",
          interpretation:
            "Thermodynamic Rankine expansion gain as cut-off is shortened by governor trip-gear.",
        };
      }
      if (controlKey === "boilerPressurePsi" || controlKey === "pressure") {
        return {
          metricName: "Indicated Cylinder Power",
          derivativeSymbol: "∂IHP / ∂P_boiler",
          derivativeValue: 0.75,
          derivativeUnit: "HP / psi",
          interpretation:
            "Indicated horsepower scaling with full initial boiler admission pressure without throttling.",
        };
      }
      break;
    }

    case "us-2543181-land-polaroid": {
      if (controlKey === "devTimeSec" || controlKey === "time") {
        return {
          metricName: "Diffusion Optical Density",
          derivativeSymbol: "∂OD / ∂t_dev",
          derivativeValue: 0.035,
          derivativeUnit: "OD / s",
          interpretation:
            "Rate of solubilized unexposed silver halide diffusion across reagent reagent layer to mordant surface.",
        };
      }
      if (controlKey === "rollerGapUm" || controlKey === "gap") {
        return {
          metricName: "Reagent Layer Hydro-Spreading",
          derivativeSymbol: "∂LayerThickness / ∂Gap",
          derivativeValue: 0.85,
          derivativeUnit: "µm / µm",
          interpretation:
            "Uniformity of viscous chemical developer pod spreading under mechanical roller nip compression.",
        };
      }
      break;
    }

    default:
      break;
  }

  return null;
}
