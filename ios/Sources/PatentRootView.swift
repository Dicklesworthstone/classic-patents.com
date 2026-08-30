import SwiftUI

struct PatentRootView: View {
    @StateObject private var library = PatentLibrary()

    private var launchPatent: PatentRecord? {
#if DEBUG
        guard let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-uiPatent"),
              ProcessInfo.processInfo.arguments.indices.contains(marker + 1) else { return nil }
        return library.records.first(where: { $0.id == ProcessInfo.processInfo.arguments[marker + 1] })
#else
        return nil
#endif
    }

    private var launchRoot: String? {
#if DEBUG
        guard let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-uiRoot"),
              ProcessInfo.processInfo.arguments.indices.contains(marker + 1) else { return nil }
        return ProcessInfo.processInfo.arguments[marker + 1].lowercased()
#else
        return nil
#endif
    }

    var body: some View {
        Group {
            if let launchPatent {
                NavigationStack { PatentWorkstationView(patent: launchPatent) }
            } else if launchRoot == "timeline" {
                NativePatentTimelineView(library: library)
            } else if launchRoot == "method" {
                PatentMethodologyView()
            } else {
                TabView {
                    PatentMuseumView(library: library)
                        .tabItem { Label("Archive", systemImage: "books.vertical.fill") }
                    NativePatentTimelineView(library: library)
                        .tabItem { Label("Timeline", systemImage: "timeline.selection") }
                    PatentMethodologyView()
                        .tabItem { Label("Method", systemImage: "compass.drawing") }
                }
                .tint(Lab.brass)
                .toolbarBackground(Lab.background.opacity(0.96), for: .tabBar)
                .toolbarBackground(.visible, for: .tabBar)
            }
        }
    }
}

struct NativePatentTimelineView: View {
    enum Era: String, CaseIterable, Identifiable {
        case all = "All"
        case early = "1769–1869"
        case gilded = "1870–1909"
        case modern = "1910–2009"
        var id: String { rawValue }
    }

    @ObservedObject var library: PatentLibrary
    @State private var era: Era = .all
    @State private var selectedID: String?

    private var records: [PatentRecord] {
        library.records.sorted { $0.grantDate < $1.grantDate }.filter { patent in
            guard era != .all, let year = Int(patent.grantDate.prefix(4)) else { return true }
            switch era {
            case .early: return year < 1870
            case .gilded: return year >= 1870 && year < 1910
            case .modern: return year >= 1910
            case .all: return true
            }
        }
    }

    private var selected: PatentRecord? {
        records.first(where: { $0.id == selectedID }) ?? records.first
    }

    var body: some View {
        NavigationStack {
            GeometryReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 6) {
                            MuseumLabel(text: "Chronological evolution of technology")
                            Text("Over Two Centuries of Human Ingenuity (1769–2009)")
                                .font(.system(size: Lab.size(27), weight: .black, design: .serif))
                                .foregroundStyle(Lab.parchment)
                                .fixedSize(horizontal: false, vertical: true)
                            Text("Follow how mechanical automation, telegraphy, materials science, electricity, aerodynamics, nuclear physics, monolithic silicon, and computing built the modern world.")
                                .font(.system(size: Lab.size(13), design: .serif))
                                .italic()
                                .foregroundStyle(Lab.secondary)
                                .fixedSize(horizontal: false, vertical: true)
                        }
                        Picker("Historical era", selection: $era) {
                            ForEach(Era.allCases) { candidate in Text(candidate.rawValue).tag(candidate) }
                        }
                        .pickerStyle(.segmented)

                        ScrollView(.horizontal, showsIndicators: false) {
                            LazyHStack(spacing: 9) {
                                ForEach(records) { patent in
                                    Button { selectedID = patent.id } label: {
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(String(patent.grantDate.prefix(4)))
                                                .font(.system(size: Lab.size(9), weight: .black, design: .monospaced))
                                            Text(patent.shortTitle)
                                                .font(.system(size: Lab.size(11), weight: .bold, design: .serif))
                                                .lineLimit(2)
                                            Text(patent.patentNumber)
                                                .font(.system(size: Lab.size(8.5), design: .monospaced))
                                        }
                                        .foregroundStyle(selected?.id == patent.id ? Lab.background : Lab.parchment)
                                        .frame(width: 150, alignment: .leading)
                                        .frame(minHeight: 94, alignment: .leading)
                                        .padding(12)
                                        .background(selected?.id == patent.id ? Lab.brass : Lab.panel, in: RoundedRectangle(cornerRadius: 14))
                                        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Lab.brass.opacity(0.32)))
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }

                        if let selected {
                            MuseumPanel {
                                ViewThatFits(in: .horizontal) {
                                    HStack(alignment: .top, spacing: 18) {
                                        milestone(selected).frame(maxWidth: .infinity)
                                        historicalColumns(selected).frame(maxWidth: .infinity)
                                    }
                                    VStack(alignment: .leading, spacing: 16) {
                                        milestone(selected)
                                        historicalColumns(selected)
                                    }
                                }
                            }
                            NavigationLink(value: selected) {
                                Label("Open complete native patent workstation", systemImage: "arrow.right.circle.fill")
                                    .frame(maxWidth: .infinity)
                            }
                            .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.brass, filled: true))
                        }
                    }
                    .frame(maxWidth: 1_180)
                    .padding(proxy.size.width < 620 ? 14 : 24)
                    .frame(maxWidth: .infinity)
                }
                .scrollIndicators(.hidden)
            }
            .background(MuseumBackground())
            .navigationTitle("Invention timeline")
            .navigationDestination(for: PatentRecord.self) { PatentWorkstationView(patent: $0) }
        }
        .onChange(of: era) { _, _ in selectedID = records.first?.id }
    }

    private func milestone(_ patent: PatentRecord) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            MuseumLabel(text: "\(patent.grantDate) · \(patent.patentNumber)")
            Text(patent.shortTitle)
                .font(.system(size: Lab.size(25), weight: .black, design: .serif))
                .foregroundStyle(Lab.parchment)
            Text(patent.subtitle)
                .font(.system(size: Lab.size(13), design: .serif)).italic().foregroundStyle(Lab.secondary)
            Label("\(patent.inventors.joined(separator: ", ")) · \(patent.inventorLocation)", systemImage: "person.2")
                .font(.system(size: Lab.size(10.5), design: .rounded)).foregroundStyle(Lab.brass)
        }
    }

    private func historicalColumns(_ patent: PatentRecord) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            timelineFact("Inventor & bottleneck", patent.history.problemStatement, color: Lab.blueprint)
            timelineFact("The breakthrough insight", patent.history.breakthroughInsight, color: Lab.brass)
            timelineFact("Civilizational impact", patent.history.civilizationalImpact, color: Lab.emerald)
        }
    }

    private func timelineFact(_ title: String, _ body: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(title.uppercased())
                .font(.system(size: Lab.size(8.5), weight: .black, design: .rounded)).foregroundStyle(color)
            Text(body).font(.system(size: Lab.size(11.5), design: .serif)).foregroundStyle(Lab.text).textSelection(.enabled)
        }
        .padding(12)
        .background(color.opacity(0.055), in: RoundedRectangle(cornerRadius: 12))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(color.opacity(0.20)))
    }
}

struct PatentMethodologyView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    VStack(alignment: .leading, spacing: 7) {
                        MuseumLabel(text: "Mission & philosophy")
                        Text("Restoring history’s technical masterpieces")
                            .font(.system(size: Lab.size(31), weight: .black, design: .serif))
                            .foregroundStyle(Lab.parchment)
                        Text("Why we built Classic Patents and how we illuminate humanity’s greatest technical breakthroughs through interactive physical simulations and clear engineering breakdowns.")
                            .font(.system(size: Lab.size(14), design: .serif)).italic().foregroundStyle(Lab.secondary)
                    }
                    methodologySection(
                        "The dilemma of historical patents",
                        symbol: "scroll",
                        paragraphs: [
                            "When Wilbur Wright twisted a bicycle box in Dayton, Ohio, or Nikola Tesla sketched a rotating magnetic field in the dust of a Budapest park, they changed the trajectory of human civilization. The legal patents recording these breakthroughs are preserved in public domain archives at the USPTO.",
                            "However, original historical patents suffer from severe barriers to entry:",
                        ]
                    )
                    methodologyBullets([
                        ("Microfilm Degradation", "Most scanned PDFs are low-contrast, skewed raster scans from 19th-century microfilms."),
                        ("Legalistic Obfuscation", "Patent prose was engineered to maximize legal scope in courtroom battles, creating impenetrable, archaic legal run-ons that obscure the underlying physics."),
                        ("Static 2D Lithographs", "Original black-and-white drawings cannot illustrate the dynamic 3D physics of wing-warping adverse yaw, continuous AC rotating magnetic fields, or high-speed electron beam rasterization."),
                    ])
                    methodologySection(
                        "The dual-projection (diptych) architecture",
                        symbol: "rectangle.split.2x1",
                        paragraphs: [
                            "Every patent in our museum is projected into two synchronized, complementary faces:",
                        ]
                    )
                    diptychFaces
                    methodologySection(
                        "Pedagogical physical simulations",
                        symbol: "waveform.path.ecg.rectangle",
                        paragraphs: [
                            "Rather than static stock illustrations, every invention features an interactive simulation governed by the authentic physical laws described in the patent. Visitors can manipulate aerodynamic wing-warping angles, adjust alternating-current stator phase offsets, regulate blackbody filament temperatures, or test spread-spectrum frequency-hopping anti-jamming ratios in real time.",
                            "In the native museum, the catalog, archival editions, equations, drawings, callouts, and theory are bundled with the app. The only requested network operation is downloading an original public patent PDF from classic-patents.com for the in-app facsimile reader.",
                        ]
                    )
                    methodologySection(
                        "Open source digital museum",
                        symbol: "books.vertical",
                        paragraphs: [
                            "Classic Patents is built with Next.js 15, React 19, TypeScript, Three.js, and Tailwind CSS. All historical transcripts, schemas, and interactive models are open-source and freely available for educational and research use.",
                            "The native app preserves that material in a private, offline-first reading environment optimized separately for touch, tablet study, and a resizable Mac workspace.",
                        ]
                    )
                    methodologySection(
                        "The philosophy of plain English without dumbing down",
                        symbol: "text.book.closed",
                        paragraphs: [
                            "Patents are the primary historical blueprints of human ingenuity, but 19th-century legal prose was engineered for lawyers and examiners, not for students, engineers, or curious minds. Classic Patents bridges this gap: we preserve every character of the original legal text and drawings while providing a rigorous, first-principles engineering breakdown with the real equations, native simulations, and interactive physical parameter dials.",
                        ]
                    )
                }
                .frame(maxWidth: 900)
                .padding(24)
                .frame(maxWidth: .infinity)
            }
            .scrollIndicators(.hidden)
            .background(MuseumBackground())
            .navigationTitle("Method")
        }
    }

    private func methodologyBullets(_ items: [(String, String)]) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 12) {
                ForEach(Array(items.enumerated()), id: \.offset) { _, item in
                    HStack(alignment: .top, spacing: 10) {
                        Image(systemName: "exclamationmark.circle.fill")
                            .foregroundStyle(Lab.brass)
                            .padding(.top, 2)
                        Text(item.0).fontWeight(.bold) + Text(": \(item.1)")
                    }
                    .font(.system(size: Lab.size(12.5), design: .rounded))
                    .foregroundStyle(Lab.text)
                    .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    private var diptychFaces: some View {
        ViewThatFits(in: .horizontal) {
            HStack(alignment: .top, spacing: 14) {
                faceCard(
                    "Face 1: Primary archival facsimile & specification",
                    "Exact, complete transcription of the historical legal text, annotated claim hierarchies, and the original high-resolution scanned PDF for historians and legal scholars.",
                    symbol: "scroll",
                    tint: Lab.brass
                )
                faceCard(
                    "Face 2: Plain English engineering breakdown",
                    "A rigorous, mathematically honest deconstruction explaining the genuine mechanical, electrical, aerodynamic, and chemical physics without childish oversimplification.",
                    symbol: "sparkles",
                    tint: Lab.emerald
                )
            }
            VStack(alignment: .leading, spacing: 14) {
                faceCard(
                    "Face 1: Primary archival facsimile & specification",
                    "Exact, complete transcription of the historical legal text, annotated claim hierarchies, and the original high-resolution scanned PDF for historians and legal scholars.",
                    symbol: "scroll",
                    tint: Lab.brass
                )
                faceCard(
                    "Face 2: Plain English engineering breakdown",
                    "A rigorous, mathematically honest deconstruction explaining the genuine mechanical, electrical, aerodynamic, and chemical physics without childish oversimplification.",
                    symbol: "sparkles",
                    tint: Lab.emerald
                )
            }
        }
    }

    private func faceCard(_ title: String, _ body: String, symbol: String, tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(title, systemImage: symbol)
                .font(.system(size: Lab.size(13), weight: .bold, design: .serif))
                .foregroundStyle(tint)
            Text(body)
                .font(.system(size: Lab.size(11.5), design: .rounded))
                .foregroundStyle(Lab.text)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(tint.opacity(0.06), in: RoundedRectangle(cornerRadius: 14))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(tint.opacity(0.28)))
    }

    private func methodologySection(_ title: String, symbol: String, paragraphs: [String]) -> some View {
        MuseumPanel {
            VStack(alignment: .leading, spacing: 10) {
                Label(title, systemImage: symbol)
                    .font(.system(size: Lab.size(19), weight: .bold, design: .serif)).foregroundStyle(Lab.brass)
                ForEach(Array(paragraphs.enumerated()), id: \.offset) { _, paragraph in
                    Text(paragraph)
                        .font(.system(size: Lab.size(13), design: .serif))
                        .foregroundStyle(Lab.text)
                        .textSelection(.enabled)
                }
            }
        }
    }
}
