import * as fs from "node:fs";
import * as path from "node:path";

const indexPath = path.join(process.cwd(), "src", "components", "patents", "visuals", "index.tsx");
let content = fs.readFileSync(indexPath, "utf8");

// List of all 3D modules
const modules = [
  "BardeenTransistor3D",
  "BellTelephone3D",
  "BoyleSmithCcd3D",
  "CarrierAirConditioner3D",
  "ColtRevolver3D",
  "CorlissSteamEngine3D",
  "DaimlerEngine3D",
  "DavenportElectricMotor3D",
  "DeLavalSeparator3D",
  "DieselEngine3D",
  "EastmanKodak3D",
  "EdisonBulb3D",
  "EdisonPhonograph3D",
  "EinsteinRefrigerator3D",
  "EngelbartMouse3D",
  "EricssonPropeller3D",
  "FarnsworthTV3D",
  "FermiReactor3D",
  "GatlingGun3D",
  "GliddenBarbedWire3D",
  "GoddardRocket3D",
  "GoodyearRubber3D",
  "GrammeDynamo3D",
  "HollerithTabulating3D",
  "HoweSewingMachine3D",
  "HyattCelluloid3D",
  "KwolekKevlar3D",
  "LamarrFrequencyHopping3D",
  "LincolnBuoy3D",
  "LindeAirLiquefaction3D",
  "MarconiRadio3D",
  "MaximMachineGun3D",
  "McCormickReaper3D",
  "MergenthalerLinotype3D",
  "MorseTelegraph3D",
  "NobelDynamite3D",
  "NoycePlanarIC3D",
  "OtisElevator3D",
  "OttoEngine3D",
  "ParsonsTurbine3D",
  "PasteurFermentation3D",
  "PeltonWheel3D",
  "RenoEscalator3D",
  "SholesTypewriter3D",
  "SpencerMicrowave3D",
  "TeslaCoil3D",
  "TeslaMotor3D",
  "TeslaTeleautomaton3D",
  "ThomsonWelding3D",
  "WestinghouseAirBrake3D",
  "WhitneyCottonGin3D",
  "WozniakApple3D",
  "WrightFlyer3D",
  "ZeppelinAirship3D",
];

// Remove static imports of 3D modules
for (const m of modules) {
  const regex = new RegExp(`import\\s*\\{\\s*${m}\\s*\\}\\s*from\\s*"./three/${m}";\\n?`, "g");
  content = content.replace(regex, "");
}

// Add next/dynamic import and dynamic definitions
const dynamicImports = `import dynamic from "next/dynamic";

const ThreeLoading = () => (
  <div className="w-full min-h-[420px] rounded-2xl border border-parchment-300 dark:border-ink-800 bg-[#090d16] flex flex-col items-center justify-center p-6 text-center space-y-3">
    <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    <span className="font-mono text-xs text-amber-500 tracking-wider">INITIALIZING THREE.JS WEBGL SIMULATION...</span>
  </div>
);

${modules
  .map(
    (m) =>
      `const ${m} = dynamic(() => import("./three/${m}").then((mod) => mod.${m}), { ssr: false, loading: ThreeLoading });`,
  )
  .join("\n")}
`;

content = content.replace(
  "// 3D WebGL Physics Simulators",
  `// 3D WebGL Physics Simulators\n${dynamicImports}`,
);

fs.writeFileSync(indexPath, content, "utf8");
console.log("Converted 3D visual components to dynamic imports with ssr: false.");
