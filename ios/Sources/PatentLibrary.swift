import Foundation
import Combine

@MainActor
final class PatentLibrary: ObservableObject {
    @Published var query = ""
    @Published var selectedCategory: String?
    @Published private(set) var records: [PatentRecord] = []
    @Published private(set) var loadError: String?

    init(bundle: Bundle = .main) {
        load(bundle: bundle)
    }

    var categories: [String] {
        Array(Set(records.map(\.category))).sorted()
    }

    var filteredRecords: [PatentRecord] {
        let normalizedQuery = query.trimmingCharacters(in: .whitespacesAndNewlines)
        return records.filter { patent in
            let categoryMatches = selectedCategory == nil || patent.category == selectedCategory
            guard categoryMatches else { return false }
            guard !normalizedQuery.isEmpty else { return true }
            return [
                patent.patentNumber,
                patent.title,
                patent.shortTitle,
                patent.subtitle,
                patent.inventors.joined(separator: " "),
                patent.summary,
                patent.tags.joined(separator: " "),
            ].contains { $0.localizedCaseInsensitiveContains(normalizedQuery) }
        }
    }

    func label(for category: String) -> String {
        switch category {
        case "aerospace": "Aerospace"
        case "aviation": "Aviation & Marine"
        case "computing": "Computing & Digital Systems"
        case "consumer": "Mechanical & Consumer"
        case "electricity": "Electricity & Energy"
        case "materials": "Materials & Industrial Chemistry"
        case "optics": "Optics & Imaging"
        case "telecom": "Telecommunications"
        default: category.capitalized
        }
    }

    private func load(bundle: Bundle) {
        let url = bundle.url(forResource: "patents", withExtension: "json", subdirectory: "Resources")
            ?? bundle.url(forResource: "patents", withExtension: "json")
        guard let url else {
            loadError = "The bundled patent catalog is missing."
            return
        }
        do {
            let data = try Data(contentsOf: url, options: .mappedIfSafe)
            let loadStarted = ContinuousClock.now
            let decoded = try JSONDecoder().decode([PatentRecord].self, from: data)
            records = decoded
            let loadDuration = ContinuousClock.now - loadStarted
            let loadMilliseconds = Double(loadDuration.components.seconds) * 1_000
                + Double(loadDuration.components.attoseconds) / 1_000_000_000_000_000
            IOSProfileRunner.runIfRequested(
                catalogData: data,
                loadedRecords: records,
                productLoadMilliseconds: loadMilliseconds
            )
        } catch {
            loadError = error.localizedDescription
        }
    }
}
