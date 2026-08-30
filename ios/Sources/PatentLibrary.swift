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
            try PatentCatalogValidator.validate(decoded)
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

private enum PatentCatalogValidator {
    private struct InvalidCatalog: LocalizedError {
        let reason: String
        var errorDescription: String? { "The bundled patent catalog is invalid: \(reason)" }
    }

    static func validate(_ records: [PatentRecord]) throws {
        try require(!records.isEmpty, "it contains no records")
        try require(Set(records.map(\.id)).count == records.count, "patent ids are not unique")
        try require(Set(records.map(\.patentNumber)).count == records.count, "patent numbers are not unique")

        for patent in records {
            try require(
                patent.id.range(of: #"^[a-z0-9]+(?:-[a-z0-9]+)*$"#, options: .regularExpression) != nil,
                "\(patent.id) is not a cache-safe patent id"
            )
            guard let sourceURL = URL(string: patent.originalPdfURL) else {
                throw InvalidCatalog(reason: "\(patent.id) has an invalid source PDF address")
            }
            try require(
                PatentPDFStore.isAllowedPDFURL(sourceURL)
                    && sourceURL.lastPathComponent == "\(patent.id).pdf",
                "\(patent.id) has a source PDF outside its canonical first-party path"
            )

            let claimNumbers = patent.claims.map(\.number)
            let claimSet = Set(claimNumbers)
            try require(claimSet.count == claimNumbers.count, "\(patent.id) has duplicate claim numbers")
            try require(claimNumbers.allSatisfy { $0 > 0 }, "\(patent.id) has a non-positive claim number")
            for claim in patent.claims {
                for dependency in claim.dependsOn ?? [] {
                    try require(
                        dependency != claim.number && claimSet.contains(dependency),
                        "\(patent.id) claim \(claim.number) has an invalid dependency"
                    )
                }
            }
            if let stats = patent.stats {
                try require(stats.totalClaims == patent.claims.count, "\(patent.id) claim statistics drifted")
                try require(
                    stats.independentClaims == patent.claims.filter(\.isIndependent).count,
                    "\(patent.id) independent-claim statistics drifted"
                )
            }

            try requireUnique(patent.drawings.map(\.figureNumber), context: "\(patent.id) drawing numbers")
            for drawing in patent.drawings {
                try requireUnique(drawing.callouts.map(\.id), context: "\(patent.id) \(drawing.figureNumber) callouts")
                try require(
                    drawing.callouts.allSatisfy { $0.x.isFinite && $0.y.isFinite && (0...100).contains($0.x) && (0...100).contains($0.y) },
                    "\(patent.id) \(drawing.figureNumber) has a callout outside its drawing"
                )
            }

            try requireUnique(patent.equations.map(\.id), context: "\(patent.id) equation ids")
            for equation in patent.equations {
                try require(equation.patentId == patent.id, "\(patent.id) contains an equation for another patent")
                let variableIDs = Set(equation.variables.map(\.id))
                try require(variableIDs.count == equation.variables.count, "\(patent.id) has duplicate equation variables")
                try require(
                    equation.plainEnglishSentence.allSatisfy { fragment in
                        fragment.variableId.map(variableIDs.contains) ?? true
                    },
                    "\(patent.id) has an equation sentence with an unknown variable"
                )
                try require(
                    equation.claimRef.map(claimSet.contains) ?? true,
                    "\(patent.id) has an equation linked to an unavailable claim"
                )
            }

            if let physics = patent.physics {
                try requireUnique(physics.controls.map(\.id), context: "\(patent.id) physics controls")
                try require(
                    physics.controls.allSatisfy {
                        $0.min.isFinite && $0.max.isFinite && $0.step.isFinite && $0.defaultValue.isFinite
                            && $0.min <= $0.defaultValue && $0.defaultValue <= $0.max && $0.step > 0
                    },
                    "\(patent.id) has an invalid physics control range"
                )
            }

            if let asset = patent.originalTextAsset {
                try require(asset.pageCount > 0, "\(patent.id) has an invalid facsimile page count")
                try requireUnique((asset.pageAnchors ?? []).map(\.page), context: "\(patent.id) page anchors")
                if let digest = asset.sourcePdfSha256 {
                    try require(
                        digest.range(of: #"^[0-9a-f]{64}$"#, options: .regularExpression) != nil,
                        "\(patent.id) has a non-canonical source digest"
                    )
                }
                let textPath = asset.url.hasPrefix("/") ? String(asset.url.dropFirst()) : asset.url
                try validateAssetPaths([textPath], context: "\(patent.id) source transcription")
                try require(
                    URL(fileURLWithPath: textPath).pathExtension.lowercased() == "txt"
                        && patent.bundledAssets.contains(textPath),
                    "\(patent.id) source transcription is not in the bundled asset ledger"
                )
            }

            try validateAssetPaths(patent.bundledAssets, context: "\(patent.id) bundled assets")
            try validateAssetPaths(patent.withheldAssets, context: "\(patent.id) withheld assets")
        }
    }

    private static func validateAssetPaths(_ paths: [String], context: String) throws {
        try requireUnique(paths, context: context)
        try require(
            paths.allSatisfy { path in
                !path.isEmpty
                    && !path.hasPrefix("/")
                    && !path.contains("\\")
                    && !path.split(separator: "/").contains("..")
                    && URL(fileURLWithPath: path).pathExtension.lowercased() != "pdf"
            },
            "\(context) contains an unsafe or forbidden path"
        )
    }

    private static func requireUnique<T: Hashable>(_ values: [T], context: String) throws {
        try require(Set(values).count == values.count, "\(context) are not unique")
    }

    private static func require(_ condition: @autoclosure () -> Bool, _ reason: String) throws {
        guard condition() else { throw InvalidCatalog(reason: reason) }
    }
}
