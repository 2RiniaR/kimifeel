import { ClientUser } from "~/models/context";
import { UserIdentifier, UserProps } from "~/models/structures/user";
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

export function buildClientUser(result: UserQueryResult): ClientUser {
  return new ClientUser({
    ...toProps(result),
    ...toIdentifier(result)
  });
}
