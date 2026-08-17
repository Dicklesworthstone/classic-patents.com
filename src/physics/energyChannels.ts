import type { EnergyChannel } from "@/components/patents/EnergyFlowStrip";
import { goddardThermo } from "./thermochem";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

export function energyChannelsFor(
  patentId: string,
  params: Record<string, number>,
): EnergyChannel[] {
  if (patentId === "us-821393-wright-flyer") {
    const si = stepWrightFlyerSi(readWrightControls(params));
    const v = (params.airspeed ?? 28) * 0.44704;
    const powerInd = si.inducedDragNewtons * v;
    const powerLift = si.liftNewtons * v * 0.08;
    return [
      { name: "Thrust · v", watts: si.totalDragNewtons * v, tone: "in" },
      { name: "Lift work", watts: powerLift, tone: "useful" },
      { name: "Induced drag", watts: powerInd, tone: "loss" },
    ];
  }
  if (patentId === "us-223898-edison-lightbulb") {
    const v = params.voltage ?? 110;
    const r = 90 + ((1200 + (v / 130) * 1150) / 2350) * 60;
    const p = v ** 2 / r;
    const vis = p * 0.02;
    return [
      { name: "Joule heat", watts: p, tone: "in" },
      { name: "Visible", watts: vis, tone: "useful" },
      { name: "IR + cond.", watts: p - vis, tone: "loss" },
    ];
  }
  if (patentId === "us-1155986-goddard-rocket") {
    const th = goddardThermo(params.chamberPressure ?? 350, params.expansionRatio ?? 3.5);
    const mdot = 0.205 * ((params.chamberPressure ?? 350) / 350);
    const chem = mdot * 1.2e6;
    const kin = 0.5 * mdot * th.veMps ** 2;
    return [
      { name: "Chem. enthalpy", watts: chem, tone: "in" },
      { name: "Exhaust KE", watts: kin, tone: "useful" },
      { name: "Heat leak", watts: Math.max(0, chem - kin), tone: "loss" },
    ];
  }
  if (patentId === "us-1781541-einstein-refrigerator") {
    const qIn = params.heatInput ?? 220;
    const press = params.totalPressure ?? 15;
    const evapTemp = -25 + (press - 10) * 1.4;
    const cop = 0.32 * (1 - Math.abs(evapTemp) / 120);
    return [
      { name: "Burner", watts: qIn, tone: "in" },
      { name: "Evaporator", watts: qIn * cop, tone: "useful" },
      { name: "Reject", watts: qIn * (1 - cop), tone: "loss" },
    ];
  }
  if (patentId === "us-381968-tesla-motor") {
    const f = params.frequency ?? 60;
    const load = params.loadTorque ?? 20;
    const pin = 80 + f * 1.2 + load * 8;
    const pout = pin * 0.82;
    return [
      { name: "Stator input", watts: pin, tone: "in" },
      { name: "Shaft", watts: pout, tone: "useful" },
      { name: "I²R + iron", watts: pin - pout, tone: "loss" },
    ];
  }
  return [];
}
