import SwiftUI

enum PatentAssetLayout {
    static func fittedRect(for path: String, in size: CGSize, inset: CGFloat) -> CGRect {
        let bounds = CGRect(origin: .zero, size: size).insetBy(dx: inset, dy: inset)
        guard bounds.width > 0, bounds.height > 0,
              let imageAspect = PatentAssetImage.intrinsicAspectRatio(for: path),
              imageAspect.isFinite, imageAspect > 0 else { return bounds }

        let boundsAspect = bounds.width / bounds.height
        if boundsAspect > imageAspect {
            let width = bounds.height * imageAspect
            return CGRect(x: bounds.midX - width / 2, y: bounds.minY, width: width, height: bounds.height)
        }
        let height = bounds.width / imageAspect
        return CGRect(x: bounds.minX, y: bounds.midY - height / 2, width: bounds.width, height: height)
    }
}

/// One resolver owns the mapping between authored figure references and
/// bundled source plates. Keeping this logic shared prevents the figure atlas
/// and the live mechanism surface from silently choosing different drawings.
enum PatentFigureAssetResolver {
    static func markerText(for callout: DrawingCallout, fallbackIndex: Int? = nil) -> String {
        let element = callout.element.trimmingCharacters(in: .whitespacesAndNewlines)
        let label = callout.label.trimmingCharacters(in: .whitespacesAndNewlines)
        if !element.isEmpty, element.count <= 5 { return element }
        if !label.isEmpty, label.count <= 5 { return label }
        return fallbackIndex.map { String($0 + 1) } ?? "•"
    }

    static func displayTitle(for callout: DrawingCallout) -> String {
        let element = callout.element.trimmingCharacters(in: .whitespacesAndNewlines)
        let label = callout.label.trimmingCharacters(in: .whitespacesAndNewlines)
        if element == label { return label }
        if element.count <= 5, label.count > element.count { return label }
        if label.count <= 5, element.count > label.count { return element }
        if label.contains(where: \.isWhitespace) != element.contains(where: \.isWhitespace) {
            return label.contains(where: \.isWhitespace) ? label : element
        }
        return label.count >= element.count ? label : element
    }

    static func pngAssets(in patent: PatentRecord) -> [String] {
        patent.bundledAssets.filter { $0.lowercased().hasSuffix(".png") }
    }

    static func figureToken(in text: String) -> String? {
        let patterns = [
            #"(?i)\bfig(?:s|ures?)?\.?\s*(\d+(?:\.\d+)?[a-z]?)"#,
            #"(?i)\b(?:division|plate|view)\s*(\d+(?:\.\d+)?[a-z]?)"#,
            #"^\s*(\d+(?:\.\d+)?[a-z]?)\s*$"#,
        ]
        for pattern in patterns {
            guard let expression = try? NSRegularExpression(pattern: pattern),
                  let match = expression.firstMatch(
                      in: text,
                      range: NSRange(text.startIndex..., in: text)
                  ),
                  let range = Range(match.range(at: 1), in: text)
            else { continue }
            return text[range]
                .lowercased()
                .replacingOccurrences(of: ".", with: "-")
        }
        let lowered = text.lowercased()
        if lowered.contains("sole figure")
            || lowered.contains("sole diagrammatic drawing")
            || lowered.contains("source drawing") {
            return "1"
        }
        return nil
    }

    static func matchesFigure(_ path: String, token: String) -> Bool {
        let filename = URL(fileURLWithPath: path)
            .deletingPathExtension()
            .lastPathComponent
            .lowercased()
        let escapedToken = NSRegularExpression.escapedPattern(for: token)
        // Delimit both sides of the figure token. A plain substring test makes
        // Fig. 1 silently select fig-10/11/12 whenever those assets sort first.
        let pattern = "(?:^|[-_])(?:fig(?:s|ures?)?|plate|division|view)[-_]?\(escapedToken)(?:$|[-_])"
        return filename.range(of: pattern, options: .regularExpression) != nil
    }

    static func asset(for drawing: PatentDrawing, in patent: PatentRecord) -> String? {
        let assets = pngAssets(in: patent)
        guard let token = figureToken(in: drawing.figureNumber) else {
            let normalized = drawing.figureNumber.lowercased()
            if normalized.contains("unnumbered") || normalized.contains("drawing sheet") {
                return preferredAsset(
                    from: assets.filter {
                        let filename = URL(fileURLWithPath: $0).lastPathComponent.lowercased()
                        return filename.contains("drawing")
                    },
                    in: patent
                )
            }
            return nil
        }
        // A withheld reviewed crop is a provenance gate, not merely a missing
        // filename. Some archives retain an unversioned hard-link alias to the
        // superseded v1 crop; selecting that alias would bypass the editorial
        // decision and publish a figure known to require replacement.
        guard !hasWithheldReviewedCrop(token: token, in: patent) else { return nil }
        let exact = assets.filter { matchesFigure($0, token: token) }
        if let match = preferredAsset(from: exact, in: patent) { return match }

        // Authored subfigures such as Fig. 2.1 or Fig. 2A legitimately share
        // the parent Fig. 2 source crop when no reviewed subfigure crop exists.
        let base = token.prefix { $0.isNumber }
        guard !base.isEmpty, String(base) != token else { return nil }
        guard !hasWithheldReviewedCrop(token: String(base), in: patent) else { return nil }
        return preferredAsset(from: assets.filter { matchesFigure($0, token: String(base)) }, in: patent)
    }

    private static func hasWithheldReviewedCrop(token: String, in patent: PatentRecord) -> Bool {
        patent.withheldAssets.contains { matchesFigure($0, token: token) }
    }

    static func sourceSheetAssets(in patent: PatentRecord) -> [String] {
        pngAssets(in: patent).filter { path in
            let name = URL(fileURLWithPath: path).lastPathComponent.lowercased()
            return name.contains("source-sheet") || name.hasPrefix("sheet-") || name.hasPrefix("page-")
        }
    }

    private static func preferredAsset(from candidates: [String], in patent: PatentRecord) -> String? {
        let eligible = candidates.filter { !isSupersededByWithheldReview($0, in: patent) }
        guard !eligible.isEmpty else { return nil }
        // Prefer the reviewed source crop, then the newest explicit revision,
        // then non-preview derivatives. Lexical order is only the final stable
        // tie-breaker. Choosing v1 merely because it sorts before v5 silently
        // resurrects superseded archival crops.
        return eligible.sorted { left, right in
            let leftSourceCrop = left.lowercased().contains("source-crop")
            let rightSourceCrop = right.lowercased().contains("source-crop")
            if leftSourceCrop != rightSourceCrop { return leftSourceCrop }
            let leftVersion = versionNumber(in: left)
            let rightVersion = versionNumber(in: right)
            if leftVersion != rightVersion { return leftVersion > rightVersion }
            let leftPreview = left.lowercased().contains("preview")
            let rightPreview = right.lowercased().contains("preview")
            if leftPreview != rightPreview { return !leftPreview }
            return left < right
        }.first
    }

    private static func versionNumber(in path: String) -> Int {
        let filename = URL(fileURLWithPath: path).lastPathComponent
        guard let expression = try? NSRegularExpression(pattern: #"(?i)-v(\d+)(?:[-.]|$)"#),
              let match = expression.firstMatch(
                  in: filename,
                  range: NSRange(filename.startIndex..., in: filename)
              ),
              let range = Range(match.range(at: 1), in: filename)
        else { return 0 }
        return Int(filename[range]) ?? 0
    }

    private static func isSupersededByWithheldReview(_ path: String, in patent: PatentRecord) -> Bool {
        guard path.range(of: #"-v\d+\.png$"#, options: .regularExpression) != nil else { return false }
        let stem = path.replacingOccurrences(
            of: #"-v\d+(?=\.png$)"#,
            with: "-v#",
            options: .regularExpression
        )
        return patent.withheldAssets.contains { withheld in
            withheld.replacingOccurrences(
                of: #"-v\d+(?=\.png$)"#,
                with: "-v#",
                options: .regularExpression
            ) == stem
        }
    }

    /// Prefer the figure named by the physics lesson (for example Tesla's
    /// Fig. 9 apparatus), then the first authored drawing, then the first PNG.
    static func mechanismAsset(in patent: PatentRecord) -> String? {
        let assets = pngAssets(in: patent)
        if let title = patent.physics?.domainTitle,
           let token = figureToken(in: title),
           let match = preferredAsset(
               from: assets.filter { matchesFigure($0, token: token) },
               in: patent
           ) {
            return match
        }
        if let drawing = patent.drawings.first,
           let match = asset(for: drawing, in: patent) {
            return match
        }
        return sourceSheetAssets(in: patent).first ?? preferredAsset(from: assets, in: patent)
    }

    static func drawing(matching path: String, in patent: PatentRecord) -> PatentDrawing? {
        patent.drawings.first { drawing in
            guard let token = figureToken(in: drawing.figureNumber) else { return false }
            return matchesFigure(path, token: token)
        }
    }
}

/// Native spatial reader for reviewed patent plates. Canonical callout
/// coordinates stay attached to the drawing at every device size.
struct PatentFigureAtlasView: View {
    let patent: PatentRecord
    @State private var selectedDrawingID: String?
    @State private var selectedCalloutID: String?

    init(patent: PatentRecord) {
        self.patent = patent
#if DEBUG
        let arguments = ProcessInfo.processInfo.arguments
        if let marker = arguments.firstIndex(of: "-uiDrawing"),
           arguments.indices.contains(marker + 1),
           let requested = patent.drawings.first(where: {
               $0.figureNumber.caseInsensitiveCompare(arguments[marker + 1]) == .orderedSame
           }) {
            _selectedDrawingID = State(initialValue: requested.id)
            _selectedCalloutID = State(initialValue: requested.callouts.first?.id)
            return
        }
#endif
        _selectedDrawingID = State(initialValue: nil)
        _selectedCalloutID = State(initialValue: nil)
    }

    private var drawing: PatentDrawing? {
        patent.drawings.first(where: { $0.id == selectedDrawingID }) ?? patent.drawings.first
    }

    private var imagePath: String? {
        guard let drawing else { return PatentFigureAssetResolver.pngAssets(in: patent).first }
        return PatentFigureAssetResolver.asset(for: drawing, in: patent)
    }

    private var callout: DrawingCallout? {
        drawing?.callouts.first(where: { $0.id == selectedCalloutID }) ?? drawing?.callouts.first
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if patent.drawings.count > 1 { drawingPicker }
            if let drawing, let imagePath {
                ViewThatFits(in: .horizontal) {
                    HStack(alignment: .top, spacing: 14) {
                        annotatedPlate(path: imagePath, drawing: drawing).frame(maxWidth: .infinity)
                        calloutInspector(drawing: drawing).frame(width: 310)
                    }
                    VStack(alignment: .leading, spacing: 12) {
                        annotatedPlate(path: imagePath, drawing: drawing)
                        calloutInspector(drawing: drawing)
                    }
                }
            } else if let drawing {
                unmatchedPlate(drawing: drawing)
            } else {
                ContentUnavailableView(
                    "No reviewed figure plate",
                    systemImage: "ruler",
                    description: Text("The authored drawing descriptions and callouts remain below.")
                )
            }
        }
        .onAppear {
            selectedDrawingID = selectedDrawingID ?? patent.drawings.first?.id
            selectedCalloutID = selectedCalloutID ?? patent.drawings.first?.callouts.first?.id
        }
    }

    private func unmatchedPlate(drawing: PatentDrawing) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Reviewed crop unavailable", systemImage: "viewfinder.trianglebadge.exclamationmark")
                .font(.system(size: Lab.size(11), weight: .bold, design: .rounded))
                .foregroundStyle(Lab.brass)
            Text("The authored callouts are preserved below, but they are not overlaid on an unrelated figure. Complete bundled source sheets remain available for inspection.")
                .font(.system(size: Lab.size(11.5), design: .rounded))
                .foregroundStyle(Lab.secondary)
            let sheets = PatentFigureAssetResolver.sourceSheetAssets(in: patent)
            if !sheets.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    LazyHStack(alignment: .top, spacing: 12) {
                        ForEach(sheets, id: \.self) { path in
                            PatentAssetImage(path: path, alt: "Complete patent source sheet")
                                .aspectRatio(contentMode: .fit)
                                .frame(width: 360, height: 270)
                                .background(Color(red: 0.93, green: 0.91, blue: 0.84))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Lab.stroke))
                        }
                    }
                }
            }
            calloutInspector(drawing: drawing)
        }
        .padding(14)
        .background(Lab.panel, in: RoundedRectangle(cornerRadius: 15))
        .overlay(RoundedRectangle(cornerRadius: 15).stroke(Lab.stroke))
    }

    private var drawingPicker: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(patent.drawings) { candidate in
                    Button {
                        selectedDrawingID = candidate.id
                        selectedCalloutID = candidate.callouts.first?.id
                    } label: {
                        Text(candidate.figureNumber)
                            .font(.system(size: Lab.size(10), weight: .bold, design: .rounded))
                            .foregroundStyle(drawing?.id == candidate.id ? Lab.background : Lab.brass)
                            .padding(.horizontal, 12)
                            .frame(minHeight: 40)
                            .background(drawing?.id == candidate.id ? Lab.brass : Lab.brass.opacity(0.06), in: Capsule())
                            .overlay(Capsule().stroke(Lab.brass.opacity(0.35)))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private func annotatedPlate(path: String, drawing: PatentDrawing) -> some View {
        PatentAssetImage(path: path, alt: drawing.caption)
            .aspectRatio(PatentAssetImage.intrinsicAspectRatio(for: path) ?? (4 / 3), contentMode: .fit)
            .overlay {
                GeometryReader { proxy in
                    let imageRect = PatentAssetLayout.fittedRect(for: path, in: proxy.size, inset: 8)
                    ForEach(Array(drawing.callouts.enumerated()), id: \.element.id) { index, item in
                        Button {
                            withAnimation(.snappy(duration: 0.18)) { selectedCalloutID = item.id }
                        } label: {
                            Text(PatentFigureAssetResolver.markerText(for: item, fallbackIndex: index))
                                .font(.system(size: Lab.size(8.5), weight: .black, design: .rounded))
                                .foregroundStyle(selectedCalloutID == item.id ? Lab.background : Lab.parchment)
                                .frame(minWidth: 27, minHeight: 27)
                                .background(selectedCalloutID == item.id ? Lab.brass : Color.black.opacity(0.78), in: Circle())
                                .overlay(Circle().stroke(Lab.brass, lineWidth: selectedCalloutID == item.id ? 2 : 1))
                                .shadow(color: .black.opacity(0.45), radius: 4, y: 2)
                        }
                        .buttonStyle(.plain)
                        .position(
                            x: min(imageRect.maxX - 14, max(imageRect.minX + 14, imageRect.minX + imageRect.width * item.x / 100)),
                            y: min(imageRect.maxY - 14, max(imageRect.minY + 14, imageRect.minY + imageRect.height * item.y / 100))
                        )
                        .accessibilityLabel("\(PatentFigureAssetResolver.displayTitle(for: item)): \(item.description)")
                    }
                }
            }
            .overlay(alignment: .bottomLeading) {
                Text("\(drawing.figureNumber) · \(drawing.title)")
                    .font(.system(size: Lab.size(9.5), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.parchment)
                    .lineLimit(2)
                    .padding(9)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(.black.opacity(0.72))
            }
    }

    private func calloutInspector(drawing: PatentDrawing) -> some View {
        VStack(alignment: .leading, spacing: 11) {
            MuseumLabel(text: "Spatial callouts")
            if let callout {
                HStack(alignment: .top, spacing: 10) {
                    Text(PatentFigureAssetResolver.markerText(
                        for: callout,
                        fallbackIndex: drawing.callouts.firstIndex(where: { $0.id == callout.id })
                    ))
                        .font(.system(size: Lab.size(12), weight: .black, design: .rounded))
                        .foregroundStyle(Lab.background)
                        .frame(width: 34, height: 34)
                        .background(Lab.brass, in: Circle())
                        .lineLimit(1)
                        .minimumScaleFactor(0.55)
                    VStack(alignment: .leading, spacing: 5) {
                        Text(PatentFigureAssetResolver.displayTitle(for: callout))
                            .font(.system(size: Lab.size(14), weight: .bold, design: .serif))
                            .foregroundStyle(Lab.parchment)
                            .fixedSize(horizontal: false, vertical: true)
                        Text(NativeMathFormatter.displayInlineMath(in: callout.description))
                            .font(.system(size: Lab.size(11.5), design: .rounded))
                            .foregroundStyle(Lab.text)
                            .fixedSize(horizontal: false, vertical: true)
                            .textSelection(.enabled)
                    }
                }
            }
            Divider().overlay(Lab.stroke)
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 7) {
                    ForEach(Array(drawing.callouts.enumerated()), id: \.element.id) { index, item in
                        Button {
                            selectedCalloutID = item.id
                        } label: {
                            Text(PatentFigureAssetResolver.markerText(for: item, fallbackIndex: index)).lineLimit(1)
                        }
                            .font(.system(size: Lab.size(10), weight: .black, design: .rounded))
                            .buttonStyle(MuseumCapsuleButtonStyle(
                                tint: selectedCalloutID == item.id ? Lab.brass : Lab.blueprint,
                                filled: selectedCalloutID == item.id
                            ))
                            .accessibilityLabel("\(PatentFigureAssetResolver.displayTitle(for: item)): \(item.description)")
                    }
                }
            }
            Text(NativeMathFormatter.displayInlineMath(in: drawing.caption))
                .font(.system(size: Lab.size(10.5), design: .serif))
                .foregroundStyle(Lab.secondary)
                .fixedSize(horizontal: false, vertical: true)
                .textSelection(.enabled)
        }
        .padding(14)
        .background(Lab.panel, in: RoundedRectangle(cornerRadius: 15))
        .overlay(RoundedRectangle(cornerRadius: 15).stroke(Lab.stroke))
    }

}
