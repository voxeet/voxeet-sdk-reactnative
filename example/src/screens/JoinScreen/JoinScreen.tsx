import styles from './JoinScreen.style';
import { DolbyIOContext } from '@components/DolbyIOProvider';
import COLORS from '@constants/colors.constants';
import Button from '@ui/Button';
import Input from '@ui/Input';
import Space from '@ui/Space';
import Text from '@ui/Text';
// @ts-ignore
import Chance from 'chance';
import React, { FunctionComponent, useState, useContext } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const chance = new Chance();

const JoinScreen: FunctionComponent = () => {
  const [alias, setAlias] = useState(`${chance.country({ full: true })}`);
  const { createAndJoin, join, replay } = useContext(DolbyIOContext);

  const createConference = (liveRecording: boolean = false) => {
    createAndJoin(alias, liveRecording);
  };

  const joinConference = () => {
    join(alias);
  };

  const replayLastConference = () => {
    replay();
  };

  return (
    <LinearGradient colors={COLORS.GRADIENT} style={styles.wrapper}>
      <SafeAreaView style={styles.wrapper}>
        <Space mh="m" mv="s">
          <Space mb="l">
            <Text color={COLORS.WHITE} header>
              Dolby.io
            </Text>
            <Text color={COLORS.WHITE} size="s">
              IAPI SDK for React Native
            </Text>
            <Text color={COLORS.WHITE} size="xs" header>
              TEST APP
            </Text>
          </Space>
          <Text color={COLORS.WHITE} header size="s">
            Join Conference
          </Text>
          <Space mt="m">
            <Input label="Conference alias" onChange={setAlias} value={alias} />
          </Space>
          <Space mt="m">
            <Button
              text="Create a new conference"
              onPress={() => createConference()}
            />
          </Space>
          <Space mt="m">
            <Button
              text="Create a new conference with mixer"
              onPress={() => createConference(true)}
            />
          </Space>
          <Space mt="m">
            <Button text="Join existing conference" onPress={joinConference} />
          </Space>
          <Space mt="m">
            <Button
              text="Replay last conference"
              onPress={replayLastConference}
            />
          </Space>
        </Space>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default JoinScreen;
