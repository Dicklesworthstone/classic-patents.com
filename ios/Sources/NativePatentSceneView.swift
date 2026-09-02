import SceneKit
import SwiftUI

/// Metal-backed presentation of the exact procedural model authored for the
/// website. The export step executes each Three.js model builder and packages
/// its geometry and materials as USDZ; this view never loads network content or
/// hosts a browser runtime.
struct NativePatentSceneView: View {
    let patent: PatentRecord
    let drive: Double
    let isRunning: Bool
    @State private var resetToken = 0
    @State private var isPrepared = false

    var body: some View {
        ZStack {
            PatentSceneRepresentable(
                patentID: patent.id,
                drive: drive,
                isRunning: isRunning,
                resetToken: resetToken,
                isPrepared: $isPrepared
            )

            if !isPrepared {
                VStack(spacing: 11) {
                    ProgressView()
                        .controlSize(.large)
                        .tint(Lab.brass)
                    Text("Preparing the bundled authored model")
                        .font(.system(size: Lab.size(13), weight: .bold, design: .rounded))
                        .foregroundStyle(Lab.parchment)
                    Text("Compiling this exhibit's geometry and Metal materials off the UI thread…")
                        .font(.system(size: Lab.size(10.5), design: .rounded))
                        .foregroundStyle(Lab.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(22)
                .frame(maxWidth: 360)
                .background(.black.opacity(0.82), in: RoundedRectangle(cornerRadius: 18))
                .overlay(RoundedRectangle(cornerRadius: 18).stroke(Lab.brass.opacity(0.35)))
                .allowsHitTesting(false)
            }

            VStack {
                HStack(alignment: .top) {
                    Label("BUNDLED AUTHORED MODEL · METAL 3D", systemImage: "cube.transparent")
                        .font(.system(size: 8.5, weight: .black, design: .rounded))
                        .foregroundStyle(.black)
                        .padding(.horizontal, 9)
                        .padding(.vertical, 6)
                        .background(Lab.brass, in: Capsule())
                        .allowsHitTesting(false)
                    Spacer()
                    Button {
                        resetToken &+= 1
                    } label: {
                        Image(systemName: "view.3d")
                            .font(.system(size: 13, weight: .bold))
                            .frame(width: 36, height: 36)
                    }
                    .buttonStyle(.plain)
                    .foregroundStyle(Lab.parchment)
                    .background(.black.opacity(0.62), in: Circle())
                    .overlay(Circle().stroke(Lab.brass.opacity(0.5)))
                    .accessibilityLabel("Reset 3D camera")
                }
                Spacer()
                HStack {
                    Label("Drag to orbit · pinch to zoom", systemImage: "hand.draw")
                        .font(.system(size: 9.5, weight: .semibold, design: .rounded))
                        .foregroundStyle(Lab.parchment.opacity(0.88))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 7)
                        .background(.black.opacity(0.58), in: Capsule())
                        .allowsHitTesting(false)
                    Spacer()
                }
            }
            .padding(11)
        }
        .background(Color.black)
        .accessibilityElement(children: .contain)
        .accessibilityLabel("Interactive three dimensional model of \(patent.shortTitle)")
        .onChange(of: patent.id) { _, _ in isPrepared = false }
    }
}

/// The Haber grant is the sole catalog entry whose website intentionally
/// refuses a 3D apparatus: the patent says "No Drawing" and an industrial
/// recycle loop would be later art. Resolve that route explicitly with its
/// live chemistry state instead of manufacturing archival geometry.
struct NativeSourceBoundaryExhibit: View {
    let patent: PatentRecord
    let drive: Double

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top, spacing: 14) {
                Image(systemName: "exclamationmark.shield.fill")
                    .font(.system(size: 28))
                    .foregroundStyle(Lab.brass)
                VStack(alignment: .leading, spacing: 5) {
                    Text("No apparatus drawing exists in US 971,501")
                        .font(.system(size: Lab.size(17), weight: .bold, design: .serif))
                        .foregroundStyle(Lab.parchment)
                    Text("The web exhibit deliberately withholds its later industrial process-loop model. This native view preserves that source boundary and visualizes only the patent's stated pressure, temperature, catalyst, and equilibrium relationship.")
                        .font(.system(size: Lab.size(11.5), design: .rounded))
                        .foregroundStyle(Lab.secondary)
                        .textSelection(.enabled)
                }
            }

            Canvas { context, size in
                let midY = size.height * 0.52
                var path = Path()
                path.move(to: CGPoint(x: size.width * 0.10, y: midY))
                path.addLine(to: CGPoint(x: size.width * 0.90, y: midY))
                context.stroke(path, with: .linearGradient(
                    Gradient(colors: [Lab.blueprint, Lab.brass, Lab.emerald]),
                    startPoint: CGPoint(x: size.width * 0.10, y: midY),
                    endPoint: CGPoint(x: size.width * 0.90, y: midY)
                ), style: StrokeStyle(lineWidth: 3, dash: [8, 7]))

                let labels = ["N₂ + 3H₂", "Os catalyst", "2NH₃"]
                for (index, label) in labels.enumerated() {
                    let x = size.width * (0.16 + CGFloat(index) * 0.34)
                    let radius: CGFloat = 28 + (index == 1 ? CGFloat(drive) * 8 : 0)
                    context.fill(
                        Path(ellipseIn: CGRect(x: x - radius, y: midY - radius, width: radius * 2, height: radius * 2)),
                        with: .color(index == 0 ? Lab.blueprint.opacity(0.75) : index == 1 ? Lab.brass.opacity(0.82) : Lab.emerald.opacity(0.78))
                    )
                    context.draw(
                        Text(label).font(.system(size: 11, weight: .bold, design: .rounded)).foregroundColor(.black),
                        at: CGPoint(x: x, y: midY)
                    )
                }
            }
            .frame(height: 170)
            .background(Lab.panelStrong, in: RoundedRectangle(cornerRadius: 14))
            .overlay(RoundedRectangle(cornerRadius: 14).stroke(Lab.brass.opacity(0.28)))
        }
        .padding(18)
    }
}

private struct PatentSceneRepresentable: UIViewRepresentable {
    let patentID: String
    let drive: Double
    let isRunning: Bool
    let resetToken: Int
    @Binding var isPrepared: Bool

    func makeCoordinator() -> Coordinator { Coordinator(isPrepared: $isPrepared) }

    func makeUIView(context: Context) -> SCNView {
        // The option-key initializer is not exposed by Mac Catalyst even
        // though SceneKit still selects its Metal renderer there. Using the
        // portable initializer keeps one genuinely native view on iPhone,
        // iPad, and Mac instead of introducing a Catalyst-only substitute.
        let view = SCNView(frame: .zero)
        view.backgroundColor = UIColor(red: 0.018, green: 0.031, blue: 0.035, alpha: 1)
        view.antialiasingMode = SCNAntialiasingMode.multisampling4X
        view.rendersContinuously = true
        view.preferredFramesPerSecond = 60
        view.allowsCameraControl = true
        #if !targetEnvironment(macCatalyst)
        view.defaultCameraController.interactionMode = SCNInteractionMode.orbitTurntable
        #endif
        view.defaultCameraController.inertiaEnabled = true
        view.autoenablesDefaultLighting = false
        context.coordinator.install(patentID: patentID, in: view)
        context.coordinator.update(drive: drive, isRunning: isRunning, in: view)
        return view
    }

    func updateUIView(_ view: SCNView, context: Context) {
        if context.coordinator.patentID != patentID {
            context.coordinator.install(patentID: patentID, in: view)
        }
        if context.coordinator.resetToken != resetToken {
            context.coordinator.resetToken = resetToken
            context.coordinator.resetCamera(in: view, animated: true)
        }
        context.coordinator.update(drive: drive, isRunning: isRunning, in: view)
    }

    final class Coordinator: NSObject {
        var patentID: String?
        var resetToken = 0
        private weak var modelRoot: SCNNode?
        private var animatedNodes: [SCNNode] = []
        private var cameraHome = SCNVector3(5.8, 3.5, 7.6)
        private let isPrepared: Binding<Bool>

        init(isPrepared: Binding<Bool>) {
            self.isPrepared = isPrepared
        }

        func install(patentID: String, in view: SCNView) {
            self.patentID = patentID
            animatedNodes = []
            isPrepared.wrappedValue = false
            let scene = SCNScene()
            view.scene = scene

            let model = SCNNode()
            model.name = "NativePatentModel"
            if let url = modelURL(for: patentID), let imported = try? SCNScene(url: url) {
                for child in imported.rootNode.childNodes {
                    model.addChildNode(child.clone())
                }
            } else {
                model.addChildNode(errorPlaque())
            }
            normalize(model)
            scene.rootNode.addChildNode(model)
            modelRoot = model

            addCamera(to: scene)
            addLighting(to: scene)
            addFloor(to: scene)
            installKinematics(in: model)
            resetCamera(in: view, animated: false)

            // A few exhibits contain thousands of authored meshes. Ask the
            // SCNView that owns the live scene to prepare those resources
            // asynchronously. SceneKit scene graphs are not Sendable: using a
            // second SCNRenderer on a global queue races the view's render and
            // animation mutations against traversal of the same nodes.
            let expectedPatentID = patentID
            view.prepare([scene]) { [weak self, weak view] _ in
                DispatchQueue.main.async {
                    guard let self,
                          let view,
                          self.patentID == expectedPatentID,
                          view.scene === scene else { return }
                    self.isPrepared.wrappedValue = true
                }
            }
        }

        func update(drive: Double, isRunning: Bool, in view: SCNView) {
            let normalized = min(1, max(0, drive))
            let speed = CGFloat(isRunning ? 0.28 + normalized * 1.9 : 0)
            for node in animatedNodes {
                for key in node.actionKeys {
                    node.action(forKey: key)?.speed = speed
                }
            }
            view.isPlaying = isRunning
        }

        func resetCamera(in view: SCNView, animated: Bool) {
            guard let camera = view.scene?.rootNode.childNode(withName: "MuseumCamera", recursively: true) else { return }
            let changes = {
                camera.position = self.cameraHome
                camera.look(at: SCNVector3(0, 0.15, 0))
                view.pointOfView = camera
            }
            if animated { SCNTransaction.animationDuration = 0.32 }
            changes()
            SCNTransaction.animationDuration = 0
        }

        private func modelURL(for patentID: String) -> URL? {
            Bundle.main.url(forResource: patentID, withExtension: "usdz", subdirectory: "NativeModels")
                ?? Bundle.main.url(forResource: patentID, withExtension: "usdz")
        }

        private func normalize(_ node: SCNNode) {
            let (minimum, maximum) = node.boundingBox
            let center = SCNVector3(
                (minimum.x + maximum.x) * 0.5,
                (minimum.y + maximum.y) * 0.5,
                (minimum.z + maximum.z) * 0.5
            )
            let extent = max(maximum.x - minimum.x, max(maximum.y - minimum.y, maximum.z - minimum.z))
            guard extent.isFinite, extent > 0.000_1 else { return }
            node.pivot = SCNMatrix4MakeTranslation(center.x, center.y, center.z)
            let scale = 7.0 / extent
            node.scale = SCNVector3(scale, scale, scale)
        }

        private func addCamera(to scene: SCNScene) {
            let camera = SCNNode()
            camera.name = "MuseumCamera"
            camera.camera = SCNCamera()
            camera.camera?.fieldOfView = 42
            camera.camera?.zNear = 0.01
            camera.camera?.zFar = 1_000
            camera.position = cameraHome
            camera.look(at: SCNVector3(0, 0.15, 0))
            scene.rootNode.addChildNode(camera)
        }

        private func addLighting(to scene: SCNScene) {
            let key = SCNNode()
            key.light = SCNLight()
            key.light?.type = .omni
            key.light?.intensity = 980
            key.light?.temperature = 5_100
            key.position = SCNVector3(4, 6, 7)
            scene.rootNode.addChildNode(key)

            let rim = SCNNode()
            rim.light = SCNLight()
            rim.light?.type = .omni
            rim.light?.color = UIColor(red: 0.20, green: 0.74, blue: 0.92, alpha: 1)
            rim.light?.intensity = 560
            rim.position = SCNVector3(-5, 3, -5)
            scene.rootNode.addChildNode(rim)

            let ambient = SCNNode()
            ambient.light = SCNLight()
            ambient.light?.type = .ambient
            ambient.light?.color = UIColor(white: 0.32, alpha: 1)
            ambient.light?.intensity = 300
            scene.rootNode.addChildNode(ambient)
        }

        private func addFloor(to scene: SCNScene) {
            let floor = SCNNode(geometry: SCNFloor())
            floor.name = "MuseumFloor"
            floor.geometry?.firstMaterial?.diffuse.contents = UIColor(red: 0.015, green: 0.025, blue: 0.028, alpha: 1)
            floor.geometry?.firstMaterial?.roughness.contents = 0.7
            floor.geometry?.firstMaterial?.metalness.contents = 0.22
            floor.position.y = -3.55
            scene.rootNode.addChildNode(floor)
        }

        private func installKinematics(in root: SCNNode) {
            var animatedNodeCount = 0
            root.enumerateChildNodes { node, _ in
                let name = (node.name ?? "").lowercased()
                if self.matches(name, tokens: ["wheel", "rotor", "shaft", "gear", "crank", "dialhand", "propeller", "turbine", "mandrel", "fan", "drum"]) {
                    let action = SCNAction.repeatForever(.rotateBy(x: 0, y: .pi * 2, z: 0, duration: 2.2))
                    node.runAction(action, forKey: "native-rotary-drive")
                    self.animatedNodes.append(node)
                    animatedNodeCount += 1
                } else if self.matches(name, tokens: ["piston", "plunger", "shuttle", "needle", "press", "hammer", "carriage"]) {
                    let amplitude: CGFloat = 0.08
                    let out = SCNAction.moveBy(x: 0, y: amplitude, z: 0, duration: 0.48)
                    node.runAction(.repeatForever(.sequence([out, out.reversed()])), forKey: "native-reciprocating-drive")
                    self.animatedNodes.append(node)
                    animatedNodeCount += 1
                }
            }
            if animatedNodeCount == 0 {
                root.runAction(
                    .repeatForever(.rotateBy(x: 0, y: .pi * 2, z: 0, duration: 18)),
                    forKey: "native-study-orbit"
                )
                animatedNodes.append(root)
            }
        }

        private func matches(_ value: String, tokens: [String]) -> Bool {
            tokens.contains(where: value.contains)
        }

        private func errorPlaque() -> SCNNode {
            let box = SCNBox(width: 4.8, height: 2.4, length: 0.18, chamferRadius: 0.12)
            box.firstMaterial?.diffuse.contents = UIColor(red: 0.18, green: 0.05, blue: 0.04, alpha: 1)
            return SCNNode(geometry: box)
        }
    }
}

private extension SCNNode {
    func look(at target: SCNVector3) {
        look(at: target, up: SCNVector3(0, 1, 0), localFront: SCNVector3(0, 0, -1))
    }
}
