import type { EnergyChannel } from "@/components/patents/EnergyFlowStrip";
import { stepEdisonBulb, stepEinsteinRefrigerator } from "./catalogKernels";
import { FrankenSimEngine } from "./engine";
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
  if (patentId === "us-1102653-goddard-rocket") {
    // The published source gives no energy-flow values. Do not turn its geometry into a
    // quantitative liquid-propellant model just to fill this optional presentation strip.
    return [];
  }
  if (patentId === "us-3671542-kwolek-kevlar") {
    // The source face is deliberately withheld while its manual edition is
    // incomplete. Do not visualize an invented tensile or impact power flow.
    return [];
  }
  if (patentId === "us-586193-marconi-radio") {
    // The grant's source edition is still under independent review. Its
    // receiver/reset relation contains no source-backed energy-flow values.
    return [];
  }
  if (patentId === "us-2292387-lamarr-frequency-hopping") {
    // Claim 1 specifies a synchronized tuning relation, not source-backed
    // energy values. Keep the visual strip empty while the edition is held.
    return [];
  }
  if (patentId === "us-2708656-fermi-reactor") {
    // Claim 1 supplies a construction/contour relation, not a source-backed
    // energy-flow measurement; leave this optional strip empty while held.
    return [];
  }
  if (patentId === "us-313224-mergenthaler-linotype") {
    // The held source specifies component relationships but no source-backed
    // energy, thermal, pressure, or production-flow values to visualize.
    return [];
  }
  if (patentId === "us-3541541-engelbart-mouse") {
    // The grant supplies no source-backed electrical or mechanical energy
    // values. Keep the optional presentation strip empty while its full
    // handwritten source edition remains under review.
    return [];
  }
  if (patentId === "us-1155986-goddard-rocket") {
    const rocket = FrankenSimEngine.stepGoddardRocket(
      params.chamberPressure ?? 350,
      params.fuelFlowRateKgs ?? 1.8,
      params.throatAreaCm2 ?? 4.2,
      params.expansionRatio ?? 3.5,
    );
    return [
      { name: "Chem. enthalpy", watts: rocket.chemicalEnthalpyWatts, tone: "in" },
      { name: "Exhaust KE", watts: rocket.exhaustKineticWatts, tone: "useful" },
      {
        name: "Heat leak",
        watts: Math.max(0, rocket.chemicalEnthalpyWatts - rocket.exhaustKineticWatts),
        tone: "loss",
      },
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
    // US 381,968 gives apparatus relations but no source values for power,
    // current, or losses. Do not fabricate an energy-flow display.
    return [];
  }
  return [];
}
