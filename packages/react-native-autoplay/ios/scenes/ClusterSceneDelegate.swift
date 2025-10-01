//
//  ClusterScene.swift
//
//  Created by Manuel Auer on 28.09.25.
//

import CarPlay
import UIKit

@available(iOS 15.4, *)
@objc(ClusterSceneDelegate)
class ClusterSceneDelegate: UIResponder,
    CPTemplateApplicationInstrumentClusterSceneDelegate,
    CPInstrumentClusterControllerDelegate
{
    let clusterId: String
    var window: UIWindow?
    var initialProperties: [String: Any] = [:]

    override init() {
        self.clusterId = UUID().uuidString
        super.init()
    }

    func templateApplicationInstrumentClusterScene(
        _ templateApplicationInstrumentClusterScene:
            CPTemplateApplicationInstrumentClusterScene,
        didConnect instrumentClusterController: CPInstrumentClusterController
    ) {
        instrumentClusterController.delegate = self
        //        let contentStyle = templateApplicationInstrumentClusterScene
        //            .contentStyle
        //        RNCarPlay.connect(withInstrumentClusterController: instrumentClusterController,
        //                          contentStyle: contentStyle,
        //                          clusterId: clusterId)
    }

    func templateApplicationInstrumentClusterScene(
        _ templateApplicationInstrumentClusterScene:
            CPTemplateApplicationInstrumentClusterScene,
        didDisconnectInstrumentClusterController instrumentClusterController:
            CPInstrumentClusterController
    ) {
        //        RNCarPlay.disconnect(fromInstrumentClusterController: clusterId)
    }

    func instrumentClusterControllerDidConnect(
        _ instrumentClusterWindow: UIWindow
    ) {
        self.window = instrumentClusterWindow
        self.initialProperties = [
            "id": self.clusterId,
            "colorScheme": instrumentClusterWindow.screen.traitCollection
                .userInterfaceStyle == .dark ? "dark" : "light",
            "window": [
                "height": instrumentClusterWindow.screen.bounds.size.height,
                "width": instrumentClusterWindow.screen.bounds.size.width,
                "scale": instrumentClusterWindow.screen.scale,
            ],
        ]

        ViewUtils.showLaunchScreen(window: instrumentClusterWindow)
    }

    func instrumentClusterControllerDidDisconnectWindow(
        _ instrumentClusterWindow: UIWindow
    ) {
        self.window = nil
    }

    func contentStyleDidChange(_ contentStyle: UIUserInterfaceStyle) {
        //        RNCarPlay.clusterContentStyleDidChange(contentStyle, clusterId: clusterId)
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        //        RNCarPlay.clusterStateChanged(clusterId, isVisible: false)
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        //        RNCarPlay.clusterStateChanged(clusterId, isVisible: true)
    }
}
