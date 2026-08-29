import SwiftUI
import UIKit

enum Lab {
    static let background = Color(red: 0.018, green: 0.024, blue: 0.027)
    static let backgroundWarm = Color(red: 0.055, green: 0.043, blue: 0.026)
    static let panel = Color.black.opacity(0.55)
    static let stroke = Color.white.opacity(0.09)
    static let emerald = Color(red: 0.20, green: 0.83, blue: 0.60)
    static let blueprint = Color(red: 0.20, green: 0.72, blue: 0.98)
    static let brass = Color(red: 0.85, green: 0.65, blue: 0.31)
    static let parchment = Color(red: 0.96, green: 0.91, blue: 0.80)
    static let text = Color(red: 0.91, green: 0.92, blue: 0.93)
    static let secondary = Color(red: 0.61, green: 0.65, blue: 0.70)
    static let danger = Color(red: 0.97, green: 0.44, blue: 0.44)

    static func size(_ base: CGFloat) -> CGFloat {
#if targetEnvironment(macCatalyst)
        base * 1.50
#else
        UIFontMetrics(forTextStyle: .body).scaledValue(for: base * 1.06)
#endif
    }

    static func categoryColor(_ category: String) -> Color {
        _ = category
        return blueprint
    }

    static func categorySymbol(_ category: String) -> String {
        switch category {
        case "aviation": "airplane"
        case "aerospace": "rocket"
        case "electricity": "bolt.fill"
        case "telecom": "wave.3.right"
        case "computing": "cpu"
        case "materials": "hexagon.fill"
        case "optics": "camera.aperture"
        default: "gearshape.2.fill"
        }
    }
}

struct FrankenWordmark: View {
    var body: some View {
        (
            Text("F")
                .font(.system(size: Lab.size(22), weight: .black, design: .monospaced))
                .foregroundColor(Lab.text.opacity(0.88))
            + Text("RANKEN")
                .font(.system(size: Lab.size(14.5), weight: .black, design: .monospaced))
                .foregroundColor(Lab.text.opacity(0.88))
            + Text("P")
                .font(.system(size: Lab.size(22), weight: .black, design: .monospaced))
                .foregroundColor(Lab.brass)
            + Text("ATENTS")
                .font(.system(size: Lab.size(14.5), weight: .black, design: .monospaced))
                .foregroundColor(Lab.brass)
        )
        .kerning(0.75)
        .lineLimit(1)
        .minimumScaleFactor(0.60)
        .allowsTightening(true)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("FrankenPatents")
    }
}

struct MuseumBackground: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        ZStack {
            LinearGradient(colors: [Lab.backgroundWarm, Lab.background], startPoint: .topLeading, endPoint: .bottomTrailing)
            RadialGradient(
                colors: [Lab.brass.opacity(reduceTransparency ? 0.05 : 0.13), .clear],
                center: .topLeading,
                startRadius: 0,
                endRadius: 760
            )
            Canvas { context, size in
                var grid = Path()
                let step: CGFloat = 48
                stride(from: CGFloat.zero, through: size.width, by: step).forEach { x in
                    grid.move(to: CGPoint(x: x, y: 0))
                    grid.addLine(to: CGPoint(x: x, y: size.height))
                }
                stride(from: CGFloat.zero, through: size.height, by: step).forEach { y in
                    grid.move(to: CGPoint(x: 0, y: y))
                    grid.addLine(to: CGPoint(x: size.width, y: y))
                }
                context.stroke(grid, with: .color(Lab.blueprint.opacity(0.028)), lineWidth: 0.6)
            }
            .accessibilityHidden(true)
        }
        .ignoresSafeArea()
    }
}

struct MuseumPanel<Content: View>: View {
    @ViewBuilder var content: Content

    var body: some View {
        content
            .padding(17)
            .background(Lab.panel, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay {
                RoundedRectangle(cornerRadius: 20, style: .continuous)
                    .stroke(
                        LinearGradient(colors: [Lab.brass.opacity(0.34), Lab.stroke, Lab.blueprint.opacity(0.16)], startPoint: .topLeading, endPoint: .bottomTrailing),
                        lineWidth: 1
                    )
            }
            .shadow(color: .black.opacity(0.30), radius: 18, y: 9)
    }
}

struct MuseumLabel: View {
    let text: String

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: Lab.size(10.5), weight: .bold, design: .monospaced))
            .kerning(1.5)
            .foregroundStyle(Lab.brass)
    }
}

struct MuseumCapsuleButtonStyle: ButtonStyle {
    var tint: Color = Lab.brass
    var filled = false
    @Environment(\.isEnabled) private var isEnabled

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.system(size: Lab.size(11.5), weight: .bold, design: .rounded))
            .lineLimit(1)
            .padding(.horizontal, 15)
            .padding(.vertical, 11)
            .frame(minHeight: 44)
            .foregroundStyle(filled ? Lab.background : tint)
            .background(filled ? tint : tint.opacity(configuration.isPressed ? 0.16 : 0.06), in: Capsule())
            .overlay(Capsule().stroke(tint.opacity(filled ? 0 : 0.42), lineWidth: 1))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .opacity(isEnabled ? 1 : 0.35)
    }
}
