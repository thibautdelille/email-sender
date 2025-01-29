import { https } from 'firebase-functions';
import { google } from 'googleapis';
import * as cors from 'cors';
import * as admin from 'firebase-admin';

const corsHandler = cors({ origin: true });

export const createFetchEmailsAction = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const { accessToken, googleAccessToken, userId } = req.body;

    if (!accessToken || !googleAccessToken || !userId) {
      res
        .status(400)
        .send(
          'Missing required fields: accessToken, googleAccessToken, userId.'
        );
      return;
    }

    // Get Firestore instance
    const db = admin.firestore();
    try {
      // Check if user exists and if there's a running action
      const userRef = db.collection('userData').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        res.status(404).send('User not found');
        return;
      }

      const userData = userDoc.data();
      if (userData?.fetchAction?.status === 'running') {
        res.status(409).send('A fetch action is already running');
        return;
      }

      // We don't need to verify the token as it's a Google OAuth token
      const oAuth2Client = new google.auth.OAuth2();
      oAuth2Client.setCredentials({ access_token: googleAccessToken });

      // Get token info to see the scopes
      try {
        console.log('googleAccessToken', googleAccessToken);
        const tokenInfo = await oAuth2Client.getTokenInfo(googleAccessToken);
        if (!tokenInfo.scopes?.includes('https://mail.google.com/')) {
          throw new Error('Missing required Gmail scope');
        }
      } catch (error) {
        console.log('401', 'Invalid or insufficient token permissions');
        res.status(401).send('Invalid or insufficient token permissions');
        return;
      }

      // Start a batch write to update both collections atomically
      const batch = db.batch();

      if (
        userData?.fetchAction?.status === 'unauthorized' ||
        userData?.fetchAction?.status === 'error'
      ) {
        batch.update(userRef, {
          'fetchAction.googleAccessToken': googleAccessToken,
          'fetchAction.status': 'running',
        });
      } else {
        // Update user document with new fetch action
        batch.update(userRef, {
          fetchAction: {
            googleAccessToken,
            userId,
            status: 'running',
          },
        });
      }

      // Create a new action document in Actions collection
      const actionRef = db.collection('Actions').doc();
      batch.set(actionRef, {
        actionType: 'fetchAction',
        userId,
      });
      // Commit the batch
      await batch.commit();

      res.status(200).send({ message: 'Fetch action started successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
});
