import type { Patent } from "@/types/patent";
import { bardeenTransistorPatent } from "./bardeen-transistor";
import { bellTelephonePatent } from "./bell-telephone";
import { boyleSmithCcdPatent } from "./boyle-smith-ccd";
import { edisonLightbulbPatent } from "./edison-lightbulb";
import { farnsworthTvPatent } from "./farnsworth-tv";
import { goddardRocketPatent } from "./goddard-rocket";
import { goodyearRubberPatent } from "./goodyear-rubber";
import { howeSewingMachinePatent } from "./howe-sewing-machine";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { lincolnBuoyPatent } from "./lincoln-buoy";
import { marconiRadioPatent } from "./marconi-radio";
import { morseTelegraphPatent } from "./morse-telegraph";
import { noyceIcPatent } from "./noyce-ic";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { teslaCoilPatent } from "./tesla-coil";
import { teslaMotorPatent } from "./tesla-motor";
import { wrightFlyerPatent } from "./wright-flyer";

export const allPatents: Patent[] = [
  morseTelegraphPatent,
  goodyearRubberPatent,
  howeSewingMachinePatent,
  lincolnBuoyPatent,
  bellTelephonePatent,
  edisonLightbulbPatent,
  teslaMotorPatent,
  teslaCoilPatent,
  marconiRadioPatent,
  wrightFlyerPatent,
  goddardRocketPatent,
  farnsworthTvPatent,
  lamarrFrequencyHoppingPatent,
  spencerMicrowavePatent,
  bardeenTransistorPatent,
  noyceIcPatent,
  kwolekKevlarPatent,
  boyleSmithCcdPatent,
];

export function getPatentById(id: string): Patent | undefined {
  return allPatents.find((p) => p.id === id);
}

export function getFeaturedPatents(): Patent[] {
  return [
    wrightFlyerPatent,
    teslaMotorPatent,
    bardeenTransistorPatent,
    noyceIcPatent,
    goddardRocketPatent,
    lincolnBuoyPatent,
  ];
}

export function getPatentsByCategory(category: string): Patent[] {
  if (category === "all") return allPatents;
  return allPatents.filter((p) => p.category === category);
}

export function searchPatents(query: string): Patent[] {
  const q = query.toLowerCase().trim();
  if (!q) return allPatents;
  return allPatents.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.shortTitle.toLowerCase().includes(q) ||
      p.patentNumber.toLowerCase().includes(q) ||
      p.inventors.some((inv) => inv.toLowerCase().includes(q)) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  );
}
