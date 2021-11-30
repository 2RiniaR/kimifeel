import { IdentityUser } from "./identity-user";
import { Context } from "../context";
import { ContextModel } from "../context-model";
import { ImaginaryProfileService } from "../services/profile-service";

export class ImaginaryProfile extends ContextModel {
  private readonly service = new ImaginaryProfileService(this);
  public readonly user: IdentityUser;
  public readonly author: IdentityUser;
  public readonly content: string;

  public constructor(ctx: Context, props: CreateProfileProps) {
    super(ctx);
    this.user = props.user;
    this.author = props.author;
    this.content = props.content;
    this.validation();
  }

  private validation() {
    if (this.content.length > 100) throw Error();
  }

  public async create() {
    return await this.service.create();
  }
}

export type CreateProfileProps = {
  user: IdentityUser;
  author: IdentityUser;
  content: string;
};
