import fs from "fs";

const files = [
  "src/components/patents/visuals/three/SholesTypewriter3D.tsx",
  "src/components/patents/visuals/three/GrammeDynamo3D.tsx",
  "src/components/patents/visuals/three/HyattCelluloid3D.tsx",
  "src/components/patents/visuals/three/CorlissSteamEngine3D.tsx",
  "src/components/patents/visuals/three/GatlingGun3D.tsx",
  "src/components/patents/visuals/three/HollerithTabulating3D.tsx",
  "src/components/patents/visuals/three/EricssonPropeller3D.tsx",
  "src/components/patents/visuals/three/ThomsonWelding3D.tsx",
];

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");

  // Remove interface ScenarioPreset
  content = content.replace(/interface ScenarioPreset \{[\s\S]*?\n\}\n\n/, "");

  // Remove SCENARIOS array
  content = content.replace(
    /const _?SCENARIOS(?:_PRESETS)?: ScenarioPreset\[\] = \[[\s\S]*?\n\];\n\n/,
    "",
  );
  content = content.replace(
    /const _?SCENARIOS(?:_PRESETS)?: ScenarioPreset\[\] = \[[\s\S]*?\n\];\n/,
    "",
  );

  // Remove applyScenario
  content = content.replace(/ {2}const _?applyScenario = \([\s\S]*?\}\n {4}\}\n {2}\};\n\n/, "");
  content = content.replace(/ {2}const _?applyScenario = \([\s\S]*?\}\n {2}\};\n\n/, "");

  // Remove showUiOverlay state
  content = content.replace(
    / {2}const \[(?:_)?showUiOverlay, (?:_)?setShowUiOverlay\] = useState<boolean>\(true\);\n/,
    "",
  );

  // Remove Zap button (various formatting, but it has Zap)
  content = content.replace(
    / {10}<button\s+type="button"\s+onClick=\{[^}]*setShowUiOverlay[^}]*\}[^>]*>\s*<Zap [^>]*\/>\s*<\/button>\s*/,
    "",
  );

  // Remove the Zap import
  content = content.replace(/,? Zap,?/, ""); // crude but might work if Zap is in a list

  // Remove Bottom Telemetry Bar & Controls
  // We'll match from "{/* Bottom Telemetry Bar & Controls */}" to the end just before "    </div>\n  );\n}"
  content = content.replace(
    /\s*\{\/\* Bottom Telemetry Bar & Controls \*\/\}[\s\S]*?(?=\s*<\/div>\s*\);\s*\})/m,
    "",
  );

  fs.writeFileSync(file, content);
}
