//
//  HeadunitSceneDelegate.swift
//
//  Created by Manuel Auer on 28.09.25.
//

import CarPlay
import Foundation

@objc(HeadUnitSceneDelegate)
class HeadUnitSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate {

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        // RNCarPlay.connect(withInterfaceController: interfaceController, window: templateApplicationScene.carWindow)
    }

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didDisconnectInterfaceController interfaceController:
            CPInterfaceController
    ) {
        // RNCarPlay.disconnect()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // RNCarPlay.stateChanged(false)
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // RNCarPlay.stateChanged(true)
    }
}
