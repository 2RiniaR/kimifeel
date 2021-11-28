import { Request } from "./request";
import { Profile } from "./profile";
import { Context, ContextModel } from "../context";
import { ForbiddenError } from "~/models/errors/forbidden-error";
import { UserService } from "~/models/structures/services/user-service";

export class User extends ContextModel implements UserIdentifier, Partial<UserProps> {
  private readonly service = new UserService(this);
  public readonly id: string;
  public discordId?: string;

  public constructor(ctx: Context, props: UserIdentifier & Partial<UserProps>) {
    super(ctx);
    this.id = props.id;
    this.setProps(props);
  }

  public setProps(props: Partial<UserProps>) {
    this.discordId = props.discordId;
  }

  public async fetch() {
    await this.service.fetch();
  }

  public async submitRequest(props: SubmitRequestProps): Promise<Request> {
    if (this.context.clientUser.id === this.id) throw new ForbiddenError();
    return await this.service.submitRequest(props);
  }

  public async addProfile(props: AddProfileProps) {
    if (this.context.clientUser.id !== this.id) throw new ForbiddenError();
    return await this.service.addProfile(props);
  }

  public async getProfiles(): Promise<Profile[]> {
    return await this.service.getProfiles();
  }
}

export type UserIdentifier = {
  id: string;
};

export type UserProps = {
  discordId: string;
};

export type SubmitRequestProps = {
  content: string;
};

export type AddProfileProps = {
  content: string;
};
