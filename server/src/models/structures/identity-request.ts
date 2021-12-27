import { Context } from "../context";
import { ContextModel } from "../context-model";

export class IdentityRequest extends ContextModel {
  public readonly id: string;
  public readonly index: number;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.id = props.id;
    this.index = props.index;
  }
}

export type RequestIdentifier = {
  id: string;
  index: number;
};
