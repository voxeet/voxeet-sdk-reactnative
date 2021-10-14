import VideoPresentationService from '../VideoPresentation';
import { NativeModules } from 'react-native';

const { DolbyIoIAPIVideoPresentationService } = NativeModules;

describe('VideoPresentationService', () => {
  describe('start()', () => {
    it('should invoke exported start method', () => {
      VideoPresentationService.start('some url');
      expect(DolbyIoIAPIVideoPresentationService.start).toHaveBeenCalledWith(
        'some url'
      );
    });
  });
  describe('stop()', () => {
    it('should invoke exported stop method', () => {
      VideoPresentationService.stop();
      expect(DolbyIoIAPIVideoPresentationService.stop).toHaveBeenCalled();
    });
  });
  describe('seek()', () => {
    it('should invoke exported seek method', () => {
      VideoPresentationService.seek(1634290080);
      expect(DolbyIoIAPIVideoPresentationService.seek).toHaveBeenCalled();
    });
  });
  describe('play()', () => {
    it('should invoke exported play method', () => {
      VideoPresentationService.play();
      expect(DolbyIoIAPIVideoPresentationService.play).toHaveBeenCalled();
    });
  });
  describe('pause()', () => {
    it('should invoke exported pause method', () => {
      VideoPresentationService.pause(1634290080);
      expect(DolbyIoIAPIVideoPresentationService.pause).toHaveBeenCalled();
    });
  });
});
