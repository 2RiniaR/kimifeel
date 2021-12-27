import { ContextModel } from "../context-model";
import { IdentityProfile, IdentityUser, Profile } from "../structures";
import { buildProfile } from "../builders/profile";
import { findProfileByIndex, randomProfiles, searchProfiles } from "../../prisma";

export class ProfileManager extends ContextModel {
  public async fetch(profile: IdentityProfile): Promise<Profile> {
    return this.findByIndex(profile.index);
  }

  public async findByIndex(index: number): Promise<Profile> {
    const result = await findProfileByIndex(index);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildProfile(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    const results = await searchProfiles({
      order: options.order,
      start: options.start,
      count: options.count,
      authorUserId: options.author?.id,
      ownerUserId: options.owner?.id,
      content: options.content
    });
    return results.map((result) => buildProfile(this.context, result));
  }

  public async random(options: RandomOptions): Promise<Profile[]> {
    const results = await randomProfiles({
      count: options.count,
      authorUserId: options.author?.id,
      ownerUserId: options.owner?.id,
      content: options.content
    });
    return results.map((result) => buildProfile(this.context, result));
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
