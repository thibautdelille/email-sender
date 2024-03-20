import { Card, CardBody, CardHeader } from '@chakra-ui/react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

export const Message = () => {
  return (
    <Card flex={1}>
      <CardHeader>Sender Information</CardHeader>
      <CardBody>
        <CKEditor
          editor={ClassicEditor}
          data="<p>Hello {name},<br/>Enter your message<br/>Your name</p>"
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event) => {
            console.log(event);
          }}
          onBlur={(event, editor) => {
            console.log('Blur.', editor);
          }}
          onFocus={(event, editor) => {
            console.log('Focus.', editor);
          }}
        />
      </CardBody>
    </Card>
  );
};
