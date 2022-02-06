import { ContextModel } from "../context";
import { IdentityUser, Profile } from "../structures";
import { InvalidParameterError, withHandleRepositoryErrors } from "../errors";
import { ProfileRepository, ProfileUniqueField } from "../../../prisma";

export class ProfileManager extends ContextModel {
  private readonly service = new ProfileManagerService(this.context);

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

export type SearchOptions = {
  order: "latest" | "oldest";
  content?: string;
  author?: IdentityUser;
  owner?: IdentityUser;
  start: number;
  count: number;
};

export type RandomOptions = {
  count: number;
  content?: string;
  author?: IdentityUser;
  owner?: IdentityUser;
};

export class ProfileManagerService extends ContextModel {
  public async find(unique: ProfileUniqueField): Promise<Profile | undefined> {
    const result = await withHandleRepositoryErrors(() => new ProfileRepository().find(unique));
    if (!result) return;
    return Profile.fromRaw(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    const results = await withHandleRepositoryErrors(() =>
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
    const results = await withHandleRepositoryErrors(() =>
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
