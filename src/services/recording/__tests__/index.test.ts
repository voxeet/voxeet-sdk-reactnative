import RecordingService from '../RecordingService';
import { NativeModules } from 'react-native';

const { DolbyIoIAPIRecordingServiceModule } = NativeModules;

describe('RecordingService', () => {
  describe('start()', () => {
    it('should invoke exported start method', () => {
      RecordingService.start();
      expect(DolbyIoIAPIRecordingServiceModule.start).toHaveBeenCalled();
    });
  });

  describe('stop()', () => {
    it('should invoke exported stop method', () => {
      RecordingService.stop();
      expect(DolbyIoIAPIRecordingServiceModule.stop).toHaveBeenCalled();
    });
  });

  describe('current()', () => {
    it('should invoke exported current method', () => {
      RecordingService.current();
      expect(DolbyIoIAPIRecordingServiceModule.current).toHaveBeenCalled();
    });
  });
});
