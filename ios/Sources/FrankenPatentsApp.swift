import SwiftUI
import UIKit

@main
struct FrankenPatentsApp: App {
    var body: some Scene {
        WindowGroup {
            PatentMuseumView()
                .preferredColorScheme(.dark)
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

