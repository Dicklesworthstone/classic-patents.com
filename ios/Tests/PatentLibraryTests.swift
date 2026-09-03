import XCTest
@testable import FrankenPatents

@MainActor
final class PatentLibraryTests: XCTestCase {
    func testShippingCatalogueLoadsAllSourceBoundAndAuthoredRecords() {
        let library = PatentLibrary()

        XCTAssertNil(library.loadError)
        XCTAssertEqual(library.records.count, 103)
        XCTAssertTrue(library.records.contains { record in
            record.id == "us-3671542-kwolek-kevlar"
                && record.sourceVisualization.kind == .sourceBoundPDFOnly
        })
        XCTAssertTrue(library.records.contains { record in
            record.sourceVisualization.kind == .model
        })
    }
}
