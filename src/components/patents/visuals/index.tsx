"use client";

import { Box, Layers } from "lucide-react";
import { useState } from "react";
import { BardeenTransistorSim } from "./BardeenTransistorSim";
import { BellTelephoneSim } from "./BellTelephoneSim";
import { BoyleSmithCcdSim } from "./BoyleSmithCcdSim";
import { EdisonBulbSim } from "./EdisonBulbSim";
import { FarnsworthTVSim } from "./FarnsworthTVSim";
import { GoddardRocketSim } from "./GoddardRocketSim";
import { GoodyearRubberSim } from "./GoodyearRubberSim";
import { HoweSewingMachineSim } from "./HoweSewingMachineSim";
import { KwolekKevlarSim } from "./KwolekKevlarSim";
import { LamarrFrequencyHoppingSim } from "./LamarrFrequencyHoppingSim";
import { LincolnBuoySim } from "./LincolnBuoySim";
import { MarconiRadioSim } from "./MarconiRadioSim";
import { MorseTelegraphSim } from "./MorseTelegraphSim";
import { NoycePlanarICSim } from "./NoycePlanarICSim";
import { SpencerMicrowaveSim } from "./SpencerMicrowaveSim";
import { TeslaCoilSim } from "./TeslaCoilSim";
import { TeslaMotorSim } from "./TeslaMotorSim";
import { BellTelephone3D } from "./three/BellTelephone3D";
import { EdisonBulb3D } from "./three/EdisonBulb3D";
import { FarnsworthTV3D } from "./three/FarnsworthTV3D";
import { KwolekKevlar3D } from "./three/KwolekKevlar3D";
import { NoycePlanarIC3D } from "./three/NoycePlanarIC3D";
import { SpencerMicrowave3D } from "./three/SpencerMicrowave3D";
import { TeslaMotor3D } from "./three/TeslaMotor3D";
import { WrightFlyer3D } from "./three/WrightFlyer3D";
import { WrightFlyerSim } from "./WrightFlyerSim";

interface PatentVisualDispatcherProps {
  patentId: string;
}

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  const [renderMode, setRenderMode] = useState<"3d-physics" | "vector-diagram">("3d-physics");

  const has3DMode = [
    "us-821393-wright-flyer",
    "us-381968-tesla-motor",
    "us-223898-edison-lightbulb",
    "us-174465-bell-telephone",
    "us-1773980-farnsworth-tv",
    "us-2495429-spencer-microwave",
    "us-2981877-noyce-ic",
    "us-3671542-kwolek-kevlar",
  ].includes(patentId);

  return (
    <div className="space-y-4">
      {/* 3D vs 2D Toggle Switcher for Flagship Patents */}
      {has3DMode && (
        <div className="flex justify-end">
          <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs sm:text-sm font-mono shadow-sm">
            <button
              type="button"
              onClick={() => setRenderMode("3d-physics")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                renderMode === "3d-physics"
                  ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                  : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
              }`}
            >
              <Box className="w-4 h-4" />
              <span>3D WebGL Physics Engine</span>
            </button>
            <button
              type="button"
              onClick={() => setRenderMode("vector-diagram")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                renderMode === "vector-diagram"
                  ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                  : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>2D Vector Schematic</span>
            </button>
          </div>
        </div>
      )}

      {/* Render Specific Simulation */}
      {(() => {
        switch (patentId) {
          case "us-821393-wright-flyer":
            return renderMode === "3d-physics" ? <WrightFlyer3D /> : <WrightFlyerSim />;
          case "us-381968-tesla-motor":
            return renderMode === "3d-physics" ? <TeslaMotor3D /> : <TeslaMotorSim />;
          case "us-1773980-farnsworth-tv":
            return renderMode === "3d-physics" ? <FarnsworthTV3D /> : <FarnsworthTVSim />;
          case "us-2495429-spencer-microwave":
            return renderMode === "3d-physics" ? <SpencerMicrowave3D /> : <SpencerMicrowaveSim />;
          case "us-2981877-noyce-ic":
            return renderMode === "3d-physics" ? <NoycePlanarIC3D /> : <NoycePlanarICSim />;
          case "us-3671542-kwolek-kevlar":
            return renderMode === "3d-physics" ? <KwolekKevlar3D /> : <KwolekKevlarSim />;
          case "us-223898-edison-lightbulb":
            return renderMode === "3d-physics" ? <EdisonBulb3D /> : <EdisonBulbSim />;
          case "us-174465-bell-telephone":
            return renderMode === "3d-physics" ? <BellTelephone3D /> : <BellTelephoneSim />;
          case "us-6281-lincoln-buoy":
            return <LincolnBuoySim />;
          case "us-4750-howe-sewing-machine":
            return <HoweSewingMachineSim />;
          case "us-533367-tesla-coil":
            return <TeslaCoilSim />;
          case "us-1155986-goddard-rocket":
            return <GoddardRocketSim />;
          case "us-2569347-bardeen-transistor":
            return <BardeenTransistorSim />;
          case "us-3923554-boyle-smith-ccd":
            return <BoyleSmithCcdSim />;
          case "us-586193-marconi-radio":
            return <MarconiRadioSim />;
          case "us-1647-morse-telegraph":
            return <MorseTelegraphSim />;
          case "us-3633-goodyear-rubber":
            return <GoodyearRubberSim />;
          case "us-2292387-lamarr-frequency-hopping":
            return <LamarrFrequencyHoppingSim />;
          default:
            return <WrightFlyer3D />;
        }
      })()}
    </div>
  );
}
