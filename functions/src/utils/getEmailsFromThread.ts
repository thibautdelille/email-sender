/* eslint-disable operator-linebreak */
import { gmail_v1 as GmailV1 } from 'googleapis';
import { RecipientType } from '../types';
import { generateId } from './generateId';

export const getEmailsFromThread = async (
  threadId: string,
  gmailClient: GmailV1.Gmail
): Promise<RecipientType[]> => {
  const contacts: RecipientType[] = [];
  const threadDetails = await gmailClient.users.threads.get({
    userId: 'me',
    id: threadId,
  });

  // Process each message in thread
  threadDetails.data.messages?.forEach((message) => {
    const headers = message.payload?.headers;
    // console.log('message', message);
    // if (isLastMessage) {
    //   // get the body of the message
    //   console.log('');
    //   console.log('');
    //   console.log('');
    //   console.log('');
    //   console.log('--------------message---------------');
    //   console.log('message.id', message.id);
    //   console.log('snippet', message.snippet);
    //   const body = message.payload?.body?.data;
    //   const decodedBody = body
    //     ? Buffer.from(body as string, 'base64').toString()
    //     : '';
    //   console.log('body', decodedBody);
    //   message.payload?.parts?.forEach((part, index) => {
    //     if (part.mimeType === 'text/plain') {
    //       const bodyPart = part.body?.data;
    //       const decodedBodyPart = bodyPart
    //         ? Buffer.from(bodyPart as string, 'base64').toString()
    //         : '';
    //       console.log(`parts body ${index}`, decodedBodyPart);
    //       if (bodyPart) {
    //         console.log(`parts body ${index}`, decodedBodyPart);
    //       }
    //     }
    //   });
    // }

    if (!headers) return;

    // Extract email addresses from headers
    const emailFields = ['From', 'To', 'Cc', 'Bcc'];
    emailFields.forEach((field) => {
      const header = headers.find((h) => h.name === field);
      if (header?.value) {
        // Split multiple recipients
        const recipients = header.value
          .split(',')
          .map((recipient) => recipient.trim());

        recipients.forEach((recipient) => {
          // Match pattern:
          // "Display Name <email@example.com>"
          // or just "email@example.com"
          const match = recipient.match(
            // eslint-disable-next-line max-len
            /(?:"?([^"]*)"?\s)?(?:<)?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?:>)?/
          );

          if (match) {
            const [, name, email] = match;
            const isNameEmail = name?.match(
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
            );

            const messages = message.id ? [message.id] : undefined;
            console.log('email', email);
            contacts.push({
              id: generateId(),
              email,
              name: name && !isNameEmail ? name.trim() : '',
              sent: false,
              messages,
            });
          }
        });
      }
    });
  });
  return contacts;
};
