import { https } from 'firebase-functions';
import { google } from 'googleapis';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import { RecipientType } from './types';

const corsHandler = cors({ origin: true });

// Generate a unique ID
// eslint-disable-next-line require-jsdoc
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const scheduledFetchEmail = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const db = admin.firestore();

    try {
      // Get all actions from Actions collection
      const actionsSnapshot = await db.collection('Actions').get();

      for (const actionDoc of actionsSnapshot.docs) {
        const action = actionDoc.data();

        if (action.actionType === 'fetchAction') {
          // Get user data with fetch action
          const userRef = db.collection('userData').doc(action.userId);
          const userDoc = await userRef.get();

          if (!userDoc.exists) {
            console.log(`User ${action.userId} not found`);
            await actionDoc.ref.delete();
            continue;
          }

          const userData = userDoc.data();
          const fetchAction = userData?.fetchAction;

          if (!fetchAction) {
            console.log(`No fetch action found for user ${action.userId}`);
            await actionDoc.ref.delete();
            continue;
          }

          // If action is success, remove it from Actions collection
          if (fetchAction.status === 'success') {
            await actionDoc.ref.delete();
            continue;
          }

          // If action is running, process it
          if (fetchAction.status === 'running') {
            const oAuth2Client = new google.auth.OAuth2();
            oAuth2Client.setCredentials({
              access_token: fetchAction.googleAccessToken,
            });

            // Get token info to see the scopes
            try {
              const tokenInfo = await oAuth2Client.getTokenInfo(
                fetchAction.googleAccessToken
              );
              if (!tokenInfo.scopes?.includes('https://mail.google.com/')) {
                throw new Error('Missing required Gmail scope');
              }
            } catch (error) {
              await userRef.update({
                'fetchAction.status': 'unauthorized',
              });
              await actionDoc.ref.delete();
              res.status(401).send('Invalid or insufficient token permissions');
            }
            try {
              const timeStart = Date.now();

              const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
              const contacts: Array<RecipientType> = [];

              // Get threads from currentInterval to nextInterval
              const threadsResponse = await gmail.users.threads.list({
                userId: 'me',
                maxResults: 50,
                pageToken: fetchAction.nextPageToken || undefined,
              });

              const nextPageToken = threadsResponse.data.nextPageToken;

              // save the next page token
              await userRef.update({
                'fetchAction.nextPageToken': nextPageToken,
              });

              const threads = threadsResponse.data.threads || [];

              // If no threads found, mark action as success
              if (threads.length === 0) {
                await userRef.update({
                  'fetchAction.status': 'success',
                });
                await actionDoc.ref.delete();
                continue;
              }

              // Process each thread
              for (const thread of threads) {
                if (!thread.id) continue;

                const threadDetails = await gmail.users.threads.get({
                  userId: 'me',
                  id: thread.id,
                });

                // Process each message in thread
                threadDetails.data.messages?.forEach((message) => {
                  const headers = message.payload?.headers;
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
                          contacts.push({
                            id: generateId(),
                            email,
                            name: name && !isNameEmail ? name.trim() : '',
                            sent: false,
                          });
                        }
                      });
                    }
                  });
                });
              }

              // Now let's save the contact in the user recipients
              const userData = userDoc.data();
              const existingRecipients = userData?.recipients || [];

              // Filter out contacts that already exist
              const newContacts = contacts.filter(
                (contact) =>
                  !existingRecipients.some(
                    (existing: RecipientType) =>
                      existing.email === contact.email
                  )
              );

              // remove the duplicates
              newContacts.sort((a, b) => a.email.localeCompare(b.email));
              const uniqueContacts: Array<RecipientType> = [];
              let currentContact: RecipientType | null = null;

              for (const contact of newContacts) {
                if (!currentContact || currentContact.email !== contact.email) {
                  uniqueContacts.push(contact);
                  currentContact = contact;
                }
              }

              console.log(`newContacts.length: ${newContacts.length}`);
              if (uniqueContacts.length > 0) {
                console.time('update recipients');
                await userRef.update({
                  recipients: [...existingRecipients, ...uniqueContacts],
                });
                console.timeEnd('update recipients');
              }

              const timeEnd = Date.now();
              const duration = timeEnd - timeStart;
              res.status(200).send({ contacts, newContacts, duration });
            } catch (error) {
              // If token is expired or invalid
              console.error('Error processing action:', error);
              await userRef.update({
                'fetchAction.status': 'error',
              });
              await actionDoc.ref.delete();
            }
          }
        }
      }

      res
        .status(200)
        .send({ message: 'Scheduled fetch completed successfully' });
    } catch (error) {
      console.error('Error in scheduled fetch:', error);
      res.status(500).send(error);
    }
  });
});
