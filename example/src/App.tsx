import React, { Component } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import DolbyIOProvider from '@components/DolbyIOProvider';
import FilePresentationHandler, {
  FilePresentationProvider,
} from '@components/FilePresentationHandler';
import InvitationHandler from '@components/InvitationHandler';
import MessageHandler from '@components/MessageHandler';
import RecordingProvider from '@components/RecordingProvider';
import VideoPresentationHandler from '@components/VideoPresentationHandler';
import COLORS from '@constants/colors.constants';

import Main from './Main';

export interface Props {}

export interface State {}

export default class App extends Component<Props, State> {
  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <StatusBar backgroundColor={COLORS.BLACK} />
          <DolbyIOProvider>
            <RecordingProvider>
              <FilePresentationProvider>
                <Main />
                <FilePresentationHandler />
              </FilePresentationProvider>
            </RecordingProvider>
            <VideoPresentationHandler />
            <MessageHandler />
            <InvitationHandler />
          </DolbyIOProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    );
  }
}
