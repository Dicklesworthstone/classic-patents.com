import re
import sys
import os

files = [
    "src/components/patents/visuals/three/WestinghouseAirBrake3D.tsx",
    "src/components/patents/visuals/three/DavenportElectricMotor3D.tsx",
    "src/components/patents/visuals/three/LindeAirLiquefaction3D.tsx",
    "src/components/patents/visuals/three/McCormickReaper3D.tsx",
    "src/components/patents/visuals/three/NobelDynamite3D.tsx",
    "src/components/patents/visuals/three/DeLavalSeparator3D.tsx",
    "src/components/patents/visuals/three/EdisonPhonograph3D.tsx",
    "src/components/patents/visuals/three/CarrierAirConditioner3D.tsx"
]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    # 1. Remove interface ScenarioPreset and SCENARIOS / _SCENARIOS arrays
    content = re.sub(r'interface\s+ScenarioPreset\s*\{[^}]+\}\s*', '', content)
    
    # Matches const SCENARIOS: ScenarioPreset[] = [...];
    content = re.sub(r'const\s+_?SCENARIOS\s*:\s*ScenarioPreset\[\]\s*=\s*\[[\s\S]*?\];\s*', '', content)

    # 2. Remove applyScenario / _applyScenario
    content = re.sub(r'const\s+_?applyScenario\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};\s*', '', content)

    # 3. Remove showUiOverlay state
    content = re.sub(r'\s*const\s+\[showUiOverlay,\s*setShowUiOverlay\]\s*=\s*useState<boolean>\([^)]+\);', '', content)
    
    # Remove Zap icon toggle
    # Look for the button containing setShowUiOverlay(!showUiOverlay) and Zap
    content = re.sub(r'<button[^>]*onClick=\{\(\)\s*=>\s*setShowUiOverlay\(!showUiOverlay\)\}[^>]*>[\s\S]*?<Zap[^>]*/>[\s\S]*?</button>\s*', '', content)
    
    # 4. Remove the bottom UI panel block
    # It starts with {showUiOverlay && ( and ends with )} right before the closing </div> of the component.
    # Since regex for balanced parentheses is hard, we can use a trick:
    # We know it starts with `{showUiOverlay && (` and ends with `)}` at the bottom.
    # Let's find `{showUiOverlay && (` and just remove everything from there up to the last `)}` before `</div>\n  );`
    
    start_idx = content.find('{showUiOverlay && (')
    if start_idx != -1:
        # Find the matching closing of `)` after `showUiOverlay && (`
        # Actually, since it's the last big block before the end:
        end_str = "    </div>\n  );\n}"
        end_idx = content.rfind(end_str)
        if end_idx != -1:
            # We must be careful not to remove the closing </div> of the main container.
            # Usually the block is something like:
            #       {showUiOverlay && (
            #         <div className="absolute bottom-4 ...
            #            ...
            #         </div>
            #       )}
            #     </div>
            #   );
            # }
            # Let's extract the substring to be removed:
            search_area = content[start_idx:end_idx]
            # remove the last )} from search_area
            last_bracket = search_area.rfind(')}')
            if last_bracket != -1:
                content = content[:start_idx] + content[start_idx + last_bracket + 2:]
            else:
                print(f"Could not find closing brackets for showUiOverlay in {file_path}")
        else:
            print(f"Could not find end of component in {file_path}")

    # Remove Zap from lucide-react import if it's no longer used
    if 'Zap' in content and 'showUiOverlay' not in content:
        content = re.sub(r',\s*Zap\b', '', content)
        content = re.sub(r'\bZap\s*,', '', content)
        content = re.sub(r'\bZap\b', '', content)
        
    with open(file_path, "w") as f:
        f.write(content)

print("Done")
