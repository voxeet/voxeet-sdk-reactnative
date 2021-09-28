import { Codec, RTCPMode } from '../../../../src/services/conference/models';
import type { Conference } from '../../../../src/services/conference/models';
import { APP_ID, APP_SECRET } from '../../constants/config.constants';
import DolbyIoIAPI from '@dolbyio/react-native-iapi-sdk';
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export type User = {
  name: string;
};

export interface IDolbyIOProvider {
  user?: User;
  conference?: Conference;
  isInitialized?: Boolean;
  initialize: () => void;
  openSession: (name: string) => void;
  createAndJoin: (alias: string) => void;
  leave: () => void;
}

export const DolbyIOContext = React.createContext<IDolbyIOProvider>({
  initialize: () => {},
  openSession: () => {},
  createAndJoin: () => {},
  leave: () => {},
});

let onStatusChangeRemover: () => void | undefined;

const DolbyIOProvider: React.FC = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [conference, setConference] = useState<Conference | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    if (conference) {
      if (onStatusChangeRemover) {
        onStatusChangeRemover();
      }
      onStatusChangeRemover = DolbyIoIAPI.conference.onStatusChange((event) => {
        Toast.show({
          type: 'info',
          text1: 'Conference status changed',
          text2: JSON.stringify(event),
        });
      });
    } else {
      if (onStatusChangeRemover) {
        onStatusChangeRemover();
      }
    }
  }, [conference]);

  const initialize = async () => {
    try {
      await DolbyIoIAPI.initialize(APP_ID, APP_SECRET);
      setIsInitialized(true);
      Alert.alert('App initialized successfully');
    } catch (e: any) {
      setIsInitialized(false);
      Alert.alert('App not initialized', e);
    }
  };
  const openSession = async (name: string) => {
    try {
      await DolbyIoIAPI.session.open({ name });
      setUser({
        name,
      });
      Alert.alert(`Session opened as ${name}`);
    } catch (e: any) {
      setUser(undefined);
      Alert.alert('Session not opened', e.toString());
    }
  };
  const createAndJoin = async (alias: string) => {
    try {
      const conferenceParams = {
        liveRecording: false,
        rtcpMode: RTCPMode.AVERAGE,
        ttl: 0,
        videoCodec: Codec.H264,
        dolbyVoice: true,
      };
      const conferenceOptions = {
        alias,
        params: conferenceParams,
      };

      const createdConference = await DolbyIoIAPI.conference.create(
        conferenceOptions
      );

      const joinOptions = {
        constraints: {
          audio: true,
          video: false,
        },
        simulcast: false,
      };
      const joinedConference = await DolbyIoIAPI.conference.join(
        createdConference,
        joinOptions
      );

      setConference(joinedConference);
    } catch (e: any) {
      Alert.alert('Conference not joined', e);
    }
  };
  const leave = async () => {
    try {
      const conferenceLeaveOptions = {
        leaveRoom: true,
      };

      await DolbyIoIAPI.conference.leave(conferenceLeaveOptions);
      setConference(undefined);
    } catch (e: any) {
      Alert.alert('Conference not left', e);
    }
  };

  const contextValue = {
    user,
    conference,
    isInitialized,
    initialize,
    openSession,
    createAndJoin,
    leave,
  };

  return (
    <DolbyIOContext.Provider value={contextValue}>
      {children}
    </DolbyIOContext.Provider>
  );
};

export default DolbyIOProvider;