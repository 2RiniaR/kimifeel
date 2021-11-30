import { Controller } from "controller";
import { AddProfileAction, AddProfileParams } from "discord/actions";
import { ClientUser } from "models/structures";

export class AddProfileController extends Controller<AddProfileAction> {
  async action(ctx: AddProfileParams, client: ClientUser) {
    await client.asUser().addProfile(ctx.content);
  }
}
