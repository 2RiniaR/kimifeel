import { ProfileBody, RequestBody, UserBody, UserStatsBody } from "app";
import { ClientBody } from "auth/endpoints";
import { Profile, Request, DiscordUser, DiscordUserIdentity, DiscordUserStats } from "../structures";

export function toProfile(body: ProfileBody): Profile {
  return {
    index: body.index,
    content: body.content,
    owner: toUser(body.owner),
    author: toUser(body.author)
  };
}

export function toRequest(body: RequestBody): Request {
  return {
    index: body.index,
    content: body.content,
    target: toUser(body.target),
    applicant: toUser(body.applicant)
  };
}

export function toUserIdentity(body: ClientBody): DiscordUserIdentity {
  return { id: body.clientId };
}

export function toUserStats(body: UserStatsBody): DiscordUserStats {
  return {
    id: body.discordId,
    ownedProfileCount: body.ownedProfileCount,
    selfProfileCount: body.selfProfileCount,
    writtenProfileCount: body.writtenProfileCount
  };
}

export function toUser(body: UserBody): DiscordUser {
  return {
    id: body.discordId,
    enableMention: body.enableMention
  };
}
