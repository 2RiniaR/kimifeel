import { Request } from "./request";
import { IdentityUser, UserIdentifier } from "./identity-user";
import { Context } from "../context";
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
}

export type UserProps = {
  discordId: string;
};
