import { CardHeader as ChakraCardHeader, Text } from '@chakra-ui/react';

type CardHeaderProps = {
  children: React.ReactNode;
};

export const CardHeader = ({ children }: CardHeaderProps) => {
  return (
    <ChakraCardHeader py={2}>
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
