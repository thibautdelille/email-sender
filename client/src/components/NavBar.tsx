import { Button, DarkMode, Flex, Text } from '@chakra-ui/react';
import { useUser } from '../provider/userProvider';
import { useSignOut } from '../api/signOut';

export const NavBar = () => {
  const { user } = useUser();

  const signOut = useSignOut();

  return (
    <DarkMode>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p={4}
        bg="gray.800"
        color="white"
      >
        <Text fontSize="sm" fontWeight="bold" textTransform="uppercase">
          Personal Email Sender
        </Text>
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
