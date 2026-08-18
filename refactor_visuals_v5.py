import re
import os

def remove_all_divs_at(text, class_str):
    while True:
        idx = text.find(class_str)
        if idx == -1: 
            break
        
        start_idx = text.rfind('<div', 0, idx)
        if start_idx == -1: 
            break
        
        open_count = 0
        i = start_idx
        end_found = False
        while i < len(text):
            if text.startswith('<div', i) and not text.startswith('</div', i):
                open_count += 1
                i += 4
            elif text.startswith('</div', i):
                open_count -= 1
                if open_count == 0:
                    end_idx = text.find('>', i) + 1
                    text = text[:start_idx] + text[end_idx:]
                    end_found = True
                    break
                i += 5
            else:
                i += 1
                
        if not end_found:
            break
    return text

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
        content = f.read()

    # Apply remove bottom-4
    content = remove_all_divs_at(content, 'bottom-4')

    with open(file_path, "w") as f:
        f.write(content)

print("Done")
