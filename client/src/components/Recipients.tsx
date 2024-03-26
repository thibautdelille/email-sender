// Filename - App.js

import React, { useState, ChangeEvent, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { RecipientType } from '../types';
import { Recipient } from './Recipient';
import { CardHeader } from './CardHeader';
import { useSendEmail } from '../api/sendEmail';
import { AxiosError } from 'axios';
import { Automate } from './Automate';

// Allowed extensions for input file
const allowedExtensions = ['csv'];

type RecipientsProps = {
  recipients: RecipientType[] | undefined;
  from: string;
  name: string;
  message: string;
  subject: string;
  appPassword: string;
  onSave: (recipients: RecipientType[]) => void;
};

function replaceAllName(message: string, name: string) {
  return message.replace(/{name}/g, name);
}

export const Recipients = ({
  recipients,
  from,
  name,
  appPassword,
  subject,
  message,
  onSave,
}: RecipientsProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // This state will store the parsed data
  const [data, setData] = useState<Array<RecipientType>>(recipients || []);
  const [errorMessage, setErrorMessage] = useState('');

  // useEffect(() => {
  //   if (recipients) {
  //     setData(recipients);
  //   }
  // }, [recipients]);

  const sendEmail = useSendEmail();
  const toast = useToast();

  // It state will contain the error when
  // correct file extension is not used
  const [error, setError] = useState('');

  // This function will be called when
  // the file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError('');

    // Check if user has entered the file
    if (e.target.files?.length) {
      const inputFile = e.target.files[0];
      e.target.type = 'text';
      e.target.type = 'file';

      // Check the file extensions, if it not
      // included in the allowed extensions
      // we show the error
      const fileExtension = inputFile?.type.split('/')[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError('Please input a csv file');
        return;
      }

      // If input type is correct set the state

      handleParse(inputFile);
    }
  };
  const handleParse = (file: File) => {
    // If user clicks the parse button without
    // a file we show a error
    if (!file) return alert('Enter a valid file');

    // Initialize a reader which allows user
    // to read any file or blob.
    const reader = new FileReader();

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async ({ target }) => {
      if (!target) return;

      const { result } = target;
      if (!result) return;
      const csv = Papa.parse(result as string, {
        header: true,
      });
      const parsedData = csv?.data;
      const firstElement = parsedData[0];
      if (!firstElement) return;
      const keys = Object.keys(firstElement);
      if (!keys.includes('name') || !keys.includes('email')) {
        return alert('Invalid CSV file');
      }
      inputRef.current!.files = null;
      setData(parsedData as Array<RecipientType>);
      onSave(parsedData as Array<RecipientType>);
    };
    reader.readAsText(file);
  };

  const handleSelectFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  const showSuccess = (index: number) => {
    // set the recipient status to success
    setData((prev) => {
      onSave(
        prev.map((item, i) => {
          if (i === index) {
            return { ...item, sent: true };
          }
          return item;
        })
      );
      return prev.map((item, i) => {
        if (i === index) {
          return { ...item, status: 'success', sent: true };
        }
        return item;
      });
    });
    setTimeout(() => {
      setData((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return { ...item, status: 'idle' };
          }
          return item;
        });
      });
    }, 3000);
  };

  const showError = (index: number) => {
    // set the recipient status to success
    setData((prev) => {
      onSave(
        prev.map((item, i) => {
          if (i === index) {
            return { ...item, sent: false };
          }
          return item;
        })
      );
      return prev.map((item, i) => {
        if (i === index) {
          return { ...item, status: 'error', sent: false };
        }
        return item;
      });
    });
    setTimeout(() => {
      setData((prev) => {
        return prev.map((item, i) => {
          if (i === index) {
            return { ...item, status: 'idle' };
          }
          return item;
        });
      });
    }, 3000);
  };
  const sendMessageHandler = (index: number, recipient: RecipientType) => {
    const savePromise = new Promise((resolve, reject) => {
      sendEmail.mutate(
        {
          from,
          to: recipient.email,
          name,
          subject,
          message: encodeURIComponent(replaceAllName(message, recipient.name)),
          password: appPassword,
        },
        {
          onSuccess: (response) => {
            showSuccess(index);
            resolve(response);
          },
          onError: (e) => {
            const data = (e as AxiosError).response?.data as string;
            setErrorMessage(data || e.message);
            reject(e);
            showError(index);
          },
        }
      );
    });

    toast.promise(savePromise, {
      success: { title: 'Email sent', description: 'Looks great' },
      error: { title: 'Something went wrong', description: errorMessage },
      loading: { title: 'Sending Email', description: 'Please wait' },
    });
  };
  return (
    <>
      <Automate
        recipients={data}
        onSendMessage={sendMessageHandler}
        isPending={sendEmail.isPending}
      />
      <Card>
        <CardHeader>Recipients</CardHeader>
        {error && <Text color="red.500">{error}</Text>}
        <Flex direction="column" gap={0}>
          <CardBody>
            <Flex align="center" gap={4} justify="space-between">
              <Text>
                Select a csv file with containing the header name and email
              </Text>
              <Button size="sm" onClick={handleSelectFile}>
                Select File
              </Button>
            </Flex>
          </CardBody>
          <Divider />
          {data.length && (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                    <Th>Actions</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item, index) => (
                    <Recipient
                      key={index}
                      recipient={item}
                      onSendMessage={(recipient: RecipientType) =>
                        sendMessageHandler(index, recipient)
                      }
                    />
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Flex>
      </Card>
      <Box display="none">
        <input
          ref={inputRef}
          onChange={handleFileChange}
          id="csvInput"
          name="file"
          type="File"
        />
      </Box>
    </>
  );
};
