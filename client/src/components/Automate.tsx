import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { Slider } from './Slider';
import { RecipientType } from '../types';

type AutomateProps = {
  recipients: RecipientType[];
  onSendMessage: (index: number, recipient: RecipientType) => void;
};

let currentTimeout: NodeJS.Timeout;

export const Automate = ({
  recipients: data,
  onSendMessage,
}: AutomateProps) => {
  const [recipients, setRecipients] = useState(data);
  const [opHours, setOpHours] = useState([11, 17]);
  const [interval, setInterval] = useState([30, 50]);
  const [currentInterval, setCurrentInterval] = useState(0);
  const [nextRecipient, setNextRecipient] = useState<RecipientType | null>(
    null
  );

  const [isRunning, setIsRunning] = useState(false);
  const updateCurrentInterval = (interval: number) => {
    setCurrentInterval(interval);
    if (interval > 0) {
      setTimeout(() => updateCurrentInterval(interval - 1), 1000);
      return;
    }
  };

  useEffect(() => {
    console.log('useEffect::Recipients', data);
    setRecipients(data);
  }, [data]);

  const sendEmail = useCallback(() => {
    console.log('Sending email');
    // find the the first recipient that has not been sent

    const unSentRecipients = recipients.filter((r) => !r.sent);
    const recipient = unSentRecipients[0];
    const next = unSentRecipients.length > 1 ? unSentRecipients[1] : null;

    console.log('Sending email: recipients', recipients);
    console.log('Sending email: unSentRecipients', unSentRecipients);
    console.log('Sending email: recipient', recipient);
    console.log(
      'Sending email: recipients.indexOf(recipient)',
      recipients.indexOf(recipient)
    );
    setNextRecipient(next);

    if (!recipient) {
      console.log('All recipients have been sent');
      setIsRunning(false);
      return;
    }
    // send the email
    onSendMessage(recipients.indexOf(recipient), recipient);

    if (!next) {
      console.log('All recipients have been sent');
      setIsRunning(false);
      return;
    }

    // get a random number between the interval
    const random =
      Math.floor(Math.random() * (interval[1] - interval[0] + 1)) + interval[0];
    setTimeout(() => updateCurrentInterval(random), 1000);

    currentTimeout = setTimeout(() => {
      sendEmail();
    }, random * 1000);
  }, [recipients, interval, onSendMessage]);

  const handleStart = () => {
    console.log('Starting automation');
    setIsRunning(true);
    sendEmail();
  };

  const handleStop = () => {
    console.log('Stopping automation');
    clearTimeout(currentTimeout);
    setIsRunning(false);
  };
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
            <Text fontSize="sm">
              {isRunning
                ? `Next email in ${currentInterval} seconds to ${nextRecipient?.email}`
                : 'Automation stopped'}
            </Text>
          </Flex>
        </CardFooter>
      </Flex>
    </Card>
  );
};
