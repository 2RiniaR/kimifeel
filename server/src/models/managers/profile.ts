import { ContextModel } from "../context-model";
import { IdentityProfile, IdentityUser, Profile } from "../structures";
import { buildProfile } from "../builders/profile";
import { NotFoundError } from "../errors";
import * as db from "../../prisma";

export class ProfileManager extends ContextModel {
  public async fetch(profile: IdentityProfile): Promise<Profile> {
    const result = await db.findProfile(profile.id);
    if (!result) {
      throw new NotFoundError("Tried to fetch data, but it wasn't found.");
    }
    return buildProfile(this.context, result);
  }

  public async findByIndex(index: number): Promise<Profile | undefined> {
    const result = await db.findProfileByIndex(index);
    if (!result) return;
    return buildProfile(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    const results = await db.searchProfiles({
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
    const results = await db.randomProfiles({
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
