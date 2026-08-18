#!/bin/bash
FILE="src/components/patents/visuals/three/GliddenBarbedWire3D.tsx"
# Remove ScenarioPreset and SCENARIOS
sed -i '' '/interface ScenarioPreset {/,/\];/d' "$FILE"
# Remove applyScenario
sed -i '' '/const applyScenario = (s: ScenarioPreset) => {/,/};/d' "$FILE"
# Remove showUiOverlay state
sed -i '' '/const \[showUiOverlay, setShowUiOverlay\] = useState<boolean>(true);/d' "$FILE"
# Remove Zap button block
sed -i '' '/<Zap className="w-4 h-4 text-amber-400" \/>/{
    N
    N
    d
}' "$FILE"
# It's better to remove the Zap button using a robust method or a ruby script.
