import { Button, DarkMode, Flex, Text } from '@chakra-ui/react';
import { useSignOut } from '../api/signOut';
import { useUser } from '../hooks/useUser';
import { Link } from 'react-router-dom';

export const NavBar = () => {
  const { user } = useUser();

  const signOut = useSignOut();

  return (
    <DarkMode>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        px={4}
        py={2}
        bg="gray.800"
        color="white"
      >
        <Flex gap={4}>
          <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
            Email Sender
          </Text>
          <Link to="/">
            <Text fontSize="sm">Home</Text>
          </Link>
          <Link to="/contacts">
            <Text fontSize="sm">Contacts</Text>
          </Link>
        </Flex>
        <Flex gap={4} alignItems="center">
          <Text fontSize="sm">{user?.email}</Text>
          <Button size="sm" onClick={() => signOut.mutate()} variant="outline">
            Logout
          </Button>
        </Flex>
      </Flex>
    </DarkMode>
  );
};
