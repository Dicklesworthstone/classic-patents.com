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

    func testEveryNativeVisualizationCarriesAnExplicitFidelityContract() throws {
        let records = PatentLibrary().records

        XCTAssertEqual(records.count, 103)
        XCTAssertTrue(records.allSatisfy {
            !$0.sourceVisualization.nativeFidelityDisclosure.isEmpty
        })
        XCTAssertEqual(
            records.filter {
                $0.sourceVisualization.nativeFidelity == .authoredGeometryNativeMotionStudy
            }.count,
            101
        )

        let haber = try XCTUnwrap(records.first { $0.id == "us-971501-haber-ammonia" })
        XCTAssertEqual(haber.sourceVisualization.nativeFidelity, .sourceBoundNativeRelationship)
        XCTAssertTrue(haber.sourceVisualization.nativeFidelityDisclosure.contains("no apparatus drawing"))

        let kwolek = try XCTUnwrap(records.first { $0.id == "us-3671542-kwolek-kevlar" })
        XCTAssertEqual(kwolek.sourceVisualization.nativeFidelity, .sourceBoundFacsimileOnly)
        XCTAssertTrue(kwolek.sourceVisualization.nativeFidelityDisclosure.contains("facsimile"))
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

    func testOriginalGlossaryAndCitationFormatsAreAvailableOffline() throws {
        XCTAssertEqual(PatentReferenceLibrary.glossary.count, 8)
        XCTAssertEqual(
            PatentReferenceLibrary.filteredGlossary(query: "airfoil").map(\.term),
            ["Aeroplane"]
        )
        XCTAssertEqual(
            PatentReferenceLibrary.filteredGlossary(query: "letters").map(\.term),
            ["Letters Patent"]
        )

        let wright = try XCTUnwrap(PatentLibrary().records.first { $0.id == "us-821393-wright-flyer" })
        let bibtex = PatentCitationEngine.text(for: wright, format: .bibtex)
        XCTAssertTrue(bibtex.contains("@patent{us-821393-wright-flyer,"))
        XCTAssertTrue(bibtex.contains("author    = {Orville Wright and Wilbur Wright}"))
        XCTAssertTrue(bibtex.contains("year      = {1906}"))

        let ris = PatentCitationEngine.text(for: wright, format: .ris)
        XCTAssertTrue(ris.contains("AU  - Wright, Orville"))
        XCTAssertTrue(ris.contains("DA  - 1906/05/22"))
        XCTAssertTrue(ris.hasSuffix("ER  - "))

        XCTAssertEqual(
            PatentCitationEngine.text(for: wright, format: .chicago),
            "Wright, Orville, and Wilbur Wright. 1906. \"Flying-Machine.\" U.S. Patent US 821,393, filed March 23, 1903, and issued May 22, 1906. https://classic-patents.com/patents/us-821393-wright-flyer."
        )
        XCTAssertEqual(
            PatentCitationEngine.text(for: wright, format: .apa),
            "Orville Wright, Wilbur Wright. (1906). Flying-Machine (U.S. Patent No. US 821,393). U.S. Patent and Trademark Office. https://classic-patents.com/patents/us-821393-wright-flyer"
        )
        XCTAssertEqual(PatentCitationFormat.bibtex.filename(for: wright.id), "us-821393-wright-flyer.bib")
        XCTAssertEqual(PatentCitationFormat.ris.filename(for: wright.id), "us-821393-wright-flyer.ris")
    }
}
