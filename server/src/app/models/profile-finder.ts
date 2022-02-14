import { ProfileRepository, ProfileUniqueField } from "data-store";
import { Context, ContextModel } from "./context";
import { InvalidParameterError, withConvertRepositoryErrors } from "./errors";
import { IdentityUser } from "./user";
import { Profile } from "./profile";

export type SearchOptions = {
  readonly order: "latest" | "oldest";
  readonly content?: string;
  readonly author?: IdentityUser;
  readonly owner?: IdentityUser;
  readonly start: number;
  readonly count: number;
};

export type RandomOptions = {
  readonly count: number;
  readonly content?: string;
  readonly author?: IdentityUser;
  readonly owner?: IdentityUser;
};

export class ProfileFinder implements ContextModel {
  private readonly service: ProfileFinderService;
  public readonly context: Context;

  public constructor(context: Context) {
    this.context = context;
    this.service = new ProfileFinderService(context);
  }

  public async find(unique: ProfileUniqueField): Promise<Profile | undefined> {
    return await this.service.find(unique);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    if (options.start < 0) {
      throw new InvalidParameterError<SearchOptions>("start", "larger than 0");
    }
    if (options.count < 0) {
      throw new InvalidParameterError<SearchOptions>("count", "larger than 0");
    }
    return await this.service.search(options);
  }

  public async random(options: RandomOptions): Promise<Profile[]> {
    if (options.count < 0) {
      throw new InvalidParameterError<RandomOptions>("count", "larger than 0");
    }
    return await this.service.random(options);
  }
}

class ProfileFinderService implements ContextModel {
  public readonly context: Context;

  public constructor(context: Context) {
    this.context = context;
  }

  public async find(unique: ProfileUniqueField): Promise<Profile | undefined> {
    const result = await withConvertRepositoryErrors.invoke(() => new ProfileRepository().find(unique));
    if (!result) return;
    return Profile.fromRaw(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    const results = await withConvertRepositoryErrors.invoke(() =>
      new ProfileRepository().search({
        order: options.order,
        start: options.start,
        count: options.count,
        authorUserId: options.author?.id,
        ownerUserId: options.owner?.id,
        content: options.content
      })
    );
    return results.map((result) => Profile.fromRaw(this.context, result));
  }

  public async random(options: RandomOptions): Promise<Profile[]> {
    const results = await withConvertRepositoryErrors.invoke(() =>
      new ProfileRepository().getRandom({
        count: options.count,
        authorUserId: options.author?.id,
        ownerUserId: options.owner?.id,
        content: options.content
      })
    );
    return results.map((result) => Profile.fromRaw(this.context, result));
  }
}
