import { Context } from "../context";
import { ContextModel } from "../context-model";

export class IdentityProfile extends ContextModel implements ProfileIdentifier {
  public readonly id: string;
  public readonly index: number;

  public constructor(ctx: Context, props: ProfileIdentifier) {
    super(ctx);
    this.id = props.id;
    this.index = props.index;
  }
}

export type ProfileIdentifier = {
  id: string;
  index: number;
};
