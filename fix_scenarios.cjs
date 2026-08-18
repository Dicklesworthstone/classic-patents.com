const fs = require("fs");
const files = [
  "src/components/patents/visuals/three/EdisonPhonograph3D.tsx",
  "src/components/patents/visuals/three/GliddenBarbedWire3D.tsx",
  "src/components/patents/visuals/three/TeslaTeleautomaton3D.tsx",
  "src/components/patents/visuals/three/MergenthalerLinotype3D.tsx",
  "src/components/patents/visuals/three/ZeppelinAirship3D.tsx",
  "src/components/patents/visuals/three/CorlissEngine3D.tsx",
  "src/components/patents/visuals/three/RenoEscalator3D.tsx",
  "src/components/patents/visuals/three/EastmanKodak3D.tsx",
  "src/components/patents/visuals/three/PeltonWheel3D.tsx",
];

for (const f of files) {
  let content = fs.readFileSync(f, "utf8");

  // Remove ScenarioPreset interface
  content = content.replace(/interface ScenarioPreset \{[\s\S]*?\}/, "");

  // Remove SCENARIOS array
  content = content.replace(/const SCENARIOS: ScenarioPreset\[\] = \[[\s\S]*?\];/, "");
  content = content.replace(/const _SCENARIOS: ScenarioPreset\[\] = \[[\s\S]*?\];/, "");

  // Remove applyScenario function
  content = content.replace(/const applyScenario = \(s: ScenarioPreset\) => \{[\s\S]*?\};\n/, "");
  content = content.replace(/const _applyScenario = \(s: ScenarioPreset\) => \{[\s\S]*?\};\n/, "");

  // Try to remove bottom panel (we'll just use a rough heuristic, the UI overlay block)
  // Specifically, look for the Interactive Controls block
  content = content.replace(
    /\{\/\* Bottom Telemetry Bar & Controls \*\/\}[\s\S]*?\{\/\* Camera Views Bar \*\/}/,
    "{/* Camera Views Bar */}",
  );
  content = content.replace(
    /\{\/\* Bottom Control Bar \*\/\}[\s\S]*?\{\/\* Camera Views Bar \*\/}/,
    "{/* Camera Views Bar */}",
  );
  content = content.replace(
    /\{\/\* Interactive Controls \*\/\}[\s\S]*?\{\/\* Camera Views Bar \*\/}/,
    "{/* Camera Views Bar */}",
  );

  fs.writeFileSync(f, content, "utf8");
}
