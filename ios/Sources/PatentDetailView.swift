import SwiftUI

private enum PatentSection: String, CaseIterable, Identifiable {
    case mechanism = "Mechanism"
    case claims = "Claims"
    case history = "History"
    case source = "Source"

    var id: String { rawValue }
}

struct PatentDetailView: View {
    let patent: PatentRecord
    @State private var section: PatentSection = .mechanism

    var body: some View {
        GeometryReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    hero
                    Picker("Reading projection", selection: $section) {
                        ForEach(PatentSection.allCases) { Text($0.rawValue).tag($0) }
                    }
                    .pickerStyle(.segmented)
                    .accessibilityLabel("Patent reading section")

                    switch section {
                    case .mechanism: mechanism
                    case .claims: claims
                    case .history: history
                    case .source: source
                    }
                }
                .frame(maxWidth: 1_050)
                .padding(proxy.size.width < 620 ? 14 : 24)
                .frame(maxWidth: .infinity)
            }
            .background(MuseumBackground())
        }
        .navigationTitle(patent.shortTitle)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var hero: some View {
        MuseumPanel {
            ViewThatFits(in: .horizontal) {
                HStack(alignment: .top, spacing: 20) { heroIcon; heroCopy }
                VStack(alignment: .leading, spacing: 14) { heroIcon; heroCopy }
            }
        }
    }

    private var heroIcon: some View {
        BlueprintGlyph(category: patent.category)
            .frame(width: 150, height: 150)
            .accessibilityHidden(true)
    }

    private var heroCopy: some View {
        VStack(alignment: .leading, spacing: 9) {
            HStack {
                Text(patent.patentNumber)
                    .font(.system(size: Lab.size(10), weight: .black, design: .monospaced))
                    .foregroundStyle(Lab.brass)
                Spacer()
                Text(formattedYear)
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
                .fixedSize(horizontal: false, vertical: true)
            Label(patent.inventors.joined(separator: " · "), systemImage: "person.2")
                .font(.system(size: Lab.size(11.5), design: .rounded))
                .foregroundStyle(Lab.secondary)
            Text(patent.summary)
                .font(.system(size: Lab.size(13.5), design: .rounded))
                .foregroundStyle(Lab.text)
                .fixedSize(horizontal: false, vertical: true)
            actionBar
        }
    }

    private var actionBar: some View {
        ViewThatFits(in: .horizontal) {
            HStack(spacing: 9) { actionButtons }
            VStack(alignment: .leading, spacing: 9) { actionButtons }
        }
    }

    @ViewBuilder private var actionButtons: some View {
        if let url = URL(string: patent.originalPdfURL) {
            Link(destination: url) { Label("Facsimile", systemImage: "doc.richtext") }
                .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.blueprint))
        }
        ShareLink(item: "\(patent.title)\n\n\(patent.summary)", subject: Text(patent.shortTitle)) {
            Label("Share", systemImage: "square.and.arrow.up")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.emerald))
    }

    private var mechanism: some View {
        VStack(alignment: .leading, spacing: 16) {
            quotePanel
            MuseumPanel {
                VStack(alignment: .leading, spacing: 10) {
                    MuseumLabel(text: "The engineering move")
                    Text(patent.plainEnglish.overview)
                        .font(.system(size: Lab.size(14), design: .rounded))
                        .foregroundStyle(Lab.text)
                        .textSelection(.enabled)
                    Divider().overlay(Lab.stroke)
                    Text(patent.plainEnglish.coreMechanism)
                        .font(.system(size: Lab.size(12.5), design: .monospaced))
                        .foregroundStyle(Lab.blueprint)
                        .textSelection(.enabled)
                }
            }
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 260), spacing: 14)], spacing: 14) {
                ForEach(patent.plainEnglish.mechanicalBreakdown) { part in
                    MuseumPanel {
                        VStack(alignment: .leading, spacing: 8) {
                            Text(part.title)
                                .font(.system(size: Lab.size(15), weight: .bold))
                                .foregroundStyle(Lab.parchment)
                            Text(part.summary)
                                .font(.system(size: Lab.size(12.5), design: .rounded))
                                .foregroundStyle(Lab.text)
                            Text(part.technicalDetails)
                                .font(.system(size: Lab.size(11.5), design: .monospaced))
                                .foregroundStyle(Lab.secondary)
                                .textSelection(.enabled)
                            if let old = part.archaicTerm, let modern = part.modernEquivalent {
                                Text("\(old) → \(modern)")
                                    .font(.system(size: Lab.size(9), weight: .bold, design: .monospaced))
                                    .foregroundStyle(Lab.brass)
                            }
                        }
                    }
                }
            }
            scientificPrinciples
            MuseumPanel {
                VStack(alignment: .leading, spacing: 8) {
                    MuseumLabel(text: "Why it still matters")
                    Text(patent.plainEnglish.whyItMattersToday)
                        .foregroundStyle(Lab.text)
                        .textSelection(.enabled)
                }
            }
        }
    }

    private var quotePanel: some View {
        MuseumPanel {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: "quote.opening")
                    .font(.title2)
                    .foregroundStyle(Lab.brass)
                Text(patent.heroQuote)
                    .font(.system(size: Lab.size(16), weight: .medium, design: .serif))
                    .italic()
                    .foregroundStyle(Lab.parchment)
                    .textSelection(.enabled)
            }
        }
    }

    private var scientificPrinciples: some View {
        VStack(alignment: .leading, spacing: 10) {
            MuseumLabel(text: "Scientific principles")
            ForEach(patent.plainEnglish.scientificPrinciples) { principle in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 7) {
                        Text(principle.principle)
                            .font(.system(size: Lab.size(14), weight: .bold))
                            .foregroundStyle(Lab.blueprint)
                        if let formula = principle.formula, !formula.isEmpty {
                            Text(formula)
                                .font(.system(size: Lab.size(13), weight: .semibold, design: .monospaced))
                                .foregroundStyle(Lab.brass)
                                .textSelection(.enabled)
                        }
                        Text(principle.explanation)
                            .font(.system(size: Lab.size(12.5), design: .rounded))
                            .foregroundStyle(Lab.text)
                            .textSelection(.enabled)
                    }
                }
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
                        Text(claim.originalText)
                            .font(.system(size: Lab.size(12.5), design: .serif))
                            .foregroundStyle(Lab.parchment)
                            .textSelection(.enabled)
                        Divider().overlay(Lab.stroke)
                        Text(claim.plainEnglish)
                            .font(.system(size: Lab.size(12.5), design: .rounded))
                            .foregroundStyle(Lab.text)
                            .textSelection(.enabled)
                        if !claim.keyInnovations.isEmpty {
                            Text(claim.keyInnovations.joined(separator: " · "))
                                .font(.system(size: Lab.size(9), weight: .bold, design: .monospaced))
                                .foregroundStyle(Lab.blueprint)
                        }
                        if let significance = claim.legalSignificance {
                            Label(significance, systemImage: "building.columns")
                                .font(.system(size: Lab.size(10)))
                                .foregroundStyle(Lab.brass)
                        }
                    }
                    .padding(.top, 10)
                } label: {
                    HStack {
                        Text("Claim \(claim.number)").fontWeight(.bold)
                        Text(claim.isIndependent ? "INDEPENDENT" : "DEPENDENT")
                            .font(.system(size: Lab.size(8), weight: .black, design: .monospaced))
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

    private var history: some View {
        VStack(alignment: .leading, spacing: 14) {
            historyCard("The bottleneck", patent.history.problemStatement, color: Lab.danger)
            historyCard("The breakthrough", patent.history.breakthroughInsight, color: Lab.emerald)
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Prior art could not")
                    ForEach(patent.history.priorArtLimitations, id: \.self) { limitation in
                        Label(limitation, systemImage: "xmark.circle")
                            .foregroundStyle(Lab.text)
                    }
                }
            }
            ForEach(patent.history.patentWars) { war in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 8) {
                        MuseumLabel(text: "Patent contest")
                        Text(war.rivalName).font(.title3.bold()).foregroundStyle(Lab.brass)
                        Text(war.rivalClaim).foregroundStyle(Lab.text)
                        Text(war.conflictDetails).foregroundStyle(Lab.secondary)
                        Text(war.resolution).foregroundStyle(Lab.text)
                        Text(war.legalOutcome)
                            .font(.system(size: Lab.size(10), weight: .bold, design: .monospaced))
                            .foregroundStyle(Lab.blueprint)
                    }
                }
            }
            historyCard("Civilizational impact", patent.history.civilizationalImpact, color: Lab.blueprint)
            if let aftermath = patent.history.aftermath { historyCard("After the grant", aftermath, color: Lab.brass) }
        }
    }

    private func historyCard(_ title: String, _ text: String, color: Color) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 8) {
                Text(title.uppercased())
                    .font(.system(size: Lab.size(9), weight: .black, design: .monospaced))
                    .kerning(1.6)
                    .foregroundStyle(color)
                Text(text).foregroundStyle(Lab.text).textSelection(.enabled)
            }
        }
    }

    private var source: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 9) {
                    MuseumLabel(text: "Archival excerpt")
                    Text(patent.originalText)
                        .font(.system(size: Lab.size(13), design: .serif))
                        .foregroundStyle(Lab.parchment)
                        .textSelection(.enabled)
                }
            }
            if !patent.drawings.isEmpty {
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 240), spacing: 12)], spacing: 12) {
                    ForEach(patent.drawings) { drawing in
                        MuseumPanel {
                            VStack(alignment: .leading, spacing: 7) {
                                Label(drawing.figureNumber, systemImage: "ruler")
                                    .fontWeight(.bold)
                                    .foregroundStyle(Lab.blueprint)
                                Text(drawing.title).fontWeight(.semibold).foregroundStyle(Lab.text)
                                Text(drawing.caption).font(.caption).foregroundStyle(Lab.secondary)
                                Text("\(drawing.callouts.count) annotated callouts")
                                    .font(.system(size: Lab.size(8), weight: .black, design: .monospaced))
                                    .foregroundStyle(Lab.brass)
                            }
                        }
                    }
                }
            }
            MuseumPanel {
                VStack(alignment: .leading, spacing: 7) {
                    MuseumLabel(text: "Record identity")
                    Text(patent.usptoClassification).foregroundStyle(Lab.text).textSelection(.enabled)
                    Text(patent.inventorLocation).foregroundStyle(Lab.secondary).textSelection(.enabled)
                    Text(patent.era).foregroundStyle(Lab.secondary)
                }
            }
        }
    }

    private var formattedYear: String {
        String(patent.grantDate.prefix(4))
    }
}

struct BlueprintGlyph: View {
    let category: String
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        TimelineView(.animation(minimumInterval: reduceMotion ? 1 : 1 / 30)) { timeline in
            Canvas { context, size in
                let color = Lab.categoryColor(category)
                let center = CGPoint(x: size.width / 2, y: size.height / 2)
                let t = reduceMotion ? 0 : timeline.date.timeIntervalSinceReferenceDate
                for index in 0..<5 {
                    let radius = CGFloat(18 + index * 12)
                    var ring = Path()
                    ring.addEllipse(in: CGRect(x: center.x - radius, y: center.y - radius, width: radius * 2, height: radius * 2))
                    context.stroke(ring, with: .color(color.opacity(0.12 + Double(index) * 0.05)), lineWidth: 1)
                }
                for index in 0..<7 {
                    let angle = t * 0.28 + Double(index) * (.pi * 2 / 7)
                    let radius = CGFloat(22 + index * 5)
                    let point = CGPoint(
                        x: center.x + CGFloat(cos(angle)) * radius,
                        y: center.y + CGFloat(sin(angle)) * radius
                    )
                    context.fill(Path(ellipseIn: CGRect(x: point.x - 3, y: point.y - 3, width: 6, height: 6)), with: .color(index.isMultiple(of: 2) ? Lab.brass : color))
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
    }
}
