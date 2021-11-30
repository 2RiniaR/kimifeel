import { Request } from "./request";
import { IdentityUser, UserIdentifier } from "./identity-user";
import { Context } from "../context";
import { ImaginaryProfile } from "./imaginary-profile";
import { ImaginaryRequest } from "./imaginary-request";
import { ForbiddenError } from "../errors";

export class User extends IdentityUser {
  public readonly discordId: string;

  public constructor(ctx: Context, props: UserIdentifier & UserProps) {
    super(ctx, props);
    this.discordId = props.discordId;
  }

  public async submitRequest(content: string): Promise<Request> {
    if (this.context.clientUser.id === this.id) {
      throw new ForbiddenError("Can not submit the request to self.");
    }
    const request = new ImaginaryRequest(this.context, {
      content,
      requester: this.context.clientUser.asUser(),
      user: this
    });
    return await request.create();
  }

  public async addProfile(content: string) {
    if (this.context.clientUser.id !== this.id) {
      throw new ForbiddenError("Can not add the profile to other user without requests.");
    }
    const profile = new ImaginaryProfile(this.context, {
      content,
      author: this,
      user: this
    });
    return await profile.create();
  }
}

export type UserProps = {
  discordId: string;
};
