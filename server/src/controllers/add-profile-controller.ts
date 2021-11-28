import { Controller } from "~/controller";
import { ClientUser } from "~/models/context/client-user";
import { AddProfileParams, AddProfileAction } from "~/discord/actions/add-profile-action";

export class AddProfileController extends Controller<AddProfileAction> {
  async action(ctx: AddProfileParams, client: ClientUser) {
    await client.asUser().addProfile({ content: ctx.content });
  }
}
