import { Context } from "../context";
import { ContextModel } from "../context-model";
import { UserService } from "../services/user-service";
import { Profile } from "./profile";

export class IdentityUser extends ContextModel implements UserIdentifier {
  private readonly service = new UserService(this);
  public readonly id: string;

  public constructor(ctx: Context, props: UserIdentifier) {
    super(ctx);
    this.id = props.id;
  }

  public async getProfiles(): Promise<Profile[]> {
    return await this.service.getProfiles();
  }
}

export type UserIdentifier = {
  id: string;
};
