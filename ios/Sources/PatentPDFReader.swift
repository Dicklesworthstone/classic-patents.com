import CryptoKit
import PDFKit
import SwiftUI

private final class FirstPartyPatentPDFSessionDelegate: NSObject, URLSessionTaskDelegate {
    func urlSession(
        _ session: URLSession,
        task: URLSessionTask,
        willPerformHTTPRedirection response: HTTPURLResponse,
        newRequest request: URLRequest,
        completionHandler: @escaping (URLRequest?) -> Void
    ) {
        completionHandler(request.url.map(PatentPDFStore.isAllowedPDFURL) == true ? request : nil)
    }
}

@MainActor
final class PatentPDFStore: ObservableObject {
    enum State {
        case idle
        case downloading(Double?)
        case ready(URL)
        case failed(String)
    }

    @Published private(set) var state: State = .idle
    private let sessionDelegate = FirstPartyPatentPDFSessionDelegate()
    private lazy var session: URLSession = {
        let configuration = URLSessionConfiguration.ephemeral
        configuration.requestCachePolicy = .reloadIgnoringLocalCacheData
        configuration.httpShouldSetCookies = false
        return URLSession(
            configuration: configuration,
            delegate: sessionDelegate,
            delegateQueue: nil
        )
    }()
    private var activePatentID: String?
    private var activeRequestToken: UUID?

    func load(patent: PatentRecord) async {
        if activePatentID == patent.id {
            if case .ready = state { return }
            if case .downloading = state { return }
        } else {
            activePatentID = patent.id
            activeRequestToken = nil
            state = .idle
        }
        let requestToken = UUID()
        activeRequestToken = requestToken
        guard let remoteURL = URL(string: patent.originalPdfURL),
              Self.isAllowedPDFURL(remoteURL),
              let expectedDigest = patent.expectedSourcePDFSHA256,
              Self.isCanonicalSHA256(expectedDigest) else {
            state = .failed("The source PDF address is invalid.")
            return
        }
        do {
            let destination = try cachedURL(for: patent)
            let cachedIsValid = await Task.detached(priority: .utility) {
                Self.isValidPDF(at: destination, expectedSHA256: expectedDigest)
            }.value
            guard ownsRequest(requestToken, patentID: patent.id) else { return }
            if cachedIsValid {
                state = .ready(destination)
                return
            }
            state = .downloading(nil)
            let (temporaryURL, response) = try await session.download(from: remoteURL)
            try Task.checkCancellation()
            guard let http = response as? HTTPURLResponse,
                  200..<300 ~= http.statusCode,
                  http.url.map(Self.isAllowedPDFURL) == true else {
                throw URLError(.badServerResponse)
            }
            if http.expectedContentLength > 500_000_000 {
                throw CocoaError(.fileReadTooLarge)
            }
            try await Task.detached(priority: .utility) {
                let values = try temporaryURL.resourceValues(forKeys: [.fileSizeKey])
                guard let fileSize = values.fileSize, fileSize >= 4, fileSize <= 500_000_000 else {
                    throw CocoaError(.fileReadTooLarge)
                }
                guard Self.isValidPDF(at: temporaryURL, expectedSHA256: expectedDigest) else {
                    throw CocoaError(.fileReadCorruptFile)
                }
                // Copy to a sibling staging URL, then publish atomically. An
                // interruption can never leave a partial file that a future
                // launch mistakes for a valid cached facsimile.
                let staging = destination
                    .deletingLastPathComponent()
                    .appendingPathComponent(".\(destination.lastPathComponent).\(UUID().uuidString).download")
                defer { try? FileManager.default.removeItem(at: staging) }
                try FileManager.default.copyItem(at: temporaryURL, to: staging)
                var resourceValues = URLResourceValues()
                resourceValues.isExcludedFromBackup = true
                var staged = staging
                try staged.setResourceValues(resourceValues)
                try Self.publishStagedPDF(
                    staging,
                    to: destination,
                    expectedSHA256: expectedDigest
                )
            }.value
            guard ownsRequest(requestToken, patentID: patent.id) else { return }
            state = .ready(destination)
        } catch {
            guard ownsRequest(requestToken, patentID: patent.id) else { return }
            if error is CancellationError
                || (error as? URLError)?.code == .cancelled {
                state = .idle
                return
            }
            state = .failed(error.localizedDescription)
        }
    }

    nonisolated static func isAllowedPDFURL(_ url: URL) -> Bool {
        url.scheme?.lowercased() == "https"
            && url.host?.lowercased() == "classic-patents.com"
            && (url.port == nil || url.port == 443)
            && url.path.hasPrefix("/patents/pdfs/")
            && url.pathExtension.lowercased() == "pdf"
            && url.user == nil
            && url.password == nil
    }

    func retry(patent: PatentRecord) async {
        activePatentID = patent.id
        activeRequestToken = nil
        state = .idle
        await load(patent: patent)
    }

    private func ownsRequest(_ token: UUID, patentID: String) -> Bool {
        activeRequestToken == token && activePatentID == patentID
    }

    private func cachedURL(for patent: PatentRecord) throws -> URL {
        let caches = try FileManager.default.url(
            for: .cachesDirectory,
            in: .userDomainMask,
            appropriateFor: nil,
            create: true
        )
        let directory = caches.appendingPathComponent("PatentFacsimiles", isDirectory: true)
        try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        return directory.appendingPathComponent("\(patent.id).pdf")
    }

    nonisolated static func isCanonicalSHA256(_ digest: String) -> Bool {
        digest.count == 64 && digest.allSatisfy { $0.isHexDigit }
    }

    nonisolated static func publishStagedPDF(
        _ staging: URL,
        to destination: URL,
        expectedSHA256: String,
        afterExistenceCheck: (Bool) -> Void = { _ in }
    ) throws {
        // The caller has already size-, header-, and digest-validated `staging`. Atomic rename or
        // replacement preserves those bytes, so the uncontended winner must not re-read a PDF that
        // can be hundreds of megabytes. Only a losing publisher validates the concurrent winner.
        let fileManager = FileManager.default
        let destinationExisted = fileManager.fileExists(atPath: destination.path)
        afterExistenceCheck(destinationExisted)
        do {
            if destinationExisted {
                _ = try fileManager.replaceItemAt(destination, withItemAt: staging)
            } else {
                try fileManager.moveItem(at: staging, to: destination)
            }
        } catch {
            // SAFETY: another scene may have won the same check-then-publish race. Accept only an
            // already-complete file with the exact reviewed digest; every other failure remains an
            // error. Publication is an atomic rename, so validation never observes partial bytes.
            guard isValidPDF(at: destination, expectedSHA256: expectedSHA256) else {
                throw error
            }
        }
    }

    nonisolated static func isValidPDF(at url: URL, expectedSHA256: String) -> Bool {
        guard FileManager.default.fileExists(atPath: url.path),
              let values = try? url.resourceValues(forKeys: [.fileSizeKey]),
              let fileSize = values.fileSize,
              fileSize >= 4,
              fileSize <= 500_000_000,
              let handle = try? FileHandle(forReadingFrom: url)
        else { return false }
        defer { try? handle.close() }
        guard (try? handle.read(upToCount: 4)) == Data("%PDF".utf8),
              (try? handle.seek(toOffset: 0)) != nil else { return false }

        var hasher = SHA256()
        do {
            while let chunk = try handle.read(upToCount: 1_048_576), !chunk.isEmpty {
                hasher.update(data: chunk)
            }
        } catch {
            return false
        }
        let actual = hasher.finalize().map { String(format: "%02x", $0) }.joined()
        return actual.caseInsensitiveCompare(expectedSHA256) == .orderedSame
    }
}

struct PatentPDFReader: View {
    let patent: PatentRecord
    @StateObject private var store = PatentPDFStore()
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Group {
                switch store.state {
                case .idle, .downloading:
                    VStack(spacing: 16) {
                        ProgressView().controlSize(.large).tint(Lab.brass)
                        Text("DOWNLOADING THE ORIGINAL FACSIMILE")
                            .font(.system(size: Lab.size(10.5), weight: .bold, design: .rounded))
                            .foregroundStyle(Lab.brass)
                        Text(facsimileDescription)
                            .font(.system(size: Lab.size(12), design: .rounded))
                            .foregroundStyle(Lab.secondary)
                            .multilineTextAlignment(.center)
                            .frame(maxWidth: 500)
                    }
                    .padding(24)
                case .ready(let url):
                    PDFKitView(url: url)
                case .failed(let message):
                    ContentUnavailableView {
                        Label("Facsimile unavailable", systemImage: "exclamationmark.triangle")
                    } description: {
                        Text(message)
                    } actions: {
                        Button("Try again") { Task { await store.retry(patent: patent) } }
                            .buttonStyle(.borderedProminent)
                            .tint(Lab.brass)
                    }
                }
            }
            .background(MuseumBackground())
            .navigationTitle(patent.patentNumber)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
                if case .ready(let url) = store.state {
                    ToolbarItem(placement: .primaryAction) {
                        ShareLink(item: url) { Label("Share PDF", systemImage: "square.and.arrow.up") }
                    }
                }
            }
        }
        .task(id: patent.id) { await store.load(patent: patent) }
    }

    private var facsimileDescription: String {
        if patent.sourceVisualization.isSourceBoundPDFOnly {
            return "This source-bound record intentionally provides the pinned facsimile without a bundled transcript, archival edition, visual model, controls, or quantitative metrics."
        }
        return "This PDF is the only museum material fetched from classic-patents.com. The catalog, edition, equations, figures, and simulations are bundled in the app."
    }
}

private struct PDFKitView: UIViewRepresentable {
    let url: URL

    func makeUIView(context: Context) -> PDFView {
        let view = PDFView()
        view.autoScales = true
        view.displayMode = .singlePageContinuous
        view.displayDirection = .vertical
        view.backgroundColor = UIColor(Lab.backgroundWarm)
        view.document = PDFDocument(url: url)
        return view
    }

    func updateUIView(_ view: PDFView, context: Context) {
        if view.document?.documentURL != url {
            view.document = PDFDocument(url: url)
        }
    }
}
