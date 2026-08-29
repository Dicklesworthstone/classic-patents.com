import CryptoKit
import Foundation

/// Hidden physical-device launch profiler for the native catalog path.
///
/// Set `FPAT_IOS_PROFILE=1` to benchmark the exact bundled JSON decoder and
/// current catalog-search predicate for 20+ repetitions. Ordinary launches pay
/// only the environment lookup in `runIfRequested`; no profile work or files are
/// created.
enum IOSProfileRunner {
    static func runIfRequested(
        catalogData: Data,
        loadedRecords: [PatentRecord],
        productLoadMilliseconds: Double
    ) {
        let environment = ProcessInfo.processInfo.environment
        guard environment["FPAT_IOS_PROFILE"] == "1" else { return }
        let requested = Int(environment["FPAT_IOS_PROFILE_RUNS"] ?? "20") ?? 20
        let runs = min(200, max(1, requested))
        let query = environment["FPAT_IOS_PROFILE_QUERY"] ?? "electric"

        do {
            let documents = try FileManager.default.url(
                for: .documentDirectory,
                in: .userDomainMask,
                appropriateFor: nil,
                create: true
            )
            let stamp = ISO8601DateFormatter().string(from: Date())
                .replacingOccurrences(of: ":", with: "-")
            let url = documents.appendingPathComponent("fpat-ios-profile-\(stamp).jsonl")
            guard FileManager.default.createFile(atPath: url.path, contents: nil) else { return }
            let handle = try FileHandle(forWritingTo: url)
            defer { try? handle.close() }

            try append([
                "event": "run_start",
                "schema_version": 1,
                "source_commit": environment["FPAT_IOS_PROFILE_SOURCE_SHA"] ?? "unreported",
                "runs": runs,
                "query": query,
                "catalog_bytes": catalogData.count,
                "catalog_sha256": sha256(catalogData),
                "product_load_ms": productLoadMilliseconds,
                "product_record_count": loadedRecords.count,
                "product_ids_sha256": idsDigest(loadedRecords),
                "device_model": deviceModel,
                "system": ProcessInfo.processInfo.operatingSystemVersionString,
                "active_processors": ProcessInfo.processInfo.activeProcessorCount,
                "physical_memory_bytes": ProcessInfo.processInfo.physicalMemory,
                "thermal_state": ProcessInfo.processInfo.thermalState.rawValue,
            ], to: handle)

            let normalized = query.trimmingCharacters(in: .whitespacesAndNewlines)
            var allDecodesIdentical = true
            var allSearchesIdentical = true
            let expectedIDs = idsDigest(loadedRecords)
            var firstSearchDigest: String?
            for index in 0..<runs {
                let decodeStarted = ContinuousClock.now
                let records = try JSONDecoder().decode([PatentRecord].self, from: catalogData)
                let decodeMS = milliseconds(since: decodeStarted)
                let decodedDigest = idsDigest(records)
                allDecodesIdentical = allDecodesIdentical && decodedDigest == expectedIDs

                let searchStarted = ContinuousClock.now
                let filtered = records.filter { patent in
                    guard !normalized.isEmpty else { return true }
                    return [
                        patent.patentNumber,
                        patent.title,
                        patent.shortTitle,
                        patent.subtitle,
                        patent.inventors.joined(separator: " "),
                        patent.summary,
                        patent.tags.joined(separator: " "),
                    ].contains { $0.localizedCaseInsensitiveContains(normalized) }
                }
                let searchMS = milliseconds(since: searchStarted)
                let searchDigest = idsDigest(filtered)
                if let firstSearchDigest {
                    allSearchesIdentical = allSearchesIdentical && searchDigest == firstSearchDigest
                } else {
                    firstSearchDigest = searchDigest
                }
                try append([
                    "event": "sample",
                    "index": index,
                    "decode_ms": decodeMS,
                    "decoded_records": records.count,
                    "decoded_ids_sha256": decodedDigest,
                    "decode_matches_product": decodedDigest == expectedIDs,
                    "search_ms": searchMS,
                    "search_results": filtered.count,
                    "search_ids_sha256": searchDigest,
                    "search_matches_first": searchDigest == firstSearchDigest,
                    "thermal_state": ProcessInfo.processInfo.thermalState.rawValue,
                ], to: handle)
            }
            try append([
                "event": "run_complete",
                "completed_runs": runs,
                "all_decodes_identical": allDecodesIdentical,
                "all_searches_identical": allSearchesIdentical,
                "receipt_path": url.path,
                "thermal_state": ProcessInfo.processInfo.thermalState.rawValue,
            ], to: handle)
            try handle.synchronize()
            print("FPAT_IOS_PROFILE_COMPLETE \(url.path)")
        } catch {
            print("FPAT_IOS_PROFILE_ERROR \(error.localizedDescription)")
        }
    }

    private static func append(_ object: [String: Any], to handle: FileHandle) throws {
        var data = try JSONSerialization.data(withJSONObject: object, options: [.sortedKeys])
        data.append(0x0A)
        try handle.write(contentsOf: data)
        print("FPAT_IOS_PROFILE \(String(decoding: data.dropLast(), as: UTF8.self))")
    }

    private static func idsDigest(_ records: [PatentRecord]) -> String {
        sha256(Data(records.map(\.id).joined(separator: "\n").utf8))
    }

    private static func sha256(_ data: Data) -> String {
        SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
    }

    private static func milliseconds(since start: ContinuousClock.Instant) -> Double {
        let duration = ContinuousClock.now - start
        return Double(duration.components.seconds) * 1_000
            + Double(duration.components.attoseconds) / 1_000_000_000_000_000
    }

    private static var deviceModel: String {
        var system = utsname()
        uname(&system)
        return withUnsafePointer(to: &system.machine) {
            $0.withMemoryRebound(to: CChar.self, capacity: 1) { String(cString: $0) }
        }
    }
}
