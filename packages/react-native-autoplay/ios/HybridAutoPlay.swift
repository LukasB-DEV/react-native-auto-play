class HybridAutoPlay: HybridAutoPlaySpec {
    private var listeners = [EventName: [String: () -> Void]]()
    private var panGestureListeners = [
        String: (PanGestureWithTranslationEventPayload) -> Void
    ]()
    private var templateStateListeners = [
        String: [TemplateState: [String: (TemplateEventPayload?) -> Void]]
    ]()

    func addListener(eventType: EventName, callback: @escaping () -> Void)
        throws -> () -> Void
    {
        let uuid = UUID().uuidString
        listeners[eventType, default: [:]][uuid] = callback

        return { [weak self] in
            guard let self = self else { return }
            self.listeners[eventType]?.removeValue(forKey: uuid)
        }
    }

    func addListenerDidPress(callback: @escaping (PressEventPayload) -> Void)
        throws
        -> () -> Void
    {
        throw fatalError("addListenerDidPress not supported on this platform")
    }

    func addListenerDidUpdatePinchGesture(
        callback: @escaping (PinchGestureEventPayload) -> Void
    ) throws -> () -> Void {
        throw fatalError(
            "addListenerDidUpdatePinchGesture not supported on this platform"
        )
    }

    func addListenerDidUpdatePanGestureWithTranslation(
        callback: @escaping (PanGestureWithTranslationEventPayload) -> Void
    ) throws -> () -> Void {
        let uuid = UUID().uuidString
        panGestureListeners[uuid] = callback

        return { [weak self] in
            self?.panGestureListeners.removeValue(forKey: uuid)
        }
    }

    func addListenerTemplateState(
        templateId: String,
        templateState: TemplateState,
        callback: @escaping (TemplateEventPayload?) -> Void
    ) throws -> () -> Void {
        let uuid = UUID().uuidString

        var stateMap = templateStateListeners[templateId] ?? [:]
        var callbacks = stateMap[templateState] ?? [:]
        callbacks[uuid] = callback
        stateMap[templateState] = callbacks
        templateStateListeners[templateId] = stateMap

        return { [weak self] in
            guard let self = self else { return }
            guard var stateMap = self.templateStateListeners[templateId] else {
                return
            }
            guard var callbacks = stateMap[templateState] else { return }
            callbacks.removeValue(forKey: uuid)
            if callbacks.isEmpty {
                stateMap.removeValue(forKey: templateState)
            } else {
                stateMap[templateState] = callbacks
            }
            if stateMap.isEmpty {
                self.templateStateListeners.removeValue(forKey: templateId)
            } else {
                self.templateStateListeners[templateId] = stateMap
            }
        }
    }
}
