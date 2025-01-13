import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Slider } from './Slider';
import { RecipientType } from '../types';
import { CardHeader } from './CardHeader';

type AutomateProps = {
  recipients: RecipientType[];
  isPending: boolean;
  onSendMessage: (index: number, recipient: RecipientType) => void;
};

export const Automate = ({
  recipients: data,
  isPending,
  onSendMessage,
}: AutomateProps) => {
  const [recipients, setRecipients] = useState(data);
  const [opHours, setOpHours] = useState([11, 17]);
  const [interval, setInterval] = useState([30, 50]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [unSentRecipients, setUnSentRecipients] = useState<RecipientType[]>([]);

  const isRunning = useMemo(() => currentInterval > 0, [currentInterval]);

  const ref = useRef({
    unSentRecipients,
    interval,
    onSendMessage,
    recipients,
  });

  ref.current = {
    unSentRecipients,
    interval,
    onSendMessage,
    recipients,
  };

  useEffect(() => {
    const { unSentRecipients, interval, onSendMessage, recipients } =
      ref.current;
    if (!currentInterval || unSentRecipients.length === 0) {
      setCurrentInterval(0);
      return;
    }

    const recipient = unSentRecipients[0];
    // send the email
    if (currentInterval === 1) {
      onSendMessage(recipients.indexOf(recipient), recipient);
      const random =
        Math.floor(Math.random() * (interval[1] - interval[0] + 1)) +
        interval[0];
      setCurrentInterval(random);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentInterval((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [currentInterval]);

  useEffect(() => {
    setRecipients(data);
    setUnSentRecipients(data.filter((r) => !r.sent));
  }, [data]);

  const handleStart = () => {
    setCurrentInterval(1);
  };

  const handleStop = () => {
    setCurrentInterval(0);
  };

  const message = useMemo(() => {
    if (isPending) {
      return 'Sending email...';
    }
    if (isRunning && unSentRecipients[0]) {
      return `Next email in ${currentInterval - 1} seconds to ${
        unSentRecipients[0]?.email
      }`;
    }
    return 'Automation stopped';
  }, [isPending, isRunning, currentInterval, unSentRecipients]);
  return (
    <Card flex={1}>
      <CardHeader>Automate</CardHeader>
      <Flex gap={4} direction="column">
        <TableContainer>
          <Table variant="unstyled">
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="sm" fontWeight="bold">
                    Operating Hours
                  </Text>
                </Td>
                <Td>
                  <Slider value={opHours} onChange={setOpHours} max={24} />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="sm" fontWeight="bold">
                    Interval (in seconds)
                  </Text>
                </Td>
                <Td width="100%">
                  <Slider value={interval} onChange={setInterval} max={120} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <CardBody>
          <Flex justify="flex-end" gap={4}>
            <Button size="sm" onClick={handleStop} disabled={!isRunning}>
              Pause
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleStart}
              disabled={isRunning}
            >
              Start
            </Button>
          </Flex>
        </CardBody>
        <CardFooter borderTop="1px solid" borderColor="gray.100">
          <Flex justify="flex-end" width="100%">
            <Text fontSize="sm">{message}</Text>
          </Flex>
        </CardFooter>
      </Flex>
    </Card>
  );
};
