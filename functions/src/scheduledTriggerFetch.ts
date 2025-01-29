import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { triggerFetchAction } from './utils/triggerFetchAction';

export const scheduledTriggerFetch = functions.pubsub
  .schedule('every 2 minutes')
  .onRun(async () => {
    const db = admin.firestore();

    const actionsSnapshot = await db.collection('Actions').get();

    const promises = actionsSnapshot.docs.map((actionDoc) =>
      triggerFetchAction(actionDoc)
    );

    await Promise.all(promises);
    console.log(`Triggered fetch for ${actionsSnapshot.size} actions`);
  });
