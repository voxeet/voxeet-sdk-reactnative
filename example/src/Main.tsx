import React, { useContext } from 'react';

import { DolbyIOContext } from '@components/DolbyIOProvider';

import ConferenceScreen from './screens/ConferenceScreen';
import InitializationScreen from './screens/InitializationScreen';
import JoinScreen from './screens/JoinScreen';
import LoginScreen from './screens/LoginScreen';

const Main = () => {
  const { isInitialized, me, conference } = useContext(DolbyIOContext);

  if (!isInitialized) {
    return <InitializationScreen />;
  } else if (!me) {
    return <LoginScreen />;
  } else if (!conference) {
    return <JoinScreen />;
  } else {
    return <ConferenceScreen />;
  }
};

export default Main;
