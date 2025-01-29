import { Td, Text, Tr } from '@chakra-ui/react';
import { RecipientType } from '../types';
import { Link } from 'react-router-dom';

export const ContactRow = ({ contact }: { contact: RecipientType }) => {
  return (
    <Tr>
      <Td>
        <Text fontSize="sm">{contact.name}</Text>
      </Td>
      <Td>
        <Text fontSize="sm">{contact.email}</Text>
      </Td>
      <Td>
        <Link to={`/contact/${contact.id}`}>View</Link>
      </Td>
      <Td />
    </Tr>
  );
};
