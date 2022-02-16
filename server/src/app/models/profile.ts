import { RawProfile, ProfileRepository } from "data-store";
import { Context, ContextModel } from "./context";
import { ForbiddenError, NotFoundError, withConvertRepositoryErrors } from "./errors";
import { User } from "./user";

export type ProfileIdentifier = {
  readonly id: string;
  readonly index: number;
};

export type ProfileProps = {
  readonly content: string;
  readonly owner: User;
  readonly author: User;
};

export interface IdentityProfile extends ContextModel, ProfileIdentifier {}

export class Profile implements IdentityProfile {
  private readonly service = new ProfileService(this);

  public readonly id: string;
  public readonly index: number;
  public readonly content: string;
  public readonly owner: User;
  public readonly author: User;

  public constructor(public readonly context: Context, props: ProfileIdentifier & ProfileProps) {
    this.id = props.id;
    this.index = props.index;
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

class ProfileService implements ContextModel {
  public readonly context: Context;

  public constructor(private readonly profile: Profile) {
    this.context = profile.context;
  }

  public async delete(): Promise<Profile> {
    const result = await withConvertRepositoryErrors.invokeAsync(() =>
      new ProfileRepository().delete({ id: this.profile.id })
    );
    if (result === undefined) throw new NotFoundError();
    return Profile.fromRaw(this.context, result);
  }
}
