package com.margelo.nitro.at.g4rb4g3.autoplay.template

import androidx.car.app.CarContext
import androidx.car.app.model.ListTemplate
import androidx.car.app.model.Template
import com.margelo.nitro.at.g4rb4g3.autoplay.NitroListTemplateConfig

class ListTemplate(context: CarContext, config: NitroListTemplateConfig) :
    AndroidAutoTemplate<NitroListTemplateConfig>(context, config) {

    override fun parse(): Template {
        return ListTemplate.Builder().apply {
            // TODO: Parser.parseText
            setHeader(Parser.parseHeader(context, config.title.text, config.actions))
            setLoading(true)
        }.build()
    }
}