import { CardHeader as ChakraCardHeader, Text } from '@chakra-ui/react';

type CardHeaderProps = {
  children: React.ReactNode;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
  return (
    <ChakraCardHeader borderBottom="1px solid" borderColor="gray.100">
      <Text
        textTransform="uppercase"
        color="gray.400"
        fontSize="xs"
        fontWeight="bold"
      >
        {children}
      </Text>
    </ChakraCardHeader>
  );
};
