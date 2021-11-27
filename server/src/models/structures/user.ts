import { ContextModel } from "../context/context-model";
import { Request } from "./request";
import { Profile } from "./profile";
import { Context } from "~/models/context/context";
import { NotFoundError } from "~/models/errors/not-found-error";
import { ForbiddenError } from "~/models/errors/forbidden-error";

export class User extends ContextModel implements UserIdentifier, Partial<UserProps> {
  public id: string;
  public discordId?: string;

  public constructor(ctx: Context, props: UserIdentifier & Partial<UserProps>) {
    super(ctx);
    this.id = props.id;
    this.setProps(props);
  }

  public setProps(props: Partial<UserProps>) {
    this.discordId = props.discordId;
  }

  private async fetch() {
    const clone = await this.repositories.users.getById(this.id);
    if (!clone) throw new NotFoundError();
    this.setProps(clone);
  }

  public async submitRequest(props: SubmitRequestProps): Promise<Request> {
    if (this.context.clientUser.id === this.id) throw new ForbiddenError();
    return await this.repositories.requests.create({
      target: this,
      content: props.content,
      requester: this.context.clientUser.user
    });
  }

  public async addProfile(props: AddProfileProps) {
    if (this.context.clientUser.id !== this.id) throw new ForbiddenError();
    await this.repositories.profiles.create({
      target: this,
      author: this,
      content: props.content
    });
  }

  public async getProfiles(): Promise<Profile[]> {
    return await this.repositories.profiles.getAll({ user: this });
  }
}

export type UserIdentifier = {
  id: string;
};

export type UserProps = {
  discordId: string;
};

type SubmitRequestProps = {
  content: string;
};

type AddProfileProps = {
  content: string;
};
