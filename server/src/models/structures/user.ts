import { Request } from "~/models";
import { Profile } from "~/models";
import { Context, ContextModel } from "../context";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { ImaginaryUserService, UserService } from "~/models/structures/services/user-service";
import { ImaginaryProfile } from "~/models/structures/profile";
import { ImaginaryRequest } from "~/models/structures/request";

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

export class User extends IdentityUser implements UserProps {
  public discordId: string;

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

export class ImaginaryUser implements CreateUserProps {
  private readonly service = new ImaginaryUserService(this);
  public readonly discordId: string;

  public constructor(props: CreateUserProps) {
    this.discordId = props.discordId;
  }

  public async createIfNotExist() {
    return await this.service.createIfNotExist();
  }
}

export type UserIdentifier = {
  id: string;
};

export type UserProps = {
  discordId: string;
};

export type CreateUserProps = {
  discordId: string;
};
