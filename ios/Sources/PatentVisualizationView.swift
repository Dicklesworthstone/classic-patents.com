import SwiftUI

struct NativePatentVisualization: View {
    let patent: PatentRecord
    @State private var values: [String: Double]
    @State private var isRunning = true
    @State private var showsMechanismNotes = false
    @State private var accumulatedAnimationTime: TimeInterval = 0
    @State private var animationStartedAt = Date.timeIntervalSinceReferenceDate
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass

    init(patent: PatentRecord) {
        self.patent = patent
        _values = State(initialValue: Dictionary(
            uniqueKeysWithValues: (patent.physics?.controls ?? []).map { ($0.id, $0.defaultValue) }
        ))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(alignment: .center, spacing: 12) {
                        MuseumLabel(text: patent.physics?.domainTitle ?? "Native mechanism study")
                            .lineLimit(2)
                            .minimumScaleFactor(0.78)
                        Spacer(minLength: 8)
                        animationButton
                    }

                    TimelineView(.animation(minimumInterval: reduceMotion || !isRunning ? 1 : 1 / 30)) { timeline in
                        let now = timeline.date.timeIntervalSinceReferenceDate
                        let time = reduceMotion
                            ? 0
                            : accumulatedAnimationTime + (isRunning ? max(0, now - animationStartedAt) : 0)
                        if bespokeCanvasPatents.contains(patent.id) || sourcePlatePath == nil {
                            PatentMechanismCanvas(patent: patent, values: values, time: time)
                        } else if let sourcePlatePath {
                            LiveSourcePatentPlate(
                                patent: patent,
                                path: sourcePlatePath,
                                values: values,
                                time: time
                            )
                        }
                    }
                    .frame(minHeight: 300, idealHeight: 420, maxHeight: 520)
                    .background(Color.black.opacity(0.45), in: RoundedRectangle(cornerRadius: 16))
                    .overlay(RoundedRectangle(cornerRadius: 16).stroke(Lab.blueprint.opacity(0.24)))
                    .accessibilityLabel("Native interactive visualization for \(patent.shortTitle)")

                    if horizontalSizeClass == .compact {
                        DisclosureGroup(isExpanded: $showsMechanismNotes) {
                            mechanismExplanation
                                .padding(.top, 7)
                        } label: {
                            Label("How this mechanism works", systemImage: "book.pages")
                                .font(.system(size: Lab.size(11), weight: .bold, design: .rounded))
                                .foregroundStyle(Lab.brass)
                        }
                        .tint(Lab.brass)
                    } else {
                        mechanismExplanation
                    }
                }
            }

            if let physics = patent.physics {
                ViewThatFits(in: .horizontal) {
                    HStack(alignment: .top, spacing: 14) {
                        controlPanel(physics).frame(maxWidth: .infinity)
                        theoryPanel(physics).frame(maxWidth: .infinity)
                    }
                    VStack(alignment: .leading, spacing: 14) {
                        controlPanel(physics)
                        theoryPanel(physics)
                    }
                }
            }
        }
    }

    private var mechanismExplanation: some View {
        Text(NativeMathFormatter.displayInlineMath(in: patent.plainEnglish.coreMechanism))
            .font(.system(size: Lab.size(12), design: .rounded))
            .foregroundStyle(Lab.secondary)
            .fixedSize(horizontal: false, vertical: true)
            .textSelection(.enabled)
    }

    private var animationButton: some View {
        Button {
            toggleAnimation()
        } label: {
            Label(isRunning ? "Pause" : "Play", systemImage: isRunning ? "pause.fill" : "play.fill")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.emerald, filled: true))
    }

    private func controlPanel(_ physics: PatentPhysicsMetadata) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 13) {
                HStack {
                    MuseumLabel(text: "Live controls")
                    Spacer()
                    Button("Reset") {
                        values = Dictionary(uniqueKeysWithValues: physics.controls.map { ($0.id, $0.defaultValue) })
                    }
                    .font(.system(size: Lab.size(10), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.brass)
                }
                ForEach(physics.controls) { control in
                    VStack(alignment: .leading, spacing: 5) {
                        HStack {
                            Text(control.label)
                            Spacer()
                            Text("\(values[control.id] ?? control.defaultValue, specifier: valueFormat(control.step)) \(control.unit)")
                                .foregroundStyle(Lab.blueprint)
                        }
                        .font(.system(size: Lab.size(10.5), weight: .semibold, design: .rounded))
                        if control.min == 0, control.max == 1, control.step == 1 {
                            Toggle(
                                control.id == "hasSeparateCondenser" ? "External cold vessel enabled" : "Enabled",
                                isOn: Binding(
                                    get: { (values[control.id] ?? control.defaultValue) > 0.5 },
                                    set: { values[control.id] = $0 ? 1 : 0 }
                                )
                            )
                            .font(.system(size: Lab.size(10.5), weight: .semibold, design: .rounded))
                            .tint(Lab.emerald)
                        } else {
                            Slider(
                                value: Binding(
                                    get: { values[control.id] ?? control.defaultValue },
                                    set: { values[control.id] = $0 }
                                ),
                                in: control.min...control.max,
                                step: max(control.step, 0.000_001)
                            )
                            .tint(Lab.brass)
                        }
                    }
                }
            }
        }
    }

    private func theoryPanel(_ physics: PatentPhysicsMetadata) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 11) {
                MuseumLabel(text: physics.equationName)
                ScrollView(.horizontal, showsIndicators: false) {
                    NativeMathView(latex: physics.governingEquation, pointSize: Lab.size(20), defaultColor: Lab.brass)
                        .padding(.vertical, 5)
                }
                Text(NativeMathFormatter.displayInlineMath(in: physics.pedagogicalInsight))
                    .font(.system(size: Lab.size(12.5), design: .rounded))
                    .foregroundStyle(Lab.text)
                    .textSelection(.enabled)
            }
        }
    }

    private func valueFormat(_ step: Double) -> String {
        step >= 1 ? "%.0f" : step >= 0.1 ? "%.1f" : "%.3f"
    }

    private func toggleAnimation() {
        let now = Date.timeIntervalSinceReferenceDate
        if isRunning {
            accumulatedAnimationTime += max(0, now - animationStartedAt)
        } else {
            animationStartedAt = now
        }
        isRunning.toggle()
    }

    private var sourcePlatePath: String? {
        PatentFigureAssetResolver.mechanismAsset(in: patent)
    }

    private var bespokeCanvasPatents: Set<String> {
        [
            "gb-913-watt-separate-condenser",
            "gb-931-arkwright-water-frame",
            "us-381968-tesla-motor",
            "us-4136359-wozniak-apple",
        ]
    }
}

/// A native, interactive projection of the patent's reviewed drawing plate.
/// This is the honest fallback while a bespoke kinematic scene is translated:
/// it preserves the source geometry and binds live activity to authored
/// callouts instead of substituting a category-level cartoon.
private struct LiveSourcePatentPlate: View {
    let patent: PatentRecord
    let path: String
    let values: [String: Double]
    let time: TimeInterval

    private var drawing: PatentDrawing? {
        PatentFigureAssetResolver.drawing(matching: path, in: patent)
    }

    private var drive: Double {
        guard let controls = patent.physics?.controls, !controls.isEmpty else { return 0.5 }
        let sum = controls.reduce(0.0) { result, control in
            let span = max(0.000_001, control.max - control.min)
            return result + ((values[control.id] ?? control.defaultValue) - control.min) / span
        }
        return min(1, max(0, sum / Double(controls.count)))
    }

    var body: some View {
        ZStack {
            PatentAssetImage(path: path, alt: drawing?.caption ?? patent.shortTitle)
                .aspectRatio(contentMode: .fit)
                .padding(10)
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .center)
                .background(Color(red: 0.93, green: 0.91, blue: 0.84).opacity(0.96))

            if let drawing {
                GeometryReader { proxy in
                    Canvas { context, _ in
                        let imageRect = PatentAssetLayout.fittedRect(for: path, in: proxy.size, inset: 18)
                        let points = drawing.callouts.map {
                            CGPoint(
                                x: imageRect.minX + imageRect.width * min(1, max(0, $0.x / 100)),
                                y: imageRect.minY + imageRect.height * min(1, max(0, $0.y / 100))
                            )
                        }
                        guard points.count > 1 else { return }
                        var trace = Path()
                        trace.move(to: points[0])
                        for point in points.dropFirst() { trace.addLine(to: point) }
                        context.stroke(
                            trace,
                            with: .color(Lab.blueprint.opacity(0.18 + drive * 0.30)),
                            style: StrokeStyle(lineWidth: 1.5, dash: [5, 6])
                        )
                    }
                    let imageRect = PatentAssetLayout.fittedRect(for: path, in: proxy.size, inset: 18)
                    ForEach(Array(drawing.callouts.enumerated()), id: \.element.id) { index, callout in
                        let pulse = (sin(time * (1.4 + drive) + Double(index) * 0.8) + 1) / 2
                        Text(callout.label)
                            .font(.system(size: 8.5, weight: .black, design: .rounded))
                            .foregroundStyle(Lab.background)
                            .lineLimit(1)
                            .minimumScaleFactor(0.42)
                            .frame(width: 34, height: 34)
                            .background(index.isMultiple(of: 3) ? Lab.brass : Lab.blueprint, in: Circle())
                            .overlay {
                                Circle()
                                    .stroke(.white.opacity(0.24 + pulse * 0.54), lineWidth: 1 + pulse * 1.2)
                                    .padding(-2 - pulse * 3)
                            }
                            .shadow(color: Lab.blueprint.opacity(0.28 + pulse * 0.30), radius: 4 + pulse * 5)
                            .position(
                                x: min(imageRect.maxX - 18, max(imageRect.minX + 18, imageRect.minX + imageRect.width * callout.x / 100)),
                                y: min(imageRect.maxY - 18, max(imageRect.minY + 18, imageRect.minY + imageRect.height * callout.y / 100))
                            )
                            .accessibilityLabel("\(callout.label): \(callout.description)")
                    }
                }
                .padding(10)
            }
        }
        .overlay(alignment: .topLeading) {
            Label("BUNDLED SOURCE PLATE · RESPONSIVE ANNOTATIONS", systemImage: "point.3.filled.connected.trianglepath.dotted")
                .font(.system(size: 8, weight: .black, design: .rounded))
                .foregroundStyle(Lab.background)
                .padding(.horizontal, 9)
                .padding(.vertical, 6)
                .background(Lab.brass, in: Capsule())
                .padding(10)
        }
        .clipped()
    }
}

private struct PatentMechanismCanvas: View {
    let patent: PatentRecord
    let values: [String: Double]
    let time: TimeInterval

    var body: some View {
        Canvas { context, size in
            drawGrid(context: &context, size: size)
            let phase = time * (0.35 + normalizedControl * 1.7) + seed
            if patent.id == "gb-913-watt-separate-condenser" {
                drawWattCondenser(context: &context, size: size, phase: phase)
            } else if patent.id == "gb-931-arkwright-water-frame" {
                drawArkwrightWaterFrame(context: &context, size: size, time: time)
            } else if patent.id == "us-381968-tesla-motor" {
                drawTeslaMotorFig9(context: &context, size: size, time: time)
            } else if patent.id == "us-4136359-wozniak-apple" {
                drawWozniakBus(context: &context, size: size, time: time)
            } else {
                switch patent.category {
            case "aviation", "aerospace": drawFlight(context: &context, size: size, phase: phase)
            case "electricity": drawElectromagnetics(context: &context, size: size, phase: phase)
            case "telecom": drawSignal(context: &context, size: size, phase: phase)
            case "computing": drawComputation(context: &context, size: size, phase: phase)
            case "materials": drawMaterial(context: &context, size: size, phase: phase)
            case "optics": drawOptics(context: &context, size: size, phase: phase)
            default: drawMachine(context: &context, size: size, phase: phase)
                }
            }
            drawTelemetry(context: &context, size: size, phase: phase)
        }
    }

    private var seed: Double {
        // Swift's Hashable seed is intentionally randomized per process. A
        // museum instrument needs the same initial phase on every launch.
        let hash = patent.id.utf8.reduce(UInt64(14_695_981_039_346_656_037)) {
            ($0 ^ UInt64($1)) &* 1_099_511_628_211
        }
        return Double(hash % 10_000) / 937.0
    }

    private var normalizedControl: Double {
        guard let physics = patent.physics, !physics.controls.isEmpty else { return 0.5 }
        let total = physics.controls.reduce(0.0) { partial, control in
            let span = max(0.000_001, control.max - control.min)
            return partial + ((values[control.id] ?? control.defaultValue) - control.min) / span
        }
        return min(1, max(0, total / Double(physics.controls.count)))
    }

    private func drawGrid(context: inout GraphicsContext, size: CGSize) {
        var path = Path()
        let step = max(28.0, min(size.width, size.height) / 10)
        stride(from: 0.0, through: size.width, by: step).forEach { x in
            path.move(to: CGPoint(x: x, y: 0)); path.addLine(to: CGPoint(x: x, y: size.height))
        }
        stride(from: 0.0, through: size.height, by: step).forEach { y in
            path.move(to: CGPoint(x: 0, y: y)); path.addLine(to: CGPoint(x: size.width, y: y))
        }
        context.stroke(path, with: .color(Lab.blueprint.opacity(0.055)), lineWidth: 0.6)
    }

    private func drawFlight(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let center = CGPoint(x: size.width * 0.50, y: size.height * 0.52)
        var wing = Path()
        wing.move(to: CGPoint(x: size.width * 0.13, y: center.y))
        wing.addCurve(
            to: CGPoint(x: size.width * 0.87, y: center.y),
            control1: CGPoint(x: size.width * 0.34, y: center.y - size.height * 0.20),
            control2: CGPoint(x: size.width * 0.67, y: center.y + sin(phase) * 18 - size.height * 0.12)
        )
        wing.addCurve(
            to: CGPoint(x: size.width * 0.13, y: center.y),
            control1: CGPoint(x: size.width * 0.68, y: center.y + size.height * 0.11),
            control2: CGPoint(x: size.width * 0.32, y: center.y + size.height * 0.08)
        )
        context.fill(wing, with: .linearGradient(
            Gradient(colors: [Lab.blueprint.opacity(0.16), Lab.brass.opacity(0.34)]),
            startPoint: CGPoint(x: 0, y: center.y),
            endPoint: CGPoint(x: size.width, y: center.y)
        ))
        context.stroke(wing, with: .color(Lab.blueprint), lineWidth: 2)
        for index in 0..<9 {
            let x = size.width * (0.12 + Double(index) * 0.095)
            var flow = Path()
            flow.move(to: CGPoint(x: x, y: size.height * 0.20))
            flow.addCurve(
                to: CGPoint(x: x + cos(phase + Double(index)) * 15, y: size.height * 0.82),
                control1: CGPoint(x: x - 18, y: size.height * 0.40),
                control2: CGPoint(x: x + 18, y: size.height * 0.62)
            )
            context.stroke(flow, with: .color(Lab.emerald.opacity(0.25 + normalizedControl * 0.35)), lineWidth: 1.2)
        }
    }

    private func drawElectromagnetics(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        for ring in 0..<10 {
            let radius = min(size.width, size.height) * (0.08 + Double(ring) * 0.035)
            let rect = CGRect(x: center.x - radius, y: center.y - radius * 0.62, width: radius * 2, height: radius * 1.24)
            context.stroke(Path(ellipseIn: rect), with: .color((ring.isMultiple(of: 2) ? Lab.brass : Lab.blueprint).opacity(0.30 + normalizedControl * 0.40)), lineWidth: 1.4)
        }
        let angle = phase.truncatingRemainder(dividingBy: .pi * 2)
        let point = CGPoint(
            x: center.x + CGFloat(cos(angle)) * size.width * 0.34,
            y: center.y + CGFloat(sin(angle)) * size.height * 0.26
        )
        context.fill(Path(ellipseIn: CGRect(x: point.x - 6, y: point.y - 6, width: 12, height: 12)), with: .color(Lab.emerald))
    }

    private func drawSignal(context: inout GraphicsContext, size: CGSize, phase: Double) {
        for channel in 0..<4 {
            var wave = Path()
            let baseline = size.height * (0.23 + Double(channel) * 0.18)
            for x in stride(from: 0.0, through: size.width, by: 3) {
                let y = baseline + sin(x / size.width * .pi * (4 + Double(channel)) + phase * (1 + Double(channel) * 0.12)) * size.height * (0.035 + normalizedControl * 0.035)
                if x == 0 { wave.move(to: CGPoint(x: x, y: y)) } else { wave.addLine(to: CGPoint(x: x, y: y)) }
            }
            context.stroke(wave, with: .color([Lab.brass, Lab.blueprint, Lab.emerald, Lab.parchment][channel].opacity(0.82)), lineWidth: 2)
        }
    }

    private func drawComputation(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let count = 18
        let center = CGPoint(x: size.width / 2, y: size.height / 2)
        var points: [CGPoint] = []
        for index in 0..<count {
            let angle = Double(index) / Double(count) * .pi * 2 + seed
            let radius = min(size.width, size.height) * (0.18 + Double(index % 4) * 0.045)
            points.append(CGPoint(x: center.x + cos(angle) * radius, y: center.y + sin(angle) * radius))
        }
        for index in points.indices {
            var edge = Path(); edge.move(to: points[index]); edge.addLine(to: points[(index * 7 + 3) % count])
            context.stroke(edge, with: .color(Lab.blueprint.opacity(0.12 + normalizedControl * 0.18)), lineWidth: 0.8)
        }
        for (index, point) in points.enumerated() {
            let pulse = 4 + (sin(phase * 2 + Double(index)) + 1) * 2.5
            context.fill(Path(ellipseIn: CGRect(x: point.x - pulse, y: point.y - pulse, width: pulse * 2, height: pulse * 2)), with: .color(index.isMultiple(of: 3) ? Lab.brass : Lab.emerald))
        }
    }

    private func drawMaterial(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let cols = 12, rows = 8
        let dx = size.width / Double(cols + 1), dy = size.height / Double(rows + 1)
        for row in 0..<rows {
            for col in 0..<cols {
                let wobble = sin(phase + Double(row * cols + col) * 0.37) * (2 + normalizedControl * 8)
                let point = CGPoint(x: Double(col + 1) * dx + wobble, y: Double(row + 1) * dy)
                if col + 1 < cols {
                    let next = CGPoint(x: Double(col + 2) * dx, y: Double(row + 1) * dy)
                    var bond = Path(); bond.move(to: point); bond.addLine(to: next)
                    context.stroke(bond, with: .color(Lab.blueprint.opacity(0.25)), lineWidth: 1)
                }
                context.fill(Path(ellipseIn: CGRect(x: point.x - 4, y: point.y - 4, width: 8, height: 8)), with: .color((row + col).isMultiple(of: 3) ? Lab.brass : Lab.emerald))
            }
        }
    }

    private func drawOptics(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let source = CGPoint(x: size.width * 0.10, y: size.height * 0.50)
        let lensX = size.width * 0.48
        for index in 0..<13 {
            let startY = size.height * (0.20 + Double(index) * 0.05)
            let focusY = size.height * 0.50 + sin(phase) * 15 * normalizedControl
            var ray = Path(); ray.move(to: CGPoint(x: source.x, y: startY)); ray.addLine(to: CGPoint(x: lensX, y: startY)); ray.addLine(to: CGPoint(x: size.width * 0.90, y: focusY))
            context.stroke(ray, with: .color([Lab.brass, Lab.blueprint, Lab.emerald][index % 3].opacity(0.46)), lineWidth: 1)
        }
        var lens = Path(); lens.move(to: CGPoint(x: lensX, y: size.height * 0.14)); lens.addQuadCurve(to: CGPoint(x: lensX, y: size.height * 0.86), control: CGPoint(x: lensX + 36, y: size.height * 0.50)); lens.addQuadCurve(to: CGPoint(x: lensX, y: size.height * 0.14), control: CGPoint(x: lensX - 36, y: size.height * 0.50))
        context.fill(lens, with: .color(Lab.blueprint.opacity(0.15))); context.stroke(lens, with: .color(Lab.blueprint), lineWidth: 2)
    }

    private func drawMachine(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let centers = [CGPoint(x: size.width * 0.34, y: size.height * 0.52), CGPoint(x: size.width * 0.64, y: size.height * 0.50)]
        for (gearIndex, center) in centers.enumerated() {
            let teeth = 18 + gearIndex * 6
            let radius = min(size.width, size.height) * (gearIndex == 0 ? 0.18 : 0.24)
            var gear = Path()
            for index in 0...teeth {
                let angle = Double(index) / Double(teeth) * .pi * 2 + phase * (gearIndex == 0 ? 1 : -0.74)
                let toothRadius = radius * (index.isMultiple(of: 2) ? 1.08 : 0.93)
                let point = CGPoint(
                    x: center.x + CGFloat(cos(angle)) * toothRadius,
                    y: center.y + CGFloat(sin(angle)) * toothRadius
                )
                if index == 0 { gear.move(to: point) } else { gear.addLine(to: point) }
            }
            context.stroke(gear, with: .color(gearIndex == 0 ? Lab.brass : Lab.blueprint), lineWidth: 2.2)
            context.fill(Path(ellipseIn: CGRect(x: center.x - 8, y: center.y - 8, width: 16, height: 16)), with: .color(Lab.emerald))
        }
    }

    /// Source-faithful orthographic reduction of the website's Arkwright
    /// vector exhibit. The four differential drafting pairs, weighted
    /// saddles, flyer, traversing bobbin, drive drum, belt, and heart-cam are
    /// all driven by the same authored controls exposed below the canvas.
    private func drawArkwrightWaterFrame(
        context: inout GraphicsContext,
        size: CGSize,
        time: TimeInterval
    ) {
        let width = size.width
        let height = size.height
        let rpm = max(1, values["waterWheelRpm"] ?? 32)
        let draftRatio = max(1, values["totalDraftRatio"] ?? 4.2)
        let clampWeight = max(0.5, values["rollerClampingWeightKg"] ?? 4.5)
        let drivePhase = time * rpm / 60 * 2 * Double.pi
        let deliveryPhase = drivePhase * draftRatio
        let flyerPhase = deliveryPhase * 2.4
        let traversePhase = drivePhase * 0.36
        let traverseOffset = CGFloat(sin(traversePhase)) * height * 0.045

        let frameRect = CGRect(x: width * 0.07, y: height * 0.08, width: width * 0.86, height: height * 0.82)
        let oak = Color(red: 0.46, green: 0.27, blue: 0.12)
        let darkOak = Color(red: 0.25, green: 0.13, blue: 0.06)
        let steel = Color(red: 0.61, green: 0.69, blue: 0.76)
        let leather = Color(red: 0.68, green: 0.48, blue: 0.31)
        let yarn = Color(red: 0.99, green: 0.90, blue: 0.42)

        for beam in [
            CGRect(x: frameRect.minX, y: frameRect.minY, width: width * 0.035, height: frameRect.height),
            CGRect(x: frameRect.maxX - width * 0.035, y: frameRect.minY, width: width * 0.035, height: frameRect.height),
            CGRect(x: frameRect.minX, y: frameRect.minY, width: frameRect.width, height: height * 0.038),
            CGRect(x: frameRect.minX, y: frameRect.maxY - height * 0.045, width: frameRect.width, height: height * 0.045),
            CGRect(x: frameRect.minX, y: height * 0.34, width: frameRect.width, height: height * 0.028),
            CGRect(x: frameRect.minX, y: height * 0.70, width: frameRect.width, height: height * 0.026),
        ] {
            context.fill(Path(roundedRect: beam, cornerRadius: 3), with: .color(oak))
            context.stroke(Path(roundedRect: beam, cornerRadius: 3), with: .color(Lab.brass.opacity(0.24)), lineWidth: 1)
        }

        let creel = CGRect(x: width * 0.25, y: height * 0.15, width: width * 0.065, height: height * 0.09)
        context.fill(Path(roundedRect: creel, cornerRadius: 4), with: .color(Lab.brass.opacity(0.82)))
        var creelAxle = Path()
        creelAxle.move(to: CGPoint(x: creel.midX, y: creel.minY - 8))
        creelAxle.addLine(to: CGPoint(x: creel.midX, y: creel.maxY + 8))
        context.stroke(creelAxle, with: .color(steel), lineWidth: 2)

        let rollerCenterY = height * 0.34
        let rollerXs = [0.22, 0.31, 0.40, 0.49].map { width * $0 }
        for (index, x) in rollerXs.enumerated() {
            let phase = index == 3 ? deliveryPhase : drivePhase * (0.55 + Double(index) * 0.28)
            let radius = min(width, height) * 0.027
            let upper = CGPoint(x: x, y: rollerCenterY - radius * 0.92)
            let lower = CGPoint(x: x, y: rollerCenterY + radius * 0.92)
            for (center, color, direction) in [(upper, leather, -1.0), (lower, Lab.brass, 1.0)] {
                context.fill(
                    Path(ellipseIn: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)),
                    with: .color(color)
                )
                context.stroke(
                    Path(ellipseIn: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2)),
                    with: .color(Lab.parchment.opacity(0.34)),
                    lineWidth: 1
                )
                var spoke = Path()
                spoke.move(to: center)
                spoke.addLine(to: CGPoint(
                    x: center.x + CGFloat(cos(phase * direction)) * radius,
                    y: center.y + CGFloat(sin(phase * direction)) * radius
                ))
                context.stroke(spoke, with: .color(darkOak), lineWidth: 1.5)
            }
            if index == 0 || index == 3 {
                let weightDrop = height * (0.085 + min(0.035, clampWeight / 180))
                var saddle = Path()
                saddle.move(to: upper)
                saddle.addLine(to: CGPoint(x: x, y: upper.y + weightDrop))
                context.stroke(saddle, with: .color(steel.opacity(0.75)), lineWidth: 2)
                let weight = CGRect(x: x - 6, y: upper.y + weightDrop, width: 12, height: 18)
                context.fill(Path(roundedRect: weight, cornerRadius: 2), with: .color(Color(red: 0.18, green: 0.22, blue: 0.28)))
            }
        }

        var roving = Path()
        roving.move(to: CGPoint(x: creel.midX, y: creel.maxY))
        roving.addLine(to: CGPoint(x: rollerXs[0], y: rollerCenterY))
        for x in rollerXs.dropFirst() { roving.addLine(to: CGPoint(x: x, y: rollerCenterY)) }
        context.stroke(roving, with: .color(yarn.opacity(0.90)), style: StrokeStyle(lineWidth: max(2, 7 / draftRatio), lineCap: .round))

        let spindleX = width * 0.51
        let spindleTop = height * 0.45
        let spindleBottom = height * 0.79
        var spindle = Path()
        spindle.move(to: CGPoint(x: spindleX, y: spindleTop))
        spindle.addLine(to: CGPoint(x: spindleX, y: spindleBottom))
        context.stroke(spindle, with: .color(steel), lineWidth: 3)
        let flyerHalfWidth = width * 0.07
        let flyerY = height * 0.56
        let flyerSwing = CGFloat(cos(flyerPhase)) * flyerHalfWidth
        var flyer = Path()
        flyer.move(to: CGPoint(x: spindleX, y: spindleTop + 8))
        flyer.addLine(to: CGPoint(x: spindleX + flyerSwing, y: flyerY))
        flyer.addLine(to: CGPoint(x: spindleX - flyerSwing, y: flyerY + height * 0.10))
        context.stroke(flyer, with: .color(steel), style: StrokeStyle(lineWidth: 3, lineCap: .round, lineJoin: .round))

        let bobbin = CGRect(
            x: spindleX - width * 0.035,
            y: height * 0.58 + traverseOffset,
            width: width * 0.07,
            height: height * 0.13
        )
        context.fill(Path(roundedRect: bobbin, cornerRadius: 4), with: .color(darkOak))
        context.fill(Path(roundedRect: bobbin.insetBy(dx: 4, dy: 5), cornerRadius: 3), with: .color(Lab.brass.opacity(0.90)))

        let drumCenter = CGPoint(x: width * 0.74, y: height * 0.77)
        let drumRadius = min(width, height) * 0.095
        context.fill(Path(ellipseIn: CGRect(x: drumCenter.x - drumRadius, y: drumCenter.y - drumRadius, width: drumRadius * 2, height: drumRadius * 2)), with: .color(darkOak))
        context.stroke(Path(ellipseIn: CGRect(x: drumCenter.x - drumRadius, y: drumCenter.y - drumRadius, width: drumRadius * 2, height: drumRadius * 2)), with: .color(Lab.brass), lineWidth: 2)
        var drumSpoke = Path()
        drumSpoke.move(to: drumCenter)
        drumSpoke.addLine(to: CGPoint(x: drumCenter.x + CGFloat(cos(drivePhase)) * drumRadius, y: drumCenter.y + CGFloat(sin(drivePhase)) * drumRadius))
        context.stroke(drumSpoke, with: .color(Lab.brass), lineWidth: 2)

        let whorl = CGPoint(x: spindleX, y: spindleBottom)
        for offset in [-1.0, 1.0] {
            var belt = Path()
            belt.move(to: CGPoint(x: whorl.x, y: whorl.y + CGFloat(offset) * 4))
            belt.addLine(to: CGPoint(x: drumCenter.x, y: drumCenter.y + CGFloat(offset) * drumRadius * 0.68))
            context.stroke(belt, with: .color(leather.opacity(0.78)), lineWidth: 2)
        }

        let camCenter = CGPoint(x: width * 0.74, y: height * 0.50)
        var cam = Path()
        for index in 0...40 {
            let angle = Double(index) / 40 * 2 * Double.pi + traversePhase
            let radius = min(width, height) * (0.035 + 0.020 * (1 - sin(angle)))
            let point = CGPoint(x: camCenter.x + CGFloat(cos(angle)) * radius, y: camCenter.y + CGFloat(sin(angle)) * radius)
            if index == 0 { cam.move(to: point) } else { cam.addLine(to: point) }
        }
        cam.closeSubpath()
        context.fill(cam, with: .color(Lab.brass.opacity(0.34)))
        context.stroke(cam, with: .color(Lab.brass), lineWidth: 2)
        var follower = Path()
        follower.move(to: CGPoint(x: camCenter.x, y: camCenter.y + height * 0.055))
        follower.addLine(to: CGPoint(x: spindleX + width * 0.07, y: bobbin.maxY))
        context.stroke(follower, with: .color(steel.opacity(0.75)), lineWidth: 2)

        var yarnPath = Path()
        yarnPath.move(to: CGPoint(x: rollerXs[3], y: rollerCenterY))
        yarnPath.addCurve(
            to: CGPoint(x: bobbin.midX, y: bobbin.midY),
            control1: CGPoint(x: width * 0.53, y: height * 0.39),
            control2: CGPoint(x: spindleX + flyerSwing, y: flyerY)
        )
        context.stroke(yarnPath, with: .color(yarn), style: StrokeStyle(lineWidth: 2, lineCap: .round))

        // Put source letters in stable museum-label lanes rather than directly
        // on top of moving parts. The old D/E/F positions could overlap into
        // an unreadable single word on compact iPhone layouts.
        let labels: [(String, CGPoint)] = [
            ("C · FOUR DRAFT PAIRS", CGPoint(x: width * 0.35, y: height * 0.255)),
            ("D · WEIGHTED SADDLES", CGPoint(x: width * 0.20, y: height * 0.43)),
            ("E · FLYER", CGPoint(x: width * 0.60, y: height * 0.43)),
            ("F · TRAVERSING BOBBIN", CGPoint(x: width * 0.46, y: height * 0.735)),
            ("G · HEART CAM", CGPoint(x: width * 0.76, y: height * 0.385)),
            ("A · DRIVE DRUM", CGPoint(x: width * 0.76, y: height * 0.89)),
        ]
        for (label, point) in labels {
            let labelWidth = min(width * 0.25, CGFloat(label.count) * 4.8 + 10)
            let labelBackground = CGRect(
                x: point.x - labelWidth / 2,
                y: point.y - 7,
                width: labelWidth,
                height: 14
            )
            context.fill(
                Path(roundedRect: labelBackground, cornerRadius: 7),
                with: .color(Color.black.opacity(0.64))
            )
            context.draw(
                Text(label)
                    .font(.system(size: 7.5, weight: .black, design: .rounded))
                    .foregroundColor(Lab.parchment.opacity(0.92)),
                at: point,
                anchor: .center
            )
        }
    }

    /// Source-faithful orthographic reduction of Watt's Fig. 1. The moving
    /// beam, piston, condenser path, and air pump follow the authored machine
    /// rather than the catalogue-wide decorative fallback.
    private func drawWattCondenser(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let width = size.width
        let height = size.height
        let piston = sin(phase)
        let beamAngle = piston * 0.08
        let separate = (values["hasSeparateCondenser"] ?? 1) > 0.5
        let pressure = values["boilerPressurePsi"] ?? 3
        let condenserTemperature = values["condenserTempC"] ?? 35
        let pressureMix = min(1, max(0, (pressure - 0.5) / 9.5))
        let coldMix = min(1, max(0, (60 - condenserTemperature) / 50))

        let wall = CGRect(x: width * 0.47, y: height * 0.17, width: width * 0.08, height: height * 0.68)
        context.fill(Path(wall), with: .color(Color(red: 0.16, green: 0.14, blue: 0.12)))
        context.stroke(Path(wall), with: .color(Lab.secondary.opacity(0.35)), lineWidth: 1)

        let fulcrum = CGPoint(x: width * 0.51, y: height * 0.24)
        let halfBeam = width * 0.36
        let dx = CGFloat(cos(beamAngle)) * halfBeam
        let dy = CGFloat(sin(beamAngle)) * halfBeam
        var beam = Path()
        beam.move(to: CGPoint(x: fulcrum.x - dx, y: fulcrum.y + dy))
        beam.addLine(to: CGPoint(x: fulcrum.x + dx, y: fulcrum.y - dy))
        context.stroke(beam, with: .color(Color(red: 0.58, green: 0.30, blue: 0.10)), lineWidth: max(10, height * 0.034))
        context.stroke(beam, with: .color(Lab.brass.opacity(0.65)), lineWidth: 2)
        context.fill(Path(ellipseIn: CGRect(x: fulcrum.x - 9, y: fulcrum.y - 9, width: 18, height: 18)), with: .color(Lab.parchment))

        let cylinder = CGRect(x: width * 0.19, y: height * 0.42, width: width * 0.17, height: height * 0.31)
        context.fill(Path(roundedRect: cylinder, cornerRadius: 5), with: .color(separate ? Lab.brass.opacity(0.20) : Lab.secondary.opacity(0.18)))
        context.stroke(Path(roundedRect: cylinder, cornerRadius: 5), with: .color(separate ? Lab.brass : Lab.secondary), lineWidth: 2)
        let pistonY = cylinder.midY + CGFloat(piston) * cylinder.height * 0.28
        var pistonRod = Path()
        pistonRod.move(to: CGPoint(x: cylinder.midX, y: fulcrum.y + dy))
        pistonRod.addLine(to: CGPoint(x: cylinder.midX, y: pistonY))
        context.stroke(pistonRod, with: .color(Lab.parchment.opacity(0.80)), lineWidth: 4)
        context.fill(Path(CGRect(x: cylinder.minX + 8, y: pistonY - 5, width: cylinder.width - 16, height: 10)), with: .color(Lab.parchment.opacity(0.70)))

        let boiler = CGRect(x: width * 0.07, y: height * 0.72, width: width * 0.23, height: height * 0.16)
        context.fill(Path(roundedRect: boiler, cornerRadius: boiler.height * 0.42), with: .color(Lab.brass.opacity(0.28 + pressureMix * 0.28)))
        context.stroke(Path(roundedRect: boiler, cornerRadius: boiler.height * 0.42), with: .color(Lab.brass), lineWidth: 2)
        for index in 0..<5 {
            let flicker = CGFloat((sin(phase * 5 + Double(index)) + 1) * 0.5)
            let flame = CGRect(
                x: boiler.minX + 16 + CGFloat(index) * (boiler.width - 34) / 4,
                y: boiler.maxY - 10 - flicker * 8,
                width: 7,
                height: 10 + flicker * 11
            )
            context.fill(Path(ellipseIn: flame), with: .color(index.isMultiple(of: 2) ? Lab.brass : Lab.danger))
        }

        var steamPipe = Path()
        steamPipe.move(to: CGPoint(x: boiler.midX, y: boiler.minY))
        steamPipe.addLine(to: CGPoint(x: boiler.midX, y: cylinder.maxY + 10))
        steamPipe.addLine(to: CGPoint(x: cylinder.minX, y: cylinder.maxY + 10))
        context.stroke(steamPipe, with: .color(Lab.brass.opacity(0.78)), lineWidth: 4)

        let condenser = CGRect(x: width * 0.64, y: height * 0.57, width: width * 0.16, height: height * 0.25)
        context.fill(Path(roundedRect: condenser, cornerRadius: 9), with: .color(separate ? Lab.blueprint.opacity(0.16 + coldMix * 0.26) : Lab.danger.opacity(0.12)))
        context.stroke(Path(roundedRect: condenser, cornerRadius: 9), with: .color(separate ? Lab.blueprint : Lab.danger), lineWidth: 2)

        var exhaust = Path()
        exhaust.move(to: CGPoint(x: cylinder.maxX, y: cylinder.maxY - 12))
        exhaust.addCurve(
            to: CGPoint(x: condenser.minX, y: condenser.minY + 22),
            control1: CGPoint(x: width * 0.45, y: height * 0.72),
            control2: CGPoint(x: width * 0.57, y: height * 0.50)
        )
        context.stroke(exhaust, with: .color(separate ? Lab.blueprint : Lab.danger), style: StrokeStyle(lineWidth: 5, lineCap: .round))

        let pumpX = width * 0.87
        let pumpTop = fulcrum.y - dy
        let pumpY = height * 0.66 - CGFloat(piston) * height * 0.045
        var pumpRod = Path()
        pumpRod.move(to: CGPoint(x: pumpX, y: pumpTop))
        pumpRod.addLine(to: CGPoint(x: pumpX, y: pumpY))
        context.stroke(pumpRod, with: .color(Lab.parchment.opacity(0.75)), lineWidth: 4)
        let pump = CGRect(x: pumpX - width * 0.045, y: height * 0.57, width: width * 0.09, height: height * 0.23)
        context.stroke(Path(roundedRect: pump, cornerRadius: 5), with: .color(Lab.emerald), lineWidth: 2)
        context.fill(Path(CGRect(x: pump.minX + 5, y: pumpY - 4, width: pump.width - 10, height: 8)), with: .color(Lab.emerald.opacity(0.75)))

        for index in 0..<10 {
            let progress = CGFloat((Double(index) / 10 + phase / (.pi * 2)).truncatingRemainder(dividingBy: 1))
            let start = CGPoint(x: cylinder.maxX, y: cylinder.maxY - 12)
            let end = CGPoint(x: condenser.minX, y: condenser.minY + 22)
            let point = CGPoint(x: start.x + (end.x - start.x) * progress, y: start.y + (end.y - start.y) * progress)
            context.fill(Path(ellipseIn: CGRect(x: point.x - 3, y: point.y - 3, width: 6, height: 6)), with: .color(separate ? Lab.blueprint.opacity(0.85) : Lab.danger.opacity(0.75)))
        }

        let labels: [(String, CGPoint, Color)] = [
            ("A · BOILER", CGPoint(x: boiler.minX, y: boiler.minY - 10), Lab.brass),
            ("B/C · HOT CYLINDER", CGPoint(x: cylinder.minX, y: cylinder.minY - 10), Lab.brass),
            (separate ? "E · SEPARATE CONDENSER" : "IN-CYLINDER QUENCH", CGPoint(x: condenser.midX, y: condenser.maxY + 10), separate ? Lab.blueprint : Lab.danger),
            ("G · AIR PUMP", CGPoint(x: pump.midX, y: pump.maxY + 10), Lab.emerald),
        ]
        for (copy, point, color) in labels {
            context.draw(
                Text(copy).font(.system(size: 8, weight: .black, design: .rounded)).foregroundColor(color),
                at: point,
                anchor: copy.hasPrefix("E") || copy.hasPrefix("IN-") || copy.hasPrefix("G") ? .top : .bottomLeading
            )
        }
    }

    /// Native translation of the website's source-bound Tesla Fig. 9 kernel:
    /// four poles, two independent phase contributions, and their resultant
    /// moving region of attraction. This is not a later induction-motor model.
    private func drawTeslaMotorFig9(
        context: inout GraphicsContext,
        size: CGSize,
        time: TimeInterval
    ) {
        let frequency = max(1, values["frequency"] ?? 60)
        let angle = time * (2 * Double.pi * frequency / 20)
        let center = CGPoint(x: size.width * 0.50, y: size.height * 0.50)
        let scale = min(size.width, size.height)
        let outerRadius = scale * 0.34
        let innerRadius = scale * 0.24

        context.fill(
            Path(ellipseIn: CGRect(
                x: center.x - outerRadius,
                y: center.y - outerRadius,
                width: outerRadius * 2,
                height: outerRadius * 2
            )),
            with: .color(Color(red: 0.045, green: 0.075, blue: 0.13))
        )
        context.stroke(
            Path(ellipseIn: CGRect(
                x: center.x - outerRadius,
                y: center.y - outerRadius,
                width: outerRadius * 2,
                height: outerRadius * 2
            )),
            with: .color(Lab.secondary.opacity(0.70)),
            lineWidth: 3
        )
        context.stroke(
            Path(ellipseIn: CGRect(
                x: center.x - innerRadius,
                y: center.y - innerRadius,
                width: innerRadius * 2,
                height: innerRadius * 2
            )),
            with: .color(Lab.blueprint.opacity(0.45)),
            style: StrokeStyle(lineWidth: 1.5, dash: [7, 5])
        )

        var fieldX = 0.0
        var fieldY = 0.0
        let poleLabels = ["C", "C′", "C", "C′"]
        for index in 0..<4 {
            let seatAngle = Double(index) * 2 * Double.pi / 4 - Double.pi / 2
            let phaseOffset = Double(index % 2) * Double.pi / 2
            let polarity = index >= 2 ? -1.0 : 1.0
            let current = polarity * sin(angle + phaseOffset)
            fieldX += current * cos(seatAngle)
            fieldY += current * sin(seatAngle)
            let seat = CGPoint(
                x: center.x + CGFloat(cos(seatAngle)) * outerRadius * 0.92,
                y: center.y + CGFloat(sin(seatAngle)) * outerRadius * 0.92
            )
            let radius = scale * 0.047
            context.fill(
                Path(roundedRect: CGRect(
                    x: seat.x - radius,
                    y: seat.y - radius,
                    width: radius * 2,
                    height: radius * 2
                ), cornerRadius: 5),
                with: .color(current >= 0 ? Lab.brass : Lab.blueprint)
            )
            context.draw(
                Text(poleLabels[index])
                    .font(.system(size: max(8, scale * 0.024), weight: .black, design: .rounded))
                    .foregroundColor(.white),
                at: seat,
                anchor: .center
            )
        }

        let contribution = outerRadius * 0.48
        strokeVector(
            context: &context,
            from: center,
            to: CGPoint(x: center.x + cos(angle) * contribution, y: center.y),
            color: Lab.brass.opacity(0.72),
            width: 2
        )
        strokeVector(
            context: &context,
            from: center,
            to: CGPoint(x: center.x, y: center.y + sin(angle) * contribution),
            color: Lab.blueprint.opacity(0.78),
            width: 2
        )

        let magnitude = max(0.000_001, hypot(fieldX, fieldY))
        let resultant = CGPoint(
            x: center.x + fieldX / magnitude * outerRadius * 0.58,
            y: center.y + fieldY / magnitude * outerRadius * 0.58
        )
        strokeVector(context: &context, from: center, to: resultant, color: Lab.brass, width: 4)
        context.fill(
            Path(ellipseIn: CGRect(x: resultant.x - 6, y: resultant.y - 6, width: 12, height: 12)),
            with: .color(Lab.brass)
        )

        let rotorRadius = innerRadius * 0.58
        context.fill(
            Path(ellipseIn: CGRect(
                x: center.x - rotorRadius,
                y: center.y - rotorRadius,
                width: rotorRadius * 2,
                height: rotorRadius * 2
            )),
            with: .radialGradient(
                Gradient(colors: [Color.gray.opacity(0.86), Color(red: 0.15, green: 0.19, blue: 0.25)]),
                center: center,
                startRadius: 2,
                endRadius: rotorRadius
            )
        )
        context.stroke(
            Path(ellipseIn: CGRect(
                x: center.x - rotorRadius,
                y: center.y - rotorRadius,
                width: rotorRadius * 2,
                height: rotorRadius * 2
            )),
            with: .color(Lab.parchment.opacity(0.52)),
            lineWidth: 2
        )
        strokeVector(
            context: &context,
            from: center,
            to: CGPoint(
                x: center.x + CGFloat(cos(angle)) * rotorRadius * 0.82,
                y: center.y + CGFloat(sin(angle)) * rotorRadius * 0.82
            ),
            color: Lab.emerald,
            width: 3
        )
        context.draw(
            Text("FIG. 9 · 2 CIRCUITS · \(Int(frequency.rounded())) Hz")
                .font(.system(size: 9, weight: .bold, design: .monospaced))
                .foregroundColor(Lab.secondary),
            at: CGPoint(x: center.x, y: size.height - 20),
            anchor: .bottom
        )
    }

    /// Native translation of the source Wozniak timing kernel. The display
    /// clock is deliberately slowed to four visible phase changes per second;
    /// the labels retain the derived 6502 and NTSC frequencies.
    private func drawWozniakBus(
        context: inout GraphicsContext,
        size: CGSize,
        time: TimeInterval
    ) {
        let crystal = values["crystalFreq"] ?? 14.318
        let ramCapacity = Int((values["ramCapacityKb"] ?? 48).rounded())
        let cpuMHz = crystal / 14
        let tick = max(0, Int(floor(time * 4)))
        let videoPhase = tick % 2 == 1
        let rasterLine = ((tick + 1) / 2) % 192
        let address = 0x0400 + ((tick * 0x31) % 0x0400)
        let leftX = size.width * 0.08
        let blockWidth = size.width * 0.22
        let blockHeight = size.height * 0.21
        let cpuRect = CGRect(x: leftX, y: size.height * 0.18, width: blockWidth, height: blockHeight)
        let videoRect = CGRect(x: leftX, y: size.height * 0.60, width: blockWidth, height: blockHeight)
        let muxRect = CGRect(x: size.width * 0.42, y: size.height * 0.37, width: size.width * 0.18, height: size.height * 0.26)
        let ramRect = CGRect(x: size.width * 0.72, y: size.height * 0.28, width: size.width * 0.21, height: size.height * 0.44)

        drawBusBlock(
            context: &context,
            rect: cpuRect,
            title: "MOS 6502",
            detail: String(format: "%.3f MHz", cpuMHz),
            state: videoPhase ? "WAITING" : "BUS MASTER",
            color: videoPhase ? Lab.secondary : Lab.emerald
        )
        drawBusBlock(
            context: &context,
            rect: videoRect,
            title: "VIDEO LOGIC",
            detail: "LINE \(rasterLine)",
            state: videoPhase ? "BUS MASTER" : "IDLE",
            color: videoPhase ? Lab.blueprint : Lab.secondary
        )
        drawBusBlock(
            context: &context,
            rect: muxRect,
            title: "74LS157",
            detail: "2:1 MUX",
            state: videoPhase ? "Φ2 · VIDEO" : "Φ1 · CPU",
            color: Lab.brass
        )
        drawBusBlock(
            context: &context,
            rect: ramRect,
            title: "DRAM ARRAY",
            detail: String(format: "0x%04X", address),
            state: "\(ramCapacity) KB · AUTO REFRESH",
            color: Color(red: 0.58, green: 0.50, blue: 0.98)
        )

        strokeBus(
            context: &context,
            from: CGPoint(x: cpuRect.maxX, y: cpuRect.midY),
            to: CGPoint(x: muxRect.minX, y: muxRect.minY + muxRect.height * 0.34),
            active: !videoPhase,
            color: Lab.emerald
        )
        strokeBus(
            context: &context,
            from: CGPoint(x: videoRect.maxX, y: videoRect.midY),
            to: CGPoint(x: muxRect.minX, y: muxRect.minY + muxRect.height * 0.70),
            active: videoPhase,
            color: Lab.blueprint
        )
        strokeBus(
            context: &context,
            from: CGPoint(x: muxRect.maxX, y: muxRect.midY),
            to: CGPoint(x: ramRect.minX, y: ramRect.midY),
            active: true,
            color: Lab.brass
        )

        context.draw(
            Text(String(format: "MASTER %.3f MHz · NTSC %.3f MHz · WINDOW %.1f ns", crystal, crystal / 4, 500 / cpuMHz))
                .font(.system(size: 8.5, weight: .bold, design: .monospaced))
                .foregroundColor(Lab.secondary),
            at: CGPoint(x: size.width * 0.50, y: size.height - 16),
            anchor: .bottom
        )
    }

    private func drawBusBlock(
        context: inout GraphicsContext,
        rect: CGRect,
        title: String,
        detail: String,
        state: String,
        color: Color
    ) {
        context.fill(Path(roundedRect: rect, cornerRadius: 9), with: .color(color.opacity(0.13)))
        context.stroke(Path(roundedRect: rect, cornerRadius: 9), with: .color(color), lineWidth: 2)
        context.draw(
            Text(title).font(.system(size: 10, weight: .black, design: .monospaced)).foregroundColor(Lab.parchment),
            at: CGPoint(x: rect.midX, y: rect.minY + rect.height * 0.31),
            anchor: .center
        )
        context.draw(
            Text(detail).font(.system(size: 9, weight: .bold, design: .monospaced)).foregroundColor(color),
            at: CGPoint(x: rect.midX, y: rect.midY),
            anchor: .center
        )
        context.draw(
            Text(state).font(.system(size: 7.5, weight: .bold, design: .monospaced)).foregroundColor(Lab.secondary),
            at: CGPoint(x: rect.midX, y: rect.maxY - rect.height * 0.18),
            anchor: .center
        )
    }

    private func strokeBus(
        context: inout GraphicsContext,
        from start: CGPoint,
        to end: CGPoint,
        active: Bool,
        color: Color
    ) {
        var path = Path()
        path.move(to: start)
        path.addLine(to: end)
        context.stroke(
            path,
            with: .color(active ? color : Lab.secondary.opacity(0.30)),
            style: StrokeStyle(lineWidth: active ? 3 : 1.3, dash: active ? [] : [4, 4])
        )
    }

    private func strokeVector(
        context: inout GraphicsContext,
        from start: CGPoint,
        to end: CGPoint,
        color: Color,
        width: CGFloat
    ) {
        var path = Path()
        path.move(to: start)
        path.addLine(to: end)
        context.stroke(path, with: .color(color), style: StrokeStyle(lineWidth: width, lineCap: .round))
    }

    private func drawTelemetry(context: inout GraphicsContext, size: CGSize, phase: Double) {
        let label = Text(patent.shortTitle.uppercased())
            .font(.system(size: 11, weight: .bold, design: .rounded))
            .foregroundColor(Lab.parchment.opacity(0.80))
        context.draw(label, at: CGPoint(x: 16, y: 16), anchor: .topLeading)
        let phaseLabel = Text(String(format: "STATE %.3f  ·  DRIVE %.0f%%", phase.truncatingRemainder(dividingBy: 1), normalizedControl * 100))
            .font(.system(size: 9, weight: .semibold, design: .monospaced))
            .foregroundColor(Lab.secondary)
        context.draw(phaseLabel, at: CGPoint(x: size.width - 16, y: size.height - 14), anchor: .bottomTrailing)
    }
}
