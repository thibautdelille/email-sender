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
import { Header } from './Header';

type SenderProps = {
  from: string;
  setFrom: (from: string) => void;
  appPassword: string;
  setAppPassword: (appPassword: string) => void;
  name: string;
  setName: (name: string) => void;
};

export const Sender = ({
  from,
  setFrom,
  appPassword,
  setAppPassword,
  name,
  setName,
}: SenderProps) => {
  return (
    <Card flex={1}>
      <CardHeader>
        <Header>Sender</Header>
      </CardHeader>
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
                  <Input
                    size="xs"
                    type="email"
                    placeholder="from"
                    value={from}
                    onChange={(e) => {
                      setFrom(e.target.value);
                    }}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="xs" fontWeight="bold">
                    Display Name
                  </Text>
                </Td>
                <Td>
                  <Input
                    size="xs"
                    type="text"
                    placeholder="enter name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
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
                    value={appPassword}
                    onChange={(e) => {
                      setAppPassword(e.target.value);
                    }}
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
