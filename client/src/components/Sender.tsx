import {
  Card,
  Flex,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { CardHeader } from './CardHeader';
import { useState } from 'react';
import { SenderData } from '../types';

type SenderProps = {
  from: string;
  setFrom: (from: string) => void;
  appPassword: string;
  name: string;

  onSave: ({ name, appPassword }: SenderData) => void;
};

export const Sender = ({
  from,
  setFrom,
  appPassword: p,
  name: n,
  onSave,
}: SenderProps) => {
  const [appPassword, setAppPassword] = useState(p);
  const [name, setName] = useState(n);
  return (
    <Card flex={1}>
      <CardHeader>Sender</CardHeader>
      <Flex gap={4} direction="column">
        <TableContainer>
          <Table variant="unstyled">
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
                    onBlur={() => {
                      onSave({ appPassword, name });
                    }}
                  />
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <Text fontSize="sm" fontWeight="bold">
                    App password
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
                    onBlur={() => {
                      onSave({ appPassword, name });
                    }}
                  />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Card>
  );
};
