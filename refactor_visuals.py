import re
import os

files = [
    "src/components/patents/visuals/three/SholesTypewriter3D.tsx",
    "src/components/patents/visuals/three/GrammeDynamo3D.tsx",
    "src/components/patents/visuals/three/HyattCelluloid3D.tsx",
    "src/components/patents/visuals/three/CorlissSteamEngine3D.tsx",
    "src/components/patents/visuals/three/GatlingGun3D.tsx",
    "src/components/patents/visuals/three/HollerithTabulating3D.tsx",
    "src/components/patents/visuals/three/EricssonPropeller3D.tsx",
    "src/components/patents/visuals/three/ThomsonWelding3D.tsx"
]

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove ScenarioPreset interface
    content = re.sub(r"interface ScenarioPreset \{[^\}]*\}\n+", "", content)

    # 2. Remove SCENARIOS array
    content = re.sub(r"const _?SCENARIOS(?:_PRESETS)?: ScenarioPreset\[\] = \[.*?\];\n+", "", content, flags=re.DOTALL)

    # 3. Remove applyScenario
    content = re.sub(r"\s*const _?applyScenario = \(s: ScenarioPreset\) => \{.*?(?:\n  };\n|\n  })", "", content, flags=re.DOTALL)

    # 4. Remove useState for showUiOverlay
    content = re.sub(r"\s*const \[[^\]]*showUiOverlay[^\]]*\] = useState<boolean>\([^)]*\);\n", "\n", content)

    # 5. Remove Zap toggle button from Top HUD (if exists)
    content = re.sub(r"\s*<button[^>]*onClick=\{[^}]*showUiOverlay[^}]*\}[^>]*>\s*<Zap[^>]*/>\s*</button>", "", content, flags=re.DOTALL)

    # 6. Remove Zap import if present
    content = re.sub(r", Zap", "", content)
    content = re.sub(r"Zap, ", "", content)

    # 7. Remove Bottom Panel. It either starts with `{/* Bottom Telemetry Bar & Controls */}` or `{/* Bottom Control Bar */}`
    # It extends up to the final closing `</div>` of the root container.
    # To be safe, we match from `{/* Bottom` until `    </div>\n  );\n}`
    
    # We will find the pattern `{/* Bottom` and everything after it until `    </div>\n  );\n}`
    match = re.search(r"(\s*\{\/\*\s*Bottom.*)", content, flags=re.DOTALL)
    if match:
        bottom_str = match.group(1)
        # find the last "    </div>\n  );\n}" in the entire file, or just use rpartition
        # Actually, let's just use re.sub with a positive lookahead to the end of the file.
        content = re.sub(r"\s*\{\/\*\s*Bottom.*?(?=\s*</div>\s*\)\;\s*\})", "", content, flags=re.DOTALL)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

