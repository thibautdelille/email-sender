import { Flex, useBreakpoint } from '@chakra-ui/react';
import { Sender } from './Sender';
import { Message } from './Message';
import { Recipients } from './Recipients';
import { useState } from 'react';
import { NavBar } from './NavBar';
import { useUser } from '../provider/userProvider';
import { useGetUserData } from '../api/getUserData';
import { useUpdateUserData } from '../api/updateUserData';
import { MessageData, RecipientType, SenderData } from '../types';

export const Home = () => {
  const { user } = useUser();
  const getUserData = useGetUserData(user?.uid);
  const updateUserData = useUpdateUserData();
  const [from, setFrom] = useState(user?.email || '');
  const breakpoint = useBreakpoint();

  if (getUserData.isLoading) {
    return <div>Loading...</div>;
  }

  if (getUserData.isError) {
    return <div>Error: {getUserData.error.message}</div>;
  }

  if (!getUserData.data) {
    return <div>No data found</div>;
  }

  const { appPassword, name, message, subject, recipients } = getUserData.data;

  const handleSave = ({ name, appPassword }: SenderData) => {
    if (!user) {
      return;
    }
    updateUserData.mutate({
      userId: user.uid,
      appPassword,
      name,
      message,
      subject,
      recipients,
    });
  };

  const handleSaveMessage = ({ subject, message }: MessageData) => {
    if (!user) {
      return;
    }
    updateUserData.mutate({
      userId: user.uid,
      appPassword,
      name,
      message,
      subject,
      recipients,
    });
  };

  const handleSaveRecipients = (recipients: RecipientType[]) => {
    if (!user) {
      return;
    }
    updateUserData.mutate({
      userId: user.uid,
      appPassword,
      name,
      message,
      subject,
      recipients,
    });
  };

  return (
    <Flex gap={4} direction="column" width="100%" pb={4}>
      <NavBar />
      <Flex
        px={4}
        gap={4}
        width="100%"
        align="flex-start"
        direction={
          breakpoint === 'xl' || breakpoint === '2xl' ? 'row' : 'column'
        }
      >
        <Flex gap={4} direction="column" flex="1 1 auto">
          <Sender
            from={from}
            setFrom={setFrom}
            appPassword={appPassword}
            name={name}
            onSave={handleSave}
          />
          <Message
            onSave={handleSaveMessage}
            message={message}
            subject={subject}
          />
        </Flex>

        <Flex gap={4} direction="column" flex="1 1 auto">
          <Recipients
            recipients={recipients || []}
            from={from}
            name={name}
            appPassword={appPassword}
            subject={subject}
            message={message}
            onSave={handleSaveRecipients}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
