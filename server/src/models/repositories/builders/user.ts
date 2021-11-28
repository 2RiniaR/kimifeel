import { Context } from "~/models/context";
import { User, UserIdentifier, UserProps } from "~/models/structures/user";
import { UserDocument, UserDocumentPath } from "~/models/repositories/scheme";
import { UserQueryResult } from "~/models/repositories/queries/user";

function toIdentifier(result: UserDocumentPath): UserIdentifier {
  return {
    id: result.userId
  };
}

function toProps(doc: UserDocument): UserProps {
  return {
    discordId: doc.discordId
  };
}

export function buildUser(context: Context, result: UserQueryResult): User {
  return new User(context, {
    ...toProps(result),
    ...toIdentifier(result)
  });
}
