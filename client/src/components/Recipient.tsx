import { Button, Flex, Icon, Td, Text, Tr } from '@chakra-ui/react';
import { RecipientType } from '../types';
import { useSendEmail } from '../api/sendEmail';
import { useState } from 'react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';

type RecipientProps = {
  recipient: RecipientType;
  from: string;
  name: string;
  appPassword: string;
  subject: string;
  message: string;
};

function replaceAllName(message: string, name: string) {
  return message.replace(/{name}/g, name);
}

export const Recipient = ({
  recipient,
  subject,
  message,
  from,
  name,
  appPassword,
}: RecipientProps) => {
  const [isSent, setIsSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const sendEmail = useSendEmail();

  const handleClick = () => {
    sendEmail.mutate(
      {
        from,
        to: recipient.email,
        name,
        subject,
        message: encodeURIComponent(replaceAllName(message, recipient.name)),
        password: appPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setIsSent(true);
          setTimeout(() => {
            setIsSuccess(false);
          }, 3000);
        },
        onError: () => {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        },
      }
    );
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
          {isSuccess && (
            <>
              <Icon color="green.500" as={CheckCircleIcon} />
              <Text color="green.500">Saved</Text>
            </>
          )}
          {isSent && !isSuccess && (
            <>
              <Icon color="gray.300" as={CheckCircleIcon} />
              <Text color="gray.300">Sent</Text>
            </>
          )}
          {isError && (
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
