import React

class HybridAutoPlay: HybridAutoPlaySpec {
    private static var listeners = [EventName: [String: () -> Void]]()
    private static var panGestureListeners = [
        String: (PanGestureWithTranslationEventPayload) -> Void
    ]()
    private static var templateStateListeners = [
        String: [TemplateState: [String: (TemplateEventPayload?) -> Void]]
    ]()

    private static var isJsReady = false
    private static var eventQueue: [EventName] = []
    private static var jsBundleObserver: NSObjectProtocol?

    override init() {
        // we listen for the bundle loaded notification to make sure we
        // emit events that were recevied before js was ready
        // captures only basic events like connect, disconnect...
        
        let name =
            RCTIsNewArchEnabled()
            ? Notification.Name("RCTInstanceDidLoadBundle")
            : Notification.Name("RCTJavaScriptDidLoadNotification")

        HybridAutoPlay.jsBundleObserver = NotificationCenter.default
            .addObserver(
                forName: name,
                object: nil,
                queue: nil,
            ) { notification in
                HybridAutoPlay.isJsReady = true

                HybridAutoPlay.eventQueue.forEach {
                    HybridAutoPlay.emit(event: $0)
                }

                if let observer = HybridAutoPlay.jsBundleObserver {
                    NotificationCenter.default.removeObserver(observer)
                }
            }
    }

    func addListener(eventType: EventName, callback: @escaping () -> Void)
        throws -> () -> Void
    {
        let uuid = UUID().uuidString
        HybridAutoPlay.listeners[eventType, default: [:]][uuid] = callback

        return { [weak self] in
            guard let self = self else { return }
            HybridAutoPlay.listeners[eventType]?.removeValue(forKey: uuid)
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
        HybridAutoPlay.panGestureListeners[uuid] = callback

        return {
            HybridAutoPlay.panGestureListeners.removeValue(forKey: uuid)
        }
    }

    func addListenerTemplateState(
        templateId: String,
        templateState: TemplateState,
        callback: @escaping (TemplateEventPayload?) -> Void
    ) throws -> () -> Void {
        let uuid = UUID().uuidString

        var stateMap = HybridAutoPlay.templateStateListeners[templateId] ?? [:]
        var callbacks = stateMap[templateState] ?? [:]
        callbacks[uuid] = callback
        stateMap[templateState] = callbacks
        HybridAutoPlay.templateStateListeners[templateId] = stateMap

        return {
            guard
                var stateMap = HybridAutoPlay.templateStateListeners[templateId]
            else {
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
                HybridAutoPlay.templateStateListeners.removeValue(
                    forKey: templateId
                )
            } else {
                HybridAutoPlay.templateStateListeners[templateId] = stateMap
            }
        }
    }

    static func emitTemplateState(
        templateId: String,
        templateState: TemplateState,
        animated: Bool = false
    ) {
        HybridAutoPlay.templateStateListeners.first { $0.key == templateId }?
            .value[templateState]?.values.forEach {
                $0(TemplateEventPayload(animated: animated))
            }
    }

    static func emit(event: EventName) {
        if !HybridAutoPlay.isJsReady {
            HybridAutoPlay.eventQueue.append(event)
            return
        }

        HybridAutoPlay.listeners[event]?.values.forEach {
            $0()
        }
    }

    func createAlertTemplate(config: AlertTemplateConfig) throws {
        //TODO
    }

    func presentTemplate(templateId: String) throws {
        //TODO
    }

    func dismissTemplate(templateId: String) throws {
        //TODO
    }

    func createMapTemplate(config: TemplateConfig) throws {
        //TODO
    }

    func setRootTemplate(templateId: String) throws {
        SceneStore.getScene(moduleName: templateId)?.setRootTemplate()
    }
}
