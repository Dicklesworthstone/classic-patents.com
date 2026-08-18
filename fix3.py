import re

files = [
    "src/components/patents/visuals/three/GliddenBarbedWire3D.tsx",
    "src/components/patents/visuals/three/TeslaTeleautomaton3D.tsx",
    "src/components/patents/visuals/three/MergenthalerLinotype3D.tsx",
    "src/components/patents/visuals/three/ZeppelinAirship3D.tsx",
    "src/components/patents/visuals/three/RenoEscalator3D.tsx",
    "src/components/patents/visuals/three/EastmanKodak3D.tsx",
    "src/components/patents/visuals/three/PeltonWheel3D.tsx"
]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    # Remove showUiOverlay state
    content = re.sub(r'  const \[showUiOverlay, setShowUiOverlay\] = useState<boolean>\(true\);\n', '', content)
    
    # Remove Zap button block
    content = re.sub(r'\s*<button[^>]*onClick=\{\(\) => setShowUiOverlay\(!showUiOverlay\)\}[^>]*>[\s\S]*?<Zap[\s\S]*?</button>\n?', '', content)

    # Clean up Zap import
    if 'Zap' in content and '<Zap' not in content:
        content = re.sub(r',\s*Zap\b', '', content)
        content = re.sub(r'\bZap\s*,?\s*', '', content)

    with open(file_path, "w") as f:
        f.write(content)
        
    print(f"Fixed UI overlay for {file_path}")
