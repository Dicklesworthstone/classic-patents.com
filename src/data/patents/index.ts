import type { Patent } from "@/types/patent";
import { arkwrightWaterFramePatent } from "./arkwright-water-frame";
import { baekelandBakelitePatent } from "./baekeland-bakelite";
import { bardeenTransistor2524035Patent } from "./bardeen-transistor-2524035";
import { bellPhotophonePatent } from "./bell-photophone";
import { bellTelephonePatent } from "./bell-telephone";
import { boyleSmithCcdPatent } from "./boyle-smith-ccd";
import { carlsonElectrophotographyPatent } from "./carlson-electrophotography";
import { carrierAirConditionerPatent } from "./carrier-air-conditioner";
import { coltRevolverPatent } from "./colt-revolver";
import { corlissSteamEnginePatent } from "./corliss-steam-engine";
import { cortPuddlingRollingPatent } from "./cort-puddling-rolling";
import { daimlerEnginePatent } from "./daimler-engine";
import { davenportElectricMotorPatent } from "./davenport-electric-motor";
import { daVinciPatent } from "./davinci";
import { deForestAudionPatent } from "./de-forest-audion";
import { delavalSeparatorPatent } from "./delaval-separator";
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
import { goodyearRubberPatent } from "./goodyear-rubber";
import { grammeDynamoPatent } from "./gramme-dynamo";
import { haberAmmoniaPatent } from "./haber-ammonia";
import { hallAluminiumPatent } from "./hall-aluminium";
import { hewittMercuryLampPatent } from "./hewitt-mercury-lamp";
import { hollerithTabulatingPatent } from "./hollerith-tabulating";
import { hopkinsPotashPatent } from "./hopkins-potash";
import { howeSewingMachinePatent } from "./howe-sewing-machine";
import { hyattCelluloidPatent } from "./hyatt-celluloid";
import { kilbyIntegratedCircuitPatent } from "./kilby-integrated-circuit";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrPatent as lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { landPolaroidPatent } from "./land-polaroid";
import { lincolnBuoyPatent } from "./lincoln-buoy";
import { lindeAirLiquefactionPatent } from "./linde-air-liquefaction";
import { maimanRubyLaserPatent } from "./maiman-ruby-laser";
import { marconiRadioPatent } from "./marconi-radio";
import { maximMachineGunPatent } from "./maxim-machine-gun";
import { mccormickReaperPatent } from "./mccormick-reaper";
import { mergenthalerLinotypePatent } from "./mergenthaler-linotype";
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
import { roombaPatent } from "./roomba";
import { parsePatentCatalog } from "./schema";
import { sholesTypewriterPatent } from "./sholes-typewriter";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { teslaCoil593138Patent } from "./tesla-coil-593138";
import { teslaMotorPatent } from "./tesla-motor";
import { teslaTeleautomatonPatent } from "./tesla-teleautomaton";
import { thomsonWeldingPatent } from "./thomson-welding";
import { townesLaserPatent } from "./townes-laser";
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
  daVinciPatent,
  eInkPatent,
  fessendenWirelessPatent,
  haberAmmoniaPatent,
  hewittMercuryLampPatent,
  multiTouchPatent,
  pagerankPatent,
  roombaPatent,
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
  farnsworthTvPatent,
  einsteinRefrigeratorPatent,
  lamarrFrequencyHoppingPatent,
  spencerMicrowavePatent,
  bardeenTransistor2524035Patent,
  landPolaroidPatent, // 1951-02-27
  fermiReactorPatent,
  townesLaserPatent, // 1960-03-22
  noyceIcPatent,
  kilbyIntegratedCircuitPatent, // 1964-06-23
  maimanRubyLaserPatent, // 1967-11-14
  engelbartMousePatent,
  kwolekKevlarPatent,
  boyleSmithCcdPatent,
  wozniakApplePatent,
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
  return allPatents.filter((p) => {
    return (
      p.title.toLowerCase().includes(q) ||
      p.shortTitle.toLowerCase().includes(q) ||
      p.patentNumber.toLowerCase().includes(q) ||
      p.inventors.some((inv) => inv.toLowerCase().includes(q)) ||
      p.inventorLocation.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.era.toLowerCase().includes(q) ||
      p.tags?.some((tag) => tag.toLowerCase().includes(q))
    );
  });
}
