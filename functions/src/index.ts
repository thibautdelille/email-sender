/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {onRequest} from "firebase-functions/v2/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');
// const cors = require('cors')({origin: true});

import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import * as nodemailer from "nodemailer"
import * as cors from "cors"
import { defineString } from "firebase-functions/params"



admin.initializeApp();

const GMAIL_PASSWORD = defineString('GMAIL_PASSWORD');
console.log('process.env.GMAIL_PASSWORD', GMAIL_PASSWORD.value())
/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'josephine.arader@gmail.com',
        pass: GMAIL_PASSWORD.value()
    }
});

exports.sendMail = functions.https.onRequest((req, res) => {
    cors({origin: true})(req, res, () => {
      
        // getting dest email by query string
        const dest = req.query.dest as string;


        console.log(process.env.GMAIL_PASSWORD)
        const mailOptions = {
            from: 'Josephine Arader <josephine.arader@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
            to: dest,
            subject: 'I\'M A PICKLE!!!', // email subject
            html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
                <br />
                <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
            ` // email content in HTML
        };
  
        // returning result
        return transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
                return res.send(erro.toString());
            }
            return res.send('Sended');
        });
    });    
});