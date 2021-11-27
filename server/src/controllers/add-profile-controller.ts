import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { AddProfileAction, AddProfileParams } from "~/discord/actions/add-profile-action";

export class AddProfileController extends Controller<AddProfileAction> {
  requireUsersDiscordId = (ctx: AddProfileParams) => [ctx.client];

  async action(ctx: AddProfileParams, client: ClientUser) {
    await client.user.addProfile({ content: ctx.content });
  }
}
