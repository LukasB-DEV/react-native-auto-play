package com.margelo.nitro.at.g4rb4g3.autoplay.hybrid

import com.margelo.nitro.at.g4rb4g3.autoplay.AndroidAutoSession
import com.margelo.nitro.at.g4rb4g3.autoplay.template.AndroidAutoTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.GridTemplate
import com.margelo.nitro.core.Promise

class HybridGridTemplate : HybridHybridGridTemplateSpec() {
    override fun createGridTemplate(config: GridTemplateConfig): Promise<Unit> {
        return Promise.async {
            val context = AndroidAutoSession.Companion.getRootContext()
                ?: throw IllegalArgumentException("createGridTemplate failed, carContext found")

            val template = GridTemplate(context, config)
            AndroidAutoTemplate.Companion.setTemplate(config.id, template)
        }
    }

    override fun updateGridTemplateButtons(
        templateId: String, buttons: Array<NitroGridButton>
    ): Promise<Unit> {
        return Promise.async {
            val template = AndroidAutoTemplate.Companion.getTemplate<GridTemplate>(templateId)
            template.updateButtons(buttons)
        }
    }
}