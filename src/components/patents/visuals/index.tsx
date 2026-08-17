"use client";

import { BellTelephoneSim } from "./BellTelephoneSim";
import { EdisonBulbSim } from "./EdisonBulbSim";
import { FarnsworthTVSim } from "./FarnsworthTVSim";
import { KwolekKevlarSim } from "./KwolekKevlarSim";
import { NoycePlanarICSim } from "./NoycePlanarICSim";
import { SpencerMicrowaveSim } from "./SpencerMicrowaveSim";
import { TeslaMotorSim } from "./TeslaMotorSim";
import { WrightFlyerSim } from "./WrightFlyerSim";

interface PatentVisualDispatcherProps {
  patentId: string;
}

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  switch (patentId) {
    case "us-821393-wright-flyer":
      return <WrightFlyerSim />;
    case "us-381968-tesla-motor":
      return <TeslaMotorSim />;
    case "us-223898-edison-lightbulb":
      return <EdisonBulbSim />;
    case "us-174465-bell-telephone":
      return <BellTelephoneSim />;
    case "us-1773980-farnsworth-tv":
      return <FarnsworthTVSim />;
    case "us-2981877-noyce-ic":
      return <NoycePlanarICSim />;
    case "us-2495429-spencer-microwave":
      return <SpencerMicrowaveSim />;
    case "us-3671542-kwolek-kevlar":
      return <KwolekKevlarSim />;
    default:
      return <WrightFlyerSim />;
  }
}
