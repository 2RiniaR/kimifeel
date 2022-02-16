import { ProfileRepository } from "data-store";
import { Context, ContextModel } from "./context";
import { ContentLengthLimitError, withConvertRepositoryErrors } from "./errors";
import { User } from "./user";
import { Profile } from "./profile";

export type CreateProfileProps = {
  readonly owner: User;
  readonly author: User;
  readonly content: string;
};

export class ImaginaryProfile implements ContextModel {
  private readonly service = new ImaginaryProfileService(this);

  public readonly owner: User;
  public readonly author: User;
  public readonly content: string;
  public static readonly MinContentLength = 1;
  public static readonly MaxContentLength = 200;

  public constructor(public readonly context: Context, props: CreateProfileProps) {
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

class ImaginaryProfileService implements ContextModel {
  public readonly context: Context;

  public constructor(private readonly profile: ImaginaryProfile) {
    this.context = profile.context;
  }

  public async create() {
    const result = await withConvertRepositoryErrors.invokeAsync(() =>
      new ProfileRepository().create({
        ownerUserId: this.profile.owner.id,
        authorUserId: this.profile.author.id,
        content: this.profile.content
      })
    );
    return Profile.fromRaw(this.context, result);
  }
}
