import { Context } from "../context";
import { DataAccessFailedError, ForbiddenError, NotFoundError } from "../errors";
import * as db from "../../prisma";
import { ContextModel } from "../context-model";
import { buildProfile } from "../builders/profile";
import { IdentityUser } from "./user";

export class IdentityProfile extends ContextModel implements ProfileIdentifier {
  public readonly id: string;
  public readonly index: number;

  public constructor(ctx: Context, props: ProfileIdentifier) {
    super(ctx);
    this.id = props.id;
    this.index = props.index;
  }
}

export type ProfileIdentifier = {
  id: string;
  index: number;
};

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

class ProfileService extends ContextModel {
  private readonly profile: Profile;

  public constructor(profile: Profile) {
    super(profile.context);
    this.profile = profile;
  }

  public async delete(): Promise<Profile> {
    let result;
    try {
      result = await db.deleteProfileByIndex(this.profile.index);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) {
      throw new NotFoundError();
    }
    return buildProfile(this.context, result);
  }
}
