package com.margelo.nitro.at.g4rb4g3.autoplay

import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.model.Action
import androidx.car.app.model.ActionStrip
import androidx.car.app.model.CarIcon
import androidx.car.app.model.MessageTemplate
import androidx.car.app.model.Template
import androidx.car.app.navigation.model.NavigationTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.utils.AppInfo

class AndroidAutoScreen(carContext: CarContext, private val isCluster: Boolean = false) :
    Screen(carContext) {

    var template: Template? = null

    override fun onGetTemplate(): Template {
        template?.let {
            return it
        }

        if (isCluster) {
            return NavigationTemplate.Builder().apply {
                setActionStrip(ActionStrip.Builder().apply { addAction(Action.APP_ICON) }
                    .build()).build()
            }.build()
        }

        val appName = AppInfo.getApplicationLabel(carContext)

        return MessageTemplate.Builder(appName).apply {
            setIcon(CarIcon.APP_ICON)
        }.build()
    }
}