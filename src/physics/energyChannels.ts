import type { EnergyChannel } from "@/components/patents/EnergyFlowStrip";
import { stepEdisonBulb, stepEinsteinRefrigerator } from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
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
    const bulb = stepEdisonBulb({
      voltage: params.voltage ?? 110,
      filamentLength: params.filamentLength,
    });
    const p = bulb.radiantWatts;
    const vis = p * Math.min(0.08, bulb.luminousLmPerW / 40);
    return [
      { name: "Joule heat", watts: p, tone: "in" },
      { name: "Visible", watts: vis, tone: "useful" },
      { name: "IR + cond.", watts: p - vis, tone: "loss" },
    ];
  }
  if (patentId === "us-1155986-goddard-rocket" || patentId === "us-1102653-goddard-rocket") {
    const pc = params.chamberPressure ?? 350;
    const eps = params.expansionRatio ?? 3.5;
    const rocket = FrankenSimEngine.stepGoddardRocket(
      pc,
      params.fuelFlowRateKgs ?? 1.8,
      params.throatAreaCm2 ?? 4.2,
      eps,
    );
    const mdot = params.fuelFlowRateKgs ?? 1.8;
    const th = goddardThermo(pc, eps);
    const chem = mdot * ((th.gamma / (th.gamma - 1)) * 365 * th.chamberTempK);
    const kin = 0.5 * mdot * rocket.exhaustVelocityMps ** 2;
    return [
      { name: "Chem. enthalpy", watts: chem, tone: "in" },
      { name: "Exhaust KE", watts: kin, tone: "useful" },
      { name: "Heat leak", watts: Math.max(0, chem - kin), tone: "loss" },
    ];
  }
  if (patentId === "us-1781541-einstein-refrigerator") {
    const e = stepEinsteinRefrigerator({
      heatInput: params.heatInput ?? 220,
      totalPressure: params.totalPressure ?? 15,
      ammoniaRatio: params.ammoniaRatio,
    });
    return [
      { name: "Burner", watts: e.coolingWatts / Math.max(0.05, e.cop), tone: "in" },
      { name: "Evaporator", watts: e.coolingWatts, tone: "useful" },
      {
        name: "Reject",
        watts: Math.max(0, e.coolingWatts / Math.max(0.05, e.cop) - e.coolingWatts),
        tone: "loss",
      },
    ];
  }
  if (patentId === "us-381968-tesla-motor") {
    const f = params.frequency ?? 60;
    const load = params.loadTorque ?? 38.5;
    const em = FrankenSimEngine.stepTeslaMotor(f, 2, load);
    const rotorRpm = em.synchronousRpm * (1 - em.slipFraction);
    const pout = (load * (rotorRpm * 2 * Math.PI)) / 60;
    const pin = pout / Math.max(0.2, em.efficiencyPct / 100);
    return [
      { name: "Stator input", watts: pin, tone: "in" },
      { name: "Shaft", watts: pout, tone: "useful" },
      { name: "I²R + iron", watts: pin - pout, tone: "loss" },
    ];
  }
  return [];
}
