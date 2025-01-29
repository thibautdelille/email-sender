import {
  Button,
  Card,
  CardHeader,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Text,
  Tr,
} from '@chakra-ui/react';
import { ContactRow } from './ContactRow';
import { useContacts } from '../hooks/useContacts';
import { Flex } from '@chakra-ui/react';
import {
  useCreateFetchEmailsAction,
  useTriggerFetchAction,
} from '../api/fetchEmails';
import { useUserAction } from '../hooks/useUserAction';
export const Contacts = () => {
  const { contacts } = useContacts();
  const { action } = useUserAction();
  const { mutate: createFetchEmailsAction } = useCreateFetchEmailsAction();
  const { mutate: triggerFetchAction } = useTriggerFetchAction();
  return (
    <Card w="100%">
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          Contacts
          <Flex gap={2} alignItems="center">
            <Text fontSize="sm">Contacts: {contacts?.length}</Text>
            <Text fontSize="sm">Actions: {action?.status}</Text>

            {!action && (
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => createFetchEmailsAction()}
              >
                Create Action
              </Button>
            )}
            {action &&
              (action?.status === 'unauthorized' ||
                action?.status === 'error') && (
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => createFetchEmailsAction()}
                >
                  Reauthorize Action
                </Button>
              )}
            {action && action.status === 'running' && (
              <Button size="sm" onClick={() => triggerFetchAction()}>
                Trigger Action
              </Button>
            )}
          </Flex>
        </Flex>
      </CardHeader>
      {contacts?.length ? (
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {contacts.map((item, index) => (
                <ContactRow key={index} contact={item} />
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      ) : null}
    </Card>
  );
};
