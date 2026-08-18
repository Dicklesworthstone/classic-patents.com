import type { Patent } from "@/types/patent";
import { bardeenTransistorPatent } from "./bardeen-transistor";
import { bellTelephonePatent } from "./bell-telephone";
import { boyleSmithCcdPatent } from "./boyle-smith-ccd";
import { carrierAirConditionerPatent } from "./carrier-air-conditioner";
import { coltRevolverPatent } from "./colt-revolver";
import { corlissSteamEnginePatent } from "./corliss-steam-engine";
import { daimlerEnginePatent } from "./daimler-engine";
import { davenportElectricMotorPatent } from "./davenport-electric-motor";
import { delavalSeparatorPatent } from "./delaval-separator";
import { dieselEnginePatent } from "./diesel-engine";
import { eastmanKodakPatent } from "./eastman-kodak";
import { edisonBulbPatent as edisonLightbulbPatent } from "./edison-lightbulb";
import { edisonPhonographPatent } from "./edison-phonograph";
import { einsteinRefrigeratorPatent } from "./einstein-refrigerator";
import { engelbartMousePatent } from "./engelbart-mouse";
import { ericssonPropellerPatent } from "./ericsson-propeller";
import { farnsworthTvPatent } from "./farnsworth-tv";
import { fermiReactorPatent } from "./fermi-reactor";
import { gatlingGunPatent } from "./gatling-gun";
import { gliddenBarbedWirePatent } from "./glidden-barbed-wire";
import { goddardRocketPatent } from "./goddard-rocket";
import { goodyearRubberPatent } from "./goodyear-rubber";
import { grammeDynamoPatent } from "./gramme-dynamo";
import { hollerithTabulatingPatent } from "./hollerith-tabulating";
import { howeSewingMachinePatent } from "./howe-sewing-machine";
import { hyattCelluloidPatent } from "./hyatt-celluloid";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrPatent as lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { lincolnBuoyPatent } from "./lincoln-buoy";
import { lindeAirLiquefactionPatent } from "./linde-air-liquefaction";
import { marconiRadioPatent } from "./marconi-radio";
import { maximMachineGunPatent } from "./maxim-machine-gun";
import { mccormickReaperPatent } from "./mccormick-reaper";
import { mergenthalerLinotypePatent } from "./mergenthaler-linotype";
import { morseTelegraphPatent } from "./morse-telegraph";
import { nobelDynamitePatent } from "./nobel-dynamite";
import { noyceIcPatent } from "./noyce-ic";
import { otisElevatorPatent } from "./otis-elevator";
import { ottoEnginePatent } from "./otto-engine";
import { parsonsTurbinePatent } from "./parsons-turbine";
import { pasteurFermentationPatent } from "./pasteur-fermentation";
import { peltonWaterWheelPatent } from "./pelton-water-wheel";
import { renoEscalatorPatent } from "./reno-escalator";
import { parsePatentCatalog } from "./schema";
import { sholesTypewriterPatent } from "./sholes-typewriter";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { teslaCoilPatent } from "./tesla-coil";
import { teslaMotorPatent } from "./tesla-motor";
import { teslaTeleautomatonPatent } from "./tesla-teleautomaton";
import { thomsonWeldingPatent } from "./thomson-welding";
import { westinghouseAirBrakePatent } from "./westinghouse-air-brake";
import { whitneyCottonGinPatent } from "./whitney-cotton-gin";
import { wozniakApplePatent } from "./wozniak-apple";
import { wrightFlyerPatent } from "./wright-flyer";
import { zeppelinAirshipPatent } from "./zeppelin-airship";

export const allPatents: Patent[] = parsePatentCatalog([
  whitneyCottonGinPatent,
  mccormickReaperPatent,
  coltRevolverPatent,
  davenportElectricMotorPatent,
  ericssonPropellerPatent,
  morseTelegraphPatent,
  goodyearRubberPatent,
  howeSewingMachinePatent,
  corlissSteamEnginePatent,
  lincolnBuoyPatent,
  otisElevatorPatent,
  gatlingGunPatent,
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
  delavalSeparatorPatent,
  mergenthalerLinotypePatent,
  maximMachineGunPatent,
  thomsonWeldingPatent,
  daimlerEnginePatent,
  teslaMotorPatent,
  eastmanKodakPatent,
  hollerithTabulatingPatent,
  renoEscalatorPatent,
  teslaCoilPatent,
  dieselEnginePatent,
  marconiRadioPatent,
  parsonsTurbinePatent,
  teslaTeleautomatonPatent,
  zeppelinAirshipPatent,
  lindeAirLiquefactionPatent,
  carrierAirConditionerPatent,
  wrightFlyerPatent,
  goddardRocketPatent,
  farnsworthTvPatent,
  einsteinRefrigeratorPatent,
  lamarrFrequencyHoppingPatent,
  spencerMicrowavePatent,
  bardeenTransistorPatent,
  fermiReactorPatent,
  noyceIcPatent,
  engelbartMousePatent,
  kwolekKevlarPatent,
  boyleSmithCcdPatent,
  wozniakApplePatent,
]);

export function getPatentById(id: string): Patent | undefined {
  return allPatents.find((p) => p.id === id);
}

export function getFeaturedPatents(): Patent[] {
  return [
    wrightFlyerPatent,
    teslaMotorPatent,
    edisonPhonographPatent,
    dieselEnginePatent,
    parsonsTurbinePatent,
    teslaTeleautomatonPatent,
    wozniakApplePatent,
    engelbartMousePatent,
    fermiReactorPatent,
    bardeenTransistorPatent,
    noyceIcPatent,
    goddardRocketPatent,
    einsteinRefrigeratorPatent,
    lincolnBuoyPatent,
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
