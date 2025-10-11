//
//  Template.swift
//  Pods
//
//  Created by Manuel Auer on 03.10.25.
//

import CarPlay

class Template: NSObject {
    let template: CPTemplate
    var barButtons: [NitroAction]?

    init(templateId: String, template: CPTemplate, header: [NitroAction]?) {
        template.userInfo = ["id": templateId]

        self.template = template
        self.barButtons = header
    }

    func setBarButtons() {
        guard let template = template as? CPBarButtonProviding else { return }

        if let actions = barButtons {
            let parsedActions = Parser.parseActions(actions: actions)

            template.backButton = parsedActions.backButton
            template.leadingNavigationBarButtons =
                parsedActions.leadingNavigationBarButtons
            template.trailingNavigationBarButtons =
                parsedActions.trailingNavigationBarButtons
        }
    }
    
    open func invalidate() {
        print("\(type(of: self)) lacks invalidate implementation")
    }
}
