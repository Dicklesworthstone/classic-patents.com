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
    
    # We must find the `<div ` that contains this class
    # The `<div` starts somewhere before `idx`.
    start_idx = text.rfind('<div', 0, idx)
    if start_idx == -1: return text
    
    # Find matching closing </div>
    # A simple HTML parser to find matching tags
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
        
        # Look for the closing `}` after the matching `)`
        brace_end_idx = content.find('}', end_idx)
        if brace_end_idx != -1:
            inner_content = content[paren_idx+1 : end_idx].strip()
            
            # If inner_content starts with `<>` and ends with `</>`, strip those too
            if inner_content.startswith('<>') and inner_content.endswith('</>'):
                inner_content = inner_content[2:-3].strip()
                
            content = content[:idx] + inner_content + content[brace_end_idx+1:]
    
    # Now we have successfully unwrapped. Next, remove the bottom panel.
    # It usually has className containing "absolute bottom-4" or "bottom-4"
    # We will search for 'className="absolute bottom-4' or similar.
    # We can just remove the div containing "absolute bottom-4"
    content = remove_div_at(content, 'bottom-4')
    
    # Remove Zap and EyeOff from lucide-react if present and no longer used
    if 'showUiOverlay' not in content:
        content = re.sub(r',\s*Zap\b', '', content)
        content = re.sub(r'\bZap\s*,', '', content)
        content = re.sub(r'\bZap\b', '', content)
        content = re.sub(r',\s*EyeOff\b', '', content)
        content = re.sub(r'\bEyeOff\s*,', '', content)
        content = re.sub(r',\s*Eye\b', '', content)
        content = re.sub(r'\bEye\s*,', '', content)

    with open(file_path, "w") as f:
        f.write(content)

print("Done")
