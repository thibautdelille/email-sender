import { Flex } from '@chakra-ui/react';
import { NavBar } from './NavBar';
import { Contacts } from './Contacts';

export const ContactsPage = () => {
  return (
    <Flex gap={4} direction="column" width="100%" pb={4}>
      <NavBar />
      <Flex p={4}>
        <Contacts />
      </Flex>
    </Flex>
  );
};
