import SwiftUI
import UniformTypeIdentifiers

struct PatentGlossaryEntry: Identifiable, Hashable {
    let term: String
    let era: String
    let literalDefinition: String
    let modernEngineeringTranslation: String
    let historicalContext: String

    var id: String { term }
}

enum PatentReferenceLibrary {
    static let glossary: [PatentGlossaryEntry] = [
        PatentGlossaryEntry(
            term: "Letters Patent",
            era: "14th–20th Century",
            literalDefinition: "Open public letters from a monarch or government (literae patentes) granting monopoly rights.",
            modernEngineeringTranslation: "Issued USPTO utility or design patent publication.",
            historicalContext: "Contrasted with 'letters close' (private sealed royal correspondence)."
        ),
        PatentGlossaryEntry(
            term: "In testimony whereof",
            era: "19th Century",
            literalDefinition: "Formal concluding legal formula affirming under oath the execution of the instrument.",
            modernEngineeringTranslation: "Inventor and witness digital/physical signatures.",
            historicalContext: "Required two witness attestations in 19th-century USPTO filing procedure."
        ),
        PatentGlossaryEntry(
            term: "Aeroplane",
            era: "Early 20th Century (Wright era)",
            literalDefinition: "A flat or cambered lifting aerofoil surface supported dynamically by air pressure.",
            modernEngineeringTranslation: "Wing / Airfoil lifting surface (later evolved to mean the entire motorized aircraft).",
            historicalContext: "The Wrights used 'aeroplane' to denote the individual fabric-covered wings."
        ),
        PatentGlossaryEntry(
            term: "Undulating Current",
            era: "19th Century (Bell era)",
            literalDefinition: "An electric current whose magnitude varies continuously and periodically without interruption.",
            modernEngineeringTranslation: "Continuous analog AC or audio-frequency electrical waveform.",
            historicalContext: "Bell's central legal weapon against telegraph companies who relied on pulsed DC make-and-break circuits."
        ),
        PatentGlossaryEntry(
            term: "Subdivision of the Electric Light",
            era: "1870s–1880s (Edison era)",
            literalDefinition: "The problem of operating numerous small domestic lamps off a single electrical generator.",
            modernEngineeringTranslation: "Parallel circuit wiring of high-resistance incandescent electrical loads.",
            historicalContext: "Pundits claimed it was physically impossible until Edison increased filament resistance to 100 ohms."
        ),
        PatentGlossaryEntry(
            term: "Optically Anisotropic Solution",
            era: "1960s (Kwolek era)",
            literalDefinition: "A liquid solution that exhibits direction-dependent refractive indices due to molecular alignment.",
            modernEngineeringTranslation: "Liquid crystalline nematic phase polymer dope.",
            historicalContext: "Technicians initially tried to throw out Kwolek's cloudy solution thinking it was contaminated."
        ),
        PatentGlossaryEntry(
            term: "Unitary Body of Semiconductor Material",
            era: "1950s–1960s (Noyce era)",
            literalDefinition: "A single continuous crystal structure of silicon or germanium.",
            modernEngineeringTranslation: "Monolithic single-crystal silicon die / integrated circuit wafer.",
            historicalContext: "Differentiated Noyce's monolithic planar circuit from Jack Kilby's hybrid flying-wire prototype."
        ),
        PatentGlossaryEntry(
            term: "Peculiar and Novel Construction",
            era: "19th Century",
            literalDefinition: "A distinctive, patentable structural arrangement not found in prior art.",
            modernEngineeringTranslation: "Novel and non-obvious mechanical embodiment under 35 U.S.C. § 103.",
            historicalContext: "Standard 19th-century legal terminology establishing novelty."
        )
    ]

    static func filteredGlossary(query: String) -> [PatentGlossaryEntry] {
        let needle = query.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        guard !needle.isEmpty else { return glossary }
        return glossary.filter {
            $0.term.lowercased().contains(needle)
                || $0.modernEngineeringTranslation.lowercased().contains(needle)
        }
    }
}

enum PatentCitationFormat: String, CaseIterable, Identifiable {
    case bibtex = "BibTeX"
    case ris = "RIS"
    case chicago = "Chicago"
    case apa = "APA (7th)"

    var id: String { rawValue }

    var description: String {
        switch self {
        case .bibtex: "BibTeX format for LaTeX, Overleaf, and BibDesk."
        case .ris: "RIS format for Zotero, Mendeley, EndNote, Citavi, and RefWorks."
        case .chicago: "Chicago Manual of Style (Notes & Bibliography) patent citation."
        case .apa: "American Psychological Association (APA 7th Edition) format."
        }
    }

    func filename(for patentID: String) -> String {
        switch self {
        case .bibtex: "\(patentID).bib"
        case .ris: "\(patentID).ris"
        case .chicago: "\(patentID)-chicago.txt"
        case .apa: "\(patentID)-apa.txt"
        }
    }
}

enum PatentCitationEngine {
    static func text(for patent: PatentRecord, format: PatentCitationFormat) -> String {
        switch format {
        case .bibtex: bibtex(for: patent)
        case .ris: ris(for: patent)
        case .chicago: chicago(for: patent)
        case .apa: apa(for: patent)
        }
    }

    static func formatAuthorLastFirst(_ name: String) -> String {
        let trimmed = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, !trimmed.contains(",") else { return trimmed }
        let parts = trimmed.split(whereSeparator: \.isWhitespace).map(String.init)
        guard parts.count > 1, let last = parts.last else { return trimmed }
        return "\(last), \(parts.dropLast().joined(separator: " "))"
    }

    private static func bibtex(for patent: PatentRecord) -> String {
        let parts = patent.grantDate.split(separator: "-", omittingEmptySubsequences: false).map(String.init)
        let date = normalizedDateParts(parts)
        return """
        @patent{\(patent.id),
          author    = {\(patent.inventors.joined(separator: " and "))},
          title     = {\(patent.title)},
          number    = {\(patent.patentNumber)},
          year      = {\(date.year)},
          month     = {\(date.month)},
          day       = {\(date.day)},
          url       = {https://classic-patents.com/patents/\(patent.id)},
          note      = {Classic Patents Digital Museum}
        }
        """
    }

    private static func ris(for patent: PatentRecord) -> String {
        let date = normalizedDateParts(patent.grantDate.split(separator: "-", omittingEmptySubsequences: false).map(String.init))
        var lines = ["TY  - PAT", "TI  - \(patent.title)"]
        lines.append(contentsOf: patent.inventors.map { "AU  - \(formatAuthorLastFirst($0))" })
        lines.append(contentsOf: [
            "PY  - \(date.year)",
            "DA  - \(date.year)/\(date.month)/\(date.day)",
            "PB  - U.S. Patent and Trademark Office",
            "M3  - U.S. Patent \(patent.patentNumber)",
            "UR  - https://classic-patents.com/patents/\(patent.id)",
            "ER  - "
        ])
        return lines.joined(separator: "\n")
    }

    private static func apa(for patent: PatentRecord) -> String {
        let year = normalizedDateParts(patent.grantDate.split(separator: "-", omittingEmptySubsequences: false).map(String.init)).year
        return "\(patent.inventors.joined(separator: ", ")). (\(year)). \(patent.title) (U.S. Patent No. \(patent.patentNumber)). U.S. Patent and Trademark Office. https://classic-patents.com/patents/\(patent.id)"
    }

    private static func chicago(for patent: PatentRecord) -> String {
        let authors: String
        switch patent.inventors.count {
        case 0: authors = ""
        case 1: authors = formatAuthorLastFirst(patent.inventors[0])
        case 2: authors = "\(formatAuthorLastFirst(patent.inventors[0])), and \(patent.inventors[1])"
        default:
            authors = "\(formatAuthorLastFirst(patent.inventors[0])), \(patent.inventors.dropFirst().dropLast().joined(separator: ", ")), and \(patent.inventors.last ?? "")"
        }
        let year = normalizedDateParts(patent.grantDate.split(separator: "-", omittingEmptySubsequences: false).map(String.init)).year
        let filing = patent.filingDate.map { "filed \(displayDate($0)), and " } ?? ""
        return "\(authors). \(year). \"\(patent.title).\" U.S. Patent \(patent.patentNumber), \(filing)issued \(displayDate(patent.grantDate)). https://classic-patents.com/patents/\(patent.id)."
    }

    private static func displayDate(_ isoDate: String) -> String {
        let parts = normalizedDateParts(isoDate.split(separator: "-", omittingEmptySubsequences: false).map(String.init))
        guard let month = Int(parts.month), (1 ... 12).contains(month), let day = Int(parts.day) else {
            return isoDate
        }
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return "\(months[month - 1]) \(day), \(parts.year)"
    }

    private static func normalizedDateParts(_ parts: [String]) -> (year: String, month: String, day: String) {
        guard parts.count == 3 else { return (parts.first ?? "", "", "") }
        return (parts[0], parts[1], parts[2])
    }
}

private struct PatentCitationDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.plainText] }
    let text: String

    init(text: String) {
        self.text = text
    }

    init(configuration: ReadConfiguration) throws {
        text = configuration.file.regularFileContents.flatMap { String(data: $0, encoding: .utf8) } ?? ""
    }

    func fileWrapper(configuration _: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: Data(text.utf8))
    }
}

struct PatentReferenceToolsView: View {
    private enum Section: String, CaseIterable, Identifiable {
        case glossary = "Glossary"
        case citations = "Citations"
        var id: String { rawValue }
    }

    let patent: PatentRecord
    @Environment(\.dismiss) private var dismiss
    @State private var section = Section.glossary
    @State private var query = ""
    @State private var citationFormat = PatentCitationFormat.bibtex
    @State private var copied = false
    @State private var exportsCitation = false
    @State private var exportError: String?

    private var citationText: String {
        PatentCitationEngine.text(for: patent, format: citationFormat)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                MuseumBackground()
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        Picker("Reference tool", selection: $section) {
                            ForEach(Section.allCases) { Text($0.rawValue).tag($0) }
                        }
                        .pickerStyle(.segmented)
                        .accessibilityIdentifier("reference-tool-picker")

                        if section == .glossary {
                            glossaryContent
                        } else {
                            citationContent
                        }
                    }
                    .frame(maxWidth: 760)
                    .padding(18)
                    .frame(maxWidth: .infinity)
                }
            }
            .navigationTitle("Glossary & Cite")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
        .fileExporter(
            isPresented: $exportsCitation,
            document: PatentCitationDocument(text: citationText),
            contentType: .plainText,
            defaultFilename: citationFormat.filename(for: patent.id)
        ) { result in
            if case let .failure(error) = result { exportError = error.localizedDescription }
        }
        .alert("Citation export failed", isPresented: Binding(
            get: { exportError != nil },
            set: { if !$0 { exportError = nil } }
        )) {
            Button("OK", role: .cancel) { exportError = nil }
        } message: {
            Text(exportError ?? "The citation file could not be exported.")
        }
    }

    private var glossaryContent: some View {
        VStack(alignment: .leading, spacing: 12) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 8) {
                    MuseumLabel(text: "Historical patent glossary")
                    TextField("Term or modern equivalent", text: $query)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityIdentifier("glossary-search")
                    Text("The same eight reviewed translations used by the original museum, kept available offline.")
                        .font(.system(size: Lab.size(11), design: .rounded))
                        .foregroundStyle(Lab.secondary)
                }
            }
            ForEach(PatentReferenceLibrary.filteredGlossary(query: query)) { entry in
                MuseumPanel {
                    VStack(alignment: .leading, spacing: 8) {
                        HStack(alignment: .firstTextBaseline) {
                            Text("“\(entry.term)”").font(.headline).foregroundStyle(Lab.parchment)
                            Spacer()
                            Text(entry.era)
                                .font(.system(size: Lab.size(9), weight: .semibold, design: .rounded))
                                .foregroundStyle(Lab.secondary)
                        }
                        Text(entry.literalDefinition).italic().foregroundStyle(Lab.text)
                        VStack(alignment: .leading, spacing: 4) {
                            MuseumLabel(text: "Modern engineering decoded")
                            Text(entry.modernEngineeringTranslation).foregroundStyle(Lab.text)
                        }
                        .padding(10)
                        .background(Lab.emerald.opacity(0.10), in: RoundedRectangle(cornerRadius: 11))
                        Text("Historical note: \(entry.historicalContext)")
                            .font(.system(size: Lab.size(10.5), design: .rounded))
                            .foregroundStyle(Lab.secondary)
                    }
                }
            }
        }
        .accessibilityIdentifier("historical-patent-glossary")
    }

    private var citationContent: some View {
        VStack(alignment: .leading, spacing: 14) {
            MuseumPanel {
                VStack(alignment: .leading, spacing: 10) {
                    MuseumLabel(text: "Academic citation")
                    Picker("Citation format", selection: $citationFormat) {
                        ForEach(PatentCitationFormat.allCases) { Text($0.rawValue).tag($0) }
                    }
                    .pickerStyle(.menu)
                    .accessibilityIdentifier("citation-format")
                    Text(citationFormat.description)
                        .font(.system(size: Lab.size(11), design: .rounded))
                        .foregroundStyle(Lab.secondary)
                    Text(citationText)
                        .font(.system(size: Lab.size(11.5), design: .serif))
                        .foregroundStyle(Lab.parchment)
                        .textSelection(.enabled)
                        .accessibilityIdentifier("citation-text")
                    ViewThatFits(in: .horizontal) {
                        HStack(spacing: 9) { citationActions }
                        VStack(alignment: .leading, spacing: 9) { citationActions }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var citationActions: some View {
        Button {
            UIPasteboard.general.string = citationText
            copied = true
        } label: {
            Label(copied ? "Copied" : "Copy citation", systemImage: copied ? "checkmark" : "doc.on.doc")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.brass, filled: true))
        .accessibilityIdentifier("copy-citation")

        Button {
            exportsCitation = true
        } label: {
            Label("Export file", systemImage: "square.and.arrow.down")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.blueprint))
        .accessibilityIdentifier("export-citation")

        ShareLink(item: citationText, subject: Text("\(patent.patentNumber) citation")) {
            Label("Share", systemImage: "square.and.arrow.up")
        }
        .buttonStyle(MuseumCapsuleButtonStyle(tint: Lab.emerald))
    }
}
