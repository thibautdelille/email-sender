import { https } from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
import * as cors from 'cors';

admin.initializeApp();

const corsHandler = cors({ origin: true });

exports.sendMail = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { to, subject, message, accessToken, name, googleAccessToken } =
        req.body;

      if (
        !to ||
        !subject ||
        !message ||
        !accessToken ||
        !googleAccessToken ||
        !name
      ) {
        res
          .status(400)
          .send('Missing required fields: to, subject, message, accessToken.');
        return;
      }
      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(accessToken);

      // We don't need to verify the token as it's a Google OAuth token
      const oAuth2Client = new google.auth.OAuth2();
      oAuth2Client.setCredentials({ access_token: googleAccessToken });

      // Get token info to see the scopes
      try {
        const tokenInfo = await oAuth2Client.getTokenInfo(googleAccessToken);
        if (
          !tokenInfo.scopes?.includes(
            'https://www.googleapis.com/auth/gmail.send'
          )
        ) {
          throw new Error('Missing required Gmail scope');
        }
      } catch (error) {
        res.status(401).send('Invalid or insufficient token permissions');
        return;
      }

      const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
      // Decode the URL-encoded message
      const decodedMessage = decodeURIComponent(message);

      // Create the email with proper MIME formatting
      const emailLines = [
        `From: ${name} <${decodedToken.email}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=utf-8',
        '',
        decodedMessage,
      ];

      console.log('emailLines', emailLines);

      const email = emailLines.join('\r\n');

      // Encode the email in base64URL format
      const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      // Send the email using Gmail API
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      res.status(200).send('Email sent successfully.');
    } catch (error: any) {
      res.status(error.code).send(error.message);
    }
  });
});
