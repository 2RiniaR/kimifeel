import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ContextModel } from "../context-model";
import { RequestService } from "../services/request-service";

export class IdentityRequest extends ContextModel {
  private readonly service = new RequestService(this);
  public readonly target: IdentityUser;
  public readonly id: string;

  public constructor(ctx: Context, props: RequestIdentifier) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
  }

  public async delete() {
    await this.service.delete();
  }
}

export type RequestIdentifier = {
  id: string;
  target: IdentityUser;
};
