import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';

export const Sender = () => {
  return (
    <Card flex={1}>
      <CardHeader>Sender Information</CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="xs" fontWeight="bold">
                    Email Address
                  </Text>
                </Td>
                <Td>
                  <Input size="xs" type="email" placeholder="to" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="xs" fontWeight="bold">
                    Display Name
                  </Text>
                </Td>
                <Td>
                  <Input size="xs" type="text" placeholder="enter name" />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="xs" fontWeight="bold">
                    App passord
                  </Text>
                </Td>
                <Td>
                  <Input
                    size="xs"
                    type="password"
                    placeholder="enter app password"
                  />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  );
};
