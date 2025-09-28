import type { HybridObject } from 'react-native-nitro-modules';
import type { EventName, RemoveListener } from '../types/Event';
import type {
  PanGestureWithTranslationEventPayload,
  PinchGestureEventPayload,
  PressEventPayload,
} from '../types/GestureEvents';
import type { TemplateEventPayload, TemplateState } from '../types/TemplateEvents';

export interface AutoPlay extends HybridObject<{ android: 'kotlin'; ios: 'swift' }> {
  /**
   * attach a listener for generic notifications like didConnect, didDisconnect, ...
   * @namespace all
   * @param eventType generic events
   * @returns token to remove the listener
   */
  addListener(eventType: EventName, callback: () => void): RemoveListener;

  /**
   * attach a listener for screen single tap press events
   * @namespace Android
   */
  addListenerDidPress(callback: (payload: PressEventPayload) => void): RemoveListener;

  /**
   * attach a listener for pinch to zoom and double tap events
   * @namespace Android
   */
  addListenerDidUpdatePinchGesture(
    callback: (payload: PinchGestureEventPayload) => void
  ): RemoveListener;

  /**
   * attach a listener for pan events
   * @namespace all
   */
  addListenerDidUpdatePanGestureWithTranslation(
    callback: (payload: PanGestureWithTranslationEventPayload) => void
  ): RemoveListener;

  /**
   * attach a listener for template will appear events
   */
  addListenerTemplateState(
    templateId: string,
    templateState: TemplateState,
    callback: (payload: TemplateEventPayload | null) => void
  ): RemoveListener;
}
