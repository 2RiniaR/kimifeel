import { ProfileBody, RequestBody, UserBody, UserStatsBody } from "../../app";
import { ProfileBodyView, RequestBodyView, UserBodyView, UserStatsBodyView } from "../views";

export function toProfileBodyView(body: ProfileBody): ProfileBodyView {
  return new ProfileBodyView(body.index, body.content, body.owner.discordId, body.author.discordId);
}

export function toRequestBodyView(body: RequestBody): RequestBodyView {
  return new RequestBodyView(body.index, body.content, body.target.discordId, body.applicant.discordId);
}

export function toUserBodyView(body: UserBody): UserBodyView {
  return new UserBodyView(body.discordId, body.enableMention);
}

export function toUserStatsBodyView(body: UserStatsBody): UserStatsBodyView {
  return new UserStatsBodyView(body.discordId, body.ownedProfileCount, body.selfProfileCount, body.writtenProfileCount);
}
