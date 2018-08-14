import { firestore } from 'firebase';


export const timestampFrom = ( from: firestore.Timestamp ) =>
  firestore.Timestamp.fromMillis( from.toMillis() );

