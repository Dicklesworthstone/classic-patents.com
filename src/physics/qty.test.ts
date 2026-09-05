import { describe, expect, test } from "bun:test";
import {
  areDimensionsEqual,
  assertPortValue,
  createPortContract,
  DIM_CURRENT,
  DIM_DIMENSIONLESS,
  DIM_ENERGY,
  DIM_ENERGY_DENSITY,
  DIM_FORCE,
  DIM_LENGTH,
  DIM_MASS,
  DIM_POWER,
  DIM_PRESSURE,
  DIM_TIME,
  DIM_TORQUE,
  DIM_VELOCITY,
  DIM_VOLTAGE,
  DimensionContractError,
  divideDimensions,
  formatDimensionVector,
  isDimensionless,
  multiplyDimensions,
  parseUnitToDimension,
  powerDimensions,
  qtyDimension,
  validatePortValue,
} from "./qty";

describe("SI Unit Dimension Algebra and Port Contracts", () => {
  test("maintains backwards compatibility for qtyDimension coarse tags", () => {
    expect(qtyDimension("N")).toBe("ML/T²");
    expect(qtyDimension("W")).toBe("ML²/T³");
    expect(qtyDimension("J")).toBe("ML²/T²");
    expect(qtyDimension("V")).toBe("ML²/IT³");
    expect(qtyDimension("A")).toBe("I");
    expect(qtyDimension("Ω")).toBe("ML²/I²T³");
    expect(qtyDimension("m/s")).toBe("L/T");
    expect(qtyDimension("Pa")).toBe("M/LT²");
    expect(qtyDimension("K")).toBe("Θ");
    expect(qtyDimension("s")).toBe("T");
    expect(qtyDimension("normalized")).toBe("1");
    expect(qtyDimension("fraction")).toBe("1");
    expect(qtyDimension("dB")).toBe("1");
  });

  test("parses physical units into exact 6D SI dimension vectors [L, M, T, Θ, I, N]", () => {
    expect(parseUnitToDimension("m")).toEqual(DIM_LENGTH);
    expect(parseUnitToDimension("kg")).toEqual(DIM_MASS);
    expect(parseUnitToDimension("s")).toEqual(DIM_TIME);
    expect(parseUnitToDimension("N")).toEqual(DIM_FORCE);
    expect(parseUnitToDimension("W")).toEqual(DIM_POWER);
    expect(parseUnitToDimension("kW")).toEqual(DIM_POWER);
    expect(parseUnitToDimension("J")).toEqual(DIM_ENERGY);
    expect(parseUnitToDimension("V")).toEqual(DIM_VOLTAGE);
    expect(parseUnitToDimension("A")).toEqual(DIM_CURRENT);
    expect(parseUnitToDimension("Pa")).toEqual(DIM_PRESSURE);
    expect(parseUnitToDimension("psi")).toEqual(DIM_PRESSURE);
    expect(parseUnitToDimension("m/s")).toEqual(DIM_VELOCITY);
    expect(parseUnitToDimension("mph")).toEqual(DIM_VELOCITY);
    expect(parseUnitToDimension("N·m")).toEqual(DIM_TORQUE);
    expect(parseUnitToDimension("J/m³")).toEqual(DIM_ENERGY_DENSITY);
  });

  test("preserves normalized topology and non-physical flags as strictly dimensionless", () => {
    for (const unit of [
      "",
      "1",
      "dimensionless",
      "normalized",
      "fraction",
      "ratio",
      "state",
      "flag",
      "mode",
      "regime",
      "count",
      "pct",
      "%",
      "deg",
      "rad",
    ]) {
      const dim = parseUnitToDimension(unit);
      expect(isDimensionless(dim)).toBe(true);
      expect(areDimensionsEqual(dim, DIM_DIMENSIONLESS)).toBe(true);
      expect(formatDimensionVector(dim)).toBe("1");
    }
  });

  test("computes correct dimension multiplication, division, and power laws", () => {
    // Force * Length = Energy (Work): N * m = J
    const workDim = multiplyDimensions(DIM_FORCE, DIM_LENGTH);
    expect(areDimensionsEqual(workDim, DIM_ENERGY)).toBe(true);

    // Energy / Time = Power: J / s = W
    const powerDim = divideDimensions(DIM_ENERGY, DIM_TIME);
    expect(areDimensionsEqual(powerDim, DIM_POWER)).toBe(true);

    // Force / Area = Pressure: N / m^2 = Pa
    const pressureDim = divideDimensions(DIM_FORCE, [2, 0, 0, 0, 0, 0]);
    expect(areDimensionsEqual(pressureDim, DIM_PRESSURE)).toBe(true);

    // Voltage * Current = Power: V * A = W
    const viDim = multiplyDimensions(DIM_VOLTAGE, DIM_CURRENT);
    expect(areDimensionsEqual(viDim, DIM_POWER)).toBe(true);

    // (Length)^3 = Volume
    expect(areDimensionsEqual(powerDimensions(DIM_LENGTH, 3), [3, 0, 0, 0, 0, 0])).toBe(true);
  });

  test("creates valid port contracts for physical roles and topology", () => {
    const powerPort = createPortContract("shaftPower", "W", "power-out");
    expect(powerPort.portId).toBe("shaftPower");
    expect(powerPort.isDimensionless).toBe(false);
    expect(areDimensionsEqual(powerPort.expectedDimension, DIM_POWER)).toBe(true);

    const topologyPort = createPortContract("rackAdvance", "normalized", "topology");
    expect(topologyPort.portId).toBe("rackAdvance");
    expect(topologyPort.isDimensionless).toBe(true);
    expect(areDimensionsEqual(topologyPort.expectedDimension, DIM_DIMENSIONLESS)).toBe(true);

    const energyDensityPort = createPortContract("elasticStrain", "J/m³", "energy-density");
    expect(areDimensionsEqual(energyDensityPort.expectedDimension, DIM_ENERGY_DENSITY)).toBe(true);
  });

  test("catches deliberate unit mismatch at contract creation time", () => {
    // Attempting to declare a power port with energy units (J)
    expect(() => createPortContract("invalidPower", "J", "power-in")).toThrow(
      DimensionContractError,
    );

    // Attempting to declare a topology port with force units (N)
    expect(() => createPortContract("invalidTopology", "N", "topology")).toThrow(
      DimensionContractError,
    );
  });

  test("validates runtime port values and catches deliberate unit mismatches", () => {
    const powerPort = createPortContract("heatInput", "W", "power-in");

    // Valid runtime check
    const validRes = validatePortValue(powerPort, 1200, "W");
    expect(validRes.valid).toBe(true);
    expect(validRes.refusalReason).toBeUndefined();

    // Valid with prefix/scale (kW has same dimension ML²/T³)
    const validKw = validatePortValue(powerPort, 1.2, "kW");
    expect(validKw.valid).toBe(true);

    // Mismatched unit: passing Energy (J) to Power (W) port
    const mismatchRes = validatePortValue(powerPort, 1200, "J");
    expect(mismatchRes.valid).toBe(false);
    expect(mismatchRes.refusalReason).toContain("Dimension mismatch");

    // Non-finite value check
    const nanRes = validatePortValue(powerPort, Number.NaN, "W");
    expect(nanRes.valid).toBe(false);
    expect(nanRes.refusalReason).toContain("Non-finite");
  });

  test("forbids normalized topology ports from masquerading as physical SI quantities", () => {
    const topoPort = createPortContract("slideFraction", "fraction", "topology");

    // Valid dimensionless evaluation
    expect(validatePortValue(topoPort, 0.5, "normalized").valid).toBe(true);
    expect(validatePortValue(topoPort, 0.75, "1").valid).toBe(true);

    // Maliciously passing Newtons or Watts as topology
    const forgedNewton = validatePortValue(topoPort, 50, "N");
    expect(forgedNewton.valid).toBe(false);
    expect(forgedNewton.refusalReason).toContain("Topology port");
    expect(forgedNewton.refusalReason).toContain("must be dimensionless");

    const forgedWatt = validatePortValue(topoPort, 100, "W");
    expect(forgedWatt.valid).toBe(false);
    expect(forgedWatt.refusalReason).toContain("must be dimensionless");
  });

  test("assertPortValue throws typed DimensionContractError on violation", () => {
    const port = createPortContract("lineVoltage", "V", "effort");
    expect(() => assertPortValue(port, 110, "V")).not.toThrow();
    expect(() => assertPortValue(port, 110, "A")).toThrow(DimensionContractError);
  });
});
