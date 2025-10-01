//
//  DashboardSceneDelegate.swift
//
//  Created by Manuel Auer on 28.09.25.
//

import CarPlay
import UIKit

@objc(DashboardSceneDelegate)
class DashboardSceneDelegate: UIResponder,
    CPTemplateApplicationDashboardSceneDelegate
{
    let moduleName = "AutoPlayDashboard"
    var window: UIWindow?
    var initialProperties: [String: Any] = [:]

    func templateApplicationDashboardScene(
        _ templateApplicationDashboardScene:
            CPTemplateApplicationDashboardScene,
        didConnect dashboardController: CPDashboardController,
        to window: UIWindow
    ) {
        self.window = window
        self.initialProperties = [
            "id": self.moduleName,
            "colorScheme": window.screen.traitCollection
                .userInterfaceStyle == .dark ? "dark" : "light",
            "window": [
                "height": window.screen.bounds.size.height,
                "width": window.screen.bounds.size.width,
                "scale": window.screen.scale,
            ],
        ]

        ViewUtils.showLaunchScreen(window: window)
        // RNCarPlay.connect(withDashboardController: dashboardController, window: window)
    }

    func templateApplicationDashboardScene(
        _ templateApplicationDashboardScene:
            CPTemplateApplicationDashboardScene,
        didDisconnectDashboardController dashboardController:
            CPDashboardController,
        from window: UIWindow
    ) {
        // RNCarPlay.disconnectFromDashboardController()
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        // RNCarPlay.dashboardStateChanged(false)
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        // RNCarPlay.dashboardStateChanged(true)
    }
}
