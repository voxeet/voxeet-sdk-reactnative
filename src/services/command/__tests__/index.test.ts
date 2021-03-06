import { NativeModules } from 'react-native';

import CommandService from '../CommandService';
import { CommandServiceEventNames } from '../events';

const { CommsAPICommandServiceModule } = NativeModules;

describe('CommandService', () => {
  CommandService._nativeEvents.addListener = jest.fn();

  describe('send()', () => {
    it('should invoke exported send method with correct arguments', () => {
      CommandService.send('some message');
      expect(CommsAPICommandServiceModule.send).toHaveBeenCalledWith(
        'some message'
      );
    });
  });

  describe('onMessageReceived()', () => {
    it('should invoke NativeEvents.addListener with MessageReceived event', () => {
      CommandService.onMessageReceived(() => {});
      expect(CommandService._nativeEvents.addListener).toHaveBeenCalledWith(
        CommandServiceEventNames.MessageReceived,
        expect.any(Function)
      );
    });
  });
});
