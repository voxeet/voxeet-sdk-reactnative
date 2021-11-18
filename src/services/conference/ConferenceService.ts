import { NativeModules } from 'react-native';

import NativeEvents from '../../utils/NativeEvents';
import SessionService from '../session/SessionService';
import { ConferenceServiceEventNames } from './events';
import type {
  PermissionsUpdatedEventType,
  ParticipantChangedEventType,
  StreamChangedEventType,
  ConferenceStatusUpdatedEventType,
} from './events';
import type {
  Conference,
  ConferenceCreateOptions,
  ConferenceReplayOptions,
  ConferenceJoinOptions,
  ConferenceLeaveOptions,
  AudioLevel,
  MaxVideoForwarding,
  Participant,
  ConferenceStatus,
  AudioProcessingOptions,
  ParticipantPermissions,
  UnsubscribeFunction,
  RTCStatsType,
  SpatialDirection,
  SpatialScale,
  SpatialPosition,
} from './models';
import { transformToConference, transformToParticipant } from './transformers';

const { DolbyIoIAPIConferenceService } = NativeModules;

export class ConferenceService {
  /** @internal */
  _nativeModule = DolbyIoIAPIConferenceService;
  /** @internal */
  _nativeEvents = new NativeEvents(DolbyIoIAPIConferenceService);

  /**
   * Create a conference with options
   * @param options<CreateOptions> The conference options
   * @returns {Promise<Conference>} Promise with a Conference object
   */

  public async create(
    options: ConferenceCreateOptions = {}
  ): Promise<Conference> {
    return transformToConference(await this._nativeModule.create(options));
  }

  /**
   * Provides a Conference object that allows joining a conference. Without a param it returns current Conference object.
   * @param conferenceId?<string> The conference ID.
   * @returns {Promise<Conference>} Promise with a Conference object
   */

  public async fetch(conferenceId?: string): Promise<Conference> {
    return transformToConference(await this._nativeModule.fetch(conferenceId));
  }

  /**
   * Provides information about the current conference.
   * @returns {Promise<Conference>} Promise with a Conference object
   */

  public async current(): Promise<Conference> {
    return transformToConference(await this._nativeModule.current());
  }

  /**
   * Replays a previously recorded conference.
   * @param conference<Conference> The Conference.
   * @param replayOptions<ConferenceReplayOptions> The replay options.
   * @returns {Promise<Conference>} Promise with a Conference object
   */

  public async replay(
    conference: Conference,
    replayOptions?: ConferenceReplayOptions
  ): Promise<Conference> {
    return transformToConference(
      await this._nativeModule.replay(conference, {
        offset: 0,
        ...replayOptions,
      })
    );
  }

  /**
   * Gets the participant's audio level
   * @param participant<Participant> The participant object.
   * @returns {Promise<AudioLevel>} Promise with AudioLevel
   */

  public async getAudioLevel(participant: Participant): Promise<AudioLevel> {
    return this._nativeModule.getAudioLevel(participant);
  }

  /**
   * Provides standard WebRTC statistics for the application.
   * @returns {Promise<RTCStatsType>} Promise with LocalStats
   */

  public async getLocalStats(): Promise<RTCStatsType[]> {
    return this._nativeModule.getLocalStats();
  }

  /**
   * Provides the number of video streams that are transmitted to the local user.
   * @returns {Promise<MaxVideoForwarding>} Promise with MaxVideoForwarding
   */

  public async getMaxVideoForwarding(): Promise<MaxVideoForwarding> {
    return this._nativeModule.getMaxVideoForwarding();
  }

  /**
   * The participant's information.
   * @param participantId<string> ID of Participant
   * @returns {Promise<Participant>} Promise with Participant
   */

  public async getParticipant(participantId: String): Promise<Participant> {
    return transformToParticipant(
      await this._nativeModule.getParticipant(participantId)
    );
  }

  /**
   * Gets a list of conference participants
   * @param conference<Conference> The Conference object.
   * @returns {Promise<Array<Participant>>} Promise with array of Participants
   */

  public async getParticipants(
    conference: Conference
  ): Promise<Array<Participant>> {
    const participants = await this._nativeModule.getParticipants(conference);
    return participants.map(transformToParticipant);
  }

  /**
   * Provides the conference status.
   * @param conference<Conference> The Conference object.
   * @returns {Promise<ConferenceStatus>} Promise with a ConferenceStatus string
   */

  public async getStatus(conference: Conference): Promise<ConferenceStatus> {
    return this._nativeModule.getStatus(conference);
  }

  /**
   * Informs whether the application plays the remote participants' audio to the local participant.
   * @returns {Promise<boolean>} A boolean indicating whether the application plays the remote participants' audio to the local participant.
   */

  public async isOutputMuted(): Promise<boolean> {
    return !!(await this._nativeModule.isOutputMuted());
  }

  /**
   * Gets the current mute state of the participant.
   * @returns {Promise<boolean>} Information if the local participant is muted.
   */

  public async isMuted(): Promise<boolean> {
    return this._nativeModule.isMuted();
  }

  /**
   * Gets the participant's current speaking status for an active talker indicator.
   * @param participant<Participant> The Participant object.
   * @returns {Promise<boolean>} A boolean indicating whether the current participant is speaking.
   */

  public async isSpeaking(participant: Participant): Promise<boolean> {
    return this._nativeModule.isSpeaking(participant);
  }

  /**
   * Enables and disables audio processing for the conference participant.
   * @param options<AudioProcessingOptions> The AudioProcessingOptions model includes the AudioProcessingSenderOptions model responsible for enabling and disabling audio processing.
   * @returns {Promise<void>}
   */

  public async setAudioProcessing(
    options: AudioProcessingOptions = {}
  ): Promise<void> {
    return this._nativeModule.setAudioProcessing(options);
  }

  /**
   * Sets the maximum number of video streams that may be transmitted to the local participant.
   * @param max<MaxVideoForwarding> The maximum number of video streams that may be transmitted to the local participant. The valid parameter's values are between 0 and 4 for mobile browsers with 4 as default value.
   * @param prioritizedParticipants<Participant[]> The list of the prioritized participants. This parameter allows using a pin option to prioritize specific participant's video streams and display their videos even when these participants do not talk.
   * @returns {Promise<any>}
   */

  public async setMaxVideoForwarding(
    max: MaxVideoForwarding = 4,
    prioritizedParticipants: Participant[] = []
  ): Promise<any> {
    return this._nativeModule.setMaxVideoForwarding(
      max,
      prioritizedParticipants
    );
  }

  /**
   * Stops playing the specified remote participants' audio to the local participant or stops playing the local participant's audio to the conference.
   * @param isMuted<boolean> A boolean, true indicates that the local participant is muted, false indicates that a participant is not muted
   * @param participant<Participant> A remote participant
   * @returns {Promise<boolean>} Informs if the mute state has changed.
   */

  public async mute(
    participant: Participant,
    isMuted: boolean
  ): Promise<boolean> {
    return this._nativeModule.mute(isMuted, participant);
  }

  /**
   * Updates the participant's conference permissions.
   * @param participantPermissions<ParticipantPermissions[]> The set of participant's conference permissions.
   * @returns {Promise<void>}
   */

  public async updatePermissions(
    participantPermissions: Array<ParticipantPermissions>
  ): Promise<void> {
    return this._nativeModule.updatePermissions(participantPermissions);
  }

  /**
   * Starts audio transmission between the local client and a conference.
   * @param participant<Participant> The participant whose stream should be sent to the local participant.
   * @returns {Promise<void>}
   */

  public async startAudio(participant: Participant): Promise<void> {
    return this._nativeModule.startAudio(participant);
  }

  /**
   * Notifies the server to either start sending the local participant's video stream to the conference or start sending a remote participant's video stream to the local participant.
   * @param participant<Participant> The Participant object.
   * @returns {Promise<void>}
   */

  public async startVideo(participant: Participant): Promise<void> {
    return this._nativeModule.startVideo(participant);
  }

  /**
   * Stops audio transmission between the local client and a conference.
   * @param participant<Participant> The Participant object.
   * @returns {Promise<void>}
   */

  public async stopAudio(participant: Participant): Promise<void> {
    return this._nativeModule.stopAudio(participant);
  }

  /**
   * Notifies the server to either stop sending the local participant's video stream to the conference or stop sending a remote participant's video stream to the local participant.
   * @param participant<Participant> The Participant object.
   * @returns {Promise<void>}
   */

  public async stopVideo(participant: Participant): Promise<void> {
    return this._nativeModule.stopVideo(participant);
  }

  /**
   * Joins the conference.
   * @param conference<Conference> The Conference object.
   * @param options<ConferenceJoinOptions> The additional options for the joining participant.
   * @returns {Promise<Conference>} Promise with the Conference
   */

  public async join(
    conference: Conference,
    options?: ConferenceJoinOptions
  ): Promise<Conference> {
    return transformToConference(
      await this._nativeModule.join(conference, options)
    );
  }

  /**
   * Allows the conference owner, or a participant with adequate permissions, to kick another participant from the conference by revoking the conference access token.
   * @param participant<Participant> The participant who needs to be kicked from the conference.
   * @returns {Promise<void>}
   */

  public async kick(participant: Participant): Promise<void> {
    return this._nativeModule.kick(participant);
  }

  /**
   * Leaves the conference.
   * @param options<ConferenceLeaveOptions> The additional options for the leaving participant.
   * @returns {Promise<boolean>}
   */
  public async leave(options?: ConferenceLeaveOptions): Promise<void> {
    await this._nativeModule.leave();
    if (options && options.leaveRoom) {
      await SessionService.close();
      return;
    } else {
      return;
    }
  }

  /**
   * Add a handler for conference status changes
   * @param handler<(data: ConferenceStatusUpdatedEventType) => void> Handling function
   * @returns {UnsubscribeFunction} Function that removes handler
   */
  public onStatusChange(
    handler: (data: ConferenceStatusUpdatedEventType) => void
  ): UnsubscribeFunction {
    return this._nativeEvents.addListener(
      ConferenceServiceEventNames.StatusUpdated,
      (data) => {
        handler(data);
      }
    );
  }

  /**
   * Add a handler for permissions changes
   * @param handler<(data: PermissionsUpdatedEventType) => void> Handling function
   * @returns {UnsubscribeFunction} Function that removes handler
   */

  public onPermissionsChange(
    handler: (data: PermissionsUpdatedEventType) => void
  ): UnsubscribeFunction {
    return this._nativeEvents.addListener(
      ConferenceServiceEventNames.PermissionsUpdated,
      (data) => {
        handler(data);
      }
    );
  }

  /**
   * Add a handler for participants changes
   * @param handler<(data: ParticipantChangedEventType, types?:
   *    | ConferenceServiceEventNames.ParticipantAdded
   *    | ConferenceServiceEventNames.ParticipantJoined
   *    | ConferenceServiceEventNames.ParticipantUpdated
   *    | ConferenceServiceEventNames.ParticipantRemoved) => void> Handling function
   * @returns {UnsubscribeFunction} Function that removes handler
   */

  public onParticipantsChange(
    handler: (
      data: ParticipantChangedEventType,
      type?:
        | ConferenceServiceEventNames.ParticipantAdded
        | ConferenceServiceEventNames.ParticipantUpdated
    ) => void
  ): UnsubscribeFunction {
    const participantAddedEventUnsubscribe = this._nativeEvents.addListener(
      ConferenceServiceEventNames.ParticipantAdded,
      handler
    );
    const participantUpdatedEventUnsubscribe = this._nativeEvents.addListener(
      ConferenceServiceEventNames.ParticipantUpdated,
      handler
    );

    return () => {
      participantAddedEventUnsubscribe();
      participantUpdatedEventUnsubscribe();
    };
  }

  /**
   * Add a handler for streams changes
   * @param handler<(data: StreamChangedEventType type?:
   *    | ConferenceServiceEventNames.StreamAdded
   *    | ConferenceServiceEventNames.StreamUpdated
   *    | ConferenceServiceEventNames.StreamRemoved) => void> Handling function
   * @returns {UnsubscribeFunction} Function that removes handler
   */

  public onStreamsChange(
    handler: (
      data: StreamChangedEventType,
      type?:
        | ConferenceServiceEventNames.StreamAdded
        | ConferenceServiceEventNames.StreamUpdated
        | ConferenceServiceEventNames.StreamRemoved
    ) => void
  ): UnsubscribeFunction {
    const streamAddedEventUnsubscribe = this._nativeEvents.addListener(
      ConferenceServiceEventNames.StreamAdded,
      handler
    );
    const streamUpdatedEventUnsubscribe = this._nativeEvents.addListener(
      ConferenceServiceEventNames.StreamUpdated,
      handler
    );
    const streamRemovedEventUnsubscribe = this._nativeEvents.addListener(
      ConferenceServiceEventNames.StreamRemoved,
      handler
    );

    return () => {
      streamAddedEventUnsubscribe();
      streamUpdatedEventUnsubscribe();
      streamRemovedEventUnsubscribe();
    };
  }

  /**
   * 	Starts a screen sharing session.
   * 	The ScreenShare with iOS document (https://docs.dolby.io/communications-apis/docs/screenshare-with-ios) describes how to set up screen-share outside the application.
   *
   Instead of setting properties:
   VoxeetSDK.shared.appGroup = "YOUR_APP_GROUP"
   VoxeetSDK.shared.preferredExtension = "YOUR_BROADCAST_EXTENSION_BUNDLE_ID"
   Setup keys in your Info.plist file:

   Open your Info.plist file then:
   - add a new DolbyioSdkAppGroupKey as a String type and enter the group name ("YOUR_APP_GROUP")
   - add a new DolbyioSdkPreferredExtensionKey as a String type and enter the broadcast extension bundle id ("YOUR_BROADCAST_EXTENSION_BUNDLE_ID")
   * @returns {Promise<void>}
   */
  public async startScreenShare(): Promise<void> {
    return this._nativeModule.startScreenShare();
  }

  /**
   * Stops a screen sharing session.
   * @returns {Promise<void>}
   */
  public async stopScreenShare(): Promise<void> {
    return this._nativeModule.stopScreenShare();
  }

  /**
   * Sets the direction a participant is facing in space.
   * @param participant<Participant> The selected remote participant.
   * @param direction<SpatialDirection> The direction the local participant is facing in space.
   * @returns {Promise<void>}
   */
  public async setSpatialDirection(
    participant: Participant,
    direction: SpatialDirection
  ): Promise<void> {
    return this._nativeModule.setSpatialDirection(participant, direction);
  }

  /**
   * Configures a spatial environment of an application, so the audio renderer understands which directions the application considers forward, up, and right and which units it uses for distance.
   * @param scale<SpatialScale> The application's distance units or scale in application units per one meter. The value must be greater than 0.
   * @param forward<SpatialPosition> A vector describing the direction the application considers as forward. The value must be orthogonal to up and right.
   * @param up<SpatialPosition> A vector describing the direction the application considers as up. The value must be orthogonal to forward and right.
   * @param right<SpatialPosition> A vector describing the direction the application considers as right. The value must be orthogonal to forward and up.
   * @returns {Promise<void>}
   */
  public async setSpatialEnvironment(
    scale: SpatialScale,
    forward: SpatialPosition,
    up: SpatialPosition,
    right: SpatialPosition
  ): Promise<void> {
    return this._nativeModule.setSpatialEnvironment(scale, forward, up, right);
  }

  /**
   * Sets a participant's position in space to enable the spatial audio experience during a Dolby Voice conference.
   * @param participant<Participant> The selected remote participant.
   * @param position<SpatialPosition> The participant's audio location from which their audio will be rendered.
   * @returns {Promise<void>}
   */
  public async setSpatialPosition(
    participant: Participant,
    position: SpatialPosition
  ): Promise<void> {
    return this._nativeModule.setSpatialPosition(participant, position);
  }
}

export default new ConferenceService();
