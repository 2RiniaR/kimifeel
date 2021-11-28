import { db } from "~/firebase";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace DocumentScheme {
  export function users() {
    return db.collection("users");
  }

  export function user(path: UserDocumentPath) {
    return users().doc(path.userId);
  }

  export function requests(path: UserDocumentPath) {
    return user(path).collection("requests");
  }

  export function request(path: RequestDocumentPath) {
    return requests(path).doc(path.requestId);
  }

  export function profiles(path: UserDocumentPath) {
    return user(path).collection("profiles");
  }

  export function profile(path: ProfileDocumentPath) {
    return profiles(path).doc(path.profileId);
  }
}

export type UserDocumentPath = { userId: string };
export type ProfileDocumentPath = UserDocumentPath & { profileId: string };
export type RequestDocumentPath = UserDocumentPath & { requestId: string };

export type ProfileDocument = {
  content: string;
  index: number;
  authorUserId: string;
};

export type RequestDocument = {
  content: string;
  index: number;
  requesterUserId: string;
};

export type UserDocument = {
  discordId: string;
  profileIndex: number;
  requestIndex: number;
};
