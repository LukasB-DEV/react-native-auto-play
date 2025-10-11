//
//  ListTemplate.swift
//  Pods
//
//  Created by Manuel Auer on 08.10.25.
//

import CarPlay

class ListTemplate: Template {
    var config: NitroListTemplateConfig

    init(config: NitroListTemplateConfig) {
        self.config = config

        let template = CPListTemplate(
            title: Parser.parseText(text: config.title),
            sections: []
        )

        super.init(
            templateId: config.id,
            template: template,
            header: config.actions
        )

        invalidate()
    }

    override func invalidate() {
        guard let template = self.template as? CPListTemplate else {
            return
        }

        setBarButtons()

        template.updateSections(
            Parser.parseSections(
                sections: config.sections,
                updateSection: self.updateSection(section:sectionIndex:)
            )
        )
    }

    func updateSection(section: NitroSection, sectionIndex: Int) {
        config.sections?[sectionIndex] = section
        invalidate()
    }
}
