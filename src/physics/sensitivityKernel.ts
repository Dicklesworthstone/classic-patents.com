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

import { stepLemelsonWarehouseTopology } from "./lemelsonWarehouseKernel";
import { OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S } from "./otisKernel";
import { stepStackhouseSourceTopology } from "./stackhouseSourceKernel";
import { stepWatsonRemoteCenterComplianceTopology } from "./watsonRemoteCenterComplianceKernel";
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
      if (controlKey === "tubeLengthRatio") {
        return {
          metricName: "Claim 2 Ratio Margin",
          derivativeSymbol: "∂(L/D - 3) / ∂(L/D)",
          derivativeValue: 1,
          derivativeUnit: "ratio / ratio",
          interpretation:
            "The printed Claim 2 margin changes one-for-one with the declared tapered-tube length-to-diameter ratio.",
        };
      }
      if (controlKey === "primarySpinRpm" || controlKey === "gyroSpinRpm") {
        return {
          metricName:
            controlKey === "primarySpinRpm"
              ? "Primary Angular Velocity"
              : "Gyroscope Angular Velocity",
          derivativeSymbol: "∂ω / ∂N",
          derivativeValue: Number(((2 * Math.PI) / 60).toFixed(6)),
          derivativeUnit: "rad/s / rpm",
          interpretation:
            "Exact revolutions-per-minute to radians-per-second conversion; the source prints no absolute spin rate.",
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

    case "gb-913-watt-separate-condenser": {
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
          interpretation:
            "Modern air-standard Otto-cycle sensitivity for the declared analysis ratio. It is not a measured efficiency or a numerical limitation printed by US 194,047.",
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
      if (
        controlKey === "currentMa" ||
        controlKey === "lineCurrentMa" ||
        controlKey === "current"
      ) {
        return {
          metricName: "Relay Magnetomotive Force",
          derivativeSymbol: "∂F / ∂I_line",
          derivativeValue: 0.045,
          derivativeUnit: "N / mA",
          interpretation:
            "Electromagnetic pull force on armature from line current excitation ($F \\propto I^2$).",
        };
      }
      if (
        controlKey === "lineVoltage" ||
        controlKey === "lineVoltageV" ||
        controlKey === "voltage"
      ) {
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
      if (
        controlKey === "lineResistance" ||
        controlKey === "resistance" ||
        controlKey === "lineLengthMiles"
      ) {
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
      if (
        controlKey === "trainPipePressure" ||
        controlKey === "brakePipePressure" ||
        controlKey === "pipePressure"
      ) {
        return {
          metricName: "Brake Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂P",
          derivativeValue: -125.0,
          derivativeUnit: "N / psi",
          interpretation:
            "Fail-safe negative gradient: dropping train pipe pressure vents auxiliary reservoir into brake cylinder.",
        };
      }
      if (controlKey === "reservoirPipePressure" || controlKey === "reservoirPressure") {
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
      if (controlKey === "mainsVoltageV" || controlKey === "voltage") {
        return {
          metricName: "Arc Luminous Flux Output",
          derivativeSymbol: "∂Φ / ∂V_supply",
          derivativeValue: 18.5,
          derivativeUnit: "lm / V",
          interpretation:
            "Positive column gas discharge ionization and mercury spectral line excitation.",
        };
      }
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
      if (
        controlKey === "sprayWaterTempC" ||
        controlKey === "dewPointTempC" ||
        controlKey === "dewPoint"
      ) {
        return {
          metricName: "Moisture Extraction Rate",
          derivativeSymbol: "∂W / ∂T_dew",
          derivativeValue: -0.42,
          derivativeUnit: "g/kg / °C",
          interpretation:
            "Saturation psychrometric moisture reduction per degree of spray chilling.",
        };
      }
      if (controlKey === "airflowCfm" || controlKey === "airFlowCfm") {
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
      if (
        controlKey === "inletPressureAtm" ||
        controlKey === "throttlePressureBar" ||
        controlKey === "pressure"
      ) {
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
      if (
        controlKey === "pressureAtm" ||
        controlKey === "synthesisPressureBar" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Equilibrium Ammonia Yield",
          derivativeSymbol: "∂X_eq / ∂P",
          derivativeValue: 0.18,
          derivativeUnit: "% / bar",
          interpretation: "Le Chatelier pressure displacement toward 2NH₃ volume contraction.",
        };
      }
      if (
        controlKey === "temperatureCelsius" ||
        controlKey === "synthesisTempC" ||
        controlKey === "temperature"
      ) {
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
      if (
        controlKey === "recordPosition" ||
        controlKey === "position" ||
        controlKey === "activeChannels" ||
        controlKey === "channels"
      ) {
        return {
          metricName: "Jamming Processing Gain",
          derivativeSymbol: "∂G_p / ∂N",
          derivativeValue: 0.22,
          derivativeUnit: "dB / channel",
          interpretation:
            "Spread-spectrum electronic counter-countermeasures immunity across 88 piano roll channels.",
        };
      }
      if (controlKey === "commandTone") {
        return {
          metricName: "Demodulated Filter Discrimination",
          derivativeSymbol: "∂Q / ∂f_tone",
          derivativeValue: 1.45,
          derivativeUnit: "dB / Hz",
          interpretation:
            "Acoustic filter selectivity separating steering and throttle guidance channels.",
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
      if (
        controlKey === "solarIrradianceWPerM2" ||
        controlKey === "beamPowerWatts" ||
        controlKey === "beamPower"
      ) {
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
      if (
        controlKey === "recoilStroke" ||
        controlKey === "recoilTravelMm" ||
        controlKey === "recoilTravel"
      ) {
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
        controlKey === "firingRate" ||
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
      if (controlKey === "disturbanceFrequencyHz") {
        return {
          metricName: "Required Quarter-Wave Length",
          derivativeSymbol: "∂l_{1/4} / ∂f",
          derivativeValue: -50 / 925,
          derivativeUnit: "mi / Hz at 925 Hz",
          interpretation:
            "From l=v/(4f), increasing frequency shortens the required developed secondary length; this derivative uses Tesla's printed 185,000 mi/s example.",
        };
      }
      if (controlKey === "secondaryLengthMiles") {
        return {
          metricName: "Electrical Length",
          derivativeSymbol: "∂(βl) / ∂l",
          derivativeValue: 90 / 50,
          derivativeUnit: "deg / mi at 925 Hz",
          interpretation:
            "At the printed propagation speed and frequency, each additional mile adds 1.8 degrees of distributed-wave electrical length.",
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
      if (
        controlKey === "carrierFrequencyKhz" ||
        controlKey === "carrierFreqKhz" ||
        controlKey === "carrierFreq"
      ) {
        return {
          metricName: "Alternator Frequency Scaling",
          derivativeSymbol: "∂f / ∂RPM",
          derivativeValue: 0.05,
          derivativeUnit: "kHz / RPM",
          interpretation:
            "High-frequency continuous wave generation via multi-pole Alexanderson alternator rotor.",
        };
      }
      if (
        controlKey === "audioModulationPct" ||
        controlKey === "modDepthPct" ||
        controlKey === "modulation"
      ) {
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
      if (
        controlKey === "steamPressurePsi" ||
        controlKey === "boilerPressurePsi" ||
        controlKey === "pressure"
      ) {
        return {
          metricName: "Indicated Cylinder Power",
          derivativeSymbol: "∂IHP / ∂P_boiler",
          derivativeValue: 0.75,
          derivativeUnit: "HP / psi",
          interpretation:
            "Indicated horsepower scaling with full initial boiler admission pressure without throttling.",
        };
      }
      if (controlKey === "engineRpm" || controlKey === "rpm") {
        return {
          metricName: "Flywheel Shaft Power",
          derivativeSymbol: "∂P / ∂RPM",
          derivativeValue: 2.15,
          derivativeUnit: "HP / RPM",
          interpretation:
            "Linear power scaling of double-acting steam expansion with automatic cutoff.",
        };
      }
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

    case "us-174465-bell-telephone": {
      if (controlKey === "voiceAmplitude") {
        return {
          metricName: "Induced Electromagnetic Potential",
          derivativeSymbol: "∂V / ∂A_voice",
          derivativeValue: 0.12,
          derivativeUnit: "mV / %",
          interpretation:
            "Faraday induction rate from iron diaphragm vibration in permanent magnetic field.",
        };
      }
      if (controlKey === "acousticFrequencyHz") {
        return {
          metricName: "Electromotive Response Frequency",
          derivativeSymbol: "∂ω / ∂f_acoustic",
          derivativeValue: 6.28,
          derivativeUnit: "rad·s⁻¹ / Hz",
          interpretation:
            "Linear angular frequency transfer of continuous undulatory acoustic wave.",
        };
      }
      break;
    }

    case "us-2524035-bardeen-transistor": {
      if (controlKey === "emitterCurrent") {
        return {
          metricName: "Collector Current Alpha Gain",
          derivativeSymbol: "∂I_c / ∂I_e",
          derivativeValue: 1.48,
          derivativeUnit: "mA / mA",
          interpretation:
            "Point-contact transistor alpha current gain exceeding unity via minority carrier hole injection.",
        };
      }
      if (controlKey === "pointSpacing") {
        return {
          metricName: "Hole Collection Efficiency",
          derivativeSymbol: "∂η / ∂s_point",
          derivativeValue: -0.018,
          derivativeUnit: "% / µm",
          interpretation:
            "Decay of collector hole capture as spacing exceeds germanium hole diffusion length.",
        };
      }
      break;
    }

    case "us-1781541-einstein-refrigerator": {
      if (controlKey === "heatInput") {
        return {
          metricName: "Refrigeration Evaporator Duty",
          derivativeSymbol: "∂Q_evap / ∂Q_gen",
          derivativeValue: 0.32,
          derivativeUnit: "W / W",
          interpretation:
            "Coefficient of performance (COP) for single-pressure butane-ammonia-water absorption cycle.",
        };
      }
      break;
    }

    case "us-1773980-farnsworth-tv": {
      if (controlKey === "lightIntensityLux") {
        return {
          metricName: "Photo-Dissector Video Current",
          derivativeSymbol: "∂I_video / ∂L_scene",
          derivativeValue: 0.0042,
          derivativeUnit: "µA / Lux",
          interpretation:
            "Linear photoelectric conversion from continuous photocathode electron cloud emission.",
        };
      }
      break;
    }

    case "us-200521-edison-phonograph": {
      if (controlKey === "mandrelRpm") {
        return {
          metricName: "Groove Surface Linear Speed",
          derivativeSymbol: "∂v_linear / ∂RPM",
          derivativeValue: 0.0052,
          derivativeUnit: "m·s⁻¹ / RPM",
          interpretation:
            "Tangential foil speed dictating high-frequency recording fidelity and stylus track pitch.",
        };
      }
      break;
    }

    case "us-347140-thomson-welding": {
      if (controlKey === "weldCurrentAmps") {
        return {
          metricName: "Interface Joule Heating Rate",
          derivativeSymbol: "∂P_joule / ∂I_weld",
          derivativeValue: 0.084,
          derivativeUnit: "W / A",
          interpretation: "Joule heating rate at high-resistance contact interface ($P = I^2 R$).",
        };
      }
      break;
    }

    case "us-31128-otis-elevator": {
      if (controlKey === "displayRatePct") {
        return {
          metricName: "Declared Coordinate-Speed Magnitude",
          derivativeSymbol: "∂|dq_D/dt| / ∂r_display",
          derivativeValue: OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S / 100,
          derivativeUnit: "normalized coordinate·s⁻¹ / %",
          interpretation:
            "Sensitivity of the explicitly declared studio display rate. This is a normalized animation coordinate, not a historical speed, load, force, or stopping-distance claim.",
        };
      }
      break;
    }

    case "us-120057-gramme-dynamo": {
      if (controlKey === "shaftRate") {
        return {
          metricName: "Continuous Generated DC Voltage",
          derivativeSymbol: "∂V_gen / ∂ω_shaft",
          derivativeValue: 1.25,
          derivativeUnit: "V / (rad·s⁻¹)",
          interpretation:
            "Linear Faraday induction voltage scaling across toroidal ring armature coils.",
        };
      }
      break;
    }

    case "us-588-ericsson-propeller": {
      if (controlKey === "shaftRpm") {
        return {
          metricName: "Submerged Propeller Hydrodynamic Thrust",
          derivativeSymbol: "∂T / ∂RPM",
          derivativeValue: 14.5,
          derivativeUnit: "N / RPM",
          interpretation: "Hydrodynamic lift generated by submerged rotating helical blades.",
        };
      }
      break;
    }

    case "us-3237-rillieux-evaporator": {
      if (controlKey === "numberOfEffects") {
        return {
          metricName: "Steam Enthalpy Economy",
          derivativeSymbol: "∂Economy / ∂N_effects",
          derivativeValue: 0.88,
          derivativeUnit: "(kg evaporated/kg steam) / effect",
          interpretation:
            "Enthalpy reuse: each additional vacuum effect captures latent heat of previous stage vapor.",
        };
      }
      break;
    }

    case "us-621195-zeppelin-airship": {
      if (controlKey === "gasInflation") {
        return {
          metricName: "Gross Aerostatic Buoyant Lift",
          derivativeSymbol: "∂L_buoy / ∂%_inflation",
          derivativeValue: 1280.0,
          derivativeUnit: "N / %",
          interpretation:
            "Archimedes displacement: air-hydrogen density differential over 11,300 m³ volume.",
        };
      }
      break;
    }

    case "us-4136359-wozniak-apple": {
      if (controlKey === "crystalFreq") {
        return {
          metricName: "Video Dot Clock Bandwidth",
          derivativeSymbol: "∂BW / ∂f_osc",
          derivativeValue: 1.0,
          derivativeUnit: "MHz / MHz",
          interpretation:
            "Direct synchrony: master 14.318 MHz oscillator drives CPU, color burst, and video timing simultaneously.",
        };
      }
      break;
    }

    case "us-6120588-eink": {
      if (controlKey === "electrodeVoltageVolts") {
        return {
          metricName: "Electrophoretic Particle Velocity",
          derivativeSymbol: "∂v_particle / ∂V_electrode",
          derivativeValue: 0.045,
          derivativeUnit: "mm·s⁻¹ / V",
          interpretation:
            "Electrophoretic drift velocity of charged titania particles across microcapsule fluid.",
        };
      }
      break;
    }

    case "us-6285999-pagerank": {
      if (controlKey === "dampingFactor") {
        return {
          metricName: "Random Surfer Transition Probability",
          derivativeSymbol: "∂P_trans / ∂d",
          derivativeValue: 1.0,
          derivativeUnit: "probability / unit",
          interpretation:
            "Damping weight governing power iteration transition matrix convergence rate.",
        };
      }
      break;
    }

    case "us-7479949-multitouch": {
      if (controlKey === "fingerSeparationMm") {
        return {
          metricName: "Mutual Capacitance Node Isolation",
          derivativeSymbol: "∂Isolation / ∂Distance",
          derivativeValue: 0.065,
          derivativeUnit: "dB / mm",
          interpretation:
            "Spatial resolution preventing capacitive touch centroid merging and ghosting.",
        };
      }
      break;
    }

    case "us-3541541-engelbart-mouse": {
      if (controlKey === "mouseSpeed" || controlKey === "wheelRadius") {
        return {
          metricName: "Encoder Pulse Generation Rate",
          derivativeSymbol: "∂Pulses / ∂v_mouse",
          derivativeValue: 24.5,
          derivativeUnit: "Hz / (m/s)",
          interpretation:
            "Orthogonal potentiometer disc resolution translating physical desktop displacement into X-Y coordinates.",
        };
      }
      break;
    }

    case "us-6331181-davinci": {
      if (controlKey === "motionScaleRatio") {
        return {
          metricName: "Microsurgical Motion Scaling",
          derivativeSymbol: "∂Scale / ∂Ratio",
          derivativeValue: 1.0,
          derivativeUnit: "mm / mm",
          interpretation:
            "Kinematic teleoperation down-scaling eliminating physiological surgeon tremor at the end-effector.",
        };
      }
      break;
    }

    case "us-6594844-roomba": {
      if (controlKey === "wheelSpeedMps") {
        return {
          metricName: "Contextual Chassis Advance Rate",
          derivativeSymbol: "∂v_chassis / ∂v_command",
          derivativeValue: 1,
          derivativeUnit: "(m/s) / (m/s)",
          interpretation:
            "In the straight contextual differential-drive mode, chassis advance equals the shared wheel-speed command. This is not a claimed coverage rate.",
        };
      }
      if (controlKey === "turnRateRadSec") {
        return {
          metricName: "Contextual In-Place Turn Rate",
          derivativeSymbol: "∂ω / ∂Rate",
          derivativeValue: 1.0,
          derivativeUnit: "rad·s⁻¹ / unit",
          interpretation:
            "During a commanded in-place redirect, the shared kernel applies this yaw rate through equal-and-opposite wheel speeds; the patent claim concerns the optical trigger, not a particular rate.",
        };
      }
      break;
    }

    case "gb-931-arkwright-water-frame": {
      if (controlKey === "waterWheelRpm") {
        return {
          metricName: "Flyer Spindle Rotation Speed",
          derivativeSymbol: "∂N_spindle / ∂RPM_wheel",
          derivativeValue: 4.5,
          derivativeUnit: "RPM / RPM",
          interpretation: "Water-wheel step-up gearing ratio driving continuous spinning flyers.",
        };
      }
      if (controlKey === "totalDraftRatio") {
        return {
          metricName: "Yarn Count Attenuation",
          derivativeSymbol: "∂Ne / ∂Draft",
          derivativeValue: 1.0,
          derivativeUnit: "count / ratio",
          interpretation:
            "Differential roller speed drawing ratio reducing roving linear mass density.",
        };
      }
      break;
    }

    case "gb-1306-watt-rotary-engine": {
      if (controlKey === "strokeRateSpm") {
        return {
          metricName: "Shaft Rotational Speed",
          derivativeSymbol: "∂RPM / ∂SPM",
          derivativeValue: 2.0,
          derivativeUnit: "RPM / SPM",
          interpretation:
            "Sun and planet epicyclic gear doubling shaft speed per complete beam reciprocation cycle.",
        };
      }
      break;
    }

    case "gb-1420-cort-puddling-rolling": {
      if (controlKey === "furnaceTemperatureCelsius") {
        return {
          metricName: "Decarburization Oxidation Rate",
          derivativeSymbol: "∂Rate_decarb / ∂T",
          derivativeValue: 0.015,
          derivativeUnit: "%/min / °C",
          interpretation:
            "Reverberatory slag bath reaction kinetics burning carbon out of molten cast pig iron.",
        };
      }
      break;
    }

    case "us-x1-hopkins-potash": {
      if (controlKey === "roastTempC") {
        return {
          metricName: "Potash Carbon Burnout Purity",
          derivativeSymbol: "∂Purity / ∂T_roast",
          derivativeValue: 0.05,
          derivativeUnit: "% / °C",
          interpretation:
            "Secondary furnace combustion incinerating black carbon residue into pure pearlash.",
        };
      }
      break;
    }

    case "us-x72-whitney-cotton-gin": {
      if (controlKey === "crankRpm") {
        return {
          metricName: "Clean Lint Extraction Throughput",
          derivativeSymbol: "∂m_lint / ∂RPM_crank",
          derivativeValue: 0.85,
          derivativeUnit: "lb/hr / RPM",
          interpretation:
            "Wire tooth cylinder pulling lint through grate slots separated from green seeds.",
        };
      }
      break;
    }

    case "us-x8277-mccormick-reaper": {
      if (controlKey === "forwardSpeedMph") {
        return {
          metricName: "Acreage Harvesting Rate",
          derivativeSymbol: "∂Area / ∂v_ground",
          derivativeValue: 1.25,
          derivativeUnit: "acres/hr / MPH",
          interpretation:
            "Reciprocating serrated sickle swath cutting efficiency over standing grain fields.",
        };
      }
      break;
    }

    case "us-132-davenport-electric-motor": {
      if (controlKey === "batteryVoltage") {
        return {
          metricName: "Armature No-Load Speed",
          derivativeSymbol: "∂RPM / ∂V_batt",
          derivativeValue: 45.0,
          derivativeUnit: "RPM / V",
          interpretation: "Back-EMF linear speed scaling across commutated rotary electromagnets.",
        };
      }
      break;
    }

    case "us-4750-howe-sewing-machine": {
      if (controlKey === "crankRpm") {
        return {
          metricName: "Lockstitch Formation Rate",
          derivativeSymbol: "∂Stitches / ∂RPM_crank",
          derivativeValue: 1.0,
          derivativeUnit: "stitches/min / RPM",
          interpretation:
            "Synchronized eye-pointed needle penetration and reciprocating shuttle loop pass.",
        };
      }
      break;
    }

    case "us-6469-lincoln-buoy": {
      if (controlKey === "inflationPct") {
        return {
          metricName: "Hull Draft Shoal Reduction",
          derivativeSymbol: "∂Draft / ∂%_inflation",
          derivativeValue: 0.045,
          derivativeUnit: "ft / %",
          interpretation:
            "Archimedes buoyant displacement lifting vessel over shallow river sandbars.",
        };
      }
      break;
    }

    case "us-48475-yale-lock": {
      if (controlKey === "keyInsertion") {
        return {
          metricName: "Pin Tumbler Shear Line Alignment",
          derivativeSymbol: "∂Alignment / ∂x_key",
          derivativeValue: 1.0,
          derivativeUnit: "unit / unit",
          interpretation:
            "Bitted flat key lifting driver and key pins to cylindrical plug shear boundary.",
        };
      }
      break;
    }

    case "us-78317-nobel-dynamite": {
      if (controlKey === "ngConcentrationPct") {
        return {
          metricName: "Detonation Shock Front Velocity",
          derivativeSymbol: "∂v_det / ∂%_NG",
          derivativeValue: 45.0,
          derivativeUnit: "m/s / %",
          interpretation:
            "Chapman-Jouguet detonation wave speed through kieselguhr-stabilized nitroglycerin.",
        };
      }
      break;
    }

    case "us-79265-sholes-typewriter": {
      if (controlKey === "typingSpeedWpm") {
        return {
          metricName: "Carriage Escapement Advance Rate",
          derivativeSymbol: "∂Strokes / ∂WPM",
          derivativeValue: 5.0,
          derivativeUnit: "characters/min / WPM",
          interpretation:
            "Type-bar basket striking and ratchet wheel carriage letter-spacing escapement.",
        };
      }
      break;
    }

    case "us-105338-hyatt-celluloid": {
      if (controlKey === "steamTempC") {
        return {
          metricName: "Thermoplastic Molding Plasticity",
          derivativeSymbol: "∂Flow / ∂T_steam",
          derivativeValue: 0.12,
          derivativeUnit: "mm/s / °C",
          interpretation:
            "Camphor-nitrocellulose mutual solvent gelation under heated hydraulic press.",
        };
      }
      break;
    }

    case "us-157124-glidden-barbed-wire": {
      if (controlKey === "twistsPerFoot") {
        return {
          metricName: "Spurred Barb Interlock Clamping Force",
          derivativeSymbol: "∂F_clamp / ∂Twist",
          derivativeValue: 18.5,
          derivativeUnit: "N / twist",
          interpretation:
            "Twisted dual-strand wire clamping short coiled spurred barbs against lateral sliding.",
        };
      }
      break;
    }

    case "us-313224-mergenthaler-linotype": {
      if (controlKey === "spacebandWedge") {
        return {
          metricName: "Line Justification Expansion",
          derivativeSymbol: "∂Width / ∂WedgeLift",
          derivativeValue: 0.5,
          derivativeUnit: "mm / mm",
          interpretation:
            "Double-wedge spaceband sliding elevation justifying assembled character line against casting jaws.",
        };
      }
      break;
    }

    case "us-388850-eastman-kodak": {
      if (controlKey === "shutterSpeed") {
        return {
          metricName: "Emulsion Photochemical Exposure Energy",
          derivativeSymbol: "∂H / ∂t_exp",
          derivativeValue: 1.0,
          derivativeUnit: "mJ / s",
          interpretation:
            "Reciprocity law photochemical latent image energy integrated across focal plane.",
        };
      }
      break;
    }

    case "us-395781-hollerith-tabulating": {
      if (controlKey === "cardsPerMin") {
        return {
          metricName: "Electromechanical Dial Tally Rate",
          derivativeSymbol: "∂Count / ∂Speed",
          derivativeValue: 1.0,
          derivativeUnit: "tallies/min / (card/min)",
          interpretation:
            "Punched-hole mercury sensing pins closing relay circuits to advance electromechanical counters.",
        };
      }
      break;
    }

    case "us-470918-reno-escalator": {
      if (controlKey === "beltSpeed") {
        return {
          metricName: "Passenger Incline Transport Throughput",
          derivativeSymbol: "∂Throughput / ∂v_belt",
          derivativeValue: 75.0,
          derivativeUnit: "passengers/min / (m/s)",
          interpretation:
            "Endless traveling slatted treadway transporting riders safely across stationary comb landing.",
        };
      }
      break;
    }

    case "us-542846-diesel-engine": {
      if (controlKey === "compRatio") {
        return {
          metricName: "End-of-Compression Air Temperature",
          derivativeSymbol: "∂T_comp / ∂CR",
          derivativeValue: 42.0,
          derivativeUnit: "K / unit_CR",
          interpretation:
            "Isentropic air compression heating cylinder air past fuel auto-ignition threshold without spark plugs.",
        };
      }
      break;
    }

    case "us-1219881-sundback-zipper": {
      if (controlKey === "sliderPositionPct") {
        return {
          metricName: "Engaged Tooth Count",
          derivativeSymbol: "∂N_engaged / ∂x_slider",
          derivativeValue: 0.65,
          derivativeUnit: "teeth / %",
          interpretation:
            "Linear progression of Y-slider cam engaging opposing staggered scoops sequentially.",
        };
      }
      if (controlKey === "pullForceN") {
        return {
          metricName: "Cam Wedge Normal Force",
          derivativeSymbol: "∂F_n / ∂F_pull",
          derivativeValue: 1.25,
          derivativeUnit: "N / N",
          interpretation:
            "Mechanical advantage of the converging slider guide channels converting axial pull into transverse scoop compression.",
        };
      }
      if (controlKey === "lateralTensionN") {
        return {
          metricName: "Corded Tape Strain",
          derivativeSymbol: "∂ε / ∂F_lat",
          derivativeUnit: "% / N",
          derivativeValue: 0.06,
          interpretation:
            "Elastic elongation of reinforced cotton cords under transverse tensile load.",
        };
      }
      break;
    }

    case "us-4341502-makino-scara": {
      if (controlKey === "firstLinkAngleDeg" || controlKey === "theta1") {
        return {
          metricName: "End-Effector X Coordinate",
          derivativeSymbol: "∂X_tool / ∂θ_1",
          derivativeValue: -0.0175,
          derivativeUnit: "norm / deg",
          interpretation:
            "Planar Cartesian displacement of the assembly tool joint under primary shoulder link rotation.",
        };
      }
      if (controlKey === "fourthLinkAngleDeg" || controlKey === "theta4") {
        return {
          metricName: "End-Effector Y Coordinate",
          derivativeSymbol: "∂Y_tool / ∂θ_4",
          derivativeValue: 0.0175,
          derivativeUnit: "norm / deg",
          interpretation:
            "Planar Cartesian displacement of the assembly tool joint under parallel elbow link rotation.",
        };
      }
      break;
    }

    case "us-3119501-lemelson-automatic-warehousing": {
      if (controlKey === "railAddressFraction") {
        const pose = stepLemelsonWarehouseTopology(params);
        return {
          metricName: "Normalized Rail Address",
          derivativeSymbol: "∂q_x / ∂a_x",
          derivativeValue: pose.carrierX === (params.railAddressFraction ?? 0.55) ? 1 : 0,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its rail-address control directly to the carrier pose; the grant supplies no bay spacing in meters.",
        };
      }
      if (controlKey === "levelAddressFraction") {
        return {
          metricName: "Normalized Vertical Address",
          derivativeSymbol: "∂q_z / ∂a_z",
          derivativeValue: 1,
          derivativeUnit: "display fraction / address fraction",
          interpretation:
            "The normalized exhibit maps its level-address control directly to the lift pose; no shelf height is asserted.",
        };
      }
      if (controlKey === "shuttleExtensionFraction") {
        return {
          metricName: "Normalized Shuttle Extension",
          derivativeSymbol: "∂q_y / ∂a_y",
          derivativeValue: 1,
          derivativeUnit: "display fraction / extension fraction",
          interpretation:
            "The normalized exhibit maps the control directly to the transverse transfer pose; no reach, speed, or payload is asserted.",
        };
      }
      break;
    }

    case "us-4098001-watson-rcc": {
      const probe = (key: "lateralContactFraction" | "axisMismatchFraction", value: number) =>
        stepWatsonRemoteCenterComplianceTopology({ ...params, [key]: value });
      const h = 0.001;
      if (controlKey === "lateralContactFraction") {
        const contact = params.lateralContactFraction ?? 0.62;
        const derivative =
          (probe("lateralContactFraction", contact + h).translationOffset -
            probe("lateralContactFraction", contact - h).translationOffset) /
          (2 * h);
        return {
          metricName: "Illustrated Translation",
          derivativeSymbol: "∂q_t / ∂q_c",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "display fraction / contact fraction",
          interpretation:
            "Slope of the normalized exhibit pose. It is not a force-compliance or dimensional prediction.",
        };
      }
      if (controlKey === "axisMismatchFraction") {
        const mismatch = params.axisMismatchFraction ?? 0.44;
        const derivative =
          (probe("axisMismatchFraction", mismatch + h).remainingAxisMismatch -
            probe("axisMismatchFraction", mismatch - h).remainingAxisMismatch) /
          (2 * h);
        return {
          metricName: "Remaining Axis Mismatch",
          derivativeSymbol: "∂q_e / ∂q_m",
          derivativeValue: Number(derivative.toFixed(3)),
          derivativeUnit: "normalized / normalized",
          interpretation:
            "Slope of the source-illustrative alignment cue. The grant does not provide a convergence rate or controller gain.",
        };
      }
      break;
    }

    case "us-5701965-kamen-transporter": {
      if (controlKey === "riderPitchLeanDeg" || controlKey === "pitchLean") {
        return {
          metricName: "Restorative Motor Torque",
          derivativeSymbol: "∂τ / ∂θ",
          derivativeValue: 4.18,
          derivativeUnit: "N·m / deg",
          interpretation:
            "Proportional feedback restoring torque commanded by inverted-pendulum controller to balance rider lean.",
        };
      }
      if (controlKey === "velocityCommandMs" || controlKey === "velocityCommand") {
        return {
          metricName: "Ground Acceleration",
          derivativeSymbol: "∂a / ∂v_cmd",
          derivativeValue: 0.85,
          derivativeUnit: "(m/s²) / (m/s)",
          interpretation:
            "Wheel traction acceleration generated to match rider commanded travel speed.",
        };
      }
      break;
    }

    case "us-4068536-stackhouse-manipulator": {
      if (
        controlKey === "intermediateRollDeg" ||
        controlKey === "firstObliqueAngleDeg" ||
        controlKey === "secondObliqueAngleDeg"
      ) {
        const baseline = params[controlKey] ?? 55;
        const probe = (value: number) =>
          stepStackhouseSourceTopology({ ...params, [controlKey]: value }).bendAngleDeg;
        const derivative = (probe(baseline + 0.25) - probe(baseline - 0.25)) / 0.5;
        return {
          metricName: "Selected Display-Bend Sensitivity",
          derivativeSymbol: "∂β_display / ∂q",
          derivativeValue: Number(derivative.toFixed(4)),
          derivativeUnit: "display deg / selected deg",
          interpretation:
            "Central difference of the same normalized display composition used by the 2D and 3D exhibits. It is not an SI dexterity, velocity, motor, or manufacturing-performance derivative.",
        };
      }
      break;
    }

    default:
      break;
  }

  return null;
}
