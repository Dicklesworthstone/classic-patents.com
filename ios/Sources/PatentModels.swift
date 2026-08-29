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
    let exhibitURL: String
    let usptoClassification: String
    let originalText: String
    let plainEnglish: PlainEnglish
    let claims: [PatentClaim]
    let drawings: [PatentDrawing]
    let history: PatentHistory
    let tags: [String]
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
    let calloutCount: Int

    var id: String { figureNumber }
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

