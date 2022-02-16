import { DiscordUser } from "./discord-user";

export interface RequestIdentity {
  index: number;
}

export interface Request extends RequestIdentity {
  content: string;
  target: DiscordUser;
  applicant: DiscordUser;
}
