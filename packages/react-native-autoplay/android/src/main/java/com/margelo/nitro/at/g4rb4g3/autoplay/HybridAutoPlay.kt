package com.margelo.nitro.at.g4rb4g3.autoplay

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

    override fun addListenerDidPress(callback: (PressEventPayload) -> Unit): () -> Unit {
        didPressListeners.add(callback)

        return {
            didPressListeners.removeAll { it === callback }
        }
    }

    override fun addListenerDidUpdatePinchGesture(callback: (PinchGestureEventPayload) -> Unit): () -> Unit {
        didUpdatePinchGestureListeners.add(callback)

        return {
            didUpdatePinchGestureListeners.removeAll { it === callback }
        }
    }

    override fun addListenerDidUpdatePanGestureWithTranslation(callback: (PanGestureWithTranslationEventPayload) -> Unit): () -> Unit {
        didUpdatePanGestureWithTranslationListeners.add(callback)

        return {
            didUpdatePanGestureWithTranslationListeners.removeAll { it === callback }
        }
    }

    override fun addListenerTemplateState(
        templateId: String, templateState: TemplateState, callback: (TemplateEventPayload?) -> Unit
    ): () -> Unit {
        val callbacks = templateStateListeners.getOrPut(templateId) { mutableMapOf() }
            .getOrPut(templateState) { mutableListOf() }
        callbacks.add(callback)

        return {
            templateStateListeners[templateId]?.get(templateState)?.removeAll { it === callback }
            if (templateStateListeners[templateId]?.isEmpty() == true) {
                templateStateListeners.remove(templateId)
            }
        }
    }

    companion object {
        private val listeners = mutableMapOf<EventName, MutableList<() -> Unit>>()
        private val didPressListeners = mutableListOf<(PressEventPayload) -> Unit>()
        private val didUpdatePinchGestureListeners =
            mutableListOf<(PinchGestureEventPayload) -> Unit>()
        private val didUpdatePanGestureWithTranslationListeners =
            mutableListOf<(PanGestureWithTranslationEventPayload) -> Unit>()

        private val templateStateListeners =
            mutableMapOf<String, MutableMap<TemplateState, MutableList<(TemplateEventPayload?) -> Unit>>>()

        fun emit(event: EventName) {
            listeners[event]?.forEach { it() }
        }

        fun emitTemplateState(templateId: String, templateState: TemplateState) {
            templateStateListeners[templateId]?.get(templateState)?.forEach { it(null) }
        }
    }
}