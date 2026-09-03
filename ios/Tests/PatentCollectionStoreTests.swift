import XCTest
@testable import FrankenPatents

final class PatentCollectionStoreTests: XCTestCase {
    func testNormalizationRejectsUnknownAndDuplicateIDsWhilePreservingOrder() {
        XCTAssertEqual(
            PatentCollectionStore.normalized(
                ["tesla", "unknown", "tesla", "bell", "edison"],
                validIDs: ["tesla", "bell", "edison"],
                limit: 2
            ),
            ["tesla", "bell"]
        )
    }

    func testNormalizationFailsClosedForNonpositiveLimit() {
        XCTAssertEqual(
            PatentCollectionStore.normalized(["tesla"], validIDs: ["tesla"], limit: 0),
            []
        )
    }
}
