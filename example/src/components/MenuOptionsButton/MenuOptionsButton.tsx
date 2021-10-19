import styles from './MenuOptionsButton.style';
import COLORS from '@constants/colors.constants';
import Space from '@ui/Space';
import Text from '@ui/Text';
import React, { FunctionComponent } from 'react';
import { View } from 'react-native';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

type Options = Array<{
  text: string;
  value: string;
}>;

type MenuOptionsButtonProps = {
  options: Options;
  onSelect: (optionValue: string) => void;
  buttonText: string;
};

export const MenuOptionsButton: FunctionComponent<MenuOptionsButtonProps> = ({
  options,
  onSelect,
  buttonText,
}) => {
  return (
    <Space mr="xs">
      <Menu onSelect={onSelect}>
        <MenuTrigger triggerOnLongPress>
          <View style={styles.buttonText}>
            <Text size="s" color={COLORS.BLACK}>
              {buttonText}
            </Text>
          </View>
        </MenuTrigger>
        <MenuOptions
          optionsContainerStyle={styles.optionsContainerStyle}
          customStyles={{
            optionWrapper: styles.optionWrapper,
            optionText: styles.optionText,
          }}
        >
          {options.map((option) => (
            <MenuOption text={option.text} value={option.value} />
          ))}
        </MenuOptions>
      </Menu>
    </Space>
  );
};

export default MenuOptionsButton;
