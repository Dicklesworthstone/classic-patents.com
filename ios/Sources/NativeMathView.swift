import SwiftUI

/// A small, fully native TeX layout engine for the equation vocabulary used by
/// the bundled patent corpus. It intentionally renders with SwiftUI text and
/// layout primitives: no HTML, JavaScript, MathJax, image snapshots, or web view.
struct NativeMathView: View {
    let latex: String
    var pointSize: CGFloat = 23
    var defaultColor: Color = Lab.parchment

    private var expression: MathExpression {
        var parser = NativeTeXParser(source: latex)
        return parser.parse()
    }

    var body: some View {
        MathExpressionView(expression: expression, pointSize: pointSize, inheritedColor: defaultColor)
            .fixedSize(horizontal: true, vertical: true)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(NativeMathFormatter.display(latex))
    }
}

private indirect enum MathExpression {
    case sequence([MathExpression])
    case glyph(String)
    case fraction(MathExpression, MathExpression)
    case root(MathExpression)
    case scripted(base: MathExpression, subscriptNode: MathExpression?, superscriptNode: MathExpression?)
    case colored(String, MathExpression)
    case upright(MathExpression)
    case bold(MathExpression)
    case accent(String, MathExpression)
    case cases([(MathExpression, MathExpression?)])
    case space(CGFloat)
}

private struct NativeTeXParser {
    private let characters: [Character]
    private var cursor = 0

    init(source: String) {
        characters = Array(source)
    }

    mutating func parse() -> MathExpression {
        .sequence(parseSequence(until: nil))
    }

    private mutating func parseSequence(until terminator: Character?) -> [MathExpression] {
        var result: [MathExpression] = []
        while cursor < characters.count {
            if let terminator, characters[cursor] == terminator {
                cursor += 1
                break
            }
            var atom = parseAtom()
            var subscriptNode: MathExpression?
            var superscriptNode: MathExpression?
            while cursor < characters.count, characters[cursor] == "_" || characters[cursor] == "^" {
                let marker = characters[cursor]
                cursor += 1
                let argument = parseScriptArgument()
                if marker == "_" { subscriptNode = argument } else { superscriptNode = argument }
            }
            if subscriptNode != nil || superscriptNode != nil {
                atom = .scripted(base: atom, subscriptNode: subscriptNode, superscriptNode: superscriptNode)
            }
            result.append(atom)
        }
        return result
    }

    private mutating func parseAtom() -> MathExpression {
        guard cursor < characters.count else { return .glyph("") }
        let character = characters[cursor]
        if character == "{" {
            cursor += 1
            return .sequence(parseSequence(until: "}"))
        }
        if character == "\\" {
            cursor += 1
            return parseCommand()
        }
        cursor += 1
        if character.isWhitespace { return .space(4) }
        return .glyph(String(character))
    }

    private mutating func parseCommand() -> MathExpression {
        let start = cursor
        while cursor < characters.count, characters[cursor].isLetter { cursor += 1 }
        let command: String
        if start == cursor, cursor < characters.count {
            command = String(characters[cursor])
            cursor += 1
        } else {
            command = String(characters[start..<cursor])
        }

        switch command {
        case "frac", "dfrac", "tfrac": return .fraction(parseRequiredGroup(), parseRequiredGroup())
        case "sqrt": return .root(parseRequiredGroup())
        case "textcolor":
            let color = parseRawGroup()
            return .colored(color, parseRequiredGroup())
        case "text", "textrm", "mathrm", "operatorname", "mbox": return .upright(parseRequiredGroup())
        case "mathbf", "boldsymbol": return .bold(parseRequiredGroup())
        case "mathbb": return .upright(.glyph(Self.blackboardGlyphs(in: parseRawGroup())))
        case "mathit", "mathcal": return parseRequiredGroup()
        case "dot": return .accent("·", parseRequiredGroup())
        case "ddot": return .accent("··", parseRequiredGroup())
        case "vec": return .accent("→", parseRequiredGroup())
        case "bar", "overline": return .accent("―", parseRequiredGroup())
        case "hat", "widehat": return .accent("ˆ", parseRequiredGroup())
        case "sin", "cos", "tan", "cot", "arcsin", "ln", "log", "exp", "min", "max":
            return .upright(.glyph(command))
        case "xrightarrow":
            let label = parseRequiredGroup()
            return .sequence([.glyph("→"), .scripted(base: .space(0), subscriptNode: label, superscriptNode: nil)])
        // TeX's sizing commands modify the following delimiter. SwiftUI lays
        // out this compact display at one optical size, so consume the command
        // and render the authored delimiter itself instead of leaking "bigl"
        // or "bigr" into the equation.
        case "left", "right", "bigl", "bigr": return parseAtom()
        case "quad": return .space(16)
        case "qquad": return .space(28)
        case ",": return .space(3)
        case ";": return .space(6)
        case "!": return .space(-1)
        case "begin":
            let environment = parseRawGroup()
            if environment == "cases" { return parseCasesEnvironment() }
            return parseUnknownEnvironment(named: environment)
        case "end":
            _ = parseRawGroup()
            return .space(0)
        case "pmod":
            return .sequence([.glyph("("), .upright(parseRequiredGroup()), .glyph(")")])
        case "bmod":
            return .sequence([.space(4), .upright(.glyph("mod")), .space(4)])
        default:
            if let glyph = Self.commandGlyphs[command] { return .glyph(glyph) }
            return .glyph(command)
        }
    }

    private mutating func parseRequiredGroup() -> MathExpression {
        skipWhitespace()
        guard cursor < characters.count else { return .glyph("") }
        if characters[cursor] == "{" {
            cursor += 1
            return .sequence(parseSequence(until: "}"))
        }
        return parseAtom()
    }

    private mutating func parseScriptArgument() -> MathExpression {
        skipWhitespace()
        return parseRequiredGroup()
    }

    private mutating func parseRawGroup() -> String {
        skipWhitespace()
        guard cursor < characters.count, characters[cursor] == "{" else { return "" }
        cursor += 1
        let start = cursor
        var depth = 1
        while cursor < characters.count, depth > 0 {
            if characters[cursor] == "{" { depth += 1 }
            if characters[cursor] == "}" { depth -= 1 }
            cursor += 1
        }
        let end = max(start, cursor - 1)
        return String(characters[start..<end])
    }

    private mutating func skipWhitespace() {
        while cursor < characters.count, characters[cursor].isWhitespace { cursor += 1 }
    }

    /// TeX blackboard bold has no direct SwiftUI font trait. Map the symbols
    /// used by scientific notation to their Unicode mathematical forms so the
    /// authored distinction remains visible without HTML or image snapshots.
    private static func blackboardGlyphs(in source: String) -> String {
        let glyphs: [Character: Character] = [
            "C": "ℂ", "H": "ℍ", "N": "ℕ", "P": "ℙ", "Q": "ℚ",
            "R": "ℝ", "Z": "ℤ", "I": "𝕀",
        ]
        return String(source.map { glyphs[$0] ?? $0 })
    }

    private mutating func parseCasesEnvironment() -> MathExpression {
        let content = consumeEnvironmentBody(named: "cases")
        let rows = split(content, on: ["\\", "\\"]).map { row -> (MathExpression, MathExpression?) in
            let cells = split(row, on: ["&"], maximumSplits: 1)
            var valueParser = NativeTeXParser(source: String(cells.first ?? []))
            let value = valueParser.parse()
            guard cells.count > 1 else { return (value, nil) }
            var conditionParser = NativeTeXParser(source: String(cells[1]))
            return (value, conditionParser.parse())
        }
        return .cases(rows)
    }

    private mutating func parseUnknownEnvironment(named name: String) -> MathExpression {
        let content = consumeEnvironmentBody(named: name)
        var parser = NativeTeXParser(source: String(content))
        return parser.parse()
    }

    private mutating func consumeEnvironmentBody(named name: String) -> [Character] {
        let terminator = Array("\\end{\(name)}")
        let start = cursor
        while cursor < characters.count {
            if characters[cursor...].starts(with: terminator) {
                let result = Array(characters[start..<cursor])
                cursor += terminator.count
                return result
            }
            cursor += 1
        }
        return Array(characters[start...])
    }

    private func split(
        _ source: [Character],
        on separator: [Character],
        maximumSplits: Int = .max
    ) -> [[Character]] {
        guard !separator.isEmpty else { return [source] }
        var result: [[Character]] = []
        var current: [Character] = []
        var index = 0
        var splitCount = 0
        while index < source.count {
            let end = index + separator.count
            if splitCount < maximumSplits,
               end <= source.count,
               Array(source[index..<end]) == separator {
                result.append(current)
                current.removeAll(keepingCapacity: true)
                splitCount += 1
                index = end
            } else {
                current.append(source[index])
                index += 1
            }
        }
        result.append(current)
        return result.filter { !$0.allSatisfy(\.isWhitespace) }
    }

    private static let commandGlyphs: [String: String] = [
        "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "Delta": "Δ",
        "epsilon": "ε", "varepsilon": "ε", "zeta": "ζ", "eta": "η", "theta": "θ",
        "Theta": "Θ", "vartheta": "ϑ", "iota": "ι", "kappa": "κ", "lambda": "λ",
        "Lambda": "Λ", "mu": "μ", "nu": "ν", "xi": "ξ", "Xi": "Ξ", "pi": "π",
        "Pi": "Π", "rho": "ρ", "sigma": "σ", "Sigma": "Σ", "tau": "τ", "upsilon": "υ",
        "phi": "φ", "varphi": "ϕ", "Phi": "Φ", "chi": "χ", "psi": "ψ", "Psi": "Ψ",
        "omega": "ω", "Omega": "Ω", "partial": "∂", "nabla": "∇", "infty": "∞",
        "Gamma": "Γ",
        "sum": "∑", "prod": "∏", "int": "∫", "iint": "∬", "iiint": "∭", "oint": "∮",
        "cdot": "·", "times": "×", "div": "÷", "pm": "±", "mp": "∓",
        "le": "≤", "leq": "≤", "ge": "≥", "geq": "≥", "neq": "≠", "approx": "≈",
        "equiv": "≡", "propto": "∝", "rightarrow": "→", "leftarrow": "←",
        "hookrightarrow": "↪", "dashv": "⊣",
        "to": "→", "longrightarrow": "⟶", "Rightarrow": "⇒", "Leftarrow": "⇐", "leftrightarrow": "↔", "rightleftharpoons": "⇌",
        "mapsto": "↦", "in": "∈", "notin": "∉", "subset": "⊂", "subseteq": "⊆",
        "varnothing": "∅",
        "cup": "∪", "cap": "∩", "forall": "∀", "exists": "∃", "neg": "¬",
        "land": "∧", "wedge": "∧", "lor": "∨", "perp": "⊥", "parallel": "∥", "angle": "∠",
        "circ": "∘", "bullet": "•", "ell": "ℓ", "hbar": "ℏ", "Re": "ℜ", "Im": "ℑ",
        "lfloor": "⌊", "rfloor": "⌋", "lVert": "‖", "rVert": "‖",
        "lesssim": "≲", "ll": "≪", "gg": "≫", "sim": "∼",
        "prime": "′", "implies": "⇒",
        "|": "‖",
        "dots": "…", "ldots": "…", "cdots": "⋯", "vdots": "⋮", "ddots": "⋱",
        "uparrow": "↑", "downarrow": "↓",
        "langle": "⟨", "rangle": "⟩", "lbrace": "{", "rbrace": "}",
    ]
}

private struct MathExpressionView: View {
    let expression: MathExpression
    let pointSize: CGFloat
    let inheritedColor: Color

    @ViewBuilder
    var body: some View {
        switch expression {
        case .sequence(let children):
            HStack(alignment: .center, spacing: 1) {
                ForEach(Array(children.enumerated()), id: \.offset) { _, child in
                    MathExpressionView(expression: child, pointSize: pointSize, inheritedColor: inheritedColor)
                }
            }
        case .glyph(let glyph):
            Text(glyph)
                .font(.system(size: pointSize, weight: .medium, design: .serif))
                .foregroundStyle(inheritedColor)
        case .fraction(let numerator, let denominator):
            VStack(spacing: 1) {
                MathExpressionView(expression: numerator, pointSize: pointSize * 0.74, inheritedColor: inheritedColor)
                Rectangle().fill(inheritedColor).frame(minWidth: pointSize * 0.9, maxWidth: .infinity).frame(height: 1)
                MathExpressionView(expression: denominator, pointSize: pointSize * 0.74, inheritedColor: inheritedColor)
            }
            .padding(.horizontal, 2)
        case .root(let radicand):
            HStack(alignment: .center, spacing: 0) {
                Text("√").font(.system(size: pointSize * 1.18, design: .serif)).foregroundStyle(inheritedColor)
                MathExpressionView(expression: radicand, pointSize: pointSize * 0.92, inheritedColor: inheritedColor)
                    .overlay(alignment: .top) { Rectangle().fill(inheritedColor).frame(height: 1) }
            }
        case .scripted(let base, let subscriptNode, let superscriptNode):
            HStack(alignment: .center, spacing: 1) {
                MathExpressionView(expression: base, pointSize: pointSize, inheritedColor: inheritedColor)
                VStack(alignment: .leading, spacing: -2) {
                    if let superscriptNode {
                        MathExpressionView(expression: superscriptNode, pointSize: pointSize * 0.60, inheritedColor: inheritedColor)
                    }
                    if let subscriptNode {
                        MathExpressionView(expression: subscriptNode, pointSize: pointSize * 0.60, inheritedColor: inheritedColor)
                    }
                }
            }
        case .colored(let hex, let child):
            MathExpressionView(expression: child, pointSize: pointSize, inheritedColor: color(hex: hex) ?? inheritedColor)
        case .upright(let child):
            MathExpressionView(expression: child, pointSize: pointSize * 0.88, inheritedColor: inheritedColor)
        case .bold(let child):
            MathExpressionView(expression: child, pointSize: pointSize, inheritedColor: inheritedColor)
                .fontWeight(.bold)
        case .accent(let mark, let child):
            VStack(spacing: -pointSize * 0.20) {
                Text(mark)
                    .font(.system(size: pointSize * 0.62, weight: .medium, design: .serif))
                    .foregroundStyle(inheritedColor)
                MathExpressionView(expression: child, pointSize: pointSize, inheritedColor: inheritedColor)
            }
        case .cases(let rows):
            HStack(alignment: .center, spacing: 5) {
                Text("{")
                    .font(.system(size: pointSize * max(1.4, CGFloat(rows.count) * 0.74), weight: .light, design: .serif))
                    .foregroundStyle(inheritedColor)
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                        HStack(alignment: .firstTextBaseline, spacing: 10) {
                            MathExpressionView(expression: row.0, pointSize: pointSize * 0.76, inheritedColor: inheritedColor)
                            if let condition = row.1 {
                                MathExpressionView(expression: condition, pointSize: pointSize * 0.68, inheritedColor: inheritedColor.opacity(0.82))
                            }
                        }
                    }
                }
            }
        case .space(let width):
            Color.clear.frame(width: max(0, width), height: 1)
        }
    }

    private func color(hex: String) -> Color? {
        let clean = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        guard clean.count == 6, let value = UInt64(clean, radix: 16) else { return nil }
        return Color(
            red: Double((value >> 16) & 0xff) / 255,
            green: Double((value >> 8) & 0xff) / 255,
            blue: Double(value & 0xff) / 255
        )
    }
}
