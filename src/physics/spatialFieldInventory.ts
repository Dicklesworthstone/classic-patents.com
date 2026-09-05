/**
 * spatialFieldInventory.ts
 *
 * Admitted spatial field inventory and blocker registry for Classic Patents.
 * Strictly accounts for every flagship continuous/spatial field (scalar, vector,
 * and tensor grids), documenting:
 * 1. Physical domain and governing PDE/law
 * 2. Admitted model status (actual admitted sample vs explicitly tracked blocker)
 * 3. Material and boundary condition declarations
 * 4. Sample buffer shapes and 2D/3D dual-face consumers
 * 5. Explicit blockers for patents where source disclosures lack parameters
 *    for quantitative field solves (e.g. Fermi reactor pile geometry without
 *    moderator transport cross-sections).
 */

import type { MetricProvenanceClassification, PhysicsDomain } from "./types";

export type SpatialFieldModelStatus = "admitted-sample" | "topology-display" | "explicitly-blocked";

export interface BlockerTracking {
  isBlocked: boolean;
  reason: string;
  unblockPrerequisite: string;
}

export interface SpatialFieldDescriptor {
  readonly patentId: string;
  readonly fieldId: string;
  readonly fieldName: string;
  readonly domain: PhysicsDomain;
  readonly status: SpatialFieldModelStatus;
  readonly provenance: MetricProvenanceClassification;
  readonly governingEquation: string;
  readonly materialBoundaryInputs: string;
  readonly gridDimensions: readonly [number, number] | readonly [number, number, number];
  readonly sampleBufferType: "Float32Array" | "Float64Array";
  readonly generatorFunction: string;
  readonly twoDimensionalConsumer: string;
  readonly threeDimensionalConsumer: string;
  readonly blockerTracking?: BlockerTracking;
}

export const SPATIAL_FIELD_REGISTRY: Record<string, SpatialFieldDescriptor> = {
  "us-821393-wright-flyer": {
    patentId: "us-821393-wright-flyer",
    fieldId: "wright-biplane-airflow",
    fieldName: "Wright Biplane Aerodynamic Airflow Velocity Field",
    domain: "aerodynamics_mbd",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Biplane bound vortex circulation Gamma = 0.5 * CL * v * c with Prandtl downwash w = 2*CL*v/(pi*AR) and differential wing-tip warping Delta Gamma",
    materialBoundaryInputs:
      "Air density rho = 1.225 kg/m^3, chord c = 1.98 m, span b = 12.29 m, gap h = 1.88 m; farfield freestream Dirichlet v -> (v_inf, 0, 0)",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeWrightAirflowVelocityField",
    twoDimensionalConsumer: "WrightFlyerSim (SVG dynamic flow streamline weave)",
    threeDimensionalConsumer:
      "WrightFlyer3D (Vector streamlines via evaluateWrightAirflowVelocityVector)",
  },

  "us-381968-tesla-motor": {
    patentId: "us-381968-tesla-motor",
    fieldId: "tesla-motor-rotating-bfield",
    fieldName: "Tesla Motor Rotating Magnetic Flux Field B(x, y)",
    domain: "electromagnetics_flux",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Biot-Savart superposition of 4 energized stator coils across two quadrature circuits (Fig. 9): B = sum(mu0 * I_i / (2*pi*r_i^2) * (-dy x_hat + dx y_hat))",
    materialBoundaryInputs:
      "Stator pole radius r = 0.32 m, 4 poles at 90 deg, two independent circuits with pi/2 phase offset, vacuum permeability mu0",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeTeslaRotatingBField",
    twoDimensionalConsumer: "TeslaMotorSim (Stator core magnetic flux density overlay)",
    threeDimensionalConsumer:
      "TeslaMotor3D (Colormapped B-field slice DataTexture and vector arrow)",
  },

  "us-593138-tesla-coil": {
    patentId: "us-593138-tesla-coil",
    fieldId: "tesla-coil-standing-wave-efield",
    fieldName: "Tesla Conical Secondary Resonant Standing-Wave E-Field",
    domain: "electromagnetics_flux",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Quarter-wave helical resonator standing-wave potential V(z) = V_peak * sin(theta_elec * z/H) and radial electric field Er(r, z) = V(z) / (r * ln(R_out/r_cone))",
    materialBoundaryInputs:
      "Grounded base V(0) = 0, high-potential elevated terminal V(H) = V_peak, conical cone boundary r(z) = R_base * (1 - 0.7 * z/H)",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeTeslaCoilEField",
    twoDimensionalConsumer: "TeslaCoilSim (Resonant standing wave potential distribution)",
    threeDimensionalConsumer:
      "TeslaCoil3D (Secondary electrical potential profile beads and envelope)",
  },

  "us-223898-edison-lightbulb": {
    patentId: "us-223898-edison-lightbulb",
    fieldId: "edison-filament-thermal-radiation",
    fieldName: "Edison Horseshoe Filament Thermal Conduction & Radiation Field",
    domain: "thermodynamics_transport",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Residual vacuum Fourier heat conduction nabla^2 T = 0 combined with Stefan-Boltzmann surface radiation P = epsilon * sigma * A * T^4",
    materialBoundaryInputs:
      "Horseshoe carbonized filament loop radius r = 0.22, glass bulb envelope boundary r = 0.48, ambient vacuum pressure P_torr, T_kelvin in [300, 2800] K",
    gridDimensions: [64, 64],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeEdisonFilamentThermalField",
    twoDimensionalConsumer: "EdisonBulbSim (Filament radiative thermal halo overlay)",
    threeDimensionalConsumer: "EdisonBulb3D (3D bulb incandescence and thermal particle field)",
  },

  "us-2981877-noyce-ic": {
    patentId: "us-2981877-noyce-ic",
    fieldId: "noyce-planar-depletion",
    fieldName: "Noyce Planar P-N Junction Space-Charge Depletion Field",
    domain: "semiconductor_microarch",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Poisson 1D/2D space-charge depletion width w = sqrt(2 * eps_s * (V_bi + V_R) / (q * N_B)) with Gaussian lateral diffusion decay",
    materialBoundaryInputs:
      "Silicon relative permittivity eps_s = 11.7 * eps_0, built-in potential V_bi = 0.7 V, applied reverse bias V_R >= 0 V",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeNoyceDepletionField",
    twoDimensionalConsumer: "NoycePlanarICSim (P-N junction depletion boundary contour)",
    threeDimensionalConsumer: "NoycePlanarIC3D (Planar depletion layer slice DataTexture)",
  },

  "us-3858232-boyle-smith-ccd": {
    patentId: "us-3858232-boyle-smith-ccd",
    fieldId: "ccd-3phase-potential-well",
    fieldName: "Boyle & Smith 3-Phase CCD Potential Well Channel Profile",
    domain: "semiconductor_carrier",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "3-phase MOS surface depletion well potential psi_s(x, t) modulated by phi_1, phi_2, phi_3 sinusoidal clock barriers with exponential depth decay",
    materialBoundaryInputs:
      "SiO2 dielectric surface at y = 0, bulk silicon at y = 1 with depth decay exp(-2.5 y), gate pitch with 120 deg phase spacing",
    gridDimensions: [64, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeCcdPotentialWellField",
    twoDimensionalConsumer:
      "BoyleSmithCcdSim (2D surface potential channel profile and electron packets)",
    threeDimensionalConsumer: "BoyleSmithCcd3D (Dynamic 3D potential well deformation mesh)",
  },

  "us-2708656-fermi-reactor": {
    patentId: "us-2708656-fermi-reactor",
    fieldId: "fermi-pile-neutron-density",
    fieldName: "Fermi-Szilard Graphite-Uranium Pile Normalized Neutron Density Display",
    domain: "nuclear_kinetics",
    status: "topology-display",
    provenance: "topology-normalized",
    governingEquation:
      "Fundamental geometric cosine display envelope cos(pi*x/(2a)) * cos(pi*z/(2b)) modulated by 6-group delayed point kinetics k_eff and rod depression",
    materialBoundaryInputs:
      "Rectangular graphite envelope [-1, 1] x [-1, 1], absorber rod insertion coordinate with localized absorption dip",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeFermiNormalizedDisplayField",
    twoDimensionalConsumer: "FermiReactorSim (Lattice core flux intensity distribution)",
    threeDimensionalConsumer: "fermiReactorModel (3D neutron cascade particle density modulator)",
    blockerTracking: {
      isBlocked: true,
      reason:
        "Historic patent US 2,708,656 provides geometric lump pile specifications but lacks microscopic transport cross-sections (Sigma_a, Sigma_s) and control-rod absorber worth calibration required for an unconstrained 3D multi-group neutron diffusion solve.",
      unblockPrerequisite:
        "Admitted nuclear cross-section library and boundary albedo data for CP-1 graphite/uranium configuration.",
    },
  },

  "us-1102653-goddard-rocket": {
    patentId: "us-1102653-goddard-rocket",
    fieldId: "goddard-expansion-plume",
    fieldName: "Goddard Supersonic Rocket Expansion Plume & Mach Diamonds",
    domain: "thermo_fluid",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "de Laval supersonic nozzle expansion with quasi-periodic shock diamonds: intensity = exp(-u)*[0.65 + 0.35*cos(k*u - omega*t)] * exp(-v^2/(2*r_plume^2))",
    materialBoundaryInputs:
      "Chamber pressure P_c in [100, 300] psi, area expansion ratio epsilon, nozzle centerline axial symmetry",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeGoddardPlumeField",
    twoDimensionalConsumer: "GoddardRocketSim (Supersonic exhaust plume stream)",
    threeDimensionalConsumer: "goddardRocketModel (Exhaust gas plume DataTexture)",
  },

  "us-3353115-maiman-ruby-laser": {
    patentId: "us-3353115-maiman-ruby-laser",
    fieldId: "maiman-tem00-cavity",
    fieldName: "Maiman Ruby Laser Optical Resonator TEM00 Photon Flux Field",
    domain: "optics_waves",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Optical resonator TEM00 Gaussian transverse beam waist profile: I(r) = I_0 * exp(-2*r^2 / w0^2) * rod_boundary(r)",
    materialBoundaryInputs:
      "Cylindrical synthetic ruby rod radius R = 0.85, dielectric index step boundary, optical pump energy J",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeLaserCavityField",
    twoDimensionalConsumer: "MaimanRubyLaserSim (Transverse cavity mode display)",
    threeDimensionalConsumer: "maimanRubyLaserModel (Resonator optical flux beam DataTexture)",
  },

  "us-2495429-spencer-microwave": {
    patentId: "us-2495429-spencer-microwave",
    fieldId: "spencer-microwave-cavity-mode",
    fieldName: "Spencer Magnetron Microwave Cavity Standing-Wave Display",
    domain: "electromagnetics_flux",
    status: "topology-display",
    provenance: "topology-normalized",
    governingEquation:
      "Rectangular waveguide standing wave mode display: mode = sin(pi*u) * sin(2*pi*v + phi)",
    materialBoundaryInputs:
      "Dimensionless treatment cavity boundary [0, 1] x [0, 1]; source provides guided region without waveguide dimensions or RF wattage",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeSpencerPathFieldDisplay",
    twoDimensionalConsumer: "SpencerMicrowaveSim (Treatment cavity wave mode)",
    threeDimensionalConsumer: "SpencerMicrowave3D (Microwave field slice DataTexture)",
    blockerTracking: {
      isBlocked: true,
      reason:
        "Historic patent US 2,495,429 discloses microwave heating cavity concept but gives no guide dimensions, field intensity, or RF power ratings.",
      unblockPrerequisite:
        "Declared waveguide dimensions (a, b) and magnetron power rating in Watts for quantitative Maxwell solve.",
    },
  },

  "us-1773980-farnsworth-tv": {
    patentId: "us-1773980-farnsworth-tv",
    fieldId: "farnsworth-raster-dissector",
    fieldName: "Farnsworth Image Dissector Electron Beam Raster Field",
    domain: "electromagnetics_flux",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Gaussian deflected scanning aperture spot and line potential: 0.25*line(v) + 0.75*line(v)*spot(u)",
    materialBoundaryInputs:
      "Photocathode scanning plane [0, 1] x [0, 1], deflection coil coordinates (cx, cy)",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeFarnsworthRasterField",
    twoDimensionalConsumer: "FarnsworthTVSim (Image dissector raster line scan)",
    threeDimensionalConsumer: "FarnsworthTV3D (Cathode ray tube scanning raster DataTexture)",
  },

  "us-727650-linde-air-liquefaction": {
    patentId: "us-727650-linde-air-liquefaction",
    fieldId: "linde-jt-thermal-gradient",
    fieldName: "Linde Countercurrent Joule-Thomson Heat Exchanger Temperature Field",
    domain: "thermodynamics_transport",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Joule-Thomson isenthalpic throttling Delta T_JT = mu_JT * Delta P with countercurrent heat exchanger temperature distribution",
    materialBoundaryInputs:
      "High-pressure tube vs low-pressure concentric return sheath, inlet pressure bar in [50, 200], throttle temperature K",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeJouleThomsonThermalField",
    twoDimensionalConsumer: "LindeAirLiquefactionSim (Countercurrent heat exchanger gradient)",
    threeDimensionalConsumer:
      "lindeLiquefactionModel (Coaxial liquefaction tube thermal DataTexture)",
  },

  "us-328710-parsons-turbine": {
    patentId: "us-328710-parsons-turbine",
    fieldId: "parsons-steam-enthalpy-drop",
    fieldName: "Parsons Multistage Steam Turbine Blading Enthalpy Cascade",
    domain: "thermo_fluid",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Isentropic expansion enthalpy cascade h(u) = (1 - 0.75*u)^0.28 with annular flare radius r(u) = 0.3 + 0.6*u^2",
    materialBoundaryInputs:
      "Inlet pressure psi in [30, 300], blading stages N = 48, casing annular flare boundary",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeSteamEnthalpyField",
    twoDimensionalConsumer: "ParsonsTurbineSim (Multistage blade pressure/enthalpy gradient)",
    threeDimensionalConsumer: "ParsonsTurbine3D (Steam expansion field slice DataTexture)",
  },

  "us-808897-carrier-air-conditioner": {
    patentId: "us-808897-carrier-air-conditioner",
    fieldId: "carrier-spray-chamber-density",
    fieldName: "Carrier Spray-Chamber Droplet Density & Airflow Field",
    domain: "thermo_fluid",
    status: "admitted-sample",
    provenance: "source-derived",
    governingEquation:
      "Bivariate Gaussian atomized spray nozzle plume density: rho(u, v) = jet * exp(-(u-0.25)^2 / 0.04) * exp(-(v-0.6)^2 / 0.12)",
    materialBoundaryInputs:
      "Airflow rate cfm in [2000, 25000], nozzle position (0.25, 0.6), spray chamber boundaries",
    gridDimensions: [32, 32],
    sampleBufferType: "Float32Array",
    generatorFunction: "computeCarrierSprayField",
    twoDimensionalConsumer: "CarrierAirConditionerSim (Spray chamber psychrometric mist)",
    threeDimensionalConsumer: "CarrierAirConditioner3D (Spray chamber droplet density field)",
  },
};

/**
 * Look up the spatial field descriptor for a patent.
 */
export function getSpatialFieldDescriptor(patentId: string): SpatialFieldDescriptor | undefined {
  return SPATIAL_FIELD_REGISTRY[patentId];
}

/**
 * Return all registered spatial field descriptors.
 */
export function getAllSpatialFieldDescriptors(): readonly SpatialFieldDescriptor[] {
  return Object.values(SPATIAL_FIELD_REGISTRY);
}

/**
 * Check whether a patent's spatial field is an admitted physical sample.
 */
export function isSpatialFieldAdmitted(patentId: string): boolean {
  const desc = SPATIAL_FIELD_REGISTRY[patentId];
  return desc?.status === "admitted-sample";
}

/**
 * Retrieve the explicit blocker explanation for a blocked or topology-only field.
 */
export function getSpatialFieldBlocker(patentId: string): string | null {
  const desc = SPATIAL_FIELD_REGISTRY[patentId];
  if (!desc) return null;
  if (desc.blockerTracking?.isBlocked) {
    return desc.blockerTracking.reason;
  }
  return null;
}
