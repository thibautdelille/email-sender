import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  Box,
  ChakraProvider,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tr,
} from "@chakra-ui/react";
import { ReadCSVFile } from "./ReadCSVFile";

function App() {
  const queryClient = new QueryClient();
  return (
    <Flex w="100vw" position="relative" justify="center">
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Flex gap={4} direction="column" width="80%" maxWidth="1024px">
            <Text fontSize="2xl" fontWeight="bold">
              Personal Email Sender
            </Text>
            <Flex
              gap={4}
              direction="column"
              border={"1px solid"}
              borderColor={"gray.200"}
              p={4}
              borderRadius="md"
            >
              <Text fontSize="sm" fontWeight="bold">
                Sender Information
              </Text>
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
            </Flex>
            <Flex
              gap={4}
              direction="column"
              border={"1px solid"}
              borderColor={"gray.200"}
              p={4}
              borderRadius="md"
            >
              <Text fontSize="sm" fontWeight="bold">
                Recipient Information
              </Text>
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
                          Email Content
                        </Text>
                      </Td>
                      <Td>
                        <Textarea
                          placeholder="Enter your message here"
                          size="xs"
                        />
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
            <ReadCSVFile />
          </Flex>
        </QueryClientProvider>
      </ChakraProvider>
    </Flex>
  );
}

export default App;
