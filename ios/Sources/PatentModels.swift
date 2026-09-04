import Foundation

struct PatentRecord: Codable, Identifiable, Hashable {
    let id: String
    let patentNumber: String
    let title: String
    let shortTitle: String
    let subtitle: String
    let inventors: [String]
    let inventorLocation: String
    let grantDate: String
    let filingDate: String?
    let era: String
    let category: String
    let categoryLabel: String
    let summary: String
    let heroQuote: String
    let originalPdfURL: String
    let googlePatentsURL: String
    let usptoClassification: String
    let originalText: String
    let originalTextAsset: OriginalTextAsset?
    /// The pinned facsimile digest is independent from editorial publication.
    /// Source-bounded records can therefore offer the original PDF without
    /// misrepresenting an unreviewed transcript as its integrity receipt.
    let pinnedPdfSha256: String?
    let archivalEdition: CuratedSpecificationEdition?
    let archivalPublication: ArchivalPublicationSummary
    let archivalParallelReadings: [String: [String]]
    let plainEnglish: PlainEnglish
    let claims: [PatentClaim]
    let drawings: [PatentDrawing]
    let history: PatentHistory
    let tags: [String]
    let stats: PatentStats?
    let equations: [ColorizedEquation]
    let physics: PatentPhysicsMetadata?
    let sourceVisualization: PatentSourceVisualization
    let bundledAssets: [String]
    let withheldAssets: [String]

    var expectedSourcePDFSHA256: String? {
        originalTextAsset?.sourcePdfSha256 ?? pinnedPdfSha256
    }
}

struct ArchivalPublicationSummary: Codable, Hashable {
    let status: String
    let isPublished: Bool
    let reasonCode: String
    let explanation: String

    var isReconstructionQuarantined: Bool {
        reasonCode == "FABRICATION_OR_RECONSTRUCTION_QUARANTINE"
            || reasonCode == "AUDIT_RECONSTRUCTION_QUARANTINE"
    }
}

struct PatentSourceVisualization: Codable, Hashable {
    enum Kind: String, Codable, Hashable {
        case model
        case sourceBoundPDFOnly = "source-bound-pdf-only"
    }

    let kind: Kind
    let spatialComponent: String?
    let vectorComponent: String?
    let sourceBoundary: String?

    var isSourceBoundPDFOnly: Bool { kind == .sourceBoundPDFOnly }
}

struct OriginalTextAsset: Codable, Hashable {
    let url: String
    let pageCount: Int
    let kind: String?
    let reviewedBy: String?
    let reviewedAt: String?
    let sourcePdfSha256: String?
    let pageAnchors: [ReviewedPageAnchor]?
}

struct ReviewedPageAnchor: Codable, Hashable, Identifiable {
    let page: Int
    let exactSourceText: String?
    let sourceRelationship: String
    let isBlank: Bool?

    var id: Int { page }
}

struct CuratedSpecificationEdition: Codable, Hashable {
    let kind: String
    let sourcePdfSha256: String
    let preparedBy: String
    let preparedAt: String
    let completeFacsimileReviewed: Bool?
    let claimStatus: EditionStatus?
    let drawingStatus: EditionStatus?
    let blocks: [CuratedSpecificationBlock]
}

struct EditionStatus: Codable, Hashable {
    let kind: String
    let evidence: String
}

struct CuratedSpecificationBlock: Codable, Hashable, Identifiable {
    let kind: String
    let lines: [String]?
    let level: Int?
    let text: String?
    let inlines: [CuratedSpecificationInline]?
    let number: Int?
    let figureLabel: String?
    let title: String?
    let description: [CuratedSpecificationInline]?
    let caption: String?
    let headers: [[CuratedSpecificationInline]]?
    let rows: [[[CuratedSpecificationInline]]]?

    var id: String {
        "\(kind)-\(number ?? -1)-\(figureLabel ?? "")-\(text ?? "")"
    }
}

struct CuratedSpecificationInline: Codable, Hashable, Identifiable {
    let kind: String
    let text: String
    let href: String?
    let referenceType: String?
    let label: String?
    let figurePreviews: [FigurePreview]?
    let definition: String?

    var id: String { "\(kind)-\(text)-\(href ?? "")" }
}

struct FigurePreview: Codable, Hashable, Identifiable {
    let src: String
    let alt: String
    let width: Int
    let height: Int

    var id: String { src }
    var bundlePath: String { src.hasPrefix("/") ? String(src.dropFirst()) : src }
}

struct PlainEnglish: Codable, Hashable {
    let overview: String
    let coreMechanism: String
    let mechanicalBreakdown: [MechanismSection]
    let scientificPrinciples: [ScientificPrinciple]
    let whyItMattersToday: String
}

struct MechanismSection: Codable, Hashable, Identifiable {
    let title: String
    let summary: String
    let technicalDetails: String
    let archaicTerm: String?
    let modernEquivalent: String?

    var id: String { title }
}

struct ScientificPrinciple: Codable, Hashable, Identifiable {
    let principle: String
    let formula: String?
    let explanation: String

    var id: String { principle }
}

struct PatentClaim: Codable, Hashable, Identifiable {
    let number: Int
    let isIndependent: Bool
    let dependsOn: [Int]?
    let originalText: String
    let plainEnglish: String
    let keyInnovations: [String]
    let legalSignificance: String?

    var id: Int { number }
}

struct PatentDrawing: Codable, Hashable, Identifiable {
    let figureNumber: String
    let title: String
    let caption: String
    let svgType: String
    let callouts: [DrawingCallout]

    var id: String { figureNumber }
}

struct DrawingCallout: Codable, Hashable, Identifiable {
    let id: String
    let figureRef: String
    let label: String
    let element: String
    let description: String
    let x: Double
    let y: Double
}

struct PatentHistory: Codable, Hashable {
    let problemStatement: String
    let priorArtLimitations: [String]
    let breakthroughInsight: String
    let patentWars: [PatentWar]
    let civilizationalImpact: String
    let funFact: String?
    let aftermath: String?
    let sideNotes: [String]?
}

struct PatentWar: Codable, Hashable, Identifiable {
    let rivalName: String
    let rivalClaim: String
    let conflictDetails: String
    let resolution: String
    let legalOutcome: String

    var id: String { rivalName }
}

struct PatentStats: Codable, Hashable {
    let totalClaims: Int
    let independentClaims: Int
    let patentWarYears: String?
    let impactScore: Int?
}

struct ColorizedEquation: Codable, Hashable, Identifiable {
    let id: String
    let patentId: String
    let title: String
    let category: String
    let rawLatex: String
    let colorizedLatex: String
    let plainEnglishSentence: [EquationSentenceFragment]
    let variables: [EquationVariable]
    let pedagogicalNote: String
    let claimRef: Int?
    let historicalSignificance: String?
}

struct EquationSentenceFragment: Codable, Hashable, Identifiable {
    let text: String
    let variableId: String?

    var id: String { "\(variableId ?? "text")-\(text)" }
}

struct EquationVariable: Codable, Hashable, Identifiable {
    let id: String
    let symbol: String
    let name: String
    let color: String
    let role: String
    let unit: String
    let dimension: String?
    let explanation: String
    let telemetryKey: String?
    let telemetryMetricLabel: String?
}

struct PatentPhysicsMetadata: Codable, Hashable {
    let domain: String
    let domainTitle: String
    let equationName: String
    let governingEquation: String
    let engineMethod: String
    let controls: [PhysicsControl]
    let pedagogicalInsight: String
}

struct PhysicsControl: Codable, Hashable, Identifiable {
    let id: String
    let label: String
    let min: Double
    let max: Double
    let step: Double
    let defaultValue: Double
    let unit: String
}
