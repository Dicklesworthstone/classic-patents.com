/**
 * Source-bounded public state for US 6,331,181.
 *
 * The grant describes a releasable tool boundary: tool-side circuitry and
 * memory identify a compatible tool, convey measured calibration information,
 * and report engagement to a processor. It does not supply a dimensioned arm,
 * a tool trajectory, contact material data, or force/speed limits. This module
 * therefore deliberately models only those disclosed logical relations.
 */
export const DA_VINCI_INTERFACE_KERNEL_SOURCE = "source-bounded-ts";

export const DA_VINCI_INTERFACE_SOURCE_BOUNDARY =
  "US 6,331,181 supplies compatibility, measured calibration, and engagement-reporting topology at a releasable tool interface. It does not supply a dimensioned arm, tool trajectory, contact material card, force law, speed limit, or clinical-performance card; quantitative mechanics are therefore refused.";

export interface DaVinciInterfaceControls {
  compatibilitySignalPresent: boolean;
  calibrationRecordAvailable: boolean;
  engagementSignalPresent: boolean;
}

export interface DaVinciInterfaceParams {
  compatibilitySignalPresent?: number | boolean;
  calibrationRecordAvailable?: number | boolean;
  engagementSignalPresent?: number | boolean;
  /** Legacy persisted control; interpreted only as a compatibility signal. */
  tremorFilterEnabled?: number | boolean;
}

export const DA_VINCI_INTERFACE_DEFAULT_CONTROLS: DaVinciInterfaceControls = {
  compatibilitySignalPresent: true,
  calibrationRecordAvailable: true,
  engagementSignalPresent: true,
};

function asBoolean(value: number | boolean | undefined, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  return typeof value === "number" && Number.isFinite(value) ? value >= 0.5 : fallback;
}

export function readDaVinciInterfaceControls(
  params: DaVinciInterfaceParams & Record<string, unknown>,
): DaVinciInterfaceControls {
  const compat =
    params.compatibilitySignalPresent ??
    params.compatibility ??
    params.compatible ??
    params.compatibilitySignal ??
    params.tremorFilterEnabled;
  const calib =
    params.calibrationRecordAvailable ??
    params.calibration ??
    params.calibrationRecord ??
    params.calRecord ??
    params.calibrationAvailable;
  const engage =
    params.engagementSignalPresent ??
    params.engagement ??
    params.engagementSignal ??
    params.engaged ??
    params.engagementPresent;

  return {
    compatibilitySignalPresent: asBoolean(
      compat as number | boolean | undefined,
      DA_VINCI_INTERFACE_DEFAULT_CONTROLS.compatibilitySignalPresent,
    ),
    calibrationRecordAvailable: asBoolean(
      calib as number | boolean | undefined,
      DA_VINCI_INTERFACE_DEFAULT_CONTROLS.calibrationRecordAvailable,
    ),
    engagementSignalPresent: asBoolean(
      engage as number | boolean | undefined,
      DA_VINCI_INTERFACE_DEFAULT_CONTROLS.engagementSignalPresent,
    ),
  };
}

export interface DaVinciInterfaceTopologyState extends DaVinciInterfaceControls {
  processorCanConfigureTool: boolean;
  status: "ready" | "calibration-record-missing" | "engagement-unconfirmed" | "incompatible";
}

export function resolveDaVinciInterfaceTopology(
  controls: DaVinciInterfaceControls,
): DaVinciInterfaceTopologyState {
  const processorCanConfigureTool =
    controls.compatibilitySignalPresent &&
    controls.calibrationRecordAvailable &&
    controls.engagementSignalPresent;

  return {
    ...controls,
    processorCanConfigureTool,
    status: !controls.compatibilitySignalPresent
      ? "incompatible"
      : !controls.calibrationRecordAvailable
        ? "calibration-record-missing"
        : !controls.engagementSignalPresent
          ? "engagement-unconfirmed"
          : "ready",
  };
}
