import { QueryDocumentSnapshot, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) => {
  return doc(db, collectionPath).withConverter(converter<T>());
};

// utils/db.ts
const database = {
  users: dataPoint<User>('users'),
};
export { database };
