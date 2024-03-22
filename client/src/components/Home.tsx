import { Flex } from '@chakra-ui/react';
import { Sender } from './Sender';
import { Message } from './Message';
import { Recipients } from './Recipients';
import { useState } from 'react';
import { NavBar } from './NavBar';
import { useUser } from '../provider/userProvider';

export const Home = () => {
  const { user } = useUser();
  const [from, setFrom] = useState(user?.email || '');
  const [appPassword, setAppPassword] = useState('');
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState(
    '<p>Hello {name},<br/>Enter your message<br/>Your name</p>'
  );
  return (
    <Flex gap={4} direction="column" width="100%">
      <NavBar />
      <Flex px={4} gap={4} direction="column" width="100%">
        <Flex gap={4}>
          <Sender
            from={from}
            setFrom={setFrom}
            appPassword={appPassword}
            setAppPassword={setAppPassword}
            name={name}
            setName={setName}
          />
          <Message
            message={message}
            setMessage={setMessage}
            subject={subject}
            setSubject={setSubject}
          />
        </Flex>
        <Recipients
          from={from}
          name={name}
          appPassword={appPassword}
          subject={subject}
          message={message}
        />
      </Flex>
    </Flex>
  );
};
