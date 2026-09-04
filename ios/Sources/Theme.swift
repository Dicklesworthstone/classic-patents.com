import SwiftUI
import UIKit

enum LabAppearance: String {
    static let storageKey = "frankenpatents.appearance"
    case dark
    case light
    var colorScheme: ColorScheme { self == .dark ? .dark : .light }
}

enum Lab {
    static let background = adaptive(dark: UIColor(red: 0.018, green: 0.024, blue: 0.027, alpha: 1), light: UIColor(red: 0.945, green: 0.925, blue: 0.875, alpha: 1))
    static let backgroundWarm = adaptive(dark: UIColor(red: 0.055, green: 0.043, blue: 0.026, alpha: 1), light: UIColor(red: 0.985, green: 0.955, blue: 0.885, alpha: 1))
    static let panel = adaptive(dark: UIColor(white: 0, alpha: 0.55), light: UIColor(red: 1, green: 0.985, blue: 0.94, alpha: 0.96))
    static let panelStrong = adaptive(dark: UIColor(white: 0, alpha: 0.74), light: UIColor(red: 0.90, green: 0.86, blue: 0.76, alpha: 0.96))
    static let stroke = adaptive(dark: UIColor(white: 1, alpha: 0.09), light: UIColor(red: 0.33, green: 0.24, blue: 0.10, alpha: 0.18))
    static let emerald = adaptive(dark: UIColor(red: 0.20, green: 0.83, blue: 0.60, alpha: 1), light: UIColor(red: 0.02, green: 0.405, blue: 0.245, alpha: 1))
    static let blueprint = adaptive(dark: UIColor(red: 0.20, green: 0.72, blue: 0.98, alpha: 1), light: UIColor(red: 0.035, green: 0.36, blue: 0.60, alpha: 1))
    static let brass = adaptive(dark: UIColor(red: 0.85, green: 0.65, blue: 0.31, alpha: 1), light: UIColor(red: 0.56, green: 0.33, blue: 0.055, alpha: 1))
    static let parchment = adaptive(dark: UIColor(red: 0.96, green: 0.91, blue: 0.80, alpha: 1), light: UIColor(red: 0.16, green: 0.115, blue: 0.065, alpha: 1))
    static let text = adaptive(dark: UIColor(red: 0.91, green: 0.92, blue: 0.93, alpha: 1), light: UIColor(red: 0.105, green: 0.095, blue: 0.075, alpha: 1))
    static let secondary = adaptive(dark: UIColor(red: 0.61, green: 0.65, blue: 0.70, alpha: 1), light: UIColor(red: 0.37, green: 0.335, blue: 0.275, alpha: 1))
    static let danger = adaptive(dark: UIColor(red: 0.97, green: 0.44, blue: 0.44, alpha: 1), light: UIColor(red: 0.70, green: 0.12, blue: 0.16, alpha: 1))

    private static func adaptive(dark: UIColor, light: UIColor) -> Color {
        Color(uiColor: UIColor { traits in traits.userInterfaceStyle == .dark ? dark : light })
    }

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
        case "aerospace": "moon.stars.fill"
        case "electricity": "bolt.fill"
        case "telecom": "wave.3.right"
        case "computing": "cpu"
        case "materials": "hexagon.fill"
        case "optics": "camera.aperture"
        default: "gearshape.2.fill"
        }
    }
}

struct LabAppearanceButton: View {
    @Binding var selection: String
    private var appearance: LabAppearance { LabAppearance(rawValue: selection) ?? .dark }

    var body: some View {
        Button {
            selection = appearance == .dark ? LabAppearance.light.rawValue : LabAppearance.dark.rawValue
        } label: {
            Image(systemName: appearance == .dark ? "sun.max.fill" : "moon.stars.fill")
                .font(.system(size: Lab.size(14), weight: .bold))
                .frame(width: 44, height: 44)
                .background(Lab.panelStrong, in: Circle())
                .overlay(Circle().stroke(Lab.stroke))
        }
        .buttonStyle(.plain)
        .foregroundStyle(appearance == .dark ? Lab.brass : Lab.blueprint)
        .accessibilityIdentifier("appearance-toggle")
        .accessibilityLabel(appearance == .dark ? "Switch to light mode" : "Switch to dark mode")
        .accessibilityValue(appearance == .dark ? "Dark mode" : "Light mode")
        .accessibilityHint("Remembers this choice for future launches")
    }
}

struct FrankenWordmark: View {
    var body: some View {
        (
            Text("F")
                .font(.system(size: Lab.size(22), weight: .black, design: .rounded))
                .foregroundColor(Lab.text.opacity(0.88))
            + Text("RANKEN")
                .font(.system(size: Lab.size(14.5), weight: .black, design: .rounded))
                .foregroundColor(Lab.text.opacity(0.88))
            + Text("P")
                .font(.system(size: Lab.size(22), weight: .black, design: .rounded))
                .foregroundColor(Lab.brass)
            + Text("ATENTS")
                .font(.system(size: Lab.size(14.5), weight: .black, design: .rounded))
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
            .font(.system(size: Lab.size(10.5), weight: .bold, design: .rounded))
            .kerning(1.5)
            .foregroundStyle(Lab.brass)
    }
}

/// Shared native exhibit glyph. This belongs to the live museum design system,
/// not the superseded legacy detail screen that originally defined it.
struct BlueprintGlyph: View {
    let category: String
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        TimelineView(.animation(minimumInterval: reduceMotion ? 1 : 1 / 30)) { timeline in
            Canvas { context, size in
                let color = Lab.categoryColor(category)
                let center = CGPoint(x: size.width / 2, y: size.height / 2)
                let time = reduceMotion ? 0 : timeline.date.timeIntervalSinceReferenceDate
                for index in 0..<5 {
                    let radius = CGFloat(18 + index * 12)
                    context.stroke(
                        Path(ellipseIn: CGRect(
                            x: center.x - radius,
                            y: center.y - radius,
                            width: radius * 2,
                            height: radius * 2
                        )),
                        with: .color(color.opacity(0.12 + Double(index) * 0.05)),
                        lineWidth: 1
                    )
                }
                for index in 0..<7 {
                    let angle = time * 0.28 + Double(index) * (.pi * 2 / 7)
                    let radius = CGFloat(22 + index * 5)
                    let point = CGPoint(
                        x: center.x + CGFloat(cos(angle)) * radius,
                        y: center.y + CGFloat(sin(angle)) * radius
                    )
                    context.fill(
                        Path(ellipseIn: CGRect(x: point.x - 3, y: point.y - 3, width: 6, height: 6)),
                        with: .color(index.isMultiple(of: 2) ? Lab.brass : color)
                    )
                    var spoke = Path()
                    spoke.move(to: center)
                    spoke.addLine(to: point)
                    context.stroke(spoke, with: .color(color.opacity(0.34)), lineWidth: 0.8)
                }
                context.draw(
                    Text(Image(systemName: Lab.categorySymbol(category)))
                        .font(.system(size: 34, weight: .semibold))
                        .foregroundColor(color),
                    at: center
                )
            }
        }
        .background(Lab.blueprint.opacity(0.05), in: RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).stroke(Lab.blueprint.opacity(0.18)))
        .accessibilityHidden(true)
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
