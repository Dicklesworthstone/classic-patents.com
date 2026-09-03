import Foundation

@MainActor
final class PatentCollectionStore: ObservableObject {
    @Published private(set) var savedIDs: [String]
    @Published private(set) var recentIDs: [String]

    private let defaults: UserDefaults
    private let validIDs: Set<String>
    private static let savedKey = "frankenpatents.savedPatentIDs.v1"
    private static let recentKey = "frankenpatents.recentPatentIDs.v1"
    private static let recentLimit = 12

    init(validIDs: Set<String>, defaults: UserDefaults = .standard) {
        self.validIDs = validIDs
        self.defaults = defaults
        savedIDs = Self.normalized(
            defaults.stringArray(forKey: Self.savedKey) ?? [],
            validIDs: validIDs,
            limit: validIDs.count
        )
        recentIDs = Self.normalized(
            defaults.stringArray(forKey: Self.recentKey) ?? [],
            validIDs: validIDs,
            limit: Self.recentLimit
        )
        persist()
    }

    func isSaved(_ id: String) -> Bool {
        savedIDs.contains(id)
    }

    func toggleSaved(_ id: String) {
        guard validIDs.contains(id) else { return }
        if let index = savedIDs.firstIndex(of: id) {
            savedIDs.remove(at: index)
        } else {
            savedIDs.insert(id, at: 0)
        }
        persist()
    }

    func recordVisit(_ id: String) {
        guard validIDs.contains(id) else { return }
        recentIDs.removeAll(where: { $0 == id })
        recentIDs.insert(id, at: 0)
        if recentIDs.count > Self.recentLimit {
            recentIDs.removeLast(recentIDs.count - Self.recentLimit)
        }
        persist()
    }

    nonisolated static func normalized(
        _ ids: [String],
        validIDs: Set<String>,
        limit: Int
    ) -> [String] {
        guard limit > 0 else { return [] }
        var seen = Set<String>()
        return ids.filter { id in
            validIDs.contains(id) && seen.insert(id).inserted
        }
        .prefix(limit)
        .map(\.self)
    }

    private func persist() {
        defaults.set(savedIDs, forKey: Self.savedKey)
        defaults.set(recentIDs, forKey: Self.recentKey)
    }
}
