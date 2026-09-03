import { stepTeslaMotorFig9 } from "@/physics/teslaKernel";
import { WRIGHT_PATENT_ID } from "@/physics/wrightKernel";

export function claimLiveState(
  patentId: string | undefined,
  claimNum: number,
  params: Record<string, number>,
): "held" | "broken" | null {
  if (!patentId) return null;
  if (
    patentId === WRIGHT_PATENT_ID ||
    patentId.includes("wright-flyer") ||
    patentId.includes("821393")
  ) {
    if (claimNum === 1 || claimNum === 2) {
      return (params.coupled ?? 1) >= 0.5 ? "held" : "broken";
    }
  }
  if (patentId.includes("tesla-motor") && claimNum === 1) {
    const frequencyHz = params.frequency;
    if (typeof frequencyHz !== "number" || !Number.isFinite(frequencyHz)) return null;
    const apparatus = stepTeslaMotorFig9(frequencyHz);
    return frequencyHz > 0 && apparatus.phaseCycleHz > 0 ? "held" : "broken";
  }
  if (patentId.includes("fermi") && claimNum === 1) {
    // Registry control is "rodWithdrawal" (%); past ~85% the pile loses k_eff margin.
    return (params.rodWithdrawal ?? 83.5) <= 85 ? "held" : "broken";
  }
  if (patentId.includes("goodyear") && claimNum === 1) {
    const s = params.sulfurPct ?? 8;
    return s >= 2 && s <= 20 ? "held" : "broken";
  }
  if (patentId.includes("bardeen-transistor") && claimNum === 1) {
    return (params.pointSpacingMicrons ?? 50) <= 100 ? "held" : "broken";
  }
  if (patentId.includes("goddard-rocket") && claimNum === 1) {
    return (params.chamberPressure ?? 350) >= 120 ? "held" : "broken";
  }
  if (patentId.includes("spencer-microwave") && claimNum === 1) {
    return (params.rfPowerSetting ?? 800) >= 200 ? "held" : "broken";
  }
  if (patentId.includes("boyle-smith-ccd") && claimNum === 1) {
    return (params.claim1SingleConductivityPresent ?? 1) >= 0.5 ? "held" : "broken";
  }
  if (patentId.includes("lamarr-frequency-hopping") && claimNum === 1) {
    // Claim 1 requires the receiver strip in synchronism with the transmitter;
    // the 3D face defines "receiver tuned" as recordPosition >= 3.
    return (params.recordPosition ?? 0) >= 3 ? "held" : "broken";
  }
  if (patentId.includes("farnsworth-tv") && claimNum === 1) {
    return (params.anodeVoltage ?? 1500) >= 400 ? "held" : "broken";
  }
  if (patentId.includes("otto-engine") && claimNum === 1) {
    return (params.claim1ChargeGradingPresent ?? 1) >= 0.5 ? "held" : "broken";
  }
  if (patentId === "us-608969-parsons-turbine") {
    if (claimNum === 1) {
      const topology = params.routeTopology;
      if (typeof topology !== "number" || !Number.isFinite(topology)) return null;
      return topology >= 0 && topology <= 2 ? "held" : "broken";
    }
    if (claimNum === 2 || claimNum === 3) {
      const reversing = params.reversingTurbineEnabled;
      if (typeof reversing !== "number" || !Number.isFinite(reversing)) return null;
      return reversing >= 0.5 ? "held" : "broken";
    }
  }
  if (patentId.includes("marconi") && claimNum === 1) {
    return (params.mastHeightM ?? 45) >= 20 ? "held" : "broken";
  }
  if (patentId.includes("morse") && claimNum === 1) {
    return (params.wpmSpeed ?? 20) >= 5 ? "held" : "broken";
  }
  if (patentId.includes("westinghouse") && claimNum === 1) {
    return (params.trainPipePressure ?? 70) <= 65 ? "held" : "broken";
  }
  if (patentId.includes("pelton") && claimNum === 1) {
    // Pelton's registry models claim 1 directly as the claim1Active control.
    return (params.claim1Active ?? 1) >= 0.5 ? "held" : "broken";
  }
  if (patentId.includes("hyatt") && claimNum === 1) {
    return (params.steamTempC ?? 125) >= 100 ? "held" : "broken";
  }
  if (patentId.includes("delaval") && claimNum === 1) {
    return (params.bowlRpm ?? 6000) >= 3000 ? "held" : "broken";
  }
  if (patentId.includes("tesla-coil") && claimNum === 1) {
    return (params.claim1CommonNodeConnected ?? 1) >= 0.5 ? "held" : "broken";
  }
  if (patentId.includes("roomba") && claimNum === 1) {
    return (params.opticalSensorEnabled ?? 1) >= 0.5 ? "held" : "broken";
  }
  if (patentId.includes("lincoln") && claimNum === 1) {
    return (params.inflationPct ?? 80) >= 20 ? "held" : "broken";
  }
  if (patentId.includes("howe") && claimNum === 1) {
    return (params.crankRpm ?? 240) >= 60 ? "held" : "broken";
  }
  if (patentId.includes("otis") && claimNum === 1) {
    return (params.cableTensionPct ?? 100) >= 10 ? "held" : "broken";
  }
  if (patentId.includes("gatling") && claimNum === 1) {
    return (params.crankRpm ?? 200) >= 50 ? "held" : "broken";
  }
  if (patentId.includes("nobel") && claimNum === 1) {
    return (params.ngConcentrationPct ?? 75) >= 50 ? "held" : "broken";
  }
  if (patentId.includes("sholes") && claimNum === 1) {
    return (params.typingSpeedWpm ?? 40) >= 10 ? "held" : "broken";
  }
  if (patentId.includes("gramme") && claimNum === 1) {
    // Registry control is an illustrative relative shaft-rate factor (0.4–1.6,
    // nominal 1.0); probe holds at or above the nominal rating.
    return (params.shaftRate ?? 1) >= 1 ? "held" : "broken";
  }
  if (patentId === "us-135245-pasteur-fermentation" && claimNum === 1) {
    const co2SweepPct = params.co2SweepPct ?? 100;
    const sprayCoveragePct = params.sprayCoveragePct ?? 100;
    return co2SweepPct > 0 && sprayCoveragePct > 0 ? "held" : "broken";
  }
  if (patentId.includes("glidden") && claimNum === 1) {
    return (params.twistsPerFoot ?? 4) >= 2 ? "held" : "broken";
  }
  if (patentId.includes("engelbart-mouse") && claimNum === 1) {
    return (params.mouseSpeed ?? 350) > 0 ? "held" : "broken";
  }
  if (patentId.includes("townes-laser") && claimNum === 1) {
    return (params.pumpPowerWatts ?? 350) >= 100 ? "held" : "broken";
  }
  if (patentId.includes("kilby") && claimNum === 1) {
    return (params.supplyVoltageV ?? 6.0) >= 2.0 ? "held" : "broken";
  }
  return null;
}
