import NativeEvents from '../../utils/NativeEvents';
import type { UnsubscribeFunction } from '../conference/models';
import type { VideoPresentationEventType } from './events';
import { VideoPresentationEventNames } from './events';
import { NativeModules } from 'react-native';

const { DolbyIoIAPIVideoPresentationService } = NativeModules;

class VideoPresentationService {
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
   * Adds a listener for video presentation pause event
   * @param handler {(data: VideoPresentationEventType) => void} Handling function
   * @returns {() => void} Function that removes handler
   */
  public onVideoPresentationPaused(
    handler: (data: VideoPresentationEventType) => void
  ): UnsubscribeFunction {
    return NativeEvents.addListener(
      VideoPresentationEventNames.paused,
      (data) => {
        handler(data);
      }
    );
  }

  /**
   * Adds a listener for video presentation play event
   * @param handler {(data: VideoPresentationEventType) => void} Handling function
   * @returns {() => void} Function that removes handler
   */
  public onVideoPresentationPlayed(
    handler: (data: VideoPresentationEventType) => void
  ): UnsubscribeFunction {
    return NativeEvents.addListener(
      VideoPresentationEventNames.played,
      (data) => {
        handler(data);
      }
    );
  }

  /**
   * Adds a listener for video presentation seek event
   * @param handler {(data: VideoPresentationEventType) => void} Handling function
   * @returns {() => void} Function that removes handler
   */
  public onVideoPresentationSought(
    handler: (data: VideoPresentationEventType) => void
  ): UnsubscribeFunction {
    return NativeEvents.addListener(
      VideoPresentationEventNames.sought,
      (data) => {
        handler(data);
      }
    );
  }

  /**
   * Adds a listener for video presentation start event
   * @param handler {(data: VideoPresentationEventType) => void} Handling function
   * @returns {() => void} Function that removes handler
   */
  public onVideoPresentationStarted(
    handler: (data: VideoPresentationEventType) => void
  ): UnsubscribeFunction {
    return NativeEvents.addListener(
      VideoPresentationEventNames.started,
      (data) => {
        handler(data);
      }
    );
  }

  // /**
  //  * Adds a listener for video presentation play event
  //  * @param handler {() => void} Handling function
  //  * @returns {() => void} Function that removes handler
  //  */
  // public onVideoPresentationStopped(
  //   handler: (data: VideoPresentationPlayedEventType) => void
  // ): UnsubscribeFunction {
  //   return NativeEvents.addListener(VideoPresentationEventNames.stopped, () =>
  //     handler()
  //   );
  // }
}

export default new VideoPresentationService();
