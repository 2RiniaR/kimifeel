import { Controller } from "controller";
import { ProfileNotFoundActionError } from "discord/errors";
import { DeleteProfileAction, DeleteProfileParams, DeleteProfileResult } from "discord/actions";
import { ClientUser } from "models/structures";

export class DeleteProfileController extends Controller<DeleteProfileAction> {
  async action(ctx: DeleteProfileParams, client: ClientUser): Promise<DeleteProfileResult> {
    const profile = await client.asUser().getProfileByIndex(ctx.index);
    if (!profile) throw new ProfileNotFoundActionError();
    const author = await client.users.fetch(profile.author);
    const result: DeleteProfileResult = {
      index: profile.index,
      content: profile.content,
      authorUserId: author.discordId
    };
    await profile.delete();
    return result;
  }
}
