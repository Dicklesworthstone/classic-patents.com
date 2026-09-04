import SwiftUI
import UIKit

@main
struct FrankenPatentsApp: App {
    var body: some Scene {
        WindowGroup {
            PatentRootView()
                .background(CatalystWindowFreedom())
#if targetEnvironment(macCatalyst)
                .frame(minWidth: 720, minHeight: 540)
#endif
        }
#if targetEnvironment(macCatalyst)
        .defaultSize(width: 1380, height: 900)
        .windowResizability(.contentMinSize)
#endif
        .commands {
            SidebarCommands()
            PatentTextSizeCommands()
        }
    }
}

private struct PatentTextSizeCommands: Commands {
    @AppStorage(Lab.textScaleStorageKey) private var textScale = Lab.defaultTextScale

    var body: some Commands {
        CommandMenu("Text Size") {
            Button("Larger Text") {
                textScale = Lab.adjustedTextScale(from: textScale, steps: 1)
            }
            .keyboardShortcut("+", modifiers: .command)
            .disabled(Lab.normalizedTextScale(textScale) >= Lab.maximumTextScale)

            Button("Smaller Text") {
                textScale = Lab.adjustedTextScale(from: textScale, steps: -1)
            }
            .keyboardShortcut("-", modifiers: .command)
            .disabled(Lab.normalizedTextScale(textScale) <= Lab.minimumTextScale)

            Button("Actual Size") {
                textScale = Lab.defaultTextScale
            }
            .keyboardShortcut("0", modifiers: .command)
            .disabled(Lab.normalizedTextScale(textScale) == Lab.defaultTextScale)
        }
    }
}

private struct CatalystWindowFreedom: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> Controller { Controller() }
    func updateUIViewController(_ controller: Controller, context: Context) { controller.configure() }

    final class Controller: UIViewController {
        override func viewDidAppear(_ animated: Bool) {
            super.viewDidAppear(animated)
            configure()
        }

        override func viewDidLayoutSubviews() {
            super.viewDidLayoutSubviews()
            configure()
        }

        func configure() {
#if targetEnvironment(macCatalyst)
            guard let restrictions = view.window?.windowScene?.sizeRestrictions else { return }
            restrictions.minimumSize = CGSize(width: 720, height: 540)
            restrictions.maximumSize = CGSize(width: 10_000, height: 10_000)
#endif
        }
    }
}
