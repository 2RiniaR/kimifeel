import { ProfileRepository } from "data-store";
import { Context, ContextModel } from "../context";
import { ContentLengthLimitError, withConvertRepositoryErrors } from "../errors";
import { User } from "./user";
import { Profile } from "./profile";

export class ImaginaryProfile extends ContextModel {
  private readonly service = new ImaginaryProfileService(this);
  public readonly owner: User;
  public readonly author: User;
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
  owner: User;
  author: User;
  content: string;
};

class ImaginaryProfileService extends ContextModel {
  private readonly profile: ImaginaryProfile;

  public constructor(profile: ImaginaryProfile) {
    super(profile.context);
    this.profile = profile;
  }

  public async create() {
    const result = await withConvertRepositoryErrors.invoke(() =>
      new ProfileRepository().create({
        ownerUserId: this.profile.owner.id,
        authorUserId: this.profile.author.id,
        content: this.profile.content
      })
    );
    return Profile.fromRaw(this.context, result);
  }
}
