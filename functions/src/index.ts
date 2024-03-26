import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as cors from 'cors';

admin.initializeApp();

exports.sendMail = functions.https.onRequest((req, res) => {
  cors({ origin: true })(req, res, () => {
    // getting dest email by query string
    const to = req.query.to as string;
    const from = req.query.from as string;
    const name = req.query.name as string;
    const message = req.query.message as string;
    const subject = req.query.subject as string;
    const password = req.query.password as string;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      name: 'email-sender-backend',
      auth: {
        user: from,
        pass: password,
      },
    });
    const mailOptions = {
      from: `${name} <${from}>`, // Something like: Jane Doe <janedoe@gmail.com>
      to: to,
      subject: subject, // email subject
      html: decodeURIComponent(message), // email content in HTML
    };

    return res.send('Sended');
    // returning result
    return transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      return res.send('Sended');
    });
  });
});
