package com.margelo.nitro.at.g4rb4g3.autoplay.template

import androidx.car.app.CarContext
import androidx.car.app.model.ListTemplate
import androidx.car.app.model.SectionedItemList
import androidx.car.app.model.Template
import com.margelo.nitro.at.g4rb4g3.autoplay.NitroListTemplateConfig

class ListTemplate(context: CarContext, config: NitroListTemplateConfig) :
    AndroidAutoTemplate<NitroListTemplateConfig>(context, config) {

    override fun parse(): Template {
        return ListTemplate.Builder().apply {
            setHeader(Parser.parseHeader(context, Parser.parseText(config.title), config.actions))

            config.sections?.let { sections ->
                if (sections.isEmpty()) {
                    setLoading(true)
                } else if (sections.size == 1) {
                    val section = sections[0]
                    setSingleList(
                        Parser.parseRows(
                            context, section.items, 0, section.selectedIndex, config.id
                        )
                    )
                } else {
                    sections.forEachIndexed { index, section ->
                        addSectionedList(
                            SectionedItemList.create(
                                Parser.parseRows(
                                    context, section.items, index, section.selectedIndex, config.id
                                ), section.title!!
                            )
                        )
                    }
                }
            } ?: run {
                setLoading(true)
            }
        }.build()
    }
}