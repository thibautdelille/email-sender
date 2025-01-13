import {
  Button,
  Card,
  CardBody,
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
import { useMemo, useState } from 'react';
import { SenderData } from '../types';

type SenderProps = {
  name: string;
  onSave: ({ name, appPassword }: SenderData) => void;
};

export const Sender = ({ name: n, onSave }: SenderProps) => {
  const [name, setName] = useState(n);

  const isDisabled = useMemo(() => {
    return name === n;
  }, [name, n]);
  return (
    <Card>
      <CardHeader>Sender</CardHeader>
      <TableContainer>
        <Table variant="unstyled">
          <Tbody>
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
          </Tbody>
        </Table>
      </TableContainer>
      <CardBody>
        <Flex justify="flex-end">
          <Button
            size="sm"
            onClick={() => onSave({ name, appPassword: '' })}
            isDisabled={isDisabled}
            colorScheme={!isDisabled ? 'blue' : undefined}
          >
            Save
          </Button>
        </Flex>
      </CardBody>
    </Card>
  );
};
