import CryptoKit
import XCTest
@testable import FrankenPatents

final class PatentPDFStoreTests: XCTestCase {
    func testConcurrentMissingCachePublishAcceptsTheValidWinner() async throws {
        for round in 0..<10 {
            let directory = FileManager.default.temporaryDirectory
                .appendingPathComponent("FrankenPatents-publish-\(UUID().uuidString)", isDirectory: true)
            try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
            defer { try? FileManager.default.removeItem(at: directory) }

            let bytes = Data("%PDF forced publication race \(round)".utf8)
            let digest = SHA256.hash(data: bytes).map { String(format: "%02x", $0) }.joined()
            let destination = directory.appendingPathComponent("patent.pdf")
            let stagingURLs = (0..<2).map { directory.appendingPathComponent("staging-\($0).pdf") }
            for staging in stagingURLs { try bytes.write(to: staging, options: .atomic) }

            let bothObservedMissing = DispatchGroup()
            bothObservedMissing.enter()
            bothObservedMissing.enter()
            try await withThrowingTaskGroup(of: Void.self) { group in
                for staging in stagingURLs {
                    group.addTask {
                        try PatentPDFStore.publishStagedPDF(
                            staging,
                            to: destination,
                            expectedSHA256: digest
                        ) { destinationExisted in
                            XCTAssertFalse(destinationExisted)
                            bothObservedMissing.leave()
                            XCTAssertEqual(bothObservedMissing.wait(timeout: .now() + 1), .success)
                        }
                    }
                }
                try await group.waitForAll()
            }
            XCTAssertTrue(PatentPDFStore.isValidPDF(at: destination, expectedSHA256: digest))
        }
    }
}
