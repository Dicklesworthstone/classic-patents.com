import os
import re

visuals_dir = "/Users/jemanuel/projects/classic-patents.com/src/components/patents/visuals/three"

files_to_update = [
    "NobelDynamite3D.tsx",
    "SholesTypewriter3D.tsx",
    "HyattCelluloid3D.tsx",
    "GrammeDynamo3D.tsx",
    "WestinghouseAirBrake3D.tsx",
    "GliddenBarbedWire3D.tsx",
    "EdisonPhonograph3D.tsx",
    "PeltonWheel3D.tsx",
    "DeLavalSeparator3D.tsx",
    "MergenthalerLinotype3D.tsx",
    "ThomsonWelding3D.tsx",
    "EastmanKodak3D.tsx",
    "HollerithTabulating3D.tsx",
    "RenoEscalator3D.tsx",
    "TeslaTeleautomaton3D.tsx",
    "ZeppelinAirship3D.tsx",
    "LindeAirLiquefaction3D.tsx",
    "CarrierAirConditioner3D.tsx",
]

for fname in files_to_update:
    fpath = os.path.join(visuals_dir, fname)
    if not os.path.exists(fpath):
        print(f"Skipping {fname} (not found)")
        continue

    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if already has HUD toggle
    if "showUiOverlay" in content or "setShowUiOverlay" in content or "EyeOff" in content:
        print(f"Skipping {fname} (already has HUD toggle)")
        continue

    # 1. Add Eye, EyeOff to lucide-react import
    if 'from "lucide-react"' in content:
        content = re.sub(
            r'import\s+\{([^}]+)\}\s+from\s+"lucide-react";',
            lambda m: f'import {{ {m.group(1).strip()}, Eye, EyeOff }} from "lucide-react";' if "Eye" not in m.group(1) else f'import {{ {m.group(1).strip()}, EyeOff }} from "lucide-react";',
            content,
            count=1
        )

    # 2. Add state: const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);
    # Insert right after `const { params, updateParam }` or after `export function ... {`
    if "const [showUiOverlay, setShowUiOverlay]" not in content:
        content = re.sub(
            r'(export function \w+3D\(\)\s*\{[\s\S]*?const containerRef = useRef<HTMLDivElement>\(null\);)',
            r'\1\n  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);',
            content,
            count=1
        )

    # 3. Add toggle button next to toggleSound or inside controls toolbar
    toggle_button_code = """          <button
            type="button"
            onClick={() => setShowUiOverlay(!showUiOverlay)}
            title={showUiOverlay ? "Hide Overlay UI" : "Show Overlay UI"}
            className="p-1.5 rounded-lg text-xs text-parchment-400 hover:text-white hover:bg-parchment-800 transition-colors"
          >
            {showUiOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-amber-400" />}
          </button>"""

    if "onClick={toggleSound}" in content:
        content = re.sub(
            r'(\s*<button[\s\S]*?onClick=\{toggleSound\}[\s\S]*?</button>)',
            r'\1\n' + toggle_button_code,
            content,
            count=1
        )
    elif "toggleEngine" in content:
        content = re.sub(
            r'(\s*<button[\s\S]*?onClick=\{toggleEngine\}[\s\S]*?</button>)',
            r'\1\n' + toggle_button_code,
            content,
            count=1
        )

    with open(fpath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated {fname} with HUD toggle")

print("Done updating HUD toggles.")
