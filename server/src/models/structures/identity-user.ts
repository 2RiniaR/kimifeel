import { Context } from "../context";
import { ContextModel } from "../context-model";

export class IdentityUser extends ContextModel implements UserIdentifier {
  public readonly id: string;
  public readonly discordId: string;

  public constructor(ctx: Context, props: UserIdentifier) {
    super(ctx);
    this.id = props.id;
    this.discordId = props.discordId;
  }
}

export type UserIdentifier = {
  id: string;
  discordId: string;
};
