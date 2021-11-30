import { Context } from "../context";
import { Request, IdentityUser } from "../structures";
import { RequestQueryResult } from "../queries/request";

export function buildRequest(context: Context, result: RequestQueryResult): Request {
  return new Request(context, {
    id: result.requestId,
    target: new IdentityUser(context, { id: result.userId }),
    content: result.content,
    index: result.index,
    requester: new IdentityUser(context, { id: result.requesterUserId })
  });
}
