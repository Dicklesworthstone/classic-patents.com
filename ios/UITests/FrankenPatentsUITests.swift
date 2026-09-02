import XCTest

final class FrankenPatentsUITests: XCTestCase {
    override func setUpWithError() throws {
        continueAfterFailure = false
        // This suite has a dedicated Simulator. Reset orientation before every
        // launch so a failed rotation test cannot contaminate the next test or
        // leave a peer task's device in an unexpected state.
        XCUIDevice.shared.orientation = .portrait
        Thread.sleep(forTimeInterval: 0.25)
    }

    func testNewCatalogueSpatialExhibitRenders() {
        let app = launch(
            patentID: "us-1219881-sundback-zipper",
            section: "Simulation"
        )
        assertExists(
            app.descendants(matching: .any)["patent-native-visualization"],
            in: app,
            message: "The newly exported Sundback native exhibit did not render",
            screenshotName: "Sundback native spatial exhibit"
        )
    }

    func testNativeEquationAtlasRenders() {
        let app = launch(
            patentID: "us-3260375-lemelson-adjustable-manipulator",
            section: "Equations"
        )
        assertExists(
            app.descendants(matching: .any)["patent-equation-atlas-heading"],
            in: app,
            message: "The native equation atlas did not render",
            screenshotName: "Native colored equation atlas"
        )
    }

    func testQuarantinedSourceBoundaryIsExplicit() {
        let app = launch(
            patentID: "gb-931-arkwright-water-frame",
            section: "Full Patent"
        )
        assertExists(
            app.staticTexts["Primary-source edition quarantined"],
            in: app,
            message: "A quarantined reconstruction must render its explicit source boundary",
            screenshotName: "Explicit archival quarantine boundary"
        )
        XCTAssertFalse(app.staticTexts["Bundled transcription unavailable"].exists)
    }

    func testSpatialExhibitAdaptsToLandscape() {
        let app = launch(
            patentID: "us-1219881-sundback-zipper",
            section: "Simulation"
        )
        XCUIDevice.shared.orientation = .landscapeLeft
        defer { XCUIDevice.shared.orientation = .portrait }
        Thread.sleep(forTimeInterval: 0.85)
        let visualization = app.descendants(matching: .any)["patent-native-visualization"]
        XCTAssertTrue(
            visualization.waitForExistence(timeout: 12),
            "The native spatial exhibit did not survive a landscape transition"
        )

        // App-bound XCTest screenshots are mis-rotated by the iOS 26.1
        // Simulator after an in-test orientation change. Check the actual
        // accessibility geometry here; visual evidence is captured from the
        // explicitly addressed simulator framebuffer by the verification run.
        let windowFrame = app.windows.firstMatch.frame
        XCTAssertGreaterThan(windowFrame.width, windowFrame.height)
        assertHorizontallyContained(visualization, in: windowFrame, name: "native visualization")
        assertHorizontallyContained(app.buttons["Pause"], in: windowFrame, name: "animation control")
        // The compact-width control deliberately shortens its label to
        // "Plate"; regular-width layouts use the full "Source Plate" label.
        let sourcePlate = app.buttons["Source Plate"].exists
            ? app.buttons["Source Plate"]
            : app.buttons["Plate"]
        assertHorizontallyContained(sourcePlate, in: windowFrame, name: "projection control")
    }

    @discardableResult
    private func launch(patentID: String, section: String) -> XCUIApplication {
        let app = XCUIApplication()
        app.launchArguments = [
            "-FrankenPatentsUITestPatent", patentID,
            "-FrankenPatentsUITestSection", section,
        ]
        app.launch()
        XCTAssertTrue(
            app.wait(for: .runningForeground, timeout: 8),
            "FrankenPatents did not remain in the foreground"
        )
        return app
    }

    private func assertExists(
        _ element: XCUIElement,
        in app: XCUIApplication,
        message: String,
        screenshotName: String
    ) {
        let exists = element.waitForExistence(timeout: 12)
        // `runningForeground` and element existence can both become true
        // while SpringBoard is still completing the cross-app launch
        // animation. Let the compositor settle so retained visual evidence is
        // a faithful frame of the shipping UI rather than a transition blend.
        if exists { Thread.sleep(forTimeInterval: 0.65) }
        attachScreenshot(of: app, named: screenshotName)
        XCTAssertTrue(exists, message)
    }

    private func attachScreenshot(of app: XCUIApplication, named name: String) {
        // XCUIScreen.main can resolve to a different booted Simulator when
        // Xcode is driving an iPhone and iPad concurrently. Capture the tested
        // application itself so retained evidence cannot silently show a peer
        // app from another visible Simulator window.
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    private func assertHorizontallyContained(_ element: XCUIElement, in window: CGRect, name: String) {
        XCTAssertTrue(element.exists, "The \(name) is missing")
        let frame = element.frame
        XCTAssertGreaterThanOrEqual(frame.minX, window.minX - 1, "The \(name) overflows left")
        XCTAssertLessThanOrEqual(frame.maxX, window.maxX + 1, "The \(name) overflows right")
    }
}
