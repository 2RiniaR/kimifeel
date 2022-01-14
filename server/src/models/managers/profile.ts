import { ContextModel } from "../context-model";
import { IdentityUser, Profile } from "../structures";
import { DataAccessFailedError, InvalidParameterError } from "../errors";
import * as db from "../../prisma";
import { buildProfile } from "../builders/profile";

export class ProfileManager extends ContextModel {
  private readonly service = new ProfileManagerService(this.context);

  public async findByIndex(index: number): Promise<Profile | undefined> {
    return await this.service.findByIndex(index);
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
  public async findByIndex(index: number): Promise<Profile | undefined> {
    let result;
    try {
      result = await db.findProfileByIndex(index);
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    if (!result) {
      return;
    }

    return buildProfile(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    let results;
    try {
      results = await db.searchProfiles({
        order: options.order,
        start: options.start,
        count: options.count,
        authorUserId: options.author?.id,
        ownerUserId: options.owner?.id,
        content: options.content
      });
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return results.map((result) => buildProfile(this.context, result));
  }

  public async random(options: RandomOptions): Promise<Profile[]> {
    let results;
    try {
      results = await db.randomProfiles({
        count: options.count,
        authorUserId: options.author?.id,
        ownerUserId: options.owner?.id,
        content: options.content
      });
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return results.map((result) => buildProfile(this.context, result));
  }
}
