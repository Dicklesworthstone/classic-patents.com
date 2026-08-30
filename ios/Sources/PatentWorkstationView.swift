import SwiftUI

private enum WorkstationSection: String, CaseIterable, Identifiable {
    case story = "Story"
    case simulation = "Simulation"
    case equations = "Equations"
    case specification = "Specification"
    case claims = "Claims"
    case drawings = "Figures"
    case history = "History"
    case record = "Record"

    var id: String { rawValue }
    var symbol: String {
        switch self {
        case .story: "book.pages"
        case .simulation: "waveform.path.ecg.rectangle"
        case .equations: "function"
        case .specification: "text.book.closed"
        case .claims: "building.columns"
        case .drawings: "ruler"
        case .history: "timeline.selection"
        case .record: "checkmark.seal"
        }
    }
}

struct PatentWorkstationView: View {
    let patent: PatentRecord
    @State private var section: WorkstationSection
    @State private var showsPDF = false
#if DEBUG
    private let debugInitialSection: WorkstationSection?
#endif

    init(patent: PatentRecord) {
        self.patent = patent
#if DEBUG
        if let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-uiSection"),
           ProcessInfo.processInfo.arguments.indices.contains(marker + 1),
           let requested = WorkstationSection.allCases.first(where: {
               $0.rawValue.caseInsensitiveCompare(ProcessInfo.processInfo.arguments[marker + 1]) == .orderedSame
           }) {
            _section = State(initialValue: requested)
            debugInitialSection = requested
        } else {
            _section = State(initialValue: .story)
            debugInitialSection = nil
        }
#else
        _section = State(initialValue: .story)
#endif
    }

    var body: some View {
        GeometryReader { proxy in
            ScrollViewReader { reader in
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 18) {
                        Color.clear.frame(height: 1).id("workstation-top")
                        // Eight equally weighted pills do not fit in an iPad
                        // split-view detail column: their labels collapse to
                        // two-letter fragments. Use the explicit 4×2 rail
                        // anywhere below a genuinely wide desktop workspace.
                        sectionRail(compact: proxy.size.width < 980)
                        if section == .story {
                            hero(compact: proxy.size.width < 600)
                        }
                        sectionContent
                    }
                    .frame(maxWidth: section == .specification ? 1_240 : 1_080)
                    .padding(proxy.size.width < 620 ? 14 : 24)
                    .frame(maxWidth: .infinity)
                }
                .scrollIndicators(.hidden)
                .onChange(of: section) { _, _ in
                    withAnimation(.snappy(duration: 0.28)) {
                        reader.scrollTo("workstation-top", anchor: .top)
                    }
                }
            }
            .background(MuseumBackground())
        }
        // The complete title already appears in the workstation hero. Patent
        // numbers remain legible in the compact iPhone navigation bar instead
        // of truncating a long invention title into an ambiguous fragment.
        .navigationTitle(patent.patentNumber)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showsPDF) { PatentPDFReader(patent: patent) }
        .task {
#if DEBUG
            // Catalyst restores SwiftUI scene state asynchronously. Reapply an
            // explicit visual-test route after that restoration window so the
            // test cannot silently inspect a previously selected section.
            guard let debugInitialSection else { return }
            try? await Task.sleep(for: .milliseconds(250))
            section = debugInitialSection
#endif
        }
    }

    private func hero(compact: Bool) -> some View {
        MuseumPanel {
            ViewThatFits(in: .horizontal) {
                HStack(alignment: .top, spacing: 20) {
                    BlueprintGlyph(category: patent.category).frame(width: 150, height: 150)
                    heroCopy
                }
                VStack(alignment: .leading, spacing: 14) {
                    BlueprintGlyph(category: patent.category).frame(height: compact ? 120 : 150)
                    heroCopy
                }
            }
        }
    }

    private var heroCopy: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack {
                Text(patent.patentNumber)
                    .font(.system(size: Lab.size(10), weight: .black, design: .monospaced))
                    .foregroundStyle(Lab.brass)
                Spacer()
                Text(String(patent.grantDate.prefix(4)))
                    .font(.system(size: Lab.size(10), weight: .bold, design: .monospaced))
                    .foregroundStyle(Lab.secondary)
            }
            Text(patent.title)
                .font(.system(size: Lab.size(25), weight: .black, design: .serif))
                .foregroundStyle(Lab.parchment)
                .fixedSize(horizontal: false, vertical: true)
            Text(patent.subtitle)
                .font(.system(size: Lab.size(14), weight: .semibold, design: .rounded))
                .foregroundStyle(Lab.blueprint)
            Label(patent.inventors.joined(separator: " · "), systemImage: "person.2")
                .font(.system(size: Lab.size(11.5), design: .rounded))
                .foregroundStyle(Lab.secondary)
            Text(NativeMathFormatter.displayInlineMath(in: patent.summary))
                .font(.system(size: Lab.size(13.5), design: .rounded))
                .foregroundStyle(Lab.text)
                .textSelection(.enabled)
            ViewThatFits(in: .horizontal) {
                HStack(spacing: 9) { heroActions }
                VStack(alignment: .leading, spacing: 9) { heroActions }
            }
        }
    }

    @ViewBuilder
    private var heroActions: some View {
        Button { section = .simulation } label: {
            Label("Run native exhibit", systemImage: "play.circle.fill")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.brass, filled: true))
        Button { showsPDF = true } label: {
            Label("Original PDF", systemImage: "doc.richtext")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.blueprint))
        ShareLink(item: exportText, subject: Text(patent.shortTitle)) {
            Label("Share record", systemImage: "square.and.arrow.up")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.emerald))
    }

    @ViewBuilder
    private func sectionRail(compact: Bool) -> some View {
        if compact {
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 7), count: 4), spacing: 7) {
                ForEach(WorkstationSection.allCases) { sectionButton($0, compact: true) }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel("Patent workstation sections")
        } else {
            HStack(spacing: 8) {
                ForEach(WorkstationSection.allCases) { sectionButton($0, compact: false) }
            }
            .accessibilityElement(children: .contain)
            .accessibilityLabel("Patent workstation sections")
        }
    }

    private func sectionButton(_ candidate: WorkstationSection, compact: Bool) -> some View {
        Button {
            withAnimation(.snappy) { section = candidate }
        } label: {
            Group {
                if compact {
                    VStack(spacing: 4) {
                        Image(systemName: candidate.symbol).font(.system(size: 15, weight: .semibold))
                        Text(candidate.rawValue).font(.system(size: Lab.size(8), weight: .bold, design: .rounded))
                    }
                } else {
                    Label(candidate.rawValue, systemImage: candidate.symbol)
                        .font(.system(size: Lab.size(10.5), weight: .bold, design: .rounded))
                }
            }
            .lineLimit(1)
            .minimumScaleFactor(0.72)
            .foregroundStyle(section == candidate ? Lab.background : Lab.brass)
            .frame(maxWidth: compact ? .infinity : nil, minHeight: compact ? 52 : 44)
            .padding(.horizontal, compact ? 4 : 13)
            .background(section == candidate ? Lab.brass : Lab.brass.opacity(0.05), in: RoundedRectangle(cornerRadius: compact ? 13 : 22))
            .overlay(RoundedRectangle(cornerRadius: compact ? 13 : 22).stroke(Lab.brass.opacity(section == candidate ? 0 : 0.34)))
        }
        .buttonStyle(.plain)
        .accessibilityLabel(candidate.rawValue)
        .accessibilityAddTraits(section == candidate ? .isSelected : [])
    }

    @ViewBuilder
    private var sectionContent: some View {
        switch section {
        case .story: story
        case .simulation: NativePatentVisualization(patent: patent)
        case .equations: equations
        case .specification: CuratedSpecificationReader(patent: patent)
        case .claims: claims
        case .drawings: drawings
        case .history: history
        case .record: record
        }
    }

    private var story: some View {
        VStack(alignment: .leading, spacing: 16) {
            MuseumPanel {
                HStack(alignment: .top, spacing: 12) {
                    Image(systemName: "quote.opening").font(.title2).foregroundStyle(Lab.brass)
                    Text(patent.heroQuote)
                        .font(.system(size: Lab.size(16), weight: .medium, design: .serif))
                        .italic()
                        .foregroundStyle(Lab.parchment)
                        .textSelection(.enabled)
                }
            }
            MuseumPanel {
                VStack(alignment: .leading, spacing: 10) {
                    MuseumLabel(text: "The engineering move")
                    Text(NativeMathFormatter.displayInlineMath(in: patent.plainEnglish.overview))
                        .font(.system(size: Lab.size(14), design: .rounded))
                        .foregroundStyle(Lab.text)
                        .textSelection(.enabled)
                    Divider().overlay(Lab.stroke)
                    Text(NativeMathFormatter.displayInlineMath(in: patent.plainEnglish.coreMechanism))
                        .font(.system(size: Lab.size(13), design: .serif))
                        .foregroundStyle(Lab.blueprint)
                        .textSelection(.enabled)
                }
            }
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 280), spacing: 14)], spacing: 14) {
                ForEach(patent.plainEnglish.mechanicalBreakdown) { part in
                    MuseumPanel {
                        VStack(alignment: .leading, spacing: 8) {
                            Text(part.title).font(.headline).foregroundStyle(Lab.parchment)
                            Text(NativeMathFormatter.displayInlineMath(in: part.summary)).foregroundStyle(Lab.text)
                            Text(NativeMathFormatter.displayInlineMath(in: part.technicalDetails))
                                .font(.system(size: Lab.size(11.5), design: .serif))
                                .foregroundStyle(Lab.secondary)
                                .textSelection(.enabled)
                            if let old = part.archaicTerm, let modern = part.modernEquivalent {
                                Text("\(old) → \(modern)")
                                    .font(.system(size: Lab.size(9.5), weight: .bold, design: .rounded))
                                    .foregroundStyle(Lab.brass)
                            }
                        }
                    }
                }
            }
            ForEach(patent.plainEnglish.scientificPrinciples) { principle in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 8) {
                        Text(principle.principle).font(.headline).foregroundStyle(Lab.blueprint)
                        if let formula = principle.formula, !formula.isEmpty {
                            ScrollView(.horizontal, showsIndicators: false) {
                                NativeMathView(latex: formula, pointSize: Lab.size(19), defaultColor: Lab.brass)
                                    .padding(.vertical, 4)
                            }
                        }
                        Text(NativeMathFormatter.displayInlineMath(in: principle.explanation)).foregroundStyle(Lab.text).textSelection(.enabled)
                    }
                }
            }
            historyCard("Why it still matters", patent.plainEnglish.whyItMattersToday, color: Lab.emerald)
        }
    }

    private var equations: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 5) {
                    MuseumLabel(text: "Interactive equation atlas")
                    Text("\(patent.equations.count) authored equations · tap a colored variable to trace its physical role, units, and interpretation.")
                        .foregroundStyle(Lab.secondary)
                }
            }
            if patent.equations.isEmpty {
                ContentUnavailableView("No separate equation plate", systemImage: "function", description: Text("The governing law remains available in the native simulation and scientific-principles sections."))
            } else {
                ForEach(patent.equations) { ColorizedEquationCard(equation: $0) }
            }
        }
    }

    private var claims: some View {
        VStack(alignment: .leading, spacing: 12) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 6) {
                    MuseumLabel(text: "Legal scope decoded")
                    Text("\(patent.claims.count) catalogued claims · source wording and engineering meaning remain paired.")
                        .foregroundStyle(Lab.secondary)
                }
            }
            ForEach(patent.claims) { claim in
                DisclosureGroup {
                    VStack(alignment: .leading, spacing: 12) {
                        Text(claim.originalText).font(.system(size: Lab.size(13), design: .serif)).foregroundStyle(Lab.parchment).textSelection(.enabled)
                        Divider().overlay(Lab.stroke)
                        Text(NativeMathFormatter.displayInlineMath(in: claim.plainEnglish)).foregroundStyle(Lab.text).textSelection(.enabled)
                        ForEach(Array(claim.keyInnovations.enumerated()), id: \.offset) { _, innovation in
                            Label(NativeMathFormatter.displayInlineMath(in: innovation), systemImage: "sparkle").foregroundStyle(Lab.blueprint)
                        }
                        if let significance = claim.legalSignificance {
                            Label(NativeMathFormatter.displayInlineMath(in: significance), systemImage: "building.columns").foregroundStyle(Lab.brass)
                        }
                        if let dependencies = claim.dependsOn, !dependencies.isEmpty {
                            Label(
                                "Depends on claim\(dependencies.count == 1 ? "" : "s") \(dependencies.map(String.init).joined(separator: ", "))",
                                systemImage: "arrow.triangle.branch"
                            )
                            .foregroundStyle(Lab.secondary)
                        }
                    }
                    .padding(.top, 10)
                } label: {
                    HStack {
                        Text("Claim \(claim.number)").fontWeight(.bold)
                        Spacer()
                        Text(claim.isIndependent ? "INDEPENDENT" : "DEPENDENT")
                            .font(.system(size: Lab.size(8), weight: .black, design: .rounded))
                            .foregroundStyle(claim.isIndependent ? Lab.brass : Lab.secondary)
                    }
                }
                .tint(Lab.brass)
                .padding(16)
                .background(Lab.panel, in: RoundedRectangle(cornerRadius: 16))
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Lab.stroke))
            }
        }
    }

    private var drawings: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 5) {
                    MuseumLabel(text: "Figures and callouts")
                    Text("\(patent.drawings.count) authored figure records · \(patent.drawings.reduce(0) { $0 + $1.callouts.count }) annotated callouts · \(pngAssets.count) bundled source images.")
                        .foregroundStyle(Lab.secondary)
                }
            }
            PatentFigureAtlasView(patent: patent)
            ForEach(patent.drawings) { drawing in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 10) {
                        HStack {
                            Label(drawing.figureNumber, systemImage: "ruler").fontWeight(.bold).foregroundStyle(Lab.blueprint)
                            Spacer()
                            Text(drawing.svgType.uppercased())
                                .font(.system(size: Lab.size(8), weight: .bold, design: .rounded))
                                .foregroundStyle(Lab.brass)
                        }
                        Text(drawing.title).font(.headline).foregroundStyle(Lab.parchment)
                        Text(NativeMathFormatter.displayInlineMath(in: drawing.caption)).foregroundStyle(Lab.text).textSelection(.enabled)
                        ForEach(Array(drawing.callouts.enumerated()), id: \.element.id) { index, callout in
                            HStack(alignment: .top, spacing: 10) {
                                Text(PatentFigureAssetResolver.markerText(for: callout, fallbackIndex: index))
                                    .font(.system(size: Lab.size(10), weight: .black, design: .rounded))
                                    .foregroundStyle(Lab.background)
                                    .lineLimit(1)
                                    .minimumScaleFactor(0.5)
                                    .frame(width: 32, height: 32)
                                    .background(Lab.brass, in: Circle())
                                VStack(alignment: .leading, spacing: 3) {
                                    Text(PatentFigureAssetResolver.displayTitle(for: callout)).fontWeight(.semibold).foregroundStyle(Lab.parchment)
                                    Text(NativeMathFormatter.displayInlineMath(in: callout.description)).font(.caption).foregroundStyle(Lab.secondary)
                                    Text(callout.figureRef)
                                        .font(.system(size: Lab.size(8), weight: .bold, design: .monospaced))
                                        .foregroundStyle(Lab.blueprint)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    private var history: some View {
        VStack(alignment: .leading, spacing: 14) {
            historyCard("The bottleneck", patent.history.problemStatement, color: Lab.danger)
            historyCard("The breakthrough", patent.history.breakthroughInsight, color: Lab.emerald)
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Prior art could not")
                    ForEach(Array(patent.history.priorArtLimitations.enumerated()), id: \.offset) { _, limitation in
                        Label(limitation, systemImage: "xmark.circle").foregroundStyle(Lab.text)
                    }
                }
            }
            ForEach(patent.history.patentWars) { war in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 8) {
                        MuseumLabel(text: "Patent contest")
                        Text(war.rivalName).font(.title3.bold()).foregroundStyle(Lab.brass)
                        Text(NativeMathFormatter.displayInlineMath(in: war.rivalClaim)).foregroundStyle(Lab.text)
                        Text(NativeMathFormatter.displayInlineMath(in: war.conflictDetails)).foregroundStyle(Lab.secondary)
                        Text(NativeMathFormatter.displayInlineMath(in: war.resolution)).foregroundStyle(Lab.text)
                        Text(NativeMathFormatter.displayInlineMath(in: war.legalOutcome)).font(.caption.bold()).foregroundStyle(Lab.blueprint)
                    }
                }
            }
            historyCard("Civilizational impact", patent.history.civilizationalImpact, color: Lab.blueprint)
            if let aftermath = patent.history.aftermath { historyCard("After the grant", aftermath, color: Lab.brass) }
            if let fact = patent.history.funFact { historyCard("A revealing detail", fact, color: Lab.emerald) }
            ForEach(Array((patent.history.sideNotes ?? []).enumerated()), id: \.offset) { _, note in
                historyCard("Archive note", note, color: Lab.secondary)
            }
        }
    }

    private var record: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Record identity")
                    recordLine("Classification", patent.usptoClassification)
                    recordLine("Archive category", patent.categoryLabel)
                    recordLine("Inventor location", patent.inventorLocation)
                    recordLine("Era", patent.era)
                    recordLine("Filed", patent.filingDate ?? "Not stated in reviewed record")
                    recordLine("Granted", patent.grantDate)
                    if let stats = patent.stats {
                        recordLine("Claims", "\(stats.totalClaims) total · \(stats.independentClaims) independent")
                        if let years = stats.patentWarYears { recordLine("Patent contests", years) }
                    }
                    if !patent.tags.isEmpty { recordLine("Archive tags", patent.tags.joined(separator: " · ")) }
                }
            }
            if let physics = patent.physics {
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 9) {
                        MuseumLabel(text: "Native exhibit provenance")
                        recordLine("Scientific domain", physics.domainTitle)
                        recordLine("Domain key", physics.domain)
                        recordLine("Numerical method", physics.engineMethod)
                        recordLine("Spatial source", patent.sourceVisualization.spatialComponent)
                        recordLine("Vector source", patent.sourceVisualization.vectorComponent)
                    }
                }
            }
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Source integrity")
                    if let asset = patent.originalTextAsset {
                        recordLine("Text asset", asset.kind ?? "legacy source")
                        recordLine("Facsimile pages", "\(asset.pageCount)")
                        recordLine("Reviewed by", asset.reviewedBy ?? "Review in progress")
                        recordLine("Reviewed at", asset.reviewedAt ?? "—")
                        if let digest = asset.sourcePdfSha256 { recordLine("PDF SHA-256", digest) }
                        ForEach(asset.pageAnchors ?? []) { anchor in
                            DisclosureGroup("Page \(anchor.page) · \(anchor.sourceRelationship)") {
                                Text(anchor.isBlank == true
                                    ? "Visually verified blank page"
                                    : (anchor.exactSourceText ?? "No exact source excerpt was recorded for this reviewed page."))
                                    .font(.system(size: Lab.size(11.5), design: .serif))
                                    .foregroundStyle(Lab.parchment)
                                    .textSelection(.enabled)
                            }
                            .tint(Lab.brass)
                        }
                    }
                }
            }
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Verbatim catalog transcription")
                    Text(patent.originalText)
                        .font(.system(size: Lab.size(13), design: .serif))
                        .foregroundStyle(Lab.parchment)
                        .textSelection(.enabled)
                }
            }
            Button { showsPDF = true } label: { Label("Read the original PDF", systemImage: "doc.text.magnifyingglass") }
                .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.brass, filled: true))
        }
    }

    private func recordLine(_ label: String, _ value: String) -> some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .firstTextBaseline) {
                Text(label).foregroundStyle(Lab.secondary)
                Spacer()
                Text(value).foregroundStyle(Lab.parchment).textSelection(.enabled)
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(label).foregroundStyle(Lab.secondary)
                Text(value).foregroundStyle(Lab.parchment).textSelection(.enabled)
            }
        }
        .font(.system(size: Lab.size(11.5), design: .rounded))
    }

    private func historyCard(_ title: String, _ text: String, color: Color) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 8) {
                Text(title.uppercased())
                    .font(.system(size: Lab.size(9), weight: .black, design: .rounded))
                    .kerning(1.4)
                    .foregroundStyle(color)
                Text(NativeMathFormatter.displayInlineMath(in: text)).foregroundStyle(Lab.text).textSelection(.enabled)
            }
        }
    }

    private var pngAssets: [String] { patent.bundledAssets.filter { $0.lowercased().hasSuffix(".png") } }

    private var exportText: String {
        """
        \(patent.title)
        \(patent.patentNumber) · \(patent.inventors.joined(separator: ", ")) · \(patent.grantDate)

        \(patent.summary)

        THE MECHANISM
        \(patent.plainEnglish.overview)

        \(patent.plainEnglish.coreMechanism)

        WHY IT MATTERS
        \(patent.plainEnglish.whyItMattersToday)
        """
    }
}
