import { https } from 'firebase-functions';
import * as cors from 'cors';
import * as admin from 'firebase-admin';
import { triggerFetchAction } from './utils/triggerFetchAction';

const corsHandler = cors({ origin: true });

export const triggerFetchEmailAction = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const db = admin.firestore();

    try {
      // Get all actions from Actions collection
      const actionsSnapshot = await db.collection('Actions').get();

      for (const actionDoc of actionsSnapshot.docs) {
        try {
          const response = await triggerFetchAction(actionDoc);

          if (!response) {
            continue;
          }

          const { contacts, newContacts, duration } = response;

          res.status(200).send({
            contacts,
            newContacts,
            duration,
          });
        } catch (error) {
          res.status(500).send(error);
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
