import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  stepEdisonBulb,
  stepGoodyearRubber,
  stepMarconiRadio,
  stepNoyceIC,
} from "./catalogKernels";
import { coupleEdgesFor } from "./coupleGraph";
import {
  autodiffDerivatives,
  bardeenPointPotential,
  digestKind,
  edisonFilamentHeat,
  fftPowerSpectrum,
  flowcert,
  goodyearVulcanizationField,
  grayScottFrames,
  HeatField,
  hodgeDecomposition,
  hostStateDigest,
  liveFftPowerSpectrum,
  marconiSparkSpectrum,
  navierStokesCavity,
  noyceJunctionPotential,
  parseTrussCertificate,
  peltonCavityFlow,
  poisson2d,
  teslaStatorHodge,
  trussPath,
  wrightStayWireTruss,
} from "./deepWasm";
import { computePortHamiltonianEnergy } from "./energyLedger";
import {
  computeCarrierSprayField,
  computeFarnsworthRasterField,
  computeNoyceDepletionField,
  computeSpencerCavityField,
  computeTeslaRotatingBField,
  sampleThermalColormap,
  writeColormappedField,
} from "./fieldTextures";
import { extraWasmFns, genericKernelSource } from "./genericWasm";
import { stepOtisElevator } from "./machineKernels";
import { stepTeslaMotorFig9 } from "./teslaKernel";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

describe("P7 host-pumped FrankenSim crate bindings", () => {
  test("SSR stays unloaded and extra WASM fns stay null (no 4.9 MB kitchen-sink)", () => {
    expect(genericKernelSource()).toBe("unloaded");
    expect(extraWasmFns.trussPath).toBeNull();
    expect(extraWasmFns.hodgeDecomposition).toBeNull();
    expect(extraWasmFns.fftPowerSpectrum).toBeNull();
    expect(extraWasmFns.grayScottFrames).toBeNull();
    expect(extraWasmFns.poisson2d).toBeNull();
    expect(extraWasmFns.navierStokesCavity).toBeNull();
    expect(extraWasmFns.autodiffDerivatives).toBeNull();
  });

  test("host digest is never prefixed blake3", () => {
    const d = hostStateDigest([1, 2, 3]);
    expect(d.startsWith("host:")).toBe(true);
    expect(digestKind(d)).toBe("host");
    const ledger = computePortHamiltonianEnergy("us-821393-wright-flyer", { airspeedKts: 28 });
    expect(ledger.digestKind).toBe("host");
    expect(ledger.stateDigest.startsWith("blake3:")).toBe(false);
  });

  test("poisson2d is n*n finite", () => {
    const n = 12;
    const field = poisson2d(n);
    expect(field.length).toBe(n * n);
    expect(Number.isFinite(field[0])).toBe(true);
  });

  test("grayScottFrames is frames*n*n and stays in [0, 1.5]", () => {
    const n = 16;
    const frames = 3;
    const gs = grayScottFrames(n, frames, 0.04, 0.06);
    expect(gs.length).toBe(frames * n * n);
    for (const v of gs) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1.5);
    }
  });

  test("fft power spectrum has n/2+1 bins and a peak above DC", () => {
    const spec = fftPowerSpectrum(64, 1);
    expect(spec.length).toBe(33);
    let peak = 0;
    for (let k = 1; k < spec.length; k++) peak = Math.max(peak, spec[k] ?? 0);
    expect(peak).toBeGreaterThan(spec[0] ?? 0);
    const live = liveFftPowerSpectrum(new Float64Array([1, 0, -1, 0, 1, 0, -1, 0]));
    expect(live.length).toBeGreaterThan(1);
  });

  test("autodiffDerivatives writes [x, f, f', f''] and f'(0) is 3", () => {
    const buf = autodiffDerivatives(-1, 1, 5);
    expect(buf.length).toBe(20);
    expect(buf[8]).toBeCloseTo(0, 8);
    expect(buf[10]).toBeCloseTo(3, 5);
  });

  test("hodgeDecomposition annulus has b1>=1 and 6E edge records", () => {
    const buf = hodgeDecomposition(1);
    expect(buf[0]).toBe(1);
    expect(buf[2]).toBeGreaterThanOrEqual(1);
    const e = buf[11] ?? 0;
    expect(buf.length).toBe(12 + 6 * e);
    expect((buf[10] ?? 0) > 0).toBe(true);
  });

  test("navierStokesCavity layout is [G, F, F*2*G*G]", () => {
    const buf = navierStokesCavity(4, 2, 40, 2);
    expect(buf[0]).toBe(20);
    expect(buf[1]).toBe(2);
    expect(buf.length).toBe(2 + 2 * 2 * 20 * 20);
  });

  test("trussPath header parses and Wright stay-wires load the high-AoA bay", () => {
    const buf = trussPath(4, 2, 1e-4);
    const cert = parseTrussCertificate(buf);
    expect(cert.memberCount).toBeGreaterThan(0);
    expect(cert.converged).toBe(true);
    const pos = wrightStayWireTruss(2200, 12);
    const neg = wrightStayWireTruss(2200, -12);
    expect(pos.trussCertificate).toBe("Certified");
    expect(pos.trussRefused).toBe(false);
    expect(pos.leftBayTension).toBeGreaterThan(0);
    expect(neg.rightBayTension).toBeGreaterThan(0);
  });

  test("flowcert writes a 9-point campaign header", () => {
    const buf = flowcert(800, 0.05);
    expect(buf[0]).toBe(9);
    expect(buf.length).toBeGreaterThanOrEqual(10 + 90);
  });

  test("control-driven seats follow live sliders, not a canned tape index", () => {
    const hotField = new HeatField(16);
    const coldField = new HeatField(16);
    for (let i = 0; i < 12; i++) {
      hotField.step(0.05, { su: 0.5, sv: 0.45, amplitude: 2.4 });
      coldField.step(0.05, { su: 0.5, sv: 0.45, amplitude: 0.5 });
    }
    expect(hotField.sample(0.5, 0.45)).toBeGreaterThan(coldField.sample(0.5, 0.45));
    const hot = edisonFilamentHeat(130, 0.05);
    expect(hot.heatSource).toBe("ts-fallback");
    const spark = marconiSparkSpectrum(0.85, 10);
    expect(spark.sparkOddHarmonicPower).toBeGreaterThan(0);
    const gs = goodyearVulcanizationField(8, 145);
    expect(gs.grayScottFeed).toBeGreaterThan(0);
    const n = noyceJunctionPotential(8);
    expect(n.poissonPeak).toBeGreaterThan(0);
    const b = bardeenPointPotential(2, -40);
    expect(Number.isFinite(b.poissonCenter)).toBe(true);
    const jet = peltonCavityFlow(450);
    expect(jet.cavityMeanSpeed).toBeGreaterThanOrEqual(0);
  });

  test("kernels emit P7 seats on the shared step", () => {
    const wright = stepWrightFlyerSi(
      readWrightControls({ airspeed: 28, wingWarp: 10, coupled: 1 }),
    );
    expect(wright.trussCertificate).toBe("Certified");
    expect(wright.cavityMeanSpeed).toBeGreaterThanOrEqual(0);
    const tesla = stepTeslaMotorFig9(60);
    expect(tesla.hodgeHarmonicEnergy).toBeGreaterThan(0);
    expect(teslaStatorHodge(2, 1).hodgeEdgeCount).toBeGreaterThan(0);
    expect(stepEdisonBulb({ voltage: 110 }).filamentHeatSample).toBeGreaterThan(0);
    expect(stepNoyceIC({ reverseBias: 5 }).poissonPeak).toBeGreaterThan(0);
    expect(stepGoodyearRubber(145, 8, 30).grayScottMeanV).toBeGreaterThanOrEqual(0);
    expect(stepMarconiRadio(88, 10, 28).sparkOddHarmonicPower).toBeGreaterThan(0);
    const otis = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 100 });
    expect(otis.cableCertificate).toBe("Certified");
    const snapped = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 0 });
    expect(snapped.cableRefused).toBe(true);
  });

  test("couple edges name warp→yaw, B→shaft, I²R→radiation as ts-fallback", () => {
    const w = coupleEdgesFor("us-821393-wright-flyer", { wingWarp: 8, airspeed: 28, coupled: 1 });
    expect(w[0]?.from).toBe("wing warp");
    expect(w[0]?.to).toBe("adverse yaw");
    expect(w[0]?.source).toBe("ts-fallback");
    const t = coupleEdgesFor("us-381968-tesla-motor", { frequency: 60 });
    expect(t[0]?.from).toBe("stator B");
    const e = coupleEdgesFor("us-223898-edison-lightbulb", { voltage: 110 });
    expect(e[0]?.from).toBe("I²R");
    expect(e[0]?.to).toBe("radiation");
    expect(coupleEdgesFor("us-586193-marconi-radio", { sparkGapMm: 10 })[0]?.from).toBe(
      "spark train",
    );
    expect(coupleEdgesFor("us-233692-pelton-water-wheel", { headMeters: 450 })[0]?.from).toBe(
      "head",
    );
  });

  test("3D models drain kernel seats instead of indexing crate tapes with timeSec * 8", () => {
    const models = [
      "edisonBulbModel.ts",
      "bellTelephoneModel.ts",
      "nobelDynamiteModel.ts",
      "edisonPhonographModel.ts",
      "morseTelegraphModel.ts",
      "bardeenTransistorModel.ts",
    ];
    for (const name of models) {
      const src = readFileSync(
        join(import.meta.dir, "../components/patents/visuals/three", name),
        "utf8",
      );
      expect(src).not.toContain("timeSec * 8");
      expect(src).not.toContain("_timeSec * 8");
    }
  });

  test("field textures write finite grids for Tesla, Noyce, Farnsworth, Spencer", () => {
    const tesla = computeTeslaRotatingBField(0.4, 2, 16);
    expect(tesla.length).toBe(256);
    let max = 0;
    for (const v of tesla) max = Math.max(max, v);
    expect(max).toBeGreaterThan(0);
    expect(computeNoyceDepletionField(5, 16).length).toBe(256);
    expect(computeFarnsworthRasterField(0.4, 16).length).toBe(256);
    expect(computeSpencerCavityField(800, true, 0.2, 16).length).toBe(256);
    expect(computeCarrierSprayField(15000, 16).length).toBe(256);
    const rgba = new Uint8Array(16 * 16 * 4);
    writeColormappedField(rgba, tesla, 16, 16);
    expect(rgba[3]).toBe(255);
    const [r] = sampleThermalColormap(1);
    expect(r).toBe(1);
  });
});
