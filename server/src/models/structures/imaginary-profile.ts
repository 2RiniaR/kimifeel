import { Context } from "../context";
import { ContextModel } from "../context-model";
import { ContentLengthLimitError, DataAccessFailedError } from "../errors";
import * as db from "../../prisma";
import { buildProfile } from "../builders/profile";
import { IdentityUser } from "./user";

export class ImaginaryProfile extends ContextModel {
  private readonly service = new ImaginaryProfileService(this);
  public readonly owner: IdentityUser;
  public readonly author: IdentityUser;
  public readonly content: string;
  public static readonly MinContentLength = 1;
  public static readonly MaxContentLength = 200;

  public constructor(ctx: Context, props: CreateProfileProps) {
    super(ctx);
    this.owner = props.owner;
    this.author = props.author;
    this.content = props.content;
    this.validation();
  }

  private validation() {
    if (
      this.content.length < ImaginaryProfile.MinContentLength ||
      ImaginaryProfile.MaxContentLength < this.content.length
    ) {
      throw new ContentLengthLimitError(
        ImaginaryProfile.MinContentLength,
        ImaginaryProfile.MaxContentLength,
        this.content.length
      );
    }
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateProfileProps = {
  owner: IdentityUser;
  author: IdentityUser;
  content: string;
};

class ImaginaryProfileService extends ContextModel {
  private readonly profile: ImaginaryProfile;

  public constructor(profile: ImaginaryProfile) {
    super(profile.context);
    this.profile = profile;
  }

  public async create() {
    let result;
    try {
      result = await db.createProfile({
        ownerUserId: this.profile.owner.id,
        authorUserId: this.profile.author.id,
        content: this.profile.content
      });
    } catch (error) {
      if (error instanceof db.ConnectionError) {
        throw new DataAccessFailedError();
      }
      throw error;
    }

    return buildProfile(this.context, result);
  }
}
