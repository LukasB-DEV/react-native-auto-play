//
//  GridTemplate.swift
//  Pods
//
//  Created by Manuel Auer on 11.10.25.
//

import CarPlay

class GridTemplate: AutoPlayTemplate {
    var config: GridTemplateConfig

    init(config: GridTemplateConfig) {
        self.config = config

        let template = CPGridTemplate(
            title: Parser.parseText(text: config.title),
            gridButtons: [],
            id: config.id
        )

        super.init(
            template: template,
            header: config.headerActions
        )

        invalidate()
    }

    override func invalidate() {
        guard let template = self.template as? CPGridTemplate else {
            return
        }

        setBarButtons()
        let gridButtonHeight: CGFloat
        if #available(iOS 26.0, *) {
            gridButtonHeight = CPGridTemplate.maximumGridButtonImageSize.height
        } else {
            gridButtonHeight = 44
        }

        let buttons = config.buttons.map { button in
            CPGridButton(
                titleVariants: [Parser.parseText(text: button.title)!],
                image: SymbolFont.imageFromNitroImage(
                    image: button.image,
                    size: gridButtonHeight,
                    traitCollection: SceneStore.getRootTraitCollection()
                )!
            ) { _ in
                button.onPress()
            }
        }

        template.updateGridButtons(buttons)
    }

    override func onWillAppear(animated: Bool) {
        config.onWillAppear?(animated)
    }

    override func onDidAppear(animated: Bool) {
        config.onDidAppear?(animated)
    }

    override func onWillDisappear(animated: Bool) {
        config.onWillDisappear?(animated)
    }

    override func onDidDisappear(animated: Bool) {
        config.onDidDisappear?(animated)
    }

    override func onPopped() {
        config.onPopped?()
    }

    func updateButtons(buttons: [NitroGridButton]) {
        config.buttons = buttons
        invalidate()
    }
}
