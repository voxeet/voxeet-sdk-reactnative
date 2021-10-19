import React, { useState } from 'react';
import { Alert } from 'react-native';

import DolbyIoIAPI from '@dolbyio/react-native-iapi-sdk';
// @ts-ignore
import { APP_ID, APP_SECRET } from '@env';

import { Codec, RTCPMode } from '../../../../src/services/conference/models';
import type { Conference } from '../../../../src/services/conference/models';
import type { User } from '../../../../src/services/session/models';

export interface IDolbyIOProvider {
  user?: User;
  conference?: Conference;
  lastConference?: Conference;
  isInitialized?: Boolean;
  initialize: () => void;
  openSession: (name: string) => void;
  createAndJoin: (alias: string, liveRecording: boolean) => void;
  join: (alias: string) => void;
  replay: () => void;
  leave: () => void;
}

export const DolbyIOContext = React.createContext<IDolbyIOProvider>({
  initialize: () => {},
  openSession: () => {},
  createAndJoin: () => {},
  join: () => {},
  replay: () => {},
  leave: () => {},
});

// let onStatusChangeRemover: () => void | undefined;

const DolbyIOProvider: React.FC = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [conference, setConference] = useState<Conference | undefined>(
    undefined
  );
  const [lastConference, setLastConference] = useState<Conference | undefined>(
    undefined
  );
  const [user, setUser] = useState<User | undefined>(undefined);

  // useEffect(() => {
  //   if (conference) {
  //     if (onStatusChangeRemover) {
  //       onStatusChangeRemover();
  //     }
  //     onStatusChangeRemover = DolbyIoIAPI.conference.onStatusChange((event) => {
  //       Toast.show({
  //         type: 'info',
  //         text1: 'Conference status changed',
  //         text2: JSON.stringify(event),
  //       });
  //     });
  //   } else {
  //     if (onStatusChangeRemover) {
  //       onStatusChangeRemover();
  //     }
  //   }
  // }, [conference]);

  const initialize = async () => {
    try {
      if (await DolbyIoIAPI.conference.current()) {
        await DolbyIoIAPI.conference.leave({ leaveRoom: true });
      }
    } catch (e) {}

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
      const currentUser = await DolbyIoIAPI.session.getCurrentUser();
      setUser(currentUser);
      Alert.alert(`Session opened as ${name}`);
    } catch (e: any) {
      setUser(undefined);
      Alert.alert('Session not opened', e.toString());
    }
  };
  const createAndJoin = async (alias: string, liveRecording: boolean) => {
    try {
      const conferenceParams = {
        liveRecording: liveRecording,
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
      console.log(JSON.stringify(joinedConference, null, 2));
      setConference(joinedConference);
    } catch (e: any) {
      Alert.alert('Conference not joined', e.toString());
    }
  };

  const join = async (alias: string) => {
    try {
      const fetchedConference = await DolbyIoIAPI.conference.fetch(alias);

      const joinOptions = {
        constraints: {
          audio: true,
          video: false,
        },
        simulcast: false,
      };
      const joinedConference = await DolbyIoIAPI.conference.join(
        fetchedConference,
        joinOptions
      );
      console.log(JSON.stringify(joinedConference, null, 2));
      setConference(joinedConference);
    } catch (e: any) {
      Alert.alert('Conference not joined', e.toString());
    }
  };

  const replay = async () => {
    try {
      console.log(JSON.stringify(lastConference, null, 2), 'LAST CONFERENCE');
      const replayedConference = await DolbyIoIAPI.conference.replay(
        lastConference as Conference
      );
      console.log(JSON.stringify(replayedConference, null, 2));
    } catch (e: any) {
      Alert.alert('Conference not replayed', e.toString());
    }
  };

  const leave = async () => {
    try {
      const conferenceLeaveOptions = {
        leaveRoom: true,
      };

      setLastConference(conference);
      await DolbyIoIAPI.conference.leave(conferenceLeaveOptions);
      setConference(undefined);
      setUser(undefined);
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
    join,
    replay,
    leave,
  };

  return (
    <DolbyIOContext.Provider value={contextValue}>
      {children}
    </DolbyIOContext.Provider>
  );
};

export default DolbyIOProvider;
