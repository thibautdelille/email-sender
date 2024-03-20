import { Text } from '@chakra-ui/react';

type HeaderProps = {
  children: React.ReactNode;
};

export const Header = ({ children }: HeaderProps) => {
  return (
    <Text
      textTransform="uppercase"
      color="gray.400"
      fontSize="xs"
      fontWeight="bold"
    >
      {children}
    </Text>
  );
};
