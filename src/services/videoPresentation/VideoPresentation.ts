import { NativeModules } from 'react-native';

import NativeEvents from '../../utils/NativeEvents';
import type { UnsubscribeFunction } from '../conference/models';
import type { VideoPresentationEventType } from './events';
import { VideoPresentationEventNames } from './events';
import type { VideoPresentation, VideoPresentationState } from './models';

const { DolbyIoIAPIVideoPresentationService } = NativeModules;

class VideoPresentationService {
  /** @internal */
  _nativeEvents = new NativeEvents(DolbyIoIAPIVideoPresentationService);

  /**
   * Pauses the video presentation.
   * @param timestamp<number>
   * @returns void
   */
  public pause(timestamp: number): void {
    return DolbyIoIAPIVideoPresentationService.pause(timestamp);
  }

  /**
   * Resumes the paused video presentation.
   * @returns void
   */
  public play(): void {
    return DolbyIoIAPIVideoPresentationService.play();
  }

  public current(): VideoPresentation | null {
    return DolbyIoIAPIVideoPresentationService.current();
  }

  public state(): VideoPresentationState {
    return DolbyIoIAPIVideoPresentationService.state();
  }

  /**
   * Allows the presenter to navigate to the specific section of the shared video.
   * @param timestamp<number>
   * @returns void
   */
  public seek(timestamp: number): void {
    return DolbyIoIAPIVideoPresentationService.seek(timestamp);
  }

  /**
   * Pauses the video presentation.
   * @param url<number>
   * @returns void
   */
  public start(url: string): void {
    return DolbyIoIAPIVideoPresentationService.start(url);
  }

  /**
   * Stops the video presentation.
   * @returns void
   */
  public stop(): void {
    return DolbyIoIAPIVideoPresentationService.stop();
  }

  /**
   * Adds a listener for video presentation started, sought, paused and played events
   * @param handler {(data: VideoPresentationEventType,
   * type: VideoPresentationEventNames.started | VideoPresentationEventNames.sought
       | VideoPresentationEventNames.paused | VideoPresentationEventNames.played) => void} Handling function
   * @returns {UnsubscribeFunction} Function that unsubscribes from listeners
   */
  public onVideoPresentationChange(
    handler: (
      data: VideoPresentationEventType,
      type?:
        | VideoPresentationEventNames.started
        | VideoPresentationEventNames.sought
        | VideoPresentationEventNames.paused
        | VideoPresentationEventNames.played
    ) => void
  ): UnsubscribeFunction {
    const videoPresentationEventStartedEventUnsubscribe =
      this._nativeEvents.addListener(
        VideoPresentationEventNames.started,
        handler
      );
    const videoPresentationEventPausedEventUnsubscribe =
      this._nativeEvents.addListener(
        VideoPresentationEventNames.paused,
        handler
      );
    const videoPresentationEventPlayedEventUnsubscribe =
      this._nativeEvents.addListener(
        VideoPresentationEventNames.played,
        handler
      );
    const videoPresentationEventSoughtEventUnsubscribe =
      this._nativeEvents.addListener(
        VideoPresentationEventNames.sought,
        handler
      );
    return () => {
      videoPresentationEventPlayedEventUnsubscribe();
      videoPresentationEventSoughtEventUnsubscribe();
      videoPresentationEventPausedEventUnsubscribe();
      videoPresentationEventStartedEventUnsubscribe();
    };
  }

  /**
   * Adds a listener for video presentation stopped event
   * @param handler {() => void} Handling function
   * @returns {UnsubscribeFunction} Function that unsubscribes from listeners
   */
  onVideoPresentationStopped(handler: () => void): UnsubscribeFunction {
    return this._nativeEvents.addListener(
      VideoPresentationEventNames.stopped,
      handler
    );
  }
}

export default new VideoPresentationService();
