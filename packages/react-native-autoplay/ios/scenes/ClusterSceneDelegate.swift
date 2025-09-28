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
    CPTemplateApplicationInstrumentClusterSceneDelegate
{

    let clusterId: String

    override init() {
        self.clusterId = UUID().uuidString
        super.init()
    }

    func templateApplicationInstrumentClusterScene(
        _ templateApplicationInstrumentClusterScene:
            CPTemplateApplicationInstrumentClusterScene,
        didConnect instrumentClusterController: CPInstrumentClusterController
    ) {
        let contentStyle = templateApplicationInstrumentClusterScene
            .contentStyle
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
