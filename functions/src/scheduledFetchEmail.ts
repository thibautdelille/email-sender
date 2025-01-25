import { https } from 'firebase-functions';
import { google } from 'googleapis';
import * as cors from 'cors';
import * as admin from 'firebase-admin';

const corsHandler = cors({ origin: true });

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

            try {
              // Verify token
              await oAuth2Client.getTokenInfo(fetchAction.googleAccessToken);

              const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
              const emailArray: string[] = [];

              // Get threads from currentInterval to nextInterval
              const threadsResponse = await gmail.users.threads.list({
                userId: 'me',
                maxResults: 10,
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
                  const emailFields = ['To', 'Cc', 'Bcc'];
                  emailFields.forEach((field) => {
                    const header = headers.find((h) => h.name === field);
                    if (header?.value) {
                      const emails = header.value.match(
                        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
                      );
                      if (emails) {
                        console.log(
                          `${field} emails from thread ${thread.id}:`,
                          emails
                        );
                        emailArray.push(...emails);
                      }
                    }
                  });
                });
              }

              // const response = await gmail.users.messages.list({
              //   userId: 'me',
              //   labelIds: ['INBOX'],
              //   maxResults: 10,
              // });

              // console.log('gmail.users.messages.data', response.data);
              res.status(200).send(emailArray);
            } catch (error) {
              // If token is expired or invalid
              console.error('Error processing action:', error);
              // await userRef.update({
              //   'fetchAction.status': 'error',
              // });
              // await actionDoc.ref.delete();
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
