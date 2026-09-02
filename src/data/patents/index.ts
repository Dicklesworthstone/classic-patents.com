import type { Patent } from "@/types/patent";
import { amfVersatranPatent } from "./amf-versatran";
import { arkwrightWaterFramePatent } from "./arkwright-water-frame";
import { baekelandBakelitePatent } from "./baekeland-bakelite";
import { baerOdysseyPatent } from "./baer-odyssey";
import { bardeenTransistor2524035Patent } from "./bardeen-transistor-2524035";
import { bellPhotophonePatent } from "./bell-photophone";
import { bellTelephonePatent } from "./bell-telephone";
import { boyleSmithCcdPatent } from "./boyle-smith-ccd";
import { carlsonElectrophotographyPatent } from "./carlson-electrophotography";
import { carrierAirConditionerPatent } from "./carrier-air-conditioner";
import { coltRevolverPatent } from "./colt-revolver";
import { corlissSteamEnginePatent } from "./corliss-steam-engine";
import { cortPuddlingRollingPatent } from "./cort-puddling-rolling";
import { crumpFdmPatent } from "./crump-fdm";
import { daimlerEnginePatent } from "./daimler-engine";
import { davenportElectricMotorPatent } from "./davenport-electric-motor";
import { daVinciPatent } from "./davinci";
import { deForestAudionPatent } from "./de-forest-audion";
import { delavalSeparatorPatent } from "./delaval-separator";
import { devolProgrammedTransferPatent } from "./devol-programmed-transfer";
import { dieselEnginePatent } from "./diesel-engine";
import { eastmanKodakPatent } from "./eastman-kodak";
import { edisonIndicatorPatent } from "./edison-indicator";
import { edisonBulbPatent as edisonLightbulbPatent } from "./edison-lightbulb";
import { edisonPhonographPatent } from "./edison-phonograph";
import { eInkPatent } from "./eink";
import { einsteinRefrigeratorPatent } from "./einstein-refrigerator";
import { engelbartMousePatent } from "./engelbart-mouse";
import { ericssonPropellerPatent } from "./ericsson-propeller";
import { farnsworthTvPatent } from "./farnsworth-tv";
import { fermiReactorPatent } from "./fermi-reactor";
import { fessendenWirelessPatent } from "./fessenden-wireless";
import { gatlingGunPatent } from "./gatling-gun";
import { gliddenBarbedWirePatent } from "./glidden-barbed-wire";
import { goddardRocketPatent } from "./goddard-rocket";
import { goertzElectronicMasterSlaveManipulatorPatent } from "./goertz-electronic-master-slave-manipulator";
import { goodyearRubberPatent } from "./goodyear-rubber";
import { grammeDynamoPatent } from "./gramme-dynamo";
import { haberAmmoniaPatent } from "./haber-ammonia";
import { hallAluminiumPatent } from "./hall-aluminium";
import { hewittMercuryLampPatent } from "./hewitt-mercury-lamp";
import { hollerithTabulatingPatent } from "./hollerith-tabulating";
import { hopkinsPotashPatent } from "./hopkins-potash";
import { howeSewingMachinePatent } from "./howe-sewing-machine";
import { hullStereolithographyPatent } from "./hull-stereolithography";
import { hyattCelluloidPatent } from "./hyatt-celluloid";
import { kamenMedicationInjectionPatent } from "./kamen-medication-injection-device";
import { kamenSegwayPatent } from "./kamen-segway";
import { kamenTransporterPatent } from "./kamen-transporter";
import { kilbyIntegratedCircuitPatent } from "./kilby-integrated-circuit";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrPatent as lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { landPolaroidPatent } from "./land-polaroid";
import { lemelsonAdjustableManipulatorPatent } from "./lemelson-adjustable-manipulator";
import { lemelsonAutomaticProductionPatent } from "./lemelson-automatic-production";
import { lemelsonAutomaticWarehousingPatent } from "./lemelson-automatic-warehousing";
import { lemelsonMachineVisionPatent } from "./lemelson-machine-vision";
import { lincolnBuoyPatent } from "./lincoln-buoy";
import { lindeAirLiquefactionPatent } from "./linde-air-liquefaction";
import { maimanRubyLaserPatent } from "./maiman-ruby-laser";
import { makinoScaraPatent } from "./makino-scara";
import { marconiRadioPatent } from "./marconi-radio";
import { maximMachineGunPatent } from "./maxim-machine-gun";
import { mccormickReaperPatent } from "./mccormick-reaper";
import { mergenthalerLinotypePatent } from "./mergenthaler-linotype";
import { mestralVelcroPatent } from "./mestral-velcro";
import { metcalfeEthernetPatent } from "./metcalfe-ethernet";
import { milacronRobotToolchangerPatent } from "./milacron-robot-toolchanger";
import { morseTelegraphPatent } from "./morse-telegraph";
import { multiTouchPatent } from "./multitouch";
import { nobelDynamitePatent } from "./nobel-dynamite";
import { noyceIcPatent } from "./noyce-ic";
import { otisElevatorPatent } from "./otis-elevator";
import { ottoEnginePatent } from "./otto-engine";
import { pagerankPatent } from "./pagerank";
import { parsonsTurbinePatent } from "./parsons-turbine";
import { pasteurFermentationPatent } from "./pasteur-fermentation";
import { peltonWaterWheelPatent } from "./pelton-water-wheel";
import { renoEscalatorPatent } from "./reno-escalator";
import { rillieuxEvaporatorPatent } from "./rillieux-evaporator";
import { robotEndEffectorPatent } from "./robot-end-effector";
import { roombaPatent } from "./roomba";
import { salisburyRobotHandPatent } from "./salisbury-robot-hand";
import { parsePatentCatalog } from "./schema";
import { sholesTypewriterPatent } from "./sholes-typewriter";
import { sikorskyHelicopterPatent } from "./sikorsky-helicopter";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { stackhouseManipulatorPatent } from "./stackhouse-manipulator-source-bounded";
import { sundbackZipperPatent } from "./sundback-zipper";
import { teslaCoil593138Patent } from "./tesla-coil-593138";
import { teslaMotorPatent } from "./tesla-motor";
import { teslaTeleautomatonPatent } from "./tesla-teleautomaton";
import { thomsonWeldingPatent } from "./thomson-welding";
import { townesLaserPatent } from "./townes-laser";
import { watsonRccPatent } from "./watson-rcc";
import { wattRotaryEnginePatent } from "./watt-rotary-engine";
import { wattSeparateCondenserPatent } from "./watt-separate-condenser";
import { westinghouseAirBrakePatent } from "./westinghouse-air-brake";
import { whitneyCottonGinPatent } from "./whitney-cotton-gin";
import { wozniakApplePatent } from "./wozniak-apple";
import { wrightFlyerPatent } from "./wright-flyer";
import { yaleLockPatent } from "./yale-lock";
import { zeppelinAirshipPatent } from "./zeppelin-airship";

export {
  carlsonElectrophotographyPatent,
  crumpFdmPatent,
  daVinciPatent,
  eInkPatent,
  fessendenWirelessPatent,
  goertzElectronicMasterSlaveManipulatorPatent,
  haberAmmoniaPatent,
  hewittMercuryLampPatent,
  hullStereolithographyPatent,
  kamenSegwayPatent,
  lemelsonAdjustableManipulatorPatent,
  lemelsonMachineVisionPatent,
  mestralVelcroPatent,
  milacronRobotToolchangerPatent,
  multiTouchPatent,
  pagerankPatent,
  roombaPatent,
  salisburyRobotHandPatent,
  stackhouseManipulatorPatent,
  sundbackZipperPatent,
  watsonRccPatent,
};

export const allPatents: Patent[] = parsePatentCatalog([
  wattSeparateCondenserPatent,
  arkwrightWaterFramePatent,
  wattRotaryEnginePatent,
  cortPuddlingRollingPatent,
  hopkinsPotashPatent,
  whitneyCottonGinPatent,
  mccormickReaperPatent,
  coltRevolverPatent,
  davenportElectricMotorPatent,
  ericssonPropellerPatent,
  morseTelegraphPatent,
  rillieuxEvaporatorPatent,
  goodyearRubberPatent,
  howeSewingMachinePatent,
  corlissSteamEnginePatent,
  lincolnBuoyPatent,
  otisElevatorPatent,
  gatlingGunPatent,
  yaleLockPatent,
  nobelDynamitePatent,
  sholesTypewriterPatent,
  hyattCelluloidPatent,
  grammeDynamoPatent,
  westinghouseAirBrakePatent,
  pasteurFermentationPatent,
  gliddenBarbedWirePatent,
  bellTelephonePatent,
  ottoEnginePatent,
  edisonPhonographPatent,
  edisonLightbulbPatent,
  peltonWaterWheelPatent,
  bellPhotophonePatent,
  delavalSeparatorPatent,
  edisonIndicatorPatent,
  mergenthalerLinotypePatent,
  maximMachineGunPatent,
  thomsonWeldingPatent,
  daimlerEnginePatent,
  teslaMotorPatent,
  eastmanKodakPatent,
  hollerithTabulatingPatent,
  hallAluminiumPatent,
  renoEscalatorPatent,
  dieselEnginePatent,
  marconiRadioPatent,
  teslaCoil593138Patent,
  parsonsTurbinePatent,
  teslaTeleautomatonPatent,
  zeppelinAirshipPatent,
  hewittMercuryLampPatent,
  fessendenWirelessPatent,
  lindeAirLiquefactionPatent, // 1903-05-05
  carrierAirConditionerPatent,
  wrightFlyerPatent,
  deForestAudionPatent,
  baekelandBakelitePatent,
  haberAmmoniaPatent, // 1910-09-27
  goddardRocketPatent,
  sundbackZipperPatent, // 1917-03-20
  farnsworthTvPatent,
  einsteinRefrigeratorPatent,
  lamarrFrequencyHoppingPatent,
  carlsonElectrophotographyPatent, // 1942-10-06
  sikorskyHelicopterPatent, // 1943-05-04
  spencerMicrowavePatent,
  bardeenTransistor2524035Patent,
  landPolaroidPatent, // 1951-02-27
  fermiReactorPatent,
  mestralVelcroPatent, // 1955-09-13
  goertzElectronicMasterSlaveManipulatorPatent, // 1958-08-05
  townesLaserPatent, // 1960-03-22
  noyceIcPatent,
  devolProgrammedTransferPatent,
  lemelsonMachineVisionPatent, // 1963-03-12
  lemelsonAutomaticWarehousingPatent, // 1964-01-28
  kilbyIntegratedCircuitPatent, // 1964-06-23
  amfVersatranPatent, // 1965-10-19
  lemelsonAdjustableManipulatorPatent, // 1966-07-12
  lemelsonAutomaticProductionPatent, // 1967-04-11
  maimanRubyLaserPatent, // 1967-11-14
  engelbartMousePatent,
  kwolekKevlarPatent,
  baerOdysseyPatent, // 1973-04-17
  boyleSmithCcdPatent,
  kamenMedicationInjectionPatent, // 1975-01-07
  metcalfeEthernetPatent, // 1977-12-13
  stackhouseManipulatorPatent, // 1978-01-17
  watsonRccPatent, // 1978-07-04
  wozniakApplePatent,
  makinoScaraPatent, // 1982-07-27
  milacronRobotToolchangerPatent, // 1985-04-23
  hullStereolithographyPatent, // 1986-03-11
  robotEndEffectorPatent, // 1988-08-23
  salisburyRobotHandPatent, // 1990-05-01
  crumpFdmPatent, // 1992-06-09
  kamenTransporterPatent, // 1997-12-30
  eInkPatent, // 2000-09-19
  pagerankPatent, // 2001-09-04
  kamenSegwayPatent, // 2001-10-16
  daVinciPatent, // 2001-12-18
  roombaPatent, // 2003-07-22
  multiTouchPatent, // 2009-01-20
]);

export function getPatentById(id: string): Patent | undefined {
  return allPatents.find((p) => p.id === id);
}

/**
 * Historical catalogue aliases. These are deliberately outside `allPatents`:
 * they preserve inbound links without letting a false patent identity enter
 * static catalogue pages, search results, or structured metadata.
 */
export const LEGACY_PATENT_REDIRECTS = {
  "us-533367-tesla-coil": "us-593138-tesla-coil",
  "us-2569347-bardeen-transistor": "us-2524035-bardeen-transistor",
  "us-3923554-boyle-smith-ccd": "us-3858232-boyle-smith-ccd",
  "us-4098001-watson-remote-center-compliance": "us-4098001-watson-rcc",
  // A prior Fessenden route carried Linde's US 727,650 number. Keep that
  // inbound URL alive, but resolve it only to the source-correct Fessenden
  // record. US 727,650 remains independently catalogued as Linde.
  "us-727650-fessenden-wireless": "us-706737-fessenden-wireless",
} as const;

export function legacyPatentRedirectFor(id: string): string | undefined {
  return LEGACY_PATENT_REDIRECTS[id as keyof typeof LEGACY_PATENT_REDIRECTS];
}

export function getFeaturedPatents(): Patent[] {
  return [
    wrightFlyerPatent,
    teslaMotorPatent,
    edisonPhonographPatent,
    dieselEnginePatent,
    parsonsTurbinePatent,
    teslaTeleautomatonPatent,
    einsteinRefrigeratorPatent,
    lincolnBuoyPatent,
    hallAluminiumPatent,
    wattSeparateCondenserPatent,
    arkwrightWaterFramePatent,
    wattRotaryEnginePatent,
    cortPuddlingRollingPatent,
    hopkinsPotashPatent,
  ];
}

export function getPatentsByCategory(category: string): Patent[] {
  if (category === "all") return allPatents;
  if (category === "aviation") {
    return allPatents.filter((p) => p.category === "aviation" || p.category === "aerospace");
  }
  return allPatents.filter((p) => p.category === category);
}

export function getAdjacentPatents(currentId: string): {
  prev: Patent | null;
  next: Patent | null;
} {
  const index = allPatents.findIndex((p) => p.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? allPatents[index - 1] : null,
    next: index < allPatents.length - 1 ? allPatents[index + 1] : null,
  };
}

export function searchPatents(query: string): Patent[] {
  const q = query.toLowerCase().trim();
  if (!q) return allPatents;
  const qAlphaNum = q.replace(/[^0-9a-zA-Z]/g, "");

  return allPatents.filter((p) => {
    const pNumberAlphaNum = p.patentNumber.replace(/[^0-9a-zA-Z]/g, "").toLowerCase();
    const matchesNumber =
      p.patentNumber.toLowerCase().includes(q) ||
      (qAlphaNum.length >= 3 && pNumberAlphaNum.includes(qAlphaNum));

    return (
      p.id.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.shortTitle.toLowerCase().includes(q) ||
      (p.subtitle ? p.subtitle.toLowerCase().includes(q) : false) ||
      matchesNumber ||
      p.inventors.some((inv) => inv.toLowerCase().includes(q)) ||
      p.inventorLocation.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.era.toLowerCase().includes(q) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
