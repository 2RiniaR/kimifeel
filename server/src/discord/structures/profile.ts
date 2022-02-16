import { DiscordUser } from "./discord-user";

export interface ProfileIdentity {
  index: number;
}

export interface Profile extends ProfileIdentity {
  content: string;
  owner: DiscordUser;
  author: DiscordUser;
}
