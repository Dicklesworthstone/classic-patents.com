"use client";

import { Box, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

function VisualLoadingFallback() {
  return (
    <div className="w-full h-[520px] rounded-2xl bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 flex flex-col items-center justify-center gap-4 text-ink-600 dark:text-parchment-300 shadow-inner">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-xl border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
        <Box className="w-6 h-6 text-amber-600 absolute inset-0 m-auto animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-serif font-bold text-sm text-ink-900 dark:text-parchment-100">
          Initializing 3D WebGL Physics Engine
        </p>
        <p className="font-sans text-xs text-ink-500 dark:text-ink-400">
          Calibrating studio lighting, shaders &amp; telemetry...
        </p>
      </div>
    </div>
  );
}

function VectorLoadingFallback() {
  return (
    <div className="w-full min-h-[280px] rounded-2xl bg-parchment-100 dark:bg-ink-900 border border-parchment-300 dark:border-ink-800 flex flex-col items-center justify-center gap-3 text-ink-600 dark:text-parchment-300">
      <Layers className="w-6 h-6 text-amber-600 animate-pulse" />
      <p className="font-sans text-xs text-ink-500 dark:text-ink-400">Loading 2D schematic…</p>
    </div>
  );
}

// Dynamically lazy-loaded 3D WebGL Physics Simulators
const WrightFlyer3D = dynamic(() => import("./three/WrightFlyer3D").then((m) => m.WrightFlyer3D), {
  loading: VisualLoadingFallback,
  ssr: false,
});
const TeslaMotor3D = dynamic(() => import("./three/TeslaMotor3D").then((m) => m.TeslaMotor3D), {
  loading: VisualLoadingFallback,
  ssr: false,
});
const FarnsworthTV3D = dynamic(
  () => import("./three/FarnsworthTV3D").then((m) => m.FarnsworthTV3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const SpencerMicrowave3D = dynamic(
  () => import("./three/SpencerMicrowave3D").then((m) => m.SpencerMicrowave3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const NoycePlanarIC3D = dynamic(
  () => import("./three/NoycePlanarIC3D").then((m) => m.NoycePlanarIC3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const KwolekKevlar3D = dynamic(
  () => import("./three/KwolekKevlar3D").then((m) => m.KwolekKevlar3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const EdisonBulb3D = dynamic(() => import("./three/EdisonBulb3D").then((m) => m.EdisonBulb3D), {
  loading: VisualLoadingFallback,
  ssr: false,
});
const BellTelephone3D = dynamic(
  () => import("./three/BellTelephone3D").then((m) => m.BellTelephone3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const LincolnBuoy3D = dynamic(() => import("./three/LincolnBuoy3D").then((m) => m.LincolnBuoy3D), {
  loading: VisualLoadingFallback,
  ssr: false,
});
const HoweSewingMachine3D = dynamic(
  () => import("./three/HoweSewingMachine3D").then((m) => m.HoweSewingMachine3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const TeslaCoil3D = dynamic(() => import("./three/TeslaCoil3D").then((m) => m.TeslaCoil3D), {
  loading: VisualLoadingFallback,
  ssr: false,
});
const GoddardRocket3D = dynamic(
  () => import("./three/GoddardRocket3D").then((m) => m.GoddardRocket3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const BardeenTransistor3D = dynamic(
  () => import("./three/BardeenTransistor3D").then((m) => m.BardeenTransistor3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const BoyleSmithCcd3D = dynamic(
  () => import("./three/BoyleSmithCcd3D").then((m) => m.BoyleSmithCcd3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const MarconiRadio3D = dynamic(
  () => import("./three/MarconiRadio3D").then((m) => m.MarconiRadio3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const MorseTelegraph3D = dynamic(
  () => import("./three/MorseTelegraph3D").then((m) => m.MorseTelegraph3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const GoodyearRubber3D = dynamic(
  () => import("./three/GoodyearRubber3D").then((m) => m.GoodyearRubber3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const LamarrFrequencyHopping3D = dynamic(
  () => import("./three/LamarrFrequencyHopping3D").then((m) => m.LamarrFrequencyHopping3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const EngelbartMouse3D = dynamic(
  () => import("./three/EngelbartMouse3D").then((m) => m.EngelbartMouse3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const FermiReactor3D = dynamic(
  () => import("./three/FermiReactor3D").then((m) => m.FermiReactor3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const WozniakApple3D = dynamic(
  () => import("./three/WozniakApple3D").then((m) => m.WozniakApple3D),
  { loading: VisualLoadingFallback, ssr: false },
);
const EinsteinRefrigerator3D = dynamic(
  () => import("./three/EinsteinRefrigerator3D").then((m) => m.EinsteinRefrigerator3D),
  { loading: VisualLoadingFallback, ssr: false },
);

// Dynamically lazy-loaded 2D Vector Schematics
const WrightFlyerSim = dynamic(() => import("./WrightFlyerSim").then((m) => m.WrightFlyerSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const TeslaMotorSim = dynamic(() => import("./TeslaMotorSim").then((m) => m.TeslaMotorSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const FarnsworthTVSim = dynamic(() => import("./FarnsworthTVSim").then((m) => m.FarnsworthTVSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const SpencerMicrowaveSim = dynamic(
  () => import("./SpencerMicrowaveSim").then((m) => m.SpencerMicrowaveSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const NoycePlanarICSim = dynamic(
  () => import("./NoycePlanarICSim").then((m) => m.NoycePlanarICSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const KwolekKevlarSim = dynamic(() => import("./KwolekKevlarSim").then((m) => m.KwolekKevlarSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const EdisonBulbSim = dynamic(() => import("./EdisonBulbSim").then((m) => m.EdisonBulbSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const BellTelephoneSim = dynamic(
  () => import("./BellTelephoneSim").then((m) => m.BellTelephoneSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const LincolnBuoySim = dynamic(() => import("./LincolnBuoySim").then((m) => m.LincolnBuoySim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const HoweSewingMachineSim = dynamic(
  () => import("./HoweSewingMachineSim").then((m) => m.HoweSewingMachineSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const TeslaCoilSim = dynamic(() => import("./TeslaCoilSim").then((m) => m.TeslaCoilSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const GoddardRocketSim = dynamic(
  () => import("./GoddardRocketSim").then((m) => m.GoddardRocketSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const BardeenTransistorSim = dynamic(
  () => import("./BardeenTransistorSim").then((m) => m.BardeenTransistorSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const BoyleSmithCcdSim = dynamic(
  () => import("./BoyleSmithCcdSim").then((m) => m.BoyleSmithCcdSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const MarconiRadioSim = dynamic(() => import("./MarconiRadioSim").then((m) => m.MarconiRadioSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const MorseTelegraphSim = dynamic(
  () => import("./MorseTelegraphSim").then((m) => m.MorseTelegraphSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const GoodyearRubberSim = dynamic(
  () => import("./GoodyearRubberSim").then((m) => m.GoodyearRubberSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const LamarrFrequencyHoppingSim = dynamic(
  () => import("./LamarrFrequencyHoppingSim").then((m) => m.LamarrFrequencyHoppingSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const EngelbartMouseSim = dynamic(
  () => import("./EngelbartMouseSim").then((m) => m.EngelbartMouseSim),
  { loading: VectorLoadingFallback, ssr: false },
);
const FermiReactorSim = dynamic(() => import("./FermiReactorSim").then((m) => m.FermiReactorSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const WozniakAppleSim = dynamic(() => import("./WozniakAppleSim").then((m) => m.WozniakAppleSim), {
  loading: VectorLoadingFallback,
  ssr: false,
});
const EinsteinRefrigeratorSim = dynamic(
  () => import("./EinsteinRefrigeratorSim").then((m) => m.EinsteinRefrigeratorSim),
  { loading: VectorLoadingFallback, ssr: false },
);

interface PatentVisualDispatcherProps {
  patentId: string;
}

const VECTOR_DIAGRAM_IDS = new Set([
  "us-821393-wright-flyer",
  "us-381968-tesla-motor",
  "us-1773980-farnsworth-tv",
  "us-2495429-spencer-microwave",
  "us-2981877-noyce-ic",
  "us-3671542-kwolek-kevlar",
  "us-3819786-kwolek-kevlar",
  "us-223898-edison-lightbulb",
  "us-174465-bell-telephone",
  "us-6281-lincoln-buoy",
  "us-4750-howe-sewing-machine",
  "us-533367-tesla-coil",
  "us-593138-tesla-coil",
  "us-1155986-goddard-rocket",
  "us-1102653-goddard-rocket",
  "us-2569347-bardeen-transistor",
  "us-2524191-bardeen-transistor",
  "us-3923554-boyle-smith-ccd",
  "us-3792322-boyle-smith-ccd",
  "us-586193-marconi-radio",
  "us-1647-morse-telegraph",
  "us-3633-goodyear-rubber",
  "us-2292387-lamarr-frequency-hopping",
  "us-3541541-engelbart-mouse",
  "us-2708656-fermi-reactor",
  "us-4136359-wozniak-apple",
  "us-1781541-einstein-refrigerator",
]);

export function PatentVisualDispatcher({ patentId }: PatentVisualDispatcherProps) {
  const [renderMode, setRenderMode] = useState<"3d-physics" | "vector-diagram">("3d-physics");
  const hasVectorDiagram = VECTOR_DIAGRAM_IDS.has(patentId);
  const activeMode = hasVectorDiagram ? renderMode : "3d-physics";

  return (
    <div className="space-y-4">
      {/* 3D vs 2D Toggle Switcher */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800 text-xs sm:text-sm font-sans shadow-sm">
          <button
            type="button"
            onClick={() => setRenderMode("3d-physics")}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-all ${
              activeMode === "3d-physics"
                ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
            }`}
          >
            <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>3D Engine</span>
          </button>
          {hasVectorDiagram && (
            <button
              type="button"
              onClick={() => setRenderMode("vector-diagram")}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition-all ${
                activeMode === "vector-diagram"
                  ? "bg-amber-700 text-white font-bold shadow dark:bg-amber-600"
                  : "text-ink-700 dark:text-parchment-300 hover:text-ink-950 font-medium"
              }`}
            >
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>2D Schematic</span>
            </button>
          )}
        </div>
      </div>

      {/* Render Specific Dynamic Simulation */}
      {(() => {
        switch (patentId) {
          case "us-821393-wright-flyer":
            return activeMode === "3d-physics" ? <WrightFlyer3D /> : <WrightFlyerSim />;
          case "us-381968-tesla-motor":
            return activeMode === "3d-physics" ? <TeslaMotor3D /> : <TeslaMotorSim />;
          case "us-1773980-farnsworth-tv":
            return activeMode === "3d-physics" ? <FarnsworthTV3D /> : <FarnsworthTVSim />;
          case "us-2495429-spencer-microwave":
            return activeMode === "3d-physics" ? <SpencerMicrowave3D /> : <SpencerMicrowaveSim />;
          case "us-2981877-noyce-ic":
            return activeMode === "3d-physics" ? <NoycePlanarIC3D /> : <NoycePlanarICSim />;
          case "us-3671542-kwolek-kevlar":
          case "us-3819786-kwolek-kevlar":
            return activeMode === "3d-physics" ? <KwolekKevlar3D /> : <KwolekKevlarSim />;
          case "us-223898-edison-lightbulb":
            return activeMode === "3d-physics" ? <EdisonBulb3D /> : <EdisonBulbSim />;
          case "us-174465-bell-telephone":
            return activeMode === "3d-physics" ? <BellTelephone3D /> : <BellTelephoneSim />;
          case "us-6281-lincoln-buoy":
            return activeMode === "3d-physics" ? <LincolnBuoy3D /> : <LincolnBuoySim />;
          case "us-4750-howe-sewing-machine":
            return activeMode === "3d-physics" ? <HoweSewingMachine3D /> : <HoweSewingMachineSim />;
          case "us-533367-tesla-coil":
          case "us-593138-tesla-coil":
            return activeMode === "3d-physics" ? <TeslaCoil3D /> : <TeslaCoilSim />;
          case "us-1155986-goddard-rocket":
          case "us-1102653-goddard-rocket":
            return activeMode === "3d-physics" ? <GoddardRocket3D /> : <GoddardRocketSim />;
          case "us-2569347-bardeen-transistor":
          case "us-2524191-bardeen-transistor":
            return activeMode === "3d-physics" ? <BardeenTransistor3D /> : <BardeenTransistorSim />;
          case "us-3923554-boyle-smith-ccd":
          case "us-3792322-boyle-smith-ccd":
            return activeMode === "3d-physics" ? <BoyleSmithCcd3D /> : <BoyleSmithCcdSim />;
          case "us-586193-marconi-radio":
            return activeMode === "3d-physics" ? <MarconiRadio3D /> : <MarconiRadioSim />;
          case "us-1647-morse-telegraph":
            return activeMode === "3d-physics" ? <MorseTelegraph3D /> : <MorseTelegraphSim />;
          case "us-3633-goodyear-rubber":
            return activeMode === "3d-physics" ? <GoodyearRubber3D /> : <GoodyearRubberSim />;
          case "us-2292387-lamarr-frequency-hopping":
            return activeMode === "3d-physics" ? (
              <LamarrFrequencyHopping3D />
            ) : (
              <LamarrFrequencyHoppingSim />
            );
          case "us-3541541-engelbart-mouse":
            return activeMode === "3d-physics" ? <EngelbartMouse3D /> : <EngelbartMouseSim />;
          case "us-2708656-fermi-reactor":
            return activeMode === "3d-physics" ? <FermiReactor3D /> : <FermiReactorSim />;
          case "us-4136359-wozniak-apple":
            return activeMode === "3d-physics" ? <WozniakApple3D /> : <WozniakAppleSim />;
          case "us-1781541-einstein-refrigerator":
            return activeMode === "3d-physics" ? (
              <EinsteinRefrigerator3D />
            ) : (
              <EinsteinRefrigeratorSim />
            );
          default:
            return (
              <div className="w-full min-h-[240px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-900 flex items-center justify-center p-6 text-center">
                <p className="font-sans text-sm text-ink-600 dark:text-ink-300">
                  No interactive physics module is registered for this patent yet.
                </p>
              </div>
            );
        }
      })()}
    </div>
  );
}
