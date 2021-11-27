import { db } from "~/firebase";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DocumentScheme {
  export function users() {
    return db.collection("users");
  }

  export function user(userId: string) {
    return users().doc(userId);
  }

  export function requests(userId: string) {
    return user(userId).collection("requests");
  }

  export function requestsGroup() {
    return db.collectionGroup("requests");
  }

  export function request(userId: string, requestId: string) {
    return requests(userId).doc(requestId);
  }

  export function profiles(userId: string) {
    return user(userId).collection("profiles");
  }

  export function profile(userId: string, profileId: string) {
    return requests(userId).doc(profileId);
  }
}
