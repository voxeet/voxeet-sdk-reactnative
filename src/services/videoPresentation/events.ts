import type { Participant } from '../conference/models';

/** The VideoPresentationEventNames enum gathers the possible statuses of a video presentation. */
export enum VideoPresentationEventNames {
  /** Emitted when a video presentation is paused. */
  VideoPresentationPaused = 'EVENT_VIDEOPRESENTATION_PAUSED',
  /** Emitted when a video presentation is resumed. */
  VideoPresentationPlayed = 'EVENT_VIDEOPRESENTATION_PLAYED',
  /** Emitted when a video presentation is sought. */
  VideoPresentationSought = 'EVENT_VIDEOPRESENTATION_SOUGHT',
  /** Emitted when a video presentation is started. */
  VideoPresentationStarted = 'EVENT_VIDEOPRESENTATION_STARTED',
  /** Emitted when a video presentation is stopped. */
  VideoPresentationStopped = 'EVENT_VIDEOPRESENTATION_STOPPED',
}

/** The VideoPresentationEventType interface gathers information about a video presentation. */
export interface VideoPresentationEventType {
  /** The participant who started the presentation. */
  owner: Participant;
  /** The current video presentation timestamp used for seeking and pausing the video. */
  timestamp: number;
  /** The URL of the presented video file. */
  url: string;
}

export interface VideoPresentationEventMap {
  [VideoPresentationEventNames.VideoPresentationPlayed]: VideoPresentationEventType;
  [VideoPresentationEventNames.VideoPresentationPaused]: VideoPresentationEventType;
  [VideoPresentationEventNames.VideoPresentationStarted]: VideoPresentationEventType;
  [VideoPresentationEventNames.VideoPresentationSought]: VideoPresentationEventType;
  [VideoPresentationEventNames.VideoPresentationStopped]: {};
}
