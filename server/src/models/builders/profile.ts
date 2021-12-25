import { Context } from "../context";
import { Profile, IdentityUser } from "../structures";
import { ProfileQueryResult } from "../../prisma";

export function buildProfile(context: Context, result: ProfileQueryResult): Profile {
  return new Profile(context, {
    id: result.id,
    owner: new IdentityUser(context, { id: result.ownerUser.id, discordId: result.ownerUser.discordId }),
    content: result.content,
    index: result.index,
    author: new IdentityUser(context, { id: result.authorUser.id, discordId: result.authorUser.discordId })
  });
}
