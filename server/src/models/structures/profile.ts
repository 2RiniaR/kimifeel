import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { IdentityProfile, ProfileIdentifier } from "./identity-profile";
import { ForbiddenError } from "../errors";
import { ProfileService } from "../services";

export class Profile extends IdentityProfile {
  private readonly service = new ProfileService(this);
  public readonly content: string;
  public readonly owner: IdentityUser;
  public readonly author: IdentityUser;

  public constructor(ctx: Context, props: ProfileIdentifier & ProfileProps) {
    super(ctx, props);
    this.content = props.content;
    this.owner = props.owner;
    this.author = props.author;
  }

  public async delete(): Promise<Profile> {
    if (this.owner.id !== this.context.clientUser.id) {
      throw new ForbiddenError();
    }
    return await this.service.delete();
  }
}

export type ProfileProps = {
  content: string;
  owner: IdentityUser;
  author: IdentityUser;
};
