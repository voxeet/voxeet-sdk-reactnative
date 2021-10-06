import ConferenceService from '../ConferenceService';
import type { Conference } from '../models';
import {
  ConferenceMixingOptions,
  ConferencePermission,
  ConferenceReplayOptions,
  ConferenceStatus,
  ParticipantPermissions,
} from '../models';
import { transformToConference, transformToParticipant } from '../transformers';
import { NativeModules } from 'react-native';

const { DolbyIoIAPIConferenceService } = NativeModules;

/** ConferenceService tests */

describe('ConferenceService', () => {
  describe('create()', () => {
    it('should invoke exported method', () => {
      const options = {
        alias: 'Example conference',
      };
      ConferenceService.create(options);
      expect(DolbyIoIAPIConferenceService.create).toHaveBeenCalledWith(options);
    });

    it('should invoke exported method with empty object when invoked parameterless', () => {
      ConferenceService.create();
      expect(DolbyIoIAPIConferenceService.create).toHaveBeenLastCalledWith({});
    });
  });

  /** "fetch" method */

  test('Fetch method calls exported fetch method', () => {
    ConferenceService.fetch();
    expect(DolbyIoIAPIConferenceService.fetch).toHaveBeenCalled();
  });

  /** "current" method */

  test('Current method calls exported current method', () => {
    ConferenceService.current();
    expect(DolbyIoIAPIConferenceService.current).toHaveBeenCalled();
  });

  /** "replay" method */

  const mockConference: Conference = {
    participants: [{ id: '123', info: { name: 'John Doe' } }],
    status: ConferenceStatus.DEFAULT,
  };

  const mockConferenceReplayOptions: ConferenceReplayOptions = {
    offset: 1,
  };

  const mockConferenceMixingOptions: ConferenceMixingOptions = {
    enabled: true,
  };

  test('Replay method calls exported replay method', () => {
    ConferenceService.replay(
      mockConference,
      mockConferenceReplayOptions,
      mockConferenceMixingOptions
    );
    expect(DolbyIoIAPIConferenceService.replay).toHaveBeenCalledWith(
      mockConference,
      mockConferenceReplayOptions,
      mockConferenceMixingOptions
    );
  });

  test('Replay method without replay options calls exported replay method with replay offset param set to 0', () => {
    ConferenceService.replay(
      mockConference,
      undefined,
      mockConferenceMixingOptions
    );
    expect(DolbyIoIAPIConferenceService.replay).toHaveBeenCalledWith(
      mockConference,
      {
        offset: 0,
      },
      mockConferenceMixingOptions
    );
  });

  /** "getAudioLevel" method */

  test('"getAudioLevel" method', () => {
    ConferenceService.getAudioLevel({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.getAudioLevel).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "getLocalStats" method */

  test('"getLocalStats" method', () => {
    ConferenceService.getLocalStats();
    expect(DolbyIoIAPIConferenceService.getLocalStats).toHaveBeenCalled();
  });

  /** "getMaxVideoForwarding" method */

  test('"getMaxVideoForwarding" method', () => {
    ConferenceService.getMaxVideoForwarding();
    expect(
      DolbyIoIAPIConferenceService.getMaxVideoForwarding
    ).toHaveBeenCalled();
  });

  /** "getParticipant" method */

  test('"getParticipant" method', () => {
    ConferenceService.getParticipant();
    expect(DolbyIoIAPIConferenceService.getParticipant).toHaveBeenCalled();
  });

  /** "getParticipants" method */

  test('"getParticipants" method', () => {
    ConferenceService.getParticipants({
      participants: [
        {
          id: '123',
          info: {
            name: 'John Doe',
          },
        },
      ],
      status: ConferenceStatus.DEFAULT,
    });
    expect(DolbyIoIAPIConferenceService.getParticipants).toHaveBeenCalledWith({
      participants: [
        {
          id: '123',
          info: {
            name: 'John Doe',
          },
        },
      ],
      status: ConferenceStatus.DEFAULT,
    });
  });

  /** "getStatus" method */

  test('"getStatus" method', () => {
    ConferenceService.getStatus({
      participants: [
        {
          id: '123',
          info: {
            name: 'John Doe',
          },
        },
      ],
      status: ConferenceStatus.DEFAULT,
    });
    expect(DolbyIoIAPIConferenceService.getStatus).toHaveBeenCalledWith({
      participants: [
        {
          id: '123',
          info: {
            name: 'John Doe',
          },
        },
      ],
      status: ConferenceStatus.DEFAULT,
    });
  });

  /** "isOutputMuted" method */

  test('"isOutputMuted" method', () => {
    ConferenceService.isOutputMuted();
    expect(DolbyIoIAPIConferenceService.isOutputMuted).toHaveBeenCalled();
  });

  /** "isMuted" method */

  test('"isMuted" method', () => {
    ConferenceService.isMuted();
    expect(DolbyIoIAPIConferenceService.isMuted).toHaveBeenCalled();
  });

  /** "isSpeaking" method */

  test('"isSpeaking" method', () => {
    ConferenceService.isSpeaking({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.isSpeaking).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "setAudioProcessing" method */

  test('"setAudioProcessing" method', () => {
    ConferenceService.setAudioProcessing({});
    expect(
      DolbyIoIAPIConferenceService.setAudioProcessing
    ).toHaveBeenCalledWith({});
  });

  /** "setMaxVideoForwarding" method */

  test('"setMaxVideoForwarding" method', () => {
    ConferenceService.setMaxVideoForwarding(2);
    expect(
      DolbyIoIAPIConferenceService.setMaxVideoForwarding
    ).toHaveBeenCalledWith(2);
  });

  /** "mute" method */

  test('"mute" method', () => {
    const participant = {
      id: '123',
      info: {
        name: 'John Doe',
      },
    };

    ConferenceService.mute(true, participant);
    expect(DolbyIoIAPIConferenceService.mute).toHaveBeenCalledWith(
      true,
      participant
    );
  });

  /** "updatePermissions" method */

  const mockParticipantPermissions: ParticipantPermissions = {
    participant: {
      id: '123',
      info: {
        name: 'John Doe',
      },
    },
    permissions: [
      ConferencePermission.INVITE,
      ConferencePermission.JOIN,
      ConferencePermission.RECORD,
    ],
  };

  test('"updatePermissions" method', () => {
    ConferenceService.updatePermissions([mockParticipantPermissions]);
    expect(DolbyIoIAPIConferenceService.updatePermissions).toHaveBeenCalledWith(
      [mockParticipantPermissions]
    );
  });

  /** "startAudio" method */

  test('"startAudio" method', () => {
    ConferenceService.startAudio({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.startAudio).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "startVideo" method */

  test('"startVideo" method', () => {
    ConferenceService.startVideo({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.startVideo).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "stopAudio" method */

  test('"stopAudio" method', () => {
    ConferenceService.stopAudio({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.stopAudio).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "stopVideo" method */

  test('"stopVideo" method', () => {
    ConferenceService.stopVideo({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.stopVideo).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "join" method */

  const mockConference_2: Conference = {
    participants: [
      {
        id: '123',
        info: {
          name: 'John Doe',
        },
      },
    ],
    status: ConferenceStatus.DEFAULT,
  };

  test('"join" method', () => {
    ConferenceService.join(mockConference_2, {});
    expect(DolbyIoIAPIConferenceService.join).toHaveBeenCalledWith(
      mockConference_2,
      {}
    );
  });

  /** "kick" method */

  test('"kick" method', () => {
    ConferenceService.kick({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
    expect(DolbyIoIAPIConferenceService.kick).toHaveBeenCalledWith({
      id: '123',
      info: {
        name: 'John Doe',
      },
    });
  });

  /** "leave" method */

  test('"leave" method', () => {
    ConferenceService.leave();
    expect(DolbyIoIAPIConferenceService.leave).toHaveBeenCalled();
  });

  // TODO "onStatusChange" method
  // TODO "onPermissionsChange" method
  // TODO "onParticipantsChange" method
  // TODO "onStreamsChange" method
});

describe('ConferenceService - transformers', () => {
  describe('transformToConference()', () => {
    it('should return Conference object', () => {
      expect(
        transformToConference({
          participants: [
            {
              info: {
                name: 'Jack',
              },
              id: '111',
            },
          ],
          alias: 'Conference',
          id: '111',
          status: ConferenceStatus.DEFAULT,
        })
      ).toStrictEqual({
        participants: [
          {
            info: {
              name: 'Jack',
            },
            id: '111',
            status: undefined,
            type: undefined,
          },
        ],
        alias: 'Conference',
        id: '111',
        isNew: undefined,
        status: ConferenceStatus.DEFAULT,
      });
    });
  });

  describe('transformToParticipant()', () => {
    it('should return Participant object', () => {
      expect(
        transformToParticipant({
          info: {
            name: 'Jack',
          },
          id: '111',
        })
      ).toStrictEqual({
        info: {
          name: 'Jack',
        },
        id: '111',
        status: undefined,
        type: undefined,
      });
    });
  });
});
