import SwiftUI
import UIKit
import ImageIO

/// Native document primitives shared by the museum's specification, equation,
/// claim, and figure readers. Historical prose is always rendered as authored
/// text; this layer performs presentation only.
enum NativeDocumentStyle {
    static func equationColor(_ name: String) -> Color {
        switch name {
        case "crimson": Color(red: 0.94, green: 0.32, blue: 0.32)
        case "sapphire": Color(red: 0.30, green: 0.57, blue: 0.98)
        case "emerald": Color(red: 0.20, green: 0.83, blue: 0.60)
        case "amber": Color(red: 0.96, green: 0.66, blue: 0.25)
        case "amethyst": Color(red: 0.69, green: 0.45, blue: 0.96)
        case "cyan": Color(red: 0.25, green: 0.82, blue: 0.91)
        case "coral": Color(red: 0.98, green: 0.43, blue: 0.28)
        case "rose": Color(red: 0.96, green: 0.40, blue: 0.65)
        default: Color(red: 0.20, green: 0.70, blue: 0.67)
        }
    }
}

enum NativeMathFormatter {
    /// Converts only paired `$...$` runs in authored prose. Unpaired dollar
    /// signs remain currency (for example "$15 worth of TTL chips") instead
    /// of being mistaken for a math delimiter.
    static func displayInlineMath(in prose: String) -> String {
        guard let regex = try? NSRegularExpression(pattern: #"\$([^$\n]+)\$"#) else {
            return prose
        }
        var value = prose
        let matches = regex.matches(in: value, range: NSRange(value.startIndex..., in: value)).reversed()
        for match in matches {
            guard let whole = Range(match.range(at: 0), in: value),
                  let body = Range(match.range(at: 1), in: value) else { continue }
            value.replaceSubrange(whole, with: display(String(value[body])))
        }
        return replacingBareVariableSubscripts(in: value)
    }

    static func display(_ latex: String) -> String {
        var text = latex
        text = text.replacingOccurrences(
            of: #"\\(?:begin|end)\{[^{}]+\}"#,
            with: "",
            options: .regularExpression
        )
        text = text.replacingOccurrences(
            of: #"\\textcolor\{[^{}]*\}"#,
            with: "",
            options: .regularExpression
        )
        text = text.replacingOccurrences(
            of: #"\\pmod\{([^{}]+)\}"#,
            with: "(mod $1)",
            options: .regularExpression
        )
        text = text.replacingOccurrences(
            of: #"\\bar\{([^{}]+)\}"#,
            with: "bar $1",
            options: .regularExpression
        )
        text = text.replacingOccurrences(
            of: #"\\hat\{([^{}]+)\}"#,
            with: "$1 hat",
            options: .regularExpression
        )
        text = replacingFractions(in: text)
        let replacements: [String: String] = [
            "\\quad": "   ", "\\qquad": "      ", "\\cdot": "·", "\\times": "×",
            "\\approx": "≈", "\\leq": "≤", "\\le": "≤", "\\geq": "≥", "\\ge": "≥",
            "\\lesssim": "≲", "\\ll": "≪", "\\gg": "≫", "\\rightarrow": "→", "\\longrightarrow": "⟶",
            "\\hookrightarrow": "↪", "\\dashv": "⊣",
            "\\rightleftharpoons": "⇌", "\\xrightarrow": "→", "\\to": "→",
            "\\leftarrow": "←", "\\Rightarrow": "⇒", "\\implies": "⇒", "\\prime": "′",
            "\\partial": "∂", "\\nabla": "∇", "\\infty": "∞", "\\pi": "π",
            "\\rho": "ρ", "\\sigma": "σ", "\\Sigma": "Σ", "\\omega": "ω", "\\Omega": "Ω",
            "\\alpha": "α", "\\beta": "β", "\\gamma": "γ", "\\Gamma": "Γ",
            "\\delta": "δ", "\\Delta": "Δ", "\\lambda": "λ", "\\Lambda": "Λ",
            "\\mu": "μ", "\\nu": "ν", "\\phi": "φ", "\\Phi": "Φ", "\\psi": "ψ",
            "\\theta": "θ", "\\Theta": "Θ", "\\tau": "τ", "\\eta": "η", "\\zeta": "ζ",
            "\\kappa": "κ", "\\xi": "ξ", "\\Pi": "Π", "\\ell": "ℓ",
            "\\varepsilon": "ε", "\\epsilon": "ε", "\\sum": "∑", "\\prod": "∏", "\\int": "∫",
            "\\oint": "∮", "\\circ": "∘", "\\in": "∈", "\\perp": "⊥", "\\sqrt": "√",
            "\\sim": "∼", "\\pm": "±", "\\propto": "∝", "\\cap": "∩",
            "\\land": "∧", "\\wedge": "∧", "\\subset": "⊂", "\\neg": "¬", "\\varnothing": "∅",
            "\\dots": "…", "\\ldots": "…", "\\uparrow": "↑", "\\downarrow": "↓",
            "\\sin": "sin", "\\cos": "cos", "\\tan": "tan", "\\cot": "cot", "\\arcsin": "arcsin", "\\ln": "ln",
            "\\log": "log", "\\exp": "exp", "\\min": "min",
            "\\dot": "˙", "\\ddot": "¨", "\\vec": "→", "\\lfloor": "⌊",
            "\\rfloor": "⌋", "\\text": "", "\\mathrm": "", "\\mathbf": "",
            "\\mathcal": "", "\\mathbb": "", "\\boldsymbol": "", "\\operatorname": "", "\\mbox": "", "\\left": "", "\\right": "",
            "\\bmod": " mod ",
            "\\bigl": "", "\\bigr": "",
            "\\,": " ", "\\;": " ", "\\|": "‖", "\\": "",
        ]
        for (source, target) in replacements.sorted(by: { $0.key.count > $1.key.count }) {
            text = text.replacingOccurrences(of: source, with: target)
        }
        text = replacingScripts(in: text)
        text = text.replacingOccurrences(of: "{", with: "").replacingOccurrences(of: "}", with: "")
        return text
    }

    private static func replacingFractions(in input: String) -> String {
        let pattern = #"\\frac\{([^{}]+)\}\{([^{}]+)\}"#
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return input }
        var value = input
        while let match = regex.firstMatch(in: value, range: NSRange(value.startIndex..., in: value)),
              let whole = Range(match.range(at: 0), in: value),
              let numerator = Range(match.range(at: 1), in: value),
              let denominator = Range(match.range(at: 2), in: value) {
            let replacement = "(\(value[numerator]))⁄(\(value[denominator]))"
            value.replaceSubrange(whole, with: replacement)
        }
        return value
    }

    private static func replacingScripts(in input: String) -> String {
        let superscripts: [Character: Character] = [
            "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
            "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻",
        ]
        let subscripts: [Character: Character] = [
            "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅",
            "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋",
        ]
        var value = input
        for (prefix, map) in [("^", superscripts), ("_", subscripts)] {
            let pattern = NSRegularExpression.escapedPattern(for: prefix) + #"\{?([0-9+\-]+)\}?"#
            guard let regex = try? NSRegularExpression(pattern: pattern) else { continue }
            let matches = regex.matches(in: value, range: NSRange(value.startIndex..., in: value)).reversed()
            for match in matches {
                guard let whole = Range(match.range(at: 0), in: value),
                      let script = Range(match.range(at: 1), in: value) else { continue }
                let replacement = String(value[script].compactMap { map[$0] })
                value.replaceSubrange(whole, with: replacement)
            }
        }
        return value
    }

    /// Editorial prose occasionally uses compact vector notation such as
    /// `B_net` outside Markdown math delimiters. Translate only a single-letter
    /// variable followed by a fully representable alphabetic subscript; normal
    /// snake_case words and unsupported symbols remain untouched.
    private static func replacingBareVariableSubscripts(in input: String) -> String {
        let glyphs: [Character: Character] = [
            "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ", "k": "ₖ",
            "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ",
            "s": "ₛ", "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ",
        ]
        guard let regex = try? NSRegularExpression(pattern: #"\b([A-Za-z])_([A-Za-z]+)\b"#) else {
            return input
        }
        var value = input
        for match in regex.matches(in: value, range: NSRange(value.startIndex..., in: value)).reversed() {
            guard let whole = Range(match.range(at: 0), in: value),
                  let base = Range(match.range(at: 1), in: value),
                  let script = Range(match.range(at: 2), in: value) else { continue }
            let lowered = value[script].lowercased()
            let translated = lowered.compactMap { glyphs[$0] }
            guard translated.count == lowered.count else { continue }
            value.replaceSubrange(whole, with: String(value[base]) + String(translated))
        }
        return value
    }
}

struct ColorizedEquationCard: View {
    let equation: ColorizedEquation
    @State private var selectedVariableID: String?

    private var selectedVariable: EquationVariable? {
        equation.variables.first(where: { $0.id == selectedVariableID }) ?? equation.variables.first
    }

    var body: some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 14) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 3) {
                        Text(equation.title)
                            .font(.system(size: Lab.size(16), weight: .bold, design: .serif))
                            .foregroundStyle(Lab.parchment)
                        Text(equation.category.uppercased())
                            .font(.system(size: Lab.size(8.5), weight: .black, design: .rounded))
                            .foregroundStyle(Lab.brass)
                    }
                    Spacer()
                    if let claim = equation.claimRef {
                        Text("CLAIM \(claim)")
                            .font(.system(size: Lab.size(8.5), weight: .black, design: .rounded))
                            .foregroundStyle(Lab.emerald)
                    }
                }

                VStack(alignment: .leading, spacing: 5) {
                    ForEach(Array(equationLines.enumerated()), id: \.offset) { _, line in
                        ViewThatFits(in: .horizontal) {
                            equationView(line, pointSize: Lab.size(22))
                            equationView(line, pointSize: Lab.size(18))
                            equationView(line, pointSize: Lab.size(14))
                            equationView(line, pointSize: Lab.size(11))
                            ScrollView(.horizontal, showsIndicators: true) {
                                equationView(line, pointSize: Lab.size(16))
                            }
                        }
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                LazyVGrid(
                    columns: [GridItem(.adaptive(minimum: 124), spacing: 8, alignment: .leading)],
                    alignment: .leading,
                    spacing: 8
                ) {
                    ForEach(equation.variables) { variable in
                        variableButton(variable)
                    }
                }

                if let variable = selectedVariable {
                    let color = NativeDocumentStyle.equationColor(variable.color)
                    VStack(alignment: .leading, spacing: 6) {
                        Text(NativeMathFormatter.displayInlineMath(in: variable.role))
                            .font(.system(size: Lab.size(12.5), weight: .semibold, design: .rounded))
                            .foregroundStyle(color)
                        Text(NativeMathFormatter.displayInlineMath(in: variable.explanation))
                            .font(.system(size: Lab.size(12), design: .rounded))
                            .foregroundStyle(Lab.text)
                        Text([variable.unit, variable.dimension].compactMap { $0 }.joined(separator: " · "))
                            .font(.system(size: Lab.size(9), weight: .bold, design: .rounded))
                            .foregroundStyle(Lab.secondary)
                if let metric = variable.telemetryMetricLabel {
                    Label(metric, systemImage: "waveform.path.ecg")
                                .font(.system(size: Lab.size(9.5), weight: .semibold, design: .rounded))
                                .foregroundStyle(Lab.emerald)
                        }
                        if let telemetryKey = variable.telemetryKey, !telemetryKey.isEmpty {
                            Text("TELEMETRY · \(telemetryKey)")
                                .font(.system(size: Lab.size(8), weight: .bold, design: .rounded))
                                .foregroundStyle(Lab.secondary)
                                .textSelection(.enabled)
                        }
                    }
                    .transition(.opacity)
                }

                Text(NativeMathFormatter.displayInlineMath(in: equation.pedagogicalNote))
                    .font(.system(size: Lab.size(11.5), design: .rounded))
                    .foregroundStyle(Lab.secondary)
                    .textSelection(.enabled)
                if !equation.plainEnglishSentence.isEmpty {
                    plainEnglishSentence
                }
                if let significance = equation.historicalSignificance, !significance.isEmpty {
                    Label(significance, systemImage: "clock.arrow.trianglehead.counterclockwise.rotate.90")
                        .font(.system(size: Lab.size(10.5), design: .serif))
                        .foregroundStyle(Lab.brass)
                }
                DisclosureGroup("Equation source") {
                    VStack(alignment: .leading, spacing: 7) {
                        Text(equation.rawLatex)
                        if equation.colorizedLatex != equation.rawLatex {
                            Text(equation.colorizedLatex)
                                .foregroundStyle(Lab.secondary)
                        }
                    }
                    .font(.system(size: Lab.size(9), design: .rounded))
                    .textSelection(.enabled)
                    .padding(.top, 6)
                }
                .font(.system(size: Lab.size(9.5), weight: .semibold, design: .rounded))
                .tint(Lab.brass)
            }
        }
        .onAppear { selectedVariableID = selectedVariableID ?? equation.variables.first?.id }
    }

    private var plainEnglishSentence: some View {
        equation.plainEnglishSentence.reduce(Text("")) { partial, fragment in
            guard let variableID = fragment.variableId,
                  let variable = equation.variables.first(where: { $0.id == variableID }) else {
                return partial + Text(fragment.text)
            }
            return partial + Text(fragment.text)
                .foregroundColor(NativeDocumentStyle.equationColor(variable.color))
                .fontWeight(.semibold)
        }
        .font(.system(size: Lab.size(11.5), design: .rounded))
        .foregroundStyle(Lab.text)
        .textSelection(.enabled)
        .padding(10)
        .background(Lab.blueprint.opacity(0.055), in: RoundedRectangle(cornerRadius: 10))
    }

    private var equationLines: [String] {
        let separators = [
            "\\quad \\text{where} \\quad",
            "\\qquad \\text{where} \\qquad",
        ]
        for separator in separators {
            let pieces = equation.colorizedLatex.components(separatedBy: separator)
            if pieces.count == 2 {
                return [pieces[0], "\\text{where} \\quad " + pieces[1]]
            }
        }
        return [equation.colorizedLatex]
    }

    private func equationView(_ latex: String, pointSize: CGFloat) -> some View {
        NativeMathView(
            latex: latex,
            pointSize: pointSize,
            defaultColor: Lab.parchment
        )
        .padding(.horizontal, 4)
        .padding(.vertical, 10)
    }

    private func variableButton(_ variable: EquationVariable) -> some View {
        let color = NativeDocumentStyle.equationColor(variable.color)
        return Button {
            selectedVariableID = variable.id
        } label: {
            VStack(alignment: .leading, spacing: 2) {
                NativeMathView(
                    latex: variable.symbol,
                    pointSize: Lab.size(14),
                    defaultColor: color
                )
                Text(variable.name)
                    .font(.system(size: Lab.size(9.5), weight: .semibold, design: .rounded))
                    .lineLimit(1)
                    .minimumScaleFactor(0.74)
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 11)
            .padding(.vertical, 8)
            .background(color.opacity(selectedVariableID == variable.id ? 0.18 : 0.07), in: RoundedRectangle(cornerRadius: 10))
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(color.opacity(0.44)))
        }
        .buttonStyle(.plain)
    }
}

struct RichInlineText: View {
    let inlines: [CuratedSpecificationInline]

    var body: some View {
        composed
            .font(.system(size: Lab.size(14), design: .serif))
            .foregroundStyle(Lab.parchment)
            .textSelection(.enabled)
            .fixedSize(horizontal: false, vertical: true)
    }

    private var composed: Text {
        inlines.reduce(Text("")) { result, inline in
            let piece = Text(NativeMathFormatter.displayInlineMath(in: inline.text))
            switch inline.kind {
            case "emphasis": return result + piece.italic()
            case "small-caps": return result + piece.fontWeight(.semibold)
            case "term": return result + piece.foregroundColor(Lab.brass).underline(pattern: .dot)
            case "reference": return result + piece.foregroundColor(Lab.blueprint).fontWeight(.semibold)
            default: return result + piece
            }
        }
    }
}

struct CuratedSpecificationReader: View {
    let patent: PatentRecord
    @State private var selectedPreview: FigurePreview?

    var body: some View {
        Group {
            if let edition = patent.archivalEdition {
                VStack(alignment: .leading, spacing: 18) {
                    editionProvenance(edition)
                    ForEach(Array(edition.blocks.enumerated()), id: \.offset) { index, block in
                        blockView(block, index: index)
                    }
                    if let status = edition.claimStatus { statusPanel("Claims", status) }
                    if let status = edition.drawingStatus { statusPanel("Drawings", status) }
                }
            } else if patent.originalTextAsset != nil {
                BundledSourceTranscriptionReader(patent: patent)
            } else {
                SourceBoundaryReader(patent: patent)
            }
        }
        .sheet(item: $selectedPreview) { preview in
            NativeFigurePreviewSheet(preview: preview)
        }
    }

    private func editionProvenance(_ edition: CuratedSpecificationEdition) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 7) {
                MuseumLabel(
                    text: patent.archivalPublication.isPublished
                        ? "Verified archival edition"
                        : "Archival edition · source review status"
                )
                Label(
                    edition.completeFacsimileReviewed == true ? "Complete facsimile reviewed" : "Facsimile review in progress",
                    systemImage: edition.completeFacsimileReviewed == true ? "checkmark.seal.fill" : "hourglass"
                )
                .foregroundStyle(edition.completeFacsimileReviewed == true ? Lab.emerald : Lab.brass)
                Text("Prepared by \(edition.preparedBy) · \(edition.preparedAt)")
                    .font(.system(size: Lab.size(10.5), design: .rounded))
                    .foregroundStyle(Lab.secondary)
                Text("SOURCE SHA-256")
                    .font(.system(size: Lab.size(8), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.secondary)
                Text(splitDigest(edition.sourcePdfSha256))
                    .font(.system(size: Lab.size(8.5), design: .rounded))
                    .foregroundStyle(Lab.secondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .textSelection(.enabled)
                if !patent.archivalPublication.isPublished {
                    Label(patent.archivalPublication.explanation, systemImage: "exclamationmark.shield")
                        .font(.system(size: Lab.size(10.5), design: .rounded))
                        .foregroundStyle(Lab.brass)
                }
                if !patent.withheldAssets.isEmpty {
                    Label(
                        "\(patent.withheldAssets.count) source crop\(patent.withheldAssets.count == 1 ? "" : "s") withheld by the upstream review gate; the complete bundled source sheet is shown instead.",
                        systemImage: "exclamationmark.shield"
                    )
                    .font(.system(size: Lab.size(10.5), design: .rounded))
                    .foregroundStyle(Lab.brass)
                }
            }
        }
    }

    /// Keep archival digests copyable while preventing a single orphaned hex
    /// digit on compact phones. SHA-256 is ASCII, so a balanced two-line split
    /// is both stable and easier to compare against the source manifest.
    private func splitDigest(_ digest: String) -> String {
        guard digest.count > 40 else { return digest }
        let midpoint = digest.index(digest.startIndex, offsetBy: digest.count / 2)
        return "\(digest[..<midpoint])\n\(digest[midpoint...])"
    }

    @ViewBuilder
    private func blockView(_ block: CuratedSpecificationBlock, index: Int) -> some View {
        switch block.kind {
        case "masthead":
            VStack(alignment: .center, spacing: 5) {
                ForEach(Array((block.lines ?? []).enumerated()), id: \.offset) { _, line in
                    Text(line)
                        .font(.system(size: Lab.size(15), weight: .bold, design: .serif))
                        .multilineTextAlignment(.center)
                        .foregroundStyle(Lab.parchment)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 18)
        case "heading":
            Text(block.text ?? "")
                .font(.system(size: Lab.size(block.level == 2 ? 22 : 18), weight: .bold, design: .serif))
                .foregroundStyle(Lab.brass)
                .padding(.top, 8)
        case "paragraph":
            parallelReading(source: block.inlines ?? [], index: index)
        case "claim":
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Claim \(block.number ?? 0)")
                    RichInlineText(inlines: block.inlines ?? [])
                }
            }
        case "figure-sheet":
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: block.figureLabel ?? "Figure sheet")
                    if let title = block.title { Text(title).font(.headline).foregroundStyle(Lab.parchment) }
                    RichInlineText(inlines: block.description ?? [])
                    figurePreviews(from: block.description ?? [])
                }
            }
        case "table":
            nativeTable(block)
        case "equation":
            MuseumPanel {
                VStack(alignment: .leading, spacing: 8) {
                    ScrollView(.horizontal, showsIndicators: false) {
                        NativeMathView(latex: block.text ?? "", pointSize: Lab.size(20), defaultColor: Lab.brass)
                            .padding(.vertical, 4)
                    }
                    if let description = block.description?.first?.text {
                        Text(NativeMathFormatter.displayInlineMath(in: description)).foregroundStyle(Lab.secondary)
                    }
                }
            }
        default:
            EmptyView()
        }
    }

    private func parallelReading(source: [CuratedSpecificationInline], index: Int) -> some View {
        let reading = patent.archivalParallelReadings[String(index)] ?? []
        return ViewThatFits(in: .horizontal) {
            HStack(alignment: .top, spacing: 18) {
                sourceColumn(source).frame(maxWidth: .infinity, alignment: .leading)
                if !reading.isEmpty { readingColumn(reading).frame(maxWidth: 360, alignment: .leading) }
            }
            VStack(alignment: .leading, spacing: 12) {
                sourceColumn(source)
                if !reading.isEmpty { readingColumn(reading) }
            }
        }
        .padding(.vertical, 7)
    }

    private func sourceColumn(_ source: [CuratedSpecificationInline]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("ORIGINAL PATENT TEXT")
                .font(.system(size: Lab.size(8.5), weight: .bold, design: .rounded))
                .foregroundStyle(Lab.secondary)
            RichInlineText(inlines: source)
            figurePreviews(from: source)
            let terms = source.filter { $0.kind == "term" && $0.definition != nil }
            ForEach(Array(terms.enumerated()), id: \.offset) { _, term in
                DisclosureGroup(term.label ?? term.text) {
                    VStack(alignment: .leading, spacing: 4) {
                        if let label = term.label, label != term.text {
                            Text(term.text)
                                .fontWeight(.semibold)
                                .foregroundStyle(Lab.brass)
                        }
                        Text(term.definition ?? "")
                    }
                        .font(.system(size: Lab.size(11.5), design: .rounded))
                        .foregroundStyle(Lab.text)
                        .padding(.top, 5)
                }
                .font(.system(size: Lab.size(10.5), weight: .semibold, design: .rounded))
                .tint(Lab.brass)
            }
        }
    }

    private func readingColumn(_ reading: [String]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("PLAIN ENGLISH")
                .font(.system(size: Lab.size(8.5), weight: .bold, design: .rounded))
                .foregroundStyle(Lab.emerald)
            ForEach(Array(reading.enumerated()), id: \.offset) { _, paragraph in
                Text(NativeMathFormatter.displayInlineMath(in: paragraph))
                    .font(.system(size: Lab.size(12.5), design: .rounded))
                    .foregroundStyle(Lab.text)
                    .textSelection(.enabled)
            }
        }
        .padding(14)
        .background(Lab.emerald.opacity(0.06), in: RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Lab.emerald.opacity(0.25)))
    }

    @ViewBuilder
    private func figurePreviews(from inlines: [CuratedSpecificationInline]) -> some View {
        let previews = uniquePreviews(from: inlines)
        if !previews.isEmpty {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(previews) { preview in
                        Button {
                            selectedPreview = preview
                        } label: {
                            PatentAssetImage(path: preview.bundlePath, alt: preview.alt)
                                .frame(width: 260, height: 210)
                                .overlay(alignment: .topTrailing) {
                                    Image(systemName: "arrow.up.left.and.arrow.down.right")
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundStyle(Lab.background)
                                        .padding(7)
                                        .background(Lab.brass, in: Circle())
                                        .padding(8)
                                }
                        }
                        .buttonStyle(.plain)
                        .accessibilityHint("Opens the source figure at full size")
                    }
                }
            }
        }
    }

    private func uniquePreviews(from inlines: [CuratedSpecificationInline]) -> [FigurePreview] {
        var seen = Set<String>()
        return inlines
            .flatMap { $0.figurePreviews ?? [] }
            .filter { seen.insert($0.src).inserted }
    }

    private func nativeTable(_ block: CuratedSpecificationBlock) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 8) {
                if let caption = block.caption { Text(caption).font(.headline).foregroundStyle(Lab.brass) }
                if let headers = block.headers {
                    HStack(alignment: .top) {
                        ForEach(Array(headers.enumerated()), id: \.offset) { _, header in
                            RichInlineText(inlines: header).fontWeight(.bold).frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                }
                ForEach(Array((block.rows ?? []).enumerated()), id: \.offset) { _, row in
                    Divider().overlay(Lab.stroke)
                    HStack(alignment: .top) {
                        ForEach(Array(row.enumerated()), id: \.offset) { _, cell in
                            RichInlineText(inlines: cell).frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                }
            }
        }
    }

    private func statusPanel(_ name: String, _ status: EditionStatus) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 7) {
                MuseumLabel(text: "\(name) source status")
                Text(status.evidence).foregroundStyle(Lab.text).textSelection(.enabled)
            }
        }
    }
}

/// Honest native state for records whose source face was rejected by the
/// editorial provenance gate. Educational material remains available in the
/// other workstation tabs; this reader never substitutes reconstructed prose
/// for missing primary-source bytes.
private struct SourceBoundaryReader: View {
    let patent: PatentRecord

    var body: some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 12) {
                Label("Primary-source edition quarantined", systemImage: "exclamationmark.shield.fill")
                    .font(.system(size: Lab.size(17), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.brass)
                Text(patent.archivalPublication.explanation)
                    .font(.system(size: Lab.size(13), design: .serif))
                    .foregroundStyle(Lab.text)
                    .textSelection(.enabled)
                Text("The app deliberately does not present reconstructed material as patent text. The educational explanation and native mechanism exhibit remain available, and the pinned PDF can be downloaded only when you request it.")
                    .font(.system(size: Lab.size(11.5), design: .rounded))
                    .foregroundStyle(Lab.secondary)
            }
        }
    }
}

private struct BundledSourcePage: Identifiable, Sendable {
    let number: Int
    let title: String
    let text: String

    var id: Int { number }
}

/// Fail-soft native reader for the sole record whose curated editorial edition
/// has not yet landed upstream. The complete source-PDF text layer is already
/// bundled with the app; never replace those bytes with a placeholder or fetch
/// them from the network.
private struct BundledSourceTranscriptionReader: View {
    let patent: PatentRecord
    @State private var pages: [BundledSourcePage] = []
    @State private var errorMessage: String?

    private var bundlePath: String? {
        guard let path = patent.originalTextAsset?.url, !path.isEmpty else { return nil }
        return path.hasPrefix("/") ? String(path.dropFirst()) : path
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 7) {
                    MuseumLabel(text: "Bundled source transcription")
                    Text(sourceReaderDescription)
                        .font(.system(size: Lab.size(12.5), design: .serif))
                        .foregroundStyle(Lab.text)
                    if let asset = patent.originalTextAsset {
                        Text("\(asset.pageCount) source pages · \(asset.kind ?? "verified text layer")")
                            .font(.system(size: Lab.size(10), weight: .semibold, design: .rounded))
                            .foregroundStyle(Lab.secondary)
                    }
                }
            }

            if pages.isEmpty, errorMessage == nil {
                ProgressView("Opening bundled transcription…")
                    .tint(Lab.brass)
                    .frame(maxWidth: .infinity)
                    .padding(28)
            } else if let errorMessage {
                MuseumPanel {
                    ContentUnavailableView(
                        "Bundled transcription unavailable",
                        systemImage: "doc.text.magnifyingglass",
                        description: Text(errorMessage)
                    )
                }
            } else {
                LazyVStack(alignment: .leading, spacing: 14) {
                    ForEach(pages) { page in
                        MuseumPanel {
                            VStack(alignment: .leading, spacing: 10) {
                                Text(page.title)
                                    .font(.system(size: Lab.size(10), weight: .bold, design: .rounded))
                                    .foregroundStyle(Lab.brass)
                                Text(page.text)
                                    .font(.system(size: Lab.size(13), design: .serif))
                                    .foregroundStyle(Lab.parchment)
                                    .textSelection(.enabled)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                    }
                }
            }
        }
        .task(id: bundlePath) {
            pages = []
            errorMessage = nil
            guard let bundlePath,
                  let url = PatentBundleResource.url(for: bundlePath) else {
                errorMessage = "The verified local source-text asset is missing from this build."
                return
            }
            do {
                let source = try await Task.detached(priority: .utility) {
                    try String(contentsOf: url, encoding: .utf8)
                }.value
                try Task.checkCancellation()
                let parsed = Self.parsePages(source)
                guard !parsed.isEmpty,
                      parsed.count == patent.originalTextAsset?.pageCount else {
                    throw CocoaError(.fileReadCorruptFile)
                }
                pages = parsed
                errorMessage = nil
            } catch is CancellationError {
                return
            } catch {
                pages = []
                errorMessage = "The bundled transcription failed its \(patent.originalTextAsset?.pageCount ?? 0)-page completeness check."
            }
        }
    }

    private var sourceReaderDescription: String {
        let pageCount = patent.originalTextAsset?.pageCount ?? pages.count
        let pageLabel = pageCount == 1 ? "page" : "pages"
        return "The continuously edited archival edition is still in preparation. "
            + "The complete local text layer from the \(pageCount) source \(pageLabel) is presented below instead; "
            + "it never leaves this device."
    }

    nonisolated private static func parsePages(_ source: String) -> [BundledSourcePage] {
        let marker = "--- SOURCE PDF PAGE "
        let chunks = source.components(separatedBy: marker)
        let parsed = chunks.dropFirst().enumerated().compactMap { index, chunk -> BundledSourcePage? in
            guard let lineBreak = chunk.firstIndex(of: "\n") else { return nil }
            let heading = chunk[..<lineBreak]
                .trimmingCharacters(in: CharacterSet(charactersIn: "- \t\r\n"))
            let body = chunk[chunk.index(after: lineBreak)...]
                .trimmingCharacters(in: .whitespacesAndNewlines)
            guard !body.isEmpty else { return nil }
            return BundledSourcePage(
                number: index + 1,
                title: "SOURCE PDF PAGE \(heading)",
                text: body
            )
        }
        if !parsed.isEmpty { return parsed }
        let trimmed = source.trimmingCharacters(in: .whitespacesAndNewlines)
        return trimmed.isEmpty ? [] : [BundledSourcePage(number: 1, title: "SOURCE TRANSCRIPTION", text: trimmed)]
    }
}

private struct NativeFigurePreviewSheet: View {
    let preview: FigurePreview
    @Environment(\.dismiss) private var dismiss
    @State private var showsActualSize = false

    var body: some View {
        NavigationStack {
            GeometryReader { proxy in
                ScrollView([.horizontal, .vertical]) {
                    PatentAssetImage(path: preview.bundlePath, alt: preview.alt)
                        .frame(
                            width: showsActualSize
                                ? max(proxy.size.width - 32, CGFloat(preview.width))
                                : proxy.size.width - 32,
                            height: showsActualSize
                                ? max(proxy.size.height - 32, CGFloat(preview.height))
                                : proxy.size.height - 32
                        )
                        .padding(16)
                }
                .background(MuseumBackground())
            }
            .navigationTitle(preview.alt)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button {
                        showsActualSize.toggle()
                    } label: {
                        Label(
                            showsActualSize ? "Fit" : "Actual size",
                            systemImage: showsActualSize ? "arrow.down.right.and.arrow.up.left" : "1.magnifyingglass"
                        )
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}

struct PatentAssetImage: View {
    let path: String
    let alt: String
    @State private var resolvedImage: CachedPatentAsset?
    @State private var isLoading = true

    static func intrinsicAspectRatio(for path: String) -> CGFloat? {
        if let cached = PatentAssetImageCache.aspectRatio(for: path) {
            return cached
        }
        if let cached = PatentAssetImageCache.shared.object(forKey: path as NSString) {
            let size = cached.image.size
            guard size.height > 0 else { return nil }
            let ratio = size.width / size.height
            PatentAssetImageCache.setAspectRatio(ratio, for: path)
            return ratio
        }
        guard let resource = PatentBundleResource.url(for: path),
              let source = CGImageSourceCreateWithURL(resource as CFURL, nil),
              let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
              let width = properties[kCGImagePropertyPixelWidth] as? NSNumber,
              let height = properties[kCGImagePropertyPixelHeight] as? NSNumber,
              height.doubleValue > 0 else { return nil }
        let ratio = CGFloat(width.doubleValue / height.doubleValue)
        PatentAssetImageCache.setAspectRatio(ratio, for: path)
        return ratio
    }

    var body: some View {
        Group {
            if let resolvedImage {
                Image(uiImage: resolvedImage.image)
                    .resizable()
                    .scaledToFit()
                    .padding(8)
                    .background(Color.white)
                    .overlay(alignment: .bottomLeading) {
                        if resolvedImage.isSourceSheetFallback {
                            Text("FULL SOURCE SHEET · CROP REVIEW PENDING")
                                .font(.system(size: Lab.size(7.5), weight: .black, design: .rounded))
                                .foregroundStyle(Lab.background)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 5)
                                .background(Lab.brass, in: Capsule())
                                .padding(8)
                        }
                    }
            } else if isLoading {
                ProgressView("Opening figure…")
                    .tint(Lab.brass)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Lab.panel)
            } else {
                ContentUnavailableView("Figure unavailable", systemImage: "photo", description: Text(alt))
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Lab.brass.opacity(0.25)))
        .accessibilityLabel(alt)
        .task(id: path) {
            isLoading = true
            resolvedImage = nil
            if let cached = PatentAssetImageCache.shared.object(forKey: path as NSString) {
                resolvedImage = cached
                isLoading = false
                return
            }
            let loaded = await Task.detached(priority: .utility) {
                PatentAssetLoader.load(path: path)
            }.value
            guard !Task.isCancelled else { return }
            resolvedImage = loaded
            isLoading = false
        }
    }
}

enum PatentBundleResource {
    static func url(for path: String) -> URL? {
        let url = URL(fileURLWithPath: path)
        let ext = url.pathExtension
        let name = url.deletingPathExtension().lastPathComponent
        let directory = url.deletingLastPathComponent().path
        return Bundle.main.url(
            forResource: name,
            withExtension: ext.isEmpty ? nil : ext,
            subdirectory: directory == "." ? nil : directory
        )
    }
}

private final class CachedPatentAsset: @unchecked Sendable {
    let image: UIImage
    let isSourceSheetFallback: Bool

    init(image: UIImage, isSourceSheetFallback: Bool) {
        self.image = image
        self.isSourceSheetFallback = isSourceSheetFallback
    }
}

private enum PatentAssetLoader {
    nonisolated static func load(path: String) -> CachedPatentAsset? {
        if let cached = PatentAssetImageCache.shared.object(forKey: path as NSString) {
            return cached
        }
        if let resource = PatentBundleResource.url(for: path),
           let image = UIImage(contentsOfFile: resource.path) {
            return cache(image: image, path: path, isSourceSheetFallback: false)
        }
        // Candidate archival editions deliberately name future accepted crops
        // that do not yet exist. Never substitute a different crop: show the
        // complete local source sheet, clearly labelled as a fallback.
        let directory = URL(fileURLWithPath: path).deletingLastPathComponent().path
        for candidate in ["page-01", "page-1"] {
            if let resource = Bundle.main.url(
                forResource: candidate,
                withExtension: "png",
                subdirectory: directory == "." ? nil : directory
            ), let image = UIImage(contentsOfFile: resource.path) {
                return cache(image: image, path: path, isSourceSheetFallback: true)
            }
        }
        return nil
    }

    nonisolated private static func cache(
        image: UIImage,
        path: String,
        isSourceSheetFallback: Bool
    ) -> CachedPatentAsset {
        let cached = CachedPatentAsset(image: image, isSourceSheetFallback: isSourceSheetFallback)
        PatentAssetImageCache.shared.setObject(
            cached,
            forKey: path as NSString,
            cost: PatentAssetImageCache.cost(of: image)
        )
        let size = image.size
        if size.height > 0 {
            PatentAssetImageCache.setAspectRatio(size.width / size.height, for: path)
        }
        return cached
    }
}

private enum PatentAssetImageCache {
    private static let aspectRatios = NSCache<NSString, NSNumber>()
    static let shared: NSCache<NSString, CachedPatentAsset> = {
        let cache = NSCache<NSString, CachedPatentAsset>()
        cache.countLimit = 32
        cache.totalCostLimit = 96 * 1_024 * 1_024
        return cache
    }()

    static func cost(of image: UIImage) -> Int {
        guard let cgImage = image.cgImage else { return 1 }
        return cgImage.bytesPerRow * cgImage.height
    }

    static func aspectRatio(for path: String) -> CGFloat? {
        aspectRatios.object(forKey: path as NSString).map { CGFloat(truncating: $0) }
    }

    static func setAspectRatio(_ ratio: CGFloat, for path: String) {
        aspectRatios.setObject(NSNumber(value: Double(ratio)), forKey: path as NSString)
    }
}
