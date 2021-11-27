import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { AddProfileAction, AddProfileParams } from "~/discord/actions/add-profile-action";

export class AddProfileController extends Controller<AddProfileAction> {
  requireUsersDiscordId = (ctx: AddProfileParams) => [ctx.client];

  async action(ctx: AddProfileParams, client: ClientUser) {
    console.log("controller-1");
    await client.user.addProfile({ content: ctx.content });
    console.log("controller-2");
  }
}
