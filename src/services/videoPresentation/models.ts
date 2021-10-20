import type { Participant } from '../conference/models';

export interface VideoPresentation {
  /** The participant who started the presentation. */
  owner: Participant;
  /** The current video presentation timestamp used for seeking and pausing the video. */
  timestamp: number;
  /** The URL of the presented video file. */
  url: string;
}

export enum VideoPresentationState {
  PAUSED = 'paused',
  PLAYING = 'playing',
  STOPPED = 'stopped',
}
