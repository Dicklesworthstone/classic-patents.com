import type { Patent } from "@/types/patent";
import { bardeenTransistorPatent } from "./bardeen-transistor";
import { bellTelephonePatent } from "./bell-telephone";
import { boyleSmithCcdPatent } from "./boyle-smith-ccd";
import { edisonBulbPatent as edisonLightbulbPatent } from "./edison-lightbulb";
import { einsteinRefrigeratorPatent } from "./einstein-refrigerator";
import { engelbartMousePatent } from "./engelbart-mouse";
import { farnsworthTvPatent } from "./farnsworth-tv";
import { fermiReactorPatent } from "./fermi-reactor";
import { goddardRocketPatent } from "./goddard-rocket";
import { goodyearRubberPatent } from "./goodyear-rubber";
import { howeSewingMachinePatent } from "./howe-sewing-machine";
import { kwolekKevlarPatent } from "./kwolek-kevlar";
import { lamarrPatent as lamarrFrequencyHoppingPatent } from "./lamarr-frequency-hopping";
import { lincolnBuoyPatent } from "./lincoln-buoy";
import { marconiRadioPatent } from "./marconi-radio";
import { morseTelegraphPatent } from "./morse-telegraph";
import { noyceIcPatent } from "./noyce-ic";
import { parsePatentCatalog } from "./schema";
import { spencerMicrowavePatent } from "./spencer-microwave";
import { teslaCoilPatent } from "./tesla-coil";
import { teslaMotorPatent } from "./tesla-motor";
import { wozniakApplePatent } from "./wozniak-apple";
import { wrightFlyerPatent } from "./wright-flyer";

export const allPatents: Patent[] = parsePatentCatalog([
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
  einsteinRefrigeratorPatent,
  farnsworthTvPatent,
  lamarrFrequencyHoppingPatent,
  spencerMicrowavePatent,
  fermiReactorPatent,
  bardeenTransistorPatent,
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
  return allPatents.filter((p) => p.category === category);
}

export function getAdjacentPatents(currentId: string): {
  prev: Patent | null;
  next: Patent | null;
} {
  // Catalog order is not strictly chronological (e.g. Fermi 1955 sits before Bardeen 1951).
  const chronological = [...allPatents].sort((a, b) => a.grantDate.localeCompare(b.grantDate));
  const index = chronological.findIndex((p) => p.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? chronological[index - 1] : null,
    next: index < chronological.length - 1 ? chronological[index + 1] : null,
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
      p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });
}
