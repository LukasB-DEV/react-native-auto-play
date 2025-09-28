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

    func templateApplicationDashboardScene(
        _ templateApplicationDashboardScene:
            CPTemplateApplicationDashboardScene,
        didConnect dashboardController: CPDashboardController,
        to window: UIWindow
    ) {
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
