import { DolbyIOContext } from '@components/DolbyIOProvider';
import MenuOptionsButton from '@components/MenuOptionsButton';
import React, { useContext } from 'react';

const LeaveConferenceButton = () => {
  const { leave } = useContext(DolbyIOContext);
  const leaveOptions = [
    { text: 'Leave and close session', value: 'leaveAndCloseSession' },
    {
      text: 'Leave without closing session',
      value: 'leaveWithoutClosingSession',
    },
  ];
  const onSelect = async (value: string) => {
    switch (value) {
      case 'leaveAndCloseSession':
        await leave(true);
        return;
      case 'leaveWithoutClosingSession':
        await leave(false);
        return;
      default:
        return;
    }
  };

  return (
    <MenuOptionsButton
      options={leaveOptions}
      onSelect={onSelect}
      buttonText="Leave"
    />
  );
};

export default LeaveConferenceButton;
