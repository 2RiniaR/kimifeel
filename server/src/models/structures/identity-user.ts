import { Context } from "../context";
import { ContextModel } from "../context-model";
import { UserService } from "../services/user-service";
import { Profile } from "./profile";
import { Request } from "./request";

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

  public async getProfileByIndex(index: number): Promise<Profile | undefined> {
    return await this.service.getProfileByIndex(index);
  }

  public async getRequestByIndex(index: number): Promise<Request | undefined> {
    return await this.service.getRequestByIndex(index);
  }
}

export type UserIdentifier = {
  id: string;
};

export type GetProfilesProps = {

}
