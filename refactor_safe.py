import re
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
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r") as f:
        lines = f.readlines()

    new_lines = []
    skip = False
    brace_level = 0
    
    # We will also remove `const [showUiOverlay, setShowUiOverlay] = useState<boolean>(true);`
    # And the Zap toggle button.
    
    in_zap_button = False
    
    for i, line in enumerate(lines):
        # 1. Skip ScenarioPreset interface
        if line.strip().startswith('interface ScenarioPreset'):
            skip = True
            brace_level = 0
            if '{' in line: brace_level += 1
            if '}' in line: brace_level -= 1
            if brace_level == 0:
                skip = False
            continue
        
        if skip and 'interface ScenarioPreset' not in line: # wait, if we are in skip due to interface
            if '{' in line: brace_level += line.count('{')
            if '}' in line: brace_level -= line.count('}')
            if brace_level <= 0:
                skip = False
            continue

        # 2. Skip SCENARIOS array
        if re.match(r'^const\s+_?SCENARIOS', line.strip()):
            if '];' in line:
                continue
            skip = True
            brace_level = line.count('[') - line.count(']')
            continue
            
        if skip and 'SCENARIOS' not in line: # Wait this logic is flawed for arrays
            pass

    # Let's use a simpler regex based string replacement but be exact.
