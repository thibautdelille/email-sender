import { Card, CardBody, Flex, Input } from '@chakra-ui/react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { CardHeader } from './CardHeader';

type MessageProps = {
  subject: string;
  message: string;
  setSubject: (subject: string) => void;
  setMessage: (message: string) => void;
};

export const Message = ({
  message,
  subject,
  setSubject,
  setMessage,
}: MessageProps) => {
  return (
    <Card flex={1}>
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
            data={message}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log('Editor is ready to use!', editor);
            }}
            // @ts-ignore
            onChange={(event, editor) => {
              setMessage(editor.data.get());
            }}
            // @ts-ignore
            onBlur={(event, editor) => {
              console.log('Blur.', editor);
            }}
            // @ts-ignore
            onFocus={(event, editor) => {
              console.log('Focus.', editor);
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  );
};
