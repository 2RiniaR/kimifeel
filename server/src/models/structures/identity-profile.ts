import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ProfileService } from "../services/profile-service";
import { ContextModel } from "../context-model";
import { ForbiddenError } from "../errors";

export class IdentityProfile extends ContextModel implements ProfileIdentifier {
  private readonly service = new ProfileService(this);
  public readonly id: string;
  public readonly target: IdentityUser;

  public constructor(ctx: Context, props: ProfileIdentifier) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
  }

  public async delete() {
    if (this.target.id !== this.context.clientUser.id) throw new ForbiddenError();
    await this.service.delete();
  }
}

export type ProfileIdentifier = {
  id: string;
  target: IdentityUser;
};
