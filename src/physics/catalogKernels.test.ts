import { describe, expect, test } from "bun:test";
import {
  bardeenHoleStream,
  bardeenLoadLine,
  edisonSchematicGlowOpacity,
  marconiMastHeightFromHz,
  mccormickReelAngleDeg,
  pasteurMicrobeSvg,
  phonographAxialTravelMm,
  pistonSvgDisplacement,
  rpmToOmega,
  sliderStrokeSvg,
  stepBardeenTransistor,
  stepBellTelephone,
  stepColtRevolver,
  stepCorlissEngine,
  stepDaimlerEngine,
  stepDavenportMotor,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHollerithTabulating,
  stepHyattCelluloid,
  stepKevlarContinuum,
  stepLincolnBuoy,
  stepMarconiRadio,
  stepMaximMachineGun,
  stepMcCormickReaper,
  stepMorseTelegraph,
  stepNobelDynamite,
  stepNoyceIC,
  stepOttoEngine,
  stepParsonsTurbine,
  stepPasteurFermentation,
  stepPeltonWheel,
  stepSpencerMicrowave,
  stepThomsonWelding,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
  voltsToKv,
} from "./catalogKernels";

describe("Catalog Kernels & Shared SI Stepping Functions", () => {
  test("unit conversions and geometric helpers maintain exact relations", () => {
    const { omegaRadPerS, omegaDegPerS } = rpmToOmega(60);
    expect(omegaRadPerS).toBeCloseTo(Math.PI * 2, 2);
    expect(omegaDegPerS).toBe(360);

    expect(voltsToKv(1500)).toBe(1.5);
    expect(voltsToKv(0)).toBe(0);

    // Piston displacement: 0 at 0 deg, 2*stroke at 180 deg
    expect(pistonSvgDisplacement(0, 50)).toBe(0);
    expect(pistonSvgDisplacement(180, 50)).toBe(100);

    // Slider stroke: 0 at 0 deg, stroke at 90 deg
    expect(sliderStrokeSvg(0, 40)).toBe(0);
    expect(sliderStrokeSvg(90, 40)).toBe(40);

    // Edison schematic glow bounded in [0.2, 0.9]
    expect(edisonSchematicGlowOpacity(1500)).toBe(0.2);
    expect(edisonSchematicGlowOpacity(2700)).toBe(0.9);
  });

  test("Pelton wheel computes jet velocity and turbine efficiency", () => {
    const res = stepPeltonWheel({ headMeters: 450, runnerRpm: 600 });
    expect(res.jetVelocityMps).toBeGreaterThan(80);
    expect(res.etaPct).toBeGreaterThanOrEqual(40);
    expect(res.etaPct).toBeLessThanOrEqual(100);
    expect(res.shaftPowerKw).toBeGreaterThan(0);
    expect(res.runnerSvgR).toBe(75);
    expect(res.bucketCount).toBe(12);
  });

  test("Gramme dynamo computes 36-junction continuous EMF index", () => {
    const res = stepGrammeDynamo({ shaftRate: 1.0 });
    expect(res.printedJunctionCount).toBe(36);
    expect(res.collectionContinuityPct).toBeGreaterThan(95);
    expect(res.inducedEmfIndex).toBe(100);
    expect(res.torusSvgR).toBe(100);
    expect(res.junctionInnerSvgR).toBe(35);
    expect(res.junctionOuterSvgR).toBe(48);
  });

  test("Otto four-stroke engine computes thermodynamic air-standard cycle", () => {
    const res = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    expect(res.brakeHorsepower).toBeGreaterThan(0);
    expect(res.thermalEfficiencyPct).toBeGreaterThan(40);
    expect(res.peakFiringBar).toBeGreaterThan(res.peakCompressionBar);
    expect(res.flywheelSvgR).toBe(80);
  });

  test("Parsons steam turbine computes multi-stage expansion enthalpy", () => {
    const res = stepParsonsTurbine({ rotorRpm: 3000, inletPressurePsi: 180 });
    expect(res.shaftPowerKw).toBeGreaterThan(0);
    expect(res.stageCount).toBe(48);
    expect(res.enthalpyKjKg).toBeGreaterThan(0);
    expect(res.stageRingSvgCount).toBe(22);
    expect(res.stageSvgOriginX).toBe(135);
    expect(res.stageSvgPitch).toBe(16);
  });

  test("Ericsson screw propeller keeps source facts distinct from its illustrative display model", () => {
    const res = stepEricssonPropeller({ shaftRpm: 120, bladePitchAngleDeg: 35 });
    expect(res.isIllustrativeDisplayModel).toBe(true);
    expect(res.sourceSpiralAdvanceDiameters).toBe(3);
    expect(res.sourceCasingClearanceInches).toBe(0.125);
    expect(res.bladeSvgRx).toBe(10);
    expect(res.forwardBladeSvgRy).toBe(50);
    expect(res.aftBladeSvgRy).toBe(45);
  });

  test("DeLaval centrifugal separator computes radial g-force and separation efficiency", () => {
    const res = stepDeLavalSeparator({ bowlRpm: 6500, rawMilkFlowLph: 300 });
    expect(res.gForce).toBeGreaterThan(1000);
    expect(res.fatYieldPct).toBeGreaterThan(85);
  });

  test("Nobel dynamite computes detonation velocity and shock impulse", () => {
    const res = stepNobelDynamite({ ngConcentrationPct: 75, capEnergyJoules: 1.2 });
    expect(res.detonationVelocityMps).toBeGreaterThan(5000);
    expect(res.blastOverpressureMpa).toBeGreaterThan(4000);
    expect(res.isInitiated).toBe(true);
  });

  test("Whitney cotton gin computes tooth snagging frequency and lint separation rate", () => {
    const res = stepWhitneyCottonGin({ crankRpm: 180, seedGridClearance: 3.2 });
    expect(res.sawRpm).toBeGreaterThan(180);
    expect(res.brushRpm).toBeGreaterThan(res.sawRpm);
    expect(res.outputLbsPerDay).toBeGreaterThan(0);
    expect(res.sawSvgR).toBe(65);
    expect(res.sawToothOuterSvgR).toBe(78);
    expect(res.brushSvgR).toBe(55);
    expect(res.bristleOuterSvgR).toBe(78);
    expect(res.sawToothCount).toBe(16);
    expect(res.bristleCount).toBe(24);
  });

  test("McCormick reaper computes sickle bar reciprocating frequency and harvest rate", () => {
    const res = stepMcCormickReaper({ forwardSpeedMph: 2.5 });
    expect(res.cutterHz).toBeGreaterThan(0);
    expect(res.groundSpeedMps).toBeGreaterThan(0);
    expect(res.reelToCutterRatio).toBeCloseTo(res.reelOmegaRadPerS / res.cutterOmegaRadPerS, 5);
    expect(mccormickReelAngleDeg(Math.PI, res.reelToCutterRatio)).toBeGreaterThan(0);
  });

  test("Davenport electric motor computes torque and rotational speed from battery electromotive force", () => {
    const res = stepDavenportMotor({ batteryVoltage: 12, loadTorque: 0.8 });
    expect(res.armatureCurrentA).toBeGreaterThan(0);
    expect(res.shaftRpm).toBeGreaterThan(0);
  });

  test("Corliss steam engine computes variable cutoff expansion and indicated horsepower", () => {
    const res = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    expect(res.indicatedHp).toBeGreaterThan(0);
    expect(res.expansionRatio).toBe(4);
  });

  test("Gatling gun computes cyclic fire rate and barrel cluster rotation", () => {
    const res = stepGatlingGun({ crankRpm: 60, barrelCount: 6 });
    expect(res.roundsPerMin).toBe(360);
    expect(res.muzzleEnergyJoules).toBe(1850);
  });

  test("Hyatt celluloid computes hydraulic consolidation and camphor plasticization", () => {
    const res = stepHyattCelluloid({ steamTempC: 95, hydraulicPressureMpa: 10 });
    expect(res.viscosityPaS).toBeGreaterThan(0);
    expect(res.isMelted).toBe(true);
  });

  test("Pasteur fermentation computes anaerobic ethanol conversion and microbial kill kinetics", () => {
    const res = stepPasteurFermentation({
      pasteurizationTempC: 58,
      holdTimeMin: 20,
      wortTempC: 22,
    });
    expect(res.logReduction).toBeGreaterThan(4);
    expect(res.alcoholAbvPct).toBeGreaterThan(0);
    expect(res.microbeCount).toBe(14);
    expect(res.microbeWobbleOmega).toBe(3);
    const microbe = pasteurMicrobeSvg(0, 0);
    expect(microbe.xPos).toBe(230);
    expect(microbe.yPos).toBe(140);
  });

  test("Glidden barbed wire computes tensile yield and barb lock security", () => {
    const res = stepGliddenBarbedWire({ wireTensionN: 650, twistsPerFoot: 5 });
    expect(res.tensileStrengthLbs).toBe(950);
    expect(res.isLocked).toBe(true);
  });

  test("Edison phonograph computes groove tracking pitch and diaphragm acoustic amplitude", () => {
    const res = stepEdisonPhonograph({ mandrelRpm: 60, voiceVolumeDb: 75 });
    expect(res.surfaceSpeedMps).toBeGreaterThan(0);
    expect(res.grooveDepthMicrons).toBeGreaterThan(0);
    expect(phonographAxialTravelMm(60, 2)).toBeGreaterThan(0);
  });

  test("Thomson welding computes secondary current heating, interface temperature, and upset forge", () => {
    const res = stepThomsonWelding({ weldCurrentAmps: 5500, clampPressureMpa: 35 });
    expect(res.interfaceTempC).toBeGreaterThan(800);
    expect(res.isForged).toBe(true);
  });

  test("Zeppelin airship computes aerostatic lift, compartmental displacement, and trim moments", () => {
    const res = stepZeppelinAirship({ gasInflation: 95, flightAlt: 300, flightSpeedKnots: 28 });
    expect(res.grossLiftKg).toBeGreaterThan(10000);
    expect(res.netLiftKn).toBeDefined();
    expect(res.gasCellCount).toBe(17);
    expect(res.gasCellSvgOriginX).toBe(-215);
    expect(res.gasCellSvgPitch).toBe(27);
  });

  test("Daimler internal combustion engine computes hot-tube ignition timing and brake power", () => {
    const res = stepDaimlerEngine({ engineRpm: 750, hotTubeTempC: 850 });
    expect(res.brakeHorsepower).toBeGreaterThan(0);
    expect(res.isRunning).toBe(true);
  });

  test("Hollerith tabulating machine computes pin-brush electrical circuit matrix and tally count", () => {
    const res = stepHollerithTabulating({ cardsPerMin: 60, supplyVoltageV: 12 });
    expect(res.solenoidForceN).toBeGreaterThan(0);
    expect(res.cycleTimeMs).toBe(1000);
  });

  test("Noyce planar integrated circuit computes junction isolation and oxide passivation", () => {
    const res = stepNoyceIC({ reverseBias: 5.0, oxideThickness: 0.5, clockFrequencyMhz: 10 });
    expect(res.breakdownMarginV).toBeGreaterThan(10);
    expect(res.depletionWidthUm).toBeGreaterThan(0);
  });

  test("Edison incandescent bulb computes Stefan-Boltzmann radiation, filament temperature, and lumen output", () => {
    const res = stepEdisonBulb({ voltage: 110, filamentLength: 22 });
    expect(res.filamentTempK).toBeGreaterThan(1800);
    expect(res.radiantWatts).toBeGreaterThan(0);
  });

  test("Bell telephone computes liquid transmitter resistance modulation and acoustic current", () => {
    const res = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
    });
    expect(res.modulatedMa).toBeGreaterThan(0);
    expect(res.currentBaselineMa).toBeGreaterThan(0);
  });

  test("Morse telegraph computes loop line resistance, electromagnet force, and sounder latch", () => {
    const res = stepMorseTelegraph({
      currentMa: 40,
      wireTurns: 1200,
      lineVoltageV: 24,
      lineLengthMiles: 44,
    });
    expect(res.loopCurrentMa).toBeGreaterThan(0);
    expect(res.magneticForceN).toBeGreaterThan(0);
  });

  test("Engelbart computer mouse computes dual orthogonal encoder resolution and coordinate travel", () => {
    const res = stepEngelbartMouse({ mouseSpeed: 350, wheelRadius: 10 });
    expect(res.dpi).toBeGreaterThan(0);
    expect(res.omegaRadPerS).toBeGreaterThan(0);
  });

  test("Wozniak Apple II computes dynamic RAM refresh, crystal oscillator timing, and video scanout", () => {
    const res = stepWozniakApple({ crystalFreq: 14.318, ramCapacityKb: 48 });
    expect(res.cpuClockMhz).toBeCloseTo(1.02, 2);
    expect(res.cpuDutyPct).toBe(100);
  });

  test("Spencer microwave cavity computes magnetron relativistic gyro-frequency and Poynting vector", () => {
    const res = stepSpencerMicrowave(2.2, 1450, 800);
    expect(res.microwaveFreqMhz).toBe(2450);
    expect(res.isOscillating).toBe(true);
  });

  test("Kwolek Kevlar continuum computes anisotropic liquid crystal alignment and bullet arrest", () => {
    const res = stepKevlarContinuum(6.5, 450, 30);
    expect(res.alignmentPct).toBeGreaterThan(70);
    expect(res.tensileStrengthGpa).toBeGreaterThan(2);
  });

  test("Bardeen point-contact transistor computes current gain alpha, hole diffusion, and load line", () => {
    const res = stepBardeenTransistor(1.5, -40, 50);
    expect(res.currentGainAlpha).toBeGreaterThan(1);
    expect(res.powerGainDb).toBeGreaterThan(0);
    const loadLine = bardeenLoadLine(res.currentGainAlpha);
    expect(loadLine.voltageGain).toBeGreaterThan(0);
  });

  test("Marconi radio computes quarter-wave antenna radiation resistance and resonant frequency", () => {
    const res = stepMarconiRadio(88, 10, 28);
    expect(res.radiationResistanceOhms).toBe(36.56);
    expect(res.resonantFreqKhz).toBeGreaterThan(0);
    expect(marconiMastHeightFromHz(1000000)).toBeGreaterThan(0);
  });

  test("Colt revolver computes chamber cylinder index and lock bolt ratchet engagement", () => {
    const res = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 45 });
    expect(res.indexAngleDeg).toBe(72);
    expect(res.isLocked).toBe(true);
  });

  test("Goodyear vulcanized rubber computes crosslink density, tensile modulus, and elastic recovery", () => {
    const res = stepGoodyearRubber(145, 8, 30);
    expect(res.crossLinkDensity).toBeGreaterThan(0.5);
    expect(res.tensileStrengthPsi).toBeGreaterThan(1000);
  });

  test("Einstein-Szilard refrigerator computes three-fluid bubble pump thermosyphon circulation", () => {
    const res = stepEinsteinRefrigerator({ heatInput: 220, totalPressure: 15.0 });
    expect(res.coolingWatts).toBeGreaterThan(0);
    expect(res.cop).toBeGreaterThan(0);
  });

  test("Lincoln buoyant air chambers computes hydrostatic buoyancy lift and draft reduction", () => {
    const res = stepLincolnBuoy({ inflationPct: 75, weightTons: 380 });
    expect(res.liftKn).toBeGreaterThan(0);
    expect(res.draftReductionFt).toBeGreaterThan(0);
  });

  test("Maxim recoil machine gun computes muzzle gas recoil impulse and automatic toggle cycling", () => {
    const res = stepMaximMachineGun({ firingRateRpm: 600, recoilStrokeMm: 19 });
    expect(res.recoilVelocityMps).toBeGreaterThan(0);
    expect(res.toggleUnlockForceN).toBeGreaterThan(0);
  });
});
