import os
import re

files = [
    "src/components/patents/visuals/three/BardeenTransistor3D.tsx",
    "src/components/patents/visuals/three/WhitneyCottonGin3D.tsx",
    "src/components/patents/visuals/three/ParsonsTurbine3D.tsx",
    "src/components/patents/visuals/three/OttoEngine3D.tsx",
    "src/components/patents/visuals/three/TeslaMotor3D.tsx",
    "src/components/patents/visuals/three/MaximMachineGun3D.tsx",
    "src/components/patents/visuals/three/OtisElevator3D.tsx",
    "src/components/patents/visuals/three/PasteurFermentation3D.tsx",
]

for f in files:
    with open(f, "r") as file:
        content = file.read()
    
    # 1. Remove ScenarioPreset interface
    content = re.sub(r'interface\s+ScenarioPreset\s*\{[^}]+\}\n?', '', content)
    
    # 2. Remove SCENARIOS array
    content = re.sub(r'const\s+_?SCENARIOS\s*:\s*ScenarioPreset\[\]\s*=\s*\[.*?(?=];\n?|\];\n?)\s*\];\n?', '', content, flags=re.DOTALL)
    
    # 3. Remove applyScenario function
    content = re.sub(r'\s*const\s+_?applyScenario\s*=\s*\([^)]*\)\s*=>\s*\{.*?(?=\n\s*const|\n\s*useEffect|\n\s*const\s+toggleSound|\n\s*const\s+toggleAudioTone)\n?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*const\s+_?applyScenario\s*=\s*\([^)]*\)\s*=>\s*\{[^}]+\};?', '', content)
    
    # 4. Remove bottom panels
    # For Bardeen
    content = re.sub(r'<div className="p-4 sm:p-5 bg-parchment-100/90.*?</div>\s*</div>\s*\);\s*\}', r'</div>\n  );\n}', content, flags=re.DOTALL)
    
    # For the rest
    content = re.sub(r'\{/\*\s*Bottom[^\n]*\*/\}\s*\{showUiOverlay && \(\s*<div className="absolute bottom-4 left-4 right-4.*?(?=</div>\s*</div>\s*\);\s*\})\s*</div>\s*\)\}\s*</div>\s*\)\s*;?', r'</div>\n  );\n', content, flags=re.DOTALL)

    # In TeslaMotor3D it might be slightly different or same.
    # We should handle it properly by finding the end of the return statement.
    with open(f, "w") as file:
        file.write(content)
