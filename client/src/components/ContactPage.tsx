import { Flex, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavBar } from './NavBar';
import { useParams } from 'react-router-dom';
import { useContact } from '../hooks/useContact';
import { useFetchContactEmail } from '../api/fetchContactEmails';
export const ContactPage = () => {
  const { id } = useParams();

  const { contact } = useContact(id);

  const { data } = useFetchContactEmail(contact?.email);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Flex gap={4} direction="column" width="100%" pb={4}>
      <NavBar />
      <Flex px={4} gap={4}>
        <Text fontSize="sm" fontWeight="bold">
          Name:
        </Text>
        <Text fontSize="sm">{contact?.name}</Text>
      </Flex>
      <Flex px={4} gap={4}>
        <Text fontSize="sm" fontWeight="bold">
          Email:
        </Text>
        <Text fontSize="sm">{contact?.email}</Text>
      </Flex>
    </Flex>
  );
};
