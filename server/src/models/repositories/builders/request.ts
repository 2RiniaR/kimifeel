import { Context } from "~/models/context";
import { Request, RequestIdentifier, RequestProps } from "~/models/structures/request";
import { RequestDocument, RequestDocumentPath } from "~/models/repositories/scheme";
import { IdentityUser } from "~/models/structures/user";
import { RequestQueryResult } from "~/models/repositories/queries/request";

function toIdentifier(context: Context, result: RequestDocumentPath): RequestIdentifier {
  return {
    id: result.requestId,
    target: new IdentityUser(context, { id: result.userId })
  };
}

function toProps(context: Context, doc: RequestDocument): RequestProps {
  return {
    content: doc.content,
    index: doc.index,
    requester: new IdentityUser(context, { id: doc.requesterUserId })
  };
}

export function buildRequest(context: Context, result: RequestQueryResult): Request {
  return new Request(context, {
    ...toProps(context, result),
    ...toIdentifier(context, result)
  });
}
