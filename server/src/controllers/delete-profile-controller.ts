import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { DeleteProfileAction, DeleteProfileParams } from "~/discord/actions/delete-profile-action";

export class DeleteProfileController extends Controller<DeleteProfileAction> {
  requireUsersDiscordId = (ctx: DeleteProfileParams) => [ctx.client];

  async action(ctx: DeleteProfileParams, client: ClientUser) {
    const profile = await client.services.profiles.getByIndex(ctx.index);
    if (!profile) throw Error();
    console.log("delete?");
    await profile.delete();
  }
}
