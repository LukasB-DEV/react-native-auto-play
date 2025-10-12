//
//  AutoPlayInterfaceController.swift
//  Pods
//
//  Created by Manuel Auer on 12.10.25.
//

import CarPlay

@MainActor
class AutoPlayInterfaceController: NSObject, CPInterfaceControllerDelegate {
    let interfaceController: CPInterfaceController
    let templateStore: TemplateStore

    init(
        interfaceController: CPInterfaceController,
        templateStore: TemplateStore
    ) {
        self.interfaceController = interfaceController
        self.templateStore = templateStore

        super.init()

        self.interfaceController.delegate = self
    }

    var carTraitCollection: UITraitCollection {
        return interfaceController.carTraitCollection
    }

    var rootTemplate: CPTemplate {
        interfaceController.rootTemplate
    }

    var topTemplate: CPTemplate? {
        interfaceController.topTemplate
    }

    var templates: [CPTemplate] {
        interfaceController.templates
    }

    var topTemplateId: String? {
        guard
            let userInfo = interfaceController.topTemplate?.userInfo
                as? [String: Any]
        else {
            return nil
        }
        return userInfo["id"] as? String
    }

    var rootTemplateId: String? {
        guard
            let userInfo = interfaceController.rootTemplate.userInfo
                as? [String: Any]
        else {
            return nil
        }
        return userInfo["id"] as? String
    }

    func pushTemplate(
        _ templateToPush: CPTemplate,
        animated: Bool
    ) async throws -> Bool {
        return try await interfaceController.pushTemplate(
            templateToPush,
            animated: animated
        )
    }

    func setRootTemplate(
        _ rootTemplate: CPTemplate,
        animated: Bool
    ) async throws -> Bool {
        return try await interfaceController.setRootTemplate(
            rootTemplate,
            animated: animated
        )
    }

    func popTemplate(
        animated: Bool
    ) async throws -> String? {
        guard let templateId = topTemplateId else { return nil }

        try await interfaceController.popTemplate(
            animated: animated
        )

        self.templateStore.removeTemplate(templateId: templateId)

        return templateId
    }

    func popToRootTemplate(
        animated: Bool
    ) async throws -> [String] {
        var templateIds: [String] = []

        templates.forEach { template in
            guard let userInfo = template.userInfo as? [String: Any],
                let templateId = userInfo["id"] as? String
            else {
                return
            }
            if templateId == rootTemplateId {
                return
            }
            templateIds.append(templateId)
        }

        try await interfaceController.popToRootTemplate(
            animated: animated
        )

        self.templateStore.removeTemplates(templateIds: templateIds)

        return templateIds
    }

    func pop(to templateId: String, animated: Bool) async throws -> String? {
        guard
            let template = interfaceController.templates.first(
                where: {
                    templateId == ($0.userInfo as? [String: Any])?["id"]
                        as? String
                })
        else { return nil }

        try await interfaceController.pop(
            to: template,
            animated: animated
        )

        return templateId
    }

    func presentTemplate(
        _ templateToPresent: CPTemplate,
        animated: Bool
    ) async throws -> Bool {
        return try await interfaceController.presentTemplate(
            templateToPresent,
            animated: animated
        )
    }

    func dismissTemplate(
        animated: Bool
    ) async throws -> String? {
        guard let templateId = topTemplateId else { return nil }

        try await interfaceController.dismissTemplate(
            animated: animated
        )

        templateStore.removeTemplate(templateId: templateId)

        return templateId
    }

    // MARK: CPInterfaceControllerDelegate
    func templateWillAppear(
        _ aTemplate: CPTemplate,
        animated: Bool
    ) {
        HybridAutoPlay.emitTemplateState(
            template: aTemplate,
            templateState: .willappear,
            animated: animated
        )
    }

    func templateDidAppear(
        _ aTemplate: CPTemplate,
        animated: Bool
    ) {
        HybridAutoPlay.emitTemplateState(
            template: aTemplate,
            templateState: .didappear,
            animated: animated
        )
    }

    func templateWillDisappear(
        _ aTemplate: CPTemplate,
        animated: Bool
    ) {
        HybridAutoPlay.emitTemplateState(
            template: aTemplate,
            templateState: .willdisappear,
            animated: animated
        )
    }

    func templateDidDisappear(
        _ aTemplate: CPTemplate,
        animated: Bool
    ) {
        HybridAutoPlay.emitTemplateState(
            template: aTemplate,
            templateState: .diddisappear,
            animated: animated
        )
    }
}
