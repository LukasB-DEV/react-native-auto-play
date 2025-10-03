package com.margelo.nitro.at.g4rb4g3.autoplay.template

import androidx.car.app.model.Action
import androidx.car.app.model.ActionStrip
import androidx.car.app.navigation.model.NavigationTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.NitroMapTemplateConfig

class MapTemplate(
    val config: NitroMapTemplateConfig
) : AndroidAutoTemplate() {

    init {
        template = NavigationTemplate.Builder().apply {
            setActionStrip(
                ActionStrip.Builder().apply {
                    addAction(Action.APP_ICON)
                }.build()
            ).build()
        }.build()
    }
}