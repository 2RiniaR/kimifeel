import { ProfileDocument } from "./profile-document";
import { RequestDocument } from "./request-document";

export type UserDocument = {
  discordId: string;
  profiles: ProfileDocument[];
  requests: RequestDocument[];
  profileIndex: number;
  requestIndex: number;
};
