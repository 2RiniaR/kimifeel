import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ContextModel } from "../context-model";

export class IdentityRequest extends ContextModel {
  public readonly id: string;
  public readonly target: IdentityUser;
  public readonly index: number;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
    this.index = props.index;
  }
}

export type RequestIdentifier = {
  id: string;
  target: IdentityUser;
  index: number;
};
