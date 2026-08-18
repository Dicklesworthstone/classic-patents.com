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
    
    # 5. Remove the Zap button. We find `<button` that has `setShowUiOverlay` inside it up to `</button>`
    content = re.sub(r'<button[^>]*onClick=\{\(\)\s*=>\s*setShowUiOverlay\(!showUiOverlay\)\}[^>]*>[\s\S]*?</button>', '', content)
    
    # 6. Remove bottom panel. We look for `{showUiOverlay && (` 
    # and we want to remove everything up to `)}` that balances it.
    start_idx = content.find('{showUiOverlay && (')
    if start_idx != -1:
        # Instead of guessing the end, we can manually balance parentheses.
        brace_count = 0
        end_idx = -1
        # start from the '(' in `{showUiOverlay && (`
        paren_start = content.find('(', start_idx)
        if paren_start != -1:
            paren_count = 1
            for i in range(paren_start + 1, len(content)):
                if content[i] == '(':
                    paren_count += 1
                elif content[i] == ')':
                    paren_count -= 1
                    if paren_count == 0:
                        # found the matching ')', the end is `)}`
                        if content[i+1:i+2] == '}':
                            end_idx = i + 2
                            break
                        else:
                            # Sometimes there's whitespace or newlines before `}`
                            j = i + 1
                            while j < len(content) and content[j] in ' \n\r\t':
                                j += 1
                            if content[j] == '}':
                                end_idx = j + 1
                                break
                            else:
                                # Not matched by a brace, so we might have `{showUiOverlay && ( <div>...</div> )}`
                                # Actually, JSX in parens might just end with `)` then `}`.
                                pass
                                
        if end_idx != -1:
            # We must be careful not to leave broken markup.
            content = content[:start_idx] + content[end_idx:]
        else:
            print(f"Failed to find end of showUiOverlay block in {file_path}")

    # Remove Zap from lucide-react if present and no longer used
    if 'Zap' in content and 'showUiOverlay' not in content:
        content = re.sub(r',\s*Zap\b', '', content)
        content = re.sub(r'\bZap\s*,', '', content)
        content = re.sub(r'\bZap\b', '', content)

    with open(file_path, "w") as f:
        f.write(content)

print("Done")
