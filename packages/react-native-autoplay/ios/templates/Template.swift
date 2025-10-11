//
//  Template.swift
//  Pods
//
//  Created by Manuel Auer on 03.10.25.
//

import CarPlay

class Template: NSObject {
    let template: CPTemplate
    var header: [NitroAction]?

    init(templateId: String, template: CPTemplate, header: [NitroAction]?) {
        template.userInfo = ["id": templateId]

        self.template = template
        self.header = header
    }

    func setBarButtons() {
        guard let template = template as? CPBarButtonProviding else { return }

        if let actions = header {
            let parsedActions = Parser.parseActions(actions: actions)

            template.backButton = parsedActions.backButton
            template.leadingNavigationBarButtons =
                parsedActions.leadingNavigationBarButtons
            template.trailingNavigationBarButtons =
                parsedActions.trailingNavigationBarButtons
        }
    }
}
