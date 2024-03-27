import { Button, Card, CardBody, Flex, Input } from '@chakra-ui/react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { CardHeader } from './CardHeader';
import { MessageData } from '../types';
import { useMemo, useState } from 'react';

type MessageProps = {
  message: string;
  subject: string;
  onSave: ({ subject, message }: MessageData) => void;
};

export const Message = ({ message: m, subject: s, onSave }: MessageProps) => {
  const [subject, setSubject] = useState(s);
  const [message, setMessage] = useState(m);

  const isDisabled = useMemo(() => {
    return subject === s && message === m;
  }, [subject, message, m, s]);
  return (
    <Card>
      <CardHeader>Message</CardHeader>
      <CardBody>
        <Flex gap={4} direction="column">
          <Input
            type="text"
            size="sm"
            placeholder="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          />
          <CKEditor
            editor={ClassicEditor}
            config={{
              toolbar: {
                items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'outdent',
                  'indent',
                  '|',
                  'blockQuote',
                  'undo',
                  'redo',
                ],
              },
            }}
            data={message}
            // @ts-ignore
            onChange={(event, editor) => {
              setMessage(editor.data.get());
            }}
          />
          <Flex justify="flex-end">
            <Button
              size="sm"
              onClick={() => onSave({ subject, message })}
              isDisabled={isDisabled}
              colorScheme={!isDisabled ? 'blue' : undefined}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
