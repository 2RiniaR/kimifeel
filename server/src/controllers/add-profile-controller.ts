import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { AddProfileSession, AddProfileParams } from "~/discord/actions/add-profile-action";

export class AddProfileController extends Controller<AddProfileSession> {
  requireUsersDiscordId = (ctx: AddProfileParams) => [ctx.client];

  async action(ctx: AddProfileParams, client: ClientUser) {
    await client.user.addProfile({ content: ctx.content });
  }
}
