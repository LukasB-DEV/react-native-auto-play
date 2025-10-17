//
//  HybridListTemplate.swift
//  Pods
//
//  Created by Manuel Auer on 15.10.25.
//

class HybridMessageTemplate: HybridHybridMessageTemplateSpec {
    func createMessageTemplate(config: MessageTemplateConfig) throws {
        let template = MessageTemplate(config: config)
        try RootModule.withScene { scene in
            scene.templateStore.addTemplate(
                template: template,
                templateId: config.id,
            )
        }
    }
}
