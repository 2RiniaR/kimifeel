import { IdentityUser } from "./user";
import { Context, ContextModel } from "../context";
import { ImaginaryProfileService, ProfileService } from "~/models/structures/services/profile-service";

export class IdentityProfile extends ContextModel implements ProfileIdentifier {
  private readonly service = new ProfileService(this);
  public readonly id: string;
  public readonly target: IdentityUser;

  public constructor(ctx: Context, props: ProfileIdentifier) {
    super(ctx);
    this.target = props.target;
    this.id = props.id;
  }

  public async delete() {
    await this.service.delete();
  }
}

export class Profile extends IdentityProfile implements ProfileProps {
  public author: IdentityUser;
  public content: string;
  public index: number;

  public constructor(ctx: Context, props: ProfileIdentifier & ProfileProps) {
    super(ctx, props);
    this.author = props.author;
    this.content = props.content;
    this.index = props.index;
  }
}

export class ImaginaryProfile extends ContextModel implements CreateProfileProps {
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

export type ProfileIdentifier = {
  id: string;
  target: IdentityUser;
};

export type ProfileProps = {
  content: string;
  author: IdentityUser;
  index: number;
};

export type CreateProfileProps = {
  user: IdentityUser;
  author: IdentityUser;
  content: string;
};
