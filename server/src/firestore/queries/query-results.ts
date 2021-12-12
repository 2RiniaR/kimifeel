import { firestore } from "firebase-admin";

export type SingleQueryResult = firestore.DocumentSnapshot;
export type MultipleQueryResult = firestore.QuerySnapshot;
