import {
  Card,
  CardBody,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { CardHeader } from './CardHeader';

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
      <CardHeader>Sender</CardHeader>
      <CardBody>
        <TableContainer>
          <Table variant="simple">
            <Tbody>
              <Tr>
                <Td>
                  <Text fontSize="sm" fontWeight="bold">
                    Email Address
                  </Text>
                </Td>
                <Td>
                  <Input
                    size="sm"
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
                  <Text fontSize="sm" fontWeight="bold">
                    Display Name
                  </Text>
                </Td>
                <Td>
                  <Input
                    size="sm"
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
                  <Text fontSize="sm" fontWeight="bold">
                    App passord
                  </Text>
                </Td>
                <Td>
                  <Input
                    size="sm"
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
