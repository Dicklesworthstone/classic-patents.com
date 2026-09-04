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

    func testAppStoreArchiveOverviewIsAppBound() {
        let app = launch(root: nil)
        assertExists(
            app.descendants(matching: .any)["archive-summary"],
            in: app,
            message: "The compact archive did not expose its current catalogue summary",
            screenshotName: "App Store 1 - 103-record offline archive"
        )
        XCTAssertFalse(
            app.staticTexts["FrankenRobots"].exists,
            "App-bound FrankenPatents evidence unexpectedly contained a FrankenRobots label"
        )
    }

    func testAppStoreTimelineOverviewRenders() {
        let app = launch(root: "timeline")
        assertExists(
            app.staticTexts["Over Two Centuries of Human Ingenuity (1769–2009)"],
            in: app,
            message: "The invention timeline overview did not render",
            screenshotName: "App Store 2 - two-century invention timeline"
        )
    }

    func testRegularWidthTimelineWorkstationKeepsBackNavigation() {
        let app = launch(root: nil)
        let timeline = app.buttons["Timeline"]
        XCTAssertTrue(timeline.waitForExistence(timeout: 12))
        timeline.tap()

        let openWorkstation = app.buttons["Open complete native patent workstation"]
        XCTAssertTrue(openWorkstation.waitForExistence(timeout: 12))
        openWorkstation.tap()

        XCTAssertTrue(
            app.navigationBars.buttons["Invention timeline"].waitForExistence(timeout: 12),
            "A workstation pushed from the regular-width timeline lost its native back route"
        )
    }

    func testAppStoreWrightPlainEnglishWorkstationRenders() {
        let app = launch(
            patentID: "us-821393-wright-flyer",
            section: "Plain English"
        )
        assertExists(
            app.staticTexts["Flying-Machine"],
            in: app,
            message: "The Wright Flyer plain-English workstation did not render",
            screenshotName: "App Store 3 - Wright Flyer engineering workstation"
        )
        let masthead = app.descendants(matching: .any)["frankenpatents-masthead"]
        let firstSection = app.buttons["Full Patent"]
        XCTAssertTrue(masthead.waitForExistence(timeout: 12), "The persistent museum masthead is missing")
        XCTAssertTrue(firstSection.waitForExistence(timeout: 12), "The first workstation section is missing")
        XCTAssertGreaterThanOrEqual(
            firstSection.frame.minY,
            masthead.frame.maxY - 1,
            "The first workstation row is hidden beneath the persistent masthead"
        )
    }

    func testLatestCatalogueDeltaRobotExhibitRenders() {
        let app = launch(
            patentID: "us-4976582-clavel-delta-robot",
            section: "Simulation"
        )
        assertExists(
            app.descendants(matching: .any)["patent-native-visualization"],
            in: app,
            message: "The newly merged Clavel Delta Robot native exhibit did not render",
            screenshotName: "Clavel Delta Robot native spatial exhibit"
        )
        XCTAssertFalse(
            app.descendants(matching: .any)["patent-native-model-load-error"].exists,
            "The Clavel route rendered the missing-model plaque instead of its bundled USDZ"
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
        defer { XCUIDevice.shared.orientation = .portrait }
        let windowFrame = waitForLandscapeWindow(in: app)
        let visualization = app.descendants(matching: .any)["patent-native-visualization"]
        XCTAssertTrue(
            visualization.waitForExistence(timeout: 12),
            "The native spatial exhibit did not survive a landscape transition"
        )

        // App-bound XCTest screenshots are mis-rotated by the iOS 26.1
        // Simulator after an in-test orientation change. Check the actual
        // accessibility geometry here; visual evidence is captured from the
        // explicitly addressed simulator framebuffer by the verification run.
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
            "-FrankenPatentsUITestSection", section
        ]
        app.launch()
        XCTAssertTrue(
            app.wait(for: .runningForeground, timeout: 8),
            "FrankenPatents did not remain in the foreground"
        )
        return app
    }

    @discardableResult
    private func launch(root: String?) -> XCUIApplication {
        let app = XCUIApplication()
        if let root {
            app.launchArguments = ["-FrankenPatentsUITestRoot", root]
        }
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

    private func waitForLandscapeWindow(in app: XCUIApplication) -> CGRect {
        var frame = app.windows.firstMatch.frame
        for orientation in [UIDeviceOrientation.landscapeLeft, .landscapeRight] {
            XCUIDevice.shared.orientation = orientation
            let deadline = Date().addingTimeInterval(3)
            repeat {
                RunLoop.current.run(until: Date().addingTimeInterval(0.15))
                frame = app.windows.firstMatch.frame
                if frame.width > frame.height { return frame }
            } while Date() < deadline
        }
        return frame
    }
}
