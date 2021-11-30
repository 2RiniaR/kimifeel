import { Controller } from "controller";
import { ProfileNotFoundActionError } from "discord/errors";
import { DeleteProfileAction, DeleteProfileParams } from "discord/actions";
import { ClientUser } from "models/structures";

export class DeleteProfileController extends Controller<DeleteProfileAction> {
  async action(ctx: DeleteProfileParams, client: ClientUser) {
    const profile = await client.profiles.getByIndex(ctx.index);
    if (!profile) throw new ProfileNotFoundActionError();
    await profile.delete();
  }
}
