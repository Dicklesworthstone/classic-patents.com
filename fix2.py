import sys
import re

files = [
    "src/components/patents/visuals/three/GliddenBarbedWire3D.tsx",
    "src/components/patents/visuals/three/TeslaTeleautomaton3D.tsx",
    "src/components/patents/visuals/three/MergenthalerLinotype3D.tsx",
    "src/components/patents/visuals/three/ZeppelinAirship3D.tsx",
    "src/components/patents/visuals/three/CorlissEngine3D.tsx",
    "src/components/patents/visuals/three/RenoEscalator3D.tsx",
    "src/components/patents/visuals/three/EastmanKodak3D.tsx",
    "src/components/patents/visuals/three/PeltonWheel3D.tsx"
]

for file_path in files:
    with open(file_path, "r") as f:
        content = f.read()

    start_str = "{/* Bottom "
    start_idx = content.find(start_str)
    
    if start_idx != -1:
        # Move start_idx back to the beginning of the line
        start_idx = content.rfind("\n", 0, start_idx) + 1
        
        end_idx = content.rfind("    </div>\n  );\n}")
        if end_idx == -1:
            end_idx = content.rfind("</div>\n  );\n}")
            
        if end_idx != -1:
            content = content[:start_idx] + content[end_idx:]
            
            def clean_imports(m):
                s = m.group(1)
                # Ensure we only remove if not used in JSX
                for sym in ['Zap', 'Sparkles', 'Activity', 'Gauge', 'Waves', 'Radio', 'Eye']:
                    if sym in s and f'<{sym}' not in content:
                        s = re.sub(r'\b' + sym + r'\b', '', s)
                # Clean up dangling commas
                s = re.sub(r',\s*,', ',', s)
                s = re.sub(r'{\s*,', '{ ', s)
                s = re.sub(r',\s*}', ' }', s)
                return "import {" + s + "} from \"lucide-react\";"
            
            content = re.sub(r'import\s+\{(.*?)\}\s+from\s+"lucide-react";', clean_imports, content)

            with open(file_path, "w") as f:
                f.write(content)
            print(f"Sliced {file_path}")
        else:
            print(f"Could not find end for {file_path}")
    else:
        print(f"Could not find start for {file_path}")
