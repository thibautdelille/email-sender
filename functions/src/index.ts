import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
// import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import * as cors from 'cors';

admin.initializeApp();

// exports.sendMail = functions.https.onRequest((req, res) => {
//   cors({ origin: true })(req, res, () => {
//     // getting dest email by query string
//     const to = req.query.to as string;
//     const from = req.query.from as string;
//     const name = req.query.name as string;
//     const message = req.query.message as string;
//     const subject = req.query.subject as string;
//     const password = req.query.password as string;

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       name: 'email-sender-backend',
//       auth: {
//         user: from,
//         pass: password,
//       },
//     });
//     const mailOptions = {
//       from: `${name} <${from}>`, // Something like: Jane Doe <janedoe@gmail.com>
//       to: to,
//       subject: subject, // email subject
//       html: decodeURIComponent(message), // email content in HTML
//     };

//     // returning result
//     return transporter.sendMail(mailOptions, (error) => {
//       if (error) {
//         return res.status(500).send(error.toString());
//       }
//       return res.send('Sended');
//     });
//   });
// });

const corsHandler = cors({ origin: true });

exports.sendMail = functions.https.onRequest((req, res) => {
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
      console.log('User info:', decodedToken); // This will show all user information
      console.log('User ID:', decodedToken.uid);
      console.log('User email:', decodedToken.email);

      // We don't need to verify the token as it's a Google OAuth token
      const oAuth2Client = new google.auth.OAuth2();
      oAuth2Client.setCredentials({ access_token: googleAccessToken });

      // Get token info to see the scopes
      try {
        const tokenInfo = await oAuth2Client.getTokenInfo(googleAccessToken);
        console.log('Token info (including scopes):', tokenInfo);

        if (
          !tokenInfo.scopes?.includes(
            'https://www.googleapis.com/auth/gmail.send'
          )
        ) {
          throw new Error('Missing required Gmail scope');
        }
      } catch (error) {
        console.error('Error with token:', error);
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
      console.error('Error sending email:', error);
      res.status(error.code).send(error.message);
    }
  });
});
