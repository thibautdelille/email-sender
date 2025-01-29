import {
  Button,
  Card,
  CardHeader,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ContactRow } from './ContactRow';
import { useContacts } from '../hooks/useContacts';
import { Flex } from '@chakra-ui/react';
import { useFetchEmail, useTriggerFetchAction } from '../api/fetchEmails';
export const Contacts = () => {
  const { contacts } = useContacts();
  const { mutate } = useFetchEmail();
  const { mutate: triggerFetchAction } = useTriggerFetchAction();
  return (
    <Card w="100%">
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          Contacts
          <Flex gap={2}>
            <Button size="sm" colorScheme="blue" onClick={() => mutate()}>
              Fetch Contacts
            </Button>
            <Button size="sm" onClick={() => triggerFetchAction()}>
              Trigger Action
            </Button>
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
