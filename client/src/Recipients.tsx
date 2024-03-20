// Filename - App.js

import React, { useState, ChangeEvent } from 'react';
import Papa from 'papaparse';
import './App.css';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';

// Allowed extensions for input file
const allowedExtensions = ['csv'];

type Recipient = {
  name: string;
  email: string;
};

export const Recipients = () => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  // This state will store the parsed data
  const [data, setData] = useState<Array<Recipient>>([]);

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
      setData(parsedData as Array<Recipient>);
    };
    reader.readAsText(file);
  };

  const handleSelectFile = () => {
    const input = inputRef.current;
    if (input) {
      input.click();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>Recipients</CardHeader>
        <CardBody>
          {data.length ? (
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Email</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Text fontSize="sm">{item.name}</Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm">{item.email}</Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Button onClick={handleSelectFile}>Select File</Button>
          )}
        </CardBody>
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
