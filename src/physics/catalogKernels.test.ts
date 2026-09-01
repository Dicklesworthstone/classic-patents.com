import { describe, expect, test } from "bun:test";
import {
  BARDEEN_HOLE_RESET_PAD,
  BARDEEN_HOLE_WRAP_PAD,
  bardeenHoleStream,
  bardeenLoadLine,
  bardeenSchematicDie,
  bellScopeSample,
  bellWaveProgress,
  coltNextChamber,
  coltSchematicTrigger,
  corlissConnectingRod,
  corlissSchematicValve,
  davenportPolarityReversed,
  davenportSchematicArmature,
  degToRad,
  delavalSchematicDiscY,
  edisonFoilGrooveX,
  edisonLeadScrewThreadX,
  edisonSchematicGlowOpacity,
  edisonSchematicGrooveX,
  edisonSchematicTerminal,
  einsteinFluidSign,
  einsteinSchematicVessel,
  engelbartSchematicWheel,
  farnsworthBeamFrac,
  fourStrokeCycle,
  fourStrokeIndexFromRad,
  gatlingMuzzleFlash,
  gatlingSchematicBarrelY,
  gliddenSchematicSpurX,
  goddardSchematicStack,
  goodyearChainPost,
  goodyearSchematicCrosslink,
  goodyearSchematicLink,
  goodyearSchematicStrand,
  goodyearUncoilFactor,
  grammeCoil,
  grammeFluxRadius,
  grammeJunctionRod,
  grammeSchematicBrush,
  grammeSchematicJunction,
  hollerithCupSvg,
  hollerithSchematicDialX,
  hollerithSchematicPinX,
  hyattPolymerSvg,
  hyattSchematicMold,
  hyattSchematicRam,
  kevlarChainBond,
  kevlarChainPath,
  kevlarSchematicBond,
  kevlarSchematicLattice,
  lincolnInflationNorm,
  lincolnSchematicChamber,
  marconiMastHeightFromHz,
  mccormickCrankPinSvg,
  mccormickFaceSickleX,
  mccormickGrainStemX,
  mccormickGuardX,
  mccormickReelAngleDeg,
  mccormickSchematicReelArm,
  mccormickSchematicSickleX,
  morseElectronLaneZ,
  morseSchematicInstrument,
  nobelKieselguhrSvg,
  nobelSchematicKieselguhr,
  noyceSchematicContactX,
  noyceSchematicJunction,
  ottoConnectingRod,
  ottoStrokePhase,
  parsonsIsRotor,
  parsonsStageHeight,
  peltonSchematicBucket,
  phonographAxialTravelMm,
  pistonSvgDisplacement,
  rpmToOmega,
  sliderStrokeSvg,
  spencerPopcornSvg,
  spencerSchematicCavity,
  stepBaekelandBakelite,
  stepBardeenTransistor,
  stepBellTelephone,
  stepBoyleSmithCcd,
  stepCarlsonElectrophotography,
  stepColtRevolver,
  stepCorlissEngine,
  stepDavenportMotor,
  stepDeForestAudion,
  stepDeLavalSeparator,
  stepEdisonBulb,
  stepEdisonIndicator,
  stepEdisonPhonograph,
  stepEinsteinRefrigerator,
  stepEngelbartMouse,
  stepEricssonPropeller,
  stepFessendenWireless,
  stepGatlingGun,
  stepGliddenBarbedWire,
  stepGoodyearRubber,
  stepGrammeDynamo,
  stepHaberAmmonia,
  stepHallAluminium,
  stepHewittMercuryLamp,
  stepHollerithTabulating,
  stepHyattCelluloid,
  stepKevlarContinuum,
  stepKilbyIntegratedCircuit,
  stepLandPolaroidInstantFilm,
  stepLegacyDaimlerEngineUS349983,
  stepLincolnBuoy,
  stepMaimanRubyLaser,
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
  stepTeslaTeleautomaton,
  stepThomsonWelding,
  stepTownesLaser,
  stepWhitneyCottonGin,
  stepWozniakApple,
  stepZeppelinAirship,
  thomsonSchematicJawX,
  verticalConnectingRod,
  voltsToKv,
  westinghouseSparkWheelX,
  westinghouseSparkWheelZ,
  whitneySchematicRay,
  wozniakBusCycle,
  wozniakIsVideoPacket,
  wozniakSchematicChip,
  zeppelinSchematicCell,
  zeppelinSchematicGondola,
} from "./catalogKernels";

describe("Catalog Kernels & Shared SI Stepping Functions", () => {
  test("unit conversions and geometric helpers maintain exact relations", () => {
    const { omegaRadPerS, omegaDegPerS } = rpmToOmega(60);
    expect(omegaRadPerS).toBeCloseTo(Math.PI * 2, 2);
    expect(omegaDegPerS).toBe(360);

    expect(voltsToKv(1500)).toBe(1.5);
    expect(voltsToKv(0)).toBe(0);
    expect(degToRad(180)).toBeCloseTo(Math.PI, 10);
    expect(fourStrokeIndexFromRad(Math.PI * 2.1)).toBe(2);
    expect(fourStrokeIndexFromRad(Math.PI * 3.5)).toBe(3);
    expect(fourStrokeCycle(0).strokeIndex).toBe(0);
    expect(fourStrokeCycle(Math.PI * 4.1).cyclePhaseRad).toBeCloseTo(Math.PI * 0.1, 10);
    expect(farnsworthBeamFrac(-4.5)).toBe(0);
    expect(farnsworthBeamFrac(-0.5)).toBe(0.5);
    expect(farnsworthBeamFrac(3.5)).toBe(1);

    // Piston displacement: 0 at 0 deg, 2*stroke at 180 deg
    expect(pistonSvgDisplacement(0, 50)).toBe(0);
    expect(pistonSvgDisplacement(180, 50)).toBe(100);

    // Slider stroke: 0 at 0 deg, stroke at 90 deg
    expect(sliderStrokeSvg(0, 40)).toBe(0);
    expect(sliderStrokeSvg(90, 40)).toBe(40);

    // Edison schematic glow bounded in [0.2, 0.9]
    expect(edisonSchematicGlowOpacity(1500)).toBe(0.2);
    expect(edisonSchematicGlowOpacity(2700)).toBe(0.9);

    expect(westinghouseSparkWheelX(0)).toBe(-1.4);
    expect(westinghouseSparkWheelX(2)).toBe(1.4);
    expect(westinghouseSparkWheelZ(0)).toBe(-1.02);
    expect(westinghouseSparkWheelZ(1)).toBe(1.02);
  });

  test("Pelton wheel computes jet velocity and turbine efficiency", () => {
    const res = stepPeltonWheel({ headMeters: 450, runnerRpm: 600 });
    expect(res.jetVelocityMps).toBeGreaterThan(80);
    expect(res.etaPct).toBeGreaterThanOrEqual(40);
    expect(res.etaPct).toBeLessThanOrEqual(100);
    expect(res.shaftPowerKw).toBeGreaterThan(0);
    expect(res.runnerSvgR).toBe(75);
    expect(res.bucketCount).toBe(12);
    expect(res.bucketPitchDeg).toBe(30);
    expect(res.schematicBucketCount).toBe(8);
    expect(res.schematicBucketRx).toBe(8);
    expect(res.schematicJetX1).toBe(100);
    expect(peltonSchematicBucket(0).x).toBe(260);
    expect(peltonSchematicBucket(90).y).toBe(190);
    expect(res.jetYOverX).toBe(0.7);
    expect(res.jetResetX).toBe(-3.2);
    expect(res.sprayFloorY).toBe(-3.8);
  });

  test("Gramme dynamo computes 36-junction continuous EMF index", () => {
    const res = stepGrammeDynamo({ shaftRate: 1.0 });
    expect(res.printedJunctionCount).toBe(36);
    expect(res.junctionPitchDeg).toBe(10);
    expect(res.collectionContinuityPct).toBeGreaterThan(95);
    expect(res.inducedEmfIndex).toBe(100);
    expect(res.torusSvgR).toBe(100);
    expect(res.junctionInnerSvgR).toBe(35);
    expect(res.junctionOuterSvgR).toBe(48);
    expect(res.schematicJunctionCount).toBe(12);
    expect(res.schematicRingOuterR).toBe(55);
    expect(grammeSchematicJunction(0).x2).toBe(232);
    expect(grammeSchematicJunction(90).y2).toBe(182);
    expect(grammeSchematicBrush(0).y).toBe(112);
    expect(grammeSchematicBrush(1).y).toBe(182);
    expect(res.coilPadX).toBe(6);
    expect(grammeCoil(0).x).toBe(94);
    expect(grammeJunctionRod(0).x2).toBe(48);
    expect(res.torusCx).toBe(300);
    expect(res.fluxOrbitCoupling).toBe(0.3);
    expect(res.displayFps).toBe(60);
    expect(grammeFluxRadius(0)).toBeCloseTo(1.42, 10);
    expect(grammeFluxRadius(6)).toBeCloseTo(1.42, 10);
    expect(grammeFluxRadius(1)).toBeCloseTo(1.56, 10);
  });

  test("Otto four-stroke engine computes thermodynamic air-standard cycle", () => {
    const res = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    expect(res.brakeHorsepower).toBeGreaterThan(0);
    expect(res.thermalEfficiencyPct).toBeGreaterThan(40);
    expect(res.peakFiringBar).toBeGreaterThan(res.peakCompressionBar);
    expect(res.flywheelSvgR).toBe(80);
    expect(res.cycleWrapDeg).toBe(720);
    expect(res.cycleWrapRad).toBeCloseTo(Math.PI * 4, 10);
    expect(res.camRatio).toBe(0.5);
    expect(res.flywheelRimR).toBe(90);
    expect(res.crankCx).toBe(460);
    expect(res.rodOriginX).toBe(167);
    expect(ottoConnectingRod(0, 0, res.pistonStrokePx).x1).toBe(167);
    expect(ottoConnectingRod(0, 0, res.pistonStrokePx).x2).toBe(495);
    expect(res.stroke1EndDeg).toBe(180);
    expect(ottoStrokePhase(0)).toBe(1);
    expect(ottoStrokePhase(200)).toBe(2);
    expect(ottoStrokePhase(400)).toBe(3);
    expect(ottoStrokePhase(600)).toBe(4);
    expect(res.sparkStartDeg).toBe(350);
    expect(res.spokeCount).toBe(6);
    expect(res.spokePitchDeg).toBe(60);
    expect(res.schematicFlywheelR).toBe(45);
    expect(res.schematicCylinderW).toBe(160);
    expect(res.schematicValveW).toBe(30);
    expect(res.slideStroke).toBe(0.22);
    expect(res.slideHomeX).toBe(-3.45);
    expect(res.exhaustRockerCoupling).toBe(1.8);
    expect(res.sleeveCoupling).toBe(0.8);
    expect(res.cylinderTdcX).toBe(-3.25);
    expect(res.combustionLengthRef).toBe(1.8);
    expect(res.expansionFade).toBe(0.7);
    expect(res.intakeGasColor).toBe(0x38bdf8);
  });

  test("Parsons steam turbine computes multi-stage expansion enthalpy", () => {
    const res = stepParsonsTurbine({ rotorRpm: 3000, inletPressurePsi: 180 });
    expect(res.shaftPowerKw).toBeGreaterThan(0);
    expect(res.stageCount).toBe(48);
    expect(res.enthalpyKjKg).toBeGreaterThan(0);
    expect(res.stageRingSvgCount).toBe(22);
    expect(res.stageSvgOriginX).toBe(135);
    expect(res.stageSvgPitch).toBe(16);
    expect(res.schematicStageXs).toEqual([100, 120, 140, 170, 190, 210, 230, 260, 280, 300]);
    expect(res.schematicBladeY0).toBe(85);
    expect(parsonsStageHeight(200, res.stageSplitX0, res.stageSplitX1)).toBe(30);
    expect(parsonsStageHeight(300, res.stageSplitX0, res.stageSplitX1)).toBe(45);
    expect(res.schematicInletX1).toBe(40);
    expect(res.displayWrapDeg).toBe(360);
    expect(parsonsIsRotor(1)).toBe(true);
    expect(res.steamWrapX).toBe(5);
    expect(res.steamResetX).toBe(-4.5);
    expect(res.steamRadiusLp).toBe(2.35);
    expect(parsonsIsRotor(0)).toBe(false);
  });

  test("Ericsson screw propeller keeps source facts distinct from its illustrative display model", () => {
    const res = stepEricssonPropeller({ shaftRpm: 120, bladePitchAngleDeg: 35 });
    expect(res.isIllustrativeDisplayModel).toBe(true);
    expect(res.sourceSpiralAdvanceDiameters).toBe(3);
    expect(res.sourceCasingClearanceInches).toBe(0.125);
    expect(res.bladeSvgRx).toBe(10);
    expect(res.forwardBladeSvgRy).toBe(50);
    expect(res.aftBladeSvgRy).toBe(45);
    expect(res.bladeCount).toBe(6);
    expect(res.bladePitchDeg).toBe(60);
    expect(res.schematicForwardRy).toBe(50);
    expect(res.schematicAftRy).toBe(46);
    expect(res.schematicShaftY).toBe(150);
    expect(res.schematicSternD).toContain("60 80");
    expect(res.shroudSvgRx).toBe(14);
    expect(res.forwardShroudSvgRy).toBe(60);
    expect(res.aftHubSvgR).toBe(8);
  });

  test("DeLaval centrifugal separator computes radial g-force and separation efficiency", () => {
    const res = stepDeLavalSeparator({ bowlRpm: 6500, rawMilkFlowLph: 300 });
    expect(res.gForce).toBeGreaterThan(1000);
    expect(res.fatYieldPct).toBeGreaterThan(85);
    expect(res.schematicDiscCount).toBe(5);
    expect(res.schematicBowlPoints).toContain("140,80");
    expect(res.schematicSpindleY1).toBe(250);
    expect(delavalSchematicDiscY(0)).toBe(100);
    expect(delavalSchematicDiscY(4)).toBe(180);
  });

  test("Nobel dynamite computes detonation velocity and shock impulse", () => {
    const res = stepNobelDynamite({ ngConcentrationPct: 75, capEnergyJoules: 1.2 });
    expect(res.detonationVelocityMps).toBeGreaterThan(5000);
    expect(res.blastOverpressureMpa).toBeGreaterThan(4000);
    expect(res.isInitiated).toBe(true);
    expect(res.kieselguhrCount).toBe(24);
    expect(res.kieselguhrR).toBe(6);
    expect(nobelKieselguhrSvg(0).cx).toBe(200);
    expect(nobelKieselguhrSvg(8).cy).toBe(167);
    expect(res.schematicKieselguhrCols).toBe(7);
    expect(res.schematicCartridgeW).toBe(220);
    expect(res.schematicGrainR).toBe(4);
    expect(nobelSchematicKieselguhr(0, 0).cx).toBe(90);
    expect(res.sparkOmega).toBe(25);
    expect(res.shockwaveScaleAmp).toBe(1.5);
    expect(nobelSchematicKieselguhr(1, 1).cy).toBe(150);
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
    expect(res.sawToothPitchDeg).toBe(22.5);
    expect(res.bristleCount).toBe(24);
    expect(res.bristlePitchDeg).toBe(15);
    expect(res.schematicSawToothCount).toBe(12);
    expect(res.schematicSawR).toBe(48);
    expect(res.schematicHopperPoints).toContain("60,40");
    expect(res.fiberSawCoupling).toBe(0.12);
    expect(res.fiberCarrySpeed).toBe(1.8);
    expect(res.fiberWrapZ).toBe(3.2);
    const saw0 = whitneySchematicRay(
      0,
      res.schematicSawCx,
      res.schematicSawCy,
      res.schematicSawInnerR,
      res.schematicSawOuterR,
      res.schematicSawTwistRad,
    );
    expect(saw0.x1).toBe(254);
    const brush0 = whitneySchematicRay(
      0,
      res.schematicBrushCx,
      res.schematicBrushCy,
      res.schematicBrushInnerR,
      res.schematicBrushOuterR,
    );
    expect(brush0.x2).toBe(338);
  });

  test("McCormick reaper computes sickle bar reciprocating frequency and harvest rate", () => {
    const res = stepMcCormickReaper({ forwardSpeedMph: 2.5 });
    expect(res.cutterHz).toBeGreaterThan(0);
    expect(res.groundSpeedMps).toBeGreaterThan(0);
    expect(res.reelToCutterRatio).toBeCloseTo(res.reelOmegaRadPerS / res.cutterOmegaRadPerS, 5);
    expect(mccormickReelAngleDeg(Math.PI, res.reelToCutterRatio)).toBeGreaterThan(0);
    expect(res.reelArmCount).toBe(4);
    expect(res.reelArmSvgLen).toBe(95);
    expect(res.schematicReelR).toBe(50);
    expect(res.schematicBullR).toBe(45);
    expect(res.pitmanCutterPad).toBe(50);
    expect(res.guardTipDx).toBe(12);
    expect(res.schematicSickleX1).toBe(160);
    expect(mccormickSchematicReelArm(0).x).toBe(260);
    expect(mccormickSchematicReelArm(90).y).toBe(150);
    expect(res.schematicSickleCount).toBe(8);
    expect(mccormickSchematicSickleX(0)).toBe(170);
    expect(mccormickSchematicSickleX(7)).toBe(310);
    expect(res.grainStemCount).toBe(14);
    expect(mccormickGrainStemX(0)).toBe(60);
    expect(mccormickGuardX(1, res.guardPitchX)).toBe(25);
    expect(mccormickFaceSickleX(0)).toBe(5);
    expect(mccormickCrankPinSvg(0).cx).toBe(-42);
    expect(res.cutterDisplayRadPerFrame).toBeCloseTo(res.cutterOmegaRadPerS / 60, 5);
  });

  test("Davenport electric motor computes torque and rotational speed from battery electromotive force", () => {
    const res = stepDavenportMotor({ batteryVoltage: 12, loadTorque: 0.8 });
    expect(res.armatureCurrentA).toBeGreaterThan(0);
    expect(res.shaftRpm).toBeGreaterThan(0);
    expect(res.schematicCommutatorR).toBe(14);
    expect(davenportSchematicArmature().x).toBe(160);
    expect(res.commutatorPoleDeg).toBe(180);
    expect(davenportPolarityReversed(0)).toBe(false);
    expect(davenportPolarityReversed(100)).toBe(true);
  });

  test("Corliss steam engine computes variable cutoff expansion and indicated horsepower", () => {
    const res = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    expect(res.indicatedHp).toBeGreaterThan(0);
    expect(res.expansionRatio).toBe(4);
    expect(res.schematicValveR).toBe(16);
    expect(res.flywheelRimR).toBe(95);
    expect(res.wristLeadDeg).toBe(90);
    expect(res.crankCx).toBe(480);
    expect(corlissConnectingRod(0, 0, res.pistonStrokePx).x1).toBe(358);
    expect(corlissConnectingRod(0, 0, res.pistonStrokePx).x2).toBe(525);
    expect(res.schematicCylinderW).toBe(260);
    expect(res.schematicLinkInnerX).toBe(108);
    expect(corlissSchematicValve(0).cx).toBe(100);
    expect(corlissSchematicValve(3).cy).toBe(215);
    expect(res.intakeCycleDeg).toBe(180);
    expect(res.displayWrapDeg).toBe(360);
    expect(res.crankWrapRad).toBeCloseTo(Math.PI * 2, 10);
    expect(res.govOmegaRatio).toBe(2.5);
    expect(res.wristLeadRad).toBeCloseTo(Math.PI * 0.25, 10);
    expect(res.intakeValveCoupling).toBe(0.9);
    expect(res.dashpotHomeY).toBe(1.5);
    expect(res.crankR).toBe(0.65);
    expect(res.pinHomeX).toBe(3.8);
    expect(res.rodLen).toBe(4.4);
  });

  test("Gatling gun computes cyclic fire rate and barrel cluster rotation", () => {
    const res = stepGatlingGun({ crankRpm: 60, barrelCount: 6 });
    expect(res.roundsPerMin).toBe(360);
    expect(res.muzzleEnergyJoules).toBe(1850);
    expect(res.schematicBarrelCount).toBe(6);
    expect(res.schematicBarrelX1).toBe(180);
    expect(res.schematicBreechW).toBe(110);
    expect(gatlingSchematicBarrelY(0)).toBe(150);
    expect(gatlingSchematicBarrelY(90)).toBe(178);
    expect(res.barrelSvgHalfH).toBe(3);
    expect(res.firingBottomDeg).toBe(180);
    expect(gatlingMuzzleFlash(0)).toContain("260,0");
    expect(res.displayWrapDeg).toBe(360);
  });

  test("Hyatt celluloid computes hydraulic consolidation and camphor plasticization", () => {
    const res = stepHyattCelluloid({ steamTempC: 95, hydraulicPressureMpa: 10 });
    expect(res.viscosityPaS).toBeGreaterThan(0);
    expect(res.isMelted).toBe(true);
    expect(res.polymerCount).toBe(16);
    expect(hyattPolymerSvg(0).xPos).toBe(220);
    expect(hyattPolymerSvg(4).yPos).toBe(175);
    expect(res.camphorDx).toBe(12);
    expect(res.polymerMeltR).toBe(8);
    expect(hyattSchematicRam().x).toBe(40);
    expect(hyattSchematicMold().x).toBe(295);
    expect(res.ramHomeX).toBe(1.8);
    expect(res.ramCycleTau).toBeCloseTo(Math.PI * 2, 10);
    expect(res.flowMax).toBe(1.4);
    expect(goddardSchematicStack().schematicNoseCx).toBe(200);
    expect(goddardSchematicStack().schematicChamberH).toBe(70);
    expect(goddardSchematicStack().plumeWrapY).toBe(-8.5);
    expect(goddardSchematicStack().stage2SepY).toBe(7.5);
  });

  test("Pasteur US 135,245 models only the printed gas-sweep and spray-cooling sequence", () => {
    const res = stepPasteurFermentation({
      co2SweepPct: 75,
      sprayCoveragePct: 60,
      wortTempC: 21.25,
    });
    expect(res.co2SweepPct).toBe(75);
    expect(res.sprayCoveragePct).toBe(60);
    expect(res.wortTempC).toBe(21.25);
    expect(res.withinPrintedYeastBand).toBe(true);
    expect(res.readyForYeast).toBe(false);
    expect(
      stepPasteurFermentation({ co2SweepPct: 100, sprayCoveragePct: 100, wortTempC: 20 })
        .readyForYeast,
    ).toBe(true);
    expect(JSON.stringify(res)).not.toMatch(/kill|abv|shelf|pressure|microbe|airRemaining/i);
  });

  test("Glidden barbed wire computes tensile yield and barb lock security", () => {
    const res = stepGliddenBarbedWire({ wireTensionN: 650, twistsPerFoot: 5 });
    expect(res.tensileStrengthLbs).toBe(950);
    expect(res.isLocked).toBe(true);
    expect(res.schematicSpurCount).toBe(3);
    expect(res.schematicSpurRx).toBe(8);
    expect(res.schematicBarbDx).toBe(12);
    expect(gliddenSchematicSpurX(0)).toBe(110);
    expect(gliddenSchematicSpurX(2)).toBe(290);
  });

  test("Edison phonograph keeps printed pitches separate from illustrative motion", () => {
    const res = stepEdisonPhonograph({ mandrelRpm: 60, voiceVolumeDb: 75 });
    expect(res.stylusAmp).toBeGreaterThan(0);
    expect(phonographAxialTravelMm(60, 2)).toBeGreaterThan(0);
    expect(res.schematicGrooveCount).toBe(8);
    expect(res.schematicMandrelW).toBe(180);
    expect(res.leadScrewThreadDx).toBe(6);
    expect(res.cylinderSvgX).toBe(160);
    expect(res.cylinderSvgW).toBe(200);
    expect(res.schematicDiaphragmR).toBe(16);
    expect(res.stylusHomeY).toBe(-0.55);
    expect(edisonSchematicGrooveX(0)).toBe(120);
    expect(edisonSchematicGrooveX(7)).toBe(260);
    expect(res.leadScrewThreadCount).toBe(40);
    expect(edisonLeadScrewThreadX(0)).toBe(90);
    expect(edisonFoilGrooveX(1)).toBe(26);
  });

  test("Thomson welding computes secondary current heating, interface temperature, and upset forge", () => {
    const res = stepThomsonWelding({ weldCurrentAmps: 5500, clampPressureMpa: 35 });
    expect(res.interfaceTempC).toBeGreaterThan(800);
    expect(res.isForged).toBe(true);
    expect(res.schematicJawCount).toBe(2);
    expect(res.schematicBarD).toContain("90 90");
    expect(res.schematicCoreW).toBe(60);
    expect(thomsonSchematicJawX(1)).toBe(220);
    expect(res.schematicWeldR).toBe(6);
    expect(res.sparkGoldenAngleRad).toBeCloseTo(2.399963229728653, 10);
    expect(res.sparkWrapRad).toBeCloseTo(Math.PI * 2, 10);
  });

  test("Zeppelin airship computes aerostatic lift, compartmental displacement, and trim moments", () => {
    const res = stepZeppelinAirship({ gasInflation: 95, flightAlt: 300, flightSpeedKnots: 28 });
    expect(res.grossLiftKg).toBeGreaterThan(10000);
    expect(res.netLiftKn).toBeDefined();
    expect(res.gasCellCount).toBe(17);
    expect(res.swayOmega).toBe(0.8);
    expect(res.swayAmp).toBe(0.08);
    expect(res.trimMaxX).toBe(5);
    expect(res.schematicCellCount).toBe(9);
    expect(res.schematicHullRx).toBe(170);
    expect(zeppelinSchematicCell(1).cx).toBe(102);
    expect(zeppelinSchematicGondola(1).x).toBe(250);
    expect(res.gasCellSvgOriginX).toBe(-215);
    expect(res.gasCellSvgPitch).toBe(27);
  });

  test("legacy US 349,983 illustration remains isolated from the US 361,931 marine model", () => {
    const res = stepLegacyDaimlerEngineUS349983({ engineRpm: 750, hotTubeTempC: 850 });
    expect(res.brakeHorsepower).toBeGreaterThan(0);
    expect(res.isRunning).toBe(true);
    expect(res.schematicFlywheelR).toBe(50);
    expect(res.schematicCylinderW).toBe(120);
    expect(res.schematicHotTubeW).toBe(50);
    expect(res.cycleWrapDeg).toBe(720);
    expect(res.crankCy).toBe(250);
    expect(
      verticalConnectingRod(0, 0, res.pistonStrokePx, res.crankCx, res.crankCy, res.rodOriginY0).x2,
    ).toBe(330);
    expect(res.valveHomeY).toBe(2.5);
    expect(res.exhaustRockerCoupling).toBe(1.5);
    expect(res.flameScale0).toBe(0.6);
    expect(res.hotTubeBrightC).toBe(800);
    expect(res.crankR).toBe(0.42);
    expect(res.pinYHome).toBe(-0.65);
    expect(res.rodLen).toBe(1.7);
  });

  test("Hollerith tabulating machine computes pin-brush electrical circuit matrix and tally count", () => {
    const res = stepHollerithTabulating({ cardsPerMin: 60, supplyVoltageV: 12 });
    expect(res.solenoidForceN).toBeGreaterThan(0);
    expect(res.cycleTimeMs).toBe(1000);
    expect(res.cupCols).toBe(8);
    expect(hollerithCupSvg(0).cx).toBe(20);
    expect(hollerithCupSvg(8).cy).toBe(130);
    expect(res.schematicPinCount).toBe(9);
    expect(res.schematicPressW).toBe(280);
    expect(res.schematicCupR).toBe(5);
    expect(hollerithSchematicPinX(0)).toBe(80);
    expect(hollerithSchematicPinX(8)).toBe(320);
    expect(res.schematicDialCount).toBe(3);
    expect(hollerithSchematicDialX(0)).toBe(140);
    expect(hollerithSchematicDialX(2)).toBe(260);
    expect(res.cupSvgR).toBe(7);
  });

  test("Noyce planar integrated circuit computes junction isolation and oxide passivation", () => {
    const res = stepNoyceIC({ reverseBias: 5.0, oxideThickness: 0.5, clockFrequencyMhz: 10 });
    expect(res.breakdownMarginV).toBeGreaterThan(10);
    expect(res.depletionWidthUm).toBeGreaterThan(0);
    expect(res.schematicJunctionCount).toBe(3);
    expect(noyceSchematicJunction(0).x).toBe(90);
    expect(noyceSchematicContactX(2)).toBe(275);
  });

  test("Edison incandescent bulb composes the declared fs-conduction radiative balance", () => {
    const res = stepEdisonBulb({
      voltage: 110,
      hotResistanceOhm: 145,
      filamentLength: 22,
    });
    expect(res.filamentTempK).toBeGreaterThan(1800);
    expect(res.radiantWatts).toBeGreaterThan(0);
    expect(res.schematicTerminalR).toBe(4);
    expect(edisonSchematicTerminal(0, res.schematicTerminalXs).cx).toBe(188);
    expect(edisonSchematicTerminal(1, res.schematicTerminalXs).cx).toBe(212);
    expect(res.glowThreshold).toBe(0.05);
    expect(res.gasPhaseOmega).toBe(2);
    expect(res.gasYOmega).toBe(1.3);
    const highResistance = stepEdisonBulb({ voltage: 110, hotResistanceOhm: 500 });
    expect(highResistance.radiantWatts).toBeLessThan(res.radiantWatts);
    expect(highResistance.incandescenceIntensity).toBeLessThan(res.incandescenceIntensity);
    expect(stepEdisonBulb({ voltage: 40, hotResistanceOhm: 145 }).hotResistanceOhm).toBe(145);
    expect(stepEdisonBulb({ voltage: 130, hotResistanceOhm: 145 }).hotResistanceOhm).toBe(145);
    expect(() => stepEdisonBulb({ voltage: 110, hotResistanceOhm: 99 })).toThrow();
  });

  test("Bell telephone computes liquid transmitter resistance modulation and acoustic current", () => {
    const res = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
    });
    expect(res.modulatedMa).toBeGreaterThan(0);
    expect(res.scopeSampleCount).toBe(60);
    expect(res.schematicHornRx).toBe(55);
    expect(res.schematicTransmitterW).toBe(80);
    expect(res.schematicAcidW).toBe(50);
    expect(res.schematicElectrodeXs).toEqual([185, 215]);
    expect(
      bellScopeSample(
        0,
        0,
        res.scopeNorm,
        res.scopeSineAmp,
        res.scopeHarmonicAmp,
        res.scopeSquareAmp,
        "continuous-undulating",
      ).x,
    ).toBe(0);
    expect(res.currentBaselineMa).toBeGreaterThan(0);
    expect(res.rodStudioCoupling).toBe(0.6);
    expect(res.waveProgressOmega).toBe(3);
    expect(res.electronWrapX).toBe(2.0);
    expect(bellWaveProgress(0, 0)).toBe(0);
    expect(bellWaveProgress(0.1, 0)).toBeCloseTo(0.3, 10);
    expect(bellWaveProgress(0, 1)).toBeCloseTo(0.33, 10);
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
    expect(res.schematicKeyX).toBe(50);
    expect(morseSchematicInstrument("relay").x).toBe(160);
    expect(morseSchematicInstrument("sounder").labelX).toBe(315);
    expect(res.electronLaneZ).toBe(0.3);
    expect(res.governorRatio).toBe(6);
    expect(res.gearRatio).toBe(2);
    expect(morseElectronLaneZ(0)).toBe(0.3);
    expect(morseElectronLaneZ(1)).toBe(-0.3);
  });

  test("Engelbart computer mouse computes dual orthogonal encoder resolution and coordinate travel", () => {
    const res = stepEngelbartMouse({ mouseSpeed: 350, wheelRadius: 10 });
    expect(res.dpi).toBeGreaterThan(0);
    expect(res.omegaRadPerS).toBeGreaterThan(0);
    expect(res.schematicXWheelW).toBe(14);
    expect(res.schematicBodyD).toContain("M 120 220");
    expect(engelbartSchematicWheel("x").labelX).toBe(147);
    expect(engelbartSchematicWheel("y").labelY).toBe(180);
  });

  test("Wozniak Apple II computes dynamic RAM refresh, crystal oscillator timing, and video scanout", () => {
    const res = stepWozniakApple({ crystalFreq: 14.318, ramCapacityKb: 48 });
    expect(res.cpuClockMhz).toBeCloseTo(1.02, 2);
    expect(res.cpuDutyPct).toBe(100);
    expect(res.videoPhaseDivisor).toBe(2);
    expect(res.videoPacketParity).toBe(0);
    expect(wozniakBusCycle(0, 0).dramAddress).toBe("0x0400");
    expect(wozniakBusCycle(1, 0).phase).toBe(1);
    expect(res.rasterLineWrap).toBe(192);
    expect(wozniakSchematicChip("cpu", res.schematicChipSeats).x).toBe(50);
    expect(wozniakSchematicChip("ram", res.schematicChipSeats).labelY).toBe(140);
    expect(wozniakIsVideoPacket(0, res.videoPhaseDivisor, res.videoPacketParity)).toBe(true);
    expect(wozniakIsVideoPacket(1, res.videoPhaseDivisor, res.videoPacketParity)).toBe(false);
  });

  test("Spencer microwave cavity computes magnetron relativistic gyro-frequency and Poynting vector", () => {
    const res = stepSpencerMicrowave(2.2, 1450, 800);
    expect(res.microwaveFreqMhz).toBe(2450);
    expect(res.isOscillating).toBe(true);
    expect(res.popcornKernelCount).toBe(12);
    expect(spencerPopcornSvg(0, false, res.popcornKernelCount).px).toBeCloseTo(8, 0);
    expect(res.schematicCavityCount).toBe(8);
    expect(res.schematicAnodeR).toBe(42);
    expect(res.schematicOvenW).toBe(300);
    expect(spencerSchematicCavity(0).cx).toBe(136);
    expect(spencerSchematicCavity(2).cy).toBe(176);
  });

  test("Kwolek Kevlar continuum computes anisotropic liquid crystal alignment and bullet arrest", () => {
    const res = stepKevlarContinuum(6.5, 450, 30);
    expect(res.alignmentPct).toBeGreaterThan(70);
    expect(res.schematicLatticeRows).toBe(5);
    expect(res.schematicNodeR).toBe(5);
    expect(kevlarSchematicBond(1).x).toBe(200);
    expect(kevlarChainBond(0).x).toBe(80);
    expect(res.chainOffsetYs).toEqual([-60, -30, 0, 30, 60]);
    expect(kevlarChainPath(0, 10, 350).yBase).toBe(40);
    expect(kevlarChainPath(0, 10, 350).d).toContain("Q 100,50");
    expect(res.chainBondH).toBe(30);
    expect(kevlarSchematicLattice(0, 1).cx).toBe(120);
    expect(res.tensileStrengthGpa).toBeGreaterThan(2);
  });

  test("Bardeen point-contact transistor computes current gain alpha, hole diffusion, and load line", () => {
    const res = stepBardeenTransistor(1.5, -40, 50);
    expect(res.currentGainAlpha).toBeGreaterThan(1);
    expect(res.powerGainDb).toBeGreaterThan(0);
    const loadLine = bardeenLoadLine(res.currentGainAlpha);
    expect(loadLine.voltageGain).toBeGreaterThan(0);
    expect(res.holeStreamCount).toBe(12);
    const hole0 = bardeenHoleStream(0, res.pointGapSvgPx);
    const holeLast = bardeenHoleStream(12, res.pointGapSvgPx);
    expect(hole0.cx).toBeCloseTo(130 - res.pointGapSvgPx, 5);
    expect(holeLast.cx).toBeCloseTo(130 + res.pointGapSvgPx, 5);
    expect(res.schematicDieW).toBe(180);
    expect(bardeenSchematicDie().labelX).toBe(200);
    expect(res.holeSvgR).toBe(3);
    expect(res.holeLabelDx).toBe(2);
    expect(res.holeWrapPad).toBe(BARDEEN_HOLE_WRAP_PAD);
    expect(res.holeResetPad).toBe(BARDEEN_HOLE_RESET_PAD);
  });

  test("Marconi radio computes quarter-wave antenna radiation resistance and resonant frequency", () => {
    const res = stepMarconiRadio(88, 10, 28);
    expect(res.radiationResistanceOhms).toBe(36.56);
    expect(res.resonantFreqKhz).toBeGreaterThan(0);
    expect(marconiMastHeightFromHz(1000000)).toBeGreaterThan(0);
    expect(res.schematicGapR).toBe(10);
    expect(res.schematicMastY0).toBe(50);
    expect(res.schematicEarthW).toBe(80);
    expect(res.schematicMastX).toBe(120);
    expect(res.waveRingWrapPx).toBe(120);
  });

  test("Colt revolver computes chamber cylinder index and lock bolt ratchet engagement", () => {
    const res = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 45 });
    expect(res.indexAngleDeg).toBe(72);
    expect(res.isLocked).toBe(true);
    expect(res.schematicBarrelW).toBe(150);
    expect(coltSchematicTrigger(true).y).toBe(155);
    expect(coltSchematicTrigger(false).h).toBe(8);
    expect(res.chamberCount).toBe(5);
    expect(coltNextChamber(1)).toBe(2);
    expect(coltNextChamber(5)).toBe(1);
    expect(res.boltRetractY).toBe(12);
  });

  test("Goodyear vulcanized rubber computes crosslink density, tensile modulus, and elastic recovery", () => {
    const res = stepGoodyearRubber(145, 8, 30);
    expect(res.crossLinkDensity).toBeGreaterThan(0.5);
    expect(res.tensileStrengthPsi).toBeGreaterThan(1000);
    expect(res.chainSagPx).toBe(25);
    expect(res.chainSagBezierScale).toBe(1.5);
    expect(res.schematicStrandCount).toBe(4);
    expect(res.schematicLinkCount).toBe(3);
    expect(goodyearSchematicLink(0).x1).toBe(88);
    expect(goodyearChainPost(1).x).toBe(180);
    expect(goodyearSchematicStrand(0).x).toBe(70);
    expect(goodyearSchematicCrosslink(0).cx).toBe(122);
    expect(res.thermalWobbleOmega).toBe(4);
    expect(res.thermalWobblePhasePitch).toBe(1.5);
    expect(res.gaugeNeedleRadPerStretch).toBeCloseTo(Math.PI * 1.5, 5);
    expect(res.uncoilMin).toBe(0.12);
    expect(goodyearUncoilFactor(1)).toBe(1);
    expect(goodyearUncoilFactor(4)).toBe(0.5);
  });

  test("Einstein-Szilard refrigerator computes three-fluid bubble pump thermosyphon circulation", () => {
    const res = stepEinsteinRefrigerator({ heatInput: 220, totalPressure: 15.0 });
    expect(res.coolingWatts).toBeGreaterThan(0);
    expect(res.cop).toBeGreaterThan(0);
    expect(res.schematicVesselW).toBe(90);
    expect(res.schematicGenCondY).toBe(80);
    expect(einsteinSchematicVessel("generator").x).toBe(70);
    expect(einsteinSchematicVessel("condenser").labelX).toBe(285);
    expect(einsteinSchematicVessel("evaporator").y).toBe(170);
    expect(einsteinSchematicVessel("absorber").labelY).toBe(205);
    expect(res.fluidWrapY).toBe(2.8);
    expect(res.heatFrameIndex).toBe(Math.floor((res.coolingWatts / 80) * 8));
    expect(einsteinFluidSign(0)).toBe(1);
    expect(einsteinFluidSign(1)).toBe(-1);
  });

  test("Lincoln buoyant air chambers computes hydrostatic buoyancy lift and draft reduction", () => {
    const res = stepLincolnBuoy({ inflationPct: 75, weightTons: 380 });
    expect(res.liftKn).toBeGreaterThan(0);
    expect(res.draftReductionFt).toBeGreaterThan(0);
    expect(res.schematicChamberXs).toEqual([80, 250]);
    expect(res.schematicHullD).toContain("50 110");
    expect(res.schematicWaterY).toBe(190);
    expect(lincolnSchematicChamber(1).x).toBe(250);
    expect(res.bellowsScaleY0).toBe(0.25);
    expect(res.boatLiftPerFt).toBe(0.45);
    expect(lincolnInflationNorm(75)).toBe(0.75);
    expect(lincolnInflationNorm(150)).toBe(1);
    expect(lincolnInflationNorm(-10)).toBe(0);
  });

  test("Maxim recoil machine gun computes muzzle gas recoil impulse and automatic toggle cycling", () => {
    const res = stepMaximMachineGun({ firingRateRpm: 600, recoilStrokeMm: 19 });
    expect(res.recoilVelocityMps).toBeGreaterThan(0);
    expect(res.toggleUnlockForceN).toBeGreaterThan(0);
    expect(res.heatGeneratedWatts).toBe(Math.round((600 / 60) * 45 * 1000 * 0.28));
    expect(res.schematicToggleCx).toBe(280);
    expect(res.schematicToggleR).toBe(4);
    expect(res.schematicJacketW).toBe(180);
    expect(res.schematicBreechW).toBe(140);
    expect(res.fireCycleWrapRad).toBeCloseTo(Math.PI * 2, 10);
    expect(res.firingWindowRad).toBe(0.6);
    expect(res.toggleLiftAmp).toBe(0.32);
    expect(res.toggleHomeY).toBe(0.12);
    expect(res.toggleRecoilCoupling).toBe(1.8);
    expect(res.crankThrowAmp).toBe(0.75);
  });

  test("Hall-Héroult aluminium smelting computes Faraday yield and bath voltage", () => {
    const res = stepHallAluminium({
      currentAmperes: 300000,
      bathTemperatureCelsius: 960,
      aluminaConcentrationPct: 5.5,
    });
    expect(res.currentEfficiencyPct).toBeGreaterThan(80);
    expect(res.aluminiumProductionRateKgPerHour).toBeGreaterThan(0);
    expect(res.electricalPowerKw).toBeGreaterThan(0);
    expect(res.totalCellVoltage).toBeGreaterThan(1.5);
  });

  test("Edison indicator computes thermionic emission and galvanometer deflection", () => {
    const resPos = stepEdisonIndicator({ mainsVoltageV: 110, plateBiasPolarity: "positive" });
    expect(resPos.filamentPowerW).toBeGreaterThan(0);
    expect(resPos.emissionCurrentMicroAmps).toBeGreaterThan(0);
    expect(resPos.regulatorState).toBe("nominal");

    const resNeg = stepEdisonIndicator({ mainsVoltageV: 110, plateBiasPolarity: "negative" });
    expect(resNeg.emissionCurrentMicroAmps).toBeLessThan(resPos.emissionCurrentMicroAmps);
    expect(resNeg.galvoDeflectionDeg).toBeLessThan(0);
  });

  test("De Forest audion computes triode voltage amplification and plate current", () => {
    const res = stepDeForestAudion({
      filamentCurrentA: 1.0,
      gridBiasVoltageV: -1.5,
      plateVoltageV: 45,
    });
    expect(res.voltageGain).toBeGreaterThan(1);
    expect(res.plateCurrentMa).toBeGreaterThan(0);
    expect(res.amplificationFactorMu).toBe(12);
  });

  test("Townes laser computes threshold inversion and optical power extraction", () => {
    const res = stepTownesLaser({ pumpPowerWatts: 350, cavityLengthCm: 25 });
    expect(res.thresholdGainPerCm).toBeGreaterThan(0);
    expect(res.laserOutputPowerWatts).toBeGreaterThan(0);
    expect(res.cavityQFactor).toBeGreaterThan(0);
  });

  test("Carlson electrophotography computes photoconductive discharge and optical density", () => {
    const res = stepCarlsonElectrophotography({
      coronaVoltageKv: 6.0,
      exposureLuxSec: 15,
      fuserTemperatureC: 185,
    });
    expect(res.exposedSurfacePotentialV).toBeGreaterThan(0);
    expect(res.opticalDensity).toBeGreaterThan(0);
    expect(res.copiesPerMin).toBeGreaterThan(0);
  });

  test("Baekeland Bakelite computes condensation kinetics, gel point, and void suppression", () => {
    const res = stepBaekelandBakelite(130, 75, 1.5, 60, 45);
    expect(res.conversionP).toBeGreaterThan(0.667);
    expect(res.isGelled).toBe(true);
    expect(res.isFoamingSuppressed).toBe(true);
    expect(res.tensileStrengthMpa).toBeGreaterThan(20);
  });

  test("Fessenden continuous wireless computes antenna resonance and voice modulation", () => {
    const res = stepFessendenWireless({ carrierFrequencyKhz: 75, audioModulationPct: 65 });
    expect(res.antennaResonantFreqKhz).toBeGreaterThan(0);
    expect(res.radiationEfficiencyPct).toBeGreaterThan(0);
  });

  test("Haber ammonia synthesis computes equilibrium yield and exothermic heat", () => {
    const res = stepHaberAmmonia({ pressureAtm: 175, temperatureCelsius: 530 });
    expect(res.ammoniaYieldPct).toBeGreaterThan(0);
    expect(res.reactionHeatGeneratedKw).toBeGreaterThan(0);
    expect(res.recycleRatio).toBeGreaterThan(0);
  });

  test("Hewitt mercury arc lamp computes negative dynamic resistance and luminous efficacy", () => {
    const res = stepHewittMercuryLamp({ mainsVoltageV: 110, tubeLengthCm: 100 });
    expect(res.arcCurrentAmperes).toBeGreaterThan(0);
    expect(res.dynamicArcResistanceOhms).toBeLessThan(0);
    expect(res.luminousFluxLumens).toBeGreaterThan(0);
    expect(res.isStable).toBe(true);
  });

  test("Tesla teleautomaton computes radio resonance, coherer latching, and rudder angle", () => {
    const res = stepTeslaTeleautomaton({ rfFrequency: 150, cohererTapped: false, rudderAngle: 15 });
    expect(res.isResonant).toBe(true);
    expect(res.relayEnergized).toBe(true);
    expect(res.propellerRpm).toBeGreaterThan(0);
    expect(res.turningRadiusM).toBeLessThan(100);
  });

  test("Kilby integrated circuit computes sheet resistance and p-n transition capacitance", () => {
    const res = stepKilbyIntegratedCircuit({
      substrateMaterial: "germanium",
      supplyVoltageV: 6.0,
      resistorWidthUm: 50.0,
      resistorLengthUm: 500.0,
    });
    expect(res.sheetResistanceOhmSq).toBeGreaterThan(0);
    expect(res.collectorLoadResistanceOhms).toBeGreaterThan(0);
    expect(res.junctionCapacitancePf).toBeGreaterThan(0);
    expect(res.maxClockFrequencyMhz).toBeGreaterThan(0);
  });

  test("Land Polaroid diffusion transfer computes silver densities and transfer efficiency", () => {
    const res = stepLandPolaroidInstantFilm({
      reagentViscosityCp: 25000,
      rollerGapUm: 25,
      exposureFraction: 0.6,
      developmentTimeSec: 30,
    });
    expect(res.negativeSilverDensity).toBeGreaterThan(0);
    expect(res.positiveSilverDensity).toBeGreaterThan(0);
    expect(res.transferEfficiencyPercent).toBeGreaterThan(50);
  });

  test("Maiman ruby laser computes 3-level population inversion and pulse energy", () => {
    const res = stepMaimanRubyLaser({ pumpEnergyJoules: 150, rodLengthCm: 5.0 });
    expect(res.thresholdPumpEnergyJoules).toBeGreaterThan(0);
    expect(res.isLasing).toBe(true);
    expect(res.laserPulseEnergyJoules).toBeGreaterThan(0);
    expect(res.emissionWavelengthNm).toBeCloseTo(694.3, 1);
  });

  test("Boyle & Smith CCD computes deep-depletion potential, well capacity, and CTE", () => {
    const res = stepBoyleSmithCcd({ gateVoltageV: 10, clockFrequencyMhz: 5.0, incidentLux: 250 });
    expect(res.surfacePotentialV).toBeGreaterThan(0);
    expect(res.fullWellCapacityElectrons).toBeGreaterThan(10000);
    expect(res.totalCollectedElectrons).toBeGreaterThan(0);
    expect(res.ctePct).toBeGreaterThan(99.0);
    expect(res.snrDb).toBeGreaterThan(0);
  });
});
