import { Context } from "../context";
import { Profile, IdentityUser } from "../structures";
import { ProfileQueryResult } from "firestore/queries/profile-queries";

export function buildProfile(context: Context, result: ProfileQueryResult): Profile {
  return new Profile(context, {
    id: result.profileId,
    target: new IdentityUser(context, { id: result.userId }),
    content: result.content,
    index: result.index,
    author: new IdentityUser(context, { id: result.authorUserId })
  });
}
