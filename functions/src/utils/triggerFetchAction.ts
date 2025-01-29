import * as admin from 'firebase-admin';
import { Action, RecipientType } from '../types';
import { google } from 'googleapis';
import { getEmailsFromThread } from './getEmailsFromThread';

export const triggerFetchAction = async (
  actionDoc: admin.firestore.QueryDocumentSnapshot<admin.firestore.DocumentData>
) => {
  // Get user data with fetch action
  const action = actionDoc.data() as Action;
  const db = admin.firestore();
  const userRef = db.collection('userData').doc(action.userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    console.log(`User ${action.userId} not found`);
    await actionDoc.ref.delete();
    return;
  }

  const userData = userDoc.data();
  const fetchAction = userData?.fetchAction;

  if (!fetchAction) {
    console.log(`No fetch action found for user ${action.userId}`);
    await actionDoc.ref.delete();
    return;
  }

  // If action is success, remove it from Actions collection
  if (fetchAction.status === 'success') {
    await actionDoc.ref.delete();
    return;
  }
  // If action is unauthorized, remove it from Actions collection
  if (fetchAction.status === 'unauthorized') {
    throw new Error('Unauthorized');
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
      return;
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
      // console.log('threads', threads);

      // If no threads found, mark action as success
      if (threads.length === 0) {
        await userRef.update({
          'fetchAction.status': 'success',
        });
        await actionDoc.ref.delete();
        return;
      }

      // Process each thread
      for (const thread of threads) {
        if (!thread.id) continue;

        const contactFromThread = await getEmailsFromThread(thread.id, gmail);

        contacts.push(...contactFromThread);
      }

      // Now let's save the contact in the user recipients
      const userData = userDoc.data();
      const existingRecipients = userData?.recipients || [];

      // If the contact already exists merge
      // the messages with the existing contact

      contacts.forEach((contact) => {
        const existingContact = existingRecipients.find(
          (r: RecipientType) => r.email === contact.email
        );
        if (existingContact?.messages && contact.messages) {
          contact.messages = [...existingContact.messages, ...contact.messages];
        }
      });

      // Filter out contacts that already exist
      const newContacts = contacts.filter(
        (contact) =>
          !existingRecipients.some(
            (existing: RecipientType) => existing.email === contact.email
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

      if (uniqueContacts.length > 0) {
        await userRef.update({
          recipients: [...existingRecipients, ...uniqueContacts],
        });
      }

      const timeEnd = Date.now();
      const duration = timeEnd - timeStart;
      return { contacts, newContacts, duration };
    } catch (error) {
      // If token is expired or invalid
      await userRef.update({
        'fetchAction.status': 'error',
      });
      await actionDoc.ref.delete();
      throw error;
    }
  }
  return;
};
