import { Context } from "~/models/context";
import { Profile, ProfileIdentifier, ProfileProps } from "~/models/structures/profile";
import { ProfileDocument, ProfileDocumentPath } from "~/models/repositories/scheme";
import { IdentityUser } from "~/models/structures/user";
import { ProfileQueryResult } from "~/models/repositories/queries/profile";

function toIdentifier(context: Context, result: ProfileDocumentPath): ProfileIdentifier {
  return {
    id: result.profileId,
    target: new IdentityUser(context, { id: result.userId })
  };
}

function toProps(context: Context, doc: ProfileDocument): ProfileProps {
  return {
    content: doc.content,
    index: doc.index,
    author: new IdentityUser(context, { id: doc.authorUserId })
  };
}

export function buildProfile(context: Context, result: ProfileQueryResult): Profile {
  return new Profile(context, {
    ...toProps(context, result),
    ...toIdentifier(context, result)
  });
}
