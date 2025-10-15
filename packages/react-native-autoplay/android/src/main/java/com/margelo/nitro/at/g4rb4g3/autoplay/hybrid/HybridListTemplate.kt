package com.margelo.nitro.at.g4rb4g3.autoplay.hybrid

import com.margelo.nitro.at.g4rb4g3.autoplay.AndroidAutoSession
import com.margelo.nitro.at.g4rb4g3.autoplay.template.AndroidAutoTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.ListTemplate

class HybridListTemplate : HybridHybridListTemplateSpec() {

    override fun createListTemplate(config: ListTemplateConfig) {
        val context = AndroidAutoSession.Companion.getRootContext()
            ?: throw IllegalArgumentException("createListTemplate failed, carContext not found")

        val template = ListTemplate(context, config)
        AndroidAutoTemplate.Companion.setTemplate(config.id, template)
    }

    override fun updateListTemplateSections(
        templateId: String, sections: Array<NitroSection>?
    ) {
        val template = AndroidAutoTemplate.Companion.getTemplate(templateId)
            ?: throw IllegalArgumentException("updateListTemplateSections failed, template $templateId not found")

        if (template !is ListTemplate) {
            throw IllegalArgumentException("setTemplateMapButtons failed, template $templateId is not of type ListTemplate")
        }

        template.updateSections(sections)
    }
}