import DolbyIoIAPI from '../../../../src/DolbyIoIAPI';
import type {
  Participant,
  Conference,
} from '../../../../src/services/conference/models';
import styles from './ConferenceScreen.style';
import ConferenceScreenBottomSheet from './ConferenceScreenBottomSheet';
import ParticipantAvatar from './ParticipantAvatar';
import { DolbyIOContext } from '@components/DolbyIOProvider';
import COLORS from '@constants/colors.constants';
import LeaveConferenceButton from '@screens/ConferenceScreen/LeaveConferenceButton';
import { RecordingDotsText } from '@screens/ConferenceScreen/RecordingDots';
import Button from '@ui/Button';
import Space from '@ui/Space';
import Text from '@ui/Text';
import React, { FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConferenceScreen: FunctionComponent = () => {
  const { user, conference } = useContext(DolbyIOContext);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const { participants: initialParticipants } = conference as Conference;
  const [updatedParticipants, setUpdatedParticipants] =
    useState<Participant[]>(initialParticipants);

  // TODO remove when onParticipantsChange will be ready and change implementation
  const updateParticipantList = async () => {
    const conf = await DolbyIoIAPI.conference.current();
    setUpdatedParticipants(conf.participants);
  };

  if (!conference || !user) {
    return <LinearGradient colors={COLORS.GRADIENT} style={styles.wrapper} />;
  }

  return (
    <MenuProvider
      customStyles={{
        backdrop: styles.menuBackdrop,
      }}
    >
      <LinearGradient colors={COLORS.GRADIENT} style={styles.wrapper}>
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.top}>
            <Space mh="m" mv="m">
              <Space mb="s" style={styles.topBar}>
                <Text size="xs">Logged as: {user.info.name}</Text>
                <LeaveConferenceButton />
              </Space>
              <Text size="s" align="center">
                Conference: <Text weight="bold">{conference.alias}</Text>
              </Text>
              {isRecording ? (
                <RecordingDotsText text="Conference is being recorded" />
              ) : null}
            </Space>
          </View>
          <View style={styles.center} />
          <View style={styles.bottom}>
            <Space mh="m" mt="m" mb="xs">
              <Button
                text="Refresh participants"
                size="small"
                onPress={updateParticipantList}
              />
              <Text
                header
                size="s"
              >{`Participants (${updatedParticipants.length})`}</Text>
            </Space>
            <Space mb="m">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Space mh="m" style={styles.participantsList}>
                  {updatedParticipants.map((p: Participant) => (
                    <ParticipantAvatar key={p.id} {...p} />
                  ))}
                </Space>
              </ScrollView>
            </Space>
          </View>
        </SafeAreaView>
        <ConferenceScreenBottomSheet setIsRecording={setIsRecording} />
      </LinearGradient>
    </MenuProvider>
  );
};

export default ConferenceScreen;
