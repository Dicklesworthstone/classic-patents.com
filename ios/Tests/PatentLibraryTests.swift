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

    func testDeepLinksRouteWebAndNativeFacesWithoutFlatteningWorkstationSections() throws {
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "https://classic-patents.com/patents/us-821393-wright-flyer?view=interactive-sim"))),
            .patent(id: "us-821393-wright-flyer", section: .simulation, showsPDF: false)
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://patent/us-2981877-noyce-ic?section=equations"))),
            .patent(id: "us-2981877-noyce-ic", section: .equations, showsPDF: false)
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://patent/us-381968-tesla-motor#claims"))),
            .patent(id: "us-381968-tesla-motor", section: .claims, showsPDF: false)
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://patent/us-1219881-sundback-zipper?view=schematic-sheet"))),
            .patent(id: "us-1219881-sundback-zipper", section: .drawings, showsPDF: false)
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://patent/us-821393-wright-flyer?view=pdf-facsimile"))),
            .patent(id: "us-821393-wright-flyer", section: .specification, showsPDF: true)
        )
    }

    func testDeepLinksRouteSearchSavedTimelineAndRejectForeignHosts() throws {
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://search?q=alternating%20current"))),
            .archive(query: "alternating current")
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "frankenpatents://saved"))),
            .saved
        )
        XCTAssertEqual(
            PatentDeepLink(url: try XCTUnwrap(URL(string: "https://classic-patents.com/timeline"))),
            .timeline
        )
        XCTAssertNil(PatentDeepLink(url: try XCTUnwrap(URL(string: "https://example.com/patents/us-821393-wright-flyer"))))
    }
}
