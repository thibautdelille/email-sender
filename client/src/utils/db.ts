import {
  QueryDocumentSnapshot,
  doc,
  SnapshotOptions,
  collection,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserData } from '../types';

const converter = <T>() => ({
  toFirestore(value: T) {
    return { value };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return snapshot.data(options).value as T;
  },
});

const dataCollection = <T>(collectionPath: string, key?: string) => {
  if (!key) {
    return collection(db, collectionPath).withConverter(converter<T>());
  }
  return collection(db, collectionPath, key).withConverter(converter<T>());
};

const dataDoc = <T>(collectionPath: string, key?: string) => {
  if (!key) {
    return doc(db, collectionPath).withConverter(converter<T>());
  }
  return doc(db, collectionPath, key).withConverter(converter<T>());
};
const user = auth.currentUser;
// utils/db.ts
const database = {
  user: dataDoc<UserData>('userData', user?.uid),
  users: dataCollection<UserData>('userData'),
};
export { database };
