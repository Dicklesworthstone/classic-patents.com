import type { Patent } from "@/types/patent";
import { bellTelephonePatent } from "./bell-telephone";
import { edisonLightbulbPatent } from "./edison-lightbulb";
import { farnsworthTvPatent } from "./farnsworth-tv";
import { goodyearRubberPatent } from "./goodyear-rubber";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { marconiRadioPatent } from "./marconi-radio";
import { morseTelegraphPatent } from "./morse-telegraph";
import { noyceIcPatent } from "./noyce-ic";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { teslaMotorPatent } from "./tesla-motor";
import { wrightFlyerPatent } from "./wright-flyer";

export const allPatents: Patent[] = [
  morseTelegraphPatent,
  goodyearRubberPatent,
  bellTelephonePatent,
  edisonLightbulbPatent,
  teslaMotorPatent,
  marconiRadioPatent,
  wrightFlyerPatent,
  farnsworthTvPatent,
  lamarrFrequencyHoppingPatent,
  spencerMicrowavePatent,
  noyceIcPatent,
  kwolekKevlarPatent,
];

export function getPatentById(id: string): Patent | undefined {
  return allPatents.find((p) => p.id === id);
}

export function getFeaturedPatents(): Patent[] {
  return [wrightFlyerPatent, teslaMotorPatent, noyceIcPatent, lamarrFrequencyHoppingPatent];
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
      p.summary.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q),
  );
}
