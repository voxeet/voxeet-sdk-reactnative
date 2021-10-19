import { NativeModules } from 'react-native';

import FilePresentationService from '../FilePresentationService';

const { DolbyIoIAPIFilePresentationService } = NativeModules;

const testFileConverted = {
  id: '102030',
  imageCount: 3,
};

const testFile = {
  url: '../../../../example/src/assets/dolbyIo.jpg',
};

describe('FilePresentationService', () => {
  describe('stop()', () => {
    it('should invoke exported method', () => {
      FilePresentationService.stop();
      expect(DolbyIoIAPIFilePresentationService.stop).toHaveBeenCalled();
    });
  });

  describe('start()', () => {
    it('should invoke exported method with correct arguments', () => {
      FilePresentationService.start(testFileConverted);
      expect(DolbyIoIAPIFilePresentationService.start).toHaveBeenCalledWith(
        testFileConverted
      );
    });
  });

  describe('getThumbnail()', () => {
    it('should invoke exported method with correct arguments', () => {
      FilePresentationService.getThumbnail(1);
      expect(
        DolbyIoIAPIFilePresentationService.getThumbnail
      ).toHaveBeenCalledWith(1);
    });
  });

  describe('setPage()', () => {
    it('should invoke exported method with correct arguments', () => {
      FilePresentationService.setPage(2);
      expect(DolbyIoIAPIFilePresentationService.setPage).toHaveBeenCalledWith(
        2
      );
    });
  });

  describe('convert()', () => {
    it('should invoke exported method with correct arguments', () => {
      FilePresentationService.convert(testFile);
      expect(DolbyIoIAPIFilePresentationService.convert).toHaveBeenCalledWith(
        testFile
      );
    });
  });

  describe('getCurrent()', () => {
    it('should invoke exported method', () => {
      FilePresentationService.getCurrent();
      expect(DolbyIoIAPIFilePresentationService.getCurrent).toHaveBeenCalled();
    });
  });

  describe('getImage()', () => {
    it('should invoke exported method with correct arguments', () => {
      FilePresentationService.getImage(2);
      expect(DolbyIoIAPIFilePresentationService.getImage).toHaveBeenCalledWith(
        2
      );
    });
  });
});