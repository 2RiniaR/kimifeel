import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ProfileService } from "../services";
import { ContextModel } from "../context-model";
import { ForbiddenError } from "../errors";
import { Profile } from "./profile";

export class IdentityProfile extends ContextModel implements ProfileIdentifier {
  private readonly service = new ProfileService(this);
  public readonly id: string;
  public readonly owner: IdentityUser;
  public readonly index: number;

  public constructor(ctx: Context, props: ProfileIdentifier) {
    super(ctx);
    this.owner = props.owner;
    this.id = props.id;
    this.index = props.index;
  }

  public async delete(): Promise<Profile> {
    if (this.owner.id !== this.context.clientUser.id) {
      throw new ForbiddenError();
    }
    return await this.service.delete();
  }
}

export type ProfileIdentifier = {
  id: string;
  owner: IdentityUser;
  index: number;
};
