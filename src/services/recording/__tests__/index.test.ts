import RecordingService from '../RecordingService';
import { NativeModules } from 'react-native';

/** Mocking function */

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.DolbyIoIAPIRecordingServiceModule = {
    current: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
  };
  RN.NativeModules.DolbyIoIAPIModule = {};
  return RN;
});

const { DolbyIoIAPIRecordingServiceModule } = NativeModules;

describe('RecordingService', () => {
  it('invokes start method', () => {
    RecordingService.start();
    expect(DolbyIoIAPIRecordingServiceModule.start).toHaveBeenCalled();
  });

  it('invokes stop method', () => {
    RecordingService.stop();
    expect(DolbyIoIAPIRecordingServiceModule.stop).toHaveBeenCalled();
  });

  it('invokes current method', () => {
    RecordingService.current();
    expect(DolbyIoIAPIRecordingServiceModule.current).toHaveBeenCalled();
  });
});
