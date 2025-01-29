import * as admin from 'firebase-admin';
import { sendEmail } from './sendEmail';
import { fetchContactEmail } from './fetchContactEmail';
import { createFetchEmailsAction } from './createFetchEmailsAction';
import { triggerFetchEmailAction } from './triggerFetchEmailAction';
import { scheduledTriggerFetch } from './scheduledTriggerFetch';

admin.initializeApp();

exports.sendMail = sendEmail;
exports.createFetchEmailsAction = createFetchEmailsAction;
exports.fetchContactEmail = fetchContactEmail;
exports.triggerFetchEmailAction = triggerFetchEmailAction;
exports.scheduledTriggerFetch = scheduledTriggerFetch;
