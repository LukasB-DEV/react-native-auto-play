//
//  MapTemplate.swift
//  Pods
//
//  Created by Manuel Auer on 03.10.25.
//
import CarPlay

class MapTemplate: Template, CPMapTemplateDelegate {
    let config: NitroMapTemplateConfig

    init(config: NitroMapTemplateConfig) {
        self.config = config

        super.init(template: CPMapTemplate())

        self.template.userInfo = ["id": config.id]

        if let template = self.template as? CPMapTemplate {
            template.mapDelegate = self
        }
    }

    func mapTemplateDidBeginPanGesture(_ mapTemplate: CPMapTemplate) {

    }

    func mapTemplate(
        _ mapTemplate: CPMapTemplate,
        didUpdatePanGestureWithTranslation: CGPoint,
        velocity: CGPoint
    ) {
        config.onDidUpdatePanGestureWithTranslation?(
            Point(
                x: didUpdatePanGestureWithTranslation.x,
                y: didUpdatePanGestureWithTranslation.y
            ),
            Point(x: velocity.x, y: velocity.y)
        )
    }

    func mapTemplate(
        _ mapTemplate: CPMapTemplate,
        didEndPanGestureWithVelocity velocity: CGPoint
    ) {

    }
}
