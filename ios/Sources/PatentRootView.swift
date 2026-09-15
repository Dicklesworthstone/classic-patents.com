import SwiftUI

private enum PatentRootSection: String, CaseIterable, Identifiable {
    case archive = "Archive"
    case timeline = "Timeline"
    case saved = "Saved"
    case method = "Method"

    var id: Self { self }

    var symbol: String {
        switch self {
        case .archive: "books.vertical.fill"
        case .timeline: "timeline.selection"
        case .saved: "bookmark.fill"
        case .method: "compass.drawing"
        }
    }
}

enum PatentDeepLink: Equatable {
    case archive(query: String?)
    case timeline
    case saved
    case method
    case patent(id: String, section: PatentWorkstationSection, showsPDF: Bool)

    init?(url: URL) {
        let scheme = url.scheme?.lowercased()
        let isAppURL = scheme == "frankenpatents"
        let isWebURL = (scheme == "https" || scheme == "http")
            && url.host.map { ["classic-patents.com", "www.classic-patents.com"].contains($0.lowercased()) } == true
        guard isAppURL || isWebURL else { return nil }

        var routeParts = url.pathComponents.filter { $0 != "/" }
        if isAppURL, let host = url.host, !host.isEmpty {
            routeParts.insert(host, at: 0)
        }
        let route = routeParts.first?.lowercased() ?? "archive"
        let queryItems = URLComponents(url: url, resolvingAgainstBaseURL: false)?.queryItems ?? []
        let value: (String) -> String? = { name in
            queryItems.first(where: { $0.name.caseInsensitiveCompare(name) == .orderedSame })?.value
        }

        switch route {
        case "", "archive", "search":
            self = .archive(query: value("q") ?? value("query"))
        case "timeline":
            self = .timeline
        case "saved", "bookmarks":
            self = .saved
        case "method", "about":
            self = .method
        case "patent", "patents":
            guard routeParts.indices.contains(1) else { return nil }
            let id = routeParts[1].lowercased()
            guard !id.isEmpty else { return nil }
            let requestedFace = value("section") ?? value("view") ?? url.fragment
            let face = Self.workstationFace(named: requestedFace)
            self = .patent(id: id, section: face.section, showsPDF: face.showsPDF)
        default:
            return nil
        }
    }

    private static func workstationFace(
        named rawValue: String?
    ) -> (section: PatentWorkstationSection, showsPDF: Bool) {
        let normalized = rawValue?
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()
            .replacingOccurrences(of: "_", with: "-")
        switch normalized {
        case "plain-english", "story": return (.story, false)
        case "interactive-sim", "simulation", "sim": return (.simulation, false)
        case "equation", "equations": return (.equations, false)
        case "claim", "claims": return (.claims, false)
        case "schematic-sheet", "drawing", "drawings", "figure", "figures": return (.drawings, false)
        case "history": return (.history, false)
        case "record": return (.record, false)
        case "pdf", "pdf-facsimile", "facsimile": return (.specification, true)
        default: return (.specification, false)
        }
    }
}

private struct PresentedPatentRoute: Identifiable {
    let patent: PatentRecord
    let section: PatentWorkstationSection
    let showsPDF: Bool

    var id: String { "\(patent.id):\(section.rawValue):\(showsPDF)" }
}

struct PatentRootView: View {
    @Environment(\.horizontalSizeClass) private var horizontalSizeClass
    @Environment(\.dynamicTypeSize) private var systemDynamicTypeSize
    @AppStorage(LabAppearance.storageKey) private var appearance = LabAppearance.dark.rawValue
    @AppStorage(Lab.textScaleStorageKey) private var textScale = Lab.defaultTextScale
    @StateObject private var library: PatentLibrary
    @StateObject private var collection: PatentCollectionStore
    @State private var section = PatentRootSection.archive
    @State private var presentedPatentRoute: PresentedPatentRoute?
    @State private var deepLinkError: String?
    @State private var handledLaunchDeepLink = false

    init() {
        let library = PatentLibrary()
        _library = StateObject(wrappedValue: library)
        _collection = StateObject(wrappedValue: PatentCollectionStore(
            validIDs: Set(library.records.map(\.id))
        ))
    }

    private var launchPatent: PatentRecord? {
#if DEBUG
        guard let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-FrankenPatentsUITestPatent"),
              ProcessInfo.processInfo.arguments.indices.contains(marker + 1) else { return nil }
        return library.records.first(where: { $0.id == ProcessInfo.processInfo.arguments[marker + 1] })
#else
        return nil
#endif
    }

    private var launchRoot: String? {
#if DEBUG
        guard let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-FrankenPatentsUITestRoot"),
              ProcessInfo.processInfo.arguments.indices.contains(marker + 1) else { return nil }
        return ProcessInfo.processInfo.arguments[marker + 1].lowercased()
#else
        return nil
#endif
    }

    private var launchDeepLinkURL: URL? {
#if DEBUG
        guard let marker = ProcessInfo.processInfo.arguments.firstIndex(of: "-FrankenPatentsUITestDeepLink"),
              ProcessInfo.processInfo.arguments.indices.contains(marker + 1) else { return nil }
        return URL(string: ProcessInfo.processInfo.arguments[marker + 1])
#else
        return nil
#endif
    }

    var body: some View {
        Group {
            if let launchPatent {
                NavigationStack { PatentWorkstationView(patent: launchPatent, hidesNavigationBar: true) }
            } else if launchRoot == "timeline" {
                NativePatentTimelineView(library: library)
            } else if launchRoot == "method" {
                PatentMethodologyView()
            } else {
#if targetEnvironment(macCatalyst)
                tabbedRoot
#else
                if horizontalSizeClass == .regular { regularRoot } else { tabbedRoot }
#endif
            }
        }
        .environmentObject(collection)
        .environment(\.dynamicTypeSize, Lab.dynamicTypeSize(from: systemDynamicTypeSize, for: textScale))
        .safeAreaInset(edge: .top, spacing: 0) {
            HStack(spacing: 9) {
                Image("MonsterIcon")
                    .resizable()
                    .scaledToFill()
                    .frame(width: 34, height: 34)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(Lab.brass.opacity(0.35)))
                    .accessibilityHidden(true)
                FrankenWordmark()
                Spacer()
                categoryMenu
                LabAppearanceButton(selection: $appearance)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Lab.background.opacity(0.96))
            .accessibilityElement(children: .contain)
            .accessibilityIdentifier("frankenpatents-masthead")
        }
        .preferredColorScheme((LabAppearance(rawValue: appearance) ?? .dark).colorScheme)
        .onOpenURL(perform: openDeepLink)
        .onAppear {
            guard !handledLaunchDeepLink else { return }
            handledLaunchDeepLink = true
            if let launchDeepLinkURL { openDeepLink(launchDeepLinkURL) }
        }
        .fullScreenCover(item: $presentedPatentRoute) { route in
            DeepLinkedPatentView(route: route)
                .environmentObject(collection)
        }
        .alert("Unable to open patent", isPresented: Binding(
            get: { deepLinkError != nil },
            set: { if !$0 { deepLinkError = nil } }
        )) {
            Button("OK", role: .cancel) { deepLinkError = nil }
        } message: {
            Text(deepLinkError ?? "The requested record is unavailable.")
        }
    }

    private var tabbedRoot: some View {
        TabView(selection: $section) {
            PatentMuseumView(library: library)
                .tabItem { Label("Archive", systemImage: PatentRootSection.archive.symbol) }
                .tag(PatentRootSection.archive)
            NativePatentTimelineView(library: library)
                .tabItem { Label("Timeline", systemImage: PatentRootSection.timeline.symbol) }
                .tag(PatentRootSection.timeline)
            SavedPatentsView(library: library)
                .tabItem { Label("Saved", systemImage: PatentRootSection.saved.symbol) }
                .tag(PatentRootSection.saved)
            PatentMethodologyView()
                .tabItem { Label("Method", systemImage: PatentRootSection.method.symbol) }
                .tag(PatentRootSection.method)
        }
        .tint(Lab.brass)
        .toolbarBackground(Lab.background.opacity(0.96), for: .tabBar)
        .toolbarBackground(.visible, for: .tabBar)
        .toolbarColorScheme(
            (LabAppearance(rawValue: appearance) ?? .dark).colorScheme,
            for: .tabBar
        )
    }

    private var regularRoot: some View {
        VStack(spacing: 0) {
            HStack(spacing: 8) {
                ForEach(PatentRootSection.allCases) { candidate in
                    Button {
                        withAnimation(.snappy(duration: 0.22)) { section = candidate }
                    } label: {
                        Label(candidate.rawValue, systemImage: candidate.symbol)
                            .font(.system(size: Lab.size(10), weight: .bold, design: .rounded))
                            .frame(maxWidth: .infinity)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 10)
                            .foregroundStyle(section == candidate ? Lab.background : Lab.brass)
                            .background(
                                section == candidate ? Lab.brass : Lab.panelStrong,
                                in: Capsule()
                            )
                            .overlay(Capsule().stroke(Lab.brass.opacity(section == candidate ? 0 : 0.32)))
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(section == candidate ? .isSelected : [])
                }
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(Lab.background.opacity(0.96))

            Group {
                switch section {
                case .archive: PatentMuseumView(library: library)
                case .timeline: NativePatentTimelineView(library: library)
                case .saved: SavedPatentsView(library: library)
                case .method: PatentMethodologyView()
                }
            }
        }
    }

    private var categoryMenu: some View {
        Menu {
            Button {
                library.selectedCategory = nil
            } label: {
                if library.selectedCategory == nil {
                    Label("All inventions", systemImage: "checkmark")
                } else {
                    Text("All inventions")
                }
            }
            Divider()
            ForEach(library.categories, id: \.self) { category in
                Button {
                    library.selectedCategory = category
                } label: {
                    if library.selectedCategory == category {
                        Label(library.label(for: category), systemImage: "checkmark")
                    } else {
                        Text(library.label(for: category))
                    }
                }
            }
        } label: {
            Image(systemName: "line.3.horizontal.decrease.circle")
                .font(.system(size: Lab.size(14), weight: .bold))
                .frame(width: 44, height: 44)
                .background(Lab.panelStrong, in: Circle())
                .overlay(Circle().stroke(Lab.stroke))
        }
        .buttonStyle(.plain)
        .foregroundStyle(Lab.brass)
        .accessibilityLabel("Filter patent category")
    }

    private func openDeepLink(_ url: URL) {
        guard let destination = PatentDeepLink(url: url) else { return }
        presentedPatentRoute = nil
        switch destination {
        case let .archive(query):
            library.selectedCategory = nil
            library.query = query ?? ""
            section = .archive
        case .timeline:
            section = .timeline
        case .saved:
            section = .saved
        case .method:
            section = .method
        case let .patent(id, requestedSection, showsPDF):
            guard let patent = library.records.first(where: { $0.id == id }) else {
                section = .archive
                deepLinkError = "No bundled patent record matches “\(id)”."
                return
            }
            presentedPatentRoute = PresentedPatentRoute(
                patent: patent,
                section: requestedSection,
                showsPDF: showsPDF
            )
        }
    }
}

private struct DeepLinkedPatentView: View {
    let route: PresentedPatentRoute
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            PatentWorkstationView(
                patent: route.patent,
                initialSection: route.section,
                initiallyShowsPDF: route.showsPDF
            )
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                        .accessibilityIdentifier("close-deep-linked-patent")
                }
            }
        }
    }
}

struct SavedPatentsView: View {
    @ObservedObject var library: PatentLibrary
    @EnvironmentObject private var collection: PatentCollectionStore

    private var recordsByID: [String: PatentRecord] {
        Dictionary(uniqueKeysWithValues: library.records.map { ($0.id, $0) })
    }

    private var saved: [PatentRecord] {
        collection.savedIDs.compactMap { recordsByID[$0] }
    }

    private var recent: [PatentRecord] {
        collection.recentIDs.compactMap { recordsByID[$0] }
    }

    var body: some View {
        NavigationStack {
            Group {
                if saved.isEmpty && recent.isEmpty {
                    ContentUnavailableView {
                        Label("Build your invention shelf", systemImage: "bookmark")
                    } description: {
                        Text("Save patents from any workstation. Recently opened exhibits also appear here automatically and stay only on this device.")
                    }
                } else {
                    List {
                        if !saved.isEmpty {
                            Section("Saved inventions") {
                                ForEach(saved) { patent in
                                    savedPatentLink(patent, showsBookmark: true)
                                }
                            }
                        }
                        if !recent.isEmpty {
                            Section("Recently viewed") {
                                ForEach(recent) { patent in
                                    savedPatentLink(patent, showsBookmark: collection.isSaved(patent.id))
                                }
                            }
                        }
                    }
                    .listStyle(.insetGrouped)
                    .scrollContentBackground(.hidden)
                }
            }
            .background(MuseumBackground())
            .navigationTitle("Your invention shelf")
            .navigationDestination(for: PatentRecord.self) { patent in
                PatentWorkstationView(patent: patent)
            }
        }
        .tint(Lab.brass)
    }

    private func savedPatentLink(_ patent: PatentRecord, showsBookmark: Bool) -> some View {
        NavigationLink(value: patent) {
            HStack(spacing: 12) {
                Image(systemName: Lab.categorySymbol(patent.category))
                    .foregroundStyle(Lab.categoryColor(patent.category))
                    .frame(width: 32)
                VStack(alignment: .leading, spacing: 3) {
                    Text(patent.shortTitle)
                        .font(.system(size: Lab.size(14), weight: .bold, design: .serif))
                        .foregroundStyle(Lab.parchment)
                    Text("\(patent.patentNumber) · \(patent.inventors.joined(separator: " & "))")
                        .font(.system(size: Lab.size(10), design: .rounded))
                        .foregroundStyle(Lab.secondary)
                        .lineLimit(1)
                }
                Spacer()
                if showsBookmark {
                    Image(systemName: "bookmark.fill")
                        .foregroundStyle(Lab.brass)
                        .accessibilityHidden(true)
                }
            }
            .padding(.vertical, 4)
            .accessibilityElement(children: .combine)
        }
        .swipeActions(edge: .trailing) {
            Button {
                collection.toggleSaved(patent.id)
            } label: {
                Label(
                    collection.isSaved(patent.id) ? "Remove" : "Save",
                    systemImage: collection.isSaved(patent.id) ? "bookmark.slash" : "bookmark"
                )
            }
            .tint(Lab.brass)
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
                                                .font(.system(size: Lab.size(9), weight: .black, design: .rounded))
                                            Text(patent.shortTitle)
                                                .font(.system(size: Lab.size(11), weight: .bold, design: .serif))
                                                .lineLimit(2)
                                            Text(patent.patentNumber)
                                                .font(.system(size: Lab.size(8.5), design: .rounded))
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
