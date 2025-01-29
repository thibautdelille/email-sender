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
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error in scheduled fetch:', error.message);
            if (error.message === 'unauthorized') {
              res.status(401).send(error);
              return;
            } else {
              res.status(500).send(error);
              return;
            }
          }
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
