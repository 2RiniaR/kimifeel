import { RawProfile, ProfileRepository } from "data-store";
import { Context, ContextModel } from "../context";
import { ForbiddenError, NotFoundError, withConvertRepositoryErrors } from "../errors";
import { User } from "./user";

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
  public readonly owner: User;
  public readonly author: User;

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

  public static fromRaw(context: Context, result: RawProfile): Profile {
    return new Profile(context, {
      id: result.id,
      owner: new User(context, {
        id: result.ownerUser.id,
        discordId: result.ownerUser.discordId,
        enableMention: result.ownerUser.enableMention
      }),
      content: result.content,
      index: result.index,
      author: new User(context, {
        id: result.authorUser.id,
        discordId: result.authorUser.discordId,
        enableMention: result.authorUser.enableMention
      })
    });
  }
}

export type ProfileProps = {
  content: string;
  owner: User;
  author: User;
};

class ProfileService extends ContextModel {
  private readonly profile: Profile;

  public constructor(profile: Profile) {
    super(profile.context);
    this.profile = profile;
  }

  public async delete(): Promise<Profile> {
    const result = await withConvertRepositoryErrors.invoke(() =>
      new ProfileRepository().delete({ id: this.profile.id })
    );
    if (!result) throw new NotFoundError();
    return Profile.fromRaw(this.context, result);
  }
}
