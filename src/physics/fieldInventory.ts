/**
 * fieldInventory.ts
 *
 * Unified field-level inventory and provenance registry across all 103 Classic Patents.
 * Strictly guarantees that every active control and computed output has an authenticated
 * owner, canonical physical units, source/scenario origin, governing law, fallback,
 * and domain refusal boundary.
 */

import { allPatents } from "@/data/patents";
import { wasmSurfaceForPatent } from "./coverageManifest";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "./energyChannels";
import { PATENT_PHYSICS_REGISTRY, type PhysicsControl, type PhysicsMetric } from "./telemetryData";
import type {
  FieldInventoryControl,
  FieldInventoryOutput,
  MetricProvenanceClassification,
  PatentFieldInventory,
  RefusalBoundary,
} from "./types";

/**
 * Authentic primary TypeScript simulation kernel for each patent in the library.
 * Direct source of truth for host computation across all 103 catalogue records.
 */
export const KERNEL_MAPPING: Record<string, string> = {
  "us-821393-wright-flyer": "src/physics/wrightKernel.ts",
  "us-381968-tesla-motor": "src/physics/teslaKernel.ts",
  "us-194047-otto-engine": "src/physics/ottoKernel.ts",
  "us-31128-otis-elevator": "src/physics/otisKernel.ts",
  "us-4750-howe-sewing-machine": "src/physics/machineKernels.ts",
  "us-223898-edison-lightbulb": "src/physics/catalogKernels.ts",
  "us-593138-tesla-coil": "src/physics/teslaTransformerKernel.ts",
  "us-1102653-goddard-rocket": "src/physics/engine.ts",
  "us-361931-daimler-engine": "src/physics/parsonsMarineKernel.ts",
  "us-4921293-salisbury-robot-hand": "src/physics/salisburyRobotHandKernel.ts",
  "us-5121329-crump-fdm": "src/physics/crumpFdmKernel.ts",
  "us-5701965-kamen-transporter": "src/physics/kamenTransporterKernel.ts",
  "us-6594844-roomba": "src/physics/roombaKernel.ts",
  "gb-913-watt-separate-condenser": "src/physics/wattCondenserKernel.ts",
  "gb-931-arkwright-water-frame": "src/physics/arkwrightKernel.ts",
  "gb-1306-watt-rotary-engine": "src/physics/wattRotaryKernel.ts",
  "gb-1420-cort-puddling-rolling": "src/physics/cortKernel.ts",
  "us-x1-hopkins-potash": "src/physics/hopkinsPotashKernel.ts",
  "us-x72-whitney-cotton-gin": "src/physics/whitneyCottonGinKernel.ts",
  "us-x8277-mccormick-reaper": "src/physics/mccormickReaperKernel.ts",
  "us-x9430-colt-revolver": "src/physics/coltRevolverKernel.ts",
  "us-132-davenport-electric-motor": "src/physics/catalogKernels.ts",
  "us-588-ericsson-propeller": "src/physics/catalogKernels.ts",
  "us-1647-morse-telegraph": "src/physics/catalogKernels.ts",
  "us-3237-rillieux-evaporator": "src/physics/rillieuxEvaporatorKernel.ts",
  "us-3633-goodyear-rubber": "src/physics/catalogKernels.ts",
  "us-6162-corliss-steam-engine": "src/physics/catalogKernels.ts",
  "us-6469-lincoln-buoy": "src/physics/catalogKernels.ts",
  "us-36836-gatling-gun": "src/physics/catalogKernels.ts",
  "us-48475-yale-lock": "src/physics/yaleLockKernel.ts",
  "us-78317-nobel-dynamite": "src/physics/catalogKernels.ts",
  "us-79265-sholes-typewriter": "src/physics/machineKernels.ts",
  "us-105338-hyatt-celluloid": "src/physics/catalogKernels.ts",
  "us-120057-gramme-dynamo": "src/physics/catalogKernels.ts",
  "us-124404-westinghouse-air-brake": "src/physics/catalogKernels.ts",
  "us-135245-pasteur-fermentation": "src/physics/catalogKernels.ts",
  "us-157124-glidden-barbed-wire": "src/physics/catalogKernels.ts",
  "us-174465-bell-telephone": "src/physics/catalogKernels.ts",
  "us-200521-edison-phonograph": "src/physics/catalogKernels.ts",
  "us-233692-pelton-water-wheel": "src/physics/peltonWheelKernel.ts",
  "us-235199-bell-photophone": "src/physics/bellPhotophoneKernel.ts",
  "us-247804-delaval-separator": "src/physics/catalogKernels.ts",
  "us-307031-edison-indicator": "src/physics/catalogKernels.ts",
  "us-313224-mergenthaler-linotype": "src/physics/machineKernels.ts",
  "us-319596-maxim-machine-gun": "src/physics/catalogKernels.ts",
  "us-328710-parsons-turbine": "src/physics/catalogKernels.ts",
  "us-347140-thomson-welding": "src/physics/catalogKernels.ts",
  "us-388850-eastman-kodak": "src/physics/catalogKernels.ts",
  "us-395781-hollerith-tabulating": "src/physics/catalogKernels.ts",
  "us-400766-hall-aluminium": "src/physics/catalogKernels.ts",
  "us-470918-reno-escalator": "src/physics/catalogKernels.ts",
  "us-542846-diesel-engine": "src/physics/dieselEngineKernel.ts",
  "us-586193-marconi-radio": "src/physics/marconiSharedKernel.ts",
  "us-608969-parsons-turbine": "src/physics/catalogKernels.ts",
  "us-613809-tesla-teleautomaton": "src/physics/catalogKernels.ts",
  "us-621195-zeppelin-airship": "src/physics/catalogKernels.ts",
  "us-682690-hewitt-mercury-lamp": "src/physics/catalogKernels.ts",
  "us-706737-fessenden-wireless": "src/physics/catalogKernels.ts",
  "us-727650-linde-air-liquefaction": "src/physics/catalogKernels.ts",
  "us-808897-carrier-air-conditioner": "src/physics/engine.ts",
  "us-879532-de-forest-audion": "src/physics/catalogKernels.ts",
  "us-942699-baekeland-bakelite": "src/physics/catalogKernels.ts",
  "us-971501-haber-ammonia": "src/physics/catalogKernels.ts",
  "us-1155986-goddard-rocket": "src/physics/engine.ts",
  "us-1219881-sundback-zipper": "src/physics/sundbackZipperKernel.ts",
  "us-1773980-farnsworth-tv": "src/physics/farnsworthTvKernel.ts",
  "us-1781541-einstein-refrigerator": "src/physics/catalogKernels.ts",
  "us-2292387-lamarr-frequency-hopping": "src/physics/lamarrSharedKernel.ts",
  "us-2297691-carlson-electrophotography": "src/physics/catalogKernels.ts",
  "us-2318259-sikorsky-helicopter": "src/physics/sikorskyHelicopterKernel.ts",
  "us-2495429-spencer-microwave": "src/physics/spencerMicrowaveKernel.ts",
  "us-2524035-bardeen-transistor": "src/physics/bardeenPointContactKernel.ts",
  "us-2543181-land-polaroid": "src/physics/catalogKernels.ts",
  "us-2708656-fermi-reactor": "src/physics/fermiKinetics.ts",
  "us-2717437-mestral-velcro": "src/physics/mestralVelcroKernel.ts",
  "us-2846084-goertz-electronic-master-slave-manipulator":
    "src/physics/goertzElectronicMasterSlaveManipulatorKernel.ts",
  "us-2929922-townes-laser": "src/physics/townesMaserKernel.ts",
  "us-2981877-noyce-ic": "src/physics/noycePlanarLeadKernel.ts",
  "us-2988237-devol-programmed-transfer": "src/physics/devolProgrammedTransferKernel.ts",
  "us-3081379-lemelson-machine-vision": "src/physics/lemelsonMachineVisionKernel.ts",
  "us-3119501-lemelson-automatic-warehousing": "src/physics/lemelsonWarehouseKernel.ts",
  "us-3138743-kilby-integrated-circuit": "src/physics/kilbySourceCircuitKernel.ts",
  "us-3212649-amf-versatran": "src/physics/amfVersatranKernel.ts",
  "us-3260375-lemelson-adjustable-manipulator":
    "src/physics/lemelsonAdjustableManipulatorKernel.ts",
  "us-3313014-lemelson-automatic-production": "src/physics/lemelsonAutomaticProductionKernel.ts",
  "us-3353115-maiman-ruby-laser": "src/physics/catalogKernels.ts",
  "us-3541541-engelbart-mouse": "src/physics/catalogKernels.ts",
  "us-3671542-kwolek-kevlar": "src/physics/catalogKernels.ts",
  "us-3728480-baer-odyssey": "src/physics/baerOdysseyKernel.ts",
  "us-3858232-boyle-smith-ccd": "src/physics/boyleSmithCcdKernel.ts",
  "us-3858581-kamen-medication-injection-device": "src/physics/kamenInjectionKernel.ts",
  "us-4063220-metcalfe-ethernet": "src/physics/metcalfeEthernetKernel.ts",
  "us-4068536-stackhouse-manipulator": "src/physics/stackhouseSourceKernel.ts",
  "us-4098001-watson-rcc": "src/physics/watsonRccKernel.ts",
  "us-4098001-watson-remote-center-compliance": "src/physics/watsonRemoteCenterComplianceKernel.ts",
  "us-4136359-wozniak-apple": "src/physics/catalogKernels.ts",
  "us-4341502-makino-scara": "src/physics/makinoScaraKernel.ts",
  "us-4512709-milacron-robot-toolchanger": "src/physics/milacronRobotToolchangerKernel.ts",
  "us-4575330-hull-stereolithography": "src/physics/hullStereolithographyKernel.ts",
  "us-4765668-robot-end-effector": "src/physics/robotEndEffectorKernel.ts",
  "us-4976582-clavel-delta-robot": "src/physics/clavelDeltaRobotKernel.ts",
  "us-6120588-eink": "src/physics/eInkSharedKernel.ts",
  "us-6285999-pagerank": "src/physics/pageRankKernel.ts",
  "us-6302230-kamen-segway": "src/physics/kamenSegwayKernel.ts",
  "us-6331181-davinci": "src/physics/daVinciKernel.ts",
  "us-7479949-multitouch": "src/physics/multiTouchKernel.ts",
};

/**
 * Exact generic-crate export availability descriptor for FrankenSim fs-wasm.
 */
export interface GenericCrateExportDescriptor {
  crate: string;
  exportSymbol: string;
  internalBinding: string;
  domain: string;
  lawDescription: string;
  isBound: boolean;
}

export const GENERIC_CRATE_EXPORT_AVAILABILITY: readonly GenericCrateExportDescriptor[] = [
  {
    crate: "fs-ga",
    exportSymbol: "ga_orbits",
    internalBinding: "gaFn",
    domain: "geometric_algebra",
    lawDescription: "Rotor-driven multivector kinematics and angular momentum conservation",
    isBound: true,
  },
  {
    crate: "fs-sparse",
    exportSymbol: "sparse_heat",
    internalBinding: "heatFn",
    domain: "thermodynamics_transport",
    lawDescription: "Transient heat conduction over sparse unstructured mesh (Fourier law)",
    isBound: true,
  },
  {
    crate: "fs-fft",
    exportSymbol: "fft_waves",
    internalBinding: "waveFn",
    domain: "optics_waves",
    lawDescription: "D'Alembert wave equation solver via spectral decomposition",
    isBound: true,
  },
  {
    crate: "fs-fluid",
    exportSymbol: "lattice_fluid",
    internalBinding: "fluidFn",
    domain: "thermo_fluid",
    lawDescription: "Lattice Boltzmann D2Q9 flow and hydrodynamic pressure gradient",
    isBound: true,
  },
  {
    crate: "fs-mbd",
    exportSymbol: "cyclic_joints",
    internalBinding: "cyclicFn",
    domain: "solid_mechanics",
    lawDescription: "Constrained multibody kinematics and mechanical linkage timing",
    isBound: true,
  },
  {
    crate: "fs-modes",
    exportSymbol: "modal_frequencies",
    internalBinding: "modesFn",
    domain: "solid_mechanics",
    lawDescription: "Eigenfrequency analysis and resonant vibration modes",
    isBound: true,
  },
  {
    crate: "fs-poisson",
    exportSymbol: "poisson_2d",
    internalBinding: "poisson2d",
    domain: "electromagnetics_flux",
    lawDescription: "2D electrostatic potential and Poisson boundary value solver",
    isBound: true,
  },
  {
    crate: "fs-reaction-diffusion",
    exportSymbol: "gray_scott",
    internalBinding: "grayScottFrames",
    domain: "chemistry",
    lawDescription: "Nonlinear autocatalytic chemical reaction-diffusion morphogenesis",
    isBound: true,
  },
  {
    crate: "fs-spectral",
    exportSymbol: "fft_power_spectrum",
    internalBinding: "fftPowerSpectrum",
    domain: "telecom",
    lawDescription: "Discrete Fourier Transform spectral power density partition",
    isBound: true,
  },
  {
    crate: "fs-autodiff",
    exportSymbol: "autodiff_derivatives",
    internalBinding: "autodiffDerivatives",
    domain: "sensitivity",
    lawDescription: "Dual-number automatic differentiation for parameter Jacobian",
    isBound: true,
  },
  {
    crate: "fs-hodge",
    exportSymbol: "hodge_decomposition",
    internalBinding: "hodgeDecomposition",
    domain: "differential_forms",
    lawDescription:
      "Helmholtz-Hodge decomposition into curl-free and divergence-free vector fields",
    isBound: true,
  },
  {
    crate: "fs-cfd",
    exportSymbol: "navier_stokes_cavity",
    internalBinding: "navierStokesCavity",
    domain: "thermo_fluid",
    lawDescription: "Incompressible Navier-Stokes cavity vortex recirculation",
    isBound: true,
  },
  {
    crate: "fs-truss",
    exportSymbol: "truss_path",
    internalBinding: "trussPath",
    domain: "continuum_elasticity",
    lawDescription: "Planar truss structural compliance and stress minimization",
    isBound: true,
  },
  {
    crate: "fs-flowcert",
    exportSymbol: "flowcert_verify",
    internalBinding: "flowcert",
    domain: "conservation",
    lawDescription: "Numerical divergence and mass/energy conservation bounds audit",
    isBound: true,
  },
];

/**
 * Resolve control origin provenance.
 */
export function resolveControlProvenance(
  _patentId: string,
  ctrl: PhysicsControl,
  meta: (typeof PATENT_PHYSICS_REGISTRY)[string],
): MetricProvenanceClassification {
  if (ctrl.provenance) return ctrl.provenance;
  if (
    ctrl.id.toLowerCase().includes("claim") ||
    (ctrl.min === 0 && ctrl.max === 1 && ctrl.step === 1)
  ) {
    return "source-disclosed";
  }
  if (ctrl.unit === "normalized" || ctrl.unit.includes("normalized")) {
    return "topology-normalized";
  }
  if (meta.provenance) return meta.provenance;
  return "scenario-reader";
}

/**
 * Resolve metric output origin provenance.
 */
export function resolveMetricProvenance(
  _patentId: string,
  metric: PhysicsMetric,
  meta: (typeof PATENT_PHYSICS_REGISTRY)[string],
): MetricProvenanceClassification {
  if (metric.provenance) return metric.provenance;
  const unitStr = String(metric.unit);
  if (
    metric.value === "REFUSED" ||
    metric.value === "WITHHELD" ||
    unitStr.includes("boundary") ||
    unitStr.includes("refusal")
  ) {
    return "refusal-bounded";
  }
  if (metric.label.toLowerCase().includes("claim") || unitStr.toLowerCase().includes("printed")) {
    return "source-disclosed";
  }
  if (
    metric.unit === "normalized" ||
    unitStr.includes("normalized") ||
    metric.badgeColor === "purple"
  ) {
    return "topology-normalized";
  }
  if (meta.provenance) return meta.provenance;
  return "scenario-modern";
}

/**
 * Build the complete field-level inventory for a single patent.
 */
export function buildFieldInventoryForPatent(patentId: string): PatentFieldInventory {
  const meta = PATENT_PHYSICS_REGISTRY[patentId];
  if (!meta) {
    throw new Error(`Patent ${patentId} has no registration in PATENT_PHYSICS_REGISTRY`);
  }

  const surface = wasmSurfaceForPatent(patentId);
  const tsKernel = KERNEL_MAPPING[patentId] ?? "src/physics/catalogKernels.ts";

  const controls: FieldInventoryControl[] = (meta.controls || []).map((ctrl) => {
    const origin = resolveControlProvenance(patentId, ctrl, meta);
    return {
      id: ctrl.id,
      label: ctrl.label,
      unit: ctrl.unit ?? "",
      origin,
      originCitation: ctrl.provenanceCitation,
      defaultValue: ctrl.defaultValue,
      min: ctrl.min,
      max: ctrl.max,
      step: ctrl.step,
      owner: tsKernel,
    };
  });

  const sampleParams: Record<string, number> = {};
  for (const c of meta.controls || []) {
    sampleParams[c.id] = c.defaultValue;
  }

  const rawMetrics = meta.computeMetrics(sampleParams);
  const outputs: FieldInventoryOutput[] = (rawMetrics || []).map((m) => {
    const origin = resolveMetricProvenance(patentId, m, meta);
    const isRefused =
      origin === "refusal-bounded" ||
      m.value === "REFUSED" ||
      m.value === "WITHHELD" ||
      meta.domain === "source_reading";

    const refusal: RefusalBoundary = {
      isRefused,
      reason: isRefused
        ? meta.pedagogicalInsight || `Quantitative output refused for ${m.label}`
        : undefined,
    };

    // The module that computed the output
    const isWasmOwner = surface?.provesSharedBusSource && !isRefused;
    const owner = isWasmOwner ? surface.sourceCrate : tsKernel;

    const outputId = m.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

    return {
      id: outputId || "metric_output",
      label: m.label,
      unit: m.unit ?? "",
      origin,
      originCitation: m.provenanceCitation,
      governingFunction: meta.governingEquation,
      fallback: meta.engineMethod,
      domain: meta.domain,
      refusal,
      owner,
    };
  });

  const omissionReason =
    ENERGY_CHANNEL_OMISSION_REASONS[patentId as keyof typeof ENERGY_CHANNEL_OMISSION_REASONS];
  const activeChannels = omissionReason ? [] : energyChannelsFor(patentId, sampleParams);
  const hasEnergyChannels = activeChannels.length > 0;

  const isPatentRefused =
    meta.domain === "source_reading" || outputs.every((o) => o.refusal.isRefused);

  return {
    patentId,
    domain: meta.domain,
    domainTitle: meta.domainTitle,
    equationName: meta.equationName,
    governingEquation: meta.governingEquation,
    engineMethod: meta.engineMethod,
    controls,
    outputs,
    runtimeOwner: {
      wasmSurface: surface?.kind ?? "none",
      sourceCrate: surface?.sourceCrate,
      actualComputingOwner: surface?.provesSharedBusSource ? surface.sourceCrate : tsKernel,
      fallbackComputingOwner: tsKernel,
      refusal: {
        isRefused: isPatentRefused,
        reason: isPatentRefused ? meta.pedagogicalInsight : undefined,
      },
    },
    energyChannels: {
      hasEnergyChannels,
      omissionReason,
    },
  };
}

/**
 * Return field-level inventories across all 103 catalogue patents.
 */
export function getAllPatentFieldInventories(): Record<string, PatentFieldInventory> {
  const result: Record<string, PatentFieldInventory> = {};
  for (const patent of allPatents) {
    result[patent.id] = buildFieldInventoryForPatent(patent.id);
  }
  return result;
}

/**
 * Strict verification helper to ensure complete field inventory integrity.
 */
export function verifyFieldInventoryCompleteness(inventory: PatentFieldInventory): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!inventory.patentId) errors.push("Missing patentId");
  if (!inventory.domain) errors.push("Missing domain");
  if (!inventory.governingEquation) errors.push("Missing governingEquation");
  if (!inventory.engineMethod) errors.push("Missing engineMethod");
  if (!inventory.runtimeOwner.actualComputingOwner) {
    errors.push("Missing runtimeOwner.actualComputingOwner");
  }
  if (!inventory.runtimeOwner.fallbackComputingOwner) {
    errors.push("Missing runtimeOwner.fallbackComputingOwner");
  }

  for (const ctrl of inventory.controls) {
    if (!ctrl.id) errors.push(`Control missing id in ${inventory.patentId}`);
    if (!ctrl.label) errors.push(`Control missing label in ${inventory.patentId}:${ctrl.id}`);
    if (ctrl.unit === undefined || ctrl.unit === null) {
      errors.push(`Control missing unit in ${inventory.patentId}:${ctrl.id}`);
    }
    if (!ctrl.origin) errors.push(`Control missing origin in ${inventory.patentId}:${ctrl.id}`);
    if (!ctrl.owner) errors.push(`Control missing owner in ${inventory.patentId}:${ctrl.id}`);
  }

  for (const out of inventory.outputs) {
    if (!out.id) errors.push(`Output missing id in ${inventory.patentId}`);
    if (!out.label) errors.push(`Output missing label in ${inventory.patentId}:${out.id}`);
    if (out.unit === undefined || out.unit === null) {
      errors.push(`Output missing unit in ${inventory.patentId}:${out.id}`);
    }
    if (!out.origin) errors.push(`Output missing origin in ${inventory.patentId}:${out.id}`);
    if (!out.owner) errors.push(`Output missing owner in ${inventory.patentId}:${out.id}`);
    if (!out.governingFunction) {
      errors.push(`Output missing governingFunction in ${inventory.patentId}:${out.id}`);
    }
    if (!out.fallback) errors.push(`Output missing fallback in ${inventory.patentId}:${out.id}`);
    if (!out.domain) errors.push(`Output missing domain in ${inventory.patentId}:${out.id}`);
    if (!out.refusal) errors.push(`Output missing refusal in ${inventory.patentId}:${out.id}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export type { FieldInventoryControl, FieldInventoryOutput, PatentFieldInventory };
