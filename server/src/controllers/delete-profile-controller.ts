import { Controller } from "~/controller";
import { ClientUser } from "~/models";
import { DeleteProfileParams, DeleteProfileAction } from "~/discord/actions/delete-profile-action";

export class DeleteProfileController extends Controller<DeleteProfileAction> {
  async action(ctx: DeleteProfileParams, client: ClientUser) {
    const profile = await client.profiles.getByIndex(ctx.index);
    if (!profile) throw Error();
    await profile.delete();
  }
}
