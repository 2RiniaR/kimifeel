import { Context } from "../context";
import { Request, IdentityUser } from "../structures";
import * as db from "../../prisma";

export function buildRequest(context: Context, result: db.RequestQueryResult): Request {
  return new Request(context, {
    id: result.id,
    target: new IdentityUser(context, { id: result.targetUser.id, discordId: result.targetUser.discordId }),
    content: result.content,
    index: result.index,
    applicant: new IdentityUser(context, { id: result.applicantUser.id, discordId: result.applicantUser.discordId })
  });
}
