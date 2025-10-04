package com.margelo.nitro.at.g4rb4g3.autoplay.template

import androidx.car.app.model.Action
import androidx.car.app.model.ActionStrip
import androidx.car.app.model.CarIcon
import androidx.car.app.navigation.model.NavigationTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.AndroidAutoSession
import com.margelo.nitro.at.g4rb4g3.autoplay.NitroMapTemplateConfig
import com.margelo.nitro.at.g4rb4g3.autoplay.utils.SymbolFont

class MapTemplate(
    val config: NitroMapTemplateConfig
) : AndroidAutoTemplate() {

    init {
        val context =
            AndroidAutoSession.getRootContext() //TODO: this should actually use the proper screen/session context

        template = NavigationTemplate.Builder().apply {
            setActionStrip(
                ActionStrip.Builder().apply {
                    addAction(Action.APP_ICON)
                }.build()
            ).build()
            context?.let {
                config.mapButtons?.let { buttons ->
                    setMapActionStrip(ActionStrip.Builder().apply {
                        buttons.forEach { button ->
                            addAction(Action.Builder().apply {
                                setOnClickListener(button.onPress)
                                setIcon(
                                    CarIcon.Builder(SymbolFont.iconFromNitroImage(it, button.image))
                                        .build()
                                )
                            }.build())
                        }
                    }.build())
                }
            }
        }.build()
    }
}