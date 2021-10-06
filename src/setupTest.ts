/* eslint-disable no-undef */

jest.mock('react-native', () => {
  const RN: any = jest.requireActual('react-native');
  RN.NativeModules.DolbyIoIAPIModule = {
    initialize: jest.fn(),
    initializeToken: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  };
  RN.NativeModules.DolbyIoIAPIConferenceService = {
    create: jest.fn(),
    fetch: jest.fn(),
    current: jest.fn(),
    replay: jest.fn(),
    getAudioLevel: jest.fn(),
    getAudioProcessing: jest.fn(),
    getLocalStats: jest.fn(),
    getMaxVideoForwarding: jest.fn(),
    getParticipant: jest.fn(),
    getParticipants: jest.fn(),
    getStatus: jest.fn(),
    isOutputMuted: jest.fn(),
    isMuted: jest.fn(),
    isSpeaking: jest.fn(),
    setAudioProcessing: jest.fn(),
    setMaxVideoForwarding: jest.fn(),
    mute: jest.fn(),
    updatePermissions: jest.fn(),
    startAudio: jest.fn(),
    startVideo: jest.fn(),
    stopAudio: jest.fn(),
    stopVideo: jest.fn(),
    join: jest.fn(),
    kick: jest.fn(),
    leave: jest.fn(),
  };
  RN.NativeModules.DolbyIoIAPISessionServiceModule = {
    open: jest.fn(),
    close: jest.fn(),
  };
  return RN;
});