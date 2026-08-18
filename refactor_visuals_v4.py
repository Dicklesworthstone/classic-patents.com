import re
import os

def find_matching_brace(text, start_idx, open_char, close_char):
    count = 0
    for i in range(start_idx, len(text)):
        if text[i] == open_char:
            count += 1
        elif text[i] == close_char:
            count -= 1
            if count == 0:
                return i
    return -1

def remove_div_at(text, div_class):
    idx = text.find(div_class)
    if idx == -1: return text
    
    start_idx = text.rfind('<div', 0, idx)
    if start_idx == -1: return text
    
    open_count = 0
    i = start_idx
    while i < len(text):
        if text.startswith('<div', i) and not text.startswith('</div', i):
            open_count += 1
            i += 4
        elif text.startswith('</div', i):
            open_count -= 1
            if open_count == 0:
                end_idx = text.find('>', i) + 1
                return text[:start_idx] + text[end_idx:]
            i += 5
        else:
            i += 1
            
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

    # 1. Remove ScenarioPreset interface
    content = re.sub(r'interface\s+ScenarioPreset\s*\{[^}]+\}\n+', '', content)
    
    # 2. Remove SCENARIOS array
    content = re.sub(r'const\s+_?SCENARIOS\s*:\s*ScenarioPreset\[\]\s*=\s*\[[\s\S]*?\];\n+', '', content)

    # 3. Remove applyScenario arrow function
    content = re.sub(r'const\s+_?applyScenario\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?\};\n+', '', content)

    # 4. Remove showUiOverlay state
    content = re.sub(r'\s*const\s+\[showUiOverlay,\s*setShowUiOverlay\]\s*=\s*useState(?:<boolean>)?\([^)]+\);', '', content)
    
    # 5. Remove the button toggling showUiOverlay
    content = re.sub(r'\s*<button[^>]*onClick=\{\(\)\s*=>\s*setShowUiOverlay\(!showUiOverlay\)\}[^>]*>[\s\S]*?</button>', '', content)
    
    # 6. Unwrap `{showUiOverlay && (`
    idx = content.find('{showUiOverlay && (')
    if idx != -1:
        paren_idx = content.find('(', idx)
        end_idx = find_matching_brace(content, paren_idx, '(', ')')
        
        brace_end_idx = content.find('}', end_idx)
        if brace_end_idx != -1:
            inner_content = content[paren_idx+1 : end_idx].strip()
            
            if inner_content.startswith('<>') and inner_content.endswith('</>'):
                inner_content = inner_content[2:-3].strip()
                
            content = content[:idx] + inner_content + content[brace_end_idx+1:]
    
    # Now remove the bottom panel.
    content = remove_div_at(content, 'bottom-4')
    
    # Remove Zap and EyeOff from lucide-react IMPORT ONLY!
    # find the import line for lucide-react
    import_match = re.search(r'import\s+\{([^}]+)\}\s+from\s+["\']lucide-react["\'];?', content)
    if import_match and 'showUiOverlay' not in content:
        imports_str = import_match.group(1)
        imports = [x.strip() for x in imports_str.split(',')]
        # Filter out unused
        # But wait, we ONLY want to filter out Zap, Eye, EyeOff if they are NOT used anywhere else in the file.
        # Let's just do a safe string replace for the whole file? NO!
        for token in ['Zap', 'Eye', 'EyeOff']:
            # check if token is used outside the import statement
            temp = content[:import_match.start()] + content[import_match.end():]
            if not re.search(r'\b' + token + r'\b', temp):
                if token in imports:
                    imports.remove(token)
        new_import_str = f"import {{ {', '.join(imports)} }} from \"lucide-react\";"
        content = content[:import_match.start()] + new_import_str + content[import_match.end():]

    with open(file_path, "w") as f:
        f.write(content)

print("Done")
