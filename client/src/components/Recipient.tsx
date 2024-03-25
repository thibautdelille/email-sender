import { Button, Flex, Icon, Td, Text, Tr } from '@chakra-ui/react';
import { RecipientType } from '../types';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

type RecipientProps = {
  recipient: RecipientType;
  onSendMessage: (recipient: RecipientType) => void;
};

export const Recipient = ({ recipient, onSendMessage }: RecipientProps) => {
  const [isSent, setIsSent] = useState(recipient.sent);

  useEffect(() => {
    setIsSent(recipient.sent);
  }, [recipient.sent]);

  const handleClick = () => {
    onSendMessage(recipient);
  };
  return (
    <Tr>
      <Td>
        <Text fontSize="sm">{recipient.name}</Text>
      </Td>
      <Td>
        <Text fontSize="sm">{recipient.email}</Text>
      </Td>
      <Td>
        <Button size="xs" onClick={handleClick}>
          Send
        </Button>
      </Td>
      <Td>
        <Flex align="center" gap={2} width="120px">
          {recipient.status === 'success' && (
            <>
              <Icon color="green.500" as={CheckCircleIcon} />
              <Text color="green.500">Saved</Text>
            </>
          )}
          {isSent && (!recipient.status || recipient.status === 'idle') && (
            <>
              <Icon color="gray.300" as={CheckCircleIcon} />
              <Text color="gray.300">Sent</Text>
            </>
          )}
          {recipient.status === 'error' && (
            <>
              <Icon color="red.500" as={WarningIcon} />
              <Text color="red.500">Error</Text>
            </>
          )}
        </Flex>
      </Td>
    </Tr>
  );
};
