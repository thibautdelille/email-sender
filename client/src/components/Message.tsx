import {
  Button,
  Card,
  CardBody,
  Flex,
  Input,
  Textarea,
} from '@chakra-ui/react';
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
  const [showSource, setShowSource] = useState(false);

  const isDisabled = useMemo(() => {
    console.log('subject', subject);
    console.log('message', message);
    console.log('m', m);
    console.log('s', s);
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
          {showSource ? (
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          ) : (
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
              onChange={(_, editor) => {
                setMessage(editor.data.get());
              }}
            />
          )}
          <Flex justify="space-between">
            <Button size="sm" onClick={() => setShowSource(!showSource)}>
              Show source
            </Button>
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
