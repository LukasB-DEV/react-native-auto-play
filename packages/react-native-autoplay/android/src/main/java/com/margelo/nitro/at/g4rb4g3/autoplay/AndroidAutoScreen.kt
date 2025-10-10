package com.margelo.nitro.at.g4rb4g3.autoplay

import android.util.Log
import androidx.activity.OnBackPressedCallback
import androidx.car.app.CarContext
import androidx.car.app.Screen
import androidx.car.app.ScreenManager
import androidx.car.app.model.Template
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.facebook.react.bridge.UiThreadUtil
import com.margelo.nitro.at.g4rb4g3.autoplay.template.AndroidAutoTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.ListTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.MapTemplate

class AndroidAutoScreen(
    carContext: CarContext, private val moduleName: String, private var template: Template
) : Screen(carContext) {

    init {
        marker = moduleName
        screens.put(moduleName, this)

        lifecycle.addObserver(object : LifecycleEventObserver {
            override fun onStateChanged(
                source: LifecycleOwner, event: Lifecycle.Event
            ) {
                when (event) {
                    Lifecycle.Event.ON_CREATE -> {
                        HybridAutoPlay.emitTemplateState(moduleName, VisibilityState.WILLAPPEAR)
                    }

                    Lifecycle.Event.ON_RESUME -> {
                        HybridAutoPlay.emitTemplateState(moduleName, VisibilityState.DIDAPPEAR)
                    }

                    Lifecycle.Event.ON_PAUSE -> {
                        HybridAutoPlay.emitTemplateState(moduleName, VisibilityState.WILLDISAPPEAR)
                    }

                    Lifecycle.Event.ON_DESTROY -> {
                        HybridAutoPlay.emitTemplateState(moduleName, VisibilityState.DIDDISAPPEAR)
                    }

                    else -> {}
                }
            }
        })

        carContext.onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                val config = AndroidAutoTemplate.getConfig(moduleName)
                val backButton = when (config) {
                    is NitroMapTemplateConfig -> config.actions?.find { it.type == NitroActionType.BACK }
                    is NitroListTemplateConfig -> config.actions?.find { it.type == NitroActionType.BACK }
                    else -> null
                }

                if (backButton == null) {
                    isEnabled = false
                    carContext.onBackPressedDispatcher.onBackPressed()
                    isEnabled = true
                    return
                }

                backButton.onPress()
            }
        })
    }

    fun setTemplate(template: Template) {
        this.template = template
        UiThreadUtil.runOnUiThread {
            invalidate()
        }
    }

    fun applyConfigUpdate() {
        val config = AndroidAutoTemplate.getConfig(moduleName) ?: return

        when (config) {
            is NitroMapTemplateConfig -> MapTemplate(carContext, config)
            is NitroListTemplateConfig -> ListTemplate(carContext, config)
            else -> null
        }?.let {
            AndroidAutoTemplate.setTemplate(moduleName, it)
            setTemplate(it.parse())
        }
    }

    override fun onGetTemplate(): Template {
        return template
    }

    companion object {
        const val TAG = "AndroidAutoScreen"

        private val screens = mutableMapOf<String, AndroidAutoScreen>()

        fun getScreen(marker: String): AndroidAutoScreen? {
            return screens[marker]
        }

        fun getScreenManager(marker: String): ScreenManager? {
            return screens[marker]?.screenManager
        }

        fun removeScreen(marker: String) {
            screens.remove(marker)
        }
    }
}