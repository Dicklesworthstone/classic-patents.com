import SwiftUI

struct PatentMuseumView: View {
    @ObservedObject var library: PatentLibrary
    @State private var selectedID: String?

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                MuseumBackground()
                if proxy.size.width < 760 {
                    compactCatalog
                } else if proxy.size.width < 1_100 {
                    focusedMuseum
                } else {
                    adaptiveMuseum
                }
            }
        }
        .onAppear {
            ensureSelectionVisible()
        }
        .onChange(of: library.selectedCategory) { _, _ in
            ensureSelectionVisible(forceFirst: true)
        }
        .onChange(of: library.query) { _, _ in
            ensureSelectionVisible()
        }
    }

    private var compactCatalog: some View {
        NavigationStack {
            patentList(compact: true)
                .navigationTitle("FrankenPatents")
                .navigationBarTitleDisplayMode(.inline)
                .navigationDestination(for: PatentRecord.self) { patent in
                    PatentWorkstationView(patent: patent)
                }
        }
        .tint(Lab.brass)
    }

    private var focusedMuseum: some View {
        NavigationSplitView {
            patentList(compact: false)
                .navigationSplitViewColumnWidth(min: 330, ideal: 390, max: 460)
        } detail: {
            if let selected = selectedPatent {
                PatentWorkstationView(patent: selected, hidesNavigationBar: true)
            } else {
                ContentUnavailableView("Choose a patent", systemImage: "doc.text.magnifyingglass")
                    .foregroundStyle(Lab.secondary)
                    .background(MuseumBackground())
            }
        }
        .navigationSplitViewStyle(.balanced)
        .tint(Lab.brass)
    }

    private var adaptiveMuseum: some View {
        NavigationSplitView {
            categorySidebar
                .navigationSplitViewColumnWidth(min: 250, ideal: 285, max: 340)
        } content: {
            patentList(compact: false)
                .navigationSplitViewColumnWidth(min: 320, ideal: 390, max: 480)
        } detail: {
            if let selected = selectedPatent {
                PatentWorkstationView(patent: selected, hidesNavigationBar: true)
            } else {
                ContentUnavailableView("Choose a patent", systemImage: "doc.text.magnifyingglass")
                    .foregroundStyle(Lab.secondary)
                    .background(MuseumBackground())
            }
        }
        .navigationSplitViewStyle(.balanced)
        .tint(Lab.brass)
    }

    private var selectedPatent: PatentRecord? {
        guard let selectedID else { return nil }
        return library.records.first(where: { $0.id == selectedID })
    }

    private func ensureSelectionVisible(forceFirst: Bool = false) {
        let filtered = library.filteredRecords
        if forceFirst || !filtered.contains(where: { $0.id == selectedID }) {
            selectedID = filtered.first?.id
        }
    }

    private var categorySidebar: some View {
        VStack(spacing: 0) {
            HStack(spacing: 11) {
                Image("MonsterIcon")
                    .resizable()
                    .scaledToFill()
                    .frame(width: 48, height: 48)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Lab.brass.opacity(0.35)))
                    .accessibilityLabel("Friendly FrankenPatents inventor monster")
                VStack(alignment: .leading, spacing: 2) {
                    FrankenWordmark()
                    Text("INVENTION_ARCHIVE // verified sources")
                        .font(.system(size: Lab.size(9.5), weight: .semibold, design: .rounded))
                        .foregroundStyle(Lab.secondary)
                }
            }
            .padding(16)

            List(selection: $library.selectedCategory) {
                Label("All inventions", systemImage: "sparkles.rectangle.stack")
                    .tag(String?.none)
                ForEach(library.categories, id: \.self) { category in
                    Label(library.label(for: category), systemImage: Lab.categorySymbol(category))
                        .foregroundStyle(Lab.categoryColor(category))
                        .tag(String?.some(category))
                }
            }
            .font(.system(size: Lab.size(11.5), weight: .medium, design: .rounded))
            .scrollContentBackground(.hidden)

            VStack(alignment: .leading, spacing: 5) {
                Text("\(library.records.count) CURATED RECORDS")
                    .font(.system(size: Lab.size(9.5), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.brass)
                Text(
                    "The complete catalog, figures, equations, history, claims, and native interactive studies "
                        + "are bundled for private offline use. Only an original patent PDF is downloaded when "
                        + "you explicitly request it."
                )
                    .font(.system(size: Lab.size(11), design: .rounded))
                    .foregroundStyle(Lab.secondary)
            }
            .padding(16)
        }
        .background(MuseumBackground())
    }

    private func patentList(compact: Bool) -> some View {
        Group {
            if let error = library.loadError {
                ContentUnavailableView(
                    "Catalog unavailable",
                    systemImage: "exclamationmark.triangle",
                    description: Text(error)
                )
            } else if library.filteredRecords.isEmpty {
                ContentUnavailableView.search(text: library.query)
            } else {
                List {
                    ArchiveSummaryCard(recordCount: library.records.count)
                        .listRowInsets(EdgeInsets(top: 12, leading: 14, bottom: 12, trailing: 14))
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                    ForEach(library.filteredRecords) { patent in
                        if compact {
                            NavigationLink(value: patent) { PatentRow(patent: patent, compact: true) }
                        } else {
                            Button {
                                selectedID = patent.id
                            } label: {
                                PatentRow(patent: patent, compact: false)
                                    .contentShape(Rectangle())
                            }
                            .buttonStyle(.plain)
                            .listRowBackground(selectedID == patent.id ? Lab.brass.opacity(0.12) : Color.clear)
                        }
                    }
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
            }
        }
        .background(MuseumBackground())
        .searchable(text: $library.query, prompt: "Inventor, mechanism, patent…")
        .navigationTitle(compact ? "" : library.selectedCategory.map { library.label(for: $0) } ?? "The archive")
    }
}

private struct ArchiveSummaryCard: View {
    let recordCount: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            MuseumLabel(text: "Private offline invention museum")
            HStack(alignment: .firstTextBaseline, spacing: 7) {
                Text("\(recordCount)")
                    .font(.system(size: Lab.size(31), weight: .black, design: .serif))
                    .foregroundStyle(Lab.parchment)
                Text("curated patent records")
                    .font(.system(size: Lab.size(15), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.text)
            }
            Text(
                "Search the complete archive, then open native claims, figures, equations, historical context, "
                    + "and interactive engineering studies."
            )
                .font(.system(size: Lab.size(11.5), design: .rounded))
                .foregroundStyle(Lab.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(16)
        .background(Lab.panel, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 18, style: .continuous).stroke(Lab.brass.opacity(0.30)))
        .accessibilityElement(children: .combine)
        .accessibilityIdentifier("archive-summary")
        .accessibilityLabel("\(recordCount) curated patent records in a private offline invention museum")
    }
}

private struct PatentRow: View {
    let patent: PatentRecord
    let compact: Bool

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 11, style: .continuous)
                    .fill(Lab.categoryColor(patent.category).opacity(0.13))
                Image(systemName: Lab.categorySymbol(patent.category))
                    .font(.system(size: Lab.size(compact ? 18 : 21), weight: .semibold))
                    .foregroundStyle(Lab.categoryColor(patent.category))
            }
            .frame(width: compact ? 44 : 50, height: compact ? 44 : 50)

            VStack(alignment: .leading, spacing: 4) {
                Text(patent.patentNumber)
                    .font(.system(size: Lab.size(9.5), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.brass)
                Text(patent.shortTitle)
                    .font(.system(size: Lab.size(compact ? 15 : 16), weight: .bold, design: .rounded))
                    .foregroundStyle(Lab.text)
                    .lineLimit(2)
                Text(patent.inventors.joined(separator: " & "))
                    .font(.system(size: Lab.size(11.5), design: .rounded))
                    .foregroundStyle(Lab.secondary)
                    .lineLimit(1)
                if !compact {
                    Text(NativeMathFormatter.displayInlineMath(in: patent.summary))
                        .font(.system(size: Lab.size(11.5), design: .rounded))
                        .foregroundStyle(Lab.secondary.opacity(0.88))
                        .lineLimit(2)
                }
            }
        }
        .padding(.vertical, 6)
        .accessibilityElement(children: .combine)
    }
}
