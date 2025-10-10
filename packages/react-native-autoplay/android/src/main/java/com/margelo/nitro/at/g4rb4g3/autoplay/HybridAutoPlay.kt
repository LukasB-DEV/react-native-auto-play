package com.margelo.nitro.at.g4rb4g3.autoplay

import com.margelo.nitro.at.g4rb4g3.autoplay.AndroidAutoSession.Companion.ROOT_SESSION
import com.margelo.nitro.at.g4rb4g3.autoplay.template.AndroidAutoTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.ListTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.template.MapTemplate
import com.margelo.nitro.at.g4rb4g3.autoplay.utils.ThreadUtil
import com.margelo.nitro.core.Promise

class HybridAutoPlay : HybridAutoPlaySpec() {
    override fun addListener(
        eventType: EventName, callback: () -> Unit
    ): () -> Unit {
        val callbacks = listeners.getOrPut(eventType) { mutableListOf() }
        callbacks.add(callback)

        if (eventType == EventName.DIDCONNECT && AndroidAutoSession.getIsConnected()) {
            callback()
        }

        return {
            listeners[eventType]?.removeAll { it === callback }
        }
    }

    override fun addListenerRenderState(
        mapTemplateId: String, callback: (VisibilityState) -> Unit
    ): () -> Unit {
        val callbacks = renderStateListeners.getOrPut(mapTemplateId) {
            mutableListOf()
        }
        callbacks.add(callback)

        AndroidAutoSession.getState(mapTemplateId)?.let {
            callback(it)
        }

        return {
            renderStateListeners[mapTemplateId]?.let {
                it.remove(callback)
                if (it.isEmpty()) {
                    renderStateListeners.remove(mapTemplateId)
                }
            }
        }
    }

    override fun addSafeAreaInsetsListener(
        moduleName: String, callback: (SafeAreaInsets) -> Unit
    ): () -> Unit {
        val callbacks = safeAreaInsetsListeners.getOrPut(moduleName) {
            mutableListOf()
        }
        callbacks.add(callback)

        return {
            safeAreaInsetsListeners[moduleName]?.let {
                it.remove(callback)
                if (it.isEmpty()) {
                    safeAreaInsetsListeners.remove(moduleName)
                }
            }
        }
    }

    override fun setTemplateMapButtons(
        templateId: String, buttons: Array<NitroMapButton>?
    ) {
        val config = AndroidAutoTemplate.getConfig(templateId) as NitroMapTemplateConfig?
            ?: throw IllegalArgumentException("setMapButtons failed, template $templateId not found or not of type MapTemplate")
        val screen = AndroidAutoScreen.getScreen(ROOT_SESSION)
            ?: throw IllegalArgumentException("setMapButtons failed, no screen found")
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("setMapButtons failed, carContext found")

        val mapTemplate = MapTemplate(context, config.copy(mapButtons = buttons))
        AndroidAutoTemplate.setTemplate(templateId, mapTemplate)
        screen.setTemplate(mapTemplate.parse())
    }

    override fun setTemplateActions(
        templateId: String, actions: Array<NitroAction>?
    ) {
        val config = AndroidAutoTemplate.getConfig(templateId)
            ?: throw IllegalArgumentException("setTemplateActions failed, template $templateId not found")
        val screen = AndroidAutoScreen.getScreen(ROOT_SESSION)
            ?: throw IllegalArgumentException("setTemplateActions failed, no screen found")
        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("setTemplateActions failed, carContext found")

        val template = if (config is NitroMapTemplateConfig) {
            MapTemplate(context, config.copy(actions = actions))
        } else if (config is NitroListTemplateConfig) {
            ListTemplate(context, config.copy(actions = actions))
        } else {
            null
        } ?: throw ClassNotFoundException("failed to map ${config::class.simpleName}")

        AndroidAutoTemplate.setTemplate(templateId, template)
        screen.setTemplate(template.parse())
    }


    override fun createAlertTemplate(config: AlertTemplateConfig) {
        // TODO
    }

    override fun presentTemplate(templateId: String) {
        // TODO
    }

    override fun dismissTemplate(templateId: String) {
        // TODO
    }

    fun addTemplateStateListener(
        templateId: String,
        onWillAppear: Func_void_std__optional_bool_?,
        onDidAppear: Func_void_std__optional_bool_?,
        onWillDisappear: Func_void_std__optional_bool_?,
        onDidDisappear: Func_void_std__optional_bool_?
    ): () -> Unit {
        return addListenerTemplateState(templateId) { state ->
            when (state) {
                VisibilityState.WILLAPPEAR -> onWillAppear?.let { it(null) }
                VisibilityState.DIDAPPEAR -> onDidAppear?.let { it(null) }
                VisibilityState.WILLDISAPPEAR -> onWillDisappear?.let { it(null) }
                VisibilityState.DIDDISAPPEAR -> onDidDisappear?.let { it(null) }
            }
        }
    }

    override fun createMapTemplate(config: NitroMapTemplateConfig): () -> Unit {
        val removeTemplateStateListener = addTemplateStateListener(
            config.id,
            config.onWillAppear,
            config.onDidAppear,
            config.onWillDisappear,
            config.onDidDisappear
        )

        val context = AndroidAutoSession.getCarContext(config.id) ?: throw IllegalArgumentException(
            "createMapTemplate failed, carContext found"
        )

        val template = MapTemplate(context, config)
        AndroidAutoTemplate.setTemplate(config.id, template)

        return {
            removeTemplateStateListener()
            AndroidAutoTemplate.removeTemplate(config.id)
            AndroidAutoScreen.removeScreen(config.id)
        }
    }

    override fun createListTemplate(config: NitroListTemplateConfig): () -> Unit {
        val removeTemplateStateListener = addTemplateStateListener(
            config.id,
            config.onWillAppear,
            config.onDidAppear,
            config.onWillDisappear,
            config.onDidDisappear
        )

        val context = AndroidAutoSession.getRootContext()
            ?: throw IllegalArgumentException("createListTemplate failed, carContext found")

        val template = ListTemplate(context, config)
        AndroidAutoTemplate.setTemplate(config.id, template)

        return {
            removeTemplateStateListener()
            AndroidAutoTemplate.removeTemplate(config.id)
            AndroidAutoScreen.removeScreen(config.id)
        }
    }

    override fun setRootTemplate(templateId: String): Promise<Unit> {
        return Promise.async {
            val screen = AndroidAutoScreen.getScreen(templateId)
                ?: throw IllegalArgumentException("setRootTemplate failed, $templateId screen not found")
            val template = AndroidAutoTemplate.getTemplate(templateId)
                ?: throw IllegalArgumentException("setRootTemplate failed, $templateId template not found")
            val isCluster = templateId != ROOT_SESSION
            val carContext = AndroidAutoSession.getCarContext(templateId)
                ?: throw IllegalArgumentException("setRootTemplate failed, carContext for $templateId template not found")

            if (virtualScreens[templateId] == null) {
                val result = ThreadUtil.postOnUiAndAwait {
                    virtualScreens[templateId] = VirtualRenderer(carContext, templateId, isCluster)
                }
                if (result.isFailure) {
                    throw result.exceptionOrNull() ?: UnknownError("unknown error initializing the virtual screen")
                }
            }

            screen.setTemplate(template)
        }
    }

    override fun pushTemplate(templateId: String): Promise<Unit> {
        return Promise.async {
            val context = AndroidAutoSession.getRootContext()
                ?: throw IllegalArgumentException("pushTemplate failed, carContext not found")
            val template = AndroidAutoTemplate.getTemplate(templateId)
                ?: throw IllegalArgumentException("pushTemplate failed, template $templateId not found")
            val screenManager = AndroidAutoScreen.getScreenManager(ROOT_SESSION)
                ?: throw IllegalArgumentException("pushTemplate failed, screenManager not found")

            val result = ThreadUtil.postOnUiAndAwait {
                val screen = AndroidAutoScreen(context, templateId, template)
                screenManager.push(screen)
            }

            if (result.isFailure) {
                throw result.exceptionOrNull() ?: UnknownError("unknown error pushing template")
            }
        }
    }

    override fun popTemplate(): Promise<Unit> {
        return Promise.async {
            val screenManager = AndroidAutoScreen.getScreenManager(ROOT_SESSION)
                ?: throw IllegalArgumentException("pushTemplate failed, screenManager not found")
            if (screenManager.stackSize == 0) {
                return@async
            }

            val result = ThreadUtil.postOnUiAndAwait {
                screenManager.pop()
            }

            if (result.isFailure) {
                throw result.exceptionOrNull() ?: UnknownError("unknown error popping template")
            }
        }
    }

    companion object {
        const val TAG = "HybridAutoPlay"
        private val virtualScreens = mutableMapOf<String, VirtualRenderer>()

        private val listeners = mutableMapOf<EventName, MutableList<() -> Unit>>()

        private val templateStateListeners =
            mutableMapOf<String, MutableList<(VisibilityState) -> Unit>>()
        private val renderStateListeners =
            mutableMapOf<String, MutableList<(VisibilityState) -> Unit>>()
        private val safeAreaInsetsListeners =
            mutableMapOf<String, MutableList<(SafeAreaInsets) -> Unit>>()

        fun addListenerTemplateState(
            templateId: String, callback: (VisibilityState) -> Unit
        ): () -> Unit {
            val callbacks = templateStateListeners.getOrPut(templateId) {
                mutableListOf()
            }
            callbacks.add(callback)

            return {
                templateStateListeners[templateId]?.let {
                    it.remove(callback)
                    if (it.isEmpty()) {
                        templateStateListeners.remove(templateId)
                    }
                }
            }
        }

        fun emit(event: EventName) {
            listeners[event]?.forEach { it() }
        }

        fun emitTemplateState(templateId: String, templateState: VisibilityState) {
            templateStateListeners[templateId]?.forEach {
                it(templateState)
            }
        }

        fun emitRenderState(mapTemplateId: String, state: VisibilityState) {
            renderStateListeners[mapTemplateId]?.forEach {
                it(state)
            }
        }

        fun emitSafeAreaInsets(
            moduleName: String,
            top: Double,
            bottom: Double,
            left: Double,
            right: Double,
            isLegacyLayout: Boolean
        ) {
            val insets = SafeAreaInsets(
                top = top,
                bottom = bottom,
                left = left,
                right = right,
                isLegacyLayout = isLegacyLayout
            )
            safeAreaInsetsListeners[moduleName]?.forEach {
                it(insets)
            }
        }
    }
}