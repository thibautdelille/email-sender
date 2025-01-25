import * as admin from 'firebase-admin';
import { sendEmail } from './sendEmail';
import { fetchContactEmail } from './fetchContactEmail';
import { fetchEmail } from './fetchEmail';
import { scheduledFetchEmail } from './scheduledFetchEmail';

admin.initializeApp();

exports.sendMail = sendEmail;
exports.fetchEmail = fetchEmail;
exports.fetchContactEmail = fetchContactEmail;
exports.scheduledFetchEmail = scheduledFetchEmail;
