import { findProfileById, searchProfiles, SearchProps } from "firestore/queries/profile-queries";
import { ContextModel } from "../context-model";
import { IdentityProfile, IdentityUser, Profile } from "../structures";
import { buildProfile } from "../builders/profile";

export class ProfileManager extends ContextModel {
  public async fetch(profile: IdentityProfile): Promise<Profile> {
    const result = await findProfileById(profile.target.id, profile.id);
    if (!result) {
      throw Error("Tried to fetch data, but it wasn't found.");
    }
    return buildProfile(this.context, result);
  }

  public async search(options: SearchOptions): Promise<Profile[]> {
    let props: SearchProps;
    const condition = {
      content: options.content,
      authorUserId: options.author?.id,
      ownerUserId: options.owner?.id
    };

    if (options.order === "random") {
      props = {
        order: options.order,
        ...condition
      };
    } else {
      props = {
        order: options.order,
        start: options.start,
        count: options.count,
        ...condition
      };
    }

    const results = await searchProfiles(props);
    return results.map((result) => buildProfile(this.context, result));
  }
}

export type SearchOptions = {
  content?: string;
  author?: IdentityUser;
  owner?: IdentityUser;
} & (
  | {
      order: "random";
    }
  | {
      order: "latest" | "oldest";
      start: number;
      count: number;
    }
);
