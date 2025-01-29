import { https } from 'firebase-functions';
import { google } from 'googleapis';
import * as cors from 'cors';

const corsHandler = cors({ origin: true });

export const fetchContactEmail = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // in this function we get the google access token
    // and firebase access token and a user email address
    // based on this email address we return all the emails using the gmail api
    // the connected accound had with this email.

    const { accessToken, googleAccessToken, email } = req.body;

    if (!accessToken || !googleAccessToken || !email) {
      res
        .status(400)
        .send(
          'Missing required fields:' + ' accessToken, googleAccessToken, email.'
        );
      return;
    }

    // We don't need to verify the token as it's a Google OAuth token
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: googleAccessToken });

    // Get token info to see the scopes
    try {
      const tokenInfo = await oAuth2Client.getTokenInfo(googleAccessToken);
      console.log('tokenInfo', tokenInfo);
      if (!tokenInfo.scopes?.includes('https://mail.google.com/')) {
        throw new Error('Missing required Gmail scope');
      }
    } catch (error) {
      res.status(401).send('Invalid or insufficient token permissions');
      return;
    }

    try {
      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

      const response = await gmail.users.threads.list({
        userId: 'me',
        labelIds: ['INBOX'],
        q: `to:${email}`,
      });

      console.log('gmail.users.thread.data', response.data);
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).send(error);
    }
  });
});
