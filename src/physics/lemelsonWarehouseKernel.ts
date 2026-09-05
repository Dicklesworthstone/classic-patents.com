/**
 * US 3,119,501 — Jerome H. Lemelson, Automatic Warehousing System.
 *
 * The issued drawings and claims identify rail travel, a vertically movable
 * carrier, a transverse shuttle, storage bays, photoelectric/marker sensing,
 * and preset counting control. They do not state warehouse dimensions,
 * payload, velocity, motor power, timing, sensor precision, or throughput.
 * This shared kernel therefore supplies a normalized sequence/geometry exhibit
 * and refuses to claim performance or physical-scale simulation.
 */

export interface LemelsonWarehouseControls {
  railAddressFraction: number;
  levelAddressFraction: number;
  shuttleExtensionFraction: number;
  /** 1 makes the source-described automatic address sequence visible. */
  automaticAddressing: number;
}

export const LEMELSON_WAREHOUSE_DEFAULT_CONTROLS: LemelsonWarehouseControls = {
  railAddressFraction: 0.55,
  levelAddressFraction: 0.42,
  shuttleExtensionFraction: 0.32,
  automaticAddressing: 1,
};

export interface LemelsonWarehousePose {
  railAddressFraction: number;
  levelAddressFraction: number;
  shuttleExtensionFraction: number;
  automaticAddressing: boolean;
  carrierX: number;
  carrierY: number;
  shuttleZ: number;
  addressState: "manual display" | "rail address" | "vertical address" | "bay transfer";
  activeClaim: 1 | 2 | 3 | 4 | 5 | 6;
  positionLaw: string;
  refusal: { refused: true; reason: string };
}

function normalized(value: number | undefined, fallback: number): number {
  const number = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.max(0, Math.min(1, number));
}

export function readLemelsonWarehouseControls(
  params: Partial<LemelsonWarehouseControls> | Record<string, number | undefined>,
): LemelsonWarehouseControls {
  const p = params as Record<string, number | undefined>;
  return {
    railAddressFraction: normalized(
      p.railAddressFraction ??
        p.railAddress ??
        p.carrierX ??
        p.railFraction ??
        p.xAddress ??
        p.rail,
      LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.railAddressFraction,
    ),
    levelAddressFraction: normalized(
      p.levelAddressFraction ??
        p.levelAddress ??
        p.carrierY ??
        p.levelFraction ??
        p.yAddress ??
        p.verticalAddress ??
        p.level ??
        p.vertical,
      LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.levelAddressFraction,
    ),
    shuttleExtensionFraction: normalized(
      p.shuttleExtensionFraction ??
        p.shuttleExtension ??
        p.shuttleZ ??
        p.extensionFraction ??
        p.zExtension ??
        p.shuttle ??
        p.extension,
      LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.shuttleExtensionFraction,
    ),
    automaticAddressing: normalized(
      p.automaticAddressing ??
        p.autoAddressing ??
        p.presetAddressing ??
        p.claim1 ??
        p.addressing ??
        p.automaticSequence,
      LEMELSON_WAREHOUSE_DEFAULT_CONTROLS.automaticAddressing,
    ),
  };
}

export function stepLemelsonWarehouseTopology(
  params: Partial<LemelsonWarehouseControls> | Record<string, number | undefined>,
): LemelsonWarehousePose {
  const controls = readLemelsonWarehouseControls(params);
  const automaticAddressing = controls.automaticAddressing >= 0.5;
  const addressState = !automaticAddressing
    ? "manual display"
    : controls.shuttleExtensionFraction >= 0.16
      ? "bay transfer"
      : controls.levelAddressFraction >= 0.08
        ? "vertical address"
        : "rail address";
  const activeClaim: LemelsonWarehousePose["activeClaim"] =
    addressState === "bay transfer" ? 2 : addressState === "vertical address" ? 3 : 1;
  return {
    ...controls,
    automaticAddressing,
    carrierX: controls.railAddressFraction,
    carrierY: controls.levelAddressFraction,
    shuttleZ: controls.shuttleExtensionFraction,
    addressState,
    activeClaim,
    positionLaw:
      "normalized carrier pose = f(rail address, vertical address, transverse shuttle extension)",
    refusal: {
      refused: true,
      reason:
        "US 3,119,501 names rails, carrier, shuttle, sensing, and counting-control relationships but does not provide warehouse dimensions, payload, speed, motor, timing, or sensor-precision values. This shared kernel reports normalized topology and sequence only.",
    },
  };
}
