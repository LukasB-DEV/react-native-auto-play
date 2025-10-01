//
//  HeadunitSceneDelegate.swift
//
//  Created by Manuel Auer on 28.09.25.
//

import CarPlay
import Foundation
import React

@objc(HeadUnitSceneDelegate)
class HeadUnitSceneDelegate: UIResponder, CPTemplateApplicationSceneDelegate,
    AutoPlayScene
{
    var window: CPWindow?
    var interfaceController: CPInterfaceController?

    var initialProperties: [String: Any] = [:]
    let moduleName = "AutoPlayRoot"

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didConnect interfaceController: CPInterfaceController,
        to window: CPWindow
    ) {
        self.window = window
        self.interfaceController = interfaceController
        self.initialProperties = [
            "id": moduleName,
            "colorScheme": window.screen.traitCollection
                .userInterfaceStyle == .dark ? "dark" : "light",
            "window": [
                "height": window.bounds.size.height,
                "width": window.bounds.size.width,
                "scale": window.screen.scale,
            ],
        ]

        ViewUtils.showLaunchScreen(window: window)
        SceneStore.addScene(moduleName: moduleName, scene: self)
        
        HybridAutoPlay.emit(event: .didconnect)
    }

    func templateApplicationScene(
        _ templateApplicationScene: CPTemplateApplicationScene,
        didDisconnectInterfaceController interfaceController:
            CPInterfaceController
    ) {
        HybridAutoPlay.emit(event: .diddisconnect)
        SceneStore.removeScene(moduleName: moduleName)
    }

    func sceneWillResignActive(_ scene: UIScene) {
        HybridAutoPlay.emitTemplateState(
            templateId: moduleName,
            templateState: .willdisappear
        )
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        HybridAutoPlay.emitTemplateState(
            templateId: moduleName,
            templateState: .diddisappear
        )
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        HybridAutoPlay.emitTemplateState(
            templateId: moduleName,
            templateState: .willappear
        )
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        HybridAutoPlay.emitTemplateState(
            templateId: moduleName,
            templateState: .didappear
        )
    }

    func setRootTemplate() {
        DispatchQueue.main.async {
            guard let window = self.window else {
                return
            }
            
            guard
                let rootView = ViewUtils.getRootView(
                    moduleName: self.moduleName,
                    initialProps: self.initialProperties
                )
            else { return }
            
            window.rootViewController = CarPlayViewController(view: rootView)
            window.makeKeyAndVisible()
        }
    }
}
